// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
//getAuth for authentication, getFirestore for database, getStorage to store any uploaded file/image
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIiy1kfQ0J9yefnqaxvyKio1Wb-GyJWsU",
  authDomain: "jobsearchapp-165ef.firebaseapp.com",
  projectId: "jobsearchapp-165ef",
  storageBucket: "jobsearchapp-165ef.appspot.com",
  messagingSenderId: "208785290575",
  appId: "1:208785290575:web:ed2dd6644ed8fbc047013a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth =getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)