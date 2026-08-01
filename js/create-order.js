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

// =====================================
// DELIVERY
// =====================================

const addressSection =
document.getElementById("addressSection");

function updateDelivery(){

    if(deliveryMethod.value==="Collection"){

        addressSection.style.display="none";

    }

    else{

        addressSection.style.display="block";

    }

}

deliveryMethod.addEventListener(
    "change",
    updateDelivery
);

updateDelivery();


// =====================================
// PAYMENT
// =====================================

const paymentHistory =
document.getElementById("paymentHistory");

const savePaymentButton =
document.getElementById("savePaymentButton");

addPaymentButton.addEventListener("click",function(){

    paymentForm.style.display="block";

});

savePaymentButton.addEventListener("click",savePayment);

function savePayment(){

    const payment={

        date:
        document.getElementById("paymentDate").value,

        amount:
        Number(document.getElementById("paymentAmount").value)||0,

        method:
        document.getElementById("paymentMethod").value,

        notes:
        document.getElementById("paymentNotes").value

    };

    if(payment.amount<=0){

        alert("Enter a payment amount.");

        return;

    }

    payments.push(payment);

    updatePayments();

    paymentForm.style.display="none";

}

function updatePayments(){

    let paid = 0;

    paymentHistory.innerHTML = "";

    payments.forEach(payment=>{

        paid += payment.amount;

        paymentHistory.innerHTML += `
            <div class="paymentEntry">
                <strong>£${payment.amount.toFixed(2)}</strong><br>
                ${payment.method}<br>
                ${payment.date}
            </div>
        `;

    });

    if(payments.length===0){

        paymentHistory.innerHTML =
        "<p>No payments recorded yet.</p>";

    }

    totalPaid.value = paid.toFixed(2);

    remainingBalance.value =
    (
        Number(orderTotal.value)-paid
    ).toFixed(2);

    if(paid===0){

        paymentStatus.value="Not Paid";

    }

    else if(paid>=Number(orderTotal.value)){

        paymentStatus.value="Paid in Full";

    }

    else{

        paymentStatus.value="Deposit Paid";

    }

}

// =====================================
// SAVE ORDER
// =====================================

saveOrderButton.addEventListener("click", saveOrder);

async function saveOrder() {

    const items = [];

    document.querySelectorAll(".itemCard").forEach(card => {

        items.push({

            product: card.querySelector(".itemProduct").value,

            quantity: Number(card.querySelector(".itemQuantity").value),

            unitPrice: Number(card.querySelector(".itemPrice").value),

            itemTotal: Number(card.querySelector(".itemTotal").value),

            size: card.querySelector(".itemSize").value,

            colour: card.querySelector(".itemColour").value,

            personalised: card.querySelector(".itemPersonalised").value,

            personalisation: card.querySelector(".itemPersonalisation").value

        });

    });

    const order = {

        orderNumber: orderNumber.value,

        customerName: customerName.value,

        customerContact: customerContact.value,

        orderSource: orderSource.value,

        socialUsername: socialUsername.value,

        orderDate: orderDate.value,

        dateNeeded: dateNeeded.value,

        orderNotes: orderNotes.value,

        orderTotal: Number(orderTotal.value),

        paymentStatus: paymentStatus.value,

        totalPaid: Number(totalPaid.value),

        remainingBalance: Number(remainingBalance.value),

        deliveryMethod: deliveryMethod.value,

        address1: address1.value,

        address2: address2.value,

        town: town.value,

        county: county.value,

        postcode: postcode.value,

        orderStatus: orderStatus.value,

        items: items,

        payments: payments,

        createdAt: serverTimestamp()

    };

    try {

        await addDoc(
            collection(db, "orders"),
            order
        );

        nextOrderNumber++;

        localStorage.setItem(
            "nextOrderNumber",
            nextOrderNumber
        );

        alert("✅ Order saved successfully!");

        window.location.href = "orders.html";

    }

    catch (error) {

        console.error(error);

        alert("❌ Error saving order.");

    }

}
