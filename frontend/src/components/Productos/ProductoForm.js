import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';

const apiUrl = process.env.REACT_APP_API_URL;

const ProductoForm = () => {
    const [producto, setProducto] = useState({ identificador: '', nombre: '', precio: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProducto({ ...producto, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${apiUrl}/api/productos`, producto);
            alert('Producto agregado correctamente');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>Identificador</Form.Label>
                <Form.Control name="identificador" value={producto.identificador} onChange={handleChange} placeholder="Identificador" required />
            </Form.Group>
            <Form.Group>
                <Form.Label>Nombre</Form.Label>
                <Form.Control name="nombre" value={producto.nombre} onChange={handleChange} placeholder="Nombre" required />
            </Form.Group>
            <Form.Group>
                <Form.Label>Precio</Form.Label>
                <Form.Control type="number" name="precio" value={producto.precio} onChange={handleChange} placeholder="Precio" required />
            </Form.Group>
            <Button variant="primary" type="submit">Crear Producto</Button>
        </Form>
    );
};

export default ProductoForm;

