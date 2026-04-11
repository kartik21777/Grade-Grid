import React, { useState } from 'react';
import { useDataContext } from '../../context/DataContext';

const AdminClasses = () => {
    const { classes, teachers, students } = useDataContext();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newClassName, setNewClassName] = useState('');

    const handleCreateClass = (e) => {
        e.preventDefault();
        alert('Implement API to add class!');
        setIsAddModalOpen(false);
    };

    return (
        <div className="sectionContainer smooth-mount">
            <div className="sectionHeader">
                <div>
                    <h2>Classes & Departments</h2>
                    <p>Manage academic structures and teacher allocations</p>
                </div>
                <button className="primaryBtn" onClick={() => setIsAddModalOpen(true)}>
                    + Create Class
                </button>
            </div>

            <div className="glassCard tableContainer">
                <table className="dataTable">
                    <thead>
                        <tr>
                            <th>Class ID</th>
                            <th>Class Name</th>
                            <th>Assigned Teachers</th>
                            <th>Total Students</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classes.map(cls => {
                            const clsTeachers = teachers.filter(t => (t.assignedClasses || []).some(id => String(id) === String(cls.id)));
                            const clsStudents = students.filter(s => String(s.classId) === String(cls.id));
                            return (
                                <tr key={cls.id}>
                                    <td>{cls.id || cls._id}</td>
                                    <td>{cls.name}</td>
                                    <td>
                                        {clsTeachers.length > 0 ? (
                                            clsTeachers.map(t => <div key={t.id} className="badge" style={{marginBottom: '4px'}}>{t.name}</div>)
                                        ) : (
                                            <span style={{ color: 'var(--text-secondary)' }}>None</span>
                                        )}
                                    </td>
                                    <td>{clsStudents.length} Students</td>
                                    <td><button className="textBtn">Manage Allocations</button></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {isAddModalOpen && (
                <div className="modalOverlay">
                    <div className="modalContent glassCard" style={{ maxWidth: '400px' }}>
                        <h2>Create New Class</h2>
                        <form onSubmit={handleCreateClass} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                            <input 
                                className="login-input" 
                                placeholder="Class Name (e.g., Year 2 - EEE)" 
                                value={newClassName}
                                onChange={e => setNewClassName(e.target.value)}
                                required
                            />
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button type="button" className="textBtn" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                                <button type="submit" className="primaryBtn">Create Class</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminClasses;
