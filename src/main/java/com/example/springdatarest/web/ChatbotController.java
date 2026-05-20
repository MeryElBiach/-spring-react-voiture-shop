package com.example.springdatarest.web;

import com.example.springdatarest.service.VoitureAssistant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatbotController {

    @Autowired
    private VoitureAssistant assistant;

    @PostMapping("/ask")
    public Map<String, String> ask(@RequestBody Map<String, String> request) {
        String question = request.get("question");
        String reponse = assistant.poserQuestion(question);
        return Map.of("reponse", reponse);
    }


    @PostMapping("/reset")
    public Map<String, String> reset() {
        assistant.reinitialiserHistorique();
        return Map.of("message", "Historique réinitialisé avec succès.");
    }
}