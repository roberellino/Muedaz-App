const express = require('express');
const router = express.Router();
const Remito = require('../models/Remito');

router.post('/', async (req, res) => {
    try {
        const remito = new Remito(req.body);
        await remito.save();
        res.status(201).send(remito);
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});

// Eliminar un remito por ID
router.delete('/:id', async (req, res) => {
    try {
        const remito = await Remito.findByIdAndDelete(req.params.id);
        if (!remito) {
            return res.status(404).send({ message: 'Remito no encontrado' });
        }
        res.status(200).send({ message: 'Remito eliminado correctamente' });
    } catch (error) {
        res.status(500).send({ message: 'Error al eliminar el remito' });
    }
});

module.exports = router;

router.get('/', async (req, res) => {
    try {
        const remitos = await Remito.find().populate('cliente').populate('productos.producto');
        res.send(remitos);
    } catch (error) {
        res.status(500).send(error);
    }
});


module.exports = router;

// Ruta para crear un remito
router.post('/', async (req, res) => {
    try {
        const { cliente, productos, total } = req.body;

        // Validar que los datos requeridos están presentes
        if (!cliente || !productos || productos.length === 0 || total === undefined) {
            return res.status(400).json({ error: 'Datos incompletos para crear un remito' });
        }

        const nuevoRemito = new Remito({
            cliente,
            productos,
            total
        });

        await nuevoRemito.save();
        res.status(201).json(nuevoRemito);
    } catch (error) {
        console.error('Error al crear el remito:', error);
        res.status(500).json({ error: 'Error del servidor al crear el remito' });
    }
});

module.exports = router;
