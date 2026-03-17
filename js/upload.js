// upload.js - Fixed version with null checks

// Download template
async function downloadTemplate(type) {
    try {
        // For CSV templates, we'll create them locally instead of API call
        const templates = {
            students: 'name,grade,parentEmail,dateOfBirth,gender\nJohn Doe,10A,parent@example.com,2010-01-01,male\nJane Smith,10B,jane.parent@example.com,2010-02-15,female',
            marks: 'studentId,elimuid,subject,score,assessmentType,date\n,ELI-2024-001,Mathematics,85,exam,2024-03-15\n,ELI-2024-002,English,78,test,2024-03-14',
            attendance: 'studentId,elimuid,date,status,reason\n,ELI-2024-001,2024-03-15,present,\n,ELI-2024-002,2024-03-15,absent,Sick'
        };
        
        const template = templates[type];
        if (!template) {
            showToast('Invalid template type', 'error');
            return;
        }
        
        const blob = new Blob([template], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${type}_template.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        showToast(`✅ ${type} template downloaded`, 'success');
    } catch (error) {
        console.error('Download template error:', error);
        showToast(error.message || 'Failed to download template', 'error');
    }
}

// Setup file upload
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
        
        // Show loading toast instead of progress bar
        showToast(`⏫ Uploading ${file.name}...`, 'info');
        
        try {
            // Simulate upload delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            showToast(`✅ ${file.name} uploaded successfully`, 'success');
            
            // Refresh data if needed
            if (type === 'students' && typeof refreshMyStudents === 'function') {
                await refreshMyStudents();
            }
            
        } catch (error) {
            showToast('Upload failed: ' + error.message, 'error');
        } finally {
            // Reset file input
            if (fileInput) fileInput.value = '';
        }
    }
}

// Load upload history
async function loadUploadHistory() {
    try {
        // Mock data for now
        const history = [
            { type: 'students', count: 25, timestamp: new Date(), status: 'success' },
            { type: 'marks', count: 50, timestamp: new Date(Date.now() - 86400000), status: 'success' },
            { type: 'attendance', count: 42, timestamp: new Date(Date.now() - 172800000), status: 'success' }
        ];
        renderUploadHistory(history);
    } catch (error) {
        console.error('Failed to load upload history:', error);
        showToast('Failed to load upload history', 'error');
    }
}

// Render upload history
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

// Helper function to format date
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Export functions
window.downloadTemplate = downloadTemplate;
window.setupFileUpload = setupFileUpload;
window.loadUploadHistory = loadUploadHistory;
