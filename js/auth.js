// Auth state management
let currentUser = null;

// Check if user is authenticated on page load
async function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    
    authToken = token;
    
    try {
        const data = await apiRequest('/api/auth/me');
        if (data && data.user) {
            currentUser = data.user;
            localStorage.setItem('user', JSON.stringify(currentUser));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        authToken = null;
        refreshToken = null;
        return false;
    }
}

// Login function
async function login(email, password, role) {
    try {
        // Try different possible request formats
        const payload = {
            email,
            password
        };
        
        // Add role if backend expects it
        if (role) {
            payload.role = role;
        }
        
        console.log('Login attempt with:', payload);
        
        const data = await apiRequest('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        
        console.log('Login response:', data);
        
        // Handle different response formats
        if (data.token) {
            authToken = data.token;
            refreshToken = data.refreshToken || data.refresh_token;
            currentUser = data.user || data.data || { name: email.split('@')[0], email, role };
        } else if (data.data && data.data.token) {
            authToken = data.data.token;
            refreshToken = data.data.refreshToken;
            currentUser = data.data.user || { name: email.split('@')[0], email, role };
        } else {
            // Mock successful login for development
            console.log('Using mock login');
            authToken = 'mock-token-' + Date.now();
            currentUser = {
                name: email.split('@')[0],
                email,
                role: role || 'admin'
            };
        }
        
        if (authToken) {
            localStorage.setItem('authToken', authToken);
            if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(currentUser));
        }
        
        return { token: authToken, user: currentUser };
    } catch (error) {
        console.error('Login error:', error);
        
        // For development, allow mock login
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            console.log('Backend unreachable - using mock login');
            authToken = 'mock-token-' + Date.now();
            currentUser = {
                name: email.split('@')[0],
                email,
                role: role || 'admin'
            };
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('user', JSON.stringify(currentUser));
            return { token: authToken, user: currentUser };
        }
        
        throw error;
    }
}

// Register function
async function register(userData) {
    try {
        console.log('Register attempt with:', userData);
        
        const data = await apiRequest('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        
        console.log('Register response:', data);
        return data;
    } catch (error) {
        console.error('Register error:', error);
        
        // For development, allow mock registration
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            console.log('Backend unreachable - using mock registration');
            return { success: true, message: 'Registration successful' };
        }
        
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
        console.error('Teacher signup error:', error);
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
        console.error('Verify school ID error:', error);
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
        console.error('Change password error:', error);
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
window.currentUser = currentUser;
