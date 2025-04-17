import React, { useState, useEffect, useRef } from "react";

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
  const [messages, setMessages] = useState([]); // Add state for chat messages
  const [inputMessage, setInputMessage] = useState(''); // Add state for input field
  const [isLoading, setIsLoading] = useState(false); // Add state for loading indicator
  const messagesEndRef = useRef(null); // Ref for scrolling to bottom

  // Function to scroll to the bottom of the messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom(); // Scroll to bottom whenever messages update
  }, [messages]);

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

    // Initial welcome message or load history
    setMessages([
      {
        role: "assistant",
        content: "你好！有什么可以帮你的吗？",
      },
    ]);

  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const newUserMessage = {
      role: "user",
      content: inputMessage.trim(),
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
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
      setMessages((prevMessages) => [
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
      model: selectedModel,
      messages: [...messages, newUserMessage].map(({ role, content }) => ({ role, content })), // Send history + new message
      stream: true, // Enable streaming
    });

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
      if (!response.body) {
        throw new Error("Streaming response not supported or body is null.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";
      let currentAssistantMessageIndex = -1;

      // Add a placeholder for the assistant's message
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, { role: "assistant", content: "" }];
        currentAssistantMessageIndex = newMessages.length - 1;
        return newMessages;
      });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.substring(6);
            if (dataStr === '[DONE]') {
              break; // Stream finished
            }
            try {
              const data = JSON.parse(dataStr);
              const delta = data.choices[0]?.delta?.content;
              if (delta) {
                accumulatedContent += delta;
                // Update the content of the current assistant message
                setMessages((prevMessages) => {
                  const updatedMessages = [...prevMessages];
                  if (currentAssistantMessageIndex !== -1 && updatedMessages[currentAssistantMessageIndex]) {
                    updatedMessages[currentAssistantMessageIndex].content = accumulatedContent;
                  }
                  return updatedMessages;
                });
              }
            } catch (e) {
              console.error('Error parsing stream data:', e, 'Data string:', dataStr);
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
    }
  };

  // Handle Enter key press in textarea
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent default newline behavior
      handleSendMessage();
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: "#f7f7f8"
    }}>
      {/* 顶部栏 */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 24px 0 24px",
        borderBottom: '1px solid #eee',
        paddingBottom: '16px',
        background: '#fff',
      }}>
        {/* 左上角：展开历史/新建对话/模型切换 */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button style={{
            borderRadius: "50%",
            border: "none",
            width: 36,
            height: 36,
            background: "#fff",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            cursor: "pointer",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>≡</button>
          <button style={{
            borderRadius: "50%",
            border: "none",
            width: 36,
            height: 36,
            background: "#fff",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            cursor: "pointer",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>+</button>
          <select
            style={{
              borderRadius: 20,
              border: "1px solid #eee",
              padding: "4px 16px",
              marginLeft: 8,
              background: "#fff",
              cursor: 'pointer',
              maxWidth: '250px', // Limit width to prevent overflow
              textOverflow: 'ellipsis' // Add ellipsis for long names
            }}
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={isLoading}
            title={availableModels.find(m => m.id === selectedModel)?.description || '选择一个模型'}
          >
            {Object.entries(groupedModels).map(([provider, models]) => (
              <optgroup label={provider} key={provider}>
                {models.map((model) => (
                  <option key={model.id} value={model.id} title={model.description}>
                    {model.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        {/* 右上角：占位符 */}
        <div></div> {/* Placeholder to balance the layout */}
      </div>
      {/* 对话区 */}
      <div style={{
        flex: 1,
        overflowY: "auto", // Make message area scrollable
        padding: "24px 24px 0 24px"
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* 消息列表 */}
          {messages.map((msg, index) => (
            <div key={index} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{
                background: msg.role === "user" ? "#222" : "#f3f6fc",
                color: msg.role === "user" ? "#fff" : "#222",
                borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                padding: "12px 18px",
                maxWidth: "80%",
                fontSize: 16,
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                whiteSpace: 'pre-wrap', // Preserve whitespace and newlines
                wordWrap: 'break-word', // Break long words
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {/* Add ref to the last element for scrolling */}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* 输入区 */}
      <div style={{
        padding: "16px 24px",
        borderTop: "1px solid #f0f0f0",
        background: "#fff", // Changed background for better contrast
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          maxWidth: 800,
          margin: '0 auto',
          background: '#f4f4f5', // Input area background
          borderRadius: 12,
          padding: '4px 4px 4px 16px'
        }}>
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown} // Add keydown handler
            placeholder="输入消息... (Shift+Enter 换行)"
            rows={1} // Start with one row
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              resize: "none",
              fontSize: 16,
              background: 'transparent',
              maxHeight: '150px', // Limit max height
              overflowY: 'auto', // Allow scrolling if needed
              lineHeight: '1.5'
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()} // Disable when loading or input is empty
            style={{
              marginLeft: 12,
              border: "none",
              background: isLoading || !inputMessage.trim() ? "#ccc" : "#222",
              color: "#fff",
              borderRadius: 8,
              padding: "10px 16px",
              cursor: isLoading || !inputMessage.trim() ? "not-allowed" : "pointer",
              fontSize: 16,
              opacity: isLoading || !inputMessage.trim() ? 0.6 : 1,
              transition: 'background-color 0.2s ease'
            }}
          >
            {isLoading ? "发送中..." : "发送"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;