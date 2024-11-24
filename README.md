# Gemini Text Helper

A powerful browser extension that leverages Google's Gemini AI for multilingual text processing. Perfect for translating and summarizing text across multiple languages with just a few clicks.

## Features

- **Multilingual Support**: Supports 11 languages including:
  - English
  - Turkish (Türkçe)
  - Spanish (Español)
  - French (Français)
  - German (Deutsch)
  - Italian (Italiano)
  - Portuguese (Português)
  - Russian (Русский)
  - Japanese (日本語)
  - Korean (한국어)
  - Chinese (中文)

- **Text Processing**:
  - Translate selected text to your preferred language
  - Generate summaries in your chosen language
  - Context menu integration for easy access

- **User-Friendly Interface**:
  - Simple popup interface for settings
  - Dynamic language selection
  - Persistent result display with copy functionality
  - Native language UI elements

## Installation

1. Clone this repository or download the source code
2. Open your Chromium-based browser (Chrome/Brave) and go to `chrome://extensions`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension directory

## Setup

1. Get your Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click the extension icon in your browser
3. Enter your API key and save
4. Select your preferred language
5. Start using the extension!

## Usage

1. Select any text on a webpage
2. Right-click to open the context menu
3. Choose "Gemini Text Helper" and select either:
   - Translate to [Selected Language]
   - Summarize in [Selected Language]
4. View the result in the persistent display box
5. Use the copy button to copy the result to clipboard

## Security

- Your API key is stored securely in the browser's sync storage
- No data is stored on external servers
- Minimal permissions required for operation

## Development

### Prerequisites
- Chromium-based browser (Chrome/Brave)
- Google Gemini API key
- Basic knowledge of JavaScript and browser extensions

### Project Structure
- `manifest.json`: Extension configuration
- `background.js`: Background scripts and context menu handling
- `popup.html/js`: Extension popup interface
- `content.js`: Content script for webpage interaction

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
