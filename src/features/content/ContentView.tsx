// Boaive Operations Hub - Content Calendar & Publishing

import React, { useState } from 'react';
import {
  Plus,
  Search,
  Clock,
  List,
  CalendarDays,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/Badge';
import { ContentPlatform, ContentStatus } from '../../types';

export const ContentView: React.FC = () => {
  const { content, updateContentStatus, openQuickAdd } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const platforms: ContentPlatform[] = ['LinkedIn', 'Twitter/X', 'Blog', 'Newsletter', 'YouTube', 'Case Study'];
  const statuses: ContentStatus[] = ['Idea', 'Draft', 'Review', 'Scheduled', 'Published'];

  const filteredContent = content.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.notes || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = platformFilter === 'ALL' || item.platform === platformFilter;
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const getPlatformBadge = (platform: ContentPlatform) => {
    switch (platform) {
      case 'LinkedIn': return <span className="badge badge-info">LinkedIn</span>;
      case 'Blog': return <span className="badge badge-purple">Tech Blog</span>;
      case 'Twitter/X': return <span className="badge badge-neutral">Twitter / X</span>;
      case 'Newsletter': return <span className="badge badge-warning">Newsletter</span>;
      case 'YouTube': return <span className="badge badge-danger">YouTube</span>;
      default: return <span className="badge badge-neutral">{platform}</span>;
    }
  };

  // Calendar dates for mock calendar grid (e.g. October 2026)
  const calendarDays = Array.from({ length: 31 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-10-${dayNum < 10 ? `0${dayNum}` : dayNum}`;
    const itemsOnDay = content.filter((c) => c.scheduledDate === dateStr);
    return { dayNum, dateStr, itemsOnDay };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
            Content Calendar & Brand Communications
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Schedule case studies, engineering blogs, social threads, and operations newsletters
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: '3px', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setViewMode('list')}
              className={`btn btn-sm ${viewMode === 'list' ? 'btn-secondary' : 'btn-ghost'}`}
              style={{ padding: '5px 10px' }}
            >
              <List size={14} />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`btn btn-sm ${viewMode === 'calendar' ? 'btn-secondary' : 'btn-ghost'}`}
              style={{ padding: '5px 10px' }}
            >
              <CalendarDays size={14} />
              <span>Month Calendar</span>
            </button>
          </div>

          <button onClick={() => openQuickAdd('content')} className="btn btn-primary btn-sm">
            <Plus size={15} />
            <span>Schedule Content</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
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
            placeholder="Search content by title, brief or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ padding: '6px 10px', fontSize: '13px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            className="form-select"
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            style={{ padding: '6px 10px', fontSize: '12px', width: '150px' }}
          >
            <option value="ALL">All Channels</option>
            {platforms.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '6px 10px', fontSize: '12px', width: '140px' }}
          >
            <option value="ALL">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title / Publication Topic</th>
                <th>Channel Platform</th>
                <th>Editorial Status</th>
                <th>Scheduled Date</th>
                <th>Author / Owner</th>
                <th style={{ textAlign: 'right' }}>Status Update</th>
              </tr>
            </thead>
            <tbody>
              {filteredContent.map((item) => (
                <tr key={item.contentId}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.title}</div>
                    {item.notes && (
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {item.notes}
                      </div>
                    )}
                  </td>
                  <td>{getPlatformBadge(item.platform)}</td>
                  <td><StatusBadge status={item.status} /></td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Clock size={13} color="var(--brand-accent)" />
                      <span>{item.scheduledDate}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--brand-accent)', fontWeight: 600 }}>{item.author}</td>
                  <td style={{ textAlign: 'right' }}>
                    <select
                      className="form-select"
                      value={item.status}
                      onChange={(e) => updateContentStatus(item.contentId, e.target.value as ContentStatus)}
                      style={{ padding: '4px 8px', fontSize: '11px', width: '110px' }}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MONTH CALENDAR VIEW */}
      {viewMode === 'calendar' && (
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
              October 2026 Content Schedule
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {content.length} Total Editorial Deliverables
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '8px',
            }}
          >
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div
                key={day}
                style={{
                  textAlign: 'center',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  padding: '6px',
                }}
              >
                {day}
              </div>
            ))}

            {calendarDays.slice(0, 28).map((day) => (
              <div
                key={day.dateStr}
                style={{
                  backgroundColor: day.itemsOnDay.length > 0 ? 'var(--bg-elevated)' : 'var(--bg-subtle)',
                  border: day.itemsOnDay.length > 0 ? '1px solid var(--brand-accent)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  minHeight: '85px',
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  {day.dayNum}
                </div>

                {day.itemsOnDay.map((item) => (
                  <div
                    key={item.contentId}
                    style={{
                      fontSize: '10px',
                      padding: '3px 6px',
                      borderRadius: 'var(--radius-xs)',
                      backgroundColor: 'var(--brand-glow)',
                      color: 'var(--brand-accent)',
                      fontWeight: 700,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={item.title}
                  >
                    {item.platform}: {item.title}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
