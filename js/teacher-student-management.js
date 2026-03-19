// teacher-student-management.js - TEACHER ONLY
// Teachers see ONLY their assigned students with LIMITED actions

// ============ LOAD TEACHER'S STUDENTS ============

async function loadMyStudents() {
    try {
        const user = getCurrentUser();
        const response = await api.teacher.getMyStudents();
        let students = response.data || [];
        
        // Filter to only show students in teacher's assigned class
        if (user?.teacherClass) {
            students = students.filter(s => s.grade === user.teacherClass);
        }
        
        return students;
    } catch (error) {
        console.error('Failed to load students:', error);
        showToast('Failed to load students', 'error');
        return [];
    }
}

// ============ TEACHER STUDENT ACTIONS ============

// Remove student from class (NOT delete)
async function removeStudentFromClass(studentId, studentName) {
    if (!confirm(`Remove ${studentName} from your class? They will be reassigned.`)) return;
    
    showLoading();
    try {
        const response = await api.teacher.removeStudentFromClass(studentId);
        
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

// Show teacher student details modal (READ ONLY - no edit)
function showTeacherStudentDetailsModal(student) {
    let modal = document.getElementById('teacher-student-details-modal');
    
    if (!modal) {
        createTeacherStudentDetailsModal();
        modal = document.getElementById('teacher-student-details-modal');
    }
    
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
                
                <div class="border-t pt-4">
                    <p class="text-sm text-muted-foreground">Academic information and grades can be viewed in the Grades section.</p>
                </div>
                
                <div class="flex justify-end gap-2 pt-4 border-t">
                    <button onclick="closeTeacherStudentDetailsModal()" class="px-4 py-2 text-sm border rounded-lg hover:bg-accent">Close</button>
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

// Create teacher student details modal
function createTeacherStudentDetailsModal() {
    const modalHTML = `
        <div id="teacher-student-details-modal" class="fixed inset-0 z-50 hidden">
            <div class="absolute inset-0 bg-black/50" onclick="closeTeacherStudentDetailsModal()"></div>
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4">
                <div class="rounded-xl border bg-card p-6 shadow-xl animate-fade-in">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold">Student Details</h3>
                        <button onclick="closeTeacherStudentDetailsModal()" class="p-2 hover:bg-accent rounded-lg">
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

function closeTeacherStudentDetailsModal() {
    const modal = document.getElementById('teacher-student-details-modal');
    if (modal) modal.classList.add('hidden');
}

// ============ TEACHER RENDER STUDENTS TABLE ============

function renderTeacherStudentsTable(students) {
    if (!students || students.length === 0) {
        return '<div class="text-center py-8 text-muted-foreground">No students in your class</div>';
    }
    
    return `
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-muted/50">
                    <tr>
                        <th class="px-4 py-3 text-left font-medium">Student</th>
                        <th class="px-4 py-3 text-left font-medium">ELIMUID</th>
                        <th class="px-4 py-3 text-left font-medium">Attendance</th>
                        <th class="px-4 py-3 text-left font-medium">Average</th>
                        <th class="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    ${students.map(student => {
                        const user = student.User || {};
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
                                <td class="px-4 py-3 text-right">
                                    <div class="flex items-center justify-end gap-1">
                                        <button onclick="viewStudentDetails('${student.id}')" class="p-2 hover:bg-accent rounded-lg" title="View Details">
                                            <i data-lucide="eye" class="h-4 w-4"></i>
                                        </button>
                                        <button onclick="removeStudentFromClass('${student.id}', '${user.name || 'Unknown'}')" 
                                                class="p-2 hover:bg-red-100 rounded-lg text-red-600" title="Remove from Class">
                                            <i data-lucide="user-minus" class="h-4 w-4"></i>
                                        </button>
                                        <button onclick="copyElimuid('${student.elimuid}')" class="p-2 hover:bg-purple-50 rounded-lg" title="Copy ELIMUID">
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

// Refresh teacher student list
async function refreshTeacherStudentList() {
    const container = document.getElementById('teacher-students-table-body');
    if (!container) return;
    
    const students = await loadMyStudents();
    container.innerHTML = renderTeacherStudentsTable(students);
    
    // Update stats
    updateTeacherStats(students);
    
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

// Update teacher dashboard stats
function updateTeacherStats(students) {
    const countElement = document.getElementById('my-students-count');
    if (countElement) {
        countElement.textContent = students ? students.length : 0;
    }
    
    const classesElement = document.getElementById('my-classes-count');
    if (classesElement && students) {
        const uniqueClasses = [...new Set(students.map(s => s.grade).filter(Boolean))];
        classesElement.textContent = uniqueClasses.length;
    }
    
    const avgElement = document.getElementById('class-average');
    if (avgElement && students && students.length > 0) {
        const total = students.reduce((sum, s) => sum + (s.average || 0), 0);
        const avg = Math.round(total / students.length);
        avgElement.textContent = avg + '%';
    }
}

// ============ EXPORT TEACHER FUNCTIONS ============

window.loadMyStudents = loadMyStudents;
window.removeStudentFromClass = removeStudentFromClass;
window.viewStudentDetails = viewStudentDetails;
window.refreshTeacherStudentList = refreshTeacherStudentList;
window.closeTeacherStudentDetailsModal = closeTeacherStudentDetailsModal;
window.renderTeacherStudentsTable = renderTeacherStudentsTable;
