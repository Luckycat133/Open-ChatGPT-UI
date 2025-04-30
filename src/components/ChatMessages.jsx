import React, { useRef, useEffect } from 'react';
// Import icons
import { FaExclamationTriangle, FaTrash, FaCopy, FaEdit, FaSyncAlt } from 'react-icons/fa';

// Placeholder for AI/User avatar images - replace with actual paths or imports later
const aiAvatarUrl = "https://via.placeholder.com/40/808080/FFFFFF?text=AI";
const userAvatarUrl = "https://via.placeholder.com/40/007BFF/FFFFFF?text=U";

function ChatMessages({ 
    messages, 
    isLoading, 
    onDeleteMessage, 
    onEditMessage,
    onRegenerateResponse,
    // Props for inline editing
    editingIndex,
    editText,
    onEditTextChange,
    onSaveEdit,
    onCancelEdit 
}) {
  const messagesEndRef = useRef(null);
  const editInputRef = useRef(null); // Ref for focusing edit input

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when editing starts
  useEffect(() => {
      if (editingIndex !== null && editInputRef.current) {
          editInputRef.current.focus();
          // Optionally, move cursor to end
          editInputRef.current.selectionStart = editInputRef.current.value.length;
          editInputRef.current.selectionEnd = editInputRef.current.value.length;
      }
  }, [editingIndex]);

  const handleCopy = (text) => {
      navigator.clipboard.writeText(text)
          .then(() => console.log('Message copied!')) // Log to console instead of alert
          .catch(err => {
              console.error('Could not copy message content: ', err);
              // Maybe provide a fallback or visual error cue here?
          });
  };

  // Handle keydown in edit input (Save on Enter, Cancel on Escape)
  const handleEditKeyDown = (event) => {
      if (event.key === 'Enter' && !event.shiftKey) { // Allow Shift+Enter for newlines
          event.preventDefault(); // Prevent default newline in textarea
          onSaveEdit();
      } else if (event.key === 'Escape') {
          onCancelEdit();
      }
  };

  return (
    <>
      {messages.map((msg, index) => (
        <div key={msg.timestamp + index}
             className={`message-container ${msg.role} ${msg.isError ? 'error-message-container' : ''} ${isLoading && index === messages.length - 1 ? 'last-message-loading' : ''}`}>
          {/* Check if current message is being edited */}
          {editingIndex === index ? (
            <div className="message-edit-container">
                <textarea
                    ref={editInputRef}
                    value={editText}
                    onChange={(e) => onEditTextChange(e.target.value)}
                    onKeyDown={handleEditKeyDown}
                    className="message-edit-input"
                    rows={3} // Start with a few rows, adjust as needed
                />
                <div className="message-edit-actions">
                    <button onClick={onSaveEdit} className="edit-save-button">Save</button>
                    <button onClick={onCancelEdit} className="edit-cancel-button">Cancel</button>
                </div>
            </div>
          ) : (
            <>
              <div className="message-content">
                  {/* Display model name for AI messages */} 
                 {msg.role === 'assistant' && msg.model && (
                     <div className="message-model-name">Model: {msg.model.split('/').pop().split(':')[0]}</div>
                 )}
                 <p>{msg.content}</p>
                 <span className="message-time">{msg.timestamp}</span>
                 {/* Replace emoji with icon */}
                 {msg.isError && <span className="error-indicator"><FaExclamationTriangle /></span>}
              </div>
              <div className="message-actions">
                  <button onClick={() => handleCopy(msg.content)} title="Copy">
                      <FaCopy />
                  </button>
                  {/* Edit button only for user messages */}
                  {msg.role === 'user' && (
                      <button onClick={() => onEditMessage(index, msg.content)} title="Edit">
                          <FaEdit />
                      </button>
                  )}
                  {/* Regenerate button only for AI messages */}
                  {msg.role === 'assistant' && !msg.isError && (
                      <button onClick={() => onRegenerateResponse(index)} title="Regenerate">
                          <FaSyncAlt />
                      </button>
                  )}
                  <button onClick={() => onDeleteMessage(index)} title="Delete">
                      <FaTrash />
                  </button>
              </div>
            </>
          )}
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