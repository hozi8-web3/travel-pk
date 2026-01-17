// User-side Cities Page with Sorting and Pagination

document.addEventListener('DOMContentLoaded', function () {
    const cityList = document.getElementById('cityList');
    const filterButtons = document.querySelectorAll('#filterButtons .btn');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');

    if (!cityList) return; // Exit if not on cities page

    // Pagination settings
    const ITEMS_PER_PAGE = 6;
    let currentPage = 1;
    let filteredCities = [];
    let selectedCategory = 'All';

    // Load cities from localStorage (set by admin) or use default
    const citiesData = JSON.parse(localStorage.getItem('cities')) || [];
    const defaultCities = [
        { name: 'Lahore', category: 'Historical', rating: 4.8, image: 'assets/lahore.jpg', description: 'Known as the heart of Pakistan, famous for its rich history and food.' },
        { name: 'Hunza', category: 'Cold Weather', rating: 4.9, image: 'assets/hunza.jpg', description: 'A mountainous valley in the Gilgit-Baltistan region of Pakistan.' },
        { name: 'Islamabad', category: 'City Life', rating: 4.7, image: 'assets/islamabad.jpg', description: 'The capital city, known for its greenery and modern architecture.' },
        { name: 'Karachi', category: 'City Life', rating: 4.5, image: 'assets/karachi.jpg', description: 'The city of lights, offering beaches and vibrant city life.' },
        { name: 'Gwadar', category: 'Beach', rating: 4.2, image: 'assets/gor.jpeg', description: 'Emerging port city known for its beautiful coastline.' },
        { name: 'Swat', category: 'Cold Weather', rating: 4.6, image: 'assets/swat.jpg', description: 'Known as the Switzerland of the East.' }
    ];

    // Convert citiesData to display format
    const allCities = citiesData.length > 0
        ? citiesData.map(city => ({
            name: city.name,
            category: city.type,
            rating: city.rating || 0,
            image: city.image.replace('../assets/', 'assets/'),
            description: `${city.name} - A beautiful destination to explore.`
        }))
        : defaultCities;

    // Sorting function
    function sortCities(cities, sortBy) {
        const sorted = [...cities];
        switch (sortBy) {
            case 'name-asc':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'name-desc':
                return sorted.sort((a, b) => b.name.localeCompare(a.name));
            case 'rating-desc':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'rating-asc':
                return sorted.sort((a, b) => a.rating - b.rating);
            default:
                return sorted;
        }
    }

    // Render cities for current page
    function renderCities() {
        if (!cityList) return;

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const citiesToShow = filteredCities.slice(startIndex, endIndex);

        if (citiesToShow.length === 0) {
            cityList.innerHTML = '<div class="col-12 text-center text-muted py-5">No destinations found.</div>';
            updatePagination();
            return;
        }

        cityList.innerHTML = citiesToShow.map(city => `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100">
                    <img src="${city.image}" class="card-img-top" alt="${city.name}" loading="lazy" onerror="this.src='assets/city.png'">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h5 class="card-title mb-0">${city.name}</h5>
                            <span class="badge bg-light text-dark border">${city.category}</span>
                        </div>
                        <div class="text-warning small mb-3">${city.rating > 0 ? '★★★★★ (' + city.rating + ')' : 'New Destination'}</div>
                        <p class="card-text text-muted small">${city.description}</p>
                        <a href="hotels.html" class="btn btn-primary w-100">View Hotels</a>
                    </div>
                </div>
            </div>
        `).join('');

        updatePagination();
    }

    // Update pagination controls
    function updatePagination() {
        const totalPages = Math.ceil(filteredCities.length / ITEMS_PER_PAGE);

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

    // Filter and render
    function filterAndRender() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const sortBy = sortSelect ? sortSelect.value : 'name-asc';

        // Filter by category and search
        let filtered = allCities;
        if (selectedCategory !== 'All' || searchTerm) {
            filtered = allCities.filter(city => {
                const matchesCategory = selectedCategory === 'All' || city.category === selectedCategory;
                const matchesSearch = !searchTerm || city.name.toLowerCase().includes(searchTerm);
                return matchesCategory && matchesSearch;
            });
        }

        // Sort
        filteredCities = sortCities(filtered, sortBy);

        // Reset to page 1 when filtering
        currentPage = 1;
        renderCities();
    }

    // Filter button click handlers
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => {
                    btn.classList.remove('btn-primary');
                    btn.classList.add('btn-outline-secondary', 'bg-white');
                });
                button.classList.add('btn-primary');
                button.classList.remove('btn-outline-secondary', 'bg-white');
                selectedCategory = button.getAttribute('data-category');
                filterAndRender();
            });
        });
    }

    // Search input handler
    if (searchInput) {
        searchInput.addEventListener('input', filterAndRender);
    }

    // Sort select handler
    if (sortSelect) {
        sortSelect.addEventListener('change', filterAndRender);
    }

    // Pagination button handlers
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderCities();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredCities.length / ITEMS_PER_PAGE);
            if (currentPage < totalPages) {
                currentPage++;
                renderCities();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // Initial render
    filteredCities = allCities;

    // Check for search params
    const urlParams = new URLSearchParams(window.location.search);
    const destination = urlParams.get('destination');
    if (destination && searchInput) {
        searchInput.value = destination;
        filterAndRender();
    } else {
        renderCities();
    }
});
