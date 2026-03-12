// WebSocket connection for real-time features

let socket = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

function connectWebSocket() {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    
    socket = new WebSocket(`wss://shuleaibackend-32h1.onrender.com?token=${token}`);
    
    socket.onopen = () => {
        console.log('WebSocket connected');
        reconnectAttempts = 0;
    };
    
    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
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
}

function handleWebSocketMessage(data) {
    switch (data.type) {
        case 'private-message':
            handlePrivateMessage(data);
            break;
        case 'alert':
            handleAlert(data);
            break;
        case 'duty-reminder':
            handleDutyReminder(data);
            break;
        case 'attendance-update':
            handleAttendanceUpdate(data);
            break;
        default:
            console.log('Unknown message type:', data.type);
    }
}

function handlePrivateMessage(data) {
    // Update chat UI
    showToast(`New message from ${data.from}`, 'info');
    
    // Update message count in sidebar
    const messageCount = document.getElementById('message-count');
    if (messageCount) {
        const count = parseInt(messageCount.textContent) + 1;
        messageCount.textContent = count;
        messageCount.classList.remove('hidden');
    }
    
    // Add message to chat if open
    const chatContainer = document.getElementById('chat-messages');
    if (chatContainer) {
        appendMessage(chatContainer, data);
    }
}

function handleAlert(data) {
    showToast(data.message, data.type || 'info');
    
    // Add to notifications panel
    const notificationsList = document.getElementById('notifications-list');
    if (notificationsList) {
        addNotification(notificationsList, data);
    }
}

function handleDutyReminder(data) {
    showToast(`Duty Reminder: ${data.message}`, 'warning');
    
    // Update duty card if present
    const dutyCard = document.getElementById('duty-card');
    if (dutyCard) {
        updateDutyCard(dutyCard, data);
    }
}

function handleAttendanceUpdate(data) {
    // Update attendance display for parents
    const attendanceDisplay = document.getElementById('live-attendance');
    if (attendanceDisplay) {
        attendanceDisplay.innerHTML = `
            <p class="text-3xl font-bold">Checked in at ${data.checkInTime}</p>
            <p class="text-sm text-muted-foreground">Gate: ${data.gate}</p>
        `;
    }
}

function sendMessage(recipientId, content) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
            type: 'private-message',
            recipientId,
            content,
            timestamp: new Date().toISOString()
        }));
    } else {
        showToast('Cannot send message: Not connected', 'error');
    }
}

function joinChatRoom(roomId) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
            type: 'join-room',
            roomId
        }));
    }
}

function leaveChatRoom(roomId) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
            type: 'leave-room',
            roomId
        }));
    }
}

// Helper functions
function appendMessage(container, message) {
    const messageEl = document.createElement('div');
    messageEl.className = message.sent ? 'chat-bubble-sent' : 'chat-bubble-received';
    messageEl.innerHTML = `
        <p class="text-sm">${message.content}</p>
        <p class="text-xs text-muted-foreground mt-1">${message.from} • ${timeAgo(message.timestamp)}</p>
    `;
    container.appendChild(messageEl);
    container.scrollTop = container.scrollHeight;
}

function addNotification(container, notification) {
    const notificationEl = document.createElement('div');
    notificationEl.className = 'p-3 hover:bg-accent/50 transition-colors border-b';
    notificationEl.innerHTML = `
        <p class="text-sm font-medium">${notification.title}</p>
        <p class="text-xs text-muted-foreground">${notification.message}</p>
        <p class="text-xs text-muted-foreground mt-1">${timeAgo(notification.timestamp)}</p>
    `;
    container.insertBefore(notificationEl, container.firstChild);
}

function updateDutyCard(card, data) {
    const statusSpan = card.querySelector('.duty-status');
    if (statusSpan) {
        statusSpan.textContent = data.status;
        statusSpan.className = `duty-status px-2 py-1 ${data.status === 'checked-in' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} text-xs rounded-full`;
    }
}

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

// Initialize connection when authenticated
document.addEventListener('auth-state-changed', (e) => {
    if (e.detail.authenticated) {
        connectWebSocket();
    } else if (socket) {
        socket.close();
    }
});

// Export functions
window.sendMessage = sendMessage;
window.joinChatRoom = joinChatRoom;
window.leaveChatRoom = leaveChatRoom;