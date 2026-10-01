// Boaive Operations Hub - Minimal Dark Sidebar

import React from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  UserCheck,
  Layers,
  CheckSquare,
  Receipt,
  CreditCard,
  Server,
  Calendar,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';

export const Sidebar: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    sidebarCollapsed,
    toggleSidebar,
    setSelectedProjectId,
    setSelectedClientId,
    setNotificationsDrawerOpen,
    tasks,
    finance,
    assets,
  } = useApp();

  const handleNavClick = (tab: NavigationTab) => {
    setSelectedProjectId(null);
    setSelectedClientId(null);
    setCurrentTab(tab);
  };

  const overdueTasksCount = tasks.filter((t) => t.status === 'Overdue').length;
  const overdueInvoicesCount = finance.filter((f) => f.paymentStatus === 'Overdue').length;
  const expiringAssetsCount = assets.filter((a) => a.renewalStatus === '🔴 Expired' || a.renewalStatus === '🟡 Renew Soon').length;

  return (
    <aside
      style={{
        width: sidebarCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width-expanded)',
        minWidth: sidebarCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width-expanded)',
        height: '100vh',
        backgroundColor: 'var(--bg-sidebar)',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        transition: 'width 0.15s ease, min-width 0.15s ease',
        userSelect: 'none',
        zIndex: 50,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          height: 'var(--topbar-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          padding: sidebarCollapsed ? '0' : '0 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div
          onClick={() => handleNavClick('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
          }}
        >
          {/* Minimal Monochromatic Brand Box */}
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#090d16',
              fontWeight: 900,
              fontSize: '14px',
              flexShrink: 0,
            }}
          >
            B
          </div>

          {!sidebarCollapsed && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', letterSpacing: '0.04em' }}>
                BOAIVE
              </span>
              <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>
                Operations System
              </span>
            </div>
          )}
        </div>

        {!sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="btn btn-ghost btn-icon-sm"
            style={{ color: '#94a3b8', padding: '2px' }}
            title="Collapse Sidebar"
          >
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      {/* Navigation Links Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: sidebarCollapsed ? '12px 6px' : '12px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {/* Top: Dashboard */}
        <SidebarNavItem
          icon={<LayoutDashboard size={16} />}
          label="Dashboard"
          active={currentTab === 'dashboard'}
          collapsed={sidebarCollapsed}
          onClick={() => handleNavClick('dashboard')}
        />

        {/* Group: CRM */}
        <div>
          {!sidebarCollapsed && (
            <div style={{ padding: '2px 10px 4px', fontSize: '10px', fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              CRM
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <SidebarNavItem
              icon={<Users size={16} />}
              label="Clients"
              active={currentTab === 'crm-clients'}
              collapsed={sidebarCollapsed}
              badge={6}
              onClick={() => handleNavClick('crm-clients')}
            />
            <SidebarNavItem
              icon={<Briefcase size={16} />}
              label="Contacts"
              active={currentTab === 'crm-contacts'}
              collapsed={sidebarCollapsed}
              onClick={() => handleNavClick('crm-contacts')}
            />
            <SidebarNavItem
              icon={<UserCheck size={16} />}
              label="Leads"
              active={currentTab === 'crm-leads'}
              collapsed={sidebarCollapsed}
              badge={6}
              onClick={() => handleNavClick('crm-leads')}
            />
          </div>
        </div>

        {/* Group: Delivery */}
        <div>
          {!sidebarCollapsed && (
            <div style={{ padding: '2px 10px 4px', fontSize: '10px', fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Delivery
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <SidebarNavItem
              icon={<Layers size={16} />}
              label="Projects"
              active={currentTab === 'projects'}
              collapsed={sidebarCollapsed}
              badge={5}
              onClick={() => handleNavClick('projects')}
            />
            <SidebarNavItem
              icon={<CheckSquare size={16} />}
              label="Tasks"
              active={currentTab === 'tasks'}
              collapsed={sidebarCollapsed}
              badge={overdueTasksCount > 0 ? `${overdueTasksCount} overdue` : undefined}
              badgeVariant="danger"
              onClick={() => handleNavClick('tasks')}
            />
          </div>
        </div>

        {/* Group: Finance */}
        <div>
          {!sidebarCollapsed && (
            <div style={{ padding: '2px 10px 4px', fontSize: '10px', fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Finance
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <SidebarNavItem
              icon={<Receipt size={16} />}
              label="Finance"
              active={currentTab === 'finance'}
              collapsed={sidebarCollapsed}
              badge={overdueInvoicesCount > 0 ? `₹25k due` : undefined}
              badgeVariant="danger"
              onClick={() => handleNavClick('finance')}
            />
            <SidebarNavItem
              icon={<CreditCard size={16} />}
              label="Expenses"
              active={currentTab === 'expenses'}
              collapsed={sidebarCollapsed}
              onClick={() => handleNavClick('expenses')}
            />
          </div>
        </div>

        {/* Group: Operations */}
        <div>
          {!sidebarCollapsed && (
            <div style={{ padding: '2px 10px 4px', fontSize: '10px', fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Operations
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <SidebarNavItem
              icon={<Server size={16} />}
              label="Assets"
              active={currentTab === 'assets'}
              collapsed={sidebarCollapsed}
              badge={expiringAssetsCount > 0 ? expiringAssetsCount : undefined}
              badgeVariant="warning"
              onClick={() => handleNavClick('assets')}
            />
          </div>
        </div>

        {/* Group: Marketing */}
        <div>
          {!sidebarCollapsed && (
            <div style={{ padding: '2px 10px 4px', fontSize: '10px', fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Marketing
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <SidebarNavItem
              icon={<Calendar size={16} />}
              label="Content"
              active={currentTab === 'content'}
              collapsed={sidebarCollapsed}
              onClick={() => handleNavClick('content')}
            />
          </div>
        </div>

        {/* Settings */}
        <SidebarNavItem
          icon={<Settings size={16} />}
          label="Settings"
          active={currentTab === 'settings'}
          collapsed={sidebarCollapsed}
          onClick={() => handleNavClick('settings')}
        />
      </div>

      {/* Bottom Footer Area */}
      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: sidebarCollapsed ? '10px 6px' : '10px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        <button
          onClick={() => setNotificationsDrawerOpen(true)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: sidebarCollapsed ? '8px 0' : '6px 10px',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            borderRadius: 'var(--radius-md)',
            background: 'transparent',
            border: 'none',
            color: '#cbd5e1',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
          title="Notifications"
        >
          <Bell size={15} />
          {!sidebarCollapsed && <span>Notifications</span>}
          {!sidebarCollapsed && overdueTasksCount > 0 && (
            <span style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--danger)' }} />
          )}
        </button>

        {/* User Profile Mini Tab */}
        <div
          onClick={() => handleNavClick('settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: sidebarCollapsed ? '6px 0' : '6px 8px',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              color: '#090d16',
              fontSize: '11px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            AS
          </div>
          {!sidebarCollapsed && (
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap' }}>Aarav Sharma</span>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>Lead Architect</span>
            </div>
          )}
        </div>

        {sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="btn btn-ghost btn-icon-sm"
            style={{ width: '100%', color: '#94a3b8', marginTop: '2px' }}
            title="Expand Sidebar"
          >
            <ChevronRight size={14} />
          </button>
        )}
      </div>
    </aside>
  );
};

interface SidebarNavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  collapsed: boolean;
  badge?: string | number;
  badgeVariant?: 'danger' | 'warning';
  onClick: () => void;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  icon,
  label,
  active,
  collapsed,
  badge,
  badgeVariant = 'warning',
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '9px',
        padding: collapsed ? '8px 0' : '6px 10px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius: 'var(--radius-md)',
        border: 'none',
        backgroundColor: active ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
        color: active ? '#ffffff' : '#cbd5e1',
        fontWeight: active ? 700 : 500,
        fontSize: '12px',
        cursor: 'pointer',
        transition: 'background-color 0.12s ease',
      }}
      title={collapsed ? label : undefined}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icon}</div>
      {!collapsed && <span style={{ flex: 1, textAlign: 'left', whiteSpace: 'nowrap' }}>{label}</span>}
      {!collapsed && badge !== undefined && (
        <span
          style={{
            fontSize: '10px',
            fontWeight: 700,
            padding: '1px 5px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: badgeVariant === 'danger' ? 'rgba(220, 38, 38, 0.25)' : 'rgba(217, 119, 6, 0.25)',
            color: badgeVariant === 'danger' ? '#fca5a5' : '#fcd34d',
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
};
