document.addEventListener('DOMContentLoaded', () => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) return;

    fetch('/views/header.html')
        .then((res) => res.text())
        .then((html) => {
            headerPlaceholder.innerHTML = html;

            // --- Elements ---
            const profileButton = headerPlaceholder.querySelector('#profileButton');
            const profileDropdown = headerPlaceholder.querySelector('#profileDropdown');
            const logoutButton = headerPlaceholder.querySelector('#logoutButton');
            const headerInitial = headerPlaceholder.querySelector('#profileInitial');

            // --- Check server session ---
            fetch('/session-status', { method: 'GET', credentials: 'same-origin' })
                .then((res) => res.json())
                .then((data) => {
                    if (data.loggedIn) {
                        // Show profile & logout
                        if (profileButton) profileButton.style.display = 'flex';
                        if (logoutButton) logoutButton.style.display = 'inline-block';

                        // Get initial from localStorage if exists
                        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                        const userName = storedUser.name || data.username;
                        if (headerInitial) headerInitial.textContent = userName.charAt(0).toUpperCase();

                        // Save username in localStorage if not present
                        if (!storedUser.name) localStorage.setItem('user', JSON.stringify({ name: data.username }));
                    } else {
                        // Hide profile & logout
                        if (profileButton) profileButton.style.display = 'none';
                        if (logoutButton) logoutButton.style.display = 'none';
                        localStorage.removeItem('user');
                    }
                })
                .catch((err) => {
                    console.error('Failed to check session:', err);
                    if (profileButton) profileButton.style.display = 'none';
                    if (logoutButton) logoutButton.style.display = 'none';
                });

            // --- Profile dropdown toggle ---
            if (profileButton && profileDropdown) {
                profileButton.addEventListener('click', () => {
                    profileDropdown.classList.toggle('hidden');
                });
                document.addEventListener('click', (e) => {
                    if (!profileButton.contains(e.target) && !profileDropdown.contains(e.target)) {
                        profileDropdown.classList.add('hidden');
                    }
                });
            }

            // --- Logout ---
            if (logoutButton) {
                logoutButton.addEventListener('click', () => {
                    fetch('/logout', { method: 'GET', credentials: 'same-origin' })
                        .then((res) => {
                            if (res.ok) {
                                localStorage.removeItem('user');
                                window.location.href = '/login';
                            }
                        })
                        .catch(() => alert('Logout failed.'));
                });
            }
        })
        .catch((err) => console.error('Failed to load header:', err));

    // --- Footer ---
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch('/views/footer.html')
            .then((res) => res.text())
            .then((html) => (footerPlaceholder.innerHTML = html))
            .catch((err) => console.error('Failed to load footer:', err));
    }
});
