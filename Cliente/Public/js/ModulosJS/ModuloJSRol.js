// Declaración de variables
let opcion, id, codigo,nombre, detalleMarca, estado, fila;

import { EntityClass } from "../EntityClass.js";
const api = new EntityClass();

$(document).ready(async function () {
    let tabla;

    try {
        // Obtener datos de Rol al cargar la página
        const Rol = await api.excuteGet('rol');
 //obtener las acciones para validarla en los botones necesarios 

 var allowedActions = $("#Tabla").data("allowed-actions");
     
        // DataTable initialization

            tabla = $('#Tabla').DataTable({
                data: Rol,
                "pageLength": 5,
                "lengthMenu": [5, 10, 20, 100], // Opciones de cantidad de elementos por página
                "order": [[1, "asc"]],
                "autoWidth": true,  
                columns: [
                    { data: "Codigo" },
                    { data: "Nombre" },
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
                        
                    }                  ],
                columnDefs: [
                    {
                        targets: [0, 2],
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
            $(".modal-title").text("Crear Rol");
            $('#modalCRUD').modal('show');
        });

        // EDITAR
        $(document).on("click", ".btnEditar", function () {
            opcion = 'editar';
            fila = $(this).closest("tr");
            var data = tabla.row(fila).data(); // Obtener los datos asociados a la fila
  
            codigo = data.Codigo;
            nombre = data.Nombre;
            estado = data.Estado;           
            $("#id").val(codigo);
            $("#nombre").val(nombre);
            $("#estado").val(estado);
            $(".modal-header").css("background-color", "#7303c0");
            $(".modal-header").css("color", "white");
            $(".modal-title").text("Editar Rol");
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
            await api.excutePut(`rol/dardebaja/${codigo}`);

            // Actualizar la tabla con las nuevas categorías
            const nuevasrol= await api.excuteGet('rol');
            tabla.clear().rows.add(nuevasrol).draw();

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
                timeOut: 2500,
                hideDuration: 300,
                progressBar: true,
                closeEasing: 'swing',
                preventDuplicates: true
            };
            codigo = $.trim($('#id').val());
            nombre = $.trim($('#nombre').val());
            estado = $("#estado").val() ;   

            try {

        // Validar que el campo de nombre del rol no esté vacío
        if (!nombre) {
            toastr.error('Por favor ingrese el nombre del rol.');
            return;
        }

        // Validar que el campo de nombre del rol solo contenga letras
        const regexSoloLetras = /^[A-Za-z\s]+$/;
        if (!nombre.match(regexSoloLetras)) {
            toastr.error('El nombre del rol solo puede contener letras y espacios.');
            return;
        }


        const rolDuplicado = Rol.some(rol => rol.Nombre.toLowerCase() === nombre.toLowerCase());

        // Si el nombre del rol ya existe, mostrar un mensaje de error y detener la ejecución
        if (rolDuplicado) {
            toastr.error('El nombre del rol ya existe.');
            return;
        }


                if (opcion === 'crear') {
                    await api.excutePost('rol',{nombre, estado });
                    toastr.success('Se ha guardado correctamente.');

                } else if (opcion === 'editar') {
                    await api.excutePut(`rol/${codigo}`, {nombre,estado });
                    toastr.success('Se ha editado correctamente.');
                }

                // Actualizar la tabla con las nuevas rol
                const nuevasrol= await api.excuteGet('rol');
                tabla.clear().rows.add(nuevasrol).draw();

                $('#modalCRUD').modal('hide');
            } catch (error) {
                console.error('Error al guardar/editar:', error.message);
            }
        });

    } catch (error) {
        console.error('Error general:', error.message);
    }
});
