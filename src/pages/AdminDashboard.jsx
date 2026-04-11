import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminDashboard = () => {
    return (
        <div className="dashboardWrapper">
            <Outlet />
        </div>
    );
};

export default AdminDashboard;
