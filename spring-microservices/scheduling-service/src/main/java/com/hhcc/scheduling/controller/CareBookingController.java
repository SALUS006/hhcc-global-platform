package com.hhcc.scheduling.controller;

import com.hhcc.scheduling.model.CareBooking;
import com.hhcc.scheduling.repository.CareBookingRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * REST Controller for Care Bookings (UC#7 — family, UC#8 — pet).
 *
 * <p>
 * Manages pick-up/drop-off scheduling for both family members and pets. The {@code dependentType} field in the request
 * body determines whether the booking targets a {@code FAMILY_MEMBER} or a {@code PET}.
 * </p>
 *
 * <p>
 * Endpoints:
 * </p>
 * <ul>
 * <li>{@code POST /api/v1/scheduling/bookings} — create a booking</li>
 * <li>{@code GET /api/v1/scheduling/bookings/{userId}} — list user bookings</li>
 * <li>{@code GET /api/v1/scheduling/bookings/{userId}/{id}} — get single booking</li>
 * <li>{@code DELETE /api/v1/scheduling/bookings/{userId}/{id}} — cancel a booking</li>
 * </ul>
 *
 * @see com.hhcc.scheduling.repository.CareBookingRepository
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/scheduling/bookings")
public class CareBookingController {

    private final CareBookingRepository repository;

    public CareBookingController(CareBookingRepository repository) {
        this.repository = repository;
    }

    /**
     * Creates a new care booking. Status is set to {@code PENDING} automatically.
     *
     * @param booking
     *            the booking request body
     *
     * @return the persisted {@link CareBooking} with generated ID
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CareBooking create(@RequestBody CareBooking booking) {
        log.info("Creating booking for userId={}", booking.getUserId());
        booking.setCreatedBy(booking.getUserId());
        booking.setUpdatedBy(booking.getUserId());
        booking.setStatus("PENDING");
        return repository.save(booking);
    }

    /**
     * Lists all bookings for a user, optionally filtered by status.
     *
     * @param userId
     *            the account owner's ID
     * @param status
     *            optional filter (PENDING, CONFIRMED, COMPLETED, CANCELLED)
     *
     * @return list of matching {@link CareBooking} instances
     */
    @GetMapping("/{userId}")
    public List<CareBooking> getAllByUser(@PathVariable Long userId, @RequestParam(required = false) String status) {
        log.info("Listing bookings for userId={}, status filter={}", userId, status);
        return repository.findAllByUserId(userId, status);
    }

    /**
     * Lists all bookings across all users.
     *
     * @param status optional filter
     * @return list of matching CareBooking instances
     */
    @GetMapping("/admin/all")
    public List<CareBooking> getAllBookingsAdmin(@RequestParam(required = false) String status) {
        log.info("Listing ALL bookings for admin, status filter={}", status);
        return repository.findAll(status);
    }

    /**
     * Retrieves a single booking by ID, scoped to the owning user.
     *
     * @param userId
     *            the account owner's ID
     * @param id
     *            the booking ID
     *
     * @return the matching {@link CareBooking}
     *
     * @throws ResponseStatusException
     *             404 if the booking does not exist or is not owned by the user
     */
    @GetMapping("/{userId}/{id}")
    public CareBooking getById(@PathVariable Long userId, @PathVariable Long id) {
        log.info("Fetching booking id={} for userId={}", id, userId);
        return repository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found for id=" + id));
    }

    /**
     * Cancels a booking by setting its status to {@code CANCELLED}.
     *
     * @param userId
     *            the account owner's ID
     * @param id
     *            the booking ID
     *
     * @return HTTP 204 No Content on success
     *
     * @throws ResponseStatusException
     *             404 if the booking does not exist or is not owned by the user
     */
    @DeleteMapping("/{userId}/{id}")
    public ResponseEntity<Void> cancel(@PathVariable Long userId, @PathVariable Long id) {
        log.info("Cancelling booking id={} for userId={}", id, userId);
        int updated = repository.cancelByIdAndUserId(id, userId, userId);
        if (updated == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Booking not found or not owned by userId=" + userId);
        }
        return ResponseEntity.noContent().build();
    }
}
