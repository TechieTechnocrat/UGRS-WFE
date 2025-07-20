import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useA11yAnnouncer } from './hooks/useA11yAnnouncer';

function App() {
  const { announce, Announcer } = useA11yAnnouncer();

  const handleSuccess = () => {
    announce("Profile updated successfully", {
      mode: "polite",
      vibrate: true,
      playSound: true,
    });
  };

  const handleError = () => {
    announce("Error! Something went wrong.", {
      mode: "assertive",
      vibrate: true,
      playSound: true,
    });
  };

  const handleInfo = () => {
    announce("Loading complete. 5 new notifications available.", {
      mode: "polite",
      vibrate: false,
      playSound: true,
      timeout: 4000,
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <Announcer />
      <h1>Accessibility Announcer Demo</h1>
      <div style={{ display: "flex", gap: "10px", flexDirection: "column", width: "200px" }}>
        <button onClick={handleSuccess}>✅ Update Profile</button>
        <button onClick={handleError}>❌ Simulate Error</button>
        <button onClick={handleInfo}>ℹ️ Show Info</button>
      </div>
      
      <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
        <p>This demo works best with screen readers enabled.</p>
        <p>Each button will announce different messages with sound and vibration.</p>
      </div>
    </div>
  );
}

export default App