import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    return (
        <nav className="global-navbar">
            <Link to="/" className="nav-brand">
                <Leaf className="brand-icon" />
                <span>FoodWaste</span>
            </Link>

            {!isAuthPage && (
                <div className="nav-links">
                    <a href="#how-it-works">How it works</a>
                    <a href="#impact">Impact</a>
                    <a href="#join">Join</a>
                    <Link to="/heatmap">Heatmap</Link>
                </div>
            )}

            {isAuthPage && (
                <div className="nav-links">
                    <a href="/#how-it-works">How it works</a>
                    <a href="/#impact">Impact</a>
                    <a href="/#join">Join</a>
                    <Link to="/heatmap">Heatmap</Link>
                </div>
            )}

            <div className="nav-actions">
            </div>
        </nav>
    );
};

export default Navbar;
