const express = require('express');
const router = express.Router();
const { db, admin } = require('../firebaseAdmin');
const moment = require('moment');

// Ruta para obtener todos los remitos
router.get('/', async (req, res) => {
    try {
        const remitosSnapshot = await db.collection('remitos').get();
        const remitos = [];

        remitosSnapshot.forEach(doc => {
            const data = doc.data();
            // Asegúrate de que 'createdAt' sea un tipo Date
            if (data.createdAt && data.createdAt.toDate) {
                data.createdAt = data.createdAt.toDate();
            } else if (data.createdAt && !(data.createdAt instanceof Date)) {
                data.createdAt = new Date(data.createdAt);
            }
            remitos.push({
                id: doc.id,
                ...data
            });
        });

        console.log("Remitos obtenidos del backend:", remitos);

        res.status(200).send(remitos);
    } catch (error) {
        console.error('Error al obtener los remitos:', error);
        res.status(500).send('Error al obtener los remitos');
    }
});

// Ruta para crear un remito
router.post('/', async (req, res) => {
    try {
        const { cliente, productos, total, fecha } = req.body;

        // Validar que los datos requeridos están presentes
        if (!cliente || !productos || productos.length === 0 || total === undefined) {
            return res.status(400).json({ error: 'Datos incompletos para crear un remito' });
        }

        // Procesar y guardar el remito en Firestore
        const nuevoRemitoRef = await db.collection('remitos').add({
            cliente,
            productos,
            total,
            createdAt: fecha ? new Date(fecha) : admin.firestore.FieldValue.serverTimestamp() // Usar la fecha proporcionada o la actual
        });

        res.status(201).json({ id: nuevoRemitoRef.id });
    } catch (error) {
        console.error('Error al crear el remito:', error);
        res.status(500).json({ error: 'Error del servidor al crear el remito' });
    }
});

// Ruta para eliminar un remito por ID
router.delete('/:id', async (req, res) => {
    try {
        const remitoRef = db.collection('remitos').doc(req.params.id);
        const remito = await remitoRef.get();

        if (!remito.exists) {
            return res.status(404).send({ message: 'Remito no encontrado' });
        }

        await remitoRef.delete();

        res.status(200).send({ message: 'Remito eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el remito:', error);
        res.status(500).send({ message: 'Error al eliminar el remito' });
    }
});

// Ruta para eliminar remitos de un día específico
router.delete('/fecha/:fecha', async (req, res) => {
    const fecha = req.params.fecha;

    try {
        // Convertir la fecha a un rango de fechas para eliminar los remitos del día
        const startOfDay = moment(fecha).startOf('day').toDate();
        const endOfDay = moment(fecha).endOf('day').toDate();

        // Consultar y eliminar los remitos dentro del rango de fechas
        const remitosSnapshot = await db.collection('remitos').where('createdAt', '>=', startOfDay).where('createdAt', '<', endOfDay).get();
        const batch = db.batch();

        remitosSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });

        await batch.commit();

        if (remitosSnapshot.empty) {
            return res.status(404).json({ message: 'No se encontraron remitos para eliminar en esa fecha' });
        }

        res.status(200).json({ message: 'Remitos eliminados exitosamente' });
    } catch (error) {
        console.error('Error eliminando los remitos diarios:', error);
        res.status(500).json({ message: 'Error al eliminar los remitos' });
    }
});

module.exports = router;
