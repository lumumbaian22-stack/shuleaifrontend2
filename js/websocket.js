// websocket.js - Real-time features (preserves your logic)

let socket = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
let messageHandlers = {};

function connectWebSocket() {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    
    const wsUrl = window.CONFIG?.WS_URL || 'wss://shuleaibackend-32h1.onrender.com';
    const fullUrl = `${wsUrl}?token=${token}`;
    
    try {
        socket = new WebSocket(fullUrl);
        
        socket.onopen = () => {
            console.log('WebSocket connected');
            reconnectAttempts = 0;
            
            // Join user's personal room
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.id) {
                socket.send(JSON.stringify({
                    type: 'join',
                    userId: user.id
                }));
            }
        };
        
        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                handleWebSocketMessage(data);
            } catch (e) {
                console.error('Failed to parse WebSocket message:', e);
            }
        };
        
        socket.onclose = () => {
            console.log('WebSocket disconnected');
            if (reconnectAttempts < maxReconnectAttempts) {
                reconnectAttempts++;
                setTimeout(connectWebSocket, 1000 * reconnectAttempts);
            }
        };
        
        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    } catch (error) {
        console.error('WebSocket connection failed:', error);
    }
}

function handleWebSocketMessage(data) {
    switch (data.type) {
        case 'private-message':
            handlePrivateMessage(data);
            break;
        case 'alert':
            handleAlert(data);
            break;
        case 'duty-update':
            handleDutyUpdate(data);
            break;
        case 'attendance-update':
            handleAttendanceUpdate(data);
            break;
        default:
            if (messageHandlers[data.type]) {
                messageHandlers[data.type].forEach(handler => handler(data));
            }
    }
}

function handlePrivateMessage(data) {
    // Use your existing showToast function
    if (typeof window.showToast === 'function') {
        window.showToast(`New message from ${data.from || 'someone'}`, 'info');
    }
    
    // Update message count
    const messageCount = document.querySelector('.message-count, #message-count, [data-message-count]');
    if (messageCount) {
        const count = parseInt(messageCount.textContent) + 1;
        messageCount.textContent = count;
    }
    
    // Dispatch event for chat components
    const event = new CustomEvent('new-message', { detail: data });
    window.dispatchEvent(event);
}

function handleAlert(data) {
    if (typeof window.showToast === 'function') {
        window.showToast(data.message || 'New notification', data.severity || 'info');
    }
    
    // Update notifications list if it exists (preserves your UI)
    const notificationsList = document.getElementById('notifications-list');
    if (notificationsList) {
        const notification = document.createElement('div');
        notification.className = 'p-3 hover:bg-accent/50 border-b';
        notification.innerHTML = `
            <p class="text-sm font-medium">${data.title || 'Notification'}</p>
            <p class="text-xs text-muted-foreground">${data.message || ''}</p>
            <p class="text-xs text-muted-foreground mt-1">${timeAgo(new Date(data.timestamp))}</p>
        `;
        notificationsList.prepend(notification);
    }
}

function handleDutyUpdate(data) {
    // Update duty card if it exists (preserves your duty card UI)
    const dutyCard = document.getElementById('duty-card');
    if (dutyCard) {
        updateDutyCard(dutyCard, data);
    }
}

function handleAttendanceUpdate(data) {
    // Update attendance display for parents (preserves your UI)
    const attendanceDisplay = document.getElementById('live-attendance');
    if (attendanceDisplay) {
        attendanceDisplay.innerHTML = `
            <p class="text-3xl font-bold">Checked in at ${data.checkInTime || 'unknown'}</p>
            <p class="text-sm text-muted-foreground mt-1">Gate: ${data.gate || 'Main Entrance'}</p>
        `;
    }
}

function onMessage(type, handler) {
    if (!messageHandlers[type]) {
        messageHandlers[type] = [];
    }
    messageHandlers[type].push(handler);
}

function sendPrivateMessage(recipientId, content) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
            type: 'private-message',
            to: recipientId,
            message: content
        }));
        return true;
    } else {
        if (typeof window.showToast === 'function') {
            window.showToast('Cannot send message: Not connected', 'error');
        }
        return false;
    }
}

function joinRoom(roomId) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
            type: 'join-room',
            roomId
        }));
    }
}

function leaveRoom(roomId) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
            type: 'leave-room',
            roomId
        }));
    }
}

// Helper function (preserves your timeAgo logic)
function timeAgo(timestamp) {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
        }
    }
    
    return 'just now';
}

function updateDutyCard(card, data) {
    const statusSpan = card.querySelector('.duty-status');
    if (statusSpan) {
        statusSpan.textContent = data.status === 'checked-in' ? 'Checked In' : 'Not Checked In';
        statusSpan.className = `duty-status px-2 py-1 ${data.status === 'checked-in' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} text-xs rounded-full`;
    }
    
    const checkInBtn = document.getElementById('check-in-btn');
    const checkOutBtn = document.getElementById('check-out-btn');
    
    if (checkInBtn && checkOutBtn) {
        if (data.status === 'checked-in') {
            checkInBtn.disabled = true;
            checkOutBtn.disabled = false;
        } else {
            checkInBtn.disabled = false;
            checkOutBtn.disabled = true;
        }
    }
}

// Initialize connection when authenticated
document.addEventListener('auth-changed', (e) => {
    if (e.detail.authenticated && window.CONFIG?.ENABLE_WEBSOCKET !== false) {
        connectWebSocket();
    } else if (socket) {
        socket.close();
    }
});

// Export functions
window.connectWebSocket = connectWebSocket;
window.sendPrivateMessage = sendPrivateMessage;
window.joinRoom = joinRoom;
window.leaveRoom = leaveRoom;
window.onMessage = onMessage;
