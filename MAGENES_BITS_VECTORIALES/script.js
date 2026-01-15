const opcion = document.getElementById('seleccionar');
function antiSalva(opcion) {
  const valor = parseInt(opcion);
  const valoresPermitidos = [5,10,20,50];
  if (!valoresPermitidos.includes(valor)) {
    location.reload();
    return true;
  }
  return false;
};


opcion.addEventListener('change', function () {
  if (antiSalva(this.value)) return;
  const numeroImagenes = parseInt(this.value);
  cargarImagenes(numeroImagenes);
});

function cargarImagenes(veces) {
  const bodyImagen = document.getElementById('contenedor');
  bodyImagen.innerHTML = '';
  for (let i = 0; i < veces; i++) {
    const randomID = Math.floor(Math.random() * 1000);
    const imagenURL = `https://picsum.photos/id/${randomID}/400/225`;
    const nuevaImagen = document.createElement('div');
    nuevaImagen.innerHTML = `
            <div class="card shadow-sm h-100">
                <img src="${imagenURL}" loading="lazy" class="card-img-top" alt="Imagen aleatoria" style="height: 225px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">ID de Foto: #${randomID}</h5>
                    <p class="card-text">Imagen: ${i + 1}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">Posición: ${i + 1}</small>
                    </div>
                </div>
            </div>`;

    bodyImagen.appendChild(nuevaImagen);
  }
}
const datosJSON = {
    dataset1: {
        nombres: ['Enero', 'Febrero', 'Marzo', 'Abril'],
        valores: [400, 530, 748, 210],
        titulo: 'Ventas por Mes'
    },
    dataset2: {
        nombres: ['JavaScript', 'Python', 'Java', 'C++'],
        valores: [85, 70, 55, 40],
        titulo: 'Popularidad Lenguajes (%)'
    }
};

let opcionesBarras = {
    chart: { type: 'bar', height: 350 },
    series: [{ name: 'Valor', data: datosJSON.dataset1.valores }],
    xaxis: { categories: datosJSON.dataset1.nombres },
    title: { text: datosJSON.dataset1.titulo, align: 'center' }
};

let opcionesDonut = {
    chart: { type: 'donut', height: 350 },
    series: datosJSON.dataset1.valores,
    labels: datosJSON.dataset1.nombres,
    title: { text: datosJSON.dataset1.titulo, align: 'center' }
};

const chartBarras = new ApexCharts(document.querySelector("#graficoBarras"), opcionesBarras);
const chartDonut = new ApexCharts(document.querySelector("#graficoDonut"), opcionesDonut);

chartBarras.render();
chartDonut.render();

document.getElementById('selectorDatos').addEventListener('change', function() {
    const dataSelected = datosJSON[this.value];
    
    chartBarras.updateOptions({
        xaxis: { categories: dataSelected.nombres },
        title: { text: dataSelected.titulo }
    });
    chartBarras.updateSeries([{ data: dataSelected.valores }]);

    chartDonut.updateOptions({
        labels: dataSelected.nombres,
        title: { text: dataSelected.titulo }
    });
    chartDonut.updateSeries(dataSelected.valores);
});
document.addEventListener('DOMContentLoaded', () => cargarImagenes(5));