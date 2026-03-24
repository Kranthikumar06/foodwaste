import React, { useState } from 'react';
import {
  Users, UserCheck, UserX, PhoneCall, Truck,
  Star, Clock, ChevronDown, ChevronUp,
  Send, RefreshCw, Shield, Award, CheckCircle2,
  Wifi, WifiOff, PlusCircle
} from 'lucide-react';
import './NgoVolunteersPage.css';

const VOLUNTEERS = [
  { id: 1, name: 'Ravi Kumar',  phone: '9876543210', transport: 'Bike',  capacity: 20, pickups: 48, reliability: 92, online: true,  status: 'On pickup route',        lastActive: 'Now',      badges: ['First Pickup','50 KG Rescued','Reliable Rider'] },
  { id: 2, name: 'Sneha L.',    phone: '9988001122', transport: 'Car',   capacity: 40, pickups: 35, reliability: 88, online: true,  status: 'Available',              lastActive: 'Now',      badges: ['First Pickup','Speed Rescuer'] },
  { id: 3, name: 'Anish K.',    phone: '9000112233', transport: 'Bike',  capacity: 15, pickups: 22, reliability: 76, online: true,  status: 'Just completed delivery',lastActive: '5 min ago',badges: ['First Pickup'] },
  { id: 4, name: 'Vikram S.',   phone: '9112233445', transport: 'Van',   capacity: 80, pickups: 61, reliability: 95, online: false, status: 'Offline',                lastActive: '2h ago',   badges: ['First Pickup','50 KG Rescued','100 KG Rescued','Top Volunteer'] },
  { id: 5, name: 'Priya R.',    phone: '9876001200', transport: 'Bike',  capacity: 15, pickups: 14, reliability: 63, online: false, status: 'Offline',                lastActive: '1d ago',   badges: ['First Pickup'] },
  { id: 6, name: 'Arjun M.',    phone: '9998887776', transport: 'Bike',  capacity: 18, pickups: 7,  reliability: 45, online: false, status: 'Offline',                lastActive: '3d ago',   badges: [] },
];

const PENDING_INVITES = [
  { phone: '9111222333', sent: '2h ago' },
  { phone: '9444555666', sent: '1d ago' },
];

const reliabilityColor = (score) => {
  if (score >= 80) return { bar: '#10b981', bg: '#f0fdf4', text: '#059669' };
  if (score >= 50) return { bar: '#f59e0b', bg: '#fffbeb', text: '#d97706' };
  return { bar: '#ef4444', bg: '#fef2f2', text: '#dc2626' };
};

const statusIcon = (online, statusStr) => {
  if (!online) return <WifiOff size={13} className="vol-offline-icon" />;
  if (statusStr.includes('pickup')) return <Truck size={13} className="vol-active-icon" />;
  return <Wifi size={13} className="vol-online-icon" />;
};

export default function NgoVolunteersPage() {
  const [filter, setFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [invitePhone, setInvitePhone] = useState('');
  const [showInviteBox, setShowInviteBox] = useState(false);

  const online = VOLUNTEERS.filter(v => v.online);

  const filtered = filter === 'All' ? VOLUNTEERS
    : filter === 'Online' ? VOLUNTEERS.filter(v => v.online)
    : filter === 'Offline' ? VOLUNTEERS.filter(v => !v.online)
    : VOLUNTEERS;

  return (
    <div className="ngo-vol-page">
      {/* Header */}
      <header className="ngo-page-header">
        <div>
          <h1>Volunteer Team</h1>
          <p className="ngo-subtitle">
            {VOLUNTEERS.length} total ·
            <span className="online-count-badge"> {online.length} online now</span>
          </p>
        </div>
        <button className="ngo-primary-btn" onClick={() => setShowInviteBox(true)}>
          <PlusCircle size={18} /> Invite Volunteer
        </button>
      </header>

      {/* Online Now */}
      <section className="ngo-card online-section">
        <div className="ngo-card-header">
          <h2>
            <span className="green-pulse-dot" />
            Online right now
          </h2>
          <span className="online-count-chip">{online.length}</span>
        </div>
        <div className="online-cards-row">
          {online.map(v => {
            const rc = reliabilityColor(v.reliability);
            return (
              <div key={v.id} className="online-vol-card">
                <div className="vol-avatar" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
                  {v.name[0]}
                </div>
                <div className="online-vol-info">
                  <span className="vol-name">{v.name}</span>
                  <span className="vol-transport">{v.transport} · {v.capacity} KG cap</span>
                  <span className="vol-status-text">{statusIcon(v.online, v.status)} {v.status}</span>
                  <div className="reliability-row">
                    <div className="rel-bar-bg">
                      <div className="rel-bar-fill" style={{ width: `${v.reliability}%`, background: rc.bar }} />
                    </div>
                    <span style={{ color: rc.text }} className="rel-score">{v.reliability}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* All Volunteers Table */}
      <section className="ngo-card">
        <div className="ngo-card-header">
          <h2>All Volunteers</h2>
          <div className="filter-tabs-vol">
            {['All', 'Online', 'Offline'].map(f => (
              <button key={f} className={`vol-filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="vol-table">
          <div className="vol-table-head">
            <span>Volunteer</span>
            <span>Transport</span>
            <span>Reliability</span>
            <span>Pickups</span>
            <span>Status</span>
            <span>Last Active</span>
            <span>Actions</span>
          </div>

          {filtered.map(vol => {
            const rc = reliabilityColor(vol.reliability);
            const expanded = expandedId === vol.id;
            return (
              <div key={vol.id} className={`vol-table-block ${expanded ? 'expanded' : ''}`}>
                <div className="vol-table-row" onClick={() => setExpandedId(expanded ? null : vol.id)}>
                  <div className="vol-name-cell">
                    <div className="vol-avatar-sm">{vol.name[0]}</div>
                    <div>
                      <span className="vol-name-td">{vol.name}</span>
                      <span className="vol-phone-td">{vol.phone}</span>
                    </div>
                  </div>
                  <span className="vol-transport-td">{vol.transport} · {vol.capacity}kg</span>
                  <div className="vol-rel-cell">
                    <div className="rel-bar-bg wide">
                      <div className="rel-bar-fill" style={{ width: `${vol.reliability}%`, background: rc.bar }} />
                    </div>
                    <span className="rel-num" style={{ color: rc.text }}>{vol.reliability}</span>
                  </div>
                  <span className="vol-pickups-td">{vol.pickups}</span>
                  <div className="vol-status-cell">
                    {vol.online
                      ? <span className="status-chip online-chip"><Wifi size={11}/> Online</span>
                      : <span className="status-chip offline-chip"><WifiOff size={11}/> Offline</span>}
                  </div>
                  <span className="vol-last-td">{vol.lastActive}</span>
                  <div className="vol-actions-td" onClick={e => e.stopPropagation()}>
                    <button className="tbl-action-btn" title="Remove"><UserX size={15} /></button>
                    {expanded ? <ChevronUp size={16} className="expand-caret"/> : <ChevronDown size={16} className="expand-caret"/>}
                  </div>
                </div>

                {expanded && (
                  <div className="vol-expand-panel">
                    <div className="expand-section">
                      <h4>Badges Earned</h4>
                      {vol.badges.length > 0 ? (
                        <div className="badges-wrap">
                          {vol.badges.map((b, i) => (
                            <span key={i} className="badge-chip"><Award size={12} /> {b}</span>
                          ))}
                        </div>
                      ) : <p className="no-badges">No badges yet</p>}
                    </div>
                    <div className="expand-section">
                      <h4>Reliability Breakdown</h4>
                      <div className="rel-breakdown">
                        <div className="rel-item"><CheckCircle2 size={13} /><span>On-time pickups: {Math.round(vol.reliability * 0.6)}%</span></div>
                        <div className="rel-item"><CheckCircle2 size={13} /><span>Confirmed deliveries: {vol.pickups}</span></div>
                        <div className="rel-item"><CheckCircle2 size={13} /><span>Score: {vol.reliability}/100</span></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Invite Modal */}
      {showInviteBox && (
        <div className="modal-overlay" onClick={() => setShowInviteBox(false)}>
          <div className="invite-modal" onClick={e => e.stopPropagation()}>
            <h3>Invite a Volunteer</h3>
            <p className="invite-desc">Send an SMS with a registration link. They'll automatically be linked to your NGO.</p>
            <div className="invite-input-row">
              <input
                type="tel"
                placeholder="Phone number"
                value={invitePhone}
                onChange={e => setInvitePhone(e.target.value)}
              />
              <button className="ngo-primary-btn" onClick={() => { setInvitePhone(''); setShowInviteBox(false); }}>
                <Send size={16} /> Send
              </button>
            </div>
            <div className="pending-invites">
              <h4>Pending Invites</h4>
              {PENDING_INVITES.map((inv, i) => (
                <div key={i} className="pending-invite-row">
                  <PhoneCall size={14} />
                  <span>{inv.phone}</span>
                  <span className="inv-sent">Sent {inv.sent}</span>
                  <button className="resend-btn"><RefreshCw size={13} /> Resend</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
