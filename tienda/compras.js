// Definición de los artículos de la tienda
const articulosTienda = [
    { id: 'articulo1', nombre: 'Mano de zombie', precio: 100, imagen: 'https://images.vexels.com/media/users/3/202887/isolated/preview/f84d23c27349c292a9a0abefecc19ef1-iacute-cone-de-desenho-de-m-atilde-o-de-zumbi-by-vexels.png' },
    { id: 'articulo2', nombre: 'Mano de zombie edición PvZ', precio: 500, imagen: 'https://i.pinimg.com/originals/83/a1/eb/83a1eb40f5e421b00f0be77b867e2591.png' },
    { id: 'articulo3', nombre: 'Mano Guantelete del infinito', precio: 1000, imagen: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/intermediary/f/1dbc1935-6542-4ee3-822f-135cff4ba62c/dc4t7jr-629058ee-b6bc-4e8f-8d4d-0f9922e6e7d0.png/v1/fill/w_738,h_1083,strp/infinity_gauntlet___transparent__by_camo_flauge_dc4t7jr-pre.png'},
    
    
    // Puedes agregar más artículos aquí fácilmente
];

document.addEventListener('DOMContentLoaded', function() {
    let puntajeActual = parseInt(localStorage.getItem('puntaje'), 10) || 0;
    let artefactosComprados = JSON.parse(localStorage.getItem('artefactosComprados')) || [];

    actualizarPuntaje(puntajeActual);
    generarTienda();
    inicializarArtefactosComprados(artefactosComprados);
});

function actualizarPuntaje(puntaje) {
    let puntosCompraSpan = document.getElementById('puntosCompra');
    puntosCompraSpan.innerText = "Puntaje actual: " + puntaje;
}

function generarTienda() {
    const tiendaContainer = document.getElementById('tiendaItems');
    articulosTienda.forEach(articulo => {
        const articuloElement = crearElementoArticulo(articulo);
        tiendaContainer.appendChild(articuloElement);
    });
}

function crearElementoArticulo(articulo) {
    const divArticulo = document.createElement('div');
    divArticulo.id = articulo.id;
    divArticulo.className = 'tarjeta';
    divArticulo.innerHTML = `
        <img src="${articulo.imagen}" alt="${articulo.nombre}">
        <h2>${articulo.nombre}</h2>
        <p>Precio: ${articulo.precio} puntos</p>
        <button class="boton-comprar" onclick="comprar(${articulo.precio}, '${articulo.id}')">Comprar</button>
    `;
    return divArticulo;
}

function comprar(precio, articuloId) {
    let puntajeActual = parseInt(localStorage.getItem('puntaje'), 10) || 0;

    if (artefactoYaComprado(articuloId)) {
        alert("Ya has comprado este artefacto.");
        return;
    }

    if (puntajeActual >= precio) {
        puntajeActual -= precio;
        agregarArtefactoComprado(articuloId);
        localStorage.setItem('puntaje', puntajeActual);
        actualizarPuntaje(puntajeActual);
        localStorage.setItem('artefactosComprados', JSON.stringify(obtenerArtefactosComprados()));
        deshabilitarBotonCompra(articuloId);
        alert("¡Compra exitosa! Precio: " + precio + " puntos");
    } else {
        alert("No tienes suficientes puntos para comprar este artefacto.");
    }
}

function inicializarArtefactosComprados(artefactosComprados) {
    artefactosComprados.forEach(function(artefactoId) {
        deshabilitarBotonCompra(artefactoId);
    });
}

function deshabilitarBotonCompra(artefactoId) {
    let botonCompra = document.querySelector(`#${artefactoId} .boton-comprar`);
    if (botonCompra) {
        botonCompra.disabled = true;
        botonCompra.innerText = "Ya comprado";
    }
}

function artefactoYaComprado(artefactoId) {
    let artefactosComprados = obtenerArtefactosComprados();
    return artefactosComprados.includes(artefactoId);
}

function agregarArtefactoComprado(artefactoId) {
    let artefactosComprados = obtenerArtefactosComprados();
    artefactosComprados.push(artefactoId);
    localStorage.setItem('artefactosComprados', JSON.stringify(artefactosComprados));
}

function obtenerArtefactosComprados() {
    return JSON.parse(localStorage.getItem('artefactosComprados')) || [];
}