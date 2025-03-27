// auth.js - Authentication system with localStorage and UI notifications

// Initialize storage
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
}
if (!localStorage.getItem('currentUser')) {
    localStorage.setItem('currentUser', JSON.stringify(null));
}

// ======================
// NOTIFICATION SYSTEM
// ======================
function showNotification(message, isError = false) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${isError ? 'error' : 'success'}`;
    notification.innerHTML = `
        <span class="notification-icon">${isError ? '✗' : '✓'}</span>
        <span class="notification-message">${message}</span>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ======================
// AUTH FUNCTIONS
// ======================
function handleSignup(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', true);
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users'));
    
    // Check if user exists
    if (users.some(user => user.email === email)) {
        showNotification('User with this email already exists!', true);
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        fullName,
        email,
        password, // Note: In production, never store plain passwords!
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    showNotification('Signup successful! Please login.');
    window.location.href = 'login.html';
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember').checked;
    
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        showNotification('Invalid email or password!', true);
        return;
    }
    
    // Set current user session
    localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        email: user.email,
        fullName: user.fullName
    }));
    
    // Remember me functionality
    if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
    } else {
        localStorage.removeItem('rememberedEmail');
    }
    
    showNotification(`Welcome back, ${user.fullName.split(' ')[0]}!`);
    updateAuthUI();
    window.location.href = 'index.html';
}

function logout() {
    localStorage.removeItem('currentUser');
    showNotification('You have been logged out');
    updateAuthUI();
    window.location.href = 'index.html';
}

// ======================
// UI MANAGEMENT
// ======================
function updateNavigation() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const authNav = document.querySelector('#authNav') || document.querySelector('nav a[href="login.html"]');
    const greetingElement = document.querySelector('.user-greeting');
    
    if (authNav) {
        if (currentUser) {
            // Logged in state
            authNav.textContent = 'Logout';
            authNav.href = '#';
            authNav.classList.add('logout-btn');
            authNav.onclick = (e) => {
                e.preventDefault();
                logout();
            };
            
            // Create or update greeting
            if (!greetingElement) {
                const newGreeting = document.createElement('span');
                newGreeting.className = 'user-greeting';
                newGreeting.textContent = `Hi, ${currentUser.fullName.split(' ')[0]}`;
                authNav.parentNode.insertBefore(newGreeting, authNav);
            } else {
                greetingElement.textContent = `Hi, ${currentUser.fullName.split(' ')[0]}`;
                greetingElement.style.display = 'inline';
            }
        } else {
            // Logged out state
            authNav.textContent = 'Login';
            authNav.href = 'login.html';
            authNav.classList.remove('logout-btn');
            authNav.onclick = null;
            
            // Hide greeting if exists
            if (greetingElement) {
                greetingElement.style.display = 'none';
            }
        }
    }
}

function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && window.location.pathname.includes('login.html')) {
        window.location.href = 'index.html';
    }
}

function updateAuthUI() {
    updateNavigation();
    checkAuth();
}

// ======================
// INITIALIZATION
// ======================
function initAuthForms() {
    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        
        // Auto-fill remembered email
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            document.getElementById('email').value = rememberedEmail;
            document.getElementById('remember').checked = true;
        }
    }
}

// Start everything when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    initAuthForms();
    updateAuthUI();
});