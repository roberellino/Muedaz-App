const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');

// Crear un producto
router.post('/', async (req, res) => {
    try {
        const producto = new Producto(req.body);
        await producto.save();
        res.status(201).send(producto);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.status(200).send(productos);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) return res.status(404).send();
        res.status(200).send(producto);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Obtener un producto por identificador
router.get('/identificador/:identificador', async (req, res) => {
    try {
        const identificador = req.params.identificador;
        const producto = await Producto.findOne({ identificador });

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json(producto);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Eliminar un producto
router.delete('/:id', async (req, res) => {
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);
        if (!producto) return res.status(404).send();
        res.status(200).send(producto);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Actualizar un producto
router.put('/:id', async (req, res) => {
    try {
        const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!producto) return res.status(404).send();
        res.status(200).send(producto);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
