// admin-approvals.js - COMPLETE WORKING VERSION WITH ALL FUNCTIONS

// ==================== LOAD FUNCTIONS ====================

async function loadPendingTeachers() {
    try {
        const response = await api.admin.getPendingApprovals();
        return response?.data?.teachers || [];
    } catch (error) {
        console.error('Failed to load pending teachers:', error);
        showToast('Failed to load pending teachers', 'error');
        return [];
    }
}

async function loadAllTeachers() {
    try {
        const response = await api.admin.getTeachers();
        return response?.data || [];
    } catch (error) {
        console.error('Failed to load teachers:', error);
        return [];
    }
}

async function loadAllStudents() {
    try {
        const response = await api.admin.getStudents();
        return response?.data || [];
    } catch (error) {
        console.error('Failed to load students:', error);
        return [];
    }
}

async function loadMyStudents() {
    try {
        const response = await api.teacher.getMyStudents();
        return response?.data || [];
    } catch (error) {
        console.error('Failed to load my students:', error);
        return [];
    }
}

async function loadAllParents() {
    try {
        const response = await api.admin.getParents();
        return response?.data || [];
    } catch (error) {
        console.error('Failed to load parents:', error);
        return [];
    }
}

// ==================== TEACHER ACTIONS ====================

async function approveTeacher(teacherId) {
    if (!teacherId) return;
    if (!confirm('Approve this teacher?')) return;

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

async function rejectTeacher(teacherId) {
    if (!teacherId) return;
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

async function deactivateTeacher(teacherId, teacherName) {
    const reason = prompt(`Enter reason for deactivating ${teacherName}:`);
    if (!reason) return;
    
    if (!confirm(`⚠️ Deactivate ${teacherName}?`)) return;
    
    showLoading();
    try {
        const response = await api.admin.deactivateTeacher(teacherId, { reason });
        
        if (response.success) {
            showToast(`✅ ${teacherName} deactivated`, 'success');
            await refreshTeachersList();
        }
    } catch (error) {
        showToast(error.message || 'Failed to deactivate teacher', 'error');
    } finally {
        hideLoading();
    }
}

async function activateTeacher(teacherId, teacherName) {
    if (!confirm(`Activate ${teacherName}?`)) return;
    
    showLoading();
    try {
        const response = await api.admin.activateTeacher(teacherId);
        
        if (response.success) {
            showToast(`✅ ${teacherName} activated`, 'success');
            await refreshTeachersList();
        }
    } catch (error) {
        showToast(error.message || 'Failed to activate teacher', 'error');
    } finally {
        hideLoading();
    }
}

async function removeTeacher(teacherId) {
    if (!teacherId) return;
    if (!confirm('⚠️ PERMANENT DELETE?')) return;

    const confirmText = prompt('Type "DELETE" to confirm:');
    if (confirmText !== 'DELETE') {
        showToast('Cancelled', 'info');
        return;
    }

    showLoading();
    try {
        const response = await api.admin.deleteTeacher(teacherId);
        showToast('✅ Teacher removed', 'success');
        await refreshTeachersList();
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to remove teacher', 'error');
    } finally {
        hideLoading();
    }
}

// ==================== STUDENT ACTIONS ====================

async function suspendStudent(studentId, studentName) {
    const reason = prompt(`Enter suspension reason for ${studentName}:`);
    if (!reason) return;
    
    if (!confirm(`⚠️ Suspend ${studentName}?`)) return;
    
    showLoading();
    try {
        const response = await api.admin.suspendStudent(studentId, { reason });
        
        if (response.success) {
            showToast(`✅ ${studentName} suspended`, 'success');
            await refreshStudentsList();
        }
    } catch (error) {
        showToast(error.message || 'Failed to suspend student', 'error');
    } finally {
        hideLoading();
    }
}

async function reactivateStudent(studentId, studentName) {
    if (!confirm(`Reactivate ${studentName}?`)) return;
    
    showLoading();
    try {
        const response = await api.admin.reactivateStudent(studentId);
        
        if (response.success) {
            showToast(`✅ ${studentName} reactivated`, 'success');
            await refreshStudentsList();
        }
    } catch (error) {
        showToast(error.message || 'Failed to reactivate student', 'error');
    } finally {
        hideLoading();
    }
}

async function expelStudent(studentId, studentName) {
    const reason = prompt(`Enter reason for expelling ${studentName}:`);
    if (!reason) return;
    
    if (!confirm(`⚠️⚠️ PERMANENT: Expel ${studentName}?`)) return;
    
    showLoading();
    try {
        const response = await api.admin.expelStudent(studentId, { reason });
        
        if (response.success) {
            showToast(`✅ ${studentName} expelled`, 'success');
            await refreshStudentsList();
        }
    } catch (error) {
        showToast(error.message || 'Failed to expel student', 'error');
    } finally {
        hideLoading();
    }
}

// ==================== VIEW FUNCTIONS ====================

async function viewTeacher(teacherId) {
    if (!teacherId) return;
    showLoading();
    try {
        const teachers = await loadAllTeachers();
        const teacher = teachers.find(t => t?.id == teacherId);
        if (!teacher) {
            showToast('Teacher not found', 'error');
            return;
        }
        alert(`Teacher: ${teacher.User?.name}\nEmail: ${teacher.User?.email}\nSubjects: ${(teacher.subjects || []).join(', ')}`);
    } catch (error) {
        showToast('Failed to load teacher', 'error');
    } finally {
        hideLoading();
    }
}

async function viewStudent(studentId) {
    if (!studentId) return;
    showLoading();
    try {
        const students = await loadAllStudents();
        const student = students.find(s => s?.id == studentId);
        if (!student) {
            showToast('Student not found', 'error');
            return;
        }
        showStudentDetailsModal(student);
    } catch (error) {
        showToast('Failed to load student', 'error');
    } finally {
        hideLoading();
    }
}

// ==================== MODAL FUNCTIONS ====================

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
                    <div class="modal-content space-y-4"></div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeStudentDetailsModal() {
    const modal = document.getElementById('student-details-modal');
    if (modal) modal.classList.add('hidden');
}

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
            <div class="grid grid-cols-2 gap-4">
                <div class="p-3 bg-muted/30 rounded-lg">
                    <p class="text-xs text-muted-foreground">ELIMUID</p>
                    <p class="font-mono text-sm font-bold text-primary">${student.elimuid || 'N/A'}</p>
                </div>
                <div class="p-3 bg-muted/30 rounded-lg">
                    <p class="text-xs text-muted-foreground">Grade</p>
                    <p class="font-medium">${student.grade || 'N/A'}</p>
                </div>
            </div>
            <div class="border-t pt-4">
                <p class="text-sm"><span class="font-medium">Gender:</span> ${student.gender || 'Not specified'}</p>
                <p class="text-sm"><span class="font-medium">DOB:</span> ${student.dateOfBirth ? formatDate(student.dateOfBirth) : 'N/A'}</p>
                <p class="text-sm"><span class="font-medium">Status:</span> ${student.status || 'active'}</p>
            </div>
            <div class="flex justify-end gap-2 pt-4 border-t">
                <button onclick="closeStudentDetailsModal()" class="px-4 py-2 text-sm border rounded-lg hover:bg-accent">Close</button>
                <button onclick="copyElimuid('${student.elimuid}')" class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Copy ELIMUID</button>
            </div>
        </div>
    `;
}

// ==================== RENDER FUNCTIONS ====================

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
                                    <button onclick="approveTeacher('${teacher.id}')" class="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full hover:bg-green-200 mr-2">Approve</button>
                                    <button onclick="rejectTeacher('${teacher.id}')" class="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full hover:bg-red-200">Reject</button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

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
                        const isActive = teacher.isActive !== false;
                        const status = isActive ? 'active' : 'inactive';
                        
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
                                    <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}">
                                        ${status}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-right">
                                    <button onclick="viewTeacher('${teacher.id}')" class="p-2 hover:bg-accent rounded-lg" title="View">
                                        <i data-lucide="eye" class="h-4 w-4"></i>
                                    </button>
                                    ${isActive ? 
                                        `<button onclick="deactivateTeacher('${teacher.id}', '${user.name}')" class="p-2 hover:bg-yellow-100 rounded-lg text-yellow-600" title="Deactivate">
                                            <i data-lucide="pause-circle" class="h-4 w-4"></i>
                                        </button>` : 
                                        `<button onclick="activateTeacher('${teacher.id}', '${user.name}')" class="p-2 hover:bg-green-100 rounded-lg text-green-600" title="Activate">
                                            <i data-lucide="play-circle" class="h-4 w-4"></i>
                                        </button>`
                                    }
                                    <button onclick="removeTeacher('${teacher.id}')" class="p-2 hover:bg-red-100 rounded-lg text-red-600" title="Delete">
                                        <i data-lucide="trash-2" class="h-4 w-4"></i>
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

function renderStudentsTable(students) {
    if (!students || students.length === 0) {
        return '<div class="text-center py-12 text-muted-foreground">No students found</div>';
    }
    
    return `
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-muted/50">
                    <tr>
                        <th class="px-6 py-4 text-left font-medium">Student</th>
                        <th class="px-6 py-4 text-left font-medium">ELIMUID</th>
                        <th class="px-6 py-4 text-left font-medium">Grade</th>
                        <th class="px-6 py-4 text-left font-medium">Status</th>
                        <th class="px-6 py-4 text-center font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    ${students.map(student => {
                        const user = student.User || {};
                        const status = student.status || 'active';
                        const statusColor = status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
                        
                        return `
                            <tr class="hover:bg-accent/50 transition-colors">
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-4">
                                        <div class="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold shadow-sm">
                                            ${getInitials(user.name)}
                                        </div>
                                        <div>
                                            <div class="font-medium">${user.name || 'Unknown'}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="font-mono text-xs bg-muted/70 px-3 py-1.5 rounded-full border border-muted">${student.elimuid || 'N/A'}</span>
                                </td>
                                <td class="px-6 py-4 font-medium">${student.grade || 'N/A'}</td>
                                <td class="px-6 py-4">
                                    <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusColor}">
                                        ${status}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <div class="flex items-center justify-center gap-2">
                                        <button onclick="viewStudent('${student.id}')" class="p-2 hover:bg-blue-50 rounded-lg" title="View">
                                            <i data-lucide="eye" class="h-4 w-4 text-blue-600"></i>
                                        </button>
                                        ${status === 'active' ? 
                                            `<button onclick="suspendStudent('${student.id}', '${user.name || 'Unknown'}')" class="p-2 hover:bg-red-50 rounded-lg" title="Suspend">
                                                <i data-lucide="ban" class="h-4 w-4 text-red-600"></i>
                                            </button>` : 
                                            `<button onclick="reactivateStudent('${student.id}', '${user.name || 'Unknown'}')" class="p-2 hover:bg-green-50 rounded-lg" title="Reactivate">
                                                <i data-lucide="check-circle" class="h-4 w-4 text-green-600"></i>
                                            </button>`
                                        }
                                        <button onclick="expelStudent('${student.id}', '${user.name || 'Unknown'}')" class="p-2 hover:bg-red-100 rounded-lg text-red-600" title="Expel">
                                            <i data-lucide="user-x" class="h-4 w-4"></i>
                                        </button>
                                        <button onclick="copyElimuid('${student.elimuid}')" class="p-2 hover:bg-purple-50 rounded-lg" title="Copy">
                                            <i data-lucide="copy" class="h-4 w-4 text-purple-600"></i>
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

// ==================== REFRESH FUNCTIONS ====================

// In admin-approval.js, find this function:

async function refreshPendingTeachers() {
    const container = document.querySelector('#pending-teachers-table') || 
                     document.querySelectorAll('table')[1]?.querySelector('tbody');
    
    if (!container) return;
    const teachers = await loadPendingTeachers();
    container.innerHTML = renderPendingTeachersTable(teachers);
    if (window.lucide) lucide.createIcons();
}

async function refreshTeachersList() {
    const container = document.getElementById('teachers-table-container');
    if (!container) return;
    const teachers = await loadAllTeachers();
    container.innerHTML = renderTeachersTable(teachers);
    if (window.lucide) lucide.createIcons();
}

async function refreshStudentsList() {
    const container = document.getElementById('students-table-body');
    if (!container) return;
    const students = await loadAllStudents();
    container.innerHTML = renderStudentsTable(students);
    if (window.lucide) lucide.createIcons();
}

// ==================== HELPER FUNCTIONS ====================

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch {
        return null;
    }
}

function copyElimuid(elimuid) {
    if (!elimuid) return showToast('No ELIMUID', 'error');
    navigator.clipboard.writeText(elimuid)
        .then(() => showToast('✅ Copied', 'success'))
        .catch(() => showToast('Failed to copy', 'error'));
}

function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
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

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// ============ TEACHER SUBJECT ASSIGNMENT FUNCTIONS ============

async function loadTeachersForAssignment() {
    try {
        const response = await api.admin.getTeachers();
        const teachers = response.data || [];
        const select = document.getElementById('assign-teacher-select');
        
        if (select) {
            select.innerHTML = '<option value="">Select a teacher...</option>' +
                teachers.map(t => `
                    <option value="${t.id}" data-name="${t.User?.name}">
                        ${t.User?.name} (${t.subjects?.join(', ') || 'No subjects'})
                    </option>
                `).join('');
        }
    } catch (error) {
        console.error('Failed to load teachers:', error);
        showToast('Failed to load teachers', 'error');
    }
}

async function loadClassesForAssignment() {
    try {
        const response = await api.admin.getClasses();
        const classes = response.data || [];
        const select = document.getElementById('assign-class-select');
        
        if (select) {
            select.innerHTML = '<option value="">Select a class...</option>' +
                classes.map(c => `
                    <option value="${c.id}" data-grade="${c.grade}" data-name="${c.name}">
                        ${c.name} (Grade ${c.grade})
                    </option>
                `).join('');
        }
    } catch (error) {
        console.error('Failed to load classes:', error);
        showToast('Failed to load classes', 'error');
    }
}

async function loadSubjectsForAssignment() {
    try {
        const curriculum = schoolSettings?.curriculum || 'cbc';
        const schoolLevel = schoolSettings?.schoolLevel || 'secondary';
        
        // Get subjects from curriculum
        let subjects = [];
        
        if (curriculum === 'cbc') {
            subjects = schoolLevel === 'primary' 
                ? ['Mathematics', 'English', 'Kiswahili', 'Science', 'Social Studies', 'CRE/IRE', 'Physical Education', 'Art & Craft', 'Music']
                : ['Mathematics', 'English', 'Kiswahili', 'Biology', 'Chemistry', 'Physics', 'History', 'Geography', 'CRE/IRE', 'Business Studies', 'Agriculture', 'Computer Studies'];
        } else if (curriculum === '844') {
            subjects = schoolLevel === 'primary'
                ? ['Mathematics', 'English', 'Kiswahili', 'Science', 'Social Studies', 'CRE/IRE', 'Physical Education']
                : ['Mathematics', 'English', 'Kiswahili', 'Biology', 'Chemistry', 'Physics', 'History', 'Geography', 'CRE/IRE', 'Business Studies', 'Agriculture', 'Computer Studies'];
        } else if (curriculum === 'british') {
            subjects = schoolLevel === 'primary'
                ? ['English', 'Mathematics', 'Science', 'History', 'Geography', 'Art', 'Music', 'Physical Education']
                : ['English Literature', 'English Language', 'Mathematics', 'Biology', 'Chemistry', 'Physics', 'History', 'Geography', 'French', 'Spanish', 'Computer Science', 'Business Studies', 'Economics', 'Art & Design', 'Music', 'Physical Education'];
        } else if (curriculum === 'american') {
            subjects = schoolLevel === 'primary'
                ? ['English Language Arts', 'Mathematics', 'Science', 'Social Studies', 'Art', 'Music', 'Physical Education']
                : ['English', 'Mathematics', 'Biology', 'Chemistry', 'Physics', 'History', 'Geography', 'Spanish', 'French', 'Computer Science', 'Business', 'Economics', 'Art', 'Music', 'Physical Education'];
        }
        
        // Add custom subjects
        const customSubjects = schoolSettings?.customSubjects || [];
        const allSubjects = [...subjects, ...customSubjects];
        
        const select = document.getElementById('assign-subject-select');
        if (select) {
            select.innerHTML = '<option value="">Select a subject...</option>' +
                allSubjects.map(s => `
                    <option value="${s}">${s}</option>
                `).join('');
        }
    } catch (error) {
        console.error('Failed to load subjects:', error);
        // Fallback subjects
        const select = document.getElementById('assign-subject-select');
        if (select) {
            select.innerHTML = '<option value="">Select a subject...</option>' +
                ['Mathematics', 'English', 'Kiswahili', 'Science', 'Biology', 'Chemistry', 'Physics', 'History', 'Geography'].map(s => `
                    <option value="${s}">${s}</option>
                `).join('');
        }
    }
}

async function assignTeacherToSubject() {
    const teacherId = document.getElementById('assign-teacher-select')?.value;
    const classId = document.getElementById('assign-class-select')?.value;
    const subject = document.getElementById('assign-subject-select')?.value;
    const roleRadio = document.querySelector('input[name="teacher-role"]:checked');
    const isClassTeacher = roleRadio?.value === 'class_teacher';
    
    if (!teacherId || !classId || !subject) {
        showToast('Please select teacher, class, and subject', 'error');
        return;
    }
    
    // Get teacher name for success message
    const teacherSelect = document.getElementById('assign-teacher-select');
    const teacherName = teacherSelect.options[teacherSelect.selectedIndex]?.getAttribute('data-name') || 'Teacher';
    
    const classSelect = document.getElementById('assign-class-select');
    const className = classSelect.options[classSelect.selectedIndex]?.getAttribute('data-name') || 'Class';
    
    showLoading();
    try {
        const response = await api.admin.assignTeacherToSubject({
            teacherId: parseInt(teacherId),
            classId: parseInt(classId),
            subject: subject,
            isClassTeacher: isClassTeacher
        });
        
        if (response.success) {
            const roleText = isClassTeacher ? 'Class Teacher' : 'Subject Teacher';
            showToast(`✅ ${teacherName} assigned as ${roleText} for ${subject} in ${className}`, 'success');
            
            // Clear selection
            document.getElementById('assign-teacher-select').value = '';
            document.getElementById('assign-class-select').value = '';
            document.getElementById('assign-subject-select').value = '';
            document.querySelector('input[name="teacher-role"][value="subject"]').checked = true;
            
            // Refresh the assignments list
            await refreshSubjectAssignments();
        }
    } catch (error) {
        showToast(error.message || 'Failed to assign teacher', 'error');
    } finally {
        hideLoading();
    }
}

async function refreshSubjectAssignments() {
    const tbody = document.getElementById('subject-assignments-tbody');
    if (!tbody) return;
    
    try {
        const response = await api.admin.getSubjectAssignments();
        const assignments = response.data || [];
        
        if (assignments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-muted-foreground">No assignments yet. Use the form above to assign teachers.</td></tr>';
            return;
        }
        
        tbody.innerHTML = assignments.map(ass => `
            <tr class="hover:bg-accent/50 transition-colors">
                <td class="px-4 py-3 font-medium">${escapeHtml(ass.teacherName)}</td>
                <td class="px-4 py-3">${escapeHtml(ass.className)} (${escapeHtml(ass.classGrade)})</td>
                <td class="px-4 py-3">
                    <span class="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        ${escapeHtml(ass.subject)}
                    </span>
                </td>
                <td class="px-4 py-3">
                    <span class="px-2 py-1 rounded-full text-xs font-medium ${ass.isClassTeacher ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}">
                        ${ass.isClassTeacher ? '🏫 Class Teacher' : '📚 Subject Teacher'}
                    </span>
                </td>
                <td class="px-4 py-3 text-center">
                    <button onclick="removeSubjectAssignment(${ass.id})" 
                            class="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                            title="Remove Assignment">
                        <i data-lucide="trash-2" class="h-4 w-4"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
        
    } catch (error) {
        console.error('Failed to load assignments:', error);
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-red-500">Failed to load assignments</td></tr>';
    }
}

async function removeSubjectAssignment(assignmentId) {
    if (!confirm('Are you sure you want to remove this teacher from this subject?')) {
        return;
    }
    
    showLoading();
    try {
        const response = await api.admin.removeSubjectAssignment(assignmentId);
        
        if (response.success) {
            showToast('✅ Assignment removed successfully', 'success');
            await refreshSubjectAssignments();
        }
    } catch (error) {
        showToast(error.message || 'Failed to remove assignment', 'error');
    } finally {
        hideLoading();
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== EXPORT ALL FUNCTIONS ====================

window.loadPendingTeachers = loadPendingTeachers;
window.loadAllTeachers = loadAllTeachers;
window.loadAllStudents = loadAllStudents;
window.loadMyStudents = loadMyStudents;
window.loadAllParents = loadAllParents;

window.approveTeacher = approveTeacher;
window.rejectTeacher = rejectTeacher;
window.deactivateTeacher = deactivateTeacher;
window.activateTeacher = activateTeacher;
window.removeTeacher = removeTeacher;

window.suspendStudent = suspendStudent;
window.reactivateStudent = reactivateStudent;
window.expelStudent = expelStudent;

window.viewTeacher = viewTeacher;
window.viewStudent = viewStudent;

window.refreshPendingTeachers = refreshPendingTeachers;
window.refreshTeachersList = refreshTeachersList;
window.refreshStudentsList = refreshStudentsList;

window.copyElimuid = copyElimuid;
window.getInitials = getInitials;
window.timeAgo = timeAgo;
window.formatDate = formatDate;
window.getCurrentUser = getCurrentUser;

window.renderPendingTeachersTable = renderPendingTeachersTable;
window.renderTeachersTable = renderTeachersTable;
window.renderStudentsTable = renderStudentsTable;

window.showStudentDetailsModal = showStudentDetailsModal;
window.closeStudentDetailsModal = closeStudentDetailsModal;
