'use strict';

const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password');
const signupForm = document.getElementById('signupForm');
const signupBtn = document.getElementById('signupButton');
const errorBox = document.getElementById('signupError');

// ---------------- Resend link setup ----------------
let resendBtn = document.getElementById('resendLink');
let resendContainer = document.getElementById('resendContainer');

if (!resendBtn) {
    const p = document.createElement('p');
    p.id = 'resendContainer';
    p.className = 'text-sm text-center text-gray-600 mt-2 hidden';
    p.innerHTML = `Didn't receive verification email? <button id="resendLink" class="text-blue-600 hover:underline font-semibold">Resend Link</button>`;
    signupForm.parentElement.appendChild(p);
    resendBtn = document.getElementById('resendLink');
    resendContainer = document.getElementById('resendContainer');
}

// ---------------- Cooldown & Helpers ----------------
const COOLDOWN_MS = 2 * 60 * 1000; // 2 minutes
let cooldownTimeout = null;

function disableSignup(disable = true) {
    signupBtn.disabled = disable;
    if (disable) signupBtn.classList.add('opacity-50', 'cursor-not-allowed');
    else signupBtn.classList.remove('opacity-50', 'cursor-not-allowed');
}

function startResendCooldown() {
    resendBtn.disabled = true;
    let remaining = COOLDOWN_MS / 1000;
    resendBtn.textContent = `Wait ${remaining}s`;

    cooldownTimeout = setInterval(() => {
        remaining--;
        if (remaining <= 0) {
            clearInterval(cooldownTimeout);
            resendBtn.disabled = false;
            resendBtn.textContent = 'Resend Link';
        } else {
            resendBtn.textContent = `Wait ${remaining}s`;
        }
    }, 1000);
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

// ---------------- Signup ----------------
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

function signup() {
    const username = filterXSS(usernameInput.value.trim());
    const email = filterXSS(emailInput.value.trim());
    const password = filterXSS(passwordInput.value.trim());
    const phone = filterXSS(phoneInput.value.trim());

    if (!username || !email || !password || !phone) {
        popup('All fields are required.');
        return;
    }

    disableSignup(true);

    axios
        .post('/send-verification', { name: username, email, password, phone })
        .then((response) => {
            popup(response.data.message || response.data, 'success');

            // Show resend link and start 2-min cooldown
            resendContainer.classList.remove('hidden');
            startResendCooldown();
        })
        .catch((error) => {
            console.error('Signup error:', error);
            let msg = 'Signup failed. Please try again.';
            if (error?.response?.data?.message) msg = error.response.data.message;
            popup(msg);
            passwordInput.value = '';

            // Show resend link for existing unverified user and start cooldown
            if (error?.response?.status === 400 || error?.response?.status === 429) {
                resendContainer.classList.remove('hidden');
                startResendCooldown();
            } else {
                disableSignup(false);
            }
        });
}

// ---------------- Resend Verification ----------------
resendBtn.addEventListener('click', () => {
    const email = filterXSS(emailInput.value.trim());
    if (!email) {
        popup('Please enter your email to resend verification.');
        return;
    }

    resendBtn.disabled = true;
    resendBtn.textContent = 'Sending...';

    axios
        .post('/send-verification', { email })
        .then((res) => {
            popup(res.data.message, 'success');

            // Restart 2-min cooldown after manual resend
            startResendCooldown();
        })
        .catch((err) => {
            let msg = 'Failed to resend link.';
            if (err?.response?.data?.message) msg = err.response.data.message;
            popup(msg);
            resendBtn.disabled = false;
            resendBtn.textContent = 'Resend Link';
        });
});
