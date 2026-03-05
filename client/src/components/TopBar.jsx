import { useState, useRef, useEffect } from "react";
import { ChevronDown, Share2, MoreVertical, PanelLeft } from "lucide-react";

const TopBar = ({ onToggleSidebar, sidebarOpen }) => {
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [selectedModel, setSelectedModel] = useState("GPT-4");
  const dropdownRef = useRef(null);

  const models = ["GPT-4", "GPT-3.5 Turbo", "Claude 3", "Gemini Pro"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowModelDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="chat-topbar">
      {/* Left: Sidebar Toggle + Model Selector */}
      <div className="topbar-left">
        <button 
          className="topbar-btn sidebar-toggle-btn" 
          onClick={onToggleSidebar}
          title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <PanelLeft size={20} />
        </button>

        <div className="model-selector" ref={dropdownRef}>
          <button
            className="model-button"
            onClick={() => setShowModelDropdown(!showModelDropdown)}
          >
            <span className="model-name">{selectedModel}</span>
            <ChevronDown size={18} />
          </button>

          {showModelDropdown && (
            <div className="model-dropdown">
              {models.map((model) => (
                <button
                  key={model}
                  className={`model-option ${model === selectedModel ? "active" : ""}`}
                  onClick={() => {
                    setSelectedModel(model);
                    setShowModelDropdown(false);
                  }}
                >
                  {model}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Action Buttons */}
      <div className="topbar-actions">
        <button className="topbar-btn" title="Share conversation">
          <Share2 size={20} />
        </button>
        <button className="topbar-btn" title="More options">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
