const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productoSchema = new Schema({
    identificador: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    precio: { type: Number, required: true }
});

module.exports = mongoose.model('Producto', productoSchema);
