import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

// =====================================
// VIEW ORDER
// =====================================

const params =
new URLSearchParams(window.location.search);

const orderId =
params.get("id");

const orderNumber =
document.getElementById("orderNumber");

const customerName =
document.getElementById("customerName");

const orderTotal =
document.getElementById("orderTotal");

const paymentStatus =
document.getElementById("paymentStatus");

const customerSection =
document.getElementById("customerSection");

const itemsSection =
document.getElementById("itemsSection");

const paymentsSection =
document.getElementById("paymentsSection");

const deliverySection =
document.getElementById("deliverySection");

const notesSection =
document.getElementById("notesSection");

const imagesSection =
document.getElementById("imagesSection");

const statusSection =
document.getElementById("statusSection");

loadOrder();

async function loadOrder(){

    if(!orderId){

        alert("Order not found.");

        return;

    }

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

    orderNumber.textContent =
    order.orderNumber;

    customerName.textContent =
    order.customerName;

    orderTotal.textContent =
    "£"+
    Number(order.orderTotal).toFixed(2);

    paymentStatus.textContent =
    order.paymentStatus;

    customerSection.innerHTML=`

<h3>Customer Details</h3>

<p><strong>Name:</strong>
${order.customerName}</p>

<p><strong>Contact:</strong>
${order.customerContact}</p>

<p><strong>Order Source:</strong>
${order.orderSource}</p>

<p><strong>Social:</strong>
${order.socialUsername}</p>

`;

    itemsSection.innerHTML="";

    order.items.forEach(item=>{

        itemsSection.innerHTML+=`

        <div class="itemCard">

            <h3>${item.product}</h3>

            <p>

            Qty:
            ${item.quantity}

            </p>

            <p>

            £${item.unitPrice}

            </p>

            <p>

            ${item.colour}

            </p>

        </div>

        `;

    });

    paymentsSection.innerHTML="";

    order.payments.forEach(payment=>{

        paymentsSection.innerHTML+=`

        <div class="paymentCard">

            £${payment.amount}

            <br>

            ${payment.method}

            <br>

            ${payment.date}

        </div>

        `;

    });

    deliverySection.innerHTML=`

<p>

${order.deliveryMethod}

</p>

<p>

${order.address1}

</p>

<p>

${order.town}

</p>

<p>

${order.postcode}

</p>

`;

    notesSection.innerHTML=`

<p>

${order.orderNotes}

</p>

`;

    statusSection.innerHTML=`

<h3>

${order.orderStatus}

</h3>

`;

}
