// ==================== DASHBOARD FUNCTIONS ====================

// Menu structures remain the same (they define tabs, not data)
window.menus = {
    admin: [ /* ... unchanged ... */ ],
    teacher: [ /* ... unchanged ... */ ],
    parent: [ /* ... unchanged ... */ ],
    student: [ /* ... unchanged ... */ ],
    super: [ /* ... unchanged ... */ ]
};

window.renderMenu = function(role) {
    const menuContainer = document.getElementById(`${role}-menu`);
    if (!menuContainer) return;
    
    let html = '';
    menus[role].forEach(section => {
        if (section.section === 'CHILDREN' && role === 'parent') {
            html += `<div class="menu-section"><h4>MY CHILDREN</h4>`;
            if (window.currentChildren && window.currentChildren.length) {
                window.currentChildren.forEach(child => {
                    html += `<a class="menu-item ${child.id === window.activeChildId ? 'active' : ''}" onclick="switchChild('${child.id}')">
                        <i class="fas fa-child"></i> ${child.name} <small>Gr ${child.grade}</small>
                    </a>`;
                });
            } else {
                html += `<div class="menu-item">No children linked</div>`;
            }
            html += `</div>`;
        } else {
            html += `<div class="menu-section"><h4>${section.section}</h4>`;
            section.items.forEach(item => {
                html += `<a class="menu-item" onclick="switch${role.charAt(0).toUpperCase() + role.slice(1)}Tab('${item.tab}')">
                    <i class="fas ${item.icon}"></i> ${item.name}
                </a>`;
            });
            html += `</div>`;
        }
    });
    menuContainer.innerHTML = html;
};

window.loadDashboard = async function(role) {
    // Fetch current user data if not already set
    if (!window.currentUser) {
        try {
            const data = await api.getCurrentUser();
            window.currentUser = data.data.user;
            window.currentSchool = data.data.school;
            window.currentProfile = data.data.profile;
        } catch (error) {
            console.error('Failed to load user data', error);
            showToast('Session expired, please login again', 'error');
            logout();
            return;
        }
    }
    
    if (window.currentSchool) {
        const schoolNameElements = ['admin-school-name', 'teacher-school-name', 'parent-school-name', 'student-school-name'];
        schoolNameElements.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = window.currentSchool.name;
        });
    }
    
    if (role === 'admin') window.switchAdminTab('dashboard');
    if (role === 'teacher') {
        document.getElementById('teacher-info').textContent = `${window.currentUser.name} · ${window.currentUser.subject || ''}`;
        document.getElementById('teacher-class-info').innerHTML = `<i class="fas fa-users"></i> <span>${window.currentUser.class || ''} · 0 Students</span>`;
        // Fetch actual class size
        try {
            const studentsData = await api.getTeacherStudents();
            const count = studentsData.data.length;
            document.getElementById('teacher-class-info').innerHTML = `<i class="fas fa-users"></i> <span>${window.currentUser.class || ''} · ${count} Students</span>`;
        } catch (e) {}
        window.switchTeacherTab('dashboard');
    }
    if (role === 'parent') { 
        // Fetch children
        try {
            const childrenData = await api.getChildren();
            window.currentChildren = childrenData.data;
            if (window.currentChildren.length > 0) {
                window.activeChildId = window.currentChildren[0].id;
            }
        } catch (e) {}
        window.renderMenu('parent');
        window.switchParentTab('dashboard');
        setTimeout(() => {
            if (window.parentPopupEnabled) window.showParentPopup();
        }, 2000);
    }
    if (role === 'student') { 
        try {
            const dashboardData = await api.getStudentDashboard();
            // Update UI with data
            document.getElementById('student-info').textContent = `${window.currentUser.name} · Grade ${window.currentUser.grade || ''}`;
            const avg = dashboardData.data.averageScore || 0;
            document.getElementById('student-achievement').innerHTML = `<i class="fas fa-star" style="color: #eab308;"></i> <span>Average: ${Math.round(avg)}%</span>`;
        } catch (e) {}
        window.switchStudentTab('dashboard');
    }
    if (role === 'super') window.loadSuperDashboard();
};

window.updateActiveMenu = function(sidebarId, activeTab) {
    const sidebar = document.getElementById(sidebarId);
    if (!sidebar) return;
    sidebar.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    const activeItem = Array.from(sidebar.querySelectorAll('.menu-item')).find(item => item.getAttribute('onclick')?.includes(activeTab));
    if (activeItem) activeItem.classList.add('active');
};
