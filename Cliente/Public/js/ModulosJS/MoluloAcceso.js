// Declaración de variables
let opcion, id, codigo,ruta, idRecurso, idRol, fila;
import CreateDropDown from "../DropDownComponent.js"
import { EntityClass } from "../EntityClass.js";
const api = new EntityClass();
try {
    const rolResponse = await api.excuteGet('configuracionAcceso/rol');
    const rolData = rolResponse;
    const selectrol = document.getElementById('idRol');
    CreateDropDown(rolData, selectrol,  'Nombre','Codigo');

    const recursoResponse = await api.excuteGet('configuracionAcceso/recursos');
    const recursoData = recursoResponse;
    const selectrecurso = document.getElementById('idRecurso');
    console.log('selectrecurso', selectrecurso);
    console.log('recursoData', recursoData);
    CreateDropDown(recursoData, selectrecurso, 'NombreRecurso', 'Codigo');
} catch (error) {
    console.error('Error al obtener datos:', error.message);
    // Puedes mostrar un mensaje de error al usuario si lo deseas
    Swal.fire('¡Error!', 'Hubo un problema al obtener datos.', 'error');
}

$(document).ready(async function () {
    let tabla;

    try {
        // Obtener datos de categorías al cargar la página
        const Acceso = await api.excuteGet('configuracionAcceso');

        // DataTable initialization
        if (Acceso && Acceso.length > 0) {
            tabla = $('#Tabla').DataTable({
                data: Acceso,
                columns: [
                    { data: "Codigo" },
                    { data: "Ruta" },
                    { data: "NombreRecurso" },
                    { data: "NombreRol" },
                    { "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-info btn-sm btnEditar'>Editar</button><button class='btn btn-danger btn-sm btnBorrar'>Borrar</button></div></div>" }
                ],
                responsive: true,
                language: {
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
            $(".modal-title").text("Crear Aceso");
            $('#modalCRUD').modal('show');
        });

        // EDITAR
        $(document).on("click", ".btnEditar", function () {
            opcion = 'editar';
            fila = $(this).closest("tr");
            codigo = parseInt(fila.find('td:eq(0)').text());
            ruta = fila.find('td:eq(1)').text();
            idRecurso = fila.find('td:eq(2)').text(); // Código
            idRol = fila.find('td:eq(3)').text();
          
            $("#id").val(codigo);
        
            $("#ruta").val(ruta);
           // Usar el nombre del recurso para establecer la opción seleccionada
           $("#idRecurso option:contains('" + idRecurso + "')").prop("selected", true);
                    // Usar el nombre del recurso para establecer la opción seleccionada
                    $("#idRol option:contains('" + idRol + "')").prop("selected", true);
            $(".modal-header").css("background-color", "#7303c0");
            $(".modal-header").css("color", "white");
            $(".modal-title").text("Editar Bodega");
            $('#modalCRUD').modal('show');
        });

       // Dar de Baja
$(document).on("click", ".btnBorrar", async function () {
    fila = $(this).closest("tr");
    estado = fila.find('td:eq(3)').text();
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
            await api.excutePut(`bodega/dardebaja/${codigo}`);

            // Actualizar la tabla con las nuevas categorías
            const nuevasBodega = await api.excuteGet('bodega');
            tabla.clear().rows.add(nuevasBodega).draw();

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
            ruta = $.trim($('#ruta').val());
            idRecurso = $.trim($("#idRecurso").val());
            idRol = $.trim($("#idRol").val());

            try {
                if (opcion === 'crear') {
                    await api.excutePost('configuracionAcceso/post', { ruta, idRecurso, idRol });
                } else if (opcion === 'editar') {
                    await api.excutePut(`configuracionAcceso/${codigo}`, {ruta, idRecurso, idRol });
                }

                // Actualizar la tabla con las nuevas categorías
                const nuevasBodega = await api.excuteGet('configuracionAcceso');
                tabla.clear().rows.add(nuevasBodega).draw();

                $('#modalCRUD').modal('hide');
            } catch (error) {
                console.error('Error al guardar/editar:', error.message);
            }
        });

    } catch (error) {
        console.error('Error general:', error.message);
    }
});
