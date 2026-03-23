import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Package, 
  TrendingUp, 
  LogOut,
  ChevronRight,
  User 
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import './DonorSidebar.css';

export default function DonorSidebar() {
  const dispatch = useDispatch();

  const navItems = [
    { name: 'Dashboard', path: '/donor/dashboard', icon: LayoutDashboard },
    { name: 'Post Food', path: '/donor/post', icon: PlusCircle },
    { name: 'My Posts', path: '/donor/posts', icon: Package },
    { name: 'My Impact', path: '/donor/impact', icon: TrendingUp },
  ];

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <aside className="donor-sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo donor-brand">D</div>
        <span>Donor Portal</span>
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
