import React, { useState } from 'react';
import {
  Building2, MapPin, Phone, Mail, Save,
  Bell, Lock, LogOut, Upload, ChevronRight,
  ShieldCheck, Eye, EyeOff
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import './NgoProfilePage.css';

export default function NgoProfilePage() {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();

  const [profile, setProfile] = useState({
    name: 'Humanity Feed Foundation',
    regNumber: 'NGO/HYD/2021/04812',
    address: '4th Floor, Green Valley Complex, Madhapur, Hyderabad',
    city: 'Hyderabad',
    zones: 'Miyapur, Kondapur, Gachibowli, Kukatpally',
    contact: 'Dr. Ramesh Babu',
    phone: '9876543210',
    email: 'info@humanityfeed.org',
  });

  const [notifs, setNotifs] = useState({
    volunteerHeading: true,
    spotUnserved: true,
    dailySummary: true,
    weeklyForecast: false,
  });

  const [showPwdForm, setShowPwdForm] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <div className="ngo-profile-page">
      <header className="ngo-page-header">
        <div>
          <h1>NGO Profile</h1>
          <p className="ngo-subtitle">Manage your organisation details and preferences</p>
        </div>
      </header>

      {/* Profile Section */}
      <section className="ngo-card profile-section">
        <div className="ngo-card-header">
          <h2><Building2 size={16} /> Organisation Details</h2>
          {saved && <span className="save-toast"><ShieldCheck size={14} /> Changes saved!</span>}
        </div>

        <div className="profile-logo-row">
          <div className="profile-logo-placeholder">
            <span>HF</span>
          </div>
          <div>
            <button className="upload-logo-btn"><Upload size={15} /> Upload Logo / Photo</button>
            <p className="upload-hint">PNG or JPG, max 2MB</p>
          </div>
        </div>

        <div className="profile-form">
          <div className="form-row-2">
            <div className="form-field">
              <label>NGO Name</label>
              <input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Registration Number</label>
              <input value={profile.regNumber} onChange={e => setProfile({ ...profile, regNumber: e.target.value })} />
            </div>
          </div>

          <div className="form-field">
            <label>Address</label>
            <input value={profile.address} onChange={e => setProfile({ ...profile, address: e.target.value })} />
          </div>

          <div className="form-row-2">
            <div className="form-field">
              <label>City</label>
              <input value={profile.city} onChange={e => setProfile({ ...profile, city: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Service Zones</label>
              <input placeholder="e.g. Miyapur, Kondapur" value={profile.zones} onChange={e => setProfile({ ...profile, zones: e.target.value })} />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-field">
              <label>Contact Person</label>
              <input value={profile.contact} onChange={e => setProfile({ ...profile, contact: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Phone</label>
              <input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
            </div>
          </div>

          <div className="form-field">
            <label>Email</label>
            <input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
          </div>

          <button className="ngo-primary-btn save-btn" onClick={handleSave}>
            <Save size={16} /> Save Changes
          </button>
        </div>
      </section>

      {/* Notification Preferences */}
      <section className="ngo-card">
        <div className="ngo-card-header">
          <h2><Bell size={16} /> Notification Preferences</h2>
        </div>

        <div className="notif-list">
          {[
            { key: 'volunteerHeading', label: 'Volunteer heading to a spot', desc: 'Get alerted when a volunteer is en route to one of your hunger spots' },
            { key: 'spotUnserved',     label: 'Spot not served by 8 PM',    desc: 'Daily alert if any spot has not received food by 8 PM' },
            { key: 'dailySummary',     label: 'Daily Summary Email',         desc: 'Receive a daily email with all deliveries and meals served' },
            { key: 'weeklyForecast',   label: 'Weekly Forecast Report',      desc: 'Get AI-predicted food availability for the upcoming week' },
          ].map(item => (
            <div key={item.key} className="notif-row">
              <div className="notif-text">
                <span className="notif-label">{item.label}</span>
                <span className="notif-desc">{item.desc}</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifs[item.key]}
                  onChange={() => setNotifs({ ...notifs, [item.key]: !notifs[item.key] })}
                />
                <span className="toggle-track" />
              </label>
            </div>
          ))}
        </div>
      </section>

      {/* Account Section */}
      <section className="ngo-card">
        <div className="ngo-card-header">
          <h2><Lock size={16} /> Account</h2>
        </div>

        <div className="account-actions">
          <button className="account-action-item" onClick={() => setShowPwdForm(!showPwdForm)}>
            <Lock size={16} />
            <span>Change Password</span>
            <ChevronRight size={16} className="chevron-icon" />
          </button>

          {showPwdForm && (
            <div className="pwd-form">
              <div className="form-field">
                <label>Current Password</label>
                <div className="pwd-input-wrap">
                  <input type={showPwd ? 'text' : 'password'} placeholder="••••••••" />
                  <button type="button" className="eye-btn" onClick={() => setShowPwd(!showPwd)}>
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="form-field">
                <label>New Password</label>
                <input type={showPwd ? 'text' : 'password'} placeholder="Min 8 characters" />
              </div>
              <button className="ngo-primary-btn save-btn">Update Password</button>
            </div>
          )}

          <button className="account-action-item logout-item" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
            <ChevronRight size={16} className="chevron-icon" />
          </button>
        </div>
      </section>
    </div>
  );
}
