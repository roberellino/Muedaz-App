import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaThList } from "react-icons/fa";
import { PiListChecksFill } from "react-icons/pi";
import { SiCashapp } from "react-icons/si";
import logo from '../iconoMu.png'; // Asegúrate de tener la ruta correcta a tu imagen de logo
import '../styles/Navbar.css';

const NavigationBar = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="custom-navbar">
            <Navbar.Brand as={Link} to="/">
                <img
                    src={logo}
                    width="50"
                    height="50"
                    className="d-inline-block align-top"
                    alt="MUEDAZ Logo"
                />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
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
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavigationBar;
