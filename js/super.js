// ==================== SUPER ADMIN FUNCTIONS ====================

window.loadSuperDashboard = async function() {
    const contentDiv = document.getElementById('super-content');
    contentDiv.innerHTML = '<div class="loading">Loading...</div>';
    try {
        const overview = await api.getOverview();
        const data = overview.data;
        contentDiv.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card"><div class="stat-icon" style="background:#8b5cf6;"><i class="fas fa-school"></i></div><div class="stat-info"><h3>${data.schools || 0}</h3><p>Schools</p></div></div>
                <div class="stat-card"><div class="stat-icon" style="background:#a78bfa;"><i class="fas fa-users"></i></div><div class="stat-info"><h3>${data.students || 0}</h3><p>Students</p></div></div>
                <div class="stat-card"><div class="stat-icon" style="background:#c4b5fd;"><i class="fas fa-chalkboard-teacher"></i></div><div class="stat-info"><h3>${data.teachers || 0}</h3><p>Teachers</p></div></div>
                <div class="stat-card"><div class="stat-icon" style="background:#d8b4fe;"><i class="fas fa-clock"></i></div><div class="stat-info"><h3>${data.pendingRequests || 0}</h3><p>Pending Approvals</p></div></div>
            </div>
            <div class="card">
                <h4>Platform Control</h4>
                <p>Current data: ${data.students || 0} students, ${data.teachers || 0} teachers, ${data.schools || 0} schools</p>
                <button class="btn-primary" onclick="toggleDemoData()">Toggle Demo Data</button>
            </div>
        `;
    } catch (error) {
        contentDiv.innerHTML = '<div class="error">Failed to load overview</div>';
    }
};

window.switchSuperTab = async function(tab) {
    const contentDiv = document.getElementById('super-content');
    contentDiv.innerHTML = '<div class="loading">Loading...</div>';

    if (tab === 'overview') {
        await loadSuperDashboard();
    } else if (tab === 'schools') {
        try {
            const schoolsData = await api.getSchools();
            const schools = schoolsData.data || [];
            let rows = schools.map(s => `
                <tr>
                    <td>${s.name}</td>
                    <td>${s.schoolId}</td>
                    <td>${s.system}</td>
                    <td>${s.stats?.students || 0}</td>
                    <td><button class="btn-small" onclick="showToast('Edit ${s.name}')">Edit</button></td>
                </tr>
            `).join('');
            contentDiv.innerHTML = `
                <h3>Manage Schools</h3>
                <div class="card">
                    <button class="btn-primary" onclick="showAddSchoolForm()">+ Add School</button>
                </div>
                <div class="table-responsive">
                    <table class="data-table">
                        <tr><th>Name</th><th>ID</th><th>System</th><th>Students</th><th>Actions</th></tr>
                        ${rows || '<tr><td colspan="5">No schools found</td></tr>'}
                    </table>
                </div>
            `;
        } catch (error) {
            contentDiv.innerHTML = '<div class="error">Failed to load schools</div>';
        }
    } else if (tab === 'approvals') {
        try {
            const requestsData = await api.getPendingRequests();
            const requests = requestsData.data || [];
            let cards = requests.map(r => `
                <div class="card">
                    <h4>${r.school?.name || 'Unknown'} (${r.schoolCode})</h4>
                    <p>Requested by: ${r.requestedBy?.name || 'Unknown'}</p>
                    <p>New Name: <strong>${r.newName}</strong></p>
                    <p>Reason: ${r.reason}</p>
                    <div style="display: flex; gap: 1rem;">
                        <button class="btn-success" onclick="approveRequest('${r.id}')">Approve</button>
                        <button class="btn-danger" onclick="rejectRequest('${r.id}')">Reject</button>
                    </div>
                </div>
            `).join('');
            contentDiv.innerHTML = `
                <h3>Pending School Name Change Requests</h3>
                ${cards || '<p>No pending requests</p>'}
            `;
        } catch (error) {
            contentDiv.innerHTML = '<div class="error">Failed to load requests</div>';
        }
    } else if (tab === 'bank-settings') {
        // We need an endpoint to get current bank details – you might need to add one
        contentDiv.innerHTML = `
            <h3>Bank Account Settings</h3>
            <div class="card">
                <div class="form-group"><label>Bank Name</label><input type="text" id="bank-name" value="Equity Bank"></div>
                <div class="form-group"><label>Account Name</label><input type="text" id="account-name" value="ShuleAI Schools"></div>
                <div class="form-group"><label>Account Number</label><input type="text" id="account-number" value="1234567890"></div>
                <div class="form-group"><label>Branch</label><input type="text" id="branch" value="Head Office"></div>
                <button class="btn-primary" onclick="updateBankDetails()">Save Bank Details</button>
            </div>
        `;
    } else if (tab === 'demo') {
        contentDiv.innerHTML = `
            <h3>Demo Data Control</h3>
            <div class="card">
                <p>Current: <strong>${window.demoMode ? 'Demo Active' : 'Demo Off'}</strong></p>
                <button class="btn-primary" onclick="toggleDemoData()">${window.demoMode ? 'Remove Demo Data' : 'Restore Demo Data'}</button>
            </div>
        `;
    } else {
        contentDiv.innerHTML = `<h3>${tab.replace(/-/g, ' ')}</h3><div class="card"><p>Content for ${tab} would appear here.</p></div>`;
    }

    updateActiveMenu('super-sidebar', tab);
};

window.showAddSchoolForm = function() {
    // Simple form – you could make it a modal
    const formHtml = `
        <div class="modal-overlay" id="add-school-modal" style="display:flex;">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Add New School</h3>
                    <button class="modal-close" onclick="document.getElementById('add-school-modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group"><label>School Name</label><input type="text" id="new-school-name"></div>
                    <div class="form-group"><label>System</label>
                        <select id="new-school-system">
                            <option value="844">8-4-4</option>
                            <option value="cbc">CBC</option>
                            <option value="british">British</option>
                            <option value="american">American</option>
                        </select>
                    </div>
                    <div class="form-group"><label>Address</label><input type="text" id="new-school-address"></div>
                    <div class="form-group"><label>Contact Email</label><input type="email" id="new-school-email"></div>
                    <button class="btn-primary" onclick="createSchool()">Create School</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', formHtml);
};

window.createSchool = async function() {
    const name = document.getElementById('new-school-name')?.value;
    const system = document.getElementById('new-school-system')?.value;
    const address = document.getElementById('new-school-address')?.value;
    const email = document.getElementById('new-school-email')?.value;
    if (!name) {
        showToast('School name is required', 'warning');
        return;
    }
    try {
        await api.createSchool({ name, system, address, contact: { email } });
        showToast('School created', 'success');
        document.getElementById('add-school-modal')?.remove();
        switchSuperTab('schools');
    } catch (error) {
        showToast('Failed to create school', 'error');
    }
};

window.approveRequest = async function(requestId) {
    try {
        await api.approveRequest(requestId);
        showToast('Request approved', 'success');
        switchSuperTab('approvals');
    } catch (error) {
        showToast('Approval failed', 'error');
    }
};

window.rejectRequest = async function(requestId) {
    const reason = prompt('Enter rejection reason:');
    if (reason === null) return;
    try {
        await api.rejectRequest(requestId, reason);
        showToast('Request rejected', 'info');
        switchSuperTab('approvals');
    } catch (error) {
        showToast('Rejection failed', 'error');
    }
};

window.updateBankDetails = async function() {
    const bankName = document.getElementById('bank-name')?.value;
    const accountName = document.getElementById('account-name')?.value;
    const accountNumber = document.getElementById('account-number')?.value;
    const branch = document.getElementById('branch')?.value;
    // You need an endpoint to update bank details – assume it's for the current school? Or super admin sets global?
    // For now, we just show a toast
    showToast('Bank details updated (not yet implemented)', 'info');
};

window.toggleDemoData = function() {
    window.demoMode = !window.demoMode;
    showToast(`Demo data ${window.demoMode ? 'enabled' : 'disabled'}`);
    loadSuperDashboard();
};
