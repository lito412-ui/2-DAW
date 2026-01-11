let contadorID = 2;
let eliminarFila = null;
let editarFila = null;
function guardarTarea(){
    //Cogemos el valor de la descripción de la tarea
    const tareaInput = document.getElementById('descripcionTarea');
    const descripcion = tareaInput.value;
    //Verificamos si esta vacía
    if(descripcion.trim() === ""){
        alert("Por favor, escribe una descripción");
        return;
    }
    //Pillamos la descripcion que ponga al editar la fila, para cambiar la descripcion en la tarea actual
    if(editarFila){
        editarFila.querySelector('.task-description').innerText = descripcion;
        editarFila = null; //Limpiamos la variable para evitar errores
    }else{
    //Cogemos el body de la tabla
    const textoTabla = document.getElementById('tablaTarea');
    //Creamos la variable para hacer nuevas filas
    const nuevaFila = document.createElement('tr');
    nuevaFila.innerHTML = `

    <td class="task-id">#${contadorID}</td>
        <td class="task-description">${descripcion}</td>
        <td class="task-actions">
            <button class="btn btn-sm btn-edit" data-bs-toggle="modal" data-bs-target="#añadirModal">
                ✏️ Editar
            </button>
            <button class="btn btn-sm btn-delete" data-bs-toggle="modal" data-bs-target="#confirmacionEliminar">
                🗑️ Eliminar
            </button>
        </td>
    `;
    //Añadimos la fila a la tabla
    textoTabla.appendChild(nuevaFila);
    contadorID++;
    }
    tareaInput.value = "";
    //Cerramos el modal usando Bootstrap
    const modalElement = document.getElementById('añadirModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if(modalInstance){
        modalInstance.hide();
    }
    actualizarCookies()
}

function eliminarTarea(){
    //Borramos la fila de la tabla y reseteamos la variable, además de cerrar el modal de confirmacion
    if(eliminarFila){
        eliminarFila.remove();
        eliminarFila = null;
        const modalElement = document.getElementById('confirmacionEliminar');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if(modalInstance){
            modalInstance.hide();
        }
    }
    actualizarCookies()
}

//Escuchamos el click en la tabla
document.getElementById('tablaTarea').addEventListener('click', function(e) {
    const botonEliminar = e.target.closest('.btn-delete');
    if (botonEliminar) {
        eliminarFila = botonEliminar.closest('tr');
        console.log("Fila seleccionada para ser eliminada")
    }

    const editarBoton = e.target.closest('.btn-edit');
    if(editarBoton){
        //Ponemos el texto de la tarea en el input para poder modificarlo
        editarFila = editarBoton.closest('tr');
        const descripcionModificada = editarFila.querySelector('.task-description').innerText;
        document.getElementById('descripcionTarea').value = descripcionModificada;
        //Cambio el titulo del modal
        document.getElementById('añadirTarea').innerText = "Editar Tarea";
    }
});

function actualizarCookies() {
    const tareas = [];
    document.querySelectorAll('#tablaTarea tr').forEach(fila => {
        const id = fila.querySelector('.task-id').innerText;
        const desc = fila.querySelector('.task-description').innerText;
        tareas.push({ id, desc });
    });
    // Guardamos la lista de tareas y el contador actual
    localStorage.setItem("mis_tareas", JSON.stringify(tareas));
    localStorage.setItem("ultimo_id", contadorID);
}

function cargarCookies(){
    const jsonTareas = localStorage.getItem("mis_tareas");
    const id = localStorage.getItem("ultimo_id");

    if(jsonTareas){
        const tareas = JSON.parse(jsonTareas);
        const tabla = document.getElementById('tablaTarea');
        tabla.innerHTML = "";//Limpiamos la tabla para evitar errores

        tareas.forEach(t => {
            const nuevaFila = document.createElement('tr');
            nuevaFila.innerHTML = `
                <td class="task-id">${t.id}</td>
                <td class="task-description">${t.desc}</td>
                <td class="task-actions">
                    <button class="btn btn-sm btn-edit" data-bs-toggle="modal" data-bs-target="#añadirModal">✏️ Editar</button>
                    <button class="btn btn-sm btn-delete" data-bs-toggle="modal" data-bs-target="#confirmacionEliminar">🗑️ Eliminar</button>
                </td>
            `;
            tabla.appendChild(nuevaFila);
        });
        if (id) contadorID = parseInt(id);
    }
}

document.getElementById('guardarTarea').addEventListener('click',guardarTarea);
document.getElementById('confirmarBoton').addEventListener('click',eliminarTarea);
cargarCookies();