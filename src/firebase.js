

// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyB20PDUsHFwQP4Hl_KBNNLgMgVspboilpE",
    authDomain: "ocation-sharing.firebaseapp.com",
    databaseURL: "https://ocation-sharing-default-rtdb.firebaseio.com",
    projectId: "ocation-sharing",
    storageBucket: "ocation-sharing.appspot.com",
    messagingSenderId: "636318725296",
    appId: "1:636318725296:web:66c9b973e3b1e806a6b775",
    measurementId: "G-FBTVT09LZ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
