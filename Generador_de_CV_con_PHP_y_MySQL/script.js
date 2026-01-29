document.addEventListener('DOMContentLoaded', () => {
    //Asocia el input con el output
    const mapping = {
        'in-nombre': 'out-nombre',
        'in-apellido': 'out-apellido',
        'in-email': 'out-email',
        'in-tel': 'out-tel',
        'in-titulo': 'out-titulo',
        'in-experiencia': 'out-experiencia',
        'in-linkedin' : 'out-linkedin'
    };

    //Función que actualiza
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
});
