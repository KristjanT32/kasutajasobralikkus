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

let pissedOffnessLevel = 0;


let refreshTask = undefined;

const consultants = [
    {
        name: "Peeter Sitarson",
        desc: "Mitmeaastase staažiga abivalmis härra. Vahepeal natuke mõrvatujuline.",
        img: "../../assets/img/people/person001.jpeg"
    },

    {
        name: "Kuldar Taunsoo",
        desc: "Kahtlane tüüp. Osa inimesi väidab, et näevad teda vahepeal koeradega malet mängimas.",
        img: "../../assets/img/people/person002.jpeg"
    },

    {
        name: "Juhan Juhaan",
        desc: "See on tegelikult ka tema nimi.",
        img: "../../assets/img/people/person003.jpeg"
    },

    {
        name: "Tõnis Niinemets",
        desc: "KACHOW! Ma LEIDSIN sinu.",
        img: "../../assets/img/people/19091709.jfif"
    },

    {
        name: "Jüri Ratas",
        desc: "Arvasid, et olen ainult poliitik? HAHAHAHAH, tule siia",
        img: "https://f7.pmo.ee/YUZqkvptMwUA_e_KgwHUVI7P0ns=/685x0/filters:focal(329x102:519x318)/nginx/o/2023/10/10/15646334t1hac5e.png"
    },
    {
        name: "Märt Avandi",
        desc: "Vist aitab sind, mdea, pole talt küsind",
        img: "../../assets/img/people/avandi.PNG"
    },
]

const loanPlans = [
    {
        name: "SBE Hüperlaen",
        interest: 56,
        available: true
    },
    {
        name: "SBE Kiirlaen",
        interest: 71,
        available: true
    },
    {
        name: "SBE Megalaen",
        interest: 66,
        available: true
    },
    {
        name: "SBE Ekstramegasuperduperlaen",
        interest: 40,
        available: true
    },
    {
        name: "SBE Tavalaen",
        interest: 10,
        available: false
    }
]

let selectedPlanIndex = 0;


// Consultant selector stuff
let CONSULTANT_SELECTOR_LOCKED = false;
let currentConsultantIndex = 0;
const animationClasses = ["consultantSelector_nextAppear", "consultantSelector_nextHide", "consultantSelector_prevAppear", "consultantSelector_prevHide"]


init();

function init() {
    setConsultant(0);

    let i = 0;
    loanPlans.forEach(plan => {
        loanSelector.innerHTML += `<option pindex=${i} interest=${plan.interest}>${plan.name}</option>`
        i++;
    });

    sumBox.addEventListener('input', () => {
        sumLabel.innerText = formatFunds(sumBox.value || 0) + "€";
    });

    loanSelector.addEventListener('change', (ev) => {
        selectedPlanIndex = ev.target.selectedIndex;
        refreshLoanTerms();
    });
}

function refreshLoanTerms() {
    interestLabel.innerText = loanPlans[selectedPlanIndex].interest + "%";
    loanLabel.innerText = loanPlans[selectedPlanIndex].name
    consultantLabel.innerText = consultants[currentConsultantIndex].name;
}

function handleLoan() {

    if (sumBox.value.length == 0) {
        switch (pissedOffnessLevel) {
            case 0: {
                showNotification("Palun sisestage laenusumma!", 1, 3000);
                pissedOffnessLevel++;
                return;
            }
            case 1: {
                showNotification("PALUN sisestage laenusumma!", 1, 3000);
                pissedOffnessLevel++;
                return;
            }
            case 2: {
                showNotification("SISESTA KURAT LAENUSUMMA! VIGA ON MIDAGI VÕI?", 1, 3000);
                pissedOffnessLevel++;
                return;
            }
            case 3: {
                showNotification("Aitab küll, naljamees. Kasi minema siit.", 1, 3000);
                setTimeout(() => {
                    window.location = "https://youtu.be/umDr0mPuyQc?&t=3";
                }, 1000);
                return;
            }
        }
        return;
    }

    showDefinedModal(7, {}, () => {
        showNotification('Teie otsust valideeritakse. Palun oodake.', 2, 5000)
    });
    setTimeout(() => {
        if (getRandomInteger(0, 1) == 1 || !loanPlans[selectedPlanIndex].available) {
            showDefinedModal(8, {})
        } else {
            showDefinedModal(9, {})
        }
    }, getRandomInteger(2000, 6000));
}


function clearAnimationClasses() {
    consultantPanel.classList.remove(...animationClasses);
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
    refreshLoanTerms();
}

function nextConsultant() {
    if (CONSULTANT_SELECTOR_LOCKED) {
        return;
    }
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
    if (CONSULTANT_SELECTOR_LOCKED) {
        return;
    }
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