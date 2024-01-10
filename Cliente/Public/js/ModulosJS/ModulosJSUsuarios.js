// Declaración de variables
let opcion, id, codigo, Nombres,Apellidos,LoginUsuario,Contrasena,IdRol,Estado ,UsuarioModificacion, fila;
// Importa 'chart.js/auto' de la manera correcta




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
            Contrasena= $.trim($('#loginClave').val());
            IdRol= $.trim($('#Idrol').val());
            UsuarioModificacion = $.trim($('#usuarioModificacion').val());
            Estado = $("#estado").val();

            try {
                if (opcion === 'crear') {
                    await api.excutePost('usuario', { Nombres, Apellidos,LoginUsuario,Contrasena,IdRol,UsuarioModificacion,Estado });
                } else if (opcion === 'editar') {
                    await api.excutePut(`usuario/${codigo}`, { Nombres, Apellidos,LoginUsuario,IdRol,UsuarioModificacion,Estado });
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
 // Agrega un evento de clic al botón "Cancelar" formulacion cambio contrasena 
 $(document).on("click", "#btnconcelarC", function () {
    // Llama a la función mostrarVista con el ID de la vista que deseas mostrar (vista1 en este caso)
mostrarVista('vista1');
    // Limpia los campos del formulario formCUser utilizando jQuery
    $('#formCUser')[0].reset();
});
   
// Usa la clase btnCambiarContrasena como selector
var codigoCombiarC
$(document).on("click", ".btnCambiarContrasena", function () {
    // Obtén el código de la fila
     codigoCombiarC = tabla.row($(this).closest("tr")).data().Codigo;
    var LoginUsuario = tabla.row($(this).closest("tr")).data().LoginUsuario;
// Asigna el valor al campo de entrada con la clase User

$("#User").val(LoginUsuario);
    mostrarVista('vistaCUser2');
   
});
let historialData ;
let tablaHistorial
// Hacer la solicitud AJAX para obtener el historial de usuario

$(document).on("click", ".btnInfoAdicional",async function () {
    // Obtén el código de la fila
   const idUsuarioHistorial =tabla.row($(this).closest("tr")).data().LoginUsuario;
    const historialResponse = await api.excuteGet(`usuarios/historial/${idUsuarioHistorial}`);
     historialData = historialResponse;
    console.log('idUsuarioHistorial',idUsuarioHistorial);
   // Destruye la DataTable existente si ya está inicializada
   if ($.fn.DataTable.isDataTable('#Tabla_InfoUser')) {
    $('#Tabla_InfoUser').DataTable().destroy();
}
 tablaHistorial = $('#Tabla_InfoUser').DataTable({
        data: historialData,
        columns: [
            { data: "PKHistorialUsuari" },
            { data: "LoginUsuario" },
            { data: "ColumnaModificada" },
            {
                data: "ValorAntiguo",
                className: 'anchoColumna',
                render: function (data, type, row) {
                    return (data !== null ? truncateText(data) : 'Sin cambio');
                }
            },
            {
                data: "ValorNuevo",
                className: 'anchoColumna',
                render: function (data, type, row) {
                    return (data !== null ? truncateText(data) : 'Sin cambio');
                }
            },
            {
                data: "FechaModificacion",
                targets: 6,
                render: function (data, type, row) {
                    return (data ? moment.utc(data).format('YYYY-MM-DD') : '0/0/0');
                }
            },
            { data: "UsuarioModificacion" },
            { data: "TipoOperacion" }
        ],
        columnDefs: [
            { targets: [0], visible: false },
            {
                targets: '_all',
                className: 'text-center'
            }
        ],
        responsive: true,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
        },
    });
    
    function truncateText(text) {
        const maxLength = 10; // ajusta la longitud máxima según tus necesidades
        if (text.length > maxLength) {
            return text.substring(0, maxLength);
        } else {
            return text;
        }
    }

    console.log('historialData:',historialData);
 // Agrega un evento de clic al botón para mostrar la lista
 $("#btnMostrarLista").click(function () {
    // Muestra la fila que contiene la lista
    $(".row:hidden").show();
    $("#ocultarTablaInfoUser").hide();
    // Limpia la lista antes de agregar nuevos elementos
    $("#listaDinamica").empty();

    // Itera sobre los elementos de historialData y agrégales a la lista
    historialData.forEach(function (elemento) {
        // Formatea la fecha si es necesario
        const fechaModificacionFechaInicioSesion = elemento.FechaInicioSesion ? moment(elemento.FechaInicioSesion).format('YYYY-MM-DD') : '0/0/0';

        const fechaModificacionFechaFinSesion = elemento.FechaFinSesion ? moment(elemento.FechaFinSesion).format('YYYY-MM-DD') : '0/0/0';

        // Crea un elemento de lista con la información del historial
        const listItem = `<li class='list-group-item'>
                            <strong>Numero de Sesiones:</strong> ${elemento.NumSesiones}<br>
                            <strong>Fecha de Inicio de Sesion:</strong> ${fechaModificacionFechaInicioSesion}<br>
                            <strong>Fecha de Fin de Sesion:</strong> ${fechaModificacionFechaFinSesion}
                          </li>`;

        // Agrega el elemento de lista a la lista dinámica
        $("#listaDinamica").append(listItem);
    });
});

$("#cerrarLista").click(function () {
    $("#listaSeciones").hide(); // Muestra la fila que contiene la lista
    $("#ocultarTablaInfoUser").show();
});


$("#btnIrVista1").click(function () {
    mostrarVista('vista1');
      // Limpia la lista antes de agregar nuevos elementos
      $("#listaDinamica").empty();
      
    // Limpia la tabla antes de agregar nuevos elementos
    tablaHistorial.clear().draw();
});
    mostrarVista('vistaCUser3');
   
});




    



    } catch (error) {
        console.error('Error general:', error.message);
    }


    $('#formCUser').submit(async function (e) {
        e.preventDefault();
    
        const codigo = codigoCombiarC;
        const Contrasena = $.trim($('#loginClaveC').val());
        UsuarioModificacion = $.trim($('#usuarioModificacion').val());
        // Muestra una alerta de confirmación
        const confirmacion = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Quieres cambiar la contraseña?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, cambiar contraseña',
            cancelButtonText: 'Cancelar'
        });
    
        // Si el usuario confirma la acción
        if (confirmacion.isConfirmed) {
            // Realiza la solicitud PUT
            try {
                await api.excutePut(`usuario/cambiar-contrasena/${codigo}`, { Contrasena,UsuarioModificacion });
                
                // Muestra una alerta de éxito
                Swal.fire({
                    title: 'Contraseña cambiada',
                    text: 'La contraseña se ha cambiado con éxito.',
                    icon: 'success'
                });
            } catch (error) {
                // Muestra una alerta de error si la solicitud falla
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudo cambiar la contraseña. Inténtalo de nuevo.',
                    icon: 'error'
                });
            }
        }
    });
    



});
