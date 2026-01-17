// Admin Hotels Management JavaScript - No Bootstrap Dependencies

let editingId = null;
let hotels = [];

// Modal functions
let hotelModalInstance = null;

function openModal() {
    const modalElement = document.getElementById('hotelModal');
    if (modalElement) {
        if (!hotelModalInstance) {
            hotelModalInstance = new bootstrap.Modal(modalElement);
        }
        hotelModalInstance.show();
    }
}

function closeModal() {
    if (hotelModalInstance) {
        hotelModalInstance.hide();
    }
    // Form reset is handled by hidden.bs.modal event listener
}

function saveHotels() {
    localStorage.setItem('hotels', JSON.stringify(hotels));
}

function renderHotels() {
    const hotelsContainer = document.getElementById('hotelsTableBody');
    if (!hotelsContainer) return;

    if (hotels.length === 0) {
        hotelsContainer.innerHTML = '<tr><td colspan="6" class="empty-state">No hotels found. Add your first hotel!</td></tr>';
        return;
    }

    hotelsContainer.innerHTML = hotels.map(hotel => `
        <tr>
            <td>${hotel.id}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <img src="${hotel.image || '../assets/hotel.png'}" 
                         width="40" height="40" 
                         style="border-radius: 8px; object-fit: cover;" 
                         onerror="this.src='../assets/hotel.png'">
                    <span style="font-weight: 600;">${hotel.name}</span>
                </div>
            </td>
            <td>${hotel.city}</td>
            <td>PKR ${(hotel.price || 0).toLocaleString()}</td>
            <td><span class="badge badge-${hotel.status === 'Active' ? 'success' : 'danger'}">${hotel.status || 'Active'}</span></td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="editHotel(${hotel.id})"><i class="bi bi-pencil"></i> Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteHotel(${hotel.id})"><i class="bi bi-trash"></i> Delete</button>
            </td>
        </tr>
    `).join('');
}

function resetForm() {
    editingId = null;
    const form = document.getElementById('hotelForm');
    const modalTitle = document.getElementById('modalTitle');
    if (form) form.reset();
    if (modalTitle) modalTitle.textContent = 'Add New Hotel';
}

// Global edit function
window.editHotel = function (id) {
    const hotel = hotels.find(h => h.id === id);
    if (!hotel) return;

    editingId = id;
    const nameInput = document.getElementById('hotelName');
    const citySelect = document.getElementById('hotelCity');
    const priceInput = document.getElementById('hotelPrice');
    const modalTitle = document.getElementById('modalTitle');

    if (nameInput) nameInput.value = hotel.name;
    if (citySelect) citySelect.value = hotel.city;
    if (priceInput) priceInput.value = hotel.price;
    if (modalTitle) modalTitle.textContent = 'Edit Hotel';

    openModal();
};

// Global delete function
window.deleteHotel = function (id) {
    if (confirm('Are you sure you want to delete this hotel?')) {
        hotels = hotels.filter(h => h.id !== id);
        saveHotels();
        renderHotels();
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    try {
        // Load hotels from localStorage
        hotels = JSON.parse(localStorage.getItem('hotels')) || [];

        const addHotelBtn = document.getElementById('addHotelBtn');
        const closeModalBtn = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelBtn');
        const hotelForm = document.getElementById('hotelForm');
        const modal = document.getElementById('hotelModal');

        // Add button click
        if (addHotelBtn) {
            addHotelBtn.addEventListener('click', function () {
                resetForm();
                openModal();
            });
        }

        // Initialize Bootstrap modal instance
        if (modal) {
            hotelModalInstance = new bootstrap.Modal(modal);
            
            // Reset form when modal is hidden
            modal.addEventListener('hidden.bs.modal', function () {
                resetForm();
            });
        }

        // Close modal buttons (Bootstrap handles these via data-bs-dismiss, but we keep for consistency)
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }
        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeModal);
        }

        // Form submit
        if (hotelForm) {
            hotelForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const name = document.getElementById('hotelName')?.value.trim();
                const city = document.getElementById('hotelCity')?.value;
                const price = parseInt(document.getElementById('hotelPrice')?.value);

                if (!name || !city || !price || isNaN(price)) {
                    alert('Please fill in all fields correctly.');
                    return;
                }

                if (editingId) {
                    const hotel = hotels.find(h => h.id === editingId);
                    if (hotel) {
                        hotel.name = name;
                        hotel.city = city;
                        hotel.price = price;
                    }
                } else {
                    const newId = hotels.length > 0 ? Math.max(...hotels.map(h => h.id)) + 1 : 1;
                    hotels.push({
                        id: newId,
                        name: name,
                        city: city,
                        price: price,
                        status: 'Active',
                        image: '../assets/hotel.png'
                    });
                }

                saveHotels();
                renderHotels();
                closeModal();
            });
        }

        // Initial render
        renderHotels();
    } catch (error) {
        console.error('Hotels page error:', error);
    }
});
