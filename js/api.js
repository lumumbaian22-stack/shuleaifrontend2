// API Configuration
const API_BASE_URL = 'https://shuleaibackend-32h1.onrender.com';

// Token management
let authToken = localStorage.getItem('authToken');
let refreshToken = localStorage.getItem('refreshToken');

// API request wrapper with authentication
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
    };
    
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const config = {
        ...options,
        headers,
        mode: 'cors',
        credentials: 'omit' // Don't send cookies for now
    };
    
    try {
        const response = await fetch(url, config);
        
        // Handle 401 Unauthorized - clear token and redirect to login
        if (response.status === 401) {
            console.log('Unauthorized access - clearing tokens');
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            authToken = null;
            refreshToken = null;
            
            // Don't throw error for auth check, just return null
            if (endpoint === '/api/auth/me') {
                return null;
            }
            
            // For other endpoints, redirect to landing
            const landingPage = document.getElementById('landing-page');
            const dashboardContainer = document.getElementById('dashboard-container');
            if (landingPage) landingPage.style.display = 'block';
            if (dashboardContainer) dashboardContainer.style.display = 'none';
            
            throw new Error('Session expired. Please login again.');
        }
        
        return handleResponse(response);
    } catch (error) {
        console.error('API Request failed:', error);
        throw error;
    }
}

async function handleResponse(response) {
    // Check if response is empty
    const text = await response.text();
    if (!text) {
        return {};
    }
    
    try {
        const data = JSON.parse(text);
        if (!response.ok) {
            throw new Error(data.message || data.error || 'API request failed');
        }
        return data;
    } catch (e) {
        console.error('Failed to parse response:', text);
        throw new Error('Invalid server response');
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
                try {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response);
                } catch (e) {
                    resolve({ success: true });
                }
            } else {
                reject(new Error('Upload failed'));
            }
        });
        
        xhr.addEventListener('error', () => reject(new Error('Upload failed')));
        
        xhr.open('POST', `${API_BASE_URL}${endpoint}`);
        if (authToken) {
            xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
        }
        xhr.send(formData);
    });
}

// Export for use in other modules
window.apiRequest = apiRequest;
window.uploadFile = uploadFile;
