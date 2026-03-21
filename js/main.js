// main.js - Complete file with all backend integrations

// ============ GLOBAL VARIABLES ============
let currentRole = null;
let currentSection = 'dashboard';
let dashboardData = {};
let schoolSettings = {};
let customSubjects = [];
let schoolUpdateCallbacks = [];
let clickCount = 0;

// Add at the top of main.js after the global variables
// These functions should be defined in other JS files
// Make sure they're loaded before main.js

// If they're not in other files, add placeholder implementations:
window.loadPendingSchools = window.loadPendingSchools || function() { 
    console.warn('loadPendingSchools not implemented');
    return [];
};

window.loadAllSchools = window.loadAllSchools || function() {
    console.warn('loadAllSchools not implemented');
    return [];
};
// etc.


// Register callback for school updates
function onSchoolUpdate(callback) {
    if (typeof callback === 'function') {
        schoolUpdateCallbacks.push(callback);
    }
}

// ============ CURRICULUM DATA ============
const CURRICULUMS = {
    'cbc': {
        name: 'CBC (Competency Based Curriculum)',
        levels: {
            primary: ['PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'],
            secondary: ['Grade 7', 'Grade 8', 'Grade 9']
        },
        subjects: {
            primary: ['Mathematics', 'English', 'Kiswahili', 'Science', 'Social Studies', 'CRE/IRE', 'Physical Education', 'Art & Craft', 'Music'],
            secondary: ['Mathematics', 'English', 'Kiswahili', 'Biology', 'Chemistry', 'Physics', 'History', 'Geography', 'CRE/IRE', 'Business Studies', 'Agriculture', 'Computer Studies']
        },
        grading: {
            primary: [
                { grade: 'EE', range: '80-100', description: 'Exceeding Expectations' },
                { grade: 'ME', range: '60-79', description: 'Meeting Expectations' },
                { grade: 'AE', range: '40-59', description: 'Approaching Expectations' },
                { grade: 'BE', range: '0-39', description: 'Below Expectations' }
            ],
            secondary: [
                { grade: 'A', range: '81-100', description: 'Excellent' },
                { grade: 'A-', range: '75-80', description: 'Very Good' },
                { grade: 'B+', range: '70-74', description: 'Good' },
                { grade: 'B', range: '65-69', description: 'Above Average' },
                { grade: 'B-', range: '60-64', description: 'Average' },
                { grade: 'C+', range: '55-59', description: 'Below Average' },
                { grade: 'C', range: '50-54', description: 'Fair' },
                { grade: 'C-', range: '45-49', description: 'Poor' },
                { grade: 'D+', range: '40-44', description: 'Very Poor' },
                { grade: 'D', range: '35-39', description: 'Weak' },
                { grade: 'D-', range: '30-34', description: 'Very Weak' },
                { grade: 'E', range: '0-29', description: 'Fail' }
            ]
        },
        countries: ['Kenya']
    },
    '844': {
        name: '8-4-4 System',
        levels: {
            primary: ['Standard 1', 'Standard 2', 'Standard 3', 'Standard 4', 'Standard 5', 'Standard 6', 'Standard 7', 'Standard 8'],
            secondary: ['Form 1', 'Form 2', 'Form 3', 'Form 4']
        },
        subjects: {
            primary: ['Mathematics', 'English', 'Kiswahili', 'Science', 'Social Studies', 'CRE/IRE', 'Physical Education'],
            secondary: ['Mathematics', 'English', 'Kiswahili', 'Biology', 'Chemistry', 'Physics', 'History', 'Geography', 'CRE/IRE', 'Business Studies', 'Agriculture', 'Computer Studies']
        },
        grading: {
            primary: [
                { grade: 'A', range: '81-100', description: 'Excellent' },
                { grade: 'A-', range: '75-80', description: 'Very Good' },
                { grade: 'B+', range: '70-74', description: 'Good' },
                { grade: 'B', range: '65-69', description: 'Above Average' },
                { grade: 'B-', range: '60-64', description: 'Average' },
                { grade: 'C+', range: '55-59', description: 'Below Average' },
                { grade: 'C', range: '50-54', description: 'Fair' },
                { grade: 'C-', range: '45-49', description: 'Poor' },
                { grade: 'D+', range: '40-44', description: 'Very Poor' },
                { grade: 'D', range: '35-39', description: 'Weak' },
                { grade: 'D-', range: '30-34', description: 'Very Weak' },
                { grade: 'E', range: '0-29', description: 'Fail' }
            ],
            secondary: [
                { grade: 'A', range: '81-100', description: 'Excellent' },
                { grade: 'A-', range: '75-80', description: 'Very Good' },
                { grade: 'B+', range: '70-74', description: 'Good' },
                { grade: 'B', range: '65-69', description: 'Above Average' },
                { grade: 'B-', range: '60-64', description: 'Average' },
                { grade: 'C+', range: '55-59', description: 'Below Average' },
                { grade: 'C', range: '50-54', description: 'Fair' },
                { grade: 'C-', range: '45-49', description: 'Poor' },
                { grade: 'D+', range: '40-44', description: 'Very Poor' },
                { grade: 'D', range: '35-39', description: 'Weak' },
                { grade: 'D-', range: '30-34', description: 'Very Weak' },
                { grade: 'E', range: '0-29', description: 'Fail' }
            ]
        },
        countries: ['Kenya']
    },
    'british': {
        name: 'British Curriculum',
        levels: {
            primary: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6'],
            secondary: ['Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13']
        },
        subjects: {
            primary: ['English', 'Mathematics', 'Science', 'History', 'Geography', 'Art', 'Music', 'Physical Education'],
            secondary: ['English Literature', 'English Language', 'Mathematics', 'Biology', 'Chemistry', 'Physics', 'History', 'Geography', 'French', 'Spanish', 'Computer Science', 'Business Studies', 'Economics', 'Art & Design', 'Music', 'Physical Education']
        },
        grading: {
            primary: [
                { grade: 'A*', range: '90-100', description: 'Exceptional' },
                { grade: 'A', range: '80-89', description: 'Excellent' },
                { grade: 'B', range: '70-79', description: 'Very Good' },
                { grade: 'C', range: '60-69', description: 'Good' },
                { grade: 'D', range: '50-59', description: 'Satisfactory' },
                { grade: 'E', range: '40-49', description: 'Below Average' },
                { grade: 'F', range: '30-39', description: 'Poor' },
                { grade: 'G', range: '20-29', description: 'Very Poor' },
                { grade: 'U', range: '0-19', description: 'Ungraded' }
            ],
            secondary: [
                { grade: 'A*', range: '90-100', description: 'Exceptional' },
                { grade: 'A', range: '80-89', description: 'Excellent' },
                { grade: 'B', range: '70-79', description: 'Very Good' },
                { grade: 'C', range: '60-69', description: 'Good' },
                { grade: 'D', range: '50-59', description: 'Satisfactory' },
                { grade: 'E', range: '40-49', description: 'Below Average' },
                { grade: 'F', range: '30-39', description: 'Poor' },
                { grade: 'G', range: '20-29', description: 'Very Poor' },
                { grade: 'U', range: '0-19', description: 'Ungraded' }
            ]
        },
        countries: ['UK', 'International']
    },
    'american': {
        name: 'American Curriculum',
        levels: {
            primary: ['Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'],
            secondary: ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']
        },
        subjects: {
            primary: ['English Language Arts', 'Mathematics', 'Science', 'Social Studies', 'Art', 'Music', 'Physical Education'],
            secondary: ['English', 'Mathematics', 'Biology', 'Chemistry', 'Physics', 'History', 'Geography', 'Spanish', 'French', 'Computer Science', 'Business', 'Economics', 'Art', 'Music', 'Physical Education']
        },
        grading: {
            primary: [
                { grade: 'A', range: '90-100', description: 'Excellent', gpa: 4.0 },
                { grade: 'B', range: '80-89', description: 'Good', gpa: 3.0 },
                { grade: 'C', range: '70-79', description: 'Average', gpa: 2.0 },
                { grade: 'D', range: '60-69', description: 'Below Average', gpa: 1.0 },
                { grade: 'F', range: '0-59', description: 'Failing', gpa: 0.0 }
            ],
            secondary: [
                { grade: 'A', range: '90-100', description: 'Excellent', gpa: 4.0 },
                { grade: 'B', range: '80-89', description: 'Good', gpa: 3.0 },
                { grade: 'C', range: '70-79', description: 'Average', gpa: 2.0 },
                { grade: 'D', range: '60-69', description: 'Below Average', gpa: 1.0 },
                { grade: 'F', range: '0-59', description: 'Failing', gpa: 0.0 }
            ]
        },
        countries: ['USA', 'International']
    }
};

// ============ HELPER FUNCTIONS ============

function getGradeFromScore(score, curriculum, level) {
    const curriculumData = CURRICULUMS[curriculum];
    if (!curriculumData) return { grade: 'N/A', description: 'Not available' };
    
    const gradingScale = curriculumData.grading[level] || curriculumData.grading.primary;
    const scoreNum = parseInt(score);
    
    for (const gradeInfo of gradingScale) {
        const [min, max] = gradeInfo.range.split('-').map(Number);
        if (scoreNum >= min && scoreNum <= max) {
            return gradeInfo;
        }
    }
    
    return { grade: 'N/A', description: 'Invalid score' };
}

function getInitials(name) {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function timeAgo(timestamp) {
    if (!timestamp) return 'N/A';
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
        }
    }
    
    return 'just now';
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// ============================================
// CURRICULUM CHANGE FOR ALL USERS - Add to main.js
// ============================================

// Override handleCurriculumChange to broadcast to all users
async function handleCurriculumChange(newCurriculum) {
    if (!newCurriculum) return;
    
    showLoading();
    try {
        const school = getCurrentSchool();
        if (!school) {
            showToast('School not found', 'error');
            return;
        }
        
        // Update school settings on backend
        const response = await api.admin.updateSchoolSettings({
            ...school.settings,
            curriculum: newCurriculum
        });
        
        if (response.success) {
            // Update local storage
            schoolSettings.curriculum = newCurriculum;
            localStorage.setItem('schoolSettings', JSON.stringify(schoolSettings));
            
            // Emit real-time update to ALL connected clients
            if (typeof emitCurriculumUpdate === 'function') {
                emitCurriculumUpdate(newCurriculum);
            }
            
            // Update grading system
            updateGradingSystem(newCurriculum);
            
            // Get current user role
            const user = getCurrentUser();
            const role = user?.role;
            
            // Force refresh ALL data for this school
            // This will update all users when they next refresh
            const updateTimestamp = new Date().toISOString();
            localStorage.setItem('curriculumUpdateTimestamp', updateTimestamp);
            
            // Refresh ALL users' dashboards
            if (role === 'teacher') {
                await refreshMyStudents();
                await loadTeacherMessages();
                // Update grade display for all students
                document.querySelectorAll('.student-grade').forEach(el => {
                    const scoreEl = el.closest('tr')?.querySelector('.student-score');
                    if (scoreEl) {
                        const score = parseInt(scoreEl.value);
                        if (!isNaN(score)) {
                            const gradeInfo = getGradeFromScore(score, newCurriculum, schoolSettings.schoolLevel || 'secondary');
                            el.textContent = gradeInfo.grade;
                        }
                    }
                });
            } else if (role === 'admin') {
                await refreshStudentsList();
                await refreshTeachersList();
                await refreshClassesList();
                await updateAdminStats();
            } else if (role === 'parent') {
                await refreshParentDashboard();
                // Update grade display for parent view
                document.querySelectorAll('#grades-table-body tr').forEach(row => {
                    const scoreEl = row.querySelector('td:nth-child(2)');
                    if (scoreEl) {
                        const score = parseInt(scoreEl.textContent);
                        if (!isNaN(score)) {
                            const gradeInfo = getGradeFromScore(score, newCurriculum, schoolSettings.schoolLevel || 'secondary');
                            const gradeCell = row.querySelector('td:nth-child(3)');
                            if (gradeCell) {
                                gradeCell.innerHTML = `<span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">${gradeInfo.grade}</span>`;
                            }
                        }
                    }
                });
            } else if (role === 'student') {
                await refreshStudentDashboard();
                // Update student's own grades
                document.querySelectorAll('#my-grades div').forEach(gradeDiv => {
                    const scoreSpan = gradeDiv.querySelector('.font-semibold');
                    if (scoreSpan) {
                        const match = scoreSpan.textContent.match(/(\d+)%/);
                        if (match) {
                            const score = parseInt(match[1]);
                            const gradeInfo = getGradeFromScore(score, newCurriculum, schoolSettings.schoolLevel || 'secondary');
                            scoreSpan.textContent = `${score}% (${gradeInfo.grade})`;
                        }
                    }
                });
            }
            
            // Show success message
            const curriculumName = CURRICULUMS[newCurriculum]?.name || newCurriculum;
            showToast(`✅ Curriculum changed to ${curriculumName}. All users will see updated grading.`, 'success');
            
            // Store the curriculum in a cookie/session for other tabs
            document.cookie = `schoolCurriculum=${newCurriculum}; path=/; max-age=${30*24*60*60}`;
            
        }
    } catch (error) {
        console.error('Curriculum change error:', error);
        showToast('Failed to update curriculum', 'error');
    } finally {
        hideLoading();
    }
}

// Listen for curriculum updates from other tabs
window.addEventListener('storage', function(e) {
    if (e.key === 'schoolSettings' && e.newValue) {
        const newSettings = JSON.parse(e.newValue);
        const oldSettings = schoolSettings;
        
        if (newSettings.curriculum !== oldSettings?.curriculum) {
            console.log('Curriculum changed in another tab:', newSettings.curriculum);
            schoolSettings = newSettings;
            showToast(`Curriculum updated to ${CURRICULUMS[newSettings.curriculum]?.name || newSettings.curriculum}`, 'info');
            
            // Refresh current view
            if (currentSection) {
                showDashboardSection(currentSection);
            }
        }
    }
});

// Listen for cross-tab curriculum update timestamp
window.addEventListener('storage', function(e) {
    if (e.key === 'curriculumUpdateTimestamp') {
        console.log('Curriculum update detected from another tab');
        // Force reload of curriculum data
        loadSchoolSettings().then(() => {
            if (currentSection) {
                showDashboardSection(currentSection);
            }
        });
    }
});

// Update grading system based on curriculum
function updateGradingSystem(curriculum) {
    // Update global grading constants
    window.currentCurriculum = curriculum;
    
    // Re-render any open modals or tables that use grading
    const activeModals = document.querySelectorAll('.modal:not(.hidden)');
    activeModals.forEach(modal => {
        const content = modal.querySelector('.modal-content');
        if (content && content.innerHTML.includes('grade')) {
            // Modal contains grade data, refresh it
            const studentId = modal.dataset.studentId;
            if (studentId && typeof loadStudentDetails === 'function') {
                loadStudentDetails(studentId);
            }
        }
    });
}

// Listen for school name changes
window.addEventListener('school-name-changed', (event) => {
    const { newName, schoolCode } = event.detail;
    console.log('School name changed event received:', newName);
    
    // Update any school name elements that might have been missed
    setTimeout(() => {
        document.querySelectorAll('h2, h1, .font-bold, .school-name').forEach(el => {
            if (el.textContent && 
                !el.textContent.includes('ShuleAI') && 
                !el.textContent.includes('Dashboard') &&
                el.textContent.length > 3 &&
                el.textContent.length < 50) {
                el.textContent = newName;
            }
        });
    }, 100);
});

// ============ INITIALIZATION ============

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔵 DOM Content Loaded - Starting initialization');
    
    // Initialize icons first
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
    
    // Load saved settings
    const savedSettings = localStorage.getItem('schoolSettings');
    if (savedSettings) {
        try {
            schoolSettings = JSON.parse(savedSettings);
            customSubjects = schoolSettings.customSubjects || [];
            console.log('✅ School settings loaded from localStorage');
        } catch (e) {
            console.error('Failed to parse school settings:', e);
        }
    }
    
    // Small delay to ensure everything is loaded
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check if user is already authenticated
    console.log('Checking authentication...');
    const isAuthenticated = await checkAuth();
    console.log('Is authenticated:', isAuthenticated);
    
    if (isAuthenticated) {
        // Try multiple ways to get the role
        let role = null;
        
        // Method 1: Check if we have a currentUser from checkAuth
        if (currentUser && currentUser.role) {
            role = currentUser.role;
            console.log('✅ Role from currentUser:', role);
        }
        
        // Method 2: Use getCurrentRole helper
        if (!role && typeof getCurrentRole === 'function') {
            role = getCurrentRole();
            console.log('✅ Role from getCurrentRole():', role);
        }
        
        // Method 3: Check localStorage directly
        if (!role) {
            role = localStorage.getItem('userRole');
            console.log('✅ Role from localStorage:', role);
        }
        
        // Method 4: Parse from user object
        if (!role) {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            role = user.role;
            console.log('✅ Role from user object:', role);
        }
        
        // Method 5: Use the user object from getCurrentUser
        if (!role) {
            const user = getCurrentUser();
            role = user.role;
            console.log('✅ Role from getCurrentUser():', role);
        }
        
        // Method 6: Last resort - try to fetch from API
        if (!role) {
            console.log('⚠️ No role found in storage, attempting API call...');
            try {
                const response = await api.auth.getMe();
                if (response && response.data && response.data.user) {
                    role = response.data.user.role;
                    // Save it for next time
                    localStorage.setItem('userRole', role);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    console.log('✅ Role from API:', role);
                }
            } catch (error) {
                console.error('❌ Failed to fetch user from API:', error);
            }
        }
        
        if (role) {
            console.log('🎯 Final role determined:', role);
            
            // Ensure role is in the correct format (superadmin vs super_admin)
            // Your backend might use 'super_admin' but frontend might expect 'superadmin'
            if (role === 'super_admin') {
                role = 'superadmin';
                console.log('🔄 Converted super_admin to superadmin');
            }
            
            // Show the dashboard
            await showDashboard(role);
            
            // Connect WebSocket for real-time features
            if (typeof connectWebSocket === 'function') {
                setTimeout(connectWebSocket, 500);
            }
        } else {
            console.error('❌ Authenticated but no role could be determined');
            showToast('Session error. Please log in again.', 'error');
            setTimeout(() => {
                window.location.href = '/'; // Redirect to landing page
            }, 2000);
        }
    } else {
        console.log('User not authenticated, showing landing page');
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Set current date in header if element exists
    const currentDateEl = document.getElementById('current-date');
    if (currentDateEl) {
        currentDateEl.textContent = new Date().toLocaleDateString('en-US', { 
            month: 'short', day: 'numeric', year: 'numeric' 
        });
    }
    
    console.log('✅ Initialization complete');
});

function setupEventListeners() {
    // Secret triple-click for super admin
    const secretTrigger = document.getElementById('secret-logo-trigger');
    if (secretTrigger) {
        secretTrigger.addEventListener('click', () => {
            clickCount++;
            if (clickCount === 3) {
                const superAdminCard = document.getElementById('superadmin-role-card');
                if (superAdminCard) {
                    superAdminCard.classList.remove('hidden');
                    showToast('Super Admin access granted', 'info');
                }
                clickCount = 0;
            }
            setTimeout(() => clickCount = 0, 2000);
        });
    }
    
    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('bg-black/50')) {
            closeAuthModal();
            closeNameChangeModal();
        }
    });
    
    // Close user menu when clicking outside
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('user-menu');
        const btn = e.target.closest('button');
        if (menu && !menu.contains(e.target) && (!btn || !btn.onclick || !btn.onclick.toString().includes('toggleUserMenu'))) {
            menu.classList.add('hidden');
        }
    });
}

// ============ AUTH MODAL FUNCTIONS ============

function openAuthModal(role, mode) {
    currentRole = role;
    const modal = document.getElementById('auth-modal');
    const titleEl = document.getElementById('auth-modal-title');
    const contentEl = document.getElementById('auth-modal-content');
    
    if (!modal || !titleEl || !contentEl) return;
    
    titleEl.textContent = mode === 'signin' ? `Sign In as ${role}` : `Sign Up as ${role}`;
    contentEl.innerHTML = getAuthForm(role, mode);
    modal.classList.remove('hidden');
    lucide.createIcons();
}

function getAuthForm(role, mode) {
    if (role === 'superadmin') {
        return `
            <div>
                <label class="block text-sm font-medium mb-1">Email</label>
                <input type="email" id="auth-email" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="super@shuleai.com">
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Password</label>
                <input type="password" id="auth-password" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Secret Key</label>
                <input type="password" id="auth-secret-key" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="Enter super admin key">
                <p class="text-xs text-muted-foreground mt-1">Contact system administrator for the key</p>
            </div>
        `;
    }
    
    if (mode === 'signin') {
        return `
            <div>
                <label class="block text-sm font-medium mb-1">Email</label>
                <input type="email" id="auth-email" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Password</label>
                <input type="password" id="auth-password" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
            </div>
        `;
    } else {
        if (role === 'admin') {
            return `
                <div>
                    <label class="block text-sm font-medium mb-1">Full Name</label>
                    <input type="text" id="auth-name" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Email</label>
                    <input type="email" id="auth-email" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">School Name</label>
                    <input type="text" id="auth-school-name" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">School Level</label>
                    <select id="auth-school-level" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        <option value="primary">Primary</option>
                        <option value="secondary">Secondary</option>
                        <option value="both">Both Primary & Secondary</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Curriculum</label>
                    <select id="auth-curriculum" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        <option value="cbc">CBC (Competency Based Curriculum)</option>
                        <option value="844">8-4-4 System</option>
                        <option value="british">British Curriculum</option>
                        <option value="american">American Curriculum</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Phone</label>
                    <input type="tel" id="auth-phone" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Password</label>
                    <input type="password" id="auth-password" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                </div>
                <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p class="text-xs text-blue-600 dark:text-blue-400">
                        <i data-lucide="info" class="h-3 w-3 inline mr-1"></i>
                        Your school will be pending approval. You'll receive a short code (e.g., SHL-A7K29) for teachers to use.
                    </p>
                </div>
            `;
        } else if (role === 'teacher') {
            return `
                <div>
                    <label class="block text-sm font-medium mb-1">Full Name</label>
                    <input type="text" id="auth-name" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Email</label>
                    <input type="email" id="auth-email" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                </div>
                <div class="flex gap-2">
                    <div class="flex-1">
                        <label class="block text-sm font-medium mb-1">School Code</label>
                        <input type="text" id="auth-school-code" placeholder="e.g., SHL-A7K29" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                    </div>
                    <div class="flex items-end">
                        <button type="button" onclick="verifySchoolCodeInput()" class="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm mb-[1px]">Verify</button>
                    </div>
                </div>
                <div id="school-verify-status" class="text-xs hidden"></div>
                <div>
                    <label class="block text-sm font-medium mb-1">Subjects (comma separated)</label>
                    <input type="text" id="auth-subjects" placeholder="Mathematics, Science, English" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Qualification</label>
                    <input type="text" id="auth-qualification" placeholder="e.g., B.Ed Mathematics" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Phone</label>
                    <input type="tel" id="auth-phone" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Password</label>
                    <input type="password" id="auth-password" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                </div>
            `;
        } else if (role === 'parent') {
            return `
                <div>
                    <label class="block text-sm font-medium mb-1">Full Name</label>
                    <input type="text" id="auth-name" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Email</label>
                    <input type="email" id="auth-email" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Student's ELIMUID</label>
                    <input type="text" id="auth-student-elimuid" placeholder="e.g., ELI-2024-001" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Phone</label>
                    <input type="tel" id="auth-phone" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Password</label>
                    <input type="password" id="auth-password" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                </div>
            `;
        } else if (role === 'student') {
            return `
                <div>
                    <label class="block text-sm font-medium mb-1">ELIMUID</label>
                    <input type="text" id="auth-elimuid" placeholder="e.g., ELI-2024-001" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Password</label>
                    <input type="password" id="auth-password" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                </div>
            `;
        }
    }
    return '';
}

async function verifySchoolCodeInput() {
    const code = document.getElementById('auth-school-code')?.value;
    if (!code) {
        showToast('Please enter a school code', 'error');
        return;
    }
    
    showLoading();
    try {
        const response = await verifySchoolCode(code);
        const statusDiv = document.getElementById('school-verify-status');
        statusDiv.className = 'text-xs mt-1 p-2 bg-green-100 text-green-700 rounded-lg';
        statusDiv.innerHTML = `<i data-lucide="check-circle" class="h-3 w-3 inline mr-1"></i> Verified: ${response.data.schoolName}`;
        statusDiv.classList.remove('hidden');
        lucide.createIcons();
        showToast(`School found: ${response.data.schoolName}`, 'success');
    } catch (error) {
        const statusDiv = document.getElementById('school-verify-status');
        statusDiv.className = 'text-xs mt-1 p-2 bg-red-100 text-red-700 rounded-lg';
        statusDiv.innerHTML = `<i data-lucide="x-circle" class="h-3 w-3 inline mr-1"></i> ${error.message}`;
        statusDiv.classList.remove('hidden');
        lucide.createIcons();
        showToast(error.message || 'Invalid school code', 'error');
    } finally {
        hideLoading();
    }
}

async function handleAuthSubmit() {
    const modalTitle = document.getElementById('auth-modal-title').textContent;
    const mode = modalTitle.includes('Sign In') ? 'signin' : 'signup';
    const role = currentRole;
    
    showLoading();
    
    try {
        if (role === 'superadmin' && mode === 'signin') {
            const email = document.getElementById('auth-email')?.value;
            const password = document.getElementById('auth-password')?.value;
            const secretKey = document.getElementById('auth-secret-key')?.value;
            
            if (!email || !password || !secretKey) {
                showToast('All fields are required', 'error');
                hideLoading();
                return;
            }
            
            const response = await superAdminLogin(email, password, secretKey);
            showToast('Super Admin login successful', 'success');
            await showDashboard('superadmin');
            closeAuthModal();
            
        } else if (role === 'student' && mode === 'signin') {
            const elimuid = document.getElementById('auth-elimuid')?.value;
            const password = document.getElementById('auth-password')?.value;
            
            if (!elimuid || !password) {
                showToast('ELIMUID and password required', 'error');
                hideLoading();
                return;
            }
            
            const response = await studentLogin(elimuid, password);
            showToast('Login successful', 'success');
            await showDashboard('student');
            closeAuthModal();
            
        } else if (mode === 'signin') {
            const email = document.getElementById('auth-email')?.value;
            const password = document.getElementById('auth-password')?.value;
            
            if (!email || !password) {
                showToast('Email and password required', 'error');
                hideLoading();
                return;
            }
            
            const response = await login(email, password, role);
            showToast('Login successful', 'success');
            await showDashboard(role);
            closeAuthModal();
            
        } else {
            if (role === 'admin') {
                const adminData = {
                    name: document.getElementById('auth-name')?.value,
                    email: document.getElementById('auth-email')?.value,
                    password: document.getElementById('auth-password')?.value,
                    phone: document.getElementById('auth-phone')?.value,
                    schoolName: document.getElementById('auth-school-name')?.value,
                    schoolLevel: document.getElementById('auth-school-level')?.value,
                    curriculum: document.getElementById('auth-curriculum')?.value
                };
                
                if (!adminData.name || !adminData.email || !adminData.password || !adminData.schoolName) {
                    showToast('Please fill all required fields', 'error');
                    hideLoading();
                    return;
                }
                
                const response = await adminSignup(adminData);
                showToast(response.message, 'success');
                
                if (response.data) {
                    showToast(`Your school code: ${response.data.shortCode}`, 'info', 10000);
                }
                
                closeAuthModal();
                
            } 
            
            else if (role === 'teacher') {
                const schoolCode = document.getElementById('auth-school-code')?.value;
                if (!schoolCode) {
                    showToast('School code is required', 'error');
                    hideLoading();
                    return;
                }
                
                const subjects = document.getElementById('auth-subjects')?.value;
                const teacherData = {
                    name: document.getElementById('auth-name')?.value,
                    email: document.getElementById('auth-email')?.value,
                    password: document.getElementById('auth-password')?.value,
                    phone: document.getElementById('auth-phone')?.value,
                    schoolCode: schoolCode,
                    subjects: subjects ? subjects.split(',').map(s => s.trim()) : [],
                    qualification: document.getElementById('auth-qualification')?.value
                };

                // ADD THIS DEBUG LINE
                console.log('📤 Teacher signup payload:', teacherData);
                
                if (!teacherData.name || !teacherData.email || !teacherData.password) {
                    showToast('Please fill all required fields', 'error');
                    hideLoading();
                    return;
                }
                
                const response = await teacherSignup(teacherData);
                showToast(response.message, 'success');
                closeAuthModal();
                
            } else if (role === 'parent') {
                const parentData = {
                    name: document.getElementById('auth-name')?.value,
                    email: document.getElementById('auth-email')?.value,
                    password: document.getElementById('auth-password')?.value,
                    phone: document.getElementById('auth-phone')?.value,
                    studentElimuid: document.getElementById('auth-student-elimuid')?.value
                };
                
                if (!parentData.name || !parentData.email || !parentData.password || !parentData.studentElimuid) {
                    showToast('Please fill all required fields', 'error');
                    hideLoading();
                    return;
                }
                
                const response = await parentSignup(parentData);
                showToast(response.message, 'success');
                closeAuthModal();
            }
        }
    } catch (error) {
        console.error('Auth error:', error);
        showToast(error.message || 'Authentication failed', 'error');
    } finally {
        hideLoading();
    }
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.add('hidden');
}

function closeNameChangeModal() {
    const modal = document.getElementById('name-change-modal');
    if (modal) modal.classList.add('hidden');
}

function showNameChangeModal() {
    const modal = document.getElementById('name-change-modal');
    if (modal) modal.classList.remove('hidden');
}

// Process name change request
async function processNameChange() {
    const newName = document.getElementById('new-school-name')?.value;
    const reason = document.getElementById('change-reason')?.value || 'School name change request';
    
    if (!newName) {
        showToast('Please enter a new school name', 'error');
        return;
    }
    
    // Debug logging
    console.log('api object:', window.api);
    console.log('school object:', window.api?.school);
    console.log('createNameChangeRequest function:', window.api?.school?.createNameChangeRequest);
    
    if (!window.api || !window.api.school) {
        showToast('API not properly initialized. Please refresh the page.', 'error');
        console.error('api.school is undefined');
        return;
    }
    
    if (!window.api.school.createNameChangeRequest) {
        showToast('Name change feature not available', 'error');
        console.error('createNameChangeRequest function not found');
        return;
    }
    
    showLoading();
    try {
        const response = await window.api.school.createNameChangeRequest({
            newName: newName,
            reason: reason
        });
        
        if (response.success) {
            showToast('✅ Name change request sent to Super Admin for approval', 'success');
            closeNameChangeModal();
            
            // Clear the form
            document.getElementById('new-school-name').value = '';
            if (document.getElementById('change-reason')) {
                document.getElementById('change-reason').value = '';
            }
        }
    } catch (error) {
        console.error('Name change error:', error);
        showToast(error.message || 'Failed to submit name change request', 'error');
    } finally {
        hideLoading();
    }
}

// ============ STUDENT AUTHENTICATION FUNCTIONS ============

function openStudentLoginModal() {
    currentRole = 'student';
    const modal = document.getElementById('auth-modal');
    const titleEl = document.getElementById('auth-modal-title');
    const contentEl = document.getElementById('auth-modal-content');
    
    if (!modal || !titleEl || !contentEl) return;
    
    titleEl.textContent = 'Student Login';
    contentEl.innerHTML = `
        <div class="space-y-4">
            <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
                <p class="text-xs text-blue-600 dark:text-blue-400 flex items-start gap-2">
                    <i data-lucide="info" class="h-4 w-4 flex-shrink-0 mt-0.5"></i>
                    <span>Welcome! Use your ELIMUID and the default password: <strong>Student123!</strong></span>
                </p>
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">ELIMUID</label>
                <input type="text" id="auth-elimuid" placeholder="e.g., ELI-2024-001" 
                       class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" required>
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Password</label>
                <input type="password" id="auth-password" placeholder="Enter your password" 
                       class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" required>
            </div>
            <div class="flex justify-end gap-2 mt-6">
                <button onclick="closeAuthModal()" class="px-4 py-2 text-sm border rounded-lg hover:bg-accent">Cancel</button>
                <button onclick="handleStudentLogin()" class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Login</button>
            </div>
            <div class="text-center mt-4 pt-4 border-t">
                <p class="text-xs text-muted-foreground">
                    First time? Use default password: <strong>Student123!</strong><br>
                    You'll be asked to change it after logging in.
                </p>
            </div>
        </div>
    `;
    modal.classList.remove('hidden');
    lucide.createIcons();
}

// Handle student login
async function handleStudentLogin() {
    const elimuid = document.getElementById('auth-elimuid')?.value;
    const password = document.getElementById('auth-password')?.value;
    
    if (!elimuid || !password) {
        showToast('ELIMUID and password required', 'error');
        return;
    }
    
    showLoading();
    try {
        const response = await api.auth.studentLogin(elimuid, password);
        
        if (response.success) {
            // Save auth data
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('student', JSON.stringify(response.data.student));
            localStorage.setItem('userRole', 'student');
            
            // Check if this is first login
            if (response.data.user.firstLogin) {
                // Close login modal and open password change modal
                closeAuthModal();
                showFirstTimePasswordModal(elimuid);
            } else {
                showToast('Login successful!', 'success');
                await showDashboard('student');
                closeAuthModal();
            }
        }
    } catch (error) {
        showToast(error.message || 'Invalid ELIMUID or password. Try the default password: Student123!', 'error');
    } finally {
        hideLoading();
    }
}

// Show first-time password change modal
function showFirstTimePasswordModal(elimuid) {
    const modal = document.getElementById('auth-modal');
    const titleEl = document.getElementById('auth-modal-title');
    const contentEl = document.getElementById('auth-modal-content');
    
    if (!modal || !titleEl || !contentEl) return;
    
    titleEl.textContent = 'Set Your Password';
    contentEl.innerHTML = `
        <div class="space-y-4">
            <div class="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <p class="text-sm text-yellow-800 dark:text-yellow-200 flex items-start gap-2">
                    <i data-lucide="alert-circle" class="h-5 w-5 flex-shrink-0"></i>
                    <span>This is your first login. Please set a new password to continue.</span>
                </p>
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">New Password</label>
                <input type="password" id="new-password" 
                       class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" 
                       placeholder="Enter new password" required>
                <p class="text-xs text-muted-foreground mt-1">Minimum 8 characters</p>
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Confirm New Password</label>
                <input type="password" id="confirm-password" 
                       class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" 
                       placeholder="Confirm new password" required>
            </div>
            <div class="flex justify-end gap-2 mt-6">
                <button onclick="closeAuthModal()" class="px-4 py-2 text-sm border rounded-lg hover:bg-accent">Cancel</button>
                <button onclick="handleFirstPasswordChange('${elimuid}')" class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                    Set Password
                </button>
            </div>
        </div>
    `;
    modal.classList.remove('hidden');
    lucide.createIcons();
}

// Handle first-time password change
async function handleFirstPasswordChange(elimuid) {
    const newPassword = document.getElementById('new-password')?.value;
    const confirmPassword = document.getElementById('confirm-password')?.value;
    
    if (!newPassword || !confirmPassword) {
        showToast('Please enter and confirm your new password', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    if (newPassword.length < 8) {
        showToast('Password must be at least 8 characters', 'error');
        return;
    }
    
    showLoading();
    try {
        // You'll need to add this endpoint to your backend
        const response = await api.student.setFirstPassword({
            elimuid: elimuid,
            newPassword: newPassword
        });
        
        if (response.success) {
            showToast('Password set successfully! Please login with your new password.', 'success');
            
            // Show login form again
            openStudentLoginModal();
        }
    } catch (error) {
        showToast(error.message || 'Failed to set password', 'error');
    } finally {
        hideLoading();
    }
}

// Show help for students
function showStudentHelp() {
    showToast('Contact your teacher to reset your password or get your ELIMUID', 'info', 5000);
}

// ============================================
// HELP SECTION - Add to main.js
// ============================================

function renderHelpSection() {
    const user = getCurrentUser();
    const role = user?.role || 'user';
    
    const helpContent = {
        superadmin: {
            title: 'Super Admin Help',
            guides: [
                { title: 'Managing Schools', content: 'View all schools, approve new registrations, suspend/reactivate schools' },
                { title: 'School Approvals', content: 'Review and approve pending school registrations' },
                { title: 'Name Change Requests', content: 'Approve or reject school name change requests' },
                { title: 'Platform Health', content: 'Monitor system status, CPU usage, and recent events' }
            ]
        },
        admin: {
            title: 'Admin Help',
            guides: [
                { title: 'Teacher Management', content: 'Approve teacher registrations, manage teacher profiles, assign classes' },
                { title: 'Student Management', content: 'Add students, view student details, suspend/reactivate students' },
                { title: 'Class Management', content: 'Create classes, assign class teachers, manage student enrollment' },
                { title: 'Duty Management', content: 'Generate duty rosters, assign duty points, view fairness reports' },
                { title: 'Curriculum Settings', content: 'Change school curriculum, add custom subjects' }
            ]
        },
        teacher: {
            title: 'Teacher Help',
            guides: [
                { title: 'Student Management', content: 'Add students to your class, view student profiles, copy ELIMUIDs' },
                { title: 'Take Attendance', content: 'Mark students present/absent, add notes for absences' },
                { title: 'Enter Grades', content: 'Record test scores, view grade calculations based on curriculum' },
                { title: 'Duty Management', content: 'View your duty schedule, check in/out, request duty swaps' },
                { title: 'Parent Communication', content: 'Reply to parent messages, share student progress' }
            ]
        },
        parent: {
            title: 'Parent Help',
            guides: [
                { title: 'View Child Progress', content: 'Check grades, attendance, and teacher comments' },
                { title: 'Report Absence', content: 'Notify school when your child is absent' },
                { title: 'Make Payments', content: 'Pay school fees, upgrade subscription plans' },
                { title: 'Message Teachers', content: 'Communicate with class teachers and school admin' }
            ]
        },
        student: {
            title: 'Student Help',
            guides: [
                { title: 'View Grades', content: 'Check your academic performance and progress' },
                { title: 'Attendance History', content: 'View your attendance records' },
                { title: 'Study Groups', content: 'Chat with fellow students for group study' },
                { title: 'AI Tutor', content: 'Get help with any subject from our AI tutor' }
            ]
        }
    };
    
    const content = helpContent[role] || helpContent.student;
    
    return `
        <div class="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <div class="text-center">
                <h2 class="text-3xl font-bold">${content.title}</h2>
                <p class="text-muted-foreground mt-2">Find answers to common questions and learn how to use the platform</p>
            </div>
            
            <div class="grid gap-4">
                ${content.guides.map(guide => `
                    <div class="rounded-xl border bg-card p-6 hover:shadow-md transition-shadow">
                        <h3 class="font-semibold text-lg mb-2">📚 ${guide.title}</h3>
                        <p class="text-muted-foreground">${guide.content}</p>
                    </div>
                `).join('')}
            </div>
            
            <div class="rounded-xl border bg-card p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
                <h3 class="font-semibold text-lg mb-2">💬 Need More Help?</h3>
                <p class="text-muted-foreground mb-4">Contact support or check our documentation for more detailed guides.</p>
                <div class="flex gap-3">
                    <button onclick="showToast('Support request sent', 'info')" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                        Contact Support
                    </button>
                    <button onclick="window.open('https://shuleai.com/docs', '_blank')" class="px-4 py-2 border rounded-lg hover:bg-accent">
                        View Documentation
                    </button>
                </div>
            </div>
            
            <div class="rounded-xl border bg-card p-6">
                <h3 class="font-semibold text-lg mb-4">❓ Frequently Asked Questions</h3>
                <div class="space-y-3">
                    <div class="p-3 bg-muted/30 rounded-lg">
                        <p class="font-medium">How do I reset my password?</p>
                        <p class="text-sm text-muted-foreground mt-1">Go to Settings → Change Password. Enter your current password and new password.</p>
                    </div>
                    <div class="p-3 bg-muted/30 rounded-lg">
                        <p class="font-medium">Why can't I see some students?</p>
                        <p class="text-sm text-muted-foreground mt-1">Make sure you're assigned to the correct class. Contact admin if you should have access to more students.</p>
                    </div>
                    <div class="p-3 bg-muted/30 rounded-lg">
                        <p class="font-medium">How do I report a technical issue?</p>
                        <p class="text-sm text-muted-foreground mt-1">Use the Contact Support button above or email support@shuleai.com</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Add help section to renderDashboardSection
async function renderDashboardSection(role, section) {
    if (section === 'help') {
        return renderHelpSection();
    }
    
    // ... rest of existing renderDashboardSection code
}

// ============ DASHBOARD FUNCTIONS ============
async function showDashboard(role) {
    console.log('🔵 showDashboard called with role:', role);
    
    // If role is not provided, try to get from localStorage or currentUser
    if (!role) {
        console.log('No role provided, attempting to recover...');
        
        // Try to get from the helper function we added
        if (typeof getCurrentRole === 'function') {
            role = getCurrentRole();
            console.log('Role from getCurrentRole():', role);
        }
        
        // Fallback: try to get from localStorage directly
        if (!role) {
            role = localStorage.getItem('userRole');
            console.log('Role from localStorage:', role);
        }
        
        // Last resort: try to parse from user object
        if (!role) {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            role = user.role;
            console.log('Role from user object:', role);
        }
        
        // If still no role, try to get from API as last resort
        if (!role) {
            console.log('Attempting to fetch user from API...');
            try {
                const response = await api.auth.getMe();
                if (response && response.data && response.data.user) {
                    role = response.data.user.role;
                    // Save it for next time
                    localStorage.setItem('userRole', role);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    console.log('Role from API:', role);
                }
            } catch (error) {
                console.error('Failed to fetch user from API:', error);
            }
        }
        
        // If still no role, redirect to login
        if (!role) {
            console.error('❌ No role found after all attempts, redirecting to login');
            showToast('Session expired. Please log in again.', 'error');
            setTimeout(() => {
                window.location.href = '/'; // Or your landing page
            }, 2000);
            return;
        }
    }
    
    // Save the role to ensure it's in localStorage
    localStorage.setItem('userRole', role);
    currentRole = role;
    console.log('✅ Final role set to:', role);
    
    const landingPage = document.getElementById('landing-page');
    const dashboardContainer = document.getElementById('dashboard-container');
    
    if (landingPage) landingPage.style.display = 'none';
    if (dashboardContainer) {
        dashboardContainer.style.display = 'block';
        dashboardContainer.setAttribute('data-current-role', role);
    }

    // Clear cached school data (optional - be careful with this)
    // localStorage.removeItem('school');
    // localStorage.removeItem('schoolSettings');
    
    await loadSchoolSettings();
    
    showLoading();
    try {
        if (role === 'superadmin') {
            console.log('Loading superadmin dashboard...');
            // Use existing super admin endpoints
            const [overview, schools, pending] = await Promise.all([
                api.superAdmin.getOverview().catch(err => {
                    console.error('Overview error:', err);
                    return { data: {} };
                }),
                api.superAdmin.getSchools().catch(err => {
                    console.error('Schools error:', err);
                    return { data: [] };
                }),
                api.superAdmin.getPendingSchools().catch(err => {
                    console.error('Pending schools error:', err);
                    return { data: [] };
                })
            ]);
            
            dashboardData = {
                ...overview.data,
                schools: schools.data,
                pendingSchools: pending.data
            };
            
        } else if (role === 'admin') {
            console.log('Loading admin dashboard...');
            // Use existing admin endpoints
            const [teachers, students, pendingTeachers] = await Promise.all([
                api.admin.getTeachers().catch(err => {
                    console.error('Teachers error:', err);
                    return { data: [] };
                }),
                api.admin.getStudents().catch(err => {
                    console.error('Students error:', err);
                    return { data: [] };
                }),
                api.admin.getPendingApprovals().catch(err => {
                    console.error('Pending approvals error:', err);
                    return { data: { teachers: [] } };
                })
            ]);
            
            dashboardData = {
                teachers: teachers.data,
                students: students.data,
                pendingTeachers: pendingTeachers.data?.teachers || []
            };
            
        } else if (role === 'teacher') {
            console.log('Loading teacher dashboard...');
            // Use existing teacher endpoints
            const [students, todayDuty] = await Promise.all([
                api.teacher.getMyStudents().catch(err => {
                    console.error('Students error:', err);
                    return { data: [] };
                }),
                api.duty.getTodayDuty().catch(err => {
                    console.error('Today duty error:', err);
                    return { data: {} };
                })
            ]);
            
            dashboardData = {
                students: students.data,
                todayDuty: todayDuty.data
            };
            
        } else if (role === 'parent') {
            console.log('Loading parent dashboard...');
            // Get children first, then get first child's summary
            const children = await api.parent.getChildren().catch(err => {
                console.error('Children error:', err);
                return { data: [] };
            });
            let childSummary = null;
            
            if (children.data && children.data.length > 0) {
                childSummary = await api.parent.getChildSummary(children.data[0].id).catch(err => {
                    console.error('Child summary error:', err);
                    return { data: {} };
                });
            }
            
            dashboardData = {
                children: children.data,
                selectedChild: childSummary?.data
            };
            
        } else if (role === 'student') {
            console.log('Loading student dashboard...');
            // Use existing student endpoints
            const [grades, attendance] = await Promise.all([
                api.student.getGrades().catch(err => {
                    console.error('Grades error:', err);
                    return { data: [] };
                }),
                api.student.getAttendance().catch(err => {
                    console.error('Attendance error:', err);
                    return { data: [] };
                })
            ]);
            
            dashboardData = {
                grades: grades.data,
                attendance: attendance.data
            };
        } else {
            console.error('Unknown role:', role);
            showToast('Invalid user role', 'error');
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
            return;
        }
        
        updateSidebar(role);
        updateUserInfo();
        await showDashboardSection('dashboard');
        
        if (typeof connectWebSocket === 'function') {
            setTimeout(connectWebSocket, 500);
        }
    } catch (error) {
        console.error('❌ Error loading dashboard:', error);
        showToast('Failed to load dashboard data. Please check your connection.', 'error');
    } finally {
        hideLoading();
    }
}

async function loadSchoolSettings() {
    try {
        const school = getCurrentSchool();
        if (school) {
            schoolSettings = school.settings || {};
            customSubjects = schoolSettings.customSubjects || [];
            localStorage.setItem('schoolSettings', JSON.stringify(schoolSettings));
        }
    } catch (error) {
        console.log('Using default school settings');
    }
}

async function saveSchoolSettings(settings) {
    try {
        const response = await api.admin.updateSchoolSettings(settings);
        if (response.success) {
            schoolSettings = response.data;
            customSubjects = response.data.customSubjects || [];
            localStorage.setItem('schoolSettings', JSON.stringify(response.data));
            showToast('Settings saved successfully!', 'success');
            await showDashboardSection(currentSection);
        }
    } catch (error) {
        showToast('Failed to save settings', 'error');
    }
}

async function showDashboardSection(section) {
    currentSection = section;
    const content = document.getElementById('dashboard-content');
    const pageTitle = document.getElementById('page-title');
    
    if (!content) return;
    
    showLoading();
    
    try {
        const sectionNames = {
            dashboard: 'Dashboard',
            students: 'Students',
            teachers: 'Teachers',
            classes: 'Classes',
            attendance: 'Attendance',
            grades: 'Grades',
            analytics: 'Analytics',
            duty: 'Duty Management',
            calendar: 'School Calendar',
            tasks: 'My Tasks',
            timetable: 'My Timetable',
            profile: 'Profile',
            settings: 'School Settings',
            'platform-settings': 'Platform Settings',
            'user-settings': 'My Settings',
            help: 'Help',
            chat: 'Study Group Chat',
            'ai-tutor': 'AI Tutor',
            payments: 'Payments',
            progress: 'Academic Progress',
            'child-selector': 'Select Child',
            schools: 'School Management',
            'platform-health': 'Platform Health',
            'name-change-requests': 'Name Change Requests',
            'school-approvals': 'School Approvals',
            'pending-approvals': 'Pending School Approvals',
            'teacher-approvals': 'Pending Teacher Approvals',
            'paid-schools': 'Paid Schools',
            'custom-subjects': 'Custom Subjects',
            'duty-preferences': 'Duty Preferences',
            'fairness-report': 'Fairness Report',
            'teacher-workload': 'Teacher Workload'
        };
        pageTitle.textContent = sectionNames[section] || 'Dashboard';
        
        content.innerHTML = await renderDashboardSection(currentRole, section);
        
        updateSidebarActiveState(section);
        
        if (section === 'dashboard' || section === 'analytics') {
            setTimeout(() => {
                if (currentRole === 'admin') {
                    initAdminCharts();
                }

                if (typeof initRoleCharts === 'function') {
                    initRoleCharts(currentRole, dashboardData);
                }
             }, 300);
        }
        
        setupSectionListeners(currentRole, section);
        
        lucide.createIcons();
    } catch (error) {
        console.error('Error loading section:', error);
        content.innerHTML = `<div class="text-center py-12">
            <i data-lucide="alert-circle" class="h-12 w-12 mx-auto text-red-500 mb-4"></i>
            <p class="text-red-500">Failed to load section: ${error.message}</p>
        </div>`;
        lucide.createIcons();
    } finally {
        hideLoading();
    }
}

async function renderDashboardSection(role, section) {
    switch(role) {
        case 'superadmin':
            return await renderSuperAdminSection(section);
        case 'admin':
            return await renderAdminSection(section);
        case 'teacher':
            return await renderTeacherSection(section);
        case 'parent':
            return await renderParentSection(section);
        case 'student':
            return await renderStudentSection(section);
        default:
            return '<div class="text-center py-12">Invalid role</div>';
    }
}

// ============ SUPER ADMIN SECTIONS ============

async function renderSuperAdminSection(section) {
    switch(section) {
        case 'dashboard':
            return renderSuperAdminDashboard();
        case 'schools':
            return await renderSuperAdminSchools();
        case 'school-approvals':
            return await renderSuperAdminPendingSchools();
        case 'pending-approvals':
            return await renderSuperAdminPendingSchools();
        case 'name-change-requests':
            return await renderSuperAdminNameChangeRequests();
        case 'platform-health':
            return renderSuperAdminHealth();
        case 'settings':
            return renderSuperAdminSettings();
        default:
            return renderSuperAdminDashboard();
    }
}

function renderSuperAdminDashboard() {
    const data = dashboardData || {};
    return `
        <div class="space-y-6 animate-fade-in">
            <!-- Stats Grid with proper IDs -->
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div class="rounded-xl border bg-card p-6 card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Total Schools</p>
                            <h3 class="text-2xl font-bold mt-1" id="total-schools">${data.schools?.length || 0}</h3>
                            <p class="text-xs text-green-600 mt-1 flex items-center gap-1">
                                <i data-lucide="trending-up" class="h-3 w-3"></i>
                                <span id="new-schools">${data.pendingSchools?.length || 0}</span> pending approval
                            </p>
                        </div>
                        <div class="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                            <i data-lucide="building-2" class="h-6 w-6 text-blue-600"></i>
                        </div>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6 card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Active Schools</p>
                            <h3 class="text-2xl font-bold mt-1" id="active-admins">${data.schools?.filter(s => s.status === 'active').length || 0}</h3>
                            <p class="text-xs text-green-600 mt-1 flex items-center gap-1">
                                <i data-lucide="trending-up" class="h-3 w-3"></i>
                                <span id="new-admins">${data.schools?.filter(s => s.status !== 'active').length || 0}</span> inactive
                            </p>
                        </div>
                        <div class="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <i data-lucide="check-circle" class="h-6 w-6 text-emerald-600"></i>
                        </div>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6 card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Pending Approvals</p>
                            <h3 class="text-2xl font-bold mt-1" id="pending-approvals">${data.pendingSchools?.length || 0}</h3>
                            <p class="text-xs text-yellow-600 mt-1 flex items-center gap-1">
                                <i data-lucide="clock" class="h-3 w-3"></i>
                                Awaiting review
                            </p>
                        </div>
                        <div class="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center">
                            <i data-lucide="alert-circle" class="h-6 w-6 text-amber-600"></i>
                        </div>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6 card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Revenue (MTD)</p>
                            <h3 class="text-2xl font-bold mt-1" id="revenue">$0</h3>
                            <p class="text-xs text-green-600 mt-1 flex items-center gap-1">
                                <i data-lucide="trending-up" class="h-3 w-3"></i>
                                +<span id="revenue-growth">0</span>% from last month
                            </p>
                        </div>
                        <div class="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <i data-lucide="dollar-sign" class="h-6 w-6 text-emerald-600"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Charts Row with proper IDs -->
            <div class="grid gap-4 lg:grid-cols-2">
                <div class="rounded-xl border bg-card p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-semibold">School Growth Trends</h3>
                        <select class="text-sm border rounded-md px-2 py-1 bg-background" onchange="updateSuperAdminChart(this.value)">
                            <option value="year">This Year</option>
                            <option value="last-year">Last Year</option>
                        </select>
                    </div>
                    <div class="chart-container h-64">
                        <canvas id="superadmin-enrollmentChart"></canvas>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-semibold">School Distribution</h3>
                        <select class="text-sm border rounded-md px-2 py-1 bg-background" onchange="updateSuperAdminPieChart(this.value)">
                            <option value="level">By Level</option>
                            <option value="region">By Region</option>
                        </select>
                    </div>
                    <div class="chart-container h-64">
                        <canvas id="superadmin-gradeChart"></canvas>
                    </div>
                </div>
            </div>
            
            <!-- Schools Table with proper ID -->
            <div class="rounded-xl border bg-card overflow-hidden">
                <div class="p-4 border-b flex justify-between items-center">
                    <h3 class="font-semibold">School/Admin Management</h3>
                    <span class="text-sm text-muted-foreground" id="school-count">${data.schools?.length || 0} total</span>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-muted/50">
                            <tr>
                                <th class="px-4 py-3 text-left font-medium">School</th>
                                <th class="px-4 py-3 text-left font-medium">Admin</th>
                                <th class="px-4 py-3 text-left font-medium">Level</th>
                                <th class="px-4 py-3 text-left font-medium">Status</th>
                                <th class="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y" id="schools-table-body">
                            ${(data.schools || []).map(school => `
                                <tr class="hover:bg-accent/50 transition-colors">
                                    <td class="px-4 py-3 font-medium">${school.name}</td>
                                    <td class="px-4 py-3">${school.adminEmail || 'N/A'}</td>
                                    <td class="px-4 py-3">${school.settings?.schoolLevel || 'N/A'}</td>
                                    <td class="px-4 py-3">
                                        <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium 
                                            ${school.status === 'active' ? 'bg-green-100 text-green-700' : 
                                              school.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                                              'bg-gray-100 text-gray-700'}">
                                            ${school.status}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 text-right">
                                        <button onclick="viewSchoolDetails('${school.id}')" class="p-2 hover:bg-accent rounded-lg">
                                            <i data-lucide="eye" class="h-4 w-4"></i>
                                        </button>
                                        <button onclick="editSchool('${school.id}')" class="p-2 hover:bg-accent rounded-lg">
                                            <i data-lucide="edit" class="h-4 w-4"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                            ${(!data.schools || data.schools.length === 0) ? `
                                <tr>
                                    <td colspan="5" class="px-4 py-8 text-center text-muted-foreground">
                                        No schools found
                                    </td>
                                </tr>
                            ` : ''}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Quick Action Buttons -->
            <div class="grid gap-4 md:grid-cols-3">
                <button onclick="showDashboardSection('school-approvals')" class="p-6 border rounded-lg hover:bg-accent transition-colors text-left">
                    <i data-lucide="check-circle" class="h-8 w-8 text-green-600 mb-3"></i>
                    <h4 class="font-semibold">School Approvals</h4>
                    <p class="text-sm text-muted-foreground">Approve new school registrations</p>
                    ${data.pendingSchools?.length ? `<span class="mt-2 inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">${data.pendingSchools.length} pending</span>` : ''}
                </button>
                
                <button onclick="showDashboardSection('schools')" class="p-6 border rounded-lg hover:bg-accent transition-colors text-left">
                    <i data-lucide="building-2" class="h-8 w-8 text-blue-600 mb-3"></i>
                    <h4 class="font-semibold">Manage Schools</h4>
                    <p class="text-sm text-muted-foreground">View and edit all schools</p>
                </button>
                
                <button onclick="showDashboardSection('name-change-requests')" class="p-6 border rounded-lg hover:bg-accent transition-colors text-left">
                    <i data-lucide="file-edit" class="h-8 w-8 text-purple-600 mb-3"></i>
                    <h4 class="font-semibold">Name Change Requests</h4>
                    <p class="text-sm text-muted-foreground">Review school name changes</p>
                </button>
            </div>
            
            <!-- Name Change Requests with proper ID -->
            <div class="rounded-xl border bg-card" id="name-change-requests">
                <div class="p-4 border-b">
                    <h3 class="font-semibold">Name Change Requests</h3>
                </div>
                <div class="divide-y" id="name-change-requests-list">
                    ${(data.nameChangeRequests || []).map(request => `
                        <div class="p-4 flex items-center justify-between hover:bg-accent/50 transition-colors">
                            <div>
                                <p class="text-sm font-medium">${request.oldName} → ${request.newName}</p>
                                <p class="text-xs text-muted-foreground">${timeAgo(request.createdAt)}</p>
                            </div>
                            <div class="flex gap-2">
                                <button onclick="approveNameChange('${request.id}')" class="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full hover:bg-green-200">Approve</button>
                                <button onclick="rejectNameChange('${request.id}')" class="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full hover:bg-red-200">Reject</button>
                            </div>
                        </div>
                    `).join('')}
                    ${(!data.nameChangeRequests || data.nameChangeRequests.length === 0) ? `
                        <div class="p-4 text-center text-muted-foreground">
                            No pending name change requests
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

// ============================================
// MISSING LOAD FUNCTIONS - Add to main.js
// ============================================

// Load pending schools (for super admin)
async function loadPendingSchools() {
    try {
        const response = await api.superAdmin.getPendingSchools();
        return response.data || [];
    } catch (error) {
        console.error('Failed to load pending schools:', error);
        return [];
    }
}

// Load all schools (for super admin)
async function loadAllSchools() {
    try {
        const response = await api.superAdmin.getSchools();
        return response.data || [];
    } catch (error) {
        console.error('Failed to load schools:', error);
        return [];
    }
}

// Add this near the other load functions
async function loadStudentAnalytics() {
    try {
        const user = getCurrentUser();
        if (user?.role === 'student') {
            // You might want to add analytics endpoint here
            console.log('Loading student analytics...');
        }
    } catch (error) {
        console.error('Error loading student analytics:', error);
    }
}

// Load name change requests
async function loadNameChangeRequests() {
    try {
        const response = await api.superAdmin.getPendingRequests();
        return response.data || [];
    } catch (error) {
        console.error('Failed to load name change requests:', error);
        return [];
    }
}

// Load fairness report
async function loadFairnessReport() {
    try {
        const response = await api.admin.getFairnessReport();
        return response.data || {};
    } catch (error) {
        console.error('Failed to load fairness report:', error);
        return {};
    }
}

// Load teacher workload
async function loadTeacherWorkload() {
    try {
        const response = await api.admin.getTeacherWorkload();
        return response.data || [];
    } catch (error) {
        console.error('Failed to load teacher workload:', error);
        return [];
    }
}

// Load today's duty
async function loadTodayDuty() {
    try {
        const response = await api.duty.getTodayDuty();
        return response.data || {};
    } catch (error) {
        console.error('Failed to load today duty:', error);
        return {};
    }
}

// Load weekly duty
async function loadWeeklyDuty() {
    try {
        const response = await api.duty.getWeeklyDuty();
        return response.data || [];
    } catch (error) {
        console.error('Failed to load weekly duty:', error);
        return [];
    }
}

// Load understaffed areas
async function loadUnderstaffedAreas() {
    try {
        const response = await api.admin.getUnderstaffedAreas();
        return response.data || [];
    } catch (error) {
        console.error('Failed to load understaffed areas:', error);
        return [];
    }
}

// Load pending teachers
async function loadPendingTeachers() {
    try {
        const response = await api.admin.getPendingApprovals();
        return response.data?.teachers || [];
    } catch (error) {
        console.error('Failed to load pending teachers:', error);
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

// Load my students (teacher)
async function loadMyStudents() {
    try {
        const response = await api.teacher.getMyStudents();
        return response.data || [];
    } catch (error) {
        console.error('Failed to load my students:', error);
        return [];
    }
}

// ============================================
// MISSING RENDER FUNCTIONS - Add to main.js
// ============================================

// Render pending schools table
function renderPendingSchoolsTable(schools) {
    if (!schools || schools.length === 0) {
        return '<div class="text-center py-8 text-muted-foreground">No pending schools</div>';
    }
    
    return `
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-muted/50">
                    <tr>
                        <th class="px-4 py-3 text-left font-medium">School</th>
                        <th class="px-4 py-3 text-left font-medium">Admin Email</th>
                        <th class="px-4 py-3 text-left font-medium">Short Code</th>
                        <th class="px-4 py-3 text-left font-medium">Level</th>
                        <th class="px-4 py-3 text-left font-medium">Applied</th>
                        <th class="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    ${schools.map(school => {
                        const admin = school.admins && school.admins.length > 0 ? school.admins[0] : null;
                        return `
                            <tr class="hover:bg-accent/50 transition-colors">
                                <td class="px-4 py-3 font-medium">${school.name || 'N/A'}</td>
                                <td class="px-4 py-3">${admin ? admin.email : 'No admin'}</td>
                                <td class="px-4 py-3"><span class="font-mono text-xs bg-muted px-2 py-1 rounded">${school.shortCode || 'N/A'}</span></td>
                                <td class="px-4 py-3">${school.settings?.schoolLevel || 'N/A'}</td>
                                <td class="px-4 py-3">${timeAgo(school.createdAt)}</td>
                                <td class="px-4 py-3 text-right">
                                    <button onclick="approveSchool('${school.id}')" class="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full hover:bg-green-200 mr-2">Approve</button>
                                    <button onclick="rejectSchool('${school.id}')" class="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full hover:bg-red-200">Reject</button>
                                    <button onclick="viewSchoolDetails('${school.id}')" class="p-2 hover:bg-accent rounded-lg"><i data-lucide="eye" class="h-4 w-4"></i></button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Render schools table
function renderSchoolsTable(schools) {
    if (!schools || schools.length === 0) {
        return '<div class="text-center py-8 text-muted-foreground">No schools found</div>';
    }
    
    return `
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-muted/50">
                    <tr>
                        <th class="px-4 py-3 text-left font-medium">School</th>
                        <th class="px-4 py-3 text-left font-medium">Short Code</th>
                        <th class="px-4 py-3 text-left font-medium">Status</th>
                        <th class="px-4 py-3 text-left font-medium">Level</th>
                        <th class="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    ${schools.map(school => `
                        <tr class="hover:bg-accent/50 transition-colors">
                            <td class="px-4 py-3 font-medium">${school.name || 'Unknown'}</td>
                            <td class="px-4 py-3"><span class="font-mono text-xs bg-muted px-2 py-1 rounded">${school.shortCode || 'N/A'}</span></td>
                            <td class="px-4 py-3">
                                <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium 
                                    ${school.status === 'active' ? 'bg-green-100 text-green-700' : 
                                      school.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                                      'bg-gray-100 text-gray-700'}">
                                    ${school.status}
                                </span>
                            </td>
                            <td class="px-4 py-3">${school.settings?.schoolLevel || 'N/A'}</td>
                            <td class="px-4 py-3 text-right">
                                <button onclick="viewSchoolDetails('${school.id}')" class="p-2 hover:bg-accent rounded-lg"><i data-lucide="eye" class="h-4 w-4"></i></button>
                                <button onclick="editSchool('${school.id}')" class="p-2 hover:bg-accent rounded-lg"><i data-lucide="edit" class="h-4 w-4"></i></button>
                            </td>
                        </tr>
                    `).join('')}
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
                        <th class="px-4 py-3 text-left font-medium">Email</th>
                        <th class="px-4 py-3 text-left font-medium">Subjects</th>
                        <th class="px-4 py-3 text-left font-medium">Status</th>
                        <th class="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    ${teachers.map(teacher => {
                        const user = teacher.User || {};
                        const isActive = teacher.isActive !== false;
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
                                <td class="px-4 py-3">${user.email || 'N/A'}</td>
                                <td class="px-4 py-3">${(teacher.subjects || []).join(', ')}</td>
                                <td class="px-4 py-3">
                                    <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium 
                                        ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                                        ${isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-right">
                                    <button onclick="viewTeacherDetails('${teacher.id}')" class="p-2 hover:bg-accent rounded-lg"><i data-lucide="eye" class="h-4 w-4"></i></button>
                                    ${isActive ? 
                                        `<button onclick="deactivateTeacher('${teacher.id}', '${user.name}')" class="p-2 hover:bg-yellow-100 rounded-lg text-yellow-600"><i data-lucide="pause-circle" class="h-4 w-4"></i></button>` : 
                                        `<button onclick="activateTeacher('${teacher.id}', '${user.name}')" class="p-2 hover:bg-green-100 rounded-lg text-green-600"><i data-lucide="play-circle" class="h-4 w-4"></i></button>`
                                    }
                                    <button onclick="removeTeacher('${teacher.id}')" class="p-2 hover:bg-red-100 rounded-lg text-red-600"><i data-lucide="trash-2" class="h-4 w-4"></i></button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

async function renderSuperAdminPendingSchools() {
    try {
        const schools = await loadPendingSchools();
        return `
            <div class="space-y-6 animate-fade-in">
                <h2 class="text-2xl font-bold">Pending School Approvals</h2>
                <div id="pending-schools-container" class="rounded-xl border bg-card overflow-hidden">
                    ${typeof renderPendingSchoolsTable === 'function' ? renderPendingSchoolsTable(schools) : '<div class="p-8 text-center">Loading...</div>'}
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error rendering pending schools:', error);
        return `<div class="text-center py-12 text-red-500">Error loading schools: ${error.message}</div>`;
    }
}

async function renderSuperAdminSchools() {
    try {
        const schools = await loadAllSchools();
        return `
            <div class="space-y-6 animate-fade-in">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold">School Management</h2>
                    <button onclick="showCreateSchoolModal()" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
                        <i data-lucide="plus" class="h-4 w-4"></i>
                        Add New School
                    </button>
                </div>
                
                <div id="schools-table-container" class="rounded-xl border bg-card overflow-hidden">
                    ${renderSchoolsTable(schools)}
                </div>
            </div>
        `;
    } catch (error) {
        return `<div class="text-center py-12 text-red-500">Error loading schools: ${error.message}</div>`;
    }
}

async function renderSuperAdminNameChangeRequests() {
    try {
        const requests = await loadNameChangeRequests();
        return `
            <div class="space-y-6 animate-fade-in">
                <h2 class="text-2xl font-bold">Name Change Requests</h2>
                <div class="rounded-xl border bg-card overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead class="bg-muted/50">
                                <tr>
                                    <th class="px-4 py-3 text-left font-medium">School</th>
                                    <th class="px-4 py-3 text-left font-medium">Current Name</th>
                                    <th class="px-4 py-3 text-left font-medium">New Name</th>
                                    <th class="px-4 py-3 text-left font-medium">Requested By</th>
                                    <th class="px-4 py-3 text-left font-medium">Date</th>
                                    <th class="px-4 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                ${requests.map(request => `
                                    <tr class="hover:bg-accent/50 transition-colors">
                                        <td class="px-4 py-3 font-medium">${request.school?.name || 'N/A'}</td>
                                        <td class="px-4 py-3">${request.currentName}</td>
                                        <td class="px-4 py-3 font-semibold text-primary">${request.newName}</td>
                                        <td class="px-4 py-3">${request.User?.name || 'N/A'}</td>
                                        <td class="px-4 py-3">${timeAgo(request.createdAt)}</td>
                                        <td class="px-4 py-3 text-right">
                                            <button onclick="approveNameChange('${request.id}')" class="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full hover:bg-green-200 mr-2">
                                                Approve
                                            </button>
                                            <button onclick="rejectNameChange('${request.id}')" class="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full hover:bg-red-200">
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                                ${requests.length === 0 ? '<tr><td colspan="6" class="px-4 py-8 text-center text-muted-foreground">No pending requests</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        return `<div class="text-center py-12 text-red-500">Error loading requests: ${error.message}</div>`;
    }
}

function renderSuperAdminHealth() {
    return `
        <div class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-bold">Platform Health</h2>
            
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">System Status</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <span>Database</span>
                            <span class="text-green-600 flex items-center gap-1"><i data-lucide="check-circle" class="h-4 w-4"></i> Operational</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span>API Server</span>
                            <span class="text-green-600 flex items-center gap-1"><i data-lucide="check-circle" class="h-4 w-4"></i> Operational</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span>Storage</span>
                            <span class="text-yellow-600 flex items-center gap-1"><i data-lucide="alert-circle" class="h-4 w-4"></i> 75% Used</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span>WebSocket</span>
                            <span class="text-green-600 flex items-center gap-1"><i data-lucide="check-circle" class="h-4 w-4"></i> Connected</span>
                        </div>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">System Metrics</h3>
                    <div class="space-y-3">
                        <div>
                            <div class="flex justify-between text-sm mb-1">
                                <span>CPU Usage</span>
                                <span>32%</span>
                            </div>
                            <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <div class="h-full w-[32%] bg-blue-500 rounded-full"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between text-sm mb-1">
                                <span>Memory Usage</span>
                                <span>48%</span>
                            </div>
                            <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <div class="h-full w-[48%] bg-blue-500 rounded-full"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between text-sm mb-1">
                                <span>Disk Usage</span>
                                <span>63%</span>
                            </div>
                            <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <div class="h-full w-[63%] bg-blue-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Recent Events</h3>
                    <div class="space-y-2">
                        <div class="p-2 bg-muted/30 rounded text-sm">System backup completed</div>
                        <div class="p-2 bg-muted/30 rounded text-sm">New school registered</div>
                        <div class="p-2 bg-muted/30 rounded text-sm">Database optimization</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderSuperAdminSettings() {
    return `
        <div class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-bold">Platform Settings</h2>
            
            <div class="grid gap-6">
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Global Platform Settings</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Platform Name</label>
                            <input type="text" value="ShuleAI" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Default Curriculum for New Schools</label>
                            <select class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                                <option value="cbc">CBC (Competency Based Curriculum)</option>
                                <option value="844">8-4-4 System</option>
                                <option value="british">British Curriculum</option>
                                <option value="american">American Curriculum</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Name Change Fee ($)</label>
                            <input type="number" value="50" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Maintenance</h3>
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="font-medium">Maintenance Mode</p>
                            <p class="text-sm text-muted-foreground">When enabled, only super admins can access the platform</p>
                        </div>
                        <button onclick="toggleSwitch(this)" class="relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors" data-checked="false">
                            <span class="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition-transform"></span>
                        </button>
                    </div>
                </div>
                
                <div class="flex justify-end">
                    <button onclick="showToast('Platform settings saved', 'success')" class="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
                        <i data-lucide="save" class="h-4 w-4"></i>
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Add this to main.js

// Update admin stats
async function updateAdminStats() {
    try {
        const [students, teachers, pending] = await Promise.all([
            api.admin.getStudents().catch(() => ({ data: [] })),
            api.admin.getTeachers().catch(() => ({ data: [] })),
            api.admin.getPendingApprovals().catch(() => ({ data: { teachers: [] } }))
        ]);
        
        // Update stat elements if they exist
        const studentEl = document.getElementById('total-students');
        if (studentEl) studentEl.textContent = students.data?.length || 0;
        
        const teacherEl = document.getElementById('total-teachers');
        if (teacherEl) teacherEl.textContent = teachers.data?.length || 0;
        
        const pendingEl = document.getElementById('pending-teachers');
        if (pendingEl) pendingEl.textContent = pending.data?.teachers?.length || 0;
        
        const pendingBadge = document.getElementById('pending-count');
        if (pendingBadge) pendingBadge.textContent = pending.data?.teachers?.length || 0;
        
        const pendingBadge2 = document.getElementById('pending-count-badge');
        if (pendingBadge2) pendingBadge2.textContent = (pending.data?.teachers?.length || 0) + ' pending';
        
        // Load classes count
        const classes = await api.admin.getClasses().catch(() => ({ data: [] }));
        const classesEl = document.getElementById('total-classes');
        if (classesEl) classesEl.textContent = classes.data?.length || 0;
        
    } catch (error) {
        console.error('Error updating admin stats:', error);
    }
}

// ============================================
// MISSING FUNCTION FIXES - Add to main.js
// ============================================

// Render Admin Dashboard
function renderAdminDashboard() {
    const school = getCurrentSchool();
    const data = dashboardData || {};
    
    return `
        <div class="space-y-6 animate-fade-in">
            <!-- School Profile Card -->
            <div class="rounded-xl border bg-card p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 card-hover">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div class="flex items-center gap-3 mb-2">
                            <h2 class="text-2xl font-bold" id="school-name">${school?.name || 'Your School'}</h2>
                            <span class="px-3 py-1 ${school?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} text-xs rounded-full">
                                ${school?.status || 'pending'}
                            </span>
                        </div>
                        <div class="flex items-center gap-4">
                            <p class="text-sm"><span class="font-mono bg-muted px-2 py-1 rounded">School ID: ${school?.schoolId || 'N/A'}</span></p>
                            <button onclick="showNameChangeModal()" class="text-sm text-primary hover:underline">Change School Name</button>
                        </div>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                        <p class="text-xs text-muted-foreground">Share this code with teachers</p>
                        <p class="text-lg font-mono font-bold">${school?.shortCode || 'SHL-XXXXX'}</p>
                    </div>
                </div>
            </div>
            
            <!-- Stats Grid -->
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div class="rounded-xl border bg-card p-6 card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Total Students</p>
                            <h3 class="text-2xl font-bold mt-1" id="total-students">${data.students?.length || 0}</h3>
                        </div>
                        <div class="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                            <i data-lucide="users" class="h-6 w-6 text-blue-600"></i>
                        </div>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6 card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Teachers</p>
                            <h3 class="text-2xl font-bold mt-1" id="total-teachers">${data.teachers?.length || 0}</h3>
                            <p class="text-xs text-green-600 mt-1 flex items-center gap-1">
                                <i data-lucide="trending-up" class="h-3 w-3"></i>
                                <span id="pending-teachers">${data.pendingTeachers?.length || 0}</span> pending approval
                            </p>
                        </div>
                        <div class="h-12 w-12 rounded-lg bg-violet-100 flex items-center justify-center">
                            <i data-lucide="user-plus" class="h-6 w-6 text-violet-600"></i>
                        </div>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6 card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Classes</p>
                            <h3 class="text-2xl font-bold mt-1" id="total-classes">${data.classes?.length || 0}</h3>
                        </div>
                        <div class="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <i data-lucide="book-open" class="h-6 w-6 text-emerald-600"></i>
                        </div>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6 card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                            <h3 class="text-2xl font-bold mt-1" id="attendance-rate">94%</h3>
                        </div>
                        <div class="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center">
                            <i data-lucide="calendar-check" class="h-6 w-6 text-amber-600"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="grid gap-4 md:grid-cols-3">
                <button onclick="showDashboardSection('teacher-approvals')" class="p-6 border rounded-lg hover:bg-accent transition-colors text-left">
                    <i data-lucide="user-plus" class="h-8 w-8 text-blue-600 mb-3"></i>
                    <h4 class="font-semibold">Teacher Approvals</h4>
                    <p class="text-sm text-muted-foreground">Approve pending teachers</p>
                    <span class="mt-2 inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700" id="pending-count-badge">${data.pendingTeachers?.length || 0} pending</span>
                </button>
                
                <button onclick="showDashboardSection('students')" class="p-6 border rounded-lg hover:bg-accent transition-colors text-left">
                    <i data-lucide="users" class="h-8 w-8 text-green-600 mb-3"></i>
                    <h4 class="font-semibold">Student Management</h4>
                    <p class="text-sm text-muted-foreground">View and manage all students</p>
                </button>
                
                <button onclick="showDashboardSection('settings')" class="p-6 border rounded-lg hover:bg-accent transition-colors text-left">
                    <i data-lucide="settings" class="h-8 w-8 text-purple-600 mb-3"></i>
                    <h4 class="font-semibold">School Settings</h4>
                    <p class="text-sm text-muted-foreground">Configure curriculum and subjects</p>
                </button>
            </div>
            
            <!-- Charts -->
            <div class="grid gap-4 lg:grid-cols-2">
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Enrollment Trends</h3>
                    <div class="chart-container h-64">
                        <canvas id="admin-enrollmentChart"></canvas>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Grade Distribution</h3>
                    <div class="chart-container h-64">
                        <canvas id="admin-gradeChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Render Admin Pending Teachers
async function renderAdminPendingTeachers() {
    try {
        const teachers = await loadPendingTeachers();
        return `
            <div class="space-y-6 animate-fade-in">
                <h2 class="text-2xl font-bold">Pending Teacher Approvals</h2>
                <div class="rounded-xl border bg-card overflow-hidden">
                    ${teachers.length > 0 ? `
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
                                                    <button onclick="approveTeacher('${teacher.id}')" class="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full hover:bg-green-200 mr-2">Approve</button>
                                                    <button onclick="rejectTeacher('${teacher.id}')" class="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full hover:bg-red-200">Reject</button>
                                                </td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    ` : '<div class="p-8 text-center text-muted-foreground">No pending teacher approvals</div>'}
                </div>
            </div>
        `;
    } catch (error) {
        return `<div class="text-center py-12 text-red-500">Error loading pending teachers: ${error.message}</div>`;
    }
}

// Call this when admin dashboard loads
if (typeof showDashboardSection === 'function') {
    const originalShowDashboard = showDashboardSection;
    window.showDashboardSection = async function(section) {
        await originalShowDashboard(section);
        if (section === 'dashboard' && getCurrentRole() === 'admin') {
            setTimeout(updateAdminStats, 500);
        }
    };
}

// Add this function to main.js to render the schools table
async function refreshSchoolsList() {
    const container = document.getElementById('schools-table-body');
    if (!container) return;
    
    try {
        const response = await api.superAdmin.getSchools();
        const schools = response.data || [];
        
        // Update total count
        const totalEl = document.getElementById('total-schools');
        const schoolCountEl = document.getElementById('school-count');
        if (totalEl) totalEl.textContent = schools.length;
        if (schoolCountEl) schoolCountEl.textContent = schools.length + ' total';
        
        // Calculate stats
        const activeSchools = schools.filter(s => s.status === 'active').length;
        const pendingSchools = schools.filter(s => s.status === 'pending').length;
        
        const activeAdminsEl = document.getElementById('active-admins');
        const pendingApprovalsEl = document.getElementById('pending-approvals');
        
        if (activeAdminsEl) activeAdminsEl.textContent = activeSchools;
        if (pendingApprovalsEl) pendingApprovalsEl.textContent = pendingSchools;
        
        // Render table
        let html = '';
        schools.forEach(school => {
            const admin = school.admins && school.admins.length > 0 ? school.admins[0] : null;
            const adminName = admin ? admin.name : 'No admin';
            const adminEmail = admin ? admin.email : '-';
            
            const statusColor = {
                'active': 'bg-green-100 text-green-700',
                'pending': 'bg-yellow-100 text-yellow-700',
                'suspended': 'bg-red-100 text-red-700',
                'rejected': 'bg-gray-100 text-gray-700'
            }[school.status] || 'bg-gray-100 text-gray-700';
            
            html += `
                <tr class="hover:bg-accent/50 transition-colors">
                    <td class="px-4 py-3 font-medium">${school.name || 'Unknown'}</td>
                    <td class="px-4 py-3">
                        <div>${adminName}</div>
                        <div class="text-xs text-muted-foreground">${adminEmail}</div>
                    </td>
                    <td class="px-4 py-3">${school.settings?.schoolLevel || 'N/A'}</td>
                    <td class="px-4 py-3">
                        <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColor}">
                            ${school.status}
                        </span>
                    </td>
                    <td class="px-4 py-3 text-right">
                        <button onclick="viewSchoolDetails('${school.id}')" class="p-2 hover:bg-accent rounded-lg" title="View">
                            <i data-lucide="eye" class="h-4 w-4"></i>
                        </button>
                        <button onclick="editSchool('${school.id}')" class="p-2 hover:bg-accent rounded-lg" title="Edit">
                            <i data-lucide="edit" class="h-4 w-4"></i>
                        </button>
                        ${school.status === 'active' ? 
                            `<button onclick="suspendSchool('${school.id}')" class="p-2 hover:bg-yellow-100 rounded-lg text-yellow-600" title="Suspend">
                                <i data-lucide="pause-circle" class="h-4 w-4"></i>
                            </button>` : 
                            school.status === 'suspended' ?
                            `<button onclick="reactivateSchool('${school.id}')" class="p-2 hover:bg-green-100 rounded-lg text-green-600" title="Reactivate">
                                <i data-lucide="play-circle" class="h-4 w-4"></i>
                            </button>` : ''
                        }
                        <button onclick="deleteSchool('${school.id}')" class="p-2 hover:bg-red-100 rounded-lg text-red-600" title="Delete">
                            <i data-lucide="trash-2" class="h-4 w-4"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        if (schools.length === 0) {
            html = '<tr><td colspan="5" class="px-4 py-8 text-center text-muted-foreground">No schools found</td></tr>';
        }
        
        container.innerHTML = html;
        
        // Refresh icons
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
        
    } catch (error) {
        console.error('Error refreshing schools list:', error);
        container.innerHTML = '<tr><td colspan="5" class="px-4 py-8 text-center text-red-500">Error loading schools</td></tr>';
    }
}

// Add to main.js
async function refreshNameChangeRequests() {
    const container = document.getElementById('name-change-requests');
    if (!container) return;
    
    try {
        const response = await api.superAdmin.getPendingRequests();
        const requests = response.data || [];
        
        if (requests.length === 0) {
            container.innerHTML = '<div class="p-8 text-center text-muted-foreground">No pending name change requests</div>';
            return;
        }
        
        let html = '';
        requests.forEach(request => {
            html += `
                <div class="p-4 flex items-center justify-between hover:bg-accent/50 transition-colors">
                    <div>
                        <p class="text-sm font-medium">${request.currentName} → ${request.newName}</p>
                        <p class="text-xs text-muted-foreground">Requested by: ${request.User?.name || 'Unknown'} • ${timeAgo(request.createdAt)}</p>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="approveNameChange('${request.id}')" class="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full hover:bg-green-200">Approve</button>
                        <button onclick="rejectNameChange('${request.id}')" class="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full hover:bg-red-200">Reject</button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
        
    } catch (error) {
        console.error('Error loading name change requests:', error);
        container.innerHTML = '<div class="p-8 text-center text-red-500">Error loading requests</div>';
    }
}

// ============================================
// CALENDAR FUNCTIONS - Add to main.js
// ============================================

// Load calendar events from localStorage
function loadCalendarEvents() {
    try {
        const events = localStorage.getItem('calendarEvents');
        return events ? JSON.parse(events) : [];
    } catch (error) {
        console.error('Error loading calendar events:', error);
        return [];
    }
}

// Save calendar events
function saveCalendarEvents(events) {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
}

// Show add event modal
window.showAddEventModal = function(prefillDate) {
    let modal = document.getElementById('add-event-modal');
    if (!modal) {
        createAddEventModal();
        modal = document.getElementById('add-event-modal');
    }
    
    if (prefillDate) {
        document.getElementById('event-date').value = prefillDate;
    } else {
        document.getElementById('event-date').value = new Date().toISOString().split('T')[0];
    }
    
    document.getElementById('event-title').value = '';
    document.getElementById('event-description').value = '';
    document.getElementById('event-time').value = '';
    document.getElementById('event-location').value = '';
    
    modal.classList.remove('hidden');
};

// Create add event modal
function createAddEventModal() {
    const modalHTML = `
        <div id="add-event-modal" class="fixed inset-0 z-50 hidden">
            <div class="absolute inset-0 bg-black/50" onclick="closeAddEventModal()"></div>
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4">
                <div class="rounded-xl border bg-card p-6 shadow-xl animate-fade-in">
                    <h3 class="text-lg font-semibold mb-4">Add Calendar Event</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Event Title *</label>
                            <input type="text" id="event-title" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Date *</label>
                            <input type="date" id="event-date" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Time (Optional)</label>
                            <input type="time" id="event-time" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Location</label>
                            <input type="text" id="event-location" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Description</label>
                            <textarea id="event-description" rows="3" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"></textarea>
                        </div>
                    </div>
                    <div class="flex justify-end gap-2 mt-6">
                        <button onclick="closeAddEventModal()" class="px-4 py-2 text-sm border rounded-lg hover:bg-accent">Cancel</button>
                        <button onclick="saveCalendarEvent()" class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Save Event</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Close add event modal
window.closeAddEventModal = function() {
    const modal = document.getElementById('add-event-modal');
    if (modal) modal.classList.add('hidden');
};

// ============================================
// DUTY FUNCTIONS - Add to main.js
// ============================================

// Check in duty
window.checkInDuty = async function(location = 'School Gate', notes = '') {
    try {
        const response = await api.duty.checkIn({ location, notes });
        showToast('✅ Checked in successfully!', 'success');
        updateDutyStatus('checked-in');
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to check in', 'error');
        throw error;
    }
};

// Check out duty
window.checkOutDuty = async function(location = 'School Gate', notes = '') {
    try {
        const response = await api.duty.checkOut({ location, notes });
        showToast('✅ Checked out successfully!', 'success');
        updateDutyStatus('checked-out');
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to check out', 'error');
        throw error;
    }
};

// Request duty swap
window.requestDutySwap = async function(dutyDate, reason, targetTeacherId = null) {
    try {
        const response = await api.duty.requestSwap({ dutyDate, reason, targetTeacherId });
        showToast('✅ Swap request sent to admin', 'success');
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to request swap', 'error');
        throw error;
    }
};

// Update duty preferences
window.updateDutyPreferences = async function(preferences) {
    try {
        const response = await api.duty.updatePreferences(preferences);
        showToast('✅ Preferences updated', 'success');
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to update preferences', 'error');
        throw error;
    }
};

// Update duty status UI
function updateDutyStatus(status) {
    const dutyCard = document.getElementById('duty-card');
    if (!dutyCard) return;
    
    const statusSpan = dutyCard.querySelector('.duty-status');
    const checkInBtn = document.getElementById('check-in-btn');
    const checkOutBtn = document.getElementById('check-out-btn');
    
    if (status === 'checked-in') {
        if (statusSpan) {
            statusSpan.textContent = 'Checked In';
            statusSpan.className = 'duty-status px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full';
        }
        if (checkInBtn) checkInBtn.disabled = true;
        if (checkOutBtn) checkOutBtn.disabled = false;
    } else if (status === 'checked-out') {
        if (statusSpan) {
            statusSpan.textContent = 'Checked Out';
            statusSpan.className = 'duty-status px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full';
        }
        if (checkInBtn) checkInBtn.disabled = true;
        if (checkOutBtn) checkOutBtn.disabled = true;
    } else {
        if (statusSpan) {
            statusSpan.textContent = 'Not Checked In';
            statusSpan.className = 'duty-status px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full';
        }
        if (checkInBtn) checkInBtn.disabled = false;
        if (checkOutBtn) checkOutBtn.disabled = true;
    }
}

// Save calendar event
window.saveCalendarEvent = function() {
    const title = document.getElementById('event-title')?.value;
    const date = document.getElementById('event-date')?.value;
    const time = document.getElementById('event-time')?.value;
    const location = document.getElementById('event-location')?.value;
    const description = document.getElementById('event-description')?.value;
    
    if (!title || !date) {
        showToast('Title and date are required', 'error');
        return;
    }
    
    const events = loadCalendarEvents();
    const newEvent = {
        id: Date.now().toString(),
        title,
        date,
        time,
        location,
        description,
        createdAt: new Date().toISOString()
    };
    
    events.push(newEvent);
    saveCalendarEvents(events);
    
    showToast('Event added successfully', 'success');
    closeAddEventModal();
    
    if (currentSection === 'calendar') {
        showDashboardSection('calendar');
    }
};

// Delete event
window.deleteEvent = function(eventId) {
    if (!confirm('Delete this event?')) return;
    
    const events = loadCalendarEvents();
    const filtered = events.filter(e => e.id !== eventId);
    saveCalendarEvents(filtered);
    
    showToast('Event deleted', 'success');
    
    if (currentSection === 'calendar') {
        showDashboardSection('calendar');
    }
};

// Show day details modal
window.showDayDetails = function(dateStr) {
    const events = loadCalendarEvents();
    const dayEvents = events.filter(e => e.date === dateStr);
    const date = new Date(dateStr);
    
    let modal = document.getElementById('day-details-modal');
    if (!modal) {
        createDayDetailsModal();
        modal = document.getElementById('day-details-modal');
    }
    
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.innerHTML = `
            <div class="space-y-4">
                <div class="border-b pb-3">
                    <h4 class="font-semibold text-lg">${date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h4>
                </div>
                ${dayEvents.length > 0 ? `
                    <div class="space-y-2">
                        ${dayEvents.map(event => `
                            <div class="p-3 border rounded-lg">
                                <p class="font-medium">${event.title}</p>
                                ${event.time ? `<p class="text-sm text-muted-foreground">🕐 ${event.time}</p>` : ''}
                                ${event.location ? `<p class="text-sm text-muted-foreground">📍 ${event.location}</p>` : ''}
                                ${event.description ? `<p class="text-sm mt-2">${event.description}</p>` : ''}
                                <button onclick="deleteEvent('${event.id}')" class="mt-2 text-xs text-red-600 hover:underline">Delete</button>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p class="text-center text-muted-foreground py-8">No events for this day</p>'}
                <button onclick="showAddEventModal('${dateStr}')" class="w-full mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                    Add Event
                </button>
            </div>
        `;
    }
    
    modal.classList.remove('hidden');
};

// Create day details modal
function createDayDetailsModal() {
    const modalHTML = `
        <div id="day-details-modal" class="fixed inset-0 z-50 hidden">
            <div class="absolute inset-0 bg-black/50" onclick="closeDayDetailsModal()"></div>
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4">
                <div class="rounded-xl border bg-card p-6 shadow-xl animate-fade-in">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold">Day Details</h3>
                        <button onclick="closeDayDetailsModal()" class="p-2 hover:bg-accent rounded-lg">
                            <i data-lucide="x" class="h-5 w-5"></i>
                        </button>
                    </div>
                    <div class="modal-content">
                        <!-- Content will be filled dynamically -->
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Close day details modal
window.closeDayDetailsModal = function() {
    const modal = document.getElementById('day-details-modal');
    if (modal) modal.classList.add('hidden');
};

// Calendar navigation
window.calendarChangeMonth = function(direction) {
    console.log('Changing month by:', direction);
    showToast('Calendar month navigation - Feature coming soon', 'info');
};

window.calendarGoToToday = function() {
    console.log('Going to today');
    showToast('Calendar navigation - Feature coming soon', 'info');
};

window.calendarGoToDate = function(year, month, day) {
    console.log('Going to date:', year, month, day);
    showToast('Calendar navigation - Feature coming soon', 'info');
};

// ============================================
// ENHANCED DUTY MANAGEMENT WITH MANUAL POINTS
// ============================================

// Duty points storage
let dutyPoints = {
    teachers: {}, // teacherId -> { points, preferences, ratings }
    areas: {
        'morning': { basePoints: 10, multiplier: 1 },
        'lunch': { basePoints: 15, multiplier: 1.5 },
        'afternoon': { basePoints: 12, multiplier: 1.2 },
        'whole_day': { basePoints: 25, multiplier: 2.5 }
    }
};

// Load duty points from localStorage
function loadDutyPoints() {
    try {
        const saved = localStorage.getItem('dutyPoints');
        if (saved) {
            dutyPoints = JSON.parse(saved);
        }
    } catch (error) {
        console.error('Error loading duty points:', error);
    }
}

// Save duty points
function saveDutyPoints() {
    localStorage.setItem('dutyPoints', JSON.stringify(dutyPoints));
}

// Update teacher duty points
window.updateTeacherDutyPoints = function(teacherId, points, reason) {
    if (!dutyPoints.teachers[teacherId]) {
        dutyPoints.teachers[teacherId] = {
            points: 0,
            history: [],
            preferences: {},
            rating: 0
        };
    }
    
    dutyPoints.teachers[teacherId].points += points;
    dutyPoints.teachers[teacherId].history.push({
        date: new Date().toISOString(),
        points: points,
        reason: reason,
        total: dutyPoints.teachers[teacherId].points
    });
    
    saveDutyPoints();
    showToast(`Added ${points} points to teacher`, 'success');
    refreshDutyPointsDisplay();
};

// Get teacher duty points
window.getTeacherDutyPoints = function(teacherId) {
    return dutyPoints.teachers[teacherId]?.points || 0;
};

// Render duty points management UI
function renderDutyPointsManagement() {
    const teachers = dashboardData?.teachers || [];
    
    return `
        <div class="space-y-6 animate-fade-in">
            <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold">Duty Points Management</h2>
                <button onclick="resetDutyPoints()" class="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
                    Reset All Points
                </button>
            </div>
            
            <div class="grid gap-6">
                <!-- Manual Point Assignment -->
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Manual Point Assignment</h3>
                    <div class="grid gap-4 md:grid-cols-3">
                        <div>
                            <label class="block text-sm font-medium mb-1">Select Teacher</label>
                            <select id="point-teacher" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                                <option value="">-- Select Teacher --</option>
                                ${teachers.map(t => `
                                    <option value="${t.id}">${t.User?.name || 'Unknown'}</option>
                                `).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Points to Add</label>
                            <input type="number" id="point-amount" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="e.g., 10, -5">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Reason</label>
                            <input type="text" id="point-reason" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="e.g., Completed extra duty">
                        </div>
                    </div>
                    <button onclick="assignManualPoints()" class="mt-4 w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90">
                        Assign Points
                    </button>
                </div>
                
                <!-- Area Point Configuration -->
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Duty Area Point Configuration</h3>
                    <div class="space-y-3">
                        <div class="grid gap-4 md:grid-cols-2">
                            <div class="p-3 bg-muted/30 rounded-lg">
                                <p class="font-medium">Morning Duty</p>
                                <p class="text-sm text-muted-foreground">Base Points: <span id="morning-points">${dutyPoints.areas.morning.basePoints}</span></p>
                                <input type="number" id="morning-points-input" value="${dutyPoints.areas.morning.basePoints}" class="mt-2 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm">
                                <button onclick="updateAreaPoints('morning')" class="mt-2 w-full text-sm bg-primary/10 text-primary py-1 rounded hover:bg-primary/20">Update</button>
                            </div>
                            <div class="p-3 bg-muted/30 rounded-lg">
                                <p class="font-medium">Lunch Duty</p>
                                <p class="text-sm text-muted-foreground">Base Points: <span id="lunch-points">${dutyPoints.areas.lunch.basePoints}</span></p>
                                <input type="number" id="lunch-points-input" value="${dutyPoints.areas.lunch.basePoints}" class="mt-2 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm">
                                <button onclick="updateAreaPoints('lunch')" class="mt-2 w-full text-sm bg-primary/10 text-primary py-1 rounded hover:bg-primary/20">Update</button>
                            </div>
                            <div class="p-3 bg-muted/30 rounded-lg">
                                <p class="font-medium">Afternoon Duty</p>
                                <p class="text-sm text-muted-foreground">Base Points: <span id="afternoon-points">${dutyPoints.areas.afternoon.basePoints}</span></p>
                                <input type="number" id="afternoon-points-input" value="${dutyPoints.areas.afternoon.basePoints}" class="mt-2 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm">
                                <button onclick="updateAreaPoints('afternoon')" class="mt-2 w-full text-sm bg-primary/10 text-primary py-1 rounded hover:bg-primary/20">Update</button>
                            </div>
                            <div class="p-3 bg-muted/30 rounded-lg">
                                <p class="font-medium">Whole Day Duty</p>
                                <p class="text-sm text-muted-foreground">Base Points: <span id="whole_day-points">${dutyPoints.areas.whole_day.basePoints}</span></p>
                                <input type="number" id="whole_day-points-input" value="${dutyPoints.areas.whole_day.basePoints}" class="mt-2 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm">
                                <button onclick="updateAreaPoints('whole_day')" class="mt-2 w-full text-sm bg-primary/10 text-primary py-1 rounded hover:bg-primary/20">Update</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Teacher Points Table -->
                <div class="rounded-xl border bg-card overflow-hidden">
                    <div class="p-4 border-b">
                        <h3 class="font-semibold">Teacher Duty Points Leaderboard</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead class="bg-muted/50">
                                <tr>
                                    <th class="px-4 py-3 text-left font-medium">Teacher</th>
                                    <th class="px-4 py-3 text-center font-medium">Total Points</th>
                                    <th class="px-4 py-3 text-center font-medium">Duties Completed</th>
                                    <th class="px-4 py-3 text-center font-medium">Reliability</th>
                                    <th class="px-4 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y" id="teacher-points-table">
                                ${teachers.map(t => {
                                    const points = dutyPoints.teachers[t.id]?.points || 0;
                                    const reliability = t.statistics?.reliabilityScore || 100;
                                    const dutiesCompleted = t.statistics?.dutiesCompleted || 0;
                                    return `
                                        <tr class="hover:bg-accent/50 transition-colors">
                                            <td class="px-4 py-3 font-medium">${t.User?.name || 'Unknown'}</td>
                                            <td class="px-4 py-3 text-center">
                                                <span class="font-bold text-lg ${points >= 100 ? 'text-green-600' : points >= 50 ? 'text-blue-600' : 'text-gray-600'}">
                                                    ${points}
                                                </span>
                                            </td>
                                            <td class="px-4 py-3 text-center">${dutiesCompleted}</td>
                                            <td class="px-4 py-3 text-center">
                                                <div class="flex items-center justify-center gap-2">
                                                    <div class="h-2 w-16 rounded-full bg-muted overflow-hidden">
                                                        <div class="h-full w-[${reliability}%] bg-green-500 rounded-full"></div>
                                                    </div>
                                                    <span>${reliability}%</span>
                                                </div>
                                            </td>
                                            <td class="px-4 py-3 text-right">
                                                <button onclick="showTeacherPointHistory('${t.id}')" class="p-2 hover:bg-accent rounded-lg" title="View History">
                                                    <i data-lucide="history" class="h-4 w-4"></i>
                                                </button>
                                                <button onclick="showAddPointsModal('${t.id}', '${t.User?.name}')" class="p-2 hover:bg-accent rounded-lg" title="Add Points">
                                                    <i data-lucide="plus-circle" class="h-4 w-4 text-green-600"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Assign manual points
window.assignManualPoints = function() {
    const teacherId = document.getElementById('point-teacher')?.value;
    const amount = parseInt(document.getElementById('point-amount')?.value);
    const reason = document.getElementById('point-reason')?.value;
    
    if (!teacherId || !amount) {
        showToast('Please select teacher and enter points', 'error');
        return;
    }
    
    updateTeacherDutyPoints(teacherId, amount, reason || 'Manual assignment');
    document.getElementById('point-amount').value = '';
    document.getElementById('point-reason').value = '';
};

// Update area points
window.updateAreaPoints = function(area) {
    const inputId = `${area}-points-input`;
    const newPoints = parseInt(document.getElementById(inputId)?.value);
    
    if (!newPoints || newPoints < 0) {
        showToast('Please enter valid points', 'error');
        return;
    }
    
    dutyPoints.areas[area].basePoints = newPoints;
    saveDutyPoints();
    
    const spanId = `${area}-points`;
    if (document.getElementById(spanId)) {
        document.getElementById(spanId).textContent = newPoints;
    }
    
    showToast(`Updated ${area} duty points to ${newPoints}`, 'success');
};

// Enhanced duty roster generation with points
async function generateDutyRosterWithPoints(startDate, endDate) {
    showLoading();
    try {
        const teachers = await loadAllTeachers();
        const availableTeachers = teachers.filter(t => t.approvalStatus === 'approved' && t.User?.isActive);
        
        // Calculate teacher weights based on points and reliability
        const teacherWeights = availableTeachers.map(teacher => {
            const points = getTeacherDutyPoints(teacher.id);
            const reliability = teacher.statistics?.reliabilityScore || 100;
            const preferences = teacher.dutyPreferences || {};
            
            // Weight formula: higher points = lower weight (to balance)
            // Lower points get priority for assignments
            const weight = Math.max(1, 100 - (points / 10) - (reliability / 2));
            
            return {
                teacher,
                points,
                reliability,
                weight,
                preferences
            };
        });
        
        // Sort by weight (lowest weight = highest priority for assignment)
        teacherWeights.sort((a, b) => a.weight - b.weight);
        
        const start = moment(startDate);
        const end = moment(endDate);
        const days = end.diff(start, 'days') + 1;
        
        const rosters = [];
        
        for (let i = 0; i < days; i++) {
            const currentDate = start.clone().add(i, 'days');
            if (currentDate.day() === 0) continue; // Skip Sunday
            
            const dateStr = currentDate.format('YYYY-MM-DD');
            const dayOfWeek = currentDate.format('dddd').toLowerCase();
            
            const dayDuties = [];
            const assignedTeachers = new Set();
            
            // Assign duties for each slot
            for (const [slot, config] of Object.entries(dutyPoints.areas)) {
                const required = 2; // Default 2 teachers per slot
                const basePoints = config.basePoints;
                
                // Find available teachers not already assigned this day
                const available = teacherWeights.filter(tw => !assignedTeachers.has(tw.teacher.id));
                
                // Check blackout dates
                const eligible = available.filter(tw => {
                    const blackouts = tw.preferences.blackoutDates || [];
                    return !blackouts.includes(dateStr);
                });
                
                // Check max duties per week
                const weeklyEligible = eligible.filter(tw => {
                    const weeklyCount = tw.teacher.statistics?.weeklyDutyCount || 0;
                    const maxWeekly = tw.preferences.maxDutiesPerWeek || 3;
                    return weeklyCount < maxWeekly;
                });
                
                // Select teachers based on weight (lowest weight gets priority)
                const selected = weeklyEligible.slice(0, required);
                
                selected.forEach(tw => {
                    const pointsEarned = basePoints;
                    dayDuties.push({
                        teacherId: tw.teacher.id,
                        teacherName: tw.teacher.User?.name || 'Unknown',
                        type: slot,
                        area: slot === 'morning' ? 'Main Gate / Assembly Area' :
                              slot === 'lunch' ? 'Dining Hall / Playground' :
                              slot === 'afternoon' ? 'School Compound' : 'General Supervision',
                        timeSlot: {
                            start: slot === 'morning' ? '07:30' : slot === 'lunch' ? '12:30' : slot === 'afternoon' ? '15:30' : '07:30',
                            end: slot === 'morning' ? '08:30' : slot === 'lunch' ? '14:00' : slot === 'afternoon' ? '16:30' : '16:30'
                        },
                        pointsEarned: pointsEarned,
                        status: 'scheduled'
                    });
                    
                    assignedTeachers.add(tw.teacher.id);
                    
                    // Award points immediately
                    updateTeacherDutyPoints(tw.teacher.id, pointsEarned, `${slot} duty on ${dateStr}`);
                });
            }
            
            if (dayDuties.length > 0) {
                rosters.push({
                    date: dateStr,
                    duties: dayDuties,
                    totalPoints: dayDuties.reduce((sum, d) => sum + d.pointsEarned, 0)
                });
            }
        }
        
        // Save roster
        localStorage.setItem('dutyRoster', JSON.stringify(rosters));
        
        showToast(`✅ Generated ${rosters.length} days of duty roster with point-based assignment`, 'success');
        await showDashboardSection('duty');
        
    } catch (error) {
        console.error('Error generating duty roster:', error);
        showToast(error.message || 'Failed to generate duty roster', 'error');
    } finally {
        hideLoading();
    }
}

// Load duty roster
function loadDutyRoster() {
    try {
        const saved = localStorage.getItem('dutyRoster');
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        return [];
    }
}

// Override generateDutyRoster function
window.generateDutyRoster = generateDutyRosterWithPoints;

// ============================================
// CHART INITIALIZATION FOR ADMIN DASHBOARD
// ============================================

function initAdminCharts() {
    console.log('📊 Initializing admin charts...');
    
    // Enrollment Chart
    const enrollCtx = document.getElementById('admin-enrollmentChart');
    if (enrollCtx) {
        // Destroy existing chart if any
        if (window.adminEnrollChart) {
            window.adminEnrollChart.destroy();
        }
        
        window.adminEnrollChart = new Chart(enrollCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Students',
                    data: [520, 535, 543, 550, 558, 565, 572, 580, 585, 590, 595, 600],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#fff',
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0,0,0,0.05)' },
                        ticks: { stepSize: 100 }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
        console.log('✅ Enrollment chart initialized');
    } else {
        console.warn('⚠️ admin-enrollmentChart canvas not found');
    }
    
    // Grade Distribution Chart (Doughnut)
    const gradeCtx = document.getElementById('admin-gradeChart');
    if (gradeCtx) {
        if (window.adminGradeChart) {
            window.adminGradeChart.destroy();
        }
        
        window.adminGradeChart = new Chart(gradeCtx, {
            type: 'doughnut',
            data: {
                labels: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
                datasets: [{
                    data: [142, 138, 135, 128],
                    backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: { size: 12 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} students (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
        console.log('✅ Grade distribution chart initialized');
    } else {
        console.warn('⚠️ admin-gradeChart canvas not found');
    }
}

// ============================================
// MISSING HELPER FUNCTIONS - Add to main.js
// ============================================

// Render duty preferences form
function renderDutyPreferencesForm(preferences) {
    return `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium mb-1">Preferred Days</label>
                <div class="flex flex-wrap gap-3">
                    ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => `
                        <label class="flex items-center gap-2">
                            <input type="checkbox" name="preferredDays" value="${day.toLowerCase()}" 
                                ${preferences.preferredDays?.includes(day.toLowerCase()) ? 'checked' : ''}
                                class="rounded border-input">
                            <span class="text-sm">${day}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-1">Preferred Duty Areas</label>
                <div class="flex flex-wrap gap-3">
                    ${[
                        { value: 'morning', label: 'Morning (7:30-8:30)' },
                        { value: 'lunch', label: 'Lunch (12:30-14:00)' },
                        { value: 'afternoon', label: 'Afternoon (15:30-16:30)' },
                        { value: 'whole_day', label: 'Whole Day' }
                    ].map(area => `
                        <label class="flex items-center gap-2">
                            <input type="checkbox" name="preferredAreas" value="${area.value}" 
                                ${preferences.preferredAreas?.includes(area.value) ? 'checked' : ''}
                                class="rounded border-input">
                            <span class="text-sm">${area.label}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-1">Max Duties Per Week</label>
                <input type="number" id="max-duties" value="${preferences.maxDutiesPerWeek || 3}" 
                    min="1" max="5" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-1">Blackout Dates (Cannot do duty)</label>
                <div class="flex gap-2">
                    <input type="date" id="blackout-date" class="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm">
                    <button type="button" onclick="addBlackoutDate()" class="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm">Add</button>
                </div>
                <div id="blackout-dates-list" class="mt-2 space-y-1">
                    ${(preferences.blackoutDates || []).map(date => `
                        <div class="flex justify-between items-center p-2 bg-muted/30 rounded">
                            <span class="text-sm">${new Date(date).toLocaleDateString()}</span>
                            <button type="button" onclick="removeBlackoutDate('${date}')" class="text-red-600">
                                <i data-lucide="x" class="h-4 w-4"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <button type="button" onclick="saveDutyPreferences()" class="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90">
                Save Preferences
            </button>
        </div>
    `;
}

// Add blackout date
window.addBlackoutDate = function() {
    const dateInput = document.getElementById('blackout-date');
    const date = dateInput?.value;
    if (!date) {
        showToast('Please select a date', 'error');
        return;
    }
    
    const listContainer = document.getElementById('blackout-dates-list');
    if (listContainer) {
        // Check if already added
        if (listContainer.innerHTML.includes(date)) {
            showToast('Date already added', 'warning');
            return;
        }
        
        listContainer.innerHTML += `
            <div class="flex justify-between items-center p-2 bg-muted/30 rounded">
                <span class="text-sm">${new Date(date).toLocaleDateString()}</span>
                <button onclick="removeBlackoutDate('${date}')" class="text-red-600">
                    <i data-lucide="x" class="h-4 w-4"></i>
                </button>
            </div>
        `;
        dateInput.value = '';
        
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }
};

// Remove blackout date
window.removeBlackoutDate = function(date) {
    const listContainer = document.getElementById('blackout-dates-list');
    if (listContainer) {
        const item = Array.from(listContainer.children).find(
            div => div.textContent.includes(new Date(date).toLocaleDateString())
        );
        if (item) item.remove();
    }
};

// Update charts with new data
window.updateAdminChart = function(value) {
    console.log('Updating admin chart with:', value);
    // You can add logic here to fetch new data based on the selected value
    // For now, just refresh the existing chart
    if (window.adminEnrollChart) {
        // Could update with new data here
        console.log('Chart update triggered');
    }
};

window.updateAdminPieChart = function(value) {
    console.log('Updating admin pie chart with:', value);
    if (window.adminGradeChart) {
        // Could update with new data here
        console.log('Pie chart update triggered');
    }
};

async function renderAdminTeachers() {
    try {
        const teachers = await loadAllTeachers();
        return `
            <div class="space-y-6 animate-fade-in">
                <h2 class="text-2xl font-bold">Teacher Management</h2>
                <div class="rounded-xl border bg-card overflow-hidden">
                    ${renderTeachersTable(teachers)}
                </div>
            </div>
        `;
    } catch (error) {
        return `<div class="text-center py-12 text-red-500">Error loading teachers: ${error.message}</div>`;
    }
}

// ============================================
// ADMIN STUDENTS SECTION - WITH PROPER VIEW
// ============================================

async function renderAdminStudents() {
    try {
        const students = await loadAllStudents();
        
        return `
            <div class="space-y-6 animate-fade-in">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold">Student Management</h2>
                    <button onclick="showAddStudentModal()" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
                        <i data-lucide="plus" class="h-4 w-4"></i>
                        Add Student
                    </button>
                </div>

                <!-- Stats Cards -->
                <div class="grid gap-4 md:grid-cols-4">
                    <div class="rounded-xl border bg-card p-4">
                        <p class="text-sm text-muted-foreground">Total Students</p>
                        <p class="text-2xl font-bold">${students.length}</p>
                    </div>
                    <div class="rounded-xl border bg-card p-4">
                        <p class="text-sm text-muted-foreground">Active</p>
                        <p class="text-2xl font-bold text-green-600">${students.filter(s => s.status === 'active').length}</p>
                    </div>
                    <div class="rounded-xl border bg-card p-4">
                        <p class="text-sm text-muted-foreground">Suspended</p>
                        <p class="text-2xl font-bold text-red-600">${students.filter(s => s.status === 'suspended').length}</p>
                    </div>
                    <div class="rounded-xl border bg-card p-4">
                        <p class="text-sm text-muted-foreground">Graduated</p>
                        <p class="text-2xl font-bold text-blue-600">${students.filter(s => s.status === 'graduated').length}</p>
                    </div>
                </div>

                <!-- Students Table with Actions -->
                <div class="rounded-xl border bg-card overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead class="bg-muted/50">
                                <tr>
                                    <th class="px-4 py-3 text-left font-medium">Student</th>
                                    <th class="px-4 py-3 text-left font-medium">ELIMUID</th>
                                    <th class="px-4 py-3 text-left font-medium">Grade</th>
                                    <th class="px-4 py-3 text-left font-medium">Status</th>
                                    <th class="px-4 py-3 text-left font-medium">Parent Email</th>
                                    <th class="px-4 py-3 text-center font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y" id="students-table-body">
                                ${students.map(student => {
                                    const user = student.User || {};
                                    const name = user.name || 'Unknown';
                                    const email = user.email || 'N/A';
                                    const status = student.status || 'active';
                                    const statusClass = status === 'active' ? 'bg-green-100 text-green-700' : 
                                                       status === 'suspended' ? 'bg-red-100 text-red-700' : 
                                                       'bg-gray-100 text-gray-700';
                                    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                                    
                                    return `
                                        <tr class="hover:bg-accent/50 transition-colors">
                                            <td class="px-4 py-3">
                                                <div class="flex items-center gap-3">
                                                    <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <span class="font-medium text-blue-700 text-sm">${initials}</span>
                                                    </div>
                                                    <span class="font-medium">${name}</span>
                                                </div>
                                             </td>
                                            <td class="px-4 py-3">
                                                <span class="font-mono text-xs bg-muted px-2 py-1 rounded">${student.elimuid || 'N/A'}</span>
                                             </td>
                                            <td class="px-4 py-3">${student.grade || 'N/A'}</td>
                                            <td class="px-4 py-3">
                                                <span class="px-2 py-1 ${statusClass} text-xs rounded-full">${status}</span>
                                             </td>
                                            <td class="px-4 py-3">${email}</td>
                                            <td class="px-4 py-3 text-center">
                                                <div class="flex items-center justify-center gap-2">
                                                    <button onclick="viewStudentDetails('${student.id}')" class="p-2 hover:bg-accent rounded-lg" title="View Details">
                                                        <i data-lucide="eye" class="h-4 w-4 text-blue-600"></i>
                                                    </button>
                                                    <button onclick="editStudent('${student.id}')" class="p-2 hover:bg-accent rounded-lg" title="Edit">
                                                        <i data-lucide="edit" class="h-4 w-4 text-green-600"></i>
                                                    </button>
                                                    ${status === 'active' ? 
                                                        `<button onclick="suspendStudent('${student.id}', '${name}')" class="p-2 hover:bg-yellow-100 rounded-lg" title="Suspend">
                                                            <i data-lucide="pause-circle" class="h-4 w-4 text-yellow-600"></i>
                                                        </button>` : 
                                                        `<button onclick="reactivateStudent('${student.id}', '${name}')" class="p-2 hover:bg-green-100 rounded-lg" title="Reactivate">
                                                            <i data-lucide="play-circle" class="h-4 w-4 text-green-600"></i>
                                                        </button>`
                                                    }
                                                    <button onclick="deleteStudent('${student.id}', '${name}')" class="p-2 hover:bg-red-100 rounded-lg" title="Delete">
                                                        <i data-lucide="trash-2" class="h-4 w-4 text-red-600"></i>
                                                    </button>
                                                    <button onclick="copyElimuid('${student.elimuid}')" class="p-2 hover:bg-purple-100 rounded-lg" title="Copy ELIMUID">
                                                        <i data-lucide="copy" class="h-4 w-4 text-purple-600"></i>
                                                    </button>
                                                </div>
                                             </td>
                                         </tr>
                                    `;
                                }).join('')}
                                ${students.length === 0 ? '<tr><td colspan="6" class="px-4 py-8 text-center text-muted-foreground">No students found</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error rendering students:', error);
        return `<div class="text-center py-12 text-red-500">Error loading students: ${error.message}</div>`;
    }
}

// Update renderAdminSection function
async function renderAdminSection(section) {
    try {
        switch(section) {
            case 'dashboard':
                return renderAdminDashboard();
            case 'students':
                return await renderAdminStudents();
            case 'teachers':
                return await renderAdminTeachers();
            case 'teacher-approvals':
                return await renderAdminPendingTeachers();
            case 'class-management':
                return await renderClassManagement(); // Make sure this exists
            case 'classes':
                return await renderAdminClasses();
            case 'duty':
                return await renderAdminDuty();
            case 'duty-points':
                return renderDutyPointsManagement();
            case 'fairness-report':
                return await renderAdminFairnessReport();
            case 'teacher-workload':
                return await renderAdminTeacherWorkload();
            case 'settings':
                return renderAdminSettings();
            case 'custom-subjects':
                return renderAdminCustomSubjects();
            case 'calendar':
                return renderAdminCalendar();
            case 'help':
                return renderHelpSection();
            default:
                return '<div class="text-center py-12">Section not found</div>';
        }
    } catch (error) {
        console.error('Error rendering admin section:', error);
        return `<div class="text-center py-12 text-red-500">Error loading section: ${error.message}</div>`;
    }
}

async function renderAdminDuty() {
    try {
        const todayDuty = await loadTodayDuty();
        const weeklyDuty = await loadWeeklyDuty();
        const understaffed = await loadUnderstaffedAreas();
        
        return `
            <div class="space-y-6 animate-fade-in">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold">Duty Management</h2>
                    <button onclick="handleGenerateDutyRoster()" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
                        <i data-lucide="refresh-cw" class="h-4 w-4"></i>
                        Generate New Roster
                    </button>
                </div>
                
                ${understaffed && understaffed.length > 0 ? `
                    <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <div class="flex items-center gap-2 text-red-700 dark:text-red-400 mb-2">
                            <i data-lucide="alert-triangle" class="h-5 w-5"></i>
                            <h3 class="font-semibold">Understaffed Areas Detected</h3>
                        </div>
                        <div class="space-y-2">
                            ${understaffed.map(area => `
                                <div class="text-sm text-red-600 dark:text-red-400">
                                    ${area.date}: ${area.areas.map(a => `${a.area} (need ${a.required}, have ${a.current})`).join(', ')}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div class="grid gap-4 md:grid-cols-2">
                    <div class="rounded-xl border bg-card p-6">
                        <h3 class="font-semibold mb-4">Generate Duty Roster</h3>
                        <div class="space-y-3">
                            <div>
                                <label class="block text-sm font-medium mb-1">Start Date</label>
                                <input type="date" id="duty-start-date" value="${new Date().toISOString().split('T')[0]}" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">End Date</label>
                                <input type="date" id="duty-end-date" value="${new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0]}" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                            </div>
                            <button onclick="handleGenerateDutyRoster()" class="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90">
                                Generate Roster
                            </button>
                        </div>
                    </div>
                    
                    <div class="rounded-xl border bg-card p-6">
                        <h3 class="font-semibold mb-4">Quick Actions</h3>
                        <div class="space-y-2">
                            <button onclick="showDashboardSection('fairness-report')" class="w-full text-left p-3 hover:bg-accent rounded-lg flex items-center gap-3">
                                <i data-lucide="bar-chart-2" class="h-5 w-5 text-blue-600"></i>
                                <div>
                                    <p class="font-medium">Fairness Report</p>
                                    <p class="text-xs text-muted-foreground">View duty distribution analytics</p>
                                </div>
                            </button>
                            <button onclick="showDashboardSection('teacher-workload')" class="w-full text-left p-3 hover:bg-accent rounded-lg flex items-center gap-3">
                                <i data-lucide="users" class="h-5 w-5 text-green-600"></i>
                                <div>
                                    <p class="font-medium">Teacher Workload</p>
                                    <p class="text-xs text-muted-foreground">Monitor duty load per teacher</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Today's Duty (${new Date().toLocaleDateString()})</h3>
                    <div class="space-y-3">
                        ${todayDuty?.duties?.length > 0 ? todayDuty.duties.map(duty => `
                            <div class="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                <div>
                                    <p class="font-medium">${duty.area}</p>
                                    <p class="text-sm text-muted-foreground">${duty.timeSlot?.start} - ${duty.timeSlot?.end}</p>
                                </div>
                                <div class="text-right">
                                    <p class="font-medium">${duty.teacherName}</p>
                                    <p class="text-xs ${duty.checkedIn ? 'text-green-600' : 'text-yellow-600'}">${duty.checkedIn ? '✓ Checked In' : '⏳ Pending'}</p>
                                </div>
                            </div>
                        `).join('') : '<p class="text-center text-muted-foreground py-4">No duty today</p>'}
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Weekly Schedule</h3>
                    <div class="space-y-3">
                        ${weeklyDuty?.map(day => `
                            <div class="border rounded-lg overflow-hidden">
                                <div class="bg-muted/30 px-4 py-2 font-medium ${day.isToday ? 'bg-primary/10' : ''}">
                                    ${day.dayName} ${day.isToday ? '(Today)' : ''}
                                </div>
                                <div class="p-3 space-y-2">
                                    ${day.duties.length > 0 ? day.duties.map(duty => `
                                        <div class="flex justify-between text-sm">
                                            <span>${duty.area}</span>
                                            <span>${duty.teacherName}</span>
                                        </div>
                                    `).join('') : '<p class="text-sm text-muted-foreground">No duty</p>'}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        return `<div class="text-center py-12 text-red-500">Error loading duty: ${error.message}</div>`;
    }
}

async function renderAdminFairnessReport() {
    try {
        const report = await loadFairnessReport();
        return `
            <div class="space-y-6 animate-fade-in">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold">Duty Fairness Report</h2>
                    <div class="text-right">
                        <p class="text-sm text-muted-foreground">${report?.period?.month || new Date().toLocaleString('default', { month: 'long' })}</p>
                    </div>
                </div>
                
                <div class="grid gap-4 md:grid-cols-3">
                    <div class="rounded-xl border bg-card p-6">
                        <p class="text-sm text-muted-foreground">Fairness Score</p>
                        <div class="flex items-end gap-2">
                            <h3 class="text-3xl font-bold">${report?.summary?.fairnessScore || 85}%</h3>
                            <span class="text-sm ${(report?.summary?.fairnessScore || 85) > 80 ? 'text-green-600' : 'text-yellow-600'} mb-1">
                                ${(report?.summary?.fairnessScore || 85) > 80 ? 'Good' : 'Needs Improvement'}
                            </span>
                        </div>
                    </div>
                    
                    <div class="rounded-xl border bg-card p-6">
                        <p class="text-sm text-muted-foreground">Total Duties This Month</p>
                        <h3 class="text-3xl font-bold">${report?.summary?.totalDuties || 0}</h3>
                    </div>
                    
                    <div class="rounded-xl border bg-card p-6">
                        <p class="text-sm text-muted-foreground">Understaffed Days</p>
                        <h3 class="text-3xl font-bold">${report?.summary?.understaffedDays?.length || 0}</h3>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card overflow-hidden">
                    <div class="p-4 border-b">
                        <h3 class="font-semibold">Teacher Workload Distribution</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead class="bg-muted/50">
                                <tr>
                                    <th class="px-4 py-3 text-left font-medium">Teacher</th>
                                    <th class="px-4 py-3 text-left font-medium">Department</th>
                                    <th class="px-4 py-3 text-center font-medium">Scheduled</th>
                                    <th class="px-4 py-3 text-center font-medium">Completed</th>
                                    <th class="px-4 py-3 text-center font-medium">Missed</th>
                                    <th class="px-4 py-3 text-center font-medium">Completion Rate</th>
                                    <th class="px-4 py-3 text-center font-medium">Reliability</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                ${report?.teacherStats?.map(teacher => `
                                    <tr class="hover:bg-accent/50 transition-colors">
                                        <td class="px-4 py-3 font-medium">${teacher.teacherName}</td>
                                        <td class="px-4 py-3">${teacher.department}</td>
                                        <td class="px-4 py-3 text-center">${teacher.scheduled}</td>
                                        <td class="px-4 py-3 text-center">${teacher.completed}</td>
                                        <td class="px-4 py-3 text-center">${teacher.missed}</td>
                                        <td class="px-4 py-3 text-center">${teacher.completionRate}%</td>
                                        <td class="px-4 py-3 text-center">
                                            <span class="px-2 py-1 ${teacher.reliabilityScore > 90 ? 'bg-green-100 text-green-700' : teacher.reliabilityScore > 70 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'} text-xs rounded-full">
                                                ${teacher.reliabilityScore}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                                ${!report?.teacherStats?.length ? '<tr><td colspan="7" class="px-4 py-8 text-center text-muted-foreground">No data available</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                ${report?.recommendations?.length > 0 ? `
                    <div class="rounded-xl border bg-card p-6">
                        <h3 class="font-semibold mb-4">Recommendations</h3>
                        <div class="space-y-3">
                            ${report.recommendations.map(rec => `
                                <div class="p-3 bg-${rec.type === 'workload_balance' ? 'blue' : 'amber'}-50 dark:bg-${rec.type === 'workload_balance' ? 'blue' : 'amber'}-900/20 rounded-lg">
                                    <p class="text-sm font-medium">${rec.message}</p>
                                    ${rec.teachers ? `<p class="text-xs text-muted-foreground mt-1">Teachers: ${rec.teachers.join(', ')}</p>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    } catch (error) {
        return `<div class="text-center py-12 text-red-500">Error loading fairness report: ${error.message}</div>`;
    }
}

async function renderAdminTeacherWorkload() {
    try {
        const workload = await loadTeacherWorkload();
        return `
            <div class="space-y-6 animate-fade-in">
                <h2 class="text-2xl font-bold">Teacher Workload Monitor</h2>
                
                <div class="grid gap-4 md:grid-cols-3">
                    <div class="rounded-xl border bg-card p-6">
                        <p class="text-sm text-muted-foreground">Overworked Teachers</p>
                        <h3 class="text-3xl font-bold text-red-600">${workload?.filter(w => w.status === 'overworked').length || 0}</h3>
                    </div>
                    <div class="rounded-xl border bg-card p-6">
                        <p class="text-sm text-muted-foreground">Balanced Teachers</p>
                        <h3 class="text-3xl font-bold text-green-600">${workload?.filter(w => w.status === 'balanced').length || 0}</h3>
                    </div>
                    <div class="rounded-xl border bg-card p-6">
                        <p class="text-sm text-muted-foreground">Underworked Teachers</p>
                        <h3 class="text-3xl font-bold text-yellow-600">${workload?.filter(w => w.status === 'underworked').length || 0}</h3>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card overflow-hidden">
                    <div class="p-4 border-b">
                        <h3 class="font-semibold">Current Workload Distribution</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead class="bg-muted/50">
                                <tr>
                                    <th class="px-4 py-3 text-left font-medium">Teacher</th>
                                    <th class="px-4 py-3 text-left font-medium">Department</th>
                                    <th class="px-4 py-3 text-center font-medium">Monthly Duties</th>
                                    <th class="px-4 py-3 text-center font-medium">Weekly Duties</th>
                                    <th class="px-4 py-3 text-center font-medium">Reliability</th>
                                    <th class="px-4 py-3 text-center font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                ${workload?.map(teacher => `
                                    <tr class="hover:bg-accent/50 transition-colors">
                                        <td class="px-4 py-3 font-medium">${teacher.teacherName}</td>
                                        <td class="px-4 py-3">${teacher.department}</td>
                                        <td class="px-4 py-3 text-center">${teacher.monthlyDutyCount}</td>
                                        <td class="px-4 py-3 text-center">${teacher.weeklyDutyCount}</td>
                                        <td class="px-4 py-3 text-center">${teacher.reliabilityScore}</td>
                                        <td class="px-4 py-3 text-center">
                                            <span class="px-2 py-1 ${teacher.status === 'overworked' ? 'bg-red-100 text-red-700' : teacher.status === 'underworked' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'} text-xs rounded-full">
                                                ${teacher.status}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                                ${!workload?.length ? '<tr><td colspan="6" class="px-4 py-8 text-center text-muted-foreground">No data available</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        return `<div class="text-center py-12 text-red-500">Error loading workload: ${error.message}</div>`;
    }
}

// ============================================
// CLASS MANAGEMENT - Add to main.js
// ============================================

async function renderClassManagement() {
    try {
        const classes = await loadAllClasses();
        const teachers = await loadAvailableTeachers();
        
        return `
            <div class="space-y-6 animate-fade-in">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold">Class Teacher Assignment</h2>
                    <button onclick="showAddClassModal()" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
                        <i data-lucide="plus" class="h-4 w-4"></i>
                        Add New Class
                    </button>
                </div>
                
                <div class="grid gap-4">
                    ${classes.length > 0 ? classes.map(cls => {
                        const currentTeacher = cls.Teacher?.User?.name || 'Not assigned';
                        return `
                            <div class="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
                                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <h3 class="font-semibold text-lg">${cls.name}</h3>
                                        <p class="text-sm text-muted-foreground">Grade: ${cls.grade} | Stream: ${cls.stream || 'N/A'}</p>
                                        <p class="text-sm mt-1">
                                            <span class="font-medium">Current Teacher:</span> 
                                            <span class="${cls.Teacher ? 'text-green-600' : 'text-yellow-600'}">${currentTeacher}</span>
                                        </p>
                                        <p class="text-xs text-muted-foreground mt-1">${cls.studentCount || 0} students enrolled</p>
                                    </div>
                                    
                                    <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                        <select id="class-teacher-${cls.id}" class="rounded-lg border border-input bg-background px-3 py-2 text-sm min-w-[200px]">
                                            <option value="">-- Select Teacher --</option>
                                            ${teachers.map(t => `
                                                <option value="${t.id}" ${t.id === cls.teacherId ? 'selected' : ''}>
                                                    ${t.User?.name || 'Unknown'} (${t.subjects?.join(', ') || 'No subjects'})
                                                </option>
                                            `).join('')}
                                        </select>
                                        <button onclick="assignClassTeacher('${cls.id}')" 
                                                class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm whitespace-nowrap">
                                            Assign Teacher
                                        </button>
                                        <button onclick="editClassDetails('${cls.id}')" 
                                                class="p-2 border rounded-lg hover:bg-accent">
                                            <i data-lucide="edit" class="h-4 w-4"></i>
                                        </button>
                                        <button onclick="deleteClassItem('${cls.id}')" 
                                                class="p-2 border rounded-lg hover:bg-red-100 text-red-600">
                                            <i data-lucide="trash-2" class="h-4 w-4"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('') : `
                        <div class="text-center py-12 border rounded-lg bg-card">
                            <i data-lucide="school" class="h-12 w-12 mx-auto text-muted-foreground mb-4"></i>
                            <p class="text-muted-foreground">No classes found. Click "Add New Class" to create your first class.</p>
                        </div>
                    `}
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error rendering classes:', error);
        return `<div class="text-center py-12 text-red-500">Error loading classes: ${error.message}</div>`;
    }
}

// Edit class details
window.editClassDetails = async function(classId) {
    const classes = await loadAllClasses();
    const classData = classes.find(c => c.id == classId);
    
    if (!classData) {
        showToast('Class not found', 'error');
        return;
    }
    
    const newName = prompt('Enter new class name:', classData.name);
    if (newName && newName !== classData.name) {
        const newGrade = prompt('Enter new grade:', classData.grade);
        const newStream = prompt('Enter new stream:', classData.stream || '');
        
        showLoading();
        try {
            await api.admin.updateClass(classId, { 
                name: newName, 
                grade: newGrade || classData.grade,
                stream: newStream || classData.stream
            });
            showToast('✅ Class updated successfully', 'success');
            await showDashboardSection('class-management');
        } catch (error) {
            showToast(error.message || 'Failed to update class', 'error');
        } finally {
            hideLoading();
        }
    }
};

// Delete class item
window.deleteClassItem = async function(classId) {
    if (!confirm('⚠️ Are you sure you want to delete this class? This will remove all student associations.')) return;
    
    showLoading();
    try {
        await api.admin.deleteClass(classId);
        showToast('✅ Class deleted successfully', 'success');
        await showDashboardSection('class-management');
    } catch (error) {
        showToast(error.message || 'Failed to delete class', 'error');
    } finally {
        hideLoading();
    }
};

// Show add class modal
window.showAddClassModal = function() {
    const className = prompt('Enter class name (e.g., Form 1A, Grade 10):');
    if (!className) return;
    
    const grade = prompt('Enter grade/level (e.g., 10, Form 1):');
    if (!grade) return;
    
    const stream = prompt('Enter stream (optional, e.g., A, B, Science):', '');
    
    showLoading();
    api.admin.createClass({ name: className, grade, stream })
        .then(() => {
            showToast('✅ Class created successfully', 'success');
            showDashboardSection('class-management');
        })
        .catch(err => {
            showToast(err.message || 'Failed to create class', 'error');
        })
        .finally(() => hideLoading());
};

// ============================================
// CLASS HELPER FUNCTIONS
// ============================================

async function loadAllClasses() {
    try {
        const response = await api.admin.getClasses();
        return response.data || [];
    } catch (error) {
        console.error('Failed to load classes:', error);
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

window.editClass = async function(classId) {
    showToast('Edit class feature coming soon', 'info');
};

window.deleteClass = async function(classId) {
    if (!confirm('⚠️ Are you sure you want to delete this class?')) return;
    
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

window.showAddClassModal = function() {
    const newClassName = prompt('Enter class name:');
    if (!newClassName) return;
    
    const grade = prompt('Enter grade/level (e.g., Grade 10, Form 2):');
    if (!grade) return;
    
    const stream = prompt('Enter stream (optional):', '');
    
    showLoading();
    api.admin.createClass({ name: newClassName, grade, stream })
        .then(() => {
            showToast('✅ Class created successfully', 'success');
            showDashboardSection('classes');
        })
        .catch(err => {
            showToast(err.message || 'Failed to create class', 'error');
        })
        .finally(() => hideLoading());
};

// ============================================
// VIEW STUDENT DETAILS - ADMIN FUNCTION
// ============================================

window.viewStudentDetails = async function(studentId) {
    showLoading();
    try {
        // Get student from the existing list
        const students = await loadAllStudents();
        const student = students.find(s => s.id == studentId);
        
        if (!student) {
            showToast('Student not found', 'error');
            return;
        }
        
        const user = student.User || {};
        const name = user.name || 'Unknown';
        const email = user.email || 'N/A';
        const status = student.status || 'active';
        const grade = student.grade || 'N/A';
        const elimuid = student.elimuid || 'N/A';
        const gender = student.gender || 'Not specified';
        const dob = student.dateOfBirth ? formatDate(student.dateOfBirth) : 'Not specified';
        const enrollmentDate = student.enrollmentDate ? formatDate(student.enrollmentDate) : 'N/A';
        
        // Create modal
        let modal = document.getElementById('student-details-modal');
        if (!modal) {
            createStudentDetailsModal();
            modal = document.getElementById('student-details-modal');
        }
        
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.innerHTML = `
                <div class="space-y-4">
                    <div class="flex items-center gap-4 pb-4 border-b">
                        <div class="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                            ${getInitials(name)}
                        </div>
                        <div>
                            <h4 class="font-bold text-lg">${name}</h4>
                            <p class="text-sm text-muted-foreground">${email}</p>
                            <p class="text-xs text-muted-foreground mt-1">Status: <span class="font-semibold ${status === 'active' ? 'text-green-600' : 'text-red-600'}">${status}</span></p>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div class="p-3 bg-muted/30 rounded-lg">
                            <p class="text-xs text-muted-foreground">ELIMUID</p>
                            <p class="font-mono text-sm font-bold text-primary">${elimuid}</p>
                        </div>
                        <div class="p-3 bg-muted/30 rounded-lg">
                            <p class="text-xs text-muted-foreground">Grade/Class</p>
                            <p class="font-medium">${grade}</p>
                        </div>
                        <div class="p-3 bg-muted/30 rounded-lg">
                            <p class="text-xs text-muted-foreground">Gender</p>
                            <p class="font-medium">${gender}</p>
                        </div>
                        <div class="p-3 bg-muted/30 rounded-lg">
                            <p class="text-xs text-muted-foreground">Date of Birth</p>
                            <p class="font-medium">${dob}</p>
                        </div>
                        <div class="p-3 bg-muted/30 rounded-lg">
                            <p class="text-xs text-muted-foreground">Enrolled</p>
                            <p class="font-medium">${enrollmentDate}</p>
                        </div>
                        <div class="p-3 bg-muted/30 rounded-lg">
                            <p class="text-xs text-muted-foreground">Parent(s)</p>
                            <p class="font-medium">${student.parents?.length || 0} linked</p>
                        </div>
                    </div>
                    
                    <div class="border-t pt-4">
                        <button onclick="copyElimuid('${elimuid}')" class="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2">
                            <i data-lucide="copy" class="h-4 w-4"></i>
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
        
    } catch (error) {
        console.error('Error viewing student:', error);
        showToast('Failed to load student details', 'error');
    } finally {
        hideLoading();
    }
};

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

function closeStudentDetailsModal() {
    const modal = document.getElementById('student-details-modal');
    if (modal) modal.classList.add('hidden');
}

// ============================================
// ENHANCED TEACHER DETAILS VIEW
// ============================================

// View teacher details with enhanced modal
window.viewTeacherDetails = async function(teacherId) {
    showLoading();
    try {
        const teachers = await loadAllTeachers();
        const teacher = teachers.find(t => t.id == teacherId);
        
        if (!teacher) {
            showToast('Teacher not found', 'error');
            return;
        }
        
        showEnhancedTeacherModal(teacher);
    } catch (error) {
        console.error('Error viewing teacher:', error);
        showToast('Failed to load teacher details', 'error');
    } finally {
        hideLoading();
    }
};

// Show enhanced teacher modal
function showEnhancedTeacherModal(teacher) {
    let modal = document.getElementById('enhanced-teacher-modal');
    
    if (!modal) {
        createEnhancedTeacherModal();
        modal = document.getElementById('enhanced-teacher-modal');
    }
    
    const user = teacher.User || {};
    const stats = teacher.statistics || {};
    const dutyPreferences = teacher.dutyPreferences || {};
    const subjects = teacher.subjects || [];
    
    // Calculate reliability score color
    const reliability = stats.reliabilityScore || 100;
    const reliabilityColor = reliability >= 90 ? 'text-green-600' : 
                             reliability >= 70 ? 'text-yellow-600' : 'text-red-600';
    const reliabilityBg = reliability >= 90 ? 'bg-green-100' : 
                          reliability >= 70 ? 'bg-yellow-100' : 'bg-red-100';
    
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.innerHTML = `
            <div class="space-y-6">
                <!-- Header with Profile -->
                <div class="flex items-center gap-6 pb-6 border-b bg-gradient-to-r from-blue-50 to-purple-50 -m-6 p-6 rounded-t-xl">
                    <div class="relative">
                        <div class="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                            ${getInitials(user.name)}
                        </div>
                        <div class="absolute -bottom-2 -right-2 h-8 w-8 rounded-full ${teacher.isActive !== false ? 'bg-green-500' : 'bg-red-500'} border-4 border-white shadow-md"></div>
                    </div>
                    <div class="flex-1">
                        <h2 class="text-2xl font-bold text-gray-800 dark:text-white">${user.name || 'Unknown'}</h2>
                        <div class="flex items-center gap-3 mt-1">
                            <span class="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">${teacher.employeeId || 'No ID'}</span>
                            <span class="px-3 py-1 ${teacher.approvalStatus === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} text-xs rounded-full font-medium">
                                ${teacher.approvalStatus || 'pending'}
                            </span>
                        </div>
                        <p class="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                            <i data-lucide="mail" class="h-4 w-4"></i> ${user.email || 'No email'}
                        </p>
                        ${user.phone ? `<p class="text-sm text-muted-foreground flex items-center gap-2 mt-1"><i data-lucide="phone" class="h-4 w-4"></i> ${user.phone}</p>` : ''}
                    </div>
                    <button onclick="closeTeacherDetailsModal()" class="p-2 hover:bg-white/20 rounded-lg transition-colors">
                        <i data-lucide="x" class="h-5 w-5"></i>
                    </button>
                </div>
                
                <!-- Stats Grid -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                        <i data-lucide="book-open" class="h-6 w-6 mx-auto text-blue-600 mb-2"></i>
                        <p class="text-2xl font-bold text-blue-600">${subjects.length}</p>
                        <p class="text-xs text-muted-foreground">Subjects</p>
                    </div>
                    <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
                        <i data-lucide="check-circle" class="h-6 w-6 mx-auto text-green-600 mb-2"></i>
                        <p class="text-2xl font-bold text-green-600">${stats.dutiesCompleted || 0}</p>
                        <p class="text-xs text-muted-foreground">Duties Completed</p>
                    </div>
                    <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center">
                        <i data-lucide="trending-up" class="h-6 w-6 mx-auto text-purple-600 mb-2"></i>
                        <p class="text-2xl font-bold text-purple-600">${stats.monthlyDutyCount || 0}</p>
                        <p class="text-xs text-muted-foreground">Monthly Duties</p>
                    </div>
                    <div class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-center">
                        <i data-lucide="clock" class="h-6 w-6 mx-auto text-amber-600 mb-2"></i>
                        <p class="text-2xl font-bold text-amber-600">${stats.weeklyDutyCount || 0}</p>
                        <p class="text-xs text-muted-foreground">Weekly Duties</p>
                    </div>
                </div>
                
                <!-- Subjects & Class -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="p-4 bg-muted/30 rounded-xl">
                        <h3 class="font-semibold mb-3 flex items-center gap-2">
                            <i data-lucide="book" class="h-5 w-5 text-primary"></i>
                            Subjects Taught
                        </h3>
                        <div class="flex flex-wrap gap-2">
                            ${subjects.length > 0 ? subjects.map(subject => `
                                <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">${subject}</span>
                            `).join('') : '<p class="text-sm text-muted-foreground">No subjects assigned</p>'}
                        </div>
                    </div>
                    
                    <div class="p-4 bg-muted/30 rounded-xl">
                        <h3 class="font-semibold mb-3 flex items-center gap-2">
                            <i data-lucide="users" class="h-5 w-5 text-primary"></i>
                            Class Teacher
                        </h3>
                        <p class="text-lg font-medium">${teacher.classTeacher || 'Not assigned'}</p>
                        ${teacher.department ? `<p class="text-sm text-muted-foreground mt-1">Department: ${teacher.department}</p>` : ''}
                    </div>
                </div>
                
                <!-- Performance Metrics -->
                <div class="p-4 bg-muted/30 rounded-xl">
                    <h3 class="font-semibold mb-4 flex items-center gap-2">
                        <i data-lucide="activity" class="h-5 w-5 text-primary"></i>
                        Performance Metrics
                    </h3>
                    <div class="space-y-4">
                        <div>
                            <div class="flex justify-between text-sm mb-1">
                                <span>Reliability Score</span>
                                <span class="font-medium ${reliabilityColor}">${reliability}%</span>
                            </div>
                            <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <div class="h-full rounded-full bg-gradient-to-r from-green-500 to-blue-500 transition-all" style="width: ${reliability}%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between text-sm mb-1">
                                <span>Completion Rate</span>
                                <span class="font-medium">${stats.completionRate || 0}%</span>
                            </div>
                            <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <div class="h-full bg-primary rounded-full transition-all" style="width: ${stats.completionRate || 0}%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Duty Preferences -->
                ${Object.keys(dutyPreferences).length > 0 ? `
                <div class="p-4 bg-muted/30 rounded-xl">
                    <h3 class="font-semibold mb-3 flex items-center gap-2">
                        <i data-lucide="settings" class="h-5 w-5 text-primary"></i>
                        Duty Preferences
                    </h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-xs text-muted-foreground">Preferred Days</p>
                            <div class="flex flex-wrap gap-1 mt-1">
                                ${(dutyPreferences.preferredDays || []).map(day => `
                                    <span class="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">${day}</span>
                                `).join('') || '<span class="text-sm">None</span>'}
                            </div>
                        </div>
                        <div>
                            <p class="text-xs text-muted-foreground">Max Duties/Week</p>
                            <p class="font-medium">${dutyPreferences.maxDutiesPerWeek || 3}</p>
                        </div>
                    </div>
                    ${dutyPreferences.blackoutDates?.length > 0 ? `
                    <div class="mt-3">
                        <p class="text-xs text-muted-foreground">Blackout Dates</p>
                        <div class="flex flex-wrap gap-1 mt-1">
                            ${dutyPreferences.blackoutDates.map(date => `
                                <span class="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">${formatDate(date)}</span>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
                </div>
                ` : ''}
                
                <!-- Action Buttons -->
                <div class="flex justify-end gap-3 pt-4 border-t">
                    <button onclick="closeTeacherDetailsModal()" class="px-4 py-2 border rounded-lg hover:bg-accent transition-colors">
                        Close
                    </button>
                    <button onclick="editTeacher('${teacher.id}')" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
                        <i data-lucide="edit" class="h-4 w-4"></i>
                        Edit Teacher
                    </button>
                    ${teacher.isActive !== false ? 
                        `<button onclick="deactivateTeacher('${teacher.id}', '${user.name}')" class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2">
                            <i data-lucide="pause-circle" class="h-4 w-4"></i>
                            Deactivate
                        </button>` : 
                        `<button onclick="activateTeacher('${teacher.id}', '${user.name}')" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2">
                            <i data-lucide="play-circle" class="h-4 w-4"></i>
                            Activate
                        </button>`
                    }
                </div>
            </div>
        `;
    }
    
    modal.classList.remove('hidden');
    
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

// Create enhanced teacher modal
function createEnhancedTeacherModal() {
    const modalHTML = `
        <div id="enhanced-teacher-modal" class="fixed inset-0 z-50 hidden">
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="closeTeacherDetailsModal()"></div>
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl p-4">
                <div class="rounded-2xl border bg-card shadow-2xl animate-fade-in overflow-hidden max-h-[90vh] overflow-y-auto">
                    <div class="modal-content p-6">
                        <!-- Content will be filled dynamically -->
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Close teacher details modal
window.closeTeacherDetailsModal = function() {
    const modal = document.getElementById('enhanced-teacher-modal');
    if (modal) modal.classList.add('hidden');
};

// Edit teacher function
window.editTeacher = async function(teacherId) {
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
        showToast('Failed to load teacher data', 'error');
    } finally {
        hideLoading();
    }
};

// Show edit teacher modal
function showEditTeacherModal(teacher) {
    let modal = document.getElementById('edit-teacher-modal');
    
    if (!modal) {
        createEditTeacherModal();
        modal = document.getElementById('edit-teacher-modal');
    }
    
    const user = teacher.User || {};
    
    document.getElementById('edit-teacher-id').value = teacher.id;
    document.getElementById('edit-teacher-name').value = user.name || '';
    document.getElementById('edit-teacher-email').value = user.email || '';
    document.getElementById('edit-teacher-phone').value = user.phone || '';
    document.getElementById('edit-teacher-subjects').value = (teacher.subjects || []).join(', ');
    document.getElementById('edit-teacher-department').value = teacher.department || 'general';
    document.getElementById('edit-teacher-class').value = teacher.classTeacher || '';
    document.getElementById('edit-teacher-qualification').value = teacher.qualification || '';
    
    modal.classList.remove('hidden');
}

// Create edit teacher modal
function createEditTeacherModal() {
    const modalHTML = `
        <div id="edit-teacher-modal" class="fixed inset-0 z-50 hidden">
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="closeEditTeacherModal()"></div>
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4">
                <div class="rounded-2xl border bg-card shadow-2xl animate-fade-in">
                    <div class="bg-gradient-to-r from-primary/10 to-purple-600/10 px-6 py-4 border-b rounded-t-2xl">
                        <h3 class="text-xl font-semibold">Edit Teacher</h3>
                    </div>
                    <div class="p-6">
                        <input type="hidden" id="edit-teacher-id">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium mb-1">Full Name</label>
                                <input type="text" id="edit-teacher-name" class="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm focus:ring-2 focus:ring-primary transition-all">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Email</label>
                                <input type="email" id="edit-teacher-email" class="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm focus:ring-2 focus:ring-primary transition-all">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Phone</label>
                                <input type="tel" id="edit-teacher-phone" class="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm focus:ring-2 focus:ring-primary transition-all">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Subjects (comma separated)</label>
                                <input type="text" id="edit-teacher-subjects" class="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm focus:ring-2 focus:ring-primary transition-all">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Department</label>
                                <select id="edit-teacher-department" class="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm focus:ring-2 focus:ring-primary transition-all">
                                    <option value="mathematics">Mathematics</option>
                                    <option value="science">Science</option>
                                    <option value="languages">Languages</option>
                                    <option value="humanities">Humanities</option>
                                    <option value="technical">Technical</option>
                                    <option value="sports">Sports</option>
                                    <option value="general">General</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Class Teacher (if applicable)</label>
                                <input type="text" id="edit-teacher-class" placeholder="e.g., Grade 10A" class="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm focus:ring-2 focus:ring-primary transition-all">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Qualification</label>
                                <input type="text" id="edit-teacher-qualification" class="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm focus:ring-2 focus:ring-primary transition-all">
                            </div>
                        </div>
                        <div class="flex justify-end gap-3 mt-6">
                            <button onclick="closeEditTeacherModal()" class="px-4 py-2 border rounded-lg hover:bg-accent transition-colors">Cancel</button>
                            <button onclick="handleUpdateTeacher()" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">Update Teacher</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Close edit teacher modal
window.closeEditTeacherModal = function() {
    const modal = document.getElementById('edit-teacher-modal');
    if (modal) modal.classList.add('hidden');
};

// Handle update teacher
window.handleUpdateTeacher = async function() {
    const teacherId = document.getElementById('edit-teacher-id')?.value;
    const name = document.getElementById('edit-teacher-name')?.value;
    const email = document.getElementById('edit-teacher-email')?.value;
    const phone = document.getElementById('edit-teacher-phone')?.value;
    const subjects = document.getElementById('edit-teacher-subjects')?.value;
    const department = document.getElementById('edit-teacher-department')?.value;
    const classTeacher = document.getElementById('edit-teacher-class')?.value;
    const qualification = document.getElementById('edit-teacher-qualification')?.value;
    
    if (!teacherId) {
        showToast('Teacher ID not found', 'error');
        return;
    }
    
    showLoading();
    try {
        // Update teacher via API
        const response = await api.admin.updateTeacher(teacherId, {
            name,
            email,
            phone,
            subjects: subjects ? subjects.split(',').map(s => s.trim()) : [],
            department,
            classTeacher,
            qualification
        });
        
        if (response.success) {
            showToast('✅ Teacher updated successfully', 'success');
            closeEditTeacherModal();
            await refreshTeachersList();
        }
    } catch (error) {
        showToast(error.message || 'Failed to update teacher', 'error');
    } finally {
        hideLoading();
    }
};

// ============================================
// SETTINGS SECTION
// ============================================

function renderAdminSettings() {
    const curriculum = schoolSettings.curriculum || 'cbc';
    const schoolLevel = schoolSettings.schoolLevel || 'secondary';
    const curriculumInfo = CURRICULUMS[curriculum];
    const levelInfo = curriculumInfo?.levels[schoolLevel] || [];
    const subjectInfo = curriculumInfo?.subjects[schoolLevel] || [];
    
    return `
        <div class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-bold">School Settings</h2>
            <p class="text-sm text-muted-foreground">Changes made here will reflect across all dashboards for this school.</p>
            
            <div class="grid gap-6">
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">School Information</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">School Name</label>
                            <input type="text" id="settings-school-name" value="${schoolSettings.schoolName || ''}" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">School Level</label>
                            <select id="settings-school-level" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                                <option value="primary" ${schoolLevel === 'primary' ? 'selected' : ''}>Primary</option>
                                <option value="secondary" ${schoolLevel === 'secondary' ? 'selected' : ''}>Secondary</option>
                                <option value="both" ${schoolLevel === 'both' ? 'selected' : ''}>Both</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Curriculum Settings</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Select Curriculum</label>
                            <select id="settings-curriculum" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                                <option value="cbc" ${curriculum === 'cbc' ? 'selected' : ''}>CBC</option>
                                <option value="844" ${curriculum === '844' ? 'selected' : ''}>8-4-4</option>
                                <option value="british" ${curriculum === 'british' ? 'selected' : ''}>British</option>
                                <option value="american" ${curriculum === 'american' ? 'selected' : ''}>American</option>
                            </select>
                        </div>
                        
                        <div class="p-4 bg-muted/30 rounded-lg">
                            <h4 class="font-sm font-medium mb-2">Curriculum Information</h4>
                            <p class="text-sm text-muted-foreground"><span class="font-medium">Name:</span> ${curriculumInfo?.name || 'N/A'}</p>
                            <p class="text-sm text-muted-foreground mt-1"><span class="font-medium">Grade Levels:</span> ${levelInfo.join(', ')}</p>
                            <p class="text-sm text-muted-foreground mt-1"><span class="font-medium">Core Subjects:</span> ${subjectInfo.join(', ')}</p>
                        </div>
                    </div>
                </div>
                
                <div class="flex justify-end">
                    <button onclick="saveAllSettings()" class="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// CUSTOM SUBJECTS SECTION
// ============================================

function renderAdminCustomSubjects() {
    const curriculum = schoolSettings.curriculum || 'cbc';
    const schoolLevel = schoolSettings.schoolLevel || 'secondary';
    const curriculumInfo = CURRICULUMS[curriculum];
    const subjectInfo = curriculumInfo?.subjects[schoolLevel] || [];
    
    return `
        <div class="space-y-6 animate-fade-in">
            <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold">Custom Subjects</h2>
            </div>
            <p class="text-sm text-muted-foreground">Add subjects that are not in the standard curriculum</p>
            
            <div class="rounded-xl border bg-card p-6">
                <div class="space-y-4">
                    <div class="flex gap-2">
                        <input type="text" id="new-subject-name" placeholder="e.g., French, Computer Science, Art" class="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        <button onclick="addCustomSubject()" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                            Add Subject
                        </button>
                    </div>
                    
                    <div>
                        <h4 class="text-sm font-medium mb-3">Curriculum Subjects</h4>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6" id="curriculum-subjects-container">
                            ${subjectInfo.map(subject => `
                                <div class="flex items-center justify-between p-3 bg-muted/30 dark:bg-muted/20 rounded-lg border border-border">
                                    <span class="text-sm font-medium text-foreground">${subject}</span>
                                    <span class="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">core</span>
                                </div>
                            `).join('')}
                        </div>
                        
                        <h4 class="text-sm font-medium mb-3">Custom Subjects</h4>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-3" id="custom-subjects-container">
                            ${customSubjects && customSubjects.length > 0 ? 
                                customSubjects.map(subject => `
                                    <div class="custom-subject-item flex items-center justify-between p-3 bg-secondary/30 dark:bg-secondary/20 rounded-lg border border-border group hover:bg-secondary/50 dark:hover:bg-secondary/30 transition-colors" data-subject="${subject}">
                                        <span class="text-sm font-medium text-foreground">${subject}</span>
                                        <button onclick="removeCustomSubject('${subject}')" class="text-destructive hover:text-destructive/80 dark:text-red-400 dark:hover:text-red-300 opacity-70 hover:opacity-100 transition-opacity">
                                            <i data-lucide="x" class="h-4 w-4"></i>
                                        </button>
                                    </div>
                                `).join('') 
                                : '<p class="text-sm text-muted-foreground col-span-3 py-4 text-center bg-muted/30 rounded-lg" id="no-custom-subjects-message">No custom subjects added yet</p>'
                            }
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="flex justify-end">
                <button onclick="saveAllSettings()" class="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
                    <i data-lucide="save" class="h-4 w-4"></i>
                    Save Changes
                </button>
            </div>
        </div>
    `;
}

// ============================================
// ATTENDANCE SECTION
// ============================================

function renderAdminAttendance() {
    return `
        <div class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-bold">Attendance Management</h2>
            <div class="rounded-xl border bg-card p-6">
                <p class="text-center text-muted-foreground">Attendance feature coming soon</p>
            </div>
        </div>
    `;
}

// ============================================
// GRADES SECTION
// ============================================

function renderAdminGrades() {
    return `
        <div class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-bold">Grade Management</h2>
            <div class="rounded-xl border bg-card p-6">
                <p class="text-center text-muted-foreground">Grades feature coming soon</p>
            </div>
        </div>
    `;
}

// ============================================
// ANALYTICS SECTION
// ============================================

function renderAdminAnalytics() {
    return `
        <div class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-bold">Analytics</h2>
            <div class="rounded-xl border bg-card p-6">
                <p class="text-center text-muted-foreground">Analytics feature coming soon</p>
            </div>
        </div>
    `;
}

// ============================================
// TASKS SECTION
// ============================================

function renderAdminTasks() {
    return `
        <div class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-bold">My Tasks</h2>
            <div class="rounded-xl border bg-card p-6">
                <p class="text-center text-muted-foreground">Tasks feature coming soon</p>
            </div>
        </div>
    `;
}

// ============================================
// TIMETABLE SECTION
// ============================================

function renderAdminTimetable() {
    return `
        <div class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-bold">Timetable</h2>
            <div class="rounded-xl border bg-card p-6">
                <p class="text-center text-muted-foreground">Timetable feature coming soon</p>
            </div>
        </div>
    `;
}

// ============================================
// STUDENT SUSPEND/REACTIVATE FUNCTIONS
// ============================================

// Replace refreshAdminStudentList with refreshStudentsList
window.suspendStudent = async function(studentId, studentName) {
    const reason = prompt(`Enter reason for suspending ${studentName}:`);
    if (!reason) return;
    
    if (!confirm(`⚠️ Are you sure you want to suspend ${studentName}?`)) return;
    
    showLoading();
    try {
        const response = await api.admin.suspendStudent(studentId, { reason });
        
        if (response.success) {
            showToast(`✅ ${studentName} suspended successfully`, 'success');
            if (currentSection === 'students') {
                await showDashboardSection('students');
            } else {
                await refreshStudentsList(); // FIXED: was refreshAdminStudentList
            }
        }
    } catch (error) {
        showToast(error.message || 'Failed to suspend student', 'error');
    } finally {
        hideLoading();
    }
};

window.reactivateStudent = async function(studentId, studentName) {
    if (!confirm(`Reactivate ${studentName}?`)) return;
    
    showLoading();
    try {
        const response = await api.admin.reactivateStudent(studentId);
        
        if (response.success) {
            showToast(`✅ ${studentName} reactivated successfully`, 'success');
            if (currentSection === 'students') {
                await showDashboardSection('students');
            } else {
                await refreshStudentsList(); // FIXED: was refreshAdminStudentList
            }
        }
    } catch (error) {
        showToast(error.message || 'Failed to reactivate student', 'error');
    } finally {
        hideLoading();
    }
};

window.deleteStudent = async function(studentId, studentName) {
    if (!confirm(`⚠️ Are you sure you want to permanently delete ${studentName}? This action cannot be undone.`)) return;
    
    const confirmText = prompt('Type "DELETE" to confirm:');
    if (confirmText !== 'DELETE') {
        showToast('Cancelled', 'info');
        return;
    }
    
    showLoading();
    try {
        const response = await api.admin.deleteStudent(studentId);
        
        if (response.success) {
            showToast(`✅ ${studentName} deleted`, 'success');
            if (currentSection === 'students') {
                await showDashboardSection('students');
            } else {
                await refreshStudentsList(); // FIXED: was refreshAdminStudentList
            }
        }
    } catch (error) {
        showToast(error.message || 'Failed to delete student', 'error');
    } finally {
        hideLoading();
    }
};

// ============================================
// DUTY ROSTER GENERATION FUNCTIONS
// ============================================

window.handleGenerateDutyRoster = async function() {
    const startDate = document.getElementById('duty-start-date')?.value;
    const endDate = document.getElementById('duty-end-date')?.value;
    
    if (!startDate || !endDate) {
        showToast('Please select start and end dates', 'error');
        return;
    }
    
    showLoading();
    try {
        const response = await api.admin.generateDutyRoster(startDate, endDate);
        
        if (response.success) {
            showToast(`✅ Generated ${response.data.rosters?.length || 0} duty rosters`, 'success');
            
            if (response.data.understaffed?.length > 0) {
                showToast(`⚠️ ${response.data.understaffed.length} understaffed slots detected`, 'warning');
            }
            
            await showDashboardSection('duty');
        }
    } catch (error) {
        showToast(error.message || 'Failed to generate duty roster', 'error');
    } finally {
        hideLoading();
    }
};

window.generateDutyRoster = window.handleGenerateDutyRoster;
// ============ TEACHER SECTIONS ============

async function renderTeacherSection(section) {
    switch(section) {
        case 'dashboard':
            return renderTeacherDashboard();
        case 'students':
            return await renderTeacherStudents();
        case 'attendance':
            return await renderTeacherAttendance();
        case 'grades':
            return await renderTeacherGrades();
        case 'tasks':
            return renderTeacherTasks();
        case 'duty':
            return await renderTeacherDuty();
        case 'duty-preferences':
            return renderTeacherDutyPreferences();
        case 'chat':
            return renderTeacherChat();
        case 'settings':
            return renderUserSettings('teacher');
        default:
            return renderTeacherDashboard();
    }
}

function renderTeacherDashboard() {
    const data = dashboardData || {};
    const user = getCurrentUser();
    
    return `
        <div class="space-y-6 animate-fade-in">
            <!-- Stats Grid -->
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div class="rounded-xl border bg-card p-6 card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">My Students</p>
                            <h3 class="text-2xl font-bold mt-1">${data.students?.length || 0}</h3>
                            <p class="text-xs text-muted-foreground mt-1">Enrolled students</p>
                        </div>
                        <div class="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                            <i data-lucide="users" class="h-6 w-6 text-blue-600"></i>
                        </div>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6 card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Class Average</p>
                            <h3 class="text-2xl font-bold mt-1">78.5%</h3>
                            <p class="text-xs text-green-600 mt-1 flex items-center gap-1">
                                <i data-lucide="trending-up" class="h-3 w-3"></i>
                                This term
                            </p>
                        </div>
                        <div class="h-12 w-12 rounded-lg bg-violet-100 flex items-center justify-center">
                            <i data-lucide="trending-up" class="h-6 w-6 text-violet-600"></i>
                        </div>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6 card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Attendance Today</p>
                            <h3 class="text-2xl font-bold mt-1">0/0</h3>
                            <p class="text-xs text-yellow-600 mt-1 flex items-center gap-1">
                                <i data-lucide="alert-circle" class="h-3 w-3"></i>
                                Not taken yet
                            </p>
                        </div>
                        <div class="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center">
                            <i data-lucide="calendar-check" class="h-6 w-6 text-amber-600"></i>
                        </div>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6 card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Pending Tasks</p>
                            <h3 class="text-2xl font-bold mt-1">5</h3>
                            <p class="text-xs text-red-600 mt-1 flex items-center gap-1">
                                <i data-lucide="clock" class="h-3 w-3"></i>
                                To complete
                            </p>
                        </div>
                        <div class="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                            <i data-lucide="check-square" class="h-6 w-6 text-red-600"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Parent Messages Inbox -->
            <div class="rounded-xl border bg-card p-6">
                <div class="flex justify-between items-center mb-4">
                    <div class="flex items-center gap-2">
                        <i data-lucide="message-circle" class="h-5 w-5 text-primary"></i>
                        <h3 class="font-semibold text-lg">Parent Messages</h3>
                    </div>
                    <span class="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium" id="teacher-message-count-badge">0</span>
                </div>
                
                <div id="teacher-messages-list" class="space-y-2 max-h-96 overflow-y-auto">
                    <div class="text-center text-muted-foreground py-8">
                        <i data-lucide="message-circle" class="h-12 w-12 mx-auto mb-3 opacity-50"></i>
                        <p>Loading messages...</p>
                    </div>
                </div>
                
                <button onclick="loadTeacherMessages()" class="mt-4 w-full py-2 text-sm border rounded-lg hover:bg-accent flex items-center justify-center gap-2 transition-colors">
                    <i data-lucide="refresh-cw" class="h-4 w-4"></i>
                    Refresh Messages
                </button>
            </div>
            
            <!-- Quick Actions -->
            <div class="grid gap-4 md:grid-cols-3">
                <button onclick="showDashboardSection('attendance')" class="p-4 border rounded-lg hover:bg-accent transition-colors text-left">
                    <i data-lucide="calendar-check" class="h-6 w-6 text-blue-600 mb-2"></i>
                    <p class="font-medium">Take Attendance</p>
                    <p class="text-xs text-muted-foreground">Mark today's attendance</p>
                </button>
                <button onclick="showDashboardSection('grades')" class="p-4 border rounded-lg hover:bg-accent transition-colors text-left">
                    <i data-lucide="trending-up" class="h-6 w-6 text-green-600 mb-2"></i>
                    <p class="font-medium">Enter Marks</p>
                    <p class="text-xs text-muted-foreground">Record exam results</p>
                </button>
                <button onclick="showDashboardSection('students')" class="p-4 border rounded-lg hover:bg-accent transition-colors text-left">
                    <i data-lucide="users" class="h-6 w-6 text-purple-600 mb-2"></i>
                    <p class="font-medium">Manage Students</p>
                    <p class="text-xs text-muted-foreground">Add or view students</p>
                </button>
            </div>
            
            <!-- Duty Card -->
            <div class="rounded-xl border bg-card p-6" id="duty-card">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="font-semibold">Today's Duty</h3>
                        <p class="text-sm text-muted-foreground" id="duty-location">${data.todayDuty?.duties?.find(d => d.teacherId === user?.id)?.area || 'No duty today'}</p>
                    </div>
                    <span class="duty-status px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full" id="duty-status">Not Checked In</span>
                </div>
                <div class="mt-4 flex gap-3">
                    <button onclick="handleCheckIn()" class="flex-1 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90" id="check-in-btn">
                        <i data-lucide="log-in" class="inline h-4 w-4 mr-2"></i>
                        Check In
                    </button>
                    <button onclick="handleCheckOut()" class="flex-1 border border-input bg-background py-2 rounded-lg hover:bg-accent" id="check-out-btn" disabled>
                        <i data-lucide="log-out" class="inline h-4 w-4 mr-2"></i>
                        Check Out
                    </button>
                </div>
                <div class="mt-3 text-xs text-muted-foreground" id="duty-rating">
                    Last duty rating: <span id="last-rating">4.5</span>/5
                </div>
            </div>
        </div>
    `;
}

// Load teacher messages
async function loadTeacherMessages() {
    try {
        const response = await api.teacher.getConversations();
        const conversations = response.data || [];
        
        const container = document.getElementById('teacher-messages-list');
        const badge = document.getElementById('teacher-message-count-badge');
        
        if (!container) return;
        
        let totalUnread = 0;
        let html = '';
        
        if (conversations.length === 0) {
            html = `
                <div class="text-center text-muted-foreground py-8">
                    <i data-lucide="message-circle" class="h-12 w-12 mx-auto mb-3 opacity-50"></i>
                    <p>No messages from parents yet</p>
                </div>
            `;
        } else {
            conversations.forEach(conv => {
                totalUnread += conv.unreadCount;
                
                html += `
                    <div class="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-all 
                              ${conv.unreadCount > 0 ? 'bg-primary/5 border-primary' : ''}"
                         onclick="openTeacherConversation('${conv.userId}')">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="font-medium">${conv.userName || 'Parent'}</p>
                                <p class="text-xs text-muted-foreground">
                                    ${conv.studentName ? `about ${conv.studentName} (Grade ${conv.studentGrade})` : ''}
                                </p>
                                <p class="text-sm mt-1">${conv.lastMessage?.substring(0, 50) || ''}${conv.lastMessage?.length > 50 ? '...' : ''}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-xs text-muted-foreground">${timeAgo(conv.lastMessageTime)}</p>
                                ${conv.unreadCount > 0 ? 
                                    `<span class="bg-red-500 text-white text-xs rounded-full px-2 py-1 mt-1 inline-block">${conv.unreadCount}</span>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        
        if (badge) {
            badge.textContent = totalUnread;
            if (totalUnread > 0) badge.classList.remove('hidden');
        }
        
        container.innerHTML = html;
        
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
        
    } catch (error) {
        console.error('Load messages error:', error);
        const container = document.getElementById('teacher-messages-list');
        if (container) {
            container.innerHTML = `
                <div class="text-center text-red-500 py-8">
                    <i data-lucide="alert-circle" class="h-12 w-12 mx-auto mb-3"></i>
                    <p>Failed to load messages</p>
                </div>
            `;
        }
    }
}

// Open teacher conversation
window.openTeacherConversation = async function(otherUserId) {
    try {
        showLoading();
        const response = await api.teacher.getMessages(otherUserId);
        const messages = response.data || [];
        
        // Create and show conversation modal
        showTeacherConversationModal(messages, otherUserId);
        
        // Refresh message list
        await loadTeacherMessages();
        
    } catch (error) {
        console.error('Open conversation error:', error);
        showToast('Failed to load conversation', 'error');
    } finally {
        hideLoading();
    }
};

// Show teacher conversation modal
function showTeacherConversationModal(messages, otherUserId) {
    let modal = document.getElementById('teacher-conversation-modal');
    
    if (!modal) {
        createTeacherConversationModal();
        modal = document.getElementById('teacher-conversation-modal');
    }
    
    let messagesHTML = '';
    messages.forEach(msg => {
        const isSent = msg.senderId === getCurrentUser()?.id;
        
        messagesHTML += `
            <div class="flex ${isSent ? 'justify-end' : 'justify-start'}">
                <div class="${isSent ? 'chat-bubble-sent' : 'chat-bubble-received'} max-w-[70%]">
                    ${!isSent ? `<p class="text-sm font-medium">${msg.Sender?.name || 'Parent'}</p>` : ''}
                    <p class="text-sm">${msg.content}</p>
                    <p class="text-xs text-muted-foreground mt-1">${timeAgo(msg.createdAt)}</p>
                </div>
            </div>
        `;
    });
    
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.innerHTML = `
            <div class="space-y-4">
                <div class="flex justify-between items-center border-b pb-2">
                    <h4 class="font-semibold">Conversation with Parent</h4>
                    <button onclick="closeTeacherConversationModal()" class="p-1 hover:bg-accent rounded">
                        <i data-lucide="x" class="h-5 w-5"></i>
                    </button>
                </div>
                
                <div class="space-y-4 max-h-96 overflow-y-auto p-2" id="conversation-messages">
                    ${messagesHTML || '<p class="text-center text-muted-foreground py-8">No messages</p>'}
                </div>
                
                <div class="flex gap-2 pt-2 border-t">
                    <input type="text" id="teacher-reply-input" placeholder="Type your reply..." 
                           class="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm">
                    <button onclick="sendTeacherReply('${otherUserId}')" 
                            class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                        <i data-lucide="send" class="h-4 w-4"></i>
                    </button>
                </div>
            </div>
        `;
    }
    
    modal.classList.remove('hidden');
    
    setTimeout(() => {
        const messagesDiv = document.getElementById('conversation-messages');
        if (messagesDiv) messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }, 100);
    
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

// Create teacher conversation modal
function createTeacherConversationModal() {
    const modalHTML = `
        <div id="teacher-conversation-modal" class="fixed inset-0 z-50 hidden">
            <div class="absolute inset-0 bg-black/50" onclick="closeTeacherConversationModal()"></div>
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

// Close teacher conversation modal
window.closeTeacherConversationModal = function() {
    const modal = document.getElementById('teacher-conversation-modal');
    if (modal) modal.classList.add('hidden');
};

// Send teacher reply
window.sendTeacherReply = async function(parentId) {
    const replyInput = document.getElementById('teacher-reply-input');
    const message = replyInput?.value.trim();
    
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
            replyInput.value = '';
            
            const container = document.getElementById('conversation-messages');
            container.innerHTML += `
                <div class="flex justify-end">
                    <div class="chat-bubble-sent max-w-[70%]">
                        <p class="text-sm font-medium">You</p>
                        <p class="text-sm">${message}</p>
                        <p class="text-xs text-muted-foreground mt-1">just now</p>
                    </div>
                </div>
            `;
            container.scrollTop = container.scrollHeight;
            
            showToast('✅ Reply sent', 'success');
        }
    } catch (error) {
        console.error('Reply error:', error);
        showToast(error.message || 'Failed to send reply', 'error');
    } finally {
        hideLoading();
    }
};

// Auto-load messages when page loads
// Replace this line (around 3774):
// setTimeout(loadTeacherMessages, 1000);

// With this:
setTimeout(() => {
    // Only load teacher messages if user is actually logged in as teacher
    const user = getCurrentUser();
    if (user && user.role === 'teacher' && typeof loadTeacherMessages === 'function') {
        loadTeacherMessages();
    }
}, 1000);

async function renderTeacherStudents() {
    try {
        const students = await loadMyStudents();
        const curriculum = schoolSettings.curriculum || 'cbc';
        const schoolLevel = schoolSettings.schoolLevel || 'secondary';
        const curriculumInfo = CURRICULUMS[curriculum];
        const subjectInfo = curriculumInfo?.subjects[schoolLevel] || [];
        const allSubjects = [...subjectInfo, ...(customSubjects || [])];
        
        return `
            <div class="space-y-6 animate-fade-in">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold">My Students</h2>
                    <button onclick="showAddStudentModal()" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
                        <i data-lucide="plus" class="h-4 w-4"></i>
                        Add Student
                    </button>
                </div>
                
                <div class="rounded-xl border bg-card overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead class="bg-muted/50">
                                <tr>
                                    <th class="px-4 py-3 text-left font-medium">Student</th>
                                    <th class="px-4 py-3 text-left font-medium">Class</th>
                                    <th class="px-4 py-3 text-left font-medium">ELIMUID</th>
                                    <th class="px-4 py-3 text-left font-medium">Attendance</th>
                                    <th class="px-4 py-3 text-left font-medium">Average</th>
                                    <th class="px-4 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y" id="my-students-table">
                                ${students.map(student => `
                                    <tr class="hover:bg-accent/50 transition-colors">
                                        <td class="px-4 py-3">
                                            <div class="flex items-center gap-3">
                                                <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <span class="font-medium text-blue-700 text-sm">${getInitials(student.User?.name)}</span>
                                                </div>
                                                <span class="font-medium">${student.User?.name}</span>
                                            </div>
                                        </td>
                                        <td class="px-4 py-3">Grade ${student.grade}</td>
                                        <td class="px-4 py-3">
                                            <span class="font-mono text-xs bg-muted px-2 py-1 rounded">${student.elimuid}</span>
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
                                            <button onclick="copyElimuid('${student.elimuid}')" class="p-2 hover:bg-accent rounded-lg">
                                                <i data-lucide="copy" class="h-4 w-4"></i>
                                            </button>
                                            <button onclick="viewStudentDetails('${student.id}')" class="p-2 hover:bg-accent rounded-lg">
                                                <i data-lucide="eye" class="h-4 w-4"></i>
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                                ${students.length === 0 ? '<tr><td colspan="6" class="px-4 py-8 text-center text-muted-foreground">No students yet. Click "Add Student" to get started.</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">CSV Bulk Upload</h3>
                    <div id="csv-drop-zone" class="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                        <i data-lucide="upload" class="h-10 w-10 mx-auto text-muted-foreground"></i>
                        <p class="text-sm mt-2">Drag & drop CSV file or click to browse</p>
                        <p class="text-xs text-muted-foreground mt-1">Analytics engine will process automatically</p>
                        <input type="file" id="csv-file-input" accept=".csv" class="hidden">
                    </div>
                    <div id="upload-progress-container" class="mt-3 hidden">
                        <div class="w-full bg-muted rounded-full h-2">
                            <div id="upload-progress" class="bg-primary h-2 rounded-full" style="width: 0%"></div>
                        </div>
                        <p id="upload-progress-text" class="text-xs text-center mt-1">0%</p>
                    </div>
                    <button onclick="downloadTemplate('students')" class="mt-4 text-sm text-primary hover:underline flex items-center gap-1">
                        <i data-lucide="download" class="h-4 w-4"></i>
                        Download CSV Template
                    </button>
                </div>
            </div>
        `;
    } catch (error) {
        return `<div class="text-center py-12 text-red-500">Error loading students: ${error.message}</div>`;
    }
}

async function renderTeacherAttendance() {
    try {
        const students = await loadMyStudents();
        
        return `
            <div class="space-y-6 animate-fade-in">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold">Take Attendance</h2>
                    <div class="flex items-center gap-4">
                        <select id="attendance-class" class="px-3 py-2 border rounded-lg bg-background">
                            <option value="">All Classes</option>
                            <option value="10A">Class 10A</option>
                            <option value="10B">Class 10B</option>
                        </select>
                        <span class="text-sm font-medium">${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card overflow-hidden">
                    <div class="p-4 border-b bg-muted/30 flex justify-between items-center">
                        <div class="flex items-center gap-4">
                            <span class="flex items-center gap-2"><span class="h-3 w-3 bg-green-500 rounded-full"></span> Present</span>
                            <span class="flex items-center gap-2"><span class="h-3 w-3 bg-red-500 rounded-full"></span> Absent</span>
                            <span class="flex items-center gap-2"><span class="h-3 w-3 bg-yellow-500 rounded-full"></span> Late</span>
                        </div>
                        <button onclick="saveAttendance()" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Save Attendance</button>
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead class="bg-muted/50">
                                <tr>
                                    <th class="px-4 py-3 text-left font-medium">Student</th>
                                    <th class="px-4 py-3 text-left font-medium">ELIMUID</th>
                                    <th class="px-4 py-3 text-center font-medium">Status</th>
                                    <th class="px-4 py-3 text-left font-medium">Notes</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                ${students.map(student => `
                                    <tr class="hover:bg-accent/50 transition-colors" data-student-id="${student.id}">
                                        <td class="px-4 py-3">
                                            <div class="flex items-center gap-3">
                                                <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <span class="font-medium text-blue-700 text-sm">${getInitials(student.User?.name)}</span>
                                                </div>
                                                <span class="font-medium">${student.User?.name}</span>
                                            </div>
                                        </td>
                                        <td class="px-4 py-3">
                                            <span class="font-mono text-xs bg-muted px-2 py-1 rounded">${student.elimuid}</span>
                                        </td>
                                        <td class="px-4 py-3 text-center">
                                            <select class="attendance-status rounded-lg border border-input bg-background px-3 py-1 text-sm">
                                                <option value="present" selected>Present</option>
                                                <option value="absent">Absent</option>
                                                <option value="late">Late</option>
                                                <option value="sick">Sick</option>
                                                <option value="holiday">Holiday</option>
                                            </select>
                                        </td>
                                        <td class="px-4 py-3">
                                            <input type="text" class="attendance-note w-full rounded border-0 bg-transparent text-sm focus:ring-0" placeholder="Add note...">
                                        </td>
                                    </tr>
                                `).join('')}
                                ${students.length === 0 ? '<tr><td colspan="4" class="px-4 py-8 text-center text-muted-foreground">No students found</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        return `<div class="text-center py-12 text-red-500">Error loading attendance: ${error.message}</div>`;
    }
}

async function renderTeacherGrades() {
    try {
        const students = await loadMyStudents();
        const curriculum = schoolSettings.curriculum || 'cbc';
        const schoolLevel = schoolSettings.schoolLevel || 'secondary';
        const curriculumInfo = CURRICULUMS[curriculum];
        const subjectInfo = curriculumInfo?.subjects[schoolLevel] || [];
        const allSubjects = [...subjectInfo, ...(customSubjects || [])];
        
        return `
            <div class="space-y-6 animate-fade-in">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold">Grade Management</h2>
                    <div class="flex gap-2">
                        <select id="grade-class" class="px-3 py-2 border rounded-lg bg-background">
                            <option value="">All Classes</option>
                            <option value="10A">Class 10A</option>
                            <option value="10B">Class 10B</option>
                        </select>
                        <select id="grade-subject" class="px-3 py-2 border rounded-lg bg-background">
                            ${allSubjects.map(subject => `<option value="${subject}">${subject}</option>`).join('')}
                        </select>
                        <select id="grade-type" class="px-3 py-2 border rounded-lg bg-background">
                            <option value="test">Test</option>
                            <option value="exam">Exam</option>
                            <option value="assignment">Assignment</option>
                            <option value="project">Project</option>
                            <option value="quiz">Quiz</option>
                        </select>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead class="bg-muted/50">
                                <tr>
                                    <th class="px-4 py-3 text-left font-medium">Student</th>
                                    <th class="px-4 py-3 text-left font-medium">ELIMUID</th>
                                    <th class="px-4 py-3 text-center font-medium">Score</th>
                                    <th class="px-4 py-3 text-center font-medium">Grade</th>
                                    <th class="px-4 py-3 text-left font-medium">Comments</th>
                                    <th class="px-4 py-3 text-center font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y" id="grades-table-body">
                                ${students.map(student => {
                                    const gradeInfo = getGradeFromScore(0, curriculum, schoolLevel);
                                    return `
                                        <tr class="hover:bg-accent/50 transition-colors" data-student-id="${student.id}">
                                            <td class="px-4 py-3">
                                                <div class="flex items-center gap-3">
                                                    <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <span class="font-medium text-blue-700 text-sm">${getInitials(student.User?.name)}</span>
                                                    </div>
                                                    <span class="font-medium">${student.User?.name}</span>
                                                </div>
                                            </td>
                                            <td class="px-4 py-3">
                                                <span class="font-mono text-xs bg-muted px-2 py-1 rounded">${student.elimuid}</span>
                                            </td>
                                            <td class="px-4 py-3 text-center">
                                                <input type="number" class="student-score w-20 rounded-lg border border-input bg-background px-2 py-1 text-sm text-center" min="0" max="100" onchange="updateGradeDisplay(this, '${curriculum}', '${schoolLevel}')">
                                            </td>
                                            <td class="px-4 py-3 text-center">
                                                <span class="student-grade px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">-</span>
                                            </td>
                                            <td class="px-4 py-3">
                                                <input type="text" class="student-comment w-full rounded border-0 bg-transparent text-sm focus:ring-0" placeholder="Add comment...">
                                            </td>
                                            <td class="px-4 py-3 text-center">
                                                <button onclick="saveStudentGrade(this)" class="px-3 py-1 bg-primary text-primary-foreground text-xs rounded-lg">Save</button>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                                ${students.length === 0 ? '<tr><td colspan="6" class="px-4 py-8 text-center text-muted-foreground">No students found</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        return `<div class="text-center py-12 text-red-500">Error loading grades: ${error.message}</div>`;
    }
}

function renderTeacherTasks() {
    return `
        <div class="space-y-6 animate-fade-in">
            <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold">My Tasks</h2>
                <button onclick="addTeacherTask()" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
                    <i data-lucide="plus" class="h-4 w-4"></i>
                    New Task
                </button>
            </div>
            
            <div class="grid gap-4 md:grid-cols-2">
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Pending Tasks</h3>
                    <div class="space-y-2">
                        <div class="flex items-center gap-3 p-3 hover:bg-accent/50 rounded-lg">
                            <input type="checkbox" class="rounded">
                            <div class="flex-1">
                                <p class="font-medium">Grade Mathematics exams</p>
                                <p class="text-sm text-muted-foreground">Due: ${formatDate(new Date(Date.now() + 2*24*60*60*1000))}</p>
                            </div>
                            <span class="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Urgent</span>
                        </div>
                        <div class="flex items-center gap-3 p-3 hover:bg-accent/50 rounded-lg">
                            <input type="checkbox" class="rounded">
                            <div class="flex-1">
                                <p class="font-medium">Prepare lesson plan</p>
                                <p class="text-sm text-muted-foreground">Due: ${formatDate(new Date(Date.now() + 5*24*60*60*1000))}</p>
                            </div>
                            <span class="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">High</span>
                        </div>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Completed Tasks</h3>
                    <div class="space-y-2">
                        <div class="flex items-center gap-3 p-3 hover:bg-accent/50 rounded-lg">
                            <input type="checkbox" class="rounded" checked disabled>
                            <div class="flex-1">
                                <p class="font-medium line-through text-muted-foreground">Update gradebook</p>
                                <p class="text-sm text-muted-foreground">Completed ${formatDate(new Date(Date.now() - 1*24*60*60*1000))}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function renderTeacherDuty() {
    try {
        const todayDuty = await loadTodayDuty();
        const weeklyDuty = await loadWeeklyDuty();
        const user = getCurrentUser();
        
        return `
            <div class="space-y-6 animate-fade-in">
                <h2 class="text-2xl font-bold">My Duty Schedule</h2>
                
                <div class="grid gap-4 md:grid-cols-2">
                    <div class="rounded-xl border bg-card p-6">
                        <h3 class="font-semibold mb-4">This Week's Duty</h3>
                        <div class="space-y-3">
                            ${weeklyDuty?.filter(day => day.duties.some(d => d.teacherId === user?.id)).map(day => day.duties
                                .filter(d => d.teacherId === user?.id)
                                .map(duty => `
                                    <div class="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                        <div>
                                            <p class="font-medium">${day.dayName}</p>
                                            <p class="text-sm text-muted-foreground">${duty.area}</p>
                                        </div>
                                        <span class="text-sm">${duty.timeSlot?.start} - ${duty.timeSlot?.end}</span>
                                    </div>
                                `).join('')
                            ).join('')}
                            ${!weeklyDuty?.some(day => day.duties.some(d => d.teacherId === user?.id)) ? 
                                '<p class="text-center text-muted-foreground py-4">No duty assigned this week</p>' : ''}
                        </div>
                        <button onclick="showDashboardSection('duty-preferences')" class="mt-4 w-full py-2 border rounded-lg hover:bg-accent flex items-center justify-center gap-2">
                            <i data-lucide="settings" class="h-4 w-4"></i>
                            Set Preferences
                        </button>
                    </div>
                    
                    <div class="rounded-xl border bg-card p-6">
                        <h3 class="font-semibold mb-4">Duty History</h3>
                        <div class="space-y-3">
                            <div class="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                <div>
                                    <p class="font-medium">${formatDate(new Date(Date.now() - 2*24*60*60*1000))}</p>
                                    <p class="text-sm text-muted-foreground">Main Gate</p>
                                </div>
                                <span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Rating: 4.5</span>
                            </div>
                            <div class="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                <div>
                                    <p class="font-medium">${formatDate(new Date(Date.now() - 5*24*60*60*1000))}</p>
                                    <p class="text-sm text-muted-foreground">Dining Hall</p>
                                </div>
                                <span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Rating: 5.0</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Request Duty Swap</h3>
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium mb-1">Date</label>
                            <input type="date" id="swap-date" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Reason</label>
                            <textarea id="swap-reason" rows="2" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="Why do you need to swap?"></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Target Teacher (Optional)</label>
                            <select id="swap-target" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                                <option value="">Any available teacher</option>
                                <option value="2">Mr. Kamau</option>
                                <option value="3">Ms. Atieno</option>
                            </select>
                        </div>
                        <button onclick="handleSwapRequest()" class="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90">
                            Submit Request
                        </button>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        return `<div class="text-center py-12 text-red-500">Error loading duty: ${error.message}</div>`;
    }
}

function renderTeacherDutyPreferences() {
    const user = getCurrentUser();
    const teacher = user?.teacher || {};
    const preferences = teacher.dutyPreferences || {};
    
    return `
        <div class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-bold">Duty Preferences</h2>
            
            <div class="rounded-xl border bg-card p-6 max-w-2xl mx-auto">
                ${renderDutyPreferencesForm(preferences)}
            </div>
        </div>
    `;
}

function renderTeacherChat() {
    return `
        <div class="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div class="rounded-xl border bg-card p-4 h-[600px] flex flex-col">
                <div class="flex justify-between items-center mb-4 pb-2 border-b">
                    <div class="flex items-center gap-3">
                        <div class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                            <i data-lucide="message-circle" class="h-5 w-5 text-white"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold">Teachers' Staff Room</h3>
                            <p class="text-xs text-muted-foreground">8 members online</p>
                        </div>
                    </div>
                    <button class="p-2 hover:bg-accent rounded-lg" onclick="showToast('Group members: All teachers', 'info')">
                        <i data-lucide="users" class="h-5 w-5"></i>
                    </button>
                </div>
                
                <div class="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-muted/20 rounded-lg" id="chat-messages-container">
                    <div class="flex justify-start">
                        <div class="chat-bubble-received max-w-[70%]">
                            <p class="text-sm font-medium">Mr. Kamau</p>
                            <p class="text-sm">Has anyone prepared the math exam for Grade 10?</p>
                            <p class="text-xs text-muted-foreground mt-1">10:30 AM</p>
                        </div>
                    </div>
                    <div class="flex justify-end">
                        <div class="chat-bubble-sent max-w-[70%]">
                            <p class="text-sm font-medium">You</p>
                            <p class="text-sm">Yes, I have it ready. I'll share it in the staff drive.</p>
                            <p class="text-xs text-muted-foreground mt-1">10:32 AM</p>
                        </div>
                    </div>
                </div>
                
                <div class="flex gap-2">
                    <input type="text" id="chat-message-input" placeholder="Type your message..." class="flex-1 rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <button onclick="sendChatMessage()" class="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
                        <i data-lucide="send" class="h-4 w-4"></i>
                        Send
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ============ PARENT SECTIONS - COMPLETE PRODUCTION CODE ============

async function renderParentSection(section) {
    switch(section) {
        case 'dashboard':
            return await renderParentDashboard();
        case 'progress':
            return await renderParentProgress();
        case 'payments':
            return await renderParentPayments();
        case 'chat':
            return await renderParentChat();
        case 'settings':
            return renderUserSettings('parent');
        default:
            return await renderParentDashboard();
    }
}

// ============ PARENT DASHBOARD ============
async function renderParentDashboard() {
    try {
        // Fetch children data from API
        const childrenResponse = await api.parent.getChildren();
        const children = childrenResponse.data || [];
        
        let selectedChildSummary = null;
        let selectedChildId = null;
        
        if (children.length > 0) {
            selectedChildId = children[0].id;
            // Get summary for the first child
            const summaryResponse = await api.parent.getChildSummary(selectedChildId);
            selectedChildSummary = summaryResponse.data;
        }
        
        // Store in dashboardData
        dashboardData = {
            children: children,
            selectedChild: selectedChildSummary,
            selectedChildId: selectedChildId
        };
        
        // Build HTML
        let html = `
            <div class="space-y-6 animate-fade-in">
                <!-- Child Selector -->
                <div class="flex gap-2 border-b pb-4 overflow-x-auto" id="child-selector">
        `;
        
        if (children.length === 0) {
            html += `<p class="text-muted-foreground">No children linked to your account</p>`;
        } else {
            children.forEach((child, index) => {
                const childName = child.User?.name || 'Unknown';
                const childGrade = child.grade || 'N/A';
                const isActive = index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted';
                
                html += `
                    <button onclick="selectChild('${child.id}')" 
                            class="child-selector-btn px-4 py-2 ${isActive} rounded-lg">
                        ${childName} (Grade ${childGrade})
                    </button>
                `;
            });
        }
        
        html += `</div>`;
        
        // Add child summary if available
        if (selectedChildSummary) {
            const classTeacher = selectedChildSummary.classTeacher;
            const student = selectedChildSummary.student || {};
            const avgScore = selectedChildSummary.averageScore || 0;
            const recentRecords = selectedChildSummary.recentRecords || [];
            const recentAttendance = selectedChildSummary.recentAttendance || [];
            const outstandingFees = selectedChildSummary.outstandingFees || null;
            
            // Calculate attendance rate from real data
            const attendanceRate = recentAttendance.length > 0 
                ? Math.round((recentAttendance.filter(a => a.status === 'present').length / recentAttendance.length) * 100) 
                : 0;
            
            // Get fee balance from real data
            const feeBalance = outstandingFees?.balance || 0;
            
            // Class Teacher Section - Only shows if data exists
            if (classTeacher) {
                html += `
                    <div class="rounded-xl border bg-card p-4 mb-4">
                        <div class="flex items-center gap-3">
                            <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <i data-lucide="user" class="h-5 w-5 text-primary"></i>
                            </div>
                            <div>
                                <p class="text-xs text-muted-foreground">Class Teacher</p>
                                <p class="font-medium">${classTeacher.name || 'Not Assigned'}</p>
                                <p class="text-xs text-muted-foreground">${classTeacher.email || ''}</p>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            // Stats Grid - All values come from API
            html += `
                <!-- Stats Grid -->
                <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div class="rounded-xl border bg-card p-6 card-hover">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-muted-foreground">ELIMUID</p>
                                <h3 class="text-lg font-mono font-bold mt-1">${student.elimuid || 'N/A'}</h3>
                            </div>
                            <div class="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                                <i data-lucide="id-card" class="h-6 w-6 text-purple-600"></i>
                            </div>
                        </div>
                    </div>
                    
                    <div class="rounded-xl border bg-card p-6 card-hover">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-muted-foreground">Class Average</p>
                                <h3 class="text-2xl font-bold mt-1">${avgScore}%</h3>
                                <p class="text-xs text-muted-foreground mt-1">Overall performance</p>
                            </div>
                            <div class="h-12 w-12 rounded-lg bg-violet-100 flex items-center justify-center">
                                <i data-lucide="trending-up" class="h-6 w-6 text-violet-600"></i>
                            </div>
                        </div>
                    </div>
                    
                    <div class="rounded-xl border bg-card p-6 card-hover">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-muted-foreground">Attendance</p>
                                <h3 class="text-2xl font-bold mt-1">${attendanceRate}%</h3>
                                <p class="text-xs text-muted-foreground mt-1">Last ${recentAttendance.length} days</p>
                            </div>
                            <div class="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center">
                                <i data-lucide="calendar-check" class="h-6 w-6 text-amber-600"></i>
                            </div>
                        </div>
                    </div>
                    
                    <div class="rounded-xl border bg-card p-6 card-hover">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-muted-foreground">Fee Balance</p>
                                <h3 class="text-2xl font-bold mt-1 ${feeBalance > 0 ? 'text-red-600' : 'text-green-600'}">
                                    $${feeBalance}
                                </h3>
                                <p class="text-xs text-muted-foreground mt-1">${feeBalance > 0 ? 'Outstanding' : 'Paid in full'}</p>
                            </div>
                            <div class="h-12 w-12 rounded-lg ${feeBalance > 0 ? 'bg-red-100' : 'bg-green-100'} flex items-center justify-center">
                                <i data-lucide="credit-card" class="h-6 w-6 ${feeBalance > 0 ? 'text-red-600' : 'text-green-600'}"></i>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Recent Grades - From API -->
                <div class="rounded-xl border bg-card overflow-hidden">
                    <div class="p-4 border-b">
                        <h3 class="font-semibold">Recent Grades</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead class="bg-muted/50">
                                <tr>
                                    <th class="px-4 py-3 text-left font-medium">Subject</th>
                                    <th class="px-4 py-3 text-left font-medium">Assessment</th>
                                    <th class="px-4 py-3 text-center font-medium">Score</th>
                                    <th class="px-4 py-3 text-center font-medium">Grade</th>
                                    <th class="px-4 py-3 text-left font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                ${recentRecords.slice(0, 5).map(record => {
                                    const score = record.score || 0;
                                    const gradeClass = score >= 80 ? 'bg-green-100 text-green-700' : 
                                                      score >= 60 ? 'bg-yellow-100 text-yellow-700' : 
                                                      'bg-red-100 text-red-700';
                                    return `
                                        <tr class="hover:bg-accent/50 transition-colors">
                                            <td class="px-4 py-3 font-medium">${record.subject || 'N/A'}</td>
                                            <td class="px-4 py-3">${record.assessmentName || record.assessmentType || 'N/A'}</td>
                                            <td class="px-4 py-3 text-center">${score}%</td>
                                            <td class="px-4 py-3 text-center">
                                                <span class="px-2 py-1 ${gradeClass} text-xs rounded-full">
                                                    ${record.grade || 'N/A'}
                                                </span>
                                            </td>
                                            <td class="px-4 py-3">${record.date ? formatDate(record.date) : 'N/A'}</td>
                                        </tr>
                                    `;
                                }).join('')}
                                ${recentRecords.length === 0 ? `
                                    <tr>
                                        <td colspan="5" class="px-4 py-8 text-center text-muted-foreground">
                                            No grade records available
                                        </td>
                                    </tr>
                                ` : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <!-- Report Absence - Functional -->
                <div class="rounded-xl border bg-card p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-semibold">Report Absence</h3>
                    </div>
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium mb-1">Date</label>
                            <input type="date" id="absence-date" value="${new Date().toISOString().split('T')[0]}" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Reason</label>
                            <textarea id="absence-reason" rows="2" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="Why will your child be absent?"></textarea>
                        </div>
                        <button onclick="reportAbsence()" class="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90">
                            Report Absence
                        </button>
                    </div>
                </div>
            `;
        }
        
        html += `</div>`;
        return html;
        
    } catch (error) {
        console.error('Parent dashboard error:', error);
        return `<div class="text-center py-12 text-red-500">Error loading dashboard: ${error.message}</div>`;
    }
}

async function refreshParentDashboard() {
    try {
        const children = await api.parent.getChildren();
        if (children.data && children.data.length > 0) {
            const summary = await api.parent.getChildSummary(children.data[0].id);
            dashboardData = {
                children: children.data,
                selectedChild: summary.data,
                selectedChildId: children.data[0].id
            };
        } else {
            dashboardData = { children: [], selectedChild: null, selectedChildId: null };
        }
        
        if (currentSection === 'dashboard') {
            await showDashboardSection('dashboard');
        }
    } catch (error) {
        console.error('Error refreshing parent dashboard:', error);
    }
}

// ============ PARENT PROGRESS ============
async function renderParentProgress() {
    try {
        const selectedChildId = dashboardData?.selectedChildId;
        
        if (!selectedChildId) {
            return `<div class="text-center py-12">Please select a child first</div>`;
        }
        
        const summaryResponse = await api.parent.getChildSummary(selectedChildId);
        const childData = summaryResponse.data;
        
        const records = childData?.recentRecords || [];
        const avgScore = childData?.averageScore || 0;
        
        // Initialize chart with real data
        setTimeout(() => {
            const ctx = document.getElementById('parent-gradeChart');
            if (ctx && typeof Chart !== 'undefined') {
                if (window.parentChart) window.parentChart.destroy();
                
                window.parentChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: records.map(r => r.date ? formatDate(r.date) : ''),
                        datasets: [{
                            label: 'Performance',
                            data: records.map(r => r.score || 0),
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            tension: 0.4,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } }
                    }
                });
            }
        }, 100);
        
        return `
            <div class="space-y-6 animate-fade-in">
                <h2 class="text-2xl font-bold">Academic Progress - ${childData?.student?.name || 'Student'}</h2>
                
                <!-- Summary Stats -->
                <div class="grid gap-4 md:grid-cols-3">
                    <div class="rounded-xl border bg-card p-6">
                        <p class="text-sm text-muted-foreground">Overall Average</p>
                        <p class="text-3xl font-bold ${avgScore >= 80 ? 'text-green-600' : avgScore >= 60 ? 'text-yellow-600' : 'text-red-600'}">
                            ${avgScore}%
                        </p>
                    </div>
                    <div class="rounded-xl border bg-card p-6">
                        <p class="text-sm text-muted-foreground">Total Assessments</p>
                        <p class="text-3xl font-bold">${records.length}</p>
                    </div>
                    <div class="rounded-xl border bg-card p-6">
                        <p class="text-sm text-muted-foreground">Last Assessment</p>
                        <p class="text-3xl font-bold text-blue-600">${records[0]?.score || 0}%</p>
                    </div>
                </div>
                
                <!-- Performance Chart -->
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Performance Over Time</h3>
                    <div class="chart-container h-80">
                        <canvas id="parent-gradeChart"></canvas>
                    </div>
                </div>
                
                <!-- Detailed Grades -->
                <div class="rounded-xl border bg-card overflow-hidden">
                    <div class="p-4 border-b">
                        <h3 class="font-semibold">Detailed Grades</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead class="bg-muted/50">
                                <tr>
                                    <th class="px-4 py-3 text-left font-medium">Subject</th>
                                    <th class="px-4 py-3 text-left font-medium">Assessment</th>
                                    <th class="px-4 py-3 text-center font-medium">Score</th>
                                    <th class="px-4 py-3 text-center font-medium">Grade</th>
                                    <th class="px-4 py-3 text-left font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                ${records.map(record => {
                                    const score = record.score || 0;
                                    const gradeClass = score >= 80 ? 'bg-green-100 text-green-700' : 
                                                      score >= 60 ? 'bg-yellow-100 text-yellow-700' : 
                                                      'bg-red-100 text-red-700';
                                    return `
                                        <tr class="hover:bg-accent/50 transition-colors">
                                            <td class="px-4 py-3 font-medium">${record.subject || 'N/A'}</td>
                                            <td class="px-4 py-3">${record.assessmentName || record.assessmentType || 'N/A'}</td>
                                            <td class="px-4 py-3 text-center">${score}%</td>
                                            <td class="px-4 py-3 text-center">
                                                <span class="px-2 py-1 ${gradeClass} text-xs rounded-full">
                                                    ${record.grade || 'N/A'}
                                                </span>
                                            </td>
                                            <td class="px-4 py-3">${record.date ? formatDate(record.date) : 'N/A'}</td>
                                        </tr>
                                    `;
                                }).join('')}
                                ${records.length === 0 ? `
                                    <tr>
                                        <td colspan="5" class="px-4 py-8 text-center text-muted-foreground">
                                            No grade records available
                                        </td>
                                    </tr>
                                ` : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Progress error:', error);
        return `<div class="text-center py-12 text-red-500">Error loading progress: ${error.message}</div>`;
    }
}

// ============ PARENT PAYMENTS ============
async function renderParentPayments() {
    try {
        const selectedChildId = dashboardData?.selectedChildId;
        
        // Fetch payment history
        let payments = [];
        try {
            const paymentsResponse = await api.parent.getPayments();
            payments = paymentsResponse.data || [];
        } catch (error) {
            console.log('No payment history yet');
        }
        
        // Fetch subscription plans
        let plans = [];
        try {
            const plansResponse = await api.parent.getSubscriptionPlans();
            plans = plansResponse.data || [];
        } catch (error) {
            console.log('Using default plans');
            plans = [
                { id: 'basic', name: 'Basic', price: 3, features: ['View attendance', 'Report absence'] },
                { id: 'premium', name: 'Premium', price: 10, features: ['Everything in Basic', 'Grades & progress', 'Teacher comments'] },
                { id: 'ultimate', name: 'Ultimate', price: 20, features: ['Everything in Premium', 'Live chat', 'Priority support'] }
            ];
        }
        
        // Get school details
        let school = null;
        try {
            const user = getCurrentUser();
            if (user?.schoolCode) {
                const schoolResponse = await api.public.getSchoolInfo(user.schoolCode);
                school = schoolResponse.data;
            }
        } catch (error) {
            console.log('Could not fetch school details');
        }
        
        return `
            <div class="space-y-6 animate-fade-in">
                <h2 class="text-2xl font-bold">Payments & Subscriptions</h2>
                
                <div class="grid gap-4 md:grid-cols-3">
                    <!-- Make Payment -->
                    <div class="rounded-xl border bg-card p-6">
                        <h3 class="font-semibold mb-4">Make Payment</h3>
                        <div class="space-y-3">
                            ${school ? `
                                <div class="p-3 bg-muted/30 rounded-lg mb-4">
                                    <p class="text-xs font-medium text-muted-foreground">School Account</p>
                                    <p class="font-medium">${school.name || 'Your School'}</p>
                                    ${school.bankDetails ? `
                                        <p class="text-xs mt-2">Bank: ${school.bankDetails.bankName || 'N/A'}</p>
                                        <p class="text-xs">Account: ${school.bankDetails.accountNumber || 'N/A'}</p>
                                    ` : ''}
                                </div>
                            ` : ''}
                            
                            <select id="payment-child" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                                <option value="">Select Child</option>
                                ${dashboardData?.children?.map(child => `
                                    <option value="${child.id}" ${child.id == selectedChildId ? 'selected' : ''}>
                                        ${child.User?.name || 'Unknown'} (${child.grade})
                                    </option>
                                `).join('')}
                            </select>
                            
                            <select id="payment-plan" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                                <option value="">Select Plan</option>
                                ${plans.map(plan => `
                                    <option value="${plan.id}">${plan.name} - $${plan.price}/mo</option>
                                `).join('')}
                            </select>
                            
                            <input type="number" id="payment-amount" placeholder="Amount" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                            
                            <select id="payment-method" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                                <option value="mpesa">M-Pesa</option>
                                <option value="card">Credit Card</option>
                                <option value="bank">Bank Transfer</option>
                            </select>
                            
                            <button onclick="processPayment()" class="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90">
                                Pay Now
                            </button>
                        </div>
                    </div>
                    
                    <!-- Payment History -->
                    <div class="rounded-xl border bg-card p-6">
                        <h3 class="font-semibold mb-4">Payment History</h3>
                        <div class="space-y-2 max-h-96 overflow-y-auto">
                            ${payments.length > 0 ? payments.map(payment => `
                                <div class="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                    <div>
                                        <p class="text-sm font-medium">${payment.Student?.User?.name || 'Payment'}</p>
                                        <p class="text-xs text-muted-foreground">${formatDate(payment.createdAt)}</p>
                                    </div>
                                    <div class="text-right">
                                        <p class="font-semibold">$${payment.amount}</p>
                                        <span class="text-xs ${payment.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}">
                                            ${payment.status}
                                        </span>
                                    </div>
                                </div>
                            `).join('') : `
                                <div class="text-center py-8">
                                    <i data-lucide="credit-card" class="h-12 w-12 mx-auto text-muted-foreground mb-3"></i>
                                    <p class="text-sm text-muted-foreground">No payment history</p>
                                </div>
                            `}
                        </div>
                    </div>
                    
                    <!-- Subscription Plans -->
                    <div class="rounded-xl border bg-card p-6">
                        <h3 class="font-semibold mb-4">Subscription Plans</h3>
                        <div class="space-y-3">
                            ${plans.map(plan => `
                                <div class="p-4 border rounded-lg hover:border-primary transition-colors">
                                    <div class="flex justify-between items-center mb-2">
                                        <p class="font-semibold">${plan.name}</p>
                                        <p class="text-lg font-bold text-primary">$${plan.price}<span class="text-xs font-normal text-muted-foreground">/mo</span></p>
                                    </div>
                                    <ul class="space-y-1 mb-3">
                                        ${plan.features.map(feature => `
                                            <li class="text-xs flex items-center gap-1">
                                                <i data-lucide="check" class="h-3 w-3 text-green-600"></i>
                                                ${feature}
                                            </li>
                                        `).join('')}
                                    </ul>
                                    <button onclick="upgradePlan('${plan.id}')" class="w-full py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                                        Select ${plan.name}
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Payments error:', error);
        return `<div class="text-center py-12 text-red-500">Error loading payments: ${error.message}</div>`;
    }
}

// Report absence function
window.reportAbsence = async function() {
    const selectedChildId = dashboardData?.selectedChildId;
    
    if (!selectedChildId) {
        showToast('Please select a child first', 'error');
        return;
    }
    
    const date = document.getElementById('absence-date')?.value;
    const reason = document.getElementById('absence-reason')?.value;
    
    if (!date || !reason) {
        showToast('Please select date and enter reason', 'error');
        return;
    }
    
    showLoading();
    try {
        const response = await api.parent.reportAbsence({
            studentId: parseInt(selectedChildId),
            date: date,
            reason: reason
        });
        
        if (response.success) {
            showToast('✅ Absence reported and class teacher notified', 'success');
            document.getElementById('absence-date').value = new Date().toISOString().split('T')[0];
            document.getElementById('absence-reason').value = '';
        }
    } catch (error) {
        console.error('Report absence error:', error);
        showToast(error.message || 'Failed to report absence', 'error');
    } finally {
        hideLoading();
    }
};

// Send parent message
window.sendParentMessage = async function() {
    const selectedChildId = dashboardData?.selectedChildId;
    
    if (!selectedChildId) {
        showToast('Please select a child first', 'error');
        return;
    }
    
    const recipientType = document.getElementById('parent-recipient-type')?.value;
    const message = document.getElementById('parent-chat-input')?.value.trim();
    
    if (!message) {
        showToast('Please enter a message', 'error');
        return;
    }
    
    showLoading();
    try {
        const response = await api.parent.sendMessage({
            studentId: parseInt(selectedChildId),
            message: message,
            recipientType: recipientType
        });
        
        if (response.success) {
            document.getElementById('parent-chat-input').value = '';
            
            const container = document.getElementById('parent-chat-messages');
            container.innerHTML += `
                <div class="flex justify-end">
                    <div class="chat-bubble-sent max-w-[70%]">
                        <p class="text-sm font-medium">You</p>
                        <p class="text-sm">${message}</p>
                        <p class="text-xs text-muted-foreground mt-1">just now</p>
                    </div>
                </div>
            `;
            container.scrollTop = container.scrollHeight;
            
            showToast('✅ Message sent to class teacher', 'success');
        }
    } catch (error) {
        console.error('Send message error:', error);
        showToast(error.message || 'Failed to send message', 'error');
    } finally {
        hideLoading();
    }
};

// Load parent chat history
function loadParentChatHistory() {
    return `
        <div class="text-center text-muted-foreground py-8">
            <i data-lucide="message-circle" class="h-12 w-12 mx-auto mb-3 opacity-50"></i>
            <p>Select a recipient and start messaging</p>
        </div>
    `;
}

// ============ PARENT CHAT ============
function renderParentChat() {
    // Get the current selected child
    const selectedChild = dashboardData?.selectedChild?.student || 
                          (dashboardData?.children && dashboardData.children[0]?.User);
    const childName = selectedChild?.name || 'your child';
    
    // Get class teacher from summary if available
    const classTeacher = dashboardData?.selectedChild?.classTeacher;
    
    // Get stored messages or initialize empty
    const messages = JSON.parse(localStorage.getItem('parent_messages') || '[]');
    
    return `
        <div class="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div class="rounded-xl border bg-card p-4 h-[600px] flex flex-col">
                <div class="flex justify-between items-center mb-4 pb-2 border-b">
                    <div>
                        <h3 class="font-semibold">Message School Staff</h3>
                        <p class="text-xs text-muted-foreground">Chat with class teacher or admin about ${childName}</p>
                    </div>
                </div>
                
                <div class="flex gap-4 mb-4">
                    <select id="parent-recipient-type" class="px-3 py-2 border rounded-lg bg-background flex-1">
                        <option value="teacher">📚 Class Teacher ${classTeacher ? `(${classTeacher.name})` : ''}</option>
                        <option value="admin">🏫 School Administrator</option>
                    </select>
                </div>
                
                <div class="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-muted/20 rounded-lg" id="parent-chat-messages">
                    ${messages.length > 0 ? messages.map(msg => `
                        <div class="flex ${msg.sender === 'parent' ? 'justify-end' : 'justify-start'}">
                            <div class="${msg.sender === 'parent' ? 'chat-bubble-sent' : 'chat-bubble-received'} max-w-[70%]">
                                <p class="text-sm font-medium">${msg.sender === 'parent' ? 'You' : msg.senderName}</p>
                                <p class="text-sm">${msg.content}</p>
                                <p class="text-xs text-muted-foreground mt-1">${timeAgo(msg.timestamp)}</p>
                            </div>
                        </div>
                    `).join('') : `
                        <div class="text-center text-muted-foreground py-8">
                            <i data-lucide="message-circle" class="h-12 w-12 mx-auto mb-3 opacity-50"></i>
                            <p>Select a recipient and start messaging</p>
                        </div>
                    `}
                </div>
                
                <div class="flex gap-2">
                    <input type="text" id="parent-chat-input" placeholder="Type your message..." 
                           class="flex-1 rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <button onclick="sendParentMessage()" class="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
                        <i data-lucide="send" class="h-4 w-4"></i>
                        Send
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Send parent message
window.sendParentMessage = async function() {
    const selectedChildId = dashboardData?.selectedChildId;
    
    if (!selectedChildId) {
        showToast('Please select a child first', 'error');
        return;
    }
    
    const recipientType = document.getElementById('parent-recipient-type')?.value;
    const message = document.getElementById('parent-chat-input')?.value.trim();
    
    if (!message) {
        showToast('Please enter a message', 'error');
        return;
    }
    
    showLoading();
    try {
        const response = await api.parent.sendMessage({
            studentId: parseInt(selectedChildId),
            message: message,
            recipientType: recipientType // 'teacher' or 'admin'
        });
        
        if (response.success) {
            document.getElementById('parent-chat-input').value = '';
            
            // Add message to chat
            const container = document.getElementById('parent-chat-messages');
            container.innerHTML += `
                <div class="flex justify-end">
                    <div class="chat-bubble-sent max-w-[70%]">
                        <p class="text-sm font-medium">You</p>
                        <p class="text-sm">${message}</p>
                        <p class="text-xs text-muted-foreground mt-1">just now</p>
                    </div>
                </div>
            `;
            container.scrollTop = container.scrollHeight;
            
            showToast('✅ Message sent to class teacher', 'success');
        }
    } catch (error) {
        console.error('Send message error:', error);
        showToast(error.message || 'Failed to send message', 'error');
    } finally {
        hideLoading();
    }
};

// ============ PARENT HELPER FUNCTIONS ============

// Select child function
window.selectChild = async function(childId) {
    // Update UI
    document.querySelectorAll('.child-selector-btn').forEach(btn => {
        btn.classList.remove('bg-primary', 'text-primary-foreground');
        btn.classList.add('bg-muted');
    });
    
    const selectedBtn = Array.from(document.querySelectorAll('.child-selector-btn'))
        .find(btn => btn.getAttribute('onclick')?.includes(`'${childId}'`));
    
    if (selectedBtn) {
        selectedBtn.classList.remove('bg-muted');
        selectedBtn.classList.add('bg-primary', 'text-primary-foreground');
    }
    
    // Update dashboardData
    dashboardData.selectedChildId = childId;
    
    // Fetch and update child summary
    showLoading();
    try {
        const summaryResponse = await api.parent.getChildSummary(childId);
        dashboardData.selectedChild = summaryResponse.data;
        
        // Refresh the current section to show updated data
        await showDashboardSection(currentSection);
    } catch (error) {
        console.error('Error selecting child:', error);
        showToast('Failed to load child data', 'error');
    } finally {
        hideLoading();
    }
};

// Process payment
window.processPayment = async function() {
    const selectedChildId = dashboardData?.selectedChildId;
    const childSelect = document.getElementById('payment-child');
    const planSelect = document.getElementById('payment-plan');
    const amountInput = document.getElementById('payment-amount');
    const methodSelect = document.getElementById('payment-method');
    
    const studentId = childSelect?.value || selectedChildId;
    const plan = planSelect?.value;
    const amount = amountInput?.value;
    const method = methodSelect?.value;
    
    if (!studentId) {
        showToast('Please select a child', 'error');
        return;
    }
    
    if (!plan) {
        showToast('Please select a payment plan', 'error');
        return;
    }
    
    if (!amount || amount <= 0) {
        showToast('Please enter a valid amount', 'error');
        return;
    }
    
    if (!method) {
        showToast('Please select payment method', 'error');
        return;
    }
    
    showLoading();
    try {
        const response = await api.parent.makePayment({
            studentId: parseInt(studentId),
            amount: parseFloat(amount),
            method: method,
            plan: plan,
            reference: `PAY-${Date.now()}`
        });
        
        if (response.success) {
            showToast('✅ Payment initiated. Please complete payment using school details.', 'success');
            
            // Show school payment details
            if (response.data?.school) {
                const school = response.data.school;
                alert(`
Payment Instructions:
School: ${school.name}
Bank: ${school.bankDetails?.bankName || 'N/A'}
Account: ${school.bankDetails?.accountNumber || 'N/A'}
Amount: $${amount}
                    
Please complete the payment and the school will confirm.
                `);
            }
        }
    } catch (error) {
        console.error('Payment error:', error);
        showToast(error.message || 'Failed to process payment', 'error');
    } finally {
        hideLoading();
    }
};

// Upgrade plan
window.upgradePlan = async function(planId) {
    const selectedChildId = dashboardData?.selectedChildId;
    
    if (!selectedChildId) {
        showToast('Please select a child first', 'error');
        return;
    }
    
    showLoading();
    try {
        const response = await api.parent.upgradePlan({
            studentId: parseInt(selectedChildId),
            newPlan: planId
        });
        
        if (response.success) {
            showToast(`✅ Upgrade to ${planId} plan initiated`, 'success');
            
            // Refresh payments section
            if (currentSection === 'payments') {
                await showDashboardSection('payments');
            }
        }
    } catch (error) {
        console.error('Upgrade error:', error);
        showToast(error.message || 'Failed to upgrade plan', 'error');
    } finally {
        hideLoading();
    }
};

// ============ STUDENT SECTIONS ============

async function renderStudentSection(section) {
    switch(section) {
        case 'dashboard':
            return await renderStudentDashboard();
        case 'grades':
            return await renderStudentGrades();
        case 'attendance':
            return await renderStudentAttendance();
        case 'chat':
            return renderStudentChat();
        case 'ai-tutor':
            return renderStudentAITutor();
        case 'schedule':
            return renderStudentSchedule();
        case 'settings':
            return renderUserSettings('student');
        default:
            return await renderStudentDashboard();
    }
}

async function renderStudentDashboard() {
    try {
        const data = dashboardData || {};
        const user = getCurrentUser();
        
        return `
            <div class="space-y-6 animate-fade-in">
                <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div class="rounded-xl border bg-card p-6 card-hover">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-muted-foreground">My ELIMUID</p>
                                <h3 class="text-lg font-mono font-bold mt-1">${user?.elimuid || 'ELI-2024-001'}</h3>
                            </div>
                            <div class="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                                <i data-lucide="id-card" class="h-6 w-6 text-purple-600"></i>
                            </div>
                        </div>
                    </div>
                    
                    <div class="rounded-xl border bg-card p-6 card-hover">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-muted-foreground">Class Average</p>
                                <h3 class="text-2xl font-bold mt-1">82%</h3>
                            </div>
                            <div class="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                                <i data-lucide="trending-up" class="h-6 w-6 text-green-600"></i>
                            </div>
                        </div>
                    </div>
                    
                    <div class="rounded-xl border bg-card p-6 card-hover">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-muted-foreground">My Attendance</p>
                                <h3 class="text-2xl font-bold mt-1">95%</h3>
                            </div>
                            <div class="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center">
                                <i data-lucide="calendar-check" class="h-6 w-6 text-amber-600"></i>
                            </div>
                        </div>
                    </div>
                    
                    <div class="rounded-xl border bg-card p-6 card-hover">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-muted-foreground">Study Groups</p>
                                <h3 class="text-2xl font-bold mt-1">3</h3>
                            </div>
                            <div class="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                <i data-lucide="message-circle" class="h-6 w-6 text-blue-600"></i>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="grid gap-4 md:grid-cols-2">
                    <button onclick="showDashboardSection('chat')" class="p-6 border rounded-lg hover:bg-accent transition-colors text-left flex items-center gap-4">
                        <div class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <i data-lucide="message-circle" class="h-6 w-6 text-blue-600"></i>
                        </div>
                        <div>
                            <h4 class="font-semibold">Study Groups</h4>
                            <p class="text-sm text-muted-foreground">Chat with students from other schools</p>
                        </div>
                    </button>
                    
                    <button onclick="showDashboardSection('ai-tutor')" class="p-6 border rounded-lg hover:bg-accent transition-colors text-left flex items-center gap-4">
                        <div class="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                            <i data-lucide="bot" class="h-6 w-6 text-purple-600"></i>
                        </div>
                        <div>
                            <h4 class="font-semibold">AI Tutor</h4>
                            <p class="text-sm text-muted-foreground">Get help with any subject</p>
                        </div>
                    </button>
                </div>
            </div>
        `;
    } catch (error) {
        return `<div class="text-center py-12 text-red-500">Error loading dashboard: ${error.message}</div>`;
    }
}

async function renderStudentGrades() {
    try {
        const data = dashboardData || {};
        
        return `
            <div class="space-y-6 animate-fade-in">
                <h2 class="text-2xl font-bold">My Grades</h2>
                
                <div class="rounded-xl border bg-card overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead class="bg-muted/50">
                                <tr>
                                    <th class="px-4 py-3 text-left font-medium">Subject</th>
                                    <th class="px-4 py-3 text-left font-medium">Assessment</th>
                                    <th class="px-4 py-3 text-center font-medium">Score</th>
                                    <th class="px-4 py-3 text-center font-medium">Grade</th>
                                    <th class="px-4 py-3 text-left font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                <tr class="hover:bg-accent/50 transition-colors">
                                    <td class="px-4 py-3 font-medium">Mathematics</td>
                                    <td class="px-4 py-3">Mid-term Exam</td>
                                    <td class="px-4 py-3 text-center">85%</td>
                                    <td class="px-4 py-3 text-center">
                                        <span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">A-</span>
                                    </td>
                                    <td class="px-4 py-3">Mar 15, 2024</td>
                                </tr>
                                <tr class="hover:bg-accent/50 transition-colors">
                                    <td class="px-4 py-3 font-medium">English</td>
                                    <td class="px-4 py-3">Essay</td>
                                    <td class="px-4 py-3 text-center">78%</td>
                                    <td class="px-4 py-3 text-center">
                                        <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">B+</span>
                                    </td>
                                    <td class="px-4 py-3">Mar 14, 2024</td>
                                </tr>
                                <tr class="hover:bg-accent/50 transition-colors">
                                    <td class="px-4 py-3 font-medium">Science</td>
                                    <td class="px-4 py-3">Lab Report</td>
                                    <td class="px-4 py-3 text-center">92%</td>
                                    <td class="px-4 py-3 text-center">
                                        <span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">A</span>
                                    </td>
                                    <td class="px-4 py-3">Mar 12, 2024</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        return `<div class="text-center py-12 text-red-500">Error loading grades: ${error.message}</div>`;
    }
}

async function renderStudentAttendance() {
    try {
        const data = dashboardData || {};
        
        return `
            <div class="space-y-6 animate-fade-in">
                <h2 class="text-2xl font-bold">My Attendance</h2>
                
                <div class="rounded-xl border bg-card p-6">
                    <div class="grid gap-4 md:grid-cols-3">
                        <div class="text-center p-4">
                            <p class="text-sm text-muted-foreground">Present</p>
                            <p class="text-3xl font-bold text-green-600">42</p>
                        </div>
                        <div class="text-center p-4">
                            <p class="text-sm text-muted-foreground">Absent</p>
                            <p class="text-3xl font-bold text-red-600">2</p>
                        </div>
                        <div class="text-center p-4">
                            <p class="text-sm text-muted-foreground">Late</p>
                            <p class="text-3xl font-bold text-yellow-600">1</p>
                        </div>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card overflow-hidden">
                    <div class="p-4 border-b">
                        <h3 class="font-semibold">Attendance History</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead class="bg-muted/50">
                                <tr>
                                    <th class="px-4 py-3 text-left font-medium">Date</th>
                                    <th class="px-4 py-3 text-left font-medium">Status</th>
                                    <th class="px-4 py-3 text-left font-medium">Reason</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                <tr class="hover:bg-accent/50 transition-colors">
                                    <td class="px-4 py-3">Mar 15, 2024</td>
                                    <td class="px-4 py-3">
                                        <span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">present</span>
                                    </td>
                                    <td class="px-4 py-3">-</td>
                                </tr>
                                <tr class="hover:bg-accent/50 transition-colors">
                                    <td class="px-4 py-3">Mar 14, 2024</td>
                                    <td class="px-4 py-3">
                                        <span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">present</span>
                                    </td>
                                    <td class="px-4 py-3">-</td>
                                </tr>
                                <tr class="hover:bg-accent/50 transition-colors">
                                    <td class="px-4 py-3">Mar 13, 2024</td>
                                    <td class="px-4 py-3">
                                        <span class="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">absent</span>
                                    </td>
                                    <td class="px-4 py-3">Sick</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        return `<div class="text-center py-12 text-red-500">Error loading attendance: ${error.message}</div>`;
    }
}

function renderStudentChat() {
    return `
        <div class="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div class="rounded-xl border bg-card p-4 h-[600px] flex flex-col">
                <div class="flex justify-between items-center mb-4 pb-2 border-b">
                    <div class="flex items-center gap-3">
                        <div class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                            <i data-lucide="message-circle" class="h-5 w-5 text-white"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold">Grade 10 Math Study Group</h3>
                            <p class="text-xs text-muted-foreground">5 members online</p>
                        </div>
                    </div>
                </div>
                
                <div class="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-muted/20 rounded-lg" id="chat-messages-container">
                    <div class="flex justify-start">
                        <div class="chat-bubble-received max-w-[70%]">
                            <p class="text-sm font-medium">Alex</p>
                            <p class="text-sm">Can anyone help with quadratic equations?</p>
                            <p class="text-xs text-muted-foreground mt-1">2 min ago</p>
                        </div>
                    </div>
                    <div class="flex justify-end">
                        <div class="chat-bubble-sent max-w-[70%]">
                            <p class="text-sm font-medium">You</p>
                            <p class="text-sm">Sure! Use the formula x = [-b ± √(b²-4ac)]/2a</p>
                            <p class="text-xs text-muted-foreground mt-1">1 min ago</p>
                        </div>
                    </div>
                </div>
                
                <div class="flex gap-2">
                    <input type="text" id="chat-message-input" placeholder="Type a message..." class="flex-1 rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <button onclick="sendStudentMessage()" class="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
                        <i data-lucide="send" class="h-4 w-4"></i>
                        Send
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderStudentAITutor() {
    const curriculum = schoolSettings.curriculum || 'cbc';
    
    return `
        <div class="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div class="rounded-xl border bg-card p-4 h-[600px] flex flex-col">
                <div class="flex items-center gap-3 mb-4 pb-2 border-b">
                    <div class="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                        <i data-lucide="bot" class="h-6 w-6 text-white"></i>
                    </div>
                    <div>
                        <h3 class="font-semibold text-lg">AI Tutor</h3>
                        <p class="text-xs text-muted-foreground">Curriculum: ${CURRICULUMS[curriculum]?.name || 'CBC'}</p>
                    </div>
                </div>
                
                <div class="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-muted/20 rounded-lg" id="ai-chat-container">
                    <div class="flex justify-start">
                        <div class="chat-bubble-received max-w-[70%]">
                            <p class="text-sm">Hi! I'm your AI tutor. I can help you with ${CURRICULUMS[curriculum]?.name || 'your'} curriculum. What would you like to learn about today?</p>
                        </div>
                    </div>
                </div>
                
                <div class="flex gap-2">
                    <input type="text" id="ai-question-input" placeholder="Ask me anything..." class="flex-1 rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <button onclick="askAITutor()" class="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
                        <i data-lucide="send" class="h-4 w-4"></i>
                        Ask
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderStudentSchedule() {
    return `
        <div class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-bold">My Schedule - ${schoolSettings.schoolName || 'School'}</h2>
            
            <div class="rounded-xl border bg-card p-6">
                <h3 class="font-semibold mb-4">Today's Classes</h3>
                <div class="space-y-3">
                    <div class="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div>
                            <p class="font-medium">Mathematics</p>
                            <p class="text-sm text-muted-foreground">Mr. Kamau • Room 101</p>
                        </div>
                        <span class="text-sm font-medium">8:00 AM - 9:30 AM</span>
                    </div>
                    <div class="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div>
                            <p class="font-medium">English</p>
                            <p class="text-sm text-muted-foreground">Ms. Atieno • Room 203</p>
                        </div>
                        <span class="text-sm font-medium">10:00 AM - 11:30 AM</span>
                    </div>
                    <div class="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div>
                            <p class="font-medium">Science</p>
                            <p class="text-sm text-muted-foreground">Mr. Omondi • Lab 1</p>
                        </div>
                        <span class="text-sm font-medium">12:00 PM - 1:30 PM</span>
                    </div>
                </div>
            </div>
            
            <div class="rounded-xl border bg-card p-6">
                <h3 class="font-semibold mb-4">Upcoming Exams</h3>
                <div class="space-y-3">
                    <div class="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                            <p class="font-medium">Mathematics Mid-term</p>
                            <p class="text-sm text-muted-foreground">Topics: Algebra, Calculus</p>
                        </div>
                        <span class="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full">in 3 days</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderUserSettings(role) {
    const user = getCurrentUser();
    
    return `
        <div class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-bold">My Settings</h2>
            
            <div class="max-w-2xl space-y-6">
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Profile Information</h3>
                    <div class="space-y-4">
                        <div class="grid gap-4 md:grid-cols-2">
                            <div>
                                <label class="block text-sm font-medium mb-1">Name</label>
                                <input type="text" value="${user?.name || ''}" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Email</label>
                                <input type="email" value="${user?.email || ''}" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Phone</label>
                            <input type="tel" value="${user?.phone || ''}" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Role</label>
                            <input type="text" value="${role}" disabled class="w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
                        </div>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Change Password</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Current Password</label>
                            <input type="password" id="current-password" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">New Password</label>
                            <input type="password" id="new-password" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Confirm New Password</label>
                            <input type="password" id="confirm-password" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                        <button onclick="handleChangePassword()" class="w-full bg-primary text-primary-foreground py-2 rounded-lg">
                            Update Password
                        </button>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Preferences</h3>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="font-medium">Email Notifications</p>
                                <p class="text-sm text-muted-foreground">Receive email updates</p>
                            </div>
                            <button onclick="toggleSwitch(this)" class="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors" data-checked="true">
                                <span class="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform"></span>
                            </button>
                        </div>
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="font-medium">Dark Mode</p>
                                <p class="text-sm text-muted-foreground">Use dark theme</p>
                            </div>
                            <button onclick="toggleSwitch(this); toggleTheme()" class="relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors" data-checked="${document.documentElement.classList.contains('dark')}">
                                <span class="${document.documentElement.classList.contains('dark') ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform"></span>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="flex justify-end">
                    <button onclick="showToast('Settings saved successfully', 'success')" class="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
                        <i data-lucide="save" class="h-4 w-4"></i>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ============ SIDEBAR FUNCTIONS ============

function updateSidebar(role) {
    const nav = document.getElementById('sidebar-nav');
    const settingsNav = document.getElementById('settings-nav');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (!nav) return;
    
    const sidebarConfig = {
        superadmin: {
            main: [
                { icon: 'shield', label: 'Dashboard', section: 'dashboard' },
                { icon: 'building-2', label: 'Schools', section: 'schools' },
                { icon: 'check-circle', label: 'School Approvals', section: 'school-approvals' },
                { icon: 'file-edit', label: 'Name Changes', section: 'name-change-requests' },
                { icon: 'activity', label: 'Platform Health', section: 'platform-health' }
            ],
            settings: [
                { icon: 'settings', label: 'Platform Settings', section: 'settings' },
                { icon: 'help-circle', label: 'Help', section: 'help' }
            ]
        },
        admin: {
            main: [
                { icon: 'layout-dashboard', label: 'Dashboard', section: 'dashboard' },
                { icon: 'users', label: 'Teachers', section: 'teachers' },
                { icon: 'user-plus', label: 'Teacher Approvals', section: 'teacher-approvals' },
                { icon: 'graduation-cap', label: 'Students', section: 'students' },
                { icon: 'calendar', label: 'Calendar', section: 'calendar' },
                { icon: 'clock', label: 'Duty', section: 'duty' },
                { icon: 'bar-chart-2', label: 'Fairness Report', section: 'fairness-report' },
                { icon: 'book-open', label: 'Custom Subjects', section: 'custom-subjects' }
            ],
            settings: [
                { icon: 'settings', label: 'School Settings', section: 'settings' },
                { icon: 'help-circle', label: 'Help', section: 'help' },
                { icon: 'users', label: 'Classes', section: 'class-management' }
            ]
        },
        teacher: {
            main: [
                { icon: 'layout-dashboard', label: 'Dashboard', section: 'dashboard' },
                { icon: 'users', label: 'My Students', section: 'students' },
                { icon: 'calendar-check', label: 'Attendance', section: 'attendance' },
                { icon: 'trending-up', label: 'Grades', section: 'grades' },
                { icon: 'check-square', label: 'Tasks', section: 'tasks' },
                { icon: 'clock', label: 'My Duty', section: 'duty' },
                { icon: 'settings', label: 'Duty Preferences', section: 'duty-preferences' },
                { icon: 'message-circle', label: 'Staff Chat', section: 'chat' }
            ],
            settings: [
                { icon: 'settings', label: 'My Settings', section: 'settings' },
                { icon: 'help-circle', label: 'Help', section: 'help' }
            ]
        },
        parent: {
            main: [
                { icon: 'layout-dashboard', label: 'Dashboard', section: 'dashboard' },
                { icon: 'trending-up', label: 'Progress', section: 'progress' },
                { icon: 'credit-card', label: 'Payments', section: 'payments' },
                { icon: 'message-circle', label: 'Messages', section: 'chat' }
            ],
            settings: [
                { icon: 'settings', label: 'My Settings', section: 'settings' },
                { icon: 'help-circle', label: 'Help', section: 'help' }
            ]
        },
        student: {
            main: [
                { icon: 'layout-dashboard', label: 'Dashboard', section: 'dashboard' },
                { icon: 'trending-up', label: 'My Grades', section: 'grades' },
                { icon: 'calendar-check', label: 'Attendance', section: 'attendance' },
                { icon: 'message-circle', label: 'Study Chat', section: 'chat' },
                { icon: 'bot', label: 'AI Tutor', section: 'ai-tutor' },
                { icon: 'calendar', label: 'Schedule', section: 'schedule' }
            ],
            settings: [
                { icon: 'settings', label: 'My Settings', section: 'settings' },
                { icon: 'help-circle', label: 'Help', section: 'help' }
            ]
        }
    };
    
    const config = sidebarConfig[role] || sidebarConfig.student;
    
    nav.innerHTML = config.main.map(item => `
        <a href="#" onclick="showDashboardSection('${item.section}')" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors sidebar-link" data-section="${item.section}">
            <i data-lucide="${item.icon}" class="h-5 w-5"></i>
            <span>${item.label}</span>
        </a>
    `).join('');
    
    settingsNav.innerHTML = config.settings.map(item => `
        <a href="#" onclick="showDashboardSection('${item.section}')" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors sidebar-link" data-section="${item.section}">
            <i data-lucide="${item.icon}" class="h-5 w-5"></i>
            <span>${item.label}</span>
        </a>
    `).join('');
    
    if (mobileNav) {
        mobileNav.innerHTML = config.main.slice(0, 4).map(item => `
            <a href="#" onclick="showDashboardSection('${item.section}')" class="mobile-nav-item flex flex-col items-center justify-center flex-1 h-14 text-muted-foreground" data-section="${item.section}">
                <i data-lucide="${item.icon}" class="h-5 w-5"></i>
                <span class="text-xs mt-1">${item.label}</span>
            </a>
        `).join('');
    }
    
    lucide.createIcons();
}

function updateSidebarActiveState(section) {
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('bg-sidebar-accent', 'text-sidebar-accent-foreground');
    });
    
    const activeLink = document.querySelector(`.sidebar-link[data-section="${section}"]`);
    if (activeLink) {
        activeLink.classList.add('bg-sidebar-accent', 'text-sidebar-accent-foreground');
    }
    
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
        item.classList.remove('text-primary');
        if (item.dataset.section === section) {
            item.classList.add('text-primary');
        }
    });
}

function updateUserInfo() {
    const user = getCurrentUser();
    const name = user?.name || 'User';
    const initials = getInitials(name);
    
    const userInitials = document.getElementById('user-initials');
    const userName = document.getElementById('user-name');
    const dropdownName = document.getElementById('dropdown-user-name');
    const dropdownEmail = document.getElementById('dropdown-user-email');
    
    if (userInitials) userInitials.textContent = initials;
    if (userName) userName.textContent = name;
    if (dropdownName) dropdownName.textContent = name;
    if (dropdownEmail) dropdownEmail.textContent = user?.email || '';
}

function setupSectionListeners(role, section) {
    if (section === 'students' && role === 'teacher') {
        setTimeout(() => {
            setupFileUpload('csv-drop-zone', 'csv-file-input', 'students');
        }, 500);
    }
    
    if (section === 'chat') {
        const input = document.getElementById('chat-message-input');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendChatMessage();
            });
        }
    }
    
    if (section === 'ai-tutor') {
        const input = document.getElementById('ai-question-input');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') askAITutor();
            });
        }
    }
}

// Add this function to main.js
function updateSchoolNameInAllPlaces(newName) {
    // Update the main school name element
    const schoolNameElement = document.getElementById('school-name');
    if (schoolNameElement) {
        schoolNameElement.textContent = newName;
    }
    
    // Update any elements with school-name-display class
    document.querySelectorAll('.school-name-display').forEach(el => {
        el.textContent = newName;
    });
    
    // Update the school profile card if it exists
    const profileSchoolName = document.querySelector('.school-profile h2');
    if (profileSchoolName) {
        profileSchoolName.textContent = newName;
    }
    
    // Update schoolSettings in memory
    if (window.schoolSettings) {
        window.schoolSettings.schoolName = newName;
    }
}

// Export it
window.updateSchoolNameInAllPlaces = updateSchoolNameInAllPlaces;

// ============ UI FUNCTIONS ============

function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');
    if (sidebar) sidebar.classList.toggle('-translate-x-full');
    if (overlay) overlay.classList.toggle('hidden');
}

function toggleUserMenu() {
    const menu = document.getElementById('user-menu');
    if (menu) menu.classList.toggle('hidden');
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    if (typeof updateChartTheme === 'function') updateChartTheme();
}

// Load saved theme
if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
}

function toggleNotifications() {
    showToast('No new notifications', 'info');
}

function showLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.classList.remove('hidden');
}

function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.classList.add('hidden');
}

function toggleSwitch(btn) {
    const checked = btn.dataset.checked === 'true';
    btn.dataset.checked = !checked;
    
    const span = btn.querySelector('span');
    if (!checked) {
        btn.classList.remove('bg-muted');
        btn.classList.add('bg-primary');
        span.classList.remove('translate-x-1');
        span.classList.add('translate-x-6');
    } else {
        btn.classList.remove('bg-primary');
        btn.classList.add('bg-muted');
        span.classList.remove('translate-x-6');
        span.classList.add('translate-x-1');
    }
}

function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-amber-500',
        info: 'bg-blue-500'
    };
    
    const icons = {
        success: 'check-circle',
        error: 'x-circle',
        warning: 'alert-triangle',
        info: 'info'
    };
    
    toast.className = `${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in`;
    toast.innerHTML = `<i data-lucide="${icons[type]}" class="h-5 w-5 flex-shrink-0"></i><span>${message}</span>`;
    
    container.appendChild(toast);
    lucide.createIcons();
    
    setTimeout(() => {
        toast.classList.add('animate-fade-out');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ============ SETTINGS HELPER FUNCTIONS ============

window.updateSchoolLevel = function(level) {
    schoolSettings.schoolLevel = level;
    const curriculum = schoolSettings.curriculum || 'cbc';
    updateCurriculumInfo(curriculum);
};

window.updateCurriculumInfo = function(curriculum) {
    const info = CURRICULUMS[curriculum];
    const schoolLevel = schoolSettings.schoolLevel || 'secondary';
    const levelInfo = info?.levels[schoolLevel] || [];
    const subjectInfo = info?.subjects[schoolLevel] || [];
    
    const infoDiv = document.querySelector('.p-4.bg-muted\\/30.rounded-lg');
    if (infoDiv) {
        infoDiv.innerHTML = `
            <h4 class="font-sm font-medium mb-2">Curriculum Information</h4>
            <p class="text-sm text-muted-foreground"><span class="font-medium">Name:</span> ${info?.name || 'N/A'}</p>
            <p class="text-sm text-muted-foreground mt-1"><span class="font-medium">Grade Levels:</span> ${levelInfo.join(', ')}</p>
            <p class="text-sm text-muted-foreground mt-1"><span class="font-medium">Core Subjects:</span> ${subjectInfo.join(', ')}</p>
            ${customSubjects?.length ? `<p class="text-sm text-muted-foreground mt-1"><span class="font-medium">Custom Subjects:</span> ${customSubjects.join(', ')}</p>` : ''}
        `;
    }
};

window.addTerm = function() {
    const termsContainer = document.querySelector('.space-y-4');
    if (!termsContainer) return;
    
    const termCount = document.querySelectorAll('.grid.grid-cols-3').length;
    const newTermDiv = document.createElement('div');
    newTermDiv.className = 'grid grid-cols-3 gap-2';
    newTermDiv.innerHTML = `
        <input type="text" value="Term ${termCount + 1}" placeholder="Term Name" class="term-name rounded-lg border border-input bg-background px-3 py-2 text-sm">
        <input type="date" class="term-start rounded-lg border border-input bg-background px-3 py-2 text-sm">
        <input type="date" class="term-end rounded-lg border border-input bg-background px-3 py-2 text-sm">
    `;
    termsContainer.insertBefore(newTermDiv, document.querySelector('button[onclick="addTerm()"]').parentNode);
};

// Add custom subject
window.addCustomSubject = function() {
    const newSubject = document.getElementById('new-subject-name')?.value.trim();
    if (!newSubject) {
        showToast('Please enter a subject name', 'error');
        return;
    }
    
    if (!customSubjects) customSubjects = [];
    
    // Check if subject already exists
    if (customSubjects.includes(newSubject)) {
        showToast('Subject already exists', 'warning');
        return;
    }
    
    customSubjects.push(newSubject);
    schoolSettings.customSubjects = customSubjects;
    
    // Update localStorage
    localStorage.setItem('schoolSettings', JSON.stringify(schoolSettings));
    
    // Update the UI immediately
    const container = document.getElementById('custom-subjects-container');
    if (container) {
        // Remove "no subjects" message if it exists
        const noSubjectsMsg = document.getElementById('no-custom-subjects-message');
        if (noSubjectsMsg) noSubjectsMsg.remove();
        
        // Add the new subject
        const newSubjectHTML = `
            <div class="custom-subject-item flex items-center justify-between p-3 bg-secondary/30 dark:bg-secondary/20 rounded-lg border border-border group hover:bg-secondary/50 dark:hover:bg-secondary/30 transition-colors" data-subject="${newSubject}">
                <span class="text-sm font-medium text-foreground">${newSubject}</span>
                <button onclick="removeCustomSubject('${newSubject}')" class="text-destructive hover:text-destructive/80 dark:text-red-400 dark:hover:text-red-300 opacity-70 hover:opacity-100 transition-opacity">
                    <i data-lucide="x" class="h-4 w-4"></i>
                </button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', newSubjectHTML);
    }
    
    document.getElementById('new-subject-name').value = '';
    showToast(`Subject "${newSubject}" added`, 'success');
    
    // Refresh icons
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
};

// Remove custom subject
window.removeCustomSubject = function(subject) {
    if (!confirm(`Remove "${subject}" from custom subjects?`)) return;
    
    customSubjects = customSubjects.filter(s => s !== subject);
    schoolSettings.customSubjects = customSubjects;
    
    // Update localStorage
    localStorage.setItem('schoolSettings', JSON.stringify(schoolSettings));
    
    // Remove from UI
    const subjectItem = document.querySelector(`.custom-subject-item[data-subject="${subject}"]`);
    if (subjectItem) {
        subjectItem.remove();
    }
    
    // Show "no subjects" message if container is empty
    const container = document.getElementById('custom-subjects-container');
    if (container && container.children.length === 0) {
        container.innerHTML = '<p class="text-sm text-muted-foreground col-span-3 py-4 text-center bg-muted/30 rounded-lg" id="no-custom-subjects-message">No custom subjects added yet</p>';
    }
    
    showToast(`Subject "${subject}" removed`, 'info');
};

// Save all settings (includes custom subjects)
window.saveAllSettings = async function() {
    const curriculum = document.getElementById('settings-curriculum')?.value;
    const schoolName = document.getElementById('settings-school-name')?.value;
    const schoolLevel = document.getElementById('settings-school-level')?.value;
    
    // Collect terms
    const terms = [];
    document.querySelectorAll('.grid.grid-cols-3').forEach((termDiv) => {
        const nameInput = termDiv.querySelector('.term-name');
        const startInput = termDiv.querySelector('.term-start');
        const endInput = termDiv.querySelector('.term-end');
        if (nameInput && startInput && endInput && nameInput.value) {
            terms.push({
                name: nameInput.value,
                startDate: startInput.value,
                endDate: endInput.value
            });
        }
    });
    
    const newSettings = {
        curriculum,
        schoolName,
        schoolLevel,
        terms: terms.length ? terms : schoolSettings.terms,
        customSubjects: customSubjects || []
    };
    
    // Show loading
    showLoading();
    
    try {
        // Save to backend
        const response = await api.admin.updateSchoolSettings(newSettings);
        
        if (response && response.success) {
            // Update local settings
            schoolSettings = response.data;
            customSubjects = response.data.customSubjects || [];
            
            // Update localStorage
            localStorage.setItem('schoolSettings', JSON.stringify(response.data));
            
            showToast('✅ Settings saved successfully!', 'success');
            
            // Refresh the current section to show updated data
            await showDashboardSection(currentSection);
        } else {
            throw new Error('Failed to save settings');
        }
    } catch (error) {
        console.error('Save settings error:', error);
        showToast(error.message || 'Failed to save settings', 'error');
    } finally {
        hideLoading();
    }
};

// ============ DUTY HANDLERS ============

async function handleGenerateDutyRoster() {
    const startDate = document.getElementById('duty-start-date')?.value;
    const endDate = document.getElementById('duty-end-date')?.value;
    
    if (!startDate || !endDate) {
        showToast('Please select start and end dates', 'error');
        return;
    }
    
    await generateDutyRoster(startDate, endDate);
    await showDashboardSection('duty');
}

async function handleCheckIn() {
    await checkInDuty();
}

async function handleCheckOut() {
    await checkOutDuty();
}

async function handleSwapRequest() {
    const date = document.getElementById('swap-date')?.value;
    const reason = document.getElementById('swap-reason')?.value;
    const targetTeacherId = document.getElementById('swap-target')?.value || null;
    
    if (!date || !reason) {
        showToast('Please select date and enter reason', 'error');
        return;
    }
    
    await requestDutySwap(date, reason, targetTeacherId);
}

async function saveDutyPreferences() {
    // Collect preferred days
    const preferredDays = Array.from(document.querySelectorAll('input[name="preferredDays"]:checked'))
        .map(cb => cb.value);
    
    // Collect preferred areas
    const preferredAreas = Array.from(document.querySelectorAll('input[name="preferredAreas"]:checked'))
        .map(cb => cb.value);
    
    const maxDutiesPerWeek = parseInt(document.getElementById('max-duties')?.value) || 3;
    
    // Collect blackout dates
    const blackoutDates = [];
    document.querySelectorAll('#blackout-dates-list .flex.justify-between').forEach(div => {
        const dateSpan = div.querySelector('span');
        if (dateSpan && dateSpan.textContent) {
            // Convert back to YYYY-MM-DD format
            const date = new Date(dateSpan.textContent);
            if (!isNaN(date.getTime())) {
                blackoutDates.push(date.toISOString().split('T')[0]);
            }
        }
    });
    
    const preferences = {
        preferredDays,
        preferredAreas,
        maxDutiesPerWeek,
        blackoutDates
    };
    
    await updateDutyPreferences(preferences);
}

// ============ GRADE FUNCTIONS ============

window.updateGradeDisplay = function(input, curriculum, level) {
    const row = input.closest('tr');
    const score = parseInt(input.value);
    const gradeSpan = row.querySelector('.student-grade');
    
    if (!isNaN(score) && score >= 0 && score <= 100) {
        const gradeInfo = getGradeFromScore(score, curriculum, level);
        gradeSpan.textContent = gradeInfo.grade;
        
        let color = 'gray';
        if (score >= 80) color = 'green';
        else if (score >= 70) color = 'blue';
        else if (score >= 60) color = 'yellow';
        else if (score >= 50) color = 'orange';
        else color = 'red';
        
        gradeSpan.className = `student-grade px-2 py-1 bg-${color}-100 text-${color}-700 text-xs rounded-full`;
    } else {
        gradeSpan.textContent = '-';
        gradeSpan.className = 'student-grade px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full';
    }
};

window.saveStudentGrade = async function(button) {
    const row = button.closest('tr');
    const studentId = row.dataset.studentId;
    const subject = document.getElementById('grade-subject')?.value;
    const assessmentType = document.getElementById('grade-type')?.value;
    const score = row.querySelector('.student-score')?.value;
    const comment = row.querySelector('.student-comment')?.value;
    
    if (!subject || !score) {
        showToast('Please select subject and enter score', 'error');
        return;
    }
    
    const marksData = {
        studentId: parseInt(studentId),
        subject,
        assessmentType,
        score: parseInt(score),
        assessmentName: `${subject} ${assessmentType}`,
        date: new Date().toISOString().split('T')[0]
    };
    
    await enterMarks(marksData);
    
    if (comment) {
        await addComment(studentId, comment);
    }
};

// ============ ATTENDANCE FUNCTIONS ============

async function saveAttendance() {
    const rows = document.querySelectorAll('[data-student-id]');
    const attendanceData = [];
    
    rows.forEach(row => {
        const studentId = row.dataset.studentId;
        const status = row.querySelector('.attendance-status')?.value;
        const note = row.querySelector('.attendance-note')?.value;
        
        if (status) {
            attendanceData.push({
                studentId: parseInt(studentId),
                date: new Date().toISOString().split('T')[0],
                status,
                reason: note
            });
        }
    });
    
    showLoading();
    try {
        for (const data of attendanceData) {
            await takeAttendance(data);
        }
        showToast(`✅ Saved ${attendanceData.length} attendance records`, 'success');
    } catch (error) {
    } finally {
        hideLoading();
    }
}

// Add this function to main.js
function changeMonth(direction) {
    console.log('changeMonth called with direction:', direction);
    // Implement your month change logic here
    // This is likely for calendar navigation
    if (typeof calendarChangeMonth === 'function') {
        calendarChangeMonth(direction);
    } else {
        console.warn('calendarChangeMonth not implemented');
        showToast('Calendar navigation not available', 'info');
    }
}

// ============ CHAT FUNCTIONS ============

async function sendChatMessage() {
    const input = document.getElementById('chat-message-input');
    const message = input?.value.trim();
    
    if (!message) return;
    
    const container = document.getElementById('chat-messages-container');
    if (container) {
        container.innerHTML += `
            <div class="flex justify-end">
                <div class="chat-bubble-sent max-w-[70%]">
                    <p class="text-sm font-medium">You</p>
                    <p class="text-sm">${message}</p>
                    <p class="text-xs text-muted-foreground mt-1">just now</p>
                </div>
            </div>
        `;
        container.scrollTop = container.scrollHeight;
    }
    
    input.value = '';
    
    setTimeout(() => {
        if (container) {
            container.innerHTML += `
                <div class="flex justify-start">
                    <div class="chat-bubble-received max-w-[70%]">
                        <p class="text-sm font-medium">${currentRole === 'teacher' ? 'Ms. Atieno' : 'Alex'}</p>
                        <p class="text-sm">Thanks for your message! I'll get back to you soon.</p>
                        <p class="text-xs text-muted-foreground mt-1">just now</p>
                    </div>
                </div>
            `;
            container.scrollTop = container.scrollHeight;
        }
    }, 1000);
}

async function sendParentMessage() {
    const teacherSelect = document.getElementById('teacher-select');
    const teacherId = teacherSelect?.value;
    const input = document.getElementById('chat-message-input');
    const message = input?.value.trim();
    
    if (!teacherId || !message) {
        showToast('Please select a teacher and enter a message', 'error');
        return;
    }
    
    await sendMessage(teacherId, message);
    
    const container = document.getElementById('chat-messages-container');
    if (container) {
        container.innerHTML += `
            <div class="flex justify-end">
                <div class="chat-bubble-sent max-w-[70%]">
                    <p class="text-sm font-medium">You</p>
                    <p class="text-sm">${message}</p>
                    <p class="text-xs text-muted-foreground mt-1">just now</p>
                </div>
            </div>
        `;
        container.scrollTop = container.scrollHeight;
    }
    
    input.value = '';
}

async function sendStudentMessage() {
    const input = document.getElementById('chat-message-input');
    const message = input?.value.trim();
    
    if (!message) return;
    
    const container = document.getElementById('chat-messages-container');
    if (container) {
        container.innerHTML += `
            <div class="flex justify-end">
                <div class="chat-bubble-sent max-w-[70%]">
                    <p class="text-sm font-medium">You</p>
                    <p class="text-sm">${message}</p>
                    <p class="text-xs text-muted-foreground mt-1">just now</p>
                </div>
            </div>
        `;
        container.scrollTop = container.scrollHeight;
    }
    
    input.value = '';
}

async function askAITutor() {
    const input = document.getElementById('ai-question-input');
    const question = input?.value.trim();
    
    if (!question) return;
    
    const container = document.getElementById('ai-chat-container');
    if (!container) return;
    
    container.innerHTML += `
        <div class="flex justify-end">
            <div class="chat-bubble-sent max-w-[70%]">
                <p class="text-sm font-medium">You</p>
                <p class="text-sm">${question}</p>
                <p class="text-xs text-muted-foreground mt-1">just now</p>
            </div>
        </div>
    `;
    container.scrollTop = container.scrollHeight;
    
    input.value = '';
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'flex justify-start';
    typingDiv.innerHTML = `
        <div class="chat-bubble-received">
            <p class="text-sm text-muted-foreground">AI Tutor is typing...</p>
        </div>
    `;
    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;
    
    setTimeout(() => {
        typingDiv.remove();
        
        const responses = [
            `That's an excellent question! Let me explain...`,
            `Based on the curriculum, here's what you need to know...`,
            `Great question! Here's a step-by-step explanation...`,
            `I'd be happy to help you with that. The answer is...`
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        container.innerHTML += `
            <div class="flex justify-start">
                <div class="chat-bubble-received max-w-[70%]">
                    <p class="text-sm font-medium">AI Tutor</p>
                    <p class="text-sm">${randomResponse} "${question}" is an important concept. Would you like me to provide examples or practice problems?</p>
                    <p class="text-xs text-muted-foreground mt-1">just now</p>
                </div>
            </div>
        `;
        container.scrollTop = container.scrollHeight;
    }, 1500);
}

// ============ MISC FUNCTIONS ============

window.copyElimuid = function(elimuid) {
    navigator.clipboard.writeText(elimuid).then(() => {
        showToast('ELIMUID copied to clipboard', 'success');
    }).catch(() => {
        showToast('Failed to copy', 'error');
    });
};

async function handleChangePassword() {
    const currentPassword = document.getElementById('current-password')?.value;
    const newPassword = document.getElementById('new-password')?.value;
    const confirmPassword = document.getElementById('confirm-password')?.value;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
        showToast('Please fill all password fields', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showToast('New passwords do not match', 'error');
        return;
    }
    
    showLoading();
    try {
        await changePassword(currentPassword, newPassword);
        showToast('Password updated successfully', 'success');
        
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
    } catch (error) {
        showToast(error.message || 'Failed to update password', 'error');
    } finally {
        hideLoading();
    }

}

// ============================================
// ADMIN CALENDAR SECTION - ADD THIS FUNCTION
// ============================================

// ============================================
// ENHANCED BEAUTIFUL CALENDAR
// ============================================

// Calendar state
let calendarState = {
    currentDate: new Date(),
    viewMode: 'month',
    selectedDate: null
};

// Enhanced calendar colors
const calendarColors = [
    { bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-500', text: 'text-blue-700', dot: 'bg-blue-500' },
    { bg: 'bg-green-100 dark:bg-green-900/30', border: 'border-green-500', text: 'text-green-700', dot: 'bg-green-500' },
    { bg: 'bg-purple-100 dark:bg-purple-900/30', border: 'border-purple-500', text: 'text-purple-700', dot: 'bg-purple-500' },
    { bg: 'bg-amber-100 dark:bg-amber-900/30', border: 'border-amber-500', text: 'text-amber-700', dot: 'bg-amber-500' },
    { bg: 'bg-pink-100 dark:bg-pink-900/30', border: 'border-pink-500', text: 'text-pink-700', dot: 'bg-pink-500' },
    { bg: 'bg-indigo-100 dark:bg-indigo-900/30', border: 'border-indigo-500', text: 'text-indigo-700', dot: 'bg-indigo-500' }
];

// Enhanced calendar render
function renderAdminCalendar() {
    const events = loadCalendarEvents();
    const year = calendarState.currentDate.getFullYear();
    const month = calendarState.currentDate.getMonth();
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonth = monthNames[month];
    const currentYear = year;
    
    // Get first day of month and total days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    let calendarDays = [];
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const date = new Date(year, month - 1, day);
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = events.filter(e => e.date === dateStr);
        
        calendarDays.push(renderEnhancedCalendarDay({
            dayNumber: day,
            isCurrentMonth: false,
            isToday: false,
            events: dayEvents,
            date: date,
            dateStr: dateStr
        }));
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const date = new Date(year, month, day);
        const dayEvents = events.filter(e => e.date === dateStr);
        const isToday = date.toDateString() === new Date().toDateString();
        
        calendarDays.push(renderEnhancedCalendarDay({
            dayNumber: day,
            isCurrentMonth: true,
            isToday: isToday,
            events: dayEvents,
            date: date,
            dateStr: dateStr
        }));
    }
    
    // Next month days (to fill grid)
    const totalCells = calendarDays.length;
    const remainingCells = 42 - totalCells;
    for (let day = 1; day <= remainingCells; day++) {
        const dateStr = `${year}-${String(month + 2).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = events.filter(e => e.date === dateStr);
        
        calendarDays.push(renderEnhancedCalendarDay({
            dayNumber: day,
            isCurrentMonth: false,
            isToday: false,
            events: dayEvents,
            date: new Date(year, month + 1, day),
            dateStr: dateStr
        }));
    }
    
    // Get upcoming events
    const upcomingEvents = getUpcomingEvents(events, 8);
    
    // Get stats
    const totalEvents = events.length;
    const thisMonthEvents = events.filter(e => {
        const eventDate = new Date(e.date);
        return eventDate.getMonth() === month && eventDate.getFullYear() === year;
    }).length;
    
    return `
        <div class="space-y-6 animate-fade-in">
            <!-- Header with gradient -->
            <div class="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white shadow-xl">
                <div class="absolute right-0 top-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-white/10"></div>
                <div class="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-black/10"></div>
                <div class="relative z-10">
                    <h2 class="text-4xl font-bold">School Calendar</h2>
                    <p class="mt-2 text-white/80">Manage your school events and schedules</p>
                </div>
            </div>
            
            <!-- Navigation Bar -->
            <div class="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-card p-4 shadow-sm border">
                <div class="flex items-center gap-3">
                    <button onclick="calendarChangeMonth(-1)" class="flex h-10 w-10 items-center justify-center rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all">
                        <i data-lucide="chevron-left" class="h-5 w-5"></i>
                    </button>
                    <button onclick="calendarGoToToday()" class="h-10 px-4 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all font-medium">
                        Today
                    </button>
                    <button onclick="calendarChangeMonth(1)" class="flex h-10 w-10 items-center justify-center rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all">
                        <i data-lucide="chevron-right" class="h-5 w-5"></i>
                    </button>
                    <h3 class="ml-2 text-2xl font-semibold">${currentMonth} ${currentYear}</h3>
                </div>
                
                <div class="flex items-center gap-3">
                    <div class="flex items-center gap-2 text-sm">
                        <span class="flex items-center gap-1"><span class="h-3 w-3 rounded-full bg-blue-500"></span> Event</span>
                        <span class="flex items-center gap-1"><span class="h-3 w-3 rounded-full bg-green-500"></span> Today</span>
                    </div>
                    <button onclick="showAddEventModal()" class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-all shadow-md">
                        <i data-lucide="plus" class="h-4 w-4"></i>
                        <span>Add Event</span>
                    </button>
                </div>
            </div>
            
            <!-- Main Calendar Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <!-- Calendar Grid - 3/4 width -->
                <div class="lg:col-span-3 rounded-xl bg-card border shadow-lg overflow-hidden">
                    <!-- Weekday headers -->
                    <div class="grid grid-cols-7 bg-gradient-to-r from-primary/5 to-purple-500/5 border-b">
                        ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => `
                            <div class="py-4 text-center font-semibold ${index === 0 ? 'text-red-500' : index === 6 ? 'text-red-500' : 'text-foreground'}">
                                ${day}
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- Calendar days -->
                    <div class="grid grid-cols-7 divide-x divide-y">
                        ${calendarDays.join('')}
                    </div>
                </div>
                
                <!-- Sidebar - 1/4 width -->
                <div class="lg:col-span-1 space-y-6">
                    <!-- Mini Calendar -->
                    <div class="rounded-xl bg-card border shadow-lg p-4">
                        <h3 class="font-semibold mb-4 flex items-center gap-2 text-primary">
                            <i data-lucide="calendar" class="h-5 w-5"></i>
                            ${monthNames[new Date().getMonth()]}
                        </h3>
                        ${renderMiniCalendar()}
                    </div>
                    
                    <!-- Upcoming Events -->
                    <div class="rounded-xl bg-card border shadow-lg p-4">
                        <h3 class="font-semibold mb-4 flex items-center gap-2 text-primary">
                            <i data-lucide="calendar-clock" class="h-5 w-5"></i>
                            Upcoming Events
                        </h3>
                        <div class="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                            ${upcomingEvents.length > 0 ? 
                                upcomingEvents.map(event => renderEnhancedEventCard(event)).join('') 
                                : renderEmptyState('No upcoming events')}
                        </div>
                    </div>
                    
                    <!-- Quick Stats -->
                    <div class="rounded-xl bg-card border shadow-lg p-4">
                        <h3 class="font-semibold mb-4 flex items-center gap-2 text-primary">
                            <i data-lucide="bar-chart-2" class="h-5 w-5"></i>
                            Overview
                        </h3>
                        <div class="grid grid-cols-2 gap-3">
                            ${renderStatCard('Total Events', totalEvents, 'bg-blue-100', 'text-blue-600', 'calendar')}
                            ${renderStatCard('This Month', thisMonthEvents, 'bg-green-100', 'text-green-600', 'trending-up')}
                            ${renderStatCard('Today', events.filter(e => isToday(e.date)).length, 'bg-amber-100', 'text-amber-600', 'sun')}
                            ${renderStatCard('This Week', events.filter(e => isThisWeek(e.date)).length, 'bg-purple-100', 'text-purple-600', 'calendar-check')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Render enhanced calendar day
function renderEnhancedCalendarDay(day) {
    const hasEvents = day.events.length > 0;
    const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6;
    
    // Get random color for events
    const eventColor = hasEvents ? calendarColors[day.events[0]?.title?.length % calendarColors.length] : null;
    
    return `
        <div class="aspect-square p-2 ${!day.isCurrentMonth ? 'bg-muted/30' : 'bg-card'} 
                    ${day.isCurrentMonth ? 'hover:bg-accent/50' : ''} transition-all duration-200 cursor-pointer relative group 
                    border-2 ${day.isToday ? 'border-primary shadow-lg ring-2 ring-primary/20' : 'border-transparent'}"
             onclick="showDayDetails('${day.dateStr}')">
            
            <!-- Day number with special styling for today -->
            <div class="flex justify-between items-start">
                <span class="text-sm font-medium ${!day.isCurrentMonth ? 'text-muted-foreground' : ''} 
                             ${day.isToday ? 'bg-primary text-primary-foreground w-7 h-7 flex items-center justify-center rounded-full shadow-sm' : ''}">
                    ${day.dayNumber}
                </span>
                
                <!-- Event indicators -->
                ${hasEvents ? `
                    <div class="flex gap-0.5">
                        ${day.events.slice(0, 3).map((e, i) => {
                            const colors = ['bg-pink-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500'];
                            return `<span class="w-2 h-2 rounded-full ${colors[i % colors.length]} animate-pulse"></span>`;
                        }).join('')}
                        ${day.events.length > 3 ? '<span class="text-xs font-bold text-primary">+</span>' : ''}
                    </div>
                ` : ''}
            </div>
            
            <!-- Event preview (max 2 events) -->
            ${hasEvents ? `
                <div class="mt-1 space-y-0.5">
                    ${day.events.slice(0, 2).map(event => `
                        <div class="text-[10px] truncate ${eventColor?.text || 'text-primary'} font-medium leading-tight">
                            • ${event.title}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            <!-- Event count badge -->
            ${hasEvents && day.events.length > 2 ? `
                <div class="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-bounce">
                    ${day.events.length}
                </div>
            ` : ''}
            
            <!-- Hover preview tooltip -->
            <div class="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-popover border shadow-xl rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                <p class="text-xs font-semibold border-b pb-1 mb-2">
                    ${day.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                ${hasEvents ? `
                    <div class="space-y-1 max-h-32 overflow-y-auto">
                        ${day.events.slice(0, 4).map(e => `
                            <div class="text-xs flex items-center gap-1 py-0.5">
                                <span class="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
                                <span class="truncate">${e.title}</span>
                            </div>
                        `).join('')}
                        ${day.events.length > 4 ? `<p class="text-xs text-primary mt-1">+${day.events.length - 4} more...</p>` : ''}
                    </div>
                ` : '<p class="text-xs text-muted-foreground">No events scheduled</p>'}
            </div>
        </div>
    `;
}

// Render enhanced event card
function renderEnhancedEventCard(event) {
    const eventDate = new Date(event.date);
    const isToday = eventDate.toDateString() === new Date().toDateString();
    const isTomorrow = new Date(eventDate.setDate(eventDate.getDate() - 1)).toDateString() === new Date().toDateString();
    
    let dateLabel = formatDate(event.date);
    if (isToday) dateLabel = 'Today';
    else if (isTomorrow) dateLabel = 'Tomorrow';
    
    const colors = [
        { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-l-blue-500', text: 'text-blue-700', icon: 'text-blue-500' },
        { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-l-green-500', text: 'text-green-700', icon: 'text-green-500' },
        { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-l-purple-500', text: 'text-purple-700', icon: 'text-purple-500' },
        { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-l-amber-500', text: 'text-amber-700', icon: 'text-amber-500' },
        { bg: 'bg-pink-50 dark:bg-pink-900/20', border: 'border-l-pink-500', text: 'text-pink-700', icon: 'text-pink-500' }
    ];
    const colorIndex = event.title.length % colors.length;
    const color = colors[colorIndex];
    
    return `
        <div class="relative group overflow-hidden rounded-lg border-l-4 ${color.border} ${color.bg} hover:shadow-md transition-all p-3 cursor-pointer" onclick="showDayDetails('${event.date}')">
            <div class="flex justify-between items-start">
                <div class="flex-1 min-w-0">
                    <p class="font-semibold text-sm truncate">${event.title}</p>
                    <div class="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span class="flex items-center gap-1">
                            <i data-lucide="calendar" class="h-3 w-3 ${color.icon}"></i>
                            ${dateLabel}
                        </span>
                        ${event.time ? `
                            <span class="flex items-center gap-1">
                                <i data-lucide="clock" class="h-3 w-3 ${color.icon}"></i>
                                ${event.time}
                            </span>
                        ` : ''}
                    </div>
                    ${event.description ? `
                        <p class="text-xs text-muted-foreground mt-2 line-clamp-2">${event.description.substring(0, 80)}${event.description.length > 80 ? '...' : ''}</p>
                    ` : ''}
                </div>
                <button onclick="event.stopPropagation(); deleteEvent('${event.id}')" class="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded-lg text-red-600 transition-all">
                    <i data-lucide="trash-2" class="h-3 w-3"></i>
                </button>
            </div>
            ${event.location ? `
                <div class="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                    <i data-lucide="map-pin" class="h-3 w-3 ${color.icon}"></i>
                    <span class="truncate">${event.location}</span>
                </div>
            ` : ''}
        </div>
    `;
}

// Render mini calendar
function renderMiniCalendar() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let days = [];
    
    // Empty cells
    for (let i = 0; i < firstDay; i++) {
        days.push('<div class="aspect-square"></div>');
    }
    
    // Days of month
    for (let d = 1; d <= daysInMonth; d++) {
        const isToday = d === today.getDate();
        days.push(`
            <div class="aspect-square flex items-center justify-center">
                <button onclick="calendarGoToDate(${year}, ${month}, ${d})" 
                    class="w-8 h-8 text-sm rounded-full flex items-center justify-center transition-all
                    ${isToday ? 'bg-primary text-primary-foreground font-bold shadow-md' : 'hover:bg-accent'}">
                    ${d}
                </button>
            </div>
        `);
    }
    
    return `
        <div class="grid grid-cols-7 gap-1 text-center">
            ${['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => `
                <div class="text-xs font-medium text-muted-foreground py-1">${day}</div>
            `).join('')}
            ${days.join('')}
        </div>
    `;
}

// Render stat card
function renderStatCard(label, value, bgColor, textColor, icon) {
    return `
        <div class="p-3 ${bgColor} rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1">
            <div class="flex flex-col items-center text-center">
                <i data-lucide="${icon}" class="h-5 w-5 ${textColor} mb-1"></i>
                <p class="text-xl font-bold ${textColor}">${value}</p>
                <p class="text-xs text-muted-foreground mt-0.5">${label}</p>
            </div>
        </div>
    `;
}

// Render empty state
function renderEmptyState(message) {
    return `
        <div class="text-center py-8">
            <i data-lucide="calendar-x" class="h-12 w-12 mx-auto text-muted-foreground mb-3"></i>
            <p class="text-sm text-muted-foreground">${message}</p>
        </div>
    `;
}

// Get upcoming events
function getUpcomingEvents(events, limit = 10) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return events
        .filter(e => new Date(e.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, limit);
}

// Helper functions
function isToday(dateString) {
    const today = new Date();
    const date = new Date(dateString);
    return date.toDateString() === today.toDateString();
}

function isThisWeek(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return date >= startOfWeek && date <= endOfWeek;
}

// Calendar navigation functions
window.calendarChangeMonth = function(direction) {
    calendarState.currentDate.setMonth(calendarState.currentDate.getMonth() + direction);
    showDashboardSection('calendar');
};

window.calendarGoToToday = function() {
    calendarState.currentDate = new Date();
    showDashboardSection('calendar');
};

window.calendarGoToDate = function(year, month, day) {
    calendarState.currentDate = new Date(year, month, day);
    showDashboardSection('calendar');
};

// ============ CROSS-TAB EVENT LISTENERS ============

// Listen for student added events from other tabs
window.addEventListener('student-added', function(e) {
    console.log('Student added in another tab, refreshing...', e.detail);
    
    const user = getCurrentUser();
    if (user?.role === 'teacher' && typeof refreshMyStudents === 'function') {
        refreshMyStudents();
    } else if (user?.role === 'admin' && typeof refreshStudentsList === 'function') {
        refreshStudentsList();
    }
});

// ============================================
// REFRESH FUNCTIONS - Add to main.js
// ============================================

// Refresh students list (admin)
async function refreshStudentsList() {
    const container = document.getElementById('students-table-body');
    if (!container) return;
    
    try {
        const students = await loadAllStudents();
        const tbody = container;
        
        if (students.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-muted-foreground">No students found</td></tr>';
            return;
        }
        
        let html = '';
        students.forEach(student => {
            const user = student.User || {};
            const name = user.name || 'Unknown';
            const status = student.status || 'active';
            const statusClass = status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700';
            
            html += `
                <tr class="hover:bg-accent/50 transition-colors">
                    <td class="px-4 py-3">
                        <div class="flex items-center gap-3">
                            <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <span class="font-medium text-blue-700 text-sm">${getInitials(name)}</span>
                            </div>
                            <span class="font-medium">${name}</span>
                        </div>
                    </td>
                    <td class="px-4 py-3"><span class="font-mono text-xs bg-muted px-2 py-1 rounded">${student.elimuid || 'N/A'}</span></td>
                    <td class="px-4 py-3">${student.grade || 'N/A'}</td>
                    <td class="px-4 py-3"><span class="px-2 py-1 ${statusClass} text-xs rounded-full">${status}</span></td>
                    <td class="px-4 py-3">${student.parents?.length || 0}</td>
                    <td class="px-4 py-3 text-right">
                        <button onclick="viewStudentDetails('${student.id}')" class="p-2 hover:bg-accent rounded-lg"><i data-lucide="eye" class="h-4 w-4"></i></button>
                        <button onclick="copyElimuid('${student.elimuid}')" class="p-2 hover:bg-accent rounded-lg"><i data-lucide="copy" class="h-4 w-4"></i></button>
                    </td>
                </tr>
            `;
        });
        
        tbody.innerHTML = html;
        
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    } catch (error) {
        console.error('Error refreshing students:', error);
        container.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-red-500">Error loading students</td></tr>';
    }
}

// Add this near the other refresh functions (around line 8000)
async function refreshClassesList() {
    const container = document.getElementById('classes-list-container');
    if (!container) return;
    
    try {
        const classes = await loadAllClasses();
        
        if (classes.length === 0) {
            container.innerHTML = '<div class="text-center py-12 text-muted-foreground">No classes found</div>';
            return;
        }
        
        let html = '';
        classes.forEach(cls => {
            const currentTeacher = cls.Teacher?.User?.name || 'Not assigned';
            html += `
                <div class="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="font-semibold">${cls.name}</h3>
                            <p class="text-sm text-muted-foreground">Grade: ${cls.grade} | Stream: ${cls.stream || 'N/A'}</p>
                            <p class="text-sm mt-1">
                                <span class="font-medium">Class Teacher:</span> 
                                <span class="${cls.Teacher ? 'text-green-600' : 'text-yellow-600'}">${currentTeacher}</span>
                            </p>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="editClass('${cls.id}')" class="p-2 hover:bg-accent rounded-lg"><i data-lucide="edit" class="h-4 w-4"></i></button>
                            <button onclick="deleteClass('${cls.id}')" class="p-2 hover:bg-red-100 rounded-lg text-red-600"><i data-lucide="trash-2" class="h-4 w-4"></i></button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    } catch (error) {
        console.error('Error refreshing classes:', error);
        container.innerHTML = '<div class="text-center py-8 text-red-500">Error loading classes</div>';
    }
}

// Add this function
function refreshDutyPointsDisplay() {
    const container = document.getElementById('teacher-points-table');
    if (!container) return;
    
    const teachers = dashboardData?.teachers || [];
    
    let html = '';
    teachers.forEach(t => {
        const points = dutyPoints.teachers[t.id]?.points || 0;
        const reliability = t.statistics?.reliabilityScore || 100;
        const dutiesCompleted = t.statistics?.dutiesCompleted || 0;
        html += `
            <tr class="hover:bg-accent/50 transition-colors">
                <td class="px-4 py-3 font-medium">${t.User?.name || 'Unknown'}</td>
                <td class="px-4 py-3 text-center">
                    <span class="font-bold text-lg ${points >= 100 ? 'text-green-600' : points >= 50 ? 'text-blue-600' : 'text-gray-600'}">
                        ${points}
                    </span>
                </td>
                <td class="px-4 py-3 text-center">${dutiesCompleted}</td>
                <td class="px-4 py-3 text-center">
                    <div class="flex items-center justify-center gap-2">
                        <div class="h-2 w-16 rounded-full bg-muted overflow-hidden">
                            <div class="h-full w-[${reliability}%] bg-green-500 rounded-full"></div>
                        </div>
                        <span>${reliability}%</span>
                    </div>
                </td>
                <td class="px-4 py-3 text-right">
                    <button onclick="showTeacherPointHistory('${t.id}')" class="p-2 hover:bg-accent rounded-lg">
                        <i data-lucide="history" class="h-4 w-4"></i>
                    </button>
                    <button onclick="showAddPointsModal('${t.id}', '${t.User?.name}')" class="p-2 hover:bg-accent rounded-lg">
                        <i data-lucide="plus-circle" class="h-4 w-4 text-green-600"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    container.innerHTML = html;
    
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

// Add this near the other refresh functions
async function refreshStudentDashboard() {
    try {
        const grades = await api.student.getGrades();
        const attendance = await api.student.getAttendance();
        
        dashboardData = {
            grades: grades.data || [],
            attendance: attendance.data || []
        };
        
        if (currentSection === 'dashboard') {
            await showDashboardSection('dashboard');
        } else if (currentSection === 'grades') {
            await showDashboardSection('grades');
        } else if (currentSection === 'attendance') {
            await showDashboardSection('attendance');
        }
    } catch (error) {
        console.error('Error refreshing student dashboard:', error);
    }
}

// Refresh teachers list (admin)
async function refreshTeachersList() {
    const container = document.getElementById('teachers-table-container');
    if (!container) return;
    
    try {
        const teachers = await loadAllTeachers();
        container.innerHTML = renderTeachersTable(teachers);
        
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    } catch (error) {
        console.error('Error refreshing teachers:', error);
        container.innerHTML = '<div class="text-center py-8 text-red-500">Error loading teachers</div>';
    }
}

// Refresh my students (teacher)
async function refreshMyStudents() {
    const container = document.getElementById('my-students-table');
    if (!container) return;
    
    try {
        const students = await loadMyStudents();
        
        if (students.length === 0) {
            container.innerHTML = '<div class="text-center py-8 text-muted-foreground">No students yet. Click "Add Student" to get started.</div>';
            return;
        }
        
        let html = '';
        students.forEach(student => {
            const user = student.User || {};
            html += `
                <tr class="hover:bg-accent/50 transition-colors">
                    <td class="px-4 py-3">
                        <div class="flex items-center gap-3">
                            <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <span class="font-medium text-blue-700 text-sm">${getInitials(user.name)}</span>
                            </div>
                            <span class="font-medium">${user.name}</span>
                        </div>
                    </td>
                    <td class="px-4 py-3">Grade ${student.grade}</td>
                    <td class="px-4 py-3"><span class="font-mono text-xs bg-muted px-2 py-1 rounded">${student.elimuid}</span></td>
                    <td class="px-4 py-3">
                        <div class="flex items-center gap-2">
                            <div class="h-2 w-16 rounded-full bg-muted overflow-hidden">
                                <div class="h-full w-[${student.attendance || 95}%] bg-green-500 rounded-full"></div>
                            </div>
                            <span class="text-xs">${student.attendance || 95}%</span>
                        </div>
                    </td>
                    <td class="px-4 py-3"><span class="font-semibold">${student.average || 0}%</span></td>
                    <td class="px-4 py-3 text-right">
                        <button onclick="copyElimuid('${student.elimuid}')" class="p-2 hover:bg-accent rounded-lg"><i data-lucide="copy" class="h-4 w-4"></i></button>
                        <button onclick="viewStudentDetails('${student.id}')" class="p-2 hover:bg-accent rounded-lg"><i data-lucide="eye" class="h-4 w-4"></i></button>
                    </td>
                </tr>
            `;
        });
        
        container.innerHTML = html;
        
        // Update stats
        const countEl = document.getElementById('my-students-count');
        if (countEl) countEl.textContent = students.length;
        
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    } catch (error) {
        console.error('Error refreshing my students:', error);
        container.innerHTML = '<div class="text-center py-8 text-red-500">Error loading students</div>';
    }
}

// Listen for attendance updates
window.addEventListener('attendance-updated', function() {
    console.log('Attendance updated, refreshing...');
    
    if (typeof refreshMyStudents === 'function') {
        refreshMyStudents();
    }
    if (typeof loadStudentAnalytics === 'function') {
        loadStudentAnalytics();
    }
});

// Listen for class updates
window.addEventListener('class-updated', function() {
    console.log('Class updated, refreshing...');
    
    if (typeof refreshClassesList === 'function') {
        refreshClassesList();
    }
});

// Add these near the duty points functions
window.resetDutyPoints = function() {
    if (!confirm('⚠️ Are you sure you want to reset ALL duty points for ALL teachers? This action cannot be undone.')) return;
    
    dutyPoints = {
        teachers: {},
        areas: {
            'morning': { basePoints: 10, multiplier: 1 },
            'lunch': { basePoints: 15, multiplier: 1.5 },
            'afternoon': { basePoints: 12, multiplier: 1.2 },
            'whole_day': { basePoints: 25, multiplier: 2.5 }
        }
    };
    
    saveDutyPoints();
    refreshDutyPointsDisplay();
    showToast('All duty points have been reset', 'info');
};

window.showTeacherPointHistory = function(teacherId) {
    const teacher = dutyPoints.teachers[teacherId];
    if (!teacher || !teacher.history || teacher.history.length === 0) {
        showToast('No history available for this teacher', 'info');
        return;
    }
    
    let historyHTML = '<div class="space-y-2 max-h-96 overflow-y-auto">';
    teacher.history.forEach(record => {
        historyHTML += `
            <div class="p-2 border-b">
                <p class="text-sm"><span class="font-medium">${record.points > 0 ? '+' : ''}${record.points} points</span> - ${record.reason}</p>
                <p class="text-xs text-muted-foreground">${formatDate(record.date)}</p>
            </div>
        `;
    });
    historyHTML += '</div>';
    
    alert(`Point History:\n${teacher.history.map(h => `${h.points > 0 ? '+' : ''}${h.points}: ${h.reason} (${formatDate(h.date)})`).join('\n')}`);
};

window.showAddPointsModal = function(teacherId, teacherName) {
    const points = prompt(`Enter points to add for ${teacherName}:`, '10');
    if (points === null) return;
    
    const amount = parseInt(points);
    if (isNaN(amount)) {
        showToast('Please enter a valid number', 'error');
        return;
    }
    
    const reason = prompt('Enter reason for adding points:', 'Manual adjustment');
    if (reason === null) return;
    
    updateTeacherDutyPoints(teacherId, amount, reason);
};

// ============ EXPORT GLOBAL FUNCTIONS ============
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.handleAuthSubmit = handleAuthSubmit;
window.verifySchoolCodeInput = verifySchoolCodeInput;
window.showDashboard = showDashboard;
window.showDashboardSection = showDashboardSection;
window.toggleMobileSidebar = toggleMobileSidebar;
window.toggleUserMenu = toggleUserMenu;
window.toggleTheme = toggleTheme;
window.toggleNotifications = toggleNotifications;
window.showToast = showToast;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.showNameChangeModal = showNameChangeModal;
window.closeNameChangeModal = closeNameChangeModal;
window.processNameChange = processNameChange;
window.updateChart = function(value, chartId) { console.log(`Updating chart ${chartId} with value ${value}`); };
window.updateSchoolLevel = window.updateSchoolLevel;
window.updateCurriculumInfo = window.updateCurriculumInfo;
window.addTerm = window.addTerm;
window.addCustomSubject = window.addCustomSubject;
window.removeCustomSubject = window.removeCustomSubject;
window.saveAllSettings = window.saveAllSettings;
window.updateGradeDisplay = window.updateGradeDisplay;
window.saveStudentGrade = window.saveStudentGrade;
window.toggleSwitch = toggleSwitch;
window.sendChatMessage = sendChatMessage;
window.sendParentMessage = sendParentMessage;
window.sendStudentMessage = sendStudentMessage;
window.askAITutor = askAITutor;
window.handleGenerateDutyRoster = handleGenerateDutyRoster;
window.handleCheckIn = handleCheckIn;
window.handleCheckOut = handleCheckOut;
window.handleSwapRequest = handleSwapRequest;
window.saveDutyPreferences = saveDutyPreferences;
window.saveAttendance = saveAttendance;
window.copyElimuid = copyElimuid;
window.handleChangePassword = handleChangePassword;
window.showDayDetails = showDayDetails;
window.closeDayDetailsModal = closeDayDetailsModal;
window.showAddEventModal = showAddEventModal;
window.closeAddEventModal = closeAddEventModal;
window.saveCalendarEvent = saveCalendarEvent;
window.deleteEvent = deleteEvent;
window.changeMonth = changeMonth;
window.calendarChangeMonth = calendarChangeMonth;
window.calendarGoToToday = calendarGoToToday;
window.calendarGoToDate = calendarGoToDate;
window.closeDayDetailsModal = closeDayDetailsModal;
