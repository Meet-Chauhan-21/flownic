import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, ThumbsUp, ThumbsDown, Share2, RotateCcw, MoreHorizontal, Edit2 } from "lucide-react";

const MessageBubble = ({ message, onEdit, onCopy, onRegenerate }) => {
  const isUser = message.role === "user";
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.content);
  const [showUserActions, setShowUserActions] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editedText.trim() && onEdit) {
      onEdit(message.id, editedText);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedText(message.content);
    setIsEditing(false);
  };

  return (
    <motion.div
      className={`message-wrapper ${isUser ? "user-wrapper" : "ai-wrapper"}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => isUser && setShowUserActions(true)}
      onMouseLeave={() => setShowUserActions(false)}
    >
      {isUser ? (
        /* User Message with actions below */
        <div className="user-message-container">
          {/* Message Content */}
          <div className={`message-bubble user`}>
            {isEditing ? (
              <div className="edit-container">
                <textarea
                  className="edit-textarea"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  autoFocus
                />
                <div className="edit-actions">
                  <button
                    className="edit-btn save"
                    onClick={handleSaveEdit}
                  >
                    Save
                  </button>
                  <button
                    className="edit-btn cancel"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <span>{message.content}</span>
            )}
          </div>

          {/* User Message Actions Below Bubble */}
          {showUserActions && !isEditing && (
            <motion.div
              className="message-user-actions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <button
                className="action-icon-btn"
                onClick={handleEdit}
                title="Edit message"
              >
                <Edit2 size={14} />
              </button>
              <button
                className="action-icon-btn"
                onClick={handleCopy}
                title="Copy message"
              >
                <Copy size={14} />
              </button>
            </motion.div>
          )}
        </div>
      ) : (
        /* AI Message with always visible actions */
        <div className="ai-message-container">
          {/* Message Content */}
          <div className={`message-bubble ai`}>
            <span>{message.content}</span>
          </div>

          {/* AI Message Action Icons - Always Visible */}
          <div className="message-actions">
            <button
              className="action-icon-btn"
              title="Copy"
              onClick={handleCopy}
            >
              <Copy size={16} />
            </button>
            <button className="action-icon-btn" title="Like">
              <ThumbsUp size={16} />
            </button>
            <button className="action-icon-btn" title="Dislike">
              <ThumbsDown size={16} />
            </button>
            <button className="action-icon-btn" title="Share">
              <Share2 size={16} />
            </button>
            <button
              className="action-icon-btn"
              title="Regenerate"
              onClick={() => onRegenerate && onRegenerate(message.id)}
            >
              <RotateCcw size={16} />
            </button>
            <button className="action-icon-btn" title="More">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Copied Tooltip */}
      {copied && (
        <motion.div
          className="copy-tooltip"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          Copied!
        </motion.div>
      )}
    </motion.div>
  );
};

export default MessageBubble;
