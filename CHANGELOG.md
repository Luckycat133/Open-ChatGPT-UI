# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Implemented streaming support for AI responses in `src/ChatUI.jsx`.
- Reviewed detailed OpenRouter API documentation regarding model routing, streaming, multimodal support, and response formats.
### Changed
- Updated default model to `deepseek/deepseek-chat` in `.env`.

## [0.1.1] - 2024-04-24
### Added
- Basic file selection functionality (logs selected file name to console).
- Responsive design improvements using CSS media queries for better mobile layout.
- Professional icons using `react-icons` library, replacing previous emoji/pseudo-element icons.

### Changed
- Updated `.env.example`:
  - Prefixed frontend-accessible variables with `VITE_`.
  - Added specific variables (`VITE_OPENAI_API_BASE_URL`, `VITE_OPENAI_API_KEY`) for configuring custom OpenAI-compatible endpoints.
  - Added `VITE_DEFAULT_MODEL` variable for setting the default model.
  - Improved comments for better clarity and ease of configuration.
- Refined CSS for improved aesthetics (colors, spacing, loading indicator).

### Fixed
- Resolved issue where `src/index.css` was not found by Vite.
- Corrected `package.json` to include standard Vite scripts (`dev`) and necessary React/Vite dependencies.

## [0.1.0] - 2024-04-23

### Added
- Initial HTML structure and basic CSS for the AI chat interface (`index.html`).
- Display of user and AI avatars in chat messages.
- Display of timestamps for each chat message.
- Environment variable support using `dotenv` package.
- `.env.example` file to provide a template for necessary environment variables (e.g., API keys).
- `.gitignore` file to exclude sensitive files (`.env`) and build artifacts (`node_modules`) from version control.
- Basic React component structure (`App`, `Chatbot`, `ChatMessages`, `ChatInput`, `TopBar`, `api.js`).
- Implemented core message sending/receiving logic (non-streaming).
- Basic API configuration handling for OpenRouter and OpenAI-compatible endpoints in `api.js`.

### Changed
- Refined chat message styling for clearer visual separation and layout.

### Security
- Configured `.gitignore` to prevent accidental committing of the `.env` file containing API keys.