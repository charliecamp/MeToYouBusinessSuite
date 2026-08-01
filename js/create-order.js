import { db } from "./firebase.js";

import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

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

// ==========================
// DELIVERY OPTIONS
// ==========================

const deliveryMethod = document.getElementById("deliveryMethod");
const addressSection = document.getElementById("addressSection");
const trackingLabel = document.getElementById("trackingLabel");
const trackingNumber = document.getElementById("trackingNumber");

function updateDeliveryFields() {

    const method = deliveryMethod.value;

    if (method === "Collection") {

        addressSection.style.display = "none";
        trackingLabel.style.display = "none";
        trackingNumber.style.display = "none";

    }

    else if (method === "Local Delivery") {

        addressSection.style.display = "block";
        trackingLabel.style.display = "none";
        trackingNumber.style.display = "none";

    }

    else {

        addressSection.style.display = "block";
        trackingLabel.style.display = "block";
        trackingNumber.style.display = "block";

    }

}

deliveryMethod.addEventListener("change", updateDeliveryFields);

updateDeliveryFields();

// ===========================
// PAYMENT FORM TOGGLE
// ===========================

const addPaymentButton =
document.getElementById("addPaymentButton");

const paymentForm =
document.getElementById("paymentForm");

if(addPaymentButton){

addPaymentButton.addEventListener("click",function(){

if(paymentForm.style.display==="none"){

paymentForm.style.display="block";
addPaymentButton.style.display="none";

}

});

}

// =====================================
// SAVE ORDER
// =====================================

const saveOrderButton =
document.getElementById("saveOrderButton");

saveOrderButton.addEventListener("click", saveOrder);

async function saveOrder() {

    const order = {

        orderNumber: document.getElementById("orderNumber").value,

        customerName: document.getElementById("customerName").value,

        customerContact: document.getElementById("customerContact").value,

        orderSource: document.getElementById("orderSource").value,

        socialUsername: document.getElementById("socialUsername").value,

        orderDate: document.getElementById("orderDate").value,

        dateNeeded: document.getElementById("dateNeeded").value,

        orderNotes: document.getElementById("orderNotes").value,

        orderTotal: Number(document.getElementById("orderTotal").value),

        paymentStatus: document.getElementById("paymentStatus").value,

        totalPaid: Number(document.getElementById("totalPaid").value),

        remainingBalance: Number(document.getElementById("remainingBalance").value),

        deliveryMethod: document.getElementById("deliveryMethod").value,

        address1: document.getElementById("address1").value,

        address2: document.getElementById("address2").value,

        town: document.getElementById("town").value,

        county: document.getElementById("county").value,

        postcode: document.getElementById("postcode").value,

        orderStatus: document.getElementById("orderStatus").value,

        items: [],

        payments: payments

        document
    .querySelectorAll(".itemCard")
    .forEach(card=>{

        order.items.push({

            product:
            card.querySelector(".itemProduct").value,

            quantity:
            Number(
                card.querySelector(".itemQuantity").value
            ),

            unitPrice:
            Number(
                card.querySelector(".itemPrice").value
            ),

            itemTotal:
            Number(
                card.querySelector(".itemTotal").value
            ),

            size:
            card.querySelector(".itemSize").value,

            colour:
            card.querySelector(".itemColour").value,

            personalised:
            card.querySelector(".itemPersonalised").value,

            personalisation:
            card.querySelector(".itemPersonalisation").value

        });

    });

    console.log(order);
        try {

        await addDoc(
            collection(db, "orders"),
            order
        );

        alert("✅ Order saved successfully!");

        window.location.href = "orders.html";

    }

    catch (error) {

        console.error(error);

        alert("❌ Error saving order.");

    }

}
