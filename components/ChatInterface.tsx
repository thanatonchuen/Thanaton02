import React, { useState, useRef, useEffect } from 'react';
import { AggregateMetrics, Platform, ChatMessage } from '../types';
import { sendChatMessage } from '../services/geminiService';
import { Loader2, Send } from 'lucide-react';

interface ChatInterfaceProps {
  metrics: AggregateMetrics;
  platform: Platform;
  dateRange: { start: string, end: string };
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ metrics, platform, dateRange }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    const newHistory = [...messages, userMsg];
    
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendChatMessage(userMsg.text, messages, { metrics, platform, dateRange });
      setMessages(prev => [...prev, { role: 'model', text: responseText, timestamp: Date.now() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error.", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-4 border border-gray-100 dark:border-slate-700 flex flex-col h-[500px]">
      <h3 className="font-semibold mb-3 text-gray-800 dark:text-white">Chat Assistant</h3>
      <div className="flex-1 overflow-y-auto mb-3 space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-600">
        {messages.length === 0 && (
           <div className="text-center text-gray-400 dark:text-slate-500 text-sm mt-10">
             Ask me anything about your social media performance.
           </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`p-3 rounded-xl text-sm max-w-[85%] ${
            msg.role === 'user' 
              ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-200 self-end ml-auto rounded-tr-sm' 
              : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-200 self-start mr-auto rounded-tl-sm'
          }`}>
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 self-start mr-auto rounded-xl rounded-tl-sm p-3 w-12 flex justify-center">
            <Loader2 size={16} className="animate-spin" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-slate-700">
        <input 
          type="text" 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          className="flex-1 p-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-md text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder-gray-400 dark:placeholder-slate-500"
          placeholder="Type a message..."
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
        />
        <button 
          onClick={handleSend} 
          disabled={!input.trim() || isLoading}
          className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};