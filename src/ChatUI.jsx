import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating unique IDs

const ChatUI = () => {
  // Define the available models with descriptions and providers
  const availableModels = [
    {
      id: 'deepseek/deepseek-chat-v3-0324:free',
      name: 'DeepSeek Chat v3 (免费)',
      provider: 'DeepSeek',
      description: 'DeepSeek最新旗舰免费聊天模型，综合性能优异，适合多场景对话。'
    },
    {
      id: 'deepseek/deepseek-r1:free',
      name: 'DeepSeek R1 (免费)',
      provider: 'DeepSeek',
      description: 'DeepSeek R1研究模型，适合探索和实验。'
    },
    {
      id: 'google/gemini-2.0-flash-exp:free',
      name: 'Gemini 2.0 Flash Exp (免费)',
      provider: 'Google',
      description: 'Google Gemini 2.0 Flash实验版，响应速度快，适合实时对话。'
    },
    {
      id: 'google/gemini-2.0-flash-thinking-exp-1219:free',
      name: 'Gemini 2.0 Flash Thinking Exp (免费)',
      provider: 'Google',
      description: 'Google Gemini 2.0 Flash思考型实验版，适合复杂推理。'
    },
    {
      id: 'google/gemma-3-27b-it:free',
      name: 'Gemma 3 27B IT (免费)',
      provider: 'Google',
      description: 'Google Gemma 3系列27B参数指令微调模型，适合多任务。'
    },
    {
      id: 'qwen/qwq-32b:free',
      name: 'Qwen QWQ 32B (免费)',
      provider: 'Qwen',
      description: '阿里巴巴Qwen QWQ 32B参数模型，中文能力突出。'
    },
    {
      id: 'meta-llama/llama-4-scout:free',
      name: 'Llama 4 Scout (免费)',
      provider: 'Meta Llama',
      description: 'Meta Llama 4 Scout，适合日常对话和内容生成。'
    },
    {
      id: 'meta-llama/llama-4-maverick:free',
      name: 'Llama 4 Maverick (免费)',
      provider: 'Meta Llama',
      description: 'Meta Llama 4 Maverick，创新型免费模型，适合多样化应用。'
    },
    {
      id: 'deepseek/deepseek-v3-base:free',
      name: 'DeepSeek v3 Base (免费)',
      provider: 'DeepSeek',
      description: 'DeepSeek v3基础免费模型，适合基础任务。'
    },
    {
      id: 'deepseek/deepseek-chat:free',
      name: 'DeepSeek Chat (免费)',
      provider: 'DeepSeek',
      description: 'DeepSeek通用免费聊天模型，适合日常对话。'
    }
  ];

  // Group models by provider
  const groupedModels = availableModels.reduce((acc, model) => {
    (acc[model.provider] = acc[model.provider] || []).push(model);
    return acc;
  }, {});

  const [selectedModel, setSelectedModel] = useState(''); // Add state for selected model
  // const [messages, setMessages] = useState([]); // Remove single message state
  const [inputMessage, setInputMessage] = useState(''); // Add state for input field
  const [isLoading, setIsLoading] = useState(false); // Add state for loading indicator
  const messagesEndRef = useRef(null); // Ref for scrolling to bottom

  // State for managing multiple conversations
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);

  // Helper function to get the current conversation's messages
  const getCurrentMessages = () => {
    const currentConversation = conversations.find(conv => conv.id === currentConversationId);
    return currentConversation ? currentConversation.messages : [];
  };

  // Helper function to update messages for the current conversation
  const updateCurrentMessages = (newMessages) => {
    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.id === currentConversationId
          ? { ...conv, messages: typeof newMessages === 'function' ? newMessages(conv.messages) : newMessages }
          : conv
      )
    );
  };

+ // Function to create a new conversation
+ const handleNewConversation = () => {
+   const newConvId = uuidv4();
+   const defaultModelEnv = import.meta.env.VITE_DEFAULT_MODEL;
+   const initialModelId = defaultModelEnv || (availableModels.length > 0 ? availableModels[0].id : '');
+   setConversations(prevConversations => [
+     ...prevConversations,
+     {
+       id: newConvId,
+       title: "新对话",
+       messages: [
+         {
+           role: "assistant",
+           content: "你好！有什么可以帮你的吗？",
+         },
+       ],
+       model: initialModelId // Use default or first available model
+     }
+   ]);
+   setCurrentConversationId(newConvId);
+   setSelectedModel(initialModelId); // Ensure model selection updates
+ };
+
+ // Function to switch conversation
+ const handleSwitchConversation = (id) => {
+   setCurrentConversationId(id);
+   // Model selection is handled by the useEffect hook watching currentConversationId
+ };
+
  // Function to scroll to the bottom of the messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom(); // Scroll to bottom whenever messages update
  }, [conversations, currentConversationId]); // Update dependency

  useEffect(() => {
    // Read the API key from environment variables
    const openRouterApiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    const openaiBaseUrl = import.meta.env.VITE_OPENAI_API_BASE_URL;
    const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const defaultModel = import.meta.env.VITE_DEFAULT_MODEL;

    // Set the initial model based on environment variable or the first available model
    const initialModelId = defaultModel || (availableModels.length > 0 ? availableModels[0].id : '');
    setSelectedModel(initialModelId);

    console.log("Environment Variables Check:");
    console.log("  OpenRouter API Key:", openRouterApiKey && openRouterApiKey !== 'YOUR_OPENROUTER_API_KEY_HERE' ? 'Loaded' : 'Not Configured');
    console.log("  OpenAI Base URL:", openaiBaseUrl ? openaiBaseUrl : 'Not Configured (using default)');
    console.log("  OpenAI API Key:", openaiApiKey && openaiApiKey !== 'YOUR_OPENAI_COMPATIBLE_API_KEY' ? 'Loaded' : 'Not Configured');
    console.log("  Default Model:", defaultModel ? defaultModel : 'Not Configured (using default)');

    // Initialize with one default conversation or load from storage (future)
    if (conversations.length === 0) {
      const initialConvId = uuidv4();
      setConversations([
        {
          id: initialConvId,
          title: "新对话", // Default title
          messages: [
            {
              role: "assistant",
              content: "你好！有什么可以帮你的吗？",
            },
          ],
          model: initialModelId // Store model per conversation
        }
      ]);
      setCurrentConversationId(initialConvId);
    } else if (!currentConversationId && conversations.length > 0) {
      // If conversations exist but no current one is set, select the first one
      setCurrentConversationId(conversations[0].id);
    }
    // Ensure selectedModel reflects the current conversation's model
    const currentConv = conversations.find(c => c.id === currentConversationId);
    if (currentConv && currentConv.model) {
        setSelectedModel(currentConv.model);
    } else if (initialModelId) {
        setSelectedModel(initialModelId);
    }

  }, []); // Keep initial load dependency empty for now

  // Update selectedModel when currentConversationId changes
  useEffect(() => {
    const currentConv = conversations.find(c => c.id === currentConversationId);
    if (currentConv && currentConv.model) {
      setSelectedModel(currentConv.model);
    } else {
      // Fallback if the conversation or its model isn't found (e.g., during init)
      const defaultModelEnv = import.meta.env.VITE_DEFAULT_MODEL;
      const initialModelId = defaultModelEnv || (availableModels.length > 0 ? availableModels[0].id : '');
      setSelectedModel(initialModelId);
    }
  }, [currentConversationId, conversations, availableModels]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !currentConversationId) return;

    const newUserMessage = {
      role: "user",
      content: inputMessage.trim(),
    };

    // Get current messages before updating state
    const currentMessages = getCurrentMessages();

    // Update messages for the current conversation
    updateCurrentMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Determine API configuration
    const openRouterApiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    const openaiBaseUrl = import.meta.env.VITE_OPENAI_API_BASE_URL;
    const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

    let apiUrl = '';
    let apiKey = '';
    let isUsingOpenRouter = false;

    // Prioritize custom OpenAI-compatible endpoint
    if (openaiApiKey && openaiApiKey !== 'YOUR_OPENAI_COMPATIBLE_API_KEY' && openaiBaseUrl) {
      console.log("Using custom OpenAI compatible configuration.");
      apiUrl = `${openaiBaseUrl.replace(/\/$/, '')}/chat/completions`;
      apiKey = openaiApiKey;
    } else if (openRouterApiKey && openRouterApiKey !== 'YOUR_OPENROUTER_API_KEY_HERE') {
      console.log("Using OpenRouter configuration.");
      apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
      apiKey = openRouterApiKey;
      isUsingOpenRouter = true;
    } else {
      console.error("API Key or Base URL not configured properly.");
      // Update messages for the current conversation with error
      updateCurrentMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "错误：API 未配置。请检查 .env 文件中的 VITE_OPENROUTER_API_KEY 或 VITE_OPENAI_API_KEY/VITE_OPENAI_API_BASE_URL。",
        },
      ]);
      setIsLoading(false);
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };

    if (isUsingOpenRouter) {
      headers['HTTP-Referer'] = window.location.origin; // Required by OpenRouter
      headers['X-Title'] = 'Open ChatGPT UI'; // Optional for OpenRouter
    }

    const body = JSON.stringify({
      model: selectedModel, // Use the model selected for the current conversation
      messages: [...currentMessages, newUserMessage].map(({ role, content }) => ({ role, content })), // Send history + new message
      stream: true, // Enable streaming
    });

    let assistantResponseContent = ""; // Accumulate response content
    let assistantMessageId = uuidv4(); // Unique ID for the assistant message chunk
    let firstChunk = true;
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: body,
      });

      if (!response.ok) {
        // Attempt to read error details from the response body
        let errorDetails = 'Unknown error';
        try {
          const errorData = await response.json();
          errorDetails = errorData.error?.message || JSON.stringify(errorData);
        } catch (e) {
          errorDetails = await response.text(); // Fallback to plain text
        }
        console.error("API Error Status:", response.status);
        console.error("API Error Details:", errorDetails);
        throw new Error(`API request failed with status ${response.status}: ${errorDetails}`);
      }

      // Handle streaming response
      // Add an empty assistant message placeholder first
      updateCurrentMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: "", id: assistantMessageId }, // Use the generated ID
      ]);
      
      if (!response.body) {
        throw new Error("Streaming response not supported or body is null.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      -       let assistantResponseContent = ""; // Accumulate response content
      -       let firstChunk = true;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: true });

        // Process Server-Sent Events (SSE)
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataContent = line.substring(6);
            if (dataContent === '[DONE]') {
              done = true;
              break;
            }
            try {
              const json = JSON.parse(dataContent);
              const deltaContent = json.choices?.[0]?.delta?.content;
              if (deltaContent) {
                assistantResponseContent += deltaContent;

                // Update the last message (assistant's response) in real-time
                setMessages((prevMessages) => {
                  const updatedMessages = [...prevMessages];
                  if (firstChunk && updatedMessages[updatedMessages.length - 1]?.role !== "assistant") {
                    // Add a new assistant message if it's the first chunk
                    updatedMessages.push({ role: "assistant", content: deltaContent });
                    firstChunk = false;
                  } else if (updatedMessages.length > 0) {
                    // Append to the existing assistant message
                    const lastMessageIndex = updatedMessages.length - 1;
                    updatedMessages[lastMessageIndex] = {
                      ...updatedMessages[lastMessageIndex],
                      content: assistantResponseContent,
                    };
                  }
                  return updatedMessages;
                  // Update the specific assistant message by its ID
                  updateCurrentMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                      msg.id === assistantMessageId
                        ? { ...msg, content: assistantResponseContent }
                        : msg
                    )
                  );
                }
              } catch (e) {
                console.error('Error parsing stream data:', e, 'Data string:', dataStr);
              }
            }
          }
        }
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      // Add error message to chat, ensuring it doesn't overwrite the placeholder if streaming started
      setMessages((prevMessages) => {
          // If the last message is an empty assistant message (placeholder), remove it
          if (prevMessages[prevMessages.length - 1]?.role === 'assistant' && prevMessages[prevMessages.length - 1]?.content === '') {
              return [
                  ...prevMessages.slice(0, -1),
                  {
                      role: "assistant",
                      content: `抱歉，处理消息时出错：${error.message}`,
                  },
              ];
          } else {
              // Otherwise, just append the error message
              return [
                  ...prevMessages,
                  {
                      role: "assistant",
                      content: `抱歉，发送消息时出错：${error.message}`,
                  },
              ];
          }
      });
    } finally {
      setIsLoading(false);
      scrollToBottom(); // Ensure scroll after loading finishes

        // --- Title Generation Logic ---
        const currentMessages = getCurrentMessages();
        const currentConv = conversations.find(c => c.id === currentConversationId);
        // Check if it's the first exchange (user -> assistant) and title is default
        if (currentMessages.length === 2 && currentConv && currentConv.title === "新对话") {
          generateConversationTitle(currentMessages);
        }
        // --- End Title Generation Logic ---
      };
+   
+   // Function to generate conversation title using the LLM
+   const generateConversationTitle = async (conversationMessages) => {
+     if (!currentConversationId) return;
+   
+     console.log("Generating title for conversation:", currentConversationId);
+   
+     // Prepare messages for the title generation prompt
+     const titlePromptMessages = [
+       ...conversationMessages.slice(0, 2).map(({ role, content }) => ({ role, content })), // Use first user and assistant message
+       { role: "user", content: "请根据以上对话内容，生成一个简洁的、不超过5个字的标题。" }
+     ];
+   
+     // Determine API configuration (reuse logic from handleSendMessage)
+     const openRouterApiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
+     const openaiBaseUrl = import.meta.env.VITE_OPENAI_API_BASE_URL;
+     const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
+     const titleModel = 'google/gemma-3-27b-it:free'; // Use a fast model for titles
+   
+     let apiUrl = '';
+     let apiKey = '';
+     let isUsingOpenRouter = false;
+   
+     if (openaiApiKey && openaiApiKey !== 'YOUR_OPENAI_COMPATIBLE_API_KEY' && openaiBaseUrl) {
+       apiUrl = `${openaiBaseUrl.replace(//$/, '')}/chat/completions`;
+       apiKey = openaiApiKey;
+     } else if (openRouterApiKey && openRouterApiKey !== 'YOUR_OPENROUTER_API_KEY_HERE') {
+       apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
+       apiKey = openRouterApiKey;
+       isUsingOpenRouter = true;
+     } else {
+       console.error("API Key not configured for title generation.");
+       return; // Cannot generate title without API key
+     }
+   
+     const headers = {
+       'Content-Type': 'application/json',
+       'Authorization': `Bearer ${apiKey}`,
+     };
+     if (isUsingOpenRouter) {
+       headers['HTTP-Referer'] = window.location.origin;
+       headers['X-Title'] = 'Open ChatGPT UI (Title Gen)';
+     }
+   
+     const body = JSON.stringify({
+       model: titleModel,
+       messages: titlePromptMessages,
+       max_tokens: 20, // Limit title length
+       temperature: 0.5, // Lower temperature for more deterministic titles
+       stream: false, // No need to stream title
+     });
+   
+     try {
+       const response = await fetch(apiUrl, {
+         method: 'POST',
+         headers: headers,
+         body: body,
+       });
+   
+       if (!response.ok) {
+         const errorData = await response.json();
+         throw new Error(`Title generation API request failed: ${errorData.error?.message || response.statusText}`);
+       }
+   
+       const data = await response.json();
+       const generatedTitle = data.choices?.[0]?.message?.content?.trim().replace(/["“”]/g, ''); // Extract and clean title
+   
+       if (generatedTitle) {
+         console.log(`Generated title: "${generatedTitle}" for conversation ${currentConversationId}`);
+         // Update the conversation title
+         setConversations(prevConversations =>
+           prevConversations.map(conv =>
+             conv.id === currentConversationId
+               ? { ...conv, title: generatedTitle }
+               : conv
+           )
+         );
+       } else {
+         console.warn("Could not extract title from API response.", data);
+       }
+     } catch (error) {
+       console.error("Error generating conversation title:", error);
+       // Optionally, set a default error title or leave it as "新对话
    };

  // Handle Enter key press in textarea
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent default newline behavior
      handleSendMessage();
    }
  };

  return (
+   <div className="flex h-screen bg-gray-100">
+     {/* Sidebar for Conversations */}
+     <div className="w-64 bg-gray-800 text-white flex flex-col">
+       <div className="p-4 border-b border-gray-700">
+         <button
+           onClick={handleNewConversation}
+           className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
+         >
+           + 新对话
+         </button>
+       </div>
+       <div className="flex-1 overflow-y-auto">
+         {conversations.map((conv) => (
+           <div
+             key={conv.id}
+             onClick={() => handleSwitchConversation(conv.id)}
+             className={`p-3 cursor-pointer hover:bg-gray-700 ${currentConversationId === conv.id ? 'bg-gray-600' : ''}`}
+           >
+             {conv.title || '对话'}
+           </div>
+         ))}
+       </div>
+       {/* Optional: Add settings or user info at the bottom */}
+     </div>
+
+     {/* Main Chat Area */}
+     <div className="flex-1 flex flex-col">
        {/* Header with Model Selection */}
        <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Open ChatGPT UI</h1>
          {/* Model Selector Dropdown */}
          <select
            value={selectedModel}
-           onChange={(e) => setSelectedModel(e.target.value)}
+           onChange={(e) => {
+             const newModelId = e.target.value;
+             setSelectedModel(newModelId);
+             // Update the model for the current conversation
+             setConversations(prev => prev.map(conv =>
+               conv.id === currentConversationId ? { ...conv, model: newModelId } : conv
+             ));
+           }}
            className="p-2 border rounded bg-white shadow-sm"
            disabled={isLoading} // Disable when loading
          >
            <option value="" disabled>选择模型</option>
            {Object.entries(groupedModels).map(([provider, models]) => (
              <optgroup label={provider} key={provider}>
                {models.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Message Display Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
-         {messages.map((msg, index) => (
+         {getCurrentMessages().map((msg, index) => (
            <div
              key={msg.id || index} // Use message ID if available, otherwise index
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xl lg:max-w-2xl px-4 py-2 rounded-lg shadow ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}
              >
                {/* Basic Markdown rendering (e.g., newlines) */}
                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 rounded-lg shadow bg-white text-gray-500">
                思考中...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} /> {/* Anchor for scrolling */}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <textarea
              className="flex-1 p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="输入消息..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading || !currentConversationId} // Disable if no conversation selected
            />
            <button
              className={`px-4 py-2 rounded-md text-white font-semibold transition duration-150 ease-in-out ${isLoading || !inputMessage.trim() || !currentConversationId ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim() || !currentConversationId}
            >
              发送
            </button>
          </div>
        </div>
+     </div>
+   </div>
  );
 };

export default ChatUI;