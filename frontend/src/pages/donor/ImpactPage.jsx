import React from 'react';
import { useSelector } from 'react-redux';
import { 
  PlusCircle, 
  TrendingUp, 
  Utensils, 
  Scale, 
  Leaf, 
  Users, 
  Award, 
  Lock, 
  Share2, 
  Download,
  Calendar,
  Clock,
  Edit,
  Trash2,
  Trophy,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import './ImpactPage.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const MOCK_BADGES = [
  { id: 1, name: 'First Donation', date: 'Oct 2023', icon: '🎁', unlocked: true },
  { id: 2, name: 'Eco Warrior', date: 'Nov 2023', icon: '🌱', unlocked: true },
  { id: 3, name: '100 Meals', date: 'Dec 2023', icon: '🍲', unlocked: true },
  { id: 4, name: 'Local Hero', date: 'Jan 2024', icon: '🏙️', unlocked: true },
  { id: 5, name: 'CO2 Saver', date: null, icon: '☁️', unlocked: false, condition: 'Rescue 500kg of food' },
  { id: 6, name: 'Top 1% Donor', date: null, icon: '💎', unlocked: false, condition: 'Reach Platinum Tier' },
];

const RECURRING_SCHEDULES = [
  { id: 1, type: 'Rice & Curry', qty: '10 KG', days: ['Mon', 'Wed', 'Fri'], time: '1:30 PM', active: true },
  { id: 2, type: 'Bread/Roti', qty: '5 KG', days: ['Sat', 'Sun'], time: '9:00 AM', active: false },
];

export default function ImpactPage() {
  const { user } = useSelector(state => state.auth);

  const heroStats = [
    { label: 'Total Meals Rescued', value: '1,240', icon: Utensils, color: '#10b981' },
    { label: 'Total KG Donated', value: '482', icon: Scale, color: '#3b82f6' },
    { label: 'CO2 Saved (KG)', value: '1,205', icon: Leaf, color: '#8b5cf6' },
    { label: 'Volunteers Served', value: '52', icon: Users, color: '#f59e0b' },
  ];

  const barData = {
    labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [{
      label: 'KG Donated',
      data: [45, 50, 42, 60, 55, 65, 80, 85, 110, 95, 125, 482],
      backgroundColor: '#3b82f6',
      borderRadius: 4,
    }]
  };

  const pieData = {
    labels: ['Cooked Lunch', 'Rice/Dal', 'Fruits', 'Vegetables', 'Other'],
    datasets: [{
      data: [35, 25, 15, 15, 10],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#94a3b8'],
      borderWidth: 0,
    }]
  };

  const leaderboard = [
    { rank: 1, name: 'Alex Rivers', kg: '950', meals: '2,850', pts: '24,500' },
    { rank: 2, name: 'Sarah Chen', kg: '820', meals: '2,460', pts: '22,100' },
    { rank: 3, name: 'Mark Wilson', kg: '740', meals: '2,220', pts: '19,800' },
    { rank: 12, name: 'You', kg: '482', meals: '1,240', pts: '12,550', isMe: true },
    { rank: 13, name: 'Elena K.', kg: '405', meals: '1,215', pts: '11,900' },
  ];

  return (
    <div className="impact-page-v2">
      <header className="impact-header">
        <h1>Your Impact</h1>
        <p className="subtitle">Real-time update on how you're changing the world.</p>
      </header>

      {/* Hero Stats */}
      <section className="hero-grid">
        {heroStats.map((stat, idx) => (
          <div key={idx} className="hero-stat-card">
            <div className="stat-icon-circ" style={{ color: stat.color }}>
              <stat.icon size={28} />
            </div>
            <div className="stat-text">
              <span className="stat-val-large">{stat.value}</span>
              <span className="stat-label-small">{stat.label}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Charts Row */}
      <div className="charts-impact-row">
        <div className="chart-box-impact">
          <h3>Monthly Contribution (KG)</h3>
          <div className="chart-canvas-wrap">
            <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </div>
        <div className="chart-box-impact">
          <h3>Donation Mix</h3>
          <div className="chart-canvas-wrap pie-wrap">
            <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      <div className="impact-main-split">
        {/* Left Column: Gamification */}
        <div className="gamification-col">
          <section className="tier-impact-card">
            <div className="card-top-accent"></div>
            <div className="tier-content-large">
              <div className="badge-ring-glow">
                <Award size={64} className="gold-award" />
              </div>
              <div className="tier-labels-wrap">
                <span className="tier-subtitle-v2">CURRENT TIER</span>
                <h2>Rescuer</h2>
              </div>
              <div className="progress-details-impact">
                <div className="pts-row">
                  <span className="curr-pts">1,240 <small>PTS</small></span>
                  <span className="target-hint">760 more to Guardian Tier</span>
                </div>
                <div className="impact-progress-bar">
                   <div className="impact-progress-fill" style={{ width: '62%' }}></div>
                </div>
              </div>
            </div>
          </section>

          <section className="badges-section-impact card-box-v2">
            <div className="sec-header">
              <h3>Earned Badges</h3>
              <button className="text-link">View all stats</button>
            </div>
            <div className="badges-grid-impact">
              {MOCK_BADGES.map(badge => (
                <div key={badge.id} className={`badge-impact-item ${!badge.unlocked ? 'locked' : ''}`}>
                  <div className="badge-icon-wrap">
                    {badge.unlocked ? <span>{badge.icon}</span> : <Lock size={20} />}
                  </div>
                  <div className="badge-info-mini">
                    <span className="b-name">{badge.name}</span>
                    <span className="b-date">{badge.unlocked ? badge.date : badge.condition}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Leaderboard & Share */}
        <div className="leaderboard-col">
          <section className="leaderboard-impact card-box-v2">
            <div className="sec-header">
              <div className="h-left">
                <Trophy size={18} className="text-orange" />
                <h3>City Leaderboard</h3>
              </div>
              <span className="h-subtitle">THIS MONTH</span>
            </div>
            <div className="leader-table-donor">
               <div className="table-row head">
                  <span>RANK</span>
                  <span>NAME</span>
                  <span>KG</span>
                  <span>PTS</span>
               </div>
               {leaderboard.map((item, idx) => (
                 <div key={idx} className={`table-row ${item.isMe ? 'is-me-row' : ''}`}>
                    <span className="rank-td">{item.rank}</span>
                    <div className="name-td">
                       <div className="avatar-xs"></div>
                       <span>{item.name} {item.isMe && <strong>(You)</strong>}</span>
                    </div>
                    <span className="val-td">{item.kg}</span>
                    <span className="pts-td">{item.pts}</span>
                 </div>
               ))}
            </div>
          </section>

          {/* Shareable Card Preview */}
          <section className="share-impact-preview card-box-v2">
             <div className="shareable-card">
               <div className="card-inner-design">
                  <div className="design-header">
                    <div className="brand-dot"></div>
                    <span>FoodRescue Impact</span>
                  </div>
                  <div className="design-body">
                     <h3>{user?.name?.split(' ')[0] || 'Jane'} Smith</h3>
                     <p className="impact-quote">"I helped rescue <strong>1,240 meals</strong> this month 🍱"</p>
                     <div className="mini-stats-row">
                        <div className="ms-item"><span>482</span><small>KG</small></div>
                        <div className="ms-item"><span>1,205</span><small>CO2</small></div>
                        <div className="ms-item"><span>52</span><small>Vols</small></div>
                     </div>
                  </div>
               </div>
             </div>
             <div className="share-actions">
               <button className="share-btn whatsapp-btn"><MessageCircle size={18} /> Share on WhatsApp</button>
               <button className="share-btn download-btn"><Download size={18} /> Download Card</button>
             </div>
          </section>
        </div>
      </div>

      {/* Recurring Schedules Section */}
      <section className="recurring-schedules-section card-box-v2">
         <div className="sec-header">
            <h3>Your auto-post schedules</h3>
            <button className="add-sched-btn"><PlusCircle size={16} /> Add New Schedule</button>
         </div>
         <div className="schedules-list-impact">
            {RECURRING_SCHEDULES.map(sched => (
              <div key={sched.id} className="schedule-entry-card">
                <div className="sched-left">
                   <div className="sched-icon"><RefreshCw size={20} /></div>
                   <div className="sched-info">
                      <h4>{sched.type} • {sched.qty}</h4>
                      <div className="sched-meta">
                        <div className="days-row">
                          {sched.days.map(d => <span key={d} className="day-chip">{d}</span>)}
                        </div>
                        <span className="meta-time"><Clock size={14} /> {sched.time}</span>
                      </div>
                   </div>
                </div>
                <div className="sched-right">
                   <div className={`status-toggle-simple ${sched.active ? 'active' : ''}`}>
                      <span>{sched.active ? 'Active' : 'Paused'}</span>
                   </div>
                   <div className="sched-actions">
                      <button className="sched-action-btn"><Edit size={16} /></button>
                      <button className="sched-action-btn delete-red"><Trash2 size={16} /></button>
                   </div>
                </div>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
}

const RefreshCw = ({size}) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
);
