document.addEventListener('DOMContentLoaded', async () => {
    const freePlanCard = document.getElementById('freePlanCard');
    const proPlanCard = document.getElementById('proPlanCard');
    const yearlyPlanCard = document.getElementById('yearlyPlanCard');

    const proBtn = document.getElementById('proPlanBtn');
    const yearlyBtn = document.getElementById('yearlyPlanBtn');

    const planMap = {
        monthly: { card: proPlanCard, btn: proBtn },
        yearly: { card: yearlyPlanCard, btn: yearlyBtn },
    };

    function setActivePlanUI(duration, expiryDate) {
        // Hide all non-active plans
        [freePlanCard, proPlanCard, yearlyPlanCard].forEach((card) => card?.classList.add('hidden'));

        // Show and highlight active plan
        const { card, btn } = planMap[duration];
        card?.classList.remove('hidden');
        card?.classList.add('border-blue-500');

        const badge = card?.querySelector('.pro-highlight');
        if (badge) {
            badge.textContent = 'ACTIVE';
            badge.classList.add('bg-blue-600', 'text-white');
        }

        if (btn) {
            btn.disabled = true;
            btn.classList.add('cursor-default');
            btn.textContent = `Active until ${new Date(expiryDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            })}`;
        }
    }

    // Load subscription status
    try {
        const { data } = await axios.get('/user-subscription');
        const { isPremium, expiryDate, duration } = data;

        if (isPremium) {
            setActivePlanUI(duration, expiryDate);
        } else {
            // Show free plan
            freePlanCard?.classList.remove('hidden');
            proPlanCard?.classList.remove('hidden');
            yearlyPlanCard?.classList.remove('hidden');

            // Attach upgrade handlers
            proBtn?.addEventListener('click', () => handleUpgradeClick(10, 'USD', 'monthly'));
            yearlyBtn?.addEventListener('click', () => handleUpgradeClick(100, 'USD', 'yearly'));
        }
    } catch (err) {
        if (err.response?.status === 401) {
            [proBtn, yearlyBtn].forEach((btn) => {
                if (!btn) return;
                btn.textContent = 'Login to Upgrade';
                btn.addEventListener('click', () => (window.location.href = '/login?return=/pricing'));
            });
        } else {
            console.error('Subscription load error:', err);
            Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load subscription details' });
        }
    }

    async function handleUpgradeClick(amount, currency, duration) {
        const { btn } = planMap[duration] || {};
        if (!btn) return;

        btn.disabled = true;
        btn.innerHTML = `
            <span class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
            </span>
        `;

        try {
            const res = await axios.post('/init-payment', { amount, currency, duration });

            if (res.data.url) {
                window.location.href = res.data.url;
            } else throw new Error('Payment URL not returned');
        } catch (err) {
            let msg = 'Failed to initiate payment. Please try again.';
            if (err.response) {
                if (err.response.status === 401) {
                    await Swal.fire({
                        icon: 'warning',
                        title: 'Login Required',
                        text: 'Please login to continue',
                        confirmButtonText: 'Go to Login',
                    });
                    return (window.location.href = '/login?return=/pricing');
                } else if (err.response.status === 400) {
                    msg = err.response.data?.message || msg;
                }
            } else {
                msg = err.message || msg;
            }

            await Swal.fire({ icon: 'error', title: 'Payment Error', text: msg });
            btn.disabled = false;
            btn.textContent = duration === 'monthly' ? 'Upgrade to Premium' : 'Choose Premium Plus';
        }
    }

    document.getElementById('mainContent')?.classList.remove('hidden');
});
