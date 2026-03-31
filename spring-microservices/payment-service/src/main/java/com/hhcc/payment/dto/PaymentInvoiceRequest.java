package com.hhcc.payment.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Data Transfer Object for payment invoice creation requests.
 * 
 * This DTO is used when submitting a mock payment for a booking.
 * It validates the required fields and passes them to the service layer.
 * 
 * Implementation note: In the MVP, all payments are mocked (paymentMethod = MOCK)
 * and immediately resolved. Real Stripe/PayPal integration is a post-MVP enhancement.
 * 
 * @author Payment Service Team
 * @version 1.0.0
 * @since 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentInvoiceRequest {

    /**
     * The ID of the care booking for which payment is being made.
     * This is a required field and must reference an existing booking.
     * 
     * Constraint: Must not be null or empty.
     */
    @JsonProperty("bookingId")
    private Long bookingId;

    /**
     * The payment amount in the specified currency.
     * This is a required field.
     * 
     * Constraint: Must be a positive number with up to 2 decimal places.
     * Example: 120.00
     */
    @JsonProperty("amount")
    private BigDecimal amount;

    /**
     * ISO 4217 currency code (e.g., USD, EUR, GBP).
     * Optional field with default value of "USD".
     * 
     * Example: "USD"
     */
    @JsonProperty("currency")
    @Builder.Default
    private String currency = "USD";

    /**
     * The payment method to be used for this transaction.
     * Optional field with default value of "MOCK".
     * 
     * Enum values:
     * - MOCK: Mock payment (MVP only, no real transaction)
     * - CREDIT_CARD: Credit card payment (post-MVP)
     * - PAYPAL: PayPal payment (post-MVP)
     * 
     * Default: MOCK
     */
    @JsonProperty("paymentMethod")
    @Builder.Default
    private String paymentMethod = "MOCK";
}
