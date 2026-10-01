// Boaive Operations Hub - CRM Contacts Directory

import React, { useState } from 'react';
import {
  Search,
  Plus,
  Mail,
  Phone,
  Building2,
  Grid,
  Table as TableIcon,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ContactsView: React.FC = () => {
  const { contacts, openQuickAdd } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredContacts = contacts.filter((c) => {
    return (
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
            Key Stakeholders &amp; Contacts
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Executive contacts, engineering leads, and billing liaisons across client accounts
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

          <button onClick={() => openQuickAdd('contact')} className="btn btn-primary btn-sm">
            <Plus size={15} />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--bg-card)',
          padding: '10px 16px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <Search size={16} color="var(--text-muted)" style={{ marginRight: '10px' }} />
        <input
          type="text"
          placeholder="Search contacts by name, organization, role, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input"
          style={{ border: 'none', background: 'transparent', padding: '4px 0' }}
        />
      </div>

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid-cols-3">
          {filteredContacts.map((contact) => (
            <div key={contact.contactId} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--bg-elevated)',
                        border: '1px solid var(--border-medium)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '14px',
                        color: 'var(--brand-accent)',
                      }}
                    >
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {contact.name}
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{contact.role}</p>
                    </div>
                  </div>
                  <span className="badge badge-neutral">{contact.preferredContactMethod}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  <Building2 size={13} color="var(--text-muted)" />
                  <span style={{ fontWeight: 600 }}>{contact.client}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)', padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <a
                    href={`mailto:${contact.email}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}
                  >
                    <Mail size={14} color="var(--brand-accent)" />
                    <span style={{ textDecoration: 'underline' }}>{contact.email}</span>
                  </a>

                  <a
                    href={`tel:${contact.phone}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}
                  >
                    <Phone size={14} color="var(--brand-accent)" />
                    <span>{contact.phone}</span>
                  </a>
                </div>
              </div>

              {contact.notes && (
                <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  {contact.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Contact Name</th>
                <th>Client / Organization</th>
                <th>Role</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>Preferred Method</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact) => (
                <tr key={contact.contactId}>
                  <td style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '11px' }}>{contact.contactId}</td>
                  <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{contact.name}</td>
                  <td style={{ fontWeight: 600, color: 'var(--brand-accent)' }}>{contact.client}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{contact.role}</td>
                  <td style={{ color: 'var(--brand-accent)' }}>
                    <a href={`mailto:${contact.email}`} style={{ color: 'inherit' }}>{contact.email}</a>
                  </td>
                  <td>{contact.phone}</td>
                  <td>
                    <span className="badge badge-neutral">{contact.preferredContactMethod}</span>
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
