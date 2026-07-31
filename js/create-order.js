// ======================================
// Me To You Designs
// Create Order
// ======================================

"use strict";

// ======================================
// MENU
// ======================================

const menuButton =
document.getElementById("menuButton");

const sideMenu =
document.getElementById("sideMenu");

const overlay =
document.getElementById("overlay");

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
// ORDER DATE
// ======================================

const orderDate =
document.getElementById("orderDate");

if(orderDate){

    orderDate.value =
    new Date().toISOString().split("T")[0];

}

// ======================================
// ORDER NUMBER
// ======================================

const orderNumber =
document.getElementById("orderNumber");

let nextOrderNumber =
Number(localStorage.getItem("nextOrderNumber")) || 1;

if(orderNumber){

    orderNumber.value =
    "MTYD-" +
    String(nextOrderNumber).padStart(4,"0");

}

// ======================================
// STORAGE
// ======================================

let orders =
JSON.parse(
localStorage.getItem("orders")
) || [];

console.log("Create Order Loaded");
// ======================================
// ITEMS ORDERED
// ======================================

const itemsContainer =
document.getElementById("itemsContainer");

const addItemButton =
document.getElementById("addItemButton");

if(addItemButton){

    addItemButton.addEventListener("click",addItem);

}

function addItem(){

    const item = document.createElement("div");

    item.className = "itemCard";

    item.innerHTML = `

<label>

Product / Item

</label>

<input
type="text"
class="itemName"
placeholder="Example: Balloon Stack">

<label>

Description / Theme

</label>

<textarea
class="itemDescription"
placeholder="Colours, theme, wording, special requests..."></textarea>

<label>

Quantity

</label>

<input
type="number"
class="itemQuantity"
value="1"
min="1">

<label>

Unit Price (£)

</label>

<input
type="number"
class="itemPrice"
value="0"
step="0.01">

<label>

Item Total (£)

</label>

<input
type="number"
class="itemTotal"
value="0"
readonly>

<button
type="button"
class="removeItemButton addButton">

🗑 Remove Item

</button>

`;

    itemsContainer.appendChild(item);

    setupItem(item);

}

document
.querySelectorAll(".itemCard")
.forEach(setupItem);

function setupItem(item){

    const quantity =
    item.querySelector(".itemQuantity");

    const price =
    item.querySelector(".itemPrice");

    const total =
    item.querySelector(".itemTotal");

    function calculate(){

        total.value = (

            Number(quantity.value) *

            Number(price.value)

        ).toFixed(2);

        calculateOrderTotal();

    }

    quantity.addEventListener("input",calculate);

    price.addEventListener("input",calculate);

    calculate();

    item
    .querySelector(".removeItemButton")
    .addEventListener("click",()=>{

        if(document.querySelectorAll(".itemCard").length===1){

            alert("At least one item is required.");

            return;

        }

        item.remove();

        calculateOrderTotal();

    });

}

// ======================================
// ORDER TOTAL
// ======================================

function calculateOrderTotal(){

    let total = 0;

    document
    .querySelectorAll(".itemTotal")
    .forEach(item=>{

        total += Number(item.value);

    });

    document.getElementById("orderTotal").value =
    total.toFixed(2);

}
