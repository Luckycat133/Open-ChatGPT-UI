import { Message } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type ChatDisplayProps = {
  messages: Message[];
};

export default function ChatDisplay({ messages }: ChatDisplayProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.map((message, index) => (
        <div 
          key={index} 
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
        >
          <div 
            className={`max-w-3/4 px-5 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 ${message.role === 'user' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white text-gray-800 border border-gray-100'}`}
          >
            {message.role === 'assistant' ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            ) : (
              message.content
            )}
          </div>
        </div>
      ))}
    </div>
  );
}