import React from 'react';

import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import styles from './AppLayout.module.scss';

interface AppLayoutProps {
  children?: React.ReactNode; // For non-router usage
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  // TODO: Get user info from Redux
  const userEmail = 'user@email.com'; // Placeholder
  
  return (
    <div className={styles.appContainer}>
      {/* Navigation Bar */}
      <NavBar userEmail={userEmail} />
      
      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {/* 
          If using with React Router, Outlet renders the matched child route
          If using as a wrapper component, render children
        */}
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default AppLayout;