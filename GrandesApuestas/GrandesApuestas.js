// Variables globales
let localPeerConnection;
let dataChannel;
let isHost = false;
let gameId;
const broadcastChannel = new BroadcastChannel('game_discovery');

// Elementos del DOM
const createGameBtn = document.getElementById('create-game');
const joinGameBtn = document.getElementById('join-game');
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

// Crear juego (Host)
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

// Refrescar lista de juegos disponibles
refreshGamesBtn.addEventListener('click', requestAvailableGames);

// Unirse a juego (Cliente)
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
    sendJoinRequest(gameId);
});

// Inicializar conexión peer
function initializePeerConnection() {
    localPeerConnection = new RTCPeerConnection(configuration);
    
    localPeerConnection.onicecandidate = event => {
        if (event.candidate) {
            broadcastChannel.postMessage({
                type: 'ice-candidate',
                candidate: event.candidate,
                gameId: gameId
            });
        }
    };

    if (isHost) {
        dataChannel = localPeerConnection.createDataChannel('gameChannel');
        setupDataChannel();
    } else {
        localPeerConnection.ondatachannel = event => {
            dataChannel = event.channel;
            setupDataChannel();
        };
    }
}

// Configurar canal de datos
function setupDataChannel() {
    dataChannel.onopen = () => {
        console.log('Data channel is open');
        connectionStatus.textContent = 'Conectado. Listo para jugar.';
        if (isHost) {
            startGameBtn.style.display = 'block';
        }
    };

    dataChannel.onmessage = event => {
        console.log('Mensaje recibido:', event.data);
        handleGameData(JSON.parse(event.data));
    };
}

// Generar ID de juego
function generateGameId() {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
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

// Enviar solicitud de unión
function sendJoinRequest(gameId) {
    broadcastChannel.postMessage({
        type: 'join-request',
        gameId: gameId
    });
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
        dataChannel.send(JSON.stringify({type: 'gameStart'}));
    }
    // Implementa aquí la lógica inicial del juego
}

// Manejo de mensajes de Broadcast Channel
broadcastChannel.onmessage = async (event) => {
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
        case 'offer':
            if (!isHost && message.gameId === gameId) {
                await localPeerConnection.setRemoteDescription(message.offer);
                const answer = await localPeerConnection.createAnswer();
                await localPeerConnection.setLocalDescription(answer);
                broadcastChannel.postMessage({
                    type: 'answer',
                    answer: answer,
                    gameId: gameId
                });
            }
            break;
        case 'answer':
            if (isHost && message.gameId === gameId) {
                await localPeerConnection.setRemoteDescription(message.answer);
            }
            break;
        case 'ice-candidate':
            if (message.gameId === gameId) {
                await localPeerConnection.addIceCandidate(message.candidate);
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
