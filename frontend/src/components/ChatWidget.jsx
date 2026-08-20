import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { marked } from 'marked';
import { FiMessageSquare, FiX, FiSend, FiArrowRight } from 'react-icons/fi';
import { BiBot } from 'react-icons/bi';
import { BsStars } from 'react-icons/bs';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I am Rouhalah's AI assistant. Ask me anything about his machine learning research, full-stack projects, or technical skills!", isHtml: false }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input.trim(), isHtml: false };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const url = '/api/chat';
      const response = await axios.post(url, {
        message: userMessage.content,
        history: messages,
        is_demo: false,
        demo_name: ""
      });
      
      const reply = response.data.reply;
      let formattedReply = reply;
      try {
        formattedReply = marked.parse(reply).replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');
      } catch (err) {
        formattedReply = reply;
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: formattedReply, isHtml: true }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "❌ Could not connect to AI service. Feel free to reach out via Email or Telegram!", isHtml: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    "What are your top AI projects?",
    "Tell me about your Master's thesis",
    "How can I contact you?"
  ];

  return (
    <>
      {/* 1. MOBILE FULL-WIDTH BOTTOM STICKY ACTION BAR (< 640px) */}
      {!isOpen && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/85 backdrop-blur-lg border-t border-slate-200/80 shadow-[0_-8px_25px_-5px_rgba(0,0,0,0.08)] font-sans">
          <button 
            onClick={() => setIsOpen(true)}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-500/25 flex items-center justify-between active:scale-[0.98] transition-all duration-200"
            aria-label="Open AI Chatbot"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white flex-shrink-0">
                <BiBot className="text-xl animate-pulse" />
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="text-xs font-bold leading-tight truncate">Chat with AI Assistant</span>
                <span className="text-[10px] text-purple-200 font-normal truncate">Ask about projects & thesis</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] bg-white/20 px-2.5 py-1 rounded-xl font-semibold backdrop-blur-sm flex-shrink-0">
              <BsStars className="text-xs text-yellow-300" />
              <span>Ask AI</span>
            </div>
          </button>
        </div>
      )}

      {/* 2. DESKTOP FLOATING CIRCULAR BUTTON (>= 640px) */}
      {!isOpen && (
        <div className="hidden sm:block fixed bottom-8 right-8 z-40 font-sans">
          <button 
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 group"
            aria-label="Open AI Assistant"
          >
            <FiMessageSquare className="text-2xl group-hover:scale-110 transition-transform" />
          </button>
        </div>
      )}

      {/* 3. CHAT WINDOW MODAL */}
      {isOpen && (
        <>
          {/* Backdrop on mobile for easy dismissal */}
          <div 
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 sm:hidden"
          />

          <div className="fixed inset-x-2 bottom-2 sm:inset-auto sm:bottom-8 sm:right-8 z-50 flex items-end sm:items-auto justify-center sm:justify-end pointer-events-none font-sans">
            <div className="w-full sm:w-[380px] max-w-full h-[85vh] sm:h-[530px] max-h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200/90 pointer-events-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-3.5 sm:py-4 flex justify-between items-center flex-shrink-0 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                    <BiBot className="text-2xl" />
                  </div>
                  <div>
                    <div className="font-bold text-sm leading-tight">Rouhalah's AI Assistant</div>
                    <div className="text-[11px] text-purple-200 font-medium mt-0.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      RAG & Knowledge Base
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
                  aria-label="Close Chat"
                >
                  <FiX className="text-lg" />
                </button>
              </div>

              {/* Messages Feed */}
              <div className="flex-1 p-4 bg-slate-50 overflow-y-auto flex flex-col gap-3.5">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div 
                      className={`max-w-[88%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs break-words ${
                        msg.role === 'user' 
                          ? 'bg-purple-600 text-white rounded-br-none' 
                          : 'bg-white text-slate-800 rounded-bl-none border border-slate-200/70'
                      }`}
                    >
                      {msg.role !== 'user' && (
                        <div className="text-[11px] font-bold text-purple-600 mb-1 flex items-center gap-1">
                          <BiBot /> AI Assistant
                        </div>
                      )}
                      {msg.isHtml ? (
                        <div dangerouslySetInnerHTML={{ __html: msg.content }} className="prose prose-xs max-w-none text-slate-800" />
                      ) : (
                        <div>{msg.content}</div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex flex-col items-start">
                    <div className="p-3.5 rounded-2xl text-sm shadow-xs bg-white text-slate-800 rounded-bl-none border border-slate-200/70">
                      <div className="text-[11px] font-bold text-purple-600 mb-1 flex items-center gap-1">
                        <BiBot /> AI Assistant
                      </div>
                      <div className="flex gap-1.5 py-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Prompts */}
                {messages.length === 1 && (
                  <div className="pt-2 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-1">Suggested Questions:</span>
                    {quickQuestions.map((q, qIdx) => (
                      <button
                        key={qIdx}
                        onClick={() => {
                          setInput(q);
                        }}
                        className="w-full text-left text-xs bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 p-2.5 rounded-xl border border-slate-200/80 transition-colors shadow-xs"
                      >
                        💡 {q}
                      </button>
                    ))}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Footer Input */}
              <form onSubmit={sendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2 items-center flex-shrink-0">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask a question..." 
                  className="flex-1 bg-slate-100 focus:bg-white px-4 py-2.5 rounded-full text-xs sm:text-sm outline-none focus:ring-2 focus:ring-purple-300 border border-transparent focus:border-purple-200 transition-all text-slate-800"
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !input.trim()}
                  className="bg-purple-600 hover:bg-purple-700 text-white w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-40 transition shadow-sm flex-shrink-0"
                  aria-label="Send message"
                >
                  <FiSend className="text-sm ml-0.5" />
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};
