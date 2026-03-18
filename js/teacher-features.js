// teacher-features.js - COMPLETE WORKING VERSION

// ============ LOAD STUDENTS ============

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
        return [];
    }
}

async function refreshMyStudents() {
    const container = document.getElementById('my-students-table');
    if (!container) return;
    
    const students = await loadMyStudents();
    
    if (students && students.length > 0) {
        container.innerHTML = renderStudentsTable(students);
    } else {
        container.innerHTML = '<div class="text-center py-8 text-muted-foreground">No students in your class yet.</div>';
    }
    
    updateStats(students);
    
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

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
                                <td class="px-4 py-3">${student.grade || 'N/A'}</td>
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
                                        <button onclick="viewStudentDetails('${student.id}')" class="p-2 hover:bg-accent rounded-lg" title="View">
                                            <i data-lucide="eye" class="h-4 w-4"></i>
                                        </button>
                                        <button onclick="deleteStudent('${student.id}', '${user.name || 'Unknown'}')" 
                                                class="p-2 hover:bg-red-100 rounded-lg text-red-600" title="Delete">
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

// Delete student
async function deleteStudent(studentId, studentName) {
    if (!confirm(`Remove ${studentName} from your class?`)) return;
    
    showLoading();
    try {
        const response = await api.teacher.deleteStudent(studentId);
        
        if (response.success) {
            showToast(`✅ ${studentName} removed`, 'success');
            await refreshMyStudents();
        }
    } catch (error) {
        showToast(error.message || 'Failed to delete student', 'error');
    } finally {
        hideLoading();
    }
}

// Export functions
window.loadMyStudents = loadMyStudents;
window.refreshMyStudents = refreshMyStudents;
window.deleteStudent = deleteStudent;
window.renderStudentsTable = renderStudentsTable;
