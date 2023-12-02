// Declaración de variables
let opcion, id, codigo, NumeroTalla, estado, fila;

import { EntityClass } from "../EntityClass.js";
const api = new EntityClass();

$(document).ready(async function () {
    let tabla;

    try {
        // Obtener datos de categorías al cargar la página
        const tallas = await api.excuteGet('talla');

        // DataTable initialization
        if (tallas && tallas.length > 0) {
            tabla = $('#Tabla').DataTable({
                data: tallas,
                columns: [
                    { data: "Codigo" },
                    { data: "NumeroTalla" },
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
            $(".modal-title").text("Crear Tallas");
            $('#modalCRUD').modal('show');
        });

        // EDITAR
        $(document).on("click", ".btnEditar", function () {
            opcion = 'editar';
            fila = $(this).closest("tr");
            codigo = parseInt(fila.find('td:eq(0)').text());
            NumeroTalla = fila.find('td:eq(1)').text();
            estado = fila.find('td:eq(2)').text();
            $("#id").val(codigo);
            $("#NumeroTalla").val(NumeroTalla);
            $("#estado").val(estado);
            $(".modal-header").css("background-color", "#7303c0");
            $(".modal-header").css("color", "white");
            $(".modal-title").text("Editar Talla");
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
            await api.excutePut(`talla/dardebaja/${codigo}`);

            // Actualizar la tabla con las nuevas categorías
            const nuevasTalla = await api.excuteGet('talla');
            tabla.clear().rows.add(nuevasTalla).draw();

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
            NumeroTalla = $.trim($('#NumeroTalla').val());
            estado = $("#estado").val();

            try {
                if (opcion === 'crear') {
                    await api.excutePost('talla', { NumeroTalla, estado });
                } else if (opcion === 'editar') {
                    await api.excutePut(`talla/${codigo}`, { NumeroTalla, estado });
                }

                // Actualizar la tabla con las nuevas talla
                const nuevastalla = await api.excuteGet('talla');
                tabla.clear().rows.add(nuevastalla).draw();

                $('#modalCRUD').modal('hide');
            } catch (error) {
                console.error('Error al guardar/editar:', error.message);
            }
        });

    } catch (error) {
        console.error('Error general:', error.message);
    }
});
