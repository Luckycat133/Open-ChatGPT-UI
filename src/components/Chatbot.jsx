import React, { useState, useEffect } from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import TopBar from './TopBar'; // Assuming TopBar component will be created later
import api from '../api'; // Assuming api.js will be created later

function Chatbot() {
  const [messages, setMessages] = useState([]); // State to hold chat messages [{ role: 'user' | 'assistant', content: string, timestamp: string }]
  const [newMessage, setNewMessage] = useState(''); // State for the input field
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
  const [error, setError] = useState(null); // State for API errors

  // Placeholder for initial message or loading history
  useEffect(() => {
    // Add a default welcome message or load chat history here if needed
    setMessages([
      { role: 'assistant', content: '你好！有什么可以帮你的吗？', timestamp: '11:00' }
    ]);
  }, []);

  const handleSendMessage = async () => {
    const userMessageContent = newMessage.trim();
    if (!userMessageContent || isLoading) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const userMessage = { role: 'user', content: userMessageContent, timestamp: currentTime };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);
    setError(null);

    // Prepare message history for API (adjust format as needed by your API)
    const historyForAPI = messages.map(msg => ({ role: msg.role, content: msg.content }));
    historyForAPI.push({ role: 'user', content: userMessageContent }); // Add current user message

    try {
      const aiResponseContent = await api.sendMessage(historyForAPI); // Call the API
      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      const aiMessage = { role: 'assistant', content: aiResponseContent, timestamp: aiTime };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error("API Error:", err);
      setError('抱歉，无法获取回复，请稍后再试。');
      // Optionally add an error message to the chat
      const errorTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      const errorMessage = { role: 'assistant', content: '抱歉，无法获取回复，请稍后再试。', timestamp: errorTime, isError: true };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render Logic ---
  return (
    <div className="chat-container">
       {/* We'll add the TopBar component here later */}
       <TopBar /> 
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        isLoading={isLoading}
        handleSendMessage={handleSendMessage}
      />
       {error && <div className="error-message">{error}</div>} {/* Display API errors */}
    </div>
  );
}

export default Chatbot; 