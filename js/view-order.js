import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

// =====================================
// VIEW / EDIT ORDER
// =====================================

const params =
new URLSearchParams(window.location.search);

const orderId =
params.get("id");

// ---------- CUSTOMER ----------

const customerName =
document.getElementById("customerName");

const customerContact =
document.getElementById("customerContact");

const orderSource =
document.getElementById("orderSource");

const socialUsername =
document.getElementById("socialUsername");

// ---------- ORDER ----------

const orderNumber =
document.getElementById("orderNumber");

const orderDate =
document.getElementById("orderDate");

const dateNeeded =
document.getElementById("dateNeeded");

const orderNotes =
document.getElementById("orderNotes");

// ---------- ITEMS ----------

const itemsContainer =
document.getElementById("itemsContainer");

const addItemButton =
document.getElementById("addItemButton");

// ---------- PAYMENT ----------

const orderTotal =
document.getElementById("orderTotal");

const paymentStatus =
document.getElementById("paymentStatus");

const totalPaid =
document.getElementById("totalPaid");

const remainingBalance =
document.getElementById("remainingBalance");

const paymentHistory =
document.getElementById("paymentHistory");

const paymentForm =
document.getElementById("paymentForm");

const addPaymentButton =
document.getElementById("addPaymentButton");

const savePaymentButton =
document.getElementById("savePaymentButton");

// ---------- DELIVERY ----------

const deliveryMethod =
document.getElementById("deliveryMethod");

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

// ---------- STATUS ----------

const orderStatus =
document.getElementById("orderStatus");

// ---------- BUTTONS ----------

const saveChangesButton =
document.getElementById("saveChanges");

const deleteOrderButton =
document.getElementById("deleteOrder");

// ---------- VARIABLES ----------

let currentOrder = null;

let payments = [];

// ---------- START ----------

loadOrder();
// =====================================
// LOAD ORDER
// =====================================

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

        currentOrder =
        snapshot.data();

        payments =
        currentOrder.payments || [];

        // ---------- CUSTOMER ----------

        customerName.value =
        currentOrder.customerName || "";

        customerContact.value =
        currentOrder.customerContact || "";

        orderSource.value =
        currentOrder.orderSource || "Facebook";

        socialUsername.value =
        currentOrder.socialUsername || "";

        // ---------- ORDER ----------

        orderNumber.value =
        currentOrder.orderNumber || "";

        orderDate.value =
        currentOrder.orderDate || "";

        dateNeeded.value =
        currentOrder.dateNeeded || "";

        orderNotes.value =
        currentOrder.orderNotes || "";

        // ---------- PAYMENT ----------

        orderTotal.value =
        Number(currentOrder.orderTotal || 0).toFixed(2);

        paymentStatus.value =
        currentOrder.paymentStatus || "Not Paid";

        totalPaid.value =
        Number(currentOrder.totalPaid || 0).toFixed(2);

        remainingBalance.value =
        Number(currentOrder.remainingBalance || 0).toFixed(2);

        // ---------- DELIVERY ----------

        deliveryMethod.value =
        currentOrder.deliveryMethod || "Collection";

        address1.value =
        currentOrder.address1 || "";

        address2.value =
        currentOrder.address2 || "";

        town.value =
        currentOrder.town || "";

        county.value =
        currentOrder.county || "";

        postcode.value =
        currentOrder.postcode || "";

        // ---------- STATUS ----------

        orderStatus.value =
        currentOrder.orderStatus || "New Order";

        loadItems();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}

// =====================================
// LOAD ITEMS
// =====================================

function loadItems(){

    if(!currentOrder) return;

    itemsContainer.innerHTML = "";

    const items =
    currentOrder.items || [];

    items.forEach(item=>{

        const card =
        document.createElement("div");

        card.className = "itemCard";

        card.innerHTML = `

<label>Product</label>

<input
type="text"
class="itemProduct"
value="${item.product || ""}">

<label>Quantity</label>

<input
type="number"
class="itemQuantity"
value="${item.quantity || 1}"
min="1">

<label>Unit Price (£)</label>

<input
type="number"
class="itemPrice"
step="0.01"
value="${item.unitPrice || 0}">

<label>Item Total (£)</label>

<input
type="number"
class="itemTotal"
readonly
value="${item.itemTotal || 0}">

<label>Size</label>

<input
type="text"
class="itemSize"
value="${item.size || ""}">

<label>Colour / Theme</label>

<input
type="text"
class="itemColour"
value="${item.colour || ""}">

<label>Personalised?</label>

<select class="itemPersonalised">

<option ${item.personalised==="No"?"selected":""}>
No
</option>

<option ${item.personalised==="Yes"?"selected":""}>
Yes
</option>

</select>

<div class="personalisationBox"
style="${item.personalised==="Yes" ? "display:block;" : "display:none;"}">

<label>Personalisation</label>

<textarea
class="itemPersonalisation">${item.personalisation || ""}</textarea>

</div>

<button
type="button"
class="removeItemButton">

🗑 Remove Item

</button>

`;

        itemsContainer.appendChild(card);

    });

}

// =====================================
// ITEMS
// =====================================

addItemButton.addEventListener(
    "click",
    addNewItem
);

function addNewItem(){

    const card =
    document.createElement("div");

    card.className = "itemCard";

    card.innerHTML = `

<label>Product</label>

<input
type="text"
class="itemProduct">

<label>Quantity</label>

<input
type="number"
class="itemQuantity"
value="1"
min="1">

<label>Unit Price (£)</label>

<input
type="number"
class="itemPrice"
value="0.00"
step="0.01">

<label>Item Total (£)</label>

<input
type="number"
class="itemTotal"
value="0.00"
readonly>

<label>Size</label>

<input
type="text"
class="itemSize">

<label>Colour / Theme</label>

<input
type="text"
class="itemColour">

<label>Personalised?</label>

<select class="itemPersonalised">

<option>No</option>

<option>Yes</option>

</select>

<div
class="personalisationBox"
style="display:none;">

<label>Personalisation</label>

<textarea
class="itemPersonalisation"></textarea>

</div>

<button
type="button"
class="removeItemButton">

🗑 Remove Item

</button>

`;

    itemsContainer.appendChild(card);

    setupItem(card);

    calculateTotal();

}

function setupItem(card){

    const qty =
    card.querySelector(".itemQuantity");

    const price =
    card.querySelector(".itemPrice");

    const personalised =
    card.querySelector(".itemPersonalised");

    const box =
    card.querySelector(".personalisationBox");

    qty.addEventListener(
        "input",
        calculateTotal
    );

    price.addEventListener(
        "input",
        calculateTotal
    );

    personalised.addEventListener(
        "change",
        ()=>{

            box.style.display =
            personalised.value==="Yes"
            ? "block"
            : "none";

        }
    );

    card
    .querySelector(".removeItemButton")
    .addEventListener("click",()=>{

        if(document.querySelectorAll(".itemCard").length===1){

            alert("At least one item is required.");

            return;

        }

        card.remove();

        calculateTotal();

    });

}

function calculateTotal(){

    let total = 0;

    document
    .querySelectorAll(".itemCard")
    .forEach(card=>{

        const qty =
        Number(card.querySelector(".itemQuantity").value) || 0;

        const price =
        Number(card.querySelector(".itemPrice").value) || 0;

        const itemTotal =
        qty * price;

        card.querySelector(".itemTotal").value =
        itemTotal.toFixed(2);

        total += itemTotal;

    });

    orderTotal.value =
    total.toFixed(2);

    remainingBalance.value =
    (
        total -
        Number(totalPaid.value)
    ).toFixed(2);

}

// =====================================
// SAVE CHANGES
// =====================================

saveChangesButton.addEventListener(
    "click",
    saveChanges
);

async function saveChanges(){

    const items = [];

    document
    .querySelectorAll(".itemCard")
    .forEach(card=>{

        items.push({

            product:
            card.querySelector(".itemProduct").value,

            quantity:
            Number(card.querySelector(".itemQuantity").value),

            unitPrice:
            Number(card.querySelector(".itemPrice").value),

            itemTotal:
            Number(card.querySelector(".itemTotal").value),

            size:
            card.querySelector(".itemSize").value,

            colour:
            card.querySelector(".itemColour").value,

            personalised:
            card.querySelector(".itemPersonalised").value,

            personalisation:
            card.querySelector(".itemPersonalisation").value

        });

    });

    try{

        await updateDoc(

            doc(db,"orders",orderId),

            {

                customerName:
                customerName.value,

                customerContact:
                customerContact.value,

                orderSource:
                orderSource.value,

                socialUsername:
                socialUsername.value,

                orderNumber:
                orderNumber.value,

                orderDate:
                orderDate.value,

                dateNeeded:
                dateNeeded.value,

                orderNotes:
                orderNotes.value,

                orderTotal:
                Number(orderTotal.value),

                paymentStatus:
                paymentStatus.value,

                totalPaid:
                Number(totalPaid.value),

                remainingBalance:
                Number(remainingBalance.value),

                deliveryMethod:
                deliveryMethod.value,

                address1:
                address1.value,

                address2:
                address2.value,

                town:
                town.value,

                county:
                county.value,

                postcode:
                postcode.value,

                orderStatus:
                orderStatus.value,

                items:
                items,

                payments:
                payments,

                updatedAt:
                serverTimestamp()

            }

        );

        alert("✅ Order updated successfully!");

        window.location.href =
        "orders.html";

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}
