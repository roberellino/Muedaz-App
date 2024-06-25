import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Form,
  Container,
  Row,
  Col,
  Card,
  Table,
} from "react-bootstrap";
import Select from "react-select";
import jsPDF from "jspdf";
import moment from "moment";
import "moment/locale/es";
import { FaSave, FaPrint, FaTrashAlt, FaBox, FaUser } from "react-icons/fa";
import { FcMoneyTransfer } from "react-icons/fc";
import "../styles/RemitoForm.css";

const RemitoForm = () => {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [selectedProductos, setSelectedProductos] = useState([]);
  const [total, setTotal] = useState(0);
  const [cantidad, setCantidad] = useState({});

  useEffect(() => {
    fetchClientes();
    fetchProductos();
  }, []);

  const fetchClientes = async () => {
    const result = await axios.get("http://localhost:5000/api/clientes");
    setClientes(result.data);
  };

  const fetchProductos = async () => {
    const result = await axios.get("http://localhost:5000/api/productos");
    setProductos(result.data);
  };

  useEffect(() => {
    if (selectedProductos.length > 0) {
      const newTotal = selectedProductos.reduce(
        (acc, item) => acc + item.producto.precio * item.cantidad,
        0
      );
      setTotal(newTotal);
    } else {
      setTotal(0);
    }
  }, [selectedProductos]);

  const handleAddProducto = (producto) => {
    if (!selectedProductos.some((item) => item.producto._id === producto._id)) {
      setSelectedProductos([...selectedProductos, { producto, cantidad: 1 }]);
      setCantidad({ ...cantidad, [producto._id]: 1 });
    }
  };

  const handleProductoChange = (producto, nuevaCantidad) => {
    const updatedProductos = selectedProductos.map((item) => {
      if (item.producto._id === producto._id) {
        return { ...item, cantidad: nuevaCantidad };
      }
      return item;
    });
    setSelectedProductos(updatedProductos);
    setCantidad({ ...cantidad, [producto._id]: nuevaCantidad });
  };

  const handleRemoveProducto = (producto) => {
    const updatedProductos = selectedProductos.filter(
      (item) => item.producto._id !== producto._id
    );
    setSelectedProductos(updatedProductos);
    const { [producto._id]: removed, ...rest } = cantidad;
    setCantidad(rest);
  };

  const handleSave = async () => {
    if (!selectedCliente || selectedProductos.length === 0) {
      alert("Por favor, seleccione un cliente y al menos un producto.");
      return;
    }

    const remito = {
      cliente: selectedCliente.value,
      productos: selectedProductos.map((p) => ({
        producto: p.producto._id,
        cantidad: p.cantidad,
      })),
      total,
    };

    console.log("Remito a guardar:", remito);

    try {
      await axios.post("http://localhost:5000/api/remitos", remito);
      setSelectedCliente(null);
      setSelectedProductos([]);
      setTotal(0);
      setCantidad({});
      alert("Remito guardado correctamente");
    } catch (error) {
      console.error("Error al guardar el remito:", error);
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
    doc.text(`Cliente: ${selectedCliente ? selectedCliente.label : ''}`, 14, 30);
    doc.text(`Fecha: ${moment().format("LL")}`, 14, 36);

    const tableColumn = ["Producto", "Cantidad", "Precio Unitario", "Total"];

    const tableRows = selectedProductos.map((item) => {
      const producto = productos.find((p) => p._id === item.producto._id);
      if (producto) {
        const cantidadItem = item.cantidad || 1;
        return [
          producto.nombre,
          cantidadItem,
          `$${producto.precio.toFixed(2)}`,
          `$${(producto.precio * cantidadItem).toFixed(2)}`,
        ];
      } else {
        console.error("Producto no encontrado:", item.producto._id);
        return ["Producto no encontrado", "", "", ""];
      }
    });

    console.log("Tabla de Productos:", tableRows);

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
    value: cliente._id,
    label: `${cliente.nombre} (${cliente.idCliente})`,
  }));

  const productoOptions = productos.map((producto) => ({
    value: producto._id,
    label: `${producto.nombre} - $${producto.precio} -  ID: ${producto.identificador}`,
  }));

  return (
    <Container className="container-custom">
      <Row className="my-4">
        <Col>
          <Card>
            <Card.Header className="card-header-custom">
              <h2>Crear Remito <FcMoneyTransfer /></h2>
            </Card.Header>
            <Card.Body>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2} className="form-label-custom">
                  <FaUser className="me-2" /> Cliente
                </Form.Label>
                <Col sm={10}>
                  <Select
                    value={selectedCliente}
                    onChange={setSelectedCliente}
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
                        productos.find((p) => p._id === option.value)
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
                    <tr key={item.producto._id}>
                      <td>{item.producto.nombre}</td>
                      <td>
                        <Form.Control
                          type="number"
                          value={item.cantidad}
                          min="1"
                          onChange={(e) =>
                            handleProductoChange(item.producto, e.target.value)
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
