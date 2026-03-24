// class-management.js - PREMIUM DESIGN WITH FULL FUNCTIONALITY
// Uses CURRICULUM_STRUCTURE from main.js

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
    let subjects = subjectsByCurriculum[curriculum]?.[level] || subjectsByCurriculum['cbc'][level];
    
    const customSubjects = window.schoolSettings?.customSubjects || [];
    subjects = [...subjects, ...customSubjects];
    
    return subjects;
}

// ============ CURRICULUM GENERATION ============

async function generateClassesFromCurriculum() {
    const curriculum = window.schoolSettings?.curriculum || 'cbc';
    const schoolLevel = window.schoolSettings?.schoolLevel || 'secondary';
    const streams = window.schoolSettings?.streams || { count: 1, names: ['A', 'B', 'C'] };
    
    // Use the existing CURRICULUM_STRUCTURE from main.js
    if (typeof CURRICULUM_STRUCTURE === 'undefined') {
        showToast('Curriculum structure not loaded', 'error');
        return;
    }
    
    const structure = CURRICULUM_STRUCTURE[curriculum];
    if (!structure) {
        showToast('Curriculum structure not found', 'error');
        return;
    }
    
    // Determine which levels to generate based on curriculum
    let levelsToGenerate = [];
    
    if (curriculum === 'cbc') {
        if (schoolLevel === 'primary') {
            levelsToGenerate = ['pre_primary', 'lower_primary', 'upper_primary'];
        } else if (schoolLevel === 'secondary') {
            levelsToGenerate = ['junior_secondary', 'senior_secondary'];
        } else if (schoolLevel === 'both') {
            levelsToGenerate = ['pre_primary', 'lower_primary', 'upper_primary', 'junior_secondary', 'senior_secondary'];
        }
    } else if (curriculum === '844') {
        if (schoolLevel === 'primary') {
            levelsToGenerate = ['primary'];
        } else if (schoolLevel === 'secondary') {
            levelsToGenerate = ['secondary'];
        } else if (schoolLevel === 'both') {
            levelsToGenerate = ['primary', 'secondary'];
        }
    } else if (curriculum === 'british') {
        levelsToGenerate = ['primary', 'secondary'];
    } else if (curriculum === 'american') {
        levelsToGenerate = ['elementary', 'middle', 'high'];
    }
    
    const classesToCreate = [];
    
    for (const levelKey of levelsToGenerate) {
        const level = structure.levels[levelKey];
        if (!level) continue;
        
        for (const className of level.classes) {
            const streamCount = streams.count || 1;
            const streamNames = streams.names || ['A', 'B', 'C', 'D', 'E'];
            
            for (let i = 0; i < streamCount; i++) {
                const streamName = streamNames[i] || String.fromCharCode(65 + i);
                const fullClassName = streamCount > 1 ? `${className} ${streamName}` : className;
                
                classesToCreate.push({
                    name: fullClassName,
                    grade: className,
                    stream: streamCount > 1 ? streamName : null,
                    level: levelKey,
                    academicYear: new Date().getFullYear().toString()
                });
            }
        }
    }
    
    if (classesToCreate.length === 0) {
        showToast('No classes to generate for this curriculum', 'info');
        return;
    }
    
    const existingClasses = await loadAllClasses();
    const existingNames = new Set(existingClasses.map(c => c.name));
    const newClasses = classesToCreate.filter(c => !existingNames.has(c.name));
    
    if (newClasses.length === 0) {
        showToast('All classes already exist', 'info');
        return;
    }
    
    if (!confirm(`Generate ${newClasses.length} new classes based on ${structure.name}?\n\n${newClasses.slice(0, 10).map(c => `• ${c.name}`).join('\n')}${newClasses.length > 10 ? `\n... and ${newClasses.length - 10} more` : ''}`)) {
        return;
    }
    
    showLoading();
    let created = 0;
    let failed = 0;
    
    for (const classData of newClasses) {
        try {
            await api.admin.createClass(classData);
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

// ============ RENDER CLASS MANAGEMENT - PREMIUM DESIGN ============

async function renderClassManagement() {
    try {
        const [classes, teachers] = await Promise.all([
            loadAllClasses(),
            loadAvailableTeachers()
        ]);
        
        const curriculum = window.schoolSettings?.curriculum || 'cbc';
        let curriculumName = 'Current Curriculum';
        
        if (typeof CURRICULUM_STRUCTURE !== 'undefined' && CURRICULUM_STRUCTURE[curriculum]) {
            curriculumName = CURRICULUM_STRUCTURE[curriculum].name;
        }
        
        if (!classes || classes.length === 0) {
            return `
                <div class="space-y-6 animate-fade-in">
                    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h1 class="text-3xl font-bold mb-2">Class Management</h1>
                                <p class="text-blue-100">Organize your school's classes, assign teachers, and manage subjects</p>
                                <div class="mt-4 flex items-center gap-3">
                                    <span class="px-3 py-1 bg-white/20 rounded-full text-sm">${curriculumName}</span>
                                    <span class="px-3 py-1 bg-white/20 rounded-full text-sm">Streams: ${window.schoolSettings?.streams?.count || 1}</span>
                                </div>
                            </div>
                            <div class="flex gap-3">
                                <button onclick="generateClassesFromCurriculum()" class="px-5 py-3 bg-white/20 backdrop-blur rounded-xl hover:bg-white/30 transition-all flex items-center gap-2 font-medium">
                                    <i data-lucide="wand-2" class="h-5 w-5"></i>
                                    Generate Classes
                                </button>
                                <button onclick="showAddClassModal()" class="px-5 py-3 bg-white rounded-xl text-blue-600 hover:bg-blue-50 transition-all flex items-center gap-2 font-medium shadow-lg">
                                    <i data-lucide="plus" class="h-5 w-5"></i>
                                    Add Class
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="text-center py-16 bg-card rounded-2xl border border-dashed">
                        <div class="bg-muted/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i data-lucide="school" class="h-10 w-10 text-muted-foreground"></i>
                        </div>
                        <h3 class="text-lg font-semibold mb-2">No Classes Yet</h3>
                        <p class="text-muted-foreground mb-6">Get started by generating classes from your curriculum or adding them manually</p>
                        <div class="flex gap-3 justify-center">
                            <button onclick="generateClassesFromCurriculum()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all">
                                Generate from Curriculum
                            </button>
                            <button onclick="showAddClassModal()" class="px-4 py-2 border rounded-lg hover:bg-accent transition-all">
                                Add Manually
                            </button>
                        </div>
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
        
        const levelIcons = {
            pre_primary: '🎨',
            lower_primary: '📚',
            upper_primary: '📖',
            junior_secondary: '🔬',
            senior_secondary: '🎓',
            secondary: '🏫',
            other: '📌'
        };
        
        const levelColors = {
            pre_primary: 'from-pink-500 to-rose-500',
            lower_primary: 'from-blue-500 to-cyan-500',
            upper_primary: 'from-green-500 to-emerald-500',
            junior_secondary: 'from-purple-500 to-violet-500',
            senior_secondary: 'from-orange-500 to-amber-500',
            secondary: 'from-indigo-500 to-blue-500',
            other: 'from-gray-500 to-gray-600'
        };
        
        let html = `
            <div class="space-y-6 animate-fade-in">
                <!-- Hero Header -->
                <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 class="text-3xl font-bold mb-2">Class Management</h1>
                            <p class="text-blue-100">Manage ${classes.length} classes, assign teachers, and configure subjects</p>
                            <div class="mt-4 flex flex-wrap items-center gap-3">
                                <span class="px-3 py-1 bg-white/20 rounded-full text-sm">${curriculumName}</span>
                                <span class="px-3 py-1 bg-white/20 rounded-full text-sm">Streams: ${window.schoolSettings?.streams?.count || 1}</span>
                                <span class="px-3 py-1 bg-white/20 rounded-full text-sm">Total: ${classes.length} classes</span>
                            </div>
                        </div>
                        <div class="flex gap-3">
                            <button onclick="generateClassesFromCurriculum()" class="px-5 py-3 bg-white/20 backdrop-blur rounded-xl hover:bg-white/30 transition-all flex items-center gap-2 font-medium">
                                <i data-lucide="wand-2" class="h-5 w-5"></i>
                                Generate
                            </button>
                            <button onclick="showAddClassModal()" class="px-5 py-3 bg-white rounded-xl text-blue-600 hover:bg-blue-50 transition-all flex items-center gap-2 font-medium shadow-lg">
                                <i data-lucide="plus" class="h-5 w-5"></i>
                                Add Class
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Classes Accordion -->
                <div class="space-y-4" id="classes-accordion">
        `;
        
        for (const [levelKey, levelClasses] of Object.entries(groupedClasses)) {
            const levelName = levelKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            const icon = levelIcons[levelKey] || '📚';
            const gradient = levelColors[levelKey] || 'from-gray-500 to-gray-600';
            const isOpen = levelKey === 'junior_secondary' || levelKey === 'senior_secondary';
            
            html += `
                <div class="rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <button onclick="toggleLevel('${levelKey}')" 
                            class="w-full p-5 text-left flex justify-between items-center hover:bg-muted/30 transition-colors group">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shadow-md">
                                ${icon}
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold">${levelName}</h3>
                                <p class="text-sm text-muted-foreground">${levelClasses.length} classes</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                                ${isOpen ? 'Click to collapse' : 'Click to expand'}
                            </span>
                            <i data-lucide="chevron-down" class="h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}" id="level-icon-${levelKey}"></i>
                        </div>
                    </button>
                    <div id="level-content-${levelKey}" class="divide-y ${isOpen ? '' : 'hidden'}">
            `;
            
            for (const cls of levelClasses) {
                const currentTeacher = cls.Teacher?.User?.name || 'Not assigned';
                const hasTeacher = cls.Teacher !== null;
                
                html += `
                    <div class="class-item p-5 hover:bg-muted/20 transition-colors" data-class-id="${cls.id}">
                        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                            <div class="flex-1">
                                <div class="flex items-center gap-3 flex-wrap">
                                    <h4 class="font-semibold text-lg">${escapeHtml(cls.name)}</h4>
                                    <span class="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">${cls.studentCount || 0} students</span>
                                    <span class="px-2 py-0.5 ${hasTeacher ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} text-xs rounded-full">
                                        ${hasTeacher ? '✓ Class Teacher Assigned' : '⚠ No Class Teacher'}
                                    </span>
                                </div>
                                <p class="text-sm text-muted-foreground mt-1">
                                    Grade: ${escapeHtml(cls.grade)} | Stream: ${escapeHtml(cls.stream || 'No stream')}
                                </p>
                            </div>
                            
                            <div class="flex gap-2">
                                <button onclick="toggleClassDetails(${cls.id})" 
                                        class="p-2 rounded-lg border hover:bg-accent transition-all" 
                                        title="Show Details">
                                    <i data-lucide="chevron-down" class="h-4 w-4" id="class-icon-${cls.id}"></i>
                                </button>
                                <button onclick="editClass(${cls.id})" 
                                        class="p-2 rounded-lg border hover:bg-accent transition-all" 
                                        title="Edit Class">
                                    <i data-lucide="edit" class="h-4 w-4"></i>
                                </button>
                                <button onclick="deleteClass(${cls.id})" 
                                        class="p-2 rounded-lg border hover:bg-red-100 text-red-600 transition-all" 
                                        title="Delete Class">
                                    <i data-lucide="trash-2" class="h-4 w-4"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Expandable Details -->
                        <div id="class-details-${cls.id}" class="mt-5 pt-5 border-t hidden">
                            <!-- Class Teacher Assignment Card -->
                            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-5 mb-5">
                                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                                    <div class="flex items-center gap-4">
                                        <div class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                            <i data-lucide="crown" class="h-6 w-6 text-primary"></i>
                                        </div>
                                        <div>
                                            <p class="text-sm font-medium text-muted-foreground">Class Teacher</p>
                                            <p class="text-lg font-semibold ${hasTeacher ? 'text-green-600' : 'text-yellow-600'}">
                                                ${escapeHtml(currentTeacher)}
                                            </p>
                                            ${cls.Teacher?.User?.email ? `<p class="text-xs text-muted-foreground">${escapeHtml(cls.Teacher.User.email)}</p>` : ''}
                                        </div>
                                    </div>
                                    <div class="flex gap-3 w-full md:w-auto">
                                        <select id="class-teacher-${cls.id}" class="rounded-xl border border-input bg-background px-4 py-2 text-sm flex-1 md:flex-initial min-w-[220px] focus:ring-2 focus:ring-primary focus:border-transparent">
                                            <option value="">-- Select Class Teacher --</option>
                                            ${teachers.map(t => `
                                                <option value="${t.id}" ${t.id === cls.teacherId ? 'selected' : ''}>
                                                    ${escapeHtml(t.User?.name || 'Unknown')} (${escapeHtml(t.subjects?.join(', ') || 'No subjects')})
                                                </option>
                                            `).join('')}
                                        </select>
                                        <button onclick="assignClassTeacher(${cls.id})" 
                                                class="px-5 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all whitespace-nowrap font-medium">
                                            Assign
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Subject Teachers Section -->
                            <div>
                                <div class="flex justify-between items-center mb-4">
                                    <h4 class="font-semibold flex items-center gap-2">
                                        <i data-lucide="book-open" class="h-5 w-5 text-primary"></i>
                                        Subject Teachers
                                    </h4>
                                    <button onclick="openSubjectAssignmentModal(${cls.id}, '${escapeHtml(cls.name)}')" 
                                            class="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-all flex items-center gap-2 text-sm font-medium">
                                        <i data-lucide="plus" class="h-4 w-4"></i>
                                        Assign Subjects
                                    </button>
                                </div>
                                <div id="subject-assignments-${cls.id}" class="space-y-2 min-h-[70px]">
                                    <div class="text-sm text-muted-foreground text-center py-4 bg-muted/20 rounded-xl">
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
            
            <style>
                .class-item {
                    transition: all 0.2s ease;
                }
                .class-item:hover {
                    background: rgba(0,0,0,0.02);
                }
                .dark .class-item:hover {
                    background: rgba(255,255,255,0.02);
                }
                #classes-accordion button:active {
                    transform: scale(0.98);
                }
            </style>
        `;
        
        // Load subject assignments
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
                <div class="text-sm text-muted-foreground text-center py-6 bg-muted/20 rounded-xl border border-dashed">
                    <i data-lucide="book-open" class="h-8 w-8 mx-auto mb-2 opacity-50"></i>
                    <p>No subject teachers assigned yet</p>
                    <p class="text-xs mt-1">Click "Assign Subjects" to add teachers</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                ${assignments.map(ass => `
                    <div class="flex justify-between items-center p-3 bg-muted/20 rounded-xl border hover:border-primary/50 transition-all group">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <i data-lucide="book" class="h-4 w-4 text-primary"></i>
                            </div>
                            <div>
                                <p class="font-medium text-sm">${escapeHtml(ass.subject)}</p>
                                <p class="text-xs text-muted-foreground">${escapeHtml(ass.teacherName)}</p>
                            </div>
                        </div>
                        <button onclick="removeSubjectAssignment(${ass.id}, ${classId})" 
                                class="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded-lg text-red-500 transition-all">
                            <i data-lucide="x" class="h-4 w-4"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
        
    } catch (error) {
        console.error('Error loading subject assignments:', error);
        container.innerHTML = `
            <div class="text-sm text-red-500 text-center py-4 bg-red-50 rounded-xl">
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
                                <th class="px-4 py-3 text-center font-medium">Actions</th>
                             </tr>
                        </thead>
                        <tbody class="divide-y">
                            ${allSubjects.map(subject => {
                                const existing = existingMap[subject];
                                return `
                                    <tr class="hover:bg-muted/30 transition-colors">
                                        <td class="px-4 py-3 font-medium">${escapeHtml(subject)}</td>
                                        <td class="px-4 py-3">
                                            <select id="subject-teacher-${subject.replace(/\s/g, '_')}" 
                                                    class="rounded-lg border border-input bg-background px-3 py-2 text-sm w-64 focus:ring-2 focus:ring-primary">
                                                <option value="">-- Select Teacher --</option>
                                                ${teachers.map(t => `
                                                    <option value="${t.id}" ${existing?.teacherId === t.id ? 'selected' : ''}>
                                                        ${escapeHtml(t.User?.name || 'Unknown')} (${escapeHtml(t.subjects?.join(', ') || 'No subjects')})
                                                    </option>
                                                `).join('')}
                                            </select>
                                        </td>
                                        <td class="px-4 py-3 text-center">
                                            <div class="flex items-center justify-center gap-2">
                                                <button onclick="saveSubjectAssignment(${classId}, '${subject.replace(/'/g, "\\'")}')" 
                                                        class="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-all">
                                                    ${existing ? 'Update' : 'Assign'}
                                                </button>
                                                ${existing ? `
                                                    <button onclick="removeSubjectAssignment(${existing.id}, ${classId})" 
                                                            class="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-all">
                                                        Remove
                                                    </button>
                                                ` : ''}
                                            </div>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div class="flex justify-end gap-3 pt-4 border-t">
                    <button onclick="closeSubjectAssignmentModal()" class="px-5 py-2 border rounded-lg hover:bg-accent transition-all">Close</button>
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
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="closeSubjectAssignmentModal()"></div>
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl p-4">
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

function toggleLevel(levelKey) {
    const content = document.getElementById(`level-content-${levelKey}`);
    const icon = document.getElementById(`level-icon-${levelKey}`);
    if (content) {
        content.classList.toggle('hidden');
        if (icon) {
            icon.style.transform = content.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
        }
    }
}

function toggleClassDetails(classId) {
    const details = document.getElementById(`class-details-${classId}`);
    const icon = document.getElementById(`class-icon-${classId}`);
    if (details) {
        details.classList.toggle('hidden');
        if (icon) {
            icon.style.transform = details.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
        }
    }
}

// Make functions globally available
window.generateClassesFromCurriculum = generateClassesFromCurriculum;
window.toggleLevel = toggleLevel;
window.toggleClassDetails = toggleClassDetails;
