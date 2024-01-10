import { EntityClass } from "../EntityClass.js";
const api = new EntityClass();
import CreateDropDown from "../DropDownComponent.js"
$(document).ready(async function () {

    let tabla,id,Tablacompra,tablainventario,tablemarca,tablecolor,tabletalla,tablematerial ;
let tablaproveedor,tablaBodega,tablaEmpleado,opcion;
const priducto = await api.excuteGet('productos');
    const Proveedor = await api.excuteGet('Proveedor');
    const empleado = await api.excuteGet('empleado');
    const compra = await api.excuteGet('compra');
    const Marcas = await api.excuteGet('marcas');
    const colores = await api.excuteGet('color');
    const tallas = await api.excuteGet('talla');
      // Obtener datos de inventario al cargar la página
      const inventario = await api.excuteGet('inventario');
      console.log('inventario:',inventario);
    const MaterialZapato = await api.excuteGet('materialesZapatos');
   // Obtener datos de bodega al cargar la página
   const bodega = await api.excuteGet('bodega');
    console.log('priducto', priducto);
    console.log('Proveedor', Proveedor);

// DataTable initialization
var TablaCompra = $('#Tabla_Fact').DataTable({
    data: compra,
    columns: [
        { data: "Codigo" },
        { data: "CodigoCompra" },
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

    console.log("CodigoCompra seleccionado:", codigoCompra);
});


 // Por ejemplo, podrías redirigir a una página de edición con el ID de la compra
    // window.location.href = '/editarCompra?id=' + data.ID_Compra;


    tablainventario = $('#tbl_Inventario').DataTable({
        data: inventario,
        "scrollX": true, // Habilita el scroll horizontal
        "scrollCollapse": true, // Colapso de scroll si no es necesario
                         
        columns: [
            { data: "ID_Inventario" },
            {data: "NombreBodega"},
            {data: "Codigo"},
                {data: "Nombre"},
                {data: "NombreMarca"},
                {data: "NumeroTalla" },
                {data: "Color"},
                {data: "NombreMaterial"},
                {data: "PrecioCompra"},
                 {data:"Estado"},
            { defaultContent: "<div class='text-center'><div class='btn-group'><button class='btn btn-info btn-sm btnSeleccionarInventario'>Seleccionar</button></div></div>" }
        // Ocultar columnas

        ],
        responsive: true,
language: {
    url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
},
    });


// DataTable initialization
tabla = $('#tbl_productos').DataTable({
    data: priducto,
    columns: [
        { data: "Codigo" },
        { data: "Nombre" },
        { 
            data: "Descripcion",
            render: function (data, type, row, meta) {
                if (type === 'display' && data.length > 10) {
                    return '<span title="' + data + '">' + data.substr(0, 10) + '...</span>';
                } else {
                    return data;
                }
            }
        },
        { data: "Categoria" },
        { data: "Estado" },
        { defaultContent: "<div class='text-center'><div class='btn-group'><button class='btn btn-info btn-sm btnSeleccionar'>Seleccionar</button></div></div>" }
    ],
    responsive: true,
    language: {
        url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
    }
});

///DataTable Marca
     // DataTable initialization
     tablemarca = $('#tbl_marca').DataTable({
        data: Marcas,
        columns: [
            { data: "Codigo" },
            { data: "Nombre" },
            { data: "DetalleMarca" },
            { data: "Estado" },
            { defaultContent: "<div class='text-center'><div class='btn-group'><button class='btn btn-info btn-sm btnSeleccionarMarca'>Seleccionar</button></div></div>" }
        ],
        responsive: true,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
        }
    });

///DataTable Material
     // DataTable initialization
     tablematerial = $('#tbl_material').DataTable({
        data: MaterialZapato,
      
                         
        columns: [
            { data: "Codigo" },
            {"data": "Nombre"},
            {"data": "Descripcion"},
            {"data": "TipoMaterial"},
            {"data": "TipodeCostura"},
            {"data": "TipoSuela"},
            {"data": "Fabricante"},
            {"data": "Observaciones"},
            { data: "Estado" },
            { defaultContent: "<div class='text-center'><div class='btn-group'><button class='btn btn-info btn-sm btnSeleccionarMaterial'>Seleccionar</button></div></div>" }
        ], columnDefs: [
            { targets: [0,2,7, 8], visible: false } // Ocultar columnas Ruc (índice 4) y EmailProveedor (índice 6)
        ],
        responsive: true,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
        }
    });

    ///DataTable Color
     // DataTable initialization
     tablecolor = $('#tbl_color').DataTable({
        data: colores,
        columns: [
            { data: "Codigo" },
            { data: "Color" },
            { data: "Estado" },
            { defaultContent: "<div class='text-center'><div class='btn-group'><button class='btn btn-info btn-sm btnSeleccionarcolor'>Seleccionar</button></div></div>" }
        ],
        responsive: true,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
        }
    });
///DataTable Talla
         // DataTable initialization
         tabletalla = $('#tbl_talla').DataTable({
            data: tallas,
            columns: [
                { data: "Codigo" },
                    { data: "NumeroTalla" },
                { data: "Estado" },
                { defaultContent: "<div class='text-center'><div class='btn-group'><button class='btn btn-info btn-sm btnSeleccionartalla'>Seleccionar</button></div></div>" }
            ],
            responsive: true,
            language: {
                url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
            }
        });
///DataTable Proveedor
     // DataTable initialization
     // Ocultar las columnas deseadas
     tablaproveedor = $('#tbl_Proveedor').DataTable({
    data: Proveedor,
    columns: [
        { data: "Codigo" },
        { data: "Nombre" },
        { data: "Direccion" },
        { data: "Telefono" },
        { data: "Ruc" },
        { data: "EmailProveedor" },
        { data: "Estado" },
        { defaultContent: "<div class='text-center'><div class='btn-group'><button class='btn btn-info btn-sm btnSeleccionarProveedor'>Seleccionar</button></div></div>" }
    ],
    columnDefs: [
        { targets: [0,2, 6], visible: false } // Ocultar columnas Ruc (índice 4) y EmailProveedor (índice 6)
    ],
    responsive: true,
    language: {
        url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
    }
});


///DataTable Bodega
     // DataTable initialization
     tablaBodega = $('#tbl_Bodega').DataTable({
        data: bodega,
        columns: [
            { data: "Codigo" },
            { data: "Nombre" },
            { data: "Ubicacion" },
            { data: "Estado" },
            { defaultContent: "<div class='text-center'><div class='btn-group'><button class='btn btn-info btn-sm btnSeleccionarBodega'>Seleccionar</button></div></div>", }
        ],
        responsive: true,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
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

    $("#btnListaCompras").click(function () {
        mostrarVista('vista1');
  
    });

    $("#btnRegistrarCompra").click(function () {
        mostrarVista('vista2');
        opcion = 'crear';
    });

//SECCION DE MODALES

//abrir modal producto
    $(document).on("click", "#btnSeleccionarProducto", function (event) {
        event.preventDefault();
        $('#mdlListadoProductos').modal('show');
    });
//cerrar modal producto
    $(document).on("click", "#btncerrarmodal", function (event) {
        event.preventDefault();
        $('#mdlListadoProductos').modal('hide');
    });
// Abrir modal Proveedor
$(document).on("click", "#btnproveedorSeleccionado", function (event) {
    event.preventDefault();
    $('#mdlListadoProveedor').modal('show');
});

// Cerrar modal Proveedor
$(document).on("click", "#btncerrarmodalProveedor", function (event) {
    event.preventDefault();
    $('#mdlListadoProveedor').modal('hide');
});

// Abrir modal Bodega
$(document).on("click", "#btnBodegaSeleccionado", function (event) {
    event.preventDefault();
    $('#mdlListadoBodega').modal('show');
});

// Cerrar modal Bodega
$(document).on("click", "#btncerrarmodalBodega", function (event) {
    event.preventDefault();
    $('#mdlListadoBodega').modal('hide');
});


// Abrir modal Empleado
$(document).on("click", "#btnEmpleadoSeleccionado", function (event) {
    event.preventDefault();
    $('#mdlListadoEmpleado').modal('show');
});

// Cerrar modal Empleado
$(document).on("click", "#btncerrarmodalEmpleado", function (event) {
    event.preventDefault();
    $('#mdlListadoEmpleado').modal('hide');
});


// Abrir modal Marca
$(document).on("click", "#btnmarcaSeleccionado", function (event) {
    event.preventDefault();
    $('#mdlListadoMarca').modal('show');
});

// Cerrar modal Marca
$(document).on("click", "#btncerrarmodalMarca", function (event) {
    event.preventDefault();
    $('#mdlListadoMarca').modal('hide');
});
// Abrir modal Color
$(document).on("click", "#btncolorSeleccionado", function (event) {
    event.preventDefault();
    $('#mdlListadoColor').modal('show');
});

// Cerrar modal Color
$(document).on("click", "#btncerrarmodalColor", function (event) {
    event.preventDefault();
    $('#mdlListadoColor').modal('hide');
});

// Abrir modal Talla
$(document).on("click", "#btntallaSeleccionado", function (event) {
    event.preventDefault();
    $('#mdlListadotalla').modal('show');
});

// Cerrar modal Talla
$(document).on("click", "#btncerrarmodaltalla", function (event) {
    event.preventDefault();
    $('#mdlListadotalla').modal('hide');
});


// Abrir modal Mateial
$(document).on("click", "#btnMaterialZapatosSeleccionado", function (event) {
    event.preventDefault();
    $('#mdlListadoMaterial').modal('show');
});

// Cerrar modal Material
$(document).on("click", "#btncerrarmodalmaterial", function (event) {
    event.preventDefault();
    $('#mdlListadoMaterial').modal('hide');
});

// Abrir modal inventario
$(document).on("click", "#btnInventarioSeleccionado", function (event) {
    event.preventDefault();
    $('#mdlListadoInventario').modal('show');
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

 // Declarar un array global para almacenar todos los datos seleccionados

$('#tbl_productos tbody').on('click', '.btnSeleccionar', function () {
    var data = tabla.row($(this).closest('tr')).data();
    $('#idproducto').val(data.Codigo);
    $('#nombreProducto').val(data.Nombre);
        // También puedes cerrar el modal si es necesario
        $('#mdlListadoProductos').modal('hide');
    // deshabilitar   el botón
$("#btnSeleccionarProducto").prop("disabled", true);
});





  //evento para seleccionar un proveedor
  $('#tbl_Proveedor tbody').on('click', '.btnSeleccionarProveedor', function () {
    var data = tablaproveedor.row($(this).closest('tr')).data();
    // Aquí deberías establecer el ID y el nombre del proveedor en tus campos correspondientes
    $('#idProveedor').val(data.Codigo);
    $('#nombreProveedor').val(data.Nombre);

    // También puedes cerrar el modal si es necesario
    $('#mdlListadoBodega').modal('hide');
});

// Evento para seleccionar una color
$('#tbl_marca tbody').on('click', '.btnSeleccionarMarca', function () {
var data = tablemarca.row($(this).closest('tr')).data();
// Aquí deberías establecer el ID y el nombre de la bodega en tus campos correspondientes
$('#idMarca').val(data.Codigo);
$('#marca').val(data.Nombre);

// También puedes cerrar el modal si es necesario
$('#mdlListadoMarca').modal('hide');
});
//evento para seleccionar un color
$('#tbl_color tbody').on('click', '.btnSeleccionarcolor', function () {
    var data = tablecolor.row($(this).closest('tr')).data();
    // Aquí deberías establecer el ID y el nombre del proveedor en tus campos correspondientes
    $('#idColor').val(data.Codigo);
    $('#color').val(data.Color);

    // También puedes cerrar el modal si es necesario
    $('#mdlListadoColor').modal('hide');
});

// Evento para seleccionar una Bodega
$('#tbl_Bodega tbody').on('click', '.btnSeleccionarBodega', function () {
var data = tablaBodega.row($(this).closest('tr')).data();
// Aquí deberías establecer el ID y el nombre de la bodega en tus campos correspondientes
$('#idbodega').val(data.Codigo);
$('#nombrebodega').val(data.Nombre);

// También puedes cerrar el modal si es necesario
$('#mdlListadoBodega').modal('hide');
});


// Evento para seleccionar una Empleado
$('#tbl_Empleado tbody').on('click', '.btnSeleccionarEmpleado', function () {
var data = tablaEmpleado.row($(this).closest('tr')).data();
console.log('data empleado select:',data);
console.log('data empleado codigo:',data.Codigo);
console.log('data empleado Nombre:',data.Nombre);
// Aquí deberías establecer el ID y el nombre de la Enpleado en tus campos correspondientes
$('#idEmpleado').val(data.Codigo);
$('#Empeleado').val(data.Nombre);

// También puedes cerrar el modal si es necesario
$('#mdlListadoEmpleado').modal('hide');
});



// Evento para seleccionar una talla
$('#tbl_talla tbody').on('click', '.btnSeleccionartalla', function () {
var data = tabletalla.row($(this).closest('tr')).data();
// Aquí deberías establecer el ID y el nombre de la Enpleado en tus campos correspondientes
$('#idTalla').val(data.Codigo);
$('#talla').val(data.NumeroTalla);

// También puedes cerrar el modal si es necesario
$('#mdlListadotalla').modal('hide');
});




// Evento para seleccionar una Material
$('#tbl_material tbody').on('click', '.btnSeleccionarMaterial', function () {
var data = tablematerial.row($(this).closest('tr')).data();
// Aquí deberías establecer el ID y el nombre de la Enpleado en tus campos correspondientes
$('#idMaterial').val(data.Codigo);
$('#material').val(data.Nombre);

// También puedes cerrar el modal si es necesario
$('#mdlListadoMaterial').modal('hide');
});

// Evento para seleccionar un material del inventario
// Evento para seleccionar un material del inventario
var DatosMostrarDetalle = [];
var PrecioCompraGlobal;
$('#tbl_Inventario tbody').on('click', '.btnSeleccionarInventario', function () {
  
    // Obtener la fila clicada
    var fila = tablainventario.row($(this).closest('tr')).data();

    // Comparar el ID_Inventario de la fila seleccionada con los datos del inventario
    const data = inventario.find(item => item.ID_Inventario === fila.ID_Inventario);

    if (data) {
        // Si hay coincidencia, actualizar los campos de los inputs con los datos correspondientes
        $('#idproducto').val(data.Codigo);
        $('#nombreProducto').val(data.Nombre);
        $('#idMarca').val(data.ID_Marca);
        $('#marca').val(data.NombreMarca);
        $('#idColor').val(data.ID_Colores);
        $('#color').val(data.Color);
        $('#idTalla').val(data.ID_Talla);
        $('#talla').val(data.NumeroTalla);
        $('#idMaterial').val(data.ID_MaterialZapatos);
        $('#material').val(data.NombreMaterial);
        $('#idbodega').val(data.ID_BODEGA);
        $('#nombrebodega').val(data.NombreBodega);
PrecioCompraGlobal = data.PrecioCompra;
   
       
    }
    

    // También puedes cerrar el modal si es necesario
    $('#mdlListadoInventario').modal('hide');
});



$("#btnDetalleCompras").click(function () {
    // Recopila datos del primer formulario
    var detalle = {
        idProducto: $("#idproducto").val(),
        detallesExtras: {
            nombre: $("#nombreProducto").val(),
            idmarca: $("#idMarca").val(),
            marca: $("#marca").val(),
            idcolor: $("#idColor").val(),
            color: $("#color").val(),
            idtalla: $("#idTalla").val(),
            talla: $("#talla").val(),
            idmaterial: $("#idMaterial").val(),
            material: $("#material").val(),
            idbodega: $("#idbodega").val(),
            bodega: $("#nombrebodega").val(),
            precioCompra: PrecioCompraGlobal !== undefined ? PrecioCompraGlobal : 0
            // Agrega más campos según sea necesario
        }
    };

    // Verifica si el producto ya está en DatosMostrarDetalle
    if (!existeProductoEnDetalle(detalle.idProducto)) {
        DatosMostrarDetalle.push(detalle);
        var data = detalle;
        agregarFilaATablaDetalle(data);
    }

    // Habilitar el botón
    $("#btnSeleccionarProducto").prop("disabled", false);

    // Limpiar campos específicos en el formulario con id "formDetalle"
    $("#marca, #color, #talla, #material, #nombrebodega").val('');

    // Puedes imprimir los detallesCompra y datosSeleccionados para verificar
    console.log('detallesCompras:', DatosMostrarDetalle);
});



// Función para verificar si un producto ya existe en DatosMostrarDetalle
function existeProductoEnDetalle(idProducto) {
    // Asegúrate de que DatosMostrarDetalle esté disponible aquí
    return DatosMostrarDetalle.some(function (detalle) {
        return detalle.idProducto === idProducto;
    });
}

// Abrir modal Detallecompra
$(document).on("click", ".btnVerdetalle", function (event) {
    event.preventDefault();

    // Obtén el código de la fila seleccionada
    var codigoProducto = $(this).closest('tr').find('td:first').text().trim();
    console.log("Código del producto:", codigoProducto);

    // Encuentra el detalle correspondiente en el array DatosMostrarDetalle
    var detalleProducto = DatosMostrarDetalle.find(detalle => detalle.idProducto.toString() === codigoProducto);
console.log("datos a mostrar:",detalleProducto);
    // Comprueba si se encontró el detalle antes de mostrar el modal
    if (detalleProducto) {
        console.log("Detalle Producto:", detalleProducto);
        console.log("Marca:", detalleProducto.detallesExtras.marca);
        console.log("Color:", detalleProducto.detallesExtras.color);
        console.log("nombreProveedor:", detalleProducto.detallesExtras.nombreProveedor);
        
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
                responsive: true,
                language: {
                    url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
                }
                
                // ... otras opciones ...
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
        // Obtener datos del formulario
        const detallesCompra = [];
        const idEmpleado = $('#idEmpleado').val();
        const idProveedor = $('#idProveedor').val();    
    
        // Recorrer la tabla de detalles y obtener los datos
        $('#Tabladetalle tbody tr').each(function () {
            // Obtener los valores numéricos y formatearlos 
            const codigoProducto = parseFloat($(this).find('.codigoProducto').text()) || 0; 
            const cantidad = parseFloat($(this).find('input[name="cantidad"]').val()) || 0;
            const precioCompra = parseFloat($(this).find('input[name="p.compra"]').val()) || 0;
            const descuento = parseFloat($(this).find('input[name="descuento"]').val()) || 0;
            const subtotal = parseFloat($(this).find('.subtotal').text()) || 0;
            const iva = parseFloat($(this).find('.iva').text()) || 0;
            const total = parseFloat($(this).find('.total').text()) || 0;
    
            console.log('codigoProducto:', codigoProducto);
            // Imprimir detalles de DatosMostrarDetalle
            console.log('Detalles de DatosMostrarDetalle:');
            DatosMostrarDetalle.forEach(detalle => {
                console.log('idProducto:', detalle.idProducto);
                console.log('detallesExtras:', detalle.detallesExtras);
            });
    
            // Obtener detallesExtras desde DatosMostrarDetalle
            const detallesEncontrados = DatosMostrarDetalle.filter(detalle => detalle.idProducto === codigoProducto.toString());
            console.log('Detalles encontrados antes de la verificación:', detallesEncontrados);

            if (detallesEncontrados.length > 0) {
                // Supongamos que solo estás interesado en el primer detalle encontrado
                const detallesExtras = detallesEncontrados[0].detallesExtras;
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
                detallesCompra.push(detalleProducto);
           
                // Resto del código utilizando detallesExtras
            } else {
                // Manejo de caso cuando no se encuentra ningún detalle
                console.error(`No se encontraron detalles para el producto con código ${codigoProducto}`);
            }

                
        });
    
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
            e.preventDefault();

          
        const    nombre = $.trim($('#nombre').val());
        const    descripcion = $("#descripcion").val();
        const     idCategoria = $.trim($('#id_categoria').val());
        const     estado = $("#estado").val();

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
       $('#formDetalle').submit(async function (e) {
        e.preventDefault();
  // Obtener los valores de los campos
  
  const detallesCompra= obtenerDetallesCompra();
  const codigoCompra = $.trim($('#codigoCompra').val());
  const FechaCompra=     $.trim($('#fechaCompra').val());
  const totalsuma = $('#Total').val(); 
  const EstadoCompra = 'Pendiente';
  const compraData = {
    CodigoCompra: codigoCompra,
    FechaCompra: FechaCompra,
    Total:totalsuma,
    EstadoCompra:EstadoCompra,
    DetallesCompra: detallesCompra,
};

  console.log('compraData:',compraData);
  
       try {
           
             
        if (opcion === 'crear') {
            await api.excutePost('compra',compraData);
        } else if (opcion === 'editar') {
            await api.excutePut(`compra/editar/${codigoCompraEditar}`,compraData);
        }
              
                
                
            //redireccionar al contenedor 1
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

// Realizar la creación y completación de la compra
try {
  
    const response =   await api.excutePost('compra/crear-y-completar',compraData);

    if (response.success) {
        console.log('Compra insertada y completada exitosamente.');
    } else {
        console.error('Error al crear y completar la compra:', response.error, response.details);
        // Manejar el error, mostrar un mensaje al usuario, etc.
    }
} catch (error) {
    console.error('Error en la operación:', error);

    // Mostrar detalles de la respuesta del servidor si está disponible
    if (error.response) {
        console.error('Respuesta del servidor:', error.response.data);
    }

    // Mostrar detalles específicos del error de JavaScript
    console.error('Tipo de error:', error.name);
    console.error('Mensaje de error:', error.message);
    console.error('Pila de llamadas:', error.stack);

    // Manejar el error, mostrar un mensaje al usuario, etc.
}

   
}

$(document).on("click", "#btnGuardarCompracompleta", function (event) {
    event.preventDefault();
guardarCompleta();
});

});
