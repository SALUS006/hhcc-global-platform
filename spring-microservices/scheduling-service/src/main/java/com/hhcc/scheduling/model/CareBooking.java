package com.hhcc.scheduling.model;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * Domain model representing a care booking in the {@code care_booking} table.
 *
 * <p>
 * Uses a polymorphic pattern where {@code dependentType} (FAMILY_MEMBER or PET) determines whether {@code dependentId}
 * references {@code family_member.id} or {@code pet_profile.id}.
 * </p>
 *
 * <p>
 * Covers UC#7 (family member scheduling) and UC#8 (pet scheduling).
 * </p>
 *
 * @see com.hhcc.scheduling.repository.CareBookingRepository
 */
@Data
public class CareBooking {
    private Long id;
    private Long userId;
    private Long facilityId;
    private String careType;
    private String dependentType;
    private Long dependentId;
    private LocalDateTime pickupTime;
    private LocalDateTime dropoffTime;
    private String status;
    private String notes;
    private LocalDateTime createdDt;
    private Long createdBy;
    private LocalDateTime updatedDt;
    private Long updatedBy;
}
