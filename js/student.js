// ==================== STUDENT FUNCTIONS ====================

window.switchStudentTab = async function(tab) {
    const contentDiv = document.getElementById('student-content');
    contentDiv.innerHTML = '<div class="loading">Loading...</div>';

    const studentId = window.currentUser?.id;
    if (!studentId) {
        contentDiv.innerHTML = '<p>User not identified.</p>';
        return;
    }

    if (tab === 'dashboard') {
        try {
            const dashboardData = await api.getStudentDashboard();
            const data = dashboardData.data;
            const avgScore = data.averageScore || 0;
            const records = data.recentRecords || [];
            const attendance = data.recentAttendance || [];
            const present = attendance.filter(a => a.status === 'present').length;
            const totalDays = attendance.length || 1;
            const attendanceRate = Math.round((present / totalDays) * 100);
            const achievements = 0; // could be fetched from another endpoint

            contentDiv.innerHTML = `
                <div class="stats-grid">
                    <div class="stat-card"><div class="stat-icon" style="background:#10b981;"><i class="fas fa-star"></i></div><div class="stat-info"><h3>${avgScore}%</h3><p>Average</p></div></div>
                    <div class="stat-card"><div class="stat-icon" style="background:#3b82f6;"><i class="fas fa-calendar-check"></i></div><div class="stat-info"><h3>${attendanceRate}%</h3><p>Attendance</p></div></div>
                    <div class="stat-card"><div class="stat-icon" style="background:#eab308;"><i class="fas fa-trophy"></i></div><div class="stat-info"><h3>${achievements}</h3><p>Achievements</p></div></div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h3><i class="fas fa-chart-line"></i> My Performance</h3>
                        <button class="btn-small" onclick="switchStudentTab('progress')">View All</button>
                    </div>
                    <canvas id="studentChart"></canvas>
                </div>
                <div class="ai-recommendations">
                    <div class="recommendation-card" onclick="switchStudentTab('study-ai')"><i class="fas fa-robot"></i><h4>AI Study</h4><p>Start a session</p></div>
                    <div class="recommendation-card" onclick="switchStudentTab('materials')" style="background: linear-gradient(135deg, #3b82f6, #2563eb);"><i class="fas fa-book"></i><h4>Materials</h4><p>Access resources</p></div>
                </div>
            `;

            setTimeout(() => {
                destroyCharts();
                const ctx = document.getElementById('studentChart')?.getContext('2d');
                if (ctx) {
                    const subjects = records.map(r => r.subject);
                    const scores = records.map(r => r.score);
                    activeCharts.push(new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: subjects,
                            datasets: [{
                                label: 'Scores',
                                data: scores,
                                backgroundColor: '#10b981'
                            }]
                        },
                        options: { scales: { y: { beginAtZero: true, max: 100 } } }
                    }));
                }
            }, 100);
        } catch (error) {
            contentDiv.innerHTML = '<div class="error">Failed to load dashboard</div>';
        }

    } else if (tab === 'grades') {
        try {
            const gradesData = await api.getStudentGrades();
            const records = gradesData.data || [];
            let rows = records.map(r => `
                <tr>
                    <td>${r.subject}</td>
                    <td>${r.score}%</td>
                    <td><span class="status-badge ${r.score >= 80 ? 'status-excelling' : r.score >= 65 ? 'status-average' : 'status-struggling'}">${r.grade}</span></td>
                    <td>${r.assessmentType}</td>
                    <td>${r.date}</td>
                </tr>
            `).join('');
            contentDiv.innerHTML = `
                <h3>My Grades</h3>
                <div class="table-responsive">
                    <table class="data-table">
                        <tr><th>Subject</th><th>Score</th><th>Grade</th><th>Assessment</th><th>Date</th></tr>
                        ${rows || '<tr><td colspan="5">No grades found</td></tr>'}
                    </table>
                </div>
            `;
        } catch (error) {
            contentDiv.innerHTML = '<div class="error">Failed to load grades</div>';
        }

    } else if (tab === 'attendance') {
        try {
            const attendanceData = await api.getStudentAttendance();
            const records = attendanceData.data || [];
            const present = records.filter(a => a.status === 'present').length;
            const absent = records.filter(a => a.status === 'absent').length;
            const late = records.filter(a => a.status === 'late').length;

            let rows = records.map(a => `
                <tr>
                    <td>${a.date}</td>
                    <td><span class="status-badge status-${a.status}">${a.status}</span></td>
                    <td>${a.reason || '-'}</td>
                </tr>
            `).join('');

            contentDiv.innerHTML = `
                <h3>My Attendance</h3>
                <div class="stats-grid">
                    <div class="stat-card"><div class="stat-icon" style="background:#3b82f6;"><i class="fas fa-check"></i></div><div class="stat-info"><h3>${present}</h3><p>Present</p></div></div>
                    <div class="stat-card"><div class="stat-icon" style="background:#ef4444;"><i class="fas fa-times"></i></div><div class="stat-info"><h3>${absent}</h3><p>Absent</p></div></div>
                    <div class="stat-card"><div class="stat-icon" style="background:#eab308;"><i class="fas fa-clock"></i></div><div class="stat-info"><h3>${late}</h3><p>Late</p></div></div>
                </div>
                <div class="card">
                    <canvas id="attendancePie"></canvas>
                </div>
                <div class="table-responsive">
                    <table class="data-table">
                        <tr><th>Date</th><th>Status</th><th>Reason</th></tr>
                        ${rows || '<tr><td colspan="3">No attendance records</td></tr>'}
                    </table>
                </div>
            `;

            setTimeout(() => {
                destroyCharts();
                const ctx = document.getElementById('attendancePie')?.getContext('2d');
                if (ctx) {
                    activeCharts.push(new Chart(ctx, {
                        type: 'pie',
                        data: {
                            labels: ['Present', 'Absent', 'Late'],
                            datasets: [{ data: [present, absent, late], backgroundColor: ['#3b82f6', '#ef4444', '#eab308'] }]
                        }
                    }));
                }
            }, 100);
        } catch (error) {
            contentDiv.innerHTML = '<div class="error">Failed to load attendance</div>';
        }

    } else if (tab === 'materials') {
        try {
            const materialsData = await api.getLearningMaterials();
            const materials = materialsData.data || [];
            // Group by subject
            const subjects = {};
            materials.forEach(m => {
                if (!subjects[m.subject]) subjects[m.subject] = [];
                subjects[m.subject].push(m);
            });

            let subjectHtml = '';
            for (const [subject, items] of Object.entries(subjects)) {
                subjectHtml += `
                    <div class="card">
                        <h4>${subject}</h4>
                        <div class="materials-grid">
                            ${items.map(m => `
                                <div class="material-item" onclick="showToast('Opening ${m.title}')">
                                    <i class="fas ${m.type === 'video' ? 'fa-play-circle' : m.type === 'pdf' ? 'fa-file-pdf' : 'fa-book'}"></i>
                                    <div><strong>${m.title}</strong><br><small>${m.type}</small></div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
            contentDiv.innerHTML = `<h3>Learning Materials</h3>${subjectHtml || '<p>No materials available.</p>'}`;
        } catch (error) {
            contentDiv.innerHTML = '<div class="error">Failed to load materials</div>';
        }

    } else if (tab === 'study-ai') {
        contentDiv.innerHTML = `
            <h3>AI Study Sessions</h3>
            <div class="study-session-card" onclick="showToast('Starting Math session')">
                <i class="fas fa-calculator"></i>
                <h4>Mathematics Review</h4>
                <p>30 min · Algebra focus</p>
            </div>
            <div class="study-session-card" onclick="showToast('Starting Science session')" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
                <i class="fas fa-flask"></i>
                <h4>Science Practice</h4>
                <p>20 min · Biology</p>
            </div>
        `;
    } else if (tab === 'ai-chat') {
        contentDiv.innerHTML = `
            <div class="card" style="text-align:center;padding:3rem;">
                <i class="fas fa-robot" style="font-size:4rem; color:#10b981;"></i>
                <h4>AI Chat</h4>
                <p>Ask me anything!</p>
                <button class="btn-primary" onclick="toggleChat(); switchChatTab('ai')">Open Chat</button>
            </div>
        `;
    } else if (tab === 'reminders') {
        // This could be implemented with a reminders endpoint
        contentDiv.innerHTML = `
            <h3>My Reminders</h3>
            <div class="card">
                <h4>Set Reminder</h4>
                <div class="form-group"><input type="text" id="reminder-title" placeholder="e.g., Math homework"></div>
                <div class="form-group"><input type="datetime-local" id="reminder-time"></div>
                <button class="btn-primary" onclick="setStudentReminder()">Add</button>
            </div>
            <div class="timetable-grid" id="reminders-list">
                <!-- reminders will appear here -->
            </div>
        `;
        // Load reminders if you have an endpoint
    } else if (tab === 'profile') {
        contentDiv.innerHTML = `
            <h3>My Profile</h3>
            <div class="card">
                <div style="text-align:center;">
                    <img src="https://ui-avatars.com/api/?name=${window.currentUser.name.replace(' ', '+')}&size=80&background=10b981&color=fff" style="border-radius:50%;">
                    <h4>${window.currentUser.name}</h4>
                    <p>Grade ${window.currentUser.grade || ''} · ELIMUID: ${window.currentUser.elimuid || ''}</p>
                </div>
                <div class="form-group"><label>Full Name</label><input type="text" id="student-name" value="${window.currentUser.name}"></div>
                <div class="form-group"><label>Email</label><input type="email" id="student-email" value="${window.currentUser.email || ''}"></div>
                <button class="btn-primary" onclick="updateStudentProfile()">Update</button>
            </div>
        `;
    } else if (tab === 'settings') {
        contentDiv.innerHTML = `
            <h3>Customize</h3>
            <div class="card">
                <h4>Theme</h4>
                <select onchange="changeStudentTheme(this.value)">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>
            </div>
            <div class="card">
                <h4>Notifications</h4>
                <div class="toggle-switch">
                    <span>Push Notifications</span>
                    <label class="switch">
                        <input type="checkbox" checked>
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
        `;
    } else {
        contentDiv.innerHTML = `<h3>${tab.replace(/-/g, ' ')}</h3><div class="card"><p>Content for ${tab} would appear here.</p></div>`;
    }

    updateActiveMenu('student-sidebar', tab);
};

window.setStudentReminder = function() {
    const title = document.getElementById('reminder-title')?.value;
    const time = document.getElementById('reminder-time')?.value;
    if (!title || !time) { showToast('Please fill all fields', 'warning'); return; }
    // Here you would call an API to create a reminder
    showToast('Reminder set (not yet saved)');
    // For now, just display in the list
    const list = document.getElementById('reminders-list');
    if (list) {
        list.innerHTML += `<div class="reminder-item"><div><strong>${title}</strong><br><small>${new Date(time).toLocaleString()}</small></div><button class="btn-small" onclick="this.parentElement.remove()">Delete</button></div>`;
    }
};

window.updateStudentProfile = async function() {
    const name = document.getElementById('student-name')?.value;
    if (!name) return;
    // Here you would call an API to update user profile
    window.currentUser.name = name;
    showToast('Profile updated (not yet saved)');
};

window.changeStudentTheme = function(theme) {
    document.body.className = theme === 'light' ? '' : `theme-${theme}`;
    showToast(`Theme: ${theme}`);
};

window.showStudentProfile = function() { showToast('Student profile'); };
