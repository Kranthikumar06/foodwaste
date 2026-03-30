import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Users,
  BarChart2,
  UserCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Leaf,
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import './NgoSidebar.css';

export default function NgoSidebar() {
  const dispatch = useDispatch();

  const navItems = [
    { name: 'Dashboard',      path: '/ngo/dashboard',  icon: LayoutDashboard },
    { name: 'Hunger Spots',   path: '/ngo/spots',      icon: MapPin },
    { name: 'Volunteer Team', path: '/ngo/volunteers', icon: Users },
    { name: 'Impact Reports', path: '/ngo/reports',    icon: BarChart2 },
    { name: 'Profile',        path: '/ngo/profile',    icon: UserCircle },
  ];

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <aside className="ngo-sidebar">
      <div className="ngo-brand">
        <Leaf size={32} className="brand-icon" />
        <div className="ngo-brand-text">
          <span className="ngo-brand-name">NGO Portal</span>
          <span className="ngo-brand-sub">Food Rescue HQ</span>
        </div>
      </div>

      <nav className="ngo-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `ngo-nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} className="ngo-nav-icon" />
            <span className="ngo-nav-label">{item.name}</span>
            <ChevronRight size={14} className="ngo-nav-chevron" />
          </NavLink>
        ))}
      </nav>

      <div className="ngo-sidebar-footer">
        <button className="ngo-logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
