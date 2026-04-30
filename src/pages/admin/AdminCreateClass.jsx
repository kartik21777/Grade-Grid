import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataContext } from '../../context/DataContext';

const AdminCreateClass = () => {
    const navigate = useNavigate();
    const { refreshData } = useDataContext();

    const [className, setClassName] = useState('');
    const [classId, setClassId] = useState('');
    const [status, setStatus] = useState('idle');
    const [globalError, setGlobalError] = useState('');

    // Students CSV state
    const [studentFilename, setStudentFilename] = useState('');
    const [studentPreview, setStudentPreview] = useState([]);
    const [studentError, setStudentError] = useState('');

    // Teachers CSV state
    const [teacherFilename, setTeacherFilename] = useState('');
    const [teacherPreview, setTeacherPreview] = useState([]);
    const [teacherError, setTeacherError] = useState('');

    const parseCsv = (file, type) => {
        const isStudent = type === 'student';
        
        if (isStudent) {
            setStudentFilename(file.name);
            setStudentError('');
        } else {
            setTeacherFilename(file.name);
            setTeacherError('');
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
            const text = ev.target.result;
            const lines = text.split('\n').filter(l => l.trim().length > 0);
            
            if (lines.length < 2) {
                isStudent ? setStudentError('File must have a header row and at least one data row.') : setTeacherError('File must have a header row and at least one data row.');
                isStudent ? setStudentPreview([]) : setTeacherPreview([]);
                return;
            }

            const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
            
            let requiredHeaders = isStudent ? ['name', 'rollno', 'branch'] : ['name', 'empid', 'dept'];
            const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

            if (missingHeaders.length > 0) {
                const msg = `Missing required columns: ${missingHeaders.join(', ')}`;
                isStudent ? setStudentError(msg) : setTeacherError(msg);
                isStudent ? setStudentPreview([]) : setTeacherPreview([]);
                return;
            }

            const rows = lines.slice(1).map(line => {
                const vals = line.split(',').map(v => v.trim());
                return headers.reduce((obj, h, i) => { obj[h] = vals[i] || ''; return obj; }, {});
            });

            isStudent ? setStudentPreview(rows) : setTeacherPreview(rows);
        };
        reader.readAsText(file);
    };

    const handleCreateClass = async () => {
        if (!className.trim()) {
            setGlobalError('Class name is required.');
            setStatus('error');
            return;
        }

        if (!classId.trim()) {
            setGlobalError('Class ID is required.');
            setStatus('error');
            return;
        }

        if (Number(classId) <= 0) {
            setGlobalError('Class ID must be a positive integer (greater than 0).');
            setStatus('error');
            return;
        }

        setStatus('uploading');
        setGlobalError('');

        try {
            // 1. Create Class
            const classRes = await fetch('http://localhost:5000/api/classes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: className, ...(classId && { originalId: classId }) })
            });
            
            if (!classRes.ok) throw new Error('Failed to create the class in the database.');
            const classData = await classRes.json();
            const newClassObjectId = classData.class._id;

            // 2. Prepare Data Arrays
            const mappedStudents = studentPreview.map(row => ({
                name: row.name,
                rollNo: row.rollno,
                branch: row.branch,
                classId: newClassObjectId
            }));

            const mappedTeachers = teacherPreview.map(row => ({
                name: row.name,
                empId: row.empid,
                dept: row.dept,
                assignedClasses: [newClassObjectId]
            }));

            // 3. Bulk Insert
            const inserts = [];
            
            if (mappedStudents.length > 0) {
                inserts.push(
                    fetch('http://localhost:5000/api/students', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(mappedStudents)
                    }).then(async res => {
                        if (!res.ok) {
                            const errData = await res.json().catch(() => ({}));
                            throw new Error(errData.message || 'Failed to bulk insert students.');
                        }
                    })
                );
            }

            if (mappedTeachers.length > 0) {
                inserts.push(
                    fetch('http://localhost:5000/api/teachers', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(mappedTeachers)
                    }).then(async res => {
                        if (!res.ok) {
                            const errData = await res.json().catch(() => ({}));
                            throw new Error(errData.message || 'Failed to bulk insert teachers.');
                        }
                    })
                );
            }

            await Promise.all(inserts);
            
            setStatus('success');
            await refreshData();
            setTimeout(() => navigate('/admin/classes'), 1500);

        } catch (err) {
            console.error(err);
            setStatus('error');
            setGlobalError(err.message || 'Server error occurred during bulk allocation.');
        }
    };

    const isUploading = status === 'uploading' || status === 'success';

    return (
        <div className="contentWrapper smooth-mount">
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
                <div>
                    <h1 style={{ color: 'white', fontSize: 28, marginBottom: 6 }}>🚀 Launch New Class</h1>
                    <p style={{ color: '#8892b0', fontSize: 14 }}>
                        Create a class and optionally attach student or teacher CSV rosters.
                    </p>
                </div>
                <button className="secondaryBtn" onClick={() => navigate('/admin/classes')}>
                    ← Back to Classes
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 24 }}>
                
                <div className="card" style={{ padding: 32 }}>
                    
                    <div style={{ marginBottom: 32, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 300px' }}>
                            <label className="formLabel">Class Name</label>
                            <input 
                                type="text"
                                className="login-input" 
                                placeholder="e.g. Year 2 - EEE A" 
                                style={{ fontSize: 16, padding: '12px 16px', width: '100%' }}
                                value={className}
                                onChange={e => setClassName(e.target.value)}
                                disabled={isUploading}
                            />
                        </div>
                        <div style={{ flex: '1 1 200px', maxWidth: 300 }}>
                            <label className="formLabel">Class ID</label>
                            <input 
                                type="number"
                                className="login-input" 
                                placeholder="e.g. 4" 
                                style={{ fontSize: 16, padding: '12px 16px', width: '100%' }}
                                value={classId}
                                onChange={e => setClassId(e.target.value)}
                                disabled={isUploading}
                                required
                                min="1"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
                        
                        {/* Students Upload */}
                        <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: 24, borderRadius: 12, border: '1px solid rgba(255,255,255,0.04)' }}>
                            <h3 style={{ color: 'white', fontSize: 16, margin: '0 0 12px 0' }}>👨‍🎓 Students List</h3>
                            <p style={{ color: '#8892b0', fontSize: 13, marginBottom: 16 }}>
                                Required CSV columns: <code style={{ color: '#a5b4fc' }}>name, rollNo, branch</code>
                            </p>
                            
                            <label className="csvDropZone" style={{ minHeight: 120, padding: 16, opacity: isUploading ? 0.6 : 1, pointerEvents: isUploading ? 'none' : 'auto' }}>
                                <span className="csvDropIcon" style={{ fontSize: 24 }}>📂</span>
                                <span className="csvDropText" style={{ fontSize: 13 }}>{studentFilename || 'Upload Students.csv'}</span>
                                <input type="file" accept=".csv" onChange={(e) => { if(e.target.files[0]) parseCsv(e.target.files[0], 'student') }} disabled={isUploading} hidden />
                            </label>

                            {studentError && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 12 }}>{studentError}</p>}
                            
                            {studentPreview.length > 0 && (
                                <div style={{ marginTop: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                        <span style={{ color: '#42cab3', fontSize: 13, fontWeight: 600 }}>{studentPreview.length} ready</span>
                                        {!isUploading && <button className="textBtn" onClick={() => { setStudentPreview([]); setStudentFilename(''); }}>Clear</button>}
                                    </div>
                                    <div className="csvPreviewTable" style={{ maxHeight: 160 }}>
                                        <table className="dataTable">
                                            <thead><tr><th>Name</th><th>Roll No</th><th>Branch</th></tr></thead>
                                            <tbody>
                                                {studentPreview.slice(0, 4).map((row, i) => (
                                                    <tr key={i}>
                                                        <td style={{ color: 'white' }}>{row.name || '—'}</td>
                                                        <td style={{ color: '#94a3b8' }}>{row.rollno || '—'}</td>
                                                        <td style={{ color: '#94a3b8' }}>{row.branch || '—'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Teachers Upload */}
                        <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: 24, borderRadius: 12, border: '1px solid rgba(255,255,255,0.04)' }}>
                            <h3 style={{ color: 'white', fontSize: 16, margin: '0 0 12px 0' }}>👨‍🏫 Teachers List</h3>
                            <p style={{ color: '#8892b0', fontSize: 13, marginBottom: 16 }}>
                                Required CSV columns: <code style={{ color: '#a5b4fc' }}>name, empId, dept</code>
                            </p>
                            
                            <label className="csvDropZone" style={{ minHeight: 120, padding: 16, opacity: isUploading ? 0.6 : 1, pointerEvents: isUploading ? 'none' : 'auto' }}>
                                <span className="csvDropIcon" style={{ fontSize: 24 }}>📂</span>
                                <span className="csvDropText" style={{ fontSize: 13 }}>{teacherFilename || 'Upload Teachers.csv'}</span>
                                <input type="file" accept=".csv" onChange={(e) => { if(e.target.files[0]) parseCsv(e.target.files[0], 'teacher') }} disabled={isUploading} hidden />
                            </label>

                            {teacherError && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 12 }}>{teacherError}</p>}
                            
                            {teacherPreview.length > 0 && (
                                <div style={{ marginTop: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                        <span style={{ color: '#a855f7', fontSize: 13, fontWeight: 600 }}>{teacherPreview.length} ready</span>
                                        {!isUploading && <button className="textBtn" onClick={() => { setTeacherPreview([]); setTeacherFilename(''); }}>Clear</button>}
                                    </div>
                                    <div className="csvPreviewTable" style={{ maxHeight: 160 }}>
                                        <table className="dataTable">
                                            <thead><tr><th>Name</th><th>Emp ID</th></tr></thead>
                                            <tbody>
                                                {teacherPreview.slice(0, 4).map((row, i) => (
                                                    <tr key={i}>
                                                        <td style={{ color: 'white' }}>{row.name || '—'}</td>
                                                        <td style={{ color: '#94a3b8' }}>{row.empid || '—'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20 }}>
                        {status === 'error' && (
                            <div style={{ padding: 12, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 8, color: '#fca5a5', fontSize: 13 }}>
                                <strong>Error:</strong> {globalError}
                            </div>
                        )}
                        {status === 'success' && (
                            <div style={{ padding: 12, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 8, color: '#6ee7b7', fontSize: 13 }}>
                                <strong>Success!</strong> Class created and participants actively onboarded. Redirecting you...
                            </div>
                        )}
                        
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <span style={{ color: '#94a3b8', fontSize: 13, marginRight: 24 }}>
                                You are about to import <strong>{studentPreview.length}</strong> students and <strong>{teacherPreview.length}</strong> teachers.
                            </span>
                            <button 
                                className="primaryBtn" 
                                style={{ padding: '12px 24px', fontSize: 15, opacity: (isUploading || !className) ? 0.5 : 1 }} 
                                onClick={handleCreateClass}
                                disabled={isUploading || !className}
                            >
                                {status === 'uploading' ? '⏳ Launching Class...' : `🚀 Launch Class`}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminCreateClass;
