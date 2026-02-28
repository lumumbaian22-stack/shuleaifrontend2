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

// NEW: Show signup page
window.showSignup = function(role) {
    hideAll();
    document.getElementById(`${role}-signup`).style.display = 'block';
};

window.handleLogin = async function(e, role) {
    e.preventDefault();
    let credentials = {};

    if (role === 'admin') {
        credentials = {
            schoolCode: document.getElementById('admin-school').value,
            adminId: document.getElementById('admin-id').value,
            password: document.getElementById('admin-pass').value
        };
    } else if (role === 'teacher') {
        credentials = {
            schoolCode: document.getElementById('teacher-school').value,
            teacherId: document.getElementById('teacher-id').value,
            password: document.getElementById('teacher-pass').value,
            subject: document.getElementById('teacher-subject').value
        };
    } else if (role === 'parent') {
        credentials = {
            parentId: document.getElementById('parent-id').value,
            password: document.getElementById('parent-pass').value
        };
    } else if (role === 'student') {
        credentials = {
            schoolCode: document.getElementById('student-school').value,
            elimuid: document.getElementById('student-id').value,
            password: document.getElementById('student-pass').value
        };
    } else if (role === 'super') {
        credentials = {
            secretKey: document.getElementById('super-key').value
        };
    }

    try {
        const user = await window.api.login(role, credentials);
        window.currentUser = user;

        if (role === 'admin' || role === 'teacher') {
            window.currentSchool = user.school;
        } else if (role === 'parent') {
            const children = await window.api.getChildren(user.id);
            window.currentChildren = children;
            window.activeChildId = children[0]?.id;
            window.currentSchool = children[0]?.school;
        } else if (role === 'student') {
            window.currentSchool = user.school;
        }

        if (window.auditLogs) {
            window.auditLogs.push({
                id: window.auditLogs.length + 1,
                user: user.id,
                action: 'Login',
                timestamp: new Date().toLocaleString(),
                ip: '192.168.1.' + Math.floor(Math.random() * 255)
            });
        }

        window.showToast('Login successful!', 'success');
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
    } catch (err) {
        // Error already shown by api.js
    }
};

// NEW: Signup handler
window.handleSignup = async function(e, role) {
    e.preventDefault();
    let data = {};

    if (role === 'admin') {
        data = {
            name: document.getElementById('admin-name').value,
            email: document.getElementById('admin-email').value,
            phone: document.getElementById('admin-phone').value,
            password: document.getElementById('admin-password').value,
            school: {
                name: document.getElementById('school-name').value,
                address: document.getElementById('school-address').value,
                code: document.getElementById('school-code').value,
                system: document.getElementById('school-system').value
            }
        };
    } else if (role === 'teacher') {
        data = {
            name: document.getElementById('teacher-name').value,
            email: document.getElementById('teacher-email').value,
            phone: document.getElementById('teacher-phone').value,
            subject: document.getElementById('teacher-subject').value,
            schoolCode: document.getElementById('teacher-school-code').value,
            password: document.getElementById('teacher-password').value
        };
    } else if (role === 'parent') {
        data = {
            name: document.getElementById('parent-name').value,
            email: document.getElementById('parent-email').value,
            phone: document.getElementById('parent-phone').value,
            studentElimuid: document.getElementById('student-elimuid').value,
            password: document.getElementById('parent-password').value
        };
    }

    try {
        const response = await window.api.signup(role, data);
        window.showToast('Registration successful! You can now login.', 'success');
        setTimeout(() => showLogin(role), 2000);
    } catch (err) {
        // Error already shown
    }
};

window.logout = function() {
    window.api.logout();
    window.showToast('Logged out');
    window.showLanding();
    document.getElementById('chat-widget').style.display = 'none';
    document.getElementById('chat-toggle').style.display = 'none';
    window.destroyCharts();
    window.currentUser = null;
};