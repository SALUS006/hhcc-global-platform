USE hhcc;

-- Mock Users
INSERT IGNORE INTO user_profile (full_name, email, role, contact_number, created_by, updated_by) VALUES
('System Admin', 'admin@hhcc.com', 'Admin', '555-0100', 1, 1),
('John Doe', 'john.doe@email.com', 'Customer', '555-0101', 1, 1),
('Jane Smith', 'jane.smith@email.com', 'Customer', '555-0102', 1, 1);

-- Mock Facilities
INSERT IGNORE INTO care_facility (facility_name, location_address, description, photo_url, created_by, updated_by) VALUES
('Downtown Pet Care', '123 Main St, Metro City', 'Premium pet daycare and boarding.', 'pet-url', 1, 1),
('Sunset Elderly Care', '456 West Ave, Metro City', 'Compassionate community elderly care center.', 'elderly-url', 1, 1);

-- Mock Bookings 
INSERT IGNORE INTO care_booking (user_id, facility_id, pickup_time, dropoff_time, status, created_by, updated_by) VALUES
(2, 1, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 DAY), DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 2 DAY), 'Confirmed', 2, 2),
(3, 2, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 3 DAY), DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 4 DAY), 'Pending', 3, 3);

-- Mock Invoices
INSERT IGNORE INTO payment_invoice (booking_id, amount, status, created_by, updated_by) VALUES
(1, 150.00, 'Paid', 2, 2),
(2, 500.00, 'Unpaid', 3, 3);
