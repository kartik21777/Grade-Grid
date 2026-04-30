import React, { useState, useMemo, useEffect } from 'react';
import { useDataContext } from '../../context/DataContext';

const AdminAllUsers = () => {
    const { students, teachers, classes, refreshData } = useDataContext();

    const [activeTab, setActiveTab] = useState('students');
    const [searchQuery, setSearchQuery] = useState('');

    // Edit modal state
    const [editModal, setEditModal] = useState(null); // { type: 'student'|'teacher', data: {...} }
    const [editForm, setEditForm] = useState({});
    const [editStatus, setEditStatus] = useState(null); // 'success'|'error'|null

    // Delete confirm state
    const [deleteTarget, setDeleteTarget] = useState(null); // { type, _id, name }
    const [deleteStatus, setDeleteStatus] = useState(null);

    // Credentials state
    const [credentials, setCredentials] = useState([]);
    const [credLoading, setCredLoading] = useState(false);
    const [passwordModal, setPasswordModal] = useState(null); // { userId, role }
    const [newPassword, setNewPassword] = useState('');
    const [passwordStatus, setPasswordStatus] = useState(null);

    // Fetch credentials when Credentials tab is active
    useEffect(() => {
        if (activeTab === 'credentials') {
            fetchCredentials();
        }
    }, [activeTab]);

    const fetchCredentials = async () => {
        setCredLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/users');
            const data = await res.json();
            setCredentials(data);
        } catch (err) {
            console.error('Failed to fetch credentials:', err);
        }
        setCredLoading(false);
    };

    // ── Filtering ────────────────────────────────────────────────
    const q = searchQuery.toLowerCase();
    const filteredStudents = useMemo(() =>
        students.filter(s =>
            s.name?.toLowerCase().includes(q) ||
            s.rollNo?.toLowerCase().includes(q)
        ), [students, q]);

    const filteredTeachers = useMemo(() =>
        teachers.filter(t =>
            t.name?.toLowerCase().includes(q) ||
            t.empId?.toLowerCase().includes(q) ||
            t.dept?.toLowerCase().includes(q)
        ), [teachers, q]);

    const filteredCredentials = useMemo(() =>
        credentials.filter(c =>
            c.userId?.toLowerCase().includes(q) ||
            c.role?.toLowerCase().includes(q)
        ), [credentials, q]);

    // ── Edit Handlers ────────────────────────────────────────────
    const openEdit = (type, data) => {
        setEditModal({ type, data });
        setEditForm({ ...data });
        setEditStatus(null);
    };

    const handleEditChange = e => setEditForm({ ...editForm, [e.target.name]: e.target.value });

    const handleEditSave = async (e) => {
        e.preventDefault();
        const { type } = editModal;
        const id = editForm._id;
        const url = type === 'student'
            ? `http://localhost:5000/api/students/${id}`
            : `http://localhost:5000/api/teachers/${id}`;

        try {
            const res = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    type === 'student'
                        ? { name: editForm.name, rollNo: editForm.rollNo, branch: editForm.branch, classId: editForm.classId }
                        : { name: editForm.name, empId: editForm.empId, dept: editForm.dept }
                )
            });
            if (res.ok) {
                setEditStatus('success');
                await refreshData();
            } else {
                setEditStatus('error');
            }
        } catch {
            setEditStatus('error');
        }
    };

    // ── Delete Handlers ──────────────────────────────────────────
    const openDelete = (type, user) => {
        setDeleteTarget({ type, _id: user._id, name: user.name });
        setDeleteStatus(null);
    };

    const handleDelete = async () => {
        const { type, _id } = deleteTarget;
        const url = type === 'student'
            ? `http://localhost:5000/api/students/${_id}`
            : `http://localhost:5000/api/teachers/${_id}`;
        try {
            const res = await fetch(url, { method: 'DELETE' });
            if (res.ok) {
                setDeleteStatus('success');
                await refreshData();
            } else {
                setDeleteStatus('error');
            }
        } catch {
            setDeleteStatus('error');
        }
    };

    // ── Password Reset Handler ───────────────────────────────────
    const openPasswordModal = (user) => {
        setPasswordModal(user);
        setNewPassword('');
        setPasswordStatus(null);
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 4) {
            setPasswordStatus('short');
            return;
        }
        try {
            const res = await fetch(`http://localhost:5000/api/users/${passwordModal.userId}/password`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: newPassword })
            });
            if (res.ok) {
                setPasswordStatus('success');
                setTimeout(() => setPasswordModal(null), 1200);
            } else {
                setPasswordStatus('error');
            }
        } catch {
            setPasswordStatus('error');
        }
    };

    const switchTab = (tab) => {
        setActiveTab(tab);
        setSearchQuery('');
    };

    const roleBadgeStyle = (role) => {
        const colors = {
            admin: { bg: 'rgba(251, 191, 36, 0.15)', text: '#fbbf24', border: 'rgba(251, 191, 36, 0.3)' },
            teacher: { bg: 'rgba(96, 165, 250, 0.15)', text: '#60a5fa', border: 'rgba(96, 165, 250, 0.3)' },
            student: { bg: 'rgba(52, 211, 153, 0.15)', text: '#34d399', border: 'rgba(52, 211, 153, 0.3)' }
        };
        const c = colors[role] || colors.student;
        return {
            display: 'inline-block',
            padding: '3px 10px',
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 600,
            background: c.bg,
            color: c.text,
            border: `1px solid ${c.border}`,
            textTransform: 'capitalize'
        };
    };

    return (
        <>
            <div className="contentWrapper smooth-mount">

            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ color: 'white', fontSize: 28, marginBottom: 6 }}>👥 User Directory</h1>
                <p style={{ color: '#8892b0', fontSize: 14 }}>
                    View, search, edit, or remove students and teachers. Manage login credentials.
                </p>
            </div>

            {/* Toolbar: Tabs + Search */}
            <div className="adminUsersToolbar" style={{ marginBottom: 20 }}>
                <div className="customTabs">
                    <button
                        className={`customTab ${activeTab === 'students' ? 'active' : ''}`}
                        onClick={() => switchTab('students')}
                    >
                        👨‍🎓 Students ({students.length})
                    </button>
                    <button
                        className={`customTab ${activeTab === 'teachers' ? 'active' : ''}`}
                        onClick={() => switchTab('teachers')}
                    >
                        👨‍🏫 Teachers ({teachers.length})
                    </button>
                    <button
                        className={`customTab ${activeTab === 'credentials' ? 'active' : ''}`}
                        onClick={() => switchTab('credentials')}
                    >
                        🔐 Credentials ({credentials.length})
                    </button>
                </div>

                <div className="adminSearchBar">
                    <span className="adminSearchIcon">🔍</span>
                    <input
                        className="adminSearchInput"
                        placeholder={
                            activeTab === 'students' ? 'Search name or roll no…' :
                            activeTab === 'teachers' ? 'Search name, ID or dept…' :
                            'Search user ID or role…'
                        }
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button className="adminSearchClear" onClick={() => setSearchQuery('')}>✕</button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="dataTable">
                    {/* Students */}
                    {activeTab === 'students' && (
                        <>
                            <thead>
                                <tr>
                                    <th>Roll No</th>
                                    <th>Name</th>
                                    <th>Branch</th>
                                    <th>Class</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.length === 0 ? (
                                    <tr><td colSpan={5} className="adminNoResults">No students match "{searchQuery}"</td></tr>
                                ) : filteredStudents.map(s => (
                                    <tr key={s._id || s.rollNo}>
                                        <td style={{ color: '#a5b4fc', fontWeight: 600 }}>{s.rollNo}</td>
                                        <td style={{ color: 'white' }}>{s.name}</td>
                                        <td style={{ color: '#94a3b8' }}>{s.branch || '—'}</td>
                                        <td style={{ color: '#8892b0' }}>
                                            {classes.find(c => String(c.id) === String(s.classId) || String(c._id) === String(s.classId))?.name || 'Unassigned'}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                                <button className="textBtn" onClick={() => openEdit('student', s)}>✏️ Edit</button>
                                                <button className="textBtn" style={{ color: '#f87171' }} onClick={() => openDelete('student', s)}>🗑️ Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </>
                    )}

                    {/* Teachers */}
                    {activeTab === 'teachers' && (
                        <>
                            <thead>
                                <tr>
                                    <th>Emp ID</th>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Classes</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTeachers.length === 0 ? (
                                    <tr><td colSpan={5} className="adminNoResults">No teachers match "{searchQuery}"</td></tr>
                                ) : filteredTeachers.map(t => (
                                    <tr key={t._id || t.empId}>
                                        <td style={{ color: '#a5b4fc', fontWeight: 600 }}>{t.empId}</td>
                                        <td style={{ color: 'white' }}>{t.name}</td>
                                        <td style={{ color: '#8892b0' }}>{t.dept}</td>
                                        <td>
                                            {(t.assignedClasses || []).length > 0 ? (
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                                    {(t.assignedClasses || []).map((id, i) => {
                                                        const cls = classes.find(c => String(c.id) === String(id) || String(c._id) === String(id));
                                                        return <span key={i} className="badge">{cls?.name || id}</span>;
                                                    })}
                                                </div>
                                            ) : (
                                                <span style={{ color: '#475569', fontStyle: 'italic', fontSize: 13 }}>None</span>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                                <button className="textBtn" onClick={() => openEdit('teacher', t)}>✏️ Edit</button>
                                                <button className="textBtn" style={{ color: '#f87171' }} onClick={() => openDelete('teacher', t)}>🗑️ Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </>
                    )}

                    {/* Credentials */}
                    {activeTab === 'credentials' && (
                        <>
                            <thead>
                                <tr>
                                    <th>User ID</th>
                                    <th>Role</th>
                                    <th>Password</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {credLoading ? (
                                    <tr><td colSpan={4} style={{ textAlign: 'center', color: '#8892b0', padding: 32 }}>Loading credentials…</td></tr>
                                ) : filteredCredentials.length === 0 ? (
                                    <tr><td colSpan={4} className="adminNoResults">No credentials match "{searchQuery}"</td></tr>
                                ) : filteredCredentials.map(c => (
                                    <tr key={c._id}>
                                        <td style={{ color: '#a5b4fc', fontWeight: 600 }}>{c.userId}</td>
                                        <td><span style={roleBadgeStyle(c.role)}>{c.role}</span></td>
                                        <td style={{ color: '#64748b', fontFamily: 'monospace', fontSize: 13 }}>{'•'.repeat(c.password?.length || 8)}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                                <button className="textBtn" onClick={() => openPasswordModal(c)}>🔑 Reset Password</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </>
                    )}
                </table>
            </div>
        </div>

        {/* ── Edit Modal ── */}
            {editModal && (
                <div className="modalOverlay" onClick={() => setEditModal(null)}>
                    <div className="modalContent glassCard" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ marginBottom: 4 }}>
                            {editModal.type === 'student' ? '✏️ Edit Student' : '✏️ Edit Teacher'}
                        </h2>
                        <p style={{ color: '#8892b0', fontSize: 13, marginBottom: 20 }}>
                            Changes will be saved to the database.
                        </p>
                        <form onSubmit={handleEditSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {editModal.type === 'student' ? (
                                <>
                                    <div>
                                        <label className="formLabel">Full Name</label>
                                        <input name="name" className="login-input" value={editForm.name || ''} onChange={handleEditChange} required />
                                    </div>
                                    <div>
                                        <label className="formLabel">Roll Number</label>
                                        <input name="rollNo" className="login-input" value={editForm.rollNo || ''} onChange={handleEditChange} required />
                                    </div>
                                    <div>
                                        <label className="formLabel">Branch</label>
                                        <select name="branch" className="teacherAssignSelect" style={{ width: '100%' }} value={editForm.branch || ''} onChange={handleEditChange} required>
                                            <option value="">— Select Branch —</option>
                                            <option value="CSE">CSE</option>
                                            <option value="ML">ML</option>
                                            <option value="DS">DS</option>
                                            <option value="Cyber Security">Cyber Security</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="formLabel">Class</label>
                                        <select name="classId" className="teacherAssignSelect" style={{ width: '100%' }} value={editForm.classId || ''} onChange={handleEditChange}>
                                            <option value="">— Unassigned —</option>
                                            {classes.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="formLabel">Full Name</label>
                                        <input name="name" className="login-input" value={editForm.name || ''} onChange={handleEditChange} required />
                                    </div>
                                    <div>
                                        <label className="formLabel">Employee ID</label>
                                        <input name="empId" className="login-input" value={editForm.empId || ''} onChange={handleEditChange} required />
                                    </div>
                                    <div>
                                        <label className="formLabel">Department</label>
                                        <input name="dept" className="login-input" value={editForm.dept || ''} onChange={handleEditChange} required />
                                    </div>
                                </>
                            )}

                            {editStatus === 'success' && <p style={{ color: '#10b981', fontSize: 13, margin: 0 }}>✅ Saved successfully!</p>}
                            {editStatus === 'error'   && <p style={{ color: '#ef4444', fontSize: 13, margin: 0 }}>❌ Save failed. Is the server running?</p>}

                            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                                <button type="button" className="secondaryBtn" onClick={() => setEditModal(null)}>Cancel</button>
                                <button type="submit" className="primaryBtn">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Delete Confirm Modal ── */}
            {deleteTarget && (
                <div className="modalOverlay" onClick={() => setDeleteTarget(null)}>
                    <div className="modalContent glassCard" style={{ maxWidth: 400, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
                        <h2 style={{ marginBottom: 8 }}>Delete User?</h2>
                        <p style={{ color: '#8892b0', fontSize: 14, marginBottom: 24 }}>
                            Are you sure you want to permanently delete <strong style={{ color: 'white' }}>{deleteTarget.name}</strong>? This will also remove their login credentials.
                        </p>

                        {deleteStatus === 'success' && <p style={{ color: '#10b981', fontSize: 13 }}>✅ Deleted!</p>}
                        {deleteStatus === 'error'   && <p style={{ color: '#ef4444', fontSize: 13 }}>❌ Delete failed. Is the server running?</p>}

                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                            <button className="secondaryBtn" onClick={() => setDeleteTarget(null)}>Cancel</button>
                            <button
                                className="primaryBtn"
                                style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)', boxShadow: '0 4px 15px rgba(239,68,68,0.3)' }}
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Password Reset Modal ── */}
            {passwordModal && (
                <div className="modalOverlay" onClick={() => setPasswordModal(null)}>
                    <div className="modalContent glassCard" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
                        <div style={{ fontSize: 36, marginBottom: 8 }}>🔑</div>
                        <h2 style={{ marginBottom: 4 }}>Reset Password</h2>
                        <p style={{ color: '#8892b0', fontSize: 13, marginBottom: 20 }}>
                            Set a new password for <strong style={{ color: '#a5b4fc' }}>{passwordModal.userId}</strong> <span style={roleBadgeStyle(passwordModal.role)}>{passwordModal.role}</span>
                        </p>
                        <form onSubmit={handlePasswordReset} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div>
                                <label className="formLabel">New Password</label>
                                <input
                                    type="text"
                                    className="login-input"
                                    placeholder="Enter new password (min 4 chars)"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    required
                                    minLength={4}
                                    autoFocus
                                />
                            </div>

                            {passwordStatus === 'success' && <p style={{ color: '#10b981', fontSize: 13, margin: 0 }}>✅ Password updated!</p>}
                            {passwordStatus === 'error'   && <p style={{ color: '#ef4444', fontSize: 13, margin: 0 }}>❌ Update failed. Is the server running?</p>}
                            {passwordStatus === 'short'   && <p style={{ color: '#fbbf24', fontSize: 13, margin: 0 }}>⚠️ Password must be at least 4 characters.</p>}

                            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                                <button type="button" className="secondaryBtn" onClick={() => setPasswordModal(null)}>Cancel</button>
                                <button type="submit" className="primaryBtn">Update Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminAllUsers;
