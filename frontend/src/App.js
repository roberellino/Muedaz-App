import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import ClienteForm from './components/Clientes/ClienteForm';
import ProductoForm from './components/Productos/ProductoForm';
import ClientesList from './components/Clientes/ClientesList';
import ProductosList from './components/Productos/ProductosList';
import ActualizarClienteForm from './components/Clientes/ActualizarClienteForm';
import ActualizarProductoForm from './components/Productos/ActualizarProductoForm';
import RemitoForm from './components/RemitoForm';  // Importar el nuevo componente
import RemitosList from './components/RemitosList';
import './App.css';
import Home from './components/Home';

const App = () => {
    return (
        <Router>
            <NavigationBar />
            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/clientes" element={<ClientesList />} />
                    <Route path="/productos" element={<ProductosList />} />
                    <Route path="/clientes/nuevo" element={<ClienteForm />} />
                    <Route path="/productos/nuevo" element={<ProductoForm />} />
                    <Route path="/clientes/actualizar/:id" element={<ActualizarClienteForm />} />
                    <Route path="/productos/actualizar/:id" element={<ActualizarProductoForm />} />
                    <Route path="/remitos" element={<RemitoForm />} />
                    <Route path="/lista-remitos" element={<RemitosList />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;



