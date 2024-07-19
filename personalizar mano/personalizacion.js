const imagenesArtefactos = {
    'articulo1': 'https://images.vexels.com/media/users/3/202887/isolated/preview/f84d23c27349c292a9a0abefecc19ef1-iacute-cone-de-desenho-de-m-atilde-o-de-zumbi-by-vexels.png',
    'articulo2': 'https://i.pinimg.com/originals/83/a1/eb/83a1eb40f5e421b00f0be77b867e2591.png',
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
    const contenedorArtefactos = document.getElementById('contenedorArtefactos');
    contenedorArtefactos.innerHTML = '';

    if (artefactosComprados.length > 0) {
        artefactosComprados.forEach(artefacto => {
            const artefactoDiv = document.createElement('div');
            artefactoDiv.className = 'artefacto';

            const img = document.createElement('img');
            img.src = imagenesArtefactos[artefacto];
            img.alt = artefacto;

            const button = document.createElement('button');
            button.innerText = imagenesEquipadas[artefacto] ? 'Equipado' : 'Equipar';
            button.disabled = !!imagenesEquipadas[artefacto];
            button.onclick = function () {
                equiparArtefacto(artefacto);
            };

            artefactoDiv.appendChild(img);
            artefactoDiv.appendChild(button);
            contenedorArtefactos.appendChild(artefactoDiv);
        });
    } else {
        contenedorArtefactos.innerHTML = '<h2>No hay objetos que equipar</h2>';
    }
}

function equiparArtefacto(artefacto) {
    let imagenesEquipadas = JSON.parse(localStorage.getItem('imagenesEquipadas')) || {};

    // Desequipar todos los artefactos
    for (let key in imagenesEquipadas) {
        if (imagenesEquipadas.hasOwnProperty(key)) {
            imagenesEquipadas[key] = '';
        }
    }

    // Equipar el artefacto seleccionado
    imagenesEquipadas[artefacto] = imagenesArtefactos[artefacto];

    localStorage.setItem('imagenesEquipadas', JSON.stringify(imagenesEquipadas));

    mostrarArtefactosComprados(Object.keys(imagenesArtefactos), imagenesEquipadas);
    mostrarImagenArtefacto(artefacto);
}

function mostrarImagenArtefacto(artefacto) {
    const rutaImagen = imagenesArtefactos[artefacto];
    const imagenElemento = document.querySelector('.mitad-izquierda img');
    imagenElemento.src = rutaImagen;
    imagenElemento.alt = `Imagen equipada de ${artefacto}`;
}




  