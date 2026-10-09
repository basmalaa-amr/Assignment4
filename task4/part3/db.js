const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });

    //1
    await connection.execute(
        `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`
    );

    await connection.end();

    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    await pool.execute(`
        CREATE TABLE IF NOT EXISTS Suppliers (
            SupplierID INT AUTO_INCREMENT PRIMARY KEY,
            SupplierName VARCHAR(100) NOT NULL,
            ContactNumber TEXT NOT NULL
        )
    `);

    await pool.execute(`
        CREATE TABLE IF NOT EXISTS Products (
            ProductID INT AUTO_INCREMENT PRIMARY KEY,
            ProductName VARCHAR(100),
            Price DECIMAL(10,2) NOT NULL,
            StockQuantity INT NOT NULL,
            SupplierID INT,
            FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
        )
    `);

    await pool.execute(`
        CREATE TABLE IF NOT EXISTS Sales (
            SaleID INT AUTO_INCREMENT PRIMARY KEY,
            ProductID INT,
            QuantitySold INT NOT NULL,
            SaleDate DATE NOT NULL,
            FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
        )
    `);

    return pool;
}

module.exports = { initializeDatabase };