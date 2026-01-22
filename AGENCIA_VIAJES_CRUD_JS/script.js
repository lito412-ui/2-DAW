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
let clientesRegistrados = JSON.parse(localStorage.getItem('clientes')) || [];
let viajesRegistrados = JSON.parse(localStorage.getItem('viajes')) || [];
let reservasRegistradas = JSON.parse(localStorage.getItem('reservas')) || [];
//Hora
const ahora = new Date();
const año = ahora.getFullYear();
const mes = ahora.getMonth() + 1;
const dia = ahora.getDate();
const hora = ahora.getHours();
const minutos = ahora.getMinutes();


clientesRegistrados = clientesRegistrados.map(c => new Cliente(c.nombre, c.apellido, c.email, c.telefono));
viajesRegistrados = viajesRegistrados.map(v => new Viaje(v.codigo, v.destino, v.precio, v.disponibilidad));
reservasRegistradas = reservasRegistradas.map(r => new Reserva(r.cliente.nombre,r.viaje.destino,fechaLocal));
//Cargar datos localStorage
document.addEventListener('DOMContentLoaded', () => {
    clientesRegistrados.forEach(c => agregarFilaCliente(c));
    viajesRegistrados.forEach(v => agregarViaje(v));
    actualizarSelect();
});

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
                <span class="material-symbols-outlined">
                        delete
                </span>
                Eliminar
            </button>
        </td>
    `;

    filaCliente.querySelector('.btn-eliminar').addEventListener('click', () => {
        const tieneReserva = reservasRegistradas.some(r => r.cliente === cliente);
        if (tieneReserva) {
            alert(`No puedes eliminar a ${cliente.nombre}, primero debes cancelar su reserva`);
            return;
        }
        clientesRegistrados = clientesRegistrados.filter(c => c !== cliente);
        localStorage.setItem('clientes', JSON.stringify(clientesRegistrados));
        filaCliente.remove();
        actualizarSelect();
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
                <span class="material-symbols-outlined">delete</span>
                Eliminar
            </button>
        </td>`;

    filaViaje.querySelector('.btn-eliminar').addEventListener('click', () => {
        const tieneReserva = reservasRegistradas.some(r => r.viaje === viaje);
        if (tieneReserva) {
            alert(`No puedes eliminar el viaje a ${viaje.destino}. Hay reservas asociadas.`);
            return;
        }
        viajesRegistrados = viajesRegistrados.filter(v => v !== viaje);
        localStorage.setItem('viajes', JSON.stringify(viajesRegistrados));
        filaViaje.remove();
        actualizarSelect();
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
                <span class="material-symbols-outlined">delete</span>
                Cancelar
            </button>
        </td>`;

    reservasRegistradas.push(reserva);
    tablaReservas.appendChild(filaReserva);

    filaReserva.querySelector('.btn-cancelar').addEventListener('click', () => {
        reservasRegistradas = reservasRegistradas.filter(r => r !== reserva);
        localStorage.setItem('reservas', JSON.stringify(reservasRegistradas));
        filaReserva.remove();
    });
};

btnAñadirCliente.addEventListener('click', () => {
    const nombre = inputNombre.value;
    const apellido = inputApellidos.value;
    const email = inputEmail.value;
    const telefono = inputTelefono.value;

    if (nombre && apellido && email) {
        const nuevoCliente = new Cliente(nombre, apellido, email, telefono);
        clientesRegistrados.push(nuevoCliente);
        localStorage.setItem('clientes', JSON.stringify(clientesRegistrados));
        agregarFilaCliente(nuevoCliente);
        actualizarSelect();
    } else {
        alert("Por favor rellena los campos")
    }

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

    if (codigo && destino && precio && tipo) {
        const nuevoViaje = new Viaje(codigo, destino, precio, tipo);
        viajesRegistrados.push(nuevoViaje);
        localStorage.setItem('viajes',JSON.stringify(viajesRegistrados));
        actualizarSelect();
        agregarViaje(nuevoViaje);
    }else{
        alert("Por favor, rellena los campos obligatorios");
    }
    

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
    localStorage.setItem('reservas',JSON.stringify(reservasRegistradas));
    añadirReserva(nuevaReserva);
});