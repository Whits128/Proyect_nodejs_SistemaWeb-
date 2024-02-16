// Declaración de variables
let opcion, id, codigo,nombre, descripcion, idCategoria, estado, fila;

import { EntityClass } from "../EntityClass.js";
import CreateDropDown from "../DropDownComponent.js"

const api = new EntityClass();
 
$(document).ready(async function () {
    let tabla;

    try {
        const categoriasResponse = await api.excuteGet('categorias');
        const categoriasData = categoriasResponse;
        const selectrol = document.getElementById('id_categoria');
        CreateDropDown(categoriasData, selectrol,  'Nombre','Codigo');
    
     
        // Obtener datos de productos al cargar la página
        const priducto = await api.excuteGet('productos');
               //obtener las acciones para validarla en los botones necesarios 

               var allowedActions = $("#Tabla").data("allowed-actions");
     
           // MOSTRAR
            tabla = $('#Tabla').DataTable({
                data: priducto,
                "pageLength": 5,
                "lengthMenu": [5, 10, 20, 100], // Opciones de cantidad de elementos por página
                "order": [[1, "asc"]],
                "autoWidth": true,
                "columns": [
                    { data: "Codigo" },
                    { data: "Nombre" },
                    { 
                        data: "Descripcion",
                        render: function (data, type, row) {
                            if (data.length > 15) {
                                return `${data.substr(0, 15)} <i class="fas fa-eye ver-mas-icon" title="${data}"></i>`;
                            } else {
                                return data;
                            }
                        }
                    },
                    { data: "Categoria" },
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
                        targets: [0, 4],
                        visible: false,
                    },
                ],
                responsive: true,
                language: {
                    url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
                },
            });
            
            // Agregar tooltip para ver la descripción completa
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
            $(".modal-title").text("Crear Producto");
            $('#modalCRUD').modal('show');
        });

        // EDITAR
        $(document).on("click", ".btnEditar", function () {
            opcion = 'editar';
            fila = $(this).closest("tr");
            var data = tabla.row(fila).data(); // Obtener los datos asociados a la fila
  
            codigo = data.Codigo;
            console.log('codigo',codigo)
            nombre = data.Nombre;
            descripcion = data.Descripcion;
            idCategoria =  data.Categoria;
            estado = data.Estado;
            console.log('estado',estado);
            $("#id").val(codigo);
            $("#nombre").val(nombre);
            $("#descripcion").val(descripcion);
             // Usar el nombre del recurso para establecer la opción seleccionada
   $("#id_categoria option:contains('" + idCategoria + "')").prop("selected", true);
            $("#estado").val(estado);
            $(".modal-header").css("background-color", "#7303c0");
            $(".modal-header").css("color", "white");
            $(".modal-title").text("Editar Color");
            $('#modalCRUD').modal('show');
        });

       // Dar de Baja
$(document).on("click", ".btnBorrar", async function () {
    var fila = $(this).closest('tr'); // Obtener la fila más cercana al botón de eliminación
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
            await api.excutePut(`producto/dardebaja/${codigo}`);
    // Actualizar la tabla con las nuevas productos
    const nuevasproductos = await api.excuteGet('productos');
    tabla.clear().rows.add(nuevasproductos).draw();
          
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
            const nombre = $.trim($('#nombre').val());
            const descripcion = $.trim($('#descripcion').val());
            const idCategoria = $.trim($('#id_categoria').val());
            const estado = $("#estado").val();
        
            try {
                // Validaciones
                if (!nombre) {
                    toastr.error('Por favor ingrese un nombre válido.');
                    return;
                }
        
                if (!descripcion) {
                    toastr.error('Por favor ingrese una descripción válida.');
                    return;
                }
        
                if (!idCategoria) {
                    toastr.error('Por favor seleccione una categoría.');
                    return;
                }
         // Realizar una consulta para verificar si ya existe un producto con el mismo nombre y descripción
         const productoExistenteNombre = priducto.find(producto => producto.Nombre === nombre);
         if (productoExistenteNombre) {
             toastr.error('Ya existe un producto con el mismo nombre.');
             return;
         }
                // Realizar una consulta para verificar si ya existe un producto con el mismo nombre y descripción
                const productoExistente = priducto.find(producto => producto.Nombre === nombre && producto.Descripcion === descripcion) ;
                if (productoExistente) {
                    toastr.error('Ya existe un producto con el mismo nombre y descripción.');
                    return;
                }
        
                // Enviar la solicitud al servidor para crear o editar el producto
                if (opcion === 'crear') {
                    await api.excutePost('producto', { nombre, descripcion, idCategoria, estado });
                    toastr.success('El producto se ha guardado correctamente.');
                } else if (opcion === 'editar') {
                    await api.excutePut(`producto/${codigo}`, { nombre, descripcion, idCategoria, estado });
                    toastr.success('El producto se ha editado correctamente.');
                }
        
                // Actualizar la tabla con los nuevos productos
                const nuevosProductos = await api.excuteGet('productos');
                tabla.clear().rows.add(nuevosProductos).draw();
        
                // Cerrar el modal
                $('#modalCRUD').modal('hide');
            } catch (error) {
                console.error('Error al guardar/editar:', error.message);
                toastr.error('Error al guardar/editar el producto. Por favor, inténtelo de nuevo.');
            }
        });
        

    } catch (error) {
        console.error('Error general:', error.message);
    }
});
