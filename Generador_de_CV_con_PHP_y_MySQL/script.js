document.addEventListener('DOMContentLoaded', () => {
    //Mapeo de los outputs e inputs
    const mapping = {
        'in-nombre': 'out-nombre',
        'in-apellido': 'out-apellido',
        'in-email': 'out-email',
        'in-tel': 'out-tel',
        'in-titulo': 'out-titulo',
        'in-experiencia': 'out-experiencia',
        'in-linkedin': 'out-linkedin'
    };

    Object.keys(mapping).forEach(inputId => {
        const inputElement = document.getElementById(inputId);
        const outputElement = document.getElementById(mapping[inputId]);

        if (inputElement && outputElement) {
            inputElement.addEventListener('input', () => {
                outputElement.textContent = inputElement.value.trim() !== ""
                    ? inputElement.value
                    : "...";
            });
        }
    });

    //Lógica para el Modal
    const modal = document.getElementById('modal-cv');
    const cvOriginal = document.querySelector('.resume-preview-container > div');
    const cvClonado = document.getElementById('cv-clonado');
    //Seleccionamos el botón de guardar por su texto
    const btnGuardar = document.querySelector('button.bg-primary.text-white.font-bold');

    function abrirModal() {
        //Copiamos el contenido del CV lateral al modal
        cvClonado.innerHTML = cvOriginal.innerHTML;
        //Quitamos la clase de texto pequeño del original para que en el modal se vea normal
        cvClonado.classList.remove('text-[10px]');
        cvClonado.classList.add('text-base'); //Tamaño de letra legible

        modal.classList.remove('hidden');
    }

    window.cerrarModal = () => {
        modal.classList.add('hidden');
    };

    if (btnGuardar) {
        btnGuardar.addEventListener('click', abrirModal);
    }
});
const btnCV = document.getElementById('guardar')
btnCV.addEventListener('click', () => {
    Swal.fire({
        position: "mid",
        icon: "success",
        title: "Ha sido guardado correctamente",
        showConfirmButton: false,
        timer: 1500
    });
})
