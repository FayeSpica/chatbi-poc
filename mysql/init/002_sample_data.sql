-- Sample data for users, products, orders, and order_items tables
-- This file should be executed after 001_schema.sql

-- Insert sample users
INSERT INTO users (id, username, email, first_name, last_name, phone, address, is_active) VALUES
(1001, 'john_doe', 'john.doe@email.com', 'John', 'Doe', '+1-555-0101', '123 Main St, New York, NY 10001', TRUE),
(1002, 'jane_smith', 'jane.smith@email.com', 'Jane', 'Smith', '+1-555-0102', '456 Oak Ave, Los Angeles, CA 90001', TRUE),
(1003, 'mike_johnson', 'mike.johnson@email.com', 'Mike', 'Johnson', '+1-555-0103', '789 Pine Rd, Chicago, IL 60601', TRUE),
(1004, 'sarah_wilson', 'sarah.wilson@email.com', 'Sarah', 'Wilson', '+1-555-0104', '321 Elm St, Houston, TX 77001', FALSE),
(1005, 'david_brown', 'david.brown@email.com', 'David', 'Brown', '+1-555-0105', '654 Maple Dr, Phoenix, AZ 85001', TRUE),
(1006, 'lisa_davis', 'lisa.davis@email.com', 'Lisa', 'Davis', '+1-555-0106', '987 Cedar Ln, Philadelphia, PA 19101', TRUE),
(1007, 'tom_miller', 'tom.miller@email.com', 'Tom', 'Miller', '+1-555-0107', '147 Birch Way, San Antonio, TX 78201', TRUE);

-- Insert sample products
INSERT INTO products (name, description, category, price, stock_quantity, is_active) VALUES
('iPhone 15 Pro', 'Latest iPhone with A17 Pro chip and titanium design', 'Electronics', 999.99, 50, TRUE),
('MacBook Pro M3', 'Powerful laptop with M3 chip for professional use', 'Electronics', 2499.00, 25, TRUE),
('AirPods Pro', 'Wireless earbuds with active noise cancellation', 'Electronics', 249.99, 100, TRUE),
('Nike Air Max 270', 'Comfortable running shoes with air cushioning', 'Shoes', 150.00, 75, TRUE),
('Adidas Ultraboost 22', 'Premium running shoes with boost technology', 'Shoes', 180.00, 60, TRUE),
('Levi''s 501 Jeans', 'Classic straight-fit denim jeans', 'Clothing', 89.99, 120, TRUE),
('Columbia Winter Jacket', 'Waterproof winter jacket for outdoor activities', 'Clothing', 199.99, 40, TRUE),
('The Great Gatsby', 'Classic American novel by F. Scott Fitzgerald', 'Books', 12.99, 200, TRUE),
('To Kill a Mockingbird', 'Timeless novel by Harper Lee', 'Books', 14.99, 150, TRUE),
('1984', 'Dystopian novel by George Orwell', 'Books', 13.99, 180, TRUE),
('Organic Coffee Beans', 'Premium organic coffee beans from Ethiopia', 'Food', 24.99, 90, TRUE),
('Premium Green Tea', 'High-quality green tea leaves from Japan', 'Food', 18.99, 110, TRUE),
('Wireless Gaming Mouse', 'High-precision gaming mouse with RGB lighting', 'Electronics', 79.99, 80, TRUE),
('Mechanical Keyboard', 'Tactile mechanical keyboard for gaming and typing', 'Electronics', 129.99, 45, TRUE),
('Yoga Mat', 'Non-slip yoga mat for exercise and meditation', 'Sports', 39.99, 95, TRUE),
('Dumbbell Set 20kg', 'Adjustable dumbbell set for home workouts', 'Sports', 89.99, 30, TRUE),
('Stainless Steel Water Bottle', 'Insulated water bottle keeps drinks cold/hot', 'Home', 29.99, 150, TRUE),
('Cotton Bed Sheets', 'Soft cotton bed sheets for comfortable sleep', 'Home', 59.99, 85, TRUE),
('Essential Oil Diffuser', 'Ultrasonic diffuser for aromatherapy', 'Home', 49.99, 65, TRUE),
('Bluetooth Speaker', 'Portable speaker with excellent sound quality', 'Electronics', 99.99, 70, FALSE);

-- Insert sample orders
INSERT INTO orders (user_id, order_number, total_amount, status) VALUES
(1001, 'ORD202401150001', 1249.98, 'delivered'),  -- Order 1: iPhone + AirPods
(1002, 'ORD202401150002', 2499.00, 'shipped'),    -- Order 2: MacBook Pro
(1003, 'ORD202401150003', 330.00, 'delivered'),   -- Order 3: Nike shoes + Adidas shoes
(1001, 'ORD202401150004', 102.98, 'paid'),        -- Order 4: Jeans + Book
(1004, 'ORD202401150005', 289.97, 'cancelled'),   -- Order 5: Winter jacket + Coffee + Tea
(1005, 'ORD202401150006', 209.98, 'delivered'),   -- Order 6: Gaming mouse + Keyboard
(1002, 'ORD202401150007', 129.97, 'shipped'),     -- Order 7: Yoga mat + Water bottle + Diffuser
(1006, 'ORD202401150008', 159.98, 'delivered'),   -- Order 8: Dumbbell set + Bed sheets
(1003, 'ORD202401150009', 99.99, 'pending'),      -- Order 9: Bluetooth speaker
(1007, 'ORD202401150010', 41.97, 'delivered');    -- Order 10: Books bundle

-- Insert sample order items
-- Order 1 items (user_id: 1001, total: 1249.98)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(1, 1, 1, 999.99),  -- iPhone 15 Pro
(1, 3, 1, 249.99);  -- AirPods Pro

-- Order 2 items (user_id: 1002, total: 2499.00)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(2, 2, 1, 2499.00); -- MacBook Pro M3

-- Order 3 items (user_id: 1003, total: 330.00)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(3, 4, 1, 150.00),  -- Nike Air Max 270
(3, 5, 1, 180.00);  -- Adidas Ultraboost 22

-- Order 4 items (user_id: 1001, total: 102.98)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(4, 6, 1, 89.99),   -- Levi's 501 Jeans
(4, 8, 1, 12.99);   -- The Great Gatsby

-- Order 5 items (user_id: 1004, total: 289.97)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(5, 7, 1, 199.99),  -- Columbia Winter Jacket
(5, 11, 2, 24.99),  -- Organic Coffee Beans (quantity: 2)
(5, 12, 2, 18.99);  -- Premium Green Tea (quantity: 2)

-- Order 6 items (user_id: 1005, total: 209.98)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(6, 13, 1, 79.99),  -- Wireless Gaming Mouse
(6, 14, 1, 129.99); -- Mechanical Keyboard

-- Order 7 items (user_id: 1002, total: 129.97)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(7, 15, 1, 39.99),  -- Yoga Mat
(7, 17, 1, 29.99),  -- Stainless Steel Water Bottle
(7, 19, 1, 49.99);  -- Essential Oil Diffuser

-- Order 8 items (user_id: 1006, total: 159.98)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(8, 16, 1, 89.99),  -- Dumbbell Set 20kg
(8, 18, 1, 59.99);  -- Cotton Bed Sheets

-- Order 9 items (user_id: 1003, total: 99.99)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(9, 20, 1, 99.99);  -- Bluetooth Speaker

-- Order 10 items (user_id: 1007, total: 41.97)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(10, 8, 1, 12.99),  -- The Great Gatsby
(10, 9, 1, 14.99),  -- To Kill a Mockingbird
(10, 10, 1, 13.99); -- 1984