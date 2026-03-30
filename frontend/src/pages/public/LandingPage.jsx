import React from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf, ArrowRight, HeartHandshake, Map,
  Clock, ShieldCheck, Languages, Zap,
  Users, Activity, Utensils, Route, Receipt, TextSelect,
  Trophy
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <Navbar />

      {/* 2. Hero Section */}
      <section className="hero-section bg-green">
        <div className="hero-content">
          <div className="hero-badge">
            Live in Hyderabad • 189M Indians go hungry daily
          </div>

          <h1 className="hero-title">
            Surplus food rescued.<br />Hunger reduced.
          </h1>

          <p className="hero-subtitle">
            FoodWaste connects surplus food from donors to those in need, efficiently and on time.
          </p>

          <div className="hero-actions">
            <Link to="/register?role=donor" className="primary-btn">
              I have surplus food <ArrowRight size={20} />
            </Link>
            <Link to="/register?role=volunteer" className="secondary-btn">
              I want to volunteer
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <h3>45,230</h3>
              <p>Meals Rescued</p>
            </div>
            <div className="stat-item">
              <h3>12,400</h3>
              <p>KG Saved</p>
            </div>
            <div className="stat-item">
              <h3>850+</h3>
              <p>Volunteers</p>
            </div>
            <div className="stat-item">
              <h3>120</h3>
              <p>Partner NGOs</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How It Works */}
      <section id="how-it-works" className="section">
        <div className="section-inner">
          <h2 className="section-title">How It Works</h2>
          <div className="how-grid">
            <div className="how-card">
              <div className="step-number">1</div>
              <Utensils className="how-icon" />
              <h3>Post Surplus</h3>
              <p>Donor lists excess food with quantity and freshness details in seconds.</p>
            </div>
            <div className="how-card">
              <div className="step-number">2</div>
              <Route className="how-icon" />
              <h3>Volunteers Alerted</h3>
              <p>Our smart routing instantly notifies nearby volunteers to pick up the batch.</p>
            </div>
            <div className="how-card">
              <div className="step-number">3</div>
              <Receipt className="how-icon" />
              <h3>NGO Delivers</h3>
              <p>Food reaches the hungry, and a verified impact receipt is generated.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The Problem */}
      <section id="impact" className="problem-section bg-green">
        <div className="problem-container">
          <div className="problem-stats">
            <div className="p-stat-box">
              <h4>68M</h4>
              <p>Tonnes Wasted</p>
            </div>
            <div className="p-stat-box">
              <h4>189M</h4>
              <p>Hungry Daily</p>
            </div>
            <div className="p-stat-box">
              <h4>₹92K Cr</h4>
              <p>Economic Value Lost</p>
            </div>
          </div>
          <p className="problem-statement">
            The food exists. The need exists. We build the bridge.
          </p>
        </div>
      </section>

      {/* 5. Features Grid */}
      <section className="section">
        <div className="section-inner">
          <h2 className="section-title">Why FoodWaste?</h2>
          <div className="features-grid">
            <div className="feature-tile">
              <Zap className="feature-icon" />
              <h4>AI Prediction</h4>
              <p>Forecasts surplus patterns to optimize collection routes.</p>
            </div>
            <div className="feature-tile">
              <Clock className="feature-icon" />
              <h4>Expiry Priority</h4>
              <p>Time-critical routing ensures food is distributed while fresh.</p>
            </div>
            <div className="feature-tile">
              <Route className="feature-icon" />
              <h4>Batch Routing</h4>
              <p>Groups pickups intelligently to minimize volunteer travel time.</p>
            </div>
            <div className="feature-tile">
              <ShieldCheck className="feature-icon" />
              <h4>Image Verification</h4>
              <p>Validates food condition before and after transit securely.</p>
            </div>
            <div className="feature-tile">
              <Activity className="feature-icon" />
              <h4>Emergency Mode</h4>
              <p>Instantly blasts SOS alerts for massive unexpected surpluses.</p>
            </div>
            <div className="feature-tile">
              <Trophy className="feature-icon" />
              <h4>Gamification</h4>
              <p>Leaderboards and badges reward the most active rescuers.</p>
            </div>
            <div className="feature-tile">
              <Languages className="feature-icon" />
              <h4>3 Languages</h4>
              <p>Accessible UI available in English, Hindi, and Telugu.</p>
            </div>
            <div className="feature-tile">
              <Map className="feature-icon" />
              <h4>Hunger Heatmap</h4>
              <p>Real-time view of high-need areas to direct resources better.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Who Can Join */}
      <section id="join" className="section bg-green">
        <div className="section-inner">
          <h2 className="section-title">Join the Movement</h2>
          <div className="roles-grid">
            <div className="role-card">
              <Utensils className="role-icon" />
              <h3>Donor</h3>
              <div className="role-subtitle">Restaurants • Caterers • Events</div>
              <p>Turn your excess high-quality food into meals for the hungry instead of waste.</p>
              <Link to="/register?role=donor" className="role-btn">Register as Donor</Link>
            </div>
            <div className="role-card">
              <HeartHandshake className="role-icon" />
              <h3>Volunteer</h3>
              <div className="role-subtitle">Individuals • Students • Fleets</div>
              <p>Use your free time and vehicle to transport food and save lives locally.</p>
              <Link to="/register?role=volunteer" className="role-btn">Become a Volunteer</Link>
            </div>
            <div className="role-card">
              <Users className="role-icon" />
              <h3>NGO Partner</h3>
              <div className="role-subtitle">Shelters • Orphanages • Slum Groups</div>
              <p>Get reliable access to fresh surplus food delivered straight to your community.</p>
              <Link to="/register?role=ngo" className="role-btn">Partner with Us</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Heatmap CTA Banner */}
      <section className="section">
        <div className="section-inner">
          <div className="heatmap-banner">
            <div className="heatmap-content">
              <h2>Hunger Hotspot Heatmap</h2>
              <p>Our real-time platform maps out areas with the highest demand for food based on NGO reports and demographic data, helping us route donations where they are needed most.</p>
              <Link to="/heatmap" className="heatmap-btn">
                View Live Heatmap
              </Link>
            </div>
            <div className="heatmap-visual">
              <Map className="map-icon" />
            </div>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="nav-brand">
              <Leaf className="brand-icon" />
              <span>FoodWaste</span>
            </Link>
            <div className="footer-tagline">Bridging the gap between surplus and need.</div>
          </div>
          <div className="footer-links">
            <Link to="/about">About</Link>
            <Link to="/heatmap">Heatmap</Link>
            <Link to="/api">API</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} FoodWaste. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
