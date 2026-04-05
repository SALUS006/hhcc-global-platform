USE hhcc_db;

-- ============================================================
-- Mock Users (1 Admin, 2 Customers)
-- ============================================================
INSERT IGNORE INTO user_profile (id, full_name, email, password_hash, role, contact_number, created_by, updated_by) VALUES
(1, 'System Admin',  'admin@hhcc.com',      'mock_hash_admin', 'ADMIN',    '555-0100', 1, 1),
(2, 'John Doe',      'john.doe@email.com',  'mock_hash_john',  'CUSTOMER', '555-0101', 1, 1),
(3, 'Jane Smith',    'jane.smith@email.com','mock_hash_jane',  'CUSTOMER', '555-0102', 1, 1);

-- ============================================================
-- Mock Family Members (linked to John Doe & Jane Smith)
-- ============================================================
INSERT IGNORE INTO family_member (id, user_id, full_name, relationship, date_of_birth, care_type, medical_notes, created_by, updated_by) VALUES
(1, 2, 'Tommy Doe',   'Child',  '2018-04-12', 'CHILDCARE', 'No known allergies.',      2, 2),
(2, 2, 'Mary Doe',    'Parent', '1952-08-30', 'ELDERLY',   'Requires wheelchair access.', 2, 2),
(3, 3, 'Lily Smith',  'Child',  '2020-11-05', 'CHILDCARE', NULL,                        3, 3);

-- ============================================================
-- Mock Pets (linked to John Doe & Jane Smith)
-- ============================================================
INSERT IGNORE INTO pet_profile (id, user_id, pet_name, species, breed, age_years, medical_notes, created_by, updated_by) VALUES
(1, 2, 'Buddy', 'Dog', 'Golden Retriever', 3, 'Up to date on all vaccinations.', 2, 2),
(2, 3, 'Whiskers', 'Cat', 'Persian', 5, 'Indoor only, sensitive to certain foods.', 3, 3);

-- ============================================================
-- ============================================================
INSERT IGNORE INTO care_facility (id, facility_name, location_address, description, photo_url, supported_care_types, created_by, updated_by) VALUES
(1, 'Sunshine Childcare Center', '100 Oak Lane, Metro City',  'Accredited childcare and after-school programs.',       '/assets/childcare.jpg', 'CHILDCARE',      1, 1),
(2, 'Downtown Pet Care',         '123 Main St, Metro City',   'Premium pet daycare, grooming, and boarding.',          '/assets/petcare.jpg',   'PET',            1, 1),
(3, 'Sunset Elderly Care',       '456 West Ave, Metro City',  'Compassionate community elderly care and assisted living.', '/assets/elderly.jpg', 'ELDERLY',        1, 1),
(4, 'All-In-One Care Hub',       '789 Central Blvd, Metro City', 'Full-service center supporting childcare, pet, and elderly care.', '/assets/hub.jpg', 'CHILDCARE,PET,ELDERLY', 1, 1);

-- ============================================================
-- Mock Care Charges (per facility and supported care type)
-- ============================================================
-- Facility 1: CHILDCARE
INSERT IGNORE INTO care_charges (care_facility_id, supported_care_type, amount) VALUES (1, 'CHILDCARE', 50.00);
-- Facility 2: PET
INSERT IGNORE INTO care_charges (care_facility_id, supported_care_type, amount) VALUES (2, 'PET', 60.00);
-- Facility 3: ELDERLY
INSERT IGNORE INTO care_charges (care_facility_id, supported_care_type, amount) VALUES (3, 'ELDERLY', 70.00);
-- Facility 4: CHILDCARE, PET, ELDERLY
INSERT IGNORE INTO care_charges (care_facility_id, supported_care_type, amount) VALUES (4, 'CHILDCARE', 50.00);
INSERT IGNORE INTO care_charges (care_facility_id, supported_care_type, amount) VALUES (4, 'PET', 60.00);
INSERT IGNORE INTO care_charges (care_facility_id, supported_care_type, amount) VALUES (4, 'ELDERLY', 70.00);

-- ============================================================
-- Mock Bookings (covers childcare, pet, and elderly use cases)
-- ============================================================
INSERT IGNORE INTO care_booking (id, user_id, facility_id, care_type, dependent_type, dependent_id, pickup_time, dropoff_time, status, notes, created_by, updated_by) VALUES
(1, 2, 1, 'CHILDCARE', 'FAMILY_MEMBER', 1, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 DAY), DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 2 DAY), 'CONFIRMED', 'Please bring sunscreen.', 2, 2),
(2, 2, 2, 'PET',       'PET',           1, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 3 DAY), DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 4 DAY), 'PENDING',   'Buddy needs his midday walk.', 2, 2),
(3, 3, 3, 'ELDERLY',   'FAMILY_MEMBER', 2, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 2 DAY), DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 5 DAY), 'CONFIRMED', 'Medication schedule attached.', 3, 3),
(4, 3, 2, 'PET',       'PET',           2, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 DAY), DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 2 DAY), 'PENDING',   NULL, 3, 3);

-- ============================================================
-- Mock Invoices
-- ============================================================
INSERT IGNORE INTO payment_invoice (id, booking_id, amount, currency, payment_method, card_last4, card_expiry, cardholder_name, status, created_by, updated_by) VALUES
(1, 1, 120.00, 'USD', 'MOCK', NULL, NULL, NULL, 'PAID',   2, 2),
(2, 2,  80.00, 'USD', 'MOCK', NULL, NULL, NULL, 'UNPAID', 2, 2),
(3, 3, 500.00, 'USD', 'MOCK', NULL, NULL, NULL, 'PAID',   3, 3),
(4, 4,  75.00, 'USD', 'MOCK', NULL, NULL, NULL, 'UNPAID', 3, 3);

-- ============================================================
-- Mock Feedback
-- ============================================================
INSERT IGNORE INTO user_feedback (id, user_id, facility_id, booking_id, rating, comments, feedback_type, status) VALUES
(1, 2, 1, 1, 5, 'Tommy had a wonderful day! Highly recommend.', 'SERVICE',  'REVIEWED'),
(2, 3, 3, 3, 4, 'Staff were caring and professional.',          'FACILITY', 'SUBMITTED'),
(3, NULL, NULL, NULL, NULL, 'Is there a loyalty program available?', 'SUPPORT', 'SUBMITTED');

-- ============================================================
-- Mock Notifications
-- ============================================================
INSERT IGNORE INTO service_notification (id, user_id, event_type, channel, recipient_address, status, sent_dt) VALUES
(1, 2, 'REGISTRATION',       'EMAIL', 'john.doe@email.com',  'SENT', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 10 DAY)),
(2, 3, 'REGISTRATION',       'EMAIL', 'jane.smith@email.com','SENT', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 8 DAY)),
(3, 2, 'BOOKING_CONFIRMED',  'EMAIL', 'john.doe@email.com',  'SENT', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY)),
(4, 3, 'BOOKING_CONFIRMED',  'EMAIL', 'jane.smith@email.com','SENT', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY)),
(5, 2, 'PAYMENT_RECEIVED',   'EMAIL', 'john.doe@email.com',  'SENT', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY));
