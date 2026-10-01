// Boaive Operations Hub - Service Abstraction Layer & Data Health Audit Engine

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

export const operationsService = {
  // CLIENTS
  async getClients(): Promise<Client[]> {
    await delay();
    return [...mockClients];
  },
  async createClient(data: Omit<Client, 'clientId' | 'totalProjectValue' | 'totalAmountPaid' | 'outstandingAmount'>): Promise<Client> {
    await delay();
    const newClient: Client = {
      ...data,
      clientId: `CLI-${String(mockClients.length + 1).padStart(3, '0')}`,
      totalProjectValue: 0,
      totalAmountPaid: 0,
      outstandingAmount: 0,
    };
    mockClients = [newClient, ...mockClients];
    return newClient;
  },
  async updateClient(clientId: string, updates: Partial<Client>): Promise<Client> {
    await delay();
    mockClients = mockClients.map((c) => (c.clientId === clientId ? { ...c, ...updates } : c));
    const found = mockClients.find((c) => c.clientId === clientId);
    if (!found) throw new Error('Client not found');
    return found;
  },

  // CONTACTS
  async getContacts(): Promise<Contact[]> {
    await delay();
    return [...mockContacts];
  },
  async createContact(data: Omit<Contact, 'contactId'>): Promise<Contact> {
    await delay();
    const newContact: Contact = {
      ...data,
      contactId: `CON-${String(mockContacts.length + 1).padStart(3, '0')}`,
    };
    mockContacts = [newContact, ...mockContacts];
    return newContact;
  },

  // LEADS
  async getLeads(): Promise<Lead[]> {
    await delay();
    return [...mockLeads];
  },
  async createLead(data: Omit<Lead, 'leadId' | 'weightedValue'>): Promise<Lead> {
    await delay();
    const weighted = Math.round((data.estimatedValue * data.probability) / 100);
    const newLead: Lead = {
      ...data,
      leadId: `LED-${String(mockLeads.length + 1).padStart(3, '0')}`,
      weightedValue: weighted,
    };
    mockLeads = [newLead, ...mockLeads];
    return newLead;
  },
  async updateLeadStatus(leadId: string, status: LeadStatus): Promise<Lead> {
    await delay();
    mockLeads = mockLeads.map((l) => (l.leadId === leadId ? { ...l, status } : l));
    const found = mockLeads.find((l) => l.leadId === leadId);
    if (!found) throw new Error('Lead not found');
    return found;
  },

  // PROJECTS
  async getProjects(): Promise<Project[]> {
    await delay();
    return [...mockProjects];
  },
  async createProject(data: Omit<Project, 'projectId' | 'outstanding'>): Promise<Project> {
    await delay();
    const newProject: Project = {
      ...data,
      projectId: `PRJ-${String(mockProjects.length + 1).padStart(3, '0')}`,
      outstanding: data.paymentStatus === 'Paid' ? 0 : data.projectValue,
    };
    mockProjects = [newProject, ...mockProjects];
    return newProject;
  },
  async updateProject(projectId: string, updates: Partial<Project>): Promise<Project> {
    await delay();
    mockProjects = mockProjects.map((p) => (p.projectId === projectId ? { ...p, ...updates } : p));
    const found = mockProjects.find((p) => p.projectId === projectId);
    if (!found) throw new Error('Project not found');
    return found;
  },

  // TASKS
  async getTasks(): Promise<Task[]> {
    await delay();
    return [...mockTasks];
  },
  async createTask(data: Omit<Task, 'taskId'>): Promise<Task> {
    await delay();
    const newTask: Task = {
      ...data,
      taskId: `TSK-${String(mockTasks.length + 1).padStart(3, '0')}`,
    };
    mockTasks = [newTask, ...mockTasks];
    return newTask;
  },
  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
    await delay();
    mockTasks = mockTasks.map((t) => (t.taskId === taskId ? { ...t, status } : t));
    const found = mockTasks.find((t) => t.taskId === taskId);
    if (!found) throw new Error('Task not found');
    return found;
  },
  async deleteTask(taskId: string): Promise<boolean> {
    await delay();
    mockTasks = mockTasks.filter((t) => t.taskId !== taskId);
    return true;
  },

  // FINANCE
  async getFinanceRecords(): Promise<FinanceRecord[]> {
    await delay();
    return [...mockFinance];
  },
  async createFinanceRecord(data: Omit<FinanceRecord, 'transactionId'>): Promise<FinanceRecord> {
    await delay();
    const newRecord: FinanceRecord = {
      ...data,
      transactionId: `FIN-${String(mockFinance.length + 1).padStart(3, '0')}`,
    };
    mockFinance = [newRecord, ...mockFinance];
    return newRecord;
  },
  async updatePaymentStatus(transactionId: string, paymentStatus: PaymentStatus, paidDate?: string): Promise<FinanceRecord> {
    await delay();
    mockFinance = mockFinance.map((f) =>
      f.transactionId === transactionId
        ? { ...f, paymentStatus, paidDate: paymentStatus === 'Paid' ? (paidDate || '2026-09-30') : f.paidDate }
        : f
    );
    const found = mockFinance.find((f) => f.transactionId === transactionId);
    if (!found) throw new Error('Finance record not found');
    return found;
  },

  // EXPENSES
  async getExpenses(): Promise<ExpenseRecord[]> {
    await delay();
    return [...mockExpenses];
  },
  async createExpense(data: Omit<ExpenseRecord, 'expenseId' | 'monthlyCost'>): Promise<ExpenseRecord> {
    await delay();
    const monthly = data.frequency === 'Monthly' ? data.amount : data.frequency === 'Annual' ? Math.round(data.amount / 12) : 0;
    const newExpense: ExpenseRecord = {
      ...data,
      expenseId: `EXP-${String(mockExpenses.length + 1).padStart(3, '0')}`,
      monthlyCost: monthly,
    };
    mockExpenses = [newExpense, ...mockExpenses];
    return newExpense;
  },

  // ASSETS
  async getAssets(): Promise<AssetRecord[]> {
    await delay();
    return [...mockAssets];
  },
  async createAsset(data: Omit<AssetRecord, 'assetId'>): Promise<AssetRecord> {
    await delay();
    const newAsset: AssetRecord = {
      ...data,
      assetId: `AST-${String(mockAssets.length + 1).padStart(3, '0')}`,
    };
    mockAssets = [newAsset, ...mockAssets];
    return newAsset;
  },
  async renewAsset(assetId: string, newRenewalDate: string): Promise<AssetRecord> {
    await delay();
    mockAssets = mockAssets.map((a) =>
      a.assetId === assetId ? { ...a, renewalDate: newRenewalDate, renewalStatus: '🟢 OK' } : a
    );
    const found = mockAssets.find((a) => a.assetId === assetId);
    if (!found) throw new Error('Asset not found');
    return found;
  },

  // CONTENT
  async getContent(): Promise<ContentRecord[]> {
    await delay();
    return [...mockContent];
  },
  async createContent(data: Omit<ContentRecord, 'contentId'>): Promise<ContentRecord> {
    await delay();
    const newItem: ContentRecord = {
      ...data,
      contentId: `CNT-${String(mockContent.length + 1).padStart(3, '0')}`,
    };
    mockContent = [newItem, ...mockContent];
    return newItem;
  },
  async updateContentStatus(contentId: string, status: any): Promise<ContentRecord> {
    await delay();
    mockContent = mockContent.map((c) => (c.contentId === contentId ? { ...c, status } : c));
    const found = mockContent.find((c) => c.contentId === contentId);
    if (!found) throw new Error('Content record not found');
    return found;
  },

  // SETTINGS & DROPDOWNS
  async getSettings(): Promise<BusinessSettings> {
    await delay();
    return { ...mockSettings };
  },
  async updateSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings> {
    await delay();
    mockSettings = { ...mockSettings, ...settings };
    return { ...mockSettings };
  },
  async getDropdowns(): Promise<DropdownOptions> {
    await delay();
    return { ...mockDropdowns };
  },
  async updateDropdowns(dropdowns: Partial<DropdownOptions>): Promise<DropdownOptions> {
    await delay();
    mockDropdowns = { ...mockDropdowns, ...dropdowns };
    return { ...mockDropdowns };
  },

  // DATA HEALTH CHECKS ENGINE (Section 23 of spec)
  async runDataHealthChecks(): Promise<DataCheckIssue[]> {
    await delay();
    const results: DataCheckIssue[] = [];

    // 1. Duplicate IDs check across all sheets
    const allIds = [
      ...mockClients.map((c) => c.clientId),
      ...mockContacts.map((c) => c.contactId),
      ...mockLeads.map((l) => l.leadId),
      ...mockProjects.map((p) => p.projectId),
      ...mockTasks.map((t) => t.taskId),
      ...mockFinance.map((f) => f.transactionId),
      ...mockExpenses.map((e) => e.expenseId),
      ...mockAssets.map((a) => a.assetId),
      ...mockContent.map((c) => c.contentId),
    ];
    const duplicates = allIds.filter((id, index) => allIds.indexOf(id) !== index);
    results.push({
      checkName: 'Duplicate IDs',
      status: duplicates.length === 0 ? 'OK' : 'ISSUES',
      count: duplicates.length,
      details: duplicates.length === 0 ? ['All 86 primary record keys are uniquely indexed.'] : duplicates,
    });

    // 2. Missing Linked IDs (e.g. Contacts without valid clientId)
    const clientIds = new Set(mockClients.map((c) => c.clientId));
    const brokenContacts = mockContacts.filter((con) => !clientIds.has(con.clientId));
    results.push({
      checkName: 'Missing Linked IDs',
      status: brokenContacts.length === 0 ? 'OK' : 'ISSUES',
      count: brokenContacts.length,
      details: brokenContacts.length === 0 ? ['All contacts map to valid client primary keys.'] : brokenContacts.map((c) => `${c.contactId} missing valid clientId`),
    });

    // 3. Invalid Client References in Projects
    const brokenProjects = mockProjects.filter((p) => !clientIds.has(p.clientId));
    results.push({
      checkName: 'Invalid Client References',
      status: brokenProjects.length === 0 ? 'OK' : 'ISSUES',
      count: brokenProjects.length,
      details: brokenProjects.length === 0 ? ['All active projects link to verified clients in directory.'] : brokenProjects.map((p) => `${p.projectId} references missing client`),
    });

    // 4. Missing Paid Dates on Paid Finance Records
    const missingPaidDates = mockFinance.filter((f) => f.paymentStatus === 'Paid' && !f.paidDate);
    results.push({
      checkName: 'Missing Paid Dates',
      status: missingPaidDates.length === 0 ? 'OK' : 'ISSUES',
      count: missingPaidDates.length,
      details: missingPaidDates.length === 0 ? ['All paid revenue transactions have recorded settlement dates.'] : missingPaidDates.map((f) => `${f.transactionId} marked Paid without date`),
    });

    // 5. Unlinked Finance Records
    const unlinkedFinance = mockFinance.filter((f) => !f.clientId && !f.client);
    results.push({
      checkName: 'Unlinked Finance Records',
      status: unlinkedFinance.length === 0 ? 'OK' : 'ISSUES',
      count: unlinkedFinance.length,
      details: unlinkedFinance.length === 0 ? ['All accounts receivable records are linked to a billed client entity.'] : unlinkedFinance.map((f) => `${f.transactionId} has no client`),
    });

    // 6. Won Leads Without Client Conversion
    const wonLeads = mockLeads.filter((l) => l.status === 'Won');
    const unmappedWon = wonLeads.filter((l) => !mockClients.some((c) => c.company.toLowerCase().includes(l.company.toLowerCase())));
    results.push({
      checkName: 'Won Leads Without Client',
      status: unmappedWon.length === 0 ? 'OK' : 'ISSUES',
      count: unmappedWon.length,
      details: unmappedWon.length === 0 ? ['All closed-won leads have corresponding onboarding client entities.'] : unmappedWon.map((l) => `Won lead "${l.company}" (${l.leadId}) pending client registration`),
    });

    // 7. Assets Without Client or Scope Reference
    const unassignedAssets = mockAssets.filter((a) => !a.client && !a.project);
    results.push({
      checkName: 'Assets Without Client/Scope',
      status: unassignedAssets.length === 0 ? 'OK' : 'ISSUES',
      count: unassignedAssets.length,
      details: unassignedAssets.length === 0 ? ['All infrastructure assets specify an assigned owner scope.'] : unassignedAssets.map((a) => `${a.assetId} has no assigned client or project`),
    });

    // 8. Clients Without Key Contact
    const clientContactClientIds = new Set(mockContacts.map((con) => con.clientId));
    const clientsWithoutContact = mockClients.filter((c) => !c.contactPerson && !clientContactClientIds.has(c.clientId));
    results.push({
      checkName: 'Clients Without Contact',
      status: clientsWithoutContact.length === 0 ? 'OK' : 'ISSUES',
      count: clientsWithoutContact.length,
      details: clientsWithoutContact.length === 0 ? ['All active clients have designated primary contact persons.'] : clientsWithoutContact.map((c) => `${c.clientId} (${c.clientName}) has no primary contact`),
    });

    return results;
  },

  // GLOBAL SEARCH (⌘K)
  async searchAll(query: string): Promise<SearchResultItem[]> {
    if (!query || query.trim() === '') return [];
    const q = query.toLowerCase().trim();
    const results: SearchResultItem[] = [];

    mockClients.forEach((c) => {
      if (c.clientName.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.clientId.toLowerCase().includes(q)) {
        results.push({
          id: c.clientId,
          title: `${c.clientId} • ${c.clientName}`,
          subtitle: `${c.company} • ${c.clientStatus} • Total: ₹${c.totalProjectValue.toLocaleString('en-IN')}`,
          category: 'CLIENTS',
          targetTab: 'crm-clients',
          targetId: c.clientId,
          badgeText: c.clientStatus,
        });
      }
    });

    mockLeads.forEach((l) => {
      if (l.leadName.toLowerCase().includes(q) || l.company.toLowerCase().includes(q) || l.leadId.toLowerCase().includes(q)) {
        results.push({
          id: l.leadId,
          title: `${l.leadId} • ${l.leadName} (${l.company})`,
          subtitle: `Status: ${l.status} • Est: ₹${l.estimatedValue.toLocaleString('en-IN')}`,
          category: 'LEADS',
          targetTab: 'crm-leads',
          targetId: l.leadId,
          badgeText: l.status,
        });
      }
    });

    mockProjects.forEach((p) => {
      if (p.projectName.toLowerCase().includes(q) || p.client.toLowerCase().includes(q) || p.projectId.toLowerCase().includes(q)) {
        results.push({
          id: p.projectId,
          title: `${p.projectId} • ${p.projectName}`,
          subtitle: `Client: ${p.client} • Progress: ${p.progress}% • ${p.status}`,
          category: 'PROJECTS',
          targetTab: 'projects',
          targetId: p.projectId,
          badgeText: p.status,
        });
      }
    });

    mockTasks.forEach((t) => {
      if (t.task.toLowerCase().includes(q) || t.project.toLowerCase().includes(q) || t.taskId.toLowerCase().includes(q)) {
        results.push({
          id: t.taskId,
          title: `${t.taskId} • ${t.task}`,
          subtitle: `Project: ${t.project} • Assignee: ${t.assignedTo}`,
          category: 'TASKS',
          targetTab: 'tasks',
          targetId: t.taskId,
          badgeText: t.status,
        });
      }
    });

    mockFinance.forEach((f) => {
      if (f.transactionId.toLowerCase().includes(q) || f.client.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)) {
        results.push({
          id: f.transactionId,
          title: `${f.transactionId} • ${f.description}`,
          subtitle: `Client: ${f.client} • Amount: ₹${f.amount.toLocaleString('en-IN')}`,
          category: 'FINANCE',
          targetTab: 'finance',
          targetId: f.transactionId,
          badgeText: f.paymentStatus,
        });
      }
    });

    mockAssets.forEach((a) => {
      if (a.assetName.toLowerCase().includes(q) || a.provider.toLowerCase().includes(q) || a.assetId.toLowerCase().includes(q)) {
        results.push({
          id: a.assetId,
          title: `${a.assetId} • ${a.assetName}`,
          subtitle: `Type: ${a.assetType} • Renewal: ${a.renewalDate} (${a.renewalStatus})`,
          category: 'ASSETS',
          targetTab: 'assets',
          targetId: a.assetId,
          badgeText: a.renewalStatus,
        });
      }
    });

    return results;
  },
};

export const searchService = {
  searchAll: (query: string) => operationsService.searchAll(query),
};

