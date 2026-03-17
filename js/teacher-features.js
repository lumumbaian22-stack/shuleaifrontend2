// ============ TEACHER FEATURES ============
// WARNING: Do not overwrite admin functions

// Save the admin version if it exists
const adminViewStudent = window.viewStudent;

// Then define your teacher version with a different name
async function teacherViewStudentDetails(studentId) {
    // ... your existing teacher code ...
}

// Export with a different name
window.teacherViewStudentDetails = teacherViewStudentDetails;

// Restore the admin version if it was overwritten
if (adminViewStudent && typeof window.viewStudent !== 'function') {
    window.viewStudent = adminViewStudent;
}

// teacher-features.js - Complete file with all teacher functions

// ============ STUDENT MANAGEMENT ============

// Show add student modal
function showAddStudentModal() {
    let modal = document.getElementById('add-student-modal');
    if (!modal) {
        createAddStudentModal();
        modal = document.getElementById('add-student-modal');
    }
    if (modal) modal.classList.remove('hidden');
}

// Create add student modal
function createAddStudentModal() {
    const modalHTML = `
        <div id="add-student-modal" class="fixed inset-0 z-50 hidden">
            <div class="absolute inset-0 bg-black/50" onclick="closeAddStudentModal()"></div>
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4">
                <div class="rounded-xl border bg-card p-6 shadow-xl animate-fade-in">
                    <h3 class="text-lg font-semibold mb-4">Add New Student</h3>
                    <div class="space-y-4">
                        <div><label class="block text-sm font-medium mb-1">Full Name *</label><input type="text" id="modal-student-name" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" required></div>
                        <div><label class="block text-sm font-medium mb-1">Grade/Class *</label><input type="text" id="modal-student-grade" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" required></div>
                        <div><label class="block text-sm font-medium mb-1">Parent Email</label><input type="email" id="modal-parent-email" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"></div>
                        <div><label class="block text-sm font-medium mb-1">Date of Birth</label><input type="date" id="modal-student-dob" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"></div>
                        <div><label class="block text-sm font-medium mb-1">Gender</label>
                            <select id="modal-student-gender" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                                <option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex justify-end gap-2 mt-6">
                        <button onclick="closeAddStudentModal()" class="px-4 py-2 text-sm border rounded-lg hover:bg-accent">Cancel</button>
                        <button onclick="handleAddStudentModal()" class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Add Student</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Close add student modal
function closeAddStudentModal() {
    const modal = document.getElementById('add-student-modal');
    if (modal) {
        modal.classList.add('hidden');
        ['modal-student-name', 'modal-student-grade', 'modal-parent-email', 'modal-student-dob', 'modal-student-gender'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
    }
}

// Handle add student from modal
async function handleAddStudentModal() {
    const studentData = {
        name: document.getElementById('modal-student-name')?.value,
        grade: document.getElementById('modal-student-grade')?.value,
        parentEmail: document.getElementById('modal-parent-email')?.value,
        dateOfBirth: document.getElementById('modal-student-dob')?.value,
        gender: document.getElementById('modal-student-gender')?.value
    };
    
    if (!studentData.name || !studentData.grade) {
        showToast('Name and grade are required', 'error');
        return;
    }
    
    await addStudent(studentData);
    closeAddStudentModal();
}

// Add new student
async function addStudent(studentData) {
    showLoading();
    try {
        const response = await api.teacher.addStudent(studentData);
        showToast(`✅ Student added! ELIMUID: ${response.data.elimuid}`, 'success');
        await refreshMyStudents();
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to add student', 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

// Load teacher's students
async function loadMyStudents() {
    try {
        const response = await api.teacher.getMyStudents();
        return response.data || [];
    } catch (error) {
        console.error('Failed to load students:', error);
        return [];
    }
}

// Refresh my students list
async function refreshMyStudents() {
    const container = document.getElementById('my-students-table');
    if (!container) return;
    
    const students = await loadMyStudents();
    
    // Update the table
    if (students && students.length > 0) {
        container.innerHTML = renderStudentsTable(students);
    } else {
        container.innerHTML = '<div class="text-center py-8 text-muted-foreground">No students yet. Click "Add Student" to get started.</div>';
    }
    
    // Update stats with null checks
    updateStats(students);
    
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

// Add this helper function
function updateStats(students) {
    // Safely update student count
    const countElement = document.getElementById('my-students-count');
    if (countElement) {
        countElement.textContent = students ? students.length : 0;
    }
    
    // Safely update classes count (if you have that element)
    const classesElement = document.getElementById('my-classes-count');
    if (classesElement && students) {
        // Get unique grades/classes
        const uniqueClasses = [...new Set(students.map(s => s.grade))];
        classesElement.textContent = uniqueClasses.length;
    }
    
    // Safely update class average (if you have that element)
    const avgElement = document.getElementById('class-average');
    if (avgElement && students && students.length > 0) {
        const avg = students.reduce((sum, s) => sum + (s.average || 0), 0) / students.length;
        avgElement.textContent = Math.round(avg) + '%';
    }
}

// Update stats
function updateStats(students) {
    document.getElementById('my-students-count').textContent = students.length;
    
    let totalAvg = 0, avgCount = 0;
    students.forEach(s => {
        if (s.average) { totalAvg += s.average; avgCount++; }
    });
    document.getElementById('class-average').textContent = (avgCount > 0 ? Math.round(totalAvg / avgCount) : 0) + '%';
}

// Render students table
function renderStudentsTable(students) {
    return `
        ${students.map(student => {
            const user = student.User || {};
            return `<tr class="hover:bg-accent/50 transition-colors">
                <td class="px-4 py-3"><div class="flex items-center gap-3"><div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center"><span class="font-medium text-blue-700 text-sm">${getInitials(user.name)}</span></div><span class="font-medium">${user.name || 'Unknown'}</span></div></td>
                <td class="px-4 py-3">${student.grade || 'N/A'}</td>
                <td class="px-4 py-3"><span class="font-mono text-xs bg-muted px-2 py-1 rounded">${student.elimuid || 'N/A'}</span></td>
                <td class="px-4 py-3"><div class="flex items-center gap-2"><div class="h-2 w-16 rounded-full bg-muted overflow-hidden"><div class="h-full w-[${student.attendance || 95}%] bg-green-500 rounded-full"></div></div><span class="text-xs">${student.attendance || 95}%</span></div></td>
                <td class="px-4 py-3"><span class="font-semibold ${(student.average || 0) > 80 ? 'text-green-600' : (student.average || 0) > 60 ? 'text-yellow-600' : 'text-red-600'}">${student.average || 0}%</span></td>
                <td class="px-4 py-3 text-right">
                    <button onclick="viewStudentDetails('${student.id}')" class="p-2 hover:bg-accent rounded-lg"><i data-lucide="eye" class="h-4 w-4"></i></button>
                    <button onclick="copyElimuid('${student.elimuid}')" class="p-2 hover:bg-accent rounded-lg"><i data-lucide="copy" class="h-4 w-4"></i></button>
                </td>
            </tr>`;
        }).join('')}
    `;
}

// View student details
async function viewStudentDetails(studentId) {
    showLoading();
    try {
        const students = await loadMyStudents();
        const student = students.find(s => s.id == studentId);
        if (!student) { showToast('Student not found', 'error'); return; }
        showStudentDetailsModal(student);
    } catch (error) {
        showToast('Failed to load student details', 'error');
    } finally {
        hideLoading();
    }
}

// Show student details modal
function showStudentDetailsModal(student) {
    let modal = document.getElementById('student-details-modal');
    if (!modal) {
        createStudentDetailsModal();
        modal = document.getElementById('student-details-modal');
    }
    const content = document.getElementById('student-details-content');
    if (content) content.innerHTML = getStudentDetailsHTML(student);
    modal.classList.remove('hidden');
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

// Create student details modal
function createStudentDetailsModal() {
    const modalHTML = `<div id="student-details-modal" class="fixed inset-0 z-50 hidden"><div class="absolute inset-0 bg-black/50" onclick="closeStudentDetailsModal()"></div><div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4"><div class="rounded-xl border bg-card p-6 shadow-xl animate-fade-in"><div class="flex justify-between items-center mb-4"><h3 class="text-lg font-semibold">Student Details</h3><button onclick="closeStudentDetailsModal()" class="p-2 hover:bg-accent rounded-lg"><i data-lucide="x" class="h-5 w-5"></i></button></div><div class="modal-content space-y-4" id="student-details-content"></div></div></div></div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Get student details HTML
function getStudentDetailsHTML(student) {
    const user = student.User || {};
    return `<div class="space-y-4"><div class="flex items-center gap-4"><div class="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center"><span class="font-medium text-green-700 text-xl">${getInitials(user.name)}</span></div><div><h4 class="font-medium text-lg">${user.name || 'N/A'}</h4><p class="text-sm text-muted-foreground">${user.email || 'No email'}</p></div></div><div class="border-t pt-4"><div class="grid grid-cols-2 gap-3 text-sm"><div><p class="text-muted-foreground">ELIMUID</p><p class="font-mono text-xs bg-muted px-2 py-1 rounded inline-block">${student.elimuid || 'N/A'}</p></div><div><p class="text-muted-foreground">Grade</p><p class="font-medium">${student.grade || 'N/A'}</p></div><div><p class="text-muted-foreground">Gender</p><p class="font-medium">${student.gender || 'Not specified'}</p></div><div><p class="text-muted-foreground">Date of Birth</p><p class="font-medium">${student.dateOfBirth ? formatDate(student.dateOfBirth) : 'Not specified'}</p></div></div></div><div class="border-t pt-4"><h4 class="font-medium mb-2">Parent Information</h4><p class="text-sm">Parent email: ${student.parentEmail || 'Not provided'}</p></div><div class="flex justify-end gap-2 pt-4 border-t"><button onclick="closeStudentDetailsModal()" class="px-4 py-2 text-sm border rounded-lg hover:bg-accent">Close</button><button onclick="copyElimuid('${student.elimuid}')" class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2"><i data-lucide="copy" class="h-4 w-4"></i> Copy</button></div></div>`;
}

// Close student details modal
function closeStudentDetailsModal() {
    const modal = document.getElementById('student-details-modal');
    if (modal) modal.classList.add('hidden');
}

// Copy ELIMUID to clipboard
function copyElimuid(elimuid) {
    navigator.clipboard.writeText(elimuid).then(() => showToast('✅ ELIMUID copied', 'success')).catch(() => showToast('Failed to copy', 'error'));
}

// ============ TASK MANAGEMENT ============

// Load teacher tasks
async function loadTeacherTasks() {
    try {
        const teacherId = getCurrentUser()?.id;
        const stored = localStorage.getItem(`tasks_${teacherId}`);
        return stored ? JSON.parse(stored) : [];
    } catch { return []; }
}

// Save tasks
async function saveTeacherTasks(tasks) {
    const teacherId = getCurrentUser()?.id;
    localStorage.setItem(`tasks_${teacherId}`, JSON.stringify(tasks));
}

// Add teacher task
function addTeacherTask() {
    let modal = document.getElementById('add-task-modal');
    if (!modal) {
        createAddTaskModal();
        modal = document.getElementById('add-task-modal');
    }
    modal.classList.remove('hidden');
}

// Create add task modal
function createAddTaskModal() {
    const modalHTML = `<div id="add-task-modal" class="fixed inset-0 z-50 hidden"><div class="absolute inset-0 bg-black/50" onclick="closeAddTaskModal()"></div><div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4"><div class="rounded-xl border bg-card p-6 shadow-xl animate-fade-in"><h3 class="text-lg font-semibold mb-4">Add New Task</h3><div class="space-y-4"><div><label class="block text-sm font-medium mb-1">Task Title *</label><input type="text" id="task-title" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" required></div><div><label class="block text-sm font-medium mb-1">Description</label><textarea id="task-description" rows="3" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"></textarea></div><div><label class="block text-sm font-medium mb-1">Due Date</label><input type="date" id="task-due-date" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"></div><div><label class="block text-sm font-medium mb-1">Priority</label><select id="task-priority" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"><option value="low">Low</option><option value="medium" selected>Medium</option><option value="high">High</option><option value="urgent">Urgent</option></select></div></div><div class="flex justify-end gap-2 mt-6"><button onclick="closeAddTaskModal()" class="px-4 py-2 text-sm border rounded-lg hover:bg-accent">Cancel</button><button onclick="handleAddTask()" class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Add Task</button></div></div></div></div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Close add task modal
function closeAddTaskModal() {
    const modal = document.getElementById('add-task-modal');
    if (modal) modal.classList.add('hidden');
}

// Handle add task
async function handleAddTask() {
    const title = document.getElementById('task-title')?.value;
    if (!title) { showToast('Task title is required', 'error'); return; }
    
    const tasks = await loadTeacherTasks();
    tasks.push({
        id: Date.now(),
        title,
        description: document.getElementById('task-description')?.value,
        dueDate: document.getElementById('task-due-date')?.value,
        priority: document.getElementById('task-priority')?.value,
        completed: false,
        createdAt: new Date().toISOString()
    });
    await saveTeacherTasks(tasks);
    showToast('✅ Task added', 'success');
    closeAddTaskModal();
    if (currentSection === 'tasks') await renderTeacherTasks();
}

// Render teacher tasks
async function renderTeacherTasks() {
    const tasks = await loadTeacherTasks();
    const pending = tasks.filter(t => !t.completed);
    const completed = tasks.filter(t => t.completed);
    
    return `<div class="space-y-6"><div class="flex justify-between"><h2 class="text-2xl font-bold">My Tasks</h2><button onclick="addTeacherTask()" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg"><i data-lucide="plus" class="h-4 w-4 mr-2"></i>New Task</button></div><div class="grid gap-4 md:grid-cols-2"><div class="rounded-xl border bg-card p-6"><h3 class="font-semibold mb-4">Pending (${pending.length})</h3><div class="space-y-2">${pending.length ? pending.map(t => `<div class="flex items-center gap-3 p-3 border rounded-lg"><input type="checkbox" onchange="toggleTask(${t.id}, this.checked)" class="rounded"><div><p class="font-medium">${t.title}</p>${t.dueDate ? `<p class="text-xs text-muted-foreground">Due: ${formatDate(t.dueDate)}</p>` : ''}</div></div>`).join('') : '<p class="text-center text-muted-foreground py-4">No pending tasks</p>'}</div></div><div class="rounded-xl border bg-card p-6"><h3 class="font-semibold mb-4">Completed (${completed.length})</h3><div class="space-y-2">${completed.length ? completed.map(t => `<div class="flex items-center gap-3 p-3 border rounded-lg bg-muted/20"><input type="checkbox" checked onchange="toggleTask(${t.id}, this.checked)" class="rounded"><div><p class="font-medium line-through text-muted-foreground">${t.title}</p></div></div>`).join('') : '<p class="text-center text-muted-foreground py-4">No completed tasks</p>'}</div></div></div></div>`;
}

// Toggle task completion
async function toggleTask(taskId, completed) {
    const tasks = await loadTeacherTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = completed;
        await saveTeacherTasks(tasks);
        showToast(completed ? '✅ Task completed' : 'Task reopened', 'info');
        if (currentSection === 'tasks') document.getElementById('dashboard-content').innerHTML = await renderTeacherTasks();
    }
}

// ============ ATTENDANCE ============

// Render attendance page
async function renderTeacherAttendance() {
    const students = await loadMyStudents();
    return `<div class="space-y-6"><div class="flex justify-between"><h2 class="text-2xl font-bold">Take Attendance</h2><span class="text-sm font-medium">${new Date().toLocaleDateString()}</span></div><div class="rounded-xl border bg-card overflow-hidden"><div class="p-4 border-b bg-muted/30 flex justify-between"><div class="flex gap-4"><span class="flex items-center gap-2"><span class="h-3 w-3 bg-green-500 rounded-full"></span>Present</span><span class="flex items-center gap-2"><span class="h-3 w-3 bg-red-500 rounded-full"></span>Absent</span><span class="flex items-center gap-2"><span class="h-3 w-3 bg-yellow-500 rounded-full"></span>Late</span></div><button onclick="saveAttendance()" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Save</button></div><div class="overflow-x-auto"><table class="w-full text-sm"><thead class="bg-muted/50"><tr><th class="px-4 py-3 text-left">Student</th><th class="px-4 py-3 text-left">ELIMUID</th><th class="px-4 py-3 text-center">Status</th><th class="px-4 py-3 text-left">Notes</th></tr></thead><tbody class="divide-y">${students.map(s => `<tr data-student-id="${s.id}"><td class="px-4 py-3"><div class="flex items-center gap-3"><div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center"><span class="font-medium text-blue-700 text-sm">${getInitials(s.User?.name)}</span></div><span class="font-medium">${s.User?.name || 'Unknown'}</span></div></td><td class="px-4 py-3"><span class="font-mono text-xs bg-muted px-2 py-1 rounded">${s.elimuid}</span></td><td class="px-4 py-3 text-center"><select class="attendance-status rounded-lg border border-input bg-background px-3 py-1 text-sm"><option value="present">Present</option><option value="absent">Absent</option><option value="late">Late</option><option value="sick">Sick</option></select></td><td class="px-4 py-3"><input type="text" class="attendance-note w-full rounded border-0 bg-transparent text-sm" placeholder="Add note..."></td></tr>`).join('')}${!students.length ? '<tr><td colspan="4" class="px-4 py-8 text-center text-muted-foreground">No students in your class</td></tr>' : ''}</tbody></table></div></div></div>`;
}

// Save attendance
async function saveAttendance() {
    const rows = document.querySelectorAll('[data-student-id]');
    const data = [];
    rows.forEach(row => {
        const status = row.querySelector('.attendance-status')?.value;
        if (status) data.push({ studentId: parseInt(row.dataset.studentId), date: new Date().toISOString().split('T')[0], status, reason: row.querySelector('.attendance-note')?.value });
    });
    if (!data.length) { showToast('No data to save', 'error'); return; }
    showLoading();
    try {
        for (const d of data) await api.teacher.takeAttendance(d);
        showToast(`✅ Saved ${data.length} records`, 'success');
    } catch (e) { showToast('Failed to save', 'error'); } finally { hideLoading(); }
}

// ============ DUTY SWAP ============

// Show duty swap modal
async function showDutySwapModal() {
    let modal = document.getElementById('duty-swap-modal');
    if (!modal) {
        createDutySwapModal();
        modal = document.getElementById('duty-swap-modal');
    }
    // Load teachers
    try {
        const teachers = await api.admin.getTeachers();
        const select = document.getElementById('swap-target');
        if (select) {
            select.innerHTML = '<option value="">Any available teacher</option>' + (teachers.data || []).filter(t => t.User?.id !== getCurrentUser()?.id).map(t => `<option value="${t.User?.id}">${t.User?.name}</option>`).join('');
        }
    } catch (e) { console.error('Failed to load teachers', e); }
    modal.classList.remove('hidden');
}

// Create duty swap modal
function createDutySwapModal() {
    const modalHTML = `<div id="duty-swap-modal" class="fixed inset-0 z-50 hidden"><div class="absolute inset-0 bg-black/50" onclick="closeDutySwapModal()"></div><div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4"><div class="rounded-xl border bg-card p-6 shadow-xl animate-fade-in"><h3 class="text-lg font-semibold mb-4">Request Duty Swap</h3><div class="space-y-4"><div><label class="block text-sm font-medium mb-1">Date</label><input type="date" id="swap-date" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" required></div><div><label class="block text-sm font-medium mb-1">Reason</label><textarea id="swap-reason" rows="3" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" required></textarea></div><div><label class="block text-sm font-medium mb-1">Swap With</label><select id="swap-target" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"><option value="">Loading...</option></select></div></div><div class="flex justify-end gap-2 mt-6"><button onclick="closeDutySwapModal()" class="px-4 py-2 text-sm border rounded-lg hover:bg-accent">Cancel</button><button onclick="handleDutySwapRequest()" class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Submit</button></div></div></div></div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Close duty swap modal
function closeDutySwapModal() {
    const modal = document.getElementById('duty-swap-modal');
    if (modal) modal.classList.add('hidden');
}

// Handle duty swap request
async function handleDutySwapRequest() {
    const date = document.getElementById('swap-date')?.value;
    const reason = document.getElementById('swap-reason')?.value;
    if (!date || !reason) { showToast('Date and reason required', 'error'); return; }
    showLoading();
    try {
        await api.duty.requestSwap({ dutyDate: date, reason, targetTeacherId: document.getElementById('swap-target')?.value || null });
        showToast('✅ Swap request sent', 'success');
        closeDutySwapModal();
    } catch (e) { showToast(e.message || 'Failed', 'error'); } finally { hideLoading(); }
}

// ============ MARKS ============

// Enter marks
async function enterMarks(marksData) {
    showLoading();
    try {
        await api.teacher.enterMarks(marksData);
        showToast('✅ Marks saved', 'success');
    } catch (e) { showToast(e.message || 'Failed', 'error'); throw e; } finally { hideLoading(); }
}

// ============ COMMENTS ============

// Add comment
async function addComment(studentId, comment) {
    if (!comment) { showToast('Comment required', 'error'); return; }
    showLoading();
    try {
        await api.teacher.addComment({ studentId, comment });
        showToast('✅ Comment sent', 'success');
    } catch (e) { showToast(e.message || 'Failed', 'error'); } finally { hideLoading(); }
}
// Simple redirect - don't overwrite admin functions
if (typeof window.viewStudent === 'function') {
    // Admin version exists, don't overwrite
    console.log('Admin viewStudent exists, keeping it');
} else {
    // No admin version, use teacher version
    window.viewStudent = viewStudentDetails;
}

// ============ EXPORT ============

window.showAddStudentModal = showAddStudentModal;
window.closeAddStudentModal = closeAddStudentModal;
window.handleAddStudentModal = handleAddStudentModal;
window.addStudent = addStudent;
window.loadMyStudents = loadMyStudents;
window.refreshMyStudents = refreshMyStudents;
window.renderStudentsTable = renderStudentsTable;
window.viewStudentDetails = viewStudentDetails;
window.closeStudentDetailsModal = closeStudentDetailsModal;
window.copyElimuid = copyElimuid;
window.addTeacherTask = addTeacherTask;
window.renderTeacherTasks = renderTeacherTasks;
window.toggleTask = toggleTask;
window.closeAddTaskModal = closeAddTaskModal;
window.handleAddTask = handleAddTask;
window.renderTeacherAttendance = renderTeacherAttendance;
window.saveAttendance = saveAttendance;
window.showDutySwapModal = showDutySwapModal;
window.closeDutySwapModal = closeDutySwapModal;
window.handleDutySwapRequest = handleDutySwapRequest;
window.enterMarks = enterMarks;
window.addComment = addComment;
