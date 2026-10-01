// Boaive Operations Hub - CRM Leads View (Table & Kanban)

import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  LayoutGrid,
  Table as TableIcon,
  Calendar,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Lead, LeadStatus } from '../../types';
import { StatusBadge } from '../../components/common/Badge';

const STAGES: LeadStatus[] = ['New', 'Contacted', 'Discovery', 'Proposal Sent', 'Negotiation', 'Won', 'Lost', 'On Hold'];

const getStageColor = (stage: LeadStatus) => {
  switch (stage) {
    case 'New': return '#a855f7';
    case 'Contacted': return '#3b82f6';
    case 'Discovery': return '#0ea5e9';
    case 'Proposal Sent': return '#f59e0b';
    case 'Negotiation': return '#f97316';
    case 'Won': return '#10b981';
    case 'Lost': return '#ef4444';
    case 'On Hold': return '#64748b';
    default: return 'var(--text-muted)';
  }
};

export const LeadsView: React.FC = () => {
  const { leads, updateLeadStatus, openQuickAdd, dropdowns } = useApp();

  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.assignedTeamMember.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contact.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === 'ALL' || lead.status === stageFilter;
    return matchesSearch && matchesStage;
  });

  const totalPipelineValue = leads
    .filter((l) => l.status !== 'Lost')
    .reduce((sum, l) => sum + l.estimatedValue, 0);

  const weightedValue = leads
    .filter((l) => l.status !== 'Lost')
    .reduce((sum, l) => sum + l.weightedValue, 0);

  const wonLeads = leads.filter((l) => l.status === 'Won').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
            Leads &amp; Pipeline Management
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {leads.length} total leads · ₹{(totalPipelineValue / 100000).toFixed(1)}L pipeline · {wonLeads} deals won
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* View Toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', padding: '3px', border: '1px solid var(--border-subtle)' }}>
            <button
              className={`btn btn-icon-sm ${viewMode === 'table' ? 'btn-secondary' : 'btn-ghost'}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <TableIcon size={15} />
            </button>
            <button
              className={`btn btn-icon-sm ${viewMode === 'kanban' ? 'btn-secondary' : 'btn-ghost'}`}
              onClick={() => setViewMode('kanban')}
              title="Kanban View"
            >
              <LayoutGrid size={15} />
            </button>
          </div>

          <button onClick={() => openQuickAdd('lead')} className="btn btn-primary btn-sm">
            <Plus size={15} />
            <span>New Lead</span>
          </button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid-cols-3">
        <div className="card" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Pipeline</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            ₹{(totalPipelineValue / 100000).toFixed(1)}L
          </div>
        </div>
        <div className="card" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Weighted Expected</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-accent)', marginTop: '2px' }}>
            ₹{(weightedValue / 100000).toFixed(1)}L
          </div>
        </div>
        <div className="card" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Deals Won</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--success-text)', marginTop: '2px' }}>
            {wonLeads} / {leads.length}
          </div>
        </div>
      </div>

      {/* Search & Filter */}
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
            placeholder="Search leads by name, company, contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ padding: '6px 10px', fontSize: '13px' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Filter size={14} color="var(--text-muted)" />
          <select
            className="form-select"
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            style={{ padding: '6px 10px', fontSize: '12px', width: '160px' }}
          >
            <option value="ALL">All Stages</option>
            {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Lead ID</th>
                <th>Lead / Company</th>
                <th>Source</th>
                <th>Est. Value</th>
                <th>Probability</th>
                <th>Weighted</th>
                <th>Expected Close</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>
                    No leads match your filters.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.leadId}
                    onClick={() => setSelectedLead(lead)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '11px' }}>{lead.leadId}</td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{lead.leadName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lead.company}</div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{lead.source}</td>
                    <td style={{ fontWeight: 700 }}>₹{lead.estimatedValue.toLocaleString('en-IN')}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ flex: 1, height: '4px', backgroundColor: 'var(--bg-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${lead.probability}%`, height: '100%', backgroundColor: 'var(--brand-accent)' }} />
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lead.probability}%</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--brand-accent)' }}>₹{lead.weightedValue.toLocaleString('en-IN')}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{lead.expectedClose}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{lead.assignedTeamMember}</td>
                    <td><StatusBadge status={lead.status} /></td>
                    <td>
                      <select
                        className="form-select"
                        value={lead.status}
                        style={{ fontSize: '11px', padding: '4px 8px', width: '130px' }}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateLeadStatus(lead.leadId, e.target.value as LeadStatus);
                        }}
                      >
                        {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* KANBAN VIEW */}
      {viewMode === 'kanban' && (
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
          {STAGES.filter((s) => s !== 'Lost').map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.status === stage);
            const stageTotal = stageLeads.reduce((sum, l) => sum + l.estimatedValue, 0);
            const color = getStageColor(stage);

            return (
              <div
                key={stage}
                style={{
                  minWidth: '220px',
                  maxWidth: '220px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: `${color}15`,
                    border: `1px solid ${color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color, textTransform: 'uppercase' }}>{stage}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      {stageLeads.length} leads · ₹{(stageTotal / 1000).toFixed(0)}k
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 800,
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: color,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {stageLeads.length}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.leadId}
                      onClick={() => setSelectedLead(lead)}
                      style={{
                        padding: '12px',
                        backgroundColor: 'var(--bg-card)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        transition: 'border-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = color)}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                    >
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                        {lead.leadName}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>{lead.company}</div>
                      <div style={{ fontSize: '12px', fontWeight: 800, color }}>
                        ₹{lead.estimatedValue.toLocaleString('en-IN')}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        <Calendar size={11} style={{ display: 'inline', marginRight: '4px' }} />
                        {lead.expectedClose}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lead Detail Inline Panel */}
      {selectedLead && (
        <div
          className="card"
          style={{
            padding: '20px',
            border: `1px solid ${getStageColor(selectedLead.status)}`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>LEAD DETAIL · {selectedLead.leadId}</span>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                {selectedLead.leadName}
              </h3>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{selectedLead.company}</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <StatusBadge status={selectedLead.status} />
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedLead(null)}>✕</button>
            </div>
          </div>

          <div className="grid-cols-2" style={{ gap: '12px', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>Contact</div>
              <div style={{ fontWeight: 600 }}>{selectedLead.contact}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>Source</div>
              <div style={{ fontWeight: 600 }}>{selectedLead.source}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>Estimated Value</div>
              <div style={{ fontWeight: 800, color: 'var(--brand-accent)', fontSize: '16px' }}>
                ₹{selectedLead.estimatedValue.toLocaleString('en-IN')}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>Win Probability</div>
              <div style={{ fontWeight: 700 }}>{selectedLead.probability}% · Weighted ₹{selectedLead.weightedValue.toLocaleString('en-IN')}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>Expected Close</div>
              <div>{selectedLead.expectedClose}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>Next Follow-up</div>
              <div>{selectedLead.nextFollowUp}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>Assigned To</div>
              <div>{selectedLead.assignedTeamMember}</div>
            </div>
          </div>

          {selectedLead.notes && (
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', padding: '10px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
              {selectedLead.notes}
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              className="form-select"
              value={selectedLead.status}
              style={{ fontSize: '12px' }}
              onChange={(e) => {
                updateLeadStatus(selectedLead.leadId, e.target.value as LeadStatus);
                setSelectedLead({ ...selectedLead, status: e.target.value as LeadStatus });
              }}
            >
              {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button className="btn btn-secondary btn-sm" onClick={() => setSelectedLead(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
