import React from 'react';
import { FaTimes, FaCheck } from 'react-icons/fa';

// Simple modal component for model selection during regeneration
function RegenerateModal({
  isOpen,
  onClose,
  availableModels, // Pass the list of models
  onModelSelect, // Callback when a model is chosen
  currentSelectedModel // To highlight the current top-bar selection
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h4>选择模型以重新生成</h4>
          <button onClick={onClose} className="modal-close-button">
            <FaTimes />
          </button>
        </div>
        <div className="modal-body">
          <ul className="modal-model-list">
            {availableModels.map(model => (
              <li key={model.id}>
                <button onClick={() => onModelSelect(model.id)}>
                  {model.name}
                  {/* Optionally highlight the model currently selected in the main TopBar */}
                  {model.id === currentSelectedModel && <FaCheck className="checkmark-icon modal-checkmark" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default RegenerateModal; 