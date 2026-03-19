// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQ2gwuJoe2si8xYfhB6n9mESfSon4zRq8",
  authDomain: "ourweddingdayhub.firebaseapp.com",
  projectId: "ourweddingdayhub",
  storageBucket: "ourweddingdayhub.firebasestorage.app",
  messagingSenderId: "221957124766",
  appId: "1:221957124766:web:83b7ba2351c1ad656e018f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, createUserWithEmailAndPassword, doc, setDoc };
