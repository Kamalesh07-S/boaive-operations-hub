// Boaive Operations Hub - Attention Required Section

import React, { useMemo } from 'react';
import { AlertTriangle, Clock, ArrowRight, ShieldAlert, DollarSign, Server } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AttentionItem {
  id: string;
  urgency: 'urgent' | 'warning';
  iconType: string;
  title: string;
  subtitle: string;
  actionLabel: string;
  targetTab: 'tasks' | 'finance' | 'crm-leads' | 'projects' | 'assets';
  targetId?: string;
}

export const AttentionRequired: React.FC = () => {
  const { tasks, finance, assets, projects, navigateAndFocus } = useApp();

  const attentionItems = useMemo<AttentionItem[]>(() => {
    const items: AttentionItem[] = [];

    // Overdue tasks
    const overdueTasks = tasks.filter((t) => t.status === 'Overdue');
    overdueTasks.slice(0, 2).forEach((t) => {
      items.push({
        id: t.taskId,
        urgency: 'urgent',
        iconType: 'task-alert',
        title: t.task,
        subtitle: `Assigned to ${t.assignedTo} • Project: ${t.project} • Due: ${t.dueDate}`,
        actionLabel: 'Review Task',
        targetTab: 'tasks',
        targetId: t.taskId,
      });
    });

    // Overdue invoices
    const overdueFinance = finance.filter((f) => f.paymentStatus === 'Overdue');
    overdueFinance.slice(0, 2).forEach((f) => {
      items.push({
        id: f.transactionId,
        urgency: 'urgent',
        iconType: 'payment-alert',
        title: `Overdue Payment: ${f.client}`,
        subtitle: `₹${f.amount.toLocaleString('en-IN')} • ${f.description} • Due: ${f.date}`,
        actionLabel: 'Mark Paid',
        targetTab: 'finance',
        targetId: f.transactionId,
      });
    });

    // Expiring assets
    const expiringAssets = assets.filter((a) => a.renewalStatus === '🔴 Expired' || a.renewalStatus === '🟡 Renew Soon');
    expiringAssets.slice(0, 2).forEach((a) => {
      items.push({
        id: a.assetId,
        urgency: a.renewalStatus === '🔴 Expired' ? 'urgent' : 'warning',
        iconType: 'asset-alert',
        title: `${a.renewalStatus === '🔴 Expired' ? 'Expired' : 'Expiring Soon'}: ${a.assetName}`,
        subtitle: `${a.assetType} • ${a.provider} • Renewal: ${a.renewalDate}`,
        actionLabel: 'Renew Asset',
        targetTab: 'assets',
        targetId: a.assetId,
      });
    });

    // Overdue projects
    const overdueProjects = projects.filter((p) => p.status === 'Overdue');
    overdueProjects.slice(0, 1).forEach((p) => {
      items.push({
        id: p.projectId,
        urgency: 'urgent',
        iconType: 'project-alert',
        title: `Overdue Project: ${p.projectName}`,
        subtitle: `Client: ${p.client} • Progress: ${p.progress}% • Deadline: ${p.deadline}`,
        actionLabel: 'View Project',
        targetTab: 'projects',
        targetId: p.projectId,
      });
    });

    return items;
  }, [tasks, finance, assets, projects]);

  if (attentionItems.length === 0) return null;

  const getItemIcon = (iconType: string, urgency: string) => {
    switch (iconType) {
      case 'task-alert':
        return <Clock size={18} color="var(--danger)" />;
      case 'payment-alert':
        return <DollarSign size={18} color="var(--danger)" />;
      case 'project-alert':
        return <ShieldAlert size={18} color="var(--warning)" />;
      case 'asset-alert':
        return <Server size={18} color="var(--purple)" />;
      default:
        return <AlertTriangle size={18} color={urgency === 'urgent' ? 'var(--danger)' : 'var(--warning)'} />;
    }
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--danger)',
              boxShadow: '0 0 10px var(--danger)',
            }}
          />
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Attention Required
          </h2>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger-text)',
              border: '1px solid var(--danger-border)',
            }}
          >
            {attentionItems.length} Urgent Items
          </span>
        </div>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          High-priority action items requiring operational escalation
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {attentionItems.map((item) => (
          <div
            key={item.id}
            className={`attention-card ${item.urgency}`}
            onClick={() => navigateAndFocus(item.targetTab, item.targetId)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-elevated)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {getItemIcon(item.iconType, item.urgency)}
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {item.subtitle}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              <button
                className={`btn btn-sm ${item.urgency === 'urgent' ? 'btn-danger' : 'btn-secondary'}`}
                style={{ fontSize: '12px', padding: '6px 12px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigateAndFocus(item.targetTab, item.targetId);
                }}
              >
                <span>{item.actionLabel}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
