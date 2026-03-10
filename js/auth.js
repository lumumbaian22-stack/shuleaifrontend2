// auth.js - Fixed & optimized backend integration

// Auth state
let currentUser = null;

// ===============================
// CHECK AUTH ON PAGE LOAD
// ===============================
async function checkAuth() {
    const token = localStorage.getItem('authToken');

    if (!token) return false;

    try {
        const response = await apiRequest('/api/auth/me');

        const data = response.data || response;

        currentUser = data.user;

        localStorage.setItem('user', JSON.stringify(currentUser));

        // notify websocket or UI listeners
        const event = new CustomEvent('auth-changed', {
            detail: { authenticated: true }
        });
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

// ===============================
// LOGIN
// ===============================
async function login(email, password, role) {

    const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
            role
        })
    });

    const data = response.data || response;

    authToken = data.token;
    currentUser = data.user;

    localStorage.setItem('authToken', authToken);
    localStorage.setItem('user', JSON.stringify(currentUser));

    // notify system auth changed
    const event = new CustomEvent('auth-changed', {
        detail: { authenticated: true }
    });

    window.dispatchEvent(event);

    return data;
}

// ===============================
// GENERAL REGISTER
// ===============================
async function register(userData) {

    const response = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    });

    return response;
}

// ===============================
// TEACHER SIGNUP
// ===============================
async function teacherSignup(teacherData) {

    const payload = {
        ...teacherData,
        role: "teacher"
    };

    console.log("Teacher signup payload:", payload);

    const response = await apiRequest('/api/auth/teacher/signup', {
        method: 'POST',
        body: JSON.stringify(payload)
    });

    return response;
}

// ===============================
// VERIFY SCHOOL ID
// ===============================
async function verifySchoolId(schoolId) {

    const response = await apiRequest('/api/auth/verify-school', {
        method: 'POST',
        body: JSON.stringify({ schoolId })
    });

    return response;
}

// ===============================
// CHANGE PASSWORD
// ===============================
async function changePassword(oldPassword, newPassword) {

    const response = await apiRequest('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
            oldPassword,
            newPassword
        })
    });

    return response;
}

// ===============================
// LOGOUT
// ===============================
function logout() {

    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    authToken = null;
    currentUser = null;

    const event = new CustomEvent('auth-changed', {
        detail: { authenticated: false }
    });

    window.dispatchEvent(event);

    const landingPage = document.getElementById('landing-page');
    const dashboardContainer = document.getElementById('dashboard-container');

    if (landingPage) landingPage.style.display = 'block';
    if (dashboardContainer) dashboardContainer.style.display = 'none';

    showToast('Logged out successfully', 'success');
}

// ===============================
// EXPORT FUNCTIONS
// ===============================
window.login = login;
window.register = register;
window.teacherSignup = teacherSignup;
window.verifySchoolId = verifySchoolId;
window.changePassword = changePassword;
window.checkAuth = checkAuth;
window.logout = logout;
