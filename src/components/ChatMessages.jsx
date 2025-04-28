import React, { useRef, useEffect } from 'react';
// Import error icon
import { FaExclamationTriangle } from 'react-icons/fa';

// Placeholder for AI/User avatar images - replace with actual paths or imports later
const aiAvatarUrl = "https://via.placeholder.com/40/808080/FFFFFF?text=AI";
const userAvatarUrl = "https://via.placeholder.com/40/007BFF/FFFFFF?text=U";

function ChatMessages({ messages, isLoading }) {
  const messagesEndRef = useRef(null); // Renamed for clarity

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <>
      {messages.map((msg, index) => (
        <div key={msg.timestamp + index} /* Use a more robust key if possible */
             className={`message-container ${msg.role} ${msg.isError ? 'error-message-container' : ''} ${isLoading && index === messages.length - 1 ? 'last-message-loading' : ''}`}>
          {/* <img
            src={msg.role === 'assistant' ? aiAvatarUrl : userAvatarUrl}
            alt={`${msg.role} Avatar`}
            className="avatar"
          /> */}
          <div className="message-content">
            {/* Basic paragraph rendering, can be enhanced with Markdown later */}
            <p>{msg.content}</p>
            <span className="message-time">{msg.timestamp}</span>
             {/* Replace emoji with icon */}
             {msg.isError && <span className="error-indicator"><FaExclamationTriangle /></span>}
          </div>
        </div>
      ))}
      {/* Loading indicator */}
      {isLoading && (
         <div className="message-container ai loading-indicator">
            {/* <img src={aiAvatarUrl} alt="AI Avatar" className="avatar" /> */}
            <div className="message-content">
                 {/* Basic "Thinking..." text, you could replace with a CSS spinner */}
                 <p className="thinking">...</p> 
            </div>
         </div>
      )}
      {/* Element to help scrolling to bottom */}
      <div ref={messagesEndRef} />
    </>
  );
}

export default ChatMessages; 