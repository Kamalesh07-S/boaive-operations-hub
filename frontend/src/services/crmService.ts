// Boaive Operations Hub - Service Layer
// Switches between REAL BACKEND API and MOCK DATA.
//
// To use the real backend:
//   1. Start the backend:  cd backend && npm run dev
//   2. Set USE_BACKEND = true  (or set VITE_USE_BACKEND=true in .env)
//
// Mock mode works fully offline with no backend running.

import {
  initialClients,
  initialContacts,
  initialLeads,
  initialProjects,
  initialTasks,
  initialFinanceRecords,
  initialExpenses,
  initialAssets,
  initialContent,
  initialBusinessSettings,
  initialDropdownOptions,
} from '../data/mockData';

import {
  Client,
  Contact,
  Lead,
  Project,
  Task,
  FinanceRecord,
  ExpenseRecord,
  AssetRecord,
  ContentRecord,
  BusinessSettings,
  DropdownOptions,
  DataCheckIssue,
  SearchResultItem,
  LeadStatus,
  TaskStatus,
  PaymentStatus,
} from '../types';

import { api, getAll, setAuthToken, getAuthToken, ApiResponse } from './apiClient';

// ─── Feature flag ──────────────────────────────────────────────────────────
// Set to true once your backend is running and migrated.
const USE_BACKEND = import.meta.env.VITE_USE_BACKEND === 'true' || false;

// ─── Mock store ────────────────────────────────────────────────────────────
let mockClients = [...initialClients];
let mockContacts = [...initialContacts];
let mockLeads = [...initialLeads];
let mockProjects = [...initialProjects];
let mockTasks = [...initialTasks];
let mockFinance = [...initialFinanceRecords];
let mockExpenses = [...initialExpenses];
let mockAssets = [...initialAssets];
let mockContent = [...initialContent];
let mockSettings = { ...initialBusinessSettings };
let mockDropdowns = { ...initialDropdownOptions };

const delay = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── Helper: map backend enums back to frontend display strings ────────────
// Backend uses underscore enums (e.g. "Project_based"), frontend uses display strings
function mapClientFromApi(c: any): Client {
  return {
    ...c,
    clientId: c.clientCode,
    clientStatus: c.clientStatus,
    clientType: c.clientType?.replace(/_/g, '-') ?? c.clientType,
    firstContactDate: c.firstContactDate?.split('T')[0] ?? '',
    onboardingDate: c.onboardingDate?.split('T')[0] ?? '',
    lastContactDate: c.lastContactDate?.split('T')[0] ?? '',
    nextFollowUp: c.nextFollowUp?.split('T')[0] ?? '',
    totalProjectValue: c.totalProjectValue ?? 0,
    totalAmountPaid: c.totalAmountPaid ?? 0,
    outstandingAmount: c.outstandingAmount ?? 0,
    activeProjectsCount: c.activeProjectsCount ?? 0,
  };
}

function mapLeadFromApi(l: any): Lead {
  return {
    ...l,
    leadId: l.leadCode,
    leadName: l.leadName,
    contact: l.contact?.name ?? '',
    status: l.status?.replace(/_/g, ' ') as LeadStatus,
    weightedValue: l.weightedValue ?? Math.round((l.estimatedValue * l.probability) / 100),
    expectedClose: l.expectedCloseDate?.split('T')[0] ?? '',
    nextFollowUp: l.nextFollowUp?.split('T')[0] ?? '',
    assignedTeamMember: l.assignedTo ?? '',
  };
}

function mapProjectFromApi(p: any): Project {
  return {
    ...p,
    projectId: p.projectCode,
    projectName: p.projectName,
    client: p.client?.clientName ?? '',
    serviceType: p.serviceType?.replace(/_/g, '/').replace('AI/ML/Engineering', 'AI/ML Engineering') ?? p.serviceType,
    status: p.status?.replace(/_/g, ' ') as any,
    clientDependency: p.clientDependency?.replace(/_/g, ' ') as any,
    paymentStatus: p.paymentStatus?.replace(/_/g, ' ') as any,
    startDate: p.startDate?.split('T')[0] ?? '',
    deadline: p.deadline?.split('T')[0] ?? '',
    repository: p.repositoryUrl,
    assignedTeam: p.assignedTeam ?? [],
    milestones: p.milestones ?? [],
    outstanding: p.outstanding ?? 0,
  };
}

function mapTaskFromApi(t: any): Task {
  return {
    ...t,
    taskId: t.taskCode,
    task: t.title,
    project: t.project?.projectName ?? '',
    client: '',
    category: t.category?.replace(/_/g, '/') as any,
    status: t.status?.replace(/_/g, ' ') as TaskStatus,
    dueDate: t.dueDate?.split('T')[0] ?? '',
    assignedTo: t.assignedTo ?? '',
  };
}

function mapFinanceFromApi(f: any): FinanceRecord {
  return {
    ...f,
    transactionId: f.transactionCode,
    client: f.client?.clientName ?? '',
    project: f.project?.projectName ?? '',
    paymentStatus: f.paymentStatus?.replace(/_/g, ' ') as PaymentStatus,
    date: f.date?.split('T')[0] ?? '',
    paidDate: f.paidDate?.split('T')[0] ?? '',
  };
}

function mapContactFromApi(c: any): Contact {
  return {
    ...c,
    contactId: c.contactCode,
    client: c.client?.clientName ?? '',
    preferredContactMethod: c.preferredContactMethod as any,
  };
}

function mapExpenseFromApi(e: any): ExpenseRecord {
  return {
    ...e,
    expenseId: e.expenseCode,
    category: e.category?.replace(/_/g, ' & ').replace('Infrastructure  &  Cloud', 'Infrastructure & Cloud') ?? e.category,
    type: e.type,
    frequency: e.frequency?.replace(/_/g, '-') as any,
    paymentStatus: e.paymentStatus as any,
    owner: e.ownerId ?? 'Boaive',
    date: e.date?.split('T')[0] ?? '',
    renewalDate: e.renewalDate?.split('T')[0] ?? '',
    nextDue: e.nextDue?.split('T')[0] ?? '',
    client: e.client?.clientName ?? '',
    project: e.project?.projectName ?? '',
  };
}

function mapAssetFromApi(a: any): AssetRecord {
  const statusMap: Record<string, string> = {
    'OK': '🟢 OK',
    'Renew Soon': '🟡 Renew Soon',
    'Expired': '🔴 Expired',
  };
  return {
    ...a,
    assetId: a.assetCode,
    assetType: a.assetType?.replace(/_/g, ' ') as any,
    ownerType: a.ownerType?.replace(/_/g, ' ') as any,
    client: a.client?.clientName ?? '',
    renewalStatus: (statusMap[a.renewalStatus] ?? '🟢 OK') as any,
    billingFrequency: a.billingFrequency?.replace(/_/g, '-') as any,
    status: a.status?.replace(/_/g, ' ') as any,
    loginOrAccountRef: a.accountReference ?? '',
    purchaseDate: a.purchaseDate?.split('T')[0] ?? '',
    renewalDate: a.renewalDate?.split('T')[0] ?? '',
  };
}

function mapContentFromApi(c: any): ContentRecord {
  return {
    ...c,
    contentId: c.contentCode,
    contentType: c.contentType?.replace(/_/g, ' ') as any,
    platform: c.platform?.replace(/_/g, '/') as any,
    contentPillar: c.contentPillar?.replace(/_/g, ' ') as any,
    relatedProject: c.project?.projectName ?? '',
    relatedClient: c.client?.clientName ?? '',
    ideaDate: c.ideaDate?.split('T')[0] ?? '',
    draftDate: c.draftDate?.split('T')[0] ?? '',
    scheduledDate: c.scheduledDate?.split('T')[0] ?? '',
    publishedDate: c.publishedDate?.split('T')[0] ?? '',
    author: c.author ?? '',
  };
}

// ─── Auth ─────────────────────────────────────────────────────────────────
export const authService = {
  async login(email: string, password: string) {
    const res = await api.post<ApiResponse<{ token: string; user: any }>>('/api/auth/login', { email, password });
    setAuthToken(res.data.token);
    return res.data;
  },
  async logout() {
    await api.post('/api/auth/logout', {}).catch(() => {});
    setAuthToken(null);
  },
  async me() {
    return api.get<ApiResponse<any>>('/api/auth/me');
  },
  isLoggedIn: () => !!getAuthToken(),
};

// ─── Operations Service (CRUD + mock fallback) ─────────────────────────────
export const operationsService = {
  // CLIENTS
  async getClients(): Promise<Client[]> {
    if (!USE_BACKEND) { await delay(); return [...mockClients]; }
    const raw = await getAll<any>('/api/clients');
    return raw.map(mapClientFromApi);
  },
  async createClient(data: Omit<Client, 'clientId' | 'totalProjectValue' | 'totalAmountPaid' | 'outstandingAmount'>): Promise<Client> {
    if (!USE_BACKEND) {
      await delay();
      const newClient: Client = { ...data, clientId: `CLI-${String(mockClients.length + 1).padStart(3, '0')}`, totalProjectValue: 0, totalAmountPaid: 0, outstandingAmount: 0 };
      mockClients = [newClient, ...mockClients]; return newClient;
    }
    const res = await api.post<ApiResponse<any>>('/api/clients', {
      ...data, clientStatus: data.clientStatus, clientType: data.clientType?.replace(/-/g, '_'),
    });
    return mapClientFromApi(res.data);
  },
  async updateClient(clientId: string, updates: Partial<Client>): Promise<Client> {
    if (!USE_BACKEND) {
      await delay();
      mockClients = mockClients.map((c) => (c.clientId === clientId ? { ...c, ...updates } : c));
      const found = mockClients.find((c) => c.clientId === clientId);
      if (!found) throw new Error('Client not found'); return found;
    }
    // Find backend ID from clientCode
    const all = await getAll<any>('/api/clients');
    const rec = all.find((c: any) => c.clientCode === clientId);
    if (!rec) throw new Error('Client not found');
    const res = await api.put<ApiResponse<any>>(`/api/clients/${rec.id}`, updates);
    return mapClientFromApi(res.data);
  },

  // CONTACTS
  async getContacts(): Promise<Contact[]> {
    if (!USE_BACKEND) { await delay(); return [...mockContacts]; }
    const raw = await getAll<any>('/api/contacts');
    return raw.map(mapContactFromApi);
  },
  async createContact(data: Omit<Contact, 'contactId'>): Promise<Contact> {
    if (!USE_BACKEND) {
      await delay();
      const newContact: Contact = { ...data, contactId: `CON-${String(mockContacts.length + 1).padStart(3, '0')}` };
      mockContacts = [newContact, ...mockContacts]; return newContact;
    }
    // Need to resolve clientCode → backend ID
    const clients = await getAll<any>('/api/clients');
    const client = clients.find((c: any) => c.clientCode === data.clientId);
    const res = await api.post<ApiResponse<any>>('/api/contacts', { ...data, clientId: client?.id ?? data.clientId });
    return mapContactFromApi(res.data);
  },

  // LEADS
  async getLeads(): Promise<Lead[]> {
    if (!USE_BACKEND) { await delay(); return [...mockLeads]; }
    const raw = await getAll<any>('/api/leads');
    return raw.map(mapLeadFromApi);
  },
  async createLead(data: Omit<Lead, 'leadId' | 'weightedValue'>): Promise<Lead> {
    if (!USE_BACKEND) {
      await delay();
      const weighted = Math.round((data.estimatedValue * data.probability) / 100);
      const newLead: Lead = { ...data, leadId: `LED-${String(mockLeads.length + 1).padStart(3, '0')}`, weightedValue: weighted };
      mockLeads = [newLead, ...mockLeads]; return newLead;
    }
    const res = await api.post<ApiResponse<any>>('/api/leads', {
      leadName: data.leadName, company: data.company, source: data.source,
      status: data.status?.replace(/ /g, '_'), estimatedValue: data.estimatedValue,
      probability: data.probability, expectedCloseDate: data.expectedClose || undefined,
      nextFollowUp: data.nextFollowUp || undefined, assignedTo: data.assignedTeamMember,
      notes: data.notes,
    });
    return mapLeadFromApi(res.data);
  },
  async updateLeadStatus(leadId: string, status: LeadStatus): Promise<Lead> {
    if (!USE_BACKEND) {
      await delay();
      mockLeads = mockLeads.map((l) => (l.leadId === leadId ? { ...l, status } : l));
      const found = mockLeads.find((l) => l.leadId === leadId);
      if (!found) throw new Error('Lead not found'); return found;
    }
    const all = await getAll<any>('/api/leads');
    const rec = all.find((l: any) => l.leadCode === leadId);
    if (!rec) throw new Error('Lead not found');
    const res = await api.put<ApiResponse<any>>(`/api/leads/${rec.id}`, { status: status.replace(/ /g, '_') });
    return mapLeadFromApi(res.data);
  },

  // PROJECTS
  async getProjects(): Promise<Project[]> {
    if (!USE_BACKEND) { await delay(); return [...mockProjects]; }
    const raw = await getAll<any>('/api/projects');
    return raw.map(mapProjectFromApi);
  },
  async createProject(data: Omit<Project, 'projectId' | 'outstanding'>): Promise<Project> {
    if (!USE_BACKEND) {
      await delay();
      const newProject: Project = { ...data, projectId: `PRJ-${String(mockProjects.length + 1).padStart(3, '0')}`, outstanding: data.paymentStatus === 'Paid' ? 0 : data.projectValue };
      mockProjects = [newProject, ...mockProjects]; return newProject;
    }
    const clients = await getAll<any>('/api/clients');
    const client = clients.find((c: any) => c.clientCode === data.clientId);
    const res = await api.post<ApiResponse<any>>('/api/projects', {
      projectName: data.projectName, clientId: client?.id ?? data.clientId,
      serviceType: data.serviceType?.replace(/\//g, '_').replace(/ /g, '_'),
      status: data.status?.replace(/ /g, '_'), priority: data.priority,
      startDate: data.startDate || undefined, deadline: data.deadline || undefined,
      progress: data.progress, currentPhase: data.currentPhase,
      nextMilestone: data.nextMilestone,
      clientDependency: data.clientDependency?.replace(/ /g, '_'),
      paymentStatus: data.paymentStatus?.replace(/ /g, '_'),
      projectValue: data.projectValue, repositoryUrl: data.repository,
      deploymentUrl: data.deploymentUrl, projectFolder: data.projectFolder,
      assignedTeam: data.assignedTeam, notes: data.notes,
    });
    return mapProjectFromApi(res.data);
  },
  async updateProject(projectId: string, updates: Partial<Project>): Promise<Project> {
    if (!USE_BACKEND) {
      await delay();
      mockProjects = mockProjects.map((p) => (p.projectId === projectId ? { ...p, ...updates } : p));
      const found = mockProjects.find((p) => p.projectId === projectId);
      if (!found) throw new Error('Project not found'); return found;
    }
    const all = await getAll<any>('/api/projects');
    const rec = all.find((p: any) => p.projectCode === projectId);
    if (!rec) throw new Error('Project not found');
    const res = await api.put<ApiResponse<any>>(`/api/projects/${rec.id}`, {
      ...updates,
      status: updates.status?.replace(/ /g, '_'),
      paymentStatus: updates.paymentStatus?.replace(/ /g, '_'),
    });
    return mapProjectFromApi(res.data);
  },

  // TASKS
  async getTasks(): Promise<Task[]> {
    if (!USE_BACKEND) { await delay(); return [...mockTasks]; }
    const raw = await getAll<any>('/api/tasks');
    return raw.map(mapTaskFromApi);
  },
  async createTask(data: Omit<Task, 'taskId'>): Promise<Task> {
    if (!USE_BACKEND) {
      await delay();
      const newTask: Task = { ...data, taskId: `TSK-${String(mockTasks.length + 1).padStart(3, '0')}` };
      mockTasks = [newTask, ...mockTasks]; return newTask;
    }
    const projects = await getAll<any>('/api/projects');
    const proj = projects.find((p: any) => p.projectCode === data.projectId);
    const res = await api.post<ApiResponse<any>>('/api/tasks', {
      title: data.task, projectId: proj?.id ?? undefined,
      category: data.category?.replace(/\//g, '_').replace(/ /g, '_'),
      priority: data.priority, status: data.status?.replace(/ /g, '_'),
      dueDate: data.dueDate || undefined, assignedTo: data.assignedTo, notes: data.notes,
    });
    return mapTaskFromApi(res.data);
  },
  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
    if (!USE_BACKEND) {
      await delay();
      mockTasks = mockTasks.map((t) => (t.taskId === taskId ? { ...t, status } : t));
      const found = mockTasks.find((t) => t.taskId === taskId);
      if (!found) throw new Error('Task not found'); return found;
    }
    const all = await getAll<any>('/api/tasks');
    const rec = all.find((t: any) => t.taskCode === taskId);
    if (!rec) throw new Error('Task not found');
    const res = await api.put<ApiResponse<any>>(`/api/tasks/${rec.id}`, { status: status.replace(/ /g, '_') });
    return mapTaskFromApi(res.data);
  },
  async deleteTask(taskId: string): Promise<boolean> {
    if (!USE_BACKEND) { await delay(); mockTasks = mockTasks.filter((t) => t.taskId !== taskId); return true; }
    const all = await getAll<any>('/api/tasks');
    const rec = all.find((t: any) => t.taskCode === taskId);
    if (!rec) return true;
    await api.delete(`/api/tasks/${rec.id}`);
    return true;
  },

  // FINANCE
  async getFinanceRecords(): Promise<FinanceRecord[]> {
    if (!USE_BACKEND) { await delay(); return [...mockFinance]; }
    const raw = await getAll<any>('/api/finance');
    return raw.map(mapFinanceFromApi);
  },
  async createFinanceRecord(data: Omit<FinanceRecord, 'transactionId'>): Promise<FinanceRecord> {
    if (!USE_BACKEND) {
      await delay();
      const newRecord: FinanceRecord = { ...data, transactionId: `FIN-${String(mockFinance.length + 1).padStart(3, '0')}` };
      mockFinance = [newRecord, ...mockFinance]; return newRecord;
    }
    const res = await api.post<ApiResponse<any>>('/api/finance', {
      ...data, paymentStatus: data.paymentStatus?.replace(/ /g, '_'),
    });
    return mapFinanceFromApi(res.data);
  },
  async updatePaymentStatus(transactionId: string, paymentStatus: PaymentStatus, paidDate?: string): Promise<FinanceRecord> {
    if (!USE_BACKEND) {
      await delay();
      mockFinance = mockFinance.map((f) => f.transactionId === transactionId ? { ...f, paymentStatus, paidDate: paymentStatus === 'Paid' ? (paidDate || '2026-09-30') : f.paidDate } : f);
      const found = mockFinance.find((f) => f.transactionId === transactionId);
      if (!found) throw new Error('Finance record not found'); return found;
    }
    const all = await getAll<any>('/api/finance');
    const rec = all.find((f: any) => f.transactionCode === transactionId);
    if (!rec) throw new Error('Finance record not found');
    const res = await api.put<ApiResponse<any>>(`/api/finance/${rec.id}`, {
      paymentStatus: paymentStatus.replace(/ /g, '_'), paidDate: paidDate || undefined,
    });
    return mapFinanceFromApi(res.data);
  },

  // EXPENSES
  async getExpenses(): Promise<ExpenseRecord[]> {
    if (!USE_BACKEND) { await delay(); return [...mockExpenses]; }
    const raw = await getAll<any>('/api/expenses');
    return raw.map(mapExpenseFromApi);
  },
  async createExpense(data: Omit<ExpenseRecord, 'expenseId' | 'monthlyCost'>): Promise<ExpenseRecord> {
    if (!USE_BACKEND) {
      await delay();
      const monthly = data.frequency === 'Monthly' ? data.amount : data.frequency === 'Annual' ? Math.round(data.amount / 12) : 0;
      const newExpense: ExpenseRecord = { ...data, expenseId: `EXP-${String(mockExpenses.length + 1).padStart(3, '0')}`, monthlyCost: monthly };
      mockExpenses = [newExpense, ...mockExpenses]; return newExpense;
    }
    const res = await api.post<ApiResponse<any>>('/api/expenses', {
      ...data, frequency: data.frequency?.replace(/-/g, '_'),
      category: data.category?.replace(/ & /g, '_').replace(/ \/ /g, '_').replace(/ /g, '_'),
    });
    return mapExpenseFromApi(res.data);
  },

  // ASSETS
  async getAssets(): Promise<AssetRecord[]> {
    if (!USE_BACKEND) { await delay(); return [...mockAssets]; }
    const raw = await getAll<any>('/api/assets');
    return raw.map(mapAssetFromApi);
  },
  async createAsset(data: Omit<AssetRecord, 'assetId'>): Promise<AssetRecord> {
    if (!USE_BACKEND) {
      await delay();
      const newAsset: AssetRecord = { ...data, assetId: `AST-${String(mockAssets.length + 1).padStart(3, '0')}` };
      mockAssets = [newAsset, ...mockAssets]; return newAsset;
    }
    const res = await api.post<ApiResponse<any>>('/api/assets', {
      ...data,
      assetType: data.assetType?.replace(/ /g, '_'),
      ownerType: data.ownerType?.replace(/ /g, '_'),
      billingFrequency: data.billingFrequency?.replace(/-/g, '_'),
      status: data.status?.replace(/ /g, '_'),
      accountReference: data.loginOrAccountRef,
    });
    return mapAssetFromApi(res.data);
  },
  async renewAsset(assetId: string, newRenewalDate: string): Promise<AssetRecord> {
    if (!USE_BACKEND) {
      await delay();
      mockAssets = mockAssets.map((a) => a.assetId === assetId ? { ...a, renewalDate: newRenewalDate, renewalStatus: '🟢 OK' } : a);
      const found = mockAssets.find((a) => a.assetId === assetId);
      if (!found) throw new Error('Asset not found'); return found;
    }
    const all = await getAll<any>('/api/assets');
    const rec = all.find((a: any) => a.assetCode === assetId);
    if (!rec) throw new Error('Asset not found');
    const res = await api.put<ApiResponse<any>>(`/api/assets/${rec.id}`, { renewalDate: newRenewalDate });
    return mapAssetFromApi(res.data);
  },

  // CONTENT
  async getContent(): Promise<ContentRecord[]> {
    if (!USE_BACKEND) { await delay(); return [...mockContent]; }
    const raw = await getAll<any>('/api/content');
    return raw.map(mapContentFromApi);
  },
  async createContent(data: Omit<ContentRecord, 'contentId'>): Promise<ContentRecord> {
    if (!USE_BACKEND) {
      await delay();
      const newItem: ContentRecord = { ...data, contentId: `CNT-${String(mockContent.length + 1).padStart(3, '0')}` };
      mockContent = [newItem, ...mockContent]; return newItem;
    }
    const res = await api.post<ApiResponse<any>>('/api/content', {
      ...data,
      contentType: data.contentType?.replace(/ /g, '_'),
      platform: data.platform?.replace(/\//g, '_'),
      contentPillar: data.contentPillar?.replace(/ /g, '_'),
    });
    return mapContentFromApi(res.data);
  },
  async updateContentStatus(contentId: string, status: any): Promise<ContentRecord> {
    if (!USE_BACKEND) {
      await delay();
      mockContent = mockContent.map((c) => (c.contentId === contentId ? { ...c, status } : c));
      const found = mockContent.find((c) => c.contentId === contentId);
      if (!found) throw new Error('Content record not found'); return found;
    }
    const all = await getAll<any>('/api/content');
    const rec = all.find((c: any) => c.contentCode === contentId);
    if (!rec) throw new Error('Content not found');
    const res = await api.put<ApiResponse<any>>(`/api/content/${rec.id}`, { status });
    return mapContentFromApi(res.data);
  },

  // SETTINGS
  async getSettings(): Promise<BusinessSettings> {
    await delay(); return { ...mockSettings };
  },
  async updateSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings> {
    await delay(); mockSettings = { ...mockSettings, ...settings }; return { ...mockSettings };
  },
  async getDropdowns(): Promise<DropdownOptions> {
    await delay(); return { ...mockDropdowns };
  },
  async updateDropdowns(dropdowns: Partial<DropdownOptions>): Promise<DropdownOptions> {
    await delay(); mockDropdowns = { ...mockDropdowns, ...dropdowns }; return { ...mockDropdowns };
  },

  // DATA HEALTH
  async runDataHealthChecks(): Promise<DataCheckIssue[]> {
    await delay();
    return [{ checkName: 'System', status: 'OK', count: 0, details: ['All systems operational.'] }];
  },

  // GLOBAL SEARCH
  async searchAll(query: string): Promise<SearchResultItem[]> {
    if (!query || query.trim() === '') return [];

    if (USE_BACKEND) {
      try {
        const res = await api.get<any>(`/api/search?q=${encodeURIComponent(query)}`);
        const groups = res.data ?? {};
        return Object.values(groups).flat() as SearchResultItem[];
      } catch {
        // fall through to mock
      }
    }

    const q = query.toLowerCase().trim();
    const results: SearchResultItem[] = [];

    mockClients.forEach((c) => {
      if (c.clientName.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.clientId.toLowerCase().includes(q)) {
        results.push({ id: c.clientId, title: `${c.clientId} • ${c.clientName}`, subtitle: `${c.company} • ${c.clientStatus}`, category: 'CLIENTS', targetTab: 'crm-clients', targetId: c.clientId, badgeText: c.clientStatus });
      }
    });
    mockLeads.forEach((l) => {
      if (l.leadName.toLowerCase().includes(q) || l.company.toLowerCase().includes(q) || l.leadId.toLowerCase().includes(q)) {
        results.push({ id: l.leadId, title: `${l.leadId} • ${l.leadName} (${l.company})`, subtitle: `Status: ${l.status}`, category: 'LEADS', targetTab: 'crm-leads', targetId: l.leadId, badgeText: l.status });
      }
    });
    mockProjects.forEach((p) => {
      if (p.projectName.toLowerCase().includes(q) || p.client.toLowerCase().includes(q) || p.projectId.toLowerCase().includes(q)) {
        results.push({ id: p.projectId, title: `${p.projectId} • ${p.projectName}`, subtitle: `Client: ${p.client}`, category: 'PROJECTS', targetTab: 'projects', targetId: p.projectId, badgeText: p.status });
      }
    });
    mockTasks.forEach((t) => {
      if (t.task.toLowerCase().includes(q) || t.taskId.toLowerCase().includes(q)) {
        results.push({ id: t.taskId, title: `${t.taskId} • ${t.task}`, subtitle: `Project: ${t.project}`, category: 'TASKS', targetTab: 'tasks', targetId: t.taskId, badgeText: t.status });
      }
    });
    mockAssets.forEach((a) => {
      if (a.assetName.toLowerCase().includes(q) || a.assetId.toLowerCase().includes(q)) {
        results.push({ id: a.assetId, title: `${a.assetId} • ${a.assetName}`, subtitle: `${a.assetType} • ${a.renewalDate}`, category: 'ASSETS', targetTab: 'assets', targetId: a.assetId, badgeText: a.renewalStatus });
      }
    });
    return results;
  },
};

export const searchService = {
  searchAll: (query: string) => operationsService.searchAll(query),
};
