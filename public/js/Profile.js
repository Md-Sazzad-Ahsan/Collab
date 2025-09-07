document.addEventListener('DOMContentLoaded', () => {
    const editBtn = document.getElementById('editProfileBtn');
    const saveBtn = document.getElementById('saveProfileBtn');
    const editableFields = ['profileNameDetail', 'profilePhoneDetail'];

    const toggleChangePassword = document.getElementById('toggleChangePassword');
    const cancelPasswordBtn = document.getElementById('cancelPasswordBtn');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const updatePasswordBtn = document.getElementById('updatePasswordBtn');

    const currentPasswordInput = document.getElementById('currentPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    // Create a message div if not present
    let passwordMessage = document.getElementById('passwordMessage');
    if (!passwordMessage) {
        passwordMessage = document.createElement('div');
        passwordMessage.id = 'passwordMessage';
        passwordMessage.classList.add('mt-2', 'text-sm', 'hidden');
        changePasswordForm.prepend(passwordMessage);
    }

    // --- Helpers ---
    const toggleEditable = (enable) => {
        editableFields.forEach((id) => {
            const el = document.getElementById(id);
            if (el) {
                el.contentEditable = enable;
                el.classList.toggle('editable', enable);
                if (enable) el.focus();
            }
        });
    };

    const updateTopProfile = (user) => {
        const profileInitialEl = document.getElementById('profilePageInitial');
        const profileNameEl = document.getElementById('profileName');
        const profilePhoneEl = document.getElementById('profilePhone');

        if (profileInitialEl) profileInitialEl.textContent = user.name.charAt(0).toUpperCase();
        if (profileNameEl) profileNameEl.textContent = user.name;
        if (profilePhoneEl) profilePhoneEl.textContent = user.phone;

        const headerProfileInitial = document.querySelector('#header-placeholder #profileInitial');
        if (headerProfileInitial) headerProfileInitial.textContent = user.name.charAt(0).toUpperCase();
    };

    const updateBadges = (user) => {
        const verifiedBadge = document.getElementById('verifiedBadge');
        const premiumBadge = document.getElementById('premiumBadge');

        if (user.isVerified) {
            verifiedBadge.className = 'status-badge verified';
            verifiedBadge.innerHTML = '<i class="fas fa-check-circle mr-1.5"></i>Verified';
            document.getElementById('profileVerified').textContent = 'Verified';
        } else {
            verifiedBadge.className = 'status-badge unverified';
            verifiedBadge.innerHTML = '<i class="fas fa-times-circle mr-1.5"></i>Unverified';
            document.getElementById('profileVerified').textContent = 'Not Verified';
        }

        if (user.is_premium) {
            premiumBadge.className = 'status-badge premium';
            premiumBadge.innerHTML = '<i class="fas fa-crown mr-1.5"></i>Premium Plan';
            document.getElementById('profilePremium').textContent = 'Premium';
        } else {
            premiumBadge.className = 'status-badge basic';
            premiumBadge.innerHTML = '<i class="fas fa-user mr-1.5"></i>Basic Plan';
            document.getElementById('profilePremium').textContent = 'Basic (Free)';
        }
    };

    // --- Fetch Profile ---
    const fetchProfile = () => {
        fetch('/profile', { method: 'POST', credentials: 'same-origin' })
            .then((res) => (res.redirected ? (window.location.href = res.url) : res.json()))
            .then((user) => {
                if (!user) return;
                updateTopProfile(user);
                document.getElementById('profileNameDetail').textContent = user.name;
                document.getElementById('profileEmailDetail').textContent = user.email;
                document.getElementById('profileEmail').textContent = user.email;
                document.getElementById('profilePhoneDetail').textContent = user.phone;
                updateBadges(user);
                localStorage.setItem('user', JSON.stringify(user));
            })
            .catch((err) => console.error('Failed to load profile:', err));
    };
    fetchProfile();

    // --- Edit Profile ---
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            toggleEditable(true);
            editBtn.classList.add('hidden');
            saveBtn.classList.remove('hidden');
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const updatedData = {
                name: document.getElementById('profileNameDetail').textContent.trim(),
                phone: document.getElementById('profilePhoneDetail').textContent.trim(),
            };

            axios
                .put('/profile', updatedData)
                .then((res) => {
                    const user = res.data.user;
                    toggleEditable(false);
                    editBtn.classList.remove('hidden');
                    saveBtn.classList.add('hidden');
                    updateTopProfile(user);
                    updateBadges(user);
                    document.getElementById('profileNameDetail').textContent = user.name;
                    document.getElementById('profileEmailDetail').textContent = user.email;
                    document.getElementById('profilePhoneDetail').textContent = user.phone;
                    localStorage.setItem('user', JSON.stringify(user));
                })
                .catch((err) => console.error('Failed to update profile:', err));
        });
    }

    // --- Toggle Change Password Form ---
    if (toggleChangePassword && changePasswordForm) {
        toggleChangePassword.addEventListener('click', () => {
            changePasswordForm.classList.toggle('hidden');
        });
    }

    if (cancelPasswordBtn && changePasswordForm) {
        cancelPasswordBtn.addEventListener('click', () => {
            changePasswordForm.classList.add('hidden');
            passwordMessage.classList.add('hidden');
            currentPasswordInput.value = '';
            newPasswordInput.value = '';
            confirmPasswordInput.value = '';
        });
    }

    // --- Toggle password visibility ---
    changePasswordForm.querySelectorAll('button > .far.fa-eye').forEach((eyeIcon) => {
        const parentButton = eyeIcon.parentElement;
        parentButton.addEventListener('click', () => {
            const input = parentButton.previousElementSibling;
            if (input) input.type = input.type === 'password' ? 'text' : 'password';
        });
    });

    // --- Change Password ---
    if (updatePasswordBtn) {
        updatePasswordBtn.addEventListener('click', async () => {
            const currentPassword = currentPasswordInput.value.trim();
            const newPassword = newPasswordInput.value.trim();
            const confirmPassword = confirmPasswordInput.value.trim();

            passwordMessage.classList.add('hidden');
            passwordMessage.textContent = '';
            passwordMessage.classList.remove('text-red-600', 'text-green-600');

            if (!currentPassword || !newPassword || !confirmPassword) {
                passwordMessage.textContent = 'All password fields are required.';
                passwordMessage.classList.add('text-red-600');
                passwordMessage.classList.remove('hidden');
                return;
            }

            if (newPassword !== confirmPassword) {
                passwordMessage.textContent = 'New password and confirm password do not match.';
                passwordMessage.classList.add('text-red-600');
                passwordMessage.classList.remove('hidden');
                return;
            }

            try {
                const res = await axios.put(
                    '/profile/change-password',
                    { currentPassword, newPassword, confirmPassword },
                    { withCredentials: true },
                );

                passwordMessage.textContent = res.data.message || 'Password changed successfully';
                passwordMessage.classList.add('text-green-600');
                passwordMessage.classList.remove('hidden');

                currentPasswordInput.value = '';
                newPasswordInput.value = '';
                confirmPasswordInput.value = '';

                setTimeout(() => {
                    changePasswordForm.classList.add('hidden');
                    passwordMessage.classList.add('hidden');
                    passwordMessage.textContent = '';
                }, 2000);
            } catch (err) {
                passwordMessage.textContent = err.response?.data?.message || 'Password change failed';
                passwordMessage.classList.add('text-red-600');
                passwordMessage.classList.remove('hidden');
            }
        });
    }
});
