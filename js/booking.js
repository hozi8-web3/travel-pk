// Booking Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Require authentication
        if (!requireAuth()) {
            return;
        }

        const currentUser = getCurrentUser();
        if (!currentUser) return;

        // Get hotel ID from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const hotelId = parseInt(urlParams.get('hotelId')) || 1; // Default to 1 if not provided

        const hotels = JSON.parse(localStorage.getItem('hotels')) || [];
        const hotel = hotels.find(h => h.id === hotelId) || hotels[0];

        // Update price summary
        const hotelImage = document.querySelector('.card.p-4.shadow-sm img');
        const hotelName = document.querySelector('.card.p-4.shadow-sm h6');
        if (hotelImage && hotel.image) hotelImage.src = hotel.image;
        if (hotelName) hotelName.textContent = hotel.name || 'Hotel';

        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        const checkInInput = document.querySelector('input[type="date"]');
        const checkOutInput = document.querySelectorAll('input[type="date"]')[1];
        if (checkInInput) {
            checkInInput.min = today;
            checkInInput.addEventListener('change', function() {
                if (checkOutInput && this.value) {
                    const checkInDate = new Date(this.value);
                    checkInDate.setDate(checkInDate.getDate() + 1);
                    checkOutInput.min = checkInDate.toISOString().split('T')[0];
                }
            });
        }

        // Handle form submission
        const bookingForm = document.querySelector('form');
        if (bookingForm) {
            bookingForm.addEventListener('submit', function(e) {
                e.preventDefault();

                const checkIn = checkInInput?.value;
                const checkOut = checkOutInput?.value;
                const guests = bookingForm.querySelector('select')?.value;
                const rooms = bookingForm.querySelectorAll('select')[1]?.value;

                if (!checkIn || !checkOut) {
                    alert('Please select check-in and check-out dates.');
                    return;
                }

                if (new Date(checkOut) <= new Date(checkIn)) {
                    alert('Check-out date must be after check-in date.');
                    return;
                }

                // Calculate nights and amount
                const checkInDate = new Date(checkIn);
                const checkOutDate = new Date(checkOut);
                const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
                const baseAmount = (hotel.price || 25000) * nights;
                const tax = baseAmount * 0.1; // 10% tax
                const totalAmount = baseAmount + tax;

                // Save booking
                const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
                const newBookingId = bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 1;
                
                const newBooking = {
                    id: newBookingId,
                    userId: currentUser.id,
                    hotelId: hotel.id,
                    date: new Date().toISOString().split('T')[0],
                    checkIn: checkIn,
                    checkOut: checkOut,
                    guests: guests || '2 Adults, 0 Children',
                    rooms: rooms || '1 Room',
                    amount: totalAmount,
                    status: 'Pending',
                    createdAt: new Date().toISOString()
                };

                bookings.push(newBooking);
                localStorage.setItem('bookings', JSON.stringify(bookings));

                // Show success message and redirect
                alert('Booking confirmed! Redirecting to dashboard...');
                window.location.href = 'dashboard.html';
            });
        }

        // Update price summary on date change
        function updatePrice() {
            const checkIn = checkInInput?.value;
            const checkOut = checkOutInput?.value;
            if (checkIn && checkOut) {
                const checkInDate = new Date(checkIn);
                const checkOutDate = new Date(checkOut);
                const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
                const baseAmount = (hotel.price || 25000) * nights;
                const tax = baseAmount * 0.1;
                const totalAmount = baseAmount + tax;

                const nightsText = document.querySelector('.d-flex.justify-content-between.mb-2.small span');
                const totalText = document.querySelector('.fw-bold.fs-5');
                
                if (nightsText) nightsText.textContent = `1 Room, ${nights} Night${nights > 1 ? 's' : ''}`;
                if (totalText) totalText.textContent = `PKR ${totalAmount.toLocaleString()}`;
            }
        }

        if (checkInInput) checkInInput.addEventListener('change', updatePrice);
        if (checkOutInput) checkOutInput.addEventListener('change', updatePrice);
    } catch (error) {
        console.error('Booking page error:', error);
    }
});

