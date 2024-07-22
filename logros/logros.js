// Definición de logros con recompensas
const logrosDefinidos = [
    { nombre: 'Primera Victoria', descripcion: 'Gana tu primera partida.', objetivo: 1, tipo: 'victorias', recompensa: 100 },
    { nombre: 'Diez Victorias', descripcion: 'Gana diez partidas.', objetivo: 10, tipo: 'victorias', recompensa: 500 },
    { nombre: 'Cinco Victorias Consecutivas', descripcion: 'Gana cinco partidas consecutivas.', objetivo: 5, tipo: 'victoriasConsecutivas', recompensa: 1000 }
];

document.addEventListener('DOMContentLoaded', function() {
    actualizarInterfazLogros();
});

function actualizarProgresoLogros(tipo, incremento) {
    let progresoLogros = JSON.parse(localStorage.getItem('progresoLogros')) || { victorias: 0, victoriasConsecutivas: 0, puntosTotal: 0 };
    
    progresoLogros[tipo] = (progresoLogros[tipo] || 0) + incremento;
    
    localStorage.setItem('progresoLogros', JSON.stringify(progresoLogros));
    actualizarInterfazLogros();
}

function actualizarInterfazLogros() {
    const progresoLogros = JSON.parse(localStorage.getItem('progresoLogros')) || { victorias: 0, victoriasConsecutivas: 0, puntosTotal: 0 };
    const logrosReclamados = JSON.parse(localStorage.getItem('logrosReclamados')) || {};
    
    const contenedorLogros = document.getElementById('contenedorLogros');
    contenedorLogros.innerHTML = ''; // Limpiar el contenedor antes de actualizarlo
    
    const puntosElement = document.getElementById('puntos');
    const puntosTotal = parseInt(localStorage.getItem('puntaje')) || 0;
    puntosElement.textContent = puntosTotal;
    
    logrosDefinidos.forEach(logro => {
        const logroElemento = document.createElement('div');
        logroElemento.className = 'logro ' + (progresoLogros[logro.tipo] >= logro.objetivo ? 'logro-obtenido' : 'logro-no-obtenido');
        
        const logroTexto = document.createElement('span');
        const progreso = Math.min(progresoLogros[logro.tipo] || 0, logro.objetivo);
        logroTexto.textContent = `${logro.nombre}: ${logro.descripcion} (${progreso}/${logro.objetivo})`;
        
        const recompensaTexto = document.createElement('span');
        recompensaTexto.textContent = `Recompensa: ${logro.recompensa} puntos`;
        
        const reclamarBoton = document.createElement('button');
        reclamarBoton.textContent = 'Reclamar';
        reclamarBoton.onclick = () => reclamarLogro(logro.nombre);
        reclamarBoton.style.display = progresoLogros[logro.tipo] >= logro.objetivo && !logrosReclamados[logro.nombre] ? 'inline-block' : 'none';
        
        logroElemento.appendChild(logroTexto);
        logroElemento.appendChild(recompensaTexto);
        logroElemento.appendChild(reclamarBoton);
        contenedorLogros.appendChild(logroElemento);
    });
    
    actualizarIconoLogros();
}

function reclamarLogro(nombreLogro) {
    let progresoLogros = JSON.parse(localStorage.getItem('progresoLogros')) || { victorias: 0, victoriasConsecutivas: 0, puntosTotal: 0 };
    let logrosReclamados = JSON.parse(localStorage.getItem('logrosReclamados')) || {};
    let puntosTotal = parseInt(localStorage.getItem('puntaje')) || 0;
    
    const logro = logrosDefinidos.find(l => l.nombre === nombreLogro);
    
    if (logro && progresoLogros[logro.tipo] >= logro.objetivo && !logrosReclamados[nombreLogro]) {
        puntosTotal += logro.recompensa;
        logrosReclamados[nombreLogro] = true;
        
        localStorage.setItem('puntaje', puntosTotal);
        localStorage.setItem('logrosReclamados', JSON.stringify(logrosReclamados));
        
        actualizarInterfazLogros();
        alert(`Has reclamado ${logro.recompensa} puntos por completar el logro: ${logro.nombre}`);
    }
}

// Función auxiliar para actualizar el puntaje en el DOM
function actualizarPuntajeEnDOM(puntaje) {
    const puntosElement = document.getElementById('puntos');
    if (puntosElement) {
        puntosElement.textContent = puntaje;
    }
}

function actualizarIconoLogros() {
    const progresoLogros = JSON.parse(localStorage.getItem('progresoLogros')) || { victorias: 0, victoriasConsecutivas: 0, puntosTotal: 0 };
    const logrosReclamados = JSON.parse(localStorage.getItem('logrosReclamados')) || {};
    
    const hayLogrosSinReclamar = logrosDefinidos.some(logro => 
        progresoLogros[logro.tipo] >= logro.objetivo && !logrosReclamados[logro.nombre]
    );
    
    const newAchievementIndicator = document.getElementById('newAchievementIndicator');
    if (newAchievementIndicator) {
        newAchievementIndicator.style.display = hayLogrosSinReclamar ? 'block' : 'none';
    }
}

function inicializarPuntos() {
    const puntosTotal = parseInt(localStorage.getItem('puntaje')) || 0;
    const puntosElement = document.getElementById('puntos');
    if (puntosElement) {
        puntosElement.textContent = puntosTotal;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    inicializarPuntos();
    actualizarInterfazLogros();
});