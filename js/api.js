// API Configuration
const API_BASE_URL = 'https://shuleaibackend-32h1.onrender.com'; // Your Render backend URL

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
    
    if (authToken) {
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
        
        // Handle token refresh
        if (response.status === 401 && refreshToken) {
            const refreshed = await refreshAuthToken();
            if (refreshed) {
                headers['Authorization'] = `Bearer ${authToken}`;
                const retryResponse = await fetch(url, {
                    ...options,
                    headers
                });
                return handleResponse(retryResponse);
            }
        }
        
        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Request failed:', error);
        throw error;
    }
}

async function handleResponse(response) {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'API request failed');
    }
    return data;
}

async function refreshAuthToken() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
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

// ============ AUTH ENDPOINTS ============
const authAPI = {
    superAdminLogin: (email, password, secretKey) => 
        apiRequest('/api/auth/super-admin/login', {
            method: 'POST',
            body: JSON.stringify({ email, password, secretKey })
        }),
    
    adminSignup: (data) => 
        apiRequest('/api/auth/admin/signup', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    
    teacherSignup: (data) => 
        apiRequest('/api/auth/teacher/signup', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    
    parentSignup: (data) => 
        apiRequest('/api/auth/parent/signup', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    
    studentLogin: (elimuid, password) => 
        apiRequest('/api/auth/student/login', {
            method: 'POST',
            body: JSON.stringify({ elimuid, password })
        }),
    
    login: (email, password, role) => 
        apiRequest('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password, role })
        }),
    
    verifySchoolCode: (schoolCode) => 
        apiRequest('/api/auth/verify-school', {
            method: 'POST',
            body: JSON.stringify({ schoolCode })
        }),
    
    getMe: () => apiRequest('/api/auth/me'),
    
    logout: () => apiRequest('/api/auth/logout', { method: 'POST' }),
    
    changePassword: (currentPassword, newPassword) => 
        apiRequest('/api/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ currentPassword, newPassword })
        })
};

// ============ SUPER ADMIN ENDPOINTS ============
const superAdminAPI = {
    // Existing endpoints
    getOverview: () => apiRequest('/api/super-admin/overview'),
    getSchools: () => apiRequest('/api/super-admin/schools'),
    getPendingSchools: () => apiRequest('/api/super-admin/pending-schools'),
    getSuspendedSchools: () => apiRequest('/api/super-admin/suspended-schools'),
    approveSchool: (schoolId) => 
        apiRequest(`/api/super-admin/schools/${schoolId}/approve`, {
            method: 'POST'
        }),
    rejectSchool: (schoolId, reason) => 
        apiRequest(`/api/super-admin/schools/${schoolId}/reject`, {
            method: 'POST',
            body: JSON.stringify({ reason })
        }),
    suspendSchool: (schoolId, reason) => 
        apiRequest(`/api/super-admin/schools/${schoolId}/suspend`, {
            method: 'POST',
            body: JSON.stringify({ reason })
        }),
    reactivateSchool: (schoolId, reason) => 
        apiRequest(`/api/super-admin/schools/${schoolId}/reactivate`, {
            method: 'POST',
            body: JSON.stringify({ reason })
        }),
    createSchool: (data) => 
        apiRequest('/api/super-admin/schools', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    updateSchool: (schoolId, data) => 
        apiRequest(`/api/super-admin/schools/${schoolId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
    deleteSchool: (schoolId) => 
        apiRequest(`/api/super-admin/schools/${schoolId}`, {
            method: 'DELETE'
        }),
    getPendingRequests: () => apiRequest('/api/super-admin/requests'),
    approveRequest: (requestId) => 
        apiRequest(`/api/super-admin/requests/${requestId}/approve`, {
            method: 'POST'
        }),
    rejectRequest: (requestId, reason) => 
        apiRequest(`/api/super-admin/requests/${requestId}/reject`, {
            method: 'POST',
            body: JSON.stringify({ reason })
        }),
    updateBankDetails: (schoolId, data) => 
        apiRequest(`/api/super-admin/bank-details/${schoolId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
    
    // ============ NEW: School Statistics ============
    getSchoolTeachers: (schoolId) => apiRequest(`/api/super-admin/schools/${schoolId}/teachers`),
    getSchoolStudents: (schoolId) => apiRequest(`/api/super-admin/schools/${schoolId}/students`),
    getSchoolParents: (schoolId) => apiRequest(`/api/super-admin/schools/${schoolId}/parents`),
    getSchoolStats: (schoolId) => apiRequest(`/api/super-admin/schools/${schoolId}/stats`),
    
    // ============ NEW: Name Change History ============
    getAllRequests: () => apiRequest('/api/super-admin/requests/all'),
    getRequestHistory: () => apiRequest('/api/super-admin/requests/history'),
    
    // ============ NEW: Platform Health ============
    getSystemStatus: () => apiRequest('/api/super-admin/system/status'),
    getSystemMetrics: () => apiRequest('/api/super-admin/system/metrics'),
    getRecentEvents: () => apiRequest('/api/super-admin/system/events'),
    getSystemLogs: () => apiRequest('/api/super-admin/logs'),
    
    // ============ NEW: Platform Settings ============
    getPlatformSettings: () => apiRequest('/api/super-admin/platform-settings'),
    updatePlatformSettings: (settings) => apiRequest('/api/super-admin/platform-settings', {
        method: 'PUT',
        body: JSON.stringify(settings)
    }),
    
    // ============ NEW: Data Management ============
    exportData: () => apiRequest('/api/super-admin/export'),
    clearCache: () => apiRequest('/api/super-admin/cache/clear', { method: 'POST' }),
    runBackup: () => apiRequest('/api/super-admin/backup', { method: 'POST' }),
    resetSettings: () => apiRequest('/api/super-admin/settings/reset', { method: 'POST' }),
    
    // ============ NEW: User Management ============
    getAllUsers: () => apiRequest('/api/super-admin/users'),
    getUserStats: () => apiRequest('/api/super-admin/users/stats')
};

// ============ ADMIN ENDPOINTS ============
const adminAPI = {
    // Teacher management
    getTeachers: () => apiRequest('/api/admin/teachers'),
    getStudents: () => apiRequest('/api/admin/students'),
    getParents: () => apiRequest('/api/admin/parents'),
    getPendingApprovals: () => apiRequest('/api/admin/approvals/pending'),
    approveTeacher: (teacherId, action, rejectionReason) => 
        apiRequest(`/api/admin/teachers/${teacherId}/approve`, {
            method: 'POST',
            body: JSON.stringify({ action, rejectionReason })
        }),
    
    suspendTeacher: (teacherId, reason) => 
        apiRequest(`/api/admin/teachers/${teacherId}/suspend`, {
            method: 'POST',
            body: JSON.stringify({ reason })
        }),
    
    reactivateTeacher: (teacherId) => 
        apiRequest(`/api/admin/teachers/${teacherId}/reactivate`, {
            method: 'POST'
        }),
    
    deactivateTeacher: (teacherId, data) => 
        apiRequest(`/api/admin/teachers/${teacherId}/deactivate`, {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    activateTeacher: (teacherId) => 
        apiRequest(`/api/admin/teachers/${teacherId}/activate`, {
            method: 'POST'
        }),
    
    deleteTeacher: (teacherId) => 
        apiRequest(`/api/admin/teachers/${teacherId}`, {
            method: 'DELETE'
        }),
    
    // ============ NEW: Update Teacher ============
    updateTeacher: (teacherId, data) => 
        apiRequest(`/api/admin/teachers/${teacherId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
    
    // School settings
    getSchoolSettings: () => apiRequest('/api/admin/settings'),
    updateSchoolSettings: (data) => 
        apiRequest('/api/admin/settings', {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
    
    // ============ CLASS MANAGEMENT ============
    createClass: (data) => 
        apiRequest('/api/admin/classes', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    
    getClasses: () => apiRequest('/api/admin/classes'),
    
    updateClass: (classId, data) => 
        apiRequest(`/api/admin/classes/${classId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),

    // Add to adminAPI object
    assignTeacherToSubject: (data) => apiRequest('/api/admin/assign-teacher-to-subject', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    
    getSubjectAssignments: () => apiRequest('/api/admin/subject-assignments'),
    
    removeSubjectAssignment: (assignmentId) => 
        apiRequest(`/api/admin/subject-assignments/${assignmentId}`, {
            method: 'DELETE'
        }),

    deleteClass: (classId) => 
        apiRequest(`/api/admin/classes/${classId}`, {
            method: 'DELETE'
        }),
    
    getAvailableTeachers: () => apiRequest('/api/admin/available-teachers'),
    
    assignTeacherToClass: (classId, teacherId) => 
        apiRequest(`/api/admin/classes/${classId}/assign-teacher`, {
            method: 'POST',
            body: JSON.stringify({ teacherId })
        }),
    
    removeTeacherFromClass: (classId) => 
        apiRequest(`/api/admin/classes/${classId}/remove-teacher`, {
            method: 'POST'
        }),
    
    getClassStudents: (classId) => 
        apiRequest(`/api/admin/classes/${classId}/students`),
    
    // Student details
    getStudentDetails: (studentId) => 
        apiRequest(`/api/admin/students/${studentId}`),

    suspendStudent: (studentId, data) => 
        apiRequest(`/api/admin/students/${studentId}/suspend`, {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    
    reactivateStudent: (studentId) => 
        apiRequest(`/api/admin/students/${studentId}/reactivate`, {
            method: 'POST'
        }),
    
    expelStudent: (studentId, data) => 
        apiRequest(`/api/admin/students/${studentId}/expel`, {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    
    deleteStudent: (studentId) => 
        apiRequest(`/api/admin/students/${studentId}`, {
            method: 'DELETE'
        }),
    
    // Duty management
    generateDutyRoster: (startDate, endDate) => 
        apiRequest('/api/admin/duty/generate', {
            method: 'POST',
            body: JSON.stringify({ startDate, endDate })
        }),
    getDutyStats: () => apiRequest('/api/admin/duty/stats'),
    getFairnessReport: () => apiRequest('/api/admin/duty/fairness-report'),
    manualAdjustDuty: (data) => 
        apiRequest('/api/admin/duty/adjust', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    getUnderstaffedAreas: () => apiRequest('/api/admin/duty/understaffed'),
    getTeacherWorkload: () => apiRequest('/api/admin/duty/teacher-workload'),

    // ============ NEW: Statistics for Charts ============
    getStudentGrades: () => apiRequest('/api/admin/grades/stats'),
    getAttendanceStats: () => apiRequest('/api/admin/attendance/stats'),
    getDashboardData: () => apiRequest('/api/admin/dashboard')
};

// ============ TEACHER ENDPOINTS ============
const teacherAPI = {
    // Student management
    getMyStudents: () => apiRequest('/api/teacher/students'),
    addStudent: (data) => 
        apiRequest('/api/teacher/students', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    enterMarks: (data) => 
        apiRequest('/api/teacher/marks', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    takeAttendance: (data) => 
        apiRequest('/api/teacher/attendance', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    addComment: (data) => 
        apiRequest('/api/teacher/comment', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    uploadMarksCSV: (formData) => 
        uploadFile('/api/teacher/upload/marks', formData),
    
    // Message system
    getConversations: () => apiRequest('/api/teacher/conversations'),
    getMessages: (otherUserId) => apiRequest(`/api/teacher/messages/${otherUserId}`),
    markMessagesAsRead: (otherUserId) => 
        apiRequest(`/api/teacher/messages/read/${otherUserId}`, {
            method: 'PUT'
        }),
    replyToParent: (data) => 
        apiRequest('/api/teacher/reply', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    
    deleteStudent: (studentId) => 
        apiRequest(`/api/teacher/students/${studentId}`, {
            method: 'DELETE'
        }),
    
    // Add to teacherAPI object
    getMyAssignments: () => apiRequest('/api/teacher/my-assignments'),
    
    getClassStudentsForSubject: (classId, subject) => 
        apiRequest(`/api/teacher/class-students?classId=${classId}&subject=${encodeURIComponent(subject)}`),
    
    getTasks: () => apiRequest('/api/teacher/tasks'),
    
    createTask: (data) => apiRequest('/api/teacher/tasks', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    
    updateTask: (taskId, data) => apiRequest(`/api/teacher/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    
    sendGroupMessage: (data) => apiRequest('/api/teacher/group-message', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    
    sendPrivateMessage: (data) => apiRequest('/api/teacher/private-message', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    
    getStaffMembers: () => apiRequest('/api/teacher/staff-members')
};

// ============ PARENT ENDPOINTS ============
const parentAPI = {
    getChildren: () => apiRequest('/api/parent/children'),
    getChildSummary: (studentId) => 
        apiRequest(`/api/parent/child/${studentId}/summary`),
    reportAbsence: (data) => 
        apiRequest('/api/parent/report-absence', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    makePayment: (data) => 
        apiRequest('/api/parent/pay', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    getPayments: () => apiRequest('/api/parent/payments'),
    getSubscriptionPlans: () => apiRequest('/api/parent/plans'),
    upgradePlan: (data) => 
        apiRequest('/api/parent/upgrade-plan', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    sendMessage: (data) => 
        apiRequest('/api/parent/message', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    getConversations: () => apiRequest('/api/parent/conversations'),
    getMessages: (otherUserId) => 
        apiRequest(`/api/parent/messages/${otherUserId}`),
    confirmPayment: (data) => 
        apiRequest('/api/parent/payment-confirm', {
            method: 'POST',
            body: JSON.stringify(data)
        })
};

// ============ STUDENT ENDPOINTS ============
const studentAPI = {
    getGrades: () => apiRequest('/api/student/grades'),
    getAttendance: () => apiRequest('/api/student/attendance'),
    getMaterials: () => apiRequest('/api/student/materials'),
    sendMessage: (receiverId, content) => 
        apiRequest('/api/student/message', {
            method: 'POST',
            body: JSON.stringify({ receiverId, content })
        }),
    getMessages: (otherUserId) => 
        apiRequest(`/api/student/messages/${otherUserId}`),
    setFirstPassword: (data) => 
        apiRequest('/api/student/set-first-password', {
            method: 'POST',
            body: JSON.stringify(data)
        })
};

// ============ DUTY ENDPOINTS ============
const dutyAPI = {
    getTodayDuty: () => apiRequest('/api/duty/today'),
    getWeeklyDuty: () => apiRequest('/api/duty/week'),
    checkIn: (data) => 
        apiRequest('/api/duty/check-in', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    checkOut: (data) => 
        apiRequest('/api/duty/check-out', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    updatePreferences: (data) => 
        apiRequest('/api/duty/preferences', {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
    requestSwap: (data) => 
        apiRequest('/api/duty/request-swap', {
            method: 'POST',
            body: JSON.stringify(data)
        })
};

// ============ SCHOOL ENDPOINTS ============
const schoolAPI = {
    createNameChangeRequest: (data) => 
        apiRequest('/api/school/name-change-request', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    getNameChangeRequests: () => 
        apiRequest('/api/school/name-change-requests')
};

// ============ ANALYTICS ENDPOINTS ============
const analyticsAPI = {
    getStudentAnalytics: (studentId, curriculum, period) => 
        apiRequest(`/api/analytics/student/${studentId}?curriculum=${curriculum || ''}&period=${period || 'term'}`),
    getClassAnalytics: (classId, subject) => 
        apiRequest(`/api/analytics/class/${classId}${subject ? `?subject=${subject}` : ''}`),
    getSchoolAnalytics: () => apiRequest('/api/analytics/school'),
    compareCurriculum: (studentId) => 
        apiRequest(`/api/analytics/compare/${studentId}`)
};

// ============ UPLOAD ENDPOINTS ============
const uploadAPI = {
    uploadStudents: (formData, onProgress) => 
        uploadFile('/api/upload/students', formData, onProgress),
    uploadMarks: (formData, onProgress) => 
        uploadFile('/api/upload/marks', formData, onProgress),
    uploadAttendance: (formData, onProgress) => 
        uploadFile('/api/upload/attendance', formData, onProgress),
    downloadTemplate: (type) => 
        apiRequest(`/api/upload/template/${type}`, { responseType: 'blob' }),
    validateCSV: (formData) => 
        uploadFile('/api/upload/validate', formData),
    getUploadHistory: () => apiRequest('/api/upload/history')
};

// ============ PUBLIC ENDPOINTS ============
const publicAPI = {
    getPublicDutyToday: (schoolId) => 
        apiRequest(`/api/public/duty/today?schoolId=${schoolId}`),
    getPublicWeeklyDuty: (schoolId) => 
        apiRequest(`/api/public/duty/week?schoolId=${schoolId}`),
    getSchoolInfo: (schoolId) => 
        apiRequest(`/api/public/school/${schoolId}`)
};

// ============ USER ENDPOINTS (NEW) ============
const userAPI = {
    updateProfile: (data) => apiRequest('/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    updatePreferences: (preferences) => apiRequest('/api/user/preferences', {
        method: 'PUT',
        body: JSON.stringify(preferences)
    }),
    exportMyData: () => apiRequest('/api/user/export'),
    deactivateAccount: (reason) => apiRequest('/api/user/deactivate', {
        method: 'POST',
        body: JSON.stringify({ reason })
    }),
    getMyStats: () => apiRequest('/api/user/stats')
};

// ============ NOTIFICATIONS ENDPOINTS (NEW) ============
const notificationsAPI = {
    getMyNotifications: () => apiRequest('/api/notifications'),
    markAsRead: (notificationId) => apiRequest(`/api/notifications/${notificationId}/read`, {
        method: 'PUT'
    }),
    markAllAsRead: () => apiRequest('/api/notifications/read-all', {
        method: 'PUT'
    }),
    clearAll: () => apiRequest('/api/notifications/clear', {
        method: 'DELETE'
    })
};

// ============ HELP ENDPOINTS (NEW) ============
const helpAPI = {
    getArticles: (role) => apiRequest(`/api/help/articles/${role}`),
    searchArticles: (query, role) => apiRequest('/api/help/search', {
        method: 'POST',
        body: JSON.stringify({ query, role })
    }),
    getArticle: (articleId, role) => apiRequest(`/api/help/articles/${role}/${articleId}`)
};

// File upload helper
async function uploadFile(endpoint, file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);
    
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
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

// ============ SINGLE EXPORT STATEMENT ============
window.api = {
    auth: authAPI,
    superAdmin: superAdminAPI,
    admin: adminAPI,
    teacher: teacherAPI,
    parent: parentAPI,
    student: studentAPI,
    duty: dutyAPI,
    analytics: analyticsAPI,
    upload: uploadAPI,
    public: publicAPI,
    school: schoolAPI,
    help: helpAPI,
    user: userAPI,
    notifications: notificationsAPI
};

// Legacy support
window.apiRequest = apiRequest;
window.uploadFile = uploadFile;

// Log to verify all APIs are loaded
console.log('✅ API loaded successfully!');
console.log('📊 Available APIs:', Object.keys(window.api).join(', '));
console.log('📊 Super Admin APIs:', Object.keys(window.api.superAdmin).join(', '));
console.log('📊 User APIs:', Object.keys(window.api.user).join(', '));
console.log('📊 Notifications APIs:', Object.keys(window.api.notifications).join(', '));
console.log('📊 Help APIs:', Object.keys(window.api.help).join(', '));
