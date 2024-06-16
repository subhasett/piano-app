// Sign Up Function
function signUp() {
    const username = document.getElementById('username').value;
    if (username) {
        localStorage.setItem('username', username);
        document.getElementById('user-name').innerText = username;
        //history.pushState({ section: 'welcome' }, '', '#welcome');
        document.getElementById('sign-up').style.display = 'none';
        document.getElementById('welcome').style.display = 'block';
        

    }
}

// Start Chat Function
function startChat() {
    document.getElementById('welcome').style.display = 'none';
    document.getElementById('chat').style.display = 'block';
}

// Show Video Function
function showVideo() {
    document.getElementById('welcome').style.display = 'none';
    document.getElementById('video').style.display = 'block';
}

// Show Piano Function
function showPiano() {
    document.getElementById('welcome').style.display = 'none';
    document.getElementById('piano').style.display = 'block';
}

// Show Songs Function
function showSongs() {
    document.getElementById('welcome').style.display = 'none';
    document.getElementById('songs').style.display = 'block';
}

// Chatbot Functionality
const messages = [
    "Welcome to the piano learning app!",
    "To start playing the piano, place your fingers on the keys.",
    "Please check our learning songs section to learn your song"
];  "Practice makes perfect, keep trying!"

let messageIndex = 0;

function sendMessage() {
    const input = document.getElementById('chat-input').value;
    if (input) {
        const chatOutput = document.getElementById('chat-output');
        const userMessage = document.createElement('div');
        userMessage.innerText = `You: ${input}`;
        chatOutput.appendChild(userMessage);

        const botMessage = document.createElement('div');
        botMessage.innerText = `Bot: ${messages[messageIndex % messages.length]}`;
        chatOutput.appendChild(botMessage);

        messageIndex++;
        document.getElementById('chat-input').value = '';
    }
}

// Digital Piano Functionality
const keys = document.querySelectorAll('.key');
keys.forEach(key => {
    key.addEventListener('click', () => {
        const note = key.getAttribute('data-note');
        playSound(note);
    });
});

function playSound(note) {
    const audio = new Audio(`sound/${note}.svg`);
    audio.play();
}

async function connectBluetoothKeyboard() {
    try {
        // Request the device with specific Bluetooth services and characteristics
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ name: 'Your Keyboard Name' }],
            optionalServices: ['battery_service', 'device_information'] // Add the necessary services
        });

        // Connect to the device
        const server = await device.gatt.connect();

        // Get the primary service
        const service = await server.getPrimaryService('battery_service');

        // Get the characteristic you are interested in
        const characteristic = await service.getCharacteristic('battery_level');

        // Read the value of the characteristic
        const value = await characteristic.readValue();
        console.log('Battery level: ' + value.getUint8(0) + '%');

        // You can also subscribe to notifications from the characteristic
        characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
        await characteristic.startNotifications();
    } catch (error) {
        console.error('Failed to connect to Bluetooth device', error);
    }
}

function handleCharacteristicValueChanged(event) {
    const value = event.target.value;
    // Handle the value changes here
    console.log('Characteristic value changed:', value);
}

async function connectMIDIDevice() {
    try {
        const access = await navigator.requestMIDIAccess();
        access.inputs.forEach(input => {
            input.onmidimessage = handleMIDIMessage;
        });
    } catch (error) {
        console.error('Failed to connect to MIDI device', error);
    }
}

function handleMIDIMessage(event) {
    const [command, note, velocity] = event.data;
    if (command === 144) {
        // Note on
        console.log('Note on:', note, 'Velocity:', velocity);
        // Add logic to play the note on your digital piano
    } else if (command === 128) {
        // Note off
        console.log('Note off:', note);
        // Add logic to stop the note on your digital piano
    }
}
// Check if user is already signed up
window.onload = function() {
    // Clear stored username from previous session
    localStorage.removeItem('username');
    
    // Hide welcome screen and show sign-up screen
    document.getElementById('sign-up').style.display = 'block';
    document.getElementById('welcome').style.display = 'none';
    
    // Clear input field
    document.getElementById('username').value = '';
}