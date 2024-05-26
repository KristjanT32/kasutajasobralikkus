const DASHBOARD_PATH = "sbe-ebank/dashboard/";

const admin_acc = {
    name: "admin",
    pass: "admin",
    tier: "max"
}


function login(usr = cached_username, pass = document.querySelector("#psswrd").value) {
    if (usr == admin_acc.name) {
        if (pass == admin_acc.pass) {
            createOrInitSession(admin_acc.name, true);
            window.location = DASHBOARD_PATH;
        }
    }

    if (loadFromSessionStorage("user_" + usr) != undefined) {
        if (pass == loadFromSessionStorage("user_" + usr)) {
            createOrInitSession(usr)
            window.location = DASHBOARD_PATH;
        } else {
            showNotification("Vale parool!", 1, 1000);
        }
    } else {
        showNotification("Sellist kasutajat ei ole, debiil!", 1, 2000);
    }
}