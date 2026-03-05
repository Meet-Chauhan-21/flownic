import { motion } from "framer-motion";

const EmptyState = ({ onSuggestionClick }) => {
  const suggestions = [
    "Write a poem",
    "Explain quantum computing",
    "Help me debug code",
    "Plan a trip"
  ];

  return (
    <motion.div
      className="empty-state"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="empty-heading">What can I help with?</h1>
      <div className="suggestion-cards">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            className="suggestion-card"
            onClick={() => onSuggestionClick(suggestion)}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {suggestion}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default EmptyState;
