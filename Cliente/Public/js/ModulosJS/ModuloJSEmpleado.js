// Declaración de variables
let opcion, id, codigo,nombre, apellido, direccion, telefono,idUsuario, estado, fila;

import { EntityClass } from "../EntityClass.js";
const api = new EntityClass();
import CreateDropDown from "../DropDownComponent.js"
$(document).ready(async function () {
    let tabla;

    try {

        const categoriasResponse = await api.excuteGet('usuarios');
        const categoriasData = categoriasResponse;
        const selectrol = document.getElementById('idUsuario');
        CreateDropDown(categoriasData, selectrol,  'LoginUsuario','Codigo');
    
        // Obtener datos de Empleados al cargar la página
        let Empleados = await api.excuteGet('empleado');
        console.log("empleado",Empleados)
 //obtener las acciones para validarla en los botones necesarios 

 var allowedActions = $("#Tabla").data("allowed-actions");
        // DataTable initialization
    
            tabla = $('#Tabla').DataTable({
                data: Empleados,
                "pageLength": 5,
                "lengthMenu": [5, 10, 20, 100], // Opciones de cantidad de elementos por página
                "order": [[1, "asc"]],
                "autoWidth": true,
                columns: [
                    { data: "Codigo" },
                    { data: "Nombre" },
                    { data: "Apellido" },
                    { data: "Direccion" },
                    { data: "Telefono" },
                    { data: "LoginUsuario" },
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
                        targets: [0, 6],
                        visible: false,
                    },
                ],
                responsive: true,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
        }
                // Resto de las opciones DataTable
            });
        
        // CREAR
        $("#btnCrear").click(function () {
            opcion = 'crear';
            id = null;
            $("#form").trigger("reset");
            $(".modal-header").css("background-color", "#23272b");
            $(".modal-header").css("color", "white");
            $(".modal-title").text("Crear Empleado");
            $('#modalCRUD').modal('show');
        });

        // EDITAR
        $(document).on("click", ".btnEditar", function () {
            opcion = 'editar';
            fila = $(this).closest("tr");
            var data = tabla.row(fila).data(); // Obtener los datos asociados a la fila
  
            codigo = data.Codigo;
      
            nombre =  data.Nombre;
            apellido=  data.Apellido;
            direccion =  data.Direccion;
            telefono=  data.Telefono;
            idUsuario =    data.LoginUsuario;
            estado =  data.Estado;           
            $("#id").val(codigo);
            $("#nombre").val(nombre);
            $("#apellido").val(apellido);
            $("#direccion").val(direccion);
            $("#telefono").val(telefono);
            $("#IdUsuario option:contains('" + idUsuario + "')").prop("selected", true);
            $("#estado").val(estado);
            $(".modal-header").css("background-color", "#7303c0");
            $(".modal-header").css("color", "white");
            $(".modal-title").text("Editar Empleado");
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
            await api.excutePut(`empleado/dardebaja/${codigo}`);

            // Actualizar la tabla con las nuevas categorías
            const nuevasempleado= await api.excuteGet('empleado');
            tabla.clear().rows.add(nuevasempleado).draw();

            Swal.fire('¡Operación completada!', '', 'success');
        } catch (error) {
            console.error('Error al dar de baja:', error.message);
        }
    }
});

        // Submit para CREAR y EDITAR
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
    apellido = $.trim($('#apellido').val());
    direccion = $.trim($('#direccion').val());
    telefono = $.trim($('#telefono').val());
    idUsuario = $.trim($('#idUsuario').val());
    
    estado = $("#estado").val();   
    const regex = /^[A-Za-z]+$/;
   

    try {
                // Validaciones
            // Validar que los campos no estén vacíos
        if (!nombre || !apellido || !direccion || !telefono ) {
            toastr.error('Por favor complete todos los campos.');
            return;
        }

        // Validar que  solo contenga letras
        
        if (!nombre.match(regex)) {
        toastr.error('El nombre solo puede contener letras.');
        return;
        }
        if (!apellido.match(regex)) {
            toastr.error('El apellido solo puede contener letras.');
            return;
            }
      
           
        if (opcion === 'crear') {
            const empleadoExistente = Empleados.find(e => e.IdUsuario.toString() === idUsuario);
     console.log('empleadoExistente',empleadoExistente);
     if (empleadoExistente) {
         toastr.error('El  usuario especificado ya está asociado a otro empleado.');
         return;
     }
     
            await api.excutePost('empleado', { nombre, apellido, direccion, telefono, idUsuario, estado });
            toastr.success('El empleado se ha guardado correctamente.');
        } else if (opcion === 'editar') {
            await api.excutePut(`empleado/${codigo}`, { nombre, apellido, direccion, telefono, idUsuario, estado });
            toastr.success('El empleado se ha editado correctamente.');
        }

        // Actualizar la tabla con las nuevas categorías
        const nuevasempleado = await api.excuteGet('empleado');
        tabla.clear().rows.add(nuevasempleado).draw();

        $('#modalCRUD').modal('hide');
    } catch (error) {
        console.error('Error al guardar/editar:', error.message);


      
}
});

    } catch (error) {
        console.error('Error general:', error.message);
    }
});
