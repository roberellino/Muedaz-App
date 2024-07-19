import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const apiUrl = process.env.REACT_APP_API_URL;

const ActualizarProductoForm = () => {
    const { id } = useParams(); // Asegúrate de que 'id' coincida con el parámetro de la URL
    const navigate = useNavigate();
    const [producto, setProducto] = useState({ identificador: '', nombre: '', precio: '' });

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const result = await axios.get(`${apiUrl}/api/productos/${id}`);
                setProducto(result.data.data); // Asigna los datos del producto correctamente
            } catch (error) {
                console.error('Error al obtener el producto:', error);
            }
        };
        fetchProducto();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProducto(prevProducto => ({
            ...prevProducto,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${apiUrl}/api/productos/${id}`, producto); // Asegúrate de que 'id' esté definido correctamente aquí
            alert("Producto actualizado correctamente");
            navigate('/productos');
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            alert("Error al actualizar el producto");
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
                <Form.Control name="precio" value={producto.precio} onChange={handleChange} placeholder="Precio" required />
            </Form.Group>
            <Button variant="primary" type="submit">Actualizar Producto</Button>
        </Form>
    );
};

export default ActualizarProductoForm;
