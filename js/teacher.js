// ==================== TEACHER FUNCTIONS ====================

window.switchTeacherTab = function(tab) {
    let content = '';
    
    if (tab === 'dashboard') {
        const myClass = users.students.filter(s => s.grade === currentUser.class && s.schoolCode === currentSchool.code);
        const excelling = myClass.filter(s => { const avg = academicRecords.filter(r => r.studentId === s.id).reduce((sum, r) => sum + r.score, 0) / (academicRecords.filter(r => r.studentId === s.id).length || 1); return avg >= 80; }).length;
        const struggling = myClass.filter(s => { const avg = academicRecords.filter(r => r.studentId === s.id).reduce((sum, r) => sum + r.score, 0) / (academicRecords.filter(r => r.studentId === s.id).length || 1); return avg < 65; }).length;
        const today = new Date().toISOString().split('T')[0];
        const presentToday = attendanceRecords.filter(r => myClass.some(s => s.id === r.studentId) && r.date === today && r.status === 'present').length;
        
        content = `
            <div class="stats-grid">
                <div class="stat-card"><div class="stat-icon" style="background:#3b82f6;"><i class="fas fa-users"></i></div><div class="stat-info"><h3>${myClass.length}</h3><p>Students</p></div></div>
                <div class="stat-card"><div class="stat-icon" style="background:#10b981;"><i class="fas fa-star"></i></div><div class="stat-info"><h3>${excelling}</h3><p>Excelling</p></div></div>
                <div class="stat-card"><div class="stat-icon" style="background:#ef4444;"><i class="fas fa-exclamation-triangle"></i></div><div class="stat-info"><h3>${struggling}</h3><p>Need Help</p></div></div>
                <div class="stat-card"><div class="stat-icon" style="background:#eab308;"><i class="fas fa-calendar-check"></i></div><div class="stat-info"><h3>${presentToday}/${myClass.length}</h3><p>Present Today</p></div></div>
            </div>
            <div class="card"><h4>Quick Actions</h4><div style="display: flex; gap: 1rem; flex-wrap: wrap;"><button class="btn-primary" onclick="switchTeacherTab('marks')">Enter Marks</button><button class="btn-primary" onclick="switchTeacherTab('attendance')">Take Attendance</button><button class="btn-primary" onclick="switchTeacherTab('comments')">Add Comments</button></div></div>
        `;
    } else if (tab === 'marks') {
        const myClass = users.students.filter(s => s.grade === currentUser.class && s.schoolCode === currentSchool.code);
        const passMark = subjects.find(s => s.name === currentUser.subject)?.passMark || 50;
        content = `
            <h3>Enter Marks - ${currentUser.subject}</h3>
            <div class="card">
                <div class="form-group"><label>Assessment Type</label><select><option>End Term Exam</option><option>Mid Term Test</option><option>Assignment</option></select></div>
                <div class="form-group"><label>Pass Mark: ${passMark}% (Auto-calculates grades based on ${currentSchool.system})</label></div>
                <div class="table-responsive"><table class="data-table"><tr><th>Student</th><th>Current</th><th>New Score</th><th>Grade</th><th>Comment</th></tr>${myClass.map(s => { const current = academicRecords.find(r => r.studentId === s.id && r.subject === currentUser.subject); return `<tr><td>${s.name}</td><td>${current ? current.score + '%' : 'N/A'}</td><td><input type="number" min="0" max="100" id="score-${s.id}" style="width:70px;" onchange="previewGrade('${s.id}', this.value)"></td><td id="grade-${s.id}">-</td><td><input type="text" id="comment-${s.id}" placeholder="Optional" style="width:100%;"></td></tr>`; }).join('')}</table></div>
                <button class="btn-primary" onclick="saveTeacherMarks()" style="margin-top:1rem;">Save Marks</button>
            </div>
        `;
    } else if (tab === 'attendance') {
        const today = new Date().toISOString().split('T')[0];
        const myClass = users.students.filter(s => s.grade === currentUser.class && s.schoolCode === currentSchool.code);
        content = `
            <h3>Take Attendance - ${today}</h3>
            <div class="card"><div class="table-responsive"><table class="data-table"><tr><th>Student</th><th>Status</th><th>Reason</th><th>Actions</th></tr>${myClass.map(s => { const todayRecord = attendanceRecords.find(r => r.studentId === s.id && r.date === today); const status = todayRecord ? todayRecord.status : 'present'; return `<tr><td>${s.name}</td><td><span class="status-badge status-${status}" id="status-${s.id}">${status}</span></td><td><input type="text" id="reason-${s.id}" value="${todayRecord?.reason || ''}" style="width:100%;"></td><td><button class="btn-small" onclick="markAttendance('${s.id}','present')">P</button> <button class="btn-small" onclick="markAttendance('${s.id}','absent')">A</button> <button class="btn-small" onclick="markAttendance('${s.id}','late')">L</button></td></tr>`; }).join('')}</table></div><button class="btn-primary" onclick="saveAttendance()" style="margin-top:1rem;">Save Attendance</button></div>
        `;
    } else if (tab === 'subject-analytics') {
        const myClass = users.students.filter(s => s.grade === currentUser.class && s.schoolCode === currentSchool.code);
        const subjectScores = academicRecords.filter(r => myClass.some(s => s.id === r.studentId) && r.subject === currentUser.subject);
        const passMark = subjects.find(s => s.name === currentUser.subject)?.passMark || 50;
        const passed = subjectScores.filter(s => s.score >= passMark).length;
        const failed = subjectScores.filter(s => s.score < passMark).length;
        content = `
            <h3>${currentUser.subject} Analytics</h3>
            <div class="stats-grid"><div class="stat-card"><div class="stat-icon" style="background:#3b82f6;"><i class="fas fa-chart-line"></i></div><div class="stat-info"><h3>${subjectScores.length ? Math.round(subjectScores.reduce((a,b) => a+b.score, 0) / subjectScores.length) : 0}%</h3><p>Average</p></div></div><div class="stat-card"><div class="stat-icon" style="background:#10b981;"><i class="fas fa-check-circle"></i></div><div class="stat-info"><h3>${passed}</h3><p>Passed</p></div></div><div class="stat-card"><div class="stat-icon" style="background:#ef4444;"><i class="fas fa-times-circle"></i></div><div class="stat-info"><h3>${failed}</h3><p>Failed</p></div></div></div>
            <div class="card"><h4>Score Distribution</h4><canvas id="subjectChart"></canvas></div>
        `;
        document.getElementById('teacher-content').innerHTML = content;
        setTimeout(() => {
            destroyCharts();
            const ctx = document.getElementById('subjectChart')?.getContext('2d');
            if (ctx) {
                const scores = subjectScores.map(s => s.score);
                activeCharts.push(new Chart(ctx, { type: 'bar', data: { labels: ['0-40','41-50','51-60','61-70','71-80','81-90','91-100'], datasets: [{ data: [scores.filter(s => s <= 40).length, scores.filter(s => s > 40 && s <= 50).length, scores.filter(s => s > 50 && s <= 60).length, scores.filter(s => s > 60 && s <= 70).length, scores.filter(s => s > 70 && s <= 80).length, scores.filter(s => s > 80 && s <= 90).length, scores.filter(s => s > 90).length], backgroundColor: '#3b82f6' }] } }));
            }
        }, 100);
        return;
    } else {
        content = `<h3>${tab.replace(/-/g, ' ')}</h3><div class="card"><p>Content for ${tab} would appear here.</p></div>`;
    }
    
    document.getElementById('teacher-content').innerHTML = content;
    updateActiveMenu('teacher-sidebar', tab);
};

window.previewGrade = function(studentId, score) {
    if (!score) return;
    const gradeInfo = calculateGrade(parseInt(score), currentSchool.system);
    document.getElementById(`grade-${studentId}`).textContent = gradeInfo.grade;
};

window.saveTeacherMarks = function() {
    const myClass = users.students.filter(s => s.grade === currentUser.class && s.schoolCode === currentSchool.code);
    let savedCount = 0;
    myClass.forEach(s => {
        const scoreInput = document.getElementById(`score-${s.id}`);
        if (scoreInput && scoreInput.value) {
            const score = parseInt(scoreInput.value);
            const gradeInfo = calculateGrade(score, currentSchool.system);
            let record = academicRecords.find(r => r.studentId === s.id && r.subject === currentUser.subject && r.term === 'Term 1, 2024');
            if (record) {
                record.score = score;
                record.grade = gradeInfo.grade;
            } else {
                academicRecords.push({ studentId: s.id, subject: currentUser.subject, score: score, grade: gradeInfo.grade, term: 'Term 1, 2024', teacher: currentUser.name, date: new Date().toISOString().split('T')[0] });
            }
            savedCount++;
        }
    });
    showToast(`Saved ${savedCount} marks`);
    switchTeacherTab('dashboard');
};

window.markAttendance = function(studentId, status) {
    const today = new Date().toISOString().split('T')[0];
    const reason = document.getElementById(`reason-${studentId}`)?.value || '';
    let rec = attendanceRecords.find(r => r.studentId === studentId && r.date === today);
    if (rec) { rec.status = status; rec.reason = reason; }
    else attendanceRecords.push({ studentId, date: today, status, reason });
    
    const span = document.getElementById(`status-${studentId}`);
    if (span) { span.className = `status-badge status-${status}`; span.textContent = status; }
    
    if (status === 'absent') {
        const student = users.students.find(s => s.id === studentId);
        alerts.push({ id: alerts.length + 1, type: 'attendance', for: studentId, message: `${student?.name} was absent today`, date: today, severity: 'warning' });
    }
    showToast(`Marked as ${status}`);
};

window.saveAttendance = function() { showToast('Attendance saved'); };

window.showTeacherProfile = function() { showToast('Teacher profile'); };