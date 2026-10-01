// Boaive Operations Hub - Command Palette (⌘K)

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  UserCheck,
  Users,
  Layers,
  CheckSquare,
  Receipt,
  Server,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { useApp, QuickAddType } from '../../context/AppContext';
import { searchService } from '../../services/crmService';
import { SearchResultItem } from '../../types';

export const CommandPalette: React.FC = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    navigateAndFocus,
    openQuickAdd,
  } = useApp();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const executeSearch = async () => {
      const res = await searchService.searchAll(query);
      setResults(res);
      setSelectedIndex(0);
    };
    executeSearch();
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setCommandPaletteOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelectResult(results[selectedIndex]);
      }
    }
  };

  const handleSelectResult = (item: SearchResultItem) => {
    navigateAndFocus(item.targetTab, item.targetId);
    setCommandPaletteOpen(false);
  };

  const handleQuickAction = (type: QuickAddType) => {
    setCommandPaletteOpen(false);
    openQuickAdd(type);
  };

  if (!commandPaletteOpen) return null;

  return (
    <div
      className="modal-backdrop"
      style={{ alignItems: 'flex-start', paddingTop: '12vh' }}
      onClick={() => setCommandPaletteOpen(false)}
    >
      <div
        className="modal-content"
        style={{
          maxWidth: '600px',
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid var(--border-strong)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <Search size={20} color="var(--brand-accent)" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients, leads, tasks, finance, assets..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '15px',
              fontWeight: 500,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="btn btn-ghost btn-icon-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={14} />
            </button>
          )}
          <kbd
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              padding: '2px 6px',
              borderRadius: 'var(--radius-xs)',
              backgroundColor: 'var(--bg-subtle-hover)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results / Suggestions Container */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '12px' }}>
          {query.trim() === '' ? (
            /* Quick suggestions when query is empty */
            <div>
              <div style={{ padding: '6px 10px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Quick Add Actions
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <button
                  onClick={() => handleQuickAction('task')}
                  className="btn btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 12px' }}
                >
                  <Plus size={16} color="var(--brand-accent)" />
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Create New Task</span>
                </button>
                <button
                  onClick={() => handleQuickAction('lead')}
                  className="btn btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 12px' }}
                >
                  <Plus size={16} color="var(--purple)" />
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Register New Lead</span>
                </button>
                <button
                  onClick={() => handleQuickAction('finance')}
                  className="btn btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 12px' }}
                >
                  <Plus size={16} color="var(--warning)" />
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Record Finance / Invoice</span>
                </button>
              </div>

              <div style={{ padding: '14px 10px 6px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Navigation Shortcuts
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <button
                  onClick={() => {
                    navigateAndFocus('projects');
                    setCommandPaletteOpen(false);
                  }}
                  className="btn btn-ghost"
                  style={{ width: '100%', justifyContent: 'space-between', padding: '10px 12px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Layers size={16} color="var(--brand-accent)" />
                    <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Active Projects & Workstreams</span>
                  </div>
                  <ArrowRight size={14} color="var(--text-muted)" />
                </button>
                <button
                  onClick={() => {
                    navigateAndFocus('finance');
                    setCommandPaletteOpen(false);
                  }}
                  className="btn btn-ghost"
                  style={{ width: '100%', justifyContent: 'space-between', padding: '10px 12px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Receipt size={16} color="var(--warning)" />
                    <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>View Financial Cash Flow & Invoices</span>
                  </div>
                  <ArrowRight size={14} color="var(--text-muted)" />
                </button>
              </div>
            </div>
          ) : results.length === 0 ? (
            /* No results found */
            <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>No matching results found for "{query}"</p>
              <p style={{ fontSize: '12px', marginTop: '4px' }}>Try searching by client name, transaction ID, lead, or project.</p>
            </div>
          ) : (
            /* Categorized Results */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {results.map((item, index) => {
                const isSelected = index === selectedIndex;
                const getCategoryIcon = () => {
                  switch (item.category) {
                    case 'CLIENTS':
                      return <Users size={16} color="var(--brand-accent)" />;
                    case 'LEADS':
                      return <UserCheck size={16} color="var(--purple)" />;
                    case 'PROJECTS':
                      return <Layers size={16} color="var(--info)" />;
                    case 'TASKS':
                      return <CheckSquare size={16} color="var(--success)" />;
                    case 'FINANCE':
                      return <Receipt size={16} color="var(--warning)" />;
                    case 'ASSETS':
                      return <Server size={16} color="var(--text-secondary)" />;
                    default:
                      return <Search size={16} />;
                  }
                };

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectResult(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected ? 'var(--bg-subtle-hover)' : 'transparent',
                      border: isSelected ? '1px solid var(--border-medium)' : '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'background-color 0.1s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      <div style={{ flexShrink: 0 }}>{getCategoryIcon()}</div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.subtitle}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: 'var(--radius-xs)',
                          backgroundColor: 'var(--bg-card)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        {item.category}
                      </span>
                      <ArrowRight size={14} color={isSelected ? 'var(--brand-accent)' : 'transparent'} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div
          style={{
            padding: '10px 16px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: 'var(--text-muted)',
          }}
        >
          <span>Use ↑ and ↓ keys to navigate, ↵ Enter to open</span>
          <span>Boaive Unified Indexer</span>
        </div>
      </div>
    </div>
  );
};
