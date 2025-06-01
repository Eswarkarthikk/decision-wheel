import React from 'react';

const Footer = ({ onNavigate }) => {
  const styles = {
    footer: {
      width: '100%',
      padding: '15px 0',
      background: 'rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
    },
    links: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      flexWrap: 'wrap',
      maxWidth: '400px',
      margin: '0 auto',
      padding: '0 10px',
    },
    link: {
      color: 'rgba(255, 255, 255, 0.8)',
      textDecoration: 'none',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'color 0.3s ease',
      '&:hover': {
        color: '#fff',
      },
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.links}>
        <span 
          style={styles.link} 
          onClick={() => onNavigate('privacy')}
        >
          Privacy Policy
        </span>
        <span 
          style={styles.link} 
          onClick={() => onNavigate('terms')}
        >
          Terms & Conditions
        </span>
        <span 
          style={styles.link} 
          onClick={() => onNavigate('contact')}
        >
          Contact Us
        </span>
      </div>
    </footer>
  );
};

export default Footer; 