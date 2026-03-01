// ==================== APP INITIALIZATION ====================

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load HTML content into containers
    loadLandingPage();
    loadLoginPages();
    loadSignupPages();
    loadDashboards();
    loadModals();
    
    // Show landing page
    showLanding();
    
    // Set up resize handler
    window.addEventListener('resize', function() {
        const chatWidget = document.getElementById('chat-widget');
        if (window.innerWidth <= 768) {
            chatWidget.classList.remove('draggable');
            chatWidget.style.left = 'auto';
            chatWidget.style.right = 'auto';
            chatWidget.style.top = 'auto';
            chatWidget.style.bottom = '0';
        } else {
            chatWidget.classList.add('draggable');
            initDraggableChat();
        }
    });

    // ========== NEW ENHANCEMENTS ==========
    initThemeToggle();
    initMobileOverlay();
    if (localStorage.getItem('shuleai_darkmode') === 'true') {
        document.documentElement.classList.add('dark');
        updateThemeIcons(true);
    }
});

// ==================== DARK MODE TOGGLE ====================
function initThemeToggle() {
    const dashboards = ['admin-dashboard', 'teacher-dashboard', 'parent-dashboard', 'student-dashboard', 'super-dashboard'];
    dashboards.forEach(dashId => {
        const dash = document.getElementById(dashId);
        if (dash) {
            const navRight = dash.querySelector('.nav-right');
            if (navRight && !dash.querySelector('.theme-toggle')) {
                const btn = document.createElement('button');
                btn.className = 'theme-toggle';
                const isDark = document.documentElement.classList.contains('dark');
                btn.innerHTML = `<i class="fas ${isDark ? 'fa-sun' : 'fa-moon'}"></i>`;
                btn.onclick = toggleDarkMode;
                navRight.insertBefore(btn, navRight.firstChild);
            }
        }
    });
}

function toggleDarkMode(e) {
    const html = document.documentElement;
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    updateThemeIcons(isDark);
    localStorage.setItem('shuleai_darkmode', isDark);
}

function updateThemeIcons(isDark) {
    document.querySelectorAll('.theme-toggle i').forEach(icon => {
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    });
}

// ==================== MOBILE OVERLAY ====================
function initMobileOverlay() {
    if (!document.getElementById('mobile-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'mobile-overlay';
        overlay.id = 'mobile-overlay';
        overlay.onclick = closeAllSidebars;
        document.body.appendChild(overlay);
    }
}

function closeAllSidebars() {
    document.querySelectorAll('.sidebar').forEach(s => s.classList.remove('active'));
    const overlay = document.getElementById('mobile-overlay');
    if (overlay) overlay.classList.remove('active');
}

// Preserve original toggleSidebar if it exists, then override
const originalToggleSidebar = window.toggleSidebar;
window.toggleSidebar = function(id) {
    const sidebar = document.getElementById(id);
    const overlay = document.getElementById('mobile-overlay');
    sidebar.classList.toggle('active');
    if (sidebar.classList.contains('active')) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
};

// ==================== ENHANCED TOAST ====================
window.showToast = function(msg, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = document.createElement('i');
    icon.className = 'fas ' + {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    }[type] || 'fa-info-circle';
    toast.appendChild(icon);
    toast.appendChild(document.createTextNode(msg));
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};

// ==================== ORIGINAL FUNCTIONS (modified) ====================

// Load landing page content
function loadLandingPage() {
    document.getElementById('landing-page').innerHTML = `
        <div class="landing-container">
            <header class="landing-header">
                <div class="landing-logo">
                    <i class="fas fa-graduation-cap"></i>
                    <h1>Shule<span class="ai">AI</span></h1>
                    <p class="landing-tagline">Complete School Intelligence System</p>
                </div>
            </header>
            <div class="hero-card">
                <h2>Welcome to the Future of Education</h2>
                <p class="hero-description">ShuleAI is a modern AI-powered school management system designed for schools, teachers, parents, and students. It simplifies attendance tracking, academic monitoring, analytics, and administration through one intelligent platform.</p>
                <div class="role-grid">
                    <div class="role-card admin" onclick="showLogin('admin')">
                        <i class="fas fa-user-shield"></i>
                        <h4>Administrator</h4>
                        <p>Full School Oversight</p>
                    </div>
                    <div class="role-card teacher" onclick="showLogin('teacher')">
                        <i class="fas fa-chalkboard-teacher"></i>
                        <h4>Teacher</h4>
                        <p>Teach & Assess</p>
                    </div>
                    <div class="role-card parent" onclick="showLogin('parent')">
                        <i class="fas fa-user-friends"></i>
                        <h4>Parent</h4>
                        <p>Monitor & Guide</p>
                    </div>
                    <div class="role-card student" onclick="showLogin('student')">
                        <i class="fas fa-user-graduate"></i>
                        <h4>Student</h4>
                        <p>Learn with AI</p>
                    </div>
                    <div class="role-card super" onclick="showLogin('super')" id="super-admin-link" style="display: none;">
                        <i class="fas fa-crown"></i>
                        <h4>Super Admin</h4>
                        <p>Platform Control</p>
                    </div>
                </div>
            </div>
            <div style="text-align: center; color: rgba(255,255,255,0.5); font-size: 0.8rem; margin-top: 2rem;" ondblclick="document.getElementById('super-admin-link').style.display='block'; showToast('Super admin unlocked','info')">
                Double-tap for advanced options
            </div>
        </div>
    `;
}

// Load login pages (now single-column and centered, with signup links)
function loadLoginPages() {
    // Admin Login
    document.getElementById('admin-login').innerHTML = `
        <div class="login-container">
            <div class="login-header">
                <i class="fas fa-user-shield" style="color: #ef4444;"></i>
                <h1>Administrator Portal</h1>
            </div>
            <div class="login-box" style="grid-template-columns: 1fr;">
                <div class="login-card">
                    <h2><i class="fas fa-lock" style="color: #ef4444;"></i> Admin Login</h2>
                    <form onsubmit="handleLogin(event, 'admin')">
                        <div class="form-group">
                            <label><i class="fas fa-school"></i> School Code</label>
                            <input type="text" id="admin-school" value="GRN001" placeholder="Enter school code">
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-id-card"></i> Admin ID</label>
                            <input type="text" id="admin-id" value="ADMIN001" placeholder="Enter admin ID">
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-key"></i> Password</label>
                            <input type="password" id="admin-pass" value="admin123" placeholder="Enter password">
                        </div>
                        <button type="submit" class="btn-login">
                            <i class="fas fa-sign-in-alt"></i> Login
                        </button>
                    </form>
                    <div class="demo-credentials">
                        <h4>Demo Credentials</h4>
                        <p><strong>School:</strong> GRN001 | <strong>ID:</strong> ADMIN001 | <strong>Password:</strong> admin123</p>
                    </div>
                    <div style="margin-top: 1rem; text-align: center;">
                        Don't have an account? <a href="#" onclick="showSignup('admin')">Sign up</a>
                    </div>
                    <a class="back-link" onclick="showLanding()">
                        <i class="fas fa-arrow-left"></i> Back to Home
                    </a>
                </div>
            </div>
        </div>
    `;

    // Teacher Login
    document.getElementById('teacher-login').innerHTML = `
        <div class="login-container">
            <div class="login-header">
                <i class="fas fa-chalkboard-teacher" style="color: #3b82f6;"></i>
                <h1>Teacher Portal</h1>
            </div>
            <div class="login-box" style="grid-template-columns: 1fr;">
                <div class="login-card">
                    <h2><i class="fas fa-lock" style="color: #3b82f6;"></i> Teacher Login</h2>
                    <form onsubmit="handleLogin(event, 'teacher')">
                        <div class="form-group">
                            <label><i class="fas fa-school"></i> School Code</label>
                            <input type="text" id="teacher-school" value="GRN001">
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-id-card"></i> Teacher ID</label>
                            <input type="text" id="teacher-id" value="TCH001">
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-key"></i> Password</label>
                            <input type="password" id="teacher-pass" value="teacher123">
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-book"></i> Subject</label>
                            <select id="teacher-subject">
                                <option>Mathematics</option>
                                <option>Science</option>
                                <option>English</option>
                                <option>History</option>
                            </select>
                        </div>
                        <button type="submit" class="btn-login">
                            <i class="fas fa-sign-in-alt"></i> Login
                        </button>
                    </form>
                    <div class="demo-credentials">
                        <h4>Demo Credentials</h4>
                        <p><strong>School:</strong> GRN001 | <strong>ID:</strong> TCH001 | <strong>Password:</strong> teacher123</p>
                    </div>
                    <div style="margin-top: 1rem; text-align: center;">
                        Don't have an account? <a href="#" onclick="showSignup('teacher')">Sign up</a>
                    </div>
                    <a class="back-link" onclick="showLanding()">
                        <i class="fas fa-arrow-left"></i> Back to Home
                    </a>
                </div>
            </div>
        </div>
    `;

    // Parent Login
    document.getElementById('parent-login').innerHTML = `
        <div class="login-container">
            <div class="login-header">
                <i class="fas fa-user-friends" style="color: #eab308;"></i>
                <h1>Parent Portal</h1>
            </div>
            <div class="login-box" style="grid-template-columns: 1fr;">
                <div class="login-card">
                    <h2><i class="fas fa-lock" style="color: #eab308;"></i> Parent Login</h2>
                    <form onsubmit="handleLogin(event, 'parent')">
                        <div class="form-group">
                            <label><i class="fas fa-id-card"></i> Parent ID</label>
                            <input type="text" id="parent-id" value="PAR001">
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-key"></i> Password</label>
                            <input type="password" id="parent-pass" value="parent123">
                        </div>
                        <button type="submit" class="btn-login">
                            <i class="fas fa-sign-in-alt"></i> Login
                        </button>
                    </form>
                    <div class="demo-credentials">
                        <h4>Demo Credentials</h4>
                        <p><strong>ID:</strong> PAR001 | <strong>Password:</strong> parent123</p>
                        <p><small>Access to multiple children: Emma (Grade 10A) & James (Grade 8B)</small></p>
                    </div>
                    <div style="margin-top: 1rem; text-align: center;">
                        Don't have an account? <a href="#" onclick="showSignup('parent')">Sign up</a>
                    </div>
                    <a class="back-link" onclick="showLanding()">
                        <i class="fas fa-arrow-left"></i> Back to Home
                    </a>
                </div>
            </div>
        </div>
    `;

    // Student Login
    document.getElementById('student-login').innerHTML = `
        <div class="login-container">
            <div class="login-header">
                <i class="fas fa-user-graduate" style="color: #10b981;"></i>
                <h1>Student Portal</h1>
            </div>
            <div class="login-box" style="grid-template-columns: 1fr;">
                <div class="login-card">
                    <h2><i class="fas fa-lock" style="color: #10b981;"></i> Student Login</h2>
                    <form onsubmit="handleLogin(event, 'student')">
                        <div class="form-group">
                            <label><i class="fas fa-school"></i> School Code</label>
                            <input type="text" id="student-school" value="GRN001">
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-qrcode"></i> ELIMUID</label>
                            <input type="text" id="student-id" value="ELIMU-2026-001">
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-key"></i> Password</label>
                            <input type="password" id="student-pass" value="student123">
                        </div>
                        <button type="submit" class="btn-login">
                            <i class="fas fa-sign-in-alt"></i> Login
                        </button>
                    </form>
                    <div class="demo-credentials">
                        <h4>Demo Credentials</h4>
                        <p><strong>School:</strong> GRN001 | <strong>ELIMUID:</strong> ELIMU-2026-001 | <strong>Password:</strong> student123</p>
                    </div>
                    <a class="back-link" onclick="showLanding()">
                        <i class="fas fa-arrow-left"></i> Back to Home
                    </a>
                </div>
            </div>
        </div>
    `;

    // Super Admin Login
    document.getElementById('super-login').innerHTML = `
        <div class="login-container">
            <div class="login-header">
                <i class="fas fa-crown" style="color: #8b5cf6;"></i>
                <h1>Super Admin</h1>
            </div>
            <div class="login-box" style="grid-template-columns: 1fr;">
                <div class="login-card">
                    <h2><i class="fas fa-lock" style="color: #8b5cf6;"></i> Platform Access</h2>
                    <form onsubmit="handleLogin(event, 'super')">
                        <div class="form-group">
                            <label><i class="fas fa-key"></i> Secret Key</label>
                            <input type="password" id="super-key" value="SUPER_SECRET_2024">
                        </div>
                        <button type="submit" class="btn-login">
                            <i class="fas fa-sign-in-alt"></i> Access Platform
                        </button>
                    </form>
                    <div class="demo-credentials">
                        <h4>Access Key</h4>
                        <p><strong>Key:</strong> SUPER_SECRET_2024</p>
                    </div>
                    <a class="back-link" onclick="showLanding()">
                        <i class="fas fa-arrow-left"></i> Back to Home
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Load signup pages
function loadSignupPages() {
    // Admin Signup
    document.getElementById('admin-signup').innerHTML = `
        <div class="login-container">
            <div class="login-header">
                <i class="fas fa-user-shield" style="color: #ef4444;"></i>
                <h1>Register School & Admin</h1>
            </div>
            <div class="login-box" style="grid-template-columns: 1fr;">
                <div class="login-card">
                    <h2><i class="fas fa-user-plus" style="color: #ef4444;"></i> Admin & School Info</h2>
                    <form onsubmit="handleSignup(event, 'admin')">
                        <h3>Personal Details</h3>
                        <div class="form-group">
                            <label><i class="fas fa-user"></i> Full Name</label>
                            <input type="text" id="admin-name" required>
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-envelope"></i> Email</label>
                            <input type="email" id="admin-email" required>
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-phone"></i> Phone</label>
                            <input type="tel" id="admin-phone" required>
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-lock"></i> Password</label>
                            <input type="password" id="admin-password" required>
                        </div>
                        <h3>School Details</h3>
                        <div class="form-group">
                            <label><i class="fas fa-school"></i> School Name</label>
                            <input type="text" id="school-name" required>
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-map-marker-alt"></i> School Address</label>
                            <input type="text" id="school-address" required>
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-code"></i> School Code (unique)</label>
                            <input type="text" id="school-code" placeholder="e.g., GRN001" required>
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-book"></i> Curriculum System</label>
                            <select id="school-system" required>
                                <option value="844">8-4-4</option>
                                <option value="cbc">CBC</option>
                                <option value="british">British</option>
                                <option value="american">American</option>
                            </select>
                        </div>
                        <button type="submit" class="btn-login">
                            <i class="fas fa-check-circle"></i> Register School
                        </button>
                    </form>
                    <div style="margin-top: 1.5rem; text-align: center;">
                        Already have an account? <a href="#" onclick="showLogin('admin')">Login</a>
                    </div>
                    <a class="back-link" onclick="showLanding()">
                        <i class="fas fa-arrow-left"></i> Back to Home
                    </a>
                </div>
            </div>
        </div>
    `;

    // Teacher Signup
    document.getElementById('teacher-signup').innerHTML = `
        <div class="login-container">
            <div class="login-header">
                <i class="fas fa-chalkboard-teacher" style="color: #3b82f6;"></i>
                <h1>Teacher Registration</h1>
                <p style="color: white;">(Pending admin approval)</p>
            </div>
            <div class="login-box" style="grid-template-columns: 1fr;">
                <div class="login-card">
                    <h2><i class="fas fa-user-plus" style="color: #3b82f6;"></i> Teacher Info</h2>
                    <form onsubmit="handleSignup(event, 'teacher')">
                        <div class="form-group">
                            <label><i class="fas fa-user"></i> Full Name</label>
                            <input type="text" id="teacher-name" required>
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-envelope"></i> Email</label>
                            <input type="email" id="teacher-email" required>
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-phone"></i> Phone</label>
                            <input type="tel" id="teacher-phone" required>
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-book"></i> Subject</label>
                            <input type="text" id="teacher-subject" required>
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-school"></i> School Code</label>
                            <input type="text" id="teacher-school-code" placeholder="e.g., GRN001" required>
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-lock"></i> Password</label>
                            <input type="password" id="teacher-password" required>
                        </div>
                        <button type="submit" class="btn-login">
                            <i class="fas fa-paper-plane"></i> Submit for Approval
                        </button>
                    </form>
                    <div style="margin-top: 1.5rem; text-align: center;">
                        Already have an account? <a href="#" onclick="showLogin('teacher')">Login</a>
                    </div>
                    <a class="back-link" onclick="showLanding()">
                        <i class="fas fa-arrow-left"></i> Back to Home
                    </a>
                </div>
            </div>
        </div>
    `;

    // Parent Signup
    document.getElementById('parent-signup').innerHTML = `
        <div class="login-container">
            <div class="login-header">
                <i class="fas fa-user-friends" style="color: #eab308;"></i>
                <h1>Parent Registration</h1>
            </div>
            <div class="login-box" style="grid-template-columns: 1fr;">
                <div class="login-card">
                    <h2><i class="fas fa-user-plus" style="color: #eab308;"></i> Parent Info</h2>
                    <form onsubmit="handleSignup(event, 'parent')">
                        <div class="form-group">
                            <label><i class="fas fa-user"></i> Full Name</label>
                            <input type="text" id="parent-name" required>
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-envelope"></i> Email</label>
                            <input type="email" id="parent-email" required>
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-phone"></i> Phone</label>
                            <input type="tel" id="parent-phone" required>
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-child"></i> Student's ELIMUID</label>
                            <input type="text" id="student-elimuid" placeholder="e.g., ELIMU-2026-001" required>
                            <small>You will be linked to this student and their school.</small>
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-lock"></i> Password</label>
                            <input type="password" id="parent-password" required>
                        </div>
                        <button type="submit" class="btn-login">
                            <i class="fas fa-link"></i> Link to Child
                        </button>
                    </form>
                    <div style="margin-top: 1.5rem; text-align: center;">
                        Already have an account? <a href="#" onclick="showLogin('parent')">Login</a>
                    </div>
                    <a class="back-link" onclick="showLanding()">
                        <i class="fas fa-arrow-left"></i> Back to Home
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Load dashboards (original, unchanged)
function loadDashboards() {
    // Admin Dashboard
    document.getElementById('admin-dashboard').innerHTML = `
        <nav class="dashboard-nav">
            <div class="nav-left">
                <div class="logo">
                    <i class="fas fa-user-shield" style="color: #ef4444;"></i>
                    <div>
                        <h2 id="admin-school-name">Greenwood High</h2>
                        <p class="role-tag" id="admin-system-info">8-4-4 System</p>
                    </div>
                </div>
            </div>
            <div class="nav-center">
                <div class="info">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Term 1, 2024</span>
                </div>
            </div>
            <div class="nav-right">
                <div class="profile" onclick="showAdminProfile()">
                    <img src="https://ui-avatars.com/api/?name=Admin&background=ef4444&color=fff&size=40" alt="Admin">
                    <div class="profile-info">
                        <span class="profile-name" id="admin-name">Admin</span>
                        <span class="profile-detail">Supervisor</span>
                    </div>
                </div>
                <button class="btn-icon" onclick="logout()" style="background: rgba(239,68,68,0.1); border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer;">
                    <i class="fas fa-sign-out-alt" style="color: #ef4444;"></i>
                </button>
            </div>
        </nav>
        <div class="dashboard-container">
            <aside class="sidebar" id="admin-sidebar">
                <div class="sidebar-menu" id="admin-menu"></div>
                <div class="sidebar-footer">
                    <a class="back-link" onclick="showLanding()">
                        <i class="fas fa-home"></i> Back to Home
                    </a>
                </div>
            </aside>
            <main class="main-content" id="admin-content"></main>
        </div>
        <button class="mobile-menu-toggle" onclick="toggleSidebar('admin-sidebar')">
            <i class="fas fa-bars"></i>
        </button>
    `;

    // Teacher Dashboard
    document.getElementById('teacher-dashboard').innerHTML = `
        <nav class="dashboard-nav">
            <div class="nav-left">
                <div class="logo">
                    <i class="fas fa-chalkboard-teacher" style="color: #3b82f6;"></i>
                    <div>
                        <h2 id="teacher-school-name">Greenwood High</h2>
                        <p class="role-tag" id="teacher-info">John Doe · Mathematics</p>
                    </div>
                </div>
            </div>
            <div class="nav-center">
                <div class="info" id="teacher-class-info">
                    <i class="fas fa-users"></i>
                    <span>Grade 10A · 35 Students</span>
                </div>
            </div>
            <div class="nav-right">
                <div class="profile" onclick="showTeacherProfile()">
                    <img src="https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff&size=40" alt="Teacher">
                    <div class="profile-info">
                        <span class="profile-name" id="teacher-name">John Doe</span>
                        <span class="profile-detail">Mathematics</span>
                    </div>
                </div>
                <button class="btn-icon" onclick="logout()" style="background: rgba(59,130,246,0.1); border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer;">
                    <i class="fas fa-sign-out-alt" style="color: #3b82f6;"></i>
                </button>
            </div>
        </nav>
        <div class="dashboard-container">
            <aside class="sidebar" id="teacher-sidebar">
                <div class="sidebar-menu" id="teacher-menu"></div>
                <div class="sidebar-footer">
                    <a class="back-link" onclick="showLanding()">
                        <i class="fas fa-home"></i> Back to Home
                    </a>
                </div>
            </aside>
            <main class="main-content" id="teacher-content"></main>
        </div>
        <button class="mobile-menu-toggle" onclick="toggleSidebar('teacher-sidebar')">
            <i class="fas fa-bars"></i>
        </button>
    `;

    // Parent Dashboard
    document.getElementById('parent-dashboard').innerHTML = `
        <nav class="dashboard-nav">
            <div class="nav-left">
                <div class="logo">
                    <i class="fas fa-user-friends" style="color: #eab308;"></i>
                    <div>
                        <h2 id="parent-school-name">Greenwood High</h2>
                        <p class="role-tag" id="parent-name">Parent Portal</p>
                    </div>
                </div>
            </div>
            <div class="nav-center">
                <div class="info" id="active-child-info">
                    <i class="fas fa-child"></i>
                    <span>Viewing: <span id="active-child-name">Emma Smith</span></span>
                </div>
            </div>
            <div class="nav-right">
                <button class="btn-icon" onclick="showParentPopup()" style="background: rgba(234,179,8,0.1); border: none; width: 40px; height: 40px; border-radius: 50%; margin-right: 0.5rem; cursor: pointer;">
                    <i class="fas fa-info-circle" style="color: #eab308;"></i>
                </button>
                <div class="profile" onclick="showParentProfile()">
                    <img src="https://ui-avatars.com/api/?name=Parent&background=eab308&color=333&size=40" alt="Parent">
                    <div class="profile-info">
                        <span class="profile-name">Parent</span>
                        <span class="profile-detail">John Smith</span>
                    </div>
                </div>
                <button class="btn-icon" onclick="logout()" style="background: rgba(234,179,8,0.1); border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer;">
                    <i class="fas fa-sign-out-alt" style="color: #eab308;"></i>
                </button>
            </div>
        </nav>
        <div class="dashboard-container">
            <aside class="sidebar" id="parent-sidebar">
                <div class="sidebar-menu" id="parent-menu"></div>
                <div class="sidebar-footer">
                    <a class="back-link" onclick="showLanding()">
                        <i class="fas fa-home"></i> Back to Home
                    </a>
                </div>
            </aside>
            <main class="main-content" id="parent-content"></main>
        </div>
        <button class="mobile-menu-toggle" onclick="toggleSidebar('parent-sidebar')">
            <i class="fas fa-bars"></i>
        </button>
    `;

    // Student Dashboard
    document.getElementById('student-dashboard').innerHTML = `
        <nav class="dashboard-nav">
            <div class="nav-left">
                <div class="logo">
                    <i class="fas fa-user-graduate" style="color: #10b981;"></i>
                    <div>
                        <h2 id="student-school-name">Greenwood High</h2>
                        <p class="role-tag" id="student-info">Emma Smith · Grade 10A</p>
                    </div>
                </div>
            </div>
            <div class="nav-center">
                <div class="info" id="student-achievement">
                    <i class="fas fa-star" style="color: #eab308;"></i>
                    <span>Average: 79%</span>
                </div>
            </div>
            <div class="nav-right">
                <button class="btn-icon" onclick="toggleChat()" style="background: rgba(16,185,129,0.1); border: none; width: 40px; height: 40px; border-radius: 50%; margin-right: 0.5rem; cursor: pointer;">
                    <i class="fas fa-comment" style="color: #10b981;"></i>
                </button>
                <div class="profile" onclick="showStudentProfile()">
                    <img src="https://ui-avatars.com/api/?name=Emma+Smith&background=10b981&color=fff&size=40" alt="Student">
                    <div class="profile-info">
                        <span class="profile-name">Emma</span>
                        <span class="profile-detail">Student</span>
                    </div>
                </div>
                <button class="btn-icon" onclick="logout()" style="background: rgba(16,185,129,0.1); border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer;">
                    <i class="fas fa-sign-out-alt" style="color: #10b981;"></i>
                </button>
            </div>
        </nav>
        <div class="dashboard-container">
            <aside class="sidebar" id="student-sidebar">
                <div class="sidebar-menu" id="student-menu"></div>
                <div class="sidebar-footer">
                    <a class="back-link" onclick="showLanding()">
                        <i class="fas fa-home"></i> Back to Home
                    </a>
                </div>
            </aside>
            <main class="main-content" id="student-content"></main>
        </div>
        <button class="mobile-menu-toggle" onclick="toggleSidebar('student-sidebar')">
            <i class="fas fa-bars"></i>
        </button>
    `;

    // Super Admin Dashboard
    document.getElementById('super-dashboard').innerHTML = `
        <nav class="dashboard-nav">
            <div class="nav-left">
                <div class="logo">
                    <i class="fas fa-crown" style="color: #8b5cf6;"></i>
                    <div>
                        <h2>Super Admin</h2>
                        <p class="role-tag">Platform Governance</p>
                    </div>
                </div>
            </div>
            <div class="nav-right">
                <button class="btn-icon" onclick="logout()" style="background: rgba(139,92,246,0.1); border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer;">
                    <i class="fas fa-sign-out-alt" style="color: #8b5cf6;"></i>
                </button>
            </div>
        </nav>
        <div class="dashboard-container">
            <aside class="sidebar" id="super-sidebar">
                <div class="sidebar-menu" id="super-menu"></div>
                <div class="sidebar-footer">
                    <a class="back-link" onclick="showLanding()">
                        <i class="fas fa-home"></i> Back to Home
                    </a>
                </div>
            </aside>
            <main class="main-content" id="super-content"></main>
        </div>
        <button class="mobile-menu-toggle" onclick="toggleSidebar('super-sidebar')">
            <i class="fas fa-bars"></i>
        </button>
    `;

    // Chat Widget
    document.getElementById('chat-widget').innerHTML = `
        <div class="chat-header" id="chat-header">
            <span><i class="fas fa-robot"></i> ShuleAI Assistant</span>
            <button onclick="minimizeChat()" style="background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer;">
                <i class="fas fa-minus"></i>
            </button>
        </div>
        <div class="chat-tabs">
            <div class="chat-tab active" onclick="switchChatTab('ai')">AI Tutor</div>
            <div class="chat-tab" onclick="switchChatTab('private')">Private</div>
            <div class="chat-tab" onclick="switchChatTab('group')">Group</div>
        </div>
        <div class="chat-messages" id="chat-messages"></div>
        <div class="chat-input-area">
            <input type="text" id="chat-input" placeholder="Type a message...">
            <button onclick="sendChatMessage()"><i class="fas fa-paper-plane"></i></button>
        </div>
    `;

    // Parent Popup
    document.getElementById('parent-popup').innerHTML = `
        <div class="popup-header">
            <h3><i class="fas fa-graduation-cap" style="color: #eab308;"></i> Did You Know?</h3>
            <button onclick="closeParentPopup()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
        </div>
        <div id="popup-content">
            <p id="education-tip">Regular communication with teachers improves student performance by 40%.</p>
        </div>
        <div class="toggle-switch">
            <span>Show these tips</span>
            <label class="switch">
                <input type="checkbox" id="popup-toggle" checked onchange="toggleParentPopup()">
                <span class="slider"></span>
            </label>
        </div>
        <button class="btn-primary" onclick="nextTip()" style="margin-top: 1rem;">Next Tip</button>
    `;
}

// Load modals (original, unchanged)
function loadModals() {
    // Admin Profile Modal
    document.getElementById('admin-profile-modal').innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Admin Profile</h3>
                <button class="modal-close" onclick="closeModal('admin-profile-modal')">&times;</button>
            </div>
            <div class="modal-body">
                <div style="text-align: center; margin-bottom: 1.5rem;">
                    <img src="https://ui-avatars.com/api/?name=Admin&size=80&background=ef4444&color=fff" style="border-radius: 50%;">
                    <h4 id="modal-admin-name">Admin</h4>
                    <p>Administrator · Greenwood High</p>
                </div>
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" id="admin-profile-name" value="Admin">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" value="admin@greenwood.edu">
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" value="+254 700 123456">
                </div>
                <button class="btn-primary" onclick="updateAdminProfile()">Update Profile</button>
            </div>
        </div>
    `;

}
