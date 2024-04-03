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


