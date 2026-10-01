// Boaive Operations Hub - Operations Command Center (Dashboard)

import React from 'react';
import {
  Users,
  UserCheck,
  Layers,
  CreditCard,
  AlertCircle,
  CheckSquare,
  RefreshCw,
  Plus,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KpiCard } from '../../components/common/KpiCard';
import { AttentionRequired } from './AttentionRequired';
import { ProjectOverviewSection } from './ProjectOverviewSection';
import { LeadPipelineSection } from './LeadPipelineSection';
import { FinanceSummarySection } from './FinanceSummarySection';
import { RecentActivityTimeline } from './RecentActivityTimeline';

export const DashboardView: React.FC = () => {
  const { clients, leads, projects, tasks, finance, refreshAllData, openQuickAdd, navigateAndFocus } = useApp();

  // Compute KPIs from live data
  const activeClients = clients.filter((c) => c.clientStatus === 'Active').length;
  const activeLeads = leads.filter((l) => l.status !== 'Won' && l.status !== 'Lost').length;
  const activeProjects = projects.filter((p) => p.status === 'In Progress' || p.status === 'Open Work').length;
  const revenue = finance.filter((f) => f.type === 'Income' && f.paymentStatus === 'Paid').reduce((sum, f) => sum + f.amount, 0);
  const outstanding = finance.filter((f) => f.type === 'Income' && (f.paymentStatus === 'Sent' || f.paymentStatus === 'Partially Paid' || f.paymentStatus === 'Overdue')).reduce((sum, f) => sum + f.amount, 0);
  const pendingTasks = tasks.filter((t) => t.status === 'Todo' || t.status === 'In Progress' || t.status === 'Review').length;

  const formatCurrency = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
    return `₹${val}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner: Operations Command Center Greeting */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(13, 18, 31, 0.8) 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(2, 132, 199, 0.25)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--brand-accent)',
                backgroundColor: 'var(--brand-glow)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--brand-accent)' }} />
              Live Operations Telemetry
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Updated just now</span>
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            Boaive Command Center
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Operational health across {clients.length} clients, {projects.length} projects, and financial cashflow.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => refreshAllData()}
            className="btn btn-secondary btn-sm"
            title="Refresh Live Data"
          >
            <RefreshCw size={14} />
            <span>Sync</span>
          </button>

          <button
            onClick={() => openQuickAdd('client')}
            className="btn btn-primary btn-sm"
          >
            <Plus size={14} />
            <span>Quick Add</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards (6 core metrics) */}
      <div className="grid-cols-6">
        <KpiCard
          title="Active Clients"
          value={activeClients}
          trend={2.4}
          icon={<Users size={18} />}
          onClick={() => navigateAndFocus('crm-clients')}
        />

        <KpiCard
          title="Active Leads"
          value={activeLeads}
          trend={8.1}
          icon={<UserCheck size={18} />}
          onClick={() => navigateAndFocus('crm-leads')}
        />

        <KpiCard
          title="Active Projects"
          value={activeProjects}
          trend={-1.2}
          icon={<Layers size={18} />}
          onClick={() => navigateAndFocus('projects')}
        />

        <KpiCard
          title="Revenue"
          value={formatCurrency(revenue)}
          trend={12.4}
          subtitle="vs last month"
          icon={<CreditCard size={18} />}
          highlight
          onClick={() => navigateAndFocus('finance')}
        />

        <KpiCard
          title="Outstanding"
          value={formatCurrency(outstanding)}
          trend={-5.3}
          subtitle="receivables"
          icon={<AlertCircle size={18} />}
          onClick={() => navigateAndFocus('finance')}
        />

        <KpiCard
          title="Pending Tasks"
          value={pendingTasks}
          trend={3.7}
          subtitle="active backlog"
          icon={<CheckSquare size={18} />}
          onClick={() => navigateAndFocus('tasks')}
        />
      </div>

      {/* Prominent Attention Required Section */}
      <AttentionRequired />

      {/* Two-Column Delivery & Pipeline Overview */}
      <div className="grid-cols-2">
        <ProjectOverviewSection />
        <LeadPipelineSection />
      </div>

      {/* Two-Column Finance & Recent Activity */}
      <div className="grid-cols-2">
        <FinanceSummarySection />
        <RecentActivityTimeline />
      </div>
    </div>
  );
};
