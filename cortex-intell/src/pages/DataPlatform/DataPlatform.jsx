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
  Database, HardDrive, GitBranch, Plug, ShieldCheck, Box, Layers,
  ChevronRight, Download, Filter, Plus, Sparkles, Activity, TrendingUp,
  CheckCircle, AlertTriangle, Clock, Search, Eye, MoreHorizontal,
  RefreshCw, Zap, FileText, BarChart3, Settings, Lock, Users,
  ArrowUpDown, Server, CircleDot, Globe, Key, Webhook, Workflow,
  ListChecks, Table, Link2, Gauge,
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
   CHART DATA
   ============================================================ */
const dataVolumeData = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    { label: 'Ingested (TB)', data: [1.2, 1.4, 1.6, 1.8, 2.1, 2.4], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.12)', tension: 0.4, fill: true },
    { label: 'Processed (TB)', data: [1.0, 1.2, 1.4, 1.5, 1.8, 2.1], borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,.08)', tension: 0.4, fill: true },
  ],
};

const storageDistData = {
  labels: ['Bronze (Raw)', 'Silver (Cleaned)', 'Gold (Curated)', 'Archive'],
  datasets: [{ data: [35, 28, 22, 15], backgroundColor: ['#f59e0b', '#6366f1', '#10b981', '#94a3b8'], borderWidth: 0 }],
};

const pipelineHealthData = {
  labels: ['Azure Synapse', 'Salesforce', 'Stripe', 'GitHub', 'Gmail'],
  datasets: [
    { label: 'Success %', data: [99.8, 99.5, 99.9, 98.2, 96.4], backgroundColor: ['#10b981', '#10b981', '#10b981', '#f59e0b', '#ef4444'], borderRadius: 8 },
  ],
};

const dataQualityData = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    { label: 'Quality Score %', data: [97.8, 98.1, 98.5, 98.9, 99.0, 99.2], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.12)', tension: 0.4, fill: true, pointRadius: 4 },
    { label: 'Target', data: [99, 99, 99, 99, 99, 99], borderColor: '#94a3b8', borderDash: [5, 5], backgroundColor: 'transparent', tension: 0, pointRadius: 0 },
  ],
};

const storageGrowthData = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    { label: 'Total Storage (TB)', data: [1.6, 1.8, 1.9, 2.0, 2.2, 2.4], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.12)', tension: 0.4, fill: true },
  ],
};

const domainDistData = {
  labels: ['Finance', 'CRM', 'HR', 'Operations', 'Analytics', 'Other'],
  datasets: [{ data: [32, 24, 16, 14, 9, 5], backgroundColor: ['#3b82f6', '#6366f1', '#8b5cf6', '#22d3ee', '#f59e0b', '#94a3b8'], borderWidth: 0 }],
};

const throughputData = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    { label: 'Records/min (K)', data: [42, 48, 55, 62, 68, 74], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.12)', tension: 0.4, fill: true },
    { label: 'Errors/min', data: [12, 8, 6, 4, 3, 2], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,.08)', tension: 0.4, fill: true },
  ],
};

const qualityTrendData = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    { label: 'Completeness', data: [96.2, 96.8, 97.4, 98.0, 98.5, 99.1], borderColor: '#3b82f6', tension: 0.4, pointRadius: 3 },
    { label: 'Accuracy', data: [97.0, 97.5, 98.0, 98.4, 98.8, 99.2], borderColor: '#10b981', tension: 0.4, pointRadius: 3 },
    { label: 'Consistency', data: [95.8, 96.2, 96.9, 97.5, 98.1, 98.8], borderColor: '#8b5cf6', tension: 0.4, pointRadius: 3 },
    { label: 'Timeliness', data: [98.0, 98.2, 98.5, 98.7, 99.0, 99.4], borderColor: '#f59e0b', tension: 0.4, pointRadius: 3 },
  ],
};

/* ============================================================
   SUB-MODULE CARDS
   ============================================================ */
const subModuleCards = [
  { tab: 'storage', icon: HardDrive, label: 'Storage', sub: '2.4TB Lakehouse', bg: 'bg-blue-100', text: 'text-blue-600' },
  { tab: 'pipelines', icon: GitBranch, label: 'Pipelines', sub: '48 Active', bg: 'bg-indigo-100', text: 'text-indigo-600' },
  { tab: 'integration', icon: Plug, label: 'Integration', sub: '24 Connectors', bg: 'bg-violet-100', text: 'text-violet-600' },
  { tab: 'governance', icon: ShieldCheck, label: 'Governance', sub: '12 Policies', bg: 'bg-sky-100', text: 'text-sky-600' },
  { tab: 'modelling', icon: Box, label: 'Modelling', sub: '36 Models', bg: 'bg-orange-100', text: 'text-orange-600' },
  { tab: 'mdm', icon: Layers, label: 'MDM', sub: '4 Domains', bg: 'bg-cyan-100', text: 'text-cyan-600' },
  { tab: 'quality', icon: CheckCircle, label: 'Quality', sub: '99.2% Score', bg: 'bg-green-100', text: 'text-green-600' },
];

/* ============================================================
   STATIC DATA
   ============================================================ */
const lakehouseLayers = [
  { name: 'Bronze (Raw)', size: '840 GB', records: '48M', color: 'from-amber-500 to-yellow-500', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', desc: 'Raw ingested data from all sources. No transformations applied.', icon: Database },
  { name: 'Silver (Cleaned)', size: '672 GB', records: '42M', color: 'from-slate-400 to-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', desc: 'Deduped, validated, and schema-enforced data.', icon: RefreshCw },
  { name: 'Gold (Curated)', size: '528 GB', records: '38M', color: 'from-yellow-400 to-amber-400', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', desc: 'Business-ready, enriched datasets for analytics and AI.', icon: Sparkles },
  { name: 'Archive', size: '360 GB', records: '120M', color: 'from-slate-300 to-slate-400', bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600', desc: 'Cold storage for compliance and historical data.', icon: HardDrive },
];

const governancePolicies = [
  { name: 'PII Data Classification', status: 'Enforced', scope: 'All Modules', lastAudit: '2 days ago', risk: 'Low' },
  { name: 'Data Retention Policy', status: 'Enforced', scope: 'Finance, HR', lastAudit: '1 week ago', risk: 'Low' },
  { name: 'GDPR Compliance', status: 'Enforced', scope: 'CRM, HR', lastAudit: '3 days ago', risk: 'Low' },
  { name: 'Access Control Matrix', status: 'Active', scope: 'All Modules', lastAudit: '5 days ago', risk: 'Medium' },
  { name: 'Data Masking Rules', status: 'Enforced', scope: 'Analytics', lastAudit: '1 day ago', risk: 'Low' },
  { name: 'Cross-Border Transfer', status: 'Review', scope: 'Global Ops', lastAudit: '2 weeks ago', risk: 'High' },
];

const dataModels = [
  { name: 'Customer 360', entities: 24, fields: 186, domain: 'CRM', status: 'Production', lastUpdated: '1 day ago' },
  { name: 'Financial Ledger', entities: 18, fields: 142, domain: 'Finance', status: 'Production', lastUpdated: '2 days ago' },
  { name: 'Employee Hub', entities: 12, fields: 98, domain: 'HR', status: 'Production', lastUpdated: '3 days ago' },
  { name: 'Product Catalog', entities: 8, fields: 64, domain: 'Operations', status: 'Staging', lastUpdated: '1 week ago' },
  { name: 'Marketing Funnel', entities: 14, fields: 108, domain: 'Growth', status: 'Production', lastUpdated: '5 days ago' },
  { name: 'Project Tracker', entities: 10, fields: 76, domain: 'Projects', status: 'Development', lastUpdated: '2 days ago' },
];

const validationRules = [
  { rule: 'Email Format Validation', scope: 'CRM Contacts', passRate: '99.8%', status: 'Active', lastRun: '5 min ago' },
  { rule: 'Duplicate Detection', scope: 'All Entities', passRate: '98.4%', status: 'Active', lastRun: '10 min ago' },
  { rule: 'Required Fields Check', scope: 'Finance Invoices', passRate: '99.9%', status: 'Active', lastRun: '2 min ago' },
  { rule: 'Range Validation', scope: 'HR Payroll', passRate: '99.6%', status: 'Active', lastRun: '15 min ago' },
  { rule: 'Referential Integrity', scope: 'Cross-Module', passRate: '97.2%', status: 'Warning', lastRun: '8 min ago' },
  { rule: 'Schema Conformance', scope: 'Data Lake', passRate: '99.1%', status: 'Active', lastRun: '1 min ago' },
];

const connectorIcons = {
  Slack: Zap, Salesforce: Globe, Gmail: FileText, Stripe: BarChart3,
  HubSpot: Zap, Zoom: Globe, Notion: FileText, GitHub: Settings,
  Jira: ListChecks, Intercom: Globe, Linear: AlertTriangle, QuickBooks: BarChart3,
};

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
function DataPlatform() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'dashboard';
  const [activeTab, setActiveTab] = useState(initialTab);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  useEffect(() => {
    const urlTab = searchParams.get('tab');
    if (urlTab && urlTab !== activeTab) setActiveTab(urlTab);
  }, [searchParams]);

  return (
    <div className="animate-fade-in-up">
      {/* PAGE HEADER */}
      <section className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span>Ecosystem</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-blue-600 font-semibold">Cortex Intell Data Platform</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Cortex Intell Data Platform</h1>
          <p className="text-slate-500">Store. Integrate. Govern. Scale.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline"><Download className="w-4 h-4" /> Export</button>
          <button className="btn-outline"><Filter className="w-4 h-4" /> Filter</button>
          <button className="btn-primary"><Plus className="w-4 h-4" /> New Pipeline</button>
        </div>
      </section>

      {/* KPI STRIP */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard label="TOTAL STORAGE" value="2.4TB" delta="+320GB this month" icon={<HardDrive className="w-5 h-5" />} bg="bg-blue-100" text="text-blue-600" />
        <KpiCard label="ACTIVE PIPELINES" value="48" delta="+6 new" icon={<GitBranch className="w-5 h-5" />} bg="bg-indigo-100" text="text-indigo-600" />
        <KpiCard label="DATA QUALITY" value="99.2%" delta="+0.4% this month" icon={<CheckCircle className="w-5 h-5" />} bg="bg-green-100" text="text-green-600" />
        <KpiCard label="CONNECTORS" value="24" delta="12 active apps" icon={<Plug className="w-5 h-5" />} bg="bg-violet-100" text="text-violet-600" />
      </section>

      {/* AI DATA COPILOT */}
      <section className="mb-6">
        <div className="glass-blue rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute w-48 h-48 bg-white rounded-full blur-3xl -top-20 -right-20 animate-blob"></div>
          </div>
          <div className="relative z-10 w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="relative z-10 flex-1">
            <div className="font-bold text-white">AI Data Copilot</div>
            <div className="text-white/90 text-sm">Gmail connector sync latency increased 18min. Recommend switching to streaming mode. 3 pipelines processed 1.2M records in last hour with 99.8% accuracy.</div>
          </div>
          <button className="relative z-10 bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold text-sm hover:scale-105 transition">Fix Now</button>
        </div>
      </section>

      {/* TAB PANELS */}
      {activeTab === 'dashboard' && <DashboardPanel switchTab={switchTab} />}
      {activeTab === 'storage' && <StoragePanel />}
      {activeTab === 'pipelines' && <PipelinesPanel />}
      {activeTab === 'integration' && <IntegrationPanel />}
      {activeTab === 'governance' && <GovernancePanel />}
      {activeTab === 'modelling' && <ModellingPanel />}
      {activeTab === 'mdm' && <MDMPanel />}
      {activeTab === 'quality' && <QualityPanel />}
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
      <section className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6 mt-4">
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

      {/* Row 1: Data Volume + Storage Distribution */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-600" /> Data Volume Trend</h3>
            <span className="badge badge-green">+320GB</span>
          </div>
          <div style={{ height: 240 }}>
            <Line data={dataVolumeData} options={lineDefaults((v) => v + 'TB')} />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><HardDrive className="w-4 h-4 text-indigo-600" /> Storage Distribution</h3>
            <span className="text-xs text-slate-500">2.4TB Total</span>
          </div>
          <div style={{ height: 240 }}>
            <Doughnut data={storageDistData} options={doughnutDefaults} />
          </div>
        </div>
      </section>

      {/* Row 2: Pipeline Health + Data Quality */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><GitBranch className="w-4 h-4 text-violet-600" /> Pipeline Health</h3>
            <span className="badge badge-green">48 Active</span>
          </div>
          <div style={{ height: 240 }}>
            <Bar
              data={pipelineHealthData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { grid: { color: '#f1f5f9' }, min: 90, max: 100, ticks: { callback: (v) => v + '%' } }, x: { grid: { display: false } } },
              }}
            />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /> Data Quality Trend</h3>
            <span className="badge badge-green">99.2%</span>
          </div>
          <div style={{ height: 240 }}>
            <Line
              data={dataQualityData}
              options={{
                ...lineDefaults((v) => v + '%'),
                scales: {
                  ...lineDefaults((v) => v + '%').scales,
                  y: { ...lineDefaults((v) => v + '%').scales.y, min: 96, max: 100 },
                },
              }}
            />
          </div>
        </div>
      </section>

      {/* Row 3: Active Pipelines + Recent Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><GitBranch className="w-4 h-4 text-blue-600" /> Active Pipelines</h3>
            <button className="btn-outline text-xs" onClick={() => switchTab('pipelines')}>View All</button>
          </div>
          <div className="space-y-3">
            {CORTEX_DATA.pipelines.map((p) => (
              <div key={p.name} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-blue-50/40 transition cursor-pointer">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${p.health === 'Healthy' ? 'bg-green-100 text-green-600' : p.health === 'Warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
                  <GitBranch className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-slate-900">{p.name}</div>
                  <div className="text-xs text-slate-500">{p.records} records -- Last sync: {p.lastSync}</div>
                </div>
                <div className="text-right">
                  <span className={`badge ${p.health === 'Healthy' ? 'badge-green' : p.health === 'Warning' ? 'badge-yellow' : 'badge-blue'}`}>{p.health}</span>
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
            <ActivityRow icon={<RefreshCw className="w-4 h-4" />} bg="bg-green-100 text-green-600" title="Pipeline sync completed -- Salesforce" sub="48K records processed -- 2 min ago" />
            <ActivityRow icon={<AlertTriangle className="w-4 h-4" />} bg="bg-yellow-100 text-yellow-600" title="Gmail connector latency warning" sub="Sync delayed 18 min -- 5 min ago" />
            <ActivityRow icon={<CheckCircle className="w-4 h-4" />} bg="bg-blue-100 text-blue-600" title="Data quality scan completed" sub="99.2% score -- 15 min ago" />
            <ActivityRow icon={<Database className="w-4 h-4" />} bg="bg-violet-100 text-violet-600" title="Bronze layer ingestion -- Stripe" sub="3.4K new records -- 20 min ago" />
            <ActivityRow icon={<ShieldCheck className="w-4 h-4" />} bg="bg-indigo-100 text-indigo-600" title="Governance audit passed" sub="GDPR compliance verified -- 1h ago" />
            <ActivityRow icon={<Sparkles className="w-4 h-4" />} bg="bg-orange-100 text-orange-600" title="AI anomaly detected in Finance data" sub="Duplicate transaction flagged -- 2h ago" />
          </div>
        </div>
      </section>

      {/* AI Data Platform Insights */}
      <section className="glass-blue rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden mb-6">
        <div className="absolute inset-0 opacity-20"><div className="absolute w-48 h-48 bg-white rounded-full blur-3xl -top-20 -right-20 animate-blob"></div></div>
        <div className="relative z-10 w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="relative z-10 flex-1">
          <div className="font-bold text-white">AI Data Platform Insights</div>
          <div className="text-white/90 text-sm">Storage efficiency improved 12% after Gold layer optimization. 3 pipelines can be consolidated to reduce latency by 40%. Gmail connector needs attention -- recommend migration to API v2.</div>
        </div>
        <button className="relative z-10 bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold text-sm hover:scale-105 transition">View All Insights</button>
      </section>
    </div>
  );
}

/* ============================================================
   STORAGE PANEL
   ============================================================ */
function StoragePanel() {
  return (
    <div className="fos-panel active">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-blue-100 text-blue-600"><HardDrive className="w-5 h-5" /></div>
          <div><h2>Data Storage (Lakehouse)</h2><p>Bronze / Silver / Gold / Archive layers</p></div>
        </div>

        {/* Lakehouse Layers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {lakehouseLayers.map((layer) => {
            const Icon = layer.icon;
            return (
              <div key={layer.name} className={`rounded-2xl p-5 ${layer.bg} border ${layer.border} card-hover cursor-pointer`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${layer.color} text-white flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`font-bold ${layer.text}`}>{layer.name}</div>
                    <div className="text-xs text-slate-500">{layer.size}</div>
                  </div>
                </div>
                <div className="text-xs text-slate-600 mb-3">{layer.desc}</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">{layer.records} records</span>
                  <span className="badge badge-green text-[10px]">Active</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Storage Growth + Domain Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-600" /> Storage Growth</h3>
            <div style={{ height: 240 }}>
              <Line data={storageGrowthData} options={lineDefaults((v) => v + 'TB')} />
            </div>
          </div>
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Database className="w-4 h-4 text-indigo-600" /> Domain Distribution</h3>
            <div style={{ height: 240 }}>
              <Doughnut data={domainDistData} options={doughnutDefaults} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   PIPELINES PANEL
   ============================================================ */
function PipelinesPanel() {
  const [search, setSearch] = useState('');
  const pipelines = CORTEX_DATA.pipelines.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fos-panel active">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-indigo-100 text-indigo-600"><GitBranch className="w-5 h-5" /></div>
          <div><h2>Data Pipelines</h2><p>ETL, real-time sync, and data flow management</p></div>
        </div>

        {/* Pipeline Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard value="48" label="Total Pipelines" color="text-blue-600" />
          <StatCard value="44" label="Healthy" color="text-green-600" />
          <StatCard value="3" label="Warning" color="text-yellow-600" />
          <StatCard value="1" label="Error" color="text-red-500" />
        </div>

        {/* Pipeline Table */}
        <div className="glass-strong rounded-2xl overflow-hidden mb-6">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900">Pipeline Directory</h3>
              <p className="text-xs text-slate-500">48 pipelines -- 44 healthy</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input placeholder="Search pipelines..." className="pl-9 pr-3 py-2 text-sm bg-blue-50/50 border border-blue-100 rounded-lg outline-none" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <button className="btn-primary text-xs">+ New Pipeline</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Pipeline Name</th><th>Source</th><th>Destination</th><th>Records</th><th>Status</th><th>Schedule</th><th>Last Sync</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {pipelines.map((p) => (
                  <tr key={p.name} className="clickable">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${p.health === 'Healthy' ? 'bg-green-100 text-green-600' : p.health === 'Warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
                          <GitBranch className="w-4 h-4" />
                        </div>
                        <div className="font-semibold text-slate-800">{p.name}</div>
                      </div>
                    </td>
                    <td className="text-slate-600">{p.source}</td>
                    <td className="text-slate-600">{p.dest}</td>
                    <td className="font-bold text-slate-800">{p.records}</td>
                    <td><span className={`badge ${p.health === 'Healthy' ? 'badge-green' : p.health === 'Warning' ? 'badge-yellow' : 'badge-blue'}`}>{p.health}</span></td>
                    <td className="text-slate-500">Every 5 min</td>
                    <td className="text-slate-500">{p.lastSync}</td>
                    <td>
                      <div className="flex gap-1">
                        <button className="p-1.5 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4 text-blue-600" /></button>
                        <button className="p-1.5 hover:bg-blue-50 rounded-lg"><RefreshCw className="w-4 h-4 text-slate-400" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Throughput Chart */}
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-600" /> Pipeline Throughput</h3>
          <div style={{ height: 240 }}>
            <Line data={throughputData} options={lineDefaults((v) => v + 'K')} />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   INTEGRATION PANEL
   ============================================================ */
function IntegrationPanel() {
  const apps = CORTEX_DATA.apps;
  return (
    <div className="fos-panel active">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-violet-100 text-violet-600"><Plug className="w-5 h-5" /></div>
          <div><h2>Data Integration</h2><p>Connectors, APIs, and external app sync</p></div>
        </div>

        {/* Connector Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {apps.map((app) => {
            const statusBadge = app.status === 'Connected' ? 'badge-green' : app.status === 'Syncing' ? 'badge-blue' : 'badge-red';
            return (
              <div key={app.name} className="glass-strong rounded-2xl p-5 card-hover cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-${app.color}-100 text-${app.color}-600 flex items-center justify-center`}>
                    <Plug className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{app.name}</div>
                    <div className="text-xs text-slate-500">Connector</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`badge ${statusBadge}`}>{app.status}</span>
                  <button className="p-1.5 hover:bg-blue-50 rounded-lg"><Settings className="w-4 h-4 text-slate-400" /></button>
                </div>
              </div>
            );
          })}
        </div>

        {/* API Status */}
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Globe className="w-4 h-4 text-blue-600" /> API Gateway Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="p-3 bg-green-50 rounded-xl text-center">
              <div className="text-2xl font-extrabold text-green-600">99.9%</div>
              <div className="text-xs text-slate-600 font-semibold">Uptime</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl text-center">
              <div className="text-2xl font-extrabold text-blue-600">142ms</div>
              <div className="text-xs text-slate-600 font-semibold">Avg Latency</div>
            </div>
            <div className="p-3 bg-violet-50 rounded-xl text-center">
              <div className="text-2xl font-extrabold text-violet-600">1.2M</div>
              <div className="text-xs text-slate-600 font-semibold">Requests/Day</div>
            </div>
            <div className="p-3 bg-orange-50 rounded-xl text-center">
              <div className="text-2xl font-extrabold text-orange-600">0.02%</div>
              <div className="text-xs text-slate-600 font-semibold">Error Rate</div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div className="flex-1 font-semibold text-sm">REST API v3</div>
              <span className="badge badge-green">Operational</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div className="flex-1 font-semibold text-sm">GraphQL Endpoint</div>
              <span className="badge badge-green">Operational</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div className="flex-1 font-semibold text-sm">WebSocket Stream</div>
              <span className="badge badge-green">Operational</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <div className="flex-1 font-semibold text-sm">Webhook Delivery</div>
              <span className="badge badge-yellow">Degraded</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   GOVERNANCE PANEL
   ============================================================ */
function GovernancePanel() {
  return (
    <div className="fos-panel active">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-sky-100 text-sky-600"><ShieldCheck className="w-5 h-5" /></div>
          <div><h2>Data Governance</h2><p>Policies, lineage tracking, and access controls</p></div>
        </div>

        {/* Governance Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard value="12" label="Active Policies" color="text-blue-600" />
          <StatCard value="100%" label="GDPR Compliance" color="text-green-600" />
          <StatCard value="48" label="Data Lineage Paths" color="text-violet-600" />
          <StatCard value="6" label="Access Roles" color="text-orange-600" />
        </div>

        {/* Policies Table */}
        <div className="glass-strong rounded-2xl overflow-hidden mb-6">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Governance Policies</h3>
            <button className="btn-primary text-xs">+ New Policy</button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Policy Name</th><th>Status</th><th>Scope</th><th>Last Audit</th><th>Risk Level</th></tr></thead>
              <tbody>
                {governancePolicies.map((p) => (
                  <tr key={p.name} className="clickable">
                    <td className="font-semibold">{p.name}</td>
                    <td><span className={`badge ${p.status === 'Enforced' ? 'badge-green' : p.status === 'Active' ? 'badge-blue' : 'badge-yellow'}`}>{p.status}</span></td>
                    <td className="text-slate-500">{p.scope}</td>
                    <td className="text-slate-500">{p.lastAudit}</td>
                    <td><span className={`badge ${p.risk === 'Low' ? 'badge-green' : p.risk === 'Medium' ? 'badge-yellow' : 'badge-red'}`}>{p.risk}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lineage & Access Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><ArrowUpDown className="w-4 h-4 text-blue-600" /> Data Lineage Tracking</h3>
            <div className="space-y-3">
              <LineageRow from="Salesforce" to="CRM Bronze" then="CRM Gold" status="Active" />
              <LineageRow from="Stripe" to="Finance Bronze" then="Finance Gold" status="Active" />
              <LineageRow from="Gmail" to="CRM Bronze" then="Analytics" status="Warning" />
              <LineageRow from="Azure Synapse" to="Finance Bronze" then="Reporting" status="Active" />
              <LineageRow from="GitHub" to="Projects Bronze" then="Dashboards" status="Syncing" />
            </div>
          </div>
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Lock className="w-4 h-4 text-indigo-600" /> Access Controls</h3>
            <div className="space-y-3">
              <AccessRow role="Admin" users={3} access="Full Access" color="text-red-600" bg="bg-red-100" />
              <AccessRow role="Data Engineer" users={8} access="Read/Write" color="text-blue-600" bg="bg-blue-100" />
              <AccessRow role="Analyst" users={12} access="Read Only" color="text-green-600" bg="bg-green-100" />
              <AccessRow role="Viewer" users={24} access="Dashboard Only" color="text-slate-600" bg="bg-slate-100" />
              <AccessRow role="API Service" users={6} access="Scoped API" color="text-violet-600" bg="bg-violet-100" />
              <AccessRow role="Auditor" users={2} access="Audit Read" color="text-orange-600" bg="bg-orange-100" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   MODELLING PANEL
   ============================================================ */
function ModellingPanel() {
  return (
    <div className="fos-panel active">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-orange-100 text-orange-600"><Box className="w-5 h-5" /></div>
          <div><h2>Data Modelling</h2><p>Entity models, schemas, and relationship definitions</p></div>
        </div>

        {/* Schema Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard value="36" label="Data Models" color="text-blue-600" />
          <StatCard value="86" label="Total Entities" color="text-indigo-600" />
          <StatCard value="674" label="Total Fields" color="text-violet-600" />
          <StatCard value="6" label="Domains" color="text-green-600" />
        </div>

        {/* Models Table */}
        <div className="glass-strong rounded-2xl overflow-hidden mb-6">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Data Models</h3>
            <button className="btn-primary text-xs">+ New Model</button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Model Name</th><th>Entities</th><th>Fields</th><th>Domain</th><th>Status</th><th>Last Updated</th><th>Actions</th></tr></thead>
              <tbody>
                {dataModels.map((m) => (
                  <tr key={m.name} className="clickable">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"><Table className="w-4 h-4" /></div>
                        <div className="font-semibold text-slate-800">{m.name}</div>
                      </div>
                    </td>
                    <td className="font-bold text-slate-800">{m.entities}</td>
                    <td className="text-slate-600">{m.fields}</td>
                    <td><span className="badge badge-blue">{m.domain}</span></td>
                    <td><span className={`badge ${m.status === 'Production' ? 'badge-green' : m.status === 'Staging' ? 'badge-yellow' : 'badge-blue'}`}>{m.status}</span></td>
                    <td className="text-slate-500">{m.lastUpdated}</td>
                    <td>
                      <div className="flex gap-1">
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

        {/* Entity Relationships */}
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Link2 className="w-4 h-4 text-violet-600" /> Entity Relationships</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
              <div className="font-bold text-blue-700 mb-1">Customer 360 Model</div>
              <div className="text-xs text-slate-600 space-y-1">
                <div>Customer --&gt; Contacts (1:N)</div>
                <div>Customer --&gt; Deals (1:N)</div>
                <div>Customer --&gt; Cases (1:N)</div>
                <div>Customer --&gt; Invoices (1:N)</div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
              <div className="font-bold text-indigo-700 mb-1">Financial Ledger Model</div>
              <div className="text-xs text-slate-600 space-y-1">
                <div>Account --&gt; Journal Entries (1:N)</div>
                <div>Invoice --&gt; Line Items (1:N)</div>
                <div>Vendor --&gt; Purchase Orders (1:N)</div>
                <div>Budget --&gt; Departments (1:N)</div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-violet-50 border border-violet-100">
              <div className="font-bold text-violet-700 mb-1">Employee Hub Model</div>
              <div className="text-xs text-slate-600 space-y-1">
                <div>Employee --&gt; Department (N:1)</div>
                <div>Employee --&gt; Payroll (1:N)</div>
                <div>Employee --&gt; Reviews (1:N)</div>
                <div>Employee --&gt; Attendance (1:N)</div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-green-50 border border-green-100">
              <div className="font-bold text-green-700 mb-1">Marketing Funnel Model</div>
              <div className="text-xs text-slate-600 space-y-1">
                <div>Campaign --&gt; Channels (1:N)</div>
                <div>Campaign --&gt; Leads (1:N)</div>
                <div>Lead --&gt; Activities (1:N)</div>
                <div>Lead --&gt; Conversions (1:1)</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   MDM PANEL
   ============================================================ */
function MDMPanel() {
  return (
    <div className="fos-panel active">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-cyan-100 text-cyan-600"><Layers className="w-5 h-5" /></div>
          <div><h2>Master Data Management</h2><p>Golden records, entity resolution, and master data governance</p></div>
        </div>

        {/* MDM Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard value="12,480" label="Customer Records" color="text-blue-600" />
          <StatCard value="3,240" label="Product Records" color="text-indigo-600" />
          <StatCard value="1,860" label="Vendor Records" color="text-violet-600" />
          <StatCard value="98.6%" label="Golden Record Rate" color="text-green-600" />
        </div>

        {/* Master Data Domains */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="glass-strong rounded-2xl p-5 card-hover cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center"><Users className="w-5 h-5" /></div>
              <div><div className="font-bold text-slate-900">Customer</div><div className="text-xs text-slate-500">Master Domain</div></div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">12,480</div>
            <div className="text-xs text-green-600 font-semibold mt-1">98.8% golden records</div>
            <div className="progress mt-3" style={{ height: 4 }}><div className="progress-fill" style={{ width: '98.8%' }}></div></div>
          </div>
          <div className="glass-strong rounded-2xl p-5 card-hover cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center"><Box className="w-5 h-5" /></div>
              <div><div className="font-bold text-slate-900">Product</div><div className="text-xs text-slate-500">Master Domain</div></div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">3,240</div>
            <div className="text-xs text-green-600 font-semibold mt-1">99.2% golden records</div>
            <div className="progress mt-3" style={{ height: 4 }}><div className="progress-fill" style={{ width: '99.2%' }}></div></div>
          </div>
          <div className="glass-strong rounded-2xl p-5 card-hover cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center"><Globe className="w-5 h-5" /></div>
              <div><div className="font-bold text-slate-900">Vendor</div><div className="text-xs text-slate-500">Master Domain</div></div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">1,860</div>
            <div className="text-xs text-green-600 font-semibold mt-1">97.4% golden records</div>
            <div className="progress mt-3" style={{ height: 4 }}><div className="progress-fill" style={{ width: '97.4%' }}></div></div>
          </div>
          <div className="glass-strong rounded-2xl p-5 card-hover cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center"><Server className="w-5 h-5" /></div>
              <div><div className="font-bold text-slate-900">Location</div><div className="text-xs text-slate-500">Master Domain</div></div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">482</div>
            <div className="text-xs text-green-600 font-semibold mt-1">99.6% golden records</div>
            <div className="progress mt-3" style={{ height: 4 }}><div className="progress-fill" style={{ width: '99.6%' }}></div></div>
          </div>
        </div>

        {/* Golden Record Stats */}
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-yellow-500" /> Golden Record Resolution</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1"><span className="font-semibold">Duplicates Merged</span><span className="text-slate-500">2,480 records</span></div>
              <div className="progress"><div className="progress-fill" style={{ width: '85%' }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1"><span className="font-semibold">Fuzzy Match Resolved</span><span className="text-slate-500">1,120 records</span></div>
              <div className="progress"><div className="progress-fill bg-gradient-to-r from-indigo-400 to-violet-500" style={{ width: '72%' }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1"><span className="font-semibold">Cross-Source Linked</span><span className="text-slate-500">3,840 records</span></div>
              <div className="progress"><div className="progress-fill bg-gradient-to-r from-green-400 to-emerald-500" style={{ width: '92%' }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1"><span className="font-semibold">Pending Review</span><span className="text-slate-500">142 records</span></div>
              <div className="progress"><div className="progress-fill bg-gradient-to-r from-yellow-400 to-orange-400" style={{ width: '8%' }}></div></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   QUALITY PANEL
   ============================================================ */
function QualityPanel() {
  return (
    <div className="fos-panel active">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-green-100 text-green-600"><CheckCircle className="w-5 h-5" /></div>
          <div><h2>Data Quality & Validation</h2><p>Quality metrics, validation rules, and anomaly detection</p></div>
        </div>

        {/* Quality Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard value="99.2%" label="Overall Quality" color="text-green-600" />
          <StatCard value="99.1%" label="Completeness" color="text-blue-600" />
          <StatCard value="99.2%" label="Accuracy" color="text-indigo-600" />
          <StatCard value="3" label="Anomalies Detected" color="text-yellow-600" />
        </div>

        {/* Quality Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="glass-strong rounded-2xl p-4 text-center">
            <div className="w-10 h-10 mx-auto rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2"><Gauge className="w-5 h-5" /></div>
            <div className="text-xl font-extrabold text-blue-600">99.1%</div>
            <div className="text-xs text-slate-500 font-semibold">Completeness</div>
          </div>
          <div className="glass-strong rounded-2xl p-4 text-center">
            <div className="w-10 h-10 mx-auto rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-2"><CheckCircle className="w-5 h-5" /></div>
            <div className="text-xl font-extrabold text-green-600">99.2%</div>
            <div className="text-xs text-slate-500 font-semibold">Accuracy</div>
          </div>
          <div className="glass-strong rounded-2xl p-4 text-center">
            <div className="w-10 h-10 mx-auto rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center mb-2"><RefreshCw className="w-5 h-5" /></div>
            <div className="text-xl font-extrabold text-violet-600">98.8%</div>
            <div className="text-xs text-slate-500 font-semibold">Consistency</div>
          </div>
          <div className="glass-strong rounded-2xl p-4 text-center">
            <div className="w-10 h-10 mx-auto rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-2"><Clock className="w-5 h-5" /></div>
            <div className="text-xl font-extrabold text-orange-600">99.4%</div>
            <div className="text-xs text-slate-500 font-semibold">Timeliness</div>
          </div>
        </div>

        {/* Validation Rules Table */}
        <div className="glass-strong rounded-2xl overflow-hidden mb-6">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Validation Rules</h3>
            <button className="btn-primary text-xs">+ New Rule</button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Rule Name</th><th>Scope</th><th>Pass Rate</th><th>Status</th><th>Last Run</th></tr></thead>
              <tbody>
                {validationRules.map((r) => (
                  <tr key={r.rule} className="clickable">
                    <td className="font-semibold">{r.rule}</td>
                    <td className="text-slate-500">{r.scope}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 progress" style={{ height: 6 }}><div className="progress-fill" style={{ width: r.passRate }}></div></div>
                        <span className="font-bold text-sm text-green-600">{r.passRate}</span>
                      </div>
                    </td>
                    <td><span className={`badge ${r.status === 'Active' ? 'badge-green' : 'badge-yellow'}`}>{r.status}</span></td>
                    <td className="text-slate-500">{r.lastRun}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quality Trend + Anomaly Detection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-600" /> Quality Trend</h3>
            <div style={{ height: 240 }}>
              <Line data={qualityTrendData} options={{ ...lineDefaults((v) => v + '%'), scales: { ...lineDefaults((v) => v + '%').scales, y: { ...lineDefaults((v) => v + '%').scales.y, min: 94, max: 100 } } }} />
            </div>
          </div>
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-500" /> Anomaly Detection</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl border border-yellow-100 bg-yellow-50/30">
                <div className="w-8 h-8 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center flex-shrink-0"><AlertTriangle className="w-4 h-4" /></div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-800">Duplicate transaction in Finance</div>
                  <div className="text-xs text-slate-500">INV-2847 appears twice in Bronze layer -- 30 min ago</div>
                </div>
                <span className="badge badge-yellow">Medium</span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl border border-red-100 bg-red-50/30">
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0"><AlertTriangle className="w-4 h-4" /></div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-800">Schema drift detected in CRM pipeline</div>
                  <div className="text-xs text-slate-500">New field added without migration -- 1h ago</div>
                </div>
                <span className="badge badge-red">High</span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl border border-blue-100 bg-blue-50/30">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0"><Sparkles className="w-4 h-4" /></div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-800">Unusual null rate in HR payroll</div>
                  <div className="text-xs text-slate-500">12% null values in overtime_hours field -- 2h ago</div>
                </div>
                <span className="badge badge-blue">Low</span>
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

function LineageRow({ from, to, then, status }) {
  const statusBadge = status === 'Active' ? 'badge-green' : status === 'Warning' ? 'badge-yellow' : 'badge-blue';
  return (
    <div className="flex items-center gap-2 p-3 rounded-xl border border-slate-100 hover:bg-blue-50/40 transition">
      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{from}</span>
      <ChevronRight className="w-3 h-3 text-slate-400" />
      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{to}</span>
      <ChevronRight className="w-3 h-3 text-slate-400" />
      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">{then}</span>
      <span className={`badge ${statusBadge} ml-auto`}>{status}</span>
    </div>
  );
}

function AccessRow({ role, users, access, color, bg }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50">
      <div className={`w-8 h-8 rounded-lg ${bg} ${color} flex items-center justify-center flex-shrink-0`}><Lock className="w-4 h-4" /></div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-slate-800">{role}</div>
        <div className="text-xs text-slate-500">{users} users -- {access}</div>
      </div>
    </div>
  );
}

export default DataPlatform;
