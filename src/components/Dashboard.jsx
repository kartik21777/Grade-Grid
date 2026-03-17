import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user, setIsLoggedIn, children }) => {
    const navigate = useNavigate();

    return (
        <div className="dashboard">
            <nav className="nav">
                <h3>Grade Grid</h3>
                <div className="navRight">
                    <span className="navUserId">ID: {user.id} ({user.role})</span>
                    <button
                        onClick={() => {
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