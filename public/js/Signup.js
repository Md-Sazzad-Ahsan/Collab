'use strict';

const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const signupForm = document.getElementById('signupForm');
const signupBtn = document.getElementById('signupButton');
const errorBox = document.getElementById('signupError');

let resendBtn = document.getElementById('resendLink');
if (!resendBtn) {
    const p = document.createElement('p');
    p.className = 'text-sm text-center text-gray-600 mt-2';
    p.innerHTML = `Didn't receive verification email? <button id="resendLink" class="text-blue-600 hover:underline font-semibold">Resend Link</button>`;
    signupForm.parentElement.appendChild(p);
    resendBtn = document.getElementById('resendLink');
}

// Track attempts & cooldown
const MAX_ATTEMPTS = 1;
const COOLDOWN_MS = 2 * 60 * 1000; // 2 minutes
let cooldownTimeout = null;

// Load last attempt from localStorage
let lastAttempt = parseInt(localStorage.getItem('resendLastAttempt')) || 0;
let resendAttempts = parseInt(localStorage.getItem('resendAttempts')) || 0;

// Function to start cooldown based on existing lastAttempt
function startCooldown() {
    clearInterval(cooldownTimeout);
    resendBtn.disabled = true;

    const now = Date.now();
    let elapsed = now - lastAttempt;
    let remaining = Math.max(Math.ceil((COOLDOWN_MS - elapsed) / 1000), 0);

    if (remaining <= 0) {
        resendAttempts = 0;
        localStorage.setItem('resendAttempts', resendAttempts);
        resendBtn.disabled = false;
        resendBtn.textContent = 'Resend Link';
        return;
    }

    resendBtn.textContent = `Wait ${remaining}s`;
    cooldownTimeout = setInterval(() => {
        remaining--;
        if (remaining <= 0) {
            clearInterval(cooldownTimeout);
            resendAttempts = 0;
            localStorage.setItem('resendAttempts', resendAttempts);
            resendBtn.disabled = false;
            resendBtn.textContent = 'Resend Link';
        } else {
            resendBtn.textContent = `Wait ${remaining}s`;
        }
    }, 1000);
}

// Call this when a new resend/signup attempt happens
function recordAttempt() {
    lastAttempt = Date.now();
    localStorage.setItem('resendLastAttempt', lastAttempt);
    resendAttempts++;
    localStorage.setItem('resendAttempts', resendAttempts);
    startCooldown();
}

// Initialize cooldown on page load if needed
if (lastAttempt && Date.now() - lastAttempt < COOLDOWN_MS) {
    startCooldown();
}

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    signup();
});

[usernameInput, emailInput, passwordInput].forEach((input) => {
    input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            signup();
        }
    });
});

resendBtn.addEventListener('click', () => {
    // if (resendAttempts >= MAX_ATTEMPTS) {
    //     popup(`Maximum attempts reached. Please wait before trying again.`);
    //     return;
    // }

    const email = filterXSS(emailInput.value.trim());
    if (!email) {
        popup('Please enter your email to resend verification.');
        return;
    }

    resendBtn.disabled = true;
    resendBtn.textContent = 'Sending...';

    axios
        .post('/resend-verification', { email })
        .then((res) => {
            popup(res.data.message, 'success');
            recordAttempt();
        })
        .catch((err) => {
            let msg = 'Failed to resend link.';
            if (err?.response?.data?.message) msg = err.response.data.message;
            popup(msg);
            resendBtn.disabled = false;
            resendBtn.textContent = 'Resend Link';
        });
});

function signup() {
    const username = filterXSS(usernameInput.value.trim());
    const email = filterXSS(emailInput.value.trim());
    const password = filterXSS(passwordInput.value.trim());

    if (!username || !email || !password) {
        popup('All fields are required.');
        return;
    }

    axios
        .post('/signup', { name: username, email, password })
        .then((response) => {
            popup(response.data.message || response.data, 'success');
            recordAttempt(); // Start cooldown after signup email sent
        })
        .catch((error) => {
            console.error('Signup error:', error);
            let msg = 'Signup failed. Please try again.';
            if (error?.response?.data) {
                if (typeof error.response.data === 'string') {
                    msg = error.response.data;
                } else if (typeof error.response.data === 'object' && error.response.data.message) {
                    msg = error.response.data.message;
                }
            }
            popup(msg);
            passwordInput.value = '';
        });
}

function filterXSS(input) {
    return input.replace(/[<>]/g, '');
}

function popup(message, type = 'error') {
    if (!errorBox) return;
    errorBox.textContent = message;
    errorBox.classList.remove(
        'hidden',
        'bg-red-100',
        'text-red-700',
        'border-red-400',
        'bg-green-100',
        'text-green-700',
        'border-green-400',
    );
    if (type === 'success') {
        errorBox.classList.add('bg-green-100', 'text-green-700', 'border-green-400');
    } else {
        errorBox.classList.add('bg-red-100', 'text-red-700', 'border-red-400');
    }
}
