import { EntityClass } from "../EntityClass.js";
const api = new EntityClass();
import CreateDropDown from "../DropDownComponent.js"
$(document).ready(async function () {
      // Inicializar Select2 para todos los select con la clase select2
      $('.select2').select2({
        language: {
            noResults: function() {
                return "No hay resultado";        
            },
            searching: function() {
                return "Buscando..";
            }
        },
    
    });
    // Agregar placeholder al campo de búsqueda
$('.select2').on('select2:open', function() {
    $('.select2-search__field').attr('placeholder', 'Buscar.. ');
});
    
    let tabla,id,Tablacompra,tablainventario,tablemarca,tablecolor,tabletalla,tablematerial ;
let tablaproveedor,tablaBodega,tablaEmpleado,opcion;
const priducto = await api.excuteGet('productos');

    const Proveedor = await api.excuteGet('Proveedor');
    console.log('data Proveedor ',Proveedor)
    

    const compra = await api.excuteGet('compra');
    const Marcas = await api.excuteGet('marcas');
    console.log('data Marcas ',Marcas)
    const colores = await api.excuteGet('color');
    console.log('data color ',colores)
    const tallas = await api.excuteGet('talla');
    console.log('data tallas ',tallas)
      // Obtener datos de inventario al cargar la página
      const inventario = await api.excuteGet('inventario');

      console.log('inventario:',inventario);
    const MaterialZapato = await api.excuteGet('materialesZapatos');
   // Obtener datos de bodega al cargar la página
   const bodega = await api.excuteGet('bodega');
   console.log('data bodega ',bodega)

// DataTable initialization
var TablaCompra = $('#Tabla_Fact').DataTable({
    data: compra,
    "pageLength": 5,
    "lengthMenu": [5, 10, 20, 100], // Opciones de cantidad de elementos por página
    "autoWidth": true,
    columns: [
        { data: "Codigo" },
        { data: "CodigoCompra" },
        { data: "NombreProveedor" },
        {
            data: "FechaCompra",
            "targets": 2,
            "render": function (data, type, row) {
                return moment.utc(data).format('YYYY-MM-DD');
            }
        },
        { data: "Total" },
        {
            data: "EstadoCompra",
            render: function (data, type, row) {
                var claseEstado = '';

                if (data === 'Pendiente') {
                    claseEstado = 'estado-registrada';
                } else if (data === 'Completada') {
                    claseEstado = 'estado-completa';
                }

                return `<div class='${claseEstado}'>
                            ${data}
                        </div>`;
            }
        },
        {
            data: null,
            render: function (data, type, row) {
                var botones = '';

                // Botón de imprimir siempre presente
                botones += `<i class='fas fa-print btnImprimirCompra' title='Imprimir'></i>`;
                if (row.EstadoCompra === 'Pendiente') {
                    botones = `<i class='fas fa-edit btnEditarCompra' title='Editar'></i>
                               <i class='fas fa-check btnCompletarCompra' title='Completar'></i>`;
                }

                return botones;
            }
        }
    ],
    responsive: true,
    language: {
        url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
    },
    columnDefs: [
        {
            targets: [0],
            visible: false,
        },
    ],
    order: [[4, 'asc']], // Ordenar por la columna de Estado (columna índice 4) de manera ascendente
    createdRow: function (row, data, dataIndex) {
        // Agregar una clase personalizada a las filas con estado "Pendiente"
        if (data.EstadoCompra === 'Pendiente') {
            $(row).addClass('estado-pendiente');
        }
    }
});

// Manejar el clic en el botón de impresión
$('#Tabla_Fact').on('click', '.btnImprimirCompra', async function () {
    console.log('Clic en el botón de imprimir');
    try {
        // Obtener la fila actual
        var row = TablaCompra.row($(this).closest('tr'));

        // Obtener el CodigoCompra de la fila seleccionada
        var codigoCompra = row.data().CodigoCompra;

        // Redirigir al usuario a la descarga directa
        window.location.href = `http://localhost:3000/api/compra/generarfactura/${codigoCompra}`;
    } catch (error) {
        // Manejar errores de la redirección
        console.error('Error al redirigir a la descarga:', error);
    }
});



// Asignar evento a los botones de editar compra
$('#Tabla_Fact').on('click', '.btnCompletarCompra', async function () {
    // Obtener la fila actual
    var row = TablaCompra.row($(this).closest('tr'));

    // Obtener el CodigoCompra de la fila seleccionada
    var codigoCompra = row.data().CodigoCompra;

    // Mostrar un cuadro de confirmación utilizando SweetAlert2
    const confirmacion = await Swal.fire({
        title: '¿Deseas completar la compra?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
        try {
            // Si el usuario confirma, ejecutar la acción
            await api.excutePut(`compra/${codigoCompra}`);
            // Actualiza los datos en la tabla
            const compras = await api.excuteGet('compra');
            TablaCompra.clear().rows.add(compras).draw();
            Swal.fire('Compra completada con éxito', '', 'success');
          
            // Ocultar los botones si el estado es Completada
            if (row.data().EstadoCompra === 'Completada') {
                row.nodes().to$().find('.btnEditarCompra, .btnCompletarCompra').hide();
            }
        } catch (error) {
            console.error('Error al Completar la compra', error.message);
            Swal.fire('Error', 'Hubo un error al completar la compra', 'error');
        }
    } else {
        // Si el usuario cancela, no hacer nada
        Swal.fire('Operación cancelada', '', 'info');
    }

    // Cambiar el color del texto
    $(this).css('color', 'red'); // Cambia el color del texto del botón a rojo

    console.log("CodigoCompra seleccionado:", codigoCompra);
});



 // Por ejemplo, podrías redirigir a una página de edición con el ID de la compra
    // window.location.href = '/editarCompra?id=' + data.ID_Compra;


    tablainventario = $('#tbl_Inventario').DataTable({
        data: inventario,
        "scrollX": true, // Habilita el scroll horizontal
        "scrollCollapse": true, // Colapso de scroll si no es necesario
        "pageLength": 5,
        "lengthMenu": [5, 10, 20, 100], // Opciones de cantidad de elementos por página
        "autoWidth": true,       
        columns: [
            { data: "ID_Inventario" },
            {data: "NombreBodega"},
            {data: "Codigo"},
                {data: "NombreProductoZapatos"},
                {data: "NombreMarca"},
                {data: "NumeroTalla" },
                {data: "Color"},
                {data: "NombreMaterialZapatos"},
                {data: "PrecioCompra"},
                 {data:"Estado"},
            { defaultContent: "<div class='text-center'><div class='btn-group'><button class='btn btn-info btn-sm btnSeleccionarInventario'>Seleccionar</button></div></div>" }
        // Ocultar columnas

        ],
        columnDefs: [
            {
                targets: [2,9],
                visible: false,
            }],
        responsive: true,
language: {
    url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
}, 
    });



// Cargar datos en el selector de Producto
const selectProducto = $('#selectProducto');
selectProducto.append('<option value="">Seleccionar producto</option>'); // Opción por defecto
priducto.forEach(producto => {
    selectProducto.append(`<option value="${producto.Codigo}">${producto.Nombre}</option>`);
});

// Cargar datos en el selector de Proveedor
const selectProveedor = $('#selectProveedor');
selectProveedor.append('<option value="">Seleccionar Proveedor</option>'); // Opción por defecto
Proveedor.forEach(proveedor => {
    selectProveedor.append(`<option value="${proveedor.Codigo}">${proveedor.Nombre}</option>`);
});

// Cargar datos en el selector de Marca
const selectMarca = $('#selectMarca');
selectMarca.append('<option value="">Seleccionar Marca</option>'); // Opción por defecto

Marcas.forEach(marca => {
    selectMarca.append(`<option value="${marca.Codigo}">${marca.Nombre}</option>`);
});

// Cargar datos en el selector de Color
const selectColor = $('#selectColor');
selectColor.append('<option value="">Seleccionar Color</option>'); // Opción por defecto

colores.forEach(color => {
    selectColor.append(`<option value="${color.Codigo}">${color.Color}</option>`);
});

// Cargar datos en el selector de Talla
const selectTalla = $('#selectTalla');
selectTalla.append('<option value="">Seleccionar Talla</option>'); // Opción por defecto

tallas.forEach(talla => {
    selectTalla.append(`<option value="${talla.Codigo}">${talla.NumeroTalla}</option>`);
});

// Cargar datos en el selector de Material
const selectMaterial = $('#selectMaterial');
selectMaterial.append('<option value="">Seleccionar Material</option>'); // Opción por defecto
MaterialZapato.forEach(material => {
    selectMaterial.append(`<option value="${material.Codigo}">${material.Nombre}</option>`);
});

// Cargar datos en el selector de Bodega
const selectBodega = $('#selectBodega');
selectBodega.append('<option value="">Seleccionar Bodega</option>'); // Opción por defecto

bodega.forEach(bodega => {
    selectBodega.append(`<option value="${bodega.Codigo}">${bodega.Nombre}</option>`);
});

var elementosSeleccionados = [];

// Función para capturar elementos seleccionados cuando cambia cualquier selector
function capturarElementosSeleccionados() {
    $('.select2').on('change', function() {
        var codigo = $(this).val();
        var nombre = $(this).find('option:selected').text();
        
        // Verificar si se seleccionó un elemento y agregarlo al array de elementos seleccionados
        if (codigo && nombre) {
            elementosSeleccionados.push({ codigo: codigo, nombre: nombre });
        }
    });
}

// Llamar a la función para capturar elementos seleccionados
capturarElementosSeleccionados();

// Imprimir el array de elementos seleccionados para verificar si se capturan correctamente
console.log("elementosSeleccionados:", elementosSeleccionados);


console.log("elementosSeleccionados:",elementosSeleccionados);




  




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

   

        // Asigna un controlador de eventos al botón de cancelar
        $("#btnCancelar").on("click", function() {
            mostrarVista('vista1');
        });
    $("#btnRegistrarCompra").click(function () {
        mostrarVista('vista2');
         // Obtén la fecha actual del sistema
    const fechaActual = obtenerFechaActualSistema();

    // Asigna la fecha actual al campo de entrada de fecha
    $("#fechaCompra").val(fechaActual);
        opcion = 'crear';
    });

    $('.info-btn').on('click', function () {
        var title = $(this).data('title');
        var info = $(this).data('info');

        $('#infoModalLabel').text(title);
        $('#infoModalBody').text(info);
    });
    

        // Función para obtener la fecha actual del sistema en formato YYYY-MM-DD
function obtenerFechaActualSistema() {
    const fecha = new Date();
    const año = fecha.getFullYear();
    let mes = fecha.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
    let dia = fecha.getDate();

    // Formatea el mes y el día con dos dígitos si es necesario
    mes = mes < 10 ? '0' + mes : mes;
    dia = dia < 10 ? '0' + dia : dia;

    return `${año}-${mes}-${dia}`;
}

//SECCION DE MODALES
















// Abrir modal inventario
$(document).on("click", "#btnInventarioSeleccionado", function (event) {
    event.preventDefault();
    $('#mdlListadoInventario').modal('show');
    $("#btnmarcaSeleccionado").prop("disabled", true);

    $("#btntallaSeleccionado").prop("disabled", true);

    $("#btncolorSeleccionado").prop("disabled", true);
    $("#btnMaterialZapatosSeleccionado").prop("disabled", true);

    $("#btnBodegaSeleccionado").prop("disabled", true);

});

// Cerrar modal inventario
$(document).on("click", "#btncerrarmodalInventario", function (event) {
    event.preventDefault();
    $('#mdlListadoInventario').modal('hide');
});



    var tableDetalle;
    var sumaSubtotal = 0;
    var sumaTotal = 0;
    var sumaIva = 0;
//SECCION DE DATOS SELECCIONADOS

 // Declarar un array global para almacenar todos los datos seleccionado
// Evento para seleccionar un material del inventario

var DatosMostrarDetalle = [];
var PrecioCompraGlobal;
$('#tbl_Inventario tbody').on('click', '.btnSeleccionarInventario', function () {
  
    // Obtener la fila clicada
    var fila = tablainventario.row($(this).closest('tr')).data();

    // Comparar el ID_Inventario de la fila seleccionada con los datos del inventario
    const data = inventario.find(item => item.ID_Inventario === fila.ID_Inventario);

    if (data) {
        // Si hay coincidencia, actualizar los campos de los selectores con los datos correspondientes
        $('#selectProducto').val(data.Codigo).trigger('change'); // Actualizar y disparar el evento de cambio si es necesario
        $('#selectMarca').val(data.ID_Marca).trigger('change');
        $('#selectColor').val(data.ID_Colores).trigger('change');
        $('#selectTalla').val(data.ID_Talla).trigger('change');
        $('#selectMaterial').val(data.ID_MaterialZapatos).trigger('change');
        $('#selectBodega').val(data.ID_BODEGA).trigger('change');
        
        PrecioCompraGlobal = data.PrecioCompra;
    }

    // También puedes cerrar el modal si es necesario
    $('#mdlListadoInventario').modal('hide');
});



$("#btnDetalleCompras").click(function () {
    // Configuración de Toastr
    toastr.options = {
        closeButton: true,
        timeOut: 2500, // Duración total de visualización en milisegundos (ejemplo: 2 segundos)
        hideDuration: 300 ,// Duración de la animación de ocultar en milisegundos (ejemplo: 0.3 segundos)
        progressBar: true, 
        closeEasing :'swing',
        preventDuplicates: true
    };
        // Validar si se ha seleccionado algo en cada select
        if (!$("#selectProducto").val() ||
        !$("#selectMarca").val() ||
        !$("#selectColor").val() ||
        !$("#selectTalla").val() ||
        !$("#selectMaterial").val() ||
        !$("#selectBodega").val()) {
        toastr.error('Debes seleccionar un valor en cada campo.', 'Error');
        return; // Detiene la ejecución si algún select no tiene valor seleccionado
    }

    // Recopila datos del primer formulario
    var detalle = {
        idProducto: $("#selectProducto").val(),
        detallesExtras: {
            nombre: $("#selectProducto option:selected").text(),
            idmarca: $("#selectMarca").val(),
            marca: $("#selectMarca option:selected").text(),
            idcolor: $("#selectColor").val(),
            color: $("#selectColor option:selected").text(),
            idtalla: $("#selectTalla").val(),
            talla: $("#selectTalla option:selected").text(),
            idmaterial: $("#selectMaterial").val(),
            material: $("#selectMaterial option:selected").text(),
            idbodega: $("#selectBodega").val(),
            bodega: $("#selectBodega option:selected").text(),
            precioCompra: PrecioCompraGlobal !== undefined ? PrecioCompraGlobal : 0
            // Agrega más campos según sea necesario
        }
    };

    // Verifica si el producto ya está en DatosMostrarDetalle
    if (existeProductoEnDetalle(detalle)) {
        toastr.error('Los datos que estás intentando insertar ya están en el carrito.', 'Error');
        return; // Detiene la ejecución si el producto ya está en el carrito
    } else {
        // Si el producto no está en el carrito, agrégalo
        DatosMostrarDetalle.push(detalle);
        var data = detalle;
        agregarFilaATablaDetalle(data);
          // Muestra un mensaje de confirmación
          toastr.success('Se ha agregado correctamente al Carrito.', 'Éxito'); 
    }

    // Habilitar el botón
    $("#btnSeleccionarProducto").prop("disabled", false);
    $("#btnInventarioSeleccionado").prop("disabled", false);
   
    PrecioCompraGlobal = 0;
    // Puedes imprimir los detallesCompra y datosSeleccionados para verificar
    console.log('detallesCompras Carrito:', DatosMostrarDetalle);
});




// Función para verificar si un producto ya existe en DatosMostrarDetalle
function existeProductoEnDetalle(detalle) {
    // Asegúrate de que DatosMostrarDetalle esté disponible aquí
    return DatosMostrarDetalle.some(function (detalleExistente) {
        // Verifica si el ID del producto es el mismo
        if (detalleExistente.idProducto === detalle.idProducto) {
            // Si el ID del producto es el mismo, verifica si las características específicas son iguales
            return (
                detalleExistente.detallesExtras.marca === detalle.detallesExtras.marca &&
                detalleExistente.detallesExtras.color === detalle.detallesExtras.color &&
                detalleExistente.detallesExtras.material === detalle.detallesExtras.material &&
                detalleExistente.detallesExtras.talla === detalle.detallesExtras.talla &&
                detalleExistente.detallesExtras.bodega === detalle.detallesExtras.bodega
            );
        } else {
            // Si el ID del producto es diferente, no se considera como duplicado
            return false;
        }
    });
}


// Función para verificar si dos objetos tienen las mismas propiedades y valores
function sonIguales(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // Verifica si los objetos tienen la misma cantidad de propiedades
    if (keys1.length !== keys2.length) {
        return false;
    }

    // Verifica si todas las propiedades y valores son iguales
    for (let key of keys1) {
        if (obj1[key] !== obj2[key]) {
            return false;
        }
    }

    // Si pasa todas las verificaciones, los objetos son iguales
    return true;
}

$('#mdlDetallecompra').on('hidden.bs.modal', function () {
    // Limpiar los campos del formulario
    $("#nombreProducto, #marca, #color, #talla, #material, #nombrebodega").val('');
 
});


// Abrir modal Detallecompra
$(document).on("click", ".btnVerdetalle", function (event) {
    event.preventDefault();

    // Obtén el código de la fila seleccionada
    var codigoProducto = $(this).closest('tr').find('td:first').text().trim();
    console.log("Código del producto:", codigoProducto);

    // Encuentra el detalle correspondiente en el array DatosMostrarDetalle
    var detalleProducto = DatosMostrarDetalle.find(detalle => detalle.idProducto.toString() === codigoProducto);
console.log("datos a mostrar:",detalleProducto);
console.log("Marca:", detalleProducto.detallesExtras.marca);
console.log("Color:", detalleProducto.detallesExtras.color);
    // Comprueba si se encontró el detalle antes de mostrar el modal
    if (detalleProducto) {
        console.log("Detalle Producto:", detalleProducto);


        
        // Llena tu modal con los detalles correspondientes
        $("#idMarcapro").val(detalleProducto.detallesExtras.idmarca);
        $('#marcapro').val(detalleProducto.detallesExtras.marca);
   
        $("#colorpro").val(detalleProducto.detallesExtras.color);
        $("#idColorpro").val(detalleProducto.detallesExtras.idcolor);

        $("#idTallapro").val(detalleProducto.detallesExtras.idtalla);
        $("#tallapro").val(detalleProducto.detallesExtras.talla);
        
        $("#idMaterialpro").val(detalleProducto.detallesExtras.idmaterial);
        $("#materialpro").val(detalleProducto.detallesExtras.material);
    

        $("#idbodegapro").val(detalleProducto.detallesExtras.idbodega);
        $("#nombrebodegapro").val(detalleProducto.detallesExtras.bodega);

        // Agrega más líneas según sea necesario

        // Abre el modal
        $('#mdlDetallecompra').modal('show');

    } else {
        // Manejo de error o mensaje indicando que no se encontraron detalles
        console.log("No se encontraron detalles para el producto con código:", codigoProducto);
    }
});

// Cerrar modal Detallecompra
$(document).on("click", "#btnDetallecompra", function (event) {
    event.preventDefault();
    $('#mdlDetallecompra').modal('hide');
});






    function agregarFilaATablaDetalle(data) {
        if (!$.fn.DataTable.isDataTable('#Tabladetalle')) {
            // Si la tabla no tiene DataTable, inicialízala
            tableDetalle = $('#Tabladetalle').DataTable({
                "scrollY": "200px",
                "scrollX": true,
                "scrollCollapse": true,
                "autoWidth": true,
                "responsive": true,
                "language": {
                    "url": "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
                },
                
            });
        }
        
    
 // Obtén el precio de compra del objeto data (ajusta esto según la estructura real de tu objeto)
 var preciocompraCapturarInventario = parseFloat(data.detallesExtras.precioCompra) || 0;
 preciocompraCapturarInventario = !isNaN(preciocompraCapturarInventario) ? preciocompraCapturarInventario : 0;
 
 // Verifica si el precio de compra es válido
 var precioCompraInicial = !isNaN(preciocompraCapturarInventario) ? preciocompraCapturarInventario : 0;
    // var preciocompraCapturarInventario = data.PrecioCompra;
         var cantidadInput = '<input type="number" class="form-control" name="cantidad" value="0">';
         var pCompraInput = '<input type="number" class="form-control" name="p.compra" value="' + precioCompraInicial + '">';
         var descuentoInput = '<input type="number" class="form-control" name="descuento" value="0">';
    
        var rowNode = tableDetalle.row.add([
            `<span class="codigoProducto">${data.idProducto}</span>`, // Agrega una clase a la celda del Código
            `<span class="nombreProducto">${data.detallesExtras.nombre}</span>`, // Agrega una clase a la celda del Producto
            cantidadInput,
            pCompraInput,
            descuentoInput,
            '<span class="subtotal black-text">0</span>',
            '<span class="iva black-text">0</span>',
            '<span class="total black-text">0</span>',
            
           '<div class="text-center"><div class="btn-group"><button class="btn btn-info btn-sm btnVerdetalle">Ver </button>   <button class="btn btn-danger btn-sm btnEliminar">Eliminar</button></div></div>'
           
        ]).draw().node;
    
        $(rowNode).find('.btnEliminar').on('click', function () {
            var row = tableDetalle.row($(this).closest('tr'));

    // Verifica si hay filas antes de intentar eliminar
    if (row && row.index() !== undefined) {
        // Obtiene el código del producto en la fila
        var codigoProductoAEliminar = tabla.row(row).data().Codigo;
    
        // Elimina la fila solo si existe
        row.remove().draw();
        // Elimina el producto correspondiente en datosSeleccionados
    datosSeleccionados = datosSeleccionados.filter(codigo => codigo !== codigoProductoAEliminar);
    
        // Elimina el detalle correspondiente en DatosMostrarDetalle
        DatosMostrarDetalle = DatosMostrarDetalle.filter(detalle => detalle.idProducto !== codigoProductoAEliminar);
    
        // Suma los valores a las variables acumuladas
        sumaSubtotal = calcularSumaColumna('.subtotal');
        sumaTotal = calcularSumaColumna('.total');
        sumaIva = calcularSumaColumna('.iva');
        actualizarCamposEntrada();
    
        // Puedes imprimir los detallesMostrarDetalle actualizados para verificar
        console.log('DatosMostrarDetalle:', DatosMostrarDetalle);
    }
    
        });
    
        
    $(rowNode).find('input[name="cantidad"], input[name="p.compra"], input[name="descuento"]').on('input', function () {
        var cantidad = parseFloat($(this).closest('tr').find('input[name="cantidad"]').val()) || 0;
        var pCompra = parseFloat($(this).closest('tr').find('input[name="p.compra"]').val()) || 0;
        var descuento = parseFloat($(this).closest('tr').find('input[name="descuento"]').val()) || 0;

        var subtotal = cantidad * pCompra;
        var iva = subtotal * 0.15;
        var total = subtotal - descuento + iva;

        $(this).closest('tr').find('.subtotal').text(subtotal.toFixed(2));
        $(this).closest('tr').find('.iva').text(iva.toFixed(2));
        $(this).closest('tr').find('.total').text(total.toFixed(2));

 // Suma los valores a las variables acumuladas
 sumaSubtotal = calcularSumaColumna('.subtotal');
 sumaTotal = calcularSumaColumna('.total');
 sumaIva = calcularSumaColumna('.iva');


console.log('Suma de Subtotal:', sumaSubtotal.toFixed(2));
console.log('Suma de Total:', sumaTotal.toFixed(2));
console.log('Suma de Iva:', sumaIva.toFixed(2));

  // Actualiza los campos de entrada
  actualizarCamposEntrada();

    });
    }
    // Función para calcular la suma de una columna específica
function calcularSumaColumna(columna) {
    var suma = 0;
    $('#Tabladetalle ' + columna).each(function () {
        suma += parseFloat($(this).text()) || 0;
    });
    return suma;
}


    // Función para actualizar los campos de entrada con las sumas
function actualizarCamposEntrada() {
    $('#Subtotal').val(sumaSubtotal.toFixed(2));
    $('#Total').val(sumaTotal.toFixed(2));
    $('#Iva').val(sumaIva.toFixed(2));
}
    function mostrarAlertaExitosa() {
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Producto agregado exitosamente a la tabla.',
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false,
            customClass: {
                popup: 'tamanio-alerta',
                container: 'mi-container-clase'
            }
        });
    }


//seccion de captura de datos para enviarlos al submit

    let codigoProducto;
    function obtenerDetallesCompra() {
        const detallesCompra = [];
        const idEmpleado = $('#idEmpleado').val();
        const idProveedor =  $("#selectProveedor").val();
    
        // Objeto para almacenar los detalles de cada producto
        const detallesPorProducto = {};
    
        // Recorrer la tabla de detalles y obtener los datos
        $('#Tabladetalle tbody tr').each(function () {
            const codigoProducto = parseFloat($(this).find('.codigoProducto').text()) || 0; 
            const cantidad = parseFloat($(this).find('input[name="cantidad"]').val()) || 0;
            const precioCompra = parseFloat($(this).find('input[name="p.compra"]').val()) || 0;
            const descuento = parseFloat($(this).find('input[name="descuento"]').val()) || 0;
            const subtotal = parseFloat($(this).find('.subtotal').text()) || 0;
            const iva = parseFloat($(this).find('.iva').text()) || 0;
            const total = parseFloat($(this).find('.total').text()) || 0;
    
            // Obtener detallesExtras desde DatosMostrarDetalle
            const detallesEncontrados = DatosMostrarDetalle.filter(detalle => detalle.idProducto === codigoProducto.toString());
    
            if (detallesEncontrados.length > 0) {
                detallesEncontrados.forEach(detalleEncontrado => {
                    const detallesExtras = detalleEncontrado.detallesExtras;
    
                    const detalleProducto = {
                        ID_ProductoZapatos: codigoProducto,
                        Cantidad: cantidad, 
                        PrecioCompra: precioCompra,
                        Descuento: descuento,
                        Subtotal: subtotal,
                        IVA: iva,
                        Total: total,
                        ID_Marca: detallesExtras.idmarca,
                        ID_Colores: detallesExtras.idcolor,
                        ID_BODEGA: detallesExtras.idbodega,
                        ID_MaterialZapatos: detallesExtras.idmaterial,
                        ID_Talla: detallesExtras.idtalla,
                        ID_Empleado: idEmpleado,
                        ID_Proveedor: idProveedor
                    };
    
                    // Verificar si ya existe un array de detalles para este producto
                    if (!detallesPorProducto.hasOwnProperty(codigoProducto)) {
                        detallesPorProducto[codigoProducto] = [];
                    }
    
                    // Agregar el detalle al array de detalles del producto
                    detallesPorProducto[codigoProducto].push(detalleProducto);
                });
            } else {
                console.error(`No se encontraron detalles para el producto con código ${codigoProducto}`);
            }
        });
    
        // Agregar los detalles de cada producto al array detallesCompra
        for (const codigoProducto in detallesPorProducto) {
            detallesCompra.push(...detallesPorProducto[codigoProducto]);
        }
    
        console.log('detallesCompra', detallesCompra);
        return detallesCompra;
    }
    
    
    
    // Resto de tu código...
    
    var codigoCompraEditar ;
   // Evento para editar una compra
$('#Tabla_Fact').on('click', '.btnEditarCompra', async function () {
    // Obtener la fila actual
    opcion= 'editar';
    var data = TablaCompra.row($(this).closest('tr')).data();

    // Obtener el CodigoCompra de la fila seleccionada
    codigoCompraEditar = data.CodigoCompra;

    try {
        // Obtener los detalles de la compra a través de una solicitud al servidor
        const detallesCompra = await api.excuteGet(`compra/detallecompra/${codigoCompraEditar}`);
console.log('edit:',detallesCompra);
        // Llenar los campos de edición con los detalles obtenidos
        llenarCamposEdicion(detallesCompra);
        mostrarVista('vista2');
        // Mostrar el formulario de edición (puedes abrir un modal u otra interfaz según tu implementación)
        // ...

    } catch (error) {
        console.error('Error al obtener detalles de compra para editar', error.message);
    }
});

// ...

function llenarCamposEdicion(detallesCompra) {
    // Supongamos que aquí "detallesCompra" es un objeto que contiene los detalles de la compra obtenidos del backend
console.log('s:',detallesCompra.result[0].CodigoCompra);
    // Ejemplo de cómo puedes llenar los campos de edición
    $('#codigoCompra').val(detallesCompra.result[0].CodigoCompra);
  // Formatear la fecha utilizando Moment.js
  var fechaFormateada = moment.utc(detallesCompra.result[0].FechaCompra).format('YYYY-MM-DD');
  $('#fechaCompra').val(fechaFormateada);
    // Llenar otros campos según sea necesario

   
}


//SECCION PARA LAS INSERSIONES DE DATOS A TABLAS // CREAR
        $("#btnCrearProductos").click(function () {
            $('#modalCRUDP').modal('show');
        });

        const categoriasResponse = await api.excuteGet('categorias');
        const categoriasData = categoriasResponse;
        const selectrol = document.getElementById('id_categoria');
        CreateDropDown(categoriasData, selectrol,  'Nombre','Codigo');
    //MARCA

    $("#btnCrearMarca").click(function () {
        $('#modalCRUDM').modal('show');
    });
//TALLA
$("#btnCrearTalla").click(function () {
    $('#modalCRUDT').modal('show');
});
//COLOR
$("#btnCrearColor").click(function () {
    $('#modalCRUDC').modal('show');
});
//MATERIAL
$("#btnCrearMaterial").click(function () {
    $('#modalCRUDMT').modal('show');
});
//PROVEEDOR

$("#btnCrearProveedor").click(function () {
    $('#modalCRUDPV').modal('show');
});
     
//BODEGA   
$("#btnCrearBodega").click(function () {
    $('#modalCRUDB').modal('show');
});
  
 //SECCION DE SUBMIT PARA LOS FORMULARIO 
         // Submit para CREAR y EDITAR
         $('#formP').submit(async function (e) {
        
                event.preventDefault();
                toastr.options = {
                    closeButton: true,
                    timeOut: 2500, // Duración total de visualización en milisegundos (ejemplo: 2 segundos)
                    hideDuration: 300 ,// Duración de la animación de ocultar en milisegundos (ejemplo: 0.3 segundos)
                    progressBar: true, 
                    closeEasing :'swing',
                    preventDuplicates: true
                  };

          
        const    nombre = $.trim($('#nombre').val());
        const    descripcion = $("#descripcion").val();
        const     idCategoria = $.trim($('#id_categoria').val());
        const     estado = $("#estado").val();

        // Realiza la validación
     // Definir reglas de validación para cada campo
     const reglasValidacion = {
        nombre: [
            { validar: () => validator.isLength(nombre, { min: 1 }), mensaje: 'El campo Nombre no puede estar vacío.' },
            { validar: () => validator.isAlpha(nombre), mensaje: 'El campo Nombre solo debe contener letras.' }
        ],
        descripcion: [
            { validar: () => validator.isLength(descripcion, { min: 1 }), mensaje: 'La descripción no puede estar vacía.' }
        ],
        idCategoria: [
            { validar: () => validator.isInt(idCategoria), mensaje: 'El ID de categoría no es válido.' }
        ],
        estado: [
            { validar: () => validator.isLength(estado, { min: 1 }), mensaje: 'El campo Estado no puede estar vacío.' }
        ]
    };

    // Array para almacenar mensajes de error
    const errores = [];

    // Validar cada campo
    Object.entries(reglasValidacion).forEach(([campo, reglas]) => {
        reglas.forEach(({ validar, mensaje }) => {
            if (!validar()) {
                errores.push(mensaje);
            }
        });
    });

     // Si hay errores, mostrarlos en toasts y detener la ejecución
     if (errores.length > 0) {
        errores.forEach(error => toastr.error(error));
        return;
    }



        console.log('data product envio:',nombre,descripcion,idCategoria,estado);
            try {
           
                    await api.excutePost('producto',{nombre,descripcion,idCategoria, estado });
            

                $('#modalCRUDP').modal('hide');
                  // Actualizar la tabla con las nuevas productos
                  const nuevasproductos = await api.excuteGet('productos');
                  tabla.clear().rows.add(nuevasproductos).draw();
               
            } catch (error) {
                console.error('Error al guardar/editar:', error.message);
            }
        });
        //SUBMIT DE MARCA 
 

        $('#formM').submit(async function (e) {
            e.preventDefault();

        
          const  nombre = $.trim($('#nombrem').val());
          const detalleMarca = $.trim($('#detalleMarca').val());
          const  estado = $("#estado").val() ;   
          console.log('data Marca envio:',nombre,detalleMarca,estado);
            try {
               
                    await api.excutePost('marcas',{nombre,detalleMarca, estado });
                      
                    $('#modalCRUDM').modal('hide');
                    $("#formM")[0].reset();
                  // Actualizar la tabla con las nuevas categorías
                  const nuevasmarcas= await api.excuteGet('marcas');
                  tablemarca.clear().rows.add(nuevasmarcas).draw();



            } catch (error) {
                console.error('Error al guardar/editar:', error.message);
            }
        });
 // Submit para CREAR talla
 $('#formT').submit(async function (e) {
    e.preventDefault();

 const NumeroTalla = $.trim($('#NumeroTalla').val());
 const  estado = $("#estado").val();

    try {

            await api.excutePost('talla', { NumeroTalla, estado });
      

        // Actualizar la tabla con las nuevas talla
        const nuevastalla = await api.excuteGet('talla');
        tabletalla.clear().rows.add(nuevastalla).draw();

        $('#modalCRUDT').modal('hide');
    } catch (error) {
        console.error('Error al guardar/editar:', error.message);
    }
});
 // Submit PARA CREAR COLOR
 $('#formC').submit(async function (e) {
    e.preventDefault();

   
  const  color = $.trim($('#colorr').val());
  const  estado = $("#estado").val();

    try {
       
            await api.excutePost('color',{color, estado });
       
        // Actualizar la tabla
        const nuevascolor = await api.excuteGet('color');
        tablecolor.clear().rows.add(nuevascolor).draw();

        $('#modalCRUDC').modal('hide');
    } catch (error) {
        console.error('Error al guardar/editar:', error.message);
    }
});
 // Submit para CREAR Material
 $('#formMT').submit(async function (e) {
    e.preventDefault();

   
   const nombre = $.trim($('#nombremt').val());
   const descripcion =$.trim($('#descripcionmt').val());
   const  tipoMaterial=$.trim($('#tipoMaterialmt').val());
   const tipodeCostura =$.trim($('#tipodeCosturamt').val());
   const tipoSuela =$.trim($('#tipoSuelamt').val());
   const fabricante=$.trim($('#fabricantemt').val());
   const observaciones=$.trim($('#observacionesmt').val());
   const estado = $("#estadomt").val() ;  

    try {

            await api.excutePost('materialesZapatos',{nombre, descripcion, tipoMaterial, tipodeCostura, tipoSuela, fabricante, observaciones, estado });
        // Actualizar la tabla con las nuevas categorías
        const nuevasmaterialesZapatos = await api.excuteGet('materialesZapatos');
        tablematerial.clear().rows.add(nuevasmaterialesZapatos).draw();

        $('#modalCRUD').modal('hide');
    } catch (error) {
        console.error('Error al guardar/editar:', error.message);
    }
});


$('#formPV').submit(async function (e) {
    e.preventDefault();


const    nombre = $.trim($('#nombrepv').val());
const   direccion = $.trim($('#direccionpv').val());
const    telefono = $.trim($('#telefonopv').val());
const    ruc = $.trim($('#rucpv').val());
const    emailProveedor = $.trim($('#emailProveedorpv').val());
const    estado = $("#estadopv").val() ;   

    try {
            await api.excutePost('Proveedor',{nombre, direccion, telefono, ruc, emailProveedor,estado });
    
        // Actualizar la tabla 
        const nuevasProveedor = await api.excuteGet('Proveedor');
        tablaproveedor.clear().rows.add(nuevasProveedor).draw();

        $('#modalCRUDPV').modal('hide');
    } catch (error) {
        console.error('Error al guardar/editar:', error.message);
    }
});

    // Submit para CREAR y EDITAR
    $('#formB').submit(async function (e) {
        e.preventDefault();

      
   const     nombre = $.trim($('#nombreB').val());
   const     ubicacion = $.trim($('#ubicacionB').val());
   const     estado = $("#estadoB").val();

        try {
          
                await api.excutePost('bodega', { nombre, ubicacion, estado });
          

            // Actualizar la tabla con las nuevas categorías
            const nuevasBodega = await api.excuteGet('bodega');
            tablaBodega.clear().rows.add(nuevasBodega).draw();
  // Limpiar los campos del formulario después de la operación exitosa
  $('#nombreB').val('');
  $('#ubicacionB').val('');
  $('#estadoB').val(''); // Puedes establecer un valor predeterminado si es necesario

            $('#modalCRUDB').modal('hide');
        } catch (error) {
            console.error('Error al guardar/editar:', error.message);
        }
    });

       // Submit para CREAR y EDITAR
       $('#btnRegistrarCompraFact').on('click', async function () {
        // Obtener los valores de los campos
        const detallesCompra = obtenerDetallesCompra();
        const codigoCompra = $.trim($('#codigoCompra').val());
        const FechaCompra = $.trim($('#fechaCompra').val());
        const totalsuma = $('#Total').val();
        const EstadoCompra = 'Pendiente';
        const compraData = {
            CodigoCompra: codigoCompra,
            FechaCompra: FechaCompra,
            Total: totalsuma,
            EstadoCompra: EstadoCompra,
            DetallesCompra: detallesCompra,
        };
    
        console.log('compraData:', compraData);
    
        try {
            if (opcion === 'crear') {
                await api.excutePost('compra', compraData);
            } else if (opcion === 'editar') {
                await api.excutePut(`compra/editar/${codigoCompraEditar}`, compraData);
            }
    
            // Redireccionar al contenedor 1
            mostrarVista('vista1');
            const compras = await api.excuteGet('compra');
            TablaCompra.clear().rows.add(compras).draw();
        } catch (error) {
            console.error('Error al guardar/editar:', error.message);
        }
    });
    


    // Función para realizar la operación de guardar completa
async function guardarCompleta() {
   
     // Obtener los valores de los campos
const detallesCompra = obtenerDetallesCompra();
const codigoCompra = $.trim($('#codigoCompra').val());
const fechaCompra = $.trim($('#fechaCompra').val());
const totalSuma = $('#Total').val();
const estadoCompra = 'Pendiente';

// Datos para la creación y completación de la compra
const compraData = {
    CodigoCompra: codigoCompra,
    FechaCompra: fechaCompra,
    Total: totalSuma,
    EstadoCompra: estadoCompra,
    DetallesCompra: detallesCompra,
};
console.log('compraData completada',compraData )
/*

// Realizar la creación y completación de la compra
try {
  
    const response =   await api.excutePost('compra/crear-y-completar',compraData);

    if (response.success) {
        // Redireccionar al contenedor 1
        mostrarVista('vista1');
        const compras = await api.excuteGet('compra');
        TablaCompra.clear().rows.add(compras).draw();
        console.log('Compra insertada y completada exitosamente.');
    } else {
        console.error('Error al crear y completar la compra:', response.error, response.details);
        // Manejar el error, mostrar un mensaje al usuario, etc.
    }
} catch (error) {
    console.error('Error en la operación:', error);

}*/

   
}

$(document).on("click", "#btnGuardarCompracompleta", function (event) {
    event.preventDefault();
guardarCompleta();
});




});
