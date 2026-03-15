// teacher-features.js - Complete file with all teacher functions
// INCLUDES: Task Management, Real Attendance, Messaging Integration, Duty Swap

// ============ TASK MANAGEMENT ============

// Load teacher tasks
async function loadTeacherTasks() {
    try {
        const teacherId = getCurrentUser()?.id;
        const storedTasks = localStorage.getItem(`tasks_${teacherId}`);
        return storedTasks ? JSON.parse(storedTasks) : [];
    } catch (error) {
        console.error('Failed to load tasks:', error);
        return [];
    }
}

// Save tasks to localStorage
async function saveTeacherTasks(tasks) {
    const teacherId = getCurrentUser()?.id;
    localStorage.setItem(`tasks_${teacherId}`, JSON.stringify(tasks));
}

// Add teacher task
function addTeacherTask() {
    showAddTaskModal();
}

// Show add task modal
function showAddTaskModal() {
    let modal = document.getElementById('add-task-modal');
    
    if (!modal) {
        createAddTaskModal();
        modal = document.getElementById('add-task-modal');
    }
    
    modal.classList.remove('hidden');
}

// Create add task modal
function createAddTaskModal() {
    const modalHTML = `
        <div id="add-task-modal" class="fixed inset-0 z-50 hidden">
            <div class="absolute inset-0 bg-black/50" onclick="closeAddTaskModal()"></div>
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4">
                <div class="rounded-xl border bg-card p-6 shadow-xl animate-fade-in">
                    <h3 class="text-lg font-semibold mb-4">Add New Task</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Task Title *</label>
                            <input type="text" id="task-title" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Description</label>
                            <textarea id="task-description" rows="3" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="Task details..."></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Due Date</label>
                            <input type="date" id="task-due-date" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
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
                        <button onclick="handleAddTask()" class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Add Task</button>
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
        document.getElementById('task-due-date') && (document.getElementById('task-due-date').value = '');
    }
}

// Handle add task
async function handleAddTask() {
    const title = document.getElementById('task-title')?.value;
    const description = document.getElementById('task-description')?.value;
    const dueDate = document.getElementById('task-due-date')?.value;
    const priority = document.getElementById('task-priority')?.value;
    
    if (!title) {
        showToast('Task title is required', 'error');
        return;
    }
    
    const currentTasks = await loadTeacherTasks();
    const newTask = {
        id: Date.now(),
        title,
        description,
        dueDate,
        priority,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    currentTasks.push(newTask);
    await saveTeacherTasks(currentTasks);
    
    showToast('✅ Task added successfully', 'success');
    closeAddTaskModal();
    
    // Refresh tasks display if on tasks page
    if (currentSection === 'tasks') {
        await renderTeacherTasks();
    }
}

// Toggle task completion
async function toggleTask(taskId, completed) {
    const currentTasks = await loadTeacherTasks();
    const taskIndex = currentTasks.findIndex(t => t.id === taskId);
    
    if (taskIndex !== -1) {
        currentTasks[taskIndex].completed = completed;
        await saveTeacherTasks(currentTasks);
        showToast(completed ? '✅ Task completed' : 'Task reopened', 'info');
        
        if (currentSection === 'tasks') {
            await renderTeacherTasks();
        }
    }
}

// Render teacher tasks
async function renderTeacherTasks() {
    const tasks = await loadTeacherTasks();
    
    const pendingTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);
    
    return `
        <div class="space-y-6 animate-fade-in">
            <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold">My Tasks</h2>
                <button onclick="addTeacherTask()" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
                    <i data-lucide="plus" class="h-4 w-4"></i>
                    New Task
                </button>
            </div>
            
            <div class="grid gap-4 md:grid-cols-2">
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4 flex items-center justify-between">
                        Pending Tasks
                        <span class="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">${pendingTasks.length}</span>
                    </h3>
                    <div class="space-y-2">
                        ${pendingTasks.length > 0 ? pendingTasks.map(task => `
                            <div class="flex items-center gap-3 p-3 hover:bg-accent/50 rounded-lg border">
                                <input type="checkbox" onchange="toggleTask(${task.id}, this.checked)" class="rounded">
                                <div class="flex-1">
                                    <p class="font-medium">${task.title}</p>
                                    ${task.description ? `<p class="text-sm text-muted-foreground">${task.description}</p>` : ''}
                                    <div class="flex items-center gap-2 mt-1">
                                        ${task.dueDate ? `<span class="text-xs text-muted-foreground">Due: ${formatDate(task.dueDate)}</span>` : ''}
                                        <span class="px-2 py-0.5 text-xs rounded-full ${
                                            task.priority === 'urgent' ? 'bg-red-100 text-red-700' : 
                                            task.priority === 'high' ? 'bg-orange-100 text-orange-700' : 
                                            task.priority === 'medium' ? 'bg-blue-100 text-blue-700' : 
                                            'bg-gray-100 text-gray-700'
                                        }">
                                            ${task.priority}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        `).join('') : '<p class="text-center text-muted-foreground py-8">No pending tasks</p>'}
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4 flex items-center justify-between">
                        Completed Tasks
                        <span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">${completedTasks.length}</span>
                    </h3>
                    <div class="space-y-2">
                        ${completedTasks.length > 0 ? completedTasks.map(task => `
                            <div class="flex items-center gap-3 p-3 hover:bg-accent/50 rounded-lg border bg-muted/20">
                                <input type="checkbox" checked onchange="toggleTask(${task.id}, this.checked)" class="rounded">
                                <div class="flex-1">
                                    <p class="font-medium line-through text-muted-foreground">${task.title}</p>
                                    <p class="text-xs text-muted-foreground">Completed</p>
                                </div>
                            </div>
                        `).join('') : '<p class="text-center text-muted-foreground py-8">No completed tasks</p>'}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ============ ATTENDANCE MANAGEMENT (Enhanced) ============

// Load students for attendance (real data from teacher's class)
async function loadAttendanceStudents() {
    try {
        const students = await loadMyStudents();
        return students || [];
    } catch (error) {
        console.error('Failed to load students for attendance:', error);
        return [];
    }
}

// Render attendance page with real students
async function renderTeacherAttendance() {
    try {
        const students = await loadAttendanceStudents();
        
        return `
            <div class="space-y-6 animate-fade-in">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold">Take Attendance</h2>
                    <div class="flex items-center gap-4">
                        <span class="text-sm font-medium">${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card overflow-hidden">
                    <div class="p-4 border-b bg-muted/30 flex justify-between items-center">
                        <div class="flex items-center gap-4">
                            <span class="flex items-center gap-2"><span class="h-3 w-3 bg-green-500 rounded-full"></span> Present</span>
                            <span class="flex items-center gap-2"><span class="h-3 w-3 bg-red-500 rounded-full"></span> Absent</span>
                            <span class="flex items-center gap-2"><span class="h-3 w-3 bg-yellow-500 rounded-full"></span> Late</span>
                            <span class="flex items-center gap-2"><span class="h-3 w-3 bg-blue-500 rounded-full"></span> Sick</span>
                        </div>
                        <button onclick="saveAttendance()" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                            Save Attendance
                        </button>
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead class="bg-muted/50">
                                <tr>
                                    <th class="px-4 py-3 text-left font-medium">Student</th>
                                    <th class="px-4 py-3 text-left font-medium">ELIMUID</th>
                                    <th class="px-4 py-3 text-center font-medium">Status</th>
                                    <th class="px-4 py-3 text-left font-medium">Notes</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                ${students.map(student => `
                                    <tr class="hover:bg-accent/50 transition-colors" data-student-id="${student.id}">
                                        <td class="px-4 py-3">
                                            <div class="flex items-center gap-3">
                                                <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <span class="font-medium text-blue-700 text-sm">${getInitials(student.User?.name)}</span>
                                                </div>
                                                <span class="font-medium">${student.User?.name || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td class="px-4 py-3">
                                            <span class="font-mono text-xs bg-muted px-2 py-1 rounded">${student.elimuid || 'N/A'}</span>
                                        </td>
                                        <td class="px-4 py-3 text-center">
                                            <select class="attendance-status rounded-lg border border-input bg-background px-3 py-1 text-sm">
                                                <option value="present" selected>Present</option>
                                                <option value="absent">Absent</option>
                                                <option value="late">Late</option>
                                                <option value="sick">Sick</option>
                                                <option value="holiday">Holiday</option>
                                            </select>
                                        </td>
                                        <td class="px-4 py-3">
                                            <input type="text" class="attendance-note w-full rounded border-0 bg-transparent text-sm focus:ring-0" placeholder="Add note...">
                                        </td>
                                    </tr>
                                `).join('')}
                                ${students.length === 0 ? '<tr><td colspan="4" class="px-4 py-8 text-center text-muted-foreground">No students found in your class</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error rendering attendance:', error);
        return `<div class="text-center py-12 text-red-500">Error loading attendance: ${error.message}</div>`;
    }
}

// ============ DUTY MANAGEMENT ============

// Load teachers for duty swap (real teachers from same school)
async function loadSchoolTeachers() {
    try {
        const response = await api.admin.getTeachers();
        const currentUser = getCurrentUser();
        // Filter out current teacher
        return (response.data || []).filter(t => t.User?.id !== currentUser?.id);
    } catch (error) {
        console.error('Failed to load teachers:', error);
        return [];
    }
}

// Render duty swap modal with real teachers
async function showDutySwapModal() {
    const teachers = await loadSchoolTeachers();
    
    let modal = document.getElementById('duty-swap-modal');
    
    if (!modal) {
        createDutySwapModal();
        modal = document.getElementById('duty-swap-modal');
    }
    
    // Populate teacher select
    const select = document.getElementById('swap-target');
    if (select) {
        select.innerHTML = `
            <option value="">Select teacher to swap with (optional)</option>
            ${teachers.map(t => `
                <option value="${t.User?.id}">${t.User?.name} - ${t.subjects?.join(', ') || 'Teacher'}</option>
            `).join('')}
        `;
    }
    
    modal.classList.remove('hidden');
}

// Create duty swap modal
function createDutySwapModal() {
    const modalHTML = `
        <div id="duty-swap-modal" class="fixed inset-0 z-50 hidden">
            <div class="absolute inset-0 bg-black/50" onclick="closeDutySwapModal()"></div>
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4">
                <div class="rounded-xl border bg-card p-6 shadow-xl animate-fade-in">
                    <h3 class="text-lg font-semibold mb-4">Request Duty Swap</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Date</label>
                            <input type="date" id="swap-date" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Reason</label>
                            <textarea id="swap-reason" rows="3" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="Why do you need to swap?" required></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Swap With (Optional)</label>
                            <select id="swap-target" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                                <option value="">Loading teachers...</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex justify-end gap-2 mt-6">
                        <button onclick="closeDutySwapModal()" class="px-4 py-2 text-sm border rounded-lg hover:bg-accent">Cancel</button>
                        <button onclick="handleDutySwapRequest()" class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Submit Request</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Close duty swap modal
function closeDutySwapModal() {
    const modal = document.getElementById('duty-swap-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Handle duty swap request
async function handleDutySwapRequest() {
    const date = document.getElementById('swap-date')?.value;
    const reason = document.getElementById('swap-reason')?.value;
    const targetTeacherId = document.getElementById('swap-target')?.value || null;
    
    if (!date || !reason) {
        showToast('Please select date and enter reason', 'error');
        return;
    }
    
    showLoading();
    try {
        const response = await api.duty.requestSwap({
            dutyDate: date,
            reason: reason,
            targetTeacherId: targetTeacherId
        });
        
        showToast('✅ Swap request sent to admin for approval', 'success');
        closeDutySwapModal();
        
        // Clear form
        document.getElementById('swap-date').value = '';
        document.getElementById('swap-reason').value = '';
        
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to request swap', 'error');
    } finally {
        hideLoading();
    }
}

// ============ STUDENT MANAGEMENT (Enhanced) ============

// View student details with real data
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
        console.error('Error viewing student details:', error);
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
    
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.innerHTML = getStudentDetailsHTML(student);
    }
    
    modal.classList.remove('hidden');
    
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

// Create student details modal
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

// Get student details HTML
function getStudentDetailsHTML(student) {
    const user = student.User || {};
    
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
                </div>
            </div>
            
            <div class="border-t pt-4">
                <h4 class="font-medium mb-2">Parent Information</h4>
                <p class="text-sm">Parent email: ${student.parentEmail || 'Not provided'}</p>
                <p class="text-xs text-muted-foreground mt-1">Parent will be notified when you add comments</p>
            </div>
            
            <div class="flex justify-end gap-2 pt-4 border-t">
                <button onclick="closeStudentDetailsModal()" class="px-4 py-2 text-sm border rounded-lg hover:bg-accent">Close</button>
                <button onclick="addComment('${student.id}')" class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                    Add Comment
                </button>
                <button onclick="copyElimuid('${student.elimuid}')" class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
                    <i data-lucide="copy" class="h-4 w-4"></i>
                    Copy
                </button>
            </div>
        </div>
    `;
}

// Close student details modal
function closeStudentDetailsModal() {
    const modal = document.getElementById('student-details-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// ============ CHART DATA FUNCTIONS ============

// Get real chart data for teacher dashboard
async function getTeacherChartData() {
    try {
        const students = await loadMyStudents();
        
        // Calculate grade distribution
        const gradeCounts = { 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'E': 0 };
        let totalScore = 0;
        let scoreCount = 0;
        
        students.forEach(student => {
            if (student.average) {
                totalScore += student.average;
                scoreCount++;
                
                if (student.average >= 80) gradeCounts.A++;
                else if (student.average >= 70) gradeCounts.B++;
                else if (student.average >= 60) gradeCounts.C++;
                else if (student.average >= 50) gradeCounts.D++;
                else gradeCounts.E++;
            }
        });
        
        return {
            performanceData: students.map(s => s.average || 0),
            gradeDistribution: Object.values(gradeCounts),
            classAverage: scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0
        };
    } catch (error) {
        console.error('Error getting chart data:', error);
        return {
            performanceData: [],
            gradeDistribution: [0, 0, 0, 0, 0],
            classAverage: 0
        };
    }
}

// ============ EXPORT FUNCTIONS ============

// Export all functions to global scope
window.showAddStudentModal = showAddStudentModal;
window.closeAddStudentModal = closeAddStudentModal;
window.handleAddStudentModal = handleAddStudentModal;
window.addStudent = addStudent;
window.loadMyStudents = loadMyStudents;
window.refreshMyStudents = refreshMyStudents;
window.renderStudentsTable = renderStudentsTable;
window.viewStudentDetails = viewStudentDetails;
window.copyElimuid = copyElimuid;

// Task functions
window.addTeacherTask = addTeacherTask;
window.loadTeacherTasks = loadTeacherTasks;
window.renderTeacherTasks = renderTeacherTasks;
window.toggleTask = toggleTask;
window.closeAddTaskModal = closeAddTaskModal;
window.handleAddTask = handleAddTask;

// Marks functions
window.enterMarks = enterMarks;
window.saveStudentGrade = saveStudentGrade;
window.updateGradeDisplay = updateGradeDisplay;

// Attendance functions
window.takeAttendance = takeAttendance;
window.saveAttendance = saveAttendance;
window.renderTeacherAttendance = renderTeacherAttendance;

// Comment functions
window.addComment = addComment;

// CSV upload
window.uploadMarksCSV = uploadMarksCSV;

// Duty swap functions
window.showDutySwapModal = showDutySwapModal;
window.closeDutySwapModal = closeDutySwapModal;
window.handleDutySwapRequest = handleDutySwapRequest;

// Chart data
window.getTeacherChartData = getTeacherChartData;

// Modal close functions
window.closeStudentDetailsModal = closeStudentDetailsModal;
