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
    
    // Build credentials based on role - MATCHING BACKEND EXPECTATIONS
    if (role === 'admin') {
        credentials = {
            email: document.getElementById('admin-id').value + '@school.edu', // Make it a valid email
            password: document.getElementById('admin-pass').value,
            role: 'admin'
        };
    } else if (role === 'teacher') {
        credentials = {
            email: document.getElementById('teacher-id').value + '@school.edu',
            password: document.getElementById('teacher-pass').value,
            role: 'teacher'
        };
    } else if (role === 'parent') {
        credentials = {
            email: document.getElementById('parent-id').value + '@parent.com',
            password: document.getElementById('parent-pass').value,
            role: 'parent'
        };
    } else if (role === 'student') {
        credentials = {
            elimuid: document.getElementById('student-id').value,
            password: document.getElementById('student-pass').value,
            role: 'student'
        };
    } else if (role === 'super') {
        credentials = {
            role: 'super_admin',
            password: document.getElementById('super-key').value  // CHANGED: secretKey → password
        };
    }

    // Debug: See what's being sent
    console.log('📤 Sending login request:', credentials);

    try {
        window.showToast('Logging in...', 'info');
        
        // Call the API
        const response = await api.login(role, credentials);
        
        if (response) {
            window.showToast('Login successful!', 'success');
            
            // Store user data globally
            window.currentUser = response.user;
            window.currentSchool = response.school;
            
            // For parent, set children if available
            if (role === 'parent' && response.profile?.children) {
                window.currentChildren = response.profile.children;
                if (window.currentChildren.length > 0) {
                    window.activeChildId = window.currentChildren[0].id;
                }
            }
            
            // For student, set student info
            if (role === 'student') {
                window.currentUser = {
                    ...response.user,
                    ...response.profile
                };
            }
            
            // Show appropriate dashboard
            setTimeout(() => { 
                hideAll(); 
                document.getElementById(`${role}-dashboard`).style.display = 'block'; 
                window.loadDashboard(role); 
                
                if (role === 'student') {
                    document.getElementById('chat-toggle').style.display = 'flex';
                    window.initDraggableChat();
                } else {
                    document.getElementById('chat-toggle').style.display = 'none';
                    document.getElementById('chat-widget').style.display = 'none';
                }
            }, 500);
        }
    } catch (error) {
        console.error('❌ Login error:', error);
        window.showToast(error.message || 'Login failed', 'error');
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
            qualification: 'Bachelor of Education'
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
        window.currentChildren = [];
        window.activeChildId = null;
    }
};
