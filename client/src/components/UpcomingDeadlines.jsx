import React from 'react';

const UpcomingDeadlines = ({ tasks = [], onSelectTask }) => {
  // Filter tasks that have dueDate and are not completed, sorted by due date
  const upcomingTasks = tasks
    .filter((t) => t.dueDate && t.status !== 'Completed')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getBulletColor = (priority) => {
    switch (priority) {
      case 'High':
        return '#f87171';
      case 'Medium':
        return '#fbbf24';
      case 'Low':
        return '#60a5fa';
      default:
        return '#34d399';
    }
  };

  return (
    <div className="dashboard-card">
      <div className="card-header-row">
        <h3 className="card-title">Upcoming Deadlines</h3>
        <span className="view-all-link">View All</span>
      </div>

      <div className="deadlines-list">
        {upcomingTasks.length > 0 ? (
          upcomingTasks.map((task) => (
            <div
              key={task._id}
              className="deadline-item"
              style={{ cursor: 'pointer' }}
              onClick={() => onSelectTask && onSelectTask(task)}
            >
              <div className="deadline-left">
                <span
                  className="deadline-bullet"
                  style={{ background: getBulletColor(task.priority) }}
                ></span>
                <div style={{ minWidth: 0 }}>
                  <div className="deadline-title">{task.title}</div>
                  <div className="deadline-time">{formatDate(task.dueDate)}</div>
                </div>
              </div>
              <span className={`badge-priority ${task.priority?.toLowerCase()}`}>
                {task.priority}
              </span>
            </div>
          ))
        ) : (
          <div style={{ color: '#64748b', fontSize: '0.75rem', padding: '12px 0' }}>
            No upcoming deadlines. Add a task with a due date!
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingDeadlines;
