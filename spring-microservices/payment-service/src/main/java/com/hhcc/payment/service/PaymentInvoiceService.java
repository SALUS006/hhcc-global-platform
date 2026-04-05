package com.hhcc.payment.service;

import com.hhcc.payment.dto.PaymentInvoiceRequest;
import com.hhcc.payment.dto.PaymentInvoiceResponse;
import com.hhcc.payment.dto.CardPaymentRequest;
import com.hhcc.payment.entity.PaymentInvoice;
import com.hhcc.payment.repository.PaymentInvoiceRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service class for payment invoice business logic.
 * 
 * Handles the creation, retrieval, and refunding of payment invoices.
 * In the MVP, all payments are mocked (paymentMethod = MOCK) and immediately resolved.
 * Real Stripe/PayPal integration is deferred to post-MVP.
 * 
 * @author Payment Service Team
 * @version 1.0.0
 * @since 1.0.0
 */
@Slf4j
@Service
public class PaymentInvoiceService {

    /**
     * Creates a payment invoice for a booking (status UNPAID).
     *
     * @param request the PaymentInvoiceRequest
     * @return the created PaymentInvoiceResponse
     */
    public PaymentInvoiceResponse createInvoice(PaymentInvoiceRequest request) {
        log.info("Creating payment invoice for booking: {}", request.getBookingId());

        // Validate that the booking exists
        if (!paymentInvoiceRepository.bookingExists(request.getBookingId())) {
            log.warn("Booking not found: {}", request.getBookingId());
            throw new IllegalArgumentException("Booking not found: " + request.getBookingId());
        }

        PaymentInvoice invoice = PaymentInvoice.builder()
                .bookingId(request.getBookingId())
                .amount(request.getAmount())
                .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
                .paymentMethod(request.getPaymentMethod())
                .status("UNPAID")
                .createdBy(1L)
                .updatedBy(1L)
                .build();

        PaymentInvoice savedInvoice = paymentInvoiceRepository.save(invoice);
        log.info("Payment invoice created with ID: {}", savedInvoice.getId());
        return mapToResponse(savedInvoice);
    }

    private final PaymentInvoiceRepository paymentInvoiceRepository;

    /**
     * Constructs a PaymentInvoiceService with the specified repository.
     * 
     * @param paymentInvoiceRepository the repository for payment invoice data access
     */
    public PaymentInvoiceService(PaymentInvoiceRepository paymentInvoiceRepository) {
        this.paymentInvoiceRepository = paymentInvoiceRepository;
    }

    /**
     * Retrieves all payment invoices.
     * 
     * @return a list of all PaymentInvoiceResponse objects ordered by most recent first
     */
    public List<PaymentInvoiceResponse> getAllInvoices() {
        log.debug("Retrieving all invoices");
        List<PaymentInvoice> invoices = paymentInvoiceRepository.findAll();
        return invoices.stream()
                .map(this::mapToResponse)
                .toList();
    }


    /**
     * Retrieves a payment invoice by its invoice ID.
     *
     * @param invoiceId the ID of the invoice to retrieve
     * @return the PaymentInvoiceResponse if found
     * @throws IllegalArgumentException if the invoice is not found
     */
    public PaymentInvoiceResponse getInvoiceById(Long invoiceId) {
        log.debug("Retrieving invoice for invoice ID: {}", invoiceId);
        Optional<PaymentInvoice> invoice = paymentInvoiceRepository.findById(invoiceId);
        if (invoice.isEmpty()) {
            log.warn("Invoice not found for invoice ID: {}", invoiceId);
            throw new IllegalArgumentException("Invoice not found for invoice ID: " + invoiceId);
        }
        return mapToResponse(invoice.get());
    }

    /**
     * Refunds a payment invoice.
     * 
     * Marks the invoice with the specified ID as REFUNDED. This is a post-MVP feature
     * and currently only supports mocked refunds.
     * 
     * @param invoiceId the ID of the invoice to refund
     * @return the PaymentInvoiceResponse with updated status
     * @throws IllegalArgumentException if the invoice is not found or is already refunded
     */
    public PaymentInvoiceResponse refundInvoice(Long invoiceId) {
        log.info("Processing refund for invoice ID: {}", invoiceId);
        
        Optional<PaymentInvoice> invoiceOpt = paymentInvoiceRepository.findById(invoiceId);
        
        if (invoiceOpt.isEmpty()) {
            log.warn("Invoice not found: {}", invoiceId);
            throw new IllegalArgumentException("Invoice not found: " + invoiceId);
        }

        PaymentInvoice invoice = invoiceOpt.get();
        
        if ("REFUNDED".equals(invoice.getStatus())) {
            log.warn("Invoice is already refunded: {}", invoiceId);
            throw new IllegalArgumentException("Invoice is already refunded: " + invoiceId);
        }

        // Process the refund
        invoice.setStatus("REFUNDED");
        invoice.setUpdatedBy(1L); // System user
        
        PaymentInvoice updatedInvoice = paymentInvoiceRepository.update(invoice);
        
        log.info("Invoice refunded successfully: {}", invoiceId);
        return mapToResponse(updatedInvoice);
    }

    /**
     * Pays a payment invoice.
     * 
     * Marks the invoice with the specified ID as PAID.
     * 
     * @param invoiceId the ID of the invoice to pay
     * @return the PaymentInvoiceResponse with updated status
     */
    public PaymentInvoiceResponse payInvoice(Long invoiceId, CardPaymentRequest cardPaymentRequest) {
        log.info("Processing payment for invoice ID: {} with method: {}", invoiceId, cardPaymentRequest.getPaymentMethod());
        Optional<PaymentInvoice> invoiceOpt = paymentInvoiceRepository.findById(invoiceId);
        if (invoiceOpt.isEmpty()) {
            throw new IllegalArgumentException("Invoice not found: " + invoiceId);
        }
        PaymentInvoice invoice = invoiceOpt.get();
        invoice.setStatus("PAID");
        invoice.setPaymentDate(LocalDateTime.now());
        invoice.setUpdatedBy(1L);
        if ("CREDIT_CARD".equalsIgnoreCase(cardPaymentRequest.getPaymentMethod())) {
            String cardNumber = cardPaymentRequest.getCardNumber();
            String last4 = (cardNumber != null && cardNumber.length() >= 4) ? cardNumber.substring(cardNumber.length() - 4) : null;
            invoice.setPaymentMethod("CREDIT_CARD");
            invoice.setCardLast4(last4);
            invoice.setCardExpiry(cardPaymentRequest.getCardExpiry());
            invoice.setCardholderName(cardPaymentRequest.getCardholderName());
        } else {
            // For MOCK or other methods, clear card fields
            invoice.setPaymentMethod(cardPaymentRequest.getPaymentMethod());
            invoice.setCardLast4(null);
            invoice.setCardExpiry(null);
            invoice.setCardholderName(null);
        }
        PaymentInvoice updatedInvoice = paymentInvoiceRepository.update(invoice);
        // Set booking status to CONFIRMED after successful payment
        int rows = paymentInvoiceRepository.updateBookingStatus(invoice.getBookingId(), "CONFIRMED");
        if (rows > 0) {
            log.info("Booking status set to CONFIRMED for bookingId: {}", invoice.getBookingId());
        } else {
            log.warn("Failed to update booking status to CONFIRMED for bookingId: {}", invoice.getBookingId());
        }
        log.info("Invoice paid successfully: {}", invoiceId);
        return mapToResponse(updatedInvoice);
    }

    /**
     * Maps a PaymentInvoice entity to a PaymentInvoiceResponse DTO.
     * 
     * @param invoice the PaymentInvoice entity to map
     * @return the corresponding PaymentInvoiceResponse
     */
    private PaymentInvoiceResponse mapToResponse(PaymentInvoice invoice) {
        return PaymentInvoiceResponse.builder()
            .id(invoice.getId())
            .bookingId(invoice.getBookingId())
            .amount(invoice.getAmount())
            .currency(invoice.getCurrency())
            .paymentDate(invoice.getPaymentDate())
            .paymentMethod(invoice.getPaymentMethod())
            .status(invoice.getStatus())
            .createdDt(invoice.getCreatedDt())
            .updatedDt(invoice.getUpdatedDt())
            .cardLast4(invoice.getCardLast4())
            .cardExpiry(invoice.getCardExpiry())
            .cardholderName(invoice.getCardholderName())
            .build();
    }
}
