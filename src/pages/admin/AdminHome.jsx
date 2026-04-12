import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataContext } from '../../context/DataContext';

const AdminHome = () => {
    const navigate = useNavigate();
    const { students, teachers, classes } = useDataContext();

    const statCards = [
        { label: 'Total Students', value: students.length, icon: '👨‍🎓', color: '#42cab3' },
        { label: 'Total Teachers', value: teachers.length, icon: '👨‍🏫', color: '#6366f1' },
        { label: 'Total Classes',  value: classes.length,  icon: '🏫',  color: '#f59e0b' },
    ];

    // Per-class breakdown
    const classBreakdown = useMemo(() => {
        return classes.map(cls => {
            const clsStudents = students.filter(s => String(s.classId) === String(cls.id));
            const clsTeachers = teachers.filter(t =>
                (t.assignedClasses || []).some(id => String(id) === String(cls.id))
            );
            return {
                name:     cls.name,
                students: clsStudents.length,
                teachers: clsTeachers.map(t => t.name).join(', ') || '—',
            };
        });
    }, [classes, students, teachers]);

    // Teachers summary (name + assigned classes)
    const teachersSummary = useMemo(() => {
        return teachers.map(t => {
            const assignedNames = (t.assignedClasses || [])
                .map(id => {
                    const cls = classes.find(c => String(c.id) === String(id));
                    return cls ? cls.name : null;
                })
                .filter(Boolean);
            return {
                name: t.name,
                dept: t.dept || '—',
                classes: assignedNames.join(', ') || 'None assigned',
            };
        });
    }, [teachers, classes]);

    return (
        <div className="contentWrapper">

            {/* Welcome Header */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ color: 'white', fontSize: 28, marginBottom: 8 }}>
                    Welcome, <span style={{ color: '#a855f7' }}>Administrator</span> 🛡️
                </h1>
                <p style={{ color: '#8892b0', fontSize: 14 }}>
                    Platform-wide overview — {students.length} students, {teachers.length} teachers across {classes.length} classes.
                </p>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
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

            {/* Bottom grid: Class Breakdown + Right Column */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, alignItems: 'start' }}>

                {/* Class Breakdown Table */}
                <div className="card" style={{ padding: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h3 style={{ color: 'white', fontSize: 18, margin: 0 }}>🏫 Class Breakdown</h3>
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
                                    {['Class', 'Teacher(s)', 'Students'].map(h => (
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
                                onClick={() => navigate('/admin/students')}
                            >
                                <span>👤</span> Manage Students
                            </button>
                            <button
                                className="dash-btn dash-btn-secondary"
                                style={{ width: '100%', justifyContent: 'flex-start' }}
                                onClick={() => navigate('/admin/teachers')}
                            >
                                <span>👨‍🏫</span> Manage Teachers
                            </button>
                            <button
                                className="dash-btn dash-btn-secondary"
                                style={{ width: '100%', justifyContent: 'flex-start' }}
                                onClick={() => navigate('/admin/classes')}
                            >
                                <span>🏫</span> Manage Classes
                            </button>
                        </div>
                    </div>

                    {/* Teachers Overview */}
                    <div className="card" style={{ padding: 24, background: 'rgba(168, 85, 247, 0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h4 style={{ color: 'white', margin: 0 }}>👨‍🏫 Teachers</h4>
                            <span
                                onClick={() => navigate('/admin/users')}
                                style={{ color: '#a855f7', fontSize: 12, cursor: 'pointer' }}
                            >
                                View all →
                            </span>
                        </div>
                        {teachersSummary.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {teachersSummary.slice(0, 5).map((t, i) => (
                                    <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 10 }}>
                                        <div style={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{t.name}</div>
                                        <div style={{ color: '#8892b0', fontSize: 11, marginTop: 2 }}>{t.dept}</div>
                                        <div style={{ color: '#6366f1', fontSize: 11, marginTop: 2 }}>{t.classes}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: '#8892b0', fontSize: 13 }}>No teachers found.</p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminHome;
