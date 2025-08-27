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
                        fetch('/logout', {
                            method: 'GET', // Or POST depending on backend
                            credentials: 'same-origin',
                        })
                            .then((response) => {
                                if (response.ok) window.location.href = '/login';
                                else alert('Logout failed, please try again.');
                            })
                            .catch(() => alert('An error occurred while logging out.'));
                    });
                }

                // Highlight current page link
                const currentPath = window.location.pathname.replace(/\/$/, ''); // remove trailing slash
                const navLinks = headerPlaceholder.querySelectorAll('nav a:not(#logoutButton)');

                navLinks.forEach((link) => {
                    const linkPath = link.getAttribute('href').replace(/\/$/, ''); // use href attribute directly

                    // Treat these paths as "home"
                    const homePaths = ['', '/', '/login', '/signup', '/landing'];
                    const isHomeLink = linkPath === '' || linkPath === '/';

                    if ((isHomeLink && homePaths.includes(currentPath)) || currentPath === linkPath) {
                        link.classList.add('text-blue-600', 'font-semibold');
                        link.classList.remove('text-gray-900');
                        link.setAttribute('aria-current', 'page');
                    } else {
                        link.classList.remove('text-blue-600', 'font-semibold');
                        link.classList.add('text-gray-900');
                        link.removeAttribute('aria-current');
                    }
                });

                // Call checkLoginStatus if defined
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
