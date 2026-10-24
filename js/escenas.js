/**
 * Escenas de "Características clave": un ejemplo visual distinto para cada
 * característica (mini interfaces animadas). Va antes de interactivo.js.
 * Las etiquetas salen del propio texto de la característica o son nombres
 * genéricos de interfaz; no se muestran cifras ni resultados inventados.
 */
(() => {
  "use strict";

  const svg = (d, extra = "") =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`;
  const I = {
    check: svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
    x: svg('<path d="M7 7l10 10M17 7L7 17"/>'),
    user: svg('<circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.6 3.6-6 7-6s6.2 2.4 7 6"/>'),
    doc: svg('<path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z"/><path d="M14 3v5h5"/>'),
    search: svg('<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4-4"/>'),
    bot: svg('<rect x="5" y="8" width="14" height="11" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01"/>'),
    spark: svg('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>'),
    shield: svg('<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>'),
    plug: svg('<path d="M9 7V3M15 7V3M7 7h10v4a5 5 0 01-10 0zM12 16v5"/>'),
    lock: svg('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>'),
    book: svg('<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 19V5"/>'),
    clock: svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
    scan: svg('<path d="M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3M4 12h16"/>'),
  };

  const bar = (title) =>
    `<div class="sc__app"><span class="sc__brand">T/S</span><span class="sc__nav"><b>Inicio</b><b>Tareas</b><b>Reportes</b></span><span class="sc__find">${I.search}</span><span class="sc__me"></span></div><div class="sc__bar"><span class="sc__crumb"></span><b>${title}</b></div>`;
  const win = (title, body, cls = "") => `<div class="sc__win ${cls}">${bar(title)}<div class="sc__body">${body}</div></div>`;
  const sk = (w) => `<span class="sc-sk" style="width:${w}%"></span>`;
  const a = (i) => `style="--i:${i}"`;
  // Código de barras del rótulo: barras de ancho variable, separadas por espacios
  const BARS = [2, 1, 1, 1, 3, 1, 1, 2, 2, 1, 1, 1, 3, 2, 1, 1, 2, 1, 1, 3, 1, 1, 2, 2, 1, 1, 3, 1, 1, 2, 2, 1, 1, 1, 3, 1, 2, 1, 1, 2]
    .reduce((acc, w, i) => {
      if (i % 2 === 0) acc.svg += `<rect x="${acc.x.toFixed(1)}" width="${w * 0.9}" height="30"/>`;
      acc.x += w * 0.9 + (i % 2 ? 0.5 : 0);
      return acc;
    }, { x: 2, svg: "" }).svg;

  /* ---------------------------------------------------------------- */
  /* Tipos de escena                                                  */
  /* ---------------------------------------------------------------- */
  const S = {
    // Lista de tickets con estado
    tickets: (f, p = {}) =>
      win(
        "Mesa de ayuda",
        (p.rows || [["Incidencia", "Abierta", "warn", "El equipo no enciende"], ["Solicitud", "En curso", "info", "Acceso a una aplicación"], ["Incidencia", "Cerrada", "ok", "Restablecer contraseña"]])
          .map(
            ([t, s, k, d], i) =>
              `<div class="sc-row sc-a" ${a(i)}><span class="sc-ico">${I.doc}</span><span class="sc-txt"><b>${t} #${1024 + i}</b><small>${d || ""}</small></span><em class="sc-pill sc-pill--${k}">${s}</em></div>`
          )
          .join("")
      ),

    // Cronómetro de respuesta
    clock: (f) =>
      win(
        "Tiempo de respuesta",
        `<div class="sc-clock"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" class="sc-clock__bg"/><circle cx="60" cy="60" r="50" class="sc-clock__fg"/></svg><span>${I.clock}</span></div>
         <div class="sc-row sc-a" ${a(1)}><span class="sc-ico">${I.check}</span><span class="sc-txt"><b>Incidencia menor</b><small>Respuesta inmediata</small></span></div>
         <div class="sc-row sc-a" ${a(2)}><span class="sc-ico">${I.clock}</span><span class="sc-txt"><b>Caso complejo</b><small>Actualizaciones regulares</small></span></div>`
      ),

    // Lista de verificación
    verify: (f, p = {}) =>
      win(
        p.title || "Verificación",
        `<div class="sc-shield sc-a" ${a(0)}>${I.shield}</div>` +
          (p.items || ["Resuelto", "Verificado", "Recomendaciones"])
            .map((t, i) => `<div class="sc-check sc-a" ${a(i + 1)}><span>${I.check}</span>${t}</div>`)
            .join("")
      ),

    // Bloques que crecen (tamaños, escalas)
    sizes: (f, p = {}) =>
      win(
        p.title || "Escala",
        `<div class="sc-sizes">${(p.labels || ["Inicio", "Crece", "Escala"])
          .map((t, i) => `<div class="sc-size sc-a" ${a(i)}><span style="--h:${30 + i * 30}%"></span><small>${t}</small></div>`)
          .join("")}</div>`
      ),

    // Equipo con roles
    team: (f, p = {}) =>
      win(
        p.title || "Equipo",
        `<div class="sc-team">${(p.roles || ["Desarrollo", "QA", "Infraestructura", "Datos"])
          .map(
            (r, i) =>
              `<div class="sc-member sc-a" ${a(i)}><span class="sc-av">${r
                .replace(/[^A-Za-zÁÉÍÓÚÑ ]/g, "")
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}</span><small>${r}</small></div>`
          )
          .join("")}</div>`
      ),

    // Conectores hacia otros sistemas
    connect: (f, p = {}) => {
      const sys = p.systems || ["ERP", "CRM", "API", "Base de datos"];
      return win(
        p.title || "Integraciones",
        `<div class="sc-connect"><svg class="sc-connect__lines" viewBox="0 0 300 200" preserveAspectRatio="none"><path d="M150 100L45 35M150 100L255 35M150 100L45 165M150 100L255 165"/></svg>
         <span class="sc-hub">${I.plug}</span>${sys
           .map((s, i) => `<span class="sc-node sc-a" ${a(i)} data-p="${i}">${s}</span>`)
           .join("")}</div>`
      );
    },

    // Etapas de un pipeline
    pipeline: (f, p = {}) =>
      win(
        p.title || "Pipeline",
        `<div class="sc-pipe">${(p.stages || ["Código", "Pruebas", "Seguridad", "Despliegue"])
          .map(
            (s, i) =>
              `<div class="sc-stage sc-a" ${a(i)}><span class="sc-stage__dot">${I.check}</span><small>${s}</small></div>`
          )
          .join('<i class="sc-pipe__line"></i>')}</div>
         <div class="sc-progress"><span></span></div>`
      ),

    // Buscador con resultados
    search: (f, p = {}) =>
      win(
        p.title || "Búsqueda",
        `<div class="sc-search"><span>${I.search}</span><b class="sc-type">${p.query || "Buscar…"}</b></div>` +
          (p.results || [["Contrato de servicios.pdf", "Jurídica · Expediente 2026-018"], ["Factura proveedor.pdf", "Financiera · Radicado 2026-00418"], ["Acta de comité.pdf", "Gerencia · Serie Actas"]])
            .map(
              ([t, d], i) =>
                `<div class="sc-row sc-a" ${a(i + 1)}><span class="sc-ico">${p.icon === "user" ? I.user : I.doc}</span><span class="sc-txt"><b>${t}</b><small>${d}</small></span><em class="sc-pill sc-pill--ok">Ver</em></div>`
            )
            .join("")
      ),

    // Embudo de selección
    funnel: (f, p = {}) =>
      win(
        p.title || "Proceso de selección",
        `<div class="sc-funnel">${(p.stages || ["Postulados", "Entrevista", "Prueba técnica", "Finalista"])
          .map((s, i, arr) => `<div class="sc-funnel__lv sc-a" style="--i:${i};--w:${100 - i * (45 / (arr.length - 1))}%"><span class="sc-funnel__n">${i + 1}</span><small>${s}</small></div>`)
          .join("")}</div>`
      ),

    // Barras que bajan (costos)
    cost: (f) =>
      win(
        "Costos operativos",
        `<div class="sc-bars sc-bars--down">${[90, 74, 58, 44, 32]
          .map((h, i) => `<span class="sc-a" style="--i:${i};--h:${h}%"></span>`)
          .join("")}<i class="sc-arrow">↘</i></div>`
      ),

    // Velocímetro
    gauge: (f) =>
      win(
        "Eficiencia",
        `<div class="sc-gauge"><svg viewBox="0 0 200 110"><path d="M20 100A80 80 0 01180 100" class="sc-gauge__bg"/><path d="M20 100A80 80 0 01180 100" class="sc-gauge__fg"/></svg><i class="sc-gauge__needle"></i></div>
         <div class="sc-chips"><span>Coordinación</span><span>Recursos</span><span>Productividad</span></div>`
      ),

    // Tablero con gráfica
    dashboard: (f, p = {}) =>
      win(
        p.title || "Tablero",
        `<div class="sc-kpis">${(p.kpis || [["Procesos activos", "24"], ["Pendientes", "7"], ["A tiempo", "112"]])
          .map(([l, v], i) => `<div class="sc-kpi sc-a" ${a(i)}><small>${l}</small><b>${v}</b></div>`)
          .join("")}</div>
         <svg class="sc-chart" viewBox="0 0 300 100" preserveAspectRatio="none"><path class="sc-chart__area" d="M0 85L50 70L100 75L150 50L200 40L250 30L300 15V100H0Z"/><path class="sc-chart__line" d="M0 85L50 70L100 75L150 50L200 40L250 30L300 15"/></svg>`
      ),

    // Errores que se corrigen
    errors: (f) =>
      win(
        "Validaciones",
        ["Dato duplicado", "Campo vacío", "Formato inválido"]
          .map(
            (t, i) =>
              `<div class="sc-fix sc-a" ${a(i)}><span class="sc-fix__ico"><b class="sc-fix__x">${I.x}</b><b class="sc-fix__ok">${I.check}</b></span>${t}</div>`
          )
          .join("")
      ),

    // Robot que completa tareas
    robot: (f) =>
      win(
        "Tareas automáticas",
        `<div class="sc-bot sc-a" ${a(0)}>${I.bot}</div>` +
          ["Copiar datos", "Generar reporte", "Notificar"]
            .map((t, i) => `<div class="sc-check sc-check--auto sc-a" ${a(i + 1)}><span>${I.check}</span>${t}</div>`)
            .join("")
      ),

    // Usuarios con permisos
    roles: (f, p = {}) =>
      win(
        p.title || "Roles y permisos",
        (p.rows || [["Administrador", true, "Todos los permisos"], ["Editor", true, "Crear y editar documentos"], ["Consulta", false, "Solo lectura"]])
          .map(
            ([r, on, d], i) =>
              `<div class="sc-row sc-a" ${a(i)}><span class="sc-ico">${I.user}</span><span class="sc-txt"><b>${r}</b><small>${d || ""}</small></span><i class="sc-toggle${on ? " is-on" : ""}"></i></div>`
          )
          .join("")
      ),

    // Constructor de flujos
    flow: (f, p = {}) =>
      win(
        p.title || "Diseñador",
        `<div class="sc-flow"><svg viewBox="0 0 300 170" preserveAspectRatio="none"><path d="M60 45C110 45 100 125 150 125M150 125C200 125 190 45 240 45"/></svg>
         ${(p.nodes || ["Inicio", "Tarea", "Fin"])
           .map((n, i) => `<span class="sc-fnode sc-a" ${a(i)} data-p="${i}">${n}</span>`)
           .join("")}<i class="sc-cursor"></i></div>`
      ),

    // Chat con IA
    ai: (f, p = {}) =>
      win(
        p.title || "Asistente IA",
        (p.conv || [["me", "¿Qué sigue?"], ["ai", "Propuesta lista para revisión humana."]])
          .map(([who, t], i) =>
            who === "chips"
              ? `<div class="sc-chips sc-chat sc-a" style="--i:${i * 3}">${t.map((c) => `<span>${c}</span>`).join("")}</div>`
              : `<div class="sc-msg sc-chat${who === "me" ? " sc-msg--me" : ""} sc-a" style="--i:${i * 3}">${who === "ai" ? `<span class="sc-msg__ai">${I.spark}</span>` : ""}${t}</div>`
          )
          .join("") +
          `<div class="sc-msg sc-msg--typing sc-chat sc-a" style="--i:${(p.conv || [1, 2]).length * 3}"><i></i><i></i><i></i></div>`
      ),

    // Registro de actividad
    log: (f, p = {}) =>
      win(
        p.title || "Registro de actividad",
        `<div class="sc-log">${(p.items || ["Creado", "Aprobado", "Modificado", "Consultado"])
          .map((t, i) => `<div class="sc-log__it sc-a" ${a(i)}><i></i><b>${t}</b><small>${(p.meta || ["Usuario: A. Rojas", "Usuario: M. Pérez", "Usuario: L. Gómez", "Usuario: C. Díaz"])[i % 4]} · ${["08:15", "09:40", "11:02", "14:27"][i % 4]}</small></div>`)
          .join("")}</div>`
      ),

    // Árbol jerárquico
    tree: (f) =>
      win(
        "Árbol de características",
        `<div class="sc-tree"><span class="sc-tnode sc-a" ${a(0)}>Negocio</span>
         <div class="sc-tree__lv">${["Riesgo alto", "Riesgo medio", "Riesgo bajo"]
           .map((t, i) => `<span class="sc-tnode sc-tnode--${i} sc-a" ${a(i + 1)}>${t}</span>`)
           .join("")}</div>
         <div class="sc-tree__lv sc-tree__lv--leaf">${[0, 1, 2, 3, 4]
           .map((i) => `<span class="sc-tleaf sc-a" ${a(i + 4)}>Prueba</span>`)
           .join("")}</div></div>`
      ),

    // Plantilla con campos
    template: (f, p = {}) =>
      win(
        p.title || "Plantilla",
        `<div class="sc-form">${(p.fields || ["Tipo documental", "Fecha", "Responsable", "Serie"])
          .map((t, i) => `<div class="sc-field sc-a" ${a(i)}><small>${t}</small><span class="sc-field__in"><i></i></span></div>`)
          .join("")}</div>`
      ),

    // Escáner con hoja y rótulo: escaneo, páginas capturadas, rótulo con código de barras y flujo
    scanner: (f) =>
      win(
        "Escáner",
        `<div class="sc-scan">
           <div class="sc-scan__dev">
             <div class="sc-scan__bed"><div class="sc-scan__sheet">${sk(70)}${sk(85)}${sk(60)}${sk(75)}${sk(50)}<i class="sc-scan__beam"></i></div></div>
             <div class="sc-scan__pages">${[1, 2, 3].map((n, i) => `<span class="sc-a" ${a(i + 1)}>${I.doc}<small>Pág. ${n}</small></span>`).join("")}</div>
           </div>
           <div class="sc-scan__label sc-a" ${a(2)}>
             <div class="sc-scan__lhead">${I.scan}<b>Rótulo</b><em class="sc-pill sc-pill--ok">Automático</em></div>
             <svg class="sc-scan__code" viewBox="0 0 69 30" preserveAspectRatio="none">${BARS}</svg>
             <dl>${[["Radicado", "2026-E-0184"], ["Tipo documental", "Contrato"], ["Dependencia", "Jurídica"]]
               .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
               .join("")}</dl>
           </div>
         </div>
         <div class="sc-scan__steps">${["Escanear", "Indexar", "Rotular", "Imprimir"]
           .map((t, i) => `<span class="sc-a" ${a(i + 4)}><i>${I.check}</i>${t}</span>`)
           .join("")}</div>`
      ),

    // Tablero tipo kanban
    kanban: (f) =>
      win(
        "Backlog del incremento",
        `<div class="sc-kanban">${["Backlog", "En curso", "Aceptado"]
          .map(
            (c, i) =>
              `<div class="sc-col sc-a" ${a(i)}><small>${c}</small>${[0, 1, 2]
                .slice(0, 3 - i)
                .map((_, k) => `<span class="sc-card">${[["Historia de usuario", "Prueba de aceptación", "Evidencia"], ["Ajuste de API", "Revisión de código"], ["Release piloto"]][i][k]}</span>`)
                .join("")}</div>`
          )
          .join("")}</div>`
      ),

    // Hitos en el tiempo
    roadmap: (f, p = {}) =>
      win(
        p.title || "Plan",
        `<div class="sc-road"><i class="sc-road__line"><b></b></i>${(p.steps || ["Inicio", "Paso 2", "Paso 3", "Entrega"])
          .map((s, i) => `<div class="sc-road__step sc-a" ${a(i)}><span>${i + 1}</span><small>${s}</small></div>`)
          .join("")}</div>`
      ),

    // Documentación compartida al equipo
    knowledge: (f) =>
      win(
        "Base de conocimiento",
        `<div class="sc-know"><div class="sc-know__docs">${[0, 1, 2]
          .map((i) => `<span class="sc-a" ${a(i)}>${I.book}</span>`)
          .join("")}</div><i class="sc-know__arrow">→</i><div class="sc-know__team">${["TI", "QA", "OPS"]
          .map((t, i) => `<span class="sc-av sc-a" ${a(i + 3)}>${t}</span>`)
          .join("")}</div></div>
         <div class="sc-chips"><span>Documentación</span><span>Conocimiento</span><span>Acompañamiento</span></div>`
      ),
  };

  /* ---------------------------------------------------------------- */
  /* Qué escena va con cada característica                            */
  /* ---------------------------------------------------------------- */
  const MAP = {
    // Fábrica de software
    "Integración con sistemas existentes": ["connect"],
    "Equipos dedicados": ["team", { roles: ["Product Lead", "Tech Lead", "Full-stack", "QA", "DevSecOps"] }],
    "QA y DevSecOps integrados": ["pipeline", { stages: ["Código", "Pruebas", "Seguridad", "CI/CD"] }],
    "Escalamiento progresivo": ["sizes", { labels: ["Célula ágil", "Bolsa de horas", "Escala"] }],
    // Outsourcing TI
    "Staffing especializado": ["team", { title: "Perfiles por sector" }],
    "Soporte técnico escalonado": ["tickets", { rows: [["Incidente básico", "Nivel 1", "info"], ["Caso complejo", "Nivel 2", "warn"], ["Incidente básico", "Resuelto", "ok"]] }],
    "Onboarding ágil": ["roadmap", { title: "Onboarding", steps: ["Equipo", "Procesos", "Herramientas", "Listo"] }],
    "Respaldo continuo": ["verify", { title: "Acompañamiento", items: ["Contratación", "Ejecución", "Todo el proyecto"] }],
    // Soporte de TI
    "Para empresas de todo tamaño": ["sizes", { title: "Cobertura", labels: ["Soporte básico", "Seguimiento", "Infraestructura compleja"] }],
    "Sistema de ticketing": ["tickets"],
    "Respuesta ágil": ["clock"],
    "Seguimiento posresolución": ["verify", { title: "Posresolución", items: ["Incidencia cerrada", "No se repite", "Recomendaciones"] }],
    // Staffing de TI
    "Búsqueda especializada": ["search", { title: "Candidatos", query: "Perfil técnico · sector", icon: "user", results: [["Desarrollador full-stack", "Sector financiero · Disponible"], ["Analista de QA", "Sector público · Disponible"], ["Ingeniero DevOps", "Sector salud · En entrevista"]] }],
    "Preselección con prueba técnica": ["funnel"],
    "Onboarding y seguimiento": ["roadmap", { title: "Seguimiento", steps: ["Contratación", "Ingreso", "Seguimiento", "Desempeño"] }],
    "Perfiles o células completas": ["team", { title: "Célula completa", roles: ["Desarrollo", "QA", "Líder técnico"] }],
    // AuraQuantic
    "Reducción de costos": ["cost"],
    "Mayor eficiencia": ["gauge"],
    "Control en tiempo real": ["dashboard", { title: "Operación en vivo", kpis: [["En ejecución", "36"], ["En espera", "5"], ["Finalizados hoy", "84"]] }],
    "Mitigación de errores": ["errors"],
    // Automatización BPM
    "Indicadores en tiempo real": ["dashboard", { title: "Indicadores" }],
    "Reducción de tareas manuales": ["robot"],
    Escalabilidad: ["sizes", { labels: ["Volumen", "Complejidad", "Crecimiento"] }],
    "Gobierno de procesos": ["roles", { title: "Gobierno del flujo", rows: [["Aprobador", true], ["Ejecutor", true], ["Auditor", false]] }],
    // Blue Prism
    "Automation Studio": ["flow", { title: "Automation Studio", nodes: ["Diseñar", "Probar", "Publicar"] }],
    "Agentes de IA integrados": ["ai", { title: "Agente de IA", conv: [["me", "Llegó una nueva solicitud de un cliente."], ["ai", "La clasifiqué como reclamo de facturación."], ["me", "¿Cuál es el siguiente paso?"], ["ai", "La envié al flujo de reclamos y avisé al responsable."], ["chips", ["Clasificada", "En flujo", "Auditable"]]] }],
    "Trazabilidad y cumplimiento": ["log", { title: "Auditoría", items: ["Automatización ejecutada", "Registrada", "Auditable", "Control normativo"] }],
    Conectores: ["connect", { title: "Conectores", systems: ["ERP", "CRM", "Correo", "Core"] }],
    // ENJISST
    "Estructura conceptual única": ["tree"],
    "Diagramación avanzada": ["flow", { title: "Diagramas", nodes: ["Caso de uso", "Entidad", "Negocio"] }],
    "Shift-left testing": ["ai", { title: "Ideas de prueba", conv: [["me", "Requisito: el usuario inicia sesión con correo y clave."], ["ai", "Te propongo estos escenarios de prueba:"], ["chips", ["Inicio exitoso", "Clave incorrecta", "Cuenta bloqueada", "Recuperar clave"]], ["me", "Agrégalos al plan de pruebas."], ["ai", "Listo, quedan antes de escribir el código."]] }],
    "Integración con DevOps": ["pipeline", { title: "Pipeline", stages: ["Commit", "Pruebas", "Resultados", "Despliegue"] }],
    // Gestión documental
    "Roles y usuarios": ["roles"],
    "Metadatos y plantillas": ["template"],
    "Impresión y escaneo": ["scanner"],
    "Consultas y reportes": ["search", { title: "Consultas", query: "Contrato 2026" }],
    // IA Agéntica
    "Productividad con IA": ["ai", { title: "IA en el ciclo", conv: [["me", "Necesito la historia de usuario del módulo de pagos."], ["ai", "Aquí tienes un borrador con criterios de aceptación."], ["me", "Pásalo a revisión del equipo."], ["ai", "Enviado. Nada se integra sin revisión humana."], ["chips", ["Requisitos", "Diseño", "Código", "Pruebas"]]] }],
    "Seguridad desde el diseño": ["verify", { title: "DevSecOps", items: ["Dependencias", "Vulnerabilidades", "Cada incremento"] }],
    "Control institucional": ["kanban"],
    "Plan de entrada en 30 días": ["roadmap", { title: "Primer mes", steps: ["Kick-off", "Discovery", "Primer sprint", "Release piloto"] }],
    // Modernización
    Flexibilidad: ["sizes", { title: "Capacidad", labels: ["Célula", "Bolsa de horas", "Demanda"] }],
    "Transferencia de conocimiento": ["knowledge"],
    "Gobierno y trazabilidad": ["log", { title: "Gobierno", items: ["Repositorio", "Identidades", "Ambientes", "Trazabilidad"] }],
    // RRHH
    "Selección y contratación": ["funnel", { stages: ["Vacante", "Selección", "Contratación", "Vinculado"] }],
    "Control documental": ["template", { title: "Expediente digital", fields: ["Colaborador", "Contrato", "Documentos", "Estado"] }],
    "Reportes gerenciales": ["dashboard", { title: "Reporte a dirección", kpis: [["Colaboradores", "152"], ["Ingresos del mes", "9"], ["Expedientes al día", "148"]] }],
    "Trazabilidad total": ["log"],
    // PayUp
    "Motor de escalamiento": ["roadmap", { title: "Reglas de escalamiento", steps: ["Día -3 · Recordatorio", "Día 1 · Aviso de mora", "Día 7 · Llamada IA", "Día 90 · Castigo"] }],
    "WhatsApp y agente de voz IA": ["ai", { title: "Gestión de cobro", conv: [["ai", "Andrés, su cuota AC-88213 lleva 7 días de mora."], ["me", "Sí, puedo pagar el viernes."], ["ai", "Listo, quedó registrada su promesa de pago."], ["chips", ["WhatsApp", "Llamada IA", "Promesa de pago"]]] }],
    "Evidencia de cada gestión": ["log", { title: "Evidencia · AC-88213", items: ["Recordatorio entregado", "Aviso de mora leído", "Llamada grabada", "Promesa de pago"], meta: ["WhatsApp", "WhatsApp", "Agente de voz IA", "Transcripción"] }],
    "Conexión con tu ERP": ["connect", { title: "Integraciones", systems: ["ERP", "n8n", "WhatsApp", "Voz IA"] }],
  };

  // Palabras clave para características que no estén en la lista
  const GUESS = [
    [/ticket|incidenc/i, "tickets"],
    [/tiempo|respuesta/i, "clock"],
    [/equipo|perfil|talento/i, "team"],
    [/integra|conect/i, "connect"],
    [/prueba|devops|qa|ci\/cd/i, "pipeline"],
    [/busca|consulta/i, "search"],
    [/indicador|reporte|tiempo real|dashboard/i, "dashboard"],
    [/rol|permiso|acceso/i, "roles"],
    [/traza|registro|audit/i, "log"],
    [/ia\b|inteligencia/i, "ai"],
    [/plantilla|metadato|document/i, "template"],
    [/escala|tamaño|crec/i, "sizes"],
    [/error/i, "errors"],
    [/costo/i, "cost"],
  ];
  const ORDER = Object.keys(S);

  window.tsiEscena = (type, params = {}) =>
    S[type] ? `<div class="sc sc--${type}" aria-hidden="true">${S[type]({}, params)}</div>` : "";

  window.tsiEscenas = (features) => {
    const used = new Set();
    return features.map((f) => {
      let [type, params] = MAP[f.title] || [];
      if (!type) type = (GUESS.find(([re]) => re.test(f.title + " " + f.desc)) || [])[1];
      if (!type || used.has(type)) type = ORDER.find((t) => !used.has(t) && t !== type) || type;
      used.add(type);
      return `<div class="sc sc--${type}" aria-hidden="true">${S[type](f, params || {})}</div>`;
    });
  };
})();
