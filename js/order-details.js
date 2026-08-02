import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    updateDoc,
    deleteDoc
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
// LOAD ORDER
// =====================================

window.addEventListener(
"DOMContentLoaded",
loadOrder
);

async function loadOrder(){

    if(!orderId){

        alert("Order not found.");

        window.location.href="orders.html";

        return;

    }

    try{

        const snapshot =
        await getDoc(
            doc(db,"orders",orderId)
        );

        if(!snapshot.exists()){

            alert("Order not found.");

            window.location.href="orders.html";

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

    // ---------- ORDER SUMMARY ----------

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

    <p><strong>Name</strong></p>
    <p>${currentOrder.customerName || "-"}</p>

    <p><strong>Contact</strong></p>
    <p>${currentOrder.customerContact || "-"}</p>

    <p><strong>Order Source</strong></p>
    <p>${currentOrder.orderSource || "-"}</p>

    <p><strong>Username</strong></p>
    <p>${currentOrder.socialUsername || "-"}</p>

    `;

    // ---------- ITEMS ----------

    itemsContent.innerHTML = "";

    if(!currentOrder.items || currentOrder.items.length===0){

        itemsContent.innerHTML =
        "<p>No items added.</p>";

    }else{

        currentOrder.items.forEach(item=>{

            itemsContent.innerHTML += `

            <div class="itemCard">

                <h4>${item.product || "Product"}</h4>

                <p><strong>Quantity:</strong> ${item.quantity || 1}</p>

                <p><strong>Unit Price:</strong> £${Number(item.unitPrice || 0).toFixed(2)}</p>

                <p><strong>Item Total:</strong> £${Number(item.itemTotal || 0).toFixed(2)}</p>

                <p><strong>Size:</strong> ${item.size || "-"}</p>

                <p><strong>Colour:</strong> ${item.colour || "-"}</p>

                <p><strong>Personalised:</strong> ${item.personalised || "No"}</p>

                <p><strong>Personalisation:</strong> ${item.personalisation || "-"}</p>

            </div>

            `;

        });

    }

    // ---------- PAYMENTS ----------

    paymentsContent.innerHTML = `

    <p><strong>Order Total</strong></p>
    <p>£${Number(currentOrder.orderTotal || 0).toFixed(2)}</p>

    <p><strong>Total Paid</strong></p>
    <p>£${Number(currentOrder.totalPaid || 0).toFixed(2)}</p>

    <p><strong>Remaining Balance</strong></p>
    <p>£${Number(currentOrder.remainingBalance || 0).toFixed(2)}</p>

    <p><strong>Payment Status</strong></p>
    <p>${currentOrder.paymentStatus || "Not Paid"}</p>

    `;

    // ---------- DELIVERY ----------

    deliveryContent.innerHTML = `

    <p><strong>Delivery Method</strong></p>
    <p>${currentOrder.deliveryMethod || "-"}</p>

    <p><strong>Date Needed</strong></p>
    <p>${currentOrder.dateNeeded || "-"}</p>

    <p><strong>Address</strong></p>

    <p>

    ${currentOrder.address1 || ""}<br>

    ${currentOrder.address2 || ""}<br>

    ${currentOrder.town || ""}<br>

    ${currentOrder.county || ""}<br>

    ${currentOrder.postcode || ""}

    </p>

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

    Image gallery coming soon.

    </p>

    `;

    // ---------- STATUS ----------

    statusContent.innerHTML = `

    <p>

    <strong>${currentOrder.orderStatus || "New Order"}</strong>

    </p>

    `;

}

// =====================================
// BUTTONS
// =====================================

// ---------- EDIT ----------

editOrderButton.addEventListener("click",()=>{

    editing = true;

    editOrderButton.style.display = "none";

    saveChangesButton.style.display = "inline-block";

    cancelEditButton.style.display = "inline-block";

    alert(
        "Edit Mode will be completed next."
    );

});

// ---------- CANCEL ----------

cancelEditButton.addEventListener("click",()=>{

    editing = false;

    saveChangesButton.style.display = "none";

    cancelEditButton.style.display = "none";

    editOrderButton.style.display = "inline-block";

    displayOrder();

});

// ---------- SAVE ----------

saveChangesButton.addEventListener("click",async()=>{

    alert(
        "Saving will be added next."
    );

});

// ---------- DELETE ----------

deleteOrderButton.addEventListener("click",async()=>{

    const confirmDelete =
    confirm(
        "Are you sure you want to delete this order?"
    );

    if(!confirmDelete) return;

    try{

        await deleteDoc(
            doc(db,"orders",orderId)
        );

        alert(
            "Order deleted successfully."
        );

        window.location.href =
        "orders.html";

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

});

// ---------- DUPLICATE ----------

duplicateOrderButton.addEventListener("click",()=>{

    alert(
        "Duplicate Order coming next."
    );

});
