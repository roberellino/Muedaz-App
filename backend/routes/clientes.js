const express = require('express');
const router = express.Router();
const Cliente = require('../models/cliente');

// Crear un cliente
router.post('/', async (req, res) => {
    try {
        const cliente = new Cliente(req.body);
        await cliente.save();
        res.status(201).send(cliente);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Obtener todos los clientes
router.get('/', async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.status(200).send(clientes);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Obtener un cliente por ID
router.get('/:id', async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id);
        if (!cliente) return res.status(404).send();
        res.status(200).send(cliente);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Eliminar un cliente
router.delete('/:id', async (req, res) => {
    try {
        const cliente = await Cliente.findByIdAndDelete(req.params.id);
        if (!cliente) return res.status(404).send();
        res.status(200).send(cliente);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Actualizar un cliente
router.put('/:id', async (req, res) => {
    try {
        const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!cliente) return res.status(404).send();
        res.status(200).send(cliente);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;

