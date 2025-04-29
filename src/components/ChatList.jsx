import React, { useState, useRef, useEffect } from 'react';
import { FaEdit, FaTrash, FaDownload, FaShareAlt, FaSave, FaTimes, FaUpload } from 'react-icons/fa';

// Helper function to format messages for export/sharing
const formatMessagesForExport = (messages) => {
  return messages.map(msg => `${msg.role === 'user' ? 'User' : 'AI'} (${msg.timestamp}): ${msg.content}`).join('\n');
};

function ChatList({
  conversations, // Object: { id: { name, messages } }
  activeId,
  className,
  onClose, // Function to close the sidebar
  onSelectChat,
  onRenameChat,
  onDeleteChat,
  onImportChat, // Receive the import handler
  // TODO: Implement actual export/share logic if needed beyond basic copy/download
  // onExportChat,
  // onShareChat,
}) {
  const [editingId, setEditingId] = useState(null); // ID of the chat being edited
  const [editText, setEditText] = useState(''); // Current text in the rename input
  const listRef = useRef(null);
  const fileInputRef = useRef(null); // Ref for hidden file input

  // Close sidebar if clicking outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (listRef.current && !listRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, listRef]);

  const handleStartEdit = (id, currentName) => {
    setEditingId(id);
    setEditText(currentName);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleSaveEdit = (id) => {
    if (editText.trim() && id) {
      onRenameChat(id, editText.trim());
    }
    handleCancelEdit();
  };

  const handleKeyDown = (event, id) => {
    if (event.key === 'Enter') {
      handleSaveEdit(id);
    } else if (event.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleExport = (id) => {
    const conversation = conversations[id];
    if (!conversation) return;
    const { name, messages } = conversation;
    const dataStr = JSON.stringify({ name, messages }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${name.replace(/\s+/g, '_')}_${id}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    linkElement.remove();
    console.log(`Exporting chat: ${name} (${id})`);
  };

  const handleShare = (id) => {
    const conversation = conversations[id];
    if (!conversation) return;
     const textToCopy = formatMessagesForExport(conversation.messages);
     navigator.clipboard.writeText(`Conversation: ${conversation.name}\n\n${textToCopy}`)
       .then(() => {
         alert('Conversation content copied to clipboard!'); // Simple feedback
         console.log(`Sharing chat content: ${conversation.name} (${id})`);
       })
       .catch(err => {
         console.error('无法复制对话内容: ', err);
         alert('Could not copy conversation content.');
       });
  };

  // --- Import Logic ---
  const handleImportClick = () => {
    fileInputRef.current?.click(); // Trigger hidden file input
  };

  const handleFileSelected = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result);
        onImportChat(json); // Pass parsed data to the handler from parent
      } catch (error) {
        console.error("Error reading or parsing imported file:", error);
        alert("Import failed: Could not read or parse the file.");
      } finally {
         // Reset file input value so the same file can be selected again if needed
         if(fileInputRef.current) {
             fileInputRef.current.value = '';
         }
      }
    };
    reader.onerror = (error) => {
       console.error("Error reading file:", error);
       alert("Import failed: Error reading the file.");
        if(fileInputRef.current) {
             fileInputRef.current.value = '';
         }
    };
    reader.readAsText(file);
  };

  // Convert conversations object to array and sort (e.g., by creation time implicitly from ID)
   const sortedConversations = Object.entries(conversations)
     .map(([id, data]) => ({ id, ...data }))
     // Basic sort: newer chats (higher timestamp in ID) first
     .sort((a, b) => parseInt(b.id.split('_')[1]) - parseInt(a.id.split('_')[1]));

  return (
    <div className={`chat-list-sidebar ${className || ''}`} ref={listRef}>
      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".json"
        onChange={handleFileSelected}
      />
      <div className="chat-list-header">
        <h3>Chat History</h3>
        {/* Add New Chat Button */}
        <button onClick={onNewChat} className="new-chat-button" title="New Chat">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
        {/* Add Import Button */}
        <button onClick={handleImportClick} className="import-button" title="Import Chat (.json)">
          <FaUpload />
        </button>
        <button onClick={onClose} className="close-sidebar-button" title="Close Sidebar">
          <FaTimes />
        </button>
      </div>
      <ul className="chat-list-ul">
        {sortedConversations.length === 0 ? (
          <li className="chat-list-empty">No chat history</li>
        ) : (
          sortedConversations.map(({ id, name }) => (
            <li
              key={id}
              className={`chat-list-item ${id === activeId ? 'active' : ''} ${editingId === id ? 'editing' : ''}`}
            >
              {editingId === id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, id)}
                    autoFocus // Focus the input when editing starts
                    className="rename-input"
                  />
                  <button onClick={() => handleSaveEdit(id)} className="chat-item-button save" title="Save">
                    <FaSave />
                  </button>
                  <button onClick={handleCancelEdit} className="chat-item-button cancel" title="Cancel">
                    <FaTimes />
                  </button>
                </>
              ) : (
                <>
                  <span className="chat-name" onClick={() => onSelectChat(id)}>
                    {name}
                  </span>
                  <div className="chat-item-actions">
                    <button onClick={() => handleStartEdit(id, name)} className="chat-item-button edit" title="Rename">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleExport(id)} className="chat-item-button export" title="Export (JSON)">
                      <FaDownload />
                    </button>
                    <button onClick={() => handleShare(id)} className="chat-item-button share" title="Share (Copy Content)">
                      <FaShareAlt />
                    </button>
                     <button onClick={() => onDeleteChat(id)} className="chat-item-button delete" title="Delete">
                      <FaTrash />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default ChatList;