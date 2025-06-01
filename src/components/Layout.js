import React from 'react';
import Footer from './Footer';
import './Layout.css';

const Layout = ({ children, isNarrow = false, onNavigate }) => {
  return (
    <div className="app-body">
      <div className="main-container">
        <img 
          src="/logo.png" 
          alt="Choice Wheel Logo" 
          className="logo"
        />
        <div className={`content-container ${isNarrow ? 'narrow' : ''}`}>
          {children}
        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default Layout; 