// ==================== SUPER ADMIN FUNCTIONS ====================

// Global variables
let allSchools = [];
let pendingNameRequests = [];

// Load super admin dashboard
window.loadSuperDashboard = async function() {
    try {
        document.getElementById('super-content').innerHTML = '<div class="loading">Loading dashboard...</div>';
        
        // Fetch data from API
        let overview = { data: { stats: { schools: 0, students: 0, teachers: 0, parents: 0, pendingRequests: 0 } } };
        let schoolsRes = { data: [] };
        let requestsRes = { data: [] };
        
        try {
            overview = await api.getSuperOverview();
            schoolsRes = await api.getSuperSchools();
            requestsRes = await api.getSuperPendingRequests();
        } catch (error) {
            console.warn('Using mock data:', error);
            // Mock data for testing
            schoolsRes = {
                data: [
                    { id: 1, schoolId: 'SCH-2024-001', name: 'Greenwood High', system: '844', isActive: true, useCustomName: false, createdAt: new Date().toISOString() },
                    { id: 2, schoolId: 'SCH-2024-002', name: 'Riverside Academy', system: 'cbc', isActive: true, useCustomName: true, customName: 'Riverside Prep', createdAt: new Date().toISOString() },
                    { id: 3, schoolId: 'SCH-2024-003', name: 'St. Mary\'s School', system: 'british', isActive: false, useCustomName: false, createdAt: new Date().toISOString() }
                ]
            };
            requestsRes = {
                data: [
                    { id: 1, schoolCode: 'SCH-2024-001', currentName: 'Greenwood High', newName: 'Greenwood International', reason: 'Rebranding', requestedBy: 'Admin' }
                ]
            };
        }
        
        allSchools = schoolsRes.data || [];
        pendingNameRequests = requestsRes.data || [];
        
        const stats = overview.data?.stats || {
            schools: allSchools.length,
            students: 245,
            teachers: 28,
            parents: 180,
            pendingRequests: pendingNameRequests.length
        };
        
        document.getElementById('super-content').innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon" style="background:#8b5cf6;"><i class="fas fa-school"></i></div>
                    <div class="stat-info"><h3>${stats.schools}</h3><p>Schools</p></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background:#a78bfa;"><i class="fas fa-users"></i></div>
                    <div class="stat-info"><h3>${stats.students}</h3><p>Students</p></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background:#c4b5fd;"><i class="fas fa-chalkboard-teacher"></i></div>
                    <div class="stat-info"><h3>${stats.teachers}</h3><p>Teachers</p></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background:#d8b4fe;"><i class="fas fa-clock"></i></div>
                    <div class="stat-info"><h3>${stats.pendingRequests}</h3><p>Pending Approvals</p></div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-school"></i> School Management</h3>
                    <button class="btn-primary" onclick="showCreateSchoolModal()">
                        <i class="fas fa-plus"></i> Add New School
                    </button>
                </div>
                <div class="table-responsive">
                    <table class="data-table" id="schools-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>School Name</th>
                                <th>Custom Name</th>
                                <th>System</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${allSchools.map(school => `
                                <tr id="school-${school.id}">
                                    <td>${school.schoolId}</td>
                                    <td>
                                        <span class="school-name-display" data-original="${school.name}">
                                            ${school.useCustomName && school.customName ? school.customName : school.name}
                                        </span>
                                    </td>
                                    <td>
                                        <label class="toggle-switch-small">
                                            <input type="checkbox" 
                                                   ${school.useCustomName ? 'checked' : ''} 
                                                   onchange="toggleSchoolCustomName('${school.id}', '${school.customName || school.name}', this.checked)">
                                            <span class="slider"></span>
                                        </label>
                                        ${school.customName ? `<br><small>Custom: ${school.customName}</small>` : ''}
                                    </td>
                                    <td>${school.system}</td>
                                    <td>
                                        <span class="status-badge ${school.isActive ? 'status-active' : 'status-inactive'}">
                                            ${school.isActive ? 'Active' : 'Suspended'}
                                        </span>
                                    </td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="btn-small" onclick="editSchool('${school.id}')" title="Edit">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="btn-small ${school.isActive ? 'btn-warning' : 'btn-success'}" 
                                                    onclick="toggleSchoolStatus('${school.id}', ${!school.isActive})"
                                                    title="${school.isActive ? 'Suspend' : 'Activate'}">
                                                <i class="fas ${school.isActive ? 'fa-pause' : 'fa-play'}"></i>
                                            </button>
                                            <button class="btn-small btn-danger" onclick="deleteSchool('${school.id}')" title="Delete">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-clock"></i> School Name Change Requests (${pendingNameRequests.length})</h3>
                </div>
                ${pendingNameRequests.length > 0 ? `
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>School</th>
                                <th>Current Name</th>
                                <th>Requested Name</th>
                                <th>Reason</th>
                                <th>Requested By</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pendingNameRequests.map(req => {
                                const school = allSchools.find(s => s.schoolId === req.schoolCode);
                                return `
                                <tr id="request-${req.id}">
                                    <td>${school?.name || req.schoolCode}</td>
                                    <td>${req.currentName}</td>
                                    <td><strong>${req.newName}</strong></td>
                                    <td>${req.reason}</td>
                                    <td>${req.requestedBy || 'Admin'}</td>
                                    <td>
                                        <button class="btn-small btn-success" onclick="approveNameRequest('${req.id}', '${req.newName}')">
                                            <i class="fas fa-check"></i> Approve
                                        </button>
                                        <button class="btn-small btn-danger" onclick="rejectNameRequest('${req.id}')">
                                            <i class="fas fa-times"></i> Reject
                                        </button>
                                    </td>
                                </tr>
                            `}).join('')}
                        </tbody>
                    </table>
                </div>
                ` : '<p class="text-muted p-3">No pending name change requests</p>'}
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-university"></i> Platform Settings</h3>
                </div>
                <div class="form-group">
                    <label>Default Bank Details (for all schools)</label>
                    <div class="bank-details-form">
                        <input type="text" id="bank-name" placeholder="Bank Name" value="Equity Bank">
                        <input type="text" id="account-name" placeholder="Account Name" value="ShuleAI Schools">
                        <input type="text" id="account-number" placeholder="Account Number" value="1234567890">
                        <input type="text" id="bank-branch" placeholder="Branch" value="Head Office">
                    </div>
                    <button class="btn-primary mt-2" onclick="updateBankDetails()">Update Bank Details</button>
                </div>
            </div>
        `;
        
        window.updateActiveMenu('super-sidebar', 'overview');
        
    } catch (error) {
        console.error('Error loading super dashboard:', error);
        document.getElementById('super-content').innerHTML = `
            <div class="alert alert-danger">
                Failed to load dashboard: ${error.message}
            </div>
        `;
    }
};

window.showCreateSchoolModal = function() {
    const modalHtml = `
        <div class="modal-overlay" id="create-school-modal" style="display: flex;">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-plus-circle"></i> Create New School</h3>
                    <button class="modal-close" onclick="closeModal('create-school-modal')">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>School Name *</label>
                        <input type="text" id="new-school-name" placeholder="e.g., Greenwood High" required>
                    </div>
                    <div class="form-group">
                        <label>Curriculum System</label>
                        <select id="new-school-system">
                            <option value="844">8-4-4 System</option>
                            <option value="cbc">CBC</option>
                            <option value="british">British Curriculum</option>
                            <option value="american">American Curriculum</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Address</label>
                        <input type="text" id="new-school-address" placeholder="Street, City, Country">
                    </div>
                    <div class="form-group">
                        <label>Contact Email</label>
                        <input type="email" id="new-school-email" placeholder="admin@school.edu">
                    </div>
                    <div class="form-group">
                        <label>Contact Phone</label>
                        <input type="tel" id="new-school-phone" placeholder="+254 700 000000">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="closeModal('create-school-modal')">Cancel</button>
                    <button class="btn-primary" onclick="createSchool()">Create School</button>
                </div>
            </div>
        </div>
    `;
    
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer.firstChild);
};

window.createSchool = async function() {
    const name = document.getElementById('new-school-name').value;
    if (!name) {
        window.showToast('School name is required', 'error');
        return;
    }
    
    const data = {
        name: name,
        system: document.getElementById('new-school-system').value,
        address: {
            street: document.getElementById('new-school-address').value,
            city: 'Nairobi',
            country: 'Kenya'
        },
        contact: {
            email: document.getElementById('new-school-email').value,
            phone: document.getElementById('new-school-phone').value
        }
    };
    
    try {
        window.showToast('Creating school...', 'info');
        await api.createSchool(data);
        window.showToast('School created successfully!', 'success');
        closeModal('create-school-modal');
        
        const modal = document.getElementById('create-school-modal');
        if (modal) modal.remove();
        
        loadSuperDashboard();
    } catch (error) {
        window.showToast('Failed to create school: ' + error.message, 'error');
    }
};

window.editSchool = function(schoolId) {
    const school = allSchools.find(s => s.id == schoolId);
    if (!school) return;
    
    const modalHtml = `
        <div class="modal-overlay" id="edit-school-modal" style="display: flex;">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-edit"></i> Edit School</h3>
                    <button class="modal-close" onclick="closeModal('edit-school-modal')">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>School Name</label>
                        <input type="text" id="edit-school-name" value="${school.name}">
                    </div>
                    <div class="form-group">
                        <label>Curriculum System</label>
                        <select id="edit-school-system">
                            <option value="844" ${school.system === '844' ? 'selected' : ''}>8-4-4 System</option>
                            <option value="cbc" ${school.system === 'cbc' ? 'selected' : ''}>CBC</option>
                            <option value="british" ${school.system === 'british' ? 'selected' : ''}>British Curriculum</option>
                            <option value="american" ${school.system === 'american' ? 'selected' : ''}>American Curriculum</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Custom Name Toggle</label>
                        <div class="toggle-switch">
                            <span>Use custom name (for paid subscriptions)</span>
                            <label class="switch">
                                <input type="checkbox" id="edit-use-custom-name" ${school.useCustomName ? 'checked' : ''}>
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Custom Name</label>
                        <input type="text" id="edit-custom-name" value="${school.customName || ''}" placeholder="Enter custom name if approved">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="closeModal('edit-school-modal')">Cancel</button>
                    <button class="btn-primary" onclick="updateSchool('${school.id}')">Update School</button>
                </div>
            </div>
        </div>
    `;
    
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer.firstChild);
};

window.updateSchool = async function(schoolId) {
    const name = document.getElementById('edit-school-name')?.value;
    const system = document.getElementById('edit-school-system')?.value;
    const useCustomName = document.getElementById('edit-use-custom-name')?.checked;
    const customName = document.getElementById('edit-custom-name')?.value;
    
    const updates = {};
    if (name) updates.name = name;
    if (system) updates.system = system;
    updates.useCustomName = useCustomName;
    if (customName) updates.customName = customName;
    
    try {
        await api.updateSchool(schoolId, updates);
        window.showToast('School updated successfully', 'success');
        closeModal('edit-school-modal');
        
        const modal = document.getElementById('edit-school-modal');
        if (modal) modal.remove();
        
        loadSuperDashboard();
    } catch (error) {
        window.showToast('Failed to update school: ' + error.message, 'error');
    }
};

window.toggleSchoolStatus = async function(schoolId, activate) {
    const action = activate ? 'activate' : 'suspend';
    if (!confirm(`Are you sure you want to ${action} this school?`)) return;
    
    try {
        await api.updateSchool(schoolId, { isActive: activate });
        window.showToast(`School ${action}d successfully`, 'success');
        loadSuperDashboard();
    } catch (error) {
        window.showToast(`Failed to ${action} school: ${error.message}`, 'error');
    }
};

window.deleteSchool = async function(schoolId) {
    if (!confirm('WARNING: This will permanently delete the school and ALL its data. This action cannot be undone. Are you absolutely sure?')) return;
    
    try {
        await api.deleteSchool(schoolId);
        window.showToast('School deleted', 'success');
        loadSuperDashboard();
    } catch (error) {
        window.showToast('Failed to delete school: ' + error.message, 'error');
    }
};

window.toggleSchoolCustomName = async function(schoolId, customName, useCustomName) {
    try {
        await api.updateSchool(schoolId, { 
            useCustomName: useCustomName,
            customName: useCustomName ? customName : null
        });
        
        const row = document.getElementById(`school-${schoolId}`);
        if (row) {
            const nameDisplay = row.querySelector('.school-name-display');
            if (nameDisplay) {
                if (useCustomName) {
                    nameDisplay.innerHTML = customName;
                } else {
                    nameDisplay.innerHTML = nameDisplay.dataset.original;
                }
            }
        }
        
        window.showToast(`Custom name ${useCustomName ? 'enabled' : 'disabled'}`, 'success');
    } catch (error) {
        window.showToast('Failed to toggle custom name: ' + error.message, 'error');
    }
};

window.approveNameRequest = async function(requestId, newName) {
    if (!confirm(`Approve name change to "${newName}"?`)) return;
    
    try {
        await api.approveNameRequest(requestId);
        window.showToast('Name change approved', 'success');
        loadSuperDashboard();
    } catch (error) {
        window.showToast('Failed to approve: ' + error.message, 'error');
    }
};

window.rejectNameRequest = async function(requestId) {
    const reason = prompt('Enter reason for rejection:');
    if (reason === null) return;
    
    try {
        await api.rejectNameRequest(requestId, reason);
        window.showToast('Request rejected', 'success');
        loadSuperDashboard();
    } catch (error) {
        window.showToast('Failed to reject: ' + error.message, 'error');
    }
};

window.updateBankDetails = async function() {
    const bankDetails = {
        bankName: document.getElementById('bank-name').value,
        accountName: document.getElementById('account-name').value,
        accountNumber: document.getElementById('account-number').value,
        branch: document.getElementById('bank-branch').value
    };
    
    try {
        await api.updateBankDetails(bankDetails);
        window.showToast('Bank details updated', 'success');
    } catch (error) {
        window.showToast('Failed to update: ' + error.message, 'error');
    }
};

window.switchSuperTab = function(tab) {
    if (tab === 'overview') {
        loadSuperDashboard();
    } else if (tab === 'demo') {
        document.getElementById('super-content').innerHTML = `
            <h3>Demo Data Control</h3>
            <div class="card">
                <p>Current demo mode: <strong>${window.demoMode ? 'ON' : 'OFF'}</strong></p>
                <button class="btn-primary" onclick="toggleDemoData()">
                    ${window.demoMode ? 'Disable Demo Data' : 'Enable Demo Data'}
                </button>
            </div>
        `;
    }
    
    window.updateActiveMenu('super-sidebar', tab);
};

window.toggleDemoData = function() {
    window.demoMode = !window.demoMode;
    window.showToast(`Demo data ${window.demoMode ? 'enabled' : 'disabled'}`, 'info');
    loadSuperDashboard();
};
