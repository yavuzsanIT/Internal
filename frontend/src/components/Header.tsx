import React from 'react';
import '../styles/Header.css';

export const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="logo">
          <img 
            src="/images/yavuzsan_logo.png" 
            alt="YAVUZSAN Logo" 
            className="logo-image"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%232563eb%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2260%22 font-size=%2240%22 fill=%22white%22 text-anchor=%22middle%22%3EYV%3C/text%3E%3C/svg%3E';
            }}
          />
        </div>
        <div className="title">
          <h1>YAVUZSAN KODU BULMA PLATFORMU</h1>
          <p>YAVUZSAN IT Departmanı</p>
        </div>
      </div>
    </header>
  );
};
