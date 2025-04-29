import React, { useState, useEffect, useCallback } from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import TopBar from './TopBar'; // Assuming TopBar component will be created later
import ChatList from './ChatList'; // Import the ChatList component
import api from '../api'; // Assuming api.js will be created later

// Helper function to generate unique IDs (simple version)
const generateId = () => `chat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

// Key for local storage
const LOCAL_STORAGE_KEY = 'chatHistory';

function Chatbot() {
  const [allConversations, setAllConversations] = useState({}); // Store conversations as an object { [id]: { name: string, messages: [] } }
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [newMessage, setNewMessage] = useState(''); // State for the input field
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
  const [error, setError] = useState(null); // State for API errors
  // Add state for selected model (will be passed down from TopBar eventually)
  const [selectedModel, setSelectedModel] = useState(api.DEFAULT_MODEL);
  const [isChatListVisible, setIsChatListVisible] = useState(true); // State for sidebar visibility (Default to true for desktop)

  // --- Local Storage Effects ---
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (parsedData && typeof parsedData.conversations === 'object' && parsedData.activeId) {
          setAllConversations(parsedData.conversations);
          setActiveConversationId(parsedData.activeId);
          // Ensure the active ID actually exists, otherwise reset
          if (!parsedData.conversations[parsedData.activeId]) {
             console.warn("Active conversation ID not found in loaded data, resetting.");
             // Find the first available ID or create a new one
             const firstId = Object.keys(parsedData.conversations)[0];
             if (firstId) {
                 setActiveConversationId(firstId);
             } else {
                 // If no conversations exist, create an initial one with EMPTY messages
                 const newId = generateId();
                 const initialConversation = { name: 'New Chat', messages: [] }; // Start with empty messages
                 setAllConversations({ [newId]: initialConversation });
                 setActiveConversationId(newId);
             }
          }
          return; // Exit if data loaded successfully
        }
      }
    } catch (e) {
      console.error("Failed to load or parse chat history from localStorage", e);
    }

    // If no valid data loaded, create initial conversation with EMPTY messages
    console.log("No valid saved data found, creating initial conversation.");
    const newId = generateId();
    const initialConversation = { name: 'New Chat', messages: [] }; // Start with empty messages
    setAllConversations({ [newId]: initialConversation });
    setActiveConversationId(newId);

  }, []); // Run only on initial mount

  useEffect(() => {
    // Save to localStorage whenever conversations or active ID change
    if (Object.keys(allConversations).length > 0 && activeConversationId) {
       try {
         const dataToSave = JSON.stringify({
           conversations: allConversations,
           activeId: activeConversationId
         });
         localStorage.setItem(LOCAL_STORAGE_KEY, dataToSave);
       } catch (e) {
         console.error("Failed to save chat history to localStorage", e);
       }
    }
    // If all conversations are deleted, remove from storage
    else if (Object.keys(allConversations).length === 0) {
         localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [allConversations, activeConversationId]);

  // --- Message Handling ---
  const handleSendMessage = async () => {
    if (!activeConversationId) {
        console.error("Cannot send message, no active conversation.");
        setError("Error: No active conversation.");
        return;
    }

    const userMessageContent = newMessage.trim();
    if (!userMessageContent || isLoading) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const userMessage = { role: 'user', content: userMessageContent, timestamp: currentTime };

    // Add user message to the active conversation
    setAllConversations(prev => ({
      ...prev,
      [activeConversationId]: {
        ...prev[activeConversationId],
        messages: [...prev[activeConversationId].messages, userMessage]
      }
    }));

    setNewMessage('');
    setIsLoading(true);
    setError(null);

    // Prepare message history for API using only the active conversation
    const currentMessages = allConversations[activeConversationId]?.messages || [];
    // Include the user message we just added for the API call context
    const historyForAPI = [...currentMessages, userMessage].map(msg => ({ role: msg.role, content: msg.content }));

    try {
      // Pass the selected model to the API call
      const aiResponseContent = await api.sendMessage(historyForAPI, selectedModel);
      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      const aiMessage = { role: 'assistant', content: aiResponseContent, timestamp: aiTime };

      // Add AI response to the active conversation
      setAllConversations(prev => {
        // Check if the conversation still exists (might have been deleted)
        if (!prev[activeConversationId]) return prev;
        return {
          ...prev,
          [activeConversationId]: {
            ...prev[activeConversationId],
            messages: [...prev[activeConversationId].messages, aiMessage]
          }
        };
      });

    } catch (err) {
      console.error("API Error:", err);
      const errorMsg = err.message || 'Sorry, could not get a reply. Please try again later.';
      setError(errorMsg);
      const errorTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      const errorMessage = { role: 'assistant', content: errorMsg, timestamp: errorTime, isError: true };

       // Add error message to the active conversation
       setAllConversations(prev => {
         // Check if the conversation still exists
         if (!prev[activeConversationId]) return prev;
         return {
            ...prev,
            [activeConversationId]: {
              ...prev[activeConversationId],
              messages: [...prev[activeConversationId].messages, errorMessage]
            }
         };
       });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Conversation Management Handlers (to be passed down) ---
   const handleNewChat = useCallback(() => {
    const newId = generateId();
    const newConversation = {
      name: `Chat ${Object.keys(allConversations).length + 1}`,
      messages: [] // Start new chats with empty messages
    };
    setAllConversations(prev => ({ ...prev, [newId]: newConversation }));
    setActiveConversationId(newId);
    setError(null); 
    setIsLoading(false); 
    setIsChatListVisible(false); 
  }, [allConversations]); 

   const handleSelectChat = useCallback((id) => {
      if (allConversations[id]) {
          setActiveConversationId(id);
          setError(null); // Clear errors when switching chats
          setIsChatListVisible(false); // Close sidebar after selection
      } else {
          console.error("Attempted to select non-existent chat:", id);
      }
   }, [allConversations]);

   const handleRenameChat = useCallback((id, newName) => {
      if (allConversations[id]) {
          setAllConversations(prev => ({
              ...prev,
              [id]: { ...prev[id], name: newName }
          }));
      }
   }, [allConversations]);

    const handleDeleteChat = useCallback((idToDelete) => {
        if (!allConversations[idToDelete]) return;

        setAllConversations(prev => {
            const updatedConversations = { ...prev };
            delete updatedConversations[idToDelete];
            return updatedConversations;
        });

        // If the deleted chat was the active one, select another or create a new one
        if (activeConversationId === idToDelete) {
            const remainingIds = Object.keys(allConversations).filter(id => id !== idToDelete);
            if (remainingIds.length > 0) {
                // Find the next available ID based on sorted order (or just take the first)
                 const sortedRemainingIds = remainingIds.sort((a, b) => parseInt(b.split('_')[1]) - parseInt(a.split('_')[1]));
                 setActiveConversationId(sortedRemainingIds[0]);
            } else {
                 // No chats left, create a new initial one with EMPTY messages
                 const newId = generateId();
                 const initialConversation = { name: 'New Chat', messages: [] }; // Start with empty messages
                 setAllConversations({ [newId]: initialConversation });
                 setActiveConversationId(newId);
            }
        }
    }, [activeConversationId, allConversations]);

    // Function to update the selected model (passed to TopBar)
    const handleModelChange = useCallback((modelId) => {
        setSelectedModel(modelId);
        // Maybe add logic here later if model change should affect current chat?
    }, []);

    // --- Sidebar Visibility Handler ---
    const handleToggleChatList = useCallback(() => {
        setIsChatListVisible(prev => !prev);
    }, []);

    // --- Import Handler ---
    const handleImportChat = useCallback((importedData) => {
      if (!importedData || typeof importedData !== 'object' || !importedData.name || !Array.isArray(importedData.messages)) {
        console.error("Invalid imported chat data format.", importedData);
        setError("Import failed: Invalid file format.");
        return;
      }

      // Validate messages structure (basic check)
      const isValidMessages = importedData.messages.every(
          msg => typeof msg.role === 'string' && typeof msg.content === 'string' && typeof msg.timestamp === 'string'
      );
      if (!isValidMessages) {
          console.error("Invalid message structure in imported chat.", importedData.messages);
          setError("Import failed: Invalid message structure.");
          return;
      }

      try {
        const newId = generateId(); // Generate a new unique ID
        const newConversation = {
          name: importedData.name, // Use imported name
          messages: importedData.messages // Use imported messages
        };

        setAllConversations(prev => ({ ...prev, [newId]: newConversation }));
        setActiveConversationId(newId); // Activate the newly imported chat
        setIsChatListVisible(false); // Close sidebar
        setError(null); // Clear any previous errors
        alert(`Conversation "${importedData.name}" imported successfully!`);
      } catch (e) {
        console.error("Error importing chat:", e);
        setError("Error occurred while importing the conversation.");
      }
    }, []); // No dependencies needed as it uses the imported data directly

  // --- Render Logic ---
  const currentMessages = allConversations[activeConversationId]?.messages || [];
  const isActiveChatEmpty = currentMessages.length === 0;

  return (
    <div className="chat-container-wrapper">
        <ChatList
            conversations={allConversations}
            activeId={activeConversationId}
            className={isChatListVisible ? 'visible' : 'hidden'}
            onClose={() => setIsChatListVisible(false)}
            onSelectChat={handleSelectChat}
            onRenameChat={handleRenameChat}
            onDeleteChat={handleDeleteChat}
            onImportChat={handleImportChat}
        />
        <div className="chat-container">
            <TopBar
                onNewChat={handleNewChat}
                onToggleChatList={handleToggleChatList}
                selectedModel={selectedModel}
                onModelChange={handleModelChange}
            />
            <div className="chat-area">
                <div className="messages-wrapper">
                    {isActiveChatEmpty ? (
                        <div className="empty-chat-placeholder">
                            <h2>How can I help you today?</h2>
                        </div>
                    ) : (
                        <ChatMessages messages={currentMessages} isLoading={isLoading} />
                    )}
                </div>
            </div>
            <div className="input-area-wrapper">
                <ChatInput
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    isLoading={isLoading}
                    handleSendMessage={handleSendMessage}
                />
            </div>
            {error && <div className="error-message">{error}</div>}
        </div>
    </div>
  );
}

export default Chatbot;