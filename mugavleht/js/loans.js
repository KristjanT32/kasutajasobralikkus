const consultantPanel = document.querySelector(".consultantProfile");
const consultantName = document.querySelector(".consultantProfile .name");
const consultantDesc = document.querySelector(".consultantProfile .desc");
const consultantImage = document.querySelector(".consultantProfile img");
const nextConsultantButton = document.querySelector(".nextConsultantButton");
const prevConsultantButton = document.querySelector(".prevConsultantButton");
const consultantPagination = document.querySelector(".consultantPagination");

const sumBox = document.querySelector("#loanSumInput");
const loanSelector = document.querySelector("#loanSelector");

const consultantLabel = document.querySelector(".consultantLabel");
const sumLabel = document.querySelector(".sumLabel");
const interestLabel = document.querySelector(".interestLabel");
const loanLabel = document.querySelector(".loanTypeLabel");


let refreshTask = undefined;

const consultants = {
    0: {
        name: "Peeter Sitarson",
        desc: "Mitmeaastase staažiga abivalmis härra. Vahepeal natuke mõrvatujuline.",
        img: "/mugavleht/assets/img/people/person001.jpeg"
    },

    1: {
        name: "Kuldar Taunsoo",
        desc: "Kahtlane tüüp. Osad väidavad, et näevad teda vahepeal koeradega malet mängimas.",
        img: "/mugavleht/assets/img/people/person002.jpeg"
    },

    2: {
        name: "Juhan Juhaan",
        desc: "See on tegelikult ka tema nimi.",
        img: "/mugavleht/assets/img/people/person003.jpeg"
    }
}


// Consultant selector stuff
let CONSULTANT_SELECTOR_LOCKED = false;
let currentConsultantIndex = 0;
const animationClasses = ["consultantSelector_nextAppear", "consultantSelector_nextHide", "consultantSelector_prevAppear", "consultantSelector_prevHide"]



setConsultant(0);
refreshTask = setInterval(() => {
    loanLabel.innerText = loanSelector.options[loanSelector.selectedIndex].innerText;
    consultantLabel.innerText = consultants[currentConsultantIndex].name;
    sumLabel.innerText = formatFunds(sumBox.value || 0) + "€";
    interestLabel.innerText = loanSelector.options[loanSelector.selectedIndex].getAttribute("interest");
}, 100);


function clearAnimationClasses() {
    consultantPanel.classList.remove(...animationClasses);
    console.log(currentConsultantIndex);
}

function setConsultant(index) {
    let person = consultants[index];
    if (person == undefined) {
        return;
    }
    consultantName.innerText = person.name;
    consultantDesc.innerText = person.desc;
    consultantImage.src = person.img;

    consultantPagination.innerHTML = "<b>" + (currentConsultantIndex + 1).toString() + "</b> / <b>" + (Object.keys(consultants).length).toString() + "</b>"
}

function nextConsultant() {
    if (CONSULTANT_SELECTOR_LOCKED) { return; }
    if (currentConsultantIndex == Object.keys(consultants).length - 1) {
        return;
    }

    currentConsultantIndex++;

    clearAnimationClasses();
    consultantPanel.classList.add("consultantSelector_nextHide");
    CONSULTANT_SELECTOR_LOCKED = true;
    setTimeout(() => {
        setConsultant(currentConsultantIndex);
        clearAnimationClasses();
        consultantPanel.classList.add("consultantSelector_nextAppear");
        CONSULTANT_SELECTOR_LOCKED = false;
    }, 400);
}

function prevConsultant() {
    if (CONSULTANT_SELECTOR_LOCKED) { return; }
    if (currentConsultantIndex == 0) {
        return;
    }

    currentConsultantIndex--;

    clearAnimationClasses();
    consultantPanel.classList.add("consultantSelector_prevHide");
    CONSULTANT_SELECTOR_LOCKED = true;
    setTimeout(() => {
        setConsultant(currentConsultantIndex);
        clearAnimationClasses();
        consultantPanel.classList.add("consultantSelector_prevAppear");
        CONSULTANT_SELECTOR_LOCKED = false;
    }, 400);
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
                    .replaceAll("modal-popup-defined", "modal-popup-defined")
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