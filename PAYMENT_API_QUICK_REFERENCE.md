# Payment Service API - Quick Reference Guide

## Service Endpoints

### Base URL
```
http://localhost:8082/api/v1
```

---

## API Endpoints

### 1. Health Check
```
GET /payment/health
```
**Response (200 OK)**:
```json
{
  "service": "UP",
  "database": "CONNECTED"
}
```

---

### 2. Create Payment Invoice
```
POST /payment/invoices
Content-Type: application/json
```

**Request Body**:
```json
{
  "bookingId": 1,
  "amount": 120.00,
  "currency": "USD",
  "paymentMethod": "MOCK"
}
```

**Response (201 Created)**:
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

**Possible Errors**:
- `400 Bad Request`: Missing required fields (bookingId, amount)
- `404 Not Found`: Booking not found
- `500 Internal Server Error`: Server error

---

### 3. Get Payment Invoice by Booking ID
```
GET /payment/invoices/{bookingId}
```

**Path Parameters**:
- `bookingId` (long): The booking ID

**Response (200 OK)**:
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

**Possible Errors**:
- `404 Not Found`: Invoice not found for the booking
- `500 Internal Server Error`: Server error

---

### 4. Refund Payment Invoice
```
POST /payment/invoices/{id}/refund
```

**Path Parameters**:
- `id` (long): The invoice ID to refund

**Response (200 OK)**:
```json
{
  "id": 1,
  "bookingId": 1,
  "amount": 120.00,
  "currency": "USD",
  "paymentDate": "2026-03-31T10:30:00",
  "paymentMethod": "MOCK",
  "status": "REFUNDED",
  "createdDt": "2026-03-31T10:30:00",
  "updatedDt": "2026-03-31T10:30:00"
}
```

**Possible Errors**:
- `404 Not Found`: Invoice not found
- `400 Bad Request`: Invoice already refunded or other validation error
- `500 Internal Server Error`: Server error

---

## cURL Examples

### Health Check
```bash
curl -X GET http://localhost:8082/api/v1/payment/health
```

### Create Payment Invoice
```bash
curl -X POST http://localhost:8082/api/v1/payment/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": 1,
    "amount": 120.00,
    "currency": "USD",
    "paymentMethod": "MOCK"
  }'
```

### Get Invoice by Booking ID
```bash
curl -X GET http://localhost:8082/api/v1/payment/invoices/1
```

### Refund Invoice
```bash
curl -X POST http://localhost:8082/api/v1/payment/invoices/1/refund
```

---

## Payment Method Options

| Method | Description | Status in MVP |
|--------|-------------|---------------|
| MOCK | Mock payment (no real transaction) | ✅ Supported (default) |
| CREDIT_CARD | Credit card payment | ⏳ Post-MVP |
| PAYPAL | PayPal payment | ⏳ Post-MVP |

---

## Invoice Status Values

| Status | Description |
|--------|-------------|
| UNPAID | Invoice created but not yet paid |
| PAID | Payment successfully processed |
| REFUNDED | Payment refunded |

---

## Database Schema

### payment_invoice Table
```sql
CREATE TABLE payment_invoice (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  booking_id BIGINT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_date DATETIME NULL,
  payment_method VARCHAR(50),
  status VARCHAR(20),
  created_dt DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by BIGINT,
  updated_dt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by BIGINT,
  FOREIGN KEY (booking_id) REFERENCES care_booking(id)
);
```

---

## Java Classes Overview

### Controllers
- **HealthController**: Manages health check endpoint
- **PaymentInvoiceController**: Handles all payment invoice operations

### DTOs
- **PaymentInvoiceRequest**: Request payload for creating invoices
- **PaymentInvoiceResponse**: Response payload for API responses

### Entities
- **PaymentInvoice**: Data model for payment_invoice table

### Services
- **PaymentInvoiceService**: Business logic layer

### Repositories
- **PaymentInvoiceRepository**: Data access layer using JdbcTemplate

---

## Error Response Format

All errors follow a standard format through HTTP status codes with optional JSON details in response body.

**Example 400 Bad Request**:
```json
{
  "timestamp": "2026-03-31T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid request payload"
}
```

---

## Maven Build & Run

### Build
```bash
cd spring-microservices/payment-service
mvn clean package -DskipTests
```

### Run Locally
```bash
mvn spring-boot:run
```

### Package as JAR
```bash
java -jar target/payment-service-1.0.0.jar
```

---

## Docker Deployment

### Start All Services
```bash
docker-compose -f docker-compose.full.yml up -d
```

### Stop All Services
```bash
docker-compose -f docker-compose.full.yml down
```

### View Logs
```bash
docker-compose -f docker-compose.full.yml logs -f ms-payment-service
```

---

## Configuration

### application.properties
```properties
server.port=8082
spring.application.name=payment-service
spring.datasource.url=jdbc:mysql://${DB_HOST:localhost}:3306/hhcc_db?allowPublicKeyRetrieval=true&useSSL=false
spring.datasource.username=root
spring.datasource.password=hhcc_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

### Environment Variables
- `DB_HOST`: Database host (default: localhost)

---

*Last Updated: March 31, 2026*
*Payment Service v1.0.0*
