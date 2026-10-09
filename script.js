/* Portfolio interactions: theme, navigation, scroll state, and back-to-top. */
(() => {
  "use strict";

  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle?.querySelector(".theme-icon");
  const nav = document.getElementById("mainNav");
  const navContent = document.getElementById("navContent");
  const backToTop = document.getElementById("backToTop");
  const currentYear = document.getElementById("currentYear");

  const getPreferredTheme = () => {
    try {
      const saved = localStorage.getItem("portfolio-theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch (_) {}
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const applyTheme = (theme) => {
    root.setAttribute("data-bs-theme", theme);
    if (themeIcon) themeIcon.textContent = theme === "dark" ? "☀" : "☾";
    if (themeToggle) {
      const next = theme === "dark" ? "light" : "dark";
      themeToggle.setAttribute("aria-label", `Switch to ${next} theme`);
      themeToggle.setAttribute("title", `Switch to ${next} theme`);
    }
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute("content", theme === "dark" ? "#0b1220" : "#ffffff");
  };

  applyTheme(getPreferredTheme());

  themeToggle?.addEventListener("click", () => {
    const nextTheme = root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    try { localStorage.setItem("portfolio-theme", nextTheme); } catch (_) {}
  });

  const updateScrollUI = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    nav?.classList.toggle("nav-scrolled", y > 12);
    backToTop?.classList.toggle("is-visible", y > 450);
  };
  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();

  backToTop?.addEventListener("click", () => {
    document.getElementById("home")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  });

  // Close the mobile menu after navigation without intercepting native anchor scrolling.
  navContent?.querySelectorAll("a.nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 991.98px)").matches && navContent.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(navContent).hide();
      }
    });
  });

  // Bootstrap ScrollSpy handles active nav links; refresh after fonts/layout settle.
  window.addEventListener("load", () => {
    if (window.bootstrap && nav) {
      bootstrap.ScrollSpy.getOrCreateInstance(document.body, {
        target: "#mainNav",
        rootMargin: "0px 0px -25%",
        smoothScroll: false
      });
      bootstrap.ScrollSpy.getInstance(document.body)?.refresh();
    }
  });

  if (currentYear) currentYear.textContent = new Date().getFullYear();
})();
