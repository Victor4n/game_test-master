


// Muestra la barra de carga antes de recargar la página
window.addEventListener('beforeunload', function() {
    document.getElementById('overlay').style.display = 'flex';
  });
  
  // Oculta la barra de carga después de cargar completamente la página
  window.addEventListener('load', function() {
    setTimeout(function() {
      document.getElementById('overlay').style.display = 'none';
    }, 1000); // Ajusta el tiempo según tus necesidades
  });
  
  // Muestra la barra de carga al iniciar la carga de la página
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('overlay').style.display = 'flex';
  });
  
  // Oculta la barra de carga después de cargar completamente la página
  window.addEventListener('load', function() {
    document.getElementById('overlay').style.display = 'none';
  });

  document.addEventListener('DOMContentLoaded', function() {
    let playerProfile = document.getElementById('playerProfile');
    let playerName = document.getElementById('playerName');
    let imagenPrevia = document.getElementById('imagenPrevia');
    let achievements = document.getElementById('achievements');

    // Cargar datos del perfil desde el localStorage
    let nombreUsuarioGuardado = localStorage.getItem('nombreUsuario');
    let fotoPerfilGuardada = localStorage.getItem('fotoPerfil');
    let maxPuntaje = localStorage.getItem('maxPuntaje') || 0;

    // Mostrar datos del perfil guardados, si existen
    if (nombreUsuarioGuardado) {
        playerName.textContent = nombreUsuarioGuardado;
    }

    if (fotoPerfilGuardada) {
        imagenPrevia.src = fotoPerfilGuardada;
    }

    // Añadir eventos de clic
    playerProfile.addEventListener('click', function() {
        // Redirigir a la página de perfil
        window.location.href = '../perfil del jugador/perfilEdicion.html';
    });

    achievements.addEventListener('click', function() {
        // Redirigir a la página de logros
        window.location.href = '../logros/logros.html';
    });

    // ... (resto de tu código JavaScript)
});