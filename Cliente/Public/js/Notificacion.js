// Contenido de Notificacion.js

// Verificar si el documento se está cargando por primera vez durante la sesión
if (!sessionStorage.getItem('notificationsInitialized')) {
    // Recuperar notificaciones al cargar la página
    $(document).ready(function () {
        const notifications = JSON.parse(localStorage.getItem('notifications')) || [];

        // Limpiar el contenedor antes de agregar notificaciones
        const notificationDropdown = $('#notificationDropdown');
        notificationDropdown.empty();

        notifications.forEach(notification => {
            addNotification(notification.type, notification.message);
        });

        // Marcar como inicializadas en sessionStorage para esta sesión
        sessionStorage.setItem('notificationsInitialized', true);
    });
}

// Resto del código...

// Función para agregar notificación
function addNotification(type, message) {
    const notificationDropdown = $('#notificationDropdown');
    const notificationCount = $('#notificationCount');

    // Incrementar el contador de notificaciones
    const currentCount = parseInt(notificationCount.text());
    notificationCount.text(currentCount + 1);

    // Crear un nuevo elemento de notificación
    const notificationItem = $('<div>').addClass(`dropdown-item text-${type}`)
        .html(`<i class="fas fa-check-circle"></i> ${message}`);

    // Agregar la notificación al contenedor
    notificationDropdown.prepend(notificationItem);

    // Almacenar notificación en localStorage
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    notifications.push({ type, message });
    localStorage.setItem('notifications', JSON.stringify(notifications));
}

// Función para limpiar notificaciones al realizar alguna acción que las requiera
function clearNotifications() {
    localStorage.removeItem('notifications');
}
