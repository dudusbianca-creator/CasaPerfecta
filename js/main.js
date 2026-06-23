(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    setCurrentYear();
    initNavbarScroll();
    initSmoothScroll();
    initBackToTop();
    initTestimonialSlider();
    initCounters();
    initGalleryFilter();
    initLightbox();
    initNewsletterForm();
  }

  function setCurrentYear() {
    var el = document.getElementById("currentYear");
    if (el) el.textContent = new Date().getFullYear();
  }

  function initNavbarScroll() {
    var navbar = document.getElementById("siteNavbar");
    if (!navbar) return;
    function onScroll() {
      if (window.scrollY > 24) {
        navbar.classList.add("is-scrolled");
      } else {
        navbar.classList.remove("is-scrolled");
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initSmoothScroll() {
    document.addEventListener("click", function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      var target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      var navbarH = document.getElementById("siteNavbar") ? document.getElementById("siteNavbar").offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - navbarH - 16;
      window.scrollTo({ top: top, behavior: "smooth" });

      var offcanvasEl = document.getElementById("mobileMenu");
      if (offcanvasEl && offcanvasEl.classList.contains("show") && window.bootstrap) {
        var instance = window.bootstrap.Offcanvas.getInstance(offcanvasEl);
        if (instance) instance.hide();
      }
    });
  }

  function initBackToTop() {
    var btn = document.getElementById("backToTop");
    if (!btn) return;
    function toggle() {
      if (window.scrollY > 420) {
        btn.classList.add("show");
      } else {
        btn.classList.remove("show");
      }
    }
    toggle();
    window.addEventListener("scroll", toggle, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function initTestimonialSlider() {
    var track = document.getElementById("testimonialSlides");
    if (!track) return;
    var slides = Array.prototype.slice.call(track.children);
    var dotsWrap = document.getElementById("testimonialDots");
    var prevBtn = document.getElementById("testimonialPrev");
    var nextBtn = document.getElementById("testimonialNext");
    var current = 0;
    var autoplayDelay = 6000;
    var timer = null;

    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Mergi la recenzia " + (i + 1));
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", function () { goTo(i); restart(); });
      dotsWrap.appendChild(dot);
    });

    function update() {
      track.style.transform = "translateX(-" + current * 100 + "%)";
      Array.prototype.forEach.call(dotsWrap.children, function (dot, i) {
        dot.classList.toggle("active", i === current);
      });
    }
    function goTo(i) {
      current = (i + slides.length) % slides.length;
      update();
    }
    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }
    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(next, autoplayDelay);
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { prev(); restart(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { next(); restart(); });

    var slider = document.getElementById("testimonialSlider");
    if (slider) {
      slider.addEventListener("mouseenter", function () { if (timer) clearInterval(timer); });
      slider.addEventListener("mouseleave", restart);
    }

    update();
    restart();
  }
  function initCounters() {
    var counters = document.querySelectorAll(".counter-num");
    if (!counters.length) return;

    var animated = new WeakSet();

    function animateCounter(el) {
      if (animated.has(el)) return;
      animated.add(el);
      var target = parseInt(el.getAttribute("data-target"), 10) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      var duration = 1600;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); 
        var value = Math.floor(eased * target);
        el.textContent = value + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target + suffix;
        }
      }
      requestAnimationFrame(step);
    }

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (c) { observer.observe(c); });
    } else {
      counters.forEach(animateCounter);
    }
  }

  function initGalleryFilter() {
    var filterWrap = document.getElementById("galleryFilters");
    var items = document.querySelectorAll(".gallery-item");
    if (!filterWrap || !items.length) return;

    filterWrap.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-filter]");
      if (!btn) return;
      var filter = btn.getAttribute("data-filter");

      Array.prototype.forEach.call(filterWrap.children, function (b) {
        b.classList.toggle("active", b === btn);
      });

      items.forEach(function (item) {
        var match = filter === "all" || item.getAttribute("data-category") === filter;
        item.classList.toggle("hide", !match);
      });
    });
  }

  function initLightbox() {
    var overlay = document.getElementById("lightbox");
    if (!overlay) return;

    var imgEl = document.getElementById("lightboxImage");
    var captionEl = document.getElementById("lightboxCaption");
    var closeBtn = document.getElementById("lightboxClose");
    var prevBtn = document.getElementById("lightboxPrev");
    var nextBtn = document.getElementById("lightboxNext");

    function getVisibleItems() {
      return Array.prototype.filter.call(
        document.querySelectorAll(".gallery-item"),
        function (item) { return !item.classList.contains("hide"); }
      );
    }

    var currentIndex = 0;

    function open(index) {
      var items = getVisibleItems();
      if (!items.length) return;
      currentIndex = (index + items.length) % items.length;
      var item = items[currentIndex];
      var img = item.querySelector("img");
      var caption = item.querySelector(".gi-overlay span");
      imgEl.src = img.src;
      imgEl.alt = img.alt;
      captionEl.textContent = caption ? caption.textContent : "";
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function close() {
      overlay.classList.remove("open");
      document.body.style.overflow = "";
    }
    function showNext() { open(currentIndex + 1); }
    function showPrev() { open(currentIndex - 1); }

    document.addEventListener("click", function (e) {
      var item = e.target.closest(".gallery-item");
      if (!item || item.classList.contains("hide")) return;
      var items = getVisibleItems();
      var idx = items.indexOf(item);
      open(idx);
    });

    if (closeBtn) closeBtn.addEventListener("click", close);
    if (nextBtn) nextBtn.addEventListener("click", showNext);
    if (prevBtn) prevBtn.addEventListener("click", showPrev);

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });

    document.addEventListener("keydown", function (e) {
      if (!overlay.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    });
  }

  function initNewsletterForm() {
    var form = document.getElementById("newsletterForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = document.getElementById("newsletterEmail");
      if (!input.checkValidity()) {
        input.reportValidity();
        return;
      }
      input.value = "";
      var btn = form.querySelector("button");
      var original = btn.innerHTML;
      btn.innerHTML = '<i class="bi bi-check-lg"></i>';
      setTimeout(function () { btn.innerHTML = original; }, 2200);
    });
  }

})();
