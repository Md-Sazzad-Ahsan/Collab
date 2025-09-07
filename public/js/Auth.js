function checkLoginStatus() {
    fetch('/session-status', {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((data) => {
            const logoutButton = document.getElementById('logoutButton');
            const profileButton = document.getElementById('profileButton');
            const profileInitial = document.getElementById('profileInitial');

            if (data.loggedIn) {
                // Show logout and profile
                if (logoutButton) logoutButton.style.display = 'inline-block';
                if (profileButton) profileButton.style.display = 'flex';

                // Set profile initial from username
                if (profileInitial && data.username) {
                    profileInitial.textContent = data.username.charAt(0).toUpperCase();
                }
            } else {
                // Hide logout and profile if not logged in
                if (logoutButton) logoutButton.style.display = 'none';
                if (profileButton) profileButton.style.display = 'none';
            }
        })
        .catch((error) => {
            console.error('Error checking login status:', error);
            // Hide buttons on error
            const logoutButton = document.getElementById('logoutButton');
            const profileButton = document.getElementById('profileButton');
            if (logoutButton) logoutButton.style.display = 'none';
            if (profileButton) profileButton.style.display = 'none';
        });
}

document.addEventListener('DOMContentLoaded', checkLoginStatus);
