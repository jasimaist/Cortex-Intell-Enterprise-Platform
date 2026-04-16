import { useNavigate } from 'react-router-dom';
import {
  DollarSign, Users, TrendingUp, Folder, Brain, UserCog,
  Bot, BarChart3, Database, MessageCircle, FolderKanban,
  Sparkles, ArrowRight, Trophy, AlertTriangle, ChevronRight,
  Sliders,
} from 'lucide-react';
import { CORTEX_DATA } from '../../data/mockData';

/* ============================================================
   ICON MAP — maps string ids from mockData to lucide components
   ============================================================ */
const iconMap = {
  'dollar-sign': DollarSign,
  users: Users,
  'trending-up': TrendingUp,
  folder: Folder,
  'user-cog': UserCog,
  brain: Brain,
  bot: Bot,
  'bar-chart-3': BarChart3,
  database: Database,
  'message-circle': MessageCircle,
  'folder-kanban': FolderKanban,
};

const colorMap = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
  sky: { bg: 'bg-sky-100', text: 'text-sky-600' },
  violet: { bg: 'bg-violet-100', text: 'text-violet-600' },
  cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600' },
  green: { bg: 'bg-green-100', text: 'text-green-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
};

/* route mapping from module id */
const moduleRoute = {
  crm: '/crm',
  hrm: '/hrm',
  finance: '/finance',
  growth: '/growth',
  brain: '/brain',
  projects: '/projects',
  agents: '/agents',
  analytics: '/analytics',
  'data-platform': '/data-platform',
  chatbot: '/chatbot',
};

/* recommendation styling */
const recoStyles = {
  yellow: { bg: 'from-yellow-50 to-orange-50 border-yellow-200', iconBg: 'text-yellow-600 bg-yellow-100', Icon: Trophy },
  red: { bg: 'from-red-50 to-pink-50 border-red-200', iconBg: 'text-red-600 bg-red-100', Icon: AlertTriangle },
  green: { bg: 'from-green-50 to-emerald-50 border-green-200', iconBg: 'text-green-600 bg-green-100', Icon: Sparkles },
};

/* ============================================================
   STATUS BADGE MAPPING
   ============================================================ */
const statusBadge = {
  Live: 'badge-green',
  'On Track': 'badge-blue',
  Active: 'badge-blue',
  Learning: 'badge-purple',
  Monitoring: 'badge-yellow',
};

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
function Home() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in-up">
      {/* HERO GREETING + KPI */}
      <section className="mb-6">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">&#128075;</span>
              <span className="text-slate-600 font-medium">Good morning, {CORTEX_DATA.user.name.split(' ')[0]}!</span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
              Command Your Business
            </h1>
            <h2 className="text-4xl font-extrabold text-grad mb-2">with Cortex Intell</h2>
            <p className="text-slate-500">Everything Connected. Everything Intelligent.</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="badge badge-blue">AI-POWERED</span>
              <span className="badge badge-green">REAL-TIME</span>
              <span className="badge badge-purple">SECURE &amp; TRUSTED</span>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1 min-w-[500px]">
            {CORTEX_DATA.kpis.map((kpi, i) => {
              const Icon = iconMap[kpi.icon] || DollarSign;
              const c = colorMap[kpi.color] || colorMap.blue;
              return (
                <div key={kpi.label} className="kpi-card card-hover animate-fade-in-up" style={{ animationDelay: `${(i + 1) * 0.1}s` }}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider">{kpi.label.toUpperCase()}</span>
                    <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${c.text}`} />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900">{kpi.value}</div>
                  <div className="flex items-center gap-1 text-xs mt-1">
                    {kpi.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-600" />}
                    <span className={kpi.trend === 'warn' ? 'text-yellow-600 font-semibold' : 'text-green-600 font-semibold'}>{kpi.delta}</span>
                    {kpi.sub && <span className="text-slate-400">{kpi.sub}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ECOSYSTEM MODULES + BRAIN */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">CORTEX INTELL ECOSYSTEM</h2>
            <p className="text-sm text-slate-500">Seamlessly Connected. Intelligently Orchestrated.</p>
          </div>
          <button className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1">
            <Sliders className="w-4 h-4" /> Customise Dashboard
          </button>
        </div>

        <div className="grid grid-cols-12 gap-5">
          {/* Module grid */}
          <div className="col-span-12 lg:col-span-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {CORTEX_DATA.modules.map((m, i) => {
              const Icon = iconMap[m.icon] || Folder;
              const c = colorMap[m.color] || colorMap.blue;
              return (
                <div
                  key={m.id}
                  className="module-card card-hover animate-fade-in-up cursor-pointer"
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onClick={() => navigate(moduleRoute[m.id] || '/')}
                >
                  <span className={`badge-live`}>{m.status}</span>
                  <div className={`w-11 h-11 rounded-xl ${c.bg} ${c.text} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-slate-900 text-sm mb-0.5">{m.name}</div>
                  <div className="text-[11px] text-slate-500 mb-2">{m.desc}</div>
                  <div className="text-[13px] font-bold text-slate-900">{m.metric}</div>
                  <div className="text-[11px] text-slate-500 mb-3">{m.sub}</div>

                  {m.subModules && (
                    <div className="border-t border-slate-100 pt-2 mt-1 mb-2">
                      <div className="text-[9px] font-bold text-slate-400 tracking-widest mb-1.5">SUB-MODULES</div>
                      <div className="flex flex-wrap gap-1">
                        {m.subModules.map((s) => (
                          <span key={s} className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-slate-600 font-medium">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-xs font-semibold text-blue-600 flex items-center gap-1 mt-auto">
                    Open Module <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Brain Visual */}
          <div className="col-span-12 lg:col-span-4">
            <div className="glass-strong rounded-2xl p-6 h-full relative overflow-hidden shadow-blue-lg">
              <div className="absolute inset-0 bg-grad-soft opacity-40"></div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-slate-900 text-sm">CORTEX INTELL</span>
                  <span className="text-grad font-extrabold text-sm">BRAIN</span>
                </div>

                <div className="brain-container flex-1 min-h-[320px]">
                  <div className="brain-ring r3"></div>
                  <div className="brain-ring r2"></div>
                  <div className="brain-ring r1"></div>
                  <div className="brain-core"></div>

                  {/* Orbiting module nodes */}
                  <div className="brain-node" style={{ top: '10%', left: '50%', transform: 'translateX(-50%)' }}><Users className="w-4 h-4" /></div>
                  <div className="brain-node" style={{ top: '22%', right: '8%' }}><UserCog className="w-4 h-4" /></div>
                  <div className="brain-node" style={{ top: '50%', right: '0%' }}><DollarSign className="w-4 h-4" /></div>
                  <div className="brain-node" style={{ bottom: '22%', right: '8%' }}><TrendingUp className="w-4 h-4" /></div>
                  <div className="brain-node" style={{ bottom: '10%', left: '50%', transform: 'translateX(-50%)' }}><Bot className="w-4 h-4" /></div>
                  <div className="brain-node" style={{ bottom: '22%', left: '8%' }}><FolderKanban className="w-4 h-4" /></div>
                  <div className="brain-node" style={{ top: '50%', left: '0%' }}><BarChart3 className="w-4 h-4" /></div>
                  <div className="brain-node" style={{ top: '22%', left: '8%' }}><Database className="w-4 h-4" /></div>
                </div>

                <div className="text-center mt-4">
                  <div className="text-xs font-bold text-slate-700 tracking-wider">ONE BRAIN. ALL MODULES.</div>
                  <div className="text-xs text-grad font-bold">SMARTER DECISIONS.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVITY + RECOMMENDATIONS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Activity Feed */}
        <div className="glass-strong rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">RECENT ACTIVITY</h3>
            <button className="text-xs text-blue-600 font-semibold hover:underline">View All Activity</button>
          </div>
          <div className="space-y-4">
            {CORTEX_DATA.activity.map((a, i) => {
              const c = colorMap[a.color] || colorMap.blue;
              const Icon = iconMap[a.icon] || DollarSign;
              return (
                <div key={i} className="flex gap-3">
                  <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.text} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-800">{a.title}</div>
                    <div className="text-xs text-slate-500">{a.desc}</div>
                  </div>
                  <div className="text-xs text-slate-400">{a.time}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="glass-strong rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-600" />
              AI RECOMMENDATIONS
            </h3>
            <button className="text-xs text-blue-600 font-semibold hover:underline">View Insights</button>
          </div>
          <div className="space-y-4">
            {CORTEX_DATA.recommendations.map((r, i) => {
              const style = recoStyles[r.color] || recoStyles.green;
              const RIcon = style.Icon;
              return (
                <div key={i} className={`p-4 rounded-xl bg-gradient-to-br ${style.bg} border`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg ${style.iconBg} flex items-center justify-center flex-shrink-0`}>
                      <RIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-bold tracking-wider text-slate-600">{r.priority}</div>
                      <div className="font-bold text-sm text-slate-900">{r.title}</div>
                      <div className="text-xs text-slate-600 mt-1 mb-2">{r.desc}</div>
                      <button className="text-xs font-semibold text-blue-600 hover:underline">{r.cta} <ChevronRight className="w-3 h-3 inline" /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="text-center text-xs text-slate-400 py-6">
        v2.4.0 &middot; &copy; 2026 AIST Technologies. All Rights Reserved.
      </footer>
    </div>
  );
}

export default Home;
