import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa6";
import { IoMdRefresh } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import '../../styles/Estiloslistas.css';

const apiUrl = process.env.REACT_APP_API_URL;

const ClientesList = () => {
  const [clientes, setClientes] = useState([]);
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");

  const handleSearch = (event) => {
    setBusqueda(event.target.value);
  };

  useEffect(() => {
    const fetchClientes = async () => {
        try {
            const result = await axios.get(`${apiUrl}/api/clientes`, {
                params: {
                    q: busqueda // 'busqueda' es el estado donde guardas el término de búsqueda en tu componente React
                }
            });
            setClientes(result.data);
        } catch (error) {
            console.error("Error al obtener clientes:", error);
        }
    };
    fetchClientes();
}, [busqueda]); // Asegúrate de que se vuelva a llamar cuando cambie 'busqueda'

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este cliente?")) {
      try {
        await axios.delete(`${apiUrl}/api/clientes/${id}`);
        setClientes(clientes.filter((cliente) => cliente.id !== id));
      } catch (error) {
        console.error("Error al eliminar el cliente:", error);
        alert("Error al eliminar el cliente");
      }
    }
  };

  const handleUpdate = (id) => {
    navigate(`/clientes/actualizar/${id}`);
  };

  const handleAdd = () => {
    navigate("/clientes/nuevo");
  };

  const filterClientesID = clientes.filter((cliente) =>
    cliente.idCliente.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );
  

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Lista de Clientes <FaUserPlus /></h2>
        <Button variant="success" className="btn-custom" onClick={handleAdd}>
          <FaUserPlus /> Agregar Cliente
        </Button>
      </div>
      <input
        className="form-control shadow p-3 mb-5 bg-white rounded"
        style={{
          color: "#495057",
          backgroundColor: "#fff",
          borderColor: "#ced4da",
          padding: ".375rem .75rem",
          fontSize: "1rem",
          lineHeight: "1.5",
          borderRadius: ".25rem",
          transition:
            "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
        }}
        type="text"
        placeholder="Buscar..."
        onChange={handleSearch}
      />
      <Table striped bordered hover className="table-hover table-custom">
        <thead>
          <tr>
            <th>ID Cliente</th>
            <th>Nombre</th>
            <th>Cuil</th>
            <th>Dirección</th>
            <th>Zona</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
  {filterClientesID.length > 0 ? (
    filterClientesID.map((cliente) => (
      <tr key={cliente.id}>
        <td>{cliente.idCliente}</td>
        <td>{cliente.nombre}</td>
        <td>{cliente.cuil}</td>
        <td>{cliente.direccion}</td>
        <td>{cliente.zona}</td>
        <td>{cliente.telefono}</td>
        <td>
          <Button
            variant="primary"
            onClick={() => handleUpdate(cliente.id)}
            className="btn-custom align-items-center"
          >
            <IoMdRefresh /> Actualizar
          </Button>{" "}
          <Button
            variant="danger"
            onClick={() => handleDelete(cliente.id)}
            className="btn-custom align-items-center"
          >
            <MdDelete /> Eliminar
          </Button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7">No hay clientes para mostrar.</td>
    </tr>
  )}
</tbody>
      </Table>
    </>
  );
};

export default ClientesList;
