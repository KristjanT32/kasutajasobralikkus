let currentSession = undefined;
let sessionTimer = 0;
let sessionTimerInterval = -1;

const sessionTimerLabel = document.querySelector('.session-timer-label > .time-box');

function initSession() {
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


                showDefinedModal(4, {}, () => { showNotification("Kuhu sa oma arust lähed?", 2, 4000)})
            }
        }, 1000);
    }
}

