/**
 * Crea opciones para un elemento select basado en un conjunto de datos.
 * @param {Array} Dataset - Conjunto de datos.
 * @param {HTMLSelectElement} Select - Elemento select donde se agregarán las opciones.
 * @param {string} Display - Propiedad a mostrar en las opciones.
 * @param {string} Value - Propiedad a usar como valor en las opciones.
 */
export default function CreateDropDown(Dataset = [], Select, Display = "", Value = "") {
    try {
        // Validar parámetros
        if (!Array.isArray(Dataset) || !Dataset.length || !(Select instanceof HTMLElement)) {
            console.error('Parámetros inválidos para CreateDropDown.');
            return;
        }

        // Limpiar opciones previas
        Select.innerHTML = '';

        // Crear opciones
        Dataset.forEach((Item, Index) => {
            const Options = document.createElement("option");

            // Verificar existencia de propiedades Display y Value
            if (Item.hasOwnProperty(Display) && Item.hasOwnProperty(Value)) {
                Options.innerText = Item[Display];
                Options.value = Item[Value];
            } else {
                console.error(`Las propiedades ${Display} y ${Value} no existen en el elemento ${Index} del Dataset.`);
                return;
            }

            Select.appendChild(Options);
        });
    } catch (error) {
        console.error('Error en CreateDropDown:', error);
    }
}
