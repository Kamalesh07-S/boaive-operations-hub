// Boaive Operations Hub - Top Navigation Bar

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  MessageSquare,
  Plus,
  ChevronDown,
  UserCheck,
  Users,
  Layers,
  CheckSquare,
  Receipt,
  CreditCard,
  Server,
  Calendar,
} from 'lucide-react';
import { useApp, QuickAddType } from '../../context/AppContext';

export const TopNav: React.FC = () => {
  const {
    currentTab,
    setCommandPaletteOpen,
    openQuickAdd,
    setAssistantModalOpen,
    setNotificationsDrawerOpen,
    settings,
    tasks,
    finance,
    selectedProjectId,
    selectedClientId,
  } = useApp();

  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setCreateMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    if (selectedProjectId) return 'Project Workspace';
    if (selectedClientId) return 'Client Overview';

    switch (currentTab) {
      case 'dashboard': return 'Operations Dashboard';
      case 'crm-clients': return 'Clients';
      case 'crm-contacts': return 'Contacts';
      case 'crm-leads': return 'Leads & Pipeline';
      case 'projects': return 'Projects';
      case 'tasks': return 'Tasks';
      case 'finance': return 'Finance';
      case 'expenses': return 'Expenses';
      case 'assets': return 'Assets';
      case 'content': return 'Content Calendar';
      case 'settings': return 'Settings & Data Health';
      default: return 'Boaive Operations';
    }
  };

  const handleQuickAddClick = (type: QuickAddType) => {
    setCreateMenuOpen(false);
    openQuickAdd(type);
  };

  const overdueCount = tasks.filter((t) => t.status === 'Overdue').length + finance.filter((f) => f.paymentStatus === 'Overdue').length;

  return (
    <header
      style={{
        height: 'var(--topbar-height)',
        backgroundColor: 'var(--bg-topbar)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Left: Title and As-of Date */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <h1 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
          {getPageTitle()}
        </h1>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          As of: {settings.asOfDate}
        </span>
      </div>

      {/* Middle: Search Box Trigger (⌘K) */}
      <div style={{ flex: 1, maxWidth: '380px', margin: '0 20px' }}>
        <div
          onClick={() => setCommandPaletteOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '5px 10px',
            cursor: 'pointer',
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Search size={14} />
            <span>Search records (⌘K)...</span>
          </div>
          <kbd style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', padding: '1px 5px', borderRadius: '3px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1' }}>
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* + Add Dropdown */}
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button
            onClick={() => setCreateMenuOpen(!createMenuOpen)}
            className="btn btn-primary btn-sm"
          >
            <Plus size={13} />
            <span>Add</span>
            <ChevronDown size={12} />
          </button>

          {createMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '4px',
                width: '170px',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '4px',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <button onClick={() => handleQuickAddClick('client')} className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <Users size={13} />
                <span>Client</span>
              </button>
              <button onClick={() => handleQuickAddClick('lead')} className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <UserCheck size={13} />
                <span>Lead</span>
              </button>
              <button onClick={() => handleQuickAddClick('project')} className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <Layers size={13} />
                <span>Project</span>
              </button>
              <button onClick={() => handleQuickAddClick('task')} className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <CheckSquare size={13} />
                <span>Task</span>
              </button>
              <button onClick={() => handleQuickAddClick('finance')} className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <Receipt size={13} />
                <span>Transaction</span>
              </button>
              <button onClick={() => handleQuickAddClick('expense')} className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <CreditCard size={13} />
                <span>Expense</span>
              </button>
              <button onClick={() => handleQuickAddClick('asset')} className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <Server size={13} />
                <span>Asset</span>
              </button>
              <button onClick={() => handleQuickAddClick('content')} className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <Calendar size={13} />
                <span>Content</span>
              </button>
            </div>
          )}
        </div>

        {/* Minimal Assistant Button */}
        <button
          onClick={() => setAssistantModalOpen(true)}
          className="btn btn-secondary btn-icon-sm"
          title="Assistant Query"
        >
          <MessageSquare size={14} />
        </button>

        {/* Notifications Icon Button */}
        <button
          onClick={() => setNotificationsDrawerOpen(true)}
          className="btn btn-secondary btn-icon-sm"
          style={{ position: 'relative' }}
          title="Operations Alerts"
        >
          <Bell size={14} />
          {overdueCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '3px',
                right: '3px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--danger)',
              }}
            />
          )}
        </button>

        {/* Profile */}
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: '#090d16',
            color: '#ffffff',
            fontSize: '11px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '4px',
            cursor: 'pointer',
          }}
          title="Aarav Sharma"
        >
          AS
        </div>
      </div>
    </header>
  );
};
