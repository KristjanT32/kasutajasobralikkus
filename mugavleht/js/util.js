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
		return;
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


function getNameFileContents(file) {
	const reader = new FileReader();
	reader.readAsText(file);
	reader.addEventListener('load', (event) => {
		showNotification("Tere tulemast, " + event.target.result + "!", 3, 3000);
	});	
}

/**
 * Returns an integer from 0 - `max`.
 * @param {int} max
 * @returns {int} A random integer from 0 to `max`
 */
function getRandomInteger(max) {
	return Math.ceil(Math.random() * max);
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

// Restricts input for the given textbox to the given inputFilter.
function setInputFilter(textbox, inputFilter, errMsg) {
	["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout"].forEach(function(event) {
	  textbox.addEventListener(event, function(e) {
		if (inputFilter(this.value)) {
		  // Accepted value
		  if (["keydown","mousedown","focusout"].indexOf(e.type) >= 0){
			this.classList.remove("input-error");
			this.setCustomValidity("");
		  }
		  this.oldValue = this.value;
		  this.oldSelectionStart = this.selectionStart;
		  this.oldSelectionEnd = this.selectionEnd;
		} else if (this.hasOwnProperty("oldValue")) {
		  // Rejected value - restore the previous one
		  this.classList.add("input-error");
		  this.setCustomValidity(errMsg);
		  this.reportValidity();
		  this.value = this.oldValue;
		  this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
		} else {
		  // Rejected value - nothing to restore
		  this.value = "";
		}
	  });
	});
  }
  
  
  // Install input filters.
  setInputFilter(document.getElementById("intTextBox"), function(value) {
	return /^-?\d*$/.test(value); }, "Must be an integer");
  setInputFilter(document.getElementById("uintTextBox"), function(value) {
	return /^\d*$/.test(value); }, "Must be an unsigned integer");
  setInputFilter(document.getElementById("intLimitTextBox"), function(value) {
	return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 500); }, "Must be between 0 and 500");
  setInputFilter(document.getElementById("floatTextBox"), function(value) {
	return /^-?\d*[.,]?\d*$/.test(value); }, "Must be a floating (real) number");
  setInputFilter(document.getElementById("currencyTextBox"), function(value) {
	return /^-?\d*[.,]?\d{0,2}$/.test(value); }, "Must be a currency value");
  setInputFilter(document.getElementById("latinTextBox"), function(value) {
	return /^[a-z]*$/i.test(value); }, "Must use alphabetic latin characters");
  setInputFilter(document.getElementById("hexTextBox"), function(value) {
	return /^[0-9a-f]*$/i.test(value); }, "Must use hexadecimal characters");