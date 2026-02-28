// js/api.js - Global API object
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
        };
        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || `HTTP ${response.status}`);
            }
            return await response.json();
        } catch (err) {
            window.showToast?.(err.message, 'error');
            throw err;
        }
    }

    // Auth
    async function login(role, credentials) {
        const response = await request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ role, ...credentials })
        });
        if (response.token) {
            authToken = response.token;
            localStorage.setItem('shuleai_token', authToken);
        }
        return response.user;
    }

    function logout() {
        authToken = null;
        localStorage.removeItem('shuleai_token');
    }

    // NEW: Signup
    async function signup(role, data) {
        const endpoint = `/auth/signup/${role}`;
        return request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // Academics
    async function getGrades(studentId) {
        return request(`/academics/grades?studentId=${studentId}`);
    }
    async function getSubjects() {
        return request('/academics/subjects');
    }
    async function getAnalytics(type, id) {
        return request(`/analytics/${type}/${id}`);
    }
    async function postMarks(data) {
        return request('/academics/marks', { method: 'POST', body: JSON.stringify(data) });
    }

    // Attendance
    async function getAttendance(studentId) {
        const url = studentId ? `/attendance/${studentId}` : '/attendance';
        return request(url);
    }
    async function postAttendance(data) {
        return request('/attendance', { method: 'POST', body: JSON.stringify(data) });
    }
    async function putAttendance(id, data) {
        return request(`/attendance/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    }

    // Fees
    async function getFees(studentId) {
        const url = studentId ? `/fees/${studentId}` : '/fees';
        return request(url);
    }
    async function postPayment(data) {
        return request('/fees/payments', { method: 'POST', body: JSON.stringify(data) });
    }
    async function getStatements() {
        return request('/fees/statements');
    }

    // Messages
    async function getMessages() {
        return request('/messages');
    }
    async function getMessage(id) {
        return request(`/messages/${id}`);
    }
    async function postMessage(data) {
        return request('/messages', { method: 'POST', body: JSON.stringify(data) });
    }
    async function putMessage(id, data) {
        return request(`/messages/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    }

    // Parents
    async function getParent(id) {
        return request(`/parents/${id}`);
    }
    async function getChildren(parentId) {
        return request(`/parents/${parentId}/children`);
    }
    async function getChildReport(parentId, childId) {
        return request(`/parents/${parentId}/children/${childId}/reports`);
    }

    // Students
    async function getStudents() {
        return request('/students');
    }
    async function getStudent(id) {
        return request(`/students/${id}`);
    }
    async function getStudentGrades(id) {
        return request(`/students/${id}/grades`);
    }
    async function getStudentAttendance(id) {
        return request(`/students/${id}/attendance`);
    }
    async function getStudentFees(id) {
        return request(`/students/${id}/fees`);
    }

    // Teachers
    async function getTeachers() {
        return request('/teachers');
    }
    async function getTeacher(id) {
        return request(`/teachers/${id}`);
    }
    async function getTeacherClasses(id) {
        return request(`/teachers/${id}/classes`);
    }
    async function postTeacherMarks(id, data) {
        return request(`/teachers/${id}/marks`, { method: 'POST', body: JSON.stringify(data) });
    }
    async function postTeacherAttendance(id, data) {
        return request(`/teachers/${id}/attendance`, { method: 'POST', body: JSON.stringify(data) });
    }

    // Users
    async function getUser(id) {
        return request(`/users/${id}`);
    }
    async function updateUser(id, data) {
        return request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    }
    async function getUsersByRole(role) {
        return request(`/users/${role}`);
    }

    return {
        login,
        logout,
        signup,
        getGrades,
        getSubjects,
        getAnalytics,
        postMarks,
        getAttendance,
        postAttendance,
        putAttendance,
        getFees,
        postPayment,
        getStatements,
        getMessages,
        getMessage,
        postMessage,
        putMessage,
        getParent,
        getChildren,
        getChildReport,
        getStudents,
        getStudent,
        getStudentGrades,
        getStudentAttendance,
        getStudentFees,
        getTeachers,
        getTeacher,
        getTeacherClasses,
        postTeacherMarks,
        postTeacherAttendance,
        getUser,
        updateUser,
        getUsersByRole
    };
})();