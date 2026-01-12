const opcion = document.getElementById('seleccionar');

opcion.addEventListener('change', function() {
    const numeroImagenes = parseInt(this.value);
    cargarImagenes(numeroImagenes);
});

function cargarImagenes(veces) {
    const bodyImagen = document.getElementById('contenedor');
    bodyImagen.innerHTML = ''; 

    for (let i = 0; i < veces; i++) {
        const nuevaImagen = document.createElement('div');
        nuevaImagen.innerHTML = `
            <div class="col">
              <div class="card shadow-sm">
                <svg
                  aria-label="Placeholder: Thumbnail"
                  class="bd-placeholder-img card-img-top"
                  height="225"
                  preserveAspectRatio="xMidYMid slice"
                  role="img"
                  width="100%"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Placeholder</title>
                  <rect width="100%" height="100%" fill="#55595c"></rect>
                  <text x="50%" y="50%" fill="#eceeef" dy=".3em">
                    Thumbnail ${i + 1}
                  </text>
                </svg>
                <div class="card-body">
                  <p class="card-text">Descripción de imagen ${i + 1}</p>
                </div>
              </div>
            </div>`;
        
        bodyImagen.appendChild(nuevaImagen);
    }
}