-- Mock Users
INSERT INTO user_profile (full_name, email, role, contact_number, created_by, updated_by) VALUES
('System Admin', 'admin@hhcc.com', 'Admin', '555-0100', 1, 1),
('John Doe', 'john.doe@email.com', 'Customer', '555-0101', 1, 1),
('Jane Smith', 'jane.smith@email.com', 'Customer', '555-0102', 1, 1)
ON CONFLICT DO NOTHING;

-- Mock Facilities
INSERT INTO care_facility (facility_name, location_address, description, photo_url, created_by, updated_by) VALUES
('Downtown Pet Care', '123 Main St, Metro City', 'Premium pet daycare and boarding.', 'pet-url', 1, 1),
('Sunset Elderly Care', '456 West Ave, Metro City', 'Compassionate community elderly care center.', 'elderly-url', 1, 1);

-- Mock Bookings (Using hardcoded timestamp offsets for PostgreSQL)
INSERT INTO care_booking (user_id, facility_id, pickup_time, dropoff_time, status, created_by, updated_by) VALUES
(2, 1, CURRENT_TIMESTAMP + interval '1 day', CURRENT_TIMESTAMP + interval '2 days', 'Confirmed', 2, 2),
(3, 2, CURRENT_TIMESTAMP + interval '3 days', CURRENT_TIMESTAMP + interval '4 days', 'Pending', 3, 3);

-- Mock Invoices
INSERT INTO payment_invoice (booking_id, amount, status, created_by, updated_by) VALUES
(1, 150.00, 'Paid', 2, 2),
(2, 500.00, 'Unpaid', 3, 3);
