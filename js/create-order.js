"use strict";

// ======================================
// CREATE ORDER
// ======================================

let orders = JSON.parse(
localStorage.getItem("orders")
) || [];

let payments = [];

let nextOrderNumber = Number(
localStorage.getItem("nextOrderNumber")
) || 1;

const orderNumber =
document.getElementById("orderNumber");

const orderDate =
document.getElementById("orderDate");

const itemsContainer =
document.getElementById("itemsContainer");

const addItemButton =
document.getElementById("addItemButton");

const saveOrderButton =
document.getElementById("saveOrderButton");

if(orderNumber){

orderNumber.value =
"MTYD-" +
String(nextOrderNumber).padStart(4,"0");

}

if(orderDate){

orderDate.value =
new Date().toISOString().split("T")[0];

}

console.log("Create Order Loaded");

// ======================================
// ITEMS
// ======================================

addItemButton.addEventListener("click", addItem);

function addItem(){

const item =
document.createElement("div");

item.className = "itemCard";

item.innerHTML = `

<label>Product</label>

<input
type="text"
class="itemProduct"
placeholder="Example: Balloon Arch">

<label>Quantity</label>

<input
type="number"
class="itemQuantity"
value="1"
min="1">

<label>Unit Price (£)</label>

<input
type="number"
class="itemPrice"
value="0.00"
step="0.01">

<label>Item Total (£)</label>

<input
type="number"
class="itemTotal"
value="0.00"
readonly>

<label>Size (Optional)</label>

<input
type="text"
class="itemSize">

<label>Colour / Theme</label>

<input
type="text"
class="itemColour">

<label>Personalised?</label>

<select class="itemPersonalised">

<option>No</option>
<option>Yes</option>

</select>

<div class="personalisationBox" style="display:none;">

<label>Personalisation</label>

<textarea
class="itemPersonalisation"></textarea>

</div>

<button
type="button"
class="removeItemButton">

❌ Remove Item

</button>

`;

itemsContainer.appendChild(item);

setupItem(item);

}

document
.querySelectorAll(".itemCard")
.forEach(setupItem);

function setupItem(item){

const qty =
item.querySelector(".itemQuantity");

const price =
item.querySelector(".itemPrice");

const total =
item.querySelector(".itemTotal");

const personalised =
item.querySelector(".itemPersonalised");

const personalisationBox =
item.querySelector(".personalisationBox");

function updateItem(){

const value =
(Number(qty.value)||0) *
(Number(price.value)||0);

total.value =
value.toFixed(2);

updateOrderTotal();

}

qty.addEventListener("input",updateItem);

price.addEventListener("input",updateItem);

personalised.addEventListener("change",()=>{

personalisationBox.style.display =
personalised.value==="Yes"
? "block"
: "none";

});

item
.querySelector(".removeItemButton")
.addEventListener("click",()=>{

if(document.querySelectorAll(".itemCard").length===1){

alert("At least one item is required.");

return;

}

item.remove();

updateOrderTotal();

});

updateItem();

}

function updateOrderTotal(){

let total = 0;

document
.querySelectorAll(".itemTotal")
.forEach(item=>{

total += Number(item.value);

});

document.getElementById("orderTotal").value =
total.toFixed(2);

}

