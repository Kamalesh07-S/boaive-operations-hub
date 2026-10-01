// Boaive Operations Hub - Notifications Center

import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Trash2,
  Check,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NotificationSeverity, NotificationItem, NavigationTab } from '../../types';

export const NotificationsView: React.FC = () => {
  const {
    tasks,
    finance,
    projects,
    leads,
    assets,
    navigateAndFocus,
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);

  // Dynamically compute notification items from live context state
  const generatedNotifications = useMemo<NotificationItem[]>(() => {
    const list: NotificationItem[] = [];

    // Overdue tasks
    tasks.filter((t) => t.status === 'Overdue').forEach((t) => {
      list.push({
        id: `notif-tsk-${t.taskId}`,
        title: `Overdue Task: ${t.task}`,
        message: `Task is overdue since ${t.dueDate}. Assigned to ${t.assignedTo} under project "${t.project}".`,
        timestamp: 'Active Now',
        read: readIds.includes(`notif-tsk-${t.taskId}`),
        severity: 'urgent',
        category: 'tasks',
        targetTab: 'tasks',
        targetId: t.taskId,
      });
    });

    // Overdue payments / invoices
    finance.filter((f) => f.paymentStatus === 'Overdue').forEach((f) => {
      list.push({
        id: `notif-fin-${f.transactionId}`,
        title: `Overdue Payment: ₹${f.amount.toLocaleString('en-IN')}`,
        message: `Receivable from ${f.client} for ${f.description} is past due.`,
        timestamp: f.date,
        read: readIds.includes(`notif-fin-${f.transactionId}`),
        severity: 'urgent',
        category: 'payments',
        targetTab: 'finance',
        targetId: f.transactionId,
      });
    });

    // Impending project deadlines (within 7 days)
    projects.filter((p) => p.status === 'In Progress' || p.status === 'Open Work').forEach((p) => {
      list.push({
        id: `notif-prj-${p.projectId}`,
        title: `Project Milestone: ${p.projectName}`,
        message: `Target deadline: ${p.deadline}. Progress currently at ${p.progress}% (${p.currentPhase}).`,
        timestamp: p.deadline,
        read: readIds.includes(`notif-prj-${p.projectId}`),
        severity: 'warning',
        category: 'projects',
        targetTab: 'projects',
        targetId: p.projectId,
      });
    });

    // Asset renewals
    assets.filter((a) => a.renewalStatus === '🔴 Expired' || a.renewalStatus === '🟡 Renew Soon').forEach((a) => {
      list.push({
        id: `notif-ast-${a.assetId}`,
        title: `Asset Renewal Warning: ${a.assetName}`,
        message: `${a.assetType} (${a.domainOrAccountName}) renewal is required by ${a.renewalDate}.`,
        timestamp: a.renewalDate,
        read: readIds.includes(`notif-ast-${a.assetId}`),
        severity: a.renewalStatus === '🔴 Expired' ? 'urgent' : 'warning',
        category: 'renewals',
        targetTab: 'assets',
        targetId: a.assetId,
      });
    });

    // Lead follow-ups
    leads.filter((l) => l.status === 'Proposal Sent' || l.status === 'Negotiation').forEach((l) => {
      list.push({
        id: `notif-led-${l.leadId}`,
        title: `Lead Follow-Up: ${l.leadName}`,
        message: `Next follow-up scheduled with ${l.contact || l.company}. Expected deal size: ₹${l.estimatedValue.toLocaleString('en-IN')}.`,
        timestamp: l.nextFollowUp,
        read: readIds.includes(`notif-led-${l.leadId}`),
        severity: 'info',
        category: 'follow-ups',
        targetTab: 'crm-leads',
        targetId: l.leadId,
      });
    });

    return list;
  }, [tasks, finance, projects, leads, assets, readIds]);

  const notifications = generatedNotifications.filter((n) => !dismissedIds.includes(n.id));

  const categories: { id: string; label: string }[] = [
    { id: 'ALL', label: 'All Categories' },
    { id: 'tasks', label: 'Tasks & Sprints' },
    { id: 'payments', label: 'Invoices & Billing' },
    { id: 'projects', label: 'Project Deadlines' },
    { id: 'follow-ups', label: 'CRM Follow-ups' },
    { id: 'renewals', label: 'Asset Renewals' },
  ];

  const filteredNotifications = notifications.filter((notif) => {
    return categoryFilter === 'ALL' || notif.category === categoryFilter;
  });

  const markNotificationRead = (id: string) => {
    setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const markAllNotificationsRead = () => {
    setReadIds(generatedNotifications.map((n) => n.id));
  };

  const deleteNotification = (id: string) => {
    setDismissedIds((prev) => [...prev, id]);
  };

  const getSeverityIcon = (severity: NotificationSeverity) => {
    switch (severity) {
      case 'urgent':
        return <AlertTriangle size={18} color="var(--danger)" />;
      case 'warning':
        return <AlertTriangle size={18} color="var(--warning)" />;
      case 'success':
        return <CheckCircle2 size={18} color="var(--success)" />;
      case 'info':
      default:
        return <Sparkles size={18} color="var(--info)" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
            Operational Notification Center
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            System alerts, invoice overdue warnings, contract renewals, and milestone reminders
          </p>
        </div>

        <button onClick={markAllNotificationsRead} className="btn btn-secondary btn-sm">
          <Check size={14} />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {categories.map((cat) => {
          const count =
            cat.id === 'ALL'
              ? notifications.length
              : notifications.filter((n) => n.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`btn btn-sm ${categoryFilter === cat.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 12px' }}
            >
              <span>{cat.label}</span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Notification List Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredNotifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => {
              markNotificationRead(notif.id);
              if (notif.targetTab) navigateAndFocus(notif.targetTab, notif.targetId);
            }}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '16px',
              padding: '16px 20px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: notif.read ? 'var(--bg-card)' : 'rgba(2, 132, 199, 0.07)',
              border: notif.read ? '1px solid var(--border-subtle)' : '1px solid var(--border-medium)',
              borderLeft: notif.severity === 'urgent' ? '4px solid var(--danger)' : notif.severity === 'warning' ? '4px solid var(--warning)' : undefined,
              cursor: notif.targetTab ? 'pointer' : 'default',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-strong)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = notif.read ? 'var(--border-subtle)' : 'var(--border-medium)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1 }}>
              <div style={{ marginTop: '2px', flexShrink: 0 }}>
                {getSeverityIcon(notif.severity)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: notif.read ? 600 : 800, color: 'var(--text-primary)' }}>
                    {notif.title}
                  </h4>
                  {!notif.read && (
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--brand-accent)',
                      }}
                    />
                  )}
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                  {notif.message}
                </p>

                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                  {notif.timestamp} • Category: <strong style={{ color: 'var(--text-secondary)' }}>{notif.category}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              {notif.targetTab && (
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '12px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    markNotificationRead(notif.id);
                    navigateAndFocus(notif.targetTab, notif.targetId);
                  }}
                >
                  <span>Resolve</span>
                  <ArrowRight size={12} />
                </button>
              )}

              <button
                className="btn btn-ghost btn-icon-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(notif.id);
                }}
                title="Dismiss"
                style={{ color: 'var(--text-muted)' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '48px 20px' }}>
            <p style={{ color: 'var(--text-muted)' }}>No notifications in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};
