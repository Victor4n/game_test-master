document.addEventListener('DOMContentLoaded', function() {
    // Obtén los elementos del formulario
    let formularioPerfil = document.getElementById('formularioPerfil');
    let nombreUsuarioInput = document.getElementById('nombreUsuario');
    let fotoPerfilInput = document.getElementById('fotoPerfil');
    let imagenPrevia = document.getElementById('imagenPrevia');
  
    // Crear elemento para mostrar el puntaje máximo
    let maxPuntajeElement = document.createElement('p');
    maxPuntajeElement.id = 'maxPuntaje';
    formularioPerfil.appendChild(maxPuntajeElement);
  
    // Cargar datos del perfil desde el localStorage
    let nombreUsuarioGuardado = localStorage.getItem('nombreUsuario');
    let fotoPerfilGuardada = localStorage.getItem('fotoPerfil');
    let maxPuntaje = localStorage.getItem('maxPuntaje') || 0;
  
    // Mostrar datos del perfil guardados, si existen
    if (nombreUsuarioGuardado) {
      nombreUsuarioInput.value = nombreUsuarioGuardado;
    }
  
    if (fotoPerfilGuardada) {
      // Verificar que la URL de la imagen sea válida
      imagenPrevia.onload = function() {
        // La imagen se cargó correctamente
        console.log('Imagen cargada correctamente');
      };
  
      imagenPrevia.onerror = function() {
        // La URL de la imagen no es válida, maneja el error según tus necesidades
        console.error('Error al cargar la imagen');
      };
  
      imagenPrevia.src = fotoPerfilGuardada;
    }
  
    // Mostrar el puntaje máximo
    maxPuntajeElement.innerText = `Puntaje Máximo: ${maxPuntaje}`;
  
    fotoPerfilInput.addEventListener('change', function(event) {
        let archivo = event.target.files[0];
    
        if (archivo) {
          // Convierte la imagen a una cadena base64 y guárdala en localStorage
          const lector = new FileReader();
          lector.onload = function(e) {
            const base64Imagen = e.target.result;
            localStorage.setItem('fotoPerfil', base64Imagen);
            imagenPrevia.src = base64Imagen;
          };
          lector.readAsDataURL(archivo);
        } else {
          // Si el usuario elimina la imagen, puedes borrar la entrada del localStorage
          localStorage.removeItem('fotoPerfil');
          // También podrías establecer una imagen predeterminada o dejarlo en blanco
          imagenPrevia.src = 'ruta/de/imagen/vacia.jpg';
        }
      });
    
      // Manejar el envío del formulario
      formularioPerfil.addEventListener('submit', function(event) {
        event.preventDefault();
    
        // Obtener valores del formulario
        const nuevoNombreUsuario = nombreUsuarioInput.value;
        let nuevaFotoPerfil = imagenPrevia.src;
    
        // Guardar en localStorage
        localStorage.setItem('nombreUsuario', nuevoNombreUsuario);
        localStorage.setItem('fotoPerfil', nuevaFotoPerfil);
    
        alert('Cambios guardados exitosamente.');
      });
    });
  