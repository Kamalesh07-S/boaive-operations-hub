// Boaive Operations Hub - Recent Activity Timeline Section

import React, { useMemo } from 'react';
import { Activity, Layers, DollarSign, UserCheck, CheckSquare, Server, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ActivityItem {
  id: string;
  category: 'project' | 'payment' | 'crm' | 'task' | 'asset' | 'content';
  title: string;
  description: string;
  user?: string;
  timeAgo: string;
}

export const RecentActivityTimeline: React.FC = () => {
  const { tasks, finance, leads, projects, assets } = useApp();

  // Build activity feed from real data
  const activities = useMemo<ActivityItem[]>(() => {
    const items: ActivityItem[] = [];

    // Recent paid finance records
    finance
      .filter((f) => f.paymentStatus === 'Paid' && f.paidDate)
      .slice(0, 2)
      .forEach((f) => {
        items.push({
          id: `fin-${f.transactionId}`,
          category: 'payment',
          title: `Payment Received: ${f.client}`,
          description: `₹${f.amount.toLocaleString('en-IN')} for ${f.project} — ${f.paymentMethod}`,
          timeAgo: f.paidDate || f.date,
        });
      });

    // Recent tasks in review or completed
    tasks
      .filter((t) => t.status === 'Review' || t.status === 'Completed')
      .slice(0, 2)
      .forEach((t) => {
        items.push({
          id: `task-${t.taskId}`,
          category: 'task',
          title: `Task ${t.status}: ${t.task}`,
          description: `Project: ${t.project} • ${t.category}`,
          user: t.assignedTo,
          timeAgo: t.dueDate,
        });
      });

    // Recently won leads
    leads
      .filter((l) => l.status === 'Won')
      .slice(0, 1)
      .forEach((l) => {
        items.push({
          id: `lead-${l.leadId}`,
          category: 'crm',
          title: `Deal Won: ${l.leadName}`,
          description: `${l.company} — ₹${l.estimatedValue.toLocaleString('en-IN')} • ${l.source}`,
          user: l.assignedTeamMember,
          timeAgo: l.expectedClose,
        });
      });

    // Projects in Testing phase
    projects
      .filter((p) => p.status === 'Testing')
      .slice(0, 1)
      .forEach((p) => {
        items.push({
          id: `proj-${p.projectId}`,
          category: 'project',
          title: `Project in Testing: ${p.projectName}`,
          description: `Client: ${p.client} • ${p.progress}% complete • ${p.currentPhase}`,
          timeAgo: p.deadline,
        });
      });

    // Expiring assets
    assets
      .filter((a) => a.renewalStatus === '🔴 Expired' || a.renewalStatus === '🟡 Renew Soon')
      .slice(0, 1)
      .forEach((a) => {
        items.push({
          id: `asset-${a.assetId}`,
          category: 'asset',
          title: `Asset Renewal Alert: ${a.assetName}`,
          description: `${a.assetType} via ${a.provider} — renewal date: ${a.renewalDate}`,
          timeAgo: a.renewalDate,
        });
      });

    return items.slice(0, 6);
  }, [tasks, finance, leads, projects, assets]);

  const getActivityIcon = (category: ActivityItem['category']) => {
    switch (category) {
      case 'project':
        return <Layers size={14} color="var(--brand-accent)" />;
      case 'payment':
        return <DollarSign size={14} color="var(--success)" />;
      case 'crm':
        return <UserCheck size={14} color="var(--purple)" />;
      case 'task':
        return <CheckSquare size={14} color="var(--brand-accent)" />;
      case 'asset':
        return <Server size={14} color="var(--warning)" />;
      case 'content':
        return <Calendar size={14} color="var(--brand-accent)" />;
      default:
        return <Activity size={14} color="var(--text-muted)" />;
    }
  };

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header">
        <div>
          <div className="card-title">
            <Activity size={17} color="var(--brand-accent)" />
            <span>Operational Audit Trail</span>
          </div>
          <div className="card-subtitle">Recent team activities, deployments &amp; milestones</div>
        </div>
      </div>

      <div style={{ position: 'relative', paddingLeft: '8px' }}>
        {/* Timeline Connecting Vertical Line */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            bottom: '12px',
            left: '21px',
            width: '2px',
            backgroundColor: 'var(--border-subtle)',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
              No recent activities to display
            </div>
          ) : (
            activities.map((act) => (
              <div
                key={act.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  position: 'relative',
                }}
              >
                {/* Timeline Node Bullet */}
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-medium)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                    flexShrink: 0,
                  }}
                >
                  {getActivityIcon(act.category)}
                </div>

                {/* Activity Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {act.title}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: '8px' }}>
                      {act.timeAgo}
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                    {act.description}
                  </p>

                  {act.user && (
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      by <span style={{ color: 'var(--brand-accent)', fontWeight: 600 }}>{act.user}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
