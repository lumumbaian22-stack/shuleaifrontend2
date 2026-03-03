// Main application logic
let currentRole = null;
let clickCount = 0;

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    lucide.createIcons();
    
    // Check if user is already authenticated
    const isAuthenticated = await checkAuth();
    
    if (isAuthenticated) {
        const user = JSON.parse(localStorage.getItem('user'));
        showDashboard(user.role);
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
            showDashboard(currentRole);
        } else {
            // Handle signup based on role
            const userData = {
                name: document.getElementById('auth-name')?.value,
                email,
                password,
                role: currentRole
            };
            
            if (currentRole === 'admin') {
                userData.schoolName = document.getElementById('auth-school-name')?.value;
                userData.schoolLevel = document.getElementById('auth-school-level')?.value;
            } else if (currentRole === 'teacher') {
                userData.schoolId = document.getElementById('auth-school-id')?.value;
                userData.subject = document.getElementById('auth-subject')?.value;
            } else if (currentRole === 'parent' || currentRole === 'student') {
                userData.elimuid = document.getElementById('auth-elimuid')?.value;
            }
            
            await register(userData);
            showToast('Registration successful! Please sign in.', 'success');
            openAuthModal(currentRole, 'signin');
        }
    } catch (error) {
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
    const landingPage = document.getElementById('landing-page');
    const dashboardContainer = document.getElementById('dashboard-container');
    const pageTitle = document.getElementById('page-title');
    
    if (landingPage) landingPage.style.display = 'none';
    if (dashboardContainer) dashboardContainer.style.display = 'block';
    if (pageTitle) pageTitle.textContent = role.charAt(0).toUpperCase() + role.slice(1) + ' Dashboard';
    
    // Load role-specific dashboard page
    await loadDashboardContent(role);
    updateSidebar(role);
    updateUserInfo();
    
    lucide.createIcons();
}

async function loadDashboardContent(role) {
    const content = document.getElementById('dashboard-content');
    if (!content) return;
    
    showLoading();
    
    try {
        // First try to load from pages folder
        const response = await fetch(`pages/${role}.html`);
        
        if (response.ok) {
            const html = await response.text();
            content.innerHTML = html;
        } else {
            // Fallback to default dashboard if page not found
            content.innerHTML = getDefaultDashboard(role);
        }
        
        // Fetch dashboard data from API
        try {
            const dashboardData = await fetchDashboardData(role);
            updateDashboardWithData(role, dashboardData);
        } catch (error) {
            console.log('Using mock data for development');
        }
        
        // Initialize charts
        setTimeout(() => {
            initRoleCharts(role);
        }, 100);
        
        // Setup page-specific event listeners
        setupPageListeners(role);
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
        content.innerHTML = `<div class="text-center py-12">
            <i data-lucide="alert-circle" class="h-12 w-12 mx-auto text-red-500 mb-4"></i>
            <p class="text-red-500">Failed to load dashboard. Please try again.</p>
        </div>`;
    } finally {
        hideLoading();
    }
}

function getDefaultDashboard(role) {
    const dashboards = {
        superadmin: `<div class="text-center py-12"><p>Super Admin Dashboard Loading...</p></div>`,
        admin: `<div class="text-center py-12"><p>Admin Dashboard Loading...</p></div>`,
        teacher: `<div class="text-center py-12"><p>Teacher Dashboard Loading...</p></div>`,
        parent: `<div class="text-center py-12"><p>Parent Dashboard Loading...</p></div>`,
        student: `<div class="text-center py-12"><p>Student Dashboard Loading...</p></div>`
    };
    return dashboards[role] || '<div class="text-center py-12"><p>Dashboard Loading...</p></div>';
}

async function fetchDashboardData(role) {
    const endpoints = {
        superadmin: '/api/super-admin/overview',
        admin: '/api/admin/dashboard',
        teacher: '/api/teacher/dashboard',
        parent: '/api/parent/dashboard',
        student: '/api/student/dashboard'
    };
    
    try {
        const data = await apiRequest(endpoints[role]);
        return data;
    } catch (error) {
        console.error(`Failed to fetch ${role} dashboard:`, error);
        // Return mock data for development
        return getMockData(role);
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
                { id: 1, name: 'Nairobi High School', adminEmail: 'admin@nairobi.edu', level: 'Secondary', status: 'active' },
                { id: 2, name: 'Mombasa Academy', adminEmail: 'admin@mombasa.edu', level: 'Primary', status: 'pending' }
            ],
            nameChangeRequests: [
                { id: 1, oldName: 'City School', newName: 'City Academy', amount: 50, createdAt: new Date() }
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
                { id: 1, name: 'Jane Doe', subject: 'Mathematics', appliedAt: new Date() }
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
                { id: 1, name: 'Sarah Johnson', class: 'Grade 10A', elimuid: 'ELI-2024-001', attendance: 95 }
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

function updateDashboardWithData(role, data) {
    // This function will be expanded based on the dashboard HTML structure
    console.log(`Updating ${role} dashboard with data:`, data);
}

function setupPageListeners(role) {
    switch(role) {
        case 'teacher':
            // Setup file upload if elements exist
            setTimeout(() => {
                setupFileUpload('csv-drop-zone', 'csv-file-input', 'students');
            }, 500);
            break;
    }
}

function updateSidebar(role) {
    const nav = document.getElementById('sidebar-nav');
    if (!nav) return;
    
    const sidebarItems = getSidebarItems(role);
    nav.innerHTML = sidebarItems;
    lucide.createIcons();
}

function getSidebarItems(role) {
    const items = {
        superadmin: `
            <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 bg-sidebar-accent text-sidebar-accent-foreground">
                <i data-lucide="shield" class="h-5 w-5"></i>
                <span>Dashboard</span>
            </a>
            <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent">
                <i data-lucide="building-2" class="h-5 w-5"></i>
                <span>Schools</span>
            </a>
            <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent">
                <i data-lucide="activity" class="h-5 w-5"></i>
                <span>Platform Health</span>
            </a>
        `,
        admin: `
            <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 bg-sidebar-accent text-sidebar-accent-foreground">
                <i data-lucide="school" class="h-5 w-5"></i>
                <span>Dashboard</span>
            </a>
            <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent">
                <i data-lucide="users" class="h-5 w-5"></i>
                <span>Teachers</span>
            </a>
            <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent">
                <i data-lucide="calendar" class="h-5 w-5"></i>
                <span>Calendar</span>
            </a>
            <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent">
                <i data-lucide="clock" class="h-5 w-5"></i>
                <span>Duty</span>
            </a>
        `,
        teacher: `
            <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 bg-sidebar-accent text-sidebar-accent-foreground">
                <i data-lucide="users" class="h-5 w-5"></i>
                <span>Dashboard</span>
            </a>
            <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent">
                <i data-lucide="upload" class="h-5 w-5"></i>
                <span>Students</span>
            </a>
            <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent">
                <i data-lucide="calendar-check" class="h-5 w-5"></i>
                <span>Attendance</span>
            </a>
            <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent">
                <i data-lucide="trending-up" class="h-5 w-5"></i>
                <span>Grades</span>
            </a>
        `,
        parent: `
            <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 bg-sidebar-accent text-sidebar-accent-foreground">
                <i data-lucide="activity" class="h-5 w-5"></i>
                <span>Dashboard</span>
            </a>
            <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent">
                <i data-lucide="trending-up" class="h-5 w-5"></i>
                <span>Progress</span>
            </a>
            <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent">
                <i data-lucide="credit-card" class="h-5 w-5"></i>
                <span>Payments</span>
            </a>
        `,
        student: `
            <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 bg-sidebar-accent text-sidebar-accent-foreground">
                <i data-lucide="message-circle" class="h-5 w-5"></i>
                <span>Dashboard</span>
            </a>
            <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent">
                <i data-lucide="bot" class="h-5 w-5"></i>
                <span>AI Tutor</span>
            </a>
            <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent">
                <i data-lucide="calendar" class="h-5 w-5"></i>
                <span>Schedule</span>
            </a>
        `
    };
    
    return items[role] || '';
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

// Export functions to global scope
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.handleAuthSubmit = handleAuthSubmit;
window.showDashboard = showDashboard;
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