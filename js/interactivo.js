/**
 * Capa interactiva (va después de dinamico.js).
 * Mapa mental de soluciones, recorrido "Cómo trabajamos", antes/después,
 * pestañas por sector y mapa de características en páginas internas.
 * Sin dependencias externas.
 */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Raíz del sitio (carpeta padre de js/), para enlazar páginas desde cualquier carpeta
  const ROOT = new URL("../", document.currentScript.src).href;

  // Ejecuta `fn` una vez cuando `el` entra en pantalla
  const onView = (el, fn, threshold = 0.25) => {
    if (!("IntersectionObserver" in window)) return fn();
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        fn();
      }
    }, { threshold });
    io.observe(el);
  };

  // Rota automáticamente entre elementos hasta que el usuario interactúa
  const autoplay = (root, count, show, delay) => {
    let i = 0;
    let timer = null;
    let stopped = reduceMotion;
    const tick = () => {
      i = (i + 1) % count;
      show(i, false);
    };
    const start = () => {
      if (stopped || timer) return;
      timer = setInterval(tick, delay);
    };
    const pause = () => {
      clearInterval(timer);
      timer = null;
    };
    root.addEventListener("mouseenter", pause);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", pause);
    return {
      start,
      stop() {
        stopped = true;
        pause();
      },
      set(n) {
        i = n;
      },
    };
  };

  /* ------------------------------------------------------------------ */
  /* Recorrido "Cómo trabajamos"                                        */
  /* ------------------------------------------------------------------ */
  document.querySelectorAll("[data-journey]").forEach((root) => {
    const steps = [...root.querySelectorAll(".journey__step")];
    const panels = [...root.querySelectorAll(".journey__panel")];
    const track = root.querySelector(".journey__track");

    const show = (i, fromUser) => {
      steps.forEach((s, k) => {
        s.classList.toggle("is-active", k === i);
        s.classList.toggle("is-done", k < i);
        s.setAttribute("aria-selected", k === i);
        s.tabIndex = k === i ? 0 : -1;
      });
      panels.forEach((p, k) => {
        p.hidden = k !== i;
        p.classList.remove("is-entering");
      });
      void panels[i].offsetWidth;
      panels[i].classList.add("is-entering");
      track.style.setProperty("--p", `${(i / (steps.length - 1)) * 100}%`);
      if (fromUser) {
        play.set(i);
        play.stop();
      }
    };

    const play = autoplay(root, steps.length, show, 5200);

    steps.forEach((s, i) => {
      s.addEventListener("click", () => show(i, true));
      s.addEventListener("keydown", (e) => {
        const dir = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (!dir) return;
        const n = (i + dir + steps.length) % steps.length;
        show(n, true);
        steps[n].focus();
      });
    });

    show(0, false);
    onView(root, () => play.start());
  });

  /* ------------------------------------------------------------------ */
  /* Antes / después                                                    */
  /* ------------------------------------------------------------------ */
  document.querySelectorAll("[data-ba]").forEach((ba) => {
    const range = ba.querySelector(".ba__range");
    const set = (v) => {
      ba.style.setProperty("--pos", `${v}%`);
      range.value = v;
    };
    range.addEventListener("input", () => set(range.value));

    // Al entrar en pantalla, la barra recorre la imagen para mostrar que se puede arrastrar
    if (reduceMotion) return;
    let touched = false;
    range.addEventListener("pointerdown", () => (touched = true));
    range.addEventListener("keydown", () => (touched = true));
    onView(ba, () => {
      const keys = [[0, 50], [900, 82], [1900, 18], [2900, 50]];
      const t0 = performance.now();
      const frame = (now) => {
        if (touched) return;
        const t = now - t0;
        let k = 1;
        while (k < keys.length - 1 && t > keys[k][0]) k++;
        const [ta, va] = keys[k - 1];
        const [tb, vb] = keys[k];
        const p = Math.min(1, Math.max(0, (t - ta) / (tb - ta)));
        const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        set(va + (vb - va) * e);
        if (t < keys[keys.length - 1][0]) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }, 0.5);
  });

  /* ------------------------------------------------------------------ */
  /* Pestañas (casos de uso y soluciones)                             */
  /* ------------------------------------------------------------------ */
  document.querySelectorAll("[data-tabs]").forEach((root) => {
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));

    const show = (i, fromUser) => {
      tabs.forEach((t, k) => {
        t.setAttribute("aria-selected", k === i);
        t.tabIndex = k === i ? 0 : -1;
      });
      panels.forEach((p, k) => (p.hidden = k !== i));
      if (fromUser) play.stop();
    };

    const play = autoplay(root, tabs.length, show, 6500);

    tabs.forEach((t, i) => {
      t.addEventListener("click", () => show(i, true));
      t.addEventListener("keydown", (e) => {
        const dir = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (!dir) return;
        const n = (i + dir + tabs.length) % tabs.length;
        show(n, true);
        tabs[n].focus();
      });
    });

    show(0, false);
    if (root.dataset.tabs !== "manual") onView(root, () => play.start());
  });

  /* ------------------------------------------------------------------ */
  /* Páginas internas: "Características clave" como pestañas en fila    */
  /* ------------------------------------------------------------------ */
  const featSection = [...document.querySelectorAll("section")].find((s) => {
    const h2 = s.querySelector("h2");
    return h2 && /Características/i.test(h2.textContent) && s.querySelectorAll(".value-card").length >= 3;
  });

  if (featSection) {
    const cards = [...featSection.querySelectorAll(".value-card")];
    const grid = featSection.querySelector(".value-grid");
    const name = document.title.split(/ · | — |:/)[0].trim();
    const data = cards.map((c) => ({
      icon: c.querySelector(".value-card__icon")?.innerHTML || "",
      title: c.querySelector("h3").textContent.trim(),
      desc: c.querySelector("p")?.textContent.trim() || "",
    }));
    const num = (i) => String(i + 1).padStart(2, "0");
    const scenes = window.tsiEscenas ? window.tsiEscenas(data) : data.map(() => "");

    const ft = document.createElement("div");
    ft.className = "ftabs";
    // Botón de demo: el mismo destino que "Comienza ahora" de la página
    const demoHref = document.querySelector(".header__cta-desktop")?.getAttribute("href") || "#";
    const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17L17 7M17 7H8M17 7v9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const chev = '<svg class="ftabs__chev" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    ft.innerHTML =
      `<div class="ftabs__list" role="tablist" aria-label="Características">${data
        .map((d, i) => `<button class="ftabs__tab" type="button" role="tab" id="ft-${i}" aria-controls="fp-${i}" style="--c:${i}"><span class="ftabs__icon">${d.icon}</span><span class="ftabs__name">${d.title}</span>${chev}<i class="ftabs__bar"></i></button>`)
        .join("")}</div>` +
      `<div class="ftabs__panels">${data
        .map(
          (d, i) => `<div class="ftabs__panel" id="fp-${i}" role="tabpanel" aria-labelledby="ft-${i}" style="--c:${i}" hidden>
        <div class="ftabs__head">
          <span class="ftabs__hex">${d.icon}</span>
          <div class="ftabs__text">
            <h3>${d.title}</h3>
            <p>${d.desc}</p>
          </div>
          <a class="btn btn--primary ftabs__cta" href="${demoHref}">Agenda una demo ${arrow}</a>
        </div>
        ${scenes[i]}
      </div>`
        )
        .join("")}</div>`;

    const tabs = [...ft.querySelectorAll(".ftabs__tab")];
    const panels = [...ft.querySelectorAll(".ftabs__panel")];

    const show = (i, fromUser) => {
      tabs.forEach((t, k) => {
        t.setAttribute("aria-selected", k === i);
        t.tabIndex = k === i ? 0 : -1;
        t.classList.toggle("is-timed", k === i && !fromUser && !play.stopped);
      });
      panels.forEach((p, k) => (p.hidden = k !== i));
      const list = tabs[i].parentElement;
      if (list.scrollWidth > list.clientWidth) list.scrollTo({ left: tabs[i].offsetLeft - (list.clientWidth - tabs[i].offsetWidth) / 2, behavior: reduceMotion ? "auto" : "smooth" });
      if (fromUser) {
        play.stop();
        tabs.forEach((t) => t.classList.remove("is-timed"));
      }
    };

    const play = autoplay(ft, tabs.length, show, 6000);
    const stop = play.stop;
    play.stop = () => {
      play.stopped = true;
      stop();
    };

    tabs.forEach((t, i) => {
      t.addEventListener("click", () => show(i, true));
      t.addEventListener("keydown", (e) => {
        const dir = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (!dir) return;
        const n = (i + dir + tabs.length) % tabs.length;
        show(n, true);
        tabs[n].focus();
      });
    });

    grid.after(ft);
    featSection.classList.add("has-ftabs");
    show(0, false);
    tabs[0].classList.remove("is-timed");
    onView(ft, () => {
      tabs[0].classList.add("is-timed");
      play.start();
    });
  }

  /* ------------------------------------------------------------------ */
  /* Aviso de cookies                                                   */
  /* ------------------------------------------------------------------ */
  // La preferencia se guarda en este navegador. Cuando el sitio use
  // analítica o publicidad, debe cargarse solo si la categoría está
  // aceptada (escuchar el evento "tsi:cookies").
  const COOKIE_KEY = "tsi-cookies";
  const readConsent = () => {
    try {
      return JSON.parse(localStorage.getItem(COOKIE_KEY));
    } catch {
      return null;
    }
  };
  const saveConsent = (analitica, publicidad) => {
    const consent = { necesarias: true, analitica, publicidad, fecha: new Date().toISOString() };
    try {
      localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
    } catch {}
    window.tsiCookies.consent = consent;
    document.dispatchEvent(new CustomEvent("tsi:cookies", { detail: consent }));
  };

  const banner = document.createElement("div");
  banner.className = "cookies";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-labelledby", "cookies-title");
  banner.hidden = true;
  banner.innerHTML = `
    <div class="cookies__main">
      <strong id="cookies-title">Usamos cookies</strong>
      <p>Utilizamos cookies propias y de terceros para el funcionamiento del sitio y, si lo aceptas, para análisis y publicidad. Consulta nuestra <a href="${ROOT}empresa/politica-de-cookies.html">Política de cookies</a> y la <a href="${ROOT}empresa/politica-de-privacidad.html">Política de tratamiento de datos</a>.</p>
    </div>
    <div class="cookies__prefs" hidden>
      <label class="cookies__opt"><span><b>Necesarias</b><small>Permiten el funcionamiento del sitio. Siempre activas.</small></span><input type="checkbox" checked disabled /></label>
      <label class="cookies__opt"><span><b>Análisis</b><small>Nos ayudan a medir cómo se usa el sitio.</small></span><input type="checkbox" data-cat="analitica" /></label>
      <label class="cookies__opt"><span><b>Publicidad</b><small>Muestran anuncios acordes a tus intereses.</small></span><input type="checkbox" data-cat="publicidad" /></label>
    </div>
    <div class="cookies__actions">
      <button class="cookies__btn cookies__btn--ghost" type="button" data-act="config">Configurar</button>
      <button class="cookies__btn cookies__btn--ghost" type="button" data-act="reject">Rechazar</button>
      <button class="cookies__btn cookies__btn--ghost" type="button" data-act="save" hidden>Guardar preferencias</button>
      <button class="cookies__btn cookies__btn--primary" type="button" data-act="accept">Aceptar todas</button>
    </div>`;
  document.body.append(banner);

  const prefs = banner.querySelector(".cookies__prefs");
  const box = (cat) => banner.querySelector(`[data-cat="${cat}"]`);
  const btn = (act) => banner.querySelector(`[data-act="${act}"]`);
  const close = () => {
    banner.classList.remove("is-open");
    setTimeout(() => (banner.hidden = true), reduceMotion ? 0 : 300);
  };
  const open = (withPrefs) => {
    const c = readConsent();
    box("analitica").checked = !!(c && c.analitica);
    box("publicidad").checked = !!(c && c.publicidad);
    prefs.hidden = !withPrefs;
    btn("config").hidden = withPrefs;
    btn("save").hidden = !withPrefs;
    banner.hidden = false;
    requestAnimationFrame(() => banner.classList.add("is-open"));
  };

  banner.addEventListener("click", (e) => {
    const act = e.target.closest("[data-act]")?.dataset.act;
    if (act === "accept") saveConsent(true, true);
    else if (act === "reject") saveConsent(false, false);
    else if (act === "save") saveConsent(box("analitica").checked, box("publicidad").checked);
    else if (act === "config") return open(true);
    else return;
    close();
  });

  window.tsiCookies = { consent: readConsent(), open: () => open(true) };
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-cookie-settings]")) open(true);
  });
  if (!window.tsiCookies.consent) setTimeout(() => open(false), 600);

  /* ------------------------------------------------------------------ */
  /* Contacto: deja elegida la solución desde la que llegó la persona   */
  /* (enlaces "?solucion=…" de las páginas de servicios y soluciones)    */
  /* ------------------------------------------------------------------ */
  const wanted = new URLSearchParams(location.search).get("solucion");
  if (wanted) {
    document.querySelectorAll('select[name="Solución"]').forEach((sel) => {
      const opt = [...sel.options].find((o) => o.textContent.trim() === wanted);
      if (opt) sel.value = opt.value || opt.textContent;
    });
  }

  /* ------------------------------------------------------------------ */
  /* "¿Qué necesitas resolver?": pantalla de ejemplo con chips flotantes */
  /* ------------------------------------------------------------------ */
  const CHIP_ICO = {
    shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    doc: '<path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z"/><path d="M14 3v5h5"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.6 3.6-6 7-6s6.2 2.4 7 6"/>',
    code: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4"/>',
    spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
  };
  document.querySelectorAll(".res__visual[data-escena]").forEach((el) => {
    if (!window.tsiEscena) return;
    const { type, params } = JSON.parse(el.dataset.escena);
    const chips = JSON.parse(el.dataset.chips || "[]");
    el.innerHTML =
      window.tsiEscena(type, params) +
      chips
        .map(
          ([k, t], i) =>
            `<span class="res__chip res__chip--${i}" aria-hidden="true"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${CHIP_ICO[k] || ""}</svg></i>${t}</span>`
        )
        .join("");
  });
})();
