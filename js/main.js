/**
 * Todosistemas STI / RiskTech — Script principal del sitio
 * Sin dependencias externas.
 */
(() => {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* Header: sombra/fondo al hacer scroll                               */
  /* ------------------------------------------------------------------ */
  const header = document.querySelector("[data-header]");

  const updateHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  /* ------------------------------------------------------------------ */
  /* Menú móvil                                                         */
  /* ------------------------------------------------------------------ */
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  const closeNav = () => {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  const toggleNav = () => {
    if (!nav || !navToggle) return;
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  };

  navToggle?.addEventListener("click", toggleNav);

  nav?.querySelectorAll(".nav__link[href]:not([data-dropdown-toggle])").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 1080) closeNav();
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) closeNav();
  });

  /* ------------------------------------------------------------------ */
  /* Dropdown "Soluciones" (click en móvil, hover en escritorio vía CSS) */
  /* ------------------------------------------------------------------ */
  const dropdownItem = document.querySelector("[data-dropdown]");
  const dropdownToggle = document.querySelector("[data-dropdown-toggle]");

  dropdownToggle?.addEventListener("click", (event) => {
    if (window.innerWidth > 1080) return;
    event.preventDefault();
    const isOpen = dropdownItem.classList.toggle("is-open");
    dropdownToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    if (!dropdownItem || window.innerWidth > 1080) return;
    if (!dropdownItem.contains(event.target)) {
      dropdownItem.classList.remove("is-open");
      dropdownToggle?.setAttribute("aria-expanded", "false");
    }
  });

  /* ------------------------------------------------------------------ */
  /* Cerrar menú móvil al presionar Escape                              */
  /* ------------------------------------------------------------------ */
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });

  /* ------------------------------------------------------------------ */
  /* Animación de entrada al hacer scroll                                */
  /* ------------------------------------------------------------------ */
  const revealTargets = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window && revealTargets.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  /* ------------------------------------------------------------------ */
  /* "Implementamos": destacar el punto señalado                        */
  /* El hover y el foco los resuelve el CSS. Aquí solo movemos el       */
  /* estado activo al tocar/hacer clic, para pantallas táctiles donde   */
  /* :hover no existe.                                                  */
  /* ------------------------------------------------------------------ */
  const stackItems = document.querySelectorAll("[data-stack-item]");

  const activateStackItem = (target) => {
    stackItems.forEach((item) => item.classList.toggle("is-active", item === target));
  };

  stackItems.forEach((item) => {
    item.addEventListener("click", () => activateStackItem(item));
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activateStackItem(item);
      }
    });
  });

  /* ------------------------------------------------------------------ */
  /* Año dinámico en el footer                                          */
  /* ------------------------------------------------------------------ */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
