// ==================== CHAT FUNCTIONS ====================

window.chatVisible = false;
window.currentChatTab = 'ai';
window.isDragging = false;
window.offsetX = 0;
window.offsetY = 0;

window.initDraggableChat = function() {
    const chatWidget = document.getElementById('chat-widget');
    const chatHeader = document.getElementById('chat-header');
    
    if (window.innerWidth <= 768) {
        chatWidget.classList.remove('draggable');
        return;
    }
    
    chatWidget.classList.add('draggable');
    
    chatHeader.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);
    
    function startDragging(e) {
        if (window.innerWidth <= 768) return;
        isDragging = true;
        const rect = chatWidget.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        chatWidget.style.transition = 'none';
    }
    
    function drag(e) {
        if (!isDragging || window.innerWidth <= 768) return;
        e.preventDefault();
        
        const x = Math.min(Math.max(e.clientX - offsetX, 0), window.innerWidth - chatWidget.offsetWidth);
        const y = Math.min(Math.max(e.clientY - offsetY, 0), window.innerHeight - chatWidget.offsetHeight);
        
        chatWidget.style.left = x + 'px';
        chatWidget.style.top = y + 'px';
        chatWidget.style.right = 'auto';
        chatWidget.style.bottom = 'auto';
    }
    
    function stopDragging() {
        if (window.innerWidth <= 768) return;
        isDragging = false;
        chatWidget.style.transition = '';
    }
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
    const msgs = chatMessages[currentChatTab] || [];
    document.getElementById('chat-messages').innerHTML = msgs.map(m => `<div class="message ${m.sender === 'You' ? 'outgoing' : 'incoming'}"><div class="message-avatar">${m.avatar}</div><div class="message-bubble"><div class="message-sender">${m.sender}</div><div>${m.text}</div><div class="message-time">${m.time}</div></div></div>`).join('');
    document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;
};

window.sendChatMessage = function() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;
    
    const timeStr = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    chatMessages[currentChatTab].push({ id: Date.now(), sender: 'You', text, time: timeStr, avatar: 'Y' });
    loadChatMessages();
    
    setTimeout(() => {
        let response = currentChatTab === 'ai' ? 
            (text.toLowerCase().includes('math') ? "Let me help you with that math problem!" : 
             text.toLowerCase().includes('science') ? "Science is fascinating! What topic?" : 
             "Thanks for your question! I'm here to help.") :
            currentChatTab === 'private' ? "Friend: Got your message, will reply soon!" :
            "Group: Thanks for sharing!";
        
        chatMessages[currentChatTab].push({
            id: Date.now(),
            sender: currentChatTab === 'ai' ? 'AI' : (currentChatTab === 'private' ? 'Friend' : 'Group'),
            text: response,
            time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}),
            avatar: currentChatTab === 'ai' ? 'AI' : 'F'
        });
        loadChatMessages();
    }, 1000);
    
    input.value = '';
};