"use strict";

import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    addDoc,
    collection,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-storage.js";

const storage = getStorage();

/* ==========================================
   URL
========================================== */

const params = new URLSearchParams(window.location.search);

const orderId = params.get("id");

if (!orderId) {

    window.location.href = "orders.html";

}

/* ==========================================
   DATA
========================================== */

let order = {};

let items = [];

let payments = [];

let customerPhotos = [];

let saving = false;

/* ==========================================
   ELEMENTS
========================================== */

const orderNumber = document.getElementById("orderNumber");
const customerNameSummary = document.getElementById("customerNameSummary");
const statusBadge = document.getElementById("statusBadge");
const orderDate = document.getElementById("orderDate");
const dateNeededSummary = document.getElementById("dateNeededSummary");
const orderTotalSummary = document.getElementById("orderTotalSummary");
const remainingSummary = document.getElementById("remainingSummary");

const customerName = document.getElementById("customerName");
const customerContact = document.getElementById("customerContact");
const orderSource = document.getElementById("orderSource");
const socialUsername = document.getElementById("socialUsername");

const itemsContainer = document.getElementById("itemsContainer");
const addItemButton = document.getElementById("addItemButton");

const uploadPhotosButton = document.getElementById("uploadPhotosButton");
const customerImages = document.getElementById("customerImages");
const customerGallery = document.getElementById("customerGallery");

const orderTotal = document.getElementById("orderTotal");
const totalPaid = document.getElementById("totalPaid");
const remainingBalance = document.getElementById("remainingBalance");
const paymentStatus = document.getElementById("paymentStatus");
const paymentHistory = document.getElementById("paymentHistory");

const addPaymentButton = document.getElementById("addPaymentButton");
const paymentForm = document.getElementById("paymentForm");

const paymentDate = document.getElementById("paymentDate");
const paymentAmount = document.getElementById("paymentAmount");
const paymentMethod = document.getElementById("paymentMethod");
const paymentNotes = document.getElementById("paymentNotes");
const savePaymentButton = document.getElementById("savePaymentButton");

const deliveryMethod = document.getElementById("deliveryMethod");
const dateNeeded = document.getElementById("dateNeeded");

const address1 = document.getElementById("address1");
const address2 = document.getElementById("address2");
const town = document.getElementById("town");
const county = document.getElementById("county");
const postcode = document.getElementById("postcode");

const orderNotes = document.getElementById("orderNotes");
const orderStatus = document.getElementById("orderStatus");

const saveChangesButton = document.getElementById("saveChangesButton");
const duplicateOrderButton = document.getElementById("duplicateOrderButton");
const deleteOrderButton = document.getElementById("deleteOrderButton");

const loadingOverlay = document.getElementById("loadingOverlay");
const toast = document.getElementById("toast");

const photoModal = document.getElementById("photoModal");
const photoPreview = document.getElementById("photoPreview");
const closePhotoModal = document.getElementById("closePhotoModal");

const deleteModal = document.getElementById("deleteModal");
const confirmDelete = document.getElementById("confirmDelete");
const cancelDelete = document.getElementById("cancelDelete");

const duplicateModal = document.getElementById("duplicateModal");
const confirmDuplicate = document.getElementById("confirmDuplicate");
const cancelDuplicate = document.getElementById("cancelDuplicate");

/* ==========================================
   START
========================================== */

initialise();

async function initialise() {

    showLoading();

    await loadOrder();

    hideLoading();

}

/* ==========================================
   LOAD ORDER
========================================== */

async function loadOrder(){

    try{

        const orderRef = doc(
            db,
            "orders",
            orderId
        );

        const snapshot =
        await getDoc(orderRef);

        if(!snapshot.exists()){

            alert("Order not found.");

            window.location.href =
            "orders.html";

            return;

        }

        order = snapshot.data();

        items = order.items || [];

        payments = order.payments || [];

        customerPhotos =
        order.customerPhotos || [];

        populateFields();

    }

    catch(error){

        console.error(error);

        alert(
            "Unable to load order."
        );

    }

}

/* ==========================================
   POPULATE PAGE
========================================== */

function populateFields(){

    /* Summary */

    orderNumber.textContent =
    order.orderNumber || "";

    customerNameSummary.textContent =
    order.customerName || "";

    orderDate.textContent =
    order.orderDate || "--";

    dateNeededSummary.textContent =
    order.dateNeeded || "--";

    orderTotalSummary.textContent =
    "£" +
    Number(order.orderTotal || 0).toFixed(2);

    remainingSummary.textContent =
    "£" +
    Number(order.remainingBalance || 0).toFixed(2);

    statusBadge.textContent =
    order.orderStatus || "New Order";

    /* Customer */

    customerName.value =
    order.customerName || "";

    customerContact.value =
    order.customerContact || "";

    orderSource.value =
    order.orderSource || "Facebook";

    socialUsername.value =
    order.socialUsername || "";

    /* Payments */

    orderTotal.textContent =
    "£" +
    Number(order.orderTotal || 0).toFixed(2);

    totalPaid.textContent =
    "£" +
    Number(order.totalPaid || 0).toFixed(2);

    remainingBalance.textContent =
    "£" +
    Number(order.remainingBalance || 0).toFixed(2);

    paymentStatus.textContent =
    order.paymentStatus || "Not Paid";

    /* Delivery */

    deliveryMethod.value =
    order.deliveryMethod || "Collection";

    dateNeeded.value =
    order.dateNeeded || "";

    address1.value =
    order.address1 || "";

    address2.value =
    order.address2 || "";

    town.value =
    order.town || "";

    county.value =
    order.county || "";

    postcode.value =
    order.postcode || "";

    /* Notes */

    orderNotes.value =
    order.orderNotes || "";

    /* Status */

    orderStatus.value =
    order.orderStatus || "New Order";

    /* Render Collections */

    renderItems();

    renderPayments();

    renderPhotos();

}

/* ==========================================
   LOADING
========================================== */

function showLoading(){

    loadingOverlay.classList.remove(
        "hidden"
    );

}

function hideLoading(){

    loadingOverlay.classList.add(
        "hidden"
    );

}

/* ==========================================
   TOAST
========================================== */

function showToast(message){

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(
        showToast.timer
    );

    showToast.timer =
    setTimeout(()=>{

        toast.classList.remove(
            "show"
        );

    },2500);

}

