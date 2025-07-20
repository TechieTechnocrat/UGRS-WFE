import { useState, useRef } from "react";
import soundMp3 from "../../public/sound.mp3"

export const useA11yAnnouncer = () => {
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("polite");
  const timeoutRef = useRef(null);
  const audioRef = useRef(null); // for sound fallback

  const announce = (text, options = {}) => {
    const {
      mode = "polite",
      timeout = 3000,
      vibrate = true,
      playSound = true,
    } = options;

    setMessage("");
    setPriority(mode);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Delay to force screen reader to re-read message
    setTimeout(() => {
      setMessage(text);

      // 🔊 Play sound cue
      if (playSound && audioRef.current) {
        audioRef.current.play().catch(() => {}); // ignore autoplay errors
      }

      // 📳 Vibrate if supported
      if (vibrate && navigator.vibrate) {
        navigator.vibrate(200); // 200ms pulse
      }
    }, 100);

    timeoutRef.current = setTimeout(() => {
      setMessage("");
    }, timeout);
  };

  const Announcer = () => (
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

      {/* 🔊 Hidden audio element for sound fallback */}
      <audio
        ref={audioRef}
        src={soundMp3}// ✅ put your sound file in public/ folder
        preload="auto"
      />
    </>
  );

  return { announce, Announcer };
};
