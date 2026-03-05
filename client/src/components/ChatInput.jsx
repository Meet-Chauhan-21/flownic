import { useRef, useEffect, useState } from "react";
import { Send, Plus, Mic } from "lucide-react";

const ChatInput = ({ onSendMessage, isLoading, sidebarOpen = true }) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = newHeight + "px";
    }
  }, [input]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={`chat-input-wrapper ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <div className="chat-input-container">
          {/* Left: Plus Icon */}
          <button
            type="button"
            className="input-icon-btn plus-btn"
            title="Attach file"
            disabled={isLoading}
          >
            <Plus size={20} />
          </button>

          {/* Center: Textarea */}
          <textarea
            ref={textareaRef}
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything"
            disabled={isLoading}
            rows="1"
          />

          {/* Right: Mic + Send Button */}
          <button
            type="button"
            className="input-icon-btn mic-btn"
            title="Voice input"
            disabled={isLoading}
          >
            <Mic size={20} />
          </button>

          <button
            type="submit"
            className={`send-button ${input.trim() ? "active" : "disabled"}`}
            disabled={!input.trim() || isLoading}
            title="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      </form>

      {/* Disclaimer Text */}
      <div className="input-disclaimer">
        AI can make mistakes. Check important info.
      </div>
    </div>
  );
};

export default ChatInput;
