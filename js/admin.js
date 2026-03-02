// ==================== ADMIN FUNCTIONS ====================

window.switchAdminTab = async function(tab) {
    let content = '';
    
    if (tab === 'dashboard') {
        try {
            // Show loading state
            document.getElementById('admin-content').innerHTML = '<div class="loading">Loading dashboard...</div>';
            
            // Fetch real data from API
            const dashboardData = await api.getAdminDashboard();
            const students = await api.getAllStudents();
            const teachers = await api.getAllTeachers();
            const parents = await api.getAllParents();
            
            content = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon" style="background:#ef4444;"><i class="fas fa-school"></i></div>
                        <div class="stat-info"><h3>${window.currentSchool?.name || 'School'}</h3><p>${window.currentSchool?.system || '844'} System</p></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background:#3b82f6;"><i class="fas fa-user-graduate"></i></div>
                        <div class="stat-info"><h3>${students?.length || 0}</h3><p>Students</p></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background:#eab308;"><i class="fas fa-chalkboard-teacher"></i></div>
                        <div class="stat-info"><h3>${teachers?.length || 0}</h3><p>Teachers</p></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background:#10b981;"><i class="fas fa-user-friends"></i></div>
                        <div class="stat-info"><h3>${parents?.length || 0}</h3><p>Parents</p></div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3><i class="fas fa-chart-line"></i> School Performance Overview</h3>
                    </div>
                    <canvas id="adminChart" style="height: 300px;"></canvas>
                </div>

                <div class="card">
                    <h4><i class="fas fa-bell"></i> Recent Alerts</h4>
                    ${dashboardData?.recentAlerts ? dashboardData.recentAlerts.map(a => `
                        <div class="alert-item">
                            <i class="fas fa-exclamation-triangle alert-icon"></i>
                            <div><strong>${a.title}</strong><br><small>${a.message}</small></div>
                        </div>
                    `).join('') : '<p>No recent alerts</p>'}
                </div>

                <div class="card">
                    <h4><i class="fas fa-calendar"></i> Quick Actions</h4>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <button class="btn-primary" onclick="switchAdminTab('students')">View Students</button>
                        <button class="btn-primary" onclick="switchAdminTab('teachers')">Manage Teachers</button>
                        <button class="btn-primary" onclick="switchAdminTab('settings')">School Settings</button>
                    </div>
                </div>
            `;
            
            document.getElementById('admin-content').innerHTML = content;
            
            // Initialize chart
            setTimeout(() => {
                window.destroyCharts();
                const ctx = document.getElementById('adminChart')?.getContext('2d');
                if (ctx) {
                    window.activeCharts.push(new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                            datasets: [{
                                label: 'Average Performance',
                                data: dashboardData?.performanceData || [72, 75, 78, 74],
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
            console.error('Error loading admin dashboard:', error);
            content = `<div class="alert alert-danger">Failed to load dashboard data: ${error.message}</div>`;
            document.getElementById('admin-content').innerHTML = content;
        }
        
    } else if (tab === 'students') {
        try {
            document.getElementById('admin-content').innerHTML = '<div class="loading">Loading students...</div>';
            const students = await api.getAllStudents();
            
            content = `
                <h3>Student Management</h3>
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>ELIMUID</th>
                                <th>Grade</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${students?.map(s => `
                                <tr>
                                    <td>${s.user?.name || s.name}</td>
                                    <td>${s.elimuid}</td>
                                    <td>${s.grade}</td>
                                    <td><span class="status-badge status-${s.status || 'active'}">${s.status || 'active'}</span></td>
                                    <td>
                                        <button class="btn-small" onclick="showToast('Viewing student')">View</button>
                                        <button class="btn-small" onclick="showToast('Editing student')">Edit</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        } catch (error) {
            content = `<div class="alert alert-danger">Failed to load students: ${error.message}</div>`;
        }
        document.getElementById('admin-content').innerHTML = content;
        
    } else if (tab === 'teachers') {
        try {
            document.getElementById('admin-content').innerHTML = '<div class="loading">Loading teachers...</div>';
            const teachers = await api.getAllTeachers();
            const pendingApprovals = await api.getPendingApprovals();
            
            content = `
                <h3>Teacher Management</h3>
                
                ${pendingApprovals?.teachers?.length > 0 ? `
                <div class="card">
                    <h4>Pending Approvals (${pendingApprovals.teachers.length})</h4>
                    <div class="table-responsive">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Subjects</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${pendingApprovals.teachers.map(t => `
                                    <tr>
                                        <td>${t.name}</td>
                                        <td>${t.email}</td>
                                        <td>${t.subjects?.join(', ')}</td>
                                        <td>
                                            <button class="btn-small btn-success" onclick="approveTeacher('${t.id}', 'approve')">Approve</button>
                                            <button class="btn-small btn-danger" onclick="approveTeacher('${t.id}', 'reject')">Reject</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                ` : ''}
                
                <div class="card">
                    <h4>All Teachers</h4>
                    <div class="table-responsive">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Subjects</th>
                                    <th>Class</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${teachers?.map(t => `
                                    <tr>
                                        <td>${t.user?.name || t.name}</td>
                                        <td>${t.user?.email || t.email}</td>
                                        <td>${t.subjects?.join(', ')}</td>
                                        <td>${t.classTeacher || '-'}</td>
                                        <td><span class="status-badge status-${t.approvalStatus}">${t.approvalStatus}</span></td>
                                        <td>
                                            <button class="btn-small" onclick="showToast('Viewing teacher')">View</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        } catch (error) {
            content = `<div class="alert alert-danger">Failed to load teachers: ${error.message}</div>`;
        }
        document.getElementById('admin-content').innerHTML = content;
        
    } else if (tab === 'settings') {
        try {
            document.getElementById('admin-content').innerHTML = '<div class="loading">Loading settings...</div>';
            const response = await api.getSchoolSettings();
            const settings = response.data || response;
            
            content = `
                <h3>School Settings</h3>
                <div class="card">
                    <h4>School Information</h4>
                    <div class="form-group">
                        <label>School Name</label>
                        <input type="text" id="school-name-input" value="${settings?.name || window.currentSchool?.name || ''}" onchange="updateSchoolName(this.value)">
                    </div>
                    <div class="form-group">
                        <label>Curriculum System</label>
                        <select id="curriculum-select" onchange="updateCurriculum(this.value)">
                            <option value="844" ${(settings?.system || window.currentSchool?.system) === '844' ? 'selected' : ''}>8-4-4</option>
                            <option value="cbc" ${(settings?.system || window.currentSchool?.system) === 'cbc' ? 'selected' : ''}>CBC</option>
                            <option value="british" ${(settings?.system || window.currentSchool?.system) === 'british' ? 'selected' : ''}>British</option>
                            <option value="american" ${(settings?.system || window.currentSchool?.system) === 'american' ? 'selected' : ''}>American</option>
                        </select>
                    </div>
                    <button class="btn-primary" onclick="saveSchoolSettings()">Save Changes</button>
                </div>
                
                <div class="card">
                    <h4>Duty Management Settings</h4>
                    <div class="form-group">
                        <label>Max Teachers Per Day</label>
                        <input type="number" id="duty-max-teachers" value="${settings?.settings?.dutyManagement?.maxTeachersPerDay || 3}">
                    </div>
                    <div class="form-group">
                        <label>Reminder Hours</label>
                        <input type="number" id="duty-reminder-hours" value="${settings?.settings?.dutyManagement?.reminderHours || 24}">
                    </div>
                    <button class="btn-primary" onclick="saveDutySettings()">Save Duty Settings</button>
                </div>
            `;
        } catch (error) {
            content = `<div class="card"><p>Using local settings. Error: ${error.message}</p></div>`;
        }
        document.getElementById('admin-content').innerHTML = content;
        
    } else {
        content = `<h3>${tab.replace(/-/g, ' ')}</h3><div class="card"><p>Loading...</p></div>`;
        document.getElementById('admin-content').innerHTML = content;
    }
    
    window.updateActiveMenu('admin-sidebar', tab);
};

// Teacher approval function
window.approveTeacher = async function(teacherId, action) {
    try {
        let rejectionReason = '';
        if (action === 'reject') {
            rejectionReason = prompt('Please enter reason for rejection:');
            if (!rejectionReason) return;
        }
        
        await api.approveTeacher(teacherId, action, rejectionReason);
        window.showToast(`Teacher ${action}d successfully`, 'success');
        switchAdminTab('teachers'); // Refresh the page
    } catch (error) {
        window.showToast(`Failed to ${action} teacher: ${error.message}`, 'error');
    }
};

// Update school name
window.updateSchoolName = async function(name) {
    try {
        await api.updateSchoolSettings({ name });
        window.showToast('School name updated', 'success');
    } catch (error) {
        window.showToast('Failed to update school name', 'error');
    }
};

// Update curriculum
window.updateCurriculum = async function(val) {
    try {
        await api.updateSchoolSettings({ system: val });
        window.showToast(`Curriculum updated to ${val === '844' ? '8-4-4' : val === 'cbc' ? 'CBC' : val}`, 'success');
    } catch (error) {
        window.showToast('Failed to update curriculum', 'error');
    }
};

// Save settings
window.saveSchoolSettings = async function() {
    try {
        const name = document.getElementById('school-name-input')?.value;
        const system = document.getElementById('curriculum-select')?.value;
        await api.updateSchoolSettings({ name, system });
        window.showToast('Settings saved', 'success');
    } catch (error) {
        window.showToast('Failed to save settings', 'error');
    }
};

// Save duty settings
window.saveDutySettings = async function() {
    try {
        const maxTeachersPerDay = parseInt(document.getElementById('duty-max-teachers')?.value) || 3;
        const reminderHours = parseInt(document.getElementById('duty-reminder-hours')?.value) || 24;
        
        await api.updateSchoolSettings({
            settings: {
                dutyManagement: {
                    maxTeachersPerDay,
                    reminderHours,
                    enabled: true,
                    checkInWindow: 15
                }
            }
        });
        window.showToast('Duty settings saved', 'success');
    } catch (error) {
        window.showToast('Failed to save duty settings', 'error');
    }
};

// Profile functions
window.showAdminProfile = function() { 
    window.openModal('admin-profile-modal'); 
};

window.updateAdminProfile = function() { 
    window.showToast('Profile updated', 'success'); 
    window.closeModal('admin-profile-modal'); 
};
