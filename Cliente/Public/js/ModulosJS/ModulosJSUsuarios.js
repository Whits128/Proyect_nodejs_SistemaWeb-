// Declaración de variables
let opcion, id, codigo, Nombres,Apellidos,LoginUsuario,LoginClave,IdRol,Estado , fila;

import { EntityClass } from "../EntityClass.js";
const api = new EntityClass();
import CreateDropDown from "../DropDownComponent.js"
$(document).ready(async function () {
    let tabla;

    try {

        const rolResponse = await api.excuteGet('rol');
        const rolData = rolResponse;
        const selectrol = document.getElementById('Idrol');
        CreateDropDown(rolData, selectrol,  'Nombre','Codigo');
        // Obtener datos de Usuarios al cargar la página
        const User = await api.excuteGet('usuarios');

        // DataTable initialization
       
        tabla = $('#Tabla').DataTable({
            data: User,
            columns: [
                { data: "Codigo" },
                { data: "Nombres" },
                { data: "Apellidos" },
                { data: "LoginUsuario" },
                { data: "NombreRol" },
                { data: "Estado" },
                {
                    data: "FechaCompra",
                    "targets": 6,
                    "render": function (data, type, row) {
                        return moment.utc(data).format('YYYY-MM-DD');
                    }
                },
                {
                    "targets": -1,
                    "data": null,
                    "defaultContent": `
                        <div class='text-center'>
                            <div class='btn-group'>
                                <button class='btn btn-info btn-sm btnEditar'><i class='fa fa-pencil'></i></button>
                                <button class='btn btn-danger btn-sm btnBorrar'><i class='fa fa-trash'></i></button>
                                <button class='btn btn-warning btn-sm btnCambiarContrasena'><i class='fa fa-key'></i></button>
                                <button class='btn btn-success btn-sm btnInfoAdicional'><i class='fa fa-info-circle'></i></button>
                            </div>
                        </div>
                    `
                }
            ],
            columnDefs: [
                { targets: [0], visible: false }
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
            $(".modal-title").text("Crear Usuario");
            $('#modalCRUD').modal('show');
            $(".conteEliminarPass").show();

        });

        // EDITAR
        $(document).on("click", ".btnEditar", function () {
            opcion = 'editar';
            fila = $(this).closest("tr");
              // Añade un log para ver el contenido de la celda
    console.log('Contenido de la celda:', fila.find('td:eq(0)').text());
    // Obtén el objeto de datos de la fila desde el DataTable
    var datosFila = tabla.row(fila).data();

    // Accede a la propiedad Codigo del objeto de datos
    codigo = parseInt(datosFila.Codigo);
   
            console.log('codigo:',codigo);
            Nombres = (datosFila.Nombres);

            Apellidos =(datosFila.Apellidos);
            console.log('apellidos:',Apellidos);
            LoginUsuario = (datosFila.LoginUsuario);
         
            IdRol = (datosFila.NombreRol);
            Estado = (datosFila.Estado);
            $("#id").val(codigo);
            $("#nombres").val(Nombres);
            $("#apellidos").val(Apellidos);
            $("#loginUsuario").val(LoginUsuario);
            $("#Idrol option:contains('" + IdRol + "')").prop("selected", true);
          
            $("#estado").val(Estado);
                // Ocultar el campo de contraseña y su label
   
                $(".conteEliminarPass").hide();


            $(".modal-header").css("background-color", "#7303c0");
            $(".modal-header").css("color", "white");
            $(".modal-title").text("Editar Talla");
            $('#modalCRUD').modal('show');
           
           
        });

       // Dar de Baja
$(document).on("click", ".btnBorrar", async function () {
    fila = $(this).closest("tr");
    Estado = fila.find('td:eq(5)').text();

    var datosFila = tabla.row(fila).data();
    codigo = parseInt(datosFila.Codigo);

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
            await api.excutePut(`usuario/dardebaja/${codigo}`);

            // Actualizar la tabla  usuarios
            const usuarios = await api.excuteGet('usuarios');
            tabla.clear().rows.add(usuarios).draw();

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
            Nombres = $.trim($('#nombres').val());
            Apellidos = $.trim($('#apellidos').val());
            LoginUsuario = $.trim($('#loginUsuario').val());
            LoginClave= $.trim($('#loginClave').val());
            IdRol=$.trim($('#Idrol').val());
            Estado = $("#estado").val();

            try {
                if (opcion === 'crear') {
                    await api.excutePost('usuario', { Nombres, Apellidos,LoginUsuario,LoginClave,IdRol,Estado });
                } else if (opcion === 'editar') {
                    await api.excutePut(`usuario/${codigo}`, { Nombres, Apellidos,LoginUsuario,LoginClave,IdRol,Estado });
                }

                // Actualizar la tabla con las nuevas talla
                const usuario = await api.excuteGet('usuarios');
                tabla.clear().rows.add(usuario).draw();

                $('#modalCRUD').modal('hide');
            } catch (error) {
                console.error('Error al guardar/editar:', error.message);
            }
        });



//FUNCION PARA CAMBIAR DE CONTENEDOR
function mostrarVista(idVista) {
    var vistas = document.getElementsByClassName('vista');
    for (var i = 0; i < vistas.length; i++) {
        vistas[i].style.display = 'none';
    }

    var vistaSeleccionada = document.getElementById(idVista);
    if (vistaSeleccionada && vistaSeleccionada.innerHTML.trim() === "") {
        cargarContenido(idVista);
    }

    if (vistaSeleccionada) {
        vistaSeleccionada.style.display = 'block';
    }
}

mostrarVista('vista1');
// Usa la clase btnCambiarContrasena como selector
$(document).on("click", ".btnCambiarContrasena", function () {
    // Obtén el código de la fila
    var codigo = tabla.row($(this).closest("tr")).data().Codigo;
    var LoginUsuario = tabla.row($(this).closest("tr")).data().LoginUsuario;
// Asigna el valor al campo de entrada con la clase User
$("#User").val(LoginUsuario);
    mostrarVista('vistaCUser2');
   
});


    } catch (error) {
        console.error('Error general:', error.message);
    }





});
