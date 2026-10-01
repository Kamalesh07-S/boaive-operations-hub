// Boaive Operations Hub - Main Application Container

import React from 'react';
import { ToastProvider } from './context/ToastContext';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { CommandPalette } from './components/layout/CommandPalette';
import { QuickCreateModal } from './components/layout/QuickCreateModal';

// Feature Views
import { DashboardView } from './features/dashboard/DashboardView';
import { LeadsView } from './features/crm/LeadsView';
import { ClientsView } from './features/crm/ClientsView';
import { ContactsView } from './features/crm/ContactsView';
import { ProjectsView } from './features/projects/ProjectsView';
import { TasksView } from './features/projects/TasksView';
import { InvoicesView } from './features/finance/InvoicesView';
import { ExpensesView } from './features/finance/ExpensesView';
import { AssetsView } from './features/assets/AssetsView';
import { ContentView } from './features/content/ContentView';
import { SettingsView } from './features/settings/SettingsView';

const MainLayout: React.FC = () => {
  const { currentTab } = useApp();

  const renderActiveView = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'crm-leads':
        return <LeadsView />;
      case 'crm-clients':
        return <ClientsView />;
      case 'crm-contacts':
        return <ContactsView />;
      case 'projects':
        return <ProjectsView />;
      case 'tasks':
        return <TasksView />;
      case 'finance':
        return <InvoicesView />;
      case 'expenses':
        return <ExpensesView />;
      case 'assets':
        return <AssetsView />;
      case 'content':
        return <ContentView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="app-container">
      {/* Left Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        <TopNav />

        <main className="page-content-scroll">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Overlays */}
      <CommandPalette />
      <QuickCreateModal />
    </div>
  );
};

export function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </ToastProvider>
  );
}

export default App;
