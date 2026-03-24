const StudentHome = () => {
    const user = JSON.parse(localStorage.getItem('user')) || { id: 'Unknown' };
    
    return (
        <div className="profileContainer">
            <div className="profileHeader">
                <div className="profileAvatar">S</div>
                <div className="profileInfo">
                    <h2>Student {user.id}</h2>
                    <p className="profileRole">Student • Computer Science</p>
                </div>
            </div>
            
            <div className="profileDetails">
                <h3>Personal Information</h3>
                <div className="detailRow">
                    <span className="detailLabel">Roll Number:</span>
                    <span className="detailValue">{user.id}</span>
                </div>
                <div className="detailRow">
                    <span className="detailLabel">Email:</span>
                    <span className="detailValue">student{user.id}@gradegrid.edu</span>
                </div>
                <div className="detailRow">
                    <span className="detailLabel">Semester:</span>
                    <span className="detailValue">6th Semester</span>
                </div>
                <div className="detailRow">
                    <span className="detailLabel">Batch:</span>
                    <span className="detailValue">2021-2025</span>
                </div>
            </div>
        </div>
    );
};

export default StudentHome;