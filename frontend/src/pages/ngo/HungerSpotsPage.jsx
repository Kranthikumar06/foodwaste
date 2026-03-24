import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  PlusCircle, List, Map, Edit, X, CheckCircle2,
  MapPin, Users, Clock, PhoneCall, Utensils,
  ShieldOff, Eye, ChevronRight, ToggleRight
} from 'lucide-react';
import './HungerSpotsPage.css';

// Fix leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const SPOTS = [
  { id: 1, name: 'Miyapur Construction Camp',  area: 'Miyapur',    lat: 17.4947, lng: 78.3567, people: 80,  pref: 'Any',               bestFrom: '18:00', bestTo: '20:00', contact: 'Suresh Kumar', phone: '9876543210', status: 'unseen',  lastServed: '2 days ago', todayCount: 0, notes: 'Enter from back gate, ask for Suresh', active: true },
  { id: 2, name: 'Rainbow Orphanage',           area: 'Kondapur',   lat: 17.4594, lng: 78.3672, people: 45,  pref: 'Vegetarian',        bestFrom: '12:00', bestTo: '13:30', contact: 'Sister Mary',  phone: '9988776655', status: 'partial', lastServed: '3h ago',     todayCount: 1, notes: 'Ask for the kitchen entrance', active: true },
  { id: 3, name: 'Gachibowli Old Age Home',     area: 'Gachibowli', lat: 17.4401, lng: 78.3489, people: 60,  pref: 'Any',               bestFrom: '11:00', bestTo: '12:30', contact: 'Ramaiah',      phone: '9000011111', status: 'done',    lastServed: '1h ago',     todayCount: 2, notes: '',                             active: true },
  { id: 4, name: 'Kukatpally Labour Site',      area: 'Kukatpally', lat: 17.4849, lng: 78.4138, people: 120, pref: 'Rice preferred',    bestFrom: '19:00', bestTo: '20:30', contact: 'Contractor A', phone: null,         status: 'unseen',  lastServed: 'Yesterday',  todayCount: 0, notes: 'Large group, bring containers',active: true },
  { id: 5, name: 'Government Primary School',   area: 'Madhapur',   lat: 17.4465, lng: 78.3845, people: 200, pref: 'Vegetarian',        bestFrom: '10:00', bestTo: '11:30', contact: null,           phone: null,         status: 'done',    lastServed: '2h ago',     todayCount: 1, notes: '',                             active: true },
];

const statusMeta = {
  unseen:  { label: 'Not served today', dot: '#ef4444', bg: '#fef2f2', text: '#dc2626' },
  partial: { label: 'Served once',      dot: '#f59e0b', bg: '#fffbeb', text: '#d97706' },
  done:    { label: 'Fully served',     dot: '#10b981', bg: '#f0fdf4', text: '#059669' },
};

const EMPTY_FORM = {
  name: '', area: '', people: '', pref: 'Any',
  bestFrom: '', bestTo: '', contact: '', phone: '', notes: '', active: true
};

export default function HungerSpotsPage() {
  const [viewMode, setViewMode] = useState('map');
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editSpot, setEditSpot] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [sortBy, setSortBy] = useState('status');

  const openAdd = () => { setForm(EMPTY_FORM); setEditSpot(null); setShowModal(true); };
  const openEdit = (spot) => { setForm({ ...spot }); setEditSpot(spot.id); setShowModal(true); };
  const closeModal = () => setShowModal(false);

  const sortedSpots = [...SPOTS].sort((a, b) => {
    if (sortBy === 'status') {
      const order = { unseen: 0, partial: 1, done: 2 };
      return order[a.status] - order[b.status];
    }
    if (sortBy === 'people') return b.people - a.people;
    return a.area.localeCompare(b.area);
  });

  return (
    <div className="spots-page">
      {/* Header */}
      <header className="spots-header">
        <div>
          <h1>Hunger Spots</h1>
          <p className="ngo-subtitle">Manage all registered food delivery locations</p>
        </div>
        <div className="spots-header-actions">
          <div className="view-toggle">
            <button className={viewMode === 'map' ? 'active' : ''} onClick={() => setViewMode('map')}>
              <Map size={16} /> Map
            </button>
            <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>
              <List size={16} /> List
            </button>
          </div>
          <button className="ngo-primary-btn" onClick={openAdd}>
            <PlusCircle size={18} /> Add New Spot
          </button>
        </div>
      </header>

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="map-spots-wrap">
          <div className={`spots-map-container ${selectedSpot ? 'with-panel' : ''}`}>
            <MapContainer center={[17.465, 78.38]} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {SPOTS.map(spot => (
                <Marker
                  key={spot.id}
                  position={[spot.lat, spot.lng]}
                  eventHandlers={{ click: () => setSelectedSpot(spot) }}
                >
                  <Popup>{spot.name}</Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Legend */}
            <div className="map-legend">
              {Object.entries(statusMeta).map(([key, m]) => (
                <div key={key} className="legend-item">
                  <span className="legend-dot" style={{ background: m.dot }} />
                  <span>{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Side Panel */}
          {selectedSpot && (
            <div className="spot-side-panel">
              <div className="panel-header">
                <div>
                  <h3>{selectedSpot.name}</h3>
                  <p className="panel-area"><MapPin size={13} /> {selectedSpot.area}</p>
                </div>
                <button className="panel-close-btn" onClick={() => setSelectedSpot(null)}><X size={18} /></button>
              </div>

              <span
                className="panel-status-pill"
                style={{ background: statusMeta[selectedSpot.status].bg, color: statusMeta[selectedSpot.status].text }}
              >
                {statusMeta[selectedSpot.status].label}
              </span>

              <div className="panel-info-grid">
                <div className="panel-info-item">
                  <Users size={14} />
                  <span>{selectedSpot.people} people</span>
                </div>
                <div className="panel-info-item">
                  <Utensils size={14} />
                  <span>{selectedSpot.pref}</span>
                </div>
                <div className="panel-info-item">
                  <Clock size={14} />
                  <span>{selectedSpot.bestFrom} – {selectedSpot.bestTo}</span>
                </div>
                <div className="panel-info-item">
                  <CheckCircle2 size={14} />
                  <span>{selectedSpot.todayCount} deliveries today</span>
                </div>
              </div>

              <div className="panel-last-served">
                Last served: <strong>{selectedSpot.lastServed}</strong>
              </div>

              {selectedSpot.contact && (
                <div className="panel-contact">
                  <PhoneCall size={14} />
                  <span>{selectedSpot.contact}{selectedSpot.phone ? ` · ${selectedSpot.phone}` : ''}</span>
                </div>
              )}

              {selectedSpot.notes && (
                <div className="panel-notes">
                  <span>📝 {selectedSpot.notes}</span>
                </div>
              )}

              <div className="panel-actions">
                <button className="panel-btn edit-btn" onClick={() => openEdit(selectedSpot)}>
                  <Edit size={16} /> Edit Spot
                </button>
                <button className="panel-btn served-btn">
                  <CheckCircle2 size={16} /> Mark Fully Served
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="spots-list-wrap">
          <div className="list-toolbar">
            <span className="sort-label">Sort by:</span>
            {['status', 'people', 'zone'].map(s => (
              <button
                key={s}
                className={`sort-btn ${sortBy === s ? 'active' : ''}`}
                onClick={() => setSortBy(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <div className="spots-table">
            <div className="spots-table-head">
              <span>Spot Name</span>
              <span>Area</span>
              <span>People</span>
              <span>Best Time</span>
              <span>Today's Status</span>
              <span>Last Served</span>
              <span>Actions</span>
            </div>
            {sortedSpots.map(spot => (
              <div key={spot.id} className="spots-table-row">
                <span className="spot-col-name">{spot.name}</span>
                <span className="spot-col-area">{spot.area}</span>
                <span><Users size={13} /> {spot.people}</span>
                <span>{spot.bestFrom}–{spot.bestTo}</span>
                <span>
                  <span className="table-status-pill" style={{ background: statusMeta[spot.status].bg, color: statusMeta[spot.status].text }}>
                    {statusMeta[spot.status].label}
                  </span>
                </span>
                <span className="spot-col-last">{spot.lastServed}</span>
                <div className="table-actions">
                  <button className="tbl-action-btn" onClick={() => openEdit(spot)} title="Edit"><Edit size={15} /></button>
                  <button className="tbl-action-btn del-btn" title="Deactivate"><ShieldOff size={15} /></button>
                  <button className="tbl-action-btn" title="View history"><Eye size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="spot-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editSpot ? 'Edit Spot' : 'Add New Hunger Spot'}</h3>
              <button className="modal-close" onClick={closeModal}><X size={20} /></button>
            </div>

            <form className="spot-form" onSubmit={e => { e.preventDefault(); closeModal(); }}>
              <div className="form-row-2">
                <div className="form-field">
                  <label>Spot Name</label>
                  <input placeholder="e.g. Miyapur Construction Camp" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
                </div>
                <div className="form-field">
                  <label>Area / Zone</label>
                  <input placeholder="e.g. Miyapur" value={form.area} onChange={e=>setForm({...form,area:e.target.value})} required />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-field">
                  <label>Estimated People</label>
                  <input type="number" min="1" placeholder="e.g. 80" value={form.people} onChange={e=>setForm({...form,people:e.target.value})} required />
                </div>
                <div className="form-field">
                  <label>Food Preference</label>
                  <select value={form.pref} onChange={e=>setForm({...form,pref:e.target.value})}>
                    <option>Any</option>
                    <option>Vegetarian</option>
                    <option>Rice preferred</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-field">
                  <label>Best Time From</label>
                  <input type="time" value={form.bestFrom} onChange={e=>setForm({...form,bestFrom:e.target.value})} />
                </div>
                <div className="form-field">
                  <label>Best Time Until</label>
                  <input type="time" value={form.bestTo} onChange={e=>setForm({...form,bestTo:e.target.value})} />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-field">
                  <label>Contact Person</label>
                  <input placeholder="Name (optional)" value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})} />
                </div>
                <div className="form-field">
                  <label>Phone</label>
                  <input placeholder="Phone (optional)" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
                </div>
              </div>

              <div className="form-field">
                <label>Notes for Volunteers</label>
                <textarea placeholder="e.g. Enter from back gate, ask for Suresh" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} />
              </div>

              <div className="form-field toggle-field">
                <label>Active</label>
                <input type="checkbox" checked={form.active} onChange={e=>setForm({...form,active:e.target.checked})} />
              </div>

              <button type="submit" className="ngo-primary-btn modal-save-btn">
                {editSpot ? 'Save Changes' : 'Add Hunger Spot'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
