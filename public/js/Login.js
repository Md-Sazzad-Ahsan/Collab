'use strict';

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginButton');

// Handle form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Stop native form submission
    login();
});

// Enter key triggers login
[emailInput, passwordInput].forEach((input) => {
    input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            login();
        }
    });
});

function login() {
    const email = filterXSS(emailInput.value.trim());
    const password = filterXSS(passwordInput.value.trim());

    if (!email || !password) {
        popup('warning', 'Email and password are required.');
        return;
    }

    axios
        .post('/login', {
            email: email,
            password: password,
        })
        .then(() => {
            window.location.href = '/'; // Redirect on success (e.g., homepage or dashboard)
        })
        .catch((error) => {
            const msg = error?.response?.data?.message || 'Wrong credentials. Please try again.';
            popup('warning', msg);
            passwordInput.value = '';
        });
}

function filterXSS(input) {
    // Basic input sanitation
    return input.replace(/[<>]/g, '');
}

function popup(type, message) {
    // Replace with custom toast/modal later
    alert(message);
}
