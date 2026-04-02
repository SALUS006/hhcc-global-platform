package com.hhcc.payment.controller;

import com.hhcc.payment.dto.PaymentInvoiceRequest;
import com.hhcc.payment.dto.PaymentInvoiceResponse;
import com.hhcc.payment.service.PaymentInvoiceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

            PaymentInvoiceResponse response = paymentInvoiceService.createAndProcessPayment(request);
            
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
    @GetMapping("/invoices/{bookingId}")
    public ResponseEntity<PaymentInvoiceResponse> getInvoiceByBookingId(
            @PathVariable("bookingId") Long bookingId) {
        
        log.info("GET payment invoice request - bookingId: {}", bookingId);

        try {
            PaymentInvoiceResponse response = paymentInvoiceService.getInvoiceByBookingId(bookingId);
            
            log.info("Payment invoice retrieved successfully for bookingId: {}", bookingId);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.warn("Invoice not found for bookingId: {}", bookingId);
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
            if (("Invoice not found: " + id).equals(e.getMessage())) {
                return ResponseEntity.notFound().build();
            } else {
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            log.error("Error refunding payment invoice", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
