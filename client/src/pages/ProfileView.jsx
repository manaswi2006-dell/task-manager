import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Mail,
  Calendar,
  Edit2,
  ClipboardList,
  CheckCircle2,
  Play,
  Clock,
  X,
} from 'lucide-react';
import axiosClient from '../api/axiosClient';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';

const ProfileView = () => {
  const { user, login } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Vaishnavi Lohar',
    email: user?.email || 'vaishnavi@gmail.com',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfileAndStats = async () => {
      try {
        const res = await axiosClient.get('/tasks');
        if (res.data?.stats) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };
    fetchProfileAndStats();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await axiosClient.put('/auth/profile', formData);
      if (res.data?.success) {
        const updated = res.data.data.user;
        localStorage.setItem('user', JSON.stringify(updated));
        setSuccess('Profile updated successfully!');
        setTimeout(() => {
          setIsEditing(false);
          setSuccess(null);
          window.location.reload();
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayName = user?.name || 'Vaishnavi Lohar';
  const displayEmail = user?.email || 'vaishnavi@gmail.com';
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Oct 16, 2026';

  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-wrapper">
        <Navbar />

        <main className="content-area">
          {/* Header */}
          <div className="greeting-section">
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Profile</h1>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
                Manage your account information.
              </p>
            </div>
          </div>

          {/* Profile Card Hero matching Desktop – Profile */}
          <div className="dashboard-card profile-hero-card">
            <div className="profile-hero-content">
              <div className="profile-big-avatar">
                {displayName.charAt(0).toUpperCase()}
              </div>

              <div className="profile-hero-text">
                <h2>{displayName}</h2>
                <p className="profile-hero-email">{displayEmail}</p>
                <span className="profile-member-badge">
                  Member since {memberSince}
                </span>
              </div>

              <button
                className="btn-primary"
                onClick={() => setIsEditing(true)}
                style={{ marginLeft: 'auto', alignSelf: 'center' }}
              >
                <Edit2 size={15} />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* Stats Summary Row */}
          <section className="stat-cards-grid">
            <StatCard
              title="Total Tasks"
              count={stats.total}
              icon={ClipboardList}
              type="total"
            />
            <StatCard
              title="Completed"
              count={stats.completed}
              icon={CheckCircle2}
              type="completed"
            />
            <StatCard
              title="In Progress"
              count={stats.inProgress}
              icon={Play}
              type="in-progress"
            />
            <StatCard
              title="Pending"
              count={stats.pending}
              icon={Clock}
              type="pending"
            />
          </section>

          {/* Account Details Box matching Desktop – Profile */}
          <div className="dashboard-card" style={{ padding: '24px' }}>
            <h3 className="card-title" style={{ marginBottom: '18px' }}>
              Account Details
            </h3>

            <div className="account-details-list">
              <div className="account-detail-row">
                <span className="detail-field-name">Full Name</span>
                <span className="detail-field-val">{displayName}</span>
              </div>

              <div className="account-detail-row">
                <span className="detail-field-name">Email</span>
                <span className="detail-field-val">{displayEmail}</span>
              </div>

              <div className="account-detail-row">
                <span className="detail-field-name">Member Since</span>
                <span className="detail-field-val">{memberSince}</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Profile</h2>
              <button className="close-btn" onClick={() => setIsEditing(false)}>
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="form-error-msg" style={{ marginBottom: '14px' }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ color: '#34d399', fontSize: '0.82rem', marginBottom: '14px' }}>
                {success}
              </div>
            )}

            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
