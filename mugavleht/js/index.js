const modal = document.querySelector(".modal-popup");
const modalTitle = document.querySelector(".modal-popup .title");
const modalDesc = document.querySelector(".modal-popup .description");
const modalDismiss = document.querySelector(
  ".modal-popup .modal-dismiss-button"
);
const modalArea = document.querySelector(".modal-popup-area");
const interactionBlocker = document.querySelector(".interaction-blocker");

const modalContent = document.querySelector(".modal-popup .modal-content");
const modalClosing = document.querySelector(".modal-popup .modal-closing");

const ebankButton = document.querySelector(".ebanking-button");

// The duration of the modal popup hide animation, in milliseconds.
const HIDE_ANIM_DURATION = 200;

// Currently generated names.
let currentNames = [];

let namesGenerated = false;

// The maximum amount of random names to fetch.
const MAX_RANDOM_NAMES = 20;

let timerLabel = document.querySelector(
  ".modal-popup .estimated-processing-time"
);
let loadingStatus = document.querySelector(".modal-popup .loading-status");

let modalShown = false;
let secondaryModalShown = false;

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

const modals = [
  `<div class="modal-popup-defined">
  <div class="modal-dismiss-button" onclick='hideDefinedModal()'>
    <i
      class="fas fa-times"
      style="font-family: 'Font Awesome 5 Solid'"
    ></i>
  </div>
  <div class="text-container">
  <img
      src="/mugavleht/assets/logo.png"
      alt="SBE logo"
      width="100px"
      height="100px"
  />
    <div class="modal-content">
      <div class="title" style='color:red'>{title}</div>
      <div class="description">{description}</div>
      <br style="margin-top: 20px" />
    </div>
  </div>
</div>`,
  `<div class="modal-popup-defined">
<div class="modal-dismiss-button" onclick='hideDefinedModal()'>
  <i class="fas fa-times" style="font-family: 'Font Awesome 5 Solid'"></i>
</div>
<div class="text-container">
  <img src="/mugavleht/assets/logo.png" alt="SBE logo" width="100px" height="100px" />
  <div class="modal-content">
    <div class="title">Logi sisse!</div>
    <div class="description">Kasutage oma SBE isikuandmeid sisselogimiseks</div>
    <br>
    <div class="vertical-center">
      <label for="name">Kasutajanimi</label>
      <input type="file" id="name">
      <br>
      <label for="psswrd">Sisetage parool</label>
      <input type="password" id="psswrd">
      <br>
      <label for="inshal"> <a class="secretbabyinshallah"
          href="https://www.youtube.com/shorts/p5wmXb9Pr9g">Inshallah?</a></label>
      <input type="siu" id="inshal">
      <a href="javascript:void(0)" onclick="hideDefinedModal(1, {}); showDefinedModal(2, {})">
        Registreeri
      </a>
    </div>
    <br style="margin-top: 20px" />
  </div>
</div>
</div>`,
  `<div class="modal-popup-defined">
<div class="modal-dismiss-button" onclick='hideDefinedModal()'>
  <i class="fas fa-times" style="font-family: 'Font Awesome 5 Solid'"></i>
</div>
<div class="text-container">
  <img src="/mugavleht/assets/logo.png" alt="SBE logo" width="100px" height="100px" />
  <div class="modal-content">
    <div class="title">Registreeri ennast kasutajaks</div>
    <br>
    <div class="vertical-center">
      <label for="name2"> Valige nimi</label>
      <select class='nameselect' onclick='setSelectorNames()'>
        
      </select>
      <br>
      <label for="pswrd"> Valige parool</label>
      <input type="password" id="pswrd"> </input>
      <br>
    </div>
    <div>
      <button onclick="showDefinedModal(1, {})">Registreeri</button>
    </div>
    <br style="margin-top: 20px" />
  </div>
</div>
</div>`,
];

modalDismiss.addEventListener("click", () => {
  modalContent.style.display = "none";
  modalClosing.style.display = "block";
  startRandomTimer(180);
});

/**
 * Show the default modal dialog to the user.
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
  interactionBlocker.style.display = "block";
}

/**
 * Shows a predefined modal by its ID.
 * @param {int} modalID - the ID of the modal type to use
 * @param {object} settings - the settings for the modal
 */
function showDefinedModal(modalID, { title, desc, bt1, bt2, cb1, cb2 }) {
  if (modals[modalID] == undefined) {
    log(
      "ModalID " +
        modalID +
        " is invalid. The largest available index is " +
        (modals.length - 1)
    );
    return;
  }

  if (secondaryModalShown) {
    hideDefinedModal();
    setTimeout(() => {
      modalArea.insertAdjacentHTML(
        "beforeend",
        modals[modalID]
          .replaceAll("{title}", title ? title : "")
          .replaceAll("{description}", desc ? desc : "")
      );
      secondaryModalShown = true;
      interactionBlocker.style.display = "block";
    }, HIDE_ANIM_DURATION);
  } else {
    modalArea.insertAdjacentHTML(
      "beforeend",
      modals[modalID]
        .replaceAll("{title}", title ? title : "")
        .replaceAll("{description}", desc ? desc : "")
    );
    secondaryModalShown = true;
    interactionBlocker.style.display = "block";
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
  interactionBlocker.style.display = "none";
}

function hideDefinedModal() {
  if (!secondaryModalShown) return;
  document
    .querySelector(".modal-popup-defined")
    .classList.remove("modal-popup-show");
  document
    .querySelector(".modal-popup-defined")
    .classList.add("modal-popup-hide");

  setTimeout(() => {
    document
      .querySelector(".modal-popup-defined")
      .classList.remove("modal-popup-hide");
    document.querySelector(".modal-popup-defined").remove();

    secondaryModalShown = false;
    interactionBlocker.style.display = "none";
  }, HIDE_ANIM_DURATION);
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

function generateNames(count) {
  namesGenerated = false;
  currentNames = [];

  log("Fetching random names...");
  for (i = count; i > 0; i--) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        currentNames.push(JSON.parse(xhttp.response).name);
        refreshNameSelector();
      }
    };
    xhttp.open("GET", "https://api.namefake.com/spanish/male");
    xhttp.send();
  }
  namesGenerated = true;
}

function setSelectorNames() {
  if (
    namesGenerated &&
    document.querySelector(".nameselect").options.length == 0
  ) {
    refreshNameSelector();
  } else {
    generateNames(Math.ceil(Math.random() * MAX_RANDOM_NAMES));
    refreshNameSelector();
  }
}

function refreshNameSelector() {
  const selector = document.querySelector(".nameselect");

  for (i = 0; i < selector.options.length; i++) {
    selector.options.remove(i);
  }
  currentNames.forEach((name) => {
    selector.innerHTML += "<option>" + name + "</option>";
  });
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

/**
 * Logs the provided string to the console.
 * This function automatically determines, whether the logged message is an error or not based on the content.
 * @param {string} str The message to log.
 */
function log(str) {
  let errorWords = [
    "error",
    "failed",
    "couldn't",
    "could not",
    "err",
    "failure",
    "not found",
    "invalid",
  ];
  if (
    str
      .toLowerCase()
      .split(" ")
      .filter((word) => errorWords.includes(word)).length > 0
  ) {
    console.error("[ERROR]: " + str);
  } else {
    console.info("[INFO]: " + str);
  }
}
