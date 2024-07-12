// firebaseAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require('./appmuedaz-firebase-adminsdk-w5t8f-5665b8b38f.json'); // Archivo JSON descargado desde Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://console.firebase.google.com/project/appmuedaz/firestore/databases/-default-/data/~2F?hl=es"
});

const db = admin.firestore();

module.exports = { db, admin };
