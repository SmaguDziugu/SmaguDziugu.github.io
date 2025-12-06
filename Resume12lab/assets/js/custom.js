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

    const baseCardIcons = [
      "bi bi-star-fill",
      "bi bi-heart-fill",
      "bi bi-lightning-fill",
      "bi bi-moon-stars-fill",
      "bi bi-gem",
      "bi bi-controller",
      "bi bi-bell-fill",
      "bi bi-bug-fill",
      "bi bi-cloud-fill",
      "bi bi-flower1",
      "bi bi-sun-fill",
      "bi bi-music-note-beamed"
    ];

    const DIFFICULTIES = {
      easy: { rows: 3, cols: 4, pairs: 6 },
      hard: { rows: 4, cols: 6, pairs: 12 }
    };

    let currentDifficulty = "easy";

    const gameState = {
      moves: 0,
      matchedPairs: 0,
      totalPairs: DIFFICULTIES[currentDifficulty].pairs,
      isRunning: false
    };

    let deck = [];
    let openCards = [];
    let lockBoard = false;

    const boardEl = document.querySelector("#game-board");
    const movesEl = document.querySelector("#stat-moves");
    const pairsEl = document.querySelector("#stat-pairs");
    const messageEl = document.querySelector("#game-message");
    const startBtn = document.querySelector("#btn-start-game");
    const resetBtn = document.querySelector("#btn-reset-game");
    const difficultyButtons = document.querySelectorAll("[data-difficulty]");
    const timerEl = document.querySelector("#stat-time");
    const bestEasyEl = document.querySelector("#best-easy");
    const bestHardEl = document.querySelector("#best-hard");

    const BEST_SCORES_KEY = "memoryGameBestScores";
    const bestScores = { easy: null, hard: null };

    let timerInterval = null;
    let elapsedSeconds = 0;

    function createDeckForDifficulty(diffKey) {
      const config = DIFFICULTIES[diffKey];
      if (!config) return [];

      const neededPairs = config.pairs;

      const chosenIcons = baseCardIcons.slice(0, neededPairs);

      const kalade = chosenIcons.flatMap((icon, index) => ([
        { id: `${diffKey}-${index}-a`, value: icon },
        { id: `${diffKey}-${index}-b`, value: icon }
      ]));

      for (let i = kalade.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [kalade[i], kalade[j]] = [kalade[j], kalade[i]];
      }

      return kalade;
    }

    function renderBoard() {
      if (!boardEl) return;
      boardEl.innerHTML = "";

      const config = DIFFICULTIES[currentDifficulty];
      if (!config) return;

      boardEl.style.display = "grid";
      boardEl.style.gridTemplateColumns = `repeat(${config.cols}, minmax(0, 1fr))`;

      deck.forEach(card => {
        const cardBtn = document.createElement("button");
        cardBtn.type = "button";
        cardBtn.className = "game-card btn btn-outline-dark";
        cardBtn.dataset.cardId = card.id;
        cardBtn.dataset.cardValue = card.value;
        cardBtn.innerHTML = "";
        boardEl.appendChild(cardBtn);
      });
    }

    function updateStatsUI() {
      if (movesEl) movesEl.textContent = gameState.moves;
      if (pairsEl) pairsEl.textContent = `${gameState.matchedPairs}/${gameState.totalPairs}`;
    }

    function formatTime(totalSeconds) {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    function updateTimerUI() {
      if (timerEl) {
        timerEl.textContent = formatTime(elapsedSeconds);
      }
    }

    function stopTimer() {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }

    function startTimer() {
      stopTimer();
      elapsedSeconds = 0;
      updateTimerUI();
      timerInterval = setInterval(() => {
        elapsedSeconds++;
        updateTimerUI();
      }, 1000);
    }

    function updateBestScoresUI() {
      if (bestEasyEl) {
        bestEasyEl.textContent = bestScores.easy != null ? bestScores.easy : "-";
      }
      if (bestHardEl) {
        bestHardEl.textContent = bestScores.hard != null ? bestScores.hard : "-";
      }
    }

    function loadBestScores() {
      let stored = null;
      try {
        const raw = localStorage.getItem(BEST_SCORES_KEY);
        if (raw) stored = JSON.parse(raw);
      } catch (e) {
        stored = null;
      }

      if (!stored || typeof stored !== "object") {
        stored = { easy: null, hard: null };
      }

      bestScores.easy = typeof stored.easy === "number" ? stored.easy : null;
      bestScores.hard = typeof stored.hard === "number" ? stored.hard : null;

      updateBestScoresUI();
    }

    function saveBestScores() {
      const data = {
        easy: bestScores.easy,
        hard: bestScores.hard
      };
      try {
        localStorage.setItem(BEST_SCORES_KEY, JSON.stringify(data));
      } catch (e) {}
    }

    function resetStats() {
      gameState.moves = 0;
      gameState.matchedPairs = 0;
      gameState.totalPairs = DIFFICULTIES[currentDifficulty].pairs;
      gameState.isRunning = false;
      updateStatsUI();

      stopTimer();
      elapsedSeconds = 0;
      updateTimerUI();

      if (messageEl) {
        messageEl.textContent = "";
        messageEl.classList.remove("text-success");
      }
    }

    function initNewGame() {
      deck = createDeckForDifficulty(currentDifficulty);
      openCards = [];
      lockBoard = false;
      resetStats();
      renderBoard();
    }

    function flipCard(btn) {
      if (!btn) return;
      btn.classList.add("flipped");
      const iconClass = btn.dataset.cardValue;
      btn.innerHTML = `<i class="${iconClass}"></i>`;
    }

    function hideCard(btn) {
      if (!btn) return;
      btn.classList.remove("flipped");
      btn.innerHTML = "";
    }

    function checkForMatch() {
      if (openCards.length !== 2) return;

      const [first, second] = openCards;

      gameState.moves++;
      updateStatsUI();

      lockBoard = true;

      if (first.value === second.value) {
        first.el.classList.add("matched");
        second.el.classList.add("matched");

        first.el.disabled = true;
        second.el.disabled = true;

        gameState.matchedPairs++;
        updateStatsUI();

        openCards = [];
        lockBoard = false;

        if (gameState.matchedPairs === gameState.totalPairs) {
          stopTimer();
          gameState.isRunning = false;

          const diff = currentDifficulty;
          const currentMoves = gameState.moves;
          const previousBest = bestScores[diff];

          if (previousBest == null || currentMoves < previousBest) {
            bestScores[diff] = currentMoves;
            saveBestScores();
            updateBestScoresUI();
          }

          if (messageEl) {
            messageEl.textContent = "Sveikiname! Radote visas poras! 🎉";
            messageEl.classList.add("text-success");
          }
        }
      } else {
        setTimeout(() => {
          hideCard(first.el);
          hideCard(second.el);

          openCards = [];
          lockBoard = false;
        }, 1000);
      }
    }

    function handleCardClick(e) {
      const btn = e.target.closest(".game-card");
      if (!btn || !boardEl.contains(btn)) return;

      if (!gameState.isRunning) return;

      if (lockBoard) return;

      if (btn.classList.contains("flipped") || btn.classList.contains("matched")) {
        return;
      }

      if (openCards.length >= 2) {
        return;
      }

      flipCard(btn);

      openCards.push({
        el: btn,
        id: btn.dataset.cardId,
        value: btn.dataset.cardValue
      });

      if (openCards.length === 2) {
        checkForMatch();
      }
    }

    if (boardEl) {
      boardEl.addEventListener("click", handleCardClick);
    }

    if (difficultyButtons && difficultyButtons.length > 0) {
      difficultyButtons.forEach(btn => {
        btn.addEventListener("click", () => {
          const selectedDiff = btn.dataset.difficulty;
          if (!DIFFICULTIES[selectedDiff]) return;

          currentDifficulty = selectedDiff;

          difficultyButtons.forEach(b => {
            b.classList.toggle("active", b === btn);
          });

          initNewGame();
        });
      });
    }

    if (startBtn) {
      startBtn.addEventListener("click", () => {
        initNewGame();
        gameState.isRunning = true;
        startTimer();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        initNewGame();
        gameState.isRunning = true;
        startTimer();
      });
    }

    loadBestScores();
    initNewGame();
  });
})();
