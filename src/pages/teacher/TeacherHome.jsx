import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataContext } from '../../context/DataContext';

const TeacherHome = () => {
  const navigate = useNavigate();
  const { 
    currentUser, 
    classes, 
    students, 
    assignments, 
    submissions, 
    teachers 
  } = useDataContext();

  // 1. Identify current teacher profile
  const teacherProfile = useMemo(() => {
    return teachers.find(t => t.empId === currentUser.id) || {
      name: 'Faculty Member',
      dept: 'Computer Science',
      assignedClasses: []
    };
  }, [teachers, currentUser.id]);

  // 2. Derive dashboard statistics
  const stats = useMemo(() => {
    const assignedClassIds = teacherProfile.assignedClasses.map(id => String(id));
    
    // Total Classes
    const myClasses = classes.filter(c => assignedClassIds.includes(String(c.id)));
    
    // Total Students under this teacher
    const myStudents = students.filter(s => assignedClassIds.includes(String(s.classId)));
    
    // Total Assignments created for these classes
    const myAssignments = assignments.filter(a => assignedClassIds.includes(String(a.classId)));
    const myAssignmentIds = myAssignments.map(a => String(a.id));
    
    // Pending Submissions (ungraded) for teacher's assignments
    const pendingSubmissions = submissions.filter(s => 
      myAssignmentIds.includes(String(s.assignmentId)) && 
      s.status === 'Submitted' && 
      !s.graded
    );

    return {
      classesCount: myClasses.length,
      studentsCount: myStudents.length,
      assignmentsCount: myAssignments.length,
      pendingCount: pendingSubmissions.length,
      recentPending: pendingSubmissions.sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate)).slice(0, 5)
    };
  }, [teacherProfile, classes, students, assignments, submissions]);

  const statCards = [
    { label: 'Assigned Classes', value: stats.classesCount, icon: '🏫', color: '#42cab3ff', path: '/teacher/classes' },
    { label: 'Total Students', value: stats.studentsCount, icon: '👥', color: '#64ffda', path: '/teacher/class-results' },
    { label: 'Active Assignments', value: stats.assignmentsCount, icon: '📝', color: '#ffd700', path: '/teacher/classes' },
    { label: 'Pending Grades', value: stats.pendingCount, icon: '⚖️', color: '#ff4d4d', path: '/teacher/grade-assignment' },
  ];

  return (
    <div className="contentWrapper">
      {/* Welcome Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ color: 'white', fontSize: 28, marginBottom: 8 }}>Welcome back, {teacherProfile.name}!</h1>
        <p style={{ color: '#8892b0', fontSize: 16 }}>
          You have <strong style={{ color: '#ff4d4d' }}>{stats.pendingCount}</strong> submissions waiting to be graded.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="statsGrid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: 20, 
        marginBottom: 32 
      }}>
        {statCards.map(card => (
          <div 
            key={card.label} 
            className="card" 
            style={{ 
              padding: 24, 
              borderBottom: `3px solid ${card.color}`
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 12 }}>{card.icon}</div>
            <div style={{ color: '#8892b0', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{card.label}</div>
            <div style={{ color: 'white', fontSize: 28, fontWeight: 'bold' }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, alignItems: 'start' }}>
        
        {/* Recent Submissions */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ color: 'white', fontSize: 18, margin: 0 }}>📊 Recent Submissions</h3>
            <span 
              onClick={() => navigate('/teacher/grade-assignment')}
              style={{ color: '#42cab3ff', fontSize: 13, cursor: 'pointer' }}
            >View all →</span>
          </div>
          
          {stats.recentPending.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {stats.recentPending.map(sub => {
                const student = students.find(s => String(s.id) === String(sub.studentId));
                const assignment = assignments.find(a => String(a.id) === String(sub.assignmentId));
                return (
                  <div 
                    key={sub.id} 
                    style={{ 
                      padding: '12px 16px', 
                      background: '#112240', 
                      borderRadius: 8,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{student?.name || 'Unknown Student'}</div>
                      <div style={{ color: '#8892b0', fontSize: 12 }}>{assignment?.title || 'Unknown Assignment'}</div>
                    </div>
                    <button 
                      className="dash-btn dash-btn-secondary dash-btn-small" 
                      onClick={() => navigate('/teacher/grade-assignment')}
                    >
                      <span>📝</span> Grade Now
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#8892b0' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
              <p>Everything is graded! Good job.</p>
            </div>
          )}
        </div>

        {/* Quick Actions & Profile Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Quick Actions */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ color: 'white', fontSize: 18, marginBottom: 20 }}>⚡ Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button 
                className="dash-btn dash-btn-primary" 
                style={{ width: '100%', justifyContent: 'flex-start' }} 
                onClick={() => navigate('/teacher/classes')}
              >
                <span>➕</span> New Assignment
              </button>
              <button 
                className="dash-btn dash-btn-secondary" 
                style={{ width: '100%', justifyContent: 'flex-start' }} 
                onClick={() => navigate('/teacher/notes')}
              >
                <span>📂</span> Upload Notes
              </button>
              <button 
                className="dash-btn dash-btn-secondary" 
                style={{ width: '100%', justifyContent: 'flex-start' }} 
                onClick={() => navigate('/teacher/search-student')}
              >
                <span>🔍</span> Search Student
              </button>
            </div>
          </div>

          {/* Profile Sidebar */}
          <div className="card" style={{ padding: 24, background: 'rgba(66, 202, 179, 0.05)' }}>
            <h4 style={{ color: 'white', margin: '0 0 16px 0' }}>Professional Info</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ color: '#8892b0', fontSize: 11, textTransform: 'uppercase' }}>Department</div>
                <div style={{ color: 'white', fontSize: 13 }}>{teacherProfile.dept}</div>
              </div>
              <div>
                <div style={{ color: '#8892b0', fontSize: 11, textTransform: 'uppercase' }}>Employee ID</div>
                <div style={{ color: 'white', fontSize: 13 }}>{currentUser.id}</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TeacherHome;