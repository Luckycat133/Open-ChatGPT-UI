import React, { useRef, useEffect } from 'react';
// Import icons
import { FaUpload, FaSearch, FaMicrophone, FaPaperPlane } from 'react-icons/fa';

function ChatInput({ newMessage, setNewMessage, isLoading, handleSendMessage }) {
  const fileInputRef = useRef(null); // Create a ref for the file input
  const textareaRef = useRef(null); // Ref for the textarea

  // Auto-resize textarea height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set to content height
    }
  }, [newMessage]);

  // Handle Enter key press (optional: Shift+Enter for newline)
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !isLoading) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click(); // Trigger click on hidden file input
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      console.log('Selected file:', file.name, 'Type:', file.type);
      // TODO: Handle file based on type (e.g., display image preview, read text content)
      event.target.value = null; // Reset input
    } else {
      console.log('No file selected');
    }
  };

  const handleInput = (e) => {
    // Auto-grow textarea
    const textarea = e.target;
    textarea.style.height = 'auto'; // Reset height
    // Set height based on scroll height, but limit to max-height from CSS
    const maxHeight = parseInt(window.getComputedStyle(textarea).maxHeight, 10);
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = newHeight + 'px';
  };

  const canSend = newMessage.trim().length > 0 && !isLoading;

  return (
    <>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        // Allow images, videos, audio, pdf, text, csv, doc(x), xls(x), ppt(x)
        accept="image/*,video/*,audio/*,.pdf,.txt,.csv,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
      />
      <div className="input-area">
        <div className="input-left-buttons">
          {/* Replace pseudo-elements with icons */}
          <button className="action-button" title="Upload File" disabled={isLoading} onClick={handleUploadClick}>
              <FaUpload />
          </button>
          {/* <button className="action-button" title="Search (Not Implemented)" disabled={isLoading}>
              <FaSearch />
          </button> */}
        </div>
        {/* Using textarea for potential multi-line input */}
        <textarea
          ref={textareaRef}
          rows="1" // Start with one row
          className="chat-input"
          placeholder="输入消息..." /* Ask anything... */
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown} // Handle Enter key press
          disabled={isLoading} // Disable input while loading
          onInput={handleInput} // Use onInput for auto-grow
          style={{ overflowY: 'auto' }} // Ensure scroll appears if max-height reached
        />
        <div className="input-right-buttons">
          {/* <button className="action-button" title="Voice Input (Not Implemented)" disabled={isLoading}>
               <FaMicrophone />
          </button> */}
          <button
            className={`action-button send-button ${!canSend ? 'disabled' : ''}`} // Add disabled class for styling
            title="发送" /* Send */
            onClick={handleSendMessage} // Trigger send on click
            disabled={!canSend} // Disable if loading or input is empty/whitespace only
          >
              <FaPaperPlane />
          </button>
        </div>
      </div>
    </>
  );
}

export default ChatInput; 