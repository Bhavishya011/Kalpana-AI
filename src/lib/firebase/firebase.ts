// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtb9b_QOnYyyvDDpkdiCUHC6e7A1FJMOE",
  authDomain: "kalpanaai-empowering-artisans.firebaseapp.com",
  projectId: "kalpanaai-empowering-artisans",
  storageBucket: "kalpanaai-empowering-artisans.firebasestorage.app",
  messagingSenderId: "786200976510",
  appId: "1:786200976510:web:d65dc24c07a7a2e3f6cc2f"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
