-- This command maps this DB to an existing database if there is one. -- 
DROP DATABASE IF EXISTS bamazon_DB;

-- This command creates the database if it's a new one. --
CREATE database bamazon_DB;

-- This command allows you to work with this DB. -- 
USE bamazon_DB;

-- Creating the table for the Bamazon DB
CREATE TABLE products (
  item_id INT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);

-- This allows you to select data from this table --
SELECT * FROM products;

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (25, 'Orijen Dog Food 25lbs', 'Pets', 50.00, 10),
(14, 'Orijen Dog Food 25lbs', 'Pets', 50.00, 10),
(22, 'Orijen Cat Food 10lbs', 'Pets', 20.00, 10),
(15, 'Stone Wall Kitchen Balsamic Dressing', 'Food', 10.00, 10),
(18, 'Stone Wall Kitchen Ceaser Dressing', 'Food', 10.00, 10),
(29, 'Worlds Best Cat Litter 25lbs', 'Pets', 15.00, 10),
(34, 'TomToc Sleeve for MacBookPro', 'Computers', 40.00, 10),
(11, 'OWC Thunderbolt Cable', 'Computers', 20.00, 10),
(17, 'Port Max Surge Protector', 'Computers', 42.00, 10),
(35, 'Little Big MacBookPro Charger', 'Computers', 45.00, 10);
