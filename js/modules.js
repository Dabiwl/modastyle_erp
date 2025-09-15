// js/modules.js - Funciones específicas de módulos

// Gestión del módulo de clientes
document.addEventListener('DOMContentLoaded', function() {
    // Manejar clic en el módulo de gestión de clientes
    const manageClientsBtn = document.getElementById('manage-clients-btn');
    if (manageClientsBtn) {
        manageClientsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleClientsManagement();
        });
    }
    
    // Manejar clic en el botón de agregar cliente (en la sección de gestión)
    const addClientBtn = document.getElementById('add-client-btn');
    if (addClientBtn) {
        addClientBtn.addEventListener('click', function() {
            showClientForm();
        });
    }
    
    // Configurar el modal de cliente
    const clientModal = document.getElementById('client-modal');
    const closeClientModal = clientModal.querySelector('.close');
    const cancelClientForm = document.getElementById('cancel-client-form');
    
    if (closeClientModal) {
        closeClientModal.addEventListener('click', function() {
            clientModal.style.display = 'none';
        });
    }
    
    if (cancelClientForm) {
        cancelClientForm.addEventListener('click', function() {
            clientModal.style.display = 'none';
        });
    }
    
    // Manejar envío del formulario de cliente
    const clientForm = document.getElementById('client-form');
    if (clientForm) {
        clientForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await handleClientSubmit();
        });
    }
    
    // Cerrar modal al hacer clic fuera de él
    window.addEventListener('click', function(event) {
        if (event.target === clientModal) {
            clientModal.style.display = 'none';
        }
    });
});

// Función para mostrar/ocultar la gestión de clientes
function toggleClientsManagement() {
    const clientsSection = document.getElementById('clients-management-section');
    const modulesGrid = document.querySelector('.modules-grid');
    
    if (clientsSection.style.display === 'none') {
        clientsSection.style.display = 'block';
        modulesGrid.style.display = 'none';
        loadClientsList();
    } else {
        clientsSection.style.display = 'none';
        modulesGrid.style.display = 'grid';
    }
}

// Función para cargar la lista de clientes
async function loadClientsList() {
    try {
        const clients = await getClientes();
        const clientsList = document.getElementById('clients-list');
        
        clientsList.innerHTML = '';
        
        if (clients.length === 0) {
            clientsList.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay clientes registrados</td></tr>';
            return;
        }
        
        clients.forEach(client => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${client.nombre}</td>
                <td>${client.email}</td>
                <td>${client.telefono || 'N/A'}</td>
                <td>${client.puntos_fidelidad}</td>
                <td><span class="status-badge ${client.estado.toLowerCase()}">${client.estado}</span></td>
                <td>
                    <button class="btn-icon edit-client" data-id="${client.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon delete-client" data-id="${client.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            clientsList.appendChild(row);
        });
        
        // Agregar event listeners a los botones de editar y eliminar
        document.querySelectorAll('.edit-client').forEach(btn => {
            btn.addEventListener('click', function() {
                const clientId = this.getAttribute('data-id');
                editClient(clientId);
            });
        });
        
        document.querySelectorAll('.delete-client').forEach(btn => {
            btn.addEventListener('click', function() {
                const clientId = this.getAttribute('data-id');
                deleteClient(clientId);
            });
        });
        
    } catch (error) {
        console.error('Error al cargar la lista de clientes:', error);
        const clientsList = document.getElementById('clients-list');
        clientsList.innerHTML = '<tr><td colspan="6" style="text-align: center;">Error al cargar los clientes</td></tr>';
    }
}

// Función para mostrar formulario de cliente (para editar o crear)
async function showClientForm(clientId = null) {
    const clientModal = document.getElementById('client-modal');
    const modalTitle = document.getElementById('client-modal-title');
    const clientForm = document.getElementById('client-form');
    
    // Limpiar formulario
    clientForm.reset();
    document.getElementById('client-id').value = '';
    
    if (clientId) {
        // Modo edición
        modalTitle.textContent = 'Editar Cliente';
        try {
            const client = await getCliente(clientId);
            if (client) {
                document.getElementById('client-id').value = client.id;
                document.getElementById('client-name').value = client.nombre;
                document.getElementById('client-email').value = client.email;
                document.getElementById('client-phone').value = client.telefono || '';
                document.getElementById('client-address').value = client.direccion || '';
                document.getElementById('client-birthdate').value = client.fecha_nacimiento || '';
                document.getElementById('client-gender').value = client.genero || '';
                document.getElementById('client-status').value = client.estado || 'Activo';
            }
        } catch (error) {
            console.error('Error al cargar datos del cliente:', error);
            alert('Error al cargar los datos del cliente');
            return;
        }
    } else {
        // Modo creación
        modalTitle.textContent = 'Nuevo Cliente';
    }
    
    clientModal.style.display = 'block';
}

// Función para manejar el envío del formulario de cliente
async function handleClientSubmit() {
    const clientId = document.getElementById('client-id').value;
    const clientData = {
        nombre: document.getElementById('client-name').value,
        email: document.getElementById('client-email').value,
        telefono: document.getElementById('client-phone').value,
        direccion: document.getElementById('client-address').value,
        fecha_nacimiento: document.getElementById('client-birthdate').value,
        genero: document.getElementById('client-gender').value,
        estado: document.getElementById('client-status').value
    };
    
    try {
        let result;
        if (clientId) {
            result = await updateCliente(clientId, clientData);
        } else {
            result = await createCliente(clientData);
        }
        
        if (result.error) {
            alert('Error: ' + result.message);
        } else {
            alert(clientId ? 'Cliente actualizado correctamente' : 'Cliente creado correctamente');
            document.getElementById('client-modal').style.display = 'none';
            
            // Recargar la lista si estamos en la sección de gestión
            if (document.getElementById('clients-management-section').style.display === 'block') {
                loadClientsList();
            }
            
            // Actualizar estadísticas del dashboard
            loadDashboardStats();
        }
    } catch (error) {
        console.error('Error al guardar cliente:', error);
        alert('Error al guardar el cliente');
    }
}

// Función para editar cliente
async function editClient(clientId) {
    await showClientForm(clientId);
}

// Función para eliminar cliente
async function deleteClient(clientId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
        return;
    }
    
    try {
        const result = await deleteCliente(clientId);
        if (result.error) {
            alert('Error: ' + result.message);
        } else {
            alert('Cliente eliminado correctamente');
            loadClientsList();
            loadDashboardStats();
        }
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        alert('Error al eliminar el cliente');
    }
}