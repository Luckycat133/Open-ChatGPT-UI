import React, { useRef, useEffect } from 'react';
// Import error icon
import { FaExclamationTriangle } from 'react-icons/fa';

// Placeholder for AI/User avatar images - replace with actual paths or imports later
const aiAvatarUrl = "https://via.placeholder.com/40/808080/FFFFFF?text=AI";
const userAvatarUrl = "https://via.placeholder.com/40/007BFF/FFFFFF?text=U";

function ChatMessages({ messages, isLoading }) {
  const chatAreaRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatAreaRef.current) {
      // Smooth scroll is generally preferred, but instant scroll ensures visibility
      // For smooth scroll: chatAreaRef.current.scrollTo({ top: chatAreaRef.current.scrollHeight, behavior: 'smooth' });
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]); // Dependency array includes messages

  return (
    <div className="chat-area" ref={chatAreaRef}>
      {messages.map((msg, index) => (
        <div key={index} className={`message-container ${msg.role} ${msg.isError ? 'error-message-container' : ''}`}>
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
      {/* Optionally show a loading indicator at the end */}
      {isLoading && (
         <div className="message-container ai loading-indicator">
            {/* <img src={aiAvatarUrl} alt="AI Avatar" className="avatar" /> */}
            <div className="message-content">
                 {/* Basic "Thinking..." text, you could replace with a CSS spinner */}
                 <p className="thinking">...</p> 
            </div>
         </div>
      )}
    </div>
  );
}

export default ChatMessages; 