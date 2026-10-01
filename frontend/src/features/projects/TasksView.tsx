// Boaive Operations Hub - Tasks Board & List View

import React, { useState } from 'react';
import {
  Plus,
  Search,
  Kanban,
  Table as TableIcon,
  Calendar,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { TaskStatus } from '../../types';

export const TasksView: React.FC = () => {
  const { tasks, updateTaskStatus, openQuickAdd } = useApp();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('ALL');

  const taskStatuses: TaskStatus[] = ['Todo', 'In Progress', 'Review', 'Completed', 'Overdue'];

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === 'ALL' || t.assignedTo === assigneeFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  const getStatusBorderColor = (st: TaskStatus) => {
    switch (st) {
      case 'Overdue': return 'var(--danger)';
      case 'In Progress': return 'var(--brand-accent)';
      case 'Completed': return 'var(--success)';
      case 'Todo': return 'var(--purple)';
      default: return 'var(--border-subtle)';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
            Operations & Engineering Tasks
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Action items across client sprints, compliance audits, and security escalations
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: '3px', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setViewMode('kanban')}
              className={`btn btn-sm ${viewMode === 'kanban' ? 'btn-secondary' : 'btn-ghost'}`}
              style={{ padding: '5px 10px' }}
            >
              <Kanban size={14} />
              <span>Kanban</span>
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

          <button onClick={() => openQuickAdd('task')} className="btn btn-primary btn-sm">
            <Plus size={15} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
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
            placeholder="Search tasks by title, project, or engineer..."
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
            style={{ padding: '6px 10px', fontSize: '12px', width: '130px' }}
          >
            <option value="ALL">All Statuses</option>
            {taskStatuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
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

          <select
            className="form-select"
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            style={{ padding: '6px 10px', fontSize: '12px', width: '150px' }}
          >
            <option value="ALL">All Assignees</option>
            <option value="Aarav Sharma">Aarav Sharma</option>
            <option value="Priya Iyer">Priya Iyer</option>
            <option value="Rohan Mehta">Rohan Mehta</option>
            <option value="Ananya Verma">Ananya Verma</option>
          </select>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(260px, 1fr))',
            gap: '16px',
            overflowX: 'auto',
            paddingBottom: '16px',
          }}
        >
          {taskStatuses.map((status) => {
            const statusTasks = filteredTasks.filter((t) => t.status === status);

            return (
              <div
                key={status}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: 'calc(100vh - 280px)',
                  minHeight: '420px',
                }}
              >
                {/* Column Header */}
                <div
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border-subtle)',
                    borderTop: `3px solid ${getStatusBorderColor(status)}`,
                    borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {status}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: 'var(--bg-elevated)',
                      color: 'var(--text-secondary)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {statusTasks.length}
                  </span>
                </div>

                {/* Task Cards Column */}
                <div
                  style={{
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    overflowY: 'auto',
                    flex: 1,
                  }}
                >
                  {statusTasks.map((task) => (
                    <div
                      key={task.taskId}
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-medium)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-subtle)';
                        e.currentTarget.style.transform = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <PriorityBadge priority={task.priority} />
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Calendar size={11} color={task.status === 'Overdue' ? 'var(--danger)' : 'var(--text-muted)'} />
                          <span style={{ color: task.status === 'Overdue' ? 'var(--danger-text)' : 'var(--text-muted)', fontWeight: task.status === 'Overdue' ? 700 : 500 }}>
                            {task.dueDate}
                          </span>
                        </span>
                      </div>

                      <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                        {task.task}
                      </h4>

                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Project: <strong style={{ color: 'var(--text-secondary)' }}>{task.project}</strong>
                      </div>

                      {/* Bottom Status Switcher */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                        <span style={{ fontSize: '11px', color: 'var(--brand-accent)', fontWeight: 600 }}>
                          {task.assignedTo}
                        </span>

                        <div style={{ display: 'flex', gap: '4px' }}>
                          {task.status !== 'Completed' ? (
                            <button
                              onClick={() => updateTaskStatus(task.taskId, 'Completed')}
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '11px', padding: '2px 8px' }}
                              title="Mark Complete"
                            >
                              <CheckCircle2 size={12} color="var(--success)" />
                              <span>Done</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => updateTaskStatus(task.taskId, 'In Progress')}
                              className="btn btn-ghost btn-sm"
                              style={{ fontSize: '11px', padding: '2px 6px' }}
                              title="Re-open Task"
                            >
                              Reopen
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {statusTasks.length === 0 && (
                    <div style={{ padding: '24px 10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                      No tasks in {status}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Task Title</th>
                <th>Project Scope</th>
                <th>Priority</th>
                <th>Assignee</th>
                <th>Target Due Date</th>
                <th>Current Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.taskId}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{task.task}</div>
                    {task.notes && (
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{task.notes}</div>
                    )}
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{task.project}</td>
                  <td><PriorityBadge priority={task.priority} /></td>
                  <td style={{ color: 'var(--brand-accent)', fontWeight: 600 }}>{task.assignedTo}</td>
                  <td>
                    <span style={{ color: task.status === 'Overdue' ? 'var(--danger-text)' : 'var(--text-secondary)', fontWeight: task.status === 'Overdue' ? 700 : 500 }}>
                      {task.dueDate}
                    </span>
                  </td>
                  <td><StatusBadge status={task.status} /></td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      {task.status !== 'Completed' ? (
                        <button
                          onClick={() => updateTaskStatus(task.taskId, 'Completed')}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '11px', padding: '3px 8px' }}
                        >
                          Mark Done
                        </button>
                      ) : (
                        <button
                          onClick={() => updateTaskStatus(task.taskId, 'In Progress')}
                          className="btn btn-ghost btn-sm"
                          style={{ fontSize: '11px', padding: '3px 8px' }}
                        >
                          Reopen
                        </button>
                      )}
                    </div>
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
