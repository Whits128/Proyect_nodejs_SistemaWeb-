import { EntityClass } from "../EntityClass.js";
const api = new EntityClass();

$(document).ready(async function () {

    let tabla,Tablacompra,tablemarca,tablecolor,tabletalla,tablematerial ;
let tablaproveedor,tablaBodega,tablaEmpleado;
const priducto = await api.excuteGet('productos');
    const Proveedor = await api.excuteGet('Proveedor');
    const empleado = await api.excuteGet('empleado');
    const compra = await api.excuteGet('compra');
    const Marcas = await api.excuteGet('marcas');
    const colores = await api.excuteGet('color');
    const tallas = await api.excuteGet('talla');
    const MaterialZapato = await api.excuteGet('materialesZapatos');
   // Obtener datos de bodega al cargar la página
   const bodega = await api.excuteGet('bodega');
    console.log('priducto', priducto);
    console.log('Proveedor', Proveedor);

// DataTable initialization
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
                var botones = '';

                if (data === 'Pendiente') {
                    claseEstado = 'estado-registrada';
                    botones = `<i class='fas fa-edit btnEditarCompra' title='Editar'></i>
                               <i class='fas fa-check btnCompletarCompra' title='Completar'></i>`;
                } else if (data === 'Completada') {
                    claseEstado = 'estado-completa';
                }

                return `<div class='${claseEstado}'>
                            ${botones}
                            ${data}
                        </div>`;
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
    order: [[4, 'asc']], // Ordenar por la columna de EstadoCompra (columna índice 4) de manera ascendente
    createdRow: function (row, data, dataIndex) {
        // Agregar una clase personalizada a las filas con estado "Pendiente"
        if (data.EstadoCompra === 'Pendiente') {
            $(row).addClass('estado-pendiente');
        }
    }
});


async function recargarTabla() {
    try {
        // Asegúrate de que TablaCompra esté definida
        if (!TablaCompra) {
            console.error('Error: TablaCompra no está definida.');
            return;
        }

        // Obtener datos de la compra
        const compra = await api.excuteGet('compra');

        // Limpiar la tabla y agregar los nuevos datos
        TablaCompra.clear().rows.add(compra).draw();
    } catch (error) {
        console.error('Error al recargar la tabla:', error.message);
    }
}

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
            recargarTabla();
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

// ...

// Evento para abrir el formulario de edición al hacer clic en "Editar"
$('#Tabla_Fact').on('click', '.btnEditarCompra', async function () {
    // Obtener la fila actual
    var data = Tablacompra.row($(this).closest('tr')).data();

    // Obtener el CodigoCompra de la fila seleccionada
    var codigoCompra = data.CodigoCompra;

    // Realizar una solicitud al backend para obtener los detalles de la compra por el CodigoCompra
    try {
        const detallesCompra = await api.excuteGet(`compra/detallecompra/${codigoCompra}`);
        mostrarVista('vista2');
        // Rellenar los campos de edición con los detalles obtenidos
        llenarCamposEdicion(detallesCompra);

        // Mostrar el formulario de edición
        // Puedes abrir un modal o mostrar un formulario, dependiendo de tu implementación
        // ...

    } catch (error) {
        console.error('Error al obtener detalles de compra para editar', error.message);
    }
});

// ...

// Función para llenar los campos de edición con los detalles de la compra
function llenarCamposEdicion(detallesCompra) {
    // Supongamos que aquí "detallesCompra" es un objeto que contiene los detalles de la compra obtenidos del backend

    // Ejemplo de cómo puedes llenar los campos de edición
    $('#codigoCompra').val(detallesCompra.CodigoCompra);
  
    // ... Llenar otros campos según sea necesario
}



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
        "scrollX": true, // Habilita el scroll horizontal
        "scrollCollapse": true, // Colapso de scroll si no es necesario
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
     tablaproveedor = $('#tbl_Proveedor').DataTable({
        data: Proveedor,
        scrollX: true,
        scrollCollapse: true,
        columns: [
                 { data: "Codigo" },
                    { data: "Nombre" },
                    { data: "Direccion"},
                    { data: "Telefono" },
                    { data: "Ruc" },
                    { data: "EmailProveedor" },
                    { data: "Estado" },
            { defaultContent: "<div class='text-center'><div class='btn-group'><button class='btn btn-info btn-sm btnSeleccionarProveedor'>Seleccionar</button></div></div>" }
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


///DataTable Empleado
     // DataTable initialization
     tablaEmpleado = $('#tbl_Empleado').DataTable({
        data: empleado,
        columns: [
            { data: "Codigo" },
            { data: "Nombre" },
            { data: "Apellido" },
            { data: "Direccion" },
            { data: "Telefono" },
            { data: "Estado" },
            { defaultContent: "<div class='text-center'><div class='btn-group'><button class='btn btn-info btn-sm btnSeleccionarEmpleado'>Seleccionar</button></div></div>"}
        ],
        responsive: true,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
        }
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
        
    });
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

    var tableDetalle;
    var sumaSubtotal = 0;
    var sumaTotal = 0;
    var sumaIva = 0;
    $('#tbl_productos tbody').on('click', '.btnSeleccionar', function () {
        var data = tabla.row($(this).closest('tr')).data();
        agregarFilaATablaDetalle(data);
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
    
    
        var cantidadInput = '<input type="number" class="form-control" name="cantidad" value="0">';
        var pCompraInput = '<input type="number" class="form-control" name="p.compra" value="0">';
        var descuentoInput = '<input type="number" class="form-control" name="descuento" value="0">';
    
        var rowNode = tableDetalle.row.add([
            data.Codigo,
            data.Nombre,
            cantidadInput,
            pCompraInput,
            descuentoInput,
            '<span class="subtotal black-text">0</span>',
            '<span class="iva black-text">0</span>',
            '<span class="total black-text">0</span>',
            '<button class="btn btn-danger btn-sm btnEliminar">Eliminar</button>',
        ]).draw().node;
    
        $(rowNode).find('.btnEliminar').on('click', function () {
            var row = tableDetalle.row($(this).closest('tr'));

    // Verifica si hay filas antes de intentar eliminar
    if (row && row.index() !== undefined) {
        // Elimina la fila solo si existe
        row.remove().draw();
          // Actualiza los campos de entrada
          
 // Suma los valores a las variables acumuladas
 sumaSubtotal = calcularSumaColumna('.subtotal');
 sumaTotal = calcularSumaColumna('.total');
 sumaIva = calcularSumaColumna('.iva');
  actualizarCamposEntrada();
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


    let codigoProducto;
    function obtenerDetallesCompra() {
        const detallesCompra = [];
    
        // Obtener datos del formulario
 // Obtener datos del formulario
const idbodega = $('#idbodega').val();
const idEmpleado = $('#idEmpleado').val();
const Proveedor = $('#idProveedor').val();
// Verificar que los campos obligatorios estén completos
if (!idbodega || !idEmpleado) {
    console.error('Por favor, complete todos los campos obligatorios.');
    return;  // Detener el proceso si faltan campos obligatorios
}


        // Recorrer la tabla de detalles y obtener los datos
        $('#Tabladetalle tbody tr').each(function () {
          // Obtener los valores numéricos y formatearlos
 codigoProducto = parseFloat($(this).find('td:eq(0)').text()) || 0;
const cantidad = parseFloat($(this).find('input[name="cantidad"]').val()) || 0;
const precioCompra = parseFloat($(this).find('input[name="p.compra"]').val()) || 0;
const descuento = parseFloat($(this).find('input[name="descuento"]').val()) || 0;
const subtotal = parseFloat($(this).find('.subtotal').text()) || 0;
const iva = parseFloat($(this).find('.iva').text()) || 0;
const total = parseFloat($(this).find('.total').text()) || 0;

            // Crear un objeto con los detalles del producto
            const detalleProducto = {
                ID_Proveedor: parseFloat(Proveedor), 
                ID_BODEGA: parseFloat(idbodega),            // Convertir a número
                ID_Empleado: parseFloat(idEmpleado),         // Convertir a número
                Cantidad: cantidad,
                PrecioCompra: precioCompra,
                Descuento: descuento,
                Subtotal: subtotal,
                IVA: iva,
                Total: total,
            };
    
            detallesCompra.push(detalleProducto);
        });
    console.log('detallesCompra',detallesCompra);
        return detallesCompra;
    }
    
    // Resto de tu código...
    

   

       // Submit para CREAR y EDITAR
       $('#formDetalle').submit(async function (e) {
        e.preventDefault();
  // Obtener los valores de los campos
  
  const detallesCompra= obtenerDetallesCompra();
  const codigoCompra = $.trim($('#codigoCompra').val());
  const FechaCompra=     $.trim($('#fechaCompra').val());
  const totalsuma = $('#Total').val(); 
  const EstadoCompra = 'Pendiente';
  const Idproducto = codigoProducto  // Convertir a número
  const marca = $.trim($('#idMarca').val());
  const talla=     $.trim($('#idTalla').val());
  const color = $.trim($('#idColor').val());
  const material=     $.trim($('#idMaterial').val());
  const idbodega = $('#idbodega').val();
  const compraData = {
    CodigoCompra: codigoCompra,
    FechaCompra: FechaCompra,
    ID_BODEGA:idbodega,
    ID_ProductoZapatos:Idproducto,
    ID_Marca:marca,
    ID_Talla:talla, 
    ID_Colores:color,
    ID_MaterialZapatos:material,
    Total:totalsuma,
    EstadoCompra:EstadoCompra,
    DetallesCompra: detallesCompra,
};

  console.log('compraData:',compraData);
  
        try {
           
                await api.excutePost('compra',compraData);
            // Actualizar la tabla con las nuevas categorías
            mostrarVista('vista2');
            const compra = await api.excuteGet('compra');
            Tablacompra.clear().rows.add(compra).draw();

         
        } catch (error) {
            console.error('Error al guardar/editar:', error.message);
        }
    });


});
