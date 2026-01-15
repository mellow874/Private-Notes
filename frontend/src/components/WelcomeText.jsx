import { useEffect, useState } from "react";

// This component shows a welcome message with a typing animation
export default function WelcomeText({ onFinish }) {
  const fullMessage = "Welcome to your private notebook";
  const [visibleMessage, setVisibleMessage] = useState("");

  useEffect(() => {
    // Start at the first character
    let currentCharIndex = 0;

    const typingInterval = setInterval(() => {
      setVisibleMessage(fullMessage.slice(0, currentCharIndex + 1));
      currentCharIndex++;

      if (currentCharIndex === fullMessage.length) {
        clearInterval(typingInterval);

        // Small pause after typing finishes
        setTimeout(() => {
          onFinish?.(); // tell App.jsx we are done
        }, 800);
      }
    }, 60);

    return () => clearInterval(typingInterval);
  }, [onFinish]);

  return (
    <div className="flex items-center justify-center">
      <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-wide text-center">
        {visibleMessage}
        <span className="animate-pulse">|</span>
      </h1>
    </div>
  );
}
