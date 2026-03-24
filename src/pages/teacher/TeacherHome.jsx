
const TeacherHome = () => {
    const user = JSON.parse(localStorage.getItem('user')) || { id: 'Unknown' };

    return (
        <div className="profileContainer">
            <div className="profileHeader">
                <div className="profileAvatar teacherAvatar">T</div>
                <div className="profileInfo">
                    <h2>Prof. Teacher {user.id}</h2>
                    <p className="profileRole">Faculty • Computer Science</p>
                </div>
            </div>
            
            <div className="profileDetails">
                <h3>Professional Information</h3>
                <div className="detailRow">
                    <span className="detailLabel">Employee ID:</span>
                    <span className="detailValue">{user.id}</span>
                </div>
                <div className="detailRow">
                    <span className="detailLabel">Email:</span>
                    <span className="detailValue">teacher{user.id}@gradegrid.edu</span>
                </div>
                <div className="detailRow">
                    <span className="detailLabel">Department:</span>
                    <span className="detailValue">Computer Science and Engineering</span>
                </div>
                <div className="detailRow">
                    <span className="detailLabel">Office Hour:</span>
                    <span className="detailValue">Monday - Wednesday, 2:00 PM - 4:00 PM</span>
                </div>
            </div>
        </div>
    );
};

export default TeacherHome;