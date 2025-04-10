import React, { useState } from 'react';

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

  // Placeholder icons (replace with actual SVGs or an icon library later)
  const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
  const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  );
  const LightBulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-7.5 0m7.5 0a12.06 12.06 0 0 0-7.5 0M12 4.5A6 6 0 0 1 18 10.5c0 1.604-.415 3.115-1.189 4.368M6 10.5A6 6 0 0 1 12 4.5c0 1.604.415 3.115 1.189 4.368m0 0a6.037 6.037 0 0 1-6.147 0M12 18.75a.75.75 0 0 1-.75-.75V16.5a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-.75.75Z" />
    </svg>
  );
    const EllipsisHorizontalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>
    );
  const MicrophoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
    </svg>
  );
  const SpeakerWaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
    </svg>
  );


  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex items-center border border-gray-300 rounded-md p-1 bg-white shadow-sm">
        {/* Decorative squares on the left */}
        <div className="flex space-x-1 mr-2">
          <div className="w-4 h-6 border border-gray-300 rounded-sm bg-gray-100"></div>
          <div className="w-4 h-6 border border-gray-300 rounded-sm bg-gray-100"></div>
          <div className="w-4 h-6 border border-gray-300 rounded-sm bg-gray-100"></div>
          <div className="w-4 h-6 border border-gray-300 rounded-sm bg-gray-100"></div>
        </div>
        <input
          type="text"
          value={message}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-white focus:outline-none text-black placeholder-gray-500 text-sm md:text-base py-1 px-2"
          placeholder="Ask anything"
          autoFocus
        />
        {/* Decorative squares on the right */}
        <div className="flex space-x-1 ml-2">
            <div className="w-4 h-6 border border-gray-300 rounded-sm bg-gray-100"></div>
            <div className="w-4 h-6 border border-gray-300 rounded-sm bg-gray-100"></div>
        </div>
      </div>
    </form>
  );
}