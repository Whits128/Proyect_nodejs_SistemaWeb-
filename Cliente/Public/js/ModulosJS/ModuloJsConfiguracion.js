// Declaración de variables
let opcion,id, configuraciones,logoLocalBase64, codigo,nombreNegocio, ruc, telefonos, correo, direccion, usuarioModificacion, tipoOperacion ,estado, fila;

import { EntityClass } from "../EntityClass.js";
const api = new EntityClass();

$(document).ready(async function () {
    let tabla;

    try {
const historialCF = await api.excuteGet('historial');


// DataTable initialization Historial
if (historialCF && historialCF.recordset && historialCF.recordset.length > 0) {
    tabla = $('#Tabla').DataTable({
        data: historialCF.recordset,
        "scrollX": true, // Habilita el scroll horizontal
    "scrollCollapse": true, // Colapso de scroll si no es necesario
                     
        columns: [
            { "data": "PKHistorial" },
            { "data": "NombreLocal" },
            { "data": "ColumnaModificada" },
            {
                "data": "ValorAntiguo",
                "render": function (data) {
                    return renderizarValor(data);
                }
            },
            {
                "data": "ValorNuevo",
                "render": function (data) {
                    return renderizarValor(data);
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



const configuracion = await api.excuteGet('configuraciones');

// Verificar si hay configuraciones y ocultar el botón si es necesario
if (configuracion && configuracion.length > 0) {
    // Ocultar el botón de crear si ya existe una configuración
    $("#btnCrear").hide();
}

// DataTable initialization Configuracion.
if (configuracion && configuracion.length > 0) {
    let TablaConfig = $('#TablaConfig').DataTable({
        // Configuración de la tabla
        data: configuracion,
        "scrollX": true,
        "scrollCollapse": true,
        columns: [
            {"data":"Codigo"},
            { "data": "NombreNegocio" },
            {
                "data": "LogoLocal",
                "render": function (data) {
                    // Verifica si hay datos en la imagen
                    if (data) {
                        // Crea un elemento de imagen con la fuente de datos
                        return `<img src="data:image/jpeg;base64,${data}" alt="Logo" style="width:50px;height:50px;">`;
                    } else {
                        return "Sin imagen";
                    }
                }
            },
            { "data": "RUC" },
            { "data": "Telefonos" },
            { "data": "Correo" },
            { "data": "Direccion" },
            { "data": "FechaModificacion" },
            { "data": "UsuarioModificacion" },
            {
                "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-info btn-sm btnEditar'>Editar</button><button class='btn btn-danger btn-sm btnBorrar'>Dar de baja</button></div></div>"
            }
        ],
        responsive: true,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
        },
    });

    // Mostrar la vista de configuración por defecto
    mostrarVista('vista1'); // Cambia 'vista1' por el ID de tu vista de configuración
} else {
    console.error('No hay datos de Configuracion disponibles.');
}

function renderizarValor(data) {
    // Verifica si el valor es un número
    if (!isNaN(data)) {
        return data; // Renderiza el número directamente
    } else if (esBase64(data)) {
        // Verifica si el valor es base64 y renderiza como imagen
        return `<img src="data:image/jpeg;base64,${data}" alt="Imagen" style="width:50px;height:50px;">`;
    } else {
        return data; // Renderiza otros tipos de datos directamente
    }
}

    
        function esBase64(str) {
            // Verifica si el formato parece ser base64
            const base64FormatRegex = /^[A-Za-z0-9+/]+={0,2}$/;
            
            // Intenta decodificar solo si el formato parece ser base64
            if (base64FormatRegex.test(str)) {
                try {
                    return btoa(atob(str)) == str;
                } catch (err) {
                    return false;
                }
            }
        
            return false;
        }
        
        // CREAR
        $("#btnCrear").click(function () {
            opcion = 'crear';
            id = null;
            $("#form").trigger("reset");
            $(".modal-header").css("background-color", "#23272b");
            $(".modal-header").css("color", "white");
            $(".modal-title").text("Crear Configuracion");
            $('#modalCRUD').modal('show');
        });
        $(document).on("click", ".btnEditar", function () {
            try {
                opcion = 'editar';
                fila = $(this).closest("tr");	        
                codigo = parseInt(fila.find('td:eq(0)').text());
                nombreNegocio = fila.find('td:eq(1)').text();
                ruc = fila.find('td:eq(3)').text();
                telefonos = fila.find('td:eq(4)').text();
                correo = fila.find('td:eq(5)').text();
                direccion = fila.find('td:eq(6)').text();
        
                // Establece los valores en el formulario
                $("#id").val(codigo);
                $("#nombreNegocio").val(nombreNegocio);
                $("#ruc").val(ruc);
                $("#telefonos").val(telefonos);
                $("#correo").val(correo);
                $("#direccion").val(direccion);
        
                // Muestra el modal después de asignar los valores
                $(".modal-header").css("background-color", "#7303c0");
                $(".modal-header").css("color", "white");
                $(".modal-title").text("Editar Configuracion");
                $('#modalCRUD').modal('show');
        
                // Verifica si ya hay una imagen existente y configúrala para la edición
                const imagenExistente = fila.find('td:eq(2) img');
                if (imagenExistente.length > 0) {
                    // Obtiene el nombre de la imagen desde el atributo 'alt'
                    const nombreImagen = imagenExistente.attr('alt');
                    // Muestra el nombre de la imagen en un lugar específico (puedes adaptar esto según tu estructura HTML)
                    $('#nombreImagenExistente').text(nombreImagen);
                } else {
                    // Limpia el lugar donde se muestra el nombre de la imagen si no hay imagen existente
                    $('#nombreImagenExistente').text('');
                }
        
            } catch (error) {
                console.error('Error al editar:', error.message);
            }
        });
        
        
       // Dar de Baja
$(document).on("click", ".btnBorrar", async function () {
    fila = $(this).closest("tr");
    estado = fila.find('td:eq(7)').text();
    codigo = parseInt(fila.find('td:eq(0)').text());

    // Muestra un cuadro de diálogo de confirmación
    const confirmacion = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta operación no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, estoy seguro',
        cancelButtonText: 'Cancelar',
    });

    // Si el usuario confirma
    if (confirmacion.isConfirmed) {
        try {
            await api.excutePut(`configuracion/dardebaja/${codigo}`);

            // Actualizar la tabla con las nuevas configuracion
            const nuevasconfiguracion= await api.excuteGet('configuracion');
            TablaConfig.clear().rows.add(nuevasconfiguracion).draw();

            Swal.fire('¡Operación completada!', '', 'success');
        } catch (error) {
            console.error('Error al dar de baja:', error.message);
        }
    }
});




 // Submit para CREAR y EDITAR
$('#form').submit(async function (e) {
    e.preventDefault();


    codigo = $.trim($('#id').val());
    nombreNegocio = $.trim($('#nombreNegocio').val());
    ruc = $.trim($('#ruc').val());
    telefonos = $("#telefonos").val();
    correo = $.trim($('#correo').val());
    direccion = $("#direccion").val();
 
    usuarioModificacion = $.trim($('#usuarioModificacion').val());


    var formData = new FormData();
    formData.append('nombreNegocio', nombreNegocio);
    formData.append('ruc', ruc);
    formData.append('telefonos', telefonos);
    formData.append('correo', correo);
    formData.append('direccion', direccion);

    formData.append('usuarioModificacion', usuarioModificacion);
 
    // Agrega el campo de archivo correctamente
    formData.append('logoLocal', $('#logoLocal')[0].files[0]);

    console.log("Datos a enviar:", formData);

    try {
        if (opcion === 'crear') {
            await api.excutePostConfiguracion('configuracion', formData);
            
        } else if (opcion === 'editar') {
                await api.excutePutConfiguracion(`configuracion/${codigo}`, formData);  
        }
        $('#modalCRUD').modal('hide');
   

    } catch (error) {
        console.error('Error al guardar/editar:', error.message);
    }
});


    } catch (error) {
        console.error('Error general:', error.message);
    }
});
