import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight, Download, Star, Search, SlidersHorizontal,
  Grid3x3, Share2, SearchIcon, Rocket, Filter, BrainCircuit,
  Workflow, BookOpen, TrendingUp, Bot, ShieldCheck, FileText,
  Users, Target, LineChart, Database, Mail, CalendarCheck,
  Briefcase, Wallet, Award, GraduationCap, Heart, FilePlus,
  GitCompare, ScanLine, Percent, Brain, Sparkles, ChartScatter,
  Library, Cpu, MessageSquare, Smartphone, Phone, Store,
  Wand2, Activity, History, Gauge, FileLock2, KeyRound,
  Globe2, FolderKanban, LayoutDashboard, Calendar, Plug,
  GitBranch, Key, Webhook, CircleDot, HardDrive, Terminal, Server,
} from 'lucide-react';
import { CORTEX_DATA } from '../../data/mockData';

const pageToRoute = {
  'growth.html': '/growth',
  'finance.html': '/finance',
  'crm.html': '/crm',
  'hrm.html': '/hrm',
  'brain.html': '/brain',
  'communication.html': '/chatbot',
  'chatbot.html': '/chatbot',
  'database.html': '/data-platform',
  'integration.html': '/data-platform',
  'projects.html': '/projects',
  'agents.html': '/agents',
  'accounts.html': '/analytics',
};

const iconMap = {
  'share-2': Share2, 'search': SearchIcon, 'rocket': Rocket, 'filter': Filter,
  'brain-circuit': BrainCircuit, 'workflow': Workflow, 'book-open': BookOpen,
  'trending-up': TrendingUp, 'bot': Bot, 'shield-check': ShieldCheck,
  'file-text': FileText, 'users': Users, 'target': Target, 'line-chart': LineChart,
  'layout-kanban': FolderKanban, 'database': Database, 'mail': Mail,
  'calendar-check': CalendarCheck, 'briefcase': Briefcase, 'wallet': Wallet,
  'award': Award, 'graduation-cap': GraduationCap, 'heart': Heart,
  'file-plus': FilePlus, 'git-compare': GitCompare, 'scan-line': ScanLine,
  'percent': Percent, 'brain': Brain, 'sparkles': Sparkles,
  'chart-scatter': ChartScatter, 'library': Library, 'cpu': Cpu,
  'message-square': MessageSquare, 'smartphone': Smartphone, 'phone': Phone,
  'store': Store, 'wand-2': Wand2, 'activity': Activity, 'history': History,
  'gauge': Gauge, 'file-lock-2': FileLock2, 'key-round': KeyRound,
  'globe-2': Globe2, 'folder-kanban': FolderKanban,
  'layout-dashboard': LayoutDashboard, 'calendar': Calendar, 'plug': Plug,
  'git-branch': GitBranch, 'key': Key, 'webhook': Webhook,
  'circle-dot': CircleDot, 'hard-drive': HardDrive, 'terminal': Terminal,
  'server': Server, 'grid-3x3': Grid3x3,
};

const colorBg = {
  blue: 'bg-blue-100 text-blue-600',
  indigo: 'bg-indigo-100 text-indigo-600',
  violet: 'bg-violet-100 text-violet-600',
  sky: 'bg-sky-100 text-sky-600',
  cyan: 'bg-cyan-100 text-cyan-600',
  purple: 'bg-purple-100 text-purple-600',
  green: 'bg-green-100 text-green-600',
  orange: 'bg-orange-100 text-orange-600',
  red: 'bg-red-100 text-red-600',
  slate: 'bg-slate-100 text-slate-600',
};

function Services() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const allServices = CORTEX_DATA.allServices || [];

  // Group by category
  const groups = {};
  allServices.forEach((s) => {
    if (!groups[s.cat]) groups[s.cat] = [];
    groups[s.cat].push(s);
  });
  const categories = Object.keys(groups);

  // Filter
  const term = searchTerm.trim().toLowerCase();
  const matches = (s) =>
    !term ||
    s.name.toLowerCase().includes(term) ||
    s.desc.toLowerCase().includes(term) ||
    s.cat.toLowerCase().includes(term);

  let visibleCats = activeCat === 'All' ? categories : categories.filter((c) => c === activeCat);
  let totalShown = 0;

  const renderIcon = (iconName, size = 16) => {
    const Icon = iconMap[iconName];
    if (!Icon) return null;
    return <Icon size={size} />;
  };

  return (
    <div className="animate-fade-in-up">
      {/* PAGE HEADER */}
      <section className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span>Ecosystem</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-blue-600 font-semibold">All Services</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">All Services</h1>
          <p className="text-slate-500">Browse the complete Cortex Intell ecosystem — every module, agent & service in one place.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline"><SlidersHorizontal className="w-4 h-4" /> Filter</button>
          <button className="btn-outline"><Download className="w-4 h-4" /> Export</button>
          <button className="btn-primary"><Star className="w-4 h-4" /> My Favorites</button>
        </div>
      </section>

      {/* HERO STRIP */}
      <section style={{
        position: 'relative',
        borderRadius: '24px',
        padding: '28px 32px',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 45%, #8b5cf6 100%)',
        color: '#fff',
        overflow: 'hidden',
        marginBottom: '24px',
      }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.25), transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '30%', width: '260px', height: '260px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.45), transparent 70%)' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge badge-blue">CATALOG</span>
            <span className="badge badge-purple">{allServices.length} SERVICES</span>
          </div>
          <h2 className="text-3xl font-extrabold mb-2">Everything in the Cortex Ecosystem</h2>
          <p className="text-white/80 max-w-3xl text-sm">From Growth Engine & Finance OS to AI Agents, Brain, Database & Communication — pick any service to jump straight in. Search, filter by category, or browse the full grid below.</p>
        </div>
      </section>

      {/* SHELL: sidebar + main */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px', marginTop: '16px' }}>

        {/* LEFT: Category Rail */}
        <aside style={{
          background: 'rgba(255,255,255,0.9)',
          border: '1px solid rgba(191,219,254,0.5)',
          borderRadius: '18px',
          padding: '14px 10px',
          position: 'sticky',
          top: '90px',
          height: 'fit-content',
        }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '6px 10px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {renderIcon('grid-3x3', 14)} Categories
          </div>

          {/* All */}
          <div
            className={activeCat === 'All' ? 'allsvc-catlink active' : 'allsvc-catlink'}
            onClick={() => setActiveCat('All')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '10px', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', marginBottom: '2px' }}
          >
            <span className="flex items-center gap-2">{renderIcon('grid-3x3', 14)} All Services</span>
            <span style={{ marginLeft: 'auto', fontSize: '10px', fontWeight: 700, background: 'rgba(148,163,184,0.15)', padding: '1px 7px', borderRadius: '999px' }}>{allServices.length}</span>
          </div>

          {categories.map((cat) => (
            <div
              key={cat}
              className={activeCat === cat ? 'allsvc-catlink active' : 'allsvc-catlink'}
              onClick={() => setActiveCat(cat)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '10px', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', marginBottom: '2px' }}
            >
              <span className="truncate">{cat}</span>
              <span style={{ marginLeft: 'auto', fontSize: '10px', fontWeight: 700, background: 'rgba(148,163,184,0.15)', padding: '1px 7px', borderRadius: '999px' }}>{groups[cat].length}</span>
            </div>
          ))}
        </aside>

        {/* RIGHT: Search + Grid */}
        <section style={{ minWidth: 0 }}>
          {/* Search */}
          <div className="flex gap-2 mb-4 items-center">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search services — e.g. payroll, webhook, forecasting, agent…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  background: 'rgba(255,255,255,0.95)',
                  border: '1px solid rgba(191,219,254,0.6)',
                  borderRadius: '14px',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Grid by category */}
          {visibleCats.map((cat) => {
            const items = groups[cat].filter(matches);
            if (!items.length) return null;
            totalShown += items.length;

            return (
              <div key={cat} className="mb-7 animate-fade-in-up">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                  <h3 className="text-sm font-extrabold text-blue-900 flex items-center gap-2">{cat}</h3>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{items.length}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '8px' }}>
                  {items.map((s, i) => {
                    const route = pageToRoute[s.page] || '/';
                    const bg = colorBg[s.color] || colorBg.blue;

                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-blue-50/60 border border-transparent hover:border-blue-200"
                        onClick={() => navigate(route)}
                        style={{ position: 'relative' }}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${bg}`}>
                          {renderIcon(s.icon, 16)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 truncate">{s.name}</span>
                            {s.flag && (
                              <span className="text-[8px] font-extrabold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded" style={{ letterSpacing: '0.03em', textTransform: 'uppercase' }}>{s.flag}</span>
                            )}
                          </div>
                          <div className="text-[10.5px] text-slate-500 truncate">{s.desc}</div>
                        </div>
                        <button
                          className="text-slate-300 hover:text-yellow-500 transition flex-shrink-0"
                          onClick={(e) => { e.stopPropagation(); }}
                          title="Favorite"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Empty state */}
          {totalShown === 0 && (
            <div className="py-16 text-center text-slate-400 text-sm">
              <Search className="w-10 h-10 mx-auto mb-3 text-slate-300" />
              <div className="font-semibold text-slate-600">No services match "{searchTerm}"</div>
              <div className="text-sm text-slate-400 mt-1">Try a different keyword or clear the filter</div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Services;
