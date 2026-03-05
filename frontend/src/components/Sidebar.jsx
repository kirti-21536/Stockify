import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';

const Sidebar = ({ role = 'ADMIN', onLogout, username }) => {
  const [expanded, setExpanded] = useState(true);

  const adminLinks = [
    { icon: '📊', label: 'Dashboard', active: true },
    { icon: '📦', label: 'Inventory' },
    { icon: '💰', label: 'Sales & Reports' },
    { icon: '👥', label: 'Staff' },
    { icon: '⚙️', label: 'Settings' }
  ];

  const staffLinks = [
    { icon: '🛒', label: 'Quick Sale', active: true },
    { icon: '📦', label: 'Inventory' },
    { icon: '🧾', label: 'Recent Sales' },
    { icon: '🔔', label: 'Alerts' },
    { icon: '❓', label: 'Help' }
  ];

  const links = role === 'ADMIN' ? adminLinks : staffLinks;

  return (
    <div
      className={`sidebar shadow-lg d-flex flex-column transition-all ${expanded ? 'expanded' : 'collapsed'}`}
      style={{ width: expanded ? '280px' : '80px', minHeight: '100vh', background: '#fff', borderRight: '1px solid #e2e8f0' }}
    >
      <div className="p-4 d-flex align-items-center justify-content-between">
        {expanded && <div className="fs-4 fw-800 text-primary">Stockify</div>}
        <button
          className="btn btn-light btn-sm border-0 p-2"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? '◀' : '▶'}
        </button>
      </div>

      <div className="flex-grow-1 px-3">
        <Nav className="flex-column gap-2">
          {links.map((link, idx) => (
            <Nav.Link
              key={idx}
              className={`sidebar-item d-flex align-items-center gap-3 p-3 rounded-3 transition-all ${link.active ? 'active' : ''}`}
            >
              <span className="fs-5">{link.icon}</span>
              {expanded && <span className="fw-600">{link.label}</span>}
            </Nav.Link>
          ))}
        </Nav>
      </div>

      <div className="p-4 border-top">
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="user-avatar shadow-sm">{username?.[0]?.toUpperCase() || 'U'}</div>
          {expanded && (
            <div className="overflow-hidden">
              <div className="fw-bold text-dark text-truncate">{username}</div>
              <div className="text-muted small fw-600">{role}</div>
            </div>
          )}
        </div>
        <button
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
          onClick={onLogout}
        >
          <span>🚪</span>
          {expanded && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
