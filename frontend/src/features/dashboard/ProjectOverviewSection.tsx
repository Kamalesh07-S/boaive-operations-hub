// Boaive Operations Hub - Project Overview Section

import React from 'react';
import { Layers, ArrowRight, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/KpiCard';

export const ProjectOverviewSection: React.FC = () => {
  const { projects, tasks, navigateAndFocus } = useApp();

  const activeProjects = projects
    .filter((p) => p.status !== 'Completed' && p.status !== 'Cancelled')
    .slice(0, 4);

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header">
        <div>
          <div className="card-title">
            <Layers size={17} color="var(--brand-accent)" />
            <span>Active Project Delivery</span>
          </div>
          <div className="card-subtitle">Sprint progress, deadlines &amp; deliverable health</div>
        </div>

        <button
          onClick={() => navigateAndFocus('projects')}
          className="btn btn-ghost btn-sm"
          style={{ color: 'var(--brand-accent)' }}
        >
          <span>View All ({projects.length})</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {activeProjects.map((project) => {
          const projectTasks = tasks.filter((t) => t.projectId === project.projectId);
          const completedTasks = projectTasks.filter((t) => t.status === 'Completed').length;

          return (
            <div
              key={project.projectId}
              onClick={() => navigateAndFocus('projects', project.projectId)}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
                e.currentTarget.style.borderColor = 'var(--border-medium)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {project.projectName}
                  </h4>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Client: <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{project.client}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <PriorityBadge priority={project.priority} />
                  <StatusBadge status={project.status} />
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ margin: '12px 0 10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Deliverable Progress</span>
                  <span style={{ color: 'var(--text-primary)' }}>{project.progress}%</span>
                </div>
                <ProgressBar progress={project.progress} size="md" />
              </div>

              {/* Meta Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Calendar size={13} color="var(--warning)" />
                  <span>Due: <strong style={{ color: 'var(--text-secondary)' }}>{project.deadline}</strong></span>
                </div>
                <div>
                  {completedTasks}/{projectTasks.length} Tasks · Phase: {project.currentPhase}
                </div>
              </div>
            </div>
          );
        })}

        {activeProjects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
            No active projects
          </div>
        )}
      </div>
    </div>
  );
};
