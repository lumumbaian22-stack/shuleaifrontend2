// ==================== PARENT FUNCTIONS ====================

window.parentPopupEnabled = true;
window.currentTipIndex = 0;

window.loadParentChildren = function() {
    const container = document.getElementById('children-list');
    if (!container) return;
    
    container.innerHTML = currentChildren.map(child => `
        <div class="child-card ${child.id === activeChildId ? 'active' : ''}" onclick="switchChild('${child.id}')">
            <strong>${child.name}</strong>
            <br><small>Grade ${child.grade}</small>
            <br><small>ELIMU: ${child.elimuid}</small>
        </div>
    `).join('');
};

window.switchChild = function(childId) {
    activeChildId = childId;
    const child = users.students.find(s => s.id === childId);
    if (child) {
        currentSchool = schools.find(s => s.code === child.schoolCode);
        document.getElementById('parent-school-name').textContent = currentSchool.name;
    }
    renderMenu('parent');
    switchParentTab('dashboard');
    showToast(`Now viewing: ${child.name}`);
};

window.switchParentTab = function(tab) {
    const child = users.students.find(s => s.id === activeChildId);
    if (!child) return;
    
    document.getElementById('active-child-name').textContent = child.name;
    
    if (tab === 'dashboard') {
        const records = academicRecords.filter(r => r.studentId === child.id);
        const avgScore = records.length ? Math.round(records.reduce((sum, a) => sum + a.score, 0) / records.length) : 0;
        const attendance = attendanceRecords.filter(r => r.studentId === child.id && r.status === 'present').length;
        const totalDays = attendanceRecords.filter(r => r.studentId === child.id).length;
        const attendanceRate = totalDays ? Math.round((attendance / totalDays) * 100) : 100;
        const fee = feeRecords.find(f => f.studentId === child.id);
        
        let content = `
            <div class="stats-grid">
                <div class="stat-card"><div class="stat-icon" style="background:#eab308;"><i class="fas fa-star"></i></div><div class="stat-info"><h3>${avgScore}%</h3><p>Average</p></div></div>
                <div class="stat-card"><div class="stat-icon" style="background:#3b82f6;"><i class="fas fa-calendar-check"></i></div><div class="stat-info"><h3>${attendanceRate}%</h3><p>Attendance</p></div></div>
            </div>
            <div class="card"><div class="card-header"><h3><i class="fas fa-chart-line"></i> ${child.name}'s Performance</h3><button class="btn-primary" onclick="printReport('${child.id}')" style="width:auto; padding:0.5rem 1rem;"><i class="fas fa-print"></i> Print</button></div><canvas id="parentChart"></canvas></div>
        `;
        
        if (fee) content += `<div class="card"><h4>Fee Status</h4><div class="flex-between"><span>Term 1: KSh ${fee.amount.toLocaleString()}</span><span class="status-badge status-${fee.status}">${fee.status}</span></div><div class="fee-progress"><div class="fee-progress-bar" style="width:${(fee.paid/fee.amount)*100}%;"></div></div><p>Paid: KSh ${fee.paid.toLocaleString()} | Balance: KSh ${(fee.amount-fee.paid).toLocaleString()}</p><p><small>Due: ${fee.dueDate}</small></p></div>`;
        
        document.getElementById('parent-content').innerHTML = content;
        
        setTimeout(() => {
            destroyCharts();
            const ctx = document.getElementById('parentChart')?.getContext('2d');
            if (ctx) activeCharts.push(new Chart(ctx, { type: 'line', data: { labels: records.map(r => r.subject), datasets: [{ label: 'Scores', data: records.map(r => r.score), borderColor: '#eab308', tension: 0.4 }] } }));
        }, 100);
    } else if (tab === 'grades') {
        const records = academicRecords.filter(r => r.studentId === child.id);
        document.getElementById('parent-content').innerHTML = `<h3>Grades</h3><div class="table-responsive"><table class="data-table"><tr><th>Subject</th><th>Score</th><th>Grade</th><th>Teacher</th><th>Comment</th></tr>${records.map(r => `<tr><td>${r.subject}</td><td>${r.score}%</td><td><span class="status-badge ${r.score >= 80 ? 'status-excelling' : r.score >= 65 ? 'status-average' : 'status-struggling'}">${r.grade}</span></td><td>${r.teacher}</td><td>${r.comment || '-'}</td></tr>`).join('')}</table></div>`;
    } else if (tab === 'attendance') {
        const records = attendanceRecords.filter(r => r.studentId === child.id);
        const present = records.filter(r => r.status === 'present').length;
        const absent = records.filter(r => r.status === 'absent').length;
        const late = records.filter(r => r.status === 'late').length;
        document.getElementById('parent-content').innerHTML = `
            <h3>Attendance</h3>
            <div class="stats-grid"><div class="stat-card"><div class="stat-icon" style="background:#3b82f6;"><i class="fas fa-check"></i></div><div class="stat-info"><h3>${present}</h3><p>Present</p></div></div><div class="stat-card"><div class="stat-icon" style="background:#ef4444;"><i class="fas fa-times"></i></div><div class="stat-info"><h3>${absent}</h3><p>Absent</p></div></div><div class="stat-card"><div class="stat-icon" style="background:#eab308;"><i class="fas fa-clock"></i></div><div class="stat-info"><h3>${late}</h3><p>Late</p></div></div></div>
            <div class="card"><canvas id="attendancePie"></canvas></div>
            <div class="table-responsive"><table class="data-table"><tr><th>Date</th><th>Status</th><th>Reason</th></tr>${records.map(r => `<tr><td>${r.date}</td><td><span class="status-badge status-${r.status}">${r.status}</span></td><td>${r.reason || '-'}</td></tr>`).join('')}</table></div>
        `;
        setTimeout(() => {
            destroyCharts();
            const ctx = document.getElementById('attendancePie')?.getContext('2d');
            if (ctx) activeCharts.push(new Chart(ctx, { type: 'pie', data: { labels: ['Present','Absent','Late'], datasets: [{ data: [present, absent, late], backgroundColor: ['#3b82f6','#ef4444','#eab308'] }] } }));
        }, 100);
    } else if (tab === 'fee-statement') {
        const fee = feeRecords.find(f => f.studentId === child.id);
        document.getElementById('parent-content').innerHTML = `
            <h3>Fee Statement</h3>
            <div class="card"><h4>${child.name} - ${fee.term}</h4><table class="data-table"><tr><td>Total Fees:</td><td><strong>KSh ${fee.amount.toLocaleString()}</strong></td></tr><tr><td>Paid:</td><td>KSh ${fee.paid.toLocaleString()}</td></tr><tr><td>Balance:</td><td class="status-struggling">KSh ${(fee.amount - fee.paid).toLocaleString()}</td></tr><tr><td>Due Date:</td><td>${fee.dueDate}</td></tr><tr><td>Status:</td><td><span class="status-badge status-${fee.status}">${fee.status}</span></td></tr></table></div>
        `;
    } else if (tab === 'tips') {
        document.getElementById('parent-content').innerHTML = `
            <h3>Did You Know?</h3>
            <div class="card"><p id="current-tip">${educationTips[currentTipIndex]}</p><button class="btn-primary" onclick="nextTip()">Next Tip</button></div>
        `;
    } else {
        document.getElementById('parent-content').innerHTML = `<h3>${tab.replace(/-/g, ' ')}</h3><div class="card"><p>Content for ${tab} would appear here.</p></div>`;
    }
    
    updateActiveMenu('parent-sidebar', tab);
};

window.printReport = function(childId) {
    const child = users.students.find(s => s.id === childId);
    const records = academicRecords.filter(r => r.studentId === childId);
    const attendance = attendanceRecords.filter(r => r.studentId === childId);
    const fee = feeRecords.find(f => f.studentId === childId);
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html><head><title>${child.name} - Report</title><style>body{font-family:Arial;padding:20px;}h1{color:#eab308;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ddd;padding:8px;text-align:left;}th{background:#f5f5f5;}</style></head>
        <body><h1>${child.name} - Academic Report</h1><p>School: ${currentSchool.name}</p><p>Grade: ${child.grade} | ELIMUID: ${child.elimuid}</p><p>Date: ${new Date().toLocaleDateString()}</p>
        <h2>Grades</h2><table><tr><th>Subject</th><th>Score</th><th>Grade</th><th>Comment</th></tr>${records.map(r => `<tr><td>${r.subject}</td><td>${r.score}%</td><td>${r.grade}</td><td>${r.comment || '-'}</td></tr>`).join('')}</table>
        <h2>Attendance</h2><p>Present: ${attendance.filter(a => a.status === 'present').length}</p><p>Absent: ${attendance.filter(a => a.status === 'absent').length}</p><p>Late: ${attendance.filter(a => a.status === 'late').length}</p>
        <h2>Fee Status</h2><p>Total: KSh ${fee.amount} | Paid: KSh ${fee.paid} | Balance: KSh ${fee.amount - fee.paid}</p>
        <p><em>Generated by ShuleAI</em></p></body></html>
    `);
    printWindow.document.close();
    printWindow.print();
};

window.showParentPopup = function() {
    if (!parentPopupEnabled) return;
    document.getElementById('parent-popup').style.display = 'block';
    document.getElementById('education-tip').textContent = educationTips[currentTipIndex];
};

window.closeParentPopup = function() { document.getElementById('parent-popup').style.display = 'none'; };

window.toggleParentPopup = function() { 
    parentPopupEnabled = document.getElementById('popup-toggle').checked; 
    if (!parentPopupEnabled) closeParentPopup(); 
};

window.nextTip = function() { 
    currentTipIndex = (currentTipIndex + 1) % educationTips.length; 
    document.getElementById('education-tip').textContent = educationTips[currentTipIndex]; 
    if (document.getElementById('current-tip')) document.getElementById('current-tip').textContent = educationTips[currentTipIndex]; 
};

window.showParentProfile = function() { showToast('Parent profile'); };