
// Declaración de variables
let opcion,id, codigo,nombreNegocio, ruc, telefonos, correo, direccion, usuarioModificacion, tipoOperacion ,estado, fila;

import { EntityClass } from "../EntityClass.js";
const api = new EntityClass();
let Tabla;
window.onload = async () => {

   
    try {
const configuracion = await api.excuteGet('configuraciones');
console.log('configuracion',configuracion);
// DataTable initialization Configuracion.
if (configuracion && configuracion.length > 0) {
    Tabla = $('#Tabla').DataTable({
        // Configuración de la tabla
        data: configuracion|| [] ,
        "scrollX": true,
        "scrollCollapse": true,
        columns: [
            { "data": "Codigo" },
            { "data": "NombreNegocio" },
            { 
            
            "data": "LogoLocal",
            render: function (data, type, row) {
                // Asegúrate de que LogoLocal es una cadena base64
                if (data && typeof data === 'string') {
                    return '<img src="data:image/png;base64,' + data + '" alt="Logo" height="50">';
                } else {
                    return 'Imagen no válida';
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
          
                opcion = 'editar';
                fila = $(this).closest("tr");	        
                codigo = parseInt(fila.find('td:eq(0)').text());
                nombreNegocio = fila.find('td:eq(1)').text();
                ruc = fila.find('td:eq(3)').text();
                telefonos = fila.find('td:eq(4)').text();
                correo = fila.find('td:eq(5)').text();
                direccion = fila.find('td:eq(6)').text();
                
                // Accede a la columna 'FechaModificacion'
                const fechaModificacion = fila.find('td:eq(' + Tabla.column('FechaModificacion:name').index() + ')').text();
        
                // Accede a la columna 'UsuarioModificacion'
                const usuarioModificacion = fila.find('td:eq(' + Tabla.column('UsuarioModificacion:name').index() + ')').text();
        
                // Establece los valores en el formulario
                $("#id").val(codigo);
                $("#nombreNegocio").val(nombreNegocio);
                $("#ruc").val(ruc);
                $("#telefonos").val(telefonos);
                $("#correo").val(correo);
                $("#direccion").val(direccion);
                $("#fechaModificacion").val(fechaModificacion);
                $("#usuarioModificacion").val(usuarioModificacion);
        
                // Muestra el modal después de asignar los valores
                $(".modal-header").css("background-color", "#7303c0");
                $(".modal-header").css("color", "white");
                $(".modal-title").text("Editar Configuracion");
                $('#modalCRUD').modal('show');
        
            
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
            Tabla.clear().rows.add(nuevasconfiguracion).draw();

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
console.log('usuarioModificacion',usuarioModificacion);

    var formData = new FormData();
    formData.append('nombreNegocio', nombreNegocio);
    formData.append('ruc', ruc);
    formData.append('telefonos', telefonos);
    formData.append('correo', correo);
    formData.append('direccion', direccion);

    formData.append('usuarioModificacion', usuarioModificacion);
 
    // Agrega el campo de archivo correctamente
    formData.append('logoLocal', $('#logoLocal')[0].files[0]);
  // Verifica si logoLocal está presente en FormData
  if (!formData.has('logoLocal')) {
    console.error('Campo logoLocal no presente en FormData o sin valor.');
    // Puedes mostrar un mensaje de error al usuario si es necesario
    return;
}
    console.log("Datos a enviar:", formData);

    try {
        if (opcion === 'crear') {
            await api.excutePostConfiguracion('configuracion/post', formData);
            
        } else if (opcion === 'editar') {
                await api.excutePutConfiguracion(`configuracion/${codigo}`, formData);  
        }
        $('#modalCRUD').modal('hide');
// Actualizar la tabla de configuraciones
const nuevasConfiguraciones = await api.excuteGet('configuraciones');
Tabla.clear().rows.add(nuevasConfiguraciones).draw();
console.log('nuevasConfiguraciones',nuevasConfiguraciones);


        // Recargar toda la vista después de la operación
        location.reload();

            } catch (error) {
                console.error('Error al guardar/editar:', error.message);
            }
           
        });



    } catch (error) {
        console.error('Error general:', error.message);
    }
}
