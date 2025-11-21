import React from 'react';
import '../styles/Header.css';

export const Header: React.FC = () => {
  return (
    <header className="app-header" role="banner">
      <div className="header-inner">
        <div className="left-block">
          <div className="brand">
            <div className="logo">
              <img
                src="images/yavuzsan_logo.png"
                alt="Yavuzsan"
                className="logo-image"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%231E3A8A%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2260%22 font-size=%2240%22 fill=%22white%22 text-anchor=%22middle%22%3EYV%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
            <div className="title">
              <h1>YAVUZSAN PARÇA KODU BULMA ARACI</h1>
              <p>İç Kullanım – IT Departmanı</p>
            </div>
          </div>
        </div>

        <div className="right-block" aria-hidden={false}>
          <div className="user-indicator">Logged in: <strong>IT Department</strong></div>

          <div className="utils">
            <button className="icon-btn" aria-label="Info" title="Info">ℹ️</button>
            <button className="icon-btn" aria-label="Settings" title="Settings">⚙️</button>
            <button className="icon-btn" aria-label="Theme" title="Toggle theme">🌓</button>

            <div className="status-badge" data-state="online" title="Backend status">Online</div>
          </div>
        </div>
      </div>
    </header>
  );
};
