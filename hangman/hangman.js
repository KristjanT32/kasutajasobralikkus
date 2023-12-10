// Game specific
let hangman_state = 0;
let guess_streak = 0;
let last_word = "";
let word = "";
let lastDiscoveredLetter = "";
let guessedLetters = [];
let gameLost = false;
let winAnimationLocked = false;
let showLocked = false;

// Notifications
let notificationShowing = false;
let currentNotification = -1;

// HTML Elements
const canvas = document.querySelector(".drawing-canvas").getContext("2d");
const guessButton = document.querySelector(".hangman-guess-button");
const guessField = document.querySelector(".hangman-guess-input");
const wordPreview = document.querySelector(".hangman-word");
const letterSpan = document.querySelector(".letters");
const gameControls = document.querySelector(".game-controls");
const endControls = document.querySelector(".retry-controls");
const retryButton = document.querySelector(".retryButton");

const notification = document.querySelector(".hover-notification");
const notificationIcons = document.querySelectorAll(".notificationIcon");
const notificationTextSpan = document.querySelector(".notificationText");

const triesLeft = document.querySelector(".hangman-guesses-left");
const guessStreak = document.querySelector(".hangman-guess-streak");
const formSubmit = document.querySelector(".hangman-submit");

// Hangman words
const wordlist = [
  "Arvuti",
  "Programmist",
  "JavaScript",
  "Süntaks",
  "Arendusprojekt",
  "Tarkvara",
  "Riistvara",
  "Pahavara",
  "Veebileht",
  "Server",
  "Adminn",
  "Süsteemianalüütik",
  "Kood",
  "Virtuaalmasin",
  "Käsuviip",
  "Operatsioonisüsteem",
  "Tsükkel",
  "Muutuja",
  "Funktsioon",
  "Raamistik",
  "Kompilaator",
  "Märgenduskeel",
  "Skriptimismootor",
  "Vahemälu",
  "Muutmälu",
  "Programm",
  "Automatiseerimine",
  "Infotehnoloogia",
  "Protsessor",
];

// Drawing stuff (shamelessly stolen)
const draw = function ($pathFromx, $pathFromy, $pathTox, $pathToy) {
  canvas.moveTo($pathFromx, $pathFromy);
  canvas.lineTo($pathTox, $pathToy);
  canvas.stroke();
};

const frame1 = function () {
  draw(0, 150, 150, 150);
};

const frame2 = function () {
  draw(10, 0, 10, 600);
};

const frame3 = function () {
  draw(0, 5, 70, 5);
};

const frame4 = function () {
  draw(60, 5, 60, 15);
};

const torso = function () {
  draw(60, 36, 60, 70);
};

const rightArm = function () {
  draw(60, 46, 100, 50);
};

const leftArm = function () {
  draw(60, 46, 20, 50);
};

const rightLeg = function () {
  draw(60, 70, 100, 100);
};

const leftLeg = function () {
  draw(60, 70, 20, 100);
};

const head = function () {
  let context = canvas;
  context.beginPath();
  context.arc(60, 25, 10, 0, Math.PI * 2, true);
  context.stroke();
};

const hangman_states = [
  head,
  torso,
  rightLeg,
  leftLeg,
  rightArm,
  leftArm,
  frame1,
  frame2,
  frame3,
  frame4,
];

guessButton.addEventListener("click", () => {
  guess();
});

retryButton.addEventListener("click", () => {
  initializeGame();
});

document.body.onload = () => {
  initializeGame();
};

formSubmit.addEventListener("submit", (e) => {
  e.preventDefault();
  guess();
});

function initializeGame() {
  hangman_state = 0;
  gameLost = false;
  winAnimationLocked = false;
  lastDiscoveredLetter = "";
  guess_streak = 0;

  canvas.beginPath();
  canvas.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);

  cancelActiveNotifications();

  triesLeft.classList.remove("guessesleft-warning");

  triesLeft.classList.remove("guessesleft-warning");

  word = pickWord();

  guessedLetters = [];
  lastDiscoveredLetter = "";
  letterSpan.innerHTML = "";
  guessField.value = "";

  refreshUI();

  gameControls.style.display = "flex";
  endControls.style.display = "none";
}

function guess() {
  let guess = guessField.value.trim().toLowerCase();

  if (guess == "") {
    showNotification("Tühi väli!", 1);
    return;
  }

  if (checkIfInWord(guess)) {
    if (word.toLowerCase() == guess) {
      lastDiscoveredLetter = "_word";
      winGame();
      return;
    }

    if (!guessedLetters.includes(guess)) {
      guessedLetters.push(guess);
      guess_streak++;
      guessField.value = "";
      lastDiscoveredLetter = guess;
      refreshUI();
      return;
    } else {
      showNotification("Sa oled seda tähte juba arvanud!", 2);
      return;
    }
  } else {
    guessField.value = "";

    if (guess.length == 1) {
      if (!guessedLetters.includes(guess)) {
        guessedLetters.push(guess);
        refreshGuessedLetters();
        advanceState();
        showWrongGuessAnimation();
        lastDiscoveredLetter = guess;
        return;
      }
    } else if (guess.length > 1) {
      advanceState();
      showWrongGuessAnimation();
      showNotification("Paraku pole see sõna '" + guess + "'");
      return;
    }
  }
}

function checkIfInWord(str) {
  if (str.length == 1) {
    return word.toLowerCase().includes(str);
  } else if (str.length > 1) {
    return word.toLowerCase() == str;
  }
}

function advanceState() {
  guess_streak = 0;

  // The last possible index for a draw function is 9, so the last
  // allowed index is 8 (therefore, since length is 10, length - 2)
  if (hangman_state <= hangman_states.length - 2) {
    hangman_states[hangman_state]();
    hangman_state++;
  } else {
    // Still draw the last state, then set the state to the highest possible one.
    hangman_states[hangman_state]();
    hangman_state = hangman_states.length;

    gameLost = true;

    refreshSecondaryInfo();
    loseGame();
    return;
  }

  // Flash the guess counter red when it reaches 6 (meaning the user has only 4 guesses left)
  if (hangman_state >= 6) {
    if (!triesLeft.classList.contains("guessesleft-warning")) {
      triesLeft.classList.add("guessesleft-warning");
    }
  }
}

function refreshWordPreview() {
  wordPreview.innerHTML = "";
  for (const char of word) {
    // Has the user guessed the letter?
    if (guessedLetters.includes(char.toLowerCase())) {
      // Has the letter already been animated?
      if (lastDiscoveredLetter == char.toLowerCase()) {
        let character = char;
        wordPreview.innerHTML +=
          "<span class='letter-popup'>" + character + "</span>";
        setTimeout(
          () => {
            wordPreview.innerHTML = wordPreview.innerHTML.replace(
              '<span class="letter-popup">' + character + "</span>",
              character
            );
            checkWin();
          },
          700,
          character
        );
      } else if (lastDiscoveredLetter == "_word") {
        wordPreview.innerHTML =
          "<span class='letter-popup'>" + word + "</span>";
      } else {
        wordPreview.innerHTML += char;
      }
    } else {
      wordPreview.innerHTML += "_";
    }
    wordPreview.innerHTML = wordPreview.innerHTML.trim();
  }
}

/**
 * Refreshes the list of tried letters.
 */

function refreshGuessedLetters() {
  let counter = 0;
  letterSpan.innerHTML = "";
  guessedLetters.forEach((letter) => {
    if (word.toLowerCase().includes(letter.toLowerCase())) {
      letterSpan.innerHTML +=
        "<span style='color:green' class='guessed_letter_correct'>" +
        letter.toUpperCase() +
        "</span>";
    } else {
      letterSpan.innerHTML +=
        "<span style='color:red' class='guessed_letter_wrong'>" +
        letter.toUpperCase() +
        "</span>";
    }
    if (counter == 13) {
      letterSpan.innerHTML += "<hr>";
    }
    counter++;
  });

  document.querySelectorAll(".guessed_letter_correct").forEach((element) => {
    element.addEventListener("click", () => {
      showLetter(element.innerText);
      console.log("Clicked, '" + element.innerText + "'");
    });
  });
}

let highlightedLetters = [];
function showLetter(letter) {
  if (showLocked || winAnimationLocked) {
    return;
  }
  showLocked = true;
  highlightedLetters = [];

  for (char of wordPreview.innerText) {
    if (char.toLowerCase() == letter.toLowerCase()) {
      if (!highlightedLetters.includes(char)) {
        highlightedLetters.push(char);
      }
    }
  }

  for (char of highlightedLetters) {
    wordPreview.innerHTML = wordPreview.innerHTML.replaceAll(
      char,
      "<span class='highlighted_letter'>" + char + "</span>"
    );

    setTimeout(() => {
      wordPreview.innerHTML = wordPreview.innerHTML.replaceAll(
        '<span class="highlighted_letter">' + char + "</span>",
        char
      );
      highlightedLetters.pop(char);

      if (highlightedLetters.length == 0) {
        showLocked = false;
      }
    }, 300);
  }

  setTimeout(() => {}, 1000);
}

function refreshSecondaryInfo() {
  triesLeft.innerHTML =
    "Eksimusi jäänud <b class='tries-left-number'>" +
    (hangman_states.length - hangman_state) +
    "</b>";
  guessStreak.innerHTML =
    "Õigeid järjest <b class='guess-streak-number'>" + guess_streak + "</b>";
}

function refreshUI() {
  refreshWordPreview();
  refreshGuessedLetters();
  refreshSecondaryInfo();

  wordPreview.classList.remove("guessed-words-glow-red");
  wordPreview.style.color = "black";
}

function guessWord() {
  for (char of word) {
    if (!guessedLetters.includes(char.toLowerCase())) {
      guessedLetters.push(char.toLowerCase());
    }
  }
  refreshWordPreview();
  winGame();
}

function winGame() {
  if (gameLost) {
    return;
  }

  gameControls.style.display = "none";
  endControls.style.display = "flex";

  showNotification("Võit käes!", 3, 4000);
  showWinAnimation();
}

function loseGame() {
  gameControls.style.display = "none";
  endControls.style.display = "flex";

  showNotification("Kurat! Kahjuks kaotasid.", 1, 4000);

  setTimeout(() => {
    wordPreview.innerHTML = "<b>" + word + "</b>";
  }, 1000);
}

function checkWin() {
  if (
    wordPreview.innerHTML
      .replace('<span class="letter-popup">', "")
      .replace("</span>", "") == word
  ) {
    winGame();
  }
}

function showWinAnimation() {
  if (winAnimationLocked) {
    return;
  }
  winAnimationLocked = true;

  wordPreview.innerHTML = "";

  wordPreview.classList.add("guessed-words-glow-green");
  setTimeout(() => {
    wordPreview.classList.remove("guessed-words-glow-green");
  }, 2000);

  let delay = 50;
  for (let character of word) {
    wordPreview.innerHTML +=
      "<span class='letter-win-flash' style='animation-delay: " +
      delay +
      "ms'>" +
      character +
      "</span>";
    delay += 50;
  }
}

function showWrongGuessAnimation() {
  refreshSecondaryInfo();
  wordPreview.classList.add("guessed-words-glow-red");
  wordPreview.style.color = "red";
  setTimeout(() => {
    wordPreview.classList.remove("guessed-words-glow-red");
    wordPreview.style.color = "black";
  }, 1005);
}

/**
 * Show a snackbar notification at the bottom of the page.
 * @param {string} notificationText The text to show in the notification
 * @param {number} type The integer representing the type of the notification, where 1 is error, 2 is warning and 3 is success
 * @param {number} showTime The amount of milliseconds to show the notifications for. Defaults to **2050ms**
 */

function showNotification(notificationText, type, showTime = 2050) {
  if (notificationShowing) {
    clearTimeout(currentNotification);
    notification.classList.remove("notification-show");
    notification.classList.add("notification-hide");
    notificationShowing = false;
    currentNotification = -1;
    return;
  }

  if (type == 1) {
    notification.style.border = "solid 1px rgb(255, 192, 192)";
    notification.style.borderRadius = "10px";
    notification.style.boxShadow = "0 0 3px 1px rgb(255, 86, 86)";
    notification.style.backgroundColor = "rgb(255, 192, 192)";

    notificationIcons.forEach((el) => {
      el.innerHTML = "warning";
    });
  } else if (type == 2) {
    notification.style.border = "solid 1px #fff569";
    notification.style.borderRadius = "10px";
    notification.style.boxShadow = "0 0 3px 1px #e0d75a";
    notification.style.backgroundColor = "#fff569";

    notificationIcons.forEach((el) => {
      el.innerHTML = "info";
    });
  } else if (type == 3) {
    notification.style.border = "solid 1px #76fc68";
    notification.style.borderRadius = "10px";
    notification.style.boxShadow = "0 0 3px 1px #60c955";
    notification.style.backgroundColor = "#76fc68";

    notificationIcons.forEach((el) => {
      el.innerHTML = "check";
    });
  }

  notificationTextSpan.innerHTML = notificationText;
  notification.classList.remove("notification-hide");
  notification.classList.add("notification-show");
  currentNotification = setTimeout(() => {
    notification.classList.remove("notification-show");
    notification.classList.add("notification-hide");
    notificationShowing = false;
    currentNotification = -1;
  }, showTime);
  notificationShowing = true;
}

function cancelActiveNotifications() {
  if (notificationShowing) {
    clearTimeout(currentNotification);
    notification.classList.remove("notification-show");
    notification.classList.add("notification-hide");
    notificationShowing = false;
    currentNotification = -1;
  }
}

function pickWord() {
  const word_id = getRandomInt(0, wordlist.length - 1);

  if (wordlist[word_id] == undefined) {
    showNotification("Viga sõna valimisel, proovin uuesti...", 2);
    pickWord();
  }

  if (last_word == wordlist[word_id]) {
    pickWord();
  } else {
    last_word = wordlist[word_id];
    return wordlist[word_id];
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
