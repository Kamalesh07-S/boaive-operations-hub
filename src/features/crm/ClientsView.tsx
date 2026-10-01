// Boaive Operations Hub - CRM Clients Directory

import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  ChevronRight,
  Building2,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/Badge';

export const ClientsView: React.FC = () => {
  const { clients, selectedClientId, setSelectedClientId, openQuickAdd } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  if (selectedClientId) {
    // Inline detail panel
    const client = clients.find((c) => c.clientId === selectedClientId);
    if (client) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setSelectedClientId(null)}>
              ← Back
            </button>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{client.clientId}</span>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>{client.clientName}</h2>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{client.company} · {client.location}</div>
            </div>
            <StatusBadge status={client.clientStatus} />
          </div>

          <div className="grid-cols-2" style={{ gap: '16px' }}>
            <div className="card" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '14px', textTransform: 'uppercase' }}>Contact Information</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <div><span style={{ color: 'var(--text-muted)' }}>Contact:</span> <span style={{ fontWeight: 600 }}>{client.contactPerson}</span></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Email:</span> <a href={`mailto:${client.email}`} style={{ color: 'var(--brand-accent)' }}>{client.email}</a></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Phone:</span> <span>{client.phone}</span></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Website:</span> <a href={client.website} style={{ color: 'var(--brand-accent)' }} target="_blank" rel="noopener noreferrer">{client.website}</a></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Source:</span> <span>{client.source}</span></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Type:</span> <span className="badge badge-neutral">{client.clientType}</span></div>
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '14px', textTransform: 'uppercase' }}>Financial Overview</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Project Value</span>
                  <span style={{ fontWeight: 800, fontSize: '16px' }}>₹{client.totalProjectValue.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Amount Paid</span>
                  <span style={{ fontWeight: 700, color: 'var(--success-text)' }}>₹{client.totalAmountPaid.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Outstanding</span>
                  <span style={{ fontWeight: 700, color: client.outstandingAmount > 0 ? 'var(--danger-text)' : 'var(--text-muted)' }}>
                    ₹{client.outstandingAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <div>Onboarded: {client.onboardingDate}</div>
                  <div>Last Contact: {client.lastContactDate}</div>
                  <div>Next Follow-up: <strong style={{ color: 'var(--text-primary)' }}>{client.nextFollowUp}</strong></div>
                </div>
              </div>
            </div>
          </div>

          {client.notes && (
            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Notes</div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{client.notes}</p>
            </div>
          )}
        </div>
      );
    }
  }

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.clientStatus === statusFilter;
    const matchesType = typeFilter === 'ALL' || c.clientType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalAccountValue = clients.reduce((sum, c) => sum + c.totalProjectValue, 0);
  const totalOutstanding = clients.reduce((sum, c) => sum + c.outstandingAmount, 0);
  const activeCount = clients.filter((c) => c.clientStatus === 'Active').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
            Client Accounts &amp; Retainers
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Enterprise directory, contract values, project delivery and payment status
          </p>
        </div>
        <button onClick={() => openQuickAdd('client')} className="btn btn-primary btn-sm">
          <Plus size={15} />
          <span>Add Client</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid-cols-3">
        <div className="card" style={{ padding: '14px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Building2 size={14} color="var(--brand-accent)" />
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Active Clients</div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>{activeCount}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{clients.length} total accounts</div>
        </div>
        <div className="card" style={{ padding: '14px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <TrendingUp size={14} color="var(--success)" />
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Account Value</div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
            ₹{(totalAccountValue / 100000).toFixed(1)}L
          </div>
        </div>
        <div className="card" style={{ padding: '14px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <AlertCircle size={14} color={totalOutstanding > 0 ? 'var(--danger)' : 'var(--text-muted)'} />
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Outstanding</div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: totalOutstanding > 0 ? 'var(--danger-text)' : 'var(--text-primary)' }}>
            ₹{totalOutstanding.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          backgroundColor: 'var(--bg-card)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search clients by name, company, contact, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ padding: '6px 10px', fontSize: '13px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Filter size={14} color="var(--text-muted)" />
          <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '6px 10px', fontSize: '12px', width: '140px' }}>
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Hold">On Hold</option>
            <option value="Completed">Completed</option>
            <option value="Inactive">Inactive</option>
            <option value="Declined">Declined</option>
          </select>
          <select className="form-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ padding: '6px 10px', fontSize: '12px', width: '150px' }}>
            <option value="ALL">All Types</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Retainer">Retainer</option>
            <option value="Project-based">Project-based</option>
            <option value="Advisory">Advisory</option>
          </select>
        </div>
      </div>

      {/* Clients Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Client ID</th>
              <th>Client Name</th>
              <th>Type</th>
              <th>Contact Person</th>
              <th>Location</th>
              <th>Total Value</th>
              <th>Outstanding</th>
              <th>Next Follow-up</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Detail</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>
                  No clients match your search.
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => (
                <tr
                  key={client.clientId}
                  onClick={() => setSelectedClientId(client.clientId)}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '11px' }}>{client.clientId}</td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{client.clientName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{client.company}</div>
                  </td>
                  <td><span className="badge badge-neutral">{client.clientType}</span></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{client.contactPerson}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{client.location}</td>
                  <td style={{ fontWeight: 800 }}>₹{client.totalProjectValue.toLocaleString('en-IN')}</td>
                  <td style={{ fontWeight: 700, color: client.outstandingAmount > 0 ? 'var(--danger-text)' : 'var(--text-muted)' }}>
                    ₹{client.outstandingAmount.toLocaleString('en-IN')}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{client.nextFollowUp}</td>
                  <td><StatusBadge status={client.clientStatus} /></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-ghost btn-icon-sm" onClick={(e) => { e.stopPropagation(); setSelectedClientId(client.clientId); }}>
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
