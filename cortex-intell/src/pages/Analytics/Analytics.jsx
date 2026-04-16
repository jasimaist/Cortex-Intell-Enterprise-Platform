import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import {
  BarChart3, LayoutDashboard, FileText, Target, Monitor, Code2, Bell,
  TrendingUp, Activity, Sparkles, ChevronRight, Download, Plus,
  Filter, Search, Eye, MoreHorizontal, Clock, CheckCircle,
  AlertTriangle, ArrowUp, ArrowDown, Minus, Users, DollarSign,
  Zap, Shield, RefreshCw, Gauge, PieChart, LineChart,
} from 'lucide-react';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

/* ============================================================
   CHART OPTIONS HELPERS
   ============================================================ */
const lineDefaults = (yCallback) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' } },
  scales: {
    y: { grid: { color: '#f1f5f9' }, ticks: { callback: yCallback } },
    x: { grid: { display: false } },
  },
});

const doughnutDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'right', labels: { boxWidth: 10, font: { size: 11 } } } },
  cutout: '60%',
};

/* ============================================================
   STATIC DATA
   ============================================================ */
const subModuleCards = [
  { tab: 'dashboards', icon: LayoutDashboard, label: 'Dashboards', sub: '32 Live', bg: 'bg-blue-100', text: 'text-blue-600' },
  { tab: 'reports', icon: FileText, label: 'Reports', sub: '156 Reports', bg: 'bg-indigo-100', text: 'text-indigo-600' },
  { tab: 'kpis', icon: Target, label: 'KPIs', sub: '48 Tracked', bg: 'bg-violet-100', text: 'text-violet-600' },
  { tab: 'command', icon: Monitor, label: 'Command Centre', sub: 'Real-Time', bg: 'bg-sky-100', text: 'text-sky-600' },
  { tab: 'embedded', icon: Code2, label: 'Embedded', sub: '6 Widgets', bg: 'bg-orange-100', text: 'text-orange-600' },
  { tab: 'alerts', icon: Bell, label: 'Alerts', sub: '12 Active', bg: 'bg-cyan-100', text: 'text-cyan-600' },
];

const dashboardGallery = [
  { name: 'Executive Overview', views: '2.4K', creator: 'Rania J.', avatar: 'RJ', category: 'Executive', grad: 'from-blue-500 to-indigo-600', updated: '2h ago', widgets: 12, favorite: true },
  { name: 'Sales Pipeline', views: '1.8K', creator: 'Tom B.', avatar: 'TB', category: 'Sales', grad: 'from-indigo-500 to-violet-600', updated: '4h ago', widgets: 9, favorite: true },
  { name: 'Finance Summary', views: '1.2K', creator: 'Elena R.', avatar: 'ER', category: 'Finance', grad: 'from-violet-500 to-purple-600', updated: '1d ago', widgets: 15, favorite: false },
  { name: 'HR & People', views: '890', creator: 'Elena R.', avatar: 'ER', category: 'HR', grad: 'from-sky-500 to-cyan-600', updated: '6h ago', widgets: 8, favorite: false },
  { name: 'Marketing Performance', views: '1.5K', creator: 'Anna K.', avatar: 'AK', category: 'Marketing', grad: 'from-orange-500 to-red-500', updated: '3h ago', widgets: 11, favorite: true },
  { name: 'Agent Monitor', views: '640', creator: 'James W.', avatar: 'JW', category: 'Operations', grad: 'from-green-500 to-emerald-600', updated: '12h ago', widgets: 7, favorite: false },
];

const reportsList = [
  { name: 'Monthly Revenue Report', type: 'Financial', typeBadge: 'badge-blue', schedule: 'Monthly', lastRun: 'Apr 1, 2026', status: 'Completed', statusBadge: 'badge-green', format: 'PDF', pages: 24 },
  { name: 'Pipeline Health Analysis', type: 'Sales', typeBadge: 'badge-indigo', schedule: 'Weekly', lastRun: 'Apr 14, 2026', status: 'Completed', statusBadge: 'badge-green', format: 'Excel', pages: 12 },
  { name: 'Customer Satisfaction Survey', type: 'CRM', typeBadge: 'badge-violet', schedule: 'Quarterly', lastRun: 'Mar 31, 2026', status: 'Completed', statusBadge: 'badge-green', format: 'PDF', pages: 18 },
  { name: 'Employee Engagement Index', type: 'HR', typeBadge: 'badge-sky', schedule: 'Monthly', lastRun: 'Apr 1, 2026', status: 'Completed', statusBadge: 'badge-green', format: 'PDF', pages: 15 },
  { name: 'Campaign ROI Analysis', type: 'Marketing', typeBadge: 'badge-orange', schedule: 'Weekly', lastRun: 'Apr 14, 2026', status: 'Running', statusBadge: 'badge-yellow', format: 'Excel', pages: 8 },
  { name: 'Agent Performance Report', type: 'Operations', typeBadge: 'badge-green', schedule: 'Daily', lastRun: 'Apr 16, 2026', status: 'Completed', statusBadge: 'badge-green', format: 'PDF', pages: 6 },
  { name: 'Cash Flow Forecast', type: 'Financial', typeBadge: 'badge-blue', schedule: 'Weekly', lastRun: 'Apr 14, 2026', status: 'Completed', statusBadge: 'badge-green', format: 'Excel', pages: 10 },
  { name: 'Compliance Audit Trail', type: 'Governance', typeBadge: 'badge-red', schedule: 'Monthly', lastRun: 'Apr 1, 2026', status: 'Scheduled', statusBadge: 'badge-blue', format: 'PDF', pages: 32 },
];

const kpiBoard = [
  { name: 'Revenue Growth', target: '$4.2M', actual: '$3.92M', trend: 'up', trendPct: '+12.5%', status: 'On Track', statusColor: 'text-green-600', category: 'Finance', progress: 93 },
  { name: 'Customer Acquisition', target: '60', actual: '52', trend: 'up', trendPct: '+8.3%', status: 'Slightly Behind', statusColor: 'text-yellow-600', category: 'Sales', progress: 87 },
  { name: 'Employee Retention', target: '95%', actual: '92%', trend: 'down', trendPct: '-1.2%', status: 'At Risk', statusColor: 'text-red-500', category: 'HR', progress: 97 },
  { name: 'Pipeline Value', target: '$1.5M', actual: '$1.18M', trend: 'up', trendPct: '+18.7%', status: 'On Track', statusColor: 'text-green-600', category: 'Sales', progress: 79 },
  { name: 'CSAT Score', target: '95%', actual: '94%', trend: 'up', trendPct: '+2.1%', status: 'On Track', statusColor: 'text-green-600', category: 'CRM', progress: 99 },
  { name: 'Agent Success Rate', target: '99%', actual: '98.4%', trend: 'up', trendPct: '+1.2%', status: 'On Track', statusColor: 'text-green-600', category: 'Operations', progress: 99 },
  { name: 'Marketing ROI', target: '4.0x', actual: '3.8x', trend: 'up', trendPct: '+0.6x', status: 'On Track', statusColor: 'text-green-600', category: 'Marketing', progress: 95 },
  { name: 'Data Quality Score', target: '99.5%', actual: '99.2%', trend: 'flat', trendPct: '0%', status: 'Monitoring', statusColor: 'text-blue-600', category: 'Data', progress: 100 },
];

const alertConfigs = [
  { id: 'ALT-001', name: 'Revenue Below Target', severity: 'Critical', severityBadge: 'badge-red', condition: 'Monthly revenue < $3.5M', channel: 'Email + Slack', status: 'Active', statusBadge: 'badge-green', lastTriggered: 'Never' },
  { id: 'ALT-002', name: 'Pipeline Drop Alert', severity: 'High', severityBadge: 'badge-orange', condition: 'Pipeline value drops > 15%', channel: 'Email + SMS', status: 'Active', statusBadge: 'badge-green', lastTriggered: '2 weeks ago' },
  { id: 'ALT-003', name: 'Agent Failure Spike', severity: 'Critical', severityBadge: 'badge-red', condition: 'Error rate > 5%', channel: 'Slack + PagerDuty', status: 'Active', statusBadge: 'badge-green', lastTriggered: 'Never' },
  { id: 'ALT-004', name: 'SLA Breach Warning', severity: 'High', severityBadge: 'badge-orange', condition: 'Case open > 24 hours', channel: 'Email', status: 'Active', statusBadge: 'badge-green', lastTriggered: '3 days ago' },
  { id: 'ALT-005', name: 'Budget Overrun', severity: 'Medium', severityBadge: 'badge-yellow', condition: 'Dept spend > 90% budget', channel: 'Email', status: 'Active', statusBadge: 'badge-green', lastTriggered: '1 week ago' },
  { id: 'ALT-006', name: 'Churn Risk Detected', severity: 'High', severityBadge: 'badge-orange', condition: 'Customer health score < 40', channel: 'Email + Slack', status: 'Active', statusBadge: 'badge-green', lastTriggered: '5 days ago' },
  { id: 'ALT-007', name: 'Data Pipeline Failure', severity: 'Critical', severityBadge: 'badge-red', condition: 'Pipeline sync fails', channel: 'Slack + PagerDuty', status: 'Active', statusBadge: 'badge-green', lastTriggered: '2 days ago' },
  { id: 'ALT-008', name: 'Low Engagement Score', severity: 'Medium', severityBadge: 'badge-yellow', condition: 'Employee mood < 70', channel: 'Email', status: 'Paused', statusBadge: 'badge-yellow', lastTriggered: '1 month ago' },
  { id: 'ALT-009', name: 'Campaign ROI Drop', severity: 'Medium', severityBadge: 'badge-yellow', condition: 'Campaign ROI < 1.5x', channel: 'Email', status: 'Active', statusBadge: 'badge-green', lastTriggered: '10 days ago' },
  { id: 'ALT-010', name: 'Security Anomaly', severity: 'Critical', severityBadge: 'badge-red', condition: 'Unusual login pattern', channel: 'Slack + SMS + PagerDuty', status: 'Active', statusBadge: 'badge-green', lastTriggered: 'Never' },
  { id: 'ALT-011', name: 'Invoice Overdue', severity: 'Medium', severityBadge: 'badge-yellow', condition: 'Invoice past due > 7 days', channel: 'Email', status: 'Active', statusBadge: 'badge-green', lastTriggered: '2 days ago' },
  { id: 'ALT-012', name: 'Project Deadline Risk', severity: 'High', severityBadge: 'badge-orange', condition: 'Project < 50% at midpoint', channel: 'Email + Slack', status: 'Active', statusBadge: 'badge-green', lastTriggered: '4 days ago' },
];

const alertHistory = [
  { time: '2 days ago', alert: 'Data Pipeline Failure', severity: 'Critical', severityBadge: 'badge-red', message: 'Gmail -> CRM pipeline sync failed, auto-retry initiated', resolved: true },
  { time: '2 days ago', alert: 'Invoice Overdue', severity: 'Medium', severityBadge: 'badge-yellow', message: 'Horizon Group INV-2845 past due by 19 days', resolved: false },
  { time: '3 days ago', alert: 'SLA Breach Warning', severity: 'High', severityBadge: 'badge-orange', message: 'Case CS-1040 open > 24h, escalated to manager', resolved: true },
  { time: '4 days ago', alert: 'Project Deadline Risk', severity: 'High', severityBadge: 'badge-orange', message: 'Project Alpha at 68% with 34 days remaining', resolved: false },
  { time: '5 days ago', alert: 'Churn Risk Detected', severity: 'High', severityBadge: 'badge-orange', message: 'Horizon Group health score dropped to 38', resolved: false },
  { time: '1 week ago', alert: 'Budget Overrun', severity: 'Medium', severityBadge: 'badge-yellow', message: 'Marketing dept at 84% of Q2 budget', resolved: true },
];

/* ============================================================
   CHART DATA
   ============================================================ */
const dashboardUsageData = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    { label: 'Daily Views', data: [420, 480, 520, 580, 640, 720], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.12)', tension: 0.4, fill: true },
    { label: 'Unique Users', data: [48, 52, 56, 62, 68, 74], borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,.08)', tension: 0.4, fill: true },
  ],
};

const reportTypesData = {
  labels: ['Financial', 'Sales', 'CRM', 'HR', 'Marketing', 'Operations'],
  datasets: [{ data: [32, 28, 24, 18, 14, 12], backgroundColor: ['#3b82f6', '#6366f1', '#8b5cf6', '#22d3ee', '#f59e0b', '#10b981'], borderWidth: 0 }],
};

const kpiHealthData = {
  labels: ['Revenue', 'Acquisition', 'Retention', 'Pipeline', 'CSAT', 'Agent Success', 'Mktg ROI', 'Data Quality'],
  datasets: [
    { label: 'Target', data: [100, 100, 100, 100, 100, 100, 100, 100], backgroundColor: 'rgba(148,163,184,.2)', borderRadius: 4 },
    { label: 'Actual', data: [93, 87, 97, 79, 99, 99, 95, 100], backgroundColor: 'rgba(59,130,246,.7)', borderRadius: 4 },
  ],
};

const alertTrendData = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    { label: 'Critical', data: [3, 2, 4, 1, 2, 1], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,.12)', tension: 0.4, fill: true },
    { label: 'High', data: [8, 6, 7, 5, 6, 4], borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,.08)', tension: 0.4, fill: true },
    { label: 'Medium', data: [12, 10, 8, 9, 7, 6], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.08)', tension: 0.4, fill: true },
  ],
};

const severityBreakdownData = {
  labels: ['Critical', 'High', 'Medium', 'Low'],
  datasets: [{ data: [3, 4, 4, 1], backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'], borderWidth: 0 }],
};

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
function Analytics() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'dashboard';
  const [activeTab, setActiveTab] = useState(initialTab);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  useEffect(() => {
    const urlTab = searchParams.get('tab');
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [searchParams]);

  return (
    <div className="animate-fade-in-up">
      {/* PAGE HEADER */}
      <section className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span>Ecosystem</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-blue-600 font-semibold">Cortex Intell Analytics</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Cortex Intell Analytics</h1>
          <p className="text-slate-500">Dashboards. KPIs. Command Centre.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline"><Download className="w-4 h-4" /> Export</button>
          <button className="btn-outline"><Filter className="w-4 h-4" /> Filter</button>
          <button className="btn-primary"><Plus className="w-4 h-4" /> New Dashboard</button>
        </div>
      </section>

      {/* KPI STRIP */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard label="DASHBOARDS" value="32" delta="6 new this month" icon={<LayoutDashboard className="w-5 h-5" />} bg="bg-blue-100" text="text-blue-600" />
        <KpiCard label="REPORTS" value="156" delta="+24 this month" icon={<FileText className="w-5 h-5" />} bg="bg-indigo-100" text="text-indigo-600" />
        <KpiCard label="KPIs TRACKED" value="48" delta="92% on target" icon={<Target className="w-5 h-5" />} bg="bg-violet-100" text="text-violet-600" />
        <KpiCard label="ACTIVE ALERTS" value="12" delta="3 triggered today" icon={<Bell className="w-5 h-5" />} bg="bg-sky-100" text="text-sky-600" />
      </section>

      {/* AI COPILOT BANNER */}
      <section className="mb-6">
        <div className="glass-blue rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute w-48 h-48 bg-white rounded-full blur-3xl -top-20 -right-20 animate-blob"></div>
          </div>
          <div className="relative z-10 w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="relative z-10 flex-1">
            <div className="font-bold text-white">AI Analytics Copilot</div>
            <div className="text-white/90 text-sm">Revenue KPI is 93% to target with 2 weeks remaining. Pipeline value grew 18.7% -- project Q2 close at $4.1M. Employee retention trending below target, recommend review.</div>
          </div>
          <button className="relative z-10 bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold text-sm hover:scale-105 transition">View Insights</button>
        </div>
      </section>

      {/* TAB PANELS */}
      {activeTab === 'dashboard' && <DashboardPanel switchTab={switchTab} />}
      {activeTab === 'dashboards' && <DashboardsPanel />}
      {activeTab === 'reports' && <ReportsPanel />}
      {activeTab === 'kpis' && <KpisPanel />}
      {activeTab === 'command' && <CommandPanel />}
      {activeTab === 'embedded' && <EmbeddedPanel />}
      {activeTab === 'alerts' && <AlertsPanel />}
    </div>
  );
}

/* ============================================================
   KPI CARD
   ============================================================ */
function KpiCard({ label, value, delta, icon, bg, text }) {
  return (
    <div className="kpi-card card-hover animate-fade-in-up">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[10px] font-bold text-slate-500 tracking-wider">{label}</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{value}</div>
          <div className="text-xs text-green-600 font-semibold">{delta}</div>
        </div>
        <div className={`w-10 h-10 rounded-xl ${bg} ${text} flex items-center justify-center`}>{icon}</div>
      </div>
    </div>
  );
}

/* ============================================================
   DASHBOARD PANEL
   ============================================================ */
function DashboardPanel({ switchTab }) {
  return (
    <div className="fos-panel active" id="panel-dashboard">
      {/* Sub-Module Overview Cards */}
      <section className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6 mt-4">
        {subModuleCards.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.tab} className="glass-strong rounded-xl p-4 card-hover cursor-pointer text-center" onClick={() => switchTab(m.tab)}>
              <div className={`w-10 h-10 mx-auto rounded-xl ${m.bg} ${m.text} flex items-center justify-center mb-2`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="font-bold text-sm text-slate-800">{m.label}</div>
              <div className="text-xs text-slate-500 mt-1">{m.sub}</div>
            </div>
          );
        })}
      </section>

      {/* Row 1: Dashboard Usage + Report Types */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-600" /> Dashboard Usage</h3>
            <span className="badge badge-green">+12.5%</span>
          </div>
          <div style={{ height: 240 }}>
            <Line data={dashboardUsageData} options={lineDefaults()} />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><PieChart className="w-4 h-4 text-indigo-600" /> Report Types</h3>
            <span className="text-xs text-slate-500">156 Total Reports</span>
          </div>
          <div style={{ height: 240 }}>
            <Doughnut data={reportTypesData} options={doughnutDefaults} />
          </div>
        </div>
      </section>

      {/* Row 2: KPI Health + Alert Trend */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><Target className="w-4 h-4 text-violet-600" /> KPI Health</h3>
            <span className="text-xs text-slate-500">Target vs Actual</span>
          </div>
          <div style={{ height: 240 }}>
            <Bar
              data={kpiHealthData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { boxWidth: 8, font: { size: 10 } } } },
                scales: { y: { grid: { color: '#f1f5f9' }, max: 110, ticks: { callback: (v) => v + '%' } }, x: { grid: { display: false } } },
              }}
            />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><Bell className="w-4 h-4 text-sky-600" /> Alert Trend</h3>
            <span className="badge badge-green">Declining</span>
          </div>
          <div style={{ height: 240 }}>
            <Line data={alertTrendData} options={lineDefaults()} />
          </div>
        </div>
      </section>

      {/* Row 3: Top Dashboards + Recent Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><LayoutDashboard className="w-4 h-4 text-blue-600" /> Top Dashboards</h3>
            <button className="btn-outline text-xs" onClick={() => switchTab('dashboards')}>View All</button>
          </div>
          <div className="space-y-3">
            {dashboardGallery.slice(0, 5).map((d) => (
              <div key={d.name} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-blue-50/40 transition cursor-pointer">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${d.grad} text-white flex items-center justify-center text-xs font-bold`}>{d.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-slate-900">{d.name}</div>
                  <div className="text-xs text-slate-500">{d.creator} -- {d.widgets} widgets</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm text-blue-600">{d.views} views</div>
                  <div className="text-xs text-slate-400">{d.updated}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><Activity className="w-4 h-4 text-cyan-600" /> Recent Activity</h3>
          </div>
          <div className="space-y-3">
            <ActivityRow icon={<LayoutDashboard className="w-4 h-4" />} bg="bg-blue-100 text-blue-600" title="Executive Overview dashboard updated" sub="Rania J. added 2 new widgets -- 2h ago" />
            <ActivityRow icon={<FileText className="w-4 h-4" />} bg="bg-indigo-100 text-indigo-600" title="Pipeline Health report generated" sub="Weekly auto-report completed -- 4h ago" />
            <ActivityRow icon={<Bell className="w-4 h-4" />} bg="bg-red-100 text-red-600" title="Data Pipeline Failure alert triggered" sub="Gmail -> CRM sync failed -- 2 days ago" />
            <ActivityRow icon={<Target className="w-4 h-4" />} bg="bg-violet-100 text-violet-600" title="KPI threshold updated: Revenue Growth" sub="Target adjusted to $4.2M -- 3 days ago" />
            <ActivityRow icon={<CheckCircle className="w-4 h-4" />} bg="bg-green-100 text-green-600" title="Q1 Compliance Audit report approved" sub="32 pages reviewed and signed off -- 1 week ago" />
            <ActivityRow icon={<Code2 className="w-4 h-4" />} bg="bg-orange-100 text-orange-600" title="Embedded widget deployed: Case Analytics" sub="Added to Support Dashboard -- 1 week ago" />
          </div>
        </div>
      </section>

      {/* AI Insights Banner */}
      <section className="glass-blue rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden mb-6">
        <div className="absolute inset-0 opacity-20"><div className="absolute w-48 h-48 bg-white rounded-full blur-3xl -top-20 -right-20 animate-blob"></div></div>
        <div className="relative z-10 w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="relative z-10 flex-1">
          <div className="font-bold text-white">AI Analytics Insights</div>
          <div className="text-white/90 text-sm">Dashboard usage up 12.5% month-over-month. 6 of 8 KPIs on target. Alert volume declining -- system stability improving. Recommend creating a dedicated Project Health dashboard for at-risk project monitoring.</div>
        </div>
        <button className="relative z-10 bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold text-sm hover:scale-105 transition">View All Insights</button>
      </section>
    </div>
  );
}

/* ============================================================
   DASHBOARDS PANEL
   ============================================================ */
function DashboardsPanel() {
  return (
    <div className="fos-panel active" id="panel-dashboards">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-blue-100 text-blue-600"><LayoutDashboard className="w-5 h-5" /></div>
          <div><h2>Dashboards</h2><p>Interactive dashboard gallery</p></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {dashboardGallery.map((d) => (
            <div key={d.name} className="glass-strong rounded-2xl overflow-hidden card-hover cursor-pointer">
              {/* Thumbnail */}
              <div className={`h-32 bg-gradient-to-br ${d.grad} relative flex items-center justify-center`}>
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 left-4 w-16 h-3 bg-white/40 rounded"></div>
                  <div className="absolute top-10 left-4 w-24 h-3 bg-white/30 rounded"></div>
                  <div className="absolute top-4 right-4 w-12 h-12 border-2 border-white/30 rounded-full"></div>
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                    <div className="flex-1 h-8 bg-white/20 rounded"></div>
                    <div className="flex-1 h-8 bg-white/15 rounded"></div>
                    <div className="flex-1 h-8 bg-white/10 rounded"></div>
                  </div>
                </div>
                <div className="text-white text-sm font-bold bg-black/20 px-3 py-1 rounded-lg backdrop-blur-sm">{d.category}</div>
              </div>
              {/* Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-900">{d.name}</h4>
                  {d.favorite && <span className="text-yellow-500 text-sm">&#9733;</span>}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                  <div className="avatar avatar-sm text-[10px]">{d.avatar}</div>
                  <span>{d.creator}</span>
                  <span>--</span>
                  <span>{d.widgets} widgets</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400"><Eye className="w-3 h-3 inline mr-1" />{d.views} views</span>
                  <span className="text-xs text-slate-400"><Clock className="w-3 h-3 inline mr-1" />{d.updated}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   REPORTS PANEL
   ============================================================ */
function ReportsPanel() {
  const [search, setSearch] = useState('');
  const filtered = reportsList.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fos-panel active" id="panel-reports">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-indigo-100 text-indigo-600"><FileText className="w-5 h-5" /></div>
          <div><h2>Reports</h2><p>Scheduled and on-demand report library</p></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard value="156" label="Total Reports" color="text-blue-600" />
          <StatCard value="24" label="Scheduled" color="text-indigo-600" />
          <StatCard value="1" label="Running Now" color="text-yellow-600" />
          <StatCard value="98.2%" label="Delivery Rate" color="text-green-600" />
        </div>

        <div className="glass-strong rounded-2xl overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900">Report Library</h3>
              <p className="text-xs text-slate-500">156 reports -- 24 scheduled, 132 on-demand</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  placeholder="Search reports..."
                  className="pl-9 pr-3 py-2 text-sm bg-blue-50/50 border border-blue-100 rounded-lg outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="btn-primary text-xs">+ New Report</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Report Name</th><th>Type</th><th>Schedule</th><th>Last Run</th><th>Status</th><th>Format</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.name} className="clickable">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center"><FileText className="w-4 h-4" /></div>
                        <div>
                          <span className="font-semibold text-slate-800">{r.name}</span>
                          <div className="text-[10px] text-slate-400">{r.pages} pages</div>
                        </div>
                      </div>
                    </td>
                    <td><span className={`badge ${r.typeBadge}`}>{r.type}</span></td>
                    <td className="text-slate-600">{r.schedule}</td>
                    <td className="text-slate-500 text-sm">{r.lastRun}</td>
                    <td><span className={`badge ${r.statusBadge}`}>{r.status}</span></td>
                    <td className="text-slate-600 font-mono text-xs">{r.format}</td>
                    <td>
                      <div className="flex gap-1">
                        <button className="p-1.5 hover:bg-blue-50 rounded-lg"><Download className="w-4 h-4 text-blue-600" /></button>
                        <button className="p-1.5 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4 text-blue-600" /></button>
                        <button className="p-1.5 hover:bg-blue-50 rounded-lg"><MoreHorizontal className="w-4 h-4 text-slate-400" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   KPIs PANEL
   ============================================================ */
function KpisPanel() {
  return (
    <div className="fos-panel active" id="panel-kpis">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-violet-100 text-violet-600"><Target className="w-5 h-5" /></div>
          <div><h2>KPI Tracking</h2><p>Monitor key performance indicators across all modules</p></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard value="48" label="Total KPIs" color="text-blue-600" />
          <StatCard value="38" label="On Target" color="text-green-600" />
          <StatCard value="8" label="Slightly Behind" color="text-yellow-600" />
          <StatCard value="2" label="At Risk" color="text-red-500" />
        </div>

        {/* KPI Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiBoard.map((k) => (
            <div key={k.name} className="glass-strong rounded-2xl p-5 card-hover cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider">{k.category.toUpperCase()}</span>
                <span className={`text-xs font-bold ${k.statusColor}`}>{k.status}</span>
              </div>
              <div className="font-bold text-slate-900 mb-3">{k.name}</div>
              <div className="flex items-end gap-3 mb-3">
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold">TARGET</div>
                  <div className="text-lg font-extrabold text-slate-500">{k.target}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold">ACTUAL</div>
                  <div className="text-lg font-extrabold text-blue-600">{k.actual}</div>
                </div>
              </div>
              {/* Trend Sparkline Description */}
              <div className="flex items-center gap-2 mb-3">
                {k.trend === 'up' && <ArrowUp className="w-3.5 h-3.5 text-green-600" />}
                {k.trend === 'down' && <ArrowDown className="w-3.5 h-3.5 text-red-500" />}
                {k.trend === 'flat' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
                <span className={`text-xs font-bold ${k.trend === 'up' ? 'text-green-600' : k.trend === 'down' ? 'text-red-500' : 'text-slate-400'}`}>{k.trendPct}</span>
                <span className="text-[10px] text-slate-400">vs last period</span>
              </div>
              <div className="progress" style={{ height: 4 }}>
                <div
                  className={`progress-fill ${k.progress >= 90 ? '' : k.progress >= 75 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : 'bg-gradient-to-r from-red-400 to-orange-400'}`}
                  style={{ width: `${k.progress}%` }}
                ></div>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 text-right">{k.progress}% to target</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   COMMAND CENTRE PANEL
   ============================================================ */
function CommandPanel() {
  return (
    <div className="fos-panel active" id="panel-command">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-sky-100 text-sky-600"><Monitor className="w-5 h-5" /></div>
          <div><h2>Command Centre</h2><p>Real-time system health and operational metrics</p></div>
        </div>

        {/* System Health Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'System Uptime', value: '99.97%', status: 'Healthy', statusDot: 'bg-green-500', icon: Shield, bg: 'bg-green-100 text-green-600' },
            { label: 'API Response', value: '142ms', status: 'Optimal', statusDot: 'bg-green-500', icon: Zap, bg: 'bg-blue-100 text-blue-600' },
            { label: 'Active Users', value: '74', status: 'Normal', statusDot: 'bg-green-500', icon: Users, bg: 'bg-indigo-100 text-indigo-600' },
            { label: 'Error Rate', value: '0.08%', status: 'Healthy', statusDot: 'bg-green-500', icon: AlertTriangle, bg: 'bg-violet-100 text-violet-600' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="glass-strong rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}><Icon className="w-5 h-5" /></div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500">{s.label}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`w-2 h-2 rounded-full ${s.statusDot}`}></span>
                      <span className="text-xs font-semibold text-green-700">{s.status}</span>
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900">{s.value}</div>
              </div>
            );
          })}
        </div>

        {/* Real-Time Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Gauge className="w-4 h-4 text-blue-600" /> Module Health Status</h3>
            <div className="space-y-3">
              {[
                { name: 'CRM 360', status: 'Operational', dot: 'bg-green-500', latency: '89ms', uptime: '99.99%' },
                { name: 'Finance OS', status: 'Operational', dot: 'bg-green-500', latency: '124ms', uptime: '99.98%' },
                { name: 'HRM', status: 'Operational', dot: 'bg-green-500', latency: '95ms', uptime: '99.97%' },
                { name: 'Growth Engine', status: 'Operational', dot: 'bg-green-500', latency: '156ms', uptime: '99.95%' },
                { name: 'Brain AI', status: 'Degraded', dot: 'bg-yellow-500', latency: '342ms', uptime: '99.82%' },
                { name: 'Data Platform', status: 'Operational', dot: 'bg-green-500', latency: '67ms', uptime: '99.99%' },
                { name: 'Agents', status: 'Operational', dot: 'bg-green-500', latency: '112ms', uptime: '99.96%' },
                { name: 'AI Chatbot', status: 'Operational', dot: 'bg-green-500', latency: '201ms', uptime: '99.94%' },
              ].map((m) => (
                <div key={m.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                  <span className={`w-2.5 h-2.5 rounded-full ${m.dot}`}></span>
                  <span className="font-semibold text-sm text-slate-800 flex-1">{m.name}</span>
                  <span className={`text-xs font-semibold ${m.status === 'Operational' ? 'text-green-600' : 'text-yellow-600'}`}>{m.status}</span>
                  <span className="text-xs text-slate-400 w-16 text-right">{m.latency}</span>
                  <span className="text-xs text-slate-400 w-16 text-right">{m.uptime}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-indigo-600" /> Live Metrics</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-blue-50 rounded-xl text-center">
                <div className="text-xl font-extrabold text-blue-600">3,482</div>
                <div className="text-xs text-slate-600 font-semibold">API Calls / hr</div>
              </div>
              <div className="p-3 bg-green-50 rounded-xl text-center">
                <div className="text-xl font-extrabold text-green-600">24</div>
                <div className="text-xs text-slate-600 font-semibold">Active Workflows</div>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl text-center">
                <div className="text-xl font-extrabold text-indigo-600">8.4 GB</div>
                <div className="text-xs text-slate-600 font-semibold">Data Processed</div>
              </div>
              <div className="p-3 bg-violet-50 rounded-xl text-center">
                <div className="text-xl font-extrabold text-violet-600">12</div>
                <div className="text-xs text-slate-600 font-semibold">Active Pipelines</div>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'CPU Usage', pct: 34, color: '' },
                { label: 'Memory Usage', pct: 62, color: '' },
                { label: 'Storage Usage', pct: 48, color: '' },
                { label: 'Network I/O', pct: 21, color: '' },
              ].map((r) => (
                <div key={r.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">{r.label}</span>
                    <span className="text-slate-500">{r.pct}%</span>
                  </div>
                  <div className="progress"><div className="progress-fill" style={{ width: `${r.pct}%` }}></div></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-blue-600" /> Recent System Events</h3>
          <div className="space-y-3">
            <ActivityRow icon={<CheckCircle className="w-4 h-4" />} bg="bg-green-100 text-green-600" title="Scheduled maintenance completed" sub="Database optimization -- 4h ago" />
            <ActivityRow icon={<RefreshCw className="w-4 h-4" />} bg="bg-blue-100 text-blue-600" title="Auto-scaling triggered" sub="API servers scaled from 4 to 6 instances -- 8h ago" />
            <ActivityRow icon={<AlertTriangle className="w-4 h-4" />} bg="bg-yellow-100 text-yellow-600" title="Brain AI latency spike detected" sub="Response time peaked at 520ms, now stabilized -- 12h ago" />
            <ActivityRow icon={<Shield className="w-4 h-4" />} bg="bg-indigo-100 text-indigo-600" title="SSL certificates renewed" sub="All domains renewed for 12 months -- 1d ago" />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   EMBEDDED PANEL
   ============================================================ */
function EmbeddedPanel() {
  return (
    <div className="fos-panel active" id="panel-embedded">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-orange-100 text-orange-600"><Code2 className="w-5 h-5" /></div>
          <div><h2>Embedded Analytics</h2><p>Contextual analytics widgets embedded across modules</p></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Revenue Widget */}
          <div className="glass-strong rounded-2xl overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600">
              <div className="flex items-center gap-2 text-white mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-bold">REVENUE WIDGET</span>
              </div>
              <div className="text-white/80 text-[10px]">Embeddable in Account 360, Dashboard</div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-2xl font-extrabold text-slate-900">$3.92M</div>
                  <div className="text-xs text-green-600 font-semibold">+12.5% ↑ vs last month</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center"><TrendingUp className="w-5 h-5" /></div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs"><span className="text-slate-600">New Business</span><span className="font-bold text-slate-800">$1.82M</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-600">Expansion</span><span className="font-bold text-slate-800">$1.24M</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-600">Renewal</span><span className="font-bold text-slate-800">$860K</span></div>
              </div>
              <div className="mt-3 text-[10px] text-slate-400 flex items-center gap-1"><Code2 className="w-3 h-3" /> Embed Code: <code className="bg-slate-100 px-1 rounded">{'<cortex-revenue />'}</code></div>
            </div>
          </div>

          {/* Pipeline Widget */}
          <div className="glass-strong rounded-2xl overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-indigo-500 to-violet-600">
              <div className="flex items-center gap-2 text-white mb-1">
                <BarChart3 className="w-4 h-4" />
                <span className="text-xs font-bold">PIPELINE WIDGET</span>
              </div>
              <div className="text-white/80 text-[10px]">Embeddable in CRM, Executive Dashboard</div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-2xl font-extrabold text-slate-900">$1.18M</div>
                  <div className="text-xs text-green-600 font-semibold">+18.7% ↑ pipeline growth</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center"><Target className="w-5 h-5" /></div>
              </div>
              <div className="space-y-2">
                {[
                  { stage: 'Lead', value: '$545K', pct: 46, color: 'from-blue-400 to-blue-500' },
                  { stage: 'Qualified', value: '$305K', pct: 26, color: 'from-indigo-400 to-indigo-500' },
                  { stage: 'Proposal', value: '$625K', pct: 53, color: 'from-violet-400 to-violet-500' },
                  { stage: 'Won', value: '$800K', pct: 68, color: 'from-green-400 to-green-500' },
                ].map((s) => (
                  <div key={s.stage}>
                    <div className="flex justify-between text-xs mb-0.5"><span className="text-slate-600">{s.stage}</span><span className="font-bold text-slate-800">{s.value}</span></div>
                    <div className="progress" style={{ height: 3 }}><div className={`progress-fill bg-gradient-to-r ${s.color}`} style={{ width: `${s.pct}%` }}></div></div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-[10px] text-slate-400 flex items-center gap-1"><Code2 className="w-3 h-3" /> Embed Code: <code className="bg-slate-100 px-1 rounded">{'<cortex-pipeline />'}</code></div>
            </div>
          </div>

          {/* Case Widget */}
          <div className="glass-strong rounded-2xl overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500">
              <div className="flex items-center gap-2 text-white mb-1">
                <LineChart className="w-4 h-4" />
                <span className="text-xs font-bold">CASE ANALYTICS WIDGET</span>
              </div>
              <div className="text-white/80 text-[10px]">Embeddable in Support, Account 360</div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-2 bg-orange-50 rounded-xl text-center">
                  <div className="text-xl font-extrabold text-orange-600">38</div>
                  <div className="text-[10px] text-slate-600 font-semibold">Open Cases</div>
                </div>
                <div className="p-2 bg-green-50 rounded-xl text-center">
                  <div className="text-xl font-extrabold text-green-600">142</div>
                  <div className="text-[10px] text-slate-600 font-semibold">Resolved (MTD)</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs"><span className="text-slate-600">Avg. Response Time</span><span className="font-bold text-slate-800">2.4h</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-600">SLA Compliance</span><span className="font-bold text-green-600">94%</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-600">CSAT Score</span><span className="font-bold text-blue-600">94%</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-600">Critical Cases</span><span className="font-bold text-red-500">5</span></div>
              </div>
              <div className="mt-3 text-[10px] text-slate-400 flex items-center gap-1"><Code2 className="w-3 h-3" /> Embed Code: <code className="bg-slate-100 px-1 rounded">{'<cortex-cases />'}</code></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   ALERTS PANEL
   ============================================================ */
function AlertsPanel() {
  return (
    <div className="fos-panel active" id="panel-alerts">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-cyan-100 text-cyan-600"><Bell className="w-5 h-5" /></div>
          <div><h2>Alerts & Insights</h2><p>Configure and monitor alert rules</p></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard value="12" label="Active Alerts" color="text-blue-600" />
          <StatCard value="3" label="Critical" color="text-red-500" />
          <StatCard value="4" label="Triggered (Week)" color="text-orange-600" />
          <StatCard value="89%" label="Resolution Rate" color="text-green-600" />
        </div>

        {/* Alert Configuration List */}
        <div className="glass-strong rounded-2xl overflow-hidden mb-6">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Alert Rules</h3>
            <button className="btn-primary text-xs">+ New Alert</button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Alert ID</th><th>Name</th><th>Severity</th><th>Condition</th><th>Channel</th><th>Status</th><th>Last Triggered</th></tr>
              </thead>
              <tbody>
                {alertConfigs.map((a) => (
                  <tr key={a.id} className="clickable">
                    <td className="font-mono text-blue-600 font-semibold text-xs">{a.id}</td>
                    <td className="font-semibold text-slate-800">{a.name}</td>
                    <td><span className={`badge ${a.severityBadge}`}>{a.severity}</span></td>
                    <td className="text-slate-500 text-xs">{a.condition}</td>
                    <td className="text-slate-500 text-xs">{a.channel}</td>
                    <td><span className={`badge ${a.statusBadge}`}>{a.status}</span></td>
                    <td className="text-slate-500 text-xs">{a.lastTriggered}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alert History + Severity Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-blue-600" /> Alert History</h3>
            <div className="space-y-3">
              {alertHistory.map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${a.severity === 'Critical' ? 'bg-red-100 text-red-600' : a.severity === 'High' ? 'bg-orange-100 text-orange-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-800">{a.alert}</span>
                      <span className={`badge ${a.severityBadge} text-[10px]`}>{a.severity}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{a.message}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-slate-400">{a.time}</div>
                    <span className={`text-[10px] font-bold ${a.resolved ? 'text-green-600' : 'text-orange-600'}`}>{a.resolved ? 'Resolved' : 'Open'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><PieChart className="w-4 h-4 text-violet-600" /> Severity Breakdown</h3>
            <div style={{ height: 220 }}>
              <Doughnut data={severityBreakdownData} options={doughnutDefaults} />
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4">
              <div className="text-center p-2 bg-red-50 rounded-lg">
                <div className="text-lg font-extrabold text-red-600">3</div>
                <div className="text-[10px] text-slate-600 font-semibold">Critical</div>
              </div>
              <div className="text-center p-2 bg-orange-50 rounded-lg">
                <div className="text-lg font-extrabold text-orange-600">4</div>
                <div className="text-[10px] text-slate-600 font-semibold">High</div>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <div className="text-lg font-extrabold text-blue-600">4</div>
                <div className="text-[10px] text-slate-600 font-semibold">Medium</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <div className="text-lg font-extrabold text-green-600">1</div>
                <div className="text-[10px] text-slate-600 font-semibold">Low</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   SHARED SUB-COMPONENTS
   ============================================================ */
function ActivityRow({ icon, bg, title, sub }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-100">
      <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>{icon}</div>
      <div className="flex-1">
        <div className="font-semibold text-sm">{title}</div>
        <div className="text-xs text-slate-500">{sub}</div>
      </div>
    </div>
  );
}

function StatCard({ value, label, color }) {
  return (
    <div className="glass-strong rounded-2xl p-4 text-center">
      <div className={`text-2xl font-extrabold ${color}`}>{value}</div>
      <div className="text-xs text-slate-500 font-semibold mt-1">{label}</div>
    </div>
  );
}

export default Analytics;
