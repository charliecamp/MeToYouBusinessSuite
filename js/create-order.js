import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

"use strict";

// =====================================
// CREATE ORDER
// Me To You Business Suite
// =====================================

// ---------- PAGE ELEMENTS ----------

const orderNumber = document.getElementById("orderNumber");
const orderDate = document.getElementById("orderDate");
const dateNeeded = document.getElementById("dateNeeded");

const customerName = document.getElementById("customerName");
const customerContact = document.getElementById("customerContact");
const orderSource = document.getElementById("orderSource");
const socialUsername = document.getElementById("socialUsername");

const orderNotes = document.getElementById("orderNotes");

const orderTotal = document.getElementById("orderTotal");
const paymentStatus = document.getElementById("paymentStatus");
const totalPaid = document.getElementById("totalPaid");
const remainingBalance = document.getElementById("remainingBalance");

const deliveryMethod = document.getElementById("deliveryMethod");

const address1 = document.getElementById("address1");
const address2 = document.getElementById("address2");
const town = document.getElementById("town");
const county = document.getElementById("county");
const postcode = document.getElementById("postcode");

const orderStatus = document.getElementById("orderStatus");

const addItemButton = document.getElementById("addItemButton");
const itemsContainer = document.getElementById("itemsContainer");

const saveOrderButton = document.getElementById("saveOrderButton");

const addPaymentButton = document.getElementById("addPaymentButton");
const paymentForm = document.getElementById("paymentForm");

// ---------- VARIABLES ----------

let payments = [];

let nextOrderNumber =
Number(localStorage.getItem("nextOrderNumber")) || 1;

// ---------- INITIALISE ----------

function initialisePage(){

    orderNumber.value =
    "MTYD-" +
    String(nextOrderNumber).padStart(4,"0");

    orderDate.value =
    new Date()
    .toISOString()
    .split("T")[0];

    paymentStatus.value = "Not Paid";

    totalPaid.value = "0.00";

    remainingBalance.value = "0.00";

}

initialisePage();

// =====================================
// ITEMS
// =====================================

document
.querySelectorAll(".itemCard")
.forEach(setupItem);

addItemButton.addEventListener(
"click",
addNewItem
);

function addNewItem(){

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

    calculateTotal();

}

function setupItem(card){

    const qty =
    card.querySelector(".itemQuantity");

    const price =
    card.querySelector(".itemPrice");

    const personalised =
    card.querySelector(".itemPersonalised");

    const personalisationBox =
    card.querySelector(".personalisationBox");

    qty.addEventListener(
        "input",
        calculateTotal
    );

    price.addEventListener(
        "input",
        calculateTotal
    );

    personalised.addEventListener(
        "change",
        function(){

            if(personalised.value==="Yes"){

                personalisationBox.style.display="block";

            }

            else{

                personalisationBox.style.display="none";

            }

        }
    );

    if (personalised.value === "Yes") {
    personalisationBox.style.display = "block";
} else {
    personalisationBox.style.display = "none";
}

    card
    .querySelector(".removeItemButton")
    .addEventListener("click",function(){

        if(document.querySelectorAll(".itemCard").length===1){

            alert("You must have at least one item.");

            return;

        }

        card.remove();

        calculateTotal();

    });

}

// =====================================

// TOTALS

// =====================================

function calculateTotal(){

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

    remainingBalance.value =

    (

        grandTotal -

        Number(totalPaid.value)

    ).toFixed(2);

}

calculateTotal();
