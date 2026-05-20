package com.example.springdatarest.web;

import com.example.springdatarest.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        if ("admin".equals(email) && "admin".equals(password)) {
            String token = jwtService.generateToken(email);
            return Map.of("token", token, "role", "ADMIN");
        }

        throw new RuntimeException("Identifiants invalides");
    }
}