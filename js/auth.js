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
    let loginButton = e.target.querySelector('button[type="submit"]');
    let originalText = loginButton ? loginButton.innerHTML : '';
    
    // Build credentials based on role
    if (role === 'admin') {
        credentials = {
            email: document.getElementById('admin-email')?.value || document.getElementById('admin-id')?.value,
            password: document.getElementById('admin-password')?.value || document.getElementById('admin-pass')?.value,
            schoolCode: document.getElementById('admin-school')?.value
        };
    } else if (role === 'teacher') {
        credentials = {
            email: document.getElementById('teacher-email')?.value || document.getElementById('teacher-id')?.value,
            password: document.getElementById('teacher-password')?.value || document.getElementById('teacher-pass')?.value,
            schoolCode: document.getElementById('teacher-school')?.value
        };
    } else if (role === 'parent') {
        credentials = {
            email: document.getElementById('parent-email')?.value || document.getElementById('parent-id')?.value,
            password: document.getElementById('parent-password')?.value || document.getElementById('parent-pass')?.value
        };
    } else if (role === 'student') {
        credentials = {
            elimuid: document.getElementById('student-elimuid')?.value || document.getElementById('student-id')?.value,
            password: document.getElementById('student-password')?.value || document.getElementById('student-pass')?.value
        };
    } else if (role === 'super') {
        credentials = {
            secretKey: document.getElementById('super-key')?.value
        };
    }

    // Validate required fields
    if (role === 'student' && !credentials.elimuid) {
        window.showToast('ELIMUID is required', 'warning');
        return;
    }
    if (role !== 'student' && role !== 'super' && !credentials.email) {
        window.showToast('Email is required', 'warning');
        return;
    }
    if (!credentials.password && role !== 'super') {
        window.showToast('Password is required', 'warning');
        return;
    }
    if ((role === 'admin' || role === 'teacher') && !credentials.schoolCode) {
        window.showToast('School code is required', 'warning');
        return;
    }

    try {
        window.showToast('Logging in...', 'info');
        
        if (loginButton) {
            loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            loginButton.disabled = true;
        }
        
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
        console.error('Login error:', error);
        window.showToast(error.message || 'Login failed. Check your credentials.', 'error');
    } finally {
        if (loginButton) {
            loginButton.innerHTML = originalText;
            loginButton.disabled = false;
        }
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
        
        // Validate
        if (!data.name || !data.email || !data.password || !data.schoolId) {
            window.showToast('Please fill all required fields', 'warning');
            return;
        }
        
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
        window.showToast('Logged out', 'info');
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
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
