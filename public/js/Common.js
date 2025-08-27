'use strict';

// ####################################################################
// NEW ROOM
// ####################################################################

const adjectives = [
    'small',
    'big',
    'large',
    'smelly',
    'new',
    'happy',
    'shiny',
    'old',
    'clean',
    'nice',
    'bad',
    'cool',
    'hot',
    'cold',
    'warm',
    'hungry',
    'slow',
    'fast',
    'red',
    'white',
    'black',
    'blue',
    'green',
    'basic',
    'strong',
    'cute',
    'poor',
    'nice',
    'huge',
    'rare',
    'lucky',
    'weak',
    'tall',
    'short',
    'tiny',
    'great',
    'long',
    'single',
    'rich',
    'young',
    'dirty',
    'fresh',
    'brown',
    'dark',
    'crazy',
    'sad',
    'loud',
    'brave',
    'calm',
    'silly',
    'smart',
];

const nouns = [
    'dog',
    'bat',
    'wrench',
    'apple',
    'pear',
    'ghost',
    'cat',
    'wolf',
    'squid',
    'goat',
    'snail',
    'hat',
    'sock',
    'plum',
    'bear',
    'snake',
    'turtle',
    'horse',
    'spoon',
    'fork',
    'spider',
    'tree',
    'chair',
    'table',
    'couch',
    'towel',
    'panda',
    'bread',
    'grape',
    'cake',
    'brick',
    'rat',
    'mouse',
    'bird',
    'oven',
    'phone',
    'photo',
    'frog',
    'bear',
    'camel',
    'sheep',
    'shark',
    'tiger',
    'zebra',
    'duck',
    'eagle',
    'fish',
    'kitten',
    'lobster',
    'monkey',
    'owl',
    'puppy',
    'pig',
    'rabbit',
    'fox',
    'whale',
    'beaver',
    'gorilla',
    'lizard',
    'parrot',
    'sloth',
    'swan',
];

function getRandomNumber(length) {
    let result = '';
    let characters = '0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

let adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
let noun = nouns[Math.floor(Math.random() * nouns.length)];
let num = getRandomNumber(5);
noun = noun.charAt(0).toUpperCase() + noun.substring(1);
adjective = adjective.charAt(0).toUpperCase() + adjective.substring(1);

// ####################################################################
// TYPING EFFECT
// ####################################################################

let i = 0;
let txt = getShortId(9);
let speed = 100;

function typeWriter() {
    if (i < txt.length) {
        roomName.value += txt.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    }
}

const roomName = document.getElementById('roomName');

if (roomName) {
    roomName.value = '';

    if (window.sessionStorage.roomID) {
        roomName.value = window.sessionStorage.roomID;
        window.sessionStorage.roomID = false;
        joinRoom();
    } else {
        // keep input empty; do not auto-fill with typewriter
    }

    roomName.onkeyup = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            joinRoom();
        }
    };
}

// ####################################################################
// LANDING | NEW ROOM
// ####################################################################

const lastRoomContainer = document.getElementById('lastRoomContainer');
const lastRoom = document.getElementById('lastRoom');
const lastRoomName = window.localStorage.lastRoom ? window.localStorage.lastRoom : '';

if (lastRoomContainer && lastRoom && lastRoomName) {
    lastRoomContainer.style.display = 'block';
    lastRoom.setAttribute('href', '/join/?room=' + lastRoomName);
    lastRoom.innerText = lastRoomName;
}

const joinRoomButton = document.getElementById('joinRoomButton');
const createRoomButton = document.getElementById('createRoomButton');
const adultCnt = document.getElementById('adultCnt');
const roomNameInput = document.getElementById('roomName');

if (joinRoomButton) {
    joinRoomButton.onclick = () => {
        const isMobile = window.matchMedia && window.matchMedia('(max-width: 639px)').matches; // Tailwind sm breakpoint
        // Mobile behavior: reveal input and hide Create on first tap
        if (isMobile) {
            const isInputHiddenByClass = roomNameInput && roomNameInput.classList.contains('hidden');
            if (isInputHiddenByClass) {
                roomNameInput.classList.remove('hidden');
                const createBtn = document.getElementById('createRoomButton');
                if (createBtn) createBtn.classList.add('hidden');
                updateJoinButtonState();
                roomNameInput.focus();
                return;
            }
        }
        // Desktop behavior: if input is empty, ignore click
        if (!isMobile) {
            const hasText = roomNameInput && roomNameInput.value.trim().length > 0;
            if (!hasText) return;
        }
        // Desktop or already revealed on mobile: proceed to join
        joinRoom();
    };
}

if (createRoomButton) {
    createRoomButton.onclick = () => {
        genRoom();
        joinRoom();
    };
}

// Visual state for Join button: inactive (gray) when input empty, active (blue) when not
function updateJoinButtonState() {
    if (!joinRoomButton || !roomNameInput) return;
    const isMobile = window.matchMedia && window.matchMedia('(max-width: 639px)').matches; // Tailwind sm breakpoint
    const inputHidden = roomNameInput.classList.contains('hidden');
    const hasText = roomNameInput.value.trim().length > 0;
    // On mobile, always keep Join interactive and primary
    if (isMobile) {
        joinRoomButton.classList.remove('text-gray-400', 'cursor-default', 'pointer-events-none');
        joinRoomButton.setAttribute('aria-disabled', 'false');
        joinRoomButton.tabIndex = 0;
        // Clear any desktop inline overrides when switching breakpoints
        joinRoomButton.style.color = '';
        joinRoomButton.style.pointerEvents = '';
        joinRoomButton.style.cursor = '';
        joinRoomButton.style.textDecoration = '';
        return;
    }
    // If input is hidden (mobile pre-reveal), keep Join interactive and primary
    if (inputHidden) {
        joinRoomButton.classList.remove('text-gray-400', 'cursor-default', 'pointer-events-none');
        return;
    }
    if (hasText) {
        joinRoomButton.classList.remove('text-gray-400', 'cursor-default', 'pointer-events-none');
        joinRoomButton.classList.add('text-blue-600', 'hover:underline');
        joinRoomButton.setAttribute('aria-disabled', 'false');
        joinRoomButton.tabIndex = 0;
        // Clear inline overrides so sm: classes can apply
        joinRoomButton.style.color = '';
        joinRoomButton.style.pointerEvents = '';
        joinRoomButton.style.cursor = '';
        joinRoomButton.style.textDecoration = '';
    } else {
        joinRoomButton.classList.remove('text-blue-600', 'hover:underline');
        joinRoomButton.classList.add('text-gray-400', 'cursor-default', 'pointer-events-none');
        joinRoomButton.setAttribute('aria-disabled', 'true');
        joinRoomButton.tabIndex = -1;
        // Enforce disabled look on larger screens overriding sm: classes
        joinRoomButton.style.color = '#9CA3AF'; // Tailwind gray-400
        joinRoomButton.style.pointerEvents = 'none';
        joinRoomButton.style.cursor = 'default';
        joinRoomButton.style.textDecoration = 'none';
    }
}

// Initialize and listen for changes
if (roomNameInput) {
    updateJoinButtonState();
    roomNameInput.addEventListener('input', updateJoinButtonState);
}

if (adultCnt) {
    adultCnt.onclick = () => {
        adultContent();
    };
}

function genRoom() {
    document.getElementById('roomName').value = getShortId(9);
}

function getUUID4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
    );
}

// Generate a short, URL-safe ID of specified length (default 9) using Web Crypto
function getShortId(len = 9) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const bytes = new Uint8Array(len);
    crypto.getRandomValues(bytes);
    let id = '';
    for (let i = 0; i < len; i++) {
        id += alphabet[bytes[i] % alphabet.length];
    }
    return id;
}

function joinRoom() {
    const roomName = filterXSS(document.getElementById('roomName').value).trim().replace(/\s+/g, '-');
    const roomValid = isValidRoomName(roomName);

    if (!roomName) {
        popup('warning', 'Room name empty!\nPlease pick a room name.');
        return;
    }
    if (!roomValid) {
        popup('warning', 'Invalid Room name!\nPath traversal pattern detected!');
        return;
    }

    //window.location.href = '/join/' + roomName;
    window.location.href = '/join/?room=' + roomName;
    window.localStorage.lastRoom = roomName;
}

function isValidRoomName(input) {
    if (!input || typeof input !== 'string') {
        return false;
    }
    const pathTraversalPattern = /(\.\.(\/|\\))+/;
    return !pathTraversalPattern.test(input);
}

function adultContent() {
    if (
        confirm(
            '18+ WARNING! ADULTS ONLY!\n\nExplicit material for viewing by adults 18 years of age or older. You must be at least 18 years old to access to this site!\n\nProceeding you are agree and confirm to have 18+ year.',
        )
    ) {
        window.open('https://luvlounge.ca', '_blank');
    }
}

// #########################################################
// PERMISSIONS
// #########################################################

const qs = new URLSearchParams(window.location.search);
const room_id = filterXSS(qs.get('room_id'));
const message = filterXSS(qs.get('message'));
const showMessage = document.getElementById('message');
console.log('Allow Camera or Audio', {
    room_id: room_id,
    message: message,
});
if (showMessage) showMessage.innerHTML = message;
