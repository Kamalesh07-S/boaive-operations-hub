// Boaive Operations Hub - Complete Type System strictly mapped to Excel Sheets

export type NavigationTab =
  | 'dashboard'
  | 'crm-clients'
  | 'crm-contacts'
  | 'crm-leads'
  | 'projects'
  | 'tasks'
  | 'finance'
  | 'expenses'
  | 'assets'
  | 'content'
  | 'settings';

export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type ClientStatus = 'Open' | 'Active' | 'Hold' | 'Completed' | 'Declined' | 'Inactive';
export type ClientType = 'Enterprise' | 'Retainer' | 'Project-based' | 'Advisory';

export interface Client {
  clientId: string; // e.g. CLI-001
  clientName: string;
  company: string;
  contactPerson: string;
  primaryContactId?: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  source: string;
  clientStatus: ClientStatus;
  clientType: ClientType;
  firstContactDate: string;
  onboardingDate: string;
  lastContactDate: string;
  nextFollowUp: string;
  totalProjectValue: number; // CALCULATED
  totalAmountPaid: number; // CALCULATED
  outstandingAmount: number; // CALCULATED
  activeProjectsCount?: number;
  notes?: string;
}

export interface Contact {
  contactId: string; // e.g. CON-001
  client: string;
  clientId: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  preferredContactMethod: 'Email' | 'Phone' | 'WhatsApp' | 'Slack';
  notes?: string;
}

export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Discovery'
  | 'Proposal Sent'
  | 'Negotiation'
  | 'Won'
  | 'Lost'
  | 'On Hold';

export interface Lead {
  leadId: string; // e.g. LED-001
  leadName: string;
  company: string;
  contact: string;
  source: string;
  status: LeadStatus;
  estimatedValue: number;
  probability: number; // 0-100%
  weightedValue: number; // CALCULATED
  expectedClose: string;
  nextFollowUp: string;
  assignedTeamMember: string;
  notes?: string;
}

export type ProjectStatus =
  | 'Open Work'
  | 'In Progress'
  | 'Awaiting Client'
  | 'Testing'
  | 'Overdue'
  | 'On Hold'
  | 'Completed'
  | 'Cancelled';

export type ServiceType =
  | 'Web App'
  | 'AI/ML Engineering'
  | 'Mobile App'
  | 'Cloud Infrastructure'
  | 'UI/UX Design'
  | 'Retainer';

export type PaymentStatus = 'Draft' | 'Sent' | 'Partially Paid' | 'Paid' | 'Overdue';

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface Project {
  projectId: string; // e.g. PRJ-001
  projectName: string;
  client: string;
  clientId: string;
  serviceType: ServiceType;
  status: ProjectStatus;
  priority: Priority;
  startDate: string;
  deadline: string;
  progress: number; // 0-100%
  currentPhase: string;
  nextMilestone: string;
  clientDependency: 'None' | 'Assets Pending' | 'Feedback Required' | 'Access Needed' | 'Payment Due';
  paymentStatus: PaymentStatus;
  projectValue: number;
  outstanding: number; // CALCULATED
  repository?: string;
  deploymentUrl?: string;
  projectFolder?: string;
  assignedTeam: string[];
  milestones: Milestone[];
  notes?: string;
}

export type TaskStatus = 'Todo' | 'In Progress' | 'Review' | 'Completed' | 'Overdue';

export interface Task {
  taskId: string; // e.g. TSK-001
  task: string;
  project: string;
  projectId: string;
  client: string;
  category: 'Development' | 'Design' | 'DevOps' | 'Bugfix' | 'QA/Testing' | 'Client Ops' | 'Security';
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  assignedTo: string;
  notes?: string;
}

export type FinanceType = 'Income' | 'Expense' | 'Transfer';

export interface FinanceRecord {
  transactionId: string; // e.g. FIN-001
  date: string;
  type: FinanceType;
  client: string;
  clientId?: string;
  project: string;
  projectId?: string;
  description: string;
  amount: number;
  paymentStatus: PaymentStatus;
  paidDate?: string;
  paymentMethod: string;
}

export type ExpenseCategory =
  | 'Infrastructure & Cloud'
  | 'Software & Licenses'
  | 'Contractor / Agency'
  | 'Operations & Office'
  | 'Marketing & Sales'
  | 'Hardware';

export interface ExpenseRecord {
  expenseId: string; // e.g. EXP-001
  date: string;
  type: 'Operational' | 'Tooling' | 'Infrastructure' | 'Contractor' | 'Admin';
  category: ExpenseCategory;
  description: string;
  vendor: string;
  amount: number;
  frequency: 'One-time' | 'Monthly' | 'Quarterly' | 'Annual';
  monthlyCost: number; // CALCULATED
  renewalDate: string;
  nextDue: string;
  paymentStatus: 'Paid' | 'Pending' | 'Scheduled';
  paymentMethod: string;
  owner: string;
  client?: string;
  project?: string;
}

export type AssetRenewalStatus = '🟢 OK' | '🟡 Renew Soon' | '🔴 Expired';

export interface AssetRecord {
  assetId: string; // e.g. AST-001
  assetType: 'Domain' | 'SSL Certificate' | 'Cloud Infrastructure' | 'SaaS Subscription' | 'Database Instance' | 'Security & Keys';
  assetName: string;
  domainOrAccountName: string;
  ownerType: 'Boaive Internal' | 'Client Owned' | 'Shared';
  client: string;
  clientId?: string;
  project?: string;
  provider: string;
  purchaseDate: string;
  renewalDate: string;
  renewalStatus: AssetRenewalStatus;
  cost: number;
  billingFrequency: 'Annual' | 'Monthly' | 'Multi-Year';
  status: 'Active' | 'Inactive' | 'Pending Transfer';
  loginOrAccountRef: string; // e.g. "Password Manager → Boaive → Domains"
  purpose: string;
  notes?: string;
}

export type ContentStatus = 'Idea' | 'Draft' | 'Review' | 'Scheduled' | 'Published';
export type ContentPlatform = 'LinkedIn' | 'Twitter/X' | 'Blog' | 'Newsletter' | 'YouTube' | 'Case Study';

export interface ContentRecord {
  contentId: string; // e.g. CNT-001
  title: string;
  contentType: 'Case Study' | 'Technical Blog' | 'Social Thread' | 'Newsletter' | 'Video Demo';
  platform: ContentPlatform;
  status: ContentStatus;
  ideaDate: string;
  draftDate?: string;
  scheduledDate: string;
  publishedDate?: string;
  url?: string;
  relatedProject?: string;
  relatedClient?: string;
  contentPillar: 'Engineering Excellence' | 'Product Case Study' | 'Operations Insights' | 'Open Source';
  cta?: string;
  author: string;
  notes?: string;
}

export interface BusinessSettings {
  businessName: string;
  currency: string;
  asOfDate: string;
  dueSoonWindow: number; // days
  followUpWindow: number; // days
  upcomingWindow: number; // days
  renewalWarning: number; // days
}

export interface DropdownOptions {
  clientStatuses: string[];
  clientTypes: string[];
  leadStatuses: string[];
  sources: string[];
  serviceTypes: string[];
  projectStatuses: string[];
  paymentStatuses: string[];
  taskStatuses: string[];
  taskCategories: string[];
  priorities: string[];
  teamMembers: string[];
  expenseCategories: string[];
  contentPlatforms: string[];
  contentStatuses: string[];
}

export interface DataCheckIssue {
  checkName: string;
  status: 'OK' | 'ISSUES';
  count: number;
  details: string[];
}

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'CLIENTS' | 'LEADS' | 'PROJECTS' | 'TASKS' | 'FINANCE' | 'ASSETS';
  targetTab: NavigationTab;
  targetId: string;
  badgeText?: string;
}

export interface AssistantActionCard {
  id: string;
  type: string;
  title: string;
  description: string;
  data?: any;
  executed?: boolean;
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actionCard?: AssistantActionCard;
  suggestedPrompts?: string[];
}

export type NotificationSeverity = 'urgent' | 'warning' | 'info' | 'success';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity: NotificationSeverity;
  category: 'tasks' | 'payments' | 'projects' | 'follow-ups' | 'renewals';
  targetTab: NavigationTab;
  targetId?: string;
}

