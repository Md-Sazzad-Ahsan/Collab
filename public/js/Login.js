'use strict';

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginButton');
const errorBox = document.getElementById('loginError');

// Handle form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
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
        .post('/login', { email, password })
        .then(() => {
            window.location.href = '/';
        })
        .catch((error) => {
            let msg = 'Something went wrong.';

            if (error?.response?.data?.message) {
                msg = error.response.data.message;
            } else if (error?.response?.status === 401) {
                msg = 'Invalid email or password.';
            } else if (error?.response?.status === 403) {
                msg = 'Email not verified. Please check your inbox.';
            }

            popup('warning', msg);
            passwordInput.value = '';
        });
}

function filterXSS(input) {
    return input.replace(/[<>]/g, '');
}

function popup(type, message) {
    if (!errorBox) return;

    errorBox.textContent = message;
    errorBox.classList.remove('hidden');
}
