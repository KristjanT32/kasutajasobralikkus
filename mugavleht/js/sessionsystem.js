let currentSession = undefined;
let sessionTimer = 0;
let sessionTimerInterval = -1;

const sessionTimerLabel = document.querySelector('.session-timer-label > .time-box');
const expirationNotice = document.querySelector(".sessionExpiredBlur");

function initSession() {

    if (JSON.parse(loadFromSessionStorage("currentsession")).user == "admin") { return; }

    if (currentSession == undefined) {
        sessionTimer = getRandomInteger(450)
        sessionTimerInterval = setInterval(() => {
            if (sessionTimer > 0) {
                sessionTimer--;
                sessionTimerLabel.innerText = formatTime(sessionTimer);
            } else {
                sessionTimer = 0;
                clearInterval(sessionTimerInterval);


                const soundSource = new Audio("/mugavleht/assets/audio/alarm.mp3")
                soundSource.volume = .5;
                soundSource.play()

                expirationNotice.style.display = "block";
                closeUpShop()
            }
        }, 1000);
    }
}

function createOrInitSession(username) {
    if (loadFromSessionStorage("currentsession") == undefined) {
        saveToSessionStorage("currentsession", JSON.stringify({ user: username, sessionStart: Date.now() }))
    } else {
        let data = JSON.parse(loadFromSessionStorage("currentsession"));
        data.sessionStart = Date.now();
        saveToSessionStorage("currentsession", JSON.stringify(data));
    }
}