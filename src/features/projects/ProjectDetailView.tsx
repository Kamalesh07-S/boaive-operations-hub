// Boaive Operations Hub - Dedicated Project Workspace

import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Circle,
  FileText,
  Upload,
  Download,
  Plus,
  DollarSign,
  GitBranch,
  Globe,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/KpiCard';

interface ProjectDetailViewProps {
  projectId: string;
  onBack: () => void;
}

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'milestones', label: 'Milestones' },
  { id: 'files', label: 'Files' },
];

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ projectId, onBack }) => {
  const { projects, tasks, updateProject, updateTaskStatus, openQuickAdd } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  const project = projects.find((p) => p.projectId === projectId);

  if (!project) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--text-primary)' }}>Project not found</h3>
        <button className="btn btn-secondary btn-sm" onClick={onBack} style={{ marginTop: '16px' }}>
          Back to Projects List
        </button>
      </div>
    );
  }

  const projectTasks = tasks.filter((t) => t.projectId === project.projectId);
  const completedMilestones = project.milestones.filter((m) => m.completed).length;

  const mockFiles = [
    { id: 'f-1', name: 'Technical_Architecture_Design_v2.pdf', size: '4.2 MB', type: 'PDF Spec', date: '2026-09-15', user: 'Aarav Sharma' },
    { id: 'f-2', name: 'Storybook_Design_Tokens_Export.json', size: '380 KB', type: 'JSON Config', date: '2026-09-20', user: 'Rohan Mehta' },
    { id: 'f-3', name: 'HIPAA_Compliance_Audit_Report.docx', size: '1.8 MB', type: 'Word Doc', date: '2026-09-28', user: 'Priya Iyer' },
  ];

  const handleToggleMilestone = (milestoneId: string) => {
    const updatedMilestones = project.milestones.map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    const completedCount = updatedMilestones.filter((m) => m.completed).length;
    const progress = project.milestones.length > 0
      ? Math.round((completedCount / project.milestones.length) * 100)
      : project.progress;
    updateProject(project.projectId, { milestones: updatedMilestones, progress });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Back Button & Project Header */}
      <div>
        <button
          onClick={onBack}
          className="btn btn-ghost btn-sm"
          style={{ marginBottom: '12px', padding: '4px 8px', color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={14} />
          <span>Back to All Projects</span>
        </button>

        <div
          style={{
            padding: '24px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>{project.projectId}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {project.projectName}
                </h2>
                <PriorityBadge priority={project.priority} />
                <StatusBadge status={project.status} />
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Client: <strong style={{ color: 'var(--brand-accent)' }}>{project.client}</strong> · {project.serviceType} · Phase: {project.currentPhase}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Target Deadline</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--warning-text)', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                  <Calendar size={14} />
                  <span>{project.deadline}</span>
                </div>
              </div>

              <div style={{ textAlign: 'right', paddingLeft: '14px', borderLeft: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Contract Value</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                  ₹{project.projectValue.toLocaleString('en-IN')}
                </div>
              </div>

              <div style={{ textAlign: 'right', paddingLeft: '14px', borderLeft: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Outstanding</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: project.outstanding > 0 ? 'var(--danger-text)' : 'var(--success-text)', marginTop: '2px' }}>
                  ₹{project.outstanding.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700 }}>
              <span style={{ color: 'var(--text-muted)' }}>Sprint Delivery Progress</span>
              <span style={{ color: 'var(--text-primary)' }}>{project.progress}% Complete</span>
            </div>
            <ProgressBar progress={project.progress} size="lg" />
          </div>

          {/* Team & Links */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Team:</span>
              {project.assignedTeam.map((member) => (
                <span
                  key={member}
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    backgroundColor: 'var(--bg-elevated)',
                    color: 'var(--text-primary)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {member}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {project.repository && (
                <a href={project.repository} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                  <GitBranch size={13} />
                  <span>Repo</span>
                </a>
              )}
              {project.deploymentUrl && (
                <a href={project.deploymentUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                  <Globe size={13} />
                  <span>Live</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0' }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === tab.id ? '2px solid var(--brand-accent)' : '2px solid transparent',
              color: activeTab === tab.id ? 'var(--brand-accent)' : 'var(--text-muted)',
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              marginBottom: '-1px',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: Overview */}
      {activeTab === 'overview' && (
        <div className="grid-cols-3">
          <div className="card" style={{ gridColumn: 'span 2', padding: '20px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
              Project Milestones
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {project.milestones.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>No milestones defined.</div>
              ) : (
                project.milestones.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {m.completed ? (
                        <CheckCircle2 size={18} color="var(--success)" />
                      ) : (
                        <Circle size={18} color="var(--text-muted)" />
                      )}
                      <span style={{ fontSize: '13px', fontWeight: 600, color: m.completed ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: m.completed ? 'line-through' : 'none' }}>
                        {m.title}
                      </span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Due: {m.dueDate}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Financial Overview</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                ₹{project.projectValue.toLocaleString('en-IN')}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment:</span>
                <span style={{ fontWeight: 600 }}><StatusBadge status={project.paymentStatus} /></span>
              </div>
              {project.outstanding > 0 && (
                <div style={{ fontSize: '12px', color: 'var(--danger-text)', marginTop: '6px', fontWeight: 600 }}>
                  Outstanding: ₹{project.outstanding.toLocaleString('en-IN')}
                </div>
              )}
            </div>

            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Task Execution SLA</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                {projectTasks.filter((t) => t.status === 'Completed').length} / {projectTasks.length} Done
              </div>
              <div style={{ fontSize: '12px', color: 'var(--warning-text)', marginTop: '6px' }}>
                {projectTasks.filter((t) => t.status === 'Overdue').length} items currently overdue
              </div>
            </div>

            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Milestones</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                {completedMilestones} / {project.milestones.length} Complete
              </div>
              {project.clientDependency !== 'None' && (
                <div style={{ fontSize: '11px', color: 'var(--warning-text)', marginTop: '6px' }}>
                  Blocked: {project.clientDependency}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB: Tasks */}
      {activeTab === 'tasks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => openQuickAdd('task')} className="btn btn-primary btn-sm">
              <Plus size={14} />
              <span>Add Task</span>
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task ID</th>
                  <th>Task Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Assignee</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {projectTasks.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>
                      No tasks for this project yet.
                    </td>
                  </tr>
                ) : (
                  projectTasks.map((t) => (
                    <tr key={t.taskId}>
                      <td style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '11px' }}>{t.taskId}</td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.task}</div>
                        {t.notes && <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.notes}</div>}
                      </td>
                      <td><span className="badge badge-neutral">{t.category}</span></td>
                      <td><PriorityBadge priority={t.priority} /></td>
                      <td style={{ color: 'var(--text-secondary)' }}>{t.assignedTo}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{t.dueDate}</td>
                      <td><StatusBadge status={t.status} /></td>
                      <td>
                        {t.status !== 'Completed' ? (
                          <button
                            onClick={() => updateTaskStatus(t.taskId, 'Completed')}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '11px', padding: '3px 8px' }}
                          >
                            Mark Done
                          </button>
                        ) : (
                          <span style={{ fontSize: '11px', color: 'var(--success-text)', fontWeight: 700 }}>✓ Resolved</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Milestones */}
      {activeTab === 'milestones' && (
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <CheckCircle2 size={16} color="var(--brand-accent)" />
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Interactive Sprint Milestones Roadmap</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>· Click to toggle completion</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {project.milestones.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No milestones defined for this project.</div>
            ) : (
              project.milestones.map((m) => (
                <div
                  key={m.id}
                  onClick={() => handleToggleMilestone(m.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    backgroundColor: m.completed ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                    border: m.completed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {m.completed ? (
                      <CheckCircle2 size={20} color="var(--success)" />
                    ) : (
                      <Circle size={20} color="var(--text-muted)" />
                    )}
                    <div style={{ fontSize: '14px', fontWeight: 700, color: m.completed ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: m.completed ? 'line-through' : 'none' }}>
                      {m.title}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Due: {m.dueDate}</span>
                    <span className={`badge ${m.completed ? 'badge-success' : 'badge-warning'}`}>
                      {m.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB: Files */}
      {activeTab === 'files' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              padding: '32px 20px',
              border: '2px dashed var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-subtle)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Upload size={28} color="var(--brand-accent)" />
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Drop deliverables, contracts, or specs here
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              File storage will be connected to backend (S3 / Google Drive)
            </p>
            <button className="btn btn-secondary btn-sm" style={{ marginTop: '8px' }}>
              Select File to Upload
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>Format / Type</th>
                  <th>File Size</th>
                  <th>Uploaded Date</th>
                  <th>Uploaded By</th>
                  <th style={{ textAlign: 'right' }}>Download</th>
                </tr>
              </thead>
              <tbody>
                {mockFiles.map((f) => (
                  <tr key={f.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={15} color="var(--brand-accent)" />
                        <span>{f.name}</span>
                      </div>
                    </td>
                    <td><span className="badge badge-neutral">{f.type}</span></td>
                    <td style={{ color: 'var(--text-secondary)' }}>{f.size}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{f.date}</td>
                    <td style={{ color: 'var(--brand-accent)' }}>{f.user}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-ghost btn-icon-sm" title="Download File">
                        <Download size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
