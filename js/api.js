window.api = (function() {
    const API_BASE = 'https://shuleaibackend-32h1.onrender.com/api';
    let authToken = localStorage.getItem('shuleai_token') || null;

    function getHeaders() {
        const headers = { 'Content-Type': 'application/json' };
        if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
        return headers;
    }

    async function request(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        const config = {
            ...options,
            headers: getHeaders(),
            credentials: 'include'
        };

        try {
            console.log('🌐 API Request:', options.method || 'GET', url, options.body ? JSON.parse(options.body) : '');
            
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                console.error('❌ API Error:', data);
                throw new Error(data.message || data.errors?.[0]?.msg || `HTTP ${response.status}`);
            }
            
            console.log('✅ API Response:', data);
            return data.data || data;
        } catch (err) {
            console.error('❌ Fetch Error:', err);
            window.showToast?.(err.message, 'error');
            throw err;
        }
    }

    // Auth endpoints
    async function login(role, credentials) {
        const response = await request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        
        if (response?.token) {
            authToken = response.token;
            localStorage.setItem('shuleai_token', authToken);
        }
        return response;
    }

    async function register(userData) {
        return request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async function logout() {
        try {
            await request('/auth/logout', { method: 'POST' });
        } finally {
            authToken = null;
            localStorage.removeItem('shuleai_token');
            localStorage.removeItem('shuleai_user');
            localStorage.removeItem('shuleai_school');
        }
    }

    async function teacherSignup(data) {
        return request('/auth/teacher/signup', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // Super Admin endpoints
    async function getSuperOverview() {
        return request('/super-admin/overview');
    }

    async function getSuperSchools() {
        return request('/super-admin/schools');
    }

    async function createSchool(data) {
        return request('/super-admin/schools', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async function updateSchool(schoolId, data) {
        return request(`/super-admin/schools/${schoolId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async function deleteSchool(schoolId) {
        return request(`/super-admin/schools/${schoolId}`, {
            method: 'DELETE'
        });
    }

    async function getSuperPendingRequests() {
        return request('/super-admin/requests');
    }

    async function approveNameRequest(requestId) {
        return request(`/super-admin/requests/${requestId}/approve`, {
            method: 'POST'
        });
    }

    async function rejectNameRequest(requestId, reason) {
        return request(`/super-admin/requests/${requestId}/reject`, {
            method: 'POST',
            body: JSON.stringify({ reason })
        });
    }

    async function updateBankDetails(data) {
        return request('/super-admin/bank-details', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // Admin endpoints
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

    // Teacher endpoints
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

    // Parent endpoints
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

    // Student endpoints
    async function getStudentDashboard() {
        return request('/student/dashboard');
    }

    async function getStudentGrades() {
        return request('/student/grades');
    }

    async function getStudentAttendance() {
        return request('/student/attendance');
    }

    // Duty endpoints
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

    // Return public API
    return {
        // Auth
        login,
        register,
        logout,
        teacherSignup,

        // Super Admin
        getSuperOverview,
        getSuperSchools,
        createSchool,
        updateSchool,
        deleteSchool,
        getSuperPendingRequests,
        approveNameRequest,
        rejectNameRequest,
        updateBankDetails,

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

        // Parent
        getChildren,
        getChildSummary,
        reportAbsence,

        // Student
        getStudentDashboard,
        getStudentGrades,
        getStudentAttendance,

        // Duty
        getTodayDuty,
        getWeeklyDuty,
        checkInDuty
    };
})();
