import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const apiUrl = process.env.REACT_APP_API_URL;

const ActualizarClienteForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cliente, setCliente] = useState({
        idCliente: '',
        nombre: '',
        cuil: '',
        direccion: '',
        zona: '',
        telefono: ''
    });

    useEffect(() => {
        const fetchCliente = async () => {
            try {
                const result = await axios.get(`${apiUrl}/api/clientes/${id}`);
                setCliente(result.data.data); // Asumiendo que result.data tiene { id: ..., data: { idCliente, nombre, cuil, direccion, zona, telefono } }
            } catch (error) {
                console.error("Error al obtener el cliente:", error);
            }
        };
        fetchCliente();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCliente(prevCliente => ({
            ...prevCliente,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${apiUrl}/api/clientes/${id}`, cliente);
            alert("Cliente actualizado correctamente");
            navigate('/clientes');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>ID Cliente</Form.Label>
                <Form.Control name="idCliente" value={cliente.idCliente} onChange={handleChange} placeholder="ID Cliente" required />
            </Form.Group>
            <Form.Group>
                <Form.Label>Nombre</Form.Label>
                <Form.Control name="nombre" value={cliente.nombre} onChange={handleChange} placeholder="Nombre" required />
            </Form.Group>
            <Form.Group>
                <Form.Label>Cuil</Form.Label>
                <Form.Control name="cuil" value={cliente.cuil} onChange={handleChange} placeholder="Cuil" required />
            </Form.Group>
            <Form.Group>
                <Form.Label>Dirección</Form.Label>
                <Form.Control name="direccion" value={cliente.direccion} onChange={handleChange} placeholder="Dirección" required />
            </Form.Group>
            <Form.Group>
                <Form.Label>Zona</Form.Label>
                <Form.Control name="zona" value={cliente.zona} onChange={handleChange} placeholder="Zona" required />
            </Form.Group>
            <Form.Group>
                <Form.Label>Teléfono</Form.Label>
                <Form.Control name="telefono" value={cliente.telefono} onChange={handleChange} placeholder="Teléfono" required />
            </Form.Group>
            <Button variant="primary" type="submit">Actualizar Cliente</Button>
        </Form>
    );
};

export default ActualizarClienteForm;
