//Cambio de tema
const botonTema = document.getElementById('boton-tema');
const htmlElemento = document.documentElement;

//Aplicar tema
function aplicarTema(tema) {
    if (tema === 'dark') {
        htmlElemento.classList.add('dark');
        htmlElemento.setAttribute('data-theme', 'dark');
        botonTema.innerHTML = '<span class="material-symbols-outlined">dark_mode</span>';
    } else {
        htmlElemento.classList.remove('dark');
        htmlElemento.setAttribute('data-theme', 'light');
        botonTema.innerHTML = '<span class="material-symbols-outlined">light_mode</span>';
    }
}

//Cargar prefrencia del tema
const temaGuardado = localStorage.getItem('tema-preferido') || 'light';
aplicarTema(temaGuardado);

botonTema.addEventListener('click', (e) => {
    e.stopPropagation();
    const esOscuro = htmlElemento.classList.contains('dark');
    const nuevoTema = esOscuro ? 'light' : 'dark';
    aplicarTema(nuevoTema);
    localStorage.setItem('tema-preferido', nuevoTema);
});

//Barra de progreso de lectura
const barraProgreso = document.getElementById('barra-progreso');
window.addEventListener('scroll', () => {
    const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
    const posicionActual = window.scrollY;
    const porcentaje = (posicionActual / alturaTotal) * 100;
    barraProgreso.style.width = porcentaje + '%';
});

//Flecha para volver arriba
const botonArriba = document.getElementById('boton-arriba');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        botonArriba.classList.add('visible');
    } else {
        botonArriba.classList.remove('visible');
    }
});
botonArriba.addEventListener('click', (e) => {
    e.stopPropagation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

//Generar colores aleatorios usando hexadecimal ---
const botonColor = document.getElementById('boton-color');
const seccionHero = document.getElementById('seccion-hero');

botonColor.addEventListener('click', (e) => {
    e.stopPropagation();
    const letras = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letras[Math.floor(Math.random() * 16)];
    }
    seccionHero.style.backgroundColor = color;
    seccionHero.style.backgroundImage = 'none';
});

//Contador de clicks en la pagina
const textoContador = document.getElementById('texto-contador');
const botonReiniciar = document.getElementById('boton-reiniciar');
let cuenta = 0;
window.addEventListener('click', () => {
    cuenta++;
    textoContador.innerText = cuenta;
});
botonReiniciar.addEventListener('click', (e) => {
    e.stopPropagation();
    cuenta = 0;
    textoContador.innerText = cuenta;
});

//Saludo depende de la hora del dia
const textoSaludo = document.getElementById('texto-saludo');
const hora = new Date().getHours();
if (hora >= 6 && hora < 12) textoSaludo.innerText = "¡Buenos días!";
else if (hora >= 12 && hora < 20) textoSaludo.innerText = "¡Buenas tardes!";
else textoSaludo.innerText = "¡Buenas noches!";

//Ajustar tamaño de texto
const botonAumentar = document.getElementById('boton-aumentar');
const botonReducir = document.getElementById('boton-reducir');
const contenido = document.getElementById('contenido-principal');
let tamaño = 16;
botonAumentar.addEventListener('click', (a) => {
    a.stopPropagation();
    tamaño += 2;
    contenido.style.fontSize = tamaño + 'px';
});
botonReducir.addEventListener('click', (r) => {
    r.stopPropagation();
    if (tamaño > 10) {
        tamaño -= 2;
        contenido.style.fontSize = tamaño + 'px';
    }
});

//Lectura de texto en voz
const botonVoz = document.getElementById('boton-voz');
botonVoz.addEventListener('click', (v) => {
    v.stopPropagation();
    const mensaje = new SpeechSynthesisUtterance(contenido.innerText);
    mensaje.lang = 'es-ES';
    window.speechSynthesis.speak(mensaje);
});