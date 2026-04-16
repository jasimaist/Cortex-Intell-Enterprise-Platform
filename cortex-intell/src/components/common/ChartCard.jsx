function ChartCard({ title, badge, children, height = '280px' }) {
  return (
    <div
      className="glass card-hover"
      style={{
        borderRadius: '16px',
        padding: '20px',
        height,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <span style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>
          {title}
        </span>
        {badge && (
          <span className="badge badge-blue">{badge}</span>
        )}
      </div>
      <div style={{ flex: 1, position: 'relative' }}>{children}</div>
    </div>
  );
}

export default ChartCard;
