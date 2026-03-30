import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  Map as MapIcon,
  List,
  Filter,
  Maximize2,
  Clock,
  MapPin,
  ChevronUp,
  X,
  Package,
  Layers,
  ArrowRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useGeolocation } from '../../hooks/useGeolocation';
import {
  getFoodPosts,
  claimFoodPost,
  updateVolunteerStatus
} from '../../api/volunteerApi';
import './FoodMapPage.css';

// Hyderabad center
const HYDERABAD_CENTER = [17.4483, 78.3915];

const MOCK_FOOD_POSTS = [
  {
    id: 1, type: 'Cooked Lunch', quantity: '20 kg', donor: 'Paradise Biryani',
    address: 'Madhapur, Hitech City', coords: [17.4483, 78.3915],
    expiry: 18, priority: 'critical', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400'
  },
  {
    id: 2, type: 'Vegetables', quantity: '15 kg', donor: 'Rythu Bazaar',
    address: 'Kukatpally, Hyderabad', coords: [17.4834, 78.4011],
    expiry: 45, priority: 'critical', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'
  },
  {
    id: 3, type: 'Bread & Buns', quantity: '10 kg', donor: 'King Bakers',
    address: 'Banjara Hills, Rd 12', coords: [17.4126, 78.4357],
    expiry: 120, priority: 'urgent', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'
  },
  {
    id: 4, type: 'Cooked Meals', quantity: '8 kg', donor: 'Tiffin Center',
    address: 'Gachibowli Junc.', coords: [17.4411, 78.3475],
    expiry: 300, priority: 'normal', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'
  },
];

const getMarkerIcon = (priority) => {
  let color = '#10b981'; // normal
  if (priority === 'critical') color = '#ef4444';
  if (priority === 'urgent') color = '#f97316';

  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const UserLocationMarker = () => {
  return L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Component to update map center when location changes
const MapCenterUpdater = ({ center }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
};

export default function FoodMapPage() {
  const navigate = useNavigate();
  const { location: userLocation, accuracy: locationAccuracy, loading: locationLoading, error: locationError } = useGeolocation();
  const [view, setView] = useState('map');
  const [selectedPost, setSelectedPost] = useState(null);
  const [batch, setBatch] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [foodPosts, setFoodPosts] = useState([]);

  React.useEffect(() => {
    fetchPosts();
  }, []);


  const fetchPosts = async () => {
    try {
      // For now, we fetch all, but normally we'd fetch nearby [lat, lng]
      const resp = await getFoodPosts();
      // Adjusting based on standard backend response structure
      setFoodPosts(resp.data.data || []);
    } catch (err) {
      console.error("Fetch posts err:", err);
    }
  };

  const handleClaim = async (postId) => {
    try {
      await claimFoodPost(postId);
      // Refresh or navigate
      navigate('/volunteer/dashboard');
    } catch (err) {
      alert("Claim failed: " + (err.response?.data?.message || err.message));
    }
  };

  const toggleOnline = async () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    await updateVolunteerStatus(newStatus);
  };

  const toggleBatch = (post) => {
    if (batch.some(item => item.id === post.id)) {
      setBatch(batch.filter(item => item.id !== post.id));
    } else {
      setBatch([...batch, post]);
    }
    setSelectedPost(null);
  };

  const batchWeight = batch.reduce((acc, curr) => acc + parseInt(curr.quantity || 0), 0);

  // Manual location detection function
  const detectUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`Manual location detection: ${latitude}, ${longitude}`);
          // The useGeolocation hook will also update this
        },
        (error) => {
          console.error('Location error:', error);
          alert('Could not get your location. Please enable location access.');
        }
      );
    }
  };

  return (
    <div className="food-map-page">

      <div className="map-control-bar">
        <div className="map-controls-left">
          <div className="map-view-toggle">
            <button
              className={`toggle-btn ${view === 'map' ? 'active' : ''}`}
              onClick={() => setView('map')}
            >
              <MapIcon size={18} /> Map
            </button>
            <button
              className={`toggle-btn ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
            >
              <List size={18} /> List
            </button>
          </div>

          <div className="filter-pill">
            <Filter size={16} /> Filters
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button 
              onClick={detectUserLocation}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: locationError ? '#ef4444' : (locationAccuracy && locationAccuracy > 50 ? '#f97316' : '#4caf50'),
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
                transition: 'background-color 0.3s'
              }}
              title={locationError ? locationError : (locationAccuracy ? `Accuracy: ${locationAccuracy}m` : "Getting your location...")}
            >
              <MapPin size={16} /> 
              {locationLoading 
                ? '⏳ Detecting...' 
                : locationError 
                ? '❌ Error' 
                : (locationAccuracy ? `My Location (${locationAccuracy}m)` : 'My Location')}
            </button>
            {locationError && (
              <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 500 }}>
                {locationError}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6b7280' }}>STATUS</span>
            <label className="toggle-switch" style={{ transform: 'scale(0.8)' }}>
              <input type="checkbox" checked={isOnline} onChange={() => setIsOnline(!isOnline)} />
              <span className="slider"></span>
            </label>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isOnline ? '#4caf50' : '#6b7280' }}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
        </div>
        <div style={{ fontWeight: 700, color: '#4caf50', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <TrendingUp size={18} /> {MOCK_FOOD_POSTS.length} posts active
        </div>
      </div>

      <div className="map-main-container">
        {view === 'map' ? (
          <MapContainer center={userLocation} zoom={13} zoomControl={false} scrollWheelZoom={true}>
            <MapCenterUpdater center={userLocation} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* User Location Marker - Red Pin */}
            <Marker position={userLocation} icon={UserLocationMarker()} />

            {MOCK_FOOD_POSTS.map(post => (
              <Marker
                key={post.id}
                position={post.coords}
                icon={getMarkerIcon(post.priority)}
                eventHandlers={{
                  click: () => setSelectedPost(post),
                }}
              />
            ))}
          </MapContainer>
        ) : (
          <div className="posts-list-view">
            {MOCK_FOOD_POSTS.map(post => (
              <div className="food-post-card" key={post.id}>
                <div className="card-image">
                  <img src={post.image} alt={post.type} />
                  <span className={`card-priority priority-${post.priority}`}>
                    {post.priority}
                  </span>
                </div>
                <div className="card-body">
                  <div className="card-header">
                    <div className="card-title">{post.type}</div>
                    <div className="safe-timer" style={{ color: post.priority === 'critical' ? '#ef4444' : '#111827' }}>
                      <Clock size={16} /> {post.expiry}m
                    </div>
                  </div>
                  <div className="card-meta">
                    <div className="detail-item"><MapPin size={14} /> {post.donor}</div>
                    <div className="detail-item"><Package size={14} /> {post.quantity}</div>
                  </div>
                </div>
                <div className="card-footer">
                  <button className="btn-card btn-batch" onClick={() => toggleBatch(post)}>
                    {batch.some(item => item.id === post.id) ? 'Remove' : 'Add to Batch'}
                  </button>
                  <button className="btn-card btn-claim">Claim Now</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Sheet for Map Pin Click */}
        {selectedPost && view === 'map' && (
          <div className="bottom-sheet open">
            <div className="sheet-header">
              <div>
                <span className={`priority-badge priority-${selectedPost.priority}`} style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
                  {selectedPost.priority}
                </span>
                <h2 style={{ margin: 0 }}>{selectedPost.type} • {selectedPost.quantity}</h2>
              </div>
              <button className="close-sheet" onClick={() => setSelectedPost(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.875rem' }}>Donor & Address</p>
                <p style={{ margin: 0, fontWeight: 700 }}>{selectedPost.donor}</p>
                <p style={{ margin: 0, color: '#4b5563', fontSize: '0.875rem' }}>{selectedPost.address}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.875rem' }}>Condition</p>
                <p style={{ margin: 0, fontWeight: 700, color: selectedPost.priority === 'critical' ? '#ef4444' : '#10b981' }}>
                  Expires in {selectedPost.expiry}m
                </p>
              </div>
            </div>

            <div className="card-footer" style={{ padding: 0, background: 'none', border: 'none' }}>
              <button className="btn-card btn-batch" onClick={() => toggleBatch(selectedPost)} style={{ padding: '1rem' }}>
                {batch.some(item => item.id === selectedPost.id) ? 'Remove from Batch' : 'Add to Batch'}
              </button>
              <button className="btn-card btn-claim" style={{ padding: '1rem' }}>Claim Pickup</button>
            </div>
          </div>
        )}

        {/* Floating Batch Bar */}
        {batch.length > 0 && (
          <div className="floating-batch-bar">
            <div className="batch-stats">
              <Layers size={20} color="#4caf50" />
              <span>{batch.length} posts • {batchWeight} kg • fits Car (50kg)</span>
            </div>
            <button className="btn-build" onClick={() => navigate('/volunteer/route/batch-123')}>
              Build Route <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
