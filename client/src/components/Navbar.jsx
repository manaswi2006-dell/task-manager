import React, { useState } from 'react';
import { Search, Bell, ChevronDown, LogOut, User, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ globalSearch = '', setGlobalSearch }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const displayName = user?.name || 'Vaishnavi';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="top-navbar">
      {/* Search Input */}
      <div className="nav-search-container">
        <Search size={16} color="#94a3b8" />
        <input
          type="text"
          className="nav-search-input"
          placeholder="Search tasks, projects..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch && setGlobalSearch(e.target.value)}
        />
      </div>

      {/* Right Side Actions */}
      <div className="nav-right-actions">
        {/* Notification Bell */}
        <button
          className="icon-badge-btn"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="notification-dot"></span>
        </button>

        {/* Profile Pill matching uploaded screenshot */}
        <div style={{ position: 'relative' }}>
          <button
            className="user-profile-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={displayName}
                className="user-avatar"
              />
            ) : (
              <div className="user-avatar">{initial}</div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
              <span className="user-name-text">{displayName}</span>
              <span className="user-status-online">Online</span>
            </div>
            <ChevronDown size={14} color="#94a3b8" />
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '52px',
                right: '0',
                background: '#16193d',
                border: '1px solid rgba(139, 92, 246, 0.25)',
                borderRadius: '12px',
                padding: '8px',
                minWidth: '180px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                zIndex: 60,
              }}
            >
              <div
                style={{
                  padding: '8px 12px',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  marginBottom: '4px',
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                  {displayName}
                </div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: '#94a3b8',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user?.email}
                </div>
              </div>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/profile');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  background: 'transparent',
                  border: 'none',
                  color: '#e2e8f0',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  borderRadius: '8px',
                  textAlign: 'left',
                }}
              >
                <User size={15} />
                Profile
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/settings');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  background: 'transparent',
                  border: 'none',
                  color: '#e2e8f0',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  borderRadius: '8px',
                  textAlign: 'left',
                }}
              >
                <SettingsIcon size={15} />
                Settings
              </button>
              <button
                onClick={logout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  background: 'transparent',
                  border: 'none',
                  color: '#f87171',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  borderRadius: '8px',
                  textAlign: 'left',
                }}
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
