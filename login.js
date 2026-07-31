// ======================================
// ME TO YOU BUSINESS SUITE
// LOGIN
// ======================================


// ------------------------------
// SETTINGS
// ------------------------------

const APP_PASSWORD = "MTYD2026";


// ------------------------------
// IF ALREADY LOGGED IN
// ------------------------------

if (localStorage.getItem("loggedIn") === "true") {

    window.location.href = "dashboard.html";

}


// ------------------------------
// ELEMENTS
// ------------------------------

const password =
    document.getElementById("password");

const loginButton =
    document.getElementById("loginButton");

const errorMessage =
    document.getElementById("errorMessage");


// ------------------------------
// LOGIN
// ------------------------------

loginButton.addEventListener("click", login);

password.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {

        login();

    }

});


function login() {

    errorMessage.style.display = "none";

    loginButton.disabled = true;

    loginButton.textContent = "Signing In...";

    setTimeout(function () {

        if (password.value === APP_PASSWORD) {

            localStorage.setItem(
                "loggedIn",
                "true"
            );

            window.location.href =
                "dashboard.html";

        }

        else {

            errorMessage.style.display =
                "block";

            password.value = "";

            password.focus();

            loginButton.disabled = false;

            loginButton.textContent =
                "Sign In";

            document
                .querySelector(".loginCard")
                .animate(

                    [

                        { transform:"translateX(0px)" },

                        { transform:"translateX(-10px)" },

                        { transform:"translateX(10px)" },

                        { transform:"translateX(-10px)" },

                        { transform:"translateX(0px)" }

                    ],

                    {

                        duration:350

                    }

                );

        }

    },600);

}
