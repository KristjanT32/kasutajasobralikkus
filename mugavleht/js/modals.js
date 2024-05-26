let modalShown = false;
let secondaryModalShown = false;
let currentCloseCallback = undefined;

const modalArea = document.querySelector(".modal-popup-area");
const interactionBlocker = document.querySelector(".interaction-blocker");

// The duration of the modal popup hide animation, in milliseconds.
const HIDE_ANIM_DURATION = 200;

// Whether the modals shown are to be dark.
let darkModals = false;

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
      src="/assets/logo.png"
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
      src="/assets/logo.png"
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
    <img src="/assets/logo.png" alt="SBE logo" width="100px" height="100px" />
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
			  <b class="generic-label">SBE kvalifitseeritud tiim valideerib hetkel Teie nime õigsust ja vastavust <a href="https://www.youtube.com/watch?v=iOztnsBPrAA&list=PL3tRBEVW0hiDL09lO0xjKEix84OY27xet">SBE nimesobivuseeskirjadega</a>.</b>
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
			  <b class="generic-label">SBE kvalifitseeritud tiim valideerib hetkel Teie valiku õigsust ja vastavust <a href="https://www.example.org">SBE valikusobivuseeskirjadega</a>.</b>
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
	src="/assets/logo.png"
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
			  <b class="generic-label">SBE kvalifitseeritud tiim valideerib hetkel Teie laenutingimuste saadavust ja vastavust <a href="https://www.example.org">SBE laenuväljastusüldpõhireeglistikuga</a>.</b>
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
	  	  <br style="margin-top: 10px" />
	  	  <span class="material-symbols-outlined" style='font-size: 80px;'>emergency_home</span>
		  <div class="title">Kahjuks pole see laen saadaval</div>
		  <br>
		  <div class="description">Teie poolt valitud laenupakett ei ole hetkel saadaval. Kui soovite, saate valida muu paketi.</div>
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
	  <br style="margin-top: 10px" />
	  <span class="material-symbols-outlined" style='font-size: 80px;'>verified</span>
		  <div class="title">Laenutaotlus esitatud</div>
		  <br>
		  <div class="description">Saatsime Teie laenutaotluse SBE panga laenuosakonda. Teiega võetakse ühendust.</div>
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
	src="/assets/logo.png"
	alt="SBE logo"
	width="100px"
	height="100px"
/>
  <div class="modal-content">
	<div class="title" style='color:red'>Kahjuks maffia on teie raha ära kaotanud.</div>
	<div class="description"></div>
	<br style="margin-top: 20px" />
  </div>
</div>
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
	src="/assets/logo.png"
	alt="SBE logo"
	width="100px"
	height="100px"
/>
  <div class="modal-content">
	<div class="title" style='color:red'>Läti maffia tõi teie raha tagasi!!</div>
	<div class="description">Nad mitmekordistasid teie raha!!!</div>
	<br style="margin-top: 20px" />
  </div>
</div>
</div>`
];

function setDark(enabled) {
    darkModals = enabled;
}

/**
 * Shows a predefined modal by its ID.
 * @param {int} modalID - the ID of the modal type to use
 * @param {object} settings - the settings for the modal
 * @param {function} onDismissCallback - the callback for when the user attempts to dismiss the modal. Defaults to closing the modal.
 */
function showDefinedModal(modalID, settings, onDismissCallback = hideDefinedModal, onCloseCallback = undefined) {
    if (modals[modalID] == undefined) {
        showNotification(`Modaalakent indeksiga ${modalID} ei ole olemas. Suurim võimalik indeks on ${modals.length - 1}.`, 1, 5000);
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
                    .replaceAll('modal-popup-defined', darkModals ? 'modal-popup-defined dark' : 'modal-popup-defined')
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
                .replaceAll('modal-popup-defined', darkModals ? 'modal-popup-defined dark' : 'modal-popup-defined')
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