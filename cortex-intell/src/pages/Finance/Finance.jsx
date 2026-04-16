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
  TrendingUp, DollarSign, Wallet, ArrowDownToLine, ArrowUpFromLine,
  HeartPulse, BookOpen, Receipt, ShieldAlert, GitCompare, Landmark,
  CreditCard, PieChart, Activity, Sparkles, ChevronRight, Download,
  FileText, Plus, Filter, Check, Clock, AlertTriangle, History,
  FileLock2, FileCheck, Info, ArrowDown, ArrowUp, RefreshCw,
  HelpCircle, ScanLine, FolderOpen, Eye, MoreHorizontal,
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
const months6 = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];

const revExpChartData = {
  labels: months6,
  datasets: [
    { label: 'Revenue', data: [310, 340, 360, 380, 400, 392], backgroundColor: 'rgba(59,130,246,.7)', borderRadius: 6 },
    { label: 'Expenses', data: [240, 260, 270, 285, 295, 299], backgroundColor: 'rgba(239,68,68,.5)', borderRadius: 6 },
  ],
};

const cashFlowLineData = {
  labels: months6,
  datasets: [
    { label: 'Inflows', data: [680, 720, 780, 810, 850, 890], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.1)', tension: 0.4, fill: true },
    { label: 'Outflows', data: [520, 540, 580, 620, 650, 680], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,.08)', tension: 0.4, fill: true },
    { label: 'Net', data: [160, 180, 200, 190, 200, 210], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.08)', tension: 0.4, fill: true },
  ],
};

const forecastLineData = {
  labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
  datasets: [
    { label: 'Conservative', data: [400, 410, 420, 430, 440, 450], borderColor: '#94a3b8', borderDash: [5, 5], backgroundColor: 'transparent', tension: 0.4, pointRadius: 3 },
    { label: 'Base Case', data: [420, 440, 470, 500, 530, 560], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.1)', tension: 0.4, fill: true, pointRadius: 4 },
    { label: 'Optimistic', data: [440, 480, 530, 580, 640, 700], borderColor: '#10b981', borderDash: [5, 5], backgroundColor: 'transparent', tension: 0.4, pointRadius: 3 },
  ],
};

const expenseDonutData = {
  labels: ['Salaries', 'Infrastructure', 'Marketing', 'Operations', 'R&D', 'Other'],
  datasets: [{ data: [42, 18, 14, 12, 8, 6], backgroundColor: ['#3b82f6', '#6366f1', '#8b5cf6', '#22d3ee', '#f59e0b', '#cbd5e1'], borderWidth: 0 }],
};

const glTrendData = {
  labels: months6,
  datasets: [
    { label: 'Assets', data: [7800, 7950, 8100, 8200, 8350, 8420], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.08)', tension: 0.4, fill: true },
    { label: 'Liabilities', data: [2300, 2280, 2250, 2220, 2200, 2180], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,.05)', tension: 0.4, fill: true },
    { label: 'Equity', data: [5500, 5670, 5850, 5980, 6150, 6240], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.08)', tension: 0.4, fill: true },
  ],
};

const apScheduleData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    { label: 'Due', data: [120, 85, 145, 135], backgroundColor: 'rgba(239,68,68,.6)', borderRadius: 6 },
    { label: 'Paid', data: [120, 85, 92, 0], backgroundColor: 'rgba(16,185,129,.6)', borderRadius: 6 },
  ],
};

const arCollectionData = {
  labels: months6,
  datasets: [
    { label: 'Invoiced', data: [580, 620, 670, 710, 750, 682], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.1)', tension: 0.4, fill: true },
    { label: 'Collected', data: [540, 590, 640, 680, 720, 634], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.1)', tension: 0.4, fill: true },
  ],
};

const billingTypeDonutData = {
  labels: ['Recurring', 'Project-based', 'One-time'],
  datasets: [{ data: [47, 38, 15], backgroundColor: ['#6366f1', '#3b82f6', '#10b981'], borderWidth: 0 }],
};

const cashFlowBarData = {
  labels: months6,
  datasets: [
    { label: 'Revenue', data: [310, 340, 360, 380, 400, 392], backgroundColor: 'rgba(16,185,129,.7)', borderRadius: 6 },
    { label: 'Expenses', data: [240, 260, 270, 285, 295, 299], backgroundColor: 'rgba(239,68,68,.5)', borderRadius: 6 },
  ],
};

const reconTrendData = {
  labels: months6,
  datasets: [
    { label: 'Reconciled %', data: [88, 90, 91, 93, 94, 95.3], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.1)', tension: 0.4, fill: true, pointRadius: 4 },
    { label: 'Target', data: [90, 90, 90, 90, 90, 90], borderColor: '#94a3b8', borderDash: [5, 5], backgroundColor: 'transparent', tension: 0, pointRadius: 0 },
  ],
};

/* ============================================================
   STATIC DATA
   ============================================================ */
const vendorBills = [
  { id: 'BILL-2042', vendor: 'Amazon Web Services', category: 'Cloud', amount: '$18,400', due: 'Apr 28', status: 'Approved', stsBadge: 'badge-green' },
  { id: 'BILL-2041', vendor: 'WeWork', category: 'Office', amount: '$32,000', due: 'Apr 30', status: 'Approved', stsBadge: 'badge-green' },
  { id: 'BILL-2040', vendor: 'Datadog', category: 'Monitoring', amount: '$4,200', due: 'May 1', status: 'Pending', stsBadge: 'badge-yellow' },
  { id: 'BILL-2039', vendor: 'Adobe Creative Cloud', category: 'Design', amount: '$1,280', due: 'May 5', status: 'Pending', stsBadge: 'badge-yellow' },
  { id: 'BILL-2038', vendor: 'Figma', category: 'UI/UX', amount: '$840', due: 'May 5', status: 'Pending', stsBadge: 'badge-yellow' },
  { id: 'BILL-2037', vendor: 'Google Workspace', category: 'SaaS', amount: '$2,400', due: 'May 10', status: 'Draft', stsBadge: 'badge-blue' },
  { id: 'BILL-2036', vendor: 'Slack', category: 'Communication', amount: '$1,800', due: 'May 10', status: 'Draft', stsBadge: 'badge-blue' },
];

const invoiceRows = [
  { id: 'INV-2846', client: 'TechCorp Solutions', amount: '$84,200', type: 'Project', typeBadge: 'badge-blue', sent: 'Apr 14', status: 'Paid', stsBadge: 'badge-green' },
  { id: 'INV-2845', client: 'InnoVentures Ltd', amount: '$42,000', type: 'Recurring', typeBadge: 'badge-purple', sent: 'Apr 12', status: 'Pending', stsBadge: 'badge-yellow' },
  { id: 'INV-2844', client: 'DataFlow Inc', amount: '$28,500', type: 'Project', typeBadge: 'badge-blue', sent: 'Apr 10', status: 'Paid', stsBadge: 'badge-green' },
  { id: 'INV-2843', client: 'CloudNine Systems', amount: '$65,000', type: 'Recurring', typeBadge: 'badge-purple', sent: 'Apr 8', status: 'Pending', stsBadge: 'badge-yellow' },
  { id: 'INV-2842', client: 'Global Industries', amount: '$36,800', type: 'Project', typeBadge: 'badge-blue', sent: 'Apr 5', status: 'Overdue', stsBadge: 'badge-red' },
  { id: 'INV-2841', client: 'Alpha Partners', amount: '$18,400', type: 'One-time', typeBadge: 'badge-green', sent: 'Apr 3', status: 'Paid', stsBadge: 'badge-green' },
];

const anomalies = [
  { severity: 'high', icon: AlertTriangle, bg: 'bg-red-100 text-red-600', title: 'Marketing spend 34% above average', sub: 'Q2 ad campaigns · Detected by Finance Guardian', time: '2h ago' },
  { severity: 'medium', icon: AlertTriangle, bg: 'bg-yellow-100 text-yellow-600', title: 'Duplicate payment detected — Datadog', sub: 'BILL-2038 paid twice · $4,200 refund pending', time: '4h ago' },
  { severity: 'low', icon: Info, bg: 'bg-blue-100 text-blue-600', title: 'Unusual login from new IP', sub: 'Finance module accessed from 203.45.xx · Singapore', time: '6h ago' },
  { severity: 'medium', icon: AlertTriangle, bg: 'bg-yellow-100 text-yellow-600', title: 'Invoice INV-2842 overdue 18 days', sub: 'Global Industries · $36,800 · Auto-reminder sent', time: '1d ago' },
  { severity: 'low', icon: Info, bg: 'bg-blue-100 text-blue-600', title: 'Subscription price change detected', sub: 'AWS increased pricing by 8% starting May 1', time: '2d ago' },
];

const policies = [
  { title: 'Expense Approval Policy', sub: 'Auto-approve < $500 · Manager > $500 · CFO > $5K', status: 'Active', badge: 'badge-green' },
  { title: 'Invoice Payment Terms', sub: 'Net-30 default · Net-15 for preferred vendors', status: 'Active', badge: 'badge-green' },
  { title: 'Budget Overrun Alert', sub: 'Alert at 85% · Block at 100% department budget', status: 'Active', badge: 'badge-green' },
  { title: 'Data Access Controls', sub: 'Finance team only · SSO + MFA required', status: 'Active', badge: 'badge-green' },
  { title: 'Audit Trail Retention', sub: '7 years · Immutable · Encrypted at rest', status: 'Active', badge: 'badge-green' },
];

const auditLog = [
  { icon: Check, bg: 'bg-green-100 text-green-600', title: 'Invoice INV-2846 marked as paid', user: 'Elena R.', time: '2 min ago' },
  { icon: FileText, bg: 'bg-blue-100 text-blue-600', title: 'Journal entry JE-0542 posted', user: 'System', time: '15 min ago' },
  { icon: Eye, bg: 'bg-violet-100 text-violet-600', title: 'Payroll report exported', user: 'Priya P.', time: '1h ago' },
  { icon: AlertTriangle, bg: 'bg-yellow-100 text-yellow-600', title: 'Anomaly flagged — Marketing spend', user: 'AI Agent', time: '2h ago' },
  { icon: Check, bg: 'bg-green-100 text-green-600', title: 'BILL-2042 approved for payment', user: 'CFO', time: '3h ago' },
  { icon: GitCompare, bg: 'bg-cyan-100 text-cyan-600', title: '42 transactions auto-reconciled', user: 'AI Agent', time: '4h ago' },
];

const subModuleCards = [
  { tab: 'gl', icon: BookOpen, label: 'General Ledger', sub1: 'Assets: $8.42M', sub2: 'Equity: $6.24M', footer: 'Balanced', footerColor: 'text-green-600', bg: 'bg-blue-50/50', border: 'border-blue-100', iconBg: 'bg-blue-100 text-blue-600' },
  { tab: 'ap', icon: ArrowUpFromLine, label: 'Accounts Payable', sub1: 'Total: $485K', sub2: 'Paid MTD: $298K', footer: '7 pending approval', footerColor: 'text-yellow-600', bg: 'bg-red-50/50', border: 'border-red-100', iconBg: 'bg-red-100 text-red-600' },
  { tab: 'ar', icon: ArrowDownToLine, label: 'Accounts Receivable', sub1: 'Outstanding: $682K', sub2: 'Collected MTD: $412K', footer: '$48K overdue', footerColor: 'text-yellow-600', bg: 'bg-green-50/50', border: 'border-green-100', iconBg: 'bg-green-100 text-green-600' },
  { tab: 'invoicing', icon: Receipt, label: 'Invoicing & Billing', sub1: 'Sent MTD: 34', sub2: 'Recurring: $420K', footer: '+12.5% billed', footerColor: 'text-green-600', bg: 'bg-indigo-50/50', border: 'border-indigo-100', iconBg: 'bg-indigo-100 text-indigo-600' },
  { tab: 'cashflow', icon: Wallet, label: 'Cash Flow', sub1: 'Inflow: $890K', sub2: 'Outflow: $680K', footer: 'Net +$210K', footerColor: 'text-green-600', bg: 'bg-sky-50/50', border: 'border-sky-100', iconBg: 'bg-sky-100 text-sky-600' },
  { tab: 'forecast', icon: TrendingUp, label: 'Forecasting', sub1: '6M Forecast: $6.2M', sub2: 'Budget Used: 72%', footer: '91% confidence', footerColor: 'text-green-600', bg: 'bg-violet-50/50', border: 'border-violet-100', iconBg: 'bg-violet-100 text-violet-600' },
  { tab: 'risk', icon: ShieldAlert, label: 'Risk & Controls', sub1: 'Compliance: 96/100', sub2: 'Anomalies: 14', footer: '3 need review', footerColor: 'text-yellow-600', bg: 'bg-orange-50/50', border: 'border-orange-100', iconBg: 'bg-orange-100 text-orange-600' },
  { tab: 'recon', icon: GitCompare, label: 'Reconciliation', sub1: 'Reconciled: 95.3%', sub2: 'Auto-matched: 847', footer: '2 unmatched', footerColor: 'text-yellow-600', bg: 'bg-cyan-50/50', border: 'border-cyan-100', iconBg: 'bg-cyan-100 text-cyan-600' },
];

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
function Finance() {
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
            <span className="text-blue-600 font-semibold">Finance Operating System</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Cortex Intell Finance OS</h1>
          <p className="text-slate-500">Complete Financial Management -- Ledger, Payables, Receivables, Billing, Cash Flow, Forecasting, Risk, Reconciliation.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline"><FileText className="w-4 h-4" /> Reports</button>
          <button className="btn-outline"><Download className="w-4 h-4" /> Export</button>
          <button className="btn-primary"><Plus className="w-4 h-4" /> New Invoice</button>
        </div>
      </section>

      {/* HERO */}
      <section className="services-hero animate-fade-in-up mb-5">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge badge-blue">OPERATING SYSTEM</span>
            <span className="badge badge-purple">8 SUB-MODULES</span>
          </div>
          <h2 className="text-3xl font-extrabold mb-2">Cortex Intell Finance Operating System</h2>
          <p className="text-white/80 max-w-3xl">Everything finance in one place -- General Ledger, Payables, Receivables, Invoicing, Cash Flow, Forecasting, Risk Controls and Reconciliation. All orchestrated by Cortex Brain.</p>
        </div>
      </section>

      {/* AI Copilot */}
      <section className="mb-6">
        <div className="glass-blue rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute w-48 h-48 bg-white rounded-full blur-3xl -top-20 -right-20 animate-blob"></div>
          </div>
          <div className="relative z-10 w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="relative z-10 flex-1">
            <div className="font-bold text-white">AI Finance Copilot</div>
            <div className="text-white/90 text-sm">3 vendors offer 2% early payment discounts. DSO trending up to 38 days. Professional tax filing is 3 days overdue.</div>
          </div>
          <button className="relative z-10 bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold text-sm hover:scale-105 transition">Review Insights</button>
        </div>
      </section>

      {/* TAB PANELS */}
      {activeTab === 'dashboard' && <DashboardPanel switchTab={switchTab} />}
      {activeTab === 'gl' && <GLPanel />}
      {activeTab === 'ap' && <APPanel />}
      {activeTab === 'ar' && <ARPanel />}
      {activeTab === 'invoicing' && <InvoicingPanel />}
      {activeTab === 'cashflow' && <CashFlowPanel />}
      {activeTab === 'forecast' && <ForecastPanel />}
      {activeTab === 'risk' && <RiskPanel />}
      {activeTab === 'recon' && <ReconPanel />}
    </div>
  );
}

/* ============================================================
   KPI CARD
   ============================================================ */
function KpiCard({ label, value, delta, deltaColor = 'text-green-600', icon, bg, text }) {
  return (
    <div className="kpi-card card-hover animate-fade-in-up">
      <div className="flex items-start justify-between mb-2">
        <span className="text-[10px] font-bold text-slate-500 tracking-wider">{label}</span>
        <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center`}>{icon}</div>
      </div>
      <div className="text-2xl font-extrabold text-slate-900">{value}</div>
      <div className={`text-xs ${deltaColor} font-semibold mt-1`}>{delta}</div>
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

/* ============================================================
   DASHBOARD PANEL
   ============================================================ */
function DashboardPanel({ switchTab }) {
  return (
    <div className="fos-panel active" id="panel-dashboard">
      {/* KPIs */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-5">
        <KpiCard label="TOTAL REVENUE" value="$3.92M" delta="+12.5% vs last month" icon={<DollarSign className="w-3.5 h-3.5 text-blue-600" />} bg="bg-blue-100" />
        <KpiCard label="NET PROFIT" value="$932K" delta="23.8% margin" icon={<TrendingUp className="w-3.5 h-3.5 text-green-600" />} bg="bg-green-100" />
        <KpiCard label="CASH POSITION" value="$2.47M" delta="18 mo runway" icon={<Wallet className="w-3.5 h-3.5 text-sky-600" />} bg="bg-sky-100" />
        <KpiCard label="RECEIVABLES" value="$682K" delta="$48K overdue" deltaColor="text-yellow-600" icon={<ArrowDownToLine className="w-3.5 h-3.5 text-green-600" />} bg="bg-green-100" />
        <KpiCard label="PAYABLES" value="$485K" delta="DPO 42 days" deltaColor="text-slate-500" icon={<ArrowUpFromLine className="w-3.5 h-3.5 text-red-600" />} bg="bg-red-100" />
        <KpiCard label="HEALTH SCORE" value="92/100" delta="Excellent" icon={<HeartPulse className="w-3.5 h-3.5 text-violet-600" />} bg="bg-violet-100" />
      </section>

      {/* Revenue vs Expenses + P&L */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="glass-strong rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Revenue vs Expenses (6 Months)</h3>
            <span className="badge badge-green">+12.5%</span>
          </div>
          <div style={{ height: 280 }}>
            <Bar data={revExpChartData} options={{
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { position: 'bottom' } },
              scales: { y: { grid: { color: '#f1f5f9' }, ticks: { callback: (v) => '$' + v + 'K' } }, x: { grid: { display: false } } },
            }} />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Profit & Loss Snapshot</h3>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 rounded-xl">
              <div className="text-[10px] font-bold text-green-700 tracking-wider">REVENUE</div>
              <div className="text-xl font-extrabold text-green-700 mt-1">$3,920,000</div>
              <div className="text-xs text-green-600">+12.5% YoY</div>
            </div>
            <div className="p-3 bg-red-50 rounded-xl">
              <div className="text-[10px] font-bold text-red-700 tracking-wider">EXPENSES</div>
              <div className="text-xl font-extrabold text-red-700 mt-1">$2,988,000</div>
              <div className="text-xs text-red-600">+8.2% YoY</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border-2 border-blue-200">
              <div className="text-[10px] font-bold text-blue-700 tracking-wider">NET PROFIT</div>
              <div className="text-xl font-extrabold text-blue-700 mt-1">$932,000</div>
              <div className="text-xs text-blue-600">23.8% margin</div>
            </div>
            <div className="p-3 bg-violet-50 rounded-xl">
              <div className="text-[10px] font-bold text-violet-700 tracking-wider">EBITDA</div>
              <div className="text-xl font-extrabold text-violet-700 mt-1">$1,180,000</div>
              <div className="text-xs text-violet-600">30.1% margin</div>
            </div>
          </div>
        </div>
      </section>

      {/* Cash Flow + Forecast */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Wallet className="w-4 h-4 text-sky-600" /> Cash Flow (6 Months)</h3>
          <div style={{ height: 240 }}>
            <Line data={cashFlowLineData} options={lineDefaults((v) => '$' + v + 'K')} />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-violet-600" /> AI Revenue Forecast</h3>
          <div style={{ height: 240 }}>
            <Line data={forecastLineData} options={lineDefaults((v) => '$' + v + 'K')} />
          </div>
        </div>
      </section>

      {/* Expense Donut */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* AR Aging */}
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><ArrowDownToLine className="w-4 h-4 text-green-600" /> AR Aging</h3>
          <div className="space-y-2">
            <AgingRow label="Current" value="$512K" width="75%" color="#10b981" />
            <AgingRow label="31-60d" value="$122K" width="18%" color="#3b82f6" />
            <AgingRow label="61-90d" value="$32K" width="5%" color="#f59e0b" />
            <AgingRow label="90+ d" value="$16K" width="2%" color="#ef4444" red />
          </div>
          <div className="mt-3 text-xs text-slate-500">DSO: <span className="font-bold text-slate-900">38 days</span> -- Collection rate: <span className="font-bold text-green-600">94.2%</span></div>
        </div>
        {/* AP Aging */}
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><ArrowUpFromLine className="w-4 h-4 text-red-600" /> AP Aging</h3>
          <div className="space-y-2">
            <AgingRow label="Current" value="$312K" width="64%" color="#10b981" />
            <AgingRow label="31-60d" value="$98K" width="20%" color="#3b82f6" />
            <AgingRow label="61-90d" value="$52K" width="11%" color="#f59e0b" />
            <AgingRow label="90+ d" value="$23K" width="5%" color="#ef4444" red />
          </div>
          <div className="mt-3 text-xs text-slate-500">DPO: <span className="font-bold text-slate-900">42 days</span> -- 7 pending approval</div>
        </div>
        {/* Expense Breakdown */}
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Expense Breakdown</h3>
          <div style={{ height: 200 }}>
            <Doughnut data={expenseDonutData} options={doughnutDefaults} />
          </div>
        </div>
      </section>

      {/* Bank Accounts + Budget */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Landmark className="w-4 h-4 text-blue-600" /> Bank Accounts</h3>
          <div className="space-y-3">
            <BankRow name="HDFC Operating" sub="Primary -- 98% reconciled" balance="$1,820,000" delta="+$68K today" deltaColor="text-green-600" icon={<Landmark className="w-5 h-5" />} bg="bg-blue-50" iconBg="bg-blue-100 text-blue-600" />
            <BankRow name="ICICI Payroll" sub="Payroll -- 88% reconciled" balance="$420,000" delta="2 unmatched" deltaColor="text-yellow-600" icon={<Landmark className="w-5 h-5" />} bg="bg-violet-50" iconBg="bg-violet-100 text-violet-600" />
            <BankRow name="Stripe USD" sub="Online payments -- 100% reconciled" balance="$230,000" delta="+$12K today" deltaColor="text-green-600" icon={<CreditCard className="w-5 h-5" />} bg="bg-sky-50" iconBg="bg-sky-100 text-sky-600" />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><PieChart className="w-4 h-4 text-violet-600" /> Budget Utilization by Department</h3>
          <div className="space-y-3">
            <BudgetRow dept="Engineering" spent="$320K" total="$400K" pct={80} />
            <BudgetRow dept="Marketing" spent="$185K" total="$200K" pct={93} warn />
            <BudgetRow dept="Sales" spent="$142K" total="$220K" pct={65} />
            <BudgetRow dept="Operations" spent="$98K" total="$150K" pct={65} />
            <BudgetRow dept="HR & Admin" spent="$72K" total="$100K" pct={72} />
          </div>
          <div className="mt-3 p-2 bg-blue-50 rounded-lg text-xs text-slate-600 flex items-center gap-2"><Info className="w-3 h-3 text-blue-600" />Overall: 72% utilized -- $253K remaining</div>
        </div>
      </section>

      {/* Sub-Module Status Cards */}
      <section className="glass-strong rounded-2xl p-6 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900">Sub-Module Status</h3>
          <span className="text-xs text-slate-500">Click any card to open sub-module</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {subModuleCards.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.tab} className={`p-4 rounded-xl ${m.bg} border ${m.border} cursor-pointer hover:shadow-md transition`} onClick={() => switchTab(m.tab)}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg ${m.iconBg} flex items-center justify-center`}><Icon className="w-4 h-4" /></div>
                  <span className="font-bold text-sm text-slate-900">{m.label}</span>
                </div>
                <div className="text-xs text-slate-500">{m.sub1}</div>
                <div className="text-xs text-slate-500">{m.sub2}</div>
                <div className={`text-[10px] ${m.footerColor} font-semibold mt-1`}>{m.footer}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Activity + AI Insights */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><Activity className="w-4 h-4 text-blue-600" /> Recent Financial Activity</h3>
            <span className="badge badge-green"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Live</span>
          </div>
          <div className="space-y-2">
            <ActivityRow icon={<Check className="w-4 h-4" />} bg="bg-green-100 text-green-600" title="INV-2846 Paid" sub="TechCorp -- $84,200" time="2m ago" />
            <ActivityRow icon={<FileText className="w-4 h-4" />} bg="bg-blue-100 text-blue-600" title="Invoice Created" sub="INV-2847 -- DataFlow -- $42K" time="15m ago" />
            <ActivityRow icon={<GitCompare className="w-4 h-4" />} bg="bg-violet-100 text-violet-600" title="42 txns reconciled" sub="Auto-matched by AI" time="1h ago" />
            <ActivityRow icon={<AlertTriangle className="w-4 h-4" />} bg="bg-yellow-100 text-yellow-600" title="Anomaly detected" sub="Marketing spend 34% above avg" time="2h ago" />
            <ActivityRow icon={<Clock className="w-4 h-4" />} bg="bg-red-100 text-red-600" title="Bill BILL-2038 approved" sub="Datadog -- $4,200" time="3h ago" />
            <ActivityRow icon={<Check className="w-4 h-4" />} bg="bg-green-100 text-green-600" title="Payroll processed" sub="April batch -- 142 employees" time="Yesterday" />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-violet-600" /> AI Financial Insights</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
              <div className="text-[10px] font-bold text-green-700 tracking-wider mb-1">OPPORTUNITY</div>
              <div className="text-sm font-bold text-slate-900">Early payment discounts available</div>
              <div className="text-xs text-slate-600 mt-1">3 vendors offer 2% discount for Net-10. Potential savings: $8,400/month.</div>
              <button className="text-xs text-blue-600 font-semibold mt-2">Review Vendors</button>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200">
              <div className="text-[10px] font-bold text-yellow-700 tracking-wider mb-1">WARNING</div>
              <div className="text-sm font-bold text-slate-900">DSO trending upward</div>
              <div className="text-xs text-slate-600 mt-1">Days Sales Outstanding increased from 30 to 38 days over 3 months. Auto-reminders at day 15 could improve by 8 days.</div>
              <button className="text-xs text-blue-600 font-semibold mt-2">Enable Auto-Reminders</button>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-pink-50 border border-red-200">
              <div className="text-[10px] font-bold text-red-700 tracking-wider mb-1">ALERT</div>
              <div className="text-sm font-bold text-slate-900">Professional Tax filing overdue</div>
              <div className="text-xs text-slate-600 mt-1">3 days overdue. Penalty risk: $2,400. File immediately to avoid escalation.</div>
              <button className="text-xs text-blue-600 font-semibold mt-2">File Now</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   GL PANEL
   ============================================================ */
function GLPanel() {
  return (
    <div className="fos-panel active" id="panel-gl">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <KpiCard label="TOTAL ASSETS" value="$8.42M" delta="+$420K this quarter" icon={<DollarSign className="w-3.5 h-3.5 text-blue-600" />} bg="bg-blue-100" />
        <KpiCard label="LIABILITIES" value="$2.18M" delta="Debt ratio 26%" deltaColor="text-slate-500" icon={<ArrowUpFromLine className="w-3.5 h-3.5 text-red-600" />} bg="bg-red-100" />
        <KpiCard label="EQUITY" value="$6.24M" delta="Growing steadily" icon={<TrendingUp className="w-3.5 h-3.5 text-green-600" />} bg="bg-green-100" />
        <KpiCard label="HEALTH SCORE" value="92/100" delta="Excellent" icon={<HeartPulse className="w-3.5 h-3.5 text-violet-600" />} bg="bg-violet-100" />
      </section>

      {/* Trial Balance */}
      <section className="mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4 overflow-x-auto">
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold whitespace-nowrap">Trial Balance</button>
            <button className="px-4 py-2 rounded-lg hover:bg-blue-50 text-slate-600 text-sm font-semibold whitespace-nowrap">Profit & Loss</button>
            <button className="px-4 py-2 rounded-lg hover:bg-blue-50 text-slate-600 text-sm font-semibold whitespace-nowrap">Balance Sheet</button>
            <button className="px-4 py-2 rounded-lg hover:bg-blue-50 text-slate-600 text-sm font-semibold whitespace-nowrap">Cash Flow Statement</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-bold text-slate-500 tracking-wider mb-3">DEBITS</h4>
              <div className="space-y-2">
                <div className="flex justify-between p-3 bg-blue-50 rounded-lg"><span className="text-sm">Cash & Bank</span><span className="font-bold">$2,470,000</span></div>
                <div className="flex justify-between p-3 bg-blue-50 rounded-lg"><span className="text-sm">Accounts Receivable</span><span className="font-bold">$682,000</span></div>
                <div className="flex justify-between p-3 bg-blue-50 rounded-lg"><span className="text-sm">Inventory</span><span className="font-bold">$312,000</span></div>
                <div className="flex justify-between p-3 bg-blue-50 rounded-lg"><span className="text-sm">Fixed Assets</span><span className="font-bold">$4,958,000</span></div>
                <div className="flex justify-between p-3 bg-slate-100 rounded-lg font-bold"><span className="text-sm">Total</span><span>$8,422,000</span></div>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-500 tracking-wider mb-3">CREDITS</h4>
              <div className="space-y-2">
                <div className="flex justify-between p-3 bg-violet-50 rounded-lg"><span className="text-sm">Accounts Payable</span><span className="font-bold">$485,000</span></div>
                <div className="flex justify-between p-3 bg-violet-50 rounded-lg"><span className="text-sm">Loans & Borrowings</span><span className="font-bold">$1,200,000</span></div>
                <div className="flex justify-between p-3 bg-violet-50 rounded-lg"><span className="text-sm">Equity</span><span className="font-bold">$5,237,000</span></div>
                <div className="flex justify-between p-3 bg-violet-50 rounded-lg"><span className="text-sm">Retained Earnings</span><span className="font-bold">$1,500,000</span></div>
                <div className="flex justify-between p-3 bg-slate-100 rounded-lg font-bold"><span className="text-sm">Total</span><span>$8,422,000</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journal Entries + Chart of Accounts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="glass-strong rounded-2xl overflow-hidden lg:col-span-2">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Recent Journal Entries</h3>
            <button className="btn-outline text-xs"><Plus className="w-4 h-4" /> Entry</button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>ID</th><th>Date</th><th>Description</th><th>Debit</th><th>Credit</th><th>Status</th></tr></thead>
              <tbody>
                {CORTEX_DATA.journalEntries.map((j) => (
                  <tr key={j.id} className="clickable">
                    <td className="font-mono text-blue-600 font-semibold">{j.id}</td>
                    <td className="text-slate-500">{j.date}</td>
                    <td className="font-semibold">{j.desc}</td>
                    <td className="font-bold">{j.debit}</td>
                    <td className="font-bold">{j.credit}</td>
                    <td><span className={`badge ${j.status === 'Posted' ? 'badge-green' : 'badge-yellow'}`}>{j.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Chart of Accounts</h3>
          <div className="space-y-2 text-sm">
            <div className="font-bold text-blue-700 flex items-center gap-2"><FolderOpen className="w-4 h-4" /> Assets</div>
            <div className="pl-6 text-slate-600">Current Assets</div>
            <div className="pl-10 text-slate-500">Cash ($2.47M)</div>
            <div className="pl-10 text-slate-500">AR ($682K)</div>
            <div className="pl-10 text-slate-500">Inventory ($312K)</div>
            <div className="pl-6 text-slate-600">Fixed Assets ($4.96M)</div>
            <div className="font-bold text-violet-700 flex items-center gap-2 mt-3"><FolderOpen className="w-4 h-4" /> Liabilities</div>
            <div className="pl-6 text-slate-600">Current Liabilities</div>
            <div className="pl-10 text-slate-500">AP ($485K)</div>
            <div className="pl-6 text-slate-600">Long-term Debt ($1.2M)</div>
            <div className="font-bold text-green-700 flex items-center gap-2 mt-3"><FolderOpen className="w-4 h-4" /> Equity</div>
            <div className="pl-6 text-slate-600">Share Capital ($5.24M)</div>
            <div className="pl-6 text-slate-600">Retained ($1.5M)</div>
          </div>
        </div>
      </section>

      {/* GL Trend */}
      <section className="glass-strong rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-slate-900 mb-4">GL Balance Trend (6 Months)</h3>
        <div style={{ height: 260 }}>
          <Line data={glTrendData} options={lineDefaults((v) => '$' + (v / 1000).toFixed(1) + 'M')} />
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   AP PANEL
   ============================================================ */
function APPanel() {
  return (
    <div className="fos-panel active" id="panel-ap">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <KpiCard label="TOTAL PAYABLES" value="$485K" delta="Due this month" deltaColor="text-slate-500" icon={<ArrowUpFromLine className="w-3.5 h-3.5 text-red-600" />} bg="bg-red-100" />
        <KpiCard label="DPO (DAYS PAYABLE)" value="42 days" delta="Healthy range" icon={<Clock className="w-3.5 h-3.5 text-blue-600" />} bg="bg-blue-100" />
        <KpiCard label="PAID (MTD)" value="$298K" delta="18 bills processed" deltaColor="text-slate-500" icon={<Check className="w-3.5 h-3.5 text-green-600" />} bg="bg-green-100" />
        <KpiCard label="PENDING APPROVAL" value="7" delta="Needs review" deltaColor="text-yellow-600" icon={<AlertTriangle className="w-3.5 h-3.5 text-yellow-600" />} bg="bg-yellow-100" />
      </section>

      {/* Vendor Bills */}
      <section className="glass-strong rounded-2xl overflow-hidden mb-6">
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900">Vendor Bills</h3>
            <p className="text-xs text-slate-500">Track and manage all supplier invoices and payments</p>
          </div>
          <button className="btn-primary text-xs"><Plus className="w-4 h-4" /> Add Bill</button>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Bill #</th><th>Vendor</th><th>Category</th><th>Amount</th><th>Due Date</th><th>Status</th></tr></thead>
            <tbody>
              {vendorBills.map((b) => (
                <tr key={b.id} className="clickable">
                  <td className="font-mono text-blue-600 font-semibold">{b.id}</td>
                  <td className="font-semibold">{b.vendor}</td>
                  <td className="text-slate-500">{b.category}</td>
                  <td className="font-bold">{b.amount}</td>
                  <td className="text-slate-500">{b.due}</td>
                  <td><span className={`badge ${b.stsBadge}`}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* AP Aging + Top Vendors */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">AP Aging Summary</h3>
          <div className="space-y-3">
            <AgingRow label="Current (0-30 days)" value="$312K" width="64%" color="#10b981" />
            <AgingRow label="31-60 days" value="$98K" width="20%" color="#3b82f6" />
            <AgingRow label="61-90 days" value="$52K" width="11%" color="#f59e0b" />
            <AgingRow label="90+ days" value="$23K" width="5%" color="#ef4444" red />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Top Vendors by Spend</h3>
          <div className="space-y-3">
            <VendorRow avatar="AW" bg="bg-blue-200 text-blue-700" name="Amazon Web Services" sub="Cloud Infrastructure" spend="$18,400/mo" />
            <VendorRow avatar="WW" bg="bg-violet-200 text-violet-700" name="WeWork" sub="Office Space" spend="$32,000/mo" />
            <VendorRow avatar="DD" bg="bg-indigo-200 text-indigo-700" name="Datadog" sub="Monitoring & Observability" spend="$4,200/mo" />
            <VendorRow avatar="AD" bg="bg-pink-200 text-pink-700" name="Adobe Creative Cloud" sub="Design Tools" spend="$1,280/mo" />
            <VendorRow avatar="FG" bg="bg-green-200 text-green-700" name="Figma" sub="UI/UX Design" spend="$840/mo" />
          </div>
        </div>
      </section>

      {/* AP Schedule */}
      <section className="glass-strong rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-slate-900 mb-4">Payment Schedule (Next 30 Days)</h3>
        <div style={{ height: 240 }}>
          <Bar data={apScheduleData} options={{
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } },
            scales: { y: { grid: { color: '#f1f5f9' }, ticks: { callback: (v) => '$' + v + 'K' } }, x: { grid: { display: false } } },
          }} />
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   AR PANEL
   ============================================================ */
function ARPanel() {
  return (
    <div className="fos-panel active" id="panel-ar">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <KpiCard label="TOTAL RECEIVABLES" value="$682K" delta="$48K overdue" deltaColor="text-yellow-600" icon={<ArrowDownToLine className="w-3.5 h-3.5 text-green-600" />} bg="bg-green-100" />
        <KpiCard label="DSO" value="38 days" delta="Target: 30 days" deltaColor="text-slate-500" icon={<Clock className="w-3.5 h-3.5 text-blue-600" />} bg="bg-blue-100" />
        <KpiCard label="COLLECTED (MTD)" value="$412K" delta="+14% vs last month" icon={<Check className="w-3.5 h-3.5 text-green-600" />} bg="bg-green-100" />
        <KpiCard label="COLLECTION RATE" value="94.2%" delta="Above target" icon={<TrendingUp className="w-3.5 h-3.5 text-violet-600" />} bg="bg-violet-100" />
      </section>

      {/* Invoices Table */}
      <section className="glass-strong rounded-2xl overflow-hidden mb-6">
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900">Outstanding Invoices</h3>
            <p className="text-xs text-slate-500">6 invoices -- $385K total outstanding</p>
          </div>
          <button className="btn-primary text-xs">Send Reminders</button>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Invoice</th><th>Client</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {CORTEX_DATA.invoices.map((inv) => (
                <tr key={inv.id} className="clickable">
                  <td className="font-mono text-blue-600 font-semibold">{inv.id}</td>
                  <td className="font-semibold">{inv.client}</td>
                  <td className="font-bold">{inv.amount}</td>
                  <td className="text-slate-500">{inv.date}</td>
                  <td><span className={`badge ${inv.status === 'Paid' ? 'badge-green' : inv.status === 'Overdue' ? 'badge-red' : 'badge-yellow'}`}>{inv.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* AR Aging + Collection Trend */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">AR Aging Analysis</h3>
          <div className="space-y-3">
            <AgingRow label="Current (0-30)" value="$512K" width="75%" color="#10b981" />
            <AgingRow label="31-60 days" value="$122K" width="18%" color="#3b82f6" />
            <AgingRow label="61-90 days" value="$32K" width="5%" color="#f59e0b" />
            <AgingRow label="90+ days" value="$16K" width="2%" color="#ef4444" red />
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-xl flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-xs text-slate-600"><span className="font-bold text-blue-700">AI Insight:</span> DSO could improve to 30 days by sending automated reminders at day 15. Estimated impact: +$42K cash/month.</div>
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Collection Trend</h3>
          <div style={{ height: 240 }}>
            <Line data={arCollectionData} options={lineDefaults((v) => '$' + v + 'K')} />
          </div>
        </div>
      </section>

      {/* Top Debtors */}
      <section className="glass-strong rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-slate-900 mb-4">Top Accounts -- Outstanding Balances</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white">
            <div className="font-bold text-sm">TechCorp Solutions</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">$142K</div>
            <div className="text-xs text-slate-500 mt-1">3 invoices -- DSO 24 days</div>
            <span className="badge badge-green mt-2">Good standing</span>
          </div>
          <div className="p-4 rounded-xl border border-yellow-100 bg-gradient-to-br from-yellow-50 to-white">
            <div className="font-bold text-sm">InnoVentures Ltd</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">$89K</div>
            <div className="text-xs text-slate-500 mt-1">2 invoices -- DSO 42 days</div>
            <span className="badge badge-yellow mt-2">Slow payer</span>
          </div>
          <div className="p-4 rounded-xl border border-red-100 bg-gradient-to-br from-red-50 to-white">
            <div className="font-bold text-sm">Global Industries</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">$48K</div>
            <div className="text-xs text-slate-500 mt-1">1 invoice -- 92 days overdue</div>
            <span className="badge badge-red mt-2">At risk</span>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   INVOICING PANEL
   ============================================================ */
function InvoicingPanel() {
  return (
    <div className="fos-panel active" id="panel-invoicing">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <KpiCard label="INVOICES SENT (MTD)" value="34" delta="+8 vs last month" icon={<Receipt className="w-3.5 h-3.5 text-indigo-600" />} bg="bg-indigo-100" />
        <KpiCard label="TOTAL BILLED" value="$890K" delta="+12.5%" icon={<DollarSign className="w-3.5 h-3.5 text-blue-600" />} bg="bg-blue-100" />
        <KpiCard label="RECURRING REVENUE" value="$420K" delta="47% of total" deltaColor="text-slate-500" icon={<RefreshCw className="w-3.5 h-3.5 text-violet-600" />} bg="bg-violet-100" />
        <KpiCard label="AVG PAYMENT TIME" value="12 days" delta="Improving" icon={<Clock className="w-3.5 h-3.5 text-green-600" />} bg="bg-green-100" />
      </section>

      {/* Smart Invoicing Banner */}
      <section className="glass-blue rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden mb-6">
        <div className="absolute inset-0 opacity-20"><div className="absolute w-48 h-48 bg-white rounded-full blur-3xl -top-20 -right-20 animate-blob"></div></div>
        <div className="relative z-10 w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center"><Plus className="w-6 h-6 text-white" /></div>
        <div className="relative z-10 flex-1">
          <div className="font-bold text-white">Smart Invoicing</div>
          <div className="text-white/90 text-sm">Create professional invoices in seconds. Auto-populate from CRM deals, apply templates, and send via email or WhatsApp.</div>
        </div>
        <button className="relative z-10 bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold text-sm hover:scale-105 transition">Create Invoice</button>
      </section>

      {/* Recent Invoices */}
      <section className="glass-strong rounded-2xl overflow-hidden mb-6">
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <h3 className="font-bold text-slate-900">Recent Invoices</h3>
          <div className="flex gap-2">
            <button className="btn-outline text-xs">Templates</button>
            <button className="btn-outline text-xs">Recurring Setup</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Invoice #</th><th>Client</th><th>Amount</th><th>Type</th><th>Sent</th><th>Status</th></tr></thead>
            <tbody>
              {invoiceRows.map((inv) => (
                <tr key={inv.id} className="clickable">
                  <td className="font-semibold text-blue-600">{inv.id}</td>
                  <td>{inv.client}</td>
                  <td className="font-bold">{inv.amount}</td>
                  <td><span className={`badge ${inv.typeBadge}`}>{inv.type}</span></td>
                  <td className="text-slate-500">{inv.sent}</td>
                  <td><span className={`badge ${inv.stsBadge}`}>{inv.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recurring + Billing Type */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Recurring Billing Schedule</h3>
          <div className="space-y-3">
            <BankRow name="InnoVentures -- SaaS License" sub="Monthly -- Next: May 1" balance="$42,000" icon={<RefreshCw className="w-5 h-5" />} bg="bg-blue-50" iconBg="bg-blue-100 text-blue-600" />
            <BankRow name="CloudNine -- Enterprise Plan" sub="Monthly -- Next: May 1" balance="$65,000" icon={<RefreshCw className="w-5 h-5" />} bg="bg-violet-50" iconBg="bg-violet-100 text-violet-600" />
            <BankRow name="DataFlow -- API Usage" sub="Monthly -- Next: May 5" balance="$12,400" icon={<RefreshCw className="w-5 h-5" />} bg="bg-green-50" iconBg="bg-green-100 text-green-600" />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Revenue by Billing Type</h3>
          <div style={{ height: 240 }}>
            <Doughnut data={billingTypeDonutData} options={doughnutDefaults} />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   CASH FLOW PANEL
   ============================================================ */
function CashFlowPanel() {
  return (
    <div className="fos-panel active" id="panel-cashflow">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <KpiCard label="CASH POSITION" value="$2.47M" delta="+5.6% this month" icon={<Wallet className="w-3.5 h-3.5 text-sky-600" />} bg="bg-sky-100" />
        <KpiCard label="MONTHLY INFLOW" value="$890K" delta="+12.5%" icon={<ArrowDown className="w-3.5 h-3.5 text-green-600" />} bg="bg-green-100" />
        <KpiCard label="MONTHLY OUTFLOW" value="$680K" delta="Burn rate stable" deltaColor="text-slate-500" icon={<ArrowUp className="w-3.5 h-3.5 text-red-600" />} bg="bg-red-100" />
        <KpiCard label="RUNWAY" value="18 mo" delta="Comfortable" icon={<TrendingUp className="w-3.5 h-3.5 text-violet-600" />} bg="bg-violet-100" />
      </section>

      {/* Cash Flow Bar Chart */}
      <section className="glass-strong rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-slate-900 mb-4">Cash Flow -- Revenue vs Expenses</h3>
        <div style={{ height: 300 }}>
          <Bar data={cashFlowBarData} options={{
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } },
            scales: { y: { grid: { color: '#f1f5f9' }, ticks: { callback: (v) => '$' + v + 'K' } }, x: { grid: { display: false } } },
          }} />
        </div>
      </section>

      {/* Bank Accounts */}
      <section className="glass-strong rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-slate-900 mb-4">Bank Accounts Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-center gap-2 mb-2"><Landmark className="w-4 h-4 text-blue-600" /><span className="font-bold text-sm">HDFC Operating</span></div>
            <div className="text-2xl font-extrabold text-slate-900">$1,820,000</div>
            <div className="text-xs text-green-600 font-semibold mt-1">Primary account -- +$68K today</div>
          </div>
          <div className="p-4 rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white">
            <div className="flex items-center gap-2 mb-2"><Landmark className="w-4 h-4 text-violet-600" /><span className="font-bold text-sm">ICICI Payroll</span></div>
            <div className="text-2xl font-extrabold text-slate-900">$420,000</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">Payroll -- Next run Apr 28</div>
          </div>
          <div className="p-4 rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white">
            <div className="flex items-center gap-2 mb-2"><CreditCard className="w-4 h-4 text-sky-600" /><span className="font-bold text-sm">Stripe USD</span></div>
            <div className="text-2xl font-extrabold text-slate-900">$230,000</div>
            <div className="text-xs text-green-600 font-semibold mt-1">Online payments -- +$12K today</div>
          </div>
        </div>
      </section>

      {/* Cash Position */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><ArrowDown className="w-4 h-4 text-green-600" /> Cash Inflows (This Month)</h3>
          <div className="space-y-2">
            <div className="flex justify-between p-3 bg-green-50 rounded-lg"><span className="text-sm">Client Payments</span><span className="font-bold text-green-700">$612,000</span></div>
            <div className="flex justify-between p-3 bg-green-50 rounded-lg"><span className="text-sm">Recurring Subscriptions</span><span className="font-bold text-green-700">$185,000</span></div>
            <div className="flex justify-between p-3 bg-green-50 rounded-lg"><span className="text-sm">Interest Income</span><span className="font-bold text-green-700">$8,200</span></div>
            <div className="flex justify-between p-3 bg-green-50 rounded-lg"><span className="text-sm">Refunds Received</span><span className="font-bold text-green-700">$4,800</span></div>
            <div className="flex justify-between p-3 bg-green-100 rounded-lg font-bold"><span className="text-sm">Total Inflows</span><span className="text-green-800">$810,000</span></div>
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><ArrowUp className="w-4 h-4 text-red-600" /> Cash Outflows (This Month)</h3>
          <div className="space-y-2">
            <div className="flex justify-between p-3 bg-red-50 rounded-lg"><span className="text-sm">Salaries & Benefits</span><span className="font-bold text-red-700">$420,000</span></div>
            <div className="flex justify-between p-3 bg-red-50 rounded-lg"><span className="text-sm">Infrastructure & SaaS</span><span className="font-bold text-red-700">$120,000</span></div>
            <div className="flex justify-between p-3 bg-red-50 rounded-lg"><span className="text-sm">Marketing & Ads</span><span className="font-bold text-red-700">$85,000</span></div>
            <div className="flex justify-between p-3 bg-red-50 rounded-lg"><span className="text-sm">Operations & Office</span><span className="font-bold text-red-700">$55,000</span></div>
            <div className="flex justify-between p-3 bg-red-100 rounded-lg font-bold"><span className="text-sm">Total Outflows</span><span className="text-red-800">$680,000</span></div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   FORECAST PANEL
   ============================================================ */
function ForecastPanel() {
  return (
    <div className="fos-panel active" id="panel-forecast">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <KpiCard label="6-MONTH FORECAST" value="$6.2M" delta="91% confidence" deltaColor="text-slate-500" icon={<TrendingUp className="w-3.5 h-3.5 text-violet-600" />} bg="bg-violet-100" />
        <KpiCard label="PROFIT MARGIN" value="23.8%" delta="+2.1% vs Q1" icon={<DollarSign className="w-3.5 h-3.5 text-green-600" />} bg="bg-green-100" />
        <KpiCard label="BUDGET UTILIZED" value="72%" delta="On track" icon={<PieChart className="w-3.5 h-3.5 text-blue-600" />} bg="bg-blue-100" />
        <KpiCard label="VARIANCE" value="-3.2%" delta="Under budget" icon={<TrendingUp className="w-3.5 h-3.5 text-green-600" />} bg="bg-green-100" />
      </section>

      {/* Forecast Chart */}
      <section className="glass-strong rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900">AI Revenue Forecast (Next 6 Months)</h3>
            <p className="text-xs text-slate-500">Machine learning model -- 91% confidence interval</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-outline text-xs">Conservative</button>
            <button className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold">Base Case</button>
            <button className="btn-outline text-xs">Optimistic</button>
          </div>
        </div>
        <div style={{ height: 300 }}>
          <Line data={forecastLineData} options={lineDefaults((v) => '$' + v + 'K')} />
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-xl flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 mt-0.5" />
          <div className="text-xs text-slate-600"><span className="font-bold text-blue-700">What-if Scenario:</span> Hiring 5 more engineers drops runway to 14 months but grows ARR 28%. Adding 2 sales reps increases pipeline by $1.2M with 3-month ROI.</div>
        </div>
      </section>

      {/* Budget + Expense Breakdown */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Department Budget Utilization</h3>
          <div className="space-y-4">
            {CORTEX_DATA.budgets.map((b) => (
              <div key={b.dept}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold">{b.dept}</span>
                  <span className="text-slate-500">${b.spent}K / ${b.total}K <span className={`font-bold ${b.pct > 85 ? 'text-yellow-600' : 'text-green-600'}`}>({b.pct}%)</span></span>
                </div>
                <div className="progress">
                  <div className="progress-fill" style={{ width: `${b.pct}%`, background: b.pct > 85 ? 'linear-gradient(90deg,#f59e0b,#f97316)' : undefined }}></div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-outline w-full mt-4 justify-center text-xs">View All Budgets</button>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Expense Breakdown</h3>
          <div style={{ height: 280 }}>
            <Doughnut data={expenseDonutData} options={doughnutDefaults} />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   RISK PANEL
   ============================================================ */
function RiskPanel() {
  return (
    <div className="fos-panel active" id="panel-risk">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <KpiCard label="COMPLIANCE SCORE" value="96/100" delta="Excellent" icon={<ShieldAlert className="w-3.5 h-3.5 text-green-600" />} bg="bg-green-100" />
        <KpiCard label="ANOMALIES FLAGGED" value="14" delta="3 need review" deltaColor="text-yellow-600" icon={<AlertTriangle className="w-3.5 h-3.5 text-yellow-600" />} bg="bg-yellow-100" />
        <KpiCard label="OPEN FILINGS" value="4" delta="1 overdue" deltaColor="text-yellow-600" icon={<FileText className="w-3.5 h-3.5 text-blue-600" />} bg="bg-blue-100" />
        <KpiCard label="ACTIVE POLICIES" value="24" delta="All enforced" icon={<FileLock2 className="w-3.5 h-3.5 text-violet-600" />} bg="bg-violet-100" />
      </section>

      {/* Anomaly Feed */}
      <section className="glass-strong rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-600" /> Live Anomaly Feed</h3>
        <div className="space-y-2">
          {anomalies.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100">
                <div className={`w-8 h-8 rounded-lg ${a.bg} flex items-center justify-center`}><Icon className="w-4 h-4" /></div>
                <div className="flex-1"><div className="text-sm font-semibold">{a.title}</div><div className="text-xs text-slate-500">{a.sub}</div></div>
                <div className="text-xs text-slate-400">{a.time}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tax + Policies */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><FileCheck className="w-4 h-4 text-blue-600" /> Tax & Filings</h3>
          <div className="space-y-3">
            <FilingRow icon={<Check className="w-5 h-5" />} bg="bg-green-100 text-green-600" title="Q1 GST Return" sub="Filed on April 10, 2026" badge="Filed" badgeClass="badge-green" />
            <FilingRow icon={<Clock className="w-5 h-5" />} bg="bg-yellow-100 text-yellow-600" title="TDS Filing -- April" sub="Due May 7, 2026" badge="Due" badgeClass="badge-yellow" />
            <FilingRow icon={<FileText className="w-5 h-5" />} bg="bg-blue-100 text-blue-600" title="Annual Audit Prep" sub="45% ready -- Due Jun 30" badge="In Progress" badgeClass="badge-blue" />
            <FilingRow icon={<AlertTriangle className="w-5 h-5" />} bg="bg-red-100 text-red-600" title="Professional Tax" sub="Overdue -- 3 days" badge="Overdue" badgeClass="badge-red" />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><FileLock2 className="w-4 h-4 text-violet-600" /> Policies & Access Controls</h3>
          <div className="space-y-2">
            {policies.map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100">
                <div className="flex-1"><div className="text-sm font-semibold">{p.title}</div><div className="text-xs text-slate-500">{p.sub}</div></div>
                <span className={`badge ${p.badge}`}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audit Log */}
      <section className="glass-strong rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2"><History className="w-4 h-4 text-blue-600" /> Recent Audit Log</h3>
          <button className="btn-outline text-xs">Export Full Log</button>
        </div>
        <div className="space-y-2">
          {auditLog.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100">
                <div className={`w-8 h-8 rounded-lg ${a.bg} flex items-center justify-center`}><Icon className="w-4 h-4" /></div>
                <div className="flex-1"><div className="text-sm font-semibold">{a.title}</div><div className="text-xs text-slate-500">{a.user}</div></div>
                <div className="text-xs text-slate-400">{a.time}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Risk Matrix */}
      <section className="glass-strong rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-slate-900 mb-4">Financial Risk Assessment</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-green-100 bg-gradient-to-br from-green-50 to-white">
            <div className="flex items-center gap-2 mb-2"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="font-bold text-sm text-green-800">Low Risk</span></div>
            <div className="text-xs text-slate-600 space-y-1">
              <div>Liquidity ratio: 3.8x (healthy)</div>
              <div>Debt-to-equity: 0.35 (conservative)</div>
              <div>Interest coverage: 12x</div>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-yellow-100 bg-gradient-to-br from-yellow-50 to-white">
            <div className="flex items-center gap-2 mb-2"><div className="w-3 h-3 rounded-full bg-yellow-500"></div><span className="font-bold text-sm text-yellow-800">Medium Risk</span></div>
            <div className="text-xs text-slate-600 space-y-1">
              <div>Client concentration: 28% from top 3</div>
              <div>FX exposure: $180K unhedged</div>
              <div>Vendor dependency: AWS 40%</div>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-red-100 bg-gradient-to-br from-red-50 to-white">
            <div className="flex items-center gap-2 mb-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="font-bold text-sm text-red-800">Watch Items</span></div>
            <div className="text-xs text-slate-600 space-y-1">
              <div>Professional tax filing overdue</div>
              <div>$48K AR overdue &gt;90 days</div>
              <div>Marketing spend 34% above avg</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   RECON PANEL
   ============================================================ */
function ReconPanel() {
  return (
    <div className="fos-panel active" id="panel-recon">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <KpiCard label="ACCOUNTS" value="3" delta="Connected banks" deltaColor="text-slate-500" icon={<Landmark className="w-3.5 h-3.5 text-blue-600" />} bg="bg-blue-100" />
        <KpiCard label="RECONCILED" value="95.3%" delta="Above 90% target" icon={<GitCompare className="w-3.5 h-3.5 text-green-600" />} bg="bg-green-100" />
        <KpiCard label="UNMATCHED" value="2" delta="Needs attention" deltaColor="text-yellow-600" icon={<HelpCircle className="w-3.5 h-3.5 text-yellow-600" />} bg="bg-yellow-100" />
        <KpiCard label="AUTO-MATCHED (MTD)" value="847" delta="AI-powered" icon={<Sparkles className="w-3.5 h-3.5 text-violet-600" />} bg="bg-violet-100" />
      </section>

      {/* Bank Reconciliation + Trend */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Bank Reconciliation</h3>
            <span className="badge badge-yellow">2 Unmatched</span>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-xl">
              <div className="flex items-center justify-between mb-2"><span className="text-sm font-semibold">HDFC Operating Account</span><span className="text-xs text-green-600 font-bold">Matched</span></div>
              <div className="flex items-center justify-between text-xs"><span className="text-slate-500">Balance</span><span className="font-bold">$1,820,000</span></div>
              <div className="progress mt-2"><div className="progress-fill" style={{ width: '98%' }}></div></div>
              <div className="text-xs text-slate-500 mt-1">98% reconciled -- 412 transactions</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-xl">
              <div className="flex items-center justify-between mb-2"><span className="text-sm font-semibold">ICICI Payroll Account</span><span className="text-xs text-yellow-600 font-bold">2 unmatched</span></div>
              <div className="flex items-center justify-between text-xs"><span className="text-slate-500">Balance</span><span className="font-bold">$420,000</span></div>
              <div className="progress mt-2"><div className="progress-fill" style={{ width: '88%' }}></div></div>
              <div className="text-xs text-slate-500 mt-1">88% reconciled -- 186 transactions</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <div className="flex items-center justify-between mb-2"><span className="text-sm font-semibold">Stripe USD</span><span className="text-xs text-green-600 font-bold">Matched</span></div>
              <div className="flex items-center justify-between text-xs"><span className="text-slate-500">Balance</span><span className="font-bold">$230,000</span></div>
              <div className="progress mt-2"><div className="progress-fill" style={{ width: '100%' }}></div></div>
              <div className="text-xs text-slate-500 mt-1">100% reconciled -- 249 transactions</div>
            </div>
          </div>
          <button className="btn-primary w-full mt-4 justify-center text-sm">Run Auto-Reconcile</button>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Reconciliation Trend</h3>
          <div style={{ height: 240 }}>
            <Line data={reconTrendData} options={{
              ...lineDefaults((v) => v + '%'),
              scales: { ...lineDefaults((v) => v + '%').scales, y: { ...lineDefaults((v) => v + '%').scales.y, min: 80, max: 100 } },
            }} />
          </div>
        </div>
      </section>

      {/* Unmatched Transactions */}
      <section className="glass-strong rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-slate-900 mb-4">Unmatched Transactions</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center"><HelpCircle className="w-5 h-5" /></div>
            <div className="flex-1">
              <div className="font-semibold text-sm">Wire transfer -- $8,420</div>
              <div className="text-xs text-slate-500">ICICI -- Apr 12 -- No matching ledger entry found</div>
            </div>
            <div className="flex gap-2">
              <button className="btn-outline text-xs">Match Manually</button>
              <button className="btn-primary text-xs">AI Suggest</button>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center"><HelpCircle className="w-5 h-5" /></div>
            <div className="flex-1">
              <div className="font-semibold text-sm">Debit -- $2,180</div>
              <div className="text-xs text-slate-500">ICICI -- Apr 14 -- Possible duplicate of BILL-2038</div>
            </div>
            <div className="flex gap-2">
              <button className="btn-outline text-xs">Match Manually</button>
              <button className="btn-primary text-xs">AI Suggest</button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Receipt Scanner Banner */}
      <section className="glass-blue rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden mb-6">
        <div className="absolute inset-0 opacity-20"><div className="absolute w-48 h-48 bg-white rounded-full blur-3xl -top-20 -right-20 animate-blob"></div></div>
        <div className="relative z-10 w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center"><ScanLine className="w-6 h-6 text-white" /></div>
        <div className="relative z-10 flex-1">
          <div className="font-bold text-white">AI Receipt Scanner</div>
          <div className="text-white/90 text-sm">Upload receipts and invoices. AI extracts data, categorizes expenses, and auto-matches to journal entries.</div>
        </div>
        <button className="relative z-10 bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold text-sm hover:scale-105 transition">Upload Receipt</button>
      </section>
    </div>
  );
}

/* ============================================================
   SHARED SUB-COMPONENTS
   ============================================================ */
function ActivityRow({ icon, bg, title, sub, time }) {
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100">
      <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>{icon}</div>
      <div className="flex-1 text-xs"><span className="font-semibold">{title}</span> -- {sub}</div>
      <div className="text-[10px] text-slate-400">{time}</div>
    </div>
  );
}

function AgingRow({ label, value, width, color, red }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-semibold">{label}</span>
        <span className={`font-bold ${red ? 'text-red-600' : ''}`}>{value}</span>
      </div>
      <div className="progress" style={{ height: 6 }}>
        <div className="progress-fill" style={{ width, background: color }}></div>
      </div>
    </div>
  );
}

function BankRow({ name, sub, balance, delta, deltaColor, icon, bg, iconBg }) {
  return (
    <div className={`flex items-center gap-4 p-3 ${bg} rounded-xl`}>
      <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>{icon}</div>
      <div className="flex-1">
        <div className="font-semibold text-sm">{name}</div>
        <div className="text-[10px] text-slate-500">{sub}</div>
      </div>
      <div className="text-right">
        <div className="font-extrabold text-slate-900">{balance}</div>
        {delta && <div className={`text-[10px] ${deltaColor}`}>{delta}</div>}
      </div>
    </div>
  );
}

function BudgetRow({ dept, spent, total, pct, warn }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-semibold">{dept}</span>
        <span className="text-slate-500">{spent} / {total} <span className={`font-bold ${warn ? 'text-yellow-600' : 'text-green-600'}`}>({pct}%)</span></span>
      </div>
      <div className="progress">
        <div className="progress-fill" style={{ width: `${pct}%`, background: warn ? 'linear-gradient(90deg,#f59e0b,#f97316)' : undefined }}></div>
      </div>
    </div>
  );
}

function VendorRow({ avatar, bg, name, sub, spend }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
      <div className={`avatar avatar-sm ${bg}`}>{avatar}</div>
      <div className="flex-1"><div className="font-semibold text-sm">{name}</div><div className="text-xs text-slate-500">{sub}</div></div>
      <span className="font-bold text-sm">{spend}</span>
    </div>
  );
}

function FilingRow({ icon, bg, title, sub, badge, badgeClass }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
      <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>{icon}</div>
      <div className="flex-1"><div className="font-semibold text-sm">{title}</div><div className="text-xs text-slate-500">{sub}</div></div>
      <span className={`badge ${badgeClass}`}>{badge}</span>
    </div>
  );
}

export default Finance;
