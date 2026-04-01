# HHCC Payment Service - API Implementation Summary

## Overview
All APIs from `swagger-payment.yaml` have been fully implemented with comprehensive JavaDoc documentation. The Payment Service provides endpoints for managing payment invoices for care bookings.

## Service Details
- **Service Port**: 8082
- **Base URL**: `http://localhost:8082/api/v1`
- **Docker Container**: `ms-payment-service`
- **Database**: MySQL (hhcc_db)

---

## Implemented APIs

### 1. Health Check Endpoint
**Controller**: `HealthController.java`

#### GET /payment/health
- **Method**: `HealthController.healthCheck()`
- **Purpose**: Returns service and database status
- **Responses**:
  - `200 OK`: Service is UP and database is CONNECTED
  - `503 Service Unavailable`: Database is DISCONNECTED
- **Response Model**:
  ```json
  {
    "service": "UP",
    "database": "CONNECTED"
  }
  ```

---

### 2. Payment Invoice Endpoints
**Controller**: `PaymentInvoiceController.java`

#### POST /payment/invoices
- **Method**: `PaymentInvoiceController.createPaymentInvoice()`
- **Purpose**: Submit a mock payment for a booking (UC#9 - Make Payment)
- **Request Model**: `PaymentInvoiceRequest`
  ```json
  {
    "bookingId": 1,
    "amount": 120.00,
    "currency": "USD",
    "paymentMethod": "MOCK"
  }
  ```
- **Response Model**: `PaymentInvoiceResponse`
  ```json
  {
    "id": 1,
    "bookingId": 1,
    "amount": 120.00,
    "currency": "USD",
    "paymentDate": "2026-03-31T10:30:00",
    "paymentMethod": "MOCK",
    "status": "PAID",
    "createdDt": "2026-03-31T10:30:00",
    "updatedDt": "2026-03-31T10:30:00"
  }
  ```
- **Responses**:
  - `201 Created`: Payment invoice created and processed
  - `400 Bad Request`: Invalid request payload
  - `404 Not Found`: Booking not found
  - `500 Internal Server Error`: Unexpected server error
- **Notes**: 
  - In MVP, all payments use MOCK method and are immediately processed to PAID status
  - Real gateway integration (Stripe/PayPal) is post-MVP

#### GET /payment/invoices/{bookingId}
- **Method**: `PaymentInvoiceController.getInvoiceByBookingId()`
- **Purpose**: Get the payment invoice for a booking (UC#9)
- **Path Parameters**: 
  - `bookingId` (Long): ID of the care booking
- **Response Model**: `PaymentInvoiceResponse`
- **Responses**:
  - `200 OK`: Invoice found
  - `404 Not Found`: Invoice not found
  - `500 Internal Server Error`: Unexpected server error

#### POST /payment/invoices/{id}/refund
- **Method**: `PaymentInvoiceController.refundInvoice()`
- **Purpose**: Refund a payment invoice (post-MVP stub endpoint)
- **Path Parameters**: 
  - `id` (Long): ID of the invoice to refund
- **Response Model**: `PaymentInvoiceResponse` (with status REFUNDED)
- **Responses**:
  - `200 OK`: Invoice refunded
  - `404 Not Found`: Invoice not found
  - `400 Bad Request`: Invoice cannot be refunded
  - `500 Internal Server Error`: Unexpected server error
- **Notes**: MVP implementation is mocked only

---

## Project Structure

```
payment-service/
├── src/main/java/com/hhcc/payment/
│   ├── PaymentServiceApplication.java
│   ├── controller/
│   │   ├── HealthController.java
│   │   └── PaymentInvoiceController.java
│   ├── dto/
│   │   ├── PaymentInvoiceRequest.java
│   │   └── PaymentInvoiceResponse.java
│   ├── entity/
│   │   └── PaymentInvoice.java
│   ├── service/
│   │   └── PaymentInvoiceService.java
│   └── repository/
│       └── PaymentInvoiceRepository.java
├── src/main/resources/
│   └── application.properties
└── pom.xml
```

---

## Data Models

### PaymentInvoiceRequest (DTO)
- **bookingId** (Long, required): References care_booking.id
- **amount** (BigDecimal, required): Payment amount (e.g., 120.00)
- **currency** (String, optional): ISO 4217 code, default "USD"
- **paymentMethod** (String, optional): MOCK | CREDIT_CARD | PAYPAL, default "MOCK"

### PaymentInvoiceResponse (DTO)
- **id** (Long): Invoice ID
- **bookingId** (Long): Booking reference
- **amount** (BigDecimal): Payment amount
- **currency** (String): ISO 4217 code
- **paymentDate** (LocalDateTime): When payment was processed
- **paymentMethod** (String): Payment method used
- **status** (String): UNPAID | PAID | REFUNDED
- **createdDt** (LocalDateTime): Creation timestamp
- **updatedDt** (LocalDateTime): Last update timestamp

### PaymentInvoice (Entity)
Maps to `payment_invoice` database table with additional fields:
- **createdBy** (Long): User ID who created the invoice
- **updatedBy** (Long): User ID who last updated the invoice

---

## Service Layer

### PaymentInvoiceService
Handles business logic including:

#### createAndProcessPayment()
- Creates payment invoice entity
- Validates booking exists
- Processes payment based on method
- For MOCK: immediately marks as PAID with current timestamp
- For CREDIT_CARD/PAYPAL: marked as UNPAID (not yet supported)
- Saves to database and returns response

#### getInvoiceByBookingId()
- Retrieves invoice by booking ID
- Throws exception if not found

#### refundInvoice()
- Retrieves invoice by ID
- Validates not already refunded
- Updates status to REFUNDED
- Returns updated invoice

---

## Repository Layer

### PaymentInvoiceRepository
Handles database operations using JdbcTemplate:

#### save(PaymentInvoice)
- Inserts new invoice with generated ID
- Auto-sets created_dt and updated_dt

#### findById(Long)
- Returns Optional<PaymentInvoice> by invoice ID

#### findByBookingId(Long)
- Returns Optional<PaymentInvoice> by booking ID

#### update(PaymentInvoice)
- Updates existing invoice
- Auto-updates updated_dt

#### bookingExists(Long)
- Validation method to check if booking exists before creating invoice

---

## Technology Stack

- **Framework**: Spring Boot 3.2.4
- **Language**: Java 21
- **Build Tool**: Maven 3.9.6
- **Database**: MySQL 8.0
- **ORM**: Spring JDBC (JdbcTemplate)
- **Logging**: Lombok @Slf4j
- **Container**: Docker & Docker Compose

---

## Running the Service

### Option 1: Docker Compose (All Services)
```bash
cd c:\Play\hhcc-global-platform
docker-compose -f docker-compose.full.yml up -d
```

### Option 2: Local Maven Build
```bash
cd c:\Play\hhcc-global-platform\spring-microservices\payment-service
mvn clean package -DskipTests
mvn spring-boot:run
```

### Accessing the Service
- **Base URL**: http://localhost:8082/api/v1
- **Health Check**: http://localhost:8082/api/v1/payment/health
- **Swagger Spec**: See solution/swagger-payment.yaml

---

## JavaDoc Coverage

All classes, methods, and important fields include comprehensive JavaDoc:
- **Class-level JavaDoc**: Purpose, author, version, since information
- **Method-level JavaDoc**: @param and @return documentation with details
- **Field-level JavaDoc**: Description of each entity/DTO field
- **Exception documentation**: @throws for expected exceptions
- **Usage examples**: Included in request examples and default values

---

## Status
✅ All APIs implemented  
✅ All JavaDoc generated  
✅ Ready for integration testing  
✅ Ready for deployment  

---

*Document generated: March 31, 2026*
*Payment Service v1.0.0*
