import React, { useState } from 'react';
import { ChatMessage, User } from '../../types';
import { X, Send, MessageSquare, ShieldCheck, UserCheck } from 'lucide-react';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  currentUser: User;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  currentUser,
}) => {
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-slate-900 shadow-2xl border-l border-slate-800 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-slate-100 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-bold">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-xs text-slate-100">Chat Interno da Clínica</h3>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
              <ShieldCheck className="h-3 w-3" /> Comunicação Privada
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-0.5">
                <span className="font-medium text-slate-300">{msg.senderName}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs shadow-sm ${
                  isMe
                    ? 'bg-emerald-500 text-slate-950 font-medium rounded-br-none'
                    : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input form */}
      <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Escreva uma mensagem para a equipe..."
          className="flex-1 rounded-full border border-slate-800 bg-slate-800 px-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <button
          type="submit"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors shrink-0"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
