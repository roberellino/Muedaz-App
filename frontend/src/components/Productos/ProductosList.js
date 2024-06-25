import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { IoMdRefresh } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { FaThList } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import '../../styles/Estiloslistas.css';

const ProductosList = () => {
    const [productos, setProductos] = useState([]);
    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState("");

    const handleSearch = (event) => {
        setBusqueda(event.target.value);
      };

      const filterProductosID = productos.filter((producto) =>
        producto.identificador.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );  

    useEffect(() => {
        const fetchProductos = async () => {
            const result = await axios.get('http://localhost:5000/api/productos');
            setProductos(result.data);
        };
        fetchProductos();
    }, []);

    const handleDelete = async (id) => {
        if (
            window.confirm("¿Estás seguro de que quieres eliminar este producto?")
          ) {
        try {
            await axios.delete(`http://localhost:5000/api/productos/${id}`);
            setProductos(productos.filter(producto => producto._id !== id));
            alert("Producto eliminado correctamente");
            navigate('/productos');
        } catch (error) {
            console.error(error);
            alert("Error al eliminar el artículo");
        }
    }
    };

    const handleUpdate = (id) => {
        navigate(`/productos/actualizar/${id}`);
    };

    const handleAdd = () => {
        navigate('/productos/nuevo');
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Lista de Productos <FaThList /></h2>
                <Button variant="success" className="btn-custom" onClick={handleAdd}><IoMdAddCircle />Agregar Producto</Button>
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
                        <th>Identificador</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filterProductosID.map(producto => (
                        <tr key={producto._id}>
                            <td>{producto.identificador}</td>
                            <td>{producto.nombre}</td>
                            <td>$ {producto.precio}</td>
                            <td>
                                <Button variant="primary" className="btn-custom" onClick={() => handleUpdate(producto._id)}><IoMdRefresh />Actualizar</Button>{' '}
                                <Button variant="danger" className="btn-custom" onClick={() => handleDelete(producto._id)}><MdDelete />Eliminar</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
};

export default ProductosList;


