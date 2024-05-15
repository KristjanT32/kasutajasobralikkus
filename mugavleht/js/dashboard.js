const greetingText = document.querySelector(".greetingLabel");
const transactionList = document.querySelector(".transactionList");

const accNumberLabel = document.querySelector(".account_no_toggle .text")
const adSpace = document.querySelector(".ad-space-wrapper");

// Ad system 
let latestAdIndex = 0;
const AD_INTERVAL_MAX = 30;
const AD_INTERVAL_MIN = 5;

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
  dogecoin: {
    symbol: "Ð",
    exchangeRate: 0.15,
    exchangeValue: [0.062072, 0.068279, 0.083390, 0.089544, 0.078755, 0.117212, 0.220106, 0.155058],
    name: "DOGECOIN"
  }
}

const transactions = {
  0: {
    from: "Queefus Pquintillion Pringleton",
    to: "{user}",
    amount: 2.99
  },
  1: {
    from: "Apple",
    to: "{user}",
    amount: -1599.23
  },
  2: {
    from: "{user}",
    to: "Trump Hotels & Casino Resorts Inc.",
    amount: 0.99
  },
  3: {
    from: "{user}",
    to: "Wiggleton J. Winkledink II",
    amount: -133.66
  },
  4: {
    from: "{user}",
    to: "Beter",
    amount: 9.85
  },
  5: {
    from: "{user}",
    to: "Jon Arbuckle",
    amount: 2333000.21
  },
  6: {
    from: "Bonerbeater A. Dontavious Sr",
    to: "{user}",
    amount: 6.66
  },
  7: {
    from: "{user}",
    to: "Doodoosniff Bugglesmith",
    amount: -199.99
  },
  8: {
    from: "{user}",
    to: "Viimsi Kino",
    amount: -7.99
  },
  9: {
    from: "{user}",
    to: "Biden Blast",
    amount: 99.99
  },
  10: {
    from: "Bodacious Bunger Burger",
    to: "{user}",
    amount: 399.99
  },
  11: {
    from: "{user}",
    to: "Jerma",
    amount: 11.99
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
    text: "Follow ja postita \"Limpa ruulib!\" veebilehel X, et vastu võtta! ",
    img: "https://www.myinstants.com/media/instants_images/you-are-my-sunshine-lebron-james.jpg"
  },
  2: {
    title: "KUUMAD SINGLID sinu piirkonnas!",
    text: "Vajuta NÜÜD ja naudi täiuslikku elu. ",
    img: "https://ih1.redbubble.net/image.4569252647.6787/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg"
  },
  3: {
    title: "419 Nigeeria prints tahab SINU abi!",
    text: "Võida miljoneid ühe klikkiga! ",
    img: "https://characterai.io/i/300/static/avatars/uploaded/2023/2/23/Rjy8Hc5B6Asr7ihZblJTW_M8B62YrO4VN-gN7Z0qw34.webp"
  },
  4: {
    title: "Mark \"Give Me The Zucc\" Zuckerberg KAHEKORDISTAB su RAHA!",
    text: "Sisesta summa tema pangakontole ja saadab tagasi 2x! ",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNtsWOqG5mADWzEVq1DoU4JL-SJjSrsPfXhxv-Cr4fxQ&s"
  },
  5: {
    title: "HOIATUS!! Sinu KONTO on OHU ALL! ",
    text: "DETEKTEERITUD SISSE LOGIMINE! ",
    img: "https://imgb.ifunny.co/images/72db0a39d4b8c6e4dbe29c4626fdda08358f9a6a016382288233c8d637d189f8_1.webp"
  },
  6: {
    title: "DRAKE PÜKSID, Drake kandis neid pükse!! ",
    text: "Riietu nagu ikoon DRAKE! YATTA!  ",
    img: "https://static.planetminecraft.com/files/image/minecraft/texture-pack/2023/334/16664336-draik_xl.webp"
  },
  7: {
    title: "OSTA depressante! Sa TAHAD seda! ",
    text: "Tema on kurb! AGA SISEMUS RÕÕM ",
    img: "https://us-tuna-sounds-images.voicemod.net/30b00242-aec2-419a-87e1-e5ad5575d13c-1664677267599.jpg"
  },
  8: {
    title: "Tasuta SÖÖK! TULE VANGI! ",
    text: "VAATA KUI RÕÕMUS TA ON! ",
    img: "https://i.pinimg.com/474x/c3/39/2e/c3392e497b69c657ac8b3520a7150601.jpg"
  },
  9: {
    title: "Tule \"Peppa Pig 2: Pigistumine ALAGU!\" esilinastusele ",
    text: "NÜÜD 100% rohkem Peppa venda GEORGE PEPPA. ",
    img: "https://static.wikia.nocookie.net/48d4a9c2-5b27-4431-833c-c3007afbe141"
  },
  10: {
    title: "SINU KALLIM on vaid SAMMU kaugusel! ",
    text: "ÜHINE PROGRAMMIGA ja KALLIM satub SU haardesse! ",
    img: "https://images.voicy.network/Content/Clips/Images/feeb0fdd-918f-468d-8afe-404d0bc2997c-small.png"
  },
  11: {
    title: "TELLI KORISTAJA. Teda võib USALDADA! ",
    text: "5-TÄRNI VÄÄRILINE, OHT PUUDUB ",
    img: "https://images.voicy.network/Content/Clips/Images/e2d7ad4a-57a1-4639-a9ea-fb713c9280b2-small.jpg"
  },
  12: {
    title: "REISIKINDLUSTUS! Rahulolu GARANTEERITUD! ",
    text: "SUL on ÕIGUSED ohutuks REISIKS! ",
    img: "https://steamuserimages-a.akamaihd.net/ugc/2009198719972570736/4FBFF8E354CA3F0B693C19BF1CB8C2AA07731939/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true"
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

  engageAdifier();
}

function refreshView() {
  let bal = parseFloat(sessionData.balance).toFixed(2);
  balanceNumbers.innerText = parseFloat(bal).toLocaleString("et");

  let curs = Object.keys(currencies);
  let index = getRandomInteger(0, curs.length - 1);
  let selectedCurrency = currencies[curs[index]];

  balanceSymbol.innerText = selectedCurrency.symbol;

  document.querySelector(".exchangeRateTitle").innerText = "Valuutakurss (" + selectedCurrency.name + ")";

  for (let i = 0; i < len(transactions); i++) {
    let transaction = transactions[i];
    transactionList.insertAdjacentHTML('beforeend', `<div class="generic-transaction">
      <div class="transactionSender">${transaction.from}</div>
      <div class="transactionReceiver">${transaction.to}</div>
      <div class="transactionAmount"><b class="text ${transaction.amount > 0 ? "received" : "sent"}">${transaction.amount > 0 ? "+" + transaction.amount : transaction.amount} ${selectedCurrency.symbol}</b></div>
      </div>`.replaceAll("{user}", sessionData.user)
    )
  }



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

function engageAdifier() {
  let interval = getRandomInteger(AD_INTERVAL_MIN, AD_INTERVAL_MAX);
  console.log(`Adifier engaged. Will show an ad every ${interval}s`)
  setInterval(() => {
    showAd();
  }, interval * 1000)
}

function showAd() {
  const html = `<div class="ad-block ad-appear" adindex={adIdx}>
  <div class="ad-align-left">
    <img src="{imgsrc}" class="profile-pic">
    <div class="ad-info">
      <div class="title">{title}</div>
      <div>
        {text}
      </div>
    </div>
  </div>
</div>`

  let ad = ads[getRandomInteger(0, len(ads) - 1)];
  let title = ad.title;
  let text = ad.text;
  let img = ad.img || "https://v.etsystatic.com/video/upload/q_auto/video-0dae7b31-6d81-4d28-a1e2-67e402644d78-1665215752_saicx8.jpg"
  adSpace.insertAdjacentHTML('beforeend', html.replaceAll("{title}", title).replaceAll("{text}", text).replaceAll("{imgsrc}", img).replaceAll("{adIdx}", latestAdIndex))

  document.querySelectorAll(".ad-block").forEach((el) => {
    if (el.getAttribute('adindex') == latestAdIndex) {
      enqueueAdRemoval(el);
      return;
    }
  })

  latestAdIndex++;
}

function enqueueAdRemoval(el) {
  setTimeout(() => {
    el.classList.remove("ad-appear");
    el.classList.add("ad-disappear");
    setTimeout(() => {
      el.remove();
      latestAdIndex--;
    }, 1005)
  }, 10000)
}

