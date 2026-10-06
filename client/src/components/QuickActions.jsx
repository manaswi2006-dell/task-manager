import React from 'react';
import { Plus, Calendar, BarChart3, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions = ({ onAddTask }) => {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Add Task',
      icon: Plus,
      onClick: onAddTask,
      color: '#a855f7',
    },
    {
      label: 'View Calendar',
      icon: Calendar,
      onClick: () => navigate('/calendar'),
      color: '#38bdf8',
    },
    {
      label: 'View Analytics',
      icon: BarChart3,
      onClick: () => navigate('/analytics'),
      color: '#fb923c',
    },
    {
      label: 'Profile',
      icon: User,
      onClick: () => navigate('/profile'),
      color: '#34d399',
    },
  ];

  return (
    <div className="dashboard-card">
      <div className="card-header-row" style={{ marginBottom: '16px' }}>
        <h3 className="card-title">Quick Actions</h3>
      </div>

      <div className="quick-actions-list">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.label}
              className="quick-action-btn"
              onClick={act.onClick}
            >
              <div
                className="quick-action-icon"
                style={{ color: act.color, borderColor: `${act.color}40` }}
              >
                <Icon size={16} />
              </div>
              <span className="quick-action-label">{act.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
