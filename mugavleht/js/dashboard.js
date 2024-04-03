const raha = document.querySelector("#raha_seis");
const kaardi_info = document.querySelector("#kaardi_info")
const greetingText = document.querySelector(".greetingLabel");

let balance_shown = false

greetingText.innerHTML = "Tere tulemast tagasi, <b>" + JSON.parse(loadFromSessionStorage("currentsession")).user + "</b>";

function raha_seis() 
{
    if (!balance_shown) {
      raha.innerHTML = getRandomInteger(9999999);
      balance_shown = true;
    }
}

function hide()
{
    kaardi_info.innerHTML = "Peidetud!";
}



