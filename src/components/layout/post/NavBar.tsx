// src/components/layout/NavBar.tsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './NavBar.module.scss';

interface NavBarProps {
  userEmail?: string; // Will come from Redux later
}

const NavBar: React.FC<NavBarProps> = ({ userEmail = 'user@email.com' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if current page is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // Handle logout
  const handleLogout = () => {
    // TODO: Clear auth state from Redux
    console.log('Logging out...');
    navigate('/login');
  };
  
  // Handle menu click (for mobile or dropdown)
  const handleMenu = () => {
    console.log('Menu clicked');
    // TODO: Implement menu dropdown
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo/Brand */}
        <Link to="/" className={styles.logo}>
          FORUM
        </Link>
        
        {/* Navigation Links */}
        <div className={styles.navLinks}>
          <Link 
            to="/home" 
            className={`${styles.navLink} ${isActive('/home') ? styles.active : ''}`}
          >
            Home
          </Link>
          
          <button 
            className={styles.navLink}
            onClick={handleMenu}
          >
            Menu
          </button>
          
          <button 
            className={styles.navLink}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        
        {/* User Info */}
        <div className={styles.userInfo}>
          <span className={styles.userEmail}>{userEmail}</span>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;