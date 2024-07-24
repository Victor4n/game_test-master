// Variables globales
let peer;
let conn;
let isHost = false;
let gameId;
const broadcastChannel = new BroadcastChannel('game_discovery');

// Elementos del DOM
const createGameBtn = document.getElementById('create-game');
const joinGameBtn = document.getElementById('join-game');
const joinGameByCodeBtn = document.getElementById('join-game-by-code');
const gameCodeInput = document.getElementById('game-code-input');
const setupScreen = document.getElementById('setup-screen');
const waitingRoom = document.getElementById('waiting-room');
const gameScreen = document.getElementById('game-screen');
const connectionStatus = document.getElementById('connection-status');
const startGameBtn = document.getElementById('start-game');
const gameIdDisplay = document.getElementById('game-id-display');
const availableGamesList = document.getElementById('available-games-list');
const refreshGamesBtn = document.getElementById('refresh-games');

// Configuración de WebRTC
const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]};

// Inicializar conexión peer
function initializePeerConnection() {
    peer = new Peer(undefined, configuration);
    
    peer.on('open', (id) => {
        console.log('Mi ID de peer es: ' + id);
        if (isHost) {
            gameId = generateGameId();
            gameIdDisplay.textContent = gameId;
            broadcastGame();
        }
    });

    peer.on('connection', (connection) => {
        conn = connection;
        setupConnectionListeners();
    });

    peer.on('error', (err) => {
        console.error('Error de peer:', err);
        alert('Error de conexión. Por favor, intenta de nuevo.');
    });
}

// Configurar listeners para la conexión
function setupConnectionListeners() {
    conn.on('open', () => {
        console.log('Conexión establecida');
        connectionStatus.textContent = 'Conectado. Listo para jugar.';
        if (isHost) {
            startGameBtn.style.display = 'block';
        }
    });

    conn.on('data', (data) => {
        console.log('Datos recibidos:', data);
        handleGameData(data);
    });

    conn.on('close', () => {
        alert('Conexión cerrada. El otro jugador se ha desconectado.');
        resetGame();
    });
}

// Crear juego (Host)
createGameBtn.addEventListener('click', () => {
    isHost = true;
    initializePeerConnection();
    setupScreen.style.display = 'none';
    waitingRoom.style.display = 'block';
    connectionStatus.textContent = 'Esperando que el otro jugador se conecte...';
});

// Unirse a juego por código
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
    connectToPeer(gameId);
});

// Refrescar lista de juegos disponibles
refreshGamesBtn.addEventListener('click', requestAvailableGames);

// Unirse a juego seleccionado de la lista
joinGameBtn.addEventListener('click', () => {
    const selectedGame = document.querySelector('input[name="available-game"]:checked');
    if (!selectedGame) {
        alert('Por favor, selecciona un juego disponible.');
        return;
    }

    gameId = selectedGame.value;
    isHost = false;
    initializePeerConnection();
    setupScreen.style.display = 'none';
    waitingRoom.style.display = 'block';
    connectionStatus.textContent = 'Conectando al anfitrión...';
    connectToPeer(gameId);
});

// Generar ID de juego
function generateGameId() {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Conectar a un peer
function connectToPeer(peerId) {
    conn = peer.connect(peerId);
    setupConnectionListeners();
}

// Broadcast del juego
function broadcastGame() {
    broadcastChannel.postMessage({
        type: 'new-game',
        gameId: gameId
    });
}

// Solicitar juegos disponibles
function requestAvailableGames() {
    broadcastChannel.postMessage({type: 'request-games'});
    setTimeout(updateAvailableGamesList, 1000); // Esperar respuestas por 1 segundo
}

// Actualizar lista de juegos disponibles
function updateAvailableGamesList() {
    availableGamesList.innerHTML = '';
    for (let [id, game] of availableGames) {
        const li = document.createElement('li');
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'available-game';
        radio.value = id;
        radio.id = `game-${id}`;
        const label = document.createElement('label');
        label.htmlFor = `game-${id}`;
        label.textContent = `Partida ${id}`;
        li.appendChild(radio);
        li.appendChild(label);
        availableGamesList.appendChild(li);
    }
}

// Manejar datos del juego
function handleGameData(data) {
    switch (data.type) {
        case 'gameStart':
            waitingRoom.style.display = 'none';
            gameScreen.style.display = 'block';
            startGame();
            break;
        // Añade más casos según sea necesario para tu lógica de juego
    }
}

// Iniciar el juego
function startGame() {
    console.log('El juego ha comenzado');
    if (isHost) {
        conn.send({type: 'gameStart'});
    }
    // Implementa aquí la lógica inicial del juego
}

// Reiniciar el juego
function resetGame() {
    setupScreen.style.display = 'block';
    waitingRoom.style.display = 'none';
    gameScreen.style.display = 'none';
    isHost = false;
    if (conn) {
        conn.close();
    }
    if (peer) {
        peer.destroy();
    }
}

// Manejo de mensajes de Broadcast Channel
broadcastChannel.onmessage = (event) => {
    const message = event.data;
    switch (message.type) {
        case 'new-game':
            if (!isHost) {
                availableGames.set(message.gameId, {timestamp: Date.now()});
            }
            break;
        case 'request-games':
            if (isHost) {
                broadcastChannel.postMessage({
                    type: 'new-game',
                    gameId: gameId
                });
            }
            break;
    }
};

// Mapa para almacenar juegos disponibles
const availableGames = new Map();

// Limpiar juegos antiguos periódicamente
setInterval(() => {
    const now = Date.now();
    for (let [id, game] of availableGames) {
        if (now - game.timestamp > 60000) { // 1 minuto
            availableGames.delete(id);
        }
    }
}, 30000); // Cada 30 segundos

// Inicializar
requestAvailableGames();

// Iniciar el juego (para el host)
startGameBtn.addEventListener('click', () => {
    if (isHost && conn) {
        startGame();
    }
});
