import { EntityClass } from "../EntityClass.js";
const api = new EntityClass();
// Declarar variable global para almacenar los datos del informe de inventario
let InformeInventario;
$(document).ready(async function () {

    let categoriaResponse = await api.excuteGet('categorias');
  
        // Obtén el div por su id
        const miLista = $("#miListaCategoria");
        const miLista2 = $("#miListaProveedor");
        // Itera sobre los categoria y agrega casillas de verificación
        $.each(categoriaResponse, function(index,categoria) {
            miLista.append('<div class="elemento" data-codigo="' + categoria.Codigo + '">' +
                '<div class="contenedorNombre">' +
                    '<span class="nombreCategoria">' + categoria.Nombre + '</span>' +
                '</div>' +
                '<input type="checkbox" class="seleccionarCategoria" id="Categoria_' + categoria.Codigo + '">' +
                '</div>');
        });
        
      
        function obtenerFiltros() {
            // Obtener el estado seleccionado
            var estadoSeleccionado = $("#estadoSelect").val();
        
            // Obtener la fecha de ingreso seleccionada en formato "yyyy-mm-dd"
            // Obtener la fecha de ingreso seleccionada en formato "YYYY-MM-DD" usando Moment.js
            var fechaSeleccionada = moment($("#fechaIngreso").val()).format('YYYY-MM-DD');
        console.log( 'fechaSeleccionada',fechaSeleccionada)
            // Obtener las categorías seleccionadas
            var categoriasSeleccionadas = [];
            $(".seleccionarCategoria:checked").each(function() {
                var nombreCategoria = $(this).closest('.elemento').find('.nombreCategoria').text();
                categoriasSeleccionadas.push(nombreCategoria);
                console.log('categoriasSeleccionadas', categoriasSeleccionadas);
            });
        
            // Devolver un objeto con los filtros seleccionados
            return {
                estadoSeleccionado: estadoSeleccionado !== "" ? estadoSeleccionado : null,
                fechaSeleccionada: fechaSeleccionada !== "Invalid date" ? fechaSeleccionada : null,
                categoriasSeleccionadas: categoriasSeleccionadas.length > 0 ? categoriasSeleccionadas : [],
            };
        }
        
        // Obtener datos de InformeInventario al cargar la página
        InformeInventario = await api.excuteGet('informes/inventario');
console.log('InformeInventario:', InformeInventario);


function filtrarDatos(datosbaseDatos, filtros) {
  
    var datosFiltrados = datosbaseDatos.filter(function(item) {
        return (
            (filtros.estadoSeleccionado === null || filtros.estadoSeleccionado === item.Estado) &&
            (filtros.fechaSeleccionada === null || filtros.fechaSeleccionada ===  moment(item.FechaIngreso).format('YYYY-MM-DD')) &&
            (!filtros.categoriasSeleccionadas || filtros.categoriasSeleccionadas.length === 0 || filtros.categoriasSeleccionadas.includes(item.NombreCategoria))
        );
    });
    console.log('Datos filtrados:', datosFiltrados);
    return datosFiltrados;
}




// Función para actualizar el gráfico con los datos filtrados
function actualizarGrafico(datosFiltrados) {
    // Extraer las cantidades de inventario correspondientes a los datos filtrados
    const cantidadesFiltradas = datosFiltrados.map(item => item.UnidadesExistencias);
    const categoriasFiltradas = datosFiltrados.map(item => item.NombreCategoria);
    // Actualizar el gráfico con los nuevos datos filtrados
    myChart.data.labels = categoriasFiltradas;
    myChart.data.datasets[0].data = cantidadesFiltradas;
    myChart.update();
}

// Evento para manejar los cambios en los filtros y actualizar el gráfico
$("#estadoSelect, #fechaIngreso, .seleccionarCategoria").change(function() {
    // Obtener los filtros seleccionados
    var filtros = obtenerFiltros();

    // Filtrar los datos según los filtros seleccionados
    var datosFiltrados = filtrarDatos(InformeInventario, filtros);
    // Actualizar el gráfico con los datos filtrados
    actualizarGrafico(datosFiltrados);
      // Actualizar el gráfico de pastel con los datos filtrados
      actualizarGraficoPastel(datosFiltrados);
});

    
        
        

// Configurar el contexto del gráfico
const ctx = $('#myChart').get(0).getContext('2d');
const ctx2 = $('#myChartPastel').get(0).getContext('2d');

const colores = ['rgba(255, 99, 132, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 205, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(201, 203, 207, 0.2)'];
const borderColor = ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)'];
const coloresPastel = ['rgba(255, 99, 132, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 205, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(201, 203, 207, 0.2)'];
const borderColorPastel = ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)'];

// Crear el gráfico de barras utilizando Chart.js
if (ctx) {
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Cantidad en Inventario',
                data: [],
                backgroundColor: colores,
                borderColor: borderColor,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            barThickness: 20,
            onClick: function (evt, elementos) {
                if (elementos.length > 0) {
                    const indice = elementos[0].index;
                    const categoriaSeleccionada = myChart.data.labels[indice];
                    actualizarGrafico([categoriaSeleccionada]);
                }
            }
        }
    });

}
// Crear el gráfico circular utilizando Chart.js
function actualizarGraficoPastel(datosFiltrados) {
    // Crear etiquetas con el nombre de la categoría
    const etiquetas = datosFiltrados.map(item => item.NombreCategoria);

    // Crear datos detallados del producto para el conjunto de datos
    const datosDetallados = datosFiltrados.map(item => `${item.NombreMarca} - ${item.NombreProducto} (${item.TallaProducto}, ${item.ColorProducto}, ${item.MaterialProducto})`);

    // Obtener las cantidades de existencias para cada producto
    const cantidades = datosFiltrados.map(item => item.UnidadesExistencias);

    // Actualizar el gráfico de pastel con los nuevos datos filtrados
    myChartpastel.data.labels = etiquetas;
    myChartpastel.data.datasets[0].data = cantidades;
    myChartpastel.data.datasets[0].label = datosDetallados; // Actualizamos la etiqueta del conjunto con los datos detallados
    myChartpastel.update();
}

if (ctx2) {
    var myChartpastel = new Chart(ctx2, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                label: '',
                data: [],
                backgroundColor: coloresPastel,
                borderColor: borderColorPastel,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Datos de Inventario'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = myChartpastel.data.datasets[0].label[context.dataIndex]; // Obtener el dato detallado del conjunto de datos
                            return label;
                        }
                    }
                }
            }
        }
    });
}



$("#mostrarCartBarra").click(function(){
    $("#miBoxBody").toggle(); // Alternar la visibilidad del contenedor
});
});
