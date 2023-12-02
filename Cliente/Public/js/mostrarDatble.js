import { TableComponent } from "../js/DataTableComponet.js";

window.onload = async () => {
  const dataUrl = "Categoria";

  try {
    const response = await fetch(dataUrl);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    const tableConfig = {
      Dataset: data,
      ShowAddButton: true, // Mostrar botón de agregar
      ShowDeleteButton: true, // Mostrar botón de eliminar
      Functions: [
        (data) => {
          alert(`Haz hecho clic en la fila con ID: ${data.id}`);
        }
      ]
    };

    const table = new TableComponent(tableConfig);

    // Agregar la tabla al DOM
    const contenidoMain = document.querySelector('.Contenido-Main');
    contenidoMain.appendChild(table);

    // Dibujar la tabla con los datos
    table.DrawTableComponent(data);

  } catch (error) {
    console.error('Error fetching or displaying data:', error);
  }
};
