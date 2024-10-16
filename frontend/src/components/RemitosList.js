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
                 return { 
                id, 
                ...cliente.data.data 
              };
            } catch (error) {
            console.error(`Error al obtener datos del cliente ${id}:`, error);
            return { id, nombre: "Desconocido", direccion: "Desconocida", telefono: "Desconocido" }; 
          }
        }));
           // Mapea los clientes por ID
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
  
  const productoDetails = await Promise.all(remito.productos.map(async (item) => {
    const details = await fetchProductoDetails(item.producto);
    return {
      ...item,
      productoDetails: details,
    };
  }));
const doc = new jsPDF();
const fechaFormatted = moment(remito.createdAt).format("DD/MM/YYYY");
// Reducir el tamaño de fuente para el texto principal
    doc.setFontSize(14);
  
 //doc.text(`${clientes[remito.cliente]} ${clientes[remito.cliente.idCliente]}`, 15, 15);
  // Datos del cliente
  const clienteData = clientes[remito.cliente] || { nombre: "Desconocido", direccion: "Desconocida", telefono: "Desconocido" };
  doc.text(`${clienteData.nombre} (${clienteData.idCliente})`, 15, 15);
  doc.text(`${clienteData.direccion}`, 15, 25);
  doc.text(`${clienteData.telefono}`, 15, 35);
  
  doc.text(`${fechaFormatted}`, 180, 15, { align: 'right' });

  
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
      theme: 'grid',
      headStyles: {
        fillColor: [255, 255, 255], // Fondo blanco para el encabezado
        textColor: [0, 0, 0],       // Texto negro
        lineWidth: 0.1,             // Líneas delgadas
        lineColor: [0, 0, 0]        // Líneas negras
      },
      bodyStyles: {
        //fillColor: [255, 255, 255], // Fondo blanco para el cuerpo
        textColor: [0, 0, 0],       // Texto negro
        lineWidth: 0.1,             // Líneas delgadas
        lineColor: [0, 0, 0]        // Líneas negras
      },
    });
  doc.setFontSize(14); // Aseguramos que el total tenga un tamaño adecuado
  doc.text(`Total: $${remito.total}`, 150, doc.previousAutoTable.finalY + 10);


  doc.save(`remito_${remito.id}.pdf`);
};

const handlePrintAll = async () => {
  const doc = new jsPDF();

  for (let index = 0; index < filteredRemitos.length; index++) {
    const remito = filteredRemitos[index];

    // Obtener detalles de los productos para cada remito
    const productoDetails = await Promise.all(
      remito.productos.map(async (item) => {
        const details = await fetchProductoDetails(item.producto);
        return {
          ...item,
          productoDetails: details,
        };
      })
    );

    const fechaFormatted = moment(remito.createdAt).format("DD/MM/YYYY");

    doc.setFontSize(14);
    const clienteData = clientes[remito.cliente] || { nombre: "Desconocido", direccion: "Desconocida", telefono: "Desconocido" };
    doc.text(`${clienteData.nombre} (${clienteData.idCliente})`, 15, 15);
    doc.text(`${clienteData.direccion}`, 15, 25);
    doc.text(`${clienteData.telefono}`, 15, 35);

    doc.text(`${fechaFormatted}`, 180, 15, { align: 'right' });

    const productos = productoDetails.map((item) => [
      item.productoDetails?.nombre || "Nombre no encontrado",
      item.cantidad || 0,
      item.productoDetails?.precio || 0,
      item.cantidad * (item.productoDetails?.precio || 0),
    ]);

    // Tabla con los productos
    doc.autoTable({
      head: [["Producto", "Cantidad", "Precio Unitario", "Total"]],
      body: productos,
      startY: 45,
      theme: 'grid',
      headStyles: {
        fillColor: [255, 255, 255], // Fondo blanco para el encabezado
        textColor: [0, 0, 0],       // Texto negro
        lineWidth: 0.1,             // Líneas delgadas
        lineColor: [0, 0, 0]        // Líneas negras
      },
      bodyStyles: {
        textColor: [0, 0, 0],       // Texto negro
        lineWidth: 0.1,             // Líneas delgadas
        lineColor: [0, 0, 0]        // Líneas negras
      },
    });

    doc.setFontSize(14);
    doc.text(`Total: $${remito.total}`, 150, doc.previousAutoTable.finalY + 10);

    // Si no es el último remito, añadir una nueva página
    if (index < filteredRemitos.length - 1) {
      doc.addPage();
    }
  }

  doc.save("todos_los_remitos.pdf");
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
               <Button
                style={{ backgroundColor: "#1a1a1a", color: "#ffff", marginBottom: "15px" }}
                onClick={handlePrintAll}
              >
                <FaPrint /> Imprimir Todos
              </Button>
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
                            {clientes[remito.cliente]?.nombre || "Cliente no encontrado"}
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
