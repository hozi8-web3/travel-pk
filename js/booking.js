// Booking Page JavaScript
document.addEventListener('DOMContentLoaded', function () {
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

        // Load hotels with same transformation as hotels.js
        const hotelsData = JSON.parse(localStorage.getItem('hotels')) || [];
        const defaultHotels = [
            { id: 1, name: 'Pearl Continental Hotel', city: 'Lahore', price: 25000, rating: 5, image: 'assets/pc.jpg', location: 'Mall Road, Lahore', amenities: ['WiFi', 'Pool', 'Gym'] },
            { id: 2, name: 'Serena Hotel Islamabad', city: 'Islamabad', price: 30000, rating: 5, image: 'assets/serena.webp', location: 'Khayaban-e-Suharwardy, Islamabad', amenities: ['WiFi', 'Spa', 'Restaurant'] },
            { id: 3, name: 'Avari Hotel Lahore', city: 'Lahore', price: 22000, rating: 4.5, image: 'assets/pc.jpg', location: 'Mall Road, Lahore', amenities: ['WiFi', 'Spa'] },
            { id: 4, name: 'Marriott Karachi', city: 'Karachi', price: 28000, rating: 4.8, image: 'assets/hotel.png', location: 'Abdullah Haroon Road, Karachi', amenities: ['WiFi', 'Pool', 'Gym'] },
            { id: 5, name: 'PC Hotel Karachi', city: 'Karachi', price: 24000, rating: 4.7, image: 'assets/pc.jpg', location: 'Club Road, Karachi', amenities: ['WiFi', 'Restaurant'] },
            { id: 6, name: 'Hunza Serena Inn', city: 'Hunza', price: 18000, rating: 4.6, image: 'assets/hotel.png', location: 'Karimabad, Hunza', amenities: ['WiFi', 'Mountain View'] },
            { id: 7, name: 'Swat Serena Hotel', city: 'Swat', price: 20000, rating: 4.5, image: 'assets/hotel.png', location: 'Saidu Sharif, Swat', amenities: ['WiFi', 'Garden'] },
            { id: 8, name: 'Gwadar Golf Resort', city: 'Gwadar', price: 15000, rating: 4.2, image: 'assets/gor.jpeg', location: 'Gwadar Port, Gwadar', amenities: ['Beach View', 'WiFi'] }
        ];

        // Convert hotelsData to same format as hotels.js
        const allHotels = hotelsData.length > 0
            ? hotelsData.map(hotel => ({
                id: hotel.id,
                name: hotel.name,
                city: hotel.city,
                price: hotel.price || 0,
                rating: hotel.rating || 0,
                image: hotel.image ? hotel.image.replace('../assets/', 'assets/') : 'assets/hotel.png',
                location: hotel.city,
                amenities: ['WiFi', 'Modern Amenities']
            }))
            : defaultHotels;

        const hotel = allHotels.find(h => h.id === hotelId) || allHotels[0];

        // Update price summary
        const hotelImage = document.getElementById('hotelImage');
        const hotelName = document.getElementById('hotelName');
        const hotelRating = document.getElementById('hotelRating');

        if (hotelImage && hotel.image) {
            hotelImage.src = hotel.image;
            hotelImage.onerror = function () {
                this.src = 'assets/hotel.png'; // Fallback image
            };
        }
        if (hotelName) hotelName.textContent = hotel.name || 'Hotel';
        if (hotelRating && hotel.rating) {
            const fullStars = Math.floor(hotel.rating);
            const halfStar = hotel.rating % 1 >= 0.5;
            let stars = '★'.repeat(fullStars);
            if (halfStar && fullStars < 5) stars += '☆';
            while (stars.length < 5) stars += '☆';
            hotelRating.textContent = stars;
        }

        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        const checkInInput = document.querySelector('input[type="date"]');
        const checkOutInput = document.querySelectorAll('input[type="date"]')[1];
        if (checkInInput) {
            checkInInput.min = today;
            checkInInput.addEventListener('change', function () {
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
            bookingForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const checkIn = checkInInput?.value;
                const checkOut = checkOutInput?.value;
                const adults = document.getElementById('adultsSelect')?.value || '2';
                const children = document.getElementById('childrenSelect')?.value || '0';
                const rooms = document.getElementById('roomsSelect')?.value || '1';

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
                    adults: adults,
                    children: children,
                    guests: `${adults} Adult${adults > 1 ? 's' : ''}, ${children} Child${children > 1 ? 'ren' : children == 1 ? '' : 'ren'}`,
                    rooms: `${rooms} Room${rooms > 1 ? 's' : ''}`,
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

