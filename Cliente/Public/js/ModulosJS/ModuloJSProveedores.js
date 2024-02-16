// Declaración de variables
let opcion, id, codigo,nombre, direccion, telefono, ruc, emailProveedor, estado, fila;

import { EntityClass } from "../EntityClass.js";
const api = new EntityClass();

$(document).ready(async function () {
    let tabla;

    try {
        // Obtener datos de Proveedor al cargar la página
        const Proveedores = await api.excuteGet('Proveedor');
   //obtener las acciones para validarla en los botones necesarios 

   var allowedActions = $("#Tabla").data("allowed-actions");
    
        // DataTable initialization
     
            tabla = $('#Tabla').DataTable({
                data: Proveedores,
                "pageLength": 5,
                "lengthMenu": [5, 10, 20, 100], // Opciones de cantidad de elementos por página
                "order": [[1, "asc"]],
                "autoWidth": true,         
                columns: [
                    { data: "Codigo" },
                    { data: "Nombre",render: function (data, type, row) {
                        if (data.length > 15) {
                            return `${data.substr(0, 15)} <i class="fas fa-eye ver-mas-icon" title="${data}"></i>`;
                        } else {
                            return data;
                        }
                    } },
                    { data: "Direccion" ,render: function (data, type, row) {
                        if (data.length > 15) {
                            return `${data.substr(0, 15)} <i class="fas fa-eye ver-mas-icon" title="${data}"></i>`;
                        } else {
                            return data;
                        }
                    }},
                    { data: "Telefono" },
                    { data: "Ruc",render: function (data, type, row) {
                        if (data.length > 15) {
                            return `${data.substr(0, 15)} <i class="fas fa-eye ver-mas-icon" title="${data}"></i>`;
                        } else {
                            return data;
                        }
                    } },
                    { data: "EmailProveedor",render: function (data, type, row) {
                        if (data.length > 15) {
                            return `${data.substr(0, 15)} <i class="fas fa-eye ver-mas-icon" title="${data}"></i>`;
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
                        
                    }                 
                
                
                ],
                columnDefs: [
                    {
                        targets: [0, 4,6],
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
            $(".modal-title").text("Crear Proveedor");
            $('#modalCRUD').modal('show');
        });

        // EDITAR
        $(document).on("click", ".btnEditar", function () {
            opcion = 'editar';
            fila = $(this).closest("tr");
            var data = tabla.row(fila).data(); // Obtener los datos asociados a la fila
  
            codigo = data.Codigo;
          
            nombre = data.Nombre;
            direccion= data.Direccion;
            telefono= data.Telefono;
            ruc = data.Ruc;
            emailProveedor= data.EmailProveedor;
            estado = data.Estado;            
            $("#id").val(codigo);
            $("#nombre").val(nombre);
            $("#direccion").val(direccion);
            $("#telefono").val(telefono);
            $("#ruc").val(ruc);
            $("#emailProveedor").val(emailProveedor);
            $("#estado").val(estado);
            $(".modal-header").css("background-color", "#7303c0");
            $(".modal-header").css("color", "white");
            $(".modal-title").text("Editar Peoveedor");
            $('#modalCRUD').modal('show');
        });

       // Dar de Baja
$(document).on("click", ".btnBorrar", async function () {
    fila = $(this).closest("tr");
    var data = tabla.row(fila).data(); // Obtener los datos asociados a la fila
    estado = data.Estado;
    codigo = data.Codigo;
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
            await api.excutePut(`Proveedor/dardebaja/${codigo}`);

            // Actualizar la tabla con las nuevas categorías
            const nuevasProveedor= await api.excuteGet('Proveedor');
            tabla.clear().rows.add(nuevasProveedor).draw();

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
            direccion = $.trim($('#direccion').val());
            telefono = $.trim($('#telefono').val());
            ruc = $.trim($('#ruc').val());
            emailProveedor = $.trim($('#emailProveedor').val());
            estado = $("#estado").val() ;   

            try {
                  // Validar que los campos no estén vacíos
        if (!nombre || !direccion || !telefono || !ruc || !emailProveedor) {
            toastr.error('Por favor complete todos los campos.');
            return;
        }

    // Verificar duplicados
const proveedorDuplicado = Proveedores.some(proveedor => {
    return (
        proveedor.Nombre.toLowerCase().trim() === nombre.toLowerCase().trim());
});

    
            // Si se encuentra un proveedor duplicado, mostrar un mensaje de error y detener la ejecución
            if (proveedorDuplicado) {
                toastr.error('Ya existe un proveedor con los mismos detalles.');
                return;
            }
                if (opcion === 'crear') {
                    await api.excutePost('Proveedor',{nombre, direccion, telefono, ruc, emailProveedor,estado });
                } else if (opcion === 'editar') {
                    await api.excutePut(`Proveedor/${codigo}`, {nombre, direccion, telefono, ruc, emailProveedor, estado });
                }

                // Actualizar la tabla con las nuevas categorías
                const nuevasProveedor = await api.excuteGet('Proveedor');
                tabla.clear().rows.add(nuevasProveedor).draw();

                $('#modalCRUD').modal('hide');
            } catch (error) {
                console.error('Error al guardar/editar:', error.message);
            }
        });

    } catch (error) {
        console.error('Error general:', error.message);
    }
});
