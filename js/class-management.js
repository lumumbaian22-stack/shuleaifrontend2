// class-management.js - COMPLETE WORKING VERSION WITH TEACHER SUBJECT ASSIGNMENT

let currentClassForAssignment = null;

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

async function loadAllTeachers() {
    try {
        const response = await api.admin.getTeachers();
        return response.data || [];
    } catch (error) {
        console.error('Failed to load teachers:', error);
        return [];
    }
}

async function loadClassAssignments(classId) {
    try {
        const response = await api.admin.getClassAssignments(classId);
        return response.data || [];
    } catch (error) {
        console.error('Failed to load assignments:', error);
        return [];
    }
}

// ============ RENDER FUNCTIONS ============

async function refreshClassesList() {
    const container = document.getElementById('classes-list-container');
    if (!container) return;
    
    const [classes, teachers] = await Promise.all([
        loadAllClasses(),
        loadAllTeachers()
    ]);
    
    if (!classes || classes.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 border rounded-lg bg-card">
                <i data-lucide="users" class="h-12 w-12 mx-auto text-muted-foreground mb-4"></i>
                <p class="text-muted-foreground">No classes found. Click "Add New Class" to create one.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = classes.map(cls => renderClassCard(cls, teachers)).join('');
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function renderClassCard(cls, teachers) {
    const classTeacher = teachers.find(t => t.id === cls.teacherId);
    const classTeacherName = classTeacher?.User?.name || 'Not assigned';
    
    return `
        <div class="border rounded-lg bg-card hover:shadow-md transition-shadow" data-class-id="${cls.id}">
            <div class="p-5">
                <!-- Class Header -->
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div>
                        <h3 class="font-semibold text-lg">${escapeHtml(cls.name)}</h3>
                        <p class="text-sm text-muted-foreground">Grade: ${escapeHtml(cls.grade)} | Stream: ${escapeHtml(cls.stream || 'N/A')}</p>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="editClass(${cls.id})" class="p-2 border rounded-lg hover:bg-accent" title="Edit Class">
                            <i data-lucide="edit" class="h-4 w-4"></i>
                        </button>
                        <button onclick="deleteClass(${cls.id})" class="p-2 border rounded-lg hover:bg-red-100 text-red-600" title="Delete Class">
                            <i data-lucide="trash-2" class="h-4 w-4"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Class Teacher Assignment -->
                <div class="p-4 bg-muted/30 rounded-lg mb-4">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <p class="text-sm font-medium mb-1">🏫 Class Teacher</p>
                            <p class="text-sm ${classTeacher ? 'text-green-600 font-medium' : 'text-yellow-600'}">
                                ${classTeacherName}
                            </p>
                            ${classTeacher ? `<p class="text-xs text-muted-foreground">${classTeacher.User?.email || ''}</p>` : ''}
                        </div>
                        <div class="flex gap-2">
                            <select id="class-teacher-${cls.id}" class="rounded-lg border border-input bg-background px-3 py-1 text-sm">
                                <option value="">-- Select Class Teacher --</option>
                                ${teachers.map(t => `
                                    <option value="${t.id}" ${t.id === cls.teacherId ? 'selected' : ''}>
                                        ${escapeHtml(t.User?.name)} (${escapeHtml(t.subjects?.join(', ') || 'No subjects')})
                                    </option>
                                `).join('')}
                            </select>
                            <button onclick="assignClassTeacher(${cls.id})" class="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90">
                                Assign
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Subject Teachers Section -->
                <div class="mt-4">
                    <div class="flex justify-between items-center mb-3">
                        <h4 class="font-medium text-sm">📚 Subject Teachers</h4>
                        <button onclick="openSubjectAssignmentModal(${cls.id}, '${escapeHtml(cls.name)}')" 
                                class="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200">
                            <i data-lucide="plus" class="h-3 w-3 inline mr-1"></i>
                            Assign Subjects
                        </button>
                    </div>
                    <div id="subject-assignments-${cls.id}" class="space-y-2">
                        <div class="text-sm text-muted-foreground text-center py-2">Loading subject assignments...</div>
                    </div>
                </div>
                
                <!-- Student Count -->
                <div class="mt-4 pt-3 border-t text-sm text-muted-foreground">
                    <i data-lucide="users" class="h-3 w-3 inline mr-1"></i>
                    ${cls.studentCount || 0} students enrolled
                </div>
            </div>
        </div>
    `;
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

async function renderSubjectAssignments(classId, className) {
    const container = document.getElementById(`subject-assignments-${classId}`);
    if (!container) return;
    
    const assignments = await loadSubjectAssignmentsForClass(classId);
    
    if (!assignments || assignments.length === 0) {
        container.innerHTML = `
            <div class="text-sm text-muted-foreground text-center py-2 bg-muted/20 rounded">
                No subject teachers assigned yet
            </div>
        `;
        return;
    }
    
    container.innerHTML = assignments.map(ass => `
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
    `).join('');
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ============ CLASS ACTIONS ============

function showAddClassModal() {
    const modal = document.getElementById('add-class-modal');
    if (!modal) return;
    
    // Load teachers for class teacher dropdown
    loadAvailableTeachers().then(teachers => {
        const select = document.getElementById('modal-class-teacher');
        if (select) {
            select.innerHTML = '<option value="">Select Class Teacher (Optional)</option>' +
                teachers.map(t => `
                    <option value="${t.id}">${escapeHtml(t.User?.name)} (${escapeHtml(t.subjects?.join(', ') || 'No subjects')})</option>
                `).join('');
        }
    });
    
    document.getElementById('modal-class-name').value = '';
    document.getElementById('modal-class-grade').value = '';
    document.getElementById('modal-class-stream').value = '';
    modal.classList.remove('hidden');
}

async function handleAddClass() {
    const name = document.getElementById('modal-class-name')?.value;
    const grade = document.getElementById('modal-class-grade')?.value;
    const stream = document.getElementById('modal-class-stream')?.value;
    const teacherId = document.getElementById('modal-class-teacher')?.value;
    
    if (!name || !grade) {
        showToast('Class name and grade are required', 'error');
        return;
    }
    
    showLoading();
    try {
        const response = await api.admin.createClass({ 
            name, 
            grade, 
            stream,
            teacherId: teacherId ? parseInt(teacherId) : null
        });
        
        if (response.success) {
            showToast('✅ Class created successfully', 'success');
            closeAddClassModal();
            await refreshClassesList();
        }
    } catch (error) {
        showToast(error.message || 'Failed to create class', 'error');
    } finally {
        hideLoading();
    }
}

function closeAddClassModal() {
    const modal = document.getElementById('add-class-modal');
    if (modal) modal.classList.add('hidden');
}

async function assignClassTeacher(classId) {
    const select = document.getElementById(`class-teacher-${classId}`);
    const teacherId = select?.value;
    
    if (!teacherId) {
        showToast('Please select a teacher', 'error');
        return;
    }
    
    showLoading();
    try {
        const response = await api.admin.assignTeacherToClass(classId, teacherId);
        
        if (response.success) {
            showToast('✅ Class teacher assigned', 'success');
            await refreshClassesList();
        }
    } catch (error) {
        showToast(error.message || 'Failed to assign teacher', 'error');
    } finally {
        hideLoading();
    }
}

async function editClass(classId) {
    showLoading();
    try {
        const classes = await loadAllClasses();
        const classData = classes.find(c => c.id == classId);
        
        if (!classData) {
            showToast('Class not found', 'error');
            return;
        }
        
        document.getElementById('edit-class-id').value = classData.id;
        document.getElementById('edit-class-name').value = classData.name || '';
        document.getElementById('edit-class-grade').value = classData.grade || '';
        document.getElementById('edit-class-stream').value = classData.stream || '';
        
        const modal = document.getElementById('edit-class-modal');
        if (modal) modal.classList.remove('hidden');
    } catch (error) {
        showToast('Failed to load class data', 'error');
    } finally {
        hideLoading();
    }
}

async function saveClassChanges() {
    const classId = document.getElementById('edit-class-id')?.value;
    const name = document.getElementById('edit-class-name')?.value;
    const grade = document.getElementById('edit-class-grade')?.value;
    const stream = document.getElementById('edit-class-stream')?.value;
    
    if (!classId) return;
    if (!name || !grade) {
        showToast('Class name and grade are required', 'error');
        return;
    }
    
    showLoading();
    try {
        const response = await api.admin.updateClass(classId, { name, grade, stream });
        
        if (response.success) {
            showToast('✅ Class updated', 'success');
            closeEditClassModal();
            await refreshClassesList();
        }
    } catch (error) {
        showToast(error.message || 'Failed to update class', 'error');
    } finally {
        hideLoading();
    }
}

function closeEditClassModal() {
    const modal = document.getElementById('edit-class-modal');
    if (modal) modal.classList.add('hidden');
}

async function deleteClass(classId) {
    if (!confirm('⚠️ Are you sure you want to delete this class?')) return;
    
    showLoading();
    try {
        const response = await api.admin.deleteClass(classId);
        
        if (response.success) {
            showToast('✅ Class deleted', 'success');
            await refreshClassesList();
        }
    } catch (error) {
        showToast(error.message || 'Failed to delete class', 'error');
    } finally {
        hideLoading();
    }
}

// ============ SUBJECT ASSIGNMENT FUNCTIONS ============

async function openSubjectAssignmentModal(classId, className) {
    currentClassForAssignment = classId;
    
    const modal = document.getElementById('subject-assignment-modal');
    const title = document.getElementById('subject-assignment-title');
    const content = document.getElementById('subject-assignment-content');
    
    if (!modal || !content) return;
    
    title.textContent = `Assign Subject Teachers - ${className}`;
    
    // Load teachers and existing assignments
    const [teachers, existingAssignments] = await Promise.all([
        loadAllTeachers(),
        loadClassAssignments(classId)
    ]);
    
    // Get subjects from curriculum
    const subjects = getSubjectsFromCurriculum();
    
    // Create a map of existing assignments
    const existingMap = {};
    existingAssignments.forEach(a => {
        existingMap[a.subject] = a;
    });
    
    content.innerHTML = `
        <div class="space-y-4">
            <p class="text-sm text-muted-foreground">Assign teachers to subjects for this class. Each subject can have one teacher.</p>
            
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead class="bg-muted/50">
                        <tr>
                            <th class="px-4 py-2 text-left">Subject</th>
                            <th class="px-4 py-2 text-left">Assigned Teacher</th>
                            <th class="px-4 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        ${subjects.map(subject => {
                            const existing = existingMap[subject];
                            return `
                                <tr>
                                    <td class="px-4 py-3 font-medium">${escapeHtml(subject)}</td>
                                    <td class="px-4 py-3">
                                        <select id="subject-teacher-${subject.replace(/\s/g, '_')}" class="rounded-lg border border-input bg-background px-3 py-1 text-sm w-64">
                                            <option value="">-- Select Teacher --</option>
                                            ${teachers.map(t => `
                                                <option value="${t.id}" ${existing?.teacherId === t.id ? 'selected' : ''}>
                                                    ${escapeHtml(t.User?.name)} (${escapeHtml(t.subjects?.join(', ') || 'No subjects')})
                                                </option>
                                            `).join('')}
                                        </select>
                                    </td>
                                    <td class="px-4 py-3 text-center">
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
        </div>
    `;
    
    modal.classList.remove('hidden');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function getSubjectsFromCurriculum() {
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
    
    // Add custom subjects
    const customSubjects = window.schoolSettings?.customSubjects || [];
    return [...subjects, ...customSubjects];
}

async function saveSubjectAssignment(classId, subject) {
    const teacherId = document.getElementById(`subject-teacher-${subject.replace(/\s/g, '_')}`)?.value;
    
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
            showToast(`✅ ${subject} assigned to teacher`, 'success');
            // Refresh the class view to show updated assignments
            await refreshClassesList();
            // Also refresh the modal if it's open
            if (currentClassForAssignment === classId) {
                const className = document.getElementById('subject-assignment-title')?.textContent.replace('Assign Subject Teachers - ', '');
                await openSubjectAssignmentModal(classId, className);
            }
        }
    } catch (error) {
        showToast(error.message || 'Failed to assign teacher', 'error');
    } finally {
        hideLoading();
    }
}

async function removeSubjectAssignment(assignmentId, classId) {
    if (!confirm('Remove this teacher from this subject?')) return;
    
    showLoading();
    try {
        const response = await api.admin.removeSubjectAssignment(assignmentId);
        
        if (response.success) {
            showToast('✅ Assignment removed', 'success');
            await refreshClassesList();
            // Refresh modal if open
            if (currentClassForAssignment === classId) {
                const className = document.getElementById('subject-assignment-title')?.textContent.replace('Assign Subject Teachers - ', '');
                await openSubjectAssignmentModal(classId, className);
            }
        }
    } catch (error) {
        showToast(error.message || 'Failed to remove assignment', 'error');
    } finally {
        hideLoading();
    }
}

function closeSubjectAssignmentModal() {
    const modal = document.getElementById('subject-assignment-modal');
    if (modal) modal.classList.add('hidden');
    currentClassForAssignment = null;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============ EXPORT ============
window.refreshClassesList = refreshClassesList;
window.showAddClassModal = showAddClassModal;
window.closeAddClassModal = closeAddClassModal;
window.handleAddClass = handleAddClass;
window.editClass = editClass;
window.closeEditClassModal = closeEditClassModal;
window.saveClassChanges = saveClassChanges;
window.deleteClass = deleteClass;
window.assignClassTeacher = assignClassTeacher;
window.openSubjectAssignmentModal = openSubjectAssignmentModal;
window.closeSubjectAssignmentModal = closeSubjectAssignmentModal;
window.saveSubjectAssignment = saveSubjectAssignment;
window.removeSubjectAssignment = removeSubjectAssignment;
