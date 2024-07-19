document.addEventListener('DOMContentLoaded', function() {
    const progresoLogros = JSON.parse(localStorage.getItem('progresoLogros')) || { victorias: 0, victoriasConsecutivas: 0 };
    
    const logrosDefinidos = [
        { nombre: 'Primera Victoria', descripcion: 'Gana tu primera partida.', objetivo: 1, tipo: 'victorias' },
        { nombre: 'Diez Victorias', descripcion: 'Gana diez partidas.', objetivo: 10, tipo: 'victorias' },
        { nombre: 'Cinco Victorias Consecutivas', descripcion: 'Gana cinco partidas consecutivas.', objetivo: 5, tipo: 'victoriasConsecutivas' }
    ];

    const contenedorLogros = document.getElementById('contenedorLogros');

    logrosDefinidos.forEach(logro => {
        const logroElemento = document.createElement('div');
        logroElemento.className = 'logro ' + (progresoLogros[logro.tipo] >= logro.objetivo ? 'logro-obtenido' : 'logro-no-obtenido');

        const logroTexto = document.createElement('span');
        const progreso = Math.min(progresoLogros[logro.tipo], logro.objetivo); // Limitar el progreso al objetivo
        logroTexto.textContent = `${logro.nombre}: ${logro.descripcion} (${progreso}/${logro.objetivo})`;

        logroElemento.appendChild(logroTexto);
        contenedorLogros.appendChild(logroElemento);
    });
});

function actualizarProgresoLogros(tipo, incremento) {
    let progresoLogros = JSON.parse(localStorage.getItem('progresoLogros')) || { victorias: 0, victoriasConsecutivas: 0 };

    progresoLogros[tipo] = Math.min(progresoLogros[tipo] + incremento, logrosDefinidos.find(logro => logro.tipo === tipo).objetivo); // Asegurarse de no superar el objetivo

    localStorage.setItem('progresoLogros', JSON.stringify(progresoLogros));
    actualizarInterfazLogros();
}

function actualizarInterfazLogros() {
    const progresoLogros = JSON.parse(localStorage.getItem('progresoLogros')) || { victorias: 0, victoriasConsecutivas: 0 };

    logrosDefinidos.forEach(logro => {
        const logroElemento = document.querySelector(`.logro:contains("${logro.nombre}")`);
        const progreso = Math.min(progresoLogros[logro.tipo], logro.objetivo); // Limitar el progreso al objetivo
        logroElemento.className = 'logro ' + (progreso >= logro.objetivo ? 'logro-obtenido' : 'logro-no-obtenido');
        logroElemento.querySelector('span').textContent = `${logro.nombre}: ${logro.descripcion} (${progreso}/${logro.objetivo})`;
    });
}

