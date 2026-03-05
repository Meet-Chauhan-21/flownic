package com.flownic.auth.dto;

public class ChatMessageRequest {
    private String conversationId;
    private String message;

    public ChatMessageRequest() {}

    public ChatMessageRequest(String conversationId, String message) {
        this.conversationId = conversationId;
        this.message = message;
    }

    public String getConversationId() {
        return conversationId;
    }

    public void setConversationId(String conversationId) {
        this.conversationId = conversationId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
