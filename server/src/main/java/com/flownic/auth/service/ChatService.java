package com.flownic.auth.service;

import com.flownic.auth.dto.ChatMessageRequest;
import com.flownic.auth.dto.ChatMessageResponse;
import com.flownic.auth.dto.ConversationResponse;
import com.flownic.auth.model.ChatMessage;
import com.flownic.auth.model.Conversation;
import com.flownic.auth.model.User;
import com.flownic.auth.repository.ChatMessageRepository;
import com.flownic.auth.repository.ConversationRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ChatService {
    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository chatMessageRepository;

    public ChatService(ConversationRepository conversationRepository,
                      ChatMessageRepository chatMessageRepository) {
        this.conversationRepository = conversationRepository;
        this.chatMessageRepository = chatMessageRepository;
    }

    public Conversation createConversation(User user, String firstMessage) {
        Conversation conversation = new Conversation();
        conversation.setUser(user);
        conversation.setTitle(truncateTitle(firstMessage));
        return conversationRepository.save(conversation);
    }

    public ChatMessageResponse sendMessage(User user, String conversationId, String message) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));

        if (!conversation.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Unauthorized access to conversation");
        }

        // Save user message
        ChatMessage userMessage = new ChatMessage(conversationId, "user", message);
        chatMessageRepository.save(userMessage);

        // Generate and save bot response
        String botReply = generateBotResponse(message);
        ChatMessage botMessage = new ChatMessage(conversationId, "assistant", botReply);
        chatMessageRepository.save(botMessage);

        // Update conversation timestamp
        conversation.setUpdatedAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        return mapToResponse(botMessage);
    }

    public ConversationResponse getConversation(User user, String conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));

        if (!conversation.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Unauthorized access to conversation");
        }

        return mapConversationToResponse(conversation);
    }

    public List<ConversationResponse> getUserConversations(User user) {
        List<Conversation> conversations = conversationRepository.findByUserIdOrderByUpdatedAtDesc(user.getId());
        return conversations.stream()
                .map(this::mapConversationToResponse)
                .collect(Collectors.toList());
    }

    public void deleteConversation(User user, String conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));

        if (!conversation.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Unauthorized access to conversation");
        }

        // Delete all messages in this conversation
        List<ChatMessage> messages = chatMessageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
        chatMessageRepository.deleteAll(messages);
        
        // Delete conversation
        conversationRepository.deleteById(conversationId);
    }

    public void renameConversation(User user, String conversationId, String newTitle) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));

        if (!conversation.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Unauthorized access to conversation");
        }

        conversation.setTitle(newTitle);
        conversationRepository.save(conversation);
    }

    private String generateBotResponse(String userMessage) {
        // Dummy/static responses for now
        String lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.contains("hello") || lowerMessage.contains("hi")) {
            return "Hello! How can I assist you today?";
        } else if (lowerMessage.contains("help")) {
            return "I'm here to help! Feel free to ask me anything or give me a task to help with.";
        } else if (lowerMessage.contains("how are you")) {
            return "I'm doing great, thank you for asking! How can I help you?";
        } else if (lowerMessage.contains("thanks") || lowerMessage.contains("thank you")) {
            return "You're welcome! Is there anything else I can help you with?";
        } else {
            return "That's interesting! Tell me more about what you'd like to explore.";
        }
    }

    private String truncateTitle(String message) {
        if (message.length() > 50) {
            return message.substring(0, 47) + "...";
        }
        return message;
    }

    private ChatMessageResponse mapToResponse(ChatMessage message) {
        return new ChatMessageResponse(
                message.getId(),
                message.getRole(),
                message.getContent(),
                message.getCreatedAt()
        );
    }

    private ConversationResponse mapConversationToResponse(Conversation conversation) {
        List<ChatMessage> messages = chatMessageRepository.findByConversationIdOrderByCreatedAtAsc(conversation.getId());
        List<ChatMessageResponse> messageResponses = messages.stream()
                .map(msg -> new ChatMessageResponse(
                        msg.getId(),
                        msg.getRole(),
                        msg.getContent(),
                        msg.getCreatedAt()
                ))
                .collect(Collectors.toList());

        return new ConversationResponse(
                conversation.getId(),
                conversation.getTitle(),
                messageResponses,
                conversation.getCreatedAt(),
                conversation.getUpdatedAt()
        );
    }
}
