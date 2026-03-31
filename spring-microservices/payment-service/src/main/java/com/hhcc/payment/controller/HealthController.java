package com.hhcc.payment.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * REST Controller for health check endpoints.
 * 
 * Provides a health check endpoint for the Payment Service. This endpoint
 * verifies both the service status and database connectivity, allowing
 * external monitoring systems and load balancers to determine service availability.
 * 
 * Base path: /api/v1/payment
 * 
 * @author Payment Service Team
 * @version 1.0.0
 * @since 1.0.0
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/payment")
public class HealthController {

    private final JdbcTemplate jdbcTemplate;

    /**
     * Constructs a HealthController with the specified JdbcTemplate.
     * 
     * @param jdbcTemplate the Spring JdbcTemplate to use for database connectivity check
     */
    public HealthController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Performs a health check on the Payment Service and database.
     * 
     * This endpoint checks both the service status and database connectivity.
     * A successful response indicates the service is UP and the database is CONNECTED.
     * If the database connection fails, the response includes an error message and
     * returns HTTP 503 Service Unavailable.
     * 
     * @return ResponseEntity with health status information:
     *         - 200 OK: Service and database both operational
     *         - 503 Service Unavailable: Database connection failed
     *         
     *         Response body contains:
     *         - service: "UP" if the service is running
     *         - database: "CONNECTED" if database is accessible, "DISCONNECTED" otherwise
     *         - error: (only present if database is disconnected) Error message from the failed connection attempt
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> status = new HashMap<>();
        status.put("service", "UP");
        try {
            jdbcTemplate.execute("SELECT 1");
            status.put("database", "CONNECTED");
            log.debug("Health check passed - service UP, database CONNECTED");
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            log.error("Database connection failed during health check", e);
            status.put("database", "DISCONNECTED");
            status.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(status);
        }
    }
}
