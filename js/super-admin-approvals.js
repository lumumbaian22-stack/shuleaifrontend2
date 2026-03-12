// Super Admin Approval Functions

// Load pending schools
async function loadPendingSchools() {
    try {
        const response = await api.superAdmin.getPendingSchools();
        return response.data;
    } catch (error) {
        console.error('Failed to load pending schools:', error);
        showToast('Failed to load pending schools', 'error');
        return [];
    }
}

// Approve school
async function approveSchool(schoolId) {
    if (!confirm('Approve this school? The admin will be able to log in.')) {
        return;
    }
    
    showLoading();
    try {
        const response = await api.superAdmin.approveSchool(schoolId);
        showToast('✅ School approved successfully', 'success');
        
        // Refresh the pending schools list
        await refreshPendingSchools();
        
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to approve school', 'error');
    } finally {
        hideLoading();
    }
}

// Reject school
async function rejectSchool(schoolId) {
    const reason = prompt('Please enter rejection reason:');
    if (reason === null) return;
    
    showLoading();
    try {
        const response = await api.superAdmin.rejectSchool(schoolId, reason);
        showToast('School rejected', 'info');
        
        // Refresh the pending schools list
        await refreshPendingSchools();
        
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to reject school', 'error');
    } finally {
        hideLoading();
    }
}

// Load all schools
async function loadAllSchools() {
    try {
        const response = await api.superAdmin.getSchools();
        return response.data;
    } catch (error) {
        console.error('Failed to load schools:', error);
        showToast('Failed to load schools', 'error');
        return [];
    }
}

// Create new school
async function createSchool(schoolData) {
    showLoading();
    try {
        const response = await api.superAdmin.createSchool(schoolData);
        showToast('✅ School created successfully', 'success');
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to create school', 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

// Update school
async function updateSchool(schoolId, schoolData) {
    showLoading();
    try {
        const response = await api.superAdmin.updateSchool(schoolId, schoolData);
        showToast('✅ School updated successfully', 'success');
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to update school', 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

// Delete school
async function deleteSchool(schoolId) {
    if (!confirm('Are you sure? This will delete all data for this school!')) {
        return;
    }
    
    showLoading();
    try {
        const response = await api.superAdmin.deleteSchool(schoolId);
        showToast('School deleted', 'info');
        
        // Refresh schools list
        await refreshSchoolsList();
        
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to delete school', 'error');
    } finally {
        hideLoading();
    }
}

// Load name change requests
async function loadNameChangeRequests() {
    try {
        const response = await api.superAdmin.getPendingRequests();
        return response.data;
    } catch (error) {
        console.error('Failed to load name change requests:', error);
        return [];
    }
}

// Approve name change
async function approveNameChange(requestId) {
    showLoading();
    try {
        const response = await api.superAdmin.approveRequest(requestId);
        showToast('✅ Name change approved', 'success');
        
        // Refresh requests
        await refreshNameChangeRequests();
        
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to approve name change', 'error');
    } finally {
        hideLoading();
    }
}

// Reject name change
async function rejectNameChange(requestId) {
    const reason = prompt('Please enter rejection reason:');
    if (reason === null) return;
    
    showLoading();
    try {
        const response = await api.superAdmin.rejectRequest(requestId, reason);
        showToast('Name change rejected', 'info');
        
        // Refresh requests
        await refreshNameChangeRequests();
        
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to reject name change', 'error');
    } finally {
        hideLoading();
    }
}

// Update bank details
async function updateBankDetails(schoolId, bankData) {
    showLoading();
    try {
        const response = await api.superAdmin.updateBankDetails(schoolId, bankData);
        showToast('✅ Bank details updated', 'success');
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to update bank details', 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

// Render pending schools table
function renderPendingSchoolsTable(schools) {
    if (!schools || schools.length === 0) {
        return '<div class="text-center py-8 text-muted-foreground">No pending schools</div>';
    }
    
    return `
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-muted/50">
                    <tr>
                        <th class="px-4 py-3 text-left font-medium">School</th>
                        <th class="px-4 py-3 text-left font-medium">Admin</th>
                        <th class="px-4 py-3 text-left font-medium">Short Code</th>
                        <th class="px-4 py-3 text-left font-medium">Level</th>
                        <th class="px-4 py-3 text-left font-medium">Curriculum</th>
                        <th class="px-4 py-3 text-left font-medium">Applied</th>
                        <th class="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    ${schools.map(school => `
                        <tr class="hover:bg-accent/50 transition-colors">
                            <td class="px-4 py-3 font-medium">${school.name}</td>
                            <td class="px-4 py-3">${school.admin?.email || 'N/A'}</td>
                            <td class="px-4 py-3">
                                <span class="font-mono text-xs bg-muted px-2 py-1 rounded">${school.shortCode}</span>
                            </td>
                            <td class="px-4 py-3">${school.settings?.schoolLevel || 'N/A'}</td>
                            <td class="px-4 py-3">${school.system}</td>
                            <td class="px-4 py-3">${timeAgo(school.createdAt)}</td>
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
    `;
}

// Render schools management table
function renderSchoolsTable(schools) {
    if (!schools || schools.length === 0) {
        return '<div class="text-center py-8 text-muted-foreground">No schools found</div>';
    }
    
    return `
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-muted/50">
                    <tr>
                        <th class="px-4 py-3 text-left font-medium">School</th>
                        <th class="px-4 py-3 text-left font-medium">Short Code</th>
                        <th class="px-4 py-3 text-left font-medium">Status</th>
                        <th class="px-4 py-3 text-left font-medium">Teachers</th>
                        <th class="px-4 py-3 text-left font-medium">Students</th>
                        <th class="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    ${schools.map(school => `
                        <tr class="hover:bg-accent/50 transition-colors">
                            <td class="px-4 py-3 font-medium">${school.name}</td>
                            <td class="px-4 py-3">
                                <span class="font-mono text-xs bg-muted px-2 py-1 rounded">${school.shortCode}</span>
                            </td>
                            <td class="px-4 py-3">
                                <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium 
                                    ${school.status === 'active' ? 'bg-green-100 text-green-700' : 
                                      school.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                                      'bg-red-100 text-red-700'}">
                                    ${school.status}
                                </span>
                            </td>
                            <td class="px-4 py-3">${school.stats?.teachers || 0}</td>
                            <td class="px-4 py-3">${school.stats?.students || 0}</td>
                            <td class="px-4 py-3 text-right">
                                <button onclick="viewSchoolDetails('${school.id}')" class="p-2 hover:bg-accent rounded-lg">
                                    <i data-lucide="eye" class="h-4 w-4"></i>
                                </button>
                                <button onclick="editSchool('${school.id}')" class="p-2 hover:bg-accent rounded-lg">
                                    <i data-lucide="edit" class="h-4 w-4"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Refresh functions
async function refreshPendingSchools() {
    const container = document.getElementById('pending-schools-container');
    if (!container) return;
    
    const schools = await loadPendingSchools();
    container.innerHTML = renderPendingSchoolsTable(schools);
    lucide.createIcons();
}

async function refreshSchoolsList() {
    const container = document.getElementById('schools-table-container');
    if (!container) return;
    
    const schools = await loadAllSchools();
    container.innerHTML = renderSchoolsTable(schools);
    lucide.createIcons();
}

// Export functions
window.loadPendingSchools = loadPendingSchools;
window.approveSchool = approveSchool;
window.rejectSchool = rejectSchool;
window.loadAllSchools = loadAllSchools;
window.createSchool = createSchool;
window.updateSchool = updateSchool;
window.deleteSchool = deleteSchool;
window.loadNameChangeRequests = loadNameChangeRequests;
window.approveNameChange = approveNameChange;
window.rejectNameChange = rejectNameChange;
window.updateBankDetails = updateBankDetails;
window.renderPendingSchoolsTable = renderPendingSchoolsTable;
window.renderSchoolsTable = renderSchoolsTable;