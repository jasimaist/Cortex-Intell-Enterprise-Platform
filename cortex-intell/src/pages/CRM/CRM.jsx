import { useState, useRef, useEffect } from 'react';
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
  TrendingUp, Users, Target, DollarSign, Building2, Contact, UserPlus,
  Handshake, LifeBuoy, CalendarCheck, FileText, ListFilter, ScanEye,
  Flame, Activity, Filter, Sparkles, ChevronRight, Download, Plus,
  Search, Eye, MoreHorizontal, Mail, Phone, Video, Calendar, CheckCircle,
  AlertTriangle, Star, Check, Clock, Globe, MapPin, RefreshCw, Loader,
  LayoutGrid, List,
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
const accounts = [
  { name: 'TechCorp NSW', location: 'Sydney, AU', industry: 'Technology', type: 'Enterprise', typeBadge: 'badge-blue', revenue: '$820K', deals: '3 active', dealsColor: 'text-blue-600', healthDot: 'bg-green-500', healthLabel: 'Healthy', healthColor: 'text-green-700', avatar: 'TN', grad: 'from-blue-500 to-indigo-600' },
  { name: 'Summit Ventures', location: 'Melbourne, AU', industry: 'Finance', type: 'Enterprise', typeBadge: 'badge-blue', revenue: '$450K', deals: '2 active', dealsColor: 'text-blue-600', healthDot: 'bg-green-500', healthLabel: 'Healthy', healthColor: 'text-green-700', avatar: 'SV', grad: 'from-violet-500 to-purple-600' },
  { name: 'Horizon Group', location: 'Singapore', industry: 'Consulting', type: 'Mid-Market', typeBadge: 'badge-purple', revenue: '$210K', deals: '1 active', dealsColor: 'text-blue-600', healthDot: 'bg-yellow-500', healthLabel: 'At Risk', healthColor: 'text-yellow-700', avatar: 'HG', grad: 'from-sky-500 to-cyan-600' },
  { name: 'PrimeEdge Solutions', location: 'Brisbane, AU', industry: 'Healthcare', type: 'Customer', typeBadge: 'badge-green', revenue: '$520K', deals: '0 active', dealsColor: 'text-slate-500', healthDot: 'bg-green-500', healthLabel: 'Healthy', healthColor: 'text-green-700', avatar: 'PE', grad: 'from-green-500 to-emerald-600' },
  { name: 'GlobalTech', location: 'London, UK', industry: 'SaaS', type: 'Enterprise', typeBadge: 'badge-blue', revenue: '$280K', deals: '1 active', dealsColor: 'text-blue-600', healthDot: 'bg-green-500', healthLabel: 'Healthy', healthColor: 'text-green-700', avatar: 'GT', grad: 'from-orange-500 to-red-500' },
  { name: 'Nexus Labs', location: 'Perth, AU', industry: 'Biotech', type: 'Prospect', typeBadge: 'badge-yellow', revenue: '$175K', deals: '1 active', dealsColor: 'text-blue-600', healthDot: 'bg-blue-500', healthLabel: 'New', healthColor: 'text-blue-700', avatar: 'NL', grad: 'from-indigo-500 to-blue-600' },
];

const cases = [
  { id: 'CS-1042', subject: 'API integration failing on auth', account: 'TechCorp NSW', priority: 'Critical', priBadge: 'badge-red', status: 'In Progress', stsBadge: 'badge-yellow', assigned: 'Michael C.', age: '2h' },
  { id: 'CS-1041', subject: 'Invoice discrepancy Q1', account: 'Summit Ventures', priority: 'Medium', priBadge: 'badge-yellow', status: 'Open', stsBadge: 'badge-blue', assigned: 'Elena R.', age: '6h' },
  { id: 'CS-1040', subject: 'Data export timeout issue', account: 'Horizon Group', priority: 'Medium', priBadge: 'badge-yellow', status: 'In Progress', stsBadge: 'badge-yellow', assigned: 'James W.', age: '1d' },
  { id: 'CS-1039', subject: 'Feature request: bulk import', account: 'PrimeEdge', priority: 'Low', priBadge: 'badge-blue', status: 'Open', stsBadge: 'badge-blue', assigned: 'Priya P.', age: '2d' },
  { id: 'CS-1038', subject: 'SSO login issue for new users', account: 'GlobalTech', priority: 'Critical', priBadge: 'badge-red', status: 'Resolved', stsBadge: 'badge-green', assigned: 'Michael C.', age: '3d' },
  { id: 'CS-1037', subject: 'Dashboard not loading correctly', account: 'Nexus Labs', priority: 'Medium', priBadge: 'badge-yellow', status: 'Resolved', stsBadge: 'badge-green', assigned: 'James W.', age: '4d' },
];

const leadRows = [
  { name: 'TechCorp NSW', contact: 'John Miller', avatar: 'TN', source: 'Website', score: 92, stage: 'Hot', stageBadge: 'badge-red', value: '$340K', assigned: 'Sarah J.' },
  { name: 'Horizon Group', contact: 'Maria Santos', avatar: 'HG', source: 'Referral', score: 85, stage: 'Qualified', stageBadge: 'badge-blue', value: '$210K', assigned: 'Tom B.' },
  { name: 'Apex Industries', contact: 'David Lee', avatar: 'AI', source: 'LinkedIn', score: 74, stage: 'Warm', stageBadge: 'badge-yellow', value: '$85K', assigned: 'Anna K.' },
  { name: 'Blue Ocean Ltd', contact: 'Rachel Kim', avatar: 'BO', source: 'Webinar', score: 68, stage: 'Warm', stageBadge: 'badge-yellow', value: '$120K', assigned: 'Sarah J.' },
  { name: 'DataFlow Inc', contact: 'Chen Wei', avatar: 'DI', source: 'Cold Outreach', score: 71, stage: 'Qualified', stageBadge: 'badge-blue', value: '$95K', assigned: 'Tom B.' },
];

const funnelData = [
  { label: 'Visitors', count: '12,400', pct: 100 },
  { label: 'Leads', count: '2,480', pct: 80 },
  { label: 'Qualified', count: '892', pct: 60 },
  { label: 'Proposal', count: '312', pct: 38 },
  { label: 'Closed Won', count: '78', pct: 24 },
];

const statusColor = { 'Hot Lead': 'badge-red', Warm: 'badge-yellow', Qualified: 'badge-blue', Customer: 'badge-green' };

const pipelineStages = [
  { key: 'lead', title: 'Lead', color: 'bg-blue-500' },
  { key: 'qualified', title: 'Qualified', color: 'bg-indigo-500' },
  { key: 'proposal', title: 'Proposal', color: 'bg-violet-500' },
  { key: 'won', title: 'Closed Won', color: 'bg-green-500' },
];

/* ============================================================
   CHART DATA
   ============================================================ */
const revenueTrendData = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    { label: 'New Business', data: [120, 150, 180, 210, 240, 340], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.12)', tension: 0.4, fill: true },
    { label: 'Expansion', data: [60, 80, 95, 110, 130, 180], borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,.08)', tension: 0.4, fill: true },
    { label: 'Renewal', data: [200, 210, 220, 230, 240, 250], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.08)', tension: 0.4, fill: true },
  ],
};

const pipelineChartData = {
  labels: ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'],
  datasets: [{ data: [545, 305, 625, 175, 800], backgroundColor: ['#3b82f6', '#6366f1', '#8b5cf6', '#f59e0b', '#10b981'], borderWidth: 0 }],
};

const leadSourceChartData = {
  labels: ['Website', 'Referral', 'LinkedIn', 'Webinar', 'Cold Outreach', 'Events'],
  datasets: [{ data: [35, 22, 18, 12, 8, 5], backgroundColor: ['#3b82f6', '#6366f1', '#8b5cf6', '#22d3ee', '#f59e0b', '#10b981'], borderWidth: 0 }],
};

const winRateData = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    { label: 'Win Rate %', data: [18.2, 19.5, 20.8, 22.1, 23.4, 24.8], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.12)', tension: 0.4, fill: true, pointRadius: 4 },
    { label: 'Industry Avg', data: [20, 20, 20, 20, 20, 20], borderColor: '#94a3b8', borderDash: [5, 5], backgroundColor: 'transparent', tension: 0, pointRadius: 0 },
  ],
};

const caseTrendData = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    { label: 'Opened', data: [24, 28, 22, 18, 20, 16], backgroundColor: 'rgba(249,115,22,.7)', borderRadius: 4 },
    { label: 'Resolved', data: [22, 26, 24, 20, 22, 18], backgroundColor: 'rgba(16,185,129,.7)', borderRadius: 4 },
  ],
};

const opportunityRevenueData = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    { label: 'New Business', data: [120, 150, 180, 210, 240, 340], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.1)', tension: 0.4, fill: true },
    { label: 'Expansion', data: [60, 80, 95, 110, 130, 180], borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,.1)', tension: 0.4, fill: true },
  ],
};

const dealStageData = {
  labels: ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won'],
  datasets: [{ label: 'Deals', data: [3, 2, 2, 1, 2], backgroundColor: ['#3b82f6', '#6366f1', '#8b5cf6', '#f59e0b', '#10b981'], borderRadius: 8 }],
};

const geoChartData = {
  labels: ['North America', 'Europe', 'Asia Pacific', 'Others'],
  datasets: [{ data: [42, 28, 22, 8], backgroundColor: ['#3b82f6', '#6366f1', '#8b5cf6', '#cbd5e1'], borderWidth: 0 }],
};

/* ============================================================
   SUB-MODULE CARDS for Dashboard
   ============================================================ */
const subModuleCards = [
  { tab: 'accounts', icon: Building2, label: 'Accounts', sub: '12 Active', bg: 'bg-blue-100', text: 'text-blue-600' },
  { tab: 'contacts', icon: Contact, label: 'Contacts', sub: '48 People', bg: 'bg-indigo-100', text: 'text-indigo-600' },
  { tab: 'leads', icon: UserPlus, label: 'Leads', sub: '247 Active', bg: 'bg-violet-100', text: 'text-violet-600' },
  { tab: 'opportunities', icon: Handshake, label: 'Deals', sub: '$1.18M Pipeline', bg: 'bg-sky-100', text: 'text-sky-600' },
  { tab: 'cases', icon: LifeBuoy, label: 'Cases', sub: '8 Open', bg: 'bg-orange-100', text: 'text-orange-600' },
  { tab: 'activities', icon: CalendarCheck, label: 'Activities', sub: '14 Today', bg: 'bg-cyan-100', text: 'text-cyan-600' },
  { tab: 'documents', icon: FileText, label: 'Documents', sub: '86 Files', bg: 'bg-green-100', text: 'text-green-600' },
  { tab: 'segments', icon: ListFilter, label: 'Segments', sub: '6 Lists', bg: 'bg-purple-100', text: 'text-purple-600' },
  { tab: 'account360', icon: ScanEye, label: 'Account 360', sub: 'Full View', bg: 'bg-rose-100', text: 'text-rose-600' },
];

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
function CRM() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'dashboard';
  const [activeTab, setActiveTab] = useState(initialTab);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Sync from URL when navigated externally
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
            <span className="text-blue-600 font-semibold">Cortex Intell CRM 360</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Cortex Intell CRM 360</h1>
          <p className="text-slate-500">Manage Leads. Close Deals. Delight Customers.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline"><Download className="w-4 h-4" /> Export</button>
          <button className="btn-outline"><Filter className="w-4 h-4" /> Filter</button>
          <button className="btn-primary"><Plus className="w-4 h-4" /> Add Lead</button>
        </div>
      </section>

      {/* KPI STRIP */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard label="PIPELINE VALUE" value="$1.18M" delta="+18.7% ↑" icon={<TrendingUp className="w-5 h-5" />} bg="bg-blue-100" text="text-blue-600" />
        <KpiCard label="ACTIVE LEADS" value="247" delta="32 hot" icon={<Users className="w-5 h-5" />} bg="bg-indigo-100" text="text-indigo-600" />
        <KpiCard label="WIN RATE" value="24.8%" delta="+3.2% ↑" icon={<Target className="w-5 h-5" />} bg="bg-violet-100" text="text-violet-600" />
        <KpiCard label="AVG. DEAL SIZE" value="$48K" delta="+12% ↑" icon={<DollarSign className="w-5 h-5" />} bg="bg-sky-100" text="text-sky-600" />
      </section>

      {/* AI SALES COPILOT */}
      <section className="mb-6">
        <div className="glass-blue rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute w-48 h-48 bg-white rounded-full blur-3xl -top-20 -right-20 animate-blob"></div>
          </div>
          <div className="relative z-10 w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="relative z-10 flex-1">
            <div className="font-bold text-white">AI Sales Copilot</div>
            <div className="text-white/90 text-sm">TechCorp NSW is your hottest lead (score 92). I've drafted a personalized proposal -- ready in your inbox.</div>
          </div>
          <button className="relative z-10 bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold text-sm hover:scale-105 transition">View Draft</button>
        </div>
      </section>

      {/* TAB PANELS */}
      {activeTab === 'dashboard' && <DashboardPanel switchTab={switchTab} />}
      {activeTab === 'accounts' && <AccountsPanel />}
      {activeTab === 'contacts' && <ContactsPanel />}
      {activeTab === 'leads' && <LeadsPanel />}
      {activeTab === 'opportunities' && <OpportunitiesPanel />}
      {activeTab === 'cases' && <CasesPanel />}
      {activeTab === 'activities' && <ActivitiesPanel />}
      {activeTab === 'documents' && <DocumentsPanel />}
      {activeTab === 'segments' && <SegmentsPanel />}
      {activeTab === 'account360' && <Account360Panel />}
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
      <section className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-6 mt-4">
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

      {/* Row 1: Revenue Trend + Pipeline by Stage */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-600" /> Revenue Trend</h3>
            <span className="badge badge-green">+18.7%</span>
          </div>
          <div style={{ height: 240 }}>
            <Line data={revenueTrendData} options={lineDefaults((v) => '$' + v + 'K')} />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><Target className="w-4 h-4 text-indigo-600" /> Pipeline by Stage</h3>
            <span className="text-xs text-slate-500">$1.18M Total</span>
          </div>
          <div style={{ height: 240 }}>
            <Doughnut data={pipelineChartData} options={doughnutDefaults} />
          </div>
        </div>
      </section>

      {/* Row 2: Lead Sources + Win Rate */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><Target className="w-4 h-4 text-violet-600" /> Lead Sources</h3>
            <span className="text-xs text-slate-500">247 Active Leads</span>
          </div>
          <div style={{ height: 240 }}>
            <Doughnut data={leadSourceChartData} options={doughnutDefaults} />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-sky-600" /> Win Rate Trend</h3>
            <span className="badge badge-green">24.8%</span>
          </div>
          <div style={{ height: 240 }}>
            <Line
              data={winRateData}
              options={{
                ...lineDefaults((v) => v + '%'),
                scales: {
                  ...lineDefaults((v) => v + '%').scales,
                  y: { ...lineDefaults((v) => v + '%').scales.y, min: 10, max: 35 },
                },
              }}
            />
          </div>
        </div>
      </section>

      {/* Row 3: Hot Deals + Recent CRM Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><Flame className="w-4 h-4 text-red-500" /> Hot Deals</h3>
            <button className="btn-outline text-xs" onClick={() => switchTab('opportunities')}>View All</button>
          </div>
          <div className="space-y-3">
            <HotDealRow name="TechCorp NSW" contact="John Miller" stage="Lead Stage" value="$340K" valueColor="text-blue-600" score={92} label="HOT" labelBg="bg-red-100 text-red-600" avatar="TN" grad="from-blue-500 to-indigo-600" onClick={() => switchTab('opportunities')} />
            <HotDealRow name="Summit Ventures" contact="Emma Brown" stage="Proposal Stage" value="$450K" valueColor="text-blue-600" score={88} label="HOT" labelBg="bg-red-100 text-red-600" avatar="SV" grad="from-violet-500 to-purple-600" onClick={() => switchTab('opportunities')} />
            <HotDealRow name="Horizon Group" contact="Maria Santos" stage="Qualified" value="$210K" valueColor="text-blue-600" score={85} label="WARM" labelBg="bg-orange-100 text-orange-600" avatar="HG" grad="from-indigo-500 to-blue-600" onClick={() => switchTab('opportunities')} />
            <HotDealRow name="PrimeEdge Solutions" contact="Lisa Park" stage="Closed Won" value="$520K" valueColor="text-green-600" score={95} label="WON" labelBg="bg-green-100 text-green-600" avatar="PE" grad="from-green-500 to-emerald-600" onClick={() => switchTab('opportunities')} />
          </div>
        </div>

        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><Activity className="w-4 h-4 text-cyan-600" /> Recent CRM Activity</h3>
          </div>
          <div className="space-y-3">
            <ActivityRow icon={<CheckCircle className="w-4 h-4" />} bg="bg-green-100 text-green-600" title="Deal won -- PrimeEdge Solutions" sub="$520K closed · 2 min ago" />
            <ActivityRow icon={<UserPlus className="w-4 h-4" />} bg="bg-blue-100 text-blue-600" title="New lead qualified -- TechCorp NSW" sub="Score: 92/100 · 15 min ago" />
            <ActivityRow icon={<Mail className="w-4 h-4" />} bg="bg-violet-100 text-violet-600" title="Proposal sent -- Summit Ventures" sub="$450K deal · 1 hr ago" />
            <ActivityRow icon={<Phone className="w-4 h-4" />} bg="bg-orange-100 text-orange-600" title="Call scheduled -- Horizon Group" sub="Maria Santos · Tomorrow 10:00 AM" />
            <ActivityRow icon={<AlertTriangle className="w-4 h-4" />} bg="bg-yellow-100 text-yellow-600" title="Case escalated -- GlobalTech" sub="Priority: High · 3 hr ago" />
            <ActivityRow icon={<FileText className="w-4 h-4" />} bg="bg-indigo-100 text-indigo-600" title="Contract uploaded -- Nexus Labs" sub="NDA signed · 5 hr ago" />
          </div>
        </div>
      </section>

      {/* Row 4: Conversion Funnel + Cases Summary */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Filter className="w-4 h-4 text-violet-600" /> Conversion Funnel</h3>
          <div className="space-y-3">
            {funnelData.map((f) => (
              <div key={f.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold">{f.label}</span>
                  <span className="text-slate-500">{f.count}</span>
                </div>
                <div className="progress"><div className="progress-fill" style={{ width: `${f.pct}%` }}></div></div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><LifeBuoy className="w-4 h-4 text-orange-600" /> Cases Summary</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-orange-50 rounded-xl text-center">
              <div className="text-2xl font-extrabold text-orange-600">8</div>
              <div className="text-xs text-slate-600 font-semibold">Open Cases</div>
            </div>
            <div className="p-3 bg-green-50 rounded-xl text-center">
              <div className="text-2xl font-extrabold text-green-600">142</div>
              <div className="text-xs text-slate-600 font-semibold">Resolved (MTD)</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl text-center">
              <div className="text-2xl font-extrabold text-blue-600">4.2h</div>
              <div className="text-xs text-slate-600 font-semibold">Avg Response</div>
            </div>
            <div className="p-3 bg-violet-50 rounded-xl text-center">
              <div className="text-2xl font-extrabold text-violet-600">94%</div>
              <div className="text-xs text-slate-600 font-semibold">CSAT Score</div>
            </div>
          </div>
          <div style={{ height: 140 }}>
            <Bar
              data={caseTrendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { boxWidth: 8, font: { size: 10 } } } },
                scales: { y: { grid: { color: '#f1f5f9' }, display: false }, x: { grid: { display: false } } },
              }}
            />
          </div>
        </div>
      </section>

      {/* AI CRM Insights Banner */}
      <section className="glass-blue rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden mb-6">
        <div className="absolute inset-0 opacity-20"><div className="absolute w-48 h-48 bg-white rounded-full blur-3xl -top-20 -right-20 animate-blob"></div></div>
        <div className="relative z-10 w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="relative z-10 flex-1">
          <div className="font-bold text-white">AI CRM Insights</div>
          <div className="text-white/90 text-sm">TechCorp NSW (score 92) opened your proposal 4x -- schedule a close call this week. Pipeline is 18.7% up. 3 deals in negotiation worth $725K total.</div>
        </div>
        <button className="relative z-10 bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold text-sm hover:scale-105 transition">View All Insights</button>
      </section>
    </div>
  );
}

/* ============================================================
   ACCOUNTS PANEL
   ============================================================ */
function AccountsPanel() {
  const [search, setSearch] = useState('');
  const filtered = accounts.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="fos-panel active" id="panel-accounts">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-blue-100 text-blue-600"><Building2 className="w-5 h-5" /></div>
          <div><h2>Accounts</h2><p>All company profiles and client accounts</p></div>
        </div>

        <div className="glass-strong rounded-2xl overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900">Account Directory</h3>
              <p className="text-xs text-slate-500">12 active accounts · 3 prospects</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  placeholder="Search accounts..."
                  className="pl-9 pr-3 py-2 text-sm bg-blue-50/50 border border-blue-100 rounded-lg outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="btn-primary text-xs">+ New Account</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Account Name</th><th>Industry</th><th>Type</th><th>Revenue</th><th>Deals</th><th>Health</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.name} className="clickable">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className={`avatar avatar-sm bg-gradient-to-br ${a.grad} text-white`}>{a.avatar}</div>
                        <div>
                          <div className="font-semibold text-slate-800">{a.name}</div>
                          <div className="text-xs text-slate-400">{a.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-slate-600">{a.industry}</td>
                    <td><span className={`badge ${a.typeBadge}`}>{a.type}</span></td>
                    <td className="font-bold text-slate-800">{a.revenue}</td>
                    <td><span className={`font-semibold ${a.dealsColor}`}>{a.deals}</span></td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${a.healthDot}`}></span>
                        <span className={`text-xs font-semibold ${a.healthColor}`}>{a.healthLabel}</span>
                      </div>
                    </td>
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
      </section>
    </div>
  );
}

/* ============================================================
   CONTACTS PANEL
   ============================================================ */
function ContactsPanel() {
  const [search, setSearch] = useState('');
  const contacts = CORTEX_DATA.contacts.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="fos-panel active" id="panel-contacts">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-indigo-100 text-indigo-600"><Contact className="w-5 h-5" /></div>
          <div><h2>Contacts</h2><p>People, roles, and relationship history</p></div>
        </div>

        <div className="glass-strong rounded-2xl overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900">Contacts Database</h3>
              <p className="text-xs text-slate-500">AI-scored leads · Updated 2 min ago</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  placeholder="Search contacts..."
                  className="pl-9 pr-3 py-2 text-sm bg-blue-50/50 border border-blue-100 rounded-lg outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="btn-primary text-xs">+ Contact</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Name</th><th>Company</th><th>Role</th><th>Status</th><th>AI Score</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c.email} className="clickable">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar avatar-sm">{c.avatar}</div>
                        <div>
                          <div className="font-semibold text-slate-800">{c.name}</div>
                          <div className="text-xs text-slate-400">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="font-medium">{c.company}</td>
                    <td className="text-slate-500">{c.role}</td>
                    <td><span className={`badge ${statusColor[c.status] || 'badge-gray'}`}>{c.status}</span></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 progress" style={{ height: 6 }}><div className="progress-fill" style={{ width: `${c.score}%` }}></div></div>
                        <span className="font-bold text-sm text-slate-700">{c.score}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button className="p-1.5 hover:bg-blue-50 rounded-lg"><Mail className="w-4 h-4 text-blue-600" /></button>
                        <button className="p-1.5 hover:bg-blue-50 rounded-lg"><Phone className="w-4 h-4 text-blue-600" /></button>
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
   LEADS PANEL
   ============================================================ */
function LeadsPanel() {
  return (
    <div className="fos-panel active" id="panel-leads">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-violet-100 text-violet-600"><UserPlus className="w-5 h-5" /></div>
          <div><h2>Leads</h2><p>Prospect management and AI scoring</p></div>
        </div>

        {/* Lead Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard value="247" label="Total Leads" color="text-blue-600" />
          <StatCard value="32" label="Hot Leads" color="text-red-500" />
          <StatCard value="68%" label="Qualification Rate" color="text-green-600" />
          <StatCard value="4.2 days" label="Avg. Response Time" color="text-violet-600" />
        </div>

        {/* Lead Scoring Table */}
        <div className="glass-strong rounded-2xl overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Lead Scoring & Management</h3>
            <button className="btn-primary text-xs">+ Capture Lead</button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Lead</th><th>Source</th><th>AI Score</th><th>Stage</th><th>Value</th><th>Assigned To</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {leadRows.map((l) => (
                  <tr key={l.name} className="clickable">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar avatar-sm">{l.avatar}</div>
                        <div>
                          <div className="font-semibold">{l.name}</div>
                          <div className="text-xs text-slate-400">{l.contact}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-slate-500">{l.source}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 progress" style={{ height: 6 }}><div className="progress-fill" style={{ width: `${l.score}%` }}></div></div>
                        <span className={`font-bold text-sm ${l.score >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>{l.score}</span>
                      </div>
                    </td>
                    <td><span className={`badge ${l.stageBadge}`}>{l.stage}</span></td>
                    <td className="font-bold">{l.value}</td>
                    <td className="text-slate-600">{l.assigned}</td>
                    <td>
                      <div className="flex gap-1">
                        <button className="p-1.5 hover:bg-blue-50 rounded-lg"><Mail className="w-4 h-4 text-blue-600" /></button>
                        <button className="p-1.5 hover:bg-blue-50 rounded-lg"><Phone className="w-4 h-4 text-blue-600" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Conversion Funnel + Lead Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4">Conversion Funnel</h3>
            <div className="space-y-3">
              {funnelData.map((f) => (
                <div key={f.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">{f.label}</span>
                    <span className="text-slate-500">{f.count}</span>
                  </div>
                  <div className="progress"><div className="progress-fill" style={{ width: `${f.pct}%` }}></div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4">Lead Sources</h3>
            <div style={{ height: 220 }}>
              <Doughnut data={leadSourceChartData} options={{ ...doughnutDefaults }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   OPPORTUNITIES PANEL
   ============================================================ */
function OpportunitiesPanel() {
  const pipeline = CORTEX_DATA.crmPipeline;
  return (
    <div className="fos-panel active" id="panel-opportunities">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-sky-100 text-sky-600"><Handshake className="w-5 h-5" /></div>
          <div><h2>Opportunities / Deals</h2><p>Sales pipeline and deal management</p></div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 text-lg">Sales Pipeline</h3>
          <div className="flex gap-2">
            <button className="btn-outline text-xs"><LayoutGrid className="w-4 h-4" /> Kanban</button>
            <button className="btn-outline text-xs opacity-60"><List className="w-4 h-4" /> List</button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {pipelineStages.map((s) => (
            <div key={s.key} className="kanban-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${s.color}`}></span>
                  <span className="font-bold text-sm text-slate-700">{s.title}</span>
                  <span className="text-xs text-slate-400">{pipeline[s.key].length}</span>
                </div>
                <button className="text-slate-400 hover:text-blue-600"><Plus className="w-4 h-4" /></button>
              </div>
              {pipeline[s.key].map((deal) => (
                <div key={deal.name} className="kanban-card clickable">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-bold text-sm text-slate-900">{deal.name}</div>
                    {deal.hot && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">HOT</span>}
                  </div>
                  <div className="text-xs text-slate-500 mb-2">{deal.contact}</div>
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-blue-600 text-sm">{deal.value}</div>
                    <div className="flex items-center gap-1.5">
                      <div className="avatar avatar-sm">{deal.avatar}</div>
                      <div className="text-xs font-semibold text-slate-500">{deal.score}</div>
                    </div>
                  </div>
                  <div className="progress mt-2" style={{ height: 4 }}><div className="progress-fill" style={{ width: `${deal.score}%` }}></div></div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Revenue + Deal Stage Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4">Revenue by Source</h3>
            <div style={{ height: 220 }}>
              <Line data={opportunityRevenueData} options={lineDefaults()} />
            </div>
          </div>
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4">Deal Stage Distribution</h3>
            <div style={{ height: 220 }}>
              <Bar
                data={dealStageData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { grid: { color: '#f1f5f9' }, beginAtZero: true }, x: { grid: { display: false } } },
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
   CASES PANEL
   ============================================================ */
function CasesPanel() {
  return (
    <div className="fos-panel active" id="panel-cases">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-orange-100 text-orange-600"><LifeBuoy className="w-5 h-5" /></div>
          <div><h2>Cases</h2><p>Customer support tickets and issue tracking</p></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard value="38" label="Open Cases" color="text-orange-600" />
          <StatCard value="5" label="Critical" color="text-red-500" />
          <StatCard value="94%" label="SLA Compliance" color="text-green-600" />
          <StatCard value="2.4h" label="Avg. Resolution" color="text-blue-600" />
        </div>

        <div className="glass-strong rounded-2xl overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Support Cases</h3>
            <button className="btn-primary text-xs">+ New Case</button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Case ID</th><th>Subject</th><th>Account</th><th>Priority</th><th>Status</th><th>Assigned</th><th>Age</th></tr></thead>
              <tbody>
                {cases.map((c) => (
                  <tr key={c.id} className="clickable">
                    <td className="font-mono text-blue-600 font-semibold">{c.id}</td>
                    <td className="font-semibold">{c.subject}</td>
                    <td>{c.account}</td>
                    <td><span className={`badge ${c.priBadge}`}>{c.priority}</span></td>
                    <td><span className={`badge ${c.stsBadge}`}>{c.status}</span></td>
                    <td>{c.assigned}</td>
                    <td className="text-slate-500">{c.age}</td>
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
   ACTIVITIES PANEL
   ============================================================ */
function ActivitiesPanel() {
  return (
    <div className="fos-panel active" id="panel-activities">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-cyan-100 text-cyan-600"><CalendarCheck className="w-5 h-5" /></div>
          <div><h2>Activities & Tasks</h2><p>Calls, emails, meetings, and follow-ups</p></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Upcoming Activities */}
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-600" /> Upcoming Activities</h3>
            <div className="space-y-3">
              <div className="flex gap-3 items-start p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0"><Video className="w-4 h-4" /></div>
                <div className="flex-1"><div className="text-sm font-semibold">Video Call -- TechCorp NSW</div><div className="text-xs text-slate-500">With John Miller · Proposal review</div></div>
                <div className="text-right"><div className="text-xs font-bold text-blue-600">Today</div><div className="text-xs text-slate-400">3:00 PM</div></div>
              </div>
              <div className="flex gap-3 items-start p-3 rounded-xl hover:bg-slate-50">
                <div className="w-9 h-9 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0"><Calendar className="w-4 h-4" /></div>
                <div className="flex-1"><div className="text-sm font-semibold">Meeting -- Horizon Group</div><div className="text-xs text-slate-500">Maria Santos · Contract negotiation</div></div>
                <div className="text-right"><div className="text-xs font-bold text-slate-600">Tomorrow</div><div className="text-xs text-slate-400">10:00 AM</div></div>
              </div>
              <div className="flex gap-3 items-start p-3 rounded-xl hover:bg-slate-50">
                <div className="w-9 h-9 rounded-lg bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0"><Phone className="w-4 h-4" /></div>
                <div className="flex-1"><div className="text-sm font-semibold">Follow-up Call -- DataFlow</div><div className="text-xs text-slate-500">Chen Wei · Demo feedback</div></div>
                <div className="text-right"><div className="text-xs font-bold text-slate-600">Apr 18</div><div className="text-xs text-slate-400">2:00 PM</div></div>
              </div>
              <div className="flex gap-3 items-start p-3 rounded-xl hover:bg-slate-50">
                <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0"><Mail className="w-4 h-4" /></div>
                <div className="flex-1"><div className="text-sm font-semibold">Send Proposal -- Blue Ocean</div><div className="text-xs text-slate-500">Rachel Kim · Custom pricing</div></div>
                <div className="text-right"><div className="text-xs font-bold text-slate-600">Apr 19</div><div className="text-xs text-slate-400">9:00 AM</div></div>
              </div>
            </div>
          </div>

          {/* CRM Tasks */}
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-600" /> CRM Tasks</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl border border-red-100 bg-red-50/30">
                <div className="w-5 h-5 rounded border-2 border-red-400 flex-shrink-0"></div>
                <div className="flex-1"><div className="text-sm font-semibold text-slate-800">Update TechCorp proposal pricing</div><div className="text-xs text-slate-500">Due today · High priority</div></div>
                <span className="badge badge-red text-[10px]">Overdue</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50">
                <div className="w-5 h-5 rounded border-2 border-slate-300 flex-shrink-0"></div>
                <div className="flex-1"><div className="text-sm font-semibold text-slate-800">Prepare Q2 pipeline review deck</div><div className="text-xs text-slate-500">Due Apr 18 · Medium</div></div>
                <span className="badge badge-yellow text-[10px]">Pending</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50">
                <div className="w-5 h-5 rounded border-2 border-slate-300 flex-shrink-0"></div>
                <div className="flex-1"><div className="text-sm font-semibold text-slate-800">Schedule demo for Apex Industries</div><div className="text-xs text-slate-500">Due Apr 20 · Medium</div></div>
                <span className="badge badge-yellow text-[10px]">Pending</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50">
                <div className="w-5 h-5 rounded border-2 border-green-400 flex-shrink-0 bg-green-400 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1"><div className="text-sm font-semibold text-slate-400 line-through">Send NDA to Summit Ventures</div><div className="text-xs text-slate-400">Completed Apr 15</div></div>
                <span className="badge badge-green text-[10px]">Done</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50">
                <div className="w-5 h-5 rounded border-2 border-green-400 flex-shrink-0 bg-green-400 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1"><div className="text-sm font-semibold text-slate-400 line-through">Log call notes -- PrimeEdge</div><div className="text-xs text-slate-400">Completed Apr 14</div></div>
                <span className="badge badge-green text-[10px]">Done</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="glass-strong rounded-2xl p-6 mt-5">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-blue-600" /> Recent Activity Log</h3>
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-lg bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0"><Phone className="w-4 h-4" /></div>
              <div className="flex-1"><div className="text-sm font-semibold">Call with TechCorp NSW</div><div className="text-xs text-slate-500">John Miller · 32 min · AI transcribed</div></div>
              <span className="text-xs text-slate-400">2h</span>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0"><Mail className="w-4 h-4" /></div>
              <div className="flex-1"><div className="text-sm font-semibold">Email: Proposal sent to Summit</div><div className="text-xs text-slate-500">Emma Brown · Opened 3 times</div></div>
              <span className="text-xs text-slate-400">4h</span>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0"><Calendar className="w-4 h-4" /></div>
              <div className="flex-1"><div className="text-sm font-semibold">Meeting scheduled -- Horizon Group</div><div className="text-xs text-slate-500">Maria Santos · Tomorrow 3:00 PM</div></div>
              <span className="text-xs text-slate-400">6h</span>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center flex-shrink-0"><Star className="w-4 h-4" /></div>
              <div className="flex-1"><div className="text-sm font-semibold">Lead scored +15 -- Blue Ocean</div><div className="text-xs text-slate-500">AI detected buying signals</div></div>
              <span className="text-xs text-slate-400">1d</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   DOCUMENTS PANEL
   ============================================================ */
function DocumentsPanel() {
  return (
    <div className="fos-panel active" id="panel-documents">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-green-100 text-green-600"><FileText className="w-5 h-5" /></div>
          <div><h2>Documents & Communications</h2><p>Proposals, contracts, emails, and attachments</p></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Documents */}
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-blue-600" /> Recent Documents</h3>
            <div className="space-y-3">
              <DocRow icon={<FileText className="w-5 h-5" />} bgIcon="bg-red-100 text-red-600" name="TechCorp_Proposal_v3.pdf" sub="Proposal · 2.4 MB · Updated 2h ago" badge="Sent" badgeClass="badge-green" />
              <DocRow icon={<FileText className="w-5 h-5" />} bgIcon="bg-blue-100 text-blue-600" name="Summit_MSA_Contract.docx" sub="Contract · 1.8 MB · Updated 1d ago" badge="Draft" badgeClass="badge-yellow" />
              <DocRow icon={<FileText className="w-5 h-5" />} bgIcon="bg-green-100 text-green-600" name="Q1_Pipeline_Report.xlsx" sub="Report · 890 KB · Updated 3d ago" badge="Final" badgeClass="badge-blue" />
              <DocRow icon={<FileText className="w-5 h-5" />} bgIcon="bg-violet-100 text-violet-600" name="Horizon_Demo_Deck.pptx" sub="Presentation · 5.2 MB · Updated 5d ago" badge="Delivered" badgeClass="badge-green" />
            </div>
          </div>

          {/* Email Communications */}
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Mail className="w-4 h-4 text-blue-600" /> Email Thread Tracker</h3>
            <div className="space-y-3">
              <div className="flex gap-3 items-start p-3 rounded-xl hover:bg-slate-50 cursor-pointer">
                <div className="avatar avatar-sm">EB</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-800">Re: Proposal for Summit Ventures</div>
                  <div className="text-xs text-slate-500">Emma Brown · "Looks great, scheduling internal review..."</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">1h ago</div>
                  <div className="flex items-center gap-1 mt-0.5"><Eye className="w-3 h-3 text-green-500" /><span className="text-[10px] text-green-600">Opened 3x</span></div>
                </div>
              </div>
              <div className="flex gap-3 items-start p-3 rounded-xl hover:bg-slate-50 cursor-pointer">
                <div className="avatar avatar-sm">JM</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-800">TechCorp -- Pricing Discussion</div>
                  <div className="text-xs text-slate-500">John Miller · "Can we schedule a call to discuss..."</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">3h ago</div>
                  <div className="flex items-center gap-1 mt-0.5"><Eye className="w-3 h-3 text-green-500" /><span className="text-[10px] text-green-600">Opened 5x</span></div>
                </div>
              </div>
              <div className="flex gap-3 items-start p-3 rounded-xl hover:bg-slate-50 cursor-pointer">
                <div className="avatar avatar-sm">MS</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-800">Horizon Group -- NDA Signed</div>
                  <div className="text-xs text-slate-500">Maria Santos · "Please find the signed NDA attached."</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">1d ago</div>
                  <div className="flex items-center gap-1 mt-0.5"><CheckCircle className="w-3 h-3 text-blue-500" /><span className="text-[10px] text-blue-600">Read</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   SEGMENTS PANEL
   ============================================================ */
function SegmentsPanel() {
  return (
    <div className="fos-panel active" id="panel-segments">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-purple-100 text-purple-600"><ListFilter className="w-5 h-5" /></div>
          <div><h2>Segments & Lists</h2><p>Smart lists, tags, and customer segments</p></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SegmentCard icon={<Flame className="w-5 h-5" />} iconBg="bg-red-100 text-red-600" title="Hot Leads" sub="AI Score > 80" value="32" delta="+8 this week" deltaColor="text-green-600" barWidth="65%" barClass="bg-gradient-to-r from-red-400 to-orange-400" />
          <SegmentCard icon={<Building2 className="w-5 h-5" />} iconBg="bg-blue-100 text-blue-600" title="Enterprise" sub="Revenue > $200K" value="18" delta="+3 this month" deltaColor="text-green-600" barWidth="45%" barClass="" />
          <SegmentCard icon={<Clock className="w-5 h-5" />} iconBg="bg-yellow-100 text-yellow-600" title="At Risk" sub="No activity > 30 days" value="7" delta="+2 flagged" deltaColor="text-red-600" barWidth="28%" barClass="bg-gradient-to-r from-yellow-400 to-red-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SegmentCardSimple icon={<RefreshCw className="w-5 h-5" />} iconBg="bg-green-100 text-green-600" title="Renewal Pipeline" sub="Due in next 90 days" value="14" delta="$1.2M value" deltaColor="text-blue-600" />
          <SegmentCardSimple icon={<Globe className="w-5 h-5" />} iconBg="bg-indigo-100 text-indigo-600" title="APAC Region" sub="Geographic segment" value="42" delta="30% of total" deltaColor="text-green-600" />
          <SegmentCardSimple icon={<Mail className="w-5 h-5" />} iconBg="bg-violet-100 text-violet-600" title="Newsletter List" sub="Marketing subscribers" value="3,842" delta="28% open rate" deltaColor="text-green-600" />
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   ACCOUNT 360 PANEL
   ============================================================ */
function Account360Panel() {
  return (
    <div className="fos-panel active" id="panel-account360">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-rose-100 text-rose-600"><ScanEye className="w-5 h-5" /></div>
          <div><h2>Account 360 View</h2><p>Complete unified view of any account</p></div>
        </div>

        {/* Account Selector */}
        <div className="glass-strong rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-4">
            <div className="avatar" style={{ width: 56, height: 56, fontSize: 18 }}>TN</div>
            <div className="flex-1">
              <div className="text-xl font-extrabold text-slate-900">TechCorp NSW</div>
              <div className="text-sm text-slate-500">Enterprise · Technology · Sydney, AU</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="badge badge-green">Customer</span>
                <span className="badge badge-red">Hot Lead</span>
                <span className="badge badge-blue">3 Active Deals</span>
              </div>
            </div>
            <select className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl text-sm font-semibold outline-none">
              <option>TechCorp NSW</option>
              <option>Summit Ventures</option>
              <option>Horizon Group</option>
              <option>PrimeEdge Solutions</option>
              <option>GlobalTech</option>
            </select>
          </div>
        </div>

        {/* 360 KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="glass-strong rounded-2xl p-4 text-center"><div className="text-xl font-extrabold text-blue-600">$820K</div><div className="text-[10px] text-slate-500 font-bold mt-1">LIFETIME VALUE</div></div>
          <div className="glass-strong rounded-2xl p-4 text-center"><div className="text-xl font-extrabold text-green-600">3</div><div className="text-[10px] text-slate-500 font-bold mt-1">ACTIVE DEALS</div></div>
          <div className="glass-strong rounded-2xl p-4 text-center"><div className="text-xl font-extrabold text-violet-600">4</div><div className="text-[10px] text-slate-500 font-bold mt-1">CONTACTS</div></div>
          <div className="glass-strong rounded-2xl p-4 text-center"><div className="text-xl font-extrabold text-orange-600">2</div><div className="text-[10px] text-slate-500 font-bold mt-1">OPEN CASES</div></div>
          <div className="glass-strong rounded-2xl p-4 text-center"><div className="text-xl font-extrabold text-cyan-600">92</div><div className="text-[10px] text-slate-500 font-bold mt-1">HEALTH SCORE</div></div>
        </div>

        {/* 360 Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Deal History */}
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4">Deal History</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
                <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center"><CheckCircle className="w-4 h-4" /></div>
                <div className="flex-1"><div className="text-sm font-semibold">Enterprise License</div><div className="text-xs text-slate-500">Closed Won · Mar 2025</div></div>
                <div className="font-bold text-green-600">$180K</div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
                <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center"><CheckCircle className="w-4 h-4" /></div>
                <div className="flex-1"><div className="text-sm font-semibold">3-Year Renewal</div><div className="text-xs text-slate-500">Closed Won · Dec 2025</div></div>
                <div className="font-bold text-green-600">$300K</div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"><Loader className="w-4 h-4" /></div>
                <div className="flex-1"><div className="text-sm font-semibold">Upsell -- AI Module</div><div className="text-xs text-slate-500">In Progress · Proposal stage</div></div>
                <div className="font-bold text-blue-600">$340K</div>
              </div>
            </div>
          </div>

          {/* Key Contacts */}
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4">Key Contacts</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50">
                <div className="avatar avatar-sm">JM</div>
                <div className="flex-1"><div className="text-sm font-semibold">John Miller</div><div className="text-xs text-slate-500">CTO · Decision Maker</div></div>
                <div className="flex gap-1">
                  <button className="p-1 hover:bg-blue-50 rounded"><Mail className="w-3.5 h-3.5 text-blue-600" /></button>
                  <button className="p-1 hover:bg-blue-50 rounded"><Phone className="w-3.5 h-3.5 text-blue-600" /></button>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50">
                <div className="avatar avatar-sm">SM</div>
                <div className="flex-1"><div className="text-sm font-semibold">Sarah Mitchell</div><div className="text-xs text-slate-500">VP Operations · Champion</div></div>
                <div className="flex gap-1">
                  <button className="p-1 hover:bg-blue-50 rounded"><Mail className="w-3.5 h-3.5 text-blue-600" /></button>
                  <button className="p-1 hover:bg-blue-50 rounded"><Phone className="w-3.5 h-3.5 text-blue-600" /></button>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50">
                <div className="avatar avatar-sm">RK</div>
                <div className="flex-1"><div className="text-sm font-semibold">Robert Kim</div><div className="text-xs text-slate-500">CFO · Budget Holder</div></div>
                <div className="flex gap-1">
                  <button className="p-1 hover:bg-blue-50 rounded"><Mail className="w-3.5 h-3.5 text-blue-600" /></button>
                  <button className="p-1 hover:bg-blue-50 rounded"><Phone className="w-3.5 h-3.5 text-blue-600" /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4">Activity Timeline</h3>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0"><Phone className="w-4 h-4" /></div>
                <div className="flex-1 pb-1">
                  <div className="text-sm font-semibold text-slate-800">Call -- Proposal Review</div>
                  <div className="text-xs text-slate-500">32 min call with John Miller</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">2 hours ago</div>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0"><Mail className="w-4 h-4" /></div>
                <div className="flex-1 pb-1">
                  <div className="text-sm font-semibold text-slate-800">Email -- Pricing Sent</div>
                  <div className="text-xs text-slate-500">Custom pricing doc sent to John</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Yesterday</div>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0"><Video className="w-4 h-4" /></div>
                <div className="flex-1 pb-1">
                  <div className="text-sm font-semibold text-slate-800">Demo -- AI Features</div>
                  <div className="text-xs text-slate-500">Product demo for Sarah & team</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Apr 12</div>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0"><FileText className="w-4 h-4" /></div>
                <div className="flex-1 pb-1">
                  <div className="text-sm font-semibold text-slate-800">Proposal Created</div>
                  <div className="text-xs text-slate-500">v3 proposal with custom scope</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Apr 10</div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Geography */}
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-600" /> Customer Geography</h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-xl"><div className="text-xl font-bold text-blue-700">42%</div><div className="text-xs text-slate-600">North America</div></div>
              <div className="text-center p-3 bg-indigo-50 rounded-xl"><div className="text-xl font-bold text-indigo-700">28%</div><div className="text-xs text-slate-600">Europe</div></div>
              <div className="text-center p-3 bg-violet-50 rounded-xl"><div className="text-xl font-bold text-violet-700">30%</div><div className="text-xs text-slate-600">Asia Pacific</div></div>
            </div>
            <div style={{ height: 180 }}>
              <Doughnut data={geoChartData} options={{ ...doughnutDefaults }} />
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div className="mt-5 p-4 rounded-xl bg-gradient-to-br from-violet-50 to-blue-50 border border-violet-200">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0"><Sparkles className="w-4 h-4 text-violet-600" /></div>
            <div className="flex-1">
              <div className="text-[10px] font-bold tracking-wider text-violet-700">CORTEX AI INSIGHT</div>
              <div className="text-sm text-slate-800 mt-1">
                TechCorp NSW is a power-user advocate. Predicted lifetime value: <b>$1.4M</b>. Decision-maker John Miller opened proposal 4 times -- recommend scheduling close-call this week. Upsell confidence: <b>82%</b>.
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
function HotDealRow({ name, contact, stage, value, valueColor, score, label, labelBg, avatar, grad, onClick }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-blue-50/40 transition cursor-pointer" onClick={onClick}>
      <div className={`avatar avatar-sm bg-gradient-to-br ${grad} text-white`}>{avatar}</div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm text-slate-900">{name}</div>
        <div className="text-xs text-slate-500">{contact} · {stage}</div>
      </div>
      <div className="text-right">
        <div className={`font-bold ${valueColor}`}>{value}</div>
        <div className={`text-[10px] ${labelBg} px-2 py-0.5 rounded-full font-bold`}>{label} {score}</div>
      </div>
    </div>
  );
}

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

function DocRow({ icon, bgIcon, name, sub, badge, badgeClass }) {
  return (
    <div className="flex gap-3 items-center p-3 rounded-xl hover:bg-slate-50 cursor-pointer">
      <div className={`w-10 h-10 rounded-lg ${bgIcon} flex items-center justify-center flex-shrink-0`}>{icon}</div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-slate-800">{name}</div>
        <div className="text-xs text-slate-500">{sub}</div>
      </div>
      <span className={`badge ${badgeClass} text-[10px]`}>{badge}</span>
    </div>
  );
}

function SegmentCard({ icon, iconBg, title, sub, value, delta, deltaColor, barWidth, barClass }) {
  return (
    <div className="glass-strong rounded-2xl p-5 card-hover cursor-pointer">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>{icon}</div>
        <div><div className="font-bold text-slate-900">{title}</div><div className="text-xs text-slate-500">{sub}</div></div>
      </div>
      <div className="text-2xl font-extrabold text-slate-900">{value}</div>
      <div className={`text-xs ${deltaColor} font-semibold mt-1`}>{delta}</div>
      <div className="progress mt-3" style={{ height: 4 }}><div className={`progress-fill ${barClass}`} style={{ width: barWidth }}></div></div>
    </div>
  );
}

function SegmentCardSimple({ icon, iconBg, title, sub, value, delta, deltaColor }) {
  return (
    <div className="glass-strong rounded-2xl p-5 card-hover cursor-pointer">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>{icon}</div>
        <div><div className="font-bold text-slate-900">{title}</div><div className="text-xs text-slate-500">{sub}</div></div>
      </div>
      <div className="text-2xl font-extrabold text-slate-900">{value}</div>
      <div className={`text-xs ${deltaColor} font-semibold mt-1`}>{delta}</div>
    </div>
  );
}

export default CRM;
