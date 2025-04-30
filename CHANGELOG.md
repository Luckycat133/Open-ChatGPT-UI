# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Implement message streaming functionality
- Update default model to `deepseek/deepseek-chat` (`.env` configuration)
### Changed
- Translated remaining Chinese comments and UI text to English to ensure English-first priority.
- Optimize chat interface layout with 1280px max-width container (`src/index.css`)
- Improve mobile sidebar interaction experience

### Fixed
- Fix model selector dropdown display issue on mobile devices

## [0.1.7] - 2025-04-29
### Added
- Model descriptions displayed below model names in the dropdown (`TopBar.jsx`, `index.css`).
- Action buttons (Copy, Delete, Edit for user, Regenerate for AI) appear on message hover (`ChatMessages.jsx`, `Chatbot.jsx`, `index.css`).
- Implemented inline editing for user messages.
- Implemented Regenerate AI response functionality with model selection modal.
- Display model name used for each AI response.

### Changed
- Changed copy button feedback from `alert` to `console.log` (`ChatMessages.jsx`).
- Refined visual style for message action buttons.

### Fixed
- Re-implemented message action button functionality (Delete, Edit, Regenerate).
- Ensured model descriptions are consistently visible in the dropdown.

## [0.1.6] - 2025-04-29
### Added
- Model descriptions now appear as tooltips when hovering over models in the dropdown selector (`TopBar.jsx`, `index.css`).

### Changed
- Replaced previous DeepSeek models with a specific list of free OpenRouter DeepSeek models (`TopBar.jsx`).
- Removed the separate model info button and its tooltip (`TopBar.jsx`, `index.css`).
- Improved the visual style of the "New Chat" button in the chat list header (`index.css`).

### Fixed
- Addressed issue where the previous model info tooltip was not appearing on hover/click (by removing it).

## [0.1.5] - 2025-04-29
### Added
- Added model information tooltip next to the model selector in the top bar (`TopBar.jsx`, `index.css`).

### Changed
- Updated available models to only include DeepSeek Chat and DeepSeek Coder (`TopBar.jsx`).

### Fixed
- Replaced SVG with `FaPlus` icon for the "New Chat" button in the chat list header (`ChatList.jsx`).
- Fixed `ReferenceError: onNewChat is not defined` by adding the `onNewChat` prop to `ChatList` (`ChatList.jsx`).

## [0.1.2] - 2024-04-24
### Added
- Multi-conversation management system
- Chat list sidebar functionality
- Local storage for conversation history
- Conversation import/export functionality
- Conversation sharing via clipboard

### Changed
- Implement responsive layout adjustments for desktop/mobile
- Refactor chat state management in `Chatbot.jsx`
- Update CSS for new layout in `index.css`

### Removed
- Static user/AI avatars from messages
- "Reason" button from input area

## [0.1.1] - 2024-04-24
### Fixed
- Fixed blank page issue (chat state logic)
- Fixed JavaScript error when there are no conversations

## [0.1.0] - 2024-04-23
### Changed
- New UI design (color scheme and layout)
- Implemented persistent left sidebar
- Added placeholder for empty state
- Optimized text area auto-expansion feature

#### Removed
- Removed the "Private" toggle button and related logic from `TopBar.jsx`.