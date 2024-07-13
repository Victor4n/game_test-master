document.addEventListener('DOMContentLoaded', function() {
    // Obtén el puntaje del localStorage o establece 0 si no existe
    const puntajeUsuario = parseInt(localStorage.getItem('puntaje'), 10) || 0;
    const imagenUsuario = localStorage.getItem('fotoPerfil') || 'ruta/de/imagen/vacia.jpg'; // Imagen predeterminada si no hay imagen guardada
  
    // Datos de la clasificación, incluyendo el usuario y los bots
    const clasificaciones = [
      { nombre: 'Usuario', imagen: imagenUsuario, puntuacion: puntajeUsuario },
      { nombre: 'Byte Bromista', imagen: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: 330 },
      { nombre: 'Chispa Cibernética', imagen: 'https://images.pexels.com/photos/157661/young-woman-shooting-model-157661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: 290 },
      { nombre: 'Risueño Robot', imagen: 'https://images.pexels.com/photos/935969/pexels-photo-935969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: 280 },
      { nombre: 'Bit Alegre', imagen: 'https://images.pexels.com/photos/2412691/pexels-photo-2412691.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: 200 },
      { nombre: 'Código Chispeante', imagen: 'https://images.pexels.com/photos/1205716/pexels-photo-1205716.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: 180 },
      { nombre: 'Tecno Travesura', imagen: 'https://images.pexels.com/photos/1089038/pexels-photo-1089038.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: 160 },
      { nombre: 'Ráfaga Risueña', imagen: 'https://images.pexels.com/photos/13081260/pexels-photo-13081260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: 140 },
      { nombre: 'Circuit Sonrisa', imagen: 'https://images.pexels.com/photos/13326901/pexels-photo-13326901.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: 130 },
      { nombre: 'Bytes Divertidos', imagen: 'https://images.pexels.com/photos/3483800/pexels-photo-3483800.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: 100 },
      // Agrega más bots según sea necesario
    ];
  
    // Ordena la clasificación por puntuación de mayor a menor
    clasificaciones.sort(function(a, b) {
      return b.puntuacion - a.puntuacion;
    });
  
    // Actualiza la tabla en el DOM con la clasificación
    const tabla = document.getElementById('tablaClasificaciones');
    const cuerpoTabla = tabla.querySelector('tbody');
  
    // Encuentra la posición del usuario en la clasificación
    const posicionUsuario = clasificaciones.findIndex(function(item) {
      return item.nombre === 'Usuario';
    });
  
    // Itera sobre las clasificaciones y actualiza o crea la fila correspondiente
    clasificaciones.forEach(function(clasificacion, index) {
      const filaExistente = cuerpoTabla.querySelector(`tr[data-nombre="${clasificacion.nombre}"]`);
  
      if (filaExistente) {
        // Si la fila ya existe, actualiza su contenido
        filaExistente.innerHTML = `<td>${index + 1}</td><td><img src="${clasificacion.imagen}" width="40" height="40"></td><td>${clasificacion.nombre}</td><td>${clasificacion.puntuacion}</td>`;
        
        // Aplica estilos según la posición del usuario
        if (clasificacion.nombre === 'Usuario') {
          filaExistente.classList.add(obtenerEstiloUsuario(index + 1));
        }
      } else {
        // Si la fila no existe, crea una nueva
        var fila = document.createElement('tr');
        fila.dataset.nombre = clasificacion.nombre;
        fila.innerHTML = `<td>${index + 1}</td><td><img src="${clasificacion.imagen}" width="40" height="40"></td><td>${clasificacion.nombre}</td><td>${clasificacion.puntuacion}</td>`;
        
        // Aplica estilos según la posición del usuario
        if (clasificacion.nombre === 'Usuario') {
          fila.classList.add(obtenerEstiloUsuario(index + 1));
        }
  
        cuerpoTabla.appendChild(fila);
      }
    });
  });
  
  // Función para obtener el estilo del usuario según su posición relativa en la clasificación
  function obtenerEstiloUsuario(posicionRelativa) {
    if (posicionRelativa === 1) {
      return 'dorado';
    } else if (posicionRelativa === 2) {
      return 'plateado';
    } else if (posicionRelativa === 3) {
      return 'bronce';
    } else {
      return 'normal';
    }
  }
  
