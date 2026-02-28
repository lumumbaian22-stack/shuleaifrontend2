// ==================== DATABASE ====================

window.demoMode = true;

window.schools = [
    { id: 'GRN001', name: 'Greenwood High', code: 'GRN001', system: '844', students: 1245, teachers: 68, feeStructure: { term1: 45000, term2: 45000, term3: 45000 } }
];

window.currentUser = null;
window.currentSchool = window.schools[0];
window.currentChildren = [];
window.activeChildId = 'STU001';

window.users = {
    admin: [{ id: 'ADMIN001', schoolCode: 'GRN001', name: 'Admin', password: 'admin123', role: 'admin', email: 'admin@greenwood.edu', phone: '+254700123456' }],
    teachers: [{ id: 'TCH001', schoolCode: 'GRN001', name: 'John Doe', password: 'teacher123', subject: 'Mathematics', class: '10A', email: 'j.doe@greenwood.edu', phone: '+254700123456', timetable: [{ day: 'Monday', period: '8:00-9:00', subject: 'Math 10A' }], reminders: [] }],
    parents: [{ id: 'PAR001', name: 'John Smith', password: 'parent123', email: 'john.smith@email.com', phone: '+254711223344', children: ['STU001', 'STU002'] }],
    students: [
        { id: 'STU001', elimuid: 'ELIMU-2026-001', schoolCode: 'GRN001', name: 'Emma Smith', grade: '10A', parentId: 'PAR001', password: 'student123', status: 'average', preferences: { theme: 'light', notifications: true } },
        { id: 'STU002', elimuid: 'ELIMU-2026-002', schoolCode: 'GRN001', name: 'James Smith', grade: '8B', parentId: 'PAR001', password: 'student123', status: 'excelling', preferences: { theme: 'light', notifications: true } }
    ]
};

window.subjects = [
    { id: 'MATH', name: 'Mathematics', passMark: 50, gradeScale: '844' },
    { id: 'ENG', name: 'English', passMark: 50, gradeScale: '844' },
    { id: 'SCI', name: 'Science', passMark: 50, gradeScale: '844' },
    { id: 'HIST', name: 'History', passMark: 50, gradeScale: '844' }
];

window.academicRecords = [
    { studentId: 'STU001', subject: 'Mathematics', score: 85, grade: 'A-', term: 'Term 1, 2024', teacher: 'Mr. Doe', comment: 'Good progress', date: '2024-03-15' },
    { studentId: 'STU001', subject: 'English', score: 78, grade: 'B+', term: 'Term 1, 2024', teacher: 'Ms. Smith', comment: 'Needs more reading', date: '2024-03-15' },
    { studentId: 'STU001', subject: 'Science', score: 82, grade: 'A-', term: 'Term 1, 2024', teacher: 'Mr. Johnson', comment: 'Excellent in practicals', date: '2024-03-15' },
    { studentId: 'STU001', subject: 'History', score: 71, grade: 'B', term: 'Term 1, 2024', teacher: 'Mrs. Davis', comment: 'Good effort', date: '2024-03-15' },
    { studentId: 'STU002', subject: 'Mathematics', score: 92, grade: 'A', term: 'Term 1, 2024', teacher: 'Mr. Doe', comment: 'Outstanding', date: '2024-03-15' },
    { studentId: 'STU002', subject: 'English', score: 88, grade: 'A-', term: 'Term 1, 2024', teacher: 'Ms. Smith', comment: 'Very good', date: '2024-03-15' }
];

window.attendanceRecords = [
    { studentId: 'STU001', date: '2024-03-18', status: 'present', reason: '' },
    { studentId: 'STU001', date: '2024-03-17', status: 'present', reason: '' },
    { studentId: 'STU001', date: '2024-03-16', status: 'late', reason: 'Traffic' },
    { studentId: 'STU002', date: '2024-03-18', status: 'present', reason: '' }
];

window.feeRecords = [
    { studentId: 'STU001', term: 'Term 1, 2024', amount: 45000, paid: 30000, status: 'partial', dueDate: '2024-04-15', payments: [{ date: '2024-01-15', amount: 30000, method: 'MPesa' }] },
    { studentId: 'STU002', term: 'Term 1, 2024', amount: 45000, paid: 45000, status: 'paid', dueDate: '2024-04-15', payments: [{ date: '2024-01-10', amount: 45000, method: 'Bank' }] }
];

window.teacherComments = [
    { studentId: 'STU001', teacherId: 'TCH001', comment: 'Emma is improving in algebra', date: '2024-03-15', type: 'general' }
];

window.assignments = [
    { id: 'ASN001', class: '10A', subject: 'Mathematics', title: 'Algebra Worksheet', dueDate: '2024-03-25', description: 'Complete questions 1-20' },
    { id: 'ASN002', class: '10A', subject: 'Science', title: 'Lab Report', dueDate: '2024-03-26', description: 'Write report on plant growth' }
];

window.messages = [
    { id: 1, from: 'admin', to: 'teachers', subject: 'Staff Meeting', content: 'Meeting on Friday at 2pm', sent: '2024-03-18', status: 'sent' },
    { id: 2, from: 'admin', to: 'parents', subject: 'Fee Reminder', content: 'Term 1 fees due by April 15th', sent: '2024-03-18', status: 'sent' }
];

window.alerts = [
    { id: 1, type: 'academic', for: 'STU001', message: 'Emma needs help with Mathematics', date: '2024-03-18', severity: 'warning' },
    { id: 2, type: 'attendance', for: 'STU001', message: '3 late arrivals this term', date: '2024-03-18', severity: 'info' },
    { id: 3, type: 'fee', for: 'STU001', message: 'Fee balance of KSh 15,000', date: '2024-03-18', severity: 'critical' }
];

window.bullyingReports = [
    { id: 1, from: 'STU001', message: 'Feeling uncomfortable in class', date: '2024-03-17', status: 'pending' }
];

window.auditLogs = [
    { id: 1, user: 'ADMIN001', action: 'Login', timestamp: '2024-03-18 08:00:00', ip: '192.168.1.100' }
];

window.learningMaterials = [
    { id: 1, subject: 'Mathematics', title: 'Algebra Basics', type: 'video', url: '#', class: '10A' },
    { id: 2, subject: 'Mathematics', title: 'Formula Sheet', type: 'pdf', url: '#', class: '10A' },
    { id: 3, subject: 'Science', title: 'Cell Biology', type: 'notes', url: '#', class: '10A' }
];

window.chatMessages = {
    ai: [{ id: 1, sender: 'AI', text: 'Hi! I\'m your AI tutor. How can I help you today?', time: '10:00 AM', avatar: 'AI' }],
    private: [{ id: 1, sender: 'You', to: 'Sarah', text: 'Hi, can you help with math?', time: '09:30 AM', avatar: 'Y' }],
    group: [{ id: 1, sender: 'John (10A)', text: 'Anyone working on homework?', time: '09:30 AM', avatar: 'J' }]
};

window.reminders = [
    { id: 1, user: 'STU001', title: 'Math homework', time: '2024-03-19T15:00', type: 'homework' }
];

window.studySessions = [
    { id: 1, studentId: 'STU001', subject: 'Mathematics', duration: 30, completed: true, date: '2024-03-18' }
];

// Education tips
window.educationTips = [
    "Regular communication with teachers improves student performance by 40%.",
    "Students who study 30 minutes daily score 20% higher on average.",
    "The 8-4-4 system emphasizes exams while CBC focuses on competencies.",
    "Attendance below 80% significantly impacts academic performance.",
    "Parental involvement increases student motivation by 50%.",
    "Setting a regular study schedule improves time management.",
    "AI-powered study sessions can improve retention by 35%.",
    "Fee payment deadlines: Term 1 - April 15, Term 2 - August 15, Term 3 - December 15."
];