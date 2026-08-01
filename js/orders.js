import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

// =====================================
// ORDERS
// =====================================

const ordersContainer =
document.getElementById("ordersContainer");

loadOrders();

async function loadOrders(){

    ordersContainer.innerHTML = `
        <p style="text-align:center;">
            Loading orders...
        </p>
    `;

    try{

        const q =
        query(
            collection(db,"orders"),
            orderBy("createdAt","desc")
        );

        const snapshot =
        await getDocs(q);

        ordersContainer.innerHTML="";

        if(snapshot.empty){

            ordersContainer.innerHTML=`
                <div class="emptyState">

                    <h2>No Orders Yet</h2>

                    <p>
                    Your saved orders will appear here.
                    </p>

                </div>
            `;

            return;

        }

        snapshot.forEach(doc=>{

            const order =
            doc.data();

            const card =
            document.createElement("div");

            card.className="orderCard";

       card.innerHTML = `

<h2>❤️ ${order.orderNumber || "No Order Number"}</h2>

<h3>👤 ${order.customerName || "No Customer Name"}</h3>

<p>
📞 ${order.customerContact || "No Contact"}
</p>

<p>
📅 Needed By:
${order.dateNeeded || "Not Set"}
</p>

<p>
💷 Total:
<strong>£${Number(order.orderTotal || 0).toFixed(2)}</strong>
</p>

<p>
💰 Paid:
£${Number(order.totalPaid || 0).toFixed(2)}
</p>

<p>
❤️ Remaining:
£${Number(order.remainingBalance || 0).toFixed(2)}
</p>

<p>
🚚 ${order.deliveryMethod || "Collection"}
</p>

<p>
✨ ${order.orderStatus || "New Order"}
</p>

<p>
💳 ${order.paymentStatus || "Not Paid"}
</p>

`;

            card.addEventListener("click",()=>{

                alert(
                    "View Order page coming next ❤️"
                );

            });

            ordersContainer.appendChild(card);

        });

    }

    catch(error){

        console.error(error);

        ordersContainer.innerHTML=`
            <p>
            Error loading orders.
            </p>
        `;

    }

}

