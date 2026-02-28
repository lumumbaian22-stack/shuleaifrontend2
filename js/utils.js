// ==================== UTILITY FUNCTIONS ====================

// Toast notification system
window.showToast = function(msg, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};

// Hide all major containers
window.hideAll = function() {
    const elements = [
        'landing-page', 'admin-login', 'teacher-login', 'parent-login', 
        'student-login', 'super-login', 'admin-dashboard', 'teacher-dashboard',
        'parent-dashboard', 'student-dashboard', 'super-dashboard'
    ];
    
    elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
};

// Modal management
window.closeAllModals = function() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
};

window.openModal = function(id) {
    closeAllModals();
    document.getElementById(id).style.display = 'flex';
};

window.closeModal = function(id) {
    document.getElementById(id).style.display = 'none';
};

// Sidebar toggle for mobile
window.toggleSidebar = function(id) {
    document.getElementById(id).classList.toggle('active');
};

// Grade calculation engine
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

// Chart management
window.activeCharts = [];

window.destroyCharts = function() {
    activeCharts.forEach(chart => chart.destroy());
    activeCharts = [];
};