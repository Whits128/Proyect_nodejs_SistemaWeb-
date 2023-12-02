// Declaración de variables
let opcion, id, codigo,nombre, descripcion, tipoMaterial, tipodeCostura, tipoSuela, fabricante, observaciones, estado, fila;

import { EntityClass } from "../EntityClass.js";
const api = new EntityClass();

$(document).ready(async function () {
    let tabla;

    try {
        // Obtener datos de materialesZapatos al cargar la página
        const MaterialZapato = await api.excuteGet('materialesZapatos');

        // DataTable initialization
        if (MaterialZapato && MaterialZapato.length > 0) {
            tabla = $('#Tabla').DataTable({
                data: MaterialZapato,
                "scrollX": true, // Habilita el scroll horizontal
                "scrollCollapse": true, // Colapso de scroll si no es necesario
                                 
                columns: [
                    { data: "Codigo" },
                    {"data": "Nombre", className: "custom-column2"},
                        {"data": "Descripcion"},
                        {"data": "TipoMaterial"},
                        {"data": "TipodeCostura" ,className: "custom-column2"},
                        {"data": "TipoSuela",className: "custom-column2"},
                        {"data": "Fabricante"},
                        {"data": "Observaciones"},
                         {"data":"Estado"},
                    { "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-info btn-sm btnEditar'>Editar</button><button class='btn btn-danger btn-sm btnBorrar'>Borrar</button></div></div>" }
                // Ocultar columnas
    
                ],
                // Resto de las opciones DataTable
                // Ocultar columnas
     
            });
        } else {
            console.error('No hay datos de categorías disponibles.');
        }
        tabla.columns([7,2]).visible(false);
        // CREAR
        $("#btnCrear").click(function () {
            opcion = 'crear';
            id = null;
            $("#form").trigger("reset");
            $(".modal-header").css("background-color", "#23272b");
            $(".modal-header").css("color", "white");
            $(".modal-title").text("Crear Materiales Zapatos");
            $('#modalCRUD').modal('show');
        });

        // EDITAR
        $(document).on("click", ".btnEditar", function () {
            opcion = 'editar';
            fila = $(this).closest("tr");
            codigo = parseInt(fila.find('td:eq(0)').text());
            nombre = fila.find('td:eq(1)').text();
                    descripcion =fila.find('td:eq(2)').text();
                    tipoMaterial =fila.find('td:eq(3)').text();
                    tipodeCostura =fila.find('td:eq(4)').text();
                    tipoSuela = fila.find('td:eq(5)').text();
                    fabricante =fila.find('td:eq(6)').text();
                    observaciones =fila.find('td:eq(7)').text();
                    estado = fila.find('td:eq(8)').text();
                    $("#id").val(codigo);
            $('#nombre').val(nombre);
            $('#descripcion').val(descripcion);
            $('#tipoMaterial').val(tipoMaterial);
            $('#tipodeCostura').val(tipodeCostura);
            $('#tipoSuela').val(tipoSuela);
            $('#fabricante').val(fabricante);
            $('#observaciones').val(observaciones);
            $('#estado').val(estado);
            $(".modal-header").css("background-color", "#7303c0");
            $(".modal-header").css("color", "white");
            $(".modal-title").text("Editar Materiales Zapatos");
            $('#modalCRUD').modal('show');
        });

       // Dar de Baja
$(document).on("click", ".btnBorrar", async function () {
    fila = $(this).closest("tr");
    estado = fila.find('td:eq(8)').text();
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
            await api.excutePut(`materialesZapatos/dardebaja/${codigo}`);

            // Actualizar la tabla con las nuevas categorías
            const nuevasmaterialesZapatos= await api.excuteGet('materialesZapatos');
            tabla.clear().rows.add(nuevasmaterialesZapatos).draw();

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
            tipoMaterial=$.trim($('#tipoMaterial').val());
            tipodeCostura =$.trim($('#tipodeCostura').val());
            tipoSuela =$.trim($('#tipoSuela').val());
            fabricante=$.trim($('#fabricante').val());
            observaciones=$.trim($('#observaciones').val());
            estado = $("#estado").val() ;  

            try {
                if (opcion === 'crear') {
                    await api.excutePost('materialesZapatos',{nombre, descripcion, tipoMaterial, tipodeCostura, tipoSuela, fabricante, observaciones, estado });
                } else if (opcion === 'editar') {
                    console.log({ nombre, descripcion, tipoMaterial, tipodeCostura, tipoSuela, fabricante, observaciones, estado });
                    await api.excutePut(`materialesZapatos/${codigo}`, {nombre, descripcion, tipoMaterial, tipodeCostura, tipoSuela, fabricante, observaciones, estado });
                    
                }

                // Actualizar la tabla con las nuevas categorías
                const nuevasmaterialesZapatos = await api.excuteGet('materialesZapatos');
                tabla.clear().rows.add(nuevasmaterialesZapatos).draw();

                $('#modalCRUD').modal('hide');
            } catch (error) {
                console.error('Error al guardar/editar:', error.message);
            }
        });

    } catch (error) {
        console.error('Error general:', error.message);
    }
});
