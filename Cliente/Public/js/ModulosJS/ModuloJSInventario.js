// Declaración de variables
let opcion, id, codigo,idBodega, idProducto, idMarca, idTalla, idColores, idMaterial, unidadesExistencias, fechaIngreso,precioCompra,descuento,precioVenta,existenciasMinimas,estado, fila;

import { EntityClass } from "../EntityClass.js";
import { serverUrl } from "../ServerURL.js"
const Url = serverUrl;
import CreateDropDown from "../DropDownComponent.js"
const api = new EntityClass();

$(document).ready(async function () {


    try {
           
        // Obtener datos de inventario al cargar la página
        const inventario = await api.excuteGet('inventario');
    //obtener las acciones para validarla en los botones necesarios 

    var allowedActions = $("#Tabla").data("allowed-actions");
        // DataTable initialization

  let tabla = $('#Tabla').DataTable({
                "ajax":{
                    "url": Url + 'inventario',
                    "dataSrc":""
                },      
                "scrollX": true, // Habilita el scroll horizontal
                "scrollCollapse": true, // Colapso de scroll si no es necesario
                "pageLength": 5,
                "lengthMenu": [5, 10, 20, 100], // Opciones de cantidad de elementos por página
                "autoWidth": true,            
                "columns": [
                    { "data": "ID_Inventario" },
                    {"data": "NombreBodega"},
                        {"data": "NombreProductoZapatos"},
                        {"data": "NombreMarca"},
                        {"data": "NumeroTalla" },
                        {"data": "Color"},
                        {"data": "NombreMaterialZapatos"},
                        {"data": "UnidadesExistencias"},
                        {"data": "PrecioCompra"},
                        {"data": "PrecioVenta"},
                        {"data": "ExistenciasMinimas"},
                         {"data":"Estado"},
                         {
                            "render": function (data, type, row) {
                                // Verificar si la acción de editar está permitida
                                const editarPermitido = allowedActions.some(accion => accion.Accion === 'Editar');
                                
                                // Crear el HTML para el botón de editar si está permitido
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
                                
                                // Cerrar las etiquetas HTML
                                opcionesHTML += `
                                        </div>
                                    </div>
                                </div>`;
                        
                                // Retornar el HTML generado para el botón de opciones (en este caso, solo el botón de editar)
                                return opcionesHTML;
                            }
                        }
                // Ocultar columnas
    
                ],columnDefs: [
                    {
                        targets: [0, 11],
                        visible: false,
                    },
                ],
                responsive: true,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
        },
            });
        
    
        // EDITAR
        $(document).on("click", ".btnEditar", function () {
            opcion = 'editar';
            fila = $(this).closest("tr");
            var data = tabla.row(fila).data(); // Obtener los datos asociados a la fila
  
            codigo = data.ID_Inventario;
            console.log( 'editar c',codigo)
            existenciasMinimas = data.ExistenciasMinimas;
            precioVenta = data.PrecioVenta;
           
            $("#id").val(codigo);
            $('#PrecioVenta').val(existenciasMinimas);
            $('#ExistenciasMinimas').val(precioVenta);
            $(".modal-header").css("background-color", "#7303c0");
            $(".modal-header").css("color", "white");
            $(".modal-title").text("Editar Inventario");
            $('#modalCRUD').modal('show');
        });

        $('#modalCRUD').on('hidden.bs.modal', function () {
            console.log('Modal oculto');
        });
        

// Submit para CREAR y EDITAR
 //submit para el CREAR y EDITAR
 $('#form').submit(function(e){       
                                                 
    e.preventDefault();
    codigo = $.trim($('#id').val());
    console.log('codigo',codigo)
    precioVenta= $.trim($('#PrecioVenta').val());
    console.log('precioVenta',precioVenta)
    existenciasMinimas= $.trim($('#ExistenciasMinimas').val());
    console.log('existenciasMinimas',existenciasMinimas)
     function recargarTabla() {
        console.log('Tabla:', tabla);

 tabla.ajax.reload(null, false);
    }
    
    if(opcion=='editar'){
        console.log("EDITAR");
        $.ajax({                    
            url: Url +'inventario/'+codigo,
            method: 'put',                                        
            contentType: 'application/json',  
            data:  JSON.stringify({precioVenta:precioVenta,existenciasMinimas:existenciasMinimas}),                       
          
            error: function(error) {
                console.error('Error en la solicitud AJAX:', error);
                // Agrega manejo de errores, por ejemplo, mostrando un mensaje al usuario
            }
        });	
     }        		        
    $('#modalCRUD').modal('hide');			
    recargarTabla();	  				     			
});



    } catch (error) {
        console.error('Error general:', error.message);
    }
});
