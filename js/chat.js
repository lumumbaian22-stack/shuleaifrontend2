// ==================== CHAT FUNCTIONS ====================

window.socket = null;
window.chatVisible = false;
window.currentChatTab = 'ai';
window.isDragging = false;

window.initSocket = function() {
    if (window.socket) return;
    const socket = io(API_BASE.replace('/api', '')); // Connect to server
    socket.on('connect', () => {
        console.log('Socket connected');
        if (window.currentUser) {
            socket.emit('join', window.currentUser.id);
        }
    });
    socket.on('private-message', (data) => {
        // Add message to UI
        const msg = {
            id: Date.now(),
            sender: data.from,
            text: data.message,
            time: new Date(data.timestamp).toLocaleTimeString(),
            avatar: data.from.charAt(0)
        };
        // If chat open and correct tab, add to messages
        if (chatVisible && currentChatTab === 'private') {
            // Need to know conversation partner
            // For simplicity, we'll just append to a global array
            if (!window.chatMessages.private) window.chatMessages.private = [];
            window.chatMessages.private.push(msg);
            loadChatMessages();
        }
    });
    socket.on('alert', (alert) => {
        showToast(alert.message, alert.severity);
    });
    window.socket = socket;
};

window.toggleChat = function() { 
    chatVisible = !chatVisible; 
    document.getElementById('chat-widget').style.display = chatVisible ? 'flex' : 'none'; 
    if (chatVisible) loadChatMessages();
};

window.minimizeChat = function() { 
    document.getElementById('chat-widget').style.display = 'none'; 
    chatVisible = false; 
};

window.switchChatTab = function(tab) {
    currentChatTab = tab;
    document.querySelectorAll('.chat-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    loadChatMessages();
};

window.loadChatMessages = function() {
    const msgs = window.chatMessages?.[currentChatTab] || [];
    document.getElementById('chat-messages').innerHTML = msgs.map(m => `<div class="message ${m.sender === 'You' ? 'outgoing' : 'incoming'}"><div class="message-avatar">${m.avatar}</div><div class="message-bubble"><div class="message-sender">${m.sender}</div><div>${m.text}</div><div class="message-time">${m.time}</div></div></div>`).join('');
    document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;
};

window.sendChatMessage = function() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;
    
    const timeStr = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    const msg = { id: Date.now(), sender: 'You', text, time: timeStr, avatar: 'Y' };
    
    if (currentChatTab === 'ai') {
        // Send to AI endpoint (not implemented yet)
        window.chatMessages.ai.push(msg);
        loadChatMessages();
        // Simulate AI response
        setTimeout(() => {
            const reply = { id: Date.now(), sender: 'AI', text: "I'm here to help!", time: new Date().toLocaleTimeString(), avatar: 'AI' };
            window.chatMessages.ai.push(reply);
            loadChatMessages();
        }, 1000);
    } else if (currentChatTab === 'private') {
        // Need to know recipient – for demo, send to a fixed user or open a contact selector
        // For now, just simulate
        window.chatMessages.private.push(msg);
        loadChatMessages();
        setTimeout(() => {
            const reply = { id: Date.now(), sender: 'Friend', text: "Got your message!", time: new Date().toLocaleTimeString(), avatar: 'F' };
            window.chatMessages.private.push(reply);
            loadChatMessages();
        }, 1500);
    } else if (currentChatTab === 'group') {
        // Group chat
        window.chatMessages.group.push(msg);
        loadChatMessages();
        setTimeout(() => {
            const reply = { id: Date.now(), sender: 'John (10A)', text: "Thanks for sharing!", time: new Date().toLocaleTimeString(), avatar: 'J' };
            window.chatMessages.group.push(reply);
            loadChatMessages();
        }, 1200);
    }
    
    input.value = '';
};

window.initDraggableChat = function() {
    // ... existing code
};
