document.addEventListener('DOMContentLoaded', function() {
    // Obtiene el puntaje del localStorage o establece 0 si no existe
    let puntajeActual = parseInt(localStorage.getItem('puntaje'), 10) || 0;
  
    // Obtiene la información de los artefactos comprados o establece un array vacío si no existe
    let artefactosComprados = JSON.parse(localStorage.getItem('artefactosComprados')) || [];
  
    // Muestra el puntaje en la página de compras
    let puntosCompraSpan = document.getElementById('puntosCompra');
    puntosCompraSpan.innerText = "Puntaje actual: " + puntajeActual;
  
    // Inicializa la información de los artefactos comprados en la interfaz
    inicializarArtefactosComprados(artefactosComprados);
  });
  
  function comprar(precio, articuloId) {
    let puntajeActual = parseInt(localStorage.getItem('puntaje'), 10) || 0;
  
    // Verifica si el artefacto ya ha sido comprado
    if (artefactoYaComprado(articuloId)) {
      alert("Ya has comprado este artefacto.");
      return;
    }
  
    if (puntajeActual >= precio) {
      // Resta el precio del puntaje
      puntajeActual -= parseInt(precio, 10);
  
      // Añade el artefacto a la lista de comprados
      agregarArtefactoComprado(articuloId);
  
      // Actualiza el puntaje en el localStorage
      localStorage.setItem('puntaje', puntajeActual);
  
      // Actualiza el puntaje en la interfaz
      let puntosCompraSpan = document.getElementById('puntosCompra');
      puntosCompraSpan.innerText = "Puntaje actual: " + puntajeActual;
  
      // Actualiza la lista de artefactos comprados en el localStorage
      localStorage.setItem('artefactosComprados', JSON.stringify(obtenerArtefactosComprados()));
  
      alert("¡Compra exitosa! Precio: " + precio + " puntos");
    } else {
      alert("No tienes suficientes puntos para comprar este artefacto.");
    }
  }
  
  function inicializarArtefactosComprados(artefactosComprados) {
    // Recorre la lista de artefactos comprados y los deshabilita en la interfaz
    artefactosComprados.forEach(function(artefactoId) {
      let botonCompra = document.getElementById(artefactoId).querySelector('button');
      if (botonCompra) {
        botonCompra.disabled = true;
        botonCompra.innerText = "Ya comprado";
      }
    });
  }
  
  function artefactoYaComprado(artefactoId) {
    // Verifica si el artefacto ya ha sido comprado
    let artefactosComprados = obtenerArtefactosComprados();
    return artefactosComprados.includes(artefactoId);
  }
  
  function agregarArtefactoComprado(artefactoId) {
    // Añade el artefacto a la lista de comprados
    let artefactosComprados = obtenerArtefactosComprados();
    artefactosComprados.push(artefactoId);
    localStorage.setItem('artefactosComprados', JSON.stringify(artefactosComprados));
  }
  
  function obtenerArtefactosComprados() {
    // Obtiene la lista de artefactos comprados del localStorage o establece un array vacío si no existe
    return JSON.parse(localStorage.getItem('artefactosComprados')) || [];
  }
  