CREATE TABLE IF NOT EXISTS user_profile (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL,
    contact_number VARCHAR(50),
    created_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by BIGINT
);

CREATE TABLE IF NOT EXISTS care_facility (
    id BIGSERIAL PRIMARY KEY,
    facility_name VARCHAR(255) NOT NULL,
    location_address TEXT NOT NULL,
    description TEXT,
    photo_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES user_profile(id),
    updated_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by BIGINT REFERENCES user_profile(id)
);

CREATE TABLE IF NOT EXISTS care_booking (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES user_profile(id),
    facility_id BIGINT REFERENCES care_facility(id),
    pickup_time TIMESTAMP NOT NULL,
    dropoff_time TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    created_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES user_profile(id),
    updated_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by BIGINT REFERENCES user_profile(id)
);

CREATE TABLE IF NOT EXISTS payment_invoice (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT REFERENCES care_booking(id),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    payment_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Unpaid',
    created_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES user_profile(id),
    updated_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by BIGINT REFERENCES user_profile(id)
);
