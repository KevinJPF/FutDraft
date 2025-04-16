// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Substitua essas configurações pelas suas credenciais do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBOZBT9Xy2rn9FHjGakpIUmbWpbe2mAxeY",
  authDomain: "futebas-4f556.firebaseapp.com",
  projectId: "futebas-4f556",
  storageBucket: "futebas-4f556.firebasestorage.app",
  messagingSenderId: "826908035033",
  appId: "1:826908035033:web:73aecdee0e9d4b1a1a7bc8",
  measurementId: "G-2QE0YGXDX7"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
