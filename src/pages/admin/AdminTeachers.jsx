import React, { useState } from 'react';

const AdminTeachers = () => {
    const [form, setForm] = useState({ name: '', empId: '', dept: '' });
    const [formStatus, setFormStatus] = useState(null);

    const [csvPreview, setCsvPreview] = useState([]);
    const [csvFilename, setCsvFilename] = useState('');
    const [csvStatus, setCsvStatus] = useState(null);

    // ── Manual Add ────────────────────────────────────────────────
    const handleFormChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleAddTeacher = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/teachers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: form.name, empId: form.empId, dept: form.dept })
            });
            if (res.ok) {
                setFormStatus('success');
                setForm({ name: '', empId: '', dept: '' });
                setTimeout(() => setFormStatus(null), 3000);
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
            const results = await Promise.all(
                csvPreview.map(row =>
                    fetch('http://localhost:5000/api/teachers', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: row.name, empId: row.empid || row.empId, dept: row.dept })
                    })
                )
            );
            const allOk = results.every(r => r.ok);
            setCsvStatus(allOk ? 'success' : 'error');
            if (allOk) { setCsvPreview([]); setCsvFilename(''); }
        } catch {
            setCsvStatus('error');
        }
    };

    return (
        <div className="contentWrapper smooth-mount">
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ color: 'white', fontSize: 28, marginBottom: 6 }}>👨‍🏫 Add Teachers</h1>
                <p style={{ color: '#8892b0', fontSize: 14 }}>
                    Add individual teachers manually or bulk-import via CSV. View all teachers in the <strong style={{ color: '#a5b4fc' }}>Users</strong> section.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

                {/* Manual Add */}
                <div className="card" style={{ padding: 28 }}>
                    <h3 style={{ color: 'white', margin: '0 0 20px 0', fontSize: 18 }}>➕ Add Teacher Manually</h3>
                    <form onSubmit={handleAddTeacher} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div>
                            <label className="formLabel">Full Name</label>
                            <input name="name" className="login-input" placeholder="e.g. Dr. Jane Doe" value={form.name} onChange={handleFormChange} required />
                        </div>
                        <div>
                            <label className="formLabel">Employee ID</label>
                            <input name="empId" className="login-input" placeholder="e.g. 103" value={form.empId} onChange={handleFormChange} required />
                        </div>
                        <div>
                            <label className="formLabel">Department</label>
                            <input name="dept" className="login-input" placeholder="e.g. Computer Science" value={form.dept} onChange={handleFormChange} required />
                        </div>
                        <button type="submit" className="primaryBtn" style={{ marginTop: 6, width: '100%', justifyContent: 'center' }}>
                            Add Teacher
                        </button>
                        {formStatus === 'success' && <p style={{ color: '#10b981', fontSize: 13, margin: 0 }}>✅ Teacher added! Check the Users section.</p>}
                        {formStatus === 'error'   && <p style={{ color: '#ef4444', fontSize: 13, margin: 0 }}>❌ Failed. Is the server running?</p>}
                    </form>
                </div>

                {/* CSV Upload */}
                <div className="card" style={{ padding: 28 }}>
                    <h3 style={{ color: 'white', margin: '0 0 8px 0', fontSize: 18 }}>📤 Bulk Upload via CSV</h3>
                    <p style={{ color: '#8892b0', fontSize: 13, margin: '0 0 20px 0' }}>
                        Required columns: <code style={{ color: '#a5b4fc' }}>name, empId, dept</code>
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
                                    <thead><tr><th>Name</th><th>Emp ID</th><th>Department</th></tr></thead>
                                    <tbody>
                                        {csvPreview.slice(0, 5).map((row, i) => (
                                            <tr key={i}>
                                                <td>{row.name || '—'}</td>
                                                <td>{row.empid || row.empId || '—'}</td>
                                                <td>{row.dept || '—'}</td>
                                            </tr>
                                        ))}
                                        {csvPreview.length > 5 && (
                                            <tr><td colSpan={3} style={{ color: '#64748b', textAlign: 'center', fontStyle: 'italic' }}>…and {csvPreview.length - 5} more</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <button className="primaryBtn" style={{ marginTop: 16, width: '100%', justifyContent: 'center' }} onClick={handleBulkSubmit}>
                                📥 Import {csvPreview.length} Teachers
                            </button>
                        </>
                    )}
                    {csvStatus === 'success' && <p style={{ color: '#10b981', fontSize: 13, marginTop: 12 }}>✅ Import successful!</p>}
                    {csvStatus === 'error'   && <p style={{ color: '#ef4444', fontSize: 13, marginTop: 12 }}>❌ Import failed. Check the server.</p>}
                </div>
            </div>
        </div>
    );
};

export default AdminTeachers;
