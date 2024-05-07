const raha = document.querySelector("#raha_seis");
const greetingText = document.querySelector(".greetingLabel");
const kaardi_number = document.querySelector(".kaardi_number");
const aegumiskp = document.querySelector(".aegumiskp");
const kolm_numbrit = document.querySelector(".kolm_numbrit");

const accNumberLabel = document.querySelector(".account_no_toggle .text")

let balanceNumbers = document.querySelector(".balanceNumbers");
let balanceSymbol = document.querySelector(".balanceSymbol");

let balance_shown = false
let kaardi_number_showm, aegumiskp_shown, kolm_numbrit_shown = false

let sessionData = undefined;

// Some shit with the graph animation
let delayed = false;

const currencies = {
  rupee: {
    symbol: "₹",
    exchangeRate: 0.00991,
    exchangeValue: [0.00965, 0.01010, 0.01021, 0.01015, 0.01027, 0.01011, 0.01002, 0.00991],
    name: "INR"
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
  },
  dogecoin:{
    symbol:	"Ð",
    exchangeRate: 0.15,
    exchangeValue: [0.062072,	0.068279, 0.083390, 0.089544, 0.078755, 0.117212, 0.220106, 0.155058],
    name: "DOGECOIN"
  }
}

const transactions = {
  0: {
    from: "Queefus Pquintillion Pringleton",
    to: "D'marcus Big man Kidkledink",
    amount: 2.99
  },
  1: {
    from: "Apple",
    to: "Quandale Bockzadale Bingleton III",
    amount: 1599.23
  },
  2: {
    from: "Quadius Doo-Doo Zoppity Bop-Bop-Bop Dingle II",
    to: "Trump Hotels & Casino Resorts Inc.",
    amount: 0.99
  },
  3: {
    from: "Prisma",
    to: "Wiggleton J. Winkledink II",
    amount: 133.66
  },
  4: {
    from: "Doodoosniff Big man Jefferson",
    to: "Beter",
    amount: 9.85
  },
  5: {
    from: "Garfield Scratchensniff",
    to: "Jon Arbuckle",
    amount: 2333000.21
  },
  6: {
    from: "Bonerbeater A. Dontavious Sr",
    to: "Põltsamaa",
    amount: 6.66
  },
  7: {
    from: "Postimees",
    to: "Doodoosniff Bugglesmith",
    amount: 199.99
  },
  8: {
    from: "Kickletipson Woodleberry",
    to: "Viimsi Kino",
    amount: 7.99
  },
  9: {
    from: "Obama Obama",
    to: "Biden Blast",
    amount: 99.99
  },
}

const ads = {
  0: {
    title: "Joonas Jubehais just logis sisse!",
    text: "Soovid rikkaks saada? Joonasega on see imelihtne!",
    img: "https://media.tenor.com/z3HRQ3FONBAAAAAM/what-the-acutal-fu-are-u-in-my-house.gif"
  },
    1: {
      title: "Oled võitnud UUE Limpa pudeli!",
      text: "Follow ja postita Limpa ruulib veebilehel X, et vastu võtta! ",
      img: "https://www.myinstants.com/media/instants_images/you-are-my-sunshine-lebron-james.jpg"
    },
  }

  /*
const tehingud = {
  0:{
    from:"Mitchel'O Hara"
    text: 
  }
}
*/


init()


function init() {

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
  accNumberLabel.innerText = sessionData.accno == undefined ? sessionData.accno || ("EE" + toString(getRandomInteger(100000000000000000, 999999999999999999, true))) : sessionData.accno;
  refreshView();
  initSession();

  setInterval(() => {
    showAd()
  }, 10000)
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
    size: 12,
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
      responsive: true,
      maintainAspectRation: false,
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
  const shop = document.querySelector(".dozer-area");
  const dozer = document.querySelector(".dozer-img");
  dozer.style.display = "block";
  if (!shop.classList.contains("bank-closed")) {
    shop.classList.add("bank-closed");
  }
}

const adSpace = document.querySelector(".ad-space-wrapper");
function showAd() {
  const html = `<div class="ad-block">
  <div class="ad-align-left">
    <img src="{imgsrc}">
    <div class="ad-info">
      <div class="title">{title}</div>
      <div>
        {text}
      </div>
    </div>
  </div>
</div>`

  let ad = ads[getRandomInteger(0, ads.size - 1)];
  let title = ad.title;
  let text = ad.text;
  let img = ad.img || "https://v.etsystatic.com/video/upload/q_auto/video-0dae7b31-6d81-4d28-a1e2-67e402644d78-1665215752_saicx8.jpg"

  let el = adSpace.insertAdjacentElement('beforeend', html.replace("{title}", title).replace("{text}", text).replace("{imgsrc}", img))
  setTimeout(() => {
   el.remove();
  }, 3050)
}

