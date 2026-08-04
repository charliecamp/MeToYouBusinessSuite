import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

// =====================================
// ORDER DETAILS
// =====================================

const params =
new URLSearchParams(window.location.search);

const orderId =
params.get("id");

// =====================================
// PAGE ELEMENTS
// =====================================

const orderHeading =
document.getElementById("orderHeading");

const orderCustomer =
document.getElementById("orderCustomer");

const summaryStatus =
document.getElementById("summaryStatus");

const summaryDue =
document.getElementById("summaryDue");

const summaryTotal =
document.getElementById("summaryTotal");

const summaryRemaining =
document.getElementById("summaryRemaining");

const customerContent =
document.getElementById("customerContent");

const itemsContent =
document.getElementById("itemsContent");

const paymentsContent =
document.getElementById("paymentsContent");

const deliveryContent =
document.getElementById("deliveryContent");

const notesContent =
document.getElementById("notesContent");

const imagesContent =
document.getElementById("imagesContent");

const statusContent =
document.getElementById("statusContent");

const editOrderButton =
document.getElementById("editOrder");

const saveChangesButton =
document.getElementById("saveChanges");

const cancelEditButton =
document.getElementById("cancelEdit");

const duplicateOrderButton =
document.getElementById("duplicateOrder");

const deleteOrderButton =
document.getElementById("deleteOrder");

// =====================================
// VARIABLES
// =====================================

let currentOrder = null;

let editing = false;

// =====================================
// START
// =====================================

window.addEventListener(
    "DOMContentLoaded",
    loadOrder
);

// =====================================
// LOAD ORDER
// =====================================

async function loadOrder(){

    if(!orderId){

        alert("Order not found.");

        window.location.href =
        "orders.html";

        return;

    }

    try{

        const snapshot =
        await getDoc(
            doc(db,"orders",orderId)
        );

        if(!snapshot.exists()){

            alert("Order not found.");

            window.location.href =
            "orders.html";

            return;

        }

        currentOrder = {

            id: snapshot.id,

            ...snapshot.data()

        };

        displayOrder();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}

// =====================================
// DISPLAY ORDER
// =====================================

function displayOrder(){

    // ---------- SUMMARY ----------

    orderHeading.textContent =
    `❤️ ${currentOrder.orderNumber || "No Order Number"}`;

    orderCustomer.textContent =
    currentOrder.customerName || "No Customer";

    summaryStatus.textContent =
    currentOrder.orderStatus || "New Order";

    summaryDue.textContent =
    currentOrder.dateNeeded || "-";

    summaryTotal.textContent =
    `£${Number(currentOrder.orderTotal || 0).toFixed(2)}`;

    summaryRemaining.textContent =
    `£${Number(currentOrder.remainingBalance || 0).toFixed(2)}`;

    // ---------- CUSTOMER ----------

    customerContent.innerHTML = `

    <div class="infoRow">

        <strong>Name</strong>

        <p>${currentOrder.customerName || "-"}</p>

    </div>

    <div class="infoRow">

        <strong>Contact</strong>

        <p>${currentOrder.customerContact || "-"}</p>

    </div>

    <div class="infoRow">

        <strong>Order Source</strong>

        <p>${currentOrder.orderSource || "-"}</p>

    </div>

    <div class="infoRow">

        <strong>Username</strong>

        <p>${currentOrder.socialUsername || "-"}</p>

    </div>

    `;

    // ---------- ITEMS ----------

    itemsContent.innerHTML = "";

    if(!currentOrder.items || currentOrder.items.length===0){

        itemsContent.innerHTML =

        "<p>No items added.</p>";

    }else{

        currentOrder.items.forEach((item,index)=>{

            itemsContent.innerHTML += `

            <div class="itemCard">

                <h3>

                Item ${index+1}

                </h3>

                <p><strong>Product:</strong> ${item.product || "-"}</p>

                <p><strong>Quantity:</strong> ${item.quantity || 1}</p>

                <p><strong>Unit Price:</strong>
                £${Number(item.unitPrice || 0).toFixed(2)}</p>

                <p><strong>Item Total:</strong>
                £${Number(item.itemTotal || 0).toFixed(2)}</p>

                <p><strong>Size:</strong>
                ${item.size || "-"}</p>

                <p><strong>Colour:</strong>
                ${item.colour || "-"}</p>

                <p><strong>Personalised:</strong>
                ${item.personalised || "No"}</p>

                <p><strong>Personalisation:</strong><br>

                ${item.personalisation || "-"}

                </p>

            </div>

            `;

        });

    }

    // ---------- PAYMENTS ----------

    paymentsContent.innerHTML = `

    <div class="infoRow">

        <strong>Order Total</strong>

        <p>£${Number(currentOrder.orderTotal || 0).toFixed(2)}</p>

    </div>

    <div class="infoRow">

        <strong>Total Paid</strong>

        <p>£${Number(currentOrder.totalPaid || 0).toFixed(2)}</p>

    </div>

    <div class="infoRow">

        <strong>Remaining Balance</strong>

        <p>£${Number(currentOrder.remainingBalance || 0).toFixed(2)}</p>

    </div>

    <div class="infoRow">

        <strong>Payment Status</strong>

        <p>${currentOrder.paymentStatus || "Not Paid"}</p>

    </div>

    `;

    // ---------- DELIVERY ----------

    deliveryContent.innerHTML = `

    <div class="infoRow">

        <strong>Delivery Method</strong>

        <p>${currentOrder.deliveryMethod || "Collection"}</p>

    </div>

    <div class="infoRow">

        <strong>Date Needed</strong>

        <p>${currentOrder.dateNeeded || "-"}</p>

    </div>

    <div class="infoRow">

        <strong>Address</strong>

        <p>

        ${currentOrder.address1 || ""}<br>

        ${currentOrder.address2 || ""}<br>

        ${currentOrder.town || ""}<br>

        ${currentOrder.county || ""}<br>

        ${currentOrder.postcode || ""}

        </p>

    </div>

    `;

    // ---------- NOTES ----------

    notesContent.innerHTML = `

    <p>

    ${currentOrder.orderNotes || "No notes added."}

    </p>

    `;

    // ---------- IMAGES ----------

    imagesContent.innerHTML = `

    <p>

    No customer images uploaded yet.

    </p>

    `;

    // ---------- STATUS ----------

    statusContent.innerHTML = `

    <h3>

    ${currentOrder.orderStatus || "New Order"}

    </h3>

    `;

}

// =====================================
// EDIT MODE
// =====================================

editOrderButton.addEventListener(
"click",
enterEditMode
);

cancelEditButton.addEventListener(
"click",
()=>{

    editing = false;

    editOrderButton.style.display =
    "inline-block";

    saveChangesButton.style.display =
    "none";

    cancelEditButton.style.display =
    "none";

    displayOrder();

}
);

function enterEditMode(){

    editing = true;

    editOrderButton.style.display =
    "none";

    saveChangesButton.style.display =
    "inline-block";

    cancelEditButton.style.display =
    "inline-block";

    customerContent.innerHTML = `

<label>Customer Name</label>

<input
id="editCustomerName"
type="text"
value="${currentOrder.customerName || ""}">

<label>Contact Number</label>

<input
id="editCustomerContact"
type="text"
value="${currentOrder.customerContact || ""}">

<label>Order Source</label>

<select id="editOrderSource">

<option value="Facebook"
${currentOrder.orderSource==="Facebook"?"selected":""}>
Facebook
</option>

<option value="Instagram"
${currentOrder.orderSource==="Instagram"?"selected":""}>
Instagram
</option>

<option value="TikTok"
${currentOrder.orderSource==="TikTok"?"selected":""}>
TikTok
</option>

<option value="Website"
${currentOrder.orderSource==="Website"?"selected":""}>
Website
</option>

<option value="Returning Customer"
${currentOrder.orderSource==="Returning Customer"?"selected":""}>
Returning Customer
</option>

</select>

<label>Social Username</label>

<input
id="editUsername"
type="text"
value="${currentOrder.socialUsername || ""}">

`;

    // ---------- ITEMS ----------

    itemsContent.innerHTML = "";

    (currentOrder.items || []).forEach((item,index)=>{

        itemsContent.innerHTML += `

        <div class="itemCard">

            <h3>Item ${index + 1}</h3>

            <label>Product</label>

            <input
            class="editProduct"
            type="text"
            value="${item.product || ""}">

            <label>Quantity</label>

            <input
            class="editQuantity"
            type="number"
            value="${item.quantity || 1}">

            <label>Unit Price (£)</label>

            <input
            class="editUnitPrice"
            type="number"
            step="0.01"
            value="${item.unitPrice || 0}">

            <label>Size</label>

            <input
            class="editSize"
            type="text"
            value="${item.size || ""}">

            <label>Colour</label>

            <input
            class="editColour"
            type="text"
            value="${item.colour || ""}">

            <label>Personalised</label>

            <select class="editPersonalised">

                <option value="No"
                ${item.personalised==="No"?"selected":""}>
                No
                </option>

                <option value="Yes"
                ${item.personalised==="Yes"?"selected":""}>
                Yes
                </option>

            </select>

            <label>Personalisation</label>

            <textarea
            class="editPersonalisation">${item.personalisation || ""}</textarea>

        </div>

        `;

    });

    // ---------- PAYMENTS ----------

    paymentsContent.innerHTML = `

    <label>Order Total (£)</label>

    <input
    id="editOrderTotal"
    type="number"
    step="0.01"
    value="${currentOrder.orderTotal || 0}">

    <label>Total Paid (£)</label>

    <input
    id="editTotalPaid"
    type="number"
    step="0.01"
    value="${currentOrder.totalPaid || 0}">

    <label>Remaining Balance (£)</label>

    <input
    id="editRemainingBalance"
    type="number"
    step="0.01"
    value="${currentOrder.remainingBalance || 0}">

    <label>Payment Status</label>

    <select id="editPaymentStatus">

        <option value="Not Paid">Not Paid</option>

        <option value="Part Paid">Part Paid</option>

        <option value="Paid">Paid</option>

    </select>

    `;

    document.getElementById("editPaymentStatus").value =
    currentOrder.paymentStatus || "Not Paid";

    // ---------- DELIVERY ----------

    deliveryContent.innerHTML = `

    <label>Delivery Method</label>

    <select id="editDeliveryMethod">

        <option value="Collection">Collection</option>

        <option value="Delivery">Delivery</option>

    </select>

    <label>Date Needed</label>

    <input
    id="editDateNeeded"
    type="date"
    value="${currentOrder.dateNeeded || ""}">

    <label>Address 1</label>

    <input
    id="editAddress1"
    type="text"
    value="${currentOrder.address1 || ""}">

    <label>Address 2</label>

    <input
    id="editAddress2"
    type="text"
    value="${currentOrder.address2 || ""}">

    <label>Town</label>

    <input
    id="editTown"
    type="text"
    value="${currentOrder.town || ""}">

    <label>County</label>

    <input
    id="editCounty"
    type="text"
    value="${currentOrder.county || ""}">

    <label>Postcode</label>

    <input
    id="editPostcode"
    type="text"
    value="${currentOrder.postcode || ""}">

    `;

    document.getElementById("editDeliveryMethod").value =
    currentOrder.deliveryMethod || "Collection";

    // ---------- NOTES ----------

    notesContent.innerHTML = `

    <label>Order Notes</label>

    <textarea
    id="editNotes">${currentOrder.orderNotes || ""}</textarea>

    `;

    // ---------- STATUS ----------

    statusContent.innerHTML = `

    <label>Order Status</label>

    <select id="editOrderStatus">

        <option>New Order</option>

        <option>Designing</option>

        <option>Making</option>

        <option>Ready</option>

        <option>Completed</option>

    </select>

    `;

    document.getElementById("editOrderStatus").value =
    currentOrder.orderStatus || "New Order";

    

}

// =====================================
// SAVE CHANGES
// =====================================

saveChangesButton.addEventListener("click",async()=>{

    try{

        currentOrder.customerName =
        document.getElementById("editCustomerName").value;

        currentOrder.customerContact =
        document.getElementById("editCustomerContact").value;

        currentOrder.orderSource =
        document.getElementById("editOrderSource").value;

        currentOrder.socialUsername =
        document.getElementById("editUsername").value;

        currentOrder.orderTotal =
        Number(document.getElementById("editOrderTotal").value);

        currentOrder.totalPaid =
        Number(document.getElementById("editTotalPaid").value);

        currentOrder.remainingBalance =
        Number(document.getElementById("editRemainingBalance").value);

        currentOrder.paymentStatus =
        document.getElementById("editPaymentStatus").value;

        currentOrder.deliveryMethod =
        document.getElementById("editDeliveryMethod").value;

        currentOrder.dateNeeded =
        document.getElementById("editDateNeeded").value;

        currentOrder.address1 =
        document.getElementById("editAddress1").value;

        currentOrder.address2 =
        document.getElementById("editAddress2").value;

        currentOrder.town =
        document.getElementById("editTown").value;

        currentOrder.county =
        document.getElementById("editCounty").value;

        currentOrder.postcode =
        document.getElementById("editPostcode").value;

        currentOrder.orderNotes =
        document.getElementById("editNotes").value;

        currentOrder.orderStatus =
        document.getElementById("editOrderStatus").value;

        // ---------- ITEMS ----------

        currentOrder.items = [];

        document.querySelectorAll(".itemCard").forEach(card=>{

            currentOrder.items.push({

                product:
                card.querySelector(".editProduct").value,

                quantity:
                Number(card.querySelector(".editQuantity").value),

                unitPrice:
                Number(card.querySelector(".editUnitPrice").value),

                itemTotal:
                Number(card.querySelector(".editQuantity").value) *
                Number(card.querySelector(".editUnitPrice").value),

                size:
                card.querySelector(".editSize").value,

                colour:
                card.querySelector(".editColour").value,

                personalised:
                card.querySelector(".editPersonalised").value,

                personalisation:
                card.querySelector(".editPersonalisation").value

            });

        });

        currentOrder.updatedAt =
        serverTimestamp();

        await updateDoc(

            doc(db,"orders",orderId),

            currentOrder

        );

        editing = false;

        editOrderButton.style.display =
        "inline-block";

        saveChangesButton.style.display =
        "none";

        cancelEditButton.style.display =
        "none";

        displayOrder();

        alert("Order updated successfully!");

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

});

