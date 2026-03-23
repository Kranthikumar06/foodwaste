import React, { useState } from 'react';
import { 
  Filter, 
  Package, 
  Clock, 
  Edit, 
  Trash2, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  MapPin,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Award,
  ArrowRight,
  Download,
  Info
} from 'lucide-react';
import './MyPostsPage.css';

const MOCK_POSTS = [
  {
    id: 1, 
    type: 'Rice & Dal', 
    quantity: '15 KG', 
    postedAt: '22 Mar, 6:00 PM', 
    window: '7:00 PM - 9:00 PM',
    status: 'LIVE',
    statusColor: '#3b82f6',
    meals: 45,
    points: 150,
    details: 'Freshly cooked for a small event, surplus. Packed in 5kg buckets.',
    location: 'Madhapur, Hitech City',
    timeline: [
      { event: 'Posted at 6:00 PM on 22 Mar', done: true }
    ]
  },
  {
    id: 2, 
    type: 'Mixed Veg Curry', 
    quantity: '8 KG', 
    postedAt: '22 Mar, 5:30 PM', 
    window: '6:30 PM - 8:30 PM',
    status: 'CLAIMED',
    statusColor: '#f59e0b',
    volunteer: 'Ravi Kumar',
    volunteerPhone: '9876543210',
    meals: 24,
    points: 80,
    details: 'Spicy veg curry, suitable for lunch or dinner.',
    location: 'Kukatpally, Housing Board',
    timeline: [
      { event: 'Posted at 5:30 PM on 22 Mar', done: true },
      { event: 'Claimed at 6:14 PM by Ravi Kumar (volunteer)', done: true }
    ]
  },
  {
    id: 3, 
    type: 'Biryani', 
    quantity: '12 KG', 
    postedAt: '21 Mar, 1:00 PM', 
    window: '2:00 PM - 4:00 PM',
    status: 'DELIVERED',
    statusColor: '#10b981',
    volunteer: 'Anish K.',
    meals: 36,
    points: 120,
    deliveredTo: 'Miyapur Labour Camp',
    details: 'Chicken Biryani, mild spicy.',
    location: 'Gachibowli, Financial Dist',
    timeline: [
      { event: 'Posted at 1:00 PM on 21 Mar', done: true },
      { event: 'Claimed at 1:20 PM by Anish K.', done: true },
      { event: 'Picked up at 1:45 PM', done: true },
      { event: 'Delivered at 2:20 PM to Miyapur Labour Camp', done: true },
      { event: 'Receipt sent to your email', done: true }
    ]
  },
  {
    id: 4, 
    type: 'Bread & Roti', 
    quantity: '5 KG', 
    postedAt: '19 Mar, 9:00 AM', 
    window: '10:00 AM - 12:00 PM',
    status: 'EXPIRED',
    statusColor: '#94a3b8',
    meals: 0,
    points: 0,
    details: 'Freshly baked roti packets.',
    location: 'Jubilee Hills, Rd 36',
    timeline: [
        { event: 'Posted at 9:00 AM on 19 Mar', done: true },
        { event: 'Expired at 12:00 PM (No claims)', done: true }
    ]
  }
];

export default function MyPostsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const tabs = ['All', 'Live', 'Claimed', 'Picked Up', 'Delivered', 'Expired'];

  const filteredPosts = activeTab === 'All' 
    ? MOCK_POSTS 
    : MOCK_POSTS.filter(p => p.status === activeTab.toUpperCase());

  return (
    <div className="my-posts-page-v2">
      <header className="posts-header">
        <h1>My Posts</h1>
        <p className="subtitle">Track your contributions and impact.</p>
      </header>

      {/* Filter Tabs */}
      <div className="filter-tabs-sticky">
        <div className="tabs-container">
          {tabs.map(tab => (
            <button 
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      <div className="posts-list">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <div 
              key={post.id} 
              className={`post-expand-card ${expandedId === post.id ? 'expanded' : ''}`}
            >
              {/* Main row */}
              <div className="post-main-row" onClick={() => setExpandedId(expandedId === post.id ? null : post.id)}>
                <div className="row-left">
                  <div className="type-icon-box">
                    <Package size={24} color="#3b82f6" />
                  </div>
                  <div className="type-info">
                    <h3>{post.type}</h3>
                    <div className="row-meta">
                      <span className="meta-item"><Info size={14} /> {post.quantity}</span>
                      <span className="meta-item"><Calendar size={14} /> {post.postedAt}</span>
                    </div>
                  </div>
                </div>

                <div className="row-right">
                  <div className="window-info">
                     <span className="win-label">Pickup Window</span>
                     <span className="win-val">{post.window}</span>
                  </div>
                  <span className="status-badge" style={{ backgroundColor: post.statusColor + '15', color: post.statusColor }}>
                    {post.status}
                  </span>
                  <div className="action-icons" onClick={e => e.stopPropagation()}>
                    {(post.status === 'LIVE') && (
                        <>
                          <button className="icon-btn-edit"><Edit size={18} /></button>
                          <button className="icon-btn-delete"><Trash2 size={18} /></button>
                        </>
                    )}
                    {post.status === 'DELIVERED' && (
                        <button className="icon-btn-download"><FileText size={18} /></button>
                    )}
                    {expandedId === post.id ? <ChevronUp size={20} className="expand-indicator"/> : <ChevronDown size={20} className="expand-indicator"/>}
                  </div>
                </div>
              </div>

              {/* Expanded Panel */}
              {expandedId === post.id && (
                <div className="post-detail-panel animate-slide-down">
                  <div className="detail-grid">
                    {/* Timeline */}
                    <div className="detail-section">
                      <h4>Donation Timeline</h4>
                      <div className="timeline-v2">
                        {post.timeline.map((item, idx) => (
                          <div key={idx} className="timeline-step">
                            <div className="step-circle done">
                              <CheckCircle2 size={12} />
                            </div>
                            <span className="step-text">{item.event}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Impact Details */}
                    <div className="detail-section impact-box">
                       <h4>Impact & Details</h4>
                       <div className="impact-stats-mini">
                          <div className="impact-pill">
                            <Utensils size={14} />
                            <span>{post.meals} Meals Provided</span>
                          </div>
                          <div className="impact-pill points-impact">
                            <Award size={14} />
                            <span>+{post.points} XP Earned</span>
                          </div>
                       </div>
                       <p className="post-desc-text">"{post.details}"</p>
                       <div className="post-location-mini">
                          <MapPin size={14} />
                          <span>{post.location}</span>
                       </div>
                       {post.volunteer && (
                         <div className="volunteer-card-mini">
                            <span className="v-label">Volunteer Info</span>
                            <span className="v-name">{post.volunteer}</span>
                            <span className="v-phone">{post.volunteerPhone || 'Hidden until dispatch'}</span>
                         </div>
                       )}
                    </div>
                  </div>
                  
                  {post.status === 'DELIVERED' && (
                    <div className="receipt-banner">
                       <CheckCircle2 size={18} />
                       <span>Your donation was delivered to <strong>{post.deliveredTo}</strong>. Thank you for your impact!</span>
                       <button className="download-btn-mini"><Download size={14} /> Receipt</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="posts-empty-state">
            <div className="empty-illust">📦</div>
            {activeTab === 'Live' ? (
                <>
                <h3>No active posts</h3>
                <p>Post your surplus food now and help someone today!</p>
                </>
            ) : activeTab === 'Expired' ? (
                <>
                <h3>No expired posts</h3>
                <p>These posts expired without being claimed. Try posting earlier next time.</p>
                </>
            ) : (
                <>
                <h3>No posts found</h3>
                <p>Try switching to a different tab or post something new.</p>
                </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const Utensils = ({size}) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Z"/><path d="M18 15v7"/></svg>
);
