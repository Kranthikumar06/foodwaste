import React, { useState } from 'react';
import { 
  Package, 
  Trash2, 
  TrendingUp, 
  Award, 
  ChevronRight, 
  MapPin, 
  Calendar, 
  Clock, 
  ArrowRight,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  Truck
} from 'lucide-react';
import './PickupHistoryPage.css';

export default function PickupHistoryPage() {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [expandedRow, setExpandedRow] = useState(null);

  const stats = [
    { label: 'Total Pickups', value: '124', icon: Package, color: '#3b82f6' },
    { label: 'KG Rescued', value: '2,450', icon: TrendingUp, color: '#10b981' },
    { label: 'Reliability', value: '98/100', icon: CheckCircle2, color: '#8b5cf6' },
    { label: 'Points Earned', value: '5,840', icon: Award, color: '#f59e0b' }
  ];

  const badges = [
    { id: 1, name: 'First Responder', date: 'Mar 12, 2024', icon: '🏃', locked: false },
    { id: 2, name: 'Night Owl', date: 'Apr 05, 2024', icon: '🦉', locked: false },
    { id: 3, name: 'Eco Warrior', date: 'May 20, 2024', icon: '🌱', locked: false },
    { id: 4, name: 'Master Rescuer', icon: '👑', locked: true, requirement: '50 more pickups' },
    { id: 5, name: 'City Legend', icon: '🏙️', locked: true, requirement: '1000kg more' },
    { id: 6, name: 'Top 1% Club', icon: '🚀', locked: true, requirement: 'Top 10 rank' }
  ];

  const leaderboard = [
    { rank: 1, name: 'Aditya S.', points: 8200 },
    { rank: 2, name: 'Priya R.', points: 7950 },
    { rank: 3, name: 'Anish K.', points: 7600 },
    { rank: 8, name: 'Kranthi Kumar', points: 5840, isMe: true },
    { rank: 4, name: 'Sneha L.', points: 7400 }
  ].sort((a,b) => a.rank - b.rank);

  const history = [
    { 
      id: 'PK-9821', 
      date: '2024-03-20', 
      time: '14:30', 
      donor: 'Royal Garden Restaurant', 
      type: 'Cooked Food', 
      kg: 15, 
      ngo: 'Hope Shelter', 
      points: 45, 
      status: 'COMPLETED',
      timeline: { claimed: '14:05', picked: '14:20', delivered: '14:45' }
    },
    { 
      id: 'PK-9818', 
      date: '2024-03-19', 
      time: '11:15', 
      donor: 'Fresh Bakes Bakery', 
      type: 'Bakery Items', 
      kg: 8, 
      ngo: 'Smile Foundation', 
      points: 25, 
      status: 'COMPLETED',
      timeline: { claimed: '10:50', picked: '11:10', delivered: '11:30' }
    },
    { 
      id: 'PK-9810', 
      date: '2024-03-18', 
      time: '19:00', 
      donor: 'City Convention Center', 
      type: 'Meals', 
      kg: 40, 
      ngo: 'Home of Peace', 
      points: 0, 
      status: 'CANCELLED',
      reason: 'Vehicle breakdown reported'
    }
  ];

  const scoreActions = [
    { id: 1, action: 'On-time pickup from Royal Garden', change: '+2', date: 'Today' },
    { id: 2, action: 'Completed delivery to Hope Shelter', change: '+3', date: 'Yesterday' },
    { id: 3, action: 'Cancelled pickup (PK-9810)', change: '-5', date: '2 days ago' },
    { id: 4, action: '5 consecutive successful pickups', change: '+10', date: 'Last week' }
  ];

  return (
    <div className="history-page-container">
      

      <main className="history-main">
        {/* Stats Row */}
        <section className="stats-grid animate-fade-in">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card" style={{ '--accent': stat.color }}>
              <div className="stat-icon-wrapper">
                <stat.icon size={24} color={stat.color} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Gamification & Leaderboard Grid */}
        <div className="gamification-grid">
          {/* Progression Section */}
          <section className="gamification-card animate-slide-up">
            <div className="section-header">
              <h2>My Progress</h2>
              <span className="tier-tag silver">Silver Tier</span>
            </div>
            
            <div className="tier-badge-large">
              <Award size={64} className="badge-icon-main" />
              <div className="tier-glow"></div>
            </div>

            <div className="progress-details">
              <div className="progress-text">
                <span className="current-points">340 / 750 pts</span>
                <span className="next-tier">to Gold Tier</span>
              </div>
              <div className="progress-bar-outer">
                <div className="progress-bar-inner" style={{ width: '45%' }}></div>
              </div>
            </div>

            <div className="badges-shelf">
              <h3>Earned Badges</h3>
              <div className="badges-grid">
                {badges.map(badge => (
                  <div key={badge.id} className={`badge-item ${badge.locked ? 'locked' : ''}`} title={badge.locked ? badge.requirement : badge.name}>
                    <div className="badge-emoji">{badge.icon}</div>
                    <span className="badge-name">{badge.name}</span>
                    {!badge.locked && <span className="badge-date">{badge.date}</span>}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Leaderboard Section */}
          <section className="leaderboard-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="section-header">
              <h2>City Leaderboard</h2>
              <span className="city-tag">Hyderabad • March</span>
            </div>
            
            <div className="leaderboard-list">
              {leaderboard.map((user, idx) => (
                <div key={idx} className={`leaderboard-item ${user.isMe ? 'is-me' : ''}`}>
                  <div className="rank">#{user.rank}</div>
                  <div className="user-avatar">{user.name.charAt(0)}</div>
                  <div className="user-name">{user.name} {user.isMe && '(You)'}</div>
                  <div className="user-points">{user.points} pts</div>
                </div>
              ))}
            </div>
            <button className="view-full-btn">View All Ranking <ChevronRight size={16} /></button>
          </section>
        </div>

        {/* History Table Section */}
        <section className="history-table-section animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="table-header">
            <h2>Pickup History</h2>
            <div className="table-filters">
              <div className="search-box">
                <Search size={18} />
                <input type="text" placeholder="Search pickups..." />
              </div>
              <div className="filter-dropdown">
                <Filter size={18} />
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="ALL">All Status</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Donor</th>
                  <th>Food Info</th>
                  <th>NGO Delivered</th>
                  <th>Points</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row) => (
                  <React.Fragment key={row.id}>
                    <tr 
                      className={`history-row ${expandedRow === row.id ? 'expanded' : ''}`}
                      onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
                    >
                      <td>
                        <div className="td-datetime">
                          <span className="td-date">{row.date}</span>
                          <span className="td-time">{row.time}</span>
                        </div>
                      </td>
                      <td className="td-donor">{row.donor}</td>
                      <td>
                        <div className="td-food">
                          <span className="food-type">{row.type}</span>
                          <span className="food-kg">{row.kg} KG</span>
                        </div>
                      </td>
                      <td className="td-ngo">{row.ngo}</td>
                      <td className="td-points">
                        <span className={row.points > 0 ? 'pts-pos' : 'pts-none'}>
                          {row.points > 0 ? `+${row.points}` : '-'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${row.status.toLowerCase()}`}>
                          {row.status === 'COMPLETED' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {row.status}
                        </span>
                      </td>
                    </tr>
                    {expandedRow === row.id && (
                      <tr className="expanded-details-row">
                        <td colSpan="6">
                          <div className="expanded-content animate-fade-in">
                            <div className="details-grid">
                              <div className="timeline-tracker">
                                <div className="timeline-step">
                                  <div className="step-point done"></div>
                                  <div className="step-label">Claimed at {row.timeline?.claimed || '--'}</div>
                                </div>
                                <div className="timeline-connector done"></div>
                                <div className="timeline-step">
                                  <div className={`step-point ${row.status === 'CANCELLED' ? 'failed' : 'done'}`}></div>
                                  <div className="step-label">Picked up at {row.timeline?.picked || '--'}</div>
                                </div>
                                <div className="timeline-connector"></div>
                                <div className="timeline-step">
                                  <div className={`step-point ${row.status === 'CANCELLED' ? '' : 'done'}`}></div>
                                  <div className="step-label">Delivered at {row.timeline?.delivered || '--'}</div>
                                </div>
                              </div>
                              
                              <div className="impact-summary">
                                <h3>Impact Created</h3>
                                <p>This rescue fed approximately <b>{row.kg * 3} people</b> and saved <b>{row.kg * 2.5}kg</b> of CO2 emissions.</p>
                                <div className="mini-map-placeholder">
                                  <MapPin size={24} className="map-pin donor" />
                                  <ArrowRight size={20} className="map-arrow" />
                                  <MapPin size={24} className="map-pin ngo" />
                                  <span>Route: {row.donor.split(' ')[0]} → {row.ngo.split(' ')[0]}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Reliability Score Section */}
        <section className="reliability-section animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="reliability-grid">
            <div className="reliability-gauge-box">
              <h2>Reliability Score</h2>
              <div className="gauge-container">
                <svg viewBox="0 0 100 50">
                  <path d="M10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                  <path d="M10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#8b5cf6" strokeWidth="8" 
                    strokeDasharray="125.6" strokeDashoffset="2.5" />
                </svg>
                <div className="gauge-val">98</div>
              </div>
              <p className="reliability-desc">You are in the top 2% of reliable volunteers!</p>
            </div>

            <div className="reliability-log-box">
              <h3>Score Breakdown</h3>
              <div className="score-factors">
                <div className="factor-item">
                  <span className="factor-icon up">✅</span>
                  <span className="factor-text">On-time pickups increase score</span>
                </div>
                <div className="factor-item">
                  <span className="factor-icon down">❌</span>
                  <span className="factor-text">Claiming but not picking up decreases score</span>
                </div>
              </div>
              <div className="score-actions-list">
                <h4>Recent Adjustments</h4>
                {scoreActions.map(action => (
                  <div key={action.id} className="action-row">
                    <span className="action-date">{action.date}</span>
                    <span className="action-text">{action.action}</span>
                    <span className={`action-change ${action.change.startsWith('+') ? 'pos' : 'neg'}`}>
                      {action.change}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
