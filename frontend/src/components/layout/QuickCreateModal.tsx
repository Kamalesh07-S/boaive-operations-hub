// Boaive Operations Hub - Universal Quick Add Modal

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import {
  Priority,
  LeadStatus,
  ProjectStatus,
  ServiceType,
  PaymentStatus,
  ExpenseCategory,
  ContentPlatform,
  ContentStatus,
  AssetRenewalStatus,
} from '../../types';

export const QuickCreateModal: React.FC = () => {
  const {
    quickAddType,
    closeQuickAdd,
    clients,
    projects,
    dropdowns,
    addLead,
    addClient,
    addContact,
    addProject,
    addTask,
    addFinanceRecord,
    addExpense,
    addAsset,
    addContent,
  } = useApp();

  const [loading, setLoading] = useState(false);

  // Task Form State
  const [taskName, setTaskName] = useState('');
  const [taskProjectId, setTaskProjectId] = useState(projects[0]?.projectId || '');
  const [taskPriority, setTaskPriority] = useState<Priority>('High');
  const [taskCategory, setTaskCategory] = useState<'Development' | 'Design' | 'DevOps' | 'Bugfix' | 'QA/Testing' | 'Client Ops' | 'Security'>('Development');
  const [taskAssignee, setTaskAssignee] = useState('Aarav Sharma');
  const [taskDueDate, setTaskDueDate] = useState('2026-10-05');
  const [taskNotes, setTaskNotes] = useState('');

  // Lead Form State
  const [leadName, setLeadName] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadContact, setLeadContact] = useState('');
  const [leadSource, setLeadSource] = useState('Referral');
  const [leadEstimatedValue, setLeadEstimatedValue] = useState(250000);
  const [leadProbability, setLeadProbability] = useState(70);
  const [leadStatus, setLeadStatus] = useState<LeadStatus>('New');
  const [leadExpectedClose, setLeadExpectedClose] = useState('2026-10-31');
  const [leadFollowUp, setLeadFollowUp] = useState('2026-10-04');
  const [leadAssignedTo, setLeadAssignedTo] = useState('Ananya Verma');
  const [leadNotes, setLeadNotes] = useState('');

  // Project Form State
  const [projName, setProjName] = useState('');
  const [projClientId, setProjClientId] = useState(clients[0]?.clientId || '');
  const [projServiceType, setProjServiceType] = useState<ServiceType>('Web App');
  const [projStatus, setProjStatus] = useState<ProjectStatus>('Open Work');
  const [projPriority, setProjPriority] = useState<Priority>('High');
  const [projStartDate, setProjStartDate] = useState('2026-10-01');
  const [projDeadline, setProjDeadline] = useState('2026-11-15');
  const [projValue, setProjValue] = useState(300000);
  const [projPhase, setProjPhase] = useState('Phase 1: Architecture');
  const [projMilestone, setProjMilestone] = useState('Database Architecture Approval');
  const [projNotes, setProjNotes] = useState('');

  // Finance / Invoice Form State
  const [finDate, setFinDate] = useState('2026-09-30');
  const [finType, setFinType] = useState<'Income' | 'Expense' | 'Transfer'>('Income');
  const [finClientId, setFinClientId] = useState(clients[0]?.clientId || '');
  const [finProjectId, setFinProjectId] = useState(projects[0]?.projectId || '');
  const [finDesc, setFinDesc] = useState('Sprint Retainer & Architecture Milestone');
  const [finAmount, setFinAmount] = useState(85000);
  const [finPaymentStatus, setFinPaymentStatus] = useState<PaymentStatus>('Sent');
  const [finPaymentMethod, setFinPaymentMethod] = useState('Bank Transfer (NEFT)');

  // Client Form State
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientContactPerson, setClientContactPerson] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientLocation, setClientLocation] = useState('Bengaluru, Karnataka');
  const [clientWebsite, setClientWebsite] = useState('https://');
  const [clientSource, setClientSource] = useState('Referral');
  const [clientStatus, setClientStatus] = useState<'Open' | 'Active' | 'Hold' | 'Completed' | 'Declined' | 'Inactive'>('Active');
  const [clientType, setClientType] = useState<'Enterprise' | 'Retainer' | 'Project-based' | 'Advisory'>('Enterprise');
  const [clientFirstContact, setClientFirstContact] = useState('2026-09-01');
  const [clientOnboarding, setClientOnboarding] = useState('2026-09-15');
  const [clientFollowUp, setClientFollowUp] = useState('2026-10-05');
  const [clientNotes, setClientNotes] = useState('');

  // Contact Form State
  const [contName, setContName] = useState('');
  const [contClientId, setContClientId] = useState(clients[0]?.clientId || '');
  const [contRole, setContRole] = useState('Chief Technology Officer');
  const [contEmail, setContEmail] = useState('');
  const [contPhone, setContPhone] = useState('');
  const [contMethod, setContMethod] = useState<'Email' | 'Phone' | 'WhatsApp' | 'Slack'>('Email');
  const [contNotes, setContNotes] = useState('');

  // Expense Form State
  const [expDate, setExpDate] = useState('2026-09-30');
  const [expType, setExpType] = useState<'Operational' | 'Tooling' | 'Infrastructure' | 'Contractor' | 'Admin'>('Infrastructure');
  const [expCategory, setExpCategory] = useState<ExpenseCategory>('Infrastructure & Cloud');
  const [expDesc, setExpDesc] = useState('');
  const [expVendor, setExpVendor] = useState('AWS Cloud Services');
  const [expAmount, setExpAmount] = useState(15000);
  const [expFreq, setExpFreq] = useState<'One-time' | 'Monthly' | 'Quarterly' | 'Annual'>('Monthly');
  const [expRenewal, setExpRenewal] = useState('2026-10-31');
  const [expNextDue, setExpNextDue] = useState('2026-10-05');
  const [expStatus, setExpStatus] = useState<'Paid' | 'Pending' | 'Scheduled'>('Pending');
  const [expMethod, setExpMethod] = useState('Corporate Credit Card');
  const [expOwner, setExpOwner] = useState('Aarav Sharma');

  // Asset Form State
  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState<'Domain' | 'SSL Certificate' | 'Cloud Infrastructure' | 'SaaS Subscription' | 'Database Instance' | 'Security & Keys'>('Domain');
  const [assetDomain, setAssetDomain] = useState('');
  const [assetOwnerType, setAssetOwnerType] = useState<'Boaive Internal' | 'Client Owned' | 'Shared'>('Boaive Internal');
  const [assetClientId, setAssetClientId] = useState('');
  const [assetProvider, setAssetProvider] = useState('Cloudflare');
  const [assetPurchaseDate, setAssetPurchaseDate] = useState('2025-10-01');
  const [assetRenewalDate, setAssetRenewalDate] = useState('2026-10-01');
  const [assetRenewalStatus, setAssetRenewalStatus] = useState<AssetRenewalStatus>('🟢 OK');
  const [assetCost, setAssetCost] = useState(3500);
  const [assetFrequency, setAssetFrequency] = useState<'Annual' | 'Monthly' | 'Multi-Year'>('Annual');
  const [assetStatus, setAssetStatus] = useState<'Active' | 'Inactive' | 'Pending Transfer'>('Active');
  const [assetLoginRef, setAssetLoginRef] = useState('Bitwarden → Operations Vault');
  const [assetPurpose, setAssetPurpose] = useState('Primary Domain & DNS Gateway');
  const [assetNotes, setAssetNotes] = useState('');

  // Content Form State
  const [cntTitle, setCntTitle] = useState('');
  const [cntType, setCntType] = useState<'Case Study' | 'Technical Blog' | 'Social Thread' | 'Newsletter' | 'Video Demo'>('Technical Blog');
  const [cntPlatform, setCntPlatform] = useState<ContentPlatform>('LinkedIn');
  const [cntStatus, setCntStatus] = useState<ContentStatus>('Draft');
  const [cntIdeaDate, setCntIdeaDate] = useState('2026-09-30');
  const [cntScheduledDate, setCntScheduledDate] = useState('2026-10-10');
  const [cntPillar, setCntPillar] = useState<'Engineering Excellence' | 'Product Case Study' | 'Operations Insights' | 'Open Source'>('Engineering Excellence');
  const [cntAuthor, setCntAuthor] = useState('Ananya Verma');
  const [cntNotes, setCntNotes] = useState('');

  if (!quickAddType) return null;

  const getTitle = () => {
    switch (quickAddType) {
      case 'task': return 'Create Operation Task';
      case 'lead': return 'Add CRM Sales Lead';
      case 'project': return 'Create Client Project';
      case 'client': return 'Add Client Organization';
      case 'contact': return 'Add Client Contact Person';
      case 'finance': return 'Record Financial Transaction / Invoice';
      case 'expense': return 'Add Operational Expense';
      case 'asset': return 'Register Technical / Domain Asset';
      case 'content': return 'Schedule Content Item';
      default: return 'Quick Add Entry';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (quickAddType === 'task') {
        const selectedProj = projects.find((p) => p.projectId === taskProjectId);
        await addTask({
          task: taskName,
          project: selectedProj ? selectedProj.projectName : 'General Operations',
          projectId: taskProjectId,
          client: selectedProj ? selectedProj.client : 'Boaive Internal',
          category: taskCategory,
          priority: taskPriority,
          status: 'Todo',
          dueDate: taskDueDate,
          assignedTo: taskAssignee,
          notes: taskNotes,
        });
      } else if (quickAddType === 'lead') {
        await addLead({
          leadName,
          company: leadCompany,
          contact: leadContact,
          source: leadSource,
          status: leadStatus,
          estimatedValue: Number(leadEstimatedValue) || 0,
          probability: Number(leadProbability) || 50,
          expectedClose: leadExpectedClose,
          nextFollowUp: leadFollowUp,
          assignedTeamMember: leadAssignedTo,
          notes: leadNotes,
        });
      } else if (quickAddType === 'project') {
        const selectedClient = clients.find((c) => c.clientId === projClientId);
        await addProject({
          projectName: projName,
          client: selectedClient ? selectedClient.clientName : 'Client',
          clientId: projClientId,
          serviceType: projServiceType,
          status: projStatus,
          priority: projPriority,
          startDate: projStartDate,
          deadline: projDeadline,
          progress: 0,
          currentPhase: projPhase,
          nextMilestone: projMilestone,
          clientDependency: 'None',
          paymentStatus: 'Draft',
          projectValue: Number(projValue) || 0,
          assignedTeam: ['Aarav Sharma', 'Priya Iyer'],
          milestones: [
            { id: 'm1', title: projMilestone, dueDate: projDeadline, completed: false }
          ],
          notes: projNotes,
        });
      } else if (quickAddType === 'client') {
        await addClient({
          clientName,
          company: clientCompany || clientName,
          contactPerson: clientContactPerson,
          email: clientEmail,
          phone: clientPhone,
          location: clientLocation,
          website: clientWebsite,
          source: clientSource,
          clientStatus,
          clientType,
          firstContactDate: clientFirstContact,
          onboardingDate: clientOnboarding,
          lastContactDate: clientFirstContact,
          nextFollowUp: clientFollowUp,
          notes: clientNotes,
        });
      } else if (quickAddType === 'contact') {
        const selectedClient = clients.find((c) => c.clientId === contClientId);
        await addContact({
          client: selectedClient ? selectedClient.clientName : 'Client',
          clientId: contClientId,
          name: contName,
          role: contRole,
          email: contEmail,
          phone: contPhone,
          preferredContactMethod: contMethod,
          notes: contNotes,
        });
      } else if (quickAddType === 'finance') {
        const selectedClient = clients.find((c) => c.clientId === finClientId);
        const selectedProj = projects.find((p) => p.projectId === finProjectId);
        await addFinanceRecord({
          date: finDate,
          type: finType,
          client: selectedClient ? selectedClient.clientName : 'Client',
          clientId: finClientId,
          project: selectedProj ? selectedProj.projectName : 'General',
          projectId: finProjectId,
          description: finDesc,
          amount: Number(finAmount) || 0,
          paymentStatus: finPaymentStatus,
          paymentMethod: finPaymentMethod,
        });
      } else if (quickAddType === 'expense') {
        await addExpense({
          date: expDate,
          type: expType,
          category: expCategory,
          description: expDesc,
          vendor: expVendor,
          amount: Number(expAmount) || 0,
          frequency: expFreq,
          renewalDate: expRenewal,
          nextDue: expNextDue,
          paymentStatus: expStatus,
          paymentMethod: expMethod,
          owner: expOwner,
        });
      } else if (quickAddType === 'asset') {
        const selectedClient = clients.find((c) => c.clientId === assetClientId);
        await addAsset({
          assetName,
          assetType,
          domainOrAccountName: assetDomain,
          ownerType: assetOwnerType,
          client: selectedClient ? selectedClient.clientName : 'Boaive Internal',
          clientId: assetClientId || undefined,
          provider: assetProvider,
          purchaseDate: assetPurchaseDate,
          renewalDate: assetRenewalDate,
          renewalStatus: assetRenewalStatus,
          cost: Number(assetCost) || 0,
          billingFrequency: assetFrequency,
          status: assetStatus,
          loginOrAccountRef: assetLoginRef,
          purpose: assetPurpose,
          notes: assetNotes,
        });
      } else if (quickAddType === 'content') {
        await addContent({
          title: cntTitle,
          contentType: cntType,
          platform: cntPlatform,
          status: cntStatus,
          ideaDate: cntIdeaDate,
          scheduledDate: cntScheduledDate,
          contentPillar: cntPillar,
          author: cntAuthor,
          notes: cntNotes,
        });
      }

      closeQuickAdd();
    } catch (err) {
      console.error('Failed to create item:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={!!quickAddType}
      onClose={closeQuickAdd}
      title={getTitle()}
      subtitle="Data will be saved into local storage state and immediately reflected across all views."
      maxWidth="680px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* TASK FORM */}
        {quickAddType === 'task' && (
          <>
            <div className="form-group">
              <label className="form-label">Task Description / Title *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Implement OAuth2 refresh token rotation"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
            </div>

            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Associated Project</label>
                <select
                  className="form-input"
                  value={taskProjectId}
                  onChange={(e) => setTaskProjectId(e.target.value)}
                >
                  {projects.map((p) => (
                    <option key={p.projectId} value={p.projectId}>
                      {p.projectName} ({p.client})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-input"
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value as any)}
                >
                  {dropdowns.taskCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid-cols-3">
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-input"
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as Priority)}
                >
                  {dropdowns.priorities.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Assigned To</label>
                <select
                  className="form-input"
                  value={taskAssignee}
                  onChange={(e) => setTaskAssignee(e.target.value)}
                >
                  {dropdowns.teamMembers.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Operational Notes</label>
              <textarea
                className="form-input"
                rows={2}
                placeholder="Technical instructions or context"
                value={taskNotes}
                onChange={(e) => setTaskNotes(e.target.value)}
              />
            </div>
          </>
        )}

        {/* LEAD FORM */}
        {quickAddType === 'lead' && (
          <>
            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Lead Opportunity Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Apex Omnichannel AI Platform"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Company / Client *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Apex Global Ltd"
                  value={leadCompany}
                  onChange={(e) => setLeadCompany(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Contact Person</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Rahul Kapoor (VP Eng)"
                  value={leadContact}
                  onChange={(e) => setLeadContact(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Acquisition Source</label>
                <select
                  className="form-input"
                  value={leadSource}
                  onChange={(e) => setLeadSource(e.target.value)}
                >
                  {dropdowns.sources.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid-cols-3">
              <div className="form-group">
                <label className="form-label">Est. Value (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={leadEstimatedValue}
                  onChange={(e) => setLeadEstimatedValue(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Probability (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  className="form-input"
                  value={leadProbability}
                  onChange={(e) => setLeadProbability(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status Stage</label>
                <select
                  className="form-input"
                  value={leadStatus}
                  onChange={(e) => setLeadStatus(e.target.value as LeadStatus)}
                >
                  {dropdowns.leadStatuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid-cols-3">
              <div className="form-group">
                <label className="form-label">Expected Close</label>
                <input
                  type="date"
                  className="form-input"
                  value={leadExpectedClose}
                  onChange={(e) => setLeadExpectedClose(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Next Follow-Up</label>
                <input
                  type="date"
                  className="form-input"
                  value={leadFollowUp}
                  onChange={(e) => setLeadFollowUp(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Assigned Owner</label>
                <select
                  className="form-input"
                  value={leadAssignedTo}
                  onChange={(e) => setLeadAssignedTo(e.target.value)}
                >
                  {dropdowns.teamMembers.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        {/* PROJECT FORM */}
        {quickAddType === 'project' && (
          <>
            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Project Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Telemedicine Mobile Portal"
                  value={projName}
                  onChange={(e) => setProjName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Client *</label>
                <select
                  className="form-input"
                  value={projClientId}
                  onChange={(e) => setProjClientId(e.target.value)}
                >
                  {clients.map((c) => (
                    <option key={c.clientId} value={c.clientId}>
                      {c.clientName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid-cols-3">
              <div className="form-group">
                <label className="form-label">Service Type</label>
                <select
                  className="form-input"
                  value={projServiceType}
                  onChange={(e) => setProjServiceType(e.target.value as ServiceType)}
                >
                  {dropdowns.serviceTypes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-input"
                  value={projStatus}
                  onChange={(e) => setProjStatus(e.target.value as ProjectStatus)}
                >
                  {dropdowns.projectStatuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-input"
                  value={projPriority}
                  onChange={(e) => setProjPriority(e.target.value as Priority)}
                >
                  {dropdowns.priorities.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid-cols-3">
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={projStartDate}
                  onChange={(e) => setProjStartDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Target Deadline</label>
                <input
                  type="date"
                  className="form-input"
                  value={projDeadline}
                  onChange={(e) => setProjDeadline(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Total Value (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={projValue}
                  onChange={(e) => setProjValue(Number(e.target.value))}
                />
              </div>
            </div>
          </>
        )}

        {/* CLIENT FORM */}
        {quickAddType === 'client' && (
          <>
            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Client Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Nexus Healthcare Systems"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Legal Registered Entity</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Nexus Health Pvt Ltd"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-cols-3">
              <div className="form-group">
                <label className="form-label">Primary Contact Person</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Dr. Vikram Sethi"
                  value={clientContactPerson}
                  onChange={(e) => setClientContactPerson(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="contact@nexushealth.in"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+91 98201 44521"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-cols-3">
              <div className="form-group">
                <label className="form-label">Relationship Status</label>
                <select
                  className="form-input"
                  value={clientStatus}
                  onChange={(e) => setClientStatus(e.target.value as any)}
                >
                  {dropdowns.clientStatuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Client Type</label>
                <select
                  className="form-input"
                  value={clientType}
                  onChange={(e) => setClientType(e.target.value as any)}
                >
                  {dropdowns.clientTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Next Follow-Up</label>
                <input
                  type="date"
                  className="form-input"
                  value={clientFollowUp}
                  onChange={(e) => setClientFollowUp(e.target.value)}
                />
              </div>
            </div>
          </>
        )}

        {/* CONTACT FORM */}
        {quickAddType === 'contact' && (
          <>
            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Contact Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={contName}
                  onChange={(e) => setContName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Client Account *</label>
                <select
                  className="form-input"
                  value={contClientId}
                  onChange={(e) => setContClientId(e.target.value)}
                >
                  {clients.map((c) => (
                    <option key={c.clientId} value={c.clientId}>
                      {c.clientName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid-cols-3">
              <div className="form-group">
                <label className="form-label">Designation / Role</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. VP Engineering"
                  value={contRole}
                  onChange={(e) => setContRole(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="priya@company.com"
                  value={contEmail}
                  onChange={(e) => setContEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={contPhone}
                  onChange={(e) => setContPhone(e.target.value)}
                />
              </div>
            </div>
          </>
        )}

        {/* FINANCE / TRANSACTION FORM */}
        {quickAddType === 'finance' && (
          <>
            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Description / Milestone *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Architecture Retainer Sprint 4"
                  value={finDesc}
                  onChange={(e) => setFinDesc(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Transaction Type</label>
                <select
                  className="form-input"
                  value={finType}
                  onChange={(e) => setFinType(e.target.value as any)}
                >
                  <option value="Income">Income (Receivable)</option>
                  <option value="Expense">Expense</option>
                  <option value="Transfer">Transfer</option>
                </select>
              </div>
            </div>

            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Client</label>
                <select
                  className="form-input"
                  value={finClientId}
                  onChange={(e) => setFinClientId(e.target.value)}
                >
                  {clients.map((c) => (
                    <option key={c.clientId} value={c.clientId}>{c.clientName}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Project</label>
                <select
                  className="form-input"
                  value={finProjectId}
                  onChange={(e) => setFinProjectId(e.target.value)}
                >
                  {projects.map((p) => (
                    <option key={p.projectId} value={p.projectId}>{p.projectName}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid-cols-3">
              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={finAmount}
                  onChange={(e) => setFinAmount(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Payment Status</label>
                <select
                  className="form-input"
                  value={finPaymentStatus}
                  onChange={(e) => setFinPaymentStatus(e.target.value as PaymentStatus)}
                >
                  {dropdowns.paymentStatuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <input
                  type="text"
                  className="form-input"
                  value={finPaymentMethod}
                  onChange={(e) => setFinPaymentMethod(e.target.value)}
                />
              </div>
            </div>
          </>
        )}

        {/* EXPENSE FORM */}
        {quickAddType === 'expense' && (
          <>
            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Expense Description *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. AWS Production EC2 Cluster"
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Vendor / Service *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Amazon Web Services"
                  value={expVendor}
                  onChange={(e) => setExpVendor(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-cols-3">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-input"
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value as ExpenseCategory)}
                >
                  {dropdowns.expenseCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={expAmount}
                  onChange={(e) => setExpAmount(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Billing Frequency</label>
                <select
                  className="form-input"
                  value={expFreq}
                  onChange={(e) => setExpFreq(e.target.value as any)}
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Annual">Annual</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="One-time">One-time</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* ASSET FORM */}
        {quickAddType === 'asset' && (
          <>
            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Asset Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. boaive.com Main Domain"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Asset Type</label>
                <select
                  className="form-input"
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value as any)}
                >
                  <option value="Domain">Domain</option>
                  <option value="SSL Certificate">SSL Certificate</option>
                  <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                  <option value="SaaS Subscription">SaaS Subscription</option>
                  <option value="Database Instance">Database Instance</option>
                  <option value="Security & Keys">Security & Keys</option>
                </select>
              </div>
            </div>

            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Domain / Host Identifier</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. api.boaive.com"
                  value={assetDomain}
                  onChange={(e) => setAssetDomain(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Provider</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Cloudflare / Namecheap"
                  value={assetProvider}
                  onChange={(e) => setAssetProvider(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-cols-3">
              <div className="form-group">
                <label className="form-label">Renewal Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={assetRenewalDate}
                  onChange={(e) => setAssetRenewalDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Cost (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={assetCost}
                  onChange={(e) => setAssetCost(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Ownership</label>
                <select
                  className="form-input"
                  value={assetOwnerType}
                  onChange={(e) => setAssetOwnerType(e.target.value as any)}
                >
                  <option value="Boaive Internal">Boaive Internal</option>
                  <option value="Client Owned">Client Owned</option>
                  <option value="Shared">Shared</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* CONTENT FORM */}
        {quickAddType === 'content' && (
          <>
            <div className="form-group">
              <label className="form-label">Content Piece Title *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. How we scaled Redis clusters for 50k ops/sec"
                value={cntTitle}
                onChange={(e) => setCntTitle(e.target.value)}
              />
            </div>

            <div className="grid-cols-3">
              <div className="form-group">
                <label className="form-label">Format Type</label>
                <select
                  className="form-input"
                  value={cntType}
                  onChange={(e) => setCntType(e.target.value as any)}
                >
                  <option value="Technical Blog">Technical Blog</option>
                  <option value="Case Study">Case Study</option>
                  <option value="Social Thread">Social Thread</option>
                  <option value="Newsletter">Newsletter</option>
                  <option value="Video Demo">Video Demo</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Platform</label>
                <select
                  className="form-input"
                  value={cntPlatform}
                  onChange={(e) => setCntPlatform(e.target.value as ContentPlatform)}
                >
                  {dropdowns.contentPlatforms.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-input"
                  value={cntStatus}
                  onChange={(e) => setCntStatus(e.target.value as ContentStatus)}
                >
                  {dropdowns.contentStatuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Scheduled Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={cntScheduledDate}
                  onChange={(e) => setCntScheduledDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Author</label>
                <select
                  className="form-input"
                  value={cntAuthor}
                  onChange={(e) => setCntAuthor(e.target.value)}
                >
                  {dropdowns.teamMembers.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={closeQuickAdd}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
            {loading ? 'Saving...' : 'Save & Add Entry'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
