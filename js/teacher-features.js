// teacher-features.js - Complete file with all teacher functions including delete, auto-class assignment, attendance, and tasks

// ============ GLOBAL VARIABLES ============
let teacherClass = null;
let refreshInterval = null;
let taskList = [];

// ============ INITIALIZATION ============
async function initTeacherFeatures() {
    // Get teacher's assigned class from user data
    const user = getCurrentUser();
    if (user && user.teacherClass) {
        teacherClass = user.teacherClass;
    } else {
        // Try to fetch from API
        try {
            const response = await api.teacher.getMyProfile();
            if (response.success && response.data) {
                teacherClass = response.data.classTeacher;
                // Update user object
                user.teacherClass = teacherClass;
                localStorage.setItem('user', JSON.stringify(user));
            }
        } catch (error) {
            console.error('Failed to fetch teacher class:', error);
        }
    }
    
    // Load tasks from localStorage
    loadTasks();
    
    // Start auto-refresh
    startAutoRefresh();
}

// ============ AUTO-REFRESH ============
function startAutoRefresh() {
    // Clear existing interval
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
    
    // Set new interval (30 seconds)
    refreshInterval = setInterval(async () => {
        if (document.getElementById('my-students-table') && 
            !document.getElementById('my-students-table').classList.contains('hidden')) {
            console.log('🔄 Auto-refreshing data...');
            await refreshMyStudents();
            await loadTeacherMessages();
            await loadTasks();
        }
    }, 30000);
}

function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
}

// ============ STUDENT MANAGEMENT ============

// Show add student modal
function showAddStudentModal() {
    let modal = document.getElementById('add-student-modal');
    
    if (!modal) {
        createAddStudentModal();
        modal = document.getElementById('add-student-modal');
    }
    
    if (modal) {
        modal.classList.remove('hidden');
    }
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
                        <div>
                            <label class="block text-sm font-medium mb-1">Full Name *</label>
                            <input type="text" id="modal-student-name" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" required>
                        </div>
                        <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                            <p class="text-xs text-blue-600 dark:text-blue-400 flex items-start gap-2">
                                <i data-lucide="info" class="h-4 w-4 flex-shrink-0 mt-0.5"></i>
                                <span>Student will be automatically assigned to your class: <strong id="teacher-class-display"></strong></span>
                            </p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Parent Email</label>
                            <input type="email" id="modal-parent-email" placeholder="parent@example.com" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Date of Birth</label>
                            <input type="date" id="modal-student-dob" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Gender</label>
                            <select id="modal-student-gender" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                            <p class="text-xs text-blue-600 dark:text-blue-400 flex items-start gap-2">
                                <i data-lucide="info" class="h-4 w-4 flex-shrink-0 mt-0.5"></i>
                                <span>Default password: <strong>Student123!</strong> Student will be prompted to change on first login.</span>
                            </p>
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
    
    // Update the teacher class display
    const displayEl = document.getElementById('teacher-class-display');
    if (displayEl && teacherClass) {
        displayEl.textContent = teacherClass;
    }
}

// Close add student modal
function closeAddStudentModal() {
    const modal = document.getElementById('add-student-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.getElementById('modal-student-name') && (document.getElementById('modal-student-name').value = '');
        document.getElementById('modal-parent-email') && (document.getElementById('modal-parent-email').value = '');
        document.getElementById('modal-student-dob') && (document.getElementById('modal-student-dob').value = '');
        document.getElementById('modal-student-gender') && (document.getElementById('modal-student-gender').value = '');
    }
}

// Handle add student from modal - WITH AUTO CLASS ASSIGNMENT
async function handleAddStudentModal() {
    // Get current teacher's assigned class from user data
    const user = getCurrentUser();
    
    if (!teacherClass && user?.teacherClass) {
        teacherClass = user.teacherClass;
    }
    
    if (!teacherClass) {
        showToast('No class assigned to you. Please contact admin.', 'error');
        return;
    }
    
    const studentData = {
        name: document.getElementById('modal-student-name')?.value,
        grade: teacherClass, // Auto-assign teacher's class
        parentEmail: document.getElementById('modal-parent-email')?.value,
        dateOfBirth: document.getElementById('modal-student-dob')?.value,
        gender: document.getElementById('modal-student-gender')?.value
    };
    
    if (!studentData.name) {
        showToast('Student name is required', 'error');
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
        
        if (response.success) {
            showToast(`✅ Student added! ELIMUID: ${response.data.elimuid}`, 'success');
            
            // Refresh teacher's view
            await refreshMyStudents();
            
            // Also notify admin dashboard to refresh (if open)
            if (typeof window.refreshStudentsList === 'function') {
                setTimeout(() => {
                    window.refreshStudentsList();
                }, 500);
            }
            
            // Trigger a custom event for other tabs
            window.dispatchEvent(new CustomEvent('student-added', { 
                detail: { student: response.data }
            }));
        }
        
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
        showToast('Failed to load students', 'error');
        return [];
    }
}

// Refresh my students list
async function refreshMyStudents() {
    const container = document.getElementById('my-students-table');
    if (!container) return;
    
    const students = await loadMyStudents();
    
    if (students && students.length > 0) {
        container.innerHTML = renderStudentsTable(students);
    } else {
        container.innerHTML = '<div class="text-center py-8 text-muted-foreground">No students yet. Click "Add Student" to get started.</div>';
    }
    
    updateStats(students);
    
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

// Update stats with null checks
function updateStats(students) {
    const countElement = document.getElementById('my-students-count');
    if (countElement) {
        countElement.textContent = students ? students.length : 0;
    }
    
    const classesElement = document.getElementById('my-classes-count');
    if (classesElement && students) {
        const uniqueClasses = [...new Set(students.map(s => s.grade).filter(Boolean))];
        classesElement.textContent = uniqueClasses.length;
    }
    
    const avgElement = document.getElementById('class-average');
    if (avgElement && students && students.length > 0) {
        const total = students.reduce((sum, s) => sum + (s.average || 0), 0);
        const avg = Math.round(total / students.length);
        avgElement.textContent = avg + '%';
    }
    
    const attendanceElement = document.getElementById('attendance-today');
    if (attendanceElement && students) {
        // Calculate today's attendance
        const today = new Date().toISOString().split('T')[0];
        const presentToday = students.filter(s => {
            const attendance = s.attendanceRecords || [];
            return attendance.some(a => a.date === today && a.status === 'present');
        }).length;
        attendanceElement.textContent = `${presentToday}/${students.length}`;
    }
}

// Render students table with delete button
function renderStudentsTable(students) {
    if (!students || students.length === 0) {
        return '<div class="text-center py-8 text-muted-foreground">No students found</div>';
    }
    
    return `
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-muted/50">
                    <tr>
                        <th class="px-4 py-3 text-left font-medium">Student</th>
                        <th class="px-4 py-3 text-left font-medium">Class</th>
                        <th class="px-4 py-3 text-left font-medium">ELIMUID</th>
                        <th class="px-4 py-3 text-left font-medium">Attendance</th>
                        <th class="px-4 py-3 text-left font-medium">Average</th>
                        <th class="px-4 py-3 text-center font-medium">Status</th>
                        <th class="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    ${students.map(student => {
                        const user = student.User || {};
                        const status = student.status || 'active';
                        const statusColor = getStatusColor(status);
                        
                        // Calculate attendance percentage
                        const attendanceRecords = student.attendanceRecords || [];
                        const presentCount = attendanceRecords.filter(a => a.status === 'present').length;
                        const attendancePercent = attendanceRecords.length > 0 
                            ? Math.round((presentCount / attendanceRecords.length) * 100) 
                            : 95;
                        
                        return `
                            <tr class="hover:bg-accent/50 transition-colors" data-student-id="${student.id}">
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-3">
                                        <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                            <span class="font-medium text-blue-700 text-sm">${getInitials(user.name)}</span>
                                        </div>
                                        <span class="font-medium">${user.name || 'Unknown'}</span>
                                    </div>
                                </td>
                                <td class="px-4 py-3">${student.grade || 'N/A'}</td>
                                <td class="px-4 py-3">
                                    <span class="font-mono text-xs bg-muted px-2 py-1 rounded">${student.elimuid || 'N/A'}</span>
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-2">
                                        <div class="h-2 w-16 rounded-full bg-muted overflow-hidden">
                                            <div class="h-full w-[${attendancePercent}%] bg-green-500 rounded-full"></div>
                                        </div>
                                        <span class="text-xs">${attendancePercent}%</span>
                                    </div>
                                </td>
                                <td class="px-4 py-3">
                                    <span class="font-semibold ${(student.average || 0) > 80 ? 'text-green-600' : (student.average || 0) > 60 ? 'text-yellow-600' : 'text-red-600'}">${student.average || 0}%</span>
                                </td>
                                <td class="px-4 py-3 text-center">
                                    <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColor}">
                                        ${status}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-right">
                                    <div class="flex items-center justify-end gap-1">
                                        <button onclick="copyElimuid('${student.elimuid}')" class="p-2 hover:bg-accent rounded-lg" title="Copy ELIMUID">
                                            <i data-lucide="copy" class="h-4 w-4"></i>
                                        </button>
                                        <button onclick="viewStudentDetails('${student.id}')" class="p-2 hover:bg-accent rounded-lg" title="View Details">
                                            <i data-lucide="eye" class="h-4 w-4"></i>
                                        </button>
                                        <button onclick="deleteStudent('${student.id}', '${user.name || 'Unknown'}')" 
                                                class="p-2 hover:bg-red-100 rounded-lg text-red-600" title="Delete Student">
                                            <i data-lucide="trash-2" class="h-4 w-4"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Delete student from class
async function deleteStudent(studentId, studentName) {
    if (!confirm(`⚠️ Are you sure you want to remove ${studentName} from your class? This action cannot be undone.`)) {
        return;
    }
    
    showLoading();
    try {
        const response = await api.teacher.deleteStudent(studentId);
        
        if (response.success) {
            showToast(`✅ ${studentName} removed from class`, 'success');
            await refreshMyStudents();
            
            // Notify other dashboards
            window.dispatchEvent(new CustomEvent('student-deleted', { 
                detail: { studentId, studentName }
            }));
        }
    } catch (error) {
        showToast(error.message || 'Failed to delete student', 'error');
    } finally {
        hideLoading();
    }
}

// ============ STUDENT DETAILS MODAL ============

async function viewStudentDetails(studentId) {
    showLoading();
    try {
        const students = await loadMyStudents();
        const student = students.find(s => s.id == studentId);
        
        if (!student) {
            showToast('Student not found', 'error');
            return;
        }
        
        showStudentDetailsModal(student);
    } catch (error) {
        console.error('Error viewing student:', error);
        showToast('Failed to load student details', 'error');
    } finally {
        hideLoading();
    }
}

function showStudentDetailsModal(student) {
    let modal = document.getElementById('student-details-modal');
    
    if (!modal) {
        createStudentDetailsModal();
        modal = document.getElementById('student-details-modal');
    }
    
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.innerHTML = getStudentDetailsHTML(student);
    }
    
    modal.classList.remove('hidden');
    
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

function createStudentDetailsModal() {
    const modalHTML = `
        <div id="student-details-modal" class="fixed inset-0 z-50 hidden">
            <div class="absolute inset-0 bg-black/50" onclick="closeStudentDetailsModal()"></div>
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4">
                <div class="rounded-xl border bg-card p-6 shadow-xl animate-fade-in">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold">Student Details</h3>
                        <button onclick="closeStudentDetailsModal()" class="p-2 hover:bg-accent rounded-lg">
                            <i data-lucide="x" class="h-5 w-5"></i>
                        </button>
                    </div>
                    <div class="modal-content space-y-4">
                        <!-- Content will be filled dynamically -->
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function getStudentDetailsHTML(student) {
    const user = student.User || {};
    const status = student.status || 'active';
    const statusColor = getStatusColor(status);
    
    return `
        <div class="space-y-4">
            <div class="flex items-center gap-4">
                <div class="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                    <span class="font-medium text-green-700 text-xl">${getInitials(user.name)}</span>
                </div>
                <div>
                    <h4 class="font-medium text-lg">${user.name || 'N/A'}</h4>
                    <p class="text-sm text-muted-foreground">${user.email || 'No email'}</p>
                </div>
            </div>
            
            <div class="border-t pt-4">
                <div class="grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <p class="text-muted-foreground">ELIMUID</p>
                        <p class="font-mono text-xs bg-muted px-2 py-1 rounded inline-block">${student.elimuid || 'N/A'}</p>
                    </div>
                    <div>
                        <p class="text-muted-foreground">Grade</p>
                        <p class="font-medium">${student.grade || 'N/A'}</p>
                    </div>
                    <div>
                        <p class="text-muted-foreground">Gender</p>
                        <p class="font-medium">${student.gender || 'Not specified'}</p>
                    </div>
                    <div>
                        <p class="text-muted-foreground">Date of Birth</p>
                        <p class="font-medium">${student.dateOfBirth ? formatDate(student.dateOfBirth) : 'Not specified'}</p>
                    </div>
                    <div>
                        <p class="text-muted-foreground">Status</p>
                        <p><span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColor}">${status}</span></p>
                    </div>
                    <div>
                        <p class="text-muted-foreground">Enrolled</p>
                        <p class="font-medium">${student.enrollmentDate ? formatDate(student.enrollmentDate) : 'N/A'}</p>
                    </div>
                </div>
            </div>
            
            <div class="border-t pt-4">
                <h4 class="font-medium mb-2">Parent Information</h4>
                ${student.parentEmail ? 
                    `<p class="text-sm">Parent Email: ${student.parentEmail}</p>` : 
                    '<p class="text-sm text-muted-foreground">No parent email provided</p>'}
            </div>
            
            <div class="border-t pt-4">
                <h4 class="font-medium mb-2">Academic Information</h4>
                <div class="grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <p class="text-muted-foreground">Attendance</p>
                        <p class="font-medium">${student.attendance || 95}%</p>
                    </div>
                    <div>
                        <p class="text-muted-foreground">Average Score</p>
                        <p class="font-medium">${student.average || 0}%</p>
                    </div>
                </div>
            </div>
            
            <div class="flex justify-end gap-2 pt-4 border-t">
                <button onclick="closeStudentDetailsModal()" class="px-4 py-2 text-sm border rounded-lg hover:bg-accent">Close</button>
                <button onclick="copyElimuid('${student.elimuid}')" class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
                    <i data-lucide="copy" class="h-4 w-4"></i>
                    Copy ELIMUID
                </button>
            </div>
        </div>
    `;
}

function closeStudentDetailsModal() {
    const modal = document.getElementById('student-details-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// ============ ATTENDANCE MANAGEMENT ============

// Save attendance - WITH AUTO REFRESH
async function saveAttendance() {
    const rows = document.querySelectorAll('[data-student-id]');
    const attendanceData = [];
    
    rows.forEach(row => {
        const studentId = row.dataset.studentId;
        const status = row.querySelector('.attendance-status')?.value;
        const note = row.querySelector('.attendance-note')?.value;
        
        if (status) {
            attendanceData.push({
                studentId: parseInt(studentId),
                date: new Date().toISOString().split('T')[0],
                status,
                reason: note
            });
        }
    });
    
    if (attendanceData.length === 0) {
        showToast('No attendance data to save', 'error');
        return;
    }
    
    showLoading();
    try {
        for (const data of attendanceData) {
            await takeAttendance(data);
        }
        showToast(`✅ Saved ${attendanceData.length} attendance records`, 'success');
        
        // Refresh all relevant data
        await refreshMyStudents(); // Refresh student list with updated attendance
        
        // Dispatch event for other tabs
        window.dispatchEvent(new CustomEvent('attendance-updated', {
            detail: { date: new Date().toISOString().split('T')[0], count: attendanceData.length }
        }));
        
    } catch (error) {
        console.error('Attendance save error:', error);
        showToast('Failed to save attendance', 'error');
    } finally {
        hideLoading();
    }
}

// Take attendance
async function takeAttendance(attendanceData) {
    try {
        const response = await api.teacher.takeAttendance(attendanceData);
        return response;
    } catch (error) {
        throw error;
    }
}

// ============ TASK MANAGEMENT - FULLY FUNCTIONAL ============

// Load tasks from localStorage
function loadTasks() {
    try {
        const savedTasks = localStorage.getItem('teacherTasks');
        if (savedTasks) {
            taskList = JSON.parse(savedTasks);
        } else {
            taskList = [];
        }
        renderTasks();
    } catch (error) {
        console.error('Failed to load tasks:', error);
        taskList = [];
    }
}

// Save tasks to localStorage
function saveTasks() {
    try {
        localStorage.setItem('teacherTasks', JSON.stringify(taskList));
        renderTasks();
    } catch (error) {
        console.error('Failed to save tasks:', error);
        showToast('Failed to save task', 'error');
    }
}

// Add new task
async function addTeacherTask() {
    // Show task creation modal
    showAddTaskModal();
}

// Show add task modal
function showAddTaskModal() {
    let modal = document.getElementById('add-task-modal');
    
    if (!modal) {
        createAddTaskModal();
        modal = document.getElementById('add-task-modal');
    }
    
    if (modal) {
        modal.classList.remove('hidden');
    }
}

// Create add task modal
function createAddTaskModal() {
    const modalHTML = `
        <div id="add-task-modal" class="fixed inset-0 z-50 hidden">
            <div class="absolute inset-0 bg-black/50" onclick="closeAddTaskModal()"></div>
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4">
                <div class="rounded-xl border bg-card p-6 shadow-xl animate-fade-in">
                    <h3 class="text-lg font-semibold mb-4">Create New Task</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Task Title *</label>
                            <input type="text" id="task-title" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Description</label>
                            <textarea id="task-description" rows="3" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="Enter task details..."></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Due Date</label>
                            <input type="date" id="task-due" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Priority</label>
                            <select id="task-priority" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                                <option value="low">Low</option>
                                <option value="medium" selected>Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex justify-end gap-2 mt-6">
                        <button onclick="closeAddTaskModal()" class="px-4 py-2 text-sm border rounded-lg hover:bg-accent">Cancel</button>
                        <button onclick="saveNewTask()" class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Create Task</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Close add task modal
function closeAddTaskModal() {
    const modal = document.getElementById('add-task-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.getElementById('task-title') && (document.getElementById('task-title').value = '');
        document.getElementById('task-description') && (document.getElementById('task-description').value = '');
        document.getElementById('task-due') && (document.getElementById('task-due').value = '');
        document.getElementById('task-priority') && (document.getElementById('task-priority').value = 'medium');
    }
}

// Save new task
function saveNewTask() {
    const title = document.getElementById('task-title')?.value;
    const description = document.getElementById('task-description')?.value;
    const dueDate = document.getElementById('task-due')?.value;
    const priority = document.getElementById('task-priority')?.value;
    
    if (!title) {
        showToast('Task title is required', 'error');
        return;
    }
    
    const newTask = {
        id: Date.now().toString(),
        title,
        description,
        dueDate,
        priority,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    taskList.unshift(newTask);
    saveTasks();
    closeAddTaskModal();
    showToast('✅ Task created successfully', 'success');
}

// Toggle task completion
function toggleTask(taskId) {
    const task = taskList.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        
        if (task.completed) {
            showToast(`✅ Task "${task.title}" completed`, 'success');
        }
    }
}

// Delete task
function deleteTask(taskId) {
    const task = taskList.find(t => t.id === taskId);
    if (!task) return;
    
    if (!confirm(`Delete task "${task.title}"?`)) return;
    
    taskList = taskList.filter(t => t.id !== taskId);
    saveTasks();
    showToast('Task deleted', 'info');
}

// Render tasks in dashboard
function renderTasks() {
    const pendingContainer = document.getElementById('pending-tasks-container');
    const completedContainer = document.getElementById('completed-tasks-container');
    
    if (!pendingContainer && !completedContainer) return;
    
    const pendingTasks = taskList.filter(t => !t.completed);
    const completedTasks = taskList.filter(t => t.completed);
    
    // Update pending tasks count
    const tasksElement = document.getElementById('pending-tasks');
    if (tasksElement) {
        tasksElement.textContent = pendingTasks.length;
    }
    
    // Render pending tasks
    if (pendingContainer) {
        if (pendingTasks.length === 0) {
            pendingContainer.innerHTML = '<div class="text-center py-4 text-muted-foreground">No pending tasks</div>';
        } else {
            pendingContainer.innerHTML = pendingTasks.map(task => `
                <div class="flex items-center gap-3 p-3 hover:bg-accent/50 rounded-lg border ${getPriorityBorder(task.priority)}" data-task-id="${task.id}">
                    <input type="checkbox" class="rounded" onchange="toggleTask('${task.id}')" ${task.completed ? 'checked' : ''}>
                    <div class="flex-1">
                        <p class="font-medium">${task.title}</p>
                        ${task.description ? `<p class="text-xs text-muted-foreground">${task.description}</p>` : ''}
                        <div class="flex items-center gap-2 mt-1">
                            ${task.dueDate ? `<span class="text-xs text-muted-foreground flex items-center gap-1"><i data-lucide="calendar" class="h-3 w-3"></i> ${formatDate(task.dueDate)}</span>` : ''}
                            <span class="text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}">${task.priority}</span>
                        </div>
                    </div>
                    <button onclick="deleteTask('${task.id}')" class="p-1 hover:bg-red-100 rounded-lg text-red-600">
                        <i data-lucide="trash-2" class="h-4 w-4"></i>
                    </button>
                </div>
            `).join('');
        }
    }
    
    // Render completed tasks
    if (completedContainer) {
        if (completedTasks.length === 0) {
            completedContainer.innerHTML = '<div class="text-center py-4 text-muted-foreground">No completed tasks</div>';
        } else {
            completedContainer.innerHTML = completedTasks.map(task => `
                <div class="flex items-center gap-3 p-3 hover:bg-accent/50 rounded-lg opacity-75">
                    <input type="checkbox" class="rounded" checked disabled>
                    <div class="flex-1">
                        <p class="font-medium line-through text-muted-foreground">${task.title}</p>
                        <p class="text-xs text-muted-foreground">Completed</p>
                    </div>
                    <button onclick="deleteTask('${task.id}')" class="p-1 hover:bg-red-100 rounded-lg text-red-600">
                        <i data-lucide="trash-2" class="h-4 w-4"></i>
                    </button>
                </div>
            `).join('');
        }
    }
    
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

// Get priority color
function getPriorityColor(priority) {
    switch(priority) {
        case 'urgent': return 'bg-red-100 text-red-700';
        case 'high': return 'bg-orange-100 text-orange-700';
        case 'medium': return 'bg-yellow-100 text-yellow-700';
        case 'low': return 'bg-green-100 text-green-700';
        default: return 'bg-gray-100 text-gray-700';
    }
}

// Get priority border
function getPriorityBorder(priority) {
    switch(priority) {
        case 'urgent': return 'border-red-200';
        case 'high': return 'border-orange-200';
        case 'medium': return 'border-yellow-200';
        case 'low': return 'border-green-200';
        default: return 'border-gray-200';
    }
}

// ============ PARENT MESSAGING ============

async function loadTeacherMessages() {
    try {
        const response = await api.teacher.getConversations();
        const conversations = response.data || [];
        
        const container = document.getElementById('teacher-messages-list');
        const badge = document.getElementById('teacher-message-count-badge');
        
        if (!container) return;
        
        let totalUnread = 0;
        let html = '';
        
        if (conversations.length === 0) {
            html = `
                <div class="text-center text-muted-foreground py-8">
                    <i data-lucide="message-circle" class="h-12 w-12 mx-auto mb-3 opacity-50"></i>
                    <p>No messages from parents yet</p>
                </div>
            `;
        } else {
            conversations.forEach(conv => {
                totalUnread += conv.unreadCount || 0;
                
                html += `
                    <div class="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-all ${conv.unreadCount > 0 ? 'bg-primary/5 border-primary' : ''}"
                         onclick="openTeacherConversation('${conv.userId}')">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="font-medium">${conv.userName || 'Parent'}</p>
                                <p class="text-xs text-muted-foreground">${conv.studentName ? `about ${conv.studentName}` : ''}</p>
                                <p class="text-sm mt-1">${conv.lastMessage?.substring(0, 50) || ''}${conv.lastMessage?.length > 50 ? '...' : ''}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-xs text-muted-foreground">${timeAgo(conv.lastMessageTime)}</p>
                                ${conv.unreadCount > 0 ? 
                                    `<span class="bg-red-500 text-white text-xs rounded-full px-2 py-1 mt-1 inline-block">${conv.unreadCount}</span>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        
        if (badge) {
            badge.textContent = totalUnread;
            if (totalUnread > 0) badge.classList.remove('hidden');
        }
        
        container.innerHTML = html;
        
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
        
    } catch (error) {
        console.error('Load messages error:', error);
    }
}

// ============ MARKS MANAGEMENT ============

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

async function saveStudentGrade(button) {
    const row = button.closest('tr');
    const studentId = row.dataset.studentId;
    const subject = document.getElementById('grade-subject')?.value;
    const assessmentType = document.getElementById('grade-type')?.value;
    const score = row.querySelector('.student-score')?.value;
    const comment = row.querySelector('.student-comment')?.value;
    
    if (!subject || !score) {
        showToast('Please select subject and enter score', 'error');
        return;
    }
    
    const marksData = {
        studentId: parseInt(studentId),
        subject,
        assessmentType,
        score: parseInt(score),
        assessmentName: `${subject} ${assessmentType}`,
        date: new Date().toISOString().split('T')[0]
    };
    
    await enterMarks(marksData);
    
    if (comment) {
        await addComment(studentId, comment);
    }
}

function updateGradeDisplay(input, curriculum, level) {
    const row = input.closest('tr');
    const score = parseInt(input.value);
    const gradeSpan = row.querySelector('.student-grade');
    
    if (!isNaN(score) && score >= 0 && score <= 100) {
        let grade = '';
        let color = 'gray';
        
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

// ============ CSV UPLOAD ============

async function uploadMarksCSV(file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await api.teacher.uploadMarksCSV(formData, onProgress);
        showToast(`✅ Processed ${response.data.stats?.processed || 0} records`, 'success');
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to upload CSV', 'error');
        throw error;
    }
}

// ============ UTILITY FUNCTIONS ============

function copyElimuid(elimuid) {
    if (!elimuid) return showToast('No ELIMUID', 'error');
    navigator.clipboard.writeText(elimuid)
        .then(() => showToast('✅ Copied', 'success'))
        .catch(() => showToast('Failed to copy', 'error'));
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function getStatusColor(status) {
    switch(status?.toLowerCase()) {
        case 'active': return 'bg-green-100 text-green-700';
        case 'suspended': return 'bg-red-100 text-red-700';
        case 'graduated': return 'bg-blue-100 text-blue-700';
        case 'transferred': return 'bg-purple-100 text-purple-700';
        default: return 'bg-gray-100 text-gray-700';
    }
}

function timeAgo(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
        }
    }
    
    return 'just now';
}

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch {
        return null;
    }
}

// ============ CLEANUP ============
function cleanupTeacherFeatures() {
    stopAutoRefresh();
}

// ============ EXPORT FUNCTIONS ============

window.initTeacherFeatures = initTeacherFeatures;
window.cleanupTeacherFeatures = cleanupTeacherFeatures;
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
window.deleteStudent = deleteStudent;
window.saveAttendance = saveAttendance;
window.takeAttendance = takeAttendance;
window.loadTeacherMessages = loadTeacherMessages;
window.enterMarks = enterMarks;
window.saveStudentGrade = saveStudentGrade;
window.updateGradeDisplay = updateGradeDisplay;
window.addComment = addComment;
window.uploadMarksCSV = uploadMarksCSV;
window.addTeacherTask = addTeacherTask;
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;
window.renderTasks = renderTasks;
window.closeAddTaskModal = closeAddTaskModal;
window.saveNewTask = saveNewTask;
window.formatDate = formatDate;
window.getInitials = getInitials;
window.getStatusColor = getStatusColor;
window.timeAgo = timeAgo;
window.getCurrentUser = getCurrentUser;

// Auto-refresh on page load
document.addEventListener('DOMContentLoaded', function() {
    initTeacherFeatures();
    setTimeout(() => {
        refreshMyStudents();
        loadTeacherMessages();
        renderTasks();
    }, 500);
});
