// Tourism Booking System - Shared JavaScript

document.addEventListener('DOMContentLoaded', function () {

    // 1. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const authButtons = document.querySelector('.auth-buttons'); // Login/Signup buttons

    if (hamburger) {
        hamburger.addEventListener('click', function () {
            // Toggle the 'active' class to show/hide menu
            navLinks.classList.toggle('active');

            // Also toggle auth buttons on mobile
            if (authButtons) {
                // We might need to clone them into the menu or handle them separately
                // simpler approach: just toggle a class on them if we move them in CSS
                // or just toggle them here if they are separate
                // checking CSS, I hid .auth-buttons, so let's toggle them too
                // But in the HTML structure they are separate.
                // Let's assume on mobile we might want a simple dropdown.
                // For this simple friendly version, let's just show them below links.
                if (window.innerWidth <= 768) {
                    // If auth buttons are hidden by media query, we need a way to show them
                    // My CSS handles .auth-buttons.active
                    authButtons.classList.toggle('active');
                }
            }
        });
    }

    // 2. Simple Modal Logic (for Admin pages)
    // We look for buttons with 'data-modal-target' and modals with that ID
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const closeButtons = document.querySelectorAll('[data-close-modal]');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.getAttribute('data-modal-target');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'flex'; // Use flex to center with CSS
            }
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Close modal if clicking outside content
    window.onclick = function (event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = "none";
        }
    }

    // Animated Hamburger Icon
    const toggler = document.querySelector('.navbar-toggler');
    const animatedIcon = document.querySelector('.animated-icon');

    if (toggler && animatedIcon) {
        toggler.addEventListener('click', function () {
            animatedIcon.classList.toggle('open');
        });
    }
});
