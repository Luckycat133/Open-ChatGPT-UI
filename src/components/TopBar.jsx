import React, { useState, useEffect, useRef } from 'react';
// Import icons from react-icons
import { FaHistory, FaLock, FaUnlock, FaChevronDown, FaCheck } from 'react-icons/fa';
// Import DEFAULT_MODEL from api.js
import api from '../api';

// Define model descriptions (Free Tier removed)
const modelDescriptions = {
  'deepseek/deepseek-chat-v3-0324:free': 'DeepSeek V3 Chat (0324 Snapshot) - General conversation model.',
  'deepseek/deepseek-r1:free': 'DeepSeek R1 - Specific details needed.',
  'deepseek/deepseek-chat:free': 'DeepSeek Chat (Latest) - General conversation model.',
  'deepseek/deepseek-r1-distill-llama-70b:free': 'DeepSeek R1 (Llama 70B Distill) - Distilled from Llama 70B.',
  'deepseek/deepseek-r1-distill-qwen-32b:free': 'DeepSeek R1 (Qwen 32B Distill) - Distilled from Qwen 32B.',
  'deepseek/deepseek-r1-distill-qwen-14b:free': 'DeepSeek R1 (Qwen 14B Distill) - Distilled from Qwen 14B.',
  // Add description for the default model if needed and different
  ...(api.DEFAULT_MODEL && !{
    'deepseek/deepseek-chat-v3-0324:free': true,
    'deepseek/deepseek-r1:free': true,
    'deepseek/deepseek-chat:free': true,
    'deepseek/deepseek-r1-distill-llama-70b:free': true,
    'deepseek/deepseek-r1-distill-qwen-32b:free': true,
    'deepseek/deepseek-r1-distill-qwen-14b:free': true
  }[api.DEFAULT_MODEL] ? { [api.DEFAULT_MODEL]: 'The default model configured via environment variables.' } : {}),
};

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

  // Define the list of available DeepSeek models
  const availableModels = [
    { id: 'deepseek/deepseek-chat-v3-0324:free', name: 'DeepSeek Chat V3 (0324)' },
    { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1' },
    { id: 'deepseek/deepseek-chat:free', name: 'DeepSeek Chat (Latest)' },
    { id: 'deepseek/deepseek-r1-distill-llama-70b:free', name: 'R1 Distill (Llama 70B)' },
    { id: 'deepseek/deepseek-r1-distill-qwen-32b:free', name: 'R1 Distill (Qwen 32B)' },
    { id: 'deepseek/deepseek-r1-distill-qwen-14b:free', name: 'R1 Distill (Qwen 14B)' },
    // Add the default model from api.js if it's different and not already included
    ...(api.DEFAULT_MODEL && ![
      'deepseek/deepseek-chat-v3-0324:free',
      'deepseek/deepseek-r1:free',
      'deepseek/deepseek-chat:free',
      'deepseek/deepseek-r1-distill-llama-70b:free',
      'deepseek/deepseek-r1-distill-qwen-32b:free',
      'deepseek/deepseek-r1-distill-qwen-14b:free'
    ].includes(api.DEFAULT_MODEL)
        ? [{ id: api.DEFAULT_MODEL, name: `${api.DEFAULT_MODEL.split('/').pop().split(':')[0]} (Default)` }] // Simplified default name
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
        <button className="icon-button sidebar-toggle-button" title="切换聊天记录" onClick={onToggleChatList}>
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
             <span>{selectedModelName || '选择模型'}</span>
             <FaChevronDown className={`dropdown-arrow ${isModelDropdownOpen ? 'open' : ''}`} />
           </button>
           {/* Apply 'open' class when isModelDropdownOpen is true */}
           <div className={`model-dropdown-menu ${isModelDropdownOpen ? 'open' : ''}`}>
              <ul>
              {availableModels.map(model => (
                  <li key={model.id}>
                    <button onClick={() => handleModelChange(model.id)}>
                       <div className="model-dropdown-item-content">
                           <div className="model-dropdown-name-check">
                              <span className="model-name">{model.name}</span>
                              {selectedModel === model.id && <FaCheck className="checkmark-icon" />}
                           </div>
                           <span className="model-description-text">
                               {modelDescriptions[model.id] || 'No description available.'}
                           </span>
                       </div>
                    </button>
                  </li>
                ))}
            </ul>
           </div>
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