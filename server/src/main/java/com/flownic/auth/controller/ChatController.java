package com.flownic.auth.controller;

import com.flownic.auth.dto.ApiResponse;
import com.flownic.auth.dto.ChatMessageRequest;
import com.flownic.auth.dto.ChatMessageResponse;
import com.flownic.auth.dto.ConversationResponse;
import com.flownic.auth.model.Conversation;
import com.flownic.auth.model.User;
import com.flownic.auth.service.AuthService;
import com.flownic.auth.service.ChatService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    private final ChatService chatService;
    private final AuthService authService;

    public ChatController(ChatService chatService, AuthService authService) {
        this.chatService = chatService;
        this.authService = authService;
    }

    @PostMapping("/new")
    public ResponseEntity<ConversationResponse> createNewChat(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChatMessageRequest request
    ) {
        User user = authService.getUserByEmail(userDetails.getUsername());
        Conversation conversation = chatService.createConversation(user, request.getMessage());
        
        ChatMessageResponse response = chatService.sendMessage(user, conversation.getId(), request.getMessage());
        
        ConversationResponse conversationResponse = chatService.getConversation(user, conversation.getId());
        return ResponseEntity.ok(conversationResponse);
    }

    @PostMapping("/{conversationId}/message")
    public ResponseEntity<ChatMessageResponse> sendMessage(
            @PathVariable String conversationId,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChatMessageRequest request
    ) {
        User user = authService.getUserByEmail(userDetails.getUsername());
        ChatMessageResponse response = chatService.sendMessage(user, conversationId, request.getMessage());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{conversationId}")
    public ResponseEntity<ConversationResponse> getConversation(
            @PathVariable String conversationId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = authService.getUserByEmail(userDetails.getUsername());
        ConversationResponse response = chatService.getConversation(user, conversationId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<ConversationResponse>> getChatHistory(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = authService.getUserByEmail(userDetails.getUsername());
        List<ConversationResponse> conversations = chatService.getUserConversations(user);
        return ResponseEntity.ok(conversations);
    }

    @DeleteMapping("/{conversationId}")
    public ResponseEntity<ApiResponse> deleteConversation(
            @PathVariable String conversationId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = authService.getUserByEmail(userDetails.getUsername());
        chatService.deleteConversation(user, conversationId);
        return ResponseEntity.ok(new ApiResponse(true, "Conversation deleted"));
    }

    @PutMapping("/{conversationId}/rename")
    public ResponseEntity<ApiResponse> renameConversation(
            @PathVariable String conversationId,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> request
    ) {
        User user = authService.getUserByEmail(userDetails.getUsername());
        String newTitle = request.get("title");
        chatService.renameConversation(user, conversationId, newTitle);
        return ResponseEntity.ok(new ApiResponse(true, "Conversation renamed"));
    }
}
