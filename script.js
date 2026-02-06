document.addEventListener('DOMContentLoaded', () => {
    // Mapeo de los outputs e inputs
    const mapping = {
        'in-nombre': 'out-nombre',
        'in-apellido': 'out-apellido',
        'in-email': 'out-email',
        'in-tel': 'out-tel',
        'in-titulo': 'out-titulo',
        'in-experiencia': 'out-experiencia',
        'in-linkedin': 'out-linkedin'
    };

    const inputs = Object.keys(mapping).map(id => document.getElementById(id)).filter(el => el !== null);
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    // Función para actualizar la barra de progreso
    function actualizarProgreso() {
        if (!progressBar || !progressText) return;
        
        const totalCampos = Object.keys(mapping).length;
        const camposCompletos = Object.keys(mapping).filter(id => {
            const el = document.getElementById(id);
            return el && el.value.trim() !== "";
        }).length;
        
        const porcentaje = Math.round((camposCompletos / totalCampos) * 100);

        progressBar.style.width = `${porcentaje}%`;
        progressText.textContent = `${porcentaje}%`;
    }

    Object.keys(mapping).forEach(inputId => {
        const inputElement = document.getElementById(inputId);
        const outputElement = document.getElementById(mapping[inputId]);

        if (inputElement && outputElement) {
            inputElement.addEventListener('input', () => {
                outputElement.textContent = inputElement.value.trim() !== ""
                    ? inputElement.value
                    : "...";
                actualizarProgreso();
            });
        }
    });

    actualizarProgreso();

    // Lógica para el Cambio de Tema y Sincronización de Iconos
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    function updateThemeUI(isDark) {
        const lightIcon = document.getElementById('theme-icon-light');
        const darkIcon = document.getElementById('theme-icon-dark');
        const lightText = document.getElementById('theme-text-light');
        const darkText = document.getElementById('theme-text-dark');
        const toggleDot = document.getElementById('theme-toggle-dot');

        if (isDark) {
            htmlElement.classList.add('dark');
            if (lightIcon) lightIcon.classList.add('dark:text-yellow-400');
            if (toggleDot) {
                toggleDot.classList.remove('translate-x-0');
                toggleDot.classList.add('translate-x-5');
            }
        } else {
            htmlElement.classList.remove('dark');
            if (toggleDot) {
                toggleDot.classList.remove('translate-x-5');
                toggleDot.classList.add('translate-x-0');
            }
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = !htmlElement.classList.contains('dark');
            updateThemeUI(isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    const savedTheme = localStorage.getItem('theme') || 'dark';
    updateThemeUI(savedTheme === 'dark');

    // Lógica de Navegación
    const navCV = document.getElementById('nav-cv');
    const navHistorial = document.getElementById('nav-historial');
    const viewForm = document.getElementById('view-form');
    const viewHistorial = document.getElementById('view-historial');

    function switchView(view) {
        if (!viewForm || !viewHistorial) return;
        if (view === 'cv') {
            viewForm.classList.remove('hidden');
            viewHistorial.classList.add('hidden');
            if (navCV) navCV.classList.add('bg-primary/10', 'text-primary', 'border-primary/20');
            if (navHistorial) navHistorial.classList.remove('bg-primary/10', 'text-primary', 'border-primary/20');
        } else {
            viewForm.classList.add('hidden');
            viewHistorial.classList.remove('hidden');
            if (navHistorial) navHistorial.classList.add('bg-primary/10', 'text-primary', 'border-primary/20');
            if (navCV) navCV.classList.remove('bg-primary/10', 'text-primary', 'border-primary/20');
            cargarHistorial();
        }
    }

    if (navCV) navCV.addEventListener('click', () => switchView('cv'));
    if (navHistorial) navHistorial.addEventListener('click', () => switchView('historial'));

    // Lógica para Guardar
    const btnGuardar = document.getElementById('guardar');
    if (btnGuardar) {
        btnGuardar.addEventListener('click', () => {
            const formData = new FormData();
            formData.append('accion', 'guardar_db');
            
            const datosLocales = {};
            Object.keys(mapping).forEach(id => {
                const el = document.getElementById(id);
                const valor = el ? el.value : '';
                formData.append(id.replace('in-', ''), valor);
                datosLocales[id] = valor;
            });

            fetch('guardar.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({ position: "mid", icon: "success", title: "Guardado en BBDD correctamente", showConfirmButton: false, timer: 1500 });
                    guardarEnHistorialLocal(datosLocales); // Sincronizar local también
                    abrirModal();
                } else {
                    throw new Error(data.message);
                }
            })
            .catch(error => {
                console.warn('Fallback a local:', error);
                guardarEnHistorialLocal(datosLocales);
                abrirModal();
                Swal.fire({ position: "mid", icon: "success", title: "Guardado correctamente", showConfirmButton: false, timer: 1500 });
            });
        });
    }

    function guardarEnHistorialLocal(datos) {
        const historial = JSON.parse(localStorage.getItem('cv_historial') || '[]');
        historial.unshift({
            id: Date.now(),
            fecha: new Date().toLocaleString(),
            nombre: datos['in-nombre'] || 'Sin nombre',
            apellido: datos['in-apellido'] || '',
            datos: datos
        });
        localStorage.setItem('cv_historial', JSON.stringify(historial.slice(0, 10)));
    }

    function cargarHistorial() {
        const container = document.getElementById('lista-historial');
        if (!container) return;
        
        fetch('guardar.php?accion=listar')
        .then(res => res.json())
        .then(historial => renderizarHistorial(historial, container))
        .catch(() => {
            const historial = JSON.parse(localStorage.getItem('cv_historial') || '[]');
            renderizarHistorial(historial, container);
        });
    }

    function renderizarHistorial(historial, container) {
        if (!historial || historial.length === 0) {
            container.innerHTML = `<div class="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center"><p class="text-slate-500">No hay registros.</p></div>`;
            return;
        }
        container.innerHTML = historial.map(item => `
            <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                <div>
                    <h4 class="font-bold text-slate-900 dark:text-white">${item.nombre} ${item.apellido}</h4>
                    <p class="text-xs text-slate-500">${item.fecha || item.fecha_creacion}</p>
                </div>
                <div class="flex gap-2">
                    <button onclick="recuperarCV(${item.id})" class="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                        <span class="material-symbols-outlined text-[20px]">restore</span>
                    </button>
                </div>
            </div>
        `).join('');
    }

    window.recuperarCV = (id) => {
        const historial = JSON.parse(localStorage.getItem('cv_historial') || '[]');
        const item = historial.find(i => i.id == id);
        if (item) {
            Object.keys(item.datos).forEach(key => {
                const input = document.getElementById(key);
                if (input) {
                    input.value = item.datos[key];
                    input.dispatchEvent(new Event('input'));
                }
            });
            switchView('cv');
        }
    };

    // Modal y PDF
    const modal = document.getElementById('modal-cv');
    const cvOriginal = document.querySelector('.resume-preview-container > div');
    const cvClonado = document.getElementById('cv-clonado');
    const btnDescargarPDF = document.getElementById('descargar-pdf');

    function abrirModal() {
        if (!cvOriginal || !cvClonado) return;
        cvClonado.innerHTML = cvOriginal.innerHTML;
        cvClonado.classList.remove('text-[10px]');
        cvClonado.classList.add('text-base'); 
        if (modal) modal.classList.remove('hidden');
    }

    window.cerrarModal = () => {
        if (modal) modal.classList.add('hidden');
    };

    if (btnDescargarPDF) {
        btnDescargarPDF.addEventListener('click', () => {
            const element = document.getElementById('cv-clonado');
            const nombre = document.getElementById('in-nombre').value || 'CV';
            const apellido = document.getElementById('in-apellido').value || '';
            const opt = {
                margin: 10,
                filename: `CV_${nombre}_${apellido}.pdf`.replace(/\s+/g, '_'),
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            html2pdf().set(opt).from(element).save();
        });
    }
});
