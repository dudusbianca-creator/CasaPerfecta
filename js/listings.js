/* ==========================================================================
   CASA PERFECTĂ — listings.js
   Filtrare, sortare și paginare pentru listings.html
   ========================================================================== */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var grid = document.getElementById("listingsGrid");
    if (!grid) return; // doar pe listings.html

    var cards = Array.prototype.slice.call(grid.querySelectorAll(".property-col"));
    var filterForm = document.getElementById("filterForm");
    var typeSelect = document.getElementById("filterType");
    var minInput = document.getElementById("filterPriceMin");
    var maxInput = document.getElementById("filterPriceMax");
    var locationSelect = document.getElementById("filterLocation");
    var sortSelect = document.getElementById("sortSelect");
    var resetBtn = document.getElementById("resetFilters");
    var resultsCount = document.getElementById("resultsCount");
    var noResults = document.getElementById("noResults");
    var paginationWrap = document.getElementById("pagination");

    var PAGE_SIZE = 6;
    var currentPage = 1;

    function getFilteredSorted() {
      var type = typeSelect.value;
      var min = minInput.value !== "" ? parseFloat(minInput.value) : null;
      var max = maxInput.value !== "" ? parseFloat(maxInput.value) : null;
      var location = locationSelect.value;

      var filtered = cards.filter(function (card) {
        var cType = card.getAttribute("data-type");
        var cPrice = parseFloat(card.getAttribute("data-price"));
        var cLocation = card.getAttribute("data-location");

        if (type !== "all" && cType !== type) return false;
        if (min !== null && !isNaN(min) && cPrice < min) return false;
        if (max !== null && !isNaN(max) && cPrice > max) return false;
        if (location !== "all" && cLocation !== location) return false;
        return true;
      });

      var sortVal = sortSelect.value;
      if (sortVal === "price-asc") {
        filtered.sort(function (a, b) { return parseFloat(a.dataset.price) - parseFloat(b.dataset.price); });
      } else if (sortVal === "price-desc") {
        filtered.sort(function (a, b) { return parseFloat(b.dataset.price) - parseFloat(a.dataset.price); });
      } else if (sortVal === "area-asc") {
        filtered.sort(function (a, b) { return parseFloat(a.dataset.area) - parseFloat(b.dataset.area); });
      } else if (sortVal === "area-desc") {
        filtered.sort(function (a, b) { return parseFloat(b.dataset.area) - parseFloat(a.dataset.area); });
      }
      // "recommended" => păstrează ordinea originală din HTML

      return filtered;
    }

    function render() {
      var result = getFilteredSorted();
      var total = result.length;
      var totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
      if (currentPage > totalPages) currentPage = totalPages;

      // Ascunde toate cardurile
      cards.forEach(function (card) { card.style.display = "none"; });

      if (total === 0) {
        noResults.classList.add("show");
      } else {
        noResults.classList.remove("show");
        var startIdx = (currentPage - 1) * PAGE_SIZE;
        var pageItems = result.slice(startIdx, startIdx + PAGE_SIZE);

        // Reordonează în DOM conform sortării/filtrării paginii curente
        pageItems.forEach(function (card) {
          grid.appendChild(card);
          card.style.display = "";
        });
      }

      resultsCount.textContent = total + (total === 1 ? " proprietate găsită" : " proprietăți găsite");
      renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
      paginationWrap.innerHTML = "";
      if (totalPages <= 1) return;

      var prevBtn = document.createElement("button");
      prevBtn.type = "button";
      prevBtn.innerHTML = '<i class="bi bi-chevron-left"></i>';
      prevBtn.setAttribute("aria-label", "Pagina anterioară");
      prevBtn.disabled = currentPage === 1;
      prevBtn.addEventListener("click", function () { currentPage--; render(); scrollToGrid(); });
      paginationWrap.appendChild(prevBtn);

      for (var i = 1; i <= totalPages; i++) {
        (function (pageNum) {
          var btn = document.createElement("button");
          btn.type = "button";
          btn.textContent = pageNum;
          if (pageNum === currentPage) btn.classList.add("active");
          btn.addEventListener("click", function () { currentPage = pageNum; render(); scrollToGrid(); });
          paginationWrap.appendChild(btn);
        })(i);
      }

      var nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.innerHTML = '<i class="bi bi-chevron-right"></i>';
      nextBtn.setAttribute("aria-label", "Pagina următoare");
      nextBtn.disabled = currentPage === totalPages;
      nextBtn.addEventListener("click", function () { currentPage++; render(); scrollToGrid(); });
      paginationWrap.appendChild(nextBtn);
    }

    function scrollToGrid() {
      var navbarH = document.getElementById("siteNavbar") ? document.getElementById("siteNavbar").offsetHeight : 0;
      var top = grid.getBoundingClientRect().top + window.pageYOffset - navbarH - 24;
      window.scrollTo({ top: top, behavior: "smooth" });
    }

    filterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      currentPage = 1;
      render();
    });

    resetBtn.addEventListener("click", function () {
      setTimeout(function () {
        typeSelect.value = "all";
        locationSelect.value = "all";
        minInput.value = "";
        maxInput.value = "";
        sortSelect.value = "recommended";
        currentPage = 1;
        render();
      }, 0);
    });

    sortSelect.addEventListener("change", function () {
      currentPage = 1;
      render();
    });

    // Filtrare live și pe schimbare select (în plus față de submit)
    [typeSelect, locationSelect].forEach(function (el) {
      el.addEventListener("change", function () {
        currentPage = 1;
        render();
      });
    });

    render();
  });
})();
