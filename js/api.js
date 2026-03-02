// js/api.js - Complete API service for ShuleAI
window.api = (function() {
    const API_BASE = 'https://shuleaibackend-32h1.onrender.com/api';
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
            console.log('🌐 API Request:', options.method || 'GET', url, options.body ? JSON.parse(options.body) : '');
            
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                console.error('❌ API Error:', data);
                throw new Error(data.message || data.errors?.[0]?.msg || `HTTP ${response.status}`);
            }
            
            console.log('✅ API Response:', data);
            return data.data || data; // Handle both { data: ... } and direct response
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
            body: JSON.stringify(credentials)  // credentials already includes role
        });
        
        if (response?.token) {
            authToken = response.token;
            localStorage.setItem('shuleai_token', authToken);
        }
        return response;
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

    // Return public API
    return {
        login,
        logout,
        getCurrentUser,
        teacherSignup,
        verifySchool
    };
})();
