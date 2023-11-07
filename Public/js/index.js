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
