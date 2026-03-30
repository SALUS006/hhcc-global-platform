package com.hhcc.profile.controller;

import com.hhcc.profile.model.FamilyMember;
import com.hhcc.profile.repository.FamilyMemberRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * REST Controller for Family Member management.
 *
 * All routes are scoped to a specific user via the X-Mock-User-Id header
 * which the Node.js Orchestrator injects from the Angular session.
 *
 * Use Cases covered:
 *   UC#3 — Add Family Member  (POST)
 *   UC#4 — Manage Family Members  (GET, PUT, DELETE)
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/profiles/{userId}/family-members")
public class FamilyMemberController {

    private final FamilyMemberRepository repository;

    public FamilyMemberController(FamilyMemberRepository repository) {
        this.repository = repository;
    }

    // ────────────────────────────────────────────────────────
    // GET /api/v1/profiles/{userId}/family-members
    // Returns all family members belonging to the user
    // ────────────────────────────────────────────────────────
    @GetMapping
    public List<FamilyMember> getAllByUser(@PathVariable Long userId) {
        log.info("Fetching all family members for userId={}", userId);
        return repository.findAllByUserId(userId);
    }

    // ────────────────────────────────────────────────────────
    // GET /api/v1/profiles/{userId}/family-members/{id}
    // Returns a single family member by id
    // ────────────────────────────────────────────────────────
    @GetMapping("/{id}")
    public FamilyMember getById(@PathVariable Long userId, @PathVariable Long id) {
        log.info("Fetching family member id={} for userId={}", id, userId);
        return repository.findById(id)
            .filter(fm -> fm.getUserId().equals(userId))
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Family member not found for id=" + id));
    }

    // ────────────────────────────────────────────────────────
    // POST /api/v1/profiles/{userId}/family-members
    // UC#3 — Add a new family member to the user's profile
    // ────────────────────────────────────────────────────────
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FamilyMember create(@PathVariable Long userId, @RequestBody FamilyMember familyMember) {
        log.info("Adding family member for userId={}", userId);
        familyMember.setUserId(userId);
        familyMember.setCreatedBy(userId);
        familyMember.setUpdatedBy(userId);
        return repository.save(familyMember);
    }

    // ────────────────────────────────────────────────────────
    // PUT /api/v1/profiles/{userId}/family-members/{id}
    // UC#4 — Update an existing family member
    // ────────────────────────────────────────────────────────
    @PutMapping("/{id}")
    public FamilyMember update(@PathVariable Long userId,
                               @PathVariable Long id,
                               @RequestBody FamilyMember familyMember) {
        log.info("Updating family member id={} for userId={}", id, userId);
        familyMember.setId(id);
        familyMember.setUserId(userId);
        familyMember.setUpdatedBy(userId);
        int updated = repository.update(familyMember);
        if (updated == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Family member not found or not owned by userId=" + userId);
        }
        return familyMember;
    }

    // ────────────────────────────────────────────────────────
    // DELETE /api/v1/profiles/{userId}/family-members/{id}
    // UC#4 — Remove a family member from the user's profile
    // ────────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long userId, @PathVariable Long id) {
        log.info("Deleting family member id={} for userId={}", id, userId);
        int deleted = repository.deleteByIdAndUserId(id, userId);
        if (deleted == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Family member not found or not owned by userId=" + userId);
        }
        return ResponseEntity.noContent().build();
    }
}
