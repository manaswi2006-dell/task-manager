import React from 'react';
import { Video, Calendar, Bell } from 'lucide-react';

const MeetingsCard = () => {
  const meetings = [
    {
      id: 1,
      title: 'Team Standup',
      time: 'Today - 11:00 AM',
      icon: Video,
    },
    {
      id: 2,
      title: 'Client Review',
      time: 'Today - 03:30 PM',
      icon: Calendar,
    },
    {
      id: 3,
      title: 'Weekly Planning',
      time: 'Tomorrow - 10:00 AM',
      icon: Bell,
    },
  ];

  return (
    <div className="dashboard-card">
      <div className="card-header-row">
        <h3 className="card-title">Meetings & Reminders</h3>
        <span className="view-all-link">View All</span>
      </div>

      <div className="meetings-list">
        {meetings.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="meeting-item">
              <div className="meeting-icon-box">
                <Icon size={16} />
              </div>
              <div className="meeting-details">
                <h5>{item.title}</h5>
                <p>{item.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MeetingsCard;
