// src/validators/index.ts - All Zod validation schemas

import { z } from 'zod';

// ─── Shared ────────────────────────────────────────────────────────────────

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  clientId: z.string().optional(),
  projectId: z.string().optional(),
});

// ─── Auth ────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// ─── Client ─────────────────────────────────────────────────────────────────

export const createClientSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  company: z.string().min(1, 'Company is required'),
  contactPerson: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  source: z.string().optional(),
  clientStatus: z.enum(['Open', 'Active', 'Hold', 'Completed', 'Declined', 'Inactive']).optional(),
  clientType: z.enum(['Enterprise', 'Retainer', 'Project_based', 'Advisory']).optional(),
  firstContactDate: z.string().datetime().optional().or(z.literal('')),
  onboardingDate: z.string().datetime().optional().or(z.literal('')),
  lastContactDate: z.string().datetime().optional().or(z.literal('')),
  nextFollowUp: z.string().datetime().optional().or(z.literal('')),
  notes: z.string().optional(),
});

export const updateClientSchema = createClientSchema.partial();

// ─── Contact ─────────────────────────────────────────────────────────────────

export const createContactSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  name: z.string().min(1, 'Name is required'),
  role: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  preferredContactMethod: z.enum(['Email', 'Phone', 'WhatsApp', 'Slack']).optional(),
  notes: z.string().optional(),
});

export const updateContactSchema = createContactSchema.partial().omit({ clientId: true });

// ─── Lead ─────────────────────────────────────────────────────────────────────

export const createLeadSchema = z.object({
  leadName: z.string().min(1, 'Lead name is required'),
  company: z.string().optional(),
  contactId: z.string().optional(),
  clientId: z.string().optional(),
  source: z.string().optional(),
  status: z.enum(['New', 'Contacted', 'Discovery', 'Proposal_Sent', 'Negotiation', 'Won', 'Lost', 'On_Hold']).optional(),
  estimatedValue: z.number().min(0).optional(),
  probability: z.number().int().min(0).max(100).optional(),
  expectedCloseDate: z.string().datetime().optional().or(z.literal('')),
  nextFollowUp: z.string().datetime().optional().or(z.literal('')),
  assignedTo: z.string().optional(),
  notes: z.string().optional(),
});

export const updateLeadSchema = createLeadSchema.partial();

// ─── Project ─────────────────────────────────────────────────────────────────

export const createProjectSchema = z.object({
  projectName: z.string().min(1, 'Project name is required'),
  clientId: z.string().min(1, 'Client ID is required'),
  serviceType: z.enum(['Web_App', 'AI_ML_Engineering', 'Mobile_App', 'Cloud_Infrastructure', 'UI_UX_Design', 'Retainer']).optional(),
  status: z.enum(['Open_Work', 'In_Progress', 'Awaiting_Client', 'Testing', 'Overdue', 'On_Hold', 'Completed', 'Cancelled']).optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).optional(),
  startDate: z.string().datetime().optional().or(z.literal('')),
  deadline: z.string().datetime().optional().or(z.literal('')),
  progress: z.number().int().min(0).max(100).optional(),
  currentPhase: z.string().optional(),
  nextMilestone: z.string().optional(),
  clientDependency: z.enum(['None', 'Assets_Pending', 'Feedback_Required', 'Access_Needed', 'Payment_Due']).optional(),
  paymentStatus: z.enum(['Draft', 'Sent', 'Partially_Paid', 'Paid', 'Overdue', 'Cancelled']).optional(),
  projectValue: z.number().min(0).optional(),
  repositoryUrl: z.string().url().optional().or(z.literal('')),
  deploymentUrl: z.string().url().optional().or(z.literal('')),
  projectFolder: z.string().optional(),
  assignedTeam: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const updateProjectSchema = createProjectSchema.partial().omit({ clientId: true });

// ─── Task ─────────────────────────────────────────────────────────────────────

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  projectId: z.string().optional(),
  clientId: z.string().optional(),
  category: z.enum(['Development', 'Design', 'DevOps', 'Bugfix', 'QA_Testing', 'Client_Ops', 'Security']).optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).optional(),
  status: z.enum(['Todo', 'In_Progress', 'Review', 'Completed', 'Overdue']).optional(),
  dueDate: z.string().datetime().optional().or(z.literal('')),
  assignedTo: z.string().optional(),
  notes: z.string().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

// ─── Finance ─────────────────────────────────────────────────────────────────

export const createFinanceSchema = z.object({
  date: z.string().datetime().optional(),
  type: z.enum(['Income', 'Expense', 'Transfer']),
  clientId: z.string().optional(),
  projectId: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  amount: z.number().min(0),
  paymentStatus: z.enum(['Draft', 'Sent', 'Partially_Paid', 'Paid', 'Overdue', 'Cancelled']).optional(),
  paidDate: z.string().datetime().optional().or(z.literal('')),
  paymentMethod: z.string().optional(),
});

export const updateFinanceSchema = createFinanceSchema.partial();

// ─── Invoice ─────────────────────────────────────────────────────────────────

export const createInvoiceSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  projectId: z.string().optional(),
  issueDate: z.string().datetime().optional(),
  dueDate: z.string().datetime().optional().or(z.literal('')),
  subtotal: z.number().min(0),
  tax: z.number().min(0).optional().default(0),
  discount: z.number().min(0).optional().default(0),
  amountPaid: z.number().min(0).optional().default(0),
  status: z.enum(['Draft', 'Sent', 'Partially_Paid', 'Paid', 'Overdue', 'Cancelled']).optional(),
  notes: z.string().optional(),
});

export const updateInvoiceSchema = createInvoiceSchema.partial().omit({ clientId: true });

// ─── Expense ─────────────────────────────────────────────────────────────────

export const createExpenseSchema = z.object({
  date: z.string().datetime().optional(),
  type: z.enum(['Operational', 'Tooling', 'Infrastructure', 'Contractor', 'Admin']).optional(),
  category: z.enum(['Infrastructure_Cloud', 'Software_Licenses', 'Contractor_Agency', 'Operations_Office', 'Marketing_Sales', 'Hardware']).optional(),
  description: z.string().min(1, 'Description is required'),
  vendor: z.string().optional(),
  amount: z.number().min(0),
  frequency: z.enum(['One_time', 'Monthly', 'Quarterly', 'Annual']).optional(),
  renewalDate: z.string().datetime().optional().or(z.literal('')),
  nextDue: z.string().datetime().optional().or(z.literal('')),
  paymentStatus: z.enum(['Paid', 'Pending', 'Scheduled']).optional(),
  paymentMethod: z.string().optional(),
  ownerId: z.string().optional(),
  clientId: z.string().optional(),
  projectId: z.string().optional(),
  notes: z.string().optional(),
});

export const updateExpenseSchema = createExpenseSchema.partial();

// ─── Asset ─────────────────────────────────────────────────────────────────

export const createAssetSchema = z.object({
  assetType: z.enum(['Domain', 'SSL_Certificate', 'Cloud_Infrastructure', 'SaaS_Subscription', 'Database_Instance', 'Security_Keys']).optional(),
  assetName: z.string().min(1, 'Asset name is required'),
  domainOrAccountName: z.string().optional(),
  ownerType: z.enum(['Boaive_Internal', 'Client_Owned', 'Shared']).optional(),
  clientId: z.string().optional(),
  projectId: z.string().optional(),
  provider: z.string().optional(),
  purchaseDate: z.string().datetime().optional().or(z.literal('')),
  renewalDate: z.string().datetime().optional().or(z.literal('')),
  cost: z.number().min(0).optional(),
  billingFrequency: z.enum(['Annual', 'Monthly', 'Multi_Year']).optional(),
  status: z.enum(['Active', 'Inactive', 'Pending_Transfer']).optional(),
  accountReference: z.string().optional(),
  purpose: z.string().optional(),
  notes: z.string().optional(),
});

export const updateAssetSchema = createAssetSchema.partial();

// ─── Content ─────────────────────────────────────────────────────────────────

export const createContentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  contentType: z.enum(['Case_Study', 'Technical_Blog', 'Social_Thread', 'Newsletter', 'Video_Demo']).optional(),
  platform: z.enum(['LinkedIn', 'Twitter_X', 'Blog', 'Newsletter', 'YouTube', 'Case_Study']).optional(),
  status: z.enum(['Idea', 'Draft', 'Review', 'Scheduled', 'Published']).optional(),
  ideaDate: z.string().datetime().optional().or(z.literal('')),
  draftDate: z.string().datetime().optional().or(z.literal('')),
  scheduledDate: z.string().datetime().optional().or(z.literal('')),
  publishedDate: z.string().datetime().optional().or(z.literal('')),
  url: z.string().url().optional().or(z.literal('')),
  clientId: z.string().optional(),
  projectId: z.string().optional(),
  contentPillar: z.enum(['Engineering_Excellence', 'Product_Case_Study', 'Operations_Insights', 'Open_Source']).optional(),
  cta: z.string().optional(),
  author: z.string().optional(),
  notes: z.string().optional(),
});

export const updateContentSchema = createContentSchema.partial();
