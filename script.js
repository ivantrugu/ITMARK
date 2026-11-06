/* =========================================================
   ITmark · Herramienta de diagnóstico — script.js (alternativa 2)
   1. Datos  2. Tema  3. Menú y scroll  4. Pestañas de áreas
   5. Cuestionario por áreas  6. Resultados y ventana emergente
   ========================================================= */
'use strict';
document.documentElement.classList.add('js');

/* ---------- 1. DATOS (criterios de la Matriz de Evaluación ITmark) ---------- */
const AREAS = ['Gestión de Negocio', 'Seguridad de la Información', 'Ingeniería de Software'];
const LEVELS = {
  basico:  { nombre: 'ITmark Básico',  previo: null },
  premium: { nombre: 'ITmark Premium', previo: 'basico' },
  elite:   { nombre: 'ITmark Elite',   previo: 'premium' }
};
// Umbrales de viabilidad (propuesta del equipo; coinciden con los niveles del proyecto)
const UMBRAL_GLOBAL = 70;   // % global para considerar la adopción viable
const UMBRAL_AREA = 50;     // % mínimo por área
const UMBRAL_MIN = 40;      // por debajo, la adopción aún no es viable

const questionsData = {
    basico: {
        "Gestión de Negocio": [
            { id: "RB11", text: "¿Los procesos administrativos y comerciales fundamentales están documentados?", ev: "Manuales de procedimientos o flujogramas básicos", i: 2, e: 2 },
            { id: "RB12", text: "¿La empresa tiene un organigrama formal con roles y responsabilidades claras?", ev: "Organigrama actualizado y perfiles de cargo", i: 2, e: 1 },
            { id: "RB13", text: "¿Se lleva un registro formal y controlado de ingresos, gastos y facturación?", ev: "Estados financieros básicos o reportes del sistema contable", i: 2, e: 2 },
            { id: "RB14", text: "¿Existe un proceso formal para el seguimiento de los clientes y la atención de solicitudes o quejas?", ev: "Registro de PQR, bitácora de soporte o herramienta CRM", i: 2, e: 2 },
            { id: "RB15", text: "¿La empresa tiene definidos por escrito su propósito y sus objetivos del año?", ev: "Plan o documento de objetivos", i: 2, e: 1 },
            { id: "RB16", text: "¿Los productos o servicios que ofrece están descritos, con sus condiciones y sus precios?", ev: "Portafolio o catálogo de servicios", i: 2, e: 1 },
            { id: "RB17", text: "¿Los acuerdos con los clientes, con su alcance, precio y plazos, se formalizan por escrito?", ev: "Contratos u órdenes de servicio firmados", i: 3, e: 1 },
            { id: "RB18", text: "¿La empresa conoce y tiene por escrito quiénes son sus principales clientes y competidores?", ev: "Listado o ficha de clientes y competidores", i: 1, e: 1 },
            { id: "RB19", text: "¿La dirección consulta un presupuesto o un flujo de caja para tomar decisiones?", ev: "Presupuesto anual o flujo de caja", i: 3, e: 2 },
            { id: "RB20", text: "¿Las obligaciones tributarias y laborales se cumplen conforme a un calendario de vencimientos?", ev: "Calendario de obligaciones y soportes de presentación", i: 3, e: 1 }
        ],
        "Seguridad de la Información": [
            { id: "RB01", text: "¿Los roles y las responsabilidades de seguridad de la información están definidos por escrito, con una persona o unidad responsable de gestionarla?", ev: "Manual de funciones o acta de asignación", i: 2, e: 1 },
            { id: "RB02", text: "¿Existe una política de seguridad de la información aprobada por la dirección y comunicada al personal?", ev: "Política firmada y registro de su comunicación", i: 3, e: 2 },
            { id: "RB03", text: "¿La empresa identifica la normativa que debe cumplir, en particular la de protección de datos personales, y cuenta con una política de tratamiento de datos?", ev: "Matriz de requisitos legales y política de tratamiento de datos", i: 3, e: 2 },
            { id: "RB04", text: "¿Hay un inventario de activos de información y de equipos, con un propietario asignado a cada activo?", ev: "Inventario actualizado", i: 2, e: 2 },
            { id: "RB05", text: "¿Existen reglas aplicadas para la creación, la complejidad y la rotación de las contraseñas, o se usa un segundo factor de autenticación?", ev: "Configuración de las cuentas y política de contraseñas", i: 3, e: 1 },
            { id: "RB06", text: "¿Se ejecutan y se guardan copias de respaldo periódicas de la información crítica?", ev: "Registro de las copias realizadas", i: 3, e: 1 },
            { id: "RB07", text: "¿El acceso físico a los servidores, a los cuartos de red y a las áreas críticas está controlado y restringido?", ev: "Lista de personas autorizadas, cerraduras o registro de entradas", i: 2, e: 1 },
            { id: "RB08", text: "¿Los equipos de cómputo de la empresa tienen protección contra software malicioso instalada, activa y actualizada?", ev: "Consola o informe de la protección", i: 3, e: 1 },
            { id: "RB09", text: "¿El personal nuevo recibe una inducción en seguridad de la información al ingresar?", ev: "Registro de asistencia a la inducción", i: 2, e: 1 },
            { id: "RB10", text: "¿Existe un procedimiento para reportar los incidentes de seguridad y el personal sabe a quién reportarlos?", ev: "Procedimiento documentado o canal publicado", i: 2, e: 1 }
        ],
        "Ingeniería de Software": [
            { id: "RB21", text: "¿Los requisitos del cliente se documentan y se aprueban antes de iniciar el desarrollo?", ev: "Especificación de requisitos firmada o historias de usuario aprobadas", i: 3, e: 2 },
            { id: "RB22", text: "¿Los proyectos se planifican con estimaciones documentadas de tiempo, costo y recursos?", ev: "Cronogramas o actas de inicio de proyecto", i: 3, e: 2 },
            { id: "RB23", text: "¿Existe control de versiones del código fuente y de la documentación técnica?", ev: "Repositorio de código y convenciones de versionado", i: 3, e: 1 },
            { id: "RB24", text: "¿Se realizan y documentan pruebas funcionales antes de entregar el producto al cliente?", ev: "Planes de prueba o actas de aceptación del usuario", i: 3, e: 2 },
            { id: "RB25", text: "¿Cada proyecto tiene un responsable y un equipo asignados?", ev: "Acta de inicio o asignación de roles del proyecto", i: 2, e: 1 },
            { id: "RB26", text: "¿Se compara el avance de cada proyecto con el plan y se registran las desviaciones?", ev: "Informes de avance o tablero del proyecto", i: 2, e: 2 },
            { id: "RB27", text: "¿Los cambios en los requisitos se registran y se aprueban antes de incorporarlos?", ev: "Registro de solicitudes de cambio", i: 2, e: 1 },
            { id: "RB28", text: "¿Los acuerdos con proveedores o terceros que participan en un proyecto, con su alcance y entregables, constan por escrito?", ev: "Contratos o acuerdos de servicio", i: 2, e: 1 },
            { id: "RB29", text: "¿Se registran datos básicos de cada proyecto, como las horas y las fechas reales de ejecución?", ev: "Registro de horas y fechas por proyecto", i: 2, e: 1 },
            { id: "RB30", text: "¿El producto se entrega al cliente con su documentación básica de uso o descripción técnica?", ev: "Manual de uso o ficha técnica entregada", i: 1, e: 1 }
        ]
    },
    premium: {
        "Gestión de Negocio": [
            { id: "RP11", text: "¿La dirección ha definido indicadores clave de desempeño de la empresa y les hace seguimiento regular?", ev: "Tablero de indicadores y actas de seguimiento", i: 3, e: 2 },
            { id: "RP12", text: "¿Los procesos están estandarizados, de modo que la forma de trabajar no varía de un equipo a otro?", ev: "Procedimientos estándar vigentes", i: 2, e: 3 },
            { id: "RP13", text: "¿Existe un plan de capacitación formal y recurrente, alineado con los objetivos de la empresa?", ev: "Plan de capacitación y registros de ejecución", i: 2, e: 2 },
            { id: "RP14", text: "¿Existe un plan estratégico vigente, con objetivos y responsables, que la dirección revisa periódicamente?", ev: "Plan estratégico y actas de revisión", i: 3, e: 2 },
            { id: "RP15", text: "¿La empresa identifica los riesgos del negocio (financieros, de clientes y de proveedores) y los revisa periódicamente?", ev: "Matriz de riesgos del negocio", i: 3, e: 2 },
            { id: "RP16", text: "¿Los proveedores críticos se seleccionan y se evalúan con criterios definidos?", ev: "Formato de evaluación de proveedores", i: 2, e: 2 },
            { id: "RP17", text: "¿Los cargos tienen perfiles definidos y el desempeño del personal se evalúa periódicamente?", ev: "Perfiles de cargo y formatos de evaluación", i: 2, e: 2 },
            { id: "RP18", text: "¿La empresa mide la satisfacción de sus clientes y revisa los resultados?", ev: "Encuestas de satisfacción y su análisis", i: 2, e: 2 },
            { id: "RP19", text: "¿El presupuesto se compara con la ejecución real y se analizan las desviaciones?", ev: "Informe de ejecución presupuestal", i: 2, e: 2 },
            { id: "RP20", text: "¿Los planes comerciales tienen metas y responsables definidos?", ev: "Plan comercial", i: 2, e: 2 }
        ],
        "Seguridad de la Información": [
            { id: "RP01", text: "¿La dirección aprueba un presupuesto para la seguridad de la información y deja constancia de ello?", ev: "Presupuesto o acta de aprobación", i: 3, e: 2 },
            { id: "RP02", text: "¿La gestión de la seguridad sigue un proceso estandarizado y documentado, con un responsable o comité designado, procedimientos y registros?", ev: "Procedimiento del proceso y actas del comité", i: 3, e: 3 },
            { id: "RP03", text: "¿Las políticas y los procedimientos de seguridad se revisan y se actualizan al menos una vez al año?", ev: "Políticas con control de versiones y fecha de revisión", i: 2, e: 1 },
            { id: "RP04", text: "¿Los activos de información están clasificados según su sensibilidad y etiquetados de acuerdo con esa clasificación?", ev: "Esquema de clasificación e inventario con la clasificación", i: 2, e: 2 },
            { id: "RP05", text: "¿Se elabora una matriz de riesgos de seguridad de la información, con un método definido, al menos una vez al año?", ev: "Matriz o informe de riesgos", i: 3, e: 3 },
            { id: "RP06", text: "¿Existe un plan de tratamiento de los riesgos altos y críticos, con responsables y plazos?", ev: "Plan de tratamiento de riesgos", i: 3, e: 2 },
            { id: "RP07", text: "¿Los derechos de acceso se revisan periódicamente y los accesos privilegiados están limitados y registrados?", ev: "Informe de revisión de accesos y lista de cuentas privilegiadas", i: 3, e: 2 },
            { id: "RP08", text: "¿Se revisan periódicamente las vulnerabilidades de la red y de los sistemas, y las actualizaciones y los hallazgos se atienden con una periodicidad definida?", ev: "Informe de revisión de vulnerabilidades y registro de actualizaciones", i: 3, e: 2 },
            { id: "RP09", text: "¿Existe un plan anual de formación y sensibilización en seguridad, con registro de asistencia?", ev: "Plan de formación y listas de asistencia", i: 2, e: 2 },
            { id: "RP10", text: "¿Las copias de respaldo se almacenan fuera del sitio principal y su restauración se prueba al menos una vez al año?", ev: "Registro de pruebas de restauración", i: 3, e: 2 }
        ],
        "Ingeniería de Software": [
            { id: "RP21", text: "¿La organización cuenta con procesos de desarrollo de software estandarizados que usan todos los proyectos?", ev: "Guía o procedimientos del proceso de desarrollo", i: 3, e: 3 },
            { id: "RP22", text: "¿Existe un rol o un proceso de aseguramiento de la calidad independiente del equipo que desarrolla?", ev: "Plan de calidad e informes de auditoría de calidad", i: 3, e: 3 },
            { id: "RP23", text: "¿Al cerrar los proyectos se recogen lecciones aprendidas y datos históricos para mejorar las estimaciones siguientes?", ev: "Informe de cierre y repositorio de lecciones", i: 2, e: 2 },
            { id: "RP24", text: "¿El avance de los proyectos se compara periódicamente con el plan y se toman acciones correctivas ante las desviaciones?", ev: "Informes de seguimiento y acciones correctivas", i: 3, e: 2 },
            { id: "RP25", text: "¿Se mantiene la trazabilidad entre los requisitos, el diseño, el código y las pruebas?", ev: "Matriz de trazabilidad", i: 2, e: 3 },
            { id: "RP26", text: "¿Se auditan periódicamente las líneas base de configuración para comprobar su integridad?", ev: "Informe de auditoría de configuración", i: 2, e: 2 },
            { id: "RP27", text: "¿Los proveedores de software o de servicios técnicos se seleccionan y se evalúan con criterios definidos?", ev: "Criterios y formatos de evaluación de proveedores", i: 2, e: 2 },
            { id: "RP28", text: "¿Se definen y se recogen indicadores de los proyectos, como el esfuerzo, los defectos y el cumplimiento del cronograma?", ev: "Tablero de indicadores de proyectos", i: 2, e: 2 },
            { id: "RP29", text: "¿Las pruebas se planifican con casos de prueba y criterios de aceptación acordados con el cliente?", ev: "Plan de pruebas con criterios de aceptación", i: 3, e: 2 },
            { id: "RP30", text: "¿Los riesgos de cada proyecto se identifican y se registran al planificarlo?", ev: "Registro de riesgos del proyecto", i: 2, e: 2 }
        ]
    },
    elite: {
        "Gestión de Negocio": [
            { id: "RE11", text: "¿La dirección usa datos históricos y análisis de tendencias para anticipar el comportamiento del negocio y tomar decisiones preventivas?", ev: "Informes de análisis de tendencias", i: 2, e: 3 },
            { id: "RE12", text: "¿Existe un proceso estructurado para fomentar la innovación y la mejora del modelo de negocio?", ev: "Procedimiento de innovación y registro de iniciativas", i: 2, e: 3 },
            { id: "RE13", text: "¿La empresa compara sus procesos con los de líderes del sector o con estándares reconocidos (evaluación comparativa)?", ev: "Informe de comparación con referentes", i: 2, e: 3 },
            { id: "RE14", text: "¿Se gestiona el conocimiento de la organización, con repositorios y lecciones aprendidas que se reutilizan entre proyectos y áreas?", ev: "Repositorio de conocimiento y registros de su uso", i: 2, e: 2 },
            { id: "RE15", text: "¿La planeación estratégica se revisa cada año con un análisis del entorno y se despliega en objetivos por área?", ev: "Plan estratégico revisado y objetivos por área", i: 3, e: 2 },
            { id: "RE16", text: "¿Los indicadores del negocio se reúnen en un tablero de control con metas, que la dirección revisa cada mes?", ev: "Tablero de control y actas mensuales", i: 3, e: 2 },
            { id: "RE17", text: "¿La empresa mide la fidelización de sus clientes y usa los resultados para mejorar sus servicios?", ev: "Informes de fidelización y planes de mejora", i: 2, e: 2 },
            { id: "RE18", text: "¿Existe un plan de desarrollo del talento y de relevo para los cargos clave?", ev: "Plan de desarrollo y de sucesión", i: 2, e: 3 },
            { id: "RE19", text: "¿Las alianzas y los proveedores críticos se gestionan con acuerdos de nivel de servicio que se miden?", ev: "Acuerdos de nivel de servicio y su seguimiento", i: 2, e: 2 },
            { id: "RE20", text: "¿La empresa evalúa el retorno de sus inversiones en tecnología y en mejora de procesos?", ev: "Análisis de costo y beneficio de las inversiones", i: 2, e: 3 }
        ],
        "Seguridad de la Información": [
            { id: "RE01", text: "¿La dirección revisa en intervalos planificados el desempeño del sistema de gestión de seguridad con indicadores (incidentes, tiempos de respuesta y cumplimiento de controles) y registra sus decisiones?", ev: "Actas de revisión por la dirección e informe de indicadores", i: 3, e: 2 },
            { id: "RE02", text: "¿La empresa opera un sistema de gestión de seguridad de la información con alcance, objetivos y responsables definidos?", ev: "Documento de alcance, objetivos y responsables del sistema", i: 3, e: 3 },
            { id: "RE03", text: "¿Se verifica periódicamente el cumplimiento de las políticas y de los requisitos legales y contractuales, y se registran los hallazgos?", ev: "Informe de auditoría interna o de verificación de cumplimiento", i: 3, e: 2 },
            { id: "RE04", text: "¿El tratamiento de riesgos se revisa cuando hay cambios importantes y se mantiene una declaración de aplicabilidad de los controles?", ev: "Declaración de aplicabilidad y registro de revisiones", i: 3, e: 3 },
            { id: "RE05", text: "¿La dirección acepta de manera formal los riesgos residuales?", ev: "Acta o formato de aceptación del riesgo residual", i: 2, e: 2 },
            { id: "RE06", text: "¿Los eventos de seguridad de los sistemas críticos se monitorean y se registran, y los registros se revisan?", ev: "Registros de eventos y evidencia de su revisión", i: 3, e: 3 },
            { id: "RE07", text: "¿Se evalúan la competencia del personal en seguridad y la eficacia de la formación impartida?", ev: "Evaluaciones de competencia y análisis de resultados de la formación", i: 2, e: 2 },
            { id: "RE08", text: "¿Los incidentes se registran, se clasifican y se analizan para identificar sus causas y evitar que se repitan?", ev: "Bitácora de incidentes y análisis de causas", i: 3, e: 2 },
            { id: "RE09", text: "¿Existe un plan de continuidad del negocio y de recuperación ante desastres que se prueba al menos una vez al año y cuyos resultados se registran?", ev: "Plan y acta de la última prueba", i: 3, e: 3 },
            { id: "RE10", text: "¿Las acciones correctivas derivadas de incidentes, auditorías y revisiones se registran, se ejecutan y se comprueba su eficacia?", ev: "Registro de acciones correctivas y su seguimiento", i: 3, e: 2 }
        ],
        "Ingeniería de Software": [
            { id: "RE21", text: "¿Los procesos de desarrollo se definen a nivel organizacional y se adaptan a cada proyecto mediante guías de adaptación?", ev: "Proceso organizacional y guías de adaptación", i: 3, e: 3 },
            { id: "RE22", text: "¿Los productos intermedios y finales se verifican con revisiones por pares o inspecciones frente a sus requisitos?", ev: "Actas de revisión por pares e informes de inspección", i: 3, e: 2 },
            { id: "RE23", text: "¿El producto se valida con usuarios representativos o en el entorno del cliente antes de la aceptación final?", ev: "Acta de validación con el usuario", i: 3, e: 2 },
            { id: "RE24", text: "¿Los riesgos de los proyectos se gestionan con un plan que se revisa y se actualiza durante la ejecución?", ev: "Plan y registro de gestión de riesgos", i: 3, e: 2 },
            { id: "RE25", text: "¿Las decisiones técnicas importantes se toman con un proceso formal de análisis de alternativas y criterios?", ev: "Registro de decisiones técnicas con sus alternativas", i: 2, e: 2 },
            { id: "RE26", text: "¿El diseño de la solución se documenta, se revisa y se integra con criterios definidos?", ev: "Documento de diseño y criterios de integración", i: 3, e: 3 },
            { id: "RE27", text: "¿Existe un programa de capacitación del personal técnico alineado con las necesidades de los procesos?", ev: "Programa de capacitación técnica", i: 2, e: 2 },
            { id: "RE28", text: "¿Los datos de los proyectos se reúnen en un repositorio de la organización y se usan para evaluar los procesos de desarrollo y ejecutar un plan de mejora?", ev: "Repositorio de datos de proyectos y plan de mejora de procesos", i: 3, e: 3 },
            { id: "RE29", text: "¿Los defectos del software se analizan para identificar sus causas y se corrige el proceso para evitar que se repitan?", ev: "Registro de defectos con análisis de causas", i: 3, e: 2 },
            { id: "RE30", text: "¿La empresa identifica e incorpora nuevas tecnologías o prácticas y mide el efecto que tienen en sus procesos técnicos?", ev: "Registro de iniciativas tecnológicas y de su efecto", i: 2, e: 3 }
        ]
    }
};

const AREA_UI = {   // nombre corto e icono de cada área en la interfaz
  'Gestión de Negocio':          { corto: 'Negocio',   icono: 'i-negocio',   clave: 'negocio' },
  'Seguridad de la Información': { corto: 'Seguridad', icono: 'i-seguridad', clave: 'seguridad' },
  'Ingeniería de Software':      { corto: 'Software',  icono: 'i-software',  clave: 'software' }
};
const respuestas = { basico: {}, premium: {}, elite: {} };   // respuestas guardadas por nivel (solo en memoria)
const ESTADOS = {
  ok:   { chip: 'chip-ok',   ring: 'ring-ok',   corto: 'Viable',                titulo: 'Adopción viable' },
  warn: { chip: 'chip-warn', ring: 'ring-warn', corto: 'Con condiciones',       titulo: 'Viable con condiciones' },
  bad:  { chip: 'chip-bad',  ring: 'ring-bad',  corto: 'Aún no viable',         titulo: 'Aún no es viable' }
};

const resultados = {};      // último resultado por nivel: { viable, estado, pct, global }
const dialogos = {};        // HTML de la última valoración por nivel, para volver a abrirla
const CLAVE_DATOS = 'itmark-diagnostico-v1';   // avance guardado solo en este navegador
let radar = null;
let ultimo = null;          // datos del último gráfico, para redibujar al cambiar de tema
let areaActiva = 0;         // índice del área visible en el cuestionario

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }
};
const nivelActual = () => $('input[name="nivel"]:checked').value;
const reducirMov = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const claseBarra = v => v < UMBRAL_AREA ? 'low' : v < UMBRAL_GLOBAL ? 'mid' : '';

/* Aviso breve en pantalla (toast) */
let toastT = 0;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2800);
}

/* Persistencia local del avance (no sale del navegador) */
function guardar() {
  const evaluados = {};
  Object.keys(resultados).forEach(n => { evaluados[n] = { stale: !!resultados[n].stale }; });
  store.set(CLAVE_DATOS, JSON.stringify({ v: 1, nivel: nivelActual(), respuestas, evaluados }));
  const s = $('#save-status');
  s.classList.remove('flash'); void s.offsetWidth; s.classList.add('flash');
}
function restaurar() {
  let d = null;
  try { d = JSON.parse(store.get(CLAVE_DATOS) || 'null'); } catch (e) { d = null; }
  if (!d || typeof d.respuestas !== 'object') return;
  Object.keys(LEVELS).forEach(n => {
    const r = d.respuestas[n];
    if (r && typeof r === 'object') Object.entries(r).forEach(([id, v]) => { if (['1', '0.5', '0'].includes(v)) respuestas[n][id] = v; });
  });
  // En orden Básico → Premium → Elite: el aviso de cada nivel depende del anterior
  Object.keys(LEVELS).forEach(n => {
    if (d.evaluados && d.evaluados[n] && registrarResultado(n) && d.evaluados[n].stale) resultados[n].stale = true;
    marcarSelector(n);
  });
  if (d.nivel && LEVELS[d.nivel]) $(`input[name="nivel"][value="${d.nivel}"]`).checked = true;
  const total = Object.values(respuestas).reduce((s, r) => s + Object.keys(r).length, 0);
  if (total) setTimeout(() => toast('Recuperamos tu avance anterior.'), 600);
}

/* ---------- 2. MODO OSCURO / CLARO ---------- */
function aplicarTema(t) {
  document.documentElement.setAttribute('data-theme', t);
  $$('meta[name="theme-color"]').forEach(m => m.setAttribute('content', t === 'dark' ? '#0a0f19' : '#f6f8fb'));
  const b = $('#theme-toggle');
  b.setAttribute('aria-pressed', String(t === 'dark'));
  b.setAttribute('aria-label', t === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  dibujarRadar(ultimo || { pct: [0, 0, 0] });
}
function iniciarTema() {
  const guardado = store.get('itmark-tema');
  const sistema = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  aplicarTema(guardado || sistema);
  $('#theme-toggle').addEventListener('click', () => {
    const nuevo = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    store.set('itmark-tema', nuevo);
    aplicarTema(nuevo);
  });
}

/* ---------- 3. MENÚ MÓVIL, SCROLL SUAVE, ANIMACIÓN Y NAV ACTIVA ---------- */
function irA(el, extra = 12) {
  const h = $('.site-header').offsetHeight;
  const y = el.getBoundingClientRect().top + window.scrollY - h - extra;
  window.scrollTo({ top: y, behavior: reducirMov() ? 'auto' : 'smooth' });
}
function iniciarNavegacion() {
  const nav = $('#main-nav'), btn = $('#menu-toggle');
  const cerrar = () => { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-label', 'Abrir menú'); };
  btn.addEventListener('click', () => {
    const abierto = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(abierto));
    btn.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
  });
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const dest = $(a.getAttribute('href'));
    if (!dest) return;
    e.preventDefault();
    cerrar();
    irA(dest);
  }));
  // El menú móvil se cierra con Escape o al tocar fuera
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { cerrar(); btn.focus(); } });
  document.addEventListener('click', e => { if (nav.classList.contains('open') && !nav.contains(e.target) && !btn.contains(e.target)) cerrar(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 760) cerrar(); });

  // Botón «volver arriba»
  const arriba = $('#to-top');
  arriba.hidden = false;
  const alScroll = () => arriba.classList.toggle('show', window.scrollY > 700);
  window.addEventListener('scroll', alScroll, { passive: true }); alScroll();
  // En móvil se oculta sobre el cuestionario para no tapar los botones de respuesta
  if ('IntersectionObserver' in window) new IntersectionObserver(([i]) => arriba.classList.toggle('over-form', i.isIntersecting)).observe($('.form-card'));
  arriba.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: reducirMov() ? 'auto' : 'smooth' }); $('.brand').focus({ preventScroll: true }); });

  if (!('IntersectionObserver' in window)) { $$('.reveal').forEach(el => el.classList.add('is-visible')); return; }
  // Aparición al hacer scroll (umbral 0: las tarjetas altas aparecen al entrar en pantalla)
  const ioReveal = new IntersectionObserver((items) => items.forEach(i => {
    if (i.isIntersecting) { i.target.classList.add('is-visible'); ioReveal.unobserve(i.target); }
  }), { threshold: 0, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal').forEach((el, n) => { el.style.transitionDelay = (n % 3) * 80 + 'ms'; ioReveal.observe(el); });
  // Enlace activo según la sección visible
  const enlaces = $$('.nav-link');
  const ioNav = new IntersectionObserver((items) => items.forEach(i => {
    if (i.isIntersecting) enlaces.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + i.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => ioNav.observe(s));
}

/* ---------- 4. EXPLORADOR DE ÁREAS (pestañas accesibles) ---------- */
function iniciarPestanas(lista, alActivar) {
  const tabs = $$('[role="tab"]', lista);
  const activar = (i, foco) => {
    tabs.forEach((t, n) => { t.setAttribute('aria-selected', String(n === i)); t.tabIndex = n === i ? 0 : -1; });
    if (foco) tabs[i].focus();
    alActivar(i);
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(i));
    t.addEventListener('keydown', e => {
      const mov = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (mov) { e.preventDefault(); activar((i + mov + tabs.length) % tabs.length, true); }
      if (e.key === 'Home') { e.preventDefault(); activar(0, true); }
      if (e.key === 'End') { e.preventDefault(); activar(tabs.length - 1, true); }
    });
  });
  return activar;
}
function iniciarAreas() {
  const panels = $$('#area-explorer [role="tabpanel"]');
  iniciarPestanas($('#area-explorer .area-tabs'), i => panels.forEach((p, n) => { p.hidden = n !== i; }));
}

/* ---------- 5. CUESTIONARIO ---------- */
let activarAreaCuestionario = () => {};
function cargarPreguntas() {
  const nivel = nivelActual();
  const cont = $('#questions-container'), tabs = $('#q-tabs');
  cont.innerHTML = ''; tabs.innerHTML = '';
  let n = 0;
  Object.entries(questionsData[nivel]).forEach(([area, preguntas], a) => {
    const ui = AREA_UI[area];
    // Pestaña del área
    tabs.insertAdjacentHTML('beforeend',
      `<button type="button" class="q-tab" data-area="${ui.clave}" role="tab" id="qtab-${a}" aria-controls="qpanel-${a}" aria-selected="${a === 0}" tabindex="${a === 0 ? 0 : -1}">
         <svg class="icon" aria-hidden="true"><use href="#${ui.icono}"/></svg>
         <span class="q-tab-name">${ui.corto}</span>
         <span class="q-tab-count">0/${preguntas.length}</span>
         <span class="q-tab-bar" aria-hidden="true"><i></i></span>
       </button>`);
    // Grupo de preguntas del área
    const grupo = document.createElement('fieldset');
    grupo.className = 'area-group'; grupo.id = 'qpanel-' + a; grupo.dataset.area = ui.clave;
    grupo.setAttribute('role', 'tabpanel'); grupo.setAttribute('aria-labelledby', 'qtab-' + a);
    grupo.hidden = a !== 0;
    grupo.innerHTML = `<legend class="sr-only">${area}</legend>`;
    preguntas.forEach(q => {
      n++;
      const item = document.createElement('div');
      item.className = 'question-item'; item.dataset.id = q.id;
      const cuerpo = document.createElement('div');
      cuerpo.className = 'q-body';
      const txt = document.createElement('div');
      txt.className = 'question-text'; txt.id = 'qt-' + q.id;
      txt.innerHTML = `<span class="q-id" title="Pregunta ${n} de 30">${q.id}</span>`;
      txt.append(q.text);
      const ev = document.createElement('div');
      ev.className = 'question-evidence';
      ev.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-doc"/></svg>';
      const evTxt = document.createElement('span'); evTxt.textContent = 'Evidencia esperada: ' + q.ev; ev.appendChild(evTxt);
      const op = document.createElement('div');
      op.className = 'options'; op.setAttribute('role', 'radiogroup'); op.setAttribute('aria-labelledby', 'qt-' + q.id);
      [['1', 'Sí', 'si'], ['0.5', 'Parcial', 'parcial'], ['0', 'No', 'no']].forEach(([v, t, c]) => {
        op.insertAdjacentHTML('beforeend', `<label class="opt opt-${c}"><input type="radio" name="${q.id}" value="${v}"><span>${t}</span></label>`);
      });
      cuerpo.append(txt, ev);
      item.append(cuerpo, op); grupo.appendChild(item);
    });
    cont.appendChild(grupo);
  });
  // Recupera las respuestas que ya se habían dado en este nivel
  Object.entries(respuestas[nivel]).forEach(([id, v]) => {
    const r = $(`input[name="${id}"][value="${v}"]`, cont);
    if (r) { r.checked = true; r.closest('.question-item').dataset.ans = v; }
  });
  $$('input[type=radio]', cont).forEach(r => r.addEventListener('change', () => {
    const item = r.closest('.question-item');
    item.classList.remove('missing'); item.dataset.ans = r.value;
    respuestas[nivel][r.name] = r.value;
    if (resultados[nivel] && !resultados[nivel].stale) { resultados[nivel].stale = true; pintarPanel(nivel); }
    progreso();
    guardar();
  }));
  const lv = $(`input[name="nivel"][value="${nivel}"]`);
  $('.diag-grid').dataset.level = nivel;
  $('#level-name').textContent = LEVELS[nivel].nombre;
  $('#level-n').textContent = lv.closest('.lp').querySelector('.lp-n').textContent;
  const grupos = $$('.area-group', cont);
  activarAreaCuestionario = iniciarPestanas(tabs, i => {
    areaActiva = i;
    grupos.forEach((g, k) => { g.hidden = k !== i; });
    botonesArea();
  });
  areaActiva = 0; botonesArea();
  progreso();
  mostrarResultadoGuardado(nivel);
}
function cambiarArea(i, desplazar = true) {
  activarAreaCuestionario(i);
  if (desplazar) {
    const card = $('.form-card');
    if (card.getBoundingClientRect().top < $('.site-header').offsetHeight) irA(card);
  }
}
function botonesArea() {
  const ultima = areaActiva === 2;
  const items = $$('.question-item');
  const completo = items.length > 0 && items.every(i => $('input:checked', i));
  const grupo = $$('.area-group')[areaActiva];
  const areaLista = !!grupo && $$('.question-item', grupo).every(i => $('input:checked', i));
  const next = $('#next-area'), submit = $('#submit-btn');
  $('#prev-area').hidden = areaActiva === 0;
  next.hidden = ultima;
  submit.hidden = !(ultima || completo);   // con todo respondido se puede generar desde cualquier área
  if (!ultima) $('#next-label').textContent = 'Siguiente: ' + AREA_UI[AREAS[areaActiva + 1]].corto;
  next.classList.toggle('is-ready', areaLista && !completo);
  submit.classList.toggle('is-ready', completo);
}
function progreso() {
  const items = $$('.question-item');
  const total = items.length;
  const hechas = items.filter(i => $('input:checked', i)).length;
  const p = total ? Math.round(hechas / total * 100) : 0;
  $('#progress-text').textContent = `${hechas} de ${total}`;
  $('#progress-pct').textContent = p + ' %';
  $('#progress-bar').style.width = p + '%';
  // Contador por área
  $$('.area-group').forEach((g, a) => {
    const its = $$('.question-item', g), ok = its.filter(i => $('input:checked', i)).length;
    const tab = $('#qtab-' + a);
    $('.q-tab-count', tab).textContent = `${ok}/${its.length}`;
    $('.q-tab-bar > i', tab).style.width = (ok / its.length * 100) + '%';
    tab.classList.toggle('done', ok === its.length);
    tab.classList.toggle('has-missing', its.some(i => i.classList.contains('missing')));
  });
  botonesArea();
}

/* ---------- 6. RESULTADOS, GRÁFICO Y VENTANA EMERGENTE ---------- */
function dibujarRadar(datos) {
  const canvas = $('#radarChart');
  if (typeof Chart === 'undefined') { canvas.parentElement.style.display = 'none'; return; }   // sin Chart.js: solo barras/resumen
  const css = getComputedStyle(document.documentElement);
  const c = n => css.getPropertyValue(n).trim();
  if (radar) radar.destroy();
  radar = new Chart(canvas.getContext('2d'), {
    type: 'radar',
    data: { labels: ['Negocio', 'Seguridad', 'Software'], datasets: [{ data: datos.pct, backgroundColor: c('--color-primary') + '33', borderColor: c('--color-primary'), borderWidth: 2, pointBackgroundColor: c('--color-primary'), pointBorderColor: c('--surface'), pointBorderWidth: 2, pointRadius: 5 }] },
    options: {
      scales: { r: { min: 0, max: 100, ticks: { stepSize: 25, backdropColor: 'transparent', color: c('--muted'), font: { size: 10 }, callback: v => v + '%' }, grid: { color: c('--border') }, angleLines: { color: c('--border') }, pointLabels: { color: c('--text'), font: { size: 13, weight: '600' } } } },
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ' ' + ctx.raw + '%' } } }, animation: { duration: reducirMov() ? 0 : 600 }
    }
  });
}

function evaluar(pct, global, nivel) {
  const minArea = Math.min(...pct);
  let estado = global >= UMBRAL_GLOBAL && minArea >= UMBRAL_AREA ? 'ok' : global >= UMBRAL_MIN ? 'warn' : 'bad';
  const previo = LEVELS[nivel].previo;
  const avisos = [];
  if (previo && !(resultados[previo] && resultados[previo].viable)) {
    avisos.push(resultados[previo]
      ? `El nivel anterior (${LEVELS[previo].nombre}) todavía no resultó viable en tu diagnóstico. Cada nivel se construye sobre el anterior.`
      : `Aún no has verificado el nivel anterior (${LEVELS[previo].nombre}). Cada nivel se construye sobre el anterior; evalúalo primero.`);
    if (estado === 'ok') estado = 'warn';
  }
  return { estado, avisos };
}

function calcular(e) {
  e.preventDefault();
  const nivel = nivelActual();
  const faltan = $$('.question-item').filter(i => !$('input:checked', i));
  $$('.question-item').forEach(i => i.classList.toggle('missing', faltan.includes(i)));
  progreso();
  if (faltan.length) {
    // Lleva a la primera área con preguntas pendientes
    const grupo = faltan[0].closest('.area-group');
    cambiarArea($$('.area-group').indexOf(grupo), false);
    const porArea = $$('.area-group').map((g, a) => [AREA_UI[Object.keys(questionsData[nivel])[a]].corto, $$('.question-item.missing', g).length]).filter(x => x[1]);
    abrirDialogo(`<h2 id="dialog-title">Faltan respuestas</h2>
      <p>Responde las ${faltan.length} preguntas marcadas en rojo para poder valorar la adopción del nivel <strong>${LEVELS[nivel].nombre}</strong>.</p>
      <div class="gap-meta">${porArea.map(([a, k]) => `<span class="chip chip-bad">${a}: ${k}</span>`).join('')}</div>`, 'info');
    $('#result-dialog').addEventListener('close', () => {
      faltan[0].scrollIntoView({ behavior: reducirMov() ? 'auto' : 'smooth', block: 'center' });
      const r = $('input', faltan[0]); if (r) r.focus({ preventScroll: true });
    }, { once: true });
    return;
  }
  registrarResultado(nivel);
  pintarPanel(nivel);
  marcarSelector(nivel);
  guardar();
  abrirDialogo(dialogos[nivel], 'resultado');
}

/* Calcula el resultado a partir de las respuestas guardadas; null si faltan respuestas */
function computar(nivel) {
  const acum = {}, huecos = [];
  for (const [area, preguntas] of Object.entries(questionsData[nivel])) {
    acum[area] = { s: 0, m: 0 };
    for (const q of preguntas) {
      const raw = respuestas[nivel][q.id];
      if (raw === undefined) return null;
      const v = parseFloat(raw);
      acum[area].s += v; acum[area].m += 1;
      if (v < 1) huecos.push({ v, t: q.text, p: q.i / q.e, area, ev: q.ev, id: q.id });
    }
  }
  const pct = AREAS.map(a => Math.round(acum[a].s / acum[a].m * 100));
  const total = AREAS.reduce((s, a) => s + acum[a].s, 0), max = AREAS.reduce((s, a) => s + acum[a].m, 0);
  return { pct, global: Math.round(total / max * 100), huecos };
}
function registrarResultado(nivel) {
  const c = computar(nivel);
  if (!c) return false;
  const { estado, avisos } = evaluar(c.pct, c.global, nivel);
  resultados[nivel] = { viable: estado === 'ok', estado, pct: c.pct, global: c.global, avisos };
  dialogos[nivel] = htmlVeredicto({ nivel, estado, pct: c.pct, global: c.global, avisos, huecos: c.huecos });
  return true;
}

function barrasArea(pct) {
  return AREAS.map((a, i) => `<div class="mini-row"><span>${a}</span><b>${pct[i]}%</b><div class="bar"><span class="${claseBarra(pct[i])}" style="width:${pct[i]}%"></span></div></div>`).join('');
}
function pintarPanel(nivel) {
  const r = resultados[nivel];
  const chip = $('#result-chip'), top = $('#result-top'), ring = $('#result-ring');
  $('#radar-block').hidden = !r;
  if (!r) {
    ultimo = null; dibujarRadar({ pct: [0, 0, 0] });
    chip.hidden = true; top.hidden = true; $('#reopen-btn').hidden = true;
    $('#results-summary').innerHTML = `<div class="empty-state">
      <p>Responde las 30 preguntas de <strong>${LEVELS[nivel].nombre}</strong> para ver tu resultado.</p>
      <div class="legend">
        <span><i class="l-ok"></i><span><b>Viable:</b> global de ${UMBRAL_GLOBAL} % o más y ninguna área bajo ${UMBRAL_AREA} %.</span></span>
        <span><i class="l-warn"></i><span><b>Con condiciones:</b> global de ${UMBRAL_MIN} % a ${UMBRAL_GLOBAL - 1} %, o un área bajo ${UMBRAL_AREA} %.</span></span>
        <span><i class="l-bad"></i><span><b>Aún no viable:</b> global menor al ${UMBRAL_MIN} %.</span></span>
      </div></div>`;
    return;
  }
  const est = ESTADOS[r.estado];
  chip.hidden = false; chip.className = 'chip ' + est.chip; chip.textContent = est.corto;
  top.hidden = false;
  ring.className = 'ring ' + est.ring; ring.style.setProperty('--p', r.global);
  $('#result-global').textContent = r.global + '%';
  $('#result-line').innerHTML = `<strong>${est.titulo}</strong><span>Madurez global para ${LEVELS[nivel].nombre}. Se espera ${UMBRAL_GLOBAL} % global y ${UMBRAL_AREA} % por área.</span>`;
  ultimo = { pct: r.pct }; dibujarRadar(ultimo);
  $('#results-summary').innerHTML = (r.stale ? `<p class="stale">Cambiaste respuestas después del diagnóstico. Genéralo de nuevo para actualizar este resultado.</p>` : '')
    + (r.avisos && r.avisos.length ? r.avisos.map(a => `<p class="panel-note">${a}</p>`).join('') : '')
    + barrasArea(r.pct) + `<p class="bar-hint">La marca en cada barra indica el mínimo del ${UMBRAL_AREA} % por área.</p>`;
  $('#reopen-btn').hidden = !dialogos[nivel];
}
function marcarSelector(nivel) {
  const r = resultados[nivel], el = $(`.lp-state[data-state="${nivel}"]`);
  el.className = 'lp-state ' + (r ? r.estado : '');
  el.textContent = r ? `${ESTADOS[r.estado].corto} · ${r.global} %` : 'Sin evaluar';
}
function mostrarResultadoGuardado(nivel) { pintarPanel(nivel); }

function htmlVeredicto({ nivel, estado, pct, global, avisos, huecos }) {
  const nombre = LEVELS[nivel].nombre;
  const est = ESTADOS[estado];
  const texto = {
    ok:   `Tu empresa cumple los criterios para iniciar el proceso de adopción de <strong>${nombre}</strong>: el cumplimiento global es del ${global}% y ninguna área baja del ${UMBRAL_AREA}%.`,
    warn: `La adopción de <strong>${nombre}</strong> es posible, pero antes conviene cerrar las brechas señaladas. Se espera al menos ${UMBRAL_GLOBAL}% global y ${UMBRAL_AREA}% por área.`,
    bad:  `Con un ${global}% global, todavía no es recomendable aspirar a <strong>${nombre}</strong>. Primero construye las bases de las áreas con menor cumplimiento.`
  }[estado];
  const lista = huecos.sort((x, y) => x.v - y.v || y.p - x.p).slice(0, 5).map(h => `
    <li><div class="gap-meta"><span class="chip">${AREA_UI[h.area].corto}</span><span class="chip ${h.v === 0 ? 'chip-bad' : 'chip-warn'}">${h.v === 0 ? 'No' : 'Parcial'}</span></div>
    <span>${h.t.replace(/^¿|\?$/g, '')}</span>
    <span class="gap-ev">Evidencia: ${h.ev}</span></li>`).join('');
  const html = `
    <h2 id="dialog-title">Resultado para ${nombre}</h2>
    <div class="verdict ${estado}">
      <div class="ring ${est.ring}" style="--p:${global}"><span><b>${global}%</b><small>global</small></span></div>
      <div><strong>${est.titulo}</strong><p>${texto}</p></div>
    </div>
    ${avisos.map(a => `<div class="alert"><span>${a}</span></div>`).join('')}
    <h3>Cumplimiento por área</h3><div class="dlg-bars">${barrasArea(pct)}</div>
    ${lista ? `<h3>Primeras brechas a atender</h3><ol class="gaps">${lista}</ol>` : '<p>No se detectaron brechas en este nivel.</p>'}
    <p class="dialog-note">Las brechas se ordenan primero por respuesta («No» antes que «Parcial») y luego por prioridad (impacto / esfuerzo). Valoración orientativa con criterios propuestos por el equipo del proyecto; no reemplaza la evaluación de un organismo certificador.</p>`;
  return html;
}

/* modo: 'resultado' (imprimible), 'info' o 'confirmar' (con botón de confirmación) */
function abrirDialogo(html, modo = 'info') {
  const d = $('#result-dialog');
  $('#dialog-body').innerHTML = html;
  $('#print-btn').hidden = modo !== 'resultado';
  $('#confirm-btn').hidden = modo !== 'confirmar';
  $('#dialog-ok').textContent = modo === 'confirmar' ? 'Cancelar' : 'Entendido';
  $('#dialog-ok').className = 'btn ' + (modo === 'confirmar' ? 'btn-ghost' : 'btn-primary');
  if (typeof d.showModal === 'function') {
    if (!d.open) d.showModal();
    $('#dialog-ok').focus({ preventScroll: true });   // en «confirmar» el foco queda en «Cancelar», la opción segura
    d.scrollTop = 0;
  } else if (modo === 'confirmar') {
    if (window.confirm($('#dialog-body').innerText)) $('#confirm-btn').click();
  } else alert($('#dialog-body').innerText);        // respaldo para navegadores sin <dialog>
}
function limpiarNivel() {
  const nivel = nivelActual();
  delete resultados[nivel];
  delete dialogos[nivel];
  respuestas[nivel] = {};
  marcarSelector(nivel);
  cargarPreguntas();
  guardar();
  toast(`Respuestas de ${LEVELS[nivel].nombre} borradas.`);
}
function imprimir() {
  document.body.classList.add('print-result');
  window.addEventListener('afterprint', () => document.body.classList.remove('print-result'), { once: true });
  window.print();
}

/* ---------- INICIO ---------- */
document.addEventListener('DOMContentLoaded', () => {
  iniciarTema(); iniciarNavegacion(); iniciarAreas();
  restaurar();
  $$('input[name="nivel"]').forEach(r => r.addEventListener('change', () => { cargarPreguntas(); guardar(); }));
  $('#evaluation-form').addEventListener('submit', calcular);
  $('#reset-btn').addEventListener('click', () => {
    const nivel = nivelActual();
    const n = Object.keys(respuestas[nivel]).length;
    if (!n) { toast('No hay respuestas que limpiar en este nivel.'); return; }
    abrirDialogo(`<h2 id="dialog-title">¿Limpiar las respuestas?</h2>
      <p>Se borrarán las <strong>${n}</strong> respuestas de <strong>${LEVELS[nivel].nombre}</strong> y su resultado. Los demás niveles no cambian.</p>
      <p class="muted">Esta acción no se puede deshacer.</p>`, 'confirmar');
  });
  $('#confirm-btn').addEventListener('click', () => {
    const d = $('#result-dialog'); if (d.open) d.close();
    limpiarNivel();
  });
  $('#prev-area').addEventListener('click', () => cambiarArea(areaActiva - 1));
  $('#next-area').addEventListener('click', () => cambiarArea(areaActiva + 1));
  $('#reopen-btn').addEventListener('click', () => { const h = dialogos[nivelActual()]; if (h) abrirDialogo(h, 'resultado'); });
  $('#print-btn').addEventListener('click', imprimir);
  $('#result-dialog').addEventListener('click', e => { if (e.target.id === 'result-dialog') e.target.close(); });
  cargarPreguntas();
});
