// User Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) return;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const hotels = JSON.parse(localStorage.getItem('hotels')) || [];
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];

        // Filter bookings for current user
        const userBookings = bookings.filter(b => b.userId === currentUser.id);
        const activeBookings = userBookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending');
        const totalBookings = userBookings.length;

        // Update stats
        const statsCards = document.querySelectorAll('.row.g-3 .card');
        if (statsCards.length >= 4) {
            const totalBookingsEl = statsCards[0].querySelector('.display-6, .fs-4');
            const activeTripsEl = statsCards[1].querySelector('.display-6, .fs-4');
            const pointsEl = statsCards[2].querySelector('.display-6, .fs-4');
            const savedEl = statsCards[3].querySelector('.display-6, .fs-4');

            if (totalBookingsEl) totalBookingsEl.textContent = totalBookings;
            if (activeTripsEl) activeTripsEl.textContent = activeBookings.length;
            if (pointsEl) pointsEl.textContent = (totalBookings * 100).toString();
            if (savedEl) {
                const totalSaved = userBookings.reduce((sum, b) => sum + (b.discountAmount || 0), 0);
                savedEl.textContent = totalSaved > 0 ? `${(totalSaved / 1000).toFixed(0)}k` : '0';
            }
        }

        // Render active bookings
        const activeBookingContainer = document.getElementById('activeBookingContainer');
        if (activeBookingContainer) {
            if (activeBookings.length > 0) {
                const booking = activeBookings[0];
                const hotel = hotels.find(h => h.id === booking.hotelId);
                
                activeBookingContainer.innerHTML = `
                    <div class="card border-0 shadow-sm mb-4">
                        <div class="row g-0">
                            <div class="col-md-4">
                                <img src="${hotel?.image || 'assets/hotel.png'}" class="img-fluid h-100 object-fit-cover rounded-start" alt="Hotel" style="height: 200px; object-fit: cover;" onerror="this.src='assets/hotel.png'">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between">
                                        <h5 class="card-title fw-bold">${hotel?.name || 'Hotel'}</h5>
                                        <span class="badge bg-${booking.status === 'Confirmed' ? 'success' : 'warning'} bg-opacity-10 text-${booking.status === 'Confirmed' ? 'success' : 'warning'} border border-${booking.status === 'Confirmed' ? 'success' : 'warning'} px-3">${booking.status}</span>
                                    </div>
                                    <p class="text-muted small mb-3">Check-in: ${new Date(booking.checkIn || booking.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} | Check-out: ${new Date(booking.checkOut || booking.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                    <div class="d-flex gap-2">
                                        <button class="btn btn-primary btn-sm" onclick="viewBooking(${booking.id})">View Ticket</button>
                                        <button class="btn btn-outline-danger btn-sm" onclick="cancelBooking(${booking.id})">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                activeBookingContainer.innerHTML = `
                    <div class="card border-0 shadow-sm mb-4">
                        <div class="card-body text-center py-5">
                            <p class="text-muted">No active bookings. <a href="cities.html">Start exploring!</a></p>
                        </div>
                    </div>
                `;
            }
        }

        // Render all bookings
        const allBookingsContainer = document.getElementById('allBookingsContainer');
        if (allBookingsContainer) {
            if (userBookings.length > 0) {
                allBookingsContainer.innerHTML = `
                    <div class="card border-0 shadow-sm">
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover mb-0">
                                    <thead class="table-light">
                                        <tr>
                                            <th>Booking ID</th>
                                            <th>Hotel</th>
                                            <th>Date</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${userBookings.map(booking => {
                                            const hotel = hotels.find(h => h.id === booking.hotelId);
                                            let statusClass = 'secondary';
                                            if (booking.status === 'Confirmed') statusClass = 'success';
                                            else if (booking.status === 'Pending') statusClass = 'warning';
                                            else if (booking.status === 'Cancelled') statusClass = 'danger';
                                            
                                            return `
                                                <tr>
                                                    <td>#BK-${String(booking.id).padStart(3, '0')}</td>
                                                    <td>${hotel?.name || 'Unknown'}</td>
                                                    <td>${new Date(booking.date || new Date()).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                                    <td>PKR ${(booking.amount || 0).toLocaleString()}</td>
                                                    <td><span class="badge bg-${statusClass}">${booking.status || 'Pending'}</span></td>
                                                    <td>
                                                        <button class="btn btn-sm btn-outline-primary" onclick="viewBooking(${booking.id})">View</button>
                                                        ${booking.status !== 'Cancelled' ? `<button class="btn btn-sm btn-outline-danger" onclick="cancelBooking(${booking.id})">Cancel</button>` : ''}
                                                    </td>
                                                </tr>
                                            `;
                                        }).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                allBookingsContainer.innerHTML = `
                    <div class="card border-0 shadow-sm">
                        <div class="card-body text-center py-5">
                            <p class="text-muted">No bookings yet. <a href="cities.html">Book your first trip!</a></p>
                        </div>
                    </div>
                `;
            }
        }

        // Add booking functions
        window.viewBooking = function(bookingId) {
            const booking = userBookings.find(b => b.id === bookingId);
            if (booking) {
                alert(`Booking #${bookingId}\nHotel: ${hotels.find(h => h.id === booking.hotelId)?.name || 'N/A'}\nAmount: PKR ${(booking.amount || 0).toLocaleString()}`);
            }
        };

        window.cancelBooking = function(bookingId) {
            if (confirm('Are you sure you want to cancel this booking?')) {
                const updatedBookings = bookings.map(b => 
                    b.id === bookingId ? { ...b, status: 'Cancelled' } : b
                );
                localStorage.setItem('bookings', JSON.stringify(updatedBookings));
                location.reload();
            }
        };
    } catch (error) {
        console.error('Dashboard error:', error);
    }
});

