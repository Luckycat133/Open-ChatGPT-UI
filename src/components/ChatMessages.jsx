import React, { useRef, useEffect } from 'react';
// Import icons
import { FaExclamationTriangle, FaTrash, FaCopy, FaEdit, FaSyncAlt } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown
import remarkGfm from 'remark-gfm'; // Import remark-gfm for GitHub Flavored Markdown

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
          .then(() => console.log('消息已复制!')) // Message copied!
          .catch(err => { console.error('无法复制消息内容: ', err); }); // Could not copy message content
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
        <div key={msg.timestamp + index + msg.role}
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
                    {/* Apply unified button classes */}
                    <button onClick={onSaveEdit} className="button-base button-primary edit-save-button">保存</button>
                    <button onClick={onCancelEdit} className="button-base button-secondary edit-cancel-button">取消</button>
                </div>
            </div>
          ) : (
            <>
              <div className="message-content">
                 {/* Corrected model display logic */}
                 {msg.role === 'assistant' && msg.model && (
                     <div className="message-model-name">模型: {msg.model.split('/').pop().split(':')[0]}</div>
                 )}
                 {/* Use ReactMarkdown to render content */}
                 <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                 </ReactMarkdown>
                 <span className="message-time">{msg.timestamp}</span>
                 {/* Replace emoji with icon */}
                 {msg.isError && <span className="error-indicator"><FaExclamationTriangle /></span>}
              </div>
              {/* Message actions moved outside message-content for flexbox layout */}
              <div className="message-actions">
                  {/* Ensure onClick handlers are correct */}
                  <button onClick={() => handleCopy(msg.content)} title="复制"> {/* Copy */} 
                      <FaCopy />
                  </button>
                  {msg.role === 'user' && (
                      <button onClick={() => onEditMessage(index, msg.content)} title="编辑"> {/* Edit */} 
                          <FaEdit />
                      </button>
                  )}
                  {msg.role === 'assistant' && !msg.isError && (
                      <button onClick={() => onRegenerateResponse(index)} title="重新生成"> {/* Regenerate */} 
                          <FaSyncAlt />
                      </button>
                  )}
                  <button onClick={() => onDeleteMessage(index)} title="删除"> {/* Delete */} 
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
            <div className="message-content"> <p className="thinking">思考中...</p> </div> {/* Thinking... */} 
         </div>
      )}
      {/* Element to help scrolling to bottom */}
      <div ref={messagesEndRef} />
    </>
  );
}

export default ChatMessages; 