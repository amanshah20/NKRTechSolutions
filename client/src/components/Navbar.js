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
              <li className="mobile-only"><Link to="/request-demo" className="navbar-link" onClick={closeMenu}>Request Demo</Link></li>
              <li className="mobile-only"><Link to="/place-order" className="navbar-link" onClick={closeMenu}>Place Order</Link></li>
              <li className="mobile-only">
                <button className="navbar-link mobile-auth-btn" onClick={() => { openAuthModal(); closeMenu(); }}>
                  <LogIn size={18} />
                  Sign In
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
              <Link to="/request-demo" className="btn btn-secondary desktop-only" onClick={closeMenu}>Request Demo</Link>
              <Link to="/place-order" className="btn btn-primary desktop-only" onClick={closeMenu}>Place Order</Link>
              <button className="btn btn-outline desktop-only" onClick={openAuthModal}>
                <LogIn size={18} />
                Sign In
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
