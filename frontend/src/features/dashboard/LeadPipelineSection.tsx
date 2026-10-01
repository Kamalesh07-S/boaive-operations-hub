// Boaive Operations Hub - Lead Pipeline Funnel Section

import React from 'react';
import { UserCheck, ArrowRight, Calendar, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LeadStatus } from '../../types';

export const LeadPipelineSection: React.FC = () => {
  const { leads, navigateAndFocus } = useApp();

  const stages: { stage: LeadStatus; color: string; bg: string }[] = [
    { stage: 'New', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)' },
    { stage: 'Contacted', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' },
    { stage: 'Discovery', color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.15)' },
    { stage: 'Proposal Sent', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
    { stage: 'Won', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
  ];

  const totalPipelineValue = leads
    .filter((l) => l.status !== 'Lost')
    .reduce((sum, l) => sum + l.estimatedValue, 0);

  const expectedValue = leads
    .filter((l) => l.status !== 'Lost')
    .reduce((sum, l) => sum + l.weightedValue, 0);

  const followUpsDueCount = leads.filter(
    (l) => l.nextFollowUp <= '2026-10-07' && l.status !== 'Lost' && l.status !== 'Won'
  ).length;

  const getStageCount = (stage: LeadStatus) => leads.filter((l) => l.status === stage).length;
  const getStageValue = (stage: LeadStatus) =>
    leads.filter((l) => l.status === stage).reduce((sum, l) => sum + l.estimatedValue, 0);

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header">
        <div>
          <div className="card-title">
            <UserCheck size={17} color="var(--purple)" />
            <span>Sales &amp; Lead Pipeline</span>
          </div>
          <div className="card-subtitle">Funnel conversion stages &amp; deal velocity</div>
        </div>

        <button
          onClick={() => navigateAndFocus('crm-leads')}
          className="btn btn-ghost btn-sm"
          style={{ color: 'var(--brand-accent)' }}
        >
          <span>Open CRM</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Summary Metrics Bar */}
      <div
        className="grid-cols-3"
        style={{
          padding: '12px 14px',
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '16px',
        }}
      >
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Pipeline</div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            ₹{(totalPipelineValue / 100000).toFixed(1)}L
          </div>
        </div>

        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Weighted Value</div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--brand-accent)', marginTop: '2px' }}>
            ₹{(expectedValue / 100000).toFixed(1)}L
          </div>
        </div>

        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Follow-ups Due</div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--warning)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={14} />
            <span>{followUpsDueCount} Pending</span>
          </div>
        </div>
      </div>

      {/* Pipeline Funnel Visual Stage Blocks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Conversion Stages
        </div>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {stages.map((st, index) => {
            const count = getStageCount(st.stage);
            const val = getStageValue(st.stage);

            return (
              <React.Fragment key={st.stage}>
                <div
                  onClick={() => navigateAndFocus('crm-leads')}
                  style={{
                    flex: 1,
                    padding: '10px 8px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: st.bg,
                    border: `1px solid ${st.color}40`,
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease, border-color 0.15s ease',
                    textAlign: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = st.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = `${st.color}40`;
                  }}
                >
                  <div style={{ fontSize: '10px', fontWeight: 700, color: st.color, textTransform: 'uppercase' }}>
                    {st.stage}
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {count}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    ₹{(val / 1000).toFixed(0)}k
                  </div>
                </div>

                {index < stages.length - 1 && (
                  <ChevronRight size={14} color="var(--border-strong)" style={{ flexShrink: 0 }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
