import React, { useState, useEffect, useCallback } from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import TopBar from './TopBar'; // Assuming TopBar component will be created later
import ChatList from './ChatList'; // Import the ChatList component
import api from '../api'; // Assuming api.js will be created later
import RegenerateModal from './RegenerateModal'; // Re-add import

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

  // Re-add State for editing messages
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');

  // Re-add State for Regenerate Modal
  const [isRegenModalOpen, setIsRegenModalOpen] = useState(false);
  const [regenTargetIndex, setRegenTargetIndex] = useState(null);

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
                 const initialConversation = { name: '新聊天', messages: [] }; // "New Chat"
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
    const initialConversation = { name: '新聊天', messages: [] }; // "New Chat"
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

    // Add user message and prepare history for API
    const updatedMessagesWithUser = [...(allConversations[activeConversationId]?.messages || []), userMessage];
    setAllConversations(prev => ({
        ...prev,
        [activeConversationId]: { ...prev[activeConversationId], messages: updatedMessagesWithUser }
    }));
    const historyForAPI = updatedMessagesWithUser.map(msg => ({ role: msg.role, content: msg.content }));

    setNewMessage('');
    setIsLoading(true);
    setError(null);

    // Add empty AI message placeholder for streaming
    const placeholderTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const aiPlaceholderMessage = { 
        role: 'assistant', 
        content: '', // Start empty
        timestamp: placeholderTimestamp, 
        model: selectedModel, 
        isStreaming: true // Add a flag for potential UI indication
    };
    setAllConversations(prev => {
        if (!prev[activeConversationId]) return prev; // Check if convo exists
        return {
            ...prev,
            [activeConversationId]: { 
                ...prev[activeConversationId], 
                messages: [...prev[activeConversationId].messages, aiPlaceholderMessage] 
            }
        };
    });

    // Call API with stream handlers
    try {
        await api.sendMessage(
            historyForAPI, 
            selectedModel,
            // onChunk callback
            (chunk) => {
                setAllConversations(prev => {
                    if (!prev[activeConversationId]) return prev;
                    const currentMessages = prev[activeConversationId].messages;
                    const lastMessageIndex = currentMessages.length - 1;
                    if (lastMessageIndex < 0 || currentMessages[lastMessageIndex].role !== 'assistant') {
                        return prev; // Should not happen if placeholder was added correctly
                    }
                    const updatedLastMessage = {
                        ...currentMessages[lastMessageIndex],
                        content: currentMessages[lastMessageIndex].content + chunk
                    };
                    const updatedMessages = [...currentMessages.slice(0, lastMessageIndex), updatedLastMessage];
                    return {
                        ...prev,
                        [activeConversationId]: { ...prev[activeConversationId], messages: updatedMessages }
                    };
                });
            },
            // onDone callback
            () => {
                setIsLoading(false);
                 // Remove streaming flag from the final message
                 setAllConversations(prev => {
                     if (!prev[activeConversationId]) return prev;
                     const currentMessages = prev[activeConversationId].messages;
                     const lastMessageIndex = currentMessages.length - 1;
                     if (lastMessageIndex >= 0 && currentMessages[lastMessageIndex].isStreaming) {
                         const finalMessage = { ...currentMessages[lastMessageIndex], isStreaming: false };
                         const updatedMessages = [...currentMessages.slice(0, lastMessageIndex), finalMessage];
                         return { ...prev, [activeConversationId]: { ...prev[activeConversationId], messages: updatedMessages } };
                     }
                     return prev; // No change if last message wasn't streaming
                 });
            },
            // onError callback
            (streamError) => {
                console.error("Streaming API Error:", streamError);
                setError(streamError.message || 'Streaming failed.');
                setIsLoading(false);
                // Optionally update the placeholder message to show the error?
                 setAllConversations(prev => {
                     if (!prev[activeConversationId]) return prev;
                     const currentMessages = prev[activeConversationId].messages;
                     const lastMessageIndex = currentMessages.length - 1;
                     if (lastMessageIndex >= 0 && currentMessages[lastMessageIndex].isStreaming) {
                         const errorMessage = { 
                             ...currentMessages[lastMessageIndex], 
                             content: `Error: ${streamError.message || 'Streaming failed.'}`, 
                             isError: true, 
                             isStreaming: false 
                         };
                         const updatedMessages = [...currentMessages.slice(0, lastMessageIndex), errorMessage];
                         return { ...prev, [activeConversationId]: { ...prev[activeConversationId], messages: updatedMessages } };
                     }
                     return prev;
                 });
            }
        );
    } catch (error) {
        // This catch block might only catch initial setup errors from sendMessage now
        console.error("Error setting up stream:", error);
        setError(error.message || 'Failed to initiate response.');
        setIsLoading(false);
         // Remove the placeholder if setup failed
         setAllConversations(prev => {
             if (!prev[activeConversationId]) return prev;
             const currentMessages = prev[activeConversationId].messages;
             const lastMessageIndex = currentMessages.length - 1;
             if (lastMessageIndex >= 0 && currentMessages[lastMessageIndex].isStreaming) {
                 const updatedMessages = currentMessages.slice(0, lastMessageIndex);
                 return { ...prev, [activeConversationId]: { ...prev[activeConversationId], messages: updatedMessages } };
             }
             return prev;
         });
    }
  };

  // --- Conversation Management Handlers (to be passed down) ---
   const handleNewChat = useCallback(() => {
    const newId = generateId();
    const newConversation = {
      name: `聊天 ${Object.keys(allConversations).length + 1}`, // "Chat X"
      messages: []
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
                 const newId = generateId();
                 const initialConversation = { name: '新聊天', messages: [] }; // "New Chat"
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
        alert(`对话 "${importedData.name}" 导入成功!`); // Conversation X imported successfully!
      } catch (e) {
        console.error("导入聊天时出错:", e); // Error importing chat:
        setError("导入对话时发生错误。" + e.message); // Error occurred while importing the conversation.
      }
    }, []); // No dependencies needed as it uses the imported data directly

  // --- Re-add Message Action Handlers ---
  const handleDeleteMessage = useCallback((indexToDelete) => {
      if (!activeConversationId || !allConversations[activeConversationId]) return;
      setAllConversations(prev => {
          const activeConvo = prev[activeConversationId];
          if (!activeConvo?.messages) return prev;
          const updatedMessages = activeConvo.messages.filter((_, index) => index !== indexToDelete);
          return { ...prev, [activeConversationId]: { ...activeConvo, messages: updatedMessages } };
      });
   }, [activeConversationId, allConversations]);

   const handleEditMessageStart = useCallback((indexToEdit, currentContent) => {
       setEditingIndex(indexToEdit);
       setEditText(currentContent);
   }, []);

   const handleSaveEdit = useCallback(() => {
       if (editingIndex === null || !activeConversationId || !allConversations[activeConversationId]) return;
       setAllConversations(prev => {
            const activeConvo = prev[activeConversationId];
            if (!activeConvo?.messages?.[editingIndex]) return prev;
            const updatedMessages = [...activeConvo.messages];
            updatedMessages[editingIndex] = { ...updatedMessages[editingIndex], content: editText };
            return { ...prev, [activeConversationId]: { ...activeConvo, messages: updatedMessages } };
       });
       handleCancelEdit();
   }, [editingIndex, editText, activeConversationId, allConversations]);

   const handleCancelEdit = useCallback(() => {
        setEditingIndex(null);
        setEditText('');
   }, []);

    const handleRegenerateResponse = useCallback((indexToRegenerate) => {
        setRegenTargetIndex(indexToRegenerate);
        setIsRegenModalOpen(true);
    }, []);

    const executeRegeneration = async (selectedRegenModel) => {
      setIsRegenModalOpen(false);
      if (regenTargetIndex === null || !activeConversationId || !allConversations[activeConversationId]) return;
      const activeConvo = allConversations[activeConversationId];
      if (!activeConvo?.messages || regenTargetIndex >= activeConvo.messages.length || regenTargetIndex === 0) {
          console.error("Invalid index for regeneration:", regenTargetIndex);
          setError("Failed to regenerate: Invalid message index.");
          setRegenTargetIndex(null);
          return;
      }
      const userMessageIndex = regenTargetIndex - 1;
      if (userMessageIndex < 0 || activeConvo.messages[userMessageIndex].role !== 'user') {
           console.error("Could not find preceding user message.");
           setError("Failed to regenerate: Context error.");
           setRegenTargetIndex(null);
           return;
      }
      const historyForAPI = activeConvo.messages.slice(0, userMessageIndex + 1).map(msg => ({ role: msg.role, content: msg.content }));

      setIsLoading(true);
      setError(null);

      setAllConversations(prev => {
          const updatedMessages = prev[activeConversationId].messages.filter((_, index) => index !== regenTargetIndex);
          return { ...prev, [activeConversationId]: { ...prev[activeConversationId], messages: updatedMessages } };
      });

      try {
          const aiResponseContent = await api.sendMessage(historyForAPI, selectedRegenModel);
          const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
          const aiMessage = { role: 'assistant', content: aiResponseContent, timestamp: aiTime, model: selectedRegenModel };
          setAllConversations(prev => {
              const currentMessages = prev[activeConversationId]?.messages || [];
              const finalMessages = [...currentMessages.slice(0, regenTargetIndex), aiMessage, ...currentMessages.slice(regenTargetIndex)];
              return { ...prev, [activeConversationId]: { ...prev[activeConversationId], messages: finalMessages } };
          });
      } catch (err) {
          console.error("API Error during regeneration:", err);
          const errorMsg = err.message || 'Sorry, could not regenerate the reply.';
          setError(errorMsg);
          const errorTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
          const errorMessage = { role: 'assistant', content: errorMsg, timestamp: errorTime, isError: true, model: selectedRegenModel };
          setAllConversations(prev => {
              const currentMessages = prev[activeConversationId]?.messages || [];
              const finalMessages = [...currentMessages.slice(0, regenTargetIndex), errorMessage, ...currentMessages.slice(regenTargetIndex)];
              return { ...prev, [activeConversationId]: { ...prev[activeConversationId], messages: finalMessages } };
          });
      } finally {
          setIsLoading(false);
          setRegenTargetIndex(null);
      }
  };

  // --- Render Logic ---
  const currentMessages = allConversations[activeConversationId]?.messages || [];
  const isActiveChatEmpty = currentMessages.length === 0;

  // Re-add model list definition for the modal
  const availableModelsForModal = [
      { id: 'deepseek/deepseek-chat-v3-0324:free', name: 'DeepSeek Chat V3 (0324)' },
      { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1' },
      { id: 'deepseek/deepseek-chat:free', name: 'DeepSeek Chat (Latest)' },
      { id: 'deepseek/deepseek-r1-distill-llama-70b:free', name: 'R1 Distill (Llama 70B)' },
      { id: 'deepseek/deepseek-r1-distill-qwen-32b:free', name: 'R1 Distill (Qwen 32B)' },
      { id: 'deepseek/deepseek-r1-distill-qwen-14b:free', name: 'R1 Distill (Qwen 14B)' },
       ...(api.DEFAULT_MODEL && ![
        'deepseek/deepseek-chat-v3-0324:free',
        'deepseek/deepseek-r1:free',
        'deepseek/deepseek-chat:free',
        'deepseek/deepseek-r1-distill-llama-70b:free',
        'deepseek/deepseek-r1-distill-qwen-32b:free',
        'deepseek/deepseek-r1-distill-qwen-14b:free'
    ].includes(api.DEFAULT_MODEL)
        ? [{ id: api.DEFAULT_MODEL, name: `${api.DEFAULT_MODEL.split('/').pop().split(':')[0]} (Default)` }]
        : [])
  ].filter((model, index, self) => index === self.findIndex((m) => m.id === model.id));

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
            onNewChat={handleNewChat}
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
                        <ChatMessages
                            messages={currentMessages}
                            isLoading={isLoading}
                            onDeleteMessage={handleDeleteMessage}
                            onEditMessage={handleEditMessageStart}
                            onRegenerateResponse={handleRegenerateResponse}
                            editingIndex={editingIndex}
                            editText={editText}
                            onEditTextChange={setEditText}
                            onSaveEdit={handleSaveEdit}
                            onCancelEdit={handleCancelEdit}
                        />
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
        <RegenerateModal
            isOpen={isRegenModalOpen}
            onClose={() => {
                setIsRegenModalOpen(false);
                setRegenTargetIndex(null);
            }}
            availableModels={availableModelsForModal}
            onModelSelect={executeRegeneration}
            currentSelectedModel={selectedModel}
        />
    </div>
  );
}

export default Chatbot;