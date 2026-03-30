import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  MapPin, 
  Clock, 
  Camera, 
  Info, 
  Calendar,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronDown,
  Navigation,
  RefreshCw,
  Calculator
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useGeolocation } from '../../hooks/useGeolocation';
import { createFoodPost } from '../../api/foodPostApi';
import './PostFoodPage.css';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const FOOD_TYPES = [
  'Rice', 'Dal', 'Biryani', 'Curry', 'Bread', 'Roti', 
  'Sweets', 'Fruits', 'Vegetables', 'Snacks', 'Other'
];

// Component to update map center when location changes
const MapCenterUpdater = ({ center }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
};

export default function PostFoodPage() {
  const navigate = useNavigate();
  const { location: detectedLocation } = useGeolocation();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(detectedLocation); // Start with detected location
  
  // Helper to format time as HH:MM
  const formatTimeToHHMM = (date = new Date()) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Helper to create LocalDateTime string (YYYY-MM-DDTHH:MM:SS) 
  // Backend expects naive LocalDateTime without timezone
  const createLocalDateTimeString = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return null;
    return `${dateStr}T${timeStr}:00`;
  };

  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    cookedDate: new Date().toISOString().split('T')[0],
    cookedTime: formatTimeToHHMM(),
    description: '',
    pickupFrom: formatTimeToHHMM(new Date(Date.now() + 60 * 60 * 1000)), // 1 hour from now
    pickupUntil: formatTimeToHHMM(new Date(Date.now() + 3 * 60 * 60 * 1000)), // 3 hours from now
    address: '',
    isRecurring: false,
    recurringDays: [],
  });

  const [safetyStatus, setSafetyStatus] = useState(null); // 'safe', 'warn', 'expired'
  const [imagePreview, setImagePreview] = useState(null);

  // Update location when detected location changes
  useEffect(() => {
    if (detectedLocation && detectedLocation !== location) {
      setLocation(detectedLocation);
    }
  }, [detectedLocation]);

  // Dynamic Safety Check
  useEffect(() => {
    if (formData.cookedDate && formData.cookedTime) {
      // Parse local datetime (not UTC)
      const cooked = new Date(`${formData.cookedDate}T${formData.cookedTime}:00`);
      const now = new Date();
      const diffHours = (now - cooked) / (1000 * 60 * 60);

      if (diffHours < 4) {
        setSafetyStatus({ type: 'safe', msg: '✅ Safe until 9:30 PM · 3h 20m remaining to post' });
      } else if (diffHours < 6) {
        setSafetyStatus({ type: 'warn', msg: '⚠ Only 45 minutes left in safe window. Post urgently.' });
      } else {
        setSafetyStatus({ type: 'expired', msg: '❌ This food has crossed the safe limit. Cannot be posted per FSSAI guidelines.' });
      }
    }
  }, [formData.cookedDate, formData.cookedTime]);

  const taxEstimate = (parseFloat(formData.quantity) || 0) * 80; // Example math
  const taxSave = taxEstimate * 0.5;

  const handlePost = async (e) => {
    e.preventDefault();
    if (safetyStatus?.type === 'expired') {
      toast.error('Cannot post expired food');
      return;
    }
    
    if (!formData.foodType || !formData.quantity || !formData.pickupFrom || !formData.pickupUntil) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!location || location.length !== 2) {
      toast.error('Please detect your location');
      return;
    }
    
    setLoading(true);
    try {
      // Create LocalDateTime strings (YYYY-MM-DDTHH:MM:SS) without timezone
      const cookedAtDateTime = createLocalDateTimeString(formData.cookedDate, formData.cookedTime);
      const pickupFromDateTime = createLocalDateTimeString(formData.cookedDate, formData.pickupFrom);
      const pickupUntilDateTime = createLocalDateTimeString(formData.cookedDate, formData.pickupUntil);

      if (!cookedAtDateTime || !pickupFromDateTime || !pickupUntilDateTime) {
        toast.error('Please fill in all date and time fields');
        setLoading(false);
        return;
      }

      const foodPostData = {
        foodType: formData.foodType,
        quantityKg: parseFloat(formData.quantity),
        description: formData.description,
        cookedAt: cookedAtDateTime,
        pickupWindowStart: pickupFromDateTime,
        pickupWindowEnd: pickupUntilDateTime,
        photoUrl: imagePreview, // Optional - you may need to upload image separately
        latitude: location[0],
        longitude: location[1],
        address: formData.address,
        isRecurring: formData.isRecurring,
        recurringDays: formData.recurringDays.join(',')
      };

      console.log('📤 Sending food post:', foodPostData);
      console.log('Current time:', new Date().toISOString());
      console.log('Cooked at (backend will receive):', cookedAtDateTime);
      
      const response = await createFoodPost(foodPostData);
      
      setLoading(false);
      toast.success('🎉 Food posted successfully! Volunteers are being notified.');
      
      // Reset form
      setFormData({
        foodType: '',
        quantity: '',
        cookedDate: new Date().toISOString().split('T')[0],
        cookedTime: formatTimeToHHMM(),
        description: '',
        pickupFrom: formatTimeToHHMM(new Date(Date.now() + 60 * 60 * 1000)),
        pickupUntil: formatTimeToHHMM(new Date(Date.now() + 3 * 60 * 60 * 1000)),
        address: '',
        isRecurring: false,
        recurringDays: [],
      });
      setImagePreview(null);
      
      // Navigate to posts page
      setTimeout(() => {
        navigate('/donor/posts');
      }, 1500);
    } catch (error) {
      setLoading(false);
      toast.error(error.message || 'Failed to post food. Please try again.');
      console.error('Post creation error:', error);
    }
  };

  const handleLocationDetect = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation([pos.coords.latitude, pos.coords.longitude]);
      setFormData({ ...formData, address: 'Current Location Detected' });
    });
  };

  return (
    <div className="post-food-page-v2">
      <div className="post-form-container">
        <header className="post-header">
          <h1>Post Surplus Food</h1>
          <p>Feed someone today. Takes 60 seconds.</p>
        </header>

        <form className="post-form" onSubmit={handlePost}>
          {/* Section 1: Basic Info */}
          <div className="form-section">
            <div className="form-row">
              <div className="form-field-full">
                <label>Food Type</label>
                <div className="select-wrapper">
                  <select 
                    required
                    value={formData.foodType}
                    onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
                  >
                    <option value="" disabled>Select food type...</option>
                    {FOOD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown className="select-icon" />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field-full">
                <label>Quantity (KG)</label>
                <div className="input-with-suffix">
                  <input 
                    type="number" 
                    min="1" 
                    required
                    placeholder="e.g. 15"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                  <span className="suffix">KG</span>
                </div>
              </div>
            </div>

            <div className="form-row-split">
              <div className="form-field-half">
                <label>When was it cooked? (Date)</label>
                <div className="input-with-icon">
                  <input 
                    type="date" 
                    required
                    value={formData.cookedDate}
                    onChange={(e) => setFormData({ ...formData, cookedDate: e.target.value })}
                  />
                  <Calendar className="input-icon" size={18} />
                </div>
              </div>
              <div className="form-field-half">
                <label>Cooked Time</label>
                <div className="input-with-icon">
                  <input 
                    type="time" 
                    required
                    value={formData.cookedTime}
                    onChange={(e) => setFormData({ ...formData, cookedTime: e.target.value })}
                  />
                  <Clock className="input-icon" size={18} />
                </div>
              </div>
            </div>

            {/* Safety Result */}
            {safetyStatus && (
              <div className={`safety-banner banner-${safetyStatus.type}`}>
                <div className="banner-content">
                  {safetyStatus.type === 'safe' && <CheckCircle2 size={18} />}
                  {safetyStatus.type === 'warn' && <AlertTriangle size={18} />}
                  {safetyStatus.type === 'expired' && <XCircle size={18} />}
                  <span>{safetyStatus.msg}</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Details */}
          <div className="form-section">
            <div className="form-field-full">
              <label>Description (Optional)</label>
              <textarea 
                placeholder="Any details volunteers should know — packaging, floor number, gate details"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="form-row-split">
              <div className="form-field-half">
                <label>Pickup Available From</label>
                <input 
                  type="time" 
                  required
                  value={formData.pickupFrom}
                  onChange={(e) => setFormData({ ...formData, pickupFrom: e.target.value })}
                />
              </div>
              <div className="form-field-half">
                <label>Pickup Until</label>
                <input 
                  type="time" 
                  required
                  value={formData.pickupUntil}
                  onChange={(e) => setFormData({ ...formData, pickupUntil: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Photo & Location */}
          <div className="form-section">
            <label>Food Photo</label>
            <div className="photo-upload-zone" onClick={() => document.getElementById('photo-input').click()}>
              {imagePreview ? (
                <div className="preview-container">
                  <img src={imagePreview} alt="Preview" />
                  <div className="verified-badge"><CheckCircle2 size={14} /> Image verified</div>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <Camera size={32} />
                  <span>Click to capture or upload food photo</span>
                </div>
              )}
              <input 
                id="photo-input"
                type="file" 
                hidden 
                accept="image/*"
                onChange={(e) => setImagePreview(URL.createObjectURL(e.target.files[0]))}
              />
            </div>

            <div className="location-section">
              <label>Pickup Location</label>
              <div className="location-input-row">
                <input 
                  type="text" 
                  placeholder="Type address or use GPS"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
                <button type="button" className="gps-btn" onClick={handleLocationDetect}>
                  <Navigation size={18} />
                </button>
              </div>
              <div className="map-preview">
                <MapContainer center={location} zoom={15} style={{ height: '180px', borderRadius: '1rem' }} zoomControl={false}>
                  <MapCenterUpdater center={location} />
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker 
                    position={location}
                    icon={L.icon({
                      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                      iconSize: [25, 41],
                      iconAnchor: [12, 41],
                      popupAnchor: [1, -34],
                      shadowSize: [41, 41]
                    })}
                  />
                </MapContainer>
              </div>
            </div>
          </div>

          {/* Section 4: 80G Tax */}
          <div className="form-section tax-estimate-section">
             <div className="tax-card">
               <div className="tax-header">
                 <div className="tax-title">
                   <Calculator size={18} />
                   <span>80G Tax Estimate</span>
                 </div>
                 <Info size={16} className="text-muted" />
               </div>
               <div className="tax-body">
                 <div className="tax-row">
                   <span>Estimated food value:</span>
                   <span className="val-bold">₹{taxEstimate}</span>
                 </div>
                 <div className="tax-row highlight">
                   <span>Approx. tax saving (50%):</span>
                   <span className="val-bold green-text">₹{taxSave}</span>
                 </div>
               </div>
             </div>
          </div>

          {/* Recurring Toggle */}
          <div className="recurring-toggle-box">
             <label className="switch-row">
               <div className="switch-text">
                 <h3>Recurring Post</h3>
                 <p>Automatically post on select days</p>
               </div>
               <input 
                 type="checkbox" 
                 checked={formData.isRecurring} 
                 onChange={() => setFormData({...formData, isRecurring: !formData.isRecurring})}
               />
             </label>
             {formData.isRecurring && (
               <div className="days-picker">
                 {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => (
                   <button 
                    key={day}
                    type="button" 
                    className={`day-btn ${formData.recurringDays.includes(day) ? 'active' : ''}`}
                    onClick={() => {
                        const days = formData.recurringDays.includes(day) 
                            ? formData.recurringDays.filter(d => d !== day)
                            : [...formData.recurringDays, day];
                        setFormData({...formData, recurringDays: days});
                    }}
                   >
                     {day}
                   </button>
                 ))}
               </div>
             )}
          </div>

          <button 
            type="submit" 
            className="submit-post-btn"
            disabled={loading || safetyStatus?.type === 'expired'}
          >
            {loading ? <RefreshCw className="animate-spin" /> : <PlusCircle size={20} />}
            <span>Post Food — Help Someone Today 🍱</span>
          </button>
        </form>
      </div>
    </div>
  );
}
