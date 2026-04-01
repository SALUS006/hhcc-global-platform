package com.hhcc.scheduling.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import java.sql.SQLException;
import java.util.Map;

/**
 * Global exception handler for the Scheduling Service.
 *
 * <p>
 * Intercepts exceptions thrown by controllers and transforms them into standardized JSON error responses, preventing
 * raw Java stack traces from reaching the upstream Node.js Orchestrator.
 * </p>
 *
 * <p>
 * Handler priority (most specific first):
 * </p>
 * <ol>
 * <li>{@link ResponseStatusException} — preserves the original HTTP status code</li>
 * <li>{@link SQLException} — returns HTTP 500 with a database error payload</li>
 * <li>{@link Exception} — catch-all returning HTTP 500</li>
 * </ol>
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles {@link ResponseStatusException} by preserving the original HTTP status.
     *
     * @param ex
     *            the exception thrown by the controller
     *
     * @return a JSON response with the status code and reason
     */
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> handleResponseStatusException(ResponseStatusException ex) {
        return ResponseEntity.status(ex.getStatusCode())
                .body(Map.of("status", String.valueOf(ex.getStatusCode().value()), "error",
                        ex.getReason() != null ? ex.getReason() : "Unknown"));
    }

    /**
     * Handles JDBC {@link SQLException} instances.
     *
     * @param ex
     *            the SQL exception
     *
     * @return HTTP 500 with a database error payload
     */
    @ExceptionHandler(SQLException.class)
    public ResponseEntity<Map<String, String>> handleSQLException(SQLException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Database Logic Error", "message", ex.getMessage()));
    }

    /**
     * Catch-all handler for any unhandled exceptions.
     *
     * @param ex
     *            the exception
     *
     * @return HTTP 500 with a generic error payload
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Internal Server Error", "message", ex.getMessage()));
    }
}
