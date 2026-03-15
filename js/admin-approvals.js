// admin-approvals.js - Complete fixed version

// Load pending teachers
async function loadPendingTeachers() {
    try {
        const response = await api.admin.getPendingApprovals();
        return response.data?.teachers || [];
    } catch (error) {
        console.error('Failed to load pending teachers:', error);
        showToast('Failed to load pending teachers', 'error');
        return [];
    }
}

// Load all teachers
async function loadAllTeachers() {
    try {
        const response = await api.admin.getTeachers();
        return response.data || [];
    } catch (error) {
        console.error('Failed to load teachers:', error);
        return [];
    }
}

// Load all students
async function loadAllStudents() {
    try {
        const response = await api.admin.getStudents();
        return response.data || [];
    } catch (error) {
        console.error('Failed to load students:', error);
        return [];
    }
}

// Load all parents
async function loadAllParents() {
    try {
        const response = await api.admin.getParents();
        return response.data || [];
    } catch (error) {
        console.error('Failed to load parents:', error);
        return [];
    }
}

// Approve teacher
async function approveTeacher(teacherId) {
    if (!confirm('Approve this teacher? They will receive an Employee ID.')) {
        return;
    }
    
    showLoading();
    try {
        const response = await api.admin.approveTeacher(teacherId, 'approve');
        showToast('✅ Teacher approved successfully', 'success');
        await refreshPendingTeachers();
        await refreshTeachersList();
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to approve teacher', 'error');
    } finally {
        hideLoading();
    }
}

// Reject teacher
async function rejectTeacher(teacherId) {
    const reason = prompt('Please enter rejection reason:');
    if (reason === null) return;
    
    showLoading();
    try {
        const response = await api.admin.approveTeacher(teacherId, 'reject', reason);
        showToast('Teacher rejected', 'info');
        await refreshPendingTeachers();
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to reject teacher', 'error');
    } finally {
        hideLoading();
    }
}

// Render pending teachers table
function renderPendingTeachersTable(teachers) {
    if (!teachers || teachers.length === 0) {
        return '<div class="text-center py-8 text-muted-foreground">No pending teachers</div>';
    }
    
    return `
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-muted/50">
                    <tr>
                        <th class="px-4 py-3 text-left font-medium">Teacher</th>
                        <th class="px-4 py-3 text-left font-medium">Email</th>
                        <th class="px-4 py-3 text-left font-medium">Subjects</th>
                        <th class="px-4 py-3 text-left font-medium">Qualification</th>
                        <th class="px-4 py-3 text-left font-medium">Applied</th>
                        <th class="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    ${teachers.map(teacher => {
                        const user = teacher.User || {};
                        return `
                            <tr class="hover:bg-accent/50 transition-colors">
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-3">
                                        <div class="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center">
                                            <span class="font-medium text-violet-700 text-sm">${getInitials(user.name)}</span>
                                        </div>
                                        <span class="font-medium">${user.name || 'Unknown'}</span>
                                    </div>
                                </td>
                                <td class="px-4 py-3">${user.email || 'N/A'}</td>
                                <td class="px-4 py-3">${(teacher.subjects || []).join(', ')}</td>
                                <td class="px-4 py-3">${teacher.qualification || 'N/A'}</td>
                                <td class="px-4 py-3">${timeAgo(teacher.createdAt)}</td>
                                <td class="px-4 py-3 text-right">
                                    <button onclick="approveTeacher('${teacher.id}')" class="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full hover:bg-green-200 mr-2">
                                        Approve
                                    </button>
                                    <button onclick="rejectTeacher('${teacher.id}')" class="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full hover:bg-red-200">
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Render teachers table
function renderTeachersTable(teachers) {
    if (!teachers || teachers.length === 0) {
        return '<div class="text-center py-8 text-muted-foreground">No teachers found</div>';
    }
    
    return `
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-muted/50">
                    <tr>
                        <th class="px-4 py-3 text-left font-medium">Teacher</th>
                        <th class="px-4 py-3 text-left font-medium">Employee ID</th>
                        <th class="px-4 py-3 text-left font-medium">Subjects</th>
                        <th class="px-4 py-3 text-left font-medium">Department</th>
                        <th class="px-4 py-3 text-left font-medium">Status</th>
                        <th class="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    ${teachers.map(teacher => {
                        const user = teacher.User || {};
                        return `
                            <tr class="hover:bg-accent/50 transition-colors">
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-3">
                                        <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                            <span class="font-medium text-blue-700 text-sm">${getInitials(user.name)}</span>
                                        </div>
                                        <span class="font-medium">${user.name || 'Unknown'}</span>
                                    </div>
                                </td>
                                <td class="px-4 py-3">
                                    <span class="font-mono text-xs bg-muted px-2 py-1 rounded">${teacher.employeeId || 'N/A'}</span>
                                </td>
                                <td class="px-4 py-3">${(teacher.subjects || []).join(', ')}</td>
                                <td class="px-4 py-3">${teacher.department || 'general'}</td>
                                <td class="px-4 py-3">
                                    <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700">
                                        ${teacher.approvalStatus || 'active'}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-right">
                                    <button onclick="viewTeacher('${teacher.id}')" class="p-2 hover:bg-accent rounded-lg">
                                        <i data-lucide="eye" class="h-4 w-4"></i>
                                    </button>
                                    <button onclick="editTeacher('${teacher.id}')" class="p-2 hover:bg-accent rounded-lg">
                                        <i data-lucide="edit" class="h-4 w-4"></i>
                                    </button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Render students table
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
                        <th class="px-4 py-3 text-left font-medium">ELIMUID</th>
                        <th class="px-4 py-3 text-left font-medium">Grade</th>
                        <th class="px-4 py-3 text-left font-medium">Status</th>
                        <th class="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    ${students.map(student => {
                        const user = student.User || {};
                        return `
                            <tr class="hover:bg-accent/50 transition-colors">
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-3">
                                        <div class="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                            <span class="font-medium text-green-700 text-sm">${getInitials(user.name)}</span>
                                        </div>
                                        <span class="font-medium">${user.name || 'Unknown'}</span>
                                    </div>
                                </td>
                                <td class="px-4 py-3">
                                    <span class="font-mono text-xs bg-muted px-2 py-1 rounded">${student.elimuid || 'N/A'}</span>
                                </td>
                                <td class="px-4 py-3">${student.grade || 'N/A'}</td>
                                <td class="px-4 py-3">
                                    <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700">
                                        ${student.status || 'active'}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-right">
                                    <button onclick="viewStudent('${student.id}')" class="p-2 hover:bg-accent rounded-lg">
                                        <i data-lucide="eye" class="h-4 w-4"></i>
                                    </button>
                                    <button onclick="copyElimuid('${student.elimuid}')" class="p-2 hover:bg-accent rounded-lg">
                                        <i data-lucide="copy" class="h-4 w-4"></i>
                                    </button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Refresh pending teachers
async function refreshPendingTeachers() {
    const container = document.getElementById('pending-teachers-container');
    if (!container) return;
    
    const teachers = await loadPendingTeachers();
    container.innerHTML = renderPendingTeachersTable(teachers);
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

// Refresh teachers list
async function refreshTeachersList() {
    const container = document.getElementById('teachers-table-container');
    if (!container) return;
    
    const teachers = await loadAllTeachers();
    container.innerHTML = renderTeachersTable(teachers);
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

// Refresh students list
async function refreshStudentsList() {
    const container = document.getElementById('students-table-container');
    if (!container) return;
    
    const students = await loadAllStudents();
    container.innerHTML = renderStudentsTable(students);
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

// View teacher
function viewTeacher(teacherId) {
    showToast(`Viewing teacher ${teacherId}`, 'info');
}

// Edit teacher
function editTeacher(teacherId) {
    showToast(`Editing teacher ${teacherId}`, 'info');
}

// View student
function viewStudent(studentId) {
    showToast(`Viewing student ${studentId}`, 'info');
}

// ============ TEACHER DETAILS MODAL ============

// View teacher details
async function viewTeacher(teacherId) {
    showLoading();
    try {
        // Get all teachers and find the specific one
        const teachers = await loadAllTeachers();
        const teacher = teachers.find(t => t.id == teacherId);
        
        if (!teacher) {
            showToast('Teacher not found', 'error');
            return;
        }
        
        // Show teacher details modal
        showTeacherDetailsModal(teacher);
    } catch (error) {
        console.error('Error viewing teacher:', error);
        showToast('Failed to load teacher details', 'error');
    } finally {
        hideLoading();
    }
}

// Show teacher details modal
function showTeacherDetailsModal(teacher) {
    // Check if modal already exists
    let modal = document.getElementById('teacher-details-modal');
    
    if (!modal) {
        createTeacherDetailsModal();
        modal = document.getElementById('teacher-details-modal');
    }
    
    // Update modal content
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.innerHTML = getTeacherDetailsHTML(teacher);
    }
    
    modal.classList.remove('hidden');
    
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

// Create teacher details modal
function createTeacherDetailsModal() {
    const modalHTML = `
        <div id="teacher-details-modal" class="fixed inset-0 z-50 hidden">
            <div class="absolute inset-0 bg-black/50" onclick="closeTeacherDetailsModal()"></div>
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4">
                <div class="rounded-xl border bg-card p-6 shadow-xl animate-fade-in">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold">Teacher Details</h3>
                        <button onclick="closeTeacherDetailsModal()" class="p-2 hover:bg-accent rounded-lg">
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

// Get teacher details HTML
function getTeacherDetailsHTML(teacher) {
    const user = teacher.User || {};
    
    return `
        <div class="space-y-4">
            <div class="flex items-center gap-4">
                <div class="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <span class="font-medium text-blue-700 text-xl">${getInitials(user.name)}</span>
                </div>
                <div>
                    <h4 class="font-medium text-lg">${user.name || 'N/A'}</h4>
                    <p class="text-sm text-muted-foreground">${user.email || 'No email'}</p>
                </div>
            </div>
            
            <div class="border-t pt-4">
                <div class="grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <p class="text-muted-foreground">Employee ID</p>
                        <p class="font-medium">${teacher.employeeId || 'N/A'}</p>
                    </div>
                    <div>
                        <p class="text-muted-foreground">Phone</p>
                        <p class="font-medium">${user.phone || 'N/A'}</p>
                    </div>
                    <div>
                        <p class="text-muted-foreground">Department</p>
                        <p class="font-medium">${teacher.department || 'general'}</p>
                    </div>
                    <div>
                        <p class="text-muted-foreground">Status</p>
                        <p><span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700">
                            ${teacher.approvalStatus || 'active'}
                        </span></p>
                    </div>
                </div>
            </div>
            
            <div class="border-t pt-4">
                <h4 class="font-medium mb-2">Subjects</h4>
                <div class="flex flex-wrap gap-2">
                    ${(teacher.subjects || []).map(subject => `
                        <span class="px-2 py-1 bg-muted/30 rounded text-xs">${subject}</span>
                    `).join('')}
                    ${(!teacher.subjects || teacher.subjects.length === 0) ? '<p class="text-sm text-muted-foreground">No subjects assigned</p>' : ''}
                </div>
            </div>
            
            <div class="border-t pt-4">
                <h4 class="font-medium mb-2">Qualification</h4>
                <p class="text-sm">${teacher.qualification || 'Not specified'}</p>
            </div>
            
            <div class="flex justify-end gap-2 pt-4 border-t">
                <button onclick="closeTeacherDetailsModal()" class="px-4 py-2 text-sm border rounded-lg hover:bg-accent">Close</button>
                <button onclick="editTeacher('${teacher.id}')" class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Edit Teacher</button>
            </div>
        </div>
    `;
}

// Close teacher details modal
function closeTeacherDetailsModal() {
    const modal = document.getElementById('teacher-details-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// ============ STUDENT DETAILS MODAL ============

// View student details
async function viewStudent(studentId) {
    showLoading();
    try {
        // Get all students and find the specific one
        const students = await loadAllStudents();
        const student = students.find(s => s.id == studentId);
        
        if (!student) {
            showToast('Student not found', 'error');
            return;
        }
        
        // Show student details modal
        showStudentDetailsModal(student);
    } catch (error) {
        console.error('Error viewing student:', error);
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
                    <div>
                        <p class="text-muted-foreground">Status</p>
                        <p><span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700">
                            ${student.status || 'active'}
                        </span></p>
                    </div>
                    <div>
                        <p class="text-muted-foreground">Enrolled</p>
                        <p class="font-medium">${formatDate(student.enrollmentDate) || 'N/A'}</p>
                    </div>
                </div>
            </div>
            
            <div class="border-t pt-4">
                <h4 class="font-medium mb-2">Academic Status</h4>
                <p class="text-sm">${student.academicStatus || 'Not available'}</p>
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

// Close student details modal
function closeStudentDetailsModal() {
    const modal = document.getElementById('student-details-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Export functions
window.loadPendingTeachers = loadPendingTeachers;
window.loadAllTeachers = loadAllTeachers;
window.loadAllStudents = loadAllStudents;
window.loadAllParents = loadAllParents;
window.approveTeacher = approveTeacher;
window.rejectTeacher = rejectTeacher;
window.renderPendingTeachersTable = renderPendingTeachersTable;
window.renderTeachersTable = renderTeachersTable;
window.renderStudentsTable = renderStudentsTable;
window.refreshPendingTeachers = refreshPendingTeachers;
window.refreshTeachersList = refreshTeachersList;
window.refreshStudentsList = refreshStudentsList;
window.viewTeacher = viewTeacher;
window.editTeacher = editTeacher;
window.viewStudent = viewStudent;
// Update the export section to include the new functions
window.viewTeacher = viewTeacher;
window.viewStudent = viewStudent;
window.closeTeacherDetailsModal = closeTeacherDetailsModal;
window.closeStudentDetailsModal = closeStudentDetailsModal;
