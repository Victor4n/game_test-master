import { actualizarPuntaje, actualizarExperiencia, actualizarPuntajeBot, actualizarClasificaciones, determinarGanador, generarNombreAleatorio, obtenerNombreUsuario } from './utils.js';
import sistemaMisiones from './js/misiones.js';
import { mostrarMisiones } from './js/misionesUI.js';

let puntaje = parseInt(localStorage.getItem('puntaje'), 10) || 0;
let puntosPartida = 10; // Puntos por defecto
let nombreJugador = obtenerNombreUsuario();

const opciones = ["piedra", "papel", "tijeras"];

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
    actualizarExperiencia(resultado);
    actualizarPuntajeBot(nombreMaquina, resultado.includes('Ganaste') ? 'perdida' : resultado.includes('Perdiste') ? 'ganada' : 'empatada');
    actualizarClasificaciones();
}

export { elegir };