# Agentic Prompt: Generate HHCC MySQL Database Initialization Scripts

**Instructions for GitHub Copilot / Agent**: 
Execute the following prompt to autonomously generate the exact MySQL database schemas and mock data scripts for the Helping Hands Care Center (HHCC) Platform MVP.

---

Generate a highly professional, "production-ready" MySQL 8.0 Initialization Script for the Helping Hands Care Center (HHCC) digital application based strictly on the approved unified data model.

Please carefully adhere to the following explicit constraints and formatting:

1. **Database Engine & Syntax Requirements:**
   - **Target Engine:** MySQL 8.0+ exclusively.
   - The script must begin with `CREATE DATABASE IF NOT EXISTS hhcc_db;` followed by `USE hhcc_db;`.

2. **Schema Definition Constraints (`01-schema-mysql.sql`):**
   - Primary Keys (`id`) must explicitly use `BIGINT AUTO_INCREMENT PRIMARY KEY`.
   - Every single schema table MUST include the following mandatory audit fields: 
     - `created_dt` initialized via `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`.
     - `updated_dt` initialized via `TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`.
     - `created_by` (BIGINT).
     - `updated_by` (BIGINT).
   - All `FOREIGN KEY` constraints must be declared properly to maintain referential integrity.
   - Utilize `CREATE TABLE IF NOT EXISTS` for idempotency.
   - Use SQL `COMMENT` annotations on key enum-style VARCHAR columns to describe allowed values.

3. **Entities to Generate (all 9 tables in strict creation order):**
   - **`user_profile`**: `full_name` (VARCHAR NOT NULL), `email` (VARCHAR UNIQUE NOT NULL), `password_hash` (VARCHAR), `role` (VARCHAR — values: ADMIN, CUSTOMER, STAFF), `contact_number` (VARCHAR).
   - **`family_member`**: `user_id` (FK to user_profile), `full_name` (VARCHAR NOT NULL), `relationship` (VARCHAR — Child, Spouse, Parent, Sibling, Other), `date_of_birth` (DATE), `care_type` (VARCHAR — CHILDCARE, ELDERLY), `medical_notes` (TEXT).
   - **`pet_profile`**: `user_id` (FK to user_profile), `pet_name` (VARCHAR NOT NULL), `species` (VARCHAR — Dog, Cat, Bird, Other), `breed` (VARCHAR), `age_years` (INT), `medical_notes` (TEXT).
   - **`care_facility`**: `facility_name` (VARCHAR NOT NULL), `location_address` (TEXT NOT NULL), `description` (TEXT), `photo_url` (VARCHAR), `supported_care_types` (VARCHAR — CHILDCARE, PET, ELDERLY, comma-separated), `is_active` (BOOLEAN DEFAULT TRUE).
   - **`care_charges`**: `care_facility_id` (FK to care_facility), `supported_care_type` (VARCHAR — CHILDCARE, PET, ELDERLY), `amount` (DECIMAL 10,2 NOT NULL).
   - **`care_booking`**: `user_id` (FK to user_profile), `facility_id` (FK to care_facility), `care_type` (VARCHAR — CHILDCARE, PET, ELDERLY), `dependent_type` (VARCHAR — FAMILY_MEMBER, PET), `dependent_id` (BIGINT — application-level FK to family_member.id or pet_profile.id), `pickup_time` (TIMESTAMP NOT NULL), `dropoff_time` (TIMESTAMP NOT NULL), `status` (VARCHAR DEFAULT 'PENDING' — PENDING, CONFIRMED, COMPLETED, CANCELLED), `notes` (TEXT).
   - **`payment_invoice`**: `booking_id` (FK to care_booking), `amount` (DECIMAL 10,2 NOT NULL), `currency` (VARCHAR DEFAULT 'USD'), `payment_date` (TIMESTAMP NULL), `payment_method` (VARCHAR DEFAULT 'MOCK' — MOCK, CREDIT_CARD, PAYPAL), `card_last4` (VARCHAR(4) — last 4 digits of card), `card_expiry` (VARCHAR(7) — MM/YYYY), `cardholder_name` (VARCHAR(100)), `status` (VARCHAR DEFAULT 'UNPAID' — UNPAID, PAID, REFUNDED). CVV is never stored for PCI compliance.
   - **`user_feedback`**: `user_id` (BIGINT NULL — nullable for guest users), `facility_id` (BIGINT NULL — optional FK to care_facility), `booking_id` (BIGINT NULL — optional FK to care_booking), `rating` (TINYINT 1–5), `comments` (TEXT), `feedback_type` (VARCHAR — SERVICE, APP, FACILITY, SUPPORT), `status` (VARCHAR DEFAULT 'SUBMITTED' — SUBMITTED, REVIEWED, ACTIONED). Note: `created_by` and `updated_by` must also be NULLABLE on this table.
   - **`service_notification`**: `user_id` (FK to user_profile), `event_type` (VARCHAR — REGISTRATION, BOOKING_CONFIRMED, BOOKING_CANCELLED, PAYMENT_RECEIVED, REMINDER), `channel` (VARCHAR DEFAULT 'EMAIL' — EMAIL, SMS), `recipient_address` (VARCHAR NOT NULL), `status` (VARCHAR DEFAULT 'PENDING' — PENDING, SENT, FAILED), `sent_dt` (TIMESTAMP NULL). Note: this table only requires `created_dt` (no `updated_dt`, `created_by`, or `updated_by`).

4. **Mock Data Generation Constraints (`02-mock-data-mysql.sql`):**
   - Must use `INSERT IGNORE INTO` syntax to ensure the script does not break upon Docker container restarts.
   - **Users**: Populate at least 3 users (1 Admin, 2 Customers) with hardcoded `id` values (1, 2, 3).
   - **Family Members**: Populate at least 2 family members per Customer — a mix of CHILDCARE and ELDERLY care_types.
   - **Pets**: Populate at least 1 pet per Customer covering different species.
   - **Facilities**: Populate at least 4 facilities covering each supported_care_types variant (CHILDCARE, PET, ELDERLY, and a combined hub).
   - **Care Charges**: For each facility, populate a row in `care_charges` for each supported care type (CHILDCARE = 50, PET = 60, ELDERLY = 70).
   - **Bookings**: Populate at least 4 bookings demonstrating all `care_type` values (CHILDCARE, PET, ELDERLY). Each booking must specify `care_type`, `dependent_type`, and `dependent_id` correctly.
   - **Invoices**: Populate invoices for every booking with a mix of PAID and UNPAID statuses.
   - **Feedback**: Populate at least 3 feedback rows — include at least 1 guest row where `user_id` is NULL.
   - **Notifications**: Populate at least 5 notification rows covering REGISTRATION, BOOKING_CONFIRMED, and PAYMENT_RECEIVED event types.
   - Use MySQL interval functions like `DATE_ADD(CURRENT_TIMESTAMP, INTERVAL X DAY)` for future-dating bookings.

Format the output artifact identically to SQL script files. Please return two distinct `sql` code blocks: one dedicated to DDL (Schema) and one dedicated to DML (Mock Data), suitable for direct implementation within the `/database/init-scripts/` docker volume.
