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

    const inputs = Object.keys(mapping);
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    /**
     * Calcula y actualiza visualmente la barra de progreso.
     */
    function updateProgress() {
        let filledFields = 0;
        inputs.forEach(id => {
            const el = document.getElementById(id);
            if (el && el.value.trim() !== "") {
                filledFields++;
            }
        });

        const percentage = Math.round((filledFields / inputs.length) * 100);
        if (progressBar) progressBar.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = `${percentage}%`;
    }

    /**
     * Valida un input y aplica feedback visual (borde rojo/verde).
     */
    function validateInput(input) {
        let value = input.value;
        let isValid = true;

        // 1. Bloquear números en nombre y apellidos inmediatamente
        if (input.id === 'in-nombre' || input.id === 'in-apellido') {
            const cleanValue = value.replace(/[0-9]/g, '');
            if (value !== cleanValue) {
                input.value = cleanValue;
                value = cleanValue;
            }
        }

        const trimmedValue = value.trim();

        // 2. Definir reglas de validación
        if (trimmedValue === "") {
            isValid = false;
        } else {
            if (input.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(trimmedValue);
            } else if (input.type === 'tel') {
                const telRegex = /^\+?[\d\s-]{9,}$/;
                isValid = telRegex.test(trimmedValue);
            } else if (input.id === 'in-nombre' || input.id === 'in-apellido') {
                // Solo letras y espacios, mínimo 2 caracteres
                const nameRegex = /^[a-zA-ZÀ-ÿ\s]{2,}$/;
                isValid = nameRegex.test(trimmedValue);
            } else if (input.id === 'in-linkedin') {
                isValid = trimmedValue.length > 3;
            } else {
                // Para experiencia y título, basta con que no esté vacío
                isValid = trimmedValue.length >= 2;
            }
        }

        // 3. Aplicar estilos visuales (¡Aquí estaba el detalle!)
        // Quitamos las clases de foco de Tailwind para que el color de validación prevalezca
        input.classList.remove('border-red-500', 'border-green-500', 'dark:border-red-500', 'dark:border-green-500', 'ring-1', 'ring-primary');

        if (isValid) {
            input.classList.add('border-green-500', 'dark:border-green-500');
            input.classList.remove('border-slate-200', 'dark:border-slate-700');
        } else {
            input.classList.add('border-red-500', 'dark:border-red-500');
            input.classList.remove('border-slate-200', 'dark:border-slate-700');
        }
        
        return isValid;
    }

    // Eventos para cada input
    inputs.forEach(inputId => {
        const inputElement = document.getElementById(inputId);
        const outputElement = document.getElementById(mapping[inputId]);

        if (inputElement) {
            // Validar mientras escribe
            inputElement.addEventListener('input', () => {
                if (outputElement) {
                    outputElement.textContent = inputElement.value.trim() !== "" ? inputElement.value : "...";
                }
                validateInput(inputElement);
                updateProgress();
            });

            // Validar al entrar/salir para asegurar el estado visual
            inputElement.addEventListener('blur', () => validateInput(inputElement));
            inputElement.addEventListener('focus', () => validateInput(inputElement));
        }
    });

    // Lógica para el Modal
    const modal = document.getElementById('modal-cv');
    const cvOriginal = document.querySelector('.resume-preview-container > div');
    const cvClonado = document.getElementById('cv-clonado');

    function abrirModal() {
        if (!cvOriginal || !cvClonado) return;
        cvClonado.innerHTML = cvOriginal.innerHTML;
        cvClonado.classList.remove('text-[10px]');
        cvClonado.classList.add('text-base');
        modal.classList.remove('hidden');
    }

    window.cerrarModal = () => modal.classList.add('hidden');

    document.querySelectorAll('button').forEach(btn => {
        if (btn.textContent.trim().includes('Descargar PDF')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                abrirModal();
            });
        }
    });

    // --- Lógica del Historial (CRUD) ---
    const sectionCV = document.getElementById('section-cv');
    const sectionHistorial = document.getElementById('section-historial');
    const listaHistorial = document.getElementById('lista-historial');
    const navLinks = document.querySelectorAll('aside nav a');

    function switchSection(target) {
        if (target === 'historial') {
            sectionCV.classList.add('hidden');
            sectionHistorial.classList.remove('hidden');
            cargarHistorial();
        } else {
            sectionCV.classList.remove('hidden');
            sectionHistorial.classList.add('hidden');
        }
        
        navLinks.forEach(link => {
            if (link.textContent.includes(target === 'historial' ? 'Historial' : 'CV')) {
                link.classList.add('bg-primary/10', 'text-primary', 'border-primary/20');
                link.classList.remove('text-slate-500', 'dark:text-slate-400');
            } else {
                link.classList.remove('bg-primary/10', 'text-primary', 'border-primary/20');
                link.classList.add('text-slate-500', 'dark:text-slate-400');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const isHistorial = link.textContent.includes('Historial');
            switchSection(isHistorial ? 'historial' : 'cv');
        });
    });

    function cargarHistorial() {
        fetch('listar.php')
            .then(res => res.json())
            .then(data => {
                listaHistorial.innerHTML = '';
                if (!Array.isArray(data) || data.length === 0) {
                    listaHistorial.innerHTML = '<p class="text-slate-500 text-center py-10">No hay registros guardados.</p>';
                    return;
                }
                data.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-sm';
                    card.innerHTML = `
                        <div>
                            <h4 class="font-bold text-slate-900 dark:text-white">${item.nombre} ${item.apellido}</h4>
                            <p class="text-sm text-slate-500">${item.titulo || 'Sin título'}</p>
                            <p class="text-xs text-slate-400">${item.email}</p>
                        </div>
                        <div class="flex gap-2">
                            <button onclick='modificarRegistro(${JSON.stringify(item)})' class="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                <span class="material-symbols-outlined">edit</span>
                            </button>
                            <button onclick="eliminarRegistro(${item.id})" class="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                                <span class="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    `;
                    listaHistorial.appendChild(card);
                });
            });
    }

    window.modificarRegistro = (item) => {
        document.getElementById('in-id').value = item.id;
        document.getElementById('in-nombre').value = item.nombre;
        document.getElementById('in-apellido').value = item.apellido;
        document.getElementById('in-email').value = item.email;
        document.getElementById('in-tel').value = item.telefono;
        document.getElementById('in-titulo').value = item.titulo;
        document.getElementById('in-linkedin').value = item.linkedin;
        document.getElementById('in-experiencia').value = item.experiencia;
        
        inputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.dispatchEvent(new Event('input'));
                validateInput(el); // Forzar marca visual al cargar
            }
        });
        switchSection('cv');
        Swal.fire({ icon: 'info', title: 'Modo edición', text: 'Datos cargados.', timer: 1000, showConfirmButton: false });
    };

    window.eliminarRegistro = (id) => {
        Swal.fire({
            title: '¿Eliminar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#137fec',
            confirmButtonText: 'Sí, borrar'
        }).then((result) => {
            if (result.isConfirmed) {
                const formData = new FormData();
                formData.append('id', id);
                fetch('eliminar.php', { method: 'POST', body: formData })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            cargarHistorial();
                            Swal.fire('Borrado', '', 'success');
                        }
                    });
            }
        });
    };

    const btnCV = document.getElementById('guardar');
    if (btnCV) {
        btnCV.addEventListener('click', (e) => {
            e.preventDefault();
            let allValid = true;
            inputs.forEach(id => { 
                if (!validateInput(document.getElementById(id))) allValid = false; 
            });

            if (allValid) {
                const formData = new FormData(document.getElementById('form-cv'));
                formData.append('Descargar', '1');
                
                fetch('guardar.php', { method: 'POST', body: formData })
                    .then(() => {
                        Swal.fire({ icon: 'success', title: '¡Guardado!', timer: 1500, showConfirmButton: false });
                        document.getElementById('form-cv').reset();
                        document.getElementById('in-id').value = '';
                        inputs.forEach(id => {
                            const el = document.getElementById(id);
                            el.dispatchEvent(new Event('input'));
                            el.classList.remove('border-green-500', 'border-red-500'); // Limpiar colores tras guardar
                        });
                        updateProgress();
                    });
            } else {
                Swal.fire({ icon: 'error', title: 'Campos inválidos', text: 'Por favor, corrige los campos marcados en rojo.' });
            }
        });
    }

    updateProgress();
});
