// src/components/Auth/Login.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button, Container } from "react-bootstrap";
import logo from "../../iconoMu.png";

const apiUrl =
  process.env.REACT_APP_API_URL || "https://muedaz-app-backend.vercel.app";

const styles = {
  authContainer: {
    maxWidth: "400px",
    margin: "auto",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff",
    marginTop: "100px",
  },
  authHeader: {
    textAlign: "center",
    marginBottom: "15px",
    fontSize: "1.5rem",
  },
  authForm: {
    display: "flex",
    flexDirection: "column",
  },
  authInput: {
    marginBottom: "10px",
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1.0rem",
  },
  authButton: {
    padding: "8px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
    transition: "background-color 0.3s",
    fontSize: "1.0rem",
  },
  authButtonHover: {
    backgroundColor: "#0056b3",
  },
  authLink: {
    marginTop: "10px",
    textAlign: "center",
    fontSize: "0.9rem",
  },
  authLinkA: {
    color: "#007bff",
    textDecoration: "none",
  },
  authLinkAHover: {
    textDecoration: "underline",
  },
};

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://muedaz-app-backend.vercel.app/api/auth/login",
        { username, password }
      );
      setToken(response.data.token);
      navigate("/"); // Redirigir al Home después del login
    } catch (error) {
      alert("Usuario o contraseña incorrecto");
    }
  };

  return (
    <Container style={styles.authContainer}>
      <h2 style={styles.authHeader}>Login</h2>
      <img
        src={logo}
        width="150"
        className="d-block mx-auto align-top"
        alt="MUEDAZ Logo"
      />
      <Form onSubmit={handleLogin} style={styles.authForm}>
        <Form.Group controlId="formUsername">
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            style={styles.authInput}
          />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={styles.authInput}
          />
        </Form.Group>
        <Button type="submit" block style={styles.authButton}>
          Login
        </Button>
      </Form>
      {/* 
            <div style={styles.authLink}>
                <p>
                    Don't have an account? <a href="/register" style={styles.authLinkA}>Register</a>
                </p>
            </div>
            */}
    </Container>
  );
};

export default Login;
