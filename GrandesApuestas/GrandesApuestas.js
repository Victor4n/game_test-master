let jugadorActual = 1;
let tiempoRestante = 30;
let temporizador;
let combinacionActual = ['','',''];
let puntos = [0, 0];
let codigoPartida = '';
let modoJuego = ''; // 'creador' o 'invitado'
let fasePPT = true;
let seleccionPPT = '';
let jugadoresListos = [false, false];

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('crearPartida').addEventListener('click', crearPartida);
    document.getElementById('unirsePartida').addEventListener('click', unirsePartida);
    document.getElementById('listo').addEventListener('click', jugadorListo);
    document.getElementById('finalizar').addEventListener('click', finalizarTurno);

    document.querySelectorAll('.ppt').forEach(boton => {
        boton.addEventListener('click', seleccionarPPT);
    });

    document.querySelectorAll('.casilla').forEach(casilla => {
        casilla.addEventListener('click', seleccionarCasilla);
    });

    // Verificar si hay un código de partida en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const codigoEnURL = urlParams.get('codigo');
    if (codigoEnURL) {
        document.getElementById('codigoUnirse').value = codigoEnURL;
        unirsePartida();
    }
});

function crearPartida() {
    const monto = document.getElementById('montoApuesta').value;
    const nickname = document.getElementById('nickname').value;
    if (monto % 100 !== 0 || monto < 300) {
        alert('El monto debe ser múltiplo de 100 y mayor o igual a 300');
        return;
    }
    if (!nickname) {
        alert('Por favor, ingresa un nickname');
        return;
    }
    codigoPartida = Math.random().toString(36).substr(2, 6).toUpperCase();
    modoJuego = 'creador';
    
    // Crear URL con el código de partida
    const nuevaURL = `${window.location.origin}${window.location.pathname}?codigo=${codigoPartida}`;
    
    // Mostrar el código y la URL para compartir
    alert(`Tu código de partida es: ${codigoPartida}\nComparte esta URL con tu oponente: ${nuevaURL}`);
    
    const partidaInfo = {
        codigo: codigoPartida,
        monto: monto,
        jugadores: [nickname, ''],
        jugadorActual: 1
    };
    localStorage.setItem('partidaGrandesApuestas', JSON.stringify(partidaInfo));
    mostrarSalaEspera();
}

function unirsePartida() {
    const codigo = document.getElementById('codigoUnirse').value.toUpperCase();
    const nickname = document.getElementById('nickname').value;
    if (!nickname) {
        alert('Por favor, ingresa un nickname');
        return;
    }
    
    // Verificar si existe una partida con ese código
    const partidaGuardada = JSON.parse(localStorage.getItem('partidaGrandesApuestas'));
    if (partidaGuardada && partidaGuardada.codigo === codigo) {
        codigoPartida = codigo;
        modoJuego = 'invitado';
        partidaGuardada.jugadores[1] = nickname;
        localStorage.setItem('partidaGrandesApuestas', JSON.stringify(partidaGuardada));
        mostrarSalaEspera();
    } else {
        // Si no existe localmente, crear una nueva partida como invitado
        const nuevaPartida = {
            codigo: codigo,
            monto: 0, // El monto se actualizará cuando el creador inicie la partida
            jugadores: ['', nickname],
            jugadorActual: 1
        };
        localStorage.setItem('partidaGrandesApuestas', JSON.stringify(nuevaPartida));
        modoJuego = 'invitado';
        mostrarSalaEspera();
    }
}

function mostrarSalaEspera() {
    document.getElementById('inicio').style.display = 'none';
    document.getElementById('salaEspera').style.display = 'block';
    actualizarSalaEspera();
}

function actualizarSalaEspera() {
    const partidaGuardada = JSON.parse(localStorage.getItem('partidaGrandesApuestas'));
    document.getElementById('codigoPartida').textContent = `Código de partida: ${partidaGuardada.codigo}`;
    document.getElementById('jugador1').textContent = `Jugador 1: ${partidaGuardada.jugadores[0] || 'Esperando...'} ${jugadoresListos[0] ? '(Listo)' : ''}`;
    document.getElementById('jugador2').textContent = `Jugador 2: ${partidaGuardada.jugadores[1] || 'Esperando...'} ${jugadoresListos[1] ? '(Listo)' : ''}`;
}

// ... (el resto del código permanece igual)
function jugadorListo() {
    const jugadorIndex = modoJuego === 'creador' ? 0 : 1;
    jugadoresListos[jugadorIndex] = true;
    const partidaGuardada = JSON.parse(localStorage.getItem('partidaGrandesApuestas'));
    partidaGuardada.jugadoresListos = jugadoresListos;
    localStorage.setItem('partidaGrandesApuestas', JSON.stringify(partidaGuardada));
    actualizarSalaEspera();
    verificarInicioJuego();
}

function verificarInicioJuego() {
    const partidaGuardada = JSON.parse(localStorage.getItem('partidaGrandesApuestas'));
    if (partidaGuardada.jugadoresListos && partidaGuardada.jugadoresListos.every(listo => listo)) {
        iniciarJuego();
    }
}

function iniciarJuego() {
    document.getElementById('salaEspera').style.display = 'none';
    document.getElementById('juego').style.display = 'block';
    document.getElementById('piedrapapeltijera').style.display = 'block';
    actualizarInterfaz();
}

function seleccionarPPT(event) {
    if (!fasePPT) return;
    seleccionPPT = event.target.dataset.opcion;
    document.getElementById('piedrapapeltijera').style.display = 'none';
    document.getElementById('mensaje').textContent = 'Esperando al otro jugador...';
    
    if (modoJuego === 'creador') {
        localStorage.setItem('seleccionPPTCreador', seleccionPPT);
    } else {
        const seleccionCreador = localStorage.getItem('seleccionPPTCreador');
        determinarGanadorPPT(seleccionCreador, seleccionPPT);
    }
}

function determinarGanadorPPT(seleccion1, seleccion2) {
    const resultado = (seleccion1 === seleccion2) ? 'empate' :
        (seleccion1 === 'piedra' && seleccion2 === 'tijera') ||
        (seleccion1 === 'papel' && seleccion2 === 'piedra') ||
        (seleccion1 === 'tijera' && seleccion2 === 'papel') ? 'gana1' : 'gana2';

    if (resultado === 'empate') {
        document.getElementById('mensaje').textContent = 'Empate en PPT. Vuelvan a jugar.';
        document.getElementById('piedrapapeltijera').style.display = 'block';
    } else {
        fasePPT = false;
        jugadorActual = resultado === 'gana1' ? 1 : 2;
        const partidaGuardada = JSON.parse(localStorage.getItem('partidaGrandesApuestas'));
        partidaGuardada.jugadorActual = jugadorActual;
        localStorage.setItem('partidaGrandesApuestas', JSON.stringify(partidaGuardada));
        iniciarTurno();
    }
}

function iniciarTurno() {
    reiniciarTablero();
    actualizarInterfaz();
    iniciarTemporizador();
}

function reiniciarTablero() {
    document.querySelectorAll('.casilla').forEach(casilla => {
        casilla.style.backgroundImage = 'url("carta-reverso.jpg")';
        casilla.dataset.valor = '';
    });
    combinacionActual = ['','',''];
}

function actualizarInterfaz() {
    const partidaGuardada = JSON.parse(localStorage.getItem('partidaGrandesApuestas'));
    document.getElementById('jugadorActual').textContent = `Turno del Jugador ${partidaGuardada.jugadorActual}`;
    document.getElementById('puntajeJ1').textContent = puntos[0];
    document.getElementById('puntajeJ2').textContent = puntos[1];
}

function iniciarTemporizador() {
    tiempoRestante = 30;
    clearInterval(temporizador);
    temporizador = setInterval(() => {
        tiempoRestante--;
        document.getElementById('temporizador').textContent = `Tiempo restante: ${tiempoRestante}s`;
        if (tiempoRestante <= 0) {
            clearInterval(temporizador);
            finalizarTurnoAutomatico();
        }
    }, 1000);
}

function finalizarTurnoAutomatico() {
    // Si el jugador no ha completado su combinación, se genera una aleatoria
    while (combinacionActual.includes('')) {
        const opciones = ['piedra', 'papel', 'tijera'];
        const indiceVacio = combinacionActual.findIndex(c => c === '');
        const opcionAleatoria = opciones[Math.floor(Math.random() * opciones.length)];
        combinacionActual[indiceVacio] = opcionAleatoria;
        document.querySelectorAll('.casilla')[indiceVacio].style.backgroundImage = `url('${opcionAleatoria}.jpg')`;
    }
    finalizarTurno();
}

function seleccionarCasilla(event) {
    const index = event.target.dataset.index;
    const partidaGuardada = JSON.parse(localStorage.getItem('partidaGrandesApuestas'));
    
    if (
        (modoJuego === 'creador' && partidaGuardada.jugadorActual !== 1) ||
        (modoJuego === 'invitado' && partidaGuardada.jugadorActual !== 2)
    ) {
        return; // No es el turno de este jugador
    }

    if (combinacionActual[index] === '') {
        const opciones = ['piedra', 'papel', 'tijera'];
        const opcionSeleccionada = opciones.find(opcion => !combinacionActual.includes(opcion));
        if (opcionSeleccionada) {
            event.target.style.backgroundImage = `url('${opcionSeleccionada}.jpg')`;
            combinacionActual[index] = opcionSeleccionada;
        }
    }
}

function finalizarTurno() {
    clearInterval(temporizador);
    if (combinacionActual.includes('')) {
        alert('Debes completar todas las casillas antes de finalizar el turno');
        return;
    }

    const partidaGuardada = JSON.parse(localStorage.getItem('partidaGrandesApuestas'));
    
    if (modoJuego === 'creador' && partidaGuardada.jugadorActual === 1) {
        localStorage.setItem('combinacionJugador1', JSON.stringify(combinacionActual));
        cambiarJugador();
    } else if (modoJuego === 'invitado' && partidaGuardada.jugadorActual === 2) {
        const combinacionJugador1 = JSON.parse(localStorage.getItem('combinacionJugador1'));
        verificarCombinacion(combinacionJugador1, combinacionActual);
    }
}

function verificarCombinacion(combinacion1, combinacion2) {
    if (JSON.stringify(combinacion1) === JSON.stringify(combinacion2)) {
        puntos[1]++;
        document.getElementById('mensaje').textContent = '¡Jugador 2 adivinó la combinación!';
    } else {
        document.getElementById('mensaje').textContent = 'Jugador 2 no adivinó la combinación.';
    }
    
    if (puntos[1] === 2) {
        finalizarJuego(2);
    } else {
        cambiarJugador();
    }
}