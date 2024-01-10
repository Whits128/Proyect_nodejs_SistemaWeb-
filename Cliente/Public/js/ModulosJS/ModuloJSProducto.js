// Declaración de variables
let opcion, id, codigo,nombre, descripcion, idCategoria, estado, fila;

import { EntityClass } from "../EntityClass.js";
import CreateDropDown from "../DropDownComponent.js"

const api = new EntityClass();
 
$(document).ready(async function () {
    let tabla;

    try {
        const categoriasResponse = await api.excuteGet('categorias');
        const categoriasData = categoriasResponse;
        const selectrol = document.getElementById('id_categoria');
        CreateDropDown(categoriasData, selectrol,  'Nombre','Codigo');
    

        // Obtener datos de categorías al cargar la página
        const priducto = await api.excuteGet('productos');

            // MOSTRAR
     tabla = $('#Tabla').DataTable({
        data: priducto,
        "scrollX": true,
        "scrollCollapse": true,
        "columns": 
        [
            { data: "Codigo" },
            { data: "Nombre" },
            { data: "Descripcion" },
            { data: "Categoria" },
            { data: "Estado" },
            { "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-info btn-sm btnEditar'>Editar</button><button class='btn btn-danger btn-sm btnBorrar'>Borrar</button></div></div>" }
        ],
        responsive: true,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
        },
    });

console.log('data',priducto);
 

        // CREAR
        $("#btnCrear").click(function () {
            opcion = 'crear';
            id = null;
            $("#form").trigger("reset");
            $(".modal-header").css("background-color", "#23272b");
            $(".modal-header").css("color", "white");
            $(".modal-title").text("Crear Color");
            $('#modalCRUD').modal('show');
        });

        // EDITAR
        $(document).on("click", ".btnEditar", function () {
            opcion = 'editar';
            fila = $(this).closest("tr");
            codigo = parseInt(fila.find('td:eq(0)').text());
            console.log('codigo',codigo)
            nombre = fila.find('td:eq(1)').text();
            descripcion = fila.find('td:eq(2)').text();
            idCategoria = fila.find('td:eq(3)').text();
            estado = fila.find('td:eq(4)').text();
            console.log('estado',estado);
            $("#id").val(codigo);
            $("#nombre").val(nombre);
            $("#descripcion").val(descripcion);
             // Usar el nombre del recurso para establecer la opción seleccionada
   $("#id_categoria option:contains('" + idCategoria + "')").prop("selected", true);
            $("#estado").val(estado);
            $(".modal-header").css("background-color", "#7303c0");
            $(".modal-header").css("color", "white");
            $(".modal-title").text("Editar Color");
            $('#modalCRUD').modal('show');
        });

       // Dar de Baja
$(document).on("click", ".btnBorrar", async function () {
    fila = $(this).closest("tr");
    codigo = parseInt(fila.find('td:eq(0)').text());
    console.log('borrar codigo:',codigo);
    estado = fila.find('td:eq(4)').text();
    console.log('borrar estado:',estado);
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
            await api.excutePut(`producto/dardebaja/${codigo}`);
    // Actualizar la tabla con las nuevas productos
    const nuevasproductos = await api.excuteGet('productos');
    tabla.clear().rows.add(nuevasproductos).draw();
          
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
            console.log('codigo',codigo);
            nombre = $.trim($('#nombre').val());
            descripcion = $("#descripcion").val();
            idCategoria = $.trim($('#id_categoria').val());
            estado = $("#estado").val();

            try {
                if (opcion === 'crear') {
                    await api.excutePost('producto',{nombre,descripcion,idCategoria, estado });
                } else if (opcion === 'editar') {
                    await api.excutePut(`producto/${codigo}`, {nombre,descripcion,idCategoria, estado});
                }

                $('#modalCRUD').modal('hide');
                  // Actualizar la tabla con las nuevas productos
                  const nuevasproductos = await api.excuteGet('productos');
                  tabla.clear().rows.add(nuevasproductos).draw();
               
            } catch (error) {
                console.error('Error al guardar/editar:', error.message);
            }
        });

    } catch (error) {
        console.error('Error general:', error.message);
    }
});
