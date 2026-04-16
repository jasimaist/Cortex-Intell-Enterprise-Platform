// ===========================================
// CORTEX INTELL — MOCK DATA
// ===========================================

const CORTEX_DATA = {
  user: {
    name: "Rania Jamil",
    role: "CEO, AIST Technologies",
    initials: "RJ",
    email: "rania@aist.tech",
  },

  kpis: [
    { label: "Total Revenue", value: "$3.92M", delta: "+12.5%", trend: "up", sub: "vs. $3.48M last month", icon: "dollar-sign", color: "blue" },
    { label: "Active Leads", value: "247", delta: "+8.3%", trend: "up", sub: "32 need attention", icon: "users", color: "indigo" },
    { label: "Cash Position", value: "$2.47M", delta: "+5.6%", trend: "up", sub: "Forecast Growth", icon: "trending-up", color: "sky" },
    { label: "Active Projects", value: "12", delta: "2 at risk", trend: "warn", sub: "", icon: "folder", color: "violet" },
  ],

  modules: [
    { id: "crm", name: "CRM 360", icon: "users", desc: "Manage Leads. Close Deals.", metric: "$1.18M Pipeline", sub: "18.7% Conversion Rate", status: "Live", page: "crm.html", color: "blue",
      subModules: ["Accounts", "Contacts", "Leads", "Opportunities / Deals", "Cases", "Activities & Tasks", "Documents & Communications", "Segments & Lists", "Account 360 View"] },
    { id: "hrm", name: "HRM", icon: "user-cog", desc: "Empower People. Drive Performance.", metric: "312 Employees", sub: "92.0% Attendance", status: "Live", page: "hrm.html", color: "indigo",
      subModules: ["Employee Management", "Payroll", "Performance Management", "Attendance & Leave", "Recruitment / Hiring", "Compliance & Policies", "Training & Development"] },
    { id: "finance", name: "Finance OS", icon: "dollar-sign", desc: "Manage Finance. Forecast. Intelligence.", metric: "$2.47M Cash Position", sub: "5.6% Forecast Growth", status: "Live", page: "finance.html", color: "violet",
      subModules: ["General Ledger", "Accounts Payable (AP)", "Accounts Receivable (AR)", "Invoicing & Billing", "Cash Flow Management", "Forecasting & Budgeting", "Financial Risk & Controls", "Reconciliation"] },
    { id: "growth", name: "Growth Engine", icon: "trending-up", desc: "Campaigns. Content. Conversion.", metric: "24 Campaigns Active", sub: "38.2K Website Visitors", status: "Live", page: "growth.html", color: "cyan",
      subModules: ["Social Engine", "SEO & Authority Engine", "Demand Engine (Ads & Funnels)", "Qualification Engine", "Intelligence Hub", "Orchestration Layer"] },
    { id: "brain", name: "Brain", icon: "brain", desc: "AI. Insights. Predict. Optimize.", metric: "87 Insights Generated", sub: "6 Recommendations", status: "Learning", page: "brain.html", color: "indigo",
      subModules: ["Scoring Engine", "Prediction Engine", "Recommendation Engine", "Risk Engine", "AI Copilot / Insights", "Learning & Feedback Loop"] },
    { id: "projects", name: "Projects", icon: "folder-kanban", desc: "Deliver On Time. Reduce Risk.", metric: "68% Avg. Completion", sub: "2 Projects at Risk", status: "On Track", page: "projects.html", color: "violet",
      subModules: ["Project Management", "Task & Work Breakdown", "Scheduling & Timelines", "Resource Management", "Risk & Issue Management", "RFIs / Change Requests", "Milestones & Delivery Tracking"] },
    { id: "agents", name: "Agents", icon: "bot", desc: "Automate. Orchestrate. Execute.", metric: "12 Agents Active", sub: "1,247 Tasks Automated", status: "Active", page: "agents.html", color: "sky",
      subModules: ["Workflow Composer", "Automation Rules", "Event Triggers", "Approval Flows", "Agent Execution Engine", "Run Logs & Monitoring"] },
    { id: "analytics", name: "Analytics", icon: "bar-chart-3", desc: "Dashboards. KPIs. Command Centre.", metric: "32 Dashboards Live", sub: "Real-Time Monitoring", status: "Live", page: "accounts.html", color: "blue",
      subModules: ["Dashboards", "Reports", "KPI Tracking", "Command Centre", "Embedded Analytics (Account/Case level)", "Alerts & Insights"] },
    { id: "data-platform", name: "Data Platform", icon: "database", desc: "Store. Integrate. Govern. Scale.", metric: "48 Pipelines Running", sub: "99.2% Data Quality", status: "Monitoring", page: "integration.html", color: "sky",
      subModules: ["Data Storage (Lakehouse)", "Data Pipelines", "Data Integration (APIs, Connectors)", "Data Governance", "Data Modelling", "Master Data Management (MDM)", "Data Quality & Validation"] },
    { id: "chatbot", name: "AI Chatbot", icon: "message-circle", desc: "Converse. Query. Execute. Assist.", metric: "2.4K Conversations", sub: "94% Resolution Rate", status: "Active", page: "chatbot.html", color: "green",
      subModules: ["Conversational Interface", "Query & Response Engine", "Task Execution (via Agents)", "Context Awareness (user, module, data)", "Knowledge Retrieval", "Multi-channel Integration (web, app, etc.)"] },
  ],

  activity: [
    { icon: "dollar-sign", title: "Finance Agent detected unusual expense", desc: "Marketing spend 34% higher than usual", time: "2 min ago", color: "blue" },
    { icon: "user-plus", title: "New lead qualified — TechCorp NSW", desc: "Score: 92/100 — Ready for proposal", time: "15 min ago", color: "indigo" },
    { icon: "user-check", title: "Sarah Johnson completed onboarding", desc: "HRM — Training progress 25% — Your Day 1", time: "1 hour ago", color: "violet" },
    { icon: "share-2", title: "Data pipeline Azure Synapse → Finance updated", desc: "Phase 2 complete — 68% overall progress", time: "3 hours ago", color: "sky" },
    { icon: "megaphone", title: "Growth Engine campaign launched", desc: "Q2 Product Campaign — 38.2K visitors — 3 hours ago", time: "3 hours ago", color: "cyan" },
  ],

  recommendations: [
    { priority: "HIGH IMPACT", title: "Upsell Opportunity Identified", desc: "TechCorp NSW shows strong intent. Estimated additional revenue: $340K", cta: "Create Proposal", color: "yellow" },
    { priority: "ACTION NEEDED", title: "Project Alpha at Risk", desc: "2 dependencies delayed. Take action to enable timely impact.", cta: "View Project", color: "red" },
    { priority: "OPTIMIZATION", title: "Payroll Optimization", desc: "$16,760 can be saved via configuration. Review suggestions.", cta: "Run Analysis", color: "green" },
  ],

  // CRM
  crmPipeline: {
    lead: [
      { name: "TechCorp NSW", value: "$340K", contact: "John Miller", score: 92, avatar: "TN", hot: true },
      { name: "Blue Ocean Ltd", value: "$120K", contact: "Rachel Kim", score: 68, avatar: "BO" },
      { name: "Apex Industries", value: "$85K", contact: "David Lee", score: 74, avatar: "AI" },
    ],
    qualified: [
      { name: "Horizon Group", value: "$210K", contact: "Maria Santos", score: 85, avatar: "HG", hot: true },
      { name: "DataFlow Inc", value: "$95K", contact: "Chen Wei", score: 71, avatar: "DI" },
    ],
    proposal: [
      { name: "Summit Ventures", value: "$450K", contact: "Emma Brown", score: 88, avatar: "SV", hot: true },
      { name: "Nexus Labs", value: "$175K", contact: "Omar Khan", score: 79, avatar: "NL" },
    ],
    won: [
      { name: "PrimeEdge Solutions", value: "$520K", contact: "Lisa Park", score: 95, avatar: "PE" },
      { name: "GlobalTech", value: "$280K", contact: "James Wu", score: 90, avatar: "GT" },
    ],
  },

  contacts: [
    { name: "John Miller", company: "TechCorp NSW", role: "CTO", email: "john@techcorp.com", status: "Hot Lead", score: 92, avatar: "JM" },
    { name: "Rachel Kim", company: "Blue Ocean Ltd", role: "VP Sales", email: "rachel@blueocean.com", status: "Warm", score: 68, avatar: "RK" },
    { name: "Emma Brown", company: "Summit Ventures", role: "CEO", email: "emma@summit.vc", status: "Hot Lead", score: 88, avatar: "EB" },
    { name: "Maria Santos", company: "Horizon Group", role: "Director", email: "maria@horizon.co", status: "Qualified", score: 85, avatar: "MS" },
    { name: "David Lee", company: "Apex Industries", role: "Procurement", email: "david@apex.com", status: "Warm", score: 74, avatar: "DL" },
    { name: "Lisa Park", company: "PrimeEdge Solutions", role: "CFO", email: "lisa@primeedge.com", status: "Customer", score: 95, avatar: "LP" },
  ],

  // HRM
  employees: [
    { name: "Sarah Johnson", role: "Senior Product Manager", dept: "Product", status: "Active", avatar: "SJ", mood: 92, since: "2022" },
    { name: "Michael Chen", role: "Lead Engineer", dept: "Engineering", status: "Active", avatar: "MC", mood: 88, since: "2021" },
    { name: "Priya Patel", role: "UX Designer", dept: "Design", status: "On Leave", avatar: "PP", mood: 78, since: "2023" },
    { name: "James Wilson", role: "DevOps Engineer", dept: "Engineering", status: "Active", avatar: "JW", mood: 85, since: "2020" },
    { name: "Anna Kowalski", role: "Marketing Lead", dept: "Marketing", status: "Active", avatar: "AK", mood: 94, since: "2022" },
    { name: "Rohan Sharma", role: "Data Scientist", dept: "Data", status: "Active", avatar: "RS", mood: 81, since: "2023" },
    { name: "Elena Rodriguez", role: "HR Manager", dept: "HR", status: "Active", avatar: "ER", mood: 90, since: "2019" },
    { name: "Tom Baker", role: "Sales Executive", dept: "Sales", status: "Remote", avatar: "TB", mood: 76, since: "2023" },
  ],

  openRoles: [
    { title: "Senior Backend Engineer", dept: "Engineering", applicants: 48, stage: "Interview", urgency: "High" },
    { title: "Product Designer", dept: "Design", applicants: 32, stage: "Screening", urgency: "Medium" },
    { title: "ML Engineer", dept: "Data", applicants: 67, stage: "Offer", urgency: "High" },
    { title: "Customer Success Manager", dept: "Operations", applicants: 24, stage: "Interview", urgency: "Low" },
  ],

  // FINANCE
  invoices: [
    { id: "INV-2847", client: "TechCorp NSW", amount: "$48,200", status: "Paid", date: "2026-04-12" },
    { id: "INV-2846", client: "Summit Ventures", amount: "$92,500", status: "Pending", date: "2026-04-10" },
    { id: "INV-2845", client: "Horizon Group", amount: "$31,800", status: "Overdue", date: "2026-03-28" },
    { id: "INV-2844", client: "PrimeEdge", amount: "$125,000", status: "Paid", date: "2026-04-08" },
    { id: "INV-2843", client: "GlobalTech", amount: "$67,400", status: "Paid", date: "2026-04-05" },
    { id: "INV-2842", client: "Nexus Labs", amount: "$19,900", status: "Pending", date: "2026-04-02" },
  ],

  budgets: [
    { dept: "Engineering", spent: 680, total: 900, pct: 75 },
    { dept: "Marketing", spent: 420, total: 500, pct: 84 },
    { dept: "Sales", spent: 310, total: 450, pct: 69 },
    { dept: "Operations", spent: 180, total: 300, pct: 60 },
    { dept: "HR", spent: 95, total: 150, pct: 63 },
  ],

  // ACCOUNTS
  journalEntries: [
    { id: "JE-0542", date: "2026-04-14", desc: "Payroll — April batch", debit: "$245,000", credit: "$245,000", status: "Posted" },
    { id: "JE-0541", date: "2026-04-13", desc: "AWS cloud invoice", debit: "$18,400", credit: "$18,400", status: "Posted" },
    { id: "JE-0540", date: "2026-04-12", desc: "Client payment — TechCorp", debit: "$48,200", credit: "$48,200", status: "Posted" },
    { id: "JE-0539", date: "2026-04-11", desc: "Office rent", debit: "$32,000", credit: "$32,000", status: "Posted" },
    { id: "JE-0538", date: "2026-04-10", desc: "Software subscriptions", debit: "$9,800", credit: "$9,800", status: "Pending" },
  ],

  // ALL SERVICES — complete Cortex catalog (Azure-portal style)
  allServices: [
    // ---- GROWTH ENGINE (FLAGSHIP) ----
    { cat: "Growth Engine", name: "Social Engine", desc: "Automates daily brand presence across platforms", icon: "share-2", color: "blue", page: "growth.html", flag: "Flagship" },
    { cat: "Growth Engine", name: "SEO & Authority Engine", desc: "Drives inbound traffic & thought leadership", icon: "search", color: "indigo", page: "growth.html", flag: "Flagship" },
    { cat: "Growth Engine", name: "Demand Engine", desc: "Paid ads, funnels & lead generation", icon: "rocket", color: "violet", page: "growth.html", flag: "Flagship" },
    { cat: "Growth Engine", name: "Qualification Engine", desc: "Lead filtering + AI scoring", icon: "filter", color: "sky", page: "growth.html", flag: "Flagship" },
    { cat: "Growth Engine", name: "Intelligence Hub", desc: "Analytics + feedback loop", icon: "brain-circuit", color: "cyan", page: "growth.html", flag: "Flagship" },
    { cat: "Growth Engine", name: "Orchestration Layer", desc: "n8n workflows & automation logic", icon: "workflow", color: "purple", page: "growth.html", flag: "Flagship" },

    // ---- FINANCE OS ----
    { cat: "Finance OS", name: "Accounting Core", desc: "GL · AR · AP · Reconciliation", icon: "book-open", color: "blue", page: "finance.html" },
    { cat: "Finance OS", name: "Financial Intelligence", desc: "Forecasting · Budgets · KPIs", icon: "trending-up", color: "indigo", page: "finance.html" },
    { cat: "Finance OS", name: "AI Agents & Automation", desc: "Anomaly detection · OCR · Auto-match", icon: "bot", color: "violet", page: "finance.html" },
    { cat: "Finance OS", name: "Compliance & Governance", desc: "Audit trails · Tax · Policy", icon: "shield-check", color: "sky", page: "finance.html" },
    { cat: "Finance OS", name: "Invoices", desc: "Create, send & track invoices", icon: "file-text", color: "green", page: "finance.html" },
    { cat: "Finance OS", name: "Cash Flow Forecasting", desc: "18-month forward cash projections", icon: "trending-up", color: "cyan", page: "finance.html" },

    // ---- CRM & SALES ----
    { cat: "CRM & Sales", name: "CRM 360", desc: "Full contact & account view", icon: "users", color: "blue", page: "crm.html" },
    { cat: "CRM & Sales", name: "Pipeline Kanban", desc: "Visual sales pipeline management", icon: "layout-kanban", color: "indigo", page: "crm.html" },
    { cat: "CRM & Sales", name: "Lead Scoring", desc: "AI-powered lead qualification", icon: "target", color: "violet", page: "crm.html" },
    { cat: "CRM & Sales", name: "Deal Forecast", desc: "Revenue forecasting by stage", icon: "line-chart", color: "sky", page: "crm.html" },
    { cat: "CRM & Sales", name: "Contact Database", desc: "Unified customer records", icon: "database", color: "cyan", page: "crm.html" },
    { cat: "CRM & Sales", name: "Email Outreach", desc: "Personalized email sequences", icon: "mail", color: "purple", page: "crm.html" },

    // ---- HRM & PEOPLE ----
    { cat: "HRM & People", name: "Employee Directory", desc: "Full employee profiles & org chart", icon: "users", color: "blue", page: "hrm.html" },
    { cat: "HRM & People", name: "Attendance Heatmap", desc: "90-day attendance tracking", icon: "calendar-check", color: "indigo", page: "hrm.html" },
    { cat: "HRM & People", name: "Recruitment Pipeline", desc: "Applicant tracking & hiring", icon: "briefcase", color: "violet", page: "hrm.html" },
    { cat: "HRM & People", name: "Payroll", desc: "Run payroll in one click", icon: "wallet", color: "green", page: "hrm.html" },
    { cat: "HRM & People", name: "Performance Reviews", desc: "360° feedback & goal tracking", icon: "award", color: "orange", page: "hrm.html" },
    { cat: "HRM & People", name: "Learning & Development", desc: "Courses, certifications, growth", icon: "graduation-cap", color: "cyan", page: "hrm.html" },
    { cat: "HRM & People", name: "Wellness Score", desc: "Employee mood & burnout tracking", icon: "heart", color: "red", page: "hrm.html" },

    // ---- ACCOUNTS ----
    { cat: "Accounts", name: "General Ledger", desc: "Full chart of accounts", icon: "book-open", color: "blue", page: "finance.html" },
    { cat: "Accounts", name: "Journal Entries", desc: "Debit/credit entry management", icon: "file-plus", color: "indigo", page: "finance.html" },
    { cat: "Accounts", name: "Bank Reconciliation", desc: "Auto-match transactions", icon: "git-compare", color: "violet", page: "finance.html" },
    { cat: "Accounts", name: "Receipt Scanner", desc: "OCR for expense receipts", icon: "scan-line", color: "sky", page: "finance.html" },
    { cat: "Accounts", name: "Tax Compliance", desc: "GST/VAT/Sales tax", icon: "percent", color: "green", page: "finance.html" },

    // ---- BRAIN & INTELLIGENCE ----
    { cat: "Brain & AI", name: "Cortex Brain", desc: "Central AI intelligence layer", icon: "brain", color: "violet", page: "brain.html", flag: "Core" },
    { cat: "Brain & AI", name: "Ask Anything", desc: "Natural language queries", icon: "sparkles", color: "blue", page: "brain.html" },
    { cat: "Brain & AI", name: "Predictive Analytics", desc: "Forecasting & anomaly detection", icon: "chart-scatter", color: "indigo", page: "brain.html" },
    { cat: "Brain & AI", name: "Knowledge Base", desc: "Company docs + semantic search", icon: "library", color: "cyan", page: "brain.html" },
    { cat: "Brain & AI", name: "Model Registry", desc: "Claude · GPT · Gemini models", icon: "cpu", color: "purple", page: "brain.html" },
    { cat: "Brain & AI", name: "Prompt Library", desc: "Reusable prompt templates", icon: "book-open", color: "orange", page: "brain.html" },

    // ---- COMMUNICATION ----
    { cat: "Communication", name: "WhatsApp Business", desc: "Two-way WhatsApp messaging + templates", icon: "message-square", color: "green", page: "communication.html", flag: "Flagship" },
    { cat: "Communication", name: "Email Hub", desc: "Unified inbox across accounts", icon: "mail", color: "blue", page: "communication.html" },
    { cat: "Communication", name: "SMS Gateway", desc: "Transactional & marketing SMS", icon: "smartphone", color: "violet", page: "communication.html" },
    { cat: "Communication", name: "Voice Calls", desc: "VOIP with AI transcription", icon: "phone", color: "sky", page: "communication.html" },
    { cat: "Communication", name: "Team Chat", desc: "Internal team channels", icon: "users", color: "indigo", page: "communication.html" },
    { cat: "Communication", name: "AI Chatbot", desc: "Claude-powered customer assistant", icon: "bot", color: "purple", page: "chatbot.html" },

    // ---- DATABASE ----
    { cat: "Database", name: "Cortex Database", desc: "Unified transactional database", icon: "database", color: "blue", page: "database.html", flag: "Core" },
    { cat: "Database", name: "Data Warehouse", desc: "Analytical store for BI", icon: "server", color: "indigo", page: "database.html" },
    { cat: "Database", name: "Vector Store", desc: "Embeddings for AI search", icon: "circle-dot", color: "violet", page: "database.html" },
    { cat: "Database", name: "Backup & Restore", desc: "Point-in-time recovery", icon: "hard-drive", color: "sky", page: "database.html" },
    { cat: "Database", name: "Query Console", desc: "SQL playground", icon: "terminal", color: "slate", page: "database.html" },

    // ---- INTEGRATION & DATA ----
    { cat: "Integration & Data", name: "Connected Apps", desc: "12+ apps connected", icon: "plug", color: "blue", page: "integration.html" },
    { cat: "Integration & Data", name: "Data Pipelines", desc: "ETL + real-time sync", icon: "git-branch", color: "indigo", page: "integration.html" },
    { cat: "Integration & Data", name: "API Keys", desc: "Manage API access tokens", icon: "key", color: "violet", page: "integration.html" },
    { cat: "Integration & Data", name: "Webhooks", desc: "Real-time event delivery", icon: "webhook", color: "sky", page: "integration.html" },
    { cat: "Integration & Data", name: "Pipeline Builder", desc: "Visual workflow designer", icon: "workflow", color: "cyan", page: "integration.html" },

    // ---- PROJECTS ----
    { cat: "Projects", name: "Project Portfolio", desc: "All projects at a glance", icon: "folder-kanban", color: "blue", page: "projects.html" },
    { cat: "Projects", name: "Sprint Board", desc: "Agile kanban for sprints", icon: "layout-dashboard", color: "indigo", page: "projects.html" },
    { cat: "Projects", name: "Gantt Timeline", desc: "Visual project schedules", icon: "calendar", color: "violet", page: "projects.html" },
    { cat: "Projects", name: "Burndown Charts", desc: "Sprint velocity tracking", icon: "line-chart", color: "sky", page: "projects.html" },
    { cat: "Projects", name: "Team Workload", desc: "Capacity & utilization", icon: "users", color: "cyan", page: "projects.html" },

    // ---- AI AGENTS ----
    { cat: "Agents & Automation", name: "Agent Marketplace", desc: "Pre-built AI agents", icon: "store", color: "blue", page: "agents.html" },
    { cat: "Agents & Automation", name: "Agent Builder", desc: "No-code agent designer", icon: "wand-2", color: "indigo", page: "agents.html" },
    { cat: "Agents & Automation", name: "Live Activity Feed", desc: "Real-time agent actions", icon: "activity", color: "violet", page: "agents.html" },
    { cat: "Agents & Automation", name: "Run History", desc: "Logs & replay agent runs", icon: "history", color: "sky", page: "agents.html" },
    { cat: "Agents & Automation", name: "Model Performance", desc: "Accuracy & latency metrics", icon: "gauge", color: "cyan", page: "agents.html" },

    // ---- SECURITY ----
    { cat: "Security & Compliance", name: "Audit Logs", desc: "Immutable activity trail", icon: "file-lock-2", color: "blue", page: "finance.html" },
    { cat: "Security & Compliance", name: "Access Control", desc: "Role-based permissions", icon: "key-round", color: "indigo", page: "finance.html" },
    { cat: "Security & Compliance", name: "Data Residency", desc: "Region pinning for compliance", icon: "globe-2", color: "violet", page: "finance.html" },
    { cat: "Security & Compliance", name: "SOC 2 Reports", desc: "Compliance certifications", icon: "shield-check", color: "green", page: "finance.html" },
  ],

  // GROWTH — flagship sub-engines
  growthServices: [
    { id: "social", name: "Cortex Intell Social Engine", sub: "Social Media Automation", desc: "Automates daily brand presence across every major platform — posts, stories, replies, DMs.", icon: "share-2", color: "blue", tag: "Automation" },
    { id: "seo", name: "Cortex Intell SEO & Authority Engine", sub: "Blog Automation · SEO + AEO", desc: "Drives inbound traffic, rankings, and thought leadership through AI-generated, ranked content.", icon: "search", color: "indigo", tag: "Authority" },
    { id: "demand", name: "Cortex Intell Demand Engine", sub: "Ads + Funnels", desc: "Generates paid traffic and qualified leads across Google, Meta, LinkedIn, TikTok & Email.", icon: "rocket", color: "violet", tag: "Paid Growth" },
    { id: "qualification", name: "Cortex Intell Qualification Engine", sub: "Lead Filtering + AI Scoring", desc: "Filters, scores, and routes only high-value leads to the right rep at the right moment.", icon: "filter", color: "sky", tag: "Lead Ops" },
    { id: "intelligence", name: "Cortex Intell Intelligence Hub", sub: "Analytics + Feedback Loop", desc: "Tracks, analyzes, and optimizes performance automatically — not dashboards nobody opens.", icon: "brain-circuit", color: "cyan", tag: "Insights" },
    { id: "orchestration", name: "Cortex Intell Orchestration Layer", sub: "Hidden · Real Differentiator", desc: "Connects all engines, runs n8n workflows, and controls data flow between every system.", icon: "workflow", color: "purple", tag: "Core" },
  ],

  // FINANCE — operating system sub-domains
  financeServices: [
    { id: "accounting", name: "Accounting Core", sub: "GL · AR · AP · Reconciliation", desc: "One connected ledger — general ledger, receivables, payables & bank reconciliation.", icon: "book-open", color: "blue", tag: "Ledger" },
    { id: "financial-intel", name: "Financial Intelligence", sub: "Forecasting · Budgets · KPIs", desc: "Cash-flow forecasting, budget variance analysis, scenario planning and executive KPIs.", icon: "trending-up", color: "indigo", tag: "Insights" },
    { id: "ai-automation", name: "AI Agents & Automation", sub: "Anomaly · OCR · Auto-match", desc: "Finance agents auto-reconcile, flag anomalies, process invoices and match journal entries.", icon: "bot", color: "violet", tag: "Automation" },
    { id: "compliance", name: "Compliance & Governance", sub: "Audit Trails · Tax · Policy", desc: "Full audit logs, tax compliance (GST/VAT), role-based access and policy enforcement.", icon: "shield-check", color: "sky", tag: "Governance" },
  ],

  campaigns: [
    { name: "Q2 Product Launch", channel: "Multi-channel", status: "Active", spend: "$48K", roi: "3.2x", reach: "128K" },
    { name: "LinkedIn Awareness", channel: "LinkedIn", status: "Active", spend: "$12K", roi: "2.1x", reach: "56K" },
    { name: "Email Nurture Series", channel: "Email", status: "Active", spend: "$3K", roi: "4.8x", reach: "24K" },
    { name: "Retargeting Holiday", channel: "Meta", status: "Paused", spend: "$8K", roi: "1.9x", reach: "42K" },
    { name: "Webinar — AI Trends", channel: "Webinar", status: "Completed", spend: "$6K", roi: "5.4x", reach: "8K" },
  ],

  // INTEGRATIONS
  apps: [
    { name: "Slack", status: "Connected", icon: "message-square", color: "purple" },
    { name: "Salesforce", status: "Connected", icon: "cloud", color: "blue" },
    { name: "Gmail", status: "Connected", icon: "mail", color: "red" },
    { name: "Stripe", status: "Connected", icon: "credit-card", color: "indigo" },
    { name: "HubSpot", status: "Connected", icon: "zap", color: "orange" },
    { name: "Zoom", status: "Connected", icon: "video", color: "sky" },
    { name: "Notion", status: "Connected", icon: "file-text", color: "slate" },
    { name: "GitHub", status: "Connected", icon: "github", color: "slate" },
    { name: "Jira", status: "Syncing", icon: "list-checks", color: "blue" },
    { name: "Intercom", status: "Connected", icon: "message-circle", color: "blue" },
    { name: "Linear", status: "Error", icon: "triangle", color: "violet" },
    { name: "QuickBooks", status: "Connected", icon: "calculator", color: "green" },
  ],

  pipelines: [
    { name: "Azure Synapse → Finance OS", source: "Azure", dest: "Finance", records: "1.2M", health: "Healthy", lastSync: "2 min ago" },
    { name: "Salesforce → CRM 360", source: "Salesforce", dest: "CRM", records: "48K", health: "Healthy", lastSync: "5 min ago" },
    { name: "Stripe → Accounts", source: "Stripe", dest: "Accounts", records: "3.4K", health: "Healthy", lastSync: "1 min ago" },
    { name: "GitHub → Projects", source: "GitHub", dest: "Projects", records: "820", health: "Syncing", lastSync: "Now" },
    { name: "Gmail → CRM", source: "Gmail", dest: "CRM", records: "12K", health: "Warning", lastSync: "18 min ago" },
  ],

  // BRAIN
  insights: [
    { title: "Customer churn risk up 12%", desc: "5 enterprise accounts showing disengagement signals", tag: "Prediction", confidence: 91 },
    { title: "Optimal hiring window: May 15-30", desc: "Based on candidate availability and budget cycles", tag: "Recommendation", confidence: 87 },
    { title: "Marketing ROI peak at $18K/week spend", desc: "Diminishing returns beyond this threshold", tag: "Analysis", confidence: 94 },
    { title: "Project Alpha completion risk: 34%", desc: "2 blockers detected in dependency chain", tag: "Risk", confidence: 82 },
  ],

  // PROJECTS
  projects: [
    { name: "Project Alpha", client: "TechCorp NSW", progress: 68, status: "At Risk", team: ["SJ", "MC", "PP"], deadline: "May 20", priority: "High" },
    { name: "CRM Migration", client: "Internal", progress: 92, status: "On Track", team: ["JW", "AK"], deadline: "Apr 30", priority: "High" },
    { name: "Mobile App v2", client: "Summit Ventures", progress: 45, status: "On Track", team: ["MC", "PP", "RS"], deadline: "Jun 15", priority: "Medium" },
    { name: "Data Lake Refresh", client: "Internal", progress: 78, status: "On Track", team: ["RS", "JW"], deadline: "May 10", priority: "Medium" },
    { name: "Brand Refresh 2026", client: "Internal", progress: 30, status: "On Track", team: ["PP", "AK"], deadline: "Jul 01", priority: "Low" },
    { name: "API Gateway v3", client: "Internal", progress: 55, status: "At Risk", team: ["MC", "JW"], deadline: "May 28", priority: "High" },
  ],

  tasks: {
    todo: [
      { title: "Draft Q2 board deck", assignee: "AS", due: "Apr 18", tag: "Strategy" },
      { title: "Review Stripe integration", assignee: "MC", due: "Apr 17", tag: "Engineering" },
      { title: "Design onboarding flow", assignee: "PP", due: "Apr 20", tag: "Design" },
    ],
    progress: [
      { title: "Salesforce data migration", assignee: "RS", due: "Apr 22", tag: "Data" },
      { title: "Payroll March reconciliation", assignee: "ER", due: "Apr 16", tag: "Finance" },
    ],
    review: [
      { title: "CRM API docs update", assignee: "MC", due: "Apr 16", tag: "Docs" },
      { title: "Q1 Performance reviews", assignee: "ER", due: "Apr 18", tag: "HR" },
    ],
    done: [
      { title: "Launch campaign Q2", assignee: "AK", due: "Apr 10", tag: "Marketing" },
      { title: "Infrastructure upgrade", assignee: "JW", due: "Apr 12", tag: "DevOps" },
    ],
  },

  // AGENTS
  agents: [
    { name: "Finance Guardian", desc: "Monitors transactions for anomalies", runs: "2,481", success: "99.2%", status: "Active", icon: "shield" },
    { name: "Lead Hunter", desc: "Finds & qualifies new leads daily", runs: "1,247", success: "94.8%", status: "Active", icon: "target" },
    { name: "Support Triage", desc: "Routes tickets to right team", runs: "3,892", success: "97.5%", status: "Active", icon: "headphones" },
    { name: "Content Writer", desc: "Drafts blog posts & social media", runs: "412", success: "91.0%", status: "Active", icon: "edit-3" },
    { name: "Meeting Scribe", desc: "Transcribes & summarizes meetings", runs: "687", success: "98.3%", status: "Active", icon: "mic" },
    { name: "HR Onboarder", desc: "Guides new hires through day one", runs: "38", success: "96.7%", status: "Paused", icon: "user-plus" },
    { name: "Data Janitor", desc: "Cleans & normalizes incoming data", runs: "5,124", success: "99.8%", status: "Active", icon: "database" },
    { name: "Outreach Assistant", desc: "Personalized email sequences", runs: "924", success: "89.4%", status: "Active", icon: "send" },
  ],

  // CHATBOT
  chatSuggestions: [
    "Show me this month's revenue",
    "Which deals are at risk?",
    "Who's on leave today?",
    "Run a finance report",
    "What are my top recommendations?",
    "Show me open projects",
  ],

  // NAVIGATION
  navigation: [
    { group: "main", items: [
      { id: "home", name: "Home", icon: "home", page: "index.html" },
      { id: "cockpit", name: "Executive Cockpit", icon: "layout-dashboard", page: "index.html" },
      { id: "services", name: "All Services", icon: "grid-3x3", page: "services.html" },
    ]},
    { group: "ecosystem", label: "Ecosystem Modules", items: [
      { id: "crm", name: "Cortex Intell CRM 360", icon: "users", page: "crm.html", subs: [
        { name: "Dashboard", tab: "dashboard" },
        { name: "Accounts", tab: "accounts" },
        { name: "Contacts", tab: "contacts" },
        { name: "Leads & Pipeline", tab: "leads" },
        { name: "Opportunities / Deals", tab: "opportunities" },
        { name: "Cases", tab: "cases" },
        { name: "Activities & Tasks", tab: "activities" },
        { name: "Documents & Comms", tab: "documents" },
        { name: "Segments & Lists", tab: "segments" },
        { name: "Account 360 View", tab: "account360" },
      ]},
      { id: "hrm", name: "Cortex Intell HRM", icon: "user-cog", page: "hrm.html", subs: [
        { name: "Dashboard", tab: "dashboard" },
        { name: "Employee Management", tab: "employees" },
        { name: "Payroll", tab: "payroll" },
        { name: "Performance", tab: "performance" },
        { name: "Attendance & Leave", tab: "attendance" },
        { name: "Recruitment", tab: "recruitment" },
        { name: "Compliance", tab: "compliance" },
        { name: "Training", tab: "training" },
      ]},
      { id: "finance", name: "Cortex Intell Finance OS", icon: "dollar-sign", page: "finance.html", subs: [
        { name: "Dashboard", tab: "dashboard" },
        { name: "General Ledger", tab: "gl" },
        { name: "Accounts Payable", tab: "ap" },
        { name: "Accounts Receivable", tab: "ar" },
        { name: "Invoicing & Billing", tab: "invoicing" },
        { name: "Cash Flow", tab: "cashflow" },
        { name: "Forecasting", tab: "forecast" },
        { name: "Risk & Controls", tab: "risk" },
        { name: "Reconciliation", tab: "recon" },
      ]},
      { id: "growth", name: "Cortex Intell Growth Engine", icon: "trending-up", page: "growth.html", subs: [
        { name: "Dashboard", tab: "dashboard" },
        { name: "Social Engine", tab: "social" },
        { name: "SEO & Authority", tab: "seo" },
        { name: "Demand Engine", tab: "demand" },
        { name: "Qualification", tab: "qualification" },
        { name: "Intelligence Hub", tab: "intelligence" },
        { name: "Orchestration", tab: "orchestration" },
      ]},
      { id: "brain", name: "Cortex Intell Brain", icon: "brain", page: "brain.html", subs: [
        { name: "Dashboard", tab: "dashboard" },
        { name: "Scoring Engine", tab: "scoring" },
        { name: "Prediction Engine", tab: "prediction" },
        { name: "Recommendations", tab: "recommendation" },
        { name: "Risk Engine", tab: "risk" },
        { name: "AI Copilot", tab: "copilot" },
        { name: "Learning Loop", tab: "learning" },
      ]},
      { id: "projects", name: "Cortex Intell Projects", icon: "folder-kanban", page: "projects.html", subs: [
        { name: "Dashboard", tab: "dashboard" },
        { name: "Project Management", tab: "management" },
        { name: "Tasks & Work", tab: "tasks" },
        { name: "Scheduling", tab: "scheduling" },
        { name: "Resources", tab: "resources" },
        { name: "Risks & Issues", tab: "risks" },
        { name: "Change Requests", tab: "changes" },
        { name: "Milestones", tab: "milestones" },
      ]},
      { id: "agents", name: "Cortex Intell Agents", icon: "bot", page: "agents.html", subs: [
        { name: "Dashboard", tab: "dashboard" },
        { name: "Workflow Composer", tab: "composer" },
        { name: "Automation Rules", tab: "rules" },
        { name: "Event Triggers", tab: "triggers" },
        { name: "Approval Flows", tab: "approvals" },
        { name: "Execution Engine", tab: "engine" },
        { name: "Run Logs", tab: "logs" },
      ]},
      { id: "analytics", name: "Cortex Intell Analytics", icon: "bar-chart-3", page: "accounts.html", subs: [
        { name: "Dashboard", tab: "dashboard" },
        { name: "Dashboards", tab: "dashboards" },
        { name: "Reports", tab: "reports" },
        { name: "KPI Tracking", tab: "kpis" },
        { name: "Command Centre", tab: "command" },
        { name: "Embedded Analytics", tab: "embedded" },
        { name: "Alerts & Insights", tab: "alerts" },
      ]},
      { id: "data-platform", name: "Cortex Intell Data Platform", icon: "database", page: "integration.html", subs: [
        { name: "Dashboard", tab: "dashboard" },
        { name: "Data Storage", tab: "storage" },
        { name: "Data Pipelines", tab: "pipelines" },
        { name: "Data Integration", tab: "integration" },
        { name: "Data Governance", tab: "governance" },
        { name: "Data Modelling", tab: "modelling" },
        { name: "MDM", tab: "mdm" },
        { name: "Data Quality", tab: "quality" },
      ]},
      { id: "chatbot", name: "Cortex Intell AI Chatbot", icon: "message-circle", page: "chatbot.html", subs: [
        { name: "Dashboard", tab: "dashboard" },
        { name: "Chat Interface", tab: "chat" },
        { name: "Query Engine", tab: "query" },
        { name: "Task Execution", tab: "tasks" },
        { name: "Context Awareness", tab: "context" },
        { name: "Knowledge Base", tab: "knowledge" },
        { name: "Channels", tab: "channels" },
      ]},
    ]},
    { group: "quick", label: "Quick Actions", items: [
      { id: "ask-ai", name: "Ask Cortex AI", icon: "sparkles", action: "chat" },
      { id: "new-project", name: "Create New Project", icon: "folder-plus", action: "toast" },
      { id: "run-report", name: "Run Finance Report", icon: "file-text", action: "toast" },
      { id: "new-lead", name: "Add New Lead", icon: "user-plus", action: "toast" },
      { id: "onboard", name: "Onboard Employee", icon: "user-check", action: "toast" },
    ]},
  ],
};

// Expose globally
window.CORTEX_DATA = CORTEX_DATA;
