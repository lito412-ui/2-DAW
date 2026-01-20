class Viaje{
    constructor(codigo, destino, precio, disponibilidad = true) {
    this.codigo = codigo;
    this.destino = destino;
    this.precio = precio;
    this.disponibilidad = disponibilidad;
    }
    getInfo() {
    return `Viaje [${this.codigo}] a ${this.destino}, precio: ${this.precio} euros`;
    }
}

class Vuelo extends Viaje{
    constructor(codigo, destino, precio, aerolinea, duracion) {
    super(codigo, destino, precio);
    this.aerolinea = aerolinea;
    this.duracion = duracion;
    }
    getInfo() {
    return `${super.getInfo()}, Aerolínea: ${this.aerolinea}, Duración: ${this.duracion} horas`;
    }
}

class Hotel extends Viaje{
    constructor(codigo, destino, precio, estrellas, tipoHabitacion) {
    super(codigo, destino, precio);
    this.estrellas = estrellas;
    this.tipoHabitacion = tipoHabitacion;
    }
    getInfo() {
    return `${super.getInfo()}, Hotel ${this.estrellas} estrellas, Habitación: ${this.tipoHabitacion}`;
    }
}

class Paquete extends Viaje{
    constructor(codigo, destino, precio, vuelo, hotel) {
    super(codigo, destino, precio);
    this.vuelo = vuelo;
    this.hotel = hotel;
    }
    getInfo() {
    return `${super.getInfo()}\n - Vuelo: ${this.vuelo.getInfo()}\n - Hotel: ${this.hotel.getInfo()}`;
    }
}

class Cliente{
    constructor(nombre, apellido, email, telefono) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.telefono = telefono;
    }
    getResumen() {
    return `Cliente: ${this.nombre} ${this.apellido}, Email: ${this.email}, Teléfono: ${this.telefono}`;
    }
}

class Reserva{
    constructor(cliente, viaje) {
    this.cliente = cliente;
    this.viaje = viaje;
    }
    getResumen() {
    return `${this.cliente.getResumen()}\nReservó: ${this.viaje.getInfo()}`;
    }
}

const btnAnadir = document.getElementById('btnAñadir');
const tablaClientes = document.getElementById('listaClientes');
const inputNombre = document.getElementById('inputNombre');
const inputApellidos = document.getElementById('inputApellidos');
const inputEmail = document.getElementById('inputEmail');
const inputTelefono = document.getElementById('inputTelefono');

function agregarFila(cliente) {
    const fila = document.createElement('tr');
    fila.className = "hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors";
    
    fila.innerHTML = `
        <td class="px-6 py-4 text-slate-700 dark:text-slate-300">${cliente.nombre}</td>
        <td class="px-6 py-4 text-slate-700 dark:text-slate-300 border-l border-slate-100 dark:border-slate-700">${cliente.apellido}</td>
        <td class="px-6 py-4 text-slate-700 dark:text-slate-300 border-l border-slate-100 dark:border-slate-700">${cliente.email}</td>
        <td class="px-6 py-4 text-slate-700 dark:text-slate-300 border-l border-slate-100 dark:border-slate-700">${cliente.telefono}</td>
        <td class="px-6 py-4 border-l border-slate-100 dark:border-slate-700">
            <button class="btn-eliminar inline-flex items-center px-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400 dark:hover:border-red-800 transition-all">
                <span class="material-icons text-sm mr-1">delete</span>
                Eliminar
            </button>
        </td>
    `;

    fila.querySelector('.btn-eliminar').addEventListener('click', () => {
        fila.remove();
    });

    tablaClientes.appendChild(fila);
}

btnAnadir.addEventListener('click', () => {
    const nombre = inputNombre.value;
    const apellido = inputApellidos.value;
    const email = inputEmail.value;
    const telefono = inputTelefono.value;

    if (!nombre || !apellido || !email) {
        alert("Por favor, rellena los campos obligatorios");
        return;
    }

    const nuevoCliente = new Cliente(nombre, apellido, email, telefono);

    agregarFila(nuevoCliente);

    inputNombre.value = '';
    inputApellidos.value = '';
    inputEmail.value = '';
    inputTelefono.value = '';
});