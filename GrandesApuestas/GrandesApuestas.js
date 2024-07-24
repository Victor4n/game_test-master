// Variables globales
let peer;
let conn;
let isHost = false;
let gameId;

// Elementos del DOM
const createGameBtn = document.getElementById('create-game');
const joinGameContainer = document.getElementById('join-game-container');
const joinGameBtn = document.getElementById('join-game');
const gameIdInput = document.getElementById('game-id-input');
const setupScreen = document.getElementById('setup-screen');
const waitingRoom = document.getElementById('waiting-room');
const gameScreen = document.getElementById('game-screen');
const connectionStatus = document.getElementById('connection-status');
const startGameBtn = document.getElementById('start-game');
const gameIdDisplay = document.getElementById('game-id-display');

// Inicializar Peer
function initPeer() {
    peer = new Peer();
    
    peer.on('open', (id) => {
        console.log('Mi ID de peer es: ' + id);
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
    peer.on('open', (id) => {
        gameId = id;
        setupScreen.style.display = 'none';
        waitingRoom.style.display = 'block';
        gameIdDisplay.textContent = gameId;
        connectionStatus.textContent = 'Esperando que el otro jugador se conecte...';
    });
});

// Mostrar opción para unirse al juego
createGameBtn.addEventListener('click', () => {
    joinGameContainer.style.display = 'block';
});

// Unirse a juego (Cliente)
joinGameBtn.addEventListener('click', () => {
    const joinId = gameIdInput.value.trim();
    if (!joinId) {
        alert('Por favor, ingresa un ID de partida válido.');
        return;
    }

    isHost = false;
    initPeer();
    peer.on('open', () => {
        conn = peer.connect(joinId);
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
    // Implementa la lógica para reiniciar el juego
    setupScreen.style.display = 'block';
    waitingRoom.style.display = 'none';
    gameScreen.style.display = 'none';
    joinGameContainer.style.display = 'none';
    isHost = false;
    if (conn) {
        conn.close();
    }
    if (peer) {
        peer.destroy();
    }
}

// Función para enviar datos al otro jugador
function sendGameData(data) {
    if (conn && conn.open) {
        conn.send(data);
    }
}

// Aquí puedes añadir más funciones para manejar la lógica del juego
