import { useEffect } from 'react';
import { HomePage } from './pages/HomePage';
import './styles/global.css';
import { pingBackend } from './services/api';

function App() {

  useEffect(() => {
    // Ping the backend to ensure it's running
    pingBackend();

    // Every 1 minute, ping the backend to keep it awake
    const interval = setInterval(() => {
      pingBackend();
    }, 60000);

    return () => clearInterval(interval);
  })

  return (
    <div className="app">
      <HomePage />
    </div>
  );
}

export default App;
