// Handle Logout
function logout() {
    // Make an API call to the server's logout route to destroy the session
    fetch('/logout', {
        method: 'GET',  // You can also use POST depending on your backend setup
        credentials: 'same-origin'  // Ensures the session cookie is sent with the request
    })
    .then((response) => {
        if (response.ok) {
            // Redirect to the homepage or login page after successful logout
            window.location.href = '/login';
        } else {
            // Handle errors (e.g., show an error message)
            alert('Logout failed, please try again.');
        }
    })
    .catch((error) => {
        console.error('Logout error:', error);
        alert('An error occurred while logging out.');
    });
}

// Optionally, you could add an event listener for a logout button
document.getElementById('logoutButton').addEventListener('click', logout);
