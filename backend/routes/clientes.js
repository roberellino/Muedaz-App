// routes/clientes.js

const express = require('express');
const router = express.Router();
const { db } = require('../firebaseAdmin');

// Crear un cliente
router.post('/', async (req, res) => {
    try {
        // Obtener los datos del cuerpo de la solicitud
        const { idCliente, nombre, cuil, direccion, zona, telefono } = req.body;

        // Crear un nuevo documento en la colección "clientes"
        const nuevoCliente = await db.collection('clientes').add({
            idCliente: idCliente,
            nombre: nombre,
            cuil: cuil,
            direccion: direccion,
            zona: zona,
            telefono: telefono
        });

        res.status(201).send({ id: nuevoCliente.id });
    } catch (error) {
        console.error('Error al crear cliente:', error);
        res.status(400).send('Error al crear cliente');
    }
});

// Obtener todos los clientes
// Obtener todos los clientes con filtrado opcional
router.get('/', async (req, res) => {
    try {
        const query = req.query.q; // Obtener el parámetro de consulta 'q'

        let clientesSnapshot;

        if (query) {
            // Si hay un término de búsqueda 'q', filtrar los clientes por idCliente o nombre
            clientesSnapshot = await db.collection('clientes')
                .where('idCliente', '>=', query) // Filtro por idCliente
                .where('idCliente', '<=', query + '\uf8ff')
                .get();
            
            // Filtrar también por el campo 'nombre' (insensible a mayúsculas/minúsculas)
            const nombreLowerCase = query.toLowerCase();
            const clientesPorNombreSnapshot = await db.collection('clientes')
                .where('nombre', '>=', nombreLowerCase)
                .where('nombre', '<=', nombreLowerCase + '\uf8ff')
                .get();
            
            // Combinar los resultados de ambas consultas para evitar duplicados
            clientesSnapshot = clientesSnapshot.docs.concat(clientesPorNombreSnapshot.docs);
        } else {
            // Si no hay término de búsqueda, obtener todos los clientes
            clientesSnapshot = await db.collection('clientes').get();
        }

        const clientes = [];

        clientesSnapshot.forEach(doc => {
            clientes.push({
                id: doc.id,
                ...doc.data() // Incluir todos los datos del cliente
            });
        });

        res.status(200).send(clientes);
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(400).send('Error al obtener clientes');
    }
});



// Obtener un cliente por ID
router.get('/:id', async (req, res) => {
    try {
        const clienteRef = await db.collection('clientes').doc(req.params.id).get();

        if (!clienteRef.exists) {
            return res.status(404).send('Cliente no encontrado');
        }

        res.status(200).send({
            id: clienteRef.id,
            data: clienteRef.data()
        });
    } catch (error) {
        console.error('Error al obtener cliente por ID:', error);
        res.status(400).send('Error al obtener cliente por ID');
    }
});

// Eliminar un cliente
router.delete('/:id', async (req, res) => {
    try {
        const clienteRef = db.collection('clientes').doc(req.params.id);
        const cliente = await clienteRef.get();

        if (!cliente.exists) {
            return res.status(404).send('Cliente no encontrado');
        }

        await clienteRef.delete();

        res.status(200).send({
            id: req.params.id,
            message: 'Cliente eliminado correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        res.status(400).send('Error al eliminar cliente');
    }
});

// Actualizar un cliente
router.put('/:id', async (req, res) => {
    try {
        const clienteRef = db.collection('clientes').doc(req.params.id);
        const cliente = await clienteRef.get();

        if (!cliente.exists) {
            return res.status(404).send('Cliente no encontrado');
        }

        await clienteRef.update(req.body);

        res.status(200).send({
            id: req.params.id,
            message: 'Cliente actualizado correctamente'
        });
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(400).send('Error al actualizar cliente');
    }
});

module.exports = router;
