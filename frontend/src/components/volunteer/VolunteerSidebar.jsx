import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Map,
  User, 
  LogOut,
  ChevronRight,
  History
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import './VolunteerSidebar.css';

export default function VolunteerSidebar() {
  const dispatch = useDispatch();

  const navItems = [
    { name: 'Dashboard', path: '/volunteer/dashboard', icon: LayoutDashboard },
    { name: 'Food Map', path: '/volunteer/map', icon: MapPin },
    { name: 'Active Route', path: '/volunteer/route/active', icon: Map },
    { name: 'Profile', path: '/volunteer/profile', icon: User },
  ];

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <aside className="volunteer-sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">F</div>
        <span>FoodWaste</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={22} className="sidebar-icon" />
            <span className="item-name">{item.name}</span>
            <ChevronRight size={16} className="chevron" />
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-side-btn" onClick={handleLogout}>
          <LogOut size={22} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
