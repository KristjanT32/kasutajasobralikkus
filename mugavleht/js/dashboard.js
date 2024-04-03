const raha = document.querySelector("#raha_seis");
const greetingText = document.querySelector(".greetingLabel");
const kaardi_number = document.querySelector(".kaardi_number");
const aegumiskp = document.querySelector(".aegumiskp");
const kolm_numbrit = document.querySelector(".kolm_numbrit");

let balanceNumbers = document.querySelector(".balanceNumbers");
let balanceSymbol = document.querySelector(".balanceSymbol");

let balance_shown = false
let kaardi_number_showm, aegumiskp_shown, kolm_numbrit_shown = false

const currencies = {
    rupee: {
        symbol: "₹",
        exchangeRate: 0.011
    },
    dong: {
        symbol: "đ",
        exchangeRate: 0.000037
    },
    israel_shekel: {
      symbol: "₪",
      exchangeRate: 0.25
    },
    spesmilo: {
      symbol: "₷",
      exchangeRate: 14.84
    },
    saudi_arabia_riyal: {
      symbol: "﷼",
      exchangeRate: 0.25
    },
    poland_zloty: {
      symbol: "zł",
      exchangeRate: 0.23
    }
}




greetingText.innerHTML = "Tere tulemast tagasi, <b>" + JSON.parse(loadFromSessionStorage("currentsession")).user + "</b>";

function refreshBalance() {
    balanceNumbers.innerText = 20312.31 // asendada salvestatud infoga.

    let curs = Object.keys(currencies);
    let index = getRandomInteger(curs.length - 1);
    console.log(index);
    balanceSymbol.innerText = currencies[curs[index]].symbol;
}

function raha_seis() 
{
    if (!balance_shown) {
      raha.innerHTML = getRandomInteger(9999999) + "€";
      balance_shown = true;
    }
}

function hide_kaardi_number() {
  if(!kaardi_number_showm) {  
    kaardi_number.innerHTML = "Peidetud!";
    kaardi_number_showm = true;
    setTimeout(() => {
        kaardi_number.innerHTML = "Kaardi number: 1154 5895 5845 9975";
        kaardi_number_showm = false;
    }, 5 * 1000);
  }
}

function hide_aegumiskp() {
  if(!aegumiskp_shown){
    aegumiskp.innerHTML = "Peidetud!";
    aegumiskp_shown = true;
    setTimeout(() => {aegumiskp.innerHTML = "Aegumiskuupäev: 12.08.2007";
    aegumiskp_shown = false;
    }, 5 * 1000)
  }  
}

function hide_kolm_numbrit() {
  if(!kolm_numbrit_shown){
    kolm_numbrit.innerHTML = "Peidetud!";
    kolm_numbrit_shown = true;
    setTimeout(() => {kolm_numbrit.innerHTML = "Kolm numbrit: 167";
    kolm_numbrit_shown = false;
    }, 5 * 1000)
  }  
}
      

function toggleAccountNumber() {
    let accNumberLabel = document.querySelector(".account_no_toggle");
    if (accNumberLabel.classList.contains('shown')) {
        accNumberLabel.classList.remove('shown');
        accNumberLabel.classList.add('hidden');
    } else {
        accNumberLabel.classList.remove('hidden');
        accNumberLabel.classList.add('shown');
    }
}

