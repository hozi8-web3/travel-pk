// Admin Promo Codes Management JavaScript - No Bootstrap Dependencies

let promos = [];

// Modal functions
function openModal() {
    const modal = document.getElementById('promoModal');
    if (modal) modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('promoModal');
    if (modal) modal.classList.remove('active');
    const form = document.getElementById('promoForm');
    if (form) form.reset();
}

function savePromos() {
    localStorage.setItem('promos', JSON.stringify(promos));
}

function renderPromos() {
    const promosContainer = document.getElementById('promosTableBody');
    if (!promosContainer) return;

    if (promos.length === 0) {
        promosContainer.innerHTML = '<tr><td colspan="6" class="empty-state">No promo codes found. Create your first promo code!</td></tr>';
        return;
    }

    promosContainer.innerHTML = promos.map(promo => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const validUntil = new Date(promo.validUntil);
        validUntil.setHours(0, 0, 0, 0);
        const isExpired = validUntil < today;
        const status = isExpired ? 'Expired' : (promo.status || 'Active');

        return `
            <tr>
                <td style="font-weight: 700; color: #667eea;">${promo.code}</td>
                <td>${promo.discount}%</td>
                <td>${new Date(promo.validUntil).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                <td>${promo.usage || 0}</td>
                <td><span class="badge badge-${status === 'Active' ? 'success' : 'danger'}">${status}</span></td>
                <td><button class="btn btn-danger btn-sm" onclick="deletePromo(${promo.id})"><i class="bi bi-trash"></i> Delete</button></td>
            </tr>
        `;
    }).join('');
}

// Global delete function
window.deletePromo = function (id) {
    if (confirm('Are you sure you want to delete this promo code?')) {
        promos = promos.filter(p => p.id !== id);
        savePromos();
        renderPromos();
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    try {
        // Load promos from localStorage
        promos = JSON.parse(localStorage.getItem('promos')) || [];

        const addPromoBtn = document.getElementById('addPromoBtn');
        const closeModalBtn = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelBtn');
        const promoForm = document.getElementById('promoForm');
        const modal = document.getElementById('promoModal');

        // Add button click
        if (addPromoBtn) {
            addPromoBtn.addEventListener('click', function () {
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
        if (promoForm) {
            promoForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const code = document.getElementById('promoCode')?.value.trim().toUpperCase();
                const discount = parseInt(document.getElementById('promoDiscount')?.value);
                const date = document.getElementById('promoDate')?.value;

                if (!code || !discount || !date || isNaN(discount)) {
                    alert('Please fill in all fields correctly.');
                    return;
                }

                const newId = promos.length > 0 ? Math.max(...promos.map(p => p.id)) + 1 : 1;
                promos.push({
                    id: newId,
                    code: code,
                    discount: discount,
                    validUntil: date,
                    usage: 0,
                    status: 'Active'
                });

                savePromos();
                renderPromos();
                closeModal();
            });
        }

        // Initial render
        renderPromos();
    } catch (error) {
        console.error('Promo page error:', error);
    }
});
