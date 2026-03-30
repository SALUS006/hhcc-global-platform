package com.hhcc.profile.controller;

import com.hhcc.profile.model.UserProfile;
import com.hhcc.profile.repository.UserProfileRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/profiles")
public class UserProfileController {

    private final UserProfileRepository repository;

    public UserProfileController(UserProfileRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/health")
    public org.springframework.http.ResponseEntity<java.util.Map<String, String>> healthCheck() {
        java.util.Map<String, String> status = new java.util.HashMap<>();
        status.put("service", "UP");
        try {
            repository.checkDbConnection();
            status.put("database", "CONNECTED");
            return org.springframework.http.ResponseEntity.ok(status);
        } catch (Exception e) {
            log.error("Database connection failed during health check", e);
            status.put("database", "DISCONNECTED");
            status.put("error", e.getMessage());
            return org.springframework.http.ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(status);
        }
    }

    @GetMapping
    public List<UserProfile> getAllProfiles() {
        log.info("Fetching all user profiles");
        return repository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserProfile createProfile(@RequestBody UserProfile profile) {
        return repository.save(profile);
    }
}
