import { EntityClass } from "../EntityClass.js";
const api = new EntityClass();

$(document).ready(async function () {
    let Tabla;
    try {
        const historialCF = await api.excuteGet('historial');
        console.log('historial', historialCF);

        // DataTable initialization Historial
        if (historialCF && historialCF.length > 0) {
            // DataTable initialization
            Tabla = $('#Tabla').DataTable({
                data: historialCF,
                "scrollX": true,
                "scrollCollapse": true,
                columns: [
                    { "data": "PKHistorial" },
                    { "data": "NombreLocal" },
                    { "data": "ColumnaModificada" },
                    {
                        "data": "ValorAntiguo",
                        "render": function (data, type, row) {
                            return renderizarImagenes(data, row.ColumnaModificada);
                        }
                    },
                    {
                        "data": "ValorNuevo",
                        "render": function (data, type, row) {
                            return renderizarImagenes(data, row.ColumnaModificada);
                        }
                    },
                    { "data": "FechaModificacion" },
                    { "data": "UsuarioModificacion" },
                    { "data": "TipoOperacion" },
                    {
                        "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-info btn-sm btnEditar'>Editar</button><button class='btn btn-danger btn-sm btnBorrar'>Dar de baja</button></div></div>"
                    }
                ],
                responsive: true,
                language: {
                    url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
                },
                // Resto de las opciones DataTable
            });
            
        } else {
            console.error('No hay datos de Historial disponibles.');
        }

        
        // Función para convertir datos hexadecimales a base64 y renderizar imágenes
function hexToBase64(hexString) {
    // Elimina el prefijo '0x' si está presente
    hexString = hexString.replace(/^0x/, '');

    // Convierte el string hexadecimal a un array de bytes
    var bytes = [];
    for (var i = 0; i < hexString.length; i += 2) {
        bytes.push(parseInt(hexString.substr(i, 2), 16));
    }

    // Convierte el array de bytes a un string base64
    var base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(bytes)));

    return base64String;
}
function renderizarImagenes(data, columnaModificada) {
    if (data !== null && data !== undefined && data !== '') {
        if (columnaModificada === 'LogoLocal') {
            // Si la columna modificada es 'LogoLocal', se espera que data sea un valor en formato hexadecimal
            return '<img src="data:image/jpeg;base64,' + hexToBase64(data) + '" alt="Imagen" style="width:50px;height:50px;">';
        } else if (columnaModificada === 'NombreNegocio' || columnaModificada === 'RUC' || columnaModificada === 'Telefonos' || columnaModificada === 'Correo' || columnaModificada === 'Direccion') {
            // Si la columna modificada es 'NombreNegocio', 'RUC', 'Telefonos', 'Correo' o 'Direccion', se espera que data sea el valor directo
            return data;
        } else {
            // En otros casos, simplemente retorna el valor sin cambios
            return '';
        }
    } else {
        // Si data es nulo, vacío o indefinido, retorna un valor vacío
        return '';
    }
}
        
            
          
    } catch (error) {
        console.error('Error general:', error.message);
    }
});
