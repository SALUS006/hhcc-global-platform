package com.hhcc.payment.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for card payment request body for paying an invoice.
 * Only used for /invoices/{id}/pay endpoint with CREDIT_CARD method.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CardPaymentRequest {
    @JsonProperty("paymentMethod")
    private String paymentMethod; // Should be CREDIT_CARD

    @JsonProperty("cardNumber")
    private String cardNumber;

    @JsonProperty("cardExpiry")
    private String cardExpiry; // MM/YYYY

    @JsonProperty("cardCvv")
    private String cardCvv;

    @JsonProperty("cardholderName")
    private String cardholderName;
}
