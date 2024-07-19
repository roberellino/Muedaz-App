// routes/productos.js

const express = require('express');
const router = express.Router();
const { db } = require('../firebaseAdmin');

// Crear un producto
router.post('/', async (req, res) => {
    try {
        // Obtener los datos del cuerpo de la solicitud
        const { identificador, nombre, precio } = req.body;

        // Crear un nuevo documento en la colección "productos"
        const nuevoProducto = await db.collection('productos').add({
            identificador:identificador,
            nombre: nombre,
            precio: precio
        });

        res.status(201).send({ id: nuevoProducto.id });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(400).send('Error al crear producto');
    }
});
router.get('/', async (req, res) => {
    try {
        const query = req.query.q; // Obtener el parámetro de consulta 'q'

        let productosSnapshot;

        if (query) {
            // Si hay un término de búsqueda 'q', filtrar los clientes por idCliente o nombre
            productosSnapshot = await db.collection('productos')
                .where('identificador', '>=', query) // Filtro por idCliente
                .where('identificador', '<=', query + '\uf8ff')
                .get();
            
            // Filtrar también por el campo 'nombre' (insensible a mayúsculas/minúsculas)
            const nombreLowerCase = query.toLowerCase();
            const productosPorNombreSnapshot = await db.collection('productos')
                .where('nombre', '>=', nombreLowerCase)
                .where('nombre', '<=', nombreLowerCase + '\uf8ff')
                .get();
            
            // Combinar los resultados de ambas consultas para evitar duplicados
            productosSnapshot = productosSnapshot.docs.concat(productosPorNombreSnapshot.docs);
        } else {
            // Si no hay término de búsqueda, obtener todos los clientes
            productosSnapshot = await db.collection('productos').get();
        }

        const productos = [];

        productosSnapshot.forEach(doc => {
            productos.push({
                id: doc.id,
                ...doc.data() // Incluir todos los datos del cliente
            });
        });

        res.status(200).send(productos);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(400).send('Error al obtener los productos');
    }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
    try {
        const productoRef = await db.collection('productos').doc(req.params.id).get();

        if (!productoRef.exists) {
            return res.status(404).send('Producto no encontrado');
        }

        res.status(200).send({
            id: productoRef.id,
            data: productoRef.data()
        });
    } catch (error) {
        console.error('Error al obtener producto por ID:', error);
        res.status(400).send('Error al obtener producto por ID');
    }
});

// Obtener un producto por identificador
router.get('/identificador/:identificador', async (req, res) => {
    try {
        const identificador = req.params.identificador;
        const productosRef = await db.collection('productos').where('identificador', '==', identificador).get();
        const productos = [];

        productosRef.forEach(doc => {
            productos.push({
                id: doc.id,
                data: doc.data()
            });
        });

        if (productos.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json(productos[0]); // Devuelve el primer producto encontrado (debería ser único por identificador)
    } catch (error) {
        console.error('Error al obtener producto por identificador:', error);
        res.status(400).json({ message: error.message });
    }
});

// Eliminar un producto
router.delete('/:id', async (req, res) => {
    try {
        const productoRef = db.collection('productos').doc(req.params.id);
        const producto = await productoRef.get();

        if (!producto.exists) {
            return res.status(404).send('Producto no encontrado');
        }

        await productoRef.delete();

        res.status(200).send({
            id: req.params.id,
            message: 'Producto eliminado correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(400).send('Error al eliminar producto');
    }
});

// Actualizar un producto
router.put('/:id', async (req, res) => {
    try {
        const productoRef = db.collection('productos').doc(req.params.id);
        const producto = await productoRef.get();

        if (!producto.exists) {
            return res.status(404).send('Producto no encontrado');
        }

        await productoRef.update(req.body);

        res.status(200).send({
            id: req.params.id,
            message: 'Producto actualizado correctamente'
        });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(400).send('Error al actualizar producto');
    }
});

module.exports = router;
