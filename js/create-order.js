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
