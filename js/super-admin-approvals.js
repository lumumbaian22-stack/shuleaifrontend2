// super-admin-approvals.js - Complete with suspension functions

// Load pending schools
async function loadPendingSchools() {
    try {
        const response = await api.superAdmin.getPendingSchools();
        return response.data || [];
    } catch (error) {
        console.error('Failed to load pending schools:', error);
        showToast('Failed to load pending schools', 'error');
        return [];
    }
}

// Load all schools
async function loadAllSchools() {
    try {
        const response = await api.superAdmin.getSchools();
        return response.data || [];
    } catch (error) {
        console.error('Failed to load schools:', error);
        showToast('Failed to load schools', 'error');
        return [];
    }
}

// Load suspended schools
async function loadSuspendedSchools() {
    try {
        const response = await api.superAdmin.getSuspendedSchools();
        return response.data || [];
    } catch (error) {
        console.error('Failed to load suspended schools:', error);
        return [];
    }
}

// Load name change requests
async function loadNameChangeRequests() {
    try {
        const response = await api.superAdmin.getPendingRequests();
        return response.data || [];
    } catch (error) {
        console.error('Failed to load name change requests:', error);
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
        await refreshPendingSchools();
        await refreshSchoolsList();
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
        await refreshPendingSchools();
        await refreshSchoolsList();
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to reject school', 'error');
    } finally {
        hideLoading();
    }
}

// Suspend school
async function suspendSchool(schoolId) {
    const reason = prompt('Please enter suspension reason:');
    if (reason === null) return;
    
    if (!confirm('⚠️ Are you sure you want to suspend this school? All users will be locked out.')) {
        return;
    }
    
    showLoading();
    try {
        const response = await api.superAdmin.suspendSchool(schoolId, reason);
        showToast('✅ School suspended successfully', 'success');
        await refreshSchoolsList();
        await refreshSuspendedSchools();
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to suspend school', 'error');
    } finally {
        hideLoading();
    }
}

// Reactivate school
async function reactivateSchool(schoolId) {
    const reason = prompt('Please enter reactivation reason:');
    if (reason === null) return;
    
    showLoading();
    try {
        const response = await api.superAdmin.reactivateSchool(schoolId, reason);
        showToast('✅ School reactivated successfully', 'success');
        await refreshSchoolsList();
        await refreshSuspendedSchools();
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to reactivate school', 'error');
    } finally {
        hideLoading();
    }
}

// Create new school
async function createSchool(schoolData) {
    showLoading();
    try {
        const response = await api.superAdmin.createSchool(schoolData);
        showToast('✅ School created successfully', 'success');
        await refreshSchoolsList();
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
        await refreshSchoolsList();
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
    if (!confirm('⚠️ Are you sure? This will delete ALL data for this school! This action cannot be undone.')) {
        return;
    }
    
    showLoading();
    try {
        const response = await api.superAdmin.deleteSchool(schoolId);
        showToast('School deleted', 'info');
        await refreshSchoolsList();
        await refreshPendingSchools();
        return response;
    } catch (error) {
        showToast(error.message || 'Failed to delete school', 'error');
    } finally {
        hideLoading();
    }
}

// Approve name change
async function approveNameChange(requestId) {
    showLoading();
    try {
        const response = await api.superAdmin.approveRequest(requestId);
        showToast('✅ Name change approved', 'success');
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
                        <th class="px-4 py-3 text-left font-medium">Admin Email</th>
                        <th class="px-4 py-3 text-left font-medium">Short Code</th>
                        <th class="px-4 py-3 text-left font-medium">Level</th>
                        <th class="px-4 py-3 text-left font-medium">Curriculum</th>
                        <th class="px-4 py-3 text-left font-medium">Applied</th>
                        <th class="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    ${schools.map(school => {
                        const admin = school.admins && school.admins.length > 0 ? school.admins[0] : null;
                        return `
                            <tr class="hover:bg-accent/50 transition-colors">
                                <td class="px-4 py-3 font-medium">${school.name}</td>
                                <td class="px-4 py-3">${admin ? admin.email : 'No admin yet'}</td>
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
                        `;
                    }).join('')}
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
                                      school.status === 'suspended' ? 'bg-red-100 text-red-700' : 
                                      'bg-gray-100 text-gray-700'}">
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
                                ${school.status === 'active' ? `
                                    <button onclick="suspendSchool('${school.id}')" class="p-2 hover:bg-yellow-100 rounded-lg text-yellow-600">
                                        <i data-lucide="pause-circle" class="h-4 w-4"></i>
                                    </button>
                                ` : school.status === 'suspended' ? `
                                    <button onclick="reactivateSchool('${school.id}')" class="p-2 hover:bg-green-100 rounded-lg text-green-600">
                                        <i data-lucide="play-circle" class="h-4 w-4"></i>
                                    </button>
                                ` : ''}
                                <button onclick="deleteSchool('${school.id}')" class="p-2 hover:bg-red-100 rounded-lg text-red-600">
                                    <i data-lucide="trash-2" class="h-4 w-4"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Render suspended schools table
function renderSuspendedSchoolsTable(schools) {
    if (!schools || schools.length === 0) {
        return '<div class="text-center py-8 text-muted-foreground">No suspended schools</div>';
    }
    
    return `
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-muted/50">
                    <tr>
                        <th class="px-4 py-3 text-left font-medium">School</th>
                        <th class="px-4 py-3 text-left font-medium">Short Code</th>
                        <th class="px-4 py-3 text-left font-medium">Suspended On</th>
                        <th class="px-4 py-3 text-left font-medium">Reason</th>
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
                            <td class="px-4 py-3">${formatDate(school.suspendedAt)}</td>
                            <td class="px-4 py-3">${school.suspensionReason || 'N/A'}</td>
                            <td class="px-4 py-3 text-right">
                                <button onclick="reactivateSchool('${school.id}')" class="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full hover:bg-green-200">
                                    Reactivate
                                </button>
                                <button onclick="deleteSchool('${school.id}')" class="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full hover:bg-red-200 ml-2">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Render name change requests table
function renderNameChangeRequestsTable(requests) {
    if (!requests || requests.length === 0) {
        return '<div class="text-center py-8 text-muted-foreground">No pending requests</div>';
    }
    
    return `
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-muted/50">
                    <tr>
                        <th class="px-4 py-3 text-left font-medium">School</th>
                        <th class="px-4 py-3 text-left font-medium">Current Name</th>
                        <th class="px-4 py-3 text-left font-medium">New Name</th>
                        <th class="px-4 py-3 text-left font-medium">Requested By</th>
                        <th class="px-4 py-3 text-left font-medium">Date</th>
                        <th class="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    ${requests.map(request => `
                        <tr class="hover:bg-accent/50 transition-colors">
                            <td class="px-4 py-3 font-medium">${request.School?.name || 'N/A'}</td>
                            <td class="px-4 py-3">${request.currentName}</td>
                            <td class="px-4 py-3 font-semibold text-primary">${request.newName}</td>
                            <td class="px-4 py-3">${request.User?.name || 'N/A'}</td>
                            <td class="px-4 py-3">${timeAgo(request.createdAt)}</td>
                            <td class="px-4 py-3 text-right">
                                <button onclick="approveNameChange('${request.id}')" class="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full hover:bg-green-200 mr-2">
                                    Approve
                                </button>
                                <button onclick="rejectNameChange('${request.id}')" class="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full hover:bg-red-200">
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

// Refresh pending schools
async function refreshPendingSchools() {
    const container = document.getElementById('pending-schools-container');
    if (!container) return;
    
    const schools = await loadPendingSchools();
    container.innerHTML = renderPendingSchoolsTable(schools);
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

// Refresh schools list
async function refreshSchoolsList() {
    const container = document.getElementById('schools-table-container');
    if (!container) return;
    
    const schools = await loadAllSchools();
    container.innerHTML = renderSchoolsTable(schools);
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

// Refresh suspended schools
async function refreshSuspendedSchools() {
    const container = document.getElementById('suspended-schools-container');
    if (!container) return;
    
    const schools = await loadSuspendedSchools();
    container.innerHTML = renderSuspendedSchoolsTable(schools);
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

// Refresh name change requests
async function refreshNameChangeRequests() {
    const container = document.getElementById('name-change-requests-container');
    if (!container) return;
    
    const requests = await loadNameChangeRequests();
    container.innerHTML = renderNameChangeRequestsTable(requests);
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

// Helper function to format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Helper function for time ago
function timeAgo(timestamp) {
    if (!timestamp) return 'N/A';
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
        }
    }
    
    return 'just now';
}

// Helper function to get initials
function getInitials(name) {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

// View school details
function viewSchoolDetails(schoolId) {
    showToast(`Viewing school ${schoolId}`, 'info');
}

// Edit school
function editSchool(schoolId) {
    showToast(`Editing school ${schoolId}`, 'info');
}

// Export functions
window.loadPendingSchools = loadPendingSchools;
window.loadAllSchools = loadAllSchools;
window.loadSuspendedSchools = loadSuspendedSchools;
window.loadNameChangeRequests = loadNameChangeRequests;
window.approveSchool = approveSchool;
window.rejectSchool = rejectSchool;
window.suspendSchool = suspendSchool;
window.reactivateSchool = reactivateSchool;
window.createSchool = createSchool;
window.updateSchool = updateSchool;
window.deleteSchool = deleteSchool;
window.approveNameChange = approveNameChange;
window.rejectNameChange = rejectNameChange;
window.updateBankDetails = updateBankDetails;
window.renderPendingSchoolsTable = renderPendingSchoolsTable;
window.renderSchoolsTable = renderSchoolsTable;
window.renderSuspendedSchoolsTable = renderSuspendedSchoolsTable;
window.renderNameChangeRequestsTable = renderNameChangeRequestsTable;
window.refreshPendingSchools = refreshPendingSchools;
window.refreshSchoolsList = refreshSchoolsList;
window.refreshSuspendedSchools = refreshSuspendedSchools;
window.refreshNameChangeRequests = refreshNameChangeRequests;
window.viewSchoolDetails = viewSchoolDetails;
window.editSchool = editSchool;
window.formatDate = formatDate;
window.timeAgo = timeAgo;
window.getInitials = getInitials;
