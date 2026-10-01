// Boaive Operations Hub - Finance Operational Expenses

import React, { useState } from 'react';
import {
  Plus,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ExpenseCategory } from '../../types';

export const ExpensesView: React.FC = () => {
  const { expenses, openQuickAdd } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [frequencyFilter, setFrequencyFilter] = useState<string>('ALL');

  const categories: ExpenseCategory[] = [
    'Infrastructure & Cloud',
    'Software & Licenses',
    'Contractor / Agency',
    'Operations & Office',
    'Marketing & Sales',
  ];

  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch =
      exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || exp.category === categoryFilter;
    const matchesFrequency = frequencyFilter === 'ALL' || exp.frequency === frequencyFilter;
    return matchesSearch && matchesCategory && matchesFrequency;
  });

  const totalMonthlySpend = expenses.reduce((sum, e) => sum + e.monthlyCost, 0);
  const cloudSpend = expenses.filter((e) => e.category === 'Infrastructure & Cloud').reduce((sum, e) => sum + e.amount, 0);
  const softwareSpend = expenses.filter((e) => e.category === 'Software & Licenses').reduce((sum, e) => sum + e.amount, 0);
  const contractorSpend = expenses.filter((e) => e.category === 'Contractor / Agency').reduce((sum, e) => sum + e.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
            Operational Expenses &amp; Cost Centers
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Cloud infrastructure, SaaS tooling, contractor payouts, and recurring subscriptions
          </p>
        </div>

        <button onClick={() => openQuickAdd('expense')} className="btn btn-primary btn-sm">
          <Plus size={15} />
          <span>Log Expense</span>
        </button>
      </div>

      {/* Breakdown Cards */}
      <div className="grid-cols-4">
        <div className="card" style={{ padding: '14px 18px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Monthly Run Rate</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            ₹{totalMonthlySpend.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="card" style={{ padding: '14px 18px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Cloud &amp; Compute</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--brand-accent)', marginTop: '2px' }}>
            ₹{cloudSpend.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="card" style={{ padding: '14px 18px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Software &amp; Tools</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--purple-text, #c084fc)', marginTop: '2px' }}>
            ₹{softwareSpend.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="card" style={{ padding: '14px 18px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Contractors &amp; Agency</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--warning-text)', marginTop: '2px' }}>
            ₹{contractorSpend.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
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
            placeholder="Search expenses by description, vendor, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ padding: '6px 10px', fontSize: '13px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ padding: '6px 10px', fontSize: '12px', width: '180px' }}
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            className="form-select"
            value={frequencyFilter}
            onChange={(e) => setFrequencyFilter(e.target.value)}
            style={{ padding: '6px 10px', fontSize: '12px', width: '130px' }}
          >
            <option value="ALL">All Frequencies</option>
            <option value="Monthly">Monthly</option>
            <option value="One-time">One-time</option>
            <option value="Annual">Annual</option>
            <option value="Quarterly">Quarterly</option>
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Monthly Cost</th>
              <th>Frequency</th>
              <th>Vendor</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>
                  No expenses found.
                </td>
              </tr>
            ) : (
              filteredExpenses.map((exp) => (
                <tr key={exp.expenseId}>
                  <td style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '11px' }}>{exp.expenseId}</td>
                  <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    <div>{exp.description}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>{exp.type}</div>
                  </td>
                  <td>
                    <span className="badge badge-neutral">{exp.category}</span>
                  </td>
                  <td style={{ fontWeight: 800 }}>₹{exp.amount.toLocaleString('en-IN')}</td>
                  <td style={{ color: 'var(--text-muted)' }}>₹{exp.monthlyCost.toLocaleString('en-IN')}/mo</td>
                  <td>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{exp.frequency}</span>
                  </td>
                  <td style={{ color: 'var(--brand-accent)' }}>{exp.vendor}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{exp.date}</td>
                  <td>
                    <span
                      className={`badge ${exp.paymentStatus === 'Paid' ? 'badge-success' : exp.paymentStatus === 'Pending' ? 'badge-warning' : 'badge-neutral'}`}
                    >
                      {exp.paymentStatus}
                    </span>
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
