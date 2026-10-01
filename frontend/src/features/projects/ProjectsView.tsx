// Boaive Operations Hub - Projects Directory View

import React, { useState } from 'react';
import {
  Plus,
  Search,
  Calendar,
  Grid,
  Table as TableIcon,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/KpiCard';
import { ProjectDetailView } from './ProjectDetailView';

export const ProjectsView: React.FC = () => {
  const { projects, tasks, selectedProjectId, setSelectedProjectId, openQuickAdd } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  if (selectedProjectId) {
    return <ProjectDetailView projectId={selectedProjectId} onBack={() => setSelectedProjectId(null)} />;
  }

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.assignedTeam.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || p.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
            Active Client Projects &amp; Sprints
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Sprint execution velocity, milestone deliverables, and engineering allocation
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: '3px', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setViewMode('grid')}
              className={`btn btn-sm ${viewMode === 'grid' ? 'btn-secondary' : 'btn-ghost'}`}
              style={{ padding: '5px 10px' }}
            >
              <Grid size={14} />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`btn btn-sm ${viewMode === 'table' ? 'btn-secondary' : 'btn-ghost'}`}
              style={{ padding: '5px 10px' }}
            >
              <TableIcon size={14} />
              <span>Table</span>
            </button>
          </div>

          <button onClick={() => openQuickAdd('project')} className="btn btn-primary btn-sm">
            <Plus size={15} />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Toolbar Filters */}
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
            placeholder="Search projects by name, client, or engineer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ padding: '6px 10px', fontSize: '13px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '6px 10px', fontSize: '12px', width: '160px' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="Open Work">Open Work</option>
            <option value="In Progress">In Progress</option>
            <option value="Testing">Testing</option>
            <option value="Awaiting Client">Awaiting Client</option>
            <option value="On Hold">On Hold</option>
            <option value="Overdue">Overdue</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            className="form-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{ padding: '6px 10px', fontSize: '12px', width: '130px' }}
          >
            <option value="ALL">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid-cols-3">
          {filteredProjects.map((project) => {
            const projectTasks = tasks.filter((t) => t.projectId === project.projectId);
            const completedTasks = projectTasks.filter((t) => t.status === 'Completed').length;

            return (
              <div
                key={project.projectId}
                onClick={() => setSelectedProjectId(project.projectId)}
                className="card card-clickable"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px', cursor: 'pointer' }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ minWidth: 0, paddingRight: '8px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>{project.projectId}</span>
                      <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                        {project.projectName}
                      </h3>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Client: <strong style={{ color: 'var(--brand-accent)' }}>{project.client}</strong>
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                      <StatusBadge status={project.status} />
                      <PriorityBadge priority={project.priority} />
                    </div>
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    Phase: <strong>{project.currentPhase}</strong> · {project.serviceType}
                  </div>

                  {/* Progress */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Progress</span>
                      <span style={{ color: 'var(--text-primary)' }}>{project.progress}%</span>
                    </div>
                    <ProgressBar progress={project.progress} size="md" />
                  </div>
                </div>

                {/* Bottom Meta */}
                <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} color="var(--warning)" />
                    <span>Due: <strong style={{ color: 'var(--text-secondary)' }}>{project.deadline}</strong></span>
                  </div>

                  <div>
                    {completedTasks}/{projectTasks.length} tasks done
                  </div>
                </div>
              </div>
            );
          })}

          {filteredProjects.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
              No projects match your filters.
            </div>
          )}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Project Name</th>
                <th>Client</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Progress</th>
                <th>Deadline</th>
                <th>Team</th>
                <th style={{ textAlign: 'right' }}>Detail</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr
                  key={project.projectId}
                  onClick={() => setSelectedProjectId(project.projectId)}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '11px' }}>{project.projectId}</td>
                  <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{project.projectName}</td>
                  <td style={{ fontWeight: 600, color: 'var(--brand-accent)' }}>{project.client}</td>
                  <td><StatusBadge status={project.status} /></td>
                  <td><PriorityBadge priority={project.priority} /></td>
                  <td style={{ width: '160px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ProgressBar progress={project.progress} size="sm" />
                      <span style={{ fontSize: '11px', fontWeight: 700 }}>{project.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: project.deadline <= '2026-10-06' ? 'var(--warning-text)' : 'var(--text-secondary)' }}>
                      {project.deadline}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {project.assignedTeam.join(', ')}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-ghost btn-icon-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProjectId(project.projectId);
                      }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
