
// Game specific
let hangman_state = 0;
let guess_streak = 0;
let last_word = "";
let word = "";
let lastDiscoveredLetter = "";
let guessedLetters = [];
let gameLost = false;
let winAnimationLocked = false;

// HTML Elements
const canvas = document.querySelector(".drawing-canvas").getContext("2d");
const guessButton = document.querySelector(".hangman-guess-button");
const guessField = document.querySelector(".hangman-guess-input");
const wordPreview = document.querySelector(".hangman-word");
const letterSpan = document.querySelector(".letters");
const gameControls = document.querySelector(".game-controls");
const endControls = document.querySelector(".retry-controls");
const retryButton = document.querySelector(".retryButton");
const notification = document.querySelector(".notification");
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
]

// Drawing stuff (shamelessly stolen)
const draw = function ($pathFromx, $pathFromy, $pathTox, $pathToy) {

    canvas.moveTo($pathFromx, $pathFromy);
    canvas.lineTo($pathTox, $pathToy);
    canvas.stroke();
}

const frame1 = function () {
    draw(0, 150, 150, 150);
};

const frame2 = function () {
    draw(10, 0, 10, 600);
}

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

const hangman_states = [rightLeg, leftLeg, rightArm, leftArm, torso, frame4, frame3, frame2, frame1]; 









guessButton.addEventListener('click', () => {
    guess()
});

retryButton.addEventListener('click', () => {
    initializeGame();
});

document.body.onload = () => {
    initializeGame();
}

formSubmit.addEventListener('submit', (e) => {
    guess();
    e.preventDefault();
});




function initializeGame() {
    hangman_state = 0;
    gameLost = false;
    winAnimationLocked = false
    lastDiscoveredLetter = "";
    guess_streak = 0;
    
    canvas.beginPath();
    canvas.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);

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
        showNotification("Tühi väli!")
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
    if (hangman_state + 1 < hangman_states.length - 1) {
        hangman_states[hangman_state]();
        hangman_state++
    } else {
        hangman_state = hangman_states.length - 1;
        refreshSecondaryInfo();
        gameLost = true;
        loseGame();
        return;
    }

    if (hangman_state >= 4) {
        if (!triesLeft.classList.contains("guessesleft-warning")) {
            triesLeft.classList.add("guessesleft-warning")
        }
    }
}

function refreshWordPreview() {
    wordPreview.innerHTML = "";
    for (const char of word) {
        if (guessedLetters.includes(char.toLowerCase())) {
            if (lastDiscoveredLetter == char.toLowerCase()) {
                wordPreview.innerHTML += "<span class='letter-popup'>" + char + "</span>";
            } else if (lastDiscoveredLetter == "_word") {
                wordPreview.innerHTML = "<span class='letter-popup'>" + word + "</span>";
            } else {
                wordPreview.innerHTML += char
            }
        } else {
            wordPreview.innerHTML += "_"
        }
        wordPreview.innerHTML = wordPreview.innerHTML.trim()
    }
}

function clearAnimationMarkup() {
    for (character of guessedLetters) {
        setTimeout(() => {
            console.log("Replacing letter animation for " + "<span class=\"letter-popup\">" + character + "</span>")
            wordPreview.innerHTML = wordPreview.innerHTML.replace("<span class=\"letter-popup\">" + character + "</span>", character).trim();
            wordPreview.innerHTML = wordPreview.innerHTML.replace("<span class=\"letter-popup\">" + character.toUpperCase() + "</span>", character.toUpperCase()).trim();
            checkWin();
        }, 600);   
    }
}

function refreshGuessedLetters() {
    let counter = 0;
    letterSpan.innerHTML = ""
    guessedLetters.forEach((letter) => {
        if (word.toLowerCase().includes(letter.toLowerCase())) {
            letterSpan.innerHTML += "<span style='color:green'>" + letter.toUpperCase() + "</span>"
        } else {
            letterSpan.innerHTML += "<span style='color:red'>" + letter.toUpperCase() + "</span>"
        }
        if (counter == 14) {
            letterSpan.innerHTML += "<hr>";
        }
        counter++;
    });
}

function refreshSecondaryInfo() {
    triesLeft.innerHTML = "Eksimusi jäänud <b class='tries-left-number'>" + (hangman_states.length - hangman_state - 1) + "</b>"
    guessStreak.innerHTML = "Õigeid järjest <b class='guess-streak-number'>" + guess_streak + "</b>"
}

function refreshUI() {

    refreshWordPreview();
    clearAnimationMarkup();
    refreshGuessedLetters();
    refreshSecondaryInfo();

    wordPreview.classList.remove("guessed-words-glow-red")
    wordPreview.style.color = "black";
}

function guessWord() {
    for (char of word) {
        if (!guessedLetters.includes(char.toLowerCase())) {
            guessedLetters.push(char.toLowerCase())
        }   
    }
    refreshWordPreview();
    winGame();
}

function winGame() {
    if (gameLost) { return }
    if (winAnimationLocked) { return }
    gameControls.style.display = "none"
    endControls.style.display = "flex"
    showWinAnimation();
}


function loseGame() {
    gameControls.style.display = "none"
    endControls.style.display = "flex"

    setTimeout(() => {
        wordPreview.innerHTML = "<b>" + word + "</b>";
    }, 1000);
}

function checkWin() {
    if (wordPreview.innerText == word) {
        winGame();
    }
}

function showWinAnimation() {

    if (winAnimationLocked) { return }
    winAnimationLocked = true;

    console.log("Võit!")

    wordPreview.innerHTML = "";

    wordPreview.classList.add("guessed-words-glow-green");
    setTimeout(() => {
        wordPreview.classList.remove("guessed-words-glow-green")
    }, 2000)

    let delay = 50;
    for (let character of word) {
        wordPreview.innerHTML += "<span class='letter-win-flash' style='animation-delay: " + delay + "ms'>" + character + "</span>";
        delay += 50;
    }
}

function showWrongGuessAnimation() {
    refreshSecondaryInfo();
    wordPreview.classList.add("guessed-words-glow-red");
    wordPreview.style.color = "red";
    setTimeout(() => {
        wordPreview.classList.remove("guessed-words-glow-red")
        wordPreview.style.color = "black";
    }, 1005);
}

function showNotification(notificationText) {
    notification.innerHTML = notificationText;
    notification.style.display = "flex";
    notification.classList.add("alert-show-text");
    setTimeout(() => {
        notification.classList.remove("alert-show-text");
        notification.style.display = "none";
    }, 2050);
}

function pickWord() {
    const word_id = getRandomInt(0, wordlist.length - 1);
    if (last_word == wordlist[word_id]) {
        console.log("Duplicate word, repicking...")
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
