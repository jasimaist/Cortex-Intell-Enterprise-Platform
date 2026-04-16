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
  Bot, Workflow, ShieldCheck, Zap, CheckSquare, Cpu, ScrollText,
  TrendingUp, Activity, Sparkles, ChevronRight, Download, Plus,
  Filter, Search, Eye, MoreHorizontal, Clock, Play, Pause,
  CheckCircle, AlertTriangle, XCircle, ArrowRight, Settings,
  GitBranch, Timer, BarChart3, Target, RefreshCw, CircleDot,
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
  cutout: '60%',
};

/* ============================================================
   STATIC DATA
   ============================================================ */
const subModuleCards = [
  { tab: 'composer', icon: Workflow, label: 'Composer', sub: '8 Workflows', bg: 'bg-blue-100', text: 'text-blue-600' },
  { tab: 'rules', icon: ShieldCheck, label: 'Rules', sub: '12 Active', bg: 'bg-indigo-100', text: 'text-indigo-600' },
  { tab: 'triggers', icon: Zap, label: 'Triggers', sub: '18 Events', bg: 'bg-violet-100', text: 'text-violet-600' },
  { tab: 'approvals', icon: CheckSquare, label: 'Approvals', sub: '5 Pending', bg: 'bg-sky-100', text: 'text-sky-600' },
  { tab: 'engine', icon: Cpu, label: 'Engine', sub: '99.2% Uptime', bg: 'bg-orange-100', text: 'text-orange-600' },
  { tab: 'logs', icon: ScrollText, label: 'Run Logs', sub: '14,705 Entries', bg: 'bg-cyan-100', text: 'text-cyan-600' },
];

const automationRules = [
  { id: 'AR-001', name: 'Lead Score Threshold', trigger: 'Lead score > 80', action: 'Notify sales team + create task', status: 'Active', statusBadge: 'badge-green', runs: 342, success: '98.2%' },
  { id: 'AR-002', name: 'Invoice Overdue Alert', trigger: 'Invoice past due > 7 days', action: 'Send reminder email + escalate', status: 'Active', statusBadge: 'badge-green', runs: 156, success: '99.1%' },
  { id: 'AR-003', name: 'Case Auto-Assignment', trigger: 'New support case created', action: 'Route to available agent by skill', status: 'Active', statusBadge: 'badge-green', runs: 891, success: '97.5%' },
  { id: 'AR-004', name: 'Deal Stage Progression', trigger: 'Proposal opened 3+ times', action: 'Move to negotiation + alert AE', status: 'Active', statusBadge: 'badge-green', runs: 67, success: '94.0%' },
  { id: 'AR-005', name: 'Employee Onboarding', trigger: 'New hire start date = today', action: 'Trigger onboarding workflow', status: 'Active', statusBadge: 'badge-green', runs: 38, success: '100%' },
  { id: 'AR-006', name: 'Data Quality Check', trigger: 'New record imported', action: 'Validate + normalize fields', status: 'Active', statusBadge: 'badge-green', runs: 2410, success: '99.8%' },
  { id: 'AR-007', name: 'Campaign Budget Alert', trigger: 'Spend > 90% of budget', action: 'Pause campaign + notify marketing', status: 'Paused', statusBadge: 'badge-yellow', runs: 12, success: '100%' },
  { id: 'AR-008', name: 'SLA Breach Warning', trigger: 'Case open > 24 hours', action: 'Escalate to manager', status: 'Active', statusBadge: 'badge-green', runs: 204, success: '96.1%' },
];

const triggerEvents = [
  { name: 'Record Created', type: 'Data Event', icon: Plus, bg: 'bg-blue-100', text: 'text-blue-600', count: 4820, freq: '~120/day' },
  { name: 'Record Updated', type: 'Data Event', icon: RefreshCw, bg: 'bg-indigo-100', text: 'text-indigo-600', count: 8340, freq: '~210/day' },
  { name: 'Threshold Exceeded', type: 'Condition', icon: AlertTriangle, bg: 'bg-red-100', text: 'text-red-600', count: 312, freq: '~8/day' },
  { name: 'Scheduled Timer', type: 'Time-Based', icon: Clock, bg: 'bg-violet-100', text: 'text-violet-600', count: 1440, freq: 'Every 15m' },
  { name: 'Webhook Received', type: 'External', icon: GitBranch, bg: 'bg-sky-100', text: 'text-sky-600', count: 2180, freq: '~55/day' },
  { name: 'User Action', type: 'Interactive', icon: Target, bg: 'bg-orange-100', text: 'text-orange-600', count: 956, freq: '~24/day' },
  { name: 'API Call', type: 'Integration', icon: Cpu, bg: 'bg-green-100', text: 'text-green-600', count: 3640, freq: '~91/day' },
  { name: 'Email Received', type: 'Communication', icon: CircleDot, bg: 'bg-cyan-100', text: 'text-cyan-600', count: 1820, freq: '~46/day' },
];

const pendingApprovals = [
  { id: 'APR-041', title: 'Budget increase -- Marketing Q2', requester: 'Anna K.', avatar: 'AK', amount: '$12,000', submitted: '2h ago', priority: 'High', priBadge: 'badge-red', type: 'Finance' },
  { id: 'APR-040', title: 'New hire -- Senior Engineer', requester: 'Elena R.', avatar: 'ER', amount: '$145K/yr', submitted: '4h ago', priority: 'High', priBadge: 'badge-red', type: 'HR' },
  { id: 'APR-039', title: 'Vendor contract renewal -- AWS', requester: 'James W.', avatar: 'JW', amount: '$48,000', submitted: '1d ago', priority: 'Medium', priBadge: 'badge-yellow', type: 'IT' },
  { id: 'APR-038', title: 'Campaign launch -- LinkedIn Ads', requester: 'Tom B.', avatar: 'TB', amount: '$8,500', submitted: '1d ago', priority: 'Medium', priBadge: 'badge-yellow', type: 'Marketing' },
  { id: 'APR-037', title: 'Travel request -- Client visit', requester: 'Sarah J.', avatar: 'SJ', amount: '$2,400', submitted: '2d ago', priority: 'Low', priBadge: 'badge-blue', type: 'Operations' },
];

const recentRuns = [
  { id: 'RUN-8842', agent: 'Finance Guardian', trigger: 'Scheduled (15m)', status: 'Success', statusBadge: 'badge-green', duration: '1.2s', records: 48, time: '2 min ago' },
  { id: 'RUN-8841', agent: 'Lead Hunter', trigger: 'Webhook', status: 'Success', statusBadge: 'badge-green', duration: '3.8s', records: 12, time: '5 min ago' },
  { id: 'RUN-8840', agent: 'Support Triage', trigger: 'Record Created', status: 'Success', statusBadge: 'badge-green', duration: '0.4s', records: 1, time: '8 min ago' },
  { id: 'RUN-8839', agent: 'Content Writer', trigger: 'Scheduled (daily)', status: 'Success', statusBadge: 'badge-green', duration: '12.6s', records: 3, time: '22 min ago' },
  { id: 'RUN-8838', agent: 'Data Janitor', trigger: 'API Call', status: 'Warning', statusBadge: 'badge-yellow', duration: '2.1s', records: 124, time: '35 min ago' },
  { id: 'RUN-8837', agent: 'Outreach Assistant', trigger: 'User Action', status: 'Failed', statusBadge: 'badge-red', duration: '0.8s', records: 0, time: '1h ago' },
  { id: 'RUN-8836', agent: 'Meeting Scribe', trigger: 'Webhook', status: 'Success', statusBadge: 'badge-green', duration: '45.2s', records: 1, time: '1h ago' },
  { id: 'RUN-8835', agent: 'Finance Guardian', trigger: 'Scheduled (15m)', status: 'Success', statusBadge: 'badge-green', duration: '1.1s', records: 52, time: '1.5h ago' },
];

const logEntries = [
  { time: '2026-04-16 14:32:18', agent: 'Finance Guardian', status: 'Success', statusBadge: 'badge-green', duration: '1.2s', message: 'Scanned 48 transactions, 0 anomalies found', runId: 'RUN-8842' },
  { time: '2026-04-16 14:28:45', agent: 'Lead Hunter', status: 'Success', statusBadge: 'badge-green', duration: '3.8s', message: 'Qualified 4 new leads, scored & routed', runId: 'RUN-8841' },
  { time: '2026-04-16 14:24:12', agent: 'Support Triage', status: 'Success', statusBadge: 'badge-green', duration: '0.4s', message: 'Case CS-1042 routed to Michael C.', runId: 'RUN-8840' },
  { time: '2026-04-16 14:10:33', agent: 'Content Writer', status: 'Success', statusBadge: 'badge-green', duration: '12.6s', message: 'Generated 3 blog drafts for Q2 campaign', runId: 'RUN-8839' },
  { time: '2026-04-16 13:58:01', agent: 'Data Janitor', status: 'Warning', statusBadge: 'badge-yellow', duration: '2.1s', message: '124 records cleaned, 3 skipped (missing fields)', runId: 'RUN-8838' },
  { time: '2026-04-16 13:42:19', agent: 'Outreach Assistant', status: 'Failed', statusBadge: 'badge-red', duration: '0.8s', message: 'SMTP timeout -- retry scheduled in 5 min', runId: 'RUN-8837' },
  { time: '2026-04-16 13:30:55', agent: 'Meeting Scribe', status: 'Success', statusBadge: 'badge-green', duration: '45.2s', message: 'Transcribed 32 min call with TechCorp NSW', runId: 'RUN-8836' },
  { time: '2026-04-16 13:17:08', agent: 'Finance Guardian', status: 'Success', statusBadge: 'badge-green', duration: '1.1s', message: 'Scanned 52 transactions, flagged 1 for review', runId: 'RUN-8835' },
  { time: '2026-04-16 13:02:41', agent: 'HR Onboarder', status: 'Success', statusBadge: 'badge-green', duration: '5.4s', message: 'Onboarding flow started for new hire', runId: 'RUN-8834' },
  { time: '2026-04-16 12:45:22', agent: 'Lead Hunter', status: 'Success', statusBadge: 'badge-green', duration: '4.1s', message: 'Scored 8 leads, 2 qualified as hot', runId: 'RUN-8833' },
];

const workflows = [
  { name: 'Lead Qualification Pipeline', nodes: 5, status: 'Active', statusBadge: 'badge-green', runs: 1247, lastRun: '5 min ago' },
  { name: 'Invoice Processing', nodes: 7, status: 'Active', statusBadge: 'badge-green', runs: 892, lastRun: '12 min ago' },
  { name: 'Customer Onboarding', nodes: 9, status: 'Active', statusBadge: 'badge-green', runs: 156, lastRun: '1h ago' },
  { name: 'Support Escalation', nodes: 4, status: 'Active', statusBadge: 'badge-green', runs: 3410, lastRun: '8 min ago' },
  { name: 'Content Generation', nodes: 6, status: 'Active', statusBadge: 'badge-green', runs: 412, lastRun: '22 min ago' },
  { name: 'Data Sync Pipeline', nodes: 8, status: 'Paused', statusBadge: 'badge-yellow', runs: 5124, lastRun: '2h ago' },
  { name: 'Meeting Summarizer', nodes: 3, status: 'Active', statusBadge: 'badge-green', runs: 687, lastRun: '1h ago' },
  { name: 'Campaign Budget Monitor', nodes: 4, status: 'Draft', statusBadge: 'badge-blue', runs: 0, lastRun: 'Never' },
];

/* ============================================================
   CHART DATA
   ============================================================ */
const executionTrendData = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    { label: 'Successful', data: [1820, 2040, 2280, 2510, 2780, 3120], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.12)', tension: 0.4, fill: true },
    { label: 'Failed', data: [32, 28, 24, 18, 22, 16], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,.08)', tension: 0.4, fill: true },
  ],
};

const taskDistributionData = {
  labels: ['Finance', 'CRM', 'Support', 'Content', 'Data', 'HR'],
  datasets: [{ data: [28, 22, 18, 14, 12, 6], backgroundColor: ['#3b82f6', '#6366f1', '#8b5cf6', '#22d3ee', '#f59e0b', '#10b981'], borderWidth: 0 }],
};

const successRateData = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    { label: 'Success Rate %', data: [96.8, 97.2, 97.8, 98.0, 98.2, 98.4], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.12)', tension: 0.4, fill: true, pointRadius: 4 },
    { label: 'Target', data: [95, 95, 95, 95, 95, 95], borderColor: '#94a3b8', borderDash: [5, 5], backgroundColor: 'transparent', tension: 0, pointRadius: 0 },
  ],
};

const automationSavingsData = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    { label: 'Hours Saved', data: [42, 48, 56, 62, 68, 74], backgroundColor: 'rgba(59,130,246,.7)', borderRadius: 4 },
    { label: 'Cost Saved ($K)', data: [8.4, 9.6, 11.2, 12.4, 13.6, 14.8], backgroundColor: 'rgba(16,185,129,.7)', borderRadius: 4 },
  ],
};

const rulesPerformanceData = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    { label: 'Rules Triggered', data: [280, 310, 340, 380, 420, 460], borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,.12)', tension: 0.4, fill: true },
    { label: 'Actions Completed', data: [272, 302, 334, 374, 414, 452], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.08)', tension: 0.4, fill: true },
  ],
};

const triggerVolumeData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    { label: 'Data Events', data: [420, 380, 450, 410, 390, 120, 80], backgroundColor: 'rgba(59,130,246,.7)', borderRadius: 4 },
    { label: 'Scheduled', data: [96, 96, 96, 96, 96, 96, 96], backgroundColor: 'rgba(139,92,246,.7)', borderRadius: 4 },
    { label: 'Webhooks', data: [180, 210, 195, 220, 200, 45, 30], backgroundColor: 'rgba(34,211,238,.7)', borderRadius: 4 },
  ],
};

const approvalTrendData = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    { label: 'Submitted', data: [18, 22, 20, 24, 28, 26], borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,.12)', tension: 0.4, fill: true },
    { label: 'Approved', data: [16, 20, 18, 22, 26, 24], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.08)', tension: 0.4, fill: true },
    { label: 'Rejected', data: [2, 2, 2, 2, 2, 2], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,.05)', tension: 0.4, fill: true },
  ],
};

const errorRateData = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    { label: 'Error Rate %', data: [3.2, 2.8, 2.2, 2.0, 1.8, 1.6], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,.12)', tension: 0.4, fill: true, pointRadius: 4 },
    { label: 'Threshold', data: [5, 5, 5, 5, 5, 5], borderColor: '#94a3b8', borderDash: [5, 5], backgroundColor: 'transparent', tension: 0, pointRadius: 0 },
  ],
};

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
function Agents() {
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
            <span className="text-blue-600 font-semibold">Cortex Intell Agents</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Cortex Intell Agents</h1>
          <p className="text-slate-500">Automate. Orchestrate. Execute.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline"><Download className="w-4 h-4" /> Export</button>
          <button className="btn-outline"><Filter className="w-4 h-4" /> Filter</button>
          <button className="btn-primary"><Plus className="w-4 h-4" /> New Agent</button>
        </div>
      </section>

      {/* KPI STRIP */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard label="ACTIVE AGENTS" value="12" delta="+2 this month" icon={<Bot className="w-5 h-5" />} bg="bg-blue-100" text="text-blue-600" />
        <KpiCard label="TASKS AUTOMATED" value="1,247" delta="+18.4% ↑" icon={<Zap className="w-5 h-5" />} bg="bg-indigo-100" text="text-indigo-600" />
        <KpiCard label="SUCCESS RATE" value="98.4%" delta="+1.2% ↑" icon={<Target className="w-5 h-5" />} bg="bg-violet-100" text="text-violet-600" />
        <KpiCard label="HOURS SAVED" value="340hrs" delta="$68K value" icon={<Timer className="w-5 h-5" />} bg="bg-sky-100" text="text-sky-600" />
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
            <div className="font-bold text-white">AI Agent Copilot</div>
            <div className="text-white/90 text-sm">Finance Guardian detected an unusual $18K expense in Marketing -- flagged for review. Lead Hunter qualified 4 new leads today with a combined value of $620K.</div>
          </div>
          <button className="relative z-10 bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold text-sm hover:scale-105 transition">View All</button>
        </div>
      </section>

      {/* TAB PANELS */}
      {activeTab === 'dashboard' && <DashboardPanel switchTab={switchTab} />}
      {activeTab === 'composer' && <ComposerPanel />}
      {activeTab === 'rules' && <RulesPanel />}
      {activeTab === 'triggers' && <TriggersPanel />}
      {activeTab === 'approvals' && <ApprovalsPanel />}
      {activeTab === 'engine' && <EnginePanel />}
      {activeTab === 'logs' && <LogsPanel />}
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
  const agents = CORTEX_DATA.agents;

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

      {/* Row 1: Execution Trend + Task Distribution */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-600" /> Agent Executions</h3>
            <span className="badge badge-green">+18.4%</span>
          </div>
          <div style={{ height: 240 }}>
            <Line data={executionTrendData} options={lineDefaults()} />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-indigo-600" /> Task Distribution</h3>
            <span className="text-xs text-slate-500">By Module</span>
          </div>
          <div style={{ height: 240 }}>
            <Doughnut data={taskDistributionData} options={doughnutDefaults} />
          </div>
        </div>
      </section>

      {/* Row 2: Success Rate + Automation Savings */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><Target className="w-4 h-4 text-violet-600" /> Success Rate</h3>
            <span className="badge badge-green">98.4%</span>
          </div>
          <div style={{ height: 240 }}>
            <Line
              data={successRateData}
              options={{
                ...lineDefaults((v) => v + '%'),
                scales: {
                  ...lineDefaults((v) => v + '%').scales,
                  y: { ...lineDefaults((v) => v + '%').scales.y, min: 90, max: 100 },
                },
              }}
            />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><Timer className="w-4 h-4 text-sky-600" /> Automation Savings</h3>
            <span className="text-xs text-slate-500">Monthly</span>
          </div>
          <div style={{ height: 240 }}>
            <Bar
              data={automationSavingsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { boxWidth: 8, font: { size: 10 } } } },
                scales: { y: { grid: { color: '#f1f5f9' } }, x: { grid: { display: false } } },
              }}
            />
          </div>
        </div>
      </section>

      {/* Row 3: Active Agents List + Recent Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><Bot className="w-4 h-4 text-blue-600" /> Active Agents</h3>
            <button className="btn-outline text-xs" onClick={() => switchTab('engine')}>View All</button>
          </div>
          <div className="space-y-3">
            {agents.slice(0, 6).map((a) => (
              <div key={a.name} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-blue-50/40 transition cursor-pointer">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${a.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-slate-900">{a.name}</div>
                  <div className="text-xs text-slate-500">{a.desc}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm text-blue-600">{a.runs} runs</div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${a.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>{a.status}</span>
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
            <ActivityRow icon={<CheckCircle className="w-4 h-4" />} bg="bg-green-100 text-green-600" title="Finance Guardian scanned 48 transactions" sub="0 anomalies detected -- 2 min ago" />
            <ActivityRow icon={<Zap className="w-4 h-4" />} bg="bg-blue-100 text-blue-600" title="Lead Hunter qualified 4 new leads" sub="Combined value $620K -- 5 min ago" />
            <ActivityRow icon={<CheckSquare className="w-4 h-4" />} bg="bg-violet-100 text-violet-600" title="Support Triage routed case CS-1042" sub="Assigned to Michael C. -- 8 min ago" />
            <ActivityRow icon={<Bot className="w-4 h-4" />} bg="bg-cyan-100 text-cyan-600" title="Content Writer generated 3 blog drafts" sub="Q2 campaign content -- 22 min ago" />
            <ActivityRow icon={<AlertTriangle className="w-4 h-4" />} bg="bg-yellow-100 text-yellow-600" title="Data Janitor: 3 records skipped" sub="Missing required fields -- 35 min ago" />
            <ActivityRow icon={<XCircle className="w-4 h-4" />} bg="bg-red-100 text-red-600" title="Outreach Assistant SMTP timeout" sub="Retry scheduled in 5 min -- 1h ago" />
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
          <div className="font-bold text-white">AI Agent Insights</div>
          <div className="text-white/90 text-sm">Agents saved 340 hours this month ($68K value). Success rate trending up to 98.4%. Data Janitor processed 5,124 records with 99.8% accuracy. Recommend enabling Campaign Budget Monitor agent for Q2.</div>
        </div>
        <button className="relative z-10 bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold text-sm hover:scale-105 transition">View All Insights</button>
      </section>
    </div>
  );
}

/* ============================================================
   COMPOSER PANEL
   ============================================================ */
function ComposerPanel() {
  return (
    <div className="fos-panel active" id="panel-composer">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-blue-100 text-blue-600"><Workflow className="w-5 h-5" /></div>
          <div><h2>Workflow Composer</h2><p>Design and manage automated workflows</p></div>
        </div>

        {/* Workflow Canvas */}
        <div className="glass-strong rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Lead Qualification Pipeline</h3>
            <div className="flex gap-2">
              <button className="btn-outline text-xs"><Play className="w-3 h-3" /> Run</button>
              <button className="btn-outline text-xs"><Settings className="w-3 h-3" /> Configure</button>
            </div>
          </div>
          {/* Visual Node Diagram */}
          <div className="bg-slate-50 rounded-xl p-6 overflow-x-auto">
            <div className="flex items-center gap-3 min-w-[700px]">
              {/* Trigger Node */}
              <div className="flex-shrink-0 w-36 bg-blue-50 border-2 border-blue-300 rounded-xl p-3 text-center shadow-sm">
                <div className="w-8 h-8 mx-auto rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2"><Zap className="w-4 h-4" /></div>
                <div className="text-xs font-bold text-blue-800">Trigger</div>
                <div className="text-[10px] text-blue-600 mt-1">New Lead Created</div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
              {/* Enrich Node */}
              <div className="flex-shrink-0 w-36 bg-indigo-50 border-2 border-indigo-300 rounded-xl p-3 text-center shadow-sm">
                <div className="w-8 h-8 mx-auto rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2"><Search className="w-4 h-4" /></div>
                <div className="text-xs font-bold text-indigo-800">Enrich</div>
                <div className="text-[10px] text-indigo-600 mt-1">Fetch Company Data</div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
              {/* Score Node */}
              <div className="flex-shrink-0 w-36 bg-violet-50 border-2 border-violet-300 rounded-xl p-3 text-center shadow-sm">
                <div className="w-8 h-8 mx-auto rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center mb-2"><Target className="w-4 h-4" /></div>
                <div className="text-xs font-bold text-violet-800">AI Score</div>
                <div className="text-[10px] text-violet-600 mt-1">Qualify & Score</div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
              {/* Decision Node */}
              <div className="flex-shrink-0 w-36 bg-yellow-50 border-2 border-yellow-400 rounded-xl p-3 text-center shadow-sm rotate-0">
                <div className="w-8 h-8 mx-auto rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center mb-2"><GitBranch className="w-4 h-4" /></div>
                <div className="text-xs font-bold text-yellow-800">Decision</div>
                <div className="text-[10px] text-yellow-600 mt-1">Score &gt; 80?</div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
              {/* Action Node */}
              <div className="flex-shrink-0 w-36 bg-green-50 border-2 border-green-300 rounded-xl p-3 text-center shadow-sm">
                <div className="w-8 h-8 mx-auto rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-2"><CheckCircle className="w-4 h-4" /></div>
                <div className="text-xs font-bold text-green-800">Action</div>
                <div className="text-[10px] text-green-600 mt-1">Notify Sales Team</div>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow List */}
        <div className="glass-strong rounded-2xl overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900">All Workflows</h3>
              <p className="text-xs text-slate-500">8 workflows -- 6 active, 1 paused, 1 draft</p>
            </div>
            <button className="btn-primary text-xs">+ New Workflow</button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Workflow</th><th>Nodes</th><th>Status</th><th>Total Runs</th><th>Last Run</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {workflows.map((w) => (
                  <tr key={w.name} className="clickable">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"><Workflow className="w-4 h-4" /></div>
                        <span className="font-semibold text-slate-800">{w.name}</span>
                      </div>
                    </td>
                    <td><span className="font-mono text-slate-600">{w.nodes}</span></td>
                    <td><span className={`badge ${w.statusBadge}`}>{w.status}</span></td>
                    <td className="font-bold text-slate-800">{w.runs.toLocaleString()}</td>
                    <td className="text-slate-500">{w.lastRun}</td>
                    <td>
                      <div className="flex gap-1">
                        <button className="p-1.5 hover:bg-blue-50 rounded-lg"><Play className="w-4 h-4 text-blue-600" /></button>
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
   RULES PANEL
   ============================================================ */
function RulesPanel() {
  return (
    <div className="fos-panel active" id="panel-rules">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-indigo-100 text-indigo-600"><ShieldCheck className="w-5 h-5" /></div>
          <div><h2>Automation Rules</h2><p>Define conditions and actions for automated workflows</p></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard value="12" label="Total Rules" color="text-blue-600" />
          <StatCard value="10" label="Active Rules" color="text-green-600" />
          <StatCard value="4,120" label="Total Triggers" color="text-indigo-600" />
          <StatCard value="98.1%" label="Avg Success" color="text-violet-600" />
        </div>

        {/* Rules Table */}
        <div className="glass-strong rounded-2xl overflow-hidden mb-6">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Automation Rules</h3>
            <button className="btn-primary text-xs">+ New Rule</button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Rule ID</th><th>Name</th><th>Trigger</th><th>Action</th><th>Status</th><th>Runs</th><th>Success</th></tr>
              </thead>
              <tbody>
                {automationRules.map((r) => (
                  <tr key={r.id} className="clickable">
                    <td className="font-mono text-blue-600 font-semibold">{r.id}</td>
                    <td className="font-semibold text-slate-800">{r.name}</td>
                    <td className="text-slate-500 text-xs">{r.trigger}</td>
                    <td className="text-slate-500 text-xs">{r.action}</td>
                    <td><span className={`badge ${r.statusBadge}`}>{r.status}</span></td>
                    <td className="font-bold text-slate-800">{r.runs.toLocaleString()}</td>
                    <td><span className="font-bold text-green-600">{r.success}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rules Performance Chart */}
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-indigo-600" /> Rules Performance</h3>
          <div style={{ height: 260 }}>
            <Line data={rulesPerformanceData} options={lineDefaults()} />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   TRIGGERS PANEL
   ============================================================ */
function TriggersPanel() {
  return (
    <div className="fos-panel active" id="panel-triggers">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-violet-100 text-violet-600"><Zap className="w-5 h-5" /></div>
          <div><h2>Event Triggers</h2><p>Configure events that initiate agent workflows</p></div>
        </div>

        {/* Trigger Types Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {triggerEvents.map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.name} className="glass-strong rounded-2xl p-4 card-hover cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${t.bg} ${t.text} flex items-center justify-center`}><Icon className="w-5 h-5" /></div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">{t.name}</div>
                    <div className="text-[10px] text-slate-500">{t.type}</div>
                  </div>
                </div>
                <div className="text-xl font-extrabold text-slate-900">{t.count.toLocaleString()}</div>
                <div className="text-xs text-blue-600 font-semibold mt-1">{t.freq}</div>
              </div>
            );
          })}
        </div>

        {/* Trigger Volume Chart */}
        <div className="glass-strong rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-violet-600" /> Trigger Volume (This Week)</h3>
          <div style={{ height: 280 }}>
            <Bar
              data={triggerVolumeData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { boxWidth: 8, font: { size: 10 } } } },
                scales: {
                  y: { grid: { color: '#f1f5f9' }, stacked: true },
                  x: { grid: { display: false }, stacked: true },
                },
              }}
            />
          </div>
        </div>

        {/* Trigger Type Summary */}
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Trigger Types Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: 'Data Events (Create/Update)', pct: 62, count: '13,160', color: 'from-blue-400 to-indigo-500' },
              { label: 'Scheduled / Timer', pct: 8, count: '1,440', color: 'from-violet-400 to-purple-500' },
              { label: 'Webhooks / External', pct: 15, count: '2,180', color: 'from-sky-400 to-cyan-500' },
              { label: 'User Actions', pct: 8, count: '956', color: 'from-orange-400 to-red-400' },
              { label: 'API Calls', pct: 7, count: '3,640', color: 'from-green-400 to-emerald-500' },
            ].map((t) => (
              <div key={t.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">{t.label}</span>
                  <span className="text-slate-500">{t.count} ({t.pct}%)</span>
                </div>
                <div className="progress"><div className={`progress-fill bg-gradient-to-r ${t.color}`} style={{ width: `${t.pct}%` }}></div></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   APPROVALS PANEL
   ============================================================ */
function ApprovalsPanel() {
  return (
    <div className="fos-panel active" id="panel-approvals">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-sky-100 text-sky-600"><CheckSquare className="w-5 h-5" /></div>
          <div><h2>Approval Flows</h2><p>Manage pending approvals and approval workflows</p></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard value="5" label="Pending" color="text-orange-600" />
          <StatCard value="24" label="Approved (MTD)" color="text-green-600" />
          <StatCard value="2" label="Rejected (MTD)" color="text-red-500" />
          <StatCard value="4.2h" label="Avg. Response" color="text-blue-600" />
        </div>

        {/* Pending Approvals List */}
        <div className="glass-strong rounded-2xl overflow-hidden mb-6">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Pending Approvals</h3>
            <span className="badge badge-orange">5 Awaiting</span>
          </div>
          <div className="divide-y divide-slate-100">
            {pendingApprovals.map((a) => (
              <div key={a.id} className="p-4 flex items-center gap-4 hover:bg-blue-50/30 transition cursor-pointer">
                <div className="avatar avatar-sm">{a.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-slate-900">{a.title}</div>
                  <div className="text-xs text-slate-500">{a.requester} -- {a.type} -- {a.submitted}</div>
                </div>
                <div className="text-right mr-3">
                  <div className="font-bold text-blue-600">{a.amount}</div>
                  <span className={`badge ${a.priBadge} text-[10px]`}>{a.priority}</span>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-bold hover:bg-green-100 transition">Approve</button>
                  <button className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-bold hover:bg-red-100 transition">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Approval Trend + Flow Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-indigo-600" /> Approval Trend</h3>
            <div style={{ height: 240 }}>
              <Line data={approvalTrendData} options={lineDefaults()} />
            </div>
          </div>
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Workflow className="w-4 h-4 text-violet-600" /> Approval Flow</h3>
            <div className="bg-slate-50 rounded-xl p-5">
              <div className="flex flex-col items-center gap-3">
                {[
                  { label: 'Request Submitted', icon: Plus, bg: 'bg-blue-100 text-blue-600' },
                  { label: 'Manager Review', icon: Eye, bg: 'bg-indigo-100 text-indigo-600' },
                  { label: 'Finance Approval', icon: ShieldCheck, bg: 'bg-violet-100 text-violet-600' },
                  { label: 'Final Sign-off', icon: CheckCircle, bg: 'bg-green-100 text-green-600' },
                ].map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.label} className="w-full">
                      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className={`w-9 h-9 rounded-lg ${step.bg} flex items-center justify-center flex-shrink-0`}><Icon className="w-4 h-4" /></div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-slate-800">Step {i + 1}: {step.label}</div>
                        </div>
                        {i < 2 && <span className="badge badge-green text-[10px]">Done</span>}
                        {i === 2 && <span className="badge badge-yellow text-[10px]">In Progress</span>}
                        {i === 3 && <span className="badge badge-blue text-[10px]">Pending</span>}
                      </div>
                      {i < 3 && <div className="w-0.5 h-3 bg-slate-300 mx-auto"></div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   ENGINE PANEL
   ============================================================ */
function EnginePanel() {
  const agents = CORTEX_DATA.agents;

  return (
    <div className="fos-panel active" id="panel-engine">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-orange-100 text-orange-600"><Cpu className="w-5 h-5" /></div>
          <div><h2>Agent Execution Engine</h2><p>Monitor agent performance and execution stats</p></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard value="99.2%" label="Uptime" color="text-green-600" />
          <StatCard value="1.8s" label="Avg. Latency" color="text-blue-600" />
          <StatCard value="14,705" label="Total Runs" color="text-indigo-600" />
          <StatCard value="1.6%" label="Error Rate" color="text-red-500" />
        </div>

        {/* Agent Execution Table */}
        <div className="glass-strong rounded-2xl overflow-hidden mb-6">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Agent Performance</h3>
            <button className="btn-outline text-xs"><RefreshCw className="w-3 h-3" /> Refresh</button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Agent</th><th>Description</th><th>Total Runs</th><th>Success Rate</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {agents.map((a) => (
                  <tr key={a.name} className="clickable">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${a.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                          <Bot className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-slate-800">{a.name}</span>
                      </div>
                    </td>
                    <td className="text-slate-500">{a.desc}</td>
                    <td className="font-bold text-slate-800">{a.runs}</td>
                    <td><span className="font-bold text-green-600">{a.success}</span></td>
                    <td><span className={`badge ${a.status === 'Active' ? 'badge-green' : 'badge-yellow'}`}>{a.status}</span></td>
                    <td>
                      <div className="flex gap-1">
                        <button className="p-1.5 hover:bg-blue-50 rounded-lg"><Play className="w-4 h-4 text-blue-600" /></button>
                        {a.status === 'Active'
                          ? <button className="p-1.5 hover:bg-yellow-50 rounded-lg"><Pause className="w-4 h-4 text-yellow-600" /></button>
                          : <button className="p-1.5 hover:bg-green-50 rounded-lg"><Play className="w-4 h-4 text-green-600" /></button>
                        }
                        <button className="p-1.5 hover:bg-blue-50 rounded-lg"><MoreHorizontal className="w-4 h-4 text-slate-400" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Runs + Error Rate */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="glass-strong rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Recent Runs</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr><th>Run ID</th><th>Agent</th><th>Status</th><th>Duration</th><th>Time</th></tr>
                </thead>
                <tbody>
                  {recentRuns.map((r) => (
                    <tr key={r.id} className="clickable">
                      <td className="font-mono text-blue-600 text-xs">{r.id}</td>
                      <td className="font-semibold text-sm">{r.agent}</td>
                      <td><span className={`badge ${r.statusBadge} text-[10px]`}>{r.status}</span></td>
                      <td className="font-mono text-slate-600 text-xs">{r.duration}</td>
                      <td className="text-slate-500 text-xs">{r.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-500" /> Error Rate Trend</h3>
            <div style={{ height: 260 }}>
              <Line
                data={errorRateData}
                options={{
                  ...lineDefaults((v) => v + '%'),
                  scales: {
                    ...lineDefaults((v) => v + '%').scales,
                    y: { ...lineDefaults((v) => v + '%').scales.y, min: 0, max: 8 },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   LOGS PANEL
   ============================================================ */
function LogsPanel() {
  const [search, setSearch] = useState('');
  const filtered = logEntries.filter((l) =>
    l.agent.toLowerCase().includes(search.toLowerCase()) ||
    l.message.toLowerCase().includes(search.toLowerCase()) ||
    l.runId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fos-panel active" id="panel-logs">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-cyan-100 text-cyan-600"><ScrollText className="w-5 h-5" /></div>
          <div><h2>Run Logs & Monitoring</h2><p>Timestamped execution history for all agents</p></div>
        </div>

        <div className="glass-strong rounded-2xl overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900">Execution Logs</h3>
              <p className="text-xs text-slate-500">14,705 total entries -- showing recent</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  placeholder="Search logs..."
                  className="pl-9 pr-3 py-2 text-sm bg-blue-50/50 border border-blue-100 rounded-lg outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="btn-outline text-xs"><Download className="w-3 h-3" /> Export</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Timestamp</th><th>Run ID</th><th>Agent</th><th>Status</th><th>Duration</th><th>Message</th></tr>
              </thead>
              <tbody>
                {filtered.map((l, i) => (
                  <tr key={i} className="clickable">
                    <td className="font-mono text-xs text-slate-500 whitespace-nowrap">{l.time}</td>
                    <td className="font-mono text-blue-600 text-xs">{l.runId}</td>
                    <td className="font-semibold text-sm text-slate-800">{l.agent}</td>
                    <td><span className={`badge ${l.statusBadge} text-[10px]`}>{l.status}</span></td>
                    <td className="font-mono text-slate-600 text-xs">{l.duration}</td>
                    <td className="text-xs text-slate-600 max-w-xs truncate">{l.message}</td>
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

export default Agents;
