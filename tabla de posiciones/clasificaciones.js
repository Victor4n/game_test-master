document.addEventListener('DOMContentLoaded', function() {
    // Obtener el puntaje del usuario desde localStorage o establecer 0 si no existe
    const puntajeUsuario = parseInt(localStorage.getItem('puntaje'), 10) || 0;
    const imagenUsuario = localStorage.getItem('fotoPerfil') || 'ruta/de/imagen/vacia.jpg'; // Imagen predeterminada si no hay imagen guardada

    // Datos de la clasificación, incluyendo el usuario y los bots
    const obtenerNombreUsuario = () => {
        return localStorage.getItem('nombreUsuario') || "Jugador Anónimo";
    };

    const nombreUsuario = obtenerNombreUsuario();

    let clasificaciones = [
        { nombre: nombreUsuario, imagen: imagenUsuario, puntuacion: puntajeUsuario },
        { nombre: 'Byte Bromista', imagen: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: parseInt(localStorage.getItem('Byte Bromista_puntaje'), 10) || 0 },
        { nombre: 'Chispa Cibernética', imagen: 'https://images.pexels.com/photos/157661/young-woman-shooting-model-157661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: parseInt(localStorage.getItem('Chispa Cibernética_puntaje'), 10) || 0 },
        { nombre: 'Risueño Robot', imagen: 'https://images.pexels.com/photos/935969/pexels-photo-935969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: parseInt(localStorage.getItem('Risueño Robot_puntaje'), 10) || 0 },
        { nombre: 'Bit Alegre', imagen: 'https://images.pexels.com/photos/2412691/pexels-photo-2412691.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: parseInt(localStorage.getItem('Bit Alegre_puntaje'), 10) || 0 },
        { nombre: 'Código Chispeante', imagen: 'https://images.pexels.com/photos/1205716/pexels-photo-1205716.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: parseInt(localStorage.getItem('Código Chispeante_puntaje'), 10) || 0 },
        { nombre: 'Tecno Travesura', imagen: 'https://images.pexels.com/photos/1089038/pexels-photo-1089038.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: parseInt(localStorage.getItem('Tecno Travesura_puntaje'), 10) || 0 },
        { nombre: 'Ráfaga Risueña', imagen: 'https://images.pexels.com/photos/13081260/pexels-photo-13081260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: parseInt(localStorage.getItem('Ráfaga Risueña_puntaje'), 10) || 0 },
        { nombre: 'Circuit Sonrisa', imagen: 'https://images.pexels.com/photos/13326901/pexels-photo-13326901.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: parseInt(localStorage.getItem('Circuit Sonrisa_puntaje'), 10) || 0 },
        { nombre: 'Bytes Divertidos', imagen: 'https://images.pexels.com/photos/3483800/pexels-photo-3483800.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: parseInt(localStorage.getItem('Bytes Divertidos_puntaje'), 10) || 0 },
        { nombre: 'Bot Feliz', imagen: 'https://images.pexels.com/photos/4587663/pexels-photo-4587663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: parseInt(localStorage.getItem('Bot Feliz_puntaje'), 10) || 0 },
        { nombre: 'Bot Contento', imagen: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: parseInt(localStorage.getItem('Bot Contento_puntaje'), 10) || 0 },
        { nombre: 'Bot Radiante', imagen: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: parseInt(localStorage.getItem('Bot Radiante_puntaje'), 10) || 0 },
        { nombre: 'Bot Alegre', imagen: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: parseInt(localStorage.getItem('Bot Alegre_puntaje'), 10) || 0 },
        { nombre: 'Bot Jubiloso', imagen: 'https://images.pexels.com/photos/1820961/pexels-photo-1820961.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: parseInt(localStorage.getItem('Bot Jubiloso_puntaje'), 10) || 0 },
        { nombre: 'Bot Encantado', imagen: 'https://images.pexels.com/photos/1052548/pexels-photo-1052548.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: parseInt(localStorage.getItem('Bot Encantado_puntaje'), 10) || 0 },
        { nombre: 'Bot Satisfecho', imagen: 'https://images.pexels.com/photos/837140/pexels-photo-837140.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: parseInt(localStorage.getItem('Bot Satisfecho_puntaje'), 10) || 0 },
        { nombre: 'Bot Eufórico', imagen: 'https://images.pexels.com/photos/508192/pexels-photo-508192.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: parseInt(localStorage.getItem('Bot Eufórico_puntaje'), 10) || 0 },
        { nombre: 'Bot Animado', imagen: 'https://images.pexels.com/photos/720598/pexels-photo-720598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: parseInt(localStorage.getItem('Bot Animado_puntaje'), 10) || 0 },
        { nombre: 'Bot Entusiasta', imagen: 'https://images.pexels.com/photos/939842/pexels-photo-939842.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', puntuacion: parseInt(localStorage.getItem('Bot Entusiasta_puntaje'), 10) || 0 },
    ];

    clasificaciones.forEach(clasificacion => {
        if (clasificacion.nombre !== nombreUsuario) {
            clasificacion.puntuacion = parseInt(localStorage.getItem(`${clasificacion.nombre}_puntaje`), 10) || 0;
        }
    });
    
    // Luego ordena y actualiza la tabla como lo estás haciendo actualmente

// Ordena las clasificaciones por puntuación de mayor a menor
clasificaciones.sort((a, b) => b.puntuacion - a.puntuacion);

// Actualiza la tabla en el DOM con la clasificación
const tabla = document.getElementById('tablaClasificaciones');
const cuerpoTabla = tabla.querySelector('tbody');

// Itera sobre las clasificaciones y actualiza o crea la fila correspondiente
clasificaciones.forEach((clasificacion, index) => {
    const filaExistente = cuerpoTabla.querySelector(`tr[data-nombre="${clasificacion.nombre}"]`);

    if (filaExistente) {
        // Si la fila ya existe, actualiza su contenido
        filaExistente.innerHTML = `<td>${index + 1}</td><td><img src="${clasificacion.imagen}" width="40" height="40"></td><td>${clasificacion.nombre}</td><td>${clasificacion.puntuacion}</td>`;

        // Aplica estilos según la posición del usuario
        if (clasificacion.nombre === nombreUsuario) {
            filaExistente.classList.add(obtenerEstiloUsuario(index + 1));
        }
    } else {
        // Si la fila no existe, crea una nueva
        const fila = document.createElement('tr');
        fila.dataset.nombre = clasificacion.nombre;
        fila.innerHTML = `<td>${index + 1}</td><td><img src="${clasificacion.imagen}" width="40" height="40"></td><td>${clasificacion.nombre}</td><td>${clasificacion.puntuacion}</td>`;

        // Aplica estilos según la posición del usuario
        if (clasificacion.nombre === nombreUsuario) {
            fila.classList.add(obtenerEstiloUsuario(index + 1));
        }

        cuerpoTabla.appendChild(fila);
    }
});
});

// Función para obtener el estilo del usuario según su posición relativa en la clasificación
function obtenerEstiloUsuario(posicionRelativa) {
if (posicionRelativa === 1) {
    return 'dorado';
} else if (posicionRelativa === 2) {
    return 'plateado';
} else if (posicionRelativa === 3) {
    return 'bronce';
} else {
    return 'normal';
}
}
