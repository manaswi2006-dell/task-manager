import React from 'react';

const CompletionCircle = ({ completed = 0, inProgress = 0, pending = 0, total = 0 }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // SVG circular progress calculation
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="dashboard-card">
      <div className="donut-wrapper">
        {/* Circular Gauge */}
        <div className="donut-chart-box">
          <svg width="120" height="120" viewBox="0 0 120 120">
            {/* Background track circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="#1e224e"
              strokeWidth="9"
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="url(#gradientStroke)"
              strokeWidth="9"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
            <defs>
              <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
            </defs>
          </svg>

          <div className="donut-center-text">
            <span className="percent">{percentage}%</span>
            <span className="label">Task Completion</span>
          </div>
        </div>

        {/* Legend */}
        <div className="donut-legend">
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#38bdf8' }}></span>
            <span>Completed</span>
            <span className="legend-count">{completed}</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#a855f7' }}></span>
            <span>In Progress</span>
            <span className="legend-count">{inProgress}</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#f97316' }}></span>
            <span>Pending</span>
            <span className="legend-count">{pending}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionCircle;
