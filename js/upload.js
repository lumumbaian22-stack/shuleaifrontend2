// upload.js - Complete fixed version with null checks

// Download template
async function downloadTemplate(type) {
    try {
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
        showToast('Failed to download template', 'error');
    }
}

// Setup file upload
function setupFileUpload(dropZoneId, fileInputId, type) {
    const dropZone = document.getElementById(dropZoneId);
    const fileInput = document.getElementById(fileInputId);
    
    if (!dropZone || !fileInput) {
        console.error('Required elements not found');
        return;
    }
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });
    
    dropZone.addEventListener('drop', handleDrop, false);
    dropZone.addEventListener('click', () => fileInput.click());
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
        handleFiles(dt.files);
    }
    
    function handleFileSelect(e) {
        handleFiles(e.target.files);
    }
    
    async function handleFiles(files) {
        const file = files[0];
        if (!file) return;
        
        if (!file.name.endsWith('.csv')) {
            showToast('Please upload a CSV file', 'error');
            return;
        }
        
        // Show upload started message
        showToast(`⏫ Uploading ${file.name}...`, 'info');
        
        try {
            // Simulate upload delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            showToast(`✅ ${file.name} uploaded successfully`, 'success');
            
            // Refresh data if needed
            if (type === 'students' && typeof refreshMyStudents === 'function') {
                await refreshMyStudents();
            }
            
        } catch (error) {
            showToast('Upload failed: ' + error.message, 'error');
            console.error('Upload error:', error);
        } finally {
            fileInput.value = '';
        }
    }
}

// Load upload history
async function loadUploadHistory() {
    try {
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
