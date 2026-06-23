(function () {
  "use strict";

  var CURRENT_YEAR = new Date().getFullYear();

  function formatMDL(value) {
    var rounded = Math.round(value / 100) * 100; 
    return new Intl.NumberFormat("ro-MD", {
      style: "currency",
      currency: "MDL",
      maximumFractionDigits: 0
    }).format(rounded);
  }
  var PRICE_PER_M2 = {
    chisinau: 22000,
    botanica: 21500,
    buiucani: 21000,
    telecentru: 20500,
    stauceni: 18000,
    balti: 15000,
    cahul: 13500,
    orhei: 14000,
    soroca: 12500,
    ungheni: 13000,
    comrat: 12800,
    criuleni: 12000,
    "alt-oras": 11000
  };
  var TYPE_MULTIPLIER = {
    apartament: 1.0,
    casa: 0.9,
    vila: 1.3,
    teren: 0.3,
    comercial: 1.1
  };
  var ZONE_MULTIPLIER = {
    centrala: 1.15,
    semicentrala: 1.0,
    periferica: 0.85
  };

  function ageFactor(year) {
    var age = CURRENT_YEAR - year;
    if (age <= 5) return 1.10;
    if (age <= 15) return 1.00;
    if (age <= 30) return 0.90;
    return 0.80;
  }

  function roomsFactor(rooms) {
    var f = 1 + (rooms - 2) * 0.02;
    return Math.max(0.9, Math.min(1.2, f));
  }

  function computeEstimate() {
    var type = document.getElementById("evalType").value;
    var area = parseFloat(document.getElementById("evalArea").value);
    var location = document.getElementById("evalLocation").value;
    var zone = document.getElementById("evalZone").value;
    var rooms = parseFloat(document.getElementById("evalRooms").value);
    var year = parseFloat(document.getElementById("evalYear").value);

    var basePrice = PRICE_PER_M2[location] || 1200;
    var typeMult = TYPE_MULTIPLIER[type] || 1;
    var zoneMult = ZONE_MULTIPLIER[zone] || 1;
    var ageMult = ageFactor(year);
    var roomMult = roomsFactor(rooms);

    var estimate = area * basePrice * typeMult * zoneMult * ageMult * roomMult;
    var low = estimate * 0.92;
    var high = estimate * 1.08;

    return { estimate: estimate, low: low, high: high };
  }

  function initEvaluationForm() {
    var form = document.getElementById("evaluationForm");
    if (!form) return;

    var resultValue = document.getElementById("evalResultValue");
    var resultRange = document.getElementById("evalResultRange");
    var successMsg = document.getElementById("evalSuccessMsg");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var valid = window.CasaPerfectaValidation
        ? window.CasaPerfectaValidation.validateForm(form)
        : form.checkValidity();

      if (!valid) {
        resultValue.textContent = "MDL —";
        resultRange.textContent = "Completează corect toate câmpurile obligatorii";
        return;
      }

      var result = computeEstimate();
      resultValue.textContent = formatMDL(result.estimate);
      resultRange.textContent = "Interval estimativ: " + formatMDL(result.low) + " – " + formatMDL(result.high);

      if (successMsg) {
        successMsg.classList.add("show");
        setTimeout(function () { successMsg.classList.remove("show"); }, 4500);
      }
    });
  }
  function computeMortgage(principal, annualRatePct, years) {
    var n = years * 12;
    var r = (annualRatePct / 100) / 12;
    var monthly;

    if (r === 0) {
      monthly = principal / n;
    } else {
      var factor = Math.pow(1 + r, n);
      monthly = principal * r * factor / (factor - 1);
    }

    var totalPaid = monthly * n;
    var totalInterest = totalPaid - principal;

    return { monthly: monthly, totalPaid: totalPaid, totalInterest: totalInterest };
  }

  function initMortgageForm() {
    var form = document.getElementById("mortgageForm");
    if (!form) return;

    var resultValue = document.getElementById("mortgageResultValue");
    var subtext = document.getElementById("mortgageSubtext");
    var bdPrincipal = document.getElementById("bdPrincipal");
    var bdInterest = document.getElementById("bdInterest");
    var bdTotal = document.getElementById("bdTotal");

    var loanAmount = document.getElementById("loanAmount");
    var interestRate = document.getElementById("interestRate");
    var loanTerm = document.getElementById("loanTerm");
    var downPayment = document.getElementById("downPayment");

    function recalculate(showValidation) {
      var valid = window.CasaPerfectaValidation
        ? window.CasaPerfectaValidation.validateForm(form)
        : form.checkValidity();

      if (!valid) {
        if (showValidation) {
          resultValue.textContent = "MDL —";
          subtext.textContent = "Completează corect toate câmpurile";
        }
        return;
      }

      var principal = parseFloat(loanAmount.value) || 0;
      var rate = parseFloat(interestRate.value) || 0;
      var years = parseFloat(loanTerm.value) || 1;
      var down = parseFloat(downPayment.value) || 0;

      var result = computeMortgage(principal, rate, years);

      resultValue.textContent = formatMDL(result.monthly);
      subtext.textContent = "Pentru un credit de " + formatMDL(principal) + " pe " + years + " ani";
      bdPrincipal.textContent = formatMDL(principal);
      bdInterest.textContent = formatMDL(result.totalInterest);
      bdTotal.textContent = formatMDL(result.totalPaid + down);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      recalculate(true);
    });

    [loanAmount, interestRate, loanTerm, downPayment].forEach(function (input) {
      input.addEventListener("input", function () { recalculate(false); });
    });

    recalculate(false);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initEvaluationForm();
    initMortgageForm();
  });

})();
