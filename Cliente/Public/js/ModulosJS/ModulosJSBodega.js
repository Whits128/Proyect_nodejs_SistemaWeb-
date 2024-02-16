// Declaración de variables
let opcion, id, codigo,nombre, ubicacion, estado, fila;

import { EntityClass } from "../EntityClass.js";
const api = new EntityClass();

$(document).ready(async function () {
    let tabla;

    try {
        // Obtener datos de bodega al cargar la página
        let bodega = await api.excuteGet('bodega');
        //obtener las acciones para validarla en los botones necesarios 

        var allowedActions = $("#Tabla").data("allowed-actions");
   
            tabla = $('#Tabla').DataTable({
                data: bodega,
                "pageLength": 5,
                "lengthMenu": [5, 10, 20, 100], // Opciones de cantidad de elementos por página
                "order": [[1, "asc"]],
                "autoWidth": true,
                columns: [
                    { data: "Codigo" },
                    { data: "Nombre" },
                    { data: "Ubicacion" },
                    { data: "Estado" },
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
                        
                            // Agregar el botón de eliminar si está permitido
                            if (eliminarPermitido) {
                                opcionesHTML += `
                                    <a class="dropdown-item btnBorrar" href="#">
                                        <i class="fas fa-trash-alt"></i> Borrar <!-- Icono para la opción de borrado -->
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
                
                ],
                columnDefs: [
                    {
                        targets: [0, 3],
                        visible: false,
                    },
                ],
                responsive: true,
                language: {
                    url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
                },
                // Resto de las opciones DataTable
            });
        

        // CREAR
        $("#btnCrear").click(function () {
            opcion = 'crear';
            id = null;
            $("#form").trigger("reset");
            $(".modal-header").css("background-color", "#23272b");
            $(".modal-header").css("color", "white");
            $(".modal-title").text("Crear Bodega");
            $('#modalCRUD').modal('show');
        });

        // EDITAR
        $(document).on("click", ".btnEditar", function () {
            opcion = 'editar';
            fila = $(this).closest("tr");
            var data = tabla.row(fila).data(); // Obtener los datos asociados a la fila
  
            codigo = data.Codigo;
            nombre = data.Nombre;
            ubicacion =data.Ubicacion;
            estado =data.Estado;
            $("#id").val(codigo);
            $("#nombre").val(nombre);
            $("#ubicacion").val(ubicacion);
            $("#estado").val(estado);
            $(".modal-header").css("background-color", "#7303c0");
            $(".modal-header").css("color", "white");
            $(".modal-title").text("Editar Bodega");
            $('#modalCRUD').modal('show');
        });

       // Dar de Baja
$(document).on("click", ".btnBorrar", async function () {
    fila = $(this).closest("tr");
    var data = tabla.row(fila).data(); // Obtener los datos asociados a la fila
  
    codigo = data.Codigo;
     estado = data.Estado;

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
            await api.excutePut(`bodega/dardebaja/${codigo}`);

            // Actualizar la tabla con las nuevas categorías
            const nuevasBodega = await api.excuteGet('bodega');
            tabla.clear().rows.add(nuevasBodega).draw();

            Swal.fire('¡Operación completada!', '', 'success');
        } catch (error) {
            console.error('Error al dar de baja:', error.message);
        }
    }
});

        // Submit para CREAR y EDITAR
        $('#form').submit(async function (e) {
            e.preventDefault();
            toastr.options = {
                closeButton: true,
                timeOut: 2500, // Duración total de visualización en milisegundos (ejemplo: 2 segundos)
                hideDuration: 300 ,// Duración de la animación de ocultar en milisegundos (ejemplo: 0.3 segundos)
                progressBar: true, 
                closeEasing :'swing',
                preventDuplicates: true
              };
            codigo = $.trim($('#id').val());
            nombre = $.trim($('#nombre').val());
            ubicacion = $.trim($('#ubicacion').val());
            estado = $("#estado").val();
  // Realizar validaciones
// Validar que el nombre contenga solo letras
// Validar que nombre y ubicación no estén vacíos
if (!nombre) {
    toastr.error('Por favor ingrese un nombre válido.');
    return;
}

if (!ubicacion) {
    toastr.error('Por favor ingrese una ubicación válida.');
    return;
}
const regex = /^[A-Za-z]+$/;
if (!nombre.match(regex)) {
    toastr.error('El nombre de la bodega solo puede contener letras.');
    return;
}

// Validar si ya existe una bodega con el mismo nombre y ubicación
const bodegaExistente = bodega.find(bodega => bodega.Nombre === nombre && bodega.Ubicacion === ubicacion);
console.log('bodegaExistente',bodegaExistente)
if (bodegaExistente) {
    toastr.error('Ya existe una bodega con el mismo nombre y ubicación.');
    return;
}


            try {
                if (opcion === 'crear') {
                    await api.excutePost('bodega', { nombre, ubicacion, estado });
                    toastr.success('La bodega se ha guardado correctamente.');

                } else if (opcion === 'editar') {
                    await api.excutePut(`bodega/${codigo}`, {nombre, ubicacion, estado });
                    toastr.success('La bodega se ha Editado correctamente.');

                }

                // Actualizar la tabla con las nuevas categorías
                const nuevasBodega = await api.excuteGet('bodega');
                tabla.clear().rows.add(nuevasBodega).draw();

                $('#modalCRUD').modal('hide');
            } catch (error) {
                console.error('Error al guardar/editar:', error.message);
            }
        });

    } catch (error) {
        console.error('Error general:', error.message);
    }
});
