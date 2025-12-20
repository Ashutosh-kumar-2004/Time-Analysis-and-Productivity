import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  X,
  Send,
  RefreshCw,
  Minus,
  Loader2,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! I'm your productivity assistant. How can I help you today?",
      sender: "bot",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
    {
      id: 2,
      text: "You can ask me about your focus trends and suggesstions.",
      sender: "bot",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimzeChat = (e) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Prepare history for API (basic context)
      // Filter only last few messages for context to keep it lightweight if needed,
      // or map all. Gemini expects 'user' and 'model'.
      const history = messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        text: msg.text,
      }));

      const token = localStorage.getItem("token"); // Assuming auth needed if middleware is applied

      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: input,
          history: history,
        }),
      });

      const textData = await res.text();
      let data;
      try {
        data = JSON.parse(textData);
      } catch (e) {
        console.error("Failed to parse JSON response:", textData);
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: data.text,
          sender: "bot",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Sorry, I encountered an error. Please try again.",
          sender: "bot",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div
          className={`mb-4 w-[350px] bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 transform origin-bottom-right ${
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          {/* Header */}
          <div className="bg-purple-600 p-4 flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Productivity Bot</h3>
                <span className="text-xs text-purple-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></span>
                  Online
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                <RefreshCw size={18} />
              </button>
              <button
                onClick={minimzeChat}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
              >
                <Minus size={18} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-4 bg-gray-50 dark:bg-[#11111d] space-y-4">
            <div className="text-center text-xs text-gray-400 my-2">
              Oct 15, 2024
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-2 text-purple-600 dark:text-purple-400 flex-shrink-0">
                    <MessageCircle size={16} />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
                    msg.sender === "user"
                      ? "bg-purple-600 text-white rounded-tr-none"
                      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`text-[10px] mt-1 block text-right ${
                      msg.sender === "user"
                        ? "text-purple-200"
                        : "text-gray-400"
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-2 text-purple-600 dark:text-purple-400">
                  <MessageCircle size={16} />
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                  <span className="text-xs text-gray-500 ml-2">
                    Thinking...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-[#1a1a2e] border-t border-gray-100 dark:border-gray-700">
            {/* Quick Replies (Optional Demo) */}
            <div className="flex space-x-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
              <button className="whitespace-nowrap px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-xs rounded-full border border-purple-100 dark:border-purple-800 hover:bg-purple-100 transition-colors">
                Yes, sure!
              </button>
              <button className="whitespace-nowrap px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-xs rounded-full border border-purple-100 dark:border-purple-800 hover:bg-purple-100 transition-colors">
                Tell me about analysis
              </button>
            </div>

            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter message..."
                className="w-full pl-4 pr-12 py-3 bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="absolute right-2 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            </form>
            <div className="text-center mt-2">
              <span className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                Powered by{" "}
                <span className="font-bold text-gray-600 dark:text-gray-300">
                  Productivity Tracker
                </span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 animate-bounce-subtle"
        >
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
