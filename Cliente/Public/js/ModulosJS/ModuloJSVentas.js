import { EntityClass } from "../EntityClass.js";
const api = new EntityClass();

$(document).ready(async function () {

    let tablainventario;

    let codigoNotaCredito

  
    const ventasT = await api.excuteGet('ventas');

      // Obtener datos de inventario al cargar la página
      const inventario = await api.excuteGet('inventario');



// DataTable initialization
var TablaCompra = $('#Tabla_Fact').DataTable({
    data: ventasT,
    columns: [
        { data: "Codigo" },
        { data: "CodigoVenta" },
        {
            data: "Fecha",
            "targets": 2,
            "render": function (data, type, row) {
                return moment.utc(data).format('YYYY-MM-DD');
            }
        },
        { data: "Total" },
        {
            data: "Estado",
            render: function (data, type, row) {
                var claseEstado = '';

               if (data === 'Completada') {
                    claseEstado = 'estado-completa';
                }else if (data === 'Devolución') {
                    claseEstado = 'estado-registrada';
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
botones += `<button type='button' class='btn btn-success btnImprimirCompra' title='Imprimir'>
                <i class='fas fa-print'></i>
            </button>`;

// Agregar margen a la derecha del botón de imprimir
botones += `<button type='button' class='btn btn-danger btnDevoluciones' title='Devoluciones' style='margin-left: 10px;'>
                <i class='fas fa-undo'></i>
            </button>`;

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
    order: [[4, 'desc']], // Ordenar por la columna de Estado (columna índice 4) de manera ascendente
    createdRow: function (row, data, dataIndex) {
        // Agregar una clase personalizada a las filas con estado "Pendiente"
        if (data.Estado === 'Devolución') {
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
        var codigoVenta = row.data().CodigoVenta;
console.log('click codigo venta:',codigoVenta);
        // Redirigir al usuario a la descarga directa
        window.location.href = `http://localhost:3000/api/venta/generarfactura/${codigoVenta}`;
    } catch (error) {
        // Manejar errores de la redirección
        console.error('Error al redirigir a la descarga:', error);
    }
});

// Manejar clics en el botón de devoluciones
// Manejar clics en el botón de devoluciones
$('#Tabla_Fact tbody').on('click', '.btnDevoluciones', function () {
    // Obtener el dato de la fila seleccionada (puedes usar la API de DataTables para obtener más detalles si es necesario)
    var data = TablaCompra.row($(this).parents('tr')).data();
    
    // Redirigir a la vista de devolución y pasar el código de la venta seleccionada como parámetro a través de la cadena de consulta
    window.location.href = '/api/venta/devolucion/registrar/page?codigoVenta=' + data.CodigoVenta ;
});



 // Por ejemplo, podrías redirigir a una página de edición con el ID de la compra
    // window.location.href = '/editarCompra?id=' + data.ID_Compra;

    tablainventario = $('#tbl_Inventario').DataTable({
        data: inventario,
        "pageLength": 5,
        "lengthMenu": [5, 10, 20, 100], // Opciones de cantidad de elementos por página
        "order": [[1, "asc"]],
        "autoWidth": true,
        "scrollX": true, // Habilitar scroll horizontal
        columns: [
            { data: "ID_Inventario" },
            { data: "NombreBodega" },
            { data: "Codigo" },
            { data: "Nombre", className: "nombre-completo" },
            { data: "NombreMarca" },
            { data: "NumeroTalla" },
            { data: "Color" },
            { data: "NombreMaterial" ,className: "nombre-completo"},
            { data: "PrecioVenta" },
            {data: "UnidadesExistencias"},
            { data: "Estado" },
            { defaultContent: "<div class='text-center'><div class='btn-group'><button class='btn btn-info btn-sm btnSeleccionarInventario'>Seleccionar</button></div></div>" }
        ],
        columnDefs: [
            {
                targets: [0, 1, 2, 10],
                visible: false,
            },
        ],
        responsive: true,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
        },
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
   // Encontrar el último código de venta
let ultimoCodigoVenta = 0;

if (ventasT.length > 0) {
    // Ordenar las ventas por el código de venta de forma descendente
    const ventasOrdenadas = ventasT.sort((a, b) => {
        const codigoA = parseInt(a.CodigoVenta.split('-')[1]);
        const codigoB = parseInt(b.CodigoVenta.split('-')[1]);
        return codigoB - codigoA;
    });

    // Obtener el código de venta más alto
    ultimoCodigoVenta = parseInt(ventasOrdenadas[0].CodigoVenta.split('-')[1]);
}

// Inicializar el contador con el último código de venta encontrado
let contadorCodigoVenta = ultimoCodigoVenta+1 || 1;




    $("#btnRegistrarCompra").click(function () {
        mostrarVista('vista2');
          // Genera un nuevo código de venta
    const nuevoCodigoVenta = generarCodigoUnico();

    // Asigna el nuevo código al campo de entrada
    $("#codigoVenta").val(nuevoCodigoVenta);
      
     //   $('#Tabladetalle th:nth-child(1), #Tabladetalle th:nth-child(6), #Tabladetalle th:nth-child(7) ').hide();
     //   $('#Tabladetalle td:nth-child(1), #Tabladetalle td:nth-child(6), #Tabladetalle td:nth-child(7)').hide();
        
          // Obtén la fecha actual del sistema
    const fechaActual = obtenerFechaActualSistema();

    // Asigna la fecha actual al campo de entrada de fecha
    $("#fechaventa").val(fechaActual);
       // Incrementa el contador para el próximo código
       contadorCodigoVenta++;
    });
// Función para generar un código de venta único
function generarCodigoUnico() {
    // Puedes personalizar el formato del código según tus necesidades
    return 'Venta-' + contadorCodigoVenta;
}

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




// Asumiendo que el botón está en el documento y es accesible mediante su ID
$("#btnCancelarVenta").click(function () {
    mostrarVista('vista1');
});

//SECCION DE MODALES















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

//SECCION DE DATOS SELECCIONADOS

 // Declarar un array global para almacenar todos los datos seleccionados


















// Evento para seleccionar un material del inventario
var DatosMostrarDetalle = [];

$('#tbl_Inventario tbody').on('click', '.btnSeleccionarInventario', function () {
  
    // Obtener la fila clicada
    var fila = tablainventario.row($(this).closest('tr')).data();

    // Comparar el ID_Inventario de la fila seleccionada con los datos del inventario
    const data = inventario.find(item => item.ID_Inventario === fila.ID_Inventario);
console.log("data:",data);
    if (data) {
     
       
    }


    var detalle = {
        idinventario: data.ID_Inventario,
        idProducto: data.Codigo,
        detallesExtras: {
            nombre:data.Nombre,
            idmarca: data.ID_Marca,
            marca: data.NombreMarca,
            idcolor: data.ID_Colores,
            color: data.Color,
            idtalla: data.ID_Talla,
            talla: data.NumeroTalla,
            idmaterial:data.ID_MaterialZapatos,
            material:data.NombreMaterial,
            precioVenta: data.PrecioVenta,
            U_exisrencia: data.UnidadesExistencias
            // Agrega más campos según sea necesario
        }
    };

    // Verifica si el producto ya está en DatosMostrarDetalle
    if (!existeProductoEnDetalle(detalle)) {
        DatosMostrarDetalle.push(detalle);
        var datas = detalle;
        agregarFilaATablaDetalle(datas);
    }

    
console.log('DatosMostrarDetalle:',DatosMostrarDetalle);
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
      //  var data = detalle;
      //  agregarFilaATablaDetalle(data);
    }

    // Habilitar el botón
    $("#btnSeleccionarProducto").prop("disabled", false);

    // Limpiar campos específicos en el formulario con id "formDetalle"
    $("#marca, #color, #talla, #material, #nombrebodega").val('');

    // Puedes imprimir los detallesCompra y datosSeleccionados para verificar
    console.log('detallesCompras:', DatosMostrarDetalle);
});



// Función para verificar si un producto ya existe en DatosMostrarDetalle
function existeProductoEnDetalle(detalle) {
    return DatosMostrarDetalle.some(existingDetalle => 
        existingDetalle.idProducto === detalle.idProducto &&
        existingDetalle.detallesExtras.nombre === detalle.detallesExtras.nombre &&
        existingDetalle.detallesExtras.idmarca === detalle.detallesExtras.idmarca &&
        existingDetalle.detallesExtras.marca === detalle.detallesExtras.marca &&
        existingDetalle.detallesExtras.idcolor === detalle.detallesExtras.idcolor &&
        existingDetalle.detallesExtras.color === detalle.detallesExtras.color &&
        existingDetalle.detallesExtras.idtalla === detalle.detallesExtras.idtalla &&
        existingDetalle.detallesExtras.talla === detalle.detallesExtras.talla &&
        existingDetalle.detallesExtras.idmaterial === detalle.detallesExtras.idmaterial &&
        existingDetalle.detallesExtras.material === detalle.detallesExtras.material &&
        existingDetalle.detallesExtras.precioVenta === detalle.detallesExtras.precioVenta
        // Agrega más campos según sea necesario
    );
}


// Abrir modal Detallecompra
$(document).on("click", ".btnVerdetalle", function (event) {
    event.preventDefault();

    // Obtén el código de la fila seleccionada
    var row = tableDetalle.row($(this).closest('tr'));

     // Obtén el código de la fila seleccionada desde la columna "Producto"
     var codigoInvetarioD= parseInt($(tableDetalle.cell(row, 0).node()).text());
     console.log("Código del producto:", codigoInvetarioD);


    // Encuentra el detalle correspondiente en el array DatosMostrarDetalle
var detalleProducto = DatosMostrarDetalle.find(detalle => detalle.idinventario   === codigoInvetarioD);
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





// Declarar variables fuera de la función para que persistan su valor
var sumaSubtotal = 0;
var sumaIVA = 0;
var sumaTotal = 0;
    function agregarFilaATablaDetalle(data) {
        if (!$.fn.DataTable.isDataTable('#Tabladetalle')) {
            // Si la tabla no tiene DataTable, inicialízala
            
            tableDetalle = $('#Tabladetalle').DataTable({
            
                responsive: true,
                language: {
                    url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
                },
                columnDefs: [
                    {
                        targets: [0,1,6,7], // Asegúrate de incluir las columnas de Subtotal e Iva aquí
                        visible: false,
                    },
                    
                ],
                
      
            });
          
        }


        var cantidadInput = '<input type="number" class="form-control descuento-input" name="cantidad" value="0">';
        var pVentaInput = '<input type="number" class="form-control" name="p.venta" value="' + data.detallesExtras.precioVenta+ '">';
        var descuentoInput = '<input type="number" class="form-control" name="descuento" value="0">';
        
        var rowNode = tableDetalle.row.add([
            `<span class="codigoInventario">${data.idinventario}</span>`,
            `<span class="codigoProducto">${data.idProducto}</span>`,
            `<span class="nombreProducto nombre-completo">${data.detallesExtras.nombre}</span>`,
            cantidadInput,
            pVentaInput,
            descuentoInput,
            '<span class="subtotald form-control">0</span>',
            '<span class="ivad form-control">0</span>',
            '<span class="totald form-control">0</span>',
            '<div class="text-center"><div class="btn-group"> <button class="btn btn-info btn-sm btnVerdetalle mr-1"><i class="fas fa-eye"></i></button> <button class="btn btn-danger btn-sm btnEliminar"><i class="fas fa-trash-alt"></i></button></div></div>'
        ]).draw().node;
        
// Suma los valores a las variables acumuladas
console.log('Datos en la tabla tableDetalle:', tableDetalle.data().toArray());
     
        $(rowNode).find('.btnEliminar').on('click', function () {
            var row = tableDetalle.row($(this).closest('tr'));

    // Verifica si hay filas antes de intentar eliminar
    if (row && row.index() !== undefined) {
        // Obtiene el código del producto en la fila
// Obtiene el código del producto en la fila
var codigoProductoAEliminar = parseInt($(tableDetalle.cell(row, 0).node()).text()); // Convierte a número

    console.log('codigoProductoAEliminar:',codigoProductoAEliminar);
        // Elimina la fila solo si existe
        row.remove().draw();
    
        // Elimina el detalle correspondiente en DatosMostrarDetalle
        DatosMostrarDetalle = DatosMostrarDetalle.filter(detalle => detalle.idinventario !== codigoProductoAEliminar).slice();
    

        recalcularSumas();
    
        // Puedes imprimir los detallesMostrarDetalle actualizados para verificar
        console.log('DatosMostrarDetalle Eliminacion:', DatosMostrarDetalle);
    }
    
        });
    
        
        
        $(rowNode).find('input[name="cantidad"], input[name="p.venta"], input[name="descuento"]').on('input', function () {
            var cantidad = parseFloat($(this).closest('tr').find('input[name="cantidad"]').val()) || 0;
            var pventa = parseFloat($(this).closest('tr').find('input[name="p.venta"]').val()) || 0;
            var descuento = parseFloat($(this).closest('tr').find('input[name="descuento"]').val()) || 0;
        
            console.log('cantidad - input:', cantidad);
            console.log('pventa - input:', pventa);
            console.log('descuento - input:', descuento);
         // Obtén la cantidad en inventario
    var cantidadEnInventario = data.detallesExtras.U_exisrencia;

    // Verifica si la cantidad ingresada es mayor que la disponible en inventario
    if (cantidad > cantidadEnInventario) {
        // Muestra un mensaje de error
        toastr.error('La cantidad solicitada es mayor que la disponible en inventario. Cantidad en inventario: ' + cantidadEnInventario);
        // Establece la cantidad en el input a la cantidad máxima disponible
        $(this).closest('tr').find('input[name="cantidad"]').val(cantidadEnInventario);
        cantidad = cantidadEnInventario; // Actualiza la variable cantidad
    }


            var subtotal = cantidad * pventa;
            var iva = subtotal * 0.15;
            var total = subtotal - descuento + iva;
              // Aplica las reglas de redondeo
    total = redondearConReglas(total);
            // Actualiza las celdas correspondientes en la tabla
            var rowIndex = tableDetalle.row($(this).closest('tr')).index();
            tableDetalle.cell(rowIndex, 6).data(subtotal);
            tableDetalle.cell(rowIndex, 7).data(iva);
            tableDetalle.cell(rowIndex, 8).data(total);
        
            recalcularSumas();

              // Obtén el monto de la nota de crédito
    var montoNotaCredito = parseFloat($('#valorNotacredito').text().replace('C$', '').trim()) || 0;

    // Verifica si el monto de la nota de crédito es mayor que 0 antes de mostrar mensajes
if (montoNotaCredito > 0) {
    // Compara el total con el monto de la nota de crédito
    if (total === montoNotaCredito) {
        toastr.success('El total es igual al monto de la nota de crédito.');
    } else if (total > montoNotaCredito) {
        toastr.warning('El total es mayor al monto de la nota de crédito.');
    } else {
        toastr.info('El total es menor al monto de la nota de crédito.');
    }
} else {
    // Si el monto de la nota de crédito es 0, no muestra ningún mensaje
    // Puedes agregar una lógica adicional aquí si es necesario
}
        });
        // Función para redondear con reglas específicas
function redondearConReglas(valor) {
    // Obtén el número de decimales en informes estándar
    const numeroDecimales = 0; // Establece el valor adecuado según tu configuración

    // Multiplica por 10^decimales, redondea y divide de nuevo
    const multiplicador = Math.pow(10, numeroDecimales);
    return Math.round(valor * multiplicador) / multiplicador;
} 
         // Imprime los datos de la tabla en la consola
    console.log('Datos en la tabla tableDetalle Creacion:', tableDetalle.data().toArray());
    }
    // Función para recalcular las sumas

// Función para recalcular las sumas
function recalcularSumas() {
    // Recorre todas las filas y suma los valores
    sumaSubtotal = 0;
    sumaIVA = 0;
    sumaTotal = 0;
    
    tableDetalle.rows().every(function () {
        var data = this.data();
        sumaSubtotal += parseFloat(data[6]);
        sumaIVA += parseFloat(data[7]);
        sumaTotal += parseFloat(data[8]);
    });

    // Muestra las sumas en la consola
    console.log('Suma de Subtotal:', sumaSubtotal.toFixed(2));
    console.log('Suma de IVA:', sumaIVA.toFixed(2));
    console.log('Suma de Total:', sumaTotal.toFixed(2));

    // Muestra los resultados en el lugar deseado en tu página
    $('#totalTotal').text(sumaTotal.toFixed(2) + ' C$');
    $('#Subtotal_Calculo').text(sumaSubtotal.toFixed(2) + ' C$');
    $('#Iva_Calculo').text(sumaIVA.toFixed(2) + ' C$');
    $('#totalTotal_Calculo').text(sumaTotal.toFixed(2) + ' C$');
}


  // Agrega un evento de escucha al campo de entrada #Pago
$('#Pago').on('input', function () {
    // Recalcular las sumas cuando cambia el valor del campo de entrada
    monto_recibido();
});

// Función para recalcular las sumas
function  monto_recibido() {
  // Capturar el valor del monto recibido
  var montoRecibido = parseFloat($('#Pago').val()) || 0;

  // Calcular la cantidad a devolver y la cantidad que falta
  var cambio = montoRecibido - sumaTotal;
  var falta = sumaTotal - montoRecibido;

  // Mostrar el cambio y la cantidad que falta en las etiquetas
  $('#changeAmount').text(cambio >= 0 ? cambio.toFixed(2) + ' C$' : '$0.00');
  $('#Falta').text(falta >= 0 ? falta.toFixed(2) + ' C$' : '$0.00');
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

function obtenerDetallesVenta() {
    const detallesVenta = [];
    const idEmpleado = $('#idEmpleado').val();
// Obtener la fecha del elemento con id 'fechaventa'
const fechaInput = $.trim($('#fechaventa').val());

// Formatear la fecha en el formato deseado usando moment
const fechaFormateada = moment(fechaInput).format('YYYY-MM-DD');


    $('#Tabladetalle tbody tr').each(function () {
        const fila = tableDetalle.row($(this)).data(); // Obtener los datos de la fila como un array
        const codigoInventario =  $(fila[0]).text(); // Obtener el valor de la primera columna (índice 0)
        console.log('codigoInventario:', codigoInventario);
        const cantidad = parseFloat($(this).find('input[name="cantidad"]').val()) || 0;0
        const precioventa = parseFloat($(this).find('input[name="p.venta"]').val()) || 0;
        const descuento = parseFloat($(this).find('input[name="descuento"]').val()) || 0;
        console.log('Cantidad:', cantidad);
        console.log('precioventa:', precioventa);
        console.log('descuento:', descuento);
        
        var subtotal = fila[6];
        var iva = fila[7];
        var total = fila[8];
     /*   if (isNaN(cantidad) || isNaN(precioventa)) {
            detallesValidos = false;
            // Puedes agregar un mensaje de error o hacer algo en caso de que haya campos vacíos o no válidos.
            toastr.error('Error: Uno o más campos están vacíos o no son válidos en la fila. ' );
  
            return false; // Detener el bucle si hay detalles no válidos
        }*/
        // Acceder al código de inventario incluso si está oculto

        const detalles = {

            ID_Inventario:codigoInventario,
            ID_Empleado:idEmpleado,
            PrecioVenta:precioventa,
            Cantidad:cantidad,
            Descuento:descuento,
            Total:total,
            Subtotal:subtotal,
            IVA:iva,
            Fecha:fechaFormateada
        }

detallesVenta.push(detalles);



    });
    console.log('detallesVenta1:', detallesVenta);
    return detallesVenta;


}



    

$('#Nota_credito').change(function() {
    const codigoNotaCredito = $(this).val(); // Obtener el valor del campo de entrada

    // Llamar a la función que realiza la solicitud a la API
    obtenerDatosNotaCredito(codigoNotaCredito);
});

async function obtenerDatosNotaCredito(codigoNotaCredito) {
    try {
        if (!codigoNotaCredito) {
            // Si el código de nota de crédito no tiene valor, establecer el contenido en 'C$ 0'
            $('#valorNotacredito').text('C$ 0');
            return;  // Salir de la función ya que no hay código de nota de crédito para consultar
        }

        const resultado = await api.excuteGet(`venta/Notacredito/${codigoNotaCredito}`);

        // Verificar si se encontró una nota de crédito
        if (resultado.length > 0) {
            const notaCredito = resultado[0];
            // Actualizar el contenido de la etiqueta div con el id 'valorNotacredito'
            $('#valorNotacredito').text(`C$ ${notaCredito.Monto}`);
        } else {
            alert('No se encontró ninguna nota de crédito con ese código.');
        }
    } catch (error) {
        console.error(`Error al obtener datos de la nota de crédito: ${error.message}`);
    }
}




async function guardarCompleta() {
    try {
     // Configuración de Toastr
  toastr.options = {
    closeButton: true,
    timeOut: 2500, // Duración total de visualización en milisegundos (ejemplo: 2 segundos)
    hideDuration: 300 ,// Duración de la animación de ocultar en milisegundos (ejemplo: 0.3 segundos)
    progressBar: true, 
    closeEasing :'swing',
    preventDuplicates: true
  };
    // Obtener los detalles de la venta
    const detallesVentaFinal = obtenerDetallesVenta();
    if (detallesVentaFinal === null) {
        // Detalles no válidos, mostrar mensaje al usuario o tomar otra acción adecuada.
        toastr.warning('Uno o más campos están vacíos o no son válidos.');
        return;
    }
    // Obtener otros valores necesarios
    const codigoVenta = $.trim($('#codigoVenta').val());
    if (codigoVenta === '') {
        // Mostrar una alerta si el campo está vacío
    
        toastr.warning('Por favor, ingresa un código de venta.');
          
        return;
    }
    const Nota_creditos = $.trim($('#Nota_credito').val());
    const CodigoNotaCredito =  Nota_creditos ? Nota_creditos : 0;
    const fechaInput = $.trim($('#fechaventa').val());
    if (!fechaInput) {
        toastr.warning('Por favor, ingresa una fecha de venta.');
        return;
    }
    const fechaFormateada = moment(fechaInput).format('YYYY-MM-DD');
    const Subtotalsuma = parseFloat($("#Subtotal_Calculo").text());
    const Ivasuma = parseFloat($("#Iva_Calculo").text());
    const totalsuma = parseFloat($("#totalTotal_Calculo").text());
    const EstadoV = 'Completada';
   

    // Realizar la validación del código de venta

    const ventasT = await api.excuteGet('ventas');
    if (ventasT.some(venta => venta.CodigoVenta === codigoVenta)) {
  // Muestra un toast de error si el código de venta ya existe
  toastr.error('El código de venta ya existe. Realiza una acción adecuada.');        // Puedes mostrar un mensaje al usuario, bloquear el proceso, etc.
        return;
    }

    // Crear el objeto compraData
    const VentaData = {
        CodigoVenta: codigoVenta,
        FechaVenta: fechaFormateada,
        EstadoVenta: EstadoV,
        Subtotal: Subtotalsuma,
        IVA: Ivasuma,
        Total: totalsuma,
        DetallesVenta: detallesVentaFinal,
        CodigoNotaCredito: CodigoNotaCredito
    };
    
    // Antes de la llamada a api.excutePost
    console.log('Datos que se enviarán al servidor:', VentaData);
     



  
        await api.excutePost('venta', VentaData);
     // Mostrar una alerta si la venta se completa con éxito con duración de 2 segundos
     toastr.success('Venta completada con éxito.');
    } catch (error) {
 // Mostrar una alerta si hay un error durante la venta con duración de 2 segundos
 toastr.error('Error completo: ' + error.message);
    }
}
  





    $(document).on("click", "#btnRealizarVenta",  function (event) {
        // Evitar que el formulario se envíe por defecto
        event.preventDefault();
        guardarCompleta();
      
    });

});
