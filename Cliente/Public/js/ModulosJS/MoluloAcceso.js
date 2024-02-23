// Declaración de variables
let opcion, id, codigo,ruta, idRecurso, idRol, fila;
import CreateDropDown from "../DropDownComponent.js"
import { EntityClass } from "../EntityClass.js";
const api = new EntityClass();

$(document).ready(async function () {
    let tablaConfi;

    let recursoResponse = await api.excuteGet('configuracionAcceso/recursos');
    let ConfiguracionAccionesResponse = await api.excuteGet('configuracionAcceso');
console.log('ConfiguracionAccionesResponse:',ConfiguracionAccionesResponse)

  let accionesResponse =  await api.excuteGet('configuracionAcceso/acciones');
  let rolResponse =  await api.excuteGet('configuracionAcceso/rol');



    try {
        

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
    // Para deshabilitar el botón con el id "miBoton"
$("#btnCancelar").prop("disabled", true);

    mostrarVista('vista1');

    $("#btnRegistraconfiAccesos").click(function () {
        mostrarVista('vista2');
        // Para deshabilitar el botón con el id "miBoton"
$("#btnRegistraconfiAccesos").prop("disabled", true);
$("#btnCancelar").prop("disabled", false);
$("#btnMostrarBusqueda").prop("disabled", true);
$("#btnOcultarBusqueda").prop("disabled", true);
    });
    $("#btnCancelar").click(function () {
        mostrarVista('vista1');
        // Para habilitar el botón con el id "miBoton"
$("#btnRegistraconfiAccesos").prop("disabled", false);
// Para deshabilitar el botón con el id "miBoton"
$("#btnCancelar").prop("disabled", true);
$("#btnMostrarBusqueda").prop("disabled", false);
$("#btnOcultarBusqueda").prop("disabled", false)
    });
        // Obtén el div por su id
const miLista = $("#miListaRecurso");
const miLista2 = $("#miListaAcciones");
const miLista3 = $("#miListaRol");
// Llena el div con los elementos del array
// Supongamos que tienes Font Awesome incluido en tu proyecto

// Itera sobre los recursos y agrega casillas de verificación
$.each(recursoResponse, function(index, recurso) {
    miLista.append('<div class="elemento" data-codigo="' + recurso.Codigo + '">' +
        '<div class="contenedorNombre">' +
            '<span class="nombreRecurso">' + recurso.NombreRecurso + '</span>' +
        '</div>' +
        '<input type="checkbox" class="seleccionarRecurso" id="recurso_' + recurso.Codigo + '">' +
        '</div>');
});

// Itera sobre las acciones y agrega casillas de verificación
$.each(accionesResponse, function(index, acciones) {
    miLista2.append('<div class="elemento" data-codigo="' + acciones.Codigo + '">' +
        '<div class="contenedorNombre">' +
            '<span class="nombreAccion">' + acciones.NombreAccion + '</span>' +
        '</div>' +
        '<input type="checkbox" class="seleccionarAccion" id="accion_' + acciones.Codigo + '">' +
        '</div>');
});

// Itera sobre los roles y agrega casillas de verificación
$.each(rolResponse, function(index, rol) {
    miLista3.append('<div class="elemento" data-codigo="' + rol.Codigo + '">' +
        '<div class="contenedorNombre">' +
            '<span class="nombrerol">' + rol.Nombre + '</span>' +
        '</div>' +
        '<input type="checkbox" class="seleccionarRol" id="rol_' + rol.Codigo + '">' +
        '</div>');
});


let nombreRol;


let codigoSeleccionadoRol;
let configuracionAcceso = []; // Array para almacenar la configuración de acceso
let asignaciones  = [];


// Arrays para almacenar las selecciones de recursos y acciones
// Arrays para almacenar las selecciones de recursos y acciones
let recursosSeleccionados = [];
let accionesSeleccionadas = [];

// Acción cuando cambia una casilla de verificación de recurso
miLista.on("change", ".seleccionarRecurso", function(event) {
    event.stopPropagation();
    
    // Obtiene el código y el nombre del recurso seleccionado
    let codigoSeleccionadoRecurso = $(this).closest('.elemento').data("codigo");
    let nombreRecurso = $(this).closest('.elemento').find('.nombreRecurso').text();
    
    // Si la casilla de verificación está marcada, agrega el recurso al array de recursos seleccionados
    if ($(this).is(':checked')) {
            // Remueve la clase seleccionado de todos los elementos en la lista
    miLista.find('.elemento').removeClass('seleccionado');

    $(this).closest('.elemento').addClass('seleccionado');
        recursosSeleccionados.push({ codigo: codigoSeleccionadoRecurso, nombre: nombreRecurso });
    } else {
        // Si la casilla de verificación se desmarca, elimina el recurso del array de recursos seleccionados
        recursosSeleccionados = recursosSeleccionados.filter(recurso => recurso.codigo !== codigoSeleccionadoRecurso);
           // Remueve la clase seleccionado del elemento deseleccionado
           $(this).closest('.elemento').removeClass('seleccionado');
    }

    console.log("Recursos seleccionados:", recursosSeleccionados);
});

// Acción cuando cambia una casilla de verificación de acción
miLista2.on("change", ".seleccionarAccion", function(event) {
    event.stopPropagation();
    
    // Obtiene el código y el nombre de la acción seleccionada
    let codigoSeleccionadoAccion = $(this).closest('.elemento').data("codigo");
    let nombreAccion = $(this).closest('.elemento').find('.nombreAccion').text();
    
    // Si la casilla de verificación está marcada, agrega la acción al array de acciones seleccionadas
    if ($(this).is(':checked')) {
         // Remueve la clase seleccionado de todos los elementos en la lista
    miLista2.find('.elemento').removeClass('seleccionado');

        $(this).closest('.elemento').addClass('seleccionado');
        accionesSeleccionadas.push({ codigo: codigoSeleccionadoAccion, nombre: nombreAccion });
    } else {
        // Si la casilla de verificación se desmarca, elimina la acción del array de acciones seleccionadas
        accionesSeleccionadas = accionesSeleccionadas.filter(accion => accion.codigo !== codigoSeleccionadoAccion);
       // Remueve la clase seleccionado del elemento deseleccionado
       $(this).closest('.elemento').removeClass('seleccionado');
    }

    console.log("Acciones seleccionadas:", accionesSeleccionadas);
});


// Acción cuando cambia una casilla de verificación de rol
miLista3.on("change", ".seleccionarRol", function(event) {
    event.stopPropagation();
    
    // Remueve la clase seleccionado de todos los elementos en la lista
    miLista3.find('.elemento').removeClass('seleccionado');
    
    // Si la casilla de verificación está marcada, agrega la clase seleccionado al elemento
    if ($(this).is(':checked')) {
        $(this).closest('.elemento').addClass('seleccionado');
        
        // Obtiene el código y nombre del rol seleccionado
        codigoSeleccionadoRol = $(this).closest('.elemento').data("codigo");
        nombreRol = $(this).closest('.elemento').find('.nombrerol').text();
        
        console.log("Elemento seleccionado Rol: Código " + codigoSeleccionadoRol + ", NombreRol: " + nombreRol);
    }
    else{
               // Remueve la clase seleccionado del elemento deseleccionado
       $(this).closest('.elemento').removeClass('seleccionado');
       codigoSeleccionadoRol = null;
       nombreRol= null;
       console.log("Elemento seleccionado Rol: Código " + codigoSeleccionadoRol + ", NombreRol: " + nombreRol);
    }
});


    $('#TablaConfiguracion').on('draw.dt', function () {
        var dataTable = $('#TablaConfiguracion').DataTable();
        var pageInfo = dataTable.page.info();
        var totalPages = pageInfo.pages;
        var currentPage = pageInfo.page + 1;
        
        // Ocultar todos los botones de página
        $('.dataTables_paginate .paginate_button').hide();
        
        // Mostrar el botón de retroceder si no estamos en la primera página
        if (currentPage > 1) {
            $('.dataTables_paginate .previous').show();
        }
        
        // Calcular los números de página que deseas mostrar
        var startPage = Math.max(currentPage - 2, 1);
        var endPage = Math.min(startPage + 4, totalPages);
        var visiblePages = endPage - startPage + 1;
        
        // Ajustar los números de página si hay menos de 4 disponibles
        if (visiblePages < 4 && startPage > 1) {
            startPage = Math.max(endPage - 3, 1);
        }
        if (visiblePages < 4 && endPage < totalPages) {
            endPage = Math.min(startPage + 3, totalPages);
        }
        
        // Mostrar los números de página calculados
        for (var i = startPage; i <= endPage; i++) {
            $('.dataTables_paginate .paginate_button[data-dt-idx="' + i + '"]').show();
        }
        
        // Mostrar el botón de avanzar si no estamos en la última página
        if (currentPage < totalPages) {
            $('.dataTables_paginate .next').show();
        }
    });
    

     tablaConfi = $('#TablaConfiguracion').DataTable({
        data: configuracionAcceso,
        pageLength: 5,
        lengthMenu: [5, 10, 20, 100], // Opciones de cantidad de elementos por página
        order: [[1, "asc"]],
        autoWidth: true,
        columns: [
            { data: 'CodigoRecurso' },
            { data: 'NombreRecurso' },
            { data: 'CodigoAccion' },
            { data: 'NombreAccion' },
            { data: 'CodigoRol' },
            { data: 'NombreRol' },
            // ... otras columnas ...
            { // Columna de acciones
                data: null,
                render: function(data, type, row) {
                    // Puedes personalizar el contenido de la columna de acciones aquí
                    return '<button class="btnEliminar btn btn-danger">Eliminar</button>';
                }
            }
        ],
        columnDefs: [
            {
                targets: [0,2,4], // Índices de columnas a ocultar
                visible: false,
            },
        ],
        responsive: true,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
        },
    });
   
    
  // Ocultar panel de búsqueda al cargar la página
  $('.dtsp-searchPane').slideUp()

    let tablaverConfig = $('#TablaConfiguracionesVer').DataTable({
        data: ConfiguracionAccionesResponse,
        pageLength: 5,
        lengthMenu: [5, 10, 20, 100], // Opciones de cantidad de elementos por página
        order: [[1, "asc"]],
        autoWidth: true,
        columns: [
            { data: 'NombreRecurso' },
            { data: 'NombreAccion' },
            { data: 'NombreRol' },
        ],
        searchPanes: {
            cascadePanes: true,
            dtOpts: {
                dom: 'tp',
                paging: true,
                pagingType: 'simple',
                searching: false
            }
        }, 
        dom: 'Pfrtip',
        columnDefs: [{
            searchPanes: {
                show: true
            },
            targets: '_all' // Aplica la configuración de searchPanes a todas las columnas
        }],
        responsive: true,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json",
            searchPanes: {
                count: '{total} resultados',
                title: {
                    _: 'Filtros activos - %d',
                    0: 'Filtros activos - Ninguno',
                },
                collapse: 'Cerrar filtros',
                clearMessage: 'Limpiar todos los filtros',
            },
            paginate: {
                previous: 'Anterior',
                next: 'Siguiente',
            }
        },
    });
 
  // Mostrar panel de búsqueda
  $('#btnMostrarBusqueda').click(function() {
      $('.dtsp-searchPane').slideDown(); // Mostrar el panel de búsqueda con animación de deslizamiento hacia abajo
  });

  // Ocultar panel de búsqueda
  $('#btnOcultarBusqueda').click(function() {
      $('.dtsp-searchPane').slideUp(); // Ocultar el panel de búsqueda con animación de deslizamiento hacia arriba
  });




// Función para inicializar eventos de eliminación
function inicializarEventosEliminar() {
    $('.btnEliminar').off('click').on('click', function() {
        const fila = tablaConfi.row($(this).parents('tr'));
        const data = fila.data();

        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Elimina la fila de la tabla
                fila.remove().draw();

                // Elimina el elemento del array configuracionAcceso
                configuracionAcceso = configuracionAcceso.filter(el =>
                    el.CodigoRecurso !== data.CodigoRecurso ||
                    el.CodigoAccion !== data.CodigoAccion ||
                    el.CodigoRol !== data.CodigoRol
                );

                // Filtra los códigos correspondientes en el array asignaciones
                asignaciones = asignaciones.filter(asignacion =>
                    asignacion.CodigoRecurso !== data.CodigoRecurso ||
                    asignacion.CodigoAccion !== data.CodigoAccion ||
                    asignacion.CodigoRol !== data.CodigoRol
                );

                console.log('Eliminar', data.CodigoRecurso, data.CodigoAccion, data.CodigoRol);
                console.log('configuracionAcceso:', configuracionAcceso);
                console.log('asignaciones:', asignaciones);

                toastr.success("Elemento eliminado correctamente");
            }
        });
    });
}


async function asignacionMasiva() {
    try {
        toastr.options = {
            closeButton: true,
            timeOut: 2500,
            hideDuration: 300,
            progressBar: true, 
            closeEasing :'swing',
            preventDuplicates: true
        };

        // Verificar que se hayan recibido datos de recursos, acciones y roles
        if (recursoResponse && recursoResponse.length > 0 && accionesResponse && accionesResponse.length > 0 && rolResponse && rolResponse.length > 0) {
            const recursos = recursoResponse;
            const acciones = accionesResponse;
            const roles = rolResponse;

            // Verificar que se haya seleccionado un rol
            if (codigoSeleccionadoRol) {
                const rolSeleccionado = roles.find(rol => rol.Codigo === codigoSeleccionadoRol);

                if (rolSeleccionado) {
                    // Verificar si se ha seleccionado al menos un recurso
                    if (recursosSeleccionados.length > 0) {
                        // Iterar sobre cada recurso seleccionado
                        recursosSeleccionados.forEach(recurso => {
                            // Obtener el objeto completo del recurso seleccionado
                            const recursoSeleccionado = recursos.find(r => r.Codigo === recurso.codigo);

                            // Verificar si se ha seleccionado al menos una acción
                            if (accionesSeleccionadas.length > 0) {
                                // Iterar sobre cada acción seleccionada
                                accionesSeleccionadas.forEach(accion => {
                                    // Obtener el objeto completo de la acción seleccionada
                                    const accionSeleccionada = acciones.find(a => a.Codigo === accion.codigo);

                                    // Si se seleccionó un recurso, una acción y un rol, agregar esa configuración
                                    asignaciones.push({
                                        CodigoRecurso: recursoSeleccionado.Codigo,
                                        NombreRecurso: recursoSeleccionado.NombreRecurso,
                                        CodigoAccion: accionSeleccionada.Codigo,
                                        NombreAccion: accionSeleccionada.NombreAccion,
                                        CodigoRol: rolSeleccionado.Codigo,
                                        NombreRol: rolSeleccionado.Nombre,
                                    });
                                });
                            } else {
                                // Si no se seleccionó ninguna acción, agregar todas las acciones al recurso y rol seleccionados
                                acciones.forEach(accion => {
                                    asignaciones.push({
                                        CodigoRecurso: recursoSeleccionado.Codigo,
                                        NombreRecurso: recursoSeleccionado.NombreRecurso,
                                        CodigoAccion: accion.Codigo,
                                        NombreAccion: accion.NombreAccion,
                                        CodigoRol: rolSeleccionado.Codigo,
                                        NombreRol: rolSeleccionado.Nombre,
                                    });
                                });
                            }
                        });
                    } else {
                        // Si no se seleccionó ningún recurso, agregar todas las configuraciones posibles con las acciones y el rol seleccionados
                        recursos.forEach(recurso => {
                            acciones.forEach(accion => {
                                asignaciones.push({
                                    CodigoRecurso: recurso.Codigo,
                                    NombreRecurso: recurso.NombreRecurso,
                                    CodigoAccion: accion.Codigo,
                                    NombreAccion: accion.NombreAccion,
                                    CodigoRol: rolSeleccionado.Codigo,
                                    NombreRol: rolSeleccionado.Nombre,
                                });
                            });
                        });
                    }
                 
                    // Validación por parte de la base de datos
                    const asignacionesNuevasBD = asignaciones.filter(nuevaAsignacion => {
                        const esDuplicado = ConfiguracionAccionesResponse.some(config => (
                            config.IdRecurso === nuevaAsignacion.CodigoRecurso &&
                            config.IdAccion === nuevaAsignacion.CodigoAccion &&
                            config.IdRol === nuevaAsignacion.CodigoRol
                        ));
                        if(esDuplicado === true){
                            toastr.warning('¡Ya existe una configuración para esta asignación en la base de datos!');
                        }

                        return !esDuplicado;
                    });

                    // Validación por parte del cliente
                    const asignacionesUnicasCliente = asignacionesNuevasBD.filter(nuevaAsignacion => {
                        const esDuplicadoCliente = configuracionAcceso.some(asignacion => (
                            asignacion.CodigoRecurso === nuevaAsignacion.CodigoRecurso &&
                            asignacion.CodigoAccion === nuevaAsignacion.CodigoAccion &&
                            asignacion.CodigoRol === nuevaAsignacion.CodigoRol
                        ));
                        if(esDuplicadoCliente === true){
                            toastr.warning('¡Ya existe una configuración para esta asignación!');
                        }

                        return !esDuplicadoCliente;
                    });

                    // Agregar solo las asignaciones que no son duplicadas
                    configuracionAcceso = [...configuracionAcceso, ...asignacionesUnicasCliente];
                    console.log('configuracionAcceso mostrar tabla',configuracionAcceso)

                    // Limpiar la tabla
                    tablaConfi.clear().draw();

                    // Agregar nuevos datos y redibujar la tabla
                    tablaConfi.rows.add(configuracionAcceso).draw();

                    // Inicializar eventos de eliminar
                    inicializarEventosEliminar();
                } else {
                    toastr.warning('Rol seleccionado no encontrado');
                }
            } else {
                toastr.warning('No se ha seleccionado un rol');
            }
        } else {
            toastr.warning('Error al obtener datos desde la API');
        }
    } catch (error) {
        toastr.warning('Error en la asignación masiva:', error);
    }
}



// Asigna un evento clic al botón de asignación masiva usando jQuery
$('#btnAsignacionMasiva').on('click', function() {
    // Llamar a la función de asignación masiva para el rol Administrador
    asignacionMasiva();

});
  
  // Agregar eventos de cambio a los buscadores
$('#buscadorRecurso, #buscadorAcciones, #buscadorRol').on('input', function() {
    const searchTerm = $(this).val().toLowerCase(); // Obtener el término de búsqueda en minúsculas
    const listaId = $(this).closest('.lista').attr('id'); // Obtener el id del contenedor de la lista

    // Filtrar elementos de la lista según el término de búsqueda
    $('#' + listaId + ' .elemento').filter(function() {
        const nombreElemento = $(this).find('.contenedorNombre span').text().toLowerCase();
        return nombreElemento.includes(searchTerm);
    }).show();

    $('#' + listaId + ' .elemento').filter(function() {
        const nombreElemento = $(this).find('.contenedorNombre span').text().toLowerCase();
        return !nombreElemento.includes(searchTerm);
    }).hide();
});


function obtenerDetallesConfiguraciones() {
    const DetallesConfiguracione = [];
    toastr.options = {
        closeButton: true,
        timeOut: 2500, // Duración total de visualización en milisegundos (ejemplo: 2 segundos)
        hideDuration: 300 ,// Duración de la animación de ocultar en milisegundos (ejemplo: 0.3 segundos)
        progressBar: true, 
        closeEasing :'swing',
        preventDuplicates: true
      };
    // Obtener todos los datos de la tabla DataTable
    const datosTabla = tablaConfi.data().toArray();
  console.log('tabla:',datosTabla)
    // Verificar si hay datos en la tabla
    if (datosTabla.length === 0) {
        toastr.error('No hay datos en la tabla.');
      return  // Devuelve un array vacío o maneja el caso según tus necesidades
    }
  
    // Mapear los datos para obtener solo los códigos
    const Configuracion = datosTabla.map(configuracion => ({
      IdRecurso: configuracion.CodigoRecurso,
      IdAccion: configuracion.CodigoAccion,
      IdRol: configuracion.CodigoRol
    }));
  
    console.log('codigo:',Configuracion)
    // Verificar si se obtuvieron códigos
    if (Configuracion.length === 0) {
        toastr.error('No se encontraron códigos en los datos de la tabla.');
      return  // Devuelve un array vacío o maneja el caso según tus necesidades
    }
  
    // Validar otras condiciones según tus necesidades
    // Por ejemplo, podrías verificar si ciertas propiedades son válidas, etc.
  
    
    // Empujar el objeto de configuración al array DetallesConfiguracione
    DetallesConfiguracione.push(...Configuracion);
  
    console.log('DetallesConfiguracione:', DetallesConfiguracione);
    return DetallesConfiguracione;
  }
  
  




// Función para crear configuraciones de acceso
$('#btnCrear').click(async function () {
    toastr.options = {
        closeButton: true,
        timeOut: 2500, // Duración total de visualización en milisegundos (ejemplo: 2 segundos)
        hideDuration: 300 ,// Duración de la animación de ocultar en milisegundos (ejemplo: 0.3 segundos)
        progressBar: true, 
        closeEasing :'swing',
        preventDuplicates: true
      };
const data = obtenerDetallesConfiguraciones();

// Validar que no haya valores vacíos en detalleDv
if (!data || data.length === 0) {
    // Mostrar mensaje de error si no hay detalles de devolución
    toastr.error('Por favor,crea una seleccion antes de continuar.');
    return;
  }
const dataEnviar = {
    ConfiguracionesXML:data
}

    // Imprimir los códigos en la consola para verificar
    console.log('dataEnviar:', dataEnviar);


    try {
        await api.excutePost('configuracionAcceso/crear', dataEnviar);
        // Mostrar una notificación de éxito
     
     toastr.success('Configuracion de accesos  completada con éxito.');
     mostrarVista('vista1');
       
    
    } catch (error) {
    // Mostrar una alerta si hay un error durante la venta con duración de 2 segundos
    toastr.error('Error completo: ' + error.message);
    }

});

    } catch (error) {
        console.error('Error general:', error.message);
    }
});
