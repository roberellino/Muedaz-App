import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';

const ClienteForm = () => {
    const [cliente, setCliente] = useState({ idCliente: '', nombre: '', direccion: '', telefono: '', email: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCliente({ ...cliente, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/clientes', cliente);
            alert('Cliente agregado correctamente');
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
                <Form.Label>Dirección</Form.Label>
                <Form.Control name="direccion" value={cliente.direccion} onChange={handleChange} placeholder="Dirección" required />
            </Form.Group>
            <Form.Group>
                <Form.Label>Teléfono</Form.Label>
                <Form.Control name="telefono" value={cliente.telefono} onChange={handleChange} placeholder="Teléfono" required />
            </Form.Group>
            <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={cliente.email} onChange={handleChange} placeholder="Email" required />
            </Form.Group>
            <Button variant="primary" type="submit">Crear Cliente</Button>
        </Form>
    );
};

export default ClienteForm;

