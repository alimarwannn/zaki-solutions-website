/* Zaki Solutions website: language, theme, menu, call-to-action links, feature tabs.
   The tiny inline script in each page's <head> applies the saved language and theme
   before first paint; this file wires the controls. */
(function () {
  "use strict";

  // Every "Start free setup" and "WhatsApp us" button on the site reads from here.
  var CTA = {
    signup: "https://zaki-ops.com/signup",
    whatsapp: "201095722660",
    text: {
      contact: {
        en: "Hi Zaki Solutions, I'd like to know more.",
        ar: "أهلاً Zaki Solutions، حابب أعرف أكتر."
      },
      ops: {
        en: "Hi Zaki Solutions, I'd like to know more about Zaki Ops for my venue.",
        ar: "أهلاً Zaki Solutions، حابب أعرف أكتر عن Zaki Ops لمكاني."
      },
      try: {
        en: "Hi Zaki! Show me what you can do.",
        ar: "أهلاً يا زكي! وريني تقدر تعمل إيه."
      },
      custom: {
        en: "Hi Zaki Solutions, I have something I'd like to automate.",
        ar: "أهلاً Zaki Solutions، عندي حاجة عايز أعملها أوتوماتيك."
      },
      plans: {
        en: "Hi Zaki Solutions, I'd like pricing for Zaki Ops.",
        ar: "أهلاً Zaki Solutions، حابب أعرف أسعار Zaki Ops."
      }
    }
  };

  var root = document.documentElement;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  };

  function lang() { return root.lang === "ar" ? "ar" : "en"; }

  function applyLinks() {
    var l = lang();
    document.querySelectorAll('a[data-cta="signup"]').forEach(function (a) {
      a.href = CTA.signup + (l === "ar" ? "?lang=ar" : "");
    });
    document.querySelectorAll('a[data-cta="whatsapp"]').forEach(function (a) {
      var kind = a.getAttribute("data-wa") || "contact";
      var msg = (CTA.text[kind] || CTA.text.contact)[l];
      a.href = "https://wa.me/" + CTA.whatsapp + "?text=" + encodeURIComponent(msg);
      a.target = "_blank";
      a.rel = "noopener";
    });
  }

  function applyMeta() {
    var l = lang();
    var title = root.getAttribute("data-title-" + l);
    var desc = root.getAttribute("data-desc-" + l);
    if (title) document.title = title;
    var meta = document.querySelector('meta[name="description"]');
    if (meta && desc) meta.setAttribute("content", desc);
  }

  function setLang(l, remember) {
    root.lang = l;
    root.dir = l === "ar" ? "rtl" : "ltr";
    if (remember) store.set("zs-lang", l);
    applyLinks();
    applyMeta();
  }

  function setTheme(t) {
    root.setAttribute("data-theme", t);
    store.set("zs-theme", t);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", t === "light" ? "#eeede7" : "#12100d");
  }

  document.querySelectorAll("[data-lang-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () { setLang(lang() === "ar" ? "en" : "ar", true); });
  });

  document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setTheme(root.getAttribute("data-theme") === "light" ? "dark" : "light");
    });
  });

  var menuBtn = document.querySelector("[data-menu-toggle]");
  var mobileNav = document.getElementById("mobile-nav");
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Feature tabs on /zaki-ops
  document.querySelectorAll("[data-tabs]").forEach(function (group) {
    var tabs = group.querySelectorAll('[role="tab"]');
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(i); });
      tab.addEventListener("keydown", function (e) {
        var step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!step) return;
        if (lang() === "ar") step = -step;
        var next = (i + step + tabs.length) % tabs.length;
        select(next);
        tabs[next].focus();
      });
    });
    function select(i) {
      tabs.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
    }
  });

  // Gentle reveal on scroll
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  applyLinks();
  applyMeta();
})();
