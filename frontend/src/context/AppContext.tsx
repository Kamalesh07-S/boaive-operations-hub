// Boaive Operations Hub - Application State Context

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  NavigationTab,
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
  LeadStatus,
  TaskStatus,
  PaymentStatus,
} from '../types';

import { operationsService } from '../services/crmService';
import { useToast } from './ToastContext';

export type QuickAddType =
  | 'client'
  | 'contact'
  | 'lead'
  | 'project'
  | 'task'
  | 'finance'
  | 'expense'
  | 'asset'
  | 'content';

interface AppContextType {
  // Navigation State
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;

  // Layout & Overlays
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  quickAddType: QuickAddType | null;
  openQuickAdd: (type: QuickAddType) => void;
  closeQuickAdd: () => void;
  assistantModalOpen: boolean;
  setAssistantModalOpen: (open: boolean) => void;
  notificationsDrawerOpen: boolean;
  setNotificationsDrawerOpen: (open: boolean) => void;

  // Stores
  clients: Client[];
  contacts: Contact[];
  leads: Lead[];
  projects: Project[];
  tasks: Task[];
  finance: FinanceRecord[];
  expenses: ExpenseRecord[];
  assets: AssetRecord[];
  content: ContentRecord[];
  settings: BusinessSettings;
  dropdowns: DropdownOptions;
  dataHealthIssues: DataCheckIssue[];

  // Mutators
  navigateAndFocus: (tab: NavigationTab, targetId?: string) => void;
  addClient: (data: Omit<Client, 'clientId' | 'totalProjectValue' | 'totalAmountPaid' | 'outstandingAmount'>) => Promise<void>;
  updateClient: (id: string, updates: Partial<Client>) => Promise<void>;
  addContact: (data: Omit<Contact, 'contactId'>) => Promise<void>;
  addLead: (data: Omit<Lead, 'leadId' | 'weightedValue'>) => Promise<void>;
  updateLeadStatus: (id: string, status: LeadStatus) => Promise<void>;
  addProject: (data: Omit<Project, 'projectId' | 'outstanding'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  addTask: (data: Omit<Task, 'taskId'>) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addFinanceRecord: (data: Omit<FinanceRecord, 'transactionId'>) => Promise<void>;
  updatePaymentStatus: (id: string, status: PaymentStatus, date?: string) => Promise<void>;
  addExpense: (data: Omit<ExpenseRecord, 'expenseId' | 'monthlyCost'>) => Promise<void>;
  addAsset: (data: Omit<AssetRecord, 'assetId'>) => Promise<void>;
  renewAsset: (id: string, date: string) => Promise<void>;
  addContent: (data: Omit<ContentRecord, 'contentId'>) => Promise<void>;
  updateContentStatus: (id: string, status: any) => Promise<void>;
  updateSettings: (settings: Partial<BusinessSettings>) => Promise<void>;
  refreshAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<QuickAddType | null>(null);
  const [assistantModalOpen, setAssistantModalOpen] = useState(false);
  const [notificationsDrawerOpen, setNotificationsDrawerOpen] = useState(false);

  // Entities
  const [clients, setClients] = useState<Client[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [finance, setFinance] = useState<FinanceRecord[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [assets, setAssets] = useState<AssetRecord[]>([]);
  const [content, setContent] = useState<ContentRecord[]>([]);
  const [settings, setSettings] = useState<BusinessSettings>({
    businessName: 'Boaive Technologies Private Limited',
    currency: 'INR (₹)',
    asOfDate: '2026-09-30',
    dueSoonWindow: 7,
    followUpWindow: 3,
    upcomingWindow: 14,
    renewalWarning: 30,
  });
  const [dropdowns, setDropdowns] = useState<DropdownOptions>({
    clientStatuses: ['Open', 'Active', 'Hold', 'Completed', 'Declined', 'Inactive'],
    clientTypes: ['Enterprise', 'Retainer', 'Project-based', 'Advisory'],
    leadStatuses: ['New', 'Contacted', 'Discovery', 'Proposal Sent', 'Negotiation', 'Won', 'Lost', 'On Hold'],
    sources: ['Referral', 'LinkedIn', 'Inbound Web', 'Cold Outreach', 'Conference', 'Partner'],
    serviceTypes: ['Web App', 'AI/ML Engineering', 'Mobile App', 'Cloud Infrastructure', 'UI/UX Design', 'Retainer'],
    projectStatuses: ['Open Work', 'In Progress', 'Awaiting Client', 'Testing', 'Overdue', 'On Hold', 'Completed', 'Cancelled'],
    paymentStatuses: ['Draft', 'Sent', 'Partially Paid', 'Paid', 'Overdue'],
    taskStatuses: ['Todo', 'In Progress', 'Review', 'Completed', 'Overdue'],
    taskCategories: ['Development', 'Design', 'DevOps', 'Bugfix', 'QA/Testing', 'Client Ops', 'Security'],
    priorities: ['Low', 'Medium', 'High', 'Urgent'],
    teamMembers: ['Aarav Sharma', 'Priya Iyer', 'Rohan Mehta', 'Ananya Verma'],
    expenseCategories: ['Infrastructure & Cloud', 'Software & Licenses', 'Contractor / Agency', 'Operations & Office', 'Marketing & Sales', 'Hardware'],
    contentPlatforms: ['LinkedIn', 'Twitter/X', 'Blog', 'Newsletter', 'YouTube', 'Case Study'],
    contentStatuses: ['Idea', 'Draft', 'Review', 'Scheduled', 'Published'],
  });
  const [dataHealthIssues, setDataHealthIssues] = useState<DataCheckIssue[]>([]);

  const refreshAllData = useCallback(async () => {
    try {
      const [
        clientsRes,
        contactsRes,
        leadsRes,
        projectsRes,
        tasksRes,
        financeRes,
        expensesRes,
        assetsRes,
        contentRes,
        settingsRes,
        dropdownsRes,
        healthRes,
      ] = await Promise.all([
        operationsService.getClients(),
        operationsService.getContacts(),
        operationsService.getLeads(),
        operationsService.getProjects(),
        operationsService.getTasks(),
        operationsService.getFinanceRecords(),
        operationsService.getExpenses(),
        operationsService.getAssets(),
        operationsService.getContent(),
        operationsService.getSettings(),
        operationsService.getDropdowns(),
        operationsService.runDataHealthChecks(),
      ]);

      setClients(clientsRes);
      setContacts(contactsRes);
      setLeads(leadsRes);
      setProjects(projectsRes);
      setTasks(tasksRes);
      setFinance(financeRes);
      setExpenses(expensesRes);
      setAssets(assetsRes);
      setContent(contentRes);
      setSettings(settingsRes);
      setDropdowns(dropdownsRes);
      setDataHealthIssues(healthRes);
    } catch (err) {
      console.error('Error loading operations data:', err);
    }
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  const openQuickAdd = (type: QuickAddType) => setQuickAddType(type);
  const closeQuickAdd = () => setQuickAddType(null);

  const navigateAndFocus = (tab: NavigationTab, targetId?: string) => {
    setCurrentTab(tab);
    if (tab === 'projects' && targetId) setSelectedProjectId(targetId);
    if (tab === 'crm-clients' && targetId) setSelectedClientId(targetId);
  };

  const addClient = async (data: Omit<Client, 'clientId' | 'totalProjectValue' | 'totalAmountPaid' | 'outstandingAmount'>) => {
    try {
      const created = await operationsService.createClient(data);
      setClients((prev) => [created, ...prev]);
      showToast(`Client ${created.clientName} added (${created.clientId})`, 'success', 'Client Saved');
      refreshAllData();
    } catch {
      showToast('Failed to add client', 'danger');
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      const updated = await operationsService.updateClient(id, updates);
      setClients((prev) => prev.map((c) => (c.clientId === id ? updated : c)));
      showToast(`Client ${id} updated`, 'success');
      refreshAllData();
    } catch {
      showToast('Failed to update client', 'danger');
    }
  };

  const addContact = async (data: Omit<Contact, 'contactId'>) => {
    try {
      const created = await operationsService.createContact(data);
      setContacts((prev) => [created, ...prev]);
      showToast(`Contact ${created.name} saved (${created.contactId})`, 'success');
      refreshAllData();
    } catch {
      showToast('Failed to add contact', 'danger');
    }
  };

  const addLead = async (data: Omit<Lead, 'leadId' | 'weightedValue'>) => {
    try {
      const created = await operationsService.createLead(data);
      setLeads((prev) => [created, ...prev]);
      showToast(`Lead ${created.leadName} registered (${created.leadId})`, 'success', 'Lead Saved');
      refreshAllData();
    } catch {
      showToast('Failed to add lead', 'danger');
    }
  };

  const updateLeadStatus = async (id: string, status: LeadStatus) => {
    try {
      const updated = await operationsService.updateLeadStatus(id, status);
      setLeads((prev) => prev.map((l) => (l.leadId === id ? updated : l)));
      showToast(`Lead moved to "${status}"`, 'info');
      refreshAllData();
    } catch {
      showToast('Failed to update status', 'danger');
    }
  };

  const addProject = async (data: Omit<Project, 'projectId' | 'outstanding'>) => {
    try {
      const created = await operationsService.createProject(data);
      setProjects((prev) => [created, ...prev]);
      showToast(`Project ${created.projectName} initialized (${created.projectId})`, 'success');
      refreshAllData();
    } catch {
      showToast('Failed to add project', 'danger');
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const updated = await operationsService.updateProject(id, updates);
      setProjects((prev) => prev.map((p) => (p.projectId === id ? updated : p)));
      showToast(`Project ${id} updated`, 'success');
      refreshAllData();
    } catch {
      showToast('Failed to update project', 'danger');
    }
  };

  const addTask = async (data: Omit<Task, 'taskId'>) => {
    try {
      const created = await operationsService.createTask(data);
      setTasks((prev) => [created, ...prev]);
      showToast(`Task assigned to ${created.assignedTo} (${created.taskId})`, 'success');
      refreshAllData();
    } catch {
      showToast('Failed to add task', 'danger');
    }
  };

  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    try {
      const updated = await operationsService.updateTaskStatus(id, status);
      setTasks((prev) => prev.map((t) => (t.taskId === id ? updated : t)));
      showToast(`Task marked as ${status}`, 'info');
      refreshAllData();
    } catch {
      showToast('Failed to update task', 'danger');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await operationsService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.taskId !== id));
      showToast(`Task ${id} removed`, 'info');
    } catch {
      showToast('Failed to delete task', 'danger');
    }
  };

  const addFinanceRecord = async (data: Omit<FinanceRecord, 'transactionId'>) => {
    try {
      const created = await operationsService.createFinanceRecord(data);
      setFinance((prev) => [created, ...prev]);
      showToast(`Finance transaction ${created.transactionId} logged`, 'success');
      refreshAllData();
    } catch {
      showToast('Failed to log finance record', 'danger');
    }
  };

  const updatePaymentStatus = async (id: string, status: PaymentStatus, date?: string) => {
    try {
      const updated = await operationsService.updatePaymentStatus(id, status, date);
      setFinance((prev) => prev.map((f) => (f.transactionId === id ? updated : f)));
      showToast(`Transaction ${id} status updated to ${status}`, 'success');
      refreshAllData();
    } catch {
      showToast('Failed to update payment status', 'danger');
    }
  };

  const addExpense = async (data: Omit<ExpenseRecord, 'expenseId' | 'monthlyCost'>) => {
    try {
      const created = await operationsService.createExpense(data);
      setExpenses((prev) => [created, ...prev]);
      showToast(`Expense ${created.expenseId} logged (₹${created.amount})`, 'success');
      refreshAllData();
    } catch {
      showToast('Failed to add expense', 'danger');
    }
  };

  const addAsset = async (data: Omit<AssetRecord, 'assetId'>) => {
    try {
      const created = await operationsService.createAsset(data);
      setAssets((prev) => [created, ...prev]);
      showToast(`Asset ${created.assetId} (${created.assetName}) registered`, 'success');
      refreshAllData();
    } catch {
      showToast('Failed to register asset', 'danger');
    }
  };

  const renewAsset = async (id: string, date: string) => {
    try {
      const updated = await operationsService.renewAsset(id, date);
      setAssets((prev) => prev.map((a) => (a.assetId === id ? updated : a)));
      showToast(`Asset ${id} renewed until ${date}`, 'success');
      refreshAllData();
    } catch {
      showToast('Failed to renew asset', 'danger');
    }
  };

  const addContent = async (data: Omit<ContentRecord, 'contentId'>) => {
    try {
      const created = await operationsService.createContent(data);
      setContent((prev) => [created, ...prev]);
      showToast(`Content item ${created.contentId} scheduled`, 'success');
      refreshAllData();
    } catch {
      showToast('Failed to add content', 'danger');
    }
  };

  const updateContentStatus = async (id: string, status: any) => {
    try {
      const updated = await operationsService.updateContentStatus(id, status);
      setContent((prev) => prev.map((c) => (c.contentId === id ? updated : c)));
      showToast(`Content ${id} status updated`, 'info');
    } catch {
      showToast('Failed to update content status', 'danger');
    }
  };

  const updateSettings = async (newSettings: Partial<BusinessSettings>) => {
    try {
      const updated = await operationsService.updateSettings(newSettings);
      setSettings(updated);
      showToast('Business settings updated', 'success');
      refreshAllData();
    } catch {
      showToast('Failed to update settings', 'danger');
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        selectedProjectId,
        setSelectedProjectId,
        selectedClientId,
        setSelectedClientId,
        sidebarCollapsed,
        toggleSidebar,
        commandPaletteOpen,
        setCommandPaletteOpen,
        quickAddType,
        openQuickAdd,
        closeQuickAdd,
        assistantModalOpen,
        setAssistantModalOpen,
        notificationsDrawerOpen,
        setNotificationsDrawerOpen,
        clients,
        contacts,
        leads,
        projects,
        tasks,
        finance,
        expenses,
        assets,
        content,
        settings,
        dropdowns,
        dataHealthIssues,
        navigateAndFocus,
        addClient,
        updateClient,
        addContact,
        addLead,
        updateLeadStatus,
        addProject,
        updateProject,
        addTask,
        updateTaskStatus,
        deleteTask,
        addFinanceRecord,
        updatePaymentStatus,
        addExpense,
        addAsset,
        renewAsset,
        addContent,
        updateContentStatus,
        updateSettings,
        refreshAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
