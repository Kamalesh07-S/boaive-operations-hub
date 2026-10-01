// Boaive Operations Hub - Finance Invoices & Receivables (mapped to FinanceRecord)

import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  ChevronRight,
  Receipt,
  TrendingDown,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/Badge';

export const InvoicesView: React.FC = () => {
  const {
    finance,
    updatePaymentStatus,
    openQuickAdd,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Only show income records (accounts receivable)
  const incomeRecords = finance.filter((f) => f.type === 'Income');

  const filteredRecords = incomeRecords.filter((f) => {
    const matchesSearch =
      f.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || f.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalInvoiced = incomeRecords.reduce((sum, f) => sum + f.amount, 0);
  const totalPaid = incomeRecords.filter((f) => f.paymentStatus === 'Paid').reduce((sum, f) => sum + f.amount, 0);
  const totalOverdue = incomeRecords.filter((f) => f.paymentStatus === 'Overdue').reduce((sum, f) => sum + f.amount, 0);
  const totalPending = incomeRecords.filter((f) => f.paymentStatus === 'Sent' || f.paymentStatus === 'Partially Paid').reduce((sum, f) => sum + f.amount, 0);

  const selectedRecord = finance.find((f) => f.transactionId === selectedId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
            Client Invoices &amp; Accounts Receivable
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Track billing milestones, Net-15 settlements, and overdue payment collections
          </p>
        </div>

        <button onClick={() => openQuickAdd('finance')} className="btn btn-primary btn-sm">
          <Plus size={15} />
          <span>New Transaction</span>
        </button>
      </div>

      {/* Summary Financial Metric Cards */}
      <div className="grid-cols-4">
        <div className="card" style={{ padding: '14px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Receipt size={14} color="var(--text-muted)" />
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Billed</div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
            ₹{totalInvoiced.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="card" style={{ padding: '14px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <CheckCircle2 size={14} color="var(--success)" />
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Collected (Paid)</div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--success-text)' }}>
            ₹{totalPaid.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="card" style={{ padding: '14px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Clock size={14} color="var(--warning)" />
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Awaiting Payment</div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--warning-text)' }}>
            ₹{totalPending.toLocaleString('en-IN')}
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: '14px 18px',
            backgroundColor: totalOverdue > 0 ? 'var(--danger-bg)' : undefined,
            border: totalOverdue > 0 ? '1px solid var(--danger-border)' : undefined,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <TrendingDown size={14} color={totalOverdue > 0 ? 'var(--danger)' : 'var(--text-muted)'} />
            <div style={{ fontSize: '11px', color: totalOverdue > 0 ? 'var(--danger-text)' : 'var(--text-muted)', fontWeight: 700 }}>
              Overdue Balance
            </div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: totalOverdue > 0 ? 'var(--danger-text)' : 'var(--text-primary)' }}>
            ₹{totalOverdue.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
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
            placeholder="Search by ID, client, project or description..."
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '6px 10px', fontSize: '12px', width: '160px' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Sent">Sent (Pending)</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Finance Records Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Billed Client</th>
              <th>Project / Description</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>
                  No finance records found.
                </td>
              </tr>
            ) : (
              filteredRecords.map((f) => (
                <tr
                  key={f.transactionId}
                  onClick={() => setSelectedId(f.transactionId === selectedId ? null : f.transactionId)}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{ fontWeight: 800, color: 'var(--brand-accent)' }}>{f.transactionId}</td>
                  <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{f.client}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    <div style={{ fontWeight: 600 }}>{f.project}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{f.description}</div>
                  </td>
                  <td style={{ fontWeight: 800 }}>₹{f.amount.toLocaleString('en-IN')}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{f.date}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{f.paymentMethod}</td>
                  <td><StatusBadge status={f.paymentStatus} /></td>
                  <td style={{ textAlign: 'right' }}>
                    {f.paymentStatus !== 'Paid' && (
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '11px', padding: '4px 10px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          updatePaymentStatus(f.transactionId, 'Paid');
                        }}
                      >
                        <CheckCircle2 size={13} />
                        <span>Mark Paid</span>
                      </button>
                    )}
                    {f.paymentStatus === 'Paid' && (
                      <span style={{ fontSize: '11px', color: 'var(--success-text)', fontWeight: 600 }}>
                        ✓ Settled {f.paidDate}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Inline Detail Panel */}
      {selectedRecord && (
        <div
          className="card"
          style={{
            padding: '20px',
            border: '1px solid var(--brand-accent)',
            backgroundColor: 'var(--bg-elevated)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>TRANSACTION DETAIL</span>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                {selectedRecord.transactionId}
              </h3>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <StatusBadge status={selectedRecord.paymentStatus} />
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedId(null)}>✕</button>
            </div>
          </div>

          <div className="grid-cols-2" style={{ gap: '16px', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Client</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{selectedRecord.client}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Project</div>
              <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{selectedRecord.project}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Description</div>
              <div style={{ color: 'var(--text-secondary)' }}>{selectedRecord.description}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Payment Method</div>
              <div style={{ color: 'var(--text-secondary)' }}>{selectedRecord.paymentMethod}</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Amount: </span>
              <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-accent)' }}>
                ₹{selectedRecord.amount.toLocaleString('en-IN')}
              </span>
            </div>
            {selectedRecord.paymentStatus !== 'Paid' && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  updatePaymentStatus(selectedRecord.transactionId, 'Paid');
                  setSelectedId(null);
                }}
              >
                <CheckCircle2 size={14} />
                <span>Record Payment Received</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
