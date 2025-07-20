import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useA11yAnnouncer } from './hooks/useA11yAnnouncerCustomized.jsX';

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

  return (
    <div>
      <Announcer />
      <button onClick={handleSuccess}>Update Profile</button>
      <button onClick={handleError}>Simulate Error</button>
    </div>
  );
}


export default App
