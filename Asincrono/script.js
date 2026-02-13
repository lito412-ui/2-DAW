let postsOr = [];
let busquedaInput = document.getElementById('busqueda');
function filtrarYRenderizar() {
    const textoBusqueda = busquedaInput.value.toLowerCase();
    
    const postsFiltrados = postsOr.filter(post => 
        post.title.toLowerCase().includes(textoBusqueda)
    );

    renderizarTabla(postsFiltrados);
}

function renderizarTabla(posts) {
    const tablaBody = document.getElementById('tabla-body');
    const infoResultados = document.getElementById('info-resultados');

    tablaBody.innerHTML = '';

    posts.forEach(post => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${post.id}</td>
            <td>${post.title}</td>
            <td>${post.body}</td>
        `;
        tablaBody.appendChild(fila);
    });

    infoResultados.textContent = `Mostrando ${posts.length} resultados`;
}

async function cargarPosts() {
    try {
        const respuesta = await fetch('https://jsonplaceholder.typicode.com/posts');
        const datos = await respuesta.json();

        postsOr = datos.slice(0, 10);
        
        renderizarTabla(postsOr);

    } catch (error) {
        console.error('Hubo un error:', error);
        document.getElementById('info-resultados').textContent = 'Error al cargar los datos.';
    }
}

document.addEventListener('DOMContentLoaded', cargarPosts);
busquedaInput.addEventListener('input', filtrarYRenderizar);

document.getElementById('orden').addEventListener('change', () => {
    const criterio = document.getElementById('orden').value;
    postsOr.sort((a, b) => {
        return criterio === 'asc' 
            ? a.title.localeCompare(b.title) 
            : b.title.localeCompare(a.title);
    });
    filtrarYRenderizar();
});