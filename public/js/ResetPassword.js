'use strict';

const passwordInput = document.querySelector('input[name="password"]');
const resetForm = document.getElementById('resetForm');
const successBox = document.getElementById('resetSuccess');
const errorBox = document.getElementById('resetError');

resetForm.classList.remove('hidden'); // show form on page load

resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = passwordInput.value.trim();
    const token = window.location.pathname.split('/').pop();

    if (!password) return showMessage('error', 'Password is required.');

    try {
        const res = await axios.post(`/reset/${token}`, { password });
        showMessage('success', res.data.message || 'Password reset successful!');
        passwordInput.value = '';
        resetForm.querySelector('button').disabled = true;
        setTimeout(() => (window.location.href = '/login'), 2500);
    } catch (err) {
        showMessage('error', err.response?.data?.message || 'Something went wrong.');
        passwordInput.value = '';
    }
});

function showMessage(type, msg) {
    if (type === 'success') {
        successBox.textContent = msg;
        successBox.classList.remove('hidden');
        errorBox.classList.add('hidden');
    } else {
        errorBox.textContent = msg;
        errorBox.classList.remove('hidden');
        successBox.classList.add('hidden');
    }
}
