// ===========================================
// CORTEX INTELL — MAIN APP JS
// ===========================================

const CORTEX = {
  currentPage: null,

  init(pageId) {
    this.currentPage = pageId;
    this.renderSidebar();
    this.renderTopbar();
    this.renderChatbot();
    this.renderCommandPalette();
    this.bindKeyboard();
    this.bindGlobal();
    this.checkHashTab();
    // refresh icons after injection
    if (window.lucide) window.lucide.createIcons();
  },

  // ---------- SIDEBAR ----------
  renderSidebar() {
    const mount = document.getElementById("sidebar-mount");
    if (!mount) return;
    const nav = CORTEX_DATA.navigation;
    const currentPage = this.currentPage;

    let html = `
      <div class="flex items-center gap-3 px-3 pb-6">
        <div class="w-11 h-11 rounded-xl bg-grad-blue flex items-center justify-center shadow-blue-lg animate-pulse-glow">
          <i data-lucide="brain-circuit" class="text-white w-6 h-6"></i>
        </div>
        <div>
          <div class="font-bold text-[15px] text-grad">CORTEX INTELL</div>
          <div class="text-[10px] text-slate-500 tracking-wider font-semibold">ECOSYSTEM</div>
        </div>
      </div>
    `;

    nav.forEach(group => {
      if (group.label) {
        html += `<div class="sidebar-section-label">${group.label}</div>`;
      }
      group.items.forEach(item => {
        const active = item.id === currentPage ? 'active' : '';
        const hasSubs = item.subs && item.subs.length > 0;
        const isExpanded = active && hasSubs;

        if (hasSubs) {
          // Module with sub-modules — expandable
          const link = item.page ? `onclick="CORTEX.toggleSidebarSubs('${item.id}', '${item.page}')"` : '';
          html += `
            <div class="sidebar-link ${active}" ${link} id="sidebar-item-${item.id}">
              <i data-lucide="${item.icon}" class="w-[18px] h-[18px]"></i>
              <span class="flex-1">${item.name}</span>
              <i data-lucide="chevron-down" class="w-4 h-4 sidebar-chevron ${isExpanded ? 'rotated' : ''}"></i>
            </div>
            <div class="sidebar-subs ${isExpanded ? 'expanded' : ''}" id="sidebar-subs-${item.id}">
              ${item.subs.map(sub => `
                <div class="sidebar-sub-link" onclick="CORTEX.goToSubModule('${item.page}', '${sub.tab}')">
                  <span class="sidebar-sub-dot"></span>
                  <span>${sub.name}</span>
                </div>
              `).join('')}
            </div>
          `;
        } else {
          // Regular item — no sub-modules
          const link = item.page ? `onclick="location.href='${item.page}'"` : `onclick="CORTEX.handleQuickAction('${item.action}', '${item.name}')"`;
          html += `
            <div class="sidebar-link ${active}" ${link}>
              <i data-lucide="${item.icon}" class="w-[18px] h-[18px]"></i>
              <span>${item.name}</span>
            </div>
          `;
        }
      });
    });

    html += `
      <div class="mt-8 px-2">
        <div class="glass-blue rounded-2xl p-5 relative overflow-hidden">
          <div class="absolute inset-0 opacity-30">
            <div class="absolute w-32 h-32 rounded-full bg-white/30 blur-2xl -top-10 -right-10 animate-blob"></div>
          </div>
          <div class="relative">
            <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-3">
              <i data-lucide="sparkles" class="w-5 h-5 text-white"></i>
            </div>
            <div class="font-bold text-white text-sm mb-1">Cortex Intell AI</div>
            <div class="text-[11px] text-white/80 mb-3">One Ecosystem.<br/>Unlimited Possibilities.</div>
            <button class="w-full bg-white/20 backdrop-blur hover:bg-white/30 text-white text-xs font-semibold py-2 rounded-lg transition" onclick="CORTEX.toggleChat()">
              Explore What's Possible
            </button>
          </div>
        </div>
      </div>
    `;

    mount.innerHTML = html;
  },

  // ---------- TOPBAR ----------
  renderTopbar() {
    const mount = document.getElementById("topbar-mount");
    if (!mount) return;
    const u = CORTEX_DATA.user;
    mount.innerHTML = `
      <div class="glass topbar animate-fade-in-up">
        <button class="lg:hidden p-2 rounded-lg hover:bg-blue-50" onclick="document.querySelector('.sidebar').classList.toggle('open')">
          <i data-lucide="menu" class="w-5 h-5"></i>
        </button>
        <div class="flex-1 relative max-w-xl">
          <i data-lucide="search" class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input type="text" placeholder="Ask Cortex... e.g. Show me revenue, pipeline and cash flow" class="w-full pl-11 pr-20 py-2.5 bg-white/80 border border-blue-100 rounded-xl text-sm outline-none focus:border-blue-400 transition" onclick="CORTEX.openCommandPalette()" readonly />
          <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd class="px-1.5 py-0.5 text-[10px] bg-slate-100 rounded border border-slate-200 font-mono">⌘</kbd>
            <kbd class="px-1.5 py-0.5 text-[10px] bg-slate-100 rounded border border-slate-200 font-mono">K</kbd>
          </div>
        </div>
        <button class="relative p-2.5 hover:bg-blue-50 rounded-xl transition">
          <i data-lucide="bell" class="w-5 h-5 text-slate-600"></i>
          <span class="notif-dot"></span>
        </button>
        <button class="p-2.5 hover:bg-blue-50 rounded-xl transition">
          <i data-lucide="help-circle" class="w-5 h-5 text-slate-600"></i>
        </button>
        <div class="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div class="avatar">${u.initials}</div>
          <div class="hidden md:block">
            <div class="text-sm font-semibold text-slate-800">${u.name}</div>
            <div class="text-[11px] text-slate-500">${u.role}</div>
          </div>
          <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400"></i>
        </div>
      </div>
    `;
  },

  // ---------- CHATBOT ----------
  renderChatbot() {
    // FAB
    if (!document.getElementById("chat-fab")) {
      const fab = document.createElement("div");
      fab.id = "chat-fab";
      fab.className = "chatbot-fab";
      fab.innerHTML = `<i data-lucide="message-circle" class="w-6 h-6"></i>`;
      fab.onclick = () => CORTEX.toggleChat();
      document.body.appendChild(fab);
    }

    if (!document.getElementById("chat-panel")) {
      const panel = document.createElement("div");
      panel.id = "chat-panel";
      panel.className = "chatbot-panel";
      panel.innerHTML = `
        <div class="chat-header">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <i data-lucide="sparkles" class="w-5 h-5 text-white"></i>
            </div>
            <div>
              <div class="font-bold text-sm">Cortex AI</div>
              <div class="text-[11px] opacity-80 flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 bg-green-400 rounded-full"></span> Always Here to Help
              </div>
            </div>
          </div>
          <button onclick="CORTEX.toggleChat()" class="p-1.5 hover:bg-white/20 rounded-lg">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>
        <div class="chat-body" id="chat-body">
          <div class="chat-msg bot">
            Hi Rania! 👋 What would you like to do today?
          </div>
          <div class="flex flex-wrap gap-2" id="chat-chips">
            ${CORTEX_DATA.chatSuggestions.slice(0,4).map(s=>`<div class="chip" onclick="CORTEX.sendChat('${s.replace(/'/g,"\\'")}')">${s}</div>`).join('')}
          </div>
        </div>
        <div class="chat-footer">
          <input type="text" class="chat-input" id="chat-input" placeholder="Ask anything..." onkeydown="if(event.key==='Enter'){CORTEX.sendChat(this.value);this.value='';}" />
          <button class="p-2 rounded-lg hover:bg-blue-50" onclick="CORTEX.voiceChat()" title="Voice">
            <i data-lucide="mic" class="w-5 h-5 text-blue-600"></i>
          </button>
          <button class="p-2 rounded-lg bg-grad-blue text-white" onclick="const i=document.getElementById('chat-input'); CORTEX.sendChat(i.value); i.value='';">
            <i data-lucide="send" class="w-5 h-5"></i>
          </button>
        </div>
      `;
      document.body.appendChild(panel);
    }
  },

  toggleChat() {
    const panel = document.getElementById("chat-panel");
    panel.classList.toggle("open");
    if (panel.classList.contains("open") && window.lucide) window.lucide.createIcons();
  },

  sendChat(text) {
    if (!text || !text.trim()) return;
    const body = document.getElementById("chat-body");
    const chips = document.getElementById("chat-chips");
    if (chips) chips.remove();
    body.insertAdjacentHTML("beforeend", `<div class="chat-msg user">${text}</div>`);
    setTimeout(() => {
      const reply = this.fakeAIReply(text);
      body.insertAdjacentHTML("beforeend", `<div class="chat-msg bot">${reply}</div>`);
      body.scrollTop = body.scrollHeight;
      if (window.lucide) window.lucide.createIcons();
    }, 700);
    body.scrollTop = body.scrollHeight;
  },

  fakeAIReply(text) {
    const t = text.toLowerCase();
    if (t.includes("revenue")) return `📊 <b>Revenue this month: $3.92M</b> (+12.5% vs last month). Want me to break it down by module?`;
    if (t.includes("leave") || t.includes("attendance")) return `👥 Today <b>4 employees</b> are on leave: Priya, Tom, Raj, Meera. Attendance rate: 92%.`;
    if (t.includes("risk") || t.includes("deal")) return `⚠️ <b>2 deals at risk</b>: Project Alpha ($340K) and API Gateway v3. Both blocked on dependencies.`;
    if (t.includes("report") || t.includes("finance")) return `📑 Finance Report ready: Cash $2.47M · Burn $680K · Runway 18 months. Want a PDF export?`;
    if (t.includes("recommend")) return `✨ Top 3 recommendations:<br>1. Upsell TechCorp NSW ($340K)<br>2. Action Project Alpha risk<br>3. Optimize Payroll ($16K savings)`;
    if (t.includes("project")) return `📁 You have <b>12 active projects</b>, 68% avg completion, 2 at risk. Open Projects module?`;
    return `🤖 I'll pull the latest data on "${text}". This is a frontend demo — connect a backend to make me smarter!`;
  },

  voiceChat() {
    const body = document.getElementById("chat-body");
    body.insertAdjacentHTML("beforeend", `
      <div class="chat-msg bot">
        <div class="flex items-center gap-2">
          <div class="voice-wave"><span></span><span></span><span></span><span></span><span></span></div>
          <span>Listening...</span>
        </div>
      </div>
    `);
    body.scrollTop = body.scrollHeight;
    setTimeout(() => {
      this.sendChat("Show me revenue and pipeline");
      body.lastElementChild.previousElementSibling?.remove();
    }, 1800);
  },

  // ---------- COMMAND PALETTE ----------
  renderCommandPalette() {
    if (document.getElementById("cmdk")) return;
    const overlay = document.createElement("div");
    overlay.id = "cmdk";
    overlay.className = "cmdk-overlay";
    overlay.onclick = (e) => { if (e.target === overlay) CORTEX.closeCommandPalette(); };

    const items = [
      ...CORTEX_DATA.navigation.flatMap(g => g.items).filter(i => i.page).map(i => ({ ...i, type: "Navigate" })),
      { name: "Ask Cortex AI", icon: "sparkles", action: "chat", type: "AI" },
      { name: "Toggle Chatbot", icon: "message-circle", action: "chat", type: "AI" },
      { name: "Create New Project", icon: "folder-plus", action: "toast", type: "Action" },
      { name: "Run Finance Report", icon: "file-text", action: "toast", type: "Action" },
      { name: "Add New Lead", icon: "user-plus", action: "toast", type: "Action" },
      { name: "Export Data", icon: "download", action: "toast", type: "Action" },
    ];

    overlay.innerHTML = `
      <div class="cmdk-box animate-fade-in-up">
        <input type="text" class="cmdk-input" id="cmdk-input" placeholder="Search or type a command..." />
        <div class="cmdk-list" id="cmdk-list"></div>
        <div class="px-4 py-2 flex items-center gap-3 text-xs text-slate-500 border-t border-slate-100 bg-slate-50/50">
          <span class="flex items-center gap-1"><kbd class="px-1 bg-white border border-slate-200 rounded">↑↓</kbd> Navigate</span>
          <span class="flex items-center gap-1"><kbd class="px-1 bg-white border border-slate-200 rounded">↵</kbd> Open</span>
          <span class="flex items-center gap-1"><kbd class="px-1 bg-white border border-slate-200 rounded">ESC</kbd> Close</span>
          <span class="ml-auto text-grad font-semibold">Cortex Intell ⌘K</span>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    this._cmdkItems = items;
    this._cmdkFiltered = [...items];
    this._cmdkIdx = 0;

    const input = document.getElementById("cmdk-input");
    input.oninput = () => {
      const q = input.value.toLowerCase();
      this._cmdkFiltered = items.filter(i => i.name.toLowerCase().includes(q));
      this._cmdkIdx = 0;
      this.renderCmdkList();
    };
    this.renderCmdkList();
  },

  renderCmdkList() {
    const list = document.getElementById("cmdk-list");
    if (!list) return;
    list.innerHTML = this._cmdkFiltered.map((i, idx) => `
      <div class="cmdk-item ${idx === this._cmdkIdx ? 'active' : ''}" onclick="CORTEX.runCmdk(${idx})">
        <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
          <i data-lucide="${i.icon}" class="w-4 h-4 text-blue-600"></i>
        </div>
        <div class="flex-1">
          <div class="font-medium">${i.name}</div>
          <div class="text-xxs text-slate-400">${i.type}</div>
        </div>
        <span class="cmdk-shortcut">↵</span>
      </div>
    `).join('') || `<div class="p-8 text-center text-slate-400 text-sm">No results</div>`;
    if (window.lucide) window.lucide.createIcons();
  },

  runCmdk(idx) {
    const item = this._cmdkFiltered[idx];
    if (!item) return;
    this.closeCommandPalette();
    if (item.page) { location.href = item.page; return; }
    if (item.action) this.handleQuickAction(item.action, item.name);
  },

  openCommandPalette() {
    const overlay = document.getElementById("cmdk");
    overlay.classList.add("open");
    setTimeout(() => document.getElementById("cmdk-input")?.focus(), 100);
  },

  closeCommandPalette() {
    document.getElementById("cmdk").classList.remove("open");
    document.getElementById("cmdk-input").value = "";
    this._cmdkFiltered = [...this._cmdkItems];
    this._cmdkIdx = 0;
    this.renderCmdkList();
  },

  // ---------- QUICK ACTIONS ----------
  // ---------- SIDEBAR SUB-MODULES ----------
  toggleSidebarSubs(moduleId, page) {
    const subsEl = document.getElementById('sidebar-subs-' + moduleId);
    const chevron = document.querySelector('#sidebar-item-' + moduleId + ' .sidebar-chevron');
    if (!subsEl) { location.href = page; return; }

    // If we're on this module's page, just toggle the sub-list
    if (this.currentPage === moduleId) {
      subsEl.classList.toggle('expanded');
      if (chevron) chevron.classList.toggle('rotated');
    } else {
      // Navigate to the module page
      location.href = page;
    }
  },

  goToSubModule(page, tabId) {
    // If already on this page, just switch the tab
    const currentFile = location.pathname.split('/').pop();
    if (currentFile === page) {
      // Find the tab switcher function for this page
      const switchers = {
        'crm.html': 'switchCrmTab',
        'finance.html': 'switchFinTab',
        'hrm.html': 'switchHrmTab',
        'growth.html': 'switchGeTab',
        'brain.html': 'switchBrainTab',
        'projects.html': 'switchPmTab',
        'agents.html': 'switchAgTab',
        'accounts.html': 'switchAnTab',
        'integration.html': 'switchDpTab',
        'chatbot.html': 'switchCbTab',
      };
      const fn = switchers[page];
      if (fn && window[fn]) {
        window[fn](tabId);
        // Highlight active sub-link
        document.querySelectorAll('.sidebar-sub-link').forEach(s => s.classList.remove('active'));
        event.currentTarget.classList.add('active');
      }
    } else {
      // Navigate to page with tab hash
      location.href = page + '#tab=' + tabId;
    }
  },

  // Check URL hash for sub-module tab on init
  checkHashTab() {
    const hash = location.hash;
    if (hash && hash.startsWith('#tab=')) {
      const tabId = hash.replace('#tab=', '');
      const currentFile = location.pathname.split('/').pop();
      const switchers = {
        'crm.html': 'switchCrmTab',
        'finance.html': 'switchFinTab',
        'hrm.html': 'switchHrmTab',
        'growth.html': 'switchGeTab',
        'brain.html': 'switchBrainTab',
        'projects.html': 'switchPmTab',
        'agents.html': 'switchAgTab',
        'accounts.html': 'switchAnTab',
        'integration.html': 'switchDpTab',
        'chatbot.html': 'switchCbTab',
      };
      const fn = switchers[currentFile];
      if (fn && window[fn]) {
        setTimeout(() => window[fn](tabId), 100);
      }
    }
  },

  handleQuickAction(action, label) {
    if (action === "chat") { this.toggleChat(); return; }
    this.toast(`✨ ${label} — action triggered`);
  },

  toast(msg) {
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2800);
  },

  // ---------- DETAIL MODAL ----------
  openModal(type, data) {
    const cfg = this.buildModalContent(type, data);
    let overlay = document.getElementById("detail-modal");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "detail-modal";
      overlay.className = "modal-overlay";
      overlay.onclick = (e) => { if (e.target === overlay) CORTEX.closeModal(); };
      document.body.appendChild(overlay);
    }
    overlay.innerHTML = `
      <div class="modal-box animate-fade-in-up">
        <div class="modal-header relative">
          <button class="modal-close" onclick="CORTEX.closeModal()">
            <i data-lucide="x" class="w-5 h-5 text-white"></i>
          </button>
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <i data-lucide="${cfg.icon}" class="w-7 h-7 text-white"></i>
            </div>
            <div class="flex-1 pr-10">
              <div class="text-[10px] font-bold tracking-wider opacity-80">${cfg.tag}</div>
              <div class="text-xl font-extrabold">${cfg.title}</div>
              <div class="text-sm opacity-90">${cfg.subtitle}</div>
            </div>
          </div>
        </div>
        <div class="modal-body">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            ${cfg.stats.map(s => `
              <div class="modal-stat">
                <div class="text-[10px] font-bold text-slate-500 tracking-wider">${s.label}</div>
                <div class="text-lg font-extrabold text-slate-900 mt-1">${s.value}</div>
                ${s.trend ? `<div class="text-[10px] text-green-600 font-semibold mt-0.5">${s.trend}</div>` : ''}
              </div>
            `).join('')}
          </div>

          ${cfg.details ? `
            <div class="mb-5">
              <div class="text-xs font-bold tracking-wider text-slate-500 mb-3">DETAILS</div>
              <div class="grid grid-cols-2 gap-3">
                ${cfg.details.map(d => `
                  <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div class="text-[10px] font-bold text-slate-500 uppercase">${d.label}</div>
                    <div class="text-sm font-semibold text-slate-800 mt-0.5">${d.value}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <div class="mb-5">
            <div class="text-xs font-bold tracking-wider text-slate-500 mb-3">PROCESS TIMELINE</div>
            <div class="space-y-0">
              ${cfg.timeline.map((t, i) => `
                <div class="timeline-item ${i === cfg.timeline.length - 1 ? 'last' : ''}">
                  <div class="timeline-dot">
                    <i data-lucide="${t.icon}" class="w-4 h-4"></i>
                  </div>
                  <div class="flex-1 pb-1">
                    <div class="text-sm font-semibold text-slate-800">${t.title}</div>
                    <div class="text-xs text-slate-500">${t.desc}</div>
                    <div class="text-[10px] text-slate-400 mt-0.5">${t.time}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-blue-50 border border-violet-200">
            <div class="flex items-start gap-3">
              <div class="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                <i data-lucide="sparkles" class="w-4 h-4 text-violet-600"></i>
              </div>
              <div class="flex-1">
                <div class="text-[10px] font-bold tracking-wider text-violet-700">CORTEX AI INSIGHT</div>
                <div class="text-sm text-slate-800 mt-1">${cfg.ai}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100" onclick="CORTEX.closeModal()">Close</button>
          <button class="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-grad-blue shadow-blue-lg" onclick="CORTEX.toast('✨ ${cfg.cta} — triggered'); CORTEX.closeModal();">${cfg.cta}</button>
        </div>
      </div>
    `;
    overlay.classList.add("open");
    if (window.lucide) window.lucide.createIcons();
  },

  closeModal() {
    document.getElementById("detail-modal")?.classList.remove("open");
  },

  // ---------- ACTION / FORM MODAL ----------
  openAction(type) {
    const cfg = this.buildActionContent(type);
    let overlay = document.getElementById("detail-modal");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "detail-modal";
      overlay.className = "modal-overlay";
      overlay.onclick = (e) => { if (e.target === overlay) CORTEX.closeModal(); };
      document.body.appendChild(overlay);
    }
    overlay.innerHTML = `
      <div class="modal-box animate-fade-in-up">
        <div class="modal-header relative">
          <button class="modal-close" onclick="CORTEX.closeModal()">
            <i data-lucide="x" class="w-5 h-5 text-white"></i>
          </button>
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <i data-lucide="${cfg.icon}" class="w-7 h-7 text-white"></i>
            </div>
            <div class="flex-1 pr-10">
              <div class="text-[10px] font-bold tracking-wider opacity-80">${cfg.tag}</div>
              <div class="text-xl font-extrabold">${cfg.title}</div>
              <div class="text-sm opacity-90">${cfg.subtitle}</div>
            </div>
          </div>
        </div>
        <div class="modal-body">
          <form id="action-form" onsubmit="event.preventDefault(); CORTEX.submitAction('${type}');" class="space-y-4">
            ${cfg.fields.map(f => this.renderField(f)).join('')}
          </form>

          ${cfg.steps ? `
            <div class="mt-5 p-4 rounded-xl bg-blue-50 border border-blue-100">
              <div class="text-[10px] font-bold tracking-wider text-blue-700 mb-2">HOW IT WORKS</div>
              <div class="space-y-2">
                ${cfg.steps.map((s, i) => `
                  <div class="flex items-start gap-2 text-xs">
                    <div class="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-[10px]">${i+1}</div>
                    <div class="text-slate-700">${s}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <div class="mt-4 p-3 rounded-xl bg-gradient-to-br from-violet-50 to-blue-50 border border-violet-200 flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
              <i data-lucide="sparkles" class="w-4 h-4 text-violet-600"></i>
            </div>
            <div class="text-xs text-slate-700"><b class="text-violet-700">AI Tip:</b> ${cfg.ai}</div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100" onclick="CORTEX.closeModal()">Cancel</button>
          <button class="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-grad-blue shadow-blue-lg" onclick="CORTEX.submitAction('${type}')">${cfg.cta}</button>
        </div>
      </div>
    `;
    overlay.classList.add("open");
    if (window.lucide) window.lucide.createIcons();
  },

  renderField(f) {
    const base = `<div><label class="block text-[11px] font-bold text-slate-600 tracking-wider mb-1.5">${f.label}</label>`;
    if (f.type === "select") {
      return `${base}<select class="w-full px-3 py-2.5 bg-blue-50/50 border border-blue-100 rounded-xl text-sm outline-none focus:border-blue-400">${f.options.map(o => `<option>${o}</option>`).join('')}</select></div>`;
    }
    if (f.type === "textarea") {
      return `${base}<textarea rows="3" placeholder="${f.placeholder || ''}" class="w-full px-3 py-2.5 bg-blue-50/50 border border-blue-100 rounded-xl text-sm outline-none focus:border-blue-400 resize-none"></textarea></div>`;
    }
    if (f.type === "checkbox") {
      return `<div class="flex items-center gap-2"><input type="checkbox" ${f.checked ? 'checked' : ''} class="w-4 h-4 rounded border-blue-200"/><span class="text-sm text-slate-700">${f.label}</span></div>`;
    }
    if (f.type === "row") {
      return `<div class="grid grid-cols-2 gap-3">${f.fields.map(x => this.renderField(x)).join('')}</div>`;
    }
    if (f.type === "info") {
      return `<div class="p-3 rounded-xl bg-slate-50 border border-slate-200"><div class="text-[10px] font-bold text-slate-500 uppercase">${f.label}</div><div class="text-sm font-semibold text-slate-800 mt-0.5">${f.value}</div></div>`;
    }
    return `${base}<input type="${f.type || 'text'}" placeholder="${f.placeholder || ''}" value="${f.value || ''}" class="w-full px-3 py-2.5 bg-blue-50/50 border border-blue-100 rounded-xl text-sm outline-none focus:border-blue-400"/></div>`;
  },

  submitAction(type) {
    const msgs = {
      "add-lead": "✅ New lead added to CRM pipeline",
      "add-employee": "✅ Employee onboarding started",
      "new-invoice": "✅ Invoice drafted and ready to send",
      "new-entry": "✅ Journal entry posted to GL",
      "new-campaign": "✅ Campaign queued for launch",
      "new-pipeline": "✅ Data pipeline created",
      "new-project": "✅ Project kicked off",
      "new-agent": "✅ AI agent deployed",
      "export": "📥 Export started — file ready in 30s",
      "reports": "📊 Report generated — check your email",
      "filter": "🔍 Filters applied",
      "scheduler": "📅 Post scheduled successfully",
      "ab-tests": "🧪 A/B test created",
      "api-keys": "🔑 API key generated",
      "webhooks": "🔗 Webhook registered",
      "upload-receipt": "📸 Receipt uploaded & auto-categorized",
      "scan-receipt": "📸 Receipt scanned & journal entry created",
      "calendar": "📅 Calendar event saved",
    };
    this.closeModal();
    this.toast(msgs[type] || "✨ Action completed");
  },

  buildActionContent(type) {
    const builders = {
      "add-lead": () => ({
        tag: "CRM · ADD LEAD", icon: "user-plus", title: "Add New Lead", subtitle: "Capture a new prospect into your sales pipeline",
        fields: [
          { type: "row", fields: [
            { label: "Full Name", placeholder: "e.g. Sarah Mitchell" },
            { label: "Company", placeholder: "e.g. TechCorp NSW" },
          ]},
          { type: "row", fields: [
            { label: "Email", type: "email", placeholder: "name@company.com" },
            { label: "Phone", type: "tel", placeholder: "+61 2 1234 5678" },
          ]},
          { type: "row", fields: [
            { label: "Deal Value", placeholder: "$50,000" },
            { label: "Stage", type: "select", options: ["Lead", "Qualified", "Proposal", "Negotiation"] },
          ]},
          { label: "Notes", type: "textarea", placeholder: "Initial contact notes, pain points, next steps..." },
        ],
        steps: ["Fill in contact details and assign a stage", "Cortex auto-scores the lead 0–100 based on ICP match", "Lead appears on your Sales Pipeline kanban", "Auto-assigned to best-fit rep based on territory"],
        ai: "Similar leads close at 28% rate. I'll draft an intro email the moment you save.",
        cta: "Add Lead",
      }),

      "add-employee": () => ({
        tag: "HRM · ONBOARDING", icon: "user-plus", title: "Add New Employee", subtitle: "Start the full onboarding workflow",
        fields: [
          { type: "row", fields: [
            { label: "Full Name", placeholder: "e.g. Priya Sharma" },
            { label: "Employee ID", value: "EMP-0312" },
          ]},
          { type: "row", fields: [
            { label: "Department", type: "select", options: ["Engineering", "Product", "Design", "Marketing", "Sales", "HR", "Operations"] },
            { label: "Role / Title", placeholder: "e.g. Senior Engineer" },
          ]},
          { type: "row", fields: [
            { label: "Reporting To", type: "select", options: ["Rania Jamil (CEO)", "Michael C. (VP Eng)", "Sarah J. (VP Product)", "Anna K. (VP Marketing)"] },
            { label: "Start Date", type: "date" },
          ]},
          { type: "row", fields: [
            { label: "Salary (Annual)", placeholder: "$90,000" },
            { label: "Location", type: "select", options: ["Sydney", "Melbourne", "Singapore", "Remote"] },
          ]},
          { label: "Send welcome email with login credentials", type: "checkbox", checked: true },
        ],
        steps: ["Employee record created in HRM", "Payroll, benefits & IT provisioning auto-triggered", "Welcome email + onboarding checklist sent", "Manager notified, buddy assigned"],
        ai: "I'll pre-generate a 30-60-90 day onboarding plan tailored to their role.",
        cta: "Onboard Employee",
      }),

      "new-invoice": () => ({
        tag: "FINANCE · NEW INVOICE", icon: "file-plus", title: "Create New Invoice", subtitle: "Bill a client in seconds",
        fields: [
          { type: "row", fields: [
            { label: "Invoice Number", value: "INV-2026-0143" },
            { label: "Issue Date", type: "date" },
          ]},
          { label: "Client", type: "select", options: ["TechCorp NSW", "Summit Ventures", "Horizon Group", "Nexus Labs", "Blue Ocean Ltd", "GlobalTech"] },
          { type: "row", fields: [
            { label: "Amount (Excl. Tax)", placeholder: "$48,500" },
            { label: "Tax Rate", type: "select", options: ["10% GST", "5% VAT", "No Tax", "Custom"] },
          ]},
          { type: "row", fields: [
            { label: "Payment Terms", type: "select", options: ["Net 7", "Net 15", "Net 30", "Net 60", "Due on receipt"] },
            { label: "Currency", type: "select", options: ["AUD", "USD", "EUR", "SGD", "GBP"] },
          ]},
          { label: "Line Items / Description", type: "textarea", placeholder: "e.g. Professional services – March 2026..." },
          { label: "Send to client immediately via email", type: "checkbox", checked: true },
        ],
        steps: ["Invoice generated with unique number", "PDF auto-rendered with your branding", "Emailed to client with payment link", "Tracked in Finance OS → auto-reminder if overdue"],
        ai: "Based on this client's history, they pay in 12 days on average — no follow-up needed.",
        cta: "Create Invoice",
      }),

      "new-entry": () => ({
        tag: "ACCOUNTS · JOURNAL ENTRY", icon: "book-open", title: "New Journal Entry", subtitle: "Add a debit/credit entry to the GL",
        fields: [
          { type: "row", fields: [
            { label: "Entry Reference", value: "JE-2026-0090" },
            { label: "Date", type: "date" },
          ]},
          { label: "Description", placeholder: "e.g. Office rent payment for April" },
          { type: "row", fields: [
            { label: "Debit Account", type: "select", options: ["1000 – Cash", "1200 – Accounts Receivable", "6100 – Salaries Expense", "6200 – Rent Expense", "6300 – Utilities"] },
            { label: "Credit Account", type: "select", options: ["1000 – Cash", "2000 – Accounts Payable", "2100 – Payroll Payable", "4000 – Revenue"] },
          ]},
          { type: "row", fields: [
            { label: "Amount", placeholder: "$12,500" },
            { label: "Tax Code", type: "select", options: ["None", "GST 10%", "Input Tax", "Export"] },
          ]},
          { label: "Memo", type: "textarea", placeholder: "Supporting details..." },
        ],
        steps: ["Entry validated for balanced debit/credit", "Routed to finance lead for approval (if > $10K)", "Posted to General Ledger", "Reflected in trial balance & reports instantly"],
        ai: "This entry looks routine — matches your recurring rent pattern. Auto-approved path available.",
        cta: "Post Entry",
      }),

      "new-campaign": () => ({
        tag: "GROWTH · NEW CAMPAIGN", icon: "rocket", title: "Create New Campaign", subtitle: "Launch a multi-channel marketing campaign",
        fields: [
          { label: "Campaign Name", placeholder: "e.g. Summer Product Launch 2026" },
          { type: "row", fields: [
            { label: "Objective", type: "select", options: ["Brand Awareness", "Lead Generation", "Conversions", "Engagement", "Retention"] },
            { label: "Channel", type: "select", options: ["Google Ads", "Meta (FB+IG)", "LinkedIn", "Email", "Multi-channel"] },
          ]},
          { type: "row", fields: [
            { label: "Start Date", type: "date" },
            { label: "End Date", type: "date" },
          ]},
          { type: "row", fields: [
            { label: "Budget", placeholder: "$25,000" },
            { label: "Target Audience", type: "select", options: ["High-Intent Buyers", "Enterprise Leads", "Re-engagement", "Lookalike", "Custom"] },
          ]},
          { label: "Creative Brief", type: "textarea", placeholder: "Messaging, tone, offers, visuals..." },
          { label: "Use AI to generate ad copy & creatives", type: "checkbox", checked: true },
        ],
        steps: ["Campaign created in Growth Engine", "AI generates 12 ad variants + 4 landing pages", "Budget allocated, targeting configured", "Live within 10 minutes of approval"],
        ai: "Based on your past data, LinkedIn + Email combo yields 3.8x ROAS for B2B SaaS. Recommend allocating 60/40 split.",
        cta: "Launch Campaign",
      }),

      "new-pipeline": () => ({
        tag: "INTEGRATION · DATA PIPELINE", icon: "git-branch", title: "New Data Pipeline", subtitle: "Sync data between apps on a schedule",
        fields: [
          { label: "Pipeline Name", placeholder: "e.g. Salesforce → BigQuery ETL" },
          { type: "row", fields: [
            { label: "Source", type: "select", options: ["Salesforce", "HubSpot", "Stripe", "Shopify", "PostgreSQL", "MySQL", "Google Sheets", "CSV Upload"] },
            { label: "Destination", type: "select", options: ["BigQuery", "Snowflake", "Redshift", "PostgreSQL", "S3 Bucket", "Cortex Warehouse"] },
          ]},
          { type: "row", fields: [
            { label: "Schedule", type: "select", options: ["Real-time", "Every 5 min", "Every 15 min", "Hourly", "Daily", "Weekly"] },
            { label: "Mode", type: "select", options: ["Incremental", "Full refresh", "Append only", "Upsert"] },
          ]},
          { label: "Transformation Rules (SQL / Python)", type: "textarea", placeholder: "SELECT id, name, email, created_at FROM leads WHERE ..." },
          { label: "Send alert on failure", type: "checkbox", checked: true },
        ],
        steps: ["Source & destination credentials validated", "Schema mapping auto-detected", "Test run executed on 100 sample rows", "Scheduled & monitoring enabled"],
        ai: "I can auto-detect your source schema and suggest an optimal transformation — saves ~45 min of config.",
        cta: "Create Pipeline",
      }),

      "new-project": () => ({
        tag: "PROJECTS · NEW PROJECT", icon: "folder-plus", title: "Start New Project", subtitle: "Kick off a project with team, budget & sprints",
        fields: [
          { label: "Project Name", placeholder: "e.g. Mobile App Redesign" },
          { type: "row", fields: [
            { label: "Client", placeholder: "e.g. TechCorp NSW" },
            { label: "Project Type", type: "select", options: ["Internal", "Client Work", "R&D", "Maintenance"] },
          ]},
          { type: "row", fields: [
            { label: "Start Date", type: "date" },
            { label: "Deadline", type: "date" },
          ]},
          { type: "row", fields: [
            { label: "Budget", placeholder: "$120,000" },
            { label: "Priority", type: "select", options: ["Low", "Medium", "High", "Critical"] },
          ]},
          { label: "Methodology", type: "select", options: ["Agile (2-wk sprints)", "Scrum", "Kanban", "Waterfall"] },
          { label: "Project Goals & Scope", type: "textarea", placeholder: "Deliverables, success criteria, constraints..." },
        ],
        steps: ["Project created with workspace & kanban board", "Team staffed based on skills & availability", "Sprints scheduled, backlog populated", "Stakeholders notified, tracking begins"],
        ai: "Similar projects averaged 12 weeks. I'll flag risk if velocity drops below plan.",
        cta: "Start Project",
      }),

      "new-agent": () => ({
        tag: "AGENTS · DEPLOY NEW AGENT", icon: "bot", title: "Deploy AI Agent", subtitle: "Automate a repetitive business workflow",
        fields: [
          { label: "Agent Name", placeholder: "e.g. Invoice Processor" },
          { type: "row", fields: [
            { label: "Template", type: "select", options: ["Lead Qualifier", "Support Triage", "Invoice Processor", "Content Writer", "Custom"] },
            { label: "Model", type: "select", options: ["Claude Opus 4.6", "Claude Sonnet 4.6", "GPT-5", "Cortex-Native"] },
          ]},
          { label: "Trigger", type: "select", options: ["New record (CRM)", "Webhook event", "Schedule (Cron)", "Manual / on-demand"] },
          { label: "Tools the agent can use", type: "select", options: ["CRM + Email", "Finance + Accounting", "Docs + Knowledge Base", "All tools"] },
          { label: "Instructions (System Prompt)", type: "textarea", placeholder: "You are a helpful agent that..." },
          { label: "Run in sandbox for 24h before going live", type: "checkbox", checked: true },
        ],
        steps: ["Agent compiled & validated", "Sandbox run against last 100 real events", "Performance report generated", "Deployed to production with monitoring"],
        ai: "Lead Qualifier template is your best performing agent at 94% accuracy — recommend starting from it.",
        cta: "Deploy Agent",
      }),

      "export": () => ({
        tag: "DATA EXPORT", icon: "download", title: "Export Data", subtitle: "Download a snapshot of your data",
        fields: [
          { label: "What to Export", type: "select", options: ["Everything on this page", "Filtered results only", "Custom selection"] },
          { type: "row", fields: [
            { label: "Format", type: "select", options: ["CSV", "Excel (.xlsx)", "PDF Report", "JSON"] },
            { label: "Date Range", type: "select", options: ["Last 7 days", "Last 30 days", "This quarter", "This year", "All time"] },
          ]},
          { label: "Include charts & visualizations", type: "checkbox", checked: true },
          { label: "Email export link when ready", type: "checkbox", checked: true },
          { label: "Email address", type: "email", value: "rania@aist.tech" },
        ],
        steps: ["Cortex packages the data per your filters", "File generated (typically < 30 seconds)", "Download link appears here & emailed", "File expires in 7 days for security"],
        ai: "For this volume (~12K rows), CSV is fastest. PDF is best if you need to share with execs.",
        cta: "Start Export",
      }),

      "reports": () => ({
        tag: "REPORTS", icon: "file-bar-chart", title: "Generate Report", subtitle: "Build a custom report in seconds",
        fields: [
          { label: "Report Type", type: "select", options: ["Executive Summary", "Financial Statement", "Sales Performance", "HR Attendance", "Marketing ROI", "Custom"] },
          { type: "row", fields: [
            { label: "Period", type: "select", options: ["This week", "This month", "This quarter", "YTD", "Custom range"] },
            { label: "Format", type: "select", options: ["PDF", "PowerPoint", "Interactive dashboard", "Email digest"] },
          ]},
          { label: "Compare vs. previous period", type: "checkbox", checked: true },
          { label: "Include AI commentary & insights", type: "checkbox", checked: true },
          { label: "Schedule recurring delivery", type: "checkbox" },
        ],
        steps: ["Cortex pulls data from all connected modules", "AI writes narrative commentary on trends", "Report rendered with your brand", "Delivered to your inbox (or shared link)"],
        ai: "Executive Summary is most requested. I'll highlight any anomaly that deviates >15% from plan.",
        cta: "Generate Report",
      }),

      "filter": () => ({
        tag: "FILTERS", icon: "filter", title: "Advanced Filters", subtitle: "Narrow down what you see",
        fields: [
          { label: "Status", type: "select", options: ["All", "Active", "Pending", "Closed", "On Hold"] },
          { label: "Owner", type: "select", options: ["Everyone", "Me", "My team", "Specific person"] },
          { type: "row", fields: [
            { label: "Date From", type: "date" },
            { label: "Date To", type: "date" },
          ]},
          { type: "row", fields: [
            { label: "Min Value", placeholder: "$0" },
            { label: "Max Value", placeholder: "$1,000,000" },
          ]},
          { label: "Tags", placeholder: "hot, enterprise, renewal..." },
          { label: "Save as view", type: "checkbox" },
        ],
        steps: ["Filters apply instantly to your view", "Optionally save as a reusable view", "Shared views visible to your team"],
        ai: "I can suggest a smart filter based on what you usually look for — click Apply to try.",
        cta: "Apply Filters",
      }),

      "scheduler": () => ({
        tag: "SCHEDULER", icon: "calendar", title: "Schedule Social Post", subtitle: "Plan content across platforms",
        fields: [
          { label: "Post Content", type: "textarea", placeholder: "Write your post or let AI draft it..." },
          { type: "row", fields: [
            { label: "Platform", type: "select", options: ["LinkedIn", "Twitter / X", "Instagram", "Facebook", "All platforms"] },
            { label: "Post Type", type: "select", options: ["Text", "Image", "Video", "Carousel", "Thread"] },
          ]},
          { type: "row", fields: [
            { label: "Date", type: "date" },
            { label: "Time", type: "time" },
          ]},
          { label: "Hashtags", placeholder: "#AI #SaaS #Growth" },
          { label: "Auto-optimize send time for best engagement", type: "checkbox", checked: true },
          { label: "Let AI A/B test 3 variations", type: "checkbox" },
        ],
        steps: ["Post saved to content calendar", "AI suggests optimal send time if enabled", "Auto-publishes via connected accounts", "Engagement tracked back into Growth Engine"],
        ai: "Tuesday 10 AM has 34% higher engagement for your audience — want me to use that?",
        cta: "Schedule Post",
      }),

      "ab-tests": () => ({
        tag: "A/B TESTING", icon: "beaker", title: "Create A/B Test", subtitle: "Let data decide the winning variant",
        fields: [
          { label: "Test Name", placeholder: "e.g. Hero CTA Button Test" },
          { label: "Test Element", type: "select", options: ["Headline", "CTA Button", "Hero Image", "Pricing Layout", "Email Subject", "Landing Page"] },
          { label: "Variant A (Control)", type: "textarea", placeholder: "e.g. Get Started Free" },
          { label: "Variant B", type: "textarea", placeholder: "e.g. Start My Free Trial →" },
          { type: "row", fields: [
            { label: "Traffic Split", type: "select", options: ["50 / 50", "80 / 20", "70 / 30"] },
            { label: "Duration", type: "select", options: ["7 days", "14 days", "Until significance"] },
          ]},
          { label: "Primary Metric", type: "select", options: ["Conversion Rate", "Click-through Rate", "Revenue", "Sign-ups", "Engagement"] },
        ],
        steps: ["Test configured and variants pushed live", "Traffic split across variants automatically", "Statistical significance checked daily", "Winner declared & auto-rolled out"],
        ai: "You need ~2,400 visitors per variant to reach 95% confidence. Currently averaging 520/day — ETA 5 days.",
        cta: "Start Test",
      }),

      "api-keys": () => ({
        tag: "INTEGRATION · API KEYS", icon: "key", title: "Generate API Key", subtitle: "Create a key for programmatic access",
        fields: [
          { label: "Key Name", placeholder: "e.g. Production Backend" },
          { label: "Environment", type: "select", options: ["Production", "Staging", "Development", "Sandbox"] },
          { label: "Permissions", type: "select", options: ["Read only", "Read + Write", "Full Admin", "Custom scopes"] },
          { type: "row", fields: [
            { label: "IP Whitelist (optional)", placeholder: "192.168.1.0/24" },
            { label: "Expiry", type: "select", options: ["30 days", "90 days", "1 year", "Never"] },
          ]},
          { label: "Rate Limit (req/min)", type: "select", options: ["100", "500", "1,000", "5,000", "Unlimited"] },
          { type: "info", label: "Security Notice", value: "Key is shown ONCE after creation. Store it in a secrets manager." },
        ],
        steps: ["Key generated with SHA-256 hash stored", "Displayed once — copy immediately", "Audit log records every request", "Auto-revoke on suspicious activity"],
        ai: "Read-only keys are your safest default. Use Full Admin only for trusted backend services.",
        cta: "Generate Key",
      }),

      "webhooks": () => ({
        tag: "INTEGRATION · WEBHOOKS", icon: "webhook", title: "Register Webhook", subtitle: "Send real-time events to your URL",
        fields: [
          { label: "Webhook Name", placeholder: "e.g. CRM → Slack Alert" },
          { label: "Target URL", type: "url", placeholder: "https://your-app.com/hooks/cortex" },
          { label: "Events to Subscribe", type: "select", options: ["Lead created", "Deal closed", "Invoice paid", "Project completed", "All events"] },
          { type: "row", fields: [
            { label: "HTTP Method", type: "select", options: ["POST", "PUT", "PATCH"] },
            { label: "Content Type", type: "select", options: ["application/json", "application/x-www-form-urlencoded"] },
          ]},
          { label: "Signing Secret", value: "whsec_•••••••••••••••••••••" },
          { label: "Enable retries on failure (up to 5)", type: "checkbox", checked: true },
        ],
        steps: ["Webhook endpoint validated (we send a ping)", "Signing secret generated for verification", "Events start flowing in real-time", "Retry queue handles transient failures"],
        ai: "Verify signatures using HMAC-SHA256 with the signing secret — prevents spoofed events.",
        cta: "Register Webhook",
      }),

      "upload-receipt": () => ({
        tag: "ACCOUNTS · UPLOAD RECEIPT", icon: "upload", title: "Upload Receipt", subtitle: "Scan or upload — AI does the rest",
        fields: [
          { type: "info", label: "Drag & Drop", value: "Drop PDF, JPG, or PNG files here (or click to browse)" },
          { label: "Expense Category", type: "select", options: ["Travel", "Meals", "Office Supplies", "Software", "Utilities", "Marketing", "Other"] },
          { type: "row", fields: [
            { label: "Vendor", placeholder: "e.g. Uber, AWS, Office Depot" },
            { label: "Amount", placeholder: "$124.50" },
          ]},
          { label: "Billable to client?", type: "select", options: ["Not billable", "TechCorp NSW", "Summit Ventures", "Horizon Group"] },
          { label: "Notes", type: "textarea", placeholder: "Purpose, attendees, project..." },
          { label: "Auto-create journal entry", type: "checkbox", checked: true },
        ],
        steps: ["OCR extracts vendor, date, amount, tax", "AI categorizes based on vendor + your history", "Matched to PO if one exists", "Journal entry created & awaits approval"],
        ai: "I recognize this vendor from 14 past receipts — auto-filling category & GL account.",
        cta: "Upload & Process",
      }),

      "scan-receipt": () => ({
        tag: "ACCOUNTS · SCAN RECEIPT", icon: "scan-line", title: "Scan Receipt", subtitle: "Use your camera to capture & process",
        fields: [
          { type: "info", label: "Live Camera", value: "Point your phone camera at the receipt — auto-captures when aligned" },
          { label: "Quick-fix: correct vendor if wrong", placeholder: "Vendor name" },
          { type: "row", fields: [
            { label: "Detected Amount", value: "$124.50" },
            { label: "Detected Tax", value: "$11.32" },
          ]},
          { label: "Category (auto-detected)", type: "select", options: ["Meals & Entertainment", "Travel", "Software", "Office Supplies"] },
        ],
        steps: ["Live OCR runs on device in real-time", "Cortex extracts all relevant fields", "You confirm or correct details", "Posted to GL with supporting image attached"],
        ai: "Scanning is 12x faster than manual entry. Average user saves 40 min/week.",
        cta: "Post Entry",
      }),

      "calendar": () => ({
        tag: "CALENDAR", icon: "calendar", title: "HR Calendar", subtitle: "Leave, birthdays, reviews & events",
        fields: [
          { label: "Event Type", type: "select", options: ["Leave / Time Off", "Birthday", "Work Anniversary", "Performance Review", "1:1 Meeting", "Team Event", "Holiday"] },
          { label: "Employee", type: "select", options: ["All employees", "Priya Sharma", "Michael Chen", "Sarah Johnson", "Anna Kowalski"] },
          { type: "row", fields: [
            { label: "Start Date", type: "date" },
            { label: "End Date", type: "date" },
          ]},
          { label: "Notes", type: "textarea", placeholder: "Reason, context, coverage plan..." },
          { label: "Notify manager", type: "checkbox", checked: true },
        ],
        steps: ["Event saved to HR calendar", "Conflicts with existing events flagged", "Manager notified for approval (if leave)", "Team calendar updated in real-time"],
        ai: "Your team has 12 people on leave next week — might want to reschedule this if possible.",
        cta: "Save Event",
      }),
    };
    return (builders[type] || builders["export"])();
  },

  buildModalContent(type, d) {
    d = d || {};
    const builders = {
      campaign: () => ({
        tag: "MARKETING CAMPAIGN",
        icon: "megaphone",
        title: d.name || "Summer Growth Push",
        subtitle: `${d.channel || "Multi-channel"} · ${d.status || "Active"}`,
        stats: [
          { label: "BUDGET", value: d.budget || "$45K" },
          { label: "SPENT", value: d.spent || "$28K" },
          { label: "LEADS", value: d.leads || "342", trend: "+18%" },
          { label: "ROAS", value: d.roas || "4.2x", trend: "+0.6x" },
        ],
        details: [
          { label: "Start Date", value: d.start || "Mar 01, 2026" },
          { label: "End Date", value: d.end || "Apr 30, 2026" },
          { label: "Owner", value: d.owner || "Rania Jamil" },
          { label: "Target Audience", value: d.audience || "SMB · APAC" },
        ],
        timeline: [
          { icon: "lightbulb", title: "Campaign Created", desc: "Brief approved by marketing lead", time: "Mar 01" },
          { icon: "image", title: "Creative Assets Uploaded", desc: "12 ad variants + 4 landing pages", time: "Mar 03" },
          { icon: "rocket", title: "Campaign Launched", desc: "Live on Google, Meta, LinkedIn", time: "Mar 05" },
          { icon: "trending-up", title: "Optimization Round 1", desc: "Paused 3 underperforming ads, scaled top 2", time: "Mar 18" },
          { icon: "target", title: "Mid-Campaign Review", desc: "On track — 62% of target leads hit", time: "Today" },
        ],
        ai: `This campaign is outperforming benchmark by 24%. Recommend increasing daily budget by $500 on the top Meta creative to capture incremental demand before weekend.`,
        cta: "Boost Campaign",
      }),

      schedule: () => ({
        tag: "SCHEDULED POST",
        icon: "calendar-clock",
        title: d.title || "Product Launch Announcement",
        subtitle: `${d.platform || "LinkedIn + Twitter"} · ${d.when || "Tomorrow 10:00 AM"}`,
        stats: [
          { label: "PLATFORM", value: d.platform || "LinkedIn" },
          { label: "REACH EST.", value: d.reach || "12.4K" },
          { label: "ENGAGE EST.", value: d.engage || "680" },
          { label: "STATUS", value: d.status || "Scheduled" },
        ],
        details: [
          { label: "Post Type", value: d.type || "Video + Copy" },
          { label: "Hashtags", value: "#AI #SaaS #Launch" },
          { label: "Author", value: "Rania Jamil" },
          { label: "Approved By", value: "Marketing Lead" },
        ],
        timeline: [
          { icon: "pen-tool", title: "Draft Created", desc: "Initial copy + visual assembled", time: "Yesterday 3:20 PM" },
          { icon: "check-circle", title: "Approved", desc: "Brand team signed off", time: "Yesterday 5:45 PM" },
          { icon: "calendar-clock", title: "Scheduled", desc: "Queued for optimal send time", time: "Today 9:10 AM" },
          { icon: "send", title: "Will Publish", desc: "Automatic post via Buffer integration", time: "Tomorrow 10:00 AM" },
        ],
        ai: `Optimal post time detected: 10:00 AM captures 34% more engagement for your audience. This post is predicted to exceed average by 2.1x.`,
        cta: "Edit Post",
      }),

      employee: () => ({
        tag: "EMPLOYEE PROFILE",
        icon: "user",
        title: d.name || "Priya Sharma",
        subtitle: `${d.role || "Senior Engineer"} · ${d.dept || "Engineering"}`,
        stats: [
          { label: "TENURE", value: d.tenure || "2.4 yrs" },
          { label: "PERFORMANCE", value: d.perf || "4.6/5" },
          { label: "ATTENDANCE", value: d.attendance || "96%" },
          { label: "PROJECTS", value: d.projects || "4 active" },
        ],
        details: [
          { label: "Employee ID", value: d.id || "EMP-0231" },
          { label: "Join Date", value: d.joined || "Oct 15, 2023" },
          { label: "Reports To", value: d.manager || "Rania Jamil" },
          { label: "Location", value: d.location || "Sydney, AU" },
        ],
        timeline: [
          { icon: "user-plus", title: "Onboarded", desc: "Completed 2-week onboarding program", time: "Oct 2023" },
          { icon: "award", title: "First Promotion", desc: "Engineer II → Senior Engineer", time: "Jun 2024" },
          { icon: "star", title: "Performance Review", desc: "Rated 4.6/5 — Exceeds expectations", time: "Dec 2025" },
          { icon: "trending-up", title: "Leading Project Alpha", desc: "Now lead engineer on flagship initiative", time: "Current" },
        ],
        ai: `Priya is a top 10% performer. Ready for Staff Engineer promotion within 6 months. Recommend pairing with mentorship for leadership track.`,
        cta: "View Full Profile",
      }),

      role: () => ({
        tag: "OPEN POSITION",
        icon: "briefcase",
        title: d.title || "Senior Product Designer",
        subtitle: `${d.dept || "Design"} · ${d.location || "Remote · APAC"}`,
        stats: [
          { label: "APPLICANTS", value: d.applicants || "47" },
          { label: "SHORTLISTED", value: d.shortlisted || "8" },
          { label: "DAYS OPEN", value: d.days || "18" },
          { label: "PRIORITY", value: d.priority || "High" },
        ],
        details: [
          { label: "Salary Range", value: d.salary || "$90K – $120K" },
          { label: "Employment", value: "Full-time" },
          { label: "Hiring Manager", value: "Rania Jamil" },
          { label: "Required Skills", value: "Figma · UX · Design Systems" },
        ],
        timeline: [
          { icon: "file-plus", title: "Role Opened", desc: "JD published on career page + LinkedIn", time: "Mar 28" },
          { icon: "users", title: "Sourcing Active", desc: "47 applicants received, 12 sourced", time: "Apr 02" },
          { icon: "phone", title: "Phone Screens", desc: "8 candidates moved to phone screen", time: "Apr 08" },
          { icon: "user-check", title: "Final Round Pending", desc: "3 candidates in final interview loop", time: "This week" },
        ],
        ai: `Time-to-fill trending 4 days faster than average. Top candidate "Alex Chen" scored 92/100 on our hiring matrix — recommend fast-tracking offer.`,
        cta: "Review Candidates",
      }),

      project: () => ({
        tag: "PROJECT",
        icon: "folder-kanban",
        title: d.name || "Project Alpha",
        subtitle: `${d.client || "TechCorp NSW"} · ${d.status || "In Progress"}`,
        stats: [
          { label: "PROGRESS", value: d.progress || "68%" },
          { label: "BUDGET", value: d.budget || "$340K" },
          { label: "DUE DATE", value: d.due || "May 15" },
          { label: "HEALTH", value: d.health || "At Risk" },
        ],
        details: [
          { label: "Team Size", value: d.team || "8 members" },
          { label: "Tasks Done", value: "42 / 62" },
          { label: "Project Lead", value: "Rania Jamil" },
          { label: "Methodology", value: "Agile · 2wk sprints" },
        ],
        timeline: [
          { icon: "flag", title: "Kickoff", desc: "Requirements finalized + team staffed", time: "Jan 08" },
          { icon: "layers", title: "Sprint 1-3", desc: "Core architecture + data model built", time: "Jan – Feb" },
          { icon: "code", title: "Sprint 4-6", desc: "Feature development 60% complete", time: "Mar" },
          { icon: "alert-triangle", title: "Risk Flagged", desc: "API dependency blocker identified", time: "Apr 10" },
          { icon: "target", title: "Delivery Target", desc: "UAT + Go-live scheduled", time: "May 15" },
        ],
        ai: `Blocker analysis: API dependency adds 8-day risk to timeline. Recommend parallelizing mock-data path so downstream work continues while integration unblocks.`,
        cta: "Open Project",
      }),

      deal: () => ({
        tag: "SALES DEAL",
        icon: "handshake",
        title: d.name || "TechCorp NSW Upsell",
        subtitle: `${d.stage || "Proposal"} · ${d.value || "$340K"}`,
        stats: [
          { label: "VALUE", value: d.value || "$340K" },
          { label: "STAGE", value: d.stage || "Proposal" },
          { label: "PROBABILITY", value: d.prob || "75%" },
          { label: "CLOSE DATE", value: d.close || "Apr 30" },
        ],
        details: [
          { label: "Account", value: d.account || "TechCorp NSW" },
          { label: "Contact", value: d.contact || "Sarah Mitchell" },
          { label: "Deal Owner", value: "Rania Jamil" },
          { label: "Source", value: "Inbound · Referral" },
        ],
        timeline: [
          { icon: "mail", title: "Lead Captured", desc: "Form submission + auto-qualified", time: "Feb 12" },
          { icon: "phone", title: "Discovery Call", desc: "60-min needs analysis completed", time: "Feb 20" },
          { icon: "file-text", title: "Proposal Sent", desc: "Custom proposal delivered via DocuSign", time: "Mar 15" },
          { icon: "video", title: "Proposal Review", desc: "Stakeholder call scheduled", time: "Apr 18" },
          { icon: "check-circle", title: "Expected Close", desc: "Final signatures targeted", time: "Apr 30" },
        ],
        ai: `Deal confidence raised to 82% based on engagement signals. Decision-maker opened proposal 4 times. Recommend scheduling close-call this week.`,
        cta: "Advance Deal",
      }),

      contact: () => ({
        tag: "CONTACT",
        icon: "user-circle",
        title: d.name || "Sarah Mitchell",
        subtitle: `${d.role || "VP Operations"} · ${d.company || "TechCorp NSW"}`,
        stats: [
          { label: "DEALS", value: d.deals || "3" },
          { label: "LIFETIME VALUE", value: d.ltv || "$820K" },
          { label: "ENGAGEMENT", value: d.eng || "High" },
          { label: "LAST CONTACT", value: d.last || "2d ago" },
        ],
        details: [
          { label: "Email", value: d.email || "sarah@techcorp.au" },
          { label: "Phone", value: d.phone || "+61 2 1234 5678" },
          { label: "LinkedIn", value: "linkedin.com/in/smitchell" },
          { label: "Time Zone", value: "AEDT (UTC+11)" },
        ],
        timeline: [
          { icon: "mail", title: "First Contact", desc: "Replied to outbound sequence", time: "Jan 2025" },
          { icon: "handshake", title: "First Deal Closed", desc: "$180K Enterprise License", time: "Mar 2025" },
          { icon: "refresh-cw", title: "Renewal Signed", desc: "Extended 3-year agreement", time: "Dec 2025" },
          { icon: "trending-up", title: "Upsell In Progress", desc: "$340K expansion opportunity open", time: "Active" },
        ],
        ai: `Sarah is a power-user advocate. Predicted lifetime value: $1.4M. Recommend inviting to customer advisory board + case-study co-authoring.`,
        cta: "Log Activity",
      }),

      invoice: () => ({
        tag: "INVOICE",
        icon: "file-text",
        title: d.number || "INV-2026-0142",
        subtitle: `${d.client || "TechCorp NSW"} · ${d.status || "Pending"}`,
        stats: [
          { label: "AMOUNT", value: d.amount || "$48,500" },
          { label: "DUE DATE", value: d.due || "Apr 22" },
          { label: "STATUS", value: d.status || "Pending" },
          { label: "DAYS OUT", value: d.days || "7" },
        ],
        details: [
          { label: "Issue Date", value: d.issued || "Mar 22, 2026" },
          { label: "Terms", value: "Net 30" },
          { label: "Tax", value: "10% GST · $4,409" },
          { label: "Currency", value: "AUD" },
        ],
        timeline: [
          { icon: "file-plus", title: "Invoice Generated", desc: "Auto-created from approved SoW", time: "Mar 22" },
          { icon: "mail", title: "Sent to Client", desc: "Emailed with payment link", time: "Mar 22" },
          { icon: "eye", title: "Viewed by Client", desc: "Opened 3 times, downloaded once", time: "Mar 25" },
          { icon: "clock", title: "Payment Pending", desc: "Due in 7 days · Auto-reminder set", time: "Apr 22" },
        ],
        ai: `Client historically pays 2 days before due date. No action needed — 94% on-time payment score. If unpaid by Apr 24, auto-reminder will fire.`,
        cta: "Send Reminder",
      }),

      journal: () => ({
        tag: "JOURNAL ENTRY",
        icon: "book-open",
        title: d.ref || "JE-2026-0089",
        subtitle: `${d.desc || "Payroll Expense"} · ${d.date || "Apr 01, 2026"}`,
        stats: [
          { label: "DEBIT", value: d.debit || "$82,400" },
          { label: "CREDIT", value: d.credit || "$82,400" },
          { label: "STATUS", value: d.status || "Posted" },
          { label: "TYPE", value: d.type || "Recurring" },
        ],
        details: [
          { label: "Account (DR)", value: "6100 – Salaries Expense" },
          { label: "Account (CR)", value: "2100 – Payroll Payable" },
          { label: "Created By", value: "System · Auto-post" },
          { label: "Approved By", value: "Rania Jamil" },
        ],
        timeline: [
          { icon: "calculator", title: "Draft Created", desc: "Auto-generated from payroll run", time: "Mar 31 11:58 PM" },
          { icon: "eye", title: "Reviewed", desc: "Reviewed by Finance Lead", time: "Apr 01 9:15 AM" },
          { icon: "check-circle", title: "Approved", desc: "Sign-off received, ready to post", time: "Apr 01 10:02 AM" },
          { icon: "book-open", title: "Posted to GL", desc: "Entry posted to General Ledger", time: "Apr 01 10:04 AM" },
        ],
        ai: `This entry is part of the recurring monthly payroll batch. Anomaly check: no deviation vs. prior period — entry is routine and compliant.`,
        cta: "View Ledger",
      }),

      app: () => ({
        tag: "INTEGRATION",
        icon: "plug",
        title: d.name || "Slack",
        subtitle: `${d.category || "Communication"} · ${d.status || "Connected"}`,
        stats: [
          { label: "STATUS", value: d.status || "Healthy" },
          { label: "EVENTS/DAY", value: d.events || "12.4K" },
          { label: "LATENCY", value: d.latency || "82ms" },
          { label: "UPTIME", value: d.uptime || "99.98%" },
        ],
        details: [
          { label: "Connected", value: d.connected || "Jan 12, 2025" },
          { label: "Last Sync", value: d.sync || "2 min ago" },
          { label: "Auth Type", value: "OAuth 2.0" },
          { label: "Webhooks", value: "4 active" },
        ],
        timeline: [
          { icon: "plug", title: "App Connected", desc: "OAuth flow completed + scopes granted", time: "Jan 12 2025" },
          { icon: "settings", title: "Webhooks Configured", desc: "4 event subscriptions set up", time: "Jan 13 2025" },
          { icon: "activity", title: "Running Healthy", desc: "1.2M events processed this quarter", time: "Ongoing" },
          { icon: "refresh-cw", title: "Last Sync", desc: "Full sync completed successfully", time: "2 min ago" },
        ],
        ai: `All integration checks green. Recommend enabling the new "Thread Summarizer" sub-agent to turn daily Slack threads into Cortex insights automatically.`,
        cta: "Configure",
      }),

      pipeline: () => ({
        tag: "DATA PIPELINE",
        icon: "git-branch",
        title: d.name || "Sales → BigQuery ETL",
        subtitle: `${d.source || "Salesforce"} → ${d.dest || "BigQuery"} · ${d.status || "Running"}`,
        stats: [
          { label: "STATUS", value: d.status || "Running" },
          { label: "RECORDS/RUN", value: d.records || "84K" },
          { label: "DURATION", value: d.duration || "3m 42s" },
          { label: "SUCCESS", value: d.success || "99.6%" },
        ],
        details: [
          { label: "Schedule", value: d.schedule || "Every 15 min" },
          { label: "Last Run", value: "8 min ago · Success" },
          { label: "Owner", value: "Data Platform" },
          { label: "SLA", value: "< 5 min / run" },
        ],
        timeline: [
          { icon: "database", title: "Extract", desc: "Pulled 84K records from Salesforce API", time: "0s – 45s" },
          { icon: "filter", title: "Transform", desc: "Cleaned, deduped, enriched with lookup data", time: "45s – 2m 10s" },
          { icon: "upload", title: "Load", desc: "Upserted into BigQuery sales_events table", time: "2m 10s – 3m 42s" },
          { icon: "check-circle", title: "Validation", desc: "Row counts + checksums match source", time: "3m 42s – 3m 50s" },
        ],
        ai: `Pipeline is healthy. Detected opportunity: run is 22% faster if we partition on event_date — recommend testing in staging.`,
        cta: "Trigger Run",
      }),

      agent: () => ({
        tag: "AI AGENT",
        icon: "bot",
        title: d.name || "Lead Qualifier Agent",
        subtitle: `${d.type || "Sales"} · ${d.status || "Active"}`,
        stats: [
          { label: "RUNS TODAY", value: d.runs || "247" },
          { label: "SUCCESS RATE", value: d.success || "94%" },
          { label: "AVG LATENCY", value: d.latency || "1.8s" },
          { label: "SAVINGS", value: d.savings || "$12K/mo" },
        ],
        details: [
          { label: "Model", value: d.model || "Claude Opus 4.6" },
          { label: "Tools", value: "CRM · Email · Calendar" },
          { label: "Triggered By", value: "New Lead event" },
          { label: "Owner", value: "Rania Jamil" },
        ],
        timeline: [
          { icon: "zap", title: "Triggered", desc: "New lead captured from website form", time: "2s ago" },
          { icon: "search", title: "Enrichment", desc: "Pulled company data from Clearbit + LinkedIn", time: "1.5s" },
          { icon: "brain-circuit", title: "Scoring", desc: "Qualified as HOT (87/100) based on ICP match", time: "0.8s" },
          { icon: "send", title: "Action Taken", desc: "Assigned to sales rep + sent intro email", time: "0.3s" },
        ],
        ai: `Agent is performing 24% above baseline. Recommend expanding scope to handle follow-up sequences — predicted additional $8K/mo savings.`,
        cta: "View Logs",
      }),

      insight: () => ({
        tag: "AI INSIGHT",
        icon: "sparkles",
        title: d.title || "Revenue Anomaly Detected",
        subtitle: `${d.source || "Cortex Brain"} · ${d.confidence || "92% confidence"}`,
        stats: [
          { label: "IMPACT", value: d.impact || "High" },
          { label: "CONFIDENCE", value: d.confidence || "92%" },
          { label: "MODEL", value: d.model || "Forecast-v4" },
          { label: "DETECTED", value: d.when || "3h ago" },
        ],
        details: [
          { label: "Category", value: d.category || "Revenue" },
          { label: "Affected Modules", value: "Finance, CRM" },
          { label: "Data Sources", value: "Sales, Payments, Leads" },
          { label: "Recommended Action", value: "Review & Act" },
        ],
        timeline: [
          { icon: "database", title: "Data Ingested", desc: "Pulled last 90 days across 6 data sources", time: "3h ago" },
          { icon: "brain-circuit", title: "Pattern Analysis", desc: "ML model detected 18% deviation from forecast", time: "3h ago" },
          { icon: "alert-triangle", title: "Anomaly Flagged", desc: "Confidence threshold (85%) exceeded", time: "3h ago" },
          { icon: "bell", title: "You Notified", desc: "Insight pushed to your cockpit", time: "3h ago" },
        ],
        ai: `Root cause analysis: 3 enterprise deals slipped from Q1 into Q2. Recommend reviewing deal-stage hygiene in CRM and accelerating 2 at-risk proposals.`,
        cta: "Take Action",
      }),

      task: () => ({
        tag: "TASK",
        icon: "check-square",
        title: d.title || "Implement API Gateway v3",
        subtitle: `${d.project || "Project Alpha"} · ${d.status || "In Progress"}`,
        stats: [
          { label: "STATUS", value: d.status || "In Progress" },
          { label: "PRIORITY", value: d.priority || "High" },
          { label: "DUE", value: d.due || "Apr 25" },
          { label: "PROGRESS", value: d.progress || "60%" },
        ],
        details: [
          { label: "Assigned To", value: d.assignee || "Priya Sharma" },
          { label: "Estimate", value: d.estimate || "8 points" },
          { label: "Sprint", value: "Sprint 14" },
          { label: "Epic", value: "Platform Rebuild" },
        ],
        timeline: [
          { icon: "plus", title: "Task Created", desc: "Added to Sprint 14 backlog", time: "Apr 01" },
          { icon: "user-check", title: "Assigned", desc: "Picked up by Priya Sharma", time: "Apr 02" },
          { icon: "git-branch", title: "Branch Created", desc: "feat/api-gateway-v3 pushed", time: "Apr 05" },
          { icon: "code", title: "In Review", desc: "PR #482 open, 2 reviewers", time: "Apr 14" },
        ],
        ai: `Task is on track. Cortex detected PR #482 is ready for merge — review comments resolved. Recommend shipping today to unblock Sprint 15.`,
        cta: "Open Task",
      }),
    };
    return (builders[type] || builders.insight)();
  },

  // ---------- KEYBOARD ----------
  bindKeyboard() {
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        this.openCommandPalette();
      }
      if (e.key === "Escape") {
        this.closeCommandPalette();
        document.getElementById("chat-panel")?.classList.remove("open");
      }
      if (document.getElementById("cmdk")?.classList.contains("open")) {
        if (e.key === "ArrowDown") { e.preventDefault(); this._cmdkIdx = Math.min(this._cmdkIdx + 1, this._cmdkFiltered.length - 1); this.renderCmdkList(); }
        if (e.key === "ArrowUp") { e.preventDefault(); this._cmdkIdx = Math.max(this._cmdkIdx - 1, 0); this.renderCmdkList(); }
        if (e.key === "Enter") { e.preventDefault(); this.runCmdk(this._cmdkIdx); }
      }
    });
  },

  bindGlobal() {
    // Animate counters
    document.querySelectorAll("[data-count]").forEach(el => {
      const target = parseFloat(el.dataset.count);
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";
      const decimals = parseInt(el.dataset.decimals || "0");
      let cur = 0;
      const step = target / 60;
      const tick = () => {
        cur += step;
        if (cur >= target) { cur = target; el.textContent = prefix + cur.toFixed(decimals) + suffix; return; }
        el.textContent = prefix + cur.toFixed(decimals) + suffix;
        requestAnimationFrame(tick);
      };
      tick();
    });
  },
};

// Helpers used across pages
function iconBadge(color) {
  return {
    blue: "bg-blue-100 text-blue-600",
    indigo: "bg-indigo-100 text-indigo-600",
    violet: "bg-violet-100 text-violet-600",
    sky: "bg-sky-100 text-sky-600",
    cyan: "bg-cyan-100 text-cyan-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
    yellow: "bg-yellow-100 text-yellow-700",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    slate: "bg-slate-100 text-slate-600",
  }[color] || "bg-blue-100 text-blue-600";
}

window.CORTEX = CORTEX;
