import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const ActualizarProductoForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [producto, setProducto] = useState({ identificador: '', nombre: '', precio: '' });

    useEffect(() => {
        const fetchProducto = async () => {
            const result = await axios.get(`http://localhost:5000/api/productos/${id}`);
            setProducto(result.data);
        };
        fetchProducto();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProducto({ ...producto, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/productos/${id}`, producto);
            alert("Producto actualizado correctamente");
            navigate('/productos');
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
            <Button variant="primary" type="submit">Actualizar Producto</Button>
        </Form>
    );
};

export default ActualizarProductoForm;

