const imagenesArtefactos = {
    'articulo1': 'https://images.vexels.com/media/users/3/202887/isolated/preview/f84d23c27349c292a9a0abefecc19ef1-iacute-cone-de-desenho-de-m-atilde-o-de-zumbi-by-vexels.png',
    'articulo2': 'https://i.pinimg.com/originals/83/a1/eb/83a1eb40f5e421b00f0be77b867e2591.png',
    'articulo3': 'http://www.pngmart.com/files/9/Thanos-Infinity-Stone-Gauntlet-PNG-Transparent-Image.png'
    // Agrega más artefactos según sea necesario
  };
  
  document.addEventListener('DOMContentLoaded', function () {
    // Obtiene los artefactos comprados y las imágenes equipadas del localStorage
    const artefactosComprados = JSON.parse(localStorage.getItem('artefactosComprados')) || [];
    const imagenesEquipadas = JSON.parse(localStorage.getItem('imagenesEquipadas')) || {};
  
    // Muestra los artefactos comprados en la página de personalización
    mostrarArtefactosComprados(artefactosComprados, imagenesEquipadas);
  });
  
  function mostrarArtefactosComprados(artefactosComprados, imagenesEquipadas) {
    let puntosCompraSpan = document.getElementById('puntosCompra');
    let contenidoHTML = '';
  
    if (artefactosComprados.length > 0) {
      contenidoHTML += '<h2>Artefactos para equipar:</h2>';
      contenidoHTML += '<ul>';
  
      for (let artefacto of artefactosComprados) {
        contenidoHTML += `<li onclick="toggleEquipo(this)" data-artefacto="${artefacto}">${artefacto}</li>`;
      }
  
      contenidoHTML += '</ul>';
    } else {
      contenidoHTML = '<h2>No hay objetos que equipar</h2>';
    }
  
    puntosCompraSpan.innerHTML = contenidoHTML;
  
    for (let artefacto in imagenesEquipadas) {
      if (imagenesEquipadas.hasOwnProperty(artefacto)) {
        const imagenEquipada = imagenesEquipadas[artefacto];
        mostrarImagenEquipada(artefacto, imagenEquipada);
      }
    }
  }

  



document.addEventListener('DOMContentLoaded', function () {
    cargarEstadoEquipado();
});


function toggleEquipo(elemento) {
    const artefactoSeleccionado = elemento.dataset.artefacto;
    let yaEquipado = elemento.classList.contains('equipado');

    document.querySelectorAll('.equipado').forEach(item => item.classList.remove('equipado'));

    if (!yaEquipado) {
        elemento.classList.add('equipado');
        mostrarImagenArtefacto(artefactoSeleccionado);
        alert('Artefacto equipado: ' + artefactoSeleccionado);
    } else {
        ocultarImagenArtefacto();
        alert('Artefacto desequipado: ' + artefactoSeleccionado);
    }

    let artefactosEquipados = obtenerArtefactosEquipados();
    let imagenesEquipadas = JSON.parse(localStorage.getItem('imagenesEquipadas')) || {};

    // Actualiza solo el artefacto actual en lugar de sobrescribir todo el objeto
    imagenesEquipadas[artefactoSeleccionado] = yaEquipado ? '' : imagenesArtefactos[artefactoSeleccionado];

    localStorage.setItem('artefactosEquipados', JSON.stringify(artefactosEquipados));
    localStorage.setItem('imagenesEquipadas', JSON.stringify(imagenesEquipadas));

    console.log('Imágenes Equipadas:', imagenesEquipadas);
}






function ocultarImagenArtefacto() {
    // Obtén el elemento de la imagen predeterminada
    const imagenArtefacto = document.querySelector('.mitad-izquierda img');
    
    // Cambia el atributo src a la imagen predeterminada
    imagenArtefacto.src = 'https://images.vexels.com/media/users/3/190368/isolated/preview/825e9e4c04ea5102e55af8b2cc3c5143-ilustraci--n-de-la-mano-by-vexels.png';
    imagenArtefacto.alt = 'Imagen predeterminada';
}

document.addEventListener('DOMContentLoaded', function () {
    cargarEstadoEquipado();
});

function mostrarImagenEquipada(artefacto, imagenEquipada) {
    // Muestra la imagen equipada en la página
    const imagenElemento = document.querySelector('.mitad-izquierda img');
    if (imagenElemento) {
        imagenElemento.src = imagenEquipada;
        imagenElemento.alt = `Imagen equipada de ${artefacto}`;
    }
}

function mostrarImagenArtefacto(artefacto) {
    // Obtén la ruta de la imagen del artefacto
    const rutaImagen = imagenesArtefactos[artefacto];

    // Muestra la imagen en la mitad izquierda
    document.querySelector('.mitad-izquierda img').src = rutaImagen;
}

// Función para obtener la lista de artefactos equipados
function obtenerArtefactosEquipados() {
    // Selecciona todos los elementos de la lista con la clase 'equipado'
    let elementosEquipados = document.querySelectorAll('.equipado');

    // Obtiene los textos de los elementos equipados y los guarda en un array
    let artefactosEquipados = Array.from(elementosEquipados).map(elemento => elemento.dataset.artefacto);

    return artefactosEquipados;
}

// Lógica para cargar el estado de equipado/no equipado al iniciar
document.addEventListener('DOMContentLoaded', function () {
    cargarEstadoEquipado();
});

function cargarEstadoEquipado() {
    // Obtén la lista de artefactos equipados y las imágenes desde el localStorage
    let artefactosEquipados = JSON.parse(localStorage.getItem('artefactosEquipados')) || [];
    let imagenesEquipadas = JSON.parse(localStorage.getItem('imagenesEquipadas')) || {};

    // Aplica el estado de equipado/no equipado a los elementos correspondientes
    artefactosEquipados.forEach(artefacto => {
        // Busca elementos que contengan el texto del artefacto
        let elementos = Array.from(document.querySelectorAll('li')).filter(elemento => elemento.dataset.artefacto === artefacto);

        // Aplica el estado de equipado/no equipado al primer elemento encontrado
        if (elementos.length > 0) {
            let elemento = elementos[0];
            elemento.classList.add('equipado');
        }
    });

    // Muestra las imágenes equipadas o predeterminadas
    for (let artefacto in imagenesEquipadas) {
        if (imagenesEquipadas.hasOwnProperty(artefacto)) {
            const imagenEquipada = imagenesEquipadas[artefacto];
            if (imagenEquipada) {
                mostrarImagenEquipada(artefacto, imagenEquipada);
            } else {
                ocultarImagenArtefacto();
            }
        }
    }
    const artefactoEquipado = localStorage.getItem('artefactoEquipado');
    if (artefactoEquipado && imagenesEquipadas[artefactoEquipado]) {
        mostrarImagenEquipada(artefactoEquipado, imagenesEquipadas[artefactoEquipado]);
    }
}




  