// Boaive Operations Hub - Settings & Operations Configuration

import React, { useState } from 'react';
import {
  User,
  Users,
  Shield,
  Building,
  Bell,
  Palette,
  Save,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  projectsAssigned: number;
  status: 'Online' | 'In Meeting' | 'Offline';
}

const initialTeamMembers: TeamMember[] = [
  {
    id: 'TM-001',
    name: 'Aarav Sharma',
    role: 'Lead Architect & Founder',
    email: 'aarav@boaive.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    projectsAssigned: 5,
    status: 'Online',
  },
  {
    id: 'TM-002',
    name: 'Priya Iyer',
    role: 'Senior Full Stack Engineer',
    email: 'priya@boaive.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    projectsAssigned: 4,
    status: 'Online',
  },
  {
    id: 'TM-003',
    name: 'Rohan Mehta',
    role: 'AI/ML Systems Specialist',
    email: 'rohan@boaive.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    projectsAssigned: 3,
    status: 'In Meeting',
  },
  {
    id: 'TM-004',
    name: 'Ananya Verma',
    role: 'Product & Design Lead',
    email: 'ananya@boaive.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    projectsAssigned: 4,
    status: 'Online',
  },
];

export const SettingsView: React.FC = () => {
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState('profile');

  // Profile Form State
  const [name, setName] = useState('Aarav Sharma');
  const [email, setEmail] = useState('aarav@boaive.com');
  const [role, setRole] = useState('Lead Architect');
  const [timezone, setTimezone] = useState('Asia/Kolkata (IST +5:30)');

  // Business Settings State
  const [companyLegal, setCompanyLegal] = useState('Boaive Technologies Private Limited');
  const [gstin, setGstin] = useState('07AAAAA0000A1Z5');
  const [currency, setCurrency] = useState('INR (₹)');
  const [billingEmail, setBillingEmail] = useState('accounts@boaive.com');

  // Notifications Config
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [overdueAlerts, setOverdueAlerts] = useState(true);
  const [sslRenewalAlerts, setSslRenewalAlerts] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Configuration updated successfully', 'success', 'Settings Saved');
  };

  const sections = [
    { id: 'profile', label: 'User Profile', icon: <User size={15} /> },
    { id: 'team', label: 'Team Directory', icon: <Users size={15} /> },
    { id: 'permissions', label: 'Roles & Permissions', icon: <Shield size={15} /> },
    { id: 'business', label: 'Business & Entity', icon: <Building size={15} /> },
    { id: 'notifications', label: 'Notification Preferences', icon: <Bell size={15} /> },
    { id: 'appearance', label: 'Appearance & UI Tokens', icon: <Palette size={15} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
          Workspace & Operations Settings
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Configure internal Boaive team accounts, access matrices, billing info, and alert triggers
        </p>
      </div>

      {/* Main Settings Split View */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px' }}>
        {/* Left Sub-nav */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            backgroundColor: 'var(--bg-card)',
            padding: '12px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            height: 'fit-content',
          }}
        >
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`btn btn-sm ${activeSection === sec.id ? 'btn-secondary' : 'btn-ghost'}`}
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                fontWeight: activeSection === sec.id ? 700 : 500,
                color: activeSection === sec.id ? 'var(--brand-accent)' : 'var(--text-secondary)',
              }}
            >
              {sec.icon}
              <span>{sec.label}</span>
            </button>
          ))}
        </div>

        {/* Right Details Panel */}
        <div className="card" style={{ padding: '24px' }}>
          {/* PROFILE SECTION */}
          {activeSection === 'profile' && (
            <form onSubmit={handleSave}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>
                Your Profile Details
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Avatar"
                  style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--brand-accent)' }}
                />
                <div>
                  <button type="button" className="btn btn-secondary btn-sm">
                    Change Avatar
                  </button>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    JPG, PNG or WebP (max 2MB)
                  </div>
                </div>
              </div>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Operational Role</label>
                  <input
                    type="text"
                    className="form-input"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Default Timezone</label>
                  <input
                    type="text"
                    className="form-input"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>
                <Save size={14} />
                <span>Save Profile Changes</span>
              </button>
            </form>
          )}

          {/* TEAM SECTION */}
          {activeSection === 'team' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Boaive Core Operations Team
                </h3>
                <button type="button" className="btn btn-primary btn-sm">
                  Invite Team Member
                </button>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Team Member</th>
                      <th>Role & Title</th>
                      <th>Email</th>
                      <th>Active Sprints</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {initialTeamMembers.map((member) => (
                      <tr key={member.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img
                              src={member.avatar}
                              alt={member.name}
                              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <span style={{ fontWeight: 700 }}>{member.name}</span>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-secondary)' }}>{member.role}</td>
                        <td style={{ color: 'var(--brand-accent)' }}>{member.email}</td>
                        <td>{member.projectsAssigned} Projects</td>
                        <td>
                          <span className={`badge ${member.status === 'Online' ? 'badge-success' : 'badge-warning'}`}>
                            {member.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PERMISSIONS SECTION */}
          {activeSection === 'permissions' && (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Roles & Access Matrix
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Granular permission controls prepared for PostgreSQL role-based authorization backend.
              </p>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Module / Resource</th>
                      <th>Super Admin</th>
                      <th>Project Lead</th>
                      <th>Engineer</th>
                      <th>Finance Ops</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { mod: 'CRM & Leads Pipeline', sa: 'Full Access', pl: 'View & Edit', eng: 'View Only', fo: 'View Only' },
                      { mod: 'Projects & Milestones', sa: 'Full Access', pl: 'Full Access', eng: 'Edit Assigned', fo: 'View Only' },
                      { mod: 'Invoices & Billing', sa: 'Full Access', pl: 'View Only', eng: 'No Access', fo: 'Full Access' },
                      { mod: 'Infrastructure & SSL', sa: 'Full Access', pl: 'Edit', eng: 'Edit', fo: 'View Only' },
                      { mod: 'Workspace Settings', sa: 'Full Access', pl: 'No Access', eng: 'No Access', fo: 'No Access' },
                    ].map((row) => (
                      <tr key={row.mod}>
                        <td style={{ fontWeight: 700 }}>{row.mod}</td>
                        <td><span className="badge badge-success">{row.sa}</span></td>
                        <td><span className="badge badge-info">{row.pl}</span></td>
                        <td><span className="badge badge-neutral">{row.eng}</span></td>
                        <td><span className="badge badge-purple">{row.fo}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BUSINESS SETTINGS SECTION */}
          {activeSection === 'business' && (
            <form onSubmit={handleSave}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>
                Business Entity & Invoicing Defaults
              </h3>

              <div className="form-group">
                <label className="form-label">Legal Registered Entity Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={companyLegal}
                  onChange={(e) => setCompanyLegal(e.target.value)}
                />
              </div>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">GSTIN / Tax ID</label>
                  <input
                    type="text"
                    className="form-input"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Operating Currency</label>
                  <input
                    type="text"
                    className="form-input"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Central Invoicing & Billing Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={billingEmail}
                  onChange={(e) => setBillingEmail(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>
                <Save size={14} />
                <span>Save Entity Settings</span>
              </button>
            </form>
          )}

          {/* NOTIFICATION SETTINGS */}
          {activeSection === 'notifications' && (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>
                Operations Alert Subscriptions
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                  />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Daily Operations Morning Briefing
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Receive daily 9:00 AM summary of pending follow-ups and overdue tasks
                    </div>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={overdueAlerts}
                    onChange={(e) => setOverdueAlerts(e.target.checked)}
                  />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Immediate Overdue Invoice Alerts
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Instant notification when Net-15 grace period lapses on unpaid invoices
                    </div>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={sslRenewalAlerts}
                    onChange={(e) => setSslRenewalAlerts(e.target.checked)}
                  />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      SSL & Domain 30-Day Warning Escalations
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Prevent production API outages with advance SSL expiration notifications
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* APPEARANCE SETTINGS */}
          {activeSection === 'appearance' && (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>
                Operations Theme & Density
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Brand Accent Palette
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {[
                      { name: 'Boaive Cyan (Default)', color: '#0284c7' },
                      { name: 'Deep Indigo', color: '#6366f1' },
                      { name: 'Emerald Ops', color: '#10b981' },
                      { name: 'Violet Enterprise', color: '#a855f7' },
                    ].map((c) => (
                      <div
                        key={c.name}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--bg-subtle)',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: c.color }} />
                        <span>{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Layout Density
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-secondary btn-sm">Standard (Recommended)</button>
                    <button className="btn btn-ghost btn-sm">Compact Dense</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
