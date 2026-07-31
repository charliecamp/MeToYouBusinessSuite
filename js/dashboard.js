// ======================================
// Me To You Designs
// Dashboard
// ======================================

"use strict";

// ======================================
// MENU
// ======================================

const menuButton = document.getElementById("menuButton");
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");

function openMenu(){

    sideMenu.classList.add("active");
    overlay.classList.add("active");

}

function closeMenu(){

    sideMenu.classList.remove("active");
    overlay.classList.remove("active");

}

if(menuButton){

    menuButton.addEventListener("click",openMenu);

}

if(overlay){

    overlay.addEventListener("click",closeMenu);

}

// ======================================
// DATE
// ======================================

const todayDate =
document.getElementById("todayDate");

if(todayDate){

    const today = new Date();

    todayDate.textContent =
    today.toLocaleDateString("en-GB",{

        weekday:"long",

        day:"numeric",

        month:"long",

        year:"numeric"

    });

}

// ======================================
// LOG OUT
// ======================================

const logoutButton =
document.getElementById("logoutButton");

if(logoutButton){

    logoutButton.addEventListener("click",(e)=>{

        e.preventDefault();

        sessionStorage.removeItem("loggedIn");

        window.location.href="index.html";

    });

}

// ======================================
// STORAGE
// ======================================

let orders =
JSON.parse(localStorage.getItem("orders")) || [];

let jobs =
JSON.parse(localStorage.getItem("todayJobs")) || [];

let notes =
JSON.parse(localStorage.getItem("notes")) || [];

// ======================================
// PAGE LOAD
// ======================================

document.addEventListener("DOMContentLoaded",()=>{

    console.log("Dashboard Loaded");

});
