// Variables globales
let isHost = false;
let bluetoothDevice;
let bluetoothServer;
let bluetoothCharacteristic;

// Elementos del DOM
const createGameBtn = document.getElementById('create-game');
const joinGameBtn = document.getElementById('join-game');
const setupScreen = document.getElementById('setup-screen');
const waitingRoom = document.getElementById('waiting-room');
const gameScreen = document.getElementById('game-screen');
const connectionStatus = document.getElementById('connection-status');
const startGameBtn = document.getElementById('start-game');

// Configuración Bluetooth
const SERVICE_UUID = '0000180f-0000-1000-8000-00805f9b34fb';
const CHARACTERISTIC_UUID = '00002a19-0000-1000-8000-00805f9b34fb';

// Verificar soporte de Bluetooth
if ('bluetooth' in navigator) {
    console.log('Web Bluetooth API es soportada.');
} else {
    alert('Tu navegador no soporta Web Bluetooth API. Por favor, usa un navegador compatible como Chrome o Edge.');
}

// Crear juego (Host)
createGameBtn.addEventListener('click', async () => {
    try {
        isHost = true;
        setupScreen.style.display = 'none';
        waitingRoom.style.display = 'block';
        connectionStatus.textContent = 'Esperando que el otro jugador se conecte...';
        startGameBtn.style.display = 'block'; // El host puede iniciar el juego
    } catch (error) {
        console.error('Error al crear el juego:', error);
        alert('Error al crear el juego. Por favor, inténtalo de nuevo.');
    }
});

// Unirse a juego (Cliente)
joinGameBtn.addEventListener('click', async () => {
    try {
        await connectToDevice();
        isHost = false;
        setupScreen.style.display = 'none';
        waitingRoom.style.display = 'block';
        connectionStatus.textContent = 'Conectado al anfitrión. Esperando que comience el juego...';
    } catch (error) {
        console.error('Error al unirse al juego:', error);
        alert('Error al unirse al juego. Por favor, inténtalo de nuevo.');
    }
});

// Función para conectar al dispositivo (Cliente)
async function connectToDevice() {
    try {
        bluetoothDevice = await navigator.bluetooth.requestDevice({
            filters: [{ services: [SERVICE_UUID] }]
        });
        console.log('Dispositivo seleccionado:', bluetoothDevice.name);
        
        bluetoothServer = await bluetoothDevice.gatt.connect();
        console.log('Conectado al servidor GATT');
        
        const service = await bluetoothServer.getPrimaryService(SERVICE_UUID);
        console.log('Servicio encontrado');
        
        bluetoothCharacteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);
        console.log('Característica encontrada');

        await bluetoothCharacteristic.startNotifications();
        bluetoothCharacteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
        console.log('Notificaciones habilitadas');
    } catch (error) {
        console.error('Error al conectar:', error);
        throw error;
    }
}

// Manejar cambios en la característica Bluetooth
function handleCharacteristicValueChanged(event) {
    const value = new TextDecoder().decode(event.target.value);
    console.log('Valor recibido:', value);
    // Aquí puedes manejar los mensajes recibidos del otro jugador
}

// Función para enviar datos al otro jugador
async function sendData(data) {
    if (bluetoothCharacteristic) {
        const encoder = new TextEncoder();
        const dataArray = encoder.encode(data);
        await bluetoothCharacteristic.writeValue(dataArray);
        console.log('Datos enviados:', data);
    }
}

// Iniciar el juego
startGameBtn.addEventListener('click', () => {
    waitingRoom.style.display = 'none';
    gameScreen.style.display = 'block';
    sendData('game_start');
});

// Aquí puedes añadir más funciones para manejar la lógica del juego
