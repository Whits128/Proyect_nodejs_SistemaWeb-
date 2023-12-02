// Declaración de variables
let opcion, id, codigo,nombre, descripcion, fechaInicio, fechaFin, estado, fila;

import { EntityClass } from "../EntityClass.js";
const api = new EntityClass();

$(document).ready(async function () {
    let tabla;

    try {
        // Obtener datos de Promociones al cargar la página
        const Promociones = await api.excuteGet('promociones');

        // DataTable initialization
        if (Promociones && Promociones.length > 0) {
            tabla = $('#Tabla').DataTable({
                data: Promociones,
                columns: [
                    { data: "Codigo" },
                    { data: "Nombre",className: "custom-column2" },
                    { data: "Descripcion" },
                    {
                        "data": "FechaInicio",
                        "targets": 3,
                        "render": function (data, type, row) {
                            return moment.utc(data).format('YYYY-MM-DD');
                        }
                    },
                    {
                        "data": "FechaFin",className: "custom-column",
                        "targets": 4,
                        "render": function (data, type, row) {
                            return moment.utc(data).format('YYYY-MM-DD');
                        }
                    },
                    { data: "Estado" },
                    { "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-info btn-sm btnEditar'>Editar</button><button class='btn btn-danger btn-sm btnBorrar'>Borrar</button></div></div>" }
                ],
                responsive: true, // Hace la tabla responsive
                language: {
                    // Configuración del idioma (puedes personalizar según tu preferencia)
                    url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
                },
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
            $(".modal-title").text("Crear Promocion");
            $('#modalCRUD').modal('show');
        });

        // EDITAR
        $(document).on("click", ".btnEditar", function () {
            opcion = 'editar';
            fila = $(this).closest("tr");
            codigo = parseInt(fila.find('td:eq(0)').text());
            nombre = fila.find('td:eq(1)').text();
            descripcion = fila.find('td:eq(2)').text();
            fechaInicio = fila.find('td:eq(3)').text();
            fechaFin = fila.find('td:eq(4)').text();
            estado = fila.find('td:eq(5)').text();

            

            $("#id").val(codigo);
            $("#nombre").val(nombre);
            $("#descripcion").val(descripcion);
            const fechaFormateada = moment(fechaInicio).format('YYYY-MM-DD');
            $("#fechaInicio").val(fechaFormateada);
            const fechaFormateada2 = moment(fechaFin).format('YYYY-MM-DD');
            $("#fechaFin").val(fechaFormateada2);
            $("#estado").val(estado);
            $(".modal-header").css("background-color", "#7303c0");
            $(".modal-header").css("color", "white");
            $(".modal-title").text("Editar Marca");
            $('#modalCRUD').modal('show');
        });

       // Dar de Baja
$(document).on("click", ".btnBorrar", async function () {
    fila = $(this).closest("tr");
    estado = fila.find('td:eq(5)').text();
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
            await api.excutePut(`promociones/dardebaja/${codigo}`);

            // Actualizar la tabla con las nuevas categorías
            const nuevaspromociones= await api.excuteGet('promociones');
            tabla.clear().rows.add(nuevaspromociones).draw();

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
            nombre = $.trim($('#nombre').val());
            descripcion =$.trim($('#descripcion').val());
            fechaInicio=$.trim($('#fechaInicio').val());
            fechaFin =$.trim($('#fechaFin').val());
            estado = $("#estado").val() ;    

            try {
                if (opcion === 'crear') {
                    await api.excutePost('promociones',{nombre, descripcion, fechaInicio, fechaFin,estado });
                } else if (opcion === 'editar') {
                    await api.excutePut(`promociones/${codigo}`, {nombre, descripcion, fechaInicio, fechaFin,estado });
                }

                // Actualizar la tabla con las nuevas categorías
                const nuevaspromociones= await api.excuteGet('promociones');
                tabla.clear().rows.add(nuevaspromociones).draw();

                $('#modalCRUD').modal('hide');
            } catch (error) {
                console.error('Error al guardar/editar:', error.message);
            }
        });

    } catch (error) {
        console.error('Error general:', error.message);
    }
});
