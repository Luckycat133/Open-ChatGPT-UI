# Open ChatGPT UI

🌐 Language Switch: [English](CHANGELOG.md) | [中文](CHANGELOG.zh-CN.md)

A ChatGPT interface built with React and Vite.

## ✨ Features

- Vite-based development environment
- React UI framework
- Basic chat interface (`src/ChatUI.jsx`)
- Markdown rendering support (TODO)
- Code syntax highlighting (TODO)

## 🚀 Quick Start

1. **Clone Repository**

    ```bash
    git clone https://github.com/your-username/Open-ChatGPT-UI.git
    cd Open-ChatGPT-UI
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Configure API**

    Copy `.env.example` to `.env` and configure your API settings:

    ```bash
    cp .env.example .env
    ```

    Edit `.env` with your preferred configuration:

    ```dotenv
    # --- API Configuration ---
    # Choose ONE option below:

    # Option 1: OpenRouter
    VITE_OPENROUTER_API_KEY=your_api_key_here

    # Option 2: Custom endpoint
    # VITE_OPENAI_API_BASE_URL=http://localhost:1234/v1
    # VITE_OPENAI_API_KEY=your_key

    # --- Optional ---
    # VITE_DEFAULT_MODEL=model_id
    ```

4. **Start Dev Server**

    ```bash
    npm run dev
    ```

## 🛠️ Build

```bash
npm run build
```

## 📝 Documentation

- [Development Plan](readme/DEVELOPMENT_PLAN.md)
- [Changelog](CHANGELOG.md)

## 📄 License

[MIT](LICENSE)