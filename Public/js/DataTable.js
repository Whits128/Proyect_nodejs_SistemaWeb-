let dataTable;
let dataTableIsInitialized = false;

const dataTableOptions = {
    lengthMenu: [5, 10, 15, 20, 100, 200, 500],
    columnDefs: [
        { className: "centered", targets: [0, 1, 2, 3, 4, 5, 6] },
        { orderable: false, targets: [5, 6] },
        { searchable: false, targets: [1] }
    ],
    pageLength: 3,
    destroy: true,
    language: {
        lengthMenu: "Mostrar _MENU_ registros por página",
        zeroRecords: "Ningún usuario encontrado",
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Ningún usuario encontrado",
        infoFiltered: "(filtrados desde _MAX_ registros totales)",
        search: "Buscar:",
        loadingRecords: "Cargando...",
        paginate: {
            first: "Primero",
            last: "Último",
            next: "Siguiente",
            previous: "Anterior"
        }
    }
};

const initDataTable = async () => {
    if (dataTableIsInitialized) {
        dataTable.destroy();
    }

    await listUsers();

    const table = document.getElementById('datatable');
    dataTable = new DataTable(table, dataTableOptions);

    dataTableIsInitialized = true;
};

const listUsers = async () => {
    const tableBody = document.getElementById('tableBody');
    try {
        const response = await fetch("http://localhost:3000/Categoria");
        const users = await response.json();

        let content = ``;
        users.forEach((user) => {
            content += `
                <tr>
                    <td>${user.Codigo}</td>
                    <td>${user.Nombre}</td>
                    <td>${user.Estado}</td>
                </tr>`;
        });
        tableBody.innerHTML = content;
    } catch (ex) {
        alert(ex);
    }
};

window.addEventListener("load", async () => {
    await initDataTable();
});
