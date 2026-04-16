import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  Grid3x3,
  Users,
  UserCog,
  DollarSign,
  TrendingUp,
  Brain,
  FolderKanban,
  Bot,
  BarChart3,
  Database,
  MessageCircle,
  Sparkles,
  FolderPlus,
  FileText,
  UserPlus,
  UserCheck,
  ChevronDown,
  BrainCircuit,
} from 'lucide-react';
import { CORTEX_DATA } from '../../data/mockData';

// Icon mapping from string identifiers to lucide-react components
const iconMap = {
  'home': Home,
  'layout-dashboard': LayoutDashboard,
  'grid-3x3': Grid3x3,
  'users': Users,
  'user-cog': UserCog,
  'dollar-sign': DollarSign,
  'trending-up': TrendingUp,
  'brain': Brain,
  'brain-circuit': BrainCircuit,
  'folder-kanban': FolderKanban,
  'bot': Bot,
  'bar-chart-3': BarChart3,
  'database': Database,
  'message-circle': MessageCircle,
  'sparkles': Sparkles,
  'folder-plus': FolderPlus,
  'file-text': FileText,
  'user-plus': UserPlus,
  'user-check': UserCheck,
};

// Route mapping: original page filenames to React routes
const pageToRoute = {
  'index.html': '/',
  'crm.html': '/crm',
  'hrm.html': '/hrm',
  'finance.html': '/finance',
  'growth.html': '/growth',
  'brain.html': '/brain',
  'projects.html': '/projects',
  'agents.html': '/agents',
  'accounts.html': '/analytics',
  'integration.html': '/data-platform',
  'chatbot.html': '/chatbot',
  'services.html': '/services',
};

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedModules, setExpandedModules] = useState({});

  const currentPath = location.pathname;
  const currentTab = new URLSearchParams(location.search).get('tab');

  const toggleExpand = (id) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getRoute = (page) => pageToRoute[page] || '/';

  const isActive = (item) => {
    const route = getRoute(item.page);
    if (route === '/') {
      return currentPath === '/';
    }
    return currentPath === route;
  };

  const handleNavClick = (item) => {
    if (item.action) {
      // Quick actions - just show a toast-style alert for now
      return;
    }
    const route = getRoute(item.page);
    navigate(route);
  };

  const handleSubClick = (parentItem, sub) => {
    const route = getRoute(parentItem.page);
    navigate(`${route}?tab=${sub.tab}`);
  };

  const renderIcon = (iconName, size = 18) => {
    const IconComponent = iconMap[iconName];
    if (!IconComponent) return null;
    return <IconComponent size={size} />;
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 14px 20px',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/')}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
          }}
        >
          <BrainCircuit size={20} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '15px', color: '#1e293b' }}>
            Cortex Intell
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>
            Enterprise Platform
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      {CORTEX_DATA.navigation.map((group) => (
        <div key={group.group}>
          {group.label && (
            <div className="sidebar-section-label">{group.label}</div>
          )}
          {group.items.map((item) => {
            const hasSubs = item.subs && item.subs.length > 0;
            const active = item.page ? isActive(item) : false;
            const expanded = expandedModules[item.id];

            return (
              <div key={item.id}>
                <div
                  className={`sidebar-link${active ? ' active' : ''}`}
                  onClick={() => {
                    if (hasSubs) {
                      toggleExpand(item.id);
                    } else {
                      handleNavClick(item);
                    }
                  }}
                >
                  {renderIcon(item.icon)}
                  <span style={{ flex: 1 }}>{item.name}</span>
                  {hasSubs && (
                    <ChevronDown
                      size={14}
                      className={`sidebar-chevron${expanded ? ' rotated' : ''}`}
                    />
                  )}
                </div>

                {hasSubs && (
                  <div
                    className={`sidebar-subs${expanded ? ' expanded' : ''}`}
                  >
                    {item.subs.map((sub) => (
                      <div
                        key={sub.tab}
                        className={`sidebar-sub-link${
                          active && currentTab === sub.tab ? ' active' : ''
                        }`}
                        onClick={() => handleSubClick(item, sub)}
                      >
                        <span className="sidebar-sub-dot" />
                        {sub.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </aside>
  );
}

export default Sidebar;
