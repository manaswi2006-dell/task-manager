import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
  Check,
  Eye,
  ChevronDown,
} from 'lucide-react';
import axiosClient from '../api/axiosClient';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import TaskModal from '../components/TaskModal';
import TaskDetailModal from '../components/TaskDetailModal';
import { useAuth } from '../context/AuthContext';

const MyTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [priorityFilter, setPriorityFilter] = useState('All Priority');
  const [sortBy, setSortBy] = useState('Due Date');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [actionMenuId, setActionMenuId] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== 'All Status') params.status = statusFilter;
      if (priorityFilter !== 'All Priority') params.priority = priorityFilter;
      if (sortBy) params.sortBy = sortBy;

      const res = await axiosClient.get('/tasks', { params });
      if (res.data?.success) {
        setTasks(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching tasks in MyTasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search, statusFilter, priorityFilter, sortBy]);

  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      const res = await axiosClient.put(`/tasks/${task._id}`, { status: nextStatus });
      if (res.data?.success) {
        setTasks((prev) =>
          prev.map((t) => (t._id === task._id ? res.data.data : t))
        );
      }
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await axiosClient.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      if (selectedTask?._id === taskId) setSelectedTask(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleSaveTask = async (formData) => {
    if (taskToEdit) {
      const res = await axiosClient.put(`/tasks/${taskToEdit._id}`, formData);
      if (res.data?.success) {
        setTasks((prev) =>
          prev.map((t) => (t._id === taskToEdit._id ? res.data.data : t))
        );
      }
    } else {
      const res = await axiosClient.post('/tasks', formData);
      if (res.data?.success) {
        setTasks((prev) => [res.data.data, ...prev]);
      }
    }
  };

  const formatTaskTime = (dateStr) => {
    if (!dateStr) return 'No due date';
    const d = new Date(dateStr);
    const today = new Date();
    const isToday =
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();

    const timeStr = d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (isToday) return `Today ${timeStr}`;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-wrapper">
        <Navbar globalSearch={search} setGlobalSearch={setSearch} />

        <main className="content-area">
          {/* Header */}
          <div className="greeting-section">
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Tasks</h1>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
                Manage and track all your tasks in one place.
              </p>
            </div>

            <button
              className="btn-primary"
              onClick={() => {
                setTaskToEdit(null);
                setIsModalOpen(true);
              }}
            >
              <Plus size={18} strokeWidth={2.5} />
              <span>Add Task</span>
            </button>
          </div>

          {/* Filter Bar matching Desktop – My Tasks in uploaded screenshot */}
          <div className="mytasks-filter-bar">
            {/* Search Box */}
            <div className="mytasks-search">
              <Search size={15} color="#64748b" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="filter-dropdowns-group">
              <select
                className="custom-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All Status">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              <select
                className="custom-filter-select"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="All Priority">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <select
                className="custom-filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="Due Date">Sort by: Due Date</option>
                <option value="Priority">Sort by: Priority</option>
                <option value="Title">Sort by: Title</option>
                <option value="Newest">Sort by: Newest</option>
              </select>
            </div>
          </div>

          {/* Tasks List */}
          <div className="tasks-table">
            {loading ? (
              <div className="empty-tasks-state">Loading your tasks...</div>
            ) : tasks.length > 0 ? (
              tasks.map((task) => {
                const isCompleted = task.status === 'Completed';
                const assigneeInitial = (task.assignee || 'V')
                  .charAt(0)
                  .toUpperCase();

                return (
                  <div
                    key={task._id}
                    className="task-row"
                    onClick={() => setSelectedTask(task)}
                  >
                    {/* Checkbox */}
                    <div
                      className="task-checkbox-box"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(task);
                      }}
                    >
                      <div className={`custom-checkbox ${isCompleted ? 'checked' : ''}`}>
                        {isCompleted && (
                          <Check size={12} strokeWidth={3} color="#ffffff" />
                        )}
                      </div>
                    </div>

                    {/* Title & Desc */}
                    <div className="task-main-info">
                      <div className={`task-item-title ${isCompleted ? 'completed' : ''}`}>
                        {task.title}
                      </div>
                      {task.description && (
                        <div className="task-item-desc">{task.description}</div>
                      )}
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

                    {/* Due Time */}
                    <div className="task-meta-cell">
                      <Calendar size={13} color="#94a3b8" />
                      <span>{formatTaskTime(task.dueDate)}</span>
                    </div>

                    {/* Assignee Avatar */}
                    <div className="task-assignee-avatar">
                      {assigneeInitial}
                    </div>

                    {/* Actions Menu */}
                    <div
                      style={{ position: 'relative' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="task-actions-btn"
                        onClick={() =>
                          setActionMenuId(actionMenuId === task._id ? null : task._id)
                        }
                      >
                        <MoreVertical size={16} />
                      </button>

                      {actionMenuId === task._id && (
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
                              setActionMenuId(null);
                              setSelectedTask(task);
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
                              setActionMenuId(null);
                              setTaskToEdit(task);
                              setIsModalOpen(true);
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
                              setActionMenuId(null);
                              handleDeleteTask(task._id);
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
              })
            ) : (
              <div className="empty-tasks-state">
                <p>No tasks found.</p>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setTaskToEdit(null);
                    setIsModalOpen(true);
                  }}
                  style={{ fontSize: '0.8rem', padding: '8px 16px' }}
                >
                  <Plus size={15} /> Add New Task
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveTask}
        taskToEdit={taskToEdit}
        defaultAssignee={user?.name || 'Vaishnavi'}
      />

      <TaskDetailModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onEdit={(task) => {
          setTaskToEdit(task);
          setIsModalOpen(true);
        }}
        onDelete={handleDeleteTask}
      />
    </div>
  );
};

export default MyTasks;
