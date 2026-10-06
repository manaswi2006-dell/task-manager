import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  CheckCircle2,
  Play,
  Clock,
  TrendingUp,
} from 'lucide-react';
import axiosClient from '../api/axiosClient';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';

const AnalyticsView = () => {
  const [data, setData] = useState({
    summary: {
      total: 0,
      completed: 0,
      inProgress: 0,
      pending: 0,
      completionRate: 0,
      weeklyTrend: '+12% from last week',
    },
    priorityBreakdown: {
      high: 0,
      medium: 0,
      low: 0,
    },
    statusBreakdown: {
      completed: 0,
      inProgress: 0,
      pending: 0,
    },
    weeklyProductivity: [
      { day: 'Mon', value: 35 },
      { day: 'Tue', value: 60 },
      { day: 'Wed', value: 85 },
      { day: 'Thu', value: 50 },
      { day: 'Fri', value: 75 },
      { day: 'Sat', value: 95 },
      { day: 'Sun', value: 45 },
    ],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axiosClient.get('/analytics');
        if (res.data?.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const { summary, priorityBreakdown, statusBreakdown, weeklyProductivity } = data;

  // Circular gauge calculation
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (summary.completionRate / 100) * circumference;

  // Donut chart by priority calculation
  const totalPriority =
    priorityBreakdown.high + priorityBreakdown.medium + priorityBreakdown.low || 1;
  const highPercent = (priorityBreakdown.high / totalPriority) * 100;
  const medPercent = (priorityBreakdown.medium / totalPriority) * 100;
  const lowPercent = (priorityBreakdown.low / totalPriority) * 100;

  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-wrapper">
        <Navbar />

        <main className="content-area">
          {/* Header */}
          <div className="greeting-section">
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Analytics</h1>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
                Track your productivity and performance.
              </p>
            </div>
          </div>

          {/* Top 4 Stat Cards */}
          <section className="stat-cards-grid">
            <StatCard
              title="Total Tasks"
              count={summary.total}
              icon={ClipboardList}
              type="total"
            />
            <StatCard
              title="Completed"
              count={summary.completed}
              icon={CheckCircle2}
              type="completed"
            />
            <StatCard
              title="In Progress"
              count={summary.inProgress}
              icon={Play}
              type="in-progress"
            />
            <StatCard
              title="Pending"
              count={summary.pending}
              icon={Clock}
              type="pending"
            />
          </section>

          {/* Middle 3 Analytics Cards matching Desktop – Analytics */}
          <section className="analytics-breakdown-grid">
            {/* 1. Task Completion Rate */}
            <div className="dashboard-card" style={{ alignItems: 'center', textAlign: 'center' }}>
              <div className="card-header-row" style={{ width: '100%', marginBottom: '8px' }}>
                <h3 className="card-title">Task Completion Rate</h3>
              </div>

              <div className="donut-chart-box" style={{ margin: '14px 0' }}>
                <svg width="126" height="126" viewBox="0 0 120 120">
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
                    stroke="url(#analyticsGradient)"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                  />
                  <defs>
                    <linearGradient id="analyticsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#c084fc" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="donut-center-text">
                  <span className="percent">{summary.completionRate}%</span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#34d399',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  marginTop: 'auto',
                }}
              >
                <TrendingUp size={14} />
                <span>{summary.weeklyTrend}</span>
              </div>
            </div>

            {/* 2. Tasks by Priority */}
            <div className="dashboard-card">
              <div className="card-header-row" style={{ marginBottom: '12px' }}>
                <h3 className="card-title">Tasks by Priority</h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '100%' }}>
                {/* Visual ring */}
                <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                  <svg width="100" height="100" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="transparent"
                      stroke="#1e224e"
                      strokeWidth="4"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="transparent"
                      stroke="#f87171"
                      strokeWidth="4"
                      strokeDasharray={`${highPercent} ${100 - highPercent}`}
                      strokeDashoffset="25"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="transparent"
                      stroke="#fbbf24"
                      strokeWidth="4"
                      strokeDasharray={`${medPercent} ${100 - medPercent}`}
                      strokeDashoffset={`${25 - highPercent}`}
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="transparent"
                      stroke="#60a5fa"
                      strokeWidth="4"
                      strokeDasharray={`${lowPercent} ${100 - lowPercent}`}
                      strokeDashoffset={`${25 - highPercent - medPercent}`}
                    />
                  </svg>
                </div>

                {/* Priority Legend */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="legend-item">
                    <span className="legend-dot" style={{ background: '#f87171' }}></span>
                    <span>High</span>
                    <span className="legend-count">{priorityBreakdown.high}</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot" style={{ background: '#fbbf24' }}></span>
                    <span>Medium</span>
                    <span className="legend-count">{priorityBreakdown.medium}</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot" style={{ background: '#60a5fa' }}></span>
                    <span>Low</span>
                    <span className="legend-count">{priorityBreakdown.low}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Tasks by Status */}
            <div className="dashboard-card">
              <div className="card-header-row" style={{ marginBottom: '14px' }}>
                <h3 className="card-title">Tasks by Status</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399' }}></span>
                    <span>Completed</span>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{statusBreakdown.completed}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#60a5fa' }}></span>
                    <span>In Progress</span>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{statusBreakdown.inProgress}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fbbf24' }}></span>
                    <span>Pending</span>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{statusBreakdown.pending}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom Card: Weekly Productivity Wave Chart */}
          <section className="dashboard-card" style={{ padding: '24px' }}>
            <div className="card-header-row" style={{ marginBottom: '20px' }}>
              <h3 className="card-title">Weekly Productivity</h3>
            </div>

            <div style={{ height: '180px', width: '100%', position: 'relative' }}>
              <svg width="100%" height="100%" viewBox="0 0 700 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Curved Area fill */}
                <path
                  d="M 50 120 Q 150 40 250 20 T 450 60 T 650 30 L 650 150 L 50 150 Z"
                  fill="url(#areaGradient)"
                />

                {/* Main line */}
                <path
                  d="M 50 120 Q 150 40 250 20 T 450 60 T 650 30"
                  fill="none"
                  stroke="#c084fc"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Points */}
                {[
                  { cx: 50, cy: 120 },
                  { cx: 150, cy: 60 },
                  { cx: 250, cy: 20 },
                  { cx: 350, cy: 90 },
                  { cx: 450, cy: 50 },
                  { cx: 550, cy: 25 },
                  { cx: 650, cy: 30 },
                ].map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.cx}
                    cy={pt.cy}
                    r="4.5"
                    fill="#a855f7"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                ))}
              </svg>
            </div>

            {/* X-axis labels */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0 40px',
                fontSize: '0.75rem',
                color: '#64748b',
                marginTop: '10px',
              }}
            >
              {weeklyProductivity.map((item) => (
                <span key={item.day}>{item.day}</span>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsView;
