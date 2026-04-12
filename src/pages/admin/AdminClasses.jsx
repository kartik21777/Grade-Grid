import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataContext } from '../../context/DataContext';

const AdminClasses = () => {
    const { classes, teachers, students, refreshData } = useDataContext();

    const navigate = useNavigate();


    const handleDeleteClass = async (id) => {
        if (!window.confirm("Are you sure you want to delete this class? This will instantly unassign all students and teachers from it!")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/classes/${id}`, { method: 'DELETE' });
            if (res.ok) {
                await refreshData();
            } else {
                alert("Failed to delete class.");
            }
        } catch (e) {
            alert("Error deleting class. Backend may be offline.");
        }
    };

    return (
        <>
            <div className="contentWrapper smooth-mount">

                {/* Header */}
                <div style={{ marginBottom: 28 }}>
                    <h1 style={{ color: 'white', fontSize: 28, marginBottom: 6 }}>🏫 Classes & Departments</h1>
                    <p style={{ color: '#8892b0', fontSize: 14 }}>Create classes and assign teachers to manage academic allocation.</p>
                </div>

                {/* Create Class Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
                    <button className="primaryBtn" onClick={() => navigate('/admin/create-class')}>
                        + Create Class
                    </button>
                </div>

                {/* Classes Table */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    {classes.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '20px 0', color: '#8892b0' }}>
                            <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                            <p>No classes found. Create one above.</p>
                        </div>
                    ) : (
                        <table className="dataTable">
                            <thead>
                                <tr>
                                    <th>Class ID</th>
                                    <th>Class Name</th>
                                    <th>Teachers</th>
                                    <th>Students</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classes.map(cls => {
                                    const clsTeachers = teachers.filter(t =>
                                        (t.assignedClasses || []).some(id => String(id) === String(cls.id))
                                    );
                                    const clsStudents = students.filter(s => String(s.classId) === String(cls.id));

                                    return (
                                        <tr key={cls.id || cls._id}>
                                            <td style={{ color: '#64748b', fontSize: 13 }}>{cls.id || cls._id}</td>
                                            <td style={{ color: 'white', fontWeight: 600 }}>{cls.name}</td>
                                            <td style={{ color: '#a855f7', fontWeight: 600 }}>
                                                {clsTeachers.length}
                                            </td>
                                            <td style={{ color: '#42cab3', fontWeight: 600 }}>
                                                {clsStudents.length}
                                            </td>
                                            <td style={{ textAlign: 'right', display: 'flex', gap: '12px', justifyContent: 'flex-end', borderBottom: 'none' }}>
                                                <button className="textBtn" onClick={() => navigate(`/admin/classes/${cls._id || cls.id}/allocations`)}>
                                                    ⚙️ Manage Allocations
                                                </button>
                                                <button 
                                                    className="textBtn" 
                                                    style={{ color: '#ef4444' }} 
                                                    onClick={() => handleDeleteClass(cls._id || cls.id)}
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

        </>
    );
};

export default AdminClasses;
