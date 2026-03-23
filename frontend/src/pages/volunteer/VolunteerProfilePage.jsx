import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  User, 
  Mail, 
  Phone as PhoneIcon, 
  MapPin, 
  Globe, 
  Truck, 
  Bell, 
  Lock, 
  Trash2, 
  LogOut,
  ChevronRight,
  Edit2
} from 'lucide-react';
import { logout } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import './VolunteerProfilePage.css';

export default function VolunteerProfilePage() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isOnline, setIsOnline] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || 'SAMUDRALA KRANTHI KUMAR',
    email: user?.email || 'kranthikumarsamudrala381@gmail.com',
    phone: '9876543210',
    city: 'Hyderabad',
    language: 'English',
    transport: 'Two Wheeler'
  });

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="profile-page-v2">
      <div className="profile-container-v2">
        {/* Top Profile Header Card */}
        <div className="header-card">
          <div className="header-card-stripe"></div>
          <div className="header-content">
            <div className="avatar-section">
              <div className="profile-avatar-large">
                <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=200&h=200&fit=crop" alt="Avatar" />
                <div className="status-dot-active"></div>
              </div>
              <div className="user-intro">
                <h1>{formData.fullName}</h1>
                <div className="header-meta">
                  <span className="role-badge">VOLUNTEER</span>
                  <span className="meta-item"><MapPin size={14} /> {formData.city}</span>
                  <span className="meta-item">• Member since March 2024</span>
                </div>
              </div>
            </div>
            <div className="header-actions">
              <div className={`status-toggle-card ${isOnline ? 'online' : 'offline'}`}>
                <span className="toggle-label">{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
                <label className="profile-switch">
                  <input type="checkbox" checked={isOnline} onChange={() => setIsOnline(!isOnline)} />
                  <span className="profile-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-grid">
          {/* Left Column: Personal Details */}
          <div className="details-column">
            <div className="section-card">
              <div className="section-header">
                <h2>Personal Details</h2>
                <button className="edit-info-btn">Edit Info</button>
              </div>

              <div className="details-list">
                <div className="input-group-row">
                  <div className="input-field-full">
                    <label><User size={14} /> FULL NAME</label>
                    <input type="text" value={formData.fullName} readOnly />
                  </div>
                </div>

                <div className="input-group-row">
                  <div className="input-field-full">
                    <label><Mail size={14} /> EMAIL ADDRESS</label>
                    <input type="email" value={formData.email} readOnly />
                  </div>
                </div>

                <div className="input-group-row">
                  <div className="input-field-full">
                    <label><PhoneIcon size={14} /> PHONE NUMBER</label>
                    <input type="text" value={formData.phone} readOnly />
                  </div>
                </div>

                <div className="input-group-row-split">
                  <div className="input-field-half">
                    <label><MapPin size={14} /> CITY</label>
                    <input type="text" value={formData.city} readOnly />
                  </div>
                </div>

                <div className="input-group-row-split fixed-gap">
                  <div className="input-field-half">
                    <label><Globe size={14} /> LANGUAGE</label>
                    <div className="custom-select-mimic">
                      <span>{formData.language}</span>
                      <ChevronRight size={14} className="rotate-90" />
                    </div>
                  </div>
                  <div className="input-field-half">
                    <label><Truck size={14} /> TRANSPORT TYPE</label>
                    <div className="custom-select-mimic">
                      <span>{formData.transport}</span>
                      <ChevronRight size={14} className="rotate-90" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Notifications & Account */}
          <div className="settings-column">
            {/* Notifications Card */}
            <div className="section-card">
              <div className="section-header-simple">
                <Bell size={18} className="header-icon" />
                <h2>Notifications</h2>
              </div>
              
              <div className="toggle-list">
                <div className="toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-title">Push Notifications</span>
                    <span className="toggle-desc">Alerts for nearby food posts</span>
                  </div>
                  <label className="profile-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="profile-slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-title">SMS Alerts</span>
                    <span className="toggle-desc">Important duty updates via text</span>
                  </div>
                  <label className="profile-switch">
                    <input type="checkbox" />
                    <span className="profile-slider"></span>
                  </label>
                </div>
              </div>

              <div className="dropdown-field">
                <label>NOTIFICATION LANGUAGE</label>
                <div className="custom-select-mimic bg-light">
                  <span>English</span>
                  <ChevronRight size={14} className="rotate-90" />
                </div>
              </div>
            </div>

            {/* Account Settings Card */}
            <div className="section-card mt-card">
              <div className="section-header-simple">
                <h2>Account Settings</h2>
              </div>

              <div className="action-rows">
                <button className="action-row-btn">
                  <div className="row-left">
                    <div className="row-icon-box blue-icon"><Lock size={16} /></div>
                    <span>Change Password</span>
                  </div>
                  <ChevronRight size={16} />
                </button>

                <button className="action-row-btn">
                  <div className="row-left">
                    <div className="row-icon-box red-icon"><Trash2 size={16} /></div>
                    <span className="red-text">Delete Account</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
              </div>

              <button className="full-logout-btn" onClick={handleLogout}>
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
