package com.learn.messageservice.controller;

import com.learn.commonservice.dto.MessageSendEvent;
import com.learn.messageservice.model.Message;
import com.learn.messageservice.model.MessageResponse;
import com.learn.messageservice.model.RelayMessageRequest;
import com.learn.messageservice.repository.MessageRepository;
import com.learn.messageservice.service.MessageService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/message")
public class MessageController {
    private final MessageService messageService;
    private final MessageRepository repository;

    public MessageController(MessageService messageService, MessageRepository repository) {
        this.messageService = messageService;
        this.repository = repository;
    }

    @PostMapping
    public void addMessage(@RequestBody Message message) {
        messageService.addMessage(message);
    }

    @PostMapping("/getRelayMessage")
    public List<Message> getRelayMessage(@RequestBody RelayMessageRequest request) {
        return repository.getMessage(request.getSender(), request.getTo());
    }
    @GetMapping("/{sender}/{to}")
    public List<MessageResponse> getMessage(@PathVariable String sender, @PathVariable String to, @RequestParam(defaultValue = "10") int number) {
        return messageService.getMessageByNumber(sender, to, number );
    }
    @GetMapping()
    public List<MessageResponse> getListMessagesById(@RequestParam String messageId , @RequestParam(defaultValue = "10") int limit) {
        return messageService.getListMessagesById(messageId, limit);
    }

    @PostMapping("/lasted/{sender}")
    public MessageSendEvent getLastedMessages(@RequestBody List<String> userIds, @PathVariable String sender) {
       return messageService.getLastedMessages(userIds, sender);
    }


}
