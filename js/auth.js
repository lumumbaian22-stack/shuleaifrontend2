// Auth state management
let currentUser = null;

// Check if user is authenticated on page load
async function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    
    try {
        const data = await apiRequest('/api/auth/me');
        currentUser = data.user;
        localStorage.setItem('user', JSON.stringify(currentUser));
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
        const data = await apiRequest('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password, role })
        });
        
        authToken = data.token;
        refreshToken = data.refreshToken;
        currentUser = data.user;
        
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(currentUser));
        
        return data;
    } catch (error) {
        throw error;
    }
}

// Register function
async function register(userData) {
    try {
        const data = await apiRequest('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        
        return data;
    } catch (error) {
        throw error;
    }
}

// Teacher signup with school ID
async function teacherSignup(teacherData) {
    try {
        const data = await apiRequest('/api/auth/teacher/signup', {
            method: 'POST',
            body: JSON.stringify(teacherData)
        });
        
        return data;
    } catch (error) {
        throw error;
    }
}

// Verify school ID
async function verifySchoolId(schoolId) {
    try {
        const data = await apiRequest('/api/auth/verify-school', {
            method: 'POST',
            body: JSON.stringify({ schoolId })
        });
        
        return data;
    } catch (error) {
        throw error;
    }
}

// Change password
async function changePassword(oldPassword, newPassword) {
    try {
        const data = await apiRequest('/api/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ oldPassword, newPassword })
        });
        
        return data;
    } catch (error) {
        throw error;
    }
}

// Export auth functions
window.login = login;
window.register = register;
window.teacherSignup = teacherSignup;
window.verifySchoolId = verifySchoolId;
window.changePassword = changePassword;
window.checkAuth = checkAuth;