(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#kontaktine-forma");
    if (!form) return;

    const fields = {
      firstName: form.elements["firstName"],
      lastName: form.elements["lastName"],
      email: form.elements["email"],
      phone: form.elements["phone"],
      address: form.elements["address"],
      question1: form.elements["question1"],
      question2: form.elements["question2"],
      question3: form.elements["question3"]
    };

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    const rezultatoBlokas = document.querySelector("#formos-rezultatas");

    let popup = document.querySelector("#success-popup");
    if (!popup) {
      popup = document.createElement("div");
      popup.id = "success-popup";
      popup.textContent = "Duomenys pateikti sėkmingai!";
      document.body.appendChild(popup);
    }

    function showPopup() {
      popup.classList.add("show");
      setTimeout(() => popup.classList.remove("show"), 3000);
    }

    const fieldValidity = {};
    const fieldTouched = {}; 

    function getErrorElement(input) {
      if (!input) return null;
      let err = input.parentElement.querySelector(".field-error");
      if (!err) {
        err = document.createElement("div");
        err.className = "field-error";
        input.parentElement.appendChild(err);
      }
      return err;
    }

    function setFieldValidity(key, input, isValid, message) {
      fieldValidity[key] = !!isValid;

      if (!input) {
        updateSubmitState();
        return;
      }

      const err = getErrorElement(input);
      const touched = !!fieldTouched[key];

      if (isValid) {
        input.classList.remove("is-invalid");
        if (touched) {
          input.classList.add("is-valid");
        } else {
          input.classList.remove("is-valid");
        }
        if (err) err.textContent = "";
      } else {
        input.classList.remove("is-valid");
        if (touched) {
          input.classList.add("is-invalid");
          if (err) err.textContent = message || "";
        } else {
          input.classList.remove("is-invalid");
          if (err) err.textContent = "";
        }
      }

      updateSubmitState();
    }

    function updateSubmitState() {
      if (!submitBtn) return;
      const vals = Object.values(fieldValidity);
      const allValid = vals.length > 0 && vals.every(Boolean);
      submitBtn.disabled = !allValid;
    }

    const esc = (str) =>
      String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    function validateFirstName() {
      const input = fields.firstName;
      if (!input) return true;
      const value = input.value.trim();
      if (!value) {
        setFieldValidity("firstName", input, false, "Vardas privalomas.");
        return false;
      }
      const onlyLetters = /^[A-Za-zÀ-žĀ-žąčęėįšųūžĄČĘĖĮŠŲŪŽ\s'-]+$/u;
      if (!onlyLetters.test(value)) {
        setFieldValidity(
          "firstName",
          input,
          false,
          "Vardas gali būti sudarytas tik iš raidžių."
        );
        return false;
      }
      setFieldValidity("firstName", input, true);
      return true;
    }

    function validateLastName() {
      const input = fields.lastName;
      if (!input) return true;
      const value = input.value.trim();
      if (!value) {
        setFieldValidity("lastName", input, false, "Pavardė privaloma.");
        return false;
      }
      const onlyLetters = /^[A-Za-zÀ-žĀ-žąčęėįšųūžĄČĘĖĮŠŲŪŽ\s'-]+$/u;
      if (!onlyLetters.test(value)) {
        setFieldValidity(
          "lastName",
          input,
          false,
          "Pavardė gali būti sudaryta tik iš raidžių."
        );
        return false;
      }
      setFieldValidity("lastName", input, true);
      return true;
    }

    function validateEmail() {
      const input = fields.email;
      if (!input) return true;
      const value = input.value.trim();
      if (!value) {
        setFieldValidity("email", input, false, "El. paštas privalomas.");
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setFieldValidity("email", input, false, "Neteisingas el. pašto formatas.");
        return false;
      }
      setFieldValidity("email", input, true);
      return true;
    }

    function validateAddress() {
      const input = fields.address;
      if (!input) return true;
      const value = input.value.trim();
      if (!value) {
        setFieldValidity("address", input, false, "Adresas privalomas.");
        return false;
      }
      setFieldValidity("address", input, true);
      return true;
    }

    function formatPhone(input) {
      if (!input) return "";
      let digits = input.value.replace(/\D/g, "");
      if (digits.length > 11) digits = digits.slice(0, 11);

      let formatted = "";
      if (digits.length === 0) {
        formatted = "";
      } else if (digits.length <= 3) {
        formatted = "+" + digits;
      } else if (digits.length <= 4) {
        formatted = "+" + digits.slice(0, 3) + " " + digits.slice(3);
      } else if (digits.length <= 6) {
        formatted =
          "+" + digits.slice(0, 3) + " " + digits.slice(3, 4) + digits.slice(4);
      } else {
        formatted =
          "+" +
          digits.slice(0, 3) +
          " " +
          digits.slice(3, 4) +
          digits.slice(4, 6) +
          " " +
          digits.slice(6);
      }

      input.value = formatted;
      return digits;
    }

    function validatePhone() {
      const input = fields.phone;
      if (!input) return true;

      const digits = input.value.replace(/\D/g, "");

      if (!digits) {
        setFieldValidity("phone", input, false, "Telefono numeris privalomas.");
        return false;
      }

      if (digits.length !== 11 || !digits.startsWith("3706")) {
        setFieldValidity(
          "phone",
          input,
          false,
          "Įveskite numerį formatu +370 6xx xxxxx."
        );
        return false;
      }

      setFieldValidity("phone", input, true);
      return true;
    }

    function validateQuestion(key, input) {
      if (!input) return true;
      const value = input.value;
      const num = parseInt(value, 10);

      if (isNaN(num) || num < 1 || num > 10) {
        setFieldValidity(
          key,
          input,
          false,
          "Vertinimas turi būti skaičius nuo 1 iki 10."
        );
        return false;
      }
      setFieldValidity(key, input, true);
      return true;
    }

    function validateAll() {
      validateFirstName();
      validateLastName();
      validateEmail();
      validateAddress();
      validatePhone();
      validateQuestion("question1", fields.question1);
      validateQuestion("question2", fields.question2);
      validateQuestion("question3", fields.question3);
    }

    if (fields.firstName) {
      fields.firstName.addEventListener("input", () => {
        if (fieldTouched.firstName) validateFirstName();
      });
      fields.firstName.addEventListener("blur", () => {
        fieldTouched.firstName = true;
        validateFirstName();
      });
    }

    if (fields.lastName) {
      fields.lastName.addEventListener("input", () => {
        if (fieldTouched.lastName) validateLastName();
      });
      fields.lastName.addEventListener("blur", () => {
        fieldTouched.lastName = true;
        validateLastName();
      });
    }

    if (fields.email) {
      fields.email.addEventListener("input", () => {
        if (fieldTouched.email) validateEmail();
      });
      fields.email.addEventListener("blur", () => {
        fieldTouched.email = true;
        validateEmail();
      });
    }

    if (fields.address) {
      fields.address.addEventListener("input", () => {
        if (fieldTouched.address) validateAddress();
      });
      fields.address.addEventListener("blur", () => {
        fieldTouched.address = true;
        validateAddress();
      });
    }

    if (fields.phone) {
      fields.phone.addEventListener("input", () => {
        formatPhone(fields.phone);
        if (fieldTouched.phone) validatePhone();
      });

      fields.phone.addEventListener("blur", () => {
        fieldTouched.phone = true;
        formatPhone(fields.phone);
        validatePhone();
      });

      fields.phone.addEventListener("keydown", function (e) {
        const allowedKeys = [
          "Backspace",
          "Delete",
          "ArrowLeft",
          "ArrowRight",
          "Tab",
          "Home",
          "End"
        ];
        if (!allowedKeys.includes(e.key) && !/^[0-9]$/.test(e.key)) {
          e.preventDefault();
        }
      });
    }

    ["question1", "question2", "question3"].forEach((key) => {
      const input = fields[key];
      if (!input) return;

      input.addEventListener("input", () => {
        if (fieldTouched[key]) validateQuestion(key, input);
      });

      input.addEventListener("blur", () => {
        fieldTouched[key] = true;
        validateQuestion(key, input);
      });
      input.addEventListener("change", () => {
        if (fieldTouched[key]) validateQuestion(key, input);
      });
    });

    validateAll();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();

      Object.keys(fields).forEach((key) => {
        fieldTouched[key] = true;
      });

      validateAll();

      const allOk = Object.values(fieldValidity).every(Boolean);
      if (!allOk) return;

      const vardas = fields.firstName ? fields.firstName.value.trim() : "";
      const pavarde = fields.lastName ? fields.lastName.value.trim() : "";
      const elPastas = fields.email ? fields.email.value.trim() : "";
      const telefonas = fields.phone ? fields.phone.value.trim() : "";
      const adresas = fields.address ? fields.address.value.trim() : "";

      const klausimas1Raw = fields.question1 ? fields.question1.value : "";
      const klausimas2Raw = fields.question2 ? fields.question2.value : "";
      const klausimas3Raw = fields.question3 ? fields.question3.value : "";

      const k1 = parseFloat(klausimas1Raw);
      const k2 = parseFloat(klausimas2Raw);
      const k3 = parseFloat(klausimas3Raw);

      let vidurkis = null;
      if (!isNaN(k1) && !isNaN(k2) && !isNaN(k3)) {
        vidurkis = ((k1 + k2 + k3) / 3).toFixed(1);
      }

      const formData = {
        vardas,
        pavarde,
        elPastas,
        telefonas,
        adresas,
        klausimas1: klausimas1Raw,
        klausimas2: klausimas2Raw,
        klausimas3: klausimas3Raw,
        vidurkis
      };

      console.log("Kontaktų formos duomenys:", formData);

      if (rezultatoBlokas) {
        rezultatoBlokas.innerHTML = `
          <h5 class="mb-3">Jūsų įvesti duomenys:</h5>
          <p><strong>Vardas:</strong> ${esc(vardas)}</p>
          <p><strong>Pavardė:</strong> ${esc(pavarde)}</p>
          <p><strong>El. paštas:</strong> ${esc(elPastas)}</p>
          <p><strong>Tel. numeris:</strong> ${esc(telefonas)}</p>
          <p><strong>Adresas:</strong> ${esc(adresas)}</p>
          <p><strong>1 klausimo įvertinimas:</strong> ${esc(klausimas1Raw)}</p>
          <p><strong>2 klausimo įvertinimas:</strong> ${esc(klausimas2Raw)}</p>
          <p><strong>3 klausimo įvertinimas:</strong> ${esc(klausimas3Raw)}</p>
          ${
            vidurkis !== null
              ? `<p class="mt-3"><strong>${esc(vardas)} ${esc(
                  pavarde
                )}:</strong> ${esc(vidurkis)}</p>`
              : ""
          }
        `;
        rezultatoBlokas.classList.remove("d-none");
      }

      showPopup();
    });
  });
})();
