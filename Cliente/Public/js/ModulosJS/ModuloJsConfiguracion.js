
// Declaración de variables
let opcion,id, codigo,nombreNegocio, ruc, telefonos, correo, direccion, usuarioModificacion, tipoOperacion ,estado, fila;

import { EntityClass } from "../EntityClass.js";
const api = new EntityClass();

window.onload = async () => {

    let Tabla;
    try {
const configuracion = await api.excuteGet('configuraciones');
 //obtener las acciones para validarla en los botones necesarios 

 var allowedActions = $("#Tabla").data("allowed-actions");
// DataTable initialization Configuracion.

    Tabla = $('#Tabla').DataTable({
        // Configuración de la tabla
        data: configuracion|| [] ,
 
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
            { "data": "RUC",
            render: function (data, type, row) {
                if (data.length > 15) {
                    return `${data.substr(0, 15)} <i class="fas fa-eye ver-mas-icon" title="${data}"></i>`;
                } else {
                    return data;
                }
            }
         },
            { "data": "Telefonos" },
            { "data": "Correo",
            render: function (data, type, row) {
                if (data.length > 15) {
                    return `${data.substr(0, 15)} <i class="fas fa-eye ver-mas-icon" title="${data}"></i>`;
                } else {
                    return data;
                }
            } },
            { "data": "Direccion",
            render: function (data, type, row) {
                if (data.length > 15) {
                    return `${data.substr(0, 15)} <i class="fas fa-eye ver-mas-icon" title="${data}"></i>`;
                } else {
                    return data;
                }
            } },
            { "data": "FechaModificacion", "render": function(data) {
                // Utilizar Moment.js para formatear la fecha
                return moment(data).format('DD/MM/YYYY ');
            } },
            { "data": "UsuarioModificacion" },
            {
                "render": function (data, type, row) {
                    // Verificar si la acción de editar está permitida
                    const editarPermitido = allowedActions.some(accion => accion.Accion === 'Editar');
                    
                    // Verificar si la acción de eliminar está permitida
                    const eliminarPermitido = allowedActions.some(accion => accion.Accion === 'Eliminar');
                
                    // Crear el HTML para los botones según las validaciones
                    let opcionesHTML = `
                        <div class="text-center">
                            <div class="dropdown">
                                <button id="btnOpciones" class="btn btn-secondary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fas fa-cogs"></i>
                                    <span class="tooltip_opcion">Opciones</span>
                                </button>
                                <div id="dropdown-menu_optiones" class="dropdown-menu" aria-labelledby="dropdownMenuButton">`;
                
                    // Agregar el botón de editar si está permitido
                    if (editarPermitido) {
                        opcionesHTML += `
                            <a class="dropdown-item btnEditar" href="#">
                                <i class="fas fa-edit"></i> Editar <!-- Icono para la opción de edición -->
                            </a>`;
                    }
                
                
                    // Cerrar las etiquetas HTML
                    opcionesHTML += `
                                </div>
                            </div>
                        </div>`;
                
                    // Retornar el HTML generado para los botones de opciones
                    return opcionesHTML;
                }
                
            }
        ],  columnDefs: [
            {
                targets: [0, 4,5],
                visible: false,
            },
        ],
        responsive: true,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
        },
    });
    $('#Tabla').on('mouseenter', '.ver-mas-icon', function () {
        $(this).tooltip({
            title: $(this).attr('title'), // Usar el atributo title como contenido del tooltip
            placement: 'top',
            trigger: 'hover',
            container: 'body',
            html: true
        });
    });

// Verificar si la tabla tiene datos
if (Tabla.rows().count() > 0) {
    $("#btnCrear").prop("disabled", true);
} else {
    console.log('La tabla está vacía.');
}

  // Agregar un controlador de eventos de clic al botón "Ver Historial"
  $("#btnVerHistorial").click(function() {
    // Redirigir al usuario a la vista de historial
    window.location.href = "/api/historial/page";
});
// Captura el evento de pasar el cursor sobre la imagen en la DataTable
$('#Tabla').on('mouseover', 'td img', function() {
    // Obtiene la URL de la imagen
    var imgUrl = $(this).attr('src');
    
    // Actualiza la imagen en el contenedor de zoom
    $('#imagenZoom').attr('src', imgUrl);
    
    // Muestra el contenedor de zoom
    $('#imagenZoomContainer').show();
});
   // Captura el evento de alejar el cursor de la imagen en la DataTable
   $('#Tabla').on('mouseleave', 'td img', function() {
    // Oculta el contenedor de zoom
    $('#imagenZoomContainer').hide();
});
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
                var data = Tabla.row(fila).data(); // Obtener los datos asociados a la fila
  
                codigo = data.Codigo;	        
                nombreNegocio = data.NombreNegocio;
                ruc = data.RUC;
                telefonos = data.Telefonos;
                correo = data.Correo;
                direccion = data.Direccion;
                // Accede a la columna 'FechaModificacion'
                const fechaModificacion = data.FechaModificacion;
        
                // Accede a la columna 'UsuarioModificacion'
                const usuarioModificacion = data.UsuarioModificacion;
        
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
