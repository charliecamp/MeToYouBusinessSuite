import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

// =====================================
// ORDER DETAILS
// =====================================

const params =
new URLSearchParams(window.location.search);

const orderId =
params.get("id");

const orderHeading =
document.getElementById("orderHeading");

const orderCustomer =
document.getElementById("orderCustomer");

const customerCard =
document.getElementById("customerCard");

const itemsCard =
document.getElementById("itemsCard");

const paymentsCard =
document.getElementById("paymentsCard");

const deliveryCard =
document.getElementById("deliveryCard");

const imagesCard =
document.getElementById("imagesCard");

const notesCard =
document.getElementById("notesCard");

const statusCard =
document.getElementById("statusCard");

loadOrder();

async function loadOrder(){

    if(!orderId){

        alert("Order not found.");

        return;

    }

    try{

        const snapshot =
        await getDoc(
            doc(db,"orders",orderId)
        );

        if(!snapshot.exists()){

            alert("Order not found.");

            return;

        }

        const order =
        snapshot.data();

        displayOrder(order);

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}

// =====================================
// DISPLAY ORDER
// =====================================

function displayOrder(order){

    orderHeading.textContent =
    order.orderNumber || "Order";

    orderCustomer.textContent =
    order.customerName || "";

    customerCard.innerHTML = `
        <h2>👤 Customer Details</h2>
        <p><strong>Name:</strong> ${order.customerName || ""}</p>
        <p><strong>Contact:</strong> ${order.customerContact || ""}</p>
    `;

    itemsCard.innerHTML = `
        <h2>📦 Items</h2>
        <p>${(order.items || []).length} item(s)</p>
    `;

    paymentsCard.innerHTML = `
        <h2>💷 Payments</h2>
        <p>Total: £${Number(order.orderTotal || 0).toFixed(2)}</p>
        <p>Paid: £${Number(order.totalPaid || 0).toFixed(2)}</p>
        <p>Remaining: £${Number(order.remainingBalance || 0).toFixed(2)}</p>
    `;

    deliveryCard.innerHTML = `
        <h2>🚚 Delivery</h2>
        <p>${order.deliveryMethod || "Collection"}</p>
    `;

    notesCard.innerHTML = `
        <h2>📝 Notes</h2>
        <p>${order.orderNotes || "No notes"}</p>
    `;

    statusCard.innerHTML = `
        <h2>✨ Status</h2>
        <p>${order.orderStatus || "New Order"}</p>
    `;

    imagesCard.innerHTML = `
        <h2>📸 Images</h2>
        <p>Coming soon.</p>
    `;

}
