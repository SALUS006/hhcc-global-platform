package com.hhcc.payment.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Data Transfer Object for payment invoice responses.
 * 
 * This DTO represents the complete payment invoice information returned
 * from the Payment Service API. It is used in API responses to provide
 * details about created or retrieved payment invoices.
 * 
 * @author Payment Service Team
 * @version 1.0.0
 * @since 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentInvoiceResponse {

    /**
     * Unique identifier for the payment invoice.
     */
    @JsonProperty("id")
    private Long id;

    /**
     * References the care booking ID for which this payment is made.
     */
    @JsonProperty("bookingId")
    private Long bookingId;

    /**
     * The payment amount.
     */
    @JsonProperty("amount")
    private BigDecimal amount;

    /**
     * ISO 4217 currency code.
     * Example: "USD"
     */
    @JsonProperty("currency")
    private String currency;

    /**
     * The date and time when the payment was processed.
     * Null if payment is not yet completed.
     */
    @JsonProperty("paymentDate")
    private LocalDateTime paymentDate;

    /**
     * The payment method used.
     * Enum values: MOCK, CREDIT_CARD, PAYPAL
     */
    @JsonProperty("paymentMethod")
    private String paymentMethod;

    /**
     * The current status of the payment.
     * Enum values: UNPAID, PAID, REFUNDED
     */
    @JsonProperty("status")
    private String status;

    /**
     * Timestamp when the invoice was created.
     */
    @JsonProperty("createdDt")
    private LocalDateTime createdDt;

    /**
     * Timestamp when the invoice was last updated.
     */
    @JsonProperty("updatedDt")
    private LocalDateTime updatedDt;
}
