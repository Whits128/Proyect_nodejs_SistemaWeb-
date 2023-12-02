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

        // DataTable initialization
        if (priducto && priducto.length > 0) {
            tabla = $('#Tabla').DataTable({
                data: priducto,
                columns: [
                    { data: "Codigo" },
                    { data: "Nombre" },
                    { data: "Descripcion" },
                    { data: "Categoria" },
                    { data: "Estado" },
                    { "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-info btn-sm btnEditar'>Editar</button><button class='btn btn-danger btn-sm btnBorrar'>Borrar</button></div></div>" }
                ],
                // Resto de las opciones DataTable
            });
        } else {
            console.error('No hay datos de categorías disponibles.');
        }

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
            nombre = fila.find('td:eq(1)').text();
            descripcion = fila.find('td:eq(2)').text();
            idCategoria = fila.find('td:eq(3)').text();
            estado = fila.find('td:eq(4)').text();
            $("#id").val(codigo);
            $("#nombre").val(nombre);
            $("#descripcion").val(descripcion);
             // Usar el nombre del recurso para establecer la opción seleccionada
   $("#idCategoria option:contains('" + idCategoria + "')").prop("selected", true);
            $("#estado").val(estado);
            $(".modal-header").css("background-color", "#7303c0");
            $(".modal-header").css("color", "white");
            $(".modal-title").text("Editar Color");
            $('#modalCRUD').modal('show');
        });

       // Dar de Baja
$(document).on("click", ".btnBorrar", async function () {
    fila = $(this).closest("tr");
    estado = fila.find('td:eq(2)').text();
    codigo = parseInt(fila.find('td:eq(0)').text());

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
            await api.excutePut(`color/dardebaja/${codigo}`);

            // Actualizar la tabla con las nuevas categorías
            const nuevascolor= await api.excuteGet('color');
            tabla.clear().rows.add(nuevascolor).draw();

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
            color = $.trim($('#color').val());
            estado = $("#estado").val();

            try {
                if (opcion === 'crear') {
                    await api.excutePost('color',{color, estado });
                } else if (opcion === 'editar') {
                    await api.excutePut(`color/${codigo}`, {color, estado });
                }

                // Actualizar la tabla con las nuevas categorías
                const nuevascolor = await api.excuteGet('color');
                tabla.clear().rows.add(nuevascolor).draw();

                $('#modalCRUD').modal('hide');
            } catch (error) {
                console.error('Error al guardar/editar:', error.message);
            }
        });

    } catch (error) {
        console.error('Error general:', error.message);
    }
});
