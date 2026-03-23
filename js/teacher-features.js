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

// ============ TEACHER DASHBOARD - REAL IMPLEMENTATION ============

let currentTeacherAssignments = null;
let currentStudentsForGrading = [];
let currentSelectedAssignment = null;

// Load teacher's assignments on dashboard load
async function loadTeacherAssignments() {
    try {
        const response = await api.teacher.getMyAssignments();
        currentTeacherAssignments = response.data;
        
        console.log('Teacher assignments loaded:', currentTeacherAssignments);
        
        // Update dashboard stats
        updateTeacherStats();
        
        // Populate grade dropdown
        populateGradeDropdown();
        
        // Update attendance section
        updateAttendanceSection();
        
        // Show/hide parent messages based on class teacher status
        updateParentMessagesVisibility();
        
        return currentTeacherAssignments;
    } catch (error) {
        console.error('Failed to load assignments:', error);
        showToast('Failed to load your teaching assignments', 'error');
        return null;
    }
}

function updateTeacherStats() {
    if (!currentTeacherAssignments) return;
    
    // Update stats cards
    const myStudentsCount = document.getElementById('my-students-count');
    const myClassesCount = document.getElementById('my-classes-count');
    const classAverageEl = document.getElementById('class-average');
    
    if (myStudentsCount) {
        // If class teacher, show their class student count
        if (currentTeacherAssignments.classTeacher) {
            myStudentsCount.textContent = currentTeacherAssignments.classTeacher.studentCount || 0;
        } else {
            // For subject teachers, show total students across all classes
            const totalStudents = currentTeacherAssignments.subjects.reduce((sum, s) => sum + (s.studentCount || 0), 0);
            myStudentsCount.textContent = totalStudents;
        }
    }
    
    if (myClassesCount) {
        const uniqueClasses = [...new Map(currentTeacherAssignments.subjects.map(s => [s.classId, s])).values()];
        myClassesCount.textContent = uniqueClasses.length;
    }
    
    if (classAverageEl) {
        // Load actual class average from API
        loadClassAverage();
    }
}

function populateGradeDropdown() {
    const select = document.getElementById('grade-assignment-select');
    if (!select || !currentTeacherAssignments) return;
    
    if (!currentTeacherAssignments.subjects || currentTeacherAssignments.subjects.length === 0) {
        select.innerHTML = '<option value="">No assignments found. Contact admin.</option>';
        return;
    }
    
    // Group by class and subject
    const assignments = currentTeacherAssignments.subjects;
    
    select.innerHTML = '<option value="">Select class and subject...</option>' +
        assignments.map(assignment => `
            <option value="${assignment.classId}|${assignment.subject}" 
                    data-class-id="${assignment.classId}"
                    data-class-name="${escapeHtml(assignment.className)}"
                    data-subject="${escapeHtml(assignment.subject)}"
                    data-is-class-teacher="${assignment.isClassTeacher}">
                📚 ${escapeHtml(assignment.subject)} - ${escapeHtml(assignment.className)} (${escapeHtml(assignment.classGrade)})
                ${assignment.isClassTeacher ? ' 🏫 [Class Teacher]' : ''}
            </option>
        `).join('');
    
    // Add event listener
    select.onchange = async function() {
        if (!this.value) {
            document.getElementById('grades-students-container').innerHTML = `
                <div class="text-center py-8 text-muted-foreground">
                    <i data-lucide="graduation-cap" class="h-12 w-12 mx-auto mb-3 opacity-50"></i>
                    <p>Select a class and subject to view students</p>
                </div>
            `;
            return;
        }
        
        const [classId, subject] = this.value.split('|');
        const selectedOption = this.options[this.selectedIndex];
        const className = selectedOption.getAttribute('data-class-name');
        
        currentSelectedAssignment = {
            classId: parseInt(classId),
            subject: subject,
            className: className,
            isClassTeacher: selectedOption.getAttribute('data-is-class-teacher') === 'true'
        };
        
        await loadStudentsForGrading(classId, subject);
    };
}

async function loadStudentsForGrading(classId, subject) {
    const container = document.getElementById('grades-students-container');
    if (!container) return;
    
    showLoading();
    try {
        const response = await api.teacher.getClassStudentsForSubject(classId, subject);
        const data = response.data;
        currentStudentsForGrading = data.students;
        
        if (!data.students || data.students.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12 border rounded-lg bg-muted/20">
                    <i data-lucide="users" class="h-12 w-12 mx-auto text-muted-foreground mb-3"></i>
                    <p class="text-muted-foreground">No students found for ${data.subject} in ${data.className}</p>
                    <p class="text-xs text-muted-foreground mt-2">Make sure students are enrolled in this class</p>
                </div>
            `;
            return;
        }
        
        // Render grades table
        container.innerHTML = `
            <div class="overflow-x-auto rounded-lg border">
                <table class="w-full text-sm">
                    <thead class="bg-muted/50">
                        <tr>
                            <th class="px-4 py-3 text-left font-medium">Student</th>
                            <th class="px-4 py-3 text-left font-medium">ELIMUID</th>
                            <th class="px-4 py-3 text-center font-medium">Score (%)</th>
                            <th class="px-4 py-3 text-center font-medium">Grade</th>
                            <th class="px-4 py-3 text-left font-medium">Comments</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y" id="grades-table-tbody">
                        ${data.students.map(student => `
                            <tr class="hover:bg-accent/50 transition-colors" data-student-id="${student.id}">
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-3">
                                        <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                            <span class="font-medium text-blue-700 text-sm">${getInitials(student.name)}</span>
                                        </div>
                                        <span class="font-medium">${escapeHtml(student.name)}</span>
                                    </div>
                                </td>
                                <td class="px-4 py-3">
                                    <span class="font-mono text-xs bg-muted px-2 py-1 rounded">${student.elimuid}</span>
                                </td>
                                <td class="px-4 py-3 text-center">
                                    <input type="number" 
                                           class="student-score w-24 rounded-lg border border-input bg-background px-3 py-2 text-sm text-center" 
                                           min="0" 
                                           max="100" 
                                           step="1"
                                           data-student-id="${student.id}"
                                           data-student-name="${escapeHtml(student.name)}"
                                           onchange="updateGradeDisplay(this)">
                                </td>
                                <td class="px-4 py-3 text-center">
                                    <span class="student-grade-display px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">-</span>
                                </td>
                                <td class="px-4 py-3">
                                    <input type="text" 
                                           class="student-comment w-full rounded border-0 bg-transparent text-sm focus:ring-0" 
                                           placeholder="Add comment..."
                                           data-student-id="${student.id}">
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div class="mt-4 flex justify-between items-center">
                <p class="text-sm text-muted-foreground">
                    <i data-lucide="info" class="h-4 w-4 inline mr-1"></i>
                    Enter scores from 0-100. Grades will be calculated automatically.
                </p>
                <button onclick="saveAllGrades()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                    <i data-lucide="save" class="h-4 w-4"></i>
                    Save All Grades
                </button>
            </div>
        `;
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
        
    } catch (error) {
        console.error('Failed to load students:', error);
        container.innerHTML = `
            <div class="text-center py-12 text-red-500">
                <i data-lucide="alert-circle" class="h-12 w-12 mx-auto mb-3"></i>
                <p>Failed to load students: ${error.message}</p>
                <button onclick="loadStudentsForGrading('${classId}', '${subject}')" class="mt-4 px-4 py-2 border rounded-lg hover:bg-accent">
                    Try Again
                </button>
            </div>
        `;
    } finally {
        hideLoading();
    }
}

function updateGradeDisplay(input) {
    const score = parseInt(input.value);
    const row = input.closest('tr');
    const gradeSpan = row.querySelector('.student-grade-display');
    
    if (isNaN(score)) {
        gradeSpan.textContent = '-';
        gradeSpan.className = 'student-grade-display px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full';
        return;
    }
    
    let grade = '';
    let color = 'gray';
    
    if (score >= 80) { grade = 'A'; color = 'green'; }
    else if (score >= 75) { grade = 'A-'; color = 'green'; }
    else if (score >= 70) { grade = 'B+'; color = 'blue'; }
    else if (score >= 65) { grade = 'B'; color = 'blue'; }
    else if (score >= 60) { grade = 'B-'; color = 'blue'; }
    else if (score >= 55) { grade = 'C+'; color = 'yellow'; }
    else if (score >= 50) { grade = 'C'; color = 'yellow'; }
    else if (score >= 45) { grade = 'C-'; color = 'yellow'; }
    else if (score >= 40) { grade = 'D+'; color = 'orange'; }
    else if (score >= 35) { grade = 'D'; color = 'orange'; }
    else if (score >= 30) { grade = 'D-'; color = 'orange'; }
    else { grade = 'E'; color = 'red'; }
    
    gradeSpan.textContent = grade;
    gradeSpan.className = `student-grade-display px-2 py-1 bg-${color}-100 text-${color}-700 text-xs rounded-full`;
    
    // Save automatically if user presses Enter
    if (window.event && window.event.key === 'Enter') {
        saveStudentGrade(input);
    }
}

async function saveAllGrades() {
    if (!currentSelectedAssignment) {
        showToast('Please select a class and subject first', 'error');
        return;
    }
    
    const assessmentName = document.getElementById('assessment-name')?.value;
    const assessmentType = document.getElementById('grade-type-select')?.value;
    
    if (!assessmentName) {
        showToast('Please enter an assessment name', 'error');
        document.getElementById('assessment-name').focus();
        return;
    }
    
    const scores = [];
    const comments = [];
    
    document.querySelectorAll('.student-score').forEach(input => {
        const studentId = input.getAttribute('data-student-id');
        const score = parseInt(input.value);
        if (!isNaN(score) && score >= 0 && score <= 100) {
            const row = input.closest('tr');
            const comment = row.querySelector('.student-comment')?.value || '';
            scores.push({ studentId: parseInt(studentId), score, comment });
        }
    });
    
    if (scores.length === 0) {
        showToast('No scores entered. Please enter at least one score.', 'error');
        return;
    }
    
    showLoading();
    try {
        const results = [];
        for (const item of scores) {
            const response = await api.teacher.enterMarks({
                studentId: item.studentId,
                subject: currentSelectedAssignment.subject,
                score: item.score,
                assessmentType: assessmentType,
                assessmentName: assessmentName,
                date: new Date().toISOString().split('T')[0],
                comment: item.comment
            });
            results.push(response);
        }
        
        showToast(`✅ Saved ${results.length} grade(s) for ${currentSelectedAssignment.subject}`, 'success');
        
        // Clear input for next entry
        document.getElementById('assessment-name').value = '';
        
        // Reload students to show saved grades
        await loadStudentsForGrading(currentSelectedAssignment.classId, currentSelectedAssignment.subject);
        
    } catch (error) {
        console.error('Failed to save grades:', error);
        showToast(error.message || 'Failed to save grades', 'error');
    } finally {
        hideLoading();
    }
}

async function saveStudentGrade(input) {
    const row = input.closest('tr');
    const studentId = parseInt(input.getAttribute('data-student-id'));
    const score = parseInt(input.value);
    const comment = row.querySelector('.student-comment')?.value || '';
    const assessmentName = document.getElementById('assessment-name')?.value;
    const assessmentType = document.getElementById('grade-type-select')?.value;
    
    if (!assessmentName) {
        showToast('Please enter an assessment name first', 'error');
        document.getElementById('assessment-name').focus();
        return;
    }
    
    if (isNaN(score) || score < 0 || score > 100) {
        showToast('Please enter a valid score (0-100)', 'error');
        return;
    }
    
    showLoading();
    try {
        const response = await api.teacher.enterMarks({
            studentId: studentId,
            subject: currentSelectedAssignment.subject,
            score: score,
            assessmentType: assessmentType,
            assessmentName: assessmentName,
            date: new Date().toISOString().split('T')[0],
            comment: comment
        });
        
        if (response.success) {
            showToast(`✅ Saved ${score}% for ${input.getAttribute('data-student-name')}`, 'success');
            input.classList.add('border-green-500');
            setTimeout(() => input.classList.remove('border-green-500'), 2000);
        }
    } catch (error) {
        showToast(error.message || 'Failed to save grade', 'error');
        input.classList.add('border-red-500');
        setTimeout(() => input.classList.remove('border-red-500'), 2000);
    } finally {
        hideLoading();
    }
}

function updateAttendanceSection() {
    if (!currentTeacherAssignments) return;
    
    // Check if teacher is a class teacher (has homeroom)
    const isClassTeacher = currentTeacherAssignments.classTeacher !== null;
    
    const dailyAttendancePanel = document.getElementById('daily-attendance-panel');
    const subjectAttendancePanel = document.getElementById('subject-attendance-panel');
    const attendanceClassSelect = document.getElementById('attendance-class-select');
    
    if (dailyAttendancePanel) {
        dailyAttendancePanel.style.display = isClassTeacher ? 'block' : 'none';
        
        if (isClassTeacher && attendanceClassSelect) {
            attendanceClassSelect.innerHTML = `
                <option value="${currentTeacherAssignments.classTeacher.classId}">
                    ${currentTeacherAssignments.classTeacher.className} (Your Class)
                </option>
            `;
        }
    }
    
    // Populate subject attendance dropdown
    if (subjectAttendancePanel && attendanceClassSelect) {
        const subjectSelect = document.getElementById('attendance-subject-select');
        if (subjectSelect && currentTeacherAssignments.subjects) {
            const uniqueSubjects = [...new Set(currentTeacherAssignments.subjects.map(s => s.subject))];
            subjectSelect.innerHTML = '<option value="">Select subject...</option>' +
                uniqueSubjects.map(subject => `
                    <option value="${subject}">${subject}</option>
                `).join('');
        }
    }
}

function updateParentMessagesVisibility() {
    const isClassTeacher = currentTeacherAssignments?.classTeacher !== null;
    const parentMessagesSection = document.getElementById('parent-messages-section');
    
    if (parentMessagesSection) {
        if (isClassTeacher) {
            parentMessagesSection.style.display = 'block';
            loadParentMessages();
        } else {
            parentMessagesSection.style.display = 'none';
        }
    }
}

async function loadParentMessages() {
    if (!currentTeacherAssignments?.classTeacher) return;
    
    try {
        const response = await api.teacher.getConversations();
        const messages = response.data || [];
        
        const container = document.getElementById('parent-messages-container');
        if (!container) return;
        
        if (messages.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-muted-foreground">
                    <i data-lucide="message-circle" class="h-12 w-12 mx-auto mb-3 opacity-50"></i>
                    <p>No messages from parents yet</p>
                </div>
            `;
        } else {
            container.innerHTML = messages.map(msg => `
                <div class="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                     onclick="viewParentConversation(${msg.userId})">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="font-medium">${escapeHtml(msg.userName)}</p>
                            <p class="text-xs text-muted-foreground">About: ${escapeHtml(msg.studentName)}</p>
                            <p class="text-sm mt-1">${escapeHtml(msg.lastMessage?.substring(0, 100) || '')}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-xs text-muted-foreground">${timeAgo(msg.lastMessageTime)}</p>
                            ${msg.unreadCount > 0 ? 
                                `<span class="bg-red-500 text-white text-xs rounded-full px-2 py-1 mt-1 inline-block">${msg.unreadCount}</span>` : ''}
                        </div>
                    </div>
                </div>
            `).join('');
        }
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    } catch (error) {
        console.error('Failed to load messages:', error);
    }
}

async function viewParentConversation(parentId) {
    try {
        const response = await api.teacher.getMessages(parentId);
        const messages = response.data || [];
        
        showConversationModal(messages, parentId);
        
        // Mark as read
        await api.teacher.markMessagesAsRead(parentId);
        await loadParentMessages();
        
    } catch (error) {
        console.error('Failed to load conversation:', error);
        showToast('Failed to load conversation', 'error');
    }
}

function showConversationModal(messages, parentId) {
    let modal = document.getElementById('conversation-modal');
    if (!modal) {
        createConversationModal();
        modal = document.getElementById('conversation-modal');
    }
    
    const user = getCurrentUser();
    
    let messagesHtml = '';
    messages.forEach(msg => {
        const isSent = msg.senderId === user.id;
        messagesHtml += `
            <div class="flex ${isSent ? 'justify-end' : 'justify-start'} mb-4">
                <div class="${isSent ? 'chat-bubble-sent' : 'chat-bubble-received'} max-w-[70%]">
                    ${!isSent ? `<p class="text-sm font-medium mb-1">${escapeHtml(msg.Sender?.name || 'Parent')}</p>` : ''}
                    <p class="text-sm">${escapeHtml(msg.content)}</p>
                    <p class="text-xs text-muted-foreground mt-1">${timeAgo(msg.createdAt)}</p>
                </div>
            </div>
        `;
    });
    
    if (messagesHtml === '') {
        messagesHtml = '<div class="text-center text-muted-foreground py-8">No messages yet</div>';
    }
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.innerHTML = `
        <div class="space-y-4">
            <div class="flex justify-between items-center border-b pb-2">
                <h4 class="font-semibold">Conversation with Parent</h4>
                <button onclick="closeConversationModal()" class="p-1 hover:bg-accent rounded">
                    <i data-lucide="x" class="h-5 w-5"></i>
                </button>
            </div>
            
            <div class="space-y-4 max-h-96 overflow-y-auto p-2" id="conversation-messages">
                ${messagesHtml}
            </div>
            
            <div class="flex gap-2 pt-2 border-t">
                <textarea id="reply-message" rows="2" placeholder="Type your reply..." 
                          class="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none"></textarea>
            </div>
            <div class="flex justify-end">
                <button onclick="sendReply(${parentId})" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
                    <i data-lucide="send" class="h-4 w-4"></i>
                    Send Reply
                </button>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        const messagesDiv = document.getElementById('conversation-messages');
        if (messagesDiv) messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }, 100);
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function createConversationModal() {
    const modalHTML = `
        <div id="conversation-modal" class="fixed inset-0 z-50 hidden">
            <div class="absolute inset-0 bg-black/50" onclick="closeConversationModal()"></div>
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl p-4">
                <div class="rounded-xl border bg-card shadow-xl animate-fade-in">
                    <div class="modal-content p-6">
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeConversationModal() {
    const modal = document.getElementById('conversation-modal');
    if (modal) modal.classList.add('hidden');
}

async function sendReply(parentId) {
    const messageInput = document.getElementById('reply-message');
    const message = messageInput?.value.trim();
    
    if (!message) {
        showToast('Please enter a message', 'error');
        return;
    }
    
    showLoading();
    try {
        const response = await api.teacher.replyToParent({
            parentId: parentId,
            message: message
        });
        
        if (response.success) {
            messageInput.value = '';
            showToast('✅ Reply sent', 'success');
            
            // Refresh conversation
            const newMessages = await api.teacher.getMessages(parentId);
            showConversationModal(newMessages.data, parentId);
        }
    } catch (error) {
        showToast(error.message || 'Failed to send reply', 'error');
    } finally {
        hideLoading();
    }
}

async function loadClassAverage() {
    if (!currentTeacherAssignments?.classTeacher) return;
    
    try {
        const response = await api.analytics.getClassAnalytics(
            currentTeacherAssignments.classTeacher.classId
        );
        
        const classAverageEl = document.getElementById('class-average');
        if (classAverageEl && response.data) {
            classAverageEl.textContent = `${Math.round(response.data.overallAverage || 0)}%`;
        }
    } catch (error) {
        console.error('Failed to load class average:', error);
    }
}

// Initialize teacher dashboard
async function initTeacherDashboard() {
    await loadTeacherAssignments();
    
    // Set up event listeners
    const saveGradesBtn = document.getElementById('save-grades-btn');
    if (saveGradesBtn) {
        saveGradesBtn.onclick = saveAllGrades;
    }
    
    // Load tasks
    await refreshTasks();
    
    // Load duty
    await loadTodayDuty();
}

// Call this when teacher dashboard loads
if (document.getElementById('teacher-dashboard-content')) {
    initTeacherDashboard();
}

// Export functions
window.loadMyStudents = loadMyStudents;
window.refreshMyStudents = refreshMyStudents;
window.deleteStudent = deleteStudent;
window.renderStudentsTable = renderStudentsTable;
