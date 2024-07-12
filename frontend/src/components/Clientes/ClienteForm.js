import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

const ClienteForm = () => {
    const [cliente, setCliente] = useState({ idCliente: '', nombre: '', cuil: '', direccion: '', zona: '', telefono: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCliente({ ...cliente, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/clientes', cliente);
            alert('Cliente agregado correctamente');
            setCliente({ idCliente: '', nombre: '', cuil: '', direccion: '', zona: '', telefono: '' });
        } catch (error) {
            console.error('Error al agregar cliente:', error);
            alert('Ocurrió un error al agregar el cliente');
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
            <Button variant="primary" type="submit">Crear Cliente</Button>
        </Form>
    );
};

export default ClienteForm;
