import React from 'react';
import { useSelector } from 'react-redux';
import { 
  Package, 
  Scale, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  MapPin, 
  Navigation,
  Bell,
  PanelLeft,
  Star,
  Sparkles,
  FileText,
  Trophy,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import './VolunteerDashboard.css';

export default function VolunteerDashboard() {
  const { user } = useSelector(state => state.auth);

  const stats = [
    { label: 'TOTAL PICKUPS', value: '142', icon: Package, color: '#3b82f6', bg: '#eff6ff' },
    { label: 'KG RESCUED', value: '845.2', icon: Scale, color: '#10b981', bg: '#f0fdf4' },
    { label: 'RELIABILITY', value: '99.8%', icon: ShieldCheck, color: '#8b5cf6', bg: '#f5f3ff' },
    { label: 'POINTS EARNED', value: '12,450', icon: Zap, color: '#f59e0b', bg: '#fffbeb' }
  ];

  const leaderboard = [
    { rank: 1, name: 'Alex Rivers', points: '24,500 PTS', top: true },
    { rank: 2, name: 'Sarah Chen', points: '22,100 PTS' },
    { rank: 3, name: 'Mark Wilson', points: '19,800 PTS' },
    { rank: 12, name: 'You', points: '12,450 PTS', isMe: true },
    { rank: 13, name: 'Elena K.', points: '11,900 PTS' }
  ];

  return (
    <div className="volunteer-dashboard-v2">
      {/* Top Navbar */}
      <header className="dashboard-navbar">
        <div className="navbar-left">
          <PanelLeft size={20} className="sidebar-toggle" />
          <span className="navbar-title">Dashboard</span>
        </div>
        <div className="navbar-right">
          <button className="notif-btn"><Bell size={20} /></button>
          <button className="new-mission-btn">
            <Sparkles size={16} />
            <span>New Mission</span>
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1>Welcome back, {user?.name?.split(' ')[0] || 'Jane'}! 👋</h1>
          <p>You've rescued 12kg more this week than last week. Great job!</p>
        </div>

        {/* Stats Row */}
        <section className="stats-row">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <div className="stat-top">
                <div className="stat-icon-wrapper" style={{ backgroundColor: stat.bg }}>
                  <stat.icon size={20} color={stat.color} />
                </div>
                <span className="stat-label">{stat.label}</span>
              </div>
              <div className="stat-value">{stat.value}</div>
            </div>
          ))}
        </section>

        {/* Middle Grid */}
        <div className="middle-grid">
          {/* Ongoing Mission Card */}
          <div className="ongoing-mission-card">
            <div className="card-image-bg">
              {/* This represents the image background from screenshot */}
              <div className="mission-overlay"></div>
              <span className="mission-tag">ONGOING MISSION</span>
              <h2 className="mission-title">Central District Loop</h2>
            </div>
            <div className="mission-details">
              <div className="detail-row">
                <div className="detail-icon"><MapPin size={18} /></div>
                <div className="detail-text">
                  <span className="detail-label">Next Stop</span>
                  <span className="detail-val">24 Eco Lane, Green Sector</span>
                </div>
                <button className="mini-action-btn"><ArrowRight size={18} /></button>
              </div>
              <div className="detail-row">
                <div className="detail-icon"><Navigation size={18} /></div>
                <div className="detail-text">
                  <span className="detail-label">Distance</span>
                  <span className="detail-val">1.2 km away</span>
                </div>
              </div>
              <button className="continue-btn">Continue Mission</button>
            </div>
          </div>

          {/* Progression Card */}
          <div className="progression-card">
            <div className="card-header">
              <h2>Your Progression</h2>
              <Star size={18} className="star-icon" fill="#f59e0b" color="#f59e0b" />
            </div>
            
            <div className="tier-info">
              <div className="tier-text">
                <span className="tier-name">SILVER TIER</span>
                <span className="xp-val">12,550 <span className="xp-unit">XP</span></span>
              </div>
              <span className="next-level">Next Level: Gold (2,450 XP to go)</span>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: '70%' }}></div>
              </div>
            </div>

            <div className="badges-row">
              <div className="row-header">
                <h3>Recent Badges</h3>
                <button className="view-all-link">View All</button>
              </div>
              <div className="badges-list">
                <div className="badge-circ blue"><ShieldCheck size={18} /></div>
                <div className="badge-circ yellow"><Zap size={18} /></div>
                <div className="badge-circ orange"><Trophy size={18} /></div>
                <div className="badge-count">+12 more</div>
              </div>
            </div>

            <div className="pro-tip-box">
              <span className="pro-tip-tag">PRO TIP</span>
              <p>Completing missions in the "Downtown" zone earns you 2x XP this weekend!</p>
            </div>
          </div>

          {/* Impact Analysis Card */}
          <div className="impact-analysis-card">
            <div className="card-header">
              <h2>Impact Analysis</h2>
              <div className="ai-icon-wrapper"><Sparkles size={16} /></div>
            </div>
            <span className="subtitle">AI-powered personal report</span>

            <div className="report-center">
              <div className="icon-circle">
                <FileText size={32} />
              </div>
              <h3>Ready for your monthly insight?</h3>
              <p>Our AI analyzes your mission patterns to help you maximize your environmental footprint.</p>
              <button className="generate-report-btn">
                <Sparkles size={16} />
                <span>Generate Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Leaderboard */}
        <section className="leaderboard-section">
          <div className="section-header">
            <h2>City Leaderboard</h2>
            <Trophy size={18} className="trophy-gold" />
          </div>
          <span className="leaderboard-subtitle">SAN FRANCISCO DISTRICT</span>

          <div className="leaderboard-list-v2">
            {leaderboard.map((item, idx) => (
              <div key={idx} className={`leader-row-v2 ${item.isMe ? 'is-me-highlight' : ''}`}>
                <div className="rank-name">
                  <span className={`rank-num ${item.top ? 'top-rank' : ''}`}>{item.rank}</span>
                  <div className="avatar-small"></div>
                  <span className="person-name">{item.name} {item.isMe && <span className="me-badge">You</span>}</span>
                </div>
                <div className="points-info">
                  <span className="points-val">{item.points}</span>
                  {item.top && <Trophy size={14} className="small-trophy" />}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
