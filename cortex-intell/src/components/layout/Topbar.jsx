import { Search, Bell } from 'lucide-react';
import { CORTEX_DATA } from '../../data/mockData';

function Topbar() {
  const { user } = CORTEX_DATA;

  return (
    <div className="topbar glass">
      {/* Search */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(241,245,249,0.8)',
          borderRadius: '12px',
          padding: '10px 16px',
          border: '1px solid rgba(226,232,240,0.8)',
        }}
      >
        <Search size={16} style={{ color: '#94a3b8' }} />
        <input
          type="text"
          placeholder="Search modules, data, actions..."
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            flex: 1,
            fontSize: '14px',
            color: '#334155',
          }}
          readOnly
        />
        <kbd
          style={{
            background: 'rgba(255,255,255,0.8)',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '2px 8px',
            fontSize: '11px',
            color: '#94a3b8',
            fontFamily: 'inherit',
          }}
        >
          Ctrl K
        </kbd>
      </div>

      {/* Notifications */}
      <div
        style={{
          position: 'relative',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '12px',
          transition: 'background 0.2s',
        }}
      >
        <Bell size={20} style={{ color: '#64748b' }} />
        <span className="notif-dot" />
      </div>

      {/* User Avatar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
        }}
      >
        <div className="avatar">{user.initials}</div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
            {user.name}
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>{user.role}</div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
