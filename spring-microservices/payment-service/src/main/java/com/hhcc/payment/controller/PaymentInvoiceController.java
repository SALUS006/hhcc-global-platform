package com.hhcc.payment.controller;

import com.hhcc.payment.dto.PaymentInvoiceRequest;
import com.hhcc.payment.dto.PaymentInvoiceResponse;
import com.hhcc.payment.dto.CardPaymentRequest;
import com.hhcc.payment.service.PaymentInvoiceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for payment invoice management.
 * 
 * Provides endpoints for creating, retrieving, and managing payment invoices
 * for care bookings. All endpoints follow the OpenAPI 3.0 specification defined
 * in the swagger-payment.yaml file.
 * 
 * Base path: /api/v1/payment
 * 
 * @author Payment Service Team
 * @version 1.0.0
 * @since 1.0.0
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/payment")
public class PaymentInvoiceController {

    private final PaymentInvoiceService paymentInvoiceService;

    /**
     * Constructs a PaymentInvoiceController with the specified service.
     * 
     * @param paymentInvoiceService the service for payment invoice business logic
     */
    public PaymentInvoiceController(PaymentInvoiceService paymentInvoiceService) {
        this.paymentInvoiceService = paymentInvoiceService;
    }

    /**
     * Retrieves all payment invoices.
     * 
     * Returns a list of all payment invoices ordered by most recent first.
     * Used by the Angular UI payment dashboard.
     * 
     * @return ResponseEntity with:
     *         - 200 OK: List of PaymentInvoiceResponse objects
     *         - 500 Internal Server Error: Unexpected server error
     */
    @GetMapping("/invoices")
    public ResponseEntity<List<PaymentInvoiceResponse>> getAllInvoices() {
        log.info("GET all payment invoices");
        try {
            List<PaymentInvoiceResponse> invoices = paymentInvoiceService.getAllInvoices();
            return ResponseEntity.ok(invoices);
        } catch (Exception e) {
            log.error("Error retrieving all invoices", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Creates a new payment invoice for a booking and processes the payment.
     * 
     * This endpoint allows users to submit a payment for a confirmed care booking.
     * In the MVP, only mock payments (paymentMethod = MOCK) are supported and are
     * immediately resolved to PAID status. Real payment gateway integration 
     * (Stripe/PayPal) is deferred to post-MVP.
     * 
     * Use Case: UC#9 (Make Payment)
     * 
     * @param request the PaymentInvoiceRequest containing:
     *                - bookingId (required): ID of the care booking
     *                - amount (required): Payment amount
     *                - currency (optional): ISO 4217 currency code, defaults to USD
     *                - paymentMethod (optional): Payment method, defaults to MOCK
     * 
     * @return ResponseEntity with:
     *         - 201 Created: PaymentInvoiceResponse with created invoice details
     *         - 400 Bad Request: Invalid request payload or validation errors
     *         - 404 Not Found: Booking not found
     *         - 500 Internal Server Error: Unexpected server error
     * 
     * @throws IllegalArgumentException if booking not found or payment method is unsupported
     */
    @PostMapping("/invoices")
    public ResponseEntity<PaymentInvoiceResponse> createPaymentInvoice(
            @RequestBody PaymentInvoiceRequest request) {
        
        log.info("CREATE payment invoice request - bookingId: {}, amount: {}", 
                request.getBookingId(), request.getAmount());

        try {
            // Validate request
            if (request.getBookingId() == null || request.getAmount() == null) {
                log.warn("Invalid request: bookingId and amount are required");
                return ResponseEntity.badRequest().build();
            }

            PaymentInvoiceResponse response = paymentInvoiceService.createInvoice(request);

            log.info("Payment invoice created successfully: {}", response.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
            log.warn("Booking not found or invalid payment method: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error creating payment invoice", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Retrieves the payment invoice for a specific booking.
     * 
     * Use Case: UC#9 (Make Payment)
     * 
     * @param bookingId the ID of the care booking to retrieve the invoice for.
     *                  Must be a valid booking ID that exists in the system.
     * 
     * @return ResponseEntity with:
     *         - 200 OK: PaymentInvoiceResponse containing invoice details
     *         - 404 Not Found: Invoice not found for the specified booking
     *         - 500 Internal Server Error: Unexpected server error
     * 
     * @throws IllegalArgumentException if the invoice is not found
     */
    @GetMapping("/invoices/{invoiceId}")
    public ResponseEntity<PaymentInvoiceResponse> getInvoiceById(
            @PathVariable("invoiceId") Long invoiceId) {
        log.info("GET payment invoice request - invoiceId: {}", invoiceId);
        try {
            PaymentInvoiceResponse response = paymentInvoiceService.getInvoiceById(invoiceId);
            log.info("Payment invoice retrieved successfully for invoiceId: {}", invoiceId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.warn("Invoice not found for invoiceId: {}", invoiceId);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error retrieving payment invoice", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Refunds a payment invoice.
     * 
     * Marks a paid invoice as REFUNDED. This is a post-MVP feature and currently
     * only supports mocked refunds.
     * 
     * @param id the ID of the payment invoice to refund.
     *           Must reference an existing, paid invoice.
     * 
     * @return ResponseEntity with:
     *         - 200 OK: PaymentInvoiceResponse with REFUNDED status
     *         - 404 Not Found: Invoice not found
     *         - 400 Bad Request: Invoice cannot be refunded (e.g., already refunded)
     *         - 500 Internal Server Error: Unexpected server error
     * 
     * @throws IllegalArgumentException if invoice not found or already refunded
     */
    @PostMapping("/invoices/{id}/refund")
    public ResponseEntity<PaymentInvoiceResponse> refundInvoice(
            @PathVariable("id") Long id) {
        
        log.info("REFUND payment invoice request - invoiceId: {}", id);

        try {
            PaymentInvoiceResponse response = paymentInvoiceService.refundInvoice(id);
            
            log.info("Payment invoice refunded successfully: {}", id);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.warn("Error refunding invoice: {}", e.getMessage());
            String message = e.getMessage();
            if (message != null && message.startsWith("Invoice not found")) {
                return ResponseEntity.notFound().build();
            } else {
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            log.error("Error refunding payment invoice", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Pays a payment invoice.
     * 
     * Marks an unpaid invoice as PAID.
     *
     * @param id the ID of the payment invoice to pay.
     * @return ResponseEntity with updated invoice.
     */
    @PutMapping("/invoices/{id}/pay")
    public ResponseEntity<PaymentInvoiceResponse> payInvoice(
            @PathVariable("id") Long id,
            @RequestBody CardPaymentRequest cardPaymentRequest) {
        log.info("PAY payment invoice request - invoiceId: {} method: {}", id, cardPaymentRequest.getPaymentMethod());
        try {
            PaymentInvoiceResponse response = paymentInvoiceService.payInvoice(id, cardPaymentRequest);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error paying payment invoice", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
