document.addEventListener('DOMContentLoaded', () => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch('/views/header.html')
            .then((res) => res.text())
            .then((html) => {
                headerPlaceholder.innerHTML = html;

                // Attach logout handler AFTER header is loaded
                const logoutButton = document.getElementById('logoutButton');
                if (logoutButton) {
                    logoutButton.addEventListener('click', () => {
                        // Logout logic
                        fetch('/logout', {
                            method: 'GET', // Or POST depending on backend
                            credentials: 'same-origin',
                        })
                            .then((response) => {
                                if (response.ok) {
                                    window.location.href = '/login';
                                } else {
                                    alert('Logout failed, please try again.');
                                }
                            })
                            .catch((error) => {
                                console.error('Logout error:', error);
                                alert('An error occurred while logging out.');
                            });
                    });
                }

                // Call checkLoginStatus if it's defined
                if (typeof checkLoginStatus === 'function') {
                    checkLoginStatus();
                }
            })
            .catch((err) => console.error('Failed to load header:', err));
    }

    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch('/views/footer.html')
            .then((res) => res.text())
            .then((html) => {
                footerPlaceholder.innerHTML = html;
            })
            .catch((err) => console.error('Failed to load footer:', err));
    }
});
