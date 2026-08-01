import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

const ordersContainer =
document.getElementById("ordersContainer");

const searchBox =
document.getElementById("searchOrders");

let allOrders = [];

loadOrders();

async function loadOrders(){

    ordersContainer.innerHTML = `
        <p style="text-align:center;">
            Loading orders...
        </p>
    `;

    try{

        const snapshot =
        await getDocs(
            collection(db,"orders")
        );

        allOrders = [];

        snapshot.forEach(doc=>{

            allOrders.push({

                id: doc.id,

                ...doc.data()

            });

        });

        displayOrders(allOrders);

    }

    catch(error){

        console.error(error);

        ordersContainer.innerHTML = `
            <p style="text-align:center;">
                Error loading orders.
            </p>
        `;

    }

}

// =====================================
// DISPLAY ORDERS
// =====================================

function displayOrders(orders){

    ordersContainer.innerHTML = "";

    if(orders.length === 0){

        ordersContainer.innerHTML = `
            <div class="emptyState">
                <h2>No Orders Yet</h2>
                <p>Your saved orders will appear here.</p>
            </div>
        `;

        return;
    }

    orders.forEach(order=>{

        const card =
        document.createElement("div");

        card.className = "orderCard";

        card.innerHTML = `

<h2>❤️ ${order.orderNumber || "No Order Number"}</h2>

<h3>👤 ${order.customerName || "No Customer"}</h3>

<p>📞 ${order.customerContact || ""}</p>

<p>📅 Needed By: ${order.dateNeeded || "No Date"}</p>

<p>💷 Total: <strong>£${Number(order.orderTotal || 0).toFixed(2)}</strong></p>

<p>💰 Paid: £${Number(order.totalPaid || 0).toFixed(2)}</p>

<p>❤️ Remaining: £${Number(order.remainingBalance || 0).toFixed(2)}</p>

<p>🚚 ${order.deliveryMethod || "Collection"}</p>

<p>✨ ${order.orderStatus || "New Order"}</p>

<p>💳 ${order.paymentStatus || "Not Paid"}</p>

`;

        card.addEventListener("click",()=>{

        window.location.href =
`order-details.html?id=${order.id}`;
            
        });

        ordersContainer.appendChild(card);

    });

}

