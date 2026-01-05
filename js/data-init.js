// Data Initialization for Demo Data
// This file ensures demo data is available for admin panel

function initializeDemoData() {
    // Initialize Hotels
    if (!localStorage.getItem('hotels')) {
        const demoHotels = [
            {
                id: 1,
                name: 'Pearl Continental',
                city: 'Lahore',
                price: 25000,
                status: 'Active',
                image: '../assets/pc.jpg'
            },
            {
                id: 2,
                name: 'Serena Hotel',
                city: 'Islamabad',
                price: 30000,
                status: 'Active',
                image: '../assets/serena.webp'
            },
            {
                id: 3,
                name: 'Gwadar Ocean Resort',
                city: 'Gwadar',
                price: 15000,
                status: 'Active',
                image: '../assets/gor.jpeg'
            }
        ];
        localStorage.setItem('hotels', JSON.stringify(demoHotels));
    }

    // Initialize Cities
    if (!localStorage.getItem('cities')) {
        const demoCities = [
            {
                id: 1,
                name: 'Lahore',
                type: 'Historical',
                rating: 4.8,
                image: '../assets/lahore.jpg'
            },
            {
                id: 2,
                name: 'Hunza',
                type: 'Cold Weather',
                rating: 4.9,
                image: '../assets/hunza.jpg'
            },
            {
                id: 3,
                name: 'Islamabad',
                type: 'City Life',
                rating: 4.7,
                image: '../assets/islamabad.jpg'
            },
            {
                id: 4,
                name: 'Karachi',
                type: 'City Life',
                rating: 4.5,
                image: '../assets/karachi.jpg'
            },
            {
                id: 5,
                name: 'Gwadar',
                type: 'Beach',
                rating: 4.2,
                image: '../assets/gor.jpeg'
            },
            {
                id: 6,
                name: 'Swat',
                type: 'Cold Weather',
                rating: 4.6,
                image: '../assets/swat.jpg'
            }
        ];
        localStorage.setItem('cities', JSON.stringify(demoCities));
    }

    // Initialize Promo Codes
    if (!localStorage.getItem('promos')) {
        const demoPromos = [
            {
                id: 1,
                code: 'WELCOME10',
                discount: 10,
                validUntil: '2024-12-31',
                usage: 124,
                status: 'Active'
            },
            {
                id: 2,
                code: 'SUMMER20',
                discount: 20,
                validUntil: '2024-08-30',
                usage: 50,
                status: 'Expired'
            }
        ];
        localStorage.setItem('promos', JSON.stringify(demoPromos));
    }

    // Initialize Bookings for Dashboard
    if (!localStorage.getItem('bookings')) {
        const demoBookings = [
            { id: 1, userId: 2, hotelId: 1, date: '2024-12-12', status: 'Confirmed', amount: 45000 },
            { id: 2, userId: 3, hotelId: 2, date: '2024-12-11', status: 'Pending', amount: 30000 },
            { id: 3, userId: 1, hotelId: 3, date: '2024-12-10', status: 'Cancelled', amount: 15000 }
        ];
        localStorage.setItem('bookings', JSON.stringify(demoBookings));
    }
}

// Call initialization
initializeDemoData();

