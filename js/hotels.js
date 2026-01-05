// User-side Hotels Page with Sorting and Pagination

document.addEventListener('DOMContentLoaded', function () {
    const hotelsList = document.getElementById('hotelsList');
    const hotelCount = document.getElementById('hotelCount');
    const sortSelect = document.getElementById('sortSelect');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');

    if (!hotelsList) return; // Exit if not on hotels page

    // Pagination settings
    const ITEMS_PER_PAGE = 5;
    let currentPage = 1;
    let filteredHotels = [];

    // Load hotels from localStorage (set by admin) or use default
    const hotelsData = JSON.parse(localStorage.getItem('hotels')) || [];
    const defaultHotels = [
        { name: 'Pearl Continental Hotel', city: 'Lahore', price: 25000, rating: 5, image: 'assets/pc.jpg', location: 'Mall Road, Lahore', amenities: ['WiFi', 'Pool', 'Gym'] },
        { name: 'Serena Hotel Islamabad', city: 'Islamabad', price: 30000, rating: 5, image: 'assets/serena.webp', location: 'Khayaban-e-Suharwardy, Islamabad', amenities: ['WiFi', 'Spa', 'Restaurant'] },
        { name: 'Avari Hotel Lahore', city: 'Lahore', price: 22000, rating: 4.5, image: 'assets/pc.jpg', location: 'Mall Road, Lahore', amenities: ['WiFi', 'Spa'] },
        { name: 'Marriott Karachi', city: 'Karachi', price: 28000, rating: 4.8, image: 'assets/hotel.png', location: 'Abdullah Haroon Road, Karachi', amenities: ['WiFi', 'Pool', 'Gym'] },
        { name: 'PC Hotel Karachi', city: 'Karachi', price: 24000, rating: 4.7, image: 'assets/pc.jpg', location: 'Club Road, Karachi', amenities: ['WiFi', 'Restaurant'] },
        { name: 'Hunza Serena Inn', city: 'Hunza', price: 18000, rating: 4.6, image: 'assets/hotel.png', location: 'Karimabad, Hunza', amenities: ['WiFi', 'Mountain View'] },
        { name: 'Swat Serena Hotel', city: 'Swat', price: 20000, rating: 4.5, image: 'assets/hotel.png', location: 'Saidu Sharif, Swat', amenities: ['WiFi', 'Garden'] },
        { name: 'Gwadar Golf Resort', city: 'Gwadar', price: 15000, rating: 4.2, image: 'assets/gor.jpeg', location: 'Gwadar Port, Gwadar', amenities: ['Beach View', 'WiFi'] }
    ];

    // Convert hotelsData to display format
    const allHotels = hotelsData.length > 0
        ? hotelsData.map(hotel => ({
            name: hotel.name,
            city: hotel.city,
            price: hotel.price || 0,
            rating: hotel.rating || 0,
            image: hotel.image ? hotel.image.replace('../assets/', 'assets/') : 'assets/hotel.png',
            location: hotel.city,
            amenities: ['WiFi', 'Modern Amenities']
        }))
        : defaultHotels;

    // Sorting function
    function sortHotels(hotels, sortBy) {
        const sorted = [...hotels];
        switch (sortBy) {
            case 'price-asc':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return sorted.sort((a, b) => b.price - a.price);
            case 'rating-desc':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'name-asc':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'recommended':
            default:
                return sorted.sort((a, b) => b.rating - a.rating);
        }
    }

    // Render hotels for current page
    function renderHotels() {
        if (!hotelsList) return;

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const hotelsToShow = filteredHotels.slice(startIndex, endIndex);

        if (hotelsToShow.length === 0) {
            hotelsList.innerHTML = '<div class="text-center text-muted py-5">No hotels found.</div>';
            if (hotelCount) hotelCount.textContent = 'No hotels available';
            updatePagination();
            return;
        }

        // Update count
        if (hotelCount) {
            hotelCount.textContent = `Showing ${filteredHotels.length} Hotel${filteredHotels.length !== 1 ? 's' : ''}`;
        }

        hotelsList.innerHTML = hotelsToShow.map(hotel => `
            <div class="card mb-4 border-0 shadow-sm overflow-hidden">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${hotel.image}" class="img-fluid h-100 object-fit-cover" alt="${hotel.name}" onerror="this.src='assets/hotel.png'">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <h5 class="card-title fw-bold">${hotel.name}</h5>
                                <h5 class="fw-bold" style="color: var(--primary-color);">PKR ${hotel.price.toLocaleString()}</h5>
                            </div>
                            <div class="text-warning small mb-2">${getStarRating(hotel.rating)} (${Math.floor(Math.random() * 500 + 100)} Reviews)</div>
                            <p class="card-text text-muted small mb-2">${hotel.location}</p>
                            <p class="card-text small text-secondary mb-3">Enjoy a comfortable stay with excellent amenities and services.</p>
                            
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="small text-muted">
                                    ${hotel.amenities.slice(0, 2).map(a => `<span class="me-2 badge bg-light text-dark">${a}</span>`).join('')}
                                </div>
                                <a href="booking.html" class="btn btn-primary">Book Now</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        updatePagination();
    }

    // Get star rating display
    function getStarRating(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        let stars = '★'.repeat(fullStars);
        if (halfStar && fullStars < 5) stars += '☆';
        while (stars.length < 5) stars += '☆';
        return stars;
    }

    // Update pagination controls
    function updatePagination() {
        const totalPages = Math.ceil(filteredHotels.length / ITEMS_PER_PAGE);

        if (pageInfo) {
            pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;
        }

        if (prevPageBtn) {
            prevPageBtn.disabled = currentPage === 1;
        }

        if (nextPageBtn) {
            nextPageBtn.disabled = currentPage >= totalPages || totalPages === 0;
        }
    }

    // Sort and render
    function sortAndRender() {
        const sortBy = sortSelect ? sortSelect.value : 'recommended';
        filteredHotels = sortHotels(allHotels, sortBy);
        currentPage = 1; // Reset to page 1 when sorting
        renderHotels();
    }

    // Sort select handler
    if (sortSelect) {
        sortSelect.addEventListener('change', sortAndRender);
    }

    // Pagination button handlers
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderHotels();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredHotels.length / ITEMS_PER_PAGE);
            if (currentPage < totalPages) {
                currentPage++;
                renderHotels();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // Initial render
    filteredHotels = allHotels;
    sortAndRender();

    // Update header for auth
    if (typeof updateHeaderForAuth === 'function') {
        updateHeaderForAuth();
    }
});
