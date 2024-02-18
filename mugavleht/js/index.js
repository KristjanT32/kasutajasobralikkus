let modal = document.querySelector(".modal-popup");
let modalTitle = document.querySelector(".modal-popup .title");
let modalDesc = document.querySelector(".modal-popup .description");
let modalDismiss = document.querySelector(".modal-popup .modal-dismiss-button");

let modalContent = document.querySelector(".modal-popup .modal-content");
let modalClosing = document.querySelector(".modal-popup .modal-closing");

let timerLabel = document.querySelector(
  ".modal-popup .estimated-processing-time"
);
let loadingStatus = document.querySelector(".modal-popup .loading-status");
let modalShown = false;

let currentModalTimer = 0;
let timerRunning = false;

const loadingPhrases = [
  "Kontrollime õigsust...",
  "Uurime statistilist tõenäosust...",
  "Töötleme andmeid...",
  "Arvutame animatsioonide kiiruseid...",
  "Suhtleme serveriga...",
  "Analüüsime vastust...",
];

modalDismiss.addEventListener("click", () => {
  modalContent.style.display = "none";
  modalClosing.style.display = "block";
  startRandomTimer(180);
});

/**
 * Show a modal dialog to the user.
 * @param {string} title The title of the modal dialog.
 * @param {string} desc The description text of the modal dialog.
 */
function showModal(title, desc) {
  if (modalShown) return;
  modalShown = true;

  if (title == "!default") {
    title = "Ligipääs keelatud!";
  }

  if (desc == "!default") {
    desc =
      "See veebilehe funktsioon on saadaval vaid SBE panga <span class='gold-tier'>KULD</span> tasemel klientidele.";
  }

  modalTitle.innerText = title;
  modalDesc.innerHTML = desc;

  if (!modal.classList.contains("modal-popup-show")) {
    modal.classList.add("modal-popup-show");
  }
}

/**
 * Hides the currently visible modal dialog (if any)
 */
function hideModal() {
  if (!modalShown) return;

  modal.classList.remove("modal-popup-show");

  if (!modal.classList.contains("modal-popup-hide")) {
    modal.classList.add("modal-popup-hide");
  } else {
    modal.classList.remove("modal-popup-hide");
  }

  modalShown = false;
}

/**
 * Starts a timer for the modal dialog for <b>0 to `max`</b> seconds.
 * @param {int} max The duration of the timer (in seconds)
 */
function startRandomTimer(max) {
  if (timerRunning) return;

  currentModalTimer = Math.ceil(Math.random() * max);
  timerRunning = true;

  let timer = setInterval(() => {
    if (currentModalTimer > 0) {
      currentModalTimer--;
      timerLabel.innerText = formatTime(currentModalTimer);

      if (currentModalTimer % 2 === 0) {
        loadingStatus.innerText =
          loadingPhrases[Math.ceil(Math.random() * loadingPhrases.length) - 1];
      }
    } else {
      timerRunning = false;
      clearInterval(timer);
      hideModal();
    }
  }, 1000);
}

/**
 * Formats a duration in seconds to `MM:SS` (`e.g 125s => 02:05`)
 * @param {int} seconds The duration to format, in seconds.
 * @returns {string} The formatted duration string.
 */
function formatTime(seconds) {
  let minutes = Math.floor(seconds / 60);
  let secs = Math.floor(seconds - minutes * 60);
  return (
    (minutes <= 9 ? "0" + minutes : minutes) +
    ":" +
    (secs <= 9 ? "0" + secs : secs)
  );
}
