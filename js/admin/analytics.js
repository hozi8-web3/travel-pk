// Admin Analytics JavaScript

// Helper functions for export
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function exportToCSV() {
    const bookingsData = JSON.parse(localStorage.getItem('bookings')) || [];
    const citiesData = JSON.parse(localStorage.getItem('cities')) || [];
    const hotelsData = JSON.parse(localStorage.getItem('hotels')) || [];

    // Create CSV content
    let csv = 'Tourism Booking System - Analytics Export\n\n';

    // Bookings section
    csv += '=== BOOKINGS ===\n';
    csv += 'ID,User ID,Hotel ID,Check-in,Check-out,Amount,Status\n';
    bookingsData.forEach(booking => {
        csv += `${booking.id || ''},${booking.userId || ''},${booking.hotelId || ''},${booking.checkIn || ''},${booking.checkOut || ''},${booking.amount || ''},${booking.status || ''}\n`;
    });

    csv += '\n=== CITIES ===\n';
    csv += 'ID,Name,Type,Rating\n';
    citiesData.forEach(city => {
        csv += `${city.id || ''},${city.name || ''},${city.type || ''},${city.rating || 0}\n`;
    });

    csv += '\n=== HOTELS ===\n';
    csv += 'ID,Name,City,Price,Status\n';
    hotelsData.forEach(hotel => {
        csv += `${hotel.id || ''},${hotel.name || ''},${hotel.city || ''},${hotel.price || 0},${hotel.status || ''}\n`;
    });

    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(csv, `analytics_export_${timestamp}.csv`, 'text/csv');
}

function exportToJSON() {
    const bookingsData = JSON.parse(localStorage.getItem('bookings')) || [];
    const citiesData = JSON.parse(localStorage.getItem('cities')) || [];
    const hotelsData = JSON.parse(localStorage.getItem('hotels')) || [];
    const usersData = JSON.parse(localStorage.getItem('users')) || [];

    // Create JSON structure
    const exportData = {
        exportDate: new Date().toISOString(),
        project: 'AICT Tourism Booking System',
        analytics: {
            bookings: {
                count: bookingsData.length,
                data: bookingsData
            },
            cities: {
                count: citiesData.length,
                data: citiesData
            },
            hotels: {
                count: hotelsData.length,
                data: hotelsData
            },
            users: {
                count: usersData.length,
                // Remove passwords from export
                data: usersData.map(u => {
                    const { password, ...userWithoutPassword } = u;
                    return userWithoutPassword;
                })
            }
        }
    };

    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(JSON.stringify(exportData, null, 2), `analytics_export_${timestamp}.json`, 'application/json');
}

document.addEventListener('DOMContentLoaded', function () {
    try {
        const citiesData = JSON.parse(localStorage.getItem('cities')) || [];
        const hotelsData = JSON.parse(localStorage.getItem('hotels')) || [];
        const bookingsData = JSON.parse(localStorage.getItem('bookings')) || [];

        // Create lookup maps for better performance
        const hotelLookup = new Map(hotelsData.map(h => [h.id, h]));
        const cityBookingCounts = new Map();
        const hotelRevenue = new Map();

        bookingsData.forEach(booking => {
            const hotel = hotelLookup.get(booking.hotelId);
            if (hotel) {
                cityBookingCounts.set(hotel.city, (cityBookingCounts.get(hotel.city) || 0) + 1);
                hotelRevenue.set(booking.hotelId, (hotelRevenue.get(booking.hotelId) || 0) + (booking.amount || 0));
            }
        });

        // Find Top Cities card by header text
        const cardHeaders = Array.from(document.querySelectorAll('.card-header'));
        const topCitiesHeader = cardHeaders.find(h => h.textContent.includes('Top 5 Cities'));
        const topHotelsHeader = cardHeaders.find(h => h.textContent.includes('Top Hotels'));

        // Top Cities
        if (topCitiesHeader) {
            const topCitiesList = topCitiesHeader.parentElement.querySelector('ul');
            if (topCitiesList) {
                const topCities = citiesData.map(city => ({
                    name: city.name,
                    bookings: cityBookingCounts.get(city.name) || Math.floor(Math.random() * 100) + 50
                })).sort((a, b) => b.bookings - a.bookings).slice(0, 5);

                topCitiesList.innerHTML = topCities.map(city => `
                    <li class="list-group-item d-flex justify-content-between">
                        <span>${city.name}</span>
                        <span class="fw-bold">${city.bookings}</span>
                    </li>
                `).join('');
            }
        }

        // Top Hotels
        if (topHotelsHeader) {
            const topHotelsList = topHotelsHeader.parentElement.querySelector('ul');
            if (topHotelsList) {
                const topHotels = hotelsData.map(hotel => ({
                    name: hotel.name,
                    revenue: hotelRevenue.get(hotel.id) || Math.floor(Math.random() * 3000000) + 2000000
                })).sort((a, b) => b.revenue - a.revenue).slice(0, 3);

                topHotelsList.innerHTML = topHotels.map(hotel => `
                    <li class="list-group-item d-flex justify-content-between">
                        <span>${hotel.name}</span>
                        <span class="fw-bold">${(hotel.revenue / 1000000).toFixed(1)}M</span>
                    </li>
                `).join('');
            }
        }

        // Add export button event listeners
        const exportCSVBtn = document.getElementById('exportCSV');
        const exportJSONBtn = document.getElementById('exportJSON');

        if (exportCSVBtn) {
            exportCSVBtn.addEventListener('click', function (e) {
                e.preventDefault();
                exportToCSV();
            });
        }

        if (exportJSONBtn) {
            exportJSONBtn.addEventListener('click', function (e) {
                e.preventDefault();
                exportToJSON();
            });
        }
    } catch (error) {
        console.error('Analytics error:', error);
    }
});
