package com.hhcc.scheduling.model;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * Domain model representing a care facility in the {@code care_facility} table.
 *
 * <p>
 * Facilities offer one or more care types (CHILDCARE, PET, ELDERLY) and are displayed on the Home Screen directory
 * (UC#1).
 * </p>
 *
 * @see com.hhcc.scheduling.repository.CareFacilityRepository
 */
@Data
public class CareFacility {
    private Long id;
    private String facilityName;
    private String locationAddress;
    private String description;
    private String photoUrl;
    private String supportedCareTypes;
    private Boolean isActive;
    private LocalDateTime createdDt;
    private Long createdBy;
    private LocalDateTime updatedDt;
    private Long updatedBy;
}
