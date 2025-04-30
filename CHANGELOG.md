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

## [0.1.14] - 2025-04-30
### Added
- Implemented streaming for AI responses (`api.js`, `Chatbot.jsx`).
- Added Markdown rendering support via `react-markdown` (`ChatMessages.jsx`). Requires `npm install react-markdown remark-gfm`.

### Changed
- Unified button styles (Save/Cancel in Edit, Modal Close) (`index.css`).
- Removed "(Free Tier)" from model descriptions (`TopBar.jsx`).

### Fixed
- Corrected JSX syntax error in `ChatMessages.jsx`.
- Ensured message action buttons (Copy, Delete, Edit, Regenerate) are functional.

## [0.1.13] - 2025-04-30
### Added
- Implemented basic streaming for AI responses (`api.js`, `Chatbot.jsx`).
- Added Markdown rendering for message content using `react-markdown` (`ChatMessages.jsx`).

### Changed
- Unified button styles for Cancel (Modal), Save/Cancel (Edit Message) (`index.css`).

### Fixed
- Addressed potential issues with Markdown and newline rendering in AI responses.
- Corrected JSX syntax error from previous attempt (`ChatMessages.jsx`).

## [0.1.12] - 2025-04-29
### Fixed
- Corrected CSS issues causing broken styles in Model Dropdown, Regenerate Modal, and Inline Edit inputs.
- Verified presence and application of relevant CSS rules.

## [0.1.11] - 2025-04-29
### Changed
- Increased main container and content area max-width for better desktop layout (`index.css`).
- Translated UI elements to Chinese (Simplified) (`ChatList.jsx`, `TopBar.jsx`, `ChatMessages.jsx`, `ChatInput.jsx`, `RegenerateModal.jsx`, `Chatbot.jsx`).
- Visually refined the 'Regenerate Model' selection modal (`index.css`).
- Removed "(Free Tier)" from model descriptions (`TopBar.jsx`).
- Adjusted message action button positioning to use flexbox instead of absolute positioning (`index.css`, `ChatMessages.jsx`).

### Fixed
- Ensured message action buttons (Delete, Edit, Regenerate, Copy) are correctly implemented and functional.

## [0.1.10] - 2025-04-29
### Changed
- Adjusted message action button positioning using Flexbox for better alignment (`index.css`, `ChatMessages.jsx`).
- Refined model description display in dropdown: removed "(Free Tier)", adjusted font size and spacing (`TopBar.jsx`, `index.css`).
- Increased overall UI element sizes (fonts, padding, max-width) for a less cramped appearance (`index.css`).

### Fixed
- Final attempt to ensure message action buttons (Delete, Edit, Regenerate, Copy) are consistently functional.

## [0.3.1] - 2025-04-29
### Removed
- Removed DeepSeek V3 Base model from the available models list (`TopBar.jsx`).

### Changed
- Model descriptions are now always displayed below the model name in the dropdown, instead of on hover (`TopBar.jsx`, `index.css`).

### Fixed
- Attempted to fix message action buttons (Delete, Edit, Regenerate, Copy) functionality by verifying state, handlers, props, and JSX (`Chatbot.jsx`, `ChatMessages.jsx`).

## [0.3.0] - 2025-04-29
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

## [0.2.2] - 2025-04-29
### Added
- Model descriptions now appear as tooltips when hovering over models in the dropdown selector (`TopBar.jsx`, `index.css`).

### Changed
- Replaced previous DeepSeek models with a specific list of free OpenRouter DeepSeek models (`TopBar.jsx`).
- Removed the separate model info button and its tooltip (`TopBar.jsx`, `index.css`).
- Improved the visual style of the "New Chat" button in the chat list header (`index.css`).

### Fixed
- Addressed issue where the previous model info tooltip was not appearing on hover/click (by removing it).

## [0.2.1] - 2025-04-29
### Added
- Added model information tooltip next to the model selector in the top bar (`TopBar.jsx`, `index.css`).

### Changed
- Updated available models to only include DeepSeek Chat and DeepSeek Coder (`TopBar.jsx`).

### Fixed
- Replaced SVG with `FaPlus` icon for the "New Chat" button in the chat list header (`ChatList.jsx`).
- Fixed `ReferenceError: onNewChat is not defined` by adding the `onNewChat` prop to `ChatList` (`ChatList.jsx`