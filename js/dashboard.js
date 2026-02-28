// ==================== DASHBOARD FUNCTIONS ====================

// Menu structures
window.menus = {
    admin: [
        { section: 'OVERVIEW', items: [
            { name: 'Dashboard', icon: 'fa-home', tab: 'dashboard' },
            { name: 'School Overview', icon: 'fa-school', tab: 'school' }
        ]},
        { section: 'MONITORING', items: [
            { name: 'Students', icon: 'fa-user-graduate', tab: 'students' },
            { name: 'Teachers', icon: 'fa-chalkboard-teacher', tab: 'teachers' },
            { name: 'Struggling Students', icon: 'fa-exclamation-triangle', tab: 'struggling' },
            { name: 'Active Users', icon: 'fa-check-circle', tab: 'active' }
        ]},
        { section: 'ACADEMICS', items: [
            { name: 'Analytics', icon: 'fa-chart-line', tab: 'analytics' },
            { name: 'Attendance', icon: 'fa-calendar-check', tab: 'attendance' },
            { name: 'Reports', icon: 'fa-file-alt', tab: 'reports' }
        ]},
        { section: 'FINANCE', items: [
            { name: 'Fee Collection', icon: 'fa-money-bill-wave', tab: 'fees' }
        ]},
        { section: 'COMMUNICATION', items: [
            { name: 'Messages', icon: 'fa-envelope', tab: 'messages' },
            { name: 'Send Alerts', icon: 'fa-bell', tab: 'alerts' },
            { name: 'Bullying Reports', icon: 'fa-shield-alt', tab: 'bullying' }
        ]},
        { section: 'SETTINGS', items: [
            { name: 'Profile', icon: 'fa-user-circle', tab: 'profile' },
            { name: 'School Settings', icon: 'fa-cog', tab: 'settings' },
            { name: 'Audit Logs', icon: 'fa-history', tab: 'audit' }
        ]}
    ],
    teacher: [
        { section: 'CLASS MANAGEMENT', items: [
            { name: 'Dashboard', icon: 'fa-home', tab: 'dashboard' },
            { name: 'My Students', icon: 'fa-users', tab: 'students' },
            { name: 'Enter Marks', icon: 'fa-pen', tab: 'marks' },
            { name: 'Attendance', icon: 'fa-calendar-check', tab: 'attendance' },
            { name: 'Comments', icon: 'fa-comment', tab: 'comments' }
        ]},
        { section: 'ANALYTICS', items: [
            { name: 'Class Analytics', icon: 'fa-chart-bar', tab: 'class-analytics' },
            { name: 'Subject Analytics', icon: 'fa-chart-pie', tab: 'subject-analytics' },
            { name: 'Struggling Students', icon: 'fa-exclamation-triangle', tab: 'struggling' }
        ]},
        { section: 'ASSIGNMENTS', items: [
            { name: 'Manage Assignments', icon: 'fa-tasks', tab: 'assignments' },
            { name: 'Give Alerts', icon: 'fa-bell', tab: 'alerts' }
        ]},
        { section: 'PERSONAL', items: [
            { name: 'Timetable', icon: 'fa-clock', tab: 'timetable' },
            { name: 'Reminders', icon: 'fa-calendar-plus', tab: 'reminders' },
            { name: 'Messages', icon: 'fa-envelope', tab: 'messages' },
            { name: 'Profile', icon: 'fa-user-circle', tab: 'profile' },
            { name: 'Settings', icon: 'fa-cog', tab: 'settings' }
        ]},
        { section: 'DATA', items: [
            { name: 'Upload Data', icon: 'fa-upload', tab: 'upload' },
            { name: 'Export Data', icon: 'fa-download', tab: 'export' }
        ]}
    ],
    parent: [
        { section: 'CHILDREN', items: [] },
        { section: 'OVERVIEW', items: [
            { name: 'Dashboard', icon: 'fa-home', tab: 'dashboard' },
            { name: 'Progress', icon: 'fa-chart-line', tab: 'progress' }
        ]},
        { section: 'ACADEMICS', items: [
            { name: 'Grades', icon: 'fa-star', tab: 'grades' },
            { name: 'Attendance', icon: 'fa-calendar-check', tab: 'attendance' },
            { name: 'Subject View', icon: 'fa-book', tab: 'subjects' },
            { name: 'Reports', icon: 'fa-file-alt', tab: 'reports' }
        ]},
        { section: 'ALERTS', items: [
            { name: 'Academic Alerts', icon: 'fa-exclamation-triangle', tab: 'academic-alerts' },
            { name: 'Attendance Alerts', icon: 'fa-calendar-times', tab: 'attendance-alerts' },
            { name: 'Fee Alerts', icon: 'fa-credit-card', tab: 'fee-alerts' },
            { name: 'Admin Messages', icon: 'fa-envelope', tab: 'messages' }
        ]},
        { section: 'FINANCE', items: [
            { name: 'Fee Statement', icon: 'fa-file-invoice', tab: 'fee-statement' },
            { name: 'Payment History', icon: 'fa-history', tab: 'payment-history' }
        ]},
        { section: 'GUIDANCE', items: [
            { name: 'Did You Know', icon: 'fa-lightbulb', tab: 'tips' },
            { name: 'AI Recommendations', icon: 'fa-robot', tab: 'ai-recommendations' }
        ]},
        { section: 'PERSONAL', items: [
            { name: 'Profile', icon: 'fa-user-circle', tab: 'profile' },
            { name: 'Settings', icon: 'fa-cog', tab: 'settings' }
        ]}
    ],
    student: [
        { section: 'DASHBOARD', items: [
            { name: 'My Dashboard', icon: 'fa-home', tab: 'dashboard' },
            { name: 'Progress', icon: 'fa-chart-line', tab: 'progress' },
            { name: 'Achievements', icon: 'fa-trophy', tab: 'achievements' }
        ]},
        { section: 'ACADEMICS', items: [
            { name: 'My Grades', icon: 'fa-star', tab: 'grades' },
            { name: 'Attendance', icon: 'fa-calendar-check', tab: 'attendance' },
            { name: 'Subject Performance', icon: 'fa-book', tab: 'subjects' },
            { name: 'Progress Report', icon: 'fa-file-alt', tab: 'report' }
        ]},
        { section: 'LEARNING', items: [
            { name: 'Learning Materials', icon: 'fa-book-open', tab: 'materials' },
            { name: 'Assignments', icon: 'fa-tasks', tab: 'assignments' },
            { name: 'AI Study Sessions', icon: 'fa-robot', tab: 'study-ai' },
            { name: 'Guided Study', icon: 'fa-graduation-cap', tab: 'study-guided' }
        ]},
        { section: 'INTERACTION', items: [
            { name: 'AI Chat', icon: 'fa-comment-dots', tab: 'ai-chat' },
            { name: 'Private Chat', icon: 'fa-user-friends', tab: 'private-chat' },
            { name: 'Group Chat', icon: 'fa-users', tab: 'group-chat' }
        ]},
        { section: 'ALERTS', items: [
            { name: 'Teacher Alerts', icon: 'fa-bell', tab: 'alerts' },
            { name: 'Recommendations', icon: 'fa-lightbulb', tab: 'recommendations' }
        ]},
        { section: 'PERSONAL', items: [
            { name: 'Timetable', icon: 'fa-clock', tab: 'timetable' },
            { name: 'Reminders', icon: 'fa-calendar-plus', tab: 'reminders' },
            { name: 'Profile', icon: 'fa-user-circle', tab: 'profile' },
            { name: 'Customize', icon: 'fa-cog', tab: 'settings' }
        ]}
    ],
    super: [
        { section: 'PLATFORM', items: [
            { name: 'Overview', icon: 'fa-globe', tab: 'overview' },
            { name: 'Demo Data', icon: 'fa-database', tab: 'demo' }
        ]}
    ]
};

window.renderMenu = function(role) {
    const menuContainer = document.getElementById(`${role}-menu`);
    if (!menuContainer) return;
    
    let html = '';
    menus[role].forEach(section => {
        if (section.section === 'CHILDREN' && role === 'parent') {
            html += `<div class="menu-section"><h4>MY CHILDREN</h4>`;
            currentChildren.forEach(child => {
                html += `<a class="menu-item ${child.id === activeChildId ? 'active' : ''}" onclick="switchChild('${child.id}')">
                    <i class="fas fa-child"></i> ${child.name} <small>Gr ${child.grade}</small>
                </a>`;
            });
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

window.loadDashboard = function(role) {
    if (currentSchool) {
        const schoolNameElements = ['admin-school-name', 'teacher-school-name', 'parent-school-name', 'student-school-name'];
        schoolNameElements.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = currentSchool.name;
        });
    }
    
    if (role === 'admin') window.switchAdminTab('dashboard');
    if (role === 'teacher') {
        document.getElementById('teacher-info').textContent = `${currentUser.name} · ${currentUser.subject}`;
        document.getElementById('teacher-class-info').innerHTML = `<i class="fas fa-users"></i> <span>${currentUser.class} · 35 Students</span>`;
        window.switchTeacherTab('dashboard');
    }
    if (role === 'parent') { 
        window.loadParentChildren();
        window.switchParentTab('dashboard');
        setTimeout(() => {
            if (window.parentPopupEnabled) window.showParentPopup();
        }, 2000);
    }
    if (role === 'student') { 
        const student = currentUser;
        document.getElementById('student-info').textContent = `${student.name} · Grade ${student.grade}`;
        const avg = academicRecords.filter(r => r.studentId === student.id).reduce((s, r) => s + r.score, 0) / 
                   (academicRecords.filter(r => r.studentId === student.id).length || 1);
        document.getElementById('student-achievement').innerHTML = `<i class="fas fa-star" style="color: #eab308;"></i> <span>Average: ${Math.round(avg)}%</span>`;
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