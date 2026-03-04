// config.js - Central configuration
// Add this as a new file in your js folder

const CONFIG = {
    // API Configuration - CHANGE THIS TO YOUR RENDER BACKEND URL
    API_URL: 'https://shuleaibackend-32h1.onrender.com',
    
    // WebSocket URL (same as API but with ws/wss protocol)
    get WS_URL() {
        return this.API_URL.replace('https://', 'wss://').replace('http://', 'ws://');
    },
    
    // Feature flags (set to false to use mock data if backend is down)
    USE_REAL_API: true, // Set to false to use mock data for development
    ENABLE_WEBSOCKET: true,
    
    // Upload limits
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
};

// Freeze config to prevent modifications
Object.freeze(CONFIG);
window.CONFIG = CONFIG;
