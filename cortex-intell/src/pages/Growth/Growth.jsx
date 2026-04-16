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
  TrendingUp, Share2, Search, Megaphone, Filter, Brain, Workflow,
  ChevronRight, Download, Plus, Sparkles, Activity, Rocket, Eye,
  Calendar, BarChart2, PieChart, Target, Zap, Mail, Globe, Users,
  Flame, UserCheck, Route, Repeat, Settings, Wand2,
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

const campaignPerfData = {
  labels: months6,
  datasets: [
    { label: 'Impressions (K)', data: [680, 740, 820, 910, 1050, 1200], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.1)', tension: 0.4, fill: true },
    { label: 'Clicks (K)', data: [18, 22, 26, 30, 34, 38.2], borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,.08)', tension: 0.4, fill: true },
    { label: 'Conversions', data: [1.2, 1.4, 1.6, 1.9, 2.2, 2.48], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.08)', tension: 0.4, fill: true },
  ],
};

const channelMixData = {
  labels: ['Organic Search', 'Paid Ads', 'Social Media', 'Email', 'Referral', 'Direct'],
  datasets: [{ data: [32, 24, 18, 12, 8, 6], backgroundColor: ['#3b82f6', '#6366f1', '#8b5cf6', '#22d3ee', '#f59e0b', '#10b981'], borderWidth: 0 }],
};

const visitorTrendData = {
  labels: months6,
  datasets: [
    { label: 'Organic', data: [8200, 9400, 10800, 12100, 14200, 16100], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.1)', tension: 0.4, fill: true },
    { label: 'Paid', data: [4800, 5200, 5800, 6400, 7100, 7800], borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,.08)', tension: 0.4, fill: true },
    { label: 'Social', data: [3200, 3600, 4200, 4800, 5400, 6200], borderColor: '#ec4899', backgroundColor: 'rgba(236,72,153,.08)', tension: 0.4, fill: true },
  ],
};

const leadConversionData = {
  labels: ['Visitors', 'Leads', 'MQL', 'SQL', 'Won'],
  datasets: [{ label: 'Count', data: [38200, 2480, 892, 345, 78], backgroundColor: ['#3b82f6', '#6366f1', '#8b5cf6', '#22d3ee', '#10b981'], borderRadius: 8 }],
};

const socialEngData = {
  labels: months6,
  datasets: [
    { label: 'Engagement Rate %', data: [3.2, 3.6, 3.9, 4.2, 4.5, 4.8], borderColor: '#ec4899', backgroundColor: 'rgba(236,72,153,.1)', tension: 0.4, fill: true, pointRadius: 4 },
    { label: 'Industry Avg', data: [3.0, 3.0, 3.0, 3.0, 3.0, 3.0], borderColor: '#94a3b8', borderDash: [5, 5], backgroundColor: 'transparent', tension: 0, pointRadius: 0 },
  ],
};

const seoTrafficData = {
  labels: months6,
  datasets: [
    { label: 'Organic Traffic', data: [8200, 9400, 10800, 12100, 14200, 16100], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.1)', tension: 0.4, fill: true },
    { label: 'Keyword Positions (avg)', data: [18, 15, 12, 10, 8, 6], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.08)', tension: 0.4, fill: true },
  ],
};

const adSpendData = {
  labels: ['Google', 'LinkedIn', 'Meta', 'Email', 'TikTok'],
  datasets: [{ data: [35, 28, 18, 12, 7], backgroundColor: ['#3b82f6', '#0077b5', '#6366f1', '#22d3ee', '#000000'], borderWidth: 0 }],
};

const leadScoreDistData = {
  labels: ['0-20', '21-40', '41-60', '61-80', '81-100'],
  datasets: [{ label: 'Leads', data: [180, 320, 480, 625, 242], backgroundColor: ['#cbd5e1', '#94a3b8', '#6366f1', '#3b82f6', '#10b981'], borderRadius: 8 }],
};

const trafficAttrData = {
  labels: months6,
  datasets: [
    { label: 'Organic', data: [8200, 9400, 10800, 12100, 14200, 16100], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.1)', tension: 0.4, fill: true },
    { label: 'Paid', data: [4800, 5200, 5800, 6400, 7100, 7800], borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,.08)', tension: 0.4, fill: true },
    { label: 'Social', data: [3200, 3600, 4200, 4800, 5400, 6200], borderColor: '#ec4899', backgroundColor: 'rgba(236,72,153,.08)', tension: 0.4, fill: true },
    { label: 'Referral', data: [2400, 2600, 2800, 3100, 3400, 3800], borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,.08)', tension: 0.4, fill: true },
  ],
};

/* ============================================================
   STATIC DATA
   ============================================================ */
const subModuleCards = [
  { tab: 'social', icon: Share2, label: 'Social', sub: 'Posts & Engagement', bg: 'bg-pink-100', text: 'text-pink-600' },
  { tab: 'seo', icon: Search, label: 'SEO', sub: 'Rankings & Authority', bg: 'bg-green-100', text: 'text-green-600' },
  { tab: 'demand', icon: Megaphone, label: 'Demand', sub: 'Ads & Funnels', bg: 'bg-orange-100', text: 'text-orange-600' },
  { tab: 'qualification', icon: Filter, label: 'Qualification', sub: 'Lead Scoring & ICP', bg: 'bg-blue-100', text: 'text-blue-600' },
  { tab: 'intelligence', icon: Brain, label: 'Intelligence', sub: 'Analytics & AI', bg: 'bg-indigo-100', text: 'text-indigo-600' },
  { tab: 'orchestration', icon: Workflow, label: 'Orchestration', sub: 'Workflows & Rules', bg: 'bg-violet-100', text: 'text-violet-600' },
];

const keywords = [
  { keyword: 'AI ERP software', position: '#1', posColor: 'text-green-600', volume: '12,400', traffic: '4,200', trend: '^ 3', trendColor: 'text-green-600', difficulty: 'Hard', diffBadge: 'badge-red' },
  { keyword: 'intelligent business automation', position: '#2', posColor: 'text-green-600', volume: '8,800', traffic: '2,640', trend: '^ 5', trendColor: 'text-green-600', difficulty: 'Medium', diffBadge: 'badge-yellow' },
  { keyword: 'AI CRM platform', position: '#4', posColor: 'text-blue-600', volume: '14,200', traffic: '2,130', trend: '^ 2', trendColor: 'text-green-600', difficulty: 'Hard', diffBadge: 'badge-red' },
  { keyword: 'growth engine marketing', position: '#3', posColor: 'text-blue-600', volume: '6,200', traffic: '1,860', trend: '- 0', trendColor: 'text-slate-400', difficulty: 'Easy', diffBadge: 'badge-green' },
  { keyword: 'cortex intell', position: '#1', posColor: 'text-green-600', volume: '4,800', traffic: '4,320', trend: '^ 0', trendColor: 'text-green-600', difficulty: 'Brand', diffBadge: 'badge-green' },
  { keyword: 'AI financial management', position: '#6', posColor: 'text-blue-600', volume: '9,400', traffic: '1,128', trend: '^ 8', trendColor: 'text-green-600', difficulty: 'Medium', diffBadge: 'badge-yellow' },
];

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
function Growth() {
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
            <span className="text-blue-600 font-semibold">Growth Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Cortex Intell Growth Engine</h1>
          <p className="text-slate-500">AI-Powered Revenue Operating System -- Social, SEO, Ads, Qualification, Intelligence, Orchestration.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline"><Calendar className="w-4 h-4" /> Scheduler</button>
          <button className="btn-outline"><Filter className="w-4 h-4" /> A/B Tests</button>
          <button className="btn-primary"><Rocket className="w-4 h-4" /> New Campaign</button>
        </div>
      </section>

      {/* HERO */}
      <section className="services-hero animate-fade-in-up mb-5">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge badge-blue">FLAGSHIP PRODUCT</span>
            <span className="badge badge-purple">6 SUB-MODULES</span>
          </div>
          <h2 className="text-3xl font-extrabold mb-2">Cortex Intell Growth Engine</h2>
          <p className="text-white/80 max-w-3xl">The full AI-powered revenue operating system. We build and continuously optimize an AI-powered growth system that generates leads, filters them, and improves conversion rates over time.</p>
        </div>
      </section>

      {/* TAB PANELS */}
      {activeTab === 'dashboard' && <DashboardPanel switchTab={switchTab} />}
      {activeTab === 'social' && <SocialPanel />}
      {activeTab === 'seo' && <SEOPanel />}
      {activeTab === 'demand' && <DemandPanel />}
      {activeTab === 'qualification' && <QualificationPanel />}
      {activeTab === 'intelligence' && <IntelligencePanel />}
      {activeTab === 'orchestration' && <OrchestrationPanel />}
    </div>
  );
}

/* ============================================================
   KPI CARD
   ============================================================ */
function KpiCard({ label, value, delta, deltaColor = 'text-green-600', icon, bg }) {
  return (
    <div className="kpi-card card-hover animate-fade-in-up">
      <div className="flex items-start justify-between mb-2">
        <span className="text-[10px] font-bold text-slate-500 tracking-wider">{label}</span>
        {icon && <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center`}>{icon}</div>}
      </div>
      <div className="text-2xl font-extrabold text-slate-900">{value}</div>
      <div className={`text-xs ${deltaColor} font-semibold mt-1`}>{delta}</div>
    </div>
  );
}

/* ============================================================
   DASHBOARD PANEL
   ============================================================ */
function DashboardPanel({ switchTab }) {
  return (
    <div className="fos-panel active" id="panel-dashboard">
      {/* Sub-Module Cards */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-5">
        {subModuleCards.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.tab} className="glass-strong rounded-2xl p-4 card-hover cursor-pointer text-center" onClick={() => switchTab(m.tab)}>
              <div className={`w-10 h-10 rounded-xl ${m.bg} ${m.text} flex items-center justify-center mx-auto mb-2`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="font-bold text-sm text-slate-900">{m.label}</div>
              <div className="text-xs text-slate-500">{m.sub}</div>
            </div>
          );
        })}
      </section>

      {/* Campaign Performance + Channel Mix */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-600" /> Campaign Performance</h3>
          <div style={{ height: 280 }}>
            <Line data={campaignPerfData} options={lineDefaults((v) => v + 'K')} />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><PieChart className="w-4 h-4 text-indigo-600" /> Channel Mix</h3>
          <div style={{ height: 280 }}>
            <Doughnut data={channelMixData} options={doughnutDefaults} />
          </div>
        </div>
      </section>

      {/* Visitor Trend + Lead Conversion */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Eye className="w-4 h-4 text-violet-600" /> Visitor Trend</h3>
          <div style={{ height: 280 }}>
            <Line data={visitorTrendData} options={lineDefaults()} />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><BarChart2 className="w-4 h-4 text-blue-600" /> Lead Conversion Funnel</h3>
          <div style={{ height: 280 }}>
            <Bar data={leadConversionData} options={{
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { y: { grid: { color: '#f1f5f9' } }, x: { grid: { display: false } } },
            }} />
          </div>
        </div>
      </section>

      {/* KPI Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <KpiCard label="ACTIVE CAMPAIGNS" value="24" delta="Running across channels" deltaColor="text-blue-600" icon={<Rocket className="w-3.5 h-3.5 text-blue-600" />} bg="bg-blue-100" />
        <KpiCard label="WEBSITE VISITORS" value="38.2K" delta="+24.8% this month" icon={<Eye className="w-3.5 h-3.5 text-indigo-600" />} bg="bg-indigo-100" />
        <KpiCard label="TOTAL LEADS" value="2,480" delta="+18% vs last month" icon={<Users className="w-3.5 h-3.5 text-violet-600" />} bg="bg-violet-100" />
        <KpiCard label="CONVERSION RATE" value="18.7%" delta="+2.4% improving" icon={<TrendingUp className="w-3.5 h-3.5 text-green-600" />} bg="bg-green-100" />
      </section>

      {/* Recent Activity */}
      <section className="glass-strong rounded-2xl p-6 mb-5">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-indigo-600" /> Recent Activity</h3>
        <div className="space-y-2">
          <ActivityRow icon={<Rocket className="w-4 h-4 text-blue-500" />} title='Campaign Launched' sub='"AI Enterprise Q2" campaign went live across Google & LinkedIn' time="12 min ago" />
          <ActivityRow icon={<Search className="w-4 h-4 text-green-500" />} title='SEO Milestone' sub='"AI ERP software" keyword reached #1 position on Google' time="1 hr ago" />
          <ActivityRow icon={<Filter className="w-4 h-4 text-violet-500" />} title='Lead Qualified' sub='42 new MQLs scored and routed to sales team' time="2 hr ago" />
          <ActivityRow icon={<Share2 className="w-4 h-4 text-pink-500" />} title='Social Viral' sub='LinkedIn post reached 28K impressions with 6.2% engagement' time="3 hr ago" />
          <ActivityRow icon={<Brain className="w-4 h-4 text-indigo-500" />} title='AI Insight' sub='Predicted 22% conversion lift by shifting budget to organic channels' time="5 hr ago" />
        </div>
      </section>

      {/* AI Growth Insights Banner */}
      <section className="glass-blue rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden mb-6">
        <div className="absolute inset-0 opacity-20"><div className="absolute w-48 h-48 bg-white rounded-full blur-3xl -top-20 -right-20 animate-blob"></div></div>
        <div className="relative z-10 w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center"><Sparkles className="w-6 h-6 text-white" /></div>
        <div className="relative z-10 flex-1">
          <div className="font-bold text-white">AI Growth Insights</div>
          <div className="text-white/90 text-sm">Your growth engine is performing 34% above industry benchmarks. AI recommends increasing LinkedIn budget by 20% and launching a webinar series for enterprise leads to maximize Q2 pipeline.</div>
        </div>
        <button className="relative z-10 bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold text-sm hover:scale-105 transition">View Recommendations</button>
      </section>
    </div>
  );
}

/* ============================================================
   SOCIAL PANEL
   ============================================================ */
function SocialPanel() {
  return (
    <div className="fos-panel active" id="panel-social">
      {/* KPIs */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <KpiCard label="TOTAL FOLLOWERS" value="124.8K" delta="+8.2K this month" icon={<Users className="w-3.5 h-3.5 text-pink-600" />} bg="bg-pink-100" />
        <KpiCard label="ENGAGEMENT RATE" value="4.8%" delta="+1.2% vs avg" icon={<TrendingUp className="w-3.5 h-3.5 text-blue-600" />} bg="bg-blue-100" />
        <KpiCard label="POSTS THIS MONTH" value="86" delta="AI-generated: 62" deltaColor="text-slate-500" icon={<Share2 className="w-3.5 h-3.5 text-indigo-600" />} bg="bg-indigo-100" />
        <KpiCard label="SOCIAL LEADS" value="342" delta="+28% conversion" icon={<Target className="w-3.5 h-3.5 text-green-600" />} bg="bg-green-100" />
      </section>

      {/* AI Creative Studio Banner */}
      <section className="glass-blue rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden mb-6">
        <div className="absolute inset-0 opacity-20"><div className="absolute w-48 h-48 bg-white rounded-full blur-3xl -top-20 -right-20 animate-blob"></div></div>
        <div className="relative z-10 w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center"><Wand2 className="w-6 h-6 text-white" /></div>
        <div className="relative z-10 flex-1">
          <div className="font-bold text-white">AI Creative Studio</div>
          <div className="text-white/90 text-sm">Draft ad copy, generate social posts, create carousels, write captions, and auto-schedule across all platforms.</div>
        </div>
        <button className="relative z-10 bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold text-sm hover:scale-105 transition">Create Content</button>
      </section>

      {/* Platform Performance */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <PlatformCard name="LinkedIn" followers="42.3K" color="text-blue-700" metrics={[{ label: 'Impressions', value: '284K' }, { label: 'Engagement', value: '6.2%', color: 'text-green-600' }, { label: 'Leads', value: '142' }]} />
        <PlatformCard name="Instagram" followers="38.1K" color="text-pink-600" metrics={[{ label: 'Reach', value: '156K' }, { label: 'Engagement', value: '5.4%', color: 'text-green-600' }, { label: 'Leads', value: '98' }]} />
        <PlatformCard name="X (Twitter)" followers="28.6K" color="text-sky-500" metrics={[{ label: 'Impressions', value: '412K' }, { label: 'Engagement', value: '3.8%', color: 'text-green-600' }, { label: 'Leads', value: '68' }]} />
        <PlatformCard name="YouTube" followers="15.8K" color="text-red-600" metrics={[{ label: 'Views (MTD)', value: '89K' }, { label: 'Watch Time', value: '4.2 min', color: 'text-green-600' }, { label: 'Leads', value: '34' }]} />
      </section>

      {/* Content Calendar + Engagement Trend */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-600" /> Content Calendar</h3>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-blue-50 rounded-lg flex items-center gap-2"><Share2 className="w-3 h-3 text-pink-600" /><span className="flex-1">Product launch reel -- 10 AM</span><span className="text-slate-400">Today</span></div>
            <div className="p-2 bg-indigo-50 rounded-lg flex items-center gap-2"><Share2 className="w-3 h-3 text-blue-700" /><span className="flex-1">Thought leadership post</span><span className="text-slate-400">Tomorrow</span></div>
            <div className="p-2 bg-violet-50 rounded-lg flex items-center gap-2"><Share2 className="w-3 h-3 text-sky-500" /><span className="flex-1">AI trends thread (8 posts)</span><span className="text-slate-400">Fri</span></div>
            <div className="p-2 bg-red-50 rounded-lg flex items-center gap-2"><Share2 className="w-3 h-3 text-red-600" /><span className="flex-1">Product demo video</span><span className="text-slate-400">Sat</span></div>
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Engagement Trend</h3>
          <div style={{ height: 280 }}>
            <Line data={socialEngData} options={{ ...lineDefaults((v) => v + '%'), scales: { ...lineDefaults().scales, y: { ...lineDefaults().scales.y, min: 0, max: 7 } } }} />
          </div>
        </div>
      </section>

      {/* Trending Topics */}
      <section className="glass-strong rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Flame className="w-4 h-4 text-orange-500" /> Trending Topics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <TrendingRow tag="#AI4Business" stats="84.2K -- +412%" badge="HOT" badgeClass="badge-red" />
          <TrendingRow tag="#AutomationTools" stats="56.8K -- +248%" badge="Rising" badgeClass="badge-blue" />
          <TrendingRow tag="#SaaS2026" stats="42.1K -- +185%" badge="Rising" badgeClass="badge-blue" />
          <TrendingRow tag="#CortexIntell" stats="18.4K -- +624%" badge="Brand" badgeClass="badge-purple" />
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   SEO PANEL
   ============================================================ */
function SEOPanel() {
  return (
    <div className="fos-panel active" id="panel-seo">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <KpiCard label="ORGANIC TRAFFIC" value="16.1K" delta="+34% vs last month" icon={<Search className="w-3.5 h-3.5 text-green-600" />} bg="bg-green-100" />
        <KpiCard label="DOMAIN AUTHORITY" value="62" delta="+4 this quarter" icon={<Globe className="w-3.5 h-3.5 text-blue-600" />} bg="bg-blue-100" />
        <KpiCard label="RANKED KEYWORDS" value="1,842" delta="248 in top 10" icon={<TrendingUp className="w-3.5 h-3.5 text-indigo-600" />} bg="bg-indigo-100" />
        <KpiCard label="BACKLINKS" value="3,420" delta="+186 this month" icon={<Share2 className="w-3.5 h-3.5 text-violet-600" />} bg="bg-violet-100" />
      </section>

      {/* SEO Score + Traffic */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Overall SEO Score</h3>
          <div className="flex items-center justify-center py-4">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90">
                <circle cx="80" cy="80" r="70" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                <circle cx="80" cy="80" r="70" fill="none" stroke="url(#seoGrad)" strokeWidth="12" strokeDasharray="440" strokeDashoffset="88" strokeLinecap="round" />
                <defs><linearGradient id="seoGrad"><stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient></defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600">80</div>
                <div className="text-xs text-slate-500">Excellent</div>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-slate-500">Technical SEO</span><span className="font-bold">94%</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Content Quality</span><span className="font-bold">88%</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Backlinks</span><span className="font-bold">72%</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Page Speed</span><span className="font-bold">68%</span></div>
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6 lg:col-span-2">
          <h3 className="font-bold text-slate-900 mb-4">Organic Traffic Trend</h3>
          <div style={{ height: 280 }}>
            <Line data={seoTrafficData} options={lineDefaults()} />
          </div>
        </div>
      </section>

      {/* Keywords Table */}
      <section className="glass-strong rounded-2xl overflow-hidden mb-6">
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <h3 className="font-bold text-slate-900">Top Ranking Keywords</h3>
          <button className="btn-outline text-xs">View All Keywords</button>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Keyword</th><th>Position</th><th>Volume</th><th>Traffic</th><th>Trend</th><th>Difficulty</th></tr></thead>
            <tbody>
              {keywords.map((k) => (
                <tr key={k.keyword}>
                  <td className="font-semibold">{k.keyword}</td>
                  <td><span className={`font-bold ${k.posColor}`}>{k.position}</span></td>
                  <td>{k.volume}</td>
                  <td className="font-bold">{k.traffic}</td>
                  <td><span className={`${k.trendColor} font-semibold`}>{k.trend}</span></td>
                  <td><span className={`badge ${k.diffBadge}`}>{k.difficulty}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Blog Performance + Backlinks */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">AI Blog Performance</h3>
          <div className="space-y-3">
            <BlogRow title="AI in Enterprise 2026" rank="#1" rankBadge="badge-green" stats="8,420 views -- 342 shares -- 4.2 min read" bg="bg-green-50" />
            <BlogRow title="How AI CRM Boosts Revenue" rank="#3" rankBadge="badge-blue" stats="5,180 views -- 218 shares -- 6.1 min read" bg="bg-blue-50" />
            <BlogRow title="Growth Automation Playbook" rank="#5" rankBadge="badge-blue" stats="3,940 views -- 186 shares -- 8.4 min read" bg="bg-indigo-50" />
            <BlogRow title="Finance OS Deep Dive" rank="#7" rankBadge="badge-blue" stats="2,860 views -- 124 shares -- 5.8 min read" bg="bg-violet-50" />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Backlink Sources</h3>
          <div className="space-y-3">
            <BacklinkRow avatar="TC" bg="bg-blue-200 text-blue-700" name="TechCrunch" da="DA 94 -- 12 backlinks" />
            <BacklinkRow avatar="FS" bg="bg-indigo-200 text-indigo-700" name="Forbes" da="DA 96 -- 8 backlinks" />
            <BacklinkRow avatar="PH" bg="bg-violet-200 text-violet-700" name="Product Hunt" da="DA 91 -- 6 backlinks" />
            <BacklinkRow avatar="G2" bg="bg-green-200 text-green-700" name="G2 Reviews" da="DA 88 -- 4 backlinks" />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   DEMAND PANEL
   ============================================================ */
function DemandPanel() {
  return (
    <div className="fos-panel active" id="panel-demand">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <KpiCard label="ACTIVE CAMPAIGNS" value="24" delta="$77K total spend" deltaColor="text-slate-500" icon={<Rocket className="w-3.5 h-3.5 text-blue-600" />} bg="bg-blue-100" />
        <KpiCard label="AVG. ROAS" value="3.4x" delta="+0.8x vs last Q" icon={<TrendingUp className="w-3.5 h-3.5 text-green-600" />} bg="bg-green-100" />
        <KpiCard label="COST PER LEAD" value="$24" delta="-18% improving" icon={<Target className="w-3.5 h-3.5 text-indigo-600" />} bg="bg-indigo-100" />
        <KpiCard label="LANDING PAGE CVR" value="8.4%" delta="Above 5% benchmark" icon={<Eye className="w-3.5 h-3.5 text-violet-600" />} bg="bg-violet-100" />
      </section>

      {/* Campaigns Table */}
      <section className="glass-strong rounded-2xl overflow-hidden mb-6">
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <h3 className="font-bold text-slate-900">Campaigns Dashboard</h3>
          <button className="btn-primary text-xs"><Plus className="w-3 h-3" /> New Campaign</button>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Campaign</th><th>Channel</th><th>Status</th><th>Spend</th><th>Reach</th><th>ROAS</th></tr></thead>
            <tbody>
              {CORTEX_DATA.campaigns.map((c) => (
                <tr key={c.name} className="clickable">
                  <td className="font-semibold">{c.name}</td>
                  <td className="text-slate-500">{c.channel}</td>
                  <td><span className={`badge ${c.status === 'Active' ? 'badge-green' : c.status === 'Paused' ? 'badge-yellow' : 'badge-blue'}`}>{c.status}</span></td>
                  <td className="font-bold">{c.spend}</td>
                  <td>{c.reach}</td>
                  <td className="font-bold text-green-600">{c.roi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Funnel + Ad Spend */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Conversion Funnel</h3>
          <div className="space-y-3">
            <FunnelStep label="Impressions" value="1.2M" from="blue-500" to="blue-400" ml="" width="100%" />
            <FunnelStep label="Clicks" value="38,200" from="indigo-500" to="indigo-400" ml="ml-4" width="85%" />
            <FunnelStep label="Landing Page Views" value="24,800" from="violet-500" to="violet-400" ml="ml-8" width="65%" />
            <FunnelStep label="Form Fills" value="3,120" from="sky-500" to="sky-400" ml="ml-14" width="40%" />
            <FunnelStep label="Conversions" value="1,247" from="cyan-500" to="cyan-400" ml="ml-20" width="25%" />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Ad Spend by Channel</h3>
          <div style={{ height: 280 }}>
            <Doughnut data={adSpendData} options={doughnutDefaults} />
          </div>
        </div>
      </section>

      {/* Landing Pages */}
      <section className="glass-strong rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-slate-900 mb-4">Landing Page Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-green-100 bg-gradient-to-br from-green-50 to-white">
            <div className="font-bold text-sm">Product Demo Page</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">12.4%</div>
            <div className="text-xs text-slate-500">CVR -- 8,420 visitors -- 1,044 signups</div>
            <span className="badge badge-green mt-2">Top performer</span>
          </div>
          <div className="p-4 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white">
            <div className="font-bold text-sm">Free Trial Landing</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">8.2%</div>
            <div className="text-xs text-slate-500">CVR -- 12,800 visitors -- 1,050 signups</div>
            <span className="badge badge-blue mt-2">High volume</span>
          </div>
          <div className="p-4 rounded-xl border border-yellow-100 bg-gradient-to-br from-yellow-50 to-white">
            <div className="font-bold text-sm">Webinar Registration</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">4.6%</div>
            <div className="text-xs text-slate-500">CVR -- 3,580 visitors -- 165 signups</div>
            <span className="badge badge-yellow mt-2">Needs optimization</span>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   QUALIFICATION PANEL
   ============================================================ */
function QualificationPanel() {
  return (
    <div className="fos-panel active" id="panel-qualification">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <KpiCard label="LEADS SCORED" value="1,847" delta="This month" deltaColor="text-slate-500" icon={<Target className="w-3.5 h-3.5 text-blue-600" />} bg="bg-blue-100" />
        <KpiCard label="MQL -> SQL RATE" value="38.7%" delta="+6% vs target" icon={<TrendingUp className="w-3.5 h-3.5 text-green-600" />} bg="bg-green-100" />
        <KpiCard label="HOT LEADS" value="142" delta="Ready for sales" icon={<Flame className="w-3.5 h-3.5 text-red-600" />} bg="bg-red-100" />
        <KpiCard label="AVG SCORE" value="64" delta="Out of 100" deltaColor="text-slate-500" icon={<Filter className="w-3.5 h-3.5 text-indigo-600" />} bg="bg-indigo-100" />
      </section>

      {/* Lead Scoring + Distribution */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-blue-600" /> AI Lead Scoring Model</h3>
          <div className="space-y-3">
            <ScoringRule label="Company Size > 100" points="+20 pts" color="text-blue-600" sub="Signals enterprise intent" bg="bg-blue-50" />
            <ScoringRule label="Visited Pricing 3+ times" points="+25 pts" color="text-indigo-600" sub="High purchase intent" bg="bg-indigo-50" />
            <ScoringRule label="Downloaded Whitepaper" points="+15 pts" color="text-violet-600" sub="Engaged with content" bg="bg-violet-50" />
            <ScoringRule label="Requested Demo" points="+30 pts" color="text-green-600" sub="Strongest buy signal" bg="bg-green-50" />
            <ScoringRule label="No Activity 30+ days" points="-15 pts" color="text-red-600" sub="Decaying intent" bg="bg-red-50" />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Lead Score Distribution</h3>
          <div style={{ height: 280 }}>
            <Bar data={leadScoreDistData} options={{
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { y: { grid: { color: '#f1f5f9' } }, x: { grid: { display: false } } },
            }} />
          </div>
        </div>
      </section>

      {/* ICP Match + Lead Routing */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><UserCheck className="w-4 h-4 text-green-600" /> ICP (Ideal Customer Profile) Match</h3>
          <div className="space-y-3">
            <ICPRow grade="A+" name="Enterprise SaaS (500+ emp)" leads="284 leads -- 42% conversion rate" acv="$180K ACV" color="text-green-600" bg="bg-green-50" />
            <ICPRow grade="A" name="Mid-Market Tech (100-499)" leads="412 leads -- 28% conversion rate" acv="$65K ACV" color="text-blue-600" bg="bg-blue-50" />
            <ICPRow grade="B" name="Growth Startups (20-99)" leads="628 leads -- 18% conversion rate" acv="$24K ACV" color="text-indigo-600" bg="bg-indigo-50" />
            <ICPRow grade="C" name="Small Business (<20)" leads="523 leads -- 8% conversion rate" acv="$6K ACV" color="text-slate-400" bg="bg-slate-50" />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Route className="w-4 h-4 text-violet-600" /> Lead Routing Rules</h3>
          <div className="space-y-3">
            <RoutingRule icon={<Zap className="w-5 h-5" />} bg="bg-green-100 text-green-600" rule="Score > 80 -> Direct to Sales" sub="Auto-assign to SDR team -- 5 min SLA" />
            <RoutingRule icon={<Mail className="w-5 h-5" />} bg="bg-blue-100 text-blue-600" rule="Score 50-79 -> Nurture Sequence" sub="7-email drip campaign -- 14 days" />
            <RoutingRule icon={<Brain className="w-5 h-5" />} bg="bg-violet-100 text-violet-600" rule="Score < 50 -> AI Re-engage" sub="Retargeting ads + content suggestions" />
            <RoutingRule icon={<Globe className="w-5 h-5" />} bg="bg-orange-100 text-orange-600" rule="Enterprise ICP -> Account Exec" sub="Direct AE assignment -- priority queue" />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   INTELLIGENCE PANEL
   ============================================================ */
function IntelligencePanel() {
  return (
    <div className="fos-panel active" id="panel-intelligence">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <KpiCard label="WEBSITE VISITORS" value="38.2K" delta="+24.8% this month" icon={<Eye className="w-3.5 h-3.5 text-blue-600" />} bg="bg-blue-100" />
        <KpiCard label="OVERALL CVR" value="3.26%" delta="+0.4% improving" icon={<TrendingUp className="w-3.5 h-3.5 text-green-600" />} bg="bg-green-100" />
        <KpiCard label="CUSTOMER LTV" value="$48.2K" delta="+12% YoY" icon={<Target className="w-3.5 h-3.5 text-indigo-600" />} bg="bg-indigo-100" />
        <KpiCard label="CAC" value="$2,840" delta="LTV:CAC = 17:1" icon={<TrendingUp className="w-3.5 h-3.5 text-violet-600" />} bg="bg-violet-100" />
      </section>

      {/* Traffic + Attribution */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6 lg:col-span-2">
          <h3 className="font-bold text-slate-900 mb-4">Website Traffic & Conversions</h3>
          <div style={{ height: 280 }}>
            <Line data={trafficAttrData} options={lineDefaults()} />
          </div>
          <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
            <div><div className="text-xs text-slate-500">Organic</div><div className="font-bold text-slate-900">42%</div></div>
            <div><div className="text-xs text-slate-500">Paid Ads</div><div className="font-bold text-slate-900">28%</div></div>
            <div><div className="text-xs text-slate-500">Social</div><div className="font-bold text-slate-900">18%</div></div>
            <div><div className="text-xs text-slate-500">Referral</div><div className="font-bold text-slate-900">12%</div></div>
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Channel Attribution</h3>
          <div style={{ height: 260 }}>
            <Doughnut data={channelMixData} options={doughnutDefaults} />
          </div>
        </div>
      </section>

      {/* A/B Tests + AI Segments */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Filter className="w-4 h-4 text-blue-600" /> A/B Test Results</h3>
          <div className="space-y-3">
            <ABTestRow title="Hero CTA Button" result="Variant B: +24% conversion -- 95% confidence" badge="Winner" badgeClass="badge-green" pctA={48} pctB={72} />
            <ABTestRow title="Pricing Page Layout" result="Day 5/14 -- 68% confidence" badge="Running" badgeClass="badge-yellow" pctA={42} pctB={51} />
            <ABTestRow title="Email Subject Lines" result="Best subject line +38% open rate" badge="Winner" badgeClass="badge-green" pctA={38} pctB={76} />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-blue-600" /> AI Audience Segments</h3>
          <div className="space-y-3">
            <SegmentRow name="High-Intent Buyers" count="2,847" sub="Visited pricing 3+ times -- Score > 75" bg="bg-blue-50" color="text-blue-600" />
            <SegmentRow name="Enterprise Leads" count="892" sub="Company size 500+ -- Decision makers" bg="bg-indigo-50" color="text-indigo-600" />
            <SegmentRow name="Re-engagement" count="1,542" sub="Inactive 30+ days -- Previously engaged" bg="bg-violet-50" color="text-violet-600" />
            <SegmentRow name="Content Subscribers" count="4,210" sub="Newsletter opens 80%+ -- Blog readers" bg="bg-sky-50" color="text-sky-600" />
          </div>
        </div>
      </section>

      {/* AI Growth Insights */}
      <section className="glass-strong rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-violet-600" /> AI Growth Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
            <div className="text-[10px] font-bold tracking-wider text-green-700 mb-1">OPPORTUNITY</div>
            <div className="font-bold text-sm text-slate-900">LinkedIn outperforming by 3x</div>
            <div className="text-xs text-slate-600 mt-1">Shift 20% budget from Twitter to LinkedIn. Estimated +$142K pipeline.</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200">
            <div className="text-[10px] font-bold tracking-wider text-yellow-700 mb-1">WARNING</div>
            <div className="font-bold text-sm text-slate-900">Google CPC rising 18%</div>
            <div className="text-xs text-slate-600 mt-1">Consider shifting to SEO content. Organic leads cost 68% less than paid.</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
            <div className="text-[10px] font-bold tracking-wider text-blue-700 mb-1">RECOMMENDATION</div>
            <div className="font-bold text-sm text-slate-900">Launch webinar series</div>
            <div className="text-xs text-slate-600 mt-1">Webinar leads convert at 28% vs 12% for ads. AI suggests "AI in Enterprise" topic.</div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   ORCHESTRATION PANEL
   ============================================================ */
function OrchestrationPanel() {
  return (
    <div className="fos-panel active" id="panel-orchestration">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <KpiCard label="ACTIVE WORKFLOWS" value="18" delta="All running" icon={<Workflow className="w-3.5 h-3.5 text-violet-600" />} bg="bg-violet-100" />
        <KpiCard label="AUTOMATIONS RUN (MTD)" value="12,480" delta="+34% vs last month" icon={<Zap className="w-3.5 h-3.5 text-blue-600" />} bg="bg-blue-100" />
        <KpiCard label="TIME SAVED" value="248 hrs" delta="~$24.8K value" icon={<TrendingUp className="w-3.5 h-3.5 text-green-600" />} bg="bg-green-100" />
        <KpiCard label="SUCCESS RATE" value="99.2%" delta="0 failures today" icon={<Target className="w-3.5 h-3.5 text-indigo-600" />} bg="bg-indigo-100" />
      </section>

      {/* Active Workflows */}
      <section className="glass-strong rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2"><Workflow className="w-4 h-4 text-violet-600" /> Active Workflows</h3>
          <button className="btn-primary text-xs"><Plus className="w-3 h-3" /> New Workflow</button>
        </div>
        <div className="space-y-3">
          <WorkflowRow icon={<Zap className="w-5 h-5" />} bg="bg-green-100 text-green-600" border="border-green-100" bgGrad="from-green-50" title="Lead -> Score -> Route -> Nurture" sub="New lead received -> AI scoring -> Route to SDR or nurture sequence -> Follow-up" runs="4,280 runs" success="99.8% success" color="text-green-600" />
          <WorkflowRow icon={<Mail className="w-5 h-5" />} bg="bg-blue-100 text-blue-600" border="border-blue-100" bgGrad="from-blue-50" title="Welcome Email -> Drip Campaign" sub="Signup -> Welcome email -> 7-day drip -> Re-score -> Handoff to sales" runs="2,840 runs" success="98.4% success" color="text-blue-600" />
          <WorkflowRow icon={<Share2 className="w-5 h-5" />} bg="bg-violet-100 text-violet-600" border="border-violet-100" bgGrad="from-violet-50" title="Social Auto-Post -> Engage -> Report" sub="AI generates content -> Schedule -> Auto-reply to comments -> Weekly analytics" runs="1,860 runs" success="99.1% success" color="text-violet-600" />
          <WorkflowRow icon={<Repeat className="w-5 h-5" />} bg="bg-indigo-100 text-indigo-600" border="border-indigo-100" bgGrad="from-indigo-50" title="Churn Risk -> Re-engage -> Upsell" sub="Detect churn signals -> Trigger re-engagement -> Offer upgrade discount" runs="980 runs" success="97.2% success" color="text-indigo-600" />
          <WorkflowRow icon={<Megaphone className="w-5 h-5" />} bg="bg-sky-100 text-sky-600" border="border-sky-100" bgGrad="from-sky-50" title="Campaign Launch -> Monitor -> Optimize" sub="Launch ad campaign -> Monitor performance hourly -> Auto-adjust bids & budgets" runs="2,520 runs" success="99.6% success" color="text-sky-600" />
        </div>
      </section>

      {/* Automation Rules + Integration */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Settings className="w-4 h-4 text-blue-600" /> Automation Rules</h3>
          <div className="space-y-2">
            <AutoRule rule='IF lead score > 80 THEN notify sales on Slack' />
            <AutoRule rule='IF email bounced THEN remove + flag in CRM' />
            <AutoRule rule='IF ad ROAS < 2x THEN pause + alert marketing' />
            <AutoRule rule='IF blog post published THEN auto-share on all social' />
            <AutoRule rule='IF deal closed THEN trigger onboarding workflow' />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Workflow className="w-4 h-4 text-violet-600" /> Connected Systems</h3>
          <div className="space-y-3">
            <ConnectedSystem name="CRM 360" status="Bi-directional sync" badge="Live" badgeClass="badge-green" />
            <ConnectedSystem name="Finance OS" status="Invoice triggers" badge="Live" badgeClass="badge-green" />
            <ConnectedSystem name="HRM" status="Employee advocacy" badge="Live" badgeClass="badge-green" />
            <ConnectedSystem name="Cortex Brain" status="AI scoring & predictions" badge="Live" badgeClass="badge-green" />
            <ConnectedSystem name="n8n Workflows" status="18 active workflows" badge="Running" badgeClass="badge-blue" />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   SHARED SUB-COMPONENTS
   ============================================================ */
function ActivityRow({ icon, title, sub, time }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100">
      {icon}
      <div className="flex-1 text-sm"><span className="font-semibold">{title}</span> -- {sub}</div>
      <div className="text-xs text-slate-400">{time}</div>
    </div>
  );
}

function PlatformCard({ name, followers, color, metrics }) {
  return (
    <div className="glass-strong rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3"><span className={`font-bold text-sm ${color}`}>{name}</span></div>
      <div className="text-xl font-extrabold text-slate-900">{followers}</div>
      <div className="text-xs text-slate-500">followers</div>
      <div className="mt-2 space-y-1 text-xs">
        {metrics.map((m) => (
          <div key={m.label} className="flex justify-between"><span className="text-slate-500">{m.label}</span><span className={`font-bold ${m.color || ''}`}>{m.value}</span></div>
        ))}
      </div>
    </div>
  );
}

function TrendingRow({ tag, stats, badge, badgeClass }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
      <div className="flex-1"><div className="text-sm font-semibold">{tag}</div><div className="text-xs text-slate-500">{stats}</div></div>
      <span className={`badge ${badgeClass}`}>{badge}</span>
    </div>
  );
}

function BlogRow({ title, rank, rankBadge, stats, bg }) {
  return (
    <div className={`p-3 ${bg} rounded-xl`}>
      <div className="flex items-center justify-between mb-1"><span className="text-sm font-semibold">{title}</span><span className={`badge ${rankBadge}`}>{rank}</span></div>
      <div className="text-xs text-slate-500">{stats}</div>
    </div>
  );
}

function BacklinkRow({ avatar, bg, name, da }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
      <div className={`avatar avatar-sm ${bg}`}>{avatar}</div>
      <div className="flex-1"><div className="font-semibold text-sm">{name}</div><div className="text-xs text-slate-500">{da}</div></div>
      <span className="badge badge-green">DoFollow</span>
    </div>
  );
}

function FunnelStep({ label, value, from, to, ml, width }) {
  return (
    <div className={`p-3 bg-gradient-to-r from-${from} to-${to} rounded-xl text-white ${ml}`} style={{ width }}>
      <div className="flex justify-between text-sm font-bold"><span>{label}</span><span>{value}</span></div>
    </div>
  );
}

function ScoringRule({ label, points, color, sub, bg }) {
  return (
    <div className={`p-3 ${bg} rounded-xl`}>
      <div className="flex items-center justify-between mb-1"><span className="text-sm font-semibold">{label}</span><span className={`font-bold ${color}`}>{points}</span></div>
      <div className="text-xs text-slate-500">{sub}</div>
    </div>
  );
}

function ICPRow({ grade, name, leads, acv, color, bg }) {
  return (
    <div className={`p-3 ${bg} rounded-xl flex items-center gap-3`}>
      <div className={`text-2xl font-extrabold ${color}`}>{grade}</div>
      <div className="flex-1"><div className="font-semibold text-sm">{name}</div><div className="text-xs text-slate-500">{leads}</div></div>
      <span className={`font-bold ${color}`}>{acv}</span>
    </div>
  );
}

function RoutingRule({ icon, bg, rule, sub }) {
  return (
    <div className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl">
      <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>{icon}</div>
      <div className="flex-1"><div className="font-semibold text-sm">{rule}</div><div className="text-xs text-slate-500">{sub}</div></div>
      <span className="badge badge-green">Active</span>
    </div>
  );
}

function ABTestRow({ title, result, badge, badgeClass, pctA, pctB }) {
  return (
    <div className="p-3 rounded-xl border border-blue-100">
      <div className="flex items-center justify-between mb-1"><span className="text-sm font-semibold">{title}</span><span className={`badge ${badgeClass}`}>{badge}</span></div>
      <div className="text-xs text-slate-500 mb-2">{result}</div>
      <div className="flex gap-1">
        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-blue-400" style={{ width: `${pctA}%` }}></div></div>
        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-blue-600" style={{ width: `${pctB}%` }}></div></div>
      </div>
    </div>
  );
}

function SegmentRow({ name, count, sub, bg, color }) {
  return (
    <div className={`p-3 ${bg} rounded-xl`}>
      <div className="flex items-center justify-between mb-1"><span className="text-sm font-semibold">{name}</span><span className={`text-xs ${color} font-bold`}>{count}</span></div>
      <div className="text-xs text-slate-500">{sub}</div>
    </div>
  );
}

function WorkflowRow({ icon, bg, border, bgGrad, title, sub, runs, success, color }) {
  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border ${border} bg-gradient-to-r ${bgGrad} to-white`}>
      <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>{icon}</div>
      <div className="flex-1">
        <div className="font-bold text-sm">{title}</div>
        <div className="text-xs text-slate-500">{sub}</div>
      </div>
      <div className="text-right">
        <div className={`text-xs font-bold ${color}`}>{runs}</div>
        <div className="text-xs text-slate-400">{success}</div>
      </div>
      <span className="badge badge-green">Active</span>
    </div>
  );
}

function AutoRule({ rule }) {
  return (
    <div className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl">
      <div className="w-2 h-2 rounded-full bg-green-500"></div>
      <div className="flex-1 text-sm">{rule}</div>
      <span className="badge badge-green">On</span>
    </div>
  );
}

function ConnectedSystem({ name, status, badge, badgeClass }) {
  return (
    <div className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl">
      <div className="flex-1"><div className="font-semibold text-sm">{name}</div><div className="text-xs text-slate-500">{status}</div></div>
      <span className={`badge ${badgeClass}`}>{badge}</span>
    </div>
  );
}

export default Growth;
