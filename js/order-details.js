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

