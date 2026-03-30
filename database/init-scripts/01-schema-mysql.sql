CREATE DATABASE IF NOT EXISTS hhcc_db;
USE hhcc_db;

-- ============================================================
-- TABLE: user_profile
-- Owner: Profile & Identity Service (MS1)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_profile (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name   VARCHAR(255) NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role        VARCHAR(50) NOT NULL COMMENT 'ADMIN, CUSTOMER, STAFF',
    contact_number VARCHAR(50),
    created_dt  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by  BIGINT,
    updated_dt  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by  BIGINT
);

-- ============================================================
-- TABLE: family_member
-- Owner: Profile & Identity Service (MS1)
-- Use Cases: UC#3 (Add Family Member), UC#4 (Manage Family Members)
-- ============================================================
CREATE TABLE IF NOT EXISTS family_member (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT NOT NULL COMMENT 'References user_profile (account owner)',
    full_name    VARCHAR(255) NOT NULL,
    relationship VARCHAR(100) NOT NULL COMMENT 'Child, Spouse, Parent, Sibling, Other',
    date_of_birth DATE,
    care_type    VARCHAR(50) NOT NULL COMMENT 'CHILDCARE, ELDERLY',
    medical_notes TEXT,
    created_dt   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by   BIGINT,
    updated_dt   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by   BIGINT,
    FOREIGN KEY (user_id) REFERENCES user_profile(id),
    FOREIGN KEY (created_by) REFERENCES user_profile(id),
    FOREIGN KEY (updated_by) REFERENCES user_profile(id)
);

-- ============================================================
-- TABLE: pet_profile
-- Owner: Profile & Identity Service (MS1)
-- Use Cases: UC#5 (Add Pet), UC#6 (Manage Pets)
-- ============================================================
CREATE TABLE IF NOT EXISTS pet_profile (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT NOT NULL COMMENT 'References user_profile (account owner)',
    pet_name     VARCHAR(255) NOT NULL,
    species      VARCHAR(100) NOT NULL COMMENT 'Dog, Cat, Bird, Other',
    breed        VARCHAR(100),
    age_years    INT,
    medical_notes TEXT,
    created_dt   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by   BIGINT,
    updated_dt   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by   BIGINT,
    FOREIGN KEY (user_id) REFERENCES user_profile(id),
    FOREIGN KEY (created_by) REFERENCES user_profile(id),
    FOREIGN KEY (updated_by) REFERENCES user_profile(id)
);

-- ============================================================
-- TABLE: care_facility
-- Owner: Facility & Scheduling Service (MS2)
-- ============================================================
CREATE TABLE IF NOT EXISTS care_facility (
    id                   BIGINT AUTO_INCREMENT PRIMARY KEY,
    facility_name        VARCHAR(255) NOT NULL,
    location_address     TEXT NOT NULL,
    description          TEXT,
    photo_url            VARCHAR(255),
    supported_care_types VARCHAR(100) COMMENT 'CHILDCARE, PET, ELDERLY (comma-separated)',
    is_active            BOOLEAN DEFAULT TRUE,
    created_dt           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by           BIGINT,
    updated_dt           TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by           BIGINT,
    FOREIGN KEY (created_by) REFERENCES user_profile(id),
    FOREIGN KEY (updated_by) REFERENCES user_profile(id)
);

-- ============================================================
-- TABLE: care_booking
-- Owner: Facility & Scheduling Service (MS2)
-- Use Cases: UC#7 (Schedule for Family Member), UC#8 (Schedule for Pet)
-- ============================================================
CREATE TABLE IF NOT EXISTS care_booking (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id        BIGINT NOT NULL COMMENT 'Account owner placing the booking',
    facility_id    BIGINT NOT NULL,
    care_type      VARCHAR(50) NOT NULL COMMENT 'CHILDCARE, PET, ELDERLY',
    dependent_type VARCHAR(50) NOT NULL COMMENT 'FAMILY_MEMBER, PET',
    dependent_id   BIGINT NOT NULL COMMENT 'FK to family_member.id or pet_profile.id',
    pickup_time    TIMESTAMP NOT NULL,
    dropoff_time   TIMESTAMP NOT NULL,
    status         VARCHAR(50) DEFAULT 'PENDING' COMMENT 'PENDING, CONFIRMED, COMPLETED, CANCELLED',
    notes          TEXT,
    created_dt     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by     BIGINT,
    updated_dt     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by     BIGINT,
    FOREIGN KEY (user_id) REFERENCES user_profile(id),
    FOREIGN KEY (facility_id) REFERENCES care_facility(id),
    FOREIGN KEY (created_by) REFERENCES user_profile(id),
    FOREIGN KEY (updated_by) REFERENCES user_profile(id)
);

-- ============================================================
-- TABLE: payment_invoice
-- Owner: Payment Service (MS3)
-- Use Case: UC#9 (Make Payment)
-- ============================================================
CREATE TABLE IF NOT EXISTS payment_invoice (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id     BIGINT NOT NULL,
    amount         DECIMAL(10, 2) NOT NULL,
    currency       VARCHAR(10) DEFAULT 'USD',
    payment_date   TIMESTAMP NULL,
    payment_method VARCHAR(50) DEFAULT 'MOCK' COMMENT 'MOCK, CREDIT_CARD, PAYPAL',
    status         VARCHAR(50) DEFAULT 'UNPAID' COMMENT 'UNPAID, PAID, REFUNDED',
    created_dt     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by     BIGINT,
    updated_dt     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by     BIGINT,
    FOREIGN KEY (booking_id) REFERENCES care_booking(id),
    FOREIGN KEY (created_by) REFERENCES user_profile(id),
    FOREIGN KEY (updated_by) REFERENCES user_profile(id)
);

-- ============================================================
-- TABLE: user_feedback
-- Owner: Profile & Identity Service (MS1)
-- Use Case: UC#11 (Feedback & Support Screen)
-- Note: user_id is nullable to support unregistered/guest feedback
-- ============================================================
CREATE TABLE IF NOT EXISTS user_feedback (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id       BIGINT NULL COMMENT 'NULL allowed for guest/unregistered users',
    facility_id   BIGINT NULL COMMENT 'Optional: feedback tied to a facility',
    booking_id    BIGINT NULL COMMENT 'Optional: feedback tied to a booking',
    rating        TINYINT COMMENT '1–5 stars',
    comments      TEXT,
    feedback_type VARCHAR(50) COMMENT 'SERVICE, APP, FACILITY, SUPPORT',
    status        VARCHAR(50) DEFAULT 'SUBMITTED' COMMENT 'SUBMITTED, REVIEWED, ACTIONED',
    created_dt    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by    BIGINT NULL,
    updated_dt    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by    BIGINT NULL,
    FOREIGN KEY (user_id) REFERENCES user_profile(id),
    FOREIGN KEY (facility_id) REFERENCES care_facility(id),
    FOREIGN KEY (booking_id) REFERENCES care_booking(id)
);

-- ============================================================
-- TABLE: service_notification
-- Owner: Profile & Identity Service (MS1)
-- Use Case: UC#10 (Send Email Notification)
-- ============================================================
CREATE TABLE IF NOT EXISTS service_notification (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id           BIGINT NOT NULL,
    event_type        VARCHAR(100) NOT NULL COMMENT 'REGISTRATION, BOOKING_CONFIRMED, BOOKING_CANCELLED, PAYMENT_RECEIVED, REMINDER',
    channel           VARCHAR(20) NOT NULL DEFAULT 'EMAIL' COMMENT 'EMAIL, SMS',
    recipient_address VARCHAR(255) NOT NULL,
    status            VARCHAR(50) DEFAULT 'PENDING' COMMENT 'PENDING, SENT, FAILED',
    sent_dt           TIMESTAMP NULL,
    created_dt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_profile(id)
);
