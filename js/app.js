document.addEventListener('DOMContentLoaded', function() {
    loadLandingPage();
    loadLoginPages();
    loadSignupPages();
    loadDashboards();
    loadModals();
    
    const restored = window.pageState.restore();
    if (!restored) {
        showLanding();
    }
    
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
});

function loadLandingPage() {
    const landing = document.getElementById('landing-page');
    if (!landing) return;
    
    landing.innerHTML = `
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
                <p class="hero-description">An integrated platform where administrators supervise, teachers teach effectively, parents stay informed, and students learn with AI-powered assistance.</p>
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

function loadLoginPages() {
    const adminLogin = document.getElementById('admin-login');
    if (adminLogin) {
        adminLogin.innerHTML = `
            <div class="login-container">
                <div class="login-header">
                    <i class="fas fa-user-shield" style="color: #ef4444;"></i>
                    <h1>Administrator Portal</h1>
                </div>
                <div class="login-box">
                    <div class="login-card">
                        <h2><i class="fas fa-lock" style="color: #ef4444;"></i> Admin Login</h2>
                        <form onsubmit="handleLogin(event, 'admin')">
                            <div class="form-group">
                                <label><i class="fas fa-envelope"></i> Email</label>
                                <input type="email" id="admin-id" placeholder="Enter your email">
                            </div>
                            <div class="form-group">
                                <label><i class="fas fa-key"></i> Password</label>
                                <input type="password" id="admin-pass" placeholder="Enter password">
                            </div>
                            <button type="submit" class="btn-login">
                                <i class="fas fa-sign-in-alt"></i> Login
                            </button>
                        </form>
                        <div style="margin-top: 1rem; text-align: center;">
                            Don't have a school? <a href="#" onclick="showSignup('admin')">Create School</a>
                        </div>
                        <a class="back-link" onclick="showLanding()">
                            <i class="fas fa-arrow-left"></i> Back to Home
                        </a>
                    </div>
                    <div class="login-info">
                        <h3>Admin Capabilities</h3>
                        <p>Monitor all students & teachers</p>
                        <p>View comprehensive analytics</p>
                        <p>Track fee collection</p>
                        <p>Manage teacher approvals</p>
                        <p style="color: #ef4444; margin-top: 1rem;"><i class="fas fa-info-circle"></i> New? Click "Create School"</p>
                    </div>
                </div>
            </div>
        `;
    }

    const teacherLogin = document.getElementById('teacher-login');
    if (teacherLogin) {
        teacherLogin.innerHTML = `
            <div class="login-container">
                <div class="login-header">
                    <i class="fas fa-chalkboard-teacher" style="color: #3b82f6;"></i>
                    <h1>Teacher Portal</h1>
                </div>
                <div class="login-box">
                    <div class="login-card">
                        <h2><i class="fas fa-lock" style="color: #3b82f6;"></i> Teacher Login</h2>
                        <form onsubmit="handleLogin(event, 'teacher')">
                            <div class="form-group">
                                <label><i class="fas fa-envelope"></i> Email</label>
                                <input type="email" id="teacher-id" placeholder="Enter your email">
                            </div>
                            <div class="form-group">
                                <label><i class="fas fa-key"></i> Password</label>
                                <input type="password" id="teacher-pass" placeholder="Enter password">
                            </div>
                            <button type="submit" class="btn-login">
                                <i class="fas fa-sign-in-alt"></i> Login
                            </button>
                        </form>
                        <div style="margin-top: 1rem; text-align: center;">
                            Don't have an account? <a href="#" onclick="showSignup('teacher')">Request Access</a>
                        </div>
                        <a class="back-link" onclick="showLanding()">
                            <i class="fas fa-arrow-left"></i> Back to Home
                        </a>
                    </div>
                    <div class="login-info">
                        <h3>Teacher Capabilities</h3>
                        <p>Enter marks with auto-grade calculation</p>
                        <p>Take attendance with alerts</p>
                        <p>Add comments & feedback</p>
                        <p>View class analytics</p>
                    </div>
                </div>
            </div>
        `;
    }

    const superLogin = document.getElementById('super-login');
    if (superLogin) {
        superLogin.innerHTML = `
            <div class="login-container">
                <div class="login-header">
                    <i class="fas fa-crown" style="color: #8b5cf6;"></i>
                    <h1>Super Admin</h1>
                </div>
                <div class="login-box">
                    <div class="login-card">
                        <h2><i class="fas fa-lock" style="color: #8b5cf6;"></i> Platform Access</h2>
                        <form onsubmit="handleLogin(event, 'super')">
                            <div class="form-group">
                                <label><i class="fas fa-key"></i> Secret Key</label>
                                <input type="password" id="super-key" placeholder="Enter secret key">
                            </div>
                            <button type="submit" class="btn-login">
                                <i class="fas fa-sign-in-alt"></i> Access Platform
                            </button>
                        </form>
                        <a class="back-link" onclick="showLanding()">
                            <i class="fas fa-arrow-left"></i> Back to Home
                        </a>
                    </div>
                    <div class="login-info">
                        <h3>Super Admin</h3>
                        <p>Manage multiple schools</p>
                        <p>Approve name changes</p>
                        <p>Toggle custom names</p>
                        <p>Suspend/activate schools</p>
                    </div>
                </div>
            </div>
        `;
    }
}

function loadSignupPages() {
    const adminSignup = document.getElementById('admin-signup');
    if (adminSignup) {
        adminSignup.innerHTML = `
            <div class="login-container">
                <div class="login-header">
                    <i class="fas fa-user-shield" style="color: #ef4444;"></i>
                    <h1>Create Your School</h1>
                </div>
                <div class="login-box" style="grid-template-columns: 1fr;">
                    <div class="login-card">
                        <h2><i class="fas fa-plus-circle" style="color: #ef4444;"></i> School Registration</h2>
                        <form onsubmit="handleSignup(event, 'admin')">
                            <h3>Your Information</h3>
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
                                <label><i class="fas fa-book"></i> Curriculum System</label>
                                <select id="school-system" required>
                                    <option value="844">8-4-4</option>
                                    <option value="cbc">CBC</option>
                                    <option value="british">British</option>
                                    <option value="american">American</option>
                                </select>
                            </div>
                            
                            <p class="info-text">
                                <i class="fas fa-info-circle"></i> Your school ID will be generated automatically after registration.
                            </p>
                            
                            <button type="submit" class="btn-login">
                                <i class="fas fa-check-circle"></i> Create School
                            </button>
                        </form>
                        <div style="margin-top: 1.5rem; text-align: center;">
                            Already have a school? <a href="#" onclick="showLogin('admin')">Login</a>
                        </div>
                        <a class="back-link" onclick="showLanding()">
                            <i class="fas fa-arrow-left"></i> Back to Home
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    const teacherSignup = document.getElementById('teacher-signup');
    if (teacherSignup) {
        teacherSignup.innerHTML = `
            <div class="login-container">
                <div class="login-header">
                    <i class="fas fa-chalkboard-teacher" style="color: #3b82f6;"></i>
                    <h1>Request Teacher Access</h1>
                    <p style="color: white;">(Pending admin approval)</p>
                </div>
                <div class="login-box" style="grid-template-columns: 1fr;">
                    <div class="login-card">
                        <h2><i class="fas fa-user-plus" style="color: #3b82f6;"></i> Teacher Registration</h2>
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
                                <label><i class="fas fa-school"></i> School ID</label>
                                <input type="text" id="teacher-school-code" placeholder="e.g., SCH-2024-00001" required>
                                <small>Ask your school admin for this code</small>
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
    }
}

function loadDashboards() {
    const adminDash = document.getElementById('admin-dashboard');
    if (adminDash) {
        adminDash.innerHTML = `
            <nav class="dashboard-nav">
                <div class="nav-left">
                    <div class="logo">
                        <i class="fas fa-user-shield" style="color: #ef4444;"></i>
                        <div>
                            <h2 id="admin-school-name">School Name</h2>
                            <p class="role-tag" id="admin-system-info">System</p>
                        </div>
                    </div>
                </div>
                <div class="nav-center">
                    <div class="info">
                        <i class="fas fa-calendar-alt"></i>
                        <span id="current-date"></span>
                    </div>
                </div>
                <div class="nav-right">
                    <button class="theme-toggle" title="Toggle theme">
                        <i class="fas fa-moon"></i>
                    </button>
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
    }

    const teacherDash = document.getElementById('teacher-dashboard');
    if (teacherDash) {
        teacherDash.innerHTML = `
            <nav class="dashboard-nav">
                <div class="nav-left">
                    <div class="logo">
                        <i class="fas fa-chalkboard-teacher" style="color: #3b82f6;"></i>
                        <div>
                            <h2 id="teacher-school-name">School Name</h2>
                            <p class="role-tag" id="teacher-info">Teacher</p>
                        </div>
                    </div>
                </div>
                <div class="nav-center">
                    <div class="info" id="teacher-class-info">
                        <i class="fas fa-users"></i>
                        <span>Loading...</span>
                    </div>
                </div>
                <div class="nav-right">
                    <button class="theme-toggle" title="Toggle theme">
                        <i class="fas fa-moon"></i>
                    </button>
                    <div class="profile" onclick="showTeacherProfile()">
                        <img src="https://ui-avatars.com/api/?name=Teacher&background=3b82f6&color=fff&size=40" alt="Teacher">
                        <div class="profile-info">
                            <span class="profile-name" id="teacher-name">Teacher</span>
                            <span class="profile-detail">Subject</span>
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
    }

    const superDash = document.getElementById('super-dashboard');
    if (superDash) {
        superDash.innerHTML = `
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
                    <button class="theme-toggle" title="Toggle theme">
                        <i class="fas fa-moon"></i>
                    </button>
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
    }
}

function loadModals() {
    const adminModal = document.getElementById('admin-profile-modal');
    if (adminModal) {
        adminModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Admin Profile</h3>
                    <button class="modal-close" onclick="closeModal('admin-profile-modal')">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="text-align: center; margin-bottom: 1.5rem;">
                        <img src="https://ui-avatars.com/api/?name=Admin&size=80&background=ef4444&color=fff" style="border-radius: 50%;">
                        <h4 id="modal-admin-name">Admin</h4>
                        <p>Administrator</p>
                    </div>
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" id="admin-profile-name" value="Admin">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" value="admin@school.edu">
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
}
