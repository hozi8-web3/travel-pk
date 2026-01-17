// Authentication System for Tourism Booking System

// Initialize demo users if not exists
function initializeDemoUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.length === 0) {
        // Demo users
        const demoUsers = [
            {
                id: 1,
                name: 'Demo Admin',
                email: 'admin@travelpk.com',
                password: 'admin123', // In production, this should be hashed
                phone: '+92 300 1234567',
                role: 'admin', // admin role
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: 'Demo User',
                email: 'user@travelpk.com',
                password: 'user123',
                phone: '+92 300 1234568',
                role: 'user',
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('users', JSON.stringify(demoUsers));
    }
    return JSON.parse(localStorage.getItem('users'));
}

// Initialize current user session
function initializeSession() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser || null;
}

// Login function
function login(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || initializeDemoUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Don't store password in session
        const { password: _, ...userWithoutPassword } = user;
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        return { success: true, user: userWithoutPassword };
    }

    return { success: false, message: 'Invalid email or password' };
}

// Signup function
function signup(name, email, phone, password, confirmPassword) {
    if (password !== confirmPassword) {
        return { success: false, message: 'Passwords do not match' };
    }

    // Username check: Must start with a letter
    if (!/^[a-zA-Z]/.test(name)) {
        return { success: false, message: 'Username must start with a letter' };
    }

    // Password check: Letter, number, special char, min 6 chars
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    if (!passwordRegex.test(password)) {
        return { success: false, message: 'Password must contain at least one letter, one number, and one special character' };
    }

    // Password matching email check
    if (password === email) {
        return { success: false, message: 'Password cannot be the same as email' };
    }

    const users = JSON.parse(localStorage.getItem('users')) || initializeDemoUsers();

    // Check if user already exists
    if (users.find(u => u.email === email)) {
        return { success: false, message: 'Email already registered' };
    }

    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        name: name,
        email: email,
        phone: phone,
        password: password, // In production, this should be hashed
        role: 'user',
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto login after signup
    const { password: _, ...userWithoutPassword } = newUser;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

    return { success: true, user: userWithoutPassword };
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

// Get current user
function getCurrentUser() {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
}

// Check if user is admin
function isAdmin() {
    const currentUser = getCurrentUser();
    return currentUser && currentUser.role === 'admin';
}

// Require authentication for protected pages
function requireAuth(redirectTo = 'login.html') {
    if (!isLoggedIn()) {
        window.location.href = redirectTo;
        return false;
    }
    return true;
}

// Require admin access for admin pages
function requireAdmin(redirectTo = '../index.html') {
    if (!isLoggedIn()) {
        window.location.href = '../login.html';
        return false;
    }

    if (!isAdmin()) {
        alert('Access denied. Admin privileges required.');
        window.location.href = redirectTo;
        return false;
    }

    return true;
}

// Update header/navbar based on authentication state
function updateHeaderForAuth() {
    const currentUser = getCurrentUser();
    const navbarNav = document.querySelector('#navbarNav .navbar-nav');

    if (!navbarNav) return; // Exit if navbar not found

    // Find or create auth containers
    let authButtons = document.getElementById('authButtons');
    let authButtons2 = document.getElementById('authButtons2');
    let userInfo = document.getElementById('userInfo');

    if (currentUser) {
        // User is logged in
        // Hide auth buttons
        if (authButtons) authButtons.style.display = 'none';
        if (authButtons2) authButtons2.style.display = 'none';

        // Show or create user info
        if (!userInfo) {
            userInfo = document.createElement('li');
            userInfo.className = 'nav-item';
            userInfo.id = 'userInfo';
            navbarNav.appendChild(userInfo);
        }

        userInfo.style.display = '';
        userInfo.innerHTML = `
            <div class="d-flex align-items-center gap-3">
                <a href="${currentUser.role === 'admin' ? 'admin/dashboard.html' : 'dashboard.html'}" class="nav-link fw-medium">
                    <span class="badge bg-secondary rounded-pill">${currentUser.name}</span>
                </a>
            </div>
        `;
    } else {
        // User is logged out
        // Show auth buttons
        if (authButtons) authButtons.style.display = '';
        if (authButtons2) authButtons2.style.display = '';

        // Hide user info
        if (userInfo) {
            userInfo.style.display = 'none';
        }
    }
}

// Initialize demo users on load
initializeDemoUsers();

