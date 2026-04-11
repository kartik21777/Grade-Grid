import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataContext } from '../../context/DataContext';

const AdminHome = () => {
    const navigate = useNavigate();
    const { students, teachers, classes, assignments, submissions } = useDataContext();

    // Derived stats
    const stats = useMemo(() => {
        const totalSubmissions = submissions.length;
        const gradedSubmissions = submissions.filter(s => s.graded).length;
        const pendingGrades = submissions.filter(s => s.status === 'Submitted' && !s.graded).length;
        const gradingRate = totalSubmissions > 0
            ? ((gradedSubmissions / totalSubmissions) * 100).toFixed(0)
            : 0;

        return { totalSubmissions, gradedSubmissions, pendingGrades, gradingRate };
    }, [submissions]);

    const statCards = [
        { label: 'Total Students',  value: students.length,    icon: '👨‍🎓', color: '#42cab3' },
        { label: 'Total Teachers',  value: teachers.length,    icon: '👨‍🏫', color: '#6366f1' },
        { label: 'Total Classes',   value: classes.length,     icon: '🏫',  color: '#f59e0b' },
        { label: 'Assignments',     value: assignments.length, icon: '📋',  color: '#3b82f6' },
        { label: 'Pending Grades',  value: stats.pendingGrades, icon: '⚖️', color: '#ef4444' },
    ];

    // Per-class breakdown for the activity table
    const classBreakdown = useMemo(() => {
        return classes.map(cls => {
            const clsStudents  = students.filter(s => String(s.classId) === String(cls.id));
            const clsAssign    = assignments.filter(a => String(a.classId) === String(cls.id));
            const clsSubmit    = submissions.filter(s =>
                clsAssign.some(a => String(a.id) === String(s.assignmentId))
            );
            const clsTeachers  = teachers.filter(t =>
                (t.assignedClasses || []).some(id => String(id) === String(cls.id))
            );
            return {
                name:      cls.name,
                students:  clsStudents.length,
                teachers:  clsTeachers.map(t => t.name).join(', ') || '—',
                assignments: clsAssign.length,
                submissions: clsSubmit.length,
            };
        });
    }, [classes, students, teachers, assignments, submissions]);

    const handleExport = () => {
        const data = { students, teachers, classes, assignments, submissions };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `gradegrid_export_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="contentWrapper">

            {/* Welcome Header */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ color: 'white', fontSize: 28, marginBottom: 8 }}>
                    Welcome, <span style={{ color: '#a855f7' }}>Administrator</span> 🛡️
                </h1>
                <p style={{ color: '#8892b0', fontSize: 14 }}>
                    Platform-wide overview — {students.length} students across {classes.length} classes.
                    {stats.pendingGrades > 0 && (
                        <> <strong style={{ color: '#ef4444' }}>{stats.pendingGrades} submissions</strong> are awaiting grades.</>
                    )}
                </p>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
                {statCards.map(card => (
                    <div
                        key={card.label}
                        className="card"
                        style={{ padding: '20px', textAlign: 'center', borderTop: `3px solid ${card.color}` }}
                    >
                        <div style={{ fontSize: 28, marginBottom: 8 }}>{card.icon}</div>
                        <div style={{ color: card.color, fontSize: 30, fontWeight: 'bold' }}>{card.value}</div>
                        <div style={{ color: '#8892b0', fontSize: 13, marginTop: 4 }}>{card.label}</div>
                    </div>
                ))}
            </div>

            {/* Bottom grid: Activity Table + Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, alignItems: 'start' }}>

                {/* Class Activity Table */}
                <div className="card" style={{ padding: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h3 style={{ color: 'white', fontSize: 18, margin: 0 }}>🏫 Class Activity</h3>
                        <span
                            onClick={() => navigate('/admin/classes')}
                            style={{ color: '#a855f7', fontSize: 13, cursor: 'pointer' }}
                        >
                            Manage classes →
                        </span>
                    </div>

                    {classBreakdown.length > 0 ? (
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    {['Class', 'Teacher(s)', 'Students', 'Assignments', 'Submissions'].map(h => (
                                        <th key={h} style={{ color: '#8892b0', fontWeight: 600, padding: '8px 10px', textAlign: 'left', textTransform: 'uppercase', fontSize: 11, letterSpacing: 0.5 }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {classBreakdown.map((row, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ color: 'white', padding: '12px 10px', fontWeight: 600 }}>{row.name}</td>
                                        <td style={{ color: '#8892b0', padding: '12px 10px' }}>{row.teachers}</td>
                                        <td style={{ color: '#42cab3', padding: '12px 10px', fontWeight: 700 }}>{row.students}</td>
                                        <td style={{ color: '#f59e0b', padding: '12px 10px', fontWeight: 700 }}>{row.assignments}</td>
                                        <td style={{ color: '#6366f1', padding: '12px 10px', fontWeight: 700 }}>{row.submissions}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '20px 0', color: '#8892b0' }}>
                            <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                            <p>No classes found.</p>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                    {/* Quick Actions */}
                    <div className="card" style={{ padding: 24 }}>
                        <h3 style={{ color: 'white', fontSize: 18, marginBottom: 20, margin: '0 0 20px 0' }}>⚡ Quick Actions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <button
                                className="dash-btn dash-btn-primary"
                                style={{ width: '100%', justifyContent: 'flex-start' }}
                                onClick={() => navigate('/admin/users')}
                            >
                                <span>👤</span> Manage Users
                            </button>
                            <button
                                className="dash-btn dash-btn-secondary"
                                style={{ width: '100%', justifyContent: 'flex-start' }}
                                onClick={() => navigate('/admin/classes')}
                            >
                                <span>🏫</span> Manage Classes
                            </button>
                            <button
                                className="dash-btn dash-btn-secondary"
                                style={{ width: '100%', justifyContent: 'flex-start' }}
                                onClick={handleExport}
                            >
                                <span>📥</span> Export Data (JSON)
                            </button>
                        </div>
                    </div>

                    {/* Platform Summary */}
                    <div className="card" style={{ padding: 24, background: 'rgba(168, 85, 247, 0.05)' }}>
                        <h4 style={{ color: 'white', margin: '0 0 16px 0' }}>📊 Platform Summary</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {[
                                { label: 'Total Submissions',  value: stats.totalSubmissions, color: '#6366f1' },
                                { label: 'Graded',             value: stats.gradedSubmissions, color: '#10b981' },
                                { label: 'Grading Rate',       value: `${stats.gradingRate}%`, color: '#f59e0b' },
                            ].map(item => (
                                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ color: '#8892b0', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.label}</div>
                                    <div style={{ color: item.color, fontWeight: 700, fontSize: 15 }}>{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminHome;
