


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