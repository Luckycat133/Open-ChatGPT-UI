import { useState } from 'react';

type ChatInputProps = {
  onSendMessage: (message: string) => void;
};

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[280px] sm:w-[350px] md:w-[400px] lg:w-[450px] transition-all duration-200 ease-in-out hover:scale-[1.02]">
      <div className="flex items-center space-x-3 bg-white rounded-xl shadow-lg px-4 py-3 border border-gray-100 hover:border-gray-200 transition-all duration-200">
        <button
          type="button"
          className="p-1.5 text-gray-400 hover:text-gray-600 focus:outline-none transition-all duration-200 hover:scale-110"
          title="Attach"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
          </svg>
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent focus:outline-none text-gray-800 placeholder-gray-400 text-sm md:text-base py-1.5 transition-colors duration-200"
          placeholder="Message ChatGPT"
          autoFocus
        />
        <button
          type="submit"
          className="p-1.5 text-gray-400 hover:text-gray-600 focus:outline-none transition-all duration-200 hover:scale-110"
          title="Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </form>
  );
}