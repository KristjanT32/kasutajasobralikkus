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
let btn = document.querySelector(".btn");

let modalShown = false;
let secondaryModalShown = false;
let currentCloseCallback = undefined;

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

const modals = [
	`<div class="modal-popup-defined">
  <div class="modal-dismiss-button" >
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
  <div
    class="modal-dismiss-button"
    >
    <i
      class="fas fa-times"
      style="font-family: 'Font Awesome 5 Solid'"></i>
  </div>
  <div class="text-container">
    <img
      src="/mugavleht/assets/logo.png"
      alt="SBE logo"
      width="100px"
      height="100px" />
    <div class="modal-content">
      <div class="title" id="admin-entry-button">Logi sisse!</div>
      <div class="description">
        Kasutage oma SBE isikuandmeid sisselogimiseks
      </div>
      <br />
      <div class="vertical-center">
        <label for="name">Kasutajanimi</label>
        <div class="name-file-input" onclick="openNameFileSelector()">
          <b>Valige nimefail</b>
          <input
            type="file"
            id="name" />
        </div>

        <br style="display: block; margin-top: 20px" />

        <label for="psswrd">Sisetage parool</label>
        <input
          type="password"
          id="psswrd" />

        <br style="display: block; margin-top: 20px" />

        <button class="login" onclick='login()'>Logi sisse</button>

        <br style="display: block; margin-top: 20px" />

        <span class='generic-label'>
          Pole veel SBE klient?
          <a
            href="javascript:void(0)"
            onclick="showDefinedModal(2, {})"
            class="register-link">
            Registreeri
          </a>
        </span>
      </div>
      <br style="margin-top: 20px" />
    </div>
  </div>
</div>`,
	`<div class="modal-popup-defined">
  <div class="modal-dismiss-button" >
    <i class="fas fa-times" style="font-family: 'Font Awesome 5 Solid'"></i>
  </div>
  <div class="text-container">
    <img src="/mugavleht/assets/logo.png" alt="SBE logo" width="100px" height="100px" />
    <div class="modal-content">
      <div class="title">Registreeri ennast kasutajaks</div>
      <br>
      <div class="vertical-center">
        <label for="name2">Valige nimi</label>
        <select class='nameselect'><!-- Automatically filled --></select>

        <br style="display: block; margin-top: 15px;">

        <label for="pswrd">Sisestage turvaline parool</label>
        <input type="password" id="pswrd"> </input>
      </div>
      <br style="display: block; margin-top: 20px;">
      
      <button class="register" onclick='showDefinedModal(3, {}, () => {showNotification("Teie otsust töödeldakse veel!", 1, 5000)}, () => {register()}); username = document.querySelector(".nameselect").value; password = document.querySelector("#pswrd").value; '>Registreeri</button>

	  <div><br style="display: block; margin-top: 20px; margin-left: 10px"></div>

      <span class='generic-label'>
        Olete juba SBE klient?
        <a
          href="javascript:void(0)"
          onclick="showDefinedModal(1, {})"
          class="login-link">
          Logige sisse
        </a>
      </span>
    </div>
  </div>
  </div>`,
	`<div class="modal-popup-defined">
		<div class="modal-dismiss-button" >
    		<i class="fas fa-times" style="font-family: 'Font Awesome 5 Solid'"></i>
  		</div>

  <div class="text-container">
	  <div class="modal-content">
		  <div class="title">Üks hetk, palun...</div>
		  <br>
		  <div class='vertical-center'><div class="spinner modal-spinner"></div></div>
		  <div class="description"></div>
		  <br style="margin-top: 20px">
		  <div class="vertical-center">
			  <b class="generic-label">SBE kvalifitseeritud tiim valideerib hetkel teie nime õigsust ja vastavust <a href="https://www.example.org">SBE nimesobivuseeskirjadega</a>.</b>
			  <div class="generic-label">
				  Valideerimine võtab vaid mõne hetke. Palun oodake.
			  </div>
		  </div>
	  </div>
  </div>
  <br>
</div>`,
	`<div class="modal-popup-defined">
		<div class="modal-dismiss-button" >
    		<i class="fas fa-times" style="font-family: 'Font Awesome 5 Solid'"></i>
  		</div>

  <div class="text-container">
	  <div class="modal-content">
		  <div class="title">Üks hetk, palun...</div>
		  <br>
		  <div class='vertical-center'><div class="spinner modal-spinner"></div></div>
		  <div class="description"></div>
		  <br style="margin-top: 20px">
		  <div class="vertical-center">
			  <b class="generic-label">SBE kvalifitseeritud tiim valideerib hetkel teie valiku õigsust ja vastavust <a href="https://www.example.org">SBE valikusobivuseeskirjadega</a>.</b>
			  <div class="generic-label">
				  Valideerimine võtab vaid mõne hetke. Palun oodake.
			  </div>
		  </div>
	  </div>
  </div>
  <br>
</div>`,
	`<div class="modal-popup-defined">
<div class="modal-dismiss-button" >
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
	<div class="title" style='color:red'><span class="gold-tier">KULD</span></div>
	<div class="vertical-center">
		<br>
		<span class="generic-label"  style="font-weight: bold; margin-bottom: 5px;">Teie krediitkaardi number</span>
		<input 
				type="text"
				  autocomplete="cc-number"
				  maxlength="19"
				  placeholder="XXXX XXXX XXXX XXXX"
				class="centered credit-card-input"
				oninput="checkGoldLoginFields()"
				/>
		</br>
		<br>
		<span class="generic-label"  style="font-weight: bold; margin-bottom: 5px;">Teie krediitkaardi aegumiskuupäev</span>
		<input oninput="checkGoldLoginFields()" type="date" placeholder="pp/aa/kk" class="centered date"></input>
		</br>
		<br>
		<span class="generic-label" style="font-weight: bold; margin-bottom: 5px;">Ning need kolm wacky numbrit seal taga</span>
		<input oninput="checkGoldLoginFields()" type="text" placeholder="123" maxlength="3" class="centered kolm-numbrit" id="intTextBox"></input>
		</br>
		<br>
		<button disabled onclick="showDefinedModal(4, {})" class="centered KULD-nupp"> Jätka <span class="gold-tier">KULD</span> tasemel kliendina!</button>
	
		<br style="margin-top: 20px" />
	</div>
  </div>
</div>
</div>`,
	`<div class="modal-popup-defined">
	<div class="modal-dismiss-button">
		<i
			class="fas fa-times"
			style="font-family: 'Font Awesome 5 Solid'"></i>
	</div>
	<div class="text-container">
		<div class="modal-content">
			<div class="title">Ligipääs administraatorina</div>
			<div
				class="description"
				style="margin-top: 5px">
				Sisestage megasalajane superkood, et siseneda SBE erakliendi
				internetipanka administraatori privileegidega.
			</div>
			<br style="margin-top: 5px" />
			<div class="admin-login-code">CODE</div>
			<div class="admin-login-buttons">
				<button class="number-button" onclick="numpad_num(1)">1</button>
				<button class="number-button" onclick="numpad_num(2)">2</button>
				<button class="number-button" onclick="numpad_num(3)">3</button>
				<button class="number-button" onclick="numpad_num(4)">4</button>
				<button class="number-button" onclick="numpad_num(5)">5</button>
				<button class="number-button" onclick="numpad_num(6)">6</button>
				<button class="number-button" onclick="numpad_num(7)">7</button>
				<button class="number-button" onclick="numpad_num(8)">8</button>
				<button class="number-button" onclick="numpad_num(9)">9</button>
				<button class="number-button" onclick="numpad_num(0)">0</button>
				<button class="number-button" onclick="numpad_backspace()">DEL</button>
				<button class="number-button" onclick="numpad_ok()">OK</button>
			</div>
		</div>
	</div>
</div>`
];

const messages = [
	`<div class="vertical-center" style="margin-right: 300px;">
	<span>Soovite scroll'ida??</span>
	<br />
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
 * Shows a predefined modal by its ID.
 * @param {int} modalID - the ID of the modal type to use
 * @param {object} settings - the settings for the modal
 * @param {function} onDismissCallback - the callback for when the user attempts to dismiss the modal. Defaults to closing the modal.
 */
function showDefinedModal(modalID, settings, onDismissCallback = hideDefinedModal, onCloseCallback = undefined) {
	if (modals[modalID] == undefined) {
		showNotification(`Modaali indeksiga ${modalID} ei ole olemas. Viimane võimalik indeks on ${modals.length - 1}.`, 1, 5000);
		return;
	}

	if (secondaryModalShown) {
		hideDefinedModal();
		setTimeout(() => {
			modalArea.insertAdjacentHTML(
				"beforeend",
				modals[modalID]
					.replaceAll('{title}', settings.title)
					.replaceAll('{description}', settings.desc)
			);

			let dismissButton = document.querySelector(".modal-popup-defined .modal-dismiss-button");
			dismissButton.addEventListener('click', () => {
				onDismissCallback();
			});


			secondaryModalShown = true;
			interactionBlocker.style.display = "block";

			currentCloseCallback = onCloseCallback;
		}, HIDE_ANIM_DURATION);
	} else {
		modalArea.insertAdjacentHTML(
			"beforeend",
			modals[modalID]
				.replaceAll('{title}', settings.title)
				.replaceAll('{description}', settings.desc)
		);

		let dismissButton = document.querySelector(".modal-popup-defined .modal-dismiss-button");
		dismissButton.addEventListener('click', () => {
			onDismissCallback();
		});

		secondaryModalShown = true;
		interactionBlocker.style.display = "block";

		currentCloseCallback = onCloseCallback;
	}

	initModal(modalID, settings);
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

	// Run the onCloseCallback for the modal, if any
	if (currentCloseCallback != undefined) {
		log("Running the onClose callback...")
		currentCloseCallback();
		currentCloseCallback = undefined;
	}
}

/**
 * Runs init stuff for the specified modal.
 * @param {int} modalID The ID of the modal to run init stuff for.
 * @param {object} settings The settings for the modal.
 */
function initModal(modalID, settings) {
	switch (modalID) {
		case 1:
			let selector = document.querySelector(".name-file-input > input");
			selector.addEventListener("change", (event) => {
				let label = document.querySelector(".name-file-input > b");
				label.innerText = "Nimefail: " + selector.files[0].name;
				getNameFileContents(selector.files[0], 30).then((val) => {
					showNotification(`Tere tulemast, ${val}`, 3, 5000);
				}
				);
			});

			const adminPromptButton = document.querySelector("#admin-entry-button");
			adminPromptButton.addEventListener('click', () => {
				showDefinedModal(6, {});
			});

			break;

		case 2:
			if (currentNames.length == 0) {
				fetchRandomNames(Math.ceil(Math.random() * MAX_RANDOM_NAMES));
			} else {
				refreshNameSelector();
			}
			break;

		case 3:
			setTimeout(() => {
				hideDefinedModal();
			}, getRandomInteger(10) * 1000);
			break;
	}
}

function numpad_num(n) {
	let codeLabel = document.querySelector(".admin-login-code");

	if (adminCodeString.length >= 8) { return; }

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
		let audio = new Audio("/mugavleht/assets/audio/wrong.mp3");
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
 * @param {int} count The amount of names to request.
 */
function fetchRandomNames(count) {
	currentNames = [];
	for (i = count; i > 0; i--) {
		const req = new XMLHttpRequest();
		req.onreadystatechange = () => {
			if (req.readyState == 4 && req.status == 200) {
				let name = JSON.parse(req.response).name;
				if (!currentNames.includes(name)) {
					currentNames.push(name);
					refreshNameSelector();
				}
			}
		};
		req.open("GET", "https://api.namefake.com/spanish/male");
		req.send();
	}
}

function register() {
	registerUser(username, password)
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
	window.onscroll = function () { };
}

function ShowMessage(num) {
	messageboard.innerHTML = messages[num];
	messageboard.style.opacity = 1;
}
function HideMessage() {
	messageboard.style.opacity = 0;
	messageboard.innerHTML = '';
}

window.onloadend = disableScroll();
window.addEventListener("scroll", () => {

	ShowMessage(0)
});
btn.addEventListener("click", () => {
	HideMessage();
	enableScroll();
});

