// Boaive Common - Badges

import React from 'react';
import { Priority, LeadStatus, ProjectStatus, TaskStatus, PaymentStatus, AssetRenewalStatus } from '../../types';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'neutral';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'neutral', dot = true, className = '' }) => {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {dot && (
        <span
          className="badge-dot"
          style={{
            backgroundColor:
              variant === 'success'
                ? 'var(--success)'
                : variant === 'warning'
                ? 'var(--warning)'
                : variant === 'danger'
                ? 'var(--danger)'
                : variant === 'info'
                ? 'var(--info)'
                : variant === 'purple'
                ? 'var(--purple)'
                : 'var(--text-muted)',
          }}
        />
      )}
      {label}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  switch (priority) {
    case 'Urgent':
      return <Badge label="Urgent" variant="danger" />;
    case 'High':
      return <Badge label="High" variant="warning" />;
    case 'Medium':
      return <Badge label="Medium" variant="info" />;
    case 'Low':
    default:
      return <Badge label="Low" variant="neutral" />;
  }
};

export const StatusBadge: React.FC<{
  status: ProjectStatus | TaskStatus | PaymentStatus | LeadStatus | string;
}> = ({ status }) => {
  switch (status) {
    // Success / Completed / Won / Paid
    case 'Completed':
    case 'Won':
    case 'Paid':
    case 'Published':
    case 'Active':
      return <Badge label={status} variant="success" />;

    // Warning / In Progress / Sent / Testing / Due Soon
    case 'In Progress':
    case 'Testing':
    case 'Sent':
    case 'Partially Paid':
    case 'Proposal Sent':
    case 'Negotiation':
    case 'Scheduled':
      return <Badge label={status} variant="warning" />;

    // Danger / Overdue / Lost / Cancelled
    case 'Overdue':
    case 'Lost':
    case 'Cancelled':
    case 'Inactive':
    case 'Declined':
      return <Badge label={status} variant="danger" />;

    // Info / Open Work / Review / Contacted / Discovery
    case 'Open Work':
    case 'Discovery':
    case 'Contacted':
    case 'Review':
    case 'Awaiting Client':
      return <Badge label={status} variant="info" />;

    // Purple / Draft / Idea / New
    case 'New':
    case 'Draft':
    case 'Idea':
      return <Badge label={status} variant="purple" />;

    default:
      return <Badge label={status} variant="neutral" />;
  }
};

export const UrgencyIndicator: React.FC<{ status: AssetRenewalStatus }> = ({ status }) => {
  switch (status) {
    case '🔴 Expired':
      return <Badge label="🔴 Expired" variant="danger" dot={false} />;
    case '🟡 Renew Soon':
      return <Badge label="🟡 Renew Soon" variant="warning" dot={false} />;
    case '🟢 OK':
    default:
      return <Badge label="🟢 OK" variant="success" dot={false} />;
  }
};
