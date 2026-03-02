window.theme = (function() {
    const STORAGE_KEY = 'shuleai_theme';
    
    function getTheme() {
        return localStorage.getItem(STORAGE_KEY) || 'light';
    }
    
    function setTheme(theme) {
        localStorage.setItem(STORAGE_KEY, theme);
        applyTheme(theme);
    }
    
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.querySelectorAll('.theme-toggle i').forEach(el => {
                el.className = 'fas fa-sun';
            });
        } else {
            document.documentElement.classList.remove('dark');
            document.querySelectorAll('.theme-toggle i').forEach(el => {
                el.className = 'fas fa-moon';
            });
        }
    }
    
    function toggleTheme() {
        const current = getTheme();
        const newTheme = current === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        return newTheme;
    }
    
    function init() {
        const savedTheme = getTheme();
        applyTheme(savedTheme);
        
        document.addEventListener('click', (e) => {
            if (e.target.closest('.theme-toggle')) {
                toggleTheme();
                window.showToast(`Switched to ${getTheme()} mode`, 'info');
            }
        });
    }
    
    return { get: getTheme, set: setTheme, toggle: toggleTheme, init: init };
})();

window.pageState = (function() {
    const STORAGE_KEY = 'shuleai_page_state';
    
    function saveState() {
        const state = {
            currentPage: document.querySelector('.dashboard.active')?.id || document.querySelector('[style*="display: block"]')?.id || 'landing-page',
            currentUser: window.currentUser,
            currentSchool: window.currentSchool,
            scrollPosition: window.scrollY,
            timestamp: Date.now()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
    
    function loadState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (!saved) return null;
            const state = JSON.parse(saved);
            if (Date.now() - state.timestamp > 24 * 60 * 60 * 1000) {
                localStorage.removeItem(STORAGE_KEY);
                return null;
            }
            return state;
        } catch (e) {
            return null;
        }
    }
    
    function restoreState() {
        const state = loadState();
        if (!state) return false;
        
        window.currentUser = state.currentUser;
        window.currentSchool = state.currentSchool;
        
        if (state.currentPage && state.currentPage !== 'landing-page') {
            const targetPage = document.getElementById(state.currentPage);
            if (targetPage) {
                hideAll();
                targetPage.style.display = 'block';
                setTimeout(() => window.scrollTo(0, state.scrollPosition || 0), 100);
                return true;
            }
        }
        return false;
    }
    
    return { save: saveState, restore: restoreState };
})();

window.showToast = function(msg, type = 'info') {
    document.querySelectorAll('.toast').forEach(t => t.remove());
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};

window.hideAll = function() {
    const elements = [
        'landing-page', 'admin-login', 'teacher-login', 'parent-login', 
        'student-login', 'super-login', 'admin-dashboard', 'teacher-dashboard',
        'parent-dashboard', 'student-dashboard', 'super-dashboard',
        'admin-signup', 'teacher-signup', 'parent-signup'
    ];
    elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
};

window.closeAllModals = function() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.remove());
};

window.closeModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) modal.remove();
};

window.toggleSidebar = function(id) {
    document.getElementById(id).classList.toggle('active');
};

window.calculateGrade = function(score, system = '844') {
    if (system === '844') {
        if (score >= 80) return { grade: 'A', points: 12, remark: 'Excellent' };
        if (score >= 75) return { grade: 'A-', points: 11, remark: 'Very Good' };
        if (score >= 70) return { grade: 'B+', points: 10, remark: 'Good' };
        if (score >= 65) return { grade: 'B', points: 9, remark: 'Above Average' };
        if (score >= 60) return { grade: 'B-', points: 8, remark: 'Average' };
        if (score >= 55) return { grade: 'C+', points: 7, remark: 'Below Average' };
        if (score >= 50) return { grade: 'C', points: 6, remark: 'Fair' };
        if (score >= 45) return { grade: 'C-', points: 5, remark: 'Poor' };
        if (score >= 40) return { grade: 'D+', points: 4, remark: 'Very Poor' };
        return { grade: 'E', points: 0, remark: 'Fail' };
    } else if (system === 'cbc') {
        if (score >= 80) return { grade: 'Exceeds Expectations', remark: 'Outstanding' };
        if (score >= 60) return { grade: 'Meets Expectations', remark: 'Good' };
        if (score >= 40) return { grade: 'Approaching Expectations', remark: 'Fair' };
        return { grade: 'Below Expectations', remark: 'Needs Improvement' };
    }
    return { grade: score >= 50 ? 'Pass' : 'Fail', remark: '' };
};

window.activeCharts = [];
window.destroyCharts = function() {
    activeCharts.forEach(chart => chart.destroy());
    activeCharts = [];
};

document.addEventListener('DOMContentLoaded', function() {
    window.theme.init();
    window.pageState.restore();
    
    window.addEventListener('beforeunload', function() {
        window.pageState.save();
    });
    
    window.addEventListener('popstate', function() {
        window.pageState.restore();
    });
});
