import React, { useState } from 'react';
import { Check, Calendar, MoreVertical, Edit2, Trash2, Eye } from 'lucide-react';

const TaskItem = ({
  task,
  onToggleStatus,
  onEditTask,
  onDeleteTask,
  onViewTask,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const isCompleted = task.status === 'Completed';

  const formatDueDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const assigneeName = task.assignee || 'User';
  const assigneeInitial = assigneeName.charAt(0).toUpperCase();

  return (
    <div
      className="task-row"
      onClick={(e) => {
        // Only open detail view if not clicking interactive buttons
        if (!e.target.closest('button') && !e.target.closest('.task-checkbox-box')) {
          onViewTask(task);
        }
      }}
    >
      {/* Checkbox */}
      <div
        className="task-checkbox-box"
        onClick={(e) => {
          e.stopPropagation();
          onToggleStatus(task);
        }}
        title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
      >
        <div className={`custom-checkbox ${isCompleted ? 'checked' : ''}`}>
          {isCompleted && <Check size={12} strokeWidth={3} color="#ffffff" />}
        </div>
      </div>

      {/* Title & Description */}
      <div className="task-main-info">
        <div className={`task-item-title ${isCompleted ? 'completed' : ''}`}>
          {task.title}
        </div>
        {task.description && (
          <div className="task-item-desc">{task.description}</div>
        )}
      </div>

      {/* Due Date */}
      <div className="task-meta-cell">
        <Calendar size={13} color="#94a3b8" />
        <span>{formatDueDate(task.dueDate)}</span>
      </div>

      {/* Priority Badge */}
      <span className={`badge-priority ${task.priority?.toLowerCase()}`}>
        {task.priority}
      </span>

      {/* Status Badge */}
      <span
        className={`badge-status ${task.status
          ?.toLowerCase()
          .replace(' ', '-')}`}
      >
        {task.status}
      </span>

      {/* Assignee Avatar */}
      <div className="task-assignee-avatar" title={`Assigned to ${assigneeName}`}>
        {assigneeInitial}
      </div>

      {/* Actions (Three dots menu) */}
      <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
        <button
          className="task-actions-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          title="Task Options"
        >
          <MoreVertical size={16} />
        </button>

        {menuOpen && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: '28px',
              background: '#16193d',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              borderRadius: '10px',
              padding: '6px',
              minWidth: '120px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
              zIndex: 35,
            }}
          >
            <button
              onClick={() => {
                setMenuOpen(false);
                onViewTask(task);
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 10px',
                background: 'transparent',
                border: 'none',
                color: '#e2e8f0',
                fontSize: '0.78rem',
                cursor: 'pointer',
                borderRadius: '6px',
              }}
            >
              <Eye size={13} /> View
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                onEditTask(task);
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 10px',
                background: 'transparent',
                border: 'none',
                color: '#60a5fa',
                fontSize: '0.78rem',
                cursor: 'pointer',
                borderRadius: '6px',
              }}
            >
              <Edit2 size={13} /> Edit
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                onDeleteTask(task._id);
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 10px',
                background: 'transparent',
                border: 'none',
                color: '#f87171',
                fontSize: '0.78rem',
                cursor: 'pointer',
                borderRadius: '6px',
              }}
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
