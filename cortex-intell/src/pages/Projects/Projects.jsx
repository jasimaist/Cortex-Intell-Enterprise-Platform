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
  TrendingUp, FolderKanban, CheckSquare, Calendar, Users, AlertTriangle,
  FileEdit, Flag, ChevronRight, Activity, BarChart3, PieChart, Wallet,
  FolderOpen, FolderPlus, LayoutGrid, Plus, Brain, GitPullRequest,
  CheckCircle2, Lock, Unlock, Clock, Circle, Check, Folder,
  FileText, Image, FileSpreadsheet, FileCode,
} from 'lucide-react';
import { CORTEX_DATA } from '../../data/mockData';

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
  cutout: '65%',
};

/* ============================================================
   CHART DATA
   ============================================================ */
const completionTrendData = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [{
    label: 'Avg Completion %',
    data: [42, 48, 52, 58, 64, 68],
    borderColor: '#6366f1',
    backgroundColor: 'rgba(99,102,241,.12)',
    tension: 0.4,
    fill: true,
    pointBackgroundColor: '#6366f1',
    pointRadius: 4,
  }],
};

const statusChartData = {
  labels: ['On Track', 'At Risk', 'Delayed', 'Completed'],
  datasets: [{ data: [7, 2, 1, 2], backgroundColor: ['#10b981', '#ef4444', '#f59e0b', '#3b82f6'], borderWidth: 0 }],
};

const utilizationData = {
  labels: ['Engineering', 'Design', 'QA', 'DevOps', 'PM'],
  datasets: [{
    label: 'Utilization %',
    data: [92, 78, 85, 70, 88],
    backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#06b6d4', '#6366f1'],
    borderRadius: 6,
  }],
};

const budgetVsActualData = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    { label: 'Budget ($K)', data: [120, 240, 360, 480, 600, 720], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.08)', tension: 0.4, fill: true, pointRadius: 4, pointBackgroundColor: '#3b82f6' },
    { label: 'Actual ($K)', data: [115, 235, 365, 490, 610, 740], borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,.08)', tension: 0.4, fill: true, borderDash: [5, 5], pointRadius: 4, pointBackgroundColor: '#8b5cf6' },
  ],
};

const burndownData = {
  labels: ['Day 1', 'Day 3', 'Day 5', 'Day 7', 'Day 9', 'Day 11', 'Day 13', 'Day 14'],
  datasets: [
    { label: 'Ideal', data: [80, 70, 60, 50, 40, 30, 20, 0], borderColor: '#cbd5e1', borderDash: [5, 5], tension: 0, fill: false },
    { label: 'Actual', data: [80, 74, 68, 58, 52, 42, 28, 12], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.1)', tension: 0.4, fill: true },
  ],
};

const resourceAllocData = {
  labels: ['Alpha', 'CRM', 'Mobile', 'Data Lake', 'Brand', 'API GW'],
  datasets: [
    { label: 'Engineers', data: [8, 4, 6, 5, 2, 4], backgroundColor: '#3b82f6', borderRadius: 4 },
    { label: 'Designers', data: [2, 1, 3, 0, 4, 0], backgroundColor: '#8b5cf6', borderRadius: 4 },
    { label: 'QA', data: [2, 1, 2, 1, 0, 1], backgroundColor: '#10b981', borderRadius: 4 },
  ],
};

const deliveryChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    { label: 'On Time', data: [4, 5, 6, 4, null, null], backgroundColor: '#10b981', borderRadius: 4 },
    { label: 'Late', data: [1, 0, 1, 1, null, null], backgroundColor: '#ef4444', borderRadius: 4 },
    { label: 'Planned', data: [null, null, null, null, 6, 4], backgroundColor: '#3b82f6', borderRadius: 4 },
  ],
};

/* ============================================================
   SUB-MODULE CARDS for Dashboard
   ============================================================ */
const subModuleCards = [
  { tab: 'management', icon: FolderKanban, label: 'Project Mgmt', bg: 'bg-blue-100', text: 'text-blue-600' },
  { tab: 'tasks', icon: CheckSquare, label: 'Tasks', bg: 'bg-indigo-100', text: 'text-indigo-600' },
  { tab: 'scheduling', icon: Calendar, label: 'Scheduling', bg: 'bg-violet-100', text: 'text-violet-600' },
  { tab: 'resources', icon: Users, label: 'Resources', bg: 'bg-green-100', text: 'text-green-600' },
  { tab: 'risks', icon: AlertTriangle, label: 'Risks', bg: 'bg-red-100', text: 'text-red-600' },
  { tab: 'changes', icon: FileEdit, label: 'Changes', bg: 'bg-orange-100', text: 'text-orange-600' },
  { tab: 'milestones', icon: Flag, label: 'Milestones', bg: 'bg-sky-100', text: 'text-sky-600' },
];

/* ============================================================
   STATIC DATA
   ============================================================ */
const pStatus = { 'On Track': 'badge-green', 'At Risk': 'badge-red', Delayed: 'badge-yellow' };
const pPriority = { High: 'badge-red', Medium: 'badge-yellow', Low: 'badge-blue' };

const activeProjectsList = [
  { initials: 'PA', name: 'Project Alpha', pct: 68, badge: 'badge-yellow', status: 'At Risk', grad: 'from-blue-500 to-indigo-600', pctColor: 'text-blue-600' },
  { initials: 'CM', name: 'CRM Migration', pct: 92, badge: 'badge-green', status: 'On Track', grad: 'from-violet-500 to-purple-600', pctColor: 'text-green-600' },
  { initials: 'MA', name: 'Mobile App v2', pct: 45, badge: 'badge-red', status: 'Delayed', grad: 'from-sky-500 to-blue-600', pctColor: 'text-blue-600' },
  { initials: 'DL', name: 'Data Lake', pct: 78, badge: 'badge-green', status: 'On Track', grad: 'from-cyan-500 to-teal-600', pctColor: 'text-blue-600' },
  { initials: 'AG', name: 'API Gateway v3', pct: 55, badge: 'badge-yellow', status: 'At Risk', grad: 'from-orange-500 to-red-500', pctColor: 'text-blue-600' },
];

const kanbanStages = [
  { key: 'todo', title: 'To Do', color: 'bg-slate-400' },
  { key: 'progress', title: 'In Progress', color: 'bg-blue-500' },
  { key: 'review', title: 'Review', color: 'bg-violet-500' },
  { key: 'done', title: 'Done', color: 'bg-green-500' },
];

const ganttBars = [
  { name: 'Project Alpha', pct: 68, left: '10%', width: '58%', grad: 'from-red-400 to-orange-400' },
  { name: 'CRM Migration', pct: 92, left: '5%', width: '82%', grad: 'from-blue-500 to-indigo-500' },
  { name: 'Mobile App v2', pct: 45, left: '15%', width: '40%', grad: 'from-violet-400 to-purple-500' },
  { name: 'Data Lake', pct: 78, left: '8%', width: '68%', grad: 'from-sky-500 to-blue-500' },
  { name: 'Brand Refresh', pct: 30, left: '20%', width: '30%', grad: 'from-cyan-400 to-teal-400' },
  { name: 'API Gateway v3', pct: 55, left: '12%', width: '48%', grad: 'from-orange-400 to-red-400' },
];

const dependencies = [
  { icon: Lock, from: 'API Gateway → Mobile App v2', desc: 'Mobile app blocked until API Gateway auth module is complete (ETA: Apr 22)', badge: 'badge-red', status: 'Blocked', border: 'border-red-100', bg: 'bg-red-50', iconBg: 'bg-red-100 text-red-600' },
  { icon: Lock, from: 'Data Lake → Analytics Dashboard', desc: 'Dashboard depends on data pipeline migration (ETA: Apr 28)', badge: 'badge-red', status: 'Blocked', border: 'border-red-100', bg: 'bg-red-50', iconBg: 'bg-red-100 text-red-600' },
  { icon: Unlock, from: 'CRM Migration → Sales Training', desc: 'Training can begin once CRM data migration completes (92% done)', badge: 'badge-green', status: 'On Track', border: 'border-green-100', bg: 'bg-green-50', iconBg: 'bg-green-100 text-green-600' },
];

const teamWorkload = [
  { initials: 'SJ', name: 'Sarah Johnson', items: '14 items · 3 projects · Lead Engineer', pct: 94, label: '94% — Overloaded', labelColor: 'text-red-600', barGrad: 'linear-gradient(90deg,#ef4444,#f97316)' },
  { initials: 'JW', name: 'James Wilson', items: '10 items · 3 projects · Backend Dev', pct: 78, label: '78% — Busy', labelColor: 'text-yellow-600', barGrad: 'linear-gradient(90deg,#f59e0b,#f97316)' },
  { initials: 'MC', name: 'Michael Chen', items: '8 items · 2 projects · Full Stack', pct: 68, label: '68% — Healthy', labelColor: 'text-green-600', barGrad: null },
  { initials: 'PP', name: 'Priya Patel', items: '6 items · 2 projects · Designer', pct: 52, label: '52% — Healthy', labelColor: 'text-green-600', barGrad: null },
  { initials: 'RS', name: 'Rohan Sharma', items: '4 items · 1 project · Data Engineer', pct: 32, label: '32% — Available', labelColor: 'text-blue-600', barGrad: null },
  { initials: 'ER', name: 'Elena Rodriguez', items: '5 items · 1 project · QA Lead', pct: 42, label: '42% — Available', labelColor: 'text-green-600', barGrad: null },
];

const budgetItems = [
  { name: 'Project Alpha', spent: '$420K / $480K', pct: 87.5, status: 'Under budget', statusColor: 'text-green-600', bg: 'bg-green-50', barGrad: null },
  { name: 'CRM Migration', spent: '$185K / $200K', pct: 92.5, status: 'Near budget', statusColor: 'text-yellow-600', bg: 'bg-blue-50', barGrad: null },
  { name: 'Mobile App v2', spent: '$340K / $320K', pct: 100, status: 'Over budget +$20K', statusColor: 'text-red-600', bg: 'bg-red-50', barGrad: 'linear-gradient(90deg,#ef4444,#f97316)' },
  { name: 'Data Lake', spent: '$210K / $280K', pct: 75, status: 'Under budget', statusColor: 'text-green-600', bg: 'bg-green-50', barGrad: null },
];

const raidLog = [
  { id: 'R-001', type: 'Risk', typeBadge: 'badge-red', desc: 'Resource shortage on API Gateway', project: 'API Gateway v3', severity: 'Critical', sevBadge: 'badge-red', owner: 'SJ', status: 'Open', stsBadge: 'badge-yellow' },
  { id: 'R-002', type: 'Risk', typeBadge: 'badge-red', desc: 'Third-party API deprecation', project: 'Mobile App v2', severity: 'Critical', sevBadge: 'badge-red', owner: 'MC', status: 'Open', stsBadge: 'badge-yellow' },
  { id: 'I-001', type: 'Issue', typeBadge: 'badge-yellow', desc: 'Database migration performance', project: 'Data Lake', severity: 'High', sevBadge: 'badge-yellow', owner: 'RS', status: 'In Progress', stsBadge: 'badge-blue' },
  { id: 'D-001', type: 'Dependency', typeBadge: 'badge-blue', desc: 'Auth module blocks mobile development', project: 'API Gateway', severity: 'Critical', sevBadge: 'badge-red', owner: 'JW', status: 'Blocked', stsBadge: 'badge-red' },
  { id: 'A-001', type: 'Assumption', typeBadge: 'badge-purple', desc: 'Client will provide test data by Apr 20', project: 'CRM Migration', severity: 'Medium', sevBadge: 'badge-yellow', owner: 'PP', status: 'Pending', stsBadge: 'badge-yellow' },
  { id: 'R-003', type: 'Risk', typeBadge: 'badge-red', desc: 'Budget overrun on Mobile App', project: 'Mobile App v2', severity: 'High', sevBadge: 'badge-yellow', owner: 'SJ', status: 'Monitoring', stsBadge: 'badge-blue' },
];

const riskHeatmap = [
  { name: 'Project Alpha', border: 'border-red-200', bg: 'from-red-50', nameColor: 'text-red-800', cells: [{ l: 'Schedule', bg: 'bg-red-100', c: 'text-red-700' }, { l: 'Budget', bg: 'bg-yellow-100', c: 'text-yellow-700' }, { l: 'Quality', bg: 'bg-green-100', c: 'text-green-700' }], summary: 'Overall: High risk · 2 blockers' },
  { name: 'Mobile App v2', border: 'border-yellow-200', bg: 'from-yellow-50', nameColor: 'text-yellow-800', cells: [{ l: 'Schedule', bg: 'bg-yellow-100', c: 'text-yellow-700' }, { l: 'Budget', bg: 'bg-red-100', c: 'text-red-700' }, { l: 'Quality', bg: 'bg-green-100', c: 'text-green-700' }], summary: 'Overall: Medium risk · Over budget' },
  { name: 'CRM Migration', border: 'border-green-200', bg: 'from-green-50', nameColor: 'text-green-800', cells: [{ l: 'Schedule', bg: 'bg-green-100', c: 'text-green-700' }, { l: 'Budget', bg: 'bg-green-100', c: 'text-green-700' }, { l: 'Quality', bg: 'bg-green-100', c: 'text-green-700' }], summary: 'Overall: Low risk · 92% complete' },
];

const crTable = [
  { id: 'CR-042', title: 'Add SSO authentication module', project: 'API Gateway v3', impact: '+$28K · +2 weeks', impactColor: 'text-red-600', from: 'TechCorp', badge: 'badge-yellow', status: 'Pending' },
  { id: 'CR-041', title: 'Multi-language support for mobile', project: 'Mobile App v2', impact: '+$12K · +1 week', impactColor: 'text-yellow-600', from: 'Internal', badge: 'badge-yellow', status: 'Pending' },
  { id: 'CR-040', title: 'Additional data connectors', project: 'Data Lake', impact: '+$8K · +3 days', impactColor: 'text-blue-600', from: 'DataFlow Inc', badge: 'badge-green', status: 'Approved' },
  { id: 'CR-039', title: 'Custom dashboard widgets', project: 'CRM Migration', impact: '+$4K · +2 days', impactColor: 'text-blue-600', from: 'InnoVentures', badge: 'badge-green', status: 'Approved' },
  { id: 'CR-038', title: 'Redesign onboarding flow', project: 'Mobile App v2', impact: '+$18K · +2 weeks', impactColor: 'text-red-600', from: 'Internal', badge: 'badge-red', status: 'Rejected' },
];

const rfiTable = [
  { id: 'RFI-018', q: 'API rate limits for enterprise tier?', project: 'API Gateway v3', from: 'TechCorp', due: 'Apr 18', badge: 'badge-yellow', status: 'Open' },
  { id: 'RFI-017', q: 'Data retention policy for compliance?', project: 'Data Lake', from: 'Legal Team', due: 'Apr 20', badge: 'badge-yellow', status: 'Open' },
  { id: 'RFI-016', q: 'Supported payment gateways?', project: 'Mobile App v2', from: 'InnoVentures', due: 'Apr 15', badge: 'badge-green', status: 'Answered' },
  { id: 'RFI-015', q: 'SLA guarantees for uptime?', project: 'CRM Migration', from: 'CloudNine', due: 'Apr 12', badge: 'badge-green', status: 'Answered' },
];

const milestoneTimeline = [
  { icon: Check, iconBg: 'bg-green-500', lineBg: 'bg-green-200', bg: 'bg-green-50', border: 'border-green-100', title: 'CRM Data Migration Complete', dateLabel: 'Delivered Apr 10', dateColor: 'text-green-600', desc: 'CRM Migration · All 248K records migrated with 99.8% accuracy' },
  { icon: Check, iconBg: 'bg-green-500', lineBg: 'bg-green-200', bg: 'bg-green-50', border: 'border-green-100', title: 'Data Lake Phase 1 Go-Live', dateLabel: 'Delivered Apr 8', dateColor: 'text-green-600', desc: 'Data Lake · Core pipeline operational · Processing 2M events/day' },
  { icon: Clock, iconBg: 'bg-blue-500', lineBg: 'bg-blue-200', bg: 'bg-blue-50', border: 'border-blue-100', title: 'API Gateway Auth Module', dateLabel: 'Due Apr 22', dateColor: 'text-blue-600', desc: 'API Gateway v3 · OAuth2 + SSO · Blocking Mobile App v2 · 85% done' },
  { icon: Clock, iconBg: 'bg-blue-500', lineBg: 'bg-blue-200', bg: 'bg-blue-50', border: 'border-blue-100', title: 'Project Alpha — Beta Release', dateLabel: 'Due May 1', dateColor: 'text-blue-600', desc: 'Project Alpha · Feature freeze · Internal testing phase · 68% done' },
  { icon: AlertTriangle, iconBg: 'bg-yellow-500', lineBg: 'bg-yellow-200', bg: 'bg-yellow-50', border: 'border-yellow-100', title: 'Mobile App v2 — TestFlight', dateLabel: 'Due May 15 — At Risk', dateColor: 'text-yellow-600', desc: 'Mobile App v2 · Blocked by API Gateway dependency · 45% done' },
  { icon: Circle, iconBg: 'bg-slate-300', lineBg: null, bg: 'bg-slate-50', border: 'border-slate-100', title: 'Brand Refresh — Launch', dateLabel: 'Due Jun 15', dateColor: 'text-slate-500', desc: 'Brand Refresh · New identity, website, collateral · 30% done' },
];

const signOffStatus = [
  { icon: CheckCircle2, iconColor: 'text-green-600', bg: 'bg-green-50', name: 'CRM Migration — Phase 1', desc: 'Signed off by Rania Jamil · Apr 10', badge: 'badge-green', status: 'Approved' },
  { icon: CheckCircle2, iconColor: 'text-green-600', bg: 'bg-green-50', name: 'Data Lake — Core Pipeline', desc: 'Signed off by Tech Lead · Apr 8', badge: 'badge-green', status: 'Approved' },
  { icon: Clock, iconColor: 'text-yellow-600', bg: 'bg-yellow-50', name: 'Project Alpha — Design Review', desc: 'Awaiting client review · Sent Apr 14', badge: 'badge-yellow', status: 'Pending' },
  { icon: Circle, iconColor: 'text-slate-400', bg: 'bg-slate-50', name: 'API Gateway — Security Audit', desc: 'Scheduled for Apr 25', badge: 'badge-blue', status: 'Upcoming' },
];

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
function Projects() {
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
      <section className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span>Ecosystem</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-blue-600 font-semibold">Projects</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Cortex Intell Projects</h1>
          <p className="text-slate-500">Deliver On Time — Project Management · Tasks · Scheduling · Resources · Risk · Changes · Milestones.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline"><Calendar className="w-4 h-4" /> Gantt</button>
          <button className="btn-outline"><LayoutGrid className="w-4 h-4" /> Kanban</button>
          <button className="btn-primary"><FolderPlus className="w-4 h-4" /> New Project</button>
        </div>
      </section>

      {/* HERO */}
      <section className="services-hero animate-fade-in-up mb-5">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge badge-blue">PROJECT HUB</span>
            <span className="badge badge-purple">7 SUB-MODULES</span>
          </div>
          <h2 className="text-3xl font-extrabold mb-2">Cortex Intell Projects</h2>
          <p className="text-white/80 max-w-3xl">End-to-end project delivery — manage projects, break down tasks, schedule timelines, allocate resources, track risks, handle change requests, and deliver milestones on time.</p>
        </div>
      </section>

      {/* TAB PANELS */}
      {activeTab === 'dashboard' && <DashboardPanel switchTab={switchTab} />}
      {activeTab === 'management' && <ManagementPanel />}
      {activeTab === 'tasks' && <TasksPanel />}
      {activeTab === 'scheduling' && <SchedulingPanel />}
      {activeTab === 'resources' && <ResourcesPanel />}
      {activeTab === 'risks' && <RisksPanel />}
      {activeTab === 'changes' && <ChangesPanel />}
      {activeTab === 'milestones' && <MilestonesPanel />}
    </div>
  );
}

/* ============================================================
   KPI CARD
   ============================================================ */
function KpiCard({ label, value, delta, deltaColor = 'text-green-600' }) {
  return (
    <div className="kpi-card card-hover">
      <div className="text-[10px] font-bold text-slate-500 tracking-wider">{label}</div>
      <div className="text-2xl font-extrabold text-grad mt-1">{value}</div>
      <div className={`text-xs ${deltaColor} font-semibold mt-1`}>{delta}</div>
    </div>
  );
}

/* ============================================================
   DASHBOARD PANEL
   ============================================================ */
function DashboardPanel({ switchTab }) {
  return (
    <div className="fos-panel active">
      {/* Sub-Module Cards */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 mb-6">
        {subModuleCards.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.tab} className="glass rounded-xl p-4 card-hover cursor-pointer text-center" onClick={() => switchTab(m.tab)}>
              <div className={`w-10 h-10 mx-auto mb-2 rounded-xl ${m.bg} ${m.text} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-700">{m.label}</div>
            </div>
          );
        })}
      </section>

      {/* Row 1: Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-600" /> Project Completion Trend</h3>
          <div style={{ height: 240 }}>
            <Line data={completionTrendData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: '#f1f5f9' }, beginAtZero: true, max: 100 }, x: { grid: { display: false } } } }} />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><PieChart className="w-4 h-4 text-violet-600" /> Project Status</h3>
          <div style={{ height: 240 }}>
            <Doughnut data={statusChartData} options={doughnutDefaults} />
          </div>
        </div>
      </section>

      {/* Row 2: Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-blue-600" /> Resource Utilization</h3>
          <div style={{ height: 240 }}>
            <Bar data={utilizationData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: '#f1f5f9' }, beginAtZero: true, max: 100 }, x: { grid: { display: false } } } }} />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Wallet className="w-4 h-4 text-violet-600" /> Budget vs Actual</h3>
          <div style={{ height: 240 }}>
            <Line data={budgetVsActualData} options={lineDefaults()} />
          </div>
        </div>
      </section>

      {/* KPI Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard label="ACTIVE PROJECTS" value="12" delta="Currently running" deltaColor="text-blue-600" />
        <KpiCard label="AVG COMPLETION" value="68%" delta="On track overall" />
        <KpiCard label="AT RISK" value="2" delta="Need attention" deltaColor="text-red-600" />
        <KpiCard label="RESOURCE UTILIZATION" value="85%" delta="Healthy range" />
      </section>

      {/* Active Projects List */}
      <section className="glass-strong rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><FolderOpen className="w-4 h-4 text-blue-600" /> Active Projects</h3>
        <div className="space-y-3">
          {activeProjectsList.map((p) => (
            <div key={p.name} className="flex items-center gap-4 p-3 hover:bg-blue-50/50 rounded-xl transition">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.grad} text-white flex items-center justify-center font-bold text-sm`}>{p.initials}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1"><span className="font-semibold text-sm">{p.name}</span><span className={`text-xs font-bold ${p.pctColor}`}>{p.pct}%</span></div>
                <div className="progress"><div className="progress-fill" style={{ width: p.pct + '%' }}></div></div>
              </div>
              <span className={`badge ${p.badge}`}>{p.status}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity Feed */}
      <section className="glass-strong rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-violet-600" /> Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 hover:bg-violet-50/50 rounded-xl transition">
            <div className="w-9 h-9 rounded-lg bg-green-100 text-green-600 flex items-center justify-center"><CheckCircle2 className="w-4 h-4" /></div>
            <div className="flex-1"><div className="text-sm font-semibold">CRM Data Migration Phase 1 completed</div><div className="text-xs text-slate-500">Signed off by Rania Jamil</div></div>
            <span className="text-xs text-slate-400">2h ago</span>
          </div>
          <div className="flex items-center gap-3 p-3 hover:bg-violet-50/50 rounded-xl transition">
            <div className="w-9 h-9 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center"><AlertTriangle className="w-4 h-4" /></div>
            <div className="flex-1"><div className="text-sm font-semibold">Project Alpha risk level elevated to High</div><div className="text-xs text-slate-500">AI Health Monitor flagged 34% deadline risk</div></div>
            <span className="text-xs text-slate-400">4h ago</span>
          </div>
          <div className="flex items-center gap-3 p-3 hover:bg-violet-50/50 rounded-xl transition">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"><GitPullRequest className="w-4 h-4" /></div>
            <div className="flex-1"><div className="text-sm font-semibold">CR-042 submitted for API Gateway SSO module</div><div className="text-xs text-slate-500">Impact: +$28K, +2 weeks — Pending approval</div></div>
            <span className="text-xs text-slate-400">6h ago</span>
          </div>
          <div className="flex items-center gap-3 p-3 hover:bg-violet-50/50 rounded-xl transition">
            <div className="w-9 h-9 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center"><Users className="w-4 h-4" /></div>
            <div className="flex-1"><div className="text-sm font-semibold">Sarah Johnson workload flagged as overloaded (94%)</div><div className="text-xs text-slate-500">Resource rebalancing recommended</div></div>
            <span className="text-xs text-slate-400">1d ago</span>
          </div>
          <div className="flex items-center gap-3 p-3 hover:bg-violet-50/50 rounded-xl transition">
            <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center"><Flag className="w-4 h-4" /></div>
            <div className="flex-1"><div className="text-sm font-semibold">Data Lake Phase 1 Go-Live milestone delivered</div><div className="text-xs text-slate-500">Core pipeline operational — 2M events/day</div></div>
            <span className="text-xs text-slate-400">2d ago</span>
          </div>
        </div>
      </section>

      {/* AI Project Insights Banner */}
      <section className="glass-blue rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden mb-6">
        <div className="absolute inset-0 opacity-20"><div className="absolute w-48 h-48 bg-white rounded-full blur-3xl -top-20 -right-20 animate-blob"></div></div>
        <div className="relative z-10 w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center"><Brain className="w-6 h-6 text-white" /></div>
        <div className="relative z-10 flex-1">
          <div className="font-bold text-white">AI Project Insights</div>
          <div className="text-white/90 text-sm">Based on current velocity, 3 projects will complete ahead of schedule. Project Alpha needs 2 additional engineers to meet deadline. Budget variance is within 3% tolerance.</div>
        </div>
        <button className="relative z-10 bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold text-sm hover:scale-105 transition">View Insights</button>
      </section>
    </div>
  );
}

/* ============================================================
   MANAGEMENT PANEL
   ============================================================ */
function ManagementPanel() {
  return (
    <div className="fos-panel active">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <KpiCard label="ACTIVE PROJECTS" value="12" delta="2 at risk" deltaColor="text-yellow-600" />
        <KpiCard label="AVG. COMPLETION" value="68%" delta="On track overall" />
        <KpiCard label="TOTAL BUDGET" value="$1.84M" delta="72% utilized" />
        <KpiCard label="TEAM MEMBERS" value="48" delta="Across all projects" deltaColor="text-slate-500" />
      </section>

      {/* AI Health Alert */}
      <section className="glass-blue rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden mb-6">
        <div className="absolute inset-0 opacity-20"><div className="absolute w-48 h-48 bg-white rounded-full blur-3xl -top-20 -right-20 animate-blob"></div></div>
        <div className="relative z-10 w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-white" /></div>
        <div className="relative z-10 flex-1">
          <div className="font-bold text-white">Project Health AI</div>
          <div className="text-white/90 text-sm">Project Alpha has 34% risk of missing deadline. 2 dependencies blocked. I've drafted a mitigation plan.</div>
        </div>
        <button className="relative z-10 bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold text-sm hover:scale-105 transition">View Plan →</button>
      </section>

      {/* Projects Grid */}
      <section className="mb-6">
        <h3 className="font-bold text-slate-900 mb-4">All Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CORTEX_DATA.projects.map((p) => (
            <div key={p.name} className="glass rounded-2xl p-5 card-hover cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <div><div className="font-bold text-slate-900">{p.name}</div><div className="text-xs text-slate-500">{p.client}</div></div>
                <span className={`badge ${pStatus[p.status] || 'badge-blue'}`}>{p.status}</span>
              </div>
              <div className="mt-3"><div className="flex justify-between text-xs mb-1"><span className="text-slate-500">Progress</span><span className="font-bold">{p.progress}%</span></div><div className="progress"><div className="progress-fill" style={{ width: p.progress + '%' }}></div></div></div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <div className="flex -space-x-2">{p.team.map((m) => <div key={m} className="avatar avatar-sm border-2 border-white">{m}</div>)}</div>
                <div className="flex items-center gap-2"><span className={`badge ${pPriority[p.priority] || 'badge-blue'}`}>{p.priority}</span><span className="text-xs text-slate-500">{p.deadline}</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Project Status + Files */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Project Status Distribution</h3>
          <div style={{ height: 240 }}>
            <Doughnut data={statusChartData} options={doughnutDefaults} />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Folder className="w-4 h-4 text-blue-600" /> Project Files</h3>
          <div className="space-y-2">
            {[
              { icon: FileText, iconBg: 'bg-blue-100 text-blue-600', name: 'Project-Alpha-Spec.pdf', desc: '2.4 MB · 2h ago' },
              { icon: Image, iconBg: 'bg-violet-100 text-violet-600', name: 'Mockups-v2.fig', desc: '18 MB · 5h ago' },
              { icon: FileSpreadsheet, iconBg: 'bg-green-100 text-green-600', name: 'Budget-Tracker.xlsx', desc: '480 KB · yesterday' },
              { icon: FileCode, iconBg: 'bg-indigo-100 text-indigo-600', name: 'API-Contract.yaml', desc: '12 KB · 2 days ago' },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.name} className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl cursor-pointer">
                  <div className={`w-9 h-9 rounded-lg ${f.iconBg} flex items-center justify-center`}><Icon className="w-4 h-4" /></div>
                  <div className="flex-1"><div className="text-sm font-semibold">{f.name}</div><div className="text-xs text-slate-500">{f.desc}</div></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   TASKS PANEL
   ============================================================ */
function TasksPanel() {
  return (
    <div className="fos-panel active">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <KpiCard label="TOTAL TASKS" value="247" delta="Across 12 projects" deltaColor="text-slate-500" />
        <KpiCard label="COMPLETED" value="168" delta="68% done" />
        <KpiCard label="IN PROGRESS" value="42" delta="17% active" deltaColor="text-slate-500" />
        <KpiCard label="SPRINT VELOCITY" value="84" delta="+12% this sprint" />
      </section>

      {/* Kanban Board */}
      <section className="mb-6">
        <h3 className="font-bold text-slate-900 mb-4">Sprint Board · Week 16</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {kanbanStages.map((s) => (
            <div key={s.key} className="kanban-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${s.color}`}></span>
                  <span className="font-bold text-sm text-slate-700">{s.title}</span>
                  <span className="text-xs text-slate-400">{CORTEX_DATA.tasks[s.key].length}</span>
                </div>
              </div>
              {CORTEX_DATA.tasks[s.key].map((t) => (
                <div key={t.title} className="kanban-card cursor-pointer">
                  <div className="text-sm font-semibold text-slate-900 mb-1">{t.title}</div>
                  <span className="badge badge-blue">{t.tag}</span>
                  <div className="flex items-center justify-between mt-3">
                    <div className="avatar avatar-sm">{t.assignee}</div>
                    <div className="text-xs text-slate-500">{t.due}</div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Burndown */}
      <section className="glass-strong rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-slate-900 mb-4">Sprint Burndown</h3>
        <div style={{ height: 260 }}>
          <Line data={burndownData} options={lineDefaults()} />
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   SCHEDULING PANEL
   ============================================================ */
function SchedulingPanel() {
  return (
    <div className="fos-panel active">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <KpiCard label="TIMELINE HEALTH" value="78%" delta="On schedule" />
        <KpiCard label="DEPENDENCIES" value="34" delta="2 blocked" deltaColor="text-yellow-600" />
        <KpiCard label="CRITICAL PATH" value="18 tasks" delta="No slack" deltaColor="text-red-600" />
        <KpiCard label="DAYS TO NEXT GATE" value="12" delta="May 28 deadline" deltaColor="text-slate-500" />
      </section>

      {/* Gantt Timeline */}
      <section className="glass-strong rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-600" /> Gantt Timeline</h3>
        <div className="space-y-3">
          {ganttBars.map((g) => (
            <div key={g.name} className="flex items-center gap-3">
              <div className="w-32 text-xs font-semibold truncate">{g.name}</div>
              <div className="flex-1 relative h-6 bg-slate-100 rounded-full">
                <div className={`absolute top-0 h-full bg-gradient-to-r ${g.grad} rounded-full flex items-center justify-center`} style={{ left: g.left, width: g.width }}>
                  <span className="text-[10px] font-bold text-white">{g.pct}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-slate-100">
          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
        </div>
      </section>

      {/* Dependencies */}
      <section className="glass-strong rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-slate-900 mb-4">Critical Dependencies</h3>
        <div className="space-y-3">
          {dependencies.map((d) => {
            const Icon = d.icon;
            return (
              <div key={d.from} className={`flex items-center gap-3 p-3 ${d.bg} rounded-xl border ${d.border}`}>
                <div className={`w-10 h-10 rounded-lg ${d.iconBg} flex items-center justify-center`}><Icon className="w-5 h-5" /></div>
                <div className="flex-1"><div className="font-semibold text-sm">{d.from}</div><div className="text-xs text-slate-500">{d.desc}</div></div>
                <span className={`badge ${d.badge}`}>{d.status}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   RESOURCES PANEL
   ============================================================ */
function ResourcesPanel() {
  return (
    <div className="fos-panel active">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <KpiCard label="TEAM SIZE" value="48" delta="Across all projects" deltaColor="text-slate-500" />
        <KpiCard label="AVG UTILIZATION" value="76%" delta="Healthy range" />
        <KpiCard label="OVERLOADED" value="3" delta="Need rebalancing" deltaColor="text-red-600" />
        <KpiCard label="AVAILABLE" value="8" delta="Can take more work" />
      </section>

      {/* Team Workload */}
      <section className="glass-strong rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2"><Users className="w-4 h-4 text-blue-600" /> Team Workload</h3>
          <button className="btn-outline text-xs">Rebalance AI</button>
        </div>
        <div className="space-y-3">
          {teamWorkload.map((t) => (
            <div key={t.name}>
              <div className="flex items-center gap-3 mb-1">
                <div className="avatar avatar-sm">{t.initials}</div>
                <div className="flex-1"><div className="text-sm font-semibold">{t.name}</div><div className="text-xs text-slate-500">{t.items}</div></div>
                <span className={`text-xs font-bold ${t.labelColor}`}>{t.label}</span>
              </div>
              <div className="progress"><div className="progress-fill" style={{ width: t.pct + '%', ...(t.barGrad ? { background: t.barGrad } : {}) }}></div></div>
            </div>
          ))}
        </div>
      </section>

      {/* Resource Allocation + Budget */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Resource Allocation by Project</h3>
          <div style={{ height: 260 }}>
            <Bar data={resourceAllocData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { y: { grid: { color: '#f1f5f9' }, stacked: true }, x: { grid: { display: false }, stacked: true } } }} />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Project Budget vs Actual</h3>
          <div className="space-y-3">
            {budgetItems.map((b) => (
              <div key={b.name} className={`p-3 ${b.bg} rounded-xl`}>
                <div className="flex justify-between mb-1"><span className="font-semibold text-sm">{b.name}</span><span className="text-xs text-slate-500">{b.spent}</span></div>
                <div className="progress"><div className="progress-fill" style={{ width: b.pct + '%', ...(b.barGrad ? { background: b.barGrad } : {}) }}></div></div>
                <div className={`text-xs ${b.statusColor} mt-1`}>{b.status}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   RISKS PANEL
   ============================================================ */
function RisksPanel() {
  return (
    <div className="fos-panel active">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <KpiCard label="OPEN RISKS" value="14" delta="4 critical" deltaColor="text-red-600" />
        <KpiCard label="OPEN ISSUES" value="8" delta="3 blockers" deltaColor="text-yellow-600" />
        <KpiCard label="MITIGATED (MTD)" value="22" delta="Resolved" />
        <KpiCard label="RISK SCORE" value="Medium" delta="Needs attention" deltaColor="text-yellow-600" />
      </section>

      {/* RAID Log */}
      <section className="glass-strong rounded-2xl overflow-hidden mb-6">
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <h3 className="font-bold text-slate-900">RAID Log (Risks · Assumptions · Issues · Dependencies)</h3>
          <button className="btn-primary text-xs"><Plus className="w-3 h-3" /> Log Item</button>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Type</th><th>Description</th><th>Project</th><th>Severity</th><th>Owner</th><th>Status</th></tr></thead>
            <tbody>
              {raidLog.map((r) => (
                <tr key={r.id}>
                  <td className="font-semibold text-blue-600">{r.id}</td>
                  <td><span className={`badge ${r.typeBadge}`}>{r.type}</span></td>
                  <td className="font-medium">{r.desc}</td>
                  <td className="text-slate-500">{r.project}</td>
                  <td><span className={`badge ${r.sevBadge}`}>{r.severity}</span></td>
                  <td>{r.owner}</td>
                  <td><span className={`badge ${r.stsBadge}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Risk Heatmap */}
      <section className="glass-strong rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-slate-900 mb-4">Risk Heatmap by Project</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {riskHeatmap.map((r) => (
            <div key={r.name} className={`p-4 rounded-xl border ${r.border} bg-gradient-to-br ${r.bg} to-white`}>
              <div className={`font-bold text-sm ${r.nameColor} mb-2`}>{r.name}</div>
              <div className="grid grid-cols-3 gap-1 text-center text-xs">
                {r.cells.map((c) => (
                  <div key={c.l} className={`p-2 ${c.bg} rounded font-bold ${c.c}`}>{c.l}</div>
                ))}
              </div>
              <div className="text-xs text-slate-500 mt-2">{r.summary}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   CHANGES PANEL
   ============================================================ */
function ChangesPanel() {
  return (
    <div className="fos-panel active">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <KpiCard label="OPEN CRs" value="6" delta="2 pending approval" deltaColor="text-yellow-600" />
        <KpiCard label="RFIs PENDING" value="4" delta="Avg 3 days response" deltaColor="text-slate-500" />
        <KpiCard label="APPROVED (MTD)" value="12" delta="$84K impact" />
        <KpiCard label="REJECTED" value="3" delta="Out of scope" deltaColor="text-red-600" />
      </section>

      {/* CR Table */}
      <section className="glass-strong rounded-2xl overflow-hidden mb-6">
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <h3 className="font-bold text-slate-900">Change Requests</h3>
          <button className="btn-primary text-xs"><Plus className="w-3 h-3" /> New CR</button>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>CR #</th><th>Title</th><th>Project</th><th>Impact</th><th>Requestor</th><th>Status</th></tr></thead>
            <tbody>
              {crTable.map((c) => (
                <tr key={c.id} className="cursor-pointer">
                  <td className="font-semibold text-blue-600">{c.id}</td>
                  <td className="font-medium">{c.title}</td>
                  <td className="text-slate-500">{c.project}</td>
                  <td><span className={`font-bold ${c.impactColor}`}>{c.impact}</span></td>
                  <td>{c.from}</td>
                  <td><span className={`badge ${c.badge}`}>{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* RFI Table */}
      <section className="glass-strong rounded-2xl overflow-hidden mb-6">
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <h3 className="font-bold text-slate-900">RFIs (Requests for Information)</h3>
          <button className="btn-outline text-xs"><Plus className="w-3 h-3" /> New RFI</button>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>RFI #</th><th>Question</th><th>Project</th><th>From</th><th>Due</th><th>Status</th></tr></thead>
            <tbody>
              {rfiTable.map((r) => (
                <tr key={r.id}>
                  <td className="font-semibold text-blue-600">{r.id}</td>
                  <td className="font-medium">{r.q}</td>
                  <td className="text-slate-500">{r.project}</td>
                  <td>{r.from}</td>
                  <td className="text-slate-500">{r.due}</td>
                  <td><span className={`badge ${r.badge}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   MILESTONES PANEL
   ============================================================ */
function MilestonesPanel() {
  return (
    <div className="fos-panel active">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <KpiCard label="TOTAL MILESTONES" value="38" delta="Across all projects" deltaColor="text-slate-500" />
        <KpiCard label="COMPLETED" value="24" delta="63% delivered" />
        <KpiCard label="UPCOMING" value="8" delta="Next 30 days" deltaColor="text-slate-500" />
        <KpiCard label="ON-TIME RATE" value="87%" delta="Above 80% target" />
      </section>

      {/* Milestone Timeline */}
      <section className="glass-strong rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Flag className="w-4 h-4 text-sky-600" /> Milestone Timeline</h3>
        <div className="space-y-4">
          {milestoneTimeline.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div key={m.title} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full ${m.iconBg} text-white flex items-center justify-center`}><Icon className="w-4 h-4" /></div>
                  {m.lineBg && <div className={`w-0.5 h-12 ${m.lineBg}`}></div>}
                </div>
                <div className={`flex-1 p-4 ${m.bg} rounded-xl border ${m.border}`}>
                  <div className="flex items-center justify-between"><span className="font-bold text-sm">{m.title}</span><span className={`text-xs ${m.dateColor} font-bold`}>{m.dateLabel}</span></div>
                  <div className="text-xs text-slate-500 mt-1">{m.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Delivery Summary + Sign-off */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Delivery Performance</h3>
          <div style={{ height: 260 }}>
            <Bar data={deliveryChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { y: { grid: { color: '#f1f5f9' }, stacked: true }, x: { grid: { display: false }, stacked: true } } }} />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Sign-off Status</h3>
          <div className="space-y-3">
            {signOffStatus.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.name} className={`flex items-center gap-3 p-3 ${s.bg} rounded-xl`}>
                  <Icon className={`w-5 h-5 ${s.iconColor}`} />
                  <div className="flex-1"><div className="font-semibold text-sm">{s.name}</div><div className="text-xs text-slate-500">{s.desc}</div></div>
                  <span className={`badge ${s.badge}`}>{s.status}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Projects;
