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

3. **Entities to Generate:**
   - **`user_profile`**: `full_name` (VARCHAR), `email` (VARCHAR UNIQUE), `role` (VARCHAR), `contact_number` (VARCHAR).
   - **`care_facility`**: `facility_name` (VARCHAR), `location_address` (TEXT), `description` (TEXT), `photo_url` (VARCHAR), `is_active` (BOOLEAN DEFAULT TRUE).
   - **`care_booking`**: `user_id` (FK to user_profile), `facility_id` (FK to care_facility), `pickup_time` (TIMESTAMP NOT NULL), `dropoff_time` (TIMESTAMP NOT NULL), `status` (VARCHAR DEFAULT 'Pending').
   - **`payment_invoice`**: `booking_id` (FK to care_booking), `amount` (DECIMAL 10,2 NOT NULL), `currency` (VARCHAR DEFAULT 'USD'), `payment_date` (TIMESTAMP NULL), `status` (VARCHAR DEFAULT 'Unpaid').

4. **Mock Data Generation Constraints (`02-mock-data-mysql.sql`):**
   - Must use `INSERT IGNORE INTO` syntax to ensure the script does not break upon Docker container restarts.
   - **Users**: Populate at least 3 users (1 Admin, 2 Customers).
   - **Facilities**: Populate at least 2 distinct care facilities (e.g., Pet Care, Elderly Care).
   - **Bookings**: Populate at least 2 care bookings using MySQL interval functions like `DATE_ADD(CURRENT_TIMESTAMP, INTERVAL X DAY)` for future dating.
   - **Invoices**: Populate corresponding invoices for the mocked bookings.

Format the output artifact identically to SQL script files. Please return two distinct `sql` code blocks: one dedicated to DDL (Schema) and one dedicated to DML (Mock Data), suitable for direct implementation within the `/database/init-scripts/` docker volume.
