import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { FaPrint, FaThList, FaTrash } from 'react-icons/fa';
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import "moment/locale/es";

moment.locale("es"); // Configurar moment para usar español

const RemitosList = () => {
  const [remitos, setRemitos] = useState([]);
  const [filteredRemitos, setFilteredRemitos] = useState([]);
  const [searchMonthYear, setSearchMonthYear] = useState("");

  useEffect(() => {
    const fetchRemitos = async () => {
      try {
        const result = await axios.get("http://localhost:5000/api/remitos");
        // Convertir todas las fechas a objetos de fecha válidos
        const remitosWithValidDates = result.data.map((remito) => ({
          ...remito,
          fecha: new Date(remito.createdAt),
        }));
        setRemitos(remitosWithValidDates);
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
    return moment(date).format("LL"); // Formato legible en español: ej. 14 de junio de 2024
  };

  const handlePrint = (remito) => {
    const doc = new jsPDF();
    doc.text("Remito", 20, 20);
    doc.text(`ID: ${remito._id}`, 20, 30);
    doc.text(`Cliente: ${remito.cliente.nombre}`, 20, 40);
    doc.text("Productos:", 20, 50);

    const productos = remito.productos.map((item) => [
      item.producto.nombre,
      item.cantidad,
      item.producto.precio,
      item.cantidad * item.producto.precio,
    ]);

    doc.autoTable({
      head: [["Producto", "Cantidad", "Precio Unitario", "Total"]],
      body: productos,
      startY: 60,
    });

    doc.text(`Total: $${remito.total}`, 20, doc.previousAutoTable.finalY + 10);
    doc.text(
      `Fecha: ${formatDate(remito.createdAt)}`,
      20,
      doc.previousAutoTable.finalY + 20
    );

    doc.save(`remito_${remito._id}.pdf`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este remito?")) {
      try {
        await axios.delete(`http://localhost:5000/api/remitos/${id}`);
        setRemitos(remitos.filter((remito) => remito._id !== id));
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
            <Card.Header className="card-header-custom">
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
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRemitos.length > 0 ? (
                    filteredRemitos.map((remito) => (
                      <tr key={remito._id}>
                        <td>{remito._id}</td>
                        <td>{remito.cliente.nombre}</td>
                        <td>{formatDate(remito.fecha)}</td>
                        <td>
                          $
                          {remito.productos.reduce(
                            (total, item) =>
                              total + item.cantidad * item.producto.precio,
                            0
                          )}
                        </td>
                        <td>
                          <Button
                            className="button-custom"
                            onClick={() => handlePrint(remito)}
                          >
                            <FaPrint className="icon" /> Imprimir
                          </Button>
                          <Button
                            className="button-custom button-custom-danger sm-2"
                            onClick={() => handleDelete(remito._id)}
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
