// admin-approvals.js - Complete with suspend/reactivate, expel, and class management
// ============ LOAD FUNCTIONS ============

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

async function loadAllTeachers() {
    try {
        const response = await api.admin.getTeachers();
        return response.data || [];
    } catch (error) {
        console.error('Failed to load teachers:', error);
        return [];
    }
}

async function loadAllStudents() {
    try {
        const response = await api.admin.getStudents();
        return response.data || [];
    } catch (error) {
        console.error('Failed to load students:', error);
        return [];
    }
}

async function loadMyStudents() {
    try {
        const response = await api.teacher.getMyStudents();
        return response.data || [];
    } catch (error) {
        console.error('Failed to load my students:', error);
        return [];
    }
}

async function loadAllParents() {
    try {
        const response = await api.admin.getParents();
        return response.data || [];
    } catch (error) {
        console.error('Failed to load parents:', error);
        return [];
    }
}

// ============ TEACHER ACTIONS ============

async function approveTeacher(teacherId) {
    if (!teacherId) return;
    if (!confirm('Approve this teacher? They will receive an Employee ID.')) return;

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

async function suspendTeacher(teacherId) {
    if (!teacherId) return;
    if (!confirm('⚠️ Suspend this teacher?')) return;

    const reason = prompt('Please enter suspension reason:');
    if (reason === null) return;

    showLoading();
    try {
        const response = await api.admin.suspendTeacher(teacherId, reason);
        showToast('✅ Teacher suspended successfully', 'success');

        await refreshTeachersList();
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to suspend teacher', 'error');
    } finally {
        hideLoading();
    }
}

async function reactivateTeacher(teacherId) {
    if (!teacherId) return;
    if (!confirm('Reactivate this teacher?')) return;

    showLoading();
    try {
        const response = await api.admin.reactivateTeacher(teacherId);
        showToast('✅ Teacher reactivated successfully', 'success');

        await refreshTeachersList();
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to reactivate teacher', 'error');
    } finally {
        hideLoading();
    }
}

// ============ TEACHER ACTIVATION/DEACTIVATION ============

// Deactivate teacher (suspend without deleting)
async function deactivateTeacher(teacherId, teacherName) {
    const reason = prompt(`Enter reason for deactivating ${teacherName}:`);
    if (!reason) return;
    
    if (!confirm(`⚠️ Deactivate ${teacherName}? They will not be able to log in.`)) {
        return;
    }
    
    showLoading();
    try {
        const response = await api.admin.deactivateTeacher(teacherId, { reason });
        
        if (response.success) {
            showToast(`✅ ${teacherName} deactivated`, 'success');
            await refreshTeachersList();
            
            // Emit real-time update
            if (typeof emitTeacherUpdate === 'function') {
                emitTeacherUpdate('deactivated', { id: teacherId, name: teacherName, reason });
            }
        }
    } catch (error) {
        showToast(error.message || 'Failed to deactivate teacher', 'error');
    } finally {
        hideLoading();
    }
}

// Activate teacher
async function activateTeacher(teacherId, teacherName) {
    if (!confirm(`Activate ${teacherName}? They will be able to log in again.`)) {
        return;
    }
    
    showLoading();
    try {
        const response = await api.admin.activateTeacher(teacherId);
        
        if (response.success) {
            showToast(`✅ ${teacherName} activated`, 'success');
            await refreshTeachersList();
            
            // Emit real-time update
            if (typeof emitTeacherUpdate === 'function') {
                emitTeacherUpdate('activated', { id: teacherId, name: teacherName });
            }
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

// ============ STUDENT SUSPEND/REACTIVATE/EXPEL FUNCTIONS ============

// Suspend student
async function suspendStudent(studentId, studentName) {
    const reason = prompt(`Enter suspension reason for ${studentName}:`);
    if (!reason) return;
    
    if (!confirm(`⚠️ Are you sure you want to suspend ${studentName}? The student, parents, and teacher will be notified.`)) {
        return;
    }
    
    showLoading();
    try {
        const response = await api.admin.suspendStudent(studentId, { reason });
        
        if (response.success) {
            showToast(`✅ ${studentName} suspended successfully`, 'success');
            await refreshStudentsList();
            
            // Emit real-time update
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
    if (!confirm(`Reactivate ${studentName}? The student will be able to log in again.`)) {
        return;
    }
    
    showLoading();
    try {
        const response = await api.admin.reactivateStudent(studentId);
        
        if (response.success) {
            showToast(`✅ ${studentName} reactivated`, 'success');
            await refreshStudentsList();
            
            // Emit real-time update
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

// Expel student (permanent removal from school)
async function expelStudent(studentId, studentName) {
    const reason = prompt(`Enter reason for expelling ${studentName}:`);
    if (!reason) return;
    
    if (!confirm(`⚠️⚠️ WARNING: This will permanently expel ${studentName} from the school. All data will be archived. Continue?`)) {
        return;
    }
    
    showLoading();
    try {
        const response = await api.admin.expelStudent(studentId, { reason });
        
        if (response.success) {
            showToast(`✅ ${studentName} expelled from school`, 'success');
            await refreshStudentsList();
            
            // Emit real-time update
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

// Delete student (permanent deletion)
async function deleteStudent(studentId, studentName) {
    if (!confirm(`⚠️ Are you sure you want to permanently delete ${studentName}? This action cannot be undone.`)) {
        return;
    }
    
    showLoading();
    try {
        const response = await api.admin.deleteStudent(studentId);
        
        if (response.success) {
            showToast(`✅ ${studentName} deleted successfully`, 'success');
            await refreshStudentsList();
            
            // Emit real-time update
            if (typeof emitStudentUpdate === 'function') {
                emitStudentUpdate('deleted', { id: studentId, name: studentName });
            }
        }
    } catch (error) {
        console.error('Delete error:', error);
        if (error.message.includes('403') || error.message.includes('Forbidden')) {
            showToast('You do not have permission to delete students. Contact super admin.', 'error');
        } else {
            showToast(error.message || 'Failed to delete student', 'error');
        }
    } finally {
        hideLoading();
    }
}

// ============ VIEW TEACHER ============

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

        showTeacherDetailsModal(teacher);
    } catch (error) {
        console.error(error);
        showToast('Failed to load teacher', 'error');
    } finally {
        hideLoading();
    }
}

// ============ STUDENT VIEW ============

async function viewStudent(studentId) {
    if (!studentId) return;

    showLoading();
    try {
        // Try direct API call first
        let student = null;
        
        try {
            const response = await api.admin.getStudentDetails(studentId);
            if (response.success && response.data) {
                student = response.data;
            }
        } catch (directError) {
            console.log('Direct fetch failed, trying fallback');
        }
        
        // Fallback: search in all students
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
        console.error(error);
        showToast(error.message || 'Failed to load student', 'error');
    } finally {
        hideLoading();
    }
}

// ============ EDIT TEACHER - WORKING MODAL ============

async function editTeacher(teacherId) {
    if (!teacherId) return;
    
    showLoading();
    try {
        const teachers = await loadAllTeachers();
        const teacher = teachers.find(t => t?.id == teacherId);

        if (!teacher) {
            showToast('Teacher not found', 'error');
            return;
        }

        showEditTeacherModal(teacher);
    } catch (error) {
        console.error(error);
        showToast('Failed to load teacher data', 'error');
    } finally {
        hideLoading();
    }
}

function showEditTeacherModal(teacher) {
    let modal = document.getElementById('edit-teacher-modal');
    
    if (!modal) {
        createEditTeacherModal();
        modal = document.getElementById('edit-teacher-modal');
    }
    
    const user = teacher.User || {};
    
    // Populate form fields
    document.getElementById('edit-teacher-id').value = teacher.id;
    document.getElementById('edit-teacher-name').value = user.name || '';
    document.getElementById('edit-teacher-email').value = user.email || '';
    document.getElementById('edit-teacher-phone').value = user.phone || '';
    document.getElementById('edit-teacher-department').value = teacher.department || 'general';
    document.getElementById('edit-teacher-subjects').value = (teacher.subjects || []).join(', ');
    document.getElementById('edit-teacher-qualification').value = teacher.qualification || '';
    
    modal.classList.remove('hidden');
    
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

function createEditTeacherModal() {
    const modalHTML = `
        <div id="edit-teacher-modal" class="fixed inset-0 z-50 hidden">
            <div class="absolute inset-0 bg-black/50" onclick="closeEditTeacherModal()"></div>
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4">
                <div class="rounded-xl border bg-card p-6 shadow-xl animate-fade-in">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold">Edit Teacher</h3>
                        <button onclick="closeEditTeacherModal()" class="p-2 hover:bg-accent rounded-lg">
                            <i data-lucide="x" class="h-5 w-5"></i>
                        </button>
                    </div>
                    
                    <input type="hidden" id="edit-teacher-id">
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Full Name</label>
                            <input type="text" id="edit-teacher-name" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Email</label>
                            <input type="email" id="edit-teacher-email" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Phone</label>
                            <input type="tel" id="edit-teacher-phone" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Department</label>
                            <select id="edit-teacher-department" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                                <option value="general">General</option>
                                <option value="mathematics">Mathematics</option>
                                <option value="science">Science</option>
                                <option value="languages">Languages</option>
                                <option value="humanities">Humanities</option>
                                <option value="technical">Technical</option>
                                <option value="sports">Sports</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Subjects (comma separated)</label>
                            <input type="text" id="edit-teacher-subjects" placeholder="Mathematics, Physics, Chemistry" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Qualification</label>
                            <input type="text" id="edit-teacher-qualification" placeholder="e.g., B.Ed, M.Sc" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                    </div>
                    
                    <div class="flex justify-end gap-2 mt-6">
                        <button onclick="closeEditTeacherModal()" class="px-4 py-2 text-sm border rounded-lg hover:bg-accent">Cancel</button>
                        <button onclick="saveTeacherChanges()" class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeEditTeacherModal() {
    const modal = document.getElementById('edit-teacher-modal');
    if (modal) modal.classList.add('hidden');
}

async function saveTeacherChanges() {
    const teacherId = document.getElementById('edit-teacher-id')?.value;
    if (!teacherId) {
        showToast('Teacher ID not found', 'error');
        return;
    }
    
    const subjectsRaw = document.getElementById('edit-teacher-subjects')?.value || '';
    const teacherData = {
        name: document.getElementById('edit-teacher-name')?.value,
        email: document.getElementById('edit-teacher-email')?.value,
        phone: document.getElementById('edit-teacher-phone')?.value,
        department: document.getElementById('edit-teacher-department')?.value,
        subjects: subjectsRaw ? subjectsRaw.split(',').map(s => s.trim()) : [],
        qualification: document.getElementById('edit-teacher-qualification')?.value
    };
    
    if (!teacherData.name) {
        showToast('Teacher name is required', 'error');
        return;
    }
    
    showLoading();
    try {
        const response = await api.admin.updateTeacher(teacherId, teacherData);
        
        if (response.success) {
            showToast('✅ Teacher updated successfully', 'success');
            closeEditTeacherModal();
            await refreshTeachersList();
        }
    } catch (error) {
        showToast(error.message || 'Failed to update teacher', 'error');
    } finally {
        hideLoading();
    }
}

// ============ EDIT STUDENT - WORKING MODAL ============

async function editStudent(studentId) {
    if (!studentId) return;
    
    showLoading();
    try {
        // Try direct API first
        let student = null;
        
        try {
            const response = await api.admin.getStudentDetails(studentId);
            if (response.success && response.data) {
                student = response.data;
            }
        } catch (directError) {
            console.log('Direct fetch failed, falling back to list');
        }
        
        // Fallback to list
        if (!student) {
            const students = await loadAllStudents();
            student = students.find(s => s.id == studentId);
        }
        
        if (!student) {
            showToast('Student not found', 'error');
            return;
        }

        showEditStudentModal(student);
    } catch (error) {
        console.error(error);
        showToast('Failed to load student data', 'error');
    } finally {
        hideLoading();
    }
}

function showEditStudentModal(student) {
    let modal = document.getElementById('edit-student-modal');
    
    if (!modal) {
        createEditStudentModal();
        modal = document.getElementById('edit-student-modal');
    }
    
    const user = student.User || {};
    
    // Populate form fields
    document.getElementById('edit-student-id').value = student.id;
    document.getElementById('edit-student-name').value = user.name || '';
    document.getElementById('edit-student-email').value = user.email || '';
    document.getElementById('edit-student-grade').value = student.grade || '';
    document.getElementById('edit-student-gender').value = student.gender || '';
    document.getElementById('edit-student-dob').value = student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '';
    document.getElementById('edit-student-status').value = student.status || 'active';
    
    // Show/hide suspension reason based on status
    const reasonContainer = document.getElementById('suspension-reason-container');
    if (reasonContainer) {
        if (student.status === 'suspended') {
            reasonContainer.classList.remove('hidden');
            document.getElementById('edit-suspension-reason').value = student.suspensionReason || '';
        } else {
            reasonContainer.classList.add('hidden');
        }
    }
    
    modal.classList.remove('hidden');
    
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

function createEditStudentModal() {
    const modalHTML = `
        <div id="edit-student-modal" class="fixed inset-0 z-50 hidden">
            <div class="absolute inset-0 bg-black/50" onclick="closeEditStudentModal()"></div>
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4">
                <div class="rounded-xl border bg-card p-6 shadow-xl animate-fade-in">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold">Edit Student</h3>
                        <button onclick="closeEditStudentModal()" class="p-2 hover:bg-accent rounded-lg">
                            <i data-lucide="x" class="h-5 w-5"></i>
                        </button>
                    </div>
                    
                    <input type="hidden" id="edit-student-id">
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Full Name</label>
                            <input type="text" id="edit-student-name" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Email (optional)</label>
                            <input type="email" id="edit-student-email" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Grade/Class</label>
                            <input type="text" id="edit-student-grade" placeholder="e.g., 10A, Form 2" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium mb-1">Gender</label>
                                <select id="edit-student-gender" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Date of Birth</label>
                                <input type="date" id="edit-student-dob" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Status</label>
                            <select id="edit-student-status" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" onchange="toggleSuspensionReason(this.value)">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="graduated">Graduated</option>
                                <option value="transferred">Transferred</option>
                                <option value="suspended">Suspended</option>
                            </select>
                        </div>
                        
                        <!-- Suspension Reason (shown when status is suspended) -->
                        <div id="suspension-reason-container" class="hidden">
                            <label class="block text-sm font-medium mb-1">Suspension Reason</label>
                            <textarea id="edit-suspension-reason" rows="2" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="Enter reason for suspension..."></textarea>
                        </div>
                    </div>
                    
                    <div class="flex justify-end gap-2 mt-6">
                        <button onclick="closeEditStudentModal()" class="px-4 py-2 text-sm border rounded-lg hover:bg-accent">Cancel</button>
                        <button onclick="saveStudentChanges()" class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Global function for toggling suspension reason
window.toggleSuspensionReason = function(status) {
    const container = document.getElementById('suspension-reason-container');
    if (container) {
        if (status === 'suspended') {
            container.classList.remove('hidden');
        } else {
            container.classList.add('hidden');
        }
    }
};

function closeEditStudentModal() {
    const modal = document.getElementById('edit-student-modal');
    if (modal) modal.classList.add('hidden');
}

async function saveStudentChanges() {
    const studentId = document.getElementById('edit-student-id')?.value;
    if (!studentId) {
        showToast('Student ID not found', 'error');
        return;
    }
    
    const status = document.getElementById('edit-student-status')?.value;
    const suspensionReason = document.getElementById('edit-suspension-reason')?.value;
    
    const studentData = {
        name: document.getElementById('edit-student-name')?.value,
        email: document.getElementById('edit-student-email')?.value,
        grade: document.getElementById('edit-student-grade')?.value,
        gender: document.getElementById('edit-student-gender')?.value,
        dateOfBirth: document.getElementById('edit-student-dob')?.value,
        status: status
    };
    
    // Add suspension reason if status is suspended
    if (status === 'suspended' && suspensionReason) {
        studentData.suspensionReason = suspensionReason;
    }
    
    if (!studentData.name || !studentData.grade) {
        showToast('Name and grade are required', 'error');
        return;
    }
    
    showLoading();
    try {
        const response = await api.admin.updateStudent(studentId, studentData);
        
        if (response.success) {
            showToast('✅ Student updated successfully', 'success');
            closeEditStudentModal();
            await refreshStudentsList();
        }
    } catch (error) {
        showToast(error.message || 'Failed to update student', 'error');
    } finally {
        hideLoading();
    }
}

// ============ RENDER FUNCTIONS ============

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
                            <tr class="hover:bg-accent/50 transition-colors" data-teacher-id="${teacher.id}">
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
                                    <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium 
                                        ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}">
                                        ${status}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-right">
                                    <div class="flex items-center justify-end gap-1">
                                        <button onclick="viewTeacher('${teacher.id}')" class="p-2 hover:bg-accent rounded-lg" title="View">
                                            <i data-lucide="eye" class="h-4 w-4"></i>
                                        </button>
                                        <button onclick="editTeacher('${teacher.id}')" class="p-2 hover:bg-accent rounded-lg" title="Edit">
                                            <i data-lucide="edit" class="h-4 w-4"></i>
                                        </button>
                                        ${isActive ? 
                                            `<button onclick="deactivateTeacher('${teacher.id}', '${user.name}')" 
                                                    class="p-2 hover:bg-yellow-100 rounded-lg text-yellow-600" title="Deactivate">
                                                <i data-lucide="pause-circle" class="h-4 w-4"></i>
                                            </button>` : 
                                            `<button onclick="activateTeacher('${teacher.id}', '${user.name}')" 
                                                    class="p-2 hover:bg-green-100 rounded-lg text-green-600" title="Activate">
                                                <i data-lucide="play-circle" class="h-4 w-4"></i>
                                            </button>`
                                        }
                                        <button onclick="removeTeacher('${teacher.id}')" class="p-2 hover:bg-red-100 rounded-lg text-red-600" title="Delete">
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
                                    <div class="flex items-center justify-center gap-2">
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
                                        <button onclick="deleteStudent('${student.id}', '${user.name || 'Unknown'}')" 
                                                class="p-2 hover:bg-red-100 rounded-lg text-red-600" title="Delete">
                                            <i data-lucide="trash-2" class="h-4 w-4"></i>
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

// ============ REFRESH FUNCTIONS ============

async function refreshPendingTeachers() {
    const container = document.getElementById('pending-teachers-container');
    if (!container) return;
    
    const teachers = await loadPendingTeachers();
    container.innerHTML = renderPendingTeachersTable(teachers);
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

async function refreshTeachersList() {
    const container = document.getElementById('teachers-table-container');
    if (!container) return;
    
    const teachers = await loadAllTeachers();
    container.innerHTML = renderTeachersTable(teachers);
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

async function refreshStudentsList() {
    const container = document.getElementById('students-table-body');
    if (!container) return;
    
    const students = await loadAllStudents();
    container.innerHTML = renderStudentsTable(students);
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

// ============ HELPER FUNCTIONS ============

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

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// ============ MODAL FUNCTIONS ============

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
    modal.dataset.studentId = student.id;
    
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

function createStudentDetailsModal() {
    const modalHTML = `
        <div id="student-details-modal" class="fixed inset-0 z-50 hidden">
            <div class="absolute inset-0 bg-black/50" onclick="closeStudentDetailsModal()"></div>
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl p-4">
                <div class="rounded-xl border bg-card shadow-xl overflow-hidden">
                    <div class="bg-gradient-to-r from-primary/10 to-purple-600/10 px-6 py-4 border-b flex justify-between items-center">
                        <h3 class="text-xl font-semibold">Student Details</h3>
                        <button onclick="closeStudentDetailsModal()" class="p-2 hover:bg-accent rounded-lg">
                            <i data-lucide="x" class="h-5 w-5"></i>
                        </button>
                    </div>
                    <div class="modal-content p-6">
                        <!-- Content will be filled dynamically -->
                    </div>
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
            
            <div class="grid grid-cols-2 gap-4">
                <div class="p-3 bg-muted/30 rounded-lg">
                    <p class="text-xs text-muted-foreground">ELIMUID</p>
                    <p class="font-mono text-sm font-bold text-primary">${student.elimuid || 'N/A'}</p>
                </div>
                <div class="p-3 bg-muted/30 rounded-lg">
                    <p class="text-xs text-muted-foreground">Status</p>
                    <p><span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColor}">${status}</span></p>
                </div>
            </div>
            
            <div class="border-t pt-4">
                <h4 class="font-medium mb-2">Personal Information</h4>
                <div class="grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <p class="text-muted-foreground">Grade</p>
                        <p class="font-medium">${student.grade || 'N/A'}</p>
                    </div>
                    <div>
                        <p class="text-muted-foreground">Gender</p>
                        <p>${student.gender || 'Not specified'}</p>
                    </div>
                    <div>
                        <p class="text-muted-foreground">Date of Birth</p>
                        <p>${student.dateOfBirth ? formatDate(student.dateOfBirth) : 'N/A'}</p>
                    </div>
                    <div>
                        <p class="text-muted-foreground">Enrollment Date</p>
                        <p>${student.enrollmentDate ? formatDate(student.enrollmentDate) : 'N/A'}</p>
                    </div>
                </div>
            </div>
            
            <div class="border-t pt-4">
                <h4 class="font-medium mb-2">Academic Information</h4>
                <div class="grid grid-cols-3 gap-3 text-center">
                    <div class="p-2 bg-muted/30 rounded">
                        <p class="text-2xl font-bold text-blue-600">${student.attendance || 95}%</p>
                        <p class="text-xs text-muted-foreground">Attendance</p>
                    </div>
                    <div class="p-2 bg-muted/30 rounded">
                        <p class="text-2xl font-bold text-green-600">${student.average || 0}%</p>
                        <p class="text-xs text-muted-foreground">Average</p>
                    </div>
                    <div class="p-2 bg-muted/30 rounded">
                        <p class="text-2xl font-bold text-purple-600">${student.subjects || 0}</p>
                        <p class="text-xs text-muted-foreground">Subjects</p>
                    </div>
                </div>
            </div>
            
            <div class="border-t pt-4">
                <h4 class="font-medium mb-2">Parents/Guardians</h4>
                ${student.parents && student.parents.length > 0 ? 
                    student.parents.map(p => `
                        <div class="p-2 bg-muted/30 rounded mb-2">
                            <p class="font-medium">${p.User?.name || 'Unknown'}</p>
                            <p class="text-xs text-muted-foreground">${p.User?.email || ''} • ${p.relationship || 'guardian'}</p>
                        </div>
                    `).join('') : 
                    '<p class="text-sm text-muted-foreground">No parents linked</p>'}
            </div>
            
            <div class="border-t pt-4">
                <h4 class="font-medium mb-2">Assigned Teacher</h4>
                ${student.teacher ? 
                    `<div class="p-2 bg-muted/30 rounded">
                        <p class="font-medium">${student.teacher.User?.name || 'Unknown'}</p>
                        <p class="text-xs text-muted-foreground">${student.teacher.User?.email || ''}</p>
                    </div>` : 
                    '<p class="text-sm text-muted-foreground">No teacher assigned</p>'}
            </div>
            
            <div class="flex justify-end gap-2 pt-4 border-t">
                <button onclick="closeStudentDetailsModal()" class="px-4 py-2 text-sm border rounded-lg hover:bg-accent">Close</button>
                <button onclick="editStudent('${student.id}')" class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Edit Student</button>
                <button onclick="copyElimuid('${student.elimuid}')" class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
                    <i data-lucide="copy" class="h-4 w-4"></i>
                    Copy
                </button>
            </div>
        </div>
    `;
}

function showTeacherDetailsModal(teacher) {
    const user = teacher.User || {};
    const subjects = teacher.subjects || [];
    
    let modal = document.getElementById('teacher-details-modal');
    
    if (!modal) {
        createTeacherDetailsModal();
        modal = document.getElementById('teacher-details-modal');
    }
    
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.innerHTML = `
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
                            <p><span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${teacher.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}">
                                ${teacher.isActive ? 'Active' : 'Inactive'}
                            </span></p>
                        </div>
                    </div>
                </div>
                
                <div class="border-t pt-4">
                    <h4 class="font-medium mb-2">Subjects</h4>
                    <div class="flex flex-wrap gap-2">
                        ${subjects.map(subject => `
                            <span class="px-2 py-1 bg-muted/30 rounded text-xs">${subject}</span>
                        `).join('')}
                        ${subjects.length === 0 ? '<p class="text-sm text-muted-foreground">No subjects assigned</p>' : ''}
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
    
    modal.classList.remove('hidden');
    
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

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

function closeTeacherDetailsModal() {
    const modal = document.getElementById('teacher-details-modal');
    if (modal) modal.classList.add('hidden');
}

// ============ EXPORT FUNCTIONS ============

window.suspendTeacher = suspendTeacher;
window.reactivateTeacher = reactivateTeacher;
window.deactivateTeacher = deactivateTeacher;
window.activateTeacher = activateTeacher;
window.removeTeacher = removeTeacher;
window.suspendStudent = suspendStudent;
window.reactivateStudent = reactivateStudent;
window.expelStudent = expelStudent;
window.deleteStudent = deleteStudent;
window.loadPendingTeachers = loadPendingTeachers;
window.loadAllTeachers = loadAllTeachers;
window.loadAllStudents = loadAllStudents;
window.loadMyStudents = loadMyStudents;
window.loadAllParents = loadAllParents;
window.approveTeacher = approveTeacher;
window.rejectTeacher = rejectTeacher;
window.viewTeacher = viewTeacher;
window.viewStudent = viewStudent;
window.editTeacher = editTeacher;
window.editStudent = editStudent;
window.saveTeacherChanges = saveTeacherChanges;
window.saveStudentChanges = saveStudentChanges;
window.closeEditTeacherModal = closeEditTeacherModal;
window.closeEditStudentModal = closeEditStudentModal;
window.closeTeacherDetailsModal = closeTeacherDetailsModal;
window.refreshPendingTeachers = refreshPendingTeachers;
window.refreshTeachersList = refreshTeachersList;
window.refreshStudentsList = refreshStudentsList;
window.copyElimuid = copyElimuid;
window.timeAgo = timeAgo;
window.getInitials = getInitials;
window.formatDate = formatDate;
window.getCurrentUser = getCurrentUser;
window.getStatusColor = getStatusColor;
