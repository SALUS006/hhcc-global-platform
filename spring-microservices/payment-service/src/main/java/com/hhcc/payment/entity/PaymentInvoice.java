package com.hhcc.payment.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity class representing a payment invoice in the HHCC Payment Service.
 * 
 * This class maps to the {@code payment_invoice} table and represents a payment
 * record for a specific care booking. Invoices track payment status, method,
 * and related information.
 * 
 * @author Payment Service Team
 * @version 1.0.0
 * @since 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentInvoice {

    /**
     * Unique identifier for the payment invoice.
     * Auto-generated primary key.
     */
    private Long id;

    /**
     * References the {@code care_booking.id} - the booking for which this payment is made.
     */
    private Long bookingId;

    /**
     * The payment amount in the specified currency.
     * Stored with 2 decimal places.
     */
    private BigDecimal amount;

    /**
     * ISO 4217 currency code (e.g., USD, EUR).
     * Defaults to USD.
     */
    private String currency;

    /**
     * The date and time when the payment was actually processed.
     * Null until payment is completed.
     */
    private LocalDateTime paymentDate;

    /**
     * The method used for payment.
     * Enum values: MOCK, CREDIT_CARD, PAYPAL
     * In MVP, only MOCK payments are supported.
     */
    private String paymentMethod;

    /**
     * The current status of the payment.
     * Enum values: UNPAID, PAID, REFUNDED
     */
    private String status;

    /**
     * Timestamp when the invoice was created.
     */
    private LocalDateTime createdDt;

    /**
     * User ID of the person who created the invoice.
     * References {@code user_profile.id}.
     */
    private Long createdBy;

    /**
     * Timestamp when the invoice was last updated.
     */
    private LocalDateTime updatedDt;

    /**
     * User ID of the person who last updated the invoice.
     * References {@code user_profile.id}.
     */
    private Long updatedBy;

    /**
     * Last 4 digits of card number (if paid by card).
     */
    private String cardLast4;

    /**
     * Card expiry in MM/YYYY (if paid by card).
     */
    private String cardExpiry;

    /**
     * Name on card (if paid by card).
     */
    private String cardholderName;
}
