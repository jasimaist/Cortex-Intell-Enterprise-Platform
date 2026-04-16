import { useState, useEffect, useRef } from 'react';
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
  MessageCircle, Search as SearchIcon, Zap, Brain, BookOpen, Globe,
  ChevronRight, Download, Filter, Plus, Sparkles, Activity, TrendingUp,
  CheckCircle, AlertTriangle, Clock, Send, Bot, User, Settings,
  Smartphone, Mail, Phone, Video, Hash, MessageSquare, FileText,
  BarChart3, Target, Cpu, RefreshCw, Eye, ListChecks, Layers,
  Database, Link2, Gauge,
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
const conversationVolumeData = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    { label: 'Total Conversations', data: [1200, 1450, 1680, 1920, 2180, 2400], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.12)', tension: 0.4, fill: true },
    { label: 'AI Resolved', data: [1020, 1260, 1470, 1730, 1980, 2256], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.08)', tension: 0.4, fill: true },
  ],
};

const resolutionRateData = {
  labels: ['AI Resolved', 'Human Handoff', 'Pending'],
  datasets: [{ data: [94, 4, 2], backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'], borderWidth: 0 }],
};

const responseTimeData = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    { label: 'Avg Response (s)', data: [2.8, 2.4, 2.0, 1.6, 1.4, 1.2], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.12)', tension: 0.4, fill: true, pointRadius: 4 },
    { label: 'Target', data: [2.0, 2.0, 2.0, 2.0, 2.0, 2.0], borderColor: '#94a3b8', borderDash: [5, 5], backgroundColor: 'transparent', tension: 0, pointRadius: 0 },
  ],
};

const channelUsageData = {
  labels: ['Web', 'Mobile', 'Slack', 'Teams', 'Email', 'WhatsApp'],
  datasets: [{ label: 'Sessions', data: [820, 540, 380, 290, 210, 160], backgroundColor: ['#3b82f6', '#6366f1', '#8b5cf6', '#22d3ee', '#f59e0b', '#10b981'], borderRadius: 8 }],
};

const queryTypesData = {
  labels: ['Data Query', 'Action Request', 'Navigation', 'Report Gen', 'Insights', 'Other'],
  datasets: [{ data: [32, 24, 18, 14, 8, 4], backgroundColor: ['#3b82f6', '#6366f1', '#8b5cf6', '#22d3ee', '#f59e0b', '#10b981'], borderWidth: 0 }],
};

const channelChartData = {
  labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    { label: 'Web', data: [420, 480, 560, 640, 720, 820], borderColor: '#3b82f6', tension: 0.4, pointRadius: 3 },
    { label: 'Mobile', data: [280, 320, 380, 420, 480, 540], borderColor: '#6366f1', tension: 0.4, pointRadius: 3 },
    { label: 'Slack', data: [180, 210, 260, 300, 340, 380], borderColor: '#8b5cf6', tension: 0.4, pointRadius: 3 },
    { label: 'WhatsApp', data: [60, 80, 100, 120, 140, 160], borderColor: '#10b981', tension: 0.4, pointRadius: 3 },
  ],
};

/* ============================================================
   SUB-MODULE CARDS
   ============================================================ */
const subModuleCards = [
  { tab: 'chat', icon: MessageCircle, label: 'Chat', sub: 'Live Interface', bg: 'bg-blue-100', text: 'text-blue-600' },
  { tab: 'query', icon: SearchIcon, label: 'Query Engine', sub: '98.4% Accuracy', bg: 'bg-indigo-100', text: 'text-indigo-600' },
  { tab: 'tasks', icon: Zap, label: 'Task Execution', sub: '1.2K Delegated', bg: 'bg-violet-100', text: 'text-violet-600' },
  { tab: 'context', icon: Brain, label: 'Context', sub: 'Multi-aware', bg: 'bg-sky-100', text: 'text-sky-600' },
  { tab: 'knowledge', icon: BookOpen, label: 'Knowledge', sub: '8 Sources', bg: 'bg-orange-100', text: 'text-orange-600' },
  { tab: 'channels', icon: Globe, label: 'Channels', sub: '6 Active', bg: 'bg-green-100', text: 'text-green-600' },
];

/* ============================================================
   STATIC DATA
   ============================================================ */
const topQueries = [
  { query: 'Show me this month\'s revenue', count: 342, trend: '+12%' },
  { query: 'Which deals are at risk?', count: 286, trend: '+8%' },
  { query: 'Who\'s on leave today?', count: 224, trend: '+15%' },
  { query: 'Run a finance report', count: 198, trend: '+5%' },
  { query: 'Show me open projects', count: 176, trend: '+22%' },
  { query: 'What are my top recommendations?', count: 154, trend: '+18%' },
];

const recentQueries = [
  { query: 'Show pipeline value by stage', type: 'Data Query', module: 'CRM', time: '2 min ago', status: 'Resolved' },
  { query: 'Create a new lead for Apex Corp', type: 'Action', module: 'CRM', time: '8 min ago', status: 'Executed' },
  { query: 'Compare Q1 vs Q2 revenue', type: 'Report', module: 'Finance', time: '15 min ago', status: 'Resolved' },
  { query: 'Who has performance reviews due?', type: 'Data Query', module: 'HR', time: '22 min ago', status: 'Resolved' },
  { query: 'Schedule a demo with TechCorp', type: 'Action', module: 'CRM', time: '30 min ago', status: 'Executed' },
  { query: 'Show me project burndown chart', type: 'Navigation', module: 'Projects', time: '45 min ago', status: 'Resolved' },
];

const taskLog = [
  { task: 'Send proposal email to TechCorp NSW', agent: 'Outreach Assistant', status: 'Completed', time: '5 min ago', module: 'CRM' },
  { task: 'Generate Q1 financial summary', agent: 'Finance Guardian', status: 'Completed', time: '12 min ago', module: 'Finance' },
  { task: 'Schedule team standup meeting', agent: 'Meeting Scribe', status: 'Completed', time: '20 min ago', module: 'Projects' },
  { task: 'Flag at-risk employee accounts', agent: 'HR Onboarder', status: 'In Progress', time: '30 min ago', module: 'HR' },
  { task: 'Clean duplicate CRM contacts', agent: 'Data Janitor', status: 'Completed', time: '45 min ago', module: 'CRM' },
  { task: 'Draft blog post on AI trends', agent: 'Content Writer', status: 'In Progress', time: '1h ago', module: 'Growth' },
];

const knowledgeSources = [
  { name: 'Company Documentation', docs: 1240, type: 'Internal Wiki', status: 'Indexed', lastSync: '2 min ago' },
  { name: 'Product Knowledge Base', docs: 860, type: 'Help Center', status: 'Indexed', lastSync: '5 min ago' },
  { name: 'CRM Records', docs: 48000, type: 'Database', status: 'Live Sync', lastSync: 'Real-time' },
  { name: 'Finance Reports', docs: 324, type: 'Documents', status: 'Indexed', lastSync: '1h ago' },
  { name: 'HR Policies', docs: 86, type: 'Policy Docs', status: 'Indexed', lastSync: '3h ago' },
  { name: 'Project Docs', docs: 420, type: 'Confluence', status: 'Indexed', lastSync: '30 min ago' },
  { name: 'Email History', docs: 12400, type: 'Email Archive', status: 'Indexed', lastSync: '15 min ago' },
  { name: 'Slack Conversations', docs: 8200, type: 'Chat History', status: 'Indexed', lastSync: '10 min ago' },
];

const channels = [
  { name: 'Web Widget', icon: Globe, status: 'Active', sessions: 820, satisfaction: '96%', color: 'blue' },
  { name: 'Mobile App', icon: Smartphone, status: 'Active', sessions: 540, satisfaction: '94%', color: 'indigo' },
  { name: 'Slack', icon: Hash, status: 'Active', sessions: 380, satisfaction: '97%', color: 'violet' },
  { name: 'Microsoft Teams', icon: MessageSquare, status: 'Active', sessions: 290, satisfaction: '95%', color: 'sky' },
  { name: 'Email', icon: Mail, status: 'Active', sessions: 210, satisfaction: '91%', color: 'orange' },
  { name: 'WhatsApp', icon: Phone, status: 'Active', sessions: 160, satisfaction: '93%', color: 'green' },
];

const initialMessages = [
  { role: 'bot', text: 'Hello! I\'m Cortex AI Assistant. I can help you query data, run reports, manage tasks, and navigate the Cortex Intell platform. How can I assist you today?', time: '9:00 AM' },
  { role: 'user', text: 'Show me this month\'s revenue', time: '9:01 AM' },
  { role: 'bot', text: 'This month\'s total revenue is $3.92M, which is up 12.5% compared to last month ($3.48M). Top contributors:\n\n- TechCorp NSW: $820K\n- PrimeEdge Solutions: $520K\n- Summit Ventures: $450K\n\nWould you like me to generate a detailed breakdown by account or export a report?', time: '9:01 AM' },
  { role: 'user', text: 'Which deals are at risk?', time: '9:02 AM' },
  { role: 'bot', text: 'I found 2 deals currently at risk:\n\n1. Horizon Group - $210K (Score: 85, but engagement dropping)\n   - No response to last 2 emails\n   - Recommend: Schedule a call with Maria Santos this week\n\n2. Project Alpha - TechCorp NSW dependency\n   - 2 blockers in dependency chain\n   - Recommend: Escalate to project lead\n\nWould you like me to take action on either of these?', time: '9:02 AM' },
];

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
function Chatbot() {
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
            <span className="text-blue-600 font-semibold">Cortex Intell AI Chatbot</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Cortex Intell AI Chatbot</h1>
          <p className="text-slate-500">Converse. Query. Execute. Assist.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline"><Download className="w-4 h-4" /> Export</button>
          <button className="btn-outline"><Filter className="w-4 h-4" /> Filter</button>
          <button className="btn-primary" onClick={() => switchTab('chat')}><MessageCircle className="w-4 h-4" /> Open Chat</button>
        </div>
      </section>

      {/* KPI STRIP */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard label="CONVERSATIONS" value="2.4K" delta="+18% this month" icon={<MessageCircle className="w-5 h-5" />} bg="bg-blue-100" text="text-blue-600" />
        <KpiCard label="RESOLUTION RATE" value="94%" delta="+2.1% improvement" icon={<CheckCircle className="w-5 h-5" />} bg="bg-green-100" text="text-green-600" />
        <KpiCard label="AVG RESPONSE" value="1.2s" delta="-0.4s faster" icon={<Clock className="w-5 h-5" />} bg="bg-indigo-100" text="text-indigo-600" />
        <KpiCard label="CHANNELS" value="6" delta="All active" icon={<Globe className="w-5 h-5" />} bg="bg-violet-100" text="text-violet-600" />
      </section>

      {/* AI COPILOT */}
      <section className="mb-6">
        <div className="glass-blue rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute w-48 h-48 bg-white rounded-full blur-3xl -top-20 -right-20 animate-blob"></div>
          </div>
          <div className="relative z-10 w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="relative z-10 flex-1">
            <div className="font-bold text-white">AI Chatbot Intelligence</div>
            <div className="text-white/90 text-sm">Conversation quality up 18% this month. Top query: "Show me revenue" (342 times). NLP accuracy at 98.4%. Recommend adding FAQ entries for 3 recurring unanswered queries.</div>
          </div>
          <button className="relative z-10 bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold text-sm hover:scale-105 transition" onClick={() => switchTab('chat')}>Start Chat</button>
        </div>
      </section>

      {/* TAB PANELS */}
      {activeTab === 'dashboard' && <DashboardPanel switchTab={switchTab} />}
      {activeTab === 'chat' && <ChatPanel />}
      {activeTab === 'query' && <QueryPanel />}
      {activeTab === 'tasks' && <TasksPanel />}
      {activeTab === 'context' && <ContextPanel />}
      {activeTab === 'knowledge' && <KnowledgePanel />}
      {activeTab === 'channels' && <ChannelsPanel />}
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
    <div className="fos-panel active">
      {/* Sub-Module Cards */}
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

      {/* Row 1: Conversation Volume + Resolution Rate */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-600" /> Conversation Volume</h3>
            <span className="badge badge-green">+18%</span>
          </div>
          <div style={{ height: 240 }}>
            <Line data={conversationVolumeData} options={lineDefaults()} />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /> Resolution Rate</h3>
            <span className="text-xs text-slate-500">94% AI Resolved</span>
          </div>
          <div style={{ height: 240 }}>
            <Doughnut data={resolutionRateData} options={doughnutDefaults} />
          </div>
        </div>
      </section>

      {/* Row 2: Response Time + Channel Usage */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><Clock className="w-4 h-4 text-indigo-600" /> Response Time Trend</h3>
            <span className="badge badge-green">1.2s avg</span>
          </div>
          <div style={{ height: 240 }}>
            <Line data={responseTimeData} options={{ ...lineDefaults((v) => v + 's'), scales: { ...lineDefaults((v) => v + 's').scales, y: { ...lineDefaults((v) => v + 's').scales.y, min: 0, max: 4 } } }} />
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><Globe className="w-4 h-4 text-violet-600" /> Channel Usage</h3>
            <span className="text-xs text-slate-500">6 Active Channels</span>
          </div>
          <div style={{ height: 240 }}>
            <Bar
              data={channelUsageData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { grid: { color: '#f1f5f9' }, beginAtZero: true }, x: { grid: { display: false } } },
              }}
            />
          </div>
        </div>
      </section>

      {/* Row 3: Top Queries + Recent Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><SearchIcon className="w-4 h-4 text-blue-600" /> Top Queries</h3>
            <button className="btn-outline text-xs" onClick={() => switchTab('query')}>View All</button>
          </div>
          <div className="space-y-3">
            {topQueries.map((q, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-blue-50/40 transition cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold text-sm">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-slate-900 truncate">{q.query}</div>
                  <div className="text-xs text-slate-500">{q.count} times</div>
                </div>
                <span className="text-xs text-green-600 font-semibold">{q.trend}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><Activity className="w-4 h-4 text-cyan-600" /> Recent Activity</h3>
          </div>
          <div className="space-y-3">
            <ActivityRow icon={<MessageCircle className="w-4 h-4" />} bg="bg-blue-100 text-blue-600" title="Revenue query answered via Web" sub="User asked about Q2 projections -- 2 min ago" />
            <ActivityRow icon={<Zap className="w-4 h-4" />} bg="bg-violet-100 text-violet-600" title="Task delegated to Finance Agent" sub="Generated monthly P&L report -- 8 min ago" />
            <ActivityRow icon={<CheckCircle className="w-4 h-4" />} bg="bg-green-100 text-green-600" title="Query resolved via Slack" sub="Employee leave balance query -- 15 min ago" />
            <ActivityRow icon={<Brain className="w-4 h-4" />} bg="bg-indigo-100 text-indigo-600" title="Context switch: CRM to Finance" sub="User transitioned modules seamlessly -- 22 min ago" />
            <ActivityRow icon={<BookOpen className="w-4 h-4" />} bg="bg-orange-100 text-orange-600" title="Knowledge base hit: HR Policies" sub="Found leave policy in 0.3s -- 30 min ago" />
            <ActivityRow icon={<Globe className="w-4 h-4" />} bg="bg-cyan-100 text-cyan-600" title="WhatsApp session started" sub="New conversation via mobile -- 45 min ago" />
          </div>
        </div>
      </section>

      {/* AI Insights */}
      <section className="glass-blue rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden mb-6">
        <div className="absolute inset-0 opacity-20"><div className="absolute w-48 h-48 bg-white rounded-full blur-3xl -top-20 -right-20 animate-blob"></div></div>
        <div className="relative z-10 w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="relative z-10 flex-1">
          <div className="font-bold text-white">AI Chatbot Insights</div>
          <div className="text-white/90 text-sm">94% of queries resolved without human intervention. Response time improved 33% over 6 months. Top unresolved topic: "Custom report generation" -- consider adding a guided workflow. 3 new FAQ entries recommended.</div>
        </div>
        <button className="relative z-10 bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold text-sm hover:scale-105 transition">View All Insights</button>
      </section>
    </div>
  );
}

/* ============================================================
   CHAT PANEL
   ============================================================ */
function ChatPanel() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botMsg = {
        role: 'bot',
        text: `I understand you're asking about "${input}". Let me look that up in the Cortex Intell system...\n\nI've found relevant data across your modules. Would you like me to generate a detailed report, take an action, or navigate you to the relevant dashboard?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1200);
  };

  return (
    <div className="fos-panel active">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-blue-100 text-blue-600"><MessageCircle className="w-5 h-5" /></div>
          <div><h2>Chat Interface</h2><p>Conversational AI assistant powered by Cortex Brain</p></div>
        </div>

        <div className="glass-strong rounded-2xl overflow-hidden" style={{ height: 560 }}>
          {/* Messages */}
          <div className="p-5 space-y-4 overflow-y-auto" style={{ height: 480 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === 'bot' ? 'bg-blue-100 text-blue-600' : 'bg-violet-100 text-violet-600'}`}>
                  {msg.role === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div className={`max-w-[70%] rounded-2xl p-4 ${msg.role === 'bot' ? 'bg-slate-50 border border-slate-100' : 'bg-blue-600 text-white'}`}>
                  <div className={`text-sm whitespace-pre-wrap ${msg.role === 'bot' ? 'text-slate-800' : 'text-white'}`}>{msg.text}</div>
                  <div className={`text-[10px] mt-2 ${msg.role === 'bot' ? 'text-slate-400' : 'text-blue-200'}`}>{msg.time}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-100 bg-white">
            <div className="flex gap-2">
              <input
                className="flex-1 px-4 py-3 bg-blue-50/50 border border-blue-100 rounded-xl outline-none text-sm"
                placeholder="Ask Cortex AI anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button className="btn-primary px-4" onClick={handleSend}><Send className="w-4 h-4" /></button>
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              {CORTEX_DATA.chatSuggestions.slice(0, 4).map((s, i) => (
                <button key={i} className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium" onClick={() => setInput(s)}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   QUERY PANEL
   ============================================================ */
function QueryPanel() {
  return (
    <div className="fos-panel active">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-indigo-100 text-indigo-600"><SearchIcon className="w-5 h-5" /></div>
          <div><h2>Query & Response Engine</h2><p>NLP processing, query classification, and response generation</p></div>
        </div>

        {/* Query Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard value="98.4%" label="NLP Accuracy" color="text-blue-600" />
          <StatCard value="1.2s" label="Avg Response" color="text-green-600" />
          <StatCard value="6" label="Query Types" color="text-violet-600" />
          <StatCard value="2.4K" label="Queries/Month" color="text-indigo-600" />
        </div>

        {/* Query Types + Recent Queries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-blue-600" /> Query Types Breakdown</h3>
            <div style={{ height: 240 }}>
              <Doughnut data={queryTypesData} options={doughnutDefaults} />
            </div>
          </div>
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Gauge className="w-4 h-4 text-green-600" /> NLP Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="font-semibold">Intent Recognition</span><span className="text-green-600 font-bold">98.4%</span></div>
                <div className="progress"><div className="progress-fill" style={{ width: '98.4%' }}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="font-semibold">Entity Extraction</span><span className="text-green-600 font-bold">96.8%</span></div>
                <div className="progress"><div className="progress-fill bg-gradient-to-r from-indigo-400 to-violet-500" style={{ width: '96.8%' }}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="font-semibold">Sentiment Analysis</span><span className="text-green-600 font-bold">94.2%</span></div>
                <div className="progress"><div className="progress-fill bg-gradient-to-r from-violet-400 to-purple-500" style={{ width: '94.2%' }}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="font-semibold">Context Retention</span><span className="text-green-600 font-bold">97.1%</span></div>
                <div className="progress"><div className="progress-fill bg-gradient-to-r from-sky-400 to-blue-500" style={{ width: '97.1%' }}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="font-semibold">Multi-turn Accuracy</span><span className="text-green-600 font-bold">92.6%</span></div>
                <div className="progress"><div className="progress-fill bg-gradient-to-r from-green-400 to-emerald-500" style={{ width: '92.6%' }}></div></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Queries Table */}
        <div className="glass-strong rounded-2xl overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Recent Queries</h3>
            <span className="text-xs text-slate-500">Last 50 queries</span>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Query</th><th>Type</th><th>Module</th><th>Status</th><th>Time</th></tr></thead>
              <tbody>
                {recentQueries.map((q, i) => (
                  <tr key={i} className="clickable">
                    <td className="font-semibold">{q.query}</td>
                    <td><span className="badge badge-blue">{q.type}</span></td>
                    <td className="text-slate-500">{q.module}</td>
                    <td><span className={`badge ${q.status === 'Resolved' ? 'badge-green' : 'badge-blue'}`}>{q.status}</span></td>
                    <td className="text-slate-500">{q.time}</td>
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
   TASKS PANEL
   ============================================================ */
function TasksPanel() {
  return (
    <div className="fos-panel active">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-violet-100 text-violet-600"><Zap className="w-5 h-5" /></div>
          <div><h2>Task Execution</h2><p>Tasks delegated to AI agents via chatbot</p></div>
        </div>

        {/* Task Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard value="1,247" label="Total Delegated" color="text-blue-600" />
          <StatCard value="96.4%" label="Success Rate" color="text-green-600" />
          <StatCard value="8" label="Agents Used" color="text-violet-600" />
          <StatCard value="3.2s" label="Avg Execution" color="text-indigo-600" />
        </div>

        {/* Task Log Table */}
        <div className="glass-strong rounded-2xl overflow-hidden mb-6">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Task Execution Log</h3>
            <span className="text-xs text-slate-500">Showing recent tasks</span>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Task</th><th>Agent</th><th>Module</th><th>Status</th><th>Time</th></tr></thead>
              <tbody>
                {taskLog.map((t, i) => (
                  <tr key={i} className="clickable">
                    <td className="font-semibold">{t.task}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-violet-100 text-violet-600 flex items-center justify-center"><Bot className="w-3 h-3" /></div>
                        <span className="text-sm">{t.agent}</span>
                      </div>
                    </td>
                    <td><span className="badge badge-blue">{t.module}</span></td>
                    <td><span className={`badge ${t.status === 'Completed' ? 'badge-green' : 'badge-yellow'}`}>{t.status}</span></td>
                    <td className="text-slate-500">{t.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Task Type Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-strong rounded-2xl p-5 card-hover">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center"><FileText className="w-5 h-5" /></div>
              <div><div className="font-bold text-slate-900">Report Generation</div><div className="text-xs text-slate-500">482 tasks</div></div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">38.6%</div>
            <div className="text-xs text-green-600 font-semibold mt-1">98.2% success rate</div>
          </div>
          <div className="glass-strong rounded-2xl p-5 card-hover">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center"><Send className="w-5 h-5" /></div>
              <div><div className="font-bold text-slate-900">Communications</div><div className="text-xs text-slate-500">324 tasks</div></div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">26.0%</div>
            <div className="text-xs text-green-600 font-semibold mt-1">95.8% success rate</div>
          </div>
          <div className="glass-strong rounded-2xl p-5 card-hover">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center"><RefreshCw className="w-5 h-5" /></div>
              <div><div className="font-bold text-slate-900">Data Operations</div><div className="text-xs text-slate-500">441 tasks</div></div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">35.4%</div>
            <div className="text-xs text-green-600 font-semibold mt-1">97.1% success rate</div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   CONTEXT PANEL
   ============================================================ */
function ContextPanel() {
  return (
    <div className="fos-panel active">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-sky-100 text-sky-600"><Brain className="w-5 h-5" /></div>
          <div><h2>Context Awareness</h2><p>User, module, and data context management</p></div>
        </div>

        {/* Context Model */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><User className="w-4 h-4 text-blue-600" /> User Context</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                <div className="text-xs font-bold text-blue-700">Role Detection</div>
                <div className="text-sm text-slate-600 mt-1">Automatically adapts responses based on user role (CEO, Engineer, Analyst)</div>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                <div className="text-xs font-bold text-blue-700">Preference Learning</div>
                <div className="text-sm text-slate-600 mt-1">Remembers preferred report formats, data views, and communication style</div>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                <div className="text-xs font-bold text-blue-700">Session History</div>
                <div className="text-sm text-slate-600 mt-1">Maintains conversation context across sessions for continuity</div>
              </div>
            </div>
          </div>
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Database className="w-4 h-4 text-indigo-600" /> Data Context</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                <div className="text-xs font-bold text-indigo-700">Real-Time Data Access</div>
                <div className="text-sm text-slate-600 mt-1">Queries live data from CRM, Finance, HR, and all connected modules</div>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                <div className="text-xs font-bold text-indigo-700">Semantic Understanding</div>
                <div className="text-sm text-slate-600 mt-1">Understands business terminology and maps to correct data entities</div>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                <div className="text-xs font-bold text-indigo-700">Permission Awareness</div>
                <div className="text-sm text-slate-600 mt-1">Respects RBAC and only shows data user has access to</div>
              </div>
            </div>
          </div>
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Layers className="w-4 h-4 text-violet-600" /> Module Awareness</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-violet-50 border border-violet-100">
                <div className="text-xs font-bold text-violet-700">Active Module Detection</div>
                <div className="text-sm text-slate-600 mt-1">Knows which module user is in and provides contextual responses</div>
              </div>
              <div className="p-3 rounded-xl bg-violet-50 border border-violet-100">
                <div className="text-xs font-bold text-violet-700">Cross-Module Navigation</div>
                <div className="text-sm text-slate-600 mt-1">Seamlessly navigates between modules based on query intent</div>
              </div>
              <div className="p-3 rounded-xl bg-violet-50 border border-violet-100">
                <div className="text-xs font-bold text-violet-700">Feature Awareness</div>
                <div className="text-sm text-slate-600 mt-1">Understands available features and can guide users to right tools</div>
              </div>
            </div>
          </div>
        </div>

        {/* Context Settings */}
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Settings className="w-4 h-4 text-slate-600" /> Context Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
              <div><div className="text-sm font-semibold">Multi-turn Context</div><div className="text-xs text-slate-500">Remember previous messages in conversation</div></div>
              <div className="w-10 h-6 bg-blue-600 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div></div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
              <div><div className="text-sm font-semibold">Cross-Session Memory</div><div className="text-xs text-slate-500">Retain preferences across sessions</div></div>
              <div className="w-10 h-6 bg-blue-600 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div></div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
              <div><div className="text-sm font-semibold">Role-Based Responses</div><div className="text-xs text-slate-500">Adapt answers to user role</div></div>
              <div className="w-10 h-6 bg-blue-600 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div></div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
              <div><div className="text-sm font-semibold">Auto-Module Detection</div><div className="text-xs text-slate-500">Detect active module automatically</div></div>
              <div className="w-10 h-6 bg-blue-600 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   KNOWLEDGE PANEL
   ============================================================ */
function KnowledgePanel() {
  return (
    <div className="fos-panel active">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-orange-100 text-orange-600"><BookOpen className="w-5 h-5" /></div>
          <div><h2>Knowledge Base</h2><p>Document index, RAG pipeline, and semantic search</p></div>
        </div>

        {/* Knowledge Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard value="8" label="Data Sources" color="text-blue-600" />
          <StatCard value="71.5K" label="Indexed Documents" color="text-indigo-600" />
          <StatCard value="0.3s" label="Avg Retrieval" color="text-green-600" />
          <StatCard value="97.2%" label="Relevance Score" color="text-violet-600" />
        </div>

        {/* Knowledge Sources Table */}
        <div className="glass-strong rounded-2xl overflow-hidden mb-6">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Document Index</h3>
            <button className="btn-primary text-xs">+ Add Source</button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Source</th><th>Documents</th><th>Type</th><th>Status</th><th>Last Sync</th></tr></thead>
              <tbody>
                {knowledgeSources.map((s) => (
                  <tr key={s.name} className="clickable">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"><BookOpen className="w-4 h-4" /></div>
                        <div className="font-semibold text-slate-800">{s.name}</div>
                      </div>
                    </td>
                    <td className="font-bold text-slate-800">{s.docs.toLocaleString()}</td>
                    <td className="text-slate-500">{s.type}</td>
                    <td><span className={`badge ${s.status === 'Live Sync' ? 'badge-blue' : 'badge-green'}`}>{s.status}</span></td>
                    <td className="text-slate-500">{s.lastSync}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RAG Pipeline Visualization */}
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-violet-600" /> RAG Pipeline</h3>
          <div className="flex flex-wrap items-center gap-3 justify-center">
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-center min-w-[120px]">
              <div className="w-10 h-10 mx-auto rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2"><FileText className="w-5 h-5" /></div>
              <div className="text-xs font-bold text-blue-700">Documents</div>
              <div className="text-[10px] text-slate-500">71.5K indexed</div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-center min-w-[120px]">
              <div className="w-10 h-10 mx-auto rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2"><Cpu className="w-5 h-5" /></div>
              <div className="text-xs font-bold text-indigo-700">Embeddings</div>
              <div className="text-[10px] text-slate-500">Vector Store</div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
            <div className="p-4 rounded-xl bg-violet-50 border border-violet-200 text-center min-w-[120px]">
              <div className="w-10 h-10 mx-auto rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center mb-2"><SearchIcon className="w-5 h-5" /></div>
              <div className="text-xs font-bold text-violet-700">Retrieval</div>
              <div className="text-[10px] text-slate-500">Semantic Search</div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-center min-w-[120px]">
              <div className="w-10 h-10 mx-auto rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center mb-2"><Brain className="w-5 h-5" /></div>
              <div className="text-xs font-bold text-sky-700">LLM</div>
              <div className="text-[10px] text-slate-500">Claude / GPT</div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
            <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-center min-w-[120px]">
              <div className="w-10 h-10 mx-auto rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-2"><MessageCircle className="w-5 h-5" /></div>
              <div className="text-xs font-bold text-green-700">Response</div>
              <div className="text-[10px] text-slate-500">Grounded Answer</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   CHANNELS PANEL
   ============================================================ */
function ChannelsPanel() {
  return (
    <div className="fos-panel active">
      <section className="mt-6 mb-6">
        <div className="fos-section-head">
          <div className="ico bg-green-100 text-green-600"><Globe className="w-5 h-5" /></div>
          <div><h2>Multi-Channel Integration</h2><p>Web, Mobile, Slack, Teams, Email, WhatsApp</p></div>
        </div>

        {/* Channel Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {channels.map((ch) => {
            const Icon = ch.icon;
            return (
              <div key={ch.name} className="glass-strong rounded-2xl p-5 card-hover cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-${ch.color}-100 text-${ch.color}-600 flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{ch.name}</div>
                    <div className="text-xs text-slate-500">{ch.sessions} sessions/month</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="badge badge-green">{ch.status}</span>
                  <span className="text-xs text-slate-500">{ch.satisfaction} satisfaction</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Channel Usage Chart */}
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-600" /> Channel Usage Trend</h3>
          <div style={{ height: 280 }}>
            <Line data={channelChartData} options={lineDefaults()} />
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

export default Chatbot;
