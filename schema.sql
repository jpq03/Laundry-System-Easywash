-- Easy Wash Database Schema
-- Designed for PostgreSQL

DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS promo_codes;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS service_types;
DROP TABLE IF EXISTS locations;

-- 1. Locations Table (Serviceable Areas)
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- 2. Service Types Table (Wash & Fold, Dry Clean, etc.)
CREATE TABLE service_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price_per_kg DECIMAL(10, 2) NOT NULL,
    description TEXT
);

-- 3. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    location_id INTEGER REFERENCES locations(id),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Orders Table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    service_type_id INTEGER REFERENCES service_types(id),
    weight_kg DECIMAL(10, 2),
    total_price DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'Pending', -- Pending, Picking Up, Washing, Drying, Out for Delivery, Completed
    pickup_date TIMESTAMP WITH TIME ZONE,
    delivery_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Staff Table
CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50), -- Washer, Rider, Manager
    phone VARCHAR(20),
    status VARCHAR(50) DEFAULT 'Available' -- Available, Out for Delivery, On Break
);

-- 6. Inventory Table
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    quantity DECIMAL(10, 2),
    unit VARCHAR(20), -- liters, kg, pcs
    last_restocked TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Promo Codes Table
CREATE TABLE promo_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percent INTEGER,
    expiry_date DATE,
    usage_limit INTEGER,
    is_active BOOLEAN DEFAULT TRUE
);

-- 8. Audit Logs Table
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES users(id),
    action TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data

-- Insert Locations
INSERT INTO locations (name) VALUES 
('Mandaue City'), 
('Lapu-Lapu City'),
('Cebu City');

-- Insert Service Types
INSERT INTO service_types (name, price_per_kg, description) VALUES 
('Wash & Fold', 35.00, 'Basic laundry service: washed, dried, and neatly folded.'),
('Wash & Iron', 55.00, 'Washed, dried, and professionally ironed.'),
('Dry Cleaning', 120.00, 'Special care for delicate fabrics.'),
('Premium Care', 80.00, 'Includes fabric softener and premium scent.');

-- Insert Users
INSERT INTO users (full_name, email, password_hash, phone, address, location_id, is_admin) VALUES 
('Joseph Quisido', 'joseph@example.com', 'hashed_pass_123', '09123456789', '123 Blue St, Banilad', 1, FALSE),
('System Admin', 'admin@easywash.com', 'Admin123!', '09000000000', 'Office HQ, Cebu City', 3, TRUE);

-- Insert Sample Orders
INSERT INTO orders (user_id, service_type_id, weight_kg, total_price, status) VALUES 
(1, 1, 5.5, 192.50, 'Washing'),
(1, 2, 3.0, 165.00, 'Completed');
