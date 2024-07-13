
let puntaje = parseInt(localStorage.getItem('puntaje'), 10) || 0; // Inicializamos el puntaje
let puntosPartida = 10; // Puntos por defecto
let temporizador;
let nombreJugador = obtenerNombreUsuario();

// Inicializa las estadísticas del usuario si no existen
let estadisticas = JSON.parse(localStorage.getItem('estadisticas')) || { ganadas: 0, perdidas: 0, empatadas: 0 };

function actualizarEstadisticas(resultado) {
    if (resultado === 'ganada') {
        estadisticas.ganadas++;
    } else if (resultado === 'perdida') {
        estadisticas.perdidas++;
    } else if (resultado === 'empatada') {
        estadisticas.empatadas++;
    }
    localStorage.setItem('estadisticas', JSON.stringify(estadisticas));
}

function mostrarEstadisticas() {
    alert(`Partidas ganadas: ${estadisticas.ganadas}\nPartidas perdidas: ${estadisticas.perdidas}\nPartidas empatadas: ${estadisticas.empatadas}`);
}

function generarNombreAleatorio() {
    const consonantes = 'bcdfghjklmnpqrstvwxyz';
    const vocales = 'aeiou';
    const longitudNombre = 7;

    function letraAleatoria(cadena) {
        return cadena[Math.floor(Math.random() * cadena.length)];
    }

    let nombre = letraAleatoria(consonantes).toUpperCase();
    for (let i = 1; i < longitudNombre; i++) {
        nombre += (i % 2 === 0) ? letraAleatoria(vocales) : letraAleatoria(consonantes);
    }

    return nombre;
}

function elegir(eleccionJugador) {
    if (puntaje < puntosPartida) {
        alert("No tienes suficientes puntos para jugar por esta cantidad.");
        return;
    }

    const nombreMaquina = generarNombreAleatorio();
    const eleccionMaquina = generarEleccionAleatoria();

    const resultado = determinarGanador(eleccionJugador, eleccionMaquina);

    document.getElementById('resultado').innerText = `${nombreJugador} escogió ${eleccionJugador}. ${nombreMaquina} escogió ${eleccionMaquina}. ${resultado}`;

    actualizarPuntaje(resultado);
}

function generarEleccionAleatoria() {
    const eleccionesPosibles = ['piedra', 'papel', 'tijera'];
    return eleccionesPosibles[Math.floor(Math.random() * eleccionesPosibles.length)];
}

function obtenerNombreUsuario() {
    return localStorage.getItem('nombreUsuario') || "Jugador Anónimo";
}

function determinarGanador(eleccionJugador, eleccionMaquina) {
    if (eleccionJugador === eleccionMaquina) {
        actualizarEstadisticas('empatada');
        return 'Es un empate.';
    } else if (
        (eleccionJugador === 'piedra' && eleccionMaquina === 'tijera') ||
        (eleccionJugador === 'papel' && eleccionMaquina === 'piedra') ||
        (eleccionJugador === 'tijera' && eleccionMaquina === 'papel')
    ) {
        puntaje = parseInt(puntaje) + parseInt(puntosPartida); // Ganas, sumamos los puntos de la partida
        actualizarEstadisticas('ganada');
        return `¡Ganaste! Sumas ${puntosPartida} puntos.`;
    } else {
        puntaje = Math.max(0, puntaje - puntosPartida); // Restamos los puntos de la partida, pero aseguramos que el puntaje no sea negativo
        actualizarEstadisticas('perdida');
        return `¡Perdiste!. Pierdes ${puntosPartida} puntos.`;
    }
}

function actualizarPuntaje(resultado) {
    let puntosSpan = document.getElementById('puntos');
    puntosSpan.innerText = puntaje;
  
    // Guardar el puntaje actual
    localStorage.setItem('puntaje', puntaje);
  
    // Obtener y actualizar el máximo puntaje
    let maxPuntaje = parseInt(localStorage.getItem('maxPuntaje')) || 0;
    if (puntaje > maxPuntaje) {
      localStorage.setItem('maxPuntaje', puntaje);
    }
}

function establecerPuntos(puntos) {
    puntosPartida = puntos;
    alert(`Ahora estás jugando por ${puntosPartida} puntos.`);
}

function ganarPuntos() {
    puntaje = parseInt(localStorage.getItem('puntaje')) || 0;

    let contador = 30;

    document.getElementById('contador').innerText = contador;

    document.querySelectorAll('button').forEach(function(button) {
        button.disabled = true;
    });

    temporizador = setInterval(function() {
        contador--;

        if (contador > 0) {
            document.getElementById('contador').innerText = contador;
        } else {
            clearInterval(temporizador);
            temporizador = null;
            puntaje += 100;

            localStorage.setItem('puntaje', puntaje);

            document.getElementById('puntos').innerText = puntaje;
            document.getElementById('contador').innerText = '';
            alert("¡Ganaste 100 puntos!");

            document.querySelectorAll('button').forEach(function(button) {
                button.disabled = false;
            });
        }
    }, 1000);
}

const nombreUsuario = localStorage.getItem('nombreUsuario');
const imagenUsuario = localStorage.getItem('fotoPerfil');

if (nombreUsuario) {
    const h2Element = document.createElement('h2');
    h2Element.textContent = 'Hola, ' + nombreUsuario + '. ¡Bienvenido!';
    document.getElementById('mensajeBienvenida').appendChild(h2Element);
}

if (imagenUsuario) {
    const imgElement = document.createElement('img');
    imgElement.src = imagenUsuario;
    imgElement.style.width = '100px';
    imgElement.style.height = '100px';
    imgElement.style.borderRadius = '50%';
    document.getElementById('imagenBienvenida').appendChild(imgElement);
}

document.addEventListener('DOMContentLoaded', function() {
    puntaje = parseInt(localStorage.getItem('puntaje')) || 0;
    document.getElementById('puntos').innerText = puntaje;
    cargarArtefactoEquipado();
});

function obtenerArtefactoEquipado() {
    return JSON.parse(localStorage.getItem('artefactosEquipados')) || [];
}

function cargarArtefactoEquipado() {
    const artefactoEquipadoArray = obtenerArtefactoEquipado();
    const imagenArtefacto = document.getElementById('imagenArtefacto');
    if (imagenArtefacto && artefactoEquipadoArray.length > 0) {
        const artefactoEquipado = artefactoEquipadoArray[0]; // Asumiendo que solo hay un artefacto equipado
        const imagenesEquipadas = JSON.parse(localStorage.getItem('imagenesEquipadas')) || {};
        if (imagenesEquipadas[artefactoEquipado]) {
            imagenArtefacto.src = imagenesEquipadas[artefactoEquipado];
            imagenArtefacto.alt = artefactoEquipado;
        }
    } else {
        imagenArtefacto.src = 'ruta/de/imagen/vacia.jpg'; // Imagen predeterminada si no hay artefacto equipado
        imagenArtefacto.alt = 'Ninguno';
    }
}

// Llama a la función para cargar el artefacto equipado al cargar la página
document.addEventListener('DOMContentLoaded', cargarArtefactoEquipado);




