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

/* ==========================================
   ORDER ITEMS
========================================== */

addItemButton.addEventListener("click", addItem);

function addItem() {

    items.push({

        product: "",
        quantity: 1,
        unitPrice: 0,
        itemTotal: 0,
        size: "",
        colour: "",
        personalised: "No",
        personalisation: ""

    });

    renderItems();

}

function renderItems() {

    itemsContainer.innerHTML = "";

    if (items.length === 0) {

        addItem();

        return;

    }

    items.forEach((item, index) => {

        const card = document.createElement("div");

        card.className = "itemCard";

        card.innerHTML = `

<div class="detailsGrid">

<div class="formGroup">

<label>Product</label>

<input
class="itemProduct"
type="text"
value="${item.product || ""}">

</div>

<div class="formGroup">

<label>Quantity</label>

<input
class="itemQuantity"
type="number"
min="1"
value="${item.quantity || 1}">

</div>

<div class="formGroup">

<label>Price (£)</label>

<input
class="itemPrice"
type="number"
step="0.01"
value="${item.unitPrice || 0}">

</div>

<div class="formGroup">

<label>Total (£)</label>

<input
class="itemTotal"
readonly
value="${Number(item.itemTotal || 0).toFixed(2)}">

</div>

<div class="formGroup">

<label>Size</label>

<input
class="itemSize"
type="text"
value="${item.size || ""}">

</div>

<div class="formGroup">

<label>Colour</label>

<input
class="itemColour"
type="text"
value="${item.colour || ""}">

</div>

<div class="formGroup">

<label>Personalised</label>

<select class="itemPersonalised">

<option value="No" ${item.personalised==="No"?"selected":""}>No</option>

<option value="Yes" ${item.personalised==="Yes"?"selected":""}>Yes</option>

</select>

</div>

<div class="formGroup personalisationGroup">

<label>Personalisation</label>

<input
class="itemPersonalisation"
type="text"
value="${item.personalisation || ""}">

</div>

</div>

<div style="margin-top:15px;">

<button
class="dangerButton removeItemButton">

🗑 Remove Item

</button>

</div>

`;

        itemsContainer.appendChild(card);

        setupItem(card, index);

    });

}

function setupItem(card, index) {

    const product = card.querySelector(".itemProduct");
    const quantity = card.querySelector(".itemQuantity");
    const price = card.querySelector(".itemPrice");
    const total = card.querySelector(".itemTotal");
    const size = card.querySelector(".itemSize");
    const colour = card.querySelector(".itemColour");
    const personalised = card.querySelector(".itemPersonalised");
    const personalisation = card.querySelector(".itemPersonalisation");

    function update() {

        items[index].product = product.value;

        items[index].quantity =
        Number(quantity.value);

        items[index].unitPrice =
        Number(price.value);

        items[index].itemTotal =
        items[index].quantity *
        items[index].unitPrice;

        items[index].size =
        size.value;

        items[index].colour =
        colour.value;

        items[index].personalised =
        personalised.value;

        items[index].personalisation =
        personalisation.value;

        total.value =
        items[index].itemTotal.toFixed(2);

        updateTotals();

    }

    product.oninput = update;
    quantity.oninput = update;
    price.oninput = update;
    size.oninput = update;
    colour.oninput = update;
    personalised.onchange = update;
    personalisation.oninput = update;

    card.querySelector(".removeItemButton")
    .onclick = () => {

        items.splice(index,1);

        renderItems();

        updateTotals();

    };

}

function updateTotals(){

    let grandTotal = 0;

    items.forEach(item=>{

        grandTotal +=
        Number(item.itemTotal || 0);

    });

    order.orderTotal = grandTotal;

    order.remainingBalance =
    grandTotal -
    Number(order.totalPaid || 0);

    orderTotal.textContent =
    "£" + grandTotal.toFixed(2);

    orderTotalSummary.textContent =
    "£" + grandTotal.toFixed(2);

    remainingBalance.textContent =
    "£" + order.remainingBalance.toFixed(2);

    remainingSummary.textContent =
    "£" + order.remainingBalance.toFixed(2);

}

/* ==========================================
   PAYMENTS
========================================== */

addPaymentButton.addEventListener("click", () => {

    paymentForm.style.display = "block";

    paymentDate.value =
    new Date().toISOString().split("T")[0];

});

savePaymentButton.addEventListener(
    "click",
    savePayment
);

function savePayment(){

    const amount =
    Number(paymentAmount.value);

    if(amount <= 0){

        showToast(
            "Enter a valid payment amount."
        );

        return;

    }

    payments.push({

        date:
        paymentDate.value,

        amount:
        amount,

        method:
        paymentMethod.value,

        notes:
        paymentNotes.value

    });

    paymentForm.style.display = "none";

    paymentAmount.value = "";

    paymentNotes.value = "";

    renderPayments();

}

function renderPayments(){

    paymentHistory.innerHTML = "";

    if(payments.length === 0){

        paymentHistory.innerHTML = `

<p class="emptyMessage">

No payments recorded.

</p>

`;

        updatePaymentSummary();

        return;

    }

    payments.forEach((payment,index)=>{

        const card =
        document.createElement("div");

        card.className =
        "paymentEntry";

        card.innerHTML = `

<strong>

£${payment.amount.toFixed(2)}

</strong>

<p>

${payment.method}

</p>

<p>

${payment.date}

</p>

<p>

${payment.notes || ""}

</p>

<button
class="dangerButton deletePaymentButton">

🗑 Remove

</button>

`;

        card.querySelector(".deletePaymentButton")

        .onclick = ()=>{

            payments.splice(index,1);

            renderPayments();

        };

        paymentHistory.appendChild(card);

    });

    updatePaymentSummary();

}

function updatePaymentSummary(){

    let paid = 0;

    payments.forEach(payment=>{

        paid +=
        Number(payment.amount);

    });

    order.totalPaid = paid;

    order.remainingBalance =

        Number(order.orderTotal || 0)

        -

        paid;

    if(paid === 0){

        order.paymentStatus =
        "Not Paid";

    }

    else if(

        paid >=
        Number(order.orderTotal)

    ){

        order.paymentStatus =
        "Paid in Full";

    }

    else{

        order.paymentStatus =
        "Deposit Paid";

    }

    totalPaid.textContent =

    "£" +

    paid.toFixed(2);

    remainingBalance.textContent =

    "£" +

    order.remainingBalance.toFixed(2);

    remainingSummary.textContent =

    "£" +

    order.remainingBalance.toFixed(2);

    paymentStatus.textContent =

    order.paymentStatus;

}

/* ==========================================
   SAVE ORDER
========================================== */

saveChangesButton.addEventListener(
    "click",
    saveOrder
);

async function saveOrder(){

    if(saving) return;

    saving = true;

    try{

        order.customerName =
        customerName.value.trim();

        order.customerContact =
        customerContact.value.trim();

        order.orderSource =
        orderSource.value;

        order.socialUsername =
        socialUsername.value.trim();

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

        order.orderNotes =
        orderNotes.value.trim();

        order.orderStatus =
        orderStatus.value;

        order.items = items;

        order.payments = payments;

        order.customerPhotos =
        customerPhotos;

        order.updatedAt =
        serverTimestamp();

        await updateDoc(

            doc(
                db,
                "orders",
                orderId
            ),

            order

        );

        customerNameSummary.textContent =
        order.customerName;

        dateNeededSummary.textContent =
        order.dateNeeded;

        statusBadge.textContent =
        order.orderStatus;

        showToast(
            "Order saved successfully."
        );

    }

    catch(error){

        console.error(error);

        showToast(
            "Unable to save order."
        );

    }

    finally{

        saving = false;

    }

}

/* ==========================================
   DUPLICATE ORDER
========================================== */

duplicateOrderButton.addEventListener(
    "click",
    duplicateOrder
);

async function duplicateOrder(){

    try{

        const duplicate = {

            ...order,

            orderNumber:
            order.orderNumber + "-COPY",

            createdAt:
            serverTimestamp(),

            updatedAt:
            serverTimestamp()

        };

        delete duplicate.id;

        await addDoc(

            collection(
                db,
                "orders"
            ),

            duplicate

        );

        showToast(
            "Order duplicated."
        );

    }

    catch(error){

        console.error(error);

        showToast(
            "Unable to duplicate order."
        );

    }

}

/* ==========================================
   DELETE ORDER
========================================== */

deleteOrderButton.addEventListener(
    "click",
    () => {

        deleteModal.classList.remove(
            "hidden"
        );

    }
);

cancelDelete.addEventListener(
    "click",
    () => {

        deleteModal.classList.add(
            "hidden"
        );

    }
);

confirmDelete.addEventListener(
    "click",
    confirmDeleteOrder
);

async function confirmDeleteOrder(){

    try{

        await deleteDoc(

            doc(
                db,
                "orders",
                orderId
            )

        );

        window.location.href =
        "orders.html";

    }

    catch(error){

        console.error(error);

        showToast(
            "Unable to delete order."
        );

    }

}

/* ==========================================
   CUSTOMER PHOTOS
========================================== */

uploadPhotosButton.addEventListener(
    "click",
    () => customerImages.click()
);

customerImages.addEventListener(
    "change",
    uploadPhotos
);

async function uploadPhotos(event){

    const files = [...event.target.files];

    for(const file of files){

        try{

            const fileName =
            Date.now() + "-" + file.name;

            const storageRef = ref(
                storage,
                `orders/${orderId}/${fileName}`
            );

            await uploadBytes(
                storageRef,
                file
            );

            const url =
            await getDownloadURL(
                storageRef
            );

            customerPhotos.push({

                name:file.name,

                url:url,

                path:storageRef.fullPath

            });

        }

        catch(error){

            console.error(error);

        }

    }

    renderPhotos();

    showToast("Photos uploaded.");

}

function renderPhotos(){

    customerGallery.innerHTML = "";

    if(customerPhotos.length===0){

        customerGallery.innerHTML = `

<p class="emptyMessage">

No customer photos uploaded.

</p>

`;

        return;

    }

    customerPhotos.forEach((photo,index)=>{

        const card =
        document.createElement("div");

        card.className =
        "photoCard";

        card.innerHTML = `

<img
src="${photo.url}"
class="galleryPhoto">

<button
class="dangerButton">

🗑

</button>

`;

        const image =
        card.querySelector("img");

        image.onclick = ()=>{

            photoPreview.src =
            photo.url;

            photoModal.classList.remove(
                "hidden"
            );

        };

        card.querySelector("button")
        .onclick = ()=>{

            deletePhoto(index);

        };

        customerGallery.appendChild(card);

    });

}

async function deletePhoto(index){

    try{

        const photo =
        customerPhotos[index];

        if(photo.path){

            await deleteObject(
                ref(storage,photo.path)
            );

        }

        customerPhotos.splice(index,1);

        renderPhotos();

        showToast(
            "Photo deleted."
        );

    }

    catch(error){

        console.error(error);

        showToast(
            "Unable to delete photo."
        );

    }

}

closePhotoModal.addEventListener(
    "click",
    ()=>{

        photoModal.classList.add(
            "hidden"
        );

    }
);

photoModal.addEventListener(
    "click",
    e=>{

        if(e.target===photoModal){

            photoModal.classList.add(
                "hidden"
            );

        }

    }
);

/* ==========================================
   FINISH
========================================== */

renderItems();

renderPayments();

renderPhotos();

showToast(
    "Order loaded."
);
