// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
    apiKey: "AIzaSyDSrDGesH8rfLMWpOPwn4EqaA77TQct4rA",
    authDomain: "rentalapp-b93c4.firebaseapp.com",
    databaseURL: "https://rentalapp-b93c4-default-rtdb.firebaseio.com",
    projectId: "rentalapp-b93c4",
    storageBucket: "rentalapp-b93c4.appspot.com",
    messagingSenderId: "257935864070",
    appId: "1:257935864070:web:fb9db8f1c71f88fbc3ae87",
    measurementId: "G-FFZ05GMSL0"
};

const appFire = initializeApp(firebaseConfig);
const auth = getAuth(appFire);
const firestore = getFirestore(appFire);
const functions = getFunctions(appFire);

setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error('Failed to set persistence:', error);
});

export { firebaseConfig, appFire, auth, firestore, functions, signInWithEmailAndPassword, createUserWithEmailAndPassword };
