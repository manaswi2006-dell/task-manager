import React from 'react';
import { Zap, ShieldCheck, Database, Cloud, Code } from 'lucide-react';

const FooterHighlights = () => {
  const highlights = [
    {
      icon: Zap,
      title: 'Modern UI/UX',
      desc: 'Clean • Fast • Responsive',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Authentication',
      desc: 'JWT • Bcrypt • Protected Routes',
    },
    {
      icon: Database,
      title: 'MongoDB Database',
      desc: 'Reliable • Scalable',
    },
    {
      icon: Cloud,
      title: 'Cloud Deployment',
      desc: 'Vercel / Render • MongoDB Atlas',
    },
    {
      icon: Code,
      title: 'MERN Stack',
      desc: 'React • Express • Node • MongoDB',
    },
  ];

  return (
    <footer className="footer-highlights-bar">
      {highlights.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className="highlight-item">
            <div className="highlight-icon">
              <Icon size={16} />
            </div>
            <div className="highlight-text">
              <h6>{item.title}</h6>
              <p>{item.desc}</p>
            </div>
          </div>
        );
      })}
    </footer>
  );
};

export default FooterHighlights;
