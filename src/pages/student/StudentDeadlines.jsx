import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataContext } from '../../context/DataContext';

const HOURS_48 = 48 * 60 * 60 * 1000;

const StudentDeadlines = () => {
  const navigate = useNavigate();
  const { currentUser, getStudentAssignmentsByRoll } = useDataContext();
  const assignments = getStudentAssignmentsByRoll(currentUser.id);
  const now = new Date();

  const msLeft = (dueDate, dueTime) => new Date(`${dueDate}T${dueTime}`) - now;

  const upcoming = assignments
    .filter(a => {
      const ms = msLeft(a.dueDate, a.dueTime);
      return !a.submitted && ms > 0 && ms <= HOURS_48;
    })
    .sort((a, b) => msLeft(a.dueDate, a.dueTime) - msLeft(b.dueDate, b.dueTime));

  const formatTimeLeft = (ms) => {
    const totalMins = Math.floor(ms / 60000);
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    if (h >= 24) {
      const d = Math.floor(h / 24);
      return `${d}d ${h % 24}h`;
    }
    return `${h}h ${m}m`;
  };

  const urgencyColor = (ms) => {
    const h = ms / 3600000;
    if (h <= 6) return '#ef4444';
    if (h <= 24) return '#f59e0b';
    return '#10b981';
  };

  const urgencyLabel = (ms) => {
    const h = ms / 3600000;
    if (h <= 6) return '🔴 Critical';
    if (h <= 24) return '🟡 Today';
    return '🟢 Tomorrow';
  };

  return (
    <div className="contentWrapper">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ color: 'white', fontSize: 26, marginBottom: 6 }}>⏰ Upcoming Deadlines</h2>
        <p style={{ color: '#8892b0', fontSize: 14 }}>
          Assignments due within the next <strong style={{ color: '#42cab3ff' }}>48 hours</strong>.
        </p>
      </div>

      {/* Summary chips */}
      {upcoming.length > 0 && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
          {[
            { label: '🔴 Critical (≤6h)', count: upcoming.filter(a => msLeft(a.dueDate, a.dueTime) / 3600000 <= 6).length, color: '#ef4444' },
            { label: '🟡 Today (≤24h)', count: upcoming.filter(a => { const h = msLeft(a.dueDate, a.dueTime) / 3600000; return h > 6 && h <= 24; }).length, color: '#f59e0b' },
            { label: '🟢 Tomorrow (≤48h)', count: upcoming.filter(a => msLeft(a.dueDate, a.dueTime) / 3600000 > 24).length, color: '#10b981' },
          ].map(chip => (
            <div key={chip.label} style={{
              background: `${chip.color}22`,
              border: `1px solid ${chip.color}55`,
              borderRadius: 8,
              padding: '6px 14px',
              color: chip.color,
              fontSize: 13,
              fontWeight: 600,
            }}>
              {chip.label}: <strong>{chip.count}</strong>
            </div>
          ))}
        </div>
      )}

      {/* Assignment cards */}
      {upcoming.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {upcoming.map(a => {
            const ms = msLeft(a.dueDate, a.dueTime);
            const color = urgencyColor(ms);
            return (
              <div
                key={a.id}
                className="card"
                style={{
                  padding: '22px 26px',
                  borderLeft: `4px solid ${color}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 20,
                  flexWrap: 'wrap',
                }}
              >
                {/* Left: Info */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <h3 style={{ color: 'white', fontSize: 17, margin: 0 }}>{a.title}</h3>
                    <span style={{
                      background: `${color}22`,
                      color,
                      border: `1px solid ${color}55`,
                      borderRadius: 6,
                      padding: '2px 8px',
                      fontSize: 11,
                      fontWeight: 700,
                    }}>{urgencyLabel(ms)}</span>
                  </div>
                  <div style={{ color: '#8892b0', fontSize: 13, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <span>📚 {a.subject}</span>
                    <span>🏫 {a.course}</span>
                    <span>📅 Due: {a.dueDate} at {a.dueTime}</span>
                  </div>
                </div>

                {/* Right: Countdown + CTA */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ color, fontSize: 22, fontWeight: 'bold', marginBottom: 8 }}>
                    {formatTimeLeft(ms)}
                  </div>
                  <button
                    className="submitBtn"
                    style={{ padding: '8px 18px', fontSize: 13 }}
                    onClick={() => navigate('/student/assignments')}
                  >
                    Submit Now →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <h3 style={{ color: 'white', marginBottom: 8 }}>All clear!</h3>
          <p style={{ color: '#8892b0' }}>No assignments due in the next 48 hours. Keep it up!</p>
        </div>
      )}
    </div>
  );
};

export default StudentDeadlines;
