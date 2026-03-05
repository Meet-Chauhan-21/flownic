import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import UserAccountMenu from "./UserAccountMenu.jsx";
import { getChatHistory, deleteConversation, renameConversation } from "../services/authService.js";

const Sidebar = ({ user, onNewChat, onSelectChat, activeConversationId, isMobileOpen, onCloseMobile, sidebarOpen = true }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renamingId, setRenamingId] = useState(null);
  const [renamingTitle, setRenamingTitle] = useState("");

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await getChatHistory();
      setConversations(data);
    } catch (err) {
      console.error("Failed to load chat history:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (conversationId, e) => {
    e.stopPropagation();
    if (confirm("Delete this conversation?")) {
      try {
        await deleteConversation(conversationId);
        setConversations(conversations.filter((c) => c.id !== conversationId));
      } catch (err) {
        console.error("Failed to delete conversation:", err);
      }
    }
  };

  const handleRename = async (conversationId, e) => {
    e.stopPropagation();
    if (renamingTitle.trim()) {
      try {
        await renameConversation(conversationId, renamingTitle);
        setConversations(
          conversations.map((c) =>
            c.id === conversationId ? { ...c, title: renamingTitle } : c
          )
        );
        setRenamingId(null);
      } catch (err) {
        console.error("Failed to rename conversation:", err);
      }
    }
  };

  const handleSelectChat = (conversation) => {
    onSelectChat(conversation);
    onCloseMobile();
  };

  const handleNewChat = () => {
    onNewChat();
    onCloseMobile();
  };

  const groupConversationsByDate = (conversations) => {
    const groups = {
      Today: [],
      Yesterday: [],
      "Previous 7 days": [],
      Older: [],
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    conversations.forEach((conversation) => {
      const convDate = new Date(conversation.updatedAt);
      const convDateOnly = new Date(convDate.getFullYear(), convDate.getMonth(), convDate.getDate());

      if (convDateOnly.getTime() === today.getTime()) {
        groups.Today.push(conversation);
      } else if (convDateOnly.getTime() === yesterday.getTime()) {
        groups.Yesterday.push(conversation);
      } else if (convDateOnly > sevenDaysAgo) {
        groups["Previous 7 days"].push(conversation);
      } else {
        groups.Older.push(conversation);
      }
    });

    return groups;
  };

  const groupedConversations = groupConversationsByDate(conversations);

  return (
    <motion.aside
      className={`sidebar ${isMobileOpen ? "mobile-open" : ""} ${sidebarOpen ? "" : "collapsed"}`}
      initial={false}
      animate={{ 
        width: sidebarOpen ? 260 : 0,
        opacity: sidebarOpen ? 1 : 0
      }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="sidebar-header">
        <div className="logo">Flownic</div>
        <motion.button
          className="new-chat-button"
          onClick={handleNewChat}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} />
          New Chat
        </motion.button>
      </div>

      <div className="sidebar-content">
        {loading ? (
          <div className="loading-text">Loading chats...</div>
        ) : conversations.length === 0 ? (
          <div className="empty-text">No conversations yet</div>
        ) : (
          <>
            {Object.entries(groupedConversations).map(
              ([dateGroup, items]) =>
                items.length > 0 && (
                  <div key={dateGroup} className="conversation-group">
                    <h3 className="group-title">{dateGroup}</h3>
                    <div>
                      {items.map((conversation) => (
                        <motion.div
                          key={conversation.id}
                          className={`conversation-item ${
                            activeConversationId === conversation.id ? "active" : ""
                          }`}
                          onClick={() => handleSelectChat(conversation)}
                          layoutId={conversation.id}
                          whileHover={{ x: 5 }}
                        >
                          {renamingId === conversation.id ? (
                            <input
                              type="text"
                              className="rename-input"
                              value={renamingTitle}
                              onChange={(e) => setRenamingTitle(e.target.value)}
                              onBlur={() => handleRename(conversation.id, {})}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleRename(conversation.id, {});
                                } else if (e.key === "Escape") {
                                  setRenamingId(null);
                                }
                              }}
                              onClick={(e) => e.stopPropagation()}
                              autoFocus
                            />
                          ) : (
                            <>
                              <span className="conversation-title">{conversation.title}</span>
                              <div className="conversation-actions">
                                <button
                                  className="action-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setRenamingId(conversation.id);
                                    setRenamingTitle(conversation.title);
                                  }}
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  className="action-btn delete"
                                  onClick={(e) => handleDelete(conversation.id, e)}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )
            )}
          </>
        )}
      </div>

      <div className="sidebar-footer">
        <UserAccountMenu user={user} />
      </div>
    </motion.aside>
  );
};

export default Sidebar;
