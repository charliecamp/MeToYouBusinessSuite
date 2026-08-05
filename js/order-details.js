"use strict";

/* ==========================================
   ME TO YOU DESIGNS
   ORDER DETAILS
   FIREBASE VERSION
========================================== */

import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    addDoc,
    collection,
    serverTimestamp,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

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

let pageChanged = false;

let saving = false;

/* ==========================================
   SUMMARY
========================================== */

const orderNumber =
document.getElementById("orderNumber");

const customerNameSummary =
document.getElementById("customerNameSummary");

const statusBadge =
document.getElementById("statusBadge");

const orderDate =
document.getElementById("orderDate");

const dateNeededSummary =
document.getElementById("dateNeededSummary");

const orderTotalSummary =
document.getElementById("orderTotalSummary");

const remainingSummary =
document.getElementById("remainingSummary");

/* ==========================================
   CUSTOMER
========================================== */

const customerName =
document.getElementById("customerName");

const customerContact =
document.getElementById("customerContact");

const orderSource =
document.getElementById("orderSource");

const socialUsername =
document.getElementById("socialUsername");

/* ==========================================
   ITEMS
========================================== */

const itemsContainer =
document.getElementById("itemsContainer");

const addItemButton =
document.getElementById("addItemButton");

/* ==========================================
   PHOTOS
========================================== */

const uploadPhotosButton =
document.getElementById("uploadPhotosButton");

const customerImages =
document.getElementById("customerImages");

const customerGallery =
document.getElementById("customerGallery");

/* ==========================================
   PAYMENTS
========================================== */

const orderTotal =
document.getElementById("orderTotal");

const totalPaid =
document.getElementById("totalPaid");

const remainingBalance =
document.getElementById("remainingBalance");

const paymentStatus =
document.getElementById("paymentStatus");

const paymentHistory =
document.getElementById("paymentHistory");

const addPaymentButton =
document.getElementById("addPaymentButton");

/* ==========================================
   DELIVERY
========================================== */

const deliveryMethod =
document.getElementById("deliveryMethod");

const dateNeeded =
document.getElementById("dateNeeded");

const address1 =
document.getElementById("address1");

const address2 =
document.getElementById("address2");

const town =
document.getElementById("town");

const county =
document.getElementById("county");

const postcode =
document.getElementById("postcode");

/* ==========================================
   NOTES
========================================== */

const orderNotes =
document.getElementById("orderNotes");

/* ==========================================
   STATUS
========================================== */

const orderStatus =
document.getElementById("orderStatus");

/* ==========================================
   BUTTONS
========================================== */

const saveChangesButton =
document.getElementById("saveChangesButton");

const duplicateOrderButton =
document.getElementById("duplicateOrderButton");

const deleteOrderButton =
document.getElementById("deleteOrderButton");

/* ==========================================
   LOAD ORDER
========================================== */

loadOrder();

async function loadOrder(){

    try{

        const snapshot =
        await getDoc(

            doc(
                db,
                "orders",
                orderId
            )

        );

        if(!snapshot.exists()){

            alert(
                "Order not found."
            );

            window.location.href =
            "orders.html";

            return;

        }

        order = {

            id:snapshot.id,

            ...snapshot.data()

        };

        items =
        order.items || [];

        payments =
        order.payments || [];

        customerPhotos =
        order.customerPhotos || [];

        populatePage();

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

function populatePage(){

    orderNumber.textContent =
    order.orderNumber || "";

    customerNameSummary.textContent =
    order.customerName || "";

    orderDate.textContent =
    order.orderDate || "--";

    dateNeededSummary.textContent =
    order.dateNeeded || "--";

    orderTotalSummary.textContent =
    "£"+
    Number(
        order.orderTotal || 0
    ).toFixed(2);

    remainingSummary.textContent =
    "£"+
    Number(
        order.remainingBalance || 0
    ).toFixed(2);

    customerName.value =
    order.customerName || "";

    customerContact.value =
    order.customerContact || "";

    orderSource.value =
    order.orderSource || "Facebook";

    socialUsername.value =
    order.socialUsername || "";

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

    orderNotes.value =
    order.orderNotes || "";

    orderStatus.value =
    order.orderStatus || "New Order";

    orderTotal.textContent =
    "£"+
    Number(
        order.orderTotal || 0
    ).toFixed(2);

    totalPaid.textContent =
    "£"+
    Number(
        order.totalPaid || 0
    ).toFixed(2);

    remainingBalance.textContent =
    "£"+
    Number(
        order.remainingBalance || 0
    ).toFixed(2);

    paymentStatus.textContent =
    order.paymentStatus ||
    "Not Paid";

}

/* ==========================================
   SAVE ORDER
========================================== */

saveChangesButton.addEventListener(
    "click",
    saveOrder
);

async function saveOrder(){

    if(saving){
        return;
    }

    saving = true;

    try{

        /* Customer */

        order.customerName =
        customerName.value.trim();

        order.customerContact =
        customerContact.value.trim();

        order.orderSource =
        orderSource.value;

        order.socialUsername =
        socialUsername.value.trim();

        /* Delivery */

        order.deliveryMethod =
        deliveryMethod.value;

        order.dateNeeded =
        dateNeeded.value;

        order.address1 =
        address1.value.trim();

        order.address2 =
        address2.value.trim();

        order.town =
        town.value.trim();

        order.county =
        county.value.trim();

        order.postcode =
        postcode.value.trim();

        /* Notes */

        order.orderNotes =
        orderNotes.value.trim();

        /* Status */

        order.orderStatus =
        orderStatus.value;

        /* Arrays */

        order.items = items;

        order.payments = payments;

        order.customerPhotos =
        customerPhotos;

        /* Totals */

        order.totalPaid =

        Number(order.totalPaid || 0);

        order.orderTotal =

        Number(order.orderTotal || 0);

        order.remainingBalance =

        order.orderTotal -

        order.totalPaid;

        if(order.totalPaid===0){

            order.paymentStatus =
            "Not Paid";

        }

        else if(

            order.totalPaid>=

            order.orderTotal

        ){

            order.paymentStatus =
            "Paid in Full";

        }

        else{

            order.paymentStatus =
            "Deposit Paid";

        }

        /* Firebase */

        await updateDoc(

            doc(
                db,
                "orders",
                orderId
            ),

            {

                customerName:
                order.customerName,

                customerContact:
                order.customerContact,

                orderSource:
                order.orderSource,

                socialUsername:
                order.socialUsername,

                deliveryMethod:
                order.deliveryMethod,

                dateNeeded:
                order.dateNeeded,

                address1:
                order.address1,

                address2:
                order.address2,

                town:
                order.town,

                county:
                order.county,

                postcode:
                order.postcode,

                orderNotes:
                order.orderNotes,

                orderStatus:
                order.orderStatus,

                orderTotal:
                order.orderTotal,

                totalPaid:
                order.totalPaid,

                remainingBalance:
                order.remainingBalance,

                paymentStatus:
                order.paymentStatus,

                items:
                order.items,

                payments:
                order.payments,

                customerPhotos:
                order.customerPhotos,

                updatedAt:
                serverTimestamp()

            }

        );

        refreshSummary();

        showToast(
            "💗 Order saved successfully"
        );

        pageChanged = false;

    }

    catch(error){

        console.error(error);

        showToast(
            "❌ Failed to save order"
        );

    }

    finally{

        saving = false;

    }

}

/* ==========================================
   REFRESH SUMMARY
========================================== */

function refreshSummary(){

    customerNameSummary.textContent =
    order.customerName;

    dateNeededSummary.textContent =
    order.dateNeeded || "--";

    orderTotalSummary.textContent =
    "£"+
    Number(order.orderTotal)
    .toFixed(2);

    remainingSummary.textContent =
    "£"+
    Number(order.remainingBalance)
    .toFixed(2);

    orderTotal.textContent =
    "£"+
    Number(order.orderTotal)
    .toFixed(2);

    totalPaid.textContent =
    "£"+
    Number(order.totalPaid)
    .toFixed(2);

    remainingBalance.textContent =
    "£"+
    Number(order.remainingBalance)
    .toFixed(2);

    paymentStatus.textContent =
    order.paymentStatus;

    updateStatusBadge();

}

/* ==========================================
   STATUS BADGE
========================================== */

function updateStatusBadge(){

    statusBadge.className =
    "statusBadge";

    statusBadge.textContent =
    order.orderStatus;

    switch(order.orderStatus){

        case "New Order":

            statusBadge.classList.add(
                "status-new"
            );

        break;

        case "Designing":

            statusBadge.classList.add(
                "status-designing"
            );

        break;

        case "Making":

            statusBadge.classList.add(
                "status-making"
            );

        break;

        case "Ready":

            statusBadge.classList.add(
                "status-ready"
            );

        break;

        case "Completed":

            statusBadge.classList.add(
                "status-completed"
            );

        break;

        case "Cancelled":

            statusBadge.classList.add(
                "status-cancelled"
            );

        break;

    }

}

/* ==========================================
   TOAST
========================================== */

function showToast(message){

    let toast =
    document.getElementById("toast");

    if(!toast){

        toast =
        document.createElement("div");

        toast.id =
        "toast";

        document.body.appendChild(
            toast
        );

    }

    toast.textContent =
    message;

    toast.style.opacity = "1";

    setTimeout(()=>{

        toast.style.opacity = "0";

    },2500);

}

/* ==========================================
   ORDER ITEMS
========================================== */

renderItems();

addItemButton.addEventListener(
    "click",
    addNewItem
);

function addNewItem(){

    items.push({

        product:"",
        quantity:1,
        unitPrice:0,
        itemTotal:0,
        size:"",
        colour:"",
        personalised:"No",
        personalisation:""

    });

    renderItems();

}

/* ==========================================
   RENDER ITEMS
========================================== */

function renderItems(){

    itemsContainer.innerHTML = "";

    if(items.length===0){

        addNewItem();

        return;

    }

    items.forEach((item,index)=>{

        const card =
        document.createElement("div");

        card.className = "orderItem";

        card.innerHTML = `

        <div class="orderItemHeader">

            <h3>

                Item ${index+1}

            </h3>

            <button
                class="removeItemButton"
                data-index="${index}">

                🗑

            </button>

        </div>

        <div class="orderItemGrid">

            <div class="formGroup">

                <label>

                    Product

                </label>

                <input
                    class="itemProduct"
                    value="${item.product || ""}">

            </div>

            <div class="formGroup">

                <label>

                    Quantity

                </label>

                <input
                    class="itemQuantity"
                    type="number"
                    min="1"
                    value="${item.quantity || 1}">

            </div>

            <div class="formGroup">

                <label>

                    Unit Price (£)

                </label>

                <input
                    class="itemPrice"
                    type="number"
                    step="0.01"
                    value="${item.unitPrice || 0}">

            </div>

            <div class="formGroup">

                <label>

                    Item Total (£)

                </label>

                <input
                    class="itemTotal"
                    readonly
                    value="${Number(item.itemTotal || 0).toFixed(2)}">

            </div>

            <div class="formGroup">

                <label>

                    Size

                </label>

                <input
                    class="itemSize"
                    value="${item.size || ""}">

            </div>

            <div class="formGroup">

                <label>

                    Colour

                </label>

                <input
                    class="itemColour"
                    value="${item.colour || ""}">

            </div>

            <div class="formGroup">

                <label>

                    Personalised

                </label>

                <select class="itemPersonalised">

                    <option value="No"
                    ${item.personalised==="No" ? "selected" : ""}>

                        No

                    </option>

                    <option value="Yes"
                    ${item.personalised==="Yes" ? "selected" : ""}>

                        Yes

                    </option>

                </select>

            </div>

            <div
                class="formGroup personalisationBox"
                style="${
                    item.personalised==="Yes"
                    ? "display:block"
                    : "display:none"
                }">

                <label>

                    Personalisation

                </label>

                <input
                    class="itemPersonalisation"
                    value="${item.personalisation || ""}">

            </div>

        </div>

        `;

        itemsContainer.appendChild(card);

    });

    setupItemEvents();

}

/* ==========================================
   ITEM EVENTS
========================================== */

function setupItemEvents(){

    const cards =
    document.querySelectorAll(".orderItem");

    cards.forEach((card,index)=>{

        const product =
        card.querySelector(".itemProduct");

        const quantity =
        card.querySelector(".itemQuantity");

        const price =
        card.querySelector(".itemPrice");

        const total =
        card.querySelector(".itemTotal");

        const size =
        card.querySelector(".itemSize");

        const colour =
        card.querySelector(".itemColour");

        const personalised =
        card.querySelector(".itemPersonalised");

        const personalisation =
        card.querySelector(".itemPersonalisation");

        const box =
        card.querySelector(".personalisationBox");

        const removeButton =
        card.querySelector(".removeItemButton");

        /* -----------------------
           UPDATE ITEM
        ----------------------- */

        function updateItem(){

            items[index].product =
            product.value;

            items[index].quantity =
            Number(quantity.value) || 1;

            items[index].unitPrice =
            Number(price.value) || 0;

            items[index].size =
            size.value;

            items[index].colour =
            colour.value;

            items[index].personalised =
            personalised.value;

            items[index].personalisation =
            personalisation.value;

            items[index].itemTotal =

                items[index].quantity *

                items[index].unitPrice;

            total.value =
            items[index].itemTotal.toFixed(2);

            calculateOrderTotals();

            pageChanged = true;

        }

        /* -----------------------
           EVENTS
        ----------------------- */

        product.addEventListener(
            "input",
            updateItem
        );

        quantity.addEventListener(
            "input",
            updateItem
        );

        price.addEventListener(
            "input",
            updateItem
        );

        size.addEventListener(
            "input",
            updateItem
        );

        colour.addEventListener(
            "input",
            updateItem
        );

        personalisation.addEventListener(
            "input",
            updateItem
        );

        personalised.addEventListener(
            "change",
            ()=>{

                box.style.display =

                personalised.value==="Yes"

                ? "block"

                : "none";

                updateItem();

            }

        );

        /* -----------------------
           REMOVE ITEM
        ----------------------- */

        removeButton.addEventListener(
            "click",
            ()=>{

                if(items.length===1){

                    showToast(
                        "❌ At least one item is required."
                    );

                    return;

                }

                items.splice(index,1);

                renderItems();

                calculateOrderTotals();

                pageChanged = true;

            }

        );

    });

}

/* ==========================================
   CALCULATE TOTALS
========================================== */

function calculateOrderTotals(){

    let total = 0;

    items.forEach(item=>{

        item.itemTotal =

            Number(item.quantity || 0)

            *

            Number(item.unitPrice || 0);

        total += item.itemTotal;

    });

    order.orderTotal = total;

    order.remainingBalance =

        total -

        Number(order.totalPaid || 0);

    orderTotal.textContent =

        "£" +

        total.toFixed(2);

    orderTotalSummary.textContent =

        "£" +

        total.toFixed(2);

    remainingBalance.textContent =

        "£" +

        order.remainingBalance.toFixed(2);

    remainingSummary.textContent =

        "£" +

        order.remainingBalance.toFixed(2);

}

