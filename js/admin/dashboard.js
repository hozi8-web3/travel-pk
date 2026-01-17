// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function () {
    try {
        // Get data from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const hotels = JSON.parse(localStorage.getItem('hotels')) || [];
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];

        // Update stats cards
        const statsCards = document.querySelectorAll('.row.g-3 .card');
        if (statsCards.length >= 4) {
            const totalRevenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);
            const activeBookings = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending').length;

            const revenueEl = statsCards[0].querySelector('.fs-4');
            const bookingsEl = statsCards[1].querySelector('.fs-4');
            const usersEl = statsCards[2].querySelector('.fs-4');
            const hotelsEl = statsCards[3].querySelector('.fs-4');

            if (revenueEl) revenueEl.textContent = `PKR ${(totalRevenue / 1000000).toFixed(1)}M`;
            if (bookingsEl) bookingsEl.textContent = activeBookings;
            if (usersEl) usersEl.textContent = users.length;
            if (hotelsEl) hotelsEl.textContent = hotels.length;
        }

        // Render bookings table
        const bookingsTable = document.querySelector('.table.table-hover tbody');
        if (bookingsTable) {
            if (bookings.length === 0) {
                bookingsTable.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No bookings found.</td></tr>';
            } else {
                const sortedBookings = [...bookings].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
                bookingsTable.innerHTML = sortedBookings.slice(0, 5).map(booking => {
                    const user = users.find(u => u.id === booking.userId);
                    const hotel = hotels.find(h => h.id === booking.hotelId);
                    const status = booking.status || 'Pending';
                    let badgeClass = 'bg-secondary';
                    if (status === 'Confirmed') badgeClass = 'bg-success';
                    else if (status === 'Pending') badgeClass = 'bg-warning text-dark';
                    else if (status === 'Cancelled') badgeClass = 'bg-danger';

                    let actionBtn = '';
                    if (status === 'Pending') {
                        actionBtn = `<button onclick="approveBooking(${booking.id})" class="btn btn-sm btn-success py-0 px-2 small">Approve</button>`;
                    } else if (status === 'Confirmed') {
                        actionBtn = '<span class="text-success small"><i class="bi bi-check-circle-fill"></i> Done</span>';
                    }

                    return `
                        <tr>
                            <td>#BK-${String(booking.id || '').padStart(3, '0')}</td>
                            <td class="fw-medium">${user ? user.name : 'Unknown'}</td>
                            <td>${hotel ? hotel.name : 'Unknown'}</td>
                            <td>${booking.date ? new Date(booking.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</td>
                            <td><span class="badge ${badgeClass}">${status}</span></td>
                            <td>PKR ${(booking.amount || 0).toLocaleString()}</td>
                            <td>${actionBtn}</td>
                        </tr>
                    `;
                }).join('');
            }
        }
    } catch (error) {
        console.error('Dashboard error:', error);
    }
});

// Function to approve booking
function approveBooking(bookingId) {
    if (confirm('Are you sure you want to approve this booking?')) {
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        const bookingIndex = bookings.findIndex(b => b.id === bookingId);

        if (bookingIndex !== -1) {
            bookings[bookingIndex].status = 'Confirmed';
            localStorage.setItem('bookings', JSON.stringify(bookings));

            // Reload page to reflect changes
            window.location.reload();
        }
    }
}

