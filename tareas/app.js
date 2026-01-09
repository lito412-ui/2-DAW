/* ============================================
   GESTOR DE TAREAS CON COOKIES
   ============================================ */

class TaskManager {
    constructor() {
        this.tasks = [];
        this.currentEditingId = null;
        this.cookieName = 'todoAppTasks';
        this.cookieExpireDays = 365;
        
        this.init();
    }

    /**
     * Inicializa la aplicación
     */
    init() {
        this.loadTasksFromCookies();
        this.renderTasks();
        this.setupEventListeners();
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        // Botón para guardar tarea
        document.getElementById('saveTaskBtn').addEventListener('click', () => {
            this.handleSaveTask();
        });

        // Botón para confirmar eliminación
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            this.handleConfirmDelete();
        });

        // Limpiar formulario al cerrar modal
        const addTaskModal = document.getElementById('addTaskModal');
        addTaskModal.addEventListener('hidden.bs.modal', () => {
            this.resetForm();
        });

        // Permitir guardar con Enter en el textarea
        document.getElementById('taskDescription').addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.handleSaveTask();
            }
        });
    }

    /**
     * Carga las tareas desde las cookies
     */
    loadTasksFromCookies() {
        const cookieValue = this.getCookie(this.cookieName);
        
        if (cookieValue) {
            try {
                this.tasks = JSON.parse(decodeURIComponent(cookieValue));
                console.log(`✓ Se cargaron ${this.tasks.length} tareas desde cookies`);
            } catch (error) {
                console.error('Error al parsear cookies:', error);
                this.tasks = [];
            }
        } else {
            this.tasks = [];
            console.log('No hay tareas guardadas en cookies');
        }
    }

    /**
     * Guarda las tareas en cookies
     */
    saveTasksToCookies() {
        const cookieValue = encodeURIComponent(JSON.stringify(this.tasks));
        this.setCookie(this.cookieName, cookieValue, this.cookieExpireDays);
        console.log(`✓ ${this.tasks.length} tareas guardadas en cookies`);
    }

    /**
     * Obtiene una cookie por nombre
     */
    getCookie(name) {
        const nameEQ = name + '=';
        const cookies = document.cookie.split(';');
        
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.indexOf(nameEQ) === 0) {
                return cookie.substring(nameEQ.length);
            }
        }
        return null;
    }

    /**
     * Establece una cookie
     */
    setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = 'expires=' + date.toUTCString();
        document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
    }

    /**
     * Elimina una cookie
     */
    deleteCookie(name) {
        this.setCookie(name, '', -1);
    }

    /**
     * Genera un ID único para las tareas
     */
    generateId() {
        return Math.max(0, ...this.tasks.map(t => t.id)) + 1;
    }

    /**
     * Maneja el guardado de tarea (crear o editar)
     */
    handleSaveTask() {
        const description = document.getElementById('taskDescription').value.trim();

        // Validación
        if (!description) {
            this.showAlert('Por favor, ingresa una descripción para la tarea', 'warning');
            return;
        }

        if (description.length > 500) {
            this.showAlert('La descripción no puede exceder 500 caracteres', 'warning');
            return;
        }

        if (this.currentEditingId === null) {
            // Crear nueva tarea
            this.createTask(description);
        } else {
            // Editar tarea existente
            this.updateTask(this.currentEditingId, description);
        }

        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addTaskModal'));
        modal.hide();
    }

    /**
     * Crea una nueva tarea
     */
    createTask(description) {
        const newTask = {
            id: this.generateId(),
            description: description,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(newTask);
        this.saveTasksToCookies();
        this.renderTasks();
        this.showAlert(`✓ Tarea "${description.substring(0, 30)}..." creada exitosamente`, 'success');
        console.log('Tarea creada:', newTask);
    }

    /**
     * Actualiza una tarea existente
     */
    updateTask(id, description) {
        const task = this.tasks.find(t => t.id === id);
        
        if (task) {
            const oldDescription = task.description;
            task.description = description;
            task.updatedAt = new Date().toISOString();
            
            this.saveTasksToCookies();
            this.renderTasks();
            this.showAlert(`✓ Tarea actualizada exitosamente`, 'success');
            console.log(`Tarea ${id} actualizada de "${oldDescription}" a "${description}"`);
        }
    }

    /**
     * Abre el modal para editar una tarea
     */
    editTask(id) {
        const task = this.tasks.find(t => t.id === id);
        
        if (task) {
            this.currentEditingId = id;
            document.getElementById('taskDescription').value = task.description;
            document.getElementById('modalTitle').textContent = 'Editar Tarea';
            
            const modal = new bootstrap.Modal(document.getElementById('addTaskModal'));
            modal.show();
            
            // Enfocar en el textarea
            setTimeout(() => {
                document.getElementById('taskDescription').focus();
            }, 300);
            
            console.log('Editando tarea:', task);
        }
    }

    /**
     * Abre el modal de confirmación para eliminar
     */
    deleteTask(id) {
        this.currentEditingId = id;
        const modal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
        modal.show();
    }

    /**
     * Maneja la confirmación de eliminación
     */
    handleConfirmDelete() {
        if (this.currentEditingId !== null) {
            const task = this.tasks.find(t => t.id === this.currentEditingId);
            const description = task ? task.description : 'Desconocida';
            
            this.tasks = this.tasks.filter(t => t.id !== this.currentEditingId);
            this.saveTasksToCookies();
            this.renderTasks();
            this.showAlert(`✓ Tarea "${description.substring(0, 30)}..." eliminada`, 'success');
            console.log(`Tarea ${this.currentEditingId} eliminada`);
            
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal'));
            modal.hide();
            
            this.currentEditingId = null;
        }
    }

    /**
     * Renderiza la tabla de tareas
     */
    renderTasks() {
        const tableBody = document.getElementById('tasksTableBody');
        const emptyState = document.getElementById('emptyState');
        const table = document.getElementById('tasksTable');

        if (this.tasks.length === 0) {
            tableBody.innerHTML = '';
            table.style.display = 'none';
            emptyState.classList.add('show');
        } else {
            table.style.display = 'table';
            emptyState.classList.remove('show');
            
            tableBody.innerHTML = this.tasks.map(task => `
                <tr class="fade-in">
                    <td class="text-center">
                        <span class="badge bg-primary">${task.id}</span>
                    </td>
                    <td>
                        <div class="task-description">
                            ${this.escapeHtml(task.description)}
                        </div>
                        <small class="text-muted d-block mt-1">
                            ${this.formatDate(task.createdAt)}
                        </small>
                    </td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-edit btn-icon me-2" 
                                onclick="taskManager.editTask(${task.id})"
                                title="Editar tarea">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-delete btn-icon" 
                                onclick="taskManager.deleteTask(${task.id})"
                                title="Eliminar tarea">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    }

    /**
     * Reinicia el formulario
     */
    resetForm() {
        document.getElementById('taskForm').reset();
        document.getElementById('taskDescription').value = '';
        document.getElementById('modalTitle').textContent = 'Agregar Nueva Tarea';
        this.currentEditingId = null;
    }

    /**
     * Escapa caracteres HTML para evitar XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Formatea la fecha de creación
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('es-ES', options);
    }

    /**
     * Muestra una alerta
     */
    showAlert(message, type = 'info') {
        // Crear elemento de alerta
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        // Insertar alerta al inicio del main-content
        const mainContent = document.querySelector('.main-content');
        mainContent.insertBefore(alertDiv, mainContent.firstChild);

        // Auto-cerrar después de 4 segundos
        setTimeout(() => {
            alertDiv.remove();
        }, 4000);

        console.log(`[${type.toUpperCase()}] ${message}`);
    }

    /**
     * Exporta las tareas a JSON (función auxiliar)
     */
    exportTasks() {
        const dataStr = JSON.stringify(this.tasks, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tareas-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        console.log('Tareas exportadas a JSON');
    }

    /**
     * Limpia todas las tareas (función auxiliar)
     */
    clearAllTasks() {
        if (confirm('¿Estás seguro de que deseas eliminar TODAS las tareas? Esta acción no se puede deshacer.')) {
            this.tasks = [];
            this.saveTasksToCookies();
            this.renderTasks();
            this.showAlert('✓ Todas las tareas han sido eliminadas', 'info');
            console.log('Todas las tareas eliminadas');
        }
    }

    /**
     * Obtiene estadísticas de tareas
     */
    getStats() {
        return {
            total: this.tasks.length,
            oldest: this.tasks.length > 0 ? this.tasks[0].createdAt : null,
            newest: this.tasks.length > 0 ? this.tasks[this.tasks.length - 1].createdAt : null
        };
    }
}

// ============================================
// INICIALIZACIÓN
// ============================================

let taskManager;

document.addEventListener('DOMContentLoaded', () => {
    taskManager = new TaskManager();
    console.log('%c✓ Aplicación de Tareas Iniciada', 'color: #6366f1; font-size: 14px; font-weight: bold;');
    console.log('%cComandos disponibles en consola:', 'color: #64748b; font-weight: bold;');
    console.log('%c- taskManager.exportTasks() → Exportar tareas a JSON', 'color: #64748b;');
    console.log('%c- taskManager.clearAllTasks() → Eliminar todas las tareas', 'color: #64748b;');
    console.log('%c- taskManager.getStats() → Ver estadísticas', 'color: #64748b;');
});

// Manejo de errores global
window.addEventListener('error', (event) => {
    console.error('Error no controlado:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rechazada no controlada:', event.reason);
});
