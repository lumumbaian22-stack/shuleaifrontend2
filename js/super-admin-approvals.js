// super-admin-approvals.js - Complete fixed version

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
                        // Find admin from the Users array if it exists
                        const admin = school.Users ? school.Users.find(u => u.role === 'admin') : null;
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
                            <td class="px-4 py-3 font-medium">${request.school?.name || 'N/A'}</td>
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

// Show create school modal
function showCreateSchoolModal() {
    const modal = document.getElementById('create-school-modal');
    if (modal) {
        modal.classList.remove('hidden');
    } else {
        // Create modal if it doesn't exist
        createCreateSchoolModal();
    }
}

// Create create school modal
function createCreateSchoolModal() {
    const modalHTML = `
        <div id="create-school-modal" class="fixed inset-0 z-50 hidden">
            <div class="absolute inset-0 bg-black/50" onclick="closeCreateSchoolModal()"></div>
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4">
                <div class="rounded-xl border bg-card p-6 shadow-xl animate-fade-in">
                    <h3 class="text-lg font-semibold mb-4">Create New School</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">School Name</label>
                            <input type="text" id="modal-school-name" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">School Level</label>
                            <select id="modal-school-level" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                                <option value="primary">Primary</option>
                                <option value="secondary">Secondary</option>
                                <option value="both">Both</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Curriculum</label>
                            <select id="modal-curriculum" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                                <option value="cbc">CBC</option>
                                <option value="844">8-4-4</option>
                                <option value="british">British</option>
                                <option value="american">American</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Admin Name</label>
                            <input type="text" id="modal-admin-name" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Admin Email</label>
                            <input type="email" id="modal-admin-email" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Admin Password</label>
                            <input type="password" id="modal-admin-password" value="Admin123!" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        </div>
                    </div>
                    <div class="flex justify-end gap-2 mt-6">
                        <button onclick="closeCreateSchoolModal()" class="px-4 py-2 text-sm border rounded-lg hover:bg-accent">Cancel</button>
                        <button onclick="handleCreateSchool()" class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Create School</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('create-school-modal').classList.remove('hidden');
}

// Close create school modal
function closeCreateSchoolModal() {
    const modal = document.getElementById('create-school-modal');
    if (modal) modal.classList.add('hidden');
}

// Handle create school
async function handleCreateSchool() {
    const schoolData = {
        name: document.getElementById('modal-school-name')?.value,
        system: document.getElementById('modal-curriculum')?.value,
        adminName: document.getElementById('modal-admin-name')?.value,
        adminEmail: document.getElementById('modal-admin-email')?.value,
        adminPassword: document.getElementById('modal-admin-password')?.value,
        settings: {
            schoolLevel: document.getElementById('modal-school-level')?.value
        }
    };
    
    if (!schoolData.name || !schoolData.adminName || !schoolData.adminEmail) {
        showToast('Please fill all required fields', 'error');
        return;
    }
    
    await createSchool(schoolData);
    closeCreateSchoolModal();
}

// View school details
function viewSchoolDetails(schoolId) {
    showToast(`Viewing school ${schoolId}`, 'info');
    // Implement school details view
}

// Edit school
function editSchool(schoolId) {
    showToast(`Editing school ${schoolId}`, 'info');
    // Implement school edit modal
}

// Export functions
window.loadPendingSchools = loadPendingSchools;
window.loadAllSchools = loadAllSchools;
window.loadNameChangeRequests = loadNameChangeRequests;
window.approveSchool = approveSchool;
window.rejectSchool = rejectSchool;
window.createSchool = createSchool;
window.updateSchool = updateSchool;
window.deleteSchool = deleteSchool;
window.approveNameChange = approveNameChange;
window.rejectNameChange = rejectNameChange;
window.updateBankDetails = updateBankDetails;
window.renderPendingSchoolsTable = renderPendingSchoolsTable;
window.renderSchoolsTable = renderSchoolsTable;
window.renderNameChangeRequestsTable = renderNameChangeRequestsTable;
window.refreshPendingSchools = refreshPendingSchools;
window.refreshSchoolsList = refreshSchoolsList;
window.refreshNameChangeRequests = refreshNameChangeRequests;
window.showCreateSchoolModal = showCreateSchoolModal;
window.closeCreateSchoolModal = closeCreateSchoolModal;
window.handleCreateSchool = handleCreateSchool;
window.viewSchoolDetails = viewSchoolDetails;
window.editSchool = editSchool;
