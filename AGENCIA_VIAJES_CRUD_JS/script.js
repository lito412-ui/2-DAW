class Viaje {
    constructor(codigo, destino, precio, disponibilidad) {
        this.codigo = codigo;
        this.destino = destino;
        this.precio = precio;
        this.disponibilidad = disponibilidad;
    }
    getInfo() {
        return `Viaje [${this.codigo}] a ${this.destino}, precio: ${this.precio} euros`;
    }
}

class Cliente {
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

class Reserva {
    constructor(cliente, viaje) {
        this.cliente = cliente;
        this.viaje = viaje;
    }
    getResumen() {
        return `${this.cliente.getResumen()}\nReservó: ${this.viaje.getInfo()}`;
    }
}
//Clientes
const btnAñadirCliente = document.getElementById('btnAñadirCliente');
const tablaClientes = document.getElementById('listaClientes');
const inputNombre = document.getElementById('inputNombre');
const inputApellidos = document.getElementById('inputApellidos');
const inputEmail = document.getElementById('inputEmail');
const inputTelefono = document.getElementById('inputTelefono');

//Viajes
const btnAñadirViaje = document.getElementById('btnAñadirViaje');
const tablaViaje = document.getElementById('listaViajes');
const inputCodigo = document.getElementById('codigo');
const inputDestino = document.getElementById('destino');
const inputPrecio = document.getElementById('precio');
const inputTipoViaje = document.getElementById('tipo');

//Reservas
const selectClientes = document.getElementById('selectCliente');
const selectViajes = document.getElementById('selectViaje');
const btnCrearReservas = document.getElementById('btnCrearReserva');
const tablaReservas = document.getElementById('listaReservas').querySelector('tbody');
//Datos a guardar
let clientesRegistrados = [];
let viajesRegistrados = [];
//Hora
const ahora = new Date();
const año = ahora.getFullYear();
const mes = ahora.getMonth() + 1;
const dia = ahora.getDate();
const hora = ahora.getHours();
const minutos = ahora.getMinutes();

function agregarFilaCliente(cliente) {
    const filaCliente = document.createElement('tr');
    filaCliente.className = "hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors";

    filaCliente.innerHTML = `
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

    filaCliente.querySelector('.btn-eliminar').addEventListener('click', () => {
        filaCliente.remove();
    });

    tablaClientes.appendChild(filaCliente);
}
function agregarViaje(viaje) {
    const filaViaje = document.createElement('tr');
    filaViaje.className = "hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors";

    filaViaje.innerHTML = `<td class="px-6 py-4 text-slate-700 dark:text-slate-300">${viaje.codigo}</td>
        <td class="px-6 py-4 text-slate-700 dark:text-slate-300 border-l border-slate-100 dark:border-slate-700">${viaje.destino}</td>
        <td class="px-6 py-4 text-slate-700 dark:text-slate-300 border-l border-slate-100 dark:border-slate-700">${viaje.precio}</td>
        <td class="px-6 py-4 text-slate-700 dark:text-slate-300 border-l border-slate-100 dark:border-slate-700">${viaje.disponibilidad}</td>
        <td class="px-6 py-4 border-l border-slate-100 dark:border-slate-700">
            <button class="btn-eliminar inline-flex items-center px-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400 dark:hover:border-red-800 transition-all">
                <span class="material-icons text-sm mr-1">delete</span>
                Eliminar
            </button>
        </td>`;

    filaViaje.querySelector('.btn-eliminar').addEventListener('click', () => {
        filaViaje.remove();
    });

    tablaViaje.appendChild(filaViaje);
}
function actualizarSelect() {
    selectClientes.innerHTML = `<option>Elige un Cliente</option>`;
    selectViajes.innerHTML = `<option>Elige un Viaje</option>`
    clientesRegistrados.forEach((cliente, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${cliente.nombre} ${cliente.apellido}`;
        selectClientes.appendChild(option);
    });
    viajesRegistrados.forEach((viaje, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${viaje.destino} (${viaje.codigo})`;
        selectViajes.appendChild(option);
    });
};

function añadirReserva(reserva) {
    const filaReserva = document.createElement('tr');
    filaReserva.className = "hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors";
    const fechaLocal = new Date().toLocaleDateString('es-ES');

    filaReserva.innerHTML = `<td class="px-6 py-4 text-slate-700 dark:text-slate-300">
            ${reserva.cliente.nombre} ${reserva.cliente.apellido}
        </td>
        <td class="px-6 py-4 text-slate-700 dark:text-slate-300 border-l border-slate-100 dark:border-slate-700">
            ${reserva.viaje.destino}
        </td>
        <td class="px-6 py-4 text-slate-700 dark:text-slate-300 border-l border-slate-100 dark:border-slate-700">
            ${fechaLocal}
        </td>
        <td class="px-6 py-4 border-l border-slate-100 dark:border-slate-700">
            <button class="btn-eliminar inline-flex items-center px-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 transition-all">
                <span class="material-icons text-sm mr-1">delete</span>
                Eliminar
            </button>
        </td>`;

    tablaReservas.appendChild(filaReserva);
};

btnAñadirCliente.addEventListener('click', () => {
    const nombre = inputNombre.value;
    const apellido = inputApellidos.value;
    const email = inputEmail.value;
    const telefono = inputTelefono.value;

    if (!nombre || !apellido || !email) {
        alert("Por favor, rellena los campos obligatorios");
        return;
    }

    const nuevoCliente = new Cliente(nombre, apellido, email, telefono);
    clientesRegistrados.push(nuevoCliente);
    actualizarSelect();
    agregarFilaCliente(nuevoCliente);

    inputNombre.value = '';
    inputApellidos.value = '';
    inputEmail.value = '';
    inputTelefono.value = '';
});

btnAñadirViaje.addEventListener('click', () => {
    const codigo = inputCodigo.value;
    const destino = inputDestino.value;
    const precio = inputPrecio.value;
    const tipo = inputTipoViaje.value;

    if (!codigo || !destino || !precio || !tipo) {
        alert("Por favor, rellena los campos obligatorios");
    }
    const nuevoViaje = new Viaje(codigo, destino, precio, tipo);
    viajesRegistrados.push(nuevoViaje);
    actualizarSelect();
    agregarViaje(nuevoViaje);

});
btnCrearReservas.addEventListener('click', () => {
    const cliente = selectClientes.value;
    const viaje = selectViajes.value;

    if (cliente === "" || viaje === "") {
        alert("Selecciona un cliente y un viaje para la reserva");
        return;
    }

    const clienteObjeto = clientesRegistrados[cliente];
    const viajeObjeto = viajesRegistrados[viaje];
    const nuevaReserva = new Reserva(clienteObjeto, viajeObjeto);
    añadirReserva(nuevaReserva);
});