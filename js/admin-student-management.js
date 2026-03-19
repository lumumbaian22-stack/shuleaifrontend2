// In admin-student-management.js, find this function:

async function refreshAdminStudentList() {
    // CHANGE THIS LINE:
    // const container = document.getElementById('admin-students-table-body');
    
    // TO THIS:
    const container = document.querySelector('#admin-dashboard-content table tbody');
    
    if (!container) {
        console.warn('⚠️ Admin student table container not found - using fallback');
        // Try fallback IDs
        const fallback = document.getElementById('my-students-table') || 
                        document.querySelector('table tbody');
        if (fallback) {
            await refreshWithFallback(fallback);
        }
        return;
    }
    
    // Rest of the function remains the same...
    try {
        container.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center">Loading...</td></tr>';
        
        const students = await loadAllStudents();
        
        if (!students || students.length === 0) {
            container.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-muted-foreground">No students found</td></tr>';
            return;
        }
        
        let html = '';
        students.forEach(student => {
            const user = student.User || {};
            const name = user.name || 'Unknown';
            const elimuid = student.elimuid || 'N/A';
            const grade = student.grade || 'N/A';
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
                    <td class="px-4 py-3">
                        <span class="font-mono text-xs bg-muted px-2 py-1 rounded">${elimuid}</span>
                    </td>
                    <td class="px-4 py-3">${grade}</td>
                    <td class="px-4 py-3">
                        <span class="px-2 py-1 ${statusClass} text-xs rounded-full">${status}</span>
                    </td>
                    <td class="px-4 py-3">${student.parents?.length || 0} parent(s)</td>
                    <td class="px-4 py-3 text-right">
                        <button onclick="viewAdminStudent('${student.id}')" class="p-2 hover:bg-accent rounded-lg">
                            <i data-lucide="eye" class="h-4 w-4"></i>
                        </button>
                        <button onclick="editAdminStudent('${student.id}')" class="p-2 hover:bg-accent rounded-lg">
                            <i data-lucide="edit" class="h-4 w-4"></i>
                        </button>
                        <button onclick="copyElimuid('${elimuid}')" class="p-2 hover:bg-accent rounded-lg">
                            <i data-lucide="copy" class="h-4 w-4"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        container.innerHTML = html;
        
        // Update total count
        const totalEl = document.getElementById('total-students');
        if (totalEl) totalEl.textContent = students.length;
        
        if (window.lucide) lucide.createIcons();
        
    } catch (error) {
        console.error('Error refreshing admin student list:', error);
        container.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-red-500">Error loading students</td></tr>';
    }
}
