(function () {
  var nav = document.getElementById("main-nav");
  var menuToggle = document.querySelector(".menu-toggle");
  var triggers = Array.prototype.slice.call(document.querySelectorAll(".nav__trigger"));
  var searchToggle = document.querySelector(".search-toggle");
  var searchForm = document.getElementById("site-search");

  var flag = document.querySelector(".mockup-flag");
  if (flag) {
    try { flag.hidden = sessionStorage.getItem("gths-flag-hidden") === "1"; } catch (e) {}
    flag.querySelector(".mockup-flag__close").addEventListener("click", function () {
      flag.hidden = true;
      try { sessionStorage.setItem("gths-flag-hidden", "1"); } catch (e) {}
    });
  }

  var notice = document.querySelector("[data-notice]");
  if (notice) {
    notice.querySelector(".notice__close").addEventListener("click", function () {
      notice.hidden = true;
      try { localStorage.setItem("gths-notice", notice.getAttribute("data-notice")); } catch (e) {}
      document.querySelector(".utility__links a").focus();
    });
  }

  function closeMenus(except) {
    triggers.forEach(function (t) {
      if (t !== except) t.setAttribute("aria-expanded", "false");
    });
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var open = trigger.getAttribute("aria-expanded") === "true";
      closeMenus(trigger);
      trigger.setAttribute("aria-expanded", String(!open));
    });
  });

  menuToggle.addEventListener("click", function () {
    var open = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("is-open", !open);
    if (open) closeMenus();
  });

  searchToggle.addEventListener("click", function () {
    var open = searchToggle.getAttribute("aria-expanded") === "true";
    searchToggle.setAttribute("aria-expanded", String(!open));
    searchForm.hidden = open;
    if (!open) document.getElementById("search-input").focus();
  });

  document.querySelectorAll("form").forEach(function (form) {
    form.addEventListener("submit", function (e) { e.preventDefault(); });
  });

  document.addEventListener("click", function (e) {
    if (!nav.contains(e.target) && !menuToggle.contains(e.target)) closeMenus();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var openTrigger = triggers.filter(function (t) { return t.getAttribute("aria-expanded") === "true"; })[0];
    closeMenus();
    if (openTrigger) openTrigger.focus();
  });

  var navScript = document.querySelector('script[src$="js/nav.js"]');
  var siteRoot = navScript ? navScript.getAttribute("src").replace("js/nav.js", "") : "";
  var consentKey = "gths-cookie-consent";
  var consent = document.createElement("section");
  consent.className = "consent";
  consent.setAttribute("aria-label", "Cookie consent");
  consent.hidden = true;
  consent.innerHTML =
    '<p class="consent__text">We use cookies to keep this site working and, with your permission, to understand how it\u2019s used so we can improve it. ' +
    '<a href="' + siteRoot + 'privacy.html">Privacy policy</a></p>' +
    '<div class="consent__actions">' +
    '<button type="button" class="btn btn--dark btn--sm" data-consent="all">Accept all</button>' +
    '<button type="button" class="btn btn--outline btn--sm" data-consent="necessary">Necessary only</button>' +
    "</div>";
  document.body.appendChild(consent);
  try { consent.hidden = !!localStorage.getItem(consentKey); } catch (e) { consent.hidden = false; }
  consent.addEventListener("click", function (e) {
    var choice = e.target.getAttribute("data-consent");
    if (!choice) return;
    try { localStorage.setItem(consentKey, choice); } catch (err) {}
    consent.hidden = true;
  });
  document.querySelectorAll("[data-cookie-settings]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      consent.hidden = false;
      consent.querySelector("button").focus();
    });
  });

  var list = document.getElementById("animal-list");
  document.querySelectorAll("[data-scroll]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var card = list.querySelector(".animal");
      var step = card ? card.getBoundingClientRect().width + 20 : 300;
      list.scrollBy({ left: step * 2 * Number(btn.getAttribute("data-scroll")), behavior: "smooth" });
    });
  });

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var header = document.querySelector(".site-header");
  var hero = document.querySelector(".hero__frame");
  var heroImg = document.querySelector(".hero__img");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 8);
    if (!reduceMotion && heroImg && y < hero.offsetHeight + hero.offsetTop) {
      heroImg.style.translate = "0 " + Math.round(y * 0.12) + "px";
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  document.querySelectorAll(".head, .help__list li, .insta__grid li, .animals").forEach(function (el) {
    el.classList.add("reveal");
  });
  document.querySelectorAll(".bento, .stats, .help__list, .insta__grid, .stories, .centre-list").forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.style.setProperty("--delay", Math.min(i, 6) * 0.09 + "s");
    });
  });

  var reveals = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  reveals.forEach(function (el) { io.observe(el); });

  if (reduceMotion) return;
  var counters = document.querySelectorAll("[data-count]");
  function format(n, el) { return n.toLocaleString("en-CA") + (el.getAttribute("data-suffix") || ""); }
  function countUp(el) {
    var target = Number(el.getAttribute("data-count"));
    var start = null;
    function step(now) {
      if (!start) start = now;
      var t = Math.min((now - start) / 1800, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = format(Math.round(target * eased), el);
      if (t < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }
  var countIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        countUp(entry.target);
        countIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach(function (el) {
    var finalText = document.createElement("span");
    finalText.className = "visually-hidden";
    finalText.textContent = el.textContent;
    el.parentNode.insertBefore(finalText, el);
    el.setAttribute("aria-hidden", "true");
    el.textContent = format(0, el);
    countIO.observe(el);
  });
})();
