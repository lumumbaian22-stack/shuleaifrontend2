// CSV upload functionality

async function downloadTemplate(type) {
    try {
        const response = await apiRequest(`/api/upload/template/${type}`, {
            responseType: 'blob'
        });
        
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${type}_template.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        showToast('Failed to download template: ' + error.message, 'error');
    }
}

function setupFileUpload(dropZoneId, fileInputId, type) {
    const dropZone = document.getElementById(dropZoneId);
    const fileInput = document.getElementById(fileInputId);
    
    if (!dropZone || !fileInput) return;
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    // Highlight drop zone on drag over
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });
    
    // Handle dropped files
    dropZone.addEventListener('drop', handleDrop, false);
    
    // Click to browse
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Handle file input change
    fileInput.addEventListener('change', handleFileSelect, false);
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight() {
        dropZone.classList.add('border-primary', 'bg-primary/5');
    }
    
    function unhighlight() {
        dropZone.classList.remove('border-primary', 'bg-primary/5');
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
    
    function handleFileSelect(e) {
        const files = e.target.files;
        handleFiles(files);
    }
    
    async function handleFiles(files) {
        const file = files[0];
        
        if (!file) return;
        
        // Validate file type
        if (!file.name.endsWith('.csv')) {
            showToast('Please upload a CSV file', 'error');
            return;
        }
        
        // Show progress container
        const progressContainer = document.getElementById('upload-progress-container');
        const progressBar = document.getElementById('upload-progress');
        const progressText = document.getElementById('upload-progress-text');
        
        if (progressContainer) progressContainer.classList.remove('hidden');
        
        try {
            // Validate CSV first
            const validationResult = await uploadFile('/api/upload/validate', file, (progress) => {
                if (progressBar) progressBar.style.width = `${progress}%`;
                if (progressText) progressText.textContent = `${Math.round(progress)}%`;
            });
            
            if (validationResult.valid) {
                // Proceed with actual upload
                const result = await uploadFile(`/api/upload/${type}`, file, (progress) => {
                    if (progressBar) progressBar.style.width = `${progress}%`;
                    if (progressText) progressText.textContent = `${Math.round(progress)}%`;
                });
                
                showToast(`Successfully uploaded ${result.count} records`, 'success');
                
                // Refresh dashboard if needed
                if (typeof loadDashboardContent === 'function') {
                    const role = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).role : null;
                    if (role) await loadDashboardContent(role);
                }
            } else {
                showToast('CSV validation failed: ' + validationResult.errors.join(', '), 'error');
            }
        } catch (error) {
            showToast('Upload failed: ' + error.message, 'error');
        } finally {
            if (progressContainer) progressContainer.classList.add('hidden');
            if (progressBar) progressBar.style.width = '0%';
            if (progressText) progressText.textContent = '0%';
            fileInput.value = ''; // Reset file input
        }
    }
}

async function loadUploadHistory() {
    try {
        const data = await apiRequest('/api/upload/history');
        renderUploadHistory(data);
    } catch (error) {
        showToast('Failed to load upload history', 'error');
    }
}

function renderUploadHistory(history) {
    const container = document.getElementById('upload-history');
    if (!container) return;
    
    container.innerHTML = `
        <div class="space-y-2">
            ${history.map(item => `
                <div class="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <div>
                        <p class="text-sm font-medium">${item.type} Upload</p>
                        <p class="text-xs text-muted-foreground">${item.count} records • ${formatDate(item.timestamp)}</p>
                    </div>
                    <span class="text-xs ${item.status === 'success' ? 'text-green-600' : 'text-red-600'}">
                        ${item.status}
                    </span>
                </div>
            `).join('')}
        </div>
    `;
}

// Export functions
window.downloadTemplate = downloadTemplate;
window.setupFileUpload = setupFileUpload;
window.loadUploadHistory = loadUploadHistory;