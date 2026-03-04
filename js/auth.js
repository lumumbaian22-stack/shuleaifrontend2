// auth.js - Updated with real backend integration

// Auth state management
let currentUser = null;

// Check if user is authenticated on page load
async function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    
    try {
        const data = await apiRequest('/api/auth/me');
        currentUser = data.data?.user || data.user;
        localStorage.setItem('user', JSON.stringify(currentUser));
        
        // Dispatch auth event for WebSocket
        const event = new CustomEvent('auth-changed', { detail: { authenticated: true } });
        window.dispatchEvent(event);
        
        return true;
    } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        return false;
    }
}

// Login function
async function login(email, password, role) {
    try {
        const response = await apiRequest('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password, role })
        });
        
        // Handle both response formats
        const data = response.data || response;
        
        authToken = data.token;
        currentUser = data.user;
        
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('user', JSON.stringify(currentUser));
        
        // Dispatch auth event for WebSocket
        const event = new CustomEvent('auth-changed', { detail: { authenticated: true } });
        window.dispatchEvent(event);
        
        return response;
    } catch (error) {
        throw error;
    }
}

// Register function
async function register(userData) {
    try {
        const response = await apiRequest('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        return response;
    } catch (error) {
        throw error;
    }
}

// Teacher signup with school ID
async function teacherSignup(teacherData) {
    try {
        const response = await apiRequest('/api/auth/teacher/signup', {
            method: 'POST',
            body: JSON.stringify(teacherData)
        });
        return response;
    } catch (error) {
        throw error;
    }
}

// Verify school ID
async function verifySchoolId(schoolId) {
    try {
        const response = await apiRequest('/api/auth/verify-school', {
            method: 'POST',
            body: JSON.stringify({ schoolId })
        });
        return response;
    } catch (error) {
        throw error;
    }
}

// Change password
async function changePassword(oldPassword, newPassword) {
    try {
        const response = await apiRequest('/api/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ oldPassword, newPassword })
        });
        return response;
    } catch (error) {
        throw error;
    }
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    authToken = null;
    currentUser = null;
    
    // Dispatch auth event for WebSocket
    const event = new CustomEvent('auth-changed', { detail: { authenticated: false } });
    window.dispatchEvent(event);
    
    const landingPage = document.getElementById('landing-page');
    const dashboardContainer = document.getElementById('dashboard-container');
    
    if (landingPage) landingPage.style.display = 'block';
    if (dashboardContainer) dashboardContainer.style.display = 'none';
    
    showToast('Logged out successfully', 'success');
}

// Export auth functions
window.login = login;
window.register = register;
window.teacherSignup = teacherSignup;
window.verifySchoolId = verifySchoolId;
window.changePassword = changePassword;
window.checkAuth = checkAuth;
window.logout = logout;
