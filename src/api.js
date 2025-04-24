// src/api.js

// Read environment variables (Vite specific)
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENAI_API_BASE_URL = import.meta.env.VITE_OPENAI_API_BASE_URL;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY; // Might be 'none', 'ollama', etc.
const DEFAULT_MODEL = import.meta.env.VITE_DEFAULT_MODEL || 'openai/gpt-4o'; // Fallback model

// Determine which API configuration to use
const useOpenRouter = OPENROUTER_API_KEY && !OPENAI_API_BASE_URL;
const useOpenAICompatible = OPENAI_API_BASE_URL;

let apiUrl = '';
let apiKey = '';
let headers = {
    'Content-Type': 'application/json',
};
let apiConfigured = false;

if (useOpenRouter) {
    console.info("Using OpenRouter API");
    apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    apiKey = OPENROUTER_API_KEY;
    headers['Authorization'] = `Bearer ${apiKey}`;
    // OpenRouter specific headers (optional)
    // Use conditional logic to avoid sending localhost if not desired
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        headers['HTTP-Referer'] = window.location.origin;
    }
    // headers['X-Title'] = 'Your App Name'; // Optional: Replace with your app name
    apiConfigured = true;
} else if (useOpenAICompatible) {
    console.info("Using OpenAI-Compatible API:", OPENAI_API_BASE_URL);
    // Ensure base URL does not end with /v1 or /v1/ before appending /chat/completions
    const cleanedBaseUrl = OPENAI_API_BASE_URL.replace(/\/v1\/?$|\/?$/, '');
    apiUrl = `${cleanedBaseUrl}/v1/chat/completions`;
    apiKey = OPENAI_API_KEY || 'none'; // Default to 'none' if not provided
    if (apiKey && apiKey.toLowerCase() !== 'none' && apiKey.trim() !== '') { // Don't add Auth header if key is 'none' or empty
       headers['Authorization'] = `Bearer ${apiKey}`;
    }
     apiConfigured = true;
} else {
    console.error("API Configuration Error: No API key or base URL provided in .env file. Please configure VITE_OPENROUTER_API_KEY or both VITE_OPENAI_API_BASE_URL and VITE_OPENAI_API_KEY.");
    // Display error to user? Maybe in the Chatbot component.
}


/**
 * Sends message history to the configured AI API.
 * @param {Array<{role: string, content: string}>} messages - The conversation history.
 * @param {string} [modelOverride] - Optional model ID to override the default.
 * @returns {Promise<string>} - The AI's response content.
 * @throws {Error} If API is not configured or request fails.
 */
const sendMessage = async (messages, modelOverride) => {
    if (!apiConfigured) {
        console.error("API call attempted but API is not configured.");
        throw new Error("API is not configured. Please check your environment variables (.env file) and console logs.");
    }

    // Use override if provided, otherwise use the default from .env or the fallback
    const selectedModel = modelOverride || DEFAULT_MODEL;
    console.log(`Sending message to model: ${selectedModel} via ${apiUrl}`);

    const body = JSON.stringify({
        model: selectedModel,
        messages: messages,
        // stream: true, // Enable later for streaming responses
    });

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: body,
        });

        if (!response.ok) {
            // Attempt to read error details from the response body
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                // If response is not JSON or empty
                errorData = { message: response.statusText || 'Failed to fetch' };
            }
            console.error("API Error Response:", { status: response.status, body: errorData });
            // Construct a more informative error message
            let errorMessage = `API request failed with status ${response.status}.`;
            if (errorData?.error?.message) {
                errorMessage += ` Details: ${errorData.error.message}`;
            } else if (errorData?.message) {
                 errorMessage += ` Details: ${errorData.message}`;
            } else if (typeof errorData === 'string') { // Handle plain text errors
                errorMessage += ` Details: ${errorData}`;
            }
            throw new Error(errorMessage);
        }

        // If response is OK, proceed to parse JSON
        const data = await response.json();

        // Extract the response content (using optional chaining for safety)
        const content = data?.choices?.[0]?.message?.content;

        if (content === undefined || content === null) {
             console.error("Invalid API response format - missing content:", data);
            throw new Error("Received an invalid or empty response format from the API.");
        }
        return content.trim(); // Trim whitespace from response

    } catch (error) {
        console.error("Error during sendMessage fetch:", error);
        // Re-throw the error with potentially more context or keep original
        throw error instanceof Error ? error : new Error('An unknown error occurred during the API call.');
    }
};

export default {
    sendMessage,
    isApiConfigured: () => apiConfigured, // Export a function to check configuration status
    DEFAULT_MODEL // Export the default model ID
}; 