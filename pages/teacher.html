<div class="space-y-6 animate-fade-in" id="teacher-dashboard-content">
    <!-- Stats Grid -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border bg-card p-6 card-hover">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-muted-foreground">My Students</p>
                    <h3 class="text-2xl font-bold mt-1" id="my-students-count">0</h3>
                    <p class="text-xs text-muted-foreground mt-1">Across <span id="my-classes-count">0</span> classes</p>
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
                    <h3 class="text-2xl font-bold mt-1" id="class-average">0%</h3>
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
                    <h3 class="text-2xl font-bold mt-1" id="attendance-today">0/0</h3>
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
                    <h3 class="text-2xl font-bold mt-1" id="pending-tasks">0</h3>
                </div>
                <div class="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                    <i data-lucide="check-square" class="h-6 w-6 text-red-600"></i>
                </div>
            </div>
        </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid gap-4 md:grid-cols-4">
        <button onclick="showDashboardSection('students')" class="p-4 border rounded-lg hover:bg-accent transition-colors text-left">
            <i data-lucide="users" class="h-6 w-6 text-blue-600 mb-2"></i>
            <p class="font-medium">My Students</p>
        </button>
        <button onclick="showDashboardSection('attendance')" class="p-4 border rounded-lg hover:bg-accent transition-colors text-left">
            <i data-lucide="calendar-check" class="h-6 w-6 text-green-600 mb-2"></i>
            <p class="font-medium">Attendance</p>
        </button>
        <button onclick="showDashboardSection('grades')" class="p-4 border rounded-lg hover:bg-accent transition-colors text-left">
            <i data-lucide="trending-up" class="h-6 w-6 text-purple-600 mb-2"></i>
            <p class="font-medium">Grades</p>
        </button>
        <button onclick="showDashboardSection('tasks')" class="p-4 border rounded-lg hover:bg-accent transition-colors text-left">
            <i data-lucide="check-square" class="h-6 w-6 text-amber-600 mb-2"></i>
            <p class="font-medium">Tasks</p>
        </button>
    </div>

    <!-- Students Table -->
    <div class="rounded-xl border bg-card overflow-hidden">
        <div class="p-4 border-b flex justify-between items-center">
            <h3 class="font-semibold">My Students</h3>
            <button onclick="showAddStudentModal()" class="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-lg">+ Add Student</button>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-muted/50">
                    <tr>
                        <th class="px-4 py-3 text-left">Student</th>
                        <th class="px-4 py-3 text-left">Class</th>
                        <th class="px-4 py-3 text-left">ELIMUID</th>
                        <th class="px-4 py-3 text-left">Attendance</th>
                        <th class="px-4 py-3 text-left">Average</th>
                        <th class="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y" id="my-students-table">
                    <tr><td colspan="6" class="px-4 py-8 text-center text-muted-foreground">Click refresh to load students</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- CSV Bulk Upload Section - WITH FIXED PROGRESS BAR -->
    <div class="rounded-xl border bg-card p-6">
        <h3 class="font-semibold mb-4">CSV Bulk Upload</h3>
        
        <!-- Drop Zone -->
        <div id="csv-drop-zone" class="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <i data-lucide="upload" class="h-10 w-10 mx-auto text-muted-foreground"></i>
            <p class="text-sm mt-2">Drag & drop CSV file or click to browse</p>
            <p class="text-xs text-muted-foreground mt-1">Analytics engine will process automatically</p>
            <input type="file" id="csv-file-input" accept=".csv" class="hidden">
        </div>
        
        <!-- PROGRESS BAR - THIS WAS MISSING AND NOW IT'S FIXED -->
        <div id="upload-progress-container" class="mt-3 hidden">
            <div class="w-full bg-muted rounded-full h-2">
                <div id="upload-progress" class="bg-primary h-2 rounded-full" style="width: 0%"></div>
            </div>
            <p id="upload-progress-text" class="text-xs text-center mt-1">0%</p>
        </div>
        
        <!-- Template Download Buttons -->
        <div class="flex gap-2 mt-4">
            <button onclick="downloadTemplate('students')" class="flex-1 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20">
                <i data-lucide="download" class="h-4 w-4 inline mr-1"></i> Students
            </button>
            <button onclick="downloadTemplate('marks')" class="flex-1 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20">
                <i data-lucide="download" class="h-4 w-4 inline mr-1"></i> Marks
            </button>
            <button onclick="downloadTemplate('attendance')" class="flex-1 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20">
                <i data-lucide="download" class="h-4 w-4 inline mr-1"></i> Attendance
            </button>
        </div>
    </div>

    <!-- Duty Card -->
    <div class="rounded-xl border bg-card p-6" id="duty-card">
        <div class="flex justify-between items-start">
            <div>
                <h3 class="font-semibold">Today's Duty</h3>
                <p class="text-sm text-muted-foreground" id="duty-location">Loading...</p>
            </div>
            <span class="duty-status px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full" id="duty-status">Not Checked In</span>
        </div>
        <div class="mt-4 flex gap-3">
            <button onclick="checkInDuty()" class="flex-1 bg-primary text-primary-foreground py-2 rounded-lg" id="check-in-btn">Check In</button>
            <button onclick="checkOutDuty()" class="flex-1 border border-input bg-background py-2 rounded-lg" id="check-out-btn" disabled>Check Out</button>
        </div>
        <div class="mt-3 flex justify-between">
            <span class="text-xs text-muted-foreground" id="duty-rating">Last rating: <span id="last-rating">4.5</span>/5</span>
            <button onclick="showDutySwapModal()" class="text-xs text-primary hover:underline">Request Swap</button>
        </div>
    </div>
</div>

<!-- Modals -->
<div id="add-student-modal" class="fixed inset-0 z-50 hidden"></div>
<div id="student-details-modal" class="fixed inset-0 z-50 hidden"></div>
<div id="add-task-modal" class="fixed inset-0 z-50 hidden"></div>
<div id="duty-swap-modal" class="fixed inset-0 z-50 hidden"></div>

<script>
// Auto-refresh on load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (typeof refreshMyStudents === 'function') refreshMyStudents();
        if (typeof loadTodayDuty === 'function') loadTodayDuty().then(d => {
            if (d?.duties?.length) {
                document.getElementById('duty-location').textContent = d.duties[0].area || 'No duty';
            }
        });
        // Initialize file upload
        if (typeof setupFileUpload === 'function') {
            setupFileUpload('csv-drop-zone', 'csv-file-input', 'students');
        }
    }, 500);
});
</script>
