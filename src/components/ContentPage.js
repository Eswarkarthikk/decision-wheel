import React from 'react';
import './ContentPage.css';

const ContentPage = ({ title, content, onBack }) => {
  return (
    <div className="content-page-container">
      <button onClick={onBack} className="back-arrow">
        ←
      </button>
      <h1 className="content-page-title">{title}</h1>
      <div className="content-page-content">{content}</div>
    </div>
  );
};

export default ContentPage; 