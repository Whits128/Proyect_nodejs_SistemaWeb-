// Declaración de variables
let opcion, id, codigo,nombre, descripcion, tipoMaterial, tipodeCostura, tipoSuela, fabricante, observaciones, estado, fila;

import { EntityClass } from "../EntityClass.js";
const api = new EntityClass();

$(document).ready(async function () {
    let tabla;

    try {
        // Obtener datos de materialesZapatos al cargar la página
        const MaterialZapato = await api.excuteGet('materialesZapatos');
    //obtener las acciones para validarla en los botones necesarios 

    var allowedActions = $("#Tabla").data("allowed-actions");
     
        // DataTable initialization
            tabla = $('#Tabla').DataTable({
                data: MaterialZapato,
                "pageLength": 5,
                "lengthMenu": [5, 10, 20, 100], // Opciones de cantidad de elementos por página
                "order": [[1, "asc"]],
                "autoWidth": true,         
                columns: [
                    { "data": "Codigo" },
                    {"data": "Nombre"},
                        {"data": "Descripcion",   render: function (data, type, row) {
                            if (data.length > 15) {
                                return `${data.substr(0, 15)} <i class="fas fa-eye ver-mas-icon" title="${data}"></i>`;
                            } else {
                                return data;
                            }
                        }},
                        {"data": "TipoMaterial"},
                        {"data": "TipodeCostura" ,className: "custom-column2"},
                        {"data": "TipoSuela",className: "custom-column2"},
                        {"data": "Fabricante"},
                        {"data": "Observaciones",
                        render: function (data, type, row) {
                            if (data.length > 15) {
                                return `${data.substr(0, 15)} <i class="fas fa-eye ver-mas-icon" title="${data}"></i>`;
                            } else {
                                return data;
                            }
                        }},
                         {"data":"Estado"},
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
                            
                        }                // Ocultar columnas
    
                ],
                columnDefs: [
                    {
                        targets: [0, 8],
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
        // CREAR
        $("#btnCrear").click(function () {
            opcion = 'crear';
            id = null;
            $("#form").trigger("reset");
            $(".modal-header").css("background-color", "#23272b");
            $(".modal-header").css("color", "white");
            $(".modal-title").text("Crear Materiales Zapatos");
            $('#modalCRUD').modal('show');
        });

        // EDITAR
        $(document).on("click", ".btnEditar", function () {
            opcion = 'editar';
            fila = $(this).closest("tr");
            var data = tabla.row(fila).data(); // Obtener los datos asociados a la fila
  
                 codigo = data.Codigo;
                nombre = data.Nombre;
                  descripcion =data.Descripcion;
                    tipoMaterial =data.TipoMaterial;
                    tipodeCostura =data.TipodeCostura;
                    tipoSuela = data.TipoSuela;
                    fabricante =data.Fabricante;
                    observaciones =data.Observaciones;
                    estado = data.Estado;

                    $("#id").val(codigo);
            $('#nombre').val(nombre);
            $('#descripcion').val(descripcion);
            $('#tipoMaterial').val(tipoMaterial);
            $('#tipodeCostura').val(tipodeCostura);
            $('#tipoSuela').val(tipoSuela);
            $('#fabricante').val(fabricante);
            $('#observaciones').val(observaciones);
            $('#estado').val(estado);
            $(".modal-header").css("background-color", "#7303c0");
            $(".modal-header").css("color", "white");
            $(".modal-title").text("Editar Materiales Zapatos");
            $('#modalCRUD').modal('show');
        });

       // Dar de Baja
$(document).on("click", ".btnBorrar", async function () {
    fila = $(this).closest("tr");
    var data = tabla.row(fila).data();
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
            await api.excutePut(`materialesZapatos/dardebaja/${codigo}`);

            // Actualizar la tabla con las nuevas categorías
            const nuevasmaterialesZapatos= await api.excuteGet('materialesZapatos');
            tabla.clear().rows.add(nuevasmaterialesZapatos).draw();

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
            descripcion =$.trim($('#descripcion').val());
            tipoMaterial=$.trim($('#tipoMaterial').val());
            tipodeCostura =$.trim($('#tipodeCostura').val());
            tipoSuela =$.trim($('#tipoSuela').val());
            fabricante=$.trim($('#fabricante').val());
            observaciones=$.trim($('#observaciones').val());
            estado = $("#estado").val() ;  
       


            try {
                if (!nombre || !descripcion || !tipoMaterial || !tipodeCostura || !tipoSuela || !fabricante || !observaciones) {
                    toastr.error('Por favor complete todos los campos.');
                    return;
                }
                       // Validar que el nombre solo contenga letras
                       const regexLetrasConEspacios = /^[A-Za-z\s]+$/;
                       if (!nombre.match(regexLetrasConEspacios)) {
                           toastr.error('El nombre solo puede contener letras y espacios.');
                           return;
                       }
                       
                    // Validar duplicados para cada campo
        if (MaterialZapato.some(material => material.Nombre.toLowerCase() === nombre.toLowerCase())) {
            toastr.error('El nombre de material de zapatos especificado ya está en uso.');
            return;
        }
                if (opcion === 'crear') {
                    await api.excutePost('materialesZapatos',{nombre, descripcion, tipoMaterial, tipodeCostura, tipoSuela, fabricante, observaciones, estado });
                    toastr.success('Se ha guardado correctamente.');

                
                } else if (opcion === 'editar') {
                    await api.excutePut(`materialesZapatos/${codigo}`, {nombre, descripcion, tipoMaterial, tipodeCostura, tipoSuela, fabricante, observaciones, estado });


                }

                // Actualizar la tabla con las nuevas categorías
                const nuevasmaterialesZapatos = await api.excuteGet('materialesZapatos');
                tabla.clear().rows.add(nuevasmaterialesZapatos).draw();

                $('#modalCRUD').modal('hide');
            } catch (error) {
                console.error('Error al guardar/editar:', error.message);
            }
        });

    } catch (error) {
        console.error('Error general:', error.message);
    }
});
