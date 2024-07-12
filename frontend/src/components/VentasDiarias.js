import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Form, Button } from "react-bootstrap";
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../styles/Estiloslistas.css";
import { FaSearch, FaTrash } from "react-icons/fa";
import { LuRefreshCcw } from "react-icons/lu";
import { BsFillPrinterFill } from "react-icons/bs";

const VentasDiarias = () => {
  const [ventasDiarias, setVentasDiarias] = useState([]);
  const [filteredVentas, setFilteredVentas] = useState([]);
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    fetchVentasDiarias();
  }, []);

  const fetchVentasDiarias = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/remitos");
      const remitos = response.data;

      const ventasPorDia = {};

      // Función para obtener los detalles del producto
      const fetchProductDetails = async (productoId) => {
        const response = await axios.get(`http://localhost:5000/api/productos/${productoId}`);
        return response.data.data; // Asegurarse de que estamos accediendo a los datos correctamente
      };

      for (const remito of remitos) {
        const fecha = moment(remito.createdAt).format("YYYY-MM-DD");

        if (!ventasPorDia[fecha]) {
          ventasPorDia[fecha] = {
            fecha,
            totalDia: 0,
            totalCantidad: 0,
            productos: {},
          };
        }

        // Array de promesas para obtener los detalles de los productos
        const productDetailsPromises = remito.productos.map(producto =>
          fetchProductDetails(producto.producto).then(productoDetalles => ({
            producto: productoDetalles,
            cantidad: producto.cantidad
          }))
        );

        // Esperar a que todas las promesas se resuelvan
        const productosConDetalles = await Promise.all(productDetailsPromises);

        productosConDetalles.forEach(({ producto, cantidad }) => {
          const { identificador, nombre, precio } = producto;

          if (!ventasPorDia[fecha].productos[identificador]) {
            ventasPorDia[fecha].productos[identificador] = {
              identificador,
              nombre,
              cantidad: 0,
              precio: parseFloat(precio) || 0, // Asegurarse de que el precio sea un número
              total: 0,
            };
          }

          ventasPorDia[fecha].productos[identificador].cantidad += cantidad;
          ventasPorDia[fecha].productos[identificador].total += cantidad * (parseFloat(precio) || 0); // Asegurarse de que el precio sea un número
          ventasPorDia[fecha].totalDia += cantidad * (parseFloat(precio) || 0); // Asegurarse de que el precio sea un número
          ventasPorDia[fecha].totalCantidad += cantidad;
        });
      }

      const ventasArray = Object.values(ventasPorDia);
      ventasArray.sort(
        (a, b) => moment(b.fecha).unix() - moment(a.fecha).unix()
      );

      setVentasDiarias(ventasArray);
      setFilteredVentas(ventasArray);
    } catch (error) {
      console.error("Error fetching ventas diarias:", error);
    }
  };

  const handleSearch = () => {
    if (searchDate) {
      const filtered = ventasDiarias.filter(
        (venta) => venta.fecha === searchDate
      );
      setFilteredVentas(filtered);
    } else {
      setFilteredVentas(ventasDiarias);
    }
  };

  const handleRefresh = () => {
    setSearchDate("");
    fetchVentasDiarias();
  };

  const handlePrint = (ventaDia) => {
    const doc = new jsPDF();
    const fechaFormatted = moment(ventaDia.fecha).format("DD/MM/YYYY");

    doc.text(`Ventas del día: ${fechaFormatted}`, 10, 10);

    const productos = Object.values(ventaDia.productos).map((producto) => [
      producto.nombre,
      producto.cantidad,
      `$${(producto.precio || 0).toFixed(2)}`, // Asegurarse de que el precio sea un número
      `$${(producto.total || 0).toFixed(2)}`, // Asegurarse de que el total sea un número
    ]);

    doc.autoTable({
      head: [["Producto", "Cantidad", "Precio Unitario", "Total"]],
      body: productos,
    });

    doc.text(
      `Total Cantidad del Día: ${ventaDia.totalCantidad}`,
      10,
      doc.lastAutoTable.finalY + 10
    );
    doc.text(
      `Total del Día: $${ventaDia.totalDia.toFixed(2)}`,
      10,
      doc.lastAutoTable.finalY + 20
    );

    doc.save(`Ventas_${fechaFormatted}.pdf`);
  };

  const handleDelete = async (fecha) => {
    if (moment(fecha).isSame(moment(), "day")) {
      alert("No se puede eliminar la venta del día actual.");
      return;
    }

    if (window.confirm("¿Estás seguro de que deseas eliminar las ventas de este día?")) {
      try {
        await axios.delete(`http://localhost:5000/api/remitos/fecha/${fecha}`);
        fetchVentasDiarias();
      } catch (error) {
        console.error("Error eliminando las ventas diarias:", error);
        console.error("Detalles del error:", error.response ? error.response.data : error.message);
      }
    }
  };

  return (
    <div className="mt-4">
      <h2 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "20px" }}>
        Ventas Diarias
      </h2>
      <Form className="mb-4 d-flex">
        <Form.Group controlId="formSearchDate" className="me-2">
          <Form.Label>Buscar por Fecha</Form.Label>
          <Form.Control
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
        </Form.Group>
        <div className="align-self-end">
          <Button variant="primary" className="me-2" onClick={handleSearch}>
            <FaSearch style={{ textAlign: "center" }} /> Buscar
          </Button>
          <Button variant="secondary" onClick={handleRefresh}>
            <LuRefreshCcw /> Actualizar
          </Button>
        </div>
      </Form>
      {filteredVentas.length > 0 ? (
        filteredVentas.map((ventaDia) => (
          <div
            key={ventaDia.fecha}
            style={{
              marginBottom: "40px",
              backgroundColor: "#ffffff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3>{moment(ventaDia.fecha).format("DD/MM/YYYY")}</h3>

            <Table striped bordered hover className="table-custom">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(ventaDia.productos).map((producto) => (
                  <tr key={producto.identificador}>
                    <td>{producto.nombre}</td>
                    <td>{producto.cantidad}</td>
                    <td>${parseFloat(producto.precio || 0).toFixed(2)}</td> {/* Asegurarse de que el precio sea un número */}
                    <td>${parseFloat(producto.total || 0).toFixed(2)}</td> {/* Asegurarse de que el total sea un número */}
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p style={{ fontWeight: "bold" }}>
                  Total Cantidad del Día: {ventaDia.totalCantidad}
                </p>
                <p style={{ fontWeight: "bold" }}>
                  Total del Día: ${ventaDia.totalDia.toFixed(2)}
                </p>
              </div>
              <div>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(ventaDia.fecha)}
                >
                  <FaTrash /> Eliminar
                </Button>
                <Button
                  style={{backgroundColor:"#343a40", color:"white"}}
                  variant="light"
                  className="ms-2"
                  onClick={() => handlePrint(ventaDia)}
                >
                  <BsFillPrinterFill /> Imprimir
                </Button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No hay ventas para la fecha seleccionada.</p>
      )}
    </div>
  );
};

export default VentasDiarias;
