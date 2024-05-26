let notificationShowing = false;
let currentNotification = -1;

const notification = document.querySelector(".hover-notification");
const notificationIcons = document.querySelectorAll(".notificationIcon");
const notificationTextSpan = document.querySelector(".notificationText");

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
    }

    switch (type) {
        case 1:
            notification.style.border = "solid 1px rgb(255, 192, 192)";
            notification.style.borderRadius = "10px";
            notification.style.boxShadow = "0 0 3px 1px rgb(255, 86, 86)";
            notification.style.backgroundColor = "rgb(255, 192, 192)";

            notificationIcons.forEach((el) => {
                el.innerHTML = "warning";
            });
            break;
        case 2:
            notification.style.border = "solid 1px #fff569";
            notification.style.borderRadius = "10px";
            notification.style.boxShadow = "0 0 3px 1px #e0d75a";
            notification.style.backgroundColor = "#fff569";

            notificationIcons.forEach((el) => {
                el.innerHTML = "info";
            });
            break;
        case 3:
            notification.style.border = "solid 1px #76fc68";
            notification.style.borderRadius = "10px";
            notification.style.boxShadow = "0 0 3px 1px #60c955";
            notification.style.backgroundColor = "#76fc68";

            notificationIcons.forEach((el) => {
                el.innerHTML = "check";
            });
            break;
        default:
            console.log("Unknown notification type: " + type);
            break;
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


async function getNameFileContents(file, firstNCharacters) {
    showNotification("Loeme nimefaili...", 2, 3000);
    const text = await file.text();
    cached_username = text.substring(0, firstNCharacters)
    return cached_username;
}

/**
 * Returns an integer from `min` - `max`.
 * @param {float} min - the minimum value; defaults to **0**
 * @param {float} max - the maximum value; defaults to **100**
 * @returns {int} A random integer from `min` to `max`
 */
function getRandomInteger(min = 0, max = 100, whole = true) {
    if (whole) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
        return (Math.random() * (max - min + 1)) + min;
    }
}

/**
 * Returns the length of the list/object `obj`
 * @param {any} obj - the object whose length to return
 * @returns {number} - size of `obj`
 */
function len(obj) {
    if (obj instanceof Object) {
        return Object.keys(obj).length;
    } else if (obj instanceof Array) {
        return obj.length;
    }

}


/**
 * Formats a duration in seconds to `MM:SS` (`e.g 125s => 02:05`)
 * @param {int} seconds The duration to format, in seconds.
 * @returns {string} The formatted duration string.
 */
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds - minutes * 60);
    return (
        (minutes <= 9 ? "0" + minutes : minutes) +
        ":" +
        (secs <= 9 ? "0" + secs : secs)
    );
}


function formatCreditCardNumber(s) {
    return s
        .replace(/[^0-9]/gi, '')
        .replace(/(.{4})/g, '$1 ').trim();
}

function formatFunds(funds) {
    return parseFloat(funds).toLocaleString("et");
}

/**
 * Logs the provided string to the console.
 * This function automatically determines, whether the logged message is an error or not based on the content.
 * @param {string} str The message to log.
 */
function log(str) {
    let errorWords = [
        "error",
        "failed",
        "couldn't",
        "could not",
        "err",
        "failure",
        "not found",
        "invalid",
    ];
    if (
        str
            .toLowerCase()
            .split(" ")
            .filter((word) => errorWords.includes(word)).length > 0
    ) {
        console.error("[ERROR]: " + str);
    } else {
        console.info("[INFO]: " + str);
    }
}

/**
 * Saves `val` under `key` to the session storage.
 * @param {string} key the key to save the value with
 * @param {object} val the value to be saved
 */
function saveToSessionStorage(key, val) {
    sessionStorage.setItem(key, val);
}

function loadFromSessionStorage(key) {
    return sessionStorage.getItem(key) || undefined;
}

function registerUser(name, password) {
    let existingUserPassword = loadFromSessionStorage("user_" + name);
    if (existingUserPassword == undefined) {
        saveToSessionStorage("user_" + name, password);
        showNotification("Kasutaja registreeritud!", 3, 2000);
    } else {
        showNotification("Sellise nimega kasutaja on juba registreeritud. Teie parool on: " + existingUserPassword, 2);
    }
}

