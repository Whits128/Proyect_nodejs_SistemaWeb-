import { EntityClass } from "../EntityClass.js";
const api = new EntityClass();

$(document).ready(async function () {
    try {
        const historialCF = await api.excuteGet('historial');
  // Agregar un controlador de eventos de clic al botón "Ver Configuracion"
  $("#btnVerConfiguracior").click(function() {
    // Redirigir al usuario a la vista de Configuracion
    window.location.href = "/api/configuracion/page";
});
        const Tabla = $('#TablaHistorial').DataTable({
            data: historialCF,
            "scrollX": true,
            "scrollCollapse": true,
            "pageLength": 5,
            "lengthMenu": [5, 10, 20, 100], // Opciones de cantidad de elementos por página
            "order": [[1, "asc"]],
            "autoWidth": true,
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
                { "data": "FechaModificacion","render": function(data) {
                    // Utilizar Moment.js para formatear la fecha
                    return moment(data).format('DD/MM/YYYY ');
                } },
                { "data": "UsuarioModificacion" },
                { "data": "TipoOperacion" },
              
            ],
            columnDefs: [
                {
                    targets: [0, 1],
                    visible: false,
                },
            ],
            responsive: true,
            language: {
                url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
            },
        });

        // Función para convertir datos hexadecimales a base64 y renderizar imágenes
        function hexToBase64(hexString) {
            // Elimina el prefijo '0x' si está presente
            hexString = hexString.replace(/^0x/, '');
        
            // Convierte el string hexadecimal a un array de bytes
            const bytes = new Uint8Array(hexString.length / 2);
            for (let i = 0; i < hexString.length; i += 2) {
                bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
            }
        
            // Convierte el array de bytes a un string base64
            let binaryString = '';
            bytes.forEach(byte => {
                binaryString += String.fromCharCode(byte);
            });
            const base64String = btoa(binaryString);
        
            return base64String;
        }
        
        
        function renderizarImagenes(data, columnaModificada) {
            if (data !== null && data !== undefined && data !== '') {
                if (columnaModificada === 'LogoLocal') {
                    // If the modified column is 'LogoLocal', expect data to be a hexadecimal value
                    return '<img src="data:image/jpeg;base64,' + hexToBase64(data) + '" alt="Imagen" style="width:50px;height:50px;">';
                } else if (columnaModificada === 'NombreNegocio' || columnaModificada === 'RUC' || columnaModificada === 'Telefonos' || columnaModificada === 'Correo' || columnaModificada === 'Direccion') {
                    // If the modified column is 'NombreNegocio', 'RUC', 'Telefonos', 'Correo', or 'Direccion', expect data to be the direct value
                    return data;
                } else {
                    // In other cases, simply return the value without changes
                    return ''; // or any default value you want to return
                }
            } else {
                // If data is null, empty, or undefined, return an empty value
                return 'Sin cambios';
            }
        }

    } catch (error) {
        console.error('Error general:', error.message);
    }
});
