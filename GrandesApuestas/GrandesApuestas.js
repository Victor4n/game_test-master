// Variables globales
let peer;
let conn;
let isHost = false;
let gameId;
let shortCode;

// Elementos del DOM
const createGameBtn = document.getElementById('create-game');
const joinGameBtn = document.getElementById('join-game');
const shortCodeInput = document.getElementById('short-code-input');
const setupScreen = document.getElementById('setup-screen');
const waitingRoom = document.getElementById('waiting-room');
const gameScreen = document.getElementById('game-screen');
const connectionStatus = document.getElementById('connection-status');
const startGameBtn = document.getElementById('start-game');
const gameIdDisplay = document.getElementById('game-id-display');
const shortCodeDisplay = document.getElementById('short-code-display');
const availableGamesList = document.getElementById('available-games-list');
const refreshGamesBtn = document.getElementById('refresh-games');

// Inicializar Peer
function initPeer() {
    peer = new Peer();
    
    peer.on('open', (id) => {
        console.log('Mi ID de peer es: ' + id);
        if (isHost) {
            gameId = id;
            shortCode = generateShortCode();
            gameIdDisplay.textContent = gameId;
            shortCodeDisplay.textContent = shortCode;
            addGameToLocalLobby(shortCode, gameId);
        }
    });

    peer.on('connection', (connection) => {
        conn = connection;
        setupConnectionListeners();
        connectionStatus.textContent = 'Jugador conectado. Esperando para iniciar...';
        startGameBtn.style.display = 'block';
    });

    peer.on('error', (err) => {
        console.error('Error de peer:', err);
        alert('Error de conexión. Por favor, intenta de nuevo.');
    });
}

// Configurar listeners para la conexión
function setupConnectionListeners() {
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
    initPeer();
    setupScreen.style.display = 'none';
    waitingRoom.style.display = 'block';
    connectionStatus.textContent = 'Esperando que el otro jugador se conecte...';
});

// Refrescar lista de juegos disponibles
refreshGamesBtn.addEventListener('click', refreshAvailableGames);

// Unirse a juego (Cliente)
joinGameBtn.addEventListener('click', () => {
    const code = shortCodeInput.value.trim().toUpperCase();
    if (!code) {
        alert('Por favor, ingresa un código de juego válido.');
        return;
    }

    const gameId = getGameIdFromShortCode(code);
    if (!gameId) {
        alert('No se encontró ningún juego con ese código.');
        return;
    }

    isHost = false;
    initPeer();
    peer.on('open', () => {
        conn = peer.connect(gameId);
        conn.on('open', () => {
            setupConnectionListeners();
            setupScreen.style.display = 'none';
            waitingRoom.style.display = 'block';
            connectionStatus.textContent = 'Conectado al anfitrión. Esperando que comience el juego...';
        });
    });
});

// Iniciar el juego
startGameBtn.addEventListener('click', () => {
    if (isHost && conn) {
        waitingRoom.style.display = 'none';
        gameScreen.style.display = 'block';
        conn.send({ type: 'gameStart' });
        startGame();
    }
});

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
    // Implementa la lógica inicial del juego aquí
    console.log('El juego ha comenzado');
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
    removeGameFromLocalLobby(shortCode);
    refreshAvailableGames();
}

// Función para enviar datos al otro jugador
function sendGameData(data) {
    if (conn && conn.open) {
        conn.send(data);
    }
}

// Generar código corto
function generateShortCode() {
    return Math.random().toString(36).substr(2, 4).toUpperCase();
}

// Añadir juego al lobby local
function addGameToLocalLobby(shortCode, gameId) {
    const games = JSON.parse(localStorage.getItem('availableGames') || '{}');
    games[shortCode] = {
        id: gameId,
        timestamp: Date.now()
    };
    localStorage.setItem('availableGames', JSON.stringify(games));
}

// Remover juego del lobby local
function removeGameFromLocalLobby(shortCode) {
    const games = JSON.parse(localStorage.getItem('availableGames') || '{}');
    delete games[shortCode];
    localStorage.setItem('availableGames', JSON.stringify(games));
}

// Obtener ID de juego a partir del código corto
function getGameIdFromShortCode(shortCode) {
    const games = JSON.parse(localStorage.getItem('availableGames') || '{}');
    return games[shortCode] ? games[shortCode].id : null;
}

// Refrescar lista de juegos disponibles
function refreshAvailableGames() {
    const games = JSON.parse(localStorage.getItem('availableGames') || '{}');
    const currentTime = Date.now();
    const gameList = Object.entries(games)
        .filter(([_, game]) => currentTime - game.timestamp < 300000) // 5 minutos
        .map(([shortCode, _]) => shortCode);
    
    availableGamesList.innerHTML = '';
    gameList.forEach(code => {
        const li = document.createElement('li');
        li.textContent = code;
        li.onclick = () => {
            shortCodeInput.value = code;
        };
        availableGamesList.appendChild(li);
    });
}

// Limpiar juegos antiguos periódicamente
setInterval(() => {
    const games = JSON.parse(localStorage.getItem('availableGames') || '{}');
    const currentTime = Date.now();
    const updatedGames = Object.fromEntries(
        Object.entries(games).filter(([_, game]) => currentTime - game.timestamp < 300000)
    );
    localStorage.setItem('availableGames', JSON.stringify(updatedGames));
}, 60000); // Cada minuto

// Inicializar
refreshAvailableGames();
