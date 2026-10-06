import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Check,
  Calendar as CalendarIcon,
} from 'lucide-react';
import axiosClient from '../api/axiosClient';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import TaskModal from '../components/TaskModal';
import { useAuth } from '../context/AuthContext';

const CalendarView = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 16)); // October 2026 (matches mockup)
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 9, 16));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await axiosClient.get('/tasks');
      if (res.data?.success) {
        setTasks(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching calendar tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Days in month
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Check if a specific date has tasks
  const hasTasksOnDate = (dayNum) => {
    return tasks.some((t) => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      return (
        d.getDate() === dayNum &&
        d.getMonth() === month &&
        d.getFullYear() === year
      );
    });
  };

  // Filter tasks for selected date
  const selectedDayTasks = tasks.filter((t) => {
    if (!t.dueDate) return false;
    const d = new Date(t.dueDate);
    return (
      d.getDate() === selectedDate.getDate() &&
      d.getMonth() === selectedDate.getMonth() &&
      d.getFullYear() === selectedDate.getFullYear()
    );
  });

  const handleToggleTask = async (task) => {
    const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      const res = await axiosClient.put(`/tasks/${task._id}`, { status: nextStatus });
      if (res.data?.success) {
        setTasks((prev) =>
          prev.map((t) => (t._id === task._id ? res.data.data : t))
        );
      }
    } catch (err) {
      console.error('Toggle status failed:', err);
    }
  };

  const handleCreateTask = async (formData) => {
    const res = await axiosClient.post('/tasks', {
      ...formData,
      dueDate: selectedDate.toISOString(),
    });
    if (res.data?.success) {
      setTasks((prev) => [res.data.data, ...prev]);
    }
  };

  const formattedSelectedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-wrapper">
        <Navbar />

        <main className="content-area">
          {/* Header */}
          <div className="greeting-section">
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Calendar</h1>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
                View your tasks by date and never miss a deadline.
              </p>
            </div>
          </div>

          {/* Calendar Layout matching Desktop – Calendar in uploaded screenshot */}
          <div className="calendar-view-grid">
            {/* Left: Monthly Calendar Box */}
            <div className="dashboard-card calendar-card">
              <div className="calendar-header">
                <span className="calendar-month-title">
                  {monthNames[month]} {year}
                </span>
                <div className="calendar-arrows">
                  <button onClick={handlePrevMonth} className="cal-nav-btn">
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={handleNextMonth} className="cal-nav-btn">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Day of Week Headers */}
              <div className="cal-weekdays-row">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((w) => (
                  <span key={w} className="cal-weekday-label">
                    {w}
                  </span>
                ))}
              </div>

              {/* Calendar Days Matrix */}
              <div className="cal-days-grid">
                {/* Previous month filler days */}
                {Array.from({ length: firstDayIndex }).map((_, idx) => (
                  <div key={`prev-${idx}`} className="cal-day-cell prev-month">
                    {daysInPrevMonth - firstDayIndex + idx + 1}
                  </div>
                ))}

                {/* Current month days */}
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const day = idx + 1;
                  const isSelected =
                    selectedDate.getDate() === day &&
                    selectedDate.getMonth() === month &&
                    selectedDate.getFullYear() === year;

                  const hasTasks = hasTasksOnDate(day);

                  return (
                    <div
                      key={`day-${day}`}
                      className={`cal-day-cell current-month ${
                        isSelected ? 'selected' : ''
                      }`}
                      onClick={() => setSelectedDate(new Date(year, month, day))}
                    >
                      <span>{day}</span>
                      {hasTasks && <span className="cal-task-dot"></span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Selected Day's Tasks */}
            <div className="dashboard-card calendar-day-tasks-card">
              <div className="card-header-row" style={{ marginBottom: '16px' }}>
                <h3 className="card-title">{formattedSelectedDate}</h3>
                <button
                  className="btn-primary"
                  onClick={() => setIsModalOpen(true)}
                  style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                >
                  <Plus size={14} /> Add Task
                </button>
              </div>

              <div className="cal-tasks-list">
                {selectedDayTasks.length > 0 ? (
                  selectedDayTasks.map((task) => {
                    const isCompleted = task.status === 'Completed';
                    const timeString = task.dueDate
                      ? new Date(task.dueDate).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'All Day';

                    return (
                      <div key={task._id} className="cal-task-card">
                        <div
                          className="task-checkbox-box"
                          onClick={() => handleToggleTask(task)}
                        >
                          <div
                            className={`custom-checkbox ${
                              isCompleted ? 'checked' : ''
                            }`}
                          >
                            {isCompleted && (
                              <Check size={12} strokeWidth={3} color="#ffffff" />
                            )}
                          </div>
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4
                            className={`cal-task-title ${
                              isCompleted ? 'completed' : ''
                            }`}
                          >
                            {task.title}
                          </h4>
                          <div className="cal-task-time">
                            <Clock size={12} />
                            <span>{timeString}</span>
                          </div>
                        </div>

                        <span
                          className={`badge-priority ${task.priority?.toLowerCase()}`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-tasks-state" style={{ padding: '40px 10px' }}>
                    <CalendarIcon size={32} color="#64748b" />
                    <p>No tasks scheduled for this date.</p>
                    <button
                      className="btn-primary"
                      onClick={() => setIsModalOpen(true)}
                      style={{ fontSize: '0.78rem', padding: '6px 14px' }}
                    >
                      <Plus size={14} /> Schedule a task
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
        defaultAssignee={user?.name || 'Vaishnavi'}
      />
    </div>
  );
};

export default CalendarView;
