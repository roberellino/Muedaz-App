import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Container, Row, Col, Card, Table } from "react-bootstrap";
import Select from "react-select";
import jsPDF from "jspdf";
import moment from "moment";
import "moment/locale/es";
import { FaSave, FaPrint, FaTrashAlt, FaBox, FaUser } from "react-icons/fa";
import { FcMoneyTransfer } from "react-icons/fc";
import "../styles/RemitoForm.css";

const apiUrl = process.env.REACT_APP_API_URL;

const RemitoForm = () => {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [selectedProductos, setSelectedProductos] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalCantidad, setTotalCantidad] = useState(0);

  useEffect(() => {
    fetchClientes();
    fetchProductos();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/clientes`);
      setClientes(response.data);
    } catch (error) {
      console.error("Error fetching clientes:", error);
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/productos`);
      setProductos(response.data);
    } catch (error) {
      console.error("Error fetching productos:", error);
    }
  };

  useEffect(() => {
    if (selectedProductos.length > 0) {
      const newTotal = selectedProductos.reduce(
        (acc, item) => acc + item.producto.precio * item.cantidad,
        0
      );
      const newTotalCantidad = selectedProductos.reduce(
        (acc, item) => acc + item.cantidad,
        0
      );
      setTotal(newTotal);
      setTotalCantidad(newTotalCantidad);
    } else {
      setTotal(0);
      setTotalCantidad(0);
    }
  }, [selectedProductos]);

  const handleClienteChange = (option) => {
    setSelectedCliente(option);
  };

  const handleAddProducto = (producto) => {
    if (!selectedProductos.some((item) => item.producto.id === producto.id)) {
      setSelectedProductos([...selectedProductos, { producto, cantidad: 1 }]);
    }
  };

  const handleProductoChange = (producto, nuevaCantidad) => {
    const updatedProductos = selectedProductos.map((item) => {
      if (item.producto.id === producto.id) {
        return { ...item, cantidad: nuevaCantidad };
      }
      return item;
    });
    setSelectedProductos(updatedProductos);
  };

  const handleRemoveProducto = (producto) => {
    const updatedProductos = selectedProductos.filter(
      (item) => item.producto.id !== producto.id
    );
    setSelectedProductos(updatedProductos);
  };

  const handleSave = async () => {
    if (!selectedCliente || selectedProductos.length === 0) {
      alert("Por favor, seleccione un cliente y al menos un producto.");
      return;
    }

    const remito = {
      cliente: selectedCliente.value,
      productos: selectedProductos.map((p) => ({
        producto: p.producto.id,
        cantidad: p.cantidad,
      })),
      total,
    };

    console.log("Remito a guardar:", remito);

    try {
      const response = await axios.post(`${apiUrl}/api/remitos`, remito);
      console.log("Remito guardado correctamente:", response.data);
      setSelectedCliente(null);
      setSelectedProductos([]);
      setTotal(0);
      setTotalCantidad(0);
      alert("Remito guardado correctamente");
    } catch (error) {
      console.error("Error al guardar el remito:", error);
      alert("Error al guardar el remito. Por favor, inténtelo nuevamente.");
    }
  };

  const handlePrint = () => {
    if (selectedProductos.length === 0) {
      alert("No hay productos seleccionados para imprimir en el PDF.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Remito", 14, 22);
    doc.setFontSize(12);
    doc.text(`Cliente: ${selectedCliente ? selectedCliente.label : ""}`, 14, 30);
    doc.text(`Fecha: ${moment().format("LL")}`, 14, 36);

    const tableColumn = ["Producto", "Cantidad", "Precio Unitario", "Subtotal"];

    const tableRows = selectedProductos.map((item) => [
      item.producto.nombre,
      item.cantidad,
      `$${item.producto.precio.toFixed(2)}`,
      `$${(item.producto.precio * item.cantidad).toFixed(2)}`,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: "striped",
      styles: {
        fontSize: 12,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      footStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
    });

    doc.text(`Total: $${total.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
    doc.save(`remito_${moment().format("YYYYMMDD_HHmmss")}.pdf`);
  };

  const clienteOptions = clientes.map((cliente) => ({
    value: cliente.id,
    label: `${cliente.nombre} (${cliente.idCliente})`,
  }));

  const productoOptions = productos.map((producto) => ({
    value: producto.id,
    label: `${producto.nombre} - $${producto.precio} - ID: ${producto.identificador}`,
  }));

  return (
    <Container className="container-custom">
      <Row className="my-4">
        <Col>
          <Card>
            <Card.Header
              style={{ backgroundColor: "#1a1a1a", color: "#ffff" }}
              className="card-header-custom"
            >
              <h2>
                Crear Remito <FcMoneyTransfer />
              </h2>
            </Card.Header>
            <Card.Body>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2} className="form-label-custom">
                  <FaUser className="me-2" /> Cliente
                </Form.Label>
                <Col sm={10}>
                  <Select
                    value={selectedCliente}
                    onChange={handleClienteChange}
                    options={clienteOptions}
                    placeholder="Buscar Cliente por Identificador"
                    classNamePrefix="form-control-custom"
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2} className="form-label-custom">
                  <FaBox className="me-2" /> Producto
                </Form.Label>
                <Col sm={10}>
                  <Select
                    value={null}
                    onChange={(option) =>
                      handleAddProducto(
                        productos.find((p) => p.id === option.value)
                      )
                    }
                    options={productoOptions}
                    placeholder="Buscar Producto por Identificador"
                    classNamePrefix="form-control-custom"
                  />
                </Col>
              </Form.Group>
              <Table striped bordered hover className="table-custom">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProductos.map((item) => (
                    <tr key={item.producto.id}>
                      <td>{item.producto.nombre}</td>
                      <td>
                        <Form.Control
                          type="number"
                          value={item.cantidad}
                          min="1"
                          onChange={(e) =>
                            handleProductoChange(
                              item.producto,
                              parseInt(e.target.value)
                            )
                          }
                          className="form-control-custom"
                        />
                      </td>
                      <td>${item.producto.precio}</td>
                      <td>${item.producto.precio * item.cantidad}</td>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => handleRemoveProducto(item.producto)}
                          className="button-custom button-custom-danger"
                        >
                          <FaTrashAlt className="icon" /> Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Row className="mb-3">
                <Col className="text-end">
                  <h3 className="total-text">Total Bultos: {totalCantidad}</h3>
                  <h3 className="total-text">Total: ${total}</h3>
                </Col>
              </Row>
              <Row>
                <Col className="d-flex justify-content-between">
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    className="button-custom"
                  >
                    <FaSave className="icon" /> Guardar Remito
                  </Button>
                  <Button
                    variant="secondary"
                    className="button-custom"
                    onClick={handlePrint}
                  >
                    <FaPrint className="icon" /> Imprimir PDF
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RemitoForm;
