// Declaración de variables
let opcion, id, codigo,nombre, detalleMarca, estado, fila;

import { EntityClass } from "../EntityClass.js";
const api = new EntityClass();

$(document).ready(async function () {
    let tabla;

    try {
        // Obtener datos de categorías al cargar la página
        const Marcas = await api.excuteGet('marcas');
    //obtener las acciones para validarla en los botones necesarios 

    var allowedActions = $("#Tabla").data("allowed-actions");
        // DataTable initialization
    
            tabla = $('#Tabla').DataTable({
                data: Marcas,
                "pageLength": 5,
                "lengthMenu": [5, 10, 20, 100], // Opciones de cantidad de elementos por página
                "order": [[1, "asc"]],
                "autoWidth": true,
                columns: [
                    { data: "Codigo" },
                    { data: "Nombre" },
                    { data: "DetalleMarca", render: function (data, type, row) {
                        if (data.length > 30) {
                            return `${data.substr(0, 30)} <i class="fas fa-eye ver-mas-icon" title="${data}"></i>`;
                        } else {
                            return data;
                        }
                    } },
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
      
            $('#Tabla').on('mouseenter', '.ver-mas-icon', function () {
                $(this).tooltip({
                    title: $(this).attr('title'), // Usar el atributo title como contenido del tooltip
                    placement: 'top',
                    trigger: 'hover',
                    container: 'body',
                    html: true
                });
            });
        // CREAR
        $("#btnCrear").click(function () {
            opcion = 'crear';
            id = null;
            $("#form").trigger("reset");
            $(".modal-header").css("background-color", "#23272b");
            $(".modal-header").css("color", "white");
            $(".modal-title").text("Crear Marca");
            $('#modalCRUD').modal('show');
        });

        // EDITAR
        $(document).on("click", ".btnEditar", function () {
            opcion = 'editar';
            fila = $(this).closest("tr");
            var data = tabla.row(fila).data(); // Obtener los datos asociados a la fila
  
            codigo = data.Codigo;
            nombre = data.Nombre;
            detalleMarca= data.DetalleMarca;
            estado = data.Estado;

            $("#id").val(codigo);
            $("#nombre").val(nombre);
            $("#detalleMarca").val(detalleMarca);
            $("#estado").val(estado);
            $(".modal-header").css("background-color", "#7303c0");
            $(".modal-header").css("color", "white");
            $(".modal-title").text("Editar Marca");
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
            await api.excutePut(`marcas/dardebaja/${codigo}`);

            // Actualizar la tabla con las nuevas categorías
            const nuevasmarcas= await api.excuteGet('marcas');
            tabla.clear().rows.add(nuevasmarcas).draw();

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
            nombre = $.trim($('#nombre').val());
            detalleMarca = $.trim($('#detalleMarca').val());
            estado = $("#estado").val();
        
            // Expresión regular para verificar que el nombre contiene solo letras
            const regexSoloLetras = /^[A-Za-z]+$/;
        
            try {
                // Validar que los campos no estén vacíos
                if (!nombre || !detalleMarca) {
                    toastr.error('Por favor complete todos los campos.');
                    return;
                }
        
                // Validar que el nombre solo contenga letras
                if (!nombre.match(regexSoloLetras)) {
                    toastr.error('El nombre solo puede contener letras.');
                    return;
                }
        
                // Validar límite de caracteres para detalleMarca
                const limiteDetalleMarca = 50; // Establecer el límite de caracteres
                if (detalleMarca.length > limiteDetalleMarca) {
                    toastr.error(`El detalle de la marca debe tener como máximo ${limiteDetalleMarca} caracteres.`);
                    return;
                }
        
                // Validar que el nombre de la marca no esté duplicado
               
// Validar que el nombre de la marca no esté duplicado
const marcaExistente = Marcas.find(marca => marca.Nombre.toLowerCase() === nombre.toLowerCase());

                console.log( 'marcaExistente:',marcaExistente)
                if (marcaExistente) {
                    toastr.error('El nombre de marca especificado ya está en uso.');
                    return;
                }
        
                if (opcion === 'crear') {
                    await api.excutePost('marcas', { nombre, detalleMarca, estado });
                } else if (opcion === 'editar') {
                    await api.excutePut(`marcas/${codigo}`, { nombre, detalleMarca, estado });
                }
        
                // Actualizar la tabla con las nuevas marcas
                const nuevasMarcas = await api.excuteGet('marcas');
                tabla.clear().rows.add(nuevasMarcas).draw();
        
                $('#modalCRUD').modal('hide');
            } catch (error) {
                console.error('Error al guardar/editar:', error.message);
            }
        });
        

    } catch (error) {
        console.error('Error general:', error.message);
    }
});
