
document.addEventListener('DOMContentLoaded', function() {
    let puntaje = parseInt(localStorage.getItem('puntaje')) || 0;
    let puntosSpan = document.getElementById('puntos');
    if (puntosSpan) {
        puntosSpan.textContent = puntaje;
    }
    cargarArtefactoEquipado();
    actualizarBarraExperiencia();
    actualizarClasificaciones();
    cargarImagenPerfil();
});



function abrirPopupPuntos() {
  document.getElementById("popupPuntos").style.display = "block";
}

function cerrarPopupPuntos() {
  document.getElementById("popupPuntos").style.display = "none";
}

function establecerPuntos(puntos) {
  alert("Estás jugando por " + puntos + " puntos");
  cerrarPopupPuntos();
  // Aquí puedes agregar la lógica adicional para establecer los puntos en el juego
}

// Cerrar el popup si se hace clic fuera de él
window.onclick = function(event) {
  if (event.target == document.getElementById("popupPuntos")) {
    cerrarPopupPuntos();
  }
}
let puntaje = parseInt(localStorage.getItem('puntaje'), 10) || 0;
let puntosPartida = 10;
let nombreJugador = obtenerNombreUsuario();
let experiencia = parseInt(localStorage.getItem('experiencia'), 10) || 0;
let nivel = parseInt(localStorage.getItem('nivel'), 10) || 1;
const experienciaPorNivel = 100;

document.addEventListener('DOMContentLoaded', function() {
  const botones = document.querySelectorAll('.btn-opcion');
  botones.forEach(boton => {
    boton.addEventListener('mousedown', iniciarArrastre);
    boton.addEventListener('touchstart', iniciarArrastre, { passive: false });
    
    // Añadir el indicador de liberación
    const indicator = document.createElement('span');
    indicator.className = 'release-indicator';
    indicator.textContent = '(x)';
    boton.appendChild(indicator);
  });

  document.addEventListener('mousemove', moverElemento);
  document.addEventListener('touchmove', moverElemento, { passive: false });
  document.addEventListener('mouseup', soltarElemento);
  document.addEventListener('touchend', soltarElemento);

  actualizarPuntaje();
  cargarArtefactoEquipado();
  actualizarBarraExperiencia();
  actualizarClasificaciones();
  cargarImagenPerfil();
});


let activeElement = null;
let startY = 0;

document.addEventListener('DOMContentLoaded', function() {
  const botones = document.querySelectorAll('.btn-opcion');
  botones.forEach(boton => {
    boton.addEventListener('mousedown', iniciarMovimiento);
    boton.addEventListener('touchstart', iniciarMovimiento, { passive: false });
  });

  document.addEventListener('mousemove', moverElemento);
  document.addEventListener('touchmove', moverElemento, { passive: false });
  document.addEventListener('mouseup', soltarElemento);
  document.addEventListener('touchend', soltarElemento);
});

function iniciarMovimiento(e) {
  e.preventDefault();
  activeElement = this.cloneNode(true);
  activeElement.classList.add('moving');
  document.body.appendChild(activeElement);

  const touch = e.type === 'touchstart' ? e.touches[0] : e;
  startY = touch.clientY;

  posicionarElemento(touch.clientX, touch.clientY);
}

function moverElemento(e) {
  if (!activeElement) return;
  e.preventDefault();

  const touch = e.type === 'touchmove' ? e.touches[0] : e;
  posicionarElemento(touch.clientX, touch.clientY);
}

function posicionarElemento(x, y) {
  activeElement.style.position = 'fixed';
  activeElement.style.left = `${x}px`;
  activeElement.style.top = `${y}px`;
  activeElement.style.transform = 'translate(-50%, -50%)';

  const windowHeight = window.innerHeight;
  const releaseThreshold = windowHeight * 0.85; // 15% desde arriba

  if (y < releaseThreshold) {
    activeElement.classList.add('ready-to-release');
  } else {
    activeElement.classList.remove('ready-to-release');
  }
}

function soltarElemento(e) {
    if (!activeElement) return;
  
    const touch = e.type === 'touchend' ? e.changedTouches[0] : e;
    const finalY = touch.clientY;
  
    const windowHeight = window.innerHeight;
    const releaseThreshold = windowHeight * 0.75; // 25% desde arriba
  
    if (finalY < releaseThreshold) {
      const opcion = activeElement.getAttribute('data-opcion');
      activeElement.classList.add('released');
      setTimeout(() => {
        document.body.removeChild(activeElement);
        activeElement = null;
        elegir(opcion);
      }, 300); // Espera 300ms para la animación antes de eliminar el elemento
    } else {
      document.body.removeChild(activeElement);
      activeElement = null;
    }
  }


  
function elegir(eleccionJugador) {
  // Tu lógica existente para procesar la elección del jugador
  console.log(`Jugador eligió: ${eleccionJugador}`);
  // Aquí deberías llamar a tu función existente que maneja la lógica del juego
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
  actualizarExperiencia(resultado);
  actualizarPuntajeBot(nombreMaquina, resultado.includes('Ganaste') ? 'perdida' : resultado.includes('Perdiste') ? 'ganada' : 'empatada');
  actualizarClasificaciones();
}

// ... (el resto de las funciones permanecen igual)
// Inicializa las estadísticas del usuario si no existen
let estadisticas = JSON.parse(localStorage.getItem('estadisticas')) || { ganadas: 0, perdidas: 0, empatadas: 0 };

// Inicializa el progreso de los logros si no existe
let progresoLogros = JSON.parse(localStorage.getItem('progresoLogros')) || { victorias: 0, victoriasConsecutivas: 0 };

function actualizarEstadisticas(resultado) {
    if (resultado === 'ganada') {
        estadisticas.ganadas++;
        progresoLogros.victorias++;
        progresoLogros.victoriasConsecutivas++;
        // Verifica y guarda logros si es necesario
        guardarLogros();
    } else if (resultado === 'perdida') {
        estadisticas.perdidas++;
        progresoLogros.victoriasConsecutivas = 0; // Resetea las victorias consecutivas al perder
    } else if (resultado === 'empatada') {
        estadisticas.empatadas++;
    }
    localStorage.setItem('estadisticas', JSON.stringify(estadisticas));
    localStorage.setItem('progresoLogros', JSON.stringify(progresoLogros));
}

function mostrarEstadisticas() {
    alert(`Partidas ganadas: ${estadisticas.ganadas}\nPartidas perdidas: ${estadisticas.perdidas}\nPartidas empatadas: ${estadisticas.empatadas}`);
}

function obtenerBots() {
    return [
        { nombre: 'Byte Bromista', imagen: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: 0 },
        { nombre: 'Chispa Cibernética', imagen: 'https://images.pexels.com/photos/157661/young-woman-shooting-model-157661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: 0 },
        { nombre: 'Risueño Robot', imagen: 'https://images.pexels.com/photos/935969/pexels-photo-935969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: 0 },
        { nombre: 'Bit Alegre', imagen: 'https://images.pexels.com/photos/2412691/pexels-photo-2412691.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: 0 },
        { nombre: 'Código Chispeante', imagen: 'https://images.pexels.com/photos/1205716/pexels-photo-1205716.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: 0 },
        { nombre: 'Tecno Travesura', imagen: 'https://images.pexels.com/photos/1089038/pexels-photo-1089038.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: 0 },
        { nombre: 'Ráfaga Risueña', imagen: 'https://images.pexels.com/photos/13081260/pexels-photo-13081260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: 0 },
        { nombre: 'Circuit Sonrisa', imagen: 'https://images.pexels.com/photos/13326901/pexels-photo-13326901.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: 0 },
        { nombre: 'Bytes Divertidos', imagen: 'https://images.pexels.com/photos/3483800/pexels-photo-3483800.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: 0 },
        { nombre: 'Circuit Sonrisa', imagen: 'https://images.pexels.com/photos/3483800/pexels-photo-3483800.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: 0 },
        { nombre: 'Bot Feliz', imagen: 'https://images.pexels.com/photos/4587663/pexels-photo-4587663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: 0 },
        { nombre: 'Bot Contento', imagen: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: 0 },
        { nombre: 'Bot Radiante', imagen: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: 0 },
        { nombre: 'Bot Alegre', imagen: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: 0 },
        { nombre: 'Bot Jubiloso', imagen: 'https://images.pexels.com/photos/1820961/pexels-photo-1820961.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: 0 },
        { nombre: 'Bot Encantado', imagen: 'https://images.pexels.com/photos/1052548/pexels-photo-1052548.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: 0 },
        { nombre: 'Bot Satisfecho', imagen: 'https://images.pexels.com/photos/837140/pexels-photo-837140.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: 0 },
        { nombre: 'Bot Eufórico', imagen: 'https://images.pexels.com/photos/508192/pexels-photo-508192.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: 0 },
        { nombre: 'Bot Animado', imagen: 'https://images.pexels.com/photos/720598/pexels-photo-720598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: 0 },
        { nombre: 'Bot Entusiasta', imagen: 'https://images.pexels.com/photos/939842/pexels-photo-939842.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: 0 },
    ];
}

function actualizarPuntajeBot(nombreBot, resultado) {
    let puntajeBot = parseInt(localStorage.getItem(`${nombreBot}_puntaje`), 10) || 0;
    if (resultado === 'ganada') {
        puntajeBot += puntosPartida;
    } else if (resultado === 'perdida') {
        puntajeBot = Math.max(0, puntajeBot - puntosPartida);
    }
    localStorage.setItem(`${nombreBot}_puntaje`, puntajeBot.toString());
}

// Por ejemplo, cuando 'Byte Bromista' gana:
actualizarPuntajeBot('Byte Bromista', 10);

// O cuando 'Chispa Cibernética' gana:
actualizarPuntajeBot('Chispa Cibernética', 10);

actualizarPuntajeBot('Risueño Robot', 10);

actualizarPuntajeBot('Risueño Robot', 10);
actualizarPuntajeBot('Bit Alegre', 10);
actualizarPuntajeBot('Código Chispeante', 10);
actualizarPuntajeBot('Tecno Travesura', 10);
actualizarPuntajeBot('Ráfaga Risueña', 10);
actualizarPuntajeBot('Circuit Sonrisa', 10);
actualizarPuntajeBot('Circuit Sonrisa', 10);
actualizarPuntajeBot('Bot Feliz', 10);
actualizarPuntajeBot('Bot Contento', 10);
actualizarPuntajeBot('Bot Radiante', 10);
actualizarPuntajeBot('Bot Alegre', 10);
actualizarPuntajeBot('Bot Jubiloso', 10);
actualizarPuntajeBot('Bot Encantado', 10);
actualizarPuntajeBot('Bot Satisfecho', 10);
actualizarPuntajeBot('Bot Eufórico', 10);
actualizarPuntajeBot('Bot Animado', 10);
actualizarPuntajeBot('Bot Entusiasta', 10);
actualizarPuntajeBot('Bytes Divertidos', 10);


function actualizarClasificaciones() {
    const clasificaciones = [
        { nombre: obtenerNombreUsuario(), imagen: localStorage.getItem('fotoPerfil') || 'ruta/de/imagen/vacia.jpg', puntuacion: puntaje }
    ].concat(obtenerBots().map(bot => ({
        ...bot,
        puntuacion: parseInt(localStorage.getItem(`${bot.nombre}_puntaje`), 10) || 0
    })));

    clasificaciones.sort((a, b) => b.puntuacion - a.puntuacion);

    // Actualizar la tabla de clasificaciones en el DOM
    document.addEventListener('DOMContentLoaded', function() {
        const tabla = document.getElementById('tablaClasificaciones');
        if (tabla) {
            const cuerpoTabla = tabla.querySelector('tbody');
            if (cuerpoTabla) {
                cuerpoTabla.innerHTML = '';
                clasificaciones.forEach((clasificacion, index) => {
                    const fila = document.createElement('tr');
                    fila.dataset.nombre = clasificacion.nombre;
                    fila.innerHTML = `<td>${index + 1}</td><td><img src="${clasificacion.imagen}" width="40" height="40"></td><td>${clasificacion.nombre}</td><td>${clasificacion.puntuacion}</td>`;
                    cuerpoTabla.appendChild(fila);
                });
            }
        }
    });
}


// Función para generar un nombre aleatorio de bot
function generarNombreAleatorio() {
    const bots = obtenerBots();
    const indiceAleatorio = Math.floor(Math.random() * bots.length);
    return bots[indiceAleatorio].nombre;
}

// Función para generar una elección aleatoria de piedra, papel o tijeras
function generarEleccionAleatoria() {
    const opciones = ['piedra', 'papel', 'tijeras'];
    const indiceAleatorio = Math.floor(Math.random() * opciones.length);
    return opciones[indiceAleatorio];
}

// Integrar la actualización del puntaje del bot en la función elegir
function elegir(eleccionJugador) {
    let puntaje = parseInt(localStorage.getItem('puntaje')) || 0;
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
    actualizarInterfazLogros();
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
    let puntosTotal = parseInt(localStorage.getItem('puntaje')) || 0;
    
    if (resultado.includes('Ganaste')) {
        puntosTotal += puntosPartida;
    } else if (resultado.includes('Perdiste')) {
        puntosTotal = Math.max(0, puntosTotal - puntosPartida);
    }
    
    localStorage.setItem('puntaje', puntosTotal);
    
    let puntosSpan = document.getElementById('puntos');
    if (puntosSpan) {
        puntosSpan.textContent = puntosTotal;
    }
    
    // Actualizar máximo puntaje
    let maxPuntaje = parseInt(localStorage.getItem('maxPuntaje')) || 0;
    if (puntosTotal > maxPuntaje) {
        localStorage.setItem('maxPuntaje', puntosTotal);
    }
}

function actualizarExperiencia(resultado) {
    let puntosExperiencia = 0;
    switch (puntosPartida) {
        case 10:
            puntosExperiencia = resultado === 'ganada' ? 10 : resultado === 'empatada' ? 5 : 3;
            break;
        case 20:
            puntosExperiencia = resultado === 'ganada' ? 20 : resultado === 'empatada' ? 10 : 5;
            break;
        case 50:
            puntosExperiencia = resultado === 'ganada' ? 50 : resultado === 'empatada' ? 20 : 10;
            break;
        case 100:
            puntosExperiencia = resultado === 'ganada' ? 100 : resultado === 'empatada' ? 50 : 25;
            break;
        case 200:
            puntosExperiencia = resultado === 'ganada' ? 200 : resultado === 'empatada' ? 100 : 50;
            break;
    }

    experiencia += puntosExperiencia;
    while (experiencia >= experienciaPorNivel) {
        experiencia -= experienciaPorNivel;
        nivel++;
    }

    localStorage.setItem('experiencia', experiencia);
    localStorage.setItem('nivel', nivel);

    actualizarBarraExperiencia();
}

function actualizarBarraExperiencia() {
    const barraExperiencia = document.getElementById('barraExperiencia');
    const experienciaActual = document.getElementById('experienciaActual');
    const experienciaMaxima = document.getElementById('experienciaMaxima');
    const nivelSpan = document.getElementById('nivel');

    experienciaActual.innerText = experiencia;
    experienciaMaxima.innerText = experienciaPorNivel;
    nivelSpan.innerText = nivel;
    barraExperiencia.style.width = (experiencia / experienciaPorNivel) * 100 + '%';
}

function guardarLogros() {
    let logros = JSON.parse(localStorage.getItem('logros')) || {};

    const logrosDefinidos = [
        { nombre: 'Primera Victoria', descripcion: 'Gana tu primera partida.', objetivo: 1, tipo: 'victorias' },
        { nombre: 'Diez Victorias', descripcion: 'Gana diez partidas.', objetivo: 10, tipo: 'victorias' },
        { nombre: 'Invicto', descripcion: 'Gana cinco partidas consecutivas.', objetivo: 5, tipo: 'victoriasConsecutivas' },
    ];

    logrosDefinidos.forEach(logro => {
        if (progresoLogros[logro.tipo] >= logro.objetivo && !logros[logro.nombre]) {
            logros[logro.nombre] = true;
            alert(`¡Logro obtenido: ${logro.nombre}! ${logro.descripcion}`);
        }
    });

    localStorage.setItem('logros', JSON.stringify(logros));
    localStorage.setItem('progresoLogros', JSON.stringify(progresoLogros)); // Asegúrate de guardar el progreso también
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


document.addEventListener('DOMContentLoaded', function() {
    puntaje = parseInt(localStorage.getItem('puntaje')) || 0;
    document.getElementById('puntos').innerText = puntaje;
    cargarArtefactoEquipado();
    actualizarBarraExperiencia();
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

function cargarImagenPerfil() {
    const imagenPerfil = document.getElementById('imagenPerfil');
    const nombreJugador = document.getElementById('nombreJugador');
    
    if (imagenPerfil && nombreJugador) {
        const urlImagenPerfil = localStorage.getItem('fotoPerfil');
        const nombre = localStorage.getItem('nombreUsuario') || 'Jugador';
        
        if (urlImagenPerfil) {
            imagenPerfil.src = urlImagenPerfil;
        } else {
            imagenPerfil.src = 'ruta/de/imagen/predeterminada.jpg'; // Asegúrate de tener una imagen predeterminada
        }
        
        nombreJugador.textContent = nombre;
    }
}

// Llama a la función para cargar el artefacto equipado al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    puntaje = parseInt(localStorage.getItem('puntaje')) || 0;
    document.getElementById('puntos').innerText = puntaje;
    cargarArtefactoEquipado();
    actualizarBarraExperiencia();
    actualizarClasificaciones();
    cargarImagenPerfil(); // Agregamos esta línea
});
