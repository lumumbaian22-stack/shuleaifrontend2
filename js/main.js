// main.js - Complete file with backend integration (preserves all your logic)

// Use real backend API
const IS_DEV_MODE = false; // Set to false to use real backend

// Curriculum types with their configurations
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

// Helper function to get grade from score
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

// DEBUG: Check if API functions are loaded
console.log('Checking API functions:');
console.log('- window.fetchDashboardData:', typeof window.fetchDashboardData);
console.log('- window.apiRequest:', typeof window.apiRequest);

if (typeof window.fetchDashboardData !== 'function') {
    console.error('❌ fetchDashboardData is NOT defined! api.js may not be loading.');
} else {
    console.log('✅ fetchDashboardData is ready!');
}

// Main application variables
let currentRole = null;
let clickCount = 0;
let currentSection = 'dashboard';
let dashboardData = {};
let schoolSettings = {};
let customSubjects = [];

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    lucide.createIcons();
    
    // Load saved settings
    const savedSettings = localStorage.getItem('schoolSettings');
    if (savedSettings) {
        schoolSettings = JSON.parse(savedSettings);
        customSubjects = schoolSettings.customSubjects || [];
    }
    
    // Check if user is already authenticated
    const isAuthenticated = await checkAuth();
    
    if (isAuthenticated) {
        const user = JSON.parse(localStorage.getItem('user'));
        await showDashboard(user.role);
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

// Auth modal handling
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
        // Role-specific signup forms
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
                    <label class="block text-sm font-medium mb-1">Password</label>
                    <input type="password" id="auth-password" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
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
                <div>
                    <label class="block text-sm font-medium mb-1">School ID</label>
                    <input type="text" id="auth-school-id" placeholder="e.g., NHS-2024-001" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Subject</label>
                    <select id="auth-subject" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        <option>Mathematics</option>
                        <option>English</option>
                        <option>Science</option>
                        <option>History</option>
                    </select>
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
                    <label class="block text-sm font-medium mb-1">Child's ELIMUID</label>
                    <input type="text" id="auth-elimuid" placeholder="e.g., ELI-2024-001" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Password</label>
                    <input type="password" id="auth-password" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                </div>
            `;
        } else if (role === 'student') {
            return `
                <div>
                    <label class="block text-sm font-medium mb-1">Full Name</label>
                    <input type="text" id="auth-name" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">ELIMUID</label>
                    <input type="text" id="auth-elimuid" placeholder="e.g., ELI-2024-001" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Password</label>
                    <input type="password" id="auth-password" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                </div>
            `;
        } else {
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
                    <label class="block text-sm font-medium mb-1">Password</label>
                    <input type="password" id="auth-password" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                </div>
            `;
        }
    }
}

async function handleAuthSubmit() {
    const modalTitle = document.getElementById('auth-modal-title').textContent;
    const mode = modalTitle.includes('Sign In') ? 'signin' : 'signup';
    const email = document.getElementById('auth-email')?.value;
    const password = document.getElementById('auth-password')?.value;
    
    if (!email || !password) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    showLoading();
    
    try {
        if (mode === 'signin') {
            await login(email, password, currentRole);
            showToast('Logged in successfully', 'success');
            await showDashboard(currentRole);
        } else {
            // SIGNUP - Handle based on role
            if (currentRole === 'teacher') {
                // TEACHER: Use teacherSignup (NOT register)
                console.log('📝 Teacher signup with data:');
                const teacherData = {
                    name: document.getElementById('auth-name')?.value,
                    email: email,
                    password: password,
                    schoolId: document.getElementById('auth-school-id')?.value,
                    subjects: [document.getElementById('auth-subject')?.value]
                };
                console.log('Teacher data:', teacherData);
                
                await teacherSignup(teacherData);
                showToast('Teacher registration submitted for approval!', 'success');
                openAuthModal(currentRole, 'signin');
            } else {
                // ADMIN/PARENT/STUDENT: Use register
                const userData = {
                    name: document.getElementById('auth-name')?.value,
                    email: email,
                    password: password,
                    role: currentRole
                };
                
                if (currentRole === 'admin') {
                    userData.schoolName = document.getElementById('auth-school-name')?.value;
                    userData.curriculum = document.getElementById('auth-curriculum')?.value || 'cbc';
                } else if (currentRole === 'parent') {
                    userData.schoolCode = 'SCH-2026-00005'; // Use your existing school code
                    userData.elimuid = document.getElementById('auth-elimuid')?.value;
                } else if (currentRole === 'student') {
                    userData.schoolCode = 'SCH-2026-00005'; // Use your existing school code
                    userData.elimuid = document.getElementById('auth-elimuid')?.value;
                }
                
                console.log('Registering with data:', userData);
                await register(userData);
                showToast('Registration successful! Please sign in.', 'success');
                openAuthModal(currentRole, 'signin');
            }
        }
    } catch (error) {
        console.error('Auth error:', error);
        showToast(error.message || 'Authentication failed', 'error');
    } finally {
        hideLoading();
        closeAuthModal();
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

async function processNameChange() {
    const newName = document.getElementById('new-school-name')?.value;
    
    if (!newName) {
        showToast('Please enter a new school name', 'error');
        return;
    }
    
    try {
        await apiRequest('/api/admin/name-change-request', {
            method: 'POST',
            body: JSON.stringify({ newName })
        });
        closeNameChangeModal();
        showToast('Name change request sent to Super Admin for approval', 'success');
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// Dashboard functions
async function showDashboard(role) {
    currentRole = role;
    const landingPage = document.getElementById('landing-page');
    const dashboardContainer = document.getElementById('dashboard-container');
    
    if (landingPage) landingPage.style.display = 'none';
    if (dashboardContainer) dashboardContainer.style.display = 'block';
    
    // Load school settings
    await loadSchoolSettings();
    
    // Fetch REAL dashboard data from backend
    showLoading();
    try {
        dashboardData = await fetchDashboardData(role);
        updateSidebar(role);
        updateUserInfo();
        await showDashboardSection('dashboard');
        
        // Connect WebSocket for real-time features
        if (window.CONFIG?.ENABLE_WEBSOCKET) {
            connectWebSocket();
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showToast('Failed to load dashboard data. Please check your connection.', 'error');
        
        // Fallback to mock data if API fails AND dev mode is enabled
        //if (IS_DEV_MODE) {
        //    console.log('Using mock data fallback');
        //    dashboardData = getMockData(role);
        //    updateSidebar(role);
        //    updateUserInfo();
         //   await showDashboardSection('dashboard');
       // }
    } finally {
        hideLoading();
    }
}

async function loadSchoolSettings() {
    try {
        const settings = await apiRequest('/api/settings/school');
        if (settings) {
            schoolSettings = settings;
            customSubjects = settings.customSubjects || [];
            localStorage.setItem('schoolSettings', JSON.stringify(settings));
        }
    } catch (error) {
        console.log('Using default school settings');
    }
}

async function saveSchoolSettings(settings) {
    try {
        const result = await apiRequest('/api/settings/school', {
            method: 'POST',
            body: JSON.stringify(settings)
        });
        if (result.success) {
            schoolSettings = result.settings;
            customSubjects = result.settings.customSubjects || [];
            localStorage.setItem('schoolSettings', JSON.stringify(result.settings));
            showToast('Settings saved successfully! They will reflect across all dashboards.', 'success');
            
            // Refresh current dashboard section to show updated settings
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
        // Update page title
        if (pageTitle) {
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
                'paid-schools': 'Paid Schools',
                'custom-subjects': 'Custom Subjects'
            };
            pageTitle.textContent = sectionNames[section] || 'Dashboard';
        }
        
        // Render the appropriate section
        content.innerHTML = renderDashboardSection(currentRole, section, dashboardData);
        
        // Update active state in sidebar
        updateSidebarActiveState(section);
        
        // Initialize charts if needed
        if (section === 'dashboard' || section === 'analytics') {
            setTimeout(() => {
                initRoleCharts(currentRole, dashboardData);
            }, 100);
        }
        
        // Setup section-specific listeners
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

function renderDashboardSection(role, section, data) {
    console.log('🎯 renderDashboardSection called with role:', role);
    console.log('📦 Available renderers:', {
        renderSuperAdminSection: typeof renderSuperAdminSection,
        renderAdminSection: typeof renderAdminSection,
        renderTeacherSection: typeof renderTeacherSection,
        renderParentSection: typeof renderParentSection,
        renderStudentSection: typeof renderStudentSection
    });
    
    // Direct function calls based on role
    if (role === 'super_admin' || role === 'superadmin') {
        console.log('✅ Calling renderSuperAdminSection directly');
        return renderSuperAdminSection(section, data);
    }
    
    if (role === 'admin') {
        return renderAdminSection(section, data);
    }
    
    if (role === 'teacher') {
        return renderTeacherSection(section, data);
    }
    
    if (role === 'parent') {
        return renderParentSection(section, data);
    }
    
    if (role === 'student') {
        return renderStudentSection(section, data);
    }
    
    console.error('❌ No renderer for role:', role);
    return `<div class="text-center py-12">Section not found for role: ${role}</div>`;
}
// Settings Renderers
function renderSettings(role) {
    if (role === 'admin') {
        return renderAdminSettings();
    } else if (role === 'superadmin') {
        return renderSuperAdminSettings();
    } else {
        return renderUserSettings(role);
    }
}

function renderAdminSettings() {
    const curriculum = schoolSettings.curriculum || 'cbc';
    const schoolLevel = schoolSettings.schoolLevel || 'secondary';
    const curriculumInfo = CURRICULUMS[curriculum];
    const levelInfo = curriculumInfo?.levels[schoolLevel] || [];
    const subjectInfo = curriculumInfo?.subjects[schoolLevel] || [];
    const allSubjects = [...subjectInfo, ...(customSubjects || [])];
    
    return `
        <div class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-bold">School Settings</h2>
            <p class="text-sm text-muted-foreground">Changes made here will reflect across all dashboards for this school.</p>
            
            <div class="grid gap-6">
                <!-- School Information -->
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">School Information</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">School Name</label>
                            <input type="text" id="settings-school-name" value="${schoolSettings.schoolName || 'Nairobi High School'}" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">School Level</label>
                            <select id="settings-school-level" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" onchange="updateSchoolLevel(this.value)">
                                <option value="primary" ${schoolLevel === 'primary' ? 'selected' : ''}>Primary</option>
                                <option value="secondary" ${schoolLevel === 'secondary' ? 'selected' : ''}>Secondary</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <!-- Curriculum Settings -->
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Curriculum Settings</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Select Curriculum</label>
                            <select id="settings-curriculum" onchange="updateCurriculumInfo(this.value)" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                                <option value="cbc" ${curriculum === 'cbc' ? 'selected' : ''}>CBC (Competency Based Curriculum)</option>
                                <option value="844" ${curriculum === '844' ? 'selected' : ''}>8-4-4 System</option>
                                <option value="british" ${curriculum === 'british' ? 'selected' : ''}>British Curriculum</option>
                                <option value="american" ${curriculum === 'american' ? 'selected' : ''}>American Curriculum</option>
                            </select>
                        </div>
                        
                        <div class="p-4 bg-muted/30 rounded-lg">
                            <h4 class="font-sm font-medium mb-2">Curriculum Information</h4>
                            <p class="text-sm text-muted-foreground"><span class="font-medium">Name:</span> ${curriculumInfo?.name || 'N/A'}</p>
                            <p class="text-sm text-muted-foreground mt-1"><span class="font-medium">Grade Levels:</span> ${levelInfo.join(', ')}</p>
                            <p class="text-sm text-muted-foreground mt-1"><span class="font-medium">Core Subjects:</span> ${subjectInfo.join(', ')}</p>
                            ${customSubjects?.length ? `<p class="text-sm text-muted-foreground mt-1"><span class="font-medium">Custom Subjects:</span> ${customSubjects.join(', ')}</p>` : ''}
                        </div>
                    </div>
                </div>
                
                <!-- Custom Subjects -->
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Custom Subjects</h3>
                    <p class="text-sm text-muted-foreground mb-4">Add subjects that are not in the standard curriculum</p>
                    
                    <div class="space-y-4">
                        <div class="flex gap-2">
                            <input type="text" id="new-subject-name" placeholder="e.g., French, Computer Science, Art" class="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm">
                            <button onclick="addCustomSubject()" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                                Add Subject
                            </button>
                        </div>
                        
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                            ${(customSubjects || []).map(subject => `
                                <div class="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                                    <span class="text-sm">${subject}</span>
                                    <button onclick="removeCustomSubject('${subject}')" class="text-red-600 hover:text-red-800">
                                        <i data-lucide="x" class="h-4 w-4"></i>
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <!-- Term Settings -->
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Academic Terms</h3>
                    <div class="space-y-4">
                        ${(schoolSettings.terms || [
                            { name: 'Term 1', startDate: '2024-01-15', endDate: '2024-04-12' },
                            { name: 'Term 2', startDate: '2024-05-06', endDate: '2024-08-09' },
                            { name: 'Term 3', startDate: '2024-09-02', endDate: '2024-11-29' }
                        ]).map((term, index) => `
                            <div class="grid grid-cols-3 gap-2">
                                <input type="text" value="${term.name}" placeholder="Term Name" class="term-name rounded-lg border border-input bg-background px-3 py-2 text-sm" data-index="${index}">
                                <input type="date" value="${term.startDate}" class="term-start rounded-lg border border-input bg-background px-3 py-2 text-sm" data-index="${index}">
                                <input type="date" value="${term.endDate}" class="term-end rounded-lg border border-input bg-background px-3 py-2 text-sm" data-index="${index}">
                            </div>
                        `).join('')}
                        <button onclick="addTerm()" class="text-sm text-primary hover:underline flex items-center gap-1">
                            <i data-lucide="plus" class="h-4 w-4"></i>
                            Add Term
                        </button>
                    </div>
                </div>
                
                <!-- Save Button -->
                <div class="flex justify-end">
                    <button onclick="saveAllSettings()" class="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
                        <i data-lucide="save" class="h-4 w-4"></i>
                        Save All Settings
                    </button>
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
                <!-- Global Settings -->
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
                
                <!-- Maintenance Mode -->
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
                
                <!-- Save Button -->
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

function renderUserSettings(role) {
    return `
        <div class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-bold">My Settings</h2>
            
            <div class="max-w-2xl space-y-6">
                <!-- Profile Information -->
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Profile Information</h3>
                    <div class="space-y-4">
                        <div class="grid gap-4 md:grid-cols-2">
                            <div>
                                <label class="block text-sm font-medium mb-1">First Name</label>
                                <input type="text" value="John" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Last Name</label>
                                <input type="text" value="Doe" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Email</label>
                            <input type="email" value="john@shuleai.edu" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Role</label>
                            <input type="text" value="${role}" disabled class="w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
                        </div>
                    </div>
                </div>
                
                <!-- Preferences -->
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
                            <button onclick="toggleSwitch(this); toggleTheme()" class="relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors" data-checked="false">
                                <span class="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition-transform"></span>
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Save Button -->
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

// Super Admin Section Renderers
function renderSuperAdminSection(section, data) {
    switch(section) {
        case 'dashboard':
            return renderSuperAdminDashboard(data);
        case 'schools':
            return renderSuperAdminSchools(data);
        case 'platform-health':
            return renderSuperAdminHealth(data);
        case 'name-change-requests':
            return renderSuperAdminNameChangeRequests(data);
        case 'school-approvals':
            return renderSuperAdminSchoolApprovals(data);
        case 'paid-schools':
            return renderSuperAdminPaidSchools(data);
        case 'settings':
            return renderSuperAdminSettings();
        default:
            return renderSuperAdminDashboard(data);
    }
}

function renderSuperAdminDashboard(data) {
    return `
        <div class="space-y-6 animate-fade-in">
            <!-- Stats Grid -->
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div class="rounded-xl border bg-card p-6 card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Total Schools</p>
                            <h3 class="text-2xl font-bold mt-1">${data?.totalSchools || 24}</h3>
                            <p class="text-xs text-green-600 mt-1 flex items-center gap-1">
                                <i data-lucide="trending-up" class="h-3 w-3"></i>
                                +${data?.newSchoolsThisMonth || 3} this month
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
                            <p class="text-sm font-medium text-muted-foreground">Active Admins</p>
                            <h3 class="text-2xl font-bold mt-1">${data?.activeAdmins || 18}</h3>
                            <p class="text-xs text-green-600 mt-1 flex items-center gap-1">
                                <i data-lucide="trending-up" class="h-3 w-3"></i>
                                +${data?.newAdmins || 2} new
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
                            <p class="text-sm font-medium text-muted-foreground">Pending Approvals</p>
                            <h3 class="text-2xl font-bold mt-1">${data?.pendingApprovals || 6}</h3>
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
                            <h3 class="text-2xl font-bold mt-1">$${data?.revenue || 1240}</h3>
                            <p class="text-xs text-green-600 mt-1 flex items-center gap-1">
                                <i data-lucide="trending-up" class="h-3 w-3"></i>
                                +${data?.revenueGrowth || 15}% from last month
                            </p>
                        </div>
                        <div class="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <i data-lucide="dollar-sign" class="h-6 w-6 text-emerald-600"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="grid gap-4 md:grid-cols-3">
                <button onclick="showDashboardSection('school-approvals')" class="p-4 border rounded-lg hover:bg-accent transition-colors text-left">
                    <i data-lucide="check-circle" class="h-6 w-6 text-green-600 mb-2"></i>
                    <p class="font-medium">School Approvals</p>
                    <p class="text-xs text-muted-foreground">Approve new school registrations</p>
                </button>
                <button onclick="showDashboardSection('name-change-requests')" class="p-4 border rounded-lg hover:bg-accent transition-colors text-left">
                    <i data-lucide="file-edit" class="h-6 w-6 text-amber-600 mb-2"></i>
                    <p class="font-medium">Name Change Requests</p>
                    <p class="text-xs text-muted-foreground">Review school name changes</p>
                </button>
                <button onclick="showDashboardSection('paid-schools')" class="p-4 border rounded-lg hover:bg-accent transition-colors text-left">
                    <i data-lucide="credit-card" class="h-6 w-6 text-blue-600 mb-2"></i>
                    <p class="font-medium">Paid Schools</p>
                    <p class="text-xs text-muted-foreground">Manage enabled/disabled schools</p>
                </button>
            </div>
        </div>
    `;
}

function renderSuperAdminSchools(data) {
    return `
        <div class="space-y-6 animate-fade-in">
            <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold">School Management</h2>
                <button onclick="showToast('Add school form opened', 'info')" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
                    <i data-lucide="plus" class="h-4 w-4"></i>
                    Add New School
                </button>
            </div>
            
            <!-- Schools Table -->
            <div class="rounded-xl border bg-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-muted/50">
                            <tr>
                                <th class="px-4 py-3 text-left font-medium">School</th>
                                <th class="px-4 py-3 text-left font-medium">Admin</th>
                                <th class="px-4 py-3 text-left font-medium">Level</th>
                                <th class="px-4 py-3 text-left font-medium">Curriculum</th>
                                <th class="px-4 py-3 text-left font-medium">Status</th>
                                <th class="px-4 py-3 text-left font-medium">Paid</th>
                                <th class="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            ${(data?.schools || [
                                { id: 1, name: 'Nairobi High School', adminEmail: 'admin@nairobi.edu', level: 'Secondary', curriculum: 'cbc', status: 'active', paid: true },
                                { id: 2, name: 'Mombasa Academy', adminEmail: 'admin@mombasa.edu', level: 'Primary', curriculum: '844', status: 'pending', paid: false },
                                { id: 3, name: 'Kisumu Day', adminEmail: 'admin@kisumu.edu', level: 'Secondary', curriculum: 'british', status: 'active', paid: true },
                                { id: 4, name: 'Eldoret School', adminEmail: 'admin@eldoret.edu', level: 'Primary', curriculum: 'american', status: 'suspended', paid: false }
                            ]).map(school => `
                                <tr class="hover:bg-accent/50 transition-colors">
                                    <td class="px-4 py-3 font-medium">${school.name}</td>
                                    <td class="px-4 py-3">${school.adminEmail}</td>
                                    <td class="px-4 py-3">${school.level}</td>
                                    <td class="px-4 py-3">${CURRICULUMS[school.curriculum]?.name || school.curriculum}</td>
                                    <td class="px-4 py-3">
                                        <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium 
                                            ${school.status === 'active' ? 'bg-green-100 text-green-700' : 
                                              school.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                                              'bg-red-100 text-red-700'}">
                                            ${school.status}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3">
                                        <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${school.paid ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}">
                                            ${school.paid ? 'Paid' : 'Unpaid'}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 text-right">
                                        <button onclick="showToast('View school details', 'info')" class="p-2 hover:bg-accent rounded-lg">
                                            <i data-lucide="eye" class="h-4 w-4"></i>
                                        </button>
                                        <button onclick="toggleSchoolStatus('${school.id}')" class="p-2 hover:bg-accent rounded-lg">
                                            <i data-lucide="${school.status === 'active' ? 'pause-circle' : 'play-circle'}" class="h-4 w-4"></i>
                                        </button>
                                        <button onclick="showToast('Manage school', 'info')" class="p-2 hover:bg-accent rounded-lg">
                                            <i data-lucide="more-vertical" class="h-4 w-4"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function renderSuperAdminNameChangeRequests(data) {
    return `
        <div class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-bold">School Name Change Requests</h2>
            
            <div class="rounded-xl border bg-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-muted/50">
                            <tr>
                                <th class="px-4 py-3 text-left font-medium">School</th>
                                <th class="px-4 py-3 text-left font-medium">Current Name</th>
                                <th class="px-4 py-3 text-left font-medium">Requested Name</th>
                                <th class="px-4 py-3 text-left font-medium">Payment</th>
                                <th class="px-4 py-3 text-left font-medium">Date</th>
                                <th class="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            ${(data?.nameChangeRequests || [
                                { id: 1, school: 'Nairobi High', oldName: 'Nairobi High School', newName: 'Nairobi Academy', amount: 50, date: new Date(), paid: true }
                            ]).map(request => `
                                <tr class="hover:bg-accent/50 transition-colors">
                                    <td class="px-4 py-3 font-medium">${request.school}</td>
                                    <td class="px-4 py-3">${request.oldName}</td>
                                    <td class="px-4 py-3 font-semibold text-primary">${request.newName}</td>
                                    <td class="px-4 py-3">
                                        <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700">
                                            $${request.amount} Paid
                                        </span>
                                    </td>
                                    <td class="px-4 py-3">${timeAgo(request.date)}</td>
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
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function renderSuperAdminSchoolApprovals(data) {
    return `
        <div class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-bold">Pending School Approvals</h2>
            
            <div class="rounded-xl border bg-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-muted/50">
                            <tr>
                                <th class="px-4 py-3 text-left font-medium">School Name</th>
                                <th class="px-4 py-3 text-left font-medium">Admin</th>
                                <th class="px-4 py-3 text-left font-medium">Level</th>
                                <th class="px-4 py-3 text-left font-medium">Curriculum</th>
                                <th class="px-4 py-3 text-left font-medium">Registration Date</th>
                                <th class="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            ${(data?.pendingSchools || [
                                { id: 1, name: 'Mombasa Academy', admin: 'admin@mombasa.edu', level: 'Primary', curriculum: '844', date: new Date() },
                                { id: 2, name: 'Kisumu International', admin: 'admin@kisumu.edu', level: 'Secondary', curriculum: 'british', date: new Date() }
                            ]).map(school => `
                                <tr class="hover:bg-accent/50 transition-colors">
                                    <td class="px-4 py-3 font-medium">${school.name}</td>
                                    <td class="px-4 py-3">${school.admin}</td>
                                    <td class="px-4 py-3">${school.level}</td>
                                    <td class="px-4 py-3">${CURRICULUMS[school.curriculum]?.name || school.curriculum}</td>
                                    <td class="px-4 py-3">${timeAgo(school.date)}</td>
                                    <td class="px-4 py-3 text-right">
                                        <button onclick="approveSchool('${school.id}')" class="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full hover:bg-green-200 mr-2">
                                            Approve
                                        </button>
                                        <button onclick="rejectSchool('${school.id}')" class="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full hover:bg-red-200">
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function renderSuperAdminPaidSchools(data) {
    return `
        <div class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-bold">Paid Schools Management</h2>
            
            <div class="rounded-xl border bg-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-muted/50">
                            <tr>
                                <th class="px-4 py-3 text-left font-medium">School</th>
                                <th class="px-4 py-3 text-left font-medium">Original Name</th>
                                <th class="px-4 py-3 text-left font-medium">Custom Name</th>
                                <th class="px-4 py-3 text-left font-medium">Payment Status</th>
                                <th class="px-4 py-3 text-left font-medium">Status</th>
                                <th class="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            ${(data?.paidSchools || [
                                { id: 1, name: 'Nairobi High', customName: 'Nairobi Academy', paid: true, enabled: true },
                                { id: 2, name: 'Kisumu Day', customName: 'Kisumu International School', paid: true, enabled: true },
                                { id: 3, name: 'Eldoret School', customName: 'Eldoret Junior Academy', paid: true, enabled: false }
                            ]).map(school => `
                                <tr class="hover:bg-accent/50 transition-colors">
                                    <td class="px-4 py-3 font-medium">${school.name}</td>
                                    <td class="px-4 py-3">${school.name}</td>
                                    <td class="px-4 py-3 font-semibold text-primary">${school.customName}</td>
                                    <td class="px-4 py-3">
                                        <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700">
                                            Paid
                                        </span>
                                    </td>
                                    <td class="px-4 py-3">
                                        <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${school.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                                            ${school.enabled ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 text-right">
                                        <button onclick="toggleSchoolEnabled('${school.id}')" class="p-2 hover:bg-accent rounded-lg">
                                            <i data-lucide="${school.enabled ? 'pause-circle' : 'play-circle'}" class="h-4 w-4"></i>
                                        </button>
                                        <button onclick="showToast('Edit school settings', 'info')" class="p-2 hover:bg-accent rounded-lg">
                                            <i data-lucide="settings" class="h-4 w-4"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function renderSuperAdminHealth(data) {
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

// Admin Section Renderers
function renderAdminSection(section, data) {
    switch(section) {
        case 'dashboard':
            return renderAdminDashboard(data);
        case 'teachers':
            return renderAdminTeachers(data);
        case 'calendar':
            return renderAdminCalendar(data);
        case 'duty':
            return renderAdminDuty(data);
        case 'tasks':
            return renderAdminTasks(data);
        case 'timetable':
            return renderAdminTimetable(data);
        case 'settings':
            return renderAdminSettings();
        case 'custom-subjects':
            return renderAdminCustomSubjects(data);
        default:
            return renderAdminDashboard(data);
    }
}

function renderAdminDashboard(data) {
    const curriculum = schoolSettings.curriculum || 'cbc';
    const schoolLevel = schoolSettings.schoolLevel || 'secondary';
    const curriculumInfo = CURRICULUMS[curriculum];
    
    return `
        <div class="space-y-6 animate-fade-in">
            <!-- School Profile Card -->
            <div class="rounded-xl border bg-card p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 card-hover">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div class="flex items-center gap-3 mb-2">
                            <h2 class="text-2xl font-bold">${schoolSettings.schoolName || data?.school?.name || 'Nairobi High School'}</h2>
                            <span class="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">${schoolLevel}</span>
                        </div>
                        <div class="flex items-center gap-4">
                            <p class="text-sm"><span class="font-mono bg-muted px-2 py-1 rounded">SCH-ID: ${data?.school?.id || 'NHS-2024-001'}</span></p>
                            <button onclick="showNameChangeModal()" class="text-sm text-primary hover:underline">Change School Name ($50)</button>
                        </div>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                        <p class="text-xs text-muted-foreground">Curriculum: ${curriculumInfo?.name || 'CBC'}</p>
                        <p class="text-xs text-muted-foreground mt-1">Terms: ${(schoolSettings.terms || []).length}</p>
                    </div>
                </div>
            </div>
            
            <!-- Stats Grid -->
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div class="rounded-xl border bg-card p-6 card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Total Students</p>
                            <h3 class="text-2xl font-bold mt-1">${data?.stats?.totalStudents || 543}</h3>
                            <p class="text-xs text-green-600 mt-1 flex items-center gap-1">
                                <i data-lucide="trending-up" class="h-3 w-3"></i>
                                +${data?.stats?.studentGrowth || 12}% from last term
                            </p>
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
                            <h3 class="text-2xl font-bold mt-1">${data?.stats?.totalTeachers || 28}</h3>
                            <p class="text-xs text-green-600 mt-1 flex items-center gap-1">
                                <i data-lucide="trending-up" class="h-3 w-3"></i>
                                +${data?.stats?.pendingTeachers || 4} pending approval
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
                            <h3 class="text-2xl font-bold mt-1">${data?.stats?.totalClasses || 16}</h3>
                            <p class="text-xs text-muted-foreground mt-1">Across ${data?.stats?.totalGrades || 4} grades</p>
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
                            <h3 class="text-2xl font-bold mt-1">${data?.stats?.attendanceRate || 94.2}%</h3>
                            <p class="text-xs text-yellow-600 mt-1 flex items-center gap-1">
                                <i data-lucide="alert-circle" class="h-3 w-3"></i>
                                -${data?.stats?.attendanceVariance || 2}% from target
                            </p>
                        </div>
                        <div class="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center">
                            <i data-lucide="calendar-check" class="h-6 w-6 text-amber-600"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="grid gap-4 md:grid-cols-3">
                <button onclick="showDashboardSection('teachers')" class="p-4 border rounded-lg hover:bg-accent transition-colors text-left">
                    <i data-lucide="users" class="h-6 w-6 text-blue-600 mb-2"></i>
                    <p class="font-medium">Manage Teachers</p>
                    <p class="text-xs text-muted-foreground">Approve pending teachers</p>
                </button>
                <button onclick="showDashboardSection('calendar')" class="p-4 border rounded-lg hover:bg-accent transition-colors text-left">
                    <i data-lucide="calendar" class="h-6 w-6 text-green-600 mb-2"></i>
                    <p class="font-medium">School Calendar</p>
                    <p class="text-xs text-muted-foreground">Manage events and terms</p>
                </button>
                <button onclick="showDashboardSection('settings')" class="p-4 border rounded-lg hover:bg-accent transition-colors text-left">
                    <i data-lucide="settings" class="h-6 w-6 text-purple-600 mb-2"></i>
                    <p class="font-medium">School Settings</p>
                    <p class="text-xs text-muted-foreground">Configure curriculum and subjects</p>
                </button>
            </div>
        </div>
    `;
}

function renderAdminTeachers(data) {
    return `
        <div class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-bold">Teacher Management</h2>
            
            <!-- Pending Approvals -->
            <div class="rounded-xl border bg-card overflow-hidden">
                <div class="p-4 border-b bg-yellow-50 dark:bg-yellow-900/20">
                    <h3 class="font-semibold flex items-center gap-2">
                        <i data-lucide="clock" class="h-5 w-5 text-yellow-600"></i>
                        Pending Approvals
                        <span class="ml-auto px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">${data?.pendingTeachers?.length || 2} new</span>
                    </h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-muted/50">
                            <tr>
                                <th class="px-4 py-3 text-left font-medium">Teacher</th>
                                <th class="px-4 py-3 text-left font-medium">Subject</th>
                                <th class="px-4 py-3 text-left font-medium">Applied</th>
                                <th class="px-4 py-3 text-left font-medium">School ID</th>
                                <th class="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            ${(data?.pendingTeachers || [
                                { id: 1, name: 'Jane Doe', subject: 'Mathematics', appliedAt: new Date(), schoolId: 'NHS-2024-001' },
                                { id: 2, name: 'John Smith', subject: 'Science', appliedAt: new Date(), schoolId: 'NHS-2024-001' }
                            ]).map(teacher => `
                                <tr class="hover:bg-accent/50 transition-colors">
                                    <td class="px-4 py-3">
                                        <div class="flex items-center gap-3">
                                            <div class="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center">
                                                <span class="font-medium text-violet-700 text-sm">${getInitials(teacher.name)}</span>
                                            </div>
                                            <span class="font-medium">${teacher.name}</span>
                                        </div>
                                    </td>
                                    <td class="px-4 py-3">${teacher.subject}</td>
                                    <td class="px-4 py-3">${timeAgo(teacher.appliedAt)}</td>
                                    <td class="px-4 py-3"><span class="font-mono text-xs bg-muted px-2 py-1 rounded">${teacher.schoolId}</span></td>
                                    <td class="px-4 py-3 text-right">
                                        <button onclick="approveTeacher('${teacher.id}')" class="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full hover:bg-green-200 mr-2">
                                            Approve
                                        </button>
                                        <button onclick="rejectTeacher('${teacher.id}')" class="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full hover:bg-red-200">
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Active Teachers -->
            <div class="rounded-xl border bg-card overflow-hidden">
                <div class="p-4 border-b">
                    <h3 class="font-semibold">Active Teachers</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-muted/50">
                            <tr>
                                <th class="px-4 py-3 text-left font-medium">Teacher</th>
                                <th class="px-4 py-3 text-left font-medium">Subject</th>
                                <th class="px-4 py-3 text-left font-medium">Classes</th>
                                <th class="px-4 py-3 text-left font-medium">Status</th>
                                <th class="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            ${(data?.activeTeachers || [
                                { id: 1, name: 'Mr. Kamau', subject: 'Mathematics', classes: 4, status: 'active' },
                                { id: 2, name: 'Ms. Atieno', subject: 'English', classes: 3, status: 'active' }
                            ]).map(teacher => `
                                <tr class="hover:bg-accent/50 transition-colors">
                                    <td class="px-4 py-3">
                                        <div class="flex items-center gap-3">
                                            <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                <span class="font-medium text-blue-700 text-sm">${getInitials(teacher.name)}</span>
                                            </div>
                                            <span class="font-medium">${teacher.name}</span>
                                        </div>
                                    </td>
                                    <td class="px-4 py-3">${teacher.subject}</td>
                                    <td class="px-4 py-3">${teacher.classes} classes</td>
                                    <td class="px-4 py-3">
                                        <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700">
                                            Active
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 text-right">
                                        <button onclick="showToast('View teacher details', 'info')" class="p-2 hover:bg-accent rounded-lg">
                                            <i data-lucide="eye" class="h-4 w-4"></i>
                                        </button>
                                        <button onclick="showToast('Edit teacher', 'info')" class="p-2 hover:bg-accent rounded-lg">
                                            <i data-lucide="edit" class="h-4 w-4"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function renderAdminCalendar(data) {
    const today = new Date();
    const currentMonth = today.toLocaleString('default', { month: 'long' });
    const currentYear = today.getFullYear();
    
    return `
        <div class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-bold">School Calendar - ${currentMonth} ${currentYear}</h2>
            
            <div class="grid gap-4 md:grid-cols-3">
                <div class="md:col-span-2 rounded-xl border bg-card p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-semibold">${currentMonth} ${currentYear}</h3>
                        <div class="flex gap-2">
                            <button class="p-2 hover:bg-accent rounded-lg"><i data-lucide="chevron-left" class="h-4 w-4"></i></button>
                            <button class="p-2 hover:bg-accent rounded-lg"><i data-lucide="chevron-right" class="h-4 w-4"></i></button>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-7 gap-1 text-center mb-2">
                        <div class="text-xs font-medium text-muted-foreground">Sun</div>
                        <div class="text-xs font-medium text-muted-foreground">Mon</div>
                        <div class="text-xs font-medium text-muted-foreground">Tue</div>
                        <div class="text-xs font-medium text-muted-foreground">Wed</div>
                        <div class="text-xs font-medium text-muted-foreground">Thu</div>
                        <div class="text-xs font-medium text-muted-foreground">Fri</div>
                        <div class="text-xs font-medium text-muted-foreground">Sat</div>
                    </div>
                    
                    <div class="grid grid-cols-7 gap-1">
                        ${Array.from({ length: 31 }, (_, i) => `
                            <div class="aspect-square p-1 border rounded-lg hover:bg-accent cursor-pointer ${[15, 20, 25].includes(i + 1) ? 'bg-primary/10 border-primary' : ''}">
                                <span class="text-sm">${i + 1}</span>
                                ${[15, 20, 25].includes(i + 1) ? '<div class="w-1 h-1 bg-primary rounded-full mx-auto mt-1"></div>' : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Upcoming Events</h3>
                    <div class="space-y-3">
                        ${(schoolSettings.terms || []).map(term => `
                            <div class="p-3 bg-primary/10 rounded-lg">
                                <p class="font-medium">${term.name}</p>
                                <p class="text-sm text-muted-foreground">${new Date(term.startDate).toLocaleDateString()} - ${new Date(term.endDate).toLocaleDateString()}</p>
                            </div>
                        `).join('')}
                    </div>
                    
                    <button onclick="showToast('Add event form', 'info')" class="mt-4 w-full py-2 border rounded-lg hover:bg-accent flex items-center justify-center gap-2">
                        <i data-lucide="plus" class="h-4 w-4"></i>
                        Add Event
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderAdminDuty(data) {
    return `
        <div class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-bold">Duty Management</h2>
            
            <div class="grid gap-4 md:grid-cols-2">
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Assign Duty</h3>
                    <div class="space-y-3">
                        <select id="duty-teacher" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                            <option value="">Select Teacher</option>
                            <option value="1">Mr. Kamau</option>
                            <option value="2">Ms. Atieno</option>
                            <option value="3">Mr. Omondi</option>
                        </select>
                        <select id="duty-slot" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                            <option value="">Select Duty</option>
                            <option value="gate-morning">Main Gate (7:30-10:30)</option>
                            <option value="gate-afternoon">Main Gate (10:30-13:30)</option>
                            <option value="dining-morning">Dining Hall (7:30-10:30)</option>
                            <option value="dining-afternoon">Dining Hall (10:30-13:30)</option>
                            <option value="library">Library (13:30-16:30)</option>
                        </select>
                        <button onclick="assignDuty()" class="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90">
                            Assign Duty
                        </button>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Today's Duty Roster</h3>
                    <div class="space-y-3">
                        <div class="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                                <p class="font-medium">Main Gate</p>
                                <p class="text-sm text-muted-foreground">7:30 AM - 10:30 AM</p>
                            </div>
                            <span class="font-medium">Mr. Kamau</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                                <p class="font-medium">Main Gate</p>
                                <p class="text-sm text-muted-foreground">10:30 AM - 1:30 PM</p>
                            </div>
                            <span class="font-medium">Ms. Atieno</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                                <p class="font-medium">Dining Hall</p>
                                <p class="text-sm text-muted-foreground">1:30 PM - 4:30 PM</p>
                            </div>
                            <span class="font-medium">Mr. Omondi</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderAdminTasks(data) {
    return `
        <div class="space-y-6 animate-fade-in">
            <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold">My Tasks</h2>
                <button onclick="addTask()" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
                    <i data-lucide="plus" class="h-4 w-4"></i>
                    New Task
                </button>
            </div>
            
            <div class="grid gap-4">
                <div class="rounded-xl border bg-card p-6">
                    <div class="space-y-2">
                        <div class="flex items-center gap-3 p-3 hover:bg-accent/50 rounded-lg">
                            <input type="checkbox" class="rounded">
                            <div class="flex-1">
                                <p class="font-medium">Review teacher applications</p>
                                <p class="text-sm text-muted-foreground">Due: March 20, 2024</p>
                            </div>
                            <span class="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">High</span>
                        </div>
                        <div class="flex items-center gap-3 p-3 hover:bg-accent/50 rounded-lg">
                            <input type="checkbox" class="rounded" checked>
                            <div class="flex-1">
                                <p class="font-medium line-through text-muted-foreground">Prepare staff meeting agenda</p>
                                <p class="text-sm text-muted-foreground">Completed</p>
                            </div>
                            <span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Done</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderAdminTimetable(data) {
    return `
        <div class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-bold">My Timetable</h2>
            
            <div class="grid gap-4">
                <div class="rounded-xl border bg-card p-6">
                    <div class="space-y-3">
                        <div class="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                                <p class="font-medium">9:00 AM - Staff Briefing</p>
                                <p class="text-sm text-muted-foreground">Daily</p>
                            </div>
                            <span class="text-sm">Conference Room</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                                <p class="font-medium">2:00 PM - Parent Meeting</p>
                                <p class="text-sm text-muted-foreground">Today only</p>
                            </div>
                            <span class="text-sm">Office</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderAdminCustomSubjects(data) {
    return `
        <div class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-bold">Custom Subjects</h2>
            <p class="text-sm text-muted-foreground">Add subjects that are not in the standard curriculum</p>
            
            <div class="rounded-xl border bg-card p-6">
                <div class="space-y-4">
                    <div class="flex gap-2">
                        <input type="text" id="new-subject-name" placeholder="e.g., French, Computer Science, Art" class="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        <button onclick="addCustomSubject()" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                            Add Subject
                        </button>
                    </div>
                    
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                        ${(customSubjects || []).map(subject => `
                            <div class="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                                <span class="text-sm">${subject}</span>
                                <button onclick="removeCustomSubject('${subject}')" class="text-red-600 hover:text-red-800">
                                    <i data-lucide="x" class="h-4 w-4"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Teacher Section Renderers
function renderTeacherSection(section, data) {
    switch(section) {
        case 'dashboard':
            return renderTeacherDashboard(data);
        case 'students':
            return renderTeacherStudents(data);
        case 'attendance':
            return renderTeacherAttendance(data);
        case 'grades':
            return renderTeacherGrades(data);
        case 'tasks':
            return renderTeacherTasks(data);
        case 'duty':
            return renderTeacherDuty(data);
        case 'chat':
            return renderTeacherChat(data);
        case 'settings':
            return renderUserSettings('teacher');
        default:
            return renderTeacherDashboard(data);
    }
}

function renderTeacherDashboard(data) {
    return `
        <div class="space-y-6 animate-fade-in">
            <!-- Stats Grid -->
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div class="rounded-xl border bg-card p-6 card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">My Students</p>
                            <h3 class="text-2xl font-bold mt-1">${data?.stats?.totalStudents || 42}</h3>
                            <p class="text-xs text-muted-foreground mt-1">Across ${data?.stats?.totalClasses || 2} classes</p>
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
                            <h3 class="text-2xl font-bold mt-1">${data?.stats?.classAverage || 78.5}%</h3>
                            <p class="text-xs text-green-600 mt-1 flex items-center gap-1">
                                <i data-lucide="trending-up" class="h-3 w-3"></i>
                                +${data?.stats?.averageGrowth || 2.5}% from last term
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
                            <h3 class="text-2xl font-bold mt-1">${data?.stats?.attendanceToday?.present || 38}/${data?.stats?.attendanceToday?.total || 42}</h3>
                            <p class="text-xs text-yellow-600 mt-1 flex items-center gap-1">
                                <i data-lucide="alert-circle" class="h-3 w-3"></i>
                                ${(data?.stats?.attendanceToday?.total || 42) - (data?.stats?.attendanceToday?.present || 38)} absent
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
                            <h3 class="text-2xl font-bold mt-1">${data?.stats?.pendingTasks || 5}</h3>
                            <p class="text-xs text-red-600 mt-1 flex items-center gap-1">
                                <i data-lucide="clock" class="h-3 w-3"></i>
                                ${data?.stats?.overdueTasks || 3} overdue
                            </p>
                        </div>
                        <div class="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                            <i data-lucide="check-square" class="h-6 w-6 text-red-600"></i>
                        </div>
                    </div>
                </div>
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
                        <p class="text-sm text-muted-foreground">${data?.todayDuty?.location || 'Main Gate • 7:30 AM - 3:30 PM'}</p>
                    </div>
                    <span class="duty-status px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">${data?.todayDuty?.status === 'checked-in' ? 'Checked In' : 'Not Checked In'}</span>
                </div>
                <div class="mt-4 flex gap-3">
                    <button onclick="checkInDuty()" class="flex-1 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90" id="check-in-btn">
                        <i data-lucide="log-in" class="inline h-4 w-4 mr-2"></i>
                        Check In
                    </button>
                    <button onclick="checkOutDuty()" class="flex-1 border border-input bg-background py-2 rounded-lg hover:bg-accent" id="check-out-btn" ${data?.todayDuty?.status !== 'checked-in' ? 'disabled' : ''}>
                        <i data-lucide="log-out" class="inline h-4 w-4 mr-2"></i>
                        Check Out
                    </button>
                </div>
                <div class="mt-3 text-xs text-muted-foreground">
                    Last duty rating: ${data?.todayDuty?.lastRating || 4.5}/5
                </div>
            </div>
        </div>
    `;
}

function renderTeacherStudents(data) {
    const curriculum = schoolSettings.curriculum || 'cbc';
    const schoolLevel = schoolSettings.schoolLevel || 'secondary';
    const curriculumInfo = CURRICULUMS[curriculum];
    const subjectInfo = curriculumInfo?.subjects[schoolLevel] || [];
    const allSubjects = [...subjectInfo, ...(customSubjects || [])];
    
    return `
        <div class="space-y-6 animate-fade-in">
            <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold">My Students</h2>
                <button onclick="showToast('Add student form', 'info')" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
                    <i data-lucide="plus" class="h-4 w-4"></i>
                    Add Student
                </button>
            </div>
            
            <!-- Students Table -->
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
                        <tbody class="divide-y" id="students-table-body">
                            ${(data?.students || [
                                { id: 1, name: 'Sarah Johnson', class: '10A', elimuid: 'ELI-2024-001', attendance: 95, average: 85 },
                                { id: 2, name: 'Michael Williams', class: '10A', elimuid: 'ELI-2024-002', attendance: 88, average: 78 },
                                { id: 3, name: 'Emma Davis', class: '10B', elimuid: 'ELI-2024-003', attendance: 72, average: 82 }
                            ]).map(student => `
                                <tr class="hover:bg-accent/50 transition-colors">
                                    <td class="px-4 py-3">
                                        <div class="flex items-center gap-3">
                                            <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                <span class="font-medium text-blue-700 text-sm">${getInitials(student.name)}</span>
                                            </div>
                                            <span class="font-medium">${student.name}</span>
                                        </div>
                                    </td>
                                    <td class="px-4 py-3">Grade ${student.class}</td>
                                    <td class="px-4 py-3">
                                        <span class="font-mono text-xs bg-muted px-2 py-1 rounded">${student.elimuid}</span>
                                    </td>
                                    <td class="px-4 py-3">
                                        <div class="flex items-center gap-2">
                                            <div class="h-2 w-16 rounded-full bg-muted overflow-hidden">
                                                <div class="h-full w-[${student.attendance}%] bg-${student.attendance > 90 ? 'green' : student.attendance > 75 ? 'yellow' : 'red'}-500 rounded-full"></div>
                                            </div>
                                            <span class="text-xs">${student.attendance}%</span>
                                        </div>
                                    </td>
                                    <td class="px-4 py-3">
                                        <span class="font-semibold ${student.average > 80 ? 'text-green-600' : student.average > 60 ? 'text-yellow-600' : 'text-red-600'}">${student.average}%</span>
                                    </td>
                                    <td class="px-4 py-3 text-right">
                                        <button onclick="showToast('View student details', 'info')" class="p-2 hover:bg-accent rounded-lg">
                                            <i data-lucide="eye" class="h-4 w-4"></i>
                                        </button>
                                        <button onclick="copyElimuid('${student.elimuid}')" class="p-2 hover:bg-accent rounded-lg">
                                            <i data-lucide="copy" class="h-4 w-4"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- CSV Upload -->
            <div class="rounded-xl border bg-card p-6">
                <h3 class="font-semibold mb-4">Bulk Upload Students</h3>
                <div id="csv-drop-zone" class="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <i data-lucide="upload" class="h-10 w-10 mx-auto text-muted-foreground"></i>
                    <p class="text-sm mt-2">Drag & drop CSV file or click to browse</p>
                    <p class="text-xs text-muted-foreground mt-1">Analytics engine will process automatically</p>
                    <input type="file" id="csv-file-input" accept=".csv" class="hidden">
                </div>
                <button onclick="downloadTemplate('students')" class="mt-4 text-sm text-primary hover:underline flex items-center gap-1">
                    <i data-lucide="download" class="h-4 w-4"></i>
                    Download CSV Template
                </button>
            </div>
        </div>
    `;
}

function renderTeacherAttendance(data) {
    return `
        <div class="space-y-6 animate-fade-in">
            <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold">Take Attendance</h2>
                <div class="flex items-center gap-4">
                    <select class="px-3 py-2 border rounded-lg bg-background">
                        <option>Class 10A</option>
                        <option>Class 10B</option>
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
                    <button onclick="showToast('Attendance saved', 'success')" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Save Attendance</button>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-muted/50">
                            <tr>
                                <th class="px-4 py-3 text-left font-medium">Student</th>
                                <th class="px-4 py-3 text-center font-medium">Status</th>
                                <th class="px-4 py-3 text-left font-medium">Notes</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            ${(data?.students || [
                                { id: 1, name: 'Sarah Johnson' },
                                { id: 2, name: 'Michael Williams' },
                                { id: 3, name: 'Emma Davis' }
                            ]).map(student => `
                                <tr class="hover:bg-accent/50 transition-colors">
                                    <td class="px-4 py-3">
                                        <div class="flex items-center gap-3">
                                            <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                <span class="font-medium text-blue-700 text-sm">${getInitials(student.name)}</span>
                                            </div>
                                            <span class="font-medium">${student.name}</span>
                                        </div>
                                    </td>
                                    <td class="px-4 py-3 text-center">
                                        <select class="rounded-lg border border-input bg-background px-3 py-1 text-sm">
                                            <option value="present" selected>Present</option>
                                            <option value="absent">Absent</option>
                                            <option value="late">Late</option>
                                            <option value="excused">Excused</option>
                                        </select>
                                    </td>
                                    <td class="px-4 py-3">
                                        <input type="text" placeholder="Add note..." class="w-full rounded border-0 bg-transparent text-sm focus:ring-0">
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function renderTeacherGrades(data) {
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
                    <select class="px-3 py-2 border rounded-lg bg-background">
                        <option>Class 10A</option>
                        <option>Class 10B</option>
                    </select>
                    <select class="px-3 py-2 border rounded-lg bg-background" id="subject-select">
                        ${allSubjects.map(subject => `<option value="${subject}">${subject}</option>`).join('')}
                    </select>
                    <select class="px-3 py-2 border rounded-lg bg-background">
                        <option>Mid-term</option>
                        <option>Final</option>
                        <option>Quiz</option>
                    </select>
                </div>
            </div>
            
            <div class="rounded-xl border bg-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-muted/50">
                            <tr>
                                <th class="px-4 py-3 text-left font-medium">Student</th>
                                <th class="px-4 py-3 text-center font-medium">Score</th>
                                <th class="px-4 py-3 text-center font-medium">Grade</th>
                                <th class="px-4 py-3 text-left font-medium">Comments</th>
                                <th class="px-4 py-3 text-center font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y" id="grades-table-body">
                            ${(data?.students || [
                                { id: 1, name: 'Sarah Johnson', score: 85 },
                                { id: 2, name: 'Michael Williams', score: 78 },
                                { id: 3, name: 'Emma Davis', score: 92 }
                            ]).map(student => {
                                const gradeInfo = getGradeFromScore(student.score, curriculum, schoolLevel);
                                return `
                                    <tr class="hover:bg-accent/50 transition-colors" data-student-id="${student.id}">
                                        <td class="px-4 py-3">
                                            <div class="flex items-center gap-3">
                                                <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <span class="font-medium text-blue-700 text-sm">${getInitials(student.name)}</span>
                                                </div>
                                                <span class="font-medium">${student.name}</span>
                                            </div>
                                        </td>
                                        <td class="px-4 py-3 text-center">
                                            <input type="number" value="${student.score}" class="student-score w-20 rounded-lg border border-input bg-background px-2 py-1 text-sm text-center" onchange="updateStudentGrade(this, '${curriculum}', '${schoolLevel}')">
                                        </td>
                                        <td class="px-4 py-3 text-center">
                                            <span class="student-grade-display px-2 py-1 bg-${student.score > 80 ? 'green' : student.score > 70 ? 'blue' : 'yellow'}-100 text-${student.score > 80 ? 'green' : student.score > 70 ? 'blue' : 'yellow'}-700 text-xs rounded-full">
                                                ${gradeInfo.grade}
                                            </span>
                                        </td>
                                        <td class="px-4 py-3">
                                            <input type="text" placeholder="Add comment..." class="w-full rounded border-0 bg-transparent text-sm focus:ring-0">
                                        </td>
                                        <td class="px-4 py-3 text-center">
                                            <button onclick="saveStudentGrade(this)" class="px-3 py-1 bg-primary text-primary-foreground text-xs rounded-lg">Save</button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function renderTeacherTasks(data) {
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
                                <p class="text-sm text-muted-foreground">Due: March 10, 2024</p>
                            </div>
                            <span class="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Urgent</span>
                        </div>
                        <div class="flex items-center gap-3 p-3 hover:bg-accent/50 rounded-lg">
                            <input type="checkbox" class="rounded">
                            <div class="flex-1">
                                <p class="font-medium">Prepare lesson plan</p>
                                <p class="text-sm text-muted-foreground">Due: March 8, 2024</p>
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
                                <p class="text-sm text-muted-foreground">Completed Mar 1, 2024</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderTeacherDuty(data) {
    return `
        <div class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-bold">My Duty Schedule</h2>
            
            <div class="grid gap-4 md:grid-cols-2">
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">This Week's Duty</h3>
                    <div class="space-y-3">
                        <div class="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                                <p class="font-medium">Monday</p>
                                <p class="text-sm text-muted-foreground">Main Gate</p>
                            </div>
                            <span class="text-sm">7:30 AM - 10:30 AM</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                                <p class="font-medium">Wednesday</p>
                                <p class="text-sm text-muted-foreground">Dining Hall</p>
                            </div>
                            <span class="text-sm">10:30 AM - 1:30 PM</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                                <p class="font-medium">Friday</p>
                                <p class="text-sm text-muted-foreground">Library</p>
                            </div>
                            <span class="text-sm">1:30 PM - 4:30 PM</span>
                        </div>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Duty History</h3>
                    <div class="space-y-3">
                        <div class="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                                <p class="font-medium">February 28, 2024</p>
                                <p class="text-sm text-muted-foreground">Main Gate</p>
                            </div>
                            <span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Rating: 4.5</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                                <p class="font-medium">February 26, 2024</p>
                                <p class="text-sm text-muted-foreground">Dining Hall</p>
                            </div>
                            <span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Rating: 5.0</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderTeacherChat(data) {
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

// Parent Section Renderers
function renderParentSection(section, data) {
    switch(section) {
        case 'dashboard':
            return renderParentDashboard(data);
        case 'progress':
            return renderParentProgress(data);
        case 'payments':
            return renderParentPayments(data);
        case 'chat':
            return renderParentChat(data);
        case 'settings':
            return renderUserSettings('parent');
        default:
            return renderParentDashboard(data);
    }
}

function renderParentDashboard(data) {
    return `
        <div class="space-y-6 animate-fade-in">
            <!-- Child Selector -->
            <div class="flex gap-2 border-b pb-4 overflow-x-auto">
                <button class="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Sarah (Grade 10)</button>
                <button class="px-4 py-2 bg-muted rounded-lg hover:bg-muted/80">Michael (Grade 8)</button>
            </div>
            
            <!-- Stats Grid -->
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div class="rounded-xl border bg-card p-6 card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Attendance</p>
                            <h3 class="text-2xl font-bold mt-1">95%</h3>
                            <p class="text-xs text-green-600 mt-1">This term</p>
                        </div>
                        <div class="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                            <i data-lucide="calendar-check" class="h-6 w-6 text-blue-600"></i>
                        </div>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6 card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Class Average</p>
                            <h3 class="text-2xl font-bold mt-1">82%</h3>
                            <p class="text-xs text-green-600 mt-1">Above average</p>
                        </div>
                        <div class="h-12 w-12 rounded-lg bg-violet-100 flex items-center justify-center">
                            <i data-lucide="trending-up" class="h-6 w-6 text-violet-600"></i>
                        </div>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6 card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Homework</p>
                            <h3 class="text-2xl font-bold mt-1">3</h3>
                            <p class="text-xs text-yellow-600 mt-1">Pending</p>
                        </div>
                        <div class="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center">
                            <i data-lucide="book-open" class="h-6 w-6 text-amber-600"></i>
                        </div>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6 card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Fee Balance</p>
                            <h3 class="text-2xl font-bold mt-1">$250</h3>
                            <p class="text-xs text-red-600 mt-1">Due in 5 days</p>
                        </div>
                        <div class="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                            <i data-lucide="credit-card" class="h-6 w-6 text-red-600"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Live Attendance -->
            <div class="grid gap-4 md:grid-cols-2">
                <div class="rounded-xl border bg-card p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-semibold">Live Attendance</h3>
                        <span class="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">Present Today</span>
                    </div>
                    <div id="live-attendance">
                        <p class="text-3xl font-bold">Checked in at 7:45 AM</p>
                        <p class="text-sm text-muted-foreground mt-1">Gate: Main Entrance</p>
                    </div>
                    
                    <div class="mt-6">
                        <h4 class="text-sm font-medium mb-2">This Week</h4>
                        <div class="flex gap-1">
                            <div class="flex-1 h-2 bg-green-500 rounded"></div>
                            <div class="flex-1 h-2 bg-green-500 rounded"></div>
                            <div class="flex-1 h-2 bg-green-500 rounded"></div>
                            <div class="flex-1 h-2 bg-green-500 rounded"></div>
                            <div class="flex-1 h-2 bg-gray-300 rounded"></div>
                        </div>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Recent Grades</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <span>Mathematics</span>
                            <span class="font-semibold text-green-600">85% (A-)</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span>English</span>
                            <span class="font-semibold text-blue-600">78% (B+)</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span>Science</span>
                            <span class="font-semibold text-green-600">92% (A)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderParentProgress(data) {
    const curriculum = schoolSettings.curriculum || 'cbc';
    const schoolLevel = schoolSettings.schoolLevel || 'secondary';
    
    return `
        <div class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-bold">Academic Progress - ${schoolSettings.schoolName || 'Nairobi High School'}</h2>
            <p class="text-sm text-muted-foreground">Curriculum: ${CURRICULUMS[curriculum]?.name || 'CBC'} - ${schoolLevel}</p>
            
            <div class="grid gap-4 md:grid-cols-2">
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Subject Performance</h3>
                    <div class="space-y-4">
                        <div>
                            <div class="flex justify-between mb-1">
                                <span>Mathematics</span>
                                <span class="font-medium">85%</span>
                            </div>
                            <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <div class="h-full w-[85%] bg-green-500 rounded-full"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between mb-1">
                                <span>English</span>
                                <span class="font-medium">78%</span>
                            </div>
                            <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <div class="h-full w-[78%] bg-blue-500 rounded-full"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between mb-1">
                                <span>Science</span>
                                <span class="font-medium">92%</span>
                            </div>
                            <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <div class="h-full w-[92%] bg-green-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Attendance Overview</h3>
                    <div class="text-center">
                        <div class="text-5xl font-bold text-green-600 mb-2">95%</div>
                        <p class="text-sm text-muted-foreground">Overall attendance this term</p>
                        <p class="text-sm mt-4">Days present: 95</p>
                        <p class="text-sm">Days absent: 5</p>
                    </div>
                </div>
            </div>
            
            <div class="rounded-xl border bg-card p-6">
                <h3 class="font-semibold mb-4">Progress Over Time</h3>
                <div class="chart-container h-80">
                    <canvas id="parent-gradeChart"></canvas>
                </div>
            </div>
        </div>
    `;
}

function renderParentPayments(data) {
    return `
        <div class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-bold">Payments & Subscriptions</h2>
            
            <div class="grid gap-4 md:grid-cols-3">
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Current Balance</h3>
                    <p class="text-4xl font-bold text-red-600">$250</p>
                    <p class="text-sm text-muted-foreground mt-2">Due by ${new Date(new Date().setDate(new Date().getDate() + 5)).toLocaleDateString()}</p>
                    <button onclick="showToast('Payment processing', 'info')" class="mt-4 w-full py-2 bg-primary text-primary-foreground rounded-lg">Pay Now</button>
                </div>
                
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Current Plan</h3>
                    <p class="text-xl font-bold">Basic (Free)</p>
                    <p class="text-sm text-muted-foreground mt-2">✓ Attendance tracking</p>
                    <p class="text-sm text-muted-foreground">✗ Grades & reports</p>
                    <p class="text-sm text-muted-foreground">✗ Live chat</p>
                    <button onclick="showToast('Upgrade options', 'info')" class="mt-4 w-full py-2 border rounded-lg hover:bg-accent">Upgrade</button>
                </div>
                
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Payment History</h3>
                    <div class="space-y-2">
                        <div class="flex justify-between text-sm">
                            <span>Feb 1, 2024</span>
                            <span class="font-medium">$250</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span>Jan 1, 2024</span>
                            <span class="font-medium">$250</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderParentChat(data) {
    return `
        <div class="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div class="rounded-xl border bg-card p-4 h-[600px] flex flex-col">
                <div class="flex justify-between items-center mb-4 pb-2 border-b">
                    <div class="flex items-center gap-3">
                        <select class="px-3 py-2 border rounded-lg bg-background">
                            <option>Sarah's Teachers</option>
                            <option>Michael's Teachers</option>
                        </select>
                    </div>
                </div>
                
                <div class="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-muted/20 rounded-lg" id="chat-messages-container">
                    <div class="flex justify-start">
                        <div class="chat-bubble-received max-w-[70%]">
                            <p class="text-sm font-medium">Mr. Kamau (Mathematics)</p>
                            <p class="text-sm">Sarah is doing very well in math. She scored 85% on the recent test.</p>
                            <p class="text-xs text-muted-foreground mt-1">Yesterday at 2:30 PM</p>
                        </div>
                    </div>
                    <div class="flex justify-end">
                        <div class="chat-bubble-sent max-w-[70%]">
                            <p class="text-sm font-medium">You</p>
                            <p class="text-sm">Thank you for the update! Is there anything she needs to work on?</p>
                            <p class="text-xs text-muted-foreground mt-1">Yesterday at 3:15 PM</p>
                        </div>
                    </div>
                </div>
                
                <div class="flex gap-2">
                    <select class="w-40 px-3 py-3 border rounded-lg bg-background">
                        <option>Mr. Kamau</option>
                        <option>Ms. Atieno</option>
                        <option>Mr. Omondi</option>
                    </select>
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

// Student Section Renderers
function renderStudentSection(section, data) {
    switch(section) {
        case 'dashboard':
            return renderStudentDashboard(data);
        case 'chat':
            return renderStudentChat(data);
        case 'ai-tutor':
            return renderStudentAITutor(data);
        case 'schedule':
            return renderStudentSchedule(data);
        case 'grades':
            return renderStudentGrades(data);
        case 'settings':
            return renderUserSettings('student');
        default:
            return renderStudentDashboard(data);
    }
}

function renderStudentDashboard(data) {
    return `
        <div class="space-y-6 animate-fade-in">
            <!-- Stats Grid -->
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div class="rounded-xl border bg-card p-6 card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">My ELIMUID</p>
                            <h3 class="text-lg font-mono font-bold mt-1">${data?.elimuid || 'ELI-2024-001'}</h3>
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
                            <h3 class="text-2xl font-bold mt-1">${data?.classAverage || 82}%</h3>
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
                            <h3 class="text-2xl font-bold mt-1">${data?.attendance || 95}%</h3>
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
                            <h3 class="text-2xl font-bold mt-1">${data?.studyGroups || 3}</h3>
                        </div>
                        <div class="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                            <i data-lucide="message-circle" class="h-6 w-6 text-blue-600"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Quick Actions -->
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
}

function renderStudentChat(data) {
    return `
        <div class="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div class="rounded-xl border bg-card p-4 h-[600px] flex flex-col">
                <div class="flex justify-between items-center mb-4 pb-2 border-b">
                    <div class="flex items-center gap-3">
                        <div class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                            <i data-lucide="message-circle" class="h-5 w-5 text-white"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold">${data?.currentGroup?.name || 'Grade 10 Math Study Group'}</h3>
                            <p class="text-xs text-muted-foreground">${data?.currentGroup?.onlineCount || 5} members online</p>
                        </div>
                    </div>
                    <button class="p-2 hover:bg-accent rounded-lg" onclick="showToast('Group members: Alex, Maria, John, Sarah, You', 'info')">
                        <i data-lucide="users" class="h-5 w-5"></i>
                    </button>
                </div>
                
                <div class="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-muted/20 rounded-lg" id="chat-messages-container">
                    ${(data?.chatHistory || [
                        { content: 'Can anyone help with quadratic equations?', sender: 'Alex', sent: false, timestamp: new Date() },
                        { content: 'Sure! Use the formula x = [-b ± √(b²-4ac)]/2a', sender: 'You', sent: true, timestamp: new Date() }
                    ]).map(msg => `
                        <div class="flex ${msg.sent ? 'justify-end' : 'justify-start'}">
                            <div class="${msg.sent ? 'chat-bubble-sent' : 'chat-bubble-received'} max-w-[70%]">
                                ${!msg.sent ? '<p class="text-sm font-medium mb-1">' + msg.sender + '</p>' : ''}
                                <p class="text-sm">${msg.content}</p>
                                <p class="text-xs text-muted-foreground mt-1">${timeAgo(msg.timestamp)}</p>
                            </div>
                        </div>
                    `).join('')}
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

function renderStudentAITutor(data) {
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

function renderStudentSchedule(data) {
    return `
        <div class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-bold">My Schedule - ${schoolSettings.schoolName || 'Nairobi High School'}</h2>
            <p class="text-sm text-muted-foreground">${CURRICULUMS[schoolSettings.curriculum]?.name || 'CBC'} - ${schoolSettings.schoolLevel || 'Secondary'}</p>
            
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

function renderStudentGrades(data) {
    const curriculum = schoolSettings.curriculum || 'cbc';
    const schoolLevel = schoolSettings.schoolLevel || 'secondary';
    
    return `
        <div class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-bold">My Grades - ${schoolSettings.schoolName || 'Nairobi High School'}</h2>
            <p class="text-sm text-muted-foreground">Curriculum: ${CURRICULUMS[curriculum]?.name || 'CBC'} - ${schoolLevel}</p>
            
            <div class="grid gap-4 md:grid-cols-2">
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Current Term Grades</h3>
                    <div class="space-y-4">
                        <div>
                            <div class="flex justify-between mb-1">
                                <span>Mathematics</span>
                                <span class="font-semibold text-green-600">85% (A-)</span>
                            </div>
                            <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <div class="h-full w-[85%] bg-green-500 rounded-full"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between mb-1">
                                <span>English</span>
                                <span class="font-semibold text-blue-600">78% (B+)</span>
                            </div>
                            <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <div class="h-full w-[78%] bg-blue-500 rounded-full"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between mb-1">
                                <span>Science</span>
                                <span class="font-semibold text-green-600">92% (A)</span>
                            </div>
                            <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <div class="h-full w-[92%] bg-green-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="rounded-xl border bg-card p-6">
                    <h3 class="font-semibold mb-4">Grade Summary</h3>
                    <div class="text-center">
                        <div class="text-5xl font-bold text-blue-600 mb-2">85%</div>
                        <p class="text-sm text-muted-foreground">Overall Average</p>
                        <p class="text-sm mt-4">Term GPA: 3.5</p>
                        <p class="text-sm">Class Rank: 12/42</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Settings helper functions
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
            <p class="text-sm text-muted-foreground"><span class="font-medium">Name:</span> ${info.name}</p>
            <p class="text-sm text-muted-foreground mt-1"><span class="font-medium">Grade Levels:</span> ${levelInfo.join(', ')}</p>
            <p class="text-sm text-muted-foreground mt-1"><span class="font-medium">Core Subjects:</span> ${subjectInfo.join(', ')}</p>
            ${customSubjects?.length ? `<p class="text-sm text-muted-foreground mt-1"><span class="font-medium">Custom Subjects:</span> ${customSubjects.join(', ')}</p>` : ''}
        `;
    }
};

window.addTerm = function() {
    const termsContainer = document.querySelector('.space-y-4');
    if (!termsContainer) {
        console.error('Terms container not found');
        return;
    }
    
    // Find the parent div that contains the terms
    const termsParent = termsContainer.closest('.space-y-4');
    if (!termsParent) return;
    
    const termCount = document.querySelectorAll('.grid.grid-cols-3').length;
    const newTermDiv = document.createElement('div');
    newTermDiv.className = 'grid grid-cols-3 gap-2';
    newTermDiv.innerHTML = `
        <input type="text" value="Term ${termCount + 1}" placeholder="Term Name" class="term-name rounded-lg border border-input bg-background px-3 py-2 text-sm">
        <input type="date" class="term-start rounded-lg border border-input bg-background px-3 py-2 text-sm">
        <input type="date" class="term-end rounded-lg border border-input bg-background px-3 py-2 text-sm">
    `;
    
    // Insert before the "Add Term" button
    const addButton = termsContainer.querySelector('button[onclick="addTerm()"]');
    if (addButton && addButton.parentNode) {
        termsContainer.insertBefore(newTermDiv, addButton.parentNode);
    } else {
        termsContainer.appendChild(newTermDiv);
    }
};

window.addCustomSubject = function() {
    const newSubject = document.getElementById('new-subject-name')?.value.trim();
    if (!newSubject) {
        showToast('Please enter a subject name', 'error');
        return;
    }
    
    if (!customSubjects) customSubjects = [];
    customSubjects.push(newSubject);
    schoolSettings.customSubjects = customSubjects;
    
    // Update the UI
    const subjectsContainer = document.querySelector('.grid.grid-cols-2.md\\:grid-cols-3.gap-2');
    if (subjectsContainer) {
        subjectsContainer.innerHTML += `
            <div class="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                <span class="text-sm">${newSubject}</span>
                <button onclick="removeCustomSubject('${newSubject}')" class="text-red-600 hover:text-red-800">
                    <i data-lucide="x" class="h-4 w-4"></i>
                </button>
            </div>
        `;
    }
    
    document.getElementById('new-subject-name').value = '';
    showToast(`Subject "${newSubject}" added`, 'success');
    lucide.createIcons();
};

window.removeCustomSubject = function(subject) {
    customSubjects = customSubjects.filter(s => s !== subject);
    schoolSettings.customSubjects = customSubjects;
    
    // Refresh the custom subjects section
    const section = currentSection;
    showDashboardSection(section);
    showToast(`Subject "${subject}" removed`, 'info');
};

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
    
    await saveSchoolSettings(newSettings);
};

// Grade helper functions
window.updateStudentGrade = function(input, curriculum, level) {
    const row = input.closest('tr');
    const score = parseInt(input.value);
    const gradeDisplay = row.querySelector('.student-grade-display');
    
    if (!isNaN(score)) {
        const gradeInfo = getGradeFromScore(score, curriculum, level);
        gradeDisplay.textContent = gradeInfo.grade;
        
        // Update color based on score
        gradeDisplay.className = `student-grade-display px-2 py-1 bg-${score > 80 ? 'green' : score > 70 ? 'blue' : 'yellow'}-100 text-${score > 80 ? 'green' : score > 70 ? 'blue' : 'yellow'}-700 text-xs rounded-full`;
    }
};

window.saveStudentGrade = function(button) {
    const row = button.closest('tr');
    const studentName = row.querySelector('.font-medium').textContent;
    const score = row.querySelector('.student-score').value;
    const grade = row.querySelector('.student-grade-display').textContent;
    
    showToast(`Grade saved for ${studentName}: ${score}% (${grade})`, 'success');
};

// Chat functions
async function sendChatMessage() {
    const input = document.getElementById('chat-message-input');
    const message = input?.value.trim();
    
    if (!message) return;
    
    const container = document.getElementById('chat-messages-container');
    if (container) {
        container.innerHTML += `
            <div class="flex justify-end">
                <div class="chat-bubble-sent max-w-[70%]">
                    <p class="text-sm">${message}</p>
                    <p class="text-xs text-muted-foreground mt-1">just now</p>
                </div>
            </div>
        `;
        container.scrollTop = container.scrollHeight;
    }
    
    input.value = '';
    
    // Simulate response based on role
    setTimeout(() => {
        if (container) {
            const responses = {
                student: {
                    sender: 'Alex',
                    message: 'Thanks for your message! Let\'s study together.'
                },
                teacher: {
                    sender: 'Ms. Atieno',
                    message: 'I agree! Let\'s discuss this in the staff meeting.'
                },
                parent: {
                    sender: 'Mr. Kamau',
                    message: 'Thank you for reaching out. I\'ll get back to you soon.'
                }
            };
            
            const response = responses[currentRole] || { sender: 'User', message: 'Thanks for your message!' };
            
            container.innerHTML += `
                <div class="flex justify-start">
                    <div class="chat-bubble-received max-w-[70%]">
                        <p class="text-sm font-medium">${response.sender}</p>
                        <p class="text-sm">${response.message}</p>
                        <p class="text-xs text-muted-foreground mt-1">just now</p>
                    </div>
                </div>
            `;
            container.scrollTop = container.scrollHeight;
        }
    }, 1000);
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
                <p class="text-sm">${question}</p>
                <p class="text-xs text-muted-foreground mt-1">just now</p>
            </div>
        </div>
    `;
    container.scrollTop = container.scrollHeight;
    
    input.value = '';
    
    // Show typing indicator
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
        
        const curriculum = CURRICULUMS[schoolSettings.curriculum]?.name || 'your';
        const responses = [
            `That's an excellent question about ${curriculum} curriculum! Let me explain...`,
            `Based on the ${curriculum} framework, here's what you need to know...`,
            `Great question! In the ${curriculum} system, this topic is covered in detail.`,
            `I'd be happy to help you with that. Here's a step-by-step explanation...`
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

// Add Student function (connects to backend)
window.addStudent = async function() {
    const name = document.getElementById('student-name')?.value;
    const grade = document.getElementById('student-grade')?.value;
    const parentEmail = document.getElementById('parent-email')?.value;
    
    if (!name || !grade) {
        showToast('Please enter student name and grade', 'warning');
        return;
    }
    
    showLoading();
    try {
        const result = await window.addStudent({ name, grade, parentEmail });
        
        showToast(`Student added successfully! ELIMUID: ${result.elimuid || 'generated'}`, 'success');
        
        // Refresh students list
        if (typeof loadTeacherStudents === 'function') {
            await loadTeacherStudents();
        }
        
        // Clear form
        document.getElementById('student-name').value = '';
        document.getElementById('student-grade').value = '';
        document.getElementById('parent-email').value = '';
    } catch (error) {
        showToast('Failed to add student: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
};

// Load teacher's students
window.loadTeacherStudents = async function() {
    try {
        const students = await getMyStudents();
        
        const tableBody = document.getElementById('students-table-body');
        if (tableBody) {
            tableBody.innerHTML = students.map(student => `
                <tr class="hover:bg-accent/50 transition-colors">
                    <td class="px-4 py-3">
                        <div class="flex items-center gap-3">
                            <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <span class="font-medium text-blue-700 text-sm">${getInitials(student.name)}</span>
                            </div>
                            <span class="font-medium">${student.name}</span>
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
                        <span class="font-semibold ${student.average > 80 ? 'text-green-600' : student.average > 60 ? 'text-yellow-600' : 'text-red-600'}">${student.average || 0}%</span>
                    </td>
                    <td class="px-4 py-3 text-right">
                        <button onclick="showToast('View student details', 'info')" class="p-2 hover:bg-accent rounded-lg">
                            <i data-lucide="eye" class="h-4 w-4"></i>
                        </button>
                        <button onclick="copyElimuid('${student.elimuid}')" class="p-2 hover:bg-accent rounded-lg">
                            <i data-lucide="copy" class="h-4 w-4"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
            lucide.createIcons();
        }
    } catch (error) {
        console.error('Failed to load students:', error);
    }
};

// Copy ELIMUID to clipboard
window.copyElimuid = function(elimuid) {
    navigator.clipboard.writeText(elimuid).then(() => {
        showToast('ELIMUID copied to clipboard', 'success');
    }).catch(() => {
        showToast('Failed to copy', 'error');
    });
};

// Duty check-in function
window.checkInDuty = async function() {
    try {
        const result = await window.checkInDuty({ location: 'School Gate' });
        showToast('Checked in successfully!', 'success');
        
        // Update duty card status
        const dutyCard = document.getElementById('duty-card');
        if (dutyCard) {
            const statusSpan = dutyCard.querySelector('.duty-status');
            if (statusSpan) {
                statusSpan.textContent = 'Checked In';
                statusSpan.className = 'duty-status px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full';
            }
            const checkInBtn = document.getElementById('check-in-btn');
            const checkOutBtn = document.getElementById('check-out-btn');
            if (checkInBtn) checkInBtn.disabled = true;
            if (checkOutBtn) checkOutBtn.disabled = false;
        }
    } catch (error) {
        showToast('Failed to check in: ' + error.message, 'error');
    }
};

// Duty check-out function
window.checkOutDuty = async function() {
    try {
        const result = await window.checkOutDuty({ location: 'School Gate' });
        showToast('Checked out successfully!', 'success');
        
        // Update duty card status
        const dutyCard = document.getElementById('duty-card');
        if (dutyCard) {
            const statusSpan = dutyCard.querySelector('.duty-status');
            if (statusSpan) {
                statusSpan.textContent = 'Checked Out';
                statusSpan.className = 'duty-status px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full';
            }
        }
    } catch (error) {
        showToast('Failed to check out: ' + error.message, 'error');
    }
};

// Teacher approval functions
window.approveTeacher = async function(teacherId) {
    try {
        await window.approveTeacher(teacherId, 'approve');
        showToast('Teacher approved successfully', 'success');
        
        // Refresh pending approvals
        if (typeof loadPendingApprovals === 'function') {
            await loadPendingApprovals();
        }
    } catch (error) {
        showToast('Failed to approve teacher: ' + error.message, 'error');
    }
};

window.rejectTeacher = async function(teacherId) {
    const reason = prompt('Please enter rejection reason:');
    if (reason === null) return;
    
    try {
        await window.approveTeacher(teacherId, 'reject', reason);
        showToast('Teacher rejected', 'info');
        
        if (typeof loadPendingApprovals === 'function') {
            await loadPendingApprovals();
        }
    } catch (error) {
        showToast('Failed to reject teacher: ' + error.message, 'error');
    }
};

// Update sidebar function
function updateSidebar(role) {
    console.log('🔧 Updating sidebar for role:', role);
    
    const nav = document.getElementById('sidebar-nav');
    const settingsNav = document.getElementById('settings-nav');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (!nav) {
        console.error('❌ Sidebar nav element not found!');
        return;
    }
    
    const sidebarConfig = {
        'super_admin': {
            main: [
                { icon: 'shield', label: 'Dashboard', section: 'dashboard' },
                { icon: 'building-2', label: 'Schools', section: 'schools' },
                { icon: 'check-circle', label: 'School Approvals', section: 'school-approvals' },
                { icon: 'file-edit', label: 'Name Changes', section: 'name-change-requests' },
                { icon: 'credit-card', label: 'Paid Schools', section: 'paid-schools' },
                { icon: 'activity', label: 'Platform Health', section: 'platform-health' }
            ],
            settings: [
                { icon: 'settings', label: 'Platform Settings', section: 'settings' },
                { icon: 'help-circle', label: 'Help', section: 'help' }
            ]
        },
        'admin': {
            main: [
                { icon: 'school', label: 'Dashboard', section: 'dashboard' },
                { icon: 'users', label: 'Teachers', section: 'teachers' },
                { icon: 'calendar', label: 'Calendar', section: 'calendar' },
                { icon: 'clock', label: 'Duty', section: 'duty' },
                { icon: 'book-open', label: 'Custom Subjects', section: 'custom-subjects' }
            ],
            settings: [
                { icon: 'settings', label: 'School Settings', section: 'settings' },
                { icon: 'help-circle', label: 'Help', section: 'help' }
            ]
        },
        'teacher': {
            main: [
                { icon: 'users', label: 'Dashboard', section: 'dashboard' },
                { icon: 'user-plus', label: 'Students', section: 'students' },
                { icon: 'calendar-check', label: 'Attendance', section: 'attendance' },
                { icon: 'trending-up', label: 'Grades', section: 'grades' },
                { icon: 'check-square', label: 'Tasks', section: 'tasks' },
                { icon: 'clock', label: 'My Duty', section: 'duty' },
                { icon: 'message-circle', label: 'Staff Chat', section: 'chat' }
            ],
            settings: [
                { icon: 'settings', label: 'My Settings', section: 'settings' },
                { icon: 'help-circle', label: 'Help', section: 'help' }
            ]
        },
        'parent': {
            main: [
                { icon: 'activity', label: 'Dashboard', section: 'dashboard' },
                { icon: 'trending-up', label: 'Progress', section: 'progress' },
                { icon: 'credit-card', label: 'Payments', section: 'payments' },
                { icon: 'message-circle', label: 'Messages', section: 'chat' }
            ],
            settings: [
                { icon: 'settings', label: 'My Settings', section: 'settings' },
                { icon: 'help-circle', label: 'Help', section: 'help' }
            ]
        },
        'student': {
            main: [
                { icon: 'layout-dashboard', label: 'Dashboard', section: 'dashboard' },
                { icon: 'message-circle', label: 'Study Chat', section: 'chat' },
                { icon: 'bot', label: 'AI Tutor', section: 'ai-tutor' },
                { icon: 'calendar', label: 'Schedule', section: 'schedule' },
                { icon: 'trending-up', label: 'My Grades', section: 'grades' }
            ],
            settings: [
                { icon: 'settings', label: 'My Settings', section: 'settings' },
                { icon: 'help-circle', label: 'Help', section: 'help' }
            ]
        }
    };
    
    console.log('📋 Looking for config with key:', role);
    console.log('📋 Available keys:', Object.keys(sidebarConfig));
    
    const config = sidebarConfig[role];
    if (!config) {
        console.warn('⚠️ No config found for role:', role, 'falling back to student');
    }
    
    const activeConfig = config || sidebarConfig['student'];
    console.log('✅ Using config for:', config ? role : 'student (fallback)');
    
    // Render main navigation
    nav.innerHTML = activeConfig.main.map(item => `
        <a href="#" onclick="showDashboardSection('${item.section}')" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors sidebar-link" data-section="${item.section}">
            <i data-lucide="${item.icon}" class="h-5 w-5"></i>
            <span>${item.label}</span>
        </a>
    `).join('');
    
    // Render settings navigation
    settingsNav.innerHTML = activeConfig.settings.map(item => `
        <a href="#" onclick="showDashboardSection('${item.section}')" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors sidebar-link" data-section="${item.section}">
            <i data-lucide="${item.icon}" class="h-5 w-5"></i>
            <span>${item.label}</span>
        </a>
    `).join('');
    
    // Render mobile navigation
    if (mobileNav) {
        mobileNav.innerHTML = activeConfig.main.slice(0, 4).map(item => `
            <a href="#" onclick="showDashboardSection('${item.section}')" class="mobile-nav-item flex flex-col items-center justify-center flex-1 h-14 text-muted-foreground" data-section="${item.section}">
                <i data-lucide="${item.icon}" class="h-5 w-5"></i>
                <span class="text-xs mt-1">${item.label}</span>
            </a>
        `).join('');
    }
    
    lucide.createIcons();
    console.log('✅ Sidebar updated');
}

function updateSidebarActiveState(section) {
    // Remove active class from all sidebar links
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('bg-sidebar-accent', 'text-sidebar-accent-foreground');
    });
    
    // Add active class to current section
    const activeLink = document.querySelector(`.sidebar-link[data-section="${section}"]`);
    if (activeLink) {
        activeLink.classList.add('bg-sidebar-accent', 'text-sidebar-accent-foreground');
    }
    
    // Update mobile nav
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
        item.classList.remove('text-primary');
        if (item.dataset.section === section) {
            item.classList.add('text-primary');
        }
    });
}

function setupSectionListeners(role, section) {
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
    
    if (section === 'students' || section === 'upload') {
        setTimeout(() => {
            setupFileUpload('csv-drop-zone', 'csv-file-input', 'students');
        }, 500);
    }
    
    if (section === 'grades') {
        // Add any grade section specific listeners
    }
}

function getMockData(role) {
    const mockData = {
        superadmin: {
            totalSchools: 24,
            newSchoolsThisMonth: 3,
            activeAdmins: 18,
            newAdmins: 2,
            pendingApprovals: 6,
            revenue: 1240,
            revenueGrowth: 15,
            schools: [
                { id: 1, name: 'Nairobi High School', adminEmail: 'admin@nairobi.edu', level: 'Secondary', curriculum: 'cbc', status: 'active', paid: true },
                { id: 2, name: 'Mombasa Academy', adminEmail: 'admin@mombasa.edu', level: 'Primary', curriculum: '844', status: 'pending', paid: false },
                { id: 3, name: 'Kisumu Day', adminEmail: 'admin@kisumu.edu', level: 'Secondary', curriculum: 'british', status: 'active', paid: true },
                { id: 4, name: 'Eldoret School', adminEmail: 'admin@eldoret.edu', level: 'Primary', curriculum: 'american', status: 'suspended', paid: false }
            ],
            pendingSchools: [
                { id: 1, name: 'Mombasa Academy', admin: 'admin@mombasa.edu', level: 'Primary', curriculum: '844', date: new Date() },
                { id: 2, name: 'Kisumu International', admin: 'admin@kisumu.edu', level: 'Secondary', curriculum: 'british', date: new Date() }
            ],
            paidSchools: [
                { id: 1, name: 'Nairobi High', customName: 'Nairobi Academy', paid: true, enabled: true },
                { id: 2, name: 'Kisumu Day', customName: 'Kisumu International School', paid: true, enabled: true },
                { id: 3, name: 'Eldoret School', customName: 'Eldoret Junior Academy', paid: true, enabled: false }
            ],
            nameChangeRequests: [
                { id: 1, school: 'Nairobi High', oldName: 'Nairobi High School', newName: 'Nairobi Academy', amount: 50, date: new Date(), paid: true }
            ]
        },
        admin: {
            school: { name: 'Nairobi High School', level: 'Secondary', id: 'NHS-2024-001' },
            stats: {
                totalStudents: 543,
                studentGrowth: 12,
                totalTeachers: 28,
                pendingTeachers: 4,
                totalClasses: 16,
                totalGrades: 4,
                attendanceRate: 94.2,
                attendanceVariance: 2
            },
            pendingTeachers: [
                { id: 1, name: 'Jane Doe', subject: 'Mathematics', appliedAt: new Date(), schoolId: 'NHS-2024-001' },
                { id: 2, name: 'John Smith', subject: 'Science', appliedAt: new Date(), schoolId: 'NHS-2024-001' }
            ],
            activeTeachers: [
                { id: 1, name: 'Mr. Kamau', subject: 'Mathematics', classes: 4, status: 'active' },
                { id: 2, name: 'Ms. Atieno', subject: 'English', classes: 3, status: 'active' }
            ],
            calendar: [
                { name: 'Term 1 Start', date: '2024-01-15' },
                { name: 'Mid-term Break', date: '2024-03-10' }
            ],
            todayDuty: [
                { location: 'Main Gate', teacher: 'Mr. Kamau' },
                { location: 'Dining Hall', teacher: 'Ms. Atieno' }
            ],
            tasks: [
                { id: 1, title: 'Review teacher applications', completed: false, dueDate: '2024-03-20' }
            ],
            timetable: [
                { time: '9:00 AM', title: 'Staff Briefing', description: 'Daily' }
            ],
            recentActivity: [
                { title: 'New teacher application', description: 'Jane Doe applied', icon: 'user-plus', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', timestamp: new Date() }
            ]
        },
        teacher: {
            stats: {
                totalStudents: 42,
                totalClasses: 2,
                classAverage: 78.5,
                averageGrowth: 2.5,
                attendanceToday: { present: 38, total: 42 },
                pendingTasks: 5,
                overdueTasks: 3
            },
            students: [
                { id: 1, name: 'Sarah Johnson', class: '10A', elimuid: 'ELI-2024-001', attendance: 95, average: 85 },
                { id: 2, name: 'Michael Williams', class: '10A', elimuid: 'ELI-2024-002', attendance: 88, average: 78 },
                { id: 3, name: 'Emma Davis', class: '10B', elimuid: 'ELI-2024-003', attendance: 72, average: 82 }
            ],
            todayDuty: {
                location: 'Main Gate • 7:30 AM - 3:30 PM',
                status: 'pending',
                lastRating: 4.5
            },
            tasks: [
                { id: 1, title: 'Grade Mathematics exams', completed: false, dueDate: '2024-03-21', overdue: true }
            ]
        },
        parent: {
            children: [
                { id: 1, name: 'Sarah', grade: '10' },
                { id: 2, name: 'Michael', grade: '8' }
            ],
            selectedChild: {
                attendance: 95,
                average: 82,
                aboveAverage: true,
                homeworkCount: 3,
                homeworkPending: true,
                feeBalance: 250,
                feeDueDays: 5,
                todayAttendance: { checkInTime: '7:45 AM', gate: 'Main Entrance' },
                weeklyAttendance: [true, true, true, true, false],
                grades: [
                    { subject: 'Mathematics', score: 85, grade: 'A-', color: 'green', teacher: 'Mr. Kamau', date: new Date() }
                ]
            },
            plans: [
                { id: 'basic', name: 'Basic', price: 0, features: 'Attendance only', current: true },
                { id: 'premium', name: 'Premium', price: 5, features: 'Grades + Reports', current: false },
                { id: 'elite', name: 'Elite', price: 10, features: 'Live chat + AI tutor', current: false }
            ],
            teachers: [
                { id: 1, name: 'Mr. Kamau', subject: 'Mathematics' }
            ],
            recentMessages: [
                { from: 'Mr. Kamau', preview: 'Sarah is doing well in...', timestamp: new Date() }
            ],
            dutyRoster: [
                { location: 'Main Gate', teacher: 'Mr. Kamau', time: '7:30-10:30' }
            ]
        },
        student: {
            elimuid: 'ELI-2024-001',
            classAverage: 82,
            attendance: 95,
            studyGroups: 3,
            currentGroup: {
                name: 'Grade 10 Math Study Group',
                id: 'group1',
                onlineCount: 5
            },
            chatHistory: [
                { content: 'Can anyone help with quadratic equations?', sender: 'Alex', sent: false, timestamp: new Date() },
                { content: 'Sure! Use the formula x = [-b ± √(b²-4ac)]/2a', sender: 'You', sent: true, timestamp: new Date() }
            ],
            schedule: [
                { subject: 'Mathematics', time: '8:00 AM - 9:30 AM' },
                { subject: 'English', time: '10:00 AM - 11:30 AM' }
            ],
            grades: [
                { subject: 'Mathematics', score: 85, letter: 'A-', color: 'green' },
                { subject: 'English', score: 78, letter: 'B+', color: 'yellow' }
            ],
            exams: [
                { subject: 'Mathematics', name: 'Mid-term', topics: 'Algebra, Calculus', daysUntil: 3 }
            ],
            homework: [
                { subject: 'English', title: 'Essay', description: 'Write 1000 words', dueDate: '2024-03-25', urgent: false }
            ],
            schoolInfo: {
                duty: [
                    { location: 'Main Gate', teacher: 'Mr. Kamau' }
                ],
                announcements: ['School closes at 3:30 PM today'],
                events: [{ name: 'Sports Day', date: '2024-04-15' }]
            }
        }
    };
    return mockData[role] || {};
}

function updateUserInfo() {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const name = user.name || 'User';
    const initials = name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
    
    const userInitials = document.getElementById('user-initials');
    const userName = document.getElementById('user-name');
    const dropdownName = document.getElementById('dropdown-user-name');
    const dropdownEmail = document.getElementById('dropdown-user-email');
    
    if (userInitials) userInitials.textContent = initials;
    if (userName) userName.textContent = name;
    if (dropdownName) dropdownName.textContent = name;
    if (dropdownEmail) dropdownEmail.textContent = user.email || '';
}

// UI functions
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

function showToast(message, type = 'info') {
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
    toast.innerHTML = `<i data-lucide="${icons[type]}" class="h-5 w-5"></i><span>${message}</span>`;
    
    container.appendChild(toast);
    lucide.createIcons();
    setTimeout(() => toast.remove(), 3000);
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    authToken = null;
    refreshToken = null;
    
    const landingPage = document.getElementById('landing-page');
    const dashboardContainer = document.getElementById('dashboard-container');
    
    if (landingPage) landingPage.style.display = 'block';
    if (dashboardContainer) dashboardContainer.style.display = 'none';
    
    showToast('Logged out successfully', 'success');
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function timeAgo(timestamp) {
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

function updateChart(value, chartId) {
    console.log(`Updating chart ${chartId} with value ${value}`);
}

// Action functions
function approveTeacher(teacherId) {
    showToast(`Teacher ${teacherId} approved`, 'success');
}

function rejectTeacher(teacherId) {
    showToast(`Teacher ${teacherId} rejected`, 'error');
}

function approveSchool(schoolId) {
    showToast(`School ${schoolId} approved`, 'success');
}

function rejectSchool(schoolId) {
    showToast(`School ${schoolId} rejected`, 'error');
}

function approveNameChange(requestId) {
    // Update school name in settings
    const request = document.querySelector(`[onclick="approveNameChange('${requestId}')"]`)?.closest('tr');
    if (request) {
        const newName = request.querySelector('.font-semibold.text-primary')?.textContent;
        if (newName && schoolSettings) {
            schoolSettings.schoolName = newName;
            localStorage.setItem('schoolSettings', JSON.stringify(schoolSettings));
            showToast(`Name change approved - School name updated to "${newName}" across all dashboards`, 'success');
        }
    }
}

function rejectNameChange(requestId) {
    showToast(`Name change request ${requestId} rejected`, 'error');
}

function toggleSchoolStatus(schoolId) {
    showToast(`School ${schoolId} status toggled`, 'info');
}

function toggleSchoolEnabled(schoolId) {
    showToast(`School ${schoolId} ${Math.random() > 0.5 ? 'enabled' : 'disabled'}`, 'info');
}

function addTask() {
    showToast('Add task form opened', 'info');
}

function addTeacherTask() {
    showToast('Add teacher task form opened', 'info');
}

function assignDuty() {
    showToast('Duty assigned successfully', 'success');
}

function downloadTemplate(type) {
    showToast(`Downloading ${type} template`, 'info');
}

// Initialize charts (placeholder)
function initRoleCharts(role, data) {
    console.log(`Initializing charts for ${role}`);
}

function updateChartTheme() {
    console.log('Updating chart theme');
}

// Export functions to global scope
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.handleAuthSubmit = handleAuthSubmit;
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
window.logout = logout;
window.sendChatMessage = sendChatMessage;
window.askAITutor = askAITutor;
window.updateChart = updateChart;
window.approveTeacher = approveTeacher;
window.rejectTeacher = rejectTeacher;
window.approveSchool = approveSchool;
window.rejectSchool = rejectSchool;
window.approveNameChange = approveNameChange;
window.rejectNameChange = rejectNameChange;
window.toggleSchoolStatus = toggleSchoolStatus;
window.toggleSchoolEnabled = toggleSchoolEnabled;
window.addTask = addTask;
window.addTeacherTask = addTeacherTask;
window.assignDuty = assignDuty;
window.downloadTemplate = downloadTemplate;
window.toggleSwitch = toggleSwitch;
window.updateCurriculumInfo = updateCurriculumInfo;
window.updateSchoolLevel = updateSchoolLevel;
window.addTerm = addTerm;
window.addCustomSubject = addCustomSubject;
window.removeCustomSubject = removeCustomSubject;
window.saveAllSettings = saveAllSettings;
window.updateStudentGrade = updateStudentGrade;
window.saveStudentGrade = saveStudentGrade;
window.initRoleCharts = initRoleCharts;
window.updateChartTheme = updateChartTheme;

