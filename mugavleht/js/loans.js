const consultantPanel = document.querySelector(".consultantProfile");
const consultantName = document.querySelector(".consultantProfile .name");
const consultantDesc = document.querySelector(".consultantProfile .desc");
const consultantImage = document.querySelector(".consultantProfile img");
const nextConsultantButton = document.querySelector(".nextConsultantButton");
const prevConsultantButton = document.querySelector(".prevConsultantButton");
const consultantPagination = document.querySelector(".consultantPagination");



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