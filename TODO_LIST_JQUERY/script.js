$(document).ready(function() {
    //Seleccion de elementos del DOM 
    const $entradaTarea = $('input[type="text"]');
    const $botonAñadir = $('button.bg-primary.hover\\:bg-blue-600');
    const $contenedorListaTareas = $('.p-8.pt-6.space-y-1');
    const $botonesFiltro = $('.p-8.bg-slate-50\\/50 button');
    const $contadorTareas = $('.p-8.bg-slate-50\\/50 p');

    //Estado de la aplicacion
    let tareas = [
        { id: 1, texto: 'Aprender Tailwind CSS', completada: false },
        { id: 2, texto: 'Diseñar interfaz dashboard', completada: false },
        { id: 3, texto: 'Revisar documentación', completada: true }
    ];
    
    let filtroActual = 'Todas';

    //Funcion para renderizar las tareas en la interfaz
    function renderizarTareas() {
        //Obtenemos el elemento nativo del DOM
        const contenedorNativo = $contenedorListaTareas[0];
        contenedorNativo.innerHTML = '';
        
        const tareasFiltradas = tareas.filter(tarea => {
            if (filtroActual === 'Completadas') return tarea.completada;
            if (filtroActual === 'Pendientes') return !tarea.completada;
            return true;
        });

        tareasFiltradas.forEach(tarea => {
            const claseTexto = tarea.completada 
                ? 'text-slate-400 dark:text-slate-500 font-medium text-lg mb-3 md:mb-0 line-through italic' 
                : 'text-slate-700 dark:text-slate-300 font-medium text-lg mb-3 md:mb-0';

            //Creamos el elemento usando JavaScript nativo
            const elementoTarea = document.createElement('div');
            elementoTarea.className = 'task-item flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-50 dark:border-slate-700/30';
            
            //Usamos innerHTML para definir la estructura interna
            elementoTarea.innerHTML = `
                <span class="${claseTexto}">${tarea.texto}</span>
                <div class="flex flex-wrap gap-2">
                    <button class="btn-completar flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 ${tarea.completada ? 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300' : 'bg-emerald-500 hover:bg-emerald-600 text-white'} rounded-lg text-sm font-semibold transition-colors">
                        <span class="material-icons-round text-lg">${tarea.completada ? 'undo' : 'check_circle'}</span>
                        ${tarea.completada ? 'Deshacer' : 'Completar'}
                    </button>
                    <button class="btn-editar flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-white rounded-lg text-sm font-semibold transition-colors">
                        <span class="material-icons-round text-lg">edit</span>
                        Editar
                    </button>
                    <button class="btn-eliminar flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm font-semibold transition-colors">
                        <span class="material-icons-round text-lg">delete</span>
                        Eliminar
                    </button>
                </div>
            `;

            //Asignar eventos
            $(elementoTarea).find('.btn-completar').on('click', () => alternarEstadoTarea(tarea.id));
            $(elementoTarea).find('.btn-editar').on('click', () => editarTarea(tarea.id));
            $(elementoTarea).find('.btn-eliminar').on('click', () => eliminarTarea(tarea.id));

            contenedorNativo.appendChild(elementoTarea);
        });

        actualizarContador();
    }

    //Funcion para añadir una nueva tarea
    function añadirTarea() {
        const texto = $entradaTarea.val().trim();
        if (texto === '') return;

        const nuevaTarea = {
            id: Date.now(),
            texto: texto,
            completada: false
        };

        tareas.push(nuevaTarea);
        $entradaTarea.val('');
        renderizarTareas();
    }

    //Funcion para marcar como completada o pendiente
    function alternarEstadoTarea(id) {
        tareas = tareas.map(tarea => 
            tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
        );
        renderizarTareas();
    }

    //Funcion para editar el texto de una tarea
    function editarTarea(id) {
        const tarea = tareas.find(t => t.id === id);
        const nuevoTexto = prompt('Editar tarea:', tarea.texto);
        
        if (nuevoTexto !== null && nuevoTexto.trim() !== '') {
            tareas = tareas.map(t => 
                t.id === id ? { ...t, texto: nuevoTexto.trim() } : t
            );
            renderizarTareas();
        }
    }

    //Funcion para eliminar una tarea de la lista
    function eliminarTarea(id) {
        tareas = tareas.filter(tarea => tarea.id !== id);
        renderizarTareas();
    }

    //Funcion para actualizar el texto informativo del contador
    function actualizarContador() {
        const total = tareas.length;
        $contadorTareas.text(`${total} Tarea${total !== 1 ? 's' : ''} en total • Dashboard V1.0`);
    }

    //Configuracion de los eventos para los botones de filtro con jQuery
    $botonesFiltro.on('click', function() {
        const $boton = $(this);
        filtroActual = $boton.text().trim();
        
        $botonesFiltro.attr('class', 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 px-6 py-2.5 rounded-xl text-sm font-bold active:scale-95 transition-all');
        $boton.attr('class', 'bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all');
        
        renderizarTareas();
    });

    //Eventos de interacción global
    $botonAñadir.on('click', añadirTarea);
    $entradaTarea.on('keypress', function(evento) {
        if (evento.key === 'Enter') añadirTarea();
    });

    //Carga inicial de la lista
    renderizarTareas();
});