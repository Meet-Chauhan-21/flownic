import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/Sidebar.jsx";
import TopBar from "../components/TopBar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import ChatInput from "../components/ChatInput.jsx";
import EmptyState from "../components/EmptyState.jsx";
import {
  getMe,
  createNewChat,
  sendChatMessage,
  getConversation,
} from "../services/authService.js";

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load user info
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getMe();
        setUser(userData);
      } catch (err) {
        console.error("Failed to load user:", err);
        navigate("/auth");
      } finally {
        setPageLoading(false);
      }
    };

    loadUser();
  }, [navigate]);

  // Handle sending a new message
  const handleSendMessage = async (messageText) => {
    try {
      setIsLoading(true);

      if (!activeConversation) {
        // Create new conversation and send first message
        const response = await createNewChat(messageText);
        const userMessage = {
          id: "temp-user",
          role: "user",
          content: messageText,
        };
        setMessages([userMessage, response.messages[response.messages.length - 1]]);
        setActiveConversation(response);
      } else {
        // Add user message immediately
        const userMessage = {
          id: "user-" + Date.now(),
          role: "user",
          content: messageText,
        };
        setMessages((prev) => [...prev, userMessage]);

        // Send message and get response
        const response = await sendChatMessage(
          activeConversation.id,
          messageText
        );
        setMessages((prev) => [...prev, response]);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle selecting a conversation
  const handleSelectChat = async (conversation) => {
    try {
      setIsLoading(true);
      const fullConversation = await getConversation(conversation.id);
      setActiveConversation(fullConversation);
      setMessages(fullConversation.messages || []);
    } catch (err) {
      console.error("Failed to load conversation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle new chat
  const handleNewChat = () => {
    setActiveConversation(null);
    setMessages([]);
  };

  // Handle sidebar toggle
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle message edit
  const handleEditMessage = (messageId, newContent) => {
    console.log("Edit message:", messageId, newContent);
    // TODO: Implement message editing API
  };

  // Handle regenerate
  const handleRegenerate = (messageId) => {
    console.log("Regenerate:", messageId);
    // TODO: Implement regenerate functionality
  };

  if (pageLoading || !user) {
    return (
      <div className="page center">
        <div className="card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-layout">
      {/* Mobile menu toggle */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar overlay for mobile */}
      {mobileMenuOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        user={user}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        activeConversationId={activeConversation?.id}
        isMobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        sidebarOpen={sidebarOpen}
      />

      {/* Main chat area */}
      <div className={`chat-main ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
        <TopBar onToggleSidebar={handleToggleSidebar} sidebarOpen={sidebarOpen} />

        {activeConversation ? (
          <>
            <ChatWindow
              messages={messages}
              isLoading={isLoading}
              onEditMessage={handleEditMessage}
              onRegenerate={handleRegenerate}
            />
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} sidebarOpen={sidebarOpen} />
          </>
        ) : (
          <>
            <EmptyState onSuggestionClick={handleSendMessage} />
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} sidebarOpen={sidebarOpen} />
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
