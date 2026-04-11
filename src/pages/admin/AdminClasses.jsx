import React, { useState } from 'react';
import { useDataContext } from '../../context/DataContext';

const AdminClasses = () => {
    const { classes, teachers, students } = useDataContext();

    // Create class modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newClassName, setNewClassName] = useState('');
    const [createStatus, setCreateStatus] = useState(null);

    // Allocation modal
    const [allocModal, setAllocModal] = useState(null); // { cls, selectedTeacherIds: Set }
    const [allocStatus, setAllocStatus] = useState(null); // 'saving' | 'success' | 'error'

    // ── Create Class ─────────────────────────────────────────────
    const handleCreateClass = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/classes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newClassName })
            });
            if (res.ok) {
                setCreateStatus('success');
                setNewClassName('');
                setTimeout(() => { setIsAddModalOpen(false); setCreateStatus(null); }, 1500);
            } else {
                setCreateStatus('error');
            }
        } catch {
            setCreateStatus('error');
        }
    };

    // ── Open Allocation Modal ────────────────────────────────────
    const openAllocModal = (cls) => {
        // Pre-populate with teachers already assigned to this class
        const alreadyAssigned = teachers
            .filter(t => (t.assignedClasses || []).some(id => String(id) === String(cls.id)))
            .map(t => t._id);
        setAllocModal({ cls, selectedIds: new Set(alreadyAssigned) });
        setAllocStatus(null);
    };

    const toggleTeacher = (teacherId) => {
        setAllocModal(prev => {
            const next = new Set(prev.selectedIds);
            next.has(teacherId) ? next.delete(teacherId) : next.add(teacherId);
            return { ...prev, selectedIds: next };
        });
    };

    // ── Save Allocations ─────────────────────────────────────────
    // Strategy: for each teacher, compute the NEW set of classIds they should have.
    // If the teacher is selected → ensure cls.id is in their list.
    // If deselected → remove cls.id from their list.
    const handleSaveAllocations = async () => {
        setAllocStatus('saving');
        const cls = allocModal.cls;
        const selectedIds = allocModal.selectedIds;

        try {
            const saves = teachers.map(async (teacher) => {
                const currentIds = new Set(
                    (teacher.assignedClasses || []).map(id => String(id))
                );
                const isSelected = selectedIds.has(teacher._id);
                const hasClass = currentIds.has(String(cls.id));

                // Skip if no change needed for this teacher
                if (isSelected === hasClass) return;

                // Build updated class list for this teacher
                let newClassIds;
                if (isSelected) {
                    newClassIds = [...currentIds, String(cls.id)];
                } else {
                    newClassIds = [...currentIds].filter(id => id !== String(cls.id));
                }

                await fetch(`http://localhost:5000/api/teachers/${teacher._id}/classes`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ classIds: newClassIds })
                });
            });

            await Promise.all(saves);
            setAllocStatus('success');
            setTimeout(() => { setAllocModal(null); setAllocStatus(null); }, 1400);
        } catch {
            setAllocStatus('error');
        }
    };

    return (
        <div className="contentWrapper smooth-mount">

            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ color: 'white', fontSize: 28, marginBottom: 6 }}>🏫 Classes & Departments</h1>
                <p style={{ color: '#8892b0', fontSize: 14 }}>Create classes and assign teachers to manage academic allocation.</p>
            </div>

            {/* Create Class Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
                <button className="primaryBtn" onClick={() => { setIsAddModalOpen(true); setCreateStatus(null); }}>
                    + Create Class
                </button>
            </div>

            {/* Classes Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="dataTable">
                    <thead>
                        <tr>
                            <th>Class ID</th>
                            <th>Class Name</th>
                            <th>Assigned Teachers</th>
                            <th>Students</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classes.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="adminNoResults">No classes found. Create one above.</td>
                            </tr>
                        ) : classes.map(cls => {
                            const clsTeachers = teachers.filter(t =>
                                (t.assignedClasses || []).some(id => String(id) === String(cls.id))
                            );
                            const clsStudents = students.filter(s => String(s.classId) === String(cls.id));

                            return (
                                <tr key={cls.id || cls._id}>
                                    <td style={{ color: '#64748b', fontSize: 13 }}>{cls.id || cls._id}</td>
                                    <td style={{ color: 'white', fontWeight: 600 }}>{cls.name}</td>
                                    <td>
                                        {clsTeachers.length > 0 ? (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                                {clsTeachers.map(t => (
                                                    <span key={t._id} className="badge">{t.name}</span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span style={{ color: '#475569', fontStyle: 'italic', fontSize: 13 }}>Unassigned</span>
                                        )}
                                    </td>
                                    <td style={{ color: '#42cab3', fontWeight: 600 }}>
                                        {clsStudents.length}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button className="textBtn" onClick={() => openAllocModal(cls)}>
                                            ⚙️ Manage Allocations
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* ── Create Class Modal ── */}
            {isAddModalOpen && (
                <div className="modalOverlay" onClick={() => setIsAddModalOpen(false)}>
                    <div className="modalContent glassCard" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
                        <h2>🏫 Create New Class</h2>
                        <p style={{ color: '#8892b0', fontSize: 13, margin: '4px 0 20px' }}>
                            The class will be immediately available for teacher allocation.
                        </p>
                        <form onSubmit={handleCreateClass} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div>
                                <label className="formLabel">Class Name</label>
                                <input
                                    className="login-input"
                                    placeholder="e.g. Year 2 - EEE A"
                                    value={newClassName}
                                    onChange={e => setNewClassName(e.target.value)}
                                    required
                                />
                            </div>
                            {createStatus === 'success' && <p style={{ color: '#10b981', fontSize: 13, margin: 0 }}>✅ Class created! Refresh to see it.</p>}
                            {createStatus === 'error'   && <p style={{ color: '#ef4444', fontSize: 13, margin: 0 }}>❌ Failed. Is the server running?</p>}
                            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 4 }}>
                                <button type="button" className="secondaryBtn" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                                <button type="submit" className="primaryBtn">Create Class</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Allocation Modal ── */}
            {allocModal && (
                <div className="modalOverlay" onClick={() => setAllocModal(null)}>
                    <div className="modalContent glassCard" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
                        <h2>⚙️ Manage Allocations</h2>
                        <p style={{ color: '#8892b0', fontSize: 13, margin: '4px 0 4px' }}>
                            Class: <strong style={{ color: '#a5b4fc' }}>{allocModal.cls.name}</strong>
                        </p>
                        <p style={{ color: '#8892b0', fontSize: 13, margin: '0 0 20px' }}>
                            Select which teachers should be assigned to this class.
                        </p>

                        {teachers.length === 0 ? (
                            <p style={{ color: '#475569', fontStyle: 'italic', textAlign: 'center', padding: '24px 0' }}>
                                No teachers in the system yet. Add teachers first.
                            </p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 340, overflowY: 'auto', paddingRight: 4 }}>
                                {teachers.map(t => {
                                    const isSelected = allocModal.selectedIds.has(t._id);
                                    return (
                                        <label
                                            key={t._id}
                                            className={`allocRow ${isSelected ? 'allocRowSelected' : ''}`}
                                            onClick={() => toggleTeacher(t._id)}
                                        >
                                            <div className="allocCheckbox">
                                                {isSelected && <span className="allocCheckmark">✓</span>}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ color: 'white', fontWeight: 600, fontSize: 15 }}>{t.name}</div>
                                                <div style={{ color: '#8892b0', fontSize: 12, marginTop: 2 }}>
                                                    {t.dept} · ID: {t.empId}
                                                </div>
                                            </div>
                                            {isSelected && (
                                                <span className="badge" style={{ alignSelf: 'center' }}>Assigned</span>
                                            )}
                                        </label>
                                    );
                                })}
                            </div>
                        )}

                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 20, paddingTop: 16 }}>
                            {allocStatus === 'saving'  && <p style={{ color: '#f59e0b', fontSize: 13, marginBottom: 12 }}>⏳ Saving allocations…</p>}
                            {allocStatus === 'success' && <p style={{ color: '#10b981', fontSize: 13, marginBottom: 12 }}>✅ Allocations saved! Refresh to see changes.</p>}
                            {allocStatus === 'error'   && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>❌ Save failed. Is the server running?</p>}
                            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                                <button className="secondaryBtn" onClick={() => setAllocModal(null)}>Cancel</button>
                                <button
                                    className="primaryBtn"
                                    onClick={handleSaveAllocations}
                                    disabled={allocStatus === 'saving'}
                                >
                                    Save Allocations
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminClasses;
