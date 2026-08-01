"use strict";

// =====================================
// CREATE ORDER
// =====================================

const orderNumber =
document.getElementById("orderNumber");

const orderDate =
document.getElementById("orderDate");

const addItemButton =
document.getElementById("addItemButton");

const itemsContainer =
document.getElementById("itemsContainer");

const orderTotal =
document.getElementById("orderTotal");

let nextOrderNumber =
Number(
localStorage.getItem("nextOrderNumber")
) || 1;

let payments = [];

let orders =
JSON.parse(
localStorage.getItem("orders")
) || [];

orderNumber.value =
"MTYD-" +
String(nextOrderNumber).padStart(4,"0");

orderDate.value =
new Date()
.toISOString()
.split("T")[0];

console.log("Create Order Ready");

// =====================================
// ITEM FUNCTIONS
// =====================================

document
.querySelectorAll(".itemCard")
.forEach(setupItem);

addItemButton.addEventListener(
"click",
createItem
);

function createItem(){

const firstCard =
document.querySelector(".itemCard");

const newCard =
firstCard.cloneNode(true);

newCard.querySelector(".itemProduct").value = "";
newCard.querySelector(".itemQuantity").value = 1;
newCard.querySelector(".itemPrice").value = "0.00";
newCard.querySelector(".itemTotal").value = "0.00";
newCard.querySelector(".itemSize").value = "";
newCard.querySelector(".itemColour").value = "";
newCard.querySelector(".itemPersonalised").value = "No";
newCard.querySelector(".itemPersonalisation").value = "";

newCard.querySelector(".personalisationBox").style.display = "none";

itemsContainer.appendChild(newCard);

setupItem(newCard);

updateOrderTotal();

}

function setupItem(card){

const qty =
card.querySelector(".itemQuantity");

const price =
card.querySelector(".itemPrice");

const total =
card.querySelector(".itemTotal");

const personalised =
card.querySelector(".itemPersonalised");

const personalisation =
card.querySelector(".personalisationBox");

qty.oninput = updateOrderTotal;
price.oninput = updateOrderTotal;

function togglePersonalisation(){

personalisation.style.display =
personalised.value==="Yes"
? "block"
: "none";

}

personalised.addEventListener(
"change",
togglePersonalisation
);

togglePersonalisation();

card
.querySelector(".removeItemButton")
.onclick = function(){

if(document.querySelectorAll(".itemCard").length===1){

alert("At least one item is required.");

return;

}

card.remove();

updateOrderTotal();

};

}

function updateOrderTotal(){

let grandTotal = 0;

document
.querySelectorAll(".itemCard")
.forEach(card=>{

const qty =
Number(card.querySelector(".itemQuantity").value)||0;

const price =
Number(card.querySelector(".itemPrice").value)||0;

const total =
qty*price;

card.querySelector(".itemTotal").value =
total.toFixed(2);

grandTotal += total;

});

orderTotal.value =
grandTotal.toFixed(2);

}

