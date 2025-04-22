'use strict';

const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const signupForm = document.getElementById('signupForm');
const signupBtn = document.getElementById('signupButton');

// Handle form submission
signupForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Stop native form submission
    signup();
});

// Enter key triggers signup
[usernameInput, emailInput, passwordInput].forEach(input => {
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
        popup('warning', 'All fields are required.');
        return;
    }

    axios.post('/signup', {
        name: username,
        email: email,
        password: password,
    })
    .then(() => {
        window.location.href = '/'; // Redirect on success
    })
    .catch((error) => {
        console.error('Signup error:', error);
        const msg = error?.response?.data?.message || 'Signup failed. Please try again.';
        popup('warning', msg);

        // Optional: Clear password field
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
