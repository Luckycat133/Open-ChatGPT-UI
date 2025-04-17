# Open ChatGPT UI

这是一个使用 React 和 Vite 构建的 ChatGPT 界面。

## ✨ 特性

- 基于 Vite 的快速开发环境
- 使用 React 构建用户界面
- 基础的聊天交互界面 (`src/ChatUI.jsx`)
- 支持 Markdown 渲染 (待实现)
- 支持代码高亮 (待实现)

## 🚀 快速开始

1.  **克隆项目**

    ```bash
    git clone https://github.com/your-username/Open-ChatGPT-UI.git
    cd Open-ChatGPT-UI
    ```

2.  **安装依赖**

    ```bash
    npm install
    ```

3.  **配置 API 密钥**

    将 `.env.example` 文件复制为 `.env`，并填入你的 OpenAI API 密钥：

    ```bash
    cp .env.example .env
    ```

    编辑 `.env` 文件，根据你的需求配置 API 服务：

    ```dotenv
    # --- Configuration Options --- 
    # Choose ONE of the following API configurations:

    # Option 1: Use OpenRouter (Recommended for access to various models)
    # Get your API key from https://openrouter.ai/keys
    # Replace 'YOUR_OPENROUTER_API_KEY_HERE' with your actual key.
    VITE_OPENROUTER_API_KEY=YOUR_OPENROUTER_API_KEY_HERE

    # Option 2: Use a custom OpenAI-compatible endpoint
    # Useful for local LLMs (LM Studio, Ollama, etc.) or other cloud providers.
    # Uncomment and set BOTH variables below if using this option.
    # VITE_OPENAI_API_BASE_URL=http://localhost:1234/v1 # Example: Replace with your server URL
    # VITE_OPENAI_API_KEY=YOUR_API_KEY # Example: Often 'none', 'ollama', or a specific key

    # --- Optional Settings --- 

    # Default Model Selection
    # Specify the default model ID to use when the application starts.
    # If commented out, the application might use a hardcoded default or prompt for selection.
    # Example: VITE_DEFAULT_MODEL=openai/gpt-4o
    # Example: VITE_DEFAULT_MODEL=anthropic/claude-3-haiku
    # VITE_DEFAULT_MODEL=YOUR_PREFERRED_MODEL_ID
    ```

    **说明:**
    *   你只需要配置 **Option 1** 或 **Option 2** 中的一种。
    *   如果你使用 **Option 1 (OpenRouter)**，只需填入 `VITE_OPENROUTER_API_KEY`。
    *   如果你使用 **Option 2 (自定义)**，需要取消注释并同时设置 `VITE_OPENAI_API_BASE_URL` 和 `VITE_OPENAI_API_KEY`。
    *   `VITE_DEFAULT_MODEL` 是可选的。取消注释并设置一个模型 ID (例如 `openai/gpt-4o` 或 `anthropic/claude-3-haiku`) 可以指定应用启动时默认选中的模型。
    # VITE_DEFAULT_MODEL=gpt-3.5-turbo 
    ```

    **注意:**
    *   你只需要配置 *一种* API 服务（OpenRouter 或自定义 OpenAI 兼容服务）。
    *   如果同时配置了两者，自定义 OpenAI 兼容服务的配置 (`VITE_OPENAI_API_KEY` 和 `VITE_OPENAI_API_BASE_URL`) 将优先使用。
    *   确保取消注释 (`#`) 你想要使用的那部分配置。

4.  **运行开发服务器**

    ```bash
    npm run dev
    ```

    在浏览器中打开 `http://localhost:5173` (或终端显示的端口)。

## 🛠️ 构建

```bash
npm run build
```

## 📝 文档

- [开发计划](readme/DEVELOPMENT_PLAN.md)
- [更新日志](CHANGELOG.md)

## 📄 许可证

[MIT](LICENSE)
