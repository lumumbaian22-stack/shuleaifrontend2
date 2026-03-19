// admin-student-management.js - Complete admin student management

// ============ LOAD STUDENTS ============

// Load all students (admin only)
async function loadAllStudents() {
    try {
        console.log('📥 Loading all students...');
        const response = await api.admin.getStudents();
        console.log('✅ Students loaded:', response.data);
        return response.data || [];
    } catch (error) {
        console.error('❌ Failed to load students:', error);
        showToast(error.message || 'Failed to load students', 'error');
        return [];
    }
}

// Refresh admin student list
async function refreshAdminStudentList() {
    const container = document.getElementById('admin-students-table-body');
    if (!container) {
        console.warn('⚠️ Admin student table container not found');
        return;
    }
    
    try {
        container.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center">Loading...</td></tr>';
        
        const students = await loadAllStudents();
        
        if (!students || students.length === 0) {
            container.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-muted-foreground">No students found</td></tr>';
            return;
        }
        
        container.innerHTML = students.map(student => `
            <tr class="hover:bg-accent/50 transition-colors">
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
                <td class="px-4 py-3">${student.grade || 'N/A'}</td>
                <td class="px-4 py-3">
                    <span class="px-2 py-1 ${student.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} text-xs rounded-full">
                        ${student.status || 'active'}
                    </span>
                </td>
                <td class="px-4 py-3">${student.parents?.length ? student.parents.map(p => p.User?.name).join(', ') : 'None'}</td>
                <td class="px-4 py-3 text-right">
                    <button onclick="viewStudent('${student.id}')" class="p-2 hover:bg-accent rounded-lg">
                        <i data-lucide="eye" class="h-4 w-4"></i>
                    </button>
                    <button onclick="editStudent('${student.id}')" class="p-2 hover:bg-accent rounded-lg">
                        <i data-lucide="edit" class="h-4 w-4"></i>
                    </button>
                    <button onclick="suspendStudent('${student.id}', '${student.User?.name}')" class="p-2 hover:bg-yellow-100 rounded-lg text-yellow-600">
                        <i data-lucide="ban" class="h-4 w-4"></i>
                    </button>
                    <button onclick="copyElimuid('${student.elimuid}')" class="p-2 hover:bg-accent rounded-lg">
                        <i data-lucide="copy" class="h-4 w-4"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
        // Update total students count
        const totalEl = document.getElementById('total-students');
        if (totalEl) totalEl.textContent = students.length;
        
        if (window.lucide) lucide.createIcons();
        
    } catch (error) {
        console.error('Error refreshing admin student list:', error);
        container.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-red-500">Error loading students</td></tr>';
    }
}

// ============ STUDENT ACTIONS ============

async function viewStudent(studentId) {
    showLoading();
    try {
        const students = await loadAllStudents();
        const student = students.find(s => s.id == studentId);
        
        if (!student) {
            showToast('Student not found', 'error');
            return;
        }
        
        const modal = document.getElementById('student-details-modal');
        const content = modal.querySelector('.modal-content');
        
        const user = student.User || {};
        
        content.innerHTML = `
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
                            <p class="font-mono text-xs bg-muted px-2 py-1 rounded">${student.elimuid || 'N/A'}</p>
                        </div>
                        <div>
                            <p class="text-muted-foreground">Grade</p>
                            <p class="font-medium">${student.grade || 'N/A'}</p>
                        </div>
                        <div>
                            <p class="text-muted-foreground">Status</p>
                            <p><span class="px-2 py-1 ${student.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} text-xs rounded-full">${student.status || 'active'}</span></p>
                        </div>
                        <div>
                            <p class="text-muted-foreground">Teacher</p>
                            <p>${student.teacher?.User?.name || 'Not assigned'}</p>
                        </div>
                    </div>
                </div>
                
                ${student.parents && student.parents.length > 0 ? `
                    <div class="border-t pt-4">
                        <h4 class="font-medium mb-2">Parents</h4>
                        ${student.parents.map(p => `
                            <div class="p-2 bg-muted/30 rounded mb-2">
                                <p class="font-medium">${p.User?.name || 'Unknown'}</p>
                                <p class="text-xs text-muted-foreground">${p.User?.email || ''}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
        
        modal.classList.remove('hidden');
        if (window.lucide) lucide.createIcons();
    } catch (error) {
        console.error('Error viewing student:', error);
        showToast('Failed to load student details', 'error');
    } finally {
        hideLoading();
    }
}

async function editStudent(studentId) {
    showLoading();
    try {
        const students = await loadAllStudents();
        const student = students.find(s => s.id == studentId);
        
        if (!student) {
            showToast('Student not found', 'error');
            return;
        }
        
        const modal = document.getElementById('edit-student-modal');
        document.getElementById('edit-student-id').value = student.id;
        document.getElementById('edit-student-name').value = student.User?.name || '';
        document.getElementById('edit-student-email').value = student.User?.email || '';
        document.getElementById('edit-student-grade').value = student.grade || '';
        document.getElementById('edit-student-status').value = student.status || 'active';
        
        modal.classList.remove('hidden');
    } catch (error) {
        console.error('Error editing student:', error);
        showToast('Failed to load student data', 'error');
    } finally {
        hideLoading();
    }
}

async function suspendStudent(studentId, studentName) {
    const reason = prompt(`Enter reason for suspending ${studentName}:`);
    if (!reason) return;
    
    if (!confirm(`Are you sure you want to suspend ${studentName}?`)) return;
    
    showLoading();
    try {
        const response = await api.admin.suspendStudent(studentId, { reason });
        showToast(`✅ ${studentName} suspended`, 'success');
        await refreshAdminStudentList();
    } catch (error) {
        showToast(error.message || 'Failed to suspend student', 'error');
    } finally {
        hideLoading();
    }
}

// ============ EXPORT ============

window.loadAllStudents = loadAllStudents;
window.refreshAdminStudentList = refreshAdminStudentList;
window.viewStudent = viewStudent;
window.editStudent = editStudent;
window.suspendStudent = suspendStudent;
