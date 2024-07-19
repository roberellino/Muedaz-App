import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import ClienteForm from './components/Clientes/ClienteForm';
import ProductoForm from './components/Productos/ProductoForm';
import ClientesList from './components/Clientes/ClientesList';
import ProductosList from './components/Productos/ProductosList';
import ActualizarClienteForm from './components/Clientes/ActualizarClienteForm';
import ActualizarProductoForm from './components/Productos/ActualizarProductoForm';
import RemitoForm from './components/RemitoForm';
import RemitosList from './components/RemitosList';
import VentasDiarias from './components/VentasDiarias';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Home from './components/Home';
import './App.css';

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));

    const handleLogout = () => {
        if (window.confirm("¿Realmente deseas salir?")) {
            setToken(null);
            localStorage.removeItem('token');
        }
    };

    return (
        <Router>
            {token && <NavigationBar handleLogout={handleLogout} token={token} />}
            <div className="container mt-4">
                <Routes>
                    {!token ? (
                        <>
                            <Route path="/login" element={<Login setToken={setToken} />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="*" element={<Navigate to="/login" />} />
                        </>
                    ) : (
                        <>
                            <Route path="/" element={<Home />} />
                            <Route path="/clientes" element={<ClientesList />} />
                            <Route path="/productos" element={<ProductosList />} />
                            <Route path="/clientes/nuevo" element={<ClienteForm />} />
                            <Route path="/productos/nuevo" element={<ProductoForm />} />
                            <Route path="/clientes/actualizar/:id" element={<ActualizarClienteForm />} />
                            <Route path="/productos/actualizar/:id" element={<ActualizarProductoForm />} />
                            <Route path="/remitos" element={<RemitoForm />} />
                            <Route path="/lista-remitos" element={<RemitosList />} />
                            <Route path="/ventas-diarias" element={<VentasDiarias />} />
                        </>
                    )}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
