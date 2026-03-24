import React, { useState } from 'react';
import {
  Download, Calendar, BarChart2, Users, Utensils,
  Scale, MapPin, Star, ChevronDown, TrendingUp
} from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import './NgoReportsPage.css';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, ArcElement, Title, Tooltip, Legend, Filler
);

const SPOT_BREAKDOWN = [
  { name: 'Miyapur Construction Camp', deliveries: 28, kg: 340, meals: 1020, lastServed: '24 Mar' },
  { name: 'Kukatpally Labour Site',     deliveries: 22, kg: 280, meals: 840,  lastServed: '24 Mar' },
  { name: 'Govt Primary School',        deliveries: 18, kg: 210, meals: 630,  lastServed: '24 Mar' },
  { name: 'Old Age Home Gachibowli',    deliveries: 14, kg: 150, meals: 450,  lastServed: '23 Mar' },
  { name: 'Rainbow Orphanage',          deliveries: 10, kg: 120, meals: 360,  lastServed: '23 Mar' },
];

const VOL_PERF = [
  { name: 'Vikram S.',  pickups: 61, kg: 740, reliability: 95, points: 2440 },
  { name: 'Ravi Kumar', pickups: 48, kg: 580, reliability: 92, points: 1920 },
  { name: 'Sneha L.',   pickups: 35, kg: 410, reliability: 88, points: 1400 },
  { name: 'Anish K.',   pickups: 22, kg: 260, reliability: 76, points: 880  },
  { name: 'Priya R.',   pickups: 14, kg: 165, reliability: 63, points: 560  },
];

const dailyLine = {
  labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
  datasets: [{
    label: 'Meals',
    data: [80,100,90,120,110,145,130,95,140,160,115,175,155,130,190,170,120,185,200,165,145,195,180,160,210,190,145,205,220,185],
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderWidth: 2.5,
    fill: true,
    tension: 0.5,
    pointRadius: 0,
  }]
};

const spotBar = {
  labels: SPOT_BREAKDOWN.map(s => s.name.split(' ').slice(0,-1).join(' ')),
  datasets: [{
    label: 'Meals',
    data: SPOT_BREAKDOWN.map(s => s.meals),
    backgroundColor: ['#10b981','#059669','#34d399','#f59e0b','#3b82f6'],
    borderRadius: 8,
  }]
};

const pieData = {
  labels: ['Daily Wage Workers','Homeless','School Children','Elderly','Other'],
  datasets: [{
    data: [40, 20, 18, 14, 8],
    backgroundColor: ['#10b981','#059669','#34d399','#f59e0b','#3b82f6'],
    borderWidth: 0,
  }]
};

const chartOpts = (label) => ({
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1e293b', padding: 10, displayColors: false } },
  scales: {
    y: { grid: { color: '#f1f5f9' }, border: { display: false } },
    x: { grid: { display: false }, border: { display: false } },
  },
});

const reliabilityColor = (s) => s >= 80 ? '#10b981' : s >= 50 ? '#f59e0b' : '#ef4444';

export default function NgoReportsPage() {
  const [range, setRange] = useState('This Month');

  const stats = [
    { label: 'Total Meals Delivered',  value: '3,420', icon: Utensils,   color: '#10b981', bg: '#f0fdf4' },
    { label: 'Total KG Received',      value: '1,100', icon: Scale,      color: '#059669', bg: '#ecfdf5' },
    { label: 'Spots Served',           value: '5 / 5', icon: MapPin,     color: '#10b981', bg: '#f0fdf4' },
    { label: 'Top Volunteer',          value: 'Vikram', icon: Star,      color: '#f59e0b', bg: '#fffbeb' },
  ];

  return (
    <div className="ngo-reports-page">
      {/* Header */}
      <header className="ngo-page-header">
        <div>
          <h1>Impact Reports</h1>
          <p className="ngo-subtitle">Data-driven view of your NGO's food rescue impact</p>
        </div>
        <div className="reports-header-actions">
          <div className="range-picker">
            {['This Month', 'Last Month', 'Custom'].map(r => (
              <button key={r} className={`range-btn ${range === r ? 'active' : ''}`} onClick={() => setRange(r)}>
                {r}
              </button>
            ))}
          </div>
          <button className="ngo-primary-btn">
            <Download size={18} /> Download PDF
          </button>
        </div>
      </header>

      {/* Summary Stats */}
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

      {/* Charts Row */}
      <div className="reports-charts-row">
        <div className="ngo-card chart-card">
          <h3>Daily Meals Delivered (Last 30 Days)</h3>
          <div className="rpt-chart-wrap">
            <Line data={dailyLine} options={chartOpts('Meals')} />
          </div>
        </div>
        <div className="ngo-card chart-card">
          <h3>Spot-wise Meals Distribution</h3>
          <div className="rpt-chart-wrap">
            <Bar data={spotBar} options={chartOpts('Meals')} />
          </div>
        </div>
      </div>

      {/* Spot Breakdown Table */}
      <section className="ngo-card">
        <div className="ngo-card-header">
          <h2><MapPin size={16} /> Spot-wise Breakdown</h2>
        </div>
        <div className="rpt-table">
          <div className="rpt-table-head">
            <span>Spot Name</span>
            <span>Deliveries</span>
            <span>Total KG</span>
            <span>Meals</span>
            <span>Last Served</span>
          </div>
          {SPOT_BREAKDOWN.map((s, i) => (
            <div key={i} className="rpt-table-row">
              <span className="rpt-spot-name">{s.name}</span>
              <span className="rpt-num">{s.deliveries}</span>
              <span className="rpt-num">{s.kg} KG</span>
              <span className="rpt-num highlight-num">{s.meals}</span>
              <span className="rpt-date">{s.lastServed}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Volunteer Performance */}
      <section className="ngo-card">
        <div className="ngo-card-header">
          <h2><Users size={16} /> Volunteer Performance</h2>
        </div>
        <div className="rpt-table">
          <div className="rpt-table-head vol-cols">
            <span>Volunteer</span>
            <span>Pickups</span>
            <span>KG Rescued</span>
            <span>Reliability</span>
            <span>Points</span>
          </div>
          {VOL_PERF.map((v, i) => (
            <div key={i} className="rpt-table-row vol-cols">
              <span className="rpt-spot-name">{v.name}</span>
              <span className="rpt-num">{v.pickups}</span>
              <span className="rpt-num">{v.kg} KG</span>
              <div className="vol-rel-cell-rpt">
                <div className="rel-bar-bg wide">
                  <div className="rel-bar-fill rpt" style={{ width: `${v.reliability}%`, background: reliabilityColor(v.reliability) }} />
                </div>
                <span className="rel-num-rpt" style={{ color: reliabilityColor(v.reliability) }}>{v.reliability}</span>
              </div>
              <span className="rpt-num">{v.points} pts</span>
            </div>
          ))}
        </div>
      </section>

      {/* Beneficiary Pie */}
      <div className="benef-row">
        <section className="ngo-card benef-card">
          <div className="ngo-card-header">
            <h2>Beneficiary Breakdown</h2>
          </div>
          <div className="pie-row">
            <div className="pie-wrap-rpt">
              <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </div>
            <div className="pie-legend">
              {pieData.labels.map((l, i) => (
                <div key={i} className="pie-legend-item">
                  <span className="pie-dot" style={{ background: pieData.datasets[0].backgroundColor[i] }} />
                  <span className="pie-label">{l}</span>
                  <span className="pie-pct">{pieData.datasets[0].data[i]}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
