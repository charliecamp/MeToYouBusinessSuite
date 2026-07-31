// ===============================
// Me To You Business Suite
// Login
// ===============================

const PASSWORD = "Maisie.06";

const loginButton =
document.getElementById("loginButton");

const passwordInput =
document.getElementById("password");

const errorMessage =
document.getElementById("errorMessage");

loginButton.addEventListener("click", login);

passwordInput.addEventListener("keypress", function(event){

    if(event.key === "Enter"){

        login();

    }

});

function login(){

    if(passwordInput.value === PASSWORD){

        sessionStorage.setItem(
            "loggedIn",
            "true"
        );

        window.location.href =
        "dashboard.html";

    }

    else{

        errorMessage.style.display =
        "block";

        passwordInput.value = "";

        passwordInput.focus();

    }

}
