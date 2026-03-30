package com.hhcc.profile.controller;

import com.hhcc.profile.model.PetProfile;
import com.hhcc.profile.repository.PetProfileRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * REST Controller for Pet Profile management.
 *
 * All routes are scoped to a specific user via the X-Mock-User-Id header
 * which the Node.js Orchestrator injects from the Angular session.
 *
 * Use Cases covered:
 *   UC#5 — Add Pet  (POST)
 *   UC#6 — Manage Pets  (GET, PUT, DELETE)
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/profiles/{userId}/pets")
public class PetProfileController {

    private final PetProfileRepository repository;

    public PetProfileController(PetProfileRepository repository) {
        this.repository = repository;
    }

    // ────────────────────────────────────────────────────────
    // GET /api/v1/profiles/{userId}/pets
    // Returns all pets belonging to the user
    // ────────────────────────────────────────────────────────
    @GetMapping
    public List<PetProfile> getAllByUser(@PathVariable Long userId) {
        log.info("Fetching all pets for userId={}", userId);
        return repository.findAllByUserId(userId);
    }

    // ────────────────────────────────────────────────────────
    // GET /api/v1/profiles/{userId}/pets/{id}
    // Returns a single pet by id
    // ────────────────────────────────────────────────────────
    @GetMapping("/{id}")
    public PetProfile getById(@PathVariable Long userId, @PathVariable Long id) {
        log.info("Fetching pet id={} for userId={}", id, userId);
        return repository.findById(id)
            .filter(p -> p.getUserId().equals(userId))
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Pet not found for id=" + id));
    }

    // ────────────────────────────────────────────────────────
    // POST /api/v1/profiles/{userId}/pets
    // UC#5 — Add a new pet to the user's profile
    // ────────────────────────────────────────────────────────
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PetProfile create(@PathVariable Long userId, @RequestBody PetProfile pet) {
        log.info("Adding pet for userId={}", userId);
        pet.setUserId(userId);
        pet.setCreatedBy(userId);
        pet.setUpdatedBy(userId);
        return repository.save(pet);
    }

    // ────────────────────────────────────────────────────────
    // PUT /api/v1/profiles/{userId}/pets/{id}
    // UC#6 — Update an existing pet profile
    // ────────────────────────────────────────────────────────
    @PutMapping("/{id}")
    public PetProfile update(@PathVariable Long userId,
                             @PathVariable Long id,
                             @RequestBody PetProfile pet) {
        log.info("Updating pet id={} for userId={}", id, userId);
        pet.setId(id);
        pet.setUserId(userId);
        pet.setUpdatedBy(userId);
        int updated = repository.update(pet);
        if (updated == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Pet not found or not owned by userId=" + userId);
        }
        return pet;
    }

    // ────────────────────────────────────────────────────────
    // DELETE /api/v1/profiles/{userId}/pets/{id}
    // UC#6 — Remove a pet from the user's profile
    // ────────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long userId, @PathVariable Long id) {
        log.info("Deleting pet id={} for userId={}", id, userId);
        int deleted = repository.deleteByIdAndUserId(id, userId);
        if (deleted == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Pet not found or not owned by userId=" + userId);
        }
        return ResponseEntity.noContent().build();
    }
}
