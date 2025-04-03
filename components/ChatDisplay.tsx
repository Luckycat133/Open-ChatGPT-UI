import { Message } from '../types';

type ChatDisplayProps = {
  messages: Message[];
};

export default function ChatDisplay({ messages }: ChatDisplayProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div 
          key={index} 
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div 
            className={`max-w-3/4 px-4 py-2 rounded-lg ${message.role === 'user' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-800'}`}
          >
            {message.content}
          </div>
        </div>
      ))}
    </div>
  );
}