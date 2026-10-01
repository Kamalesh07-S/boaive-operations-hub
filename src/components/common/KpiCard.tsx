// Boaive Common - Progress Bar & KpiCard

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface ProgressBarProps {
  progress: number;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  colorOverride?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showText = false,
  size = 'md',
  colorOverride,
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  // Determine color based on progress if not overridden
  const getColor = () => {
    if (colorOverride) return colorOverride;
    if (clamped >= 80) return 'var(--success)';
    if (clamped >= 50) return 'var(--brand-accent)';
    if (clamped >= 25) return 'var(--warning)';
    return 'var(--purple)';
  };

  const height = size === 'sm' ? '4px' : size === 'lg' ? '10px' : '6px';

  return (
    <div style={{ width: '100%' }}>
      {showText && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            fontWeight: 600,
            marginBottom: '4px',
          }}
        >
          <span style={{ color: 'var(--text-secondary)' }}>Progress</span>
          <span style={{ color: 'var(--text-primary)' }}>{clamped}%</span>
        </div>
      )}
      <div
        className="progress-track"
        style={{
          height,
          backgroundColor: 'var(--bg-subtle-hover)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
        }}
      >
        <div
          className="progress-fill"
          style={{
            width: `${clamped}%`,
            backgroundColor: getColor(),
            height: '100%',
            transition: 'width 0.5s ease-in-out',
          }}
        />
      </div>
    </div>
  );
};

interface KpiCardProps {
  title: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon?: React.ReactNode;
  subtitle?: string;
  highlight?: boolean;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  trend,
  trendLabel = 'vs last month',
  icon,
  subtitle,
  highlight = false,
  onClick,
}) => {
  const isPositive = trend !== undefined && trend > 0;
  const isNeutral = trend === 0;

  return (
    <div
      className={`card ${onClick ? 'card-clickable' : ''}`}
      onClick={onClick}
      style={{
        padding: '20px',
        border: highlight ? '1px solid rgba(2, 132, 199, 0.4)' : undefined,
        background: highlight
          ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, var(--bg-card) 100%)'
          : 'var(--bg-card)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </span>
        {icon && (
          <div
            style={{
              padding: '8px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-subtle-hover)',
              color: highlight ? 'var(--brand-accent)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </div>
        )}
      </div>

      <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
        {value}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '12px' }}>
        {trend !== undefined && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontWeight: 700,
              gap: '2px',
              color: isPositive ? 'var(--success-text)' : isNeutral ? 'var(--text-muted)' : 'var(--danger-text)',
            }}
          >
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(trend)}%
          </span>
        )}
        <span style={{ color: 'var(--text-muted)' }}>{subtitle || trendLabel}</span>
      </div>
    </div>
  );
};
