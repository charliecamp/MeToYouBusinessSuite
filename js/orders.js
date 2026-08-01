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

            card.innerHTML=`

                <h2>${order.orderNumber}</h2>

                <h3>${order.customerName}</h3>

                <p>
                ${order.orderStatus}
                </p>

                <p>
                £${Number(order.orderTotal).toFixed(2)}
                </p>

                <p>
                ${order.paymentStatus}
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

