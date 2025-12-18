import { useEffect, useState } from "react";

// This component shows a welcome message with a typing animation
export default function WelcomeText() {
  // The message that will be displayed
  const fullMessage = "Welcome to your private notebook";

  // State managing 
  const [visibleMessage, setVisibleMessage] = useState("");

  // useEffect runs after the component appears on the screen
  useEffect(() => {
    // Start at the first character
    let currentCharIndex = 0;

    // setInterval runs this function repeatedly every 60 milliseconds
    const typingInterval = setInterval(() => {
      // Add one more character from fullMessage to visibleMessage
      setVisibleMessage(fullMessage.slice(0, currentCharIndex + 1));

      // Move to the next character
      currentCharIndex++;

      // Stop the interval when the whole message is displayed
      if (currentCharIndex === fullMessage.length) {
        clearInterval(typingInterval);
      }
    }, 60);

    //The interval stops once the component is removed
    return () => clearInterval(typingInterval);
  }, []); // Empty array means this effect runs only once

  return (
    <div className="h-full flex items-center justify-center">
      {/* The container centers the text both vertically and horizontally */}
      <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-wide">
        {/* Show the typing text */}
        {visibleMessage}
        {/* Add a blinking cursor effect */}
        <span className="animate-pulse">|</span>
      </h1>
    </div>
  );
}
