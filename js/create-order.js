// =====================================
// CREATE ORDER
// Me To You Designs
// =====================================

"use strict";

// =====================================
// STORAGE
// =====================================

let orders =
JSON.parse(
localStorage.getItem("orders")
) || [];

// =====================================
// ORDER NUMBER
// =====================================

const orderNumber =
document.getElementById("orderNumber");

let nextOrderNumber =
Number(
localStorage.getItem("nextOrderNumber")
) || 1;

if(orderNumber){

orderNumber.value =
"MTYD-" +
String(nextOrderNumber).padStart(4,"0");

}

// =====================================
// ORDER DATE
// =====================================

const orderDate =
document.getElementById("orderDate");

if(orderDate){

orderDate.value =
new Date()
.toISOString()
.split("T")[0];

}

console.log("Create Order Loaded");

// =====================================
// ITEMS
// =====================================

const itemsContainer =
document.getElementById("itemsContainer");

const addItemButton =
document.getElementById("addItemButton");

if(addItemButton){

    addItemButton.addEventListener(
        "click",
        addItem
    );

}

function addItem(){

    const item =
    document.createElement("div");

    item.className = "itemCard";

    item.innerHTML = `

<label>

Product / Item

</label>

<input
type="text"
class="itemName"
placeholder="Example: Balloon Stack">

<label>

Quantity

</label>

<input
type="number"
class="itemQuantity"
value="1"
min="1">

<label>

Unit Price (£)

</label>

<input
type="number"
class="itemPrice"
value="0"
step="0.01">

<label>

Item Total (£)

</label>

<input
type="number"
class="itemTotal"
value="0.00"
readonly>

<label>

Description / Theme

</label>

<textarea
class="itemDescription"
placeholder="Colours, wording, theme, etc."></textarea>

<button
type="button"
class="removeItemButton">

🗑 Remove Item

</button>

`;

    itemsContainer.appendChild(item);

    setupItem(item);

}

document
.querySelectorAll(".itemCard")
.forEach(setupItem);

function setupItem(item){

    const quantity =
    item.querySelector(".itemQuantity");

    const price =
    item.querySelector(".itemPrice");

    const total =
    item.querySelector(".itemTotal");

    function calculate(){

        total.value = (

            Number(quantity.value) *

            Number(price.value)

        ).toFixed(2);

        calculateOrderTotal();

    }

    quantity.addEventListener(
        "input",
        calculate
    );

    price.addEventListener(
        "input",
        calculate
    );

    calculate();

    item
    .querySelector(".removeItemButton")
    .addEventListener(
        "click",
        ()=>{

            if(
                document.querySelectorAll(".itemCard").length===1
            ){

                alert(
                    "At least one item is required."
                );

                return;

            }

            item.remove();

            calculateOrderTotal();

        }
    );

}

// =====================================
// ORDER TOTAL
// =====================================

function calculateOrderTotal(){

    let total = 0;

    document
    .querySelectorAll(".itemTotal")
    .forEach(item=>{

        total += Number(item.value);

    });

    document
    .getElementById("orderTotal")
    .value = total.toFixed(2);

}

// =====================================
// PAYMENTS
// =====================================

let payments = [];

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

if(addPaymentButton){

    addPaymentButton.addEventListener(
        "click",
        addPayment
    );

}

function addPayment(){

    const amount = Number(
        prompt("Payment amount (£):")
    );

    if(isNaN(amount) || amount <= 0){
        return;
    }

    payments.push(amount);

    const paid = payments.reduce((a,b)=>a+b,0);

    totalPaid.value = paid.toFixed(2);

    const orderTotal =
        Number(document.getElementById("orderTotal").value);

    remainingBalance.value =
        (orderTotal - paid).toFixed(2);

    if(paid <= 0){
        paymentStatus.value = "Not Paid";
    }else if(paid < orderTotal){
        paymentStatus.value = "Part Paid";
    }else{
        paymentStatus.value = "Paid";
    }

    paymentHistory.innerHTML =
        payments.map((p,i)=>
            `<p>Payment ${i+1}: £${p.toFixed(2)}</p>`
        ).join("");

}

// =====================================
// SAVE ORDER
// =====================================

const saveOrderButton =
document.getElementById("saveOrderButton");

if(saveOrderButton){

    saveOrderButton.addEventListener(
        "click",
        saveOrder
    );

}

function saveOrder(){

    const order = {

        orderNumber:
        orderNumber.value,

        orderDate:
        document.getElementById("orderDate").value,

        dateNeeded:
        document.getElementById("dateNeeded").value,

        customerName:
        document.getElementById("customerName").value,

        customerPhone:
        document.getElementById("customerPhone").value,

        customerEmail:
        document.getElementById("customerEmail").value,

        orderSource:
        document.getElementById("orderSource").value,

        socialUsername:
        document.getElementById("socialUsername").value,

        deliveryMethod:
        document.getElementById("deliveryMethod").value,

        address1:
        document.getElementById("address1").value,

        address2:
        document.getElementById("address2").value,

        town:
        document.getElementById("town").value,

        county:
        document.getElementById("county").value,

        postcode:
        document.getElementById("postcode").value,

        notes:
        document.getElementById("orderNotes").value,

        total:
        document.getElementById("orderTotal").value,

        paid:
        document.getElementById("totalPaid").value,

        balance:
        document.getElementById("remainingBalance").value,

        paymentStatus:
        document.getElementById("paymentStatus").value,

        status:
        document.getElementById("orderStatus").value,

        items:[],

        payments:payments

    };

    document
    .querySelectorAll(".itemCard")
    .forEach(item=>{

        order.items.push({

            product:
            item.querySelector(".itemName").value,

            quantity:
            item.querySelector(".itemQuantity").value,

            price:
            item.querySelector(".itemPrice").value,

            total:
            item.querySelector(".itemTotal").value,

            description:
            item.querySelector(".itemDescription").value

        });

    });

    orders.push(order);

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

    localStorage.setItem(
        "nextOrderNumber",
        nextOrderNumber + 1
    );

    alert(

        "Order saved successfully 💗"

    );

    window.location.href =
    "orders.html";

}

// =====================================
// VALIDATION
// =====================================

function validateOrder(){

    if(
        document
        .getElementById("customerName")
        .value
        .trim() === ""
    ){

        alert("Please enter the customer's name.");

        return false;

    }

    if(
        document
        .getElementById("dateNeeded")
        .value === ""
    ){

        alert("Please choose the date needed.");

        return false;

    }

    const firstItem =
    document.querySelector(".itemName");

    if(
        !firstItem ||
        firstItem.value.trim() === ""
    ){

        alert("Please enter at least one product.");

        return false;

    }

    return true;

}

// =====================================
// OVERRIDE SAVE BUTTON
// =====================================

if(saveOrderButton){

    saveOrderButton.onclick = function(){

        if(!validateOrder()){

            return;

        }

        saveOrder();

    };

}

console.log("Create Order Ready");
