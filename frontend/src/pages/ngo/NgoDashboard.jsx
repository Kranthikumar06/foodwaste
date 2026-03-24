import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Users, Utensils, TrendingUp, PlusCircle,
  ShieldCheck, Truck, Clock, Zap, ArrowRight,
  CheckCircle2, AlertCircle, Circle, Download,
  ChevronRight, Activity
} from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './NgoDashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const SPOTS = [
  { id: 1, name: 'Miyapur Construction Camp',   area: 'Miyapur',    status: 'unseen',  people: 80 },
  { id: 2, name: 'Rainbow Orphanage',            area: 'Kondapur',   status: 'partial', people: 45 },
  { id: 3, name: 'Gachibowli Old Age Home',      area: 'Gachibowli', status: 'done',    people: 60 },
  { id: 4, name: 'Kukatpally Labour Site',       area: 'Kukatpally', status: 'unseen',  people: 120 },
  { id: 5, name: 'Government Primary School',    area: 'Madhapur',   status: 'done',    people: 200 },
];

const DELIVERIES_LIVE = [
  { volunteer: 'Ravi Kumar', transport: '🛵 Bike', spot: 'Miyapur Construction Camp', food: 'Rice & Dal', kg: 18, eta: '12 min' },
  { volunteer: 'Sneha L.',   transport: '🚗 Car',  spot: 'Rainbow Orphanage',         food: 'Biryani',   kg: 10, eta: '25 min' },
];

const ACTIVITY = [
  { date: '24 Mar', volunteer: 'Anish K.',   food: 'Roti & Sabzi', kg: 5,  spot: 'Old Age Home',          meals: 15 },
  { date: '24 Mar', volunteer: 'Ravi Kumar', food: 'Rice & Dal',   kg: 18, spot: 'Construction Camp',     meals: 54 },
  { date: '23 Mar', volunteer: 'Vikram S.',  food: 'Biryani',      kg: 12, spot: 'Rainbow Orphanage',     meals: 36 },
  { date: '23 Mar', volunteer: 'Priya R.',   food: 'Fruits',       kg: 20, spot: 'Govt School',           meals: 60 },
  { date: '22 Mar', volunteer: 'Sneha L.',   food: 'Lunch Pkts',   kg: 30, spot: 'Kukatpally Labour',     meals: 90 },
];

const statusMeta = {
  unseen:  { label: 'Not served yet',   dot: '#ef4444', bg: '#fef2f2', text: '#dc2626' },
  partial: { label: 'Served once',      dot: '#f59e0b', bg: '#fffbeb', text: '#d97706' },
  done:    { label: 'Fully served',     dot: '#10b981', bg: '#f0fdf4', text: '#059669' },
};

const weeklyLine = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{
    label: 'Expected Meals',
    data: [120, 140, 130, 190, 170, 110, 80],
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderWidth: 2.5,
    fill: true,
    tension: 0.4,
    pointBackgroundColor: '#10b981',
    pointRadius: 4,
  }]
};

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { backgroundColor: '#1e293b', padding: 10, displayColors: false },
  },
  scales: {
    y: { grid: { color: '#f1f5f9' }, border: { display: false } },
    x: { grid: { display: false }, border: { display: false } },
  },
};

export default function NgoDashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Hunger Spots Mapped',        value: '12',   icon: MapPin,    color: '#10b981', bg: '#f0fdf4' },
    { label: 'Spots Served Today',         value: '7',    icon: CheckCircle2, color: '#059669', bg: '#ecfdf5' },
    { label: 'Meals Delivered This Month', value: '3,420',icon: Utensils,  color: '#f59e0b', bg: '#fffbeb' },
    { label: 'Active Volunteers Now',      value: '9',    icon: Users,     color: '#3b82f6', bg: '#eff6ff' },
  ];

  return (
    <div className="ngo-dashboard">
      {/* Top Bar */}
      <header className="ngo-page-header">
        <div className="ngo-header-left">
          <div className="ngo-org-name-row">
            <h1>Humanity Feed Foundation</h1>
            <span className="verified-badge-ngo"><ShieldCheck size={14} /> Verified NGO</span>
          </div>
          <p className="ngo-header-sub"><MapPin size={13} /> Miyapur · Kondapur · Gachibowli · Kukatpally</p>
        </div>
        <button className="ngo-primary-btn" onClick={() => navigate('/ngo/spots')}>
          <PlusCircle size={18} />
          Add Hunger Spot
        </button>
      </header>

      {/* Stats */}
      <section className="ngo-stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="ngo-stat-card">
            <div className="ngo-stat-icon" style={{ background: s.bg }}>
              <s.icon size={22} color={s.color} />
            </div>
            <div className="ngo-stat-body">
              <span className="ngo-stat-label">{s.label}</span>
              <span className="ngo-stat-value">{s.value}</span>
            </div>
          </div>
        ))}
      </section>

      <div className="ngo-main-grid">
        {/* Left column */}
        <div className="ngo-col-left">
          {/* Spot Status */}
          <section className="ngo-card">
            <div className="ngo-card-header">
              <h2>How your spots are doing today</h2>
              <button className="ngo-text-btn" onClick={() => navigate('/ngo/spots')}>
                View all on map <ChevronRight size={14} />
              </button>
            </div>
            <div className="spot-status-list">
              {SPOTS.map(spot => {
                const meta = statusMeta[spot.status];
                return (
                  <div
                    key={spot.id}
                    className="spot-status-row"
                    onClick={() => navigate('/ngo/spots')}
                  >
                    <span className="spot-dot" style={{ background: meta.dot }} />
                    <div className="spot-row-info">
                      <span className="spot-row-name">{spot.name}</span>
                      <span className="spot-row-area">{spot.area} · {spot.people} people</span>
                    </div>
                    <span className="spot-row-pill" style={{ background: meta.bg, color: meta.text }}>
                      {meta.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Live Deliveries */}
          <section className="ngo-card">
            <div className="ngo-card-header">
              <h2>Volunteers heading to your spots</h2>
              <span className="live-badge"><Circle size={8} className="pulse-dot" /> LIVE</span>
            </div>
            {DELIVERIES_LIVE.length > 0 ? (
              <div className="live-delivery-list">
                {DELIVERIES_LIVE.map((d, i) => (
                  <div key={i} className="live-delivery-row">
                    <div className="ld-avatar">{d.volunteer[0]}</div>
                    <div className="ld-info">
                      <span className="ld-name">{d.volunteer} <span className="ld-transport">{d.transport}</span></span>
                      <span className="ld-dest">→ {d.spot}</span>
                      <span className="ld-food">{d.food} · {d.kg} KG</span>
                    </div>
                    <div className="ld-eta">
                      <Clock size={13} />
                      <span>{d.eta}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="ngo-empty-state">No active deliveries right now</div>
            )}
          </section>
        </div>

        {/* Right column */}
        <div className="ngo-col-right">
          {/* AI Forecast */}
          <section className="ngo-card ai-forecast-card">
            <div className="ngo-card-header">
              <h2><Zap size={16} className="zap-icon" /> Expected food this week</h2>
            </div>
            <div className="forecast-hero">
              <span className="forecast-number">~180</span>
              <span className="forecast-unit">meals expected</span>
            </div>
            <p className="forecast-sub">Based on past patterns, approximately <strong>180 meals</strong> from <strong>5 donors</strong> this week.</p>
            <div className="forecast-chart-wrap">
              <Line data={weeklyLine} options={lineOptions} />
            </div>
            <div className="forecast-insight">
              <TrendingUp size={14} />
              <span>Peak day: <strong>Thursday evenings</strong> — prioritise more volunteers then</span>
            </div>
          </section>

          {/* Recent Activity */}
          <section className="ngo-card">
            <div className="ngo-card-header">
              <h2><Activity size={16} /> Recent Activity</h2>
            </div>
            <div className="activity-list">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="activity-row">
                  <div className="act-date">{a.date}</div>
                  <div className="act-details">
                    <span className="act-food">{a.food} · {a.kg} KG</span>
                    <span className="act-vol">by {a.volunteer} → {a.spot}</span>
                  </div>
                  <span className="act-meals">🍽 {a.meals}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
