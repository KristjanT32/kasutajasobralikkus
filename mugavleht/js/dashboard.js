const raha = document.querySelector("#raha_seis");
const greetingText = document.querySelector(".greetingLabel");
const kaardi_number = document.querySelector(".kaardi_number");
const aegumiskp = document.querySelector(".aegumiskp");
const kolm_numbrit = document.querySelector(".kolm_numbrit");

let balanceNumbers = document.querySelector(".balanceNumbers");
let balanceSymbol = document.querySelector(".balanceSymbol");

let balance_shown = false
let kaardi_number_showm, aegumiskp_shown, kolm_numbrit_shown = false

let sessionData = undefined;

let delayed

const currencies = {
  rupee: {
    symbol: "₹",
    exchangeRate: 0.00991,
    exchangeValue: [0.00965, 0.01010, 0.01021, 0.01015, 0.01027, 0.01011, 0.01002, 0.00991],
    name: "RUB"
  },
  dong: {
    symbol: "đ",
    exchangeRate: 0.0000369,
    exchangeValue: [0.000039, 0.0000385, 0.0000379, 0.0000379, 0.0000379, 0.0000376, 0.0000374, 0.0000369],
    name: "VND"
  },
  israel_shekel: {
    symbol: "₪",
    exchangeRate: 0.2486,
    exchangeValue: [0.2480, 0.2337, 0.2462, 0.2509, 0.2532, 0.2587, 0.2505, 0.2486],
    name: "ILS"
  },
  spesmilo: {
    symbol: "₷",
    exchangeRate: 14.84,
    exchangeValue: [14.84, 14.84, 14.84, 14.84, 14.84, 14.84, 14.84, 14.84],
    name: "Spesmilo"
  },
  saudi_arabia_riyal: {
    symbol: "﷼",
    exchangeRate: 0.2456,
    exchangeValue: [0.2522, 0.2519, 0.2448, 0.2416, 0.2464, 0.2467, 0.2468, 0.2456],
    name: "SAR"
  },
  poland_zloty: {
    symbol: "zł",
    exchangeRate: 0.2342,
    exchangeValue: [0.2159, 0.2243, 0.2294, 0.2299, 0.2308, 0.2315, 0.2328, 0.2342],
    name: "PLN"
  }
}

init()


function init() {
  log("Initializing session...")

  // Get current session
  sessionData = JSON.parse(loadFromSessionStorage("currentsession") || {});
  if (Object.keys(sessionData).length == 0) {
    showNotification("Teie sessioon ei kehti. Palun logige uuesti sisse.", 1, 10000);
    closeUpShop();
    return;
  }

  if (sessionData.balance == undefined) {
    sessionData.balance = getRandomInteger(0, 32000, false);
    saveToSessionStorage("currentsession", JSON.stringify(sessionData));
  }

  greetingText.innerHTML = "Tere tulemast tagasi, <b>" + sessionData.user + "</b>";
  refreshView()


}

function refreshView() {
  let bal = parseFloat(sessionData.balance).toFixed(2);
  balanceNumbers.innerText = parseFloat(bal).toLocaleString("et");

  let curs = Object.keys(currencies);
  let index = getRandomInteger(0, curs.length - 1);
  let selectedCurrency = currencies[curs[index]];
  
  balanceSymbol.innerText = selectedCurrency.symbol;

  document.querySelector(".exchangeRateTitle").innerText = "Valuutakurss (" + selectedCurrency.name + ")";

  drawExchangeRateGraph(selectedCurrency.exchangeValue)
}

function drawExchangeRateGraph(values) {
  const months = [9 + "/" + 23, 10 + "/" + 23, 11 + "/" + 23, 12 + "/" + 23, 1 + "/" + 24, 2 + "/" + 24, 3 + "/" + 24, 4 + "/" + 24];

  Chart.defaults.set('font', {
    family: 'SEB Regular',
    size: 12, // Example: setting a default size
    // Include other global font properties as needed
  });

  let chart = new Chart("exchangeRate", {
    type: "line",
    data: {
      labels: months,
      datasets: [{
        fill: true,
        lineTension: 0,
        backgroundColor: "rgba(69, 180, 0, .2)",
        borderColor: "#45b400",
        data: values
      }]
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      
      animation: {
        onComplete: () => {
          delayed = true;
        },
        delay: (context) => {
          let delay = 0;
          if (context.type === 'data' && context.mode === 'default' && !delayed) {
            delay = context.dataIndex * 300 + context.datasetIndex * 100;
          }
          return delay;
        },
      },
      scales: {
        y: {
          min: Math.min(...values),
          max: Math.max(...values),
        },
      }
    }
  });
}

function raha_seis() {
  if (!balance_shown) {
    raha.innerHTML = getRandomInteger(9999999) + "€";
    balance_shown = true;
  }
}

function hide_kaardi_number() {
  if (!kaardi_number_showm) {
    kaardi_number.innerHTML = "Peidetud!";
    kaardi_number_showm = true;
    setTimeout(() => {
      kaardi_number.innerHTML = "Kaardi number: 1154 5895 5845 9975";
      kaardi_number_showm = false;
    }, 5 * 1000);
  }
}

function hide_aegumiskp() {
  if (!aegumiskp_shown) {
    aegumiskp.innerHTML = "Peidetud!";
    aegumiskp_shown = true;
    setTimeout(() => {
      aegumiskp.innerHTML = "Aegumiskuupäev: 12.08.2007";
      aegumiskp_shown = false;
    }, 5 * 1000)
  }
}

function hide_kolm_numbrit() {
  if (!kolm_numbrit_shown) {
    kolm_numbrit.innerHTML = "Peidetud!";
    kolm_numbrit_shown = true;
    setTimeout(() => {
      kolm_numbrit.innerHTML = "Kolm numbrit: 167";
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

function closeUpShop() {
  const shop = document.querySelector(".bank-content");
  const dozer = document.querySelector(".dozer-img");
  dozer.style.display = "block";
  if (!shop.classList.contains("bank-closed")) {
    shop.classList.add("bank-closed");
  }
}

