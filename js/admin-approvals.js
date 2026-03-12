// Admin Approval Functions

// Load pending teachers
async function loadPendingTeachers() {
    try {
        const response = await api.admin.getPendingApprovals();
        return response.data.teachers || [];
    } catch (error) {
        console.error('Failed to load pending teachers:', error);
        showToast('Failed to load pending teachers', 'error');
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
        
        // Refresh the pending teachers list
        await refreshPendingTeachers();
        
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
        
        // Refresh the pending teachers list
        await refreshPendingTeachers();
        
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to reject teacher', 'error');
    } finally {
        hideLoading();
    }
}

// Load all teachers
async function loadAllTeachers() {
    try {
        const response = await api.admin.getTeachers();
        return response.data;
    } catch (error) {
        console.error('Failed to load teachers:', error);
        return [];
    }
}

// Load all students
async function loadAllStudents() {
    try {
        const response = await api.admin.getStudents();
        return response.data;
    } catch (error) {
        console.error('Failed to load students:', error);
        return [];
    }
}

// Load all parents
async function loadAllParents() {
    try {
        const response = await api.admin.getParents();
        return response.data;
    } catch (error) {
        console.error('Failed to load parents:', error);
        return [];
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
                    ${teachers.map(teacher => `
                        <tr class="hover:bg-accent/50 transition-colors">
                            <td class="px-4 py-3">
                                <div class="flex items-center gap-3">
                                    <div class="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center">
                                        <span class="font-medium text-violet-700 text-sm">${getInitials(teacher.User.name)}</span>
                                    </div>
                                    <span class="font-medium">${teacher.User.name}</span>
                                </div>
                            </td>
                            <td class="px-4 py-3">${teacher.User.email}</td>
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
                    `).join('')}
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
                        <th class="px-4 py-3 text-left font-medium">Status</th>
                        <th class="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    ${teachers.map(teacher => `
                        <tr class="hover:bg-accent/50 transition-colors">
                            <td class="px-4 py-3">
                                <div class="flex items-center gap-3">
                                    <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span class="font-medium text-blue-700 text-sm">${getInitials(teacher.User.name)}</span>
                                    </div>
                                    <span class="font-medium">${teacher.User.name}</span>
                                </div>
                            </td>
                            <td class="px-4 py-3">
                                <span class="font-mono text-xs bg-muted px-2 py-1 rounded">${teacher.employeeId}</span>
                            </td>
                            <td class="px-4 py-3">${(teacher.subjects || []).join(', ')}</td>
                            <td class="px-4 py-3">
                                <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700">
                                    Active
                                </span>
                            </td>
                            <td class="px-4 py-3 text-right">
                                <button onclick="viewTeacher('${teacher.id}')" class="p-2 hover:bg-accent rounded-lg">
                                    <i data-lucide="eye" class="h-4 w-4"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
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
                        <th class="px-4 py-3 text-left font-medium">Parent</th>
                        <th class="px-4 py-3 text-left font-medium">Status</th>
                        <th class="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    ${students.map(student => `
                        <tr class="hover:bg-accent/50 transition-colors">
                            <td class="px-4 py-3">
                                <div class="flex items-center gap-3">
                                    <div class="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                        <span class="font-medium text-green-700 text-sm">${getInitials(student.User.name)}</span>
                                    </div>
                                    <span class="font-medium">${student.User.name}</span>
                                </div>
                            </td>
                            <td class="px-4 py-3">
                                <span class="font-mono text-xs bg-muted px-2 py-1 rounded">${student.elimuid}</span>
                            </td>
                            <td class="px-4 py-3">${student.grade}</td>
                            <td class="px-4 py-3">${student.parents?.length ? student.parents.map(p => p.User.name).join(', ') : 'None'}</td>
                            <td class="px-4 py-3">
                                <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700">
                                    Active
                                </span>
                            </td>
                            <td class="px-4 py-3 text-right">
                                <button onclick="viewStudent('${student.id}')" class="p-2 hover:bg-accent rounded-lg">
                                    <i data-lucide="eye" class="h-4 w-4"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Refresh functions
async function refreshPendingTeachers() {
    const container = document.getElementById('pending-teachers-container');
    if (!container) return;
    
    const teachers = await loadPendingTeachers();
    container.innerHTML = renderPendingTeachersTable(teachers);
    lucide.createIcons();
}

// Export functions
window.loadPendingTeachers = loadPendingTeachers;
window.approveTeacher = approveTeacher;
window.rejectTeacher = rejectTeacher;
window.loadAllTeachers = loadAllTeachers;
window.loadAllStudents = loadAllStudents;
window.loadAllParents = loadAllParents;
window.renderPendingTeachersTable = renderPendingTeachersTable;
window.renderTeachersTable = renderTeachersTable;
window.renderStudentsTable = renderStudentsTable;