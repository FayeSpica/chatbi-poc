-- Sample data for users, products, orders, and order_items tables
-- This file should be executed after 001_schema.sql

-- Insert sample users
INSERT INTO users (id, username, email, first_name, last_name, phone, address) VALUES
(1001, 'john_doe', 'john.doe@email.com', 'John', 'Doe', '+1-555-0101', '123 Main St, New York, NY 10001'),
(1002, 'jane_smith', 'jane.smith@email.com', 'Jane', 'Smith', '+1-555-0102', '456 Oak Ave, Los Angeles, CA 90001'),
(1003, 'mike_johnson', 'mike.johnson@email.com', 'Mike', 'Johnson', '+1-555-0103', '789 Pine Rd, Chicago, IL 60601'),
(1004, 'sarah_wilson', 'sarah.wilson@email.com', 'Sarah', 'Wilson', '+1-555-0104', '321 Elm St, Houston, TX 77001'),
(1005, 'david_brown', 'david.brown@email.com', 'David', 'Brown', '+1-555-0105', '654 Maple Dr, Phoenix, AZ 85001'),
(1006, 'lisa_davis', 'lisa.davis@email.com', 'Lisa', 'Davis', '+1-555-0106', '987 Cedar Ln, Philadelphia, PA 19101'),
(1007, 'tom_miller', 'tom.miller@email.com', 'Tom', 'Miller', '+1-555-0107', '147 Birch Way, San Antonio, TX 78201');

-- Insert sample products
INSERT INTO products (name, category, price) VALUES
('iPhone 15 Pro', 'Electronics', 999.99),
('MacBook Pro M3', 'Electronics', 2499.00),
('AirPods Pro', 'Electronics', 249.99),
('Nike Air Max 270', 'Shoes', 150.00),
('Adidas Ultraboost 22', 'Shoes', 180.00),
('Levi''s 501 Jeans', 'Clothing', 89.99),
('Columbia Winter Jacket', 'Clothing', 199.99),
('The Great Gatsby', 'Books', 12.99),
('To Kill a Mockingbird', 'Books', 14.99),
('1984', 'Books', 13.99),
('Organic Coffee Beans', 'Food', 24.99),
('Premium Green Tea', 'Food', 18.99),
('Wireless Gaming Mouse', 'Electronics', 79.99),
('Mechanical Keyboard', 'Electronics', 129.99),
('Yoga Mat', 'Sports', 39.99),
('Dumbbell Set 20kg', 'Sports', 89.99),
('Stainless Steel Water Bottle', 'Home', 29.99),
('Cotton Bed Sheets', 'Home', 59.99),
('Essential Oil Diffuser', 'Home', 49.99),
('Bluetooth Speaker', 'Electronics', 99.99);

-- Insert sample orders
INSERT INTO orders (user_id, total_amount) VALUES
(1001, 1249.98),  -- Order 1: iPhone + AirPods
(1002, 2499.00),  -- Order 2: MacBook Pro
(1003, 330.00),   -- Order 3: Nike shoes + Adidas shoes
(1001, 102.98),   -- Order 4: Jeans + Book
(1004, 289.97),   -- Order 5: Winter jacket + Coffee + Tea
(1005, 209.98),   -- Order 6: Gaming mouse + Keyboard
(1002, 129.97),   -- Order 7: Yoga mat + Water bottle + Diffuser
(1006, 159.98),   -- Order 8: Dumbbell set + Bed sheets
(1003, 99.99),    -- Order 9: Bluetooth speaker
(1007, 41.97);    -- Order 10: Books bundle

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