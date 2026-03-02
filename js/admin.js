// ==================== ADMIN FUNCTIONS ====================

window.switchAdminTab = async function(tab) {
    const contentDiv = document.getElementById('admin-content');
    contentDiv.innerHTML = '<div class="loading">Loading...</div>';
    
    if (tab === 'dashboard') {
        try {
            const dashboardData = await api.getAdminDashboard();
            const students = await api.getAllStudents();
            const teachers = await api.getAllTeachers();
            const parents = await api.getAllParents();
            
            const totalStudents = students.data.length;
            const totalTeachers = teachers.data.length;
            const totalParents = parents.data.length;
            
            // For demo, we need some stats from dashboardData
            const stats = dashboardData.data || {};
            
            let content = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon" style="background:#ef4444;"><i class="fas fa-school"></i></div>
                        <div class="stat-info"><h3>${window.currentSchool.name}</h3><p>${window.currentSchool.system} System</p></div>
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
                        <div class="stat-info"><h3>${stats.criticalAlerts || 0}</h3><p>Critical Alerts</p></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background:#10b981;"><i class="fas fa-star"></i></div>
                        <div class="stat-info"><h3>${stats.excellingStudents || 0}</h3><p>Excelling</p></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background:#eab308;"><i class="fas fa-money-bill"></i></div>
                        <div class="stat-info"><h3>${stats.feeCollectionRate || 0}%</h3><p>Fee Collection</p></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background:#3b82f6;"><i class="fas fa-calendar-check"></i></div>
                        <div class="stat-info"><h3>${stats.todayAttendance || 0}%</h3><p>Today's Attendance</p></div>
                    </div>
                </div>

                <div class="card">
                    <h4><i class="fas fa-bell"></i> Recent Alerts</h4>
                    ${stats.recentAlerts ? stats.recentAlerts.map(a => `
                        <div class="alert-item">
                            <i class="fas fa-exclamation-triangle alert-icon"></i>
                            <div><strong>${a.message}</strong><br><small>${a.date} · ${a.severity}</small></div>
                        </div>
                    `).join('') : '<p>No recent alerts</p>'}
                </div>

                <div class="card">
                    <h4><i class="fas fa-calendar"></i> Upcoming Events</h4>
                    <p><strong>End Term Exams:</strong> April 10-20, 2024</p>
                    <p><strong>Parents Meeting:</strong> April 25, 2024</p>
                    <p><strong>Sports Day:</strong> May 5, 2024</p>
                    <button class="btn-small" onclick="showToast('Add event')">+ Add Event</button>
                </div>
            `;
            contentDiv.innerHTML = content;
            
            // Render chart (placeholder - you can use analytics endpoint)
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
            
        } catch (error) {
            contentDiv.innerHTML = '<div class="error">Failed to load dashboard</div>';
            console.error(error);
        }
        
    } else if (tab === 'students') {
        try {
            const studentsData = await api.getAllStudents();
            const students = studentsData.data || [];
            
            let tableRows = students.map(s => {
                // We don't have average here, could fetch analytics per student
                return `<tr>
                    <td>${s.name}</td>
                    <td>${s.elimuid}</td>
                    <td>${s.grade}</td>
                    <td><span class="status-badge status-average">-</span></td>
                    <td>-</td>
                    <td><button class="btn-small" onclick="showToast('Viewing ${s.name}')">View</button> <button class="btn-small" onclick="showToast('Messaging ${s.name}')">Message</button></td>
                </tr>`;
            }).join('');
            
            contentDiv.innerHTML = `
                <h3>Student Monitoring</h3>
                <div class="table-responsive">
                    <table class="data-table">
                        <tr><th>Name</th><th>ELIMUID</th><th>Grade</th><th>Average</th><th>Status</th><th>Actions</th></tr>
                        ${tableRows || '<tr><td colspan="6">No students found</td></tr>'}
                    </table>
                </div>
            `;
        } catch (error) {
            contentDiv.innerHTML = '<div class="error">Failed to load students</div>';
        }
        
    } else if (tab === 'teachers') {
        try {
            const teachersData = await api.getAllTeachers();
            const teachers = teachersData.data || [];
            
            let tableRows = teachers.map(t => `
                <tr>
                    <td>${t.name}</td>
                    <td>${t.subjects?.join(', ') || ''}</td>
                    <td>${t.classTeacher || ''}</td>
                    <td>${t.approvalStatus}</td>
                    <td><button class="btn-small" onclick="showToast('Viewing ${t.name}')">Report</button></td>
                </tr>
            `).join('');
            
            contentDiv.innerHTML = `
                <h3>Teacher Activity</h3>
                <div class="table-responsive">
                    <table class="data-table">
                        <tr><th>Name</th><th>Subject</th><th>Class</th><th>Status</th><th>Actions</th></tr>
                        ${tableRows || '<tr><td colspan="5">No teachers found</td></tr>'}
                    </table>
                </div>
            `;
        } catch (error) {
            contentDiv.innerHTML = '<div class="error">Failed to load teachers</div>';
        }
        
    } else if (tab === 'analytics') {
        try {
            const analytics = await api.getSchoolAnalytics();
            const data = analytics.data;
            // Build charts using data...
            contentDiv.innerHTML = `
                <h3>School Analytics</h3>
                <div class="card"><h4>Performance Distribution</h4><canvas id="analyticsChart"></canvas></div>
                <div class="card"><h4>Subject Performance</h4><canvas id="subjectChart"></canvas></div>
                <div class="card"><h4>Teacher Progress Report</h4><ul>${data.teacherPerformance?.map(t => `<li>${t.teacherName}: ${t.completionRate}% completion</li>`).join('') || '<li>No data</li>'}</ul></div>
            `;
            setTimeout(() => {
                destroyCharts();
                // Use data to create charts...
                const ctx1 = document.getElementById('analyticsChart')?.getContext('2d');
                if (ctx1) activeCharts.push(new Chart(ctx1, { type: 'pie', data: { labels: ['Excelling', 'Average', 'Struggling'], datasets: [{ data: [25, 55, 20], backgroundColor: ['#10b981','#eab308','#ef4444'] }] } }));
                const ctx2 = document.getElementById('subjectChart')?.getContext('2d');
                if (ctx2) activeCharts.push(new Chart(ctx2, { type: 'bar', data: { labels: ['Math', 'English', 'Science', 'History'], datasets: [{ label: 'Average Score', data: [78, 82, 75, 71], backgroundColor: '#3b82f6' }] } }));
            }, 100);
        } catch (error) {
            contentDiv.innerHTML = '<div class="error">Failed to load analytics</div>';
        }
        
    } else if (tab === 'fees') {
        // Similar integration...
        contentDiv.innerHTML = `<h3>Fee Collection</h3><p>Coming soon...</p>`;
        
    } else if (tab === 'messages') {
        contentDiv.innerHTML = `
            <h3>Send Messages</h3>
            <div class="card">
                <div class="form-group"><label>Send to:</label><select><option>All Teachers</option><option>All Parents</option><option>Specific Class</option></select></div>
                <div class="form-group"><label>Subject</label><input type="text" id="message-subject"></div>
                <div class="form-group"><label>Message</label><textarea id="message-content" rows="5"></textarea></div>
                <button class="btn-primary" onclick="sendAdminMessage()">Send Message</button>
            </div>
        `;
    } else if (tab === 'settings') {
        try {
            const settingsData = await api.getSchoolSettings();
            const school = settingsData.data;
            contentDiv.innerHTML = `
                <h3>School Settings</h3>
                <div class="card">
                    <h4>School Information</h4>
                    <div class="form-group"><label>School Name</label><input type="text" id="school-name-input" value="${school.name}" onchange="updateSchoolName(this.value)"></div>
                    <div class="form-group"><label>Curriculum System</label><select id="curriculum-select" onchange="updateCurriculum(this.value)">
                        <option value="844" ${school.system === '844' ? 'selected' : ''}>8-4-4</option>
                        <option value="cbc" ${school.system === 'cbc' ? 'selected' : ''}>CBC</option>
                        <option value="british" ${school.system === 'british' ? 'selected' : ''}>British</option>
                        <option value="american" ${school.system === 'american' ? 'selected' : ''}>American</option>
                    </select></div>
                    <button class="btn-primary" onclick="saveSchoolSettings()">Save Changes</button>
                </div>
            `;
        } catch (error) {
            contentDiv.innerHTML = '<div class="error">Failed to load settings</div>';
        }
    } else {
        contentDiv.innerHTML = `<h3>${tab.replace(/-/g, ' ')}</h3><div class="card"><p>Content for ${tab} would appear here.</p></div>`;
    }
    
    updateActiveMenu('admin-sidebar', tab);
};

window.sendAdminMessage = function() {
    const subject = document.getElementById('message-subject')?.value;
    const content = document.getElementById('message-content')?.value;
    if (!subject || !content) { showToast('Fill all fields', 'warning'); return; }
    // Implement API call to send message
    showToast('Message sent (not yet implemented)');
};

window.updateSchoolName = async function(name) {
    try {
        await api.updateSchoolSettings({ name });
        showToast('School name updated');
    } catch (error) {
        showToast('Update failed', 'error');
    }
};

window.updateCurriculum = async function(val) {
    try {
        await api.updateSchoolSettings({ system: val });
        showToast(`Curriculum updated to ${val}`);
    } catch (error) {
        showToast('Update failed', 'error');
    }
};

window.saveSchoolSettings = function() { showToast('Settings saved (not yet implemented)'); };

window.showAdminProfile = function() { openModal('admin-profile-modal'); };
window.updateAdminProfile = async function() {
    // Implement profile update
    showToast('Profile updated (not yet implemented)');
    closeModal('admin-profile-modal');
};
