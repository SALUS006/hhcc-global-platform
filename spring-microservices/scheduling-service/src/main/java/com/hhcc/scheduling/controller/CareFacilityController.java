package com.hhcc.scheduling.controller;

import com.hhcc.scheduling.model.CareFacility;
import com.hhcc.scheduling.repository.CareFacilityRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * REST Controller for Care Facility listings (UC#1).
 *
 * <p>
 * Exposes the facility catalog used by the Home Screen directory. Supports optional filtering by {@code careType} query
 * parameter.
 * </p>
 *
 * <p>
 * Endpoints:
 * </p>
 * <ul>
 * <li>{@code GET /api/v1/scheduling/facilities} — list all active facilities</li>
 * <li>{@code GET /api/v1/scheduling/facilities/{id}} — get a single facility</li>
 * </ul>
 *
 * @see com.hhcc.scheduling.repository.CareFacilityRepository
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/scheduling/facilities")
public class CareFacilityController {

    private final CareFacilityRepository repository;

    public CareFacilityController(CareFacilityRepository repository) {
        this.repository = repository;
    }

    /**
     * Lists all active care facilities, optionally filtered by care type.
     *
     * @param careType
     *            optional query parameter (CHILDCARE, PET, ELDERLY)
     *
     * @return list of matching {@link CareFacility} instances
     */
    @GetMapping
    public List<CareFacility> getAll(@RequestParam(required = false) String careType) {
        log.info("Listing facilities, careType filter={}", careType);
        return repository.findAllActive(careType);
    }

    /**
     * Retrieves a single care facility by ID.
     *
     * @param id
     *            the facility ID
     *
     * @return the matching {@link CareFacility}
     *
     * @throws ResponseStatusException
     *             404 if the facility does not exist
     */
    @GetMapping("/{id}")
    public CareFacility getById(@PathVariable Long id) {
        log.info("Fetching facility id={}", id);
        return repository.findById(id).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Facility not found for id=" + id));
    }
}
