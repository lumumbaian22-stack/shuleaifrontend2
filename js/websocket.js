// WebSocket connection for real-time features
let socket = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

function connectWebSocket() {
    // Check if Socket.io is loaded
    if (typeof io === 'undefined') {
        console.warn('Socket.io not loaded, real-time features disabled');
        return;
    }
    
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !user) return;
    
    try {
        socket = io('https://shuleaibackend-32h1.onrender.com', {
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });
        
        socket.on('connect', () => {
            console.log('✅ WebSocket connected');
            reconnectAttempts = 0;
            
            if (user) {
                socket.emit('join', user.id);
            }
        });
        
        socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
        });
        
        socket.on('alert', (data) => {
            handleAlert(data);
        });
        
        socket.on('private-message', (data) => {
            handlePrivateMessage(data);
        });
        
        socket.on('duty-roster-updated', (data) => {
            showToast(`Duty roster updated: ${data.message}`, 'info');
            if (currentSection === 'duty') {
                showDashboardSection('duty');
            }
        });
        
        socket.on('attendance-update', (data) => {
            handleAttendanceUpdate(data);
        });
        
        socket.on('school-updated', (data) => {
            handleSchoolUpdate(data);
        });
        
        socket.on('disconnect', () => {
            console.log('WebSocket disconnected');
            if (reconnectAttempts < maxReconnectAttempts) {
                reconnectAttempts++;
                setTimeout(connectWebSocket, 1000 * reconnectAttempts);
            }
        });
        
        window.globalSocket = socket;
    } catch (error) {
        console.error('Failed to connect WebSocket:', error);
    }
}

function handleAlert(data) {
    if (typeof showToast === 'function') {
        showToast(data.message, data.severity || 'info');
    }
    
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        const count = parseInt(badge.textContent) + 1;
        badge.textContent = count;
        badge.classList.remove('hidden');
    }
}

function handlePrivateMessage(data) {
    if (typeof showToast === 'function') {
        showToast(`New message from ${data.from}`, 'info');
    }
    
    const messageCount = document.getElementById('message-count');
    if (messageCount) {
        const count = parseInt(messageCount.textContent) + 1;
        messageCount.textContent = count;
        messageCount.classList.remove('hidden');
    }
    
    const chatContainer = document.getElementById('chat-messages');
    if (chatContainer && currentSection === 'chat') {
        appendMessage(chatContainer, data);
    }
}

function handleAttendanceUpdate(data) {
    const attendanceDisplay = document.getElementById('live-attendance');
    if (attendanceDisplay) {
        attendanceDisplay.innerHTML = `
            <p class="text-3xl font-bold">Checked in at ${data.checkInTime}</p>
            <p class="text-sm text-muted-foreground">Gate: ${data.gate}</p>
        `;
    }
}

function handleSchoolUpdate(data) {
    if (data.action === 'name-change') {
        const currentSchool = typeof getCurrentSchool === 'function' ? getCurrentSchool() : null;
        
        if (currentSchool && currentSchool.schoolId === data.schoolId) {
            currentSchool.name = data.newName;
            localStorage.setItem('school', JSON.stringify(currentSchool));
            
            if (typeof updateSchoolNameDisplay === 'function') {
                updateSchoolNameDisplay();
            }
            
            if (typeof updateSidebar === 'function') {
                const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
                if (user) {
                    updateSidebar(user.role);
                }
            }
            
            if (typeof showToast === 'function') {
                showToast(`School name updated to "${data.newName}"`, 'success');
            }
        }
    }
}

function sendMessage(recipientId, content) {
    if (socket && socket.connected) {
        socket.emit('private-message', {
            to: recipientId,
            message: content
        });
    } else {
        if (typeof showToast === 'function') {
            showToast('Cannot send message: Not connected', 'error');
        }
    }
}

function joinChatRoom(roomId) {
    if (socket && socket.connected) {
        socket.emit('join-room', roomId);
    }
}

function appendMessage(container, message) {
    const messageEl = document.createElement('div');
    messageEl.className = message.sent ? 'flex justify-end' : 'flex justify-start';
    messageEl.innerHTML = `
        <div class="${message.sent ? 'chat-bubble-sent' : 'chat-bubble-received'} max-w-[70%]">
            ${!message.sent ? `<p class="text-sm font-medium">${message.from}</p>` : ''}
            <p class="text-sm">${message.content}</p>
            <p class="text-xs text-muted-foreground mt-1">${typeof timeAgo === 'function' ? timeAgo(message.timestamp) : 'just now'}</p>
        </div>
    `;
    container.appendChild(messageEl);
    container.scrollTop = container.scrollHeight;
}

// Auto-connect when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Delay connection to ensure everything is loaded
    setTimeout(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            connectWebSocket();
        }
    }, 1000);
});

// Export functions
window.sendMessage = sendMessage;
window.joinChatRoom = joinChatRoom;
window.connectWebSocket = connectWebSocket;
window.handleSchoolUpdate = handleSchoolUpdate;
