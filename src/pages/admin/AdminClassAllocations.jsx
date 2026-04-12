import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDataContext } from '../../context/DataContext';

const AdminClassAllocations = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { classes, teachers, students, refreshData } = useDataContext();

    const [activeRole, setActiveRole] = useState('teachers'); // 'teachers' | 'students'
    const [searchAssigned, setSearchAssigned] = useState('');
    const [searchUnassigned, setSearchUnassigned] = useState('');

    const [selectedTeacherIds, setSelectedTeacherIds] = useState(new Set());
    const [selectedStudentIds, setSelectedStudentIds] = useState(new Set());
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error'

    const cls = classes.find(c => String(c.id) === id || String(c._id) === id);

    // Initialize state from database snapshot
    useEffect(() => {
        if (!cls) return;

        const assignedTeachers = teachers
            .filter(t => (t.assignedClasses || []).some(cid => String(cid) === String(cls.id) || String(cid) === String(cls._id)))
            .map(t => t._id);

        const assignedStudents = students
            .filter(s => String(s.classId) === String(cls.id) || String(s.classId) === String(cls._id))
            .map(s => s._id);

        setSelectedTeacherIds(new Set(assignedTeachers));
        setSelectedStudentIds(new Set(assignedStudents));
    }, [cls, teachers, students, id]);

    if (!cls) {
        return (
            <div className="contentWrapper smooth-mount" style={{ textAlign: 'center', paddingTop: 60 }}>
                <h2>Class Not Found</h2>
                <button className="primaryBtn" onClick={() => navigate('/admin/classes')} style={{ marginTop: 20 }}>Return to Classes</button>
            </div>
        );
    }

    const toggleTeacher = (teacherId) => {
        setSelectedTeacherIds(prev => {
            const next = new Set(prev);
            next.has(teacherId) ? next.delete(teacherId) : next.add(teacherId);
            return next;
        });
    };

    const toggleStudent = (studentId) => {
        setSelectedStudentIds(prev => {
            const next = new Set(prev);
            next.has(studentId) ? next.delete(studentId) : next.add(studentId);
            return next;
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveStatus(null);
        
        try {
            // Save Teachers
            const teacherSaves = teachers.map(async (teacher) => {
                const currentIds = new Set((teacher.assignedClasses || []).map(cid => String(cid)));
                const isSelected = selectedTeacherIds.has(teacher._id);
                const hasClass = currentIds.has(String(cls.id)) || currentIds.has(String(cls._id));

                if (isSelected === hasClass) return;

                let newClassIds;
                if (isSelected) {
                    newClassIds = [...currentIds, String(cls.id || cls._id)];
                } else {
                    newClassIds = [...currentIds].filter(cid => cid !== String(cls.id) && cid !== String(cls._id));
                }

                await fetch(`http://localhost:5000/api/teachers/${teacher._id}/classes`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ classIds: newClassIds })
                });
            });

            // Save Students
            const studentSaves = students.map(async (student) => {
                const isSelected = selectedStudentIds.has(student._id);
                const hasClass = String(student.classId) === String(cls.id) || String(student.classId) === String(cls._id);

                if (isSelected === hasClass) return;

                const newClassId = isSelected ? String(cls.id || cls._id) : null;

                await fetch(`http://localhost:5000/api/students/${student._id}/class`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ classId: newClassId })
                });
            });

            await Promise.all([...teacherSaves, ...studentSaves]);
            setSaveStatus('success');
            await refreshData();
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (e) {
            console.error(e);
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    // Filter Logic for Dual Panes
    const isTeacher = activeRole === 'teachers';
    const rawEntities = isTeacher ? teachers : students;
    const selectedSet = isTeacher ? selectedTeacherIds : selectedStudentIds;

    const queryAssigned = searchAssigned.toLowerCase();
    const assignedList = rawEntities.filter(e => {
        if (!selectedSet.has(e._id)) return false;
        const searchField = isTeacher ? e.empId : e.rollNo;
        return e.name.toLowerCase().includes(queryAssigned) || (searchField && searchField.toLowerCase().includes(queryAssigned));
    });

    const queryUnassigned = searchUnassigned.toLowerCase();
    const unassignedList = rawEntities.filter(e => {
        if (selectedSet.has(e._id)) return false;
        const searchField = isTeacher ? e.empId : e.rollNo;
        return e.name.toLowerCase().includes(queryUnassigned) || (searchField && searchField.toLowerCase().includes(queryUnassigned));
    });

    return (
        <div className="contentWrapper smooth-mount">
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                <div>
                    <button className="textBtn" onClick={() => navigate('/admin/classes')} style={{ padding: 0, marginBottom: 8 }}>
                        ← Back to Classes
                    </button>
                    <h1 style={{ color: 'white', fontSize: 28, margin: 0 }}>⚙️ Allocations</h1>
                    <p style={{ color: '#8892b0', fontSize: 14, margin: '4px 0 0' }}>
                        Managing assignments for <strong style={{ color: '#a5b4fc' }}>{cls.name}</strong>
                    </p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {saveStatus === 'success' && <span style={{ color: '#10b981', fontWeight: 600 }}>✅ Saved successfully!</span>}
                    {saveStatus === 'error' && <span style={{ color: '#ef4444', fontWeight: 600 }}>❌ Error saving</span>}
                    <button className="primaryBtn" onClick={handleSave} disabled={isSaving} style={{ padding: '10px 24px' }}>
                        {isSaving ? '⏳ Saving...' : '💾 Save Allocations'}
                    </button>
                </div>
            </div>

            {/* Master Role Toggle */}
            <div className="customTabs" style={{ marginBottom: 24, maxWidth: 400 }}>
                <button
                    className={`customTab ${activeRole === 'teachers' ? 'active' : ''}`}
                    onClick={() => setActiveRole('teachers')}
                >
                    👨‍🏫 Teachers ({selectedTeacherIds.size})
                </button>
                <button
                    className={`customTab ${activeRole === 'students' ? 'active' : ''}`}
                    onClick={() => setActiveRole('students')}
                >
                    👨‍🎓 Students ({selectedStudentIds.size})
                </button>
            </div>

            {/* Dual Pane Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 24, alignItems: 'start' }}>
                
                {/* Left Pane: Assigned */}
                <div className="card" style={{ padding: 24, borderTop: '4px solid #10b981' }}>
                    <h3 style={{ color: 'white', margin: '0 0 16px', fontSize: 18 }}>✅ Currently Assigned</h3>
                    <input 
                        type="text"
                        className="login-input"
                        placeholder="Search assigned users..."
                        value={searchAssigned}
                        onChange={e => setSearchAssigned(e.target.value)}
                        style={{ marginBottom: 16 }}
                    />
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: 'calc(100vh - 360px)', overflowY: 'auto', paddingRight: 8 }}>
                        {assignedList.length === 0 ? (
                            <p style={{ color: '#64748b', fontStyle: 'italic', textAlign: 'center', marginTop: 32 }}>No {activeRole} assigned to this class.</p>
                        ) : assignedList.map(e => (
                            <div key={e._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 8 }}>
                                <div>
                                    <div style={{ color: 'white', fontWeight: 600 }}>{e.name}</div>
                                    <div style={{ color: '#8892b0', fontSize: 12, marginTop: 4 }}>
                                        {isTeacher ? `Dept: ${e.dept} · ID: ${e.empId}` : `Roll: ${e.rollNo} · Branch: ${e.branch || 'N/A'}`}
                                    </div>
                                </div>
                                <button className="secondaryBtn" style={{ borderColor: 'rgba(239,68,68,0.4)', color: '#fca5a5', padding: '6px 12px' }} onClick={() => isTeacher ? toggleTeacher(e._id) : toggleStudent(e._id)}>
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Pane: Unassigned */}
                <div className="card" style={{ padding: 24, borderTop: '4px solid #6366f1' }}>
                    <h3 style={{ color: 'white', margin: '0 0 16px', fontSize: 18 }}>📋 Available to Assign</h3>
                    <input 
                        type="text"
                        className="login-input"
                        placeholder="Search unassigned users..."
                        value={searchUnassigned}
                        onChange={e => setSearchUnassigned(e.target.value)}
                        style={{ marginBottom: 16 }}
                    />
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: 'calc(100vh - 360px)', overflowY: 'auto', paddingRight: 8 }}>
                        {unassignedList.length === 0 ? (
                            <p style={{ color: '#64748b', fontStyle: 'italic', textAlign: 'center', marginTop: 32 }}>All {activeRole} are already assigned to this class.</p>
                        ) : unassignedList.map(e => {
                            const isAssignedElsewhere = !isTeacher && e.classId;
                            return (
                                <div key={e._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: 8 }}>
                                    <div>
                                        <div style={{ color: 'white', fontWeight: 600 }}>{e.name}</div>
                                        <div style={{ color: '#8892b0', fontSize: 12, marginTop: 4 }}>
                                            {isTeacher ? `Dept: ${e.dept} · ID: ${e.empId}` : `Roll: ${e.rollNo} · Branch: ${e.branch || 'N/A'}`}
                                            {isAssignedElsewhere && <span style={{ color: '#fca5a5' }}> (Currently in Class: {e.classId})</span>}
                                        </div>
                                    </div>
                                    <button className="primaryBtn" style={{ padding: '6px 12px' }} onClick={() => isTeacher ? toggleTeacher(e._id) : toggleStudent(e._id)}>
                                        Add
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminClassAllocations;
