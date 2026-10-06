import React from 'react';
import { X, Calendar, Flag, Clock, User, Trash2, Edit2 } from 'lucide-react';

const TaskDetailModal = ({ isOpen, onClose, task, onEdit, onDelete }) => {
  if (!isOpen || !task) return null;

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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '440px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header" style={{ marginBottom: '14px' }}>
          <h2 className="modal-title" style={{ fontSize: '1.1rem' }}>
            {task.title}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Description */}
        <p
          style={{
            color: '#94a3b8',
            fontSize: '0.8rem',
            lineHeight: 1.5,
            marginBottom: '20px',
          }}
        >
          {task.description || 'No description provided.'}
        </p>

        {/* Metadata Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          {/* Due Date */}
          <div className="detail-row">
            <span className="detail-label">
              <Calendar size={14} /> Due Date
            </span>
            <span className="detail-val">{formatDueDate(task.dueDate)}</span>
          </div>

          {/* Priority */}
          <div className="detail-row">
            <span className="detail-label">
              <Flag size={14} /> Priority
            </span>
            <span className={`badge-priority ${task.priority?.toLowerCase()}`}>
              {task.priority}
            </span>
          </div>

          {/* Status */}
          <div className="detail-row">
            <span className="detail-label">
              <Clock size={14} /> Status
            </span>
            <span
              className={`badge-status ${task.status
                ?.toLowerCase()
                .replace(' ', '-')}`}
            >
              {task.status}
            </span>
          </div>

          {/* Assignee */}
          <div className="detail-row">
            <span className="detail-label">
              <User size={14} /> Assignee
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="task-assignee-avatar">
                {assigneeName.charAt(0).toUpperCase()}
              </div>
              <span className="detail-val">{assigneeName}</span>
            </div>
          </div>
        </div>

        {/* Bottom Actions matching uploaded screenshot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="btn-primary"
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => {
              onClose();
              onEdit(task);
            }}
          >
            <Edit2 size={15} />
            Edit Task
          </button>
          <button
            className="btn-danger"
            style={{ padding: '10px 14px' }}
            onClick={() => {
              onClose();
              onDelete(task._id);
            }}
            title="Delete Task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
