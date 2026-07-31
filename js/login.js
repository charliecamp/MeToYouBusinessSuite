// ======================================
// Me To You Business Suite
// Login
// ======================================

const APP_PASSWORD = "Maisie.06";

// If already logged in
if (sessionStorage.getItem("loggedIn") === "true") {

    window.location.href = "dashboard.html";

}

// ----------------------
// LOGIN
// ----------------------

function login() {

    const password =
        document.getElementById("password").value.trim();

    if (password === APP_PASSWORD) {

        sessionStorage.setItem(
            "loggedIn",
            "true"
        );

        window.location.href =
            "dashboard.html";

    }

    else {

        alert("Incorrect password.");

        document.getElementById("password").value = "";

        document.getElementById("password").focus();

    }

}

// ----------------------
// SHOW PASSWORD
// ----------------------

function togglePassword() {

    const input =
        document.getElementById("password");

    if (input.type === "password") {

        input.type = "text";

    }

    else {

        input.type = "password";

    }

}

// ----------------------
// ENTER KEY
// ----------------------

document
.getElementById("password")
.addEventListener("keydown", function(e){

    if(e.key === "Enter"){

        login();

    }

});
