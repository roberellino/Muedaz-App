const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Inicializar Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  databaseURL: "https://console.firebase.google.com/project/appmuedaz/firestore/databases/-default-/data/~2F?hl=es"
});

const db = admin.firestore();

// Middleware para verificar la conexión a Firestore
const collectionsToCheck = ['clientes', 'productos', 'remitos', 'auth'];
Promise.all(collectionsToCheck.map(collection => db.collection(collection).get()))
  .then(() => {
    console.log('Connected to Firestore');
  })
  .catch(error => {
    console.error('Error connecting to Firestore:', error);
    process.exit(1); // Salir del proceso si no se puede conectar a Firestore
  });

// Rutas
const clientesRouter = require('./routes/clientes');
const productosRouter = require('./routes/productos');
const remitosRouter = require('./routes/remitos');
const authRoutes = require('./routes/auth');

app.use('/api/clientes', clientesRouter);
app.use('/api/productos', productosRouter);
app.use('/api/remitos', remitosRouter);
app.use('/api/auth', authRoutes);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
