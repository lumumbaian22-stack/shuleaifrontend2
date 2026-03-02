// js/api.js - Complete API service for ShuleAI
window.api = (function() {
    const API_BASE = 'https://shuleaibackend-32h1.onrender.com/api'; // Update with your actual backend URL
    let authToken = localStorage.getItem('shuleai_token') || null;

    // Helper to get headers with auth token
    function getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }
        return headers;
    }

    // Generic request handler
    async function request(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        const config = {
            ...options,
            headers: getHeaders(),
            credentials: 'include'
        };

        try {
            console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`, options.body ? JSON.parse(options.body) : '');
            
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                console.error('❌ API Error:', data);
                throw new Error(data.message || `HTTP ${response.status}`);
            }
            
            console.log('✅ API Response:', data);
            return data;
        } catch (err) {
            console.error('❌ Fetch Error:', err);
            window.showToast?.(err.message, 'error');
            throw err;
        }
    }

    // ==================== AUTH ENDPOINTS ====================
    async function login(role, credentials) {
        const response = await request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ role, ...credentials })
        });
        
        if (response.data?.token) {
            authToken = response.data.token;
            localStorage.setItem('shuleai_token', authToken);
        }
        return response.data;
    }

    async function logout() {
        try {
            await request('/auth/logout', { method: 'POST' });
        } finally {
            authToken = null;
            localStorage.removeItem('shuleai_token');
        }
    }

    async function getCurrentUser() {
        return request('/auth/me');
    }

    async function teacherSignup(data) {
        return request('/auth/teacher/signup', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async function verifySchool(schoolId) {
        return request('/auth/verify-school', {
            method: 'POST',
            body: JSON.stringify({ schoolId })
        });
    }

    // ==================== ADMIN ENDPOINTS ====================
    async function getAdminDashboard() {
        return request('/admin/dashboard');
    }

    async function getPendingApprovals() {
        return request('/admin/approvals/pending');
    }

    async function approveTeacher(teacherId, action, rejectionReason) {
        return request(`/admin/teachers/${teacherId}/approve`, {
            method: 'POST',
            body: JSON.stringify({ action, rejectionReason })
        });
    }

    async function getAllStudents() {
        return request('/admin/students');
    }

    async function getAllTeachers() {
        return request('/admin/teachers');
    }

    async function getAllParents() {
        return request('/admin/parents');
    }

    async function getSchoolSettings() {
        return request('/admin/settings');
    }

    async function updateSchoolSettings(settings) {
        return request('/admin/settings', {
            method: 'PUT',
            body: JSON.stringify(settings)
        });
    }

    // ==================== TEACHER ENDPOINTS ====================
    async function getTeacherStudents() {
        return request('/teacher/students');
    }

    async function enterMarks(data) {
        return request('/teacher/marks', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async function takeAttendance(data) {
        return request('/teacher/attendance', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async function addComment(data) {
        return request('/teacher/comment', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async function uploadMarksCSV(formData) {
        const response = await fetch(`${API_BASE}/teacher/upload/marks`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });
        return response.json();
    }

    // ==================== PARENT ENDPOINTS ====================
    async function getChildren() {
        return request('/parent/children');
    }

    async function getChildSummary(studentId) {
        return request(`/parent/child/${studentId}/summary`);
    }

    async function reportAbsence(data) {
        return request('/parent/report-absence', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async function makePayment(data) {
        return request('/parent/pay', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async function getPayments() {
        return request('/parent/payments');
    }

    // ==================== STUDENT ENDPOINTS ====================
    async function getStudentDashboard() {
        return request('/student/dashboard');
    }

    async function getStudentGrades() {
        return request('/student/grades');
    }

    async function getStudentAttendance() {
        return request('/student/attendance');
    }

    async function getLearningMaterials() {
        return request('/student/materials');
    }

    async function sendMessage(data) {
        return request('/student/message', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async function getMessages(otherUserId) {
        return request(`/student/messages/${otherUserId}`);
    }

    // ==================== DUTY ENDPOINTS ====================
    async function getTodayDuty() {
        return request('/duty/today');
    }

    async function getWeeklyDuty() {
        return request('/duty/week');
    }

    async function checkInDuty(data) {
        return request('/duty/check-in', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async function updateDutyPreferences(data) {
        return request('/duty/preferences', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // ==================== ANALYTICS ENDPOINTS ====================
    async function getStudentAnalytics(studentId, curriculum, period) {
        let url = `/analytics/student/${studentId}`;
        const params = new URLSearchParams();
        if (curriculum) params.append('curriculum', curriculum);
        if (period) params.append('period', period);
        if (params.toString()) url += `?${params.toString()}`;
        return request(url);
    }

    async function getClassAnalytics(classId, subject) {
        let url = `/analytics/class/${classId}`;
        if (subject) url += `?subject=${subject}`;
        return request(url);
    }

    async function getSchoolAnalytics() {
        return request('/analytics/school');
    }

    // ==================== PUBLIC ENDPOINTS ====================
    async function getPublicDuty(schoolId) {
        return request(`/public/duty/today?schoolId=${schoolId}`);
    }

    async function getPublicWeeklyDuty(schoolId) {
        return request(`/public/duty/week?schoolId=${schoolId}`);
    }

    async function getSchoolInfo(schoolId) {
        return request(`/public/school/${schoolId}`);
    }

    // ==================== UPLOAD ENDPOINTS ====================
    async function uploadStudents(formData) {
        const response = await fetch(`${API_BASE}/upload/students`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });
        return response.json();
    }

    async function uploadMarks(formData) {
        const response = await fetch(`${API_BASE}/upload/marks`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });
        return response.json();
    }

    async function getUploadHistory() {
        return request('/upload/history');
    }

    // ==================== MESSAGES ====================
    async function getConversation(otherUserId) {
        return request(`/student/messages/${otherUserId}`);
    }

    // Return public API
    return {
        // Auth
        login,
        logout,
        getCurrentUser,
        teacherSignup,
        verifySchool,

        // Admin
        getAdminDashboard,
        getPendingApprovals,
        approveTeacher,
        getAllStudents,
        getAllTeachers,
        getAllParents,
        getSchoolSettings,
        updateSchoolSettings,

        // Teacher
        getTeacherStudents,
        enterMarks,
        takeAttendance,
        addComment,
        uploadMarksCSV,

        // Parent
        getChildren,
        getChildSummary,
        reportAbsence,
        makePayment,
        getPayments,

        // Student
        getStudentDashboard,
        getStudentGrades,
        getStudentAttendance,
        getLearningMaterials,
        sendMessage,
        getMessages,
        getConversation,

        // Duty
        getTodayDuty,
        getWeeklyDuty,
        checkInDuty,
        updateDutyPreferences,

        // Analytics
        getStudentAnalytics,
        getClassAnalytics,
        getSchoolAnalytics,

        // Public
        getPublicDuty,
        getPublicWeeklyDuty,
        getSchoolInfo,

        // Upload
        uploadStudents,
        uploadMarks,
        getUploadHistory
    };
})();
