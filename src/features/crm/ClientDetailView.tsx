// Boaive Operations Hub - Client Overview Dedicated Workspace

import React, { useState } from 'react';
import {
  Users,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Layers,
  CheckSquare,
  Receipt,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';

interface ClientDetailViewProps {
  clientId: string;
  onBack: () => void;
}

export const ClientDetailView: React.FC<ClientDetailViewProps> = ({ clientId, onBack }) => {
  const { clients, projects, tasks, finance, contacts, navigateAndFocus, openQuickAdd } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'contacts' | 'payments' | 'tasks'>('overview');

  const client = clients.find((c) => c.clientId === clientId);

  if (!client) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <h3>Client not found</h3>
        <button className="btn btn-secondary btn-sm" onClick={onBack} style={{ marginTop: '16px' }}>
          Back to Client Directory
        </button>
      </div>
    );
  }

  // Filter linked records for this client
  const clientProjects = projects.filter((p) => p.clientId === client.clientId || p.client === client.clientName);
  const clientTasks = tasks.filter((t) => t.client === client.clientName || clientProjects.some((p) => p.projectId === t.projectId));
  const clientFinance = finance.filter((f) => f.clientId === client.clientId || f.client === client.clientName);
  const clientContacts = contacts.filter((c) => c.clientId === client.clientId || c.client === client.clientName);

  const tabs = [
    { id: 'overview', label: 'Client Overview' },
    { id: 'projects', label: 'Projects', count: clientProjects.length },
    { id: 'contacts', label: 'Contacts', count: clientContacts.length },
    { id: 'payments', label: 'Financial Records', count: clientFinance.length },
    { id: 'tasks', label: 'Tasks', count: clientTasks.length },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn btn-secondary btn-sm" onClick={onBack}>
            ← Back to Directory
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--brand-accent)' }}>
                {client.clientId}
              </span>
              <StatusBadge status={client.clientStatus} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {client.clientName}
            </h2>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => openQuickAdd('project')}>
            <Plus size={14} />
            <span>New Project</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => openQuickAdd('finance')}>
            <Receipt size={14} />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`btn btn-sm ${activeTab === t.id ? 'btn-secondary' : 'btn-ghost'}`}
            style={{ fontWeight: activeTab === t.id ? 700 : 500 }}
          >
            {t.label} {t.count !== undefined && <span className="badge badge-neutral" style={{ marginLeft: '4px' }}>{t.count}</span>}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid-cols-2" style={{ gap: '20px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Organization Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Building2 size={16} color="var(--text-muted)" />
                <span style={{ color: 'var(--text-muted)', width: '120px' }}>Entity Name:</span>
                <span style={{ fontWeight: 600 }}>{client.company}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={16} color="var(--text-muted)" />
                <span style={{ color: 'var(--text-muted)', width: '120px' }}>Location:</span>
                <span>{client.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Globe size={16} color="var(--text-muted)" />
                <span style={{ color: 'var(--text-muted)', width: '120px' }}>Website:</span>
                <a href={client.website} target="_blank" rel="noreferrer" style={{ color: 'var(--brand-accent)' }}>
                  {client.website}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={16} color="var(--text-muted)" />
                <span style={{ color: 'var(--text-muted)', width: '120px' }}>Onboarding Date:</span>
                <span>{client.onboardingDate}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Users size={16} color="var(--text-muted)" />
                <span style={{ color: 'var(--text-muted)', width: '120px' }}>Relationship:</span>
                <span className="badge badge-purple">{client.clientType}</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Financial Health Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Total Project Value</span>
                <span style={{ fontWeight: 800, fontSize: '16px' }}>₹{client.totalProjectValue.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Total Amount Paid</span>
                <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--success)' }}>₹{client.totalAmountPaid.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Outstanding Balance</span>
                <span style={{ fontWeight: 800, fontSize: '15px', color: client.outstandingAmount > 0 ? 'var(--danger)' : 'var(--success)' }}>
                  ₹{client.outstandingAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Project Name</th>
                <th>Service Type</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {clientProjects.map((p) => (
                <tr key={p.projectId} onClick={() => navigateAndFocus('projects', p.projectId)} style={{ cursor: 'pointer' }}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{p.projectId}</td>
                  <td style={{ fontWeight: 700 }}>{p.projectName}</td>
                  <td><span className="badge badge-neutral">{p.serviceType}</span></td>
                  <td><StatusBadge status={p.status} /></td>
                  <td>{p.progress}%</td>
                  <td style={{ fontWeight: 600 }}>₹{p.projectValue.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Contacts Tab */}
      {activeTab === 'contacts' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Preferred Method</th>
              </tr>
            </thead>
            <tbody>
              {clientContacts.map((c) => (
                <tr key={c.contactId}>
                  <td style={{ fontWeight: 700 }}>{c.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{c.role}</td>
                  <td><a href={`mailto:${c.email}`} style={{ color: 'var(--brand-accent)' }}>{c.email}</a></td>
                  <td>{c.phone}</td>
                  <td><span className="badge badge-neutral">{c.preferredContactMethod}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {clientFinance.map((f) => (
                <tr key={f.transactionId}>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{f.transactionId}</td>
                  <td>{f.date}</td>
                  <td style={{ fontWeight: 600 }}>{f.description}</td>
                  <td style={{ fontWeight: 700 }}>₹{f.amount.toLocaleString('en-IN')}</td>
                  <td><StatusBadge status={f.paymentStatus} /></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{f.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Task ID</th>
                <th>Task Description</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Assigned To</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {clientTasks.map((t) => (
                <tr key={t.taskId}>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{t.taskId}</td>
                  <td style={{ fontWeight: 600 }}>{t.task}</td>
                  <td><span className="badge badge-neutral">{t.category}</span></td>
                  <td><PriorityBadge priority={t.priority} /></td>
                  <td>{t.assignedTo}</td>
                  <td><StatusBadge status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
