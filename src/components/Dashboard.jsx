import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

const Dashboard = ({ user, setIsLoggedIn, children }) => {
    const navigate = useNavigate();

    const studentLinks = [
        { path: '/student', label: 'Dashboard', end: true },
        { path: '/student/assignments', label: 'Assignments' },
        { path: '/student/results', label: 'Results' },
        { path: '/student/notes', label: 'Notes' },
        { path: '/student/deadlines', label: '⏰ Deadlines' },
    ];

    const teacherLinks = [
        { path: '/teacher', label: 'Profile', end: true },
        { path: '/teacher/classes', label: 'Upload Assignments' },
        { path: '/teacher/grade-assignment', label: 'Grade Assignment' },
        { path: '/teacher/search-student', label: 'Search Student' },
        { path: '/teacher/class-results', label: 'Class Results' },
        { path: '/teacher/notes', label: 'Upload Notes' },
    ];

    const links = user?.role === 'teacher' ? teacherLinks : studentLinks;

    return (
        <div className="dashboard">
            <nav className="nav">
                <h3>Grade Grid</h3>
                <div className="navLinks">
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            end={link.end}
                            className={({ isActive }) => isActive ? "navLink active" : "navLink"}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </div>
                <div className="navRight">
                    <span className="navUserId">ID: {user?.id} ({user?.role})</span>
                    <button
                        onClick={() => {
                            localStorage.removeItem('isLoggedIn');
                            localStorage.removeItem('user');
                            setIsLoggedIn(false);
                            navigate('/');
                        }}
                        className="logoutBtn"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="content">
                {children}
            </div>
        </div>
    );
};

export default Dashboard;