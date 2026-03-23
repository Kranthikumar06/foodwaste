import React from 'react';
import VolunteerSidebar from './VolunteerSidebar';
import './VolunteerLayout.css';

export default function VolunteerLayout({ children }) {
  return (
    <div className="volunteer-layout">
      <VolunteerSidebar />
      <div className="layout-content">
        {children}
      </div>
    </div>
  );
}
