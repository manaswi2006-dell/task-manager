import React from 'react';
import { ArrowUp } from 'lucide-react';

const StatCard = ({ title, count, trend, trendColor = 'green', icon: Icon, type }) => {
  return (
    <div className="stat-card">
      <div className={`stat-icon-wrapper ${type}`}>
        <Icon size={20} />
      </div>
      <div className="stat-info">
        <div className="stat-title">{title}</div>
        <div className="stat-value-row">
          <div className="stat-value">{count}</div>
          {trend && (
            <div className={`stat-trend ${trendColor}`}>
              <ArrowUp size={11} strokeWidth={2.5} />
              <span>{trend}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
