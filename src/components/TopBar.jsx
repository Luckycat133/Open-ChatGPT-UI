import React, { useState, useEffect, useRef } from 'react';
// Import icons from react-icons
import { FaHistory, FaLock, FaUnlock, FaChevronDown, FaCheck } from 'react-icons/fa';
// Import DEFAULT_MODEL from api.js
import api from '../api';

// Receive props from Chatbot
function TopBar({ onNewChat, selectedModel, onModelChange, onToggleChatList }) {
  // Local state for dropdown visibility and privacy toggle
  // selectedModel state is now managed by the parent (Chatbot)
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref for the dropdown container

  const handleModelChange = (modelId) => {
    // Call the handler passed from the parent
    onModelChange(modelId);
    setIsModelDropdownOpen(false); // Close dropdown after selection
  };

  // Define a more realistic list of available models
  // Ideally, this list might also come from api.js or be fetched dynamically
  const availableModels = [
    { id: 'openai/gpt-4o', name: 'GPT-4o (OpenAI)' },
    { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo (OpenAI)' },
    { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo (OpenAI)' },
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet (Anthropic)' },
    { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus (Anthropic)' },
    { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku (Anthropic)' },
    { id: 'google/gemini-pro-1.5', name: 'Gemini Pro 1.5 (Google)' },
    { id: 'google/gemini-flash-1.5', name: 'Gemini Flash 1.5 (Google)' },
     // Add the default model if it's not already in the list, using its ID as name if needed
     ...(api.DEFAULT_MODEL && !['openai/gpt-4o', 'openai/gpt-4-turbo', 'openai/gpt-3.5-turbo', 'anthropic/claude-3.5-sonnet', 'anthropic/claude-3-opus', 'anthropic/claude-3-haiku', 'google/gemini-pro-1.5', 'google/gemini-flash-1.5'].includes(api.DEFAULT_MODEL)
         ? [{ id: api.DEFAULT_MODEL, name: `${api.DEFAULT_MODEL} (Default)` }]
         : [])
  ].filter((model, index, self) => // Ensure unique models by ID
      index === self.findIndex((m) => m.id === model.id)
  );

  // --- Click Outside Handler --- 
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsModelDropdownOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]); // Re-run if dropdownRef changes (shouldn't typically)

  // Find the name of the selected model
  const selectedModelName = availableModels.find(m => m.id === selectedModel)?.name || selectedModel || 'Select Model'; // Fallback to ID if name not found

  return (
    <div className="top-bar">
      {/* Left section - only sidebar toggle */}
      <div className="top-left">
        <button className="icon-button sidebar-toggle-button" title="切换对话历史" onClick={onToggleChatList}>
            <FaHistory />
        </button>
      </div>

      {/* Center section - Model Selector */}
      <div className="top-center">
        <div className="model-select-container" ref={dropdownRef}>
           <button
             className="dropdown-button-custom"
             onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
           >
             <span>{selectedModelName}</span>
             <FaChevronDown className={`dropdown-arrow ${isModelDropdownOpen ? 'open' : ''}`} />
           </button>
           {isModelDropdownOpen && (
             <div className="model-dropdown-menu">
                <ul>
                {availableModels.map(model => (
                  <li key={model.id}>
                    <button onClick={() => handleModelChange(model.id)}>
                       {model.name}
                       {selectedModel === model.id && <FaCheck className="checkmark-icon" />} 
                    </button>
                  </li>
                ))}
              </ul>
             </div>
           )}
         </div>
      </div>

      {/* Right section - kept empty for now, can add user menu etc. later */}
      <div className="top-right">
          {/* Example: Placeholder for potential User menu or other icons */}
          {/* <button className="icon-button" title="User Menu">
               <FaUser /> 
          </button> */}
      </div>
    </div>
  );
}

export default TopBar; 