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
