// ... (mantener las variables globales y la configuración existente)

// Añadir nuevos elementos del DOM
const gameCodeInput = document.getElementById('game-code-input');
const joinGameByCodeBtn = document.getElementById('join-game-by-code');

// ... (mantener las funciones existentes)

// Modificar la función de crear juego para generar un código corto
createGameBtn.addEventListener('click', () => {
    isHost = true;
    gameId = generateGameId();
    initializePeerConnection();
    setupScreen.style.display = 'none';
    waitingRoom.style.display = 'block';
    connectionStatus.textContent = 'Esperando que el otro jugador se conecte...';
    gameIdDisplay.textContent = gameId;
    broadcastGame();
});

// Añadir evento para unirse por código
joinGameByCodeBtn.addEventListener('click', () => {
    const code = gameCodeInput.value.trim().toUpperCase();
    if (code.length !== 6) {
        alert('Por favor, introduce un código válido de 6 caracteres.');
        return;
    }
    gameId = code;
    isHost = false;
    initializePeerConnection();
    setupScreen.style.display = 'none';
    waitingRoom.style.display = 'block';
    connectionStatus.textContent = 'Conectando al anfitrión...';
    sendJoinRequest(gameId);
});

// Modificar la función generateGameId para crear un código de 6 caracteres
function generateGameId() {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Modificar la función sendJoinRequest para manejar tanto el descubrimiento automático como el código manual
function sendJoinRequest(gameId) {
    broadcastChannel.postMessage({
        type: 'join-request',
        gameId: gameId
    });
    // Iniciar un temporizador para manejar el caso en que no haya respuesta
    setTimeout(() => {
        if (localPeerConnection.connectionState !== 'connected') {
            connectionStatus.textContent = 'No se pudo conectar. Verifica el código e intenta de nuevo.';
            setupScreen.style.display = 'block';
            waitingRoom.style.display = 'none';
        }
    }, 10000); // 10 segundos de tiempo de espera
}

// ... (mantener el resto de las funciones existentes)

// Modificar el manejador de mensajes de Broadcast Channel para incluir el nuevo flujo
broadcastChannel.onmessage = async (event) => {
    const message = event.data;
    switch (message.type) {
        // ... (mantener los casos existentes)
        case 'join-request':
            if (isHost && message.gameId === gameId) {
                const offer = await localPeerConnection.createOffer();
                await localPeerConnection.setLocalDescription(offer);
                broadcastChannel.postMessage({
                    type: 'offer',
                    offer: offer,
                    gameId: gameId
                });
            }
            break;
        // ... (mantener el resto de los casos)
    }
};

// ... (mantener el resto del código existente)
