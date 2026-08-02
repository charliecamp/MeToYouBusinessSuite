import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

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

let orders = [];

let jobs =
JSON.parse(localStorage.getItem("todayJobs")) || [];

let notes =
JSON.parse(localStorage.getItem("notes")) || [];

// ======================================
// PAGE LOAD
// ======================================

document.addEventListener("DOMContentLoaded", async ()=>{

    console.log("Dashboard Loaded");

    await loadOrders();

});

// ======================================
// LOAD ORDERS FROM FIRESTORE
// ======================================

async function loadOrders(){

    const snapshot =
    await getDocs(
        collection(db,"orders")
    );

    orders = [];

    snapshot.forEach(doc=>{

        orders.push({

            id: doc.id,

            ...doc.data()

        });

    });

    updateDashboard();

}


// ======================================
// TODAY'S JOBS
// ======================================

const jobsList =
document.getElementById("jobsList");

const addJobButton =
document.getElementById("addJobButton");

if(addJobButton){

    addJobButton.addEventListener("click",addJob);

}

loadJobs();

function addJob(){

    const job =
    prompt("Add today's job");

    if(!job) return;

    jobs.push(job);

    saveJobs();

}

function saveJobs(){

    localStorage.setItem(
        "todayJobs",
        JSON.stringify(jobs)
    );

    loadJobs();

}

function loadJobs(){

    if(!jobsList) return;

    jobsList.innerHTML = "";

    jobs.forEach((job,index)=>{

        const li =
        document.createElement("li");

        li.innerHTML = `

<span>${job}</span>

<div>

<button
class="completeButton">

✅

</button>

<button
class="deleteButton">

🗑️

</button>

</div>

`;

        li.querySelector(".completeButton")
        .addEventListener("click",()=>{

            completeJob(index);

        });

        li.querySelector(".deleteButton")
        .addEventListener("click",()=>{

            deleteJob(index);

        });

        jobsList.appendChild(li);

    });

}

function completeJob(index){

    jobs.splice(index,1);

    saveJobs();

}

function deleteJob(index){

    if(!confirm("Delete this job?")) return;

    jobs.splice(index,1);

    saveJobs();

}

// ======================================
// NOTES
// ======================================

const notesList =
document.getElementById("notesList");

const addNoteButton =
document.getElementById("addNoteButton");

if(addNoteButton){

    addNoteButton.addEventListener("click",addNote);

}

loadNotes();

function addNote(){

    const note =
    prompt("Add note");

    if(!note) return;

    notes.push(note);

    saveNotes();

}

function saveNotes(){

    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );

    loadNotes();

}

function loadNotes(){

    if(!notesList) return;

    notesList.innerHTML = "";

    notes.forEach((note,index)=>{

        const li =
        document.createElement("li");

        li.innerHTML = `

<span>${note}</span>

<div>

<button
class="editButton">

✏️

</button>

<button
class="deleteButton">

🗑️

</button>

</div>

`;

        li.querySelector(".editButton")
        .addEventListener("click",()=>{

            editNote(index);

        });

        li.querySelector(".deleteButton")
        .addEventListener("click",()=>{

            deleteNote(index);

        });

        notesList.appendChild(li);

    });

}

function editNote(index){

    const updated =
    prompt("Edit note",notes[index]);

    if(updated===null) return;

    if(updated.trim()===""){

        deleteNote(index);

        return;

    }

    notes[index]=updated;

    saveNotes();

}

function deleteNote(index){

    if(!confirm("Delete this note?")) return;

    notes.splice(index,1);

    saveNotes();

}

// ======================================
// COLLAPSIBLE CARDS
// ======================================

const toggleButtons =
document.querySelectorAll(".toggleButton");

toggleButtons.forEach((button,index)=>{

    const card =
    button.closest(".dashboardCard");

    const content =
    card.querySelector(".cardContent");

    const storageKey =
    "card_" + index;

    const savedState =
    localStorage.getItem(storageKey);

    if(savedState==="open"){

        content.style.display="block";

        button.textContent="▼";

    }else{

        content.style.display="none";

        button.textContent="▶";

    }

    button.addEventListener("click",()=>{

        if(content.style.display==="none"){

            content.style.display="block";

            button.textContent="▼";

            localStorage.setItem(storageKey,"open");

        }else{

            content.style.display="none";

            button.textContent="▶";

            localStorage.setItem(storageKey,"closed");

        }

    });

});

// ======================================
// DASHBOARD STATISTICS
// ======================================

updateDashboard();

function updateDashboard(){

    updateStats();

    calculateDueDates();

    loadNextOrder();

    loadOutstandingPayments();

    calculateRevenue();

}

// ======================================
// TOTAL ORDERS / PENDING
// ======================================

function updateStats(){

    document.getElementById("totalOrders").textContent =
    orders.length;

    const pending =
    orders.filter(order=>

        order.orderStatus !== "Completed"

    );

    document.getElementById("pendingOrders").textContent =
    pending.length;

}

// ======================================
// DUE DATES
// ======================================

unction calculateDueDates(){

    const today =
    new Date();

    let week = 0;
    let month = 0;

    orders.forEach(order=>{

        if(!order.dateNeeded) return;

        const due =
        new Date(order.dateNeeded);

        const diff =
        (due-today)/(1000*60*60*24);

        if(diff>=0 && diff<=7){

            week++;

        }

        if(

            due.getMonth()===today.getMonth()

            &&

            due.getFullYear()===today.getFullYear()

        ){

            month++;

        }

    });

    document.getElementById("dueWeek").textContent =
    week;

    document.getElementById("dueMonth").textContent =
    month;

}

// ======================================
// PLACEHOLDERS
// ======================================

function loadNextOrder(){

    const card =
    document.getElementById("nextOrderCard");

    if(card){

        card.innerHTML =

        "<p>No upcoming orders.</p>";

    }

}

function loadOutstandingPayments(){

    const paymentList =
    document.getElementById("paymentList");

    if(paymentList){

        paymentList.innerHTML =

        "<p>No outstanding payments.</p>";

    }

}

function calculateRevenue(){

    document.getElementById("todayRevenue").textContent="£0.00";

    document.getElementById("weekRevenue").textContent="£0.00";

    document.getElementById("monthRevenue").textContent="£0.00";

    document.getElementById("totalRevenue").textContent="£0.00";

}

// ---------- QUICK ACTIONS ----------

const createOrderButton =
document.getElementById("createOrderButton");

if(createOrderButton){

    createOrderButton.addEventListener("click",()=>{

        window.location.href="create-order.html";

    });

}

const viewOrdersButton =
document.getElementById("viewOrdersButton");

if(viewOrdersButton){

    viewOrdersButton.addEventListener("click",()=>{

        window.location.href="orders.html";

    });

}
