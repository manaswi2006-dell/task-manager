import React, { useState } from 'react';

const ProductivityChart = ({ tasks = [] }) => {
  const [activeRange, setActiveRange] = useState('Week');

  // Days of week
  const days = [
    { name: 'Mon', value: 45 },
    { name: 'Tue', value: 65 },
    { name: 'Wed', value: 80 },
    { name: 'Thu', value: 55 },
    { name: 'Fri', value: 70 },
    { name: 'Sat', value: 90 },
    { name: 'Sun', value: 60 },
  ];

  // Adjust height subtly based on actual tasks if available
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const multiplier = completedCount > 0 ? Math.min(1.2, 0.7 + completedCount * 0.08) : 0.8;

  return (
    <div className="dashboard-card">
      <div className="card-header-row">
        <h3 className="card-title">Productivity Overview</h3>
        <div className="time-tabs">
          {['Week', 'Month', 'Year'].map((range) => (
            <button
              key={range}
              className={`time-tab ${activeRange === range ? 'active' : ''}`}
              onClick={() => setActiveRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'stretch', gap: '8px', height: '140px' }}>
        {/* Y Axis labels */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontSize: '0.65rem',
            color: '#64748b',
            paddingRight: '6px',
            textAlign: 'right',
          }}
        >
          <span>10</span>
          <span>8</span>
          <span>6</span>
          <span>4</span>
          <span>2</span>
          <span>0</span>
        </div>

        {/* Bars Container */}
        <div className="barchart-container" style={{ flex: 1 }}>
          {days.map((day) => {
            const barHeight = Math.min(100, Math.round(day.value * multiplier));
            return (
              <div key={day.name} className="barchart-col">
                <div
                  className="barchart-bar"
                  style={{
                    height: `${barHeight}%`,
                  }}
                  title={`${day.name}: ${barHeight}% activity`}
                ></div>
                <span className="barchart-day">{day.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductivityChart;
