let currentSession = undefined;
let sessionTimer = 0;
let sessionTimerInterval = -1;


const MIN_SESSION_LENGTH = 10;
const MAX_SESSION_LENGTH = 120;

const sessionTimerLabel = document.querySelector('.session-timer-label > .time-box');
const expirationNotice = document.querySelector(".sessionExpiredBlur");

function initSession() {

    if (JSON.parse(loadFromSessionStorage("currentsession")).nosess) { return; }

    if (currentSession == undefined) {
        sessionTimer = getRandomInteger(MIN_SESSION_LENGTH, MAX_SESSION_LENGTH)
        sessionTimerInterval = setInterval(() => {
            if (sessionTimer > 0) {
                sessionTimer--;
                sessionTimerLabel.innerHTML = formatTime(sessionTimer);
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

function sessionExists() {
    return loadFromSessionStorage("currentsession") == undefined;
}

function createOrInitSession(username, isAdmin = false) {
    let session;
    if (!sessionExists()) {
        session = { user: username, sessionStart: Date.now(), nosess: false };
        if (!isAdmin) {
            saveToSessionStorage("currentsession", JSON.stringify(session))
        } else {
            saveToSessionStorage("currentsession", JSON.stringify({ user: username, sessionStart: Date.now(), balance: 69420, accno: "EE133769420666777360", nosess: true }))
        }
    } else {
        if (isAdmin) {
            saveToSessionStorage("currentsession", JSON.stringify({ user: username, sessionStart: Date.now(), balance: 69420, accno: "EE133769420666777360", nosess: true }))
        }
    }
}