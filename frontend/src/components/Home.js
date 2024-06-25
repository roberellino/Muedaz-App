// src/components/Home.js

import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import { FcMoneyTransfer, FcList, FcPortraitMode, FcAddRow  } from 'react-icons/fc';

const Home = () => {
  return (

      <Container fluid className="home-container">
        <img
              src={`${process.env.PUBLIC_URL}/logoBIEN.png`}
              alt="Logo"
              className="home-logo"
            />
        <Row className="justify-content-center align-items-center home-row">
          <Col md="auto" className="text-center">
            <h1>Bienvenido...</h1>
          </Col>
        </Row>
        <Row className="justify-content-center home-card-row">
          <Col md={4} className="home-card-col">
            <Card className="home-card">
              <Card.Body>
                <Card.Title>Remitos <FcMoneyTransfer /></Card.Title>
                <Card.Text>
                  Accede al módulo de remitos para gestionar la documentación.
                </Card.Text>
                <Button variant="primary" as={Link} to="/remitos">
                  Ir a Remitos
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="home-card-col">
            <Card className="home-card">
              <Card.Body>
                <Card.Title>Clientes <FcPortraitMode /></Card.Title>
                <Card.Text>
                  Gestiona la información de tus clientes aquí.
                </Card.Text>
                <Button variant="primary" as={Link} to="/clientes">
                  Ir a Clientes
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="home-card-col">
            <Card className="home-card">
              <Card.Body>
                <Card.Title>Productos <FcAddRow /></Card.Title>
                <Card.Text>
                  Administra el catálogo de productos desde este módulo.
                </Card.Text>
                <Button variant="primary" as={Link} to="/productos">
                  Ir a Productos
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="home-card-col">
            <Card className="home-card">
              <Card.Body>
                <Card.Title>Lista de remitos <FcList /></Card.Title>
                <Card.Text>
                  Administra la lista de remitos.
                </Card.Text>
                <Button variant="primary" as={Link} to="/lista-remitos">
                  Ir a Lista de remitos
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
  );
};

export default Home;
