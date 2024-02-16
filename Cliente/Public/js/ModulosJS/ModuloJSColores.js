// Declaración de variables
let opcion, id, codigo,color, estado, fila;

import { EntityClass } from "../EntityClass.js";
const api = new EntityClass();

$(document).ready(async function () {
    let tabla;

    try {
        // Obtener datos de categorías al cargar la página
        const colores = await api.excuteGet('color');
    //obtener las acciones para validarla en los botones necesarios 

    var allowedActions = $("#Tabla").data("allowed-actions");
        // DataTable initialization
     
            tabla = $('#Tabla').DataTable({
                data: colores,
                "pageLength": 5,
                "lengthMenu": [5, 10, 20, 100], // Opciones de cantidad de elementos por página
                "order": [[1, "asc"]],
                "autoWidth": true,
                columns: [
                    { data: "Codigo" },
                    { data: "Color" },
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
                        
                    }                ],
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
            $(".modal-title").text("Crear Color");
            $('#modalCRUD').modal('show');
        });

        // EDITAR
        $(document).on("click", ".btnEditar", function () {
            opcion = 'editar';
            fila = $(this).closest("tr");
            var data = tabla.row(fila).data(); // Obtener los datos asociados a la fila
  
            codigo = data.Codigo;
            color = data.Color;
            estado = data.Estado;
            $("#id").val(codigo);
            $("#color").val(color);
            $("#estado").val(estado);
            $(".modal-header").css("background-color", "#7303c0");
            $(".modal-header").css("color", "white");
            $(".modal-title").text("Editar Color");
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
            await api.excutePut(`color/dardebaja/${codigo}`);

            // Actualizar la tabla con las nuevas categorías
            const nuevascolor= await api.excuteGet('color');
            tabla.clear().rows.add(nuevascolor).draw();

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
        
            // Obtener valores del formulario
            const codigo = $.trim($('#id').val());
            const color = $.trim($('#color').val());
            const estado = $("#estado").val();
            const regex = /^[A-Za-z]+$/;
            try {
                // Validaciones
                if (!color) {
                    toastr.error('Por favor ingrese un color válido.');
                    return;
                }

              
// Validar que el nombre solo contenga letras

if (!color.match(regex)) {
    toastr.error('El color solo puede contener letras.');
    return;
}

        
                     // Realizar una consulta para verificar si ya existe un color con el mismo nombre
        const colorExistente = colores.find(c => c.Color === color);
        if (colorExistente) {
            toastr.error('Ya existe un color con el mismo nombre.');
            return;
        }
        
                // Enviar la solicitud al servidor para crear o editar el color
                if (opcion === 'crear') {
                    await api.excutePost('color', { color, estado });
                    toastr.success('El color se ha guardado correctamente.');
                } else if (opcion === 'editar') {
                    await api.excutePut(`color/${codigo}`, { color, estado });
                    toastr.success('El color se ha editado correctamente.');
                }
        
                // Actualizar la tabla con los nuevos colores
                const nuevosColores = await api.excuteGet('color');
                tabla.clear().rows.add(nuevosColores).draw();
        
                // Cerrar el modal
                $('#modalCRUD').modal('hide');
            } catch (error) {
               
                toastr.error('Algo salio Mal.');
            }
        });
        

    } catch (error) {
        console.error('Error general:', error.message);
    }
});
