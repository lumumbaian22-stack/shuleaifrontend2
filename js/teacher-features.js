// Teacher Features

// Load teacher's students
async function loadMyStudents() {
    try {
        const response = await api.teacher.getMyStudents();
        return response.data;
    } catch (error) {
        console.error('Failed to load students:', error);
        showToast('Failed to load students', 'error');
        return [];
    }
}

// Add new student
async function addStudent(studentData) {
    showLoading();
    try {
        const response = await api.teacher.addStudent(studentData);
        showToast(`✅ Student added! ELIMUID: ${response.data.elimuid}`, 'success');
        
        // Refresh students list
        await refreshMyStudents();
        
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to add student', 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

// Enter marks
async function enterMarks(marksData) {
    showLoading();
    try {
        const response = await api.teacher.enterMarks(marksData);
        showToast('✅ Marks saved successfully', 'success');
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to save marks', 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

// Take attendance
async function takeAttendance(attendanceData) {
    showLoading();
    try {
        const response = await api.teacher.takeAttendance(attendanceData);
        showToast('✅ Attendance recorded', 'success');
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to record attendance', 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

// Add comment
async function addComment(studentId, comment) {
    showLoading();
    try {
        const response = await api.teacher.addComment({ studentId, comment });
        showToast('✅ Comment sent to parents', 'success');
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to add comment', 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

// Upload marks CSV
async function uploadMarksCSV(file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await api.teacher.uploadMarksCSV(formData, onProgress);
        showToast(`✅ Processed ${response.data.stats.processed} records`, 'success');
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to upload CSV', 'error');
        throw error;
    }
}

// Render add student form
function renderAddStudentForm() {
    return `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium mb-1">Full Name</label>
                <input type="text" id="student-name" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Grade/Class</label>
                <input type="text" id="student-grade" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Parent Email</label>
                <input type="email" id="parent-email" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <p class="text-xs text-muted-foreground mt-1">Parent will use this email to sign up</p>
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Date of Birth</label>
                <input type="date" id="student-dob" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Gender</label>
                <select id="student-gender" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <button onclick="handleAddStudent()" class="w-full bg-primary text-primary-foreground py-2 rounded-lg">
                Generate ELIMUID & Add
            </button>
        </div>
    `;
}

// Handle add student form submission
async function handleAddStudent() {
    const studentData = {
        name: document.getElementById('student-name')?.value,
        grade: document.getElementById('student-grade')?.value,
        parentEmail: document.getElementById('parent-email')?.value,
        dateOfBirth: document.getElementById('student-dob')?.value,
        gender: document.getElementById('student-gender')?.value
    };
    
    if (!studentData.name || !studentData.grade) {
        showToast('Name and grade are required', 'error');
        return;
    }
    
    await addStudent(studentData);
    
    // Clear form
    document.getElementById('student-name').value = '';
    document.getElementById('student-grade').value = '';
    document.getElementById('parent-email').value = '';
    document.getElementById('student-dob').value = '';
    document.getElementById('student-gender').value = '';
}

// Render marks entry form
function renderMarksEntryForm(students, subjects) {
    return `
        <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Subject</label>
                    <select id="marks-subject" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        ${subjects.map(subject => `<option value="${subject}">${subject}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Assessment Type</label>
                    <select id="marks-type" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        <option value="test">Test</option>
                        <option value="exam">Exam</option>
                        <option value="assignment">Assignment</option>
                        <option value="project">Project</option>
                        <option value="quiz">Quiz</option>
                    </select>
                </div>
            </div>
            
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead class="bg-muted/50">
                        <tr>
                            <th class="px-4 py-3 text-left font-medium">Student</th>
                            <th class="px-4 py-3 text-left font-medium">ELIMUID</th>
                            <th class="px-4 py-3 text-center font-medium">Score (0-100)</th>
                            <th class="px-4 py-3 text-center font-medium">Grade</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        ${students.map(student => `
                            <tr class="hover:bg-accent/50 transition-colors" data-student-id="${student.id}">
                                <td class="px-4 py-3 font-medium">${student.User.name}</td>
                                <td class="px-4 py-3">
                                    <span class="font-mono text-xs bg-muted px-2 py-1 rounded">${student.elimuid}</span>
                                </td>
                                <td class="px-4 py-3 text-center">
                                    <input type="number" class="student-score w-20 rounded-lg border border-input bg-background px-2 py-1 text-sm text-center" 
                                        min="0" max="100" onchange="updateGradeDisplay(this)">
                                </td>
                                <td class="px-4 py-3 text-center">
                                    <span class="student-grade px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">-</span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <button onclick="saveAllMarks()" class="w-full bg-primary text-primary-foreground py-2 rounded-lg">
                Save All Marks
            </button>
        </div>
    `;
}

// Update grade display based on score
function updateGradeDisplay(input) {
    const row = input.closest('tr');
    const score = parseInt(input.value);
    const gradeSpan = row.querySelector('.student-grade');
    
    if (!isNaN(score) && score >= 0 && score <= 100) {
        let grade = '';
        let color = '';
        
        if (score >= 80) { grade = 'A'; color = 'green'; }
        else if (score >= 75) { grade = 'A-'; color = 'green'; }
        else if (score >= 70) { grade = 'B+'; color = 'blue'; }
        else if (score >= 65) { grade = 'B'; color = 'blue'; }
        else if (score >= 60) { grade = 'B-'; color = 'blue'; }
        else if (score >= 55) { grade = 'C+'; color = 'yellow'; }
        else if (score >= 50) { grade = 'C'; color = 'yellow'; }
        else if (score >= 45) { grade = 'C-'; color = 'yellow'; }
        else if (score >= 40) { grade = 'D+'; color = 'orange'; }
        else if (score >= 35) { grade = 'D'; color = 'orange'; }
        else if (score >= 30) { grade = 'D-'; color = 'orange'; }
        else { grade = 'E'; color = 'red'; }
        
        gradeSpan.textContent = grade;
        gradeSpan.className = `student-grade px-2 py-1 bg-${color}-100 text-${color}-700 text-xs rounded-full`;
    } else {
        gradeSpan.textContent = '-';
        gradeSpan.className = 'student-grade px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full';
    }
}

// Save all marks
async function saveAllMarks() {
    const subject = document.getElementById('marks-subject')?.value;
    const assessmentType = document.getElementById('marks-type')?.value;
    
    if (!subject) {
        showToast('Please select a subject', 'error');
        return;
    }
    
    const rows = document.querySelectorAll('[data-student-id]');
    const marks = [];
    
    rows.forEach(row => {
        const studentId = row.dataset.studentId;
        const score = row.querySelector('.student-score')?.value;
        
        if (score && !isNaN(parseInt(score))) {
            marks.push({
                studentId: parseInt(studentId),
                subject,
                assessmentType,
                score: parseInt(score),
                date: new Date().toISOString().split('T')[0]
            });
        }
    });
    
    if (marks.length === 0) {
        showToast('No marks entered', 'error');
        return;
    }
    
    showLoading();
    try {
        for (const mark of marks) {
            await enterMarks(mark);
        }
        showToast(`✅ Saved ${marks.length} marks`, 'success');
        
        // Clear inputs
        rows.forEach(row => {
            row.querySelector('.student-score').value = '';
            row.querySelector('.student-grade').textContent = '-';
            row.querySelector('.student-grade').className = 'student-grade px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full';
        });
    } catch (error) {
        // Error already shown in enterMarks
    } finally {
        hideLoading();
    }
}

// Refresh my students
async function refreshMyStudents() {
    const container = document.getElementById('my-students-table');
    if (!container) return;
    
    const students = await loadMyStudents();
    if (students && students.length > 0) {
        container.innerHTML = renderStudentsTable(students);
    } else {
        container.innerHTML = '<div class="text-center py-8 text-muted-foreground">No students yet</div>';
    }
    lucide.createIcons();
}

// Export functions
window.loadMyStudents = loadMyStudents;
window.addStudent = addStudent;
window.enterMarks = enterMarks;
window.takeAttendance = takeAttendance;
window.addComment = addComment;
window.uploadMarksCSV = uploadMarksCSV;
window.renderAddStudentForm = renderAddStudentForm;
window.renderMarksEntryForm = renderMarksEntryForm;
window.handleAddStudent = handleAddStudent;
window.updateGradeDisplay = updateGradeDisplay;
window.saveAllMarks = saveAllMarks;
window.refreshMyStudents = refreshMyStudents;