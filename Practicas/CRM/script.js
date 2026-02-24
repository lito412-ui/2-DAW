// Variables globales para el estado del calendario
let fechaActual = new Date();
let eventos = [];
let productos = [];
let productoSeleccionado = null;

// Elementos del DOM - Calendario
const diasCalendario = document.getElementById('calendarDays');
const visualizacionMes = document.getElementById('monthDisplay');
const botonMesAnterior = document.getElementById('prevMonth');
const botonMesSiguiente = document.getElementById('nextMonth');
const listaEventos = document.getElementById('eventsList');
const formularioEvento = document.getElementById('eventForm');

// Elementos del DOM - Productos
const tablaProductosBody = document.getElementById('tablaProductosBody');
const formularioProducto = document.getElementById('productoForm');
const fichaProductoBody = document.getElementById('fichaProductoBody');
const btnBuscar = document.getElementById('btnBuscar');

// Elementos de filtros
const filtroDescripcion = document.getElementById('filtroDescripcion');
const filtroCosecha = document.getElementById('filtroCosecha');
const filtroCodigoArticulo = document.getElementById('filtroCodigoArticulo');
const filtroTipoProceso = document.getElementById('filtroTipoProceso');
const filtroFamilia = document.getElementById('filtroFamilia');
const filtroSubfamilia = document.getElementById('filtroSubfamilia');
const filtroLote = document.getElementById('filtroLote');
const filtroVenta = document.getElementById('filtroVenta');

// Nombres de los meses en español
const nombresMeses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Productos de ejemplo
const productosEjemplo = [
    {
        id: 1,
        nombre: "Vino Tinto Reserva",
        codigo: "VT-001",
        familia: "vino-tinto",
        subfamilia: "reserva",
        tipoProceso: "envejecimiento",
        cosecha: "2018",
        lote: "LOTE-2018-001",
        enVenta: "si",
        descripcion: "Vino tinto de alta calidad, envejecido en barriles de roble durante 24 meses. Aroma complejo con notas de frutas rojas y especias."
    },
    {
        id: 2,
        nombre: "Vino Blanco Crianza",
        codigo: "VB-002",
        familia: "vino-blanco",
        subfamilia: "crianza",
        tipoProceso: "fermentacion",
        cosecha: "2020",
        lote: "LOTE-2020-005",
        enVenta: "si",
        descripcion: "Vino blanco fresco y elegante con crianza de 12 meses. Notas cítricas y florales que lo hacen perfecto para acompañar pescados y mariscos."
    },
    {
        id: 3,
        nombre: "Vino Rosado Joven",
        codigo: "VR-003",
        familia: "vino-rosado",
        subfamilia: "joven",
        tipoProceso: "embotellado",
        cosecha: "2022",
        lote: "LOTE-2022-010",
        enVenta: "si",
        descripcion: "Vino rosado joven y vibrante, perfecto para disfrutar en cualquier ocasión. Con toques de frutas del bosque y una acidez equilibrada."
    }
];

// Función para renderizar el calendario
function renderizarCalendario() {
    diasCalendario.innerHTML = '';
    
    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth();
    
    visualizacionMes.innerText = `${nombresMeses[mes]} ${año}`;
    
    let primerDiaMes = new Date(año, mes, 1).getDay();
    primerDiaMes = primerDiaMes === 0 ? 6 : primerDiaMes - 1;
    
    const diasEnMes = new Date(año, mes + 1, 0).getDate();
    const diasMesAnterior = new Date(año, mes, 0).getDate();
    
    for (let i = primerDiaMes; i > 0; i--) {
        const diaDiv = document.createElement('div');
        diaDiv.classList.add('calendar-day', 'other-month');
        diaDiv.innerText = diasMesAnterior - i + 1;
        diasCalendario.appendChild(diaDiv);
    }
    
    const hoy = new Date();
    for (let i = 1; i <= diasEnMes; i++) {
        const diaDiv = document.createElement('div');
        diaDiv.classList.add('calendar-day');
        diaDiv.innerText = i;
        
        if (i === hoy.getDate() && mes === hoy.getMonth() && año === hoy.getFullYear()) {
            diaDiv.classList.add('today');
        }
        
        const fechaString = `${año}-${String(mes + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        if (eventos.some(e => e.fecha === fechaString)) {
            diaDiv.classList.add('has-event');
        }
        
        diasCalendario.appendChild(diaDiv);
    }
    
    const totalCeldas = diasCalendario.children.length;
    const celdasRestantes = 42 - totalCeldas;
    for (let i = 1; i <= celdasRestantes; i++) {
        const diaDiv = document.createElement('div');
        diaDiv.classList.add('calendar-day', 'other-month');
        diaDiv.innerText = i;
        diasCalendario.appendChild(diaDiv);
    }
}

// Función para actualizar la lista de eventos
function actualizarListaEventos() {
    if (eventos.length === 0) {
        listaEventos.innerHTML = '<p class="no-events">No hay eventos para mostrar</p>';
        return;
    }
    
    eventos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    
    listaEventos.innerHTML = '';
    eventos.forEach(evento => {
        const item = document.createElement('div');
        item.classList.add('event-item');
        
        const [año, mes, dia] = evento.fecha.split('-');
        const fechaFormateada = `${dia}/${mes}/${año}`;
        
        item.innerHTML = `
            <div class="event-info">
                <h4>${evento.titulo}</h4>
                <p>${evento.descripcion || 'Sin descripción'}</p>
            </div>
            <span class="event-date-badge">${fechaFormateada}</span>
        `;
        listaEventos.appendChild(item);
    });
}

// Función para filtrar productos
function filtrarProductos() {
    const descripcion = filtroDescripcion.value.toLowerCase();
    const cosecha = filtroCosecha.value.toLowerCase();
    const codigo = filtroCodigoArticulo.value.toLowerCase();
    const tipoProceso = filtroTipoProceso.value;
    const familia = filtroFamilia.value;
    const subfamilia = filtroSubfamilia.value;
    const lote = filtroLote.value.toLowerCase();
    const venta = filtroVenta.value;
    
    const productosFiltrados = productos.filter(producto => {
        const cumpleDescripcion = descripcion === '' || producto.nombre.toLowerCase().includes(descripcion) || producto.descripcion.toLowerCase().includes(descripcion);
        const cumpleCosecha = cosecha === '' || producto.cosecha.toLowerCase().includes(cosecha);
        const cumpleCodigo = codigo === '' || producto.codigo.toLowerCase().includes(codigo);
        const cumpleTipoProceso = tipoProceso === '' || producto.tipoProceso === tipoProceso;
        const cumpleFamilia = familia === '' || producto.familia === familia;
        const cumpleSubfamilia = subfamilia === '' || producto.subfamilia === subfamilia;
        const cumpleLote = lote === '' || producto.lote.toLowerCase().includes(lote);
        const cumpleVenta = venta === '' || producto.enVenta === venta;
        
        return cumpleDescripcion && cumpleCosecha && cumpleCodigo && cumpleTipoProceso && cumpleFamilia && cumpleSubfamilia && cumpleLote && cumpleVenta;
    });
    
    renderizarTablaProductos(productosFiltrados);
}

// Función para renderizar la tabla de productos
function renderizarTablaProductos(listaProductos = productos) {
    tablaProductosBody.innerHTML = '';
    
    if (listaProductos.length === 0) {
        tablaProductosBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 30px; color: #999;">No se encontraron productos</td></tr>';
        return;
    }
    
    listaProductos.forEach(producto => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td onclick="mostrarFichaTecnica(${producto.id})" style="cursor: pointer; font-weight: 500; color: #ff8c00;">${producto.nombre}</td>
            <td>${producto.codigo}</td>
            <td>${producto.familia}</td>
            <td>${producto.tipoProceso}</td>
            <td>${producto.cosecha}</td>
            <td>
                <div class="acciones-celda">
                    <button class="btn-accion btn-editar" onclick="editarProducto(${producto.id})" title="Editar">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button class="btn-accion btn-eliminar" onclick="eliminarProducto(${producto.id})" title="Eliminar">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </td>
        `;
        tablaProductosBody.appendChild(fila);
    });
}

// Función para mostrar la ficha técnica del producto
function mostrarFichaTecnica(idProducto) {
    const producto = productos.find(p => p.id === idProducto);
    if (!producto) return;
    
    productoSeleccionado = producto;
    
    fichaProductoBody.innerHTML = `
        <div class="ficha-tecnica">
            <div class="ficha-campo">
                <div class="ficha-label">Nombre del Producto</div>
                <div class="ficha-valor">${producto.nombre}</div>
            </div>
            <div class="ficha-campo">
                <div class="ficha-label">Código de Artículo</div>
                <div class="ficha-valor">${producto.codigo}</div>
            </div>
            <div class="ficha-campo">
                <div class="ficha-label">Familia</div>
                <div class="ficha-valor">${producto.familia}</div>
            </div>
            <div class="ficha-campo">
                <div class="ficha-label">Subfamilia</div>
                <div class="ficha-valor">${producto.subfamilia}</div>
            </div>
            <div class="ficha-campo">
                <div class="ficha-label">Tipo de Proceso</div>
                <div class="ficha-valor">${producto.tipoProceso}</div>
            </div>
            <div class="ficha-campo">
                <div class="ficha-label">Cosecha</div>
                <div class="ficha-valor">${producto.cosecha}</div>
            </div>
            <div class="ficha-campo">
                <div class="ficha-label">Lote</div>
                <div class="ficha-valor">${producto.lote}</div>
            </div>
            <div class="ficha-campo">
                <div class="ficha-label">En Venta</div>
                <div class="ficha-valor">${producto.enVenta === 'si' ? 'Sí' : 'No'}</div>
            </div>
            <div class="ficha-campo ficha-descripcion">
                <div class="ficha-label">Descripción</div>
                <div class="ficha-valor">${producto.descripcion}</div>
            </div>
        </div>
    `;
    
    const modal = new bootstrap.Modal(document.getElementById('fichaProductoModal'));
    modal.show();
}

// Función para eliminar un producto
function eliminarProducto(idProducto) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        productos = productos.filter(p => p.id !== idProducto);
        renderizarTablaProductos();
    }
}

// Función para editar un producto (solo abre el modal)
function editarProducto(idProducto) {
    const producto = productos.find(p => p.id === idProducto);
    if (!producto) return;
    
    document.getElementById('prodNombre').value = producto.nombre;
    document.getElementById('prodCodigo').value = producto.codigo;
    document.getElementById('prodFamilia').value = producto.familia;
    document.getElementById('prodSubfamilia').value = producto.subfamilia;
    document.getElementById('prodTipoProceso').value = producto.tipoProceso;
    document.getElementById('prodCosecha').value = producto.cosecha;
    document.getElementById('prodLote').value = producto.lote;
    document.getElementById('prodVenta').value = producto.enVenta;
    document.getElementById('prodDescripcion').value = producto.descripcion;
    
    const modal = new bootstrap.Modal(document.getElementById('productoModal'));
    modal.show();
}

// Función para cambiar de sección
function cambiarSeccion(nombreSeccion) {
    const secciones = document.querySelectorAll('.seccion');
    secciones.forEach(seccion => seccion.classList.remove('activa'));
    
    const seccionActiva = document.getElementById(`seccion-${nombreSeccion}`);
    if (seccionActiva) {
        seccionActiva.classList.add('activa');
    }
}

// Eventos de navegación del calendario
botonMesAnterior.addEventListener('click', () => {
    fechaActual.setMonth(fechaActual.getMonth() - 1);
    renderizarCalendario();
});

botonMesSiguiente.addEventListener('click', () => {
    fechaActual.setMonth(fechaActual.getMonth() + 1);
    renderizarCalendario();
});

// Manejo del formulario de creación de eventos
formularioEvento.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nuevoEvento = {
        titulo: document.getElementById('eventTitle').value,
        fecha: document.getElementById('eventDate').value,
        descripcion: document.getElementById('eventDesc').value
    };
    
    eventos.push(nuevoEvento);
    
    formularioEvento.reset();
    const modalElement = document.getElementById('eventModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
    
    renderizarCalendario();
    actualizarListaEventos();
});

// Manejo del formulario de creación de productos
formularioProducto.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nuevoProducto = {
        id: productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1,
        nombre: document.getElementById('prodNombre').value,
        codigo: document.getElementById('prodCodigo').value,
        familia: document.getElementById('prodFamilia').value,
        subfamilia: document.getElementById('prodSubfamilia').value,
        tipoProceso: document.getElementById('prodTipoProceso').value,
        cosecha: document.getElementById('prodCosecha').value,
        lote: document.getElementById('prodLote').value,
        enVenta: document.getElementById('prodVenta').value,
        descripcion: document.getElementById('prodDescripcion').value
    };
    
    productos.push(nuevoProducto);
    
    formularioProducto.reset();
    const modalElement = document.getElementById('productoModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
    
    renderizarTablaProductos();
});

// Eventos de filtrado
btnBuscar.addEventListener('click', filtrarProductos);

filtroDescripcion.addEventListener('keyup', filtrarProductos);
filtroCosecha.addEventListener('keyup', filtrarProductos);
filtroCodigoArticulo.addEventListener('keyup', filtrarProductos);
filtroTipoProceso.addEventListener('change', filtrarProductos);
filtroFamilia.addEventListener('change', filtrarProductos);
filtroSubfamilia.addEventListener('change', filtrarProductos);
filtroLote.addEventListener('keyup', filtrarProductos);
filtroVenta.addEventListener('change', filtrarProductos);

// Eventos de navegación del menú
document.querySelectorAll('.menu-link').forEach(enlace => {
    enlace.addEventListener('click', (e) => {
        e.preventDefault();
        const seccion = enlace.getAttribute('data-seccion');
        cambiarSeccion(seccion);
    });
});

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    renderizarCalendario();
    actualizarListaEventos();
    
    productos = [...productosEjemplo];
    renderizarTablaProductos();
    
    cambiarSeccion('inicio');
});
