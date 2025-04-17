import React, { useEffect } from "react";

const ChatUI = () => {
  useEffect(() => {
    // Read the API key from environment variables
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    if (!apiKey || apiKey === 'YOUR_OPENROUTER_API_KEY_HERE') {
      console.warn("OpenRouter API Key not configured. Please set VITE_OPENROUTER_API_KEY in your .env file.");
      // You might want to disable API-dependent features or show a message to the user here.
    } else {
      console.log("OpenRouter API Key loaded successfully.");
      // Use the apiKey for your API calls
    }
  }, []);

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
        padding: "16px 24px 0 24px"
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
            cursor: "pointer"
          }}>≡</button>
          <button style={{
            borderRadius: "50%",
            border: "none",
            width: 36,
            height: 36,
            background: "#fff",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            cursor: "pointer"
          }}>+</button>
          <select style={{
            borderRadius: 20,
            border: "1px solid #eee",
            padding: "4px 16px",
            marginLeft: 8,
            background: "#fff"
          }}>
            <option>ChatGPT</option>
            <option>GPT-4</option>
            <option>Claude</option>
          </select>
        </div>
        {/* 右上角：隐私模型切换 */}
        <button style={{
          borderRadius: 20,
          border: "1px dashed #222",
          background: "#fff",
          padding: "4px 18px",
          fontWeight: 500,
          cursor: "pointer"
        }}>Temporary</button>
      </div>
      {/* 对话区 */}
      <div style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <div style={{
          width: "100%",
          maxWidth: 600,
          minHeight: 400,
          background: "#fff",
          borderRadius: 24,
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 0,
          position: "relative"
        }}>
          {/* 消息列表 */}
          <div style={{ flex: 1, padding: "24px 24px 0 24px", overflowY: "auto" }}>
            {/* 预览对话消息 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* 用户消息 */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{
                  background: "#222",
                  color: "#fff",
                  borderRadius: "18px 18px 4px 18px",
                  padding: "12px 18px",
                  maxWidth: "70%",
                  fontSize: 16,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
                }}>
                  你好，能帮我总结一下这段文本吗？
                </div>
              </div>
              {/* AI 消息 */}
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  background: "#f3f6fc",
                  color: "#222",
                  borderRadius: "18px 18px 18px 4px",
                  padding: "12px 18px",
                  maxWidth: "70%",
                  fontSize: 16,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
                }}>
                  当然可以，请提供需要总结的文本内容。
                </div>
              </div>
              {/* 用户消息 */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{
                  background: "#222",
                  color: "#fff",
                  borderRadius: "18px 18px 4px 18px",
                  padding: "12px 18px",
                  maxWidth: "70%",
                  fontSize: 16,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
                }}>
                  这是一段关于人工智能发展的介绍……
                </div>
              </div>
              {/* AI 消息 */}
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  background: "#f3f6fc",
                  color: "#222",
                  borderRadius: "18px 18px 18px 4px",
                  padding: "12px 18px",
                  maxWidth: "70%",
                  fontSize: 16,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
                }}>
                  人工智能（AI）是指使计算机能够模拟人类智能行为的技术，包括学习、推理、感知等。近年来，AI 在各领域取得了显著进展。
                </div>
              </div>
            </div>
          </div>
          {/* 输入区 */}
          <div style={{
            display: "flex",
            alignItems: "center",
            padding: "16px 24px",
            borderTop: "1px solid #f0f0f0",
            background: "#fafbfc",
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24
          }}>
            {/* 左下角按钮 */}
            <div style={{ display: "flex", gap: 8 }}>
              <button title="Upload" style={{
                border: "none",
                background: "#fff",
                borderRadius: "50%",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                cursor: "pointer"
              }}>+</button>
              <button title="Search" style={{
                border: "none",
                background: "#fff",
                borderRadius: 20,
                padding: "0 14px",
                height: 36,
                display: "flex",
                alignItems: "center",
                gap: 4,
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                cursor: "pointer"
              }}><span role="img" aria-label="search">🌐</span>Search</button>
              <button title="Reason" style={{
                border: "none",
                background: "#fff",
                borderRadius: 20,
                padding: "0 14px",
                height: 36,
                display: "flex",
                alignItems: "center",
                gap: 4,
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                cursor: "pointer"
              }}><span role="img" aria-label="reason">💡</span>Reason</button>
            </div>
            {/* 输入框 */}
            <input type="text" placeholder="Ask anything" style={{
              flex: 1,
              margin: "0 12px",
              border: "none",
              outline: "none",
              background: "#fff",
              borderRadius: 20,
              padding: "0 16px",
              height: 36,
              fontSize: 16
            }} />
            {/* 语音按钮 */}
            <button title="Voice" style={{
              border: "none",
              background: "#fff",
              borderRadius: "50%",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 8,
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              cursor: "pointer"
            }}>
              <span role="img" aria-label="mic">🎤</span>
            </button>
            {/* 发送按钮 */}
            <button title="Send" style={{
              border: "none",
              background: "#000",
              color: "#fff",
              borderRadius: "50%",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              marginLeft: 4,
              cursor: "pointer"
            }}>
              <span style={{ transform: "translateY(-2px)" }}>↑</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;