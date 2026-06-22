/* ==========================================================================
   CASA PERFECTĂ — validation.js
   Validare formulare: contact.html (#contactForm) și evaluation.html
   (#evaluationForm). Expune și un API reutilizabil (window.CasaPerfectaValidation)
   folosit de calculator.js pentru a valida #evaluationForm și #mortgageForm
   înainte de a calcula rezultatele.
   ========================================================================== */
(function () {
  "use strict";

  var PHONE_REGEX = /^\d{8}$/; // acceptă numere Moldova după normalizare

  function getWrapper(input) {
    return input.closest(".col-sm-6, .col-md-6, .col-12, .col") || input.parentElement;
  }

  /** Validează un singur câmp și actualizează clasele vizuale. Returnează true/false. */
  function validateField(input) {
    var wrapper = getWrapper(input);
    var isValid = input.checkValidity();

    // Validare suplimentară pentru telefon (format Moldova)
    if (isValid && input.type === "tel") {
      var cleaned = input.value.replace(/\s|-/g, "").replace(/^\+373/, "").replace(/^0/, "");
      if (!PHONE_REGEX.test(cleaned)) {
        isValid = false;
        input.setCustomValidity("Format telefon invalid");
      } else {
        input.setCustomValidity("");
      }
    } else if (input.type === "tel") {
      input.setCustomValidity("");
    }

    wrapper.classList.add("was-validated-field");
    wrapper.classList.toggle("is-invalid", !isValid);
    wrapper.classList.toggle("is-valid", isValid);
    return isValid;
  }

  /** Validează toate câmpurile required/relevante dintr-un formular. Returnează true/false. */
  function validateForm(form) {
    var fields = form.querySelectorAll("input[required], select[required], textarea[required]");
    var allValid = true;
    var firstInvalid = null;

    fields.forEach(function (field) {
      var ok = validateField(field);
      if (!ok && !firstInvalid) firstInvalid = field;
      if (!ok) allValid = false;
    });

    if (firstInvalid) {
      firstInvalid.focus({ preventScroll: false });
    }
    return allValid;
  }

  /** Activează validare live (la blur și la input după prima validare) pentru un formular. */
  function attachLiveValidation(form) {
    var fields = form.querySelectorAll("input, select, textarea");
    fields.forEach(function (field) {
      field.addEventListener("blur", function () { validateField(field); });
      field.addEventListener("input", function () {
        var wrapper = getWrapper(field);
        if (wrapper.classList.contains("was-validated-field")) {
          validateField(field);
        }
      });
      field.addEventListener("change", function () {
        var wrapper = getWrapper(field);
        if (wrapper.classList.contains("was-validated-field") || field.tagName === "SELECT") {
          validateField(field);
        }
      });
    });
  }

  function showSuccess(form, msgEl, resetAfter) {
    if (!msgEl) return;
    msgEl.classList.add("show");
    if (resetAfter) {
      setTimeout(function () {
        form.reset();
        Array.prototype.forEach.call(form.querySelectorAll(".was-validated-field"), function (w) {
          w.classList.remove("was-validated-field", "is-valid", "is-invalid");
        });
      }, 400);
      setTimeout(function () { msgEl.classList.remove("show"); }, 5000);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {

    /* ---------- FORMULAR CONTACT (contact.html) ---------- */
    var contactForm = document.getElementById("contactForm");
    if (contactForm) {
      attachLiveValidation(contactForm);
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var valid = validateForm(contactForm);
        if (!valid) return;
        var msgEl = document.getElementById("contactSuccessMsg");
        showSuccess(contactForm, msgEl, true);
      });
    }

    /* ---------- FORMULAR EVALUARE PROPRIETATE (evaluation.html) ---------- */
    var evaluationForm = document.getElementById("evaluationForm");
    if (evaluationForm) {
      attachLiveValidation(evaluationForm);
      // Submit-ul propriu-zis (calculul) este gestionat în calculator.js,
      // care apelează window.CasaPerfectaValidation.validateForm() înainte de a calcula.
    }

    /* ---------- FORMULAR CREDIT IPOTECAR (evaluation.html) ---------- */
    var mortgageForm = document.getElementById("mortgageForm");
    if (mortgageForm) {
      attachLiveValidation(mortgageForm);
    }

  });

  // API public, reutilizat de calculator.js
  window.CasaPerfectaValidation = {
    validateField: validateField,
    validateForm: validateForm,
    showSuccess: showSuccess
  };

})();
