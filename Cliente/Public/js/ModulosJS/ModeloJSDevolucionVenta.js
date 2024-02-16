import { EntityClass } from "../EntityClass.js";
const api = new EntityClass();
$(document).ready(async function () {
    // Inicializa DataTable con los detalles de la devolución
    var TablaDetalleDevolucion,TablaDevolucion;
    const devolucion = await api.excuteGet('devolucion');


    console.log('dev:',devolucion);

    TablaDevolucion = $('#Tabla_Dev').DataTable({
      data: devolucion,
      "pageLength": 5,
      "lengthMenu": [5, 10, 20, 100], // Opciones de cantidad de elementos por página
      "order": [[1, "asc"]],
      "autoWidth": true,
      
      columns: [
          { data: "ID_Devolucion" },
          { data: "CodigoVenta" },
          { data: "NombreProducto" },
          { data: "NombreEmpleado"  },
          { data: "CantidadDevuelta" },
          { 
            data: "Motivo",className: "nombre-completo",
            render: function (data, type, row) {
                if (data.length > 15) {
                    return `${data.substr(0, 9)} <i class="fas fa-eye ver-mas-icon" title="${data}"></i>`;
                } else {
                    return data;
                }
            }
        },
        { 
          data: "CodigoNotaCredito",
          render: function (data, type, row) {
              if (data.length > 10) {
                  return `${data.substr(0, 5)} <i class="fas fa-eye ver-mas-icon" title="${data}"></i>`;
              } else {
                  return data;
              }
          }
      },
          {  data: "Fecha",className: "nombre-completo",
          "targets": 7,
          "render": function (data, type, row) {
              return moment.utc(data).format('YYYY-MM-DD');
          }},
          { data: "EstadoDevolucion" },
            ],
      columnDefs: [
          {
              targets: [0,3,7],
              visible: false,
          },
      ],
      responsive: true,
      language: {
          url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
      },
  });
  

  // Evento de clic para el ícono de ojo
// Evento de clic para el ícono de ojo
$('#Tabla_Dev tbody').on('click', '.ver-mas-icon', function () {
  var data = TablaDevolucion.row($(this).closest('tr')).data();

  // Mostrar el tooltip con el contenido completo
  $(this).attr('data-original-title', data.Motivo);
  $(this).tooltip('show');

  // Copiar la nota de crédito al portapapeles
  copyToClipboard(data.CodigoNotaCredito);

  // Puedes mostrar una notificación o realizar otras acciones aquí
  toastr.success('Nota de Crédito copiada al portapapeles.');
});

// Función para copiar al portapapeles
function copyToClipboard(text) {
  var dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}




    TablaDetalleDevolucion = $('#TablaDetalleDevolucion').DataTable({
            
        responsive: true,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
        },
        columnDefs: [
            {
                targets: [0], // Asegúrate de incluir las columnas de Subtotal e Iva aquí
                visible: false,
            },
            
        ],
        

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

       // Obtén la fecha actual del sistema
       const fechaActual = obtenerFechaActualSistema();

       // Asigna la fecha actual al campo de entrada de fecha
       $("#fechaventa").val(fechaActual);




          // Manejar clics en el botón de eliminar fila
          $('.btnEliminarFila').on('click', function () {
            // Obtener el ID_Inventario de la fila
            var idInventario = $(this).data('id');

            // Eliminar la fila correspondiente
            $(this).closest('tr').remove();

            // Aquí puedes realizar cualquier otra lógica necesaria, como enviar el ID_Inventario al servidor para eliminación en la base de datos.
        });
   
        function obtenerDetallesDevolucion() {
          const detallesDevoluciones = [];
        
          $('#TablaDetalleDevolucion tbody tr').each(function () {
            const fila = TablaDetalleDevolucion.row($(this)).data(); // Obtener los datos de la fila como un array
        
            const cantidadDevuelta = $(this).find('input[name="cantidad[]"]').val();
            let motivo = $(this).find('input[name="motivo[]"]').val(); // Asegúrate de obtener el valor del motivo
        
            // Verificar si la cantidadDevuelta es mayor que 0 y hay un motivo
            if (cantidadDevuelta && parseInt(cantidadDevuelta) > 0 && motivo) {
              // Convertir el motivo a cadena si no lo es
              if (typeof motivo !== 'string') {
                motivo = motivo.toString();
              }
        
              const item = {
                ID_Inventario: fila[0], // Ajusta según la posición de ID_Inventario en tu fila de DataTable
                CantidadDevuelta: parseInt(cantidadDevuelta),
                Motivo: motivo
                // Agrega otros campos según sea necesario
              };
        
              detallesDevoluciones.push(item);
            }
          });
        
          console.log('detallesdevolucion:', detallesDevoluciones);
          return detallesDevoluciones;
        }
        
       
      
      


 // Agrega un evento de clic al botón "Efectuar Devolución"
 $('#btnEfectuarDevolucion').click(async function () {

    toastr.options = {
        closeButton: true,
        timeOut: 2500, // Duración total de visualización en milisegundos (ejemplo: 2 segundos)
        hideDuration: 300 ,// Duración de la animación de ocultar en milisegundos (ejemplo: 0.3 segundos)
        progressBar: true, 
        closeEasing :'swing',
        preventDuplicates: true
      };
    // Obtén los valores necesarios del formulario
    const codigoVenta = $('#idCodigoVenta').val();
    const fechaVenta = $('#fechaventa').val();
    const fechaFormateada = moment(fechaVenta).format('YYYY-MM-DD');
    const idEmpleado = $('#idEmpleado').val();
const detalleDv = obtenerDetallesDevolucion();


// Validar que no haya valores vacíos en detalleDv
if (!detalleDv || detalleDv.length === 0) {
  // Mostrar mensaje de error si no hay detalles de devolución
  toastr.error('Por favor, añade al menos un detalle de devolución antes de continuar.');
  return;
}

    // Realiza cualquier otra operación necesaria con los datos obtenidos
    const DataFinal = {
        CodigoVenta: codigoVenta,
        DetalleDevolucion: detalleDv,
        ID_Empleado: idEmpleado,
        Fecha: fechaFormateada,
       
    };
  
console.log("data final:",DataFinal);

try {
    await api.excutePost('devolucion/venta', DataFinal);
    // Mostrar una notificación de éxito
 
 // Mostrar una alerta si la venta se completa con éxito con duración de 2 segundos
 toastr.success('Devolucion  completada con éxito.');

    // Esperar 2 segundos antes de redirigir a '/api/venta/devolucion/page'
    setTimeout(function () {
      window.location.href = '/api/venta/devolucion/page';
  }, 2000);

} catch (error) {
// Mostrar una alerta si hay un error durante la venta con duración de 2 segundos
toastr.error('Error completo: ' + error.message);
}
  });




});
