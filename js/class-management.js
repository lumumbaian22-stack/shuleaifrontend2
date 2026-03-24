// class-management.js - COMPLETE WORKING VERSION

// ============ LOAD FUNCTIONS ============

async function loadAllClasses() {
    try {
        const response = await api.admin.getClasses();
        return response.data || [];
    } catch (error) {
        console.error('Failed to load classes:', error);
        showToast('Failed to load classes', 'error');
        return [];
    }
}

async function loadAvailableTeachers() {
    try {
        const response = await api.admin.getAvailableTeachers();
        return response.data || [];
    } catch (error) {
        console.error('Failed to load teachers:', error);
        return [];
    }
}

async function loadSubjectAssignmentsForClass(classId) {
    try {
        const response = await api.admin.getClassSubjectAssignments(classId);
        return response.data || [];
    } catch (error) {
        console.error('Failed to load subject assignments:', error);
        return [];
    }
}

// ============ RENDER CLASS MANAGEMENT ============

async function renderClassManagement() {
    try {
        const [classes, teachers] = await Promise.all([
            loadAllClasses(),
            loadAvailableTeachers()
        ]);
        
        if (!classes || classes.length === 0) {
            return `
                <div class="space-y-6 animate-fade-in">
                    <div class="flex justify-between items-center">
                        <h2 class="text-2xl font-bold">Class Management</h2>
                        <button onclick="showAddClassModal()" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
                            <i data-lucide="plus" class="h-4 w-4"></i>
                            Add New Class
                        </button>
                    </div>
                    <div class="text-center py-12 border rounded-lg bg-card">
                        <i data-lucide="school" class="h-12 w-12 mx-auto text-muted-foreground mb-4"></i>
                        <p class="text-muted-foreground">No classes found. Click "Add New Class" to create your first class.</p>
                    </div>
                </div>
            `;
        }
        
        let html = `
            <div class="space-y-6 animate-fade-in">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold">Class Management</h2>
                    <button onclick="showAddClassModal()" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
                        <i data-lucide="plus" class="h-4 w-4"></i>
                        Add New Class
                    </button>
                </div>
                
                <div class="grid gap-4">
        `;
        
        for (const cls of classes) {
            const currentTeacher = cls.Teacher?.User?.name || 'Not assigned';
            
            html += `
                <div class="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow" data-class-id="${cls.id}">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div class="flex-1">
                            <h3 class="font-semibold text-lg">${escapeHtml(cls.name)}</h3>
                            <p class="text-sm text-muted-foreground">Grade: ${escapeHtml(cls.grade)} | Stream: ${escapeHtml(cls.stream || 'N/A')}</p>
                            <p class="text-sm mt-1">
                                <span class="font-medium">Class Teacher:</span> 
                                <span class="${cls.Teacher ? 'text-green-600' : 'text-yellow-600'}">${escapeHtml(currentTeacher)}</span>
                            </p>
                            <p class="text-xs text-muted-foreground mt-1">${cls.studentCount || 0} students enrolled</p>
                        </div>
                        
                        <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <select id="teacher-${cls.id}" class="rounded-lg border border-input bg-background px-3 py-2 text-sm min-w-[200px]">
                                <option value="">-- Select Teacher --</option>
                                ${teachers.map(t => `
                                    <option value="${t.id}" ${t.id === cls.teacherId ? 'selected' : ''}>
                                        ${escapeHtml(t.User?.name || 'Unknown')} (${escapeHtml(t.subjects?.join(', ') || 'No subjects')})
                                    </option>
                                `).join('')}
                            </select>
                            <button onclick="assignClassTeacher(${cls.id})" 
                                    class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm whitespace-nowrap">
                                Assign Teacher
                            </button>
                            <button onclick="editClass(${cls.id})" 
                                    class="p-2 border rounded-lg hover:bg-accent">
                                <i data-lucide="edit" class="h-4 w-4"></i>
                            </button>
                            <button onclick="deleteClass(${cls.id})" 
                                    class="p-2 border rounded-lg hover:bg-red-100 text-red-600">
                                <i data-lucide="trash-2" class="h-4 w-4"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="mt-4 pt-4 border-t">
                        <div class="flex justify-between items-center mb-3">
                            <h4 class="font-medium text-sm flex items-center gap-2">
                                <i data-lucide="book-open" class="h-4 w-4 text-primary"></i>
                                Subject Teachers
                            </h4>
                            <button onclick="openSubjectAssignmentModal(${cls.id}, '${escapeHtml(cls.name)}')" 
                                    class="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200 flex items-center gap-1">
                                <i data-lucide="plus" class="h-3 w-3"></i>
                                Assign Subjects
                            </button>
                        </div>
                        <div id="subject-assignments-${cls.id}" class="space-y-2 min-h-[60px]">
                            <div class="text-sm text-muted-foreground text-center py-2 bg-muted/20 rounded">
                                Loading subject assignments...
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        html += `
                </div>
            </div>
        `;
        
        setTimeout(async () => {
            for (const cls of classes) {
                await loadAndDisplaySubjectAssignments(cls.id);
            }
        }, 100);
        
        return html;
        
    } catch (error) {
        console.error('Error rendering classes:', error);
        return `<div class="text-center py-12 text-red-500">Error loading classes: ${error.message}</div>`;
    }
}

async function loadAndDisplaySubjectAssignments(classId) {
    const container = document.getElementById(`subject-assignments-${classId}`);
    if (!container) return;
    
    try {
        const assignments = await loadSubjectAssignmentsForClass(classId);
        
        if (!assignments || assignments.length === 0) {
            container.innerHTML = `
                <div class="text-sm text-muted-foreground text-center py-2 bg-muted/20 rounded">
                    No subject teachers assigned yet
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                ${assignments.map(ass => `
                    <div class="flex justify-between items-center p-2 bg-muted/20 rounded-lg">
                        <div>
                            <span class="font-medium text-sm">${escapeHtml(ass.subject)}</span>
                            <span class="text-xs text-muted-foreground ml-2">- ${escapeHtml(ass.teacherName)}</span>
                        </div>
                        <button onclick="removeSubjectAssignment(${ass.id}, ${classId})" 
                                class="text-red-500 hover:text-red-700 p-1">
                            <i data-lucide="x" class="h-3 w-3"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
        
    } catch (error) {
        console.error('Error loading subject assignments:', error);
        container.innerHTML = `
            <div class="text-sm text-red-500 text-center py-2 bg-red-50 rounded">
                Error loading assignments
            </div>
        `;
    }
}

// ============ CLASS ACTIONS ============

window.showAddClassModal = function() {
    const className = prompt('Enter class name (e.g., Form 3A, Grade 10):');
    if (!className) return;
    
    const grade = prompt('Enter grade/level (e.g., Form 3, Grade 10):');
    if (!grade) return;
    
    const stream = prompt('Enter stream (optional, e.g., A, B, Science):', '');
    
    showLoading();
    api.admin.createClass({ name: className, grade, stream })
        .then(() => {
            showToast('✅ Class created successfully', 'success');
            showDashboardSection('classes');
        })
        .catch(err => {
            showToast(err.message || 'Failed to create class', 'error');
        })
        .finally(() => hideLoading());
};

window.editClass = async function(classId) {
    const classes = await loadAllClasses();
    const classData = classes.find(c => c.id == classId);
    
    if (!classData) {
        showToast('Class not found', 'error');
        return;
    }
    
    const newName = prompt('Enter new class name:', classData.name);
    if (!newName) return;
    
    const newGrade = prompt('Enter new grade:', classData.grade);
    if (!newGrade) return;
    
    const newStream = prompt('Enter new stream:', classData.stream || '');
    
    showLoading();
    try {
        await api.admin.updateClass(classId, { 
            name: newName, 
            grade: newGrade,
            stream: newStream
        });
        showToast('✅ Class updated successfully', 'success');
        await showDashboardSection('classes');
    } catch (error) {
        showToast(error.message || 'Failed to update class', 'error');
    } finally {
        hideLoading();
    }
};

window.deleteClass = async function(classId) {
    if (!confirm('⚠️ Are you sure you want to delete this class? This will remove all student associations.')) return;
    
    showLoading();
    try {
        await api.admin.deleteClass(classId);
        showToast('✅ Class deleted successfully', 'success');
        await showDashboardSection('classes');
    } catch (error) {
        showToast(error.message || 'Failed to delete class', 'error');
    } finally {
        hideLoading();
    }
};

window.assignClassTeacher = async function(classId) {
    const select = document.getElementById(`teacher-${classId}`);
    const teacherId = select?.value;
    
    if (!teacherId) {
        showToast('Please select a teacher', 'error');
        return;
    }
    
    showLoading();
    try {
        await api.admin.assignTeacherToClass(classId, teacherId);
        showToast('✅ Teacher assigned successfully', 'success');
        await showDashboardSection('classes');
    } catch (error) {
        showToast(error.message || 'Failed to assign teacher', 'error');
    } finally {
        hideLoading();
    }
};

// ============ SUBJECT ASSIGNMENT FUNCTIONS ============

async function getAllSubjects() {
    const curriculum = window.schoolSettings?.curriculum || 'cbc';
    const schoolLevel = window.schoolSettings?.schoolLevel || 'secondary';
    
    const subjectsByCurriculum = {
        'cbc': {
            primary: ['Mathematics', 'English', 'Kiswahili', 'Science', 'Social Studies', 'CRE/IRE', 'Physical Education', 'Art & Craft', 'Music'],
            secondary: ['Mathematics', 'English', 'Kiswahili', 'Biology', 'Chemistry', 'Physics', 'History', 'Geography', 'CRE/IRE', 'Business Studies', 'Agriculture', 'Computer Studies']
        },
        '844': {
            primary: ['Mathematics', 'English', 'Kiswahili', 'Science', 'Social Studies', 'CRE/IRE', 'Physical Education'],
            secondary: ['Mathematics', 'English', 'Kiswahili', 'Biology', 'Chemistry', 'Physics', 'History', 'Geography', 'CRE/IRE', 'Business Studies', 'Agriculture', 'Computer Studies']
        },
        'british': {
            primary: ['English', 'Mathematics', 'Science', 'History', 'Geography', 'Art', 'Music', 'Physical Education'],
            secondary: ['English Literature', 'English Language', 'Mathematics', 'Biology', 'Chemistry', 'Physics', 'History', 'Geography', 'French', 'Spanish', 'Computer Science', 'Business Studies', 'Economics', 'Art & Design', 'Music', 'Physical Education']
        },
        'american': {
            primary: ['English Language Arts', 'Mathematics', 'Science', 'Social Studies', 'Art', 'Music', 'Physical Education'],
            secondary: ['English', 'Mathematics', 'Biology', 'Chemistry', 'Physics', 'History', 'Geography', 'Spanish', 'French', 'Computer Science', 'Business', 'Economics', 'Art', 'Music', 'Physical Education']
        }
    };
    
    const level = schoolLevel === 'primary' ? 'primary' : 'secondary';
    const subjects = subjectsByCurriculum[curriculum]?.[level] || subjectsByCurriculum['cbc'][level];
    const customSubjects = window.schoolSettings?.customSubjects || [];
    
    return [...subjects, ...customSubjects];
}

window.openSubjectAssignmentModal = async function(classId, className) {
    const [teachers, existingAssignments, allSubjects] = await Promise.all([
        loadAvailableTeachers(),
        loadSubjectAssignmentsForClass(classId),
        getAllSubjects()
    ]);
    
    const existingMap = {};
    existingAssignments.forEach(a => {
        existingMap[a.subject] = a;
    });
    
    let modal = document.getElementById('subject-assignment-modal');
    if (!modal) {
        createSubjectAssignmentModal();
        modal = document.getElementById('subject-assignment-modal');
    }
    
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.innerHTML = `
            <div class="space-y-4">
                <div class="border-b pb-3">
                    <h3 class="text-lg font-semibold">Assign Subject Teachers</h3>
                    <p class="text-sm text-muted-foreground">Class: ${escapeHtml(className)}</p>
                </div>
                
                <div class="overflow-x-auto max-h-[60vh] overflow-y-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-muted/50 sticky top-0">
                            <tr>
                                <th class="px-4 py-2 text-left font-medium">Subject</th>
                                <th class="px-4 py-2 text-left font-medium">Teacher</th>
                                <th class="px-4 py-2 text-center font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            ${allSubjects.map(subject => {
                                const existing = existingMap[subject];
                                return `
                                    <tr>
                                        <td class="px-4 py-2 font-medium">${escapeHtml(subject)}</td>
                                        <td class="px-4 py-2">
                                            <select id="subject-teacher-${subject.replace(/\s/g, '_')}" 
                                                    class="rounded-lg border border-input bg-background px-3 py-1 text-sm w-64">
                                                <option value="">-- Select Teacher --</option>
                                                ${teachers.map(t => `
                                                    <option value="${t.id}" ${existing?.teacherId === t.id ? 'selected' : ''}>
                                                        ${escapeHtml(t.User?.name || 'Unknown')} (${escapeHtml(t.subjects?.join(', ') || 'No subjects')})
                                                    </option>
                                                `).join('')}
                                            </select>
                                        </td>
                                        <td class="px-4 py-2 text-center">
                                            <button onclick="saveSubjectAssignment(${classId}, '${subject.replace(/'/g, "\\'")}')" 
                                                    class="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90">
                                                ${existing ? 'Update' : 'Assign'}
                                            </button>
                                            ${existing ? `
                                                <button onclick="removeSubjectAssignment(${existing.id}, ${classId})" 
                                                        class="ml-2 px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200">
                                                    Remove
                                                </button>
                                            ` : ''}
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div class="flex justify-end gap-2 pt-4 border-t">
                    <button onclick="closeSubjectAssignmentModal()" class="px-4 py-2 border rounded-lg hover:bg-accent">Close</button>
                </div>
            </div>
        `;
    }
    
    modal.classList.remove('hidden');
    if (typeof lucide !== 'undefined') lucide.createIcons();
};

function createSubjectAssignmentModal() {
    const modalHTML = `
        <div id="subject-assignment-modal" class="fixed inset-0 z-50 hidden">
            <div class="absolute inset-0 bg-black/50" onclick="closeSubjectAssignmentModal()"></div>
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl p-4">
                <div class="rounded-xl border bg-card shadow-xl animate-fade-in max-h-[85vh] overflow-hidden flex flex-col">
                    <div class="modal-content p-6 overflow-y-auto">
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

window.closeSubjectAssignmentModal = function() {
    const modal = document.getElementById('subject-assignment-modal');
    if (modal) modal.classList.add('hidden');
};

window.saveSubjectAssignment = async function(classId, subject) {
    const selectId = `subject-teacher-${subject.replace(/\s/g, '_')}`;
    const teacherId = document.getElementById(selectId)?.value;
    
    if (!teacherId) {
        showToast('Please select a teacher', 'error');
        return;
    }
    
    showLoading();
    try {
        const response = await api.admin.assignTeacherToSubject({
            classId: parseInt(classId),
            teacherId: parseInt(teacherId),
            subject: subject,
            isClassTeacher: false
        });
        
        if (response.success) {
            showToast(`✅ ${subject} assigned successfully`, 'success');
            await showDashboardSection('classes');
        }
    } catch (error) {
        showToast(error.message || 'Failed to assign teacher', 'error');
    } finally {
        hideLoading();
    }
};

window.removeSubjectAssignment = async function(assignmentId, classId) {
    if (!confirm('Remove this teacher from this subject?')) return;
    
    showLoading();
    try {
        const response = await api.admin.removeSubjectAssignment(assignmentId);
        if (response.success) {
            showToast('✅ Assignment removed', 'success');
            await showDashboardSection('classes');
        }
    } catch (error) {
        showToast(error.message || 'Failed to remove assignment', 'error');
    } finally {
        hideLoading();
    }
};

// ============ HELPER FUNCTIONS ============

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
