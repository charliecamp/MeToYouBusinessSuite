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

const todayDate = document.getElementById("todayDate");

if (todayDate) {

    const today = new Date();

    todayDate.textContent = today.toLocaleDateString("en-GB", {

        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"

    });

}

// ---------- ORDERS ----------

let orders =
JSON.parse(localStorage.getItem("orders")) || [];

updateDashboard();

function updateDashboard() {

    updateStats();

    calculateDueDates();

    loadNextOrder();

    loadOutstandingPayments();

    calculateRevenue();

}

// ---------- STATS ----------

function updateStats() {

    const totalOrders =
    document.getElementById("totalOrders");

    const pendingOrders =
    document.getElementById("pendingOrders");

    if (totalOrders) {

        totalOrders.textContent = orders.length;

    }

    if (pendingOrders) {

        const pending =
        orders.filter(order =>
            order.orderProgress !== "Completed"
        );

        pendingOrders.textContent = pending.length;

    }

}

// ---------- DUE DATES ----------

function calculateDueDates() {

    const today = new Date();

    let week = 0;
    let month = 0;

    orders.forEach(order => {

        if (!order.dateNeeded) return;

        const due =
        new Date(order.dateNeeded);

        const diff =
        (due - today) / (1000 * 60 * 60 * 24);

        if (diff >= 0 && diff <= 7) {

            week++;

        }

        if (
            due.getMonth() === today.getMonth() &&
            due.getFullYear() === today.getFullYear()
        ) {

            month++;

        }

    });

    document.getElementById("dueWeek").textContent = week;
    document.getElementById("dueMonth").textContent = month;

}

// ---------- PLACEHOLDERS ----------

function loadNextOrder() {

}

function loadOutstandingPayments() {

}

function calculateRevenue() {

}
// ======================================
// TODAY'S JOBS
// ======================================

let jobs =
JSON.parse(localStorage.getItem("todayJobs")) || [];

const jobsList =
document.getElementById("jobsList");

const addJobButton =
document.getElementById("addJobButton");

if(addJobButton){

    addJobButton.addEventListener("click", addJob);

}

loadJobs();

function addJob(){

    const job = prompt("Add today's job");

    if(!job) return;

    jobs.push(job);

    saveJobs();

}

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

    saveJobs();

}

function deleteJob(index){

    if(!confirm("Delete this job?")) return;

    jobs.splice(index,1);

    saveJobs();

}

function saveJobs(){

    localStorage.setItem(
        "todayJobs",
        JSON.stringify(jobs)
    );

    loadJobs();

}
// ======================================
// NOTES
// ======================================

let notes =
JSON.parse(localStorage.getItem("notes")) || [];

const notesList =
document.getElementById("notesList");

const addNoteButton =
document.getElementById("addNoteButton");

if(addNoteButton){

    addNoteButton.addEventListener("click", addNote);

}

loadNotes();

function addNote(){

    const note = prompt("Add note");

    if(!note) return;

    notes.push(note);

    saveNotes();

}

function loadNotes(){

    if(!notesList) return;

    notesList.innerHTML = "";

    notes.forEach((note,index)=>{

        notesList.innerHTML += `

<li>

<span>${note}</span>

<div>

<button
class="editButton"
onclick="editNote(${index})">

✏️

</button>

<button
class="deleteButton"
onclick="deleteNote(${index})">

🗑️

</button>

</div>

</li>

`;

    });

}

function editNote(index){

    const updated =
    prompt("Edit note", notes[index]);

    if(updated === null) return;

    if(updated.trim() === ""){

        deleteNote(index);

        return;

    }

    notes[index] = updated;

    saveNotes();

}

function deleteNote(index){

    if(!confirm("Delete this note?")) return;

    notes.splice(index,1);

    saveNotes();

}

function saveNotes(){

    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );

    loadNotes();

}
// ======================================
// NEXT ORDER
// ======================================

function loadNextOrder(){

    const card =
    document.getElementById("nextOrderCard");

    if(!card) return;

    if(orders.length===0){

        card.innerHTML =
        "<p>No upcoming orders.</p>";

        return;

    }

    const sorted =
    [...orders].sort((a,b)=>

        new Date(a.dateNeeded) -
        new Date(b.dateNeeded)

    );

    const next = sorted[0];

    card.innerHTML = `

<h3>${next.customerName || "Customer"}</h3>

<p><strong>Due:</strong> ${next.dateNeeded || "-"}</p>

<p><strong>Occasion:</strong> ${next.occasion || "-"}</p>

`;

}

// ======================================
// OUTSTANDING PAYMENTS
// ======================================

function loadOutstandingPayments(){

    const paymentList =
    document.getElementById("paymentList");

    if(!paymentList) return;

    const unpaid =
    orders.filter(order=>

        order.balance > 0

    );

    if(unpaid.length===0){

        paymentList.innerHTML =
        "<p>No outstanding payments.</p>";

        return;

    }

    paymentList.innerHTML="";

    unpaid.forEach(order=>{

        paymentList.innerHTML += `

<p>

${order.customerName}

<br>

<strong>£${Number(order.balance).toFixed(2)}</strong>

</p>

`;

    });

}

// ======================================
// REVENUE
// ======================================

function calculateRevenue(){

    let total = 0;

    orders.forEach(order=>{

        total +=
        Number(order.totalPrice || 0);

    });

    const totalRevenue =
    document.getElementById("totalRevenue");

    if(totalRevenue){

        totalRevenue.textContent =
        "£" + total.toFixed(2);

    }

}

// ======================================
// COLLAPSIBLE CARDS
// ======================================

document.querySelectorAll(".dashboardCard").forEach(card=>{

    const button =
    card.querySelector(".toggleButton");

    const content =
    card.querySelector(".cardContent");

    if(!button || !content) return;

    content.style.display="none";
    button.textContent="▶";

    button.addEventListener("click",()=>{

        if(content.style.display==="none"){

            content.style.display="block";
            button.textContent="▼";

        }else{

            content.style.display="none";
            button.textContent="▶";

        }

    });

});

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
