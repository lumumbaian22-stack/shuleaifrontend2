// ==================== STUDENT FUNCTIONS ====================

window.switchStudentTab = function(tab) {
    const student = currentUser;
    const records = academicRecords.filter(r => r.studentId === student.id);
    const avgScore = records.length ? Math.round(records.reduce((sum, a) => sum + a.score, 0) / records.length) : 0;
    
    if (tab === 'dashboard') {
        const achievements = studySessions.filter(s => s.studentId === student.id && s.completed).length;
        const attendance = attendanceRecords.filter(r => r.studentId === student.id && r.status === 'present').length;
        const totalDays = attendanceRecords.filter(r => r.studentId === student.id).length;
        const attendanceRate = totalDays ? Math.round((attendance / totalDays) * 100) : 100;
        
        document.getElementById('student-content').innerHTML = `
            <div class="stats-grid">
                <div class="stat-card"><div class="stat-icon" style="background:#10b981;"><i class="fas fa-star"></i></div><div class="stat-info"><h3>${avgScore}%</h3><p>Average</p></div></div>
                <div class="stat-card"><div class="stat-icon" style="background:#3b82f6;"><i class="fas fa-calendar-check"></i></div><div class="stat-info"><h3>${attendanceRate}%</h3><p>Attendance</p></div></div>
                <div class="stat-card"><div class="stat-icon" style="background:#eab308;"><i class="fas fa-trophy"></i></div><div class="stat-info"><h3>${achievements}</h3><p>Achievements</p></div></div>
            </div>
            <div class="card"><div class="card-header"><h3><i class="fas fa-chart-line"></i> My Performance</h3><button class="btn-small" onclick="switchStudentTab('progress')">View All</button></div><canvas id="studentChart"></canvas></div>
            <div class="ai-recommendations">
                <div class="recommendation-card" onclick="switchStudentTab('study-ai')"><i class="fas fa-robot"></i><h4>AI Study</h4><p>Start a session</p></div>
                <div class="recommendation-card" onclick="switchStudentTab('materials')" style="background: linear-gradient(135deg, #3b82f6, #2563eb);"><i class="fas fa-book"></i><h4>Materials</h4><p>Access resources</p></div>
            </div>
        `;
        setTimeout(() => {
            destroyCharts();
            const ctx = document.getElementById('studentChart')?.getContext('2d');
            if (ctx) activeCharts.push(new Chart(ctx, { type: 'bar', data: { labels: records.map(r => r.subject), datasets: [{ label: 'Scores', data: records.map(r => r.score), backgroundColor: '#10b981' }] }, options: { scales: { y: { beginAtZero: true, max: 100 } } } }));
        }, 100);
    } else if (tab === 'materials') {
        const classMaterials = learningMaterials.filter(m => m.class === student.grade);
        document.getElementById('student-content').innerHTML = `<h3>Learning Materials</h3>${['Mathematics','Science','English'].map(subj => `<div class="card"><h4>${subj}</h4><div class="materials-grid">${classMaterials.filter(m => m.subject === subj).map(m => `<div class="material-item" onclick="showToast('Opening ${m.title}')"><i class="fas ${m.type === 'video' ? 'fa-play-circle' : m.type === 'pdf' ? 'fa-file-pdf' : 'fa-book'}"></i><div><strong>${m.title}</strong><br><small>${m.type}</small></div></div>`).join('')}</div></div>`).join('')}`;
    } else if (tab === 'study-ai') {
        document.getElementById('student-content').innerHTML = `
            <h3>AI Study Sessions</h3>
            <div class="study-session-card" onclick="showToast('Starting Math session')"><i class="fas fa-calculator"></i><h4>Mathematics Review</h4><p>30 min · Algebra focus</p></div>
            <div class="study-session-card" onclick="showToast('Starting Science session')" style="background: linear-gradient(135deg, #3b82f6, #2563eb);"><i class="fas fa-flask"></i><h4>Science Practice</h4><p>20 min · Biology</p></div>
        `;
    } else if (tab === 'ai-chat') {
        document.getElementById('student-content').innerHTML = `<div class="card" style="text-align:center;padding:3rem;"><i class="fas fa-robot" style="font-size:4rem; color:#10b981;"></i><h4>AI Chat</h4><p>Ask me anything!</p><button class="btn-primary" onclick="toggleChat(); switchChatTab('ai')">Open Chat</button></div>`;
    } else if (tab === 'reminders') {
        document.getElementById('student-content').innerHTML = `
            <h3>My Reminders</h3>
            <div class="card"><h4>Set Reminder</h4><div class="form-group"><input type="text" id="reminder-title" placeholder="e.g., Math homework"></div><div class="form-group"><input type="datetime-local" id="reminder-time"></div><button class="btn-primary" onclick="setStudentReminder()">Add</button></div>
            <div class="timetable-grid">${reminders.filter(r => r.user === student.id).map(r => `<div class="reminder-item"><div><strong>${r.title}</strong><br><small>${new Date(r.time).toLocaleString()}</small></div><button class="btn-small" onclick="deleteReminder(${r.id})">Delete</button></div>`).join('')}</div>
        `;
    } else if (tab === 'profile') {
        document.getElementById('student-content').innerHTML = `
            <h3>My Profile</h3>
            <div class="card"><div style="text-align:center;"><img src="https://ui-avatars.com/api/?name=${student.name.replace(' ', '+')}&size=80&background=10b981&color=fff" style="border-radius:50%;"><h4>${student.name}</h4><p>Grade ${student.grade} · ELIMUID: ${student.elimuid}</p></div><div class="form-group"><label>Full Name</label><input type="text" id="student-name" value="${student.name}"></div><div class="form-group"><label>Email</label><input type="email" id="student-email" value="student@school.edu"></div><button class="btn-primary" onclick="updateStudentProfile()">Update</button></div>
        `;
    } else if (tab === 'settings') {
        document.getElementById('student-content').innerHTML = `
            <h3>Customize</h3>
            <div class="card"><h4>Theme</h4><select onchange="changeStudentTheme(this.value)"><option value="light">Light</option><option value="dark">Dark</option><option value="blue">Blue</option></select></div>
            <div class="card"><h4>Notifications</h4><div class="toggle-switch"><span>Push Notifications</span><label class="switch"><input type="checkbox" checked><span class="slider"></span></label></div></div>
        `;
    } else {
        document.getElementById('student-content').innerHTML = `<h3>${tab.replace(/-/g, ' ')}</h3><div class="card"><p>Content for ${tab} would appear here.</p></div>`;
    }
    
    updateActiveMenu('student-sidebar', tab);
};

window.setStudentReminder = function() {
    const title = document.getElementById('reminder-title')?.value;
    const time = document.getElementById('reminder-time')?.value;
    if (!title || !time) { showToast('Please fill all fields', 'warning'); return; }
    reminders.push({ id: reminders.length + 1, user: currentUser.id, title: title, time: time, type: 'reminder' });
    showToast('Reminder set');
    switchStudentTab('reminders');
};

window.deleteReminder = function(id) {
    const index = reminders.findIndex(r => r.id === id);
    if (index > -1) { reminders.splice(index, 1); showToast('Reminder deleted'); switchStudentTab('reminders'); }
};

window.updateStudentProfile = function() {
    const name = document.getElementById('student-name')?.value;
    if (name) { currentUser.name = name; document.getElementById('student-info').textContent = `${name} · Grade ${currentUser.grade}`; }
    showToast('Profile updated');
};

window.changeStudentTheme = function(theme) { document.body.className = theme === 'light' ? '' : `theme-${theme}`; showToast(`Theme: ${theme}`); };

window.showStudentProfile = function() { showToast('Student profile'); };