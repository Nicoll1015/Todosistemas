/**
 * Nueva versión — capa dinámica (va después de main.js).
 * Hero con panel de flujo documental, tarjetas que brillan y se inclinan con el
 * mouse, cifras que cuentan y entradas escalonadas.
 * Sin dependencias externas.
 */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasIO = "IntersectionObserver" in window;

  /* ------------------------------------------------------------------ */
  /* Hero: aurora de color; en páginas internas, documentos flotantes   */
  /* ------------------------------------------------------------------ */
  document.querySelectorAll(".hero, .placeholder-hero").forEach((hero) => {
    const aurora = document.createElement("div");
    aurora.className = "dyn-aurora";
    aurora.setAttribute("aria-hidden", "true");
    aurora.innerHTML = "<span></span><span></span><span></span>";
    hero.prepend(aurora);

    if (hero.classList.contains("placeholder-hero")) {
      const docs = document.createElement("div");
      docs.className = "dyn-docs";
      docs.setAttribute("aria-hidden", "true");
      docs.innerHTML = "<span></span><span></span><span></span><span></span>";
      aurora.after(docs);
    }
  });

  /* ------------------------------------------------------------------ */
  /* Páginas internas: panel animado al lado del título, con el flujo   */
  /* propio de cada servicio (mismo diseño que el panel del home).      */
  /* ------------------------------------------------------------------ */
  // Íconos de línea (24×24) para los pasos y los gráficos de cada panel
  const I = {
    inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5h13L22 12v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6z"/>',
    ai: '<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    legal: '<path d="M12 3v18M7 21h10M5 7h14"/><path d="M5 7l-3 6a3 3 0 006 0zM19 7l-3 6a3 3 0 006 0z"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>',
    archive: '<rect x="2" y="4" width="20" height="5" rx="1"/><path d="M4 9v10a2 2 0 002 2h12a2 2 0 002-2V9M10 13h4"/>',
    tag: '<path d="M20.6 13.4l-7.2 7.2a2 2 0 01-2.8 0L2 12V2h10l8.6 8.6a2 2 0 010 2.8z"/><circle cx="7" cy="7" r="1.5"/>',
    form: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    branch: '<path d="M12 2l6 6-6 6-6-6z"/><path d="M12 14v8M6 8H2M22 8h-4"/>',
    usercheck: '<circle cx="9" cy="7" r="4"/><path d="M2 21a7 7 0 0114 0M16 11l2 2 4-4"/>',
    plug: '<path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 01-12 0zM12 18v4"/>',
    flag: '<path d="M4 22V4M4 4h12l-2 4 2 4H4"/>',
    bell: '<path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
    queue: '<rect x="3" y="4" width="18" height="4" rx="1"/><rect x="3" y="10" width="18" height="4" rx="1"/><rect x="3" y="16" width="18" height="4" rx="1"/>',
    bot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 14h.01M15 14h.01"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>',
    db: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    audit: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3h6v3H9zM9 12l2 2 4-4"/>',
    map: '<circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M7 6h10M6 8l5 8M18 8l-5 8"/>',
    alert: '<path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0zM12 9v4M12 17h.01"/>',
    shield: '<path d="M12 3l7 3v5.5c0 4.3-3 7.4-7 8.5-4-1.1-7-4.2-7-8.5V6z"/><path d="M9 12l2 2 4-4"/>',
    code: '<path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>',
    flask: '<path d="M9 3h6M10 3v6L4 19a1.5 1.5 0 001.3 2h13.4a1.5 1.5 0 001.3-2L14 9V3"/><path d="M7 15h10"/>',
    rocket: '<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M14 4c3-1 6-1 6-1s0 3-1 6l-7 7-5-5z"/><circle cx="15" cy="9" r="1.5"/>',
    idea: '<path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z"/>',
    layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',
    users: '<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0114 0M16 4a4 4 0 010 8M22 21a6 6 0 00-4-5.7"/>',
    chat: '<path d="M21 12a8 8 0 01-11.6 7.1L3 21l1.9-6.4A8 8 0 1121 12z"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    headset: '<path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1v-6h3zM3 19a2 2 0 002 2h1v-6H3z"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.5 2.5-2.5-.5-.5-2.5z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    layers: '<path d="M12 2l10 5-10 5L2 7z"/><path d="M2 12l10 5 10-5M2 17l10 5 10-5"/>',
    refresh: '<path d="M21 12a9 9 0 01-15.5 6.2M3 12a9 9 0 0115.5-6.2"/><path d="M21 4v5h-5M3 20v-5h5"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    star: '<path d="M12 2l3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21l1.4-7L2 9.3l7-.8z"/>',
    folder: '<path d="M3 6a2 2 0 012-2h4l2 2h8a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>',
    money: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/>',
  };
  const ico = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${I[k] || I.form}</svg>`;

  /* ------------------------------------------------------------------ */
  /* Visual propio de cada página interna (celular o composición). Todo */
  /* es HTML/CSS: se ve nítido en cualquier pantalla y se anima sin     */
  /* imágenes pesadas.                                                  */
  /* ------------------------------------------------------------------ */
  const page = (location.pathname.split("/").pop() || "index.html").replace(".html", "") || "index";

  // Marcos de dispositivo
  const phone = (ui, cls = "") => `<div class="dv dv--phone ${cls}"><div class="dv__screen"><span class="dv__notch"></span><div class="ui ui--phone">${ui}</div></div></div>`;
  const toast = (icon, title, sub, cls = "") => `<div class="dv-toast ${cls}"><i>${ico(icon)}</i><span><b>${title}</b><small>${sub}</small></span></div>`;

  // Piezas de interfaz del celular
  const pill = (txt, tone = "ok") => `<span class="ui-pill ui-pill--${tone}">${txt}</span>`;
  const btn = (txt, cls = "") => `<span class="ui-btn ${cls}">${txt}</span>`;
  const cursor = (cls = "") => `<span class="ui-cursor ${cls}"><svg viewBox="0 0 24 24"><path d="M4 2l16 10-7 1.5L9.5 21z" fill="#fff" stroke="#01091e" stroke-width="1.5" stroke-linejoin="round"/></svg></span>`;
  const bubble = (txt, who, i) => `<span class="ui-bubble ui-bubble--${who}" style="--d:${i}">${txt}</span>`;

  // Piezas de las composiciones sin pantalla
  const node = (icon, label, cls = "", style = "") => `<div class="cx-node ${cls}" style="${style}"><i>${ico(icon)}</i>${label ? `<small>${label}</small>` : ""}</div>`;
  const glass = (inner, cls = "", style = "") => `<div class="cx-glass ${cls}" style="${style}">${inner}</div>`;
  const CLIENTS = [
    ["banco-popular", "Banco Popular"], ["alianza-fiduciaria", "Alianza Fiduciaria"], ["beneficiar", "Beneficiar"],
    ["escuela-julio-garavito", "Escuela Julio Garavito"], ["incocredito", "Incocrédito"], ["sur-occidente", "Sur Occidente"],
  ];

  // Cada página tiene su propio concepto visual (ver comentario de cada una)
  const SCENES = {
    // 2 · Celular: se escanea un documento en papel y sus metadatos vuelan al expediente
    "gestion-documental": () =>
      `<div class="cx-paper"><b>CONTRATO</b><i></i><i></i><i></i><i></i><i></i><i></i><svg viewBox="0 0 120 40"><path d="M5 30 C20 5 30 35 45 18 S70 30 80 12 S105 28 115 15"/></svg></div>` +
      phone(`<div class="ui-phone-top"><b>Radicar documento</b></div><div class="ui-scan"><span class="ui-scan__page"><i></i><i></i><i></i><i></i></span><span class="ui-scan__beam"></span><span class="ui-scan__corners"></span></div>${btn("Capturar", "ui-btn--tap ui-btn--block")}<span class="ui-done">${ico("inbox")} N.° 2026-00418</span>`, "dv--center") +
      ["Tipo: contrato", "Dependencia: Jurídica", "Serie documental", "Firma digital"].map((t, i) => `<span class="cx-meta" style="--d:${i}">${ico(["tag", "users", "folder", "pen"][i] || "tag")}${t}</span>`).join("") +
      `<div class="cx-folder">${ico("folder")}<b>Expediente</b><small>Trazabilidad total</small></div>`,

    // 2 · Celular: tarjetas de candidatos que se deslizan hasta el perfil ideal
    "staffing-ti": () =>
      phone(`<div class="ui-phone-top"><b>PeopleHEF</b><span class="ui-online">3 perfiles</span></div><div class="cx-swipe">${["Full Stack · 5 años", "Backend · 4 años", "QA · 3 años"].map((t, i) => `<div class="cx-swipe__card" style="--d:${i}"><span class="ui-profile__av">${ico("user")}</span><b>${t.split(" · ")[0]}</b><small>${t.split(" · ")[1]} de experiencia</small><span class="cx-swipe__tags"><i>Java</i><i>React</i><i>SQL</i></span><span class="cx-swipe__match">${ico("target")} Perfil ideal</span></div>`).join("")}</div><div class="cx-swipe__btns"><span>✕</span><span>✓</span></div>`, "dv--center") +
      ["Prueba técnica", "Entrevista", "Onboarding", "Seguimiento"].map((t, i) => `<span class="cx-orbit-chip" style="--d:${i}">${ico(["flask", "chat", "rocket", "chart"][i])}${t}</span>`).join("") +
      toast("clock", "8 días o menos", "Perfil contratado", "dv-toast--br"),

    // 2 · Celular: chat para agendar la demo
    contacto: () =>
      phone(`<div class="ui-phone-top ui-phone-top--wa"><span class="ui-profile__av">${ico("users")}</span><b>Todosistemas STI</b><span class="ui-online">en línea</span></div><div class="ui-chat">${bubble("Hola, quiero agendar una demo", "me", 0)}${bubble("¡Con gusto! ¿Qué proceso quieres digitalizar?", "them", 1)}${bubble("Gestión documental", "me", 2)}${bubble("Te agendamos el jueves a las 10:00 ✓", "them", 3)}</div>`, "dv--solo") +
      `<div class="dv-cal"><b>${ico("calendar")} Demo agendada</b><span class="dv-cal__day">JUE<strong>10</strong></span><small>10:00 a. m. · Videollamada</small></div>` +
      toast("chat", "Sin rodeos", "Te respondemos rápido", "dv-toast--tl"),

    // 3 · Automatización: diagrama de proceso isométrico que flota, armado sin código
    "auraquantic-bpms": () =>
      `<div class="cx-iso"><div class="cx-iso__plane"><svg viewBox="0 0 300 300" fill="none">
        <path class="cx-iso__wire" d="M40 150 H95 M145 150 H175 M205 150 L230 95 M205 150 L230 205 M255 95 L270 150 M255 205 L270 150"/>
        <circle cx="30" cy="150" r="12" class="cx-iso__start"/>
        <rect x="95" y="128" width="50" height="44" rx="10" class="cx-iso__task"/>
        <path d="M190 128 l18 22 -18 22 -18 -22z" class="cx-iso__gate"/>
        <rect x="230" y="75" width="40" height="40" rx="10" class="cx-iso__task"/>
        <rect x="230" y="185" width="40" height="40" rx="10" class="cx-iso__task"/>
        <circle cx="280" cy="150" r="11" class="cx-iso__end"/>
        <circle r="7" class="cx-iso__token"><animateMotion dur="5s" repeatCount="indefinite" path="M30 150 H120 H190 L250 95 L280 150"/></circle>
        <circle r="7" class="cx-iso__token cx-iso__token--b"><animateMotion dur="5s" begin="2.5s" repeatCount="indefinite" path="M30 150 H120 H190 L250 205 L280 150"/></circle>
      </svg></div></div>` +
      glass(`${ico("usercheck")}<span><b>Aprobación</b><small>Arrástrala al flujo</small></span>`, "cx-drag") + cursor("cx-drag__cursor") +
      toast("code", "Cero código", "Sin programar", "dv-toast--tl") + toast("chart", "-74% tiempos de proceso", "Control en tiempo real", "dv-toast--br"),

    // 3 · Automatización: los casos viajan por las etapas del proceso y alimentan los indicadores
    "automatizacion-bpm": () =>
      `<div class="cx-kpis">${[["-35%", "tiempo de ejecución", 65], ["+50%", "automatizados", 50], ["24/7", "monitoreo", 100]].map(([v, t, p], i) => `<div class="cx-donut" style="--p:${p};--d:${i}"><svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="32"/><circle cx="40" cy="40" r="32" class="cx-donut__fill"/></svg><b>${v}</b><small>${t}</small></div>`).join("")}</div>
      <div class="cx-lane"><span class="cx-lane__track"></span>${["Inicio", "Validación", "Aprobación", "Cierre"].map((t, i) => node(["inbox", "branch", "usercheck", "flag"][i], t, "cx-lane__gate", `--d:${i}`)).join("")}${[0, 1, 2].map((i) => `<span class="cx-lane__case" style="--d:${i}">${ico("form")}</span>`).join("")}</div>` +
      toast("map", "Modelado BPMN", "AuraQuantic certificado", "dv-toast--bl"),

    // 3 · Automatización: cola de trabajo atendida por robot, agente de IA y persona
    "blue-prism": () =>
      `<div class="cx-queue cx-queue--in"><b>Cola</b>${["Factura", "Orden", "Reclamo", "Pago", "Póliza"].map((t, i) => `<span style="--d:${i}">${ico("form")}${t}</span>`).join("")}</div>
      <div class="cx-trio"><svg viewBox="0 0 200 180" fill="none"><path d="M100 30 L35 145 L165 145 Z" class="cx-trio__wire"/></svg>
        <div class="cx-robot"><span class="cx-robot__antenna"></span><span class="cx-robot__eye"></span><span class="cx-robot__eye"></span></div>
        ${node("ai", "Agente IA", "cx-trio__ai")}${node("user", "Persona", "cx-trio__human")}<span class="cx-trio__label">WorkHQ</span></div>
      <div class="cx-queue cx-queue--out"><b>Completado</b>${["Factura", "Orden", "Reclamo", "Pago", "Póliza"].map((t, i) => `<span style="--d:${i}">${ico("shield")}${t}</span>`).join("")}</div>` +
      toast("audit", "Gobernanza integrada", "Todo queda auditado", "dv-toast--bl"),

    // 3 · Panal hexagonal: los 14 módulos de la suite alrededor del núcleo
    "softexpert-suite": () =>
      `<div class="cx-hive">${["folder", "calendar", "star", "map", "chart", "headset", "wrench", "SUITE", "refresh", "alert", "target", "users", "idea", "shield", "layers"].map((k, i) => {
        // Panal de 3 filas × 5 celdas; la fila del medio va corrida media celda
        const r = Math.floor(i / 5), c = i % 5;
        const pos = `--x:${3 + c * 17.6 + (r === 1 ? 8.8 : 0) - (r === 1 ? 4.4 : 0)}cqw;--y:${17 + r * 14.6}cqw`;
        return k === "SUITE" ? `<span class="cx-hex cx-hex--core" style="${pos}"><b>14</b><small>módulos</small></span>` : `<span class="cx-hex" style="${pos};--d:${i}">${ico(k)}</span>`;
      }).join("")}</div>` +
      toast("alert", "Gestión de riesgos", "Corporativos", "dv-toast--tl") + toast("audit", "Cumplimiento", "Normas internacionales", "dv-toast--br"),

    // 3 · Seguridad y calidad: escudo que detiene los errores antes de producción
    enjisst: () =>
      `<div class="cx-shield"><span class="cx-shield__ring"></span><span class="cx-shield__ring cx-shield__ring--2"></span><svg viewBox="0 0 120 140"><defs><linearGradient id="cxsh" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1ee39d"/><stop offset="1" stop-color="#00a285"/></linearGradient></defs><path d="M60 6 L110 26 V66 C110 102 88 126 60 134 C32 126 10 102 10 66 V26 Z" fill="rgba(3,207,136,0.12)" stroke="url(#cxsh)" stroke-width="4"/><path d="M38 70 L54 86 L84 54" stroke="#1ee39d" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
        ${[0, 1, 2, 3, 4, 5].map((i) => `<span class="cx-bug" style="--a:${i * 60 + 20}deg;--d:${i}">${ico("alert")}</span>`).join("")}
        ${["Inicio de sesión", "Bloqueo de cuenta", "Recuperar clave", "Cierre de sesión"].map((t, i) => `<span class="cx-test" style="--d:${i};${["right:-4%;top:12%", "right:-8%;top:40%", "right:-4%;top:68%", "left:6%;bottom:0"][i]}">${ico("shield")}${t}</span>`).join("")}</div>` +
      glass(`<b>Requisito en lenguaje natural</b><p><em>Dado que</em> el usuario está registrado, <em>cuando</em> ingresa su clave, <em>entonces</em> accede.</p>`, "cx-spec") +
      toast("flask", "-90% defectos", "En producción", "dv-toast--br"),

    // 3 · IA: núcleo de IA con agentes especializados y una persona que aprueba
    "ia-agentica": () =>
      `<svg class="cx-net" viewBox="0 0 400 340" fill="none">
        ${[[70, 70], [330, 70], [70, 270], [330, 270]].map(([x, y]) => `<path d="M200 170 L${x} ${y}" class="cx-net__wire"/><circle r="4" class="cx-net__pulse"><animateMotion dur="2.4s" repeatCount="indefinite" path="M${x} ${y} L200 170"/></circle>`).join("")}
        <path d="M200 170 V40" class="cx-net__wire cx-net__wire--human"/></svg>
      <div class="cx-core"><span class="cx-core__ring"></span><span class="cx-core__ring cx-core__ring--2"></span><i>${ico("ai")}</i><b>IA Agéntica</b></div>
      ${node("code", "Código", "cx-agent", "left:17.5%;top:20.6%")}${node("flask", "Pruebas", "cx-agent", "left:82.5%;top:20.6%")}${node("form", "Documentación", "cx-agent", "left:17.5%;top:79.4%")}${node("lock", "Seguridad", "cx-agent", "left:82.5%;top:79.4%")}
      ${glass(`${ico("eye")}<span><b>Revisión humana</b><small>Aprueba cada entrega</small></span>`, "cx-human")}` +
      toast("rocket", "Sprint de 2 semanas", "Incremento funcional", "dv-toast--br"),

    // 3 · Modernización: el bloque legado se divide en servicios modernos conectados
    "modernizacion-sistemas": () =>
      `<svg class="cx-cubes" viewBox="0 0 400 340" fill="none">
        <g class="cx-mono"><path d="M200 70 L290 120 L200 170 L110 120Z" class="cx-face--top"/><path d="M110 120 L200 170 V280 L110 230Z" class="cx-face--left"/><path d="M290 120 L200 170 V280 L290 230Z" class="cx-face--right"/><text x="200" y="232">LEGADO</text></g>
        ${[[110, 90], [290, 90], [70, 200], [330, 200], [150, 290], [250, 290]].map(([x, y], i) => `<g class="cx-svc" style="--x:${x - 200}px;--y:${y - 175}px;--d:${i}"><path d="M200 150 L225 164 L200 178 L175 164Z" class="cx-face--top cx-g"/><path d="M175 164 L200 178 V206 L175 192Z" class="cx-face--left cx-g"/><path d="M225 164 L200 178 V206 L225 192Z" class="cx-face--right cx-g"/></g>`).join("")}
        <g class="cx-links">${[[110, 90, 290, 90], [70, 200, 110, 90], [330, 200, 290, 90], [150, 290, 70, 200], [250, 290, 330, 200], [150, 290, 250, 290]].map(([a, b2, c, d]) => `<path d="M${a} ${b2 + 14} L${c} ${d + 14}"/>`).join("")}</g></svg>` +
      toast("refresh", "Sin frenar la operación", "Refactorización con IA", "dv-toast--tl") + toast("plug", "Nuevas integraciones", "APIs y microservicios", "dv-toast--br"),

    // 3 · Datos: datos dispersos pasan por el gobierno de datos y salen confiables
    "gobernabilidad-datos": () =>
      `<svg class="cx-data" viewBox="0 0 400 300" fill="none">
        ${[60, 150, 240].map((y) => `<path d="M70 ${y} C140 ${y} 140 150 190 150" class="cx-data__wire"/>`).join("")}<path d="M230 150 H320" class="cx-data__wire cx-data__wire--out"/>
        ${[60, 150, 240].map((y, i) => [0, 1, 2].map((k) => `<circle r="4.5" class="cx-dot cx-dot--${(i + k) % 3}"><animateMotion dur="3s" begin="${k + i * 0.4}s" repeatCount="indefinite" path="M70 ${y} C140 ${y} 140 150 190 150"/></circle>`).join("")).join("")}
        ${[0, 1, 2, 3].map((k) => `<circle r="4.5" class="cx-dot cx-dot--ok"><animateMotion dur="1.6s" begin="${k * 0.4}s" repeatCount="indefinite" path="M230 150 H320"/></circle>`).join("")}</svg>
      ${["Clientes", "Proveedores", "Nómina"].map((t, i) => `<div class="cx-db" style="top:${[20, 50, 80][i]}%">${ico("db")}<small>${t}</small></div>`).join("")}
      <div class="cx-prism">${ico("shield")}<b>Gobierno</b><small>DAMA-DMBOK</small></div>
      <div class="cx-db cx-db--ok">${ico("db")}<small>Dato confiable</small></div>` +
      glass(`<b>98%</b><small>calidad de datos</small>`, "cx-score") + toast("usercheck", "Data Steward", "Responsable asignado", "dv-toast--tl"),

    // 3 · Soporte: los tickets entran al anillo de SLA y salen resueltos
    "soporte-ti": () =>
      `<div class="cx-sla"><svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="86" class="cx-sla__track"/><circle cx="100" cy="100" r="86" class="cx-sla__fill"/></svg><span class="cx-sla__tick"></span><i>${ico("headset")}</i><b>98%</b><small>dentro del SLA</small></div>
      ${["#4821 · Clave", "#4822 · Impresora", "#4823 · Servidor"].map((t, i) => `<span class="cx-ticket" style="--d:${i}"><i>${ico(i === 2 ? "db" : "wrench")}</i>${t}<em>${i === 2 ? "Nivel 2" : "Nivel 1"}</em></span>`).join("")}` +
      toast("clock", "Soporte 24/7", "Respuesta ágil", "dv-toast--tl") + toast("chat", "Seguimiento", "Post-resolución", "dv-toast--br"),

    // 4 · Tablero de sprint flotante: tarjetas que avanzan hasta la entrega
    "fabrica-software": () =>
      `<div class="cx-board">${["Por hacer", "En curso", "Hecho"].map((c, i) => `<div class="cx-board__col"><b>${c}</b>${[0, 1].map((k) => `<span class="cx-task"><i class="cx-task__tag cx-task__tag--${(i + k) % 3}"></i><em></em><em></em><span class="cx-task__av"></span></span>`).join("")}</div>`).join("")}
      <span class="cx-task cx-task--move"><i class="cx-task__tag cx-task__tag--0"></i><b>Módulo de pagos</b><span class="cx-task__av"></span></span></div>` +
      `<span class="cx-code">&lt;/&gt;</span>` + toast("flask", "QA y DevSecOps", "Integrados", "dv-toast--br") + toast("users", "Equipo dedicado", "De principio a fin", "dv-toast--tl"),

    // 4 · Credenciales del equipo extendido que se arma para tu proyecto
    "outsourcing-ti": () =>
      `<div class="cx-badges">${[["code", "Desarrollador"], ["headset", "Soporte N2"], ["flask", "Analista QA"], ["wrench", "Infraestructura"], ["db", "Ingeniero de datos"], ["users", "Líder técnico"]].map(([k, t], i) => `<div class="cx-badge" style="--d:${i}"><span class="cx-badge__clip"></span><span class="ui-profile__av">${ico(k)}</span><b>${t}</b>${pill("Asignado", "ok")}</div>`).join("")}</div>` +
      glass(`<b>+70</b><small>profesionales listos para tu equipo</small>`, "cx-count") + toast("rocket", "Onboarding ágil", "Integración rápida", "dv-toast--br"),

    // 4 · Rueda del ciclo de vida del colaborador
    rrhh: () =>
      `<div class="cx-wheel"><svg viewBox="0 0 300 300" fill="none"><circle cx="150" cy="150" r="118" class="cx-wheel__track"/><circle cx="150" cy="150" r="118" class="cx-wheel__arc"/><circle r="9" class="cx-wheel__dot"><animateMotion dur="10s" repeatCount="indefinite" path="M150 32 A118 118 0 1 1 149.9 32"/></circle></svg>
        ${[["search", "Selección"], ["pen", "Contratación"], ["rocket", "Vinculación"], ["chart", "Evaluación"], ["archive", "Desvinculación"]].map(([k, t], i) => node(k, t, "cx-wheel__stage", `--a:${i * 72}deg;--d:${i}`)).join("")}
        <div class="cx-wheel__center"><span class="ui-profile__av">${ico("user")}</span><b>Expediente digital</b><small>Todo el ciclo, trazable</small></div></div>` +
      toast("audit", "Trazabilidad total", "Auditorías laborales", "dv-toast--br"),

    // 4 · Capas de la plataforma con las certificaciones reales
    tecnologia: () =>
      `<div class="cx-stack">${[["lock", "Seguridad de la información"], ["chart", "Dashboards en tiempo real"], ["bot", "RPA"], ["ai", "Inteligencia Artificial"], ["map", "AuraQuantic BPMS"]].map(([k, t], i) => `<div class="cx-plate" style="--i:${i}"><span>${ico(k)}</span></div><span class="cx-plate__label" style="--i:${i}">${t}</span>`).join("")}</div>
      <div class="cx-seal cx-seal--a"><img src="assets/img/certificaciones/iso-9001.svg" alt="" /></div><div class="cx-seal cx-seal--b"><img src="assets/img/certificaciones/iso-27001.svg" alt="" /></div>`,

    // 4 · Cinco pilares que sostienen tu operación
    soluciones: () =>
      `<div class="cx-pillars"><span class="cx-pillars__roof">Tu operación, en control</span>${[["folder", "Gestión documental"], ["map", "Automatización BPM"], ["users", "RRHH"], ["code", "Fábrica de software"], ["headset", "Outsourcing TI"]].map(([k, t], i) => `<div class="cx-pillar" style="--d:${i}"><i>${ico(k)}</i><span></span><small>${t}</small></div>`).join("")}<span class="cx-pillars__base"></span></div>`,

    // 4 · Collage con fotos reales del equipo y sus valores
    nosotros: () =>
      `<div class="cx-photo cx-photo--main"><img src="assets/img/equipo-todosistemas.jpg" alt="" /></div><div class="cx-photo cx-photo--side"><img src="assets/img/contacto-equipo.jpg" alt="" /></div>
      <svg class="cx-stamp" viewBox="0 0 120 120"><defs><path id="cxst" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0"/></defs><text><textPath href="#cxst">TODOSISTEMAS STI · +22 AÑOS · TODOSISTEMAS STI · +22 AÑOS ·</textPath></text></svg><span class="cx-stamp__core">+22</span>` +
      ["Humana", "Adaptable", "Ética"].map((t, i) => `<span class="cx-value" style="--d:${i};${["left:4%;bottom:14%", "left:30%;bottom:0", "right:34%;top:2%"][i]}">${ico(["users", "refresh", "shield"][i])}${t}</span>`).join(""),

    // 4 · Muro con los logos reales de clientes y su testimonio
    "casos-de-exito": () =>
      `<div class="cx-logos">${CLIENTS.map(([f, n], i) => `<span style="--d:${i}"><img src="assets/img/clientes/${f}-white.png" alt="${n}" /></span>`).join("")}</div>` +
      glass(`<span class="cx-quote__mark">“</span><p>Desde que trabajamos con Todosistemas STI, el proceso se volvió mucho más claro. Hoy tenemos control real.</p><small>Mario Ordoñez · Contador</small>`, "cx-quote") +
      glass(`<b>+5.000</b><small>equipos implementados</small>`, "cx-count cx-count--r"),
  };

  const sceneFor = SCENES[page];
  const mountScene = (target) => {
    target.innerHTML = `<div class="dv-scene dv-scene--${page}" aria-hidden="true">${sceneFor()}</div>`;
    // Contadores dentro de las pantallas
    target.querySelectorAll("[data-ui-count]").forEach((el) => {
      const end = Number(el.dataset.uiCount);
      if (reduceMotion) return (el.textContent = end.toLocaleString("es-CO"));
      let n = Math.round(end * 0.85);
      el.textContent = n.toLocaleString("es-CO");
      setInterval(() => {
        n += 1 + Math.round(Math.random() * 2);
        el.textContent = n.toLocaleString("es-CO");
      }, 900);
    });
  };

  const pageHero = document.querySelector(".placeholder-hero");
  if (pageHero && sceneFor) {
    const container = pageHero.querySelector(".container");
    const content = document.createElement("div");
    content.className = "ph-split__content";
    content.append(...container.childNodes);
    const visual = document.createElement("div");
    visual.className = "hero-v2__visual";
    mountScene(visual);
    container.classList.add("ph-split");
    container.append(content, visual);
    pageHero.classList.add("placeholder-hero--split");
    pageHero.querySelector(".dyn-docs")?.remove();
  }

  // Título de los recuadros azules "01 · 02 · 03" de cada página
  const PANEL_TITLES = {
    "gestion-documental": "DocuClick · Flujo documental", "auraquantic-bpms": "AuraQuantic · Proceso sin código", "automatizacion-bpm": "BPM · Proceso end-to-end",
    "blue-prism": "Blue Prism WorkHQ", "softexpert-suite": "SoftExpert Suite", enjisst: "ENJISST · Calidad de software", "fabrica-software": "Fábrica de software",
    "ia-agentica": "Desarrollo con IA Agéntica", "modernizacion-sistemas": "Modernización de sistemas", "gobernabilidad-datos": "Gobierno de datos · DAMA-DMBOK",
    "soporte-ti": "Mesa de ayuda · Nivel 1 y 2", "outsourcing-ti": "Outsourcing de TI", "staffing-ti": "PeopleHEF · Selección", rrhh: "Gestión de RRHH",
  };

  /* ------------------------------------------------------------------ */
  /* Recuadros azules "01 · 02 · 03" de cada página: pasan a ser panel  */
  /* animado como el del inicio (los pasos se van completando).         */
  /* ------------------------------------------------------------------ */
  document.querySelectorAll(".steps-card").forEach((card) => {
    const items = [...card.querySelectorAll(".steps-card__item")];
    if (!items.length) return;
    const head = document.createElement("div");
    head.className = "doc-panel__head steps-card__head";
    head.innerHTML = `<span class="doc-panel__dots"><i></i><i></i><i></i></span><span class="doc-panel__title">${PANEL_TITLES[page] || "Cómo funciona"}</span><span class="doc-panel__live"><i></i>En vivo</span>`;
    card.prepend(head);
    items.forEach((item) => {
      item.setAttribute("data-doc-step", "");
      item.insertAdjacentHTML("beforeend", '<span class="doc-step__badge"></span>');
    });
    const bar = document.createElement("div");
    bar.className = "doc-panel__progress";
    bar.innerHTML = "<span></span>";
    card.append(bar);
    card.classList.add("steps-card--panel");
    card.setAttribute("data-doc-flow", "");
  });

  /* ------------------------------------------------------------------ */
  /* Paneles: el elemento recorre el flujo paso a paso y se repite      */
  /* ------------------------------------------------------------------ */
  document.querySelectorAll("[data-doc-flow]").forEach((flow) => {
    const steps = [...flow.querySelectorAll("[data-doc-step]")];
    const setStep = (current) => {
      steps.forEach((step, i) => {
        step.classList.toggle("is-done", i < current);
        step.classList.toggle("is-active", i === current);
      });
      flow.style.setProperty("--doc-progress", `${(current / steps.length) * 100}%`);
      flow.classList.toggle("is-approved", current >= steps.length);
    };

    if (reduceMotion) {
      setStep(steps.length);
      return;
    }
    let current = 0;
    const tick = () => {
      setStep(current);
      const done = current >= steps.length;
      current = done ? 0 : current + 1;
      setTimeout(tick, done ? 2800 : 1500);
    };
    setTimeout(tick, 900);
  });

  /* ------------------------------------------------------------------ */
  /* Home: DocuClick se ilumina por turnos solo.                        */
  /* Si la persona pasa el mouse, se detiene para no pelear con ella.   */
  /* ------------------------------------------------------------------ */
  const autoCycle = (items, className, every, pauseOn) => {
    if (reduceMotion || items.length < 2) return;
    let i = Math.max(0, items.findIndex((el) => el.classList.contains(className)));
    setInterval(() => {
      if (pauseOn?.matches(":hover, :focus-within")) return;
      items[i].classList.remove(className);
      i = (i + 1) % items.length;
      items[i].classList.add(className);
    }, every);
  };

  // "Implementamos": al llegar a la sección, 01 → 02 → 03 se encienden
  // en cascada hacia abajo y los tres quedan prendidos.
  const stackItems = [...document.querySelectorAll("[data-stack-item]")];
  const stackList = stackItems[0]?.parentElement;
  if (stackList) {
    const lightAll = () => {
      stackItems.forEach((item) => item.classList.add("is-active"));
      stackList.classList.add("is-all-on");
    };
    if (reduceMotion || !hasIO) {
      lightAll();
    } else {
      stackItems.forEach((item, i) => i > 0 && item.classList.remove("is-active"));
      const stackObserver = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return;
          stackObserver.disconnect();
          stackItems.forEach((item, i) =>
            setTimeout(() => item.classList.add("is-active", "dyn-pop"), 250 + i * 450)
          );
          setTimeout(lightAll, 250 + stackItems.length * 450);
        },
        { threshold: 0.4 }
      );
      stackObserver.observe(stackList);
    }
  }

  const docuItems = [...document.querySelectorAll(".docu__item")];
  docuItems[0]?.classList.add("dyn-lit");
  autoCycle(docuItems, "dyn-lit", 1600, null);

  /* ------------------------------------------------------------------ */
  /* Frase que se escribe y se borra sola (data-typed="a|b|c")          */
  /* ------------------------------------------------------------------ */
  document.querySelectorAll("[data-typed]").forEach((el) => {
    if (reduceMotion) return;
    const words = el.dataset.typed.split("|");
    let w = 0;
    let len = words[0].length;
    let deleting = true;
    const loop = () => {
      if (deleting) {
        len--;
        if (len === 0) {
          deleting = false;
          w = (w + 1) % words.length;
        }
      } else {
        len++;
      }
      el.textContent = words[w].slice(0, len);
      let delay = deleting ? 35 : 70;
      if (!deleting && len === words[w].length) {
        deleting = true;
        delay = 2200;
      }
      setTimeout(loop, delay);
    };
    setTimeout(loop, 2600);
  });

  /* ------------------------------------------------------------------ */
  /* Títulos de los hero: entran palabra por palabra                    */
  /* ------------------------------------------------------------------ */
  if (!reduceMotion) {
    document.querySelectorAll(".hero__title, .placeholder-hero h1").forEach((title) => {
      let i = 0;
      const wrap = (el) => {
        el.classList.add("dyn-word");
        el.style.setProperty("--i", String(i++));
      };
      [...title.childNodes].forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          node.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.append(document.createTextNode(part));
              return;
            }
            const span = document.createElement("span");
            span.textContent = part;
            wrap(span);
            frag.append(span);
          });
          node.replaceWith(frag);
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== "BR") {
          wrap(node);
        }
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Tarjetas que brillan + inclinación 3D siguiendo el mouse           */
  /* ------------------------------------------------------------------ */
  const CARD_SELECTOR = [
    ".value-card",
    ".service-card",
    ".module-card",
    ".blog-card",
    ".testimonial-card",
    ".stat-row__item",
    ".hero-v2__stat",
    ".timeline__card",
  ].join(",");

  const cards = document.querySelectorAll(CARD_SELECTOR);

  cards.forEach((card, index) => {
    card.classList.add("dyn-card");
    const spot = document.createElement("span");
    spot.className = "dyn-card__spot";
    spot.setAttribute("aria-hidden", "true");
    const border = document.createElement("span");
    border.className = "dyn-card__border";
    border.setAttribute("aria-hidden", "true");
    card.append(spot, border);

    // Relleno de color que nace desde donde entra el mouse o el dedo
    // Las tarjetas desplegables del home se quedan blancas: su ilustración
    // tiene fondo blanco y sobre color se ve como un parche.
    if (!card.matches(".testimonial-card, .service-card--collapsible")) {
      const fill = document.createElement("span");
      fill.className = "dyn-card__fill";
      fill.setAttribute("aria-hidden", "true");
      card.prepend(fill);
      card.dataset.dynTone = String(index % 3);
    }

    // Los hitos de la línea del tiempo se encienden solos y quedan prendidos
    if (!card.matches(".testimonial-card, .timeline__card, .service-card--collapsible")) {
      const setOrigin = (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--fx", `${e.clientX - rect.left}px`);
        card.style.setProperty("--fy", `${e.clientY - rect.top}px`);
      };

      card.addEventListener("pointerenter", (e) => {
        if (e.pointerType !== "mouse") return;
        setOrigin(e);
        card.classList.add("is-lit");
      });
      card.addEventListener("pointerleave", (e) => {
        if (e.pointerType === "mouse") card.classList.remove("is-lit");
      });

      // En celular: el toque pinta el cuadro y apaga el anterior
      card.addEventListener("pointerdown", (e) => {
        if (e.pointerType === "mouse") return;
        setOrigin(e);
        const wasLit = card.classList.contains("is-lit");
        document.querySelectorAll(".dyn-card.is-lit:not(.timeline__card)").forEach((c) => c.classList.remove("is-lit"));
        if (!wasLit) card.classList.add("is-lit");
      });
    }

    if (!finePointer) return;

    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);

      // Las cifras de la barra del hero no se inclinan
      if (reduceMotion || card.matches(".hero-v2__stat, .service-card--collapsible")) return;
      const rx = (y / rect.height - 0.5) * -7;
      const ry = (x / rect.width - 0.5) * 7;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });

  /* ------------------------------------------------------------------ */
  /* Conteo de la barra de cifras del hero (+22, +15, +5.000)          */
  /* Las de .stat-row ya las cuenta main.js; aquí solo se iluminan al   */
  /* terminar.                                                          */
  /* ------------------------------------------------------------------ */
  const countUp = (el) => {
    const raw = el.textContent.trim();
    const match = raw.match(/^([+-]?)([\d.,]*\d)(.*)$/);
    if (!match || reduceMotion) return;
    const [, prefix, numStr, suffix] = match;
    const usesThousandDot = numStr.includes(".");
    const target = parseInt(numStr.replace(/[.,]/g, ""), 10);
    const format = (v) => {
      let s = String(Math.round(v));
      if (usesThousandDot) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return `${prefix}${s}${suffix}`;
    };
    const duration = 1600;
    let start = null;
    const step = (t) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / duration, 1);
      el.textContent = format(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
      else {
        el.textContent = format(target);
        el.classList.add("dyn-counted");
      }
    };
    requestAnimationFrame(step);
  };

  const heroNumbers = document.querySelectorAll(".hero-v2__stat strong");
  const rowNumbers = document.querySelectorAll(".stat-row__item strong");

  if (hasIO) {
    const numberObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          numberObserver.unobserve(el);
          if (el.closest(".hero-v2__stat")) countUp(el);
          else setTimeout(() => el.classList.add("dyn-counted"), 1250);
        });
      },
      { threshold: 0.4 }
    );
    heroNumbers.forEach((el) => numberObserver.observe(el));
    rowNumbers.forEach((el) => numberObserver.observe(el));
  }

  /* ------------------------------------------------------------------ */
  /* Nosotros: la línea del tiempo se dibuja y cada hito se va         */
  /* encendiendo a su paso; al final toda la línea queda prendida.      */
  /* ------------------------------------------------------------------ */
  document.querySelectorAll("[data-timeline]").forEach((timeline) => {
    const items = [...timeline.querySelectorAll(".timeline__item")];
    const axis = timeline.querySelector(".timeline__axis");
    const STEP = 1100; // tiempo entre un año y el siguiente
    const TRAVEL = 750; // lo que tarda la línea en llegar al punto

    // Qué fracción de la línea hay que llenar para llegar al punto del año
    const progressTo = (item) => {
      const a = axis.getBoundingClientRect();
      const d = item.querySelector(".timeline__dot").getBoundingClientRect();
      const vertical = a.height > a.width;
      const pos = vertical ? d.top + d.height / 2 - a.top : d.left + d.width / 2 - a.left;
      const len = vertical ? a.height : a.width;
      return Math.min(1, Math.max(0, pos / len));
    };

    const turnOn = (item) => {
      item.classList.add("is-on");
      item.querySelector(".timeline__card")?.classList.add("is-lit");
    };

    const lightUp = (instant) => {
      timeline.classList.add("is-in");
      if (instant) {
        timeline.style.setProperty("--tl-progress", "1");
        items.forEach(turnOn);
        timeline.classList.add("is-done");
        return;
      }
      items.forEach((item, i) => {
        setTimeout(() => {
          timeline.style.setProperty("--tl-progress", String(progressTo(item)));
          setTimeout(() => turnOn(item), i === 0 ? 0 : TRAVEL);
        }, 500 + i * STEP);
      });
      setTimeout(() => {
        timeline.style.setProperty("--tl-progress", "1");
        timeline.classList.add("is-done");
      }, 500 + items.length * STEP);
    };

    if (reduceMotion || !hasIO) {
      lightUp(true);
      return;
    }
    const timelineObserver = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        lightUp(false);
        timelineObserver.disconnect();
      },
      { threshold: 0.25 }
    );
    timelineObserver.observe(timeline);
  });

  /* ------------------------------------------------------------------ */
  /* Entradas escalonadas al hacer scroll                               */
  /* ------------------------------------------------------------------ */
  if (!reduceMotion && hasIO) {
    const REVEAL_SELECTOR = `${CARD_SELECTOR}, .steps-card__item`;

    // Tarjetas sin [data-reveal] propio ni en un ancestro
    const targets = [...document.querySelectorAll(REVEAL_SELECTOR)].filter(
      (el) => !el.closest("[data-reveal]") && !el.closest(".hero, .placeholder-hero")
    );

    targets.forEach((el) => {
      const siblings = [...el.parentElement.children].filter((c) => c.matches(REVEAL_SELECTOR));
      el.style.setProperty("--dyn-i", String(Math.min(siblings.indexOf(el), 8)));
      el.classList.add("dyn-reveal");
    });

    // Los [data-reveal] hermanos (ej. tarjetas de servicio) también se escalonan
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      const siblings = [...el.parentElement.children].filter((c) => c.hasAttribute("data-reveal"));
      const i = siblings.indexOf(el);
      if (siblings.length < 2 || i < 1) return;
      el.style.transitionDelay = `${Math.min(i, 8) * 90}ms`;
      el.addEventListener("transitionend", () => (el.style.transitionDelay = ""), { once: true });
    });

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.classList.add("is-in");
          el.addEventListener("transitionend", () => el.classList.add("is-done"), { once: true });
          revealObserver.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach((el) => revealObserver.observe(el));
  }
})();
