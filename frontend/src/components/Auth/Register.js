// src/components/Auth/Register.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Container } from 'react-bootstrap';

const styles = {
    authContainer: {
        maxWidth: '400px',
        margin: 'auto',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#ffffff',
        marginTop: '100px'
    },
    authHeader: {
        textAlign: 'center',
        marginBottom: '15px',
        fontSize: '1.5rem'
    },
    authForm: {
        display: 'flex',
        flexDirection: 'column'
    },
    authInput: {
        marginBottom: '10px',
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '1.0rem'
    },
    authButton: {
        padding: '8px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#007bff',
        color: 'white',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        fontSize: '1.0rem'
    },
    authButtonHover: {
        backgroundColor: '#0056b3'
    },
    authLink: {
        marginTop: '10px',
        textAlign: 'center',
        fontSize: '0.9rem'
    },
    authLinkA: {
        color: '#007bff',
        textDecoration: 'none'
    },
    authLinkAHover: {
        textDecoration: 'underline'
    }
};

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', { username, password });
            alert('User registered successfully');
            navigate('/login'); // Redirigir al Login después del registro
        } catch (error) {
            alert('Error registering user');
        }
    };

    return (
        <Container style={styles.authContainer}>
            <h2 style={styles.authHeader}>Register</h2>
            <Form onSubmit={handleRegister} style={styles.authForm}>
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
                    Register
                </Button>
            </Form>
            <div style={styles.authLink}>
                <p>
                    Already have an account? <a href="/login" style={styles.authLinkA}>Login</a>
                </p>
            </div>
        </Container>
    );
};

export default Register;
