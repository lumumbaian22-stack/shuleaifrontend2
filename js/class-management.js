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

// ============ CURRICULUM GENERATION FUNCTION ============

async function generateClassesFromCurriculum() {
    const curriculum = window.schoolSettings?.curriculum || 'cbc';
    const schoolLevel = window.schoolSettings?.schoolLevel || 'secondary';
    
    // Ask for stream configuration
    const streamCount = parseInt(prompt('How many streams do you want to create? (e.g., 1, 2, 3, etc.)', '1') || '1');
    if (isNaN(streamCount) || streamCount < 1) {
        showToast('Invalid stream count', 'error');
        return;
    }
    
    let streamNames = [];
    if (streamCount > 1) {
        const defaultNames = Array.from({ length: streamCount }, (_, i) => String.fromCharCode(65 + i)).join(', ');
        const streamNamesInput = prompt(`Enter stream names separated by commas (e.g., A, B, C or Blue, Green, Yellow):\nDefault: ${defaultNames}`, defaultNames);
        
        if (streamNamesInput) {
            streamNames = streamNamesInput.split(',').map(s => s.trim()).filter(s => s);
        }
        
        if (streamNames.length !== streamCount) {
            streamNames = Array.from({ length: streamCount }, (_, i) => String.fromCharCode(65 + i));
        }
    }
    
    // Save stream settings
    if (!window.schoolSettings) window.schoolSettings = {};
    window.schoolSettings.streams = {
        count: streamCount,
        names: streamNames
    };
    localStorage.setItem('schoolSettings', JSON.stringify(window.schoolSettings));
    
    // Define classes based on curriculum and level
    let classesToCreate = [];
    
    if (curriculum === 'cbc') {
        if (schoolLevel === 'primary' || schoolLevel === 'both') {
            // Pre-Primary
            for (const className of ['PP1', 'PP2']) {
                for (let i = 0; i < streamCount; i++) {
                    const streamName = streamCount > 1 ? ` ${streamNames[i] || String.fromCharCode(65 + i)}` : '';
                    classesToCreate.push({
                        name: `${className}${streamName}`,
                        grade: className,
                        stream: streamCount > 1 ? (streamNames[i] || String.fromCharCode(65 + i)) : null
                    });
                }
            }
            // Lower Primary
            for (const className of ['Grade 1', 'Grade 2', 'Grade 3']) {
                for (let i = 0; i < streamCount; i++) {
                    const streamName = streamCount > 1 ? ` ${streamNames[i] || String.fromCharCode(65 + i)}` : '';
                    classesToCreate.push({
                        name: `${className}${streamName}`,
                        grade: className,
                        stream: streamCount > 1 ? (streamNames[i] || String.fromCharCode(65 + i)) : null
                    });
                }
            }
            // Upper Primary
            for (const className of ['Grade 4', 'Grade 5', 'Grade 6']) {
                for (let i = 0; i < streamCount; i++) {
                    const streamName = streamCount > 1 ? ` ${streamNames[i] || String.fromCharCode(65 + i)}` : '';
                    classesToCreate.push({
                        name: `${className}${streamName}`,
                        grade: className,
                        stream: streamCount > 1 ? (streamNames[i] || String.fromCharCode(65 + i)) : null
                    });
                }
            }
        }
        
        if (schoolLevel === 'secondary' || schoolLevel === 'both') {
            // Junior Secondary
            for (const className of ['Grade 7', 'Grade 8', 'Grade 9']) {
                for (let i = 0; i < streamCount; i++) {
                    const streamName = streamCount > 1 ? ` ${streamNames[i] || String.fromCharCode(65 + i)}` : '';
                    classesToCreate.push({
                        name: `${className}${streamName}`,
                        grade: className,
                        stream: streamCount > 1 ? (streamNames[i] || String.fromCharCode(65 + i)) : null
                    });
                }
            }
            // Senior Secondary
            for (const className of ['Grade 10', 'Grade 11', 'Grade 12']) {
                for (let i = 0; i < streamCount; i++) {
                    const streamName = streamCount > 1 ? ` ${streamNames[i] || String.fromCharCode(65 + i)}` : '';
                    classesToCreate.push({
                        name: `${className}${streamName}`,
                        grade: className,
                        stream: streamCount > 1 ? (streamNames[i] || String.fromCharCode(65 + i)) : null
                    });
                }
            }
        }
    } else if (curriculum === '844') {
        if (schoolLevel === 'primary' || schoolLevel === 'both') {
            for (const className of ['Standard 1', 'Standard 2', 'Standard 3', 'Standard 4', 'Standard 5', 'Standard 6', 'Standard 7', 'Standard 8']) {
                for (let i = 0; i < streamCount; i++) {
                    const streamName = streamCount > 1 ? ` ${streamNames[i] || String.fromCharCode(65 + i)}` : '';
                    classesToCreate.push({
                        name: `${className}${streamName}`,
                        grade: className,
                        stream: streamCount > 1 ? (streamNames[i] || String.fromCharCode(65 + i)) : null
                    });
                }
            }
        }
        if (schoolLevel === 'secondary' || schoolLevel === 'both') {
            for (const className of ['Form 1', 'Form 2', 'Form 3', 'Form 4']) {
                for (let i = 0; i < streamCount; i++) {
                    const streamName = streamCount > 1 ? ` ${streamNames[i] || String.fromCharCode(65 + i)}` : '';
                    classesToCreate.push({
                        name: `${className}${streamName}`,
                        grade: className,
                        stream: streamCount > 1 ? (streamNames[i] || String.fromCharCode(65 + i)) : null
                    });
                }
            }
        }
    } else if (curriculum === 'british') {
        const classes = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'];
        for (const className of classes) {
            for (let i = 0; i < streamCount; i++) {
                const streamName = streamCount > 1 ? ` ${streamNames[i] || String.fromCharCode(65 + i)}` : '';
                classesToCreate.push({
                    name: `${className}${streamName}`,
                    grade: className,
                    stream: streamCount > 1 ? (streamNames[i] || String.fromCharCode(65 + i)) : null
                });
            }
        }
    } else if (curriculum === 'american') {
        const classes = ['Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
        for (const className of classes) {
            for (let i = 0; i < streamCount; i++) {
                const streamName = streamCount > 1 ? ` ${streamNames[i] || String.fromCharCode(65 + i)}` : '';
                classesToCreate.push({
                    name: `${className}${streamName}`,
                    grade: className,
                    stream: streamCount > 1 ? (streamNames[i] || String.fromCharCode(65 + i)) : null
                });
            }
        }
    }
    
    if (classesToCreate.length === 0) {
        showToast('No classes to generate for this curriculum', 'info');
        return;
    }
    
    // Get existing classes
    const existingClasses = await loadAllClasses();
    const existingNames = new Set(existingClasses.map(c => c.name));
    const newClasses = classesToCreate.filter(c => !existingNames.has(c.name));
    
    if (newClasses.length === 0) {
        showToast('All classes already exist', 'info');
        return;
    }
    
    if (!confirm(`Generate ${newClasses.length} new classes?\n\n${newClasses.slice(0, 15).map(c => `• ${c.name}`).join('\n')}${newClasses.length > 15 ? `\n... and ${newClasses.length - 15} more` : ''}\n\nProceed?`)) {
        return;
    }
    
    showLoading();
    let created = 0;
    let failed = 0;
    
    for (const classData of newClasses) {
        try {
            await api.admin.createClass({
                name: classData.name,
                grade: classData.grade,
                stream: classData.stream,
                academicYear: new Date().getFullYear().toString()
            });
            created++;
        } catch (error) {
            console.error(`Failed to create ${classData.name}:`, error);
            failed++;
        }
    }
    
    hideLoading();
    
    if (created > 0) {
        showToast(`✅ Created ${created} classes${failed > 0 ? `, ${failed} failed` : ''}`, 'success');
        await showDashboardSection('classes');
    } else {
        showToast('Failed to create classes', 'error');
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
                        <div class="flex gap-3">
                            <button onclick="generateClassesFromCurriculum()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                                <i data-lucide="wand-2" class="h-4 w-4"></i>
                                Generate from Curriculum
                            </button>
                            <button onclick="showAddClassModal()" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
                                <i data-lucide="plus" class="h-4 w-4"></i>
                                Add Manually
                            </button>
                        </div>
                    </div>
                    <div class="text-center py-12 border rounded-lg bg-card">
                        <i data-lucide="school" class="h-12 w-12 mx-auto text-muted-foreground mb-4"></i>
                        <p class="text-muted-foreground">No classes found. Click "Generate from Curriculum" to create classes based on your curriculum.</p>
                    </div>
                </div>
            `;
        }
        
        // Group classes by level
        const groupedClasses = {};
        for (const cls of classes) {
            let level = 'other';
            const grade = cls.grade || '';
            if (grade.includes('PP') || grade.includes('Pre')) level = 'pre_primary';
            else if (grade.includes('Grade 1') || grade.includes('Grade 2') || grade.includes('Grade 3')) level = 'lower_primary';
            else if (grade.includes('Grade 4') || grade.includes('Grade 5') || grade.includes('Grade 6')) level = 'upper_primary';
            else if (grade.includes('Grade 7') || grade.includes('Grade 8') || grade.includes('Grade 9')) level = 'junior_secondary';
            else if (grade.includes('Grade 10') || grade.includes('Grade 11') || grade.includes('Grade 12')) level = 'senior_secondary';
            else if (grade.includes('Standard') || grade.includes('Form')) level = 'secondary';
            
            if (!groupedClasses[level]) groupedClasses[level] = [];
            groupedClasses[level].push(cls);
        }
        
        const levelNames = {
            pre_primary: '🎨 Pre-Primary',
            lower_primary: '📚 Lower Primary (Grade 1-3)',
            upper_primary: '📖 Upper Primary (Grade 4-6)',
            junior_secondary: '🔬 Junior Secondary (Grade 7-9)',
            senior_secondary: '🎓 Senior Secondary (Grade 10-12)',
            secondary: '🏫 Secondary',
            other: '📌 Other Classes'
        };
        
        let html = `
            <div class="space-y-6 animate-fade-in">
                <div class="flex justify-between items-center">
                    <div>
                        <h2 class="text-2xl font-bold">Class Management</h2>
                        <p class="text-sm text-muted-foreground mt-1">${classes.length} total classes</p>
                    </div>
                    <div class="flex gap-3">
                        <button onclick="generateClassesFromCurriculum()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                            <i data-lucide="wand-2" class="h-4 w-4"></i>
                            Generate from Curriculum
                        </button>
                        <button onclick="showAddClassModal()" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
                            <i data-lucide="plus" class="h-4 w-4"></i>
                            Add Manually
                        </button>
                    </div>
                </div>
                
                <div class="space-y-4">
        `;
        
        for (const [levelKey, levelClasses] of Object.entries(groupedClasses)) {
            const levelName = levelNames[levelKey] || levelKey;
            const isOpen = levelKey === 'junior_secondary' || levelKey === 'senior_secondary';
            
            html += `
                <div class="rounded-xl border bg-card overflow-hidden">
                    <button onclick="toggleLevel('${levelKey}')" 
                            class="w-full p-4 text-left flex justify-between items-center hover:bg-muted/50 transition-colors">
                        <div class="flex items-center gap-3">
                            <span class="text-xl">${levelName}</span>
                            <span class="text-sm text-muted-foreground">(${levelClasses.length} classes)</span>
                        </div>
                        <i data-lucide="chevron-down" class="h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}" id="level-icon-${levelKey}"></i>
                    </button>
                    <div id="level-content-${levelKey}" class="divide-y border-t ${isOpen ? '' : 'hidden'}">
            `;
            
            for (const cls of levelClasses) {
                const currentTeacher = cls.Teacher?.User?.name || 'Not assigned';
                const hasTeacher = cls.Teacher !== null;
                
                html += `
                    <div class="p-5 hover:bg-muted/30 transition-colors">
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div class="flex-1">
                                <div class="flex items-center gap-3 flex-wrap">
                                    <h3 class="font-semibold text-lg">${escapeHtml(cls.name)}</h3>
                                    <span class="px-2 py-0.5 bg-muted text-xs rounded-full">${cls.studentCount || 0} students</span>
                                    <span class="px-2 py-0.5 ${hasTeacher ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} text-xs rounded-full">
                                        ${hasTeacher ? 'Class Teacher Assigned' : 'No Class Teacher'}
                                    </span>
                                </div>
                                <p class="text-sm text-muted-foreground mt-1">Grade: ${escapeHtml(cls.grade)} | Stream: ${escapeHtml(cls.stream || 'N/A')}</p>
                            </div>
                            
                            <div class="flex gap-2">
                                <button onclick="toggleClassDetails(${cls.id})" 
                                        class="p-2 border rounded-lg hover:bg-accent" 
                                        title="Show Details">
                                    <i data-lucide="chevron-down" class="h-4 w-4" id="class-icon-${cls.id}"></i>
                                </button>
                                <button onclick="editClass(${cls.id})" 
                                        class="p-2 border rounded-lg hover:bg-accent" 
                                        title="Edit Class">
                                    <i data-lucide="edit" class="h-4 w-4"></i>
                                </button>
                                <button onclick="deleteClass(${cls.id})" 
                                        class="p-2 border rounded-lg hover:bg-red-100 text-red-600" 
                                        title="Delete Class">
                                    <i data-lucide="trash-2" class="h-4 w-4"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Expandable Details -->
                        <div id="class-details-${cls.id}" class="mt-4 pt-4 border-t hidden">
                            <!-- Class Teacher Assignment -->
                            <div class="mb-4 p-4 bg-muted/20 rounded-lg">
                                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <p class="text-sm font-medium mb-1">🏫 Class Teacher</p>
                                        <p class="text-sm ${hasTeacher ? 'text-green-600 font-medium' : 'text-yellow-600'}">
                                            ${escapeHtml(currentTeacher)}
                                        </p>
                                        ${cls.Teacher?.User?.email ? `<p class="text-xs text-muted-foreground">${escapeHtml(cls.Teacher.User.email)}</p>` : ''}
                                    </div>
                                    <div class="flex gap-2 w-full md:w-auto">
                                        <select id="class-teacher-${cls.id}" class="rounded-lg border border-input bg-background px-3 py-2 text-sm min-w-[200px]">
                                            <option value="">-- Select Teacher --</option>
                                            ${teachers.map(t => `
                                                <option value="${t.id}" ${t.id === cls.teacherId ? 'selected' : ''}>
                                                    ${escapeHtml(t.User?.name || 'Unknown')} (${escapeHtml(t.subjects?.join(', ') || 'No subjects')})
                                                </option>
                                            `).join('')}
                                        </select>
                                        <button onclick="assignClassTeacher(${cls.id})" 
                                                class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                                            Assign
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Subject Teachers Section -->
                            <div>
                                <div class="flex justify-between items-center mb-3">
                                    <h4 class="font-medium text-sm flex items-center gap-2">
                                        <i data-lucide="book-open" class="h-4 w-4 text-primary"></i>
                                        Subject Teachers
                                    </h4>
                                    <button onclick="openSubjectAssignmentModal(${cls.id}, '${escapeHtml(cls.name)}')" 
                                            class="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200">
                                        <i data-lucide="plus" class="h-3 w-3"></i>
                                        Assign Subjects
                                    </button>
                                </div>
                                <div id="subject-assignments-${cls.id}" class="space-y-2 min-h-[60px]">
                                    <div class="text-sm text-muted-foreground text-center py-3 bg-muted/20 rounded">
                                        Loading subject assignments...
                                    </div>
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
        }
        
        html += `
                </div>
            </div>
            
            <script>
                function toggleLevel(levelKey) {
                    const content = document.getElementById('level-content-' + levelKey);
                    const icon = document.getElementById('level-icon-' + levelKey);
                    if (content) {
                        content.classList.toggle('hidden');
                        if (icon) {
                            icon.style.transform = content.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
                        }
                    }
                }
                
                function toggleClassDetails(classId) {
                    const details = document.getElementById('class-details-' + classId);
                    const icon = document.getElementById('class-icon-' + classId);
                    if (details) {
                        details.classList.toggle('hidden');
                        if (icon) {
                            icon.style.transform = details.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
                        }
                    }
                }
            </script>
        `;
        
        // Load subject assignments after render
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
        const assignments = await api.admin.getClassSubjectAssignments(classId);
        
        if (!assignments.data || assignments.data.length === 0) {
            container.innerHTML = `
                <div class="text-sm text-muted-foreground text-center py-3 bg-muted/20 rounded">
                    <i data-lucide="book-open" class="h-4 w-4 mx-auto mb-1 opacity-50"></i>
                    <p>No subject teachers assigned yet</p>
                    <p class="text-xs mt-1">Click "Assign Subjects" to add teachers</p>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }
        
        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                ${assignments.data.map(ass => `
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
            <div class="text-sm text-red-500 text-center py-3 bg-red-50 rounded">
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
    const select = document.getElementById(`class-teacher-${classId}`);
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

window.openSubjectAssignmentModal = async function(classId, className) {
    const teachers = await loadAvailableTeachers();
    
    // Get subjects from curriculum
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
    let subjects = subjectsByCurriculum[curriculum]?.[level] || subjectsByCurriculum['cbc'][level];
    const customSubjects = window.schoolSettings?.customSubjects || [];
    const allSubjects = [...subjects, ...customSubjects];
    
    let modal = document.getElementById('subject-assignment-modal');
    if (!modal) {
        createSubjectAssignmentModal();
        modal = document.getElementById('subject-assignment-modal');
    }
    
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.innerHTML = `
            <div class="space-y-5">
                <div class="border-b pb-4">
                    <h3 class="text-xl font-semibold">Assign Subject Teachers</h3>
                    <p class="text-sm text-muted-foreground mt-1">Class: ${escapeHtml(className)}</p>
                </div>
                
                <div class="overflow-x-auto max-h-[60vh] overflow-y-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-muted/50 sticky top-0">
                            <tr>
                                <th class="px-4 py-3 text-left font-medium">Subject</th>
                                <th class="px-4 py-3 text-left font-medium">Teacher</th>
                                <th class="px-4 py-3 text-center font-medium">Action</th>
                            </thead>
                            <tbody class="divide-y">
                                ${allSubjects.map(subject => `
                                    <tr class="hover:bg-muted/30 transition-colors">
                                        <td class="px-4 py-3 font-medium">${escapeHtml(subject)}</td>
                                        <td class="px-4 py-3">
                                            <select id="subject-teacher-${subject.replace(/\s/g, '_')}" 
                                                    class="rounded-lg border border-input bg-background px-3 py-2 text-sm w-64">
                                                <option value="">-- Select Teacher --</option>
                                                ${teachers.map(t => `
                                                    <option value="${t.id}">
                                                        ${escapeHtml(t.User?.name || 'Unknown')} (${escapeHtml(t.subjects?.join(', ') || 'No subjects')})
                                                    </option>
                                                `).join('')}
                                            </select>
                                        </td>
                                        <td class="px-4 py-3 text-center">
                                            <button onclick="saveSubjectAssignment(${classId}, '${subject.replace(/'/g, "\\'")}')" 
                                                    class="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90">
                                                Assign
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="flex justify-end gap-3 pt-4 border-t">
                        <button onclick="closeSubjectAssignmentModal()" class="px-5 py-2 border rounded-lg hover:bg-accent">Close</button>
                    </div>
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
                <div class="rounded-2xl border bg-card shadow-2xl animate-fade-in max-h-[85vh] overflow-hidden flex flex-col">
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
            closeSubjectAssignmentModal();
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

// Make functions globally available
window.generateClassesFromCurriculum = generateClassesFromCurriculum;
window.renderClassManagement = renderClassManagement;
window.toggleLevel = function(levelKey) {
    const content = document.getElementById(`level-content-${levelKey}`);
    const icon = document.getElementById(`level-icon-${levelKey}`);
    if (content) {
        content.classList.toggle('hidden');
        if (icon) {
            icon.style.transform = content.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
        }
    }
};
window.toggleClassDetails = function(classId) {
    const details = document.getElementById(`class-details-${classId}`);
    const icon = document.getElementById(`class-icon-${classId}`);
    if (details) {
        details.classList.toggle('hidden');
        if (icon) {
            icon.style.transform = details.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
        }
    }
};
