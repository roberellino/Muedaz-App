const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clienteSchema = new Schema({
    idCliente: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    telefono: { type: String, required: true },
    email: { type: String, required: true }
});

module.exports = mongoose.model('Cliente', clienteSchema);
