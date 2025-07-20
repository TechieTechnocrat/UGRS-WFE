import { useState, useRef, useEffect } from "react";

export const useA11yAnnouncer = () => {
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("polite");
  const timeoutRef = useRef(null);
  const audioRef = useRef(null);

  // Get the base URL dynamically
  const getAudioUrl = () => {
    const base = document.querySelector('base')?.href || window.location.origin + window.location.pathname;
    return new URL('sound.mp3', base).href;
  };

  // Cleanup on unmount
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
    } = options;

    console.log("🔊 Announcing:", text, options);

    setMessage("");
    setPriority(mode);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setTimeout(() => {
      setMessage(text);

      if (playSound && audioRef.current) {
        console.log("🎵 Attempting to play sound...");
        audioRef.current.currentTime = 0;
        
        if (audioRef.current.readyState >= 2) {
          audioRef.current.play().catch((error) => {
            console.error("Audio play failed:", error);
          });
        } else {
          console.warn("Audio not ready, readyState:", audioRef.current.readyState);
        }
      }

      if (vibrate && navigator.vibrate) {
        navigator.vibrate(200);
      }
    }, 100);

    timeoutRef.current = setTimeout(() => {
      setMessage("");
    }, timeout);
  };

  const Announcer = () => {
    const audioUrl = getAudioUrl();
    console.log("🔗 Audio URL:", audioUrl);
    
    return (
      <>
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

        <audio
          ref={audioRef}
          src={audioUrl}
          preload="auto"
          style={{ display: "none" }}
          onLoadStart={() => console.log("🎵 Audio loading started")}
          onCanPlay={() => console.log("✅ Audio can play")}
          onError={(e) => console.error("❌ Audio error:", e)}
        />
      </>
    );
  };

  return { announce, Announcer };
};