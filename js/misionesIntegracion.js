// js/misionesIntegracion.js
import sistemaMisiones from './misiones.js';

// Escucha los eventos de resultado del juego
document.addEventListener('partidaFinalizada', (evento) => {
  const resultado = evento.detail.resultado;
  if (resultado === 'ganada') {
    sistemaMisiones.actualizarProgreso('gana10Partidas', 1);
    sistemaMisiones.actualizarProgreso('gana5Seguidas', 1);
  } else {
    sistemaMisiones.actualizarProgreso('gana5Seguidas', 0);
  }
});

// Escucha los eventos de recompensa de misiones
document.addEventListener('misionCompletada', (evento) => {
  const recompensa = evento.detail.recompensa;
  // Agrega la recompensa al puntaje del jugador
  console.log(`Recompensa de misión: ${recompensa} puntos`);
});

// Lógica para simular la finalización de una partida (para fines de demostración)
function finalizarPartida(resultado) {
  const eventoPartida = new CustomEvent('partidaFinalizada', { detail: { resultado } });
  document.dispatchEvent(eventoPartida);
}

// Simular una partida ganada
finalizarPartida('ganada');

// Simular una partida perdida
finalizarPartida('perdida');

