// ==================== ADMIN FUNCTIONS ====================

window.switchAdminTab = function(tab) {
    let content = '';
    
    if (tab === 'dashboard') {
        const totalStudents = users.students.filter(s => s.schoolCode === currentSchool.code).length;
        const totalTeachers = users.teachers.filter(t => t.schoolCode === currentSchool.code).length;
        const totalParents = users.parents.length;
        const todayAttendance = attendanceRecords.filter(r => r.date === '2024-03-18' && r.status === 'present').length;
        const totalFees = feeRecords.reduce((sum, f) => sum + f.amount, 0);
        const totalPaid = feeRecords.reduce((sum, f) => sum + f.paid, 0);
        
        content = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon" style="background:#ef4444;"><i class="fas fa-school"></i></div>
                    <div class="stat-info"><h3>${currentSchool.name}</h3><p>${currentSchool.system} System</p></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background:#3b82f6;"><i class="fas fa-user-graduate"></i></div>
                    <div class="stat-info"><h3>${totalStudents}</h3><p>Students</p></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background:#eab308;"><i class="fas fa-chalkboard-teacher"></i></div>
                    <div class="stat-info"><h3>${totalTeachers}</h3><p>Teachers</p></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background:#10b981;"><i class="fas fa-user-friends"></i></div>
                    <div class="stat-info"><h3>${totalParents}</h3><p>Parents</p></div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-chart-line"></i> School Performance Overview</h3>
                </div>
                <canvas id="adminChart" style="height: 300px;"></canvas>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon" style="background:#ef4444;"><i class="fas fa-exclamation-triangle"></i></div>
                    <div class="stat-info"><h3>${alerts.filter(a => a.severity === 'critical').length}</h3><p>Critical Alerts</p></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background:#10b981;"><i class="fas fa-star"></i></div>
                    <div class="stat-info"><h3>${academicRecords.filter(r => r.score >= 80).length}</h3><p>Excelling</p></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background:#eab308;"><i class="fas fa-money-bill"></i></div>
                    <div class="stat-info"><h3>${Math.round((totalPaid/totalFees)*100)}%</h3><p>Fee Collection</p></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background:#3b82f6;"><i class="fas fa-calendar-check"></i></div>
                    <div class="stat-info"><h3>${Math.round((todayAttendance/totalStudents)*100)}%</h3><p>Today's Attendance</p></div>
                </div>
            </div>

            <div class="card">
                <h4><i class="fas fa-bell"></i> Recent Alerts</h4>
                ${alerts.slice(0, 3).map(a => `
                    <div class="alert-item">
                        <i class="fas fa-exclamation-triangle alert-icon"></i>
                        <div><strong>${a.message}</strong><br><small>${a.date} · ${a.severity}</small></div>
                    </div>
                `).join('')}
            </div>

            <div class="card">
                <h4><i class="fas fa-calendar"></i> Upcoming Events</h4>
                <p><strong>End Term Exams:</strong> April 10-20, 2024</p>
                <p><strong>Parents Meeting:</strong> April 25, 2024</p>
                <p><strong>Sports Day:</strong> May 5, 2024</p>
                <button class="btn-small" onclick="showToast('Add event')">+ Add Event</button>
            </div>
        `;
        
        document.getElementById('admin-content').innerHTML = content;
        
        setTimeout(() => {
            destroyCharts();
            const ctx = document.getElementById('adminChart')?.getContext('2d');
            if (ctx) {
                activeCharts.push(new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                        datasets: [{
                            label: 'Average Performance',
                            data: [72, 75, 78, 74],
                            borderColor: '#ef4444',
                            tension: 0.4,
                            fill: false
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false }
                }));
            }
        }, 100);
        
    } else if (tab === 'students') {
        const schoolStudents = users.students.filter(s => s.schoolCode === currentSchool.code);
        content = `
            <h3>Student Monitoring</h3>
            <div class="table-responsive">
                <table class="data-table">
                    <tr><th>Name</th><th>ELIMUID</th><th>Grade</th><th>Average</th><th>Status</th><th>Attendance</th><th>Actions</th></tr>
                    ${schoolStudents.map(s => {
                        const records = academicRecords.filter(r => r.studentId === s.id);
                        const avg = records.length ? Math.round(records.reduce((sum, r) => sum + r.score, 0) / records.length) : 0;
                        const attendance = attendanceRecords.filter(r => r.studentId === s.id && r.status === 'present').length;
                        const totalDays = attendanceRecords.filter(r => r.studentId === s.id).length;
                        const attendanceRate = totalDays ? Math.round((attendance / totalDays) * 100) : 100;
                        let statusClass = 'status-average', statusText = 'Average';
                        if (avg >= 80) { statusClass = 'status-excelling'; statusText = 'Excelling'; }
                        else if (avg < 65) { statusClass = 'status-struggling'; statusText = 'Struggling'; }
                        return `<tr><td>${s.name}</td><td>${s.elimuid}</td><td>${s.grade}</td><td><strong>${avg}%</strong></td><td><span class="status-badge ${statusClass}">${statusText}</span></td><td>${attendanceRate}%</td><td><button class="btn-small" onclick="showToast('Viewing ${s.name}')">View</button> <button class="btn-small" onclick="showToast('Messaging ${s.name}')">Message</button></td></tr>`;
                    }).join('')}
                </table>
            </div>
        `;
    } else if (tab === 'teachers') {
        const schoolTeachers = users.teachers.filter(t => t.schoolCode === currentSchool.code);
        content = `
            <h3>Teacher Activity</h3>
            <div class="table-responsive">
                <table class="data-table">
                    <tr><th>Name</th><th>Subject</th><th>Class</th><th>Last Active</th><th>Marks Entered</th><th>Actions</th></tr>
                    ${schoolTeachers.map(t => `<tr><td>${t.name}</td><td>${t.subject}</td><td>${t.class}</td><td>${auditLogs.find(l => l.user === t.id)?.timestamp || 'N/A'}</td><td>${academicRecords.filter(r => r.teacher === t.name).length}</td><td><button class="btn-small" onclick="showToast('Viewing ${t.name}')">Report</button> <button class="btn-small" onclick="showToast('Messaging ${t.name}')">Message</button></td></tr>`).join('')}
                </table>
            </div>
        `;
    } else if (tab === 'analytics') {
        content = `
            <h3>School Analytics</h3>
            <div class="card"><h4>Performance Distribution</h4><canvas id="analyticsChart"></canvas></div>
            <div class="card"><h4>Subject Performance</h4><canvas id="subjectChart"></canvas></div>
            <div class="card"><h4>Teacher Progress Report</h4><ul><li>Mr. Doe: 85% average - Above target</li><li>Ms. Smith: 78% average - Meeting target</li><li>Mr. Johnson: 82% average - Exceeding target</li></ul></div>
        `;
        document.getElementById('admin-content').innerHTML = content;
        setTimeout(() => {
            destroyCharts();
            const ctx1 = document.getElementById('analyticsChart')?.getContext('2d');
            if (ctx1) activeCharts.push(new Chart(ctx1, { type: 'pie', data: { labels: ['Excelling (80-100)', 'Average (65-79)', 'Struggling (<65)'], datasets: [{ data: [25, 55, 20], backgroundColor: ['#10b981', '#eab308', '#ef4444'] }] } }));
            const ctx2 = document.getElementById('subjectChart')?.getContext('2d');
            if (ctx2) activeCharts.push(new Chart(ctx2, { type: 'bar', data: { labels: ['Math', 'English', 'Science', 'History'], datasets: [{ label: 'Average Score', data: [78, 82, 75, 71], backgroundColor: '#3b82f6' }] } }));
        }, 100);
    } else if (tab === 'fees') {
        const totalFees = feeRecords.reduce((sum, f) => sum + f.amount, 0);
        const totalPaid = feeRecords.reduce((sum, f) => sum + f.paid, 0);
        content = `
            <div class="stats-grid">
                <div class="stat-card"><div class="stat-icon" style="background:#10b981;"><i class="fas fa-money-bill"></i></div><div class="stat-info"><h3>KSh ${totalFees.toLocaleString()}</h3><p>Total Fees</p></div></div>
                <div class="stat-card"><div class="stat-icon" style="background:#3b82f6;"><i class="fas fa-check-circle"></i></div><div class="stat-info"><h3>KSh ${totalPaid.toLocaleString()}</h3><p>Collected</p></div></div>
                <div class="stat-card"><div class="stat-icon" style="background:#ef4444;"><i class="fas fa-exclamation-triangle"></i></div><div class="stat-info"><h3>KSh ${(totalFees - totalPaid).toLocaleString()}</h3><p>Outstanding</p></div></div>
            </div>
            <div class="table-responsive"><table class="data-table"><tr><th>Student</th><th>Term</th><th>Amount</th><th>Paid</th><th>Balance</th><th>Status</th></tr>${feeRecords.map(f => { const s = users.students.find(s => s.id === f.studentId); return `<tr><td>${s ? s.name : ''}</td><td>${f.term}</td><td>KSh ${f.amount}</td><td>KSh ${f.paid}</td><td>KSh ${f.amount - f.paid}</td><td><span class="status-badge status-${f.status}">${f.status}</span></td></tr>`; }).join('')}</table></div>
        `;
    } else if (tab === 'messages') {
        content = `
            <h3>Send Messages</h3>
            <div class="card">
                <div class="form-group"><label>Send to:</label><select><option>All Teachers</option><option>All Parents</option><option>Specific Class</option></select></div>
                <div class="form-group"><label>Subject</label><input type="text" id="message-subject"></div>
                <div class="form-group"><label>Message</label><textarea id="message-content" rows="5"></textarea></div>
                <button class="btn-primary" onclick="sendAdminMessage()">Send Message</button>
            </div>
        `;
    } else if (tab === 'settings') {
        content = `
            <h3>School Settings</h3>
            <div class="card">
                <h4>School Information</h4>
                <div class="form-group"><label>School Name</label><input type="text" id="school-name-input" value="${currentSchool.name}" onchange="updateSchoolName(this.value)"></div>
                <div class="form-group"><label>Curriculum System</label><select id="curriculum-select" onchange="updateCurriculum(this.value)"><option value="844" ${currentSchool.system === '844' ? 'selected' : ''}>8-4-4</option><option value="cbc" ${currentSchool.system === 'cbc' ? 'selected' : ''}>CBC</option><option value="british" ${currentSchool.system === 'british' ? 'selected' : ''}>British</option><option value="american" ${currentSchool.system === 'american' ? 'selected' : ''}>American</option></select></div>
                <button class="btn-primary" onclick="saveSchoolSettings()">Save Changes</button>
            </div>
        `;
    } else {
        content = `<h3>${tab.replace(/-/g, ' ')}</h3><div class="card"><p>Content for ${tab} would appear here.</p></div>`;
    }
    
    document.getElementById('admin-content').innerHTML = content;
    updateActiveMenu('admin-sidebar', tab);
};

window.sendAdminMessage = function() {
    const subject = document.getElementById('message-subject')?.value;
    const content = document.getElementById('message-content')?.value;
    if (!subject || !content) { showToast('Fill all fields', 'warning'); return; }
    messages.push({ id: messages.length + 1, from: 'admin', to: 'selected', subject: subject, content: content, sent: new Date().toISOString().split('T')[0], status: 'sent' });
    showToast('Message sent');
    document.getElementById('message-subject').value = '';
    document.getElementById('message-content').value = '';
};

window.updateSchoolName = function(name) {
    currentSchool.name = name;
    ['admin-school-name','teacher-school-name','parent-school-name','student-school-name'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = name;
    });
    showToast('School name updated for all users');
};

window.updateCurriculum = function(val) {
    currentSchool.system = val;
    let systemName = { '844':'8-4-4', 'cbc':'CBC', 'british':'British', 'american':'American' }[val] + ' System';
    document.getElementById('admin-system-info').textContent = systemName;
    academicRecords.forEach(r => { const gradeInfo = calculateGrade(r.score, val); r.grade = gradeInfo.grade; });
    showToast(`Curriculum updated to ${systemName}`);
};

window.saveSchoolSettings = function() { showToast('Settings saved'); };

window.showAdminProfile = function() { openModal('admin-profile-modal'); };
window.updateAdminProfile = function() { showToast('Profile updated'); closeModal('admin-profile-modal'); };