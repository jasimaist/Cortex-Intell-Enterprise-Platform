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
  TrendingUp, Brain as BrainIcon, Target, ShieldAlert, Sparkles, RefreshCw,
  Lightbulb, Telescope, ChevronRight, Activity, BarChart3, PieChart,
  BookOpen, History, Cpu, Send, Mic, Upload, MessageCircle, Workflow,
  AlertTriangle, AlertCircle, Info, Trophy, HeartPulse, Phone, Mail,
  Gift, Calendar, Zap, Lock, Users, DollarSign, Share2, Bot,
  FolderKanban, UserCog, FileText, FileSpreadsheet, FileCode, File,
  Globe, ArrowUpRight, Check, Clock, Circle,
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
const accuracyChartData = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    { label: 'Lead Scoring', data: [89, 90, 91, 92, 93, 94.2], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.08)', tension: 0.4, fill: true, pointRadius: 4, pointBackgroundColor: '#3b82f6' },
    { label: 'Churn Prediction', data: [85, 86, 87, 88, 89, 91], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,.06)', tension: 0.4, fill: true, pointRadius: 4, pointBackgroundColor: '#ef4444' },
    { label: 'Revenue Forecast', data: [82, 84, 86, 88, 90, 92], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.06)', tension: 0.4, fill: true, pointRadius: 4, pointBackgroundColor: '#10b981' },
  ],
};

const predTypeChartData = {
  labels: ['Lead Score', 'Churn Risk', 'Revenue', 'Deal Close', 'Other'],
  datasets: [{ data: [35, 25, 20, 15, 5], backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#94a3b8'], borderWidth: 0, hoverOffset: 8 }],
};

const insightsBarData = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [{ label: 'Insights', data: [62, 68, 72, 78, 82, 87], backgroundColor: 'rgba(99,102,241,.7)', borderRadius: 8, hoverBackgroundColor: '#6366f1' }],
};

const riskScoresData = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    { label: 'Low', data: [45, 42, 40, 38, 36, 34], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.08)', tension: 0.4, fill: true, pointRadius: 4, pointBackgroundColor: '#10b981' },
    { label: 'Medium', data: [28, 30, 32, 30, 28, 26], borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,.08)', tension: 0.4, fill: true, pointRadius: 4, pointBackgroundColor: '#f59e0b' },
    { label: 'High', data: [8, 7, 6, 5, 4, 3], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,.08)', tension: 0.4, fill: true, pointRadius: 4, pointBackgroundColor: '#ef4444' },
  ],
};

const scoreDistData = {
  labels: ['0-20', '21-40', '41-60', '61-80', '81-100'],
  datasets: [{ label: 'Leads', data: [420, 680, 1240, 980, 342], backgroundColor: ['#94a3b8', '#f59e0b', '#3b82f6', '#6366f1', '#10b981'], borderRadius: 6 }],
};

const revPredData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
  datasets: [
    { label: 'Actual', data: [780, 820, 850, 890, null, null, null, null, null, null], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.1)', tension: 0.4, fill: true },
    { label: 'Predicted', data: [null, null, null, 890, 920, 970, 1010, 1050, 1100, 1180], borderColor: '#8b5cf6', borderDash: [5, 5], backgroundColor: 'rgba(139,92,246,.1)', tension: 0.4, fill: true },
    { label: 'Optimistic', data: [null, null, null, 890, 960, 1040, 1120, 1200, 1280, 1380], borderColor: '#10b981', borderDash: [3, 3], backgroundColor: 'transparent', tension: 0.4 },
    { label: 'Conservative', data: [null, null, null, 890, 880, 910, 940, 960, 990, 1020], borderColor: '#94a3b8', borderDash: [3, 3], backgroundColor: 'transparent', tension: 0.4 },
  ],
};

const predAccuracyData = {
  labels: ['v3.0', 'v3.1', 'v3.2', 'v3.3', 'v3.4'],
  datasets: [
    { label: 'Revenue Forecast', data: [86, 88, 90, 92, 94], borderColor: '#3b82f6', tension: 0.4 },
    { label: 'Churn Prediction', data: [82, 85, 87, 89, 91], borderColor: '#ef4444', tension: 0.4 },
    { label: 'Lead Scoring', data: [88, 90, 92, 94, 96], borderColor: '#10b981', tension: 0.4 },
  ],
};

const riskTrendData = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    { label: 'Risk Score', data: [28, 24, 22, 20, 18, 15], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,.1)', tension: 0.4, fill: true },
    { label: 'Anomalies', data: [24, 18, 20, 16, 12, 14], borderColor: '#f59e0b', backgroundColor: 'transparent', tension: 0.4 },
  ],
};

const modelPerfData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    { label: 'Accuracy %', data: [89, 91, 92, 90, 93, 92, 94.2], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.1)', tension: 0.4, fill: true },
    { label: 'Response ms', data: [820, 780, 740, 710, 680, 690, 650], borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,.1)', tension: 0.4, fill: true, yAxisID: 'y1' },
  ],
};

/* ============================================================
   SUB-MODULE CARDS for Dashboard
   ============================================================ */
const subModuleCards = [
  { tab: 'scoring', icon: Target, label: 'Scoring', sub: 'Lead & Priority', bg: 'bg-blue-100', text: 'text-blue-600' },
  { tab: 'prediction', icon: Telescope, label: 'Prediction', sub: 'Forecast & Churn', bg: 'bg-violet-100', text: 'text-violet-600' },
  { tab: 'recommendation', icon: Lightbulb, label: 'Recommendation', sub: 'Actions & Upsell', bg: 'bg-indigo-100', text: 'text-indigo-600' },
  { tab: 'risk', icon: ShieldAlert, label: 'Risk', sub: 'Anomaly & Fraud', bg: 'bg-red-100', text: 'text-red-600' },
  { tab: 'copilot', icon: Sparkles, label: 'AI Copilot', sub: 'Ask & Analyze', bg: 'bg-green-100', text: 'text-green-600' },
  { tab: 'learning', icon: RefreshCw, label: 'Learning Loop', sub: 'Train & Improve', bg: 'bg-orange-100', text: 'text-orange-600' },
];

/* ============================================================
   STATIC DATA
   ============================================================ */
const tagColor = { Prediction: 'badge-purple', Recommendation: 'badge-blue', Analysis: 'badge-green', Risk: 'badge-red' };

const topScoredLeads = [
  { score: 98, name: 'Sarah Mitchell — TechCorp', desc: 'Enterprise · Requested demo · Visited pricing 5x', badge: 'badge-green', label: 'Hot', bg: 'bg-green-50' },
  { score: 94, name: 'James Patel — InnoVentures', desc: 'Mid-Market · Downloaded case study · Attended webinar', badge: 'badge-green', label: 'Hot', bg: 'bg-green-50' },
  { score: 87, name: 'Lisa Chen — DataFlow Inc', desc: 'Enterprise · Email opened 8x · Compared plans', badge: 'badge-blue', label: 'Warm', bg: 'bg-blue-50' },
  { score: 82, name: 'Robert Kim — CloudNine', desc: 'Growth · API docs viewed · GitHub stars', badge: 'badge-blue', label: 'Warm', bg: 'bg-blue-50' },
  { score: 76, name: 'Emma Davis — Alpha Partners', desc: 'Mid-Market · Blog subscriber · Content engaged', badge: 'badge-indigo', label: 'Nurture', bg: 'bg-indigo-50' },
];

const churnPredictions = [
  { pct: '92%', name: 'Global Industries', desc: 'No login 45 days · Support tickets x3 · Payment delayed', color: 'text-red-600', bg: 'bg-red-50', cta: 'Intervene' },
  { pct: '84%', name: 'Nova Dynamics', desc: 'Usage down 60% · Feature complaints · Competitor eval', color: 'text-red-600', bg: 'bg-red-50', cta: 'Intervene' },
  { pct: '68%', name: 'Apex Solutions', desc: 'Contract renewal in 30 days · No expansion signals', color: 'text-yellow-600', bg: 'bg-yellow-50', cta: 'Review' },
  { pct: '55%', name: 'Metro Tech Corp', desc: 'Budget cuts reported · Key champion left org', color: 'text-yellow-600', bg: 'bg-yellow-50', cta: 'Review' },
];

const dealWinProbs = [
  { name: 'TechCorp — Enterprise Suite', pct: 94, color: '#10b981,#22c55e', bg: 'bg-green-50', desc: '$240K · Proposal stage · Champion engaged' },
  { name: 'InnoVentures — Growth Plan', pct: 82, color: '#10b981,#22c55e', bg: 'bg-green-50', desc: '$85K · Negotiation · Budget approved' },
  { name: 'DataFlow — API Integration', pct: 68, color: '#3b82f6,#6366f1', bg: 'bg-blue-50', desc: '$42K · Demo completed · Evaluating competitors' },
  { name: 'CloudNine — Starter Pack', pct: 45, color: '#f59e0b,#f97316', bg: 'bg-yellow-50', desc: '$18K · Discovery · No budget confirmed yet' },
];

const nextBestActions = [
  { icon: Phone, label: 'Call Sarah Mitchell (TechCorp)', desc: 'Score 98 · Demo requested yesterday · Best time: 10 AM', badge: 'badge-red', tag: 'Urgent', border: 'border-blue-100', bg: 'from-blue-50 to-white', iconBg: 'bg-blue-100 text-blue-600' },
  { icon: Mail, label: 'Send proposal to InnoVentures', desc: 'Deal at 82% · Budget approved · Competitor also bidding', badge: 'badge-yellow', tag: 'Today', border: 'border-green-100', bg: 'from-green-50 to-white', iconBg: 'bg-green-100 text-green-600' },
  { icon: Gift, label: 'Offer discount to Global Industries', desc: 'Churn risk 92% · 15% retention discount could save $48K ARR', badge: 'badge-yellow', tag: 'Today', border: 'border-violet-100', bg: 'from-violet-50 to-white', iconBg: 'bg-violet-100 text-violet-600' },
  { icon: Calendar, label: 'Schedule QBR with DataFlow', desc: 'Usage up 40% · Expansion opportunity · $28K upsell potential', badge: 'badge-blue', tag: 'This week', border: 'border-sky-100', bg: 'from-sky-50 to-white', iconBg: 'bg-sky-100 text-sky-600' },
];

const upsellOpps = [
  { name: 'TechCorp → Add HRM Module', value: '$65K', desc: 'They use CRM + Finance · 84% likely to accept · Growing team', pct: 84, color: '#10b981,#22c55e', border: 'border-green-100', bg: 'from-green-50 to-white', valColor: 'text-green-600' },
  { name: 'InnoVentures → Upgrade to Enterprise', value: '$42K', desc: 'Hitting usage limits · 72% likely · Annual contract ending', pct: 72, color: '#3b82f6,#6366f1', border: 'border-blue-100', bg: 'from-blue-50 to-white', valColor: 'text-blue-600' },
  { name: 'DataFlow → Add Growth Engine', value: '$28K', desc: 'Marketing team expanding · 68% likely · Competitor has this', pct: 68, color: '#6366f1,#8b5cf6', border: 'border-indigo-100', bg: 'from-indigo-50 to-white', valColor: 'text-indigo-600' },
];

const recoItems = [
  { priority: 'HIGH IMPACT', color: 'green', title: 'Upsell TechCorp to Enterprise', desc: '84% likely to accept. They\'re hitting usage limits and team is growing. Estimated $65K revenue.', cta: 'Create Proposal', icon: TrendingUp },
  { priority: 'URGENT', color: 'red', title: 'Intervene with Global Industries', desc: '92% churn risk. No login for 45 days. Offer 15% retention discount to save $48K ARR.', cta: 'Send Offer', icon: AlertTriangle },
  { priority: 'OPPORTUNITY', color: 'blue', title: 'Shift ad budget to LinkedIn', desc: 'LinkedIn outperforming other channels by 3x. Reallocate 20% budget for +$142K pipeline.', cta: 'Adjust Budget', icon: Lightbulb },
  { priority: 'EFFICIENCY', color: 'violet', title: 'Automate invoice reminders', desc: 'Manual follow-ups taking 12 hrs/week. Auto-reminders could save $2,400/month and improve DSO.', cta: 'Enable Automation', icon: Zap },
];

const recoColors = { green: 'from-green-50 to-emerald-50 border-green-200', red: 'from-red-50 to-pink-50 border-red-200', blue: 'from-blue-50 to-indigo-50 border-blue-200', violet: 'from-violet-50 to-purple-50 border-violet-200' };
const recoIconColors = { green: 'text-green-600 bg-green-100', red: 'text-red-600 bg-red-100', blue: 'text-blue-600 bg-blue-100', violet: 'text-violet-600 bg-violet-100' };

const riskMapData = [
  { label: 'Critical', count: 3, dot: 'bg-red-500', color: 'text-red-800', border: 'border-red-200', bg: 'from-red-50', num: 'text-red-600', items: ['Revenue concentration risk', 'Overdue tax filing', 'Churn risk — Global Industries'] },
  { label: 'High', count: 4, dot: 'bg-orange-500', color: 'text-orange-800', border: 'border-orange-200', bg: 'from-orange-50', num: 'text-orange-600', items: ['Marketing overspend +34%', 'Duplicate invoice detected', '2 projects at risk', 'FX exposure unhedged'] },
  { label: 'Medium', count: 8, dot: 'bg-yellow-500', color: 'text-yellow-800', border: 'border-yellow-200', bg: 'from-yellow-50', num: 'text-yellow-600', items: ['DSO above target (38 vs 30)', 'Employee satisfaction dip', 'Vendor dependency high'] },
  { label: 'Low', count: 8, dot: 'bg-green-500', color: 'text-green-800', border: 'border-green-200', bg: 'from-green-50', num: 'text-green-600', items: ['Healthy liquidity ratio', 'Strong debt-to-equity', 'All policies enforced'] },
];

const anomalyFeed = [
  { icon: AlertCircle, iconClass: 'text-red-500', border: 'border-red-100', bg: 'bg-red-50', title: 'Unusual wire transfer — $48K', desc: 'Outside normal hours · New recipient · Flagged for review', time: '2 min ago' },
  { icon: AlertTriangle, iconClass: 'text-yellow-500', border: 'border-yellow-100', bg: 'bg-yellow-50', title: 'Duplicate vendor invoice — AWS', desc: '$4,200 billed twice · Same amount, same date', time: '18 min ago' },
  { icon: AlertTriangle, iconClass: 'text-yellow-500', border: 'border-yellow-100', bg: 'bg-yellow-50', title: 'Login from unusual location', desc: 'User: Michael Chen · IP from new country · MFA triggered', time: '1 hr ago' },
  { icon: Info, iconClass: 'text-blue-500', border: 'border-blue-100', bg: 'bg-blue-50', title: 'Expense without receipt — $1,840', desc: 'Travel category · Auto-reminder sent to submitter', time: '3 hr ago' },
];

const knowledgeBase = [
  { icon: FileText, iconBg: 'bg-blue-100 text-blue-600', name: 'Company Policies 2026.pdf', desc: 'Indexed · 128 pages', badge: 'badge-green', status: 'Ready' },
  { icon: FileSpreadsheet, iconBg: 'bg-violet-100 text-violet-600', name: 'Q1 Sales Playbook.xlsx', desc: 'Indexed · 42 rows', badge: 'badge-green', status: 'Ready' },
  { icon: FileCode, iconBg: 'bg-indigo-100 text-indigo-600', name: 'API Documentation v3.md', desc: 'Auto-sync · Live', badge: 'badge-green', status: 'Ready' },
  { icon: File, iconBg: 'bg-sky-100 text-sky-600', name: 'Customer Feedback Feb.docx', desc: 'Indexing... 68%', badge: 'badge-yellow', status: 'Processing' },
  { icon: Globe, iconBg: 'bg-cyan-100 text-cyan-600', name: 'Website Content (crawled)', desc: '412 pages · Auto-refresh', badge: 'badge-green', status: 'Ready' },
];

const queryHistory = [
  { q: '"What\'s driving the revenue growth?"', who: 'You · 5 min ago · 1.2s', bg: 'bg-blue-50' },
  { q: '"Top 5 churn risks this quarter"', who: 'You · 22 min ago · 2.1s', bg: 'bg-indigo-50' },
  { q: '"Draft a proposal for TechCorp"', who: 'You · 1 hour ago · 4.8s', bg: 'bg-violet-50' },
  { q: '"Compare Q1 vs Q2 marketing ROI"', who: 'You · 2 hours ago · 1.9s', bg: 'bg-sky-50' },
  { q: '"Who should I hire first?"', who: 'You · 3 hours ago · 3.2s', bg: 'bg-cyan-50' },
];

const modelVersions = [
  { ver: 'v3.4', date: 'Apr 16, 2026', acc: '94.2%', imp: '+1.4%', data: '2.4M points', badge: 'badge-green', status: 'Production' },
  { ver: 'v3.3', date: 'Apr 2, 2026', acc: '92.8%', imp: '+0.8%', data: '2.2M points', badge: 'badge-blue', status: 'Archived' },
  { ver: 'v3.2', date: 'Mar 18, 2026', acc: '92.0%', imp: '+1.2%', data: '2.0M points', badge: 'badge-blue', status: 'Archived' },
  { ver: 'v3.1', date: 'Mar 4, 2026', acc: '90.8%', imp: '+0.4%', data: '1.8M points', badge: 'badge-blue', status: 'Archived' },
  { ver: 'v3.0', date: 'Feb 18, 2026', acc: '90.4%', imp: '—', data: '1.6M points', badge: 'badge-blue', status: 'Archived' },
];

const trainingPipeline = [
  { step: 1, name: 'Data Collection', desc: 'Gather user interactions, corrections, and outcomes', badge: 'badge-green', status: 'Running', border: 'border-green-200', bg: 'from-green-50', numBg: 'bg-green-100 text-green-600' },
  { step: 2, name: 'Feature Engineering', desc: 'Extract signals from raw data, build training features', badge: 'badge-green', status: 'Running', border: 'border-green-200', bg: 'from-green-50', numBg: 'bg-green-100 text-green-600' },
  { step: 3, name: 'Model Training', desc: 'Fine-tune models on latest data · GPU cluster active', badge: 'badge-blue', status: 'Scheduled 2 AM', border: 'border-blue-200', bg: 'from-blue-50', numBg: 'bg-blue-100 text-blue-600' },
  { step: 4, name: 'Validation & A/B Test', desc: 'Compare new model vs production · Monitor metrics', badge: 'badge-purple', status: 'Auto', border: 'border-violet-200', bg: 'from-violet-50', numBg: 'bg-violet-100 text-violet-600' },
  { step: 5, name: 'Deploy & Monitor', desc: 'Promote winning model · Rollback if accuracy drops', badge: 'badge-blue', status: 'Auto', border: 'border-sky-200', bg: 'from-sky-50', numBg: 'bg-sky-100 text-sky-600' },
];

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
function Brain() {
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
            <span className="text-blue-600 font-semibold">Brain</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Cortex Intell Brain</h1>
          <p className="text-slate-500">The AI Core — Scoring · Prediction · Recommendation · Risk · Copilot · Learning.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline"><BookOpen className="w-4 h-4" /> Knowledge</button>
          <button className="btn-outline"><History className="w-4 h-4" /> History</button>
          <button className="btn-primary"><Sparkles className="w-4 h-4" /> Ask Brain</button>
        </div>
      </section>

      {/* HERO BRAIN VISUAL */}
      <section className="mb-5">
        <div className="glass-strong rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 opacity-60"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-300/30 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="badge badge-blue">LEARNING</span>
                <span className="badge badge-purple">6 SUB-MODULES</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">One Brain.<br /><span className="text-grad">All Your Data.</span></h2>
              <p className="text-slate-600 mb-4">Cortex Brain continuously learns from every module — CRM, Finance, HRM, Projects — to deliver superhuman insights, predictions, and recommendations.</p>
              <div className="flex gap-3">
                <div className="glass rounded-xl p-3 flex-1"><div className="text-xs text-slate-500">Queries Today</div><div className="text-xl font-bold text-grad">3,482</div></div>
                <div className="glass rounded-xl p-3 flex-1"><div className="text-xs text-slate-500">Avg Confidence</div><div className="text-xl font-bold text-grad">92%</div></div>
                <div className="glass rounded-xl p-3 flex-1"><div className="text-xs text-slate-500">Models Active</div><div className="text-xl font-bold text-grad">7</div></div>
              </div>
            </div>
            <div className="flex items-center justify-center min-h-[280px]">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-spin" style={{ animationDuration: '12s' }}></div>
                <div className="absolute inset-4 rounded-full border-2 border-indigo-200 animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }}></div>
                <div className="absolute inset-8 rounded-full border-2 border-violet-200 animate-spin" style={{ animationDuration: '6s' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg">
                    <BrainIcon className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TAB PANELS */}
      {activeTab === 'dashboard' && <DashboardPanel switchTab={switchTab} />}
      {activeTab === 'scoring' && <ScoringPanel />}
      {activeTab === 'prediction' && <PredictionPanel />}
      {activeTab === 'recommendation' && <RecommendationPanel />}
      {activeTab === 'risk' && <RiskPanel />}
      {activeTab === 'copilot' && <CopilotPanel />}
      {activeTab === 'learning' && <LearningPanel />}
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
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-5">
        {subModuleCards.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.tab} className="glass-strong rounded-2xl p-4 text-center card-hover cursor-pointer" onClick={() => switchTab(m.tab)}>
              <div className={`w-10 h-10 rounded-xl ${m.bg} ${m.text} flex items-center justify-center mx-auto mb-2`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="font-bold text-sm text-slate-900">{m.label}</div>
              <div className="text-xs text-slate-500">{m.sub}</div>
            </div>
          );
        })}
      </section>

      {/* Row 1: AI Model Accuracy + Predictions by Type */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-600" /> AI Model Accuracy</h3>
          <div style={{ height: 260 }}>
            <Line data={accuracyChartData} options={{ ...lineDefaults((v) => v + '%'), scales: { ...lineDefaults((v) => v + '%').scales, y: { ...lineDefaults((v) => v + '%').scales.y, min: 78, max: 100 } } }} />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><PieChart className="w-4 h-4 text-violet-600" /> Predictions by Type</h3>
          <div style={{ height: 260 }}>
            <Doughnut data={predTypeChartData} options={doughnutDefaults} />
          </div>
        </div>
      </section>

      {/* Row 2: Insights Generated + Risk Scores */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-indigo-600" /> Insights Generated</h3>
          <div style={{ height: 260 }}>
            <Bar data={insightsBarData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: '#f1f5f9' }, beginAtZero: true }, x: { grid: { display: false } } } }} />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-red-600" /> Risk Scores</h3>
          <div style={{ height: 260 }}>
            <Line data={riskScoresData} options={lineDefaults()} />
          </div>
        </div>
      </section>

      {/* KPI Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <KpiCard label="INSIGHTS" value="87" delta="Generated today" />
        <KpiCard label="MODEL ACCURACY" value="94.2%" delta="+2.1% this month" />
        <KpiCard label="RECOMMENDATIONS ACTIVE" value="6" delta="Across all engines" deltaColor="text-blue-600" />
        <KpiCard label="RISK ALERTS" value="3" delta="Require attention" deltaColor="text-red-500" />
      </section>

      {/* Recent AI Activity Feed */}
      <section className="glass-strong rounded-2xl p-6 mb-5">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-blue-600" /> Recent AI Activity</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-xl border border-green-100 bg-gradient-to-r from-green-50 to-white">
            <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0"><Target className="w-4 h-4" /></div>
            <div className="flex-1"><div className="font-semibold text-sm">Lead Scoring updated for 342 leads</div><div className="text-xs text-slate-500">Confidence boosted to 96.4% after retraining cycle</div></div>
            <div className="text-xs text-slate-400 whitespace-nowrap">2 min ago</div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl border border-violet-100 bg-gradient-to-r from-violet-50 to-white">
            <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0"><Telescope className="w-4 h-4" /></div>
            <div className="flex-1"><div className="font-semibold text-sm">Churn prediction flagged 3 new accounts</div><div className="text-xs text-slate-500">Global Industries, Nova Dynamics, and Apex Solutions at risk</div></div>
            <div className="text-xs text-slate-400 whitespace-nowrap">18 min ago</div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0"><Lightbulb className="w-4 h-4" /></div>
            <div className="flex-1"><div className="font-semibold text-sm">12 new insights generated from CRM data</div><div className="text-xs text-slate-500">Revenue growth patterns and upsell opportunities identified</div></div>
            <div className="text-xs text-slate-400 whitespace-nowrap">45 min ago</div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-white">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0"><BarChart3 className="w-4 h-4" /></div>
            <div className="flex-1"><div className="font-semibold text-sm">Revenue forecast model accuracy improved to 92%</div><div className="text-xs text-slate-500">Model v3.4 deployed with enhanced time-series analysis</div></div>
            <div className="text-xs text-slate-400 whitespace-nowrap">1 hr ago</div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl border border-red-100 bg-gradient-to-r from-red-50 to-white">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0"><ShieldAlert className="w-4 h-4" /></div>
            <div className="flex-1"><div className="font-semibold text-sm">Anomaly detected: Unusual wire transfer flagged</div><div className="text-xs text-slate-500">$48K transfer outside normal hours sent to new recipient</div></div>
            <div className="text-xs text-slate-400 whitespace-nowrap">2 hr ago</div>
          </div>
        </div>
      </section>

      {/* AI Brain Insights Banner */}
      <section className="mb-5">
        <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: 'rgba(59,130,246,0.08)', backdropFilter: 'blur(16px)', border: '1px solid rgba(59,130,246,0.18)' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-indigo-100/30 to-violet-100/20"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 text-blue-600 flex items-center justify-center flex-shrink-0"><BrainIcon className="w-6 h-6" /></div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 text-lg">AI Brain Insights</h3>
              <p className="text-sm text-slate-600 mt-1">Cortex Brain is continuously learning from 2.4M data points across all modules. Model accuracy has improved by 3.8% since launch, with 87 actionable insights generated today.</p>
            </div>
            <button className="btn-primary flex-shrink-0"><Sparkles className="w-4 h-4" /> Explore</button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   SCORING PANEL
   ============================================================ */
function ScoringPanel() {
  return (
    <div className="fos-panel active">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <KpiCard label="ENTITIES SCORED" value="14,820" delta="Leads + Accounts + Deals" deltaColor="text-slate-500" />
        <KpiCard label="AVG CONFIDENCE" value="94.2%" delta="+2.1% this month" />
        <KpiCard label="HIGH-SCORE LEADS" value="342" delta="Score > 80" />
        <KpiCard label="SCORING MODELS" value="5" delta="All active" />
      </section>

      {/* Scoring Models */}
      <section className="glass-strong rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-slate-900 mb-4">Active Scoring Models</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Users, color: 'blue', name: 'Lead Scoring', desc: 'Scores inbound leads based on 28 signals: firmographics, behavior, engagement, intent', acc: '96.4%', count: '8,420 leads scored this month' },
            { icon: HeartPulse, color: 'violet', name: 'Account Health', desc: 'Monitors customer health: usage, support tickets, payment timeliness, NPS signals', acc: '93.8%', count: '2,840 accounts monitored' },
            { icon: Trophy, color: 'indigo', name: 'Deal Priority', desc: 'Ranks active deals by win probability, deal size, engagement velocity, competitive risk', acc: '91.2%', count: '186 active deals ranked' },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.name} className={`p-4 rounded-xl border border-${m.color}-100 bg-gradient-to-br from-${m.color}-50 to-white`}>
                <div className="flex items-center gap-2 mb-2"><Icon className={`w-4 h-4 text-${m.color}-600`} /><span className="font-bold text-sm">{m.name}</span></div>
                <div className="text-xs text-slate-500 mb-3">{m.desc}</div>
                <div className="flex justify-between text-xs mb-1"><span className="text-slate-500">Accuracy</span><span className="font-bold text-green-600">{m.acc}</span></div>
                <div className="progress"><div className="progress-fill" style={{ width: m.acc }}></div></div>
                <div className="text-xs text-slate-400 mt-2">{m.count}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Score Distribution + Top Scored */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Lead Score Distribution</h3>
          <div style={{ height: 260 }}>
            <Bar data={scoreDistData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: '#f1f5f9' } }, x: { grid: { display: false } } } }} />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Top Scored Leads (This Week)</h3>
          <div className="space-y-3">
            {topScoredLeads.map((l) => (
              <div key={l.name} className={`flex items-center gap-3 p-3 ${l.bg} rounded-xl`}>
                <div className={`text-xl font-extrabold ${l.score >= 90 ? 'text-green-600' : l.score >= 80 ? 'text-blue-600' : 'text-indigo-600'} w-10 text-center`}>{l.score}</div>
                <div className="flex-1"><div className="font-semibold text-sm">{l.name}</div><div className="text-xs text-slate-500">{l.desc}</div></div>
                <span className={`badge ${l.badge}`}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   PREDICTION PANEL
   ============================================================ */
function PredictionPanel() {
  return (
    <div className="fos-panel active">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <KpiCard label="REVENUE FORECAST" value="$6.2M" delta="Next 6 months · 91% conf" deltaColor="text-slate-500" />
        <KpiCard label="CHURN RISK" value="8" delta="Accounts at risk" deltaColor="text-red-600" />
        <KpiCard label="DEAL WIN PROB" value="72%" delta="Pipeline avg" />
        <KpiCard label="PREDICTION ACCURACY" value="91.4%" delta="Last 90 days" />
      </section>

      {/* Revenue Forecast */}
      <section className="glass-strong rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900">AI Revenue Prediction (6 Months)</h3>
          <div className="flex gap-2">
            <button className="btn-outline text-xs">Conservative</button>
            <button className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold">Base</button>
            <button className="btn-outline text-xs">Optimistic</button>
          </div>
        </div>
        <div style={{ height: 300 }}>
          <Line data={revPredData} options={lineDefaults((v) => '$' + v + 'K')} />
        </div>
      </section>

      {/* Churn Predictions + Deal Win Probability */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-600" /> Churn Risk Predictions</h3>
          <div className="space-y-3">
            {churnPredictions.map((c) => (
              <div key={c.name} className={`flex items-center gap-3 p-3 ${c.bg} rounded-xl`}>
                <div className={`text-lg font-extrabold ${c.color} w-10 text-center`}>{c.pct}</div>
                <div className="flex-1"><div className="font-semibold text-sm">{c.name}</div><div className="text-xs text-slate-500">{c.desc}</div></div>
                <button className="btn-outline text-xs !py-1">{c.cta}</button>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Trophy className="w-4 h-4 text-green-600" /> Deal Win Probability</h3>
          <div className="space-y-3">
            {dealWinProbs.map((d) => (
              <div key={d.name} className={`p-3 ${d.bg} rounded-xl`}>
                <div className="flex items-center justify-between mb-2"><span className="font-semibold text-sm">{d.name}</span><span className={`font-bold ${d.pct >= 80 ? 'text-green-600' : d.pct >= 60 ? 'text-blue-600' : 'text-yellow-600'}`}>{d.pct}%</span></div>
                <div className="progress"><div className="progress-fill" style={{ width: d.pct + '%', background: `linear-gradient(90deg,${d.color})` }}></div></div>
                <div className="text-xs text-slate-500 mt-1">{d.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prediction Accuracy Trend */}
      <section className="glass-strong rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-slate-900 mb-4">Prediction Accuracy Over Time</h3>
        <div style={{ height: 240 }}>
          <Line data={predAccuracyData} options={{ ...lineDefaults((v) => v + '%'), scales: { y: { grid: { color: '#f1f5f9' }, ticks: { callback: (v) => v + '%' }, min: 75, max: 100 }, x: { grid: { display: false } } } }} />
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   RECOMMENDATION PANEL
   ============================================================ */
function RecommendationPanel() {
  return (
    <div className="fos-panel active">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <KpiCard label="RECOMMENDATIONS" value="87" delta="Generated today" deltaColor="text-slate-500" />
        <KpiCard label="ACCEPTED RATE" value="78%" delta="+12% this month" />
        <KpiCard label="REVENUE IMPACT" value="$284K" delta="From accepted recs" />
        <KpiCard label="CATEGORIES" value="6" delta="Action types" deltaColor="text-slate-500" />
      </section>

      {/* AI Recommendations Feed */}
      <section className="glass-strong rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-indigo-600" /> AI Recommendations</h3>
          <div className="flex gap-2">
            <button className="btn-outline text-xs">All</button>
            <button className="btn-outline text-xs">Revenue</button>
            <button className="btn-outline text-xs">Risk</button>
            <button className="btn-outline text-xs">Efficiency</button>
          </div>
        </div>
        <div className="space-y-3">
          {recoItems.map((r) => {
            const Icon = r.icon;
            return (
              <div key={r.title} className={`p-4 rounded-xl bg-gradient-to-br ${recoColors[r.color]} border`}>
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg ${recoIconColors[r.color]} flex items-center justify-center flex-shrink-0`}><Icon className="w-4 h-4" /></div>
                  <div className="flex-1">
                    <div className="text-[10px] font-bold tracking-wider text-slate-600">{r.priority}</div>
                    <div className="font-bold text-sm text-slate-900">{r.title}</div>
                    <div className="text-xs text-slate-600 mt-1 mb-2">{r.desc}</div>
                    <button className="text-xs font-semibold text-blue-600 hover:underline">{r.cta} →</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Next Best Action + Upsell */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-blue-600" /> Next Best Actions</h3>
          <div className="space-y-3">
            {nextBestActions.map((a) => {
              const Icon = a.icon;
              return (
                <div key={a.label} className={`flex items-center gap-3 p-3 border ${a.border} rounded-xl bg-gradient-to-r ${a.bg}`}>
                  <div className={`w-10 h-10 rounded-lg ${a.iconBg} flex items-center justify-center`}><Icon className="w-5 h-5" /></div>
                  <div className="flex-1"><div className="font-semibold text-sm">{a.label}</div><div className="text-xs text-slate-500">{a.desc}</div></div>
                  <span className={`badge ${a.badge}`}>{a.tag}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-600" /> Upsell / Cross-sell Opportunities</h3>
          <div className="space-y-3">
            {upsellOpps.map((u) => (
              <div key={u.name} className={`p-4 rounded-xl border ${u.border} bg-gradient-to-br ${u.bg} to-white`}>
                <div className="flex items-center justify-between mb-1"><span className="font-bold text-sm">{u.name}</span><span className={`font-bold ${u.valColor}`}>{u.value}</span></div>
                <div className="text-xs text-slate-500">{u.desc}</div>
                <div className="progress mt-2"><div className="progress-fill" style={{ width: u.pct + '%', background: `linear-gradient(90deg,${u.color})` }}></div></div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-green-50 rounded-xl text-center">
            <div className="text-xs text-slate-500">Total Upsell Pipeline</div>
            <div className="text-2xl font-extrabold text-green-600">$135K</div>
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
    <div className="fos-panel active">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <KpiCard label="RISK ALERTS" value="23" delta="7 critical" deltaColor="text-yellow-600" />
        <KpiCard label="ANOMALIES DETECTED" value="14" delta="3 need review" deltaColor="text-red-600" />
        <KpiCard label="COMPLIANCE SCORE" value="96" delta="Excellent" />
        <KpiCard label="FRAUD BLOCKED" value="$42K" delta="This quarter" />
      </section>

      {/* Risk Map */}
      <section className="glass-strong rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-slate-900 mb-4">Enterprise Risk Map</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {riskMapData.map((r) => (
            <div key={r.label} className={`p-4 rounded-xl border ${r.border} bg-gradient-to-br ${r.bg} to-white`}>
              <div className="flex items-center gap-2 mb-2"><div className={`w-3 h-3 rounded-full ${r.dot}`}></div><span className={`font-bold text-sm ${r.color}`}>{r.label}</span></div>
              <div className={`text-3xl font-extrabold ${r.num}`}>{r.count}</div>
              <div className="text-xs text-slate-600 mt-2 space-y-1">
                {r.items.map((item) => <div key={item}>{item}</div>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Anomaly Feed + Risk Trend */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-600" /> Live Anomaly Detection</h3>
          <div className="space-y-2">
            {anomalyFeed.map((a) => {
              const Icon = a.icon;
              return (
                <div key={a.title} className={`flex items-start gap-3 p-3 rounded-xl border ${a.border} ${a.bg}`}>
                  <Icon className={`w-4 h-4 ${a.iconClass} mt-0.5`} />
                  <div className="flex-1"><div className="font-bold text-sm">{a.title}</div><div className="text-xs text-slate-500">{a.desc}</div></div>
                  <div className="text-xs text-slate-400">{a.time}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Risk Score Trend</h3>
          <div style={{ height: 260 }}>
            <Line data={riskTrendData} options={lineDefaults()} />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   COPILOT PANEL
   ============================================================ */
function CopilotPanel() {
  return (
    <div className="fos-panel active">
      {/* Ask Anything Bar */}
      <section className="mb-6">
        <div className="border-grad p-0.5 rounded-2xl">
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3"><Sparkles className="w-5 h-5 text-blue-600" /><h3 className="font-bold text-slate-900">Ask Cortex Brain Anything</h3></div>
            <div className="flex gap-2 mb-3">
              <input type="text" placeholder="e.g. 'Which customers are most likely to churn next quarter?'" className="flex-1 bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400" />
              <button className="btn-primary"><Send className="w-4 h-4" /> Ask</button>
              <button className="btn-outline"><Mic className="w-4 h-4" /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="chip">Show me revenue breakdown</span>
              <span className="chip">What's at risk this week?</span>
              <span className="chip">Top 10 leads to contact</span>
              <span className="chip">Expense anomalies</span>
              <span className="chip">Forecast Q3</span>
            </div>
          </div>
        </div>
      </section>

      {/* Insights Feed + AI Models */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">AI Insights Feed</h3>
            <button className="text-xs text-blue-600 font-semibold hover:underline">View all →</button>
          </div>
          <div className="space-y-3">
            {CORTEX_DATA.insights.map((i) => (
              <div key={i.title} className="p-4 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/50 to-white hover:shadow-blue transition cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`badge ${tagColor[i.tag]}`}>{i.tag}</span>
                    <span className="text-xs text-slate-500">Confidence <b className="text-blue-600">{i.confidence}%</b></span>
                  </div>
                  <button className="text-slate-400 hover:text-blue-600"><ArrowUpRight className="w-4 h-4" /></button>
                </div>
                <div className="font-bold text-slate-900">{i.title}</div>
                <div className="text-sm text-slate-600 mt-1">{i.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Cpu className="w-4 h-4 text-blue-600" /> AI Models</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center justify-between mb-1"><span className="text-sm font-bold">Claude Opus 4.6</span><span className="badge badge-green">Primary</span></div>
              <div className="text-xs text-slate-600">Reasoning · Analysis · Strategy</div>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
              <div className="flex items-center justify-between mb-1"><span className="text-sm font-bold">GPT-5 Turbo</span><span className="badge badge-blue">Fallback</span></div>
              <div className="text-xs text-slate-600">Content · Drafts · Summaries</div>
            </div>
            <div className="p-3 bg-violet-50 rounded-xl border border-violet-100">
              <div className="flex items-center justify-between mb-1"><span className="text-sm font-bold">Gemini Ultra</span><span className="badge badge-purple">Vision</span></div>
              <div className="text-xs text-slate-600">Image · OCR · PDF Analysis</div>
            </div>
            <div className="p-3 bg-sky-50 rounded-xl border border-sky-100">
              <div className="flex items-center justify-between mb-1"><span className="text-sm font-bold">Cortex-Forecast v3</span><span className="badge badge-blue">Custom</span></div>
              <div className="text-xs text-slate-600">Time Series · Revenue Predict</div>
            </div>
          </div>
        </div>
      </section>

      {/* Knowledge Base + Query History */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><BookOpen className="w-4 h-4 text-blue-600" /> Knowledge Base</h3>
            <button className="btn-outline text-xs"><Upload className="w-4 h-4" /> Upload</button>
          </div>
          <div className="space-y-2">
            {knowledgeBase.map((kb) => {
              const Icon = kb.icon;
              return (
                <div key={kb.name} className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl cursor-pointer">
                  <div className={`w-9 h-9 rounded-lg ${kb.iconBg} flex items-center justify-center`}><Icon className="w-4 h-4" /></div>
                  <div className="flex-1"><div className="text-sm font-semibold">{kb.name}</div><div className="text-xs text-slate-500">{kb.desc}</div></div>
                  <span className={`badge ${kb.badge}`}>{kb.status}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><History className="w-4 h-4 text-blue-600" /> Query History</h3>
          <div className="space-y-3">
            {queryHistory.map((q) => (
              <div key={q.q} className={`p-3 ${q.bg} rounded-xl`}>
                <div className="text-sm font-semibold">{q.q}</div>
                <div className="text-xs text-slate-500 mt-1">{q.who}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prompt Library */}
      <section className="glass-strong rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><BookOpen className="w-4 h-4 text-blue-600" /> Prompt Library</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {[
            { emoji: 'Weekly Report', label: 'Auto-generate', bg: 'bg-blue-50' },
            { emoji: 'Email Draft', label: 'Personalized', bg: 'bg-indigo-50' },
            { emoji: 'Lead Research', label: 'Deep dive', bg: 'bg-violet-50' },
            { emoji: 'Forecast', label: 'Predictive', bg: 'bg-sky-50' },
            { emoji: 'Meeting Notes', label: 'Summarize', bg: 'bg-cyan-50' },
            { emoji: 'Content Ideas', label: 'Creative', bg: 'bg-teal-50' },
          ].map((p) => (
            <div key={p.emoji} className={`p-3 ${p.bg} rounded-xl hover:scale-105 transition cursor-pointer text-center`}>
              <div className="text-sm font-bold">{p.emoji}</div>
              <div className="text-xs text-slate-500">{p.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   LEARNING PANEL
   ============================================================ */
function LearningPanel() {
  return (
    <div className="fos-panel active">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <KpiCard label="TRAINING DATA POINTS" value="2.4M" delta="+184K this month" />
        <KpiCard label="MODEL ACCURACY" value="94.2%" delta="+3.8% since v1" />
        <KpiCard label="FEEDBACK COLLECTED" value="8,420" delta="Thumbs up/down" deltaColor="text-slate-500" />
        <KpiCard label="LAST RETRAINED" value="2 hrs" delta="Auto-retrain daily" />
      </section>

      {/* Model Performance Chart */}
      <section className="glass-strong rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-slate-900 mb-4">Model Performance Over Time</h3>
        <div style={{ height: 280 }}>
          <Line data={modelPerfData} options={{
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } },
            scales: {
              y: { grid: { color: '#f1f5f9' }, ticks: { callback: (v) => v + '%' } },
              y1: { position: 'right', grid: { display: false }, ticks: { callback: (v) => v + 'ms' } },
              x: { grid: { display: false } },
            },
          }} />
        </div>
      </section>

      {/* Feedback Loop + Training Pipeline */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><MessageCircle className="w-4 h-4 text-blue-600" /> User Feedback Summary</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 rounded-xl bg-green-50 text-center">
              <div className="text-3xl font-extrabold text-green-600">92%</div>
              <div className="text-xs text-slate-500 mt-1">Positive feedback</div>
              <div className="text-xs text-green-600 font-semibold">7,747 thumbs up</div>
            </div>
            <div className="p-4 rounded-xl bg-red-50 text-center">
              <div className="text-3xl font-extrabold text-red-500">8%</div>
              <div className="text-xs text-slate-500 mt-1">Negative feedback</div>
              <div className="text-xs text-red-500 font-semibold">673 thumbs down</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-500 tracking-wider mb-2">TOP IMPROVEMENT AREAS</div>
            {[
              { label: 'Financial forecasting precision', delta: '+8%', color: 'blue' },
              { label: 'Lead scoring calibration', delta: '+5%', color: 'indigo' },
              { label: 'Natural language understanding', delta: '+4%', color: 'violet' },
              { label: 'Churn prediction timing', delta: '+3%', color: 'orange' },
            ].map((a) => (
              <div key={a.label} className={`flex items-center gap-2 p-2 bg-${a.color}-50 rounded-lg`}>
                <div className={`w-2 h-2 rounded-full bg-${a.color}-500`}></div>
                <span className="text-sm">{a.label}</span>
                <span className={`ml-auto text-xs font-bold text-${a.color}-600`}>{a.delta}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Workflow className="w-4 h-4 text-violet-600" /> Training Pipeline</h3>
          <div className="space-y-3">
            {trainingPipeline.map((t) => (
              <div key={t.step} className={`p-3 rounded-xl border ${t.border} bg-gradient-to-r ${t.bg} to-white`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${t.numBg} flex items-center justify-center text-sm font-bold`}>{t.step}</div>
                  <div className="flex-1"><div className="font-semibold text-sm">{t.name}</div><div className="text-xs text-slate-500">{t.desc}</div></div>
                  <span className={`badge ${t.badge}`}>{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Model Version History */}
      <section className="glass-strong rounded-2xl overflow-hidden mb-6">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">Model Version History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Version</th><th>Date</th><th>Accuracy</th><th>Improvement</th><th>Training Data</th><th>Status</th></tr></thead>
            <tbody>
              {modelVersions.map((v) => (
                <tr key={v.ver}>
                  <td className="font-semibold text-blue-600">{v.ver}</td>
                  <td className="text-slate-500">{v.date}</td>
                  <td className="font-bold">{v.acc}</td>
                  <td className="text-green-600 font-semibold">{v.imp}</td>
                  <td>{v.data}</td>
                  <td><span className={`badge ${v.badge}`}>{v.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Brain;
