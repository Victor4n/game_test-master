// misionesUI.js

import sistemaMisiones from './misiones.js';

function mostrarMisiones() {
    const progreso = sistemaMisiones.progresoMisiones;

    // Ejemplo de actualización de la interfaz de usuario
    document.getElementById('victoriasMision').innerText = `${progreso.victorias} / 10`;
    document.getElementById('victoriasConsecutivasMision').innerText = `${progreso.victoriasConsecutivas} / 10`;
    document.getElementById('tiempoJugadoMision').innerText = `${progreso.tiempoJugado} / 30 min`;
}

export { mostrarMisiones };


