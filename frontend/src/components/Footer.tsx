import React from 'react';
import '../styles/Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <span>© 2025 YAVUZSAN • Internal Tool</span>
      <span className="divider">•</span>
      <a href="mailto:bilisim@yavuzsan.com" className="contact-link">
        bilisim@yavuzsan.com
      </a>
    </footer>
  );
};
