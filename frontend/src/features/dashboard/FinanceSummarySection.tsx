// Boaive Operations Hub - Finance Summary Section

import React, { useState } from 'react';
import { Receipt, ArrowRight, TrendingUp, AlertCircle, DollarSign, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FinanceSummarySection: React.FC = () => {
  const { finance, expenses, navigateAndFocus } = useApp();
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  const revenue = 420000;
  const totalExpenses = 160000;
  const outstanding = 78000;
  const overdue = 25000;

  // Monthly Trend Data (Last 6 Months in ₹k)
  const monthlyData = [
    { month: 'May', rev: 280, exp: 120 },
    { month: 'Jun', rev: 310, exp: 135 },
    { month: 'Jul', rev: 340, exp: 140 },
    { month: 'Aug', rev: 375, exp: 150 },
    { month: 'Sep', rev: 420, exp: 160 },
  ];

  const maxVal = 500;
  const chartHeight = 110;
  const chartWidth = 320;

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header">
        <div>
          <div className="card-title">
            <Receipt size={17} color="var(--brand-accent)" />
            <span>Financial Cashflow Health</span>
          </div>
          <div className="card-subtitle">Revenue, expenses & receivables breakdown</div>
        </div>

        <button
          onClick={() => navigateAndFocus('finance')}
          className="btn btn-ghost btn-sm"
          style={{ color: 'var(--brand-accent)' }}
        >
          <span>Finance Hub</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* 4 Core Financial Metrics */}
      <div className="grid-cols-4" style={{ marginBottom: '18px' }}>
        <div
          style={{
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Revenue</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            ₹4.2L
          </div>
          <div style={{ fontSize: '11px', color: 'var(--success-text)', fontWeight: 600, display: 'flex', alignItems: 'center', marginTop: '2px' }}>
            <ArrowUpRight size={12} />
            <span>+12.4%</span>
          </div>
        </div>

        <div
          style={{
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Expenses</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            ₹1.6L
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            61.9% Margin
          </div>
        </div>

        <div
          style={{
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Outstanding</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--warning)', marginTop: '2px' }}>
            ₹78K
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            2 Net-15 Invoices
          </div>
        </div>

        <div
          style={{
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            cursor: 'pointer',
          }}
          onClick={() => navigateAndFocus('finance')}
        >
          <div style={{ fontSize: '11px', color: 'var(--danger-text)', fontWeight: 700 }}>Overdue SLA</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--danger-text)', marginTop: '2px' }}>
            ₹25K
          </div>
          <div style={{ fontSize: '11px', color: 'var(--danger-text)', marginTop: '2px', fontWeight: 600 }}>
            Apex FinTech (12d)
          </div>
        </div>
      </div>

      {/* Revenue Trend Visual Bar Chart */}
      <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
            6-Month Operating Trajectory
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--brand-accent)' }} />
              Revenue
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--purple)' }} />
              Expenses
            </span>
          </div>
        </div>

        {/* Custom Clean Bar Chart */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '110px', paddingTop: '10px' }}>
          {monthlyData.map((d, i) => {
            const revHeight = (d.rev / maxVal) * 100;
            const expHeight = (d.exp / maxVal) * 100;
            const isHovered = hoveredMonth === i;

            return (
              <div
                key={d.month}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  flex: 1,
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setHoveredMonth(i)}
                onMouseLeave={() => setHoveredMonth(null)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '85px', width: '36px', justifyContent: 'center' }}>
                  {/* Revenue Bar */}
                  <div
                    style={{
                      width: '14px',
                      height: `${revHeight}%`,
                      backgroundColor: isHovered ? '#38bdf8' : 'var(--brand-accent)',
                      borderRadius: '3px 3px 0 0',
                      transition: 'all 0.2s ease',
                      boxShadow: isHovered ? '0 0 10px rgba(14, 165, 233, 0.5)' : 'none',
                    }}
                    title={`Revenue: ₹${d.rev}k`}
                  />
                  {/* Expense Bar */}
                  <div
                    style={{
                      width: '14px',
                      height: `${expHeight}%`,
                      backgroundColor: isHovered ? '#c084fc' : 'var(--purple)',
                      borderRadius: '3px 3px 0 0',
                      transition: 'all 0.2s ease',
                    }}
                    title={`Expenses: ₹${d.exp}k`}
                  />
                </div>

                <span style={{ fontSize: '11px', fontWeight: isHovered ? 700 : 500, color: isHovered ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {d.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
