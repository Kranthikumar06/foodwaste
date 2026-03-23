import React from 'react';
import DonorSidebar from './DonorSidebar';
import './DonorLayout.css';

export default function DonorLayout({ children }) {
  return (
    <div className="donor-layout">
      <DonorSidebar />
      <div className="donor-main-area">
        <div className="donor-container">
          {children}
        </div>
      </div>
    </div>
  );
}
