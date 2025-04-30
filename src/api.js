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
 * Sends message history to the configured AI API and handles potential streaming.
 * @param {Array<{role: string, content: string}>} messages - The conversation history.
 * @param {string} [modelOverride] - Optional model ID to override the default.
 * @param {function(string): void} [onChunk] - Callback function to handle incoming stream chunks.
 * @param {function(): void} [onDone] - Callback function when the stream is finished.
 * @param {function(Error): void} [onError] - Callback function for stream errors.
 * @returns {Promise<string | void>} - If not streaming, returns the full response string. If streaming, returns void.
 * @throws {Error} If API is not configured or non-stream request fails.
 */
const sendMessage = async (messages, modelOverride, onChunk, onDone, onError) => {
    if (!apiConfigured) {
        const error = new Error("API is not configured. Please check environment variables.");
        if (onError) onError(error); else throw error;
        return;
    }

    const selectedModel = modelOverride || DEFAULT_MODEL;
    console.log(`Sending message to model: ${selectedModel} via ${apiUrl}`);

    const isStreaming = typeof onChunk === 'function';

    const body = JSON.stringify({
        model: selectedModel,
        messages: messages,
        stream: isStreaming, // Set stream based on callback presence
    });

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: body,
        });

        if (!response.ok) {
            let errorData;
            try { errorData = await response.json(); }
            catch (e) { errorData = { message: response.statusText || 'Failed to fetch' }; }
            console.error("API Error Response:", { status: response.status, body: errorData });
            let errorMessage = `API request failed with status ${response.status}.`;
            if (errorData?.error?.message) errorMessage += ` Details: ${errorData.error.message}`;
            else if (errorData?.message) errorMessage += ` Details: ${errorData.message}`;
            else if (typeof errorData === 'string') errorMessage += ` Details: ${errorData}`;
            const error = new Error(errorMessage);
            if (onError && isStreaming) onError(error); else throw error;
            return;
        }

        // Handle Streaming Response
        if (isStreaming && response.body) {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedContent = '';

            reader.read().then(function processText({ done, value }) {
                if (done) {
                    console.log("Stream complete.");
                    if (onDone) onDone();
                    return;
                }

                const chunk = decoder.decode(value, { stream: true });
                // Process potential Server-Sent Events (SSE) format from OpenRouter/OpenAI
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.substring(6);
                        if (dataStr === '[DONE]') {
                            // Stream finished signal
                        } else {
                            try {
                                const data = JSON.parse(dataStr);
                                const delta = data?.choices?.[0]?.delta?.content;
                                if (delta) {
                                    accumulatedContent += delta;
                                    onChunk(delta); // Send only the new chunk
                                }
                            } catch (e) {
                                console.error("Error parsing stream data line:", line, e);
                                // Don't stop the stream for one bad line, maybe?
                                if(onError) onError(new Error(`Error parsing stream data: ${e.message}`))
                            }
                        }
                    }
                }

                // Continue reading
                reader.read().then(processText).catch(streamError => {
                    console.error("Stream reading error:", streamError);
                    if (onError) onError(streamError);
                    if (onDone) onDone(); // Ensure onDone is called even on error
                });
            }).catch(initialReadError => {
                 console.error("Initial stream read error:", initialReadError);
                 if(onError) onError(initialReadError);
                 if (onDone) onDone();
            });
            
            return; // Return void for streaming calls

        } else if (!isStreaming) {
             // Handle Non-Streaming Response (as before)
            const data = await response.json();
            const content = data?.choices?.[0]?.message?.content;
            if (content === undefined || content === null) {
                console.error("Invalid API response format - missing content:", data);
                throw new Error("Received an invalid or empty response format from the API.");
            }
            return content.trim();
        }

    } catch (err) {
        console.error("API Fetch/Stream Error:", err);
        if (onError && isStreaming) onError(err); 
        else if (!isStreaming) throw err; // Re-throw non-streaming errors
        if (onDone && isStreaming) onDone(); // Ensure onDone on fetch errors too
    }
};

export default {
    sendMessage,
    isApiConfigured: () => apiConfigured,
    DEFAULT_MODEL
}; 