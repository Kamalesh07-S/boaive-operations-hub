// Boaive Operations Hub - Infrastructure Assets & Renewals

import React, { useState } from 'react';
import {
  Server,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import { AssetRecord, AssetRenewalStatus } from '../../types';

export const AssetsView: React.FC = () => {
  const { assets, renewAsset, openQuickAdd } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [renewalFilter, setRenewalFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [renewingAsset, setRenewingAsset] = useState<AssetRecord | null>(null);
  const [newRenewalDate, setNewRenewalDate] = useState('2027-10-06');

  const assetTypes = [
    'Domain',
    'SSL Certificate',
    'Cloud Infrastructure',
    'SaaS Subscription',
    'Database Instance',
    'Security & Keys',
  ];

  const filteredAssets = assets.filter((a) => {
    const matchesSearch =
      a.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.domainOrAccountName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRenewal = renewalFilter === 'ALL' || a.renewalStatus === renewalFilter;
    const matchesType = typeFilter === 'ALL' || a.assetType === typeFilter;
    return matchesSearch && matchesRenewal && matchesType;
  });

  const expiredCount = assets.filter((a) => a.renewalStatus === '🔴 Expired').length;
  const renewSoonCount = assets.filter((a) => a.renewalStatus === '🟡 Renew Soon').length;
  const healthyCount = assets.filter((a) => a.renewalStatus === '🟢 OK').length;

  const totalAnnualCost = assets.reduce((sum, a) => sum + (a.billingFrequency === 'Annual' ? a.cost : a.billingFrequency === 'Monthly' ? a.cost * 12 : a.cost / 3), 0);

  const handleRenewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (renewingAsset) {
      await renewAsset(renewingAsset.assetId, newRenewalDate);
      setRenewingAsset(null);
    }
  };

  const getRenewalBadge = (status: AssetRenewalStatus) => {
    switch (status) {
      case '🔴 Expired':
        return <span className="badge" style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger-text)', border: '1px solid var(--danger-border)', fontSize: '11px' }}>🔴 Expired</span>;
      case '🟡 Renew Soon':
        return <span className="badge" style={{ backgroundColor: 'var(--warning-bg)', color: 'var(--warning-text)', border: '1px solid var(--warning-border)', fontSize: '11px' }}>🟡 Renew Soon</span>;
      case '🟢 OK':
        return <span className="badge" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)', border: '1px solid var(--success-border)', fontSize: '11px' }}>🟢 Active</span>;
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
            Infrastructure Assets &amp; Renewals
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Domain names, SSL certificates, AWS clusters, SaaS subscriptions and database licenses
          </p>
        </div>
        <button onClick={() => openQuickAdd('asset')} className="btn btn-primary btn-sm">
          <Plus size={15} />
          <span>Register Asset</span>
        </button>
      </div>

      {/* Renewal KPI Cards */}
      <div className="grid-cols-4">
        <div
          className="card"
          style={{
            padding: '14px 18px',
            backgroundColor: expiredCount > 0 ? 'var(--danger-bg)' : undefined,
            border: expiredCount > 0 ? '1px solid var(--danger-border)' : undefined,
            cursor: 'pointer',
          }}
          onClick={() => setRenewalFilter(renewalFilter === '🔴 Expired' ? 'ALL' : '🔴 Expired')}
        >
          <div style={{ fontSize: '11px', color: 'var(--danger-text)', fontWeight: 700 }}>🔴 Expired Assets</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--danger-text)', marginTop: '2px' }}>{expiredCount}</div>
          <div style={{ fontSize: '11px', color: 'var(--danger-text)', marginTop: '2px' }}>Requires immediate renewal</div>
        </div>

        <div
          className="card"
          style={{ padding: '14px 18px', cursor: 'pointer' }}
          onClick={() => setRenewalFilter(renewalFilter === '🟡 Renew Soon' ? 'ALL' : '🟡 Renew Soon')}
        >
          <div style={{ fontSize: '11px', color: 'var(--warning-text)', fontWeight: 700 }}>🟡 Renew Soon</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--warning-text)', marginTop: '2px' }}>{renewSoonCount}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Upcoming renewals</div>
        </div>

        <div
          className="card"
          style={{ padding: '14px 18px', cursor: 'pointer' }}
          onClick={() => setRenewalFilter(renewalFilter === '🟢 OK' ? 'ALL' : '🟢 OK')}
        >
          <div style={{ fontSize: '11px', color: 'var(--success-text)', fontWeight: 700 }}>🟢 Healthy &amp; Active</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--success-text)', marginTop: '2px' }}>{healthyCount}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>All systems nominal</div>
        </div>

        <div className="card" style={{ padding: '14px 18px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>
            <Calendar size={11} style={{ display: 'inline', marginRight: '4px' }} />
            Annual Renewal Cost
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--brand-accent)', marginTop: '2px' }}>
            ₹{totalAnnualCost.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{assets.length} assets managed</div>
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
            placeholder="Search assets by name, provider, or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ padding: '6px 10px', fontSize: '13px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Filter size={14} color="var(--text-muted)" />
          <select
            className="form-select"
            value={renewalFilter}
            onChange={(e) => setRenewalFilter(e.target.value)}
            style={{ padding: '6px 10px', fontSize: '12px', width: '160px' }}
          >
            <option value="ALL">All Renewal States</option>
            <option value="🔴 Expired">🔴 Expired</option>
            <option value="🟡 Renew Soon">🟡 Renew Soon</option>
            <option value="🟢 OK">🟢 Healthy</option>
          </select>

          <select
            className="form-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ padding: '6px 10px', fontSize: '12px', width: '170px' }}
          >
            <option value="ALL">All Asset Types</option>
            {assetTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Assets Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Asset ID</th>
              <th>Asset Name</th>
              <th>Type</th>
              <th>Provider</th>
              <th>Owner / Client</th>
              <th>Cost</th>
              <th>Renewal Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>
                  No assets match your filters.
                </td>
              </tr>
            ) : (
              filteredAssets.map((asset) => (
                <tr key={asset.assetId}>
                  <td style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '11px' }}>{asset.assetId}</td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{asset.assetName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {asset.domainOrAccountName}
                    </div>
                  </td>
                  <td><span className="badge badge-neutral">{asset.assetType}</span></td>
                  <td style={{ color: 'var(--brand-accent)', fontWeight: 600 }}>{asset.provider}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                    <div>{asset.ownerType}</div>
                    {asset.client !== 'Boaive Internal' && (
                      <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{asset.client}</div>
                    )}
                  </td>
                  <td style={{ fontWeight: 800 }}>
                    ₹{asset.cost.toLocaleString('en-IN')}
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 400 }}>{asset.billingFrequency}</div>
                  </td>
                  <td>
                    <span style={{ color: asset.renewalStatus === '🔴 Expired' ? 'var(--danger-text)' : asset.renewalStatus === '🟡 Renew Soon' ? 'var(--warning-text)' : 'var(--text-secondary)', fontWeight: 600 }}>
                      {asset.renewalDate}
                    </span>
                  </td>
                  <td>{getRenewalBadge(asset.renewalStatus)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => { setRenewingAsset(asset); setNewRenewalDate('2027-10-06'); }}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '11px', padding: '3px 8px' }}
                    >
                      <RefreshCw size={12} />
                      <span>Renew</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Renew Asset Modal */}
      {renewingAsset && (
        <Modal
          isOpen={!!renewingAsset}
          onClose={() => setRenewingAsset(null)}
          title={`Renew Asset: ${renewingAsset.assetName}`}
          subtitle={`Provider: ${renewingAsset.provider} · ${renewingAsset.assetType}`}
          footer={
            <>
              <button className="btn btn-secondary btn-sm" onClick={() => setRenewingAsset(null)}>
                Cancel
              </button>
              <button type="submit" form="renew-form" className="btn btn-primary btn-sm">
                Confirm Renewal
              </button>
            </>
          }
        >
          <form id="renew-form" onSubmit={handleRenewSubmit}>
            <div className="form-group">
              <label className="form-label">New Renewal Date</label>
              <input
                type="date"
                className="form-input"
                value={newRenewalDate}
                onChange={(e) => setNewRenewalDate(e.target.value)}
                required
              />
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
              Confirming renewal will update the asset status and renewal date.
            </p>
          </form>
        </Modal>
      )}
    </div>
  );
};
