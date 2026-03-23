import React from 'react';
import { useSelector } from 'react-redux';
import { 
  PlusCircle, 
  Scale, 
  Utensils, 
  Leaf, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  ArrowRight,
  Download,
  Award,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './DonorDashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DonorDashboard() {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const stats = [
    { label: 'TOTAL KG DONATED', value: '482', icon: Scale, color: '#3b82f6', bg: '#eff6ff' },
    { label: 'TOTAL MEALS PROVIDED', value: '1,205', icon: Utensils, color: '#10b981', bg: '#f0fdf4' },
    { label: 'CO2 SAVED (KG)', value: '1,205', icon: Leaf, color: '#8b5cf6', bg: '#f5f3ff' },
    { label: 'RESCUE SUCCESS RATE', value: '94%', icon: CheckCircle2, color: '#f59e0b', bg: '#fffbeb' }
  ];

  const activePosts = [
    { id: 1, type: 'Rice & Dal', quantity: '15 KG', status: 'LIVE', expires: '2h 15m', window: '7:00 PM - 9:00 PM', priority: 'urgent' },
    { id: 2, type: 'Mixed Veg Curry', quantity: '8 KG', status: 'LIVE', expires: '45m', window: '6:30 PM - 8:30 PM', priority: 'critical' }
  ];

  const recentDeliveries = [
    { id: 101, date: '22 Mar', type: 'Biryani', kg: '12', volunteer: 'Ravi Kumar', destination: 'Miyapur Labour Camp' },
    { id: 102, date: '20 Mar', type: 'Roti & Sabzi', kg: '5', volunteer: 'Anish K.', destination: 'Rainbow Orphanage' },
    { id: 103, date: '18 Mar', type: 'Fruits', kg: '20', volunteer: 'Sneha L.', destination: 'Old Age Home, Gachibowli' },
    { id: 104, date: '15 Mar', type: 'Lunch Packets', kg: '30', volunteer: 'Vikram S.', destination: 'Slum Area Area, Kondapur' },
    { id: 105, date: '12 Mar', type: 'Bread & Jam', kg: '10', volunteer: 'Priya R.', destination: 'Government School' }
  ];

  const chartData = {
    labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [{
      label: 'KG Donated',
      data: [65, 82, 110, 95, 125, 482],
      backgroundColor: '#3b82f6',
      borderRadius: 8,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        displayColors: false
      }
    },
    scales: {
      y: { grid: { display: false }, border: { display: false } },
      x: { grid: { display: false }, border: { display: false } }
    }
  };

  return (
    <div className="donor-dashboard">
      {/* Top Header */}
      <header className="page-header">
        <div className="header-left">
          <h1>Hello {user?.name?.split(' ')[0] || 'Jane'} 👋</h1>
          <p className="subtitle">Your donations are changing lives today.</p>
        </div>
        <button className="post-food-btn" onClick={() => navigate('/donor/post')}>
          <PlusCircle size={20} />
          <span>Post Surplus Food</span>
        </button>
      </header>

      {/* Stats Grid */}
      <section className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: stat.bg }}>
              <stat.icon size={22} color={stat.color} />
            </div>
            <div className="stat-info">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          </div>
        ))}
      </section>

      <div className="dashboard-main-grid">
        {/* Left Column */}
        <div className="dashboard-left">
          {/* Active Posts */}
          <section className="dashboard-section card-box">
            <div className="section-header">
              <div className="header-title">
                <h2>Your live posts</h2>
                <span className="count-badge">{activePosts.length}</span>
              </div>
              <button className="text-btn" onClick={() => navigate('/donor/posts')}>View all my posts <ChevronRight size={16} /></button>
            </div>

            {activePosts.length > 0 ? (
              <div className="active-posts-list">
                {activePosts.map(post => (
                  <div key={post.id} className="active-post-card">
                    <div className="post-info">
                      <h3>{post.type} • {post.quantity}</h3>
                      <div className="post-meta">
                        <span className="meta-item"><Clock size={14} /> Safe for {post.expires}</span>
                        <span className="meta-item"><ArrowRight size={14} /> {post.window}</span>
                      </div>
                    </div>
                    <div className="post-actions">
                      <span className={`status-pill pill-${post.priority}`}>{post.status}</span>
                      <button className="delete-icon-btn"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No active posts right now. Post your surplus food!</p>
              </div>
            )}
          </section>

          {/* Monthly Impact Chart */}
          <section className="dashboard-section card-box">
            <div className="section-header">
              <h2>Monthly Donated (KG)</h2>
              <TrendingUp size={20} className="text-blue" />
            </div>
            <div className="chart-container">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="dashboard-right">
          {/* Gamification Card */}
          <section className="gamification-card card-box dark-impact-card">
            <div className="gamification-header">
              <div className="tier-badge">
                <Award size={32} />
              </div>
              <div className="tier-info">
                <span className="tier-label">CURRENT TIER</span>
                <h3>RESCUER</h3>
              </div>
            </div>
            <div className="points-progression">
              <div className="points-labels">
                <span>340 <span className="pts-unit">PTS</span></span>
                <span className="target-pts">750 PTS</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '45%' }}></div>
              </div>
              <p className="progress-hint">410 more points to Gold Tier</p>
            </div>
            <button className="leaderboard-link-btn">View full leaderboard →</button>
          </section>

          {/* Recent Deliveries */}
          <section className="dashboard-section card-box">
            <div className="section-header">
              <h2>Recent Deliveries</h2>
            </div>
            <div className="deliveries-list">
              {recentDeliveries.map(del => (
                <div key={del.id} className="delivery-row">
                  <div className="del-main">
                    <div className="del-date">{del.date}</div>
                    <div className="del-details">
                      <span className="del-type">{del.type} • {del.kg}KG</span>
                      <span className="del-volunteer">Rescued by {del.volunteer}</span>
                      <span className="del-dest">{del.destination}</span>
                    </div>
                  </div>
                  <button className="receipt-download-btn"><Download size={18} /></button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
