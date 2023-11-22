// Función para mostrar/ocultar notificaciones (debes implementarla)
function toggleNotifications() {
  // Implementa la lógica para mostrar/ocultar notificaciones
}

// Función para cambiar el contenido de la página
function changeContent(page) {
  const pageTitle = document.getElementById('page-title');
  const pageContent = document.getElementById('page-content');

  pageTitle.innerText = page;
  pageContent.innerText = `Contenido de la página ${page}.`;
}

// Función para mostrar u ocultar el menú de usuario
function toggleUserMenu() {
  const userMenu = document.getElementById('user-menu');
  userMenu.classList.toggle('active');
}

// Event listener para el clic en la sección del usuario
const userSection = document.getElementById('user-section');
userSection.addEventListener('click', toggleUserMenu);

/*
$(document).ready(function () {
  // Función para cargar el contenido de la vista en el main
  function loadView(viewName) {
    $.ajax({
      url: '/' + viewName, // Ajusta la ruta según la configuración de tus rutas en Express
      type: 'GET',
      dataType: 'html',
      success: function (data) {
        // Encuentra el contenedor específico en la vista y extrae su contenido
        var extractedContent = $(data).find('.Contenedor_Mostrar').html();
        
        // Carga el contenido extraído en el #dynamic-content
        $('#dynamic-content').html(extractedContent);

        // Inicialización de DataTable después de cargar el contenido
        $('#Tabla').DataTable();
      },
      error: function (error) {
        console.error('Error al cargar la vista:', error);
      },
    });
  }

  // Manejadores de clic para los elementos del menú
  $('.menu a').on('click', function (event) {
    event.preventDefault();
    var viewName = $(this).attr('href').substring(1); // Elimina el primer carácter ("/")
    loadView(viewName);
  });
});
*/