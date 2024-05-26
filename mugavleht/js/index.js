const modal = document.querySelector(".modal-popup");
const modalTitle = document.querySelector(".modal-popup .title");
const modalDesc = document.querySelector(".modal-popup .description");
const modalDismiss = document.querySelector(
    ".modal-popup .modal-dismiss-button"
);

const modalContent = document.querySelector(".modal-popup .modal-content");
const modalClosing = document.querySelector(".modal-popup .modal-closing");

const ebankButton = document.querySelector(".ebanking-button");

// The admin access code
const ADMIN_CODE = 42069;

// The maximum length of the admin code
const CODE_MAX_LENGTH = 8;

// Currently generated names.
let currentNames = [];

let namesGenerated = false;

// The maximum amount of random names to fetch.
const MAX_RANDOM_NAMES = 20;

let timerLabel = document.querySelector(".estimated-processing-time");
let loadingStatus = document.querySelector(".loading-status");
let accessibilityButton = document.querySelector(".ligipaasetavus-nupp");
let messageboard = document.querySelector(".messageboard");
let kasiino = document.querySelector(".kasiino");
let laps = document.querySelector(".laps");
let mafia = document.querySelector(".mafia");

let currentModalTimer = 0;
let timerRunning = false;

let username = undefined;
let cached_username = "";
let password = undefined;

let adminCodeString = "";

const loadingPhrases = [
    "Kontrollime õigsust...",
    "Uurime statistilist tõenäosust...",
    "Töötleme andmeid...",
    "Arvutame animatsioonide kiiruseid...",
    "Suhtleme serveriga...",
    "Analüüsime vastust...",
    "Värskendame SBE andmeõigsuseeskirju...",
    "Valideerime valikuid...",
    "Loome kunstilist pingetunnet...",
    "Kustutame alla keskmise teenivate klientide kontosid...",
    "Arvutame intresse...",
    "Suhtleme keskpangaga...",
    "Ootame vastust serverilt...",
    "Analüüsime teie valikuid...",
];

const messages = [
    `<div class="messageboard_content">
	<div style='width: 200px;'>
		Soovite scroll'ida??
	</div>
		<button class = "btn">Muukige lahti kerimine</button>
</div>`
];


modalDismiss.addEventListener("click", () => {
    modalContent.style.display = "none";
    modalClosing.style.display = "block";
    startRandomTimer(180);
});

accessibilityButton.addEventListener("click", () => {
    document.body.style = "transform: rotate(90deg) scale(10%);  transition: 30s ease-in-out"
    setTimeout(() => {
        document.body.style = "transform: rotate(0deg) scale(100%);  transition: 30s ease-in-out"
    }, 10000 + 30000)
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
 * Hides the currently visible modal dialog (if any)
 */
function hideModal() {
    if (!modalShown) return;

    modal.classList.remove("modal-popup-show");

    if (!modal.classList.contains("modal-popup-hide")) {
        modal.classList.add("modal-popup-hide");
        setTimeout(() => {
            modal.classList.remove("modal-popup-hide");
        }, HIDE_ANIM_DURATION)
    } else {
        modal.classList.remove("modal-popup-hide");
    }

    modalShown = false;
    interactionBlocker.style.display = "none";
}


function numpad_num(n) {
    let codeLabel = document.querySelector(".admin-login-code");

    if (adminCodeString.length >= 8) {
        return;
    }

    adminCodeString += n.toString();
    codeLabel.innerText = adminCodeString;
}

function numpad_backspace() {
    let codeLabel = document.querySelector(".admin-login-code");

    if (adminCodeString.length != 0) {
        adminCodeString = adminCodeString.substring(0, adminCodeString.length - 1);
    } else {
        adminCodeString = "";
    }
    codeLabel.innerText = adminCodeString;
}

function numpad_ok() {
    if (adminCodeString == ADMIN_CODE) {
        login("admin", "admin");
    } else {
        let audio = new Audio("assets/audio/wrong.mp3");
        audio.volume = .5;
        audio.play();
    }
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
 * Starts a timer for `max` seconds to be displayed on `timerLabelID` and status message label `statusLabelID`.
 * @param {int} max The duration of the timer (in seconds)
 * @param {string} timerLabelClass The class of label on which to show the timer (without the dot)
 * @param {string} statusLabelClass The class of the label on which to show the status messages (without the dot)
 */
function startRandomTimerOnLabel(max, timerLabelClass, statusLabelClass) {
    if (timerRunning) return;

    let _timerLabel = document.querySelector("." + timerLabelClass);
    let _statusLabel = document.querySelector("." + statusLabelClass);

    if (_timerLabel == undefined) {
        log(
            "Could not find the label element with class '." + timerLabelClass + "'"
        );
        return;
    }

    if (_statusLabel == undefined) {
        log(
            "Could not find the label element with class '." +
            timerLabelClass +
            "' - status messages will not be shown."
        );
    }

    currentModalTimer = Math.ceil(Math.random() * max);
    timerRunning = true;

    let timer = setInterval(() => {
        if (currentModalTimer > 0) {
            currentModalTimer--;
            _timerLabel.innerText = formatTime(currentModalTimer);

            if (currentModalTimer % 2 === 0) {
                _statusLabel.innerText =
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
 * Fetches a new set of `count` random names,
 * and sets them as options to the `.nameselect` dropdown.
 * @param {int} count The number of names to request.
 */
function fetchRandomNames(count) {
    currentNames = [];

    for (let i = 0; i < count; i++) {
        let req = new XMLHttpRequest();
        req.open('GET', "../request/fetchNames.php")
        req.send();

        req.onreadystatechange = () => {
            if (req.readyState === 4 && req.status === 200) {
                let name = JSON.parse(req.response).name;
                if (!currentNames.includes(name)) {
                    currentNames.push(name);
                    refreshNameSelector();
                }
            }
        }
    }
}

function register() {
    registerUser(username, password)
}

function refreshNameSelector() {
    const selector = document.querySelector(".nameselect");

    for (let i = 0; i < selector.options.length; i++) {
        selector.options.remove(i);
    }
    currentNames.forEach((name) => {
        selector.innerHTML += "<option>" + name + "</option>";
    });
}

function openNameFileSelector() {
    let input = document.querySelector(".name-file-input > input");
    input.click();
}


function checkGoldLoginFields() {
    const input = document.querySelector('.credit-card-input');
    input.addEventListener('input', () => {
        const input = document.querySelector('.credit-card-input');
        input.value = formatCreditCardNumber(input.value);
    });

    const field_1 = document.querySelector('.credit-card-input');
    const field_2 = document.querySelector('.date');
    const field_3 = document.querySelector('.kolm-numbrit');
    const button = document.querySelector('.KULD-nupp');

    button.disabled = !((field_1.value.length == 19) && field_2.value != '' && (field_3.value.length == 3));
}

function disableScroll() {
    // Get the current page scroll position
    scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop;
    scrollLeft =
        window.pageXOffset ||
        document.documentElement.scrollLeft,

        // if any scroll is attempted,
        // set this to the previous value
        window.onscroll = function () {
            window.scrollTo(scrollLeft, scrollTop);
        };
}

function enableScroll() {
    window.onscroll = function () {
    };
}

let uni = false;

function ShowMessage(num) {
    uni = true;
    messageboard.style.opacity = 1;
    messageboard.innerHTML = messages[num];


    let btn = document.querySelector(".btn");
    btn.addEventListener("click", () => {
        HideMessage();
        enableScroll();
        setTimeout(() => {
            uni = false;
        }, getRandomInteger(5000, 15000));
    });
}

function HideMessage() {
    messageboard.style.opacity = 0;
    messageboard.innerHTML = '';
}

window.addEventListener('load', () => {
    disableScroll();
});


window.addEventListener("scroll", () => {
    if (!uni) {
        ShowMessage(0);
        messageboard.style.animation = "spawn 4.5s forwards cubic-bezier(0.155, 0.440, 0.350, 1.000)";
    }
    ;
});

