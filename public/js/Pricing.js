document.addEventListener('DOMContentLoaded', async () => {
    const upgradeBtn = document.getElementById('proPlanBtn');
    const freePlanCard = document.getElementById('freePlanCard');
    const proPlanCard = document.getElementById('proPlanCard');
    const proMemberBadge = proPlanCard.querySelector('.pro-highlight');

    try {
        const userRes = await axios.get('/user-subscription');
        const {
            isPremium,
            expiryDate
        } = userRes.data;

        if (isPremium) {
            // Hide Free Plan card
            if (freePlanCard) freePlanCard.style.display = 'none';

            // Update Pro Plan card to show active badge and styling
            if (proPlanCard) {
                proPlanCard.classList.add('border-blue-500');
            }

            if (proMemberBadge) {
                proMemberBadge.classList.remove('bg-blue-600');
                proMemberBadge.classList.add('bg-blue-600');
                proMemberBadge.textContent = 'ACTIVE';
            }

            // Disable upgrade button and show expiry date
            if (upgradeBtn) {
                upgradeBtn.disabled = true;
                upgradeBtn.textContent = `Active until ${new Date(expiryDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                })}`;
                upgradeBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                upgradeBtn.classList.add('bg-blue-600', 'hover:bg-blue-700', 'cursor-default');
            }

        } else {
            // Free user experience
            if (upgradeBtn) {
                upgradeBtn.addEventListener('click', handleUpgradeClick);
            }
        }
    } catch (error) {
        if (error.response?.status === 401) {
            // Not logged in
            if (upgradeBtn) {
                upgradeBtn.textContent = 'Login to Upgrade';
                upgradeBtn.addEventListener('click', () => {
                    window.location.href = '/login?return=/pricing';
                });
            }
        } else {
            console.error('Error loading subscription:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load subscription details',
            });
        }
    }

    async function handleUpgradeClick() {
        try {
            if (!upgradeBtn) return;
            upgradeBtn.disabled = true;
            upgradeBtn.innerHTML = `
                <span class="inline-flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                </span>
            `;

            const response = await axios.post('/init-payment', {
                amount: 500
            });

            if (response.data.url) {
                window.location.href = response.data.url;
            } else {
                throw new Error('Payment gateway URL not returned');
            }
        } catch (error) {
            let message = 'Failed to initiate payment. Please try again.';

            if (error.response) {
                if (error.response.status === 401) {
                    message = 'Please login to continue.';
                    await Swal.fire({
                        icon: 'warning',
                        title: 'Login Required',
                        text: message,
                        confirmButtonText: 'Go to Login',
                    });
                    window.location.href = '/login?return=/pricing';
                    return;
                } else if (error.response.status === 400) {
                    message = error.response.data?.message || 'You already have an active premium subscription.';
                }
            } else {
                message = error.message || message;
            }

            await Swal.fire({
                icon: 'error',
                title: 'Payment Error',
                text: message,
            });

            if (upgradeBtn) {
                upgradeBtn.disabled = false;
                upgradeBtn.textContent = 'Upgrade to Pro';
            }
        }
    }
    document.getElementById('mainContent').classList.remove('hidden');
});
