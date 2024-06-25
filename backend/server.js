const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const clientesRouter = require('./routes/clientes');
const productosRouter = require('./routes/productos');
const remitosRouter = require('./routes/remitos');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/remitos', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


app.use('/api/clientes', clientesRouter);
app.use('/api/productos', productosRouter);
app.use('/api/remitos', remitosRouter);