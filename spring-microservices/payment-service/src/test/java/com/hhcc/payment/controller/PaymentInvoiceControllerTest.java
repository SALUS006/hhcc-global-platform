package com.hhcc.payment.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hhcc.payment.dto.CardPaymentRequest;
import com.hhcc.payment.entity.PaymentInvoice;
import com.hhcc.payment.repository.PaymentInvoiceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PaymentInvoiceController.class)
class PaymentInvoiceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PaymentInvoiceRepository paymentInvoiceRepository;

    @BeforeEach
    void setup() {
        // Setup common mocks if needed
    }

    @Test
    void payInvoice_withCardPayment_shouldStoreCardDetails() throws Exception {
        Long invoiceId = 1L;
        PaymentInvoice invoice = PaymentInvoice.builder()
                .id(invoiceId)
                .bookingId(10L)
                .amount(new BigDecimal("100.00"))
                .currency("USD")
                .status("UNPAID")
                .paymentMethod("UNPAID")
                .createdBy(1L)
                .updatedBy(1L)
                .createdDt(LocalDateTime.now())
                .updatedDt(LocalDateTime.now())
                .build();
        Mockito.when(paymentInvoiceRepository.findById(invoiceId)).thenReturn(Optional.of(invoice));
        Mockito.when(paymentInvoiceRepository.update(any(PaymentInvoice.class))).thenAnswer(i -> i.getArgument(0));

        CardPaymentRequest request = CardPaymentRequest.builder()
                .paymentMethod("CREDIT_CARD")
                .cardNumber("4242424242424242")
                .cardExpiry("12/2030")
                .cardCvv("123")
                .cardholderName("Jane Doe")
                .build();

        mockMvc.perform(put("/api/v1/payment/invoices/{id}/pay", invoiceId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.paymentMethod").value("CREDIT_CARD"))
                .andExpect(jsonPath("$.cardLast4").value("4242"))
                .andExpect(jsonPath("$.cardExpiry").value("12/2030"))
                .andExpect(jsonPath("$.cardholderName").value("Jane Doe"));
    }
}
