// admin-approvals.js - Complete fixed version with working view and edit functions for both teachers and students

// View student details (using the new admin endpoint)
async function viewStudent(studentId) {
    showLoading();
    try {
        // Use the new admin endpoint instead of loading all students
        const response = await api.admin.getStudentDetails(studentId);
        
        if (!response || !response.data) {
            showToast('Student not found', 'error');
            return;
        }
        
        showStudentDetailsModal(response.data);
    } catch (error) {
        console.error('Error viewing student:', error);
        showToast('Failed to load student details: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

// ============ LOAD FUNCTIONS ============

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

// ============ TEACHER ACTIONS ============

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

// ============ TEACHER SUSPEND/REMOVE FUNCTIONS ============

// Suspend teacher
async function suspendTeacher(teacherId) {
    if (!confirm('⚠️ Suspend this teacher? They will not be able to log in until reactivated.')) {
        return;
    }
    
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

// Reactivate teacher
async function reactivateTeacher(teacherId) {
    if (!confirm('Reactivate this teacher? They will be able to log in again.')) {
        return;
    }
    
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

// Remove/Delete teacher permanently
async function removeTeacher(teacherId) {
    if (!confirm('⚠️⚠️⚠️ PERMANENT ACTION: Delete this teacher forever? This cannot be undone!')) {
        return;
    }
    
    const confirmText = prompt('Type "DELETE" to confirm permanent removal:');
    if (confirmText !== 'DELETE') {
        showToast('Action cancelled', 'info');
        return;
    }
    
    showLoading();
    try {
        const response = await api.admin.deleteTeacher(teacherId);
        showToast('✅ Teacher permanently removed', 'success');
        await refreshTeachersList();
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to remove teacher', 'error');
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

// ============ TEACHER DETAILS MODAL ============

// View teacher details
async function viewTeacher(teacherId) {
    showLoading();
    try {
        const teachers = await loadAllTeachers();
        const teacher = teachers.find(t => t.id == teacherId);
        
        if (!teacher) {
            showToast('Teacher not found', 'error');
            return;
        }
        
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
    let modal = document.getElementById('teacher-details-modal');
    
    if (!modal) {
        createTeacherDetailsModal();
        modal = document.getElementById('teacher-details-modal');
    }
    
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

// ============ EDIT TEACHER FUNCTIONS ============

// Edit teacher
async function editTeacher(teacherId) {
    showLoading();
    try {
        const teachers = await loadAllTeachers();
        const teacher = teachers.find(t => t.id == teacherId);
        
        if (!teacher) {
            showToast('Teacher not found', 'error');
            return;
        }
        
        showEditTeacherModal(teacher);
    } catch (error) {
        console.error('Error loading teacher for edit:', error);
        showToast('Failed to load teacher data', 'error');
    } finally {
        hideLoading();
    }
}

// Show edit teacher modal
function showEditTeacherModal(teacher) {
    let modal = document.getElementById('edit-teacher-modal');
    
    if (!modal) {
        createEditTeacherModal();
        modal = document.getElementById('edit-teacher-modal');
    }
    
    const user = teacher.User || {};
    
    // Populate form with teacher data
    document.getElementById('edit-teacher-id').value = teacher.id;
    document.getElementById('edit-teacher-name').value = user.name || '';
    document.getElementById('edit-teacher-email').value = user.email || '';
    document.getElementById('edit-teacher-phone').value = user.phone || '';
    document.getElementById('edit-teacher-department').value = teacher.department || 'general';
    document.getElementById('edit-teacher-subjects').value = (teacher.subjects || []).join(', ');
    document.getElementById('edit-teacher-qualification').value = teacher.qualification || '';
    
    modal.classList.remove('hidden');
}

// Create edit teacher modal
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
                        <button onclick="handleUpdateTeacher()" class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Update Teacher</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Close edit teacher modal
function closeEditTeacherModal() {
    const modal = document.getElementById('edit-teacher-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Handle update teacher
async function handleUpdateTeacher() {
    const teacherId = document.getElementById('edit-teacher-id')?.value;
    
    if (!teacherId) {
        showToast('Teacher ID not found', 'error');
        return;
    }
    
    const subjects = document.getElementById('edit-teacher-subjects')?.value;
    const teacherData = {
        name: document.getElementById('edit-teacher-name')?.value,
        email: document.getElementById('edit-teacher-email')?.value,
        phone: document.getElementById('edit-teacher-phone')?.value,
        department: document.getElementById('edit-teacher-department')?.value,
        subjects: subjects ? subjects.split(',').map(s => s.trim()) : [],
        qualification: document.getElementById('edit-teacher-qualification')?.value
    };
    
    if (!teacherData.name) {
        showToast('Teacher name is required', 'error');
        return;
    }
    
    await updateTeacher(teacherId, teacherData);
    closeEditTeacherModal();
}

// Update teacher
async function updateTeacher(teacherId, teacherData) {
    showLoading();
    try {
        // Assuming you have an API endpoint for updating teachers
        const response = await api.admin.updateTeacher(teacherId, teacherData);
        showToast('✅ Teacher updated successfully', 'success');
        await refreshTeachersList();
        return response;
    } catch (error) {
        console.error('Update teacher error:', error);
        showToast(error.message || 'Failed to update teacher', 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

// ============ STUDENT DETAILS MODAL ============

// View student details
async function viewStudent(studentId) {
    console.log('🔵 viewStudent called with ID:', studentId);
    console.log('Stack trace:', new Error().stack);
    showLoading();
    try {
        console.log('📥 Loading all students...');
        const students = await loadAllStudents();
        console.log('📥 Loaded students:', students);
        
        if (!students || students.length === 0) {
            console.log('❌ No students loaded');
            showToast('No students available', 'error');
            return;
        }
        
        console.log('🔍 Looking for student with ID:', studentId, '(type:', typeof studentId, ')');
        const student = students.find(s => {
            console.log('Comparing:', s.id, '(', typeof s.id, ') with', studentId, '(', typeof studentId, ')');
            return s.id == studentId;
        });
        
        console.log('🎯 Found student:', student);
        
        if (!student) {
            console.log('❌ Student not found');
            showToast('Student not found', 'error');
            return;
        }
        
        console.log('✅ Student found, showing modal');
        showStudentDetailsModal(student);
    } catch (error) {
        console.error('❌ Error viewing student:', error);
        showToast('Failed to load student details: ' + error.message, 'error');
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
                <button onclick="editStudent('${student.id}')" class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Edit Student</button>
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

// ============ EDIT STUDENT FUNCTIONS ============

// Edit student
async function editStudent(studentId) {
    showLoading();
    try {
        const students = await loadAllStudents();
        const student = students.find(s => s.id == studentId);
        
        if (!student) {
            showToast('Student not found', 'error');
            return;
        }
        
        showEditStudentModal(student);
    } catch (error) {
        console.error('Error loading student for edit:', error);
        showToast('Failed to load student data', 'error');
    } finally {
        hideLoading();
    }
}

// Show edit student modal
function showEditStudentModal(student) {
    let modal = document.getElementById('edit-student-modal');
    
    if (!modal) {
        createEditStudentModal();
        modal = document.getElementById('edit-student-modal');
    }
    
    const user = student.User || {};
    
    // Populate form with student data
    document.getElementById('edit-student-id').value = student.id;
    document.getElementById('edit-student-name').value = user.name || '';
    document.getElementById('edit-student-email').value = user.email || '';
    document.getElementById('edit-student-grade').value = student.grade || '';
    document.getElementById('edit-student-gender').value = student.gender || '';
    document.getElementById('edit-student-dob').value = student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '';
    document.getElementById('edit-student-status').value = student.status || 'active';
    
    modal.classList.remove('hidden');
}

// Create edit student modal
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
                        <div>
                            <label class="block text-sm font-medium mb-1">Status</label>
                            <select id="edit-student-status" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="graduated">Graduated</option>
                                <option value="transferred">Transferred</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="flex justify-end gap-2 mt-6">
                        <button onclick="closeEditStudentModal()" class="px-4 py-2 text-sm border rounded-lg hover:bg-accent">Cancel</button>
                        <button onclick="handleUpdateStudent()" class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Update Student</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Close edit student modal
function closeEditStudentModal() {
    const modal = document.getElementById('edit-student-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Handle update student
async function handleUpdateStudent() {
    const studentId = document.getElementById('edit-student-id')?.value;
    
    if (!studentId) {
        showToast('Student ID not found', 'error');
        return;
    }
    
    const studentData = {
        name: document.getElementById('edit-student-name')?.value,
        email: document.getElementById('edit-student-email')?.value,
        grade: document.getElementById('edit-student-grade')?.value,
        gender: document.getElementById('edit-student-gender')?.value,
        dateOfBirth: document.getElementById('edit-student-dob')?.value,
        status: document.getElementById('edit-student-status')?.value
    };
    
    if (!studentData.name || !studentData.grade) {
        showToast('Name and grade are required', 'error');
        return;
    }
    
    await updateStudent(studentId, studentData);
    closeEditStudentModal();
}

// Update student
async function updateStudent(studentId, studentData) {
    showLoading();
    try {
        // Assuming you have an API endpoint for updating students
        const response = await api.admin.updateStudent(studentId, studentData);
        showToast('✅ Student updated successfully', 'success');
        await refreshStudentsList();
        return response;
    } catch (error) {
        console.error('Update student error:', error);
        showToast(error.message || 'Failed to update student', 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

// ============ RENDER FUNCTIONS ============

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
                                    <button onclick="editStudent('${student.id}')" class="p-2 hover:bg-accent rounded-lg">
                                        <i data-lucide="edit" class="h-4 w-4"></i>
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

// ============ REFRESH FUNCTIONS ============

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

// Helper function for formatting dates
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// ============ EXPORT FUNCTIONS ============

window.loadPendingTeachers = loadPendingTeachers;
window.loadAllTeachers = loadAllTeachers;
window.loadAllStudents = loadAllStudents;
window.loadAllParents = loadAllParents;
window.approveTeacher = approveTeacher;
window.rejectTeacher = rejectTeacher;
window.viewTeacher = viewTeacher;
window.editTeacher = editTeacher;
window.viewStudent = viewStudent;
window.editStudent = editStudent;
window.closeTeacherDetailsModal = closeTeacherDetailsModal;
window.closeStudentDetailsModal = closeStudentDetailsModal;
window.closeEditTeacherModal = closeEditTeacherModal;
window.closeEditStudentModal = closeEditStudentModal;
window.handleUpdateTeacher = handleUpdateTeacher;
window.handleUpdateStudent = handleUpdateStudent;
window.renderPendingTeachersTable = renderPendingTeachersTable;
window.renderTeachersTable = renderTeachersTable;
window.renderStudentsTable = renderStudentsTable;
window.refreshPendingTeachers = refreshPendingTeachers;
window.refreshTeachersList = refreshTeachersList;
window.refreshStudentsList = refreshStudentsList;
// Simple fix - redirect any calls to viewStudentDetails
window.viewStudentDetails = function(studentId) {
    console.log('Redirecting to viewStudent');
    return window.viewStudent(studentId);
};
