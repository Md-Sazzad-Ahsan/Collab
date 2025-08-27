'use strict';

const form = document.getElementById('forgetForm');
const successBox = document.getElementById('forgetSuccess');
const errorBox = document.getElementById('forgetError');

// Check for cooldown in localStorage
let cooldownKey = 'forgetCooldown';
let cooldownTime = parseInt(localStorage.getItem(cooldownKey)) || 0;

updateButtonState();

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const now = Date.now();
    if (cooldownTime > now) {
        const wait = Math.ceil((cooldownTime - now) / 1000);
        return showMessage(errorBox, `Please wait ${wait} seconds before retrying.`);
    }

    const email = form.email.value.trim();
    if (!email) return showMessage(errorBox, 'Email is required.');

    try {
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;

        const res = await axios.post('/forget', { email });

        if (res.data.success) {
            showMessage(successBox, res.data.message);
            hideMessage(errorBox);
            form.reset();

            // Set 5-minute cooldown
            cooldownTime = Date.now() + 5 * 60 * 1000;
            localStorage.setItem(cooldownKey, cooldownTime);
            updateButtonState();
        } else {
            showMessage(errorBox, res.data.message);
            hideMessage(successBox);
        }

        btn.disabled = false;
    } catch (err) {
        showMessage(errorBox, 'Something went wrong.');
        hideMessage(successBox);
        form.querySelector('button[type="submit"]').disabled = false;
    }
});

function showMessage(box, msg) {
    box.textContent = msg;
    box.classList.remove('hidden');
}

function hideMessage(box) {
    box.classList.add('hidden');
}

// Disable submit button if cooldown active
function updateButtonState() {
    const btn = form.querySelector('button[type="submit"]');
    const interval = setInterval(() => {
        const now = Date.now();
        if (cooldownTime <= now) {
            btn.disabled = false;
            btn.textContent = 'Send Reset Link';
            localStorage.removeItem(cooldownKey);
            clearInterval(interval);
        } else {
            btn.disabled = true;
            const remaining = Math.ceil((cooldownTime - now) / 1000);
            btn.textContent = `Retry in ${remaining}s`;
        }
    }, 1000);
}
