// ==================== TEACHER FUNCTIONS ====================

let currentClassStudents = []; // cache for quick access

window.switchTeacherTab = async function(tab) {
    const contentDiv = document.getElementById('teacher-content');
    contentDiv.innerHTML = '<div class="loading">Loading...</div>';

    if (tab === 'dashboard') {
        try {
            const studentsData = await api.getTeacherStudents();
            currentClassStudents = studentsData.data || [];
            const total = currentClassStudents.length;

            // For stats, we might need to fetch analytics for the class
            // For simplicity, we'll just show counts
            let excelling = 0, struggling = 0;
            // We could fetch each student's average later, but for now we show placeholders

            const today = new Date().toISOString().split('T')[0];
            // We don't have today's attendance count from API, so we'll skip or show 0

            contentDiv.innerHTML = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon" style="background:#3b82f6;"><i class="fas fa-users"></i></div>
                        <div class="stat-info"><h3>${total}</h3><p>Students</p></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background:#10b981;"><i class="fas fa-star"></i></div>
                        <div class="stat-info"><h3>${excelling}</h3><p>Excelling</p></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background:#ef4444;"><i class="fas fa-exclamation-triangle"></i></div>
                        <div class="stat-info"><h3>${struggling}</h3><p>Need Help</p></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background:#eab308;"><i class="fas fa-calendar-check"></i></div>
                        <div class="stat-info"><h3>0/${total}</h3><p>Present Today</p></div>
                    </div>
                </div>
                <div class="card">
                    <h4>Quick Actions</h4>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <button class="btn-primary" onclick="switchTeacherTab('marks')">Enter Marks</button>
                        <button class="btn-primary" onclick="switchTeacherTab('attendance')">Take Attendance</button>
                        <button class="btn-primary" onclick="switchTeacherTab('comments')">Add Comments</button>
                    </div>
                </div>
            `;
        } catch (error) {
            contentDiv.innerHTML = '<div class="error">Failed to load dashboard</div>';
            console.error(error);
        }

    } else if (tab === 'students') {
        try {
            const studentsData = await api.getTeacherStudents();
            currentClassStudents = studentsData.data || [];

            let tableRows = currentClassStudents.map(s => `
                <tr>
                    <td>${s.name}</td>
                    <td>${s.elimuid}</td>
                    <td>${s.grade}</td>
                    <td><span class="status-badge status-average">-</span></td>
                    <td><button class="btn-small" onclick="showToast('View ${s.name}')">View</button></td>
                </tr>
            `).join('');

            contentDiv.innerHTML = `
                <h3>My Students</h3>
                <div class="table-responsive">
                    <table class="data-table">
                        <tr><th>Name</th><th>ELIMUID</th><th>Grade</th><th>Average</th><th>Actions</th></tr>
                        ${tableRows || '<tr><td colspan="5">No students found</td></tr>'}
                    </table>
                </div>
            `;
        } catch (error) {
            contentDiv.innerHTML = '<div class="error">Failed to load students</div>';
        }

    } else if (tab === 'marks') {
        try {
            const studentsData = await api.getTeacherStudents();
            currentClassStudents = studentsData.data || [];

            let rows = currentClassStudents.map(s => `
                <tr>
                    <td>${s.name}</td>
                    <td><input type="number" min="0" max="100" id="score-${s.id}" style="width:70px;" onchange="previewGrade('${s.id}', this.value)"></td>
                    <td id="grade-${s.id}">-</td>
                    <td><input type="text" id="comment-${s.id}" placeholder="Optional" style="width:100%;"></td>
                </tr>
            `).join('');

            contentDiv.innerHTML = `
                <h3>Enter Marks - ${window.currentUser.subject || ''}</h3>
                <div class="card">
                    <div class="form-group">
                        <label>Assessment Type</label>
                        <select id="assessment-type">
                            <option>End Term Exam</option>
                            <option>Mid Term Test</option>
                            <option>Assignment</option>
                        </select>
                    </div>
                    <div class="table-responsive">
                        <table class="data-table">
                            <tr><th>Student</th><th>Score (0-100)</th><th>Grade</th><th>Comment</th></tr>
                            ${rows}
                        </table>
                    </div>
                    <button class="btn-primary" onclick="saveTeacherMarks()" style="margin-top:1rem;">Save Marks</button>
                </div>
            `;
        } catch (error) {
            contentDiv.innerHTML = '<div class="error">Failed to load students</div>';
        }

    } else if (tab === 'attendance') {
        const today = new Date().toISOString().split('T')[0];
        try {
            const studentsData = await api.getTeacherStudents();
            currentClassStudents = studentsData.data || [];

            let rows = currentClassStudents.map(s => {
                // We could fetch today's status later, but for simplicity we use 'present' as default
                return `
                    <tr>
                        <td>${s.name}</td>
                        <td><span class="status-badge status-present" id="status-${s.id}">present</span></td>
                        <td><input type="text" id="reason-${s.id}" placeholder="Reason if absent/late" style="width:100%;"></td>
                        <td>
                            <button class="btn-small" onclick="markAttendance('${s.id}','present')">P</button>
                            <button class="btn-small" onclick="markAttendance('${s.id}','absent')">A</button>
                            <button class="btn-small" onclick="markAttendance('${s.id}','late')">L</button>
                        </td>
                    </tr>
                `;
            }).join('');

            contentDiv.innerHTML = `
                <h3>Take Attendance - ${today}</h3>
                <div class="card">
                    <div class="table-responsive">
                        <table class="data-table">
                            <tr><th>Student</th><th>Status</th><th>Reason</th><th>Actions</th></tr>
                            ${rows}
                        </table>
                    </div>
                    <button class="btn-primary" onclick="saveAttendance()" style="margin-top:1rem;">Save Attendance</button>
                </div>
            `;
        } catch (error) {
            contentDiv.innerHTML = '<div class="error">Failed to load students</div>';
        }

    } else if (tab === 'subject-analytics') {
        try {
            // Use the analytics endpoint for the teacher's subject
            const className = window.currentUser.class;
            const subject = window.currentUser.subject;
            if (!className || !subject) {
                contentDiv.innerHTML = '<div class="error">Class or subject not set</div>';
                return;
            }
            const analytics = await api.getClassAnalytics(className, subject);
            const data = analytics.data;

            // Build a simple bar chart of student scores (if available)
            const studentNames = data.studentStats.map(s => s.name);
            const scores = data.studentStats.map(s => s.average);

            contentDiv.innerHTML = `
                <h3>${subject} Analytics - ${className}</h3>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon" style="background:#3b82f6;"><i class="fas fa-chart-line"></i></div>
                        <div class="stat-info"><h3>${data.overallAverage.toFixed(1)}%</h3><p>Average</p></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background:#10b981;"><i class="fas fa-check-circle"></i></div>
                        <div class="stat-info"><h3>${scores.filter(s => s >= 50).length}</h3><p>Passed</p></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background:#ef4444;"><i class="fas fa-times-circle"></i></div>
                        <div class="stat-info"><h3>${scores.filter(s => s < 50).length}</h3><p>Failed</p></div>
                    </div>
                </div>
                <div class="card">
                    <h4>Score Distribution</h4>
                    <canvas id="subjectChart" style="height:300px;"></canvas>
                </div>
            `;

            setTimeout(() => {
                destroyCharts();
                const ctx = document.getElementById('subjectChart')?.getContext('2d');
                if (ctx) {
                    activeCharts.push(new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: studentNames,
                            datasets: [{
                                label: 'Score',
                                data: scores,
                                backgroundColor: '#3b82f6'
                            }]
                        },
                        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100 } } }
                    }));
                }
            }, 100);
        } catch (error) {
            contentDiv.innerHTML = '<div class="error">Failed to load analytics</div>';
        }

    } else if (tab === 'comments') {
        contentDiv.innerHTML = `
            <h3>Add Comment</h3>
            <div class="card">
                <div class="form-group">
                    <label>Student</label>
                    <select id="comment-student">
                        ${currentClassStudents.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Comment</label>
                    <textarea id="comment-text" rows="4" placeholder="Enter your comment..."></textarea>
                </div>
                <button class="btn-primary" onclick="submitComment()">Submit Comment</button>
            </div>
        `;
    } else {
        contentDiv.innerHTML = `<h3>${tab.replace(/-/g, ' ')}</h3><div class="card"><p>Content for ${tab} would appear here.</p></div>`;
    }

    updateActiveMenu('teacher-sidebar', tab);
};

window.previewGrade = function(studentId, score) {
    if (!score) return;
    const gradeInfo = window.calculateGrade(parseInt(score), window.currentSchool.system);
    document.getElementById(`grade-${studentId}`).textContent = gradeInfo.grade;
};

window.saveTeacherMarks = async function() {
    const assessmentType = document.getElementById('assessment-type')?.value || 'test';
    let savedCount = 0;
    for (const student of currentClassStudents) {
        const scoreInput = document.getElementById(`score-${student.id}`);
        if (scoreInput && scoreInput.value) {
            const score = parseInt(scoreInput.value);
            const commentEl = document.getElementById(`comment-${student.id}`);
            const comment = commentEl ? commentEl.value : '';
            try {
                await api.enterMarks({
                    studentId: student.id,
                    subject: window.currentUser.subject,
                    score,
                    assessmentType,
                    assessmentName: assessmentType,
                    comment
                });
                savedCount++;
            } catch (e) {
                showToast(`Failed to save marks for ${student.name}`, 'error');
            }
        }
    }
    showToast(`Saved ${savedCount} marks`, 'success');
    switchTeacherTab('dashboard');
};

window.markAttendance = function(studentId, status) {
    const today = new Date().toISOString().split('T')[0];
    const reason = document.getElementById(`reason-${studentId}`)?.value || '';
    // Store temporary in local state – actual save happens on "Save Attendance"
    const span = document.getElementById(`status-${studentId}`);
    if (span) {
        span.className = `status-badge status-${status}`;
        span.textContent = status;
        span.setAttribute('data-status', status);
        span.setAttribute('data-reason', reason);
    }
    showToast(`Marked as ${status} (not saved yet)`);
};

window.saveAttendance = async function() {
    let savedCount = 0;
    for (const student of currentClassStudents) {
        const span = document.getElementById(`status-${student.id}`);
        if (span) {
            const status = span.getAttribute('data-status') || 'present';
            const reason = span.getAttribute('data-reason') || '';
            try {
                await api.takeAttendance({
                    studentId: student.id,
                    date: new Date().toISOString().split('T')[0],
                    status,
                    reason
                });
                savedCount++;
            } catch (e) {
                showToast(`Failed to save attendance for ${student.name}`, 'error');
            }
        }
    }
    showToast(`Saved attendance for ${savedCount} students`, 'success');
    switchTeacherTab('dashboard');
};

window.submitComment = async function() {
    const studentId = document.getElementById('comment-student')?.value;
    const comment = document.getElementById('comment-text')?.value;
    if (!studentId || !comment) {
        showToast('Please select a student and enter a comment', 'warning');
        return;
    }
    try {
        await api.addComment({ studentId, comment });
        showToast('Comment sent to parents', 'success');
        switchTeacherTab('dashboard');
    } catch (error) {
        showToast('Failed to send comment', 'error');
    }
};

window.showTeacherProfile = function() { showToast('Teacher profile'); };
