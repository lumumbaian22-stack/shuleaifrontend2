// admin-student-management.js - ADMIN ONLY
// Admins see ALL students in the school with FULL control

// ============ LOAD ALL STUDENTS ============

async function loadAllStudents() {
    try {
        const response = await api.admin.getStudents();
        return response?.data || [];
    } catch (error) {
        console.error('Failed to load students:', error);
        showToast('Failed to load students', 'error');
        return [];
    }
}

// ============ ADMIN STUDENT ACTIONS ============

// Suspend student (temporary)
async function suspendStudent(studentId, studentName) {
    const reason = prompt(`Enter suspension reason for ${studentName}:`);
    if (!reason) return;
    
    if (!confirm(`⚠️ Suspend ${studentName}? Student will NOT be able to log in.`)) return;
    
    showLoading();
    try {
        const response = await api.admin.suspendStudent(studentId, { reason });
        
        if (response.success) {
            showToast(`✅ ${studentName} suspended`, 'success');
            await refreshAdminStudentList();
            
            // Notify all stakeholders
            if (typeof emitStudentUpdate === 'function') {
                emitStudentUpdate('suspended', { 
                    id: studentId, 
                    name: studentName, 
                    reason,
                    by: 'admin'
                });
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
    if (!confirm(`Reactivate ${studentName}? They will be able to log in again.`)) return;
    
    showLoading();
    try {
        const response = await api.admin.reactivateStudent(studentId);
        
        if (response.success) {
            showToast(`✅ ${studentName} reactivated`, 'success');
            await refreshAdminStudentList();
            
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

// Expel student (permanent removal)
async function expelStudent(studentId, studentName) {
    const reason = prompt(`Enter reason for expelling ${studentName}:`);
    if (!reason) return;
    
    if (!confirm(`⚠️⚠️ PERMANENT: Expel ${studentName} from school? This CANNOT be undone.`)) return;
    
    showLoading();
    try {
        const response = await api.admin.expelStudent(studentId, { reason });
        
        if (response.success) {
            showToast(`✅ ${studentName} expelled`, 'success');
            await refreshAdminStudentList();
            
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

// Edit student details
async function editStudent(studentId) {
    showLoading();
    try {
        const students = await loadAllStudents();
        const student = students.find(s => s.id == studentId);
        
        if (!student) {
            showToast('Student not found', 'error');
            return;
        }
        
        showAdminEditStudentModal(student);
    } catch (error) {
        console.error('Error loading student:', error);
        showToast('Failed to load student data', 'error');
    } finally {
        hideLoading();
    }
}

// Show admin edit student modal
function showAdminEditStudentModal(student) {
    let modal = document.getElementById('admin-edit-student-modal');
    
    if (!modal) {
        createAdminEditStudentModal();
        modal = document.getElementById('admin-edit-student-modal');
    }
    
    const user = student.User || {};
    
    document.getElementById('admin-edit-student-id').value = student.id;
    document.getElementById('admin-edit-student-name').value = user.name || '';
    document.getElementById('admin-edit-student-email').value = user.email || '';
    document.getElementById('admin-edit-student-grade').value = student.grade || '';
    document.getElementById('admin-edit-student-gender').value = student.gender || '';
    document.getElementById('admin-edit-student-dob').value = student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '';
    document.getElementById('admin-edit-student-status').value = student.status || 'active';
    document.getElementById('admin-edit-student-parent').value = student.parentEmail || '';
    
    modal.classList.remove('hidden');
}

// Create admin edit student modal
function createAdminEditStudentModal() {
    const modalHTML = `
        <div id="admin-edit-student-modal" class="fixed inset-0 z-50 hidden">
            <div class="absolute inset-0 bg-black/50" onclick="closeAdminEditStudentModal()"></div>
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4">
                <div class="rounded-xl border bg-card p-6 shadow-xl animate-fade-in">
                    <h3 class="text-lg font-semibold mb-4">Edit Student (Admin)</h3>
                    
                    <input type="hidden" id="admin-edit-student-id">
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Full Name</label>
                            <input type="text" id="admin-edit-student-name" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Email</label>
                            <input type="email" id="admin-edit-student-email" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Grade/Class</label>
                            <input type="text" id="admin-edit-student-grade" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium mb-1">Gender</label>
                                <select id="admin-edit-student-gender" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Date of Birth</label>
                                <input type="date" id="admin-edit-student-dob" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Status</label>
                            <select id="admin-edit-student-status" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                                <option value="active">Active</option>
                                <option value="suspended">Suspended</option>
                                <option value="graduated">Graduated</option>
                                <option value="transferred">Transferred</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Parent Email</label>
                            <input type="email" id="admin-edit-student-parent" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                    </div>
                    
                    <div class="flex justify-end gap-2 mt-6">
                        <button onclick="closeAdminEditStudentModal()" class="px-4 py-2 text-sm border rounded-lg hover:bg-accent">Cancel</button>
                        <button onclick="saveAdminStudentChanges()" class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Save admin student changes
async function saveAdminStudentChanges() {
    const studentId = document.getElementById('admin-edit-student-id')?.value;
    
    const studentData = {
        name: document.getElementById('admin-edit-student-name')?.value,
        email: document.getElementById('admin-edit-student-email')?.value,
        grade: document.getElementById('admin-edit-student-grade')?.value,
        gender: document.getElementById('admin-edit-student-gender')?.value,
        dateOfBirth: document.getElementById('admin-edit-student-dob')?.value,
        status: document.getElementById('admin-edit-student-status')?.value,
        parentEmail: document.getElementById('admin-edit-student-parent')?.value
    };
    
    if (!studentData.name || !studentData.grade) {
        showToast('Name and grade are required', 'error');
        return;
    }
    
    showLoading();
    try {
        const response = await api.admin.updateStudent(studentId, studentData);
        
        if (response.success) {
            showToast('✅ Student updated successfully', 'success');
            closeAdminEditStudentModal();
            await refreshAdminStudentList();
        }
    } catch (error) {
        showToast(error.message || 'Failed to update student', 'error');
    } finally {
        hideLoading();
    }
}

// View student full history
async function viewStudentHistory(studentId, studentName) {
    showLoading();
    try {
        const response = await api.analytics.getStudentAnalytics(studentId);
        
        if (!response || !response.data) {
            showToast('No history data found', 'info');
            return;
        }
        
        showStudentHistoryModal(studentName, response.data);
    } catch (error) {
        console.error('Error loading history:', error);
        showToast('Failed to load student history', 'error');
    } finally {
        hideLoading();
    }
}

// Show student history modal
function showStudentHistoryModal(studentName, data) {
    let modal = document.getElementById('student-history-modal');
    
    if (!modal) {
        createStudentHistoryModal();
        modal = document.getElementById('student-history-modal');
    }
    
    const content = modal.querySelector('.modal-content');
    if (content) {
        content.innerHTML = `
            <h4 class="font-medium mb-4">History for ${studentName}</h4>
            <div class="space-y-4">
                <div>
                    <h5 class="text-sm font-medium mb-2">Attendance History</h5>
                    <div class="space-y-2 max-h-40 overflow-y-auto">
                        ${data.attendance?.records?.map(record => `
                            <div class="flex justify-between text-sm p-2 bg-muted/30 rounded">
                                <span>${record.date}</span>
                                <span class="${record.status === 'present' ? 'text-green-600' : 'text-red-600'}">${record.status}</span>
                            </div>
                        `).join('') || '<p class="text-sm text-muted-foreground">No attendance records</p>'}
                    </div>
                </div>
                <div>
                    <h5 class="text-sm font-medium mb-2">Grade History</h5>
                    <div class="space-y-2 max-h-40 overflow-y-auto">
                        ${data.grades?.map(grade => `
                            <div class="flex justify-between text-sm p-2 bg-muted/30 rounded">
                                <span>${grade.subject}</span>
                                <span class="font-medium">${grade.score}% (${grade.grade})</span>
                            </div>
                        `).join('') || '<p class="text-sm text-muted-foreground">No grade records</p>'}
                    </div>
                </div>
            </div>
        `;
    }
    
    modal.classList.remove('hidden');
    
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

// Create student history modal
function createStudentHistoryModal() {
    const modalHTML = `
        <div id="student-history-modal" class="fixed inset-0 z-50 hidden">
            <div class="absolute inset-0 bg-black/50" onclick="closeStudentHistoryModal()"></div>
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4">
                <div class="rounded-xl border bg-card p-6 shadow-xl animate-fade-in">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold">Student History</h3>
                        <button onclick="closeStudentHistoryModal()" class="p-2 hover:bg-accent rounded-lg">
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

// Close functions
function closeAdminEditStudentModal() {
    const modal = document.getElementById('admin-edit-student-modal');
    if (modal) modal.classList.add('hidden');
}

function closeStudentHistoryModal() {
    const modal = document.getElementById('student-history-modal');
    if (modal) modal.classList.add('hidden');
}

// ============ ADMIN RENDER STUDENTS TABLE ============

function renderAdminStudentsTable(students) {
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
                        const statusColor = status === 'active' ? 'bg-green-100 text-green-700' : 
                                           status === 'suspended' ? 'bg-red-100 text-red-700' : 
                                           'bg-gray-100 text-gray-700';
                        const parentName = student.parents?.map(p => p.User?.name).join(', ') || 'Not linked';
                        const teacherName = student.teacher?.User?.name || 'Not assigned';
                        
                        return `
                            <tr class="hover:bg-accent/50 transition-colors" data-student-id="${student.id}">
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-4">
                                        <div class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-sm">
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
                                        <button onclick="viewStudentHistory('${student.id}', '${user.name || 'Unknown'}')" class="p-2 hover:bg-purple-50 rounded-lg" title="History">
                                            <i data-lucide="history" class="h-4 w-4 text-purple-600"></i>
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

// Refresh admin student list
async function refreshAdminStudentList() {
    const container = document.getElementById('admin-students-table-body');
    if (!container) return;
    
    const students = await loadAllStudents();
    container.innerHTML = renderAdminStudentsTable(students);
    
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

// ============ EXPORT ADMIN FUNCTIONS ============

window.loadAllStudents = loadAllStudents;
window.suspendStudent = suspendStudent;
window.reactivateStudent = reactivateStudent;
window.expelStudent = expelStudent;
window.editStudent = editStudent;
window.viewStudentHistory = viewStudentHistory;
window.refreshAdminStudentList = refreshAdminStudentList;
window.closeAdminEditStudentModal = closeAdminEditStudentModal;
window.closeStudentHistoryModal = closeStudentHistoryModal;
window.saveAdminStudentChanges = saveAdminStudentChanges;
window.renderAdminStudentsTable = renderAdminStudentsTable;
