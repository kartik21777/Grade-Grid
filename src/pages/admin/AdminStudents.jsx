import React, { useState } from 'react';
import { useDataContext } from '../../context/DataContext';

const AdminStudents = () => {
    const { classes, refreshData } = useDataContext();

    const [form, setForm] = useState({ name: '', rollNo: '', branch: '', classId: '' });
    const [formStatus, setFormStatus] = useState(null);

    const [csvPreview, setCsvPreview] = useState([]);
    const [csvFilename, setCsvFilename] = useState('');
    const [csvStatus, setCsvStatus] = useState(null);

    // ── Manual Add ────────────────────────────────────────────────
    const handleFormChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: form.name, rollNo: form.rollNo, branch: form.branch, classId: form.classId })
            });
            if (res.ok) {
                setFormStatus('success');
                setForm({ name: '', rollNo: '', branch: '', classId: '' });
                await refreshData();
                setTimeout(() => setFormStatus(null), 2000);
            } else {
                setFormStatus('error');
            }
        } catch {
            setFormStatus('error');
        }
    };

    // ── CSV Upload ────────────────────────────────────────────────
    const handleCsvChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setCsvFilename(file.name);
        setCsvStatus(null);
        const reader = new FileReader();
        reader.onload = (ev) => {
            const lines = ev.target.result.split('\n').filter(l => l.trim());
            const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
            const rows = lines.slice(1).map(line => {
                const vals = line.split(',').map(v => v.trim());
                return headers.reduce((obj, h, i) => { obj[h] = vals[i] || ''; return obj; }, {});
            });
            setCsvPreview(rows);
        };
        reader.readAsText(file);
    };

    const handleBulkSubmit = async () => {
        if (!csvPreview.length) return;
        try {
            const mappedStudents = csvPreview.map(row => {
                const rawClassId = row.classid || row.classId;
                const matchedClass = classes.find(c => String(c.id) === String(rawClassId) || String(c._id) === String(rawClassId));
                
                return {
                    name: row.name,
                    rollNo: row.rollno || row.rollNo,
                    branch: row.branch,
                    classId: matchedClass ? matchedClass._id : null
                };
            });

            const res = await fetch('http://localhost:5000/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mappedStudents)
            });
            if (res.ok) {
                setCsvStatus('success');
                await refreshData();
                setCsvPreview([]);
                setCsvFilename('');
            } else {
                const errData = await res.json().catch(() => ({}));
                setCsvStatus(`error: ${errData.message || 'Import failed.'}`);
            }
        } catch {
            setCsvStatus('error: Network error');
        }
    };

    return (
        <div className="contentWrapper smooth-mount">
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ color: 'white', fontSize: 28, marginBottom: 6 }}>👨‍🎓 Add Students</h1>
                <p style={{ color: '#8892b0', fontSize: 14 }}>
                    Add individual students manually or bulk-import via CSV. View all students in the <strong style={{ color: '#a5b4fc' }}>Users</strong> section.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

                {/* Manual Add */}
                <div className="card" style={{ padding: 28 }}>
                    <h3 style={{ color: 'white', margin: '0 0 20px 0', fontSize: 18 }}>➕ Add Student Manually</h3>
                    <form onSubmit={handleAddStudent} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div>
                            <label className="formLabel">Full Name</label>
                            <input name="name" className="login-input" placeholder="e.g. Alice Smith" value={form.name} onChange={handleFormChange} required />
                        </div>
                        <div>
                            <label className="formLabel">Roll Number</label>
                            <input name="rollNo" className="login-input" placeholder="e.g. CS-201" value={form.rollNo} onChange={handleFormChange} required />
                        </div>
                        <div>
                            <label className="formLabel">Branch</label>
                            <select name="branch" className="teacherAssignSelect" style={{ width: '100%' }} value={form.branch} onChange={handleFormChange} required>
                                <option value="">— Select Branch —</option>
                                <option value="CSE">CSE</option>
                                <option value="ML">ML</option>
                                <option value="DS">DS</option>
                                <option value="Cyber Security">Cyber Security</option>
                            </select>
                        </div>
                        <div>
                            <label className="formLabel">Assign to Class</label>
                            <select name="classId" className="teacherAssignSelect" style={{ width: '100%' }} value={form.classId} onChange={handleFormChange} required>
                                <option value="">— Select a class —</option>
                                {classes.map(cls => (
                                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="primaryBtn" style={{ marginTop: 6, width: '100%', justifyContent: 'center' }}>
                            Add Student
                        </button>
                        {formStatus === 'success' && <p style={{ color: '#10b981', fontSize: 13, margin: 0 }}>✅ Student added! Check the Users section.</p>}
                        {formStatus === 'error'   && <p style={{ color: '#ef4444', fontSize: 13, margin: 0 }}>❌ Failed. Is the server running?</p>}
                    </form>
                </div>

                {/* CSV Upload */}
                <div className="card" style={{ padding: 28 }}>
                    <h3 style={{ color: 'white', margin: '0 0 8px 0', fontSize: 18 }}>📤 Bulk Upload via CSV</h3>
                    <p style={{ color: '#8892b0', fontSize: 13, margin: '0 0 20px 0' }}>
                        Required columns: <code style={{ color: '#a5b4fc' }}>name, rollNo, branch, classId</code>
                    </p>
                    <label className="csvDropZone">
                        <span className="csvDropIcon">📂</span>
                        <span className="csvDropText">{csvFilename || 'Click to choose a CSV file'}</span>
                        <input type="file" accept=".csv" onChange={handleCsvChange} hidden />
                    </label>

                    {csvPreview.length > 0 && (
                        <>
                            <div className="csvPreviewHeader">
                                <span style={{ color: '#8892b0', fontSize: 13 }}>{csvPreview.length} rows ready</span>
                                <button className="textBtn" onClick={() => { setCsvPreview([]); setCsvFilename(''); }}>Clear</button>
                            </div>
                            <div className="csvPreviewTable">
                                <table className="dataTable">
                                    <thead><tr><th>Name</th><th>Roll No</th><th>Branch</th><th>Class ID</th></tr></thead>
                                    <tbody>
                                        {csvPreview.slice(0, 5).map((row, i) => (
                                            <tr key={i}>
                                                <td>{row.name || '—'}</td>
                                                <td>{row.rollno || row.rollNo || '—'}</td>
                                                <td>{row.branch || '—'}</td>
                                                <td>{row.classid || row.classId || '—'}</td>
                                            </tr>
                                        ))}
                                        {csvPreview.length > 5 && (
                                            <tr><td colSpan={3} style={{ color: '#64748b', textAlign: 'center', fontStyle: 'italic' }}>…and {csvPreview.length - 5} more</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <button className="primaryBtn" style={{ marginTop: 16, width: '100%', justifyContent: 'center' }} onClick={handleBulkSubmit}>
                                📥 Import {csvPreview.length} Students
                            </button>
                        </>
                    )}
                    {csvStatus === 'success' && <p style={{ color: '#10b981', fontSize: 13, marginTop: 12 }}>✅ Import successful!</p>}
                    {csvStatus && csvStatus.startsWith('error') && <p style={{ color: '#ef4444', fontSize: 13, marginTop: 12 }}>❌ {csvStatus.replace('error:', '').trim() || 'Import failed. Check the server.'}</p>}
                </div>
            </div>
        </div>
    );
};

export default AdminStudents;
