// admin-approvals.js - FINAL STABLE VERSION (NO LOGIC CHANGE, SAFE)

// ================= LOAD FUNCTIONS =================

async function loadPendingTeachers() {
    try {
        const response = await api.admin.getPendingApprovals();
        return response?.data?.teachers || [];
    } catch (error) {
        console.error('Failed to load pending teachers:', error);
        showToast('Failed to load pending teachers', 'error');
        return [];
    }
}

async function loadAllTeachers() {
    try {
        const response = await api.admin.getTeachers();
        return response?.data || [];
    } catch (error) {
        console.error('Failed to load teachers:', error);
        return [];
    }
}

async function loadAllStudents() {
    try {
        const response = await api.admin.getStudents();
        return response?.data || [];
    } catch (error) {
        console.error('Failed to load students:', error);
        return [];
    }
}

async function loadMyStudents() {
    try {
        const response = await api.teacher.getMyStudents();
        return response?.data || [];
    } catch (error) {
        console.error('Failed to load my students:', error);
        return [];
    }
}

async function loadAllParents() {
    try {
        const response = await api.admin.getParents();
        return response?.data || [];
    } catch (error) {
        console.error('Failed to load parents:', error);
        return [];
    }
}

// ================= SAFE ERROR HELPER =================
function getErrorMessage(error) {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Something went wrong'
    );
}

// ================= TEACHER ACTIONS =================

async function approveTeacher(teacherId) {
    if (!teacherId) return;

    if (!confirm('Approve this teacher? They will receive an Employee ID.')) return;

    showLoading();
    try {
        const response = await api.admin.approveTeacher(teacherId, 'approve');
        showToast('✅ Teacher approved successfully', 'success');

        await refreshPendingTeachers();
        await refreshTeachersList();

        return response;
    } catch (error) {
        showToast(getErrorMessage(error), 'error');
    } finally {
        hideLoading();
    }
}

async function rejectTeacher(teacherId) {
    if (!teacherId) return;

    const reason = prompt('Please enter rejection reason:');
    if (reason === null) return;

    showLoading();
    try {
        const response = await api.admin.approveTeacher(teacherId, 'reject', reason);
        showToast('Teacher rejected', 'info');

        await refreshPendingTeachers();
        return response;
    } catch (error) {
        showToast(getErrorMessage(error), 'error');
    } finally {
        hideLoading();
    }
}

async function suspendTeacher(teacherId) {
    if (!teacherId) return;

    if (!confirm('⚠️ Suspend this teacher?')) return;

    const reason = prompt('Please enter suspension reason:');
    if (reason === null) return;

    showLoading();
    try {
        const response = await api.admin.suspendTeacher(teacherId, reason);
        showToast('✅ Teacher suspended successfully', 'success');

        await refreshTeachersList();
        return response;
    } catch (error) {
        showToast(getErrorMessage(error), 'error');
    } finally {
        hideLoading();
    }
}

async function reactivateTeacher(teacherId) {
    if (!teacherId) return;

    if (!confirm('Reactivate this teacher?')) return;

    showLoading();
    try {
        const response = await api.admin.reactivateTeacher(teacherId);
        showToast('✅ Teacher reactivated successfully', 'success');

        await refreshTeachersList();
        return response;
    } catch (error) {
        showToast(getErrorMessage(error), 'error');
    } finally {
        hideLoading();
    }
}

async function removeTeacher(teacherId) {
    if (!teacherId) return;

    if (!confirm('⚠️ PERMANENT DELETE?')) return;

    const confirmText = prompt('Type "DELETE" to confirm:');
    if (confirmText !== 'DELETE') {
        showToast('Cancelled', 'info');
        return;
    }

    showLoading();
    try {
        const response = await api.admin.deleteTeacher(teacherId);
        showToast('✅ Teacher removed', 'success');

        await refreshTeachersList();
        return response;
    } catch (error) {
        showToast(getErrorMessage(error), 'error');
    } finally {
        hideLoading();
    }
}

// ================= VIEW TEACHER =================

async function viewTeacher(teacherId) {
    if (!teacherId) return;

    showLoading();
    try {
        const teachers = await loadAllTeachers();
        const teacher = teachers.find(t => t?.id == teacherId);

        if (!teacher) {
            showToast('Teacher not found', 'error');
            return;
        }

        showTeacherDetailsModal(teacher);
    } catch (error) {
        console.error(error);
        showToast('Failed to load teacher', 'error');
    } finally {
        hideLoading();
    }
}

// ================= MODALS SAFE CREATION =================

function ensureModal(id, creator) {
    let modal = document.getElementById(id);
    if (!modal) {
        creator();
        modal = document.getElementById(id);
    }
    return modal;
}

// ================= STUDENT VIEW (FIXED SAFE) =================

async function viewStudent(studentId) {
    if (!studentId) return;

    showLoading();
    try {
        const user = getCurrentUser();

        let students = [];

        if (user?.role === 'teacher') {
            students = await loadMyStudents();
        } else if (user?.role === 'admin' || user?.role === 'super_admin') {
            students = await loadAllStudents();
        } else {
            showToast('Unauthorized', 'error');
            return;
        }

        if (!Array.isArray(students) || students.length === 0) {
            showToast('No students found', 'error');
            return;
        }

        const student = students.find(s => s?.id == studentId);

        if (!student) {
            showToast('Student not found', 'error');
            return;
        }

        showStudentDetailsModal(student);

    } catch (error) {
        console.error(error);
        showToast(getErrorMessage(error), 'error');
    } finally {
        hideLoading();
    }
}

// ================= EDIT HANDLERS SAFE =================

async function handleUpdateTeacher() {
    const id = document.getElementById('edit-teacher-id')?.value;
    if (!id) return showToast('Invalid teacher', 'error');

    const subjectsRaw = document.getElementById('edit-teacher-subjects')?.value || '';

    const data = {
        name: document.getElementById('edit-teacher-name')?.value || '',
        email: document.getElementById('edit-teacher-email')?.value || '',
        phone: document.getElementById('edit-teacher-phone')?.value || '',
        department: document.getElementById('edit-teacher-department')?.value || '',
        subjects: subjectsRaw ? subjectsRaw.split(',').map(s => s.trim()) : [],
        qualification: document.getElementById('edit-teacher-qualification')?.value || ''
    };

    if (!data.name) return showToast('Name required', 'error');

    await updateTeacher(id, data);
    closeEditTeacherModal();
}

async function handleUpdateStudent() {
    const id = document.getElementById('edit-student-id')?.value;
    if (!id) return showToast('Invalid student', 'error');

    const data = {
        name: document.getElementById('edit-student-name')?.value || '',
        email: document.getElementById('edit-student-email')?.value || '',
        grade: document.getElementById('edit-student-grade')?.value || '',
        gender: document.getElementById('edit-student-gender')?.value || '',
        dateOfBirth: document.getElementById('edit-student-dob')?.value || '',
        status: document.getElementById('edit-student-status')?.value || ''
    };

    if (!data.name || !data.grade) {
        return showToast('Name & grade required', 'error');
    }

    await updateStudent(id, data);
    closeEditStudentModal();
}

// ================= REFRESH =================

async function refreshStudentsList() {
    const container = document.getElementById('students-table-container');
    if (!container) return;

    const students = await loadAllStudents();
    container.innerHTML = renderStudentsTable(students);

    if (window.lucide) lucide.createIcons();
}

// ================= HELPERS =================

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch {
        return null;
    }
}

function copyElimuid(elimuid) {
    if (!elimuid) return showToast('No ELIMUID', 'error');

    navigator.clipboard.writeText(elimuid)
        .then(() => showToast('Copied', 'success'))
        .catch(() => showToast('Failed', 'error'));
}

function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

// ================= EXPORT =================

Object.assign(window, {
    loadPendingTeachers,
    loadAllTeachers,
    loadAllStudents,
    loadMyStudents,
    approveTeacher,
    rejectTeacher,
    suspendTeacher,
    reactivateTeacher,
    removeTeacher,
    viewTeacher,
    viewStudent,
    handleUpdateTeacher,
    handleUpdateStudent,
    refreshStudentsList,
    copyElimuid,
    getCurrentUser,
    getInitials
});

// fallback redirect
window.viewStudentDetails = (id) => window.viewStudent(id);
