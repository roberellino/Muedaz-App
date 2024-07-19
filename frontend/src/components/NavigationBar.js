import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaUserPlus, FaThList } from "react-icons/fa";
import { PiListChecksFill } from "react-icons/pi";
import { SiCashapp } from "react-icons/si";
import { FaSackDollar } from "react-icons/fa6";
import logo from "../iconoMu.png"; // Asegúrate de tener la ruta correcta a tu imagen de logo
import "../styles/Navbar.css";
import { BiLogOut } from "react-icons/bi";

const NavigationBar = ({ handleLogout, token }) => {
  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      sticky="top"
      className="custom-navbar"
    >
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          {token ? (
            <>
              <Navbar.Brand as={Link} to="/">
                <img
                  src={logo}
                  width="40"
                  height="40"
                  className="d-inline-block align-top"
                  alt="MUEDAZ Logo"
                />
              </Navbar.Brand>
              <Nav.Link as={Link} to="/clientes" className="nav-link">
                <FaUserPlus className="nav-icon" /> Clientes
              </Nav.Link>
              <Nav.Link as={Link} to="/productos" className="nav-link">
                <PiListChecksFill className="nav-icon" /> Productos
              </Nav.Link>
              <Nav.Link as={Link} to="/remitos" className="nav-link">
                <SiCashapp className="nav-icon" /> Remitos
              </Nav.Link>
              <Nav.Link as={Link} to="/lista-remitos" className="nav-link">
                <FaThList className="nav-icon" /> Lista de Remitos
              </Nav.Link>
              <Nav.Link as={Link} to="/ventas-diarias" className="nav-link">
                <FaSackDollar className="nav-icon" /> Ventas Diarias
              </Nav.Link>
              <Nav.Link onClick={handleLogout} className="nav-link">
              <BiLogOut /> Logout
              </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/login" className="nav-link">
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/register" className="nav-link">
                Register
              </Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
