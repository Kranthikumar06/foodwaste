import React, { useState, useEffect } from 'react';
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
  Info,
  Loader
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getDonorPosts, deleteFoodPost } from '../../api/foodPostApi';
import './MyPostsPage.css';

const STATUS_COLORS = {
  'LIVE': '#3b82f6',
  'CLAIMED': '#f59e0b',
  'PICKED_UP': '#6366f1',
  'DELIVERED': '#10b981',
  'EXPIRED': '#94a3b8',
  'REJECTED': '#ef4444'
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) + ', ' + 
         date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export default function MyPostsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const tabs = ['All', 'LIVE', 'CLAIMED', 'PICKED_UP', 'DELIVERED', 'EXPIRED'];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await getDonorPosts();
      if (response.data) {
        setPosts(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch posts');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      setDeleting(postId);
      await deleteFoodPost(postId);
      setPosts(posts.filter(p => p.id !== postId));
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete post');
      console.error('Error deleting post:', error);
    } finally {
      setDeleting(null);
    }
  };

  const filteredPosts = activeTab === 'All' 
    ? posts 
    : posts.filter(p => p.status === activeTab);

  if (loading) {
    return (
      <div className="my-posts-page-v2">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <Loader size={40} className="animate-spin" />
        </div>
      </div>
    );
  }

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
                    <Package size={24} color={STATUS_COLORS[post.status] || '#3b82f6'} />
                  </div>
                  <div className="type-info">
                    <h3>{post.foodType}</h3>
                    <div className="row-meta">
                      <span className="meta-item"><Info size={14} /> {post.quantityKg} KG</span>
                      <span className="meta-item"><Calendar size={14} /> {formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="row-right">
                  <span className="status-badge" style={{ backgroundColor: STATUS_COLORS[post.status] }}>
                    {post.status}
                  </span>
                  {expandedId === post.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {/* Expanded section */}
              {expandedId === post.id && (
                <div className="post-details-section">
                  <div className="details-grid">
                    <div className="detail-item">
                      <label>📍 Location</label>
                      <p>{post.address}</p>
                    </div>
                    <div className="detail-item">
                      <label>🕐 Cooked At</label>
                      <p>{formatDate(post.cookedAt)}</p>
                    </div>
                    <div className="detail-item">
                      <label>⏰ Pickup Window</label>
                      <p>{formatDate(post.pickupWindowStart)} to {formatDate(post.pickupWindowEnd)}</p>
                    </div>
                    {post.description && (
                      <div className="detail-item">
                        <label>📝 Description</label>
                        <p>{post.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="actions-row">
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeletePost(post.id)}
                      disabled={deleting === post.id}
                    >
                      {deleting === post.id ? <Loader size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            <p>No posts found. {activeTab !== 'All' ? 'Try a different filter.' : 'Start posting surplus food!'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
