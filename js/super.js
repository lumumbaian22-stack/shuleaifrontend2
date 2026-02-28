// ==================== SUPER ADMIN FUNCTIONS ====================

window.loadSuperDashboard = function() {
    document.getElementById('super-content').innerHTML = `
        <div class="stats-grid">
            <div class="stat-card"><div class="stat-icon" style="background:#8b5cf6;"><i class="fas fa-school"></i></div><div class="stat-info"><h3>${schools.length}</h3><p>Schools</p></div></div>
            <div class="stat-card"><div class="stat-icon" style="background:#a78bfa;"><i class="fas fa-users"></i></div><div class="stat-info"><h3>${users.students.length}</h3><p>Students</p></div></div>
            <div class="stat-card"><div class="stat-icon" style="background:#c4b5fd;"><i class="fas fa-chalkboard-teacher"></i></div><div class="stat-info"><h3>${users.teachers.length}</h3><p>Teachers</p></div></div>
        </div>
        <div class="card"><h4>Demo Data Control</h4><p>Current: <strong>${demoMode ? 'Demo Active' : 'Demo Off'}</strong></p><button class="btn-primary" onclick="toggleDemoData()">${demoMode ? 'Remove Demo Data' : 'Restore Demo Data'}</button></div>
    `;
};

window.switchSuperTab = function(tab) {
    loadSuperDashboard();
    updateActiveMenu('super-sidebar', tab);
};

window.toggleDemoData = function() {
    demoMode = !demoMode;
    showToast(`Demo data ${demoMode ? 'restored' : 'removed'}`);
    loadSuperDashboard();
};