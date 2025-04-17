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

    编辑 `.env` 文件：

    ```
    VITE_OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    ```

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
