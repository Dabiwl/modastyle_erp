// js/main.js - Lógica principal de la interfaz

document.addEventListener('DOMContentLoaded', function() {
    // Cargar estadísticas del dashboard
    loadDashboardStats();
    
    // Configurar tabs
    const adminTab = document.getElementById('admin-tab');
    const clientTab = document.getElementById('client-tab');
    const adminModules = document.getElementById('admin-modules');
    const clientModules = document.getElementById('client-modules');
    
    adminTab.addEventListener('click', () => {
        adminTab.classList.add('active');
        clientTab.classList.remove('active');
        adminModules.classList.add('active');
        clientModules.classList.remove('active');
    });
    
    clientTab.addEventListener('click', () => {
        clientTab.classList.add('active');
        adminTab.classList.remove('active');
        clientModules.classList.add('active');
        adminModules.classList.remove('active');
    });
    
    // Configurar modal de notificaciones
    const notificationsBtn = document.getElementById('notifications-btn');
    const notificationsModal = document.getElementById('notifications-modal');
    const closeModal = document.querySelector('.close');
    
    notificationsBtn.addEventListener('click', () => {
        notificationsModal.style.display = 'block';
    });
    
    closeModal.addEventListener('click', () => {
        notificationsModal.style.display = 'none';
    });
    
    window.addEventListener('click', (event) => {
        if (event.target === notificationsModal) {
            notificationsModal.style.display = 'none';
        }
    });
    
    // Manejar clic en "Nuevo Cliente"
    const newClientBtn = document.getElementById('new-client-btn');
    newClientBtn.addEventListener('click', () => {
        showClientForm();
    });
    
    // Manejar clic en enlaces de módulos
    const moduleLinks = document.querySelectorAll('.module-link');
    moduleLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const module = link.getAttribute('data-module');
            alert(`Accediendo al módulo: ${module}`);
            // Aquí podrías redirigir o cargar contenido dinámico según el módulo
        });
    });
});

// Función para mostrar formulario de cliente
function showClientForm(cliente = null) {
    // Crear modal para el formulario de cliente
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${cliente ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <form id="cliente-form">
                    <input type="hidden" id="cliente-id" value="${cliente ? cliente.id : ''}">
                    <div class="form-group">
                        <label for="nombre">Nombre *</label>
                        <input type="text" id="nombre" value="${cliente ? cliente.nombre : ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email *</label>
                        <input type="email" id="email" value="${cliente ? cliente.email : ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="telefono">Teléfono</label>
                        <input type="text" id="telefono" value="${cliente ? cliente.telefono : ''}">
                    </div>
                    <div class="form-group">
                        <label for="direccion">Dirección</label>
                        <textarea id="direccion">${cliente ? cliente.direccion : ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="fecha_nacimiento">Fecha de Nacimiento</label>
                        <input type="date" id="fecha_nacimiento" value="${cliente ? cliente.fecha_nacimiento : ''}">
                    </div>
                    <div class="form-group">
                        <label for="genero">Género</label>
                        <select id="genero">
                            <option value="">Seleccionar</option>
                            <option value="Masculino" ${cliente && cliente.genero === 'Masculino' ? 'selected' : ''}>Masculino</option>
                            <option value="Femenino" ${cliente && cliente.genero === 'Femenino' ? 'selected' : ''}>Femenino</option>
                            <option value="Otro" ${cliente && cliente.genero === 'Otro' ? 'selected' : ''}>Otro</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-cancel" id="cancel-form">Cancelar</button>
                        <button type="submit" class="btn btn-primary">${cliente ? 'Actualizar' : 'Crear'} Cliente</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Cerrar modal
    const closeBtn = modal.querySelector('.close');
    const cancelBtn = modal.querySelector('#cancel-form');
    
    const closeModal = () => {
        document.body.removeChild(modal);
    };
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Manejar envío del formulario
    const form = modal.querySelector('#cliente-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const clienteData = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            direccion: document.getElementById('direccion').value,
            fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
            genero: document.getElementById('genero').value
        };
        
        const clienteId = document.getElementById('cliente-id').value;
        
        let result;
        if (clienteId) {
            result = await updateCliente(clienteId, clienteData);
        } else {
            result = await createCliente(clienteData);
        }
        
        if (!result.error) {
            alert(clienteId ? 'Cliente actualizado correctamente' : 'Cliente creado correctamente');
            closeModal();
            loadDashboardStats(); // Recargar estadísticas
        } else {
            alert('Error: ' + result.message);
        }
    });
}