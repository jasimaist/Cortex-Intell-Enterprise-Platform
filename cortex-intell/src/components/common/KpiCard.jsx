import {
  DollarSign,
  Users,
  TrendingUp,
  Folder,
  BarChart3,
  Brain,
  Bot,
  Database,
  MessageCircle,
} from 'lucide-react';

const kpiIconMap = {
  'dollar-sign': DollarSign,
  'users': Users,
  'trending-up': TrendingUp,
  'folder': Folder,
  'bar-chart-3': BarChart3,
  'brain': Brain,
  'bot': Bot,
  'database': Database,
  'message-circle': MessageCircle,
};

const colorMap = {
  blue: '#3b82f6',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  sky: '#38bdf8',
  cyan: '#22d3ee',
  green: '#22c55e',
  red: '#ef4444',
  orange: '#f97316',
};

function KpiCard({ label, value, delta, sub, icon, color }) {
  const IconComponent = kpiIconMap[icon];
  const accentColor = colorMap[color] || colorMap.blue;

  return (
    <div className="kpi-card card-hover">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
          {label}
        </span>
        {IconComponent && (
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: `${accentColor}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: accentColor,
            }}
          >
            <IconComponent size={18} />
          </div>
        )}
      </div>
      <div style={{ fontSize: '28px', fontWeight: 700, color: '#1e293b' }}>
        {value}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '8px',
        }}
      >
        {delta && (
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: delta.startsWith('+') ? '#16a34a' : '#dc2626',
              background: delta.startsWith('+')
                ? 'rgba(22,163,74,0.1)'
                : 'rgba(220,38,38,0.1)',
              padding: '2px 8px',
              borderRadius: '6px',
            }}
          >
            {delta}
          </span>
        )}
        {sub && (
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>{sub}</span>
        )}
      </div>
    </div>
  );
}

export default KpiCard;
