import React from 'react';
import NgoSidebar from './NgoSidebar';
import './NgoLayout.css';

export default function NgoLayout({ children }) {
  return (
    <div className="ngo-layout">
      <NgoSidebar />
      <div className="ngo-main-area">
        <div className="ngo-content">
          {children}
        </div>
      </div>
    </div>
  );
}
