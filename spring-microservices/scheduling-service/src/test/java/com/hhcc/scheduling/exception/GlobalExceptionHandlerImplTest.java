package com.hhcc.scheduling.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.sql.SQLException;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for {@link GlobalExceptionHandler}.
 *
 * <p>
 * Directly invokes handler methods to verify that {@link java.sql.SQLException} and generic {@link Exception} instances
 * are transformed into the expected HTTP 500 JSON payloads.
 * </p>
 */
class GlobalExceptionHandlerImplTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void handleSQLException_returns500WithDbError() {
        ResponseEntity<Map<String, String>> response = handler
                .handleSQLException(new SQLException("connection refused"));

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Database Logic Error", response.getBody().get("error"));
        assertEquals("connection refused", response.getBody().get("message"));
    }

    @Test
    void handleGenericException_returns500WithGenericError() {
        ResponseEntity<Map<String, String>> response = handler
                .handleGenericException(new RuntimeException("unexpected"));

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Internal Server Error", response.getBody().get("error"));
        assertEquals("unexpected", response.getBody().get("message"));
    }
}
