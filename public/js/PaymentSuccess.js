const displayFields = {
    amount: 'Amount',
    currency: 'Currency',
    transactionId: 'Bank Transaction ID',
    status: 'Status',
    payment_date: 'Payment Date',
};

function getQueryParams() {
    return Object.fromEntries(new URLSearchParams(window.location.search));
}

document.addEventListener('DOMContentLoaded', async () => {
    const params = getQueryParams();
    if (!params?.tran_id) return alert('Transaction ID missing.');

    try {
        const res = await fetch(`/payment-details?tran_id=${encodeURIComponent(params?.tran_id)}`);
        if (!res.ok) {
            if (res.status === 401) alert('Please log in to view payment details.');
            else if (res.status === 404) alert('Payment details not found.');
            else alert('Failed to load payment details.');
            return;
        }

        const data = await res.json();
        console.log(data);
        const ul = document.getElementById('payment-details');
        ul.innerHTML = ''; // Clear old items

        Object.entries(displayFields).forEach(([key, label]) => {
            const li = document.createElement('li');
            const value =
                key === 'payment_date' && data[key] ? new Date(data[key]).toLocaleString() : data[key] || 'N/A';
            li.innerHTML = `<strong>${label}:</strong> ${value}`;
            ul.appendChild(li);
        });
    } catch (err) {
        console.error(err);
        alert('Unable to load payment details.');
    }
});
