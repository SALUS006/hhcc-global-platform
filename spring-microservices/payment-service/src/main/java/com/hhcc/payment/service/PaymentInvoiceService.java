package com.hhcc.payment.service;

import com.hhcc.payment.dto.PaymentInvoiceRequest;
import com.hhcc.payment.dto.PaymentInvoiceResponse;
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
     * Creates and processes a payment invoice for a booking.
     * 
     * This method handles the creation of a payment invoice and immediately processes
     * the payment if the payment method is MOCK (the only supported method in MVP).
     * 
     * Use Case: UC#9 (Make Payment)
     * 
     * @param request the PaymentInvoiceRequest containing payment details
     * @return the PaymentInvoiceResponse containing the created invoice details
     * @throws IllegalArgumentException if the booking does not exist or request data is invalid
     */
    public PaymentInvoiceResponse createAndProcessPayment(PaymentInvoiceRequest request) {
        log.info("Creating and processing payment for booking: {}", request.getBookingId());
        
        // Validate that the booking exists
        if (!paymentInvoiceRepository.bookingExists(request.getBookingId())) {
            log.warn("Booking not found: {}", request.getBookingId());
            throw new IllegalArgumentException("Booking not found: " + request.getBookingId());
        }

        // Create the payment invoice entity
        PaymentInvoice invoice = PaymentInvoice.builder()
                .bookingId(request.getBookingId())
                .amount(request.getAmount())
                .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "MOCK")
                .status("UNPAID")
                .createdBy(1L) // System user
                .updatedBy(1L) // System user
                .build();

        // Process the payment based on the payment method
        if ("MOCK".equals(invoice.getPaymentMethod())) {
            // Mock payment: immediately mark as PAID
            invoice.setStatus("PAID");
            invoice.setPaymentDate(LocalDateTime.now());
            log.info("Mock payment processed for booking: {}", request.getBookingId());
        } else if ("CREDIT_CARD".equals(invoice.getPaymentMethod()) || "PAYPAL".equals(invoice.getPaymentMethod())) {
            // Real payment methods (post-MVP)
            log.warn("Payment method {} is not yet supported in MVP", invoice.getPaymentMethod());
            invoice.setStatus("UNPAID");
        } else {
            log.warn("Unknown payment method: {}", invoice.getPaymentMethod());
            throw new IllegalArgumentException("Unknown payment method: " + invoice.getPaymentMethod());
        }

        // Save the invoice to the database
        PaymentInvoice savedInvoice = paymentInvoiceRepository.save(invoice);
        
        log.info("Payment invoice created with ID: {}", savedInvoice.getId());
        return mapToResponse(savedInvoice);
    }

    /**
     * Retrieves a payment invoice by its booking ID.
     * 
     * @param bookingId the ID of the booking for which to retrieve the invoice
     * @return the PaymentInvoiceResponse if found
     * @throws IllegalArgumentException if the invoice is not found
     */
    public PaymentInvoiceResponse getInvoiceByBookingId(Long bookingId) {
        log.debug("Retrieving invoice for booking ID: {}", bookingId);
        
        Optional<PaymentInvoice> invoice = paymentInvoiceRepository.findByBookingId(bookingId);
        
        if (invoice.isEmpty()) {
            log.warn("Invoice not found for booking ID: {}", bookingId);
            throw new IllegalArgumentException("Invoice not found for booking ID: " + bookingId);
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
    public PaymentInvoiceResponse payInvoice(Long invoiceId) {
        log.info("Processing payment for invoice ID: {}", invoiceId);
        
        Optional<PaymentInvoice> invoiceOpt = paymentInvoiceRepository.findById(invoiceId);
        
        if (invoiceOpt.isEmpty()) {
            throw new IllegalArgumentException("Invoice not found: " + invoiceId);
        }

        PaymentInvoice invoice = invoiceOpt.get();
        invoice.setStatus("PAID");
        invoice.setPaymentDate(LocalDateTime.now());
        invoice.setUpdatedBy(1L);
        
        PaymentInvoice updatedInvoice = paymentInvoiceRepository.update(invoice);
        
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
                .build();
    }
}
