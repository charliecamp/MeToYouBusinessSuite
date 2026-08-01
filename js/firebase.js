import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";
import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCO6e9VWwPV17lt7FKK052hlEdy-lmsOqk",
  authDomain: "metoyoubusinesssuite.firebaseapp.com",
  projectId: "metoyoubusinesssuite",
  storageBucket: "metoyoubusinesssuite.firebasestorage.app",
  messagingSenderId: "591235577638",
  appId: "1:591235577638:web:1dec8dcfc23b2573f533e7"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
