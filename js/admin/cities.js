// Admin Cities Management JavaScript - No Bootstrap Dependencies

let editingId = null;
let cities = [];

// Modal functions
function openModal() {
    const modal = document.getElementById('cityModal');
    if (modal) modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('cityModal');
    if (modal) modal.classList.remove('active');
    resetForm();
}

function saveCities() {
    localStorage.setItem('cities', JSON.stringify(cities));
}

function renderCities() {
    const citiesContainer = document.getElementById('citiesContainer');
    if (!citiesContainer) return;

    if (cities.length === 0) {
        citiesContainer.innerHTML = '<div class="empty-state">No cities found. Add your first city!</div>';
        return;
    }

    citiesContainer.innerHTML = cities.map(city => `
        <div class="item-card">
            <img src="${city.image || '../assets/city.png'}" alt="${city.name}" onerror="this.src='../assets/city.png'">
            <div class="content">
                <div class="title">${city.name}</div>
                <span class="badge">${city.type}</span>
                <div class="actions">
                    <button class="btn btn-secondary btn-sm" onclick="editCity(${city.id})"><i class="bi bi-pencil"></i> Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCity(${city.id})"><i class="bi bi-trash"></i> Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

function resetForm() {
    editingId = null;
    const form = document.getElementById('cityForm');
    const modalTitle = document.getElementById('modalTitle');
    if (form) form.reset();
    if (modalTitle) modalTitle.textContent = 'Add New City';
}

// Global edit function
window.editCity = function (id) {
    const city = cities.find(c => c.id === id);
    if (!city) return;

    editingId = id;
    const nameInput = document.getElementById('cityName');
    const typeSelect = document.getElementById('cityType');
    const modalTitle = document.getElementById('modalTitle');

    if (nameInput) nameInput.value = city.name;
    if (typeSelect) typeSelect.value = city.type;
    if (modalTitle) modalTitle.textContent = 'Edit City';

    openModal();
};

// Global delete function
window.deleteCity = function (id) {
    if (confirm('Are you sure you want to delete this city?')) {
        cities = cities.filter(c => c.id !== id);
        saveCities();
        renderCities();
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    try {
        // Load cities from localStorage
        cities = JSON.parse(localStorage.getItem('cities')) || [];

        const addCityBtn = document.getElementById('addCityBtn');
        const closeModalBtn = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelBtn');
        const cityForm = document.getElementById('cityForm');
        const modal = document.getElementById('cityModal');

        // Add button click
        if (addCityBtn) {
            addCityBtn.addEventListener('click', function () {
                resetForm();
                openModal();
            });
        }

        // Close modal buttons
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }
        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeModal);
        }

        // Close modal when clicking outside
        if (modal) {
            modal.addEventListener('click', function (e) {
                if (e.target === modal) closeModal();
            });
        }

        // Form submit
        if (cityForm) {
            cityForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const name = document.getElementById('cityName')?.value.trim();
                const type = document.getElementById('cityType')?.value;

                if (!name || !type) {
                    alert('Please fill in all fields.');
                    return;
                }

                if (editingId) {
                    const city = cities.find(c => c.id === editingId);
                    if (city) {
                        city.name = name;
                        city.type = type;
                    }
                } else {
                    const newId = cities.length > 0 ? Math.max(...cities.map(c => c.id)) + 1 : 1;
                    cities.push({
                        id: newId,
                        name: name,
                        type: type,
                        rating: 0,
                        image: '../assets/city.png'
                    });
                }

                saveCities();
                renderCities();
                closeModal();
            });
        }

        // Initial render
        renderCities();
    } catch (error) {
        console.error('Cities page error:', error);
    }
});
