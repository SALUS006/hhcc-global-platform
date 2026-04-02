package com.hhcc.payment.repository;

import com.hhcc.payment.entity.PaymentInvoice;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository class for PaymentInvoice entity operations.
 * 
 * Handles all database operations for payment invoices including create, read, and update operations.
 * Uses Spring's JdbcTemplate for database access with manual SQL queries.
 * 
 * @author Payment Service Team
 * @version 1.0.0
 * @since 1.0.0
 */
@Slf4j
@Repository
public class PaymentInvoiceRepository {

    private final JdbcTemplate jdbcTemplate;

    /**
     * RowMapper for mapping database result sets to PaymentInvoice entity objects.
     */
    private static final RowMapper<PaymentInvoice> ROW_MAPPER = (rs, rowNum) -> PaymentInvoice.builder()
            .id(rs.getLong("id"))
            .bookingId(rs.getLong("booking_id"))
            .amount(rs.getBigDecimal("amount"))
            .currency(rs.getString("currency"))
            .paymentDate(rs.getTimestamp("payment_date") != null ? 
                    rs.getTimestamp("payment_date").toLocalDateTime() : null)
            .paymentMethod(rs.getString("payment_method"))
            .status(rs.getString("status"))
            .createdDt(rs.getTimestamp("created_dt").toLocalDateTime())
            .createdBy(rs.getLong("created_by"))
            .updatedDt(rs.getTimestamp("updated_dt").toLocalDateTime())
            .updatedBy(rs.getLong("updated_by"))
            .build();

    /**
     * Constructs a PaymentInvoiceRepository with the specified JdbcTemplate.
     * 
     * @param jdbcTemplate the Spring JdbcTemplate to use for database operations
     */
    public PaymentInvoiceRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Retrieves all payment invoices ordered by most recent first.
     * 
     * @return a list of all PaymentInvoice entities
     */
    public List<PaymentInvoice> findAll() {
        log.debug("Finding all payment invoices");
        return jdbcTemplate.query("SELECT * FROM payment_invoice ORDER BY id DESC", ROW_MAPPER);
    }

    /**
     * Creates a new payment invoice in the database.
     * 
     * The system will automatically set the created_dt and updated_dt to the current timestamp.
     * 
     * @param invoice the PaymentInvoice entity to save
     * @return the saved PaymentInvoice entity with the generated ID
     * @throws org.springframework.dao.DataAccessException if a database error occurs
     */
    public PaymentInvoice save(PaymentInvoice invoice) {
        log.debug("Saving payment invoice for booking: {}", invoice.getBookingId());
        
        String sql = "INSERT INTO payment_invoice " +
                "(booking_id, amount, currency, payment_date, payment_method, status, created_by, updated_by) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, invoice.getBookingId());
            ps.setBigDecimal(2, invoice.getAmount());
            ps.setString(3, invoice.getCurrency());
            ps.setTimestamp(4, invoice.getPaymentDate() != null ? 
                    java.sql.Timestamp.valueOf(invoice.getPaymentDate()) : null);
            ps.setString(5, invoice.getPaymentMethod());
            ps.setString(6, invoice.getStatus());
            ps.setObject(7, invoice.getCreatedBy());
            ps.setObject(8, invoice.getUpdatedBy());
            return ps;
        }, keyHolder);

        Long generatedId = keyHolder.getKey().longValue();
        invoice.setId(generatedId);
        
        log.info("Payment invoice created with ID: {}", generatedId);
        return invoice;
    }

    /**
     * Retrieves a payment invoice by its ID.
     * 
     * @param id the ID of the payment invoice to retrieve
     * @return an Optional containing the PaymentInvoice if found, otherwise empty
     */
    public Optional<PaymentInvoice> findById(Long id) {
        log.debug("Finding payment invoice by ID: {}", id);
        
        String sql = "SELECT * FROM payment_invoice WHERE id = ?";
        
        try {
            PaymentInvoice invoice = jdbcTemplate.queryForObject(sql, ROW_MAPPER, id);
            return Optional.of(invoice);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            log.debug("Payment invoice not found with ID: {}", id);
            return Optional.empty();
        }
    }

    /**
     * Retrieves a payment invoice by the booking ID.
     * 
     * @param bookingId the ID of the booking to find invoices for
     * @return an Optional containing the PaymentInvoice if found, otherwise empty
     */
    public Optional<PaymentInvoice> findByBookingId(Long bookingId) {
        log.debug("Finding payment invoice by booking ID: {}", bookingId);
        
        String sql = "SELECT * FROM payment_invoice WHERE booking_id = ?";
        
        try {
            PaymentInvoice invoice = jdbcTemplate.queryForObject(sql, ROW_MAPPER, bookingId);
            return Optional.of(invoice);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            log.debug("Payment invoice not found for booking ID: {}", bookingId);
            return Optional.empty();
        }
    }

    /**
     * Updates an existing payment invoice in the database.
     * 
     * The updated_dt field is automatically updated to the current timestamp by the database.
     * 
     * @param invoice the PaymentInvoice entity to update
     * @return the updated PaymentInvoice entity
     * @throws org.springframework.dao.DataAccessException if a database error occurs
     */
    public PaymentInvoice update(PaymentInvoice invoice) {
        log.debug("Updating payment invoice with ID: {}", invoice.getId());
        
        String sql = "UPDATE payment_invoice SET " +
                "booking_id = ?, amount = ?, currency = ?, payment_date = ?, " +
                "payment_method = ?, status = ?, updated_by = ? " +
                "WHERE id = ?";

        jdbcTemplate.update(sql,
                invoice.getBookingId(),
                invoice.getAmount(),
                invoice.getCurrency(),
                invoice.getPaymentDate() != null ? 
                        java.sql.Timestamp.valueOf(invoice.getPaymentDate()) : null,
                invoice.getPaymentMethod(),
                invoice.getStatus(),
                invoice.getUpdatedBy(),
                invoice.getId());
        
        log.info("Payment invoice updated with ID: {}", invoice.getId());
        return invoice;
    }

    /**
     * Checks if a booking exists in the database.
     * 
     * This is used for validation before creating a payment invoice.
     * 
     * @param bookingId the ID of the booking to check
     * @return true if the booking exists, false otherwise
     */
    public boolean bookingExists(Long bookingId) {
        log.debug("Checking if booking exists: {}", bookingId);
        
        String sql = "SELECT COUNT(*) FROM care_booking WHERE id = ?";
        
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, bookingId);
        return count != null && count > 0;
    }
}
