import React, { useState } from 'react';
import { useDataContext } from '../../context/DataContext';

const AdminUsers = () => {
    const { students, teachers, classes } = useDataContext();
    const [activeTab, setActiveTab] = useState('students');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Form state (Simple MVP without backend hooks yet)
    const [formData, setFormData] = useState({ name: '', rollId: '', classId: '', dept: '' });

    const handleBulkUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const csvText = event.target.result;
            // Simple manual parse since papaparse isn't installed natively
            const rows = csvText.split('\n').filter(row => row.trim().length > 0).slice(1);
            alert(`Parsed ${rows.length} rows. Implement API to batch insert.`);
        };
        reader.readAsText(file);
    };

    const handleCreateUser = (e) => {
        e.preventDefault();
        alert('Implement API to add user!');
        setIsAddModalOpen(false);
    };

    return (
        <div className="sectionContainer smooth-mount">
            <div className="sectionHeader">
                <div>
                    <h2>User Management</h2>
                    <p>Manage and onboard Students and Teachers</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <label className="secondaryBtn" style={{ cursor: 'pointer' }}>
                        Bulk Upload CSV
                        <input type="file" accept=".csv" onChange={handleBulkUpload} hidden />
                    </label>
                    <button className="primaryBtn" onClick={() => setIsAddModalOpen(true)}>
                        + Add {activeTab === 'students' ? 'Student' : 'Teacher'}
                    </button>
                </div>
            </div>

            <div className="adminUsersToolbar">
                <div className="customTabs">
                    <button
                        className={`customTab ${activeTab === 'students' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('students'); setSearchQuery(''); }}
                    >
                        Students ({students.length})
                    </button>
                    <button
                        className={`customTab ${activeTab === 'teachers' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('teachers'); setSearchQuery(''); }}
                    >
                        Teachers ({teachers.length})
                    </button>
                </div>

                <div className="adminSearchBar">
                    <span className="adminSearchIcon">🔍</span>
                    <input
                        type="text"
                        className="adminSearchInput"
                        placeholder={activeTab === 'students' ? 'Search by name or roll no…' : 'Search by name, ID or dept…'}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button className="adminSearchClear" onClick={() => setSearchQuery('')} title="Clear search">
                            ✕
                        </button>
                    )}
                </div>
            </div>

            <div className="glassCard tableContainer">
                <table className="dataTable">
                    <thead>
                        {activeTab === 'students' ? (
                            <tr>
                                <th>Roll No</th>
                                <th>Name</th>
                                <th>Class/Department</th>
                                <th>Actions</th>
                            </tr>
                        ) : (
                            <tr>
                                <th>Emp ID</th>
                                <th>Name</th>
                                <th>Department</th>
                                <th>Assigned Classes</th>
                                <th>Actions</th>
                            </tr>
                        )}
                    </thead>
                    <tbody>
                        {activeTab === 'students' && (() => {
                            const q = searchQuery.toLowerCase();
                            const filtered = students.filter(st =>
                                st.name?.toLowerCase().includes(q) ||
                                st.rollNo?.toLowerCase().includes(q)
                            );
                            if (filtered.length === 0) return (
                                <tr><td colSpan={4} className="adminNoResults">No students match "{searchQuery}"</td></tr>
                            );
                            return filtered.map(st => (
                                <tr key={st.id}>
                                    <td>{st.rollNo}</td>
                                    <td>{st.name}</td>
                                    <td>{classes.find(c => String(c.id) === String(st.classId))?.name || 'Unassigned'}</td>
                                    <td><button className="textBtn">Edit</button></td>
                                </tr>
                            ));
                        })()}
                        {activeTab === 'teachers' && (() => {
                            const q = searchQuery.toLowerCase();
                            const filtered = teachers.filter(t =>
                                t.name?.toLowerCase().includes(q) ||
                                t.empId?.toLowerCase().includes(q) ||
                                t.dept?.toLowerCase().includes(q)
                            );
                            if (filtered.length === 0) return (
                                <tr><td colSpan={5} className="adminNoResults">No teachers match "{searchQuery}"</td></tr>
                            );
                            return filtered.map(t => (
                                <tr key={t.id}>
                                    <td>{t.empId}</td>
                                    <td>{t.name}</td>
                                    <td>{t.dept}</td>
                                    <td>{(t.assignedClasses || []).length} Classes</td>
                                    <td><button className="textBtn">Edit</button></td>
                                </tr>
                            ));
                        })()}
                    </tbody>
                </table>
            </div>

            {isAddModalOpen && (
                <div className="modalOverlay">
                    <div className="modalContent glassCard" style={{ maxWidth: '500px' }}>
                        <h2>Create {activeTab === 'students' ? 'Student' : 'Teacher'}</h2>
                        <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                            <input 
                                className="login-input" 
                                placeholder="Full Name" 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                required
                            />
                            <input 
                                className="login-input" 
                                placeholder={activeTab === 'students' ? "Roll Number" : "Employee ID"} 
                                value={formData.rollId}
                                onChange={e => setFormData({...formData, rollId: e.target.value})}
                                required
                            />
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button type="button" className="textBtn" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                                <button type="submit" className="primaryBtn">Create User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
