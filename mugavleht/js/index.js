let modal = document.querySelector(".modal-popup")
let modalTitle = document.querySelector(".modal-popup .title")
let modalDesc = document.querySelector(".modal-popup .description")

let modalShown = false;

function showModal(title, desc) {

    if (modalShown) return;
    modalShown = true;

    if (title == "!default") {
        title = "Ligipääs keelatud!"
    }

    if (desc == "!default") {
        desc = "See veebilehe funktsioon on saadaval vaid SBE panga <span class='gold-tier'>KULD</span> tasemel klientidele."
    }

    modalTitle.innerText = title;
    modalDesc.innerHTML = desc;

    if (!modal.classList.contains("modal-popup-show")) {
        modal.classList.add("modal-popup-show");
    }
}

function hideModal() {
    if (!modalShown) return;

    modal.classList.remove("modal-popup-show");

    if (!modal.classList.contains("modal-popup-hide")) {
        modal.classList.add("modal-popup-hide");
    } else {
        modal.classList.remove("modal-popup-hide");
    }

    setTimeout(() => {
        modal.classList.remove("modal-popup-hide");
    }, 20000);
    modalShown = false;
}