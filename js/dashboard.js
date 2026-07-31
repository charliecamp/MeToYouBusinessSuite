// ======================================
// Me To You Business Suite
// Dashboard
// ======================================

// ---------- MENU ----------

const menuButton = document.getElementById("menuButton");
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");

if (menuButton) {

    menuButton.addEventListener("click", () => {

        sideMenu.classList.add("active");
        overlay.classList.add("active");

    });

}

if (overlay) {

    overlay.addEventListener("click", closeMenu);

}

function closeMenu() {

    sideMenu.classList.remove("active");
    overlay.classList.remove("active");

}

// ---------- DATE ----------

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

// ---------- ORDERS ----------

let orders =
JSON.parse(localStorage.getItem("orders")) || [];

updateDashboard();

function updateDashboard(){

    document.getElementById("totalOrders").textContent =
    orders.length;

    const pending =
    orders.filter(order =>
        order.orderProgress !== "Completed"
    );

    document.getElementById("pendingOrders").textContent =
    pending.length;

    calculateDueDates();

    loadNextOrder();

    loadOutstandingPayments();

    calculateRevenue();

}

// ---------- DUE DATES ----------

function calculateDueDates(){

    const today = new Date();

    let week = 0;
    let month = 0;

    orders.forEach(order=>{

        if(!order.dateNeeded) return;

        const due =
        new Date(order.dateNeeded);

        const diff =
        (due - today) /
        (1000*60*60*24);

        if(diff >= 0 && diff <= 7){

            week++;

        }

        if(
            due.getMonth() === today.getMonth() &&
            due.getFullYear() === today.getFullYear()
        ){

            month++;

        }

    });

    document.getElementById("dueWeek").textContent =
    week;

    document.getElementById("dueMonth").textContent =
    month;

}

// ---------- PLACEHOLDERS ----------

function loadNextOrder(){

    // We'll connect this properly
    // after Orders is finished.

}

function loadOutstandingPayments(){

}

function calculateRevenue(){

}

// ---------- DAILY NOTES ----------

let notes =
JSON.parse(localStorage.getItem("dailyNotes")) || [];

const notesList =
document.getElementById("notesList");

const addNoteButton =
document.getElementById("addNoteButton");

loadNotes();

function loadNotes(){

    if(!notesList) return;

    notesList.innerHTML="";

    notes.forEach((note,index)=>{

        notesList.innerHTML +=

        `<li>

        ${note}

        </li>`;

    });

}

if(addNoteButton){

addNoteButton.addEventListener("click",()=>{

    const note =
    prompt("Add today's note");

    if(!note) return;

    notes.push(note);

    localStorage.setItem(
        "dailyNotes",
        JSON.stringify(notes)
    );

    loadNotes();

});

}

// ---------- TODAY'S JOBS ----------

let jobs =
JSON.parse(localStorage.getItem("todayJobs")) || [];

const jobsList =
document.getElementById("jobsList");

const addJobButton =
document.getElementById("addJobButton");

loadJobs();

function loadJobs(){

    if(!jobsList) return;

    jobsList.innerHTML = "";

    jobs.forEach((job,index)=>{

        jobsList.innerHTML += `

<li>

<span>${job}</span>

<div>

<button
class="completeButton"
onclick="completeJob(${index})">

✅

</button>

<button
class="deleteButton"
onclick="deleteJob(${index})">

🗑️

</button>

</div>

</li>

`;

    });

}
function completeJob(index){

    jobs.splice(index,1);

    localStorage.setItem(
        "todayJobs",
        JSON.stringify(jobs)
    );

    loadJobs();

}

function deleteJob(index){

    if(!confirm("Delete this job?")) return;

    jobs.splice(index,1);

    localStorage.setItem(
        "todayJobs",
        JSON.stringify(jobs)
    );

    loadJobs();

}

if(addJobButton){

addJobButton.addEventListener("click",()=>{

    const job =
    prompt("Add today's job");

    if(!job) return;

    jobs.push(job);

    localStorage.setItem(
        "todayJobs",
        JSON.stringify(jobs)
    );

    loadJobs();

});

}

// ---------- LOG OUT ----------

const logoutButton =
document.getElementById("logoutButton");

if(logoutButton){

logoutButton.addEventListener("click",(e)=>{

    e.preventDefault();

    sessionStorage.removeItem("loggedIn");

    window.location.href="index.html";

});

}
// ---------- COLLAPSIBLE CARDS ----------

const toggleButtons = document.querySelectorAll(".toggleButton");

toggleButtons.forEach(button => {

    button.addEventListener("click", () => {

        const card = button.closest(".dashboardCard");

        const content = card.querySelector(".cardContent");

        if(content.style.display === "none"){

            content.style.display = "block";
            button.textContent = "▼";

        }else{

            content.style.display = "none";
            button.textContent = "▲";

        }

    });

});
