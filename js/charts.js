// Chart initialization and management
let charts = {};

function initSuperAdminCharts(data) {
    const ctx1 = document.getElementById('superadmin-enrollmentChart');
    const ctx2 = document.getElementById('superadmin-gradeChart');
    
    if (ctx1) {
        if (charts.superEnrollment) charts.superEnrollment.destroy();
        charts.superEnrollment = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: data?.growthLabels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'New Schools',
                    data: data?.growthData || [2, 3, 4, 3, 5, 7],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
    
    if (ctx2) {
        if (charts.superGrade) charts.superGrade.destroy();
        charts.superGrade = new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: data?.distributionLabels || ['Primary', 'Secondary', 'Mixed'],
                datasets: [{
                    data: data?.distributionData || [12, 18, 4],
                    backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { usePointStyle: true, padding: 20 }
                    }
                },
                cutout: '70%'
            }
        });
    }
}

function initAdminCharts(data) {
    const ctx1 = document.getElementById('admin-enrollmentChart');
    const ctx2 = document.getElementById('admin-gradeChart');
    
    if (ctx1) {
        if (charts.adminEnrollment) charts.adminEnrollment.destroy();
        charts.adminEnrollment = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: data?.enrollmentLabels || ['Term 1', 'Term 2', 'Term 3'],
                datasets: [{
                    label: 'Enrollment',
                    data: data?.enrollmentData || [520, 535, 543],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
    
    if (ctx2) {
        if (charts.adminGrade) charts.adminGrade.destroy();
        charts.adminGrade = new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: data?.gradeLabels || ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
                datasets: [{
                    data: data?.gradeData || [142, 138, 135, 128],
                    backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { usePointStyle: true, padding: 20 }
                    }
                },
                cutout: '70%'
            }
        });
    }
}

function initTeacherCharts(data) {
    const ctx1 = document.getElementById('teacher-performanceChart');
    const ctx2 = document.getElementById('teacher-gradeChart');
    
    if (ctx1) {
        if (charts.teacherPerf) charts.teacherPerf.destroy();
        charts.teacherPerf = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: data?.performanceLabels || ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Class Average',
                    data: data?.performanceData || [74, 78, 76, 82],
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
    
    if (ctx2) {
        if (charts.teacherGrade) charts.teacherGrade.destroy();
        charts.teacherGrade = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: data?.gradeLabels || ['A', 'B', 'C', 'D', 'E'],
                datasets: [{
                    label: 'Students',
                    data: data?.gradeData || [12, 18, 8, 4, 2],
                    backgroundColor: '#3b82f6',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0,0,0,0.05)' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    }
}

function initParentCharts(data) {
    const ctx = document.getElementById('parent-gradeChart');
    
    if (ctx) {
        if (charts.parentGrade) charts.parentGrade.destroy();
        charts.parentGrade = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data?.labels || ['Test 1', 'Test 2', 'Test 3', 'Exam'],
                datasets: [{
                    label: 'Child\'s Performance',
                    data: data?.performanceData || [72, 78, 75, 85],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
}

function initStudentCharts(data) {
    // Student charts if needed
}

function initRoleCharts(role, data) {
    const chartFunctions = {
        superadmin: initSuperAdminCharts,
        admin: initAdminCharts,
        teacher: initTeacherCharts,
        parent: initParentCharts,
        student: initStudentCharts
    };
    
    if (chartFunctions[role]) {
        chartFunctions[role](data);
    }
}

function updateChartTheme() {
    // Update all charts with new theme colors
    Object.values(charts).forEach(chart => {
        if (chart && chart.options) {
            const isDark = document.documentElement.classList.contains('dark');
            const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
            const textColor = isDark ? '#94a3b8' : '#64748b';
            
            if (chart.options.scales) {
                if (chart.options.scales.y) {
                    if (chart.options.scales.y.grid) chart.options.scales.y.grid.color = gridColor;
                    if (chart.options.scales.y.ticks) chart.options.scales.y.ticks.color = textColor;
                }
                if (chart.options.scales.x) {
                    if (chart.options.scales.x.ticks) chart.options.scales.x.ticks.color = textColor;
                }
            }
            
            if (chart.options.plugins?.legend?.labels) {
                chart.options.plugins.legend.labels.color = textColor;
            }
            
            chart.update();
        }
    });
}

// Export functions
window.initRoleCharts = initRoleCharts;
window.updateChartTheme = updateChartTheme;
window.charts = charts;