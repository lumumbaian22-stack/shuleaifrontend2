// ==================== AUTHENTICATION FUNCTIONS ====================

window.showLanding = function() {
    hideAll();
    document.getElementById('landing-page').style.display = 'block';
    document.getElementById('chat-widget').style.display = 'none';
    document.getElementById('chat-toggle').style.display = 'none';
    closeAllModals();
};

window.showLogin = function(role) {
    hideAll();
    document.getElementById(`${role}-login`).style.display = 'block';
};

window.showSignup = function(role) {
    hideAll();
    document.getElementById(`${role}-signup`).style.display = 'block';
};

window.handleLogin = async function(e, role) {
    e.preventDefault();
    
    let credentials = {};
    
    if (role === 'admin') {
        credentials = {
            email: document.getElementById('admin-id').value,
            password: document.getElementById('admin-pass').value,
            schoolCode: document.getElementById('admin-school').value
        };
    } else if (role === 'teacher') {
        credentials = {
            email: document.getElementById('teacher-id').value,
            password: document.getElementById('teacher-pass').value,
            schoolCode: document.getElementById('teacher-school').value
        };
    } else if (role === 'parent') {
        credentials = {
            email: document.getElementById('parent-id').value,
            password: document.getElementById('parent-pass').value
        };
    } else if (role === 'student') {
        credentials = {
            elimuid: document.getElementById('student-id').value,
            password: document.getElementById('student-pass').value,
            schoolCode: document.getElementById('student-school').value
        };
    } else if (role === 'super') {
        credentials = {
            role: 'super_admin',
            secretKey: document.getElementById('super-key').value
        };
    }

    try {
        window.showToast('Logging in...', 'info');
        
        const response = await api.login(role, credentials);
        
        if (response) {
            window.showToast('Login successful!', 'success');
            
            // Store user data globally
            window.currentUser = response.user;
            window.currentSchool = response.school;
            window.currentProfile = response.profile;
            
            // For parent, set children if available
            if (role === 'parent' && response.profile?.children) {
                window.currentChildren = response.profile.children;
                if (window.currentChildren.length > 0) {
                    window.activeChildId = window.currentChildren[0].id;
                }
            }
            
            // For teacher, store subject/class
            if (role === 'teacher' && response.profile) {
                window.currentUser.subject = response.profile.subjects?.[0] || '';
                window.currentUser.class = response.profile.classTeacher || '';
            }
            
            // For student, store grade etc.
            if (role === 'student' && response.profile) {
                window.currentUser.grade = response.profile.grade;
                window.currentUser.elimuid = response.profile.elimuid;
            }
            
            setTimeout(() => { 
                hideAll(); 
                document.getElementById(`${role}-dashboard`).style.display = 'block'; 
                window.loadDashboard(role); 
                
                if (role === 'student') {
                    document.getElementById('chat-toggle').style.display = 'flex';
                    window.initDraggableChat();
                    window.initSocket(); // Initialize WebSocket for chat
                } else {
                    document.getElementById('chat-toggle').style.display = 'none';
                    document.getElementById('chat-widget').style.display = 'none';
                }
            }, 500);
        }
    } catch (error) {
        window.showToast(error.message || 'Login failed', 'error');
        console.error('Login error:', error);
    }
};

window.handleSignup = async function(e, role) {
    e.preventDefault();
    
    let data = {};
    
    if (role === 'teacher') {
        data = {
            name: document.getElementById('teacher-name').value,
            email: document.getElementById('teacher-email').value,
            password: document.getElementById('teacher-password').value,
            phone: document.getElementById('teacher-phone').value,
            schoolId: document.getElementById('teacher-school-code').value,
            subjects: [document.getElementById('teacher-subject').value],
            qualification: 'Bachelor of Education' // Default
        };
        
        try {
            window.showToast('Submitting registration...', 'info');
            const response = await api.teacherSignup(data);
            
            if (response.success) {
                window.showToast(response.message, 'success');
                setTimeout(() => showLogin('teacher'), 2000);
            }
        } catch (error) {
            window.showToast(error.message, 'error');
        }
    }
    // Add other signup handlers as needed
};

window.logout = async function() {
    try {
        await api.logout();
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        window.showToast('Logged out', 'info'); 
        showLanding(); 
        document.getElementById('chat-widget').style.display = 'none';
        document.getElementById('chat-toggle').style.display = 'none';
        window.destroyCharts();
        window.currentUser = null;
        window.currentSchool = null;
        window.currentProfile = null;
        window.currentChildren = [];
        window.activeChildId = null;
        if (window.socket) window.socket.disconnect();
    }
};
