


// Muestra la barra de carga antes de recargar la página
window.addEventListener('beforeunload', function() {
    document.getElementById('overlay').style.display = 'flex';
  });
  
  // Oculta la barra de carga después de cargar completamente la página
  window.addEventListener('load', function() {
    setTimeout(function() {
      document.getElementById('overlay').style.display = 'none';
    }, 1000); // Ajusta el tiempo según tus necesidades
  });
  
  // Muestra la barra de carga al iniciar la carga de la página
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('overlay').style.display = 'flex';
  });
  
  // Oculta la barra de carga después de cargar completamente la página
  window.addEventListener('load', function() {
    document.getElementById('overlay').style.display = 'none';
  });

// ... (código existente para la barra de carga)

document.addEventListener('DOMContentLoaded', function() {
    let playerProfile = document.getElementById('playerProfile');
    let playerName = document.getElementById('playerName');
    let imagenPrevia = document.getElementById('imagenPrevia');
    let achievements = document.getElementById('achievements');

    // Cargar datos del perfil desde el localStorage
    let nombreUsuarioGuardado = localStorage.getItem('nombreUsuario');
    let fotoPerfilGuardada = localStorage.getItem('fotoPerfil');
    let maxPuntaje = localStorage.getItem('maxPuntaje') || 0;

    // Mostrar datos del perfil guardados, si existen
    if (nombreUsuarioGuardado) {
        playerName.textContent = nombreUsuarioGuardado;
    }

    if (fotoPerfilGuardada) {
        imagenPrevia.src = fotoPerfilGuardada;
    }

    // Añadir eventos de clic
    playerProfile.addEventListener('click', function() {
        window.location.href = '../perfil del jugador/perfilEdicion.html';
    });

    achievements.addEventListener('click', function() {
        window.location.href = '../logros/logros.html';
    });

    // Nuevo código para el indicador de logros
    crearIndicadorLogro();
    actualizarIconoLogros();

    let circularLink = document.getElementById('circularLink');
    
    circularLink.addEventListener('click', function() {
        // Reemplaza 'ruta/a/tu/nueva/pagina.html' con la ruta real de la nueva página
        window.location.href = 'GrandesApuestas/GrandesApuestas.html';
    });
});

function crearIndicadorLogro() {
    const indicador = document.createElement('div');
    indicador.id = 'newAchievementIndicator';
    indicador.style.position = 'absolute';
    indicador.style.width = '15px';
    indicador.style.height = '15px';
    indicador.style.top = '0';
    indicador.style.right = '0';
    indicador.style.backgroundColor = 'red';
    indicador.style.borderRadius = '50%';
    indicador.style.display = 'none';
    const achievements = document.getElementById('achievements');
    achievements.appendChild(indicador);
    animarIndicadorLogro();
}

function animarIndicadorLogro() {
    const indicador = document.getElementById('newAchievementIndicator');
    if (indicador) {
        let scale = 1;
        let growing = true;
        
        setInterval(() => {
            if (growing) {
                scale += 0.05;
                if (scale >= 1.2) growing = false;
            } else {
                scale -= 0.05;
                if (scale <= 1) growing = true;
            }
            indicador.style.transform = `scale(${scale})`;
        }, 50);
    }
}

function actualizarIconoLogros() {
    const progresoLogros = JSON.parse(localStorage.getItem('progresoLogros')) || {};
    const logrosReclamados = JSON.parse(localStorage.getItem('logrosReclamados')) || {};
    const logrosDefinidos = JSON.parse(localStorage.getItem('logrosDefinidos')) || [];
    
    // ... (logs de depuración existentes) ...

    const hayLogrosSinReclamar = logrosDefinidos.some(logro => {
        const progreso = progresoLogros[logro.tipo] || 0;
        const reclamado = logrosReclamados[logro.nombre];
        return progreso >= logro.objetivo && !reclamado;
    });


    const indicador = document.getElementById('newAchievementIndicator');
    if (indicador) {
        indicador.style.visibility = hayLogrosSinReclamar ? 'visible' : 'hidden';
    } else {
        console.log("El elemento indicador no se encontró en el DOM"); // Debugging
    }
}