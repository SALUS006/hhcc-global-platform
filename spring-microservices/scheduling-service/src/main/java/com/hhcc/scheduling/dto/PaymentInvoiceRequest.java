package com.hhcc.scheduling.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentInvoiceRequest {
    private Long bookingId;
    private BigDecimal amount;
    private String currency;
    private String paymentMethod;
}
