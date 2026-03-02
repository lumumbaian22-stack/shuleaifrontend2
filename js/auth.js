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
            role: 'admin'
        };
    } else if (role === 'teacher') {
        credentials = {
            email: document.getElementById('teacher-id').value,
            password: document.getElementById('teacher-pass').value,
            role: 'teacher'
        };
    } else if (role === 'parent') {
        credentials = {
            email: document.getElementById('parent-id').value,
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
            password: document.getElementById('super-key').value
        };
    }

    try {
        window.showToast('Logging in...', 'info');
        
        const response = await api.login(role, credentials);
        
        if (response) {
            window.showToast('Login successful!', 'success');
            
            window.currentUser = response.user;
            window.currentSchool = response.school;
            
            localStorage.setItem('shuleai_user', JSON.stringify(response.user));
            localStorage.setItem('shuleai_school', JSON.stringify(response.school));
            
            setTimeout(() => { 
                hideAll(); 
                document.getElementById(`${role}-dashboard`).style.display = 'block'; 
                window.loadDashboard(role); 
                
                if (role === 'student') {
                    document.getElementById('chat-toggle').style.display = 'flex';
                    window.initDraggableChat();
                }
            }, 500);
        }
    } catch (error) {
        window.showToast(error.message || 'Login failed', 'error');
    }
};

window.handleSignup = async function(e, role) {
    e.preventDefault();
    
    if (role === 'admin') {
        const data = {
            name: document.getElementById('admin-name').value,
            email: document.getElementById('admin-email').value,
            password: document.getElementById('admin-password').value,
            phone: document.getElementById('admin-phone').value,
            role: 'admin',
            schoolName: document.getElementById('school-name').value,
            schoolAddress: document.getElementById('school-address').value,
            schoolSystem: document.getElementById('school-system').value
        };
        
        try {
            window.showToast('Creating your school...', 'info');
            const response = await api.register(data);
            
            if (response.success) {
                window.showToast('School created! You can now login.', 'success');
                setTimeout(() => showLogin('admin'), 2000);
            }
        } catch (error) {
            window.showToast(error.message, 'error');
        }
        
    } else if (role === 'teacher') {
        const data = {
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
};

window.logout = async function() {
    try {
        await api.logout();
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        localStorage.clear();
        window.showToast('Logged out', 'info'); 
        showLanding(); 
        document.getElementById('chat-widget').style.display = 'none';
        document.getElementById('chat-toggle').style.display = 'none';
        window.destroyCharts();
        window.currentUser = null;
        window.currentSchool = null;
    }
};
