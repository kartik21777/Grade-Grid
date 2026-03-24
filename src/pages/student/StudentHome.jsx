import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataContext } from '../../context/DataContext';

const StudentHome = () => {
  const navigate = useNavigate();
  const { currentUser, getStudentAssignmentsByRoll, getStudentResultsByRoll, getStudentNotesByRoll } = useDataContext();

  const assignments = getStudentAssignmentsByRoll(currentUser.id);
  const results = getStudentResultsByRoll(currentUser.id);
  const notes = getStudentNotesByRoll(currentUser.id);

  const now = new Date();
  const isBeforeDue = (dueDate, dueTime) => new Date(`${dueDate}T${dueTime}`) > now;

  const pending = assignments.filter(a => !a.submitted && isBeforeDue(a.dueDate, a.dueTime));
  const submitted = assignments.filter(a => a.submitted);
  const missed = assignments.filter(a => !a.submitted && !isBeforeDue(a.dueDate, a.dueTime));

  const overall = results.length > 0
    ? ((results.reduce((s, r) => s + r.obtainedMarks, 0) / results.reduce((s, r) => s + r.totalMarks, 0)) * 100).toFixed(1)
    : null;

  const upcoming = [...pending]
    .sort((a, b) => new Date(`${a.dueDate}T${a.dueTime}`) - new Date(`${b.dueDate}T${b.dueTime}`))
    .slice(0, 3);

  const recentResults = [...results].slice(-3).reverse();

  const msLeft = (dueDate, dueTime) => {
    const ms = new Date(`${dueDate}T${dueTime}`) - now;
    const h = Math.floor(ms / 3600000);
    const d = Math.floor(h / 24);
    if (d > 0) return `${d}d ${h % 24}h left`;
    if (h > 0) return `${h}h left`;
    return `< 1h left`;
  };

  const statCards = [
    { label: 'Pending', value: pending.length, color: '#f59e0b', icon: '📋', path: '/student/assignments' },
    { label: 'Submitted', value: submitted.length, color: '#10b981', icon: '✅', path: '/student/assignments' },
    { label: 'Missed', value: missed.length, color: '#ef4444', icon: '⚠️', path: '/student/assignments' },
    { label: 'Notes', value: notes.length, color: '#8b5cf6', icon: '📝', path: '/student/notes' },
  ];

  return (
    <div className="contentWrapper">
      {/* Welcome Header */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ color: 'white', fontSize: 26, marginBottom: 4 }}>
          Welcome back, <span style={{ color: '#42cab3ff' }}>{currentUser.id}</span> 👋
        </h2>
        <p style={{ color: '#8892b0', fontSize: 14 }}>Here's your academic snapshot for today.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
        {statCards.map(card => (
          <div
            key={card.label}
            className="card"
            onClick={() => navigate(card.path)}
            style={{ cursor: 'pointer', padding: '20px', textAlign: 'center', borderTop: `3px solid ${card.color}`, transition: 'transform 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>{card.icon}</div>
            <div style={{ color: card.color, fontSize: 30, fontWeight: 'bold' }}>{card.value}</div>
            <div style={{ color: '#8892b0', fontSize: 13, marginTop: 4 }}>{card.label}</div>
          </div>
        ))}
        {overall !== null && (
          <div
            className="card"
            onClick={() => navigate('/student/results')}
            style={{ cursor: 'pointer', padding: '20px', textAlign: 'center', borderTop: '3px solid #42cab3ff', transition: 'transform 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>📊</div>
            <div style={{ color: '#42cab3ff', fontSize: 30, fontWeight: 'bold' }}>{overall}%</div>
            <div style={{ color: '#8892b0', fontSize: 13, marginTop: 4 }}>Avg Score</div>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Upcoming Deadlines */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ color: 'white', marginBottom: 16, fontSize: 16, display: 'flex', justifyContent: 'space-between' }}>
            ⏰ Upcoming Deadlines
            <span
              onClick={() => navigate('/student/deadlines')}
              style={{ color: '#42cab3ff', fontSize: 13, cursor: 'pointer', fontWeight: 400 }}
            >View all →</span>
          </h3>
          {upcoming.length > 0 ? upcoming.map(a => (
            <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div style={{ color: 'white', fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{a.title}</div>
                <div style={{ color: '#8892b0', fontSize: 12 }}>{a.subject}</div>
              </div>
              <div style={{ color: '#f59e0b', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 10 }}>
                {msLeft(a.dueDate, a.dueTime)}
              </div>
            </div>
          )) : (
            <p style={{ color: '#8892b0', fontSize: 14 }}>🎉 No pending deadlines!</p>
          )}
        </div>

        {/* Recent Results */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ color: 'white', marginBottom: 16, fontSize: 16, display: 'flex', justifyContent: 'space-between' }}>
            🏆 Recent Results
            <span
              onClick={() => navigate('/student/results')}
              style={{ color: '#42cab3ff', fontSize: 13, cursor: 'pointer', fontWeight: 400 }}
            >View all →</span>
          </h3>
          {recentResults.length > 0 ? recentResults.map(r => {
            const pct = ((r.obtainedMarks / r.totalMarks) * 100).toFixed(0);
            return (
              <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{r.title}</div>
                  <div style={{ color: '#8892b0', fontSize: 12 }}>{r.subject}</div>
                </div>
                <div style={{ color: pct >= 80 ? '#10b981' : '#f59e0b', fontWeight: 700, fontSize: 16 }}>{pct}%</div>
              </div>
            );
          }) : (
            <p style={{ color: '#8892b0', fontSize: 14 }}>No graded results yet.</p>
          )}
        </div>

      </div>

    </div>
  );
};

export default StudentHome;