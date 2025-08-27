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

                // Initialize mobile sidebar toggle (since inline scripts in fetched HTML won't execute)
                const toggleBtn = headerPlaceholder.querySelector('[data-collapse-toggle="navbar-default"]');
                const sidebar = headerPlaceholder.querySelector('#navbar-default');
                const overlay = document.getElementById('navbar-overlay');
                const closeBtn = headerPlaceholder.querySelector('#navbar-close');

                if (toggleBtn && sidebar && overlay) {
                    const openSidebar = () => {
                        sidebar.classList.remove('hidden', 'translate-x-full');
                        overlay.classList.remove('hidden');
                        document.body.classList.add('overflow-hidden');
                        toggleBtn.setAttribute('aria-expanded', 'true');
                    };

                    const closeSidebar = () => {
                        sidebar.classList.add('translate-x-full');
                        overlay.classList.add('hidden');
                        document.body.classList.remove('overflow-hidden');
                        toggleBtn.setAttribute('aria-expanded', 'false');
                    };

                    toggleBtn.addEventListener('click', () => {
                        const isClosed = sidebar.classList.contains('translate-x-full') || sidebar.classList.contains('hidden');
                        if (isClosed) openSidebar(); else closeSidebar();
                    });

                    overlay.addEventListener('click', closeSidebar);
                    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
                    sidebar.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeSidebar));

                    // Ensure correct state on resize
                    const mq = window.matchMedia('(min-width: 768px)');
                    const handleMq = (e) => {
                        if (e.matches) {
                            // Desktop
                            sidebar.classList.remove('hidden', 'translate-x-full');
                            overlay.classList.add('hidden');
                            document.body.classList.remove('overflow-hidden');
                            toggleBtn.setAttribute('aria-expanded', 'true');
                        } else {
                            // Mobile initial state closed
                            sidebar.classList.add('hidden', 'translate-x-full');
                            overlay.classList.add('hidden');
                            document.body.classList.remove('overflow-hidden');
                            toggleBtn.setAttribute('aria-expanded', 'false');
                        }
                    };
                    handleMq(mq);
                    mq.addEventListener('change', handleMq);
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
