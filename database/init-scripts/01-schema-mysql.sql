CREATE DATABASE IF NOT EXISTS hhcc;
USE hhcc;

CREATE TABLE IF NOT EXISTS user_profile (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL,
    contact_number VARCHAR(50),
    created_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by BIGINT
);

CREATE TABLE IF NOT EXISTS care_facility (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    facility_name VARCHAR(255) NOT NULL,
    location_address TEXT NOT NULL,
    description TEXT,
    photo_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by BIGINT,
    FOREIGN KEY (created_by) REFERENCES user_profile(id),
    FOREIGN KEY (updated_by) REFERENCES user_profile(id)
);

CREATE TABLE IF NOT EXISTS care_booking (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    facility_id BIGINT,
    pickup_time TIMESTAMP NOT NULL,
    dropoff_time TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    created_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by BIGINT,
    FOREIGN KEY (user_id) REFERENCES user_profile(id),
    FOREIGN KEY (facility_id) REFERENCES care_facility(id),
    FOREIGN KEY (created_by) REFERENCES user_profile(id),
    FOREIGN KEY (updated_by) REFERENCES user_profile(id)
);

CREATE TABLE IF NOT EXISTS payment_invoice (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    payment_date TIMESTAMP NULL,
    status VARCHAR(50) DEFAULT 'Unpaid',
    created_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by BIGINT,
    FOREIGN KEY (booking_id) REFERENCES care_booking(id),
    FOREIGN KEY (created_by) REFERENCES user_profile(id),
    FOREIGN KEY (updated_by) REFERENCES user_profile(id)
);
