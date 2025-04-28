# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Implement message streaming functionality
- Update default model to `deepseek/deepseek-chat` (`.env` configuration)

### Changed
- Optimize chat interface layout with 1280px max-width container (`src/index.css`)
- Improve mobile sidebar interaction experience

### Fixed
- Fix model selector dropdown display issue on mobile devices

## [0.1.1] - 2024-04-28
### Changed
- Remove max-width constraints in `src/index.css` for full-width chat interface

## [0.1.0] - 2024-04-23

### Changed
- Removed max-width constraints in `src/index.css` to allow the chat interface to utilize the full window width.

## [1.1.0] - 2024-04-24
### Added
- Multi-conversation management system
- ChatList sidebar for conversation operations
- Conversation persistence in localStorage
- Import/export conversation functionality
- Conversation sharing via clipboard

### Changed
- Implement responsive layout adjustments for desktop/mobile
- Refactor chat state management in `Chatbot.jsx`
- Update CSS for new layout in `index.css`

### Removed
- Static user/AI avatars from messages
- "Reason" button from input area

## [1.0.1] - 2024-04-24
### Fixed
- Resolve blank screen issue by fixing chat state logic
- Correct JavaScript error in empty chat handling

## [1.0.0] - 2024-04-24
### Changed
- Complete UI redesign with new color scheme and layout
- Implement persistent left sidebar
- Add empty state placeholders
- Optimize textarea auto-grow behavior

#### Removed
- Removed the "Private" toggle button and related logic from `TopBar.jsx`.

### 2025-04-24 (Conversation Management)

#### Added
- **Conversation Management:**
  - Implemented multi-conversation support.
  - Added `ChatList` sidebar to view, select, rename, and delete conversations.
  - Conversations are now persisted in browser `localStorage`.
  - Added conversation export (as `.json` file) and import functionality.
  - Added conversation sharing (copy text to clipboard).
- **UI/UX:**
  - Added `TopBar` button to toggle the `ChatList` sidebar visibility.
  - Implemented responsive layout adjustments for desktop screens (sidebar pushes content) and mobile (sidebar overlays content).

#### Changed
- Refactored `Chatbot.jsx` to manage conversation state and `localStorage`.
- Updated `TopBar.jsx` to handle model selection state via props and trigger sidebar toggle.
- Updated `api.js` to export `DEFAULT_MODEL`.
- Updated CSS (`index.css`) significantly for new layout, sidebar, and responsiveness.

#### Removed
- Removed static user/AI avatars from chat messages.
- Removed the "Reason" (lightbulb icon) button from the input area.
- Removed hardcoded model list from `TopBar.jsx`, now uses models defined in the component and `DEFAULT_MODEL` from `api.js`.

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