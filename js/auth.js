// Auth state management
let currentUser = null;
let currentSchool = null;

// Check if user is authenticated on page load
async function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    
    try {
        const response = await api.auth.getMe();
        currentUser = response.data.user;
        currentSchool = response.data.school;
        localStorage.setItem('user', JSON.stringify(currentUser));
        localStorage.setItem('school', JSON.stringify(currentSchool));
        return true;
    } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('school');
        return false;
    }
}

// Super Admin login
async function superAdminLogin(email, password, secretKey) {
    try {
        const response = await api.auth.superAdminLogin(email, password, secretKey);
        
        authToken = response.data.token;
        currentUser = response.data.user;
        
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('user', JSON.stringify(currentUser));
        
        return response;
    } catch (error) {
        throw error;
    }
}

// Admin signup
async function adminSignup(adminData) {
    try {
        const response = await api.auth.adminSignup(adminData);
        return response;
    } catch (error) {
        throw error;
    }
}

// Teacher signup with school code
async function teacherSignup(teacherData) {
    try {
        const response = await api.auth.teacherSignup(teacherData);
        return response;
    } catch (error) {
        throw error;
    }
}

// Parent signup with student ELIMUID
async function parentSignup(parentData) {
    try {
        const response = await api.auth.parentSignup(parentData);
        return response;
    } catch (error) {
        throw error;
    }
}

// Student login with ELIMUID
async function studentLogin(elimuid, password) {
    try {
        const response = await api.auth.studentLogin(elimuid, password);
        
        authToken = response.data.token;
        currentUser = response.data.user;
        
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('user', JSON.stringify(currentUser));
        
        return response;
    } catch (error) {
        throw error;
    }
}

// Regular login for admin/teacher/parent
async function login(email, password, role) {
    try {
        const response = await api.auth.login(email, password, role);
        
        authToken = response.data.token;
        currentUser = response.data.user;
        currentSchool = response.data.school;
        
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('user', JSON.stringify(currentUser));
        localStorage.setItem('school', JSON.stringify(currentSchool));
        
        return response;
    } catch (error) {
        throw error;
    }
}

// Verify school code (for teacher signup)
async function verifySchoolCode(schoolCode) {
    try {
        const response = await api.auth.verifySchoolCode(schoolCode);
        return response;
    } catch (error) {
        throw error;
    }
}

// Change password
async function changePassword(currentPassword, newPassword) {
    try {
        const response = await api.auth.changePassword(currentPassword, newPassword);
        return response;
    } catch (error) {
        throw error;
    }
}

// Logout
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('school');
    authToken = null;
    refreshToken = null;
    currentUser = null;
    currentSchool = null;
    
    const landingPage = document.getElementById('landing-page');
    const dashboardContainer = document.getElementById('dashboard-container');
    
    if (landingPage) landingPage.style.display = 'block';
    if (dashboardContainer) dashboardContainer.style.display = 'none';
    
    showToast('Logged out successfully', 'success');
}

// Get current user
function getCurrentUser() {
    return currentUser || JSON.parse(localStorage.getItem('user') || '{}');
}

// Get current school
function getCurrentSchool() {
    return currentSchool || JSON.parse(localStorage.getItem('school') || '{}');
}

// Export auth functions
window.superAdminLogin = superAdminLogin;
window.adminSignup = adminSignup;
window.teacherSignup = teacherSignup;
window.parentSignup = parentSignup;
window.studentLogin = studentLogin;
window.login = login;
window.verifySchoolCode = verifySchoolCode;
window.changePassword = changePassword;
window.checkAuth = checkAuth;
window.logout = logout;
window.getCurrentUser = getCurrentUser;
window.getCurrentSchool = getCurrentSchool;
