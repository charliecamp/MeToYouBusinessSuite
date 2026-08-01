import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";
import {
getAuth,
GoogleAuthProvider,
signInWithPopup,
signOut
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";

const firebaseConfig = {
apiKey: "AIzaSyCO6e9VWwPV17lt7FKK052hlEdy-lmsOqk",
authDomain: "metoyoubusinesssuite.firebaseapp.com",
projectId: "metoyoubusinesssuite",
storageBucket: "metoyoubusinesssuite.firebasestorage.app",
messagingSenderId: "591235577638",
appId: "1:591235577638:web:1dec8dcfc23b2573f533e7"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

const loginButton =
document.getElementById("googleLoginButton");

const loginMessage =
document.getElementById("loginMessage");

loginButton.addEventListener("click", async ()=>{

try{

const result =
await signInWithPopup(auth,provider);

const user =
result.user;

if(
user.email ===
"metoyoudesigns@outlook.com"
){

window.location.href =
"dashboard.html";

}else{

await signOut(auth);

loginMessage.innerHTML =
"Access denied.";

}

}catch(error){

loginMessage.innerHTML =
error.message;

}

});
