import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, PlayCircle, PlusCircle, Trash2 } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      const res = await axiosClient.get('/activity');
      if (res.data?.success) {
        setActivities(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch activities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const formatTime = (isoString) => {
    if (!isoString) return 'Recent';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'completed':
        return <CheckCircle2 size={16} color="#34d399" />;
      case 'in_progress':
        return <PlayCircle size={16} color="#60a5fa" />;
      case 'pending':
        return <Clock size={16} color="#fbbf24" />;
      case 'deleted':
        return <Trash2 size={16} color="#f87171" />;
      default:
        return <PlusCircle size={16} color="#a855f7" />;
    }
  };

  return (
    <div className="dashboard-card">
      <div className="card-header-row" style={{ marginBottom: '14px' }}>
        <h3 className="card-title">Recent Activity</h3>
      </div>

      <div className="activities-list">
        {loading ? (
          <div style={{ color: '#64748b', fontSize: '0.78rem' }}>Loading activity...</div>
        ) : activities.length > 0 ? (
          activities.slice(0, 4).map((act) => (
            <div key={act._id} className="activity-item">
              <div className="activity-icon-box">
                {getActivityIcon(act.type)}
              </div>
              <div className="activity-info">
                <p className="activity-text">{act.details}</p>
                <span className="activity-time">{formatTime(act.createdAt)}</span>
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: '#64748b', fontSize: '0.75rem', padding: '12px 0' }}>
            No recent activity yet. Create or update tasks to see updates here!
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
