"use strict";

/* ==========================================
   ME TO YOU DESIGNS
   ORDER DETAILS
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

import {

    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject

} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-storage.js";

/* ==========================================
   URL
========================================== */

const params =
new URLSearchParams(
    window.location.search
);

const orderId =
params.get("id");

if(!orderId){

    window.location.href =
    "orders.html";

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

const paymentForm =
document.getElementById("paymentForm");

const paymentDate =
document.getElementById("paymentDate");

const paymentAmount =
document.getElementById("paymentAmount");

const paymentMethod =
document.getElementById("paymentMethod");

const paymentNotes =
document.getElementById("paymentNotes");

const savePaymentButton =
document.getElementById("savePaymentButton");

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
   MODALS
========================================== */

const photoModal =
document.getElementById("photoModal");

const photoPreview =
document.getElementById("photoPreview");

const closePhotoModal =
document.getElementById("closePhotoModal");

const loadingOverlay =
document.getElementById("loadingOverlay");

const toast =
document.getElementById("toast");

const deleteModal =
document.getElementById("deleteModal");

const confirmDelete =
document.getElementById("confirmDelete");

const cancelDelete =
document.getElementById("cancelDelete");

const duplicateModal =
document.getElementById("duplicateModal");

const confirmDuplicate =
document.getElementById("confirmDuplicate");

const cancelDuplicate =
document.getElementById("cancelDuplicate");

/* ==========================================
   START
========================================== */

initialise();

async function initialise(){

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

    "£"+

    Number(
        order.orderTotal || 0
    ).toFixed(2);

    remainingSummary.textContent =

    "£"+

    Number(
        order.remainingBalance || 0
    ).toFixed(2);

    /* Customer */

    customerName.value =
    order.customerName || "";

    customerContact.value =
    order.customerContact || "";

    orderSource.value =
    order.orderSource || "Facebook";

    socialUsername.value =
    order.socialUsername || "";

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

    /* Payments */

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

    updateStatusBadge();

    renderItems();

    renderPayments();

    renderPhotos();

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
   ORDER ITEMS
========================================== */

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

    pageChanged = true;

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

        card.className =
        "orderItem";

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
type="text"
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
min="0"
value="${item.unitPrice || 0}">

</div>

<div class="formGroup">

<label>

Item Total (£)

</label>

<input
class="itemTotal"
type="text"
readonly
value="${Number(item.itemTotal || 0).toFixed(2)}">

</div>

<div class="formGroup">

<label>

Size

</label>

<input
class="itemSize"
type="text"
value="${item.size || ""}">

</div>

<div class="formGroup">

<label>

Colour

</label>

<input
class="itemColour"
type="text"
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
?
"display:block"
:
"display:none"
}">

<label>

Personalisation

</label>

<input
class="itemPersonalisation"
type="text"
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

        const unitPrice =
        card.querySelector(".itemPrice");

        const itemTotal =
        card.querySelector(".itemTotal");

        const size =
        card.querySelector(".itemSize");

        const colour =
        card.querySelector(".itemColour");

        const personalised =
        card.querySelector(".itemPersonalised");

        const personalisation =
        card.querySelector(".itemPersonalisation");

        const personalisationBox =
        card.querySelector(".personalisationBox");

        const removeButton =
        card.querySelector(".removeItemButton");

        /* ==========================
           UPDATE ITEM
        ========================== */

        function updateItem(){

            items[index].product =
            product.value.trim();

            items[index].quantity =
            Number(quantity.value) || 1;

            items[index].unitPrice =
            Number(unitPrice.value) || 0;

            items[index].size =
            size.value.trim();

            items[index].colour =
            colour.value.trim();

            items[index].personalised =
            personalised.value;

            items[index].personalisation =
            personalisation.value.trim();

            items[index].itemTotal =

                items[index].quantity *

                items[index].unitPrice;

            itemTotal.value =

                items[index].itemTotal.toFixed(2);

            calculateOrderTotals();

            pageChanged = true;

        }

        /* ==========================
           EVENTS
        ========================== */

        product.addEventListener(
            "input",
            updateItem
        );

        quantity.addEventListener(
            "input",
            updateItem
        );

        unitPrice.addEventListener(
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

                personalisationBox.style.display =

                personalised.value==="Yes"

                ? "block"

                : "none";

                updateItem();

            }

        );

        /* ==========================
           REMOVE ITEM
        ========================== */

        removeButton.addEventListener(
            "click",
            ()=>{

                if(items.length===1){

                    showToast(
                        "You must have at least one item."
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

    let grandTotal = 0;

    items.forEach(item=>{

        item.itemTotal =

            Number(item.quantity || 0)

            *

            Number(item.unitPrice || 0);

        grandTotal += item.itemTotal;

    });

    order.orderTotal =
    grandTotal;

    order.remainingBalance =

        grandTotal -

        Number(order.totalPaid || 0);

    orderTotal.textContent =

        "£" +

        grandTotal.toFixed(2);

    orderTotalSummary.textContent =

        "£" +

        grandTotal.toFixed(2);

    remainingBalance.textContent =

        "£" +

        order.remainingBalance.toFixed(2);

    remainingSummary.textContent =

        "£" +

        order.remainingBalance.toFixed(2);

}

/* ==========================================
   PAYMENTS
========================================== */

addPaymentButton.addEventListener(
    "click",
    openPaymentForm
);

savePaymentButton.addEventListener(
    "click",
    savePayment
);

function openPaymentForm(){

    paymentForm.style.display = "block";

    paymentDate.value =
    new Date().toISOString().split("T")[0];

    paymentAmount.value = "";

    paymentMethod.value = "Cash";

    paymentNotes.value = "";

}

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

        amount,

        method:
        paymentMethod.value,

        notes:
        paymentNotes.value

    });

    paymentForm.style.display = "none";

    renderPayments();

    updatePaymentSummary();

    pageChanged = true;

}

/* ==========================================
   PAYMENT SUMMARY
========================================== */

function updatePaymentSummary(){

    let paid = 0;

    payments.forEach(payment=>{

        paid += Number(
            payment.amount || 0
        );

    });

    order.totalPaid = paid;

    order.remainingBalance =

        Number(order.orderTotal || 0)

        -

        paid;

    if(paid===0){

        order.paymentStatus =
        "Not Paid";

    }

    else if(

        paid >=
        Number(order.orderTotal || 0)

    ){

        order.paymentStatus =
        "Paid in Full";

    }

    else{

        order.paymentStatus =
        "Deposit Paid";

    }

    refreshSummary();

}

/* ==========================================
   RENDER PAYMENTS
========================================== */

function renderPayments(){

    paymentHistory.innerHTML = "";

    if(payments.length===0){

        paymentHistory.innerHTML =

        `<p class="emptyMessage">

        No payments recorded.

        </p>`;

        updatePaymentSummary();

        return;

    }

    payments.forEach((payment,index)=>{

        const card =
        document.createElement("div");

        card.className =
        "paymentCard";

        card.innerHTML = `

<div class="paymentHeader">

<strong>

£${Number(payment.amount).toFixed(2)}

</strong>

<button
class="deletePaymentButton"
data-index="${index}">

🗑

</button>

</div>

<p>

${payment.method}

</p>

<p>

${payment.date}

</p>

<p>

${payment.notes || ""}

</p>

`;

        paymentHistory.appendChild(card);

    });

    document

    .querySelectorAll(
        ".deletePaymentButton"
    )

    .forEach(button=>{

        button.addEventListener(
            "click",
            ()=>{

                const index =

                Number(
                    button.dataset.index
                );

                payments.splice(index,1);

                renderPayments();

                updatePaymentSummary();

                pageChanged = true;

            }

        );

    });

    updatePaymentSummary();

}

/* ==========================================
   REFRESH SUMMARY
========================================== */

function refreshSummary(){

    customerNameSummary.textContent =
    customerName.value.trim() || "No Customer";

    dateNeededSummary.textContent =
    dateNeeded.value || "--";

    orderTotal.textContent =
    "£" +
    Number(order.orderTotal || 0).toFixed(2);

    totalPaid.textContent =
    "£" +
    Number(order.totalPaid || 0).toFixed(2);

    remainingBalance.textContent =
    "£" +
    Number(order.remainingBalance || 0).toFixed(2);

    orderTotalSummary.textContent =
    "£" +
    Number(order.orderTotal || 0).toFixed(2);

    remainingSummary.textContent =
    "£" +
    Number(order.remainingBalance || 0).toFixed(2);

    paymentStatus.textContent =
    order.paymentStatus || "Not Paid";

    updateStatusBadge();

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

        /* Collections */

        order.items =
        items;

        order.payments =
        payments;

        order.customerPhotos =
        customerPhotos;

        /* Timestamp */

        order.updatedAt =
        serverTimestamp();

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

        pageChanged = false;

        refreshSummary();

        showToast(
            "💗 Order saved successfully"
        );

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
   TOAST
========================================== */

function showToast(message){

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(
        showToast.timeout
    );

    showToast.timeout =
    setTimeout(()=>{

        toast.classList.remove(
            "show"
        );

    },2500);

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
    uploadCustomerPhotos
);

function uploadCustomerPhotos(event){

    const files = [...event.target.files];

    if(files.length===0){
        return;
    }

    files.forEach(file=>{

        const reader = new FileReader();

        reader.onload = function(e){

            customerPhotos.push({

                name:file.name,

                image:e.target.result

            });

            renderPhotos();

            pageChanged = true;

        };

        reader.readAsDataURL(file);

    });

    customerImages.value = "";

}

function renderPhotos(){

    customerGallery.innerHTML = "";

    if(customerPhotos.length===0){

        customerGallery.innerHTML =

        `<p class="emptyMessage">

        No customer photos uploaded.

        </p>`;

        return;

    }

    customerPhotos.forEach((photo,index)=>{

        const card =
        document.createElement("div");

        card.className = "photoCard";

        card.innerHTML = `

<img
src="${photo.image}"
class="galleryImage"
data-index="${index}">

<button
class="deletePhotoButton"
data-index="${index}">

🗑

</button>

`;

        customerGallery.appendChild(card);

    });

    document
    .querySelectorAll(".galleryImage")
    .forEach(image=>{

        image.addEventListener(
            "click",
            ()=>{

                photoPreview.src =
                image.src;

                photoModal.classList.remove(
                    "hidden"
                );

            }
        );

    });

    document
    .querySelectorAll(".deletePhotoButton")
    .forEach(button=>{

        button.addEventListener(
            "click",
            ()=>{

                const index =
                Number(button.dataset.index);

                customerPhotos.splice(index,1);

                renderPhotos();

                pageChanged = true;

            }
        );

    });

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
   DUPLICATE ORDER
========================================== */

duplicateOrderButton.addEventListener(
    "click",
    ()=>{

        duplicateModal.classList.remove(
            "hidden"
        );

    }
);

cancelDuplicate.addEventListener(
    "click",
    ()=>{

        duplicateModal.classList.add(
            "hidden"
        );

    }
);

confirmDuplicate.addEventListener(
    "click",
    duplicateOrder
);

async function duplicateOrder(){

    try{

        const copy = {

            ...order,

            orderNumber:
            "COPY-" + order.orderNumber,

            orderStatus:
            "New Order",

            paymentStatus:
            "Not Paid",

            totalPaid:0,

            remainingBalance:
            Number(order.orderTotal || 0),

            payments:[],

            createdAt:
            serverTimestamp(),

            updatedAt:
            serverTimestamp()

        };

        delete copy.id;

        await addDoc(

            collection(db,"orders"),

            copy

        );

        duplicateModal.classList.add(
            "hidden"
        );

        showToast(
            "Order duplicated"
        );

    }

    catch(error){

        console.error(error);

        showToast(
            "Unable to duplicate order"
        );

    }

}

/* ==========================================
   DELETE ORDER
========================================== */

deleteOrderButton.addEventListener(
    "click",
    ()=>{

        deleteModal.classList.remove(
            "hidden"
        );

    }
);

cancelDelete.addEventListener(
    "click",
    ()=>{

        deleteModal.classList.add(
            "hidden"
        );

    }
);

confirmDelete.addEventListener(
    "click",
    deleteOrder
);

async function deleteOrder(){

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
            "Unable to delete order"
        );

    }

}

/* ==========================================
   FIREBASE STORAGE
========================================== */

import {

    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject

} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-storage.js";

const storage =
getStorage();

/* ==========================================
   PHOTO UPLOAD
========================================== */

customerImages.removeEventListener(
    "change",
    uploadCustomerPhotos
);

customerImages.addEventListener(
    "change",
    uploadPhotosToFirebase
);

async function uploadPhotosToFirebase(event){

    const files = [...event.target.files];

    if(files.length===0){

        return;

    }

    showToast("Uploading photos...");

    for(const file of files){

        try{

            const fileName =

                Date.now()

                + "-"

                + Math.random()

                .toString(36)

                .substring(2)

                + "-"

                + file.name;

            const storageRef = ref(

                storage,

                `orders/${orderId}/${fileName}`

            );

            await uploadBytes(

                storageRef,

                file

            );

            const downloadURL =

            await getDownloadURL(

                storageRef

            );

            customerPhotos.push({

                name:file.name,

                url:downloadURL,

                storagePath:storageRef.fullPath

            });

        }

        catch(error){

            console.error(error);

            showToast(
                "Photo upload failed."
            );

        }

    }

    customerImages.value="";

    renderPhotos();

    pageChanged=true;

    showToast(
        "Photos uploaded"
    );

}

/* ==========================================
   RENDER PHOTOS
========================================== */

function renderPhotos(){

    customerGallery.innerHTML="";

    if(customerPhotos.length===0){

        customerGallery.innerHTML=`

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

        card.innerHTML=`

<img
src="${photo.url}"
class="galleryImage"
data-index="${index}">

<button
class="deletePhotoButton"
data-index="${index}">

🗑

</button>

`;

        customerGallery.appendChild(card);

    });

    document

    .querySelectorAll(".galleryImage")

    .forEach(image=>{

        image.addEventListener(
            "click",
            ()=>{

                photoPreview.src =
                image.src;

                photoModal.classList.remove(
                    "hidden"
                );

            }
        );

    });

    document

    .querySelectorAll(".deletePhotoButton")

    .forEach(button=>{

        button.addEventListener(
            "click",
            async ()=>{

                const index =

                Number(
                    button.dataset.index
                );

                await deletePhoto(index);

            }

        );

    });

}

/* ==========================================
   DELETE PHOTO
========================================== */

async function deletePhoto(index){

    try{

        const photo =
        customerPhotos[index];

        if(photo.storagePath){

            await deleteObject(

                ref(
                    storage,
                    photo.storagePath
                )

            );

        }

        customerPhotos.splice(
            index,
            1
        );

        renderPhotos();

        pageChanged=true;

        showToast(
            "Photo deleted"
        );

    }

    catch(error){

        console.error(error);

        showToast(
            "Unable to delete photo"
        );

    }

}

/* ==========================================
   LIVE FIRESTORE UPDATES
========================================== */

const orderRef =
doc(db, "orders", orderId);

onSnapshot(orderRef, (snapshot) => {

    if (!snapshot.exists()) {

        showToast("Order no longer exists.");

        setTimeout(() => {

            window.location.href = "orders.html";

        }, 1500);

        return;

    }

    if (!pageChanged && !saving) {

        order = {

            id: snapshot.id,

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

});

/* ==========================================
   UNSAVED CHANGES
========================================== */

document

.querySelectorAll(

    "input, textarea, select"

)

.forEach(element => {

    element.addEventListener(

        "input",

        () => {

            pageChanged = true;

        }

    );

});

window.addEventListener(

    "beforeunload",

    function (event) {

        if (!pageChanged) {

            return;

        }

        event.preventDefault();

        event.returnValue = "";

    }

);

/* ==========================================
   LOADING
========================================== */

function showLoading() {

    loadingOverlay.classList.remove(
        "hidden"
    );

}

function hideLoading() {

    loadingOverlay.classList.add(
        "hidden"
    );

}

/* ==========================================
   FINISH INITIALISATION
========================================== */

refreshSummary();

showToast(
    "Order loaded successfully"
);

console.log(
    "Order Details Ready"
);
