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

## [0.1.1] - 2025-04-18
### Changed
- Verified OpenRouter API request format in `src/ChatUI.jsx` against official documentation.

## [0.1.0] - 2024-04-23

### Added
- Initial HTML structure and basic CSS for the AI chat interface (`index.html`).
- Display of user and AI avatars in chat messages.
- Display of timestamps for each chat message.
- Environment variable support using `dotenv` package.
- `.env.example` file to provide a template for necessary environment variables (e.g., API keys).
- `.gitignore` file to exclude sensitive files (`.env`) and build artifacts (`node_modules`) from version control.

### Changed
- Refined chat message styling for clearer visual separation and layout.

### Security
- Configured `.gitignore` to prevent accidental committing of the `.env` file containing API keys.