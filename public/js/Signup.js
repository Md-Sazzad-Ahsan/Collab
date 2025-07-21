'use strict';

const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const signupForm = document.getElementById('signupForm');
const signupBtn = document.getElementById('signupButton');
const errorBox = document.getElementById('signupError');

// Handle form submission
signupForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Stop native form submission
    signup();
});

// Enter key triggers signup
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

    if (!username || !email || !password) {
        popup('All fields are required.');
        return;
    }

    axios
        .post('/signup', {
            name: username,
            email: email,
            password: password,
        })
        .then((response) => {
            popup(response.data, 'success');
            signupForm.reset();
        })
        .catch((error) => {
            console.error('Signup error:', error);
            const msg = error?.response?.data || 'Signup failed. Please try again.';
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

    // Reset styles
    errorBox.classList.remove('hidden');
    errorBox.classList.remove('bg-red-100', 'text-red-700', 'border-red-400');
    errorBox.classList.remove('bg-green-100', 'text-green-700', 'border-green-400');

    if (type === 'success') {
        errorBox.classList.add('bg-green-100', 'text-green-700', 'border-green-400');
    } else {
        errorBox.classList.add('bg-red-100', 'text-red-700', 'border-red-400');
    }
}
