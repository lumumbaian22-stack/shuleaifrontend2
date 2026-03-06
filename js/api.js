// api.js - Complete backend integration (preserves all your logic)

// API Configuration - Uses CONFIG
const API_BASE_URL = window.CONFIG?.API_URL || 'https://shuleaibackend-32h1.onrender.com';

// Token management
let authToken = localStorage.getItem('authToken');
let refreshToken = localStorage.getItem('refreshToken');

// API request wrapper with authentication
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    // CRITICAL: Never send auth token for registration or login
    const publicEndpoints = [
        '/api/auth/register', 
        '/api/auth/login', 
        '/api/auth/teacher/signup', 
        '/api/auth/verify-school',
        '/api/auth/forgot-password',
        '/api/auth/reset-password',
        '/health'
    ];
    
    const isPublicEndpoint = publicEndpoints.some(pubEndpoint => 
        endpoint.startsWith(pubEndpoint)
    );
    
    // Only add auth token for protected endpoints AND if we have a token
    if (authToken && !isPublicEndpoint) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const config = {
        ...options,
        headers,
        credentials: 'include'
    };
    
    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        // Handle token refresh (only for protected endpoints)
        if (response.status === 401 && !isPublicEndpoint && refreshToken) {
            const refreshed = await refreshAuthToken();
            if (refreshed) {
                return apiRequest(endpoint, options);
            }
        }
        
        if (!response.ok) {
            // Show more detailed error
            console.error('API Error Response:', {
                status: response.status,
                statusText: response.statusText,
                data: data
            });
            throw new Error(data.message || `API request failed with status ${response.status}`);
        }
        
        return data;
    } catch (error) {
        console.error('API Request failed:', error);
        throw error;
    }
}

async function refreshAuthToken() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            return true;
        }
    } catch (error) {
        console.error('Token refresh failed:', error);
    }
    return false;
}

// File upload helper
async function uploadFile(endpoint, file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);
    
    const xhr = new XMLHttpRequest();
    
    return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable && onProgress) {
                const percent = (e.loaded / e.total) * 100;
                onProgress(percent);
            }
        });
        
        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject(new Error('Upload failed'));
            }
        });
        
        xhr.addEventListener('error', () => reject(new Error('Upload failed')));
        
        xhr.open('POST', `${API_BASE_URL}${endpoint}`);
        xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
        xhr.send(formData);
    });
}

// Get current user data (works after login)
async function getCurrentUser() {
    return apiRequest('/api/auth/me');
}

// Student endpoints - USING CORRECT BACKEND ENDPOINTS
async function getStudentGrades(studentId) {
    return apiRequest(`/api/analytics/student/${studentId}`);
}

async function getStudentAttendance(studentId) {
    return apiRequest(`/api/analytics/student/${studentId}?period=term`);
}

// Teacher endpoints
async function getMyStudents() {
    const response = await apiRequest('/api/teacher/students');
    return response.data || response;
}

async function enterMarks(data) {
    const response = await apiRequest('/api/teacher/marks', {
        method: 'POST',
        body: JSON.stringify(data)
    });
    return response.data || response;
}

async function takeAttendance(data) {
    const response = await apiRequest('/api/teacher/attendance', {
        method: 'POST',
        body: JSON.stringify(data)
    });
    return response.data || response;
}

async function addStudent(studentData) {
    const response = await apiRequest('/api/teacher/students', {
        method: 'POST',
        body: JSON.stringify(studentData)
    });
    return response.data || response;
}

// Parent endpoints
async function getChildren() {
    const response = await apiRequest('/api/parent/children');
    return response.data || response;
}

async function getChildSummary(studentId) {
    const response = await apiRequest(`/api/parent/child/${studentId}/summary`);
    return response.data || response;
}

async function reportAbsence(data) {
    const response = await apiRequest('/api/parent/report-absence', {
        method: 'POST',
        body: JSON.stringify(data)
    });
    return response.data || response;
}

// Student endpoints
async function getStudentDashboard() {
    const response = await apiRequest('/api/student/dashboard');
    return response.data || response;
}

async function getStudentGrades() {
    const response = await apiRequest('/api/student/grades');
    return response.data || response;
}

async function getStudentAttendance() {
    const response = await apiRequest('/api/student/attendance');
    return response.data || response;
}

// Duty management endpoints
async function getTodayDuty() {
    const response = await apiRequest('/api/duty/today');
    return response.data || response;
}

async function getWeeklyDuty() {
    const response = await apiRequest('/api/duty/week');
    return response.data || response;
}

async function checkInDuty(data) {
    const response = await apiRequest('/api/duty/check-in', {
        method: 'POST',
        body: JSON.stringify(data)
    });
    return response.data || response;
}

async function checkOutDuty(data) {
    const response = await apiRequest('/api/duty/check-out', {
        method: 'POST',
        body: JSON.stringify(data)
    });
    return response.data || response;
}

// Messaging endpoints
async function sendMessage(receiverId, content) {
    const response = await apiRequest('/api/student/message', {
        method: 'POST',
        body: JSON.stringify({ receiverId, content })
    });
    return response.data || response;
}

async function getMessages(otherUserId) {
    const response = await apiRequest(`/api/student/messages/${otherUserId}`);
    return response.data || response;
}

// Admin endpoints
async function getPendingApprovals() {
    const response = await apiRequest('/api/admin/approvals/pending');
    return response.data || response;
}

async function approveTeacher(teacherId, action, rejectionReason) {
    const response = await apiRequest(`/api/admin/teachers/${teacherId}/approve`, {
        method: 'POST',
        body: JSON.stringify({ action, rejectionReason })
    });
    return response.data || response;
}

async function generateDutyRoster(data) {
    const response = await apiRequest('/api/admin/duty/generate', {
        method: 'POST',
        body: JSON.stringify(data)
    });
    return response.data || response;
}

// Analytics endpoints
async function getStudentAnalytics(studentId, period = 'term', curriculum = null) {
    let url = `/api/analytics/student/${studentId}?period=${period}`;
    if (curriculum) url += `&curriculum=${curriculum}`;
    const response = await apiRequest(url);
    return response.data || response;
}

async function compareCurriculum(studentId) {
    const response = await apiRequest(`/api/analytics/compare/${studentId}`);
    return response.data || response;
}

// Super Admin endpoints
async function getPlatformOverview() {
    const response = await apiRequest('/api/super-admin/overview');
    return response.data || response;
}

async function getSchools() {
    const response = await apiRequest('/api/super-admin/schools');
    return response.data || response;
}

async function createSchool(data) {
    const response = await apiRequest('/api/super-admin/schools', {
        method: 'POST',
        body: JSON.stringify(data)
    });
    return response.data || response;
}

async function getPendingNameRequests() {
    const response = await apiRequest('/api/super-admin/requests');
    return response.data || response;
}

async function approveNameChange(requestId) {
    const response = await apiRequest(`/api/super-admin/requests/${requestId}/approve`, {
        method: 'POST'
    });
    return response.data || response;
}

// Export all functions to window (preserves your existing calls)
window.apiRequest = apiRequest;
window.uploadFile = uploadFile;
window.getCurrentUser = getCurrentUser;
window.getStudentGrades = getStudentGrades;
window.getStudentAttendance = getStudentAttendance;
window.getMyStudents = getMyStudents;
window.enterMarks = enterMarks;
window.takeAttendance = takeAttendance;
window.addStudent = addStudent;
window.getChildren = getChildren;
window.getChildSummary = getChildSummary;
window.reportAbsence = reportAbsence;
window.getStudentDashboard = getStudentDashboard;
window.getStudentGrades = getStudentGrades;
window.getStudentAttendance = getStudentAttendance;
window.getTodayDuty = getTodayDuty;
window.getWeeklyDuty = getWeeklyDuty;
window.checkInDuty = checkInDuty;
window.checkOutDuty = checkOutDuty;
window.sendMessage = sendMessage;
window.getMessages = getMessages;
window.getPendingApprovals = getPendingApprovals;
window.approveTeacher = approveTeacher;
window.generateDutyRoster = generateDutyRoster;
window.getStudentAnalytics = getStudentAnalytics;
window.compareCurriculum = compareCurriculum;
window.getPlatformOverview = getPlatformOverview;
window.getSchools = getSchools;
window.createSchool = createSchool;
window.getPendingNameRequests = getPendingNameRequests;
window.approveNameChange = approveNameChange;
