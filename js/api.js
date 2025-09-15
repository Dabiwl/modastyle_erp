// js/api.js - Funciones para comunicación con la API

const API_BASE = '';

// Función para obtener todos los clientes
async function getClientes() {
    try {
        const response = await fetch('api/clientes.php');
        const clientes = await response.json();
        return clientes;
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        return [];
    }
}

// Función para obtener un cliente por ID
async function getCliente(id) {
    try {
        const response = await fetch(`api/clientes.php?id=${id}`);
        const cliente = await response.json();
        return cliente;
    } catch (error) {
        console.error('Error al obtener el cliente:', error);
        return null;
    }
}

// Función para crear un nuevo cliente
async function createCliente(clienteData) {
    try {
        const response = await fetch('api/clientes.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clienteData)
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error al crear cliente:', error);
        return { error: 'Error al crear cliente' };
    }
}

// Función para actualizar un cliente
async function updateCliente(id, clienteData) {
    try {
        const response = await fetch(`api/clientes.php?id=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clienteData)
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        return { error: 'Error al actualizar cliente' };
    }
}

// Función para eliminar un cliente
async function deleteCliente(id) {
    try {
        const response = await fetch(`api/clientes.php?id=${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        return { error: 'Error al eliminar cliente' };
    }
}

// Función para cargar estadísticas del dashboard
async function loadDashboardStats() {
    try {
        const clientes = await getClientes();
        
        // Actualizar contadores en el dashboard
        document.getElementById('clients-count').textContent = clientes.length;
        
        // Aquí podrías cargar más estadísticas cuando tengas otras APIs
        document.getElementById('sales-today').textContent = '12';
        document.getElementById('products-stock').textContent = '245';
        document.getElementById('employees-count').textContent = '5';
        
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
    }
}