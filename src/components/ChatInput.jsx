import React, { useRef } from 'react';
// Import icons
import { FaUpload, FaSearch, FaLightbulb, FaMicrophone, FaPaperPlane } from 'react-icons/fa';

function ChatInput({ newMessage, setNewMessage, isLoading, handleSendMessage }) {
  const fileInputRef = useRef(null); // Create a ref for the file input

  // Handle Enter key press (optional: Shift+Enter for newline)
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) { // Allow sending even if loading, API call logic prevents double send
      event.preventDefault(); // Prevent default newline behavior
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

  const canSend = newMessage.trim().length > 0 && !isLoading;

  return (
    <div className="input-area">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        // Allow images, videos, audio, pdf, text, csv, doc(x), xls(x), ppt(x)
        accept="image/*,video/*,audio/*,.pdf,.txt,.csv,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
      />
      <div className="input-left-buttons">
        {/* Replace pseudo-elements with icons */}
        <button className="action-button" title="Upload File" disabled={isLoading} onClick={handleUploadClick}>
            <FaUpload />
        </button>
        <button className="action-button" title="Search (Not Implemented)" disabled={isLoading}>
            <FaSearch />
        </button>
      </div>
      {/* Using textarea for potential multi-line input */}
      <textarea
        rows="1" // Start with one row
        className="chat-input"
        placeholder="Ask anything..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleKeyDown} // Handle Enter key press
        disabled={isLoading} // Disable input while loading
        style={{ resize: 'none', maxHeight: '100px', overflowY: 'auto' }} // Basic auto-resize styling
        onInput={(e) => { // Simple auto-grow based on scroll height
             e.target.style.height = 'auto';
             e.target.style.height = (e.target.scrollHeight) + 'px';
        }}
      />
      <div className="input-right-buttons">
        {/* Replace pseudo-elements with icons */}
        <button className="action-button" title="Voice Input (Not Implemented)" disabled={isLoading}>
             <FaMicrophone />
        </button>
        <button
          className={`action-button send-button ${!canSend ? 'disabled' : ''}`} // Add disabled class for styling
          title="Send"
          onClick={handleSendMessage} // Trigger send on click
          disabled={!canSend} // Disable if loading or input is empty/whitespace only
        >
            <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}

export default ChatInput; 