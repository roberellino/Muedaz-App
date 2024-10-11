import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { FaPrint, FaThList, FaTrash } from 'react-icons/fa';
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import "moment/locale/es";

const apiUrl = process.env.REACT_APP_API_URL;

moment.locale("es"); // Configurar moment para usar español

const RemitosList = () => {
  const [remitos, setRemitos] = useState([]);
  const [filteredRemitos, setFilteredRemitos] = useState([]);
  const [searchMonthYear, setSearchMonthYear] = useState("");
  const [clientes, setClientes] = useState({});

  useEffect(() => {
    const fetchRemitos = async () => {
      try {
        const result = await axios.get(`${apiUrl}/api/remitos`);

        // Convertir todas las fechas a objetos de fecha válidos
        const remitosWithValidDates = result.data.map((remito) => {
          let fecha = null;
          if (remito.createdAt) {
            if (remito.createdAt.seconds) {
              fecha = new Date(remito.createdAt.seconds * 1000);
            } else if (remito.createdAt._seconds) {
              fecha = new Date(remito.createdAt._seconds * 1000);
            } else {
              fecha = new Date(remito.createdAt);
            }
          }
          return {
            ...remito,
            fecha
          };
        });

        // Obtener nombres de clientes
        const clienteIds = [...new Set(remitosWithValidDates.map(remito => remito.cliente))];
        const clientesData = await Promise.all(clienteIds.map(async id => {
          try {
            const cliente = await axios.get(`${apiUrl}/api/clientes/${id}`);
            return { idCliente: cliente.data.data.idCliente,
                    nombre: cliente.data.data.nombre,
                    telefono: cliente.data.data.telefono,  // Asegúrate de que el dato exista en la respuesta
                    direccion: cliente.data.data.direccion // Asegúrate de que el dato exista en la respuesta
                   };
          } catch (error) {
            console.error(`Error al obtener datos del cliente ${id}:`, error);
            return { idCliente: "Desconocido", nombre: "Desconocido", telefono: "Desconocido", direccion: "Desconocido" }; // Manejo de errores
          }
        }));
        const clientesMap = clientesData.reduce((acc, cliente) => ({
          ...acc, 
            [cliente.id]: cliente
        }), {});
        
        setRemitos(remitosWithValidDates);
        setClientes(clientesMap);
      } catch (error) {
        console.error("Error al obtener los remitos:", error);
      }
    };

    fetchRemitos();
  }, []);

  useEffect(() => {
    if (!searchMonthYear) {
      setFilteredRemitos(remitos);
    } else {
      const [year, month] = searchMonthYear.split("-").map(Number);
      const filtered = remitos.filter((remito) => {
        if (!remito.fecha) return false;
        const remitoDate = new Date(remito.fecha);
        return (
          remitoDate.getMonth() + 1 === month &&
          remitoDate.getFullYear() === year
        );
      });
      setFilteredRemitos(filtered);
    }
  }, [searchMonthYear, remitos]);

  const formatDate = (date) => {
    return moment(date).format("LL");
  };

  // Función para obtener los detalles del producto
const fetchProductoDetails = async (productoId) => {
  try {
    const result = await axios.get(`${apiUrl}/api/productos/${productoId}`);
    return result.data.data; // Asegúrate de que esta es la estructura correcta de los datos
  } catch (error) {
    console.error(`Error al obtener datos del producto ${productoId}:`, error);
    return null;
  }
};

const handlePrint = async (remito) => {
  
const fechaFormatted = moment(remito.createdAt).format("DD/MM/YYYY");
  const productoDetails = await Promise.all(remito.productos.map(async (item) => {
    const details = await fetchProductoDetails(item.producto);
    return {
      ...item,
      productoDetails: details,
    };
  }));

  const doc = new jsPDF();
  //doc.text(`${clientes[remito.cliente]} (${remito.cliente.idCliente})`, 15, 25);
  //doc.text(`${fechaFormatted}`, 15, 35);
  //doc.text(`${remito.cliente.telefono}     ${remito.cliente.direccion}`, 15, 40);
 const clienteData = clientes[remito.cliente] || { nombre: "Desconocido", telefono: "", direccion: "" };
doc.text(`${clienteData.nombre} (${clienteData.idCliente})`, 15, 25);
doc.text(`${fechaFormatted}`, 15, 35);
doc.text(`${clienteData.telefono || "Teléfono no disponible"}     ${clienteData.direccion || "Dirección no disponible"}`, 15, 38);

  
  const productos = productoDetails.map((item) => [
    item.productoDetails?.nombre || "Nombre no encontrado",
    item.cantidad || 0,
    item.productoDetails?.precio || 0,
    item.cantidad * (item.productoDetails?.precio || 0),
  ]);

   // Tabla con estilo reducido
  doc.autoTable({
    head: [["Producto", "Cantidad", "Precio Unitario", "Total"]],
    body: productos,
    startY: 45,
    theme: 'grid', // Mantiene las líneas divisorias
    headStyles: {
      fillColor: [255, 255, 255], // Fondo blanco para el encabezado
      textColor: [0, 0, 0], // Texto negro
      lineWidth: 0.5, // Grosor de las líneas
      lineColor: [0, 0, 0], // Color de las líneas
      fontSize: 8, // Tamaño de fuente reducido en el encabezado
    },
    bodyStyles: {
      textColor: [0, 0, 0], // Texto negro en el cuerpo
      lineWidth: 0.5, // Grosor de las líneas
      lineColor: [0, 0, 0], // Color de las líneas
      fontSize: 8, // Tamaño de fuente reducido en el cuerpo
    },
    styles: {
      cellPadding: 2, // Espaciado reducido en las celdas
    },
  });

  doc.text(`Total: $${remito.total}`, 150, doc.previousAutoTable.finalY + 10);


  doc.save(`remito_${remito.id}.pdf`);
};


  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este remito?")) {
      try {
        await axios.delete(`${apiUrl}/api/remitos/${id}`);
        setRemitos(remitos.filter((remito) => remito.id !== id));
        alert("Remito eliminado correctamente");
      } catch (error) {
        console.error("Error al eliminar el remito:", error);
      }
    }
  };

  const handleSearchMonthYearChange = (e) => {
    setSearchMonthYear(e.target.value);
  };

  return (
    <Container className="container-custom">
      <Row className="my-4">
        <Col>
          <Card>
            <Card.Header style={{backgroundColor:"#1a1a1a", color:"#ffff"}}
             className="card-header-custom">
              <h2>Lista de Remitos <FaThList /></h2>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group controlId="searchMonthYear">
                  <Form.Label className="form-label-custom">Buscar por Mes y Año:</Form.Label>
                  <Form.Control
                    type="month"
                    value={searchMonthYear}
                    onChange={handleSearchMonthYearChange}
                    className="form-control-custom"
                  />
                </Form.Group>
              </Form>
              <Table striped bordered hover responsive className="mt-3 table-custom">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRemitos.length > 0 ? (
                    filteredRemitos.map((remito) => (
                      <tr key={remito.id}>
                        <td>
                          {clientes[remito.cliente] || "Cliente no encontrado"}
                        </td>
                        <td>{formatDate(remito.fecha)}</td>
                        <td>
                          ${remito.total}
                        </td>
                        <td>
                          <Button
                            style={{backgroundColor:"#1a1a1a", color:"#ffff"}}
                            variant="light"
                            onClick={() => handlePrint(remito)}
                          >
                            <FaPrint className="icon" /> Imprimir
                          </Button>
                          <Button
                            style={{backgroundColor:"red", color:"#ffff"}}
                            variant="danger"
                            onClick={() => handleDelete(remito.id)}
                          >
                            <FaTrash className="icon" /> Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No hay remitos para el mes seleccionado
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RemitosList;
