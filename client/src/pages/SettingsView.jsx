import React, { useState } from 'react';
import {
  Moon,
  Sun,
  User,
  KeyRound,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  X,
  Check,
} from 'lucide-react';
import axiosClient from '../api/axiosClient';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SettingsView = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Settings State
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [deadlineReminders, setDeadlineReminders] = useState(true);

  // Modals
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  // Help Modal
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    setIsPasswordSubmitting(true);
    try {
      const res = await axiosClient.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (res.data?.success) {
        setPasswordSuccess('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setPasswordSuccess(null);
        }, 1500);
      }
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || 'Failed to change password'
      );
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-wrapper">
        <Navbar />

        <main className="content-area">
          {/* Header */}
          <div className="greeting-section">
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Settings</h1>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
                Customize your experience.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '720px' }}>
            {/* Appearance Section matching Desktop – Settings */}
            <div className="dashboard-card" style={{ padding: '22px' }}>
              <h3 className="card-title" style={{ marginBottom: '16px' }}>
                Appearance
              </h3>

              <div className="settings-item-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Moon size={18} color="#a855f7" />
                  <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>Dark Mode</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={isDarkMode}
                    onChange={() => setIsDarkMode(!isDarkMode)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="settings-item-row" style={{ borderBottom: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sun size={18} color="#94a3b8" />
                  <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#94a3b8' }}>
                    Light Mode
                  </span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Experimental</span>
              </div>
            </div>

            {/* Account Section matching Desktop – Settings */}
            <div className="dashboard-card" style={{ padding: '22px' }}>
              <h3 className="card-title" style={{ marginBottom: '16px' }}>
                Account
              </h3>

              {/* Edit Profile */}
              <div
                className="settings-action-row"
                onClick={() => navigate('/profile')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <User size={18} color="#60a5fa" />
                  <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>
                    Edit Profile
                  </span>
                </div>
                <ChevronRight size={18} color="#64748b" />
              </div>

              {/* Change Password */}
              <div
                className="settings-action-row"
                onClick={() => setIsPasswordModalOpen(true)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <KeyRound size={18} color="#fbbf24" />
                  <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>
                    Change Password
                  </span>
                </div>
                <ChevronRight size={18} color="#64748b" />
              </div>

              {/* Notification Preferences */}
              <div
                className="settings-action-row"
                style={{ borderBottom: 'none' }}
                onClick={() => setIsNotifModalOpen(true)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Bell size={18} color="#a855f7" />
                  <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>
                    Notification Preferences
                  </span>
                </div>
                <ChevronRight size={18} color="#64748b" />
              </div>
            </div>

            {/* Others Section matching Desktop – Settings */}
            <div className="dashboard-card" style={{ padding: '22px' }}>
              <h3 className="card-title" style={{ marginBottom: '16px' }}>
                Others
              </h3>

              <div
                className="settings-action-row"
                onClick={() => setIsHelpOpen(true)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <HelpCircle size={18} color="#34d399" />
                  <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>
                    Help & Support
                  </span>
                </div>
                <ChevronRight size={18} color="#64748b" />
              </div>

              {/* Logout Button matching red outline button in mockup */}
              <div style={{ paddingTop: '16px' }}>
                <button
                  className="btn-danger-outline"
                  onClick={() => {
                    if (window.confirm('Do you want to log out?')) {
                      logout();
                    }
                  }}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsPasswordModalOpen(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Change Password</h2>
              <button
                className="close-btn"
                onClick={() => setIsPasswordModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            {passwordError && (
              <div className="form-error-msg" style={{ marginBottom: '14px' }}>
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div
                style={{
                  color: '#34d399',
                  fontSize: '0.82rem',
                  marginBottom: '14px',
                }}
              >
                {passwordSuccess}
              </div>
            )}

            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsPasswordModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isPasswordSubmitting}
                >
                  {isPasswordSubmitting ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {isNotifModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsNotifModalOpen(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Notification Preferences</h2>
              <button
                className="close-btn"
                onClick={() => setIsNotifModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div className="settings-item-row" style={{ padding: '8px 0' }}>
                <span style={{ fontSize: '0.85rem' }}>Email Notifications</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={() => setEmailAlerts(!emailAlerts)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="settings-item-row" style={{ padding: '8px 0', borderBottom: 'none' }}>
                <span style={{ fontSize: '0.85rem' }}>Deadline Reminders</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={deadlineReminders}
                    onChange={() => setDeadlineReminders(!deadlineReminders)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => setIsNotifModalOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {isHelpOpen && (
        <div className="modal-overlay" onClick={() => setIsHelpOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Help & Support</h2>
              <button
                className="close-btn"
                onClick={() => setIsHelpOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '16px' }}>
              TaskFlow is designed for high-performance productivity.
            </p>

            <div style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div><strong>Dashboard:</strong> Overview of metrics, upcoming deadlines, and live activity.</div>
              <div><strong>My Tasks:</strong> Complete management, filter by status or priority, and sort.</div>
              <div><strong>Calendar:</strong> Schedule and inspect tasks by date.</div>
              <div><strong>Analytics:</strong> Productivity curves, completion percentages, and priority distribution.</div>
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '20px' }}
              onClick={() => setIsHelpOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
