const mongoose = require('mongoose');

const RemitoSchema = new mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true,
    },
    productos: [
        {
            producto: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Producto',
                required: true,
            },
            cantidad: {
                type: Number,
                required: true,
                min: 1,
            },
        },
    ],
    total: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Remito = mongoose.model('Remito', RemitoSchema);

module.exports = Remito;
