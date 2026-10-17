/* =========================================================
   ITmark · Proceso de implementación — script.js
   1. Datos  2. Tema  3. Menú y scroll  4. Carrusel
   5. Cuestionario  6. Resultados y ventana emergente
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
            { id: "b_n_1", text: "¿Se encuentran documentados los procesos administrativos y comerciales fundamentales de la empresa?" },
            { id: "b_n_2", text: "¿La empresa cuenta con un organigrama formal donde se definen roles y responsabilidades claras?" },
            { id: "b_n_3", text: "¿Se lleva un registro formal, continuo y controlado de ingresos, gastos y facturación?" },
            { id: "b_n_4", text: "¿Existe un proceso formal para el seguimiento de clientes y la atención de solicitudes o quejas?" }
        ],
        "Seguridad de la Información": [
            { id: "b_s_1", text: "¿Existen políticas formales aplicadas para la creación, complejidad y rotación de contraseñas de los usuarios?" },
            { id: "b_s_2", text: "¿Se ejecutan y almacenan copias de seguridad (backups) periódicas de la información crítica de la empresa?" },
            { id: "b_s_3", text: "¿Se controla y restringe el acceso físico a los servidores, cuartos de red y áreas críticas?" },
            { id: "b_s_4", text: "¿Todos los equipos de cómputo corporativos cuentan con protección antivirus instalada, actualizada y activa?" }
        ],
        "Ingeniería de Software": [
            { id: "b_i_1", text: "¿Se documentan, revisan y aprueban formalmente los requisitos del cliente antes de iniciar el desarrollo técnico?" },
            { id: "b_i_2", text: "¿Se planifican formalmente los proyectos mediante estimaciones documentadas de tiempos, costos y recursos?" },
            { id: "b_i_3", text: "¿Existe un control sistemático de versiones para el código fuente y la documentación técnica del proyecto?" },
            { id: "b_i_4", text: "¿Se realizan y documentan pruebas funcionales básicas antes de la entrega final del producto/servicio al cliente?" }
        ]
    },
    premium: {
        "Gestión de Negocio": [
            { id: "p_n_1", text: "¿La dirección ha definido y hace seguimiento regular a indicadores clave de desempeño (KPIs) a nivel organizacional?" },
            { id: "p_n_2", text: "¿Los procesos están estandarizados de forma que las metodologías no varíen drásticamente entre un equipo y otro?" },
            { id: "p_n_3", text: "¿Existe un plan de capacitación formal y recurrente alineado con los objetivos estratégicos de la pyme?" }
        ],
        "Seguridad de la Información": [
            { id: "p_s_1", text: "¿Se ha elaborado una matriz de riesgos de seguridad de la información para identificar amenazas y vulnerabilidades?" },
            { id: "p_s_2", text: "¿Existen planes de tratamiento y mitigación activos para los riesgos clasificados como altos o críticos?" },
            { id: "p_s_3", text: "¿Se realizan revisiones o auditorías periódicas (internas/externas) a los sistemas de seguridad de la red?" }
        ],
        "Ingeniería de Software": [
            { id: "p_i_1", text: "¿Existe un conjunto de procesos de desarrollo de software estandarizados a nivel organizacional (activos de procesos)?" },
            { id: "p_i_2", text: "¿Se cuenta con un rol o proceso formal de Aseguramiento de la Calidad (QA) independiente del equipo de desarrollo?" },
            { id: "p_i_3", text: "¿Se recopilan lecciones aprendidas y datos históricos al finalizar los proyectos para mejorar futuras estimaciones?" }
        ]
    },
    elite: {
        "Gestión de Negocio": [
            { id: "e_n_1", text: "¿La organización utiliza datos estadísticos para predecir el comportamiento del negocio y tomar decisiones preventivas?" },
            { id: "e_n_2", text: "¿Existen procesos estructurados para fomentar la innovación continua y la mejora del modelo de negocio (ej. EFQM)?" },
            { id: "e_n_3", text: "¿Se realiza benchmarking o comparación de procesos organizacionales frente a líderes o estándares internacionales del sector?" }
        ],
        "Seguridad de la Información": [
            { id: "e_s_1", text: "¿La organización opera bajo un Sistema de Gestión de Seguridad de la Información (SGSI) maduro y medible?" },
            { id: "e_s_2", text: "¿Se aplican ciclos de mejora continua (Plan-Do-Check-Act) demostrables en las políticas de seguridad?" },
            { id: "e_s_3", text: "¿Existe un plan de continuidad de negocio (BCP) y recuperación ante desastres (DRP) que se pruebe regularmente?" }
        ],
        "Ingeniería de Software": [
            { id: "e_i_1", text: "¿Los procesos de desarrollo se gestionan de forma cuantitativa, utilizando modelos estadísticos para controlar el rendimiento?" },
            { id: "e_i_2", text: "¿La pyme identifica e implementa proactivamente nuevas tecnologías para optimizar de forma medible sus procesos técnicos?" },
            { id: "e_i_3", text: "¿Se realizan análisis de causa raíz estadísticos para resolver defectos en el software y prevenir su recurrencia sistémica?" }
        ]
    }
};

const resultados = {};      // último resultado por nivel: { viable, pct, global }
let radar = null;
let ultimo = null;          // datos del último gráfico, para redibujar al cambiar de tema

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }
};

/* ---------- 2. MODO OSCURO / CLARO ---------- */
function aplicarTema(t) {
  document.documentElement.setAttribute('data-theme', t);
  const b = $('#theme-toggle');
  b.setAttribute('aria-pressed', String(t === 'dark'));
  b.setAttribute('aria-label', t === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  if (ultimo) dibujarRadar(ultimo);
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
function iniciarNavegacion() {
  const nav = $('#main-nav'), btn = $('#menu-toggle');
  const cerrar = () => { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-label', 'Abrir menú'); };
  btn.addEventListener('click', () => {
    const abierto = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(abierto));
    btn.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
  });
  // Scroll suave (CSS ya lo hace; esto cierra el menú y cubre navegadores sin soporte)
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const dest = $(a.getAttribute('href'));
    if (!dest) return;
    e.preventDefault();
    cerrar();
    const y = dest.getBoundingClientRect().top + window.scrollY - 76;
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: y, behavior: reducir ? 'auto' : 'smooth' });
  }));

  if (!('IntersectionObserver' in window)) { $$('.reveal').forEach(el => el.classList.add('is-visible')); return; }
  // Aparición al hacer scroll
  const ioReveal = new IntersectionObserver((items) => items.forEach(i => {
    if (i.isIntersecting) { i.target.classList.add('is-visible'); ioReveal.unobserve(i.target); }
  }), { threshold: 0.12 });
  $$('.reveal').forEach((el, n) => { el.style.transitionDelay = (n % 3) * 80 + 'ms'; ioReveal.observe(el); });
  // Enlace activo según la sección visible
  const enlaces = $$('.nav-link');
  const ioNav = new IntersectionObserver((items) => items.forEach(i => {
    if (i.isIntersecting) enlaces.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + i.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => ioNav.observe(s));
}

/* ---------- 4. CARRUSEL ---------- */
function iniciarCarrusel() {
  const root = $('#carousel'), track = $('.carousel-track', root);
  const slides = $$('.slide', root), dots = $('.dots', root);
  let actual = 0, timer = null;
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.type = 'button'; d.className = 'dot'; d.setAttribute('role', 'tab');
    d.setAttribute('aria-label', 'Ir a la diapositiva ' + (i + 1));
    d.addEventListener('click', () => ir(i, true));
    dots.appendChild(d);
  });
  function ir(i, manual) {
    actual = (i + slides.length) % slides.length;
    track.scrollTo({ left: actual * track.clientWidth, behavior: 'smooth' });
    $$('.dot', root).forEach((d, n) => d.setAttribute('aria-selected', String(n === actual)));
    if (manual) reiniciar();
  }
  $$('[data-dir]', root).forEach(b => b.addEventListener('click', () => ir(actual + Number(b.dataset.dir), true)));
  const parar = () => clearInterval(timer);
  const reiniciar = () => { parar(); if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => ir(actual + 1), 6000); };
  root.addEventListener('mouseenter', parar); root.addEventListener('mouseleave', reiniciar);
  root.addEventListener('focusin', parar); root.addEventListener('focusout', reiniciar);
  window.addEventListener('resize', () => track.scrollTo({ left: actual * track.clientWidth }));
  ir(0); reiniciar();
}

/* ---------- 5. CUESTIONARIO ---------- */
function cargarPreguntas() {
  const nivel = $('#level-select').value;
  const cont = $('#questions-container');
  cont.innerHTML = '';
  let n = 0;
  for (const [area, preguntas] of Object.entries(questionsData[nivel])) {
    const grupo = document.createElement('fieldset');
    grupo.className = 'area-group';
    grupo.innerHTML = `<legend><h3>${area}</h3></legend>`;
    preguntas.forEach(q => {
      n++;
      const item = document.createElement('div');
      item.className = 'question-item'; item.dataset.id = q.id;
      const txt = document.createElement('div');
      txt.className = 'question-text'; txt.textContent = n + '. ' + q.text;
      const op = document.createElement('div');
      op.className = 'options'; op.setAttribute('role', 'radiogroup'); op.setAttribute('aria-label', 'Respuesta a la pregunta ' + n);
      [['1', 'Sí'], ['0.5', 'Parcial'], ['0', 'No']].forEach(([v, t]) => {
        op.insertAdjacentHTML('beforeend', `<label class="opt"><input type="radio" name="${q.id}" value="${v}"><span>${t}</span></label>`);
      });
      item.append(txt, op); grupo.appendChild(item);
    });
    cont.appendChild(grupo);
  }
  $$('input[type=radio]', cont).forEach(r => r.addEventListener('change', () => { r.closest('.question-item').classList.remove('missing'); progreso(); }));
  progreso();
  ultimo = null; limpiarResultados();
}
function progreso() {
  const total = $$('.question-item').length;
  const hechas = $$('.question-item').filter(i => $('input:checked', i)).length;
  $('#progress-text').textContent = `${hechas} de ${total} respondidas`;
  $('#progress-bar').style.width = (total ? hechas / total * 100 : 0) + '%';
}
function limpiarResultados() {
  dibujarRadar({ pct: [0, 0, 0] });
  $('#results-summary').innerHTML = '<p class="muted">Complete el cuestionario para ver los resultados.</p>';
  ultimo = null;
}

/* ---------- 6. RESULTADOS, GRÁFICO Y VENTANA EMERGENTE ---------- */
function dibujarRadar(datos) {
  const canvas = $('#radarChart');
  if (typeof Chart === 'undefined') { canvas.style.display = 'none'; return; }   // sin Chart.js: solo barras/resumen
  const css = getComputedStyle(document.documentElement);
  const c = n => css.getPropertyValue(n).trim();
  if (radar) radar.destroy();
  radar = new Chart(canvas.getContext('2d'), {
    type: 'radar',
    data: { labels: ['Negocio', 'Seguridad', 'Software'], datasets: [{ data: datos.pct, backgroundColor: c('--color-primary') + '44', borderColor: c('--color-primary'), borderWidth: 2, pointBackgroundColor: c('--color-accent'), pointRadius: 4 }] },
    options: {
      scales: { r: { min: 0, max: 100, ticks: { stepSize: 25, backdropColor: 'transparent', color: c('--muted'), callback: v => v + '%' }, grid: { color: c('--border') }, angleLines: { color: c('--border') }, pointLabels: { color: c('--text'), font: { size: 13, weight: '600' } } } },
      plugins: { legend: { display: false } }, animation: { duration: 600 }
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
  const nivel = $('#level-select').value;
  const faltan = $$('.question-item').filter(i => !$('input:checked', i));
  $$('.question-item').forEach(i => i.classList.toggle('missing', faltan.includes(i)));
  if (faltan.length) {
    faltan[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    abrirDialogo(`<h2 id="dialog-title">Faltan respuestas</h2><p>Responde las ${faltan.length} preguntas marcadas en rojo para poder valorar la adopción del nivel <strong>${LEVELS[nivel].nombre}</strong>.</p>`);
    return;
  }
  const acum = {}; AREAS.forEach(a => acum[a] = { s: 0, m: 0 });
  const huecos = [];
  for (const [area, preguntas] of Object.entries(questionsData[nivel])) {
    preguntas.forEach(q => {
      const v = parseFloat($(`input[name="${q.id}"]:checked`).value);
      acum[area].s += v; acum[area].m += 1;
      if (v < 1) huecos.push({ v, t: q.text });
    });
  }
  const pct = AREAS.map(a => Math.round(acum[a].s / acum[a].m * 100));
  const total = AREAS.reduce((s, a) => s + acum[a].s, 0), max = AREAS.reduce((s, a) => s + acum[a].m, 0);
  const global = Math.round(total / max * 100);
  const { estado, avisos } = evaluar(pct, global, nivel);
  resultados[nivel] = { viable: estado === 'ok', pct, global };

  ultimo = { pct };
  dibujarRadar(ultimo);
  $('#results-summary').innerHTML = AREAS.map((a, i) => `<div class="summary-row"><span>${a}</span><span>${pct[i]}%</span></div>`).join('') + `<div class="summary-row total"><span>Madurez global</span><span>${global}%</span></div>`;
  mostrarVeredicto({ nivel, estado, pct, global, avisos, huecos });
}

function mostrarVeredicto({ nivel, estado, pct, global, avisos, huecos }) {
  const nombre = LEVELS[nivel].nombre;
  const msg = {
    ok:   ['✓', 'Adopción viable', `Tu empresa cumple los criterios para iniciar el proceso de adopción de <strong>${nombre}</strong>: el cumplimiento global es del ${global}% y ninguna área baja del ${UMBRAL_AREA}%.`],
    warn: ['!', 'Viable con condiciones', `La adopción de <strong>${nombre}</strong> es posible, pero antes conviene cerrar las brechas señaladas. Global: ${global}%; se espera al menos ${UMBRAL_GLOBAL}% global y ${UMBRAL_AREA}% por área.`],
    bad:  ['✕', 'Aún no es viable', `Con un ${global}% global, todavía no es recomendable aspirar a <strong>${nombre}</strong>. Primero construye las bases de las áreas con menor cumplimiento.`]
  }[estado];
  const barras = AREAS.map((a, i) => `<div class="mini-row"><span>${a}</span><b>${pct[i]}%</b><div class="bar"><span style="width:${pct[i]}%"></span></div></div>`).join('');
  const lista = huecos.sort((x, y) => x.v - y.v).slice(0, 5).map(h => `<li>${h.t.replace(/^¿|\?$/g, '')}${h.v === 0 ? '' : ' <em>(parcial)</em>'}</li>`).join('');
  abrirDialogo(`
    <h2 id="dialog-title">Resultado para ${nombre}</h2>
    <div class="verdict ${estado}"><span class="v-icon" aria-hidden="true">${msg[0]}</span><div><strong>${msg[1]}</strong></div></div>
    <p>${msg[2]}</p>
    ${avisos.map(a => `<p><strong>Atención:</strong> ${a}</p>`).join('')}
    <h3>Cumplimiento por área</h3>${barras}
    ${lista ? `<h3>Primeras brechas a atender</h3><ul class="gaps">${lista}</ul>` : '<p>No se detectaron brechas en este nivel.</p>'}
    <p class="dialog-note">Valoración orientativa con criterios propuestos por el equipo del proyecto; no reemplaza la evaluación de un organismo certificador.</p>`);
}

function abrirDialogo(html) {
  const d = $('#result-dialog');
  $('#dialog-body').innerHTML = html;
  if (typeof d.showModal === 'function') d.showModal();
  else alert($('#dialog-body').innerText);        // respaldo para navegadores sin <dialog>
}

/* ---------- INICIO ---------- */
document.addEventListener('DOMContentLoaded', () => {
  iniciarTema(); iniciarNavegacion(); iniciarCarrusel();
  $('#level-select').addEventListener('change', cargarPreguntas);
  $('#evaluation-form').addEventListener('submit', calcular);
  $('#reset-btn').addEventListener('click', cargarPreguntas);
  $('#result-dialog').addEventListener('click', e => { if (e.target.id === 'result-dialog') e.target.close(); });
  cargarPreguntas();
});
