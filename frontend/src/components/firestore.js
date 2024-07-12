// Importa Firebase y Firestore
import firebase from 'firebase/app';
import 'firebase/firestore';

// Configura tu aplicación de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDlA-geCSdm-thWvw50hiklGZ4FBOwM1QA",
    authDomain: "appmuedaz.firebaseapp.com",
    projectId: "appmuedaz",
    storageBucket: "appmuedaz.appspot.com",
    messagingSenderId: "909392550048",
    appId: "1:909392550048:web:9b8e478542972dabbd51c5"
};

// Inicializa Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
// Obtén una instancia de Firestore
const db = firebase.firestore();

export { firebase, db };
