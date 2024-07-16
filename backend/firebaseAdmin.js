// firebaseAdmin.js
const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://console.firebase.google.com/project/appmuedaz/firestore/databases/-default-/data/~2F?hl=es"
});

const db = admin.firestore();

module.exports = { db, admin };
