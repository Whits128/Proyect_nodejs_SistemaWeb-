// Declaración de variables
let opcion, id, codigo,idBodega, idProducto, idMarca, idTalla, idColores, idMaterial, unidadesExistencias, fechaIngreso,precioCompra,descuento,precioVenta,existenciasMinimas,estado, fila;

import { EntityClass } from "../EntityClass.js";
import { serverUrl } from "../ServerURL.js"
const Url = serverUrl;
import CreateDropDown from "../DropDownComponent.js"
const api = new EntityClass();

$(document).ready(async function () {


    try {
             //DropDownComponent Bodega
const BodegasResponse = await api.excuteGet('bodega');
const BodegasData = BodegasResponse;
const selectBodega = document.getElementById('idBodega');
CreateDropDown(BodegasData, selectBodega,  'Nombre','Codigo');
              //DropDownComponent Producto
const ProductoResponse = await api.excuteGet('productos');
const ProductoData = ProductoResponse;
const selectProducto = document.getElementById('idProducto');
CreateDropDown(ProductoData, selectProducto,  'Nombre','Codigo');
             //DropDownComponent Marca
const MarcaResponse = await api.excuteGet('marcas');
const MarcaData = MarcaResponse;
const selectMarca = document.getElementById('idMarca');
CreateDropDown(MarcaData, selectMarca,  'Nombre','Codigo');
                          //DropDownComponent Tallas
const TallasResponse = await api.excuteGet('talla');
const TallasData = TallasResponse;
const selectTallas = document.getElementById('idTalla');
CreateDropDown(TallasData, selectTallas,  'NumeroTalla','Codigo');
                         //DropDownComponent Colores
const ColoresResponse = await api.excuteGet('color');
const ColoresData = ColoresResponse;
const selectColores = document.getElementById('idColores');
CreateDropDown(ColoresData, selectColores,  'Color','Codigo');
                         //DropDownComponent Material
const MaterialResponse = await api.excuteGet('materialesZapatos');
const MaterialData = MaterialResponse;
const selectMaterial = document.getElementById('idMaterial');
CreateDropDown(MaterialData, selectMaterial,  'Nombre','Codigo');
        // Obtener datos de inventario al cargar la página
        const inventario = await api.excuteGet('inventario');
console.log('inventario',inventario);
        // DataTable initialization

  let tabla = $('#Tabla').DataTable({
                "ajax":{
                    "url": Url + 'inventario',
                    "dataSrc":""
                },      
                "scrollX": true, // Habilita el scroll horizontal
                "scrollCollapse": true, // Colapso de scroll si no es necesario
                                 
                "columns": [
                    { "data": "ID_Inventario" },
                    {"data": "NombreBodega"},
                        {"data": "NombreProducto"},
                        {"data": "NombreMarca"},
                        {"data": "NumeroTalla" },
                        {"data": "Color"},
                        {"data": "NombreMaterial"},
                         {"data":"Estado"},
                    { "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-info btn-sm btnEditar'>Editar</button><button class='btn btn-danger btn-sm btnBorrar'>Borrar</button></div></div>" }
                // Ocultar columnas
    
                ],
                responsive: true,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
        },
            });
        
      
        // CREAR
        $("#btnCrear").click(function () {
            opcion = 'crear';
            id = null;
            $("#form").trigger("reset");
            $(".modal-header").css("background-color", "#23272b");
            $(".modal-header").css("color", "white");
            $(".modal-title").text("Crear Materiales Zapatos");
            $('#modalCRUD').modal('show');
            console.log('Después de abrir el modal para crear');
        });

        // EDITAR
        $(document).on("click", ".btnEditar", function () {
            opcion = 'editar';
            fila = $(this).closest("tr");
            codigo = parseInt(fila.find('td:eq(0)').text());
           
            idBodega = fila.find('td:eq(1)').text();
            idProducto =fila.find('td:eq(2)').text();
            idMarca =fila.find('td:eq(3)').text();
            idTalla =fila.find('td:eq(4)').text();
            idColores = fila.find('td:eq(5)').text();
            idMaterial =fila.find('td:eq(6)').text();
            estado = fila.find('td:eq(7)').text();
           
            $("#id").val(codigo);
            console.log('codigo editar :',codigo);
            $("#idBodega option:contains('" + idBodega + "')").prop("selected", true);
            $("#idProducto option:contains('" + idProducto + "')").prop("selected", true);
            $("#idMarca option:contains('" + idMarca + "')").prop("selected", true);
            $("#idTalla option:contains('" + idTalla + "')").prop("selected", true);
            $("#idColores option:contains('" + idColores + "')").prop("selected", true);
            $("#idMaterial option:contains('" + idMaterial + "')").prop("selected", true);
            $('#estado').val(estado);
            $(".modal-header").css("background-color", "#7303c0");
            $(".modal-header").css("color", "white");
            $(".modal-title").text("Editar Materiales Zapatos");
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
    console.log(codigo);
    idBodega= $("#idBodega option:selected").val();
    idProducto= $("#idProducto option:selected").val();
    idMarca= $("#idMarca option:selected").val();
    idTalla= $("#idTalla option:selected").val();
    idColores= $("#idColores option:selected").val();
    idMaterial= $("#idMaterial option:selected").val();
    estado= $.trim($('#estado').val());

     function recargarTabla() {
        console.log('Tabla:', tabla);

 tabla.ajax.reload(null, false);
    }
    
         
 
    if(opcion=='crear'){                
        $.ajax({
            url: Url + 'inventario',
            method: 'post',
            contentType: 'application/json',
            data: JSON.stringify({
                idBodega: idBodega,
                idProducto: idProducto,
                idMarca: idMarca,
                idTalla: idTalla,
                idColores: idColores,
                idMaterial: idMaterial,
                estado: estado
            }),
        
            error: function (xhr, status, error) {
                console.error('Error en la solicitud AJAX:', status, error);
                // Agrega manejo de errores, por ejemplo, mostrando un mensaje al usuario
            }
            
        });	
    }
    if(opcion=='editar'){
        console.log("EDITAR");
        $.ajax({                    
            url: Url +'inventario/'+codigo,
            method: 'put',                                        
            contentType: 'application/json',  
            data:  JSON.stringify({idBodega:idBodega,idProducto:idProducto,idMarca:idMarca
                ,idTalla:idTalla,idColores:idColores,idMaterial:idMaterial,estado}),                       
          
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
