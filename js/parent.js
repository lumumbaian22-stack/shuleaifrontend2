// ==================== PARENT FUNCTIONS ====================

window.parentPopupEnabled = true;
window.currentTipIndex = 0;
let currentChildId = null;

window.loadParentChildren = async function() {
    try {
        const childrenData = await api.getChildren();
        window.currentChildren = childrenData.data || [];
        if (window.currentChildren.length > 0) {
            window.activeChildId = window.currentChildren[0].id;
        }
        renderMenu('parent');
    } catch (error) {
        showToast('Failed to load children', 'error');
    }
};

window.switchChild = function(childId) {
    window.activeChildId = childId;
    const child = window.currentChildren.find(c => c.id === childId);
    if (child) {
        document.getElementById('active-child-name').textContent = child.name;
    }
    renderMenu('parent');
    switchParentTab('dashboard');
};

window.switchParentTab = async function(tab) {
    const contentDiv = document.getElementById('parent-content');
    contentDiv.innerHTML = '<div class="loading">Loading...</div>';

    const childId = window.activeChildId;
    if (!childId && tab !== 'tips') {
        contentDiv.innerHTML = '<p>Please select a child from the sidebar.</p>';
        return;
    }

    if (tab === 'dashboard') {
        try {
            const summary = await api.getChildSummary(childId);
            const child = summary.data.student;
            const records = summary.data.recentRecords || [];
            const attendance = summary.data.recentAttendance || [];
            const fee = summary.data.outstandingFees;

            const avgScore = summary.data.averageScore || 0;
            const present = attendance.filter(a => a.status === 'present').length;
            const totalDays = attendance.length || 1;
            const attendanceRate = totalDays ? Math.round((present / totalDays) * 100) : 0;

            let feeHtml = '';
            if (fee) {
                feeHtml = `
                    <div class="card">
                        <h4>Fee Status</h4>
                        <div class="flex-between">
                            <span>Term: ${fee.term}</span>
                            <span class="status-badge status-${fee.status}">${fee.status}</span>
                        </div>
                        <div class="fee-progress">
                            <div class="fee-progress-bar" style="width:${(fee.paidAmount / fee.totalAmount) * 100}%;"></div>
                        </div>
                        <p>Paid: KSh ${fee.paidAmount.toLocaleString()} | Balance: KSh ${fee.balance.toLocaleString()}</p>
                        <p><small>Due: ${fee.dueDate || 'N/A'}</small></p>
                    </div>
                `;
            }

            contentDiv.innerHTML = `
                <div class="stats-grid">
                    <div class="stat-card"><div class="stat-icon" style="background:#eab308;"><i class="fas fa-star"></i></div><div class="stat-info"><h3>${avgScore}%</h3><p>Average</p></div></div>
                    <div class="stat-card"><div class="stat-icon" style="background:#3b82f6;"><i class="fas fa-calendar-check"></i></div><div class="stat-info"><h3>${attendanceRate}%</h3><p>Attendance</p></div></div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h3><i class="fas fa-chart-line"></i> ${child.name}'s Performance</h3>
                        <button class="btn-primary" onclick="printReport('${child.id}')" style="width:auto; padding:0.5rem 1rem;"><i class="fas fa-print"></i> Print</button>
                    </div>
                    <canvas id="parentChart"></canvas>
                </div>
                ${feeHtml}
            `;

            setTimeout(() => {
                destroyCharts();
                const ctx = document.getElementById('parentChart')?.getContext('2d');
                if (ctx) {
                    const labels = records.map(r => r.subject);
                    const scores = records.map(r => r.score);
                    activeCharts.push(new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: 'Scores',
                                data: scores,
                                borderColor: '#eab308',
                                tension: 0.4
                            }]
                        },
                        options: { responsive: true, maintainAspectRatio: false }
                    }));
                }
            }, 100);
        } catch (error) {
            contentDiv.innerHTML = '<div class="error">Failed to load child data</div>';
        }

    } else if (tab === 'grades') {
        try {
            const summary = await api.getChildSummary(childId);
            const records = summary.data.recentRecords || [];
            let rows = records.map(r => `
                <tr>
                    <td>${r.subject}</td>
                    <td>${r.score}%</td>
                    <td><span class="status-badge ${r.score >= 80 ? 'status-excelling' : r.score >= 65 ? 'status-average' : 'status-struggling'}">${r.grade}</span></td>
                    <td>${r.teacher}</td>
                    <td>${r.remarks || '-'}</td>
                </tr>
            `).join('');
            contentDiv.innerHTML = `
                <h3>Grades</h3>
                <div class="table-responsive">
                    <table class="data-table">
                        <tr><th>Subject</th><th>Score</th><th>Grade</th><th>Teacher</th><th>Comment</th></tr>
                        ${rows || '<tr><td colspan="5">No grades found</td></tr>'}
                    </table>
                </div>
            `;
        } catch (error) {
            contentDiv.innerHTML = '<div class="error">Failed to load grades</div>';
        }

    } else if (tab === 'attendance') {
        try {
            const summary = await api.getChildSummary(childId);
            const attendance = summary.data.recentAttendance || [];
            const present = attendance.filter(a => a.status === 'present').length;
            const absent = attendance.filter(a => a.status === 'absent').length;
            const late = attendance.filter(a => a.status === 'late').length;

            let rows = attendance.map(a => `
                <tr>
                    <td>${a.date}</td>
                    <td><span class="status-badge status-${a.status}">${a.status}</span></td>
                    <td>${a.reason || '-'}</td>
                </tr>
            `).join('');

            contentDiv.innerHTML = `
                <h3>Attendance</h3>
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

    } else if (tab === 'fee-statement') {
        try {
            const summary = await api.getChildSummary(childId);
            const fee = summary.data.outstandingFees;
            if (!fee) {
                contentDiv.innerHTML = '<p>No fee information available.</p>';
                return;
            }
            contentDiv.innerHTML = `
                <h3>Fee Statement</h3>
                <div class="card">
                    <h4>${summary.data.student.name} - ${fee.term}</h4>
                    <table class="data-table">
                        <tr><td>Total Fees:</td><td><strong>KSh ${fee.totalAmount.toLocaleString()}</strong></td></tr>
                        <tr><td>Paid:</td><td>KSh ${fee.paidAmount.toLocaleString()}</td></tr>
                        <tr><td>Balance:</td><td class="status-struggling">KSh ${fee.balance.toLocaleString()}</td></tr>
                        <tr><td>Due Date:</td><td>${fee.dueDate || 'N/A'}</td></tr>
                        <tr><td>Status:</td><td><span class="status-badge status-${fee.status}">${fee.status}</span></td></tr>
                    </table>
                </div>
            `;
        } catch (error) {
            contentDiv.innerHTML = '<div class="error">Failed to load fee statement</div>';
        }

    } else if (tab === 'report') {
        contentDiv.innerHTML = `
            <h3>Report Absence</h3>
            <div class="card">
                <div class="form-group">
                    <label>Date</label>
                    <input type="date" id="absence-date" value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label>Reason for Absence</label>
                    <textarea id="absence-reason" rows="4" placeholder="Please provide details..."></textarea>
                </div>
                <button class="btn-primary" onclick="reportChildAbsence()">Submit Report</button>
            </div>
        `;
    } else if (tab === 'tips') {
        const tips = window.educationTips || [
            "Regular communication with teachers improves student performance by 40%.",
            "Students who study 30 minutes daily score 20% higher on average.",
            "The 8-4-4 system emphasizes exams while CBC focuses on competencies.",
            "Attendance below 80% significantly impacts academic performance.",
            "Parental involvement increases student motivation by 50%."
        ];
        contentDiv.innerHTML = `
            <h3>Did You Know?</h3>
            <div class="card">
                <p id="current-tip">${tips[window.currentTipIndex]}</p>
                <button class="btn-primary" onclick="nextTip()">Next Tip</button>
            </div>
        `;
    } else {
        contentDiv.innerHTML = `<h3>${tab.replace(/-/g, ' ')}</h3><div class="card"><p>Content for ${tab} would appear here.</p></div>`;
    }

    updateActiveMenu('parent-sidebar', tab);
};

window.reportChildAbsence = async function() {
    const date = document.getElementById('absence-date')?.value;
    const reason = document.getElementById('absence-reason')?.value;
    if (!date || !reason) {
        showToast('Please fill both fields', 'warning');
        return;
    }
    try {
        await api.reportAbsence({
            studentId: window.activeChildId,
            date,
            reason
        });
        showToast('Absence reported', 'success');
        switchParentTab('dashboard');
    } catch (error) {
        showToast('Failed to report absence', 'error');
    }
};

window.printReport = function(childId) {
    // We can generate a printable version from the fetched data
    showToast('Print feature coming soon', 'info');
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
    const tips = window.educationTips || [];
    currentTipIndex = (currentTipIndex + 1) % tips.length; 
    const tipEl = document.getElementById('education-tip') || document.getElementById('current-tip');
    if (tipEl) tipEl.textContent = tips[currentTipIndex]; 
};

window.showParentProfile = function() { showToast('Parent profile'); };
