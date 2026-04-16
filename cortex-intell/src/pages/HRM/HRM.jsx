import { useState, useEffect, useMemo } from 'react';
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
  Users, Wallet, Award, CalendarCheck, Briefcase, ShieldCheck,
  GraduationCap, ChevronRight, Download, UserPlus, Calendar,
  Sparkles, TrendingUp, PieChart, BarChart3, Activity, Filter,
  CheckCircle, Heart, Search, Eye, MoreHorizontal, Star,
  ClipboardCheck, Trophy, CalendarX, GitBranch, Crown, Brain,
  Shield, Lightbulb, Code, BadgeCheck, Route,
} from 'lucide-react';
import { CORTEX_DATA } from '../../data/mockData';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

/* ============================================================
   CHART HELPERS
   ============================================================ */
const lineDefaults = (extra = {}) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom', labels: { font: { size: 10 }, boxWidth: 10 } } },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: '#f1f5f9' }, ...extra },
  },
});

const doughnutDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: { legend: { position: 'bottom', labels: { font: { size: 10 }, boxWidth: 10 } } },
};

/* ============================================================
   CHART DATA
   ============================================================ */
const headcountChartData = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    { label: 'Total', data: [280, 285, 292, 298, 305, 312], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.1)', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#3b82f6' },
    { label: 'New Hires', data: [8, 12, 10, 14, 11, 15], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.1)', fill: false, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#10b981', borderDash: [5, 3] },
    { label: 'Exits', data: [3, 2, 5, 4, 3, 4], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,.1)', fill: false, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#ef4444', borderDash: [2, 2] },
  ],
};

const deptChartData = {
  labels: ['Engineering 42%', 'Sales 18%', 'Marketing 12%', 'Operations 15%', 'HR 8%', 'Finance 5%'],
  datasets: [{ data: [42, 18, 12, 15, 8, 5], backgroundColor: ['#3b82f6', '#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981'], borderColor: '#fff', borderWidth: 3 }],
};

const attendanceChartData = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [{ label: 'Attendance %', data: [90, 91, 89, 92, 93, 92], borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,.12)', fill: true, tension: 0.4, pointRadius: 5, pointBackgroundColor: '#6366f1' }],
};

const payrollOverviewChartData = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    { label: 'Salaries', data: [380, 382, 385, 390, 395, 420], backgroundColor: 'rgba(59,130,246,.7)', borderRadius: 6 },
    { label: 'Benefits', data: [45, 45, 46, 48, 50, 52], backgroundColor: 'rgba(139,92,246,.7)', borderRadius: 6 },
  ],
};

const payrollTrendChartData = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    { label: 'Base Salary', data: [790, 800, 805, 810, 815, 820], backgroundColor: 'rgba(59,130,246,.7)', borderRadius: 6 },
    { label: 'Bonuses', data: [80, 120, 95, 110, 130, 140], backgroundColor: 'rgba(139,92,246,.7)', borderRadius: 6 },
    { label: 'Benefits', data: [72, 74, 75, 76, 77, 78], backgroundColor: 'rgba(34,211,238,.6)', borderRadius: 6 },
  ],
};

const perfDistChartData = {
  labels: ['Outstanding (5)', 'Exceeds (4)', 'Meets (3)', 'Developing (2)', 'Below (1)'],
  datasets: [{ label: 'Employees', data: [42, 128, 98, 32, 12], backgroundColor: ['#10b981', '#3b82f6', '#6366f1', '#f59e0b', '#ef4444'], borderRadius: 8 }],
};

/* ============================================================
   SUB-MODULE CARDS for Dashboard
   ============================================================ */
const subModuleCards = [
  { tab: 'employees', icon: Users, label: 'Employees', sub: '312 active', bg: 'bg-blue-100', text: 'text-blue-600' },
  { tab: 'payroll', icon: Wallet, label: 'Payroll', sub: '$1.08M/mo', bg: 'bg-green-100', text: 'text-green-600' },
  { tab: 'performance', icon: Award, label: 'Performance', sub: '4.2 avg', bg: 'bg-violet-100', text: 'text-violet-600' },
  { tab: 'attendance', icon: CalendarCheck, label: 'Attendance', sub: '92% rate', bg: 'bg-indigo-100', text: 'text-indigo-600' },
  { tab: 'recruitment', icon: Briefcase, label: 'Recruitment', sub: '14 open', bg: 'bg-sky-100', text: 'text-sky-600' },
  { tab: 'compliance', icon: ShieldCheck, label: 'Compliance', sub: '96% score', bg: 'bg-orange-100', text: 'text-orange-600' },
  { tab: 'training', icon: GraduationCap, label: 'Training', sub: '12 courses', bg: 'bg-cyan-100', text: 'text-cyan-600' },
];

/* ============================================================
   STATIC DATA
   ============================================================ */
const hiringFunnel = [
  { label: 'Applied', count: 248, pct: 100, color: 'from-blue-500 to-indigo-500', textColor: 'text-blue-600' },
  { label: 'Screened', count: 120, pct: 48, color: 'from-indigo-500 to-violet-500', textColor: 'text-indigo-600' },
  { label: 'Interviewed', count: 45, pct: 18, color: 'from-violet-500 to-purple-500', textColor: 'text-violet-600' },
  { label: 'Offered', count: 18, pct: 7, color: 'from-purple-500 to-fuchsia-500', textColor: 'text-purple-600' },
  { label: 'Hired', count: 12, pct: 5, color: 'from-green-400 to-emerald-500', textColor: 'text-green-600' },
];

const payrollDepts = [
  { dept: 'Engineering', headcount: 112, base: '$348K', bonuses: '$52K', benefits: '$28K', total: '$428K', status: 'Processed', badge: 'badge-green' },
  { dept: 'Sales', headcount: 58, base: '$168K', bonuses: '$42K', benefits: '$15K', total: '$225K', status: 'Processed', badge: 'badge-green' },
  { dept: 'Product', headcount: 48, base: '$124K', bonuses: '$18K', benefits: '$12K', total: '$154K', status: 'Processed', badge: 'badge-green' },
  { dept: 'Marketing', headcount: 42, base: '$98K', bonuses: '$15K', benefits: '$10K', total: '$123K', status: 'Pending', badge: 'badge-yellow' },
  { dept: 'Operations', headcount: 34, base: '$56K', bonuses: '$8K', benefits: '$8K', total: '$72K', status: 'Processed', badge: 'badge-green' },
  { dept: 'HR', headcount: 18, base: '$26K', bonuses: '$5K', benefits: '$5K', total: '$36K', status: 'Processed', badge: 'badge-green' },
];

const topPerformers = [
  { rank: 1, avatar: 'AK', name: 'Anna Kowalski', role: 'Marketing Lead', pts: 98, bg: 'bg-yellow-50 border-yellow-100', rankColor: 'text-yellow-600' },
  { rank: 2, avatar: 'SJ', name: 'Sarah Johnson', role: 'Senior PM', pts: 94, bg: 'bg-slate-50 border-slate-100', rankColor: 'text-slate-400' },
  { rank: 3, avatar: 'MC', name: 'Michael Chen', role: 'Lead Engineer', pts: 92, bg: 'bg-orange-50/50 border-orange-100', rankColor: 'text-orange-400' },
  { rank: 4, avatar: 'ER', name: 'Elena Rodriguez', role: 'HR Manager', pts: 90, bg: 'hover:bg-slate-50', rankColor: 'text-slate-300' },
  { rank: 5, avatar: 'JW', name: 'James Wilson', role: 'DevOps Engineer', pts: 88, bg: 'hover:bg-slate-50', rankColor: 'text-slate-300' },
];

const recentReviews = [
  { avatar: 'SJ', name: 'Sarah Johnson', sub: 'Annual Review \u00b7 Manager: Rania J.', score: '4.6/5', scoreColor: 'text-green-600', badge: 'Exceeds', badgeClass: 'badge-green' },
  { avatar: 'MC', name: 'Michael Chen', sub: 'Annual Review \u00b7 Manager: Sarah J.', score: '4.4/5', scoreColor: 'text-green-600', badge: 'Exceeds', badgeClass: 'badge-green' },
  { avatar: 'PP', name: 'Priya Patel', sub: 'Annual Review \u00b7 Manager: Sarah J.', score: '3.8/5', scoreColor: 'text-blue-600', badge: 'Meets', badgeClass: 'badge-blue' },
  { avatar: 'TB', name: 'Tom Baker', sub: 'Probation Review \u00b7 Manager: Anna K.', score: '3.2/5', scoreColor: 'text-yellow-600', badge: 'Developing', badgeClass: 'badge-yellow' },
  { avatar: 'RS', name: 'Rohan Sharma', sub: 'Mid-year Review \u00b7 Due Apr 20', score: null, scoreColor: '', badge: 'Pending', badgeClass: 'badge-yellow' },
];

const leaveBalances = [
  { avatar: 'SJ', name: 'Sarah Johnson', annual: '20 days', sick: '10 days', personal: '5 days', used: '12 days', remaining: '23 days', remColor: 'text-green-600' },
  { avatar: 'MC', name: 'Michael Chen', annual: '20 days', sick: '10 days', personal: '5 days', used: '8 days', remaining: '27 days', remColor: 'text-green-600' },
  { avatar: 'PP', name: 'Priya Patel', annual: '15 days', sick: '10 days', personal: '3 days', used: '18 days', remaining: '10 days', remColor: 'text-red-600' },
  { avatar: 'JW', name: 'James Wilson', annual: '20 days', sick: '10 days', personal: '5 days', used: '6 days', remaining: '29 days', remColor: 'text-green-600' },
  { avatar: 'AK', name: 'Anna Kowalski', annual: '20 days', sick: '10 days', personal: '5 days', used: '14 days', remaining: '21 days', remColor: 'text-green-600' },
];

const policies = [
  { name: 'Code of Conduct', category: 'Ethics', updated: 'Jan 2026', ack: 100, ackColor: 'text-green-600', status: 'Active', badge: 'badge-green' },
  { name: 'Data Privacy & Security', category: 'IT Security', updated: 'Mar 2026', ack: 94, ackColor: 'text-green-600', status: 'Active', badge: 'badge-green' },
  { name: 'Remote Work Policy', category: 'Operations', updated: 'Feb 2026', ack: 88, ackColor: 'text-blue-600', status: 'Active', badge: 'badge-green' },
  { name: 'Anti-Harassment Policy', category: 'HR', updated: 'Jan 2026', ack: 100, ackColor: 'text-green-600', status: 'Active', badge: 'badge-green' },
  { name: 'Leave & Attendance Policy', category: 'HR', updated: 'Dec 2025', ack: 78, ackColor: 'text-yellow-600', status: 'Needs Update', badge: 'badge-yellow' },
  { name: 'Travel & Expense Policy', category: 'Finance', updated: 'Nov 2025', ack: 65, ackColor: 'text-orange-600', status: 'Needs Update', badge: 'badge-yellow' },
];

const trainingPrograms = [
  { icon: Crown, iconBg: 'bg-blue-100 text-blue-600', name: 'Leadership Essentials', sub: '42 enrolled \u00b7 12 completed', pct: 78, pctColor: 'text-blue-600', barClass: '' },
  { icon: Brain, iconBg: 'bg-violet-100 text-violet-600', name: 'AI for Business', sub: '88 enrolled \u00b7 23 completed', pct: 62, pctColor: 'text-violet-600', barClass: 'bg-gradient-to-r from-violet-400 to-purple-500' },
  { icon: Shield, iconBg: 'bg-green-100 text-green-600', name: 'Data Security 2026', sub: '312 enrolled \u00b7 Mandatory', pct: 94, pctColor: 'text-green-600', barClass: 'bg-gradient-to-r from-green-400 to-emerald-500' },
  { icon: Lightbulb, iconBg: 'bg-orange-100 text-orange-600', name: 'Design Thinking Workshop', sub: '24 enrolled \u00b7 8 completed', pct: 45, pctColor: 'text-orange-600', barClass: 'bg-gradient-to-r from-orange-400 to-red-400' },
  { icon: Code, iconBg: 'bg-sky-100 text-sky-600', name: 'Cloud Architecture (AWS)', sub: '34 enrolled \u00b7 18 completed', pct: 82, pctColor: 'text-sky-600', barClass: 'bg-gradient-to-r from-sky-400 to-blue-500' },
];

const certifications = [
  { avatar: 'MC', name: 'Michael Chen', cert: 'AWS Solutions Architect', date: 'Apr 12' },
  { avatar: 'JW', name: 'James Wilson', cert: 'Kubernetes Administrator', date: 'Apr 8' },
  { avatar: 'AK', name: 'Anna Kowalski', cert: 'Google Analytics 4', date: 'Mar 28' },
  { avatar: 'RS', name: 'Rohan Sharma', cert: 'TensorFlow Developer', date: 'Mar 20' },
];

const statusColorMap = { Active: 'badge-green', 'On Leave': 'badge-yellow', Remote: 'badge-blue' };

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
function HRM() {
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
            <span className="text-blue-600 font-semibold">Cortex Intell HRM</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Cortex Intell HRM</h1>
          <p className="text-slate-500">Empower People. Drive Performance. Build Culture.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline"><Calendar className="w-4 h-4" /> Calendar</button>
          <button className="btn-outline"><Download className="w-4 h-4" /> Reports</button>
          <button className="btn-primary"><UserPlus className="w-4 h-4" /> Add Employee</button>
        </div>
      </section>

      {/* KPI STRIP */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard label="TOTAL EMPLOYEES" value="312" delta="+8 this month" icon={<Users className="w-5 h-5" />} bg="bg-blue-100" text="text-blue-600" />
        <KpiCard label="ATTENDANCE" value="92.0%" delta="+1.2% up" icon={<CheckCircle className="w-5 h-5" />} bg="bg-indigo-100" text="text-indigo-600" />
        <KpiCard label="WELLNESS SCORE" value={<>86<span className="text-sm text-slate-500">/100</span></>} delta="Healthy" icon={<Heart className="w-5 h-5" />} bg="bg-violet-100" text="text-violet-600" />
        <KpiCard label="OPEN ROLES" value="14" delta="171 applicants" deltaColor="text-orange-600" icon={<Briefcase className="w-5 h-5" />} bg="bg-sky-100" text="text-sky-600" />
      </section>

      {/* AI HR COPILOT */}
      <section className="mb-6">
        <div className="glass-blue rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute w-48 h-48 bg-white rounded-full blur-3xl -top-20 -right-20 animate-blob"></div>
          </div>
          <div className="relative z-10 w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="relative z-10 flex-1">
            <div className="font-bold text-white">HR Copilot</div>
            <div className="text-white/90 text-sm">3 employees showing burnout signals. Recommended: Wellness check-in + flexible hours for Priya, Tom, Rohan.</div>
          </div>
          <button className="relative z-10 bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold text-sm hover:scale-105 transition">View Report</button>
        </div>
      </section>

      {/* TAB PANELS */}
      {activeTab === 'dashboard' && <DashboardPanel switchTab={switchTab} />}
      {activeTab === 'employees' && <EmployeesPanel />}
      {activeTab === 'payroll' && <PayrollPanel />}
      {activeTab === 'performance' && <PerformancePanel />}
      {activeTab === 'attendance' && <AttendancePanel />}
      {activeTab === 'recruitment' && <RecruitmentPanel />}
      {activeTab === 'compliance' && <CompliancePanel />}
      {activeTab === 'training' && <TrainingPanel />}
    </div>
  );
}

/* ============================================================
   KPI CARD
   ============================================================ */
function KpiCard({ label, value, delta, deltaColor, icon, bg, text }) {
  return (
    <div className="kpi-card card-hover animate-fade-in-up">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[10px] font-bold text-slate-500 tracking-wider">{label}</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{value}</div>
          <div className={`text-xs font-semibold ${deltaColor || 'text-green-600'}`}>{delta}</div>
        </div>
        <div className={`w-10 h-10 rounded-xl ${bg} ${text} flex items-center justify-center`}>{icon}</div>
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

/* ============================================================
   DASHBOARD PANEL
   ============================================================ */
function DashboardPanel({ switchTab }) {
  return (
    <div className="fos-panel active" id="panel-dashboard">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-blue-100 text-blue-600"><Users className="w-5 h-5" /></div>
          <div><h2>HRM Dashboard</h2><p>Unified overview of all Human Resource modules</p></div>
        </div>

        {/* Sub-module Overview Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
          {subModuleCards.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.tab} className="glass-strong rounded-2xl p-4 text-center cursor-pointer card-hover" onClick={() => switchTab(m.tab)}>
                <div className={`w-10 h-10 rounded-xl ${m.bg} ${m.text} flex items-center justify-center mx-auto mb-2`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-slate-900">{m.label}</div>
                <div className="text-xs text-slate-500 mt-1">{m.sub}</div>
              </div>
            );
          })}
        </section>

        {/* Row 1: Headcount Trend + Department Distribution */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-600" /> Headcount Trend</h3>
            <div style={{ height: 220 }}>
              <Line data={headcountChartData} options={lineDefaults({ beginAtZero: false })} />
            </div>
          </div>
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><PieChart className="w-4 h-4 text-indigo-600" /> Department Distribution</h3>
            <div style={{ height: 220 }}>
              <Doughnut data={deptChartData} options={doughnutDefaults} />
            </div>
          </div>
        </section>

        {/* Row 2: Attendance Rate + Payroll Overview */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><CalendarCheck className="w-4 h-4 text-green-600" /> Attendance Rate</h3>
            <div style={{ height: 220 }}>
              <Line data={attendanceChartData} options={lineDefaults({ min: 85, max: 100 })} />
            </div>
          </div>
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-violet-600" /> Payroll Overview (in $K)</h3>
            <div style={{ height: 220 }}>
              <Bar
                data={payrollOverviewChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom', labels: { font: { size: 10 }, boxWidth: 10 } } },
                  scales: { x: { grid: { display: false } }, y: { grid: { color: '#f1f5f9' }, beginAtZero: true } },
                }}
              />
            </div>
          </div>
        </section>

        {/* Hot Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="glass-blue rounded-2xl p-5 text-center">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-2"><Briefcase className="w-5 h-5 text-white" /></div>
            <div className="text-2xl font-extrabold text-white">12</div>
            <div className="text-xs text-white/80 font-semibold mt-1">Open Positions</div>
          </div>
          <div className="glass-blue rounded-2xl p-5 text-center" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-2"><Award className="w-5 h-5 text-white" /></div>
            <div className="text-2xl font-extrabold text-white">4.2<span className="text-sm font-bold text-white/70">/5</span></div>
            <div className="text-xs text-white/80 font-semibold mt-1">Avg Performance Score</div>
          </div>
          <div className="glass-blue rounded-2xl p-5 text-center" style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)' }}>
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-2"><CheckCircle className="w-5 h-5 text-white" /></div>
            <div className="text-2xl font-extrabold text-white">92%</div>
            <div className="text-xs text-white/80 font-semibold mt-1">Attendance Rate</div>
          </div>
          <div className="glass-blue rounded-2xl p-5 text-center" style={{ background: 'linear-gradient(135deg,#8b5cf6,#a855f7)' }}>
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-2"><GraduationCap className="w-5 h-5 text-white" /></div>
            <div className="text-2xl font-extrabold text-white">78%</div>
            <div className="text-xs text-white/80 font-semibold mt-1">Training Completion</div>
          </div>
        </section>

        {/* Recent HR Activity + Hiring Funnel */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-blue-600" /> Recent HR Activity</h3>
            <div className="space-y-3">
              <ActivityRow icon={<UserPlus className="w-4 h-4" />} bg="bg-green-100 text-green-600" title="New hire: Liam Torres joined Engineering" time="2 hours ago" />
              <ActivityRow icon={<Award className="w-4 h-4" />} bg="bg-violet-100 text-violet-600" title="Performance review completed for Sarah Johnson (4.6/5)" time="5 hours ago" />
              <ActivityRow icon={<CalendarX className="w-4 h-4" />} bg="bg-yellow-100 text-yellow-600" title="Leave request from Priya Patel (Apr 20-22, Sick Leave)" time="Yesterday" />
              <ActivityRow icon={<Wallet className="w-4 h-4" />} bg="bg-blue-100 text-blue-600" title="April payroll processed for 5/6 departments" time="Yesterday" />
              <ActivityRow icon={<GraduationCap className="w-4 h-4" />} bg="bg-cyan-100 text-cyan-600" title="Michael Chen earned AWS Solutions Architect certification" time="Apr 12" />
              <ActivityRow icon={<ShieldCheck className="w-4 h-4" />} bg="bg-orange-100 text-orange-600" title="Leave & Attendance Policy flagged for renewal" time="Apr 10" />
            </div>
          </div>

          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Filter className="w-4 h-4 text-indigo-600" /> Hiring Funnel</h3>
            <div className="space-y-4">
              {hiringFunnel.map((f) => (
                <div key={f.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">{f.label}</span>
                    <span className={`font-bold ${f.textColor}`}>{f.count}</span>
                  </div>
                  <div className="progress" style={{ height: 10 }}>
                    <div className={`progress-fill bg-gradient-to-r ${f.color}`} style={{ width: `${f.pct}%`, borderRadius: 8 }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500">Conversion Rate: <span className="font-bold text-green-600">4.8%</span></div>
              <div className="text-xs text-slate-500">Avg. Time to Hire: <span className="font-bold text-blue-600">18 days</span></div>
            </div>
          </div>
        </section>

        {/* AI HR Insights Banner */}
        <section className="glass-blue rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute w-48 h-48 bg-white rounded-full blur-3xl -top-20 -right-20 animate-blob"></div>
            <div className="absolute w-32 h-32 bg-white rounded-full blur-3xl bottom-0 left-1/4 animate-blob" style={{ animationDelay: '2s' }}></div>
          </div>
          <div className="relative z-10 w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="relative z-10 flex-1">
            <div className="text-[10px] font-bold tracking-wider text-white/70">CORTEX AI HR INSIGHTS</div>
            <div className="text-white text-sm mt-1">
              <b>Attrition Risk:</b> 3 employees in Engineering showing disengagement signals.{' '}
              <b>Hiring Velocity:</b> Time-to-hire improved 12% MoM.{' '}
              <b>Payroll Alert:</b> Marketing dept payroll still pending for April.{' '}
              <b>Training Gap:</b> 22% of Sales team haven't completed mandatory compliance training.
            </div>
          </div>
          <button className="relative z-10 bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold text-sm hover:scale-105 transition whitespace-nowrap">Deep Analysis</button>
        </section>
      </section>
    </div>
  );
}

/* ============================================================
   EMPLOYEES PANEL
   ============================================================ */
function EmployeesPanel() {
  const [search, setSearch] = useState('');
  const employees = CORTEX_DATA.employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.dept.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fos-panel active" id="panel-employees">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-blue-100 text-blue-600"><Users className="w-5 h-5" /></div>
          <div><h2>Employee Management</h2><p>Full employee directory, profiles, and org chart</p></div>
        </div>

        {/* Employee Grid Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">Employee Directory</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search employees..."
                className="pl-9 pr-3 py-2 text-sm bg-blue-50/50 border border-blue-100 rounded-lg outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="btn-primary text-xs">+ Add Employee</button>
          </div>
        </div>

        {/* Employee Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {employees.map((e) => (
            <div key={e.name} className="glass rounded-2xl p-4 card-hover cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="avatar">{e.avatar}</div>
                <span className={`badge ${statusColorMap[e.status] || 'badge-green'}`}>{e.status}</span>
              </div>
              <div className="font-bold text-sm text-slate-900">{e.name}</div>
              <div className="text-xs text-slate-500">{e.role}</div>
              <div className="text-xs text-slate-400 mt-1">{e.dept} &middot; Since {e.since}</div>
              <div className="mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500">Mood Score</span>
                  <span className="font-bold">{e.mood} {e.mood >= 85 ? 'Great' : e.mood >= 75 ? 'Good' : 'Fair'}</span>
                </div>
                <div className="progress" style={{ height: 5 }}>
                  <div className="progress-fill" style={{ width: `${e.mood}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Org Chart + Department */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><GitBranch className="w-4 h-4 text-blue-600" /> Organization Chart</h3>
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col items-center">
                <div className="avatar avatar-lg mb-2">RJ</div>
                <div className="text-sm font-bold">Rania Jamil</div>
                <div className="text-xs text-slate-500">CEO</div>
              </div>
              <div className="w-px h-6 bg-blue-300"></div>
              <div className="flex gap-6 justify-center flex-wrap">
                <div className="flex flex-col items-center"><div className="avatar mb-1">SJ</div><div className="text-xs font-semibold">Sarah J.</div><div className="text-[10px] text-slate-500">VP Product</div></div>
                <div className="flex flex-col items-center"><div className="avatar mb-1">MC</div><div className="text-xs font-semibold">Michael C.</div><div className="text-[10px] text-slate-500">VP Eng</div></div>
                <div className="flex flex-col items-center"><div className="avatar mb-1">AK</div><div className="text-xs font-semibold">Anna K.</div><div className="text-[10px] text-slate-500">VP Marketing</div></div>
                <div className="flex flex-col items-center"><div className="avatar mb-1">ER</div><div className="text-xs font-semibold">Elena R.</div><div className="text-[10px] text-slate-500">VP HR</div></div>
              </div>
            </div>
          </div>

          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4">Department Split</h3>
            <div style={{ height: 220 }}>
              <Doughnut data={deptChartData} options={doughnutDefaults} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   PAYROLL PANEL
   ============================================================ */
function PayrollPanel() {
  return (
    <div className="fos-panel active" id="panel-payroll">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-green-100 text-green-600"><Wallet className="w-5 h-5" /></div>
          <div><h2>Payroll</h2><p>Salary processing, deductions, and benefits</p></div>
        </div>

        {/* Payroll Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard value="$1.08M" label="Total Payroll (Apr)" color="text-green-600" />
          <StatCard value="$820K" label="Base Salary" color="text-blue-600" />
          <StatCard value="$140K" label="Bonuses" color="text-violet-600" />
          <StatCard value="$42K" label="Tax Deductions" color="text-orange-600" />
        </div>

        {/* Payroll Breakdown Table */}
        <div className="glass-strong rounded-2xl overflow-hidden mb-6">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Payroll Breakdown by Department</h3>
            <button className="btn-primary text-xs">Run Payroll</button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Department</th><th>Headcount</th><th>Base Salary</th><th>Bonuses</th><th>Benefits</th><th>Total</th><th>Status</th></tr>
              </thead>
              <tbody>
                {payrollDepts.map((d) => (
                  <tr key={d.dept}>
                    <td className="font-semibold">{d.dept}</td>
                    <td>{d.headcount}</td>
                    <td>{d.base}</td>
                    <td>{d.bonuses}</td>
                    <td>{d.benefits}</td>
                    <td className="font-bold">{d.total}</td>
                    <td><span className={`badge ${d.badge}`}>{d.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payroll Trend Chart */}
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Payroll Trend -- Last 6 Months</h3>
          <div style={{ height: 240 }}>
            <Bar
              data={payrollTrendChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { font: { size: 10 }, boxWidth: 10 } } },
                scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, grid: { color: '#f1f5f9' } } },
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   PERFORMANCE PANEL
   ============================================================ */
function PerformancePanel() {
  return (
    <div className="fos-panel active" id="panel-performance">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-violet-100 text-violet-600"><Award className="w-5 h-5" /></div>
          <div><h2>Performance Management</h2><p>Reviews, goals, ratings, and top performers</p></div>
        </div>

        {/* Performance KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard value="4.2" label="Avg. Rating (out of 5)" color="text-violet-600" />
          <StatCard value="89%" label="Goals On Track" color="text-green-600" />
          <StatCard value="276" label="Reviews Completed" color="text-blue-600" />
          <StatCard value="36" label="Pending Reviews" color="text-orange-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Top Performers */}
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Trophy className="w-4 h-4 text-yellow-500" /> Top Performers (Q2)</h3>
            <div className="space-y-4">
              {topPerformers.map((p) => (
                <div key={p.rank} className={`flex items-center gap-3 p-3 rounded-xl ${p.bg}`}>
                  <div className={`text-lg font-bold ${p.rankColor}`}>{p.rank}</div>
                  <div className="avatar avatar-sm">{p.avatar}</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{p.name}</div>
                    <div className="text-xs text-slate-500">{p.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-extrabold text-slate-700">{p.pts}</div>
                    <div className="text-[10px] text-slate-400">pts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Performance Reviews */}
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><ClipboardCheck className="w-4 h-4 text-blue-600" /> Recent Performance Reviews</h3>
            <div className="space-y-3">
              {recentReviews.map((r) => (
                <div key={r.name} className={`flex items-center gap-3 p-3 rounded-xl ${r.badge === 'Pending' ? 'bg-orange-50/50 border border-orange-100' : 'hover:bg-slate-50'}`}>
                  <div className="avatar avatar-sm">{r.avatar}</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{r.name}</div>
                    <div className="text-xs text-slate-500">{r.sub}</div>
                  </div>
                  {r.score ? (
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${r.scoreColor}`}>{r.score}</span>
                      <span className={`badge ${r.badgeClass} text-[10px]`}>{r.badge}</span>
                    </div>
                  ) : (
                    <span className={`badge ${r.badgeClass} text-[10px]`}>{r.badge}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Distribution Chart */}
        <div className="glass-strong rounded-2xl p-6 mt-5">
          <h3 className="font-bold text-slate-900 mb-4">Performance Rating Distribution</h3>
          <div style={{ height: 200 }}>
            <Bar
              data={perfDistChartData}
              options={{
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { grid: { color: '#f1f5f9' }, beginAtZero: true }, y: { grid: { display: false } } },
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   ATTENDANCE PANEL
   ============================================================ */
function AttendancePanel() {
  const heatmapCells = useMemo(() => {
    const levels = ['bg-blue-100', 'bg-blue-200', 'bg-blue-400', 'bg-blue-600', 'bg-blue-800'];
    return Array.from({ length: 90 }, (_, i) => {
      const level = Math.floor(Math.random() * 5);
      return <div key={i} className={`w-full aspect-square rounded ${levels[level]}`} title={`Day ${i + 1}`}></div>;
    });
  }, []);

  return (
    <div className="fos-panel active" id="panel-attendance">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-indigo-100 text-indigo-600"><CalendarCheck className="w-5 h-5" /></div>
          <div><h2>Attendance &amp; Leave</h2><p>Real-time attendance tracking and leave management</p></div>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard value="287" label="Present Today" color="text-green-600" />
          <StatCard value="18" label="On Leave" color="text-yellow-600" />
          <StatCard value="7" label="Absent" color="text-red-500" />
          <StatCard value="46" label="Remote Today" color="text-blue-600" />
        </div>

        {/* Heatmap + Leave Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="glass-strong rounded-2xl p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">Attendance Heatmap -- Last 90 days</h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Low</span>
                <div className="flex gap-0.5">
                  <div className="w-3 h-3 rounded bg-blue-100"></div>
                  <div className="w-3 h-3 rounded bg-blue-200"></div>
                  <div className="w-3 h-3 rounded bg-blue-400"></div>
                  <div className="w-3 h-3 rounded bg-blue-600"></div>
                  <div className="w-3 h-3 rounded bg-blue-800"></div>
                </div>
                <span className="text-slate-500">High</span>
              </div>
            </div>
            <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(30, 1fr)' }}>
              {heatmapCells}
            </div>
          </div>

          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><CalendarX className="w-4 h-4 text-orange-500" /> Leave Requests</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-yellow-50 border border-yellow-100">
                <div className="flex items-center gap-3">
                  <div className="avatar avatar-sm">PP</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">Priya Patel</div>
                    <div className="text-xs text-slate-500">Apr 20-22 &middot; Sick Leave</div>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button className="px-3 py-1 text-xs font-semibold bg-green-500 text-white rounded-lg">Approve</button>
                  <button className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded-lg">Reject</button>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-yellow-50 border border-yellow-100">
                <div className="flex items-center gap-3">
                  <div className="avatar avatar-sm">TB</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">Tom Baker</div>
                    <div className="text-xs text-slate-500">Apr 25-28 &middot; Annual Leave</div>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button className="px-3 py-1 text-xs font-semibold bg-green-500 text-white rounded-lg">Approve</button>
                  <button className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded-lg">Reject</button>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-green-50 border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="avatar avatar-sm">RS</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">Rohan Sharma</div>
                    <div className="text-xs text-slate-500">Apr 18 &middot; WFH</div>
                  </div>
                </div>
                <span className="badge badge-green text-[10px] mt-1">Approved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Leave Balance Table */}
        <div className="glass-strong rounded-2xl overflow-hidden mt-5">
          <div className="p-5 border-b border-slate-100"><h3 className="font-bold text-slate-900">Leave Balance Overview</h3></div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Employee</th><th>Annual Leave</th><th>Sick Leave</th><th>Personal</th><th>Used</th><th>Remaining</th></tr>
              </thead>
              <tbody>
                {leaveBalances.map((l) => (
                  <tr key={l.name}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="avatar avatar-sm">{l.avatar}</div>
                        <span className="font-semibold">{l.name}</span>
                      </div>
                    </td>
                    <td>{l.annual}</td>
                    <td>{l.sick}</td>
                    <td>{l.personal}</td>
                    <td className="text-orange-600 font-semibold">{l.used}</td>
                    <td className={`font-bold ${l.remColor}`}>{l.remaining}</td>
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
   RECRUITMENT PANEL
   ============================================================ */
function RecruitmentPanel() {
  const recruitFunnel = [
    { label: 'Applied', count: 171, pct: 100 },
    { label: 'Screened', count: 92, pct: 54 },
    { label: 'Interview', count: 38, pct: 22 },
    { label: 'Final Round', count: 12, pct: 7 },
    { label: 'Offer', count: 3, pct: 2 },
  ];

  const openRoles = [
    { title: 'Senior Backend Engineer', dept: 'Engineering', applicants: 48, stage: 'Interview', stageBadge: 'badge-violet', progress: 65, priority: 'High', priBadge: 'badge-red', daysOpen: 22 },
    { title: 'Product Designer', dept: 'Design', applicants: 32, stage: 'Screening', stageBadge: 'badge-blue', progress: 30, priority: 'Medium', priBadge: 'badge-yellow', daysOpen: 14 },
    { title: 'ML Engineer', dept: 'Data', applicants: 67, stage: 'Offer', stageBadge: 'badge-green', progress: 90, priority: 'High', priBadge: 'badge-red', daysOpen: 34 },
    { title: 'Customer Success Manager', dept: 'Operations', applicants: 24, stage: 'Interview', stageBadge: 'badge-violet', progress: 50, priority: 'Low', priBadge: 'badge-blue', daysOpen: 28 },
  ];

  return (
    <div className="fos-panel active" id="panel-recruitment">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-sky-100 text-sky-600"><Briefcase className="w-5 h-5" /></div>
          <div><h2>Recruitment / Hiring</h2><p>Open positions, applicant tracking, and hiring pipeline</p></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard value="14" label="Open Positions" color="text-sky-600" />
          <StatCard value="171" label="Total Applicants" color="text-blue-600" />
          <StatCard value="18" label="Avg. Days to Hire" color="text-green-600" />
          <StatCard value="3" label="Offers Extended" color="text-violet-600" />
        </div>

        {/* Open Roles Pipeline */}
        <div className="glass-strong rounded-2xl overflow-hidden mb-6">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Hiring Pipeline</h3>
            <button className="btn-primary text-xs">+ Post New Role</button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Position</th><th>Department</th><th>Applicants</th><th>Stage</th><th>Priority</th><th>Days Open</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {openRoles.map((r) => (
                  <tr key={r.title} className="clickable">
                    <td className="font-semibold">{r.title}</td>
                    <td>{r.dept}</td>
                    <td><span className="font-bold text-blue-600">{r.applicants}</span></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className={`badge ${r.stageBadge} text-[10px]`}>{r.stage}</span>
                        <div className="w-16 progress" style={{ height: 4 }}>
                          <div className="progress-fill" style={{ width: `${r.progress}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td><span className={`badge ${r.priBadge}`}>{r.priority}</span></td>
                    <td className="text-slate-500">{r.daysOpen}</td>
                    <td><button className="p-1.5 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4 text-blue-600" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recruitment Funnel */}
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Recruitment Funnel</h3>
          <div className="space-y-3">
            {recruitFunnel.map((f) => (
              <div key={f.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">{f.label}</span>
                  <span className="text-slate-500">{f.count}</span>
                </div>
                <div className="progress">
                  <div className={`progress-fill ${f.label === 'Offer' ? 'bg-gradient-to-r from-green-400 to-emerald-500' : ''}`} style={{ width: `${f.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   COMPLIANCE PANEL
   ============================================================ */
function CompliancePanel() {
  return (
    <div className="fos-panel active" id="panel-compliance">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-orange-100 text-orange-600"><ShieldCheck className="w-5 h-5" /></div>
          <div><h2>Compliance &amp; Policies</h2><p>Company policies, regulatory compliance, and audits</p></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard value="96%" label="Overall Compliance" color="text-green-600" />
          <StatCard value="18" label="Active Policies" color="text-blue-600" />
          <StatCard value="3" label="Pending Updates" color="text-orange-600" />
          <StatCard value="0" label="Violations" color="text-violet-600" />
        </div>

        {/* Policies List */}
        <div className="glass-strong rounded-2xl overflow-hidden mb-6">
          <div className="p-5 border-b border-slate-100"><h3 className="font-bold text-slate-900">Company Policies</h3></div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Policy</th><th>Category</th><th>Last Updated</th><th>Acknowledgement</th><th>Status</th></tr>
              </thead>
              <tbody>
                {policies.map((p) => (
                  <tr key={p.name}>
                    <td className="font-semibold">{p.name}</td>
                    <td>{p.category}</td>
                    <td className="text-slate-500">{p.updated}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-20 progress" style={{ height: 5 }}>
                          <div className="progress-fill" style={{ width: `${p.ack}%` }}></div>
                        </div>
                        <span className={`text-xs font-bold ${p.ackColor}`}>{p.ack}%</span>
                      </div>
                    </td>
                    <td><span className={`badge ${p.badge}`}>{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Compliance Insight */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-blue-50 border border-violet-200">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0"><Sparkles className="w-4 h-4 text-violet-600" /></div>
            <div className="flex-1">
              <div className="text-[10px] font-bold tracking-wider text-violet-700">CORTEX AI COMPLIANCE</div>
              <div className="text-sm text-slate-800 mt-1">
                2 policies due for renewal. <b>Leave &amp; Attendance Policy</b> has 22% non-acknowledgement -- recommend sending a reminder. <b>Travel Policy</b> should be updated to reflect new per-diem rates effective May 1.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   TRAINING PANEL
   ============================================================ */
function TrainingPanel() {
  return (
    <div className="fos-panel active" id="panel-training">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-cyan-100 text-cyan-600"><GraduationCap className="w-5 h-5" /></div>
          <div><h2>Training &amp; Development</h2><p>Learning programs, certifications, and career growth</p></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard value="12" label="Active Courses" color="text-cyan-600" />
          <StatCard value="466" label="Total Enrollments" color="text-blue-600" />
          <StatCard value="72%" label="Avg. Completion" color="text-green-600" />
          <StatCard value="84" label="Certifications Earned" color="text-violet-600" />
        </div>

        {/* Course Progress */}
        <div className="glass-strong rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-slate-900 mb-4">Active Learning Programs</h3>
          <div className="space-y-5">
            {trainingPrograms.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg ${t.iconBg} flex items-center justify-center`}><Icon className="w-4 h-4" /></div>
                      <div>
                        <div className="text-sm font-bold">{t.name}</div>
                        <div className="text-xs text-slate-500">{t.sub}</div>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${t.pctColor}`}>{t.pct}%</span>
                  </div>
                  <div className="progress" style={{ height: 8 }}>
                    <div className={`progress-fill ${t.barClass}`} style={{ width: `${t.pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certifications + Career Paths */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><BadgeCheck className="w-4 h-4 text-green-600" /> Recent Certifications</h3>
            <div className="space-y-3">
              {certifications.map((c) => (
                <div key={c.name + c.cert} className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
                  <div className="avatar avatar-sm">{c.avatar}</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{c.name}</div>
                    <div className="text-xs text-slate-500">{c.cert}</div>
                  </div>
                  <div className="text-xs text-green-600 font-bold">{c.date}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Route className="w-4 h-4 text-blue-600" /> Career Growth Paths</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-xl border border-blue-100 hover:bg-blue-50/50 cursor-pointer">
                <div className="text-sm font-bold text-slate-900">Engineering Track</div>
                <div className="text-xs text-slate-500 mt-1">Junior &rarr; Mid &rarr; Senior &rarr; Staff &rarr; Principal</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-bold text-blue-600">112 employees</span>
                  <span className="text-[10px] text-slate-400">&middot; 8 promotions pending</span>
                </div>
              </div>
              <div className="p-3 rounded-xl border border-violet-100 hover:bg-violet-50/50 cursor-pointer">
                <div className="text-sm font-bold text-slate-900">Leadership Track</div>
                <div className="text-xs text-slate-500 mt-1">IC &rarr; Team Lead &rarr; Manager &rarr; Director &rarr; VP</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-bold text-violet-600">28 employees</span>
                  <span className="text-[10px] text-slate-400">&middot; 3 promotions pending</span>
                </div>
              </div>
              <div className="p-3 rounded-xl border border-green-100 hover:bg-green-50/50 cursor-pointer">
                <div className="text-sm font-bold text-slate-900">Specialist Track</div>
                <div className="text-xs text-slate-500 mt-1">Analyst &rarr; Specialist &rarr; Expert &rarr; Fellow</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-bold text-green-600">42 employees</span>
                  <span className="text-[10px] text-slate-400">&middot; 5 promotions pending</span>
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
   SHARED SUB-COMPONENTS
   ============================================================ */
function ActivityRow({ icon, bg, title, time }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50">
      <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>{icon}</div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <div className="text-xs text-slate-400">{time}</div>
      </div>
    </div>
  );
}

export default HRM;
