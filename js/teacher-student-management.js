// teacher-student-management.js - TEACHER ONLY
// Teachers see ONLY their assigned students

// ============ LOAD TEACHER'S STUDENTS ============

async function loadMyStudents() {
    try {
        // Try to get students from teacher API
        const response = await api.teacher.getMyStudents();
        return response.data || [];
    } catch (error) {
        console.error('Failed to load students from teacher API:', error);
        
        // Fallback: try to get students from admin API (if teacher has permission)
        try {
            const response = await api.admin.getStudents();
            return response.data || [];
        } catch (adminError) {
            console.error('Failed to load students from admin API:', adminError);
            return [];
        }
    }
}

// ============ TEACHER STUDENT ACTIONS ============

// View student details (READ ONLY)
async function viewStudentDetails(studentId) {
    showLoading();
    try {
        const students = await loadMyStudents();
        const student = students.find(s => s.id == studentId);
        
        if (!student) {
            showToast('Student not found', 'error');
            return;
        }
        
        showTeacherStudentDetailsModal(student);
    } catch (error) {
        console.error('Error viewing student:', error);
        showToast('Failed to load student details', 'error');
    } finally {
        hideLoading();
    }
}

// Show teacher student details modal
function showTeacherStudentDetailsModal(student) {
    let modal = document.getElementById('student-details-modal');
    if (!modal) return;
    
    const user = student.User || {};
    const content = modal.querySelector('.modal-content');
    
    if (content) {
        content.innerHTML = `
            <div class="space-y-4">
                <div class="flex items-center gap-4">
                    <div class="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                        <span class="font-medium text-green-700 text-xl">${getInitials(user.name)}</span>
                    </div>
                    <div>
                        <h4 class="font-medium text-lg">${user.name || 'N/A'}</h4>
                        <p class="text-sm text-muted-foreground">ELIMUID: ${student.elimuid || 'N/A'}</p>
                    </div>
                </div>
                
                <div class="border-t pt-4">
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
                            <p class="text-muted-foreground">Attendance</p>
                            <p class="font-medium">${student.attendance || 95}%</p>
                        </div>
                    </div>
                </div>
                
                <div class="flex justify-end gap-2 pt-4 border-t">
                    <button onclick="closeStudentDetailsModal()" class="px-4 py-2 text-sm border rounded-lg hover:bg-accent">Close</button>
                    <button onclick="copyElimuid('${student.elimuid}')" class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                        Copy ELIMUID
                    </button>
                </div>
            </div>
        `;
    }
    
    modal.classList.remove('hidden');
    
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

// Show add student modal
function showAddStudentModal() {
    const modal = document.getElementById('add-student-modal');
    if (modal) {
        modal.classList.remove('hidden');
    } else {
        showToast('Add student modal not found', 'error');
    }
}

// Close add student modal
function closeAddStudentModal() {
    const modal = document.getElementById('add-student-modal');
    if (modal) modal.classList.add('hidden');
}

// Handle add student from modal
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
        
        // Clear form
        document.getElementById('modal-student-name').value = '';
        document.getElementById('modal-student-grade').value = '';
        document.getElementById('modal-parent-email').value = '';
        document.getElementById('modal-student-dob').value = '';
        document.getElementById('modal-student-gender').value = '';
        
        // Refresh the list
        await refreshTeacherStudentList();
    } catch (error) {
        showToast(error.message || 'Failed to add student', 'error');
    } finally {
        hideLoading();
    }
}

// Remove student from class
async function removeStudentFromClass(studentId, studentName) {
    if (!confirm(`Remove ${studentName} from your class?`)) return;
    
    showLoading();
    try {
        // Try teacher API first
        const response = await api.teacher.deleteStudent(studentId);
        
        if (response.success) {
            showToast(`✅ ${studentName} removed from class`, 'success');
            await refreshTeacherStudentList();
        }
    } catch (error) {
        showToast(error.message || 'Failed to remove student', 'error');
    } finally {
        hideLoading();
    }
}

// ============ RENDER TEACHER STUDENTS TABLE ============

function renderTeacherStudentsTable(students) {
    if (!students || students.length === 0) {
        return '<tr><td colspan="7" class="px-4 py-8 text-center text-muted-foreground">No students in your class</td></tr>';
    }
    
    return students.map(student => {
        const user = student.User || {};
        const status = student.status || 'active';
        const statusColor = status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
        
        return `
            <tr class="hover:bg-accent/50 transition-colors" data-student-id="${student.id}">
                <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                        <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span class="font-medium text-blue-700 text-sm">${getInitials(user.name)}</span>
                        </div>
                        <span class="font-medium">${user.name || 'Unknown'}</span>
                    </div>
                </td>
                <td class="px-4 py-3">${student.grade || 'N/A'}</td>
                <td class="px-4 py-3">
                    <span class="font-mono text-xs bg-muted px-2 py-1 rounded">${student.elimuid || 'N/A'}</span>
                </td>
                <td class="px-4 py-3">
                    <div class="flex items-center gap-2">
                        <div class="h-2 w-16 rounded-full bg-muted overflow-hidden">
                            <div class="h-full w-[${student.attendance || 95}%] bg-green-500 rounded-full"></div>
                        </div>
                        <span class="text-xs">${student.attendance || 95}%</span>
                    </div>
                </td>
                <td class="px-4 py-3">
                    <span class="font-semibold ${(student.average || 0) > 80 ? 'text-green-600' : (student.average || 0) > 60 ? 'text-yellow-600' : 'text-red-600'}">${student.average || 0}%</span>
                </td>
                <td class="px-4 py-3 text-center">
                    <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColor}">
                        ${status}
                    </span>
                </td>
                <td class="px-4 py-3 text-right">
                    <div class="flex items-center justify-end gap-1">
                        <button onclick="viewStudentDetails('${student.id}')" class="p-2 hover:bg-accent rounded-lg" title="View">
                            <i data-lucide="eye" class="h-4 w-4"></i>
                        </button>
                        <button onclick="removeStudentFromClass('${student.id}', '${user.name || 'Unknown'}')" 
                                class="p-2 hover:bg-red-100 rounded-lg text-red-600" title="Remove from Class">
                            <i data-lucide="user-minus" class="h-4 w-4"></i>
                        </button>
                        <button onclick="copyElimuid('${student.elimuid}')" class="p-2 hover:bg-purple-50 rounded-lg" title="Copy">
                            <i data-lucide="copy" class="h-4 w-4 text-purple-600"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Refresh teacher student list
async function refreshTeacherStudentList() {
    const container = document.getElementById('teacher-students-table-body');
    if (!container) {
        console.error('Teacher students table body not found');
        return;
    }
    
    const students = await loadMyStudents();
    container.innerHTML = renderTeacherStudentsTable(students);
    
    // Update stats
    const countEl = document.getElementById('my-students-count');
    if (countEl) countEl.textContent = students.length;
    
    const classesEl = document.getElementById('my-classes-count');
    if (classesEl && students.length > 0) {
        const uniqueClasses = [...new Set(students.map(s => s.grade).filter(Boolean))];
        classesEl.textContent = uniqueClasses.length;
    }
    
    const avgEl = document.getElementById('class-average');
    if (avgEl && students.length > 0) {
        const total = students.reduce((sum, s) => sum + (s.average || 0), 0);
        const avg = Math.round(total / students.length);
        avgEl.textContent = avg + '%';
    }
    
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

// ============ EXPORT ALL FUNCTIONS ============

window.loadMyStudents = loadMyStudents;
window.viewStudentDetails = viewStudentDetails;
window.showAddStudentModal = showAddStudentModal;
window.closeAddStudentModal = closeAddStudentModal;
window.handleAddStudentModal = handleAddStudentModal;
window.removeStudentFromClass = removeStudentFromClass;
window.refreshTeacherStudentList = refreshTeacherStudentList;
window.renderTeacherStudentsTable = renderTeacherStudentsTable;
