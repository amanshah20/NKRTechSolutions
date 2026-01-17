import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UserProfileDropdown from './UserProfileDropdown';
import '../styles/navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const location = useLocation();
  const { user, logout, openAuthModal } = useAuth();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (user) {
      setShowProfileDropdown(true);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <img src="/images/nkr-logo.svg" alt="NKR Logo" className="navbar-logo-image" />
            <span className="navbar-logo-text">NKR Tech Solutions</span>
          </Link>

        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li><Link to="/" className={`navbar-link ${isActive('/')}`} onClick={closeMenu}>Home</Link></li>
          <li><Link to="/about" className={`navbar-link ${isActive('/about')}`} onClick={closeMenu}>About Us</Link></li>
          <li><Link to="/services" className={`navbar-link ${isActive('/services')}`} onClick={closeMenu}>Services</Link></li>
          <li><Link to="/why-choose-us" className={`navbar-link ${isActive('/why-choose-us')}`} onClick={closeMenu}>Why Choose Us</Link></li>
          <li><Link to="/contact" className={`navbar-link ${isActive('/contact')}`} onClick={closeMenu}>Contact</Link></li>
          
          {!user && (
            <>
              <li className="mobile-only">
                <button className="navbar-link mobile-auth-btn" onClick={() => { openAuthModal('login'); closeMenu(); }}>
                  <LogIn size={18} />
                  Login
                </button>
              </li>
              <li className="mobile-only">
                <button className="navbar-link mobile-auth-btn" onClick={() => { openAuthModal('signup'); closeMenu(); }}>
                  Sign Up
                </button>
              </li>
            </>
          )}
          
          {user && (
            <li className="mobile-only">
              <button className="navbar-link mobile-auth-btn" onClick={() => { handleLogoClick(); closeMenu(); }}>
                My Profile
              </button>
            </li>
          )}
        </ul>

        <div className="navbar-actions">
          {!user && (
            <>
              <button className="btn-auth btn-login desktop-only" onClick={() => openAuthModal('login')}>
                <LogIn size={18} />
                Login
              </button>
              <button className="btn-auth btn-signup desktop-only" onClick={() => openAuthModal('signup')}>
                Sign Up
              </button>
            </>
          )}
          
          {user && (
            <button 
              className="btn-logo-only desktop-only"
              onClick={handleLogoClick}
              aria-label="Open Profile"
            >
              <img src="/images/logo.svg" alt="Profile" className="profile-logo" />
            </button>
          )}
        </div>

        <button className="navbar-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </nav>

    {/* Profile Dropdown */}
    <UserProfileDropdown 
      isOpen={showProfileDropdown} 
      onClose={() => setShowProfileDropdown(false)} 
    />
  </>
  );
};

export default Navbar;
