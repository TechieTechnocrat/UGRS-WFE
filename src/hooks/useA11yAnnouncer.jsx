import { useState, useRef, useEffect } from "react";

export const useA11yAnnouncer = () => {
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("polite");
  const timeoutRef = useRef(null);
  const audioContextRef = useRef(null);

  const createBeep = (frequency = 800, duration = 200, volume = 0.1) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration / 1000);

      console.log("🔊 Beep played:", frequency + "Hz");
    } catch (error) {
      console.log("🔇 Audio beep failed:", error.message);
    }
  };

  // Add speech synthesis for testing (not for production)
  const speakMessage = (text, isError = false) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.2;
      utterance.pitch = isError ? 0.8 : 1;
      utterance.volume = 0.7;
      
      console.log("🗣️ Speaking:", text);
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const announce = (text, options = {}) => {
    const {
      mode = "polite",
      timeout = 3000,
      vibrate = true,
      playSound = true,
      enableSpeech = false, // Set to true for testing
    } = options;

    console.log("🔊 Announcing:", text);

    setMessage("");
    setPriority(mode);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setTimeout(() => {
      setMessage(text);

      // Play different sounds for different modes
      if (playSound) {
        if (mode === "assertive") {
          createBeep(400, 300, 0.15);
        } else {
          createBeep(800, 150, 0.1);
        }
      }

      // Speech for testing (remove in production)
      if (enableSpeech) {
        speakMessage(text, mode === "assertive");
      }

      // Vibration feedback
      if (vibrate && navigator.vibrate) {
        if (mode === "assertive") {
          navigator.vibrate([100, 50, 100]);
        } else {
          navigator.vibrate(200);
        }
        console.log("📳 Vibrated");
      }

      console.log("📢 Screen reader should announce:", text);
    }, 100);

    timeoutRef.current = setTimeout(() => {
      setMessage("");
    }, timeout);
  };

  const Announcer = () => (
    <>
      {/* Debug panel */}
      <div style={{ 
        position: "fixed", 
        top: "10px", 
        right: "10px", 
        background: "rgba(0,0,0,0.7)", 
        color: "white", 
        padding: "8px", 
        fontSize: "11px",
        borderRadius: "4px",
        zIndex: 9999,
        fontFamily: "monospace",
        maxWidth: "200px"
      }}>
        <div><strong>A11y Debug</strong></div>
        <div>Message: "{message}"</div>
        <div>Priority: {priority}</div>
        <div>Audio: {audioContextRef.current?.state || 'not-initialized'}</div>
        <div>Speech: {('speechSynthesis' in window) ? 'available' : 'unavailable'}</div>
      </div>

      {/* Screen reader announcement area */}
      <div
        role="status"
        aria-live={priority}
        aria-atomic="true"
        style={{
          position: "absolute",
          left: "-9999px",
          whiteSpace: "nowrap",
        }}
      >
        {message}
      </div>
    </>
  );

  return { announce, Announcer };
};