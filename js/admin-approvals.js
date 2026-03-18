// admin-approvals.js - COMPLETE WITH ALL BUTTONS

// ============ STUDENT SUSPEND/EXPEL FUNCTIONS ============

// Suspend student
async function suspendStudent(studentId, studentName) {
    const reason = prompt(`Enter suspension reason for ${studentName}:`);
    if (!reason) return;
    
    if (!confirm(`⚠️ Suspend ${studentName}? The student will not be able to log in.`)) {
        return;
    }
    
    showLoading();
    try {
        const response = await api.admin.suspendStudent(studentId, { reason });
        
        if (response.success) {
            showToast(`✅ ${studentName} suspended`, 'success');
            await refreshStudentsList();
            
            if (typeof emitStudentUpdate === 'function') {
                emitStudentUpdate('suspended', { id: studentId, name: studentName, reason });
            }
        }
    } catch (error) {
        showToast(error.message || 'Failed to suspend student', 'error');
    } finally {
        hideLoading();
    }
}

// Reactivate student
async function reactivateStudent(studentId, studentName) {
    if (!confirm(`Reactivate ${studentName}? They will be able to log in again.`)) {
        return;
    }
    
    showLoading();
    try {
        const response = await api.admin.reactivateStudent(studentId);
        
        if (response.success) {
            showToast(`✅ ${studentName} reactivated`, 'success');
            await refreshStudentsList();
            
            if (typeof emitStudentUpdate === 'function') {
                emitStudentUpdate('reactivated', { id: studentId, name: studentName });
            }
        }
    } catch (error) {
        showToast(error.message || 'Failed to reactivate student', 'error');
    } finally {
        hideLoading();
    }
}

// Expel student (permanent)
async function expelStudent(studentId, studentName) {
    const reason = prompt(`Enter reason for expelling ${studentName}:`);
    if (!reason) return;
    
    if (!confirm(`⚠️⚠️ PERMANENT: Expel ${studentName} from school? This cannot be undone.`)) {
        return;
    }
    
    showLoading();
    try {
        const response = await api.admin.expelStudent(studentId, { reason });
        
        if (response.success) {
            showToast(`✅ ${studentName} expelled`, 'success');
            await refreshStudentsList();
            
            if (typeof emitStudentUpdate === 'function') {
                emitStudentUpdate('expelled', { id: studentId, name: studentName, reason });
            }
        }
    } catch (error) {
        showToast(error.message || 'Failed to expel student', 'error');
    } finally {
        hideLoading();
    }
}

// ============ VIEW STUDENT - FIXED ============

async function viewStudent(studentId) {
    if (!studentId) return;
    
    showLoading();
    try {
        const user = getCurrentUser();
        let student = null;
        
        // Try direct API first
        try {
            const response = await api.admin.getStudentDetails(studentId);
            if (response.success && response.data) {
                student = response.data;
            }
        } catch (e) {
            console.log('Direct fetch failed, using fallback');
        }
        
        // Fallback to searching
        if (!student) {
            const students = await loadAllStudents();
            student = students.find(s => s.id == studentId);
        }
        
        if (!student) {
            showToast('Student not found', 'error');
            return;
        }
        
        showStudentDetailsModal(student);
    } catch (error) {
        console.error('View student error:', error);
        showToast('Failed to load student details', 'error');
    } finally {
        hideLoading();
    }
}

// ============ RENDER STUDENTS TABLE ============

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
                        <th class="px-6 py-4 text-left font-medium">Parent</th>
                        <th class="px-6 py-4 text-left font-medium">Teacher</th>
                        <th class="px-6 py-4 text-center font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    ${students.map(student => {
                        const user = student.User || {};
                        const status = student.status || 'active';
                        const statusColor = getStatusColor(status);
                        const parentName = student.parents?.map(p => p.User?.name).join(', ') || 'Not linked';
                        const teacherName = student.teacher?.User?.name || 'Not assigned';
                        
                        return `
                            <tr class="hover:bg-accent/50 transition-colors" data-student-id="${student.id}">
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-4">
                                        <div class="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold shadow-sm">
                                            ${getInitials(user.name)}
                                        </div>
                                        <div>
                                            <div class="font-medium">${user.name || 'Unknown'}</div>
                                            <div class="text-xs text-muted-foreground mt-0.5">${user.email || 'No email'}</div>
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
                                <td class="px-6 py-4 text-sm">${parentName}</td>
                                <td class="px-6 py-4 text-sm">${teacherName}</td>
                                <td class="px-6 py-4 text-center">
                                    <div class="flex items-center justify-center gap-1">
                                        <button onclick="viewStudent('${student.id}')" class="p-2 hover:bg-blue-50 rounded-lg" title="View">
                                            <i data-lucide="eye" class="h-4 w-4 text-blue-600"></i>
                                        </button>
                                        <button onclick="editStudent('${student.id}')" class="p-2 hover:bg-amber-50 rounded-lg" title="Edit">
                                            <i data-lucide="edit" class="h-4 w-4 text-amber-600"></i>
                                        </button>
                                        ${status === 'active' ? 
                                            `<button onclick="suspendStudent('${student.id}', '${user.name || 'Unknown'}')" 
                                                    class="p-2 hover:bg-red-50 rounded-lg" title="Suspend">
                                                <i data-lucide="ban" class="h-4 w-4 text-red-600"></i>
                                            </button>` : 
                                            `<button onclick="reactivateStudent('${student.id}', '${user.name || 'Unknown'}')" 
                                                    class="p-2 hover:bg-green-50 rounded-lg" title="Reactivate">
                                                <i data-lucide="check-circle" class="h-4 w-4 text-green-600"></i>
                                            </button>`
                                        }
                                        <button onclick="expelStudent('${student.id}', '${user.name || 'Unknown'}')" 
                                                class="p-2 hover:bg-red-100 rounded-lg text-red-600" title="Expel">
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

// Export all functions
window.suspendStudent = suspendStudent;
window.reactivateStudent = reactivateStudent;
window.expelStudent = expelStudent;
window.viewStudent = viewStudent;
window.refreshStudentsList = refreshStudentsList;
window.getStatusColor = getStatusColor;
