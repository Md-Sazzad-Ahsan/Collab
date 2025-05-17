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
            if (logoutButton) {
                // Show or hide the logout button based on login status
                if (data.loggedIn) {
                    logoutButton.style.display = 'inline-block';
                } else {
                    logoutButton.style.display = 'none';
                }
            }
        })
        .catch((error) => {
            console.error('Error checking login status:', error);
        });
}

document.addEventListener('DOMContentLoaded', checkLoginStatus);
