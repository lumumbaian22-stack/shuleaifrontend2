// teacher-student-management.js - Complete teacher student management

// ============ LOAD STUDENTS ============

// Load teacher's students
async function loadMyStudents() {
    try {
        console.log('📥 Loading teacher students...');
        const response = await api.teacher.getMyStudents();
        console.log('✅ Teacher students loaded:', response.data);
        return response.data || [];
    } catch (error) {
        console.error('❌ Failed to load students:', error);
        showToast(error.message || 'Failed to load students', 'error');
        return [];
    }
}

// Refresh teacher student list
async function refreshTeacherStudentList() {
    const container = document.getElementById('teacher-students-table-body');
    if (!container) {
        console.warn('⚠️ Teacher student table container not found');
        return;
    }
    
    try {
        container.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center">Loading...</td></tr>';
        
        const students = await loadMyStudents();
        
        if (!students || students.length === 0) {
            container.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-muted-foreground">No students in your class yet</td></tr>';
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
                <td class="px-4 py-3">${student.grade || 'N/A'}</td>
                <td class="px-4 py-3">
                    <span class="font-mono text-xs bg-muted px-2 py-1 rounded">${student.elimuid || 'N/A'}</span>
                </td>
                <td class="px-4 py-3">${student.attendance || 95}%</td>
                <td class="px-4 py-3">
                    <span class="font-semibold ${(student.average || 0) > 80 ? 'text-green-600' : (student.average || 0) > 60 ? 'text-yellow-600' : 'text-red-600'}">${student.average || 0}%</span>
                </td>
                <td class="px-4 py-3 text-right">
                    <button onclick="viewStudentDetails('${student.id}')" class="p-2 hover:bg-accent rounded-lg">
                        <i data-lucide="eye" class="h-4 w-4"></i>
                    </button>
                    <button onclick="copyElimuid('${student.elimuid}')" class="p-2 hover:bg-accent rounded-lg">
                        <i data-lucide="copy" class="h-4 w-4"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
        // Update stats
        const countEl = document.getElementById('my-students-count');
        if (countEl) countEl.textContent = students.length;
        
        // Reinitialize icons
        if (window.lucide) lucide.createIcons();
        
    } catch (error) {
        console.error('Error refreshing teacher student list:', error);
        container.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-red-500">Error loading students</td></tr>';
    }
}

// ============ ADD STUDENT MODAL ============

function showAddStudentModal() {
    const modal = document.getElementById('add-student-modal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeAddStudentModal() {
    const modal = document.getElementById('add-student-modal');
    if (modal) {
        modal.classList.add('hidden');
        // Clear form
        document.getElementById('modal-student-name').value = '';
        document.getElementById('modal-student-grade').value = '';
        document.getElementById('modal-parent-email').value = '';
        document.getElementById('modal-student-dob').value = '';
        document.getElementById('modal-student-gender').value = '';
    }
}

async function handleAddStudentModal() {
    const studentData = {
        name: document.getElementById('modal-student-name')?.value,
        grade: document.getElementById('modal-student-grade')?.value,
        parentEmail: document.getElementById('modal-parent-email')?.value,
        dateOfBirth: document.getElementById('modal-student-dob')?.value,
        gender: document.getElementById('modal-student-gender')?.value
    };
    
    if (!studentData.name || !studentData.grade) {
        showToast('Name and grade are required', 'error');
        return;
    }
    
    showLoading();
    try {
        const response = await api.teacher.addStudent(studentData);
        showToast(`✅ Student added! ELIMUID: ${response.data.elimuid}`, 'success');
        closeAddStudentModal();
        await refreshTeacherStudentList();
    } catch (error) {
        showToast(error.message || 'Failed to add student', 'error');
    } finally {
        hideLoading();
    }
}

// ============ STUDENT DETAILS ============

async function viewStudentDetails(studentId) {
    showLoading();
    try {
        // Try admin endpoint first, fallback to teacher
        let student = null;
        
        try {
            const response = await api.admin.getStudentDetails(studentId);
            if (response.success) student = response.data;
        } catch (e) {
            // Fallback to loading from teacher list
            const students = await loadMyStudents();
            student = students.find(s => s.id == studentId);
        }
        
        if (!student) {
            showToast('Student not found', 'error');
            return;
        }
        
        showStudentDetailsModal(student);
    } catch (error) {
        console.error('Error loading student details:', error);
        showToast('Failed to load student details', 'error');
    } finally {
        hideLoading();
    }
}

function showStudentDetailsModal(student) {
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
        </div>
    `;
    
    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
}

function closeStudentDetailsModal() {
    document.getElementById('student-details-modal').classList.add('hidden');
}

// ============ EXPORT ============

window.loadMyStudents = loadMyStudents;
window.refreshTeacherStudentList = refreshTeacherStudentList;
window.showAddStudentModal = showAddStudentModal;
window.closeAddStudentModal = closeAddStudentModal;
window.handleAddStudentModal = handleAddStudentModal;
window.viewStudentDetails = viewStudentDetails;
window.closeStudentDetailsModal = closeStudentDetailsModal;
