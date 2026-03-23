import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  ArrowLeft,
  MapPin,
  Package,
  Navigation,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Clock,
  Heart
} from 'lucide-react';
import './BatchRoutePage.css';

const MOCK_ROUTE_STOPS = [
  { id: 's1', donor: 'Paradise Biryani', address: 'Madhapur, Hitech City', coords: [17.4483, 78.3915], kg: 20, type: 'Cooked Food' },
  { id: 's2', donor: 'Rythu Bazaar', address: 'Kukatpally, Hyderabad', coords: [17.4834, 78.4011], kg: 8, type: 'Vegetables' },
  { id: 's3', donor: 'King Bakers', address: 'Banjara Hills, Rd 12', coords: [17.4126, 78.4357], kg: 6, type: 'Bread' },
];

const MOCK_NGO = {
  name: 'Hope Shelter NGO',
  address: 'Secunderabad, Opp Station',
  coords: [17.4334, 78.5015]
};

const routeCoords = [
  [17.43, 78.38], // Start
  ...MOCK_ROUTE_STOPS.map(s => s.coords),
  MOCK_NGO.coords
];

const getNumberedMarker = (num, completed) => {
  return L.divIcon({
    className: `stop-marker ${completed ? 'completed' : ''}`,
    html: `<div style="background: ${completed ? '#4caf50' : '#111827'}; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${num}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  });
};

export default function BatchRoutePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [completedStops, setCompletedStops] = useState([]);
  const [isDelivered, setIsDelivered] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const currentKg = completedStops.reduce((acc, idx) => acc + MOCK_ROUTE_STOPS[idx].kg, 0);
  const maxCapacity = 50;

  const handlePickup = (index) => {
    if (!completedStops.includes(index)) {
      setCompletedStops([...completedStops, index]);
    }
  };

  const handleDeliveryComplete = (e) => {
    e.preventDefault();
    setShowModal(false);
    navigate('/volunteer/dashboard');
  };

  return (
    <div className="batch-route-page">

      <div className="route-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="close-sheet" onClick={() => navigate('/volunteer/map')}>
            <ArrowLeft size={20} />
          </button>
          <div className="route-title">Active Batch Route • {id}</div>
        </div>
        <div style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 600 }}>
          <Navigation size={16} /> Optimizing with Batch Routing
        </div>
      </div>

      <div className="route-main">
        <div className="route-left-map">
          <MapContainer center={[17.44, 78.43]} zoom={12} zoomControl={false} scrollWheelZoom={true}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Polyline positions={routeCoords} color="#4caf50" weight={4} opacity={0.6} dashArray="8, 12" />

            {/* Current Pos */}
            <Marker position={[17.43, 78.38]} icon={L.divIcon({ className: 'user-marker-pulse', iconSize: [14, 14] })} />

            {MOCK_ROUTE_STOPS.map((stop, i) => (
              <Marker
                key={stop.id}
                position={stop.coords}
                icon={getNumberedMarker(i + 1, completedStops.includes(i))}
              />
            ))}

            <Marker position={MOCK_NGO.coords} icon={L.divIcon({
              className: 'ngo-marker',
              html: `<div style="background: #ef4444; color: white; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><Heart size={18} fill="white"/></div>`,
              iconSize: [36, 36],
              iconAnchor: [18, 18]
            })} />
          </MapContainer>
        </div>

        <div className="route-right-stops">
          {MOCK_ROUTE_STOPS.map((stop, i) => (
            <div className={`stop-card ${completedStops.includes(i) ? 'completed' : ''}`} key={stop.id}>
              <div className="stop-badge">{i + 1}</div>
              <div className="stop-info">
                <h3>{stop.donor}</h3>
                <p>{stop.address}</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#f3f4f6', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    <Clock size={12} style={{ marginRight: '2px' }} /> ETA {10 + i * 15}m
                  </span>
                </div>
              </div>
              <div className="stop-data">
                <Package size={16} color="#4caf50" />
                <span>{stop.kg} kg • {stop.type}</span>
              </div>
              {!completedStops.includes(i) ? (
                <button className="btn-arrived" onClick={() => handlePickup(i)}>
                  Arrived — Mark Picked Up
                </button>
              ) : (
                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4caf50', fontWeight: 800 }}>
                  <CheckCircle2 size={18} /> Picked Up
                </div>
              )}
            </div>
          ))}

          <div className={`stop-card delivery-card ${!isDelivered ? '' : 'completed'}`} style={{ marginTop: 'auto' }}>
            <div className="stop-badge">
              <Heart size={14} fill={isDelivered ? '#4caf50' : '#fff'} color={isDelivered ? '#4caf50' : '#fff'} />
            </div>
            <div className="stop-info">
              <h3>{MOCK_NGO.name}</h3>
              <p>{MOCK_NGO.address}</p>
            </div>
            <button
              className="btn-delivered"
              style={{ width: '100%', border: 'none', padding: '0.875rem', borderRadius: '0.5rem', fontWeight: 800, cursor: 'pointer' }}
              onClick={() => setShowModal(true)}
              disabled={completedStops.length < MOCK_ROUTE_STOPS.length || isDelivered}
            >
              Mark as Delivered
            </button>
          </div>

          <div className="route-progress-box">
            <div className="capacity-text">
              <span>Total Collected</span>
              <span>{currentKg} / {maxCapacity} kg</span>
            </div>
            <div className="capacity-bar">
              <div className="capacity-fill" style={{ width: `${(currentKg / maxCapacity) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f0fdf4', color: '#4caf50', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <CheckCircle2 size={32} />
              </div>
              <h2>Delivery Summary</h2>
              <p style={{ color: '#4b5563' }}>Confirm the handover to {MOCK_NGO.name}</p>
            </div>

            <form onSubmit={handleDeliveryComplete}>
              <div className="form-group">
                <label className="form-label">Actual weight delivered (kg)</label>
                <input type="number" defaultValue={currentKg} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Beneficiary Type</label>
                <select className="form-input">
                  <option>Homeless Shelter inhabitants</option>
                  <option>Daily wage workers</option>
                  <option>Children Orphanage</option>
                </select>
              </div>

              <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#111827', fontWeight: 600 }}>
                  <span>Estimated Meals Count</span>
                  <span style={{ color: '#4caf50' }}>{currentKg * 4} meals</span>
                </div>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>Based on 0.25kg per meal standard.</p>
              </div>

              <button type="submit" className="auth-btn btn-primary" style={{ width: '100%' }}>
                Finalize Delivery & Earn Points
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
