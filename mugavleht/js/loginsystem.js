const DASHBOARD_PATH = "/mugavleht/sbe-ebank/dashboard/";

const admin_acc = {
    name: "admin",
    pass: "admin",
    tier: "max"
}



function login() {
	let pass = document.querySelector("#psswrd").value;
	let username = cached_username;

    if (username == admin_acc.name) {
        if (pass == admin_acc.pass) {
            createOrInitSession(admin_acc.name, true);
            window.location = DASHBOARD_PATH;
        }
    }	

	if (loadFromSessionStorage("user_" + username) != undefined) {
		if (pass == loadFromSessionStorage("user_" + username)) {
			createOrInitSession(username)
			window.location = DASHBOARD_PATH;
		} else {
			showNotification("Vale parool!", 1, 1000);
		}
	} else {
		showNotification("Sellist kasutajat ei ole, debiil!", 1, 2000);
	}
}