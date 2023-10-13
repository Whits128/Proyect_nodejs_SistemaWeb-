/**
 * Crea opciones para un elemento select basado en un conjunto de datos.
 * @param {Array} Dataset - Conjunto de datos.
 * @param {HTMLSelectElement} Select - Elemento select donde se agregarán las opciones.
 * @param {string} Display - Propiedad a mostrar en las opciones.
 * @param {string} Value - Propiedad a usar como valor en las opciones.
 */
 export default  function CreateDropDown(Dataset = [], Select, Display = "", Value = "") {
    try {
        // Validar parámetros
        if (!Array.isArray(Dataset)) {
            console.error('Dataset debe ser un arreglo.');
            return;
        }

        if (!(Select instanceof HTMLElement)) {
            console.error('Select debe ser un elemento HTML.');
            return;
        }

        // Limpiar opciones previas
        Select.innerHTML = '';

        // Crear opciones
        Dataset.forEach((Item, Index) => {
            const Options = document.createElement("option");
            Options.innerText = Item[Display];
            Options.value = Item[Value];
            Select.appendChild(Options);
        });
    } catch (error) {
        console.error('Error en CreateDropDown:', error);
    }
}
