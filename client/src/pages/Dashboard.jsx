import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  ClipboardList,
  Clock,
  Play,
  CheckCircle2,
  Filter,
  Search,
  Home,
  CheckSquare,
  Calendar as CalendarIcon,
  BarChart3,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import ProductivityChart from '../components/ProductivityChart';
import UpcomingDeadlines from '../components/UpcomingDeadlines';
import MeetingsCard from '../components/MeetingsCard';
import QuickActions from '../components/QuickActions';
import RecentActivity from '../components/RecentActivity';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';
import TaskDetailModal from '../components/TaskDetailModal';
import FooterHighlights from '../components/FooterHighlights';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState(null);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/tasks');
      if (res.data?.success) {
        setTasks(res.data.data || []);
        if (res.data.stats) {
          setStats(res.data.stats);
        }
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' ? true : task.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchQuery, statusFilter]);

  const recalcStats = (taskList) => {
    const total = taskList.length;
    const pending = taskList.filter((t) => t.status === 'Pending').length;
    const inProgress = taskList.filter((t) => t.status === 'In Progress').length;
    const completed = taskList.filter((t) => t.status === 'Completed').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    setStats({ total, pending, inProgress, completed, completionRate });
  };

  const handleSaveTask = async (formData) => {
    if (taskToEdit) {
      const res = await axiosClient.put(`/tasks/${taskToEdit._id}`, formData);
      if (res.data?.success) {
        const updated = res.data.data;
        const newTaskList = tasks.map((t) =>
          t._id === updated._id ? updated : t
        );
        setTasks(newTaskList);
        recalcStats(newTaskList);
        if (selectedTaskDetail?._id === updated._id) {
          setSelectedTaskDetail(updated);
        }
      }
    } else {
      const res = await axiosClient.post('/tasks', formData);
      if (res.data?.success) {
        const newTask = res.data.data;
        const newTaskList = [newTask, ...tasks];
        setTasks(newTaskList);
        recalcStats(newTaskList);
      }
    }
  };

  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      const res = await axiosClient.put(`/tasks/${task._id}`, {
        status: nextStatus,
      });
      if (res.data?.success) {
        const updated = res.data.data;
        const newTaskList = tasks.map((t) =>
          t._id === updated._id ? updated : t
        );
        setTasks(newTaskList);
        recalcStats(newTaskList);
        if (selectedTaskDetail?._id === updated._id) {
          setSelectedTaskDetail(updated);
        }
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await axiosClient.delete(`/tasks/${taskId}`);
      const newTaskList = tasks.filter((t) => t._id !== taskId);
      setTasks(newTaskList);
      recalcStats(newTaskList);
      if (selectedTaskDetail?._id === taskId) {
        setSelectedTaskDetail(null);
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const displayName = user?.name || 'Vaishnavi';

  // Completion gauge SVG calculation
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (stats.completionRate / 100) * circumference;

  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-wrapper">
        <Navbar globalSearch={searchQuery} setGlobalSearch={setSearchQuery} />

        <main className="content-area">
          {/* Top Greeting Section matching Desktop – Dashboard */}
          <section className="dashboard-top-banner">
            <div className="greeting-text-box">
              <h3>Good evening,</h3>
              <h1>
                <span>{displayName}</span>
                <span>👋</span>
              </h1>
              <p>Here's what's happening with your tasks today.</p>
            </div>

            <div className="dashboard-date-action-row">
              <span className="dashboard-date-badge">Thu, 16 Oct 2026</span>
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
          </section>

          {/* Top Row: 4 Stat Cards + Right Completion Rate Donut Card */}
          <div className="dashboard-stats-row">
            <div className="stat-cards-grid" style={{ flex: 1 }}>
              <StatCard
                title="Total Tasks"
                count={stats.total}
                trend="2%"
                trendColor="green"
                icon={ClipboardList}
                type="total"
              />
              <StatCard
                title="Pending"
                count={stats.pending}
                trend="1%"
                trendColor="orange"
                icon={Clock}
                type="pending"
              />
              <StatCard
                title="In Progress"
                count={stats.inProgress}
                trend="0%"
                trendColor="blue"
                icon={Play}
                type="in-progress"
              />
              <StatCard
                title="Completed"
                count={stats.completed}
                trend="1%"
                trendColor="green"
                icon={CheckCircle2}
                type="completed"
              />
            </div>

            {/* Right Large Circular Gauge Card matching Desktop – Dashboard */}
            <div className="dashboard-card completion-card-hero">
              <div className="donut-chart-box" style={{ width: '110px', height: '110px' }}>
                <svg width="110" height="110" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="#1e224e"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="url(#dashGrad)"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                  />
                  <defs>
                    <linearGradient id="dashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="50%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#c084fc" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="donut-center-text">
                  <span className="percent">{stats.completionRate}%</span>
                  <span className="label">Completion Rate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Row: Productivity Overview, Upcoming Deadlines, Quick Actions */}
          <section className="mid-section-grid">
            <ProductivityChart tasks={tasks} />
            <UpcomingDeadlines
              tasks={tasks}
              onSelectTask={(task) => setSelectedTaskDetail(task)}
            />
            <QuickActions
              onAddTask={() => {
                setTaskToEdit(null);
                setIsModalOpen(true);
              }}
            />
          </section>

          {/* Bottom Row: Today's Tasks, Meetings & Reminders, Recent Activity */}
          <section className="dashboard-bottom-three-grid">
            {/* Today's Tasks */}
            <div className="dashboard-card">
              <div className="card-header-row" style={{ marginBottom: '14px' }}>
                <h3 className="card-title">Today's Tasks</h3>
                <span
                  className="view-all-link"
                  onClick={() => navigate('/tasks')}
                >
                  View All
                </span>
              </div>

              {/* Filters */}
              <div className="tasks-control-bar">
                <div className="filter-pills">
                  {['All', 'Pending', 'In Progress', 'Completed'].map((tab) => (
                    <button
                      key={tab}
                      className={`filter-pill ${
                        statusFilter === tab ? 'active' : ''
                      }`}
                      onClick={() => setStatusFilter(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tasks List */}
              <div className="tasks-table">
                {loading ? (
                  <div className="empty-tasks-state">Loading tasks...</div>
                ) : filteredTasks.length > 0 ? (
                  filteredTasks.slice(0, 5).map((task) => (
                    <TaskItem
                      key={task._id}
                      task={task}
                      onToggleStatus={handleToggleStatus}
                      onEditTask={(t) => {
                        setTaskToEdit(t);
                        setIsModalOpen(true);
                      }}
                      onDeleteTask={handleDeleteTask}
                      onViewTask={(t) => setSelectedTaskDetail(t)}
                    />
                  ))
                ) : (
                  <div className="empty-tasks-state">
                    <p>No tasks matching this filter.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Meetings & Reminders */}
            <MeetingsCard />

            {/* Recent Activity Feed */}
            <RecentActivity />
          </section>
        </main>

        <FooterHighlights />
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveTask}
        taskToEdit={taskToEdit}
        defaultAssignee={displayName}
      />

      <TaskDetailModal
        isOpen={!!selectedTaskDetail}
        onClose={() => setSelectedTaskDetail(null)}
        task={selectedTaskDetail}
        onEdit={(t) => {
          setTaskToEdit(t);
          setIsModalOpen(true);
        }}
        onDelete={handleDeleteTask}
      />
    </div>
  );
};

export default Dashboard;
